// Device location for prayer times (web port), with the same auto/manual mode
// split as the RN hook. The browser geolocation API always prompts through the
// browser's own permission UI; we mirror the RN behavior of NOT prompting on
// mount — a silent fix only runs when permission is already granted (checked
// via navigator.permissions). The prompt happens only when the user explicitly
// requests a fix (requestAuto).
import { useCallback, useEffect, useState } from 'react'
import storage from '@/lib/storage'

const CACHE_KEY = 'sohibna:last_location'
const SETTINGS_KEY = 'sohibna:location_settings'

export type Coords = { latitude: number; longitude: number }
export type LocationMode = 'auto' | 'manual'
export type LocationSettings = { mode: LocationMode; manual: Coords | null }

const DEFAULT_SETTINGS: LocationSettings = { mode: 'auto', manual: null }

async function loadSettings(): Promise<LocationSettings> {
  try {
    const raw = await storage.getItem(SETTINGS_KEY)
    if (!raw) return DEFAULT_SETTINGS
    const p = JSON.parse(raw) as Partial<LocationSettings>
    const manual =
      p.manual &&
      typeof p.manual.latitude === 'number' &&
      typeof p.manual.longitude === 'number'
        ? (p.manual as Coords)
        : null
    return { mode: p.mode === 'manual' ? 'manual' : 'auto', manual }
  } catch {
    return DEFAULT_SETTINGS
  }
}

async function saveSettings(s: LocationSettings): Promise<void> {
  await storage.setItem(SETTINGS_KEY, JSON.stringify(s))
}

export type LocationState = {
  coords: Coords | null
  loading: boolean
  error: string | null
  settings: LocationSettings
  /** Silent re-read of persisted settings + a non-prompting fix when auto. */
  refresh: () => Promise<void>
  /** Prompt for permission + fetch a fix. */
  requestAuto: () => Promise<boolean>
  /** Persist manual coords and switch to manual mode. */
  setManual: (c: Coords) => Promise<void>
  /** Switch auto/manual without prompting. */
  setMode: (m: LocationMode) => Promise<void>
}

function getPos(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 12_000,
      maximumAge: 10 * 60_000,
    })
  })
}

// Is geolocation permission already granted? (permissions API; Safari/Firefox
// fallback: unknown → treat as not-granted so we never surprise-prompt.)
async function permissionGranted(): Promise<boolean> {
  try {
    const st = await navigator.permissions.query({ name: 'geolocation' as PermissionName })
    return st.state === 'granted'
  } catch {
    return false
  }
}

export function useLocation(): LocationState {
  const [settings, setSettings] = useState<LocationSettings>(DEFAULT_SETTINGS)
  const [coords, setCoords] = useState<Coords | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Silent fix: only if permission is ALREADY granted. Never prompts.
  const fetchAuto = useCallback(async (): Promise<Coords | null> => {
    if (!navigator.geolocation) return null
    if (!(await permissionGranted())) return null
    const pos = await getPos()
    const c: Coords = { latitude: pos.coords.latitude, longitude: pos.coords.longitude }
    await storage.setItem(CACHE_KEY, JSON.stringify(c))
    return c
  }, [])

  // Initial load: persisted mode + cached/auto fix. No permission prompt.
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const s = await loadSettings()
      if (cancelled) return
      setSettings(s)
      if (s.mode === 'manual' && s.manual) {
        setCoords(s.manual)
        setLoading(false)
        return
      }
      const cached = await storage.getItem(CACHE_KEY)
      if (cached) {
        try {
          setCoords(JSON.parse(cached))
        } catch {
          /* ignore bad cache */
        }
      }
      try {
        const c = await fetchAuto()
        if (!cancelled && c) setCoords(c)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Could not determine location.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [fetchAuto])

  const refresh = useCallback(async () => {
    const s = await loadSettings()
    setSettings(s)
    if (s.mode === 'manual' && s.manual) {
      setCoords(s.manual)
      setError(null)
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const c = await fetchAuto()
      if (c) setCoords(c)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not determine location.')
    } finally {
      setLoading(false)
    }
  }, [fetchAuto])

  // Explicit, prompting — the browser shows its own permission UI.
  const requestAuto = useCallback(async (): Promise<boolean> => {
    setLoading(true)
    setError(null)
    try {
      const pos = await getPos()
      const c: Coords = { latitude: pos.coords.latitude, longitude: pos.coords.longitude }
      await storage.setItem(CACHE_KEY, JSON.stringify(c))
      setSettings({ mode: 'auto', manual: null })
      await saveSettings({ mode: 'auto', manual: null })
      setCoords(c)
      return true
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Location permission denied.')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const setManual = useCallback(async (c: Coords) => {
    const next: LocationSettings = { mode: 'manual', manual: c }
    await saveSettings(next)
    setSettings(next)
    setCoords(c)
    setError(null)
  }, [])

  const setMode = useCallback(async (m: LocationMode) => {
    const s = await loadSettings()
    const next: LocationSettings = { ...s, mode: m }
    await saveSettings(next)
    setSettings(next)
  }, [])

  return { coords, loading, error, settings, refresh, requestAuto, setManual, setMode }
}
