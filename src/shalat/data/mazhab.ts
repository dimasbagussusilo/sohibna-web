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
      ur: 'انڈونیزیا، جنوب مشرقی ایشیا، مصر اور قرنِ افریقہ میں رائج ہے۔ انڈونیشیا کے اکثر مسلمان مذہبِ شافعی پر ہیں۔'
    },
  },
  hanafi: {
    regions: {
      id: 'Paling banyak pengikut di dunia — Asia Selatan & Tengah, Turki, Levant.',
      en: 'Largest following worldwide — South & Central Asia, Turkey, the Levant.',
      ar: 'أكثر المذاهب أتباعًا في العالم — جنوب آسيا ووسطها وتركيا والشام.',
      tr: 'Dünyada en çok taraftarı olan mezhep — Güney ve Orta Asya, Türkiye, Levant.',
      ur: 'دنیا میں سب سے زیادہ پیروکار — جنوبی و وسطی ایشیا، ترکی اور شام۔'
    },
  },
  maliki: {
    regions: {
      id: 'Populer di Afrika Utara & Barat (Maghreb, Nigeria, Senegal).',
      en: 'Popular in North & West Africa (Maghreb, Nigeria, Senegal).',
      ar: 'شائع في شمال أفريقيا وغربها (المغرب العربي ونيجيريا والسنغال).',
      tr: 'Kuzey ve Batı Afrika’da yaygındır (Mağrip, Nijerya, Senegal).',
      ur: 'شمالی و مغربی افریقہ میں رائج ہے (مغربِ عرب، نائیجیریا، سینیگال)۔'
    },
  },
  hanbali: {
    regions: {
      id: 'Populer di Arab Saudi (Najd), Qatar, dan UEA.',
      en: 'Popular in Saudi Arabia (Najd), Qatar, and the UAE.',
      ar: 'شائع في السعودية (نجد) وقطر والإمارات.',
      tr: 'Suudi Arabistan’da (Necd), Katar ve BAE’de yaygındır.',
      ur: 'سعودی عرب (نجد)، قطر اور متحدہ عرب امارات میں رائج ہے۔'
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
    title: { id: 'Basmalah dalam Al-Fatihah', en: 'Basmalah in Al-Fatihah', ar: 'البسملة في الفاتحة', tr: 'Fatiha’da Besmele', ur: 'الفاتحہ میں بسم اللہ' },
    summary: { id: 'Apakah بِسْمِ اللَّهِ dibaca keras, pelan, atau tidak dibaca?', en: 'Is بِسْمِ اللَّهِ recited aloud, silently, or not at all?', ar: 'هل تُقرأ بِسْمِ اللَّهِ جهرًا أم سرًّا أم لا تُقرأ؟', tr: 'بِسْمِ اللَّهِ sesli mi, sessiz mi okunur, yoksa hiç okunmaz mı?', ur: 'کیا بِسْمِ اللَّهِ بلند آواز سے پڑھی جائے، آہستہ، یا بالکل نہ پڑھی جائے؟' },
    views: {
      shafii: { id: 'Dibaca keras (jahr) pada shalat jahriyah; pelan pada sirriyah. Termasuk ayat Al-Fatihah.', en: 'Aloud (jahr) in audible prayers; silently in silent ones. Counted as part of Al-Fatihah.', ar: 'تُقرأ جهرًا في الجهرية وسرًّا في السرية، وهي آية من الفاتحة.', tr: 'Sesli (cehrî) namazlarda sesli, sessiz (sirrî) namazlarda sessiz okunur. Fatiha’nın bir âyetidir.', ur: 'جہری نمازوں میں بلند آواز سے (جہر) اور سری نمازوں میں آہستہ پڑھی جاتی ہے۔ یہ الفاتحہ کی ایک آیت ہے۔' },
      hanafi: { id: 'Dibaca pelan (sirr) di setiap shalat, termasuk yang jahriyah.', en: 'Recited silently (sirr) in every prayer, including audible ones.', ar: 'تُقرأ سرًّا في كل الصلوات، بما فيها الجهرية.', tr: 'Bütün namazlarda, sesli (cehrî) olanlar dahil, sessiz (sirr) okunur.', ur: 'ہر نماز میں آہستہ (سرّ) پڑھی جاتی ہے، بشمول جہری نمازوں کے۔' },
      maliki: { id: 'Tidak dibaca dalam shalat fardu (menurut riwayat Imam Malik).', en: 'Not recited in obligatory prayer (per Imam Malik’s narration).', ar: 'لا تُقرأ في صلاة الفرض (على المشهور من رواية الإمام مالك).', tr: 'İmam Malik’in rivayetine göre farz namazda okunmaz.', ur: 'فرض نماز میں نہیں پڑھی جاتی (امام مالک کی روایت کے مطابق)۔' },
      hanbali: { id: 'Dibaca keras (jahr) pada shalat jahriyah; pelan pada sirriyah.', en: 'Aloud (jahr) in audible prayers; silently in silent ones.', ar: 'تُقرأ جهرًا في الجهرية وسرًّا في السرية.', tr: 'Sesli (cehrî) namazlarda sesli, sessiz (sirrî) namazlarda sessiz okunur.', ur: 'جہری نمازوں میں بلند آواز سے (جہر) اور سری نمازوں میں آہستہ پڑھی جاتی ہے۔' },
    },
  },
  {
    id: 'm-amin',
    title: { id: 'Mengucapkan Aamin', en: 'Saying Ameen', ar: 'قول آمين', tr: 'Âmin demek', ur: 'آمین کہنا' },
    views: {
      shafii: { id: 'Keras (jahr) pada shalat jahriyah.', en: 'Aloud (jahr) in audible prayers.', ar: 'جهرًا في الصلوات الجهرية.', tr: 'Sesli (cehrî) namazlarda sesli.', ur: 'جہری نمازوں میں بلند آواز سے (جہر)۔' },
      hanafi: { id: 'Pelan (sirr).', en: 'Silently (sirr).', ar: 'سرًّا.', tr: 'Sessiz (sirr).', ur: 'آہستہ (سرّ)۔' },
      maliki: { id: 'Pelan (sirr).', en: 'Silently (sirr).', ar: 'سرًّا.', tr: 'Sessiz (sirr).', ur: 'آہستہ (سرّ)۔' },
      hanbali: { id: 'Keras (jahr) pada shalat jahriyah.', en: 'Aloud (jahr) in audible prayers.', ar: 'جهرًا في الصلوات الجهرية.', tr: 'Sesli (cehrî) namazlarda sesli.', ur: 'جہری نمازوں میں بلند آواز سے (جہر)۔' },
    },
  },
  {
    id: 'm-qunut',
    title: { id: 'Qunut pada Subuh', en: 'Qunut in Fajr', ar: 'القنوت في الفجر', tr: 'Sabah namazında kunut', ur: 'فجر میں قنوت' },
    views: {
      shafii: { id: 'Sunnah — pada i’tidal rakaat kedua Subuh.', en: 'Sunnah — at i’tidal of the second rakaat of Fajr.', ar: 'سنة — في اعتدال الركعة الثانية من الفجر.', tr: 'Sünnettir — Sabah’ın ikinci rekatının i’tidalinde.', ur: 'سنت ہے — فجر کی دوسری رکعت کے اعتدال میں۔' },
      hanafi: { id: 'Tidak ada. Qunut hanya dalam shalat Witir.', en: 'None. Qunut is only in Witr prayer.', ar: 'لا قنوت؛ إنما القنوت في صلاة الوتر.', tr: 'Yoktur. Kunut yalnızca vitir namazındadır.', ur: 'نہیں ہے۔ قنوت صرف نمازِ وتر میں ہے۔' },
      maliki: { id: 'Sunnah — dibaca setelah ruku’ pada rakaat terakhir Subuh.', en: 'Sunnah — recited after ruku’ in the last rakaat of Fajr.', ar: 'سنة — يُقرأ بعد الرفع من الركوع في الركعة الأخيرة من الفجر.', tr: 'Sünnettir — Sabah’ın son rekatında rükû’dan sonra okunur.', ur: 'سنت ہے — فجر کی آخری رکعت میں رکوع کے بعد پڑھا جاتا ہے۔' },
      hanbali: { id: 'Tidak ada, kecuali dalam keadaan khusus (nazilah).', en: 'None, except in special circumstances (nazilah).', ar: 'لا قنوت إلا في أحوال خاصة (النازلة).', tr: 'Yoktur; yalnızca özel durumlarda (nazile) okunur.', ur: 'نہیں ہے، سوائے خاص حالات کے (نازلہ)۔' },
    },
  },
  {
    id: 'm-tangan',
    title: { id: 'Posisi tangan setelah takbir', en: 'Hand position after takbir', ar: 'وضع اليدين بعد التكبير', tr: 'Tekbirden sonra ellerin durumu', ur: 'تکبیر کے بعد ہاتھوں کی حالت' },
    views: {
      shafii: { id: 'Sedekap (qabd) di atas dada.', en: 'Folded (qabd) on the chest.', ar: 'قبض فوق الصدر.', tr: 'Bağlanmış (kabz) olarak göğüs üzerinde.', ur: 'قبض کر کے سینے کے اوپر۔' },
      hanafi: { id: 'Sedekap (qabd) di bawah pusar.', en: 'Folded (qabd) below the navel.', ar: 'قبض تحت السرّة.', tr: 'Bağlanmış (kabz) olarak göbek altında.', ur: 'قبض کر کے ناف کے نیچے۔' },
      maliki: { id: 'Dilepas (sadl) — tangan menggantung di samping.', en: 'Released (sadl) — hands at the sides.', ar: 'سدل — إرسال اليدين على الجانبين.', tr: 'Salıverilmiş (sadl) — eller yanlarda sarkar.', ur: 'سدل — ہاتھ دونوں اطراف لٹکائے جاتے ہیں۔' },
      hanbali: { id: 'Sedekap (qabd) di atas dada.', en: 'Folded (qabd) on the chest.', ar: 'قبض فوق الصدر.', tr: 'Bağlanmış (kabz) olarak göğüs üzerinde.', ur: 'قبض کر کے سینے کے اوپر۔' },
    },
  },
  {
    id: 'm-duduk',
    title: { id: 'Postur duduk', en: 'Sitting posture', ar: 'هيئة الجلوس', tr: 'Oturuş şekli', ur: 'بیٹھنے کی صورت' },
    summary: { id: 'Iftirash vs tawarruk.', en: 'Iftirash vs tawarruk.', ar: 'افتراش أم تورّك.', tr: 'İftiraş mı teverrük mü.', ur: 'افتراش بمقابلہ تورّک۔' },
    views: {
      shafii: { id: 'Iftirash untuk duduk antara sujud & tasyahhud awal; tawarruk untuk tasyahhud akhir.', en: 'Iftirash between prostrations & first tashahhud; tawarruk for the final tashahhud.', ar: 'افتراش بين السجدتين وفي التشهد الأول، وتورّك في التشهد الأخير.', tr: 'İki secde arası ve ilk tahiyyatta iftıraş; son tahiyyatta teverrük.', ur: 'دو سجدوں کے درمیان اور پہلے تشہد میں افتراش؛ آخری تشہد میں تورّک۔' },
      hanafi: { id: 'Tawarruk pada tasyahhud akhir.', en: 'Tawarruk in the final tashahhud.', ar: 'تورّك في التشهد الأخير.', tr: 'Son tahiyyatta teverrük.', ur: 'آخری تشہد میں تورّک۔' },
      maliki: { id: 'Tawarruk untuk semua posisi duduk.', en: 'Tawarruk for all sittings.', ar: 'تورّك في جميع الجلسات.', tr: 'Bütün oturuşlarda teverrük.', ur: 'ہر بیٹھک میں تورّک۔' },
      hanbali: { id: 'Iftirash untuk semua posisi duduk.', en: 'Iftirash for all sittings.', ar: 'افتراش في جميع الجلسات.', tr: 'Bütün oturuşlarda iftıraş.', ur: 'ہر بیٹھک میں افتراش۔' },
    },
  },
  {
    id: 'm-jari',
    title: { id: 'Jari telunjuk dalam tasyahhud', en: 'Index finger in tashahhud', ar: 'السبابة في التشهد', tr: 'Tahiyyatta işaret parmağı', ur: 'تشہد میں شہادت کی انگلی' },
    views: {
      shafii: { id: 'Diangkat & digerakkan saat “illallaah”.', en: 'Raised & moved at “illallah”.', ar: 'تُرفع وتُحرَّك عند «إلا الله».', tr: '“İllallaah” derken kaldırılır ve oynatılır.', ur: '“اِلَّا اللہ” کہتے وقت اٹھائی اور حرکت دی جاتی ہے۔' },
      hanafi: { id: 'Diangkat saat “asyhadu allaa”, diturunkan saat “illallaah”; tidak digerakkan.', en: 'Raised at “asyhadu allaa”, lowered at “illallah”; not moved.', ar: 'تُرفع عند «أشهد أن لا» وتُخفض عند «إلا الله» دون تحريك.', tr: '“Asyhadu allaa” derken kaldırılır, “illallaah” derken indirilir; oynatılmaz.', ur: '“اشہدُ ان لا” پر اٹھائی جاتی ہے اور “اِلَّا اللہ” پر نیچے کر دی جاتی ہے؛ حرکت نہیں دی جاتی۔' },
      maliki: { id: 'Digerakkan terus-menerus ke kanan-kiri.', en: 'Moved continuously side to side.', ar: 'تُحرَّك يمينًا ويسارًا باستمرار.', tr: 'Sürekli olarak sağa-sola oynatılır.', ur: 'مسلسل دائیں بائیں حرکت دی جاتی ہے۔' },
      hanbali: { id: 'Diangkat & ditunjuk; tidak digerakkan.', en: 'Raised & pointed; not moved.', ar: 'تُرفع ويُشار إليها دون تحريك.', tr: 'Kaldırılıp işaret edilir; oynatılmaz.', ur: 'اٹھا کر اشارہ کیا جاتا ہے؛ حرکت نہیں دی جاتی۔' },
    },
  },
  {
    id: 'm-surat',
    title: { id: 'Surat setelah Al-Fatihah', en: 'A surah after Al-Fatihah', ar: 'السورة بعد الفاتحة', tr: 'Fatiha’dan sonra sure', ur: 'الفاتحہ کے بعد سورۃ' },
    views: {
      shafii: { id: 'Sunnah (dianjurkan).', en: 'Sunnah (recommended).', ar: 'سنة (مستحبة).', tr: 'Sünnettir (müstehaptır).', ur: 'سنت ہے (مستحب)۔' },
      hanafi: { id: 'Wajib (fardhu ‘ain dalam tiap rakaat).', en: 'Wajib (obligatory in each rakaat).', ar: 'واجبة (فرض عين في كل ركعة).', tr: 'Vaciptir (her rekatta farz-ı ayın niteliğinde).', ur: 'واجب ہے (ہر رکعت میں فرضِ عین کی حیثیت سے)۔' },
      maliki: { id: 'Sunnah.', en: 'Sunnah.', ar: 'سنة.', tr: 'Sünnettir.', ur: 'سنت ہے۔' },
      hanbali: { id: 'Tidak wajib; dianjurkan.', en: 'Not obligatory; recommended.', ar: 'ليست واجبة، وهي مستحبة.', tr: 'Vacip değildir; müstehaptır.', ur: 'واجب نہیں؛ مستحب ہے۔' },
    },
  },
];
