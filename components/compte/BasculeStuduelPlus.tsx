'use client'

import { useState, useTransition } from 'react'
import { BadgeCheck } from 'lucide-react'
import { basculerStuduelPlusTest } from '@/app/compte/abonnement-actions'
import { cn } from '@/lib/utils'

/**
 * L'interrupteur Studuel+ d'un compte COACH ou ADMIN (Lucas, 16/10/2026 :
 * « un bouton dans Paramètres pour que mon compte passe de Studuel classique à
 * Studuel+ librement »). Il remplace le petit bouton contour perdu dans la
 * carte du profil : une ligne de réglage, comme « Sons et vibrations », en
 * tête de la page. L'état bascule tout de suite et revient en arrière si la
 * base refuse (`basculer_studuel_plus_test`, 561).
 */
export default function BasculeStuduelPlus({ actif }: { actif: boolean }) {
  const [on, setOn] = useState(actif)
  const [erreur, setErreur] = useState<string | null>(null)
  const [enCours, startTransition] = useTransition()

  const basculer = () => {
    const avant = on
    setOn(!avant)
    setErreur(null)
    startTransition(async () => {
      const r = await basculerStuduelPlusTest()
      if (r.ok) setOn(r.studuelPlus)
      else {
        setOn(avant)
        setErreur(r.erreur)
      }
    })
  }

  return (
    <div className="mx-auto mt-4 w-full max-w-md">
      <button
        type="button"
        onClick={basculer}
        disabled={enCours}
        aria-pressed={on}
        className="carte focus-visible:ring-primary/50 flex w-full cursor-pointer items-center gap-3 p-4 text-left focus-visible:ring-2 focus-visible:outline-none disabled:cursor-wait"
      >
        <span
          className={cn(
            'flex size-9 shrink-0 items-center justify-center rounded-lg',
            on ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground',
          )}
        >
          <BadgeCheck className="size-4" strokeWidth={2.4} aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="titre-section block">Studuel+</span>
          <span className="text-muted-foreground mt-0.5 block text-sm font-semibold">
            {on
              ? 'Activé sur ton compte — tu vois l’app d’un abonné.'
              : 'Désactivé — tu vois l’app d’un élève gratuit.'}
          </span>
        </span>
        <span
          aria-hidden="true"
          className={cn(
            'flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors',
            on ? 'bg-primary' : 'bg-muted-foreground/30',
          )}
        >
          <span
            className={cn(
              'size-5 rounded-full bg-white shadow-sm transition-transform',
              on && 'translate-x-5',
            )}
          />
        </span>
      </button>
      {erreur ? (
        <p role="alert" className="text-destructive mt-2 px-2 text-sm font-semibold">
          {erreur}
        </p>
      ) : null}
    </div>
  )
}
