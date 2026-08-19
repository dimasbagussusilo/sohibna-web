import { useEffect, useState } from 'react'

// Online/offline state + the offline op-queue depth, for the banner.
// The queue lives at the per-user key (0008) — read whatever exists.
export function useOnlineStatus(): { online: boolean; pendingOps: number } {
  const [online, setOnline] = useState(() => navigator.onLine)
  const [pendingOps, setPendingOps] = useState(0)

  useEffect(() => {
    const update = () => setOnline(navigator.onLine)
    window.addEventListener('online', update)
    window.addEventListener('offline', update)

    // Poll queued ops every few seconds while offline (cheap localStorage read).
    const readQueue = () => {
      let n = 0
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i)
        if (k && k.startsWith('sohibna.quran.pending')) {
          try {
            const q = JSON.parse(localStorage.getItem(k) || '[]')
            if (Array.isArray(q)) n += q.length
          } catch {
            /* ignore */
          }
        }
      }
      setPendingOps(n)
    }
    readQueue()
    const id = setInterval(readQueue, 4000)
    return () => {
      window.removeEventListener('online', update)
      window.removeEventListener('offline', update)
      clearInterval(id)
    }
  }, [])

  return { online, pendingOps }
}

// Ask the browser to make our storage persistent (not evictable under disk
// pressure) — matters for offline Quran content. Best-effort; the prompt-less
// granted case is the common one on installed PWAs.
export async function requestPersistentStorage(): Promise<boolean> {
  try {
    if (navigator.storage?.persist) return await navigator.storage.persist()
  } catch {
    /* ignore */
  }
  return false
}

// Whether storage persistence is already granted.
export async function isStoragePersistent(): Promise<boolean> {
  try {
    if (navigator.storage?.persisted) return await navigator.storage.persisted()
  } catch {
    /* ignore */
  }
  return false
}

// Install prompt capture: Chrome fires beforeinstallprompt when the PWA is
// installable but not yet installed; we hold the event and surface a button.
export function useInstallPrompt(): {
  canInstall: boolean
  installed: boolean
  promptInstall: () => Promise<void>
} {
  const [deferred, setDeferred] = useState<Event | null>(null)
  const [installed, setInstalled] = useState(
    () =>
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as { standalone?: boolean }).standalone === true,
  )

  useEffect(() => {
    const onBip = (e: Event) => {
      e.preventDefault()
      setDeferred(e)
    }
    const onInstalled = () => setInstalled(true)
    window.addEventListener('beforeinstallprompt', onBip)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onBip)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const promptInstall = async () => {
    const evt = deferred as (Event & { prompt: () => Promise<void> }) | null
    if (!evt) return
    await evt.prompt()
    setDeferred(null)
  }

  return { canInstall: !!deferred && !installed, installed, promptInstall }
}
