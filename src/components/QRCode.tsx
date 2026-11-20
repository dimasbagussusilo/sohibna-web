// QR code as an inline SVG from the toqr bitmap (zero network, no CSP
// relaxation — an external QR image API would leak the link to a third
// party). toQR returns a square, row-major bitmap (1 = dark module); the
// viewBox pads the mandatory 4-module quiet zone.
import { useMemo } from 'react'
import { toQR } from 'toqr'

export function QRCode({
  content,
  size = 148,
  className,
}: {
  content: string
  size?: number
  className?: string
}) {
  const path = useMemo(() => {
    const bits = toQR(content)
    const side = Math.round(Math.sqrt(bits.length))
    let d = ''
    for (let i = 0; i < bits.length; i++) {
      if (bits[i]) d += `M${i % side} ${Math.floor(i / side)}h1v1h-1z`
    }
    return { d, side }
  }, [content])

  const { d, side } = path
  return (
    <svg
      viewBox={`-4 -4 ${side + 8} ${side + 8}`}
      width={size}
      height={size}
      role="img"
      aria-label={content}
      className={className}
      shapeRendering="crispEdges"
    >
      <rect x={-4} y={-4} width={side + 8} height={side + 8} fill="#ffffff" />
      <path d={d} fill="#0B1E15" />
    </svg>
  )
}
