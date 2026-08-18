// Islamic event + fast resolver. The catalog (content) comes from the backend
// (GET /events); this module holds only the scheduling *logic* that decides which
// catalog entries apply to a given Gregorian day, using the client-side Hijri
// conversion (./hijri). Keeping the logic client-side lets the calendar render fully
// offline once the catalog is cached, and keeps the backend free of calendar math.
import AsyncStorage from '@/lib/storage';
import { gregorianToHijri } from './hijri';
import { fetchEvents, type EventCategory, type EventTrigger, type IslamicEventDTO } from '@/api';

export type { EventCategory, EventTrigger };

export type IslamicEvent = {
  id: string; // = backend key (slug)
  title: string;
  category: EventCategory;
  short: string;
  detail: string;
  rhythm?: string;
  recurring: boolean;
  trigger: EventTrigger;
};

export const CATEGORY_META: Record<EventCategory, { label: string; color: string }> = {
  'wajib-fast': { label: 'Obligatory fast', color: '#D4AF37' },
  'sunnah-fast': { label: 'Sunnah fast', color: '#8FBC8F' },
  event: { label: 'Event', color: '#3b82f6' },
  night: { label: 'Night of virtue', color: '#7A9D7A' },
  'forbidden-fast': { label: 'No fasting', color: '#f87171' },
};

/** Categories that represent a fast the user can mark as done. */
export function isFastCategory(c: EventCategory): boolean {
  return c === 'wajib-fast' || c === 'sunnah-fast';
}

// Display priority for the cell's primary dot (highest wins). Eid/forbidden wins so it is
// never mistaken for a fast day.
const PRIORITY: Record<EventCategory, number> = {
  'forbidden-fast': 4,
  'wajib-fast': 3,
  'sunnah-fast': 2,
  night: 1,
  event: 0,
};

// Does a single catalog entry apply to the given Gregorian day?
function matches(e: IslamicEvent, date: Date): boolean {
  const hijri = gregorianToHijri(date);
  const wd = date.getDay(); // 0 Sun … 6 Sat
  const t = e.trigger;
  switch (t.type) {
    case 'hijri':
      return !!hijri && hijri.day === t.day && hijri.month === t.month;
    case 'hijri_range':
      return (
        !!hijri &&
        t.month === hijri.month &&
        hijri.day >= (t.from ?? 0) &&
        hijri.day <= (t.to ?? 0)
      );
    case 'ramadhan':
      return !!hijri && hijri.month === 9; // month 9 = Ramadan
    case 'beedh':
      return !!hijri && hijri.day >= 13 && hijri.day <= 15;
    case 'weekly':
      return !!t.weekdays && t.weekdays.includes(wd);
    default:
      return false;
  }
}

/** Every event/fast that applies to the given Gregorian day (may be empty). */
export function eventsForDate(catalog: IslamicEvent[], date: Date): IslamicEvent[] {
  return catalog.filter((e) => matches(e, date));
}

/** Only the trackable fasts (obligatory + sunnah) for the day. */
export function fastsForDate(catalog: IslamicEvent[], date: Date): IslamicEvent[] {
  return eventsForDate(catalog, date).filter((e) => isFastCategory(e.category));
}

/** Distinct categories on a day, in priority order (for the cell dots). */
export function categoriesForDate(catalog: IslamicEvent[], date: Date): EventCategory[] {
  const cats = new Set(eventsForDate(catalog, date).map((e) => e.category));
  return (Object.keys(PRIORITY) as EventCategory[])
    .filter((c) => cats.has(c))
    .sort((a, b) => PRIORITY[b] - PRIORITY[a]);
}

/** Highest-priority category on the day, or null — the cell's primary color. */
export function primaryCategory(catalog: IslamicEvent[], date: Date): EventCategory | null {
  const cats = categoriesForDate(catalog, date);
  return cats.length ? cats[0] : null;
}

/** Days (from `from`, inclusive) that carry at least one event, within `days`. */
export function upcomingEvents(
  catalog: IslamicEvent[],
  from: Date,
  days: number,
  limit = 40
): { date: Date; events: IslamicEvent[] }[] {
  const out: { date: Date; events: IslamicEvent[] }[] = [];
  for (let i = 0; i < days && out.length < limit; i++) {
    const d = new Date(from.getFullYear(), from.getMonth(), from.getDate() + i);
    const evs = eventsForDate(catalog, d);
    if (evs.length) out.push({ date: d, events: evs });
  }
  return out;
}

/** Rhythm-based (recurring) fasts from the catalog — grouped separately from dated occasions. */
export function recurringEvents(catalog: IslamicEvent[]): IslamicEvent[] {
  return catalog.filter((e) => e.recurring);
}

/** Next date (inclusive of `from`) on which the given event occurs, or null if not soon. */
export function nextOccurrence(
  catalog: IslamicEvent[],
  eventId: string,
  from: Date,
  maxDays = 400
): Date | null {
  const target = catalog.find((e) => e.id === eventId);
  if (!target) return null;
  for (let i = 0; i < maxDays; i++) {
    const d = new Date(from.getFullYear(), from.getMonth(), from.getDate() + i);
    if (matches(target, d)) return d;
  }
  return null;
}

// --- Catalog loading (backend + AsyncStorage cache) ---

const CACHE_KEY = 'events:catalog';

// Map a backend DTO to the runtime event shape. `id` is the stable key (slug) so the
// resolver/React keys stay stable across reloads. Drops malformed entries defensively.
function toEvent(dto: IslamicEventDTO): IslamicEvent | null {
  if (!dto.key || !dto.trigger || !dto.trigger.type) return null;
  return {
    id: dto.key,
    title: dto.title,
    category: dto.category,
    short: dto.short,
    detail: dto.detail,
    rhythm: dto.rhythm,
    recurring: dto.recurring,
    trigger: dto.trigger,
  };
}

/**
 * Load the Islamic event catalog: fetch from the backend, cache to AsyncStorage on
 * success, and fall back to the cache on network failure. Throws only when neither is
 * available — the screen then shows a retry state. The calendar grid (Hijri/Gregorian)
 * still renders without a catalog; only the event overlays are affected.
 */
export async function loadEventCatalog(): Promise<IslamicEvent[]> {
  try {
    const dtos = await fetchEvents();
    const events = dtos.map(toEvent).filter((e): e is IslamicEvent => e !== null);
    if (events.length) {
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(events)).catch(() => {
        /* caching is best-effort */
      });
    }
    return events;
  } catch (err) {
    const cached = await AsyncStorage.getItem(CACHE_KEY).catch(() => null);
    if (cached) {
      try {
        return JSON.parse(cached) as IslamicEvent[];
      } catch {
        /* fall through to rethrow */
      }
    }
    throw err;
  }
}
