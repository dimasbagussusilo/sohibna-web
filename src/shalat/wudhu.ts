import type { ArabicItem, Item } from '../types';

// ============================================================================
// Section 1 — Thoharoh (Purification): Wudhu, Tayamum, what nullifies wudhu.
// Arabic/transliteration authored from commonly-taught Indonesian sources;
// verify any string against a trusted source before shipping (religious text).
// ============================================================================

/** Niat wudhu (Shafi'i convention — verbalised). */
export const WUDHU_NIAT: ArabicItem = {
  arabic: 'نَوَيْتُ الْوُضُوْءَ لِرَفْعِ الْحَدَثِ الْأَصْغَرِ فَرْضًا لِلَّهِ تَعَالَى',
  latin: 'Nawaitul wudhuu-a li-raf’il hadatsil ashghari fardhan lillaahi ta’aalaa',
  meaning: {
    id: 'Aku berniat berwudhu untuk menghilangkan hadas kecil, fardu karena Allah Ta’ala.',
    en: 'I intend to perform ablution to remove minor ritual impurity, as an obligation for Allah the Exalted.',
    ar: 'نويت الوضوء لرفع الحدث الأصغر فرضًا لله تعالى.',
  },
  reference: { id: 'Lafaz niat — mazhab Syafi’i', en: 'Niyyah formula — Shafi’i school', ar: 'صيغة النية — مذهب الشافعية' },
};

/** Practical step-by-step wudhu (fardhu steps flagged in `desc`). */
export const WUDHU: Item[] = [
  {
    id: 'w-niat',
    title: { id: 'Niat', en: 'Intention', ar: 'النيّة' },
    desc: {
      id: 'Berniat di hati sambil membasuh anggota pertama (fardu).',
      en: 'Form the intention in the heart while washing the first limb (obligatory).',
      ar: 'انوِ بقلبك أثناء غسل العضو الأول (فرض).',
    },
  },
  {
    id: 'w-tangan',
    title: { id: 'Membasuh kedua telapak tangan', en: 'Wash both hands', ar: 'غسل الكفين' },
    desc: { id: 'Tiga kali, hingga sela-sela jari (sunnah).', en: 'Three times, including between the fingers (sunnah).', ar: 'ثلاث مرات، مع خلل الأصابع (سنة).' },
  },
  {
    id: 'w-kumur',
    title: { id: 'Berkumur & menghirup air ke hidung', en: 'Rinse mouth & sniff water', ar: 'المضمضة والاستنشاق' },
    desc: {
      id: 'Berkumur-kumur dan beristinsyaq (menghirup) lalu mengeluarkannya, tiga kali (sunnah).',
      en: 'Rinse the mouth and sniff water into the nose, then expel it, three times (sunnah).',
      ar: 'تمضمض واستنشق الماء في الأنف ثم انثره، ثلاث مرات (سنة).',
    },
  },
  {
    id: 'w-muka',
    title: { id: 'Membasuh seluruh wajah', en: 'Wash the whole face', ar: 'غسل الوجه كله' },
    desc: {
      id: 'Dari batas tumbuhnya rambut hingga bawah dagu, dan telinga ke telinga — tiga kali (fardu).',
      en: 'From the hairline to under the chin, and ear to ear — three times (obligatory).',
      ar: 'من منابت الشعر إلى أسفل الذقن، ومن الأذن إلى الأذن — ثلاث مرات (فرض).',
    },
  },
  {
    id: 'w-lengan',
    title: { id: 'Membasuh kedua tangan sampai siku', en: 'Wash both arms to the elbows', ar: 'غسل اليدين إلى المرفقين' },
    desc: {
      id: 'Dimulai dari tangan kanan, hingga termasuk siku — tiga kali (fardu).',
      en: 'Starting with the right hand, including the elbows — three times (obligatory).',
      ar: 'ابدأ باليمنى، مع إدخال المرفقين — ثلاث مرات (فرض).',
    },
  },
  {
    id: 'w-kepala',
    title: { id: 'Mengusap sebagian kepala & telinga', en: 'Wipe part of the head & ears', ar: 'مسح بعض الرأس والأذنين' },
    desc: {
      id: 'Mengusap sebagian kepala dengan air basah, lalu kedua telinga bagian luar & dalam (fardu untuk kepala).',
      en: 'Wipe part of the head with wet hands, then the outer and inner ears (obligatory for the head).',
      ar: 'امسح بعض الرأس بيدين مبلولتين، ثم ظاهر الأذنين وباطنهما (الرأس فرض).',
    },
  },
  {
    id: 'w-kaki',
    title: { id: 'Membasuh kedua kaki sampai mata kaki', en: 'Wash both feet to the ankles', ar: 'غسل الرجلين إلى الكعبين' },
    desc: {
      id: 'Termasuk sela-sela jari kaki, dimulai dari kaki kanan — tiga kali (fardu).',
      en: 'Including between the toes, starting with the right foot — three times (obligatory).',
      ar: 'مع خلل أصابع القدمين، ابدأ باليمنى — ثلاث مرات (فرض).',
    },
  },
  {
    id: 'w-doa',
    title: { id: 'Membaca doa setelah wudhu', en: 'Read the post-wudhu supplication', ar: 'قراءة دعاء بعد الوضوء' },
    desc: {
      id: 'Sambil menghadap kiblat, mengangkat tangan, lalu membaca doa di bawah (sunnah).',
      en: 'Facing the qibla, raise the hands, then read the supplication below (sunnah).',
      ar: 'مستقبلًا القبلة، ارفع يديك ثم اقرأ الدعاء الآتي (سنة).',
    },
  },
];

