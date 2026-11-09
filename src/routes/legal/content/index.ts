import type { Lang } from '@/i18n/types'
import { content as id } from './id'
import { content as en } from './en'
import { content as ar } from './ar'
import { content as tr } from './tr'
import { content as ur } from './ur'

// Legal pages (Privacy Policy / Terms of Service) — long-form per-language
// content kept OUT of the app dictionaries (they would bloat translations/*).
// Loaded only by the lazy /privacy & /terms routes. id + en are the
// authoritative texts; ar/tr/ur mirror them section-for-section. The `anchor`
// field carries a stable element id (#delete) that external policies
// (Google Play account-declaration form) link to.

export type LegalSection = { h: string; p: readonly string[]; anchor?: 'delete' }

export type LegalDoc = {
  title: string
  metaDescription: string
  updatedLabel: string
  updated: string
  backHome: string
  sections: readonly LegalSection[]
}

export type LegalContent = { privacy: LegalDoc; terms: LegalDoc }

export type LegalDocKey = keyof LegalContent

export const LEGAL: Record<Lang, LegalContent> = { id, en, ar, tr, ur }
