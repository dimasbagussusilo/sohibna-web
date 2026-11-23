import { useEffect, useState } from 'react'
import { useApp } from '@/context/AppContext'
import { useI18n } from '@/context/I18nContext'

// Overlay confirmation dialog rendered once in App (like Toast). Keeps every
// ask — destructive confirms and informational alerts — on the app's own design
// instead of the browser's window.confirm. Escape cancels, Enter confirms
// (only once the type-to-confirm gate, when present, is satisfied).
export function ConfirmDialog() {
  const { confirmReq, settleConfirm } = useApp()
  const { t } = useI18n()

  // Type-to-confirm gate (typeToConfirm): the input resets for every request —
  // including the null that closes the dialog — so a reopened ask starts blank.
  const [typed, setTyped] = useState('')
  useEffect(() => {
    setTyped('')
  }, [confirmReq])
  const expected = confirmReq?.typeToConfirm
  const typeOk = !expected || typed.trim().toLowerCase() === expected.toLowerCase()

  useEffect(() => {
    if (!confirmReq) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') settleConfirm(false)
      else if (e.key === 'Enter' && typeOk) settleConfirm(true)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [confirmReq, settleConfirm, typeOk])

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
        {expected && (
          <>
            <p className="mt-2 break-all text-center text-[13px] leading-relaxed text-ink/60 dark:text-cream/60">
              {t('common.typeToConfirm', { text: expected })}
            </p>
            <input
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              autoFocus
              autoCapitalize="none"
              autoComplete="off"
              spellCheck={false}
              aria-label={expected}
              className="mt-3 w-full rounded-xl border border-black/10 bg-black/5 px-4 py-3 text-sm text-ink outline-none focus:border-[#8FBC8F]/60 dark:border-white/10 dark:bg-white/10 dark:text-cream dark:focus:border-[#8FBC8F]"
            />
          </>
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
            disabled={!typeOk}
            className={`flex-1 rounded-xl py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40 ${
              typeOk ? 'transition-opacity hover:opacity-90' : ''
            } ${confirmReq.destructive ? 'bg-red-500' : 'bg-[#8FBC8F]'}`}
          >
            {confirmReq.confirmText ?? t('common.done')}
          </button>
        </div>
      </div>
    </div>
  )
}
