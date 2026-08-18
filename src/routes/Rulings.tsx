import { useEffect, useMemo, useState } from 'react'
import { Sparkles, ChevronRight } from 'lucide-react'
import { askRuling, fetchRulings, type AskResult, type RulingEntry } from '@/api'
import { rulingCategory, rulingPerspectives, rulingQuestion } from '@/lib/rulingsI18n'
import { useI18n } from '@/context/I18nContext'

// Rulings tab (web port): category filter + collection, expandable multi-
// perspective detail, and the "Ask AI" box (multi-perspective summary — NOT a
// fatwa; the disclaimer is always shown).
export function Rulings() {
  const { t, lang } = useI18n()
  const [rulings, setRulings] = useState<RulingEntry[] | null>(null)
  const [category, setCategory] = useState<string>('all')
  const [openSlug, setOpenSlug] = useState<string | null>(null)
  const [showAsk, setShowAsk] = useState(false)

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

  return (
    <div className="mx-auto max-w-3xl px-4 pt-5">
      <div className="mb-1 text-lg font-bold text-ink dark:text-cream">{t('rulings.title')}</div>
      <p className="mb-4 text-xs text-ink/50 dark:text-cream/50">{t('rulings.subtitle')}</p>

      {/* Ask AI */}
      <button
        onClick={() => setShowAsk(true)}
        className="mb-5 flex w-full items-center gap-3 rounded-2xl bg-night px-4 py-4 text-cream dark:bg-[#163024]"
      >
        <Sparkles size={20} className="text-[#8FBC8F]" />
        <span className="flex-1 text-start">
          <span className="block text-sm font-bold">{t('rulings.askAi')}</span>
          <span className="block text-[11px] text-cream/60">{t('rulings.askAiSub')}</span>
        </span>
        <ChevronRight size={16} className="rtl-flip text-cream/50" />
      </button>

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

      {showAsk ? <AskSheet onClose={() => setShowAsk(false)} /> : null}
    </div>
  )
}

// The Ask-AI sheet: question → multi-perspective summary. AI down / 503 → the
// polite unavailable message (never a fake answer).
function AskSheet({ onClose }: { onClose: () => void }) {
  const { t, lang } = useI18n()
  const [question, setQuestion] = useState('')
  const [busy, setBusy] = useState(false)
  const [answer, setAnswer] = useState<AskResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const ask = async (e: React.FormEvent) => {
    e.preventDefault()
    const q = question.trim()
    if (!q) return
    setBusy(true)
    setError(null)
    setAnswer(null)
    try {
      setAnswer(await askRuling(q, lang))
    } catch {
      setError(t('rulings.noSummary'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center"
      onClick={onClose}
    >
      <div
        className="max-h-[85dvh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-5 dark:bg-[#122A1F] sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm font-bold text-ink dark:text-cream">
            <Sparkles size={15} className="text-[#8FBC8F]" /> {t('rulings.askAi')}
          </span>
          <button onClick={onClose} className="text-ink/40 dark:text-cream/40">✕</button>
        </div>

        <form onSubmit={ask} className="flex gap-2">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={t('rulings.typeQuestion')}
            className="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-[#8FBC8F] dark:border-white/10 dark:bg-[#0D1F17] dark:text-cream"
          />
          <button
            type="submit"
            disabled={busy}
            className="rounded-xl bg-[#8FBC8F] px-4 text-sm font-semibold text-white disabled:opacity-50"
          >
            {busy ? '…' : '→'}
          </button>
        </form>

        {busy ? (
          <p className="py-6 text-center text-xs text-ink/50 dark:text-cream/50">
            {t('rulings.aiSummarizing')}
          </p>
        ) : null}
        {error ? <p className="py-6 text-center text-xs text-red-400">{error}</p> : null}

        {answer ? (
          <div className="mt-4 space-y-3">
            {answer.intro ? (
              <p className="text-xs italic text-ink/60 dark:text-cream/60">{answer.intro}</p>
            ) : null}
            {(answer.perspectives ?? []).map((p, i) => (
              <div key={i}>
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#8FBC8F]">
                  {p.label}
                </div>
                <p className="mt-1 text-xs leading-relaxed text-ink/80 dark:text-cream/80">{p.view}</p>
              </div>
            ))}
            {answer.summary ? (
              <p className="text-xs leading-relaxed text-ink/80 dark:text-cream/80">
                {answer.summary}
              </p>
            ) : null}
          </div>
        ) : null}

        {/* Standing disclaimer — ikhtilaf honesty (religion-content standard) */}
        <p className="mt-4 border-t border-gray-100 pt-3 text-[10px] leading-relaxed text-ink/40 dark:border-white/10 dark:text-cream/40">
          {t('rulings.rememberPrefix')}
          {t('rulings.rememberBody')}
          <b>{t('rulings.notFatwaCaps')}</b>
          {t('rulings.rememberTail')}
        </p>
      </div>
    </div>
  )
}
