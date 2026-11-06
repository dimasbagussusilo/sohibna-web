import type { Lang } from './types';

// Each UI language rendered in its OWN name (endonym), so the language picker
// reads identically no matter which language is active — Arabic is always
// "العربية", never the translated "Arabic" / "Bahasa Arab". Languages are
// proper nouns, not localizable copy.
export const langName: Record<Lang, string> = {
  id: 'Bahasa Indonesia',
  en: 'English',
  ar: 'العربية',
  tr: 'Türkçe',
  ur: 'اردو',
};

// Languages still marked experimental in the pickers (badge next to the
// name). Remove from this list once the native-speaker review gate passes.
export const experimentalLangs: readonly Lang[] = ['ur'];
export const isExperimentalLang = (lang: Lang): boolean => experimentalLangs.includes(lang);
