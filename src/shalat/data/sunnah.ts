import type { ArabicItem, SunnahPrayer } from '../types';
import { QUNUT_DOA } from './recitations';

// Specific duas associated with some sunnah prayers. Verify Arabic/transliteration
// against a trusted source before relying on them.

/** Doa setelah shalat Dhuha — well-attested supplication (replaces the
 *  commonly-printed long Dhuha dua, whose chain is weak). */
const DOA_DHUHA: ArabicItem = {
  arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا',
  latin: 'Allaahumma innii as’aluka ’ilman naafi’an, wa rizqan thayyiban, wa ’amalan mutaqabbalan',
  meaning: {
    id: 'Ya Allah, sesungguhnya aku memohon kepada-Mu ilmu yang bermanfaat, rezeki yang baik (halal), dan amal yang diterima.',
    en: 'O Allah, I ask You for beneficial knowledge, good (lawful) provision, and accepted deeds.',
  },
  reference: { id: 'HR. Ibnu Majah no. 925 (dari Ummu Salamah, dishahihkan Al-Albani)', en: 'Ibnu Majah no. 925 (from Umm Salamah, graded sahih by Al-Albani)' },
};

/** Doa yang dianjurkan dibaca setelah shalat Hajat. */
const DOA_HAJAT: ArabicItem = {
  arabic:
    'لَا إِلَهَ إِلَّا اللَّهُ الْحَلِيمُ الْكَرِيمُ، سُبْحَانَ اللَّهِ رَبِّ الْعَرْشِ الْعَظِيمِ، الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ، أَسْأَلُكَ مُوجِبَاتِ رَحْمَتِكَ، وَعَزَائِمَ مَغْفِرَتِكَ، وَالْغَنِيمَةَ مِنْ كُلِّ بِرٍّ، وَالسَّلَامَةَ مِنْ كُلِّ إِثْمٍ، لَا تَدَعْ لِي ذَنْبًا إِلَّا غَفَرْتَهُ، وَلَا هَمًّا إِلَّا فَرَّجْتَهُ، وَلَا حَاجَةً هِيَ لَكَ رِضًا إِلَّا قَضَيْتَهَا يَا أَرْحَمَ الرَّاحِمِينَ',
  latin:
    'Laa ilaaha illallaahul haliimul kariim, subhaanallaahi rabbil ‘arsyil ‘azhiim, alhamdu lillaahi rabbil ‘aalamiin, as’aluka muujibaati rahmatik, wa ‘azaa-ima maghfiratik, wal ghaniimata min kulli birrin, was salaamata min kulli itsmin, laa tada’ lii dzamban illaa ghafartahu, wa laa hamman illaa farrajtahu, wa laa haajatan hiya laka ridhan illaa qadhaitahaa yaa arhamar raahimiin',
  meaning: {
    id: 'Tiada Tuhan selain Allah Yang Maha Penyantun lagi Maha Mulia. Maha Suci Allah, Tuhan Arsy yang agung. Segala puji bagi Allah Tuhan semesta alam. Aku memohon kepada-Mu sebab-sebab rahmat-Mu, ketetapan ampunan-Mu, keuntungan dari setiap kebaikan, dan keselamatan dari setiap dosa. Janganlah Engkau tinggalkan padaku satu dosa pun melainkan Engkau ampuni, satu kesusahan pun melainkan Engkau hilangkan, dan satu kebutuhan yang diridhai-Mu melainkan Engkau kabulkan, wahai Yang Maha Penyayang.',
    en: 'There is no god but Allah, the Forbearing, the Generous. Glory to Allah, Lord of the Magnificent Throne. Praise be to Allah, Lord of the worlds. I ask You for that which brings Your mercy, the warrants of Your forgiveness, the gain of every good, and safety from every sin. Leave me with no sin unforgiven, no worry unrelieved, and no need (pleasing to You) unmet, O Most Merciful.',
  },
  reference: { id: 'HR. At-Tirmidzi', en: 'At-Tirmidhi' },
};

// ============================================================================
// Section — Shalat Sunnah + Doa (post-prayer dzikir/wirid moved to the Dzikir feature).
// Niats follow the Shafi’i verbalised convention. Verify Arabic/transliteration
// against a trusted source before shipping.
// ============================================================================

