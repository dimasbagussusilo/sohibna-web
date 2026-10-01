import type { ArabicItem, Bi, DzikirItem } from './types';

// ============================================================================
// Dzikir & Doa — post-prayer wirid, morning/evening adhkar, and daily duas.
// Authoritative Arabic/transliteration is the user's to verify against a trusted
// source (these are commonly-taught formulations). Shared adhkar are defined
// once and tagged per category to avoid duplication errors.
// ============================================================================

/** A titled Arabic item (shared adhkar reused across morning/evening). */
type Adhkar = ArabicItem & { title: Bi };

// --- Shared adhkar (morning & evening recite the same) ----------------------
const AYAT_KURSI: Adhkar = {
  title: { id: 'Ayat Kursi', en: 'Ayat al-Kursi', ar: 'آية الكرسي' },
  arabic:
    'اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ، لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ، لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ، مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ، يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ، وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ، وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ، وَلَا يَئُودُهُ حِفْظُهُمَا، وَهُوَ الْعَلِيُّ الْعَظِيمُ',
  latin: 'Allaahu laa ilaaha illaa huwal hayyul qayyuum… (Ayat Kursi — QS 2:255)',
  meaning: {
    id: 'Ayat Kursi (QS Al-Baqarah:255) — siapa membacanya terjaga dari gangguan hingga waktu berikutnya.',
    en: 'Ayat Kursi (QS Al-Baqarah:255) — its reciter is kept from harm until the next period.',
    ar: 'آية الكرسي (البقرة: 255) — من قرأها عُصِم من الأذى حتى الوقت التالي.',
  },
  reference: { id: 'QS Al-Baqarah:255', en: 'Quran Al-Baqarah:255', ar: 'سورة البقرة: 255' },
};

const THREE_QUL: Adhkar = {
  title: { id: 'Tiga Qul', en: 'Three Quls', ar: 'المعوّذات' },
  arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ … قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ … قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
  latin: 'Qul huwallaahu ahad … Qul a’uudzu birabbil falaq … Qul a’uudzu birabbin naas',
  meaning: {
    id: 'Tiga surah penutup: Al-Ikhlas, Al-Falaq, An-Nas (teks lengkap di fitur Quran). Dibaca 3×.',
    en: 'The three closing surahs: Al-Ikhlas, Al-Falaq, An-Nas (full text in the Quran feature). 3×.',
    ar: 'السور الثلاث الخاتمة: الإخلاص والفلق والناس (النص الكامل في قسم القرآن). تُقرأ 3×.',
  },
  reference: {
    id: 'Surah Al-Ikhlas (112), Al-Falaq (113), An-Nas (114) · HR. Abu Dawud & At-Tirmidzi',
    en: 'Al-Ikhlas (112), Al-Falaq (113), An-Nas (114) · Abu Dawud & At-Tirmidhi',
    ar: 'سورة الإخلاص (112) والفلق (113) والناس (114) · رواه أبو داود والترمذي',
  },
};

const SAYYIDUL_ISTIGHFAR: Adhkar = {
  title: { id: 'Sayyidul Istighfar', en: 'Sayyid al-Istighfar', ar: 'سيّد الاستغفار' },
  arabic:
    'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
  latin:
    'Allaahumma anta rabbii laa ilaaha illaa anta, khalaqtanii wa ana ‘abduka, wa ana ‘alaa ‘ahdika wa wa’dika masta-tha’tu, a’uudzu bika min syarri maa shana’tu, abuu-u laka bi ni’matika ‘alayya, wa abuu-u bi dzambii faghfir lii fa innahu laa yaghfirudz dzunuuba illaa anta',
  meaning: {
    id: 'Penghulu istighfar — siapa membacanya dengan yakin lalu wafat hari itu, ia penghuni surga.',
    en: 'The foremost supplication for forgiveness — said with conviction, its reciter enters Paradise if they die that day/night.',
    ar: 'أفضل صيغ الاستغفار — من قالها موقنًا ثم مات في يومه أو ليلته دخل الجنة.',
  },
  reference: { id: 'HR. Bukhari', en: 'Bukhari', ar: 'رواه البخاري' },
};

