import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import {
  BookMarked,
  BookOpen,
  Calendar,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Clock,
  LogIn,
  Moon,
  Pencil,
  Plus,
  SlidersHorizontal,
  Timer,
  X,
} from 'lucide-react'
import { fetchGoalsProgress, fetchXp, type GoalType, type GoalUnit, type XpSummary } from '@/api'
import { fetchChapters, type Chapter, type KhatmGoal } from '@/lib/quran'
import { useQuranData } from '@/context/QuranDataContext'
import { useAuth } from '@/context/AuthContext'
import { useI18n } from '@/context/I18nContext'
import { useApp } from '@/context/AppContext'
import { getDeviceId } from '@/lib/deviceId'
import { Sheet } from '@/components/quran/AudioSettingsSheet'
import type { TranslationKey } from '@/i18n/types'

// Reading goals (khatm/daily) — web port. Progress is derived server-side from
// the reading log (fetchGoalsProgress), definitions sync via useQuranData.
// Units mirror the app: time (minutes) / page / verse (distinct ayat anywhere
// in the Qur'an) / range (verses in one surah). The editor + template picker
// match the app's flow: "+" opens the picker, presets prefill the editor.
type Progress = {
  id: string
  type: GoalType
  unit: GoalUnit
  periodProgress: number
  periodTarget: number
  todayProgress: number
  todayTarget: number
  done: boolean
}

// ── Draft (string-based editor shape, like the app's KhatmDraft) ────────────

type Draft = {
  id?: string
  type: GoalType
  unit: GoalUnit
  target: string
  startAt: string // YYYY-MM-DD (duration)
  endAt: string // YYYY-MM-DD (duration)
  rangeSurah: string
  rangeFrom: string
  rangeTo: string
}

