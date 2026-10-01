import type { Body, FardPrayer, Mazhab, Step } from '../types';
import {
  DOA_ANTARA_SUJUD,
  DOA_IFTITAH,
  DOA_ITIDAL,
  QUNUT_DOA,
  SALAM,
  SHALAWAT,
  TAKBIR,
  TASBIH_RUKU,
  TASBIH_SUJUD,
  TASYAHHUD,
} from './recitations';

// ============================================================================
// Section 2 — Shalat Wajib: the rukun/movement flow + the 5 daily prayers.
// The flow is the universal sequence (shared). Six steps where the four mazhab
// genuinely differ carry per-mazhab `variants` — switching the Mazhab dropdown
// re-renders those steps. Niats follow the Shafi'i verbalised convention (the
// app's default); other mazhab internalise the intention — see the section note.
// ============================================================================

// --- Per-mazhab helper: build a variant map from one desc per mazhab.
// Each desc is a [id, en, ar] triple.
const vary = (byMazhab: Record<Mazhab, [string, string, string]>): Partial<Record<Mazhab, Body>> => {
  const out = {} as Partial<Record<Mazhab, Body>>;
  (Object.keys(byMazhab) as Mazhab[]).forEach((m) => {
    const [id, en, ar] = byMazhab[m];
    out[m] = { desc: { id, en, ar } };
  });
  return out;
};

