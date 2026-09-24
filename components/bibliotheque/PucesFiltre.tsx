'use client'

import { sfx } from '@/lib/sounds'
import { cn } from '@/lib/utils'
import type { Puce } from '@/lib/bibliotheque'

/**
 * LE SECOND FILTRE d'un rayon : une puce par matière (Fiches) ou par thème
 * (Capsules), après « Toutes ». Il ne s'affiche qu'à partir de deux puces —
 * une seule matière n'a rien à trier. Plus petit et plus discret que le filtre
 * de tête : il précise, il ne range pas.
 *
 * La rangée défile à l'horizontale quand les matières débordent (elle part du
 * bord de l'écran, comme les étagères) : les puces gardent leur libellé
 * entier, un nom de matière tronqué ne se lit pas.
 */
export default function PucesFiltre({
  label,
  tout,
  puces,
  actif,
  onChange,
}: {
  /** Ce que la rangée filtre, pour le lecteur d'écran (« Matière »). */
  label: string
  /** Le libellé de la puce « sans filtre » (« Toutes »). */
  tout: string
  puces: readonly Puce[]
  actif: string | null
  onChange: (id: string | null) => void
}) {
  if (puces.length < 2) return null
  const choix = [{ id: null, label: tout, nombre: null }, ...puces]
  // Une puce restée choisie sur une matière disparue : « Toutes » reprend la
  // main, comme le rayon lui-même (`fichesParMatiere`, `filtrerCapsules`).
  const actifConnu = puces.some((q) => q.id === actif)
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="capsule-rayon -mx-4 flex gap-1.5 overflow-x-auto px-4 pb-0.5"
    >
      {choix.map((p) => {
        const estActif = p.id === null ? !actifConnu : p.id === actif
        return (
          <button
            key={p.id ?? 'toutes'}
            type="button"
            role="radio"
            aria-checked={estActif}
            onClick={() => {
              if (estActif) return
              sfx.tap()
              onChange(p.id)
            }}
            className={cn(
              'flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-xs font-extrabold whitespace-nowrap transition-colors',
              estActif
                ? 'bg-primary text-primary-foreground'
                : 'bg-card text-foreground ring-1 ring-border',
            )}
          >
            {p.label}
            {p.nombre !== null ? (
              <span className={cn('tabular-nums', estActif ? 'text-primary-foreground/75' : 'text-muted-foreground')}>
                {p.nombre}
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
