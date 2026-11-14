import { Suspense, lazy, useEffect } from 'react'
import { Navigate, Outlet, Route, Routes } from 'react-router'
import { I18nProvider, useI18n } from '@/context/I18nContext'
import { isLandingOrigin, appUrl } from '@/origins'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { QuranDataProvider, useQuranData } from '@/context/QuranDataContext'
import { AppProvider } from '@/context/AppContext'
import { AppShell } from '@/components/AppShell'
import { TabBar } from '@/components/TabBar'
import { Toast } from '@/components/Toast'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { AnnouncementPopup } from '@/components/AnnouncementPopup'
import { CelebrationPopup } from '@/components/CelebrationPopup'
import { GlobalHotkeys } from '@/components/ShortcutsOverlay'
import { OfflineBanner } from '@/components/OfflineBanner'

// Every screen is lazy: each route's code (and its heavy content tables —
// mushaf layout, shalat recitations, iqro curriculum, …) downloads only when
// that route is first visited. Landing visitors never fetch app-route chunks
// and vice-versa. Named exports → remap onto lazy's default-component slot.
const Landing = lazy(() => import('@/routes/landing/Landing').then((m) => ({ default: m.Landing })))
// Legal pages live on both origins: canonical on the apex (lang-prefixed, the
// URLs Play/privacy checks hit) and on the app origin with the account's
// persisted language. Lazy so the 5-language content chunks load per route.
const LegalPage = lazy(() => import('@/routes/legal/LegalPage').then((m) => ({ default: m.LegalPage })))
const Home = lazy(() => import('@/routes/Home').then((m) => ({ default: m.Home })))
const QuranDashboard = lazy(() =>
  import('@/routes/QuranDashboard').then((m) => ({ default: m.QuranDashboard })),
)
const QuranSearch = lazy(() =>
  import('@/routes/QuranSearch').then((m) => ({ default: m.QuranSearch })),
)
const Rulings = lazy(() => import('@/routes/Rulings').then((m) => ({ default: m.Rulings })))
const Calendar = lazy(() => import('@/routes/Calendar').then((m) => ({ default: m.Calendar })))
const Dzikir = lazy(() => import('@/routes/Dzikir').then((m) => ({ default: m.Dzikir })))
const DailyReflection = lazy(() =>
  import('@/routes/DailyReflection').then((m) => ({ default: m.DailyReflection })),
)
const ReflectionHistory = lazy(() =>
  import('@/routes/DailyReflection').then((m) => ({ default: m.ReflectionHistory })),
)
const Shalat = lazy(() => import('@/routes/Shalat').then((m) => ({ default: m.Shalat })))
const Iqro = lazy(() => import('@/routes/Iqro').then((m) => ({ default: m.Iqro })))
const Qibla = lazy(() => import('@/routes/QiblaMasjid').then((m) => ({ default: m.Qibla })))
const NearbyMasjid = lazy(() =>
  import('@/routes/QiblaMasjid').then((m) => ({ default: m.NearbyMasjid })),
)
const AlarmsUnavailable = lazy(() =>
  import('@/routes/QiblaMasjid').then((m) => ({ default: m.AlarmsUnavailable })),
)
const QuranGoals = lazy(() => import('@/routes/QuranGoals').then((m) => ({ default: m.QuranGoals })))
const Hafalan = lazy(() => import('@/routes/Hafalan').then((m) => ({ default: m.Hafalan })))
const Leaderboard = lazy(() => import('@/routes/Leaderboard').then((m) => ({ default: m.Leaderboard })))
const Achievements = lazy(() => import('@/routes/Achievements').then((m) => ({ default: m.Achievements })))
const KitabAI = lazy(() => import('@/routes/KitabAI').then((m) => ({ default: m.KitabAI })))
const SurahReader = lazy(() =>
  import('@/routes/SurahReader').then((m) => ({ default: m.SurahReader })),
)
const Login = lazy(() => import('@/routes/Login').then((m) => ({ default: m.Login })))
const Register = lazy(() => import('@/routes/Login').then((m) => ({ default: m.Register })))
const VerifyCode = lazy(() =>
  import('@/routes/AuthRecovery').then((m) => ({ default: m.VerifyCode })),
)
const ForgotPassword = lazy(() =>
  import('@/routes/AuthRecovery').then((m) => ({ default: m.ForgotPassword })),
)
const ResetPassword = lazy(() =>
  import('@/routes/AuthRecovery').then((m) => ({ default: m.ResetPassword })),
)
const Me = lazy(() => import('@/routes/Me').then((m) => ({ default: m.Me })))

// Chunk-load placeholder, matching the in-route loading spinners.
function RouteFallback() {
  return (
    <div className="flex justify-center py-24">
      <div className="h-8 w-8 animate-pulse rounded-full bg-sage/40" />
    </div>
  )
}

