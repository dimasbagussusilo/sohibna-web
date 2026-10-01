import { useCallback, useEffect, useState } from 'react';
import { askRulingsChat, type RulingsChatMessage } from '@/api';
import { useI18n } from '@/context/I18nContext';
import { useAuth } from '@/context/AuthContext';
import { useQuranData } from '@/hooks/useQuranData';
import { loadRulingsChat, saveRulingsChatLocal, type RulingsChatEntry } from './history';

const MAX_HISTORY = 10;

type Options = {
  chatId: string;
};

export function useRulingsChat({ chatId }: Options) {
  const { lang } = useI18n();
  const { user } = useAuth();
  const { ud, loaded: udLoaded, saveRulingsChat: saveRulingsChatRemote } = useQuranData();

  const [messages, setMessages] = useState<RulingsChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const remote = user && udLoaded ? ud.rulingsChats[chatId] : undefined;
    if (remote) {
      (async () => {
        await Promise.resolve();
        if (!cancelled) setMessages(remote.payload as RulingsChatMessage[]);
      })();
      return () => { cancelled = true; };
    }
    loadRulingsChat(chatId).then((entry) => {
      if (cancelled) return;
      if (entry) {
        setMessages(entry.payload as RulingsChatMessage[]);
      } else {
        setMessages([]);
      }
    });
    return () => { cancelled = true; };
  }, [chatId, user, udLoaded, ud.rulingsChats]);

  const persist = useCallback(
    (msgs: RulingsChatMessage[]) => {
      const entry: RulingsChatEntry = { id: chatId, payload: msgs };
      saveRulingsChatLocal(entry).catch(() => {});
      if (user) saveRulingsChatRemote(entry);
    },
    [chatId, user, saveRulingsChatRemote],
  );

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;
      setError(null);

      const withUser: RulingsChatMessage[] = [
        ...messages,
        { role: 'user', content: trimmed },
      ];
      setMessages(withUser);
      persist(withUser); 

      setLoading(true);
      try {
        const outbound = withUser.slice(-MAX_HISTORY);
        const { reply } = await askRulingsChat(outbound, lang);
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
    [messages, loading, lang, persist],
  );

  return { messages, send, loading, error };
}
