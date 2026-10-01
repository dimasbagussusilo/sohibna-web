import { useEffect, useMemo, useState, useRef } from 'react'
import { Sparkles, ChevronRight, ArrowLeft, Send, MessageCircle } from 'lucide-react'
import { fetchRulings, type RulingEntry } from '@/api'
import { rulingCategory, rulingPerspectives, rulingQuestion } from '@/lib/rulingsI18n'
import { useI18n } from '@/context/I18nContext'
import { useQuranData } from '@/hooks/useQuranData'
import { useRulingsChat } from '@/rulings/useRulingsChat'

export function Rulings() {
  const { t, lang } = useI18n()
  const { ud } = useQuranData()
  const [rulings, setRulings] = useState<RulingEntry[] | null>(null)
  const [category, setCategory] = useState<string>('all')
  const [openSlug, setOpenSlug] = useState<string | null>(null)
  
  // UUID for the current chat session
  const [activeChatId, setActiveChatId] = useState<string | null>(null)

  useEffect(() => {
    fetchRulings()
      .then(setRulings)
      .catch(() => setRulings([]))
  }, [])

  const categories = useMemo(() => {
    if (!rulings) return []
    return ['all', ...Array.from(new Set(rulings.map((r) => r.category)))]
  }, [rulings])

  const filtered = useMemo(
    () => (category === 'all' ? rulings ?? [] : (rulings ?? []).filter((r) => r.category === category)),
    [rulings, category],
  )

  const chatSessions = useMemo(() => {
    return Object.values(ud.rulingsChats || {}).filter(c => !c.deleted)
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
            Saved AI Sessions
          </h3>
          <div className="space-y-2">
            {chatSessions.map((chat) => {
              const preview = chat.payload[0]?.content || 'Empty Chat'
              return (
                <button
                  key={chat.id}
                  onClick={() => setActiveChatId(chat.id)}
                  className="flex w-full items-center gap-3 rounded-xl bg-white px-4 py-3 text-start shadow-sm dark:bg-[#122A1F]"
                >
                  <MessageCircle size={16} className="text-[#8FBC8F]" />
                  <span className="truncate text-sm text-ink dark:text-cream flex-1">{preview}</span>
                  <ChevronRight size={14} className="text-ink/30 dark:text-cream/30" />
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Category chips */}
      <div className="mb-4 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold ${
              category === c
                ? 'bg-[#8FBC8F] text-white'
                : 'bg-black/5 text-ink dark:bg-white/10 dark:text-cream'
            }`}
          >
            {c === 'all' ? t('rulings.all') : rulingCategory(c, lang)}
          </button>
        ))}
      </div>

      {/* List */}
      {rulings === null ? (
        <p className="py-10 text-center text-xs text-ink/40 dark:text-cream/40">
          {t('rulings.loadingRulings')}
        </p>
      ) : filtered.length ? (
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm dark:bg-[#122A1F]">
          {filtered.map((r, i) => {
            const open = openSlug === r.slug
            return (
              <div key={r.slug} className={i > 0 ? 'border-t border-gray-100 dark:border-white/10' : ''}>
                <button
                  onClick={() => setOpenSlug(open ? null : r.slug)}
                  className="flex w-full items-center gap-3 px-4 py-3.5 text-start"
                >
                  <span className="rounded-full bg-[#8FBC8F]/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#8FBC8F]">
                    {rulingCategory(r.category, lang)}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-semibold text-ink dark:text-cream">
                    {rulingQuestion(r, lang)}
                  </span>
                  <ChevronRight
                    size={15}
                    className={`rtl-flip shrink-0 text-ink/30 transition-transform dark:text-cream/30 ${open ? 'rotate-90' : ''}`}
                  />
                </button>
                {open ? (
                  <div className="space-y-3 border-t border-gray-100 bg-black/[0.02] px-4 py-4 dark:border-white/10 dark:bg-white/[0.03]">
                    {rulingPerspectives(r, lang).map((p, j) => (
                      <div key={j}>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-[#8FBC8F]">
                          {p.label}
                        </div>
                        <p className="mt-1 text-xs leading-relaxed text-ink/80 dark:text-cream/80">
                          {p.view}
                        </p>
                      </div>
                    ))}
                    <p className="pt-1 text-[10px] italic text-ink/40 dark:text-cream/40">
                      {t('rulings.multiPerspectiveNote')}
                    </p>
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      ) : (
        <p className="py-10 text-center text-xs text-ink/40 dark:text-cream/40">—</p>
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
      </div>
    </div>
  )
}
