// Pop-up announcement selection + "already seen" bookkeeping (shared by
// AnnouncementPopup; mirrored in sohibna/src/lib/announcements.ts — keep the
// two in lock-step).
//
// Frequency rules (per announcement, set in the DB row):
//   - 'daily': shows on EVERY page load until the user explicitly declines
//     (the soft "Mungkin Nanti" button) — that explicit close (or the CTA
//     tap) suppresses it for the rest of the current period. The period does NOT reset at
//     midnight: it resets 30 minutes before Dhuhr (prayer-anchored day), so
//     the key holds the epoch-ms anchor of the most recent (Dhuhr − 30 min)
//     instant for the user's location. Without coordinates the anchor falls
//     back to the calendar day. Backdrop/Escape closes are temporary — the
//     popup returns on the next load.
//   - 'once':  shown a single time per content version → key holds updated_at
//     (marked when DISPLAYED, not when dismissed — closing the tab without
//     tapping through must still count as shown), so editing the row (with
//     updated_at = NOW()) shows it once more.
//
// At most one announcement is shown per page load: the first entry (server
// order) that resolves content in some language and is not currently
// suppressed.
import type { AnnouncementContent, AnnouncementDTO } from '@/api'
import { API_BASE_URL } from '@/config'
import storage from '@/lib/storage'
import { computePrayerTimes } from '@/lib/prayer'

const DAILY_PREFIX = 'sohibna:ann:daily:'
const ONCE_PREFIX = 'sohibna:ann:once:'

// The daily period starts this many minutes before Dhuhr.
const DHUHR_RESET_OFFSET_MIN = 30
// Same keys the useLocation hook persists (manual coords win over the last
// auto fix — mirrors that hook's precedence).
const LOCATION_SETTINGS_KEY = 'sohibna:location_settings'
const LOCATION_CACHE_KEY = 'sohibna:last_location'

type Coords = { latitude: number; longitude: number }

// Announcement images may be absolute URLs (any host) or API-relative paths
// ("/branding/donation-banner.png") — relative paths resolve against this
// client's API base, so one DB row serves dev and prod builds alike.
export function resolveImageUrl(url: string): string {
  if (!url) return ''
  return /^https?:\/\//.test(url) ? url : API_BASE_URL + url
}

// Requested language → 'id' → first entry with a title. The DB content map is
// keyed by UI language code, so new languages need no client change.
export function resolveContent(
  a: AnnouncementDTO,
  lang: string,
): AnnouncementContent | null {
  const c = a.content ?? {}
  const fallback = c[lang] ?? c.id
  if (fallback && fallback.title) return fallback
  const first = Object.values(c).find((entry) => entry && entry.title)
  return first ?? null
}

// Best-effort coords for the period anchor: manual-mode coords if set, else
// the last auto fix. Never prompts, never fetches — offline-safe.
async function readCoords(): Promise<Coords | null> {
  try {
    const settingsRaw = await storage.getItem(LOCATION_SETTINGS_KEY)
    if (settingsRaw) {
      const s = JSON.parse(settingsRaw) as { mode?: string; manual?: Coords | null }
      if (s.mode === 'manual' && s.manual && typeof s.manual.latitude === 'number') {
        return s.manual
      }
    }
    const cacheRaw = await storage.getItem(LOCATION_CACHE_KEY)
    if (cacheRaw) {
      const c = JSON.parse(cacheRaw) as Coords
      if (typeof c.latitude === 'number' && typeof c.longitude === 'number') return c
    }
  } catch {
    /* fall through to calendar-day anchor */
  }
  return null
}

// Identity of the current daily period, as a comparable string. With coords:
// epoch ms of the most recent (Dhuhr − offset) — before today's Dhuhr − 30
// the current period is still yesterday's. Without coords: the local
// calendar day ('YYYY-MM-DD'), the natural fallback.
export function dailyAnchor(coords: Coords | null, now: Date = new Date()): string {
  if (!coords) return now.toLocaleDateString('en-CA')
  const offsetMs = DHUHR_RESET_OFFSET_MIN * 60_000
  const todayStart = computePrayerTimes(coords.latitude, coords.longitude, now).dhuhr.getTime() - offsetMs
  if (now.getTime() >= todayStart) return String(todayStart)
  const yesterday = computePrayerTimes(
    coords.latitude,
    coords.longitude,
    new Date(now.getTime() - 86_400_000),
  ).dhuhr
  return String(yesterday.getTime() - offsetMs)
}

async function isSeen(a: AnnouncementDTO, coords: Coords | null): Promise<boolean> {
  try {
    if (a.frequency === 'once') {
      return (await storage.getItem(ONCE_PREFIX + a.id)) === a.updated_at
    }
    const stored = await storage.getItem(DAILY_PREFIX + a.id)
    return stored !== null && stored === dailyAnchor(coords)
  } catch {
    // Storage failure → treat as unseen; a re-show is harmless.
    return false
  }
}

// "Mungkin Nanti" (explicit decline): suppresses a daily announcement until
// the next period (Dhuhr − 30 min). 'once' announcements are already marked at display —
// calling this for them is a harmless no-op we skip.
export async function markDailyClosed(a: AnnouncementDTO): Promise<void> {
  if (a.frequency !== 'daily') return
  try {
    await storage.setItem(DAILY_PREFIX + a.id, dailyAnchor(await readCoords()))
  } catch {
    /* best-effort — worst case the announcement shows again next load */
  }
}

// First announcement (in server order) with displayable content that this
// device has not seen under its frequency rule, or null. Reads the location
// caches itself so callers don't have to.
export async function pickAnnouncement(
  list: AnnouncementDTO[],
  lang: string,
): Promise<AnnouncementDTO | null> {
  // Empty table encodes as JSON null (Go nil slice) — treat it as [].
  const coords = await readCoords()
  for (const a of list ?? []) {
    if (!resolveContent(a, lang)) continue
    if (await isSeen(a, coords)) continue;
    if (a.frequency === 'once') {
      try {
        await storage.setItem(ONCE_PREFIX + a.id, a.updated_at)
      } catch {
        /* best-effort — worst case it shows once more */
      }
    }
    return a
  }
  return null
}
