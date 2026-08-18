import type { Lang } from './types';

// Each UI language rendered in its OWN name (endonym), so the language picker
// reads identically no matter which language is active — Arabic is always
// "العربية", never the translated "Arabic" / "Bahasa Arab". Languages are
// proper nouns, not localizable copy.
export const langName: Record<Lang, string> = {
  id: 'Bahasa Indonesia',
  en: 'English',
  ar: 'العربية',
};
