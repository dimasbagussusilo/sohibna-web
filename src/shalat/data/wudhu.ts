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
    tr: 'Küçük hadesi gidermek için, Allah Teâlâ için farz olarak abdest almaya niyet ettim.',
    ur: 'میں نے وضو کی نیت کی، حدثِ اصغر دور کرنے کے لیے، اللہ تعالیٰ کے لیے فرض کے طور پر۔'
  },
  reference: { id: 'Lafaz niat — mazhab Syafi’i', en: 'Niyyah formula — Shafi’i school', ar: 'صيغة النية — مذهب الشافعية', tr: 'Niyet lafzı — Şafii mezhebi', ur: 'نیت کا صیغہ — مذہبِ شافعی' },
};

/** Practical step-by-step wudhu (fardhu steps flagged in `desc`). */
export const WUDHU: Item[] = [
  {
    id: 'w-niat',
    title: { id: 'Niat', en: 'Intention', ar: 'النيّة', tr: 'Niyet', ur: 'نیّت' },
    desc: {
      id: 'Berniat di hati sambil membasuh anggota pertama (fardu).',
      en: 'Form the intention in the heart while washing the first limb (obligatory).',
      ar: 'انوِ بقلبك أثناء غسل العضو الأول (فرض).',
      tr: 'Kalpte niyet edilir ve ilk uzuv yıkanır (farzdır).',
      ur: 'پہلا عضو دھوتے وقت دل میں نیت کیجیے (فرض)۔'
    },
  },
  {
    id: 'w-tangan',
    title: { id: 'Membasuh kedua telapak tangan', en: 'Wash both hands', ar: 'غسل الكفين', tr: 'Elleri yıkamak', ur: 'دونوں ہاتھ دھونا' },
    desc: { id: 'Tiga kali, hingga sela-sela jari (sunnah).', en: 'Three times, including between the fingers (sunnah).', ar: 'ثلاث مرات، مع خلل الأصابع (سنة).', tr: 'Üç kez, parmak araları dahil (sünnettir).', ur: 'تین بار، انگلیوں کے درمیان بھی (سنت)۔' },
  },
  {
    id: 'w-kumur',
    title: { id: 'Berkumur & menghirup air ke hidung', en: 'Rinse mouth & sniff water', ar: 'المضمضة والاستنشاق', tr: 'Ağza ve burna su vermek', ur: 'کلی کرنا اور ناک میں پانی ڈالنا' },
    desc: {
      id: 'Berkumur-kumur dan beristinsyaq (menghirup) lalu mengeluarkannya, tiga kali (sunnah).',
      en: 'Rinse the mouth and sniff water into the nose, then expel it, three times (sunnah).',
      ar: 'تمضمض واستنشق الماء في الأنف ثم انثره، ثلاث مرات (سنة).',
      tr: 'Ağız çalkalanır ve buruna su çekilip sümkürülür, üç kez (sünnettir).',
      ur: 'تین بار کلی کیجیے اور ناک میں پانی کھینچ کر پھینکیے (سنت)۔'
    },
  },
  {
    id: 'w-muka',
    title: { id: 'Membasuh seluruh wajah', en: 'Wash the whole face', ar: 'غسل الوجه كله', tr: 'Bütün yüzü yıkamak', ur: 'پورا چہرہ دھونا' },
    desc: {
      id: 'Dari batas tumbuhnya rambut hingga bawah dagu, dan telinga ke telinga — tiga kali (fardu).',
      en: 'From the hairline to under the chin, and ear to ear — three times (obligatory).',
      ar: 'من منابت الشعر إلى أسفل الذقن، ومن الأذن إلى الأذن — ثلاث مرات (فرض).',
      tr: 'Saçın bittiği yerden çene altına ve kulaktan kulağa — üç kez (farzdır).',
      ur: 'بالوں کی حد سے ٹھوڑی کے نیچے تک، اور ایک کان سے دوسرے کان تک — تین بار (فرض)۔'
    },
  },
  {
    id: 'w-lengan',
    title: { id: 'Membasuh kedua tangan sampai siku', en: 'Wash both arms to the elbows', ar: 'غسل اليدين إلى المرفقين', tr: 'Dirseklere kadar iki kolu yıkamak', ur: 'دونوں بازو کہنیوں سمیت دھونا' },
    desc: {
      id: 'Dimulai dari tangan kanan, hingga termasuk siku — tiga kali (fardu).',
      en: 'Starting with the right hand, including the elbows — three times (obligatory).',
      ar: 'ابدأ باليمنى، مع إدخال المرفقين — ثلاث مرات (فرض).',
      tr: 'Sağ koldan başlanır, dirsekler dahil — üç kez (farzdır).',
      ur: 'دایاں ہاتھ پہلے، کہنیاں شامل کر کے — تین بار (فرض)۔'
    },
  },
  {
    id: 'w-kepala',
    title: { id: 'Mengusap sebagian kepala & telinga', en: 'Wipe part of the head & ears', ar: 'مسح بعض الرأس والأذنين', tr: 'Başın bir kısmını ve kulakları meshetmek', ur: 'سر کے کچھ حصے اور کانوں کا مسح' },
    desc: {
      id: 'Mengusap sebagian kepala dengan air basah, lalu kedua telinga bagian luar & dalam (fardu untuk kepala).',
      en: 'Wipe part of the head with wet hands, then the outer and inner ears (obligatory for the head).',
      ar: 'امسح بعض الرأس بيدين مبلولتين، ثم ظاهر الأذنين وباطنهما (الرأس فرض).',
      tr: 'Başın bir kısmı ıslak ellerle meshedilir, sonra her iki kulağın dışı ve içi meshedilir (başın meshi farzdır).',
      ur: 'تر ہاتھوں سے سر کے کچھ حصے کا مسح کریں، پھر دونوں کانوں کا باہر اور اندر (سر کا مسح فرض)۔'
    },
  },
  {
    id: 'w-kaki',
    title: { id: 'Membasuh kedua kaki sampai mata kaki', en: 'Wash both feet to the ankles', ar: 'غسل الرجلين إلى الكعبين', tr: 'Topuklara kadar iki ayağı yıkamak', ur: 'دونوں پاؤں ٹخنوں سمیت دھونا' },
    desc: {
      id: 'Termasuk sela-sela jari kaki, dimulai dari kaki kanan — tiga kali (fardu).',
      en: 'Including between the toes, starting with the right foot — three times (obligatory).',
      ar: 'مع خلل أصابع القدمين، ابدأ باليمنى — ثلاث مرات (فرض).',
      tr: 'Ayak parmakları arası dahil, sağ ayaktan başlanır — üç kez (farzdır).',
      ur: 'پاؤں کی انگلیوں کے درمیان شامل، دایاں پاؤں پہلے — تین بار (فرض)۔'
    },
  },
  {
    id: 'w-doa',
    title: { id: 'Membaca doa setelah wudhu', en: 'Read the post-wudhu supplication', ar: 'قراءة دعاء بعد الوضوء', tr: 'Abdestten sonra dua okumak', ur: 'وضو کے بعد کی دعا پڑھنا' },
    desc: {
      id: 'Sambil menghadap kiblat, mengangkat tangan, lalu membaca doa di bawah (sunnah).',
      en: 'Facing the qibla, raise the hands, then read the supplication below (sunnah).',
      ar: 'مستقبلًا القبلة، ارفع يديك ثم اقرأ الدعاء الآتي (سنة).',
      tr: 'Kıbleye yönelip eller kaldırılarak aşağıdaki dua okunur (sünnettir).',
      ur: 'قبلہ رخ ہو کر ہاتھ اٹھا کر نیچے لکھی دعا پڑھیں (سنت)۔'
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
    tr: 'Allah’tan başka ilah olmadığına, O’nun bir ortağı bulunmadığına ve Muhammed’in O’nun kulu ve elçisi olduğuna şahadet ederim. Allah’ım! Beni tövbe edenlerden ve arınanlardan eyle.',
    ur: 'میں گواہی دیتا ہوں کہ اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے، اُس کا کوئی شریک نہیں، اور میں گواہی دیتا ہوں کہ محمد اُس کے بندے اور رسول ہیں۔ اے اللہ! مجھے توبہ کرنے والوں میں اور پاک رہنے والوں میں شامل فرما دے۔'
  },
  reference: { id: 'HR. Muslim', en: 'Muslim', ar: 'رواه مسلم', tr: 'Müslim', ur: 'مسلم' },
};

/** Hal-hal yang membatalkan wudhu. */
export const WUDHU_BREAKERS: Item[] = [
  {
    id: 'b-keluar',
    title: { id: 'Keluarnya sesuatu dari qubul atau dubur', en: 'Anything exiting the front or rear passage', ar: 'خارج شيء من القبل أو الدبر', tr: 'Ön veya arka yoldan bir şeyin çıkması', ur: 'آگے یا پیچھے کے رستے سے کچھ نکلنا' },
    desc: {
      id: 'Seperti air kencing, tinja, kentut, mani, madzi, atau darah yang memancar.',
      en: 'Such as urine, stool, wind, semen, pre-seminal fluid, or flowing blood.',
      ar: 'كالبول والغائط والريح والمني والمذي والدم المسفوح.',
      tr: 'İdrar, dışkı, yel, meni, mezi veya akan kan gibi.',
      ur: 'جیسے پیشاب، پاخانہ، ہوا، منی، مذی یا بہتا ہوا خون۔'
    },
  },
  {
    id: 'b-akal',
    title: { id: 'Hilang akal', en: 'Loss of consciousness', ar: 'زوال العقل', tr: 'Aklın kaybolması', ur: 'عقل کا زائل ہونا' },
    desc: {
      id: 'Tidur nyenyak, pingsan, mabuk, atau gila — kecuali tidur ringan saat duduk/berpegangan.',
      en: 'Deep sleep, fainting, intoxication, or madness — except light sleep while seated/braced.',
      ar: 'النوم العميق، أو الإغماء، أو السكر، أو الجنون — إلا نوم خفيف مع جلوس أو اتكاء.',
      tr: 'Derin uyku, bayılma, sarhoşluk veya delilik — otururken veya bir yere yaslanırken olan hafif uyku hariç.',
      ur: 'گہری نیند، بے ہوشی، نشہ یا پاگل پن — سوائے بیٹھے یا ٹیک لگائے ہلکی اونگھ کے۔'
    },
  },
  {
    id: 'b-sentuh',
    title: { id: 'Sentuhan kulit lawan jenis (ajnabi)', en: 'Skin contact with a non-mahram', ar: 'ملامسة الجلد لأجنبية/لأجنبي', tr: 'Mahrem olmayanın tenine dokunmak', ur: 'غیر محرم کے جسم کا چھونا' },
    desc: {
      id: 'Mazhab Syafi’i & Hanbali: bersentuhan kulit lelaki-perempuan ajnabi tanpa penghalang membatalkan. Hanafi: jika disertai syahwat. Maliki: tidak membatalkan.',
      en: 'Shafi’i & Hanbali: direct skin contact with a non-mahram of the opposite sex nullifies it. Hanafi: only with desire. Maliki: does not nullify.',
      ar: 'الشافعية والحنابلة: مباشرة جلد الأجنبيين بلا حائل تنقض الوضوء. الحنفية: ينقضه مع الشهوة. المالكية: لا ينقضه.',
      tr: 'Şafii ve Hanbeli: mahrem olmayan kadın-erkeğin aracısız ten teması abdesti bozar. Hanefi: yalnızca şehvetle birlikte olursa bozar. Maliki: bozmaz.',
      ur: 'شافعی و حنبلی: بغیر پردے کے غیر محرم عورت یا مرد کے جسم کا چھونا وضو توڑ دیتا ہے۔ حنفی: صرف شہوت کے ساتھ۔ مالکی: نہیں توڑتا۔'
    },
  },
  {
    id: 'b-kemaluan',
    title: { id: 'Menyentuh kemaluan dengan telapak tangan', en: 'Touching the private parts with the palm', ar: 'مسّ الفرج ببطن الكف', tr: 'Avucun içiyle avrete dokunmak', ur: 'ہتھیلی سے شرمگاہ کا چھونا' },
    desc: {
      id: 'Syafi’i & Hanbali: membatalkan. Hanafi & Maliki: tidak membatalkan.',
      en: 'Shafi’i & Hanbali: nullifies. Hanafi & Maliki: does not nullify.',
      ar: 'الشافعية والحنابلة: ينقضه. الحنفية والمالكية: لا ينقضه.',
      tr: 'Şafii ve Hanbeli: bozar. Hanefi ve Maliki: bozmaz.',
      ur: 'شافعی و حنبلی: توڑتا ہے۔ حنفی و مالکی: نہیں توڑتا۔'
    },
  },
];

/** Tayamum — when water is unavailable or its use is harmful. */
export const TAYAMUM: Item[] = [
  {
    id: 't-niat',
    title: { id: 'Niat & menepuk debu', en: 'Intention & striking dust', ar: 'النية وضرب التراب', tr: 'Niyet ve toprağa vurmak', ur: 'نیت اور خاک پر ہاتھ مارنا' },
    desc: {
      id: 'Niat bertayamum di hati, lalu menepukkan kedua telapak tangan ke debu/tanah suci satu kali.',
      en: 'Intend tayammum in the heart, then strike both palms on pure dust/soil once.',
      ar: 'انوِ التيمم بقلبك، ثم اضرب بكفيك على تراب/أرض طاهرة مرة واحدة.',
      tr: 'Kalpte teyemmüm niyeti edilir, sonra her iki avuç temiz toprağa/toprağa bir kez vurulur.',
      ur: 'دل میں تیمم کی نیت کیجیے، پھر دونوں ہتھیلیاں پاک خاک یا مٹی پر ایک بار ماریے۔'
    },
  },
  {
    id: 't-wajah',
    title: { id: 'Mengusap wajah', en: 'Wipe the face', ar: 'مسح الوجه', tr: 'Yüzü meshetmek', ur: 'منہ کا مسح' },
    desc: {
      id: 'Usapkan debu ke seluruh wajah dengan kedua telapak tangan.',
      en: 'Wipe the dust over the entire face with both palms.',
      ar: 'امسح التراب على جميع الوجه بكفيك.',
      tr: 'Toprak, her iki avuçla bütün yüze meshedilir.',
      ur: 'دونوں ہتھیلیوں سے خاک پورے منہ پر ملیں۔'
    },
  },
  {
    id: 't-tangan',
    title: { id: 'Mengusap kedua tangan', en: 'Wipe both arms', ar: 'مسح اليدين', tr: 'Kolları meshetmek', ur: 'دونوں ہاتھوں کا مسح' },
    desc: {
      id: 'Usapkan tangan kanan ke tangan kiri hingga pergelangan (Syafi’i) atau siku (Hanafi & lainnya).',
      en: 'Wipe the right hand over the left up to the wrist (Shafi’i) or elbow (Hanafi & others).',
      ar: 'امسح باليمنى على اليسرى إلى الرسغ (الشافعية) أو إلى المرفقين (الحنفية وغيرهم).',
      tr: 'Sağ el ile sol kol bileğe kadar (Şafii) veya dirseklere kadar (Hanefi ve diğerleri) meshedilir.',
      ur: 'دایاں ہاتھ بائیں ہاتھ پر کلائی تک (شافعی) یا کہنی تک (حنفی و دیگر) مسح کرے۔'
    },
  },
  {
    id: 't-tertib',
    title: { id: 'Tertib (berurutan)', en: 'Sequence (tartib)', ar: 'الترتيب', tr: 'Tertib (sırayla)', ur: 'ترتیب' },
    desc: {
      id: 'Lakukan secara berurutan tanpa jeda lama, dan pastikan debu benar-benar bersih/suci.',
      en: 'Perform in order without long gaps, ensuring the dust is truly pure.',
      ar: 'افعلها مرتبة دون فاصل طويل، وتأكد أن التراب طاهر نقي.',
      tr: 'Uzun ara vermeden sırayla yapın ve toprağın gerçekten temiz olduğundan emin olun.',
      ur: 'بغیر طویل وقفے کے ترتیب سے ادا کیجیے اور یقین کر لیجیے کہ خاک واقعی پاک ہے۔'
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
    tr: 'Farz namazı kılabilmek için, Allah Teâlâ için teyemmüm yapmaya niyet ettim.',
    ur: 'میں نے تیمم کی نیت کی تاکہ فرض نماز پڑھنے کی اجازت مل سکے، اللہ تعالیٰ کے لیے۔'
  },
  reference: { id: 'Lafaz niat — mazhab Syafi’i', en: 'Niyyah formula — Shafi’i school', ar: 'صيغة النية — مذهب الشافعية', tr: 'Niyet lafzı — Şafii mezhebi', ur: 'نیت کا صیغہ — مذہبِ شافعی' },
};

// ============================================================================
// Mandi Wajib (Ghusl) — to remove major ritual impurity (hadas besar).
// ============================================================================

/** Niats for the obligatory bath, by cause. Shafi’i verbalised convention. */
export const GHUSL_NIATS: Item[] = [
  {
    id: 'g-niat-junub',
    title: { id: 'Niat Mandi Junabah', en: 'Intention — Janabah', ar: 'نية غسل الجنابة', tr: 'Niyet — Cünüplük', ur: 'نیت — غسلِ جنابت' },
    arabic: 'نَوَيْتُ الْغُسْلَ لِرَفْعِ الْحَدَثِ الْأَكْبَرِ مِنَ الْجَنَابَةِ فَرْضًا لِلَّهِ تَعَالَى',
    latin: 'Nawaitul ghusla li-raf’il hadatsil akbari minal janaabati fardhan lillaahi ta’aalaa',
    meaning: {
      id: 'Aku berniat mandi untuk menghilangkan hadas besar dari janabah, fardu karena Allah Ta’ala.',
      en: 'I intend the obligatory bath to remove major ritual impurity of janabah, for Allah the Exalted.',
      ar: 'نويت الغسل لرفع الحدث الأكبر من الجنابة فرضًا لله تعالى.',
      tr: 'Cünüplüğün büyük hadesini gidermek için, Allah Teâlâ için farz olarak gusletmeye niyet ettim.',
      ur: 'میں نے جنابت کے حدثِ اکبر کو دور کرنے کے لیے، اللہ تعالیٰ کے لیے فرض کے طور پر غسل کی نیت کی۔'
    },
    reference: { id: 'Lafaz niat — mazhab Syafi’i', en: 'Niyyah formula — Shafi’i school', ar: 'صيغة النية — مذهب الشافعية', tr: 'Niyet lafzı — Şafii mezhebi', ur: 'نیت کا صیغہ — مذہبِ شافعی' },
  },
  {
    id: 'g-niat-haid',
    title: { id: 'Niat Mandi Haid', en: 'Intention — Menstruation', ar: 'نية غسل الحيض', tr: 'Niyet — Hayız', ur: 'نیت — غسلِ حیض' },
    arabic: 'نَوَيْتُ الْغُسْلَ لِرَفْعِ الْحَدَثِ الْأَكْبَرِ مِنَ الْحَيْضِ فَرْضًا لِلَّهِ تَعَالَى',
    latin: 'Nawaitul ghusla li-raf’il hadatsil akbari minal haidhi fardhan lillaahi ta’aalaa',
    meaning: {
      id: 'Aku berniat mandi untuk menghilangkan hadas besar dari haid, fardu karena Allah Ta’ala.',
      en: 'I intend the obligatory bath to remove major impurity of menstruation, for Allah the Exalted.',
      ar: 'نويت الغسل لرفع الحدث الأكبر من الحيض فرضًا لله تعالى.',
      tr: 'Hayızın büyük hadesini gidermek için, Allah Teâlâ için farz olarak gusletmeye niyet ettim.',
      ur: 'میں نے حیض کے حدثِ اکبر کو دور کرنے کے لیے، اللہ تعالیٰ کے لیے فرض کے طور پر غسل کی نیت کی۔'
    },
    reference: { id: 'Lafaz niat — mazhab Syafi’i', en: 'Niyyah formula — Shafi’i school', ar: 'صيغة النية — مذهب الشافعية', tr: 'Niyet lafzı — Şafii mezhebi', ur: 'نیت کا صیغہ — مذہبِ شافعی' },
  },
  {
    id: 'g-niat-nifas',
    title: { id: 'Niat Mandi Nifas', en: 'Intention — Postnatal Bleeding', ar: 'نية غسل النفاس', tr: 'Niyet — Lohusalık (Nifas)', ur: 'نیت — غسلِ نفاس' },
    arabic: 'نَوَيْتُ الْغُسْلَ لِرَفْعِ الْحَدَثِ الْأَكْبَرِ مِنَ النِّفَاسِ فَرْضًا لِلَّهِ تَعَالَى',
    latin: 'Nawaitul ghusla li-raf’il hadatsil akbari minal nifaasi fardhan lillaahi ta’aalaa',
    meaning: {
      id: 'Aku berniat mandi untuk menghilangkan hadas besar dari nifas, fardu karena Allah Ta’ala.',
      en: 'I intend the obligatory bath to remove major impurity of postnatal bleeding, for Allah the Exalted.',
      ar: 'نويت الغسل لرفع الحدث الأكبر من النفاس فرضًا لله تعالى.',
      tr: 'Nifasın (lohusalığın) büyük hadesini gidermek için, Allah Teâlâ için farz olarak gusletmeye niyet ettim.',
      ur: 'میں نے نفاس کے حدثِ اکبر کو دور کرنے کے لیے، اللہ تعالیٰ کے لیے فرض کے طور پر غسل کی نیت کی۔'
    },
    reference: { id: 'Lafaz niat — mazhab Syafi’i', en: 'Niyyah formula — Shafi’i school', ar: 'صيغة النية — مذهب الشافعية', tr: 'Niyet lafzı — Şafii mezhebi', ur: 'نیت کا صیغہ — مذہبِ شافعی' },
  },
];

/** Urutan mandi wajib (fardhu ditandai dalam desc). */
export const GHUSL_STEPS: Item[] = [
  {
    id: 'g-niat',
    title: { id: 'Niat', en: 'Intention', ar: 'النيّة', tr: 'Niyet', ur: 'نیّت' },
    desc: {
      id: 'Berniat di hati (fardu) bersamaan dengan air pertama mengalir ke tubuh.',
      en: 'Form the intention in the heart (obligatory) as the first water touches the body.',
      ar: 'انوِ بقلبك (فرض) مع أول ماء يصيب البدن.',
      tr: 'İlk su bedene değdiğinde kalpte niyet edilir (farzdır).',
      ur: 'جب پہلا پانی جسم پر پڑے تو دل میں نیت کیجیے (فرض)۔'
    },
  },
  {
    id: 'g-bersih',
    title: { id: 'Membersihkan najis', en: 'Remove impurity', ar: 'إزالة النجاسة', tr: 'Necaseti gidermek', ur: 'نجاست دور کرنا' },
    desc: {
      id: 'Membasuh tangan lalu membersihkan kotoran/najis pada tubuh.',
      en: 'Wash the hands, then remove any impurity from the body.',
      ar: 'اغسل يديك ثم أزل النجاسة عن البدن.',
      tr: 'Eller yıkanır, sonra bedendeki kirlilik/necaset giderilir.',
      ur: 'پہلے ہاتھ دھوئیں، پھر جسم سے گندگی یا نجاست دور کریں۔'
    },
  },
  {
    id: 'g-wudhu',
    title: { id: 'Berwudhu', en: 'Perform wudhu', ar: 'الوضوء', tr: 'Abdest almak', ur: 'وضو کرنا' },
    desc: {
      id: 'Berwudhu seperti wudhu untuk shalat (sunnah).',
      en: 'Perform wudhu as for prayer (sunnah).',
      ar: 'توضأ وضوء الصلاة (سنة).',
      tr: 'Namaz abdesti gibi abdest alınır (sünnettir).',
      ur: 'نماز کے وضو کی طرح وضو کیجیے (سنت)۔'
    },
  },
  {
    id: 'g-kepala',
    title: { id: 'Membasuh kepala & telinga', en: 'Wash the head & ears', ar: 'غسل الرأس والأذنين', tr: 'Başı ve kulakları yıkamak', ur: 'سر اور کان دھونا' },
    desc: {
      id: 'Mengguyur/membasuh seluruh kepala beserta kedua telinga sebanyak tiga kali.',
      en: 'Pour water over the entire head and both ears, three times.',
      ar: 'صبّ الماء على جميع الرأس مع الأذنين ثلاث مرات.',
      tr: 'Bütün baş, her iki kulakla birlikte üç kez ıslatılır/yıkanır.',
      ur: 'پورا سر اور دونوں کان تین بار دھوئیں۔'
    },
  },
  {
    id: 'g-tubuh',
    title: { id: 'Mengalirkan air ke seluruh tubuh', en: 'Pour water over the whole body', ar: 'إيصال الماء إلى جميع البدن', tr: 'Bütün bedene su akıtmak', ur: 'پورے جسم پر پانی بہانا' },
    desc: {
      id: 'Mengalirkan air ke seluruh tubuh tanpa tertinggal, mulai sisi kanan lalu kiri (fardu), tiga kali, menyela-nyela rambut dan menggosok.',
      en: 'Let water flow over the entire body without exception, right side first then left (obligatory), three times, parting the hair and rubbing.',
      ar: 'أمرّ الماء على جميع البدن دون ترك شيء، ابدأ باليمين ثم اليسار (فرض)، ثلاث مرات، مع تخليل الشعر ودلكه.',
      tr: 'Su, hiçbir yer kalmaksızın bütün bedene akıtılır; önce sağ, sonra sol taraf (farzdır), üç kez, saçlar taranarak ve ovuşturularak.',
      ur: 'ایسا پانی بہائیں کہ جسم کا کوئی حصہ خشک نہ رہے، پہلے دایاں پھر بایاں طرف (فرض)، تین بار، بالوں میں انگلیاں پھیرتے اور مل کر۔'
    },
  },
];

/** Sunnah-sunnah wudhu (dianjurkan, bukan fardu). */
export const SUNNAH_WUDHU: Item[] = [
  { id: 'sw-siwak', title: { id: 'Bersiwak', en: 'Using the siwak', ar: 'السواك', tr: 'Misvak kullanmak', ur: 'مسواک کرنا' }, desc: { id: 'Membersihkan gigi dengan siwak.', en: 'Cleaning the teeth with a siwak.', ar: 'تنظيف الأسنان بالسواك.', tr: 'Dişler misvakla temizlenir.', ur: 'مسواک سے دانت صاف کیجیے۔' } },
  { id: 'sw-tangan', title: { id: 'Membasuh telapak tangan 3×', en: 'Wash the palms 3×', ar: 'غسل الكفين 3×', tr: 'Elleri 3 kez yıkamak', ur: 'ہتھیلیاں تین بار دھونا' }, desc: { id: 'Sebelum memulai anggota wudhu.', en: 'Before starting the wudhu limbs.', ar: 'قبل البدء بأعضاء الوضوء.', tr: 'Abdest uzuvlarına başlamadan önce.', ur: 'وضو کے اعضا شروع کرنے سے پہلے۔' } },
  { id: 'sw-kumur', title: { id: 'Berkumur & menghirup air 3×', en: 'Rinse mouth & sniff 3×', ar: 'المضمضة والاستنشاق 3×', tr: 'Ağza ve burna su 3 kez', ur: 'تین بار کلی اور ناک میں پانی' }, desc: { id: 'Madhmadhah (berkumur) dan istinsyaq (menghirup) lalu mengeluarkannya.', en: 'Rinsing the mouth and sniffing water into the nose, then expelling it.', ar: 'المضمضة والاستنشاق ثم النثر.', tr: 'Madmede (ağza alıp çalkalama) ve istinşak (buruna çekme), ardından sümkürme.', ur: 'کلی (مضمضہ) اور ناک میں پانی ڈالنا (استنشاق)، پھر اسے خارج کرنا۔' } },
  { id: 'sw-kepala', title: { id: 'Mengusap seluruh kepala', en: 'Wipe the whole head', ar: 'مسح الرأس كله', tr: 'Bütün başı meshetmek', ur: 'پورے سر کا مسح' }, desc: { id: 'Mengusap seluruh kepala satu kali.', en: 'Wiping the entire head once.', ar: 'مسح جميع الرأس مرة واحدة.', tr: 'Bütün baş bir kez meshedilir.', ur: 'پورے سر کا ایک بار مسح کیا جاتا ہے۔' } },
  { id: 'sw-telinga', title: { id: 'Mengusap kedua telinga', en: 'Wipe both ears', ar: 'مسح الأذنين', tr: 'Her iki kulağı meshetmek', ur: 'دونوں کانوں کا مسح' }, desc: { id: 'Bagian luar dengan ibu jari dan dalam dengan telunjuk.', en: 'Outer parts with the thumbs, inner with the index fingers.', ar: 'الظاهر بالإبهامين والباطن بالسبابتين.', tr: 'Dışı başparmaklarla, içi işaret parmaklarıyla meshedilir.', ur: 'انگوٹھوں سے باہر کی طرف اور شہادت کی انگلیوں سے اندر کی طرف۔' } },
  { id: 'sw-kanan', title: { id: 'Mendahulukan yang kanan', en: 'Begin with the right', ar: 'تقديم اليمين', tr: 'Sağı önce yapmak', ur: 'دائیں کی تقدیم' }, desc: { id: 'Anggota kanan didahulukan dari yang kiri.', en: 'The right side precedes the left.', ar: 'تُقدَّم الأعضاء اليمنى على اليسرى.', tr: 'Sağ uzuvlar, sol uzuvlardan önce yapılır.', ur: 'دائیں اعضا کو بائیں سے پہلے کیا جاتا ہے۔' } },
  { id: 'sw-sela', title: { id: 'Menyela jari & jenggot', en: 'Pass through fingers & beard', ar: 'تخليل الأصابع واللحية', tr: 'Parmak aralarını ve sakalı taramak', ur: 'انگلیوں اور داڑھی میں انگلیاں پھیرنا' }, desc: { id: 'Menyela-nyela jari tangan & kaki dan menyela jenggot.', en: 'Passing fingers through the toes/fingers and combing the beard.', ar: 'تخليل أصابع اليدين والرجلين وتخليل اللحية.', tr: 'El ve ayak parmaklarının arası ve sakal taranır.', ur: 'ہاتھوں اور پاؤں کی انگلیوں کے درمیان اور داڑھی میں انگلیاں پھیری جاتی ہیں۔' } },
  { id: 'sw-tertib', title: { id: 'Tertib (berurutan)', en: 'Sequence (tartib)', ar: 'الترتيب', tr: 'Tertib (sırayla)', ur: 'ترتیب' }, desc: { id: 'Mengerjakan secara berurutan.', en: 'Performing the acts in order.', ar: 'فعل الأعمال مرتبة.', tr: 'Ameller sırayla yapılır.', ur: 'اعمال ترتیب سے ادا کیے جائیں۔' } },
];

/** Hal-hal yang membatalkan shalat. */
export const PEMBATANG_SHALAT: Item[] = [
  { id: 'ps-hadas', title: { id: 'Berhadats', en: 'Ritual impurity', ar: 'الحدث', tr: 'Hades (abdestsizlik)', ur: 'حدث کا واقع ہونا' }, desc: { id: 'Keluar hadats kecil atau besar.', en: 'Minor or major ritual impurity occurs.', ar: 'خروج الحدث الأصغر أو الأكبر.', tr: 'Küçük veya büyük hades gerçekleşir.', ur: 'حدثِ اصغر یا اکبر کا نکلنا۔' } },
  { id: 'ps-bicara', title: { id: 'Berbicara dengan sengaja', en: 'Intentional speech', ar: 'الكلام عمدًا', tr: 'Kasıtlı konuşmak', ur: 'جان بوجھ کر بات کرنا' }, desc: { id: 'Berbicara yang bukan bagian shalat dan bukan karena lupa.', en: 'Speech unrelated to the prayer, not from forgetfulness.', ar: 'كلام ليس من الصلاة وليس عن سهو.', tr: 'Namazın parçası olmayan ve unutmadan kaynaklanmayan konuşma.', ur: 'ایسی بات جو نماز کا حصہ نہ ہو اور بھول جانے کی وجہ سے نہ ہو۔' } },
  { id: 'ps-makan', title: { id: 'Makan atau minum', en: 'Eating or drinking', ar: 'الأكل أو الشرب', tr: 'Yemek veya içmek', ur: 'کھانا یا پینا' }, desc: { id: 'Makan/minum dengan sengaja di tengah shalat.', en: 'Deliberately eating or drinking during prayer.', ar: 'الأكل أو الشرب عمدًا في أثناء الصلاة.', tr: 'Namaz içinde kasıtlı olarak yemek/içmek.', ur: 'نماز میں جان بوجھ کر کھانا یا پینا۔' } },
  { id: 'ps-gerakan', title: { id: 'Gerakan berlebihan', en: 'Excessive movement', ar: 'الحركة الكثيرة', tr: 'Aşırı hareket', ur: 'حد سے زیادہ حرکت کرنا' }, desc: { id: 'Gerakan banyak yang bukan gerakan shalat (“amal katsir”).', en: 'Much movement unrelated to the prayer.', ar: 'حركات كثيرة ليست من أفعال الصلاة («عمل كثير»).', tr: 'Namaz hareketleri dışında pek çok hareket (“amel-i kesir”).', ur: 'نماز کے افعال کے علاوہ بہت سی حرکتیں (“عملِ کثیر”)۔' } },
  { id: 'ps-kiblat', title: { id: 'Berpaling dari kiblat', en: 'Turning from the qibla', ar: 'الانصراف عن القبلة', tr: 'Kıbleden ayrılmak', ur: 'قبلے سے رخ پھیرنا' }, desc: { id: 'Dada berpaling dari arah kiblat.', en: 'The chest turns away from the qibla.', ar: 'انصراف الصدر عن جهة القبلة.', tr: 'Göğüs kıble yönünden döner.', ur: 'سینہ قبلے کی سمت سے پھر جائے۔' } },
  { id: 'ps-tertawa', title: { id: 'Tertawa keras', en: 'Loud laughter', ar: 'الضحك الباطن', tr: 'Kahkaha ile gülmek', ur: 'ٹہٹھ کر ہنسنا' }, desc: { id: 'Tertawa yang terdengar (berbeda antar mazhab).', en: 'Audible laughter (differs across schools).', ar: 'الضحك المسموع (وفيه تفصيل بين المذاهب).', tr: 'Duyulabilecek şekilde gülmek (mezheplere göre farklılık vardır).', ur: 'سنائی دینے والی ہنسی (مذاہب میں تفصیل موجود ہے)۔' } },
  { id: 'ps-rukun', title: { id: 'Meninggalkan rukun/syarat', en: 'Omitting a pillar/condition', ar: 'ترك ركن أو شرط', tr: 'Bir rüknü veya şartı terk etmek', ur: 'رکن یا شرط کا چھوڑنا' }, desc: { id: 'Meninggalkan salah satu rukun atau syarat shalat.', en: 'Leaving out a pillar or condition of prayer.', ar: 'ترك أحد أركان الصلاة أو شروطها.', tr: 'Namazın rükünlerinden veya şartlarından biri terk edilir.', ur: 'نماز کے ارکان یا شروط میں سے کوئی ایک چھوڑ دینا۔' } },
];
