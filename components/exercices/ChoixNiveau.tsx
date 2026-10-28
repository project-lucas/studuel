'use client'

import { Check, Lock, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

export type OptionNiveau<T extends number> = {
  valeur: T
  /** La difficulté, en étoiles (★ / ★★ / ★★★). */
  etoiles: 1 | 2 | 3
  libelle: string
  /** L'état de ce niveau dans le cahier ; absent pour le contrôle blanc. */
  etat?: 'reussi' | 'ouvert' | 'verrouille'
}

/**
 * LE CHOIX DU NIVEAU — trois pastilles, une seule allumée, LES ÉTOILES pour
 * dire la difficulté (26/10/2026, Lucas : « rajoute les étoiles pour appuyer
 * le côté difficulté, à la place des ronds »). Le même gabarit sert au cahier
 * d'exercices (★ Facile · ★★ Moyen · ★★★ Difficile, « comme lorsque l'on
 * présente le contrôle blanc, c'est plus clair ») et au contrôle blanc.
 *
 * Le violet est celui de l'action (choisir), pas une récompense ; les étoiles
 * pleines sont en jaune solaire, comme toute difficulté dans le manuel. Un
 * groupe de boutons radio pour le lecteur d'écran : « Niveau, Moyen, deux
 * étoiles, verrouillé ».
 */
export default function ChoixNiveau<T extends number>({
  options,
  valeur,
  onChoisir,
  label = 'Niveau',
}: {
  options: readonly OptionNiveau<T>[]
  valeur: T
  onChoisir: (v: T) => void
  label?: string
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="grid gap-1 rounded-full bg-muted p-1"
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      {options.map((o) => {
        const actif = o.valeur === valeur
        const verrou = o.etat === 'verrouille'
        const reussi = o.etat === 'reussi'
        const etatLisible = verrou ? ', verrouillé' : reussi ? ', réussi' : ''
        return (
          <button
            key={o.valeur}
            type="button"
            role="radio"
            aria-checked={actif}
            aria-label={`${o.libelle}, ${o.etoiles} étoile${o.etoiles > 1 ? 's' : ''}${etatLisible}`}
            onClick={() => onChoisir(o.valeur)}
            className={cn(
              'font-heading flex min-h-11 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-full px-1 text-[13px] leading-none font-extrabold transition',
              actif
                ? 'bg-primary text-primary-foreground shadow-sm'
                : verrou
                  ? 'text-muted-foreground/70 hover:text-foreground'
                  : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <span aria-hidden="true" className="flex items-center gap-px">
              {[1, 2, 3].map((n) => (
                <Star
                  key={n}
                  className={cn(
                    'size-3',
                    n <= o.etoiles
                      ? 'fill-highlight text-highlight'
                      : actif
                        ? 'fill-white/25 text-white/25'
                        : 'fill-foreground/15 text-foreground/15',
                  )}
                  strokeWidth={0}
                />
              ))}
            </span>
            <span aria-hidden="true" className="flex items-center gap-1">
              {o.libelle}
              {verrou ? (
                <Lock className="size-3 opacity-80" strokeWidth={2.8} />
              ) : reussi ? (
                <Check className={cn('size-3', actif ? 'text-white' : 'text-success')} strokeWidth={3.5} />
              ) : null}
            </span>
          </button>
        )
      })}
    </div>
  )
}
