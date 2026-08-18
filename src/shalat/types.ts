import type { Lang } from '@/i18n/types';

// Type shapes for the "Belajar Shalat" curriculum. Mirrors the Iqro approach:
// pedagogical prose/meaning is bilingual (Bi); Arabic + transliteration are
// plain strings (so TTS can read the Arabic directly).

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

// ---------------------------------------------------------------------------
// Mazhab
// ---------------------------------------------------------------------------

export type Mazhab = 'shafii' | 'hanafi' | 'maliki' | 'hanbali';

/** UI order (Shafi'i first — the app's default prayer setting). */
export const MAZHABS: Mazhab[] = ['shafii', 'hanafi', 'maliki', 'hanbali'];

// ---------------------------------------------------------------------------
// Content building blocks
// ---------------------------------------------------------------------------

/** Arabic text + transliteration + bilingual meaning — for niats, duas,
 *  recitations. `arabic`/`latin` stay plain (no Bi) so TTS reads the Arabic. */
export type ArabicItem = {
  /** Plain Arabic, no diacritic stripping — read aloud by TTS. */
  arabic?: string;
  /** Latin transliteration, shown under the Arabic + TTS fallback. */
  latin?: string;
  /** Bilingual meaning/translation. */
  meaning?: Bi;
  /** Source reference — ayah citation, hadith riwayah, or "Shafi'i niyyah
   *  formula". Shown as a small muted line under the meaning so every text is
   *  traceable to its evidence (a sensitive-religion-content requirement). */
  reference?: Bi;
};

/** A generic instructional body: optional title/desc prose plus an Arabic item. */
export type Body = ArabicItem & {
  title?: Bi;
  desc?: Bi;
};

/** A flat item with an id (used where there's no per-mazhab split). */
export type Item = { id: string } & Body;

/**
 * One rukun/movement step. Steps identical across mazhab set only `shared`;
 * steps that differ (basmalah, qunut, hand position, …) provide `variants` per
 * mazhab. The renderer falls back to `shared` for any mazhab without a variant.
 */
export type Step = {
  id: string;
  shared?: Body;
  variants?: Partial<Record<Mazhab, Body>>;
};

/** A fard prayer (Subuh/Dzuhur/Ashar/Maghrib/Isya) with its niat + rakaat. */
export type FardPrayer = {
  id: string;
  title: Bi;
  rakaat: number;
  /** Bilingual "n rakaat" label rendered alongside the number. */
  note?: Bi;
  niat?: ArabicItem;
};

/** A difference topic in the mazhab-comparison section. */
export type MazhabTopic = {
  id: string;
  title: Bi;
  summary?: Bi;
  /** Each mazhab's position on this topic (omitted = no distinct view). */
  views: Partial<Record<Mazhab, Bi>>;
};

/** Which nav page a sunnah prayer belongs to (the detailed dropdown). */
export type SunnahCat =
  | 'rawatib'
  | 'dhuha'
  | 'tahajud'
  | 'witir'
  | 'istikharah'
  | 'hajat'
  | 'tarawih'
  | 'taubat'
  | 'tasbih'
  | 'idul-fitri'
  | 'idul-adha'
  | 'janazah'
  | 'kusuf'
  | 'istisqa';

/** A sunnah prayer entry with niat and any specific dua. */
export type SunnahPrayer = {
  id: string;
  /** Nav page this entry surfaces under (several entries share 'rawatib'). */
  page: SunnahCat;
  title: Bi;
  /** e.g. "2 rakaat" / "sebelum Subuh". */
  meta?: Bi;
  when?: Bi;
  niat?: ArabicItem;
  doa?: ArabicItem;
  /** How to perform it (procedure steps). */
  how?: Item[];
  desc?: Bi;
};

/** A post-prayer dzikir/wirid item (e.g. Subhanallah 33×). — now in src/dzikir. */
