// Place-name label for the current coords (web port — same cache + shape as
// the RN usePlaceName, backed by lib/geocode.ts which is RN-free).
import { useEffect, useState } from 'react'
import { reverseGeocode, type PlaceName } from '@/lib/geocode'
import { useI18n } from '@/context/I18nContext'
import type { Coords } from '@/hooks/useLocation'

export function usePlaceName(coords: Coords | null): PlaceName | null {
  const { lang } = useI18n()
  const [name, setName] = useState<PlaceName | null>(null)
  // Depend on the primitives so a new-but-equal coords object from the parent
  // doesn't refire the geocode.
  const lat = coords?.latitude
  const lng = coords?.longitude

  useEffect(() => {
    let alive = true
    if (lat == null || lng == null) {
      setName(null)
      return
    }
    reverseGeocode(lat, lng, lang)
      .then((n) => alive && setName(n))
      .catch(() => alive && setName(null))
    return () => {
      alive = false
    }
  }, [lat, lng, lang])

  return name
}
