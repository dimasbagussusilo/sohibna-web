import { Link, useNavigate } from 'react-router'
import { LogOut, Moon, Sun, Globe, ChevronRight } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useI18n } from '@/context/I18nContext'
import { useApp } from '@/context/AppContext'
import { useQuranData } from '@/hooks/useQuranData'
import { langName } from '@/i18n/langName'
import type { Lang } from '@/i18n/types'

// Me tab (web, P0): profile, language, dark mode, logout. Alarms/qibla/etc.
// entry points land with their P2 screens.
export function Me() {
  const { t, lang, setLang } = useI18n()
  const { user, logout } = useAuth()
  const { darkMode, setDarkMode } = useApp()
  const { setAppSetting } = useQuranData()
  const navigate = useNavigate()

  const LANGS: Lang[] = ['id', 'en', 'ar']

  return (
    <div className="mx-auto max-w-3xl px-4 pt-6">
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
            </button>
          ))}
        </div>
      </Section>

      {/* Dark mode */}
      <Section title={t('settings.appearance')}>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="flex w-full items-center justify-between px-4 pb-4 pt-1"
        >
          <span className="flex items-center gap-2 text-sm text-ink dark:text-cream">
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            {t('settings.darkMode')}
          </span>
          <span
            className={`relative h-6 w-11 rounded-full transition-colors ${
              darkMode ? 'bg-[#8FBC8F]' : 'bg-gray-300 dark:bg-white/20'
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                darkMode ? 'start-[22px]' : 'start-0.5'
              }`}
            />
          </span>
        </button>
      </Section>

      {/* Placeholder rows for P2 screens */}
      <Section title={t('me.more')}>
        <div className="px-4 pb-2 text-xs text-ink/40 dark:text-cream/40">
          {t('quranHome.progressGuestPrompt')}
        </div>
      </Section>

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
