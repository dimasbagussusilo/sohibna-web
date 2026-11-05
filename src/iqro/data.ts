import type {
  LetterFamily,
  JoinWord,
  HarakatRule,
  TajwidRule,
  HarakatSign,
  LongVowel,
  HamzahForm,
  VolumeMeta,
} from './types';

// Phase order (id drives the header prev/next + fase label). Phase 8 (AI) is
// deferred.
//   1 Letters, 2 Harakat Dasar, 3 Joining, 4 Signs, 5 Long vowels,
//   6 Hamzah, 7 Tajwid, 8 AI
export const VOLUMES: VolumeMeta[] = [
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 },
  { id: 6 },
  { id: 7 },
  { id: 8, disabled: true },
];

// ---------------------------------------------------------------------------
// PHASE 1 — Logika Bentuk Huruf (28 hijaiyah in 11 shape "families").
// ---------------------------------------------------------------------------

export const V1_FAMILIES: LetterFamily[] = [
  {
    groupName: { id: '1. Keluarga Garis Vertikal', en: '1. Vertical-Line Family', ar: '1. عائلة الخط العمودي', tr: '1. Dikey Çizgi Ailesi' },
    description: {
      id: 'Memiliki garis lurus tegak sebagai pembentuk utama.',
      en: 'Built primarily around a straight upright stroke.',
      ar: 'تُبنى أساسًا على خط عمودي مستقيم.',
      tr: 'Esas olarak dümdüz dik bir çizgi üzerine kuruludur.',
    },
    letters: [
      { id: 'alif', arab: 'ا', name: { id: 'Alif', en: 'Alif', ar: 'أَلِف', tr: 'Elif' }, audio: 'a', anatomy: { id: 'Keluar dari rongga mulut bagian dalam. Suaranya murni berupa hembusan napas yang beresonansi tanpa hambatan.', en: 'Comes from the back of the mouth cavity. A pure breath of air that resonates freely, with no obstruction.', ar: 'يخرج من أقصى تجويف الفم؛ نفَسٌ خالص يرنّ بحرية دون أي عائق.', tr: 'Ağız boşluğunun en gerisinden çıkar. Hiçbir engele takılmadan serbestçe yankılanan saf bir nefestir.' }, logic: { id: 'Bentuk paling dasar: Garis lurus vertikal sederhana melambangkan fondasi berdiri tegak.', en: 'The most basic shape: a simple straight vertical line, the foundation standing upright.', ar: 'أبسط الأشكال: خط عمودي مستقيم يمثّل الأساس القائم.', tr: 'En temel biçim: dümdüz dikey bir çizgi; dimdik duran temelin kendisi.' } },
      { id: 'lam', arab: 'ل', name: { id: 'Lam', en: 'Lam', ar: 'لام', tr: 'Lam' }, audio: 'la', anatomy: { id: 'Ujung lidah menempel pada gusi gigi seri atas secara melebar.', en: 'The tip of the tongue spreads flat against the gum behind the upper front teeth.', ar: 'ينبسط طرف اللسان على اللثة خلف الأسنان العليا.', tr: 'Dil ucu, üst ön dişlerin arkasındaki diş etine yayılarak yapışır.' }, logic: { id: "Seperti Alif, namun memiliki kail pancing di bagian bawah yang melengkung tajam ke kiri.", en: 'Like Alif, but with a fish-hook curling sharply to the left at the bottom.', ar: 'مثل الألف، لكن مع خطّاف في الأسفل ينثني حادًّا نحو اليسار.', tr: 'Elif gibidir; ancak altında sola doğru sertçe kıvrılan bir balık kancası vardır.' } },
      { id: 'kaf', arab: 'ك', name: { id: 'Kaf', en: 'Kaf', ar: 'كاف', tr: 'Kef' }, audio: 'ka', anatomy: { id: 'Pangkal lidah menempel pada langit-langit bagian tengah (sedikit di depan makhraj Qaf).', en: 'The back of the tongue touches the mid-palate (slightly ahead of the Qaf articulation).', ar: 'يلامس أقصى اللسان وسط الحنك (أمام مخرج القاف قليلًا).', tr: 'Dilin arkası damağın ortasına değer (Kaf mahrecinin hafif önünde).' }, logic: { id: 'Garis tegak dengan dudukan siku. Terdapat ornamen huruf kaf kecil (menyerupai hamzah) di dalamnya.', en: 'An upright stroke with an elbow rest. A small kaf ornament (like a hamzah) sits inside it.', ar: 'خط عمودي مع مسند مرفقي، وبداخله زخرفة كاف صغيرة (تشبه الهمزة).', tr: 'Dirsek dayama yerli dik bir çizgi. İçinde küçük bir kef süsü (hemze benzeri) bulunur.' } },
    ],
  },
  {
    groupName: { id: '2. Keluarga Mangkuk / Perahu', en: '2. Bowl / Boat Family', ar: '2. عائلة القارب (الوعاء)', tr: '2. Çanak / Kayık Ailesi' },
    description: {
      id: 'Melengkung mendatar. Hanya dibedakan oleh jumlah dan letak titik.',
      en: 'A horizontal curve. Distinguished only by the number and position of dots.',
      ar: 'انحناء أفقي؛ لا تتميّز الحروف إلا بعدد النقاط وموضعها.',
      tr: 'Yatay bir kıvrım. Yalnızca nokta sayısı ve konumuyla ayırt edilirler.',
    },
    letters: [
      { id: 'ba', arab: 'ب', name: { id: 'Ba', en: 'Ba', ar: 'با', tr: 'Be' }, audio: 'ba', anatomy: { id: 'Merapatkan kedua bibir. Suara tertahan sejenak lalu dilepaskan.', en: 'Press both lips together. The sound is held briefly, then released.', ar: 'تُطبَق الشفتان معًا؛ يُحبَس الصوت لحظة ثم يُطلَق.', tr: 'İki dudak birbirine bastırılır. Ses kısa bir süre tutulur, sonra salınır.' }, logic: { id: 'Bentuk perahu dengan 1 titik di BAWAH. (Tips: B = Bawah).', en: 'A boat shape with 1 dot BELOW. (Tip: B = Below).', ar: 'شكل قارب مع نقطة واحدة تحت. (تذكير: الباء = نقطة تحت).', tr: 'Altında 1 nokta bulunan kayık biçimi. (İpucu: B = Below [altta]).' } },
      { id: 'ta', arab: 'ت', name: { id: 'Ta', en: 'Ta', ar: 'تا', tr: 'Te' }, audio: 'ta', anatomy: { id: 'Ujung lidah menempel pada pangkal gigi seri atas bagian dalam.', en: 'The tongue tip touches the inner base of the upper front teeth.', ar: 'يلمس طرف اللسان أصول الأسنان العليا من الداخل.', tr: 'Dil ucu, üst ön dişlerin iç köküne değer.' }, logic: { id: 'Bentuk perahu dengan 2 titik di ATAS. (Tips: T = Tinggi/Top).', en: 'A boat shape with 2 dots ABOVE. (Tip: T = Top).', ar: 'شكل قارب مع نقطتين فوق. (تذكير: التاء = نقطتان فوق).', tr: 'Üstünde 2 nokta bulunan kayık biçimi. (İpucu: T = Top [üstte]).' } },
      { id: 'tsa', arab: 'ث', name: { id: 'Tsa', en: 'Tsa', ar: 'ثا', tr: 'Se' }, audio: 'tsa', anatomy: { id: 'Ujung lidah sedikit dikeluarkan dan disentuh lembut oleh ujung gigi seri atas.', en: 'The tongue tip pokes out slightly and is gently touched by the upper front teeth.', ar: 'يبرز طرف اللسان قليلًا فتلمسه أطراف الأسنان العليا بلطف.', tr: 'Dil ucu hafifçe dışarı çıkar ve üst ön dişler tarafından yumuşakça değdirilir.' }, logic: { id: 'Bentuk perahu dengan 3 titik di ATAS. Titik ekstra menghasilkan desisan hembusan yang lebih banyak.', en: 'A boat shape with 3 dots ABOVE. The extra dot produces a stronger hiss.', ar: 'شكل قارب مع ثلاث نقاط فوق؛ النقطة الزائدة تزيد صفير الحرف.', tr: 'Üstünde 3 nokta bulunan kayık biçimi. Fazladan nokta daha güçlü bir tıslama oluşturur.' } },
    ],
  },
  {
    groupName: { id: '3. Keluarga Kepala Jangkar', en: '3. Anchor-Head Family', ar: '3. عائلة رأس المرساة', tr: '3. Çapa Başı Ailesi' },
    description: {
      id: 'Kepala mendatar dan perut melengkung besar menembus garis bawah.',
      en: 'A horizontal head with a large curving belly that drops below the line.',
      ar: 'رأس أفقي وبطن منحنٍ كبير ينزل تحت السطر.',
      tr: 'Satırın altına inen büyük kıvrık karınlı, yatay bir baş.',
    },
    letters: [
      { id: 'jim', arab: 'ج', name: { id: 'Jim', en: 'Jim', ar: 'جيم', tr: 'Cim' }, audio: 'ja', anatomy: { id: 'Tengah lidah menempel kuat pada langit-langit mulut. Terdapat efek tertahan.', en: 'The middle of the tongue presses firmly against the palate, with a held effect.', ar: 'يلتصق وسط اللسان بقوة بالحنك، مع أثر حبسٍ للصوت.', tr: 'Dilin orta kısmı damağa sıkıca yaslanır; ses bir an tutulur gibi bir etki vardır.' }, logic: { id: 'Bentuk kail dengan 1 titik di TENGAH perut. (Tips: J = Jantung).', en: 'A hook shape with 1 dot in the MIDDLE of the belly. (Tip: J = Jantung/heart).', ar: 'شكل خطّاف مع نقطة واحدة في وسط البطن. (تذكير: الجيم = نقطة في الوسط).', tr: 'Karnının ortasında 1 nokta bulunan kanca biçimi. (İpucu: J = Jantung [kalp]).' } },
      { id: 'ha', arab: 'ح', name: { id: 'Ha', en: 'Ha', ar: 'حا', tr: 'Ha' }, audio: 'ha', anatomy: { id: 'Keluar dari tengah tenggorokan. Menghasilkan hembusan udara hangat bersih.', en: 'Comes from the middle of the throat, producing a clean warm breath.', ar: 'يخرج من وسط الحلق بنفَسٍ دافئ صافٍ.', tr: 'Boğazın ortasından çıkar; temiz ve ılık bir nefes verir.' }, logic: { id: 'Bentuk kail POLOS tanpa titik sama sekali. Lambang kebersihan/hampa udara.', en: 'A PLAIN hook with no dots at all — a symbol of emptiness/clean air.', ar: 'خطّاف مجرّد بلا نقاط إطلاقًا — رمز الصفاء والفراغ.', tr: 'Hiç noktası bulunmayan sade bir kanca — boşluğun ve temiz havanın simgesi.' } },
      { id: 'kha', arab: 'خ', name: { id: 'Kha', en: 'Kha', ar: 'خا', tr: 'Hı' }, audio: 'kha', anatomy: { id: 'Keluar dari ujung pangkal tenggorokan. Ada efek gesekan kasar.', en: 'Comes from the upper end of the throat, with a rough scraping effect.', ar: 'يخرج من أعلى الحلق مع أثر خشونة واحتكاك.', tr: 'Boğazın üst ucundan çıkar; pürüzlü bir sıyırma etkisi vardır.' }, logic: { id: 'Bentuk kail dengan 1 titik di ATAS kepala. Ibarat debu di atas tenggorokan.', en: 'A hook with 1 dot ABOVE the head — like dust settling on the throat.', ar: 'خطّاف مع نقطة واحدة فوق الرأس — كغبارٍ يعلو الحلق.', tr: 'Başının üstünde 1 nokta bulunan kanca — boğazın üstüne çöken toz gibidir.' } },
    ],
  },
  {
    groupName: { id: '4. Keluarga Siku Patah', en: '4. Broken-Elbow Family', ar: '4. عائلة الزاوية المكسورة', tr: '4. Kırık Dirsek Ailesi' },
    description: {
      id: 'Garis menyudut seperti orang duduk atau mulut buaya.',
      en: 'An angled line, like a seated figure or a crocodile’s jaw.',
      ar: 'خط بزاوية، كشخصٍ جالس أو فم تمساح.',
      tr: 'Oturan bir insan ya da timsah çenesi gibi açılı bir çizgi.',
    },
    letters: [
      { id: 'dal', arab: 'د', name: { id: 'Dal', en: 'Dal', ar: 'دال', tr: 'Dal' }, audio: 'da', anatomy: { id: 'Ujung lidah menempel pada pangkal gigi seri atas (seperti makhraj Ta).', en: 'The tongue tip touches the base of the upper front teeth (like the Ta sound).', ar: 'يلمس طرف اللسان أصول الأسنان العليا (كمخرج التاء).', tr: 'Dil ucu, üst ön dişlerin köküne değer (Te mahreci gibi).' }, logic: { id: 'Sudut patah POLOS tanpa titik.', en: 'A PLAIN bent angle with no dot.', ar: 'زاوية مكسورة مجرّدة بلا نقطة.', tr: 'Noktası bulunmayan sade bir kırık açı.' } },
      { id: 'dzal', arab: 'ذ', name: { id: 'Dzal', en: 'Dzal', ar: 'ذال', tr: 'Zel' }, audio: 'dza', anatomy: { id: 'Ujung lidah sedikit dikeluarkan dan disentuh gigi seri atas (seperti makhraj Tsa).', en: 'The tongue tip pokes out slightly to meet the upper front teeth (like the Tsa sound).', ar: 'يبرز طرف اللسان قليلًا ليلتقي الأسنان العليا (كمخرج الثاء).', tr: 'Dil ucu hafifçe dışarı çıkarak üst ön dişlerle buluşur (Se mahreci gibi).' }, logic: { id: 'Sudut patah dengan 1 titik di ATAS. Titik menandakan getaran ekstra di ujung lidah.', en: 'A bent angle with 1 dot ABOVE. The dot marks extra vibration at the tongue tip.', ar: 'زاوية مكسورة مع نقطة واحدة فوق؛ النقطة تشير إلى اهتزاز إضافي في طرف اللسان.', tr: 'Üstünde 1 nokta bulunan kırık açı. Nokta, dil ucundaki ek titreşimi gösterir.' } },
    ],
  },
  {
    groupName: { id: '5. Keluarga Seluncuran', en: '5. Slide Family', ar: '5. عائلة الانزلاق', tr: '5. Kaydırak Ailesi' },
    description: {
      id: 'Garis yang meluncur melengkung ke bawah menembus batas baris.',
      en: 'A line that slides downward in a curve, breaking past the baseline.',
      ar: 'خط ينزلق منحنيًا إلى الأسفل مخترقًا حدّ السطر.',
      tr: 'Kıvrılarak aşağı kayan ve satır çizgisini aşan bir çizgi.',
    },
    letters: [
      { id: 'ra', arab: 'ر', name: { id: 'Ra', en: 'Ra', ar: 'را', tr: 'Ra' }, audio: 'ro', anatomy: { id: 'Ujung lidah menyentuh gusi atas agak ke dalam dengan sedikit getaran (takrir).', en: 'The tongue tip touches the upper gum a little inward, with a slight trill (takrir).', ar: 'يلمس طرف اللسان اللثة العليا من الداخل قليلًا مع اهتزاز خفيف (تكرير).', tr: 'Dil ucu, biraz içeriden üst diş etine değerek hafifçe titrer (tekrir).' }, logic: { id: 'Melengkung ke bawah POLOS tanpa titik.', en: 'A downward curve, PLAIN with no dot.', ar: 'انحناءة نازلة مجرّدة بلا نقطة.', tr: 'Aşağı doğru inen bir kıvrım; noktası yok, sade.' } },
      { id: 'zai', arab: 'ز', name: { id: 'Zai', en: 'Zai', ar: 'زاي', tr: 'Ze' }, audio: 'za', anatomy: { id: 'Ujung lidah menempel di belakang gigi seri bawah. Menghasilkan suara desisan tajam (lebah).', en: 'The tongue tip sits behind the lower front teeth, making a sharp buzz (like a bee).', ar: 'يستقر طرف اللسان خلف الأسنان السفلى محدثًا أزيزًا حادًّا (كأزيز النحلة).', tr: 'Dil ucu, alt ön dişlerin arkasına yerleşir; keskin bir vızıltı çıkarır (arı gibi).' }, logic: { id: 'Melengkung ke bawah dengan 1 titik di ATAS. Titik lambang dengungan lebah.', en: 'A downward curve with 1 dot ABOVE — the dot symbolises the bee’s buzz.', ar: 'انحناءة نازلة مع نقطة واحدة فوق — النقطة رمز أزيز النحلة.', tr: 'Üstünde 1 nokta bulunan aşağı inen kıvrım — nokta, arının vızıltısını simgeler.' } },
      { id: 'wau', arab: 'و', name: { id: 'Wau', en: 'Wau', ar: 'واو', tr: 'Vav' }, audio: 'wa', anatomy: { id: 'Kedua bibir dimajukan dan dibulatkan ke depan (monyong), menyisakan celah kecil.', en: 'Both lips push forward and round (pursed), leaving a small opening.', ar: 'تتبرّمان الشفتان وتستديران إلى الأمام تاركَين فتحة صغيرة.', tr: 'İki dudak ileri uzanıp yuvarlanır (büzülür) ve küçük bir açıklık kalır.' }, logic: { id: 'Mirip Ra, namun memiliki kepala bulat penuh tertutup di ujung atasnya.', en: 'Like Ra, but with a full round head closed off at the top.', ar: 'تشبه الراء، لكن برأسٍ مستدير مغلق تمامًا في أعلاها.', tr: 'Ra gibidir, ama tepesinde tümüyle kapalı yuvarlak bir baş taşır.' } },
    ],
  },
  {
    groupName: { id: '6. Keluarga Gigi Gergaji', en: '6. Sawtooth Family', ar: '6. عائلة أسنان المنشار', tr: '6. Testere Dişi Ailesi' },
    description: {
      id: 'Memiliki bentuk seperti sisir atau gigi kecil di awalnya.',
      en: 'Begins with a comb-like row of small teeth.',
      ar: 'تبدأ بصفّ أسنان صغيرة كالمشط.',
      tr: 'Başında tarak gibi küçük dişlerden oluşan bir dizi bulunur.',
    },
    letters: [
      { id: 'sin', arab: 'س', name: { id: 'Sin', en: 'Sin', ar: 'سين', tr: 'Sin' }, audio: 'sa', anatomy: { id: 'Ujung lidah di belakang gigi seri bawah. Udara berdesis mengalir (seperti suara ular).', en: 'The tongue tip behind the lower front teeth. Air hisses through (like a snake).', ar: 'طرف اللسان خلف الأسنان السفلى يمرّ الهواء مصفيرًا (كهسيس الأفعى).', tr: 'Dil ucu alt ön dişlerin arkasındadır. Hava tıslayarak akar (yılan sesi gibi).' }, logic: { id: 'Tiga gigi gergaji POLOS. Disusul mangkuk besar di akhirnya.', en: 'Three PLAIN sawtooth peaks, followed by a large bowl at the end.', ar: 'ثلاثة أسنان منشار مجرّدة، يتبعها وعاء كبير في النهاية.', tr: 'Üç sade testere dişi; sonunda büyük bir çanak yer alır.' } },
      { id: 'syin', arab: 'ش', name: { id: 'Syin', en: 'Syin', ar: 'شين', tr: 'Şın' }, audio: 'sya', anatomy: { id: 'Tengah lidah menempel pada langit-langit (tanpa merapat). Udara menyebar ke seluruh mulut.', en: 'The middle of the tongue nears the palate (without touching); air spreads across the whole mouth.', ar: 'يقترب وسط اللسان من الحنك دون التصاق، وينتشر الهواء في كامل الفم.', tr: 'Dilin ortası damağa yaklaşır (değmeden); hava tüm ağza yayılır.' }, logic: { id: 'Tiga gigi gergaji dengan 3 titik di ATAS. Titik melambangkan udara yang menyebar luas.', en: 'Three sawtooth peaks with 3 dots ABOVE — symbolising air spreading widely.', ar: 'ثلاثة أسنان منشار مع ثلاث نقاط فوق — رمز انتشار الهواء الواسع.', tr: 'Üstünde 3 nokta bulunan üç testere dişi — havanın genişçe yayılmasını simgeler.' } },
    ],
  },
  {
    groupName: { id: '7. Keluarga Oval Berekor', en: '7. Tailed-Oval Family', ar: '7. عائلة البيضاوية المذنّبة', tr: '7. Kuyruklu Oval Ailesi' },
    description: {
      id: 'Kepala berbentuk bulat lonjong/oval dengan perut melengkung besar.',
      en: 'An oval/round head with a large curving belly.',
      ar: 'رأس بيضاوي مستدير مع بطنٍ منحنٍ كبير.',
      tr: 'Yuvarlak/oval bir baş ve büyük kıvrımlı bir karın.',
    },
    letters: [
      { id: 'shad', arab: 'ص', name: { id: 'Shad', en: 'Shad', ar: 'صاد', tr: 'Sad' }, audio: 'sho', anatomy: { id: 'Seperti Sin, tapi pangkal lidah diangkat ke atas, membuat suara menjadi tebal/berat.', en: 'Like Sin, but the back of the tongue rises, making the sound heavy/full.', ar: 'كالسين، لكن يرتفع أقصى اللسان فيغدو الصوت مفخّمًا ثقيلًا.', tr: 'Sin gibidir, ama dilin arkası yükselir ve ses kalınlaşıp ağırlaşır.' }, logic: { id: 'Kepala oval dengan perut besar, POLOS tanpa titik.', en: 'An oval head with a large belly, PLAIN with no dot.', ar: 'رأس بيضاوي ببطنٍ كبير، مجرّد بلا نقطة.', tr: 'Büyük karınlı oval başlı, noktası bulunmayan sade bir harf.' } },
      { id: 'dhad', arab: 'ض', name: { id: 'Dhad', en: 'Dhad', ar: 'ضاد', tr: 'Dad' }, audio: 'dho', anatomy: { id: 'Sisi lidah (kanan/kiri) menempel pada gigi geraham atas. Ini huruf Arab yang paling unik.', en: 'The side of the tongue touches the upper molars. The most distinctive Arabic letter.', ar: 'يلامس جانب اللسان (الأيمن أو الأيسر) الأضراس العليا؛ وهو أكثر الحروف العربية تميّزًا.', tr: 'Dilin yanı üst azı dişlere değer. Arapçanın en ayırt edici harfidir.' }, logic: { id: 'Kepala oval dengan perut besar dan 1 titik di ATAS.', en: 'An oval head with a large belly and 1 dot ABOVE.', ar: 'رأس بيضاوي ببطنٍ كبير ونقطة واحدة فوق.', tr: 'Büyük karınlı oval başlı, üstünde 1 nokta bulunan bir harf.' } },
    ],
  },
  {
    groupName: { id: '8. Keluarga Oval Bertiang', en: '8. Oval-on-a-Pillar Family', ar: '8. عائلة البيضاوية على عمود', tr: '8. Sütun Üzerine Oturmuş Oval Ailesi' },
    description: {
      id: 'Kepala bulat lonjong yang ditancapkan tiang lurus tegak di atasnya.',
      en: 'A round oval head planted on a straight upright pillar.',
      ar: 'رأس بيضاوي مغروز فيه عمود مستقيم قائم.',
      tr: 'Dümdüz dik bir sütunun üzerine oturtulmuş yuvarlak oval bir baş.',
    },
    letters: [
      { id: 'tha', arab: 'ط', name: { id: 'Tha', en: 'Tha', ar: 'طا', tr: 'Tı' }, audio: 'tho', anatomy: { id: 'Seperti Ta, tapi pangkal lidah diangkat. Suara meletup dan tebal (Qalqalah).', en: 'Like Ta, but the back of the tongue rises — a heavy, popping sound (Qalqalah).', ar: 'كالتاء، لكن يرتفع أقصى اللسان — صوت مفخّم قافل (قلقلة).', tr: 'Te gibidir, ama dilin arkası yükselir — kalın, patlamalı bir sestir (Kalkale).' }, logic: { id: 'Oval dengan tiang, POLOS tanpa titik.', en: 'An oval on a pillar, PLAIN with no dot.', ar: 'بيضاوية على عمود، مجرّدة بلا نقطة.', tr: 'Sütun üzerine oturmuş oval; noktası yok, sade.' } },
      { id: 'zha', arab: 'ظ', name: { id: 'Zha', en: 'Zha', ar: 'ظا', tr: 'Zı' }, audio: 'zho', anatomy: { id: 'Seperti Dzal, tapi pangkal lidah diangkat. Suara tebal dan berdengung.', en: 'Like Dzal, but the back of the tongue rises — a heavy, buzzing sound.', ar: 'كالذال، لكن يرتفع أقصى اللسان — صوت مفخّم بأزيز.', tr: 'Zel gibidir, ama dilin arkası yükselir — kalın ve vızıltılı bir sestir.' }, logic: { id: 'Oval dengan tiang dan 1 titik di ATAS.', en: 'An oval on a pillar with 1 dot ABOVE.', ar: 'بيضاوية على عمود مع نقطة واحدة فوق.', tr: 'Sütun üzerine oturmuş, üstünde 1 nokta bulunan oval.' } },
    ],
  },
  {
    groupName: { id: '9. Keluarga Cangkang Terbuka', en: '9. Open-Shell Family', ar: '9. عائلة الصدفة المفتوحة', tr: '9. Açık Kabuk Ailesi' },
    description: {
      id: 'Bentuk setengah lingkaran kecil di atas, dengan mangkuk besar di bawah.',
      en: 'A small half-circle on top with a large bowl below.',
      ar: 'نصف دائرة صغيرة في الأعلى ووعاء كبير في الأسفل.',
      tr: 'Üstte küçük bir yarım daire, altta büyük bir çanak.',
    },
    letters: [
      { id: 'ain', arab: 'ع', name: { id: "'Ain", en: "'Ain", ar: 'عين', tr: 'Ayn' }, audio: "a'a", anatomy: { id: 'Dari tengah tenggorokan (katup napas). Suara terasa ditekan dan berat.', en: 'From the middle of the throat (the windpipe). The sound feels pressed and heavy.', ar: 'من وسط الحلق (مجرى النفس)؛ يُحسّ الصوت مضغوطًا ثقيلًا.', tr: 'Boğazın ortasından (nefes borusunun kapakçığından) çıkar. Ses baskılı ve ağır duyulur.' }, logic: { id: 'Mulut terbuka POLOS tanpa titik.', en: 'An open mouth, PLAIN with no dot.', ar: 'فم مفتوح مجرّد بلا نقطة.', tr: 'Açık bir ağız; noktası yok, sade.' } },
      { id: 'ghain', arab: 'غ', name: { id: 'Ghain', en: 'Ghain', ar: 'غين', tr: 'Gayn' }, audio: 'gho', anatomy: { id: 'Dari pangkal tenggorokan sebelah atas. Bergetar lembut seperti berkumur.', en: 'From the upper back of the throat, vibrating gently like gargling.', ar: 'من أعلى أقصى الحلق، يهتز بلطف كالمضمضة.', tr: 'Boğazın üst arka tarafından çıkar; ağız çalkalarmış gibi hafifçe titrer.' }, logic: { id: 'Mulut terbuka dengan 1 titik di ATAS (lambang kumur air).', en: 'An open mouth with 1 dot ABOVE (symbolising rinsing/gargling).', ar: 'فم مفتوح مع نقطة واحدة فوق (رمز المضمضة).', tr: 'Üstünde 1 nokta bulunan açık ağız (ağız çalkalamayı simgeler).' } },
    ],
  },
  {
    groupName: { id: '10. Keluarga Kepala Membulat', en: '10. Round-Head Family', ar: '10. عائلة الرأس المستدير', tr: '10. Yuvarlak Baş Ailesi' },
    description: {
      id: 'Bentuk kepala bulat berrongga di bagian atas.',
      en: 'A hollow round head at the top.',
      ar: 'رأس مستدير مجوّف في الأعلى.',
      tr: 'Üstte içi oyuk, yuvarlak bir baş.',
    },
    letters: [
      { id: 'fa', arab: 'ف', name: { id: 'Fa', en: 'Fa', ar: 'فا', tr: 'Fe' }, audio: 'fa', anatomy: { id: 'Perut bibir bawah bagian dalam menempel pada ujung gigi seri atas.', en: 'The inner lower lip meets the edge of the upper front teeth.', ar: 'يلامس باطن الشفة السفلى أطراف الأسنان العليا.', tr: 'Alt dudağın iç kısmı, üst ön dişlerin kenarına değer.' }, logic: { id: 'Kepala bulat berrongga mendatar, dengan 1 titik di ATAS.', en: 'A hollow horizontal round head, with 1 dot ABOVE.', ar: 'رأس مستدير مجوّف أفقي مع نقطة واحدة فوق.', tr: 'İçi oyuk, yatay yuvarlak bir baş; üstünde 1 nokta bulunur.' } },
      { id: 'qaf', arab: 'ق', name: { id: 'Qaf', en: 'Qaf', ar: 'قاف', tr: 'Kaf' }, audio: 'qo', anatomy: { id: 'Pangkal lidah paling dalam menempel pada langit-langit lunak. Suara memantul tebal.', en: 'The very back of the tongue touches the soft palate. A heavy, bouncing sound.', ar: 'يلامس أقصى اللسان اللهاة (الحنك اللين) — صوت مفخّم مرتدّ.', tr: 'Dilin en gerisi yumuşak damağa değer. Kalın ve sekmeli bir sestir.' }, logic: { id: 'Kepala bulat dengan mangkuk ke bawah, dan 2 titik di ATAS.', en: 'A round head with a downward bowl, and 2 dots ABOVE.', ar: 'رأس مستدير مع وعاء نازل ونقطتين فوق.', tr: 'Aşağı bakan çanağı olan yuvarlak bir baş ve üstünde 2 nokta.' } },
    ],
  },
  {
    groupName: { id: '11. Bentuk Unik (Karakteristik Mandiri)', en: '11. Unique Shapes (standalone)', ar: '11. أشكال فريدة (مستقلة بذاتها)', tr: '11. Özgün Biçimler (bağımsız)' },
    description: {
      id: 'Huruf-huruf dengan bentuk spesifik yang tidak bisa dikelompokkan dengan yang lain.',
      en: 'Letters with specific shapes that don’t fit the other families.',
      ar: 'حروف بأشكال خاصة لا تنضم إلى العائلات الأخرى.',
      tr: 'Diğer ailelere uymayan, kendine özgü biçimli harfler.',
    },
    letters: [
      { id: 'mim', arab: 'م', name: { id: 'Mim', en: 'Mim', ar: 'ميم', tr: 'Mim' }, audio: 'ma', anatomy: { id: 'Bibir atas dan bawah merapat sempurna dengan suara dengung dari hidung.', en: 'Upper and lower lips close fully, with a nasal hum.', ar: 'تُطبَق الشفتان إطباقًا تامًّا مع غنّةٍ من الأنف.', tr: 'Üst ve alt dudak tamamen kapanır; burundan gelen bir uğultu duyulur.' }, logic: { id: 'Kepala bundar kecil menghadap ke bawah, diakhiri garis vertikal lurus ke bawah.', en: 'A small round head facing down, ending in a straight vertical stroke.', ar: 'رأس مستدير صغير مواجه للأسفل، ينتهي بخط عمودي مستقيم نازل.', tr: 'Aşağı bakan küçük yuvarlak bir baş, dümdüz dikey bir çizgiyle sona erer.' } },
      { id: 'nun', arab: 'ن', name: { id: 'Nun', en: 'Nun', ar: 'نون', tr: 'Nun' }, audio: 'na', anatomy: { id: 'Ujung lidah menempel pada gusi atas. Sebagian suara keluar dari rongga hidung.', en: 'The tongue tip touches the upper gum; some sound escapes through the nose.', ar: 'يلمس طرف اللسان اللثة العليا، ويخرج جزء من الصوت من الأنف.', tr: 'Dil ucu üst diş etine değer; sesin bir kısmı burundan kaçar.' }, logic: { id: 'Mangkuk simetris dalam setengah lingkaran, dengan 1 titik persis di TENGAH.', en: 'A deep symmetrical half-circle bowl, with 1 dot exactly in the MIDDLE.', ar: 'وعاء متناظر عميق على هيئة نصف دائرة، مع نقطة واحدة في المنتصف تمامًا.', tr: 'Derin ve simetrik yarım daire biçimli bir çanak; tam ortasında 1 nokta.' } },
      { id: 'ha2', arab: 'هـ', name: { id: 'Ha Besar', en: 'Big Ha', ar: 'هاء', tr: 'Büyük He' }, audio: 'haa', anatomy: { id: 'Dari pangkal tenggorokan paling bawah (dekat dada). Seperti orang menghela napas panjang.', en: 'From the very bottom of the throat (near the chest), like a long sigh.', ar: 'من أقصى الحلق أسفله (قرب الصدر) — كتنهيدةٍ طويلة.', tr: 'Boğazın en alt kısmından (göğüse yakın) çıkar; uzun bir iç çekiş gibidir.' }, logic: { id: 'Bentuk simpul ikatan atau dua lubang mata yang saling menumpuk.', en: 'A knotted shape, or two eye-holes stacked on each other.', ar: 'شكل عقدة، أو فتحتَي عينٍ متراكبتين.', tr: 'Bir düğüm biçimi ya da üst üste binmiş iki göz çukuru.' } },
      { id: 'ya', arab: 'ي', name: { id: 'Ya', en: 'Ya', ar: 'يا', tr: 'Ye' }, audio: 'ya', anatomy: { id: 'Tengah lidah diangkat mendekati langit-langit mulut.', en: 'The middle of the tongue rises toward the palate.', ar: 'يرتفع وسط اللسان مقتربًا من الحنك.', tr: 'Dilin orta kısmı damağa doğru yükselir.' }, logic: { id: 'Bentuk seperti angsa berenang, dengan 2 titik di BAWAH perutnya.', en: 'Shaped like a swimming swan, with 2 dots BELOW its belly.', ar: 'على هيئة بجعةٍ تسبح، مع نقطتين تحت بطنها.', tr: 'Yüzen bir kuğu biçimindedir; karnının altında 2 nokta bulunur.' } },
    ],
  },
];

