import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { useAuth } from '@/context/AuthContext'
import { useI18n } from '@/context/I18nContext'
import {
  forgotPassword,
  resendVerification,
  resetPassword,
  verifyEmail,
} from '@/api'
import type { ReactNode } from 'react'

// Email verification + password recovery, OTP flavour (web port of the RN
// screens, same i18n keys). The emailed 6-digit code is the credential — no
// deep links, so every page is a plain form: /verify-code (post-register,
// runs inside the new session), /forgot-password, /reset-password.

// Shell matching Login/Register: centred card on the cream canvas.
function RecoveryShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-cream px-4 dark:bg-night lg:ps-20">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <div className="quran-rtl mb-2 text-4xl">صحبنا</div>
        </div>
        {children}
      </div>
    </div>
  )
}

// The input for the 6-digit code, shared by verify + reset.
function CodeInput({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  return (
    <input
      type="text"
      inputMode="numeric"
      autoComplete="one-time-code"
      required
      pattern="[0-9]{6}"
      maxLength={6}
      value={value}
      onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
      placeholder={placeholder}
      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-center text-xl font-bold tracking-[0.5em] text-ink outline-none focus:border-[#8FBC8F] dark:border-white/10 dark:bg-[#0D1F17] dark:text-cream"
    />
  )
}

// VerifyCode: post-register OTP entry (authed — the register session is live).
// Reached with ?email=…; also the Me-banner target for users who skipped.
export function VerifyCode() {
  const { t } = useI18n()
  const { updateUser } = useAuth()
  const [params] = useSearchParams()
  const email = params.get('email') ?? ''

  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [cooldown, setCooldown] = useState(60)
  const [note, setNote] = useState<string | null>(null)

  // The register email just went out — start the resend countdown at full.
  useEffect(() => {
    if (cooldown <= 0) return
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(id)
  }, [cooldown])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      const r = await verifyEmail(code)
      updateUser(r.user)
      setDone(true)
    } catch {
      setError(t('auth.checkEmail.invalidCode'))
    } finally {
      setBusy(false)
    }
  }

  const resend = async () => {
    if (cooldown > 0) return
    setNote(null)
    try {
      await resendVerification()
      setCooldown(60)
      setNote(t('auth.checkEmail.resent'))
    } catch {
      setCooldown(60) // server cooldown won the race — same wait
      setNote(t('auth.checkEmail.resendSoon'))
    }
  }

  if (done) {
    return (
      <RecoveryShell>
        <div className="rounded-3xl bg-white p-5 text-center shadow-sm dark:bg-[#122A1F]">
          <h1 className="text-lg font-bold text-ink dark:text-cream">
            {t('auth.checkEmail.successTitle')}
          </h1>
          <p className="mt-1 text-xs text-ink/50 dark:text-cream/50">
            {t('auth.checkEmail.successSub')}
          </p>
          <Link
            to="/home"
            className="mt-4 block w-full rounded-xl bg-[#8FBC8F] py-3 text-sm font-bold text-white"
          >
            {t('auth.checkEmail.backToApp')}
          </Link>
        </div>
      </RecoveryShell>
    )
  }

  return (
    <RecoveryShell>
      <form
        onSubmit={submit}
        className="space-y-3 rounded-3xl bg-white p-5 shadow-sm dark:bg-[#122A1F]"
      >
        <h1 className="text-center text-lg font-bold text-ink dark:text-cream">
          {t('auth.checkEmail.title')}
        </h1>
        <p className="text-center text-xs text-ink/50 dark:text-cream/50">
          {t('auth.checkEmail.sub', { email })}
        </p>
        <CodeInput value={code} onChange={setCode} placeholder={t('auth.checkEmail.codeLabel')} />
        {error ? <p className="text-center text-xs text-red-500">{error}</p> : null}
        <button
          type="submit"
          disabled={busy || code.length !== 6}
          className="w-full rounded-xl bg-[#8FBC8F] py-3 text-sm font-bold text-white disabled:opacity-50"
        >
          {busy ? t('auth.checkEmail.verifying') : t('auth.checkEmail.submit')}
        </button>
        <div className="text-center">
          <button
            type="button"
            onClick={resend}
            disabled={cooldown > 0}
            className="text-xs font-bold text-[#8FBC8F] disabled:opacity-60"
          >
            {cooldown > 0
              ? `${t('auth.checkEmail.resend')} (${cooldown}s)`
              : t('auth.checkEmail.resend')}
          </button>
        </div>
        {note ? (
          <p className="text-center text-xs text-[#8FBC8F]">{note}</p>
        ) : (
          <p className="text-center text-xs text-ink/40 dark:text-cream/40">
            {t('auth.checkEmail.note')}
          </p>
        )}
        <p className="text-center">
          <Link to="/home" className="text-xs text-ink/50 underline dark:text-cream/50">
            {t('auth.checkEmail.continue')}
          </Link>
        </p>
      </form>
    </RecoveryShell>
  )
}

