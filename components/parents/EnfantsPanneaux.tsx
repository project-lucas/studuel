'use client'

import { type ReactNode } from 'react'
import { useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'

export type EnfantOnglet = { id: string; nom: string }

/**
 * Un panneau par enfant, et une rangée de pastilles pour passer de l'un à
 * l'autre — SEULEMENT à partir de deux enfants. Avec un seul, le panneau
 * s'affiche tel quel, sans rangée.
 *
 * POURQUOI. Deux enfants liés donnaient deux cartes de suivi empilées, chacune
 * haute d'un écran et demi : le parent faisait défiler la première pour
 * chercher la seconde, et confondait les deux en route. Les panneaux restent
 * MONTÉS (attribut `hidden`) : un réglage en cours de saisie chez l'un ne
 * disparaît pas parce qu'on est allé vérifier un chiffre chez l'autre.
 *
 * L'enfant actif vit dans l'URL (`?enfant=<id>`), comme le volet : le lien
 * se partage, et le bon enfant reste sélectionné au retour d'une Server
 * Action. Un identifiant inconnu retombe sur le premier.
 */
export default function EnfantsPanneaux({
  enfants,
  panneaux,
}: {
  enfants: EnfantOnglet[]
  /** Le panneau de chaque enfant, dans le même ordre que `enfants`. */
  panneaux: Record<string, ReactNode>
}) {
  const params = useSearchParams()
  const demande = params.get('enfant')
  const actif = enfants.some((e) => e.id === demande) ? demande : enfants[0]?.id

  if (enfants.length <= 1) {
    return <>{enfants[0] ? panneaux[enfants[0].id] : null}</>
  }

  const select = (id: string) => {
    if (id === actif) return
    sfx.tap()
    const url = new URL(window.location.href)
    url.searchParams.set('enfant', id)
    window.history.replaceState(null, '', url)
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        role="tablist"
        aria-label="Choisir un enfant"
        className="flex flex-wrap gap-2"
      >
        {enfants.map((e) => {
          const on = e.id === actif
          return (
            <button
              key={e.id}
              type="button"
              role="tab"
              aria-selected={on}
              aria-controls={`enfant-panneau-${e.id}`}
              onClick={() => select(e.id)}
              className={cn(
                'font-heading focus-visible:ring-primary/50 flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-4 text-sm font-bold transition-colors focus-visible:ring-2 focus-visible:outline-none',
                on
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground',
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  'flex size-6 items-center justify-center rounded-full text-[11px] font-extrabold',
                  on ? 'bg-white/20' : 'bg-primary/10 text-primary',
                )}
              >
                {e.nom.trim().charAt(0).toUpperCase() || '?'}
              </span>
              {e.nom}
            </button>
          )
        })}
      </div>
      {enfants.map((e) => (
        <div
          key={e.id}
          id={`enfant-panneau-${e.id}`}
          role="tabpanel"
          hidden={e.id !== actif}
        >
          {panneaux[e.id]}
        </div>
      ))}
    </div>
  )
}
