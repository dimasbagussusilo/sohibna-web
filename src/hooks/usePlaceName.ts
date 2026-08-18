// Place-name label for the current coords (web port — same cache + shape as
// the RN usePlaceName, backed by lib/geocode.ts which is RN-free).
import { useEffect, useState } from 'react'
import { reverseGeocode, type PlaceName } from '@/lib/geocode'
import { useI18n } from '@/context/I18nContext'
import type { Coords } from '@/hooks/useLocation'

export function usePlaceName(coords: Coords | null): PlaceName | null {
  const { lang } = useI18n()
  const [name, setName] = useState<PlaceName | null>(null)

  useEffect(() => {
    let alive = true
    if (!coords) {
      setName(null)
      return
    }
    reverseGeocode(coords.latitude, coords.longitude, lang)
      .then((n) => alive && setName(n))
      .catch(() => alive && setName(null))
    return () => {
      alive = false
    }
  }, [coords?.latitude, coords?.longitude, lang])

  return name
}
