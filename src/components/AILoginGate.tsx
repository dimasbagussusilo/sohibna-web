import { LogIn } from 'lucide-react'
import { Link } from 'react-router'
import { useI18n } from '@/context/I18nContext'

// AILoginGate — the web answer to the v2 AI 401 (0039): AI features require
// a signed-in account. Inline prompt (guests), rendered where the AI result
// would have appeared. Never sells anything — Play policy keeps purchases in
// the app; sign-in here only unlocks the free 1/day allowance.
export function AILoginGate() {
  const { t } = useI18n()
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-[#8FBC8F]/30 bg-[#8FBC8F]/10 px-4 py-4 text-center">
      <LogIn size={20} className="mx-auto mb-2 text-[#8FBC8F]" />
      <p className="text-sm font-semibold text-ink dark:text-cream">{t('quota.loginTitle')}</p>
      <p className="mt-1 text-xs leading-relaxed text-ink/60 dark:text-cream/60">
        {t('quota.loginBody')}
      </p>
      <Link
        to="/login"
        className="mt-3 inline-block rounded-xl bg-[#8FBC8F] px-4 py-2 text-xs font-bold text-white"
      >
        {t('quota.loginCta')}
      </Link>
    </div>
  )
}
