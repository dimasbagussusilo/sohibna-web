import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import {
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  Flame,
  KeyRound,
  Moon,
  Search,
  Users,
  UsersRound,
} from 'lucide-react'
import { useI18n } from '@/context/I18nContext'
import { useAuth } from '@/context/AuthContext'
import { useApp } from '@/context/AppContext'
import {
  fetchCommunityGroups,
  fetchCommunityExplore,
  joinCommunityGroup,
  joinCommunityGroupById,
  type CommunityGroupSummary,
  type CommunityExploreEntry,
} from '@/api'

export function Community() {
  const { t } = useI18n()
  const { token } = useAuth()
  const { toast } = useApp()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState<'my' | 'explore'>('my')
  const [groups, setGroups] = useState<CommunityGroupSummary[] | null>(null)
  const [exploreEntries, setExploreEntries] = useState<CommunityExploreEntry[] | null>(null)
  const [exploreSearch, setExploreSearch] = useState('')
  const [code, setCode] = useState('')
  // A failed read must not read as "you have no groups".
  const [loadFailed, setLoadFailed] = useState(false)
  const [busy, setBusy] = useState(false)
  const [busyExploreId, setBusyExploreId] = useState<string | null>(null)
  const [error, setError] = useState('')

  const loadGroups = useCallback(async () => {
    try {
      const res = await fetchCommunityGroups()
      setGroups(res.groups)
      setLoadFailed(false)
    } catch {
      // Keep whatever was shown; remember the failure so the page can say so
      // and offer a retry instead of presenting an empty list as fact.
      setLoadFailed(true)
    }
  }, [])

  const loadExplore = useCallback(async () => {
    try {
      const res = await fetchCommunityExplore()
      setExploreEntries(res.groups)
    } catch {
      setExploreEntries([])
    }
  }, [])

  useEffect(() => {
    if (!token) return
    void (async () => {
      await loadGroups()
      await loadExplore()
    })()
  }, [token, loadGroups, loadExplore])

  const joinByCode = useCallback(async () => {
    const c = code.trim().toUpperCase()
    if (c.length !== 6) {
      setError(t('community.joinInvalid'))
      return
    }
    setBusy(true)
    setError('')
    try {
      const joined = await joinCommunityGroup(c, null)
      await loadGroups()
      setCode('')
      toast(t('community.joined'))
      navigate(`/community/${joined.id}`)
    } catch (e) {
      setError(String(e).includes('full') ? t('community.groupFull') : t('community.joinInvalid'))
    } finally {
      setBusy(false)
    }
  }, [code, t, toast, navigate, loadGroups])

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard?.readText()
      if (text) {
        // The app's share text ends with the code: take the code, not the
        // first six characters of the sentence.
        const upper = text.trim().toUpperCase()
        const match = upper.match(/\b[A-Z0-9]{6}\b/)
        setCode(match ? match[0] : upper.slice(0, 6))
      }
    } catch {
      // Clipboard permissions may be denied; safe to ignore
    }
  }

  const joinExploreGroup = async (id: string) => {
    setBusyExploreId(id)
    try {
      await joinCommunityGroupById(id, null)
      await loadGroups()
      await loadExplore()
      toast(t('community.joined'))
      navigate(`/community/${id}`)
    } catch (e) {
      const msg = String(e)
      toast(
        msg.includes('full')
          ? t('community.groupFull')
          : msg.includes('limit')
            ? t('community.cap')
            : t('community.loadError'),
      )
    } finally {
      setBusyExploreId(null)
    }
  }

  // Community Pulse aggregate metrics
  const totalGroups = groups?.length ?? 0
  const groupsOnTarget = useMemo(
    () => (groups ?? []).filter((g) => g.todayTotal > 0 && g.todayOnTarget >= g.todayTotal).length,
    [groups],
  )
  const allGroupsDone = totalGroups > 0 && groupsOnTarget === totalGroups

  // Filter explore groups
  const filteredExplore = useMemo(() => {
    if (!exploreEntries) return null
    const q = exploreSearch.trim().toLowerCase()
    if (!q) return exploreEntries
    return exploreEntries.filter((e) => e.name.toLowerCase().includes(q))
  }, [exploreEntries, exploreSearch])

  if (!token) {
    return (
      <div className="mx-auto flex max-w-xl flex-1 items-center justify-center px-6 py-16">
        <div className="rounded-2xl border border-[#8FBC8F]/30 bg-[#8FBC8F]/10 p-5 text-center">
          <p className="text-sm leading-relaxed text-ink dark:text-cream">{t('goals.guestNotice')}</p>
          <Link
            to="/login"
            className="mt-3 inline-block rounded-xl bg-[#8FBC8F] px-4 py-2 text-xs font-bold text-white transition hover:opacity-90"
          >
            {t('quranHome.guestLogin')} →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-xl px-4 pb-20 pt-4">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink dark:text-cream">
            {t('community.title')}
          </h1>
          <p className="mt-0.5 text-xs text-ink/50 dark:text-cream/50">
            {t('community.subtitle')}
          </p>
        </div>
      </div>

      {/* Segmented Tab Control */}
      <div className="mb-4 flex rounded-2xl border border-gray-200/80 bg-black/5 p-1 dark:border-white/10 dark:bg-white/5">
        <button
          onClick={() => setActiveTab('my')}
          className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${
            activeTab === 'my'
              ? 'border border-gray-200 bg-white text-ink shadow-sm dark:border-white/10 dark:bg-[#122A1F] dark:text-cream'
              : 'text-ink/60 hover:text-ink dark:text-cream/60 dark:hover:text-cream'
          }`}
        >
          {t('community.tabMyGroups')} {totalGroups > 0 ? `(${totalGroups})` : ''}
        </button>
        <button
          onClick={() => setActiveTab('explore')}
          className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${
            activeTab === 'explore'
              ? 'border border-gray-200 bg-white text-ink shadow-sm dark:border-white/10 dark:bg-[#122A1F] dark:text-cream'
              : 'text-ink/60 hover:text-ink dark:text-cream/60 dark:hover:text-cream'
          }`}
        >
          {t('community.tabExplore')}
        </button>
      </div>

      {activeTab === 'my' ? (
        <>
          {/* Community Pulse Hero Card */}
          {totalGroups > 0 ? (
            <div className="mb-4 rounded-2xl border border-gray-200/80 bg-gradient-to-br from-black/[0.03] to-black/[0.06] p-4 dark:border-white/10 dark:from-white/[0.04] dark:to-white/[0.08]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Flame size={15} className="text-[#8FBC8F]" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-ink dark:text-cream">
                    {t('community.pulseTitle')}
                  </span>
                </div>
                {allGroupsDone ? (
                  <span className="flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 size={11} /> {t('community.allDoneBadge')}
                  </span>
                ) : null}
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-ink/70 dark:text-cream/70">
                {allGroupsDone
                  ? t('community.pulseAllDone')
                  : t('community.pulseDone', { done: groupsOnTarget, total: totalGroups })}
              </p>
              {!allGroupsDone ? (
                <Link
                  to="/quran"
                  className="mt-2.5 inline-flex items-center gap-1.5 rounded-xl border border-[#8FBC8F]/30 bg-[#8FBC8F]/15 px-3 py-1.5 text-xs font-bold text-[#8FBC8F] transition hover:bg-[#8FBC8F]/20"
                >
                  <BookOpen size={13} />
                  {t('community.readNow')} →
                </Link>
              ) : null}
            </div>
          ) : null}

          {/* Join by Code Card */}
          <div className="mb-5 rounded-2xl border border-gray-200/80 bg-black/5 p-4 dark:border-white/10 dark:bg-white/10">
            <div className="flex items-center gap-1.5 mb-2">
              <KeyRound size={14} className="text-[#8FBC8F]" />
              <p className="text-xs font-bold text-ink dark:text-cream">
                {t('community.joinTitle')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                value={code}
                maxLength={6}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="AB3XK9"
                className="w-36 rounded-xl border border-gray-200 bg-white px-3 py-2 text-center text-sm font-extrabold tracking-[4px] text-ink outline-none transition focus:border-[#8FBC8F] dark:border-white/10 dark:bg-[#0D1F17] dark:text-cream"
              />
              <button
                type="button"
                onClick={() => void pasteFromClipboard()}
                className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-ink/70 transition hover:bg-gray-50 dark:border-white/10 dark:bg-[#122A1F] dark:text-cream/70 dark:hover:bg-white/15"
              >
                {t('community.pasteCode')}
              </button>
              <button
                type="button"
                onClick={() => void joinByCode()}
                disabled={busy || code.length !== 6}
                className="flex-1 rounded-xl bg-[#8FBC8F] py-2 text-xs font-bold text-white transition hover:opacity-90 disabled:opacity-50"
              >
                {busy ? '...' : t('community.join')}
              </button>
            </div>
            {error ? <p className="mt-2 text-xs font-medium text-red-500">{error}</p> : null}
          </div>

          {/* My Groups List / Empty State */}
          {loadFailed && (groups ?? []).length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gray-300 p-6 text-center dark:border-white/15">
              <p className="text-sm text-red-500">{t('common.couldNotReach')}</p>
              <button
                type="button"
                onClick={() => void loadGroups()}
                className="mt-3 rounded-xl bg-[#8FBC8F] px-4 py-2 text-xs font-bold text-white"
              >
                {t('common.retry')}
              </button>
            </div>
          ) : (groups ?? []).length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gray-300 p-6 text-center dark:border-white/15">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#8FBC8F]/15">
                <UsersRound className="text-[#8FBC8F]" size={28} />
              </div>
              <h2 className="mt-3 text-sm font-bold text-ink dark:text-cream">
                {t('community.emptyTitle')}
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-ink/60 dark:text-cream/60">
                {t('community.emptyBody')}
              </p>

              {/* 3 Value Propositions */}
              <div className="mt-5 space-y-2.5 text-left">
                <div className="flex items-center gap-3 rounded-2xl border border-gray-200/80 bg-black/[0.02] p-3 dark:border-white/10 dark:bg-white/5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#8FBC8F]/20 text-[#8FBC8F]">
                    <BookOpen size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-ink dark:text-cream">
                      {t('community.valueProp1Title')}
                    </p>
                    <p className="text-[10px] text-ink/50 dark:text-cream/50">
                      {t('community.valueProp1Desc')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-gray-200/80 bg-black/[0.02] p-3 dark:border-white/10 dark:bg-white/5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#8FBC8F]/20 text-[#8FBC8F]">
                    <Flame size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-ink dark:text-cream">
                      {t('community.valueProp2Title')}
                    </p>
                    <p className="text-[10px] text-ink/50 dark:text-cream/50">
                      {t('community.valueProp2Desc')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setActiveTab('explore')}
                  className="flex-1 rounded-xl bg-[#8FBC8F] py-2.5 text-xs font-bold text-white transition hover:opacity-90"
                >
                  {t('community.tabExplore')} →
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5">
              {(groups ?? []).map((g) => {
                const total = g.todayTotal
                const frac = total > 0 ? Math.min(1, g.todayOnTarget / total) : 0
                return (
                  <Link
                    key={g.id}
                    to={`/community/${g.id}`}
                    className="flex items-center rounded-2xl border border-gray-200/80 bg-white p-3.5 shadow-sm transition hover:border-[#8FBC8F]/50 dark:border-white/10 dark:bg-[#122A1F]/50 dark:hover:border-[#8FBC8F]/50"
                  >
                    {/* GoalRing conic indicator */}
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
                      style={{
                        background: `conic-gradient(#8FBC8F ${frac * 360}deg, rgba(143,188,143,0.18) 0deg)`,
                      }}
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[10px] font-extrabold text-ink dark:bg-[#0D1F17] dark:text-cream">
                        {Math.round(frac * 100)}%
                      </span>
                    </div>

                    <div className="ml-3.5 min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 truncate">
                        {g.kind === 'family' ? (
                          <UsersRound size={13} className="shrink-0 text-[#8FBC8F]" />
                        ) : (
                          <Users size={13} className="shrink-0 text-[#8FBC8F]" />
                        )}
                        <span className="truncate text-sm font-bold text-ink dark:text-cream">
                          {g.name}
                        </span>
                      </div>

                      <p className="mt-0.5 text-xs text-ink/60 dark:text-cream/60">
                        {g.goalType === 'duration'
                          ? t('community.ringLabelPortion', { done: g.todayOnTarget, total: g.todayTotal })
                          : t('community.ringLabel', { done: g.todayOnTarget, total: g.todayTotal })}{' '}
                        · <span className="text-amber-600 dark:text-amber-400 font-semibold">{t('community.streakDays', { n: g.streak })}</span>
                      </p>

                      <div className="mt-0.5 flex items-center gap-1 text-[10px] text-ink/40 dark:text-cream/40">
                        {g.goalType === 'duration' ? (
                          <CalendarCheck size={11} className="text-[#8FBC8F]" />
                        ) : g.goalUnit === 'range' ? (
                          <Moon size={11} className="text-[#8FBC8F]" />
                        ) : (
                          <BookOpen size={11} className="text-[#8FBC8F]" />
                        )}
                        <span className="truncate">
                          {g.goalType === 'duration' && g.goalEndAt
                            ? t('community.goalLabelDuration', {
                                n: g.goalTarget,
                                unit:
                                  g.goalUnit === 'time'
                                    ? t('goals.minutes')
                                    : g.goalUnit === 'page'
                                      ? t('goals.pages')
                                      : t('goals.verses'),
                                days: Math.max(
                                  0,
                                  Math.ceil((new Date(g.goalEndAt).getTime() - Date.now()) / 86_400_000),
                                ),
                              })
                            : t('community.goalLabel', {
                                n: g.goalTarget,
                                unit:
                                  g.goalUnit === 'time'
                                    ? t('goals.unitTime')
                                    : g.goalUnit === 'page'
                                      ? t('goals.unitPage')
                                      : t('goals.unitVerse'),
                              }) +
                              (g.goalUnit === 'range' && g.goalRangeFrom && g.goalRangeTo
                                ? ` · ${g.goalRangeFrom}${
                                    g.goalRangeFrom === g.goalRangeTo ? '' : '–' + g.goalRangeTo.split(':')[1]
                                  }`
                                : '')}
                        </span>
                      </div>
                    </div>

                    <div className="ml-3 flex shrink-0 flex-col items-end gap-1">
                      <span className="rounded-full bg-black/5 px-2 py-0.5 text-[10px] font-bold text-ink/70 dark:bg-white/10 dark:text-cream/70">
                        {t('community.memberCountN', { n: g.memberCount })}
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </>
      ) : (
        /* Explore Tab */
        <div>
          {/* Search Bar */}
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-gray-200/80 bg-white px-3 py-2 shadow-sm dark:border-white/10 dark:bg-[#122A1F]">
            <Search size={14} className="text-ink/40 dark:text-cream/40" />
            <input
              value={exploreSearch}
              onChange={(e) => setExploreSearch(e.target.value)}
              placeholder={t('community.searchPlaceholder')}
              className="flex-1 bg-transparent text-xs text-ink outline-none dark:text-cream"
            />
            {exploreSearch ? (
              <button
                type="button"
                onClick={() => setExploreSearch('')}
                className="text-xs font-bold text-ink/40 dark:text-cream/40"
              >
                ✕
              </button>
            ) : null}
          </div>

          {filteredExplore === null ? (
            <div className="py-16 text-center text-xs text-ink/50 dark:text-cream/50">
              {t('common.loading')}
            </div>
          ) : filteredExplore.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 py-12 text-center dark:border-white/15">
              <Users className="mx-auto text-ink/30 dark:text-cream/30" size={36} />
              <p className="mt-3 text-xs text-ink/60 dark:text-cream/60">
                {t('community.exploreEmpty')}
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredExplore.map((e) => {
                const total = e.todayTotal
                const frac = total > 0 ? Math.min(1, e.todayOnTarget / total) : 0
                return (
                  <div
                    key={e.id}
                    className="flex items-center rounded-2xl border border-gray-200/80 bg-white p-3.5 shadow-sm dark:border-white/10 dark:bg-[#122A1F]/50"
                  >
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                      style={{
                        background: `conic-gradient(#8FBC8F ${frac * 360}deg, rgba(143,188,143,0.18) 0deg)`,
                      }}
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[10px] font-bold text-ink dark:bg-[#0D1F17] dark:text-cream">
                        {Math.round(frac * 100)}%
                      </span>
                    </div>

                    <div className="ml-3 min-w-0 flex-1">
                      <div className="flex items-center gap-1 truncate">
                        <Users size={13} className="shrink-0 text-[#8FBC8F]" />
                        <span className="truncate text-sm font-bold text-ink dark:text-cream">
                          {e.name}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-ink/60 dark:text-cream/60">
                        {t('community.ringLabel', { done: e.todayOnTarget, total: e.todayTotal })} ·{' '}
                        <span className="font-semibold text-amber-600 dark:text-amber-400">
                          {t('community.streakDays', { n: e.streak })}
                        </span>
                      </p>
                      <p className="text-[10px] text-ink/40 dark:text-cream/40">
                        {t('community.memberCountN', { n: e.memberCount })}
                      </p>
                    </div>

                    <div className="ml-2.5 shrink-0">
                      {e.joined ? (
                        <Link
                          to={`/community/${e.id}`}
                          className="rounded-full border border-gray-200 bg-black/5 px-3 py-1.5 text-xs font-bold text-ink/70 dark:border-white/10 dark:bg-white/10 dark:text-cream/70"
                        >
                          {t('community.joined')}
                        </Link>
                      ) : e.full ? (
                        <span className="rounded-full bg-black/5 px-3 py-1.5 text-xs font-bold text-ink/40 dark:bg-white/10 dark:text-cream/40">
                          {t('community.full')}
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => void joinExploreGroup(e.id)}
                          disabled={busyExploreId === e.id}
                          className="rounded-xl bg-[#8FBC8F] px-3.5 py-1.5 text-xs font-bold text-white transition hover:opacity-90 disabled:opacity-50"
                        >
                          {busyExploreId === e.id ? '...' : t('community.joinAction')}
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

