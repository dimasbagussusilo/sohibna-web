import { Navigate, Outlet, Route, Routes } from 'react-router'
import { I18nProvider } from '@/context/I18nContext'
import { AuthProvider } from '@/context/AuthContext'
import { QuranDataProvider } from '@/context/QuranDataContext'
import { AppProvider } from '@/context/AppContext'
import { AppShell } from '@/components/AppShell'
import { Toast } from '@/components/Toast'
import { Home } from '@/routes/Home'
import { QuranDashboard } from '@/routes/QuranDashboard'
import { SurahReader } from '@/routes/SurahReader'
import { Login, Register } from '@/routes/Login'
import { Me } from '@/routes/Me'

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
                <Route path="/calendar" element={<ComingSoon />} />
                <Route path="/quran" element={<QuranDashboard />} />
                <Route path="/rulings" element={<ComingSoon />} />
                <Route path="/me" element={<Me />} />
              </Route>
              <Route path="/surah/:id" element={<SurahReader />} />
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
            <Toast />
          </AppProvider>
        </QuranDataProvider>
      </AuthProvider>
    </I18nProvider>
  )
}

function ComingSoon() {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <p className="text-ink/60 dark:text-cream/60">Coming soon (P2)</p>
    </div>
  )
}
