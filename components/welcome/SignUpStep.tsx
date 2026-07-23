'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import type { OnboardingAnswers } from '@/lib/welcome'
import { signUpWelcome, startOAuth } from '@/app/bienvenue/actions'
import PencilLogo from './PencilLogo'

// Écran 13 — Créer un compte. Trois portes : Apple, Google (OAuth réel), e-mail.
// Sur session ouverte → on enchaîne sur le plan (14). Sur confirmation d'email
// requise → message d'attente (pas de session immédiate).
export default function SignUpStep({
  answers,
  onSignedUp,
  initialError = null,
}: {
  answers: OnboardingAnswers
  onSignedUp: () => void
  /** Erreur venue de la redirection (échec du lancement OAuth), à afficher
   *  d'entrée : sans elle, l'élève revenait sur un écran muet. */
  initialError?: string | null
}) {
  const [showEmail, setShowEmail] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(initialError)
  const [message, setMessage] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function submitEmail(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setMessage(null)
    startTransition(async () => {
      const res = await signUpWelcome({ fullName, email, password, answers })
      if (res.status === 'session') onSignedUp()
      else if (res.status === 'confirm') setMessage(res.message)
      else setError(res.error)
    })
  }

  return (
    <div className="flex flex-1 flex-col pt-2 text-center">
      <PencilLogo size={78} className="mx-auto" />
      <h1 className="onb-title mt-1 text-[23px] leading-[1.18]">
        Sauvegarde ta progression
      </h1>
      <p
        className="mt-1.5 text-[14px] leading-[1.45] font-semibold"
        style={{ color: 'var(--onb-mut)' }}
      >
        Crée ton compte pour garder ta série, tes XP et retrouver tes duels
        partout.
      </p>

      <div className="mt-4 flex flex-col gap-[11px] text-left">
        {/* Apple / Google : OAuth réel via Server Action (redirection). */}
        <form action={startOAuth.bind(null, 'apple')}>
          <ProviderButton
            type="submit"
            bg="var(--onb-ink)"
            color="#fff"
            border="var(--onb-ink)"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff" aria-hidden>
              <path d="M16 13c0-3 2-3.5 2-3.5-1-1.5-2.7-1.6-3.3-1.6-1.4-.1-2.7.8-3.4.8s-1.8-.8-3-.8A4.4 4.4 0 0 0 4.6 10c-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.3 3 2.3s1.6-.8 3-.8 1.8.8 3 .8 2.1-1.1 2.9-2.2c.6-.9.9-1.4 1.3-2.4-3.2-1.2-3.2-4.9-.2-5.8zM14.5 5.5A4 4 0 0 0 15.4 2 4.2 4.2 0 0 0 12.7 3.5 3.8 3.8 0 0 0 11.8 6.8 3.5 3.5 0 0 0 14.5 5.5z" />
            </svg>
            <span className="ml-2">Continuer avec Apple</span>
          </ProviderButton>
        </form>

        <form action={startOAuth.bind(null, 'google')}>
          <ProviderButton
            type="submit"
            bg="#fff"
            color="var(--onb-ink)"
            border="var(--onb-line)"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
              <path fill="#4285F4" d="M21.6 12.2c0-.6 0-1.2-.2-1.8H12v3.5h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.2z" />
              <path fill="#34A853" d="M12 22c2.7 0 5-1 6.6-2.6l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.7-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22z" />
              <path fill="#FBBC05" d="M6.4 13.8a6 6 0 0 1 0-3.6V7.6H3.1a10 10 0 0 0 0 8.8z" />
              <path fill="#EA4335" d="M12 6.3c1.5 0 2.8.5 3.8 1.5l2.8-2.8A10 10 0 0 0 3.1 7.6l3.3 2.6C7.2 8 9.4 6.3 12 6.3z" />
            </svg>
            <span className="ml-2">Continuer avec Google</span>
          </ProviderButton>
        </form>

        {showEmail ? (
          <form onSubmit={submitEmail} className="flex flex-col gap-2.5">
            <OnbField
              placeholder="Prénom et nom"
              autoComplete="name"
              value={fullName}
              onChange={setFullName}
            />
            <OnbField
              type="email"
              placeholder="eleve@exemple.fr"
              autoComplete="email"
              required
              value={email}
              onChange={setEmail}
            />
            <div className="relative">
              <OnbField
                type={showPassword ? 'text' : 'password'}
                placeholder="Mot de passe (6 caractères min.)"
                autoComplete="new-password"
                required
                minLength={6}
                value={password}
                onChange={setPassword}
                className="pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                className="absolute inset-y-0 right-0 flex w-11 items-center justify-center"
                style={{ color: 'var(--onb-mut)' }}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            <button
              type="submit"
              disabled={pending}
              className="onb-btn"
            >
              {pending ? 'Un instant…' : 'Créer mon compte'}
            </button>
          </form>
        ) : (
          <ProviderButton
            onClick={() => setShowEmail(true)}
            bg="var(--onb-pp)"
            color="#fff"
            border="var(--onb-pp)"
          >
            <span>Continuer avec un e-mail</span>
          </ProviderButton>
        )}
      </div>

      <div aria-live="polite" className="mt-3 empty:hidden">
        {error ? (
          <p role="alert" className="text-[13px] font-bold" style={{ color: 'var(--onb-co)' }}>
            {error}
          </p>
        ) : null}
        {message ? (
          <p className="text-[13px] font-bold" style={{ color: '#2AA36B' }}>
            {message}
          </p>
        ) : null}
      </div>

      <p className="mt-3.5 text-[13px] font-bold" style={{ color: 'var(--onb-mut)' }}>
        En continuant, tu acceptes les CGU et la politique de confidentialité.
      </p>
      <p className="mt-2 text-[13px] font-semibold" style={{ color: 'var(--onb-mut)' }}>
        Déjà inscrit ?{' '}
        <Link href="/login" className="font-extrabold underline" style={{ color: 'var(--onb-pp)' }}>
          Se connecter
        </Link>
      </p>
    </div>
  )
}

// Bouton fournisseur (Apple/Google/e-mail) : rangée pleine largeur centrée.
// Un VRAI <button> — en `type="submit"` dans les <form action> OAuth, sinon
// le tap ne soumettait rien (un span dans un form n'a pas de submit).
function ProviderButton({
  bg,
  color,
  border,
  type = 'button',
  onClick,
  children,
}: {
  bg: string
  color: string
  border: string
  type?: 'button' | 'submit'
  onClick?: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="flex w-full cursor-pointer items-center justify-center rounded-2xl border-2 p-[13px_15px] text-[15px] font-extrabold"
      style={{ background: bg, color, borderColor: border }}
    >
      {children}
    </button>
  )
}

function OnbField({
  value,
  onChange,
  className,
  ...props
}: Omit<React.ComponentProps<'input'>, 'onChange'> & {
  onChange: (v: string) => void
}) {
  return (
    <input
      {...props}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full rounded-2xl border-2 bg-white px-4 py-3 text-[15px] font-semibold outline-none ${className ?? ''}`}
      style={{ borderColor: 'var(--onb-line)' }}
    />
  )
}
