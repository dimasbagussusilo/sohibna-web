import { useEffect, useState } from 'react'
import { useI18n } from '@/context/I18nContext'
import type { AnnouncementDTO } from '@/api'
import { fetchAnnouncements } from '@/api'
import { pickAnnouncement, markDailyClosed, resolveContent, resolveImageUrl } from '@/lib/announcements'

// Pop-up announcement (donation invitation, news, …) rendered once in
// MainAppRoutes next to ConfirmDialog. Self-contained on purpose: it fetches
// on mount, picks at most ONE unseen announcement (frequency rules in
// src/lib/announcements.ts) and shows it. Any failure (offline, old API
// without the endpoint, empty table) is silent. The landing never mounts it.
// Only the announcement DTO is frozen in state — its content re-resolves from
// the live `lang` on every render, so a language change swaps the popup's
// language instead of leaving stale copy.

// Web has no in-app donation page — the CTA lands on the landing's Support
// section (id="dukung", src/routes/landing/Support.tsx).
const LANDING_SUPPORT_URL = 'https://sohibna.com/#dukung'

export function AnnouncementPopup() {
  const { lang, t } = useI18n()
  const [shown, setShown] = useState<AnnouncementDTO | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const list = await fetchAnnouncements()
        const picked = await pickAnnouncement(list, lang)
        if (!cancelled && picked) setShown(picked)
      } catch {
        /* offline / endpoint not deployed yet — nothing to announce */
      }
    })()
    return () => {
      cancelled = true
    }
    // lang is read for PICKING on load only (frequency bookkeeping runs once);
    // the displayed language follows the live value via resolveContent below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!shown) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShown(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [shown])

  if (!shown) return null
  const announcement = shown
  const content = resolveContent(shown, lang)
  if (!content) return null

  // Backdrop/Escape: temporary — a daily announcement returns on the next
  // page load. Only the explicit decline ("Mungkin Nanti") or tapping the
  // CTA suppresses it for the rest of the period.
  const close = () => setShown(null)
  const closeForToday = () => {
    void markDailyClosed(announcement)
    setShown(null)
  }

  const runAction = () => {
    void markDailyClosed(announcement)
    close()
    if (announcement.action === 'donate') {
      window.open(LANDING_SUPPORT_URL, '_blank', 'noopener')
    } else if (announcement.action === 'url' && announcement.action_url) {
      window.open(announcement.action_url, '_blank', 'noopener')
    }
  }

  const ctaLabel =
    content.cta ||
    (announcement.action === 'donate'
      ? t('announcement.ctaDonate')
      : t('announcement.ctaOpenLink'))

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 px-6">
      <div className="absolute inset-0" onClick={close} />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label={content.title}
        className="relative w-full max-w-sm rounded-3xl border border-black/5 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-[#122A1F]"
      >
        {announcement.image_url && (
          <img
            src={resolveImageUrl(announcement.image_url)}
            alt=""
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
            className="mb-4 aspect-video w-full rounded-2xl object-cover"
          />
        )}
        <div className="text-center text-base font-bold text-ink dark:text-cream">{content.title}</div>
        {content.body && (
          <p className="mt-2 text-center text-[13px] leading-relaxed text-ink/60 dark:text-cream/60">
            {content.body}
          </p>
        )}
        <div className="mt-6 flex gap-3">
          <button
            onClick={closeForToday}
            className="flex-1 rounded-xl bg-black/5 py-3 text-sm font-bold text-ink/70 transition-colors hover:bg-black/10 dark:bg-white/10 dark:text-cream/70 dark:hover:bg-white/15"
          >
            {t('announcement.closeForToday')}
          </button>
          {announcement.action && (
            <button
              onClick={runAction}
              className="flex-1 rounded-xl bg-[#8FBC8F] py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
            >
              {ctaLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
