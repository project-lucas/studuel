'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import type { OnboardingAnswers } from '@/lib/welcome'
import { auMoinsUnePorteOAuth, type PortesOAuth } from '@/lib/auth-portes'
import { signUpWelcome } from '@/app/bienvenue/actions'
import BoutonsOAuth from '@/components/auth/BoutonsOAuth'
import PencilLogo from './PencilLogo'

// Écran 13 — Créer un compte. Jusqu'à trois portes : Apple, Google (OAuth
// réel, SEULEMENT si le fournisseur est activé côté Supabase), e-mail.
// Sur session ouverte → on enchaîne sur le plan (14). Sur confirmation d'email
// requise → message d'attente (pas de session immédiate).
export default function SignUpStep({
  answers,
  portes,
  onSignedUp,
  initialError = null,
}: {
  answers: OnboardingAnswers
  /** Les fournisseurs OAuth réellement activés. Sans aucun, l'e-mail est la
   *  seule porte : on la montre d'emblée au lieu de la cacher derrière un
   *  bouton « Continuer avec un e-mail » qui n'aurait plus rien à départager. */
  portes: PortesOAuth
  onSignedUp: () => void
  /** Erreur venue de la redirection (échec du lancement OAuth), à afficher
   *  d'entrée : sans elle, l'élève revenait sur un écran muet. */
  initialError?: string | null
}) {
  const oauthDisponible = auMoinsUnePorteOAuth(portes)
  const [showEmail, setShowEmail] = useState(!oauthDisponible)
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
        {/* Apple / Google : OAuth réel via Server Action (redirection). Au
            retour, ?finish=1 applique le brouillon local au profil. */}
        <BoutonsOAuth
          portes={portes}
          next="/bienvenue?finish=1"
          retour="/bienvenue?erreur=oauth"
          monde="onb"
          className="contents"
        />

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
          <button
            type="button"
            onClick={() => setShowEmail(true)}
            className="flex min-h-[48px] w-full cursor-pointer items-center justify-center rounded-2xl border-2 p-[13px_15px] text-[15px] font-extrabold"
            style={{
              background: 'var(--onb-pp)',
              color: '#fff',
              borderColor: 'var(--onb-pp)',
            }}
          >
            Continuer avec un e-mail
          </button>
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
