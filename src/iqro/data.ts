import type {
  LetterFamily,
  JoinWord,
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
    groupName: { id: '1. Keluarga Garis Vertikal', en: '1. Vertical-Line Family', ar: '1. عائلة الخط العمودي', tr: '1. Dikey Çizgi Ailesi', ur: '1. عمودی خط والا خاندان' },
    description: {
      id: 'Memiliki garis lurus tegak sebagai pembentuk utama.',
      en: 'Built primarily around a straight upright stroke.',
      ar: 'تُبنى أساسًا على خط عمودي مستقيم.',
      tr: 'Esas olarak dümdüz dik bir çizgi üzerine kuruludur.',
      ur: 'بنیادی طور پر سیدھی عمودی لکیر پر بنا ہوتا ہے۔',
    },
    letters: [
      { id: 'alif', arab: 'ا', name: { id: 'Alif', en: 'Alif', ar: 'أَلِف', tr: 'Elif', ur: 'الف' }, audio: 'a', anatomy: { id: 'Keluar dari rongga mulut bagian dalam. Suaranya murni berupa hembusan napas yang beresonansi tanpa hambatan.', en: 'Comes from the back of the mouth cavity. A pure breath of air that resonates freely, with no obstruction.', ar: 'يخرج من أقصى تجويف الفم؛ نفَسٌ خالص يرنّ بحرية دون أي عائق.', tr: 'Ağız boşluğunun en gerisinden çıkar. Hiçbir engele takılmadan serbestçe yankılanan saf bir nefestir.', ur: 'منہ کے خلا کے سب سے اندر والے حصے سے نکلتا ہے۔ خالص سانس جو بغیر کسی رکاوٹ کے آزادانہ گونجتا ہے۔' }, logic: { id: 'Bentuk paling dasar: Garis lurus vertikal sederhana melambangkan fondasi berdiri tegak.', en: 'The most basic shape: a simple straight vertical line, the foundation standing upright.', ar: 'أبسط الأشكال: خط عمودي مستقيم يمثّل الأساس القائم.', tr: 'En temel biçim: dümdüz dikey bir çizgi; dimdik duran temelin kendisi.', ur: 'سب سے بنیادی شکل: سادہ سیدھی عمودی لکیر جو سیدھی کھڑی ہونے والی بنیاد کی نمائندگی کرتی ہے۔' } },
      { id: 'lam', arab: 'ل', name: { id: 'Lam', en: 'Lam', ar: 'لام', tr: 'Lam', ur: 'لام' }, audio: 'la', anatomy: { id: 'Ujung lidah menempel pada gusi gigi seri atas secara melebar.', en: 'The tip of the tongue spreads flat against the gum behind the upper front teeth.', ar: 'ينبسط طرف اللسان على اللثة خلف الأسنان العليا.', tr: 'Dil ucu, üst ön dişlerin arkasındaki diş etine yayılarak yapışır.', ur: 'زبان کی نوک اوپر کے سامنے والے دانتوں کے پیچھے مسوڑھوں پر پھیل کر لگتی ہے۔' }, logic: { id: "Seperti Alif, namun memiliki kail pancing di bagian bawah yang melengkung tajam ke kiri.", en: 'Like Alif, but with a fish-hook curling sharply to the left at the bottom.', ar: 'مثل الألف، لكن مع خطّاف في الأسفل ينثني حادًّا نحو اليسار.', tr: 'Elif gibidir; ancak altında sola doğru sertçe kıvrılan bir balık kancası vardır.', ur: 'الف کی طرح، مگر اس کے نچلے حصے میں مچھلی کے کانٹے کی طرح تیزی سے بائیں جانب مڑا ہوا حصہ ہے۔' } },
      { id: 'kaf', arab: 'ك', name: { id: 'Kaf', en: 'Kaf', ar: 'كاف', tr: 'Kef', ur: 'کاف' }, audio: 'ka', anatomy: { id: 'Pangkal lidah menempel pada langit-langit bagian tengah (sedikit di depan makhraj Qaf).', en: 'The back of the tongue touches the mid-palate (slightly ahead of the Qaf articulation).', ar: 'يلامس أقصى اللسان وسط الحنك (أمام مخرج القاف قليلًا).', tr: 'Dilin arkası damağın ortasına değer (Kaf mahrecinin hafif önünde).', ur: 'زبان کی جڑ تالو کے درمیانی حصے سے ملتی ہے (قاف کے مخرج سے ذرا آگے)۔' }, logic: { id: 'Garis tegak dengan dudukan siku. Terdapat ornamen huruf kaf kecil (menyerupai hamzah) di dalamnya.', en: 'An upright stroke with an elbow rest. A small kaf ornament (like a hamzah) sits inside it.', ar: 'خط عمودي مع مسند مرفقي، وبداخله زخرفة كاف صغيرة (تشبه الهمزة).', tr: 'Dirsek dayama yerli dik bir çizgi. İçinde küçük bir kef süsü (hemze benzeri) bulunur.', ur: 'کہنی کے سہارے والی سیدھی عمودی لکیر؛ اس کے اندر کاف کا چھوٹا سا نشان (ہمزہ جیسا) موجود ہوتا ہے۔' } },
    ],
  },
  {
    groupName: { id: '2. Keluarga Mangkuk / Perahu', en: '2. Bowl / Boat Family', ar: '2. عائلة القارب (الوعاء)', tr: '2. Çanak / Kayık Ailesi', ur: '2. کٹورا / کشتی والا خاندان' },
    description: {
      id: 'Melengkung mendatar. Hanya dibedakan oleh jumlah dan letak titik.',
      en: 'A horizontal curve. Distinguished only by the number and position of dots.',
      ar: 'انحناء أفقي؛ لا تتميّز الحروف إلا بعدد النقاط وموضعها.',
      tr: 'Yatay bir kıvrım. Yalnızca nokta sayısı ve konumuyla ayırt edilirler.',
      ur: 'افقی مڑاؤ۔ صرف نقطوں کی تعداد اور جگہ سے ممتاز ہوتے ہیں۔',
    },
    letters: [
      { id: 'ba', arab: 'ب', name: { id: 'Ba', en: 'Ba', ar: 'با', tr: 'Be', ur: 'بے' }, audio: 'ba', anatomy: { id: 'Merapatkan kedua bibir. Suara tertahan sejenak lalu dilepaskan.', en: 'Press both lips together. The sound is held briefly, then released.', ar: 'تُطبَق الشفتان معًا؛ يُحبَس الصوت لحظة ثم يُطلَق.', tr: 'İki dudak birbirine bastırılır. Ses kısa bir süre tutulur, sonra salınır.', ur: 'دونوں ہونٹ آپس میں ملائے جاتے ہیں۔ آواز کچھ دیر روک لی جاتی ہے، پھر چھوڑ دی جاتی ہے۔' }, logic: { id: 'Bentuk perahu dengan 1 titik di BAWAH. (Tips: B = Bawah).', en: 'A boat shape with 1 dot BELOW. (Tip: B = Below).', ar: 'شكل قارب مع نقطة واحدة تحت. (تذكير: الباء = نقطة تحت).', tr: 'Altında 1 nokta bulunan kayık biçimi. (İpucu: B = Below [altta]).', ur: 'کشتی کی شکل جس کے نیچے 1 نقطہ ہے۔ (یاددہانی: B = Below یعنی نیچے)۔' } },
      { id: 'ta', arab: 'ت', name: { id: 'Ta', en: 'Ta', ar: 'تا', tr: 'Te', ur: 'تے' }, audio: 'ta', anatomy: { id: 'Ujung lidah menempel pada pangkal gigi seri atas bagian dalam.', en: 'The tongue tip touches the inner base of the upper front teeth.', ar: 'يلمس طرف اللسان أصول الأسنان العليا من الداخل.', tr: 'Dil ucu, üst ön dişlerin iç köküne değer.', ur: 'زبان کی نوک اوپر کے سامنے والے دانتوں کی اندرونی جڑ سے لگتی ہے۔' }, logic: { id: 'Bentuk perahu dengan 2 titik di ATAS. (Tips: T = Tinggi/Top).', en: 'A boat shape with 2 dots ABOVE. (Tip: T = Top).', ar: 'شكل قارب مع نقطتين فوق. (تذكير: التاء = نقطتان فوق).', tr: 'Üstünde 2 nokta bulunan kayık biçimi. (İpucu: T = Top [üstte]).', ur: 'کشتی کی شکل جس کے اوپر 2 نقطے ہیں۔ (یاددہانی: T = Top یعنی اوپر)۔' } },
      { id: 'tsa', arab: 'ث', name: { id: 'Tsa', en: 'Tsa', ar: 'ثا', tr: 'Se', ur: 'ثے' }, audio: 'tsa', anatomy: { id: 'Ujung lidah sedikit dikeluarkan dan disentuh lembut oleh ujung gigi seri atas.', en: 'The tongue tip pokes out slightly and is gently touched by the upper front teeth.', ar: 'يبرز طرف اللسان قليلًا فتلمسه أطراف الأسنان العليا بلطف.', tr: 'Dil ucu hafifçe dışarı çıkar ve üst ön dişler tarafından yumuşakça değdirilir.', ur: 'زبان کی نوک ذرا باہر نکالی جاتی ہے اور اوپر کے سامنے والے دانت اسے نرمی سے چھوتے ہیں۔' }, logic: { id: 'Bentuk perahu dengan 3 titik di ATAS. Titik ekstra menghasilkan desisan hembusan yang lebih banyak.', en: 'A boat shape with 3 dots ABOVE. The extra dot produces a stronger hiss.', ar: 'شكل قارب مع ثلاث نقاط فوق؛ النقطة الزائدة تزيد صفير الحرف.', tr: 'Üstünde 3 nokta bulunan kayık biçimi. Fazladan nokta daha güçlü bir tıslama oluşturur.', ur: 'کشتی کی شکل جس کے اوپر 3 نقطے ہیں۔ ایک اضافی نقطہ اس کی سسکاری کو مزید تیز کر دیتا ہے۔' } },
    ],
  },
  {
    groupName: { id: '3. Keluarga Kepala Jangkar', en: '3. Anchor-Head Family', ar: '3. عائلة رأس المرساة', tr: '3. Çapa Başı Ailesi', ur: '3. لنگر کے سر والا خاندان' },
    description: {
      id: 'Kepala mendatar dan perut melengkung besar menembus garis bawah.',
      en: 'A horizontal head with a large curving belly that drops below the line.',
      ar: 'رأس أفقي وبطن منحنٍ كبير ينزل تحت السطر.',
      tr: 'Satırın altına inen büyük kıvrık karınlı, yatay bir baş.',
      ur: 'افقی سر جس کا بڑا مڑا ہوا پیٹ لکیر سے نیچے اتر آتا ہے۔',
    },
    letters: [
      { id: 'jim', arab: 'ج', name: { id: 'Jim', en: 'Jim', ar: 'جيم', tr: 'Cim', ur: 'جیم' }, audio: 'ja', anatomy: { id: 'Tengah lidah menempel kuat pada langit-langit mulut. Terdapat efek tertahan.', en: 'The middle of the tongue presses firmly against the palate, with a held effect.', ar: 'يلتصق وسط اللسان بقوة بالحنك، مع أثر حبسٍ للصوت.', tr: 'Dilin orta kısmı damağa sıkıca yaslanır; ses bir an tutulur gibi bir etki vardır.', ur: 'زبان کا درمیانی حصہ تالو سے زور سے لگتا ہے؛ آواز ایک لمحے کے لیے روکنے جیسا احساس ہوتا ہے۔' }, logic: { id: 'Bentuk kail dengan 1 titik di TENGAH perut. (Tips: J = Jantung).', en: 'A hook shape with 1 dot in the MIDDLE of the belly. (Tip: J = Jantung/heart).', ar: 'شكل خطّاف مع نقطة واحدة في وسط البطن. (تذكير: الجيم = نقطة في الوسط).', tr: 'Karnının ortasında 1 nokta bulunan kanca biçimi. (İpucu: J = Jantung [kalp]).', ur: 'کانٹے جیسی شکل جس کے پیٹ کے بالکل درمیان میں 1 نقطہ ہے۔ (یاددہانی: J = Jantung یعنی درمیان)۔' } },
      { id: 'ha', arab: 'ح', name: { id: 'Ha', en: 'Ha', ar: 'حا', tr: 'Ha', ur: 'حے' }, audio: 'ha', anatomy: { id: 'Keluar dari tengah tenggorokan. Menghasilkan hembusan udara hangat bersih.', en: 'Comes from the middle of the throat, producing a clean warm breath.', ar: 'يخرج من وسط الحلق بنفَسٍ دافئ صافٍ.', tr: 'Boğazın ortasından çıkar; temiz ve ılık bir nefes verir.', ur: 'گلے کے درمیانی حصے سے نکلتا ہے؛ صاف اور گرم سانس پیدا کرتا ہے۔' }, logic: { id: 'Bentuk kail POLOS tanpa titik sama sekali. Lambang kebersihan/hampa udara.', en: 'A PLAIN hook with no dots at all — a symbol of emptiness/clean air.', ar: 'خطّاف مجرّد بلا نقاط إطلاقًا — رمز الصفاء والفراغ.', tr: 'Hiç noktası bulunmayan sade bir kanca — boşluğun ve temiz havanın simgesi.', ur: 'بالکل سادہ کانٹا جس پر ایک بھی نقطہ نہیں — پاکیزگی اور خلا کی علامت۔' } },
      { id: 'kha', arab: 'خ', name: { id: 'Kha', en: 'Kha', ar: 'خا', tr: 'Hı', ur: 'خے' }, audio: 'kha', anatomy: { id: 'Keluar dari ujung pangkal tenggorokan. Ada efek gesekan kasar.', en: 'Comes from the upper end of the throat, with a rough scraping effect.', ar: 'يخرج من أعلى الحلق مع أثر خشونة واحتكاك.', tr: 'Boğazın üst ucundan çıkar; pürüzlü bir sıyırma etkisi vardır.', ur: 'گلے کے اوپری کنارے سے نکلتا ہے؛ اس میں کھرچنے جیسا کھردرا اثر ہوتا ہے۔' }, logic: { id: 'Bentuk kail dengan 1 titik di ATAS kepala. Ibarat debu di atas tenggorokan.', en: 'A hook with 1 dot ABOVE the head — like dust settling on the throat.', ar: 'خطّاف مع نقطة واحدة فوق الرأس — كغبارٍ يعلو الحلق.', tr: 'Başının üstünde 1 nokta bulunan kanca — boğazın üstüne çöken toz gibidir.', ur: 'کانٹا جس کے سر کے اوپر 1 نقطہ ہے — جیسے گلے پر جمی ہوئی گرد۔' } },
    ],
  },
  {
    groupName: { id: '4. Keluarga Siku Patah', en: '4. Broken-Elbow Family', ar: '4. عائلة الزاوية المكسورة', tr: '4. Kırık Dirsek Ailesi', ur: '4. ٹوٹی ہوئی کہنی والا خاندان' },
    description: {
      id: 'Garis menyudut seperti orang duduk atau mulut buaya.',
      en: 'An angled line, like a seated figure or a crocodile’s jaw.',
      ar: 'خط بزاوية، كشخصٍ جالس أو فم تمساح.',
      tr: 'Oturan bir insan ya da timsah çenesi gibi açılı bir çizgi.',
      ur: 'زاویہ دار لکیر، جیسے بیٹھا ہوا شخص یا مگرمچھ کا جبڑا۔',
    },
    letters: [
      { id: 'dal', arab: 'د', name: { id: 'Dal', en: 'Dal', ar: 'دال', tr: 'Dal', ur: 'دال' }, audio: 'da', anatomy: { id: 'Ujung lidah menempel pada pangkal gigi seri atas (seperti makhraj Ta).', en: 'The tongue tip touches the base of the upper front teeth (like the Ta sound).', ar: 'يلمس طرف اللسان أصول الأسنان العليا (كمخرج التاء).', tr: 'Dil ucu, üst ön dişlerin köküne değer (Te mahreci gibi).', ur: 'زبان کی نوک اوپر کے سامنے والے دانتوں کی جڑ سے لگتی ہے (تے کے مخرج کی طرح)۔' }, logic: { id: 'Sudut patah POLOS tanpa titik.', en: 'A PLAIN bent angle with no dot.', ar: 'زاوية مكسورة مجرّدة بلا نقطة.', tr: 'Noktası bulunmayan sade bir kırık açı.', ur: 'بغیر نقطہ بالکل سادہ ٹیڑھا زاویہ۔' } },
      { id: 'dzal', arab: 'ذ', name: { id: 'Dzal', en: 'Dzal', ar: 'ذال', tr: 'Zel', ur: 'ذال' }, audio: 'dza', anatomy: { id: 'Ujung lidah sedikit dikeluarkan dan disentuh gigi seri atas (seperti makhraj Tsa).', en: 'The tongue tip pokes out slightly to meet the upper front teeth (like the Tsa sound).', ar: 'يبرز طرف اللسان قليلًا ليلتقي الأسنان العليا (كمخرج الثاء).', tr: 'Dil ucu hafifçe dışarı çıkarak üst ön dişlerle buluşur (Se mahreci gibi).', ur: 'زبان کی نوک ذرا باہر نکل کر اوپر کے سامنے والے دانتوں سے ملتی ہے (ثے کے مخرج کی طرح)۔' }, logic: { id: 'Sudut patah dengan 1 titik di ATAS. Titik menandakan getaran ekstra di ujung lidah.', en: 'A bent angle with 1 dot ABOVE. The dot marks extra vibration at the tongue tip.', ar: 'زاوية مكسورة مع نقطة واحدة فوق؛ النقطة تشير إلى اهتزاز إضافي في طرف اللسان.', tr: 'Üstünde 1 nokta bulunan kırık açı. Nokta, dil ucundaki ek titreşimi gösterir.', ur: 'ٹیڑھا زاویہ جس کے اوپر 1 نقطہ ہے۔ نقطہ زبان کی نوک پر اضافی ارتعاش کی علامت ہے۔' } },
    ],
  },
  {
    groupName: { id: '5. Keluarga Seluncuran', en: '5. Slide Family', ar: '5. عائلة الانزلاق', tr: '5. Kaydırak Ailesi', ur: '5. پھسلنے والا خاندان' },
    description: {
      id: 'Garis yang meluncur melengkung ke bawah menembus batas baris.',
      en: 'A line that slides downward in a curve, breaking past the baseline.',
      ar: 'خط ينزلق منحنيًا إلى الأسفل مخترقًا حدّ السطر.',
      tr: 'Kıvrılarak aşağı kayan ve satır çizgisini aşan bir çizgi.',
      ur: 'مڑی ہوئی لکیر جو نیچے کی جانب پھسل کر بیس لائن سے باہر نکل جاتی ہے۔',
    },
    letters: [
      { id: 'ra', arab: 'ر', name: { id: 'Ra', en: 'Ra', ar: 'را', tr: 'Ra', ur: 'رے' }, audio: 'ro', anatomy: { id: 'Ujung lidah menyentuh gusi atas agak ke dalam dengan sedikit getaran (takrir).', en: 'The tongue tip touches the upper gum a little inward, with a slight trill (takrir).', ar: 'يلمس طرف اللسان اللثة العليا من الداخل قليلًا مع اهتزاز خفيف (تكرير).', tr: 'Dil ucu, biraz içeriden üst diş etine değerek hafifçe titrer (tekrir).', ur: 'زبان کی نوک ذرا اندر کی جانب اوپر کے مسوڑھے سے لگتی ہے، ساتھ ہی ہلکا سا ارتعاش (تکریر) ہوتا ہے۔' }, logic: { id: 'Melengkung ke bawah POLOS tanpa titik.', en: 'A downward curve, PLAIN with no dot.', ar: 'انحناءة نازلة مجرّدة بلا نقطة.', tr: 'Aşağı doğru inen bir kıvrım; noktası yok, sade.', ur: 'نیچے کو مڑا ہوا حصہ، بغیر نقطہ بالکل سادہ۔' } },
      { id: 'zai', arab: 'ز', name: { id: 'Zai', en: 'Zai', ar: 'زاي', tr: 'Ze', ur: 'زے' }, audio: 'za', anatomy: { id: 'Ujung lidah menempel di belakang gigi seri bawah. Menghasilkan suara desisan tajam (lebah).', en: 'The tongue tip sits behind the lower front teeth, making a sharp buzz (like a bee).', ar: 'يستقر طرف اللسان خلف الأسنان السفلى محدثًا أزيزًا حادًّا (كأزيز النحلة).', tr: 'Dil ucu, alt ön dişlerin arkasına yerleşir; keskin bir vızıltı çıkarır (arı gibi).', ur: 'زبان کی نوک نیچے کے سامنے والے دانتوں کے پیچھے رکتی ہے؛ تیز بھنبھناہٹ پیدا کرتی ہے (شہد کی مکھی کی طرح)۔' }, logic: { id: 'Melengkung ke bawah dengan 1 titik di ATAS. Titik lambang dengungan lebah.', en: 'A downward curve with 1 dot ABOVE — the dot symbolises the bee’s buzz.', ar: 'انحناءة نازلة مع نقطة واحدة فوق — النقطة رمز أزيز النحلة.', tr: 'Üstünde 1 nokta bulunan aşağı inen kıvrım — nokta, arının vızıltısını simgeler.', ur: 'نیچے کو مڑا حصہ جس کے اوپر 1 نقطہ ہے — نقطہ مکھی کی بھنبھناہٹ کی علامت ہے۔' } },
      { id: 'wau', arab: 'و', name: { id: 'Wau', en: 'Wau', ar: 'واو', tr: 'Vav', ur: 'واؤ' }, audio: 'wa', anatomy: { id: 'Kedua bibir dimajukan dan dibulatkan ke depan (monyong), menyisakan celah kecil.', en: 'Both lips push forward and round (pursed), leaving a small opening.', ar: 'تتبرّمان الشفتان وتستديران إلى الأمام تاركَين فتحة صغيرة.', tr: 'İki dudak ileri uzanıp yuvarlanır (büzülür) ve küçük bir açıklık kalır.', ur: 'دونوں ہونٹ آگے بڑھ کر گول (اُبھرے ہوئے) ہو جاتے ہیں، جس سے ایک چھوٹا سا راستہ رہ جاتا ہے۔' }, logic: { id: 'Mirip Ra, namun memiliki kepala bulat penuh tertutup di ujung atasnya.', en: 'Like Ra, but with a full round head closed off at the top.', ar: 'تشبه الراء، لكن برأسٍ مستدير مغلق تمامًا في أعلاها.', tr: 'Ra gibidir, ama tepesinde tümüyle kapalı yuvarlak bir baş taşır.', ur: 'رے کی طرح، مگر اوپر مکمل بند ہوا گول سر ہوتا ہے۔' } },
    ],
  },
  {
    groupName: { id: '6. Keluarga Gigi Gergaji', en: '6. Sawtooth Family', ar: '6. عائلة أسنان المنشار', tr: '6. Testere Dişi Ailesi', ur: '6. آری کے دانتوں والا خاندان' },
    description: {
      id: 'Memiliki bentuk seperti sisir atau gigi kecil di awalnya.',
      en: 'Begins with a comb-like row of small teeth.',
      ar: 'تبدأ بصفّ أسنان صغيرة كالمشط.',
      tr: 'Başında tarak gibi küçük dişlerden oluşan bir dizi bulunur.',
      ur: 'شروع میں کنگھی جیسے چھوٹے چھوٹے دانتوں کی قطار ہوتی ہے۔',
    },
    letters: [
      { id: 'sin', arab: 'س', name: { id: 'Sin', en: 'Sin', ar: 'سين', tr: 'Sin', ur: 'سین' }, audio: 'sa', anatomy: { id: 'Ujung lidah di belakang gigi seri bawah. Udara berdesis mengalir (seperti suara ular).', en: 'The tongue tip behind the lower front teeth. Air hisses through (like a snake).', ar: 'طرف اللسان خلف الأسنان السفلى يمرّ الهواء مصفيرًا (كهسيس الأفعى).', tr: 'Dil ucu alt ön dişlerin arkasındadır. Hava tıslayarak akar (yılan sesi gibi).', ur: 'زبان کی نوک نیچے کے سامنے والے دانتوں کے پیچھے ہوتی ہے۔ ہوا سسکارے کے ساتھ گزرتی ہے (سانپ کی آواز کی طرح)۔' }, logic: { id: 'Tiga gigi gergaji POLOS. Disusul mangkuk besar di akhirnya.', en: 'Three PLAIN sawtooth peaks, followed by a large bowl at the end.', ar: 'ثلاثة أسنان منشار مجرّدة، يتبعها وعاء كبير في النهاية.', tr: 'Üç sade testere dişi; sonunda büyük bir çanak yer alır.', ur: 'تین سادہ آری دانت، جن کے آخر میں ایک بڑا کٹورا ہوتا ہے۔' } },
      { id: 'syin', arab: 'ش', name: { id: 'Syin', en: 'Syin', ar: 'شين', tr: 'Şın', ur: 'شین' }, audio: 'sya', anatomy: { id: 'Tengah lidah menempel pada langit-langit (tanpa merapat). Udara menyebar ke seluruh mulut.', en: 'The middle of the tongue nears the palate (without touching); air spreads across the whole mouth.', ar: 'يقترب وسط اللسان من الحنك دون التصاق، وينتشر الهواء في كامل الفم.', tr: 'Dilin ortası damağa yaklaşır (değmeden); hava tüm ağza yayılır.', ur: 'زبان کا درمیانی حصہ تالو کے قریب جاتا ہے (چھوئے بغیر)؛ ہوا پورے منہ میں پھیل جاتی ہے۔' }, logic: { id: 'Tiga gigi gergaji dengan 3 titik di ATAS. Titik melambangkan udara yang menyebar luas.', en: 'Three sawtooth peaks with 3 dots ABOVE — symbolising air spreading widely.', ar: 'ثلاثة أسنان منشار مع ثلاث نقاط فوق — رمز انتشار الهواء الواسع.', tr: 'Üstünde 3 nokta bulunan üç testere dişi — havanın genişçe yayılmasını simgeler.', ur: 'تین آری دانت جن کے اوپر 3 نقطے ہیں — ہوا کے وسیع پھیلاؤ کی علامت۔' } },
    ],
  },
  {
    groupName: { id: '7. Keluarga Oval Berekor', en: '7. Tailed-Oval Family', ar: '7. عائلة البيضاوية المذنّبة', tr: '7. Kuyruklu Oval Ailesi', ur: '7. دم والے انڈاکار خاندان' },
    description: {
      id: 'Kepala berbentuk bulat lonjong/oval dengan perut melengkung besar.',
      en: 'An oval/round head with a large curving belly.',
      ar: 'رأس بيضاوي مستدير مع بطنٍ منحنٍ كبير.',
      tr: 'Yuvarlak/oval bir baş ve büyük kıvrımlı bir karın.',
      ur: 'گول/انڈاکار سر جس کے ساتھ بڑا مڑا ہوا پیٹ ہوتا ہے۔',
    },
    letters: [
      { id: 'shad', arab: 'ص', name: { id: 'Shad', en: 'Shad', ar: 'صاد', tr: 'Sad', ur: 'صاد' }, audio: 'sho', anatomy: { id: 'Seperti Sin, tapi pangkal lidah diangkat ke atas, membuat suara menjadi tebal/berat.', en: 'Like Sin, but the back of the tongue rises, making the sound heavy/full.', ar: 'كالسين، لكن يرتفع أقصى اللسان فيغدو الصوت مفخّمًا ثقيلًا.', tr: 'Sin gibidir, ama dilin arkası yükselir ve ses kalınlaşıp ağırlaşır.', ur: 'سین کی طرح، مگر زبان کی جڑ اٹھ جاتی ہے جس سے آواز بھاری/بھریپن والی ہو جاتی ہے۔' }, logic: { id: 'Kepala oval dengan perut besar, POLOS tanpa titik.', en: 'An oval head with a large belly, PLAIN with no dot.', ar: 'رأس بيضاوي ببطنٍ كبير، مجرّد بلا نقطة.', tr: 'Büyük karınlı oval başlı, noktası bulunmayan sade bir harf.', ur: 'انڈاکار سر اور بڑا پیٹ، بغیر نقطہ بالکل سادہ۔' } },
      { id: 'dhad', arab: 'ض', name: { id: 'Dhad', en: 'Dhad', ar: 'ضاد', tr: 'Dad', ur: 'ضاد' }, audio: 'dho', anatomy: { id: 'Sisi lidah (kanan/kiri) menempel pada gigi geraham atas. Ini huruf Arab yang paling unik.', en: 'The side of the tongue touches the upper molars. The most distinctive Arabic letter.', ar: 'يلامس جانب اللسان (الأيمن أو الأيسر) الأضراس العليا؛ وهو أكثر الحروف العربية تميّزًا.', tr: 'Dilin yanı üst azı dişlere değer. Arapçanın en ayırt edici harfidir.', ur: 'زبان کا کنارہ (دائیں/بائیں) اوپر کے داڑھوں سے لگتا ہے۔ یہ عربی کا سب سے منفرد حرف ہے۔' }, logic: { id: 'Kepala oval dengan perut besar dan 1 titik di ATAS.', en: 'An oval head with a large belly and 1 dot ABOVE.', ar: 'رأس بيضاوي ببطنٍ كبير ونقطة واحدة فوق.', tr: 'Büyük karınlı oval başlı, üstünde 1 nokta bulunan bir harf.', ur: 'انڈاکار سر، بڑا پیٹ اور اوپر 1 نقطہ۔' } },
    ],
  },
  {
    groupName: { id: '8. Keluarga Oval Bertiang', en: '8. Oval-on-a-Pillar Family', ar: '8. عائلة البيضاوية على عمود', tr: '8. Sütun Üzerine Oturmuş Oval Ailesi', ur: '8. ستون پر انڈاکار خاندان' },
    description: {
      id: 'Kepala bulat lonjong yang ditancapkan tiang lurus tegak di atasnya.',
      en: 'A round oval head planted on a straight upright pillar.',
      ar: 'رأس بيضاوي مغروز فيه عمود مستقيم قائم.',
      tr: 'Dümdüz dik bir sütunun üzerine oturtulmuş yuvarlak oval bir baş.',
      ur: 'گول انڈاکار سر جو سیدھے کھڑے ستون پر جڑا ہوا ہے۔',
    },
    letters: [
      { id: 'tha', arab: 'ط', name: { id: 'Tha', en: 'Tha', ar: 'طا', tr: 'Tı', ur: 'طوے' }, audio: 'tho', anatomy: { id: 'Seperti Ta, tapi pangkal lidah diangkat. Suara meletup dan tebal (Qalqalah).', en: 'Like Ta, but the back of the tongue rises — a heavy, popping sound (Qalqalah).', ar: 'كالتاء، لكن يرتفع أقصى اللسان — صوت مفخّم قافل (قلقلة).', tr: 'Te gibidir, ama dilin arkası yükselir — kalın, patlamalı bir sestir (Kalkale).', ur: 'تے کی طرح، مگر زبان کی جڑ اٹھ جاتی ہے — بھاری، پھوٹنے والی آواز (قلقلہ)۔' }, logic: { id: 'Oval dengan tiang, POLOS tanpa titik.', en: 'An oval on a pillar, PLAIN with no dot.', ar: 'بيضاوية على عمود، مجرّدة بلا نقطة.', tr: 'Sütun üzerine oturmuş oval; noktası yok, sade.', ur: 'ستون پر انڈاکار، بغیر نقطہ بالکل سادہ۔' } },
      { id: 'zha', arab: 'ظ', name: { id: 'Zha', en: 'Zha', ar: 'ظا', tr: 'Zı', ur: 'ظوے' }, audio: 'zho', anatomy: { id: 'Seperti Dzal, tapi pangkal lidah diangkat. Suara tebal dan berdengung.', en: 'Like Dzal, but the back of the tongue rises — a heavy, buzzing sound.', ar: 'كالذال، لكن يرتفع أقصى اللسان — صوت مفخّم بأزيز.', tr: 'Zel gibidir, ama dilin arkası yükselir — kalın ve vızıltılı bir sestir.', ur: 'ذال کی طرح، مگر زبان کی جڑ اٹھ جاتی ہے — بھاری اور بھنبھناتی ہوئی آواز۔' }, logic: { id: 'Oval dengan tiang dan 1 titik di ATAS.', en: 'An oval on a pillar with 1 dot ABOVE.', ar: 'بيضاوية على عمود مع نقطة واحدة فوق.', tr: 'Sütun üzerine oturmuş, üstünde 1 nokta bulunan oval.', ur: 'ستون پر انڈاکار جس کے اوپر 1 نقطہ ہے۔' } },
    ],
  },
  {
    groupName: { id: '9. Keluarga Cangkang Terbuka', en: '9. Open-Shell Family', ar: '9. عائلة الصدفة المفتوحة', tr: '9. Açık Kabuk Ailesi', ur: '9. کھلی سیپ والا خاندان' },
    description: {
      id: 'Bentuk setengah lingkaran kecil di atas, dengan mangkuk besar di bawah.',
      en: 'A small half-circle on top with a large bowl below.',
      ar: 'نصف دائرة صغيرة في الأعلى ووعاء كبير في الأسفل.',
      tr: 'Üstte küçük bir yarım daire, altta büyük bir çanak.',
      ur: 'اوپر چھوٹا نصف دائرہ اور نیچے بڑا کٹورا۔',
    },
    letters: [
      { id: 'ain', arab: 'ع', name: { id: "'Ain", en: "'Ain", ar: 'عين', tr: 'Ayn', ur: 'عین' }, audio: "a'a", anatomy: { id: 'Dari tengah tenggorokan (katup napas). Suara terasa ditekan dan berat.', en: 'From the middle of the throat (the windpipe). The sound feels pressed and heavy.', ar: 'من وسط الحلق (مجرى النفس)؛ يُحسّ الصوت مضغوطًا ثقيلًا.', tr: 'Boğazın ortasından (nefes borusunun kapakçığından) çıkar. Ses baskılı ve ağır duyulur.', ur: 'گلے کے درمیانی حصے سے (سانس کی نالی)۔ آواز دبی ہوئی اور بھاری محسوس ہوتی ہے۔' }, logic: { id: 'Mulut terbuka POLOS tanpa titik.', en: 'An open mouth, PLAIN with no dot.', ar: 'فم مفتوح مجرّد بلا نقطة.', tr: 'Açık bir ağız; noktası yok, sade.', ur: 'کھلا ہوا منہ، بغیر نقطہ بالکل سادہ۔' } },
      { id: 'ghain', arab: 'غ', name: { id: 'Ghain', en: 'Ghain', ar: 'غين', tr: 'Gayn', ur: 'غین' }, audio: 'gho', anatomy: { id: 'Dari pangkal tenggorokan sebelah atas. Bergetar lembut seperti berkumur.', en: 'From the upper back of the throat, vibrating gently like gargling.', ar: 'من أعلى أقصى الحلق، يهتز بلطف كالمضمضة.', tr: 'Boğazın üst arka tarafından çıkar; ağız çalkalarmış gibi hafifçe titrer.', ur: 'گلے کے اوپری پیچھے والے حصے سے؛ کلی کرنے کی طرح ہلکا ارتعاش۔' }, logic: { id: 'Mulut terbuka dengan 1 titik di ATAS (lambang kumur air).', en: 'An open mouth with 1 dot ABOVE (symbolising rinsing/gargling).', ar: 'فم مفتوح مع نقطة واحدة فوق (رمز المضمضة).', tr: 'Üstünde 1 nokta bulunan açık ağız (ağız çalkalamayı simgeler).', ur: 'کھلا منہ جس کے اوپر 1 نقطہ ہے (کلی کی علامت)۔' } },
    ],
  },
  {
    groupName: { id: '10. Keluarga Kepala Membulat', en: '10. Round-Head Family', ar: '10. عائلة الرأس المستدير', tr: '10. Yuvarlak Baş Ailesi', ur: '10. گول سر والا خاندان' },
    description: {
      id: 'Bentuk kepala bulat berrongga di bagian atas.',
      en: 'A hollow round head at the top.',
      ar: 'رأس مستدير مجوّف في الأعلى.',
      tr: 'Üstte içi oyuk, yuvarlak bir baş.',
      ur: 'اوپر کھوکھلا گول سر۔',
    },
    letters: [
      { id: 'fa', arab: 'ف', name: { id: 'Fa', en: 'Fa', ar: 'فا', tr: 'Fe', ur: 'فے' }, audio: 'fa', anatomy: { id: 'Perut bibir bawah bagian dalam menempel pada ujung gigi seri atas.', en: 'The inner lower lip meets the edge of the upper front teeth.', ar: 'يلامس باطن الشفة السفلى أطراف الأسنان العليا.', tr: 'Alt dudağın iç kısmı, üst ön dişlerin kenarına değer.', ur: 'نیچے کے ہونٹ کا اندرونی حصہ اوپر کے سامنے والے دانتوں کے کنارے سے ملتا ہے۔' }, logic: { id: 'Kepala bulat berrongga mendatar, dengan 1 titik di ATAS.', en: 'A hollow horizontal round head, with 1 dot ABOVE.', ar: 'رأس مستدير مجوّف أفقي مع نقطة واحدة فوق.', tr: 'İçi oyuk, yatay yuvarlak bir baş; üstünde 1 nokta bulunur.', ur: 'کھوکھلا افقی گول سر، جس کے اوپر 1 نقطہ ہے۔' } },
      { id: 'qaf', arab: 'ق', name: { id: 'Qaf', en: 'Qaf', ar: 'قاف', tr: 'Kaf', ur: 'قاف' }, audio: 'qo', anatomy: { id: 'Pangkal lidah paling dalam menempel pada langit-langit lunak. Suara memantul tebal.', en: 'The very back of the tongue touches the soft palate. A heavy, bouncing sound.', ar: 'يلامس أقصى اللسان اللهاة (الحنك اللين) — صوت مفخّم مرتدّ.', tr: 'Dilin en gerisi yumuşak damağa değer. Kalın ve sekmeli bir sestir.', ur: 'زبان کی سب سے پیچھے والی جڑ نرم تالو سے ملتی ہے۔ بھاری، اچھلتی ہوئی آواز۔' }, logic: { id: 'Kepala bulat dengan mangkuk ke bawah, dan 2 titik di ATAS.', en: 'A round head with a downward bowl, and 2 dots ABOVE.', ar: 'رأس مستدير مع وعاء نازل ونقطتين فوق.', tr: 'Aşağı bakan çanağı olan yuvarlak bir baş ve üstünde 2 nokta.', ur: 'گول سر جس کے نیچے کی جانب کٹورا ہے، اور اوپر 2 نقطے۔' } },
    ],
  },
  {
    groupName: { id: '11. Bentuk Unik (Karakteristik Mandiri)', en: '11. Unique Shapes (standalone)', ar: '11. أشكال فريدة (مستقلة بذاتها)', tr: '11. Özgün Biçimler (bağımsız)', ur: '11. منفرد شکلیں (باقی خاندانوں سے الگ)' },
    description: {
      id: 'Huruf-huruf dengan bentuk spesifik yang tidak bisa dikelompokkan dengan yang lain.',
      en: 'Letters with specific shapes that don’t fit the other families.',
      ar: 'حروف بأشكال خاصة لا تنضم إلى العائلات الأخرى.',
      tr: 'Diğer ailelere uymayan, kendine özgü biçimli harfler.',
      ur: 'ایسے حروف جن کی مخصوص شکلیں باقی خاندانوں میں نہیں سمتیں۔',
    },
    letters: [
      { id: 'mim', arab: 'م', name: { id: 'Mim', en: 'Mim', ar: 'ميم', tr: 'Mim', ur: 'میم' }, audio: 'ma', anatomy: { id: 'Bibir atas dan bawah merapat sempurna dengan suara dengung dari hidung.', en: 'Upper and lower lips close fully, with a nasal hum.', ar: 'تُطبَق الشفتان إطباقًا تامًّا مع غنّةٍ من الأنف.', tr: 'Üst ve alt dudak tamamen kapanır; burundan gelen bir uğultu duyulur.', ur: 'اوپر اور نیچے کے ہونٹ پوری طرح بند ہو جاتے ہیں، اور ناک سے نکلنے والی گونج (غنہ) کے ساتھ۔' }, logic: { id: 'Kepala bundar kecil menghadap ke bawah, diakhiri garis vertikal lurus ke bawah.', en: 'A small round head facing down, ending in a straight vertical stroke.', ar: 'رأس مستدير صغير مواجه للأسفل، ينتهي بخط عمودي مستقيم نازل.', tr: 'Aşağı bakan küçük yuvarlak bir baş, dümdüz dikey bir çizgiyle sona erer.', ur: 'نیچے کی جانب چھوٹا گول سر، جو سیدھی عمودی لکیر پر ختم ہوتا ہے۔' } },
      { id: 'nun', arab: 'ن', name: { id: 'Nun', en: 'Nun', ar: 'نون', tr: 'Nun', ur: 'نون' }, audio: 'na', anatomy: { id: 'Ujung lidah menempel pada gusi atas. Sebagian suara keluar dari rongga hidung.', en: 'The tongue tip touches the upper gum; some sound escapes through the nose.', ar: 'يلمس طرف اللسان اللثة العليا، ويخرج جزء من الصوت من الأنف.', tr: 'Dil ucu üst diş etine değer; sesin bir kısmı burundan kaçar.', ur: 'زبان کی نوک اوپر کے مسوڑھے سے لگتی ہے؛ آواز کا کچھ حصہ ناک سے نکل جاتا ہے۔' }, logic: { id: 'Mangkuk simetris dalam setengah lingkaran, dengan 1 titik persis di TENGAH.', en: 'A deep symmetrical half-circle bowl, with 1 dot exactly in the MIDDLE.', ar: 'وعاء متناظر عميق على هيئة نصف دائرة، مع نقطة واحدة في المنتصف تمامًا.', tr: 'Derin ve simetrik yarım daire biçimli bir çanak; tam ortasında 1 nokta.', ur: 'گہرا ہم آہنگ نصف دائرے کا کٹورا، جس کے بالکل درمیان میں 1 نقطہ ہے۔' } },
      { id: 'ha2', arab: 'هـ', name: { id: 'Ha Besar', en: 'Big Ha', ar: 'هاء', tr: 'Büyük He', ur: 'بڑی ہے' }, audio: 'haa', anatomy: { id: 'Dari pangkal tenggorokan paling bawah (dekat dada). Seperti orang menghela napas panjang.', en: 'From the very bottom of the throat (near the chest), like a long sigh.', ar: 'من أقصى الحلق أسفله (قرب الصدر) — كتنهيدةٍ طويلة.', tr: 'Boğazın en alt kısmından (göğüse yakın) çıkar; uzun bir iç çekiş gibidir.', ur: 'گلے کے سب سے نچلے حصے سے (سینے کے قریب)، جیسے کوئی لمبی سانس چھوڑ رہا ہو۔' }, logic: { id: 'Bentuk simpul ikatan atau dua lubang mata yang saling menumpuk.', en: 'A knotted shape, or two eye-holes stacked on each other.', ar: 'شكل عقدة، أو فتحتَي عينٍ متراكبتين.', tr: 'Bir düğüm biçimi ya da üst üste binmiş iki göz çukuru.', ur: 'گرہ جیسی شکل، یا ایک دوسرے پر سِرے ہوئے دو آنکھ کے سوراخ۔' } },
      { id: 'ya', arab: 'ي', name: { id: 'Ya', en: 'Ya', ar: 'يا', tr: 'Ye', ur: 'یے' }, audio: 'ya', anatomy: { id: 'Tengah lidah diangkat mendekati langit-langit mulut.', en: 'The middle of the tongue rises toward the palate.', ar: 'يرتفع وسط اللسان مقتربًا من الحنك.', tr: 'Dilin orta kısmı damağa doğru yükselir.', ur: 'زبان کا درمیانی حصہ تالو کی جانب اٹھتا ہے۔' }, logic: { id: 'Bentuk seperti angsa berenang, dengan 2 titik di BAWAH perutnya.', en: 'Shaped like a swimming swan, with 2 dots BELOW its belly.', ar: 'على هيئة بجعةٍ تسبح، مع نقطتين تحت بطنها.', tr: 'Yüzen bir kuğu biçimindedir; karnının altında 2 nokta bulunur.', ur: 'تیرتی ہوئی ہنس کی شکل، جس کے پیٹ کے نیچے 2 نقطے ہیں۔' } },
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
    meaning: { id: 'Menulis', en: 'To write', ar: 'الكتابة', tr: 'Yazmak', ur: 'لکھنا' },
    audio: 'kataba',
    letters: [
      { isolated: 'ك', form: 'ﻛ', position: 'Awal', logic: { id: "Huruf Kaf kehilangan 'dudukan/sepatu' bawahnya. Bentuknya diratakan agar sejajar dengan garis dasar untuk menggandeng huruf di kirinya.", en: "Kaf loses its lower 'shoe'. It’s flattened flush to the baseline so it can link to the letter on its left.", ar: 'يُفقد الكاف "حذاءه" السفلي، ويُسطَّح على مستوى السطر كي يتصل بالحرف الذي على يساره.', tr: 'Kef, altındaki "ayakkabısını" yitirir. Soldaki harfe bağlanabilmek için satır çizgisi düzeyine kadar düzleştirilir.', ur: 'کاف اپنا نچلا "جوتا" گنوا دیتا ہے۔ بائیں جانب کے حرف سے جڑنے کے لیے اسے بیس لائن کی سطح تک برابر کر دیا جاتا ہے۔' } },
      { isolated: 'ت', form: 'ﺘ', position: 'Tengah', logic: { id: "Huruf Ta yang aslinya berbentuk mangkuk, kini membuka kedua 'lengannya' ke kanan dan kiri untuk berpegangan erat.", en: "Ta, originally a bowl, now opens both 'arms' left and right to grip its neighbours.", ar: 'التاء — وكانت وعاءً — تفتح "ذراعيها" يمينًا ويسارًا لتتشبث بجاراتها.', tr: 'Te, aslında bir çanaktır; şimdi iki "kolunu" sağa ve sola açarak komşularına sıkıca tutunur.', ur: 'تے، جو اصل میں کٹورے کی شکل کی ہوتی ہے، اب اپنے دونوں "بازو" دائیں بائیں کھول دیتی ہے تاکہ اپنے پڑوسی حروف کو مضبوطی سے تھام سکے۔' } },
      { isolated: 'ب', form: 'ﺐ', position: 'Akhir', logic: { id: 'Huruf Ba berada di akhir. Ia menutup lengannya sebelah kiri (mengembalikan bentuk mangkuk aslinya) sebagai penutup kata.', en: 'Ba is at the end. It closes its left arm (returning to its bowl shape) to cap the word.', ar: 'الباء في الآخر: تُغلِق ذراعها اليسرى (عودةً إلى شكل الوعاء) لتختم الكلمة.', tr: 'Be kelimenin sonundadır. Kelimeyi kapatmak için sol kolunu kapatır (çanak biçimine geri döner).', ur: 'بے لفظ کے آخر میں ہوتی ہے۔ لفظ کو مکمل کرنے کے لیے وہ اپنا بایاں بازو بند کر لیتی ہے (اپنی اصل کٹورے والی شکل میں واپس آ جاتی ہے)۔' } },
    ],
    connectedText: 'كَتَبَ',
  },
  {
    id: 'masjid',
    label: 'مَسْجِد',
    meaning: { id: 'Masjid', en: 'Mosque', ar: 'المسجد', tr: 'Cami', ur: 'مسجد' },
    audio: 'masjid',
    letters: [
      { isolated: 'م', form: 'ﻣ', position: 'Awal', logic: { id: 'Ekor panjang Mim yang menembus ke bawah dipotong habis. Menyisakan kepalanya saja yang sejajar garis dasar.', en: "Mim’s long downward tail is cut off entirely, leaving just its head on the baseline.", ar: 'يُقطَع ذيل الميم النازل الطويل كله، فلا يبقى إلا رأسها على مستوى السطر.', tr: "Mim'in aşağı inen uzun kuyruğu tamamen kesilir; satır çizgisi üzerinde yalnızca başı kalır.", ur: 'میم کی نیچے اترتی لمبی دم مکمل کاٹ دی جاتی ہے؛ بیس لائن پر صرف اس کا سر باقی رہتا ہے۔' } },
      { isolated: 'س', form: 'ﺴ', position: 'Tengah', logic: { id: 'Mangkuk/perut besar Sin dihilangkan. Hanya 3 gigi gergajinya yang tersisa untuk berpegangan di tengah.', en: 'Sin’s large bowl/belly is gone; only its 3 sawtooth peaks remain to link in the middle.', ar: 'يختفي وعاء السين الكبير، وتبقى أسنانه الثلاث لتتعلّق في الوسط.', tr: "Sin'in büyük çanağı/karnı yok olur; ortada bağlanmak için yalnızca 3 testere dişi kalır.", ur: 'سین کا بڑا کٹورا/پیٹ غائب ہو جاتا ہے؛ درمیان میں جڑنے کے لیے صرف اس کے 3 آری دانت باقی رہتے ہیں۔' } },
      { isolated: 'ج', form: 'ﺠ', position: 'Tengah', logic: { id: 'Perut besar Jim dipotong menjadi garis lurus mendatar. Titiknya yang semula di dalam perut, kini berada di bawah garis.', en: "Jim’s big belly is trimmed to a flat line. Its dot moves from inside the belly to below the line.", ar: 'يُقصّ بطن الجيم الكبير إلى خط مستقيم أفقي، وتنتقل نقطته من داخل البطن إلى تحت الخط.', tr: "Cim'in büyük karnı düz bir çizgiye kadar kesilir. Noktası karnın içinden çizginin altına taşar.", ur: 'جیم کا بڑا پیٹ سیدھی افقی لکیر پر کاٹ دیا جاتا ہے۔ اس کا نقطہ جو پہلے پیٹ کے اندر ہوتا تھا اب لکیر کے نیچے آ جاتا ہے۔' } },
      { isolated: 'د', form: 'ﺪ', position: 'Akhir', logic: { id: "Dal adalah 'Huruf Sombong' (tidak bisa menyambung ke kiri). Di akhir, ia hanya berpegangan ke huruf sebelumnya di sebelah kanan.", en: "Dal is a 'selfish letter' — it can’t connect forward. At the end it only holds onto the letter before it.", ar: 'الدال "حرف أنانيّ" لا يتصل بما بعده؛ في الآخر يتشبث فقط بالحرف الذي قبله.', tr: 'Dal "bencil harf"tir — ileriye bağlanamaz. Sonda yalnızca kendinden önceki harfe tutunur.', ur: 'دال "خود پسند حرف" ہے — یہ آگے جڑ نہیں سکتا۔ آخر میں یہ صرف اپنے سے پہلے والے (دائیں جانب کے) حرف سے تھام لیتا ہے۔' } },
    ],
    connectedText: 'مَسْجِد',
  },
  {
    id: 'qalam',
    label: 'قَلَم',
    meaning: { id: 'Pena', en: 'Pen', ar: 'القلم', tr: 'Kalem', ur: 'قلم' },
    audio: 'qalam',
    letters: [
      { isolated: 'ق', form: 'ﻗ', position: 'Awal', logic: { id: 'Qaf membuang lengkungan perut besarnya; hanya kepala oval dengan 2 titik di atas yang tersisa untuk menggandeng huruf di kirinya.', en: 'Qaf drops its large curving belly; only the oval head with 2 dots above remains to link left.', ar: 'يُلقي القاف بطنه الكبير المنحني، فلا يبقى إلا الرأس البيضاوي بنقطتين فوقه ليتصل بما على يساره.', tr: 'Kaf, büyük kıvrık karnını bırakır; sola bağlanmak için üstünde 2 nokta bulunan oval başı kalır.', ur: 'قاف اپنا بڑا مڑا ہوا پیٹ چھوڑ دیتا ہے؛ بائیں جڑنے کے لیے صرف اوپر 2 نقطوں والا انڈاکار سر باقی رہتا ہے۔' } },
      { isolated: 'ل', form: 'ﻠ', position: 'Tengah', logic: { id: 'Lam membuka kailnya ke kanan dan ke kiri, menjadi jembatan lurus di tengah kata.', en: 'Lam opens its hook both left and right, becoming a straight bridge through the middle of the word.', ar: 'يفتح اللام خطّافه يمينًا ويسارًا فيصير جسرًا مستقيمًا في وسط الكلمة.', tr: 'Lam kancasını hem sağa hem sola açar; kelimenin ortasında dümdüz bir köprü olur.', ur: 'لام اپنا کانٹا دائیں بائیں دونوں جانب کھول دیتی ہے اور لفظ کے درمیان سیدھا پل بن جاتی ہے۔' } },
      { isolated: 'م', form: 'ﻢ', position: 'Akhir', logic: { id: 'Mim menutup ekor panjangnya dan kembali ke kepala bundarnya sebagai penutup kata.', en: 'Mim closes its long tail and returns to its round head to cap the word.', ar: 'يُغلِق الميم ذيله الطويل ويعود إلى رأسه المستدير ليختم الكلمة.', tr: 'Mim uzun kuyruğunu kapatır ve kelimeyi bitirmek için yuvarlak başına döner.', ur: 'میم اپنی لمبی دم بند کرتی ہے اور لفظ کا اختتام کرنے کے لیے اپنے گول سر پر واپس آ جاتی ہے۔' } },
    ],
    connectedText: 'قَلَم',
  },
  {
    id: 'bism',
    label: 'بِسْمِ',
    meaning: { id: 'Nama', en: 'Name', ar: 'الاسم', tr: 'İsim', ur: 'نام' },
    audio: 'bismi',
    letters: [
      { isolated: 'ب', form: 'ﺑ', position: 'Awal', logic: { id: "Ba membuka 'lengannya' ke kiri, siap menggandeng huruf berikutnya.", en: "Ba opens its 'arm' to the left, ready to link to the next letter.", ar: 'تفتح الباء "ذراعها" إلى اليسار مستعدةً للاتصال بالحرف التالي.', tr: 'Be, "kolunu" sola açar; bir sonraki harfe bağlanmaya hazırdır.', ur: 'بے اپنا "بازو" بائیں جانب کھول دیتی ہے، اگلے حرف سے جڑنے کے لیے تیار۔' } },
      { isolated: 'س', form: 'ﺴ', position: 'Tengah', logic: { id: 'Sin hanya menyisakan 3 gigi gergajinya di tengah; perut besarnya hilang agar muat berpegangan.', en: 'Sin keeps only its 3 sawtooth peaks in the middle; its big belly vanishes so it can link.', ar: 'يبقي السين أسنانه الثلاث في الوسط فقط، ويختفي بطنه الكبير ليتسع للتشبث.', tr: 'Sin, ortada yalnızca 3 testere dişini korur; bağlanabilmek için büyük karnı yok olur.', ur: 'سین درمیان میں صرف اپنے 3 آری دانت رکھتا ہے؛ جڑنے کے لیے جگہ بنانے کی خاطر اس کا بڑا پیٹ غائب ہو جاتا ہے۔' } },
      { isolated: 'م', form: 'ﻢ', position: 'Akhir', logic: { id: 'Mim menutup ekornya, kembali ke kepala bundar sebagai penutup kata.', en: 'Mim closes its tail, returning to its round head to cap the word.', ar: 'يُغلِق الميم ذيله ويعود إلى رأسه المستدير ليختم الكلمة.', tr: 'Mim kuyruğunu kapatır ve kelimeyi bitirmek için yuvarlak başına döner.', ur: 'میم اپنی دم بند کرتی ہے اور لفظ کا اختتام کرنے کے لیے اپنے گول سر پر واپس آ جاتی ہے۔' } },
    ],
    connectedText: 'بِسْمِ',
  },
  {
    id: 'najm',
    label: 'نَجْم',
    meaning: { id: 'Bintang', en: 'Star', ar: 'النجم', tr: 'Yıldız', ur: 'ستارہ' },
    audio: 'najm',
    letters: [
      { isolated: 'ن', form: 'ﻧ', position: 'Awal', logic: { id: 'Nun membuka mangkuknya ke kiri; titiknya ikut menyisir menyamping untuk menggandeng huruf berikutnya.', en: 'Nun opens its bowl to the left; its dot shifts sideways to link to the next letter.', ar: 'تفتح النون وعاءها إلى اليسار، وتزحف نقطتها جانبيًا لتتصل بالحرف التالي.', tr: 'Nun çanağını sola açar; noktası bir sonraki harfe bağlanmak için yana kayar.', ur: 'نون اپنا کٹورا بائیں جانب کھول دیتی ہے؛ اس کا نقطہ اگلے حرف سے جڑنے کے لیے ایک طرف ہٹ جاتا ہے۔' } },
      { isolated: 'ج', form: 'ﺠ', position: 'Tengah', logic: { id: 'Perut besar Jim dipotong rata; titiknya turun di bawah garis saat berada di tengah.', en: "Jim’s big belly is trimmed flat; its dot drops below the line in the medial position.", ar: 'يُقصّ بطن الجيم الكبير مستويًا، وتنزل نقطته تحت الخط في الوضع الوسطي.', tr: "Cim'in büyük karnı düz kesilir; ortada bulunurken noktası çizginin altına iner.", ur: 'جیم کا بڑا پیٹ چپٹا کاٹ دیا جاتا ہے؛ درمیانی حالت میں اس کا نقطہ لکیر کے نیچے اتر جاتا ہے۔' } },
      { isolated: 'م', form: 'ﻢ', position: 'Akhir', logic: { id: 'Mim menutup ekornya, kembali ke kepala bundar sebagai penutup kata.', en: 'Mim closes its tail, returning to its round head to cap the word.', ar: 'يُغلِق الميم ذيله ويعود إلى رأسه المستدير ليختم الكلمة.', tr: 'Mim kuyruğunu kapatır ve kelimeyi bitirmek için yuvarlak başına döner.', ur: 'میم اپنی دم بند کرتی ہے اور لفظ کا اختتام کرنے کے لیے اپنے گول سر پر واپس آ جاتی ہے۔' } },
    ],
    connectedText: 'نَجْم',
  },
];
