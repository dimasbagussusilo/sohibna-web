import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import { ChevronLeft, Info, Pencil, Trophy } from 'lucide-react'
import { useI18n } from '@/context/I18nContext'
import { useApp } from '@/context/AppContext'
import { useAuth } from '@/context/AuthContext'
import { fetchLeaderboard, patchLeaderboard, type LeaderboardEntry, type LeaderboardResponse } from '@/api'
import { getDeviceId } from '@/lib/deviceId'

// Fastabiqul Khairat — the OPT-IN weekly reading board (web twin of the app's
// /leaderboard screen). Not joined: explainer + nickname join form. Joined:
// top-50 list with the own row pinned when beyond the top + rename/leave.
export function Leaderboard() {
  const { t } = useI18n()
  const { askConfirm, toast } = useApp()
  const { token, user } = useAuth()
  const deviceId = useMemo(() => getDeviceId(), [])
  const [board, setBoard] = useState<LeaderboardResponse | null>(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)
  const [nickname, setNickname] = useState('')
  const [editing, setEditing] = useState(false)
  const [busy, setBusy] = useState(false)

  const load = async () => {
    try {
      const b = await fetchLeaderboard()
      setBoard(b)
      setError(false)
      setNickname(b.joined ? b.myName : (user?.name ?? ''))
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    void load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const resetsIn = useMemo(() => {
    if (!board) return ''
    const ms = new Date(board.nextReset).getTime() - Date.now()
    if (ms <= 0) return ''
    const h = Math.floor(ms / 3_600_000)
    const d = Math.floor(h / 24)
    return d > 0 ? `${d}d ${h % 24}h` : `${h}h ${Math.floor((ms % 3_600_000) / 60_000)}m`
  }, [board])

  const submit = async () => {
    const name = nickname.trim()
    if (!name || name.length > 30) {
      toast(t('leaderboard.nameRequired'))
      return
    }
    setBusy(true)
    try {
      await patchLeaderboard(deviceId, name)
      await load()
      setEditing(false)
    } catch {
      toast(t('leaderboard.loadError'))
    } finally {
      setBusy(false)
    }
  }

  const leave = async () => {
    const ok = await askConfirm({ title: t('leaderboard.leaveConfirmTitle'), message: t('leaderboard.leaveConfirmBody') })
    if (!ok) return
    try {
      await patchLeaderboard(deviceId, null)
      await load()
    } catch {
      toast(t('leaderboard.loadError'))
    }
  }

  const row = (e: LeaderboardEntry) => (
    <div
      key={`${e.rank}-${e.name}`}
      className={`flex items-center rounded-2xl px-4 py-3 mb-1.5 ${
        e.isMe ? 'border border-[#8FBC8F]/30 bg-[#8FBC8F]/15' : 'bg-black/5 dark:bg-white/10'
      }`}
    >
      <div className="w-8 text-center">
        {e.rank <= 3 ? (
          <Trophy size={18} className="mx-auto" color={e.rank === 1 ? '#f59e0b' : e.rank === 2 ? '#94a3b8' : '#b45309'} />
        ) : (
          <span className="text-sm font-bold text-ink/50 dark:text-cream/50">{e.rank}</span>
        )}
      </div>
      {e.imageUrl ? (
        <img src={e.imageUrl} alt="" className="mx-2.5 h-9 w-9 rounded-full object-cover" />
      ) : (
        <div className="mx-2.5 flex h-9 w-9 items-center justify-center rounded-full bg-[#8FBC8F]/20 text-sm font-bold text-[#8FBC8F]">
          {e.name.slice(0, 1).toUpperCase()}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-ink dark:text-cream">
          {e.name}
          {e.isMe ? <span className="text-[#8FBC8F]"> · {t('leaderboard.you')}</span> : null}
        </p>
        <p className="mt-0.5 text-xs text-ink/50 dark:text-cream/50">
          {t('leaderboard.verses', { n: e.verses })} · {t('leaderboard.days', { n: e.days })}
        </p>
      </div>
      <span className="text-sm font-extrabold text-[#8FBC8F]">{t('leaderboard.points', { n: e.points })}</span>
    </div>
  )

  return (
    <div className="mx-auto max-w-xl px-4 pb-16 pt-4">
      <header className="flex items-center pb-3">
        <Link to="/home" className="-ml-2 flex h-9 w-9 items-center justify-center">
          <ChevronLeft size={24} className="text-ink dark:text-cream" />
        </Link>
        <h1 className="flex-1 text-center text-base font-bold text-ink dark:text-cream">{t('leaderboard.title')}</h1>
        <span className="w-9" />
      </header>

      <p className="mb-3 text-xs leading-relaxed text-ink/60 dark:text-cream/60">{t('leaderboard.subtitle')}</p>
      {board ? (
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-semibold text-ink/60 dark:bg-white/10 dark:text-cream/60">
            {t('leaderboard.weekOf', { date: board.weekStart })}
          </span>
          {resetsIn ? (
            <span className="rounded-full bg-[#8FBC8F]/10 px-3 py-1 text-xs font-semibold text-[#8FBC8F]">
              {t('leaderboard.resetsIn', { duration: resetsIn })}
            </span>
          ) : null}
        </div>
      ) : null}
      {error ? <p className="mb-3 text-sm text-red-500">{t('leaderboard.loadError')}</p> : null}
      {loading ? (
        <p className="py-10 text-center text-sm text-ink/50 dark:text-cream/50">{t('common.loading')}</p>
      ) : board && board.entries.length === 0 && board.joined ? (
        <p className="py-10 text-center text-sm text-ink/50 dark:text-cream/50">{t('leaderboard.empty')}</p>
      ) : (
        <div>{board?.entries.map(row)}</div>
      )}

      {/* Own row pinned beyond the top 50 */}
      {board?.joined && board.me && board.me.rank > 50 ? <div className="mb-3">{row(board.me)}</div> : null}

      {!board?.joined ? (
        <div className="mb-4 rounded-2xl bg-black/5 p-4 dark:bg-white/10">
          <div className="mb-1.5 flex items-center">
            <Trophy size={16} className="text-[#8FBC8F]" />
            <span className="ml-1.5 text-sm font-bold text-ink dark:text-cream">{t('leaderboard.joinTitle')}</span>
          </div>
          <p className="mb-3 text-xs leading-relaxed text-ink/60 dark:text-cream/60">{t('leaderboard.joinBody')}</p>
          <label className="mb-1 block text-xs font-semibold text-ink dark:text-cream">{t('leaderboard.nicknameLabel')}</label>
          <div className="flex gap-2">
            <input
              value={nickname}
              maxLength={30}
              onChange={(e) => setNickname(e.target.value)}
              placeholder={t('leaderboard.nicknamePlaceholder')}
              className="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-[#8FBC8F] dark:border-white/10 dark:bg-[#0D1F17] dark:text-cream"
            />
            <button onClick={() => void submit()} disabled={busy} className="rounded-xl bg-[#3b82f6] px-4 text-sm font-bold text-white">
              {t('leaderboard.joinCta')}
            </button>
          </div>
          <div className="mt-2.5 flex items-start">
            <Info size={12} className="mt-0.5 mr-1.5 shrink-0 text-ink/50 dark:text-cream/50" />
            <p className="text-[11px] leading-relaxed text-ink/50 dark:text-cream/50">{t('leaderboard.privacyNote')}</p>
          </div>
        </div>
      ) : board?.joined ? (
        <div className="mt-4 space-y-2">
          {editing ? (
            <div className="flex gap-2">
              <input
                value={nickname}
                maxLength={30}
                onChange={(e) => setNickname(e.target.value)}
                placeholder={t('leaderboard.nicknamePlaceholder')}
                className="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-[#8FBC8F] dark:border-white/10 dark:bg-[#0D1F17] dark:text-cream"
              />
              <button onClick={() => void submit()} disabled={busy} className="rounded-xl bg-[#3b82f6] px-4 text-sm font-bold text-white">
                {t('leaderboard.save')}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-black/5 py-2.5 text-xs font-semibold text-ink/60 dark:bg-white/10 dark:text-cream/60"
            >
              <Pencil size={14} />
              {t('leaderboard.editName')}
            </button>
          )}
          <button onClick={() => void leave()} className="w-full py-2.5 text-xs font-semibold text-red-500">
            {t('leaderboard.leave')}
          </button>
        </div>
      ) : null}
    </div>
  )
}
