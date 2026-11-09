// Built-in (preset) reading-mark and label names — one-tap suggestions so a
// first-time user isn't forced to type before the first mark/label exists.
// Presets are pure UI suggestions: the localized string at tap time is stored
// exactly like a hand-typed name (setLastReadSlot / addCustomLabel), so
// switching language later never renames an existing mark/label, and every
// consumer (dashboard, Continue Reading, other devices via sync) keeps working
// off the plain string.
import type { TranslationKey } from '@/i18n/types';

export type PresetTFunc = (key: TranslationKey) => string;

export const MARK_PRESET_KEYS: TranslationKey[] = ['verseCard.markPreset.tadarus'];

export const LABEL_PRESET_KEYS: TranslationKey[] = [
  'verseCard.labelPreset.tadabbur',
  'verseCard.labelPreset.review',
  'verseCard.labelPreset.important',
];

export const markPresetNames = (t: PresetTFunc): string[] => MARK_PRESET_KEYS.map((k) => t(k));

export const labelPresetNames = (t: PresetTFunc): string[] => LABEL_PRESET_KEYS.map((k) => t(k));
