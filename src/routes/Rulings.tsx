import { useEffect, useMemo, useState, useRef } from 'react'
import { Link } from 'react-router'
import { Sparkles, ChevronRight, ChevronDown, ArrowLeft, Send, MessageCircle, Trash2, X, BookOpen, CheckCircle2 } from 'lucide-react'
import { useI18n } from '@/context/I18nContext'
import { useApp } from '@/context/AppContext'
import { useAuth } from '@/context/AuthContext'
import { useQuranData } from '@/context/QuranDataContext'
import { useRulingsChat } from '@/rulings/useRulingsChat'
import {
  mergeRulingsChatLists,
  mergeRulingsThreads,
  deleteRulingsChatLocal,
  deleteRulingsDraft,
  listRulingsChats,
  listRulingsDrafts,
  type RulingsChatEntry,
} from '@/rulings/history'
import { scopeFromEntry, type RulingsRefScope } from '@/rulings/scope'
import { MarkdownText } from '@/components/MarkdownText'

// The static curated "Rulings Collection" was retired — the RAG chat answers all
// of it from the kitab library. The page is chat-first: the general Ask-AI
// portal, the Kitab AI entry card (the reference list lives on /kitab-ai), and
// the message history below — saved (account-attached) + temporary
// (device-local) threads. ChatScreen is exported for /kitab-ai, which renders
// it scoped.

