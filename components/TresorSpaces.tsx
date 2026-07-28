'use client'

import { type ReactNode, type KeyboardEvent } from 'react'
import { useSearchParams } from 'next/navigation'
import { Crown, Store } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'

type SpaceId = 'boutique' | 'premium'

const SPACES: { id: SpaceId; label: string; icon: typeof Store }[] = [
  { id: 'boutique', label: 'Boutique', icon: Store },
  { id: 'premium', label: 'Premium', icon: Crown },
]

/**
 * L'onglet Trésor en deux volets : « Boutique » (le côté ACHAT — coffre du
 * jour, capsules, boosts en pièces, collection, l'ex-page /coffre) et
 * « Premium » (le côté ABONNEMENT — les offres payantes). Les deux volets
 * restent montés (attribut `hidden`) pour conserver leur état au basculement —
 * motif onglets WAI-ARIA, flèches gauche/droite au clavier.
 *
 * Le volet actif vit dans l'URL (`?volet=premium`), seule source de vérité —
 * même mécanique que ReviserSpaces.
 */
export default function TresorSpaces({
  boutique,
  premium,
}: {
  boutique: ReactNode
  premium: ReactNode
}) {
  const params = useSearchParams()
  const space: SpaceId =
    params.get('volet') === 'premium' ? 'premium' : 'boutique'

  const select = (id: SpaceId) => {
    if (id === space) return
    sfx.tap()
    const url = new URL(window.location.href)
    if (id === 'premium') url.searchParams.set('volet', 'premium')
    else url.searchParams.delete('volet')
    window.history.replaceState(null, '', url)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    e.preventDefault()
    const next = space === 'boutique' ? 'premium' : 'boutique'
    select(next)
    document.getElementById(`volet-tab-${next}`)?.focus()
  }

  return (
    <div className="flex flex-col gap-5">
      <div
        role="tablist"
        aria-label="Espaces de l'onglet Trésor"
        onKeyDown={onKeyDown}
        className="grid grid-cols-2 gap-1 rounded-full bg-white p-1 shadow-sm ring-1 ring-black/5"
      >
        {SPACES.map(({ id, label, icon: Icon }) => {
          const active = id === space
          return (
            <button
              key={id}
              id={`volet-tab-${id}`}
              role="tab"
              type="button"
              aria-selected={active}
              aria-controls={`volet-panel-${id}`}
              tabIndex={active ? 0 : -1}
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
        id="volet-panel-boutique"
        role="tabpanel"
        aria-labelledby="volet-tab-boutique"
        hidden={space !== 'boutique'}
      >
        {boutique}
      </div>
      <div
        id="volet-panel-premium"
        role="tabpanel"
        aria-labelledby="volet-tab-premium"
        hidden={space !== 'premium'}
      >
        {premium}
      </div>
    </div>
  )
}
