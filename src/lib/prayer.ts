// adhan-js wrapper — prayer times + Qibla.
// Config (Indonesia default): MWL calculation method, Shafi'i madhhab.
// Switch method/madhhab in `calculationParams()` to change for other regions.
import * as adhan from 'adhan';

export type PrayerName = 'Fajr' | 'Sunrise' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';

export type PrayerTimes = {
  fajr: Date;
  sunrise: Date;
  dhuhr: Date;
  asr: Date;
  maghrib: Date;
  isha: Date;
};

// Indonesia / Kemenag (Kementerian Agama) angles: Fajr at 20°, Isha at 18°.
// The previous default (Muslim World League: 18.5°/17°) placed Fajr several
// minutes early vs. the schedules published by Kemenag / local mosques here,
// which is what made Fajr read as "not accurate". These angles match Kemenag's
// published Hisab criteria for Indonesia. Madhhab stays Shafi'i.
function calculationParams(): adhan.CalculationParameters {
  const p = adhan.CalculationMethod.Other();
  p.fajrAngle = 20;
  p.ishaAngle = 18;
  p.madhab = adhan.Madhab.Shafi;
  return p;
}

// The 5 obligatory prayers (Sunrise is a marker, not a prayer).
const PRAYER_ORDER: ReadonlyArray<[PrayerName, keyof PrayerTimes]> = [
  ['Fajr', 'fajr'],
  ['Dhuhr', 'dhuhr'],
  ['Asr', 'asr'],
  ['Maghrib', 'maghrib'],
  ['Isha', 'isha'],
];

export function computePrayerTimes(lat: number, lng: number, date: Date = new Date()): PrayerTimes {
  const coords = new adhan.Coordinates(lat, lng);
  const pt = new adhan.PrayerTimes(coords, date, calculationParams());
  return {
    fajr: pt.fajr,
    sunrise: pt.sunrise,
    dhuhr: pt.dhuhr,
    asr: pt.asr,
    maghrib: pt.maghrib,
    isha: pt.isha,
  };
}

// Qibla bearing in degrees from true North.
export function qiblaBearing(lat: number, lng: number): number {
  return adhan.Qibla(new adhan.Coordinates(lat, lng));
}

// Tomorrow's Fajr — used to roll the "next prayer" over once today's Isha has passed,
// so the banner always points at an upcoming prayer.
export function tomorrowFajr(lat: number, lng: number, now: Date = new Date()): Date {
  return computePrayerTimes(lat, lng, new Date(now.getTime() + 86_400_000)).fajr;
}

// The next prayer after `now` (null once Isha has passed).
export function nextPrayer(times: PrayerTimes, now: Date = new Date()): { name: PrayerName; time: Date } | null {
  const t = now.getTime();
  for (const [name, key] of PRAYER_ORDER) {
    if (times[key].getTime() > t) return { name, time: times[key] };
  }
  return null;
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Human-readable remaining time, e.g. "2h 14m" or "9m".
export function formatRemaining(target: Date, now: Date = new Date()): string {
  let mins = Math.max(0, Math.round((target.getTime() - now.getTime()) / 60000));
  const h = Math.floor(mins / 60);
  mins = mins % 60;
  return h > 0 ? `${h}h ${mins}m` : `${mins}m`;
}