export function ForgotPassword() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    const trimmed = email.trim()
    try {
      // Always succeeds — the API is deliberately indistinguishable for
      // unknown/unverified addresses. Straight into the OTP entry form.
      await forgotPassword(trimmed)
    } catch {
      /* transport error only; the reset form has its own resend */
    } finally {
      setBusy(false)
      navigate(`/reset-password?email=${encodeURIComponent(trimmed)}`, { replace: true })
    }
  }

  return (
    <RecoveryShell>
      <form
        onSubmit={submit}
        className="space-y-3 rounded-3xl bg-white p-5 shadow-sm dark:bg-[#122A1F]"
      >
          <h1 className="text-center text-lg font-bold text-ink dark:text-cream">
            {t('auth.forgot.title')}
          </h1>
          <p className="text-center text-xs text-ink/50 dark:text-cream/50">
            {t('auth.forgot.sub')}
          </p>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('auth.forgot.email')}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-ink outline-none focus:border-[#8FBC8F] dark:border-white/10 dark:bg-[#0D1F17] dark:text-cream"
          />
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-[#8FBC8F] py-3 text-sm font-bold text-white disabled:opacity-50"
          >
            {busy ? t('auth.forgot.sending') : t('auth.forgot.submit')}
          </button>
          <p className="text-center">
            <Link to="/login" className="text-xs text-ink/50 underline dark:text-cream/50">
              {t('auth.forgot.backToLogin')}
            </Link>
          </p>
        </form>
    </RecoveryShell>
  )
}

// ResetPassword: email + emailed code + new password (no session — the code is
// the credential). Reached from ForgotPassword with ?email= prefilled; on
// success every session was revoked server-side.
export function ResetPassword() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const fromForgot = params.get('email') !== null

  const [email, setEmail] = useState(params.get('email') ?? '')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [cooldown, setCooldown] = useState(fromForgot ? 60 : 0)

  // Arriving from forgot-password = a code was just sent; count down before
  // offering the resend (server enforces 60s too, silently).
  useEffect(() => {
    if (cooldown <= 0) return
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(id)
  }, [cooldown])

  const resend = async () => {
    if (cooldown > 0) return
    try {
      await forgotPassword(email.trim())
    } catch {
      /* always-204 endpoint; a transport error still re-arms the cooldown */
    } finally {
      setCooldown(60)
    }
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await resetPassword(email.trim(), code, password)
      setDone(true)
    } catch {
      // One localized message — never the raw server text.
      setError(t('auth.reset.invalid'))
    } finally {
      setBusy(false)
    }
  }

  if (done) {
    const goLogin = () => navigate('/login', { replace: true })
    return (
      <RecoveryShell>
        <div className="rounded-3xl bg-white p-5 text-center shadow-sm dark:bg-[#122A1F]">
          <p className="py-2 text-sm text-ink/70 dark:text-cream/70">{t('auth.reset.success')}</p>
          <button
            onClick={goLogin}
            className="mt-2 w-full rounded-xl bg-[#8FBC8F] py-3 text-sm font-bold text-white"
          >
            {t('auth.reset.backToLogin')}
          </button>
        </div>
      </RecoveryShell>
    )
  }

  return (
    <RecoveryShell>
      <form
        onSubmit={submit}
        className="space-y-3 rounded-3xl bg-white p-5 shadow-sm dark:bg-[#122A1F]"
      >
        <h1 className="text-center text-lg font-bold text-ink dark:text-cream">
          {t('auth.reset.title')}
        </h1>
        <p className="text-center text-xs text-ink/50 dark:text-cream/50">{t('auth.reset.sub')}</p>
        {fromForgot ? (
          <p className="rounded-xl bg-[#8FBC8F]/10 px-3 py-2 text-center text-xs text-[#6FA06F] dark:bg-[#8FBC8F]/15">
            {t('auth.forgot.sent')} — {t('auth.forgot.sentSub')}
          </p>
        ) : null}
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          readOnly={fromForgot}
          placeholder={t('auth.reset.email')}
          className={`w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-ink outline-none focus:border-[#8FBC8F] dark:border-white/10 dark:bg-[#0D1F17] dark:text-cream ${fromForgot ? 'opacity-60' : ''}`}
        />
        <CodeInput value={code} onChange={setCode} placeholder={t('auth.reset.code')} />
        <input
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('auth.reset.password')}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-ink outline-none focus:border-[#8FBC8F] dark:border-white/10 dark:bg-[#0D1F17] dark:text-cream"
        />
        {error ? <p className="text-center text-xs text-red-500">{error}</p> : null}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-xl bg-[#8FBC8F] py-3 text-sm font-bold text-white disabled:opacity-50"
        >
          {busy ? t('auth.reset.saving') : t('auth.reset.submit')}
        </button>
        <div className="text-center">
          <button
            type="button"
            onClick={resend}
            disabled={cooldown > 0}
            className="text-xs font-bold text-[#8FBC8F] disabled:opacity-60"
          >
            {cooldown > 0
              ? `${t('auth.checkEmail.resend')} (${cooldown}s)`
              : t('auth.checkEmail.resend')}
          </button>
        </div>
      </form>
    </RecoveryShell>
  )
}
