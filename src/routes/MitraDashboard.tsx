import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { ChevronLeft, Copy, Users } from 'lucide-react'
import { useI18n } from '@/context/I18nContext'
import { useApp } from '@/context/AppContext'
import { useAuth } from '@/context/AuthContext'
import { getMyPartners, type MitraMeResponse, type EarningsSummary, type CommissionEntry } from '@/api'
import { LANDING_ORIGIN } from '@/origins'
import { QRCode } from '@/components/QRCode'

// Program Mitra dashboard (0033 + 0046). App-origin route behind auth — the
// partner logs in with their Sohibna account and sees AGGREGATE referral stats
// (Phase 1) plus the commission half: their effective rate, balances and the
// newest ledger entries (Phase 2). No referred-user identities are ever shown
// (server returns counts + anonymous commission rows only).
export function MitraDashboard() {
  const { t } = useI18n()
  const { toast } = useApp()
  const { token, loading: authLoading } = useAuth()
  const [data, setData] = useState<MitraMeResponse | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!token) return
    getMyPartners()
      .then((r) => setData(r))
      .catch(() => setError(true))
  }, [token])

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
        <p className="py-10 text-center text-sm text-red-500">{t('common.error')}</p>
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

                {earn ? <EarningsCard earn={earn} entries={entries} t={t} /> : null}

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

// EarningsCard surfaces the commission half: the applied rate, the "net
// proceeds" explanation, the balances and the most recent ledger entries.
type Tfunc = ReturnType<typeof useI18n>['t']

function EarningsCard({
  earn,
  entries,
  t,
}: {
  earn: EarningsSummary
  entries: CommissionEntry[]
  t: Tfunc
}) {
  const rate = formatRate(earn.effectiveBps)
  const balances = [
    { label: t('mitra.earnings.available'), value: earn.availableIdr },
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
      <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
        {balances.map((b) => (
          <div key={b.label} className="rounded-xl bg-white/70 px-2 py-2 dark:bg-[#0D1F17]">
            <dt className="text-[10px] text-ink/50 dark:text-cream/50">{b.label}</dt>
            <dd className="text-sm font-bold text-ink dark:text-cream">{formatIdr(b.value)}</dd>
          </div>
        ))}
      </dl>
      {entries.length > 0 ? (
        <div className="mt-3 border-t border-black/5 pt-2 dark:border-white/10">
          <p className="text-[10px] uppercase tracking-widest text-ink/40 dark:text-cream/40">
            {t('mitra.entry.title')}
          </p>
          <div className="mt-1.5 space-y-1">
            {entries.map((e) => (
              <div key={e.id} className="flex items-center justify-between gap-2 text-xs">
                <span className="text-ink/60 dark:text-cream/60">
                  {e.adjustment
                    ? t('mitra.entry.adjustment')
                    : t('mitra.entry.basisLine', {
                        rate: formatRate(e.rateBps),
                        base: formatIdr(e.proceedsIdr ?? 0),
                      })}
                </span>
                <span className="font-bold text-ink dark:text-cream">{formatIdr(e.amountIdr ?? 0)}</span>
              </div>
            ))}
          </div>
        </div>
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

// formatRate turns basis points into a human percent: 3000 → "30%".
function formatRate(bps: number): string {
  const pct = bps / 100
  return Number.isInteger(pct) ? `${pct}%` : `${pct.toFixed(1)}%`
}

// formatIdr renders whole rupiah, e.g. Rp 14.549.
function formatIdr(n: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(n)
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
