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
  },
  reference: { id: 'Lafaz niat — mazhab Syafi’i', en: 'Niyyah formula — Shafi’i school' },
};

/** Practical step-by-step wudhu (fardhu steps flagged in `desc`). */
export const WUDHU: Item[] = [
  {
    id: 'w-niat',
    title: { id: 'Niat', en: 'Intention' },
    desc: {
      id: 'Berniat di hati sambil membasuh anggota pertama (fardu).',
      en: 'Form the intention in the heart while washing the first limb (obligatory).',
    },
  },
  {
    id: 'w-tangan',
    title: { id: 'Membasuh kedua telapak tangan', en: 'Wash both hands' },
    desc: { id: 'Tiga kali, hingga sela-sela jari (sunnah).', en: 'Three times, including between the fingers (sunnah).' },
  },
  {
    id: 'w-kumur',
    title: { id: 'Berkumur & menghirup air ke hidung', en: 'Rinse mouth & sniff water' },
    desc: {
      id: 'Berkumur-kumur dan beristinsyaq (menghirup) lalu mengeluarkannya, tiga kali (sunnah).',
      en: 'Rinse the mouth and sniff water into the nose, then expel it, three times (sunnah).',
    },
  },
  {
    id: 'w-muka',
    title: { id: 'Membasuh seluruh wajah', en: 'Wash the whole face' },
    desc: {
      id: 'Dari batas tumbuhnya rambut hingga bawah dagu, dan telinga ke telinga — tiga kali (fardu).',
      en: 'From the hairline to under the chin, and ear to ear — three times (obligatory).',
    },
  },
  {
    id: 'w-lengan',
    title: { id: 'Membasuh kedua tangan sampai siku', en: 'Wash both arms to the elbows' },
    desc: {
      id: 'Dimulai dari tangan kanan, hingga termasuk siku — tiga kali (fardu).',
      en: 'Starting with the right hand, including the elbows — three times (obligatory).',
    },
  },
  {
    id: 'w-kepala',
    title: { id: 'Mengusap sebagian kepala & telinga', en: 'Wipe part of the head & ears' },
    desc: {
      id: 'Mengusap sebagian kepala dengan air basah, lalu kedua telinga bagian luar & dalam (fardu untuk kepala).',
      en: 'Wipe part of the head with wet hands, then the outer and inner ears (obligatory for the head).',
    },
  },
  {
    id: 'w-kaki',
    title: { id: 'Membasuh kedua kaki sampai mata kaki', en: 'Wash both feet to the ankles' },
    desc: {
      id: 'Termasuk sela-sela jari kaki, dimulai dari kaki kanan — tiga kali (fardu).',
      en: 'Including between the toes, starting with the right foot — three times (obligatory).',
    },
  },
  {
    id: 'w-doa',
    title: { id: 'Membaca doa setelah wudhu', en: 'Read the post-wudhu supplication' },
    desc: {
      id: 'Sambil menghadap kiblat, mengangkat tangan, lalu membaca doa di bawah (sunnah).',
      en: 'Facing the qibla, raise the hands, then read the supplication below (sunnah).',
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
  },
  reference: { id: 'HR. Muslim', en: 'Muslim' },
};

/** Hal-hal yang membatalkan wudhu. */
export const WUDHU_BREAKERS: Item[] = [
  {
    id: 'b-keluar',
    title: { id: 'Keluarnya sesuatu dari qubul atau dubur', en: 'Anything exiting the front or rear passage' },
    desc: {
      id: 'Seperti air kencing, tinja, kentut, mani, madzi, atau darah yang memancar.',
      en: 'Such as urine, stool, wind, semen, pre-seminal fluid, or flowing blood.',
    },
  },
  {
    id: 'b-akal',
    title: { id: 'Hilang akal', en: 'Loss of consciousness' },
    desc: {
      id: 'Tidur nyenyak, pingsan, mabuk, atau gila — kecuali tidur ringan saat duduk/berpegangan.',
      en: 'Deep sleep, fainting, intoxication, or madness — except light sleep while seated/braced.',
    },
  },
  {
    id: 'b-sentuh',
    title: { id: 'Sentuhan kulit lawan jenis (ajnabi)', en: 'Skin contact with a non-mahram' },
    desc: {
      id: 'Mazhab Syafi’i & Hanbali: bersentuhan kulit lelaki-perempuan ajnabi tanpa penghalang membatalkan. Hanafi: jika disertai syahwat. Maliki: tidak membatalkan.',
      en: 'Shafi’i & Hanbali: direct skin contact with a non-mahram of the opposite sex nullifies it. Hanafi: only with desire. Maliki: does not nullify.',
    },
  },
  {
    id: 'b-kemaluan',
    title: { id: 'Menyentuh kemaluan dengan telapak tangan', en: 'Touching the private parts with the palm' },
    desc: {
      id: 'Syafi’i & Hanbali: membatalkan. Hanafi & Maliki: tidak membatalkan.',
      en: 'Shafi’i & Hanbali: nullifies. Hanafi & Maliki: does not nullify.',
    },
  },
];

/** Tayamum — when water is unavailable or its use is harmful. */
export const TAYAMUM: Item[] = [
  {
    id: 't-niat',
    title: { id: 'Niat & menepuk debu', en: 'Intention & striking dust' },
    desc: {
      id: 'Niat bertayamum di hati, lalu menepukkan kedua telapak tangan ke debu/tanah suci satu kali.',
      en: 'Intend tayammum in the heart, then strike both palms on pure dust/soil once.',
    },
  },
  {
    id: 't-wajah',
    title: { id: 'Mengusap wajah', en: 'Wipe the face' },
    desc: {
      id: 'Usapkan debu ke seluruh wajah dengan kedua telapak tangan.',
      en: 'Wipe the dust over the entire face with both palms.',
    },
  },
  {
    id: 't-tangan',
    title: { id: 'Mengusap kedua tangan', en: 'Wipe both arms' },
    desc: {
      id: 'Usapkan tangan kanan ke tangan kiri hingga pergelangan (Syafi’i) atau siku (Hanafi & lainnya).',
      en: 'Wipe the right hand over the left up to the wrist (Shafi’i) or elbow (Hanafi & others).',
    },
  },
  {
    id: 't-tertib',
    title: { id: 'Tertib (berurutan)', en: 'Sequence (tartib)' },
    desc: {
      id: 'Lakukan secara berurutan tanpa jeda lama, dan pastikan debu benar-benar bersih/suci.',
      en: 'Perform in order without long gaps, ensuring the dust is truly pure.',
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
  },
  reference: { id: 'Lafaz niat — mazhab Syafi’i', en: 'Niyyah formula — Shafi’i school' },
};

// ============================================================================
// Mandi Wajib (Ghusl) — to remove major ritual impurity (hadas besar).
// ============================================================================

/** Niats for the obligatory bath, by cause. Shafi’i verbalised convention. */
export const GHUSL_NIATS: Item[] = [
  {
    id: 'g-niat-junub',
    title: { id: 'Niat Mandi Junabah', en: 'Intention — Janabah' },
    arabic: 'نَوَيْتُ الْغُسْلَ لِرَفْعِ الْحَدَثِ الْأَكْبَرِ مِنَ الْجَنَابَةِ فَرْضًا لِلَّهِ تَعَالَى',
    latin: 'Nawaitul ghusla li-raf’il hadatsil akbari minal janaabati fardhan lillaahi ta’aalaa',
    meaning: {
      id: 'Aku berniat mandi untuk menghilangkan hadas besar dari janabah, fardu karena Allah Ta’ala.',
      en: 'I intend the obligatory bath to remove major ritual impurity of janabah, for Allah the Exalted.',
    },
    reference: { id: 'Lafaz niat — mazhab Syafi’i', en: 'Niyyah formula — Shafi’i school' },
  },
  {
    id: 'g-niat-haid',
    title: { id: 'Niat Mandi Haid', en: 'Intention — Menstruation' },
    arabic: 'نَوَيْتُ الْغُسْلَ لِرَفْعِ الْحَدَثِ الْأَكْبَرِ مِنَ الْحَيْضِ فَرْضًا لِلَّهِ تَعَالَى',
    latin: 'Nawaitul ghusla li-raf’il hadatsil akbari minal haidhi fardhan lillaahi ta’aalaa',
    meaning: {
      id: 'Aku berniat mandi untuk menghilangkan hadas besar dari haid, fardu karena Allah Ta’ala.',
      en: 'I intend the obligatory bath to remove major impurity of menstruation, for Allah the Exalted.',
    },
    reference: { id: 'Lafaz niat — mazhab Syafi’i', en: 'Niyyah formula — Shafi’i school' },
  },
  {
    id: 'g-niat-nifas',
    title: { id: 'Niat Mandi Nifas', en: 'Intention — Postnatal Bleeding' },
    arabic: 'نَوَيْتُ الْغُسْلَ لِرَفْعِ الْحَدَثِ الْأَكْبَرِ مِنَ النِّفَاسِ فَرْضًا لِلَّهِ تَعَالَى',
    latin: 'Nawaitul ghusla li-raf’il hadatsil akbari minal nifaasi fardhan lillaahi ta’aalaa',
    meaning: {
      id: 'Aku berniat mandi untuk menghilangkan hadas besar dari nifas, fardu karena Allah Ta’ala.',
      en: 'I intend the obligatory bath to remove major impurity of postnatal bleeding, for Allah the Exalted.',
    },
    reference: { id: 'Lafaz niat — mazhab Syafi’i', en: 'Niyyah formula — Shafi’i school' },
  },
];

/** Urutan mandi wajib (fardhu ditandai dalam desc). */
export const GHUSL_STEPS: Item[] = [
  {
    id: 'g-niat',
    title: { id: 'Niat', en: 'Intention' },
    desc: {
      id: 'Berniat di hati (fardu) bersamaan dengan air pertama mengalir ke tubuh.',
      en: 'Form the intention in the heart (obligatory) as the first water touches the body.',
    },
  },
  {
    id: 'g-bersih',
    title: { id: 'Membersihkan najis', en: 'Remove impurity' },
    desc: {
      id: 'Membasuh tangan lalu membersihkan kotoran/najis pada tubuh.',
      en: 'Wash the hands, then remove any impurity from the body.',
    },
  },
  {
    id: 'g-wudhu',
    title: { id: 'Berwudhu', en: 'Perform wudhu' },
    desc: {
      id: 'Berwudhu seperti wudhu untuk shalat (sunnah).',
      en: 'Perform wudhu as for prayer (sunnah).',
    },
  },
  {
    id: 'g-kepala',
    title: { id: 'Membasuh kepala & telinga', en: 'Wash the head & ears' },
    desc: {
      id: 'Mengguyur/membasuh seluruh kepala beserta kedua telinga sebanyak tiga kali.',
      en: 'Pour water over the entire head and both ears, three times.',
    },
  },
  {
    id: 'g-tubuh',
    title: { id: 'Mengalirkan air ke seluruh tubuh', en: 'Pour water over the whole body' },
    desc: {
      id: 'Mengalirkan air ke seluruh tubuh tanpa tertinggal, mulai sisi kanan lalu kiri (fardu), tiga kali, menyela-nyela rambut dan menggosok.',
      en: 'Let water flow over the entire body without exception, right side first then left (obligatory), three times, parting the hair and rubbing.',
    },
  },
];

/** Sunnah-sunnah wudhu (dianjurkan, bukan fardu). */
export const SUNNAH_WUDHU: Item[] = [
  { id: 'sw-siwak', title: { id: 'Bersiwak', en: 'Using the siwak' }, desc: { id: 'Membersihkan gigi dengan siwak.', en: 'Cleaning the teeth with a siwak.' } },
  { id: 'sw-tangan', title: { id: 'Membasuh telapak tangan 3×', en: 'Wash the palms 3×' }, desc: { id: 'Sebelum memulai anggota wudhu.', en: 'Before starting the wudhu limbs.' } },
  { id: 'sw-kumur', title: { id: 'Berkumur & menghirup air 3×', en: 'Rinse mouth & sniff 3×' }, desc: { id: 'Madhmadhah (berkumur) dan istinsyaq (menghirup) lalu mengeluarkannya.', en: 'Rinsing the mouth and sniffing water into the nose, then expelling it.' } },
  { id: 'sw-kepala', title: { id: 'Mengusap seluruh kepala', en: 'Wipe the whole head' }, desc: { id: 'Mengusap seluruh kepala satu kali.', en: 'Wiping the entire head once.' } },
  { id: 'sw-telinga', title: { id: 'Mengusap kedua telinga', en: 'Wipe both ears' }, desc: { id: 'Bagian luar dengan ibu jari dan dalam dengan telunjuk.', en: 'Outer parts with the thumbs, inner with the index fingers.' } },
  { id: 'sw-kanan', title: { id: 'Mendahulukan yang kanan', en: 'Begin with the right' }, desc: { id: 'Anggota kanan didahulukan dari yang kiri.', en: 'The right side precedes the left.' } },
  { id: 'sw-sela', title: { id: 'Menyela jari & jenggot', en: 'Pass through fingers & beard' }, desc: { id: 'Menyela-nyela jari tangan & kaki dan menyela jenggot.', en: 'Passing fingers through the toes/fingers and combing the beard.' } },
  { id: 'sw-tertib', title: { id: 'Tertib (berurutan)', en: 'Sequence (tartib)' }, desc: { id: 'Mengerjakan secara berurutan.', en: 'Performing the acts in order.' } },
];

/** Hal-hal yang membatalkan shalat. */
export const PEMBATANG_SHALAT: Item[] = [
  { id: 'ps-hadas', title: { id: 'Berhadats', en: 'Ritual impurity' }, desc: { id: 'Keluar hadats kecil atau besar.', en: 'Minor or major ritual impurity occurs.' } },
  { id: 'ps-bicara', title: { id: 'Berbicara dengan sengaja', en: 'Intentional speech' }, desc: { id: 'Berbicara yang bukan bagian shalat dan bukan karena lupa.', en: 'Speech unrelated to the prayer, not from forgetfulness.' } },
  { id: 'ps-makan', title: { id: 'Makan atau minum', en: 'Eating or drinking' }, desc: { id: 'Makan/minum dengan sengaja di tengah shalat.', en: 'Deliberately eating or drinking during prayer.' } },
  { id: 'ps-gerakan', title: { id: 'Gerakan berlebihan', en: 'Excessive movement' }, desc: { id: 'Gerakan banyak yang bukan gerakan shalat (“amal katsir”).', en: 'Much movement unrelated to the prayer.' } },
  { id: 'ps-kiblat', title: { id: 'Berpaling dari kiblat', en: 'Turning from the qibla' }, desc: { id: 'Dada berpaling dari arah kiblat.', en: 'The chest turns away from the qibla.' } },
  { id: 'ps-tertawa', title: { id: 'Tertawa keras', en: 'Loud laughter' }, desc: { id: 'Tertawa yang terdengar (berbeda antar mazhab).', en: 'Audible laughter (differs across schools).' } },
  { id: 'ps-rukun', title: { id: 'Meninggalkan rukun/syarat', en: 'Omitting a pillar/condition' }, desc: { id: 'Meninggalkan salah satu rukun atau syarat shalat.', en: 'Leaving out a pillar or condition of prayer.' } },
];
