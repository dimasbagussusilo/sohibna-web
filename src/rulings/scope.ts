// Reference scope for the chat-with-reference mode (NotebookLM-style): one
// chosen kitab series (all its Jilid/Bagian volumes), one volume, or the
// whole Qur'an. Shared by both platforms — keep this file identical to its
// sohibna-web twin.
import type { RulingsChatEntryData } from '@/lib/quran';
import type { RulingsChatScope } from '@/api';

export type RulingsRefScope = {
  /** authentic_texts.source_name volumes in scope (empty for Qur'an-only). */
  sources: string[];
  /** Scope includes all Qur'an rows (scoped as a type, never 114 names). */
  quran: boolean;
  /** Display title, e.g. "Tafsir Ibnu Katsir Jilid 8 Bagian 1". */
  refTitle: string;
};

export const quranScope = (title: string): RulingsRefScope => ({
  sources: [],
  quran: true,
  refTitle: title,
});

/** The entry's scope, or null for a general (whole-corpus) chat. */
export const scopeFromEntry = (e: RulingsChatEntryData | undefined | null): RulingsRefScope | null => {
  if (!e) return null;
  const sources = Array.isArray(e.sources) ? e.sources : [];
  if (!e.quran && sources.length === 0) return null;
  return { sources, quran: !!e.quran, refTitle: e.refTitle ?? '' };
};

/**
 * Scope equality. Both null (two general chats) match; a scoped chat never
 * matches a general one. Sources compare as SETS — the catalog's list order
 * must never be load-bearing. refTitle is display-only and ignored.
 */
export const sameScope = (a: RulingsRefScope | null, b: RulingsRefScope | null): boolean => {
  if (!a && !b) return true;
  if (!a || !b) return false;
  if (a.quran !== b.quran) return false;
  if (a.sources.length !== b.sources.length) return false;
  const norm = (xs: string[]) => [...xs].sort().join('\x00');
  return norm(a.sources) === norm(b.sources);
};

/** Request body shape for POST /rulings/chat (title rides for the scoped prompt). */
export const scopeToApi = (s: RulingsRefScope): RulingsChatScope => ({
  sources: s.sources,
  quran: s.quran,
  title: s.refTitle,
});

// expo-router params are strings — the scope travels as a JSON param when a
// reference tap opens the chat screen.
export const encodeScopeParam = (s: RulingsRefScope): string => JSON.stringify(s);

export const decodeScopeParam = (raw: string | undefined | null): RulingsRefScope | null => {
  if (!raw) return null;
  try {
    const v = JSON.parse(raw) as Partial<RulingsRefScope> | null;
    if (v && Array.isArray(v.sources) && typeof v.quran === 'boolean') {
      return {
        sources: v.sources,
        quran: v.quran,
        refTitle: typeof v.refTitle === 'string' ? v.refTitle : '',
      };
    }
  } catch {
    // Malformed param — fall through to a general chat.
  }
  return null;
};
