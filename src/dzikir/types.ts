import type { Lang } from '@/i18n/types';

// Type shapes for the Dzikir & Doa feature. Pedagogical prose/meaning is
// bilingual (Bi); Arabic + transliteration stay plain strings.

/** A bilingual string — Indonesian source + English translation. */
export type Bi = { id: string; en: string };

/** Deeply resolves every Bi in a shape to a plain string for the given lang. */
export type Resolved<T> = T extends Bi
  ? string
  : T extends readonly (infer U)[]
    ? Resolved<U>[]
    : T extends object
      ? { [K in keyof T]: Resolved<T[K]> }
      : T;

export type { Lang };

/** Arabic text + transliteration + bilingual meaning — for a doa/dzikir line. */
export type ArabicItem = {
  arabic?: string;
  latin?: string;
  meaning?: Bi;
  /** Source reference (ayah / hadith riwayah). Shown under the meaning. */
  reference?: Bi;
};

/** Which category a dzikir/doa belongs to (the Dzikir feature's tabs). */
export type DzikirCategory = 'afterPrayer' | 'morning' | 'evening' | 'daily';

/** Tab order (left→right). */
export const DZIKIR_CATEGORIES: DzikirCategory[] = ['afterPrayer', 'morning', 'evening', 'daily'];

/** A dzikir/wirid or doa item, tagged with its category. */
export type DzikirItem = {
  id: string;
  category: DzikirCategory;
  title?: Bi;
  /** Optional count, e.g. "3×" / "100×" — shown as a badge. */
  count?: Bi;
  desc?: Bi;
} & ArabicItem;
