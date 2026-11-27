// Money + percent formatting for the Partner Program (0046) — the first money
// the web shows. Whole rupiah under a literal "Rp" (not Intl's currency
// style, whose symbol and spacing vary between ICU builds); only the digit
// grouping and the decimal sign follow the reader's language. Arabic and
// Urdu get Western digits and English grouping — the same figures the Play
// price sheet shows them, so nothing here switches numeral systems under
// the reader.

import type { Lang } from '@/i18n/types'

const LOCALES: Record<Lang, string> = {
  id: 'id-ID',
  tr: 'tr-TR',
  en: 'en-US',
  ar: 'en-US',
  ur: 'en-US',
}

const cache = new Map<string, Intl.NumberFormat>()

function formatter(locale: string, maximumFractionDigits: number): Intl.NumberFormat {
  const key = `${locale}|${maximumFractionDigits}`
  let f = cache.get(key)
  if (!f) {
    f = new Intl.NumberFormat(locale, { maximumFractionDigits })
    cache.set(key, f)
  }
  return f
}

// formatRupiah: -5000 → "Rp −5.000" (id) / "Rp −5,000" (en). Fractions are
// dropped — the ledger is whole rupiah and a float here is a display artifact.
export function formatRupiah(idr: number, lang: Lang = 'id'): string {
  if (!Number.isFinite(idr) || idr === 0) return 'Rp 0'
  const sign = idr < 0 ? '−' : ''
  return `Rp ${sign}${formatter(LOCALES[lang], 0).format(Math.trunc(Math.abs(idr)))}`
}

// formatBps: 3000 → "30%", 2755 → "27,55%" (id) / "27.55%" (en). The server
// speaks basis points; a rate with a fraction of a percent must not be
// rounded away (2755 used to print as "27.6%", a different rate).
export function formatBps(bps: number, lang: Lang = 'id'): string {
  if (!Number.isFinite(bps)) return '0%'
  return `${formatter(LOCALES[lang], 2).format(bps / 100)}%`
}

// formatDay: an ISO stamp → "27 Nov 2026" (id) / "Nov 27, 2026" (en). An
// unreadable stamp is shown as given rather than as "Invalid Date".
export function formatDay(iso: string, lang: Lang = 'id'): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return new Intl.DateTimeFormat(LOCALES[lang], { day: 'numeric', month: 'short', year: 'numeric' }).format(d)
}