export const SUNNAH: SunnahPrayer[] = [
  {
    id: 's-rawatib-subuh',
    page: 'rawatib',
    title: { id: 'Rawatib — Sebelum Subuh (Qabliyah Subuh)', en: 'Rawatib — Before Fajr' },
    meta: { id: '2 rakaat · sunnah muakkadah', en: '2 rakaat · strongly emphasised sunnah' },
    when: { id: 'Setelah masuk waktu Subuh, sebelum shalat fardu Subuh.', en: 'After Fajr enters, before the obligatory Fajr.' },
    niat: {
      arabic: 'أُصَلِّيْ سُنَّةَ الصُّبْحِ الْقَبْلِيَّةَ رَكْعَتَيْنِ لِلَّهِ تَعَالَى',
      latin: 'Ushollii sunnatas shubhil qabliyyata rak’ataini lillaahi ta’aalaa',
      meaning: { id: 'Aku niat shalat sunnah Qabliyah Subuh dua rakaat karena Allah Ta’ala.', en: 'I intend the sunnah prayer before Fajr of two rakaat, for Allah the Exalted.' },
      reference: { id: 'Lafaz niat — mazhab Syafi’i', en: 'Niyyah formula — Shafi’i school' },
    },
    how: [
      { id: 'rs-1', desc: { id: '2 rakaat, tiap rakaat Al-Fatihah + satu surah (dianjurkan Al-Kafirun & Al-Ikhlas). Dikerjakan sebelum iqamah Subuh.', en: '2 rakaat, each Al-Fatihah + a surah (Al-Kafirun & Al-Ikhlas recommended). Prayed before the Fajr iqama.' } },
    ],
  },
  {
    id: 's-rawatib-dzuhur',
    page: 'rawatib',
    title: { id: 'Rawatib — Sekitar Dzuhur', en: 'Rawatib — Around Dhuhr' },
    meta: { id: '4 sebelum + 2 sesudah · sunnah muakkadah', en: '4 before + 2 after · strongly emphasised sunnah' },
    when: { id: 'Empat rakaat sebelum dan dua rakaat sesudah fardu Dzuhur.', en: 'Four rakaat before and two rakaat after the obligatory Dhuhr.' },
    niat: {
      arabic: 'أُصَلِّيْ سُنَّةَ الظُّهْرِ الْقَبْلِيَّةَ أَرْبَعَ رَكَعَاتٍ لِلَّهِ تَعَالَى',
      latin: 'Ushollii sunnatas zhuhri qabliyyata arba’a raka’atin lillaahi ta’aalaa',
      meaning: { id: 'Aku niat shalat sunnah Qabliyah Dzuhur empat rakaat karena Allah Ta’ala.', en: 'I intend the sunnah prayer before Dhuhr of four rakaat, for Allah the Exalted.' },
      reference: { id: 'Lafaz niat — mazhab Syafi’i', en: 'Niyyah formula — Shafi’i school' },
    },
    how: [
      { id: 'rd-1', desc: { id: '4 rakaat (tiap 2 rakaat satu salam) sebelum fardu Dzuhur; 2 rakaat sesudahnya. Dikerjakan seperti shalat biasa.', en: '4 rakaat (salam every 2) before obligatory Dhuhr; 2 after. Performed like a standard prayer.' } },
    ],
  },
  {
    id: 's-rawatib-maghrib',
    page: 'rawatib',
    title: { id: 'Rawatib — Sesudah Maghrib', en: 'Rawatib — After Maghrib' },
    meta: { id: '2 rakaat · sunnah muakkadah', en: '2 rakaat · strongly emphasised sunnah' },
    when: { id: 'Setelah fardu Maghrib.', en: 'After the obligatory Maghrib.' },
    niat: {
      arabic: 'أُصَلِّيْ سُنَّةَ الْمَغْرِبِ الْبَعْدِيَّةَ رَكْعَتَيْنِ لِلَّهِ تَعَالَى',
      latin: 'Ushollii sunnatal maghribi ba’diyyata rak’ataini lillaahi ta’aalaa',
      meaning: { id: 'Aku niat shalat sunnah Ba’diyah Maghrib dua rakaat karena Allah Ta’ala.', en: 'I intend the sunnah prayer after Maghrib of two rakaat, for Allah the Exalted.' },
      reference: { id: 'Lafaz niat — mazhab Syafi’i', en: 'Niyyah formula — Shafi’i school' },
    },
    how: [
      { id: 'rm-1', desc: { id: '2 rakaat, tiap rakaat Al-Fatihah + satu surah, sesudah fardu Maghrib.', en: '2 rakaat, each Al-Fatihah + a surah, after obligatory Maghrib.' } },
    ],
  },
  {
    id: 's-rawatib-isya',
    page: 'rawatib',
    title: { id: 'Rawatib — Sesudah Isya', en: 'Rawatib — After Isha' },
    meta: { id: '2 rakaat · sunnah muakkadah', en: '2 rakaat · strongly emphasised sunnah' },
    when: { id: 'Setelah fardu Isya.', en: 'After the obligatory Isha.' },
    niat: {
      arabic: 'أُصَلِّيْ سُنَّةَ الْعِشَاءِ الْبَعْدِيَّةَ رَكْعَتَيْنِ لِلَّهِ تَعَالَى',
      latin: 'Ushollii sunnatal ‘isyaa-i ba’diyyata rak’ataini lillaahi ta’aalaa',
      meaning: { id: 'Aku niat shalat sunnah Ba’diyah Isya dua rakaat karena Allah Ta’ala.', en: 'I intend the sunnah prayer after Isha of two rakaat, for Allah the Exalted.' },
      reference: { id: 'Lafaz niat — mazhab Syafi’i', en: 'Niyyah formula — Shafi’i school' },
    },
    how: [
      { id: 'ri-1', desc: { id: '2 rakaat, tiap rakaat Al-Fatihah + satu surah, sesudah fardu Isya.', en: '2 rakaat, each Al-Fatihah + a surah, after obligatory Isha.' } },
    ],
  },
  {
    id: 's-dhuha',
    page: 'dhuha',
    title: { id: 'Shalat Dhuha', en: 'Duha Prayer' },
    meta: { id: '2–12 rakaat · sunnah', en: '2–12 rakaat · sunnah' },
    when: { id: 'Setelah matahari naik (±20 menit setelah syuruq) hingga menjelang zhuhur.', en: 'After the sun rises (~20 min after sunrise) until just before Dhuhr.' },
    niat: {
      arabic: 'أُصَلِّيْ سُنَّةَ الضُّحَى رَكْعَتَيْنِ لِلَّهِ تَعَالَى',
      latin: 'Ushollii sunnatadh dhuhaa rak’ataini lillaahi ta’aalaa',
      meaning: { id: 'Aku niat shalat sunnah Dhuha dua rakaat karena Allah Ta’ala.', en: 'I intend the sunnah Duha prayer of two rakaat, for Allah the Exalted.' },
      reference: { id: 'Lafaz niat — mazhab Syafi’i', en: 'Niyyah formula — Shafi’i school' },
    },
    how: [
      { id: 'dh-1', desc: { id: 'Kerjakan 2 rakaat (boleh hingga 12); tiap rakaat Al-Fatihah + satu surah — dianjurkan Asy-Syams, Al-Lail, atau Adh-Dhuha.', en: 'Pray 2 rakaat (up to 12); each rakaat Al-Fatihah + a surah — recommended: Ash-Shams, Al-Lail, or Ad-Dhuha.' } },
      { id: 'dh-2', desc: { id: 'Salam, lalu membaca doa Dhuha di bawah.', en: 'Salam, then recite the Duha supplication below.' } },
    ],
    doa: DOA_DHUHA,
  },
  {
    id: 's-tahajud',
    page: 'tahajud',
    title: { id: 'Shalat Tahajud (Qiyamul Lail)', en: 'Tahajjud (Night Prayer)' },
    meta: { id: 'minimal 2 rakaat · sunnah', en: 'at least 2 rakaat · sunnah' },
    when: { id: 'Sepertiga malam terakhir, setelah tidur.', en: 'The last third of the night, after sleeping.' },
    niat: {
      arabic: 'أُصَلِّيْ سُنَّةَ التَّهَجُّدِ رَكْعَتَيْنِ لِلَّهِ تَعَالَى',
      latin: 'Ushollii sunnatat tahajjudi rak’ataini lillaahi ta’aalaa',
      meaning: { id: 'Aku niat shalat sunnah Tahajud dua rakaat karena Allah Ta’ala.', en: 'I intend the sunnah Tahajjud prayer of two rakaat, for Allah the Exalted.' },
      reference: { id: 'Lafaz niat — mazhab Syafi’i', en: 'Niyyah formula — Shafi’i school' },
    },
    how: [
      { id: 'th-1', desc: { id: 'Bangun malam (utamanya sepertiga terakhir), lalu kerjakan 2 rakaat — boleh lebih, harus genap.', en: 'Rise at night (ideally the last third), then pray 2 rakaat — more is fine, in even numbers.' } },
      { id: 'th-2', desc: { id: 'Tiap rakaat: Al-Fatihah + satu surah. Dianjurkan memperpanjang bacaan dan doa setelahnya.', en: 'Each rakaat: Al-Fatihah + a surah. Lengthening recitation and the supplication afterward is recommended.' } },
    ],
  },
  {
    id: 's-witir',
    page: 'witir',
    title: { id: 'Shalat Witir', en: 'Witr Prayer' },
    meta: { id: '1, 3, 5, 7, atau 9 rakaat · sunnah muakkadah', en: '1, 3, 5, 7, or 9 rakaat · strongly emphasised sunnah' },
    when: { id: 'Setelah Isya hingga terbit fajar; paling utama sepertiga malam terakhir.', en: 'After Isha until dawn; best in the last third of the night.' },
    niat: {
      arabic: 'أُصَلِّيْ سُنَّةَ الْوِتْرِ ثَلَاثَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ لِلَّهِ تَعَالَى',
      latin: 'Ushollii sunnatal witri tsalaata raka’atin mustaqbilal qiblati lillaahi ta’aalaa',
      meaning: { id: 'Aku niat shalat sunnah Witir tiga rakaat menghadap kiblat karena Allah Ta’ala.', en: 'I intend the sunnah Witr prayer of three rakaat, facing the qibla, for Allah the Exalted.' },
      reference: { id: 'Lafaz niat — mazhab Syafi’i', en: 'Niyyah formula — Shafi’i school' },
    },
    how: [
      { id: 'wt-1', desc: { id: '3 rakaat — cara yang utama (Syafi’i): 2 rakaat + salam, lalu 1 rakaat + salam (dua salam, agar tidak menyerupai shalat Maghrib). Mazhab Hanafi menyempurnakan 3 rakaat sekaligus dengan satu salam dan membedakannya dengan bacaan qunut sebelum ruku’.', en: '3 rakaat — the preferred way (Shafi’i): 2 rakaat + salam, then 1 rakaat + salam (two salams, so it does not resemble Maghrib). The Hanafi school prays all 3 with a single salam, distinguishing it by reciting qunut before ruku’.' } },
      { id: 'wt-2', desc: { id: 'Pada rakaat terakhir, saat i’tidal (setelah ruku’) baca doa qunut (di bawah), lalu sujud & salam.', en: 'In the final rakaat, while in i’tidal (after ruku’) recite the qunut supplication (below), then prostrate & salam.' } },
    ],
    doa: QUNUT_DOA,
    desc: {
      id: 'Pada rakaat terakhir, saat i’tidal (setelah ruku’) disunnahkan membaca doa qunut Witir di bawah.',
      en: 'In the final rakaat, while in i’tidal (after ruku’) a Witr qunut supplication (below) is recited.',
    },
  },
  {
    id: 's-istikharah',
    page: 'istikharah',
    title: { id: 'Shalat Istikharah', en: 'Istikhara Prayer' },
    meta: { id: '2 rakaat · sunnah', en: '2 rakaat · sunnah' },
    when: { id: 'Saat bingung memilih di antara dua hal yang mubah.', en: 'When undecided between two permissible options.' },
    niat: {
      arabic: 'أُصَلِّيْ سُنَّةَ الِاسْتِخَارَةِ رَكْعَتَيْنِ لِلَّهِ تَعَالَى',
      latin: 'Ushollii sunnatal istikhaarati rak’ataini lillaahi ta’aalaa',
      meaning: { id: 'Aku niat shalat sunnah Istikharah dua rakaat karena Allah Ta’ala.', en: 'I intend the sunnah Istikhara prayer of two rakaat, for Allah the Exalted.' },
      reference: { id: 'Lafaz niat — mazhab Syafi’i', en: 'Niyyah formula — Shafi’i school' },
    },
    how: [
      { id: 'is-1', desc: { id: 'Kerjakan 2 rakaat; rakaat pertama Al-Fatihah + Al-Kafirun, rakaat kedua Al-Fatihah + Al-Ikhlas (dianjurkan).', en: 'Pray 2 rakaat; first rakaat Al-Fatihah + Al-Kafirun, second Al-Fatihah + Al-Ikhlas (recommended).' } },
      { id: 'is-2', desc: { id: 'Setelah salam, baca doa istikharah di bawah — sebut urusan Anda pada “haadzal amra”.', en: 'After salam, recite the istikhara supplication below — name your matter at “haadzal amra”.' } },
      { id: 'is-3', desc: { id: 'Lalu lanjutkan urusan sesuai apa yang dimudahkan Allah.', en: 'Then proceed with what Allah makes easy.' } },
    ],
    doa: {
      arabic:
        'اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ، وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ، وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ، فَإِنَّكَ تَقْدِرُ وَلَا أَقْدِرُ، وَتَعْلَمُ وَلَا أَعْلَمُ، وَأَنْتَ عَلَّامُ الْغُيُوبِ. اللَّهُمَّ إِنْ كُنْتَ تَعْلَمُ أَنَّ هَذَا الْأَمْرَ خَيْرٌ لِي فِي دِينِي وَمَعَاشِي وَعَاقِبَةِ أَمْرِي فَاقْدُرْهُ لِي وَيَسِّرْهُ لِي ثُمَّ بَارِكْ لِي فِيهِ، وَإِنْ كُنْتَ تَعْلَمُ أَنَّهُ شَرٌّ لِي فِي دِينِي وَمَعَاشِي وَعَاقِبَةِ أَمْرِي فَاصْرِفْهُ عَنِّي وَاصْرِفْنِي عَنْهُ، وَاقْدُرْ لِيَ الْخَيْرَ حَيْثُ كَانَ ثُمَّ أَرْضِنِي بِهِ',
      latin:
        'Allaahumma innii astakhiiruka bi’ilmik, wa astaqdiruka biqudratik, wa as’aluka min fadhlikal ‘azhiim, fa innaka taqdiru wa laa aqdir, wa ta’lamu wa laa a’lam, wa anta ‘allaamul ghuyub. Allaahumma in kunta ta’lamu anna haadzal amra khairul lii fii diinii wa ma’aasyi wa ‘aaqibati amrii faqdurhu lii wa yassirhu lii tsumma baarik lii fiih, wa in kunta ta’lamu annahu syarrul lii fii diinii wa ma’aasyi wa ‘aaqibati amrii fashrifhu ‘annii washrifnii ‘anhu, waqdur liyal khoiri haitsu kaana tsumma ardhinii bih.',
      meaning: {
        id: 'Ya Allah, sesungguhnya aku memohon pilihan yang baik kepada-Mu dengan ilmu-Mu, dan aku memohon kekuatan dengan kekuasaan-Mu, serta aku memohon sebagian karunia-Mu yang agung. Sesungguhnya Engkau Maha Kuasa sedang aku tidak kuasa, Engkau Maha Mengetahui sedang aku tidak mengetahui, dan Engkau Maha Mengetahui yang gaib. Ya Allah, apabila Engkau mengetahui bahwa urusan ini baik bagiku dalam agamaku, kehidupanku, dan akibat urusanku, maka takdirkanlah dan mudahkanlah untukku lalu berkati ia bagiku. Dan apabila Engkau mengetahui bahwa ia buruk bagiku dalam agamaku, kehidupanku, dan akibat urusanku, maka jauhkanlah ia dariku dan jauhkanlah aku darinya, serta takdirkanlah kebaikan untukku di mana pun ia berada, lalu jadikanlah aku ridha kepadanya.',
        en: 'O Allah, I seek Your guidance through Your knowledge, Your power through Your might, and I ask You of Your abundant bounty. You decree and I cannot; You know and I do not; You are the Knower of the unseen. O Allah, if You know that this matter is good for me in my religion, livelihood, and the outcome of my affair, then decree it and make it easy for me, then bless it for me. And if You know it is bad for me in my religion, livelihood, and the outcome of my affair, then turn it away from me and turn me away from it, and decree good for me wherever it is, then make me content with it.',
      },
      reference: { id: 'HR. Bukhari', en: 'Bukhari' },
    },
  },
  {
    id: 's-hajat',
    page: 'hajat',
    title: { id: 'Shalat Hajat', en: 'Hajah Prayer' },
    meta: { id: '2 rakaat (atau lebih) · sunnah', en: '2 rakaat (or more) · sunnah' },
    when: { id: 'Saat punya kebutuhan/hajat dan memohon kepada Allah.', en: 'When you have a need and turn to Allah.' },
    niat: {
      arabic: 'أُصَلِّيْ سُنَّةَ الْحَاجَةِ رَكْعَتَيْنِ لِلَّهِ تَعَالَى',
      latin: 'Ushollii sunnatal haajati rak’ataini lillaahi ta’aalaa',
      meaning: { id: 'Aku niat shalat sunnah Hajat dua rakaat karena Allah Ta’ala.', en: 'I intend the sunnah Hajah prayer of two rakaat, for Allah the Exalted.' },
      reference: { id: 'Lafaz niat — mazhab Syafi’i', en: 'Niyyah formula — Shafi’i school' },
    },
    how: [
      { id: 'hj-1', desc: { id: 'Kerjakan 2 rakaat (atau lebih) dengan khusyuk.', en: 'Pray 2 rakaat (or more) with humility.' } },
      { id: 'hj-2', desc: { id: 'Setelah salam, menghadap kiblat, baca doa hajat di bawah dan sebut kebutuhan Anda.', en: 'After salam, face the qibla, recite the supplication below and state your need.' } },
    ],
    doa: DOA_HAJAT,
  },
  {
    id: 's-tarawih',
    page: 'tarawih',
    title: { id: 'Shalat Tarawih', en: 'Tarawih Prayer' },
    meta: { id: '20 atau 8 rakaat (+ Witir) · sunnah (Ramadan)', en: '20 or 8 rakaat (+ Witr) · sunnah (Ramadan)' },
    when: { id: 'Khusus malam bulan Ramadan, setelah Isya.', en: 'Only during Ramadan nights, after Isha.' },
    niat: {
      arabic: 'أُصَلِّيْ سُنَّةَ التَّرَاوِيْحِ رَكْعَتَيْنِ لِلَّهِ تَعَالَى',
      latin: 'Ushollii sunnatat taraawiihi rak’ataini lillaahi ta’aalaa',
      meaning: { id: 'Aku niat shalat sunnah Tarawih dua rakaat karena Allah Ta’ala.', en: 'I intend the sunnah Tarawih prayer of two rakaat, for Allah the Exalted.' },
      reference: { id: 'Lafaz niat — mazhab Syafi’i', en: 'Niyyah formula — Shafi’i school' },
    },
    how: [
      { id: 'tr-1', desc: { id: 'Khusus malam Ramadan, setelah Isya. 20 atau 8 rakaat (tiap 2 rakaat satu salam), diakhiri Witir.', en: 'Ramadan nights only, after Isha. 20 or 8 rakaat (salam every 2), ending with Witr.' } },
      { id: 'tr-2', desc: { id: 'Dianjurkan berjamaah di masjid bersama imam.', en: 'Recommended in congregation at the mosque, behind the imam.' } },
    ],
  },
  {
    id: 's-taubat',
    page: 'taubat',
    title: { id: 'Shalat Taubat', en: 'Repentance Prayer' },
    meta: { id: '2 rakaat · sunnah', en: '2 rakaat · sunnah' },
    when: { id: 'Saat ingin bertaubat dan kembali kepada Allah.', en: 'When seeking to repent and return to Allah.' },
    niat: {
      arabic: 'أُصَلِّيْ سُنَّةَ التَّوْبَةِ رَكْعَتَيْنِ لِلَّهِ تَعَالَى',
      latin: 'Ushollii sunnatat taubati rak’ataini lillaahi ta’aalaa',
      meaning: { id: 'Aku niat shalat sunnah Taubat dua rakaat karena Allah Ta’ala.', en: 'I intend the sunnah Repentance prayer of two rakaat, for Allah the Exalted.' },
      reference: { id: 'Lafaz niat — mazhab Syafi’i', en: 'Niyyah formula — Shafi’i school' },
    },
    how: [
      { id: 'tb-1', desc: { id: '2 rakaat dengan khusyuk; sesudah salam memohon ampun dan bertekad tidak mengulangi dosa.', en: '2 rakaat with humility; after salam, seek forgiveness and resolve not to repeat the sin.' } },
    ],
    doa: {
      arabic: 'اللَّهُمَّ إِنِّي ظَلَمْتُ نَفْسِي ظُلْمًا كَثِيرًا وَلَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ فَاغْفِرْ لِي مَغْفِرَةً مِنْ عِنْدِكَ وَارْحَمْنِي إِنَّكَ أَنْتَ الْغَفُورُ الرَّحِيمُ',
      latin: 'Allaahumma innii zhalamtii nafsii zhulman katsiiran, wa laa yaghfirudz dzunuuba illaa anta, faghfir lii maghfiratan min ‘indik, warhamnii innaka antal ghafuurur rahiim',
      meaning: {
        id: 'Ya Allah, sungguh aku telah menzalimi diriku dengan kezaliman yang banyak, dan tidak ada yang mengampuni dosa kecuali Engkau. Maka ampunilah aku dengan ampunan dari sisi-Mu dan rahmatilah aku; sesungguhnya Engkau Maha Pengampun lagi Maha Penyayang.',
        en: 'O Allah, I have wronged myself greatly, and none forgives sins but You, so forgive me with a forgiveness from You and have mercy on me; You are the Forgiving, the Merciful.',
      },
      reference: { id: 'HR. Bukhari & Muslim', en: 'Bukhari & Muslim' },
    },
  },
  {
    id: 's-tasbih',
    page: 'tasbih',
    title: { id: 'Shalat Tasbih', en: 'Tasbih Prayer' },
    meta: { id: '4 rakaat · sunnah', en: '4 rakaat · sunnah' },
    when: { id: 'Dianjurkan minimal sekali seumur hidup; sering dikerjakan pada malam hari.', en: 'Recommended at least once in a lifetime; often prayed at night.' },
    niat: {
      arabic: 'أُصَلِّيْ سُنَّةَ التَّسْبِيْحِ أَرْبَعَ رَكَعَاتٍ لِلَّهِ تَعَالَى',
      latin: 'Ushollii sunnatat tasbiihi arba’a raka’atin lillaahi ta’aalaa',
      meaning: { id: 'Aku niat shalat sunnah Tasbih empat rakaat karena Allah Ta’ala.', en: 'I intend the sunnah Tasbih prayer of four rakaat, for Allah the Exalted.' },
      reference: { id: 'Lafaz niat — mazhab Syafi’i', en: 'Niyyah formula — Shafi’i school' },
    },
    how: [
      { id: 'ts-1', desc: { id: '4 rakaat. Bacaan tasbih (di bawah) diucapkan 15× setelah Al-Fatihah & surat, lalu 10× pada setiap posisi — ruku, i’tidal, sujud pertama, duduk antara dua sujud, sujud kedua, dan setelah mengangkat kepala dari sujud kedua — sehingga 75× per rakaat (total 300× dalam 4 rakaat).', en: '4 rakaat. The tasbih phrase (below) is recited 15× after Al-Fatihah & the surah, then 10× in each posture — bowing, i’tidal, first prostration, between prostrations, second prostration, and after raising the head from the second prostration — making 75× per rakaat (300× total across 4 rakaat).' } },
    ],
    doa: {
      arabic: 'سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلَا إِلَهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ',
      latin: 'Subhaanallaah, walhamdu lillaah, wa laa ilaaha illallaah, wallaahu akbar (75× per rakaat ×4 = 300×)',
      meaning: {
        id: 'Maha Suci Allah, segala puji bagi Allah, tiada Tuhan selain Allah, Allah Maha Besar — dibaca 75× per rakaat (total 300× sepanjang 4 rakaat).',
        en: 'Glory to Allah, praise to Allah, there is no god but Allah, Allah is Greatest — recited 75× per rakaat (300× total across 4 rakaat).',
      },
      reference: { id: 'HR. Abu Dawud & At-Tirmidzi', en: 'Abu Dawud & At-Tirmidhi' },
    },
  },
  {
    id: 's-idul-fitri',
    page: 'idul-fitri',
    title: { id: 'Shalat Idul Fitri', en: 'Eid al-Fitr Prayer' },
    meta: { id: '2 rakaat · sunnah muakkadah (jamaah)', en: '2 rakaat · strongly emphasised (congregation)' },
    when: { id: '1 Syawal, setelah matahari naik, sebelum zhuhur.', en: '1 Shawwal, after sunrise, before Dhuhr.' },
    niat: {
      arabic: 'أُصَلِّيْ سُنَّةَ عِيْدِ الْفِطْرِ رَكْعَتَيْنِ مُسْتَقْبِلَ الْقِبْلَةِ لِلَّهِ تَعَالَى',
      latin: 'Ushollii sunnata ‘iidil fithri rak’ataini mustaqbilal qiblati lillaahi ta’aalaa',
      meaning: { id: 'Aku niat shalat sunnah Idul Fitri dua rakaat menghadap kiblat karena Allah Ta’ala.', en: 'I intend the sunnah Eid al-Fitr prayer of two rakaat, facing the qibla, for Allah the Exalted.' },
      reference: { id: 'Lafaz niat — mazhab Syafi’i', en: 'Niyyah formula — Shafi’i school' },
    },
    desc: {
      id: '7 takbir (selain takbiratul ihram) di rakaat pertama dan 5 takbir di rakaat kedua; diikuti khutbah.',
      en: '7 takbirs (besides the opening) in the first rakaat and 5 in the second; followed by a khutbah.',
    },
  },
  {
    id: 's-idul-adha',
    page: 'idul-adha',
    title: { id: 'Shalat Idul Adha', en: 'Eid al-Adha Prayer' },
    meta: { id: '2 rakaat · sunnah muakkadah (jamaah)', en: '2 rakaat · strongly emphasised (congregation)' },
    when: { id: '10 Dzulhijjah, setelah matahari naik.', en: '10 Dhul-Hijjah, after sunrise.' },
    niat: {
      arabic: 'أُصَلِّيْ سُنَّةَ عِيْدِ الْأَضْحَى رَكْعَتَيْنِ مُسْتَقْبِلَ الْقِبْلَةِ لِلَّهِ تَعَالَى',
      latin: 'Ushollii sunnata ‘iidil adh-haa rak’ataini mustaqbilal qiblati lillaahi ta’aalaa',
      meaning: { id: 'Aku niat shalat sunnah Idul Adha dua rakaat menghadap kiblat karena Allah Ta’ala.', en: 'I intend the sunnah Eid al-Adha prayer of two rakaat, facing the qibla, for Allah the Exalted.' },
      reference: { id: 'Lafaz niat — mazhab Syafi’i', en: 'Niyyah formula — Shafi’i school' },
    },
    desc: {
      id: 'Seperti shalat Idul Fitri; diikuti khutbah dan pelaksanaan qurban.',
      en: 'Like the Eid al-Fitr prayer; followed by a khutbah and the sacrifice.',
    },
  },
  {
    id: 's-janazah',
    page: 'janazah',
    title: { id: 'Shalat Jenazah', en: 'Funeral Prayer' },
    meta: { id: 'fardu kifayah · berdiri saja', en: 'communal obligation · standing only' },
    when: { id: 'Atas jenazah muslim, sebelum dimakamkan.', en: 'Over a deceased Muslim, before burial.' },
    niat: {
      arabic: 'أُصَلِّيْ عَلَى هَذِهِ الْجَنَازَةِ فَرْضَ الْكِفَايَةِ مُسْتَقْبِلَ الْقِبْلَةِ لِلَّهِ تَعَالَى',
      latin: 'Ushollii ‘alaa haadzihil janaazati fardhal kifaayati mustaqbilal qiblati lillaahi ta’aalaa',
      meaning: { id: 'Aku niat shalat atas jenazah ini, fardu kifayah, menghadap kiblat karena Allah Ta’ala.', en: 'I intend the funeral prayer over this deceased, a communal obligation, facing the qibla, for Allah the Exalted.' },
      reference: { id: 'Lafaz niat — mazhab Syafi’i', en: 'Niyyah formula — Shafi’i school' },
    },
    desc: {
      id: '4 takbir (tanpa ruku’/sujud): takbir 1 + Al-Fatihah; takbir 2 + shalawat; takbir 3 + doa jenazah; takbir 4 + doa, lalu salam.',
      en: '4 takbirs (no bowing/prostration): takbir 1 + Al-Fatihah; takbir 2 + salawat; takbir 3 + the funeral supplication; takbir 4 + supplication, then salam.',
    },
    doa: {
      arabic: 'اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ وَعَافِهِ وَاعْفُ عَنْهُ',
      latin: 'Allaahummaghfir lahu (laha) warhamhu (ha), wa ‘aafihi (ha), wa’fu ‘anhu (‘anhaa)',
      meaning: {
        id: 'Ya Allah, ampunilah dia, rahmatilah dia, berilah dia kesehatan, dan maafkanlah dia. (Gunakan lafaz perempuan bila jenazah perempuan.)',
        en: 'O Allah, forgive him (her), have mercy on him (her), grant him (her) well-being, and pardon him (her). (Use the feminine form for a female deceased.)',
      },
      reference: { id: 'HR. Muslim', en: 'Muslim' },
    },
  },
  {
    id: 's-kusuf',
    page: 'kusuf',
    title: { id: 'Shalat Kusuf (Gerhana)', en: 'Eclipse Prayer' },
    meta: { id: '2 rakaat · sunnah (jamaah)', en: '2 rakaat · sunnah (congregation)' },
    when: { id: 'Saat terjadi gerhana matahari (kusuf) atau bulan (khusuf).', en: 'During a solar (kusuf) or lunar (khusuf) eclipse.' },
    niat: {
      arabic: 'أُصَلِّيْ سُنَّةَ الْكُسُوْفِ رَكْعَتَيْنِ لِلَّهِ تَعَالَى',
      latin: 'Ushollii sunnatal kusuufi rak’ataini lillaahi ta’aalaa',
      meaning: { id: 'Aku niat shalat sunnah Kusuf (gerhana) dua rakaat karena Allah Ta’ala.', en: 'I intend the sunnah Eclipse prayer of two rakaat, for Allah the Exalted.' },
      reference: { id: 'Lafaz niat — mazhab Syafi’i', en: 'Niyyah formula — Shafi’i school' },
    },
    desc: {
      id: 'Dikerjakan berjamaah di masjid; setiap rakaat memiliki dua ruku’ (rukuk dua kali sebelum sujud).',
      en: 'Prayed in congregation at the mosque; each rakaat has two bowings (rukū twice before prostration).',
    },
  },
  {
    id: 's-istisqa',
    page: 'istisqa',
    title: { id: 'Shalat Istisqa (Hujan)', en: 'Rain Prayer' },
    meta: { id: '2 rakaat · sunnah (jamaah)', en: '2 rakaat · sunnah (congregation)' },
    when: { id: 'Saat musim kemarau panjang, memohon turunnya hujan.', en: 'During prolonged drought, to ask Allah for rain.' },
    niat: {
      arabic: 'أُصَلِّيْ سُنَّةَ الِاسْتِسْقَاءِ رَكْعَتَيْنِ لِلَّهِ تَعَالَى',
      latin: 'Ushollii sunnatal istisqaa-i rak’ataini lillaahi ta’aalaa',
      meaning: { id: 'Aku niat shalat sunnah Istisqa dua rakaat karena Allah Ta’ala.', en: 'I intend the sunnah Rain prayer of two rakaat, for Allah the Exalted.' },
      reference: { id: 'Lafaz niat — mazhab Syafi’i', en: 'Niyyah formula — Shafi’i school' },
    },
    desc: {
      id: 'Dikerjakan berjamaah di tanah terbuka; diikuti khutbah dan doa memohon hujan.',
      en: 'Prayed in congregation in the open; followed by a khutbah and a supplication for rain.',
    },
  },
];
