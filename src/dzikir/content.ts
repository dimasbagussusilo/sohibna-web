import { useMemo } from 'react';
import { useI18n } from '@/context/I18nContext';
import type { Bi, Lang, Resolved } from './types';
import { DZIKIR_ITEMS } from './data';

const isBi = (x: unknown): x is Bi =>
  !!x && typeof x === 'object' && 'id' in x && 'en' in x && Object.keys(x).length === 2;

/** Deeply resolve every Bi leaf to a plain string for the active language. */
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

/** All dzikir/doa items resolved to the current app language. */
export function useDzikirContent() {
  const { lang } = useI18n();
  return useMemo(() => ({ items: resolve(DZIKIR_ITEMS, lang) }), [lang]);
}
