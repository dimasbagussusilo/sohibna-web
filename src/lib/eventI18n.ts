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
    tr: {
      title: 'Hicri Yılbaşı',
      short: '1 Muharrem',
      detail: 'İslami (Hicri) yeni yılın ilk günü — tefekkür ve niyetleri yenileme anı.',
    },
    ur: {
      title: 'اسلامی نیا سال',
      short: '1 محرم',
      detail: 'نئے اسلامی (ہجری) سال کا پہلا دن — غور و فکر اور نیتوں کی تجدید کا موقع۔',
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
    tr: {
      title: "Tasu'a",
      short: '9 Muharrem · sünnet oruç',
      detail: "Muharrem'in 9. gününü oruçlu geçirmek, 10. gün (Aşure) ile birlikte müstahabdır.",
    },
    ur: {
      title: 'تسوعہ',
      short: '9 محرم · سنت روزہ',
      detail: '9 محرم کا روزہ 10 محرم (عاشورہ) کے ساتھ مستحسن ہے۔',
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
    tr: {
      title: 'Aşure Günü',
      short: '10 Muharrem · sünnet oruç',
      detail:
        "Muharrem'in 10. günü — Allah'ın Musa ﷺ ve kavmini kurtardığı gündür. Bu günü oruçlu geçirmek, geçmiş bir yılın günahlarına kefaret olur.",
    },
    ur: {
      title: 'یومِ عاشورہ',
      short: '10 محرم · سنت روزہ',
      detail: '10 محرم — وہ دن جب اللہ نے موسیٰ ﷺ اور ان کی قوم کو نجات دی۔ اس کا روزہ گزشتہ سال کے گناہوں کا کفارہ ہے۔',
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
    tr: {
      title: 'Mevlid Kandili',
      short: '12 Rebiülevvel',
      detail: "Peygamber Muhammed ﷺ'ın doğum ayı olarak birçokları tarafından anılır.",
    },
    ur: {
      title: 'میلادالنبی',
      short: '12 ربیع الاول',
      detail: 'بہت سے لوگ اسے نبی محمد ﷺ کی ولادت کا مہینہ سمجھ کر مناتے ہیں۔',
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
    tr: {
      title: 'Miraç Kandili',
      short: '27 Recep',
      detail: "Peygamberimiz ﷺ'ın gece yolculuğu ve göğe yükselişi.",
    },
    ur: {
      title: 'اسراء و معراج',
      short: '27 رجب',
      detail: 'نبی ﷺ کا شبِ سفر اور آسمانوں کی جانب معراج۔',
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
    tr: {
      title: 'Berat Kandili',
      short: '15 Şaban',
      detail: 'Mağfiret ve rahmet gecesi; birçokları bu geceyi namaz ve zikirle ihya eder.',
    },
    ur: {
      title: 'نصف شعبان (لیلۃالبراءۃ)',
      short: '15 شعبان',
      detail: 'مغفرت اور رحمت کی رات؛ بہت سے لوگ اسے نماز اور ذکر میں گزارتے ہیں۔',
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
    tr: {
      title: "Ramazan'ın Başlangıcı",
      short: '1 Ramazan',
      detail: "Mübarek oruç ayı başlar. Ramazan'ın her gününü oruçlu geçirmek farzdır.",
    },
    ur: {
      title: 'رمضان کا آغاز',
      short: '1 رمضان',
      detail: 'مبارک مہینۂ روزے کا آغاز ہوتا ہے۔ رمضان کا ہر دن روزہ رکھنا فرض ہے۔',
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
    tr: {
      title: 'Ramazan Orucu',
      short: 'Farz oruç',
      detail: "Ramazan boyunca şafaktan gün batımına kadar oruç tutmak — İslam'ın beş şartından biridir.",
      rhythm: "Ramazan'ın her günü",
    },
    ur: {
      title: 'رمضان کا روزہ',
      short: 'فرض روزہ',
      detail: 'رمضان بھر فجر سے غروبِ آفتاب تک روزہ رکھنا — اسلام کے پانچ ارکان میں سے ایک۔',
      rhythm: 'رمضان کا ہر دن',
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
    tr: {
      title: 'Kadir Gecesi (kabul edilen tarih)',
      short: '27 Ramazan',
      detail: "Kadir Gecesi, bin aydan hayırlıdır. Ramazan'ın son on gününün tek gecelerinde aranır.",
    },
    ur: {
      title: 'شبِ قدر (متعین تاریخ)',
      short: '27 رمضان',
      detail: 'شبِ قدر — ہزار مہینوں سے بہتر۔ رمضان کے آخری دس دن کی طاق راتوں میں تلاش کی جاتی ہے۔',
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
    tr: {
      title: 'Ramazan Bayramı',
      short: '1 Şevval · Bayramınız mübarek olsun',
      detail: "Ramazan'ın sonunu işaretleyen bayram. Bu günde oruç tutmak haramdır.",
    },
    ur: {
      title: 'عیدالفطر',
      short: '1 شوال · عید مبارک',
      detail: 'رمضان کے اختتام کی عید۔ اس دن روزہ رکھنا حرام ہے۔',
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
    tr: {
      title: "Şevval'de Altı Gün Orucu",
      short: '2–7 Şevval · sünnet oruç',
      detail: "Şevval'de altı gün oruç tutmak, Ramazan ile birlikte tüm bir yıl oruç tutmak gibidir.",
    },
    ur: {
      title: 'شوال کے چھ روزے',
      short: '2–7 شوال · سنت روزہ',
      detail: 'شوال میں چھ روزے رکھنا، رمضان کے ساتھ مل کر، گویا پورا سال روزہ رکھ لینے کے مثل ہے۔',
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
    tr: {
      title: 'Arefe Günü',
      short: '9 Zilhicce · sünnet oruç',
      detail: 'Hacca gitmeyenler için Arefe Günü orucu, geçmiş ve gelecek yılın günahlarına kefaret olur.',
    },
    ur: {
      title: 'یومِ عرفہ',
      short: '9 ذوالحجہ · سنت روزہ',
      detail: 'حاجیوں کے سوا دوسروں کے لیے یومِ عرفہ کا روزہ گزشتہ اور آنے والے سال کے گناہوں کا کفارہ ہے۔',
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
    tr: {
      title: 'Kurban Bayramı',
      short: '10 Zilhicce · Bayramınız mübarek olsun',
      detail: 'Kurban bayramıdır. Bu günde oruç tutmak haramdır.',
    },
    ur: {
      title: 'عیدالاضحیٰ',
      short: '10 ذوالحجہ · عید مبارک',
      detail: 'قربانی کی عید۔ اس دن روزہ رکھنا حرام ہے۔',
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
    tr: {
      title: 'Teşrik Günleri',
      short: '11–13 Zilhicce',
      detail: 'Teşrik günleridir. Bu günlerde oruç tutmak haramdır.',
    },
    ur: {
      title: 'ایامِ تشریق',
      short: '11–13 ذوالحجہ',
      detail: 'تشریق کے دن۔ ان دنوں روزہ رکھنا حرام ہے۔',
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
    tr: {
      title: 'Beyaz Günler (Eyyâm-ı Bîz)',
      short: "Her hicri ayın 13–15'i · sünnet oruç",
      detail: '"Beyaz günler": her hicri ayın 13, 14 ve 15. günlerinde oruç tutmaktır.',
      rhythm: "Her hicri ayın 13, 14 ve 15'i",
    },
    ur: {
      title: 'ایامِ بیض (سفید دن)',
      short: '13–15 ہر ہجری مہینہ · سنت روزہ',
      detail: '"سفید دن": ہر ہجری مہینے کی 13، 14 اور 15 تاریخ کو روزہ رکھنا۔',
      rhythm: 'ہر ہجری مہینے کی 13، 14 اور 15',
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
    tr: {
      title: 'Pazartesi & Perşembe Orucu',
      short: 'Haftalık sünnet oruç',
      detail: 'Peygamber ﷺ Pazartesi ve Perşembe günleri oruç tutardı — amellerin arz edildiği günler.',
      rhythm: 'Her Pazartesi & Perşembe',
    },
    ur: {
      title: 'سوموار اور جمعرات کا روزہ',
      short: 'ہفتہ وار سنت روزہ',
      detail: 'نبی ﷺ سوموار اور جمعرات کو روزہ رکھتے تھے — یہ وہ دن ہیں جب اعمال پیش کیے جاتے ہیں۔',
      rhythm: 'ہر سوموار اور جمعرات',
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
