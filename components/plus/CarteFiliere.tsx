'use client'

import { useState, useTransition } from 'react'
import { Check, ChevronDown, Heart } from 'lucide-react'
import { basculerInteretPrepa } from '@/app/plus/actions'
import type { Filiere } from '@/lib/prepa-sup/catalogue'
import { sfx } from '@/lib/sounds'
import { toast } from '@/lib/toast'
import { cn } from '@/lib/utils'

/**
 * UNE FILIÈRE DE LA PRÉPA DU SUPÉRIEUR : sa teinte (une IDENTITÉ, au liseré et
 * à la pastille seulement), son accroche, ses débouchés, ses modules à déplier,
 * et « Ça m'intéresse » — le vote qui décidera par quelle filière on commence
 * le remplissage (migration 582). Le bouton reste violet : c'est une action.
 */
export default function CarteFiliere({ filiere, coche: cocheInitiale }: { filiere: Filiere; coche: boolean }) {
  const [coche, setCoche] = useState(cocheInitiale)
  const [ouverte, setOuverte] = useState(false)
  const [pending, start] = useTransition()

  const basculer = () => {
    sfx.tap()
    const avant = coche
    setCoche(!avant)
    start(async () => {
      const r = await basculerInteretPrepa(filiere.id)
      if (r.ok) {
        setCoche(r.coche)
        if (r.coche) toast(`Noté : ${filiere.nom} t’intéresse.`, 'success')
      } else {
        setCoche(avant)
        toast(r.indisponible ? 'Bientôt : on garde ton choix dès que la prépa ouvre.' : 'Impossible pour le moment.', 'error')
      }
    })
  }

  return (
    <article data-teinte={filiere.teinte} className="carte outil-carte p-4">
      <div className="flex items-start gap-3">
        <span aria-hidden="true" className="outil-pastille grid size-11 shrink-0 place-items-center rounded-2xl text-xl">
          {filiere.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-heading text-[16px] leading-tight font-extrabold">{filiere.nom}</h3>
          <p className="mt-0.5 text-[13px] leading-snug font-semibold">{filiere.accroche}</p>
          <p className="text-muted-foreground mt-1 text-[11.5px] font-semibold">{filiere.debouches}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setOuverte((v) => !v)}
        aria-expanded={ouverte}
        className="text-muted-foreground mt-2 flex min-h-9 items-center gap-1 text-[12px] font-extrabold"
      >
        {filiere.modules.length} modules d’introduction
        <ChevronDown aria-hidden="true" className={cn('size-4 transition-transform', ouverte && 'rotate-180')} />
      </button>
      {ouverte ? (
        <ol className="mt-1 space-y-1 pl-1">
          {filiere.modules.map((m, i) => (
            <li key={m} className="text-[12.5px] leading-snug font-semibold">
              <span className="outil-encre font-extrabold">{i + 1}.</span> {m}
            </li>
          ))}
          <li className="text-muted-foreground pt-1 text-[11.5px] font-semibold">Conseillé : {filiere.conseillePour}</li>
        </ol>
      ) : null}

      <button
        type="button"
        onClick={basculer}
        disabled={pending}
        aria-pressed={coche}
        className={cn(
          'mt-2 ml-auto flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-[13px] font-extrabold transition active:translate-y-px',
          coche ? 'bg-primary text-primary-foreground' : 'bg-secondary text-primary',
        )}
      >
        {coche ? <Check aria-hidden="true" className="size-4" /> : <Heart aria-hidden="true" className="size-4" />}
        {coche ? 'Ça m’intéresse' : 'Ça m’intéresse ?'}
      </button>
    </article>
  )
}
