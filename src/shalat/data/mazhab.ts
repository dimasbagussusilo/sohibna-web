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
      tr: 'Endonezya, Güneydoğu Asya, Mısır ve Afrika Boynuzu’nda yaygındır. Endonezyalı Müslümanların çoğu Şafii mezhebindedir.',
    },
  },
  hanafi: {
    regions: {
      id: 'Paling banyak pengikut di dunia — Asia Selatan & Tengah, Turki, Levant.',
      en: 'Largest following worldwide — South & Central Asia, Turkey, the Levant.',
      ar: 'أكثر المذاهب أتباعًا في العالم — جنوب آسيا ووسطها وتركيا والشام.',
      tr: 'Dünyada en çok taraftarı olan mezhep — Güney ve Orta Asya, Türkiye, Levant.',
    },
  },
  maliki: {
    regions: {
      id: 'Populer di Afrika Utara & Barat (Maghreb, Nigeria, Senegal).',
      en: 'Popular in North & West Africa (Maghreb, Nigeria, Senegal).',
      ar: 'شائع في شمال أفريقيا وغربها (المغرب العربي ونيجيريا والسنغال).',
      tr: 'Kuzey ve Batı Afrika’da yaygındır (Mağrip, Nijerya, Senegal).',
    },
  },
  hanbali: {
    regions: {
      id: 'Populer di Arab Saudi (Najd), Qatar, dan UEA.',
      en: 'Popular in Saudi Arabia (Najd), Qatar, and the UAE.',
      ar: 'شائع في السعودية (نجد) وقطر والإمارات.',
      tr: 'Suudi Arabistan’da (Necd), Katar ve BAE’de yaygındır.',
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
    title: { id: 'Basmalah dalam Al-Fatihah', en: 'Basmalah in Al-Fatihah', ar: 'البسملة في الفاتحة', tr: 'Fatiha’da Besmele' },
    summary: { id: 'Apakah بِسْمِ اللَّهِ dibaca keras, pelan, atau tidak dibaca?', en: 'Is بِسْمِ اللَّهِ recited aloud, silently, or not at all?', ar: 'هل تُقرأ بِسْمِ اللَّهِ جهرًا أم سرًّا أم لا تُقرأ؟', tr: 'بِسْمِ اللَّهِ sesli mi, sessiz mi okunur, yoksa hiç okunmaz mı?' },
    views: {
      shafii: { id: 'Dibaca keras (jahr) pada shalat jahriyah; pelan pada sirriyah. Termasuk ayat Al-Fatihah.', en: 'Aloud (jahr) in audible prayers; silently in silent ones. Counted as part of Al-Fatihah.', ar: 'تُقرأ جهرًا في الجهرية وسرًّا في السرية، وهي آية من الفاتحة.', tr: 'Sesli (cehrî) namazlarda sesli, sessiz (sirrî) namazlarda sessiz okunur. Fatiha’nın bir âyetidir.' },
      hanafi: { id: 'Dibaca pelan (sirr) di setiap shalat, termasuk yang jahriyah.', en: 'Recited silently (sirr) in every prayer, including audible ones.', ar: 'تُقرأ سرًّا في كل الصلوات، بما فيها الجهرية.', tr: 'Bütün namazlarda, sesli (cehrî) olanlar dahil, sessiz (sirr) okunur.' },
      maliki: { id: 'Tidak dibaca dalam shalat fardu (menurut riwayat Imam Malik).', en: 'Not recited in obligatory prayer (per Imam Malik’s narration).', ar: 'لا تُقرأ في صلاة الفرض (على المشهور من رواية الإمام مالك).', tr: 'İmam Malik’in rivayetine göre farz namazda okunmaz.' },
      hanbali: { id: 'Dibaca keras (jahr) pada shalat jahriyah; pelan pada sirriyah.', en: 'Aloud (jahr) in audible prayers; silently in silent ones.', ar: 'تُقرأ جهرًا في الجهرية وسرًّا في السرية.', tr: 'Sesli (cehrî) namazlarda sesli, sessiz (sirrî) namazlarda sessiz okunur.' },
    },
  },
  {
    id: 'm-amin',
    title: { id: 'Mengucapkan Aamin', en: 'Saying Ameen', ar: 'قول آمين', tr: 'Âmin demek' },
    views: {
      shafii: { id: 'Keras (jahr) pada shalat jahriyah.', en: 'Aloud (jahr) in audible prayers.', ar: 'جهرًا في الصلوات الجهرية.', tr: 'Sesli (cehrî) namazlarda sesli.' },
      hanafi: { id: 'Pelan (sirr).', en: 'Silently (sirr).', ar: 'سرًّا.', tr: 'Sessiz (sirr).' },
      maliki: { id: 'Pelan (sirr).', en: 'Silently (sirr).', ar: 'سرًّا.', tr: 'Sessiz (sirr).' },
      hanbali: { id: 'Keras (jahr) pada shalat jahriyah.', en: 'Aloud (jahr) in audible prayers.', ar: 'جهرًا في الصلوات الجهرية.', tr: 'Sesli (cehrî) namazlarda sesli.' },
    },
  },
  {
    id: 'm-qunut',
    title: { id: 'Qunut pada Subuh', en: 'Qunut in Fajr', ar: 'القنوت في الفجر', tr: 'Sabah namazında kunut' },
    views: {
      shafii: { id: 'Sunnah — pada i’tidal rakaat kedua Subuh.', en: 'Sunnah — at i’tidal of the second rakaat of Fajr.', ar: 'سنة — في اعتدال الركعة الثانية من الفجر.', tr: 'Sünnettir — Sabah’ın ikinci rekatının i’tidalinde.' },
      hanafi: { id: 'Tidak ada. Qunut hanya dalam shalat Witir.', en: 'None. Qunut is only in Witr prayer.', ar: 'لا قنوت؛ إنما القنوت في صلاة الوتر.', tr: 'Yoktur. Kunut yalnızca vitir namazındadır.' },
      maliki: { id: 'Sunnah — dibaca setelah ruku’ pada rakaat terakhir Subuh.', en: 'Sunnah — recited after ruku’ in the last rakaat of Fajr.', ar: 'سنة — يُقرأ بعد الرفع من الركوع في الركعة الأخيرة من الفجر.', tr: 'Sünnettir — Sabah’ın son rekatında rükû’dan sonra okunur.' },
      hanbali: { id: 'Tidak ada, kecuali dalam keadaan khusus (nazilah).', en: 'None, except in special circumstances (nazilah).', ar: 'لا قنوت إلا في أحوال خاصة (النازلة).', tr: 'Yoktur; yalnızca özel durumlarda (nazile) okunur.' },
    },
  },
  {
    id: 'm-tangan',
    title: { id: 'Posisi tangan setelah takbir', en: 'Hand position after takbir', ar: 'وضع اليدين بعد التكبير', tr: 'Tekbirden sonra ellerin durumu' },
    views: {
      shafii: { id: 'Sedekap (qabd) di atas dada.', en: 'Folded (qabd) on the chest.', ar: 'قبض فوق الصدر.', tr: 'Bağlanmış (kabz) olarak göğüs üzerinde.' },
      hanafi: { id: 'Sedekap (qabd) di bawah pusar.', en: 'Folded (qabd) below the navel.', ar: 'قبض تحت السرّة.', tr: 'Bağlanmış (kabz) olarak göbek altında.' },
      maliki: { id: 'Dilepas (sadl) — tangan menggantung di samping.', en: 'Released (sadl) — hands at the sides.', ar: 'سدل — إرسال اليدين على الجانبين.', tr: 'Salıverilmiş (sadl) — eller yanlarda sarkar.' },
      hanbali: { id: 'Sedekap (qabd) di atas dada.', en: 'Folded (qabd) on the chest.', ar: 'قبض فوق الصدر.', tr: 'Bağlanmış (kabz) olarak göğüs üzerinde.' },
    },
  },
  {
    id: 'm-duduk',
    title: { id: 'Postur duduk', en: 'Sitting posture', ar: 'هيئة الجلوس', tr: 'Oturuş şekli' },
    summary: { id: 'Iftirash vs tawarruk.', en: 'Iftirash vs tawarruk.', ar: 'افتراش أم تورّك.', tr: 'İftiraş mı teverrük mü.' },
    views: {
      shafii: { id: 'Iftirash untuk duduk antara sujud & tasyahhud awal; tawarruk untuk tasyahhud akhir.', en: 'Iftirash between prostrations & first tashahhud; tawarruk for the final tashahhud.', ar: 'افتراش بين السجدتين وفي التشهد الأول، وتورّك في التشهد الأخير.', tr: 'İki secde arası ve ilk tahiyyatta iftıraş; son tahiyyatta teverrük.' },
      hanafi: { id: 'Tawarruk pada tasyahhud akhir.', en: 'Tawarruk in the final tashahhud.', ar: 'تورّك في التشهد الأخير.', tr: 'Son tahiyyatta teverrük.' },
      maliki: { id: 'Tawarruk untuk semua posisi duduk.', en: 'Tawarruk for all sittings.', ar: 'تورّك في جميع الجلسات.', tr: 'Bütün oturuşlarda teverrük.' },
      hanbali: { id: 'Iftirash untuk semua posisi duduk.', en: 'Iftirash for all sittings.', ar: 'افتراش في جميع الجلسات.', tr: 'Bütün oturuşlarda iftıraş.' },
    },
  },
  {
    id: 'm-jari',
    title: { id: 'Jari telunjuk dalam tasyahhud', en: 'Index finger in tashahhud', ar: 'السبابة في التشهد', tr: 'Tahiyyatta işaret parmağı' },
    views: {
      shafii: { id: 'Diangkat & digerakkan saat “illallaah”.', en: 'Raised & moved at “illallah”.', ar: 'تُرفع وتُحرَّك عند «إلا الله».', tr: '“İllallaah” derken kaldırılır ve oynatılır.' },
      hanafi: { id: 'Diangkat saat “asyhadu allaa”, diturunkan saat “illallaah”; tidak digerakkan.', en: 'Raised at “asyhadu allaa”, lowered at “illallah”; not moved.', ar: 'تُرفع عند «أشهد أن لا» وتُخفض عند «إلا الله» دون تحريك.', tr: '“Asyhadu allaa” derken kaldırılır, “illallaah” derken indirilir; oynatılmaz.' },
      maliki: { id: 'Digerakkan terus-menerus ke kanan-kiri.', en: 'Moved continuously side to side.', ar: 'تُحرَّك يمينًا ويسارًا باستمرار.', tr: 'Sürekli olarak sağa-sola oynatılır.' },
      hanbali: { id: 'Diangkat & ditunjuk; tidak digerakkan.', en: 'Raised & pointed; not moved.', ar: 'تُرفع ويُشار إليها دون تحريك.', tr: 'Kaldırılıp işaret edilir; oynatılmaz.' },
    },
  },
  {
    id: 'm-surat',
    title: { id: 'Surat setelah Al-Fatihah', en: 'A surah after Al-Fatihah', ar: 'السورة بعد الفاتحة', tr: 'Fatiha’dan sonra sure' },
    views: {
      shafii: { id: 'Sunnah (dianjurkan).', en: 'Sunnah (recommended).', ar: 'سنة (مستحبة).', tr: 'Sünnettir (müstehaptır).' },
      hanafi: { id: 'Wajib (fardhu ‘ain dalam tiap rakaat).', en: 'Wajib (obligatory in each rakaat).', ar: 'واجبة (فرض عين في كل ركعة).', tr: 'Vaciptir (her rekatta farz-ı ayın niteliğinde).' },
      maliki: { id: 'Sunnah.', en: 'Sunnah.', ar: 'سنة.', tr: 'Sünnettir.' },
      hanbali: { id: 'Tidak wajib; dianjurkan.', en: 'Not obligatory; recommended.', ar: 'ليست واجبة، وهي مستحبة.', tr: 'Vacip değildir; müstehaptır.' },
    },
  },
];
