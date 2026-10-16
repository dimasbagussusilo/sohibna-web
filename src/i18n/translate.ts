import type { Translation } from './types'

// Shared translator internals — used by I18nContext (the app's persisted
// language) and the landing's route-scoped override (LandingI18n), which
// rebuilds `t` per landing language without touching the persisted choice.

// Walk a dotted path to a string leaf. Returns '' if the path doesn't resolve
// to a string (shouldn't happen for typed keys, but keeps runtime safe).
export function resolvePath(dict: Translation, key: string): string {
  const parts = key.split('.')
  let cur: unknown = dict
  for (const p of parts) {
    if (cur && typeof cur === 'object' && p in cur) {
      cur = (cur as Record<string, unknown>)[p]
    } else {
      return ''
    }
  }
  return typeof cur === 'string' ? cur : ''
}

// Replace `{{token}}` placeholders with vars; unknown tokens stay literal.
export function interpolate(
  raw: string,
  vars?: Record<string, string | number>,
): string {
  if (!vars || !raw) return raw
  return raw.replace(/\{\{(\w+)\}\}/g, (_, k) =>
    vars[k] !== undefined ? String(vars[k]) : `{{${k}}}`,
  )
}
