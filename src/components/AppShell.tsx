import type { ReactNode } from 'react'
import { useI18n } from '@/context/I18nContext'
import { useApp } from '@/context/AppContext'

// Screen wrapper: the cream/night page background + safe paddings (bottom bar
// on mobile, rail on desktop). Port of the RN screens' common outer View.
export function AppShell({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  const { hydrated } = useI18n()
  const { loading } = useApp()

  // Mirror the RN splash gate: hold a blank branded screen until lang + dark
  // mode have hydrated so the first paint is already correct (no LTR/dark flash).
  if (!hydrated || loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-cream dark:bg-night">
        <div className="h-10 w-10 animate-pulse rounded-full bg-sage/40" />
      </div>
    )
  }

  return (
    <div className={`min-h-dvh bg-cream pb-[74px] dark:bg-night lg:pb-0 lg:ps-20 ${className}`}>
      {children}
    </div>
  )
}
