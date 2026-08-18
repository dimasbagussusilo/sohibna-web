import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { ChevronLeft, Plus, X } from 'lucide-react'
import { fetchGoalsProgress, type GoalType, type GoalUnit } from '@/api'
import { fetchChapters, type Chapter } from '@/lib/quran'
import { useQuranData } from '@/context/QuranDataContext'
import { useI18n } from '@/context/I18nContext'
import { useApp } from '@/context/AppContext'
import { getDeviceId } from '@/lib/deviceId'
import { Sheet } from '@/components/quran/AudioSettingsSheet'

// Reading goals (khatm/daily) — web port. Progress is derived server-side from
// the reading log (fetchGoalsProgress), definitions sync via useQuranData.
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

export function QuranGoals() {
  const { t } = useI18n()
  const { toast } = useApp()
  const navigate = useNavigate()
  const { ud, upsertKhatmGoal, removeKhatmGoal } = useQuranData()
  const [progress, setProgress] = useState<Progress[] | null>(null)
  const [showEditor, setShowEditor] = useState(false)
  const [chapters, setChapters] = useState<Chapter[]>([])
  void chapters

  const refresh = useCallback(() => {
    fetchGoalsProgress(getDeviceId())
      .then(setProgress)
      .catch(() => setProgress([]))
  }, [])

  useEffect(() => {
    refresh()
    fetchChapters()
      .then(setChapters)
      .catch(() => {})
  }, [refresh, ud.khatmGoals.length])

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
          {t('goals.title')}
        </div>
        <button
          onClick={() => setShowEditor(true)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#8FBC8F] text-white"
          aria-label="add goal"
        >
          <Plus size={18} />
        </button>
      </header>

      <div className="mx-auto max-w-3xl space-y-3 px-4 pt-4">
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
          </div>
        ) : null}

        {ud.khatmGoals.length ? (
          ud.khatmGoals.map((g) => {
            const p = progress?.find((x) => x.id === g.id)
            const todayPct = p && p.todayTarget > 0 ? Math.min(100, (p.todayProgress / p.todayTarget) * 100) : 0
            const periodPct =
              p && p.periodTarget > 0 ? Math.min(100, (p.periodProgress / p.periodTarget) * 100) : 0
            const unitLabel =
              g.unit === 'time' ? t('goals.minutes') : g.unit === 'page' ? t('goals.pages') : t('goals.verses')
            return (
              <div key={g.id} className="rounded-3xl bg-white p-4 shadow-sm dark:bg-[#122A1F]">
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <div className="text-sm font-bold text-ink dark:text-cream">
                      {goalTitle(g.type, g.unit, g.target, t)}
                    </div>
                    <div className="text-[11px] text-ink/50 dark:text-cream/50">
                      {p
                        ? `${Math.round(p.todayProgress)}/${p.todayTarget} ${unitLabel} ${t('goals.today')}`
                        : '…'}
                    </div>
                  </div>
                  <button
                    onClick={() => removeKhatmGoal(g.id)}
                    className="p-1 text-ink/30 dark:text-cream/30"
                    aria-label="delete goal"
                  >
                    <X size={14} />
                  </button>
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
              onClick={() => setShowEditor(true)}
              className="mt-4 rounded-xl bg-[#8FBC8F] px-5 py-2.5 text-sm font-bold text-white"
            >
              {t('goals.add')}
            </button>
          </div>
        )}
      </div>

      {showEditor ? (
        <GoalEditor
          onClose={() => setShowEditor(false)}
          onSave={(goal) => {
            upsertKhatmGoal(goal)
            setShowEditor(false)
            toast(t('goals.save'))
          }}
        />
      ) : null}
    </div>
  )
}

function goalTitle(type: GoalType, unit: GoalUnit, target: number, t: ReturnType<typeof useI18n>['t']) {
  const unitLabel = unit === 'time' ? t('goals.minutes') : unit === 'page' ? t('goals.pages') : t('goals.verses')
  if (type === 'daily') return `${target} ${unitLabel} / ${t('goals.typeDaily')}`
  return `${target} ${unitLabel} · ${t('goals.typeDuration')}`
}

function GoalEditor({
  onClose,
  onSave,
}: {
  onClose: () => void
  onSave: (goal: {
    id: string
    type: GoalType
    unit: GoalUnit
    target: number
    rangeFrom?: string | null
    rangeTo?: string | null
    endAt?: string | null
  }) => void
}) {
  const { t } = useI18n()
  const [type, setType] = useState<GoalType>('daily')
  const [unit, setUnit] = useState<GoalUnit>('time')
  const [target, setTarget] = useState('15')
  const [endDate, setEndDate] = useState('')

  const save = () => {
    onSave({
      id: crypto.randomUUID(),
      type,
      unit,
      target: Number(target) || 1,
      rangeFrom: null,
      rangeTo: null,
      endAt: endDate || null,
    })
  }

  const label = 'text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5 block'

  return (
    <Sheet title={t('goals.add')} onClose={onClose}>
      <div className="mb-4 grid grid-cols-2 gap-2">
        {(
          [
            ['daily', t('goals.typeDaily')],
            ['duration', t('goals.typeDuration')],
          ] as const
        ).map(([k, l]) => (
          <button
            key={k}
            onClick={() => setType(k)}
            className={`rounded-xl px-3 py-2.5 text-sm ${
              type === k
                ? 'bg-[#8FBC8F] font-semibold text-white'
                : 'bg-black/5 text-ink dark:bg-white/10 dark:text-cream'
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="mb-4 grid grid-cols-3 gap-2">
        {(
          [
            ['time', t('goals.unitTime')],
            ['page', t('goals.unitPage')],
            ['range', t('goals.unitRange')],
          ] as const
        ).map(([k, l]) => (
          <button
            key={k}
            onClick={() => setUnit(k)}
            className={`rounded-xl px-2 py-2.5 text-xs ${
              unit === k
                ? 'bg-[#8FBC8F] font-semibold text-white'
                : 'bg-black/5 text-ink dark:bg-white/10 dark:text-cream'
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      <label className="mb-3 block">
        <span className={label}>{t('goals.target')}</span>
        <input
          type="number"
          min={1}
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm dark:border-white/10 dark:bg-[#0D1F17] dark:text-cream"
        />
      </label>

      {type === 'duration' ? (
        <label className="mb-3 block">
          <span className={label}>{t('goals.endDate')}</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm dark:border-white/10 dark:bg-[#0D1F17] dark:text-cream"
          />
        </label>
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
