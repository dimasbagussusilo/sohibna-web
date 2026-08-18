// Localized Islamic-event content, keyed by the backend event `id` (slug).
//
// The backend seed (sohibna-api internal/seed/seed.go) stores event content in
// English only. To let the Calendar follow the app language WITHOUT a backend
// schema change, this module holds the Indonesian renderings and a category-label
// i18n key map. Callers pass the runtime `IslamicEvent` (from the catalog) plus
// the active `lang`; if a translation exists it wins, otherwise the backend's own
// field is the fallback — so events added to the backend later still render.
//
// Keep the `id` keys in sync with the backend `Key` values in seed.go.

import type { Lang, TranslationKey } from '@/i18n/types';
import type { EventCategory, IslamicEvent } from './islamicEvents';

type LocalizedEvent = {
  title: string;
  short: string;
  detail: string;
  rhythm?: string;
};

// Per-event, per-language overrides. English mirrors the backend seed (so the
// fallback path and this table agree); Indonesian and Arabic are the translation work.
const EVENT_I18N: Record<string, Partial<Record<Lang, LocalizedEvent>>> = {
  'new-year': {
    en: {
      title: 'Islamic New Year',
      short: '1 Muharram',
      detail: 'The first day of the new Islamic (Hijri) year — a moment for reflection and renewed intentions.',
    },
    id: {
      title: 'Tahun Baru Hijriyah',
      short: '1 Muharram',
      detail: 'Hari pertama tahun baru Islam (Hijriyah) — momen untuk merenung dan memperbarui niat.',
    },
    ar: {
      title: 'رأس السنة الهجرية',
      short: '1 محرّم',
      detail: 'أول أيام السنة الإسلامية (الهجرية) — وقت للتأمل وتجديد النية.',
    },
  },
  tasua: {
    en: {
      title: 'Tasu’a',
      short: '9 Muharram · sunnah fast',
      detail: 'Fasting the 9th of Muharram is recommended alongside the 10th (Ashura).',
    },
    id: {
      title: 'Tasu’a',
      short: '9 Muharram · puasa sunnah',
      detail: 'Berpuasa pada 9 Muharram dianjurkan bersama dengan 10 Muharram (Asyura).',
    },
    ar: {
      title: 'تاسوعاء',
      short: '9 محرّم · صيام سنّة',
      detail: 'صيام التاسع من محرّم مستحبّ مع العاشر (عاشوراء).',
    },
  },
  ashura: {
    en: {
      title: 'Day of Ashura',
      short: '10 Muharram · sunnah fast',
      detail:
        'The 10th of Muharram — the day Allah saved Musa ﷺ and his people. Fasting it expiates the sins of the past year.',
    },
    id: {
      title: 'Hari Asyura',
      short: '10 Muharram · puasa sunnah',
      detail:
        '10 Muharram — hari Allah menyelamatkan Musa ﷺ dan kaumnya. Berpuasa padanya menggugurkan dosa-dosa setahun yang lampau.',
    },
    ar: {
      title: 'يوم عاشوراء',
      short: '10 محرّم · صيام سنّة',
      detail:
        'العاشر من محرّم — اليوم الذي نجّى الله فيه موسى ﷺ وقومه. وصيامه يكفّر ذنوب السنة الماضية.',
    },
  },
  mawlid: {
    en: {
      title: 'Mawlid an-Nabi',
      short: '12 Rabi’ al-Awwal',
      detail: 'Commemorated by many as the birth month of the Prophet Muhammad ﷺ.',
    },
    id: {
      title: 'Maulid Nabi',
      short: '12 Rabi’ul Awwal',
      detail: 'Diperingati oleh banyak pihak sebagai bulan kelahiran Nabi Muhammad ﷺ.',
    },
    ar: {
      title: 'المولد النبوي',
      short: '12 ربيع الأول',
      detail: 'يُحتفي به عند كثيرين بوصفه شهر مولد النبي محمد ﷺ.',
    },
  },
  'isra-miraj': {
    en: {
      title: 'Isra & Mi’raj',
      short: '27 Rajab',
      detail: 'The night journey and ascension of the Prophet ﷺ.',
    },
    id: {
      title: 'Isra & Mi’raj',
      short: '27 Rajab',
      detail: 'Perjalanan malam dan naiknya Nabi ﷺ ke langit.',
    },
    ar: {
      title: 'الإسراء والمعراج',
      short: '27 رجب',
      detail: 'رحلة الإسراء والمعراج بالنبي ﷺ.',
    },
  },
  'nisf-shaban': {
    en: {
      title: 'Mid-Sha’ban (Lailatul Bara’ah)',
      short: '15 Sha’ban',
      detail: 'A night of forgiveness and mercy; many spend it in prayer and remembrance.',
    },
    id: {
      title: 'Pertengahan Sya’ban (Lailatul Bara’ah)',
      short: '15 Sya’ban',
      detail: 'Malam pengampunan dan rahmat; banyak yang menghabiskannya dengan salat dan zikir.',
    },
    ar: {
      title: 'منتصف شعبان (ليلة البراءة)',
      short: '15 شعبان',
      detail: 'ليلة مغفرة ورحمة؛ يقضيها كثيرون في الصلاة والذكر.',
    },
  },
  'ramadan-start': {
    en: {
      title: 'Start of Ramadan',
      short: '1 Ramadan',
      detail: 'The blessed month of fasting begins. Fasting every day of Ramadan is obligatory (fard).',
    },
    id: {
      title: 'Awal Ramadan',
      short: '1 Ramadan',
      detail: 'Bulan penuh berkah dimulai. Berpuasa setiap hari di Ramadan adalah wajib (fardhu).',
    },
    ar: {
      title: 'بداية رمضان',
      short: '1 رمضان',
      detail: 'يبدأ شهر الصيام المبارك. صيام كل يوم في رمضان واجب (فرض).',
    },
  },
  'ramadan-fast': {
    en: {
      title: 'Ramadan fast',
      short: 'Obligatory fast',
      detail: 'Fasting from dawn to sunset throughout Ramadan — one of the five pillars of Islam.',
      rhythm: 'Every day in Ramadan',
    },
    id: {
      title: 'Puasa Ramadan',
      short: 'Puasa wajib',
      detail: 'Berpuasa dari terbit fajar hingga terbenam matahari sepanjang Ramadan — salah satu dari lima rukun Islam.',
      rhythm: 'Setiap hari di Ramadan',
    },
    ar: {
      title: 'صيام رمضان',
      short: 'صيام واجب',
      detail: 'الصيام من الفجر إلى غروب الشمس طوال رمضان — أحد أركان الإسلام الخمسة.',
      rhythm: 'كل يوم في رمضان',
    },
  },
  'lailatul-qadr': {
    en: {
      title: 'Lailatul Qadr (observed)',
      short: '27 Ramadan',
      detail: 'The Night of Decree, better than a thousand months. Sought in the last ten odd nights of Ramadan.',
    },
    id: {
      title: 'Lailatul Qadr (yang diamati)',
      short: '27 Ramadan',
      detail: 'Malam Ketentuan, lebih baik daripada seribu bulan. Dicari pada sepuluh malam terakhir yang ganjil di Ramadan.',
    },
    ar: {
      title: 'ليلة القدر (المرجّاة)',
      short: '27 رمضان',
      detail: 'ليلة القدر، خير من ألف شهر. تُطلب في العشر الأواخر الوتر من رمضان.',
    },
  },
  'eid-fitr': {
    en: {
      title: 'Eid al-Fitr',
      short: '1 Shawwal · Eid Mubarak',
      detail: 'The festival marking the end of Ramadan. Fasting is forbidden on this day.',
    },
    id: {
      title: 'Idul Fitri',
      short: '1 Syawal · Selamat Hari Raya',
      detail: 'Hari raya penanda berakhirnya Ramadan. Berpuasa diharamkan pada hari ini.',
    },
    ar: {
      title: 'عيد الفطر',
      short: '1 شوّال · عيد مبارك',
      detail: 'العيد الذي يختتم رمضان. يحرم صيامه في هذا اليوم.',
    },
  },
  'shawwal-six': {
    en: {
      title: 'Six Days of Shawwal',
      short: '2–7 Shawwal · sunnah fast',
      detail: 'Fasting six days in Shawwal, together with Ramadan, is like fasting the entire year.',
    },
    id: {
      title: 'Puasa Enam Syawal',
      short: '2–7 Syawal · puasa sunnah',
      detail: 'Berpuasa enam hari di Syawal, bersama dengan Ramadan, pahalanya seperti berpuasa setahun penuh.',
    },
    ar: {
      title: 'صيام ست من شوال',
      short: '2–7 شوّال · صيام سنّة',
      detail: 'صيام ستة أيام من شوال مع رمضان يعدل صيام الدهر كله.',
    },
  },
  arafah: {
    en: {
      title: 'Day of Arafah',
      short: '9 Dhu al-Hijjah · sunnah fast',
      detail: 'For non-pilgrims, fasting the Day of Arafah expiates the sins of the past and coming year.',
    },
    id: {
      title: 'Hari Arafah',
      short: '9 Dzulhijjah · puasa sunnah',
      detail: 'Bagi yang tidak haji, berpuasa di Hari Arafah menggugurkan dosa tahun lalu dan tahun depan.',
    },
    ar: {
      title: 'يوم عرفة',
      short: '9 ذو الحجة · صيام سنّة',
      detail: 'لغير الحاج، صيام يوم عرفة يكفّر ذنوب السنة الماضية والقادمة.',
    },
  },
  'eid-adha': {
    en: {
      title: 'Eid al-Adha',
      short: '10 Dhu al-Hijjah · Eid Mubarak',
      detail: 'The festival of sacrifice. Fasting is forbidden on this day.',
    },
    id: {
      title: 'Idul Adha',
      short: '10 Dzulhijjah · Selamat Hari Raya',
      detail: 'Hari raya kurban. Berpuasa diharamkan pada hari ini.',
    },
    ar: {
      title: 'عيد الأضحى',
      short: '10 ذو الحجة · عيد مبارك',
      detail: 'عيد الأضحى. يحرم صيامه.',
    },
  },
  tashreeq: {
    en: {
      title: 'Ayyam at-Tashreeq',
      short: '11–13 Dhu al-Hijjah',
      detail: 'The days of Tashreeq. Fasting is forbidden on these days.',
    },
    id: {
      title: 'Hari-hari Tasyrik',
      short: '11–13 Dzulhijjah',
      detail: 'Hari-hari Tasyrik. Berpuasa diharamkan pada hari-hari ini.',
    },
    ar: {
      title: 'أيام التشريق',
      short: '11–13 ذو الحجة',
      detail: 'أيام التشريق. يحرم صيامها.',
    },
  },
  beedh: {
    en: {
      title: 'Ayyam al-Beedh',
      short: '13–15 each Hijri month · sunnah fast',
      detail: 'The “white days”: fasting the 13th, 14th and 15th of every Hijri month.',
      rhythm: '13, 14 & 15 of every Hijri month',
    },
    id: {
      title: 'Hari-hari Putih (Ayyamul Bidh)',
      short: '13–15 tiap bulan Hijriyah · puasa sunnah',
      detail: '“Hari-hari putih”: berpuasa pada tanggal 13, 14, dan 15 setiap bulan Hijriyah.',
      rhythm: '13, 14 & 15 tiap bulan Hijriyah',
    },
    ar: {
      title: 'أيام البيض',
      short: '13–15 من كل شهر هجري · صيام سنّة',
      detail: '«الأيام البيض»: صيام الثالث عشر والرابع عشر والخامس عشر من كل شهر هجري.',
      rhythm: '13 و14 و15 من كل شهر هجري',
    },
  },
  'mon-thu': {
    en: {
      title: 'Monday & Thursday fast',
      short: 'Weekly sunnah fast',
      detail: 'The Prophet ﷺ used to fast on Mondays and Thursdays — the days deeds are presented.',
      rhythm: 'Every Monday & Thursday',
    },
    id: {
      title: 'Puasa Senin & Kamis',
      short: 'Puasa sunnah mingguan',
      detail: 'Nabi ﷺ biasa berpuasa pada hari Senin dan Kamis — hari ketika amal-amal dihadapkan.',
      rhythm: 'Setiap Senin & Kamis',
    },
    ar: {
      title: 'صيام الاثنين والخميس',
      short: 'صيام سنّة أسبوعي',
      detail: 'كان النبي ﷺ يصوم الاثنين والخميس — اليومين تُعرض فيهما الأعمال.',
      rhythm: 'كل اثنين وخميس',
    },
  },
};