/** Doa setelah wudhu. */
export const WUDHU_AFTER_DOA: ArabicItem = {
  arabic:
    'أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ، اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ',
  latin:
    'Asyhadu allaa ilaaha illallaah, wahdahu laa syariika lah, wa asyhadu anna Muhammadan ‘abduhu wa rasuuluh. Allaahummaj’alnii minat tawwaabiin, waj’alnii minal mutathahhiriin.',
  meaning: {
    id: 'Aku bersaksi tiada Tuhan selain Allah Yang Maha Esa, tiada sekutu bagi-Nya, dan bahwa Nabi Muhammad adalah hamba dan utusan-Nya. Ya Allah, jadikanlah aku termasuk hamba yang bertaubat dan yang menyucikan diri.',
    en: 'I bear witness that there is no god but Allah alone, with no partner, and that Muhammad is His servant and messenger. O Allah, make me among those who repent and those who purify themselves.',
    ar: 'أشهد أن لا إله إلا الله وحده لا شريك له، وأشهد أن محمدًا عبده ورسوله. اللهم اجعلني من التوابين، واجعلني من المتطهرين.',
  },
  reference: { id: 'HR. Muslim', en: 'Muslim', ar: 'رواه مسلم' },
};

/** Hal-hal yang membatalkan wudhu. */
export const WUDHU_BREAKERS: Item[] = [
  {
    id: 'b-keluar',
    title: { id: 'Keluarnya sesuatu dari qubul atau dubur', en: 'Anything exiting the front or rear passage', ar: 'خارج شيء من القبل أو الدبر' },
    desc: {
      id: 'Seperti air kencing, tinja, kentut, mani, madzi, atau darah yang memancar.',
      en: 'Such as urine, stool, wind, semen, pre-seminal fluid, or flowing blood.',
      ar: 'كالبول والغائط والريح والمني والمذي والدم المسفوح.',
    },
  },
  {
    id: 'b-akal',
    title: { id: 'Hilang akal', en: 'Loss of consciousness', ar: 'زوال العقل' },
    desc: {
      id: 'Tidur nyenyak, pingsan, mabuk, atau gila — kecuali tidur ringan saat duduk/berpegangan.',
      en: 'Deep sleep, fainting, intoxication, or madness — except light sleep while seated/braced.',
      ar: 'النوم العميق، أو الإغماء، أو السكر، أو الجنون — إلا نوم خفيف مع جلوس أو اتكاء.',
    },
  },
  {
    id: 'b-sentuh',
    title: { id: 'Sentuhan kulit lawan jenis (ajnabi)', en: 'Skin contact with a non-mahram', ar: 'ملامسة الجلد لأجنبية/لأجنبي' },
    desc: {
      id: 'Mazhab Syafi’i & Hanbali: bersentuhan kulit lelaki-perempuan ajnabi tanpa penghalang membatalkan. Hanafi: jika disertai syahwat. Maliki: tidak membatalkan.',
      en: 'Shafi’i & Hanbali: direct skin contact with a non-mahram of the opposite sex nullifies it. Hanafi: only with desire. Maliki: does not nullify.',
      ar: 'الشافعية والحنابلة: مباشرة جلد الأجنبيين بلا حائل تنقض الوضوء. الحنفية: ينقضه مع الشهوة. المالكية: لا ينقضه.',
    },
  },
  {
    id: 'b-kemaluan',
    title: { id: 'Menyentuh kemaluan dengan telapak tangan', en: 'Touching the private parts with the palm', ar: 'مسّ الفرج ببطن الكف' },
    desc: {
      id: 'Syafi’i & Hanbali: membatalkan. Hanafi & Maliki: tidak membatalkan.',
      en: 'Shafi’i & Hanbali: nullifies. Hanafi & Maliki: does not nullify.',
      ar: 'الشافعية والحنابلة: ينقضه. الحنفية والمالكية: لا ينقضه.',
    },
  },
];

