'use client'

import { startOAuth } from '@/app/auth/actions'
import type { PortesOAuth } from '@/lib/auth-portes'

// Les portes Apple / Google, UNIQUEMENT celles qui s'ouvrent. Le composant
// reçoit l'état réel des fournisseurs (lu côté serveur à la source Supabase)
// et ne rend rien quand aucun n'est activé : pas de bouton mort en tête
// d'écran. Partagé entre l'inscription (/bienvenue, monde `onb`) et la
// connexion (/login, monde de l'app) — c'est la même action, seule la
// destination de retour change.
export default function BoutonsOAuth({
  portes,
  next,
  retour,
  monde = 'app',
  className,
}: {
  portes: PortesOAuth
  /** Chemin interne où /auth/callback envoie l'élève une fois connecté. */
  next: string
  /** Chemin interne où revenir (avec message) si le fournisseur ne démarre pas. */
  retour: string
  monde?: 'onb' | 'app'
  className?: string
}) {
  if (!portes.apple && !portes.google) return null

  const onb = monde === 'onb'
  const appleStyle = onb
    ? { background: 'var(--onb-ink)', color: '#fff', borderColor: 'var(--onb-ink)' }
    : undefined
  const googleStyle = onb
    ? { background: '#fff', color: 'var(--onb-ink)', borderColor: 'var(--onb-line)' }
    : undefined

  return (
    <div className={className ?? 'flex flex-col gap-[11px]'}>
      {portes.apple ? (
        <form action={startOAuth.bind(null, 'apple', next, retour)}>
          <BoutonFournisseur
            style={appleStyle}
            className={onb ? undefined : 'bg-foreground text-background border-foreground'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M16 13c0-3 2-3.5 2-3.5-1-1.5-2.7-1.6-3.3-1.6-1.4-.1-2.7.8-3.4.8s-1.8-.8-3-.8A4.4 4.4 0 0 0 4.6 10c-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.3 3 2.3s1.6-.8 3-.8 1.8.8 3 .8 2.1-1.1 2.9-2.2c.6-.9.9-1.4 1.3-2.4-3.2-1.2-3.2-4.9-.2-5.8zM14.5 5.5A4 4 0 0 0 15.4 2 4.2 4.2 0 0 0 12.7 3.5 3.8 3.8 0 0 0 11.8 6.8 3.5 3.5 0 0 0 14.5 5.5z" />
            </svg>
            <span className="ml-2">Continuer avec Apple</span>
          </BoutonFournisseur>
        </form>
      ) : null}

      {portes.google ? (
        <form action={startOAuth.bind(null, 'google', next, retour)}>
          <BoutonFournisseur
            style={googleStyle}
            className={onb ? undefined : 'bg-card text-foreground border-border'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
              <path fill="#4285F4" d="M21.6 12.2c0-.6 0-1.2-.2-1.8H12v3.5h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.2z" />
              <path fill="#34A853" d="M12 22c2.7 0 5-1 6.6-2.6l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.7-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22z" />
              <path fill="#FBBC05" d="M6.4 13.8a6 6 0 0 1 0-3.6V7.6H3.1a10 10 0 0 0 0 8.8z" />
              <path fill="#EA4335" d="M12 6.3c1.5 0 2.8.5 3.8 1.5l2.8-2.8A10 10 0 0 0 3.1 7.6l3.3 2.6C7.2 8 9.4 6.3 12 6.3z" />
            </svg>
            <span className="ml-2">Continuer avec Google</span>
          </BoutonFournisseur>
        </form>
      ) : null}
    </div>
  )
}

// Un VRAI <button type="submit"> dans le <form action> : un span dans un form
// n'a pas de submit, et le tap ne lançait rien.
function BoutonFournisseur({
  style,
  className,
  children,
}: {
  style?: React.CSSProperties
  className?: string
  children: React.ReactNode
}) {
  return (
    <button
      type="submit"
      className={`flex min-h-[48px] w-full cursor-pointer items-center justify-center rounded-2xl border-2 p-[13px_15px] text-[15px] font-extrabold ${className ?? ''}`}
      style={style}
    >
      {children}
    </button>
  )
}
