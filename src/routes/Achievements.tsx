import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import { ChevronLeft, Lock, Trophy } from 'lucide-react'
import { useI18n } from '@/context/I18nContext'
import { fetchAchievements, type AchievementState } from '@/api'
import { getDeviceId } from '@/lib/deviceId'

// Pencapaian — derived badge list (web twin of the app's /achievements).
export function Achievements() {
  const { t, dict } = useI18n()
  const deviceId = useMemo(() => getDeviceId(), [])
  const [states, setStates] = useState<AchievementState[] | null>(null)

  useEffect(() => {
    let alive = true
    void (async () => {
      try {
        const s = await fetchAchievements(deviceId)
        if (alive) setStates(s)
      } catch {
        if (alive) setStates([])
      }
    })()
    return () => {
      alive = false
    }
  }, [deviceId])

  const items = dict.achievements.items as Record<string, { name: string; desc: string }>
  const unlocked = states?.filter((s) => s.unlocked).length ?? 0

  return (
    <div className="mx-auto max-w-xl px-4 pb-16 pt-4">
      <header className="flex items-center pb-3">
        <Link to="/home" className="-ml-2 flex h-9 w-9 items-center justify-center">
          <ChevronLeft size={24} className="text-ink dark:text-cream" />
        </Link>
        <h1 className="flex-1 text-center text-base font-bold text-ink dark:text-cream">{t('achievements.title')}</h1>
        <span className="w-9" />
      </header>

      <p className="mb-4 text-center text-xs font-semibold text-ink/50 dark:text-cream/50">
        {states ? t('achievements.summary', { unlocked, total: states.length }) : t('common.loading')}
      </p>

      {(states ?? []).map((s) => {
        const copy = items[s.id]
        const frac = s.threshold > 0 ? Math.min(1, s.current / s.threshold) : 0
        return (
          <div key={s.id} className="mb-1.5 flex items-center rounded-2xl bg-black/5 px-4 py-3 dark:bg-white/10">
            <div className={`mr-3 flex h-11 w-11 items-center justify-center rounded-full ${s.unlocked ? 'bg-amber-500/20' : 'bg-black/5 dark:bg-black/20'}`}>
              {s.unlocked ? <Trophy size={20} className="text-amber-500" /> : <Lock size={16} className="text-ink/40 dark:text-cream/40" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className={`text-sm font-semibold ${s.unlocked ? 'text-ink dark:text-cream' : 'text-ink/50 dark:text-cream/50'}`}>
                {copy?.name ?? s.id}
              </p>
              <p className="mt-0.5 text-xs text-ink/50 dark:text-cream/50">{copy?.desc ?? ''}</p>
              {!s.unlocked ? (
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/10 dark:bg-black/30">
                  <div className="h-full rounded-full bg-[#8FBC8F]/60" style={{ width: `${Math.round(frac * 100)}%` }} />
                </div>
              ) : null}
            </div>
            <span className="ml-2 text-xs text-ink/50 dark:text-cream/50">
              {t('achievements.progress', { current: s.current, threshold: s.threshold })}
            </span>
          </div>
        )
      })}
    </div>
  )
}
