import { Apple, Play } from 'lucide-react'
import { useI18n } from '@/context/I18nContext'
import { PLAY_STORE_URL } from '@/config'

// Store badges. Deliberately custom + glass (not the official store art):
// while a listing isn't live, official "Get it on…" art would promise an
// unavailable install. When VITE_PLAY_STORE_URL is set (listing live), the
// Play badge becomes a real link-out; iOS stays "coming soon" for now.

export function StoreBadge({ kind }: { kind: 'play' | 'ios' }) {
  const { t } = useI18n()
  const isPlay = kind === 'play'
  const live = isPlay && PLAY_STORE_URL

  const body = (
    <>
      {isPlay ? (
        <Play size={22} className="text-cream" />
      ) : (
        <Apple size={22} className="text-cream" />
      )}
      <span className="flex flex-col leading-tight">
        <span className="text-[10px] font-medium uppercase tracking-wide text-cream/50">
          {isPlay ? 'Google Play' : 'App Store'}
        </span>
        <span className="text-sm font-bold text-[#8FBC8F]">
          {live ? t('landing.download.get') : t('landing.download.soon')}
        </span>
      </span>
    </>
  )

  if (live) {
    return (
      <a
        href={PLAY_STORE_URL}
        target="_blank"
        rel="noreferrer"
        title={t('landing.download.playD')}
        className="glass flex items-center gap-3 rounded-2xl px-4 py-2.5 transition-transform hover:scale-[1.03]"
      >
        {body}
      </a>
    )
  }

  return (
    <div
      aria-disabled
      title={t(isPlay ? 'landing.download.playD' : 'landing.download.iosD')}
      className="glass flex cursor-default select-none items-center gap-3 rounded-2xl px-4 py-2.5"
    >
      {body}
    </div>
  )
}
