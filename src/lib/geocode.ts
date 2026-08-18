// Reverse geocoding: lat/long → a human-readable place name.
//
// Used wherever the prayer/adzan UI previously showed raw coordinates, so the
// user sees "Jakarta, Indonesia" instead of "-6.21, 106.85".
//
// Uses BigDataCloud's free client-side reverse-geocode endpoint — no API key,
// no backend, works over plain HTTPS, and it accepts a `localityLanguage` param
// so the returned name follows the app's UI language (including Arabic). Falls
// back to a formatted coordinate string if the network call fails (prayer times
// themselves never depend on this — they keep working offline from raw coords).
import type { Lang } from '@/i18n/types';

export type PlaceName = {
  /** Best-effort single-line label, e.g. "Jakarta, Indonesia". */
  label: string;
  city?: string;
  region?: string;
  country?: string;
};

/** Format coords as a compact fallback label when geocoding is unavailable. */
export function formatCoords(lat: number, lng: number): string {
  return `${lat.toFixed(2)}, ${lng.toFixed(2)}`;
}

type BDCResponse = {
  city?: string | null;
  locality?: string | null;
  principalSubdivision?: string | null;
  countryName?: string | null;
};

export async function reverseGeocode(
  lat: number,
  lng: number,
  lang: Lang = 'id',
): Promise<PlaceName> {
  const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=${lang}`;
  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`geocode ${res.status}`);
    const d = (await res.json()) as BDCResponse;
    const city = d.city || d.locality || undefined;
    const region = d.principalSubdivision || undefined;
    const country = d.countryName || undefined;

    // Prefer "city, country"; fall back to region; then to coords.
    const parts: string[] = [];
    if (city) parts.push(city);
    else if (region) parts.push(region);
    if (country && parts.length) parts.push(country);
    const label = parts.length ? parts.join(', ') : formatCoords(lat, lng);

    return { label, city, region, country };
  } catch {
    return { label: formatCoords(lat, lng) };
  }
}
