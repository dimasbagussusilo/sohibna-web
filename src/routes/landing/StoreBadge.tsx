import { Apple, Play } from 'lucide-react'
import { useI18n } from '@/context/I18nContext'

// "Coming soon" store badges. Deliberately custom + glass (not the official
// store badges): the apps aren't published yet, so official "Get it on..."
// art would promise an unavailable install. When a listing goes live: swap
// the icon for the official badge asset and link it.

export function StoreBadge({ kind }: { kind: 'play' | 'ios' }) {
  const { t } = useI18n()
  const isPlay = kind === 'play'

  return (
    <div
      aria-disabled
      title={t(isPlay ? 'landing.download.playD' : 'landing.download.iosD')}
      className="glass flex cursor-default select-none items-center gap-3 rounded-2xl px-4 py-2.5"
    >
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
          {t('landing.download.soon')}
        </span>
      </span>
    </div>
  )
}
