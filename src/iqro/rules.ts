// Volumes 3-7 reference data (harakat signs, tajwid rules, long vowels,
// hamzah forms) — kept in its own module so the reader-style rules only
// download when a user opens those volumes (see routes/Iqro.tsx RulesVolume).
import type {
  HarakatRule,
  TajwidRule,
  HarakatSign,
  LongVowel,
  HamzahForm,
} from './types';

// ---------------------------------------------------------------------------
// PHASE 4 — Rambu Suara (harakat as "traffic signs").
// ---------------------------------------------------------------------------

export const V3_RULES: HarakatRule[] = [
  {
    id: 'sukun',
    title: { id: 'Sukun', en: 'Sukun', ar: 'السكون', tr: 'Sükun', ur: 'سکون' },
    subtitle: { id: '(Mati / Rem)', en: '(Stop / Brake)', ar: '(توقيف / فرملة)', tr: '(Dur / Fren)', ur: '(رکنا / بریک)' },
    icon: 'hand-paper',
    analogyIcon: 'car',
    analogy: { id: 'Sukun itu ibarat <strong>mengerem mobil</strong> secara mendadak. Suara berhenti seketika di huruf tersebut tanpa diberi vokal (a, i, u).', en: 'Sukun is like <strong>braking a car</strong> suddenly. The sound stops dead on that letter, with no vowel (a, i, u) added.', ar: 'السكون ك<strong>فرملة سيارة</strong> مفاجئة: يتوقف الصوت فورًا عند الحرف دون إضافة أي حركة (فَتحة أو كسرة أو ضمة).', tr: 'Sükun, bir arabayı aniden <strong>frenlemek</strong> gibidir. Ses, üzerine hareke (a, i, u) eklenmeden o harfte tam olarak durur.', ur: 'سکون ایسا ہی ہے جیسے <strong>گاڑی کو اچانک بریک</strong> لگائی جائے۔ آواز اسی حرف پر فوراً رک جاتی ہے، کوئی حرکت (a, i, u) شامل نہیں ہوتی۔' },
    mechanics: { id: 'Kunci rapat posisi mulut (makhraj) pada huruf yang bersukun dan hentikan aliran napas atau suara di titik tersebut.', en: 'Lock the mouth position (makhraj) on the sukun letter and stop the flow of breath/sound right there.', ar: 'أوصِد وضع الفم (المخرج) على الحرف الساكن، وأوقف جرَيان النفس أو الصوت عند ذلك الموضع بالضبط.', tr: 'Sükunlu harfte ağzın konumunu (mahreç) kilitli gibi sabit tutun ve nefes ya da ses akışını tam o noktada kesin.', ur: 'سکون والے حرف پر منہ کی حالت (مخرج) کو مقفل رکھیں اور سانس یا آواز کا بہاؤ اسی نکتے پر روک دیں۔' },
    word: {
      full: 'مِنْ',
      audio: 'min',
      syllables: [
        { arab: 'مِـ', latin: 'mi', duration: 400 },
        { arab: 'ـنْ', latin: 'n', duration: 600, highlight: true },
      ],
    },
  },
  {
    id: 'tasydid',
    title: { id: 'Tasydid', en: 'Tasydid', ar: 'التشديد', tr: 'Şedde', ur: 'تشدید' },
    subtitle: { id: '(Ganda / Tahan)', en: '(Doubled / Held)', ar: '(مضاعَف / ممسوك)', tr: '(İkilenmiş / Tutulmuş)', ur: '(دگنا / ٹھہرا ہوا)' },
    icon: 'compress',
    analogyIcon: 'road',
    analogy: { id: 'Tasydid ibarat melewati <strong>polisi tidur</strong>. Anda harus mengerem (menahan) sejenak, lalu baru mengegas (melepas) kembali.', en: 'Tasydid is like driving over a <strong>speed bump</strong>. You brake (hold) briefly, then accelerate (release) again.', ar: 'التشديد كاجتياز <strong>مطبّات السرعة</strong>: تكبح (تُمسِك) لحظة ثم تتسارع (تُطلِق) من جديد.', tr: 'Şedde, üzerinden geçilen bir <strong>hız tümseğine</strong> benzer. Kısa süre fren yapar (tutarsınız), ardından tekrar hızlanırsınız (bırakırsınız).', ur: 'تشدید ایسا ہے جیسے <strong>اسپیڈ بریکر</strong> سے گزرنا۔ آپ کچھ لمحہ بریک (ٹھہراؤ) کرتے ہیں، پھر دوبارہ رفتار (چھوڑنا) بڑھاتے ہیں۔' },
    mechanics: { id: 'Huruf bertasydid sebenarnya adalah dua huruf yang sama. Huruf pertama mati (ditahan), huruf kedua hidup (dilepas). Contoh: Rab-ba.', en: 'A tasydid letter is really two of the same letter: the first is silent (held), the second is vowelled (released). E.g. Rab-ba.', ar: 'الحرف المشدَّد هو في الحقيقة حرفان من جنس واحد: الأول ساكن (ممسوك) والثاني متحرك (مُطلَق). مثال: رَبْ-بَ.', tr: 'Şeddeli harf aslında aynı harften ikisi demektir: ilki sessizdir (tutulur), ikincisi harekelidir (bırakılır). Örnek: Rab-ba.', ur: 'تشدید والا حرف دراصل دو یکساں حروف ہوتے ہیں: پہلا خاموش (روکا ہوا)، دوسرا متحرک (چھوڑا ہوا)۔ مثلاً: Rab-ba۔' },
    word: {
      full: 'رَبَّ',
      audio: 'rabba',
      syllables: [
        { arab: 'رَبْـ', latin: 'rab', duration: 700, highlight: true },
        { arab: 'ـبَ', latin: 'ba', duration: 400 },
      ],
    },
  },
  {
    id: 'tanwin',
    title: { id: 'Tanwin', en: 'Tanwin', ar: 'التنوين', tr: 'Tenvin', ur: 'تنوین' },
    subtitle: { id: "(Akhiran 'N')", en: "(Final 'N')", ar: '(نون في الآخر)', tr: "(Sondaki 'N')", ur: '(آخری N)' },
    icon: 'coins',
    analogyIcon: 'coins',
    analogy: { id: "Tanwin ibarat menjatuhkan <strong>koin ke dalam kaleng</strong>. Apapun hurufnya, selalu diakhiri dengan bunyi dering 'N' di ujungnya (an, in, un).", en: "Tanwin is like <strong>dropping a coin into a tin</strong>. Whatever the letter, it always ends with a ringing 'N' (an, in, un).", ar: 'التنوين كإسقاط <strong>عملة في علبةٍ معدنية</strong>: مهما يكن الحرف، يُختَم الصوت دائمًا برنين النون الساكنة في آخره.', tr: "Tenvin, <strong>teneke kutuya para atmak</strong> gibidir. Harf her ne olursa olsun, sonda her zaman çınlayan bir 'N' sesiyle biter (an, in, un).", ur: 'تنوین ایسا ہے جیسے <strong>ڈبے میں سکہ گرا دیا جائے</strong>۔ حرف جو بھی ہو، آخر میں ہمیشہ "N" کی گونجتی آواز آتی ہے (an, in, un)۔' },
    mechanics: { id: "Cukup tambahkan bunyi huruf 'N' mati di akhir vokal. Bunyi ini dikeluarkan dengan menyentuhkan ujung lidah ke langit-langit (makhraj Nun).", en: "Just add a silent 'N' sound after the final vowel, made by touching the tongue tip to the palate (the Nun articulation).", ar: 'أضف فقط صوت النون الساكنة بعد الحركة الأخيرة، ويُخرَج بملمس طرف اللسان للحنك (مخرج النون).', tr: "Son harekenin ardından yalnızca sessiz bir 'N' sesi ekleyin; bu ses, dil ucunu damağa değdirerek çıkarılır (Nun mahreci).", ur: 'آخری حرکت کے بعد صرف ایک خاموش "N" کی آواز لگائیں؛ یہ آواز زبان کی نوک کو تالو سے لگا کر نکالی جاتی ہے (نون کا مخرج)۔' },
    word: {
      full: 'بَابٌ',
      audio: 'baabun',
      syllables: [
        { arab: 'بَا', latin: 'baa', duration: 600 },
        { arab: 'بٌ', latin: 'bun', duration: 600, highlight: true },
      ],
    },
  },
];

