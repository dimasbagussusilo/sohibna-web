// Mood → verse mapping for the Daily Reflection feature.
//
// Each mood has a curated pool of ~30 thematically-related ayah *keys* (all
// verified to resolve on api.quran.com). One is picked per day (see
// pickMoodVerse), so the reflection shows a different fitting verse each day.
// The Arabic + translation text is always fetched live (disk-cached) via
// fetchVerseByKey — only the keys live here, never the text.

import type { Verse } from '@/lib/quran';
import type { Lang } from '@/i18n/types';

export type MoodId = 'calm' | 'sad' | 'anxious' | 'tired';

// 30 ayah keys per mood. Many comfort verses suit more than one emotion, so the
// pools overlap by design — each mood just leans into its theme:
//   calm    → peace of heart, gratitude, remembrance, security
//   sad     → Allah's mercy, hope, not despairing, comfort
//   anxious → trust (tawakkul), ease with hardship, patience, courage
//   tired   → no burden beyond capacity, perseverance, relief, strength
export const MOOD_VERSES: Record<MoodId, string[]> = {
  calm: [
    '13:28', '48:4', '89:27', '89:28', '2:152', '2:186', '10:62',
    '41:30', '20:130', '50:16', '55:46', '57:4', '2:255', '24:35',
    '39:23', '33:41', '3:189', '7:56', '2:112', '6:125', '9:119',
    '20:46', '36:58', '14:7', '16:97', '29:69', '59:23', '67:13',
    '73:8', '94:1'
  ],
  sad: [
    '9:40', '12:86', '39:53', '93:3', '21:87', '12:87', '3:139',
    '8:46', '2:214', '40:60', '2:156', '2:157', '65:2', '65:3',
    '94:5', '94:6', '3:195', '7:156', '15:56', '21:88', '21:89',
    '21:90', '28:7', '33:43', '39:10', '42:25', '57:23', '64:11',
    '93:4', '93:5'
  ],
  anxious: [
    '3:173', '9:51', '9:129', '65:3', '8:62', '14:12', '20:46',
    '2:286', '3:159', '33:3', '39:38', '67:29', '10:107', '11:56',
    '11:88', '12:67', '25:58', '26:62', '27:62', '29:60', '36:82',
    '40:44', '58:10', '64:13', '73:9', '8:46', '2:249', '3:120',
    '13:31', '18:24'
  ],
  tired: [
    '2:286', '94:5', '94:6', '2:153', '39:10', '76:22', '18:107',
    '78:9', '2:250', '3:200', '11:115', '16:96', '23:62', '35:34',
    '35:35', '29:2', '29:69', '32:24', '33:35', '41:35', '42:43',
    '46:35', '47:31', '50:38', '52:48', '67:2', '70:5', '76:12',
    '90:4', '2:45'
  ]
};

// A per-mood offset so the four moods land on different ayah indices on the same
// day (more variety across moods), while each mood still rotates day to day.
const MOOD_OFFSET: Record<MoodId, number> = { calm: 0, sad: 7, anxious: 13, tired: 19 };

/**
 * Deterministic "verse of the day" for a mood: stable within a calendar day (so
 * it doesn't shuffle on every refresh), and different tomorrow. `dateKey` is the
 * "YYYY-MM-DD" reflection key (e.g. reflectionDateKey()). For a past day this
 * recomputes the same key that was shown then.
 */
export function pickMoodVerse(mood: MoodId, dateKey: string): string {
  const list = MOOD_VERSES[mood];
  const seed = parseInt(dateKey.replace(/-/g, ''), 10) || 0;
  return list[(seed + MOOD_OFFSET[mood]) % list.length] ?? '';
}

// Pick the translation matching the app language: id → Kemenag (33), else Saheeh
// International (20). Falls back to whatever translation the verse carries.
export function pickTranslation(v: Verse, lang: Lang): string {
  const want = lang === 'id' ? 33 : 20;
  const byRes = v.translations.find((tr) => tr.resource_id === want)?.text;
  return byRes ?? v.translations[0]?.text ?? '';
}
