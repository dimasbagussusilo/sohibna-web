import { Sparkles } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useI18n } from '@/context/I18nContext'
import { PLAY_STORE_URL } from '@/config'

// QuotaLimitSheet — the web answer to the AI daily-quota 429 (0037). The web
// NEVER sells digital goods (Play policy): this card explains the limit and
// links out to the Play listing. Rendered inline at the AI error surfaces
// when the thrown ApiError carries code === 'ai_quota_exceeded'.
//
// State-aware (the app's TierSheet rule, 2026-11-25): the plan comparison
// and the Play link belong ONLY to tiers that can still upgrade. A Premium
// member at their 15+15 limit gets a plain "back tomorrow" — never an upsell
// for something they already own — and a Supporter is not told their "free"
// quota ran out.
export function QuotaLimitSheet() {
  const { t } = useI18n()
  const { user } = useAuth()
  const premium = !!user?.plus?.active
  const supporter = !premium && !!user?.supporter?.active
  const offerPlans = !premium
  const body = premium
    ? 'quota.limitBodyPremium'
    : supporter
      ? 'quota.limitBodySupporter'
      : 'quota.body'
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-[#8FBC8F]/30 bg-[#8FBC8F]/10 px-4 py-4 text-center">
      <Sparkles size={20} className="mx-auto mb-2 text-[#8FBC8F]" />
      <p className="text-sm font-semibold text-ink dark:text-cream">{t('quota.title')}</p>
      <p className="mt-1 text-xs leading-relaxed text-ink/60 dark:text-cream/60">{t(body)}</p>
      {offerPlans ? (
        <div className="mt-3 space-y-1 text-start">
          {(
            [
              ['quota.mFree', 'quota.mSup', 'quota.mPrem'],
            ] as const
          ).flatMap((row) =>
            row.map((k) => (
              <p key={k} className="text-[11px] leading-relaxed text-ink/60 dark:text-cream/60">
                • {t(k)}
              </p>
            )),
          )}
        </div>
      ) : null}
      {offerPlans && PLAY_STORE_URL ? (
        <a
          href={PLAY_STORE_URL}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-block rounded-xl bg-[#8FBC8F] px-4 py-2 text-xs font-bold text-white"
        >
          {t('quota.cta')}
        </a>
      ) : null}
    </div>
  )
}
