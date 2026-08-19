// Conversation state + transport for the Daily Reflection companion chat.
//
// Owns the message list, persists it per-day (so a reflection resumes on reopen
// and survives a network failure mid-reply), and caps the outbound history to
// the last N turns (context-window bound — the system prompt is added server-side).
// When a reflection starts fresh, the first message is a localized, instant
// client-side greeting (reusing home.moodResponse) — no round-trip needed for it.

import { useCallback, useEffect, useState } from 'react';
import { askReflection, type ReflectionMessage, type ReflectionVersePayload } from '@/api';
import { useI18n } from '@/context/I18nContext';
import { useAuth } from '@/context/AuthContext';
import { useQuranData } from '@/hooks/useQuranData';
import { loadReflection, saveReflection, reflectionDateKey, type ReflectionEntry } from './history';
import { pickMoodVerse, type MoodId } from './moods';

// Most recent turns sent to the model. llama-3.3-70b has a 128k context window, so
// 10 turns is trivially safe; this just bounds cost/latency.
const MAX_HISTORY = 10;

type Options = {
  mood: MoodId;
  /** The resolved verse payload (Arabic + translation) used to ground the model. */
  verse: ReflectionVersePayload | null;
  /** Day being viewed. Defaults to today. A past day is read-only. */
  date?: string;
};

export function useReflectionChat({ mood, verse, date }: Options) {
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const { ud, loaded: udLoaded, saveReflection: saveReflectionRemote } = useQuranData();
  const day = date ?? reflectionDateKey();
  const verseKey = pickMoodVerse(mood, day);

  const [messages, setMessages] = useState<ReflectionMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Resume the saved reflection for this day+mood, or seed a localized greeting
  // when starting fresh. Re-runs when the mood changes (the on-screen selector),
  // swapping in that mood's conversation. Authed: prefer the synced copy
  // (fresher across devices); local is the guest/offline fallback.
  useEffect(() => {
    let cancelled = false;
    const remote = user && udLoaded ? ud.reflections[`${day}:${mood}`] : undefined;
    if (remote) {
      // Defer the setState so it isn't synchronous within the effect (async
      // IIFE keeps the react-hooks/set-state-in-effect rule quiet, same as
      // every other hydrate-then-set effect in this codebase).
      (async () => {
        await Promise.resolve();
        if (!cancelled) setMessages(remote.messages);
      })();
      return () => {
        cancelled = true;
      };
    }
    loadReflection(day, mood).then((entry) => {
      if (cancelled) return;
      if (entry) {
        setMessages(entry.messages);
      } else {
        setMessages([{ role: 'assistant', content: t(`home.moodResponse.${mood}`) }]);
      }
    });
    return () => {
      cancelled = true;
    };
    // Re-run only when the day/mood changes or the synced copy lands; `t` is
    // stable per language.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [day, mood, lang, user, udLoaded, ud.reflections]);

  // persist dual-writes: the local key (guest/offline + backfill source) and,
  // when authed, the synced store (one whole entry per 'date:mood', LWW).
  const persist = useCallback(
    (msgs: ReflectionMessage[]) => {
      const entry: ReflectionEntry = { date: day, mood, verseKey, messages: msgs, updatedAt: Date.now() };
      saveReflection(entry).catch(() => {});
      if (user) saveReflectionRemote(entry);
    },
    [day, mood, verseKey, user, saveReflectionRemote],
  );

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading || !verse) return;
      setError(null);

      const withUser: ReflectionMessage[] = [
        ...messages,
        { role: 'user', content: trimmed },
      ];
      setMessages(withUser);
      persist(withUser); // user's words survive even if the reply fails

      setLoading(true);
      try {
        const outbound = withUser.slice(-MAX_HISTORY);
        const { reply } = await askReflection(mood, verse, outbound, lang);
        const withReply = [
          ...withUser,
          { role: 'assistant', content: reply } as ReflectionMessage,
        ];
        setMessages(withReply);
        persist(withReply);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'error');
      } finally {
        setLoading(false);
      }
    },
    [messages, loading, verse, mood, lang, persist],
  );

  return { messages, send, loading, error };
}
