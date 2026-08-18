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

// --- Per-mazhab helper: build a variant map from one desc per mazhab --------
const vary = (byMazhab: Record<Mazhab, string>): Partial<Record<Mazhab, Body>> => {
  const out = {} as Partial<Record<Mazhab, Body>>;
  (Object.keys(byMazhab) as Mazhab[]).forEach((m) => {
    out[m] = { desc: { id: byMazhab[m], en: byMazhab[m] } };
  });
  return out;
};

export const RUKUN_STEPS: Step[] = [
  {
    id: 'r-niat',
    shared: {
      title: { id: 'Niat', en: 'Intention' },
      desc: {
        id: 'Berniat shalat di hati (dilafazkan dalam tradisi Syafi’i), lalu takbir.',
        en: 'Intend the prayer in the heart (verbalised in the Shafi’i tradition), then make takbir.',
      },
    },
  },
  {
    id: 'r-takbir',
    shared: {
      title: { id: 'Takbiratul Ihram', en: 'Takbiratul Ihram' },
      desc: {
        id: 'Mengangkat kedua tangan sejajar telinga/bahu, lalu mengucapkan takbir sambil niat.',
        en: 'Raise both hands level with the ears/shoulders, then say the takbir along with the intention.',
      },
      ...TAKBIR,
    },
  },
  {
    id: 'r-tangan',
    shared: { title: { id: 'Posisi tangan setelah takbir', en: 'Hand position after takbir' } },
    variants: vary({
      shafii: 'Sedekapkan kedua tangan di atas dada (qabd): tangan kanan di atas punggung tangan kiri.',
      hanafi: 'Sedekapkan kedua tangan (qabd) di bawah pusar: tangan kanan melingkari punggung tangan kiri.',
      maliki: 'Kedua tangan dibiarkan tergantung lurus di samping (sadl), tidak disedekap.',
      hanbali: 'Sedekapkan kedua tangan di atas dada (qabd): tangan kanan di atas punggung tangan kiri.',
    }),
  },
  {
    id: 'r-berdiri',
    shared: {
      title: { id: 'Berdiri & membaca doa iftitah', en: 'Standing & opening supplication' },
      desc: {
        id: 'Berdiri tegak (bagi yang mampu), lalu membaca doa iftitah (sunnah).',
        en: 'Stand upright (if able), then read the iftitah opening supplication (sunnah).',
      },
      ...DOA_IFTITAH,
    },
  },
  {
    id: 'r-fatihah',
    shared: {
      title: { id: 'Membaca Al-Fatihah', en: 'Recite Al-Fatihah' },
      desc: {
        id: 'Membaca surat Al-Fatihah — rukun shalat di setiap rakaat.',
        en: 'Recite Surah Al-Fatihah — a pillar of prayer in every rakaat.',
      },
    },
  },
  {
    id: 'r-basmalah',
    shared: {
      title: { id: 'Membaca Basmalah', en: 'Reciting the Basmalah' },
      arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      latin: 'Bismillaahir rahmaanir rahiim',
      meaning: { id: 'Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang.', en: 'In the name of Allah, the Most Gracious, the Most Merciful.' },
    },
    variants: vary({
      shafii: 'Dibaca dengan suara keras (jahr) pada shalat jahriyah (Subuh, Maghrib, Isya) dan pelan pada sirriyah. Termasuk bagian Al-Fatihah.',
      hanafi: 'Dibaca pelan (sirr) pada setiap shalat, termasuk yang jahriyah.',
      maliki: 'Tidak dibaca dalam shalat fardu — baik pelan maupun keras — menurut riwayat Imam Malik.',
      hanbali: 'Dibaca dengan suara keras (jahr) pada shalat jahriyah dan pelan pada sirriyah.',
    }),
  },
  {
    id: 'r-amin',
    shared: {
      title: { id: 'Mengucapkan Aamin', en: 'Saying Ameen' },
      arabic: 'آمِين',
      latin: 'Aamin',
      meaning: { id: 'Kabulkanlah (doaku), ya Allah.', en: 'O Allah, answer (my prayer).' },
    },
    variants: vary({
      shafii: 'Diucapkan dengan suara keras (jahr) pada shalat jahriyah.',
      hanafi: 'Diucapkan secara pelan (sirr).',
      maliki: 'Diucapkan secara pelan (sirr).',
      hanbali: 'Diucapkan dengan suara keras (jahr) pada shalat jahriyah.',
    }),
  },
  {
    id: 'r-surat',
    shared: {
      title: { id: 'Membaca surat (setelah Al-Fatihah)', en: 'Recite a surah (after Al-Fatihah)' },
      desc: {
        id: 'Membaca surat pendek dari Al-Qur’an (sunnah menurut Syafi’i & Maliki; wajib menurut Hanafi).',
        en: 'Recite a short surah from the Qur’an (sunnah per Shafi’i & Maliki; obligatory per Hanafi).',
      },
    },
  },
  {
    id: 'r-ruku',
    shared: {
      title: { id: 'Ruku’', en: 'Bowing (Ruku’)' },
      desc: {
        id: 'Membungkuk hingga punggung lurus dan datar, tangan memegang lutut, lalu membaca tasbih.',
        en: 'Bow until the back is straight and level, hands gripping the knees, then recite the tasbih.',
      },
      ...TASBIH_RUKU,
    },
  },
  {
    id: 'r-itidal',
    shared: {
      title: { id: 'I’tidal', en: 'Standing from bowing (I’tidal)' },
      desc: {
        id: 'Bangun tegak dari ruku’ sambil membaca doa i’tidal dengan tuma’ninah.',
        en: 'Rise straight from ruku’ reciting the i’tidal supplication, with stillness.',
      },
      ...DOA_ITIDAL,
    },
  },
  {
    id: 'r-qunut',
    shared: {
      title: { id: 'Qunut Subuh', en: 'Subuh Qunut' },
      ...QUNUT_DOA,
    },
    variants: vary({
      shafii: 'Disunnahkan membaca doa qunut pada i’tidal rakaat kedua Subuh (qunut subuh).',
      maliki: 'Disunnahkan qunut pada rakaat terakhir Subuh, dibaca setelah ruku’.',
      hanafi: 'Tidak ada qunut pada Subuh. Qunut hanya dibaca dalam shalat Witir.',
      hanbali: 'Tidak ada qunut pada Subuh, kecuali dalam keadaan khusus (seperti saat turun azab).',
    }),
  },
  {
    id: 'r-sujud',
    shared: {
      title: { id: 'Sujud', en: 'Prostration (Sujud)' },
      desc: {
        id: 'Sujud dengan tujuh anggota (dahi+hidung, dua telapak tangan, dua lutut, dua ujung kaki) menyentuh lantai, lalu membaca tasbih.',
        en: 'Prostrate with seven parts (forehead+nose, two palms, two knees, two feet-tips) on the floor, then recite the tasbih.',
      },
      ...TASBIH_SUJUD,
    },
  },
  {
    id: 'r-duduk-antara',
    shared: {
      title: { id: 'Duduk di antara dua sujud', en: 'Sitting between the two prostrations' },
      desc: {
        id: 'Bangun dari sujud dan duduk sebentar (tuma’ninah), lalu membaca doa.',
        en: 'Rise from prostration and sit briefly (stillness), then recite the supplication.',
      },
      ...DOA_ANTARA_SUJUD,
    },
  },
  {
    id: 'r-postur-duduk',
    shared: { title: { id: 'Postur duduk', en: 'Sitting posture' } },
    variants: vary({
      shafii: 'Iftirash (duduk di atas telapak kaki kiri, kaki kanan tegak) untuk duduk antara dua sujud & tasyahhud awal; tawarruk untuk tasyahhud akhir.',
      hanafi: 'Tawarruk (mengeluarkan kaki kiri ke samping dan duduk di atas pantat) pada tasyahhud akhir.',
      maliki: 'Tawarruk untuk semua posisi duduk.',
      hanbali: 'Iftirash (duduk di atas kaki kiri, kaki kanan tegak) untuk semua posisi duduk.',
    }),
  },
  {
    id: 'r-tasyahhud',
    shared: {
      title: { id: 'Tasyahhud', en: 'Tashahhud' },
      desc: {
        id: 'Dibaca pada duduk akhir (dan duduk awal pada rakaat kedua shalat lebih dari dua rakaat).',
        en: 'Recited in the final sitting (and the first sitting in the second rakaat of prayers longer than two).',
      },
      ...TASYAHHUD,
    },
  },
  {
    id: 'r-jari',
    shared: { title: { id: 'Jari telunjuk dalam tasyahhud', en: 'Index finger during tashahhud' } },
    variants: vary({
      shafii: 'Mengangkat jari telunjuk dan menggerakkannya saat mengucapkan “illallaah”.',
      hanafi: 'Mengangkat telunjuk saat “asyhadu allaa” dan menurunkannya saat “illallaah”, tanpa digerakkan.',
      maliki: 'Menggerakkan jari telunjuk terus-menerus ke kanan-kiri sepanjang tasyahhud.',
      hanbali: 'Menunjuk dengan jari telunjuk yang terangkat, tanpa menggerakkannya.',
    }),
  },
  {
    id: 'r-shalawat',
    shared: {
      title: { id: 'Shalawat Ibrahimiyah', en: 'Salawat Ibrahimiyah' },
      desc: {
        id: 'Dibaca setelah tasyahhud akhir, sebelum salam.',
        en: 'Recited after the final tashahhud, before the salam.',
      },
      ...SHALAWAT,
    },
  },
  {
    id: 'r-salam',
    shared: {
      title: { id: 'Salam', en: 'Salam' },
      desc: {
        id: 'Menengok ke kanan lalu ke kiri sambil mengucapkan salam — menutup shalat.',
        en: 'Turn to the right then left while saying salam — closing the prayer.',
      },
      ...SALAM,
    },
  },
];

