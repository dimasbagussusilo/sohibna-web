import type { Bi, Mazhab, MazhabTopic } from '../types';

// ============================================================================
// Where each school is popular — shown as a subtitle in the Mazhab dropdown.
// ============================================================================

export const MAZHAB_INFO: Record<Mazhab, { regions: Bi }> = {
  shafii: {
    regions: {
      id: 'Populer di Indonesia, Asia Tenggara, Mesir & Afrika Timur. Mayoritas umat Indonesia bermazhab Syafi’i.',
      en: 'Popular in Indonesia, Southeast Asia, Egypt & the Horn of Africa. Most Indonesian Muslims follow Shafi’i.',
    },
  },
  hanafi: {
    regions: {
      id: 'Paling banyak pengikut di dunia — Asia Selatan & Tengah, Turki, Levant.',
      en: 'Largest following worldwide — South & Central Asia, Turkey, the Levant.',
    },
  },
  maliki: {
    regions: {
      id: 'Populer di Afrika Utara & Barat (Maghreb, Nigeria, Senegal).',
      en: 'Popular in North & West Africa (Maghreb, Nigeria, Senegal).',
    },
  },
  hanbali: {
    regions: {
      id: 'Populer di Arab Saudi (Najd), Qatar, dan UEA.',
      en: 'Popular in Saudi Arabia (Najd), Qatar, and the UAE.',
    },
  },
};


// ============================================================================
// Section 3 — Perbandingan Mazhab: side-by-side views on the points where the
// four schools differ. Complements (does not replace) the per-mazhab flow in
// the Wajib section. Positions summarised faithfully; confirm nuance with a
// trusted scholar before relying on any single view.
// ============================================================================

export const MAZHAB_TOPICS: MazhabTopic[] = [
  {
    id: 'm-basmalah',
    title: { id: 'Basmalah dalam Al-Fatihah', en: 'Basmalah in Al-Fatihah' },
    summary: { id: 'Apakah بِسْمِ اللَّهِ dibaca keras, pelan, atau tidak dibaca?', en: 'Is بِسْمِ اللَّهِ recited aloud, silently, or not at all?' },
    views: {
      shafii: { id: 'Dibaca keras (jahr) pada shalat jahriyah; pelan pada sirriyah. Termasuk ayat Al-Fatihah.', en: 'Aloud (jahr) in audible prayers; silently in silent ones. Counted as part of Al-Fatihah.' },
      hanafi: { id: 'Dibaca pelan (sirr) di setiap shalat, termasuk yang jahriyah.', en: 'Recited silently (sirr) in every prayer, including audible ones.' },
      maliki: { id: 'Tidak dibaca dalam shalat fardu (menurut riwayat Imam Malik).', en: 'Not recited in obligatory prayer (per Imam Malik’s narration).' },
      hanbali: { id: 'Dibaca keras (jahr) pada shalat jahriyah; pelan pada sirriyah.', en: 'Aloud (jahr) in audible prayers; silently in silent ones.' },
    },
  },
  {
    id: 'm-amin',
    title: { id: 'Mengucapkan Aamin', en: 'Saying Ameen' },
    views: {
      shafii: { id: 'Keras (jahr) pada shalat jahriyah.', en: 'Aloud (jahr) in audible prayers.' },
      hanafi: { id: 'Pelan (sirr).', en: 'Silently (sirr).' },
      maliki: { id: 'Pelan (sirr).', en: 'Silently (sirr).' },
      hanbali: { id: 'Keras (jahr) pada shalat jahriyah.', en: 'Aloud (jahr) in audible prayers.' },
    },
  },
  {
    id: 'm-qunut',
    title: { id: 'Qunut pada Subuh', en: 'Qunut in Fajr' },
    views: {
      shafii: { id: 'Sunnah — pada i’tidal rakaat kedua Subuh.', en: 'Sunnah — at i’tidal of the second rakaat of Fajr.' },
      hanafi: { id: 'Tidak ada. Qunut hanya dalam shalat Witir.', en: 'None. Qunut is only in Witr prayer.' },
      maliki: { id: 'Sunnah — dibaca setelah ruku’ pada rakaat terakhir Subuh.', en: 'Sunnah — recited after ruku’ in the last rakaat of Fajr.' },
      hanbali: { id: 'Tidak ada, kecuali dalam keadaan khusus (nazilah).', en: 'None, except in special circumstances (nazilah).' },
    },
  },
  {
    id: 'm-tangan',
    title: { id: 'Posisi tangan setelah takbir', en: 'Hand position after takbir' },
    views: {
      shafii: { id: 'Sedekap (qabd) di atas dada.', en: 'Folded (qabd) on the chest.' },
      hanafi: { id: 'Sedekap (qabd) di bawah pusar.', en: 'Folded (qabd) below the navel.' },
      maliki: { id: 'Dilepas (sadl) — tangan menggantung di samping.', en: 'Released (sadl) — hands at the sides.' },
      hanbali: { id: 'Sedekap (qabd) di atas dada.', en: 'Folded (qabd) on the chest.' },
    },
  },
  {
    id: 'm-duduk',
    title: { id: 'Postur duduk', en: 'Sitting posture' },
    summary: { id: 'Iftirash vs tawarruk.', en: 'Iftirash vs tawarruk.' },
    views: {
      shafii: { id: 'Iftirash untuk duduk antara sujud & tasyahhud awal; tawarruk untuk tasyahhud akhir.', en: 'Iftirash between prostrations & first tashahhud; tawarruk for the final tashahhud.' },
      hanafi: { id: 'Tawarruk pada tasyahhud akhir.', en: 'Tawarruk in the final tashahhud.' },
      maliki: { id: 'Tawarruk untuk semua posisi duduk.', en: 'Tawarruk for all sittings.' },
      hanbali: { id: 'Iftirash untuk semua posisi duduk.', en: 'Iftirash for all sittings.' },
    },
  },
  {
    id: 'm-jari',
    title: { id: 'Jari telunjuk dalam tasyahhud', en: 'Index finger in tashahhud' },
    views: {
      shafii: { id: 'Diangkat & digerakkan saat “illallaah”.', en: 'Raised & moved at “illallah”.' },
      hanafi: { id: 'Diangkat saat “asyhadu allaa”, diturunkan saat “illallaah”; tidak digerakkan.', en: 'Raised at “asyhadu allaa”, lowered at “illallah”; not moved.' },
      maliki: { id: 'Digerakkan terus-menerus ke kanan-kiri.', en: 'Moved continuously side to side.' },
      hanbali: { id: 'Diangkat & ditunjuk; tidak digerakkan.', en: 'Raised & pointed; not moved.' },
    },
  },
  {
    id: 'm-surat',
    title: { id: 'Surat setelah Al-Fatihah', en: 'A surah after Al-Fatihah' },
    views: {
      shafii: { id: 'Sunnah (dianjurkan).', en: 'Sunnah (recommended).' },
      hanafi: { id: 'Wajib (fardhu ‘ain dalam tiap rakaat).', en: 'Wajib (obligatory in each rakaat).' },
      maliki: { id: 'Sunnah.', en: 'Sunnah.' },
      hanbali: { id: 'Tidak wajib; dianjurkan.', en: 'Not obligatory; recommended.' },
    },
  },
];