// ---------------------------------------------------------------------------
// PHASE 3 — Logika Menyambung (how letters connect).
// ---------------------------------------------------------------------------

export const V2_WORDS: JoinWord[] = [
  {
    id: 'kataba',
    label: 'كَتَبَ',
    meaning: { id: 'Menulis', en: 'To write', ar: 'الكتابة', tr: 'Yazmak' },
    audio: 'kataba',
    letters: [
      { isolated: 'ك', form: 'ﻛ', position: 'Awal', logic: { id: "Huruf Kaf kehilangan 'dudukan/sepatu' bawahnya. Bentuknya diratakan agar sejajar dengan garis dasar untuk menggandeng huruf di kirinya.", en: "Kaf loses its lower 'shoe'. It’s flattened flush to the baseline so it can link to the letter on its left.", ar: 'يُفقد الكاف "حذاءه" السفلي، ويُسطَّح على مستوى السطر كي يتصل بالحرف الذي على يساره.', tr: 'Kef, altındaki "ayakkabısını" yitirir. Soldaki harfe bağlanabilmek için satır çizgisi düzeyine kadar düzleştirilir.' } },
      { isolated: 'ت', form: 'ﺘ', position: 'Tengah', logic: { id: "Huruf Ta yang aslinya berbentuk mangkuk, kini membuka kedua 'lengannya' ke kanan dan kiri untuk berpegangan erat.", en: "Ta, originally a bowl, now opens both 'arms' left and right to grip its neighbours.", ar: 'التاء — وكانت وعاءً — تفتح "ذراعيها" يمينًا ويسارًا لتتشبث بجاراتها.', tr: 'Te, aslında bir çanaktır; şimdi iki "kolunu" sağa ve sola açarak komşularına sıkıca tutunur.' } },
      { isolated: 'ب', form: 'ﺐ', position: 'Akhir', logic: { id: 'Huruf Ba berada di akhir. Ia menutup lengannya sebelah kiri (mengembalikan bentuk mangkuk aslinya) sebagai penutup kata.', en: 'Ba is at the end. It closes its left arm (returning to its bowl shape) to cap the word.', ar: 'الباء في الآخر: تُغلِق ذراعها اليسرى (عودةً إلى شكل الوعاء) لتختم الكلمة.', tr: 'Be kelimenin sonundadır. Kelimeyi kapatmak için sol kolunu kapatır (çanak biçimine geri döner).' } },
    ],
    connectedText: 'كَتَبَ',
  },
  {
    id: 'masjid',
    label: 'مَسْجِد',
    meaning: { id: 'Masjid', en: 'Mosque', ar: 'المسجد', tr: 'Cami' },
    audio: 'masjid',
    letters: [
      { isolated: 'م', form: 'ﻣ', position: 'Awal', logic: { id: 'Ekor panjang Mim yang menembus ke bawah dipotong habis. Menyisakan kepalanya saja yang sejajar garis dasar.', en: "Mim’s long downward tail is cut off entirely, leaving just its head on the baseline.", ar: 'يُقطَع ذيل الميم النازل الطويل كله، فلا يبقى إلا رأسها على مستوى السطر.', tr: "Mim'in aşağı inen uzun kuyruğu tamamen kesilir; satır çizgisi üzerinde yalnızca başı kalır." } },
      { isolated: 'س', form: 'ﺴ', position: 'Tengah', logic: { id: 'Mangkuk/perut besar Sin dihilangkan. Hanya 3 gigi gergajinya yang tersisa untuk berpegangan di tengah.', en: 'Sin’s large bowl/belly is gone; only its 3 sawtooth peaks remain to link in the middle.', ar: 'يختفي وعاء السين الكبير، وتبقى أسنانه الثلاث لتتعلّق في الوسط.', tr: "Sin'in büyük çanağı/karnı yok olur; ortada bağlanmak için yalnızca 3 testere dişi kalır." } },
      { isolated: 'ج', form: 'ﺠ', position: 'Tengah', logic: { id: 'Perut besar Jim dipotong menjadi garis lurus mendatar. Titiknya yang semula di dalam perut, kini berada di bawah garis.', en: "Jim’s big belly is trimmed to a flat line. Its dot moves from inside the belly to below the line.", ar: 'يُقصّ بطن الجيم الكبير إلى خط مستقيم أفقي، وتنتقل نقطته من داخل البطن إلى تحت الخط.', tr: "Cim'in büyük karnı düz bir çizgiye kadar kesilir. Noktası karnın içinden çizginin altına taşar." } },
      { isolated: 'د', form: 'ﺪ', position: 'Akhir', logic: { id: "Dal adalah 'Huruf Sombong' (tidak bisa menyambung ke kiri). Di akhir, ia hanya berpegangan ke huruf sebelumnya di sebelah kanan.", en: "Dal is a 'selfish letter' — it can’t connect forward. At the end it only holds onto the letter before it.", ar: 'الدال "حرف أنانيّ" لا يتصل بما بعده؛ في الآخر يتشبث فقط بالحرف الذي قبله.', tr: 'Dal "bencil harf"tir — ileriye bağlanamaz. Sonda yalnızca kendinden önceki harfe tutunur.' } },
    ],
    connectedText: 'مَسْجِد',
  },
  {
    id: 'qalam',
    label: 'قَلَم',
    meaning: { id: 'Pena', en: 'Pen', ar: 'القلم', tr: 'Kalem' },
    audio: 'qalam',
    letters: [
      { isolated: 'ق', form: 'ﻗ', position: 'Awal', logic: { id: 'Qaf membuang lengkungan perut besarnya; hanya kepala oval dengan 2 titik di atas yang tersisa untuk menggandeng huruf di kirinya.', en: 'Qaf drops its large curving belly; only the oval head with 2 dots above remains to link left.', ar: 'يُلقي القاف بطنه الكبير المنحني، فلا يبقى إلا الرأس البيضاوي بنقطتين فوقه ليتصل بما على يساره.', tr: 'Kaf, büyük kıvrık karnını bırakır; sola bağlanmak için üstünde 2 nokta bulunan oval başı kalır.' } },
      { isolated: 'ل', form: 'ﻠ', position: 'Tengah', logic: { id: 'Lam membuka kailnya ke kanan dan ke kiri, menjadi jembatan lurus di tengah kata.', en: 'Lam opens its hook both left and right, becoming a straight bridge through the middle of the word.', ar: 'يفتح اللام خطّافه يمينًا ويسارًا فيصير جسرًا مستقيمًا في وسط الكلمة.', tr: 'Lam kancasını hem sağa hem sola açar; kelimenin ortasında dümdüz bir köprü olur.' } },
      { isolated: 'م', form: 'ﻢ', position: 'Akhir', logic: { id: 'Mim menutup ekor panjangnya dan kembali ke kepala bundarnya sebagai penutup kata.', en: 'Mim closes its long tail and returns to its round head to cap the word.', ar: 'يُغلِق الميم ذيله الطويل ويعود إلى رأسه المستدير ليختم الكلمة.', tr: 'Mim uzun kuyruğunu kapatır ve kelimeyi bitirmek için yuvarlak başına döner.' } },
    ],
    connectedText: 'قَلَم',
  },
  {
    id: 'bism',
    label: 'بِسْمِ',
    meaning: { id: 'Nama', en: 'Name', ar: 'الاسم', tr: 'İsim' },
    audio: 'bismi',
    letters: [
      { isolated: 'ب', form: 'ﺑ', position: 'Awal', logic: { id: "Ba membuka 'lengannya' ke kiri, siap menggandeng huruf berikutnya.", en: "Ba opens its 'arm' to the left, ready to link to the next letter.", ar: 'تفتح الباء "ذراعها" إلى اليسار مستعدةً للاتصال بالحرف التالي.', tr: 'Be, "kolunu" sola açar; bir sonraki harfe bağlanmaya hazırdır.' } },
      { isolated: 'س', form: 'ﺴ', position: 'Tengah', logic: { id: 'Sin hanya menyisakan 3 gigi gergajinya di tengah; perut besarnya hilang agar muat berpegangan.', en: 'Sin keeps only its 3 sawtooth peaks in the middle; its big belly vanishes so it can link.', ar: 'يبقي السين أسنانه الثلاث في الوسط فقط، ويختفي بطنه الكبير ليتسع للتشبث.', tr: 'Sin, ortada yalnızca 3 testere dişini korur; bağlanabilmek için büyük karnı yok olur.' } },
      { isolated: 'م', form: 'ﻢ', position: 'Akhir', logic: { id: 'Mim menutup ekornya, kembali ke kepala bundar sebagai penutup kata.', en: 'Mim closes its tail, returning to its round head to cap the word.', ar: 'يُغلِق الميم ذيله ويعود إلى رأسه المستدير ليختم الكلمة.', tr: 'Mim kuyruğunu kapatır ve kelimeyi bitirmek için yuvarlak başına döner.' } },
    ],
    connectedText: 'بِسْمِ',
  },
  {
    id: 'najm',
    label: 'نَجْم',
    meaning: { id: 'Bintang', en: 'Star', ar: 'النجم', tr: 'Yıldız' },
    audio: 'najm',
    letters: [
      { isolated: 'ن', form: 'ﻧ', position: 'Awal', logic: { id: 'Nun membuka mangkuknya ke kiri; titiknya ikut menyisir menyamping untuk menggandeng huruf berikutnya.', en: 'Nun opens its bowl to the left; its dot shifts sideways to link to the next letter.', ar: 'تفتح النون وعاءها إلى اليسار، وتزحف نقطتها جانبيًا لتتصل بالحرف التالي.', tr: 'Nun çanağını sola açar; noktası bir sonraki harfe bağlanmak için yana kayar.' } },
      { isolated: 'ج', form: 'ﺠ', position: 'Tengah', logic: { id: 'Perut besar Jim dipotong rata; titiknya turun di bawah garis saat berada di tengah.', en: "Jim’s big belly is trimmed flat; its dot drops below the line in the medial position.", ar: 'يُقصّ بطن الجيم الكبير مستويًا، وتنزل نقطته تحت الخط في الوضع الوسطي.', tr: "Cim'in büyük karnı düz kesilir; ortada bulunurken noktası çizginin altına iner." } },
      { isolated: 'م', form: 'ﻢ', position: 'Akhir', logic: { id: 'Mim menutup ekornya, kembali ke kepala bundar sebagai penutup kata.', en: 'Mim closes its tail, returning to its round head to cap the word.', ar: 'يُغلِق الميم ذيله ويعود إلى رأسه المستدير ليختم الكلمة.', tr: 'Mim kuyruğunu kapatır ve kelimeyi bitirmek için yuvarlak başına döner.' } },
    ],
    connectedText: 'نَجْم',
  },
];

