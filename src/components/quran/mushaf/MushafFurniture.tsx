// Mushaf page furniture (web twin of sohibna/src/components/quran/mushaf/
// MushafFurniture.tsx) — the traditional page ornaments of the Madinah
// 15-line mushaf view: surah-name cartouche bands, juz/hizb/rub margin
// medallions, the sajda mark, and the framed page number. Rendered as inline
// SVG in the same geometry/colors as the app — keep the twins in lock-step.

import { toArabic, type Chapter } from '@/lib/quran'
import { BASMALA_UTHMANI, pageSide, type MushafPageModel } from '@/lib/mushafPage'
import { useI18n } from '@/context/I18nContext'

const GOLD = { light: '#B8933E', dark: '#D9BC72' }
const SOFT = { light: '#F3E9D2', dark: '#3A3323' }
const INK = { light: '#2C3E50', dark: '#E8E2D6' }

type Dark = { dark: boolean }

export function SurahHeaderCartouche({
  nameArabic,
  nameTranslated,
  width,
  height,
  dark,
}: Dark & { nameArabic: string; nameTranslated?: string; width: number; height: number }) {
  const gold = GOLD[dark ? 'dark' : 'light']
  const soft = SOFT[dark ? 'dark' : 'light']
  const ink = INK[dark ? 'dark' : 'light']
  const bandH = Math.min(height, 34)
  const y = (height - bandH) / 2
  const inset = Math.max(8, width * 0.06)
  const w = width - inset * 2
  const r = bandH / 2
  const dot = (cx: number) => (
    <>
      <circle cx={cx} cy={height / 2} r={3.4} fill={gold} />
      <circle cx={cx} cy={height / 2} r={1.4} fill={soft} />
    </>
  )
  return (
    <div className="relative flex h-full w-full items-center justify-center" aria-label={nameTranslated}>
      <svg width={width} height={height}>
        <rect x={inset} y={y} width={w} height={bandH} rx={r} fill={soft} stroke={gold} strokeWidth={1.2} />
        <rect x={inset + 3} y={y + 3} width={w - 6} height={bandH - 6} rx={r - 3} fill="none" stroke={gold} strokeWidth={0.6} opacity={0.8} />
        {dot(inset + r - 2)}
        {dot(inset + w - r + 2)}
        <text x={width / 2} y={height / 2 + 1} textAnchor="middle" dominantBaseline="central" fontSize={bandH * 0.5} fontFamily="Tajawal, sans-serif" fontWeight={700} fill={ink}>
          {`سورة ${nameArabic}`}
        </text>
      </svg>
    </div>
  )
}

export function MarginMark({ kind, n, dark, size }: Dark & { kind: 'juz' | 'hizb' | 'rub' | 'sajda'; n: number; size?: number }) {
  const gold = GOLD[dark ? 'dark' : 'light']
  const soft = SOFT[dark ? 'dark' : 'light']
  const s = size ?? (kind === 'juz' ? 30 : kind === 'hizb' ? 20 : 14)
  if (kind === 'sajda') {
    return (
      <span aria-label="sajdah" className="flex items-center justify-center" style={{ width: s, height: s, fontSize: s * 0.9, color: '#16A34A', lineHeight: s }}>
        ۩
      </span>
    )
  }
  const c = s / 2
  return (
    <span
      aria-label={kind === 'juz' ? `juz ${n}` : kind === 'hizb' ? `hizb ${n}` : `rub ${n}`}
      className="flex items-center justify-center"
      style={{ width: s, height: s }}
    >
      <svg width={s} height={s}>
        {kind === 'rub' ? (
          <rect x={c - 4} y={c - 4} width={8} height={8} fill={soft} stroke={gold} strokeWidth={1} transform={`rotate(45 ${c} ${c})`} />
        ) : (
          <>
            <circle cx={c} cy={c} r={c - 1} fill={soft} stroke={gold} strokeWidth={1} />
            {kind === 'juz' ? <circle cx={c} cy={c} r={c - 4} fill="none" stroke={gold} strokeWidth={0.5} opacity={0.7} /> : null}
            <text x={c} y={c + 1} textAnchor="middle" dominantBaseline="central" fontSize={s * 0.42} fontFamily="Tajawal, sans-serif" fontWeight={700} fill={gold}>
              {toArabic(n)}
            </text>
          </>
        )}
      </svg>
    </span>
  )
}

