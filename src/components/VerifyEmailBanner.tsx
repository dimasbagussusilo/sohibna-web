import { Link } from 'react-router'
import { useI18n } from '@/context/I18nContext'
import { useAuth } from '@/context/AuthContext'

// Me-page banner for an unverified email (web port of the RN component): one
// tap opens the OTP entry page, which carries its own resend + cooldown.
export function VerifyEmailBanner() {
  const { t } = useI18n()
  const { user } = useAuth()

  return (
    <div className="mb-5 rounded-2xl border border-[#8FBC8F]/30 bg-[#8FBC8F]/10 p-4 dark:bg-[#8FBC8F]/15">
      <div className="text-sm font-bold text-[#6FA06F] dark:text-[#8FBC8F]">
        {t('me.verifyBannerTitle')}
      </div>
      <p className="mt-1 text-xs text-ink/50 dark:text-cream/50">{t('me.verifyBannerSub')}</p>
      <Link
        to={`/verify-code?email=${encodeURIComponent(user?.email ?? '')}`}
        className="mt-3 inline-block rounded-xl bg-[#8FBC8F] px-4 py-2 text-xs font-bold text-white"
      >
        {t('me.verifyBannerCTA')}
      </Link>
    </div>
  )
}
