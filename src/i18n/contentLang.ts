import type { Lang } from './types';

// The backend stores Quran *content* (translations, tafsir, surah intros) in
// English and Indonesian only — there is no separate Arabic content layer,
// because Arabic is the scripture itself. So when the UI language is Arabic,
// Quran content falls back to English, which is more widely useful to Arabic
// readers than Indonesian. Used wherever a Quran content selector (which only
// knows `en` | `id`) is fed the app's UI `Lang`.
export const contentLangFor = (lang: Lang): 'en' | 'id' => (lang === 'id' ? 'id' : 'en');