// Resolve one localized field, falling back to the catalog event's own value.
function pick(
  event: IslamicEvent,
  lang: Lang,
  field: 'title' | 'short' | 'detail' | 'rhythm',
): string {
  const loc = EVENT_I18N[event.id]?.[lang];
  if (loc) {
    const v = loc[field];
    if (v) return v;
  }
  // Fall back to the backend field (English), then to '' for optional rhythm.
  return (event[field] as string | undefined) ?? '';
}

/** Localized title for an event (always present). */
export const eventTitle = (e: IslamicEvent, lang: Lang): string => pick(e, lang, 'title');
/** Localized short label (e.g. "10 Muharram · puasa sunnah"). */
export const eventShort = (e: IslamicEvent, lang: Lang): string => pick(e, lang, 'short');
/** Localized long detail. */
export const eventDetail = (e: IslamicEvent, lang: Lang): string => pick(e, lang, 'detail');
/** Localized rhythm line for recurring fasts ('' if none). */
export const eventRhythm = (e: IslamicEvent, lang: Lang): string => pick(e, lang, 'rhythm');

// Category → dotted i18n key (under `calendar.category.*`). Keeps CATEGORY_META
// as the color source while the label travels through the active dictionary.
export const categoryLabelKey = (c: EventCategory): TranslationKey =>
  `calendar.category.${c}` as TranslationKey;