// ---------------------------------------------------------------------------
// PHASE 4 — Rambu Suara (harakat as "traffic signs").
// ---------------------------------------------------------------------------

export const V3_RULES: HarakatRule[] = [
  {
    id: 'sukun',
    title: { id: 'Sukun', en: 'Sukun', ar: 'السكون', tr: 'Sükun' },
    subtitle: { id: '(Mati / Rem)', en: '(Stop / Brake)', ar: '(توقيف / فرملة)', tr: '(Dur / Fren)' },
    icon: 'hand-paper',
    analogyIcon: 'car',
    analogy: { id: 'Sukun itu ibarat <strong>mengerem mobil</strong> secara mendadak. Suara berhenti seketika di huruf tersebut tanpa diberi vokal (a, i, u).', en: 'Sukun is like <strong>braking a car</strong> suddenly. The sound stops dead on that letter, with no vowel (a, i, u) added.', ar: 'السكون ك<strong>فرملة سيارة</strong> مفاجئة: يتوقف الصوت فورًا عند الحرف دون إضافة أي حركة (فَتحة أو كسرة أو ضمة).', tr: 'Sükun, bir arabayı aniden <strong>frenlemek</strong> gibidir. Ses, üzerine hareke (a, i, u) eklenmeden o harfte tam olarak durur.' },
    mechanics: { id: 'Kunci rapat posisi mulut (makhraj) pada huruf yang bersukun dan hentikan aliran napas atau suara di titik tersebut.', en: 'Lock the mouth position (makhraj) on the sukun letter and stop the flow of breath/sound right there.', ar: 'أوصِد وضع الفم (المخرج) على الحرف الساكن، وأوقف جرَيان النفس أو الصوت عند ذلك الموضع بالضبط.', tr: 'Sükunlu harfte ağzın konumunu (mahreç) kilitli gibi sabit tutun ve nefes ya da ses akışını tam o noktada kesin.' },
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
    title: { id: 'Tasydid', en: 'Tasydid', ar: 'التشديد', tr: 'Şedde' },
    subtitle: { id: '(Ganda / Tahan)', en: '(Doubled / Held)', ar: '(مضاعَف / ممسوك)', tr: '(İkilenmiş / Tutulmuş)' },
    icon: 'compress',
    analogyIcon: 'road',
    analogy: { id: 'Tasydid ibarat melewati <strong>polisi tidur</strong>. Anda harus mengerem (menahan) sejenak, lalu baru mengegas (melepas) kembali.', en: 'Tasydid is like driving over a <strong>speed bump</strong>. You brake (hold) briefly, then accelerate (release) again.', ar: 'التشديد كاجتياز <strong>مطبّات السرعة</strong>: تكبح (تُمسِك) لحظة ثم تتسارع (تُطلِق) من جديد.', tr: 'Şedde, üzerinden geçilen bir <strong>hız tümseğine</strong> benzer. Kısa süre fren yapar (tutarsınız), ardından tekrar hızlanırsınız (bırakırsınız).' },
    mechanics: { id: 'Huruf bertasydid sebenarnya adalah dua huruf yang sama. Huruf pertama mati (ditahan), huruf kedua hidup (dilepas). Contoh: Rab-ba.', en: 'A tasydid letter is really two of the same letter: the first is silent (held), the second is vowelled (released). E.g. Rab-ba.', ar: 'الحرف المشدَّد هو في الحقيقة حرفان من جنس واحد: الأول ساكن (ممسوك) والثاني متحرك (مُطلَق). مثال: رَبْ-بَ.', tr: 'Şeddeli harf aslında aynı harften ikisi demektir: ilki sessizdir (tutulur), ikincisi harekelidir (bırakılır). Örnek: Rab-ba.' },
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
    title: { id: 'Tanwin', en: 'Tanwin', ar: 'التنوين', tr: 'Tenvin' },
    subtitle: { id: "(Akhiran 'N')", en: "(Final 'N')", ar: '(نون في الآخر)', tr: "(Sondaki 'N')" },
    icon: 'coins',
    analogyIcon: 'coins',
    analogy: { id: "Tanwin ibarat menjatuhkan <strong>koin ke dalam kaleng</strong>. Apapun hurufnya, selalu diakhiri dengan bunyi dering 'N' di ujungnya (an, in, un).", en: "Tanwin is like <strong>dropping a coin into a tin</strong>. Whatever the letter, it always ends with a ringing 'N' (an, in, un).", ar: 'التنوين كإسقاط <strong>عملة في علبةٍ معدنية</strong>: مهما يكن الحرف، يُختَم الصوت دائمًا برنين النون الساكنة في آخره.', tr: "Tenvin, <strong>teneke kutuya para atmak</strong> gibidir. Harf her ne olursa olsun, sonda her zaman çınlayan bir 'N' sesiyle biter (an, in, un)." },
    mechanics: { id: "Cukup tambahkan bunyi huruf 'N' mati di akhir vokal. Bunyi ini dikeluarkan dengan menyentuhkan ujung lidah ke langit-langit (makhraj Nun).", en: "Just add a silent 'N' sound after the final vowel, made by touching the tongue tip to the palate (the Nun articulation).", ar: 'أضف فقط صوت النون الساكنة بعد الحركة الأخيرة، ويُخرَج بملمس طرف اللسان للحنك (مخرج النون).', tr: "Son harekenin ardından yalnızca sessiz bir 'N' sesi ekleyin; bu ses, dil ucunu damağa değdirerek çıkarılır (Nun mahreci)." },
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
    title: { id: 'Ghunnah', en: 'Ghunnah', ar: 'الغنّة', tr: 'Gunne' },
    subtitle: { id: '(Getaran Hidung)', en: '(Nasal Buzz)', ar: '(رنين أنفي)', tr: '(Burun Uğultusu)' },
    icon: 'vibrate',
    analogyIcon: 'vibrate',
    arab: 'إِنَّ',
    latin: 'Innn - na',
    type: 'vibrate',
    duration: 2000,
    analogy: { id: 'Ibarat <strong>seekor lebah</strong> yang terperangkap di dalam hidung Anda. Suara ditahan dan digetarkan dengan durasi 2-3 ketukan penuh.', en: 'Like a <strong>bee</strong> trapped inside your nose. The sound is held and vibrated for a full 2–3 beats.', ar: 'كأنّ <strong>نحلة</strong> حُبست داخل أنفك: يُمسَك الصوت ويُرنّ لمدة 2–3 نبضات كاملة.', tr: 'Burnunuzun içine hapsolmuş bir <strong>arı</strong> gibidir. Ses tutulur ve tam 2–3 vuruş boyunca titretilir.' },
    mechanics: { id: 'Tutup aliran udara dari mulut sepenuhnya. Dorong suara ke arah rongga hidung (khaisyum) hingga Anda merasakan getaran di tulang hidung.', en: 'Block the airflow from the mouth entirely. Push the sound into the nasal cavity until you feel the vibration in your nose bone.', ar: 'أغلِق مرور الهواء من الفم تمامًا، وادفع الصوت نحو تجويف الأنف (الخيشوم) حتى تشعر بالاهتزاز في عظم الأنف.', tr: 'Ağızdan geçen hava akışını tamamen kapatın. Sesi burun boşluğuna (hayşum) doğru itin; burun kemiğinizde titremeyi hissedene kadar sürdürün.' },
  },
  {
    id: 'qalqalah',
    title: { id: 'Qalqalah', en: 'Qalqalah', ar: 'القلقلة', tr: 'Kalkale' },
    subtitle: { id: '(Pantulan Mendadak)', en: '(Sudden Bounce)', ar: '(ارتداد مفاجئ)', tr: '(Ani Sekme)' },
    icon: 'bounce',
    analogyIcon: 'bounce',
    arab: 'فَلَقْ',
    latin: 'Fa-la-Qe',
    type: 'bounce',
    duration: 1000,
    analogy: { id: 'Ibarat <strong>bola basket</strong> yang dilemparkan ke lantai. Begitu membentur lantai, ia harus langsung memantul naik secara spontan.', en: 'Like a <strong>basketball</strong> thrown at the floor — the moment it hits, it bounces right back up.', ar: 'ك<strong>كرة سلة</strong> تُرمى إلى الأرض: ما إن تلمسها حتى ترتد فورًا.', tr: 'Yere bırakılan bir <strong>basketbol topu</strong> gibidir — yere değer değmez hemen yukarı doğru seker.' },
    mechanics: { id: "Tekan letak suara (makhraj) huruf dengan kuat, lalu lepaskan secara tiba-tiba tanpa memberikan vokal tambahan. Menghasilkan efek letupan 'e' kecil.", en: "Press the letter’s articulation point firmly, then release it abruptly with no added vowel — producing a small echoing 'e'.", ar: 'اضغط مخرج الحرف بقوة ثم أطلقه فجأة دون حركة زائدة، فينتج صدى خفيف يشبه همزة قطع قصيرة.', tr: "Harfin ses noktasına (mahreç) güçlüce bastırın, ardından ek bir hareke vermeden aniden bırakın — küçük bir yankılı 'e' etkisi doğar." },
  },
];

