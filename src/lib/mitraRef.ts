// Program Mitra referral capture (0033, Phase 1). A guest landing on
// /register?ref=CODE keeps the code in localStorage so a signup days later
// still carries it (first-touch); the click ping is deduped per browser per
// day — we deliberately store no per-click identity server-side, so honest
// client-side dedupe is the only dedupe there is.

import { pingPartnerClick } from '@/api';

const REF_KEY = 'sohibna.mitra_ref';
const CLICK_KEY_PREFIX = 'sohibna.mitra.click.';
const CLICK_DEDUPE_MS = 24 * 60 * 60 * 1000;

// normalizeMitraRef mirrors the server: trim + uppercase, bounded length.
export function normalizeMitraRef(raw: string | null | undefined): string | null {
  const code = (raw ?? '').trim().toUpperCase().slice(0, 32);
  return code || null;
}

// captureMitraRef stores a seen ?ref= code (first-touch: an existing stored
// code is NOT overwritten — the first link that reached this browser wins,
// matching the server's UNIQUE(user_id) first-touch rule). Returns the
// normalized code (stored or previously held).
export function captureMitraRef(raw: string | null | undefined): string | null {
  const code = normalizeMitraRef(raw);
  if (!code) return getStoredMitraRef();
  if (!localStorage.getItem(REF_KEY)) localStorage.setItem(REF_KEY, code);
  return getStoredMitraRef();
}

export function getStoredMitraRef(): string | null {
  return normalizeMitraRef(localStorage.getItem(REF_KEY));
}

// consumeMitraRef reads and clears the stored code — the signup that carries
// it owns it; a later manual signup is unattributed again.
export function consumeMitraRef(): string | null {
  const code = getStoredMitraRef();
  if (code) localStorage.removeItem(REF_KEY);
  return code;
}

// pingMitraClickOnce counts this browser's landing on a referral link, at
// most once per code per 24h. Fire-and-forget: a failed ping must never
// affect the register page.
export function pingMitraClickOnce(code: string): void {
  const key = CLICK_KEY_PREFIX + code;
  const last = Number(localStorage.getItem(key) ?? 0);
  if (Date.now() - last < CLICK_DEDUPE_MS) return;
  localStorage.setItem(key, String(Date.now()));
  void pingPartnerClick(code);
}
