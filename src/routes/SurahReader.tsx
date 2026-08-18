import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router'
import { ChevronLeft, Settings, Star, Tag } from 'lucide-react'
import {
  fetchChapters,
  fetchReciters,
  loadVerses,
  markVerseKey,
  type Chapter,
  type Reciter,
  type Script,
  type Verse,
} from '@/lib/quran'
import { useQuranFonts } from '@/lib/qcfFonts'
import { useQuranData } from '@/context/QuranDataContext'
import { useI18n } from '@/context/I18nContext'
import { useApp } from '@/context/AppContext'
import { VerseCard } from '@/components/quran/VerseCard'

// Surah reader (web, P0): verse display mode with all four scripts,
// translations, tafsir expansion, favorites/labels/marks, last-read recording.
// Reading mode, audio playback, and word-tap tooltips land in P1.

const SCRIPTS: { id: Script; label: string }[] = [
  { id: 'uthmani', label: 'Uthmani' },
  { id: 'tajweed', label: 'Tajweed' },
  { id: 'indopak', label: 'IndoPak' },
  { id: 'indonesian', label: "Imla'i" },
]

export function SurahReader() {
  const { id } = useParams()
  const surahId = Math.min(Math.max(parseInt(id || '1', 10) || 1, 1), 114)
  const [searchParams] = useSearchParams()
  const jumpVk = searchParams.get('v')
  const navigate = useNavigate()
  const { t } = useI18n()
  const { darkMode } = useApp()
  const { ud, setUD, toggleFav, addLabel, recordLastRead } = useQuranData()

  const [chapters, setChapters] = useState<Chapter[]>([])
  const [reciters, setReciters] = useState<Reciter[]>([])
  const [verses, setVerses] = useState<Verse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [expandedTafsir, setExpandedTafsir] = useState<Set<string>>(new Set())
  const [labelSheetVk, setLabelSheetVk] = useState<string | null>(null)
  const [labelDraft, setLabelDraft] = useState('')
  const topRef = useRef<HTMLDivElement>(null)

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
  }, [verses, jumpVk])

  // Record last-read (throttled to the latest visible verse) + document.title.
  const recordedRef = useRef<string | null>(null)
  useEffect(() => {
    if (!chapter || verses.length === 0) return
    document.title = `${chapter.translated_name?.name || chapter.name_simple} — Sohibna`
    const last = verses[verses.length - 1]
    if (recordedRef.current !== `${surahId}:${last.verse_key}`) {
      recordedRef.current = `${surahId}:${last.verse_key}`
      recordLastRead(surahId, last.verse_key)
    }
  }, [chapter, verses, surahId, recordLastRead])

  const toggleTafsir = useCallback((vk: string) => {
    setExpandedTafsir((prev) => {
      const next = new Set(prev)
      if (next.has(vk)) next.delete(vk)
      else next.add(vk)
      return next
    })
  }, [])

  const marksForVerse = useCallback(
    (vk: string) => {
      const hasMark = Object.entries(ud.lastReadSlots || {}).some(
        ([, v]) => markVerseKey(v) === vk,
      )
      const labels = ud.labels[vk] || []
      return { hasMark, labels, isFav: ud.favorites.includes(vk) }
    },
    [ud],
  )

  const reciterName = useMemo(
    () => reciters.find((r) => r.id === ud.reciterId)?.reciter_name,
    [reciters, ud.reciterId],
  )
  void reciterName

  return (
    <div className="min-h-dvh bg-cream pb-16 dark:bg-night">
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center gap-2 border-b border-black/5 bg-cream/90 px-3 py-2 backdrop-blur dark:border-white/10 dark:bg-night/90">
        <button
          onClick={() => (history.length > 1 ? navigate(-1) : navigate('/quran'))}
          className="rtl-flip flex h-9 w-9 items-center justify-center rounded-full text-ink dark:text-cream"
          aria-label="back"
        >
          <ChevronLeft size={22} />
        </button>
        <div className="min-w-0 flex-1 text-center">
          <div className="truncate text-sm font-bold text-ink dark:text-cream">
            {chapter?.name_simple || `Surah ${surahId}`}
          </div>
          <div className="truncate text-[11px] text-ink/50 dark:text-cream/50">
            {chapter?.translated_name?.name}
            {chapter ? ` · ${chapter.verses_count} ayat` : ''}
          </div>
        </div>
        <button
          onClick={() => setShowSettings(true)}
          className="flex h-9 w-9 items-center justify-center rounded-full text-ink dark:text-cream"
          aria-label="settings"
        >
          <Settings size={20} />
        </button>
      </header>

      {/* Loading / error */}
      {loading ? (
        <div className="flex justify-center py-24">
          <div className="h-8 w-8 animate-pulse rounded-full bg-sage/40" />
        </div>
      ) : error ? (
        <div className="px-6 py-24 text-center text-sm text-red-500">{error}</div>
      ) : (
        <main className="mx-auto max-w-3xl pt-3">
          {/* Surah header card */}
          {chapter ? (
            <div className="mx-3 mb-4 rounded-2xl bg-[#7A9D7A]/15 px-4 py-5 text-center">
              <div className="quran-rtl text-2xl font-bold text-ink dark:text-cream">
                {chapter.name_arabic}
              </div>
              <div className="mt-1 text-xs text-ink/60 dark:text-cream/60">
                {chapter.translated_name?.name} · {chapter.verses_count} ayat ·{' '}
                {chapter.revelation_place === 'makkah' ? 'Makkiyah' : 'Madaniyah'}
              </div>
            </div>
          ) : null}

          {/* Verse cards — content-visibility keeps long surahs cheap. */}
          {verses.map((v) => {
            const m = marksForVerse(v.verse_key)
            return (
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
                  showEnglishTafsir={ud.showEnglishTafsir}
                  showIndoTafsir={ud.showIndoTafsir}
                  isFav={m.isFav}
                  labels={m.labels}
                  hasMark={m.hasMark}
                  isPlaying={false}
                  onToggleFav={(vk) => {
                    toggleFav(vk)
                  }}
                  onPlayVerse={() => {}}
                  onPause={() => {}}
                  tafsirOpen={expandedTafsir.has(v.verse_key)}
                  onToggleTafsir={toggleTafsir}
                  onOpenLabelSheet={(vk) => {
                    setLabelSheetVk(vk)
                    setLabelDraft('')
                  }}
                  onOpenMarkSheet={() => {}}
                />
              </div>
            )
          })}
        </main>
      )}

      {/* Settings sheet */}
      {showSettings ? (
        <ReaderSettings
          onClose={() => setShowSettings(false)}
          script={ud.script}
          onScript={(s) => setUD({ script: s })}
          fontSize={ud.fontSize}
          onFontSize={(n) => setUD({ fontSize: n })}
          showEnglish={ud.showEnglish}
          showIndonesian={ud.showIndonesian}
          showEnglishTafsir={ud.showEnglishTafsir}
          showIndoTafsir={ud.showIndoTafsir}
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
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (!labelDraft.trim() || !labelSheetVk) return
                addLabel(labelSheetVk, labelDraft.trim())
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
      <ScrollTopFab topRef={topRef} />
    </div>
  )
}

function ScrollTopFab({ topRef }: { topRef: React.RefObject<HTMLDivElement | null> }) {
  const [show, setShow] = useState(false)
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
      aria-label="scroll to top"
    >
      ↑
    </button>
  )
}

