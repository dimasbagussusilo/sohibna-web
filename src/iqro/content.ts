import { useMemo } from 'react';
import { useI18n } from '@/context/I18nContext';
import type { Bi, Lang, Resolved } from './types';
import {
  V1_FAMILIES,
  V2_WORDS,
  V3_RULES,
  V4_RULES,
  HARAKAT_SIGNS,
  LONG_VOWELS,
  HAMZAH_FORMS,
} from './data';

// A Bi value has exactly these two keys. Used to detect translatable leaves
// during the deep resolve walk.
const isBi = (x: unknown): x is Bi =>
  !!x &&
  typeof x === 'object' &&
  'id' in x &&
  'en' in x &&
  Object.keys(x).length === 2;

/**
 * Deeply resolve every Bi leaf in a data tree to a plain string for the given
 * language. Lets components keep reading `letter.anatomy` as a string while the
 * underlying data stays bilingual.
 */
export function resolve<T>(node: T, lang: Lang): Resolved<T> {
  if (isBi(node)) {
    return (lang === 'en' ? node.en : node.id) as Resolved<T>;
  }
  if (Array.isArray(node)) {
    return node.map((n) => resolve(n, lang)) as Resolved<T>;
  }
  if (node && typeof node === 'object') {
    const out: Record<string, unknown> = {};
    for (const key in node) {
      out[key] = resolve((node as Record<string, unknown>)[key], lang);
    }
    return out as Resolved<T>;
  }
  return node as Resolved<T>;
}

/** All Iqro datasets resolved to the current app language. */
export function useIqroContent() {
  const { lang } = useI18n();
  return useMemo(
    () => ({
      families: resolve(V1_FAMILIES, lang),
      joinWords: resolve(V2_WORDS, lang),
      signRules: resolve(V3_RULES, lang),
      tajwidRules: resolve(V4_RULES, lang),
      harakatSigns: resolve(HARAKAT_SIGNS, lang),
      longVowels: resolve(LONG_VOWELS, lang),
      hamzahForms: resolve(HAMZAH_FORMS, lang),
    }),
    [lang],
  );
}