// LOCAL wall-clock day (toISOString() is the UTC day and drifts a day in
// evening timezones — a "starts today" goal must start today, local).
const todayStr = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
const addDays = (iso: string, n: number) => {
  const d = new Date(iso + 'T00:00:00')
  d.setDate(d.getDate() + n)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
// RFC3339 at LOCAL midnight with the local offset — new Date(...).toISOString()
// would re-anchor to UTC (17:00 the previous day for UTC+7) and shift the
// goal's whole window.
const localOffset = () => {
  const off = -new Date().getTimezoneOffset()
  const sign = off >= 0 ? '+' : '-'
  const hh = String(Math.floor(Math.abs(off) / 60)).padStart(2, '0')
  const mm = String(Math.abs(off) % 60).padStart(2, '0')
  return `${sign}${hh}:${mm}`
}
const localMidnightRFC = (iso: string) => `${iso}T00:00:00${localOffset()}`

const newDraft = (): Draft => ({
  type: 'daily',
  unit: 'page',
  target: '5',
  startAt: todayStr(),
  endAt: addDays(todayStr(), 6),
  rangeSurah: '67',
  rangeFrom: '1',
  rangeTo: '30',
})

const editDraft = (g: KhatmGoal): Draft => ({
  id: g.id,
  type: g.type,
  unit: g.unit,
  target: String(g.target),
  startAt: g.startAt ? g.startAt.slice(0, 10) : todayStr(),
  endAt: g.endAt ? g.endAt.slice(0, 10) : addDays(todayStr(), 6),
  rangeSurah: g.rangeFrom ? g.rangeFrom.split(':')[0] : '67',
  rangeFrom: g.rangeFrom ? g.rangeFrom.split(':')[1] : '1',
  rangeTo: g.rangeTo ? g.rangeTo.split(':')[1] : '30',
})

// Draft → upsert payload (range target = its verse count, clamped against the
// surah's real count — same semantics as the app's khatmDraftToGoal).
function draftToGoal(d: Draft, chapters: Chapter[]) {
  const isRange = d.unit === 'range'
  const surah = parseInt(d.rangeSurah, 10) || 1
  const cap = chapters.find((c) => c.id === surah)?.verses_count || 286
  let from = Math.max(1, parseInt(d.rangeFrom, 10) || 1)
  let to = Math.min(cap, Math.max(1, parseInt(d.rangeTo, 10) || from))
  if (to < from) [from, to] = [to, from]
  const target = isRange ? to - from + 1 : parseInt(d.target, 10)
  if (!Number.isFinite(target) || target <= 0) return null
  return {
    id: d.id ?? crypto.randomUUID(),
    type: d.type,
    unit: d.unit,
    target,
    rangeFrom: isRange ? `${surah}:${from}` : null,
    rangeTo: isRange ? `${surah}:${to}` : null,
    startAt: d.type === 'duration' && d.startAt ? localMidnightRFC(d.startAt) : undefined,
    endAt: d.type === 'duration' && d.endAt ? localMidnightRFC(d.endAt) : null,
  }
}

// ── One-tap presets (mirrors the app's KHATM_TEMPLATES incl. the "≈ n
// pages/day" realism hints; kept local — the app's module drags RN imports). ──

type Preset = {
  id: string
  titleKey: TranslationKey
  icon: typeof BookOpen
  pagesPerDay?: number
  build: () => Draft
}

const PRESETS: Preset[] = [
  { id: 'daily10Verses', titleKey: 'goals.templates.daily10Verses', icon: BookOpen, pagesPerDay: 1, build: () => ({ ...newDraft(), unit: 'verse', target: '10' }) },
  { id: 'daily25Verses', titleKey: 'goals.templates.daily25Verses', icon: BookOpen, pagesPerDay: 2.5, build: () => ({ ...newDraft(), unit: 'verse', target: '25' }) },
  { id: 'daily50Verses', titleKey: 'goals.templates.daily50Verses', icon: BookMarked, pagesPerDay: 5, build: () => ({ ...newDraft(), unit: 'verse', target: '50' }) },
  { id: 'daily1Page', titleKey: 'goals.templates.daily1Page', icon: BookOpen, pagesPerDay: 1, build: () => ({ ...newDraft(), target: '1' }) },
  { id: 'daily5Pages', titleKey: 'goals.templates.daily5Pages', icon: BookOpen, pagesPerDay: 5, build: () => ({ ...newDraft(), target: '5' }) },
  { id: 'daily1Juz', titleKey: 'goals.templates.daily1Juz', icon: BookMarked, pagesPerDay: 20, build: () => ({ ...newDraft(), target: '20' }) },
  { id: 'daily15Min', titleKey: 'goals.templates.daily15Min', icon: Timer, build: () => ({ ...newDraft(), unit: 'time', target: '15' }) },
  { id: 'daily30Min', titleKey: 'goals.templates.daily30Min', icon: Clock, build: () => ({ ...newDraft(), unit: 'time', target: '30' }) },
  { id: 'khatm30', titleKey: 'goals.templates.khatm30', icon: Calendar, pagesPerDay: 21, build: () => ({ ...newDraft(), type: 'duration', target: '604', endAt: addDays(todayStr(), 29) }) },
  { id: 'khatm60', titleKey: 'goals.templates.khatm60', icon: CalendarCheck, pagesPerDay: 11, build: () => ({ ...newDraft(), type: 'duration', target: '604', endAt: addDays(todayStr(), 59) }) },
  { id: 'khatm90', titleKey: 'goals.templates.khatm90', icon: CalendarCheck, pagesPerDay: 7, build: () => ({ ...newDraft(), type: 'duration', target: '604', endAt: addDays(todayStr(), 89) }) },
  { id: 'mulk', titleKey: 'goals.templates.mulk', icon: Moon, build: () => ({ ...newDraft(), unit: 'range' }) },
]

const unitShortLabel = (u: GoalUnit, t: ReturnType<typeof useI18n>['t']) =>
  u === 'time' ? t('goals.minutes') : u === 'page' ? t('goals.pages') : t('goals.verses')

// One-line description for a preset card (mirrors khatmTemplateSubtitle).
function templateSubtitle(d: Draft, t: ReturnType<typeof useI18n>['t']): string {
  if (d.unit === 'range') {
    const same = d.rangeFrom === d.rangeTo
    return `${d.rangeSurah}:${d.rangeFrom}${same ? '' : '–' + d.rangeTo} · ${t('goals.typeDaily')}`
  }
  if (d.type === 'duration') {
    const days =
      Math.round(
        (new Date(d.endAt + 'T00:00:00').getTime() - new Date(d.startAt + 'T00:00:00').getTime()) /
          86_400_000,
      ) + 1
    return `${d.target} ${unitShortLabel(d.unit, t)} · ${days} ${t('goals.templates.days')}`
  }
  return `${d.target} ${unitShortLabel(d.unit, t)} · ${t('goals.typeDaily')}`
}

function goalTitle(type: GoalType, unit: GoalUnit, target: number, t: ReturnType<typeof useI18n>['t']) {
  const unitLabel = unitShortLabel(unit, t)
  if (type === 'daily') return `${target} ${unitLabel} / ${t('goals.typeDaily')}`
  return `${target} ${unitLabel} · ${t('goals.typeDuration')}`
}

export function QuranGoals() {
  const { t } = useI18n()
  const { toast, askConfirm } = useApp()
  const navigate = useNavigate()
  const { user, token } = useAuth()
  const { ud, upsertKhatmGoal, removeKhatmGoal } = useQuranData()
  const [progress, setProgress] = useState<Progress[] | null>(null)
  const [xp, setXp] = useState<XpSummary | null>(null)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [picking, setPicking] = useState(false)
  const [draft, setDraft] = useState<Draft | null>(null)

  const streakDay = ud.streak?.lastReadDate ?? ''
  const refresh = useCallback(() => {
    if (!token) return
    fetchGoalsProgress(getDeviceId())
      .then(setProgress)
      .catch(() => setProgress([]))
    fetchXp(getDeviceId())
      .then(setXp)
      .catch(() => {}) // old API / offline — the level chip just hides
  }, [token])

  useEffect(() => {
    refresh()
    fetchChapters()
      .then(setChapters)
      .catch(() => {})
  }, [refresh, ud.khatmGoals.length, streakDay])

  const save = () => {
    if (!draft) return
    const goal = draftToGoal(draft, chapters)
    if (!goal) return
    upsertKhatmGoal(goal)
    setDraft(null)
    toast(t('goals.save'))
  }

  // Destructive delete goes through the themed confirm (never window.confirm).
  const onDelete = (g: KhatmGoal) => {
    askConfirm({ title: t('goals.deleteTitle'), message: t('goals.deleteBody'), destructive: true }).then(
      (ok) => {
        if (ok) removeKhatmGoal(g.id)
      },
    )
  }

  const rangeDesc = (g: KhatmGoal) => {
    if (!g.rangeFrom || !g.rangeTo) return ''
    const surah = parseInt(g.rangeFrom.split(':')[0], 10)
    const name = chapters.find((c) => c.id === surah)?.name_simple || t('quranHome.surahN', { n: surah })
    const a = g.rangeFrom.split(':')[1]
    const b = g.rangeTo.split(':')[1]
    return `${name} ${a}:${b === a ? a : a + '–' + b}`
  }

  // Reading goals are account-synced — the feature requires login; a guest
  // sees a login prompt (full-screen gate, hafalan-style). Placed after all
  // hooks so hook order stays unconditional.
  if (!user) {
    return (
      <div className="min-h-dvh bg-cream pb-10 dark:bg-night lg:ps-20">
        <header className="sticky top-0 z-30 flex items-center gap-2 border-b border-black/5 bg-cream/90 px-3 py-2 backdrop-blur dark:border-white/10 dark:bg-night/90">
          <button
            onClick={() => (history.length > 1 ? navigate(-1) : navigate('/quran'))}
            className="rtl-flip flex h-9 w-9 items-center justify-center rounded-full text-ink dark:text-cream"
            aria-label={t('a11y.back')}
          >
            <ChevronLeft size={22} />
          </button>
          <div className="flex-1 text-center text-sm font-bold text-ink dark:text-cream">
            {t('goals.title')}
          </div>
          {/* No add button for guests — goals require an account. */}
        </header>
        <div className="mx-auto flex max-w-md flex-col items-center px-6 pt-16 text-center">
          <div className="flex items-center gap-3 rounded-2xl border border-[#8FBC8F]/30 bg-[#8FBC8F]/10 px-4 py-4">
            <LogIn size={18} className="shrink-0 text-[#8FBC8F]" />
            <span className="text-xs text-ink/70 dark:text-cream/70">{t('goals.guestNotice')}</span>
          </div>
          <Link to="/login" className="mt-3 text-sm font-bold text-[#8FBC8F]">
            {t('quranHome.guestLogin')} →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-cream pb-10 dark:bg-night lg:ps-20">
      <header className="sticky top-0 z-30 flex items-center gap-2 border-b border-black/5 bg-cream/90 px-3 py-2 backdrop-blur dark:border-white/10 dark:bg-night/90">
        <button
          onClick={() => (history.length > 1 ? navigate(-1) : navigate('/quran'))}
          className="rtl-flip flex h-9 w-9 items-center justify-center rounded-full text-ink dark:text-cream"
          aria-label={t('a11y.back')}
        >
          <ChevronLeft size={22} />
        </button>
        <div className="flex-1 text-center text-sm font-bold text-ink dark:text-cream">
          {t('goals.title')}
        </div>
        <button
          onClick={() => setPicking(true)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#8FBC8F] text-white"
          aria-label={t('a11y.addGoal')}
        >
          <Plus size={18} />
        </button>
      </header>

      <div className="mx-auto max-w-3xl space-y-3 px-4 pt-4 lg:max-w-4xl">
        {/* Streak */}
        {ud.streak ? (
          <div className="rounded-3xl bg-night px-5 py-5 text-cream dark:bg-[#163024]">
            <div className="text-2xl font-bold">
              {t('quranHome.dayStreak', { n: ud.streak.current })}
            </div>
            <div className="text-xs text-cream/60">
              {t('quranHome.streakTotalPages', { n: ud.streak.totalPages })} ·{' '}
              {t('quranHome.streakLongest', { n: ud.streak.longest })}
            </div>
            {xp ? (
              <Link
                to="/leaderboard"
                className="mt-3 block rounded-2xl bg-black/20 px-3 py-2 dark:bg-black/30"
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs font-bold">✨ {t('xp.level', { n: xp.level })}</span>
                  <span className="text-[10px] text-cream/60">
                    {t('xp.progress', { cur: xp.total, next: xp.levelCeiling })}
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-black/30">
                  <div
                    className="h-full rounded-full bg-amber-500"
                    style={{
                      width: `${Math.round(
                        Math.min(
                          100,
                          Math.max(
                            0,
                            ((xp.total - xp.levelFloor) /
                              Math.max(1, xp.levelCeiling - xp.levelFloor)) *
                              100,
                          ),
                        ),
                      )}%`,
                    }}
                  />
                </div>
                <span className="mt-1 block text-[10px] text-cream/60">
                  {t('xp.weekPoints', { n: xp.weekPoints })}
                </span>
              </Link>
            ) : null}
          </div>
        ) : null}

        {ud.khatmGoals.length ? (
          ud.khatmGoals.map((g) => {
            const p = progress?.find((x) => x.id === g.id)
            const todayPct = p && p.todayTarget > 0 ? Math.min(100, (p.todayProgress / p.todayTarget) * 100) : 0
            const periodPct =
              p && p.periodTarget > 0 ? Math.min(100, (p.periodProgress / p.periodTarget) * 100) : 0
            return (
              <div key={g.id} className="rounded-3xl bg-white p-4 shadow-sm dark:bg-[#122A1F]">
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <div className="text-sm font-bold text-ink dark:text-cream">
                      {goalTitle(g.type, g.unit, g.target, t)}
                    </div>
                    <div className="text-[11px] text-ink/50 dark:text-cream/50">
                      {p
                        ? `${Math.round(p.todayProgress)}/${p.todayTarget} ${unitShortLabel(g.unit, t)} ${t('goals.today')}`
                        : '…'}
                    </div>
                    {g.unit === 'range' ? (
                      <div className="text-[11px] text-[#8FBC8F]">{rangeDesc(g)}</div>
                    ) : null}
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={() => setDraft(editDraft(g))}
                      className="p-1 text-ink/30 dark:text-cream/30"
                      aria-label={t('goals.edit')}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => onDelete(g)}
                      className="p-1 text-ink/30 dark:text-cream/30"
                      aria-label={t('a11y.deleteGoal')}
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
                {/* Today ring-ish bar + period bar */}
                <div className="space-y-2">
                  <div>
                    <div className="mb-1 flex justify-between text-[10px] uppercase tracking-widest text-ink/40 dark:text-cream/40">
                      <span>{t('goals.today')}</span>
                      <span>{Math.round(todayPct)}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
                      <div className="h-full rounded-full bg-[#8FBC8F]" style={{ width: `${todayPct}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 flex justify-between text-[10px] uppercase tracking-widest text-ink/40 dark:text-cream/40">
                      <span>{t('goals.period')}</span>
                      <span>{Math.round(periodPct)}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
                      <div className="h-full rounded-full bg-[#7A9D7A]" style={{ width: `${periodPct}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="rounded-3xl bg-white px-6 py-10 text-center shadow-sm dark:bg-[#122A1F]">
            <div className="text-base font-bold text-ink dark:text-cream">
              {t('goals.emptyTitle')}
            </div>
            <p className="mt-1 text-xs text-ink/50 dark:text-cream/50">{t('goals.emptyBody')}</p>
            <button
              onClick={() => setPicking(true)}
              className="mt-4 rounded-xl bg-[#8FBC8F] px-5 py-2.5 text-sm font-bold text-white"
            >
              {t('goals.add')}
            </button>
          </div>
        )}
      </div>

      {/* Template picker (create flow) — presets prefill the editor */}
      {picking ? (
        <TemplatePicker
          onClose={() => setPicking(false)}
          onPick={(d) => {
            setDraft(d)
            setPicking(false)
          }}
          onCustom={() => {
            setDraft(newDraft())
            setPicking(false)
          }}
        />
      ) : null}

      {/* Editor sheet (create + edit) */}
      {draft ? (
        <GoalEditor draft={draft} onChange={setDraft} chapters={chapters} onSave={save} onClose={() => setDraft(null)} />
      ) : null}
    </div>
  )
}

function TemplatePicker({
  onClose,
  onPick,
  onCustom,
}: {
  onClose: () => void
  onPick: (d: Draft) => void
  onCustom: () => void
}) {
  const { t } = useI18n()
  return (
    <Sheet title={t('goals.templates.chooseTitle')} onClose={onClose}>
      <p className="mb-3 text-xs text-ink/50 dark:text-cream/50">{t('goals.templates.chooseSub')}</p>
      <div className="space-y-2">
        {PRESETS.map((p) => {
          const d = p.build()
          return (
            <button
              key={p.id}
              onClick={() => onPick(d)}
              className="flex w-full items-center rounded-2xl border border-black/5 bg-black/[0.03] px-4 py-3 text-start dark:border-white/10 dark:bg-white/5"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#8FBC8F]/15 text-[#8FBC8F]">
                <p.icon size={18} />
              </span>
              <span className="ms-3 flex-1">
                <span className="block text-sm font-semibold text-ink dark:text-cream">{t(p.titleKey)}</span>
                <span className="block text-xs text-ink/50 dark:text-cream/50">
                  {templateSubtitle(d, t) +
                    (p.pagesPerDay ? ` · ${t('goals.templates.approxPages', { n: p.pagesPerDay })}` : '')}
                </span>
              </span>
              <ChevronRight size={16} className="rtl-flip text-ink/30 dark:text-cream/30" />
            </button>
          )
        })}
        {/* Custom — opens the editor with defaults */}
        <button
          onClick={onCustom}
          className="flex w-full items-center rounded-2xl border border-dashed border-[#8FBC8F]/40 bg-[#8FBC8F]/10 px-4 py-3 text-start"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#8FBC8F]/20 text-[#8FBC8F]">
            <SlidersHorizontal size={18} />
          </span>
          <span className="ms-3 flex-1">
            <span className="block text-sm font-semibold text-ink dark:text-cream">{t('goals.templates.custom')}</span>
            <span className="block text-xs text-ink/50 dark:text-cream/50">{t('goals.templates.customSub')}</span>
          </span>
        </button>
      </div>
    </Sheet>
  )
}

function GoalEditor({
  draft,
  onChange,
  chapters,
  onSave,
  onClose,
}: {
  draft: Draft
  onChange: (d: Draft) => void
  chapters: Chapter[]
  onSave: () => void
  onClose: () => void
}) {
  const { t } = useI18n()
  const d = draft
  const isRange = d.unit === 'range'
  const cap = chapters.find((c) => c.id === (parseInt(d.rangeSurah, 10) || 1))?.verses_count || 286

  const label = 'text-[10px] font-bold uppercase tracking-widest text-ink/40 dark:text-cream/40 mb-1.5 block'

  const save = () => {
    // Light validity gate (mirrors the app): a target/range must resolve > 0 —
    // draftToGoal re-checks and drops invalid saves.
    const target = isRange
      ? (Math.min(cap, parseInt(d.rangeTo, 10) || 1) - Math.max(1, parseInt(d.rangeFrom, 10) || 1) + 1)
      : parseInt(d.target, 10)
    if (!Number.isFinite(target) || target <= 0) return
    onSave()
  }

  return (
    <Sheet title={d.id ? t('goals.edit') : t('goals.add')} onClose={onClose}>
      <div className="mb-4 grid grid-cols-2 gap-2">
        {(
          [
            ['daily', t('goals.typeDaily')],
            ['duration', t('goals.typeDuration')],
          ] as const
        ).map(([k, l]) => (
          <button
            key={k}
            onClick={() => onChange({ ...d, type: k })}
            className={`rounded-xl px-3 py-2.5 text-sm ${
              d.type === k
                ? 'bg-[#8FBC8F] font-semibold text-white'
                : 'bg-black/5 text-ink dark:bg-white/10 dark:text-cream'
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="mb-4 grid grid-cols-4 gap-2">
        {(
          [
            ['time', t('goals.unitTime')],
            ['page', t('goals.unitPage')],
            ['verse', t('goals.unitVerse')],
            ['range', t('goals.unitRange')],
          ] as const
        ).map(([k, l]) => (
          <button
            key={k}
            onClick={() => onChange({ ...d, unit: k })}
            className={`rounded-xl px-2 py-2.5 text-xs ${
              d.unit === k
                ? 'bg-[#8FBC8F] font-semibold text-white'
                : 'bg-black/5 text-ink dark:bg-white/10 dark:text-cream'
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      {!isRange ? (
        <label className="mb-3 block">
          <span className={label}>{t('goals.target')}</span>
          <input
            type="number"
            min={1}
            value={d.target}
            onChange={(e) => onChange({ ...d, target: e.target.value })}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm dark:border-white/10 dark:bg-[#0D1F17] dark:text-cream"
          />
        </label>
      ) : (
        <div className="mb-3">
          <label className="mb-3 block">
            <span className={label}>{t('goals.rangeSurah')}</span>
            <select
              value={d.rangeSurah}
              onChange={(e) => onChange({ ...d, rangeSurah: e.target.value })}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm dark:border-white/10 dark:bg-[#0D1F17] dark:text-cream"
            >
              {chapters.map((c) => (
                <option key={c.id} value={String(c.id)}>
                  {c.id}. {c.name_simple}
                </option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <label className="block">
              <span className={label}>{t('goals.rangeFrom')}</span>
              <input
                type="number"
                min={1}
                max={cap}
                value={d.rangeFrom}
                onChange={(e) => onChange({ ...d, rangeFrom: e.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm dark:border-white/10 dark:bg-[#0D1F17] dark:text-cream"
              />
            </label>
            <label className="block">
              <span className={label}>{t('goals.rangeTo')}</span>
              <input
                type="number"
                min={1}
                max={cap}
                value={d.rangeTo}
                onChange={(e) => onChange({ ...d, rangeTo: e.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm dark:border-white/10 dark:bg-[#0D1F17] dark:text-cream"
              />
            </label>
          </div>
        </div>
      )}

      {d.type === 'duration' ? (
        <div className="grid grid-cols-2 gap-2">
          <label className="mb-3 block">
            <span className={label}>{t('goals.startDate')}</span>
            <input
              type="date"
              value={d.startAt}
              min={todayStr()}
              onChange={(e) => onChange({ ...d, startAt: e.target.value })}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm dark:border-white/10 dark:bg-[#0D1F17] dark:text-cream"
            />
          </label>
          <label className="mb-3 block">
            <span className={label}>{t('goals.endDate')}</span>
            <input
              type="date"
              value={d.endAt}
              onChange={(e) => onChange({ ...d, endAt: e.target.value })}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm dark:border-white/10 dark:bg-[#0D1F17] dark:text-cream"
            />
          </label>
        </div>
      ) : null}

      <button
        onClick={save}
        className="w-full rounded-xl bg-[#8FBC8F] py-3 text-sm font-bold text-white"
      >
        {t('goals.save')}
      </button>
    </Sheet>
  )
}
