import { useApp } from '@/context/AppContext'

// Simple bottom toast mirroring the RN app's Toast component (AppContext-driven).
export function Toast() {
  const { toastMsg } = useApp()
  if (!toastMsg) return null
  return (
    <div
      role="status"
      className="fixed inset-x-0 bottom-24 z-50 mx-auto w-fit max-w-[90vw] rounded-full bg-[#2C3E50] px-4 py-2 text-center text-sm text-white shadow-lg lg:bottom-8"
    >
      {toastMsg}
    </div>
  )
}
