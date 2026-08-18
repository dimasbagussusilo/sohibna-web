import { Star, Tag, BookmarkPlus, MoreHorizontal } from 'lucide-react'
import { useI18n } from '@/context/I18nContext'

// MarkMenu (web port) — one ⋯ trigger consolidating favorite / label /
// reading-mark, with a short dropdown. Favorite toggles inline; Label and
// Reading-mark open the dedicated sheets (LabelSheet / ReadingMarkSheet).

export function MarkMenuTrigger({
  open,
  hasAnyMark,
  onToggle,
}: {
  open: boolean
  hasAnyMark: boolean
  onToggle: () => void
}) {
  return (
    <button onClick={onToggle} className="relative p-1.5" aria-label="marks">
      <MoreHorizontal color={open ? '#8FBC8F' : '#9ca3af'} size={18} />
      {hasAnyMark && !open ? (
        <span className="absolute top-1 right-1 h-2 w-2 rounded-full border border-[#FBF8F1] bg-[#f59e0b] dark:border-[#122A1F]" />
      ) : null}
    </button>
  )
}

export function MarkMenuList({
  isFav,
  hasLabel,
  hasMark,
  onToggleFav,
  onOpenLabel,
  onOpenMark,
  padClass = 'px-3',
}: {
  isFav: boolean
  hasLabel: boolean
  hasMark: boolean
  onToggleFav: () => void
  onOpenLabel: () => void
  onOpenMark: () => void
  padClass?: string
}) {
  const { t } = useI18n()
  return (
    <div className={`${padClass} border-b border-gray-100 py-1 dark:border-white/10`}>
      <Row
        label={t('verseCard.favorite')}
        active={isFav}
        activeColor="#f59e0b"
        icon={<Star color={isFav ? '#f59e0b' : '#9ca3af'} size={16} fill={isFav ? '#f59e0b' : 'none'} />}
        onPress={onToggleFav}
      />
      <Row
        label={t('verseCard.label')}
        active={hasLabel}
        activeColor="#8B5CF6"
        icon={<Tag color={hasLabel ? '#8B5CF6' : '#9ca3af'} size={16} />}
        onPress={onOpenLabel}
      />
      <Row
        label={t('verseCard.readingMark')}
        active={hasMark}
        activeColor="#3b82f6"
        icon={<BookmarkPlus color={hasMark ? '#3b82f6' : '#9ca3af'} size={16} />}
        onPress={onOpenMark}
      />
    </div>
  )
}

function Row({
  label,
  active,
  activeColor,
  icon,
  onPress,
}: {
  label: string
  active: boolean
  activeColor: string
  icon: React.ReactNode
  onPress: () => void
}) {
  return (
    <button
      onClick={onPress}
      className="flex w-full flex-row items-center py-2.5 text-start active:opacity-60"
    >
      <span className="flex w-7 items-center">{icon}</span>
      <span
        className="ms-1 flex-1 text-sm text-[#2C3E50] dark:text-[#E8E2D6]"
        style={active ? { color: activeColor, fontWeight: 600 } : undefined}
      >
        {label}
      </span>
    </button>
  )
}