export const RUKUN_STEPS: Step[] = [
  {
    id: 'r-niat',
    shared: {
      title: { id: 'Niat', en: 'Intention', ar: 'النيّة' },
      desc: {
        id: 'Berniat shalat di hati (dilafazkan dalam tradisi Syafi’i), lalu takbir.',
        en: 'Intend the prayer in the heart (verbalised in the Shafi’i tradition), then make takbir.',
        ar: 'انوِ الصلاة بقلبك (وتُلفَظ في عادة الشافعية)، ثم كبِّر.',
      },
    },
  },
  {
    id: 'r-takbir',
    shared: {
      title: { id: 'Takbiratul Ihram', en: 'Takbiratul Ihram', ar: 'تكبيرة الإحرام' },
      desc: {
        id: 'Mengangkat kedua tangan sejajar telinga/bahu, lalu mengucapkan takbir sambil niat.',
        en: 'Raise both hands level with the ears/shoulders, then say the takbir along with the intention.',
        ar: 'ارفع يديك حذو الأذنين/الكتفين، ثم قل «الله أكبر» مع النية.',
      },
      ...TAKBIR,
    },
  },
  {
    id: 'r-tangan',
    shared: { title: { id: 'Posisi tangan setelah takbir', en: 'Hand position after takbir', ar: 'وضع اليدين بعد التكبير' } },
    variants: vary({
      shafii: [
        'Sedekapkan kedua tangan di atas dada (qabd): tangan kanan di atas punggung tangan kiri.',
        'Fold both hands on the chest (qabd): the right hand over the back of the left.',
        'ضع اليدين مثنيتين على الصدر (قبض): اليد اليمنى على ظهر اليسرى.',
      ],
      hanafi: [
        'Sedekapkan kedua tangan (qabd) di bawah pusar: tangan kanan melingkari punggung tangan kiri.',
        'Fold both hands (qabd) below the navel: the right hand wraps the back of the left.',
        'ضع اليدين مثنيتين (قبض) تحت السرّة: اليد اليمنى تحيط بظهر اليسرى.',
      ],
      maliki: [
        'Kedua tangan dibiarkan tergantung lurus di samping (sadl), tidak disedekap.',
        'Both hands are left hanging straight at the sides (sadl), not folded.',
        'تُرسَل اليديان مدلاة على الجانبين (سدل) دون قبض.',
      ],
      hanbali: [
        'Sedekapkan kedua tangan di atas dada (qabd): tangan kanan di atas punggung tangan kiri.',
        'Fold both hands on the chest (qabd): the right hand over the back of the left.',
        'ضع اليدين مثنيتين على الصدر (قبض): اليد اليمنى على ظهر اليسرى.',
      ],
    }),
  },
  {
    id: 'r-berdiri',
    shared: {
      title: { id: 'Berdiri & membaca doa iftitah', en: 'Standing & opening supplication', ar: 'القيام وقراءة دعاء الاستفتاح' },
      desc: {
        id: 'Berdiri tegak (bagi yang mampu), lalu membaca doa iftitah (sunnah).',
        en: 'Stand upright (if able), then read the iftitah opening supplication (sunnah).',
        ar: 'قف معتدلًا (إن استطعت)، ثم اقرأ دعاء الاستفتاح (سنة).',
      },
      ...DOA_IFTITAH,
    },
  },
  {
    id: 'r-fatihah',
    shared: {
      title: { id: 'Membaca Al-Fatihah', en: 'Recite Al-Fatihah', ar: 'قراءة الفاتحة' },
      desc: {
        id: 'Membaca surat Al-Fatihah — rukun shalat di setiap rakaat.',
        en: 'Recite Surah Al-Fatihah — a pillar of prayer in every rakaat.',
        ar: 'قراءة سورة الفاتحة — ركن في الصلاة في كل ركعة.',
      },
    },
  },
  {
    id: 'r-basmalah',
    shared: {
      title: { id: 'Membaca Basmalah', en: 'Reciting the Basmalah', ar: 'قراءة البسملة' },
      arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      latin: 'Bismillaahir rahmaanir rahiim',
      meaning: { id: 'Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang.', en: 'In the name of Allah, the Most Gracious, the Most Merciful.', ar: 'بسم الله الرحمن الرحيم.' },
    },
    variants: vary({
      shafii: [
        'Dibaca dengan suara keras (jahr) pada shalat jahriyah (Subuh, Maghrib, Isya) dan pelan pada sirriyah. Termasuk bagian Al-Fatihah.',
        'Recited aloud (jahr) in the audible prayers (Subuh, Maghrib, Isya) and silently in the silent ones. It is part of Al-Fatihah.',
        'تُقرأ جهرًا في الصلوات الجهرية (الفجر والمغرب والعشاء) وسرًّا في السرية، وهي جزء من الفاتحة.',
      ],
      hanafi: [
        'Dibaca pelan (sirr) pada setiap shalat, termasuk yang jahriyah.',
        'Recited silently (sirr) in every prayer, including the audible ones.',
        'تُقرأ سرًّا في كل الصلوات، بما فيها الجهرية.',
      ],
      maliki: [
        'Tidak dibaca dalam shalat fardu — baik pelan maupun keras — menurut riwayat Imam Malik.',
        'Not recited in the obligatory prayer — neither silently nor aloud — per the narration of Imam Malik.',
        'لا تُقرأ في صلاة الفرض — لا سرًّا ولا جهرًا — على المشهور من رواية الإمام مالك.',
      ],
      hanbali: [
        'Dibaca dengan suara keras (jahr) pada shalat jahriyah dan pelan pada sirriyah.',
        'Recited aloud (jahr) in the audible prayers and silently in the silent ones.',
        'تُقرأ جهرًا في الصلوات الجهرية وسرًّا في السرية.',
      ],
    }),
  },
  {
    id: 'r-amin',
    shared: {
      title: { id: 'Mengucapkan Aamin', en: 'Saying Ameen', ar: 'قول آمين' },
      arabic: 'آمِين',
      latin: 'Aamin',
      meaning: { id: 'Kabulkanlah (doaku), ya Allah.', en: 'O Allah, answer (my prayer).', ar: 'اللهم استجب.' },
    },
    variants: vary({
      shafii: [
        'Diucapkan dengan suara keras (jahr) pada shalat jahriyah.',
        'Said aloud (jahr) in the audible prayers.',
        'تُقال جهرًا في الصلوات الجهرية.',
      ],
      hanafi: [
        'Diucapkan secara pelan (sirr).',
        'Said silently (sirr).',
        'تُقال سرًّا.',
      ],
      maliki: [
        'Diucapkan secara pelan (sirr).',
        'Said silently (sirr).',
        'تُقال سرًّا.',
      ],
      hanbali: [
        'Diucapkan dengan suara keras (jahr) pada shalat jahriyah.',
        'Said aloud (jahr) in the audible prayers.',
        'تُقال جهرًا في الصلوات الجهرية.',
      ],
    }),
  },
  {
    id: 'r-surat',
    shared: {
      title: { id: 'Membaca surat (setelah Al-Fatihah)', en: 'Recite a surah (after Al-Fatihah)', ar: 'قراءة سورة (بعد الفاتحة)' },
      desc: {
        id: 'Membaca surat pendek dari Al-Qur’an (sunnah menurut Syafi’i & Maliki; wajib menurut Hanafi).',
        en: 'Recite a short surah from the Qur’an (sunnah per Shafi’i & Maliki; obligatory per Hanafi).',
        ar: 'قراءة سورة قصيرة من القرآن (سنة عند الشافعية والمالكية؛ واجبة عند الحنفية).',
      },
    },
  },
  {
    id: 'r-ruku',
    shared: {
      title: { id: 'Ruku’', en: 'Bowing (Ruku’)', ar: 'الركوع' },
      desc: {
        id: 'Membungkuk hingga punggung lurus dan datar, tangan memegang lutut, lalu membaca tasbih.',
        en: 'Bow until the back is straight and level, hands gripping the knees, then recite the tasbih.',
        ar: 'انحنِ حتى يستوي ظهرك ويستقر، وامسك الركبتين، ثم اقرأ التسبيح.',
      },
      ...TASBIH_RUKU,
    },
  },
  {
    id: 'r-itidal',
    shared: {
      title: { id: 'I’tidal', en: 'Standing from bowing (I’tidal)', ar: 'الاعتدال من الركوع' },
      desc: {
        id: 'Bangun tegak dari ruku’ sambil membaca doa i’tidal dengan tuma’ninah.',
        en: 'Rise straight from ruku’ reciting the i’tidal supplication, with stillness.',
        ar: 'قم معتدلًا من الركوع قارئًا دعاء الاعتدال مع الطمأنينة.',
      },
      ...DOA_ITIDAL,
    },
  },
  {
    id: 'r-qunut',
    shared: {
      title: { id: 'Qunut Subuh', en: 'Subuh Qunut', ar: 'قنوت الفجر' },
      ...QUNUT_DOA,
    },
    variants: vary({
      shafii: [
        'Disunnahkan membaca doa qunut pada i’tidal rakaat kedua Subuh (qunut subuh).',
        'Reciting the qunut supplication in the i’tidal of Subuh’s second rakaat is recommended (qunut subuh).',
        'يُستحبّ قراءة دعاء القنوت في اعتدال الركعة الثانية من الفجر (قنوت الفجر).',
      ],
      maliki: [
        'Disunnahkan qunut pada rakaat terakhir Subuh, dibaca setelah ruku’.',
        'Qunut in the last rakaat of Subuh is recommended, recited after the ruku’.',
        'يُستحبّ القنوت في الركعة الأخيرة من الفجر، ويُقرأ بعد الرفع من الركوع.',
      ],
      hanafi: [
        'Tidak ada qunut pada Subuh. Qunut hanya dibaca dalam shalat Witir.',
        'There is no qunut in Subuh; qunut is recited only in the Witr prayer.',
        'لا قنوت في الفجر؛ إنما يُقرأ القنوت في صلاة الوتر.',
      ],
      hanbali: [
        'Tidak ada qunut pada Subuh, kecuali dalam keadaan khusus (seperti saat turun azab).',
        'No qunut in Subuh, except in special circumstances (such as times of calamity).',
        'لا قنوت في الفجر إلا في أحوال خاصة (كنزول البلاء).',
      ],
    }),
  },
  {
    id: 'r-sujud',
    shared: {
      title: { id: 'Sujud', en: 'Prostration (Sujud)', ar: 'السجود' },
      desc: {
        id: 'Sujud dengan tujuh anggota (dahi+hidung, dua telapak tangan, dua lutut, dua ujung kaki) menyentuh lantai, lalu membaca tasbih.',
        en: 'Prostrate with seven parts (forehead+nose, two palms, two knees, two feet-tips) on the floor, then recite the tasbih.',
        ar: 'اسجد على سبعة أعضاء (الجبهة مع الأنف، والكفين، والركبتين، وأطراف القدمين) على الأرض، ثم اقرأ التسبيح.',
      },
      ...TASBIH_SUJUD,
    },
  },
  {
    id: 'r-duduk-antara',
    shared: {
      title: { id: 'Duduk di antara dua sujud', en: 'Sitting between the two prostrations', ar: 'الجلوس بين السجدتين' },
      desc: {
        id: 'Bangun dari sujud dan duduk sebentar (tuma’ninah), lalu membaca doa.',
        en: 'Rise from prostration and sit briefly (stillness), then recite the supplication.',
        ar: 'ارفع رأسك من السجود واجلس قليلًا (طمأنينة)، ثم اقرأ الدعاء.',
      },
      ...DOA_ANTARA_SUJUD,
    },
  },
  {
    id: 'r-postur-duduk',
    shared: { title: { id: 'Postur duduk', en: 'Sitting posture', ar: 'هيئة الجلوس' } },
    variants: vary({
      shafii: [
        'Iftirash (duduk di atas telapak kaki kiri, kaki kanan tegak) untuk duduk antara dua sujud & tasyahhud awal; tawarruk untuk tasyahhud akhir.',
        'Iftirash (sitting on the left foot, right foot upright) between prostrations & the first tashahhud; tawarruk for the final tashahhud.',
        'افتراش (الجلوس على القدم اليسرى ونصب اليمنى) بين السجدتين وفي التشهد الأول، وتورّك في التشهد الأخير.',
      ],
      hanafi: [
        'Tawarruk (mengeluarkan kaki kiri ke samping dan duduk di atas pantat) pada tasyahhud akhir.',
        'Tawarruk (left foot out to the side, sitting on the buttocks) in the final tashahhud.',
        'تورّك (إخراج القدم اليسرى والجلوس على الأليتين) في التشهد الأخير.',
      ],
      maliki: [
        'Tawarruk untuk semua posisi duduk.',
        'Tawarruk for all sittings.',
        'تورّك في جميع الجلسات.',
      ],
      hanbali: [
        'Iftirash (duduk di atas kaki kiri, kaki kanan tegak) untuk semua posisi duduk.',
        'Iftirash (sitting on the left foot, right foot upright) for all sittings.',
        'افتراش (الجلوس على القدم اليسرى ونصب اليمنى) في جميع الجلسات.',
      ],
    }),
  },
  {
    id: 'r-tasyahhud',
    shared: {
      title: { id: 'Tasyahhud', en: 'Tashahhud', ar: 'التشهد' },
      desc: {
        id: 'Dibaca pada duduk akhir (dan duduk awal pada rakaat kedua shalat lebih dari dua rakaat).',
        en: 'Recited in the final sitting (and the first sitting in the second rakaat of prayers longer than two).',
        ar: 'يُقرأ في الجلوس الأخير (وفي الجلوس الأول في الركعة الثانية لما زاد على ركعتين).',
      },
      ...TASYAHHUD,
    },
  },
  {
    id: 'r-jari',
    shared: { title: { id: 'Jari telunjuk dalam tasyahhud', en: 'Index finger during tashahhud', ar: 'السبابة في التشهد' } },
    variants: vary({
      shafii: [
        'Mengangkat jari telunjuk dan menggerakkannya saat mengucapkan “illallaah”.',
        'Raise the index finger and move it when saying “illallaah”.',
        'يُرفع السبابة ويُحرَّك عند قول: «إلا الله».',
      ],
      hanafi: [
        'Mengangkat telunjuk saat “asyhadu allaa” dan menurunkannya saat “illallaah”, tanpa digerakkan.',
        'Raise the index finger at “asyhadu allaa” and lower it at “illallaah”, without moving it.',
        'تُرفع السبابة عند «أشهد أن لا» وتُخفض عند «إلا الله» دون تحريك.',
      ],
      maliki: [
        'Menggerakkan jari telunjuk terus-menerus ke kanan-kiri sepanjang tasyahhud.',
        'Move the index finger continuously side to side throughout the tashahhud.',
        'يُحرَّك السبابة يمينًا ويسارًا باستمرار في جميع التشهد.',
      ],
      hanbali: [
        'Menunjuk dengan jari telunjuk yang terangkat, tanpa menggerakkannya.',
        'Point with the raised index finger, without moving it.',
        'يُشار بالسبابة المرفوعة دون تحريكها.',
      ],
    }),
  },
  {
    id: 'r-shalawat',
    shared: {
      title: { id: 'Shalawat Ibrahimiyah', en: 'Salawat Ibrahimiyah', ar: 'الصلاة الإبراهيمية' },
      desc: {
        id: 'Dibaca setelah tasyahhud akhir, sebelum salam.',
        en: 'Recited after the final tashahhud, before the salam.',
        ar: 'تُقرأ بعد التشهد الأخير قبل السلام.',
      },
      ...SHALAWAT,
    },
  },
  {
    id: 'r-salam',
    shared: {
      title: { id: 'Salam', en: 'Salam', ar: 'السلام' },
      desc: {
        id: 'Menengok ke kanan lalu ke kiri sambil mengucapkan salam — menutup shalat.',
        en: 'Turn to the right then left while saying salam — closing the prayer.',
        ar: 'يُسلِّم عن يمينه ثم عن يساره قائلًا السلام — به تُختَم الصلاة.',
      },
      ...SALAM,
    },
  },
];

