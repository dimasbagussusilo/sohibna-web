import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { Search, Sparkles, ChevronLeft } from 'lucide-react'
import { fetchChapters, searchVerses, type Chapter, type VerseSearchHit } from '@/lib/quran'
import { findRelatedVerses, type RelatedVerse } from '@/api'
import { useI18n } from '@/context/I18nContext'
import { contentLangFor } from '@/i18n/contentLang'

// Quran search (web port): surahs (filter) / verses (translation search via the
// quran.com proxy) / ✨ AI (findRelatedVerses — server-validated real verses).
export function QuranSearch() {
  const { t, lang } = useI18n()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialQ = searchParams.get('q') ?? ''
  const [tab, setTab] = useState<'surahs' | 'verses' | 'ai'>(
    initialQ ? 'verses' : 'surahs',
  )
  const [query, setQuery] = useState(initialQ)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [verseHits, setVerseHits] = useState<VerseSearchHit[] | null>(null)
  const [verseTotal, setVerseTotal] = useState(0)
  const [searching, setSearching] = useState(false)
  const [aiTopic, setAiTopic] = useState('')
  const [aiResults, setAiResults] = useState<RelatedVerse[] | null>(null)
  const [aiBusy, setAiBusy] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchChapters()
      .then(setChapters)
      .catch(() => {})
    inputRef.current?.focus()
  }, [])

  // Debounced verse search
  useEffect(() => {
    if (tab !== 'verses') return
    const q = query.trim()
    if (q.length < 2) {
      setVerseHits(null)
      return
    }
    setSearching(true)
    const id = setTimeout(() => {
      const cl = contentLangFor(lang) === 'id' ? 'id' : 'en'
      searchVerses(q, cl)
        .then((r) => {
          setVerseHits(r.hits)
          setVerseTotal(r.total)
        })
        .catch(() => setVerseHits([]))
        .finally(() => setSearching(false))
    }, 450)
    return () => clearTimeout(id)
  }, [query, tab, lang])

  const runAi = async (e: React.FormEvent) => {
    e.preventDefault()
    const topic = aiTopic.trim()
    if (!topic) return
    setAiBusy(true)
    setAiError(null)
    setAiResults(null)
    try {
      const r = await findRelatedVerses(topic, lang)
      setAiResults(r.related)
    } catch (err) {
      const msg = (err as Error).message || ''
      setAiError(
        msg.includes('not configured') || msg.includes('503')
          ? t('quranSearch.aiError')
          : t('quranSearch.aiError'),
      )
    } finally {
      setAiBusy(false)
    }
  }

  const q = query.trim().toLowerCase()
  const filteredChapters = q
    ? chapters.filter(
        (c) =>
          c.name_simple.toLowerCase().includes(q) ||
          (c.translated_name?.name || '').toLowerCase().includes(q) ||
          String(c.id) === q,
      )
    : chapters

  const goVerse = (vk: string) => {
    const [sid] = vk.split(':')
    navigate(`/surah/${sid}?v=${encodeURIComponent(vk)}`)
  }

  return (
    <div className="min-h-dvh bg-cream dark:bg-night">
      <header className="sticky top-0 z-30 flex items-center gap-2 border-b border-black/5 bg-cream/90 px-3 py-2 backdrop-blur dark:border-white/10 dark:bg-night/90">
        <button
          onClick={() => (history.length > 1 ? navigate(-1) : navigate('/quran'))}
          className="rtl-flip flex h-9 w-9 items-center justify-center rounded-full text-ink dark:text-cream"
          aria-label="back"
        >
          <ChevronLeft size={22} />
        </button>
        <div className="flex flex-1 items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-sm dark:bg-[#122A1F]">
          <Search size={15} className="text-ink/40 dark:text-cream/40" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              if (tab === 'surahs') setTab('verses')
            }}
            placeholder={t('quranSearch.placeholder')}
            className="flex-1 bg-transparent text-sm text-ink outline-none dark:text-cream"
          />
        </div>
      </header>

      {/* Tabs */}
      <div className="mx-auto max-w-3xl px-4 pt-3">
        <div className="mb-4 grid grid-cols-3 gap-1 rounded-xl bg-black/5 p-1 dark:bg-white/10">
          {(
            [
              ['surahs', t('quranSearch.tabSurahs')],
              ['verses', t('quranSearch.tabVerses')],
              ['ai', t('quranSearch.tabAi')],
            ] as const
          ).map(([k, label]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`rounded-lg py-2 text-xs font-semibold ${
                tab === k
                  ? 'bg-white text-ink shadow-sm dark:bg-[#0D1F17] dark:text-cream'
                  : 'text-ink/50 dark:text-cream/50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Surahs tab */}
        {tab === 'surahs' ? (
          <div className="overflow-hidden rounded-3xl bg-white shadow-sm dark:bg-[#122A1F]">
            {filteredChapters.map((c, i) => (
              <button
                key={c.id}
                onClick={() => navigate(`/surah/${c.id}`)}
                className={`flex w-full items-center gap-3 px-4 py-3 text-start ${
                  i > 0 ? 'border-t border-gray-100 dark:border-white/10' : ''
                }`}
              >
                <span className="relative flex h-9 w-9 shrink-0 items-center justify-center">
                  <span className="absolute inset-0 rotate-45 rounded-[10px] bg-[#8FBC8F]/15" />
                  <span className="relative text-xs font-bold text-[#8FBC8F]">{c.id}</span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-ink dark:text-cream">
                    {c.name_simple}
                  </span>
                  <span className="block truncate text-[11px] text-ink/50 dark:text-cream/50">
                    {c.translated_name?.name} · {c.verses_count}
                  </span>
                </span>
                <span className="quran-rtl shrink-0 text-lg text-ink dark:text-cream">
                  {c.name_arabic}
                </span>
              </button>
            ))}
          </div>
        ) : null}

        {/* Verses tab */}
        {tab === 'verses' ? (
          <div>
            {query.trim().length < 2 ? (
              <p className="py-10 text-center text-xs text-ink/40 dark:text-cream/40">
                {t('quranSearch.minChars')}
              </p>
            ) : searching ? (
              <p className="py-10 text-center text-xs text-ink/40 dark:text-cream/40">
                {t('quranSearch.loading')}
              </p>
            ) : verseHits && verseHits.length ? (
              <>
                <p className="mb-2 px-1 text-[10px] uppercase tracking-widest text-ink/40 dark:text-cream/40">
                  {verseTotal} · {query}
                </p>
                <div className="space-y-2">
                  {verseHits.map((h) => (
                    <button
                      key={h.verseKey}
                      onClick={() => goVerse(h.verseKey)}
                      className="block w-full rounded-2xl bg-white p-4 text-start shadow-sm dark:bg-[#122A1F]"
                    >
                      <div className="mb-1.5 font-mono text-[10px] text-[#8FBC8F]">
                        {h.verseKey}
                      </div>
                      <div className="quran-rtl mb-2 text-right text-lg leading-loose text-ink dark:text-cream">
                        {h.arabic}
                      </div>
                      <div className="text-xs leading-relaxed text-ink/70 dark:text-cream/70">
                        {h.translation}
                      </div>
                    </button>
                  ))}
                </div>
              </>
            ) : verseHits ? (
              <p className="py-10 text-center text-xs text-ink/40 dark:text-cream/40">
                {t('quranSearch.noResults', { query })}
              </p>
            ) : null}
          </div>
        ) : null}

        {/* AI tab */}
        {tab === 'ai' ? (
          <div>
            <p className="mb-3 text-xs text-ink/50 dark:text-cream/50">{t('quranSearch.aiHint')}</p>
            <form onSubmit={runAi} className="mb-4 flex gap-2">
              <input
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                placeholder="patience, mercy, gratitude…"
                className="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-[#8FBC8F] dark:border-white/10 dark:bg-[#0D1F17] dark:text-cream"
              />
              <button
                type="submit"
                disabled={aiBusy}
                className="flex items-center gap-1.5 rounded-xl bg-[#8FBC8F] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
              >
                <Sparkles size={14} />
                {aiBusy ? '…' : t('quranSearch.title')}
              </button>
            </form>

            {aiBusy ? (
              <p className="py-8 text-center text-xs text-ink/40 dark:text-cream/40">
                {t('quranSearch.aiLoading')}
              </p>
            ) : null}
            {aiError ? (
              <p className="py-8 text-center text-xs text-red-400">{aiError}</p>
            ) : null}

            {aiResults ? (
              aiResults.length ? (
                <div className="space-y-2">
                  {aiResults.map((r) => (
                    <button
                      key={r.key}
                      onClick={() => goVerse(r.key)}
                      className="block w-full rounded-2xl bg-white p-4 text-start shadow-sm dark:bg-[#122A1F]"
                    >
                      <div className="mb-1.5 font-mono text-[10px] text-[#8FBC8F]">{r.key}</div>
                      <div className="quran-rtl mb-2 text-right text-lg leading-loose text-ink dark:text-cream">
                        {r.arabic}
                      </div>
                      <div className="text-xs leading-relaxed text-ink/70 dark:text-cream/70">
                        {r.translation}
                      </div>
                      {r.reason ? (
                        <div className="mt-2 border-t border-gray-100 pt-2 text-[11px] italic text-ink/40 dark:border-white/10 dark:text-cream/40">
                          {r.reason}
                        </div>
                      ) : null}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="py-8 text-center text-xs text-ink/40 dark:text-cream/40">
                  {t('quranSearch.aiError')}
                </p>
              )
            ) : null}
          </div>
        ) : null}

        <div className="py-6 text-center">
          <Link to="/quran" className="text-xs text-ink/40 underline dark:text-cream/40">
            ← {t('tabs.quran')}
          </Link>
        </div>
      </div>
    </div>
  )
}
