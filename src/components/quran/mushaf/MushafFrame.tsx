// The traditional printed-mushaf page frame (rules → ornamental band → corner
// knots) for the web mushaf page. All geometry lives in ONE place —
// lib/mushafPage mushafFrameShapes — so the web DOM, the native RNSVG layer
// and the tajweed WebView HTML render pixel-identical frames.
//
// Mirrored in sohibna/src/components/quran/mushaf/MushafFrame.tsx — keep the
// twins in lock-step (platform twins convention).

import { mushafFrameColors, mushafFrameShapes, mushafFrameSpec } from '../../../lib/mushafPage';

export function MushafFrameWeb({ width, height, dark }: { width: number; height: number; dark: boolean }) {
  const shapes = mushafFrameShapes(width, height);
  if (!shapes.length) return null;
  const c = mushafFrameColors(dark);
  const rule = mushafFrameSpec(width).rule;
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: 'absolute', inset: 0, display: 'block', pointerEvents: 'none' }}
      aria-hidden="true"
    >
      {shapes.map((sh, i) => {
        if (sh.k === 'rule')
          return (
            <rect
              key={i}
              x={sh.x}
              y={sh.y}
              width={sh.w}
              height={sh.h}
              fill="none"
              stroke={c.gold}
              strokeWidth={rule}
            />
          );
        if (sh.k === 'ground')
          return <rect key={i} x={sh.x} y={sh.y} width={sh.w} height={sh.h} fill={c.soft} />;
        return (
          <path key={i} d={sh.d} fill={c[sh.f]} stroke={sh.sw ? c.gold : undefined} strokeWidth={sh.sw} />
        );
      })}
    </svg>
  );
}
