import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { ChevronLeft, Plus, X } from 'lucide-react'
import {
  fetchChapters,
  loadVerses,
  stripHtml,
  type Chapter,
  type Juz,
  type ReviewOutcome,
  type Verse,
} from '@/lib/quran'
import {
  dueVerses,
  scopeLabel,
  scopeVerseCount,
  targetProgress,
  trackerSource,
} from '@/hafalan/hafalanScope'
import { useQuranData } from '@/context/QuranDataContext'
import { useI18n } from '@/context/I18nContext'
import { useAuth } from '@/context/AuthContext'
import { useApp } from '@/context/AppContext'
import { fetchJuzs } from '@/lib/quran'
import { Sheet } from '@/components/quran/AudioSettingsSheet'

// Hafalan (web port): memorization targets + per-verse memorized state + the
// SM-2 murajaah review queue. Everything syncs through useQuranData.
export function Hafalan() {
  const { t } = useI18n()
  const { user } = useAuth()
  const { toast } = useApp()
  const navigate = useNavigate()
  const { ud, upsertHafalanTarget, removeHafalanTarget, recordReview } = useQuranData()

  const [chapters, setChapters] = useState<Chapter[]>([])
  const [juzs, setJuzs] = useState<Juz[]>([])
  const [showEditor, setShowEditor] = useState(false)
  const [review, setReview] = useState(false)

  useEffect(() => {
    fetchChapters()
      .then(setChapters)
      .catch(() => {})
    fetchJuzs()
      .then(setJuzs)
      .catch(() => {})
  }, [])

  const active = ud.hafalanTargets.filter((x) => !x.archived)
  const due = useMemo(() => dueVerses(ud.memorized), [ud.memorized])
  const memorizedCount = Object.values(ud.memorized).filter((m) => m.status === 'memorized').length
  const learningCount = Object.values(ud.memorized).length - memorizedCount

  return (
    <div className="min-h-dvh bg-cream pb-10 dark:bg-night">
      <header className="sticky top-0 z-30 flex items-center gap-2 border-b border-black/5 bg-cream/90 px-3 py-2 backdrop-blur dark:border-white/10 dark:bg-night/90">
        <button
          onClick={() => (history.length > 1 ? navigate(-1) : navigate('/quran'))}
          className="rtl-flip flex h-9 w-9 items-center justify-center rounded-full text-ink dark:text-cream"
          aria-label="back"
        >
          <ChevronLeft size={22} />
        </button>
        <div className="flex-1 text-center text-sm font-bold text-ink dark:text-cream">
          {t('hafalan.title')}
        </div>
        <button
          onClick={() => setShowEditor(true)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#8FBC8F] text-white"
          aria-label="add target"
        >
          <Plus size={18} />
        </button>
      </header>

      <div className="mx-auto max-w-3xl space-y-4 px-4 pt-4">
        {/* Review queue */}
        <div className="rounded-3xl bg-night px-5 py-5 text-cream dark:bg-[#163024]">
          <div className="text-2xl font-bold">{due.length}</div>
          <div className="text-xs text-cream/60">{t('hafalan.dueCount', { n: due.length })}</div>
          <button
            onClick={() => due.length && setReview(true)}
            disabled={!due.length}
            className="mt-3 w-full rounded-xl bg-[#8FBC8F] py-2.5 text-sm font-bold text-white disabled:opacity-40"
          >
            {t('hafalan.reviewNow')}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Stat label={t('hafalan.memorized')} value={memorizedCount} color="#8FBC8F" />
          <Stat label={t('hafalan.learning')} value={learningCount} color="#d69a5b" />
        </div>

        {!user ? (
          <p className="rounded-2xl bg-black/5 px-4 py-3 text-center text-xs text-ink/50 dark:bg-white/10 dark:text-cream/50">
            {t('hafalan.guestNotice')}
          </p>
        ) : null}

        {/* Targets */}
        {active.length ? (
          <div className="space-y-3">
            {active.map((target) => {
              const total = scopeVerseCount(target, chapters, juzs)
              const prog = targetProgress(target, ud.memorized, chapters, juzs)
              const label = scopeLabel(target, chapters)
              const src = trackerSource(target)
              return (
                <div
                  key={target.id}
                  className="rounded-3xl bg-white p-4 shadow-sm dark:bg-[#122A1F]"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-bold text-ink dark:text-cream">
                        {label}
                      </div>
                      <div className="text-[11px] text-ink/50 dark:text-cream/50">
                        {prog.head}/{prog.total}
                        {total ? ` · ${total} ${t('hafalan.ayat')}` : ''}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {src ? (
                        <button
                          onClick={() =>
                            navigate(
                              `/surah/${(src as { kind: string; id: number }).id}`,
                            )
                          }
                          className="rounded-full bg-[#8FBC8F]/15 px-3 py-1 text-[11px] font-semibold text-[#8FBC8F]"
                        >
                          {t('hafalan.markAyat')}
                        </button>
                      ) : null}
                      <button
                        onClick={() => removeHafalanTarget(target.id)}
                        className="p-1 text-ink/30 dark:text-cream/30"
                        aria-label="delete target"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="h-2 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
                    <div
                      className="h-full rounded-full bg-[#8FBC8F]"
                      style={{
                        width: `${prog.total ? Math.min(100, (prog.head / prog.total) * 100) : 0}%`,
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="rounded-3xl bg-white px-6 py-10 text-center shadow-sm dark:bg-[#122A1F]">
            <div className="text-base font-bold text-ink dark:text-cream">
              {t('hafalan.emptyTitle')}
            </div>
            <p className="mt-1 text-xs text-ink/50 dark:text-cream/50">
              {t('hafalan.emptyBody')}
            </p>
            <button
              onClick={() => setShowEditor(true)}
              className="mt-4 rounded-xl bg-[#8FBC8F] px-5 py-2.5 text-sm font-bold text-white"
            >
              {t('hafalan.add')}
            </button>
          </div>
        )}
      </div>

      {showEditor ? (
        <TargetEditor
          chapters={chapters}
          onClose={() => setShowEditor(false)}
          onSave={(target) => {
            upsertHafalanTarget(target)
            setShowEditor(false)
            toast(t('hafalan.save'))
          }}
        />
      ) : null}

      {review ? (
        <ReviewQueue
          queue={due}
          onClose={() => setReview(false)}
          onGrade={(vk, outcome) => {
            recordReview(vk, outcome)
            toast(t('hafalan.reviewComplete'))
          }}
        />
      ) : null}
    </div>
  )
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-2xl bg-white px-4 py-4 shadow-sm dark:bg-[#122A1F]">
      <div className="text-2xl font-bold" style={{ color }}>
        {value}
      </div>
      <div className="text-[11px] text-ink/50 dark:text-cream/50">{label}</div>
    </div>
  )
}

// ── Target editor ───────────────────────────────────────────────────────────

function TargetEditor({
  chapters,
  onClose,
  onSave,
}: {
  chapters: Chapter[]
  onClose: () => void
  onSave: (target: {
    id: string
    scope: 'surah' | 'juz' | 'range' | 'daily_rate'
    surahId?: number | null
    juzId?: number | null
    rangeFrom?: string | null
    rangeTo?: string | null
    dailyAyahs?: number | null
  }) => void
}) {
  const { t } = useI18n()
  const [scope, setScope] = useState<'surah' | 'juz' | 'range' | 'daily_rate'>('surah')
  const [surahId, setSurahId] = useState(1)
  const [juzId, setJuzId] = useState(30)
  const [rangeSurah, setRangeSurah] = useState(1)
  const [from, setFrom] = useState('1')
  const [to, setTo] = useState('10')
  const [daily, setDaily] = useState('5')

  const save = () => {
    const id = crypto.randomUUID()
    if (scope === 'surah') onSave({ id, scope, surahId, juzId: null })
    else if (scope === 'juz') onSave({ id, scope, surahId: null, juzId })
    else if (scope === 'daily_rate') onSave({ id, scope, surahId: null, juzId: null, dailyAyahs: Number(daily) || 5 })
    else
      onSave({
        id,
        scope,
        surahId: null,
        juzId: null,
        rangeFrom: `${rangeSurah}:${from}`,
        rangeTo: `${rangeSurah}:${to}`,
      })
  }

  const label =
    'text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5 block'

  return (
    <Sheet title={t('hafalan.add')} onClose={onClose}>
      <div className="mb-4 grid grid-cols-4 gap-2">
        {(
          [
            ['surah', t('hafalan.scopeSurah')],
            ['juz', t('hafalan.scopeJuz')],
            ['range', t('hafalan.scopeRange')],
            ['daily_rate', t('hafalan.scopeDailyRate')],
          ] as const
        ).map(([k, l]) => (
          <button
            key={k}
            onClick={() => setScope(k)}
            className={`rounded-xl px-2 py-2.5 text-xs ${
              scope === k
                ? 'bg-[#8FBC8F] font-semibold text-white'
                : 'bg-black/5 text-ink dark:bg-white/10 dark:text-cream'
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      {scope === 'surah' ? (
        <label className="mb-3 block">
          <span className={label}>{t('hafalan.scopeSurah')}</span>
          <select
            value={surahId}
            onChange={(e) => setSurahId(Number(e.target.value))}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm dark:border-white/10 dark:bg-[#0D1F17] dark:text-cream"
          >
            {chapters.map((c) => (
              <option key={c.id} value={c.id}>
                {c.id}. {c.name_simple}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      {scope === 'juz' ? (
        <label className="mb-3 block">
          <span className={label}>{t('hafalan.scopeJuz')}</span>
          <select
            value={juzId}
            onChange={(e) => setJuzId(Number(e.target.value))}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm dark:border-white/10 dark:bg-[#0D1F17] dark:text-cream"
          >
            {Array.from({ length: 30 }, (_, i) => i + 1).map((j) => (
              <option key={j} value={j}>
                Juz {j}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      {scope === 'range' ? (
        <div className="mb-3 space-y-3">
          <label className="block">
            <span className={label}>{t('hafalan.rangeSurah')}</span>
            <select
              value={rangeSurah}
              onChange={(e) => setRangeSurah(Number(e.target.value))}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm dark:border-white/10 dark:bg-[#0D1F17] dark:text-cream"
            >
              {chapters.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id}. {c.name_simple}
                </option>
              ))}
            </select>
          </label>
          <div className="flex gap-2">
            <label className="flex-1">
              <span className={label}>{t('hafalan.rangeFrom')}</span>
              <input
                type="number"
                min={1}
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm dark:border-white/10 dark:bg-[#0D1F17] dark:text-cream"
              />
            </label>
            <label className="flex-1">
              <span className={label}>{t('hafalan.rangeTo')}</span>
              <input
                type="number"
                min={1}
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm dark:border-white/10 dark:bg-[#0D1F17] dark:text-cream"
              />
            </label>
          </div>
        </div>
      ) : null}

      {scope === 'daily_rate' ? (
        <label className="mb-3 block">
          <span className={label}>{t('hafalan.dailyAyahs')}</span>
          <input
            type="number"
            min={1}
            value={daily}
            onChange={(e) => setDaily(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm dark:border-white/10 dark:bg-[#0D1F17] dark:text-cream"
          />
        </label>
      ) : null}

      <button
        onClick={save}
        className="w-full rounded-xl bg-[#8FBC8F] py-3 text-sm font-bold text-white"
      >
        {t('hafalan.save')}
      </button>
    </Sheet>
  )
}

// ── Review queue (SM-2 murajaah) ────────────────────────────────────────────

function ReviewQueue({
  queue,
  onClose,
  onGrade,
}: {
  queue: import('@/lib/quran').MemorizedVerse[]
  onClose: () => void
  onGrade: (verseKey: string, outcome: ReviewOutcome) => void
}) {
  const { t, lang } = useI18n()
  const [i, setI] = useState(0)
  const [verse, setVerse] = useState<Verse | null>(null)
  const [revealed, setRevealed] = useState(false)
  const current = queue[i]

  useEffect(() => {
    if (!current) return
    setVerse(null)
    setRevealed(false)
    loadVerses({ kind: 'surah', id: current.surah })
      .then((vs) => {
        const v = vs.find((x) => x.verse_key === current.verseKey)
        if (v) setVerse(v)
      })
      .catch(() => {})
  }, [current?.verseKey])

  if (!current) {
    return (
      <Sheet title={t('hafalan.reviewNow')} onClose={onClose}>
        <p className="py-10 text-center text-sm text-ink/50 dark:text-cream/50">
          {t('hafalan.reviewComplete')} 🎉
        </p>
      </Sheet>
    )
  }

  const grade = (outcome: ReviewOutcome) => {
    onGrade(current.verseKey, outcome)
    setI((n) => n + 1)
  }

  const en = verse?.translations?.find((tr) => tr.resource_id === 20)
  const id_ = verse?.translations?.find((tr) => tr.resource_id === 33)
  const trans = lang === 'id' ? id_?.text ?? en?.text : en?.text ?? id_?.text

  return (
    <Sheet title={`${t('hafalan.reviewNow')} · ${i + 1}/${queue.length}`} onClose={onClose}>
      <div className="mb-1 text-center font-mono text-xs text-[#8FBC8F]">{current.verseKey}</div>
      <div className="quran-rtl mb-4 rounded-2xl bg-black/5 px-4 py-5 text-center text-xl leading-loose text-ink dark:bg-white/10 dark:text-cream">
        {verse?.text_uthmani ?? '…'}
      </div>
      {revealed ? (
        <p className="mb-4 text-xs leading-relaxed text-ink/70 dark:text-cream/70">
          {trans ? stripHtml(trans) : t('reader.wordNoTranslation')}
        </p>
      ) : (
        <button
          onClick={() => setRevealed(true)}
          className="mb-4 w-full rounded-xl bg-black/5 py-2 text-xs text-ink dark:bg-white/10 dark:text-cream"
        >
          {t('hafalan.revealTranslation')}
        </button>
      )}
      <div className="grid grid-cols-4 gap-2">
        {(
          [
            ['again', t('hafalan.reviewAgain'), '#ef4444'],
            ['hard', t('hafalan.reviewHard'), '#f59e0b'],
            ['good', t('hafalan.reviewGood'), '#8FBC8F'],
            ['easy', t('hafalan.reviewEasy'), '#3b82f6'],
          ] as const
        ).map(([outcome, l, color]) => (
          <button
            key={outcome}
            onClick={() => grade(outcome)}
            className="rounded-xl py-3 text-xs font-bold text-white"
            style={{ backgroundColor: color }}
          >
            {l}
          </button>
        ))}
      </div>
      <div className="mt-3 text-center font-mono text-[10px] text-ink/30 dark:text-cream/30">
        SM-2 · ease {current.ease.toFixed(2)} · {current.intervalDays}d · #{current.reviewCount}
      </div>
    </Sheet>
  )
}
