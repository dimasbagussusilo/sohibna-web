import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { ChevronLeft, Copy } from 'lucide-react'
import { useI18n } from '@/context/I18nContext'
import { useApp } from '@/context/AppContext'
import { fetchCommunityGroup, leaveCommunityGroup, type CommunityGroupDetail } from '@/api'

// Community group detail (web v1 — read-mostly): ring, members, automatic
// clasemen. Reactions/board actions happen in the app for now.
export function CommunityGroup() {
  const { t } = useI18n()
  const { toast, askConfirm } = useApp()
  const navigate = useNavigate()
  const { id } = useParams()
  const [detail, setDetail] = useState<CommunityGroupDetail | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let alive = true
    void (async () => {
      if (!id) return
      try {
        const d = await fetchCommunityGroup(id)
        if (alive) setDetail(d)
      } catch {
        if (alive) setError(true)
      }
    })()
    return () => {
      alive = false
    }
  }, [id])

  const leave = async () => {
    if (!id) return
    const ok = await askConfirm({ title: t('community.leaveTitle'), message: t('community.leaveBody') })
    if (!ok) return
    try {
      await leaveCommunityGroup(id)
      navigate('/community')
    } catch {
      toast(t('community.loadError'))
    }
  }

  if (error) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center text-sm text-ink/50 dark:text-cream/50">
        {t('community.loadError')}
      </div>
    )
  }
  if (!detail) return <div className="py-16 text-center text-sm text-ink/50 dark:text-cream/50">{t('common.loading')}</div>

  const unitLabel =
    detail.group.goalUnit === 'time'
      ? t('goals.unitTime')
      : detail.group.goalUnit === 'page'
        ? t('goals.unitPage')
        : t('goals.unitVerse') // verse + range both count ayat
  const goalText =
    detail.group.goalType === 'duration' && detail.group.goalEndAt
      ? t('community.goalLabelDuration', {
          n: detail.group.goalTarget,
          unit: unitLabel.toLowerCase(),
          days: Math.max(0, Math.ceil((new Date(detail.group.goalEndAt).getTime() - Date.now()) / 86_400_000)),
        })
      : t('community.goalLabel', { n: detail.group.goalTarget, unit: unitLabel }) +
        (detail.group.goalUnit === 'range' && detail.group.goalRangeFrom && detail.group.goalRangeTo
          ? ` · ${detail.group.goalRangeFrom}${detail.group.goalRangeFrom === detail.group.goalRangeTo ? '' : '–' + detail.group.goalRangeTo.split(':')[1]}`
          : '')
  const checkedIn = detail.members.filter((m) => m.onTargetToday).length
  const total = detail.members.length
  const frac = total > 0 ? checkedIn / total : 0

  return (
    <div className="mx-auto max-w-xl px-4 pb-16 pt-4">
      <header className="flex items-center pb-3">
        <Link to="/community" className="-ml-2 flex h-9 w-9 items-center justify-center">
          <ChevronLeft size={24} className="text-ink dark:text-cream" />
        </Link>
        <h1 className="flex-1 truncate text-base font-bold text-ink dark:text-cream">{detail.group.name}</h1>
        <button onClick={() => void leave()} className="px-2 py-1 text-xs font-semibold text-red-500">
          {t('community.leave')}
        </button>
      </header>

      {/* Invite code */}
      <div className="mb-3 flex items-center rounded-2xl bg-black/5 px-4 py-3 dark:bg-white/10">
        <span className="flex-1 text-[10px] font-bold uppercase tracking-widest text-ink/40 dark:text-cream/40">
          {t('community.code')}
        </span>
        <button
          onClick={() => {
            void navigator.clipboard?.writeText(detail.group.code)
            toast(t('community.codeCopied'))
          }}
          className="flex items-center gap-2 rounded-full bg-[#8FBC8F]/15 px-3 py-1.5"
        >
          <span className="text-sm font-extrabold tracking-widest text-[#8FBC8F]">{detail.group.code}</span>
          <Copy size={13} className="text-[#8FBC8F]" />
        </button>
      </div>

      {/* Ring */}
      <div className="mb-3 rounded-2xl bg-black/5 p-4 dark:bg-white/10">
        <div className="flex items-center">
          <div
            className="h-14 w-14 rounded-full"
            style={{ background: `conic-gradient(#8FBC8F ${frac * 360}deg, rgba(143,188,143,0.15) 0deg)` }}
          >
            <div className="m-1 flex h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-[#122A1F]">
              <span className="text-xs font-bold text-ink dark:text-cream">{Math.round(frac * 100)}%</span>
            </div>
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-bold text-ink dark:text-cream">
              {detail.group.goalType === 'duration'
                ? t('community.ringLabelPortion', { done: checkedIn, total })
                : t('community.ringLabel', { done: checkedIn, total })}
            </p>
            <p className="mt-0.5 text-xs leading-relaxed text-ink/50 dark:text-cream/50">
              {t('community.quorumNote', { n: detail.quorumNeeded })}
            </p>
            <p className="text-xs text-ink/50 dark:text-cream/50">
              {t('community.streakDays', { n: detail.streak })} · {goalText}
            </p>
          </div>
        </div>
      </div>

      {/* Members */}
      <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-ink/40 dark:text-cream/40">
        {t('community.members')}
      </p>
      <div className="mb-4">
        {detail.members.map((m) => (
          <div
            key={m.userId}
            className={`mb-1.5 flex items-center rounded-2xl border px-4 py-3 ${
              m.userId === detail.me.userId
                ? 'border-[#8FBC8F]/50 bg-[#8FBC8F]/10'
                : 'border-transparent bg-black/5 dark:bg-white/10'
            }`}
          >
            {m.imageUrl ? (
              <img src={m.imageUrl} alt="" className="h-9 w-9 rounded-full object-cover" />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#8FBC8F]/20 text-xs font-bold text-[#8FBC8F]">
            {m.alias.slice(0, 1).toUpperCase()}
          </div>
        )}
            <div className="ml-2.5 min-w-0 flex-1">
              <p className="flex items-center truncate text-sm font-bold text-ink dark:text-cream">
                {m.alias}
                {m.userId === detail.me.userId ? <span className="ml-1.5 rounded bg-[#8FBC8F]/15 px-1.5 py-0.5 text-[9px] font-bold text-[#8FBC8F]">{t('community.you')}</span> : null}
                {m.role === 'owner' ? <span className="ml-1.5 rounded bg-[#8FBC8F]/15 px-1.5 py-0.5 text-[9px] font-bold uppercase text-[#8FBC8F]">{t('community.owner')}</span> : null}
              </p>
              <p className="mt-0.5 flex items-center text-[10px] text-ink/50 dark:text-cream/50">
                <span className={`mr-1 h-2 w-2 rounded-full ${m.onTargetToday ? 'bg-[#8FBC8F]' : 'bg-gray-300 dark:bg-gray-600'}`} />
                {m.todayAmount > 0
                  ? m.todayTarget
                    ? t('community.amountVsToday', { n: m.todayAmount, target: m.todayTarget, unit: unitLabel })
                    : t('community.amountToday', { n: m.todayAmount, unit: unitLabel })
                  : t('community.notYetToday')}
                {detail.group.goalType === 'duration' && m.windowAmount > 0
                  ? ` · ${t('community.totalProgress', { n: m.windowAmount, target: detail.group.goalTarget, unit: unitLabel })}`
                  : ''}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Board */}
      <div className="mb-3 rounded-2xl bg-black/5 p-4 dark:bg-white/10">
        {detail.board.map((b, i) => (
          <div key={b.userId} className="flex items-center py-1.5">
            <span className={`w-5 text-xs font-bold ${i === 0 ? 'text-amber-500' : 'text-ink/40 dark:text-cream/40'}`}>{i + 1}</span>
            <span className="flex-1 text-xs font-semibold text-ink dark:text-cream">
              {b.alias}
              {b.isMe ? <span className="text-[#8FBC8F]"> · {t('community.you')}</span> : null}
            </span>
            <span className="text-xs text-ink/50 dark:text-cream/50">
              {t('community.daysMetN', { n: b.daysMet })}
              {b.weekAmount > 0 ? ` · ${b.weekAmount}` : ''}
            </span>
          </div>
        ))}
        {detail.topEncourager ? (
          <div className="mt-2 flex items-center border-t border-black/10 pt-2 dark:border-white/10">
            <span className="flex-1 text-[10px] font-bold uppercase tracking-widest text-[#8FBC8F]">{t('community.topEncourager')}</span>
            <span className="text-xs font-semibold text-ink dark:text-cream">
              {detail.topEncourager.alias} · {detail.topEncourager.count}×
            </span>
          </div>
        ) : null}
      </div>
    </div>
  )
}
