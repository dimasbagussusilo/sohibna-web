import type { CSSProperties, ReactNode } from 'react'

// Web port of the RN AppText. On web the Tajawal-for-Arabic rule lives in
// index.css (html[dir='rtl'] body { font-family: Tajawal }), so unlike RN —
// where fontFamily doesn't cascade View→Text and every Text must re-pin it —
// this component is a plain element; keeping it preserves the ported screens'
// JSX shape and gives a single place to attach font behaviour if it diverges
// again.
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
  const Tag = as
  return (
    <Tag className={`${weight ? WEIGHT_TO_CLASS[weight] : ''} ${className}`} style={style} {...rest}>
      {children}
    </Tag>
  )
}