const SUBHANALLAH_100: Adhkar = {
  title: { id: 'Subhaanallah 100×', en: 'Subhanallah 100×', ar: 'سبحان الله 100×' },
  arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
  latin: 'Subhaanallaahi wa bihamdih (100×)',
  meaning: {
    id: 'Maha Suci Allah dan segala puji bagi-Nya (100×) — dihapus dosa-dosa kecil.',
    en: 'Glory be to Allah and praise Him (100×) — minor sins are forgiven.',
    ar: 'سبحان الله وبحمده (100×) — تُغفر الخطايا الصغائر.',
  },
  reference: { id: 'HR. Bukhari & Muslim', en: 'Bukhari & Muslim', ar: 'متفق عليه' },
};

const PROTECTION_3X: Adhkar = {
  title: { id: 'Doa Perlindungan', en: 'Protection', ar: 'دعاء الحماية' },
  arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
  latin: 'Bismillaahilladzii laa yadhurru ma’asmihi syai-un fil ardhri wa laa fis samaa-i wa huwas samii’ul ‘aliim (3×)',
  meaning: {
    id: 'Dengan nama Allah yang dengan nama-Nya tidak ada sesuatu pun yang membahayakan, di bumi maupun di langit; Dialah Yang Maha Mendengar lagi Maha Mengetahui (3×).',
    en: 'In the name of Allah, with Whose name nothing on earth or in heaven can cause harm; He is the All-Hearing, the All-Knowing (3×).',
    ar: 'بسم الله الذي لا يضرّ مع اسمه شيء في الأرض ولا في السماء وهو السميع العليم (3×).',
  },
  reference: { id: 'HR. Abu Dawud & At-Tirmidzi', en: 'Abu Dawud & At-Tirmidhi', ar: 'رواه أبو داود والترمذي' },
};

const DOA_PAGI: Adhkar = {
  title: { id: 'Doa Pagi', en: 'Morning Supplication', ar: 'دعاء الصباح' },
  arabic:
    'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
  latin:
    'Ashbahnaa wa ashbahal mulku lillaah, wal hamdu lillaah, laa ilaaha illallaahu wahdahu laa syariika lah, lahul mulku wa lahul hamdu wa huwa ‘alaa kulli syai-in qadiir',
  meaning: {
    id: 'Kami memasuki waktu pagi dan kerajaan hanya milik Allah… (doa pagi).',
    en: 'We have entered the morning and dominion belongs to Allah alone… (morning supplication).',
    ar: 'أصبحنا وأصبح الملك لله وحده لا شريك له… (دعاء الصباح).',
  },
  reference: { id: 'HR. Muslim', en: 'Muslim', ar: 'رواه مسلم' },
};

const DOA_PETANG: Adhkar = {
  title: { id: 'Doa Petang', en: 'Evening Supplication', ar: 'دعاء المساء' },
  arabic:
    'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
  latin:
    'Amsainaa wa amsal mulku lillaah, wal hamdu lillaah, laa ilaaha illallaahu wahdahu laa syariika lah, lahul mulku wa lahul hamdu wa huwa ‘alaa kulli syai-in qadiir',
  meaning: {
    id: 'Kami memasuki waktu sore dan kerajaan hanya milik Allah… (doa petang).',
    en: 'We have reached the evening and dominion belongs to Allah alone… (evening supplication).',
    ar: 'أمسينا وأمسى الملك لله وحده لا شريك له… (دعاء المساء).',
  },
  reference: { id: 'HR. Muslim', en: 'Muslim', ar: 'رواه مسلم' },
};

/** Tag a shared adhkar as a DzikirItem in a category. */
const item = (category: DzikirItem['category'], id: string, a: Adhkar): DzikirItem => ({
  id,
  category,
  ...a,
});

const C3 = { id: '3×', en: '3×', ar: '3×' };
const C100 = { id: '100×', en: '100×', ar: '100×' };
const C1 = { id: '1×', en: '1×', ar: '1×' };

