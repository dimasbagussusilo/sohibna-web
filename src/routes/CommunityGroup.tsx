import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import {
  CheckCircle2,
  ChevronLeft,
  Copy,
  Flame,
  Share2,
  Trophy,
  Users,
  UsersRound,
} from 'lucide-react'
import { useI18n } from '@/context/I18nContext'
import { useApp } from '@/context/AppContext'
import { fetchCommunityGroup, leaveCommunityGroup, type CommunityGroupDetail } from '@/api'

// Tier identity ring (0039): bronze/silver/gold avatar border + tinted initials
const TIER_RING: Record<string, string> = {
  free: 'border-[#b45309]',
  supporter: 'border-[#94a3b8]',
  premium: 'border-amber-500',
}
const TIER_TEXT: Record<string, string> = {
  free: 'text-[#b45309]',
  supporter: 'text-[#94a3b8]',
  premium: 'text-amber-500',
}

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
    const ok = await askConfirm({
      title: t('community.leaveTitle'),
      message: t('community.leaveBody'),
    })
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
  if (!detail) {
    return (
      <div className="py-16 text-center text-sm text-ink/50 dark:text-cream/50">
        {t('common.loading')}
      </div>
    )
  }

  const unitLabel =
    detail.group.goalUnit === 'time'
      ? t('goals.unitTime')
      : detail.group.goalUnit === 'page'
        ? t('goals.unitPage')
        : t('goals.unitVerse')

  const goalText =
    detail.group.goalType === 'duration' && detail.group.goalEndAt
      ? t('community.goalLabelDuration', {
          n: detail.group.goalTarget,
          unit: unitLabel.toLowerCase(),
          days: Math.max(
            0,
            Math.ceil((new Date(detail.group.goalEndAt).getTime() - Date.now()) / 86_400_000),
          ),
        })
      : t('community.goalLabel', { n: detail.group.goalTarget, unit: unitLabel }) +
        (detail.group.goalUnit === 'range' && detail.group.goalRangeFrom && detail.group.goalRangeTo
          ? ` · ${detail.group.goalRangeFrom}${
              detail.group.goalRangeFrom === detail.group.goalRangeTo
                ? ''
                : '–' + detail.group.goalRangeTo.split(':')[1]
            }`
          : '')

  const checkedIn = detail.members.filter((m) => m.onTargetToday).length
  const total = detail.members.length
  const frac = total > 0 ? checkedIn / total : 0
  const isQuorumMet = checkedIn >= detail.quorumNeeded

  const shareInvite = async () => {
    const inviteMessage = t('community.shareInviteMessage', {
      name: detail.group.name,
      goal: goalText,
      code: detail.group.code,
    })

    if (navigator.share) {
      try {
        await navigator.share({
          title: detail.group.name,
          text: inviteMessage,
        })
        return
      } catch {
        // User cancelled or share not supported; fallback to clipboard
      }
    }

    try {
      await navigator.clipboard?.writeText(inviteMessage)
      toast(t('community.codeCopied'))
    } catch {
      toast(t('community.loadError'))
    }
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard?.writeText(detail.group.code)
      toast(t('community.codeCopied'))
    } catch {
      toast(t('community.loadError'))
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 pb-20 pt-4">
      {/* Top Header */}
      <header className="flex items-center justify-between pb-3">
        <Link
          to="/community"
          className="-ml-2 flex h-9 w-9 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10"
        >
          <ChevronLeft size={24} className="text-ink dark:text-cream" />
        </Link>
        <div className="min-w-0 flex-1 px-2 text-center">
          <div className="flex items-center justify-center gap-1.5 truncate">
            {detail.group.kind === 'family' ? (
              <UsersRound size={14} className="shrink-0 text-[#8FBC8F]" />
            ) : (
              <Users size={14} className="shrink-0 text-[#8FBC8F]" />
            )}
            <h1 className="truncate text-base font-bold text-ink dark:text-cream">
              {detail.group.name}
            </h1>
          </div>
        </div>
        <button
          onClick={() => void leave()}
          className="rounded-lg px-2.5 py-1 text-xs font-semibold text-red-500 transition hover:bg-red-500/10"
        >
          {t('community.leave')}
        </button>
      </header>

      {/* Hero & Group Identity Card */}
      <div className="mb-4 rounded-3xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#122A1F]/60">
        <div className="flex items-center gap-4">
          {/* Goal Ring Conic */}
          <div
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full"
            style={{
              background: `conic-gradient(#8FBC8F ${frac * 360}deg, rgba(143,188,143,0.18) 0deg)`,
            }}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-[#0D1F17]">
              <span className="text-xs font-extrabold text-ink dark:text-cream">
                {Math.round(frac * 100)}%
              </span>
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="truncate text-lg font-bold text-ink dark:text-cream">
              {detail.group.name}
            </h2>
            <p className="mt-0.5 text-xs text-ink/60 dark:text-cream/60">
              {detail.group.goalType === 'duration'
                ? t('community.ringLabelPortion', { done: checkedIn, total })
                : t('community.ringLabel', { done: checkedIn, total })}{' '}
              · <span className="font-bold text-amber-600 dark:text-amber-400">{t('community.streakDays', { n: detail.streak })}</span>
            </p>
            <p className="mt-0.5 text-[11px] text-ink/40 dark:text-cream/40 truncate">
              {goalText}
            </p>
          </div>
        </div>

        {/* Quorum Pill Status */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-3 dark:border-white/10">
          {isQuorumMet ? (
            <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 size={13} />
              <span>{t('community.quorumMet')}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-700 dark:text-amber-300">
              <Flame size={13} />
              <span>
                {t('community.quorumNeededShort', {
                  n: Math.max(1, detail.quorumNeeded - checkedIn),
                })}
              </span>
            </div>
          )}

          {/* Quick Invite Code Chip */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => void copyCode()}
              className="flex items-center gap-1.5 rounded-xl border border-gray-200/80 bg-black/5 px-2.5 py-1 text-xs font-extrabold tracking-widest text-ink transition hover:bg-black/10 dark:border-white/10 dark:bg-white/10 dark:text-cream"
              title={t('community.code')}
            >
              <span>{detail.group.code}</span>
              <Copy size={12} className="text-[#8FBC8F]" />
            </button>
            <button
              onClick={() => void shareInvite()}
              className="flex items-center gap-1 rounded-xl bg-[#8FBC8F] px-3 py-1 text-xs font-bold text-white transition hover:opacity-90"
            >
              <Share2 size={12} />
              <span>{t('community.shareInvite')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Members Section with Horizontal Progress Bar */}
      <div className="mb-6">
        <div className="mb-2.5 flex items-center justify-between px-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-ink/50 dark:text-cream/50">
            {t('community.members')} ({detail.members.length})
          </p>
        </div>

        <div className="space-y-2">
          {detail.members.map((m) => {
            const memberTarget = m.todayTarget || detail.group.goalTarget
            const memberProgressFrac =
              memberTarget > 0 ? Math.min(1, m.todayAmount / memberTarget) : m.onTargetToday ? 1 : 0

            return (
              <div
                key={m.userId}
                className={`rounded-2xl border p-3.5 transition-all ${
                  m.userId === detail.me.userId
                    ? 'border-[#8FBC8F]/50 bg-[#8FBC8F]/10 dark:bg-[#8FBC8F]/15'
                    : 'border-gray-200/80 bg-white dark:border-white/10 dark:bg-[#122A1F]/50'
                }`}
              >
                <div className="flex items-center">
                  {m.imageUrl ? (
                    <img
                      src={m.imageUrl}
                      alt=""
                      className={`h-9 w-9 rounded-full object-cover ${
                        m.tier ? `border-2 ${TIER_RING[m.tier]}` : ''
                      }`}
                    />
                  ) : (
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${
                        m.tier
                          ? `border-2 ${TIER_RING[m.tier]} bg-black/5 dark:bg-white/10 ${TIER_TEXT[m.tier]}`
                          : 'bg-[#8FBC8F]/20 text-[#8FBC8F]'
                      }`}
                    >
                      {m.alias.slice(0, 1).toUpperCase()}
                    </div>
                  )}

                  <div className="ml-3 min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="truncate text-sm font-bold text-ink dark:text-cream">
                        {m.alias}
                      </span>
                      {m.userId === detail.me.userId ? (
                        <span className="rounded bg-[#8FBC8F]/15 px-1.5 py-0.5 text-[9px] font-bold text-[#8FBC8F]">
                          {t('community.you')}
                        </span>
                      ) : null}
                      {m.role === 'owner' ? (
                        <span className="rounded bg-black/5 px-1.5 py-0.5 text-[9px] font-bold uppercase text-ink/60 dark:bg-white/10 dark:text-cream/60">
                          {t('community.owner')}
                        </span>
                      ) : null}
                    </div>

                    <p className="mt-0.5 text-xs text-ink/60 dark:text-cream/60">
                      {m.todayAmount > 0
                        ? m.todayTarget
                          ? t('community.amountVsToday', {
                              n: m.todayAmount,
                              target: m.todayTarget,
                              unit: unitLabel,
                            })
                          : t('community.amountToday', { n: m.todayAmount, unit: unitLabel })
                        : t('community.notYetToday')}
                      {detail.group.goalType === 'duration' && m.windowAmount > 0
                        ? ` · ${t('community.totalProgress', {
                            n: m.windowAmount,
                            target: detail.group.goalTarget,
                            unit: unitLabel,
                          })}`
                        : ''}
                    </p>
                  </div>

                  <div className="ml-3 shrink-0">
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full text-xs ${
                        m.onTargetToday
                          ? 'bg-emerald-500 text-white'
                          : 'bg-black/10 text-ink/30 dark:bg-white/10 dark:text-cream/30'
                      }`}
                    >
                      {m.onTargetToday ? '✓' : '·'}
                    </span>
                  </div>
                </div>

                {/* Reading Progress Bar */}
                <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      m.onTargetToday ? 'bg-emerald-500' : 'bg-[#8FBC8F]'
                    }`}
                    style={{ width: `${Math.round(memberProgressFrac * 100)}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Fastabiqul Khairat (Leaderboard) Podium */}
      <div className="mb-4 rounded-3xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#122A1F]/60">
        <div className="mb-3 flex items-center gap-1.5">
          <Trophy size={16} className="text-amber-500" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-ink dark:text-cream">
            {t('community.board')}
          </h3>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-white/10">
          {detail.board.map((b, i) => {
            const badgeClass =
              i === 0
                ? 'bg-amber-400/20 text-amber-600 dark:text-amber-400 border border-amber-400/50'
                : i === 1
                  ? 'bg-slate-400/20 text-slate-600 dark:text-slate-300 border border-slate-400/50'
                  : i === 2
                    ? 'bg-amber-700/20 text-amber-800 dark:text-amber-600 border border-amber-700/50'
                    : 'bg-black/5 dark:bg-white/10 text-ink/50 dark:text-cream/50'

            return (
              <div key={b.userId} className="flex items-center py-2.5">
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-extrabold ${badgeClass}`}
                >
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                </span>

                <div className="ml-3 min-w-0 flex-1">
                  <span className="truncate text-xs font-bold text-ink dark:text-cream">
                    {b.tier ? (
                      <span
                        className={`mr-1 inline-block h-1.5 w-1.5 rounded-full align-middle ${
                          b.tier === 'premium'
                            ? 'bg-amber-500'
                            : b.tier === 'supporter'
                              ? 'bg-[#94a3b8]'
                              : 'bg-[#b45309]'
                        }`}
                      />
                    ) : null}
                    {b.alias}
                    {b.isMe ? (
                      <span className="ml-1 text-[#8FBC8F] font-semibold">· {t('community.you')}</span>
                    ) : null}
                  </span>
                </div>

                <div className="ml-3 text-right">
                  <span className="text-xs font-bold text-ink dark:text-cream">
                    {t('community.daysMetN', { n: b.daysMet })}
                  </span>
                  {b.weekAmount > 0 ? (
                    <span className="ml-1 text-[11px] text-ink/40 dark:text-cream/40">
                      ({b.weekAmount})
                    </span>
                  ) : null}
                </div>
              </div>
            )
          })}
        </div>

        {detail.topEncourager ? (
          <div className="mt-3.5 flex items-center justify-between rounded-xl bg-gradient-to-r from-[#8FBC8F]/10 to-transparent p-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8FBC8F]">
              {t('community.topEncourager')}
            </span>
            <span className="text-xs font-bold text-ink dark:text-cream">
              {detail.topEncourager.alias} · {detail.topEncourager.count}× 👏
            </span>
          </div>
        ) : null}
      </div>
    </div>
  )
}