/** The 5 obligatory prayers. Niats follow the Shafi’i verbalised convention. */
export const FARD_PRAYERS: FardPrayer[] = [
  {
    id: 'subuh',
    title: { id: 'Subuh', en: 'Fajr (Subuh)' },
    rakaat: 2,
    note: {
      id: '2 rakaat — shalat jahriyah (bacaan keras). Tambahkan “imaaman” jika jadi imam atau “ma’muuman” jika jadi makmum.',
      en: '2 rakaat — audible prayer. Add “imaaman” if leading or “ma’muuman” if following.',
    },
    niat: {
      arabic: 'أُصَلِّيْ فَرْضَ الصُّبْحِ رَكْعَتَيْنِ مُسْتَقْبِلَ الْقِبْلَةِ لِلَّهِ تَعَالَى',
      latin: 'Ushollii fardhash shubhi rak’ataini mustaqbilal qiblati lillaahi ta’aalaa',
      meaning: {
        id: 'Aku niat shalat fardu Subuh dua rakaat menghadap kiblat karena Allah Ta’ala.',
        en: 'I intend the obligatory Subuh prayer of two rakaat, facing the qibla, for Allah the Exalted.',
      },
      reference: { id: 'Lafaz niat — mazhab Syafi’i', en: 'Niyyah formula — Shafi’i school' },
    },
  },
  {
    id: 'dzuhur',
    title: { id: 'Dzuhur', en: 'Dhuhr (Dzuhur)' },
    rakaat: 4,
    note: {
      id: '4 rakaat — shalat sirriyah (bacaan pelan).',
      en: '4 rakaat — silent prayer.',
    },
    niat: {
      arabic: 'أُصَلِّيْ فَرْضَ الظُّهْرِ أَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ لِلَّهِ تَعَالَى',
      latin: 'Ushollii fardhazh zhuhri arba’a raka’atin mustaqbilal qiblati lillaahi ta’aalaa',
      meaning: {
        id: 'Aku niat shalat fardu Dzuhur empat rakaat menghadap kiblat karena Allah Ta’ala.',
        en: 'I intend the obligatory Dzuhur prayer of four rakaat, facing the qibla, for Allah the Exalted.',
      },
      reference: { id: 'Lafaz niat — mazhab Syafi’i', en: 'Niyyah formula — Shafi’i school' },
    },
  },
  {
    id: 'ashar',
    title: { id: 'Ashar', en: 'Asr (Ashar)' },
    rakaat: 4,
    note: {
      id: '4 rakaat — shalat sirriyah (bacaan pelan).',
      en: '4 rakaat — silent prayer.',
    },
    niat: {
      arabic: 'أُصَلِّيْ فَرْضَ الْعَصْرِ أَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ لِلَّهِ تَعَالَى',
      latin: 'Ushollii fardhal ‘ashri arba’a raka’atin mustaqbilal qiblati lillaahi ta’aalaa',
      meaning: {
        id: 'Aku niat shalat fardu Ashar empat rakaat menghadap kiblat karena Allah Ta’ala.',
        en: 'I intend the obligatory Ashar prayer of four rakaat, facing the qibla, for Allah the Exalted.',
      },
      reference: { id: 'Lafaz niat — mazhab Syafi’i', en: 'Niyyah formula — Shafi’i school' },
    },
  },
  {
    id: 'maghrib',
    title: { id: 'Maghrib', en: 'Maghrib' },
    rakaat: 3,
    note: {
      id: '3 rakaat — shalat jahriyah (bacaan keras).',
      en: '3 rakaat — audible prayer.',
    },
    niat: {
      arabic: 'أُصَلِّيْ فَرْضَ الْمَغْرِبِ ثَلَاثَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ لِلَّهِ تَعَالَى',
      latin: 'Ushollii fardhal maghribi tsalaasa raka’atin mustaqbilal qiblati lillaahi ta’aalaa',
      meaning: {
        id: 'Aku niat shalat fardu Maghrib tiga rakaat menghadap kiblat karena Allah Ta’ala.',
        en: 'I intend the obligatory Maghrib prayer of three rakaat, facing the qibla, for Allah the Exalted.',
      },
      reference: { id: 'Lafaz niat — mazhab Syafi’i', en: 'Niyyah formula — Shafi’i school' },
    },
  },
  {
    id: 'isya',
    title: { id: 'Isya', en: 'Isha (Isya)' },
    rakaat: 4,
    note: {
      id: '4 rakaat — shalat jahriyah (bacaan keras).',
      en: '4 rakaat — audible prayer.',
    },
    niat: {
      arabic: 'أُصَلِّيْ فَرْضَ الْعِشَاءِ أَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ لِلَّهِ تَعَالَى',
      latin: 'Ushollii fardhal ‘isyaa-i arba’a raka’atin mustaqbilal qiblati lillaahi ta’aalaa',
      meaning: {
        id: 'Aku niat shalat fardu Isya empat rakaat menghadap kiblat karena Allah Ta’ala.',
        en: 'I intend the obligatory Isya prayer of four rakaat, facing the qibla, for Allah the Exalted.',
      },
      reference: { id: 'Lafaz niat — mazhab Syafi’i', en: 'Niyyah formula — Shafi’i school' },
    },
  },
];
