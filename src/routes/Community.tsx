import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router'
import { Users, UsersRound } from 'lucide-react'
import { useI18n } from '@/context/I18nContext'
import { useAuth } from '@/context/AuthContext'
import { fetchCommunityGroups, joinCommunityGroup, type CommunityGroupSummary } from '@/api'

// Community (web v1 — simple): my circles with today-ring + streak, join by
// code. Creating circles and reactions/khatm actions live in the app for now.
export function Community() {
  const { t } = useI18n()
  const { token } = useAuth()
  const [groups, setGroups] = useState<CommunityGroupSummary[] | null>(null)
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true
    void (async () => {
      try {
        const res = await fetchCommunityGroups()
        if (alive) setGroups(res.groups)
      } catch {
        if (alive) setGroups([])
      }
    })()
    return () => {
      alive = false
    }
  }, [token])

  const join = useCallback(async () => {
    const c = code.trim().toUpperCase()
    if (c.length !== 6) {
      setError(t('community.joinInvalid'))
      return
    }
    setBusy(true)
    setError('')
    try {
      await joinCommunityGroup(c, null)
      const res = await fetchCommunityGroups()
      setGroups(res.groups)
      setCode('')
    } catch (e) {
      setError(String(e).includes('full') ? t('community.groupFull') : t('community.joinInvalid'))
    } finally {
      setBusy(false)
    }
  }, [code, t])

  if (!token) {
    return (
      <div className="mx-auto flex max-w-xl flex-1 items-center justify-center px-6">
        <div className="rounded-2xl border border-[#8FBC8F]/30 bg-[#8FBC8F]/10 p-4">
          <p className="text-sm leading-5 text-ink dark:text-cream">{t('goals.guestNotice')}</p>
          <Link to="/login" className="mt-1 block text-sm font-semibold text-[#8FBC8F]">
            {t('quranHome.guestLogin')} →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-xl px-4 pb-16 pt-4">
      <h1 className="text-2xl font-bold text-ink dark:text-cream">{t('community.title')}</h1>
      <p className="mb-4 text-xs text-ink/50 dark:text-cream/50">{t('community.subtitle')}</p>

      {/* Join by code */}
      <div className="mb-5 rounded-2xl bg-black/5 p-4 dark:bg-white/10">
        <p className="mb-2 text-xs font-bold text-ink dark:text-cream">{t('community.joinTitle')}</p>
        <div className="flex gap-2">
          <input
            value={code}
            maxLength={6}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="AB3XK9"
            className="w-32 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm tracking-widest text-ink outline-none focus:border-[#8FBC8F] dark:border-white/10 dark:bg-[#0D1F17] dark:text-cream"
          />
          <button onClick={() => void join()} disabled={busy} className="rounded-xl bg-[#3b82f6] px-4 text-sm font-bold text-white">
            {t('community.join')}
          </button>
        </div>
        {error ? <p className="mt-2 text-xs text-red-500">{error}</p> : null}
      </div>

      {(groups ?? []).length === 0 ? (
        <div className="py-10 text-center">
          <UsersRound className="mx-auto text-ink/30 dark:text-cream/30" size={40} />
          <p className="mt-3 text-sm font-bold text-ink dark:text-cream">{t('community.emptyTitle')}</p>
          <p className="mt-1.5 text-xs leading-relaxed text-ink/50 dark:text-cream/50">{t('community.emptyBody')}</p>
        </div>
      ) : (
        (groups ?? []).map((g) => {
          const frac = g.todayTotal > 0 ? Math.min(1, g.todayOnTarget / g.todayTotal) : 0
          return (
            <Link
              key={g.id}
              to={`/community/${g.id}`}
              className="mb-2 flex items-center rounded-2xl bg-black/5 px-4 py-3.5 active:opacity-70 dark:bg-white/10"
            >
              <div
                className="flex h-11 w-11 items-center justify-center rounded-full"
                style={{ background: `conic-gradient(#8FBC8F ${frac * 360}deg, rgba(143,188,143,0.15) 0deg)` }}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[10px] font-bold text-ink dark:bg-[#122A1F] dark:text-cream">
                  {Math.round(frac * 100)}%
                </span>
              </div>
              <div className="ml-3 min-w-0 flex-1">
                <p className="flex items-center truncate text-sm font-bold text-ink dark:text-cream">
                  {g.kind === 'family' ? <UsersRound size={13} className="text-[#8FBC8F]" /> : <Users size={13} className="text-[#8FBC8F]" />}
                  <span className="ml-1">{g.name}</span>
                </p>
                <p className="mt-0.5 text-xs text-ink/50 dark:text-cream/50">
                  {g.goalType === 'duration'
                    ? t('community.ringLabelPortion', { done: g.todayOnTarget, total: g.todayTotal })
                    : t('community.ringLabel', { done: g.todayOnTarget, total: g.todayTotal })}{' '}
                  · {t('community.streakDays', { n: g.streak })}
                </p>
                <p className="mt-0.5 text-[10px] text-ink/40 dark:text-cream/40">
                  {g.goalType === 'duration' && g.goalEndAt
                    ? t('community.goalLabelDuration', {
                        n: g.goalTarget,
                        unit: g.goalUnit === 'time' ? t('goals.minutes') : g.goalUnit === 'page' ? t('goals.pages') : t('goals.verses'),
                        days: Math.max(0, Math.ceil((new Date(g.goalEndAt).getTime() - Date.now()) / 86_400_000)),
                      })
                    : t('community.goalLabel', {
                        n: g.goalTarget,
                        unit: g.goalUnit === 'time' ? t('goals.unitTime') : g.goalUnit === 'page' ? t('goals.unitPage') : t('goals.unitVerse'),
                      }) +
                      (g.goalUnit === 'range' && g.goalRangeFrom && g.goalRangeTo
                        ? ` · ${g.goalRangeFrom}${g.goalRangeFrom === g.goalRangeTo ? '' : '–' + g.goalRangeTo.split(':')[1]}`
                        : '')}
                </p>
              </div>
              <span className="text-sm font-extrabold text-[#8FBC8F]">{t('community.memberCountN', { n: g.memberCount })}</span>
            </Link>
          )
        })
      )}
    </div>
  )
}