/**
 * Framed page number, bottom-center like the print mushaf's folio number, with
 * the page's side of the open spread ("Halaman kiri/kanan") — a mushaf is
 * bound on the right, so ODD pages are the LEFT page of a spread and EVEN
 * pages the RIGHT one (lib/mushafPage pageSide).
 */
export function PageNumberFrame({ page, dark }: Dark & { page: number }) {
  const { t } = useI18n()
  const gold = GOLD[dark ? 'dark' : 'light']
  const soft = SOFT[dark ? 'dark' : 'light']
  const ink = INK[dark ? 'dark' : 'light']
  return (
    <div className="flex items-center" style={{ gap: 8 }}>
      <svg width={54} height={22}>
        <rect x={1} y={1} width={52} height={20} rx={10} fill={soft} stroke={gold} strokeWidth={0.8} />
        <text x={27} y={12} textAnchor="middle" dominantBaseline="central" fontSize={12} fontFamily="Tajawal, sans-serif" fontWeight={700} fill={ink}>
          {toArabic(page)}
        </text>
      </svg>
      <span style={{ fontSize: 10, lineHeight: '14px', color: gold }}>
        {t(pageSide(page) === 'left' ? 'reader.pageSideLeft' : 'reader.pageSideRight')}
      </span>
    </div>
  )
}

/**
 * The whole furniture layer (shared positioning with the app twin): absolute
 * overlay, pointer-events none so text spans stay selectable.
 */
export function MushafFurnitureLayer({
  model,
  rowH,
  padTop,
  hPad,
  width,
  dark,
  chapters,
}: {
  model: MushafPageModel
  rowH: number
  padTop: number
  hPad: number
  width: number
  dark: boolean
  chapters: Record<number, Chapter>
}) {
  const ink = INK[dark ? 'dark' : 'light']
  return (
    <div className="pointer-events-none absolute inset-0" style={{ top: padTop }}>
      {model.rows.map((row) => {
        if (row.type === 'surah') {
          const ch = row.surah ? chapters[row.surah] : undefined
          return (
            <div key={row.line} className="absolute" style={{ top: (row.line - 1) * rowH, left: hPad, right: hPad, height: rowH }}>
              <SurahHeaderCartouche
                nameArabic={ch?.name_arabic ?? ''}
                nameTranslated={ch?.translated_name?.name}
                width={width - hPad * 2}
                height={rowH}
                dark={dark}
              />
            </div>
          )
        }
        if (row.type === 'basmala') {
          return (
            <div key={row.line} className="absolute flex items-center justify-center" style={{ top: (row.line - 1) * rowH, left: hPad, right: hPad, height: rowH }}>
              <span className="quran-rtl" style={{ fontFamily: "'Scheherazade New', serif", fontSize: rowH * 0.66, color: ink, lineHeight: 1.4 }}>
                {BASMALA_UTHMANI}
              </span>
            </div>
          )
        }
        return null
      })}

      {model.marks.map((m, i) => (
        <div key={`${m.kind}-${m.n}-${i}`} className="absolute" style={{ right: 1, top: (m.line - 1) * rowH }}>
          <MarginMark kind={m.kind} n={m.n} dark={dark} size={Math.min(rowH * 0.8, m.kind === 'juz' ? 30 : 20)} />
        </div>
      ))}

      <div className="absolute left-0 right-0 flex justify-center" style={{ bottom: -4 }}>
        <PageNumberFrame page={model.page} dark={dark} />
      </div>
    </div>
  )
}