/** Tayamum — when water is unavailable or its use is harmful. */
export const TAYAMUM: Item[] = [
  {
    id: 't-niat',
    title: { id: 'Niat & menepuk debu', en: 'Intention & striking dust', ar: 'النية وضرب التراب' },
    desc: {
      id: 'Niat bertayamum di hati, lalu menepukkan kedua telapak tangan ke debu/tanah suci satu kali.',
      en: 'Intend tayammum in the heart, then strike both palms on pure dust/soil once.',
      ar: 'انوِ التيمم بقلبك، ثم اضرب بكفيك على تراب/أرض طاهرة مرة واحدة.',
    },
  },
  {
    id: 't-wajah',
    title: { id: 'Mengusap wajah', en: 'Wipe the face', ar: 'مسح الوجه' },
    desc: {
      id: 'Usapkan debu ke seluruh wajah dengan kedua telapak tangan.',
      en: 'Wipe the dust over the entire face with both palms.',
      ar: 'امسح التراب على جميع الوجه بكفيك.',
    },
  },
  {
    id: 't-tangan',
    title: { id: 'Mengusap kedua tangan', en: 'Wipe both arms', ar: 'مسح اليدين' },
    desc: {
      id: 'Usapkan tangan kanan ke tangan kiri hingga pergelangan (Syafi’i) atau siku (Hanafi & lainnya).',
      en: 'Wipe the right hand over the left up to the wrist (Shafi’i) or elbow (Hanafi & others).',
      ar: 'امسح باليمنى على اليسرى إلى الرسغ (الشافعية) أو إلى المرفقين (الحنفية وغيرهم).',
    },
  },
  {
    id: 't-tertib',
    title: { id: 'Tertib (berurutan)', en: 'Sequence (tartib)', ar: 'الترتيب' },
    desc: {
      id: 'Lakukan secara berurutan tanpa jeda lama, dan pastikan debu benar-benar bersih/suci.',
      en: 'Perform in order without long gaps, ensuring the dust is truly pure.',
      ar: 'افعلها مرتبة دون فاصل طويل، وتأكد أن التراب طاهر نقي.',
    },
  },
];

/** Niat tayamum. */
export const TAYAMUM_NIAT: ArabicItem = {
  arabic: 'نَوَيْتُ التَّيَمُّمَ لِإِحْلَالِ الصَّلَاةِ فَرْضًا لِلَّهِ تَعَالَى',
  latin: 'Nawaitut tayammuma li-ihlaalish shalaati fardhan lillaahi ta’aalaa',
  meaning: {
    id: 'Aku berniat bertayamum agar boleh mengerjakan shalat fardu karena Allah Ta’ala.',
    en: 'I intend to perform tayammum so I may perform the obligatory prayer, for Allah the Exalted.',
    ar: 'نويت التيمم لإباحة الصلاة فرضًا لله تعالى.',
  },
  reference: { id: 'Lafaz niat — mazhab Syafi’i', en: 'Niyyah formula — Shafi’i school', ar: 'صيغة النية — مذهب الشافعية' },
};

