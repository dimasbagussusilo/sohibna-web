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
    groupName: { id: '1. Keluarga Garis Vertikal', en: '1. Vertical-Line Family' },
    description: {
      id: 'Memiliki garis lurus tegak sebagai pembentuk utama.',
      en: 'Built primarily around a straight upright stroke.',
    },
    letters: [
      { id: 'alif', arab: 'ا', name: 'Alif', audio: 'a', anatomy: { id: 'Keluar dari rongga mulut bagian dalam. Suaranya murni berupa hembusan napas yang beresonansi tanpa hambatan.', en: 'Comes from the back of the mouth cavity. A pure breath of air that resonates freely, with no obstruction.' }, logic: { id: 'Bentuk paling dasar: Garis lurus vertikal sederhana melambangkan fondasi berdiri tegak.', en: 'The most basic shape: a simple straight vertical line, the foundation standing upright.' } },
      { id: 'lam', arab: 'ل', name: 'Lam', audio: 'la', anatomy: { id: 'Ujung lidah menempel pada gusi gigi seri atas secara melebar.', en: 'The tip of the tongue spreads flat against the gum behind the upper front teeth.' }, logic: { id: "Seperti Alif, namun memiliki kail pancing di bagian bawah yang melengkung tajam ke kiri.", en: 'Like Alif, but with a fish-hook curling sharply to the left at the bottom.' } },
      { id: 'kaf', arab: 'ك', name: 'Kaf', audio: 'ka', anatomy: { id: 'Pangkal lidah menempel pada langit-langit bagian tengah (sedikit di depan makhraj Qaf).', en: 'The back of the tongue touches the mid-palate (slightly ahead of the Qaf articulation).' }, logic: { id: 'Garis tegak dengan dudukan siku. Terdapat ornamen huruf kaf kecil (menyerupai hamzah) di dalamnya.', en: 'An upright stroke with an elbow rest. A small kaf ornament (like a hamzah) sits inside it.' } },
    ],
  },
  {
    groupName: { id: '2. Keluarga Mangkuk / Perahu', en: '2. Bowl / Boat Family' },
    description: {
      id: 'Melengkung mendatar. Hanya dibedakan oleh jumlah dan letak titik.',
      en: 'A horizontal curve. Distinguished only by the number and position of dots.',
    },
    letters: [
      { id: 'ba', arab: 'ب', name: 'Ba', audio: 'ba', anatomy: { id: 'Merapatkan kedua bibir. Suara tertahan sejenak lalu dilepaskan.', en: 'Press both lips together. The sound is held briefly, then released.' }, logic: { id: 'Bentuk perahu dengan 1 titik di BAWAH. (Tips: B = Bawah).', en: 'A boat shape with 1 dot BELOW. (Tip: B = Below).' } },
      { id: 'ta', arab: 'ت', name: 'Ta', audio: 'ta', anatomy: { id: 'Ujung lidah menempel pada pangkal gigi seri atas bagian dalam.', en: 'The tongue tip touches the inner base of the upper front teeth.' }, logic: { id: 'Bentuk perahu dengan 2 titik di ATAS. (Tips: T = Tinggi/Top).', en: 'A boat shape with 2 dots ABOVE. (Tip: T = Top).' } },
      { id: 'tsa', arab: 'ث', name: 'Tsa', audio: 'tsa', anatomy: { id: 'Ujung lidah sedikit dikeluarkan dan disentuh lembut oleh ujung gigi seri atas.', en: 'The tongue tip pokes out slightly and is gently touched by the upper front teeth.' }, logic: { id: 'Bentuk perahu dengan 3 titik di ATAS. Titik ekstra menghasilkan desisan hembusan yang lebih banyak.', en: 'A boat shape with 3 dots ABOVE. The extra dot produces a stronger hiss.' } },
    ],
  },
  {
    groupName: { id: '3. Keluarga Kepala Jangkar', en: '3. Anchor-Head Family' },
    description: {
      id: 'Kepala mendatar dan perut melengkung besar menembus garis bawah.',
      en: 'A horizontal head with a large curving belly that drops below the line.',
    },
    letters: [
      { id: 'jim', arab: 'ج', name: 'Jim', audio: 'ja', anatomy: { id: 'Tengah lidah menempel kuat pada langit-langit mulut. Terdapat efek tertahan.', en: 'The middle of the tongue presses firmly against the palate, with a held effect.' }, logic: { id: 'Bentuk kail dengan 1 titik di TENGAH perut. (Tips: J = Jantung).', en: 'A hook shape with 1 dot in the MIDDLE of the belly. (Tip: J = Jantung/heart).' } },
      { id: 'ha', arab: 'ح', name: 'Ha', audio: 'ha', anatomy: { id: 'Keluar dari tengah tenggorokan. Menghasilkan hembusan udara hangat bersih.', en: 'Comes from the middle of the throat, producing a clean warm breath.' }, logic: { id: 'Bentuk kail POLOS tanpa titik sama sekali. Lambang kebersihan/hampa udara.', en: 'A PLAIN hook with no dots at all — a symbol of emptiness/clean air.' } },
      { id: 'kha', arab: 'خ', name: 'Kha', audio: 'kha', anatomy: { id: 'Keluar dari ujung pangkal tenggorokan. Ada efek gesekan kasar.', en: 'Comes from the upper end of the throat, with a rough scraping effect.' }, logic: { id: 'Bentuk kail dengan 1 titik di ATAS kepala. Ibarat debu di atas tenggorokan.', en: 'A hook with 1 dot ABOVE the head — like dust settling on the throat.' } },
    ],
  },
  {
    groupName: { id: '4. Keluarga Siku Patah', en: '4. Broken-Elbow Family' },
    description: {
      id: 'Garis menyudut seperti orang duduk atau mulut buaya.',
      en: 'An angled line, like a seated figure or a crocodile’s jaw.',
    },
    letters: [
      { id: 'dal', arab: 'د', name: 'Dal', audio: 'da', anatomy: { id: 'Ujung lidah menempel pada pangkal gigi seri atas (seperti makhraj Ta).', en: 'The tongue tip touches the base of the upper front teeth (like the Ta sound).' }, logic: { id: 'Sudut patah POLOS tanpa titik.', en: 'A PLAIN bent angle with no dot.' } },
      { id: 'dzal', arab: 'ذ', name: 'Dzal', audio: 'dza', anatomy: { id: 'Ujung lidah sedikit dikeluarkan dan disentuh gigi seri atas (seperti makhraj Tsa).', en: 'The tongue tip pokes out slightly to meet the upper front teeth (like the Tsa sound).' }, logic: { id: 'Sudut patah dengan 1 titik di ATAS. Titik menandakan getaran ekstra di ujung lidah.', en: 'A bent angle with 1 dot ABOVE. The dot marks extra vibration at the tongue tip.' } },
    ],
  },
  {
    groupName: { id: '5. Keluarga Seluncuran', en: '5. Slide Family' },
    description: {
      id: 'Garis yang meluncur melengkung ke bawah menembus batas baris.',
      en: 'A line that slides downward in a curve, breaking past the baseline.',
    },
    letters: [
      { id: 'ra', arab: 'ر', name: 'Ra', audio: 'ro', anatomy: { id: 'Ujung lidah menyentuh gusi atas agak ke dalam dengan sedikit getaran (takrir).', en: 'The tongue tip touches the upper gum a little inward, with a slight trill (takrir).' }, logic: { id: 'Melengkung ke bawah POLOS tanpa titik.', en: 'A downward curve, PLAIN with no dot.' } },
      { id: 'zai', arab: 'ز', name: 'Zai', audio: 'za', anatomy: { id: 'Ujung lidah menempel di belakang gigi seri bawah. Menghasilkan suara desisan tajam (lebah).', en: 'The tongue tip sits behind the lower front teeth, making a sharp buzz (like a bee).' }, logic: { id: 'Melengkung ke bawah dengan 1 titik di ATAS. Titik lambang dengungan lebah.', en: 'A downward curve with 1 dot ABOVE — the dot symbolises the bee’s buzz.' } },
      { id: 'wau', arab: 'و', name: 'Wau', audio: 'wa', anatomy: { id: 'Kedua bibir dimajukan dan dibulatkan ke depan (monyong), menyisakan celah kecil.', en: 'Both lips push forward and round (pursed), leaving a small opening.' }, logic: { id: 'Mirip Ra, namun memiliki kepala bulat penuh tertutup di ujung atasnya.', en: 'Like Ra, but with a full round head closed off at the top.' } },
    ],
  },
  {
    groupName: { id: '6. Keluarga Gigi Gergaji', en: '6. Sawtooth Family' },
    description: {
      id: 'Memiliki bentuk seperti sisir atau gigi kecil di awalnya.',
      en: 'Begins with a comb-like row of small teeth.',
    },
    letters: [
      { id: 'sin', arab: 'س', name: 'Sin', audio: 'sa', anatomy: { id: 'Ujung lidah di belakang gigi seri bawah. Udara berdesis mengalir (seperti suara ular).', en: 'The tongue tip behind the lower front teeth. Air hisses through (like a snake).' }, logic: { id: 'Tiga gigi gergaji POLOS. Disusul mangkuk besar di akhirnya.', en: 'Three PLAIN sawtooth peaks, followed by a large bowl at the end.' } },
      { id: 'syin', arab: 'ش', name: 'Syin', audio: 'sya', anatomy: { id: 'Tengah lidah menempel pada langit-langit (tanpa merapat). Udara menyebar ke seluruh mulut.', en: 'The middle of the tongue nears the palate (without touching); air spreads across the whole mouth.' }, logic: { id: 'Tiga gigi gergaji dengan 3 titik di ATAS. Titik melambangkan udara yang menyebar luas.', en: 'Three sawtooth peaks with 3 dots ABOVE — symbolising air spreading widely.' } },
    ],
  },
  {
    groupName: { id: '7. Keluarga Oval Berekor', en: '7. Tailed-Oval Family' },
    description: {
      id: 'Kepala berbentuk bulat lonjong/oval dengan perut melengkung besar.',
      en: 'An oval/round head with a large curving belly.',
    },
    letters: [
      { id: 'shad', arab: 'ص', name: 'Shad', audio: 'sho', anatomy: { id: 'Seperti Sin, tapi pangkal lidah diangkat ke atas, membuat suara menjadi tebal/berat.', en: 'Like Sin, but the back of the tongue rises, making the sound heavy/full.' }, logic: { id: 'Kepala oval dengan perut besar, POLOS tanpa titik.', en: 'An oval head with a large belly, PLAIN with no dot.' } },
      { id: 'dhad', arab: 'ض', name: 'Dhad', audio: 'dho', anatomy: { id: 'Sisi lidah (kanan/kiri) menempel pada gigi geraham atas. Ini huruf Arab yang paling unik.', en: 'The side of the tongue touches the upper molars. The most distinctive Arabic letter.' }, logic: { id: 'Kepala oval dengan perut besar dan 1 titik di ATAS.', en: 'An oval head with a large belly and 1 dot ABOVE.' } },
    ],
  },
  {
    groupName: { id: '8. Keluarga Oval Bertiang', en: '8. Oval-on-a-Pillar Family' },
    description: {
      id: 'Kepala bulat lonjong yang ditancapkan tiang lurus tegak di atasnya.',
      en: 'A round oval head planted on a straight upright pillar.',
    },
    letters: [
      { id: 'tha', arab: 'ط', name: 'Tha', audio: 'tho', anatomy: { id: 'Seperti Ta, tapi pangkal lidah diangkat. Suara meletup dan tebal (Qalqalah).', en: 'Like Ta, but the back of the tongue rises — a heavy, popping sound (Qalqalah).' }, logic: { id: 'Oval dengan tiang, POLOS tanpa titik.', en: 'An oval on a pillar, PLAIN with no dot.' } },
      { id: 'zha', arab: 'ظ', name: 'Zha', audio: 'zho', anatomy: { id: 'Seperti Dzal, tapi pangkal lidah diangkat. Suara tebal dan berdengung.', en: 'Like Dzal, but the back of the tongue rises — a heavy, buzzing sound.' }, logic: { id: 'Oval dengan tiang dan 1 titik di ATAS.', en: 'An oval on a pillar with 1 dot ABOVE.' } },
    ],
  },
  {
    groupName: { id: '9. Keluarga Cangkang Terbuka', en: '9. Open-Shell Family' },
    description: {
      id: 'Bentuk setengah lingkaran kecil di atas, dengan mangkuk besar di bawah.',
      en: 'A small half-circle on top with a large bowl below.',
    },
    letters: [
      { id: 'ain', arab: 'ع', name: "'Ain", audio: "a'a", anatomy: { id: 'Dari tengah tenggorokan (katup napas). Suara terasa ditekan dan berat.', en: 'From the middle of the throat (the windpipe). The sound feels pressed and heavy.' }, logic: { id: 'Mulut terbuka POLOS tanpa titik.', en: 'An open mouth, PLAIN with no dot.' } },
      { id: 'ghain', arab: 'غ', name: 'Ghain', audio: 'gho', anatomy: { id: 'Dari pangkal tenggorokan sebelah atas. Bergetar lembut seperti berkumur.', en: 'From the upper back of the throat, vibrating gently like gargling.' }, logic: { id: 'Mulut terbuka dengan 1 titik di ATAS (lambang kumur air).', en: 'An open mouth with 1 dot ABOVE (symbolising rinsing/gargling).' } },
    ],
  },
  {
    groupName: { id: '10. Keluarga Kepala Membulat', en: '10. Round-Head Family' },
    description: {
      id: 'Bentuk kepala bulat berrongga di bagian atas.',
      en: 'A hollow round head at the top.',
    },
    letters: [
      { id: 'fa', arab: 'ف', name: 'Fa', audio: 'fa', anatomy: { id: 'Perut bibir bawah bagian dalam menempel pada ujung gigi seri atas.', en: 'The inner lower lip meets the edge of the upper front teeth.' }, logic: { id: 'Kepala bulat berrongga mendatar, dengan 1 titik di ATAS.', en: 'A hollow horizontal round head, with 1 dot ABOVE.' } },
      { id: 'qaf', arab: 'ق', name: 'Qaf', audio: 'qo', anatomy: { id: 'Pangkal lidah paling dalam menempel pada langit-langit lunak. Suara memantul tebal.', en: 'The very back of the tongue touches the soft palate. A heavy, bouncing sound.' }, logic: { id: 'Kepala bulat dengan mangkuk ke bawah, dan 2 titik di ATAS.', en: 'A round head with a downward bowl, and 2 dots ABOVE.' } },
    ],
  },
  {
    groupName: { id: '11. Bentuk Unik (Karakteristik Mandiri)', en: '11. Unique Shapes (standalone)' },
    description: {
      id: 'Huruf-huruf dengan bentuk spesifik yang tidak bisa dikelompokkan dengan yang lain.',
      en: 'Letters with specific shapes that don’t fit the other families.',
    },
    letters: [
      { id: 'mim', arab: 'م', name: 'Mim', audio: 'ma', anatomy: { id: 'Bibir atas dan bawah merapat sempurna dengan suara dengung dari hidung.', en: 'Upper and lower lips close fully, with a nasal hum.' }, logic: { id: 'Kepala bundar kecil menghadap ke bawah, diakhiri garis vertikal lurus ke bawah.', en: 'A small round head facing down, ending in a straight vertical stroke.' } },
      { id: 'nun', arab: 'ن', name: 'Nun', audio: 'na', anatomy: { id: 'Ujung lidah menempel pada gusi atas. Sebagian suara keluar dari rongga hidung.', en: 'The tongue tip touches the upper gum; some sound escapes through the nose.' }, logic: { id: 'Mangkuk simetris dalam setengah lingkaran, dengan 1 titik persis di TENGAH.', en: 'A deep symmetrical half-circle bowl, with 1 dot exactly in the MIDDLE.' } },
      { id: 'ha2', arab: 'هـ', name: 'Ha Besar', audio: 'haa', anatomy: { id: 'Dari pangkal tenggorokan paling bawah (dekat dada). Seperti orang menghela napas panjang.', en: 'From the very bottom of the throat (near the chest), like a long sigh.' }, logic: { id: 'Bentuk simpul ikatan atau dua lubang mata yang saling menumpuk.', en: 'A knotted shape, or two eye-holes stacked on each other.' } },
      { id: 'ya', arab: 'ي', name: 'Ya', audio: 'ya', anatomy: { id: 'Tengah lidah diangkat mendekati langit-langit mulut.', en: 'The middle of the tongue rises toward the palate.' }, logic: { id: 'Bentuk seperti angsa berenang, dengan 2 titik di BAWAH perutnya.', en: 'Shaped like a swimming swan, with 2 dots BELOW its belly.' } },
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
    meaning: { id: 'Menulis', en: 'To write' },
    audio: 'kataba',
    letters: [
      { isolated: 'ك', form: 'ﻛ', position: 'Awal', logic: { id: "Huruf Kaf kehilangan 'dudukan/sepatu' bawahnya. Bentuknya diratakan agar sejajar dengan garis dasar untuk menggandeng huruf di kirinya.", en: "Kaf loses its lower 'shoe'. It’s flattened flush to the baseline so it can link to the letter on its left." } },
      { isolated: 'ت', form: 'ﺘ', position: 'Tengah', logic: { id: "Huruf Ta yang aslinya berbentuk mangkuk, kini membuka kedua 'lengannya' ke kanan dan kiri untuk berpegangan erat.", en: "Ta, originally a bowl, now opens both 'arms' left and right to grip its neighbours." } },
      { isolated: 'ب', form: 'ﺐ', position: 'Akhir', logic: { id: 'Huruf Ba berada di akhir. Ia menutup lengannya sebelah kiri (mengembalikan bentuk mangkuk aslinya) sebagai penutup kata.', en: 'Ba is at the end. It closes its left arm (returning to its bowl shape) to cap the word.' } },
    ],
    connectedText: 'كَتَبَ',
  },
  {
    id: 'masjid',
    label: 'مَسْجِد',
    meaning: { id: 'Masjid', en: 'Mosque' },
    audio: 'masjid',
    letters: [
      { isolated: 'م', form: 'ﻣ', position: 'Awal', logic: { id: 'Ekor panjang Mim yang menembus ke bawah dipotong habis. Menyisakan kepalanya saja yang sejajar garis dasar.', en: "Mim’s long downward tail is cut off entirely, leaving just its head on the baseline." } },
      { isolated: 'س', form: 'ﺴ', position: 'Tengah', logic: { id: 'Mangkuk/perut besar Sin dihilangkan. Hanya 3 gigi gergajinya yang tersisa untuk berpegangan di tengah.', en: 'Sin’s large bowl/belly is gone; only its 3 sawtooth peaks remain to link in the middle.' } },
      { isolated: 'ج', form: 'ﺠ', position: 'Tengah', logic: { id: 'Perut besar Jim dipotong menjadi garis lurus mendatar. Titiknya yang semula di dalam perut, kini berada di bawah garis.', en: "Jim’s big belly is trimmed to a flat line. Its dot moves from inside the belly to below the line." } },
      { isolated: 'د', form: 'ﺪ', position: 'Akhir', logic: { id: "Dal adalah 'Huruf Sombong' (tidak bisa menyambung ke kiri). Di akhir, ia hanya berpegangan ke huruf sebelumnya di sebelah kanan.", en: "Dal is a 'selfish letter' — it can’t connect forward. At the end it only holds onto the letter before it." } },
    ],
    connectedText: 'مَسْجِد',
  },
  {
    id: 'qalam',
    label: 'قَلَم',
    meaning: { id: 'Pena', en: 'Pen' },
    audio: 'qalam',
    letters: [
      { isolated: 'ق', form: 'ﻗ', position: 'Awal', logic: { id: 'Qaf membuang lengkungan perut besarnya; hanya kepala oval dengan 2 titik di atas yang tersisa untuk menggandeng huruf di kirinya.', en: 'Qaf drops its large curving belly; only the oval head with 2 dots above remains to link left.' } },
      { isolated: 'ل', form: 'ﻠ', position: 'Tengah', logic: { id: 'Lam membuka kailnya ke kanan dan ke kiri, menjadi jembatan lurus di tengah kata.', en: 'Lam opens its hook both left and right, becoming a straight bridge through the middle of the word.' } },
      { isolated: 'م', form: 'ﻢ', position: 'Akhir', logic: { id: 'Mim menutup ekor panjangnya dan kembali ke kepala bundarnya sebagai penutup kata.', en: 'Mim closes its long tail and returns to its round head to cap the word.' } },
    ],
    connectedText: 'قَلَم',
  },
  {
    id: 'bism',
    label: 'بِسْمِ',
    meaning: { id: 'Nama', en: 'Name' },
    audio: 'bismi',
    letters: [
      { isolated: 'ب', form: 'ﺑ', position: 'Awal', logic: { id: "Ba membuka 'lengannya' ke kiri, siap menggandeng huruf berikutnya.", en: "Ba opens its 'arm' to the left, ready to link to the next letter." } },
      { isolated: 'س', form: 'ﺴ', position: 'Tengah', logic: { id: 'Sin hanya menyisakan 3 gigi gergajinya di tengah; perut besarnya hilang agar muat berpegangan.', en: 'Sin keeps only its 3 sawtooth peaks in the middle; its big belly vanishes so it can link.' } },
      { isolated: 'م', form: 'ﻢ', position: 'Akhir', logic: { id: 'Mim menutup ekornya, kembali ke kepala bundar sebagai penutup kata.', en: 'Mim closes its tail, returning to its round head to cap the word.' } },
    ],
    connectedText: 'بِسْمِ',
  },
  {
    id: 'najm',
    label: 'نَجْم',
    meaning: { id: 'Bintang', en: 'Star' },
    audio: 'najm',
    letters: [
      { isolated: 'ن', form: 'ﻧ', position: 'Awal', logic: { id: 'Nun membuka mangkuknya ke kiri; titiknya ikut menyisir menyamping untuk menggandeng huruf berikutnya.', en: 'Nun opens its bowl to the left; its dot shifts sideways to link to the next letter.' } },
      { isolated: 'ج', form: 'ﺠ', position: 'Tengah', logic: { id: 'Perut besar Jim dipotong rata; titiknya turun di bawah garis saat berada di tengah.', en: "Jim’s big belly is trimmed flat; its dot drops below the line in the medial position." } },
      { isolated: 'م', form: 'ﻢ', position: 'Akhir', logic: { id: 'Mim menutup ekornya, kembali ke kepala bundar sebagai penutup kata.', en: 'Mim closes its tail, returning to its round head to cap the word.' } },
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
    title: 'Sukun',
    subtitle: { id: '(Mati / Rem)', en: '(Stop / Brake)' },
    icon: 'hand-paper',
    analogyIcon: 'car',
    analogy: { id: 'Sukun itu ibarat <strong>mengerem mobil</strong> secara mendadak. Suara berhenti seketika di huruf tersebut tanpa diberi vokal (a, i, u).', en: 'Sukun is like <strong>braking a car</strong> suddenly. The sound stops dead on that letter, with no vowel (a, i, u) added.' },
    mechanics: { id: 'Kunci rapat posisi mulut (makhraj) pada huruf yang bersukun dan hentikan aliran napas atau suara di titik tersebut.', en: 'Lock the mouth position (makhraj) on the sukun letter and stop the flow of breath/sound right there.' },
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
    title: 'Tasydid',
    subtitle: { id: '(Ganda / Tahan)', en: '(Doubled / Held)' },
    icon: 'compress',
    analogyIcon: 'road',
    analogy: { id: 'Tasydid ibarat melewati <strong>polisi tidur</strong>. Anda harus mengerem (menahan) sejenak, lalu baru mengegas (melepas) kembali.', en: 'Tasydid is like driving over a <strong>speed bump</strong>. You brake (hold) briefly, then accelerate (release) again.' },
    mechanics: { id: 'Huruf bertasydid sebenarnya adalah dua huruf yang sama. Huruf pertama mati (ditahan), huruf kedua hidup (dilepas). Contoh: Rab-ba.', en: 'A tasydid letter is really two of the same letter: the first is silent (held), the second is vowelled (released). E.g. Rab-ba.' },
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
    title: 'Tanwin',
    subtitle: { id: "(Akhiran 'N')", en: "(Final 'N')" },
    icon: 'coins',
    analogyIcon: 'coins',
    analogy: { id: "Tanwin ibarat menjatuhkan <strong>koin ke dalam kaleng</strong>. Apapun hurufnya, selalu diakhiri dengan bunyi dering 'N' di ujungnya (an, in, un).", en: "Tanwin is like <strong>dropping a coin into a tin</strong>. Whatever the letter, it always ends with a ringing 'N' (an, in, un)." },
    mechanics: { id: "Cukup tambahkan bunyi huruf 'N' mati di akhir vokal. Bunyi ini dikeluarkan dengan menyentuhkan ujung lidah ke langit-langit (makhraj Nun).", en: "Just add a silent 'N' sound after the final vowel, made by touching the tongue tip to the palate (the Nun articulation)." },
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
    title: 'Ghunnah',
    subtitle: { id: '(Getaran Hidung)', en: '(Nasal Buzz)' },
    icon: 'vibrate',
    analogyIcon: 'vibrate',
    arab: 'إِنَّ',
    latin: 'Innn - na',
    type: 'vibrate',
    duration: 2000,
    analogy: { id: 'Ibarat <strong>seekor lebah</strong> yang terperangkap di dalam hidung Anda. Suara ditahan dan digetarkan dengan durasi 2-3 ketukan penuh.', en: 'Like a <strong>bee</strong> trapped inside your nose. The sound is held and vibrated for a full 2–3 beats.' },
    mechanics: { id: 'Tutup aliran udara dari mulut sepenuhnya. Dorong suara ke arah rongga hidung (khaisyum) hingga Anda merasakan getaran di tulang hidung.', en: 'Block the airflow from the mouth entirely. Push the sound into the nasal cavity until you feel the vibration in your nose bone.' },
  },
  {
    id: 'qalqalah',
    title: 'Qalqalah',
    subtitle: { id: '(Pantulan Mendadak)', en: '(Sudden Bounce)' },
    icon: 'bounce',
    analogyIcon: 'bounce',
    arab: 'فَلَقْ',
    latin: 'Fa-la-Qe',
    type: 'bounce',
    duration: 1000,
    analogy: { id: 'Ibarat <strong>bola basket</strong> yang dilemparkan ke lantai. Begitu membentur lantai, ia harus langsung memantul naik secara spontan.', en: 'Like a <strong>basketball</strong> thrown at the floor — the moment it hits, it bounces right back up.' },
    mechanics: { id: "Tekan letak suara (makhraj) huruf dengan kuat, lalu lepaskan secara tiba-tiba tanpa memberikan vokal tambahan. Menghasilkan efek letupan 'e' kecil.", en: "Press the letter’s articulation point firmly, then release it abruptly with no added vowel — producing a small echoing 'e'." },
  },
];

// ---------------------------------------------------------------------------
// PHASE 2 — Harakat Dasar (the three short vowels: Fathah/Kasroh/Dhomah).
// ---------------------------------------------------------------------------

export const HARAKAT_SIGNS: HarakatSign[] = [
  {
    id: 'fathah',
    name: 'Fathah',
    sign: 'ـَ',
    sound: 'a',
    carrier: 'بَ',
    desc: {
      id: 'Garis lurus di ATAS huruf. Menghasilkan bunyi vokal "a" yang terbuka (mulut menganga).',
      en: 'A straight line ABOVE the letter. Produces the open "a" vowel (mouth opens wide).',
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
    name: 'Kasroh',
    sign: 'ـِ',
    sound: 'i',
    carrier: 'بِ',
    desc: {
      id: 'Garis lurus di BAWAH huruf. Menghasilkan bunyi vokal "i" (mulut menyempit ke samping).',
      en: 'A straight line BELOW the letter. Produces the "i" vowel (mouth narrows sideways).',
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
    name: 'Dhomah',
    sign: 'ـُ',
    sound: 'u',
    carrier: 'بُ',
    desc: {
      id: 'Seperti huruf waw (و) kecil di ATAS huruf. Menghasilkan bunyi vokal "u" (bibir monyong).',
      en: 'Like a small waw (و) ABOVE the letter. Produces the "u" vowel (lips pursed).',
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
    name: 'Alif',
    letter: 'ا',
    pair: 'ـَا',
    word: 'قَالَ',
    latin: 'Qaala',
    meaning: { id: '(ia) berkata', en: '(he) said' },
    vowel: 'Fathah',
    desc: {
      id: 'Huruf Alif (ا) memanjangkan bunyi Fathah. Dari "a" menjadi "aa" selama ~2 ketukan.',
      en: 'The letter Alif (ا) lengthens the Fathah: from "a" into "aa" for about 2 beats.',
    },
  },
  {
    id: 'waw',
    name: 'Waw',
    letter: 'و',
    pair: 'ـُو',
    word: 'يَقُولُ',
    latin: 'Yaquulu',
    meaning: { id: '(ia) berkata', en: '(he) says' },
    vowel: 'Dhomah',
    desc: {
      id: 'Huruf Waw (و) memanjangkan bunyi Dhomah. Dari "u" menjadi "uu" selama ~2 ketukan.',
      en: 'The letter Waw (و) lengthens the Dhomah: from "u" into "uu" for about 2 beats.',
    },
  },
  {
    id: 'ya',
    name: 'Ya',
    letter: 'ي',
    pair: 'ـِي',
    word: 'دِينٌ',
    latin: 'Diinun',
    meaning: { id: 'agama', en: 'religion' },
    vowel: 'Kasroh',
    desc: {
      id: 'Huruf Ya (ي) memanjangkan bunyi Kasroh. Dari "i" menjadi "ii" selama ~2 ketukan.',
      en: 'The letter Ya (ي) lengthens the Kasroh: from "i" into "ii" for about 2 beats.',
    },
  },
];

// ---------------------------------------------------------------------------
// PHASE 6 — Hamzah & alif variants.
// ---------------------------------------------------------------------------

export const HAMZAH_FORMS: HamzahForm[] = [
  {
    id: 'hamzah-a',
    name: 'Hamzah Fathah',
    form: 'أ',
    word: 'أَحَدٌ',
    latin: 'Ahadun',
    meaning: { id: 'satu', en: 'one' },
    desc: {
      id: 'Alif (ا) dengan hamzah (ء) di atasnya, dibaca dengan bunyi "a" yang jelas.',
      en: 'An Alif (ا) with a hamzah (ء) above it, pronounced with a clear "a".',
    },
  },
  {
    id: 'hamzah-i',
    name: 'Hamzah Kasroh',
    form: 'إ',
    word: 'إِنَّ',
    latin: 'Inna',
    meaning: { id: 'sesungguhnya', en: 'indeed' },
    desc: {
      id: 'Alif (ا) dengan hamzah (ء) di bawahnya, dibaca dengan bunyi "i" yang jelas.',
      en: 'An Alif (ا) with a hamzah (ء) below it, pronounced with a clear "i".',
    },
  },
  {
    id: 'maddah',
    name: 'Alif Mamdudah',
    form: 'آ',
    word: 'آمَنَ',
    latin: 'Aamana',
    meaning: { id: 'beriman', en: 'to believe' },
    desc: {
      id: 'Alif dengan tanda mad (ـٓ) di atasnya, dibaca panjang "aa" (gabungan dua hamzah).',
      en: 'An Alif with a mad mark (ـٓ) above it, pronounced as a long "aa" (two hamzahs merged).',
    },
  },
  {
    id: 'waslah',
    name: 'Alif Waslah',
    form: 'ٱ',
    word: 'بِسْمِ ٱللَّهِ',
    latin: 'bismillāh',
    meaning: { id: 'dengan nama Allah', en: 'in the name of Allah' },
    desc: {
      id: 'Alif yang dilewati (tidak dibaca) saat bersambung dengan kata sebelumnya, hanya dibaca pendek di awal kalimat.',
      en: 'An Alif skipped (not pronounced) when joined to the preceding word; pronounced short only at the start of an utterance.',
    },
  },
];
