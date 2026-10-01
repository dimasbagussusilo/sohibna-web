import { useMemo } from 'react';
import { useI18n } from '@/context/I18nContext';
import type { Bi, Body, Lang, Mazhab, Resolved, Step } from './types';
import {
  FARD_PRAYERS,
  GHUSL_NIATS,
  GHUSL_STEPS,
  MAZHAB_INFO,
  MAZHAB_TOPICS,
  PEMBATANG_SHALAT,
  RUKUN_STEPS,
  SUNNAH,
  SUNNAH_WUDHU,
  TAYAMUM,
  TAYAMUM_NIAT,
  WUDHU,
  WUDHU_AFTER_DOA,
  WUDHU_BREAKERS,
  WUDHU_NIAT,
} from './data';

// A Bi leaf has exactly these three keys. Used to detect translatable leaves
// during the deep resolve walk.
const isBi = (x: unknown): x is Bi =>
  !!x &&
  typeof x === 'object' &&
  'id' in x &&
  'en' in x &&
  'ar' in x &&
  Object.keys(x).length === 3;

/**
 * Deeply resolve every Bi leaf in a data tree to a plain string for the given
 * language. Same approach as src/iqro/content.ts — lets components read
 * `step.title` as a string while the underlying data stays trilingual.
 */
export function resolve<T>(node: T, lang: Lang): Resolved<T> {
  if (isBi(node)) {
    return node[lang] as Resolved<T>;
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

/**
 * Returns the resolved Body for a step in the given mazhab. A step can carry a
 * `shared` body (title + recitation common to all mazhab) and `variants`
 * holding only the points that differ — the two are MERGED, so variant entries
 * need only specify the fields they override (typically `desc`).
 */
export function pickBody(step: Resolved<Step>, mazhab: Mazhab): Resolved<Body> {
  const shared = (step.shared ?? {}) as Partial<Resolved<Body>>;
  const v = step.variants?.[mazhab] as Partial<Resolved<Body>> | undefined;
  return { ...shared, ...(v ?? {}) } as Resolved<Body>;
}

/** All Shalat datasets resolved to the current app language. */
export function useShalatContent() {
  const { lang } = useI18n();
  return useMemo(
    () => ({
      wudhu: resolve(WUDHU, lang),
      wudhuNiat: resolve(WUDHU_NIAT, lang),
      wudhuAfterDoa: resolve(WUDHU_AFTER_DOA, lang),
      wudhuBreakers: resolve(WUDHU_BREAKERS, lang),
      tayamum: resolve(TAYAMUM, lang),
      tayamumNiat: resolve(TAYAMUM_NIAT, lang),
      ghuslNiats: resolve(GHUSL_NIATS, lang),
      ghuslSteps: resolve(GHUSL_STEPS, lang),
      sunnahWudhu: resolve(SUNNAH_WUDHU, lang),
      pembatalShalat: resolve(PEMBATANG_SHALAT, lang),
      rukunSteps: resolve(RUKUN_STEPS, lang),
      fardPrayers: resolve(FARD_PRAYERS, lang),
      mazhabTopics: resolve(MAZHAB_TOPICS, lang),
      mazhabInfo: resolve(MAZHAB_INFO, lang),
      sunnah: resolve(SUNNAH, lang),
    }),
    [lang],
  );
}