/** The 5 obligatory prayers. Niats follow the Shafi’i verbalised convention. */
export const FARD_PRAYERS: FardPrayer[] = [
  {
    id: 'subuh',
    title: { id: 'Subuh', en: 'Fajr (Subuh)', ar: 'الفجر' },
    rakaat: 2,
    note: {
      id: '2 rakaat — shalat jahriyah (bacaan keras). Tambahkan “imaaman” jika jadi imam atau “ma’muuman” jika jadi makmum.',
      en: '2 rakaat — audible prayer. Add “imaaman” if leading or “ma’muuman” if following.',
      ar: 'ركعتان — صلاة جهرية. أضف «إمامًا» إن كنت إمامًا أو «مأمومًا» إن كنت مأمومًا.',
    },
    niat: {
      arabic: 'أُصَلِّيْ فَرْضَ الصُّبْحِ رَكْعَتَيْنِ مُسْتَقْبِلَ الْقِبْلَةِ لِلَّهِ تَعَالَى',
      latin: 'Ushollii fardhash shubhi rak’ataini mustaqbilal qiblati lillaahi ta’aalaa',
      meaning: {
        id: 'Aku niat shalat fardu Subuh dua rakaat menghadap kiblat karena Allah Ta’ala.',
        en: 'I intend the obligatory Subuh prayer of two rakaat, facing the qibla, for Allah the Exalted.',
        ar: 'أصلّي فرض الصبح ركعتين مستقبل القبلة لله تعالى.',
      },
      reference: { id: 'Lafaz niat — mazhab Syafi’i', en: 'Niyyah formula — Shafi’i school', ar: 'صيغة النية — مذهب الشافعية' },
    },
  },
  {
    id: 'dzuhur',
    title: { id: 'Dzuhur', en: 'Dhuhr (Dzuhur)', ar: 'الظهر' },
    rakaat: 4,
    note: {
      id: '4 rakaat — shalat sirriyah (bacaan pelan).',
      en: '4 rakaat — silent prayer.',
      ar: 'أربع ركعات — صلاة سرية.',
    },
    niat: {
      arabic: 'أُصَلِّيْ فَرْضَ الظُّهْرِ أَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ لِلَّهِ تَعَالَى',
      latin: 'Ushollii fardhazh zhuhri arba’a raka’atin mustaqbilal qiblati lillaahi ta’aalaa',
      meaning: {
        id: 'Aku niat shalat fardu Dzuhur empat rakaat menghadap kiblat karena Allah Ta’ala.',
        en: 'I intend the obligatory Dzuhur prayer of four rakaat, facing the qibla, for Allah the Exalted.',
        ar: 'أصلّي فرض الظهر أربع ركعات مستقبل القبلة لله تعالى.',
      },
      reference: { id: 'Lafaz niat — mazhab Syafi’i', en: 'Niyyah formula — Shafi’i school', ar: 'صيغة النية — مذهب الشافعية' },
    },
  },
  {
    id: 'ashar',
    title: { id: 'Ashar', en: 'Asr (Ashar)', ar: 'العصر' },
    rakaat: 4,
    note: {
      id: '4 rakaat — shalat sirriyah (bacaan pelan).',
      en: '4 rakaat — silent prayer.',
      ar: 'أربع ركعات — صلاة سرية.',
    },
    niat: {
      arabic: 'أُصَلِّيْ فَرْضَ الْعَصْرِ أَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ لِلَّهِ تَعَالَى',
      latin: 'Ushollii fardhal ‘ashri arba’a raka’atin mustaqbilal qiblati lillaahi ta’aalaa',
      meaning: {
        id: 'Aku niat shalat fardu Ashar empat rakaat menghadap kiblat karena Allah Ta’ala.',
        en: 'I intend the obligatory Ashar prayer of four rakaat, facing the qibla, for Allah the Exalted.',
        ar: 'أصلّي فرض العصر أربع ركعات مستقبل القبلة لله تعالى.',
      },
      reference: { id: 'Lafaz niat — mazhab Syafi’i', en: 'Niyyah formula — Shafi’i school', ar: 'صيغة النية — مذهب الشافعية' },
    },
  },
  {
    id: 'maghrib',
    title: { id: 'Maghrib', en: 'Maghrib', ar: 'المغرب' },
    rakaat: 3,
    note: {
      id: '3 rakaat — shalat jahriyah (bacaan keras).',
      en: '3 rakaat — audible prayer.',
      ar: 'ثلاث ركعات — صلاة جهرية.',
    },
    niat: {
      arabic: 'أُصَلِّيْ فَرْضَ الْمَغْرِبِ ثَلَاثَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ لِلَّهِ تَعَالَى',
      latin: 'Ushollii fardhal maghribi tsalaasa raka’atin mustaqbilal qiblati lillaahi ta’aalaa',
      meaning: {
        id: 'Aku niat shalat fardu Maghrib tiga rakaat menghadap kiblat karena Allah Ta’ala.',
        en: 'I intend the obligatory Maghrib prayer of three rakaat, facing the qibla, for Allah the Exalted.',
        ar: 'أصلّي فرض المغرب ثلاث ركعات مستقبل القبلة لله تعالى.',
      },
      reference: { id: 'Lafaz niat — mazhab Syafi’i', en: 'Niyyah formula — Shafi’i school', ar: 'صيغة النية — مذهب الشافعية' },
    },
  },
  {
    id: 'isya',
    title: { id: 'Isya', en: 'Isha (Isya)', ar: 'العشاء' },
    rakaat: 4,
    note: {
      id: '4 rakaat — shalat jahriyah (bacaan keras).',
      en: '4 rakaat — audible prayer.',
      ar: 'أربع ركعات — صلاة جهرية.',
    },
    niat: {
      arabic: 'أُصَلِّيْ فَرْضَ الْعِشَاءِ أَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ لِلَّهِ تَعَالَى',
      latin: 'Ushollii fardhal ‘isyaa-i arba’a raka’atin mustaqbilal qiblati lillaahi ta’aalaa',
      meaning: {
        id: 'Aku niat shalat fardu Isya empat rakaat menghadap kiblat karena Allah Ta’ala.',
        en: 'I intend the obligatory Isya prayer of four rakaat, facing the qibla, for Allah the Exalted.',
        ar: 'أصلّي فرض العشاء أربع ركعات مستقبل القبلة لله تعالى.',
      },
      reference: { id: 'Lafaz niat — mazhab Syafi’i', en: 'Niyyah formula — Shafi’i school', ar: 'صيغة النية — مذهب الشافعية' },
    },
  },
];