export function Rulings() {
  const { t } = useI18n()
  const { user } = useAuth()
  const { ud, deleteRulingsChat: deleteRemoteChat } = useQuranData()
  const { askConfirm } = useApp()

  // Current chat session + its reference scope (null = general chat)
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [activeScope, setActiveScope] = useState<RulingsRefScope | null>(null)

  const [sessionsOpen, setSessionsOpen] = useState(true)

  // Device-local sessions (saved by logged-in users and, on older builds, by
  // guests). Merged with the synced copies — mirrors the RN screens.
  const [localChats, setLocalChats] = useState<RulingsChatEntry[]>([])
  const [drafts, setDrafts] = useState<RulingsChatEntry[]>([])
  useEffect(() => {
    listRulingsChats().then(setLocalChats).catch(() => {})
    listRulingsDrafts().then(setDrafts).catch(() => {})
  }, [])

  const chatSessions = useMemo(() => {
    // merge() also applies the deterministic most-recent-first ordering.
    return mergeRulingsChatLists(localChats, Object.values(ud.rulingsChats || {}))
  }, [localChats, ud.rulingsChats])

  // Message history = saved (account-attached) + temporary (device-local).
  const threads = useMemo(() => mergeRulingsThreads(drafts, chatSessions), [drafts, chatSessions])

  if (activeChatId) {
    return (
      <ChatScreen
        chatId={activeChatId}
        scope={activeScope}
        onClose={() => {
          setActiveChatId(null)
          setActiveScope(null)
        }}
      />
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 pt-5 lg:max-w-4xl xl:max-w-5xl pb-24">
      <div className="mb-1 text-lg font-bold text-ink dark:text-cream">{t('rulings.title')}</div>
      <p className="mb-4 text-xs text-ink/50 dark:text-cream/50">{t('rulings.subtitle')}</p>

      {/* Guest notice — saving chats requires an account */}
      {!user ? (
        <div className="mb-4 flex items-center gap-3 rounded-2xl border border-[#8FBC8F]/30 bg-[#8FBC8F]/10 px-4 py-3">
          <span className="flex-1 text-xs text-ink/70 dark:text-cream/70">{t('rulings.guestSaveHint')}</span>
          <Link to="/login" className="shrink-0 text-xs font-bold text-[#8FBC8F]">
            {t('quranHome.guestLogin')}
          </Link>
        </div>
      ) : null}

      {/* Ask AI / New Chat (general — whole corpus) */}
      <button
        onClick={() => {
          setActiveScope(null)
          setActiveChatId(crypto.randomUUID())
        }}
        className="mb-5 flex w-full items-center gap-3 rounded-2xl bg-night px-4 py-4 text-cream dark:bg-[#163024]"
      >
        <Sparkles size={20} className="text-[#8FBC8F]" />
        <span className="flex-1 text-start">
          <span className="block text-sm font-bold">{t('rulings.askAi')}</span>
          <span className="block text-[11px] text-cream/60">{t('rulings.askAiSub')}</span>
        </span>
        <ChevronRight size={16} className="rtl-flip text-cream/50" />
      </button>

      {/* Kitab AI — chat with one chosen reference (list lives on /kitab-ai) */}
      <Link
        to="/kitab-ai"
        className="mb-5 flex w-full items-center gap-3 rounded-2xl border border-black/5 bg-white px-4 py-4 shadow-sm dark:border-white/10 dark:bg-[#122A1F]"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#8FBC8F]/15">
          <BookOpen size={18} className="text-[#8FBC8F]" />
        </span>
        <span className="min-w-0 flex-1 text-start">
          <span className="block text-sm font-bold text-ink dark:text-cream">{t('home.kitabAi')}</span>
          <span className="block text-[11px] text-ink/50 dark:text-cream/50">{t('home.kitabAiDesc')}</span>
        </span>
        <ChevronRight size={16} className="rtl-flip text-ink/30 dark:text-cream/30" />
      </Link>

      {/* Message history — saved (account-attached) + temporary
          (device-local) threads, most recent first. */}
      {threads.length > 0 && (
        <div className="mb-6">
          <button
            onClick={() => setSessionsOpen((v) => !v)}
            className="mb-3 flex w-full items-center gap-1 text-xs font-bold uppercase tracking-widest text-ink/50 dark:text-cream/50"
          >
            <ChevronDown size={14} className={`transition-transform ${sessionsOpen ? '' : '-rotate-90 rtl-flip'}`} />
            {t('rulings.messageHistory')} ({threads.length})
          </button>
          {sessionsOpen && (
            <div className="space-y-2">
              {threads.map((thread) => {
                const preview = thread.payload[0]?.content || 'Empty Chat'
                const scope = scopeFromEntry(thread)
                return (
                  <div
                    key={thread.id}
                    onClick={() => {
                      setActiveScope(scope)
                      setActiveChatId(thread.id)
                    }}
                    className="flex w-full cursor-pointer items-center gap-3 rounded-xl bg-white px-4 py-3 text-start shadow-sm dark:bg-[#122A1F]"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#8FBC8F]/15">
                      {thread.temporary ? (
                        <MessageCircle size={15} className="text-ink/30 dark:text-cream/30" />
                      ) : (
                        <CheckCircle2 size={15} className="text-[#8FBC8F]" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm text-ink dark:text-cream">{preview}</span>
                      <span className="mt-0.5 flex items-center gap-1">
                        {scope && (
                          <span className="truncate text-[10px] text-[#8FBC8F]">
                            {scope.quran ? t('rulings.quranEntry') : scope.refTitle} ·{' '}
                          </span>
                        )}
                        <span
                          className={`text-[10px] ${thread.temporary ? 'text-ink/40 dark:text-cream/40' : 'font-semibold text-[#8FBC8F]'}`}
                        >
                          {thread.temporary ? t('rulings.temporaryChat') : t('rulings.savedSessions')}
                        </span>
                      </span>
                    </span>
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
                        await deleteRulingsChatLocal(thread.id).catch(() => {})
                        await deleteRulingsDraft(thread.id).catch(() => {})
                        deleteRemoteChat(thread.id)
                        // Refresh both device-local lists so rows disappear
                        // immediately.
                        listRulingsChats().then(setLocalChats).catch(() => {})
                        listRulingsDrafts().then(setDrafts).catch(() => {})
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
          )}
        </div>
      )}
    </div>
  )
}

export function ChatScreen({ chatId, scope, onClose }: { chatId: string, scope: RulingsRefScope | null, onClose: () => void }) {
  const { t } = useI18n()
  const { user } = useAuth()
  const { messages, send, loading, error } = useRulingsChat({ chatId, scope })
  const [draft, setDraft] = useState('')
  const [hintHidden, setHintHidden] = useState(false)
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
          {scope ? (
            // Reference badge — this chat is scoped to one chosen reference.
            <span className="mt-0.5 flex w-fit max-w-full items-center gap-1 rounded-full bg-[#8FBC8F]/15 px-2 py-0.5">
              <BookOpen size={10} className="shrink-0 text-[#8FBC8F]" />
              <span className="truncate text-[10px] font-medium text-[#8FBC8F]">
                {scope.quran ? t('rulings.quranEntry') : scope.refTitle}
              </span>
            </span>
          ) : (
            <span className="truncate text-[11px] text-ink/50 dark:text-cream/50">
              {t('rulings.title')}
            </span>
          )}
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
              {scope && (
                <div className="mt-1 text-xs font-medium text-[#8FBC8F]">{t('rulings.scopedNotice')}</div>
              )}
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
              {m.role === 'user' ? (
                <div className="whitespace-pre-wrap">{m.content}</div>
              ) : (
                <MarkdownText text={m.content} />
              )}
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
        {/* Guest notice — this conversation won't be saved (per-mount dismiss) */}
        {!user && !hintHidden ? (
          <div className="mx-auto mb-2 flex max-w-2xl items-center gap-2 rounded-xl bg-black/5 px-3 py-2 dark:bg-white/10">
            <span className="flex-1 text-[11px] text-ink/60 dark:text-cream/60">
              {t('rulings.guestSaveHint')}
            </span>
            <Link to="/login" className="text-[11px] font-bold text-[#8FBC8F]">
              {t('quranHome.guestLogin')}
            </Link>
            <button
              onClick={() => setHintHidden(true)}
              aria-label={t('common.close')}
              className="p-1 text-ink/40 transition-colors hover:text-ink/70 dark:text-cream/40 dark:hover:text-cream/70"
            >
              <X size={12} />
            </button>
          </div>
        ) : null}
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
