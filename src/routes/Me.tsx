import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { LogOut, Globe, ChevronRight, Trophy, Medal, Trash2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useI18n } from '@/context/I18nContext'
import { useApp } from '@/context/AppContext'
import { useQuranData } from '@/context/QuranDataContext'
import { langName, isExperimentalLang } from '@/i18n/langName'
import type { Lang } from '@/i18n/types'
import { VerifyEmailBanner } from '@/components/VerifyEmailBanner'
import { deleteAccount, fetchBillingConfig } from '@/api'
import { PLAY_STORE_URL } from '@/config'
import { clearCursor, clearQueue, clearCache } from '@/lib/quranSync'
import { clearRulingsLocalData } from '@/rulings/history'
import { clearReflectionLocalData } from '@/reflection/history'
import { Crown } from 'lucide-react'

// Me tab (web, P0): profile, language, dark mode, logout. Alarms/qibla/etc.
// entry points land with their P2 screens.
export function Me() {
  const { t, lang, setLang } = useI18n()
  const { user, logout } = useAuth()
  const { appearance, setAppearance, askConfirm, toast } = useApp()
  const { setAppSetting } = useQuranData()
  const navigate = useNavigate()

  // Supporter status card (0037): STATUS ONLY — the web never sells digital
  // goods (Play policy); the CTA links out to the Play listing.
  const [supporterCount, setSupporterCount] = useState(0)
  useEffect(() => {
    fetchBillingConfig()
      .then((c) => setSupporterCount(c.supporterCount))
      .catch(() => {})
  }, [])

  // User-initiated account deletion (0035, Play requirement) — mirror of the
  // app's danger row: server tx wipes the account via FK cascade, then this
  // browser's per-user caches are purged.
  const handleDeleteAccount = async () => {
    const ok = await askConfirm({
      title: t('me.deleteTitle'),
      message: t('me.deleteBody'),
      confirmText: t('me.deleteConfirm'),
      destructive: true,
    })
    if (!ok || !user) return
    try {
      await deleteAccount()
    } catch {
      toast(t('me.deleteFailed'))
      return
    }
    try {
      await clearCursor(user.id)
      await clearQueue(user.id)
      await clearCache(user.id)
      await clearRulingsLocalData()
      await clearReflectionLocalData()
    } catch {
      /* purge best-effort — server data is already gone */
    }
    await logout()
    toast(t('me.deleteDone'))
    navigate('/login')
  }

  const LANGS: Lang[] = ['id', 'en', 'ar', 'tr', 'ur']

  return (
    <div className="mx-auto max-w-3xl px-4 pt-6 lg:max-w-4xl">
      {/* Profile */}
      <div className="mb-5 flex items-center gap-4 rounded-3xl bg-white p-5 shadow-sm dark:bg-[#122A1F]">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#8FBC8F]/20 text-xl font-bold text-[#8FBC8F]">
          {user?.name?.[0]?.toUpperCase() ?? '?'}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-base font-bold text-ink dark:text-cream">
            {user?.name || t('me.guest')}
          </div>
          <div className="truncate text-xs text-ink/50 dark:text-cream/50">
            {user?.email || t('quranHome.guestNotice')}
          </div>
        </div>
      </div>

      {!user ? (
        <Link
          to="/login"
          className="mb-5 block rounded-2xl bg-[#8FBC8F] py-3 text-center text-sm font-bold text-white"
        >
          {t('quranHome.guestLogin')}
        </Link>
      ) : null}

      {/* Verification nudge — unverified password accounts only (Google
          accounts are created verified; undefined = pre-0012 API). */}
      {user && user.email_verified === false ? <VerifyEmailBanner /> : null}

      {/* Language */}
      <Section title={t('settings.languageSection')}>
        <div className="flex gap-2 px-4 pb-4">
          {LANGS.map((l) => (
            <button
              key={l}
              onClick={() => {
                setLang(l)
                // User-initiated switch → also attach to the account (the
                // fromSync apply in App.tsx never reaches here).
                if (user) setAppSetting('lang', l)
              }}
              className={`flex-1 rounded-xl px-3 py-2.5 text-sm ${
                lang === l
                  ? 'bg-[#8FBC8F] font-semibold text-white'
                  : 'bg-black/5 text-ink dark:bg-white/10 dark:text-cream'
              }`}
            >
              {langName[l]}
              {isExperimentalLang(l) && (
                <span className="ml-1.5 rounded-full bg-[#8FBC8F]/15 px-1.5 py-0.5 text-[10px] font-semibold text-[#8FBC8F]">
                  {t('common.experimental')}
                </span>
              )}
            </button>
          ))}
        </div>
      </Section>

      {/* Appearance: fixed light/dark, or auto (follows the time of day) */}
      <Section title={t('settings.appearance')}>
        <div className="flex gap-2 px-4 pb-4">
          {(
            [
              { value: 'light' as const, label: t('settings.lightMode') },
              { value: 'dark' as const, label: t('settings.darkMode') },
              { value: 'auto' as const, label: t('settings.autoMode') },
            ]
          ).map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setAppearance(value)}
              title={value === 'auto' ? t('settings.autoModeDesc') : undefined}
              className={`flex-1 rounded-xl px-3 py-2.5 text-sm ${
                appearance === value
                  ? 'bg-[#8FBC8F] font-semibold text-white'
                  : 'bg-black/5 text-ink dark:bg-white/10 dark:text-cream'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </Section>

      {/* Fastabiqul Khairat + achievements (reading-data surfaces) */}
      <Section title={t('me.more')}>
        <Link to="/leaderboard" className="flex items-center gap-3 px-1 py-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/15">
            <Trophy size={18} className="text-amber-500" />
          </span>
          <span className="flex-1 text-sm font-medium text-ink dark:text-cream">{t('leaderboard.rowLabel')}</span>
          <ChevronRight size={18} className="text-ink/40 dark:text-cream/40" />
        </Link>
        <Link to="/achievements" className="flex items-center gap-3 px-1 py-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/15">
            <Medal size={18} className="text-amber-500" />
          </span>
          <span className="flex-1 text-sm font-medium text-ink dark:text-cream">{t('achievements.rowLabel')}</span>
          <ChevronRight size={18} className="text-ink/40 dark:text-cream/40" />
        </Link>
      </Section>

      {/* Supporter status (0037) — display + Play link only, no web purchase */}
      {user ? (
        <a
          href={PLAY_STORE_URL || undefined}
          target={PLAY_STORE_URL ? '_blank' : undefined}
          rel="noreferrer"
          className={`mt-5 flex items-center gap-3 rounded-2xl px-4 py-3 ${
            user.supporter?.active
              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
              : 'bg-white shadow-sm dark:bg-[#122A1F] text-ink dark:text-cream'
          } ${PLAY_STORE_URL ? '' : 'pointer-events-none'}`}
        >
          <Crown size={18} className="shrink-0" />
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold">
              {user.supporter?.active ? t('supporter.activeTitle') : t('supporter.title')}
            </span>
            <span className="block text-[11px] opacity-70">
              {user.supporter?.active
                ? t('supporter.countLine', { count: String(supporterCount) })
                : PLAY_STORE_URL
                  ? t('supporter.joinInApp')
                  : t('supporter.subtitle')}
            </span>
          </span>
        </a>
      ) : null}

      {/* Logout */}
      {user ? (
        <button
          onClick={async () => {
            await logout()
            navigate('/home')
          }}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500/10 py-3 text-sm font-semibold text-red-500"
        >
          <LogOut size={16} /> {t('settings.logout')}
        </button>
      ) : null}

      {/* Delete account (0035, Play requirement) — quiet row under logout */}
      {user ? (
        <button
          onClick={() => void handleDeleteAccount()}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-transparent py-3 text-xs font-medium text-ink/45 hover:text-ink/70 dark:text-cream/45 dark:hover:text-cream/70"
        >
          <Trash2 size={13} /> {t('me.deleteAccount')}
        </button>
      ) : null}

      <div className="py-6 text-center text-[10px] text-ink/30 dark:text-cream/30">
        Sohibna Web · PWA
        <ChevronRight size={0} className="hidden" />
        <Globe size={0} className="hidden" />
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 overflow-hidden rounded-3xl bg-white shadow-sm dark:bg-[#122A1F]">
      <div className="px-4 pb-1 pt-4 text-[10px] font-bold uppercase tracking-widest text-ink/40 dark:text-cream/40">
        {title}
      </div>
      {children}
    </div>
  )
}
