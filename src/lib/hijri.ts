// Hijri (Islamic, Umm al-Qura) calendar support — dependency-free.
//
// Why a table? React Native / Hermes does not ship full ICU, so
// `Intl.DateTimeFormat('…-u-ca-islamic-umalqura')` is unreliable on-device. The Umm
// al-Qura calendar is fixed, published data, so we embed an exact month-length table
// (generated from Node's authoritative ICU) and convert Gregorian→Hijri by walking it.
//
// The table below was generated from ICU `islamic-umalqura` and verified to be a 100%
// exact match for the Gregorian window ~2010–2049 (Hijri 1430–1470). Outside that range
// `gregorianToHijri` returns null and callers should render a muted placeholder.

export type HijriDate = { year: number; month: number /* 1-12 */; day: number /* 1-30 */ };

export const HIJRI_MONTHS = [
  'Muharram',
  'Safar',
  "Rabi' al-Awwal",
  "Rabi' al-Thani",
  'Jumada al-Awwal',
  'Jumada al-Thani',
  'Rajab',
  "Sha'ban",
  'Ramadan',
  'Shawwal',
  "Dhu al-Qa'dah",
  'Dhu al-Hijjah',
] as const;

// Fallback Gregorian labels (English short forms) used when a caller doesn't
// pass localized arrays. Callers that want localized output pass the arrays
// from the active i18n dictionary (see src/context/I18nContext.tsx `dict.lists`).
const GREG_MONTHS_FALLBACK = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const GREG_WEEKDAYS_FALLBACK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// 1 Muharram 1430 AH == Julian Day Number 2454830 (Gregorian 2008-12-29).
const ANCHOR_JDN = 2454830;
const START_HY = 1430;

// One char per Hijri month, Muharram 1430 → Dhu al-Hijjah 1470 (492 months).
// '1' = 30-day month, '0' = 29-day month. Exact Umm al-Qura (verified vs ICU).
const MONTH_BITS =
  '011001010101011010101001011101010100101101101010010101101100101010101101010101010101101100101001101110010010101110101001010111010100101011011010010101011010101010101011010110010101011101001001011101100100101110101010010110110101001010110110101001010110111001001101101100100101101101010010101101101010010110101101001010101110100100101111010010010111011001001011011010100101011010101100101011010110010101011101010010011101101001001101110100010110110110010101010110101010010110110101001011011010';

// Cumulative day-offset at the start of each month (length = MONTH_BITS.length + 1).
// Built once at module load; the converter binary-searches it.
const CUM: number[] = (() => {
  const acc = [0];
  for (let i = 0; i < MONTH_BITS.length; i++) {
    acc.push(acc[i] + (MONTH_BITS[i] === '1' ? 30 : 29));
  }
  return acc;
})();

/** Julian Day Number for a Gregorian `Date` (local civil date → integer JDN). */
function gregToJDN(date: Date): number {
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  const d = date.getDate();
  if (m < 3) {
    y -= 1;
    m += 12;
  }
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + b - 1524;
}

/**
 * Convert a Gregorian date to the Umm al-Qura Hijri date, or null when the date falls
 * outside the embedded 1430–1470 AH table (~Gregorian 2008–2049).
 */
export function gregorianToHijri(date: Date): HijriDate | null {
  const delta = gregToJDN(date) - ANCHOR_JDN;
  const total = CUM[CUM.length - 1];
  if (delta < 0 || delta >= total) return null;
  // Largest month index whose cumulative offset is <= delta.
  let lo = 0;
  let hi = CUM.length - 1;
  let idx = 0;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (CUM[mid] <= delta) {
      idx = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  const day = delta - CUM[idx] + 1;
  const year = START_HY + Math.floor(idx / 12);
  const month = (idx % 12) + 1;
  return { year, month, day };
}

/** "10 Muharram 1448 AH", or "—" when out of the table's range. */
export function formatHijri(date: Date): string {
  const h = gregorianToHijri(date);
  if (!h) return '—';
  return `${h.day} ${HIJRI_MONTHS[h.month - 1]} ${h.year} AH`;
}

/**
 * "Wed, 25 Jun 2026" — hand-rolled so it never depends on Hermes Intl support.
 * Pass localized `weekdays` (short, 7 entries Sun-first) and `months` (short,
 * 12 entries) from the active i18n dictionary; defaults to English short forms.
 */
export function formatGregorian(
  date: Date,
  weekdays: readonly string[] = GREG_WEEKDAYS_FALLBACK,
  months: readonly string[] = GREG_MONTHS_FALLBACK,
): string {
  return `${weekdays[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}
