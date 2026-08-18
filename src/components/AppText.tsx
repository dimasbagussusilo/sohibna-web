import type { CSSProperties, ReactNode } from 'react'
import { useI18n } from '@/context/I18nContext'

// Web port of the RN AppText: a <span> that pins the Tajawal weight when the
// UI language is RTL. On web, CSS font inheritance mostly makes this a plain
// span, but keeping the component keeps ported screens' JSX shape identical.
type Weight = '400' | '500' | '700'

const WEIGHT_TO_CLASS: Record<Weight, string> = {
  '400': 'font-normal',
  '500': 'font-medium',
  '700': 'font-bold',
}

export function AppText({
  children,
  weight = '400',
  className = '',
  style,
  as = 'span',
  ...rest
}: {
  children: ReactNode
  weight?: Weight
  className?: string
  style?: CSSProperties
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'div' | 'label'
} & React.HTMLAttributes<HTMLElement>) {
  const { isRTL } = useI18n()
  const Tag = as
  // Tajawal has explicit weight files; when RTL, make sure the Tajawal family
  // (not a synthesized fallback) renders the requested weight.
  const family: CSSProperties = isRTL ? { fontFamily: 'Tajawal, sans-serif' } : {}
  return (
    <Tag
      className={`${weight ? WEIGHT_TO_CLASS[weight] : ''} ${className}`}
      style={{ ...family, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
