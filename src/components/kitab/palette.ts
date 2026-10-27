// Deterministic per-series accent color for the Kitab AI catalogue. The UI is
// text-first (no cover plates): each series keeps a stable identity via a slim
// color spine derived from its title — same hash → same color on every client,
// web and RN alike (keep fnv1a/accentColor identical to the RN twin at
// sohibna/src/components/kitab/palette.ts).

// fnv1a: 32-bit FNV-1a hash of a string.
export function fnv1a(s: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

// Deep plate palettes per category FAMILY (3 variants each).
const PALETTES: Record<string, string[]> = {
  green: ['#1E4D3B', '#2C5F45', '#16443A'], // famous, tafsir
  indigo: ['#343D63', '#2B3350', '#3E4870'], // fiqh, hadits_syarah, sistem_hukum
  maroon: ['#6B2F3A', '#7A3B2E', '#5C2833'], // sirah_sejarah, khilafah_politik
  amber: ['#7A5C2E', '#6E5326', '#8A6A38'], // fikrah_ruhiyah, dakwah_gerakan
  teal: ['#175B5B', '#0F4C4C', '#1D6363'], // pendidikan
  slate: ['#4A5259', '#3C434A', '#555E66'], // lainnya / unknown
}

const FAMILY: Record<string, string> = {
  famous: 'green',
  tafsir: 'green',
  fiqh: 'indigo',
  hadits_syarah: 'indigo',
  sistem_hukum: 'indigo',
  sirah_sejarah: 'maroon',
  khilafah_politik: 'maroon',
  fikrah_ruhiyah: 'amber',
  dakwah_gerakan: 'amber',
  pendidikan: 'teal',
  lainnya: 'slate',
}

// accentColor picks the series' stable hue from its title + shelf family.
export function accentColor(title: string, category?: string): string {
  const variants = PALETTES[FAMILY[category ?? ''] ?? 'slate'] ?? PALETTES.slate
  return variants[fnv1a(title) % 3]
}
