import type { ArabicItem } from '../types';

// ============================================================================
// Shared Arabic recitations used across the Wajib rukun flow and the Witir
// sunnah entry. Centralised so the dua text lives in exactly one place.
// Verify each Arabic/transliteration against a trusted source before shipping.
// ============================================================================

export const TAKBIR: ArabicItem = {
  arabic: 'اللَّهُ أَكْبَرُ',
  latin: 'Allaahu akbar',
  meaning: { id: 'Allah Maha Besar.', en: 'Allah is the Greatest.' },
  reference: { id: 'Takbiratul ihram (rukun shalat)', en: 'Takbiratul ihram (pillar of prayer)' },
};

export const DOA_IFTITAH: ArabicItem = {
  arabic:
    'اللَّهُ أَكْبَرُ كَبِيرًا، وَالْحَمْدُ لِلَّهِ كَثِيرًا، وَسُبْحَانَ اللَّهِ بُكْرَةً وَأَصِيلًا، وَجَّهْتُ وَجْهِيَ لِلَّذِي فَطَرَ السَّمَاوَاتِ وَالْأَرْضَ حَنِيفًا مُسْلِمًا وَمَا أَنَا مِنَ الْمُشْرِكِينَ، إِنَّ صَلَاتِي وَنُسُكِي وَمَحْيَايَ وَمَمَاتِي لِلَّهِ رَبِّ الْعَالَمِينَ، لَا شَرِيكَ لَهُ وَبِذَلِكَ أُمِرْتُ وَأَنَا مِنَ الْمُسْلِمِينَ',
  latin:
    'Allaahu akbar kabiiraa, wal hamdu lillaahi katsiiraa, wa subhaanallaahi bukratan wa ashiilaa. Wajjahtu wajhiya lilladzii fatharas samaawaati wal ardha haniifam muslimaw wa maa ana minal musyrikiin. Inna shalaatii wa nusukii wa mahyaaaya wa mamaatii lillaahi rabbil ‘aalamiin, laa syariika lah, wa bidzaalika umirtu wa ana minal muslimiin.',
  meaning: {
    id: 'Allah Maha Besar dengan kebesaran yang sempurna, segala puji bagi Allah dengan pujian yang banyak, dan Maha Suci Allah pagi dan petang. Aku hadapkan wajahku kepada Zat yang menciptakan langit dan bumi dalam keadaan hanif berserah diri, dan aku bukanlah termasuk orang musyrik. Sesungguhnya shalatku, ibadahku, hidupku, dan matiku hanya untuk Allah Tuhan semesta alam, tiada sekutu bagi-Nya. Demikianlah aku diperintahkan dan aku termasuk orang muslim.',
    en: 'Allah is the Greatest beyond measure, all praise is for Allah abundantly, and glory be to Allah morning and evening. I have turned my face to Him who created the heavens and the earth as a pure monotheist, and I am not of the polytheists. My prayer, my devotion, my life, and my death are for Allah, Lord of the worlds, with no partner. So I have been commanded, and I am of the Muslims.',
  },
  reference: { id: 'HR. Muslim', en: 'Muslim' },
};

export const TASBIH_RUKU: ArabicItem = {
  arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ وَبِحَمْدِهِ',
  latin: 'Subhaana rabbiyal ‘azhiimi wa bihamdih (3×)',
  meaning: { id: 'Maha Suci Tuhanku Yang Maha Agung dan dengan memuji-Nya.', en: 'Glory to my Lord, the Most Great, and praise to Him.' },
  reference: { id: 'HR. Abu Dawud & At-Tirmidzi', en: 'Abu Dawud & At-Tirmidhi' },
};

export const DOA_ITIDAL: ArabicItem = {
  arabic: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ، رَبَّنَا لَكَ الْحَمْدُ',
  latin: 'Sami’allaahu liman hamidah, rabbanaa lakal hamd',
  meaning: {
    id: 'Semoga Allah mendengar (menerima) orang yang memuji-Nya. Ya Tuhan kami, bagi-Mu segala puji.',
    en: 'Allah hears those who praise Him. Our Lord, to You be all praise.',
  },
  reference: { id: 'HR. Bukhari & Muslim', en: 'Bukhari & Muslim' },
};

export const TASBIH_SUJUD: ArabicItem = {
  arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى وَبِحَمْدِهِ',
  latin: 'Subhaana rabbiyal a’laa wa bihamdih (3×)',
  meaning: { id: 'Maha Suci Tuhanku Yang Maha Tinggi dan dengan memuji-Nya.', en: 'Glory to my Lord, the Most High, and praise to Him.' },
  reference: { id: 'HR. Abu Dawud & At-Tirmidzi', en: 'Abu Dawud & At-Tirmidhi' },
};

export const DOA_ANTARA_SUJUD: ArabicItem = {
  arabic: 'رَبِّ اغْفِرْ لِي وَارْحَمْنِي وَاجْبُرْنِي وَارْفَعْنِي وَارْزُقْنِي وَاهْدِنِي وَعَافِنِي وَاعْفُ عَنِّي',
  latin: 'Rabbighfirlii warhamnii wajburnii warfa’nii warzuqnii wahdinii wa’aafinii wa’fu ‘annii',
  meaning: {
    id: 'Ya Allah, ampunilah aku, rahmatilah aku, cukupkanlah kekuranganku, angkatlah derajatku, berilah aku rezeki, petunjuk, kesehatan, dan maafkanlah aku.',
    en: 'My Lord, forgive me, have mercy on me, cover my shortcomings, raise my rank, provide for me, guide me, grant me well-being, and pardon me.',
  },
  reference: { id: 'HR. Abu Dawud & At-Tirmidzi', en: 'Abu Dawud & At-Tirmidhi' },
};

