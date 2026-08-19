import { useEffect } from 'react'
import { Navigate, Outlet, Route, Routes } from 'react-router'
import { I18nProvider, useI18n } from '@/context/I18nContext'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { QuranDataProvider } from '@/context/QuranDataContext'
import { AppProvider } from '@/context/AppContext'
import { useQuranData } from '@/hooks/useQuranData'
import { AppShell } from '@/components/AppShell'
import { Toast } from '@/components/Toast'
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
import { Me } from '@/routes/Me'

// Applies the account's synced UI language once the store has it (0008). Inner
// consumer by design — I18nProvider is outermost for pre-paint RTL, so the
// account apply must live below it. fromSync skips the push-back; the
// remote !== lang guard makes it idempotent (web applies instantly, no restart).
function AccountLangApply() {
  const { user } = useAuth()
  const { ud, loaded } = useQuranData()
  const { lang, setLang } = useI18n()
  const remote = user && loaded ? ud.appSettings.lang : null
  useEffect(() => {
    if (!remote || remote === lang) return
    setLang(remote, { fromSync: true })
  }, [remote, lang, setLang])
  return null
}

// Root: same provider nesting as the RN app's src/app/_layout.tsx —
// I18n → Auth → QuranData → App → shell + toast. Route table mirrors the
// expo-router file tree: / → home; (tabs) under the shell; stack screens
// (reader, auth) render without the tab bar.
export function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <QuranDataProvider>
          <AppProvider>
            <AccountLangApply />
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
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
            <GlobalHotkeys />
            <OfflineBanner />
            <Toast />
          </AppProvider>
        </QuranDataProvider>
      </AuthProvider>
    </I18nProvider>
  )
}
