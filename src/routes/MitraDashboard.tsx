import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { ChevronLeft, Copy, Users } from 'lucide-react'
import { useI18n } from '@/context/I18nContext'
import { useApp } from '@/context/AppContext'
import { useAuth } from '@/context/AuthContext'
import { getMyPartners, type PartnerRow } from '@/api'
import { LANDING_ORIGIN } from '@/origins'
import { QRCode } from '@/components/QRCode'

// Program Mitra dashboard (0033, Phase 1: tracking only). App-origin route
// behind auth — the partner logs in with their Sohibna account and sees
// AGGREGATE stats for the partner rows they own (ops creates rows by hand).
// No referred-user identities are ever displayed (server returns counts only).
export function MitraDashboard() {
  const { t } = useI18n()
  const { toast } = useApp()
  const { token, loading: authLoading } = useAuth()
  const [partners, setPartners] = useState<PartnerRow[] | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!token) return
    getMyPartners()
      .then((r) => setPartners(r.partners ?? []))
      .catch(() => setError(true))
  }, [token])

  if (authLoading) {
    return <p className="py-10 text-center text-sm text-ink/50 dark:text-cream/50">{t('common.loading')}</p>
  }
  if (!token) {
    return <MitraLoginGate />
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
                </dl>
              </section>
            )
          })}
        </div>
      )}
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