// ============================================================================
// Mandi Wajib (Ghusl) — to remove major ritual impurity (hadas besar).
// ============================================================================

/** Niats for the obligatory bath, by cause. Shafi’i verbalised convention. */
export const GHUSL_NIATS: Item[] = [
  {
    id: 'g-niat-junub',
    title: { id: 'Niat Mandi Junabah', en: 'Intention — Janabah', ar: 'نية غسل الجنابة' },
    arabic: 'نَوَيْتُ الْغُسْلَ لِرَفْعِ الْحَدَثِ الْأَكْبَرِ مِنَ الْجَنَابَةِ فَرْضًا لِلَّهِ تَعَالَى',
    latin: 'Nawaitul ghusla li-raf’il hadatsil akbari minal janaabati fardhan lillaahi ta’aalaa',
    meaning: {
      id: 'Aku berniat mandi untuk menghilangkan hadas besar dari janabah, fardu karena Allah Ta’ala.',
      en: 'I intend the obligatory bath to remove major ritual impurity of janabah, for Allah the Exalted.',
      ar: 'نويت الغسل لرفع الحدث الأكبر من الجنابة فرضًا لله تعالى.',
    },
    reference: { id: 'Lafaz niat — mazhab Syafi’i', en: 'Niyyah formula — Shafi’i school', ar: 'صيغة النية — مذهب الشافعية' },
  },
  {
    id: 'g-niat-haid',
    title: { id: 'Niat Mandi Haid', en: 'Intention — Menstruation', ar: 'نية غسل الحيض' },
    arabic: 'نَوَيْتُ الْغُسْلَ لِرَفْعِ الْحَدَثِ الْأَكْبَرِ مِنَ الْحَيْضِ فَرْضًا لِلَّهِ تَعَالَى',
    latin: 'Nawaitul ghusla li-raf’il hadatsil akbari minal haidhi fardhan lillaahi ta’aalaa',
    meaning: {
      id: 'Aku berniat mandi untuk menghilangkan hadas besar dari haid, fardu karena Allah Ta’ala.',
      en: 'I intend the obligatory bath to remove major impurity of menstruation, for Allah the Exalted.',
      ar: 'نويت الغسل لرفع الحدث الأكبر من الحيض فرضًا لله تعالى.',
    },
    reference: { id: 'Lafaz niat — mazhab Syafi’i', en: 'Niyyah formula — Shafi’i school', ar: 'صيغة النية — مذهب الشافعية' },
  },
  {
    id: 'g-niat-nifas',
    title: { id: 'Niat Mandi Nifas', en: 'Intention — Postnatal Bleeding', ar: 'نية غسل النفاس' },
    arabic: 'نَوَيْتُ الْغُسْلَ لِرَفْعِ الْحَدَثِ الْأَكْبَرِ مِنَ النِّفَاسِ فَرْضًا لِلَّهِ تَعَالَى',
    latin: 'Nawaitul ghusla li-raf’il hadatsil akbari minal nifaasi fardhan lillaahi ta’aalaa',
    meaning: {
      id: 'Aku berniat mandi untuk menghilangkan hadas besar dari nifas, fardu karena Allah Ta’ala.',
      en: 'I intend the obligatory bath to remove major impurity of postnatal bleeding, for Allah the Exalted.',
      ar: 'نويت الغسل لرفع الحدث الأكبر من النفاس فرضًا لله تعالى.',
    },
    reference: { id: 'Lafaz niat — mazhab Syafi’i', en: 'Niyyah formula — Shafi’i school', ar: 'صيغة النية — مذهب الشافعية' },
  },
];

