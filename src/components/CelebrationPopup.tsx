import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Trophy, Flame, Medal } from 'lucide-react'
import { useI18n } from '@/context/I18nContext'
import { useApp } from '@/context/AppContext'
import { useAuth } from '@/context/AuthContext'
import { useQuranData } from '@/context/QuranDataContext'
import { fetchAchievements, fetchXp } from '@/api'
import { getDeviceId } from '@/lib/deviceId'
import storage from '@/lib/storage'
import {
  STREAK_MILESTONES,
  highestMilestone,
  milestoneKey,
  popupEligible,
  seenAchievementsKey,
  type CelebrationItem,
} from '@/lib/celebration'

// Web twin of the app's CelebrationDialog: streak-milestone + achievement
// celebration popups (CSS animations only — no animation libs). Watchers ride
// the same ud.streak transitions + derived achievements the app uses; shown
// flags live in localStorage marked AT DISPLAY time (announcements convention).
const MAX_PER_SESSION = 3

export function CelebrationPopup() {
  const { t, dict } = useI18n()
  const { toast } = useApp()
  const { token, user } = useAuth()
  const { ud } = useQuranData()
  const deviceId = useMemo(() => getDeviceId(), [])

  const [queue, setQueue] = useState<CelebrationItem[]>([])
  const [index, setIndex] = useState(0)
  const uid = user?.id ?? null
  const streakCurrent = ud.streak?.current ?? 0
  const streakDay = ud.streak?.lastReadDate ?? ''

  const enqueue = useCallback((item: CelebrationItem) => {
    setQueue((q) =>
      q.length >= MAX_PER_SESSION ||
      q.some((x) => (x.kind === 'streak' && item.kind === 'streak' && x.n === item.n) ||
        (x.kind === 'achievement' && item.kind === 'achievement' && x.id === item.id) ||
        (x.kind === 'level' && item.kind === 'level' && x.n === item.n))
        ? q
        : [...q, item],
    )
  }, [])

  // ── Streak watcher: milestone popup + everyday toast ──────────────────────
  const prevRef = useRef<{ current: number | null; day: string }>({ current: null, day: '' })
  useEffect(() => {
    if (!token || !uid || !ud.streak) return
    const prev = prevRef.current
    void (async () => {
      const m = highestMilestone(streakCurrent)
      if (m !== null && !(await storage.getItem(milestoneKey(uid, m)))) {
        enqueue({ kind: 'streak', n: m })
        return // the milestone popup beats the toast
      }
      if (prev.current !== null && streakCurrent === prev.current + 1 && prev.day !== streakDay) {
        toast(t('celebration.streakToast', { n: streakCurrent }))
      }
    })()
    prevRef.current = { current: streakCurrent, day: streakDay }
  }, [token, uid, streakCurrent, streakDay, enqueue, t, toast, ud.streak])

  useEffect(() => {
    prevRef.current = { current: null, day: '' }
  }, [uid])

  // ── XP watcher: "+N poin" toast + level-up popup (canonical diffs) ───────
  const prevXpRef = useRef<{ total: number | null; level: number | null }>({ total: null, level: null })
  useEffect(() => {
    if (!token || !uid) return
    void (async () => {
      try {
        const xp = await fetchXp(deviceId)
        const prev = prevXpRef.current
        if (prev.total !== null && xp.total > prev.total) {
          toast(t('xp.pointsToast', { n: xp.total - prev.total }))
        }
        if (prev.level !== null && xp.level > prev.level) {
          enqueue({ kind: 'level', n: xp.level })
        }
        prevXpRef.current = { total: xp.total, level: xp.level }
      } catch {
        /* offline / endpoint not deployed yet */
      }
    })()
  }, [token, uid, deviceId, enqueue, t, toast, streakDay])
  useEffect(() => {
    prevXpRef.current = { total: null, level: null }
  }, [uid])

  // ── Achievement watcher: fetch → diff vs seen → queue popups ──────────────
  useEffect(() => {
    if (!token || !uid) return
    let cancelled = false
    const check = async () => {
      try {
        const states = await fetchAchievements(deviceId)
        if (cancelled) return
        const seen = new Set(JSON.parse((await storage.getItem(seenAchievementsKey(uid))) ?? '[]') as string[])
        for (const s of states) {
          if (s.unlocked && popupEligible(s.id) && !seen.has(s.id)) enqueue({ kind: 'achievement', id: s.id })
        }
      } catch {
        /* offline / endpoint not deployed yet */
      }
    }
    void check()
    const onVis = () => {
      if (document.visibilityState === 'visible') void check()
    }
    document.addEventListener('visibilitychange', onVis)
    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [token, uid, deviceId, enqueue, streakDay])

  if (!token || queue.length === 0 || index >= queue.length) return null
  const item = queue[index]

  const advance = async () => {
    if (item.kind === 'streak' && uid) {
      for (const m of STREAK_MILESTONES) {
        if (m <= item.n) await storage.setItem(milestoneKey(uid, m), '1')
      }
    }
    if (item.kind === 'achievement' && uid) {
      const key = seenAchievementsKey(uid)
      const seen = new Set(JSON.parse((await storage.getItem(key)) ?? '[]') as string[])
      seen.add(item.id)
      await storage.setItem(key, JSON.stringify([...seen]))
    }
    setIndex((i) => i + 1)
  }

  const achievementName =
    item.kind === 'achievement'
      ? (dict.achievements.items as Record<string, { name: string }>)[item.id]?.name ?? item.id
      : ''
  const isStreak = item.kind === 'streak'

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 px-6">
      <button className="absolute inset-0 cursor-default" aria-label={t('common.close')} onClick={() => void advance()} />
      <Confetti />
      <div key={index} className="celebration-card w-full max-w-[320px] rounded-3xl border border-gray-200 bg-white p-6 pt-8 text-center dark:border-white/10 dark:bg-[#122A1F]">
        <div className="celebration-icon mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/15">
          {isStreak ? (
            <Flame size={44} className="text-amber-500" />
          ) : item.kind === 'level' ? (
            <Medal size={44} className="text-amber-500" />
          ) : (
            <Trophy size={44} className="text-amber-500" />
          )}
        </div>
        {isStreak ? (
          <>
            <p className="text-4xl font-extrabold text-ink dark:text-cream">{item.n}</p>
            <p className="text-base font-bold text-ink dark:text-cream">{t('celebration.streakTitle')}</p>
            <p className="mt-2 text-[13px] leading-relaxed text-ink/60 dark:text-cream/60">{t('celebration.streakBody')}</p>
          </>
        ) : item.kind === 'level' ? (
          <>
            <p className="text-base font-bold text-ink dark:text-cream">{t('xp.levelUpTitle')}</p>
            <p className="mt-1 text-4xl font-extrabold text-[#8FBC8F]">{item.n}</p>
            <p className="mt-2 text-[13px] leading-relaxed text-ink/60 dark:text-cream/60">
              {t('xp.levelUpBody', { n: item.n })}
            </p>
          </>
        ) : (
          <>
            <p className="text-base font-bold text-ink dark:text-cream">{t('celebration.achievementTitle')}</p>
            <p className="mt-1 text-lg font-extrabold text-[#8FBC8F]">{achievementName}</p>
            <p className="mt-2 text-[13px] leading-relaxed text-ink/60 dark:text-cream/60">
              {t('celebration.achievementBody', { name: achievementName })}
            </p>
          </>
        )}
        <button
          onClick={() => void advance()}
          className="mt-6 rounded-xl bg-[#3b82f6] px-8 py-3 text-sm font-bold text-white active:opacity-70"
        >
          {t('celebration.cta')}
        </button>
      </div>
    </div>
  )
}

// Confetti burst — 16 absolutely-positioned divs falling with randomized
// delays/drifts via CSS keyframes (index.css defines .celebration-* styles).
function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: `${Math.random() * 0.35}s`,
        duration: `${1.4 + Math.random() * 0.8}s`,
        drift: `${(Math.random() - 0.5) * 90}px`,
        size: 6 + Math.random() * 6,
        round: i % 3 === 0,
        color: ['#8FBC8F', '#3b82f6', '#f59e0b', '#8B5CF6', '#ef4444'][i % 5],
      })),
    [],
  )
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="celebration-confetti"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            borderRadius: p.round ? '50%' : '1px',
            backgroundColor: p.color,
            animationDelay: p.delay,
            animationDuration: p.duration,
            ['--dx' as string]: p.drift,
          }}
        />
      ))}
    </div>
  )
}
