'use client'

import { type ReactNode, type KeyboardEvent } from 'react'
import { useSearchParams } from 'next/navigation'
import { BookOpenText, NotebookPen } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'

type SpaceId = 'reviser' | 'carnet'

// « Mes matières » (et non « Réviser » : le sous-onglet ne doit pas répéter le
// nom de l'onglet parent) et « Mon carnet ».
const SPACES: { id: SpaceId; label: string; icon: typeof BookOpenText }[] = [
  { id: 'reviser', label: 'Mes matières', icon: BookOpenText },
  { id: 'carnet', label: 'Mon carnet', icon: NotebookPen },
]

/**
 * L'onglet Réviser en deux espaces (façon Decks / Collection) : « Mes matières »
 * (le programme, la file du jour) et « Mon carnet » (les données scolaires :
 * contrôles à venir, maîtrise, préparation examen). Les deux volets restent
 * montés (attribut `hidden`) pour conserver leur état au basculement — motif
 * onglets WAI-ARIA, flèches gauche/droite au clavier.
 *
 * L'espace actif vit dans l'URL (`?espace=carnet`), seule source de vérité :
 * lien partageable, bon volet conservé au retour d'un chapitre, et les liens
 * internes (le « + » de la barre de semaine) basculent le volet naturellement.
 * Le tap passe par history.replaceState, que Next synchronise avec
 * useSearchParams — pas d'état local à réconcilier, pas de re-rendu serveur.
 */
export default function ReviserSpaces({
  reviser,
  carnet,
}: {
  reviser: ReactNode
  carnet: ReactNode
}) {
  const params = useSearchParams()
  const space: SpaceId = params.get('espace') === 'carnet' ? 'carnet' : 'reviser'

  const select = (id: SpaceId) => {
    if (id === space) return
    sfx.tap()
    const url = new URL(window.location.href)
    if (id === 'carnet') url.searchParams.set('espace', 'carnet')
    else url.searchParams.delete('espace')
    window.history.replaceState(null, '', url)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    e.preventDefault()
    const next = space === 'reviser' ? 'carnet' : 'reviser'
    select(next)
    document.getElementById(`espace-tab-${next}`)?.focus()
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        role="tablist"
        aria-label="Espaces de l'onglet Réviser"
        onKeyDown={onKeyDown}
        className="grid grid-cols-2 gap-1 rounded-full bg-white p-1 shadow-sm ring-1 ring-black/5"
      >
        {SPACES.map(({ id, label, icon: Icon }) => {
          const active = id === space
          return (
            <button
              key={id}
              id={`espace-tab-${id}`}
              role="tab"
              type="button"
              aria-selected={active}
              aria-controls={`espace-panel-${id}`}
              tabIndex={active ? 0 : -1}
              data-tour={id === 'carnet' ? 'carnet-switch' : undefined}
              onClick={() => select(id)}
              className={cn(
                'font-heading flex cursor-pointer items-center justify-center gap-2 rounded-full py-2.5 text-sm font-bold transition-colors focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none',
                active
                  ? 'bg-primary text-primary-foreground shadow-[0_6px_14px_-6px_color-mix(in_oklch,var(--primary),transparent_30%)]'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Icon className="size-4.5" strokeWidth={2.2} aria-hidden="true" />
              {label}
            </button>
          )
        })}
      </div>

      <div
        id="espace-panel-reviser"
        role="tabpanel"
        aria-labelledby="espace-tab-reviser"
        hidden={space !== 'reviser'}
      >
        {reviser}
      </div>
      <div
        id="espace-panel-carnet"
        role="tabpanel"
        aria-labelledby="espace-tab-carnet"
        hidden={space !== 'carnet'}
      >
        {carnet}
      </div>
    </div>
  )
}