// Reader settings sheet — script + font size + translation toggles.
function ReaderSettings({
  onClose,
  script,
  onScript,
  fontSize,
  onFontSize,
  showEnglish,
  showIndonesian,
  showEnglishTafsir,
  showIndoTafsir,
  onToggle,
}: {
  onClose: () => void
  script: Script
  onScript: (s: Script) => void
  fontSize: number
  onFontSize: (n: number) => void
  showEnglish: boolean
  showIndonesian: boolean
  showEnglishTafsir: boolean
  showIndoTafsir: boolean
  onToggle: (patch: {
    showEnglish?: boolean
    showIndonesian?: boolean
    showEnglishTafsir?: boolean
    showIndoTafsir?: boolean
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
            label={t('readerSettings.enTafsirOpt')}
            on={showEnglishTafsir}
            onChange={(v) => onToggle({ showEnglishTafsir: v })}
          />
          <Toggle
            label={t('readerSettings.idTafsirOpt')}
            on={showIndoTafsir}
            onChange={(v) => onToggle({ showIndoTafsir: v })}
          />
        </div>

        <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
          {t('readerSettings.preview')}
        </div>
        {/* Preview */}
        <div className="quran-rtl mt-4 rounded-xl bg-black/5 px-4 py-4 text-center text-xl dark:bg-white/10">
          <Star size={0} className="hidden" />
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