// Applies the account's synced UI language once the store has it (0008). Inner
// consumer by design — I18nProvider is outermost for pre-paint RTL, so the
// account apply must live below it. fromSync skips the push-back; the
// remote !== lang guard makes it idempotent (web applies instantly, no
// restart). pendingLang holds off the apply while a locally-chosen language is
// still queued unflushed (e.g. an offline switch) — the stale snapshot value
// must not revert the user's choice until a pull confirms it (the flush folds
// the sent value back into appSettings, at which point remote === lang and
// this no-ops).
function AccountLangApply() {
  const { user } = useAuth()
  const { ud, loaded, pendingLang } = useQuranData()
  const { lang, setLang } = useI18n()
  const remote = user && loaded ? ud.appSettings.lang : null
  useEffect(() => {
    if (!remote || remote === lang) return
    if (pendingLang) return
    setLang(remote, { fromSync: true })
  }, [remote, lang, setLang, pendingLang])
  return null
}

// Root: same provider nesting as the RN app's src/app/_layout.tsx —
// I18n → Auth → QuranData → App → shell + toast. Route table mirrors the
// expo-router file tree: / → home; (tabs) under the shell; stack screens
// (reader, auth) render without the tab bar.
//
// Split-origin build: the apex domain (sohibna.com) serves the marketing
// landing at /, /en, /ar, /tr, /ur — no Auth/QuranData/App providers, no tab bar,
// no offline banner (no API calls, never installable). Every other origin
// runs the app tree below, byte-identical to the pre-landing behavior.
export function App() {
  return (
    <I18nProvider>{isLandingOrigin() ? <LandingRoutes /> : <MainAppRoutes />}</I18nProvider>
  )
}

function LandingRoutes() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<Landing lang="id" />} />
        <Route path="/en" element={<Landing lang="en" />} />
        <Route path="/ar" element={<Landing lang="ar" />} />
        <Route path="/tr" element={<Landing lang="tr" />} />
        <Route path="/ur" element={<Landing lang="ur" />} />
        {/* Legal pages — carved out of the nginx 301 catch-all so they serve
            directly on the apex origin (canonical URLs for Play/policy). */}
        <Route path="/privacy" element={<LegalPage doc="privacy" lang="id" />} />
        <Route path="/en/privacy" element={<LegalPage doc="privacy" lang="en" />} />
        <Route path="/ar/privacy" element={<LegalPage doc="privacy" lang="ar" />} />
        <Route path="/tr/privacy" element={<LegalPage doc="privacy" lang="tr" />} />
        <Route path="/ur/privacy" element={<LegalPage doc="privacy" lang="ur" />} />
        <Route path="/terms" element={<LegalPage doc="terms" lang="id" />} />
        <Route path="/en/terms" element={<LegalPage doc="terms" lang="en" />} />
        <Route path="/ar/terms" element={<LegalPage doc="terms" lang="ar" />} />
        <Route path="/tr/terms" element={<LegalPage doc="terms" lang="tr" />} />
        <Route path="/ur/terms" element={<LegalPage doc="terms" lang="ur" />} />
        {/* Deep apex links never reach the SPA in prod (nginx landing mode 301s
            them to the app origin first) — this is the dev safety net. */}
        <Route path="*" element={<GoToAppOrigin />} />
      </Routes>
    </Suspense>
  )
}

function GoToAppOrigin() {
  useEffect(() => {
    const { pathname, search, hash } = window.location
    window.location.replace(appUrl(`${pathname}${search}${hash}`))
  }, [])
  return null
}

function MainAppRoutes() {
  return (
    <AuthProvider>
        <QuranDataProvider>
          <AppProvider>
            <AccountLangApply />
            <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              {/* OTP pages: /verify-code runs inside the fresh register
                  session (authed API); forgot/reset are public — the emailed
                  6-digit code is the credential. */}
              <Route path="/verify-code" element={<VerifyCode />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              {/* Legal pages, account-language variant (canonical lives on the
                  apex origin; this keeps in-app links same-origin). */}
              <Route path="/privacy" element={<LegalPage doc="privacy" />} />
              <Route path="/terms" element={<LegalPage doc="terms" />} />
              <Route
                element={
                  <AppShell>
                    <Outlet />
                  </AppShell>
                }
              >
                <Route path="/home" element={<Home />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/quran" element={<QuranDashboard />} />
                <Route path="/rulings" element={<Rulings />} />
                <Route path="/me" element={<Me />} />
              </Route>
              <Route path="/surah/:id" element={<SurahReader />} />
              <Route path="/quran-search" element={<QuranSearch />} />
              <Route path="/quran-goals" element={<QuranGoals />} />
              <Route path="/hafalan" element={<Hafalan />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/kitab-ai" element={<KitabAI />} />
              <Route path="/dzikir" element={<Dzikir />} />
              <Route path="/daily-reflection" element={<DailyReflection />} />
              <Route path="/reflection-history" element={<ReflectionHistory />} />
              <Route path="/shalat" element={<Shalat />} />
              <Route path="/iqro" element={<Iqro />} />
              <Route path="/qibla" element={<Qibla />} />
              <Route path="/nearby-masjid" element={<NearbyMasjid />} />
              <Route path="/alarms" element={<AlarmsUnavailable />} />
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
            </Suspense>
            <TabBar />
            <GlobalHotkeys />
            <OfflineBanner />
            <Toast />
            <ConfirmDialog />
            <AnnouncementPopup />
            <CelebrationPopup />
          </AppProvider>
        </QuranDataProvider>
      </AuthProvider>
  )
}
