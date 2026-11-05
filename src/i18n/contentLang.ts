import type { Lang } from './types';

// The backend stores Quran *content* (translations, tafsir, surah intros) in
// English, Indonesian, and Turkish. There is no separate Arabic content layer,
// because Arabic is the scripture itself — so when the UI language is Arabic,
// Quran content falls back to English, which is more widely useful to Arabic
// readers than Indonesian. Used wherever a Quran content selector (which only
// knows `en` | `id` | `tr`) is fed the app's UI `Lang`.
export type ContentLang = 'en' | 'id' | 'tr';

export const contentLangFor = (lang: Lang): ContentLang =>
  lang === 'id' ? 'id' : lang === 'tr' ? 'tr' : 'en';

// Chapter intros + tafsir have NO Turkish upstream (Maududi/King Fahad en/id
// only, Ibn Kathir en / Kemenag id) — collapse tr onto English so those
// selectors keep their two-value caches instead of forking a third, identical
// "en-in-Turkish-locale" copy.
export const enIdContentFor = (lang: Lang): 'en' | 'id' => (lang === 'id' ? 'id' : 'en');
