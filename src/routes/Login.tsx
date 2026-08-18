import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '@/context/AuthContext'
import { useI18n } from '@/context/I18nContext'
import { GoogleSignInButton } from '@/components/GoogleSignInButton'

// Login / Register (web port of the RN screens, same shape + keys).
export function Login() {
  const { t } = useI18n()
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await login(email.trim(), password)
      navigate('/home', { replace: true })
    } catch {
      setError(t('auth.login.couldNotLogin'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-cream px-4 dark:bg-night">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <div className="quran-rtl mb-2 text-4xl">صحبنا</div>
          <h1 className="text-xl font-bold text-ink dark:text-cream">
            {t('auth.login.welcomeBack')}
          </h1>
          <p className="mt-1 text-xs text-ink/50 dark:text-cream/50">{t('auth.login.sub')}</p>
        </div>

        <form
          onSubmit={submit}
          className="space-y-3 rounded-3xl bg-white p-5 shadow-sm dark:bg-[#122A1F]"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('auth.login.email')}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-ink outline-none focus:border-[#8FBC8F] dark:border-white/10 dark:bg-[#0D1F17] dark:text-cream"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('auth.login.password')}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-ink outline-none focus:border-[#8FBC8F] dark:border-white/10 dark:bg-[#0D1F17] dark:text-cream"
          />
          {error ? <p className="text-center text-xs text-red-500">{error}</p> : null}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-[#8FBC8F] py-3 text-sm font-bold text-white disabled:opacity-50"
          >
            {busy ? t('auth.login.loggingIn') : t('auth.login.login')}
          </button>

          <div className="flex items-center gap-3 py-1">
            <div className="h-px flex-1 bg-gray-200 dark:bg-white/10" />
            <span className="text-[10px] uppercase tracking-widest text-ink/40 dark:text-cream/40">
              {t('auth.or')}
            </span>
            <div className="h-px flex-1 bg-gray-200 dark:bg-white/10" />
          </div>

          <GoogleSignInButton
            onDone={() => navigate('/home', { replace: true })}
          />
        </form>

        <p className="mt-4 text-center text-xs text-ink/50 dark:text-cream/50">
          {t('auth.login.noAccount')}{' '}
          <Link to="/register" className="font-bold text-[#8FBC8F]">
            {t('auth.login.register')}
          </Link>
        </p>
        <p className="mt-2 text-center">
          <Link to="/home" className="text-xs text-ink/40 underline dark:text-cream/40">
            {t('settings.guestDesc')}
          </Link>
        </p>
      </div>
    </div>
  )
}

export function Register() {
  const { t } = useI18n()
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await register(name.trim(), email.trim(), password)
      navigate('/home', { replace: true })
    } catch {
      setError(t('auth.register.couldNotRegister'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-cream px-4 dark:bg-night">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <div className="quran-rtl mb-2 text-4xl">صحبنا</div>
          <h1 className="text-xl font-bold text-ink dark:text-cream">
            {t('auth.register.createAccount')}
          </h1>
          <p className="mt-1 text-xs text-ink/50 dark:text-cream/50">{t('auth.register.sub')}</p>
        </div>

        <form
          onSubmit={submit}
          className="space-y-3 rounded-3xl bg-white p-5 shadow-sm dark:bg-[#122A1F]"
        >
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('auth.register.name')}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-ink outline-none focus:border-[#8FBC8F] dark:border-white/10 dark:bg-[#0D1F17] dark:text-cream"
          />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('auth.register.email')}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-ink outline-none focus:border-[#8FBC8F] dark:border-white/10 dark:bg-[#0D1F17] dark:text-cream"
          />
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('auth.register.passwordMin')}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-ink outline-none focus:border-[#8FBC8F] dark:border-white/10 dark:bg-[#0D1F17] dark:text-cream"
          />
          {error ? <p className="text-center text-xs text-red-500">{error}</p> : null}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-[#8FBC8F] py-3 text-sm font-bold text-white disabled:opacity-50"
          >
            {busy ? t('auth.register.creating') : t('auth.register.register')}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-ink/50 dark:text-cream/50">
          {t('auth.register.haveAccount')}{' '}
          <Link to="/login" className="font-bold text-[#8FBC8F]">
            {t('auth.register.login')}
          </Link>
        </p>
      </div>
    </div>
  )
}
