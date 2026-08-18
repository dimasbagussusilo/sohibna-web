import type { translations as idTranslations } from './translations/id';

// Supported UI languages. Bahasa Indonesia (`id`) is the app default; Arabic
// (`ar`) is the only RTL language (see I18nContext for the RTL wiring).
export type Lang = 'id' | 'en' | 'ar';

// The canonical shape of a translation dictionary, derived from (but widened
// beyond) the Bahasa Indonesia source-of-truth file. `as const` in id.ts gives
// every string a literal type; we widen leaves to plain `string` (and readonly
// tuples to mutable arrays) so the English file's different literal values still
// satisfy the same shape. Any missing or extra KEY still fails to compile.
type Widen<T> = T extends string
  ? string
  : T extends readonly unknown[]
    ? readonly Widen<T[number]>[]
    : T extends object
      ? { [K in keyof T]: Widen<T[K]> }
      : T;

export type Translation = Widen<typeof idTranslations>;

// Dotted path to every string leaf in the dictionary, e.g. `'home.greeting'`.
// Used as the type of `t()`'s key argument so lookups are compile-time checked.
// Arrays are NOT descended into (they hold structured content like label
// lists, accessed via `dict`, not `t()`).
type StringPath<T> = T extends string
  ? ''
  : T extends readonly unknown[]
    ? never
    : T extends object
      ? {
          [K in keyof T & string]: T[K] extends string
            ? K
            : T[K] extends readonly unknown[]
              ? never
              : T[K] extends object
                ? `${K}.${StringPath<T[K]>}`
                : never;
        }[keyof T & string]
      : never;

export type TranslationKey = StringPath<Translation>;
