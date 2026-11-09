import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router'
import { BookOpenText, ChevronLeft, Download, List, Search, Settings, Tag } from 'lucide-react'
import {
  ensureSegments,
  fetchChapters,
  fetchReciters,
  loadVerses,
  markVerseKey,
  resolveVersePage,
  type Chapter,
  type Reciter,
  type Script,
  type Verse,
  type VerseSegments,
} from '@/lib/quran'
import { surahStartPage } from '@/lib/mushafLayout'
import { labelPresetNames } from '@/lib/quranPresets'
import { useQuranFonts } from '@/lib/qcfFonts'
import { MushafPager } from '@/components/quran/mushaf/MushafPager'
import type { MushafPageModel } from '@/lib/mushafPage'
import { useQuranData } from '@/context/QuranDataContext'
import { useI18n } from '@/context/I18nContext'
import { useApp } from '@/context/AppContext'
import { contentLangFor, tafsirLangFor } from '@/i18n/contentLang'
import { VerseCard } from '@/components/quran/VerseCard'
import { AudioSettingsSheet } from '@/components/quran/AudioSettingsSheet'
import { ReadingMarkSheet } from '@/components/quran/ReadingMarkSheet'
import { DashboardSheet } from '@/components/quran/DashboardSheet'
import { DownloadSheet } from '@/components/quran/DownloadSheet'
import { AudioPlayerBar } from '@/components/AudioPlayerBar'
import { useQuranAudio } from '@/hooks/useQuranAudio'
import { useQuranContentLang, flagsAreCanonical } from '@/hooks/useQuranContentLang'
import { useHotkeys } from '@/hooks/useHotkeys'
import { uuidv4 } from '@/lib/uuid'

// Surah reader (web, P0): verse display mode with all four scripts,
// translations, tafsir expansion, favorites/labels/marks, last-read recording.
// Reading mode, audio playback, and word-tap tooltips land in P1.

const SCRIPTS: { id: Script; label: string }[] = [
  { id: 'uthmani', label: 'Uthmani' },
  { id: 'tajweed', label: 'Tajweed' },
  { id: 'indopak', label: 'IndoPak' },
  { id: 'indonesian', label: "Imla'i" },
]

// Stable empty labels array — keeps the memoized VerseCards' `labels` prop
// referentially unchanged when a verse has none.
const EMPTY_LABELS: string[] = []

