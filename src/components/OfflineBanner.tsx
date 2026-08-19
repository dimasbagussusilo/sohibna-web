import { useEffect, useState } from 'react'
import { CloudOff, Download } from 'lucide-react'
import { useOnlineStatus, useInstallPrompt, requestPersistentStorage } from '@/hooks/useOnline'
import { useI18n } from '@/context/I18nContext'

// Offline banner (shown only while offline, with the queued-edit count) +
// install button (appears when Chrome offers beforeinstallprompt).
export function OfflineBanner() {
  const { online, pendingOps } = useOnlineStatus()
  const { canInstall, promptInstall } = useInstallPrompt()
  const { t } = useI18n()
  const [dismissedInstall, setDismissedInstall] = useState(false)

  // Ask for persistent storage once, quietly, when the app is used.
  useEffect(() => {
    const id = setTimeout(() => void requestPersistentStorage(), 8000)
    return () => clearTimeout(id)
  }, [])

  if (online && (!canInstall || dismissedInstall)) return null

  return (
    <div className="sticky top-0 z-40 w-full">
      {!online ? (
        <div className="flex items-center justify-center gap-2 bg-[#8d3742] px-4 py-1.5 text-center text-[11px] font-semibold text-white">
          <CloudOff size={12} />
          {t('common.couldNotReach').split('.')[0]}
          {pendingOps > 0 ? ` · ${pendingOps} ⏳` : ''}
        </div>
      ) : null}
      {online && canInstall && !dismissedInstall ? (
        <div className="flex items-center justify-center gap-3 bg-[#0D1F17] px-4 py-2 text-[11px] text-cream">
          <Download size={13} className="text-[#8FBC8F]" />
          <span>{t('downloadSheet.title') === 'Offline Downloads' ? 'Install Sohibna as an app' : 'Pasang Sohibna sebagai aplikasi'}</span>
          <button
            onClick={() => void promptInstall()}
            className="rounded-full bg-[#8FBC8F] px-3 py-1 font-bold text-white"
          >
            Install
          </button>
          <button
            onClick={() => setDismissedInstall(true)}
            className="text-cream/50"
            aria-label="dismiss"
          >
            ✕
          </button>
        </div>
      ) : null}
    </div>
  )
}
