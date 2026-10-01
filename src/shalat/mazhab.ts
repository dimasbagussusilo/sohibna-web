import type { Bi, Mazhab, MazhabTopic } from '../types';

// ============================================================================
// Where each school is popular — shown as a subtitle in the Mazhab dropdown.
// ============================================================================

export const MAZHAB_INFO: Record<Mazhab, { regions: Bi }> = {
  shafii: {
    regions: {
      id: 'Populer di Indonesia, Asia Tenggara, Mesir & Afrika Timur. Mayoritas umat Indonesia bermazhab Syafi’i.',
      en: 'Popular in Indonesia, Southeast Asia, Egypt & the Horn of Africa. Most Indonesian Muslims follow Shafi’i.',
      ar: 'شائع في إندونيسيا وجنوب شرق آسيا ومصر والقرن الأفريقي. أكثر مسلمي إندونيسيا على مذهب الشافعية.',
    },
  },
  hanafi: {
    regions: {
      id: 'Paling banyak pengikut di dunia — Asia Selatan & Tengah, Turki, Levant.',
      en: 'Largest following worldwide — South & Central Asia, Turkey, the Levant.',
      ar: 'أكثر المذاهب أتباعًا في العالم — جنوب آسيا ووسطها وتركيا والشام.',
    },
  },
  maliki: {
    regions: {
      id: 'Populer di Afrika Utara & Barat (Maghreb, Nigeria, Senegal).',
      en: 'Popular in North & West Africa (Maghreb, Nigeria, Senegal).',
      ar: 'شائع في شمال أفريقيا وغربها (المغرب العربي ونيجيريا والسنغال).',
    },
  },
  hanbali: {
    regions: {
      id: 'Populer di Arab Saudi (Najd), Qatar, dan UEA.',
      en: 'Popular in Saudi Arabia (Najd), Qatar, and the UAE.',
      ar: 'شائع في السعودية (نجد) وقطر والإمارات.',
    },
  },
};


// ============================================================================
// Section 3 — Perbandingan Mazhab: side-by-side views on the points where the
// four schools differ. Complements (does not replace) the per-mazhab flow in
// the Wajib section. Positions summarised faithfully; confirm nuance with a
// trusted scholar before relying on any single view.
// ============================================================================