export function SurahReader() {
  const { id } = useParams()
  const surahId = Math.min(Math.max(parseInt(id || '1', 10) || 1, 1), 114)
  const [searchParams] = useSearchParams()
  const jumpVk = searchParams.get('v')
  const navigate = useNavigate()
  const { t, lang } = useI18n()
  const { darkMode } = useApp()
  const { ud, loaded: udLoaded, setUD, toggleFav, addLabel, addCustomLabel, recordLastRead, logReadingSession } =
    useQuranData()

  // ── Quran content language follows the app language ──────────────────────
  // Translation + tafsir default to the app language; a manual pick in Reader
  // Settings sets contentLangOverride (then we leave the flags alone); changing
  // the app language on the Me page clears the override + resets to canonical.
  // See hooks/useQuranContentLang.
  useQuranContentLang(
    contentLangFor(lang),
    setUD,
    udLoaded,
    ud.contentLangOverride,
    flagsAreCanonical(ud, contentLangFor(lang)),
    ud.displayMode,
  )

  // Tafsir fallback for the un-gated TAFSIR row on verse cards: when ALL
  // tafsir toggles are off, expanding fetches this language (follows the app
  // language; Turkish has its own machine-translated tafsir arm — İbn Kesir
  // 9334 — so tr no longer collapses to English), so tafsir is never a dead
  // end. The settings toggles keep their meaning (which languages to show
  // when on).
  const fallbackTafsirLang = tafsirLangFor(lang)

  const [chapters, setChapters] = useState<Chapter[]>([])
  const [reciters, setReciters] = useState<Reciter[]>([])
  const [verses, setVerses] = useState<Verse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [expandedTafsir, setExpandedTafsir] = useState<Set<string>>(new Set())
  const [labelSheetVk, setLabelSheetVk] = useState<string | null>(null)
  const [labelDraft, setLabelDraft] = useState('')
  // Built-in one-tap labels — hidden once known (applied to this verse or
  // already in the library).
  const knownLabels = labelSheetVk
    ? [...(ud.labels[labelSheetVk] ?? []), ...ud.labelLibrary]
    : []
  const labelSuggestions = labelPresetNames(t).filter(
    (l) => !knownLabels.some((x) => x.toLowerCase() === l.toLowerCase()),
  )
  const [showAudioSettings, setShowAudioSettings] = useState(false)
  const [segments, setSegments] = useState<Map<string, VerseSegments>>(new Map())
  const [activeWordKey, setActiveWordKey] = useState<string | null>(null)
  const [markSheetVk, setMarkSheetVk] = useState<string | null>(null)
  const [showDash, setShowDash] = useState(false)
  const [sideQuery, setSideQuery] = useState('')
  const [showDownload, setShowDownload] = useState(false)
  const lastReadVkRef = useRef<string | null>(null)

  const topRef = useRef<HTMLDivElement>(null)

  // ── Mushaf mode ─────────────────────────────────────────────────────────────
  // Web's second display mode: the traditional Madinah 15-line mushaf with
  // horizontal page-swipe (see components/quran/mushaf/). `displayMode` is a
  // synced setting (cross-device with the app). URL params are ONE-TIME seeds:
  // ?mode=mushaf switches mode, ?page=N / ?v=2:255 pick the opening page —
  // mode changes in the UI never rewrite the URL (no history churn).
  const mushafMode = ud.displayMode === 'mushaf'
  const [mushafPage, setMushafPage] = useState(() => surahStartPage(surahId) || 1)
  const seedDoneRef = useRef(false)
  useEffect(() => {
    if (seedDoneRef.current) return
    seedDoneRef.current = true
    const mode = searchParams.get('mode')
    const pageParam = parseInt(searchParams.get('page') || '', 10)
    if (mode === 'mushaf' && ud.displayMode !== 'mushaf') setUD({ displayMode: 'mushaf' })
    if (Number.isInteger(pageParam) && pageParam >= 1 && pageParam <= 604) {
      setMushafPage(pageParam)
      return
    }
    if (jumpVk) {
      resolveVersePage(jumpVk).then((p) => {
        if (p) setMushafPage(p)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Mushaf settle: record lastRead at the page's last verse + feed the session
  // tracker (mirrors the scroll-driven recording of verse mode).
  const onMushafSettle = useCallback(
    (_page: number, model: MushafPageModel | null) => {
      if (!model?.lastVk) return
      lastReadVkRef.current = model.lastVk
      recordLastRead(parseInt(model.lastVk.split(':')[0], 10), model.lastVk)
    },
    [recordLastRead],
  )

  const chaptersById = useMemo(() => {
    const m: Record<number, Chapter> = {}
    for (const c of chapters) m[c.id] = c
    return m
  }, [chapters])

  const webMarks = useMemo(() => {
    const m: Record<string, 'fav' | 'bk' | 'label'> = {}
    for (const vk of ud.favorites) m[vk] = 'fav'
    for (const slot of Object.values(ud.lastReadSlots)) {
      const vk = markVerseKey(slot)
      if (vk && !m[vk]) m[vk] = 'bk'
    }
    for (const vk of Object.keys(ud.labels)) {
      if (ud.labels[vk]?.length && !m[vk]) m[vk] = 'label'
    }
    return m
  }, [ud.favorites, ud.lastReadSlots, ud.labels])

  const audio = useQuranAudio(verses, ud.reciterId, ud.audioRate, {
    mode: ud.repeatMode,
    count: ud.repeatCount,
    rangeFrom: ud.repeatRangeFrom,
    rangeTo: ud.repeatRangeTo,
  })
  // Stable subscription handle (useQuranAudio memoizes it) — referenced
  // directly below so the tick subscription doesn't re-create on re-renders.
  const subscribeAudioPos = audio.subscribePos

  // Word-by-word sync: load the reciter's per-word timing map when audio starts.
  useEffect(() => {
    if (!audio.currentVk || !ud.wordHighlight) {
      setActiveWordKey(null)
      return
    }
    let alive = true
    ensureSegments(surahId, ud.reciterId)
      .then((m) => alive && setSegments(m))
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [audio.currentVk, surahId, ud.reciterId, ud.wordHighlight])

  // Map playback position → the active word span key (verse-idx format).
  // Position arrives via the audio subscription (NOT reader state — a tick
  // must never re-render the verse list); React bails out unless the
  // highlighted word actually changes.
  useEffect(() => {
    const vk = audio.currentVk
    if (!vk || !ud.wordHighlight || !audio.isPlaying) {
      if (!audio.isPlaying) setActiveWordKey(null)
      return
    }
    const seg = segments.get(vk)
    if (!seg) return
    const verse = verses.find((v) => v.verse_key === vk)
    if (!verse) return
    // Segment shape: [wordPosition(1-based within WORDS), start_ms, end_ms] —
    // see lib/quran.ts VerseSegments. Pre-map word positions → span keys once
    // per verse instead of walking the word list on every tick.
    const keyByWordPos = new Map<number, string>()
    let n = 0
    for (let i = 0; i < verse.words.length; i++) {
      if (verse.words[i].char_type_name === 'word') {
        n++
        keyByWordPos.set(n, `${vk}-${i}`)
      }
    }
    return subscribeAudioPos((pos) => {
      const t = pos * 1000
      for (const row of seg.segs) {
        if (t >= row[2] && t <= row[3]) {
          const key = keyByWordPos.get(row[1]) ?? null
          setActiveWordKey((prev) => (prev === key ? prev : key))
          return
        }
      }
    })
  }, [audio.currentVk, audio.isPlaying, subscribeAudioPos, segments, ud.wordHighlight, verses])


  const chapter = useMemo(() => chapters.find((c) => c.id === surahId), [chapters, surahId])

  useEffect(() => {
    let alive = true
    fetchChapters()
      .then((cs) => alive && setChapters(cs))
      .catch(() => {})
    fetchReciters()
      .then((rs) => alive && setReciters(rs))
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    let alive = true
    setLoading(true)
    setError(null)
    setVerses([])
    setExpandedTafsir(new Set())
    loadVerses({ kind: 'surah', id: surahId })
      .then((vs) => alive && setVerses(vs))
      .catch(() => alive && setError(t('reader.failedLoad')))
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [surahId, t])

  // Preload the QCF page fonts for the loaded verses (progressive upgrade from
  // the Unicode fallback).
  const fontRev = useQuranFonts(verses, ud.script)
  void fontRev

  // Consume a deep-link ayah jump (?v=2:255) once verses arrive.
  const jumpedRef = useRef(false)
  useEffect(() => {
    if (verses.length === 0 || jumpedRef.current || !jumpVk) return
    jumpedRef.current = true
    const el = document.getElementById(`verse-${CSS.escape(jumpVk)}`)
    el?.scrollIntoView({ block: 'center' })
    focusVkRef.current = jumpVk
  }, [verses, jumpVk])

  // Document.title (previously coupled to the on-load last-read record).
  useEffect(() => {
    if (!chapter) return
    document.title = `${chapter.translated_name?.name || chapter.name_simple} — Sohibna`
  }, [chapter])

  // Scroll-driven last-read: record the topmost visible verse as the user
  // scrolls — NEVER on load. The old on-load record stamped the surah's FINAL
  // verse with a fresh ts, which under latest-activity-wins (0011) would beat
  // every legitimate edit made on other devices. recordLastRead self-dedupes
  // an unchanged verse key; the 200ms throttle (+ trailing call) bounds layout
  // reads and still captures the final resting position.
  useEffect(() => {
    if (verses.length === 0) return
    const recordTopVerse = () => {
      // Verse cards are stacked in document order, so their absolute tops are
      // monotonic — binary search for the last card starting above the line.
      const line = window.scrollY + 96
      let lo = 0
      let hi = verses.length - 1
      let idx = 0
      while (lo <= hi) {
        const mid = (lo + hi) >> 1
        const el = document.getElementById(`verse-${verses[mid].verse_key}`)
        if (!el) return
        if (el.getBoundingClientRect().top + window.scrollY <= line) {
          idx = mid
          lo = mid + 1
        } else {
          hi = mid - 1
        }
      }
      lastReadVkRef.current = verses[idx].verse_key
      recordLastRead(surahId, verses[idx].verse_key)
    }
    let lastRun = 0
    let trailing: number | undefined
    const onScroll = () => {
      if (performance.now() - lastRun >= 200) {
        lastRun = performance.now()
        recordTopVerse()
      } else {
        window.clearTimeout(trailing)
        trailing = window.setTimeout(recordTopVerse, 200)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.clearTimeout(trailing)
    }
  }, [verses, surahId, recordLastRead])

  // Log a reading session when leaving the surah (≥15s). Sessions recompute
  // the server-side streak + goal progress.
  useEffect(() => {
    const entered = Date.now()
    const sid = surahId
    return () => {
      const seconds = Math.round((Date.now() - entered) / 1000)
      const toVk = lastReadVkRef.current
      if (seconds < 15 || !toVk || parseInt(toVk.split(':')[0], 10) !== sid) return
      logReadingSession({
        id: uuidv4(),
        surah: sid,
        fromVerse: `${sid}:1`,
        toVerse: toVk,
        seconds,
        pages: 1,
      })
    }
  }, [surahId, logReadingSession])

  const toggleTafsir = useCallback((vk: string) => {
    setExpandedTafsir((prev) => {
      const next = new Set(prev)
      if (next.has(vk)) next.delete(vk)
      else next.add(vk)
      return next
    })
  }, [])

  // Per-verse mark state as memoized set lookups, so every VerseCard prop
  // stays referentially stable between renders (the card memo only breaks on
  // a real change for that verse).
  const markedVks = useMemo(() => {
    const s = new Set<string>()
    for (const slot of Object.values(ud.lastReadSlots || {})) {
      const vk = markVerseKey(slot)
      if (vk) s.add(vk)
    }
    return s
  }, [ud.lastReadSlots])
  const favVks = useMemo(() => new Set(ud.favorites), [ud.favorites])

  // Stable per-verse sheet openers (inline arrows would defeat VerseCard memo).
  const openLabelSheet = useCallback((vk: string) => {
    setLabelSheetVk(vk)
    setLabelDraft('')
  }, [])
  const openMarkSheet = useCallback((vk: string) => setMarkSheetVk(vk), [])

  // Reader-local desktop shortcuts (see ShortcutsOverlay for the cheat sheet).
  const focusVkRef = useRef<string | null>(null)
  const stepVerse = useCallback(
    (dir: 1 | -1) => {
      const cur = focusVkRef.current ?? verses[0]?.verse_key
      if (!cur) return
      const idx = verses.findIndex((v) => v.verse_key === cur)
      const target = verses[idx + dir]
      if (!target) return
      focusVkRef.current = target.verse_key
      document
        .getElementById(`verse-${CSS.escape(target.verse_key)}`)
        ?.scrollIntoView({ block: 'center', behavior: 'smooth' })
    },
    [verses],
  )
  useHotkeys([
    { keys: 'j', handler: () => stepVerse(1) },
    { keys: 'k', handler: () => stepVerse(-1) },
    { keys: 'p', handler: () => audio.togglePlay() },
    { keys: '[', handler: () => audio.prev() },
    { keys: ']', handler: () => audio.next() },
    {
      keys: 'f',
      handler: () => {
        const vk = focusVkRef.current ?? audio.currentVk ?? verses[0]?.verse_key
        if (vk) toggleFav(vk)
      },
    },
    { keys: 's', handler: () => setShowSettings((v) => !v) },
    { keys: 'a', handler: () => setShowAudioSettings((v) => !v) },
    {
      keys: 'Escape',
      handler: () => {
        setShowSettings(false)
        setShowAudioSettings(false)
        setShowDash(false)
        setShowDownload(false)
        setLabelSheetVk(null)
        setMarkSheetVk(null)
      },
    },
  ])

  const reciterName = useMemo(
    () => reciters.find((r) => r.id === ud.reciterId)?.reciter_name,
    [reciters, ud.reciterId],
  )

  return (
    <div
      className={`min-h-dvh bg-cream pb-16 dark:bg-night lg:ps-20 ${
        audio.currentVk ? "pb-36" : ""
      }`}
    >
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center gap-2 border-b border-black/5 bg-cream/90 px-3 py-2 backdrop-blur dark:border-white/10 dark:bg-night/90">
        <button
          onClick={() => (history.length > 1 ? navigate(-1) : navigate('/quran'))}
          className="rtl-flip flex h-9 w-9 items-center justify-center rounded-full text-ink dark:text-cream"
          aria-label={t('a11y.back')}
        >
          <ChevronLeft size={22} />
        </button>
        <div className="min-w-0 flex-1 text-center">
          <div className="truncate text-sm font-bold text-ink dark:text-cream">
            {chapter?.name_simple || `Surah ${surahId}`}
          </div>
          <div className="truncate text-[11px] text-ink/50 dark:text-cream/50">
            {chapter?.translated_name?.name}
            {chapter ? ` · ${t('reader.versesCountShort', { n: chapter.verses_count })}` : ''}
          </div>
        </div>
        <button
          onClick={() => setShowDash(true)}
          className="flex h-9 items-center rounded-full bg-black/5 px-3 text-[11px] font-semibold text-ink dark:bg-white/10 dark:text-cream"
        >
          {t('dashboard.myData')}
        </button>
        <button
          onClick={() => setShowDownload(true)}
          className="flex h-9 w-9 items-center justify-center rounded-full text-ink dark:text-cream"
          aria-label={t('a11y.downloads')}
        >
          <Download size={18} />
        </button>
        {/* Verse ↔ Mushaf quick toggle (web's two display modes). */}
        <button
          onClick={() => setUD({ displayMode: mushafMode ? 'verse' : 'mushaf' })}
          className={`flex h-9 w-9 items-center justify-center rounded-full ${
            mushafMode ? 'bg-[#8FBC8F]/15 text-[#8FBC8F]' : 'text-ink dark:text-cream'
          }`}
          aria-label={t('readerSettings.readingMode')}
          aria-pressed={mushafMode}
        >
          {mushafMode ? <List size={18} /> : <BookOpenText size={18} />}
        </button>
        <button
          onClick={() => setShowSettings(true)}
          className="flex h-9 w-9 items-center justify-center rounded-full text-ink dark:text-cream"
          aria-label={t('a11y.settings')}
        >
          <Settings size={20} />
        </button>
      </header>

      {/* Mushaf mode: the horizontal page pager replaces the verse list (and
          the desktop sidebar — the pages want the full width). */}
      {mushafMode ? (
        <div className="h-[calc(100dvh-53px)]">
          <MushafPager
            initialPage={mushafPage}
            dark={darkMode}
            script={ud.script}
            chapters={chaptersById}
            marks={webMarks}
            onSettle={onMushafSettle}
          />
        </div>
      ) : loading ? (
        <div className="flex justify-center py-24">
          <div className="h-8 w-8 animate-pulse rounded-full bg-sage/40" />
        </div>
      ) : error ? (
        <div className="px-6 py-24 text-center text-sm text-red-500">{error}</div>
      ) : (
        <div className="flex">
          {/* Desktop sidebar: searchable surah list */}
          <aside className="sticky top-[53px] hidden h-[calc(100dvh-53px)] w-72 shrink-0 overflow-y-auto border-e border-black/5 px-3 py-4 dark:border-white/10 xl:block">
            <div className="mb-3 flex items-center gap-2 rounded-xl bg-black/5 px-3 py-2 dark:bg-white/10">
              <Search size={13} className="text-ink/40 dark:text-cream/40" />
              <input
                value={sideQuery}
                onChange={(e) => setSideQuery(e.target.value)}
                placeholder={t('quranHome.searchSurah')}
                className="w-full bg-transparent text-xs text-ink outline-none dark:text-cream"
              />
            </div>
            {chapters
              .filter((c) => {
                const q = sideQuery.trim().toLowerCase()
                if (!q) return true
                return (
                  c.name_simple.toLowerCase().includes(q) ||
                  (c.translated_name?.name || '').toLowerCase().includes(q) ||
                  String(c.id) === q
                )
              })
              .map((c) => (
                <button
                  key={c.id}
                  onClick={() => navigate(`/surah/${c.id}`)}
                  className={`flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-start text-xs ${
                    c.id === surahId
                      ? 'bg-[#8FBC8F]/15 font-bold text-[#8FBC8F]'
                      : 'text-ink hover:bg-black/5 dark:text-cream dark:hover:bg-white/10'
                  }`}
                >
                  <span className="w-6 shrink-0 font-mono text-[10px] opacity-50">{c.id}</span>
                  <span className="min-w-0 flex-1 truncate">{c.name_simple}</span>
                  <span className="quran-rtl shrink-0 text-sm">{c.name_arabic}</span>
                </button>
              ))}
          </aside>

          <main className="mx-auto min-w-0 max-w-3xl flex-1 pt-3 xl:max-w-4xl">
          {/* Surah header card */}
          {chapter ? (
            <div className="mx-3 mb-4 rounded-2xl bg-[#7A9D7A]/15 px-4 py-5 text-center">
              <div className="quran-rtl text-2xl font-bold text-ink dark:text-cream">
                {chapter.name_arabic}
              </div>
              <div className="mt-1 text-xs text-ink/60 dark:text-cream/60">
                {chapter.translated_name?.name} · {t('reader.versesCountShort', { n: chapter.verses_count })} ·{' '}
                {chapter.revelation_place === 'makkah' ? t('surahInfo.meccan') : t('surahInfo.medinan')}
              </div>
            </div>
          ) : null}

          {/* Verse cards — content-visibility keeps long surahs cheap. */}
          {verses.map((v) => (
            <div
              key={v.verse_key}
              id={`verse-${v.verse_key}`}
              style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 320px' }}
            >
              <VerseCard
                verse={v}
                script={ud.script}
                fontSize={ud.fontSize}
                darkMode={darkMode}
                showEnglish={ud.showEnglish}
                showIndonesian={ud.showIndonesian}
                showTurkish={ud.showTurkish}
                showUrdu={ud.showUrdu}
                showEnglishTafsir={ud.showEnglishTafsir}
                showIndoTafsir={ud.showIndoTafsir}
                showTurkishTafsir={ud.showTurkishTafsir}
                showUrduTafsir={ud.showUrduTafsir}
                fallbackTafsirLang={fallbackTafsirLang}
                isFav={favVks.has(v.verse_key)}
                labels={ud.labels[v.verse_key] ?? EMPTY_LABELS}
                hasMark={markedVks.has(v.verse_key)}
                isPlaying={audio.currentVk === v.verse_key && audio.isPlaying}
                onToggleFav={toggleFav}
                onPlayVerse={audio.playVerse}
                onPause={audio.pause}
                activeWordKey={audio.currentVk === v.verse_key ? activeWordKey : null}
                tafsirOpen={expandedTafsir.has(v.verse_key)}
                onToggleTafsir={toggleTafsir}
                onOpenLabelSheet={openLabelSheet}
                onOpenMarkSheet={openMarkSheet}
              />
            </div>
          ))}
        </main>
        </div>
      )}

      {/* Settings sheet */}
      {showSettings ? (
        <ReaderSettings
          onClose={() => setShowSettings(false)}
          script={ud.script}
          onScript={(s) => setUD({ script: s })}
          fontSize={ud.fontSize}
          onFontSize={(n) => setUD({ fontSize: n })}
          displayMode={ud.displayMode}
          onDisplayMode={(m) => setUD({ displayMode: m })}
          showEnglish={ud.showEnglish}
          showIndonesian={ud.showIndonesian}
          showTurkish={ud.showTurkish}
          showUrdu={ud.showUrdu}
          showEnglishTafsir={ud.showEnglishTafsir}
          showIndoTafsir={ud.showIndoTafsir}
          showTurkishTafsir={ud.showTurkishTafsir}
          showUrduTafsir={ud.showUrduTafsir}
          onToggle={(patch) => setUD(patch)}
        />
      ) : null}

      {/* Label quick-sheet */}
      {labelSheetVk ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center">
          <div className="w-full max-w-md rounded-t-3xl bg-white p-4 dark:bg-[#122A1F] sm:rounded-3xl">
            <div className="mb-3 flex items-center gap-2">
              <Tag size={16} className="text-[#8B5CF6]" />
              <span className="text-sm font-bold text-ink dark:text-cream">
                {t('verseCard.label')} · {labelSheetVk}
              </span>
            </div>
            {ud.labelLibrary.length ? (
              <div className="mb-3 flex flex-wrap gap-1.5">
                {ud.labelLibrary.map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      addLabel(labelSheetVk, l)
                      setLabelSheetVk(null)
                    }}
                    className="rounded-full bg-[#8FBC8F]/15 px-2.5 py-1 text-xs font-semibold text-[#8FBC8F]"
                  >
                    {l}
                  </button>
                ))}
              </div>
            ) : null}

            {/* Built-in one-tap labels — the input below stays for custom ones. */}
            {labelSuggestions.length ? (
              <div className="mb-3">
                <div className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  {t('verseCard.suggestions')}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {labelSuggestions.map((l) => (
                    <button
                      key={`preset-${l}`}
                      onClick={() => {
                        if (!labelSheetVk) return
                        addCustomLabel(labelSheetVk, l)
                        setLabelSheetVk(null)
                      }}
                      className="rounded-full bg-[#8B5CF6]/10 px-2.5 py-1 text-xs font-semibold text-[#8B5CF6]"
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (!labelDraft.trim() || !labelSheetVk) return
                addCustomLabel(labelSheetVk, labelDraft.trim())
                setLabelSheetVk(null)
              }}
              className="flex gap-2"
            >
              <input
                value={labelDraft}
                onChange={(e) => setLabelDraft(e.target.value)}
                placeholder={t('verseCard.addLabel')}
                className="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-ink dark:border-white/10 dark:bg-[#0D1F17] dark:text-cream"
              />
              <button
                type="submit"
                className="rounded-xl bg-[#8FBC8F] px-4 py-2 text-sm font-semibold text-white"
              >
                {t('verseCard.label')}
              </button>
            </form>
            <button
              onClick={() => setLabelSheetVk(null)}
              className="mt-3 w-full py-2 text-center text-xs text-ink/50 dark:text-cream/50"
            >
              {t('common.close')}
            </button>
          </div>
        </div>
      ) : null}

      {/* Scroll-to-top FAB (visible after scrolling) */}
      {/* Audio playback bar */}
      <AudioBarWithProgress
        audio={audio}
        title={
          audio.currentVk
            ? `${chapter?.name_simple ?? ''} · ${audio.currentVk}${reciterName ? ` · ${reciterName}` : ''}`
            : null
        }
        rate={ud.audioRate !== 1 ? ud.audioRate : undefined}
        onOpenSettings={() => setShowAudioSettings(true)}
      />

      {markSheetVk ? (
        <ReadingMarkSheet vk={markSheetVk} onClose={() => setMarkSheetVk(null)} />
      ) : null}

      {showDash ? <DashboardSheet onClose={() => setShowDash(false)} /> : null}

      {showDownload ? <DownloadSheet onClose={() => setShowDownload(false)} /> : null}

      {showAudioSettings ? (
        <AudioSettingsSheet
          verses={verses}
          reciters={reciters}
          currentVk={audio.currentVk}
          onClose={() => setShowAudioSettings(false)}
        />
      ) : null}

      <ScrollTopFab topRef={topRef} />
    </div>
  )
}

function ScrollTopFab({ topRef }: { topRef: React.RefObject<HTMLDivElement | null> }) {
  const [show, setShow] = useState(false)
  const { t } = useI18n()
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  void topRef
  if (!show) return null
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-20 end-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-[#8FBC8F] text-white shadow-lg lg:bottom-6"
      aria-label={t('a11y.scrollToTop')}
    >
      ↑
    </button>
  )
}

// The playback bar is the only consumer of per-tick position — subscribe HERE
// so timeupdate re-renders this small component instead of the verse list.
function AudioBarWithProgress({
  audio,
  title,
  rate,
  onOpenSettings,
}: {
  audio: ReturnType<typeof useQuranAudio>
  title: string | null
  rate?: number
  onOpenSettings: () => void
}) {
  const [pos, setPos] = useState(0)
  const { subscribePos, isPlaying, dur, togglePlay, seekTo, stop, prev, next } = audio
  useEffect(() => subscribePos(setPos), [subscribePos])
  return (
    <AudioPlayerBar
      title={title}
      isPlaying={isPlaying}
      pos={pos}
      dur={dur}
      rate={rate}
      onToggle={togglePlay}
      onSeek={seekTo}
      onClose={stop}
      onPrev={prev}
      onNext={next}
      onOpenSettings={onOpenSettings}
    />
  )
}

// Reader settings sheet — script + font size + translation toggles.
function ReaderSettings({
  onClose,
  script,
  onScript,
  fontSize,
  onFontSize,
  displayMode,
  onDisplayMode,
  showEnglish,
  showIndonesian,
  showTurkish,
  showUrdu,
  showEnglishTafsir,
  showIndoTafsir,
  showTurkishTafsir,
  showUrduTafsir,
  onToggle,
}: {
  onClose: () => void
  script: Script
  onScript: (s: Script) => void
  fontSize: number
  onFontSize: (n: number) => void
  displayMode: 'verse' | 'reading' | 'mushaf'
  onDisplayMode: (m: 'verse' | 'reading' | 'mushaf') => void
  showEnglish: boolean
  showIndonesian: boolean
  showTurkish: boolean
  showUrdu: boolean
  showEnglishTafsir: boolean
  showIndoTafsir: boolean
  showTurkishTafsir: boolean
  showUrduTafsir: boolean
  onToggle: (patch: {
    showEnglish?: boolean
    showIndonesian?: boolean
    showTurkish?: boolean
    showUrdu?: boolean
    showEnglishTafsir?: boolean
    showIndoTafsir?: boolean
    showTurkishTafsir?: boolean
    showUrduTafsir?: boolean
  }) => void
}) {
  const { t } = useI18n()
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-t-3xl bg-white p-5 dark:bg-[#122A1F] sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-bold text-ink dark:text-cream">
            {t('readerSettings.title')}
          </span>
          <button onClick={onClose} className="text-xs text-ink/50 dark:text-cream/50">
            {t('common.close')}
          </button>
        </div>

        {/* Reading mode — web offers verse + the traditional mushaf view. */}
        <div className="mb-4">
          <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            {t('readerSettings.readingMode')}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(['verse', 'mushaf'] as const).map((m) => (
              <button
                key={m}
                onClick={() => onDisplayMode(m)}
                className={`rounded-xl px-3 py-2.5 text-sm ${
                  displayMode === m
                    ? 'bg-[#8FBC8F] font-semibold text-white'
                    : 'bg-black/5 text-ink dark:bg-white/10 dark:text-cream'
                }`}
              >
                {m === 'verse' ? t('readerSettings.readingModeVerse') : t('readerSettings.readingModeMushaf')}
              </button>
            ))}
          </div>
          <div className="mt-2 text-xs leading-relaxed text-gray-400">
            {displayMode === 'mushaf'
              ? t('readerSettings.readingModeHintMushaf')
              : t('readerSettings.readingModeHint')}
          </div>
        </div>

        {/* Script */}
        <div className="mb-4">
          <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            {t('readerSettings.arabicScript')}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {SCRIPTS.map((s) => (
              <button
                key={s.id}
                onClick={() => onScript(s.id)}
                className={`rounded-xl px-3 py-2.5 text-sm ${
                  script === s.id
                    ? 'bg-[#8FBC8F] font-semibold text-white'
                    : 'bg-black/5 text-ink dark:bg-white/10 dark:text-cream'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Font size */}
        <div className="mb-4">
          <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            {t('readerSettings.fontSize')} · {t('readerSettings.of10', { n: fontSize })}
          </div>
          <input
            type="range"
            min={1}
            max={10}
            step={1}
            value={fontSize}
            onChange={(e) => onFontSize(Number(e.target.value))}
            className="w-full accent-[#8FBC8F]"
          />
        </div>

        {/* Translations */}
        <div className="space-y-2">
          <Toggle
            label={t('readerSettings.enTransOpt')}
            on={showEnglish}
            onChange={(v) => onToggle({ showEnglish: v })}
          />
          <Toggle
            label={t('readerSettings.idTransOpt')}
            on={showIndonesian}
            onChange={(v) => onToggle({ showIndonesian: v })}
          />
          <Toggle
            label={t('readerSettings.trTransOpt')}
            on={showTurkish}
            onChange={(v) => onToggle({ showTurkish: v })}
          />
          <Toggle
            label={t('readerSettings.urTransOpt')}
            on={showUrdu}
            onChange={(v) => onToggle({ showUrdu: v })}
          />
          <Toggle
            label={t('readerSettings.enTafsirOpt')}
            on={showEnglishTafsir}
            onChange={(v) => onToggle({ showEnglishTafsir: v })}
          />
          <Toggle
            label={t('readerSettings.idTafsirOpt')}
            on={showIndoTafsir}
            onChange={(v) => onToggle({ showIndoTafsir: v })}
          />
          <Toggle
            label={t('readerSettings.trTafsirOpt')}
            on={showTurkishTafsir}
            onChange={(v) => onToggle({ showTurkishTafsir: v })}
          />
          <Toggle
            label={t('readerSettings.urTafsirOpt')}
            on={showUrduTafsir}
            onChange={(v) => onToggle({ showUrduTafsir: v })}
          />
        </div>

        <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
          {t('readerSettings.preview')}
        </div>
        {/* Preview */}
        <div className="quran-rtl mt-4 rounded-xl bg-black/5 px-4 py-4 text-center text-xl dark:bg-white/10">
          بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </div>
      </div>
    </div>
  )
}

function Toggle({
  label,
  on,
  onChange,
}: {
  label: string
  on: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      onClick={() => onChange(!on)}
      className="flex w-full items-center justify-between rounded-xl px-1 py-2"
    >
      <span className="text-sm text-ink dark:text-cream">{label}</span>
      <span
        className={`relative h-6 w-11 rounded-full transition-colors ${
          on ? 'bg-[#8FBC8F]' : 'bg-gray-300 dark:bg-white/20'
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
            on ? 'start-[22px]' : 'start-0.5'
          }`}
        />
      </span>
    </button>
  )
}
