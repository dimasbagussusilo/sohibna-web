import { parseTransHtml, type FootnotePressInfo } from '@/lib/quran'

// TransText (web) — renders a translation's HTML as inline text with tappable
// footnote markers. The RN version had to split the HTML into segments because
// RN has no DOM; on web the footnote markers become styled <sup> buttons.

// Map a footnote marker number to a Unicode circled digit (①②③…).
const circledNum = (marker: string): string => {
  const n = parseInt(marker, 10)
  if (!Number.isNaN(n)) {
    if (n === 0) return '⓪'
    if (n >= 1 && n <= 20) return String.fromCharCode(0x2460 + n - 1)
  }
  return marker
}

export function TransText({
  html,
  onFootnotePress,
}: {
  html: string
  dark?: boolean
  onFootnotePress?: (info: FootnotePressInfo) => void
}) {
  const parts = parseTransHtml(html)
  if (parts.length === 0) return null

  return (
    <>
      {parts.map((p, i) =>
        p.type === 'text' ? (
          <span key={i}>{p.text}</span>
        ) : (
          <sup
            key={i}
            style={{
              color: '#8FBC8F',
              fontSize: '0.85em',
              fontWeight: 600,
              cursor: onFootnotePress ? 'pointer' : undefined,
              padding: '0 1px',
            }}
            onClick={
              onFootnotePress
                ? (e) =>
                    onFootnotePress({
                      x: e.clientX,
                      y: e.clientY,
                      id: p.id,
                      marker: p.marker,
                    })
                : undefined
            }
          >
            {circledNum(p.marker)}
          </sup>
        ),
      )}
    </>
  )
}
