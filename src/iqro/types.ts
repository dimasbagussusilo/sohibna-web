import type { Lang } from '@/i18n/types';

// Type shapes for the Iqro curriculum, ported from iqro/1–4.html datasets.
// Pedagogical prose is trilingual (Bi). Term names (letters, harakat, tajwid
// rules) are also Bi: Indonesian/English keep the transliteration, Arabic gets
// the native term (السكون، الفتحة…).

/** A trilingual string — Indonesian source + English and Arabic translations. */
export type Bi = { id: string; en: string; ar: string };

/** Deeply resolves every Bi in a shape to a plain string for the given lang. */
export type Resolved<T> = T extends Bi
  ? string
  : T extends ReadonlyArray<infer U>
    ? Resolved<U>[]
    : T extends object
      ? { [K in keyof T]: Resolved<T[K]> }
      : T;

export type { Lang };

/** A single hijaiyah letter (Phase 1). */
export type Letter = {
  id: string;
  arab: string;
  name: Bi;
  /** Latin transliteration, kept for reference (audio speaks the Arabic). */
  audio: string;
  /** Posisi Mulut (Makhraj) — where the sound is articulated. */
  anatomy: Bi;
  /** Logika Bentuk — the visual-shape mnemonic. */
  logic: Bi;
};

export type LetterFamily = {
  groupName: Bi;
  description: Bi;
  letters: Letter[];
};

/** One positional form of a letter within a joined word (Phase 3). */
export type JoinLetter = {
  isolated: string;
  form: string;
  position: 'Awal' | 'Tengah' | 'Akhir';
  logic: Bi;
};

export type JoinWord = {
  id: string;
  label: string;
  meaning: Bi;
  audio: string;
  letters: JoinLetter[];
  connectedText: string;
};

/** A syllable within a harakat rule word (Phase 4). */
export type Syllable = {
  arab: string;
  latin: string;
  duration: number;
  highlight?: boolean;
};

export type HarakatRule = {
  id: string;
  title: Bi;
  subtitle: Bi;
  icon: string;
  analogyIcon: string;
  analogy: Bi;
  mechanics: Bi;
  word: {
    full: string;
    audio: string;
    syllables: Syllable[];
  };
};

/** A tajwid rule (Phase 7). */
export type TajwidRule = {
  id: string;
  title: Bi;
  subtitle: Bi;
  icon: string;
  analogyIcon: string;
  arab: string;
  latin: string;
  type: 'stretch' | 'vibrate' | 'bounce';
  duration: number;
  analogy: Bi;
  mechanics: Bi;
};

// ---------------------------------------------------------------------------
// New phases added beyond the original 5 HTML prototypes.
// ---------------------------------------------------------------------------

/** A basic vowel sign (Fathah/Kasroh/Dhomah) — Phase 2. */
export type HarakatSyllable = { arab: string; latin: string };

export type HarakatSign = {
  id: string;
  name: Bi;
  sign: string;
  sound: string;
  carrier: string;
  desc: Bi;
  examples: HarakatSyllable[];
};

/** A long-vowel lengthener (alif/waw/ya) — Phase 5. */
export type LongVowel = {
  id: string;
  name: Bi;
  letter: string;
  pair: string;
  word: string;
  latin: string;
  meaning: Bi;
  /** Name of the harakat this lengthener extends (matches HarakatSign.name). */
  vowel: Bi;
  desc: Bi;
};

/** A hamzah / alif variant form — Phase 6. */
export type HamzahForm = {
  id: string;
  name: Bi;
  form: string;
  word: string;
  latin: string;
  meaning: Bi;
  desc: Bi;
};

export type VolumeId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/** Metadata for the volume selector tabs. Order in data.ts is the phase order:
 *  1 Letters, 2 Harakat Dasar, 3 Joining, 4 Signs, 5 Long vowels,
 *  6 Hamzah, 7 Tajwid, 8 AI. */
export type VolumeMeta = {
  id: VolumeId;
  /** Disabled tabs (Volume 8 = AI, deferred). */
  disabled?: boolean;
};
