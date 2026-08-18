// The Quran calligraphy mark used by the tab bar's centre FAB (and the Iqra
// variant for the hold-to-Iqro gesture). Rendered from the same XML strings
// the RN app ships (assets/quran-white.ts / iqra-white.ts) via inline SVG.
import { QURAN_LOGO_XML } from '@/assets/quran-white'
import { IQRA_LOGO_XML } from '@/assets/iqra-white'

export function QuranLogo({ size = 28 }: { size?: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: QURAN_LOGO_XML }}
      aria-hidden="true"
    />
  )
}

export function IqraLogo({ size = 28 }: { size?: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: IQRA_LOGO_XML }}
      aria-hidden="true"
    />
  )
}