// ---------------------------------------------------------------------------
// PHASE 7 — Harmoni Suara (tajwid basics).
// Mad Thabi'i (long vowels) moved to its own Phase 5; this phase keeps the
// "effect" rules: ghunnah (nasal buzz) and qalqalah (echo bounce).
// ---------------------------------------------------------------------------

export const V4_RULES: TajwidRule[] = [
  {
    id: 'ghunnah',
    title: { id: 'Ghunnah', en: 'Ghunnah', ar: 'الغنّة', tr: 'Gunne', ur: 'غنہ' },
    subtitle: { id: '(Getaran Hidung)', en: '(Nasal Buzz)', ar: '(رنين أنفي)', tr: '(Burun Uğultusu)', ur: '(ناک کی بھنبھناہٹ)' },
    icon: 'vibrate',
    analogyIcon: 'vibrate',
    arab: 'إِنَّ',
    latin: 'Innn - na',
    type: 'vibrate',
    duration: 2000,
    analogy: { id: 'Ibarat <strong>seekor lebah</strong> yang terperangkap di dalam hidung Anda. Suara ditahan dan digetarkan dengan durasi 2-3 ketukan penuh.', en: 'Like a <strong>bee</strong> trapped inside your nose. The sound is held and vibrated for a full 2–3 beats.', ar: 'كأنّ <strong>نحلة</strong> حُبست داخل أنفك: يُمسَك الصوت ويُرنّ لمدة 2–3 نبضات كاملة.', tr: 'Burnunuzun içine hapsolmuş bir <strong>arı</strong> gibidir. Ses tutulur ve tam 2–3 vuruş boyunca titretilir.', ur: 'جیسے آپ کی ناک میں ایک <strong>شہد کی مکھی</strong> پھنسی ہو۔ آواز روک کر مکمل 2–3 چوٹوں تک گونجائی جاتی ہے۔' },
    mechanics: { id: 'Tutup aliran udara dari mulut sepenuhnya. Dorong suara ke arah rongga hidung (khaisyum) hingga Anda merasakan getaran di tulang hidung.', en: 'Block the airflow from the mouth entirely. Push the sound into the nasal cavity until you feel the vibration in your nose bone.', ar: 'أغلِق مرور الهواء من الفم تمامًا، وادفع الصوت نحو تجويف الأنف (الخيشوم) حتى تشعر بالاهتزاز في عظم الأنف.', tr: 'Ağızdan geçen hava akışını tamamen kapatın. Sesi burun boşluğuna (hayşum) doğru itin; burun kemiğinizde titremeyi hissedene kadar sürdürün.', ur: 'منہ سے ہوا کا بہاؤ مکمل بند کریں۔ آواز کو ناک کے خلا (خیشوم) کی جانب دھکیلیں یہاں تک کہ ناک کی ہڈی میں ارتعاش محسوس ہو۔' },
  },
  {
    id: 'qalqalah',
    title: { id: 'Qalqalah', en: 'Qalqalah', ar: 'القلقلة', tr: 'Kalkale', ur: 'قلقلہ' },
    subtitle: { id: '(Pantulan Mendadak)', en: '(Sudden Bounce)', ar: '(ارتداد مفاجئ)', tr: '(Ani Sekme)', ur: '(اچانک اچھالنا)' },
    icon: 'bounce',
    analogyIcon: 'bounce',
    arab: 'فَلَقْ',
    latin: 'Fa-la-Qe',
    type: 'bounce',
    duration: 1000,
    analogy: { id: 'Ibarat <strong>bola basket</strong> yang dilemparkan ke lantai. Begitu membentur lantai, ia harus langsung memantul naik secara spontan.', en: 'Like a <strong>basketball</strong> thrown at the floor — the moment it hits, it bounces right back up.', ar: 'ك<strong>كرة سلة</strong> تُرمى إلى الأرض: ما إن تلمسها حتى ترتد فورًا.', tr: 'Yere bırakılan bir <strong>basketbol topu</strong> gibidir — yere değer değmez hemen yukarı doğru seker.', ur: 'جیسے <strong>باسکٹ بال</strong> فرش پر پھینکا جائے — جیسے ہی زمین لگتا ہے، وہ فوراً اوپر اچھل آتا ہے۔' },
    mechanics: { id: "Tekan letak suara (makhraj) huruf dengan kuat, lalu lepaskan secara tiba-tiba tanpa memberikan vokal tambahan. Menghasilkan efek letupan 'e' kecil.", en: "Press the letter’s articulation point firmly, then release it abruptly with no added vowel — producing a small echoing 'e'.", ar: 'اضغط مخرج الحرف بقوة ثم أطلقه فجأة دون حركة زائدة، فينتج صدى خفيف يشبه همزة قطع قصيرة.', tr: "Harfin ses noktasına (mahreç) güçlüce bastırın, ardından ek bir hareke vermeden aniden bırakın — küçük bir yankılı 'e' etkisi doğar.", ur: 'حرف کے مخرج پر زور سے دباؤ ڈالیں، پھر کسی اضافی حرکت کے بغیر اچانک چھوڑ دیں — اس سے چھوٹی سی "e" کی گونجنے والی آواز پیدا ہوتی ہے۔' },
  },
];

