import { useEffect, useMemo, useState, useRef } from 'react'
import { Sparkles, ChevronRight, ArrowLeft, Send, MessageCircle, Trash2 } from 'lucide-react'
import { useI18n } from '@/context/I18nContext'
import { useApp } from '@/context/AppContext'
import { useQuranData } from '@/hooks/useQuranData'
import { useRulingsChat } from '@/rulings/useRulingsChat'
import { mergeRulingsChatLists, deleteRulingsChatLocal } from '@/rulings/history'

// The static curated "Rulings Collection" was retired — the RAG chat answers all
// of it from the kitab library. The page is now chat-first: the Ask-AI portal
// and the saved sessions.

export function Rulings() {
  const { t } = useI18n()
  const { ud, deleteRulingsChat: deleteRemoteChat } = useQuranData()
  const { askConfirm } = useApp()

  // UUID for the current chat session
  const [activeChatId, setActiveChatId] = useState<string | null>(null)

  const chatSessions = useMemo(() => {
    // merge() also applies the deterministic most-recent-first ordering.
    return mergeRulingsChatLists([], Object.values(ud.rulingsChats || {}))
  }, [ud.rulingsChats])

  if (activeChatId) {
    return <ChatScreen chatId={activeChatId} onClose={() => setActiveChatId(null)} />
  }

  return (
    <div className="mx-auto max-w-3xl px-4 pt-5 lg:max-w-4xl xl:max-w-5xl pb-24">
      <div className="mb-1 text-lg font-bold text-ink dark:text-cream">{t('rulings.title')}</div>
      <p className="mb-4 text-xs text-ink/50 dark:text-cream/50">{t('rulings.subtitle')}</p>

      {/* Ask AI / New Chat */}
      <button
        onClick={() => setActiveChatId(crypto.randomUUID())}
        className="mb-5 flex w-full items-center gap-3 rounded-2xl bg-night px-4 py-4 text-cream dark:bg-[#163024]"
      >
        <Sparkles size={20} className="text-[#8FBC8F]" />
        <span className="flex-1 text-start">
          <span className="block text-sm font-bold">{t('rulings.askAi')}</span>
          <span className="block text-[11px] text-cream/60">{t('rulings.askAiSub')}</span>
        </span>
        <ChevronRight size={16} className="rtl-flip text-cream/50" />
      </button>

      {/* Chat History */}
      {chatSessions.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-ink/50 dark:text-cream/50">
            {t('rulings.savedSessions')}
          </h3>
          <div className="space-y-2">
            {chatSessions.map((chat) => {
              const preview = chat.payload[0]?.content || 'Empty Chat'
              return (
                <div
                  key={chat.id}
                  onClick={() => setActiveChatId(chat.id)}
                  className="flex w-full cursor-pointer items-center gap-3 rounded-xl bg-white px-4 py-3 text-start shadow-sm dark:bg-[#122A1F]"
                >
                  <MessageCircle size={16} className="text-[#8FBC8F]" />
                  <span className="truncate text-sm text-ink dark:text-cream flex-1">{preview}</span>
                  <button
                    onClick={async (e) => {
                      e.stopPropagation()
                      const ok = await askConfirm({
                        title: t('rulings.deleteChatTitle'),
                        message: t('rulings.deleteChatMsg'),
                        confirmText: t('rulings.deleteChatConfirm'),
                        cancelText: t('common.cancel'),
                        destructive: true,
                      })
                      if (!ok) return
                      deleteRulingsChatLocal(chat.id).catch(() => {})
                      deleteRemoteChat(chat.id)
                    }}
                    aria-label={t('rulings.deleteChatTitle')}
                    className="shrink-0 rounded-full p-1.5 text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
                  >
                    <Trash2 size={15} />
                  </button>
                  <ChevronRight size={14} className="text-ink/30 dark:text-cream/30" />
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function ChatScreen({ chatId, onClose }: { chatId: string, onClose: () => void }) {
  const { t } = useI18n()
  const { messages, send, loading, error } = useRulingsChat({ chatId })
  const [draft, setDraft] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const onSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!draft.trim() || loading) return
    send(draft)
    setDraft('')
  }

  return (
    <div className="flex h-[100dvh] flex-col bg-cream dark:bg-night lg:ps-20 pb-[env(safe-area-inset-bottom)]">
      <header className="sticky top-0 z-30 flex items-center gap-2 border-b border-black/5 bg-cream/90 px-3 py-2 backdrop-blur dark:border-white/10 dark:bg-night/90">
        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-black/5 active:bg-black/10 dark:text-cream dark:hover:bg-white/10 dark:active:bg-white/20"
        >
          <ArrowLeft size={20} className="rtl-flip" />
        </button>
        <div className="flex flex-1 flex-col truncate">
          <span className="flex items-center gap-2 text-sm font-bold text-ink dark:text-cream">
            <Sparkles size={14} className="text-[#8FBC8F]" /> AI Assistant
          </span>
          <span className="truncate text-[11px] text-ink/50 dark:text-cream/50">
            {t('rulings.title')}
          </span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          {/* Disclaimer at the top */}
          <div className="rounded-2xl border border-orange-200/50 bg-orange-50/50 px-4 py-3 dark:border-orange-900/30 dark:bg-orange-900/10 mb-2">
            <p className="text-[11px] leading-relaxed text-orange-900/80 dark:text-orange-200/80">
              {t('rulings.rememberPrefix')}
              {t('rulings.rememberBody')}
              <b>{t('rulings.notFatwaCaps')}</b>
              {t('rulings.rememberTail')}
            </p>
          </div>

          {messages.length === 0 && !loading && (
            <div className="py-10 text-center text-sm text-ink/40 dark:text-cream/40">
              {t('rulings.typeQuestion')}
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'ms-auto bg-[#8FBC8F] text-white'
                  : 'me-auto bg-white text-ink shadow-sm dark:bg-[#122A1F] dark:text-cream'
              }`}
            >
              <div className="whitespace-pre-wrap">{m.content}</div>
            </div>
          ))}

          {loading && (
            <div className="me-auto max-w-[85%] rounded-2xl bg-white px-4 py-3 text-sm text-ink/50 shadow-sm dark:bg-[#122A1F] dark:text-cream/50">
              <span className="flex gap-1">
                <span className="animate-bounce">•</span>
                <span className="animate-bounce delay-75">•</span>
                <span className="animate-bounce delay-150">•</span>
              </span>
            </div>
          )}

          {error && (
            <div className="mx-auto rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}
          <div ref={bottomRef} className="h-2" />
        </div>
      </div>

      <div className="border-t border-black/5 bg-cream px-4 py-3 pb-safe dark:border-white/10 dark:bg-night lg:bg-transparent lg:dark:bg-transparent">
        <form onSubmit={onSend} className="mx-auto flex max-w-2xl items-end gap-2">
          <textarea
            rows={1}
            value={draft}
            maxLength={500}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                onSend(e)
              }
            }}
            placeholder={t('rulings.typeQuestion')}
            className="max-h-32 min-h-[44px] flex-1 resize-none rounded-2xl border-0 bg-white px-4 py-3 text-sm text-ink shadow-sm outline-none ring-1 ring-inset ring-black/5 focus:ring-2 focus:ring-[#8FBC8F] dark:bg-[#122A1F] dark:text-cream dark:ring-white/10"
          />
          <button
            type="submit"
            disabled={!draft.trim() || loading}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#8FBC8F] text-white shadow-sm transition-opacity disabled:opacity-50"
          >
            <Send size={18} className="ms-1 rtl-flip" />
          </button>
        </form>
        {draft.length >= 400 && (
          <div className="mx-auto mt-1 max-w-2xl text-end text-[10px] text-ink/40 dark:text-cream/40">
            {draft.length}/500
          </div>
        )}
      </div>
    </div>
  )
}