export const DZIKIR_ITEMS: DzikirItem[] = [
  // --- Setelah shalat --------------------------------------------------------
  {
    id: 'ap-istighfar',
    category: 'afterPrayer',
    title: { id: 'Astaghfirullaah', en: 'Astaghfirullaah', ar: 'أستغفر الله' },
    count: C3,
    arabic: 'أَسْتَغْفِرُ اللَّهَ',
    latin: 'Astaghfirullaah (3×)',
    meaning: { id: 'Aku memohon ampun kepada Allah.', en: 'I seek forgiveness from Allah.', ar: 'أسأل الله المغفرة.' },
    reference: { id: 'HR. Muslim', en: 'Muslim', ar: 'رواه مسلم' },
  },
  {
    id: 'ap-tasbih',
    category: 'afterPrayer',
    title: { id: 'Subhaanallaah', en: 'Subhaanallaah', ar: 'سبحان الله' },
    count: { id: '33×', en: '33×', ar: '33×' },
    arabic: 'سُبْحَانَ اللَّهِ',
    latin: 'Subhaanallaah (33×)',
    meaning: { id: 'Maha Suci Allah.', en: 'Glory be to Allah.', ar: 'سبحان الله.' },
    reference: { id: 'HR. Bukhari & Muslim', en: 'Bukhari & Muslim', ar: 'متفق عليه' },
  },
  {
    id: 'ap-tahmid',
    category: 'afterPrayer',
    title: { id: 'Alhamdulillaah', en: 'Alhamdulillaah', ar: 'الحمد لله' },
    count: { id: '33×', en: '33×', ar: '33×' },
    arabic: 'الْحَمْدُ لِلَّهِ',
    latin: 'Alhamdulillaah (33×)',
    meaning: { id: 'Segala puji bagi Allah.', en: 'All praise is for Allah.', ar: 'الحمد لله.' },
    reference: { id: 'HR. Bukhari & Muslim', en: 'Bukhari & Muslim', ar: 'متفق عليه' },
  },
  {
    id: 'ap-takbir',
    category: 'afterPrayer',
    title: { id: 'Allaahu akbar', en: 'Allaahu akbar', ar: 'الله أكبر' },
    count: { id: '34×', en: '34×', ar: '34×' },
    arabic: 'اللَّهُ أَكْبَرُ',
    latin: 'Allaahu akbar (34×)',
    meaning: { id: 'Allah Maha Besar.', en: 'Allah is the Greatest.', ar: 'الله أكبر.' },
    reference: { id: 'HR. Bukhari & Muslim', en: 'Bukhari & Muslim', ar: 'متفق عليه' },
  },
  {
    id: 'ap-post-doa',
    category: 'afterPrayer',
    title: { id: 'Doa Setelah Shalat', en: 'Post-Prayer Supplication', ar: 'دعاء بعد الصلاة' },
    arabic: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ',
    latin: 'Allaahumma a’innii ‘alaa dzikrika wa syukrika wa husni ‘ibaadatik',
    meaning: {
      id: 'Ya Allah, tolonglah aku untuk mengingat-Mu, bersyukur kepada-Mu, dan beribadah dengan sebaik-baiknya.',
      en: 'O Allah, help me to remember You, thank You, and worship You in the best manner.',
      ar: 'اللهم أعنّي على ذكرك وشكرك وحسن عبادتك.',
    },
    reference: { id: 'HR. Muslim', en: 'Muslim', ar: 'رواه مسلم' },
  },

  // --- Dzikir Pagi -----------------------------------------------------------
  { ...item('morning', 'm-ayat-kursi', AYAT_KURSI), count: C1 },
  { ...item('morning', 'm-three-qul', THREE_QUL), count: C3 },
  { ...item('morning', 'm-sayyidul', SAYYIDUL_ISTIGHFAR), count: C1 },
  item('morning', 'm-doa-pagi', DOA_PAGI),
  { ...item('morning', 'm-subhan-100', SUBHANALLAH_100), count: C100 },
  { ...item('morning', 'm-protection', PROTECTION_3X), count: C3 },

  // --- Dzikir Petang ---------------------------------------------------------
  { ...item('evening', 'e-ayat-kursi', AYAT_KURSI), count: C1 },
  { ...item('evening', 'e-three-qul', THREE_QUL), count: C3 },
  { ...item('evening', 'e-sayyidul', SAYYIDUL_ISTIGHFAR), count: C1 },
  item('evening', 'e-doa-petang', DOA_PETANG),
  { ...item('evening', 'e-subhan-100', SUBHANALLAH_100), count: C100 },
  { ...item('evening', 'e-protection', PROTECTION_3X), count: C3 },

  // --- Doa Harian ------------------------------------------------------------
  {
    id: 'd-eat-before',
    category: 'daily',
    title: { id: 'Sebelum Makan', en: 'Before Eating', ar: 'قبل الطعام' },
    arabic: 'بِسْمِ اللَّهِ',
    latin: 'Bismillaah',
    meaning: { id: 'Dengan menyebut nama Allah.', en: 'In the name of Allah.', ar: 'بسم الله.' },
    reference: { id: 'HR. Abu Dawud & At-Tirmidzi', en: 'Abu Dawud & At-Tirmidhi', ar: 'رواه أبو داود والترمذي' },
  },
  {
    id: 'd-eat-after',
    category: 'daily',
    title: { id: 'Sesudah Makan', en: 'After Eating', ar: 'بعد الطعام' },
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ',
    latin: 'Alhamdulillaahilladzii ath’amanii wa saqaanii wa ja’alanii muslimaa',
    meaning: {
      id: 'Segala puji bagi Allah yang memberi kami makan dan minum serta menjadikan kami muslim.',
      en: 'Praise be to Allah Who has fed us, given us drink, and made us Muslims.',
      ar: 'الحمد لله الذي أطعمنا وسقانا وجعلنا مسلمين.',
    },
    reference: { id: 'HR. Abu Dawud & At-Tirmidzi', en: 'Abu Dawud & At-Tirmidhi', ar: 'رواه أبو داود والترمذي' },
  },
  {
    id: 'd-masjid-in',
    category: 'daily',
    title: { id: 'Masuk Masjid', en: 'Entering the Mosque', ar: 'دخول المسجد' },
    arabic: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
    latin: 'Allaahummaftah lii abwaaba rahmatik',
    meaning: { id: 'Ya Allah, bukakanlah untukku pintu-pintu rahmat-Mu.', en: 'O Allah, open for me the gates of Your mercy.', ar: 'اللهم افتح لي أبواب رحمتك.' },
    reference: { id: 'HR. Muslim', en: 'Muslim', ar: 'رواه مسلم' },
  },
  {
    id: 'd-masjid-out',
    category: 'daily',
    title: { id: 'Keluar Masjid', en: 'Leaving the Mosque', ar: 'الخروج من المسجد' },
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ',
    latin: 'Allaahumma innii as’aluka min fadhlik',
    meaning: { id: 'Ya Allah, aku memohon kepada-Mu sebagian karunia-Mu.', en: 'O Allah, I ask You of Your bounty.', ar: 'اللهم إني أسألك من فضلك.' },
    reference: { id: 'HR. Muslim', en: 'Muslim', ar: 'رواه مسلم' },
  },
  {
    id: 'd-home-in',
    category: 'daily',
    title: { id: 'Masuk Rumah', en: 'Entering the Home', ar: 'دخول المنزل' },
    arabic: 'بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى رَبِّنَا تَوَكَّلْنَا',
    latin: 'Bismillaahi walajnaa, wa bismillaahi kharajnaa, wa ‘alaa rabbinaa tawakkalnaa',
    meaning: { id: 'Dengan nama Allah kami masuk, dengan nama Allah kami keluar, dan kepada Tuhan kami bertawakal.', en: 'In the name of Allah we enter, in His name we leave, and on our Lord we rely.', ar: 'بسم الله ولجنا، وبسم الله خرجنا، وعلى ربنا توكلنا.' },
    reference: { id: 'HR. Abu Dawud', en: 'Abu Dawud', ar: 'رواه أبو داود' },
  },
  {
    id: 'd-home-out',
    category: 'daily',
    title: { id: 'Keluar Rumah', en: 'Leaving the Home', ar: 'الخروج من المنزل' },
    arabic: 'بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    latin: 'Bismillaah, tawakkaltu ‘alallaah, wa laa hawla wa laa quwwata illaa billaah',
    meaning: { id: 'Dengan nama Allah, aku bertawakal kepada Allah; tidak ada daya dan kekuatan kecuali dengan Allah.', en: 'In the name of Allah, I place my trust in Allah; there is no power or strength save in Allah.', ar: 'بسم الله، توكلت على الله، ولا حول ولا قوة إلا بالله.' },
    reference: { id: 'HR. Abu Dawud & At-Tirmidzi', en: 'Abu Dawud & At-Tirmidhi', ar: 'رواه أبو داود والترمذي' },
  },
  {
    id: 'd-sleep',
    category: 'daily',
    title: { id: 'Sebelum Tidur', en: 'Before Sleeping', ar: 'قبل النوم' },
    arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    latin: 'Bi’ismika Allaahumma amuutu wa ah-yaa',
    meaning: { id: 'Dengan nama-Mu ya Allah, aku mati dan aku hidup. (Dibaca juga Ayat Kursi & 3 Qul.)', en: 'In Your name, O Allah, I die and I live. (Also recite Ayat Kursi & the 3 Quls.)', ar: 'باسمك اللهم أموت وأحيا. (تُقرأ أيضًا آية الكرسي والمعوّذات.)' },
    reference: { id: 'HR. Bukhari', en: 'Bukhari', ar: 'رواه البخاري' },
  },
  {
    id: 'd-wake',
    category: 'daily',
    title: { id: 'Bangun Tidur', en: 'Waking Up', ar: 'الاستيقاظ من النوم' },
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    latin: 'Alhamdulillaahilladzii ah-yaa-naa ba’da maa amaatanaa wa ilaihin nusyuur',
    meaning: { id: 'Segala puji bagi Allah yang menghidupkan kami setelah mematikan kami, dan kepada-Nya kami dikembalikan.', en: 'Praise be to Allah Who gives us life after death, and to Him is the resurrection.', ar: 'الحمد لله الذي أحيانا بعد ما أماتنا وإليه النشور.' },
    reference: { id: 'HR. Bukhari', en: 'Bukhari', ar: 'رواه البخاري' },
  },
  {
    id: 'd-toilet-in',
    category: 'daily',
    title: { id: 'Masuk Kamar Mandi', en: 'Entering the Toilet', ar: 'دخول الخلاء' },
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ',
    latin: 'Allaahumma innii a’uudzu bika minal khubutsi wal khabaa-its',
    meaning: { id: 'Ya Allah, aku berlindung kepada-Mu dari godaan setan laki-laki dan perempuan.', en: 'O Allah, I seek refuge in You from male and female devils.', ar: 'اللهم إني أعوذ بك من الخبث والخبائث.' },
    reference: { id: 'HR. Bukhari & Muslim', en: 'Bukhari & Muslim', ar: 'متفق عليه' },
  },
  {
    id: 'd-toilet-out',
    category: 'daily',
    title: { id: 'Keluar Kamar Mandi', en: 'Leaving the Toilet', ar: 'الخروج من الخلاء' },
    arabic: 'غُفْرَانَكَ',
    latin: 'Ghufraanak',
    meaning: { id: 'Aku memohon ampunan-Mu.', en: 'I seek Your forgiveness.', ar: 'أسألك المغفرة.' },
    reference: { id: 'HR. Abu Dawud & At-Tirmidzi', en: 'Abu Dawud & At-Tirmidhi', ar: 'رواه أبو داود والترمذي' },
  },
  {
    id: 'd-clothing',
    category: 'daily',
    title: { id: 'Memakai Pakaian Baru', en: 'Wearing New Clothes', ar: 'لبس ثوب جديد' },
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي كَسَانِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ',
    latin: 'Alhamdulillaahilladzii kasaanii haadzaa wa razaqaniih min ghoiri hawlin minnii wa laa quwwah',
    meaning: { id: 'Segala puji bagi Allah yang memberiku pakaian ini dan rezeki ini tanpa daya dan kekuatan dariku.', en: 'Praise be to Allah Who clothed me in this and provided it without any power or strength of mine.', ar: 'الحمد لله الذي كساني هذا ورزقنيه من غير حول مني ولا قوة.' },
    reference: { id: 'HR. Abu Dawud & At-Tirmidzi', en: 'Abu Dawud & At-Tirmidhi', ar: 'رواه أبو داود والترمذي' },
  },
  {
    id: 'd-mirror',
    category: 'daily',
    title: { id: 'Bercermin', en: 'Looking in the Mirror', ar: 'النظر في المرآة' },
    arabic: 'اللَّهُمَّ كَمَا حَسَّنْتَ خَلْقِي فَحَسِّنْ خُلُقِي',
    latin: 'Allaahumma kamaa hassanta khalqii fahassin khuluqii',
    meaning: { id: 'Ya Allah, sebagaimana Engkau memperindah ciptaanku, perindahlah pula akhlakku.', en: 'O Allah, just as You made my form beautiful, make my character beautiful too.', ar: 'اللهم كما حسّنت خَلْقي فحسِّن خُلُقي.' },
    reference: { id: 'HR. Ahmad (sanad dibahas ulama)', en: 'Ahmad (chain debated by scholars)', ar: 'رواه أحمد (اختُلف في صحّة سنده)' },
  },
  {
    id: 'd-travel',
    category: 'daily',
    title: { id: 'Naik Kendaraan', en: 'Boarding a Vehicle', ar: 'ركوب المركبة' },
    arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ',
    latin: 'Subhaanalladzii sakhkhara lanaa haadzaa wa maa kunnaa lahu muqriniin, wa innaa ilaa rabbinaa lamunqalibuun',
    meaning: { id: 'Maha Suci Zat yang menundukkan kendaraan ini bagi kami, padahal kami tidak mampu menguasainya; dan kepada Tuhan kamikah kami kembali.', en: 'Glory to Him Who subjected this to us, though we could never have accomplished it; and to our Lord we shall surely return.', ar: 'سبحان الذي سخّر لنا هذا وما كنا له مقرنين، وإنا إلى ربنا لمنقلبون.' },
    reference: { id: 'QS Az-Zukhruf:13-14 · HR. Abu Dawud & At-Tirmidzi', en: 'Quran Az-Zukhruf:13-14 · Abu Dawud & At-Tirmidhi', ar: 'سورة الزخرف: 13–14 · رواه أبو داود والترمذي' },
  },
  {
    id: 'd-anger',
    category: 'daily',
    title: { id: 'Saat Marah', en: 'When Angry', ar: 'عند الغضب' },
    arabic: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ',
    latin: 'A’uudzu billaahi minasy syaithaanir rajiim',
    meaning: { id: 'Aku berlindung kepada Allah dari godaan setan yang terkutuk.', en: 'I seek refuge in Allah from the accursed Satan.', ar: 'أعوذ بالله من الشيطان الرجيم.' },
    reference: { id: 'HR. Bukhari & Muslim', en: 'Bukhari & Muslim', ar: 'متفق عليه' },
  },
  {
    id: 'd-anxiety',
    category: 'daily',
    title: { id: 'Saat Cemas & Sedih', en: 'When Anxious & Sad', ar: 'عند القلق والحزن' },
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ',
    latin: 'Allaahumma innii a’uudzu bika minal hammi wal hazan, wal ‘ajzi wal kasal, wal bukhli wal jubn, wa dhala’id dain wa ghalabatir rijaal',
    meaning: { id: 'Ya Allah, aku berlindung kepada-Mu dari kegelisahan dan kesedihan, kelemahan dan kemalasan, kekikiran dan sifat penakut, belitnya hutang dan tekanan orang.', en: 'O Allah, I seek refuge in You from worry and grief, weakness and laziness, miserliness and cowardice, the burden of debt and the oppression of men.', ar: 'اللهم إني أعوذ بك من الهمّ والحزن، والعجز والكسل، والبخل والجبن، وضلع الدَّين وغلبة الرجال.' },
    reference: { id: 'HR. Al-Bukhari (Al-Adabul Mufrad)', en: 'Al-Bukhari (Al-Adab al-Mufrad)', ar: 'رواه البخاري (الأدب المفرد)' },
  },
];
