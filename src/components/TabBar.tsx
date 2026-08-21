import { NavLink, useLocation, useNavigate } from 'react-router'
import { House, CalendarDays, Scale, UserCircle } from 'lucide-react'
import { useI18n } from '@/context/I18nContext'
import { useApp } from '@/context/AppContext'
import { QuranLogo, IqraLogo } from '@/components/QuranLogo'

// Navigation — web port of the RN QuranTabBar.
//
// Mobile (<lg): the floating white pill with the centre FAB carrying the Quran
// calligraphy; four icon+label items (two per side), active item turns green
// with a dot beneath. The notch is faked the same way — a half-disc of the
// page background over the pill.
//
// Desktop (≥lg): a slim left rail with the same five destinations (icon +
// label stacked). No FAB morph needed; the Quran item is simply the emphasised
// one. Keep-to-Iqro doesn't translate to mouse UX; Iqro stays reachable from
// Home/me on desktop.
//
// Mounting: <RailNav/> renders on every page (stack screens clear it via the
// same lg:ps-20 the shell uses); <MobileTabBar/> only on the five tab routes —
// stack screens are full-screen on mobile, no pill.

const TABS = [
  { path: '/home', icon: House, key: 'tabs.home' },
  { path: '/calendar', icon: CalendarDays, key: 'tabs.calendar' },
  // centre FAB slot (/quran)
  { path: '/rulings', icon: Scale, key: 'tabs.rulings' },
  { path: '/me', icon: UserCircle, key: 'tabs.me' },
] as const

// The five (tabs) routes — everything else is a stack screen.
const TAB_PATHS = new Set(['/home', '/calendar', '/quran', '/rulings', '/me'])

export function useIsTabRoute(): boolean {
  const { pathname } = useLocation()
  return TAB_PATHS.has(pathname)
}

export function TabBar() {
  const showPill = useIsTabRoute()
  return (
    <>
      {showPill ? <MobileTabBar /> : null}
      <RailNav />
    </>
  )
}

function MobileTabBar() {
  const { t } = useI18n()
  const { darkMode } = useApp()
  const navigate = useNavigate()

  const pageBg = darkMode ? '#0D1F17' : '#F5F0E6'
  const pillBg = darkMode ? 'bg-[#163024]' : 'bg-white'
  const textMuted = darkMode ? 'text-[#9DB8AA]' : 'text-[#7A9D7A]'
  const textActive = 'text-[#7A9D7A]'

  return (
    <nav
      className={`fixed inset-x-0 bottom-0 z-40 lg:hidden ${pillBg}`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Main"
    >
      <div className="relative mx-auto flex h-[62px] max-w-md items-end justify-between px-5">
        {/* Notch: half-disc of the page bg faking a cutout behind the FAB */}
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-10 w-20 -translate-x-1/2 -translate-y-1/2 rounded-t-full"
          style={{ background: pageBg }}
        />
        <TabItem tab={TABS[0]} textMuted={textMuted} textActive={textActive} />
        <TabItem tab={TABS[1]} textMuted={textMuted} textActive={textActive} />
        {/* Centre FAB */}
        <button
          onClick={() => navigate('/quran')}
          aria-label={t('tabs.quran')}
          className="absolute left-1/2 top-0 flex h-[58px] w-[58px] -translate-x-1/2 -translate-y-[19px] items-center justify-center rounded-full bg-[#7A9D7A] text-white shadow-lg active:scale-95"
        >
          <QuranLogo size={30} />
        </button>
        <TabItem tab={TABS[2]} textMuted={textMuted} textActive={textActive} />
        <TabItem tab={TABS[3]} textMuted={textMuted} textActive={textActive} />
      </div>
    </nav>
  )
}

function RailNav() {
  const { t } = useI18n()

  return (
    <aside className="fixed inset-y-0 start-0 z-40 hidden w-20 flex-col items-center gap-1 border-e border-black/5 bg-white py-6 dark:border-white/10 dark:bg-[#163024] lg:flex">
      <NavLink
        to="/quran"
        className={({ isActive }) =>
          `mb-4 flex h-12 w-12 items-center justify-center rounded-2xl shadow ${
            isActive ? 'bg-[#7A9D7A] text-white' : 'bg-[#7A9D7A]/15 text-[#7A9D7A]'
          }`
        }
        aria-label={t('tabs.quran')}
        title={t('tabs.quran')}
      >
        <QuranLogo size={26} />
      </NavLink>
      {TABS.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          className={({ isActive }) =>
            `flex w-16 flex-col items-center gap-1 rounded-xl py-2 text-[11px] ${
              isActive ? 'text-[#7A9D7A] ' + 'font-medium' : 'text-ink/50 dark:text-cream/50'
            }`
          }
        >
          <tab.icon size={22} strokeWidth={1.8} />
          {t(tab.key)}
        </NavLink>
      ))}
      <div className="mt-auto">
        <IqraLogo size={22} />
      </div>
    </aside>
  )
}

function TabItem({
  tab,
  textMuted,
  textActive,
}: {
  tab: (typeof TABS)[number]
  textMuted: string
  textActive: string
}) {
  const { t } = useI18n()
  return (
    <NavLink
      to={tab.path}
      className={({ isActive }) =>
        `flex w-14 flex-col items-center gap-0.5 pb-2 text-[10px] ${
          isActive ? `${textActive} font-medium` : textMuted
        }`
      }
    >
      {({ isActive }) => (
        <>
          <tab.icon size={21} strokeWidth={1.8} />
          {t(tab.key)}
          <span
            className={`h-1 w-1 rounded-full ${isActive ? 'bg-[#7A9D7A]' : 'bg-transparent'}`}
          />
        </>
      )}
    </NavLink>
  )
}
