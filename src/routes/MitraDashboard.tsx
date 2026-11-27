import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router'
import { ChevronLeft, Copy, Users } from 'lucide-react'
import { useI18n } from '@/context/I18nContext'
import { useApp } from '@/context/AppContext'
import { useAuth } from '@/context/AuthContext'
import {
  ApiError,
  getMyPartners,
  requestMitraPayout,
  type CommissionEntry,
  type EarningsSummary,
  type MitraMeResponse,
  type MitraPayout,
  type PartnerRow,
  type ProgramView,
} from '@/api'
import { LANDING_ORIGIN } from '@/origins'
import { QRCode } from '@/components/QRCode'
import { formatBps, formatDay, formatRupiah } from '@/lib/money'

// Program Mitra dashboard (0033 + 0046). App-origin route behind auth — the
// partner logs in with their Sohibna account and sees AGGREGATE referral stats
// (Phase 1) plus the commission half: their effective rate, balances, the
// newest ledger rows WITH their status, the payout history and a payout
// request (Phase 2). No referred-user identities are ever shown (server
// returns counts + anonymous commission rows only). Money is formatted per
// the reader's language (src/lib/money.ts); the numbers themselves all come
// from the server — the program rate, hold and minimum are ops-editable there,
// so nothing numeric is baked into this page.
export function MitraDashboard() {
  const { t, lang } = useI18n()
  const { toast, askConfirm } = useApp()
  const { token, loading: authLoading } = useAuth()
  const [data, setData] = useState<MitraMeResponse | null>(null)
  const [error, setError] = useState(false)
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    try {
      setData(await getMyPartners())
      setError(false)
    } catch {
      setError(true)
    }
  }, [])

  useEffect(() => {
    if (!token) return
    void load()
  }, [token, load])

  // A refusal carries a machine code (ApiError.code) — never parse messages.
  const payoutError = (e: unknown, min: string): string => {
    if (e instanceof ApiError) {
      if (e.code === 'payout_below_minimum') return t('mitra.payout.belowMin', { min })
      if (e.code === 'payout_already_requested') return t('mitra.payout.alreadyRequested')
      if (e.code === 'mitra_suspended') return t('mitra.payout.suspended')
    }
    return t('mitra.payout.failed')
  }

  const onPayout = async (partner: PartnerRow, earn: EarningsSummary, program: ProgramView) => {
    const min = formatRupiah(program.payoutMinIdr, lang)
    const amount = formatRupiah(earn.availableIdr, lang)
    const ok = await askConfirm({
      title: t('mitra.payout.cta'),
      message: `${t('mitra.payout.body', { amount })}\n\n${t('mitra.payout.minLine', { min })}`,
      confirmText: t('mitra.payout.confirm'),
    })
    if (!ok) return
    setBusy(true)
    try {
      await requestMitraPayout(partner.id)
      toast(t('mitra.payout.requested'))
      await load()
    } catch (e) {
      toast(payoutError(e, min))
    } finally {
      setBusy(false)
    }
  }

  if (authLoading) {
    return <p className="py-10 text-center text-sm text-ink/50 dark:text-cream/50">{t('common.loading')}</p>
  }
  if (!token) {
    return <MitraLoginGate />
  }

  const partners = data?.partners ?? null
  const earnByPartner = new Map((data?.earnings ?? []).map((e: EarningsSummary) => [e.partnerId, e]))
  const entriesByPartner = new Map<string, CommissionEntry[]>()
  for (const e of data?.entries ?? []) {
    const list = entriesByPartner.get(e.partnerId) ?? []
    if (list.length < 4) list.push(e)
    entriesByPartner.set(e.partnerId, list)
  }
  const payoutsByPartner = new Map<string, MitraPayout[]>()
  for (const x of data?.payouts ?? []) {
    const list = payoutsByPartner.get(x.partnerId) ?? []
    if (list.length < 4) list.push(x)
    payoutsByPartner.set(x.partnerId, list)
  }

  const copyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      toast(t('mitra.dashboard.copied'))
    } catch {
      /* clipboard unavailable — the link text is visible anyway */
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 pb-16 pt-6">
      <div className="mb-6 flex items-center gap-2">
        <Link to="/home" className="rounded-full p-2 text-ink/60 hover:bg-black/5 dark:text-cream/60 dark:hover:bg-white/10">
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-ink dark:text-cream">{t('mitra.dashboard.title')}</h1>
          <p className="text-xs text-ink/50 dark:text-cream/50">{t('mitra.dashboard.subtitle')}</p>
        </div>
      </div>

      {partners === null && !error ? (
        <p className="py-10 text-center text-sm text-ink/50 dark:text-cream/50">{t('common.loading')}</p>
      ) : error ? (
        <div className="py-10 text-center">
          <p className="text-sm text-red-500">{t('common.error')}</p>
          <button
            type="button"
            onClick={() => void load()}
            className="mt-3 rounded-xl bg-[#8FBC8F] px-4 py-2 text-xs font-bold text-white"
          >
            {t('common.retry')}
          </button>
        </div>
      ) : partners!.length === 0 ? (
        <div className="rounded-3xl bg-white p-8 text-center shadow-sm dark:bg-[#122A1F]">
          <Users size={28} className="mx-auto mb-3 text-[#8FBC8F]" />
          <p className="text-sm text-ink/70 dark:text-cream/70">{t('mitra.dashboard.empty')}</p>
          <a
            href={`${LANDING_ORIGIN}/mitra`}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-block text-xs font-bold text-[#8FBC8F]"
          >
            {t('mitra.landing.cta')}
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {partners!.map((p) => {
            const link = `${LANDING_ORIGIN}/r/${p.code}`
            const earn = earnByPartner.get(p.id)
            const entries = entriesByPartner.get(p.id) ?? []
            const payouts = payoutsByPartner.get(p.id) ?? []
            return (
              <section key={p.id} className="rounded-3xl bg-white p-5 shadow-sm dark:bg-[#122A1F]">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-bold text-ink dark:text-cream">{p.name}</h2>
                    <p className="text-xs text-ink/50 dark:text-cream/50">
                      {t(`mitra.type.${p.type}`)} · {t(`mitra.status.${p.status}`)}
                    </p>
                  </div>
                  <div className="rounded-xl bg-[#8FBC8F]/10 px-3 py-2 text-center">
                    <p className="text-[10px] uppercase tracking-widest text-ink/40 dark:text-cream/40">
                      {t('mitra.dashboard.yourCode')}
                    </p>
                    <p className="font-mono text-lg font-bold tracking-widest text-ink dark:text-cream">{p.code}</p>
                  </div>
                </div>

                {earn ? (
                  <EarningsCard
                    earn={earn}
                    entries={entries}
                    payouts={payouts}
                    program={data!.program}
                    partner={p}
                    lang={lang}
                    t={t}
                    busy={busy}
                    onPayout={() => onPayout(p, earn, data!.program)}
                  />
                ) : null}

                <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center">
                  <div className="rounded-2xl border border-black/5 bg-white p-2 dark:border-white/10">
                    <QRCode content={link} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] uppercase tracking-widest text-ink/40 dark:text-cream/40">
                      {t('mitra.dashboard.shareLink')}
                    </p>
                    <p className="mb-2 break-all font-mono text-xs text-ink/70 dark:text-cream/70">{link}</p>
                    <button
                      type="button"
                      onClick={() => void copyLink(link)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#8FBC8F] px-3 py-2 text-xs font-bold text-white"
                    >
                      <Copy size={14} />
                      {t('mitra.dashboard.copy')}
                    </button>
                  </div>
                </div>

                <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <Stat label={t('mitra.dashboard.clicks30')} value={p.stats.clicks30d} sub={`${p.stats.clicksTotal}`} />
                  <Stat label={t('mitra.dashboard.signups30')} value={p.stats.signups30d} sub={`${p.stats.signupsTotal}`} />
                  <Stat label={t('mitra.dashboard.active30')} value={p.stats.active30d} />
                  <Stat label={t('mitra.dashboard.circleMembers')} value={p.stats.circleMembers} />
                  <Stat label={t('mitra.dashboard.uniqueReferrals')} value={p.stats.uniqueReferrals} />
                </dl>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}

type Tfunc = ReturnType<typeof useI18n>['t']
type Lang = ReturnType<typeof useI18n>['lang']

const ENTRY_TONE: Record<CommissionEntry['status'], string> = {
  pending: 'bg-black/5 text-ink/50 dark:bg-white/10 dark:text-cream/50',
  available: 'bg-[#8FBC8F]/20 text-[#3F6F4F] dark:text-[#BFE3C4]',
  paid: 'bg-[#8FBC8F]/20 text-[#3F6F4F] dark:text-[#BFE3C4]',
  reversed: 'bg-red-500/10 text-red-700 dark:text-red-300',
  needs_review: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
}

const PAYOUT_TONE: Record<MitraPayout['status'], string> = {
  requested: 'bg-black/5 text-ink/50 dark:bg-white/10 dark:text-cream/50',
  paid: 'bg-[#8FBC8F]/20 text-[#3F6F4F] dark:text-[#BFE3C4]',
  rejected: 'bg-red-500/10 text-red-700 dark:text-red-300',
}

// EarningsCard surfaces the commission half: the applied rate, the "net
// proceeds" explanation, the balances (including a request in flight and
// anything reversed by refunds), the newest ledger rows with their STATUS —
// a reversed row is history, not earnings — the payout history and the
// payout request itself.
function EarningsCard({
  earn,
  entries,
  payouts,
  program,
  partner,
  lang,
  t,
  busy,
  onPayout,
}: {
  earn: EarningsSummary
  entries: CommissionEntry[]
  payouts: MitraPayout[]
  program: ProgramView
  partner: PartnerRow
  lang: Lang
  t: Tfunc
  busy: boolean
  onPayout: () => Promise<void>
}) {
  const ledgerOn = program.ledgerEnabled
  const rate = formatBps(earn.effectiveBps, lang)
  const min = formatRupiah(program.payoutMinIdr, lang)
  const suspended = partner.status !== 'active'
  // Derived, never stored: an open request disables the button and says so.
  const openRequest = payouts.some((x) => x.status === 'requested')
  const canRequest = ledgerOn && !busy && !openRequest && !suspended && earn.availableIdr >= program.payoutMinIdr

  const balances = [
    { label: t('mitra.earnings.available'), value: earn.availableIdr },
    // Money allocated to an open request is neither available nor paid yet —
    // without this line it would simply vanish from the page.
    ...(earn.requestedIdr > 0 ? [{ label: t('mitra.earnings.requested'), value: earn.requestedIdr }] : []),
    { label: t('mitra.earnings.pending'), value: earn.pendingIdr },
    { label: t('mitra.earnings.paid'), value: earn.paidIdr },
  ]

  return (
    <div className="mb-4 rounded-2xl bg-[#8FBC8F]/10 p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-bold text-ink dark:text-cream">{t('mitra.program.yourRate')}</p>
        <span className="rounded-full bg-[#8FBC8F] px-3 py-1 text-xs font-bold text-white">{rate}</span>
      </div>
      <p className="mt-1.5 text-xs leading-relaxed text-ink/55 dark:text-cream/55">{t('mitra.dashboard.calcNote', { rate })}</p>

      {!ledgerOn ? (
        <p className="mt-2 rounded-xl bg-amber-500/10 px-3 py-2 text-xs leading-relaxed text-amber-800 dark:text-amber-200">
          {t('mitra.earnings.notConfigured')}
        </p>
      ) : null}

      <dl
        className="mt-3 grid gap-2 text-center"
        style={{ gridTemplateColumns: `repeat(${balances.length}, minmax(0, 1fr))` }}
      >
        {balances.map((b) => (
          <div key={b.label} className="rounded-xl bg-white/70 px-2 py-2 dark:bg-[#0D1F17]">
            <dt className="text-[10px] text-ink/50 dark:text-cream/50">{b.label}</dt>
            <dd className="text-sm font-bold text-ink dark:text-cream">{formatRupiah(b.value, lang)}</dd>
          </div>
        ))}
      </dl>
      {earn.reversedIdr > 0 ? (
        <p className="mt-2 text-[11px] text-ink/50 dark:text-cream/50">
          {t('mitra.earnings.reversed')}: {formatRupiah(earn.reversedIdr, lang)}
        </p>
      ) : null}

      <div className="mt-3 border-t border-black/5 pt-2 dark:border-white/10">
        <p className="text-[10px] uppercase tracking-widest text-ink/40 dark:text-cream/40">{t('mitra.entry.title')}</p>
        {entries.length === 0 ? (
          <p className="mt-1.5 text-xs leading-relaxed text-ink/55 dark:text-cream/55">{t('mitra.earnings.empty')}</p>
        ) : (
          <div className="mt-1.5 space-y-1">
            {entries.map((e) => {
              const struck = e.status === 'reversed'
              return (
                <div key={e.id} className="flex items-center justify-between gap-2 text-xs">
                  <span className={`text-ink/60 dark:text-cream/60 ${struck ? 'line-through' : ''}`}>
                    {e.adjustment
                      ? t('mitra.entry.adjustment')
                      : t('mitra.entry.basisLine', {
                          rate: formatBps(e.rateBps, lang),
                          base: formatRupiah(e.proceedsIdr ?? 0, lang),
                        })}
                  </span>
                  <span className="flex shrink-0 items-center gap-1.5">
                    <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${ENTRY_TONE[e.status]}`}>
                      {t(`mitra.entry.status.${e.status}`)}
                    </span>
                    {/* A row the server could not price has NO amount — "Rp 0" would read as a fact. */}
                    <span className={`font-bold text-ink dark:text-cream ${struck ? 'line-through opacity-60' : ''}`}>
                      {e.amountIdr == null ? '—' : formatRupiah(e.amountIdr, lang)}
                    </span>
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {payouts.length > 0 ? (
        <div className="mt-3 border-t border-black/5 pt-2 dark:border-white/10">
          <p className="text-[10px] uppercase tracking-widest text-ink/40 dark:text-cream/40">{t('mitra.payout.historyTitle')}</p>
          <div className="mt-1.5 space-y-1">
            {payouts.map((x) => (
              <div key={x.id} className="flex items-center justify-between gap-2 text-xs">
                <span className="text-ink/60 dark:text-cream/60">
                  {formatDay(x.status === 'paid' && x.paidAt ? x.paidAt : x.requestedAt, lang)}
                  {x.taxAmountIdr > 0 ? (
                    <span className="ms-1.5">
                      · {t('mitra.payout.beforeTax')} {formatRupiah(x.amountIdr, lang)}
                    </span>
                  ) : null}
                  {x.status === 'rejected' && x.note ? <span className="ms-1.5">· {x.note}</span> : null}
                </span>
                <span className="flex shrink-0 items-center gap-1.5">
                  <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${PAYOUT_TONE[x.status]}`}>
                    {t(`mitra.payout.status.${x.status}`)}
                  </span>
                  <span className="font-bold text-ink dark:text-cream">{formatRupiah(x.netAmountIdr, lang)}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {ledgerOn ? (
        <>
          <button
            type="button"
            onClick={() => void onPayout()}
            disabled={!canRequest}
            className={`mt-3 w-full rounded-xl py-2.5 text-xs font-bold ${
              canRequest ? 'bg-[#8FBC8F] text-white hover:opacity-90' : 'bg-black/5 text-ink/45 dark:bg-white/10 dark:text-cream/45'
            }`}
          >
            {suspended ? t('mitra.payout.suspended') : openRequest ? t('mitra.payout.alreadyRequested') : t('mitra.payout.cta')}
          </button>
          {!openRequest && !suspended && earn.availableIdr < program.payoutMinIdr ? (
            <p className="mt-1.5 text-center text-[10px] text-ink/45 dark:text-cream/45">{t('mitra.payout.belowMin', { min })}</p>
          ) : null}
        </>
      ) : null}
    </div>
  )
}

function Stat({ label, value, sub }: { label: string; value: number; sub?: string }) {
  return (
    <div className="rounded-2xl bg-cream px-2 py-3 dark:bg-[#0D1F17]">
      <dt className="text-[10px] leading-tight text-ink/50 dark:text-cream/50">{label}</dt>
      <dd className="text-lg font-bold text-ink dark:text-cream">
        {value}
        {sub ? <span className="ms-1 text-[10px] font-normal text-ink/40 dark:text-cream/40">/ {sub}</span> : null}
      </dd>
    </div>
  )
}

// Auth gate: full-page prompt mirroring the login card, so a partner hitting
// app.sohibna.com/mitra cold lands one tap from signing in.
function MitraLoginGate() {
  const { t } = useI18n()
  return (
    <div className="flex min-h-dvh items-center justify-center bg-cream px-4 dark:bg-night">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-sm dark:bg-[#122A1F]">
        <div className="quran-rtl mb-2 text-4xl">صحبنا</div>
        <h1 className="text-lg font-bold text-ink dark:text-cream">{t('mitra.dashboard.title')}</h1>
        <p className="mt-1 text-xs text-ink/50 dark:text-cream/50">{t('mitra.dashboard.subtitle')}</p>
        <Link
          to="/login"
          className="mt-4 inline-block w-full rounded-xl bg-[#8FBC8F] py-3 text-sm font-bold text-white"
        >
          {t('auth.login.login')}
        </Link>
      </div>
    </div>
  )
}
