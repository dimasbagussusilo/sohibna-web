import type { Lang } from './types';

// The backend stores Quran *content* (translations, tafsir, surah intros) in
// English, Indonesian, Turkish, and Urdu. There is no separate Arabic content
// layer, because Arabic is the scripture itself — so when the UI language is
// Arabic, Quran content falls back to English, which is more widely useful to
// Arabic readers than Indonesian. Used wherever a Quran content selector is
// fed the app's UI `Lang`.
export type ContentLang = 'en' | 'id' | 'tr' | 'ur';

export const contentLangFor = (lang: Lang): ContentLang =>
  lang === 'id' ? 'id' : lang === 'tr' ? 'tr' : lang === 'ur' ? 'ur' : 'en';

// Chapter intros + tafsir have NO Turkish or Urdu upstream (Maududi/King Fahad
// en/id only, Ibn Kathir en / Kemenag id) — collapse tr/ur onto English so
// those selectors keep their two-value caches instead of forking identical
// "en-in-Turkish/Urdu-locale" copies. (Tafsir itself now HAS Turkish and Urdu
// arms — resources 9334 / 160 — see tafsirLangFor below; intros stay en/id.)
export const enIdContentFor = (lang: Lang): 'en' | 'id' => (lang === 'id' ? 'id' : 'en');

// Tafsir language selector: unlike intros, tafsir HAS a Turkish arm
// (machine-translated Ibn Kathir, resource 9334) and an Urdu arm (Ibn Kathir,
// resource 160), so tr/ur keep their own tafsir language; en/id are unchanged.
// Used by the reader's fallbackTafsirLang (the TAFSIR row's language when
// every tafsir toggle is off).
export type TafsirLang = 'en' | 'id' | 'tr' | 'ur';
export const tafsirLangFor = (lang: Lang): TafsirLang =>
  lang === 'tr' || lang === 'ur' ? lang : enIdContentFor(contentLangFor(lang));
