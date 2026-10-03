'use client'

import Image from 'next/image'
import { Check, ChevronRight } from 'lucide-react'
import { aEncaisser, coffreDuJourPret } from '@/lib/quests'
import { sfx } from '@/lib/sounds'
import { cn } from '@/lib/utils'
import { iconeQuete } from './icone'
import { ouvrirFeuilleQuetes, useQuetesDuJour } from './store'

/**
 * LES QUÊTES DU JOUR EN TÊTE DE RÉVISER (03/10/2026). Sur l'accueil Réviser,
 * la puce de classe tient le bord droit du bandeau, où vit ailleurs la
 * pastille des quêtes : elles y prennent la forme d'une carte, juste sous la
 * série — trois objets, cochés quand c'est fait, et ce qu'il reste. Un
 * toucher ouvre la feuille des quêtes, la même que partout.
 */
export default function QuetesReviser() {
  const etat = useQuetesDuJour()
  if (!etat || etat.quetes.length === 0) return null
  const faites = etat.quetes.filter((q) => q.done).length
  const du = aEncaisser(etat).length > 0 || coffreDuJourPret(etat)
  return (
    <button
      type="button"
      onClick={() => {
        sfx.tap()
        ouvrirFeuilleQuetes()
      }}
      aria-haspopup="dialog"
      className={cn('carte flex w-full items-center gap-3 p-3 text-left', du && 'ring-2 ring-highlight/70')}
    >
      <Image
        src="/images/defi/icones/quetes-v3.webp"
        alt=""
        aria-hidden="true"
        width={96}
        height={96}
        className="size-10 shrink-0 object-contain"
      />
      <span className="min-w-0 flex-1">
        <span className="font-heading block leading-tight font-extrabold whitespace-nowrap">Quêtes du jour</span>
        <span className="block truncate text-xs text-muted-foreground">
          {du ? 'À encaisser' : faites === etat.quetes.length ? 'Journée bouclée' : `${faites}/${etat.quetes.length} faites`}
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-1" aria-hidden="true">
        {etat.quetes.map((q) => (
          <span
            key={q.id}
            className={cn(
              'relative grid size-8 place-items-center rounded-xl',
              q.done ? 'bg-highlight/25 ring-2 ring-highlight' : 'bg-secondary',
            )}
          >
            <Image src={iconeQuete(q)} alt="" width={64} height={64} className="size-6 object-contain" />
            {q.done ? (
              <span className="absolute -right-1 -bottom-1 grid size-4 place-items-center rounded-full bg-success text-white ring-2 ring-card">
                <Check className="size-2.5" strokeWidth={4} />
              </span>
            ) : null}
          </span>
        ))}
      </span>
      <ChevronRight className="-ml-1 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
    </button>
  )
}
