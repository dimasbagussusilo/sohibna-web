import { useEffect } from 'react'
import { Navigate, Outlet, Route, Routes } from 'react-router'
import { I18nProvider, useI18n } from '@/context/I18nContext'
import { isLandingOrigin, appUrl } from '@/origins'
import { Landing } from '@/routes/landing/Landing'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { QuranDataProvider, useQuranData } from '@/context/QuranDataContext'
import { AppProvider } from '@/context/AppContext'
import { AppShell } from '@/components/AppShell'
import { TabBar } from '@/components/TabBar'
import { Toast } from '@/components/Toast'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { GlobalHotkeys } from '@/components/ShortcutsOverlay'
import { OfflineBanner } from '@/components/OfflineBanner'
import { Home } from '@/routes/Home'
import { QuranDashboard } from '@/routes/QuranDashboard'
import { QuranSearch } from '@/routes/QuranSearch'
import { Rulings } from '@/routes/Rulings'
import { Calendar } from '@/routes/Calendar'
import { Dzikir } from '@/routes/Dzikir'
import { DailyReflection, ReflectionHistory } from '@/routes/DailyReflection'
import { Shalat } from '@/routes/Shalat'
import { Iqro } from '@/routes/Iqro'
import { Qibla, NearbyMasjid, AlarmsUnavailable } from '@/routes/QiblaMasjid'
import { QuranGoals } from '@/routes/QuranGoals'
import { Hafalan } from '@/routes/Hafalan'
import { SurahReader } from '@/routes/SurahReader'
import { Login, Register } from '@/routes/Login'
import { VerifyCode, ForgotPassword, ResetPassword } from '@/routes/AuthRecovery'
import { Me } from '@/routes/Me'

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
// landing at /, /en, /ar — no Auth/QuranData/App providers, no tab bar, no
// offline banner (no API calls, never installable). Every other origin runs
// the app tree below, byte-identical to the pre-landing behavior.
export function App() {
  return (
    <I18nProvider>{isLandingOrigin() ? <LandingRoutes /> : <MainAppRoutes />}</I18nProvider>
  )
}

function LandingRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing lang="id" />} />
      <Route path="/en" element={<Landing lang="en" />} />
      <Route path="/ar" element={<Landing lang="ar" />} />
      {/* Deep apex links never reach the SPA in prod (nginx landing mode 301s
          them to the app origin first) — this is the dev safety net. */}
      <Route path="*" element={<GoToAppOrigin />} />
    </Routes>
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
            <TabBar />
            <GlobalHotkeys />
            <OfflineBanner />
            <Toast />
            <ConfirmDialog />
          </AppProvider>
        </QuranDataProvider>
      </AuthProvider>
  )
}
