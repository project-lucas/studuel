'use client'

import { type ReactNode } from 'react'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, NotebookPen } from 'lucide-react'
import { sfx } from '@/lib/sounds'

type SpaceId = 'reviser' | 'carnet'

/**
 * L'onglet Réviser en deux espaces : « Mes matières » (la mission, le
 * programme) et « Mon carnet » (les cours façon Wooflash). Plus de segmented
 * control en tête — l'entrée du carnet est un bouton libellé (CarnetButton)
 * posé sur la ligne du titre « Réviser », et le volet carnet s'ouvre avec sa
 * propre barre de retour. Les deux volets restent montés (attribut `hidden`)
 * pour conserver leur état.
 *
 * L'espace actif vit dans l'URL (`?espace=carnet`), seule source de vérité :
 * lien partageable, bon volet conservé au retour d'un chapitre. Le tap passe
 * par history.replaceState, que Next synchronise avec useSearchParams.
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

  const back = () => {
    sfx.tap()
    const url = new URL(window.location.href)
    url.searchParams.delete('espace')
    window.history.replaceState(null, '', url)
    window.scrollTo({ top: 0 })
  }

  return (
    <div className="flex flex-col gap-4">
      <div id="espace-panel-reviser" hidden={space !== 'reviser'}>
        {reviser}
      </div>
      <div id="espace-panel-carnet" hidden={space !== 'carnet'}>
        {/* Barre d'entête du carnet : retour aux matières + identité du volet. */}
        <div className="mb-4 flex items-center gap-2.5">
          <button
            type="button"
            onClick={back}
            aria-label="Retour à mes matières"
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-primary shadow-sm ring-1 ring-black/5 transition active:translate-y-px"
          >
            <ArrowLeft className="size-5" strokeWidth={2.4} aria-hidden="true" />
          </button>
          <h2 className="font-heading flex items-center gap-2 text-lg font-extrabold text-foreground">
            <NotebookPen
              className="size-4.5 text-primary"
              strokeWidth={2.4}
              aria-hidden="true"
            />
            Mon carnet
          </h2>
        </div>
        {carnet}
      </div>
    </div>
  )
}
