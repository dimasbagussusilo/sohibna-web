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
    ar: 'اللهم إني أسألك علمًا نافعًا، ورزقًا طيبًا، وعملًا متقبلًا.',
    tr: 'Allah’ım! Senden faydalı ilim, iyi (helal) rızık ve makbul amel istiyorum.',
    ur: 'اے اللہ! بے شک میں تجھ سے نفع مند علم، پاکیزہ (حلال) رزق اور مقبول عمل مانگتا ہوں۔'
  },
  reference: { id: 'HR. Ibnu Majah no. 925 (dari Ummu Salamah, dishahihkan Al-Albani)', en: 'Ibnu Majah no. 925 (from Umm Salamah, graded sahih by Al-Albani)', ar: 'رواه ابن ماجه رقم 925 (عن أم سلمة، صححه الألباني)', tr: 'İbn Mâce no. 925 (Ümmü Seleme’den; el-Albânî sahih demiştir)', ur: 'ابن ماجہ حدیث نمبر 925 (ام سلمہ رضی اللہ عنہا سے، البانی نے صحیح قرار دیا)' },
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
    ar: 'لا إله إلا الله الحليم الكريم، سبحان الله رب العرش العظيم، الحمد لله رب العالمين، أسألك موجبات رحمتك وعزائم مغفرتك والغنيمة من كل بر والسلامة من كل إثم، لا تدع لي ذنبًا إلا غفرته، ولا همًّا إلا فرجته، ولا حاجة هي لك رضًا إلا قضيتها يا أرحم الراحمين.',
    tr: 'Halîm ve Kerim olan Allah’tan başka ilah yoktur. Yüce Arş’ın Rabbi Allah noksan sıfatlardan uzaktır. Hamd âlemlerin Rabbi Allah’adır. Rahmetine vesile olanları, bağışlamanın gereklerini, her iyilikten kazanmayı ve her günahtan selameti Senden istiyorum. Bağışlamadığın bir günah, gidermediğin bir keder ve razı olduğun bir ihtiyaç dışında, karşılanmamış hiçbir şey bırakma; ey merhametlilerin en merhametlisi.',
    ur: 'اللہ کے سوا کوئی معبود نہیں، وہ بڑا بردبار اور کرم والا ہے۔ اللہ پاک ہے، عرشِ عظیم کا رب۔ تمام تعریفیں اللہ کے لیے ہیں جو تمام جہانوں کا رب ہے۔ میں تجھ سے تیری رحمت کے اسباب، تیری مغفرت کے عزم، ہر نیکی کا حصہ اور ہر گناہ سے سلامتی مانگتا ہوں۔ میرا کوئی ایسا گناہ نہ چھوڑ جو تو نے معاف نہ کر دیا ہو، کوئی ایسا غم نہ چھوڑ جو تو نے دور نہ کر دیا ہو، اور تیری رضا والی کوئی ایسی حاجت نہ چھوڑ جو تو نے پوری نہ کر دی ہو، اے رحم والوں میں سب سے رحم والے۔'
  },
  reference: { id: 'HR. At-Tirmidzi', en: 'At-Tirmidhi', ar: 'رواه الترمذي', tr: 'Tirmizî', ur: 'ترمذی' },
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
    title: { id: 'Rawatib — Sebelum Subuh (Qabliyah Subuh)', en: 'Rawatib — Before Fajr', ar: 'الرواتب — قبل الفجر', tr: 'Revatib — Sabah’dan önce (kabıliye sünnet)', ur: 'رواتب — فجر سے پہلے (فجر کی قبلائی سنت)' },
    meta: { id: '2 rakaat · sunnah muakkadah', en: '2 rakaat · strongly emphasised sunnah', ar: 'ركعتان · سنة مؤكدة', tr: '2 rekat · müekked sünnet', ur: 'دو رکعت · سنتِ مؤکدہ' },
    when: { id: 'Setelah masuk waktu Subuh, sebelum shalat fardu Subuh.', en: 'After Fajr enters, before the obligatory Fajr.', ar: 'بعد دخول وقت الفجر وقبل فريضته.', tr: 'Sabah vakti girdikten sonra, Sabah farzından önce.', ur: 'فجر کے وقت داخل ہونے کے بعد، فجر کی فرض نماز سے پہلے۔' },
    niat: {
      arabic: 'أُصَلِّيْ سُنَّةَ الصُّبْحِ الْقَبْلِيَّةَ رَكْعَتَيْنِ لِلَّهِ تَعَالَى',
      latin: 'Ushollii sunnatas shubhil qabliyyata rak’ataini lillaahi ta’aalaa',
      meaning: { id: 'Aku niat shalat sunnah Qabliyah Subuh dua rakaat karena Allah Ta’ala.', en: 'I intend the sunnah prayer before Fajr of two rakaat, for Allah the Exalted.', ar: 'أصلّي سنة الفجر القبلية ركعتين لله تعالى.', tr: 'Sabah namazının önceki (kabıliye) sünnetini, Allah Teâlâ için iki rekat olarak kılmaya niyet ettim.', ur: 'میں نے فجر کی قبلائی سنت دو رکعت کی نیت کی، اللہ تعالیٰ کے لیے۔' },
      reference: { id: 'Lafaz niat — mazhab Syafi’i', en: 'Niyyah formula — Shafi’i school', ar: 'صيغة النية — مذهب الشافعية', tr: 'Niyet lafzı — Şafii mezhebi', ur: 'نیت کا صیغہ — مذہبِ شافعی' },
    },
    how: [
      { id: 'rs-1', desc: { id: '2 rakaat, tiap rakaat Al-Fatihah + satu surah (dianjurkan Al-Kafirun & Al-Ikhlas). Dikerjakan sebelum iqamah Subuh.', en: '2 rakaat, each Al-Fatihah + a surah (Al-Kafirun & Al-Ikhlas recommended). Prayed before the Fajr iqama.', ar: 'ركعتان، في كل ركعة الفاتحة وسورة (يُستحب الكافرون والإخلاص)، وتُصلّى قبل إقامة الفجر.', tr: 'İki rekat; her rekatta Fatiha + bir sure (Kâfirûn ve İhlâs müstehaptır). Sabah ikametinden önce kılınır.', ur: 'دو رکعت، ہر رکعت میں الفاتحہ + ایک سورۃ (کافرون اور اخلاص مستحب ہیں)۔ فجر کی اقامت سے پہلے ادا کی جاتی ہے۔' } },
    ],
  },
  {
    id: 's-rawatib-dzuhur',
    page: 'rawatib',
    title: { id: 'Rawatib — Sekitar Dzuhur', en: 'Rawatib — Around Dhuhr', ar: 'الرواتب — حول الظهر', tr: 'Revatib — Öğle namazının çevresinde', ur: 'رواتب — ظہر کے اطراف' },
    meta: { id: '4 sebelum + 2 sesudah · sunnah muakkadah', en: '4 before + 2 after · strongly emphasised sunnah', ar: '4 قبلها + 2 بعدها · سنة مؤكدة', tr: '4 önce + 2 sonra · müekked sünnet', ur: '4 پہلے + 2 بعد · سنتِ مؤکدہ' },
    when: { id: 'Empat rakaat sebelum dan dua rakaat sesudah fardu Dzuhur.', en: 'Four rakaat before and two rakaat after the obligatory Dhuhr.', ar: 'أربع ركعات قبل فريضة الظهر وركعتان بعدها.', tr: 'Farz Öğle’den önce dört, sonra iki rekat.', ur: 'ظہر کی فرض سے پہلے چار رکعت اور بعد میں دو رکعت۔' },
    niat: {
      arabic: 'أُصَلِّيْ سُنَّةَ الظُّهْرِ الْقَبْلِيَّةَ أَرْبَعَ رَكَعَاتٍ لِلَّهِ تَعَالَى',
      latin: 'Ushollii sunnatas zhuhri qabliyyata arba’a raka’atin lillaahi ta’aalaa',
      meaning: { id: 'Aku niat shalat sunnah Qabliyah Dzuhur empat rakaat karena Allah Ta’ala.', en: 'I intend the sunnah prayer before Dhuhr of four rakaat, for Allah the Exalted.', ar: 'أصلّي سنة الظهر القبلية أربع ركعات لله تعالى.', tr: 'Öğle namazının önceki (kabıliye) sünnetini, Allah Teâlâ için dört rekat olarak kılmaya niyet ettim.', ur: 'میں نے ظہر کی قبلائی سنت چار رکعت کی نیت کی، اللہ تعالیٰ کے لیے۔' },
      reference: { id: 'Lafaz niat — mazhab Syafi’i', en: 'Niyyah formula — Shafi’i school', ar: 'صيغة النية — مذهب الشافعية', tr: 'Niyet lafzı — Şafii mezhebi', ur: 'نیت کا صیغہ — مذہبِ شافعی' },
    },
    how: [
      { id: 'rd-1', desc: { id: '4 rakaat (tiap 2 rakaat satu salam) sebelum fardu Dzuhur; 2 rakaat sesudahnya. Dikerjakan seperti shalat biasa.', en: '4 rakaat (salam every 2) before obligatory Dhuhr; 2 after. Performed like a standard prayer.', ar: 'أربع ركعات (بسلامٍ كل ركعتين) قبل فريضة الظهر، وركعتان بعدها، كصلاةٍ عادية.', tr: 'Farz Öğle’den önce dört rekat (her iki rekatta bir selam), ardından iki rekat. Normal bir namaz gibi kılınır.', ur: 'ظہر کی فرض سے پہلے چار رکعت (ہر دو رکعت پر ایک سلام)، بعد میں دو رکعت۔ عام نماز کی طرح ادا کی جاتی ہے۔' } },
    ],
  },
  {
    id: 's-rawatib-maghrib',
    page: 'rawatib',
    title: { id: 'Rawatib — Sesudah Maghrib', en: 'Rawatib — After Maghrib', ar: 'الرواتب — بعد المغرب', tr: 'Revatib — Akşam’dan sonra', ur: 'رواتب — مغرب کے بعد' },
    meta: { id: '2 rakaat · sunnah muakkadah', en: '2 rakaat · strongly emphasised sunnah', ar: 'ركعتان · سنة مؤكدة', tr: '2 rekat · müekked sünnet', ur: 'دو رکعت · سنتِ مؤکدہ' },
    when: { id: 'Setelah fardu Maghrib.', en: 'After the obligatory Maghrib.', ar: 'بعد فريضة المغرب.', tr: 'Farz Akşam’dan sonra.', ur: 'مغرب کی فرض کے بعد۔' },
    niat: {
      arabic: 'أُصَلِّيْ سُنَّةَ الْمَغْرِبِ الْبَعْدِيَّةَ رَكْعَتَيْنِ لِلَّهِ تَعَالَى',
      latin: 'Ushollii sunnatal maghribi ba’diyyata rak’ataini lillaahi ta’aalaa',
      meaning: { id: 'Aku niat shalat sunnah Ba’diyah Maghrib dua rakaat karena Allah Ta’ala.', en: 'I intend the sunnah prayer after Maghrib of two rakaat, for Allah the Exalted.', ar: 'أصلّي سنة المغرب البعدية ركعتين لله تعالى.', tr: 'Akşam namazının sonraki (ba’diye) sünnetini, Allah Teâlâ için iki rekat olarak kılmaya niyet ettim.', ur: 'میں نے مغرب کی بعدائی سنت دو رکعت کی نیت کی، اللہ تعالیٰ کے لیے۔' },
      reference: { id: 'Lafaz niat — mazhab Syafi’i', en: 'Niyyah formula — Shafi’i school', ar: 'صيغة النية — مذهب الشافعية', tr: 'Niyet lafzı — Şafii mezhebi', ur: 'نیت کا صیغہ — مذہبِ شافعی' },
    },
    how: [
      { id: 'rm-1', desc: { id: '2 rakaat, tiap rakaat Al-Fatihah + satu surah, sesudah fardu Maghrib.', en: '2 rakaat, each Al-Fatihah + a surah, after obligatory Maghrib.', ar: 'ركعتان، في كل ركعة الفاتحة وسورة، بعد فريضة المغرب.', tr: 'İki rekat; her rekatta Fatiha + bir sure, farz Akşam’dan sonra.', ur: 'دو رکعت، ہر رکعت میں الفاتحہ + ایک سورۃ، مغرب کی فرض کے بعد۔' } },
    ],
  },
  {
    id: 's-rawatib-isya',
    page: 'rawatib',
    title: { id: 'Rawatib — Sesudah Isya', en: 'Rawatib — After Isha', ar: 'الرواتب — بعد العشاء', tr: 'Revatib — Yatsı’dan sonra', ur: 'رواتب — عشاء کے بعد' },
    meta: { id: '2 rakaat · sunnah muakkadah', en: '2 rakaat · strongly emphasised sunnah', ar: 'ركعتان · سنة مؤكدة', tr: '2 rekat · müekked sünnet', ur: 'دو رکعت · سنتِ مؤکدہ' },
    when: { id: 'Setelah fardu Isya.', en: 'After the obligatory Isha.', ar: 'بعد فريضة العشاء.', tr: 'Farz Yatsı’dan sonra.', ur: 'عشاء کی فرض کے بعد۔' },
    niat: {
      arabic: 'أُصَلِّيْ سُنَّةَ الْعِشَاءِ الْبَعْدِيَّةَ رَكْعَتَيْنِ لِلَّهِ تَعَالَى',
      latin: 'Ushollii sunnatal ‘isyaa-i ba’diyyata rak’ataini lillaahi ta’aalaa',
      meaning: { id: 'Aku niat shalat sunnah Ba’diyah Isya dua rakaat karena Allah Ta’ala.', en: 'I intend the sunnah prayer after Isha of two rakaat, for Allah the Exalted.', ar: 'أصلّي سنة العشاء البعدية ركعتين لله تعالى.', tr: 'Yatsı namazının sonraki (ba’diye) sünnetini, Allah Teâlâ için iki rekat olarak kılmaya niyet ettim.', ur: 'میں نے عشاء کی بعدائی سنت دو رکعت کی نیت کی، اللہ تعالیٰ کے لیے۔' },
      reference: { id: 'Lafaz niat — mazhab Syafi’i', en: 'Niyyah formula — Shafi’i school', ar: 'صيغة النية — مذهب الشافعية', tr: 'Niyet lafzı — Şafii mezhebi', ur: 'نیت کا صیغہ — مذہبِ شافعی' },
    },
    how: [
      { id: 'ri-1', desc: { id: '2 rakaat, tiap rakaat Al-Fatihah + satu surah, sesudah fardu Isya.', en: '2 rakaat, each Al-Fatihah + a surah, after obligatory Isha.', ar: 'ركعتان، في كل ركعة الفاتحة وسورة، بعد فريضة العشاء.', tr: 'İki rekat; her rekatta Fatiha + bir sure, farz Yatsı’dan sonra.', ur: 'دو رکعت، ہر رکعت میں الفاتحہ + ایک سورۃ، عشاء کی فرض کے بعد۔' } },
    ],
  },
  {
    id: 's-dhuha',
    page: 'dhuha',
    title: { id: 'Shalat Dhuha', en: 'Duha Prayer', ar: 'صلاة الضحى', tr: 'Duha (Kuşluk) Namazı', ur: 'نمازِ چاشت (ضحیٰ)' },
    meta: { id: '2–12 rakaat · sunnah', en: '2–12 rakaat · sunnah', ar: '2–12 ركعة · سنة', tr: '2–12 rekat · sünnet', ur: '2 تا 12 رکعت · سنت' },
    when: { id: 'Setelah matahari naik (±20 menit setelah syuruq) hingga menjelang zhuhur.', en: 'After the sun rises (~20 min after sunrise) until just before Dhuhr.', ar: 'بعد ارتفاع الشمس (نحو 20 دقيقة بعد الشروق) وحتى قرب الظهر.', tr: 'Güneş yükseldikten sonra (doğuştan yaklaşık 20 dakika sonra), Öğle vaktine kadar.', ur: 'سورج بلند ہونے کے بعد (طلوعِ آفتاب کے تقریباً 20 منٹ بعد) سے ظہر سے پہلے تک۔' },
    niat: {
      arabic: 'أُصَلِّيْ سُنَّةَ الضُّحَى رَكْعَتَيْنِ لِلَّهِ تَعَالَى',
      latin: 'Ushollii sunnatadh dhuhaa rak’ataini lillaahi ta’aalaa',
      meaning: { id: 'Aku niat shalat sunnah Dhuha dua rakaat karena Allah Ta’ala.', en: 'I intend the sunnah Duha prayer of two rakaat, for Allah the Exalted.', ar: 'أصلّي سنة الضحى ركعتين لله تعالى.', tr: 'Duha sünnet namazını, Allah Teâlâ için iki rekat olarak kılmaya niyet ettim.', ur: 'میں نے چاشت (ضحیٰ) کی سنت دو رکعت کی نیت کی، اللہ تعالیٰ کے لیے۔' },
      reference: { id: 'Lafaz niat — mazhab Syafi’i', en: 'Niyyah formula — Shafi’i school', ar: 'صيغة النية — مذهب الشافعية', tr: 'Niyet lafzı — Şafii mezhebi', ur: 'نیت کا صیغہ — مذہبِ شافعی' },
    },
    how: [
      { id: 'dh-1', desc: { id: 'Kerjakan 2 rakaat (boleh hingga 12); tiap rakaat Al-Fatihah + satu surah — dianjurkan Asy-Syams, Al-Lail, atau Adh-Dhuha.', en: 'Pray 2 rakaat (up to 12); each rakaat Al-Fatihah + a surah — recommended: Ash-Shams, Al-Lail, or Ad-Dhuha.', ar: 'صلِّ ركعتين (ويجوز إلى اثنتي عشرة)؛ في كل ركعة الفاتحة وسورة — ويُستحب الشمس أو الليل أو الضحى.', tr: 'İki rekat kılın (12’ye kadar caizdir); her rekatta Fatiha + bir sure — Şems, Leyl veya Duhâ sureleri müstehaptır.', ur: 'دو رکعت پڑھیں (12 تک جائز ہیں)؛ ہر رکعت میں الفاتحہ + ایک سورۃ — شمس، لیل یا ضحیٰ مستحب ہیں۔' } },
      { id: 'dh-2', desc: { id: 'Salam, lalu membaca doa Dhuha di bawah.', en: 'Salam, then recite the Duha supplication below.', ar: 'سلِّم، ثم اقرأ دعاء الضحى أدناه.', tr: 'Selam verin, sonra aşağıdaki Duha duasını okuyun.', ur: 'سلام پھیر کر نیچے لکھی نمازِ چاشت کی دعا پڑھیں۔' } },
    ],
    doa: DOA_DHUHA,
  },
  {
    id: 's-tahajud',
    page: 'tahajud',
    title: { id: 'Shalat Tahajud (Qiyamul Lail)', en: 'Tahajjud (Night Prayer)', ar: 'صلاة التهجد (قيام الليل)', tr: 'Teheccüd Namazı (Gece Namazı)', ur: 'نمازِ تہجد (قیامِ لیل)' },
    meta: { id: 'minimal 2 rakaat · sunnah', en: 'at least 2 rakaat · sunnah', ar: 'ركعتان على الأقل · سنة', tr: 'en az 2 rekat · sünnet', ur: 'کم از کم دو رکعت · سنت' },
    when: { id: 'Sepertiga malam terakhir, setelah tidur.', en: 'The last third of the night, after sleeping.', ar: 'في الثلث الأخير من الليل، بعد النوم.', tr: 'Gecenin son üçte biri, uyuduktan sonra.', ur: 'رات کے آخری تہائی حصے میں، سونے کے بعد۔' },
    niat: {
      arabic: 'أُصَلِّيْ سُنَّةَ التَّهَجُّدِ رَكْعَتَيْنِ لِلَّهِ تَعَالَى',
      latin: 'Ushollii sunnatat tahajjudi rak’ataini lillaahi ta’aalaa',
      meaning: { id: 'Aku niat shalat sunnah Tahajud dua rakaat karena Allah Ta’ala.', en: 'I intend the sunnah Tahajjud prayer of two rakaat, for Allah the Exalted.', ar: 'أصلّي سنة التهجد ركعتين لله تعالى.', tr: 'Teheccüd sünnet namazını, Allah Teâlâ için iki rekat olarak kılmaya niyet ettim.', ur: 'میں نے تہجد کی سنت دو رکعت کی نیت کی، اللہ تعالیٰ کے لیے۔' },
      reference: { id: 'Lafaz niat — mazhab Syafi’i', en: 'Niyyah formula — Shafi’i school', ar: 'صيغة النية — مذهب الشافعية', tr: 'Niyet lafzı — Şafii mezhebi', ur: 'نیت کا صیغہ — مذہبِ شافعی' },
    },
    how: [
      { id: 'th-1', desc: { id: 'Bangun malam (utamanya sepertiga terakhir), lalu kerjakan 2 rakaat — boleh lebih, harus genap.', en: 'Rise at night (ideally the last third), then pray 2 rakaat — more is fine, in even numbers.', ar: 'قُم من الليل (والأفضل الثلث الأخير) ثم صلِّ ركعتين — وأكثر من ذلك حسن ويكون شفعًا.', tr: 'Gece kalkın (en faziletlisi son üçte birde), sonra iki rekat kılın — daha fazlası da caizdir, çift sayıda olmalıdır.', ur: 'رات کے آخری تہائی حصے میں (بہتر یہی ہے) اٹھیں، پھر دو رکعت پڑھیں — اس سے زیادہ بھی جائز ہے، جفت تعداد میں۔' } },
      { id: 'th-2', desc: { id: 'Tiap rakaat: Al-Fatihah + satu surah. Dianjurkan memperpanjang bacaan dan doa setelahnya.', en: 'Each rakaat: Al-Fatihah + a surah. Lengthening recitation and the supplication afterward is recommended.', ar: 'في كل ركعة: الفاتحة وسورة، ويُستحب إطالة القراءة والدعاء بعدها.', tr: 'Her rekat: Fatiha + bir sure. Sonrasında kıraati ve duayı uzatmak müstehaptır.', ur: 'ہر رکعت میں: الفاتحہ + ایک سورۃ۔ قرأت اور بعد کی دعا طویل کرنا مستحب ہے۔' } },
    ],
  },
  {
    id: 's-witir',
    page: 'witir',
    title: { id: 'Shalat Witir', en: 'Witr Prayer', ar: 'صلاة الوتر', tr: 'Vitir Namazı', ur: 'نمازِ وتر' },
    meta: { id: '1, 3, 5, 7, atau 9 rakaat · sunnah muakkadah', en: '1, 3, 5, 7, or 9 rakaat · strongly emphasised sunnah', ar: '1 أو 3 أو 5 أو 7 أو 9 ركعات · سنة مؤكدة', tr: '1, 3, 5, 7 veya 9 rekat · müekked sünnet', ur: '1، 3، 5، 7 یا 9 رکعت · سنتِ مؤکدہ' },
    when: { id: 'Setelah Isya hingga terbit fajar; paling utama sepertiga malam terakhir.', en: 'After Isha until dawn; best in the last third of the night.', ar: 'بعد العشاء إلى طلوع الفجر، وأفضلها في الثلث الأخير من الليل.', tr: 'Yatsı’dan fecrin doğuşuna kadar; en faziletlisi gecenin son üçte biridir.', ur: 'عشاء سے فجر طلوع ہونے تک؛ سب سے بہتر رات کے آخری تہائی حصے میں۔' },
    niat: {
      arabic: 'أُصَلِّيْ سُنَّةَ الْوِتْرِ ثَلَاثَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ لِلَّهِ تَعَالَى',
      latin: 'Ushollii sunnatal witri tsalaata raka’atin mustaqbilal qiblati lillaahi ta’aalaa',
      meaning: { id: 'Aku niat shalat sunnah Witir tiga rakaat menghadap kiblat karena Allah Ta’ala.', en: 'I intend the sunnah Witr prayer of three rakaat, facing the qibla, for Allah the Exalted.', ar: 'أصلّي سنة الوتر ثلاث ركعات مستقبل القبلة لله تعالى.', tr: 'Vitir sünnet namazını, kıbleye yönelerek, Allah Teâlâ için üç rekat olarak kılmaya niyet ettim.', ur: 'میں نے وتر کی سنت تین رکعت کی نیت کی، منہ قبلے کی طرف، اللہ تعالیٰ کے لیے۔' },
      reference: { id: 'Lafaz niat — mazhab Syafi’i', en: 'Niyyah formula — Shafi’i school', ar: 'صيغة النية — مذهب الشافعية', tr: 'Niyet lafzı — Şafii mezhebi', ur: 'نیت کا صیغہ — مذہبِ شافعی' },
    },
    how: [
      { id: 'wt-1', desc: { id: '3 rakaat — cara yang utama (Syafi’i): 2 rakaat + salam, lalu 1 rakaat + salam (dua salam, agar tidak menyerupai shalat Maghrib). Mazhab Hanafi menyempurnakan 3 rakaat sekaligus dengan satu salam dan membedakannya dengan bacaan qunut sebelum ruku’.', en: '3 rakaat — the preferred way (Shafi’i): 2 rakaat + salam, then 1 rakaat + salam (two salams, so it does not resemble Maghrib). The Hanafi school prays all 3 with a single salam, distinguishing it by reciting qunut before ruku’.', ar: 'ثلاث ركعات — والأفضل عند الشافعية: ركعتان ثم السلام، ثم ركعة ثم السلام (سلامان، كي لا تشبه المغرب). والحنفية يصلّون الثلاث بسلامٍ واحد ويميّزونها بقراءة القنوت قبل الركوع.', tr: 'Üç rekat — tercih edilen şekil (Şafii): iki rekat + selam, sonra bir rekat + selam (iki selam; Akşam’a benzemesin diye). Hanefi mezhebi ise üç rekatı tek selamla bir arada tamamlar ve rükû’dan önce kunut okuyarak onu ayırt eder.', ur: 'تین رکعت — بہتر طریقہ (شافعی): دو رکعت + سلام، پھر ایک رکعت + سلام (دو سلام، تاکہ مغرب کی نماز سے مشابہت نہ رہے)۔ حنفی مسلک تینوں رکعتیں ایک سلام سے پوری کرتا ہے اور رکوع سے پہلے قنوت پڑھ کر اسے الگ ظاہر کرتا ہے۔' } },
      { id: 'wt-2', desc: { id: 'Pada rakaat terakhir, saat i’tidal (setelah ruku’) baca doa qunut (di bawah), lalu sujud & salam.', en: 'In the final rakaat, while in i’tidal (after ruku’) recite the qunut supplication (below), then prostrate & salam.', ar: 'في الركعة الأخيرة، عند الاعتدال (بعد الرفع من الركوع) اقرأ دعاء القنوت (أدناه)، ثم اسجد وسلِّم.', tr: 'Son rekatta, i’tidal halindeyken (rükû’dan kalkınca) kunut duasını (aşağıda) okuyun, sonra secde edip selam verin.', ur: 'آخری رکعت میں اعتدال کی حالت میں (رکوع کے بعد) قنوت کی دعا (نیچے) پڑھیں، پھر سجدہ اور سلام۔' } },
    ],
    doa: QUNUT_DOA,
    desc: {
      id: 'Pada rakaat terakhir, saat i’tidal (setelah ruku’) disunnahkan membaca doa qunut Witir di bawah.',
      en: 'In the final rakaat, while in i’tidal (after ruku’) a Witr qunut supplication (below) is recited.',
      ar: 'في الركعة الأخيرة، عند الاعتدال (بعد الرفع من الركوع) يُستحبّ قراءة دعاء قنوت الوتر أدناه.',
      tr: 'Son rekatta, i’tidal halindeyken (rükû’dan kalkınca) aşağıdaki vitir kunut duasını okumak sünnettir.',
      ur: 'آخری رکعت میں اعتدال کی حالت میں (رکوع کے بعد) نیچے لکھی وتر کی قنوت پڑھنا سنت ہے۔'
    },
  },
  {
    id: 's-istikharah',
    page: 'istikharah',
    title: { id: 'Shalat Istikharah', en: 'Istikhara Prayer', ar: 'صلاة الاستخارة', tr: 'İstihare Namazı', ur: 'نمازِ استخارہ' },
    meta: { id: '2 rakaat · sunnah', en: '2 rakaat · sunnah', ar: 'ركعتان · سنة', tr: '2 rekat · sünnet', ur: 'دو رکعت · سنت' },
    when: { id: 'Saat bingung memilih di antara dua hal yang mubah.', en: 'When undecided between two permissible options.', ar: 'عند التردد بين أمرين مباحين.', tr: 'İki mübah seçenek arasında kararsız kalındığında.', ur: 'جب دو مباح کاموں کے درمیان انتخاب میں شک ہو۔' },
    niat: {
      arabic: 'أُصَلِّيْ سُنَّةَ الِاسْتِخَارَةِ رَكْعَتَيْنِ لِلَّهِ تَعَالَى',
      latin: 'Ushollii sunnatal istikhaarati rak’ataini lillaahi ta’aalaa',
      meaning: { id: 'Aku niat shalat sunnah Istikharah dua rakaat karena Allah Ta’ala.', en: 'I intend the sunnah Istikhara prayer of two rakaat, for Allah the Exalted.', ar: 'أصلّي سنة الاستخارة ركعتين لله تعالى.', tr: 'İstihare sünnet namazını, Allah Teâlâ için iki rekat olarak kılmaya niyet ettim.', ur: 'میں نے استخارہ کی سنت دو رکعت کی نیت کی، اللہ تعالیٰ کے لیے۔' },
      reference: { id: 'Lafaz niat — mazhab Syafi’i', en: 'Niyyah formula — Shafi’i school', ar: 'صيغة النية — مذهب الشافعية', tr: 'Niyet lafzı — Şafii mezhebi', ur: 'نیت کا صیغہ — مذہبِ شافعی' },
    },
    how: [
      { id: 'is-1', desc: { id: 'Kerjakan 2 rakaat; rakaat pertama Al-Fatihah + Al-Kafirun, rakaat kedua Al-Fatihah + Al-Ikhlas (dianjurkan).', en: 'Pray 2 rakaat; first rakaat Al-Fatihah + Al-Kafirun, second Al-Fatihah + Al-Ikhlas (recommended).', ar: 'صلِّ ركعتين؛ في الأولى الفاتحة والكافرون، وفي الثانية الفاتحة والإخلاص (يُستحب).', tr: 'İki rekat kılın; ilk rekatta Fatiha + Kâfirûn, ikinci rekatta Fatiha + İhlâs (müstehaptır).', ur: 'دو رکعت پڑھیں؛ پہلی رکعت میں الفاتحہ + کافرون، دوسری میں الفاتحہ + اخلاص (مستحب)۔' } },
      { id: 'is-2', desc: { id: 'Setelah salam, baca doa istikharah di bawah — sebut urusan Anda pada “haadzal amra”.', en: 'After salam, recite the istikhara supplication below — name your matter at “haadzal amra”.', ar: 'بعد السلام اقرأ دعاء الاستخارة أدناه — وسمِّ حاجتك عند قولك «هذا الأمر».', tr: 'Selamdan sonra aşağıdaki istihare duasını okuyun — “haadzal amra” derken işinizi belirtin.', ur: 'سلام کے بعد نیچے لکھی دعائے استخارہ پڑھیں — «هذا الأمر» کہتے وقت اپنا مقصود بیان کریں۔' } },
      { id: 'is-3', desc: { id: 'Lalu lanjutkan urusan sesuai apa yang dimudahkan Allah.', en: 'Then proceed with what Allah makes easy.', ar: 'ثم امضِ في أمرك حسب ما ييسّره الله.', tr: 'Sonra Allah’ın kolaylaştırdığı şekilde işinize devam edin.', ur: 'پھر اللہ جو آسان کر دے اسی کے مطابق کام آگے بڑھائیں۔' } },
    ],
    doa: {
      arabic:
        'اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ، وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ، وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ، فَإِنَّكَ تَقْدِرُ وَلَا أَقْدِرُ، وَتَعْلَمُ وَلَا أَعْلَمُ، وَأَنْتَ عَلَّامُ الْغُيُوبِ. اللَّهُمَّ إِنْ كُنْتَ تَعْلَمُ أَنَّ هَذَا الْأَمْرَ خَيْرٌ لِي فِي دِينِي وَمَعَاشِي وَعَاقِبَةِ أَمْرِي فَاقْدُرْهُ لِي وَيَسِّرْهُ لِي ثُمَّ بَارِكْ لِي فِيهِ، وَإِنْ كُنْتَ تَعْلَمُ أَنَّهُ شَرٌّ لِي فِي دِينِي وَمَعَاشِي وَعَاقِبَةِ أَمْرِي فَاصْرِفْهُ عَنِّي وَاصْرِفْنِي عَنْهُ، وَاقْدُرْ لِيَ الْخَيْرَ حَيْثُ كَانَ ثُمَّ أَرْضِنِي بِهِ',
      latin:
        'Allaahumma innii astakhiiruka bi’ilmik, wa astaqdiruka biqudratik, wa as’aluka min fadhlikal ‘azhiim, fa innaka taqdiru wa laa aqdir, wa ta’lamu wa laa a’lam, wa anta ‘allaamul ghuyub. Allaahumma in kunta ta’lamu anna haadzal amra khairul lii fii diinii wa ma’aasyi wa ‘aaqibati amrii faqdurhu lii wa yassirhu lii tsumma baarik lii fiih, wa in kunta ta’lamu annahu syarrul lii fii diinii wa ma’aasyi wa ‘aaqibati amrii fashrifhu ‘annii washrifnii ‘anhu, waqdur liyal khoiri haitsu kaana tsumma ardhinii bih.',
      meaning: {
        id: 'Ya Allah, sesungguhnya aku memohon pilihan yang baik kepada-Mu dengan ilmu-Mu, dan aku memohon kekuatan dengan kekuasaan-Mu, serta aku memohon sebagian karunia-Mu yang agung. Sesungguhnya Engkau Maha Kuasa sedang aku tidak kuasa, Engkau Maha Mengetahui sedang aku tidak mengetahui, dan Engkau Maha Mengetahui yang gaib. Ya Allah, apabila Engkau mengetahui bahwa urusan ini baik bagiku dalam agamaku, kehidupanku, dan akibat urusanku, maka takdirkanlah dan mudahkanlah untukku lalu berkati ia bagiku. Dan apabila Engkau mengetahui bahwa ia buruk bagiku dalam agamaku, kehidupanku, dan akibat urusanku, maka jauhkanlah ia dariku dan jauhkanlah aku darinya, serta takdirkanlah kebaikan untukku di mana pun ia berada, lalu jadikanlah aku ridha kepadanya.',
        en: 'O Allah, I seek Your guidance through Your knowledge, Your power through Your might, and I ask You of Your abundant bounty. You decree and I cannot; You know and I do not; You are the Knower of the unseen. O Allah, if You know that this matter is good for me in my religion, livelihood, and the outcome of my affair, then decree it and make it easy for me, then bless it for me. And if You know it is bad for me in my religion, livelihood, and the outcome of my affair, then turn it away from me and turn me away from it, and decree good for me wherever it is, then make me content with it.',
        ar: 'اللهم إني أستخيرك بعلمك، وأستقدرك بقدرتك، وأسألك من فضلك العظيم؛ فإنك تقدر ولا أقدر، وتعلم ولا أعلم، وأنت علام الغيوب. اللهم إن كنت تعلم أن هذا الأمر خير لي في ديني ومعاشي وعاقبة أمري فاقدره لي ويسّره لي ثم بارك لي فيه، وإن كنت تعلم أنه شر لي في ديني ومعاشي وعاقبة أمري فاصرفه عني واصرفني عنه، واقدر لي الخير حيث كان ثم ارضني به.',
        tr: 'Allah’ım! Hayrı Senin ilminle Senden diliyor, kudreti Senin kudretinle Senden istiyor ve büyük fazlından Senden diliyorum. Şüphesiz Sen hükmedersin, sana hükmedilmez; Sen bilirsin, ben bilmem; Sen gaybları hakkıyla bilensin. Allah’ım! Bu işin, dinimde, geçimimde ve işimin sonunda benim için hayırlı olduğunu biliyorsan, onu benim için takdir et, bana kolaylaştır ve onu benim için bereketli kıl. Bu işin, dinimde, geçimimde ve işimin sonunda benim için kötü olduğunu biliyorsan, onu benden uzaklaştır, beni de ondan uzaklaştır; hayır nerede olursa orada onu benim için takdir et, sonra beni onunla hoşnut eyle.',
        ur: 'اے اللہ! بے شک میں تیرے علم کے ذریعے تجھ سے بھلائی کا انتخاب چاہتا ہوں اور تیری قدرت کے ذریعے تجھ سے قدرت چاہتا ہوں، اور تجھ سے تیرے بڑے فضل میں سے مانگتا ہوں۔ بے شک تو ہی قدرت رکھتا ہے اور میں نہیں، تو ہی جانتا ہے اور میں نہیں جانتا، اور تو غیب کا خوب جاننے والا ہے۔ اے اللہ! اگر تو جانتا ہے کہ یہ کام میرے دین، میرے معاش اور میرے کام کے انجام کے لیے بھلا ہے تو اسے میرے لیے تقدیر فرما دے اور میرے لیے آسان کر دے، پھر اس میں مجھے برکت عطا فرما۔ اور اگر تو جانتا ہے کہ یہ کام میرے دین، میرے معاش اور میرے کام کے انجام کے لیے برا ہے تو اسے مجھ سے دور کر دے اور مجھے اس سے دور کر دے، اور جہاں کہیں بھلائی ہو وہ میرے لیے تقدیر فرما دے، پھر مجھے اس پر راضی کر دے۔'
      },
      reference: { id: 'HR. Bukhari', en: 'Bukhari', ar: 'رواه البخاري', tr: 'Buhârî', ur: 'بخاری' },
    },
  },
  {
    id: 's-hajat',
    page: 'hajat',
    title: { id: 'Shalat Hajat', en: 'Hajah Prayer', ar: 'صلاة الحاجة', tr: 'Hacet Namazı', ur: 'نمازِ حاجت' },
    meta: { id: '2 rakaat (atau lebih) · sunnah', en: '2 rakaat (or more) · sunnah', ar: 'ركعتان (أو أكثر) · سنة', tr: '2 rekat (veya daha fazla) · sünnet', ur: 'دو رکعت (یا زیادہ) · سنت' },
    when: { id: 'Saat punya kebutuhan/hajat dan memohon kepada Allah.', en: 'When you have a need and turn to Allah.', ar: 'عند وجود حاجة واللجوء إلى الله فيها.', tr: 'Bir ihtiyaç/hacet olup Allah’a yalvardığınızda.', ur: 'جب کوئی ضرورت یا حاجت ہو اور اللہ سے مانگنا چاہیں۔' },
    niat: {
      arabic: 'أُصَلِّيْ سُنَّةَ الْحَاجَةِ رَكْعَتَيْنِ لِلَّهِ تَعَالَى',
      latin: 'Ushollii sunnatal haajati rak’ataini lillaahi ta’aalaa',
      meaning: { id: 'Aku niat shalat sunnah Hajat dua rakaat karena Allah Ta’ala.', en: 'I intend the sunnah Hajah prayer of two rakaat, for Allah the Exalted.', ar: 'أصلّي سنة الحاجة ركعتين لله تعالى.', tr: 'Hacet sünnet namazını, Allah Teâlâ için iki rekat olarak kılmaya niyet ettim.', ur: 'میں نے حاجت کی سنت دو رکعت کی نیت کی، اللہ تعالیٰ کے لیے۔' },
      reference: { id: 'Lafaz niat — mazhab Syafi’i', en: 'Niyyah formula — Shafi’i school', ar: 'صيغة النية — مذهب الشافعية', tr: 'Niyet lafzı — Şafii mezhebi', ur: 'نیت کا صیغہ — مذہبِ شافعی' },
    },
    how: [
      { id: 'hj-1', desc: { id: 'Kerjakan 2 rakaat (atau lebih) dengan khusyuk.', en: 'Pray 2 rakaat (or more) with humility.', ar: 'صلِّ ركعتين (أو أكثر) بخشوع.', tr: 'Huşu içinde iki rekat (veya daha fazla) kılın.', ur: 'خشوع و خضوع کے ساتھ دو رکعت (یا زیادہ) ادا کریں۔' } },
      { id: 'hj-2', desc: { id: 'Setelah salam, menghadap kiblat, baca doa hajat di bawah dan sebut kebutuhan Anda.', en: 'After salam, face the qibla, recite the supplication below and state your need.', ar: 'بعد السلام، مستقبلًا القبلة، اقرأ دعاء الحاجة أدناه واذكر حاجتك.', tr: 'Selamdan sonra kıbleye yönelin, aşağıdaki hacet duasını okuyun ve ihtiyacınızı belirtin.', ur: 'سلام کے بعد قبلہ رخ ہو کر نیچے لکھی دعائے حاجت پڑھیں اور اپنی ضرورت بیان کریں۔' } },
    ],
    doa: DOA_HAJAT,
  },
  {
    id: 's-tarawih',
    page: 'tarawih',
    title: { id: 'Shalat Tarawih', en: 'Tarawih Prayer', ar: 'صلاة التراويح', tr: 'Teravih Namazı', ur: 'نمازِ تراویح' },
    meta: { id: '20 atau 8 rakaat (+ Witir) · sunnah (Ramadan)', en: '20 or 8 rakaat (+ Witr) · sunnah (Ramadan)', ar: '20 أو 8 ركعات (+ الوتر) · سنة (رمضان)', tr: '20 veya 8 rekat (+ vitir) · sünnet (Ramazan)', ur: '20 یا 8 رکعت (+ وتر) · سنت (رمضان)' },
    when: { id: 'Khusus malam bulan Ramadan, setelah Isya.', en: 'Only during Ramadan nights, after Isha.', ar: 'في ليالي رمضان فقط، بعد العشاء.', tr: 'Yalnızca Ramazan gecelerinde, Yatsı’dan sonra.', ur: 'صرف رمضان کی راتوں میں، عشاء کے بعد۔' },
    niat: {
      arabic: 'أُصَلِّيْ سُنَّةَ التَّرَاوِيْحِ رَكْعَتَيْنِ لِلَّهِ تَعَالَى',
      latin: 'Ushollii sunnatat taraawiihi rak’ataini lillaahi ta’aalaa',
      meaning: { id: 'Aku niat shalat sunnah Tarawih dua rakaat karena Allah Ta’ala.', en: 'I intend the sunnah Tarawih prayer of two rakaat, for Allah the Exalted.', ar: 'أصلّي سنة التراويح ركعتين لله تعالى.', tr: 'Teravih sünnet namazını, Allah Teâlâ için iki rekat olarak kılmaya niyet ettim.', ur: 'میں نے تراویح کی سنت دو رکعت کی نیت کی، اللہ تعالیٰ کے لیے۔' },
      reference: { id: 'Lafaz niat — mazhab Syafi’i', en: 'Niyyah formula — Shafi’i school', ar: 'صيغة النية — مذهب الشافعية', tr: 'Niyet lafzı — Şafii mezhebi', ur: 'نیت کا صیغہ — مذہبِ شافعی' },
    },
    how: [
      { id: 'tr-1', desc: { id: 'Khusus malam Ramadan, setelah Isya. 20 atau 8 rakaat (tiap 2 rakaat satu salam), diakhiri Witir.', en: 'Ramadan nights only, after Isha. 20 or 8 rakaat (salam every 2), ending with Witr.', ar: 'في ليالي رمضان بعد العشاء: عشرون أو ثماني ركعات (بسلامٍ كل ركعتين)، تُختم بالوتر.', tr: 'Yalnızca Ramazan gecelerinde, Yatsı’dan sonra. 20 veya 8 rekat (her iki rekatta bir selam), vitirle tamamlanır.', ur: 'صرف رمضان کی راتوں میں، عشاء کے بعد۔ 20 یا 8 رکعت (ہر دو رکعت پر ایک سلام)، اختتام وتر پر۔' } },
      { id: 'tr-2', desc: { id: 'Dianjurkan berjamaah di masjid bersama imam.', en: 'Recommended in congregation at the mosque, behind the imam.', ar: 'يُستحب جماعةً في المسجد خلف الإمام.', tr: 'Camihte imama uyarak cemaatle kılınması müstehaptır.', ur: 'مسجد میں امام کے پیچھے جماعت سے پڑھنا مستحب ہے۔' } },
    ],
  },
  {
    id: 's-taubat',
    page: 'taubat',
    title: { id: 'Shalat Taubat', en: 'Repentance Prayer', ar: 'صلاة التوبة', tr: 'Tövbe Namazı', ur: 'نمازِ توبہ' },
    meta: { id: '2 rakaat · sunnah', en: '2 rakaat · sunnah', ar: 'ركعتان · سنة', tr: '2 rekat · sünnet', ur: 'دو رکعت · سنت' },
    when: { id: 'Saat ingin bertaubat dan kembali kepada Allah.', en: 'When seeking to repent and return to Allah.', ar: 'عند إرادة التوبة والرجوع إلى الله.', tr: 'Tövbe edip Allah’a dönmek istediğinizde.', ur: 'جب توبہ کر کے اللہ کی طرف لوٹنا چاہیں۔' },
    niat: {
      arabic: 'أُصَلِّيْ سُنَّةَ التَّوْبَةِ رَكْعَتَيْنِ لِلَّهِ تَعَالَى',
      latin: 'Ushollii sunnatat taubati rak’ataini lillaahi ta’aalaa',
      meaning: { id: 'Aku niat shalat sunnah Taubat dua rakaat karena Allah Ta’ala.', en: 'I intend the sunnah Repentance prayer of two rakaat, for Allah the Exalted.', ar: 'أصلّي سنة التوبة ركعتين لله تعالى.', tr: 'Tövbe sünnet namazını, Allah Teâlâ için iki rekat olarak kılmaya niyet ettim.', ur: 'میں نے توبہ کی سنت دو رکعت کی نیت کی، اللہ تعالیٰ کے لیے۔' },
      reference: { id: 'Lafaz niat — mazhab Syafi’i', en: 'Niyyah formula — Shafi’i school', ar: 'صيغة النية — مذهب الشافعية', tr: 'Niyet lafzı — Şafii mezhebi', ur: 'نیت کا صیغہ — مذہبِ شافعی' },
    },
    how: [
      { id: 'tb-1', desc: { id: '2 rakaat dengan khusyuk; sesudah salam memohon ampun dan bertekad tidak mengulangi dosa.', en: '2 rakaat with humility; after salam, seek forgiveness and resolve not to repeat the sin.', ar: 'ركعتان بخشوع؛ وبعد السلام استغفر واعزم على عدم العودة إلى الذنب.', tr: 'Huşu içinde iki rekat; selamdan sonra bağışlanma dileyin ve günahı tekrarlamamaya karar verin.', ur: 'خشوع و خضوع کے ساتھ دو رکعت؛ سلام کے بعد مغفرت مانگیں اور گناہ دہرانے کا پکا ارادہ کریں۔' } },
    ],
    doa: {
      arabic: 'اللَّهُمَّ إِنِّي ظَلَمْتُ نَفْسِي ظُلْمًا كَثِيرًا وَلَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ فَاغْفِرْ لِي مَغْفِرَةً مِنْ عِنْدِكَ وَارْحَمْنِي إِنَّكَ أَنْتَ الْغَفُورُ الرَّحِيمُ',
      latin: 'Allaahumma innii zhalamtii nafsii zhulman katsiiran, wa laa yaghfirudz dzunuuba illaa anta, faghfir lii maghfiratan min ‘indik, warhamnii innaka antal ghafuurur rahiim',
      meaning: {
        id: 'Ya Allah, sungguh aku telah menzalimi diriku dengan kezaliman yang banyak, dan tidak ada yang mengampuni dosa kecuali Engkau. Maka ampunilah aku dengan ampunan dari sisi-Mu dan rahmatilah aku; sesungguhnya Engkau Maha Pengampun lagi Maha Penyayang.',
        en: 'O Allah, I have wronged myself greatly, and none forgives sins but You, so forgive me with a forgiveness from You and have mercy on me; You are the Forgiving, the Merciful.',
        ar: 'اللهم إني ظلمت نفسي ظلمًا كثيرًا، ولا يغفر الذنوب إلا أنت، فاغفر لي مغفرة من عندك وارحمني، إنك أنت الغفور الرحيم.',
        tr: 'Allah’ım! Ben gerçekten kendime çok zulmettim; günahları Senden başkası bağışlayamaz. Senin katından bir mağfiretle beni bağışla, bana merhamet et; şüphesiz Sen çok bağışlayansın, çok merhamet edensin.',
        ur: 'اے اللہ! بے شک میں نے اپنے اوپر بہت ظلم کیا ہے اور گناہوں کو کوئی نہیں بخشتا سوائے تیرے؛ پس مجھے اپنی طرف سے خاص مغفرت سے بخش دے اور مجھ پر رحم فرما؛ بے شک تو بڑا بخشنے والا، رحم والا ہے۔'
      },
      reference: { id: 'HR. Bukhari & Muslim', en: 'Bukhari & Muslim', ar: 'متفق عليه', tr: 'Buhârî ve Müslim', ur: 'بخاری و مسلم' },
    },
  },
  {
    id: 's-tasbih',
    page: 'tasbih',
    title: { id: 'Shalat Tasbih', en: 'Tasbih Prayer', ar: 'صلاة التسبيح', tr: 'Tesbih Namazı', ur: 'نمازِ تسبیح' },
    meta: { id: '4 rakaat · sunnah', en: '4 rakaat · sunnah', ar: 'أربع ركعات · سنة', tr: '4 rekat · sünnet', ur: 'چار رکعت · سنت' },
    when: { id: 'Dianjurkan minimal sekali seumur hidup; sering dikerjakan pada malam hari.', en: 'Recommended at least once in a lifetime; often prayed at night.', ar: 'يُستحب مرةً واحدة في العمر على الأقل، وتُصلّى غالبًا ليلًا.', tr: 'Ömürde en az bir kez kılınması müstehaptır; çoğunlukla gece kılınır.', ur: 'عمر بھر میں کم از کم ایک بار پڑھنا مستحب ہے؛ اکثر رات کو پڑھی جاتی ہے۔' },
    niat: {
      arabic: 'أُصَلِّيْ سُنَّةَ التَّسْبِيْحِ أَرْبَعَ رَكَعَاتٍ لِلَّهِ تَعَالَى',
      latin: 'Ushollii sunnatat tasbiihi arba’a raka’atin lillaahi ta’aalaa',
      meaning: { id: 'Aku niat shalat sunnah Tasbih empat rakaat karena Allah Ta’ala.', en: 'I intend the sunnah Tasbih prayer of four rakaat, for Allah the Exalted.', ar: 'أصلّي سنة التسبيح أربع ركعات لله تعالى.', tr: 'Tesbih sünnet namazını, Allah Teâlâ için dört rekat olarak kılmaya niyet ettim.', ur: 'میں نے تسبیح کی سنت چار رکعت کی نیت کی، اللہ تعالیٰ کے لیے۔' },
      reference: { id: 'Lafaz niat — mazhab Syafi’i', en: 'Niyyah formula — Shafi’i school', ar: 'صيغة النية — مذهب الشافعية', tr: 'Niyet lafzı — Şafii mezhebi', ur: 'نیت کا صیغہ — مذہبِ شافعی' },
    },
    how: [
      { id: 'ts-1', desc: { id: '4 rakaat. Bacaan tasbih (di bawah) diucapkan 15× setelah Al-Fatihah & surat, lalu 10× pada setiap posisi — ruku, i’tidal, sujud pertama, duduk antara dua sujud, sujud kedua, dan setelah mengangkat kepala dari sujud kedua — sehingga 75× per rakaat (total 300× dalam 4 rakaat).', en: '4 rakaat. The tasbih phrase (below) is recited 15× after Al-Fatihah & the surah, then 10× in each posture — bowing, i’tidal, first prostration, between prostrations, second prostration, and after raising the head from the second prostration — making 75× per rakaat (300× total across 4 rakaat).', ar: 'أربع ركعات. يُقال التسبيح (أدناه) 15 مرة بعد الفاتحة والسورة، ثم 10 مرات في كل موضع — الركوع والاعتدال والسجدة الأولى والجلوس بين السجدتين والسجدة الثانية وبعد رفع الرأس من الثانية — فيكون 75 مرة في الركعة (300 مرة في الأربع).', tr: 'Dört rekat. Tesbih cümlesi (aşağıda) Fatiha ve sureden sonra 15 kez, ardından her pozisyonda — rükû, i’tidal, ilk secde, iki secde arası oturuş, ikinci secde ve ikinci secdeden baş kaldırdıktan sonra — 10 kez söylenir; böylece her rekatta 75 kez (dört rekatta toplam 300 kez) olur.', ur: 'چار رکعت۔ تسبیح کے کلمے (نیچے) الفاتحہ اور سورۃ کے بعد 15 بار، پھر ہر موقع پر 10 بار — رکوع، اعتدال، پہلا سجدہ، دو سجدوں کے درمیان بیٹھنا، دوسرا سجدہ اور دوسرے سجدے سے سر اٹھانے کے بعد — اس طرح ہر رکعت میں 75 بار (چار رکعت میں کل 300 بار)۔' } },
    ],
    doa: {
      arabic: 'سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلَا إِلَهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ',
      latin: 'Subhaanallaah, walhamdu lillaah, wa laa ilaaha illallaah, wallaahu akbar (75× per rakaat ×4 = 300×)',
      meaning: {
        id: 'Maha Suci Allah, segala puji bagi Allah, tiada Tuhan selain Allah, Allah Maha Besar — dibaca 75× per rakaat (total 300× sepanjang 4 rakaat).',
        en: 'Glory to Allah, praise to Allah, there is no god but Allah, Allah is Greatest — recited 75× per rakaat (300× total across 4 rakaat).',
        ar: 'سبحان الله والحمد لله ولا إله إلا الله والله أكبر — تُقال 75 مرة في كل ركعة (300 مرة في الأربع ركعات).',
        tr: 'Allah noksan sıfatlardan uzaktır, hamd Allah’adır, Allah’tan başka ilah yoktur, Allah en büyüktür — her rekatta 75 kez (dört rekat boyunca toplam 300 kez) okunur.',
        ur: 'اللہ پاک ہے، تمام تعریفیں اللہ کے لیے ہیں، اللہ کے سوا کوئی معبود نہیں، اللہ سب سے بڑا ہے — ہر رکعت میں 75 بار (چار رکعت میں کل 300 بار) پڑھی جاتی ہے۔'
      },
      reference: { id: 'HR. Abu Dawud & At-Tirmidzi', en: 'Abu Dawud & At-Tirmidhi', ar: 'رواه أبو داود والترمذي', tr: 'Ebû Dâvûd ve Tirmizî', ur: 'ابوداؤد و ترمذی' },
    },
  },
  {
    id: 's-idul-fitri',
    page: 'idul-fitri',
    title: { id: 'Shalat Idul Fitri', en: 'Eid al-Fitr Prayer', ar: 'صلاة عيد الفطر', tr: 'Ramazan Bayramı Namazı', ur: 'نمازِ عید الفطر' },
    meta: { id: '2 rakaat · sunnah muakkadah (jamaah)', en: '2 rakaat · strongly emphasised (congregation)', ar: 'ركعتان · سنة مؤكدة (جماعة)', tr: '2 rekat · müekked sünnet (cemaatle)', ur: 'دو رکعت · سنتِ مؤکدہ (جماعت)' },
    when: { id: '1 Syawal, setelah matahari naik, sebelum zhuhur.', en: '1 Shawwal, after sunrise, before Dhuhr.', ar: 'الأول من شوال، بعد ارتفاع الشمس وقبل الظهر.', tr: '1 Şevval, güneş yükseldikten sonra, öğleden önce.', ur: 'یکم شوال، سورج بلند ہونے کے بعد، ظہر سے پہلے۔' },
    niat: {
      arabic: 'أُصَلِّيْ سُنَّةَ عِيْدِ الْفِطْرِ رَكْعَتَيْنِ مُسْتَقْبِلَ الْقِبْلَةِ لِلَّهِ تَعَالَى',
      latin: 'Ushollii sunnata ‘iidil fithri rak’ataini mustaqbilal qiblati lillaahi ta’aalaa',
      meaning: { id: 'Aku niat shalat sunnah Idul Fitri dua rakaat menghadap kiblat karena Allah Ta’ala.', en: 'I intend the sunnah Eid al-Fitr prayer of two rakaat, facing the qibla, for Allah the Exalted.', ar: 'أصلّي سنة عيد الفطر ركعتين مستقبل القبلة لله تعالى.', tr: 'Ramazan Bayramı sünnet namazını, kıbleye yönelerek, Allah Teâlâ için iki rekat olarak kılmaya niyet ettim.', ur: 'میں نے عید الفطر کی سنت دو رکعت کی نیت کی، منہ قبلے کی طرف، اللہ تعالیٰ کے لیے۔' },
      reference: { id: 'Lafaz niat — mazhab Syafi’i', en: 'Niyyah formula — Shafi’i school', ar: 'صيغة النية — مذهب الشافعية', tr: 'Niyet lafzı — Şafii mezhebi', ur: 'نیت کا صیغہ — مذہبِ شافعی' },
    },
    desc: {
      id: '7 takbir (selain takbiratul ihram) di rakaat pertama dan 5 takbir di rakaat kedua; diikuti khutbah.',
      en: '7 takbirs (besides the opening) in the first rakaat and 5 in the second; followed by a khutbah.',
      ar: 'سبع تكبيرات (سوى تكبيرة الإحرام) في الركعة الأولى وخمس في الثانية، تليها خطبة.',
      tr: 'İlk rekatta yedi, ikinci rekatta beş fazla tekbir (iftitah tekbiri hariç); ardından hutbe okunur.',
      ur: 'پہلی رکعت میں سات اضافی تکبیریں (تکبیرِ تحریمہ کے علاوہ) اور دوسری میں پانچ؛ اس کے بعد خطبہ ہوتا ہے۔'
    },
  },
  {
    id: 's-idul-adha',
    page: 'idul-adha',
    title: { id: 'Shalat Idul Adha', en: 'Eid al-Adha Prayer', ar: 'صلاة عيد الأضحى', tr: 'Kurban Bayramı Namazı', ur: 'نمازِ عید الاضحیٰ' },
    meta: { id: '2 rakaat · sunnah muakkadah (jamaah)', en: '2 rakaat · strongly emphasised (congregation)', ar: 'ركعتان · سنة مؤكدة (جماعة)', tr: '2 rekat · müekked sünnet (cemaatle)', ur: 'دو رکعت · سنتِ مؤکدہ (جماعت)' },
    when: { id: '10 Dzulhijjah, setelah matahari naik.', en: '10 Dhul-Hijjah, after sunrise.', ar: 'العاشر من ذي الحجة، بعد ارتفاع الشمس.', tr: '10 Zilhicce, güneş yükseldikten sonra.', ur: '10 ذوالحجہ، سورج بلند ہونے کے بعد۔' },
    niat: {
      arabic: 'أُصَلِّيْ سُنَّةَ عِيْدِ الْأَضْحَى رَكْعَتَيْنِ مُسْتَقْبِلَ الْقِبْلَةِ لِلَّهِ تَعَالَى',
      latin: 'Ushollii sunnata ‘iidil adh-haa rak’ataini mustaqbilal qiblati lillaahi ta’aalaa',
      meaning: { id: 'Aku niat shalat sunnah Idul Adha dua rakaat menghadap kiblat karena Allah Ta’ala.', en: 'I intend the sunnah Eid al-Adha prayer of two rakaat, facing the qibla, for Allah the Exalted.', ar: 'أصلّي سنة عيد الأضحى ركعتين مستقبل القبلة لله تعالى.', tr: 'Kurban Bayramı sünnet namazını, kıbleye yönelerek, Allah Teâlâ için iki rekat olarak kılmaya niyet ettim.', ur: 'میں نے عید الاضحیٰ کی سنت دو رکعت کی نیت کی، منہ قبلے کی طرف، اللہ تعالیٰ کے لیے۔' },
      reference: { id: 'Lafaz niat — mazhab Syafi’i', en: 'Niyyah formula — Shafi’i school', ar: 'صيغة النية — مذهب الشافعية', tr: 'Niyet lafzı — Şafii mezhebi', ur: 'نیت کا صیغہ — مذہبِ شافعی' },
    },
    desc: {
      id: 'Seperti shalat Idul Fitri; diikuti khutbah dan pelaksanaan qurban.',
      en: 'Like the Eid al-Fitr prayer; followed by a khutbah and the sacrifice.',
      ar: 'كصلاة عيد الفطر، تليها خطبة ثم نحر الأضاحي.',
      tr: 'Ramazan Bayramı namazı gibidir; ardından hutbe ve kurban kesimi gelir.',
      ur: 'نمازِ عید الفطر کی طرح؛ اس کے بعد خطبہ اور قربانی کی انجام دہی ہوتی ہے۔'
    },
  },
  {
    id: 's-janazah',
    page: 'janazah',
    title: { id: 'Shalat Jenazah', en: 'Funeral Prayer', ar: 'صلاة الجنازة', tr: 'Cenaze Namazı', ur: 'نمازِ جنازہ' },
    meta: { id: 'fardu kifayah · berdiri saja', en: 'communal obligation · standing only', ar: 'فرض كفاية · قيام فقط', tr: 'farz-ı kifaye · yalnızca kıyamda', ur: 'فرضِ کفایہ · صرف کھڑے ہو کر' },
    when: { id: 'Atas jenazah muslim, sebelum dimakamkan.', en: 'Over a deceased Muslim, before burial.', ar: 'على الميت المسلم قبل الدفن.', tr: 'Müslüman bir ölünün üzerine, definden önce.', ur: 'مسلمان میت پر، دفن سے پہلے۔' },
    niat: {
      arabic: 'أُصَلِّيْ عَلَى هَذِهِ الْجَنَازَةِ فَرْضَ الْكِفَايَةِ مُسْتَقْبِلَ الْقِبْلَةِ لِلَّهِ تَعَالَى',
      latin: 'Ushollii ‘alaa haadzihil janaazati fardhal kifaayati mustaqbilal qiblati lillaahi ta’aalaa',
      meaning: { id: 'Aku niat shalat atas jenazah ini, fardu kifayah, menghadap kiblat karena Allah Ta’ala.', en: 'I intend the funeral prayer over this deceased, a communal obligation, facing the qibla, for Allah the Exalted.', ar: 'أصلّي على هذه الجنازة فرض كفاية مستقبل القبلة لله تعالى.', tr: 'Bu cenaze üzerine, farz-ı kifaye olarak, kıbleye yönelmiş halde, Allah Teâlâ için namaz kılmaya niyet ettim.', ur: 'میں نے اس جنازہ پر نماز کی نیت کی، فرضِ کفایہ، منہ قبلے کی طرف، اللہ تعالیٰ کے لیے۔' },
      reference: { id: 'Lafaz niat — mazhab Syafi’i', en: 'Niyyah formula — Shafi’i school', ar: 'صيغة النية — مذهب الشافعية', tr: 'Niyet lafzı — Şafii mezhebi', ur: 'نیت کا صیغہ — مذہبِ شافعی' },
    },
    desc: {
      id: '4 takbir (tanpa ruku’/sujud): takbir 1 + Al-Fatihah; takbir 2 + shalawat; takbir 3 + doa jenazah; takbir 4 + doa, lalu salam.',
      en: '4 takbirs (no bowing/prostration): takbir 1 + Al-Fatihah; takbir 2 + salawat; takbir 3 + the funeral supplication; takbir 4 + supplication, then salam.',
      ar: 'أربع تكبيرات (بلا ركوع ولا سجود): الأولى مع الفاتحة، والثانية مع الصلاة على النبي، والثالثة مع دعاء الجنازة، والرابعة مع الدعاء ثم السلام.',
      tr: 'Dört tekbir (rükû ve secde yok): 1. tekbir + Fatiha; 2. tekbir + salavat; 3. tekbir + cenaze duası; 4. tekbir + dua, ardından selam.',
      ur: 'چار تکبیریں (بغیر رکوع و سجدہ): پہلی تکبیر + الفاتحہ؛ دوسری + درود؛ تیسری + دعائے جنازہ؛ چوتھی + دعا، پھر سلام۔'
    },
    doa: {
      arabic: 'اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ وَعَافِهِ وَاعْفُ عَنْهُ',
      latin: 'Allaahummaghfir lahu (laha) warhamhu (ha), wa ‘aafihi (ha), wa’fu ‘anhu (‘anhaa)',
      meaning: {
        id: 'Ya Allah, ampunilah dia, rahmatilah dia, berilah dia kesehatan, dan maafkanlah dia. (Gunakan lafaz perempuan bila jenazah perempuan.)',
        en: 'O Allah, forgive him (her), have mercy on him (her), grant him (her) well-being, and pardon him (her). (Use the feminine form for a female deceased.)',
        ar: 'اللهم اغفر له وارحمه وعافه واعف عنه. (تُؤنَّث الضمائر إذا كان الميت امرأة.)',
        tr: 'Allah’ım! Onu bağışla, ona merhamet et, ona âfiyet ver ve onu affet. (Ölen kadın olduğunda dişil lafızlar kullanılır.)',
        ur: 'اے اللہ! اسے بخش دے، اس پر رحم فرما، اسے عافیت عطا فرما اور اسے معاف کر دے۔ (میت عورت ہو تو مؤنث صیغے استعمال کریں۔)'
      },
      reference: { id: 'HR. Muslim', en: 'Muslim', ar: 'رواه مسلم', tr: 'Müslim', ur: 'مسلم' },
    },
  },
  {
    id: 's-kusuf',
    page: 'kusuf',
    title: { id: 'Shalat Kusuf (Gerhana)', en: 'Eclipse Prayer', ar: 'صلاة الكسوف', tr: 'Küsuf (Tutulma) Namazı', ur: 'نمازِ کسوف (گرہن)' },
    meta: { id: '2 rakaat · sunnah (jamaah)', en: '2 rakaat · sunnah (congregation)', ar: 'ركعتان · سنة (جماعة)', tr: '2 rekat · sünnet (cemaatle)', ur: 'دو رکعت · سنت (جماعت)' },
    when: { id: 'Saat terjadi gerhana matahari (kusuf) atau bulan (khusuf).', en: 'During a solar (kusuf) or lunar (khusuf) eclipse.', ar: 'عند كسوف الشمس أو خسوف القمر.', tr: 'Güneş (küsuf) veya ay (khusuf) tutulması gerçekleştiğinde.', ur: 'جب سورج گرہن (کسوف) یا چاند گرہن (خسوف) ہو جائے۔' },
    niat: {
      arabic: 'أُصَلِّيْ سُنَّةَ الْكُسُوْفِ رَكْعَتَيْنِ لِلَّهِ تَعَالَى',
      latin: 'Ushollii sunnatal kusuufi rak’ataini lillaahi ta’aalaa',
      meaning: { id: 'Aku niat shalat sunnah Kusuf (gerhana) dua rakaat karena Allah Ta’ala.', en: 'I intend the sunnah Eclipse prayer of two rakaat, for Allah the Exalted.', ar: 'أصلّي سنة الكسوف ركعتين لله تعالى.', tr: 'Küsuf (tutulma) sünnet namazını, Allah Teâlâ için iki rekat olarak kılmaya niyet ettim.', ur: 'میں نے کسوف (گرہن) کی سنت دو رکعت کی نیت کی، اللہ تعالیٰ کے لیے۔' },
      reference: { id: 'Lafaz niat — mazhab Syafi’i', en: 'Niyyah formula — Shafi’i school', ar: 'صيغة النية — مذهب الشافعية', tr: 'Niyet lafzı — Şafii mezhebi', ur: 'نیت کا صیغہ — مذہبِ شافعی' },
    },
    desc: {
      id: 'Dikerjakan berjamaah di masjid; setiap rakaat memiliki dua ruku’ (rukuk dua kali sebelum sujud).',
      en: 'Prayed in congregation at the mosque; each rakaat has two bowings (rukū twice before prostration).',
      ar: 'تُصلّى جماعةً في المسجد؛ في كل ركعة ركوعان (يركع مرتين قبل السجود).',
      tr: 'Camihte cemaatle kılınır; her rekatın iki rükûsu vardır (secdeden önce iki kez rükû yapılır).',
      ur: 'مسجد میں جماعت سے ادا کی جاتی ہے؛ ہر رکعت میں دو رکوع ہوتے ہیں (سجدے سے پہلے دو بار رکوع)۔'
    },
  },
  {
    id: 's-istisqa',
    page: 'istisqa',
    title: { id: 'Shalat Istisqa (Hujan)', en: 'Rain Prayer', ar: 'صلاة الاستسقاء', tr: 'İstiska (Yağmur) Namazı', ur: 'نمازِ استسقا (بارش کی دعا)' },
    meta: { id: '2 rakaat · sunnah (jamaah)', en: '2 rakaat · sunnah (congregation)', ar: 'ركعتان · سنة (جماعة)', tr: '2 rekat · sünnet (cemaatle)', ur: 'دو رکعت · سنت (جماعت)' },
    when: { id: 'Saat musim kemarau panjang, memohon turunnya hujan.', en: 'During prolonged drought, to ask Allah for rain.', ar: 'عند الجدب المطول، سؤالًا لله إنزال الغيث.', tr: 'Uzun süreli kuraklıkta, yağmurun yağması için Allah’a dua edildiğinde.', ur: 'طویل خشک سالی میں، بارش برسنے کے لیے اللہ سے دعا کرتے ہوئے۔' },
    niat: {
      arabic: 'أُصَلِّيْ سُنَّةَ الِاسْتِسْقَاءِ رَكْعَتَيْنِ لِلَّهِ تَعَالَى',
      latin: 'Ushollii sunnatal istisqaa-i rak’ataini lillaahi ta’aalaa',
      meaning: { id: 'Aku niat shalat sunnah Istisqa dua rakaat karena Allah Ta’ala.', en: 'I intend the sunnah Rain prayer of two rakaat, for Allah the Exalted.', ar: 'أصلّي سنة الاستسقاء ركعتين لله تعالى.', tr: 'İstiska sünnet namazını, Allah Teâlâ için iki rekat olarak kılmaya niyet ettim.', ur: 'میں نے استسقا کی سنت دو رکعت کی نیت کی، اللہ تعالیٰ کے لیے۔' },
      reference: { id: 'Lafaz niat — mazhab Syafi’i', en: 'Niyyah formula — Shafi’i school', ar: 'صيغة النية — مذهب الشافعية', tr: 'Niyet lafzı — Şafii mezhebi', ur: 'نیت کا صیغہ — مذہبِ شافعی' },
    },
    desc: {
      id: 'Dikerjakan berjamaah di tanah terbuka; diikuti khutbah dan doa memohon hujan.',
      en: 'Prayed in congregation in the open; followed by a khutbah and a supplication for rain.',
      ar: 'تُصلّى جماعةً في الصحراء؛ تليها خطبة ودعاء طلب المطر.',
      tr: 'Açık alanda cemaatle kılınır; ardından hutbe okunur ve yağmur duası yapılır.',
      ur: 'کھلے میدان میں جماعت سے ادا کی جاتی ہے؛ اس کے بعد خطبہ اور بارش کی دعا ہوتی ہے۔'
    },
  },
];
