import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Search, ChevronRight } from 'lucide-react'
import { fetchChapters, type Chapter } from '@/lib/quran'
import { useQuranData } from '@/context/QuranDataContext'
import { useI18n } from '@/context/I18nContext'

// Quran tab (web, P0): continue-reading card + searchable surah list. The RN
// dashboard also has goals/hafalan/dashboard sheets — those land in P1/P2.

const TOTAL_SURAHS = 114
const POPULAR_IDS = [1, 2, 36, 55, 18, 67, 112, 113]

export function QuranDashboard() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const { ud, reload } = useQuranData()
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [query, setQuery] = useState('')
  void setQuery

  useEffect(() => {
    let alive = true
    fetchChapters()
      .then((cs) => alive && setChapters(cs))
      .catch(() => {})
    reload()
    return () => {
      alive = false
    }
  }, [reload])

  // Continue reading: the most recently stamped lastRead slot/entry.
  const continueReading = useMemo(() => {
    const entries = Object.entries(ud.lastRead)
    if (!entries.length) return null
    entries.sort((a, b) => (b[1].timestamp ?? 0) - (a[1].timestamp ?? 0))
    const [surahStr, info] = entries[0]
    const surah = parseInt(surahStr, 10)
    const ch = chapters.find((c) => c.id === surah)
    return ch
      ? {
          surah,
          name: ch.name_simple,
          arabic: ch.name_arabic,
          translated: ch.translated_name?.name,
          verseKey: info.verseKey,
        }
      : null
  }, [ud.lastRead, chapters])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return chapters
    return chapters.filter(
      (c) =>
        c.name_simple.toLowerCase().includes(q) ||
        (c.translated_name?.name || '').toLowerCase().includes(q) ||
        String(c.id) === q,
    )
  }, [chapters, query])

  const popular = useMemo(
    () => POPULAR_IDS.map((id) => chapters.find((c) => c.id === id)).filter(Boolean) as Chapter[],
    [chapters],
  )

  return (
    <div className="mx-auto max-w-3xl px-4 pt-5">
      <h1 className="mb-4 text-xl font-bold text-ink dark:text-cream">{t('tabs.quran')}</h1>

      {/* Search */}
      <Link
        to="/quran-search"
        className="mb-5 flex items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-sm dark:bg-[#122A1F]"
      >
        <Search size={16} className="text-ink/40 dark:text-cream/40" />
        <span className="flex-1 text-sm text-ink/40 dark:text-cream/40">
          {t('quranHome.searchEntry')}
        </span>
      </Link>

      {/* Continue reading */}
      {continueReading && !query ? (
        <Link
          to={`/surah/${continueReading.surah}?v=${encodeURIComponent(continueReading.verseKey)}`}
          className="mb-5 flex items-center gap-3 rounded-3xl bg-night px-5 py-4 text-cream dark:bg-[#163024]"
        >
          <div className="min-w-0 flex-1">
            <div className="text-[10px] uppercase tracking-widest text-cream/50">
              {t('quranHome.continueReading')}
            </div>
            <div className="mt-0.5 truncate text-sm font-bold">
              {continueReading.name} · {continueReading.translated}
            </div>
            <div className="text-xs text-cream/60">
              {t('quranHome.verseOf', { n: continueReading.verseKey.split(':')[1], total: '—' })}
            </div>
          </div>
          <div className="quran-rtl text-xl">{continueReading.arabic}</div>
        </Link>
      ) : null}

      {/* Popular surahs */}
      {!query && popular.length ? (
        <div className="mb-5">
          <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-ink/40 dark:text-cream/40">
            {t('quranHome.popularSurah')}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {popular.map((c) => (
              <button
                key={c.id}
                onClick={() => navigate(`/surah/${c.id}`)}
                className="rounded-2xl bg-white px-2 py-3 text-center shadow-sm dark:bg-[#122A1F]"
              >
                <div className="quran-rtl text-base text-ink dark:text-cream">{c.name_arabic}</div>
                <div className="mt-0.5 truncate text-[10px] text-ink/50 dark:text-cream/50">
                  {c.name_simple}
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {/* Hafalan + goals quick cards */}
      <div className="mb-5 grid grid-cols-2 gap-3">
        <Link
          to="/hafalan"
          className="rounded-2xl bg-white px-4 py-4 shadow-sm dark:bg-[#122A1F]"
        >
          <div className="text-sm font-bold text-ink dark:text-cream">{t('hafalan.title')}</div>
          <div className="text-[11px] text-ink/50 dark:text-cream/50">
            {ud.hafalanTargets.filter((x) => !x.archived).length} targets ·{' '}
            {Object.keys(ud.memorized).length} verses
          </div>
        </Link>
        <Link
          to="/quran-goals"
          className="rounded-2xl bg-white px-4 py-4 shadow-sm dark:bg-[#122A1F]"
        >
          <div className="text-sm font-bold text-ink dark:text-cream">{t('goals.title')}</div>
          <div className="text-[11px] text-ink/50 dark:text-cream/50">
            {ud.khatmGoals.length} goals{ud.streak ? ` · ${ud.streak.current}d` : ''}
          </div>
        </Link>
      </div>

      {/* Surah list */}
      <div className="overflow-hidden rounded-3xl bg-white shadow-sm dark:bg-[#122A1F]">
        {filtered.map((c, i) => (
          <button
            key={c.id}
            onClick={() => navigate(`/surah/${c.id}`)}
            className={`flex w-full items-center gap-3 px-4 py-3 text-start ${
              i > 0 ? 'border-t border-gray-100 dark:border-white/10' : ''
            }`}
          >
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center">
              <span className="absolute inset-0 rotate-45 rounded-[10px] bg-[#8FBC8F]/15" />
              <span className="relative text-xs font-bold text-[#8FBC8F]">{c.id}</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-bold text-ink dark:text-cream">
                {c.name_simple}
              </div>
              <div className="truncate text-[11px] text-ink/50 dark:text-cream/50">
                {c.translated_name?.name} · {c.verses_count}
              </div>
            </div>
            <div className="quran-rtl shrink-0 text-lg text-ink dark:text-cream">
              {c.name_arabic}
            </div>
            <ChevronRight size={14} className="rtl-flip shrink-0 text-ink/30 dark:text-cream/30" />
          </button>
        ))}
        {filtered.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-ink/50 dark:text-cream/50">
            {t('quranHome.noMatch', { query })}
          </div>
        ) : null}
      </div>

      <div className="py-4 text-center text-[10px] text-ink/30 dark:text-cream/30">
        {filtered.length} / {TOTAL_SURAHS}
      </div>
    </div>
  )
}
