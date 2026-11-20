import { Sparkles } from 'lucide-react'
import { useI18n } from '@/context/I18nContext'
import { PLAY_STORE_URL } from '@/config'

// QuotaLimitSheet — the web answer to the AI daily-quota 429 (0037). The web
// NEVER sells digital goods (Play policy): this card explains the limit and
// links out to the Play listing. Rendered inline at the AI error surfaces
// when the thrown ApiError carries code === 'ai_quota_exceeded'.
export function QuotaLimitSheet() {
  const { t } = useI18n()
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-[#8FBC8F]/30 bg-[#8FBC8F]/10 px-4 py-4 text-center">
      <Sparkles size={20} className="mx-auto mb-2 text-[#8FBC8F]" />
      <p className="text-sm font-semibold text-ink dark:text-cream">{t('quota.title')}</p>
      <p className="mt-1 text-xs leading-relaxed text-ink/60 dark:text-cream/60">
        {t('quota.body')}
      </p>
      {PLAY_STORE_URL ? (
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