export const MAZHAB_TOPICS: MazhabTopic[] = [
  {
    id: 'm-basmalah',
    title: { id: 'Basmalah dalam Al-Fatihah', en: 'Basmalah in Al-Fatihah', ar: 'البسملة في الفاتحة' },
    summary: { id: 'Apakah بِسْمِ اللَّهِ dibaca keras, pelan, atau tidak dibaca?', en: 'Is بِسْمِ اللَّهِ recited aloud, silently, or not at all?', ar: 'هل تُقرأ بِسْمِ اللَّهِ جهرًا أم سرًّا أم لا تُقرأ؟' },
    views: {
      shafii: { id: 'Dibaca keras (jahr) pada shalat jahriyah; pelan pada sirriyah. Termasuk ayat Al-Fatihah.', en: 'Aloud (jahr) in audible prayers; silently in silent ones. Counted as part of Al-Fatihah.', ar: 'تُقرأ جهرًا في الجهرية وسرًّا في السرية، وهي آية من الفاتحة.' },
      hanafi: { id: 'Dibaca pelan (sirr) di setiap shalat, termasuk yang jahriyah.', en: 'Recited silently (sirr) in every prayer, including audible ones.', ar: 'تُقرأ سرًّا في كل الصلوات، بما فيها الجهرية.' },
      maliki: { id: 'Tidak dibaca dalam shalat fardu (menurut riwayat Imam Malik).', en: 'Not recited in obligatory prayer (per Imam Malik’s narration).', ar: 'لا تُقرأ في صلاة الفرض (على المشهور من رواية الإمام مالك).' },
      hanbali: { id: 'Dibaca keras (jahr) pada shalat jahriyah; pelan pada sirriyah.', en: 'Aloud (jahr) in audible prayers; silently in silent ones.', ar: 'تُقرأ جهرًا في الجهرية وسرًّا في السرية.' },
    },
  },
  {
    id: 'm-amin',
    title: { id: 'Mengucapkan Aamin', en: 'Saying Ameen', ar: 'قول آمين' },
    views: {
      shafii: { id: 'Keras (jahr) pada shalat jahriyah.', en: 'Aloud (jahr) in audible prayers.', ar: 'جهرًا في الصلوات الجهرية.' },
      hanafi: { id: 'Pelan (sirr).', en: 'Silently (sirr).', ar: 'سرًّا.' },
      maliki: { id: 'Pelan (sirr).', en: 'Silently (sirr).', ar: 'سرًّا.' },
      hanbali: { id: 'Keras (jahr) pada shalat jahriyah.', en: 'Aloud (jahr) in audible prayers.', ar: 'جهرًا في الصلوات الجهرية.' },
    },
  },
  {
    id: 'm-qunut',
    title: { id: 'Qunut pada Subuh', en: 'Qunut in Fajr', ar: 'القنوت في الفجر' },
    views: {
      shafii: { id: 'Sunnah — pada i’tidal rakaat kedua Subuh.', en: 'Sunnah — at i’tidal of the second rakaat of Fajr.', ar: 'سنة — في اعتدال الركعة الثانية من الفجر.' },
      hanafi: { id: 'Tidak ada. Qunut hanya dalam shalat Witir.', en: 'None. Qunut is only in Witr prayer.', ar: 'لا قنوت؛ إنما القنوت في صلاة الوتر.' },
      maliki: { id: 'Sunnah — dibaca setelah ruku’ pada rakaat terakhir Subuh.', en: 'Sunnah — recited after ruku’ in the last rakaat of Fajr.', ar: 'سنة — يُقرأ بعد الرفع من الركوع في الركعة الأخيرة من الفجر.' },
      hanbali: { id: 'Tidak ada, kecuali dalam keadaan khusus (nazilah).', en: 'None, except in special circumstances (nazilah).', ar: 'لا قنوت إلا في أحوال خاصة (النازلة).' },
    },
  },
  {
    id: 'm-tangan',
    title: { id: 'Posisi tangan setelah takbir', en: 'Hand position after takbir', ar: 'وضع اليدين بعد التكبير' },
    views: {
      shafii: { id: 'Sedekap (qabd) di atas dada.', en: 'Folded (qabd) on the chest.', ar: 'قبض فوق الصدر.' },
      hanafi: { id: 'Sedekap (qabd) di bawah pusar.', en: 'Folded (qabd) below the navel.', ar: 'قبض تحت السرّة.' },
      maliki: { id: 'Dilepas (sadl) — tangan menggantung di samping.', en: 'Released (sadl) — hands at the sides.', ar: 'سدل — إرسال اليدين على الجانبين.' },
      hanbali: { id: 'Sedekap (qabd) di atas dada.', en: 'Folded (qabd) on the chest.', ar: 'قبض فوق الصدر.' },
    },
  },
  {
    id: 'm-duduk',
    title: { id: 'Postur duduk', en: 'Sitting posture', ar: 'هيئة الجلوس' },
    summary: { id: 'Iftirash vs tawarruk.', en: 'Iftirash vs tawarruk.', ar: 'افتراش أم تورّك.' },
    views: {
      shafii: { id: 'Iftirash untuk duduk antara sujud & tasyahhud awal; tawarruk untuk tasyahhud akhir.', en: 'Iftirash between prostrations & first tashahhud; tawarruk for the final tashahhud.', ar: 'افتراش بين السجدتين وفي التشهد الأول، وتورّك في التشهد الأخير.' },
      hanafi: { id: 'Tawarruk pada tasyahhud akhir.', en: 'Tawarruk in the final tashahhud.', ar: 'تورّك في التشهد الأخير.' },
      maliki: { id: 'Tawarruk untuk semua posisi duduk.', en: 'Tawarruk for all sittings.', ar: 'تورّك في جميع الجلسات.' },
      hanbali: { id: 'Iftirash untuk semua posisi duduk.', en: 'Iftirash for all sittings.', ar: 'افتراش في جميع الجلسات.' },
    },
  },
  {
    id: 'm-jari',
    title: { id: 'Jari telunjuk dalam tasyahhud', en: 'Index finger in tashahhud', ar: 'السبابة في التشهد' },
    views: {
      shafii: { id: 'Diangkat & digerakkan saat “illallaah”.', en: 'Raised & moved at “illallah”.', ar: 'تُرفع وتُحرَّك عند «إلا الله».' },
      hanafi: { id: 'Diangkat saat “asyhadu allaa”, diturunkan saat “illallaah”; tidak digerakkan.', en: 'Raised at “asyhadu allaa”, lowered at “illallah”; not moved.', ar: 'تُرفع عند «أشهد أن لا» وتُخفض عند «إلا الله» دون تحريك.' },
      maliki: { id: 'Digerakkan terus-menerus ke kanan-kiri.', en: 'Moved continuously side to side.', ar: 'تُحرَّك يمينًا ويسارًا باستمرار.' },
      hanbali: { id: 'Diangkat & ditunjuk; tidak digerakkan.', en: 'Raised & pointed; not moved.', ar: 'تُرفع ويُشار إليها دون تحريك.' },
    },
  },
  {
    id: 'm-surat',
    title: { id: 'Surat setelah Al-Fatihah', en: 'A surah after Al-Fatihah', ar: 'السورة بعد الفاتحة' },
    views: {
      shafii: { id: 'Sunnah (dianjurkan).', en: 'Sunnah (recommended).', ar: 'سنة (مستحبة).' },
      hanafi: { id: 'Wajib (fardhu ‘ain dalam tiap rakaat).', en: 'Wajib (obligatory in each rakaat).', ar: 'واجبة (فرض عين في كل ركعة).' },
      maliki: { id: 'Sunnah.', en: 'Sunnah.', ar: 'سنة.' },
      hanbali: { id: 'Tidak wajib; dianjurkan.', en: 'Not obligatory; recommended.', ar: 'ليست واجبة، وهي مستحبة.' },
    },
  },
];
