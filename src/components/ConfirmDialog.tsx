import { useEffect } from 'react'
import { useApp } from '@/context/AppContext'
import { useI18n } from '@/context/I18nContext'

// Overlay confirmation dialog rendered once in App (like Toast). Keeps every
// ask — destructive confirms and informational alerts — on the app's own design
// instead of the browser's window.confirm. Escape cancels, Enter confirms.
export function ConfirmDialog() {
  const { confirmReq, settleConfirm } = useApp()
  const { t } = useI18n()

  useEffect(() => {
    if (!confirmReq) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') settleConfirm(false)
      else if (e.key === 'Enter') settleConfirm(true)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [confirmReq, settleConfirm])

  if (!confirmReq) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 px-6">
      <div className="absolute inset-0" onClick={() => settleConfirm(false)} />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label={confirmReq.title}
        className="relative w-full max-w-sm rounded-3xl border border-black/5 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-[#122A1F]"
      >
        <div className="text-center text-base font-bold text-ink dark:text-cream">{confirmReq.title}</div>
        {confirmReq.message && (
          <p className="mt-2 text-center text-[13px] leading-relaxed text-ink/60 dark:text-cream/60">
            {confirmReq.message}
          </p>
        )}
        <div className="mt-6 flex gap-3">
          {!confirmReq.hideCancel && (
            <button
              onClick={() => settleConfirm(false)}
              className="flex-1 rounded-xl bg-black/5 py-3 text-sm font-bold text-ink/70 transition-colors hover:bg-black/10 dark:bg-white/10 dark:text-cream/70 dark:hover:bg-white/15"
            >
              {confirmReq.cancelText ?? t('common.cancel')}
            </button>
          )}
          <button
            onClick={() => settleConfirm(true)}
            className={`flex-1 rounded-xl py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 ${
              confirmReq.destructive ? 'bg-red-500' : 'bg-[#8FBC8F]'
            }`}
          >
            {confirmReq.confirmText ?? t('common.done')}
          </button>
        </div>
      </div>
    </div>
  )
}