// ---------------------------------------------------------------------------
// PHASE 2 — Harakat Dasar (the three short vowels: Fathah/Kasroh/Dhomah).
// ---------------------------------------------------------------------------

export const HARAKAT_SIGNS: HarakatSign[] = [
  {
    id: 'fathah',
    name: { id: 'Fathah', en: 'Fathah', ar: 'الفتحة', tr: 'Üstün', ur: 'فتحہ' },
    sign: 'ـَ',
    sound: 'a',
    carrier: 'بَ',
    desc: {
      id: 'Garis lurus di ATAS huruf. Menghasilkan bunyi vokal "a" yang terbuka (mulut menganga).',
      en: 'A straight line ABOVE the letter. Produces the open "a" vowel (mouth opens wide).',
      ar: 'خط مستقيم فوق الحرف يمنح صوت "أَ" المفتوح (يفتح الفم واسعًا).',
      tr: 'Harfin ÜSTÜNDE düz bir çizgidir. Açık "a" ünlüsünü verir (ağız iyice açılır).',
      ur: 'حرف کے اوپر سیدھی لکیر۔ کھلی "a" حرکت پیدا کرتی ہے (منہ چوڑا کھل جاتا ہے)۔',
    },
    examples: [
      { arab: 'بَ', latin: 'ba' },
      { arab: 'تَ', latin: 'ta' },
      { arab: 'مَ', latin: 'ma' },
      { arab: 'كَ', latin: 'ka' },
    ],
  },
  {
    id: 'kasroh',
    name: { id: 'Kasroh', en: 'Kasroh', ar: 'الكسرة', tr: 'Esre', ur: 'کسرہ' },
    sign: 'ـِ',
    sound: 'i',
    carrier: 'بِ',
    desc: {
      id: 'Garis lurus di BAWAH huruf. Menghasilkan bunyi vokal "i" (mulut menyempit ke samping).',
      en: 'A straight line BELOW the letter. Produces the "i" vowel (mouth narrows sideways).',
      ar: 'خط مستقيم تحت الحرف يمنح صوت "إِ" (يضيق الفم جانبيًا).',
      tr: 'Harfin ALTINDA düz bir çizgidir. "i" ünlüsünü verir (ağız yanlara doğru daralır).',
      ur: 'حرف کے نیچے سیدھی لکیر۔ "i" حرکت پیدا کرتی ہے (منہ پہلوؤں کی جانب تنگ ہو جاتا ہے)۔',
    },
    examples: [
      { arab: 'بِ', latin: 'bi' },
      { arab: 'تِ', latin: 'ti' },
      { arab: 'مِ', latin: 'mi' },
      { arab: 'كِ', latin: 'ki' },
    ],
  },
  {
    id: 'dhomah',
    name: { id: 'Dhomah', en: 'Dhomah', ar: 'الضمة', tr: 'Ötre', ur: 'ضمہ' },
    sign: 'ـُ',
    sound: 'u',
    carrier: 'بُ',
    desc: {
      id: 'Seperti huruf waw (و) kecil di ATAS huruf. Menghasilkan bunyi vokal "u" (bibir monyong).',
      en: 'Like a small waw (و) ABOVE the letter. Produces the "u" vowel (lips pursed).',
      ar: 'كواوٍ صغيرة فوق الحرف تمنح صوت "أُ" (تُدوَّر الشفتان).',
      tr: 'Harfin ÜSTÜNDE küçük bir vav (و) gibidir. "u" ünlüsünü verir (dudaklar büzülür).',
      ur: 'حرف کے اوپر چھوٹے واؤ (و) کی طرح۔ "u" حرکت پیدا کرتی ہے (ہونٹ اُبھر آتے ہیں)۔',
    },
    examples: [
      { arab: 'بُ', latin: 'bu' },
      { arab: 'تُ', latin: 'tu' },
      { arab: 'مُ', latin: 'mu' },
      { arab: 'كُ', latin: 'ku' },
    ],
  },
];