export const TASYAHHUD: ArabicItem = {
  arabic:
    'التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
  latin:
    'At-tahiyyaatu lillaahi wash shalawaatu wath thayyibaat, assalaamu ‘alaika ayyuhan nabiyyu wa rahmatullaahi wa barakaatuh, assalaamu ‘alainaa wa ‘alaa ‘ibaadillaahish shaalihiin, asyhadu allaa ilaaha illallaah, wa asyhadu anna Muhammadan ‘abduhu wa rasuuluh.',
  meaning: {
    id: 'Semua penghormatan, doa, dan kebaikan hanya milik Allah. Semoga keselamatan, rahmat, dan keberkahan Allah terlimpah kepadamu wahai Nabi, dan semoga keselamatan terlimpah pula kepada kami dan hamba-hamba Allah yang saleh. Aku bersaksi tiada Tuhan selain Allah, dan bahwa Nabi Muhammad adalah hamba dan utusan-Nya.',
    en: 'All greetings, prayers, and good things belong to Allah. Peace, mercy, and blessings of Allah be upon you, O Prophet; peace be upon us and upon the righteous servants of Allah. I bear witness that there is no god but Allah, and that Muhammad is His servant and messenger.',
  },
  reference: { id: 'HR. Bukhari & Muslim', en: 'Bukhari & Muslim' },
};

export const SHALAWAT: ArabicItem = {
  arabic:
    'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ. اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ',
  latin:
    'Allaahumma shalli ‘alaa Muhammad, wa ‘alaa aali Muhammad, kamaa shallaita ‘alaa Ibrahiim, wa ‘alaa aali Ibrahiim, innaka hamiidum majiid. Allaahumma baarik ‘alaa Muhammad, wa ‘alaa aali Muhammad, kamaa baarakta ‘alaa Ibrahiim, wa ‘alaa aali Ibrahiim, innaka hamiidum majiid.',
  meaning: {
    id: 'Ya Allah, limpahkanlah rahmat kepada Nabi Muhammad dan keluarga Nabi Muhammad, sebagaimana Engkau merahmati Nabi Ibrahim dan keluarga Nabi Ibrahim. Sesungguhnya Engkau Maha Terpuji lagi Maha Mulia. Ya Allah, limpahkanlah keberkahan kepada Nabi Muhammad dan keluarganya, sebagaimana Engkau memberkahi Nabi Ibrahim dan keluarganya.',
    en: 'O Allah, send blessings upon Muhammad and the family of Muhammad, as You sent blessings upon Ibrahim and the family of Ibrahim. You are indeed Praiseworthy, Glorious. O Allah, bestow barakah upon Muhammad and the family of Muhammad, as You bestowed barakah upon Ibrahim and the family of Ibrahim.',
  },
  reference: { id: 'HR. Bukhari & Muslim (shalawat Ibrahimiyah)', en: 'Bukhari & Muslim (Ibrahimiyyah salawat)' },
};

export const SALAM: ArabicItem = {
  arabic: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ',
  latin: 'Assalaamu ‘alaikum wa rahmatullaah',
  meaning: {
    id: 'Semoga keselamatan dan rahmat Allah terlimpah kepada kalian.',
    en: 'Peace and mercy of Allah be upon you.',
  },
  reference: { id: 'HR. Bukhari & Muslim', en: 'Bukhari & Muslim' },
};

export const QUNUT_DOA: ArabicItem = {
  arabic:
    'اللَّهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ، وَعَافِنِي فِيمَنْ عَافَيْتَ، وَتَوَلَّنِي فِيمَنْ تَوَلَّيْتَ، وَبَارِكْ لِي فِيمَا أَعْطَيْتَ، وَقِنِي شَرَّ مَا قَضَيْتَ، فَإِنَّكَ تَقْضِي وَلَا يُقْضَى عَلَيْكَ، وَإِنَّهُ لَا يَذِلُّ مَنْ وَالَيْتَ، وَلَا يَعِزُّ مَنْ عَادَيْتَ، تَبَارَكْتَ رَبَّنَا وَتَعَالَيْتَ',
  latin:
    'Allaahumma-hdinii fiiman hadait, wa ‘aafinii fiiman ‘aafait, wa tawallanii fiiman tawallait, wa baarik lii fiimaa a’thait, wa qinii syarra maa qadhait, fa innaka taqdhi wa laa yuqdha ‘alaik, wa innahu laa yazillu man waalait, wa laa ya’izzu man ‘aadayt, tabaarakta rabbanaa wa ta’aalait.',
  meaning: {
    id: 'Ya Allah, berilah aku petunjuk sebagaimana orang yang telah Engkau beri petunjuk, berilah kesehatan sebagaimana orang yang Engkau beri kesehatan, lindungilah aku sebagaimana orang yang Engkau lindungi, berkatilah apa yang Engkau berikan kepadaku, dan jagakanlah aku dari keburukan apa yang Engkau tentukan. Sesungguhnya Engkau menetapkan dan tidak ada yang menetapkan atas-Mu. Tidaklah hina orang yang Engkau lindungi, dan tidaklah mulia orang yang Engkau musuhi. Maha Suci Engkau wahai Tuhan kami dan Maha Tinggi.',
    en: 'O Allah, guide me among those You have guided, grant me well-being among those You have granted well-being, take me into Your care among those You have taken into Your care, bless for me what You have given, and protect me from the evil You have decreed. For You decree and none decrees upon You. None is humiliated whom You befriend, and none is honored whom You take as an enemy. Blessed are You, our Lord, and Exalted.',
  },
  reference: { id: 'HR. An-Nasa-i & At-Tirmidzi', en: 'An-Nasa-i & At-Tirmidhi' },
};
