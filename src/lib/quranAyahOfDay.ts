// Ayah of the day — the Quran tab's "Daily Recitation" banner.
//
// We keep only a CURATED LIST OF VERSE KEYS (famous / uplifting verses) here;
// the actual Arabic + EN/ID text is fetched from the Quran API on demand and
// disk-cached (so a seen verse shows offline). This avoids hardcoding
// translations: text always comes from the same Saheeh (20) / Kemenag (33)
// sources as the reader.
//
// `getAyahOfDayKey(date)` is deterministic per calendar day (stable for the day);
// `randomAyahKey(exclude?)` powers the shuffle button.

// A curated set of well-known verses (surah:verse). Short, widely loved ayat.
const KEYS: string[] = [
  '1:2', '1:5', '1:6', '1:7',
  '2:152', '2:153', '2:186', '2:286', '2:255',
  '3:8', '3:26', '3:139', '3:159',
  '4:36', '6:162', '7:23', '7:56',
  '10:57', '13:28', '14:7', '16:97',
  '17:80', '20:25', '24:35', '24:55',
  '29:69', '33:35', '39:53', '40:60',
  '41:30', '55:13', '57:3', '58:22',
  '65:3', '65:7', '93:5', '94:5', '94:6',
  '108:1', '112:1',
];

// day-of-year (1..366) so the pick is stable for the calendar day and rotates.
function dayOfYear(d: Date): number {
  const start = Date.UTC(d.getUTCFullYear(), 0, 0);
  const diff = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  return Math.floor((diff - start) / 86_400_000);
}

export function getAyahOfDayKey(date: Date = new Date()): string {
  return KEYS[dayOfYear(date) % KEYS.length];
}

// A different key than `exclude` (used by the shuffle button). Deterministic per
// call index isn't required — just "not the current one".
export function randomAyahKey(exclude?: string): string {
  if (KEYS.length <= 1) return KEYS[0];
  // Avoid Math.random-style drift: pick by Date.now() ticks for variety.
  let k = KEYS[Math.floor((Date.now() / 1000) % KEYS.length)];
  let guard = 0;
  while (k === exclude && guard++ < 8) {
    k = KEYS[(KEYS.indexOf(k) + 1) % KEYS.length];
  }
  return k;
}