// ---------------------------------------------------------------------------
// PHASE 2 — Harakat Dasar (the three short vowels: Fathah/Kasroh/Dhomah).
// ---------------------------------------------------------------------------

export const HARAKAT_SIGNS: HarakatSign[] = [
  {
    id: 'fathah',
    name: { id: 'Fathah', en: 'Fathah', ar: 'الفتحة', tr: 'Üstün' },
    sign: 'ـَ',
    sound: 'a',
    carrier: 'بَ',
    desc: {
      id: 'Garis lurus di ATAS huruf. Menghasilkan bunyi vokal "a" yang terbuka (mulut menganga).',
      en: 'A straight line ABOVE the letter. Produces the open "a" vowel (mouth opens wide).',
      ar: 'خط مستقيم فوق الحرف يمنح صوت "أَ" المفتوح (يفتح الفم واسعًا).',
      tr: 'Harfin ÜSTÜNDE düz bir çizgidir. Açık "a" ünlüsünü verir (ağız iyice açılır).',
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
    name: { id: 'Kasroh', en: 'Kasroh', ar: 'الكسرة', tr: 'Esre' },
    sign: 'ـِ',
    sound: 'i',
    carrier: 'بِ',
    desc: {
      id: 'Garis lurus di BAWAH huruf. Menghasilkan bunyi vokal "i" (mulut menyempit ke samping).',
      en: 'A straight line BELOW the letter. Produces the "i" vowel (mouth narrows sideways).',
      ar: 'خط مستقيم تحت الحرف يمنح صوت "إِ" (يضيق الفم جانبيًا).',
      tr: 'Harfin ALTINDA düz bir çizgidir. "i" ünlüsünü verir (ağız yanlara doğru daralır).',
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
    name: { id: 'Dhomah', en: 'Dhomah', ar: 'الضمة', tr: 'Ötre' },
    sign: 'ـُ',
    sound: 'u',
    carrier: 'بُ',
    desc: {
      id: 'Seperti huruf waw (و) kecil di ATAS huruf. Menghasilkan bunyi vokal "u" (bibir monyong).',
      en: 'Like a small waw (و) ABOVE the letter. Produces the "u" vowel (lips pursed).',
      ar: 'كواوٍ صغيرة فوق الحرف تمنح صوت "أُ" (تُدوَّر الشفتان).',
      tr: 'Harfin ÜSTÜNDE küçük bir vav (و) gibidir. "u" ünlüsünü verir (dudaklar büzülür).',
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
    name: { id: 'Alif', en: 'Alif', ar: 'الألف', tr: 'Elif' },
    letter: 'ا',
    pair: 'ـَا',
    word: 'قَالَ',
    latin: 'Qaala',
    meaning: { id: '(ia) berkata', en: '(he) said', ar: '(قال)', tr: '(o) dedi' },
    vowel: { id: 'Fathah', en: 'Fathah', ar: 'الفتحة', tr: 'Üstün' },
    desc: {
      id: 'Huruf Alif (ا) memanjangkan bunyi Fathah. Dari "a" menjadi "aa" selama ~2 ketukan.',
      en: 'The letter Alif (ا) lengthens the Fathah: from "a" into "aa" for about 2 beats.',
      ar: 'الألف تُطيل الفتحة: من "أَ" إلى "آ" بمقدار نحو حركتين.',
      tr: 'Elif (ا) harfi üstünü uzatır: "a" sesi yaklaşık 2 vuruş boyunca "aa" olur.',
    },
  },
  {
    id: 'waw',
    name: { id: 'Waw', en: 'Waw', ar: 'الواو', tr: 'Vav' },
    letter: 'و',
    pair: 'ـُو',
    word: 'يَقُولُ',
    latin: 'Yaquulu',
    meaning: { id: '(ia) berkata', en: '(he) says', ar: '(يقول)', tr: '(o) der' },
    vowel: { id: 'Dhomah', en: 'Dhomah', ar: 'الضمة', tr: 'Ötre' },
    desc: {
      id: 'Huruf Waw (و) memanjangkan bunyi Dhomah. Dari "u" menjadi "uu" selama ~2 ketukan.',
      en: 'The letter Waw (و) lengthens the Dhomah: from "u" into "uu" for about 2 beats.',
      ar: 'الواو تُطيل الضمة: من "أُ" إلى "أُو" بمقدار نحو حركتين.',
      tr: 'Vav (و) harfi ötreyi uzatır: "u" sesi yaklaşık 2 vuruş boyunca "uu" olur.',
    },
  },
  {
    id: 'ya',
    name: { id: 'Ya', en: 'Ya', ar: 'الياء', tr: 'Ye' },
    letter: 'ي',
    pair: 'ـِي',
    word: 'دِينٌ',
    latin: 'Diinun',
    meaning: { id: 'agama', en: 'religion', ar: 'الدين', tr: 'din' },
    vowel: { id: 'Kasroh', en: 'Kasroh', ar: 'الكسرة', tr: 'Esre' },
    desc: {
      id: 'Huruf Ya (ي) memanjangkan bunyi Kasroh. Dari "i" menjadi "ii" selama ~2 ketukan.',
      en: 'The letter Ya (ي) lengthens the Kasroh: from "i" into "ii" for about 2 beats.',
      ar: 'الياء تُطيل الكسرة: من "إِ" إلى "إِي" بمقدار نحو حركتين.',
      tr: 'Ye (ي) harfi esreyi uzatır: "i" sesi yaklaşık 2 vuruş boyunca "ii" olur.',
    },
  },
];

// ---------------------------------------------------------------------------
// PHASE 6 — Hamzah & alif variants.
// ---------------------------------------------------------------------------

export const HAMZAH_FORMS: HamzahForm[] = [
  {
    id: 'hamzah-a',
    name: { id: 'Hamzah Fathah', en: 'Hamzah Fathah', ar: 'همزة مع فتحة (أ)', tr: 'Üstünlü Hemze' },
    form: 'أ',
    word: 'أَحَدٌ',
    latin: 'Ahadun',
    meaning: { id: 'satu', en: 'one', ar: 'واحد', tr: 'bir' },
    desc: {
      id: 'Alif (ا) dengan hamzah (ء) di atasnya, dibaca dengan bunyi "a" yang jelas.',
      en: 'An Alif (ا) with a hamzah (ء) above it, pronounced with a clear "a".',
      ar: 'ألف (ا) فوقها همزة (ء)، تُنطق بفتحٍ واضح "أَ".',
      tr: 'Üzerinde hemze (ء) bulunan elif (ا); açık bir "a" sesiyle okunur.',
    },
  },
  {
    id: 'hamzah-i',
    name: { id: 'Hamzah Kasroh', en: 'Hamzah Kasroh', ar: 'همزة مع كسرة (إ)', tr: 'Esreli Hemze' },
    form: 'إ',
    word: 'إِنَّ',
    latin: 'Inna',
    meaning: { id: 'sesungguhnya', en: 'indeed', ar: 'إنَّ', tr: 'şüphesiz' },
    desc: {
      id: 'Alif (ا) dengan hamzah (ء) di bawahnya, dibaca dengan bunyi "i" yang jelas.',
      en: 'An Alif (ا) with a hamzah (ء) below it, pronounced with a clear "i".',
      ar: 'ألف تحتها همزة، تُنطق بكسرٍ واضح "إِ".',
      tr: 'Altında hemze (ء) bulunan elif (ا); açık bir "i" sesiyle okunur.',
    },
  },
  {
    id: 'maddah',
    name: { id: 'Alif Mamdudah', en: 'Alif Mamdudah', ar: 'ألف ممدودة (آ)', tr: 'Meddeli Elif' },
    form: 'آ',
    word: 'آمَنَ',
    latin: 'Aamana',
    meaning: { id: 'beriman', en: 'to believe', ar: 'آمن', tr: 'iman etmek' },
    desc: {
      id: 'Alif dengan tanda mad (ـٓ) di atasnya, dibaca panjang "aa" (gabungan dua hamzah).',
      en: 'An Alif with a mad mark (ـٓ) above it, pronounced as a long "aa" (two hamzahs merged).',
      ar: 'ألف فوقها علامة المدّ، تُنطق ممدودة "آ" (دمج همزتين).',
      tr: 'Üzerinde med işareti (ـٓ) bulunan elif; "aa" olarak uzun okunur (iki hemzenin birleşimi).',
    },
  },
  {
    id: 'waslah',
    name: { id: 'Alif Waslah', en: 'Alif Waslah', ar: 'ألف وصل (ٱ)', tr: 'Vasıl Elifi' },
    form: 'ٱ',
    word: 'بِسْمِ ٱللَّهِ',
    latin: 'bismillāh',
    meaning: { id: 'dengan nama Allah', en: 'in the name of Allah', ar: 'باسم الله', tr: "Allah'ın adıyla" },
    desc: {
      id: 'Alif yang dilewati (tidak dibaca) saat bersambung dengan kata sebelumnya, hanya dibaca pendek di awal kalimat.',
      en: 'An Alif skipped (not pronounced) when joined to the preceding word; pronounced short only at the start of an utterance.',
      ar: 'ألف تُتجاوَز (لا تُنطق) عند وصلها بما قبلها، وتُنطق قصيرة في بداية الكلام فقط.',
      tr: 'Öncesindeki kelimeye bağlandığında atlanan (okunmayan) elif; yalnızca sözün başında kısa okunur.',
    },
  },
];
