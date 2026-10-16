'use client'

import { useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { LIBELLE_ONGLET, ONGLETS_MARCEL, type OngletMarcel } from '@/lib/coach/bureau'

/**
 * LE BUREAU DE MARCEL — sa barre « Aujourd’hui · Radar · Toi · Outils »
 * (16/10/2026, maquette 2 de assets-sources/maquettes/marcel-bureau-plus.html,
 * choisie par Lucas : « trop de scrolling » avec tout empilé).
 *
 * Les quatre panneaux arrivent du serveur, déjà rendus ; ce composant ne fait
 * que montrer celui qu’on a touché. L’onglet vit dans l’adresse (`?onglet=`,
 * écrit par `replaceState`, sans empiler d’historique) : revenir d’un cours
 * rouvre le même onglet. Les quatre restent montés, cachés : changer d’onglet
 * ne recalcule rien. Plus de pastille sur « Outils » : un nombre dans une
 * bulle se lisait comme une notification non lue.
 *
 * Le bas de chaque panneau garde 5 rem de marge : le bouton des quêtes flotte
 * au-dessus du champ, et la dernière rangée doit pouvoir remonter au-dessus.
 */
export default function Bureau({
  initial,
  panneaux,
}: {
  initial: OngletMarcel
  panneaux: Record<OngletMarcel, ReactNode>
}) {
  const [onglet, setOnglet] = useState<OngletMarcel>(initial)

  const choisir = (o: OngletMarcel) => {
    if (o === onglet) return
    sfx.tap()
    setOnglet(o)
    const url = new URL(window.location.href)
    if (o === 'aujourdhui') url.searchParams.delete('onglet')
    else url.searchParams.set('onglet', o)
    window.history.replaceState(window.history.state, '', url)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div role="tablist" aria-label="Le bureau de Marcel" className="bg-secondary grid shrink-0 grid-cols-4 gap-1 rounded-2xl p-1">
        {ONGLETS_MARCEL.map((o) => (
          <button
            key={o}
            type="button"
            role="tab"
            id={`marcel-onglet-${o}`}
            aria-selected={o === onglet}
            aria-controls={`marcel-panneau-${o}`}
            onClick={() => choisir(o)}
            className={cn(
              'font-heading min-h-10 rounded-xl text-[13px] font-extrabold transition active:scale-[.97]',
              o === onglet ? 'bg-card text-foreground shadow-[0_2px_0_color-mix(in_oklch,var(--primary),transparent_70%)]' : 'text-primary',
            )}
          >
            {LIBELLE_ONGLET[o]}
          </button>
        ))}
      </div>

      {ONGLETS_MARCEL.map((o) => (
        <div
          key={o}
          role="tabpanel"
          id={`marcel-panneau-${o}`}
          aria-labelledby={`marcel-onglet-${o}`}
          hidden={o !== onglet}
          className="mt-2.5 min-h-0 flex-1 overflow-y-auto overscroll-contain px-0.5 pb-20 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {panneaux[o]}
        </div>
      ))}
    </div>
  )
}