/** Urutan mandi wajib (fardhu ditandai dalam desc). */
export const GHUSL_STEPS: Item[] = [
  {
    id: 'g-niat',
    title: { id: 'Niat', en: 'Intention', ar: 'النيّة' },
    desc: {
      id: 'Berniat di hati (fardu) bersamaan dengan air pertama mengalir ke tubuh.',
      en: 'Form the intention in the heart (obligatory) as the first water touches the body.',
      ar: 'انوِ بقلبك (فرض) مع أول ماء يصيب البدن.',
    },
  },
  {
    id: 'g-bersih',
    title: { id: 'Membersihkan najis', en: 'Remove impurity', ar: 'إزالة النجاسة' },
    desc: {
      id: 'Membasuh tangan lalu membersihkan kotoran/najis pada tubuh.',
      en: 'Wash the hands, then remove any impurity from the body.',
      ar: 'اغسل يديك ثم أزل النجاسة عن البدن.',
    },
  },
  {
    id: 'g-wudhu',
    title: { id: 'Berwudhu', en: 'Perform wudhu', ar: 'الوضوء' },
    desc: {
      id: 'Berwudhu seperti wudhu untuk shalat (sunnah).',
      en: 'Perform wudhu as for prayer (sunnah).',
      ar: 'توضأ وضوء الصلاة (سنة).',
    },
  },
  {
    id: 'g-kepala',
    title: { id: 'Membasuh kepala & telinga', en: 'Wash the head & ears', ar: 'غسل الرأس والأذنين' },
    desc: {
      id: 'Mengguyur/membasuh seluruh kepala beserta kedua telinga sebanyak tiga kali.',
      en: 'Pour water over the entire head and both ears, three times.',
      ar: 'صبّ الماء على جميع الرأس مع الأذنين ثلاث مرات.',
    },
  },
  {
    id: 'g-tubuh',
    title: { id: 'Mengalirkan air ke seluruh tubuh', en: 'Pour water over the whole body', ar: 'إيصال الماء إلى جميع البدن' },
    desc: {
      id: 'Mengalirkan air ke seluruh tubuh tanpa tertinggal, mulai sisi kanan lalu kiri (fardu), tiga kali, menyela-nyela rambut dan menggosok.',
      en: 'Let water flow over the entire body without exception, right side first then left (obligatory), three times, parting the hair and rubbing.',
      ar: 'أمرّ الماء على جميع البدن دون ترك شيء، ابدأ باليمين ثم اليسار (فرض)، ثلاث مرات، مع تخليل الشعر ودلكه.',
    },
  },
];

/** Sunnah-sunnah wudhu (dianjurkan, bukan fardu). */
export const SUNNAH_WUDHU: Item[] = [
  { id: 'sw-siwak', title: { id: 'Bersiwak', en: 'Using the siwak', ar: 'السواك' }, desc: { id: 'Membersihkan gigi dengan siwak.', en: 'Cleaning the teeth with a siwak.', ar: 'تنظيف الأسنان بالسواك.' } },
  { id: 'sw-tangan', title: { id: 'Membasuh telapak tangan 3×', en: 'Wash the palms 3×', ar: 'غسل الكفين 3×' }, desc: { id: 'Sebelum memulai anggota wudhu.', en: 'Before starting the wudhu limbs.', ar: 'قبل البدء بأعضاء الوضوء.' } },
  { id: 'sw-kumur', title: { id: 'Berkumur & menghirup air 3×', en: 'Rinse mouth & sniff 3×', ar: 'المضمضة والاستنشاق 3×' }, desc: { id: 'Madhmadhah (berkumur) dan istinsyaq (menghirup) lalu mengeluarkannya.', en: 'Rinsing the mouth and sniffing water into the nose, then expelling it.', ar: 'المضمضة والاستنشاق ثم النثر.' } },
  { id: 'sw-kepala', title: { id: 'Mengusap seluruh kepala', en: 'Wipe the whole head', ar: 'مسح الرأس كله' }, desc: { id: 'Mengusap seluruh kepala satu kali.', en: 'Wiping the entire head once.', ar: 'مسح جميع الرأس مرة واحدة.' } },
  { id: 'sw-telinga', title: { id: 'Mengusap kedua telinga', en: 'Wipe both ears', ar: 'مسح الأذنين' }, desc: { id: 'Bagian luar dengan ibu jari dan dalam dengan telunjuk.', en: 'Outer parts with the thumbs, inner with the index fingers.', ar: 'الظاهر بالإبهامين والباطن بالسبابتين.' } },
  { id: 'sw-kanan', title: { id: 'Mendahulukan yang kanan', en: 'Begin with the right', ar: 'تقديم اليمين' }, desc: { id: 'Anggota kanan didahulukan dari yang kiri.', en: 'The right side precedes the left.', ar: 'تُقدَّم الأعضاء اليمنى على اليسرى.' } },
  { id: 'sw-sela', title: { id: 'Menyela jari & jenggot', en: 'Pass through fingers & beard', ar: 'تخليل الأصابع واللحية' }, desc: { id: 'Menyela-nyela jari tangan & kaki dan menyela jenggot.', en: 'Passing fingers through the toes/fingers and combing the beard.', ar: 'تخليل أصابع اليدين والرجلين وتخليل اللحية.' } },
  { id: 'sw-tertib', title: { id: 'Tertib (berurutan)', en: 'Sequence (tartib)', ar: 'الترتيب' }, desc: { id: 'Mengerjakan secara berurutan.', en: 'Performing the acts in order.', ar: 'فعل الأعمال مرتبة.' } },
];