// ---------------------------------------------------------------------------
// PHASE 5 — Mad Thabi'i (alif/waw/ya as long-vowel lengtheners).
// ---------------------------------------------------------------------------

export const LONG_VOWELS: LongVowel[] = [
  {
    id: 'alif',
    name: { id: 'Alif', en: 'Alif', ar: 'الألف', tr: 'Elif', ur: 'الف' },
    letter: 'ا',
    pair: 'ـَا',
    word: 'قَالَ',
    latin: 'Qaala',
    meaning: { id: '(ia) berkata', en: '(he) said', ar: '(قال)', tr: '(o) dedi', ur: '(اس نے) کہا' },
    vowel: { id: 'Fathah', en: 'Fathah', ar: 'الفتحة', tr: 'Üstün', ur: 'فتحہ' },
    desc: {
      id: 'Huruf Alif (ا) memanjangkan bunyi Fathah. Dari "a" menjadi "aa" selama ~2 ketukan.',
      en: 'The letter Alif (ا) lengthens the Fathah: from "a" into "aa" for about 2 beats.',
      ar: 'الألف تُطيل الفتحة: من "أَ" إلى "آ" بمقدار نحو حركتين.',
      tr: 'Elif (ا) harfi üstünü uzatır: "a" sesi yaklaşık 2 vuruş boyunca "aa" olur.',
      ur: 'الف (ا) فتحہ کو دراز کرتا ہے: تقریباً 2 چوٹوں تک "a" سے "aa" ہو جاتا ہے۔',
    },
  },
  {
    id: 'waw',
    name: { id: 'Waw', en: 'Waw', ar: 'الواو', tr: 'Vav', ur: 'واؤ' },
    letter: 'و',
    pair: 'ـُو',
    word: 'يَقُولُ',
    latin: 'Yaquulu',
    meaning: { id: '(ia) berkata', en: '(he) says', ar: '(يقول)', tr: '(o) der', ur: '(وہ) کہتا ہے' },
    vowel: { id: 'Dhomah', en: 'Dhomah', ar: 'الضمة', tr: 'Ötre', ur: 'ضمہ' },
    desc: {
      id: 'Huruf Waw (و) memanjangkan bunyi Dhomah. Dari "u" menjadi "uu" selama ~2 ketukan.',
      en: 'The letter Waw (و) lengthens the Dhomah: from "u" into "uu" for about 2 beats.',
      ar: 'الواو تُطيل الضمة: من "أُ" إلى "أُو" بمقدار نحو حركتين.',
      tr: 'Vav (و) harfi ötreyi uzatır: "u" sesi yaklaşık 2 vuruş boyunca "uu" olur.',
      ur: 'واؤ (و) ضمہ کو دراز کرتا ہے: تقریباً 2 چوٹوں تک "u" سے "uu" ہو جاتا ہے۔',
    },
  },
  {
    id: 'ya',
    name: { id: 'Ya', en: 'Ya', ar: 'الياء', tr: 'Ye', ur: 'یے' },
    letter: 'ي',
    pair: 'ـِي',
    word: 'دِينٌ',
    latin: 'Diinun',
    meaning: { id: 'agama', en: 'religion', ar: 'الدين', tr: 'din', ur: 'دین' },
    vowel: { id: 'Kasroh', en: 'Kasroh', ar: 'الكسرة', tr: 'Esre', ur: 'کسرہ' },
    desc: {
      id: 'Huruf Ya (ي) memanjangkan bunyi Kasroh. Dari "i" menjadi "ii" selama ~2 ketukan.',
      en: 'The letter Ya (ي) lengthens the Kasroh: from "i" into "ii" for about 2 beats.',
      ar: 'الياء تُطيل الكسرة: من "إِ" إلى "إِي" بمقدار نحو حركتين.',
      tr: 'Ye (ي) harfi esreyi uzatır: "i" sesi yaklaşık 2 vuruş boyunca "ii" olur.',
      ur: 'یے (ي) کسرہ کو دراز کرتی ہے: تقریباً 2 چوٹوں تک "i" سے "ii" ہو جاتا ہے۔',
    },
  },
];

