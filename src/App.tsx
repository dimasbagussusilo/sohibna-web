import { Navigate, Outlet, Route, Routes } from 'react-router'
import { I18nProvider } from '@/context/I18nContext'
import { AuthProvider } from '@/context/AuthContext'
import { QuranDataProvider } from '@/context/QuranDataContext'
import { AppProvider } from '@/context/AppContext'
import { AppShell } from '@/components/AppShell'
import { Toast } from '@/components/Toast'

// Root: same provider nesting as the RN app's src/app/_layout.tsx —
// I18n → Auth → QuranData → App → shell + toast.
export function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <QuranDataProvider>
          <AppProvider>
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route
                element={
                  <AppShell>
                    <Outlet />
                  </AppShell>
                }
              >
                <Route path="/home" element={<HomePlaceholder />} />
                <Route path="/calendar" element={<ComingSoon />} />
                <Route path="/quran" element={<ComingSoon />} />
                <Route path="/rulings" element={<ComingSoon />} />
                <Route path="/me" element={<ComingSoon />} />
              </Route>
            </Routes>
            <Toast />
          </AppProvider>
        </QuranDataProvider>
      </AuthProvider>
    </I18nProvider>
  )
}

function HomePlaceholder() {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <p className="text-ink dark:text-cream">Sohibna web — P0 in progress</p>
    </div>
  )
}

function ComingSoon() {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <p className="text-ink/60 dark:text-cream/60">Coming soon</p>
    </div>
  )
}