/** Hal-hal yang membatalkan shalat. */
export const PEMBATANG_SHALAT: Item[] = [
  { id: 'ps-hadas', title: { id: 'Berhadats', en: 'Ritual impurity', ar: 'الحدث' }, desc: { id: 'Keluar hadats kecil atau besar.', en: 'Minor or major ritual impurity occurs.', ar: 'خروج الحدث الأصغر أو الأكبر.' } },
  { id: 'ps-bicara', title: { id: 'Berbicara dengan sengaja', en: 'Intentional speech', ar: 'الكلام عمدًا' }, desc: { id: 'Berbicara yang bukan bagian shalat dan bukan karena lupa.', en: 'Speech unrelated to the prayer, not from forgetfulness.', ar: 'كلام ليس من الصلاة وليس عن سهو.' } },
  { id: 'ps-makan', title: { id: 'Makan atau minum', en: 'Eating or drinking', ar: 'الأكل أو الشرب' }, desc: { id: 'Makan/minum dengan sengaja di tengah shalat.', en: 'Deliberately eating or drinking during prayer.', ar: 'الأكل أو الشرب عمدًا في أثناء الصلاة.' } },
  { id: 'ps-gerakan', title: { id: 'Gerakan berlebihan', en: 'Excessive movement', ar: 'الحركة الكثيرة' }, desc: { id: 'Gerakan banyak yang bukan gerakan shalat (“amal katsir”).', en: 'Much movement unrelated to the prayer.', ar: 'حركات كثيرة ليست من أفعال الصلاة («عمل كثير»).' } },
  { id: 'ps-kiblat', title: { id: 'Berpaling dari kiblat', en: 'Turning from the qibla', ar: 'الانصراف عن القبلة' }, desc: { id: 'Dada berpaling dari arah kiblat.', en: 'The chest turns away from the qibla.', ar: 'انصراف الصدر عن جهة القبلة.' } },
  { id: 'ps-tertawa', title: { id: 'Tertawa keras', en: 'Loud laughter', ar: 'الضحك الباطن' }, desc: { id: 'Tertawa yang terdengar (berbeda antar mazhab).', en: 'Audible laughter (differs across schools).', ar: 'الضحك المسموع (وفيه تفصيل بين المذاهب).' } },
  { id: 'ps-rukun', title: { id: 'Meninggalkan rukun/syarat', en: 'Omitting a pillar/condition', ar: 'ترك ركن أو شرط' }, desc: { id: 'Meninggalkan salah satu rukun atau syarat shalat.', en: 'Leaving out a pillar or condition of prayer.', ar: 'ترك أحد أركان الصلاة أو شروطها.' } },
];