// ---------------------------------------------------------------------------
// PHASE 6 — Hamzah & alif variants.
// ---------------------------------------------------------------------------

export const HAMZAH_FORMS: HamzahForm[] = [
  {
    id: 'hamzah-a',
    name: { id: 'Hamzah Fathah', en: 'Hamzah Fathah', ar: 'همزة مع فتحة (أ)', tr: 'Üstünlü Hemze', ur: 'فتحہ والی ہمزہ' },
    form: 'أ',
    word: 'أَحَدٌ',
    latin: 'Ahadun',
    meaning: { id: 'satu', en: 'one', ar: 'واحد', tr: 'bir', ur: 'ایک' },
    desc: {
      id: 'Alif (ا) dengan hamzah (ء) di atasnya, dibaca dengan bunyi "a" yang jelas.',
      en: 'An Alif (ا) with a hamzah (ء) above it, pronounced with a clear "a".',
      ar: 'ألف (ا) فوقها همزة (ء)، تُنطق بفتحٍ واضح "أَ".',
      tr: 'Üzerinde hemze (ء) bulunan elif (ا); açık bir "a" sesiyle okunur.',
      ur: 'الف (ا) جس کے اوپر ہمزہ (ء) ہو، واضح "a" کی آواز سے پڑھا جاتا ہے۔',
    },
  },
  {
    id: 'hamzah-i',
    name: { id: 'Hamzah Kasroh', en: 'Hamzah Kasroh', ar: 'همزة مع كسرة (إ)', tr: 'Esreli Hemze', ur: 'کسرہ والی ہمزہ' },
    form: 'إ',
    word: 'إِنَّ',
    latin: 'Inna',
    meaning: { id: 'sesungguhnya', en: 'indeed', ar: 'إنَّ', tr: 'şüphesiz', ur: 'بے شک' },
    desc: {
      id: 'Alif (ا) dengan hamzah (ء) di bawahnya, dibaca dengan bunyi "i" yang jelas.',
      en: 'An Alif (ا) with a hamzah (ء) below it, pronounced with a clear "i".',
      ar: 'ألف تحتها همزة، تُنطق بكسرٍ واضح "إِ".',
      tr: 'Altında hemze (ء) bulunan elif (ا); açık bir "i" sesiyle okunur.',
      ur: 'الف (ا) جس کے نیچے ہمزہ (ء) ہو، واضح "i" کی آواز سے پڑھا جاتا ہے۔',
    },
  },
  {
    id: 'maddah',
    name: { id: 'Alif Mamdudah', en: 'Alif Mamdudah', ar: 'ألف ممدودة (آ)', tr: 'Meddeli Elif', ur: 'ممدودہ الف' },
    form: 'آ',
    word: 'آمَنَ',
    latin: 'Aamana',
    meaning: { id: 'beriman', en: 'to believe', ar: 'آمن', tr: 'iman etmek', ur: 'ایمان لانا' },
    desc: {
      id: 'Alif dengan tanda mad (ـٓ) di atasnya, dibaca panjang "aa" (gabungan dua hamzah).',
      en: 'An Alif with a mad mark (ـٓ) above it, pronounced as a long "aa" (two hamzahs merged).',
      ar: 'ألف فوقها علامة المدّ، تُنطق ممدودة "آ" (دمج همزتين).',
      tr: 'Üzerinde med işareti (ـٓ) bulunan elif; "aa" olarak uzun okunur (iki hemzenin birleşimi).',
      ur: 'الف جس کے اوپر مد کی علامت (ـٓ) ہو، طویل "aa" کی آواز سے پڑھا جاتا ہے (دو ہمزوں کا امتزاج)۔',
    },
  },
  {
    id: 'waslah',
    name: { id: 'Alif Waslah', en: 'Alif Waslah', ar: 'ألف وصل (ٱ)', tr: 'Vasıl Elifi', ur: 'الفِ وصل' },
    form: 'ٱ',
    word: 'بِسْمِ ٱللَّهِ',
    latin: 'bismillāh',
    meaning: { id: 'dengan nama Allah', en: 'in the name of Allah', ar: 'باسم الله', tr: "Allah'ın adıyla", ur: 'اللہ کے نام سے' },
    desc: {
      id: 'Alif yang dilewati (tidak dibaca) saat bersambung dengan kata sebelumnya, hanya dibaca pendek di awal kalimat.',
      en: 'An Alif skipped (not pronounced) when joined to the preceding word; pronounced short only at the start of an utterance.',
      ar: 'ألف تُتجاوَز (لا تُنطق) عند وصلها بما قبلها، وتُنطق قصيرة في بداية الكلام فقط.',
      tr: 'Öncesindeki kelimeye bağlandığında atlanan (okunmayan) elif; yalnızca sözün başında kısa okunur.',
      ur: 'الف جو پچھلے لفظ سے جوڑنے پر چھوڑ دیا جاتا ہے (پڑھا نہیں جاتا)؛ صرف کلام کے آغاز میں مختصر پڑھا جاتا ہے۔',
    },
  },
];
