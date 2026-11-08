import type { Bi, Lang, Resolved } from './types';

// A Bi value has exactly these three keys. Used to detect translatable leaves
// during the deep resolve walk.
const isBi = (x: unknown): x is Bi =>
  !!x &&
  typeof x === 'object' &&
  'id' in x &&
  'en' in x &&
  'ar' in x &&
  'tr' in x &&
  'ur' in x &&
  Object.keys(x).length === 5;

/**
 * Deeply resolve every Bi leaf in a data tree to a plain string for the given
 * language. Lets components keep reading `letter.anatomy` as a string while the
 * underlying data stays trilingual.
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
