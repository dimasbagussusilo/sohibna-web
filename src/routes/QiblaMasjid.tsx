import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { ChevronLeft, Compass, MapPin, ExternalLink } from 'lucide-react'
import { qiblaBearing } from '@/lib/prayer'
import { useLocation } from '@/hooks/useLocation'
import { usePlaceName } from '@/hooks/usePlaceName'
import { useI18n } from '@/context/I18nContext'

// Qibla (web): browsers expose no magnetometer, so the live compass of the RN
// app isn't possible. Instead: the great-circle bearing to the Kaaba from the
// user's location, plus a dial the user rotates to match a physical compass.
export function Qibla() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const { coords } = useLocation()
  const place = usePlaceName(coords)
  const [rotation, setRotation] = useState(0)

  const bearing = useMemo(
    () => (coords ? qiblaBearing(coords.latitude, coords.longitude) : null),
    [coords?.latitude, coords?.longitude], // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <div className="min-h-dvh bg-cream dark:bg-night">
      <header className="sticky top-0 z-30 flex items-center gap-2 border-b border-black/5 bg-cream/90 px-3 py-2 backdrop-blur dark:border-white/10 dark:bg-night/90">
        <button
          onClick={() => (history.length > 1 ? navigate(-1) : navigate('/home'))}
          className="rtl-flip flex h-9 w-9 items-center justify-center rounded-full text-ink dark:text-cream"
          aria-label="back"
        >
          <ChevronLeft size={22} />
        </button>
        <div className="flex-1 text-center text-sm font-bold text-ink dark:text-cream">
          {t('home.qibla')}
        </div>
        <span className="w-9" />
      </header>

      <div className="mx-auto max-w-md px-4 pt-8">
        {bearing === null ? (
          <div className="rounded-3xl bg-white px-6 py-12 text-center shadow-sm dark:bg-[#122A1F]">
            <Compass size={28} className="mx-auto mb-3 text-ink/30 dark:text-cream/30" />
            <p className="text-xs text-ink/50 dark:text-cream/50">{t('common.grantLocation')}</p>
          </div>
        ) : (
          <>
            <p className="mb-4 text-center text-xs text-ink/50 dark:text-cream/50">
              {place?.label ?? `${coords!.latitude.toFixed(2)}, ${coords!.longitude.toFixed(2)}`}
            </p>

            {/* Dial: N at top; the green arrow points `bearing`° from north.
                Drag/scroll the dial to align with a physical compass. */}
            <div className="relative mx-auto mb-6 h-64 w-64">
              <div
                className="absolute inset-0 rounded-full border-4 border-ink/10 bg-white shadow-lg dark:border-white/10 dark:bg-[#122A1F]"
                style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 150ms' }}
                onClick={() => setRotation((r) => r + 15)}
              >
                {/* Cardinal marks */}
                {(['N', 'E', 'S', 'W'] as const).map((d, i) => (
                  <span
                    key={d}
                    className={`absolute left-1/2 top-3 -translate-x-1/2 text-xs font-bold ${
                      d === 'N' ? 'text-red-500' : 'text-ink/50 dark:text-cream/50'
                    }`}
                    style={{ transform: `rotate(${i * 90}deg) translateY(0) `, transformOrigin: '50% 116px' }}
                  >
                    {d}
                  </span>
                ))}
                {/* tick marks every 30° */}
                {Array.from({ length: 12 }, (_, i) => (
                  <span
                    key={i}
                    className="absolute left-1/2 top-0 h-3 w-px bg-ink/20 dark:bg-cream/20"
                    style={{ transform: `rotate(${i * 30}deg)`, transformOrigin: '50% 128px' }}
                  />
                ))}
                {/* Qibla arrow */}
                <div
                  className="absolute inset-0 flex items-start justify-center"
                  style={{ transform: `rotate(${bearing}deg)` }}
                >
                  <div className="mt-8 flex flex-col items-center">
                    <span className="text-2xl">🕋</span>
                    <div className="h-20 w-1 rounded-full bg-[#8FBC8F]" />
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-[#8FBC8F]" />
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-night px-5 py-5 text-center text-cream dark:bg-[#163024]">
              <div className="text-3xl font-bold">{Math.round(bearing)}°</div>
              <div className="text-xs text-cream/60">{t('home.findDirection')}</div>
              <p className="mt-3 text-[10px] leading-relaxed text-cream/40">
                {t('qibla.compassUnavailable')}
              </p>
            </div>

            <p className="mt-4 text-center text-[10px] text-ink/40 dark:text-cream/40">
              tap the dial to rotate +15°
            </p>
          </>
        )}
      </div>
    </div>
  )
}

// Nearby masjid (web): Google Maps embed iframe (the RN app used a WebView
// with the same embed URL) + an "open in Maps" link.
export function NearbyMasjid() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const { coords } = useLocation()

  const embedUrl = coords
    ? `https://maps.google.com/maps?q=masjid&ll=${coords.latitude},${coords.longitude}&z=14&output=embed`
    : 'https://maps.google.com/maps?q=masjid&z=12&output=embed'
  const linkUrl = coords
    ? `https://www.google.com/maps/search/masjid/@${coords.latitude},${coords.longitude},14z`
    : 'https://www.google.com/maps/search/masjid'

  useEffect(() => {
    // CSP for the deployed site allows maps.google.com frames (nginx.conf).
  }, [])

  return (
    <div className="min-h-dvh bg-cream dark:bg-night">
      <header className="sticky top-0 z-30 flex items-center gap-2 border-b border-black/5 bg-cream/90 px-3 py-2 backdrop-blur dark:border-white/10 dark:bg-night/90">
        <button
          onClick={() => (history.length > 1 ? navigate(-1) : navigate('/home'))}
          className="rtl-flip flex h-9 w-9 items-center justify-center rounded-full text-ink dark:text-cream"
          aria-label="back"
        >
          <ChevronLeft size={22} />
        </button>
        <div className="flex-1 text-center text-sm font-bold text-ink dark:text-cream">
          {t('home.nearbyMasjid')}
        </div>
        <span className="w-9" />
      </header>

      <div className="mx-auto max-w-3xl px-4 pt-4">
        <div className="mb-3 flex items-center gap-2 text-xs text-ink/50 dark:text-cream/50">
          <MapPin size={13} />
          {coords ? `${coords.latitude.toFixed(2)}, ${coords.longitude.toFixed(2)}` : t('common.grantLocation')}
        </div>
        <div className="overflow-hidden rounded-3xl shadow-sm">
          <iframe
            title="nearby masjid"
            src={embedUrl}
            className="h-[65dvh] w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <a
          href={linkUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-[#8FBC8F] py-3 text-sm font-bold text-white"
        >
          <ExternalLink size={15} /> {t('home.findMasjid')}
        </a>
        <div className="h-8" />
      </div>
    </div>
  )
}

// /alarms — the adhan alarm system is Android-native (foreground service,
// exact alarms, boot receiver) and has no web equivalent. Route kept so links
// from other surfaces land somewhere honest.
export function AlarmsUnavailable() {
  const { t } = useI18n()
  const navigate = useNavigate()
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-cream px-8 text-center dark:bg-night">
      <div className="mb-4 text-4xl">🔔</div>
      <h1 className="text-base font-bold text-ink dark:text-cream">{t('alarms.title')}</h1>
      <p className="mt-2 max-w-xs text-xs leading-relaxed text-ink/50 dark:text-cream/50">
        Adhan alarms, the home-screen prayer widget, and battery settings are
        Android-native features — they live in the Sohibna mobile app.
      </p>
      <button
        onClick={() => navigate('/home')}
        className="mt-6 rounded-full bg-[#8FBC8F] px-6 py-2.5 text-sm font-bold text-white"
      >
        {t('tabs.home')}
      </button>
    </div>
  )
}
