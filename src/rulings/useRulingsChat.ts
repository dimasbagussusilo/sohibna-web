import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { askRulingsChat, type RulingsChatMessage } from '@/api';
import { useI18n } from '@/context/I18nContext';
import { useAuth } from '@/context/AuthContext';
import { useQuranData } from '@/context/QuranDataContext';
import {
  loadRulingsChat,
  loadRulingsDraft,
  saveRulingsChatLocal,
  saveRulingsDraft,
  type RulingsChatEntry,
} from './history';
import { scopeFromEntry, scopeToApi, type RulingsRefScope } from './scope';

const MAX_HISTORY = 10;

// Assistant replies (long markdown essays) are re-sent as context on follow-ups.
// Cap them so the request stays small — and under the server's 2000-char per-
// message validation on the currently-deployed API. The MOST RECENT reply is
// kept whole: follow-ups like "simplify that" act on it (the server trims it at
// a generous bound).
const MAX_CONTEXT_CHARS = 1000;
const capContext = (msgs: RulingsChatMessage[]): RulingsChatMessage[] => {
  let lastAssistant = -1;
  for (let i = msgs.length - 1; i >= 0; i--) {
    if (msgs[i].role === 'assistant') { lastAssistant = i; break; }
  }
  return msgs.map((m, i) =>
    m.role === 'assistant' && i !== lastAssistant && m.content.length > MAX_CONTEXT_CHARS
      ? { ...m, content: m.content.slice(0, MAX_CONTEXT_CHARS - 1) + '…' }
      : m,
  );
};

type Options = {
  chatId: string;
  /** Reference scope (chat-with-reference). When omitted, a saved entry's own
   *  scope hydrates on reopen; null (explicit) forces a general chat. */
  scope?: RulingsRefScope | null;
};

export function useRulingsChat({ chatId, scope: initialScope }: Options) {
  const { lang } = useI18n();
  const { user } = useAuth();
  const { ud, loaded: udLoaded, saveRulingsChat: saveRulingsChatRemote } = useQuranData();

  const [messages, setMessages] = useState<RulingsChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scope, setScope] = useState<RulingsRefScope | null>(initialScope ?? null);

  // Mirrors the RN hook: once the user sends anything in this mount,
  // hydration must never clobber the live conversation (the effect re-runs
  // on user/ud changes and would otherwise reset messages to []).
  const sentRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    const remote = user && udLoaded ? ud.rulingsChats[chatId] : undefined;
    if (remote) {
      (async () => {
        await Promise.resolve();
        if (!cancelled && !sentRef.current) {
          setMessages(remote.payload as RulingsChatMessage[]);
          if (initialScope == null) setScope(scopeFromEntry(remote));
        }
      })();
      return () => { cancelled = true; };
    }
    // Saved session first; a miss falls back to the device-local temporary
    // draft (same shape, its own store) so unsaved conversations reopen too.
    loadRulingsChat(chatId)
      .then((entry) => entry ?? loadRulingsDraft(chatId))
      .then((entry) => {
        if (cancelled || sentRef.current) return;
        if (entry) {
          setMessages(entry.payload as RulingsChatMessage[]);
          if (initialScope == null) setScope(scopeFromEntry(entry));
        } else {
          setMessages([]);
        }
      });
    return () => { cancelled = true; };
  }, [chatId, user, udLoaded, ud.rulingsChats, initialScope]);

  // Scope fields ride on the saved entry (display title included).
  const scopeFields = useMemo(
    () => (scope ? { sources: scope.sources, quran: scope.quran, refTitle: scope.refTitle } : {}),
    [scope],
  );

  const persist = useCallback(
    (msgs: RulingsChatMessage[]) => {
      const entry: RulingsChatEntry = { id: chatId, payload: msgs, updatedAt: Date.now(), ...scopeFields };
      if (user) {
        // Logged in: every send auto-saves (local cache + account sync).
        saveRulingsChatLocal(entry).catch(() => {});
        saveRulingsChatRemote(entry);
      } else {
        // Guest: device-local temporary thread — reopenable from the Kitab AI
        // message history, never synced, never among saved sessions.
        saveRulingsDraft(entry).catch(() => {});
      }
    },
    [chatId, user, saveRulingsChatRemote, scopeFields],
  );

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;
      sentRef.current = true;
      setError(null);

      const withUser: RulingsChatMessage[] = [
        ...messages,
        { role: 'user', content: trimmed },
      ];
      setMessages(withUser);
      persist(withUser);

      setLoading(true);
      try {
        const outbound = capContext(withUser.slice(-MAX_HISTORY));
        const { reply } = await askRulingsChat(outbound, lang, scope ? scopeToApi(scope) : undefined);
        const withReply = [
          ...withUser,
          { role: 'assistant', content: reply } as RulingsChatMessage,
        ];
        setMessages(withReply);
        persist(withReply);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'error');
      } finally {
        setLoading(false);
      }
    },
    [messages, loading, lang, persist, scope],
  );

  return { messages, send, loading, error, scope };
}
