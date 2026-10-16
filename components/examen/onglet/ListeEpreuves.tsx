'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { subjectVignette } from '@/lib/subject-style'
import { pourcent, type EpreuveVue } from '@/lib/examen/onglet'
import FeuilleEpreuve from './FeuilleEpreuve'

export const IMAGE_ORAL = '/images/marcel/outils/oral.webp'

export function imageEpreuve(e: Pick<EpreuveVue, 'nature' | 'matiere'>): string {
  if (e.nature === 'oral') return IMAGE_ORAL
  return (e.matiere && subjectVignette(e.matiere)) || '/images/marcel/outils/examen.webp'
}

/**
 * « QU’EST-CE QUI M’ATTEND ? » — une épreuve par ligne (maquette 2) : sa
 * nature et sa durée, et la préparation de L’ÉLÈVE, en barre et en chiffre.
 * Toucher une ligne ouvre l’épreuve en entier (maquette 3).
 */
export default function ListeEpreuves({
  epreuves,
  ouvert,
  onOralBlanc,
}: {
  epreuves: EpreuveVue[]
  ouvert: boolean
  /** L’épreuve orale renvoie au dossier d’oral (et à son oral blanc). */
  onOralBlanc: () => void
}) {
  const [ouverte, setOuverte] = useState<EpreuveVue | null>(null)

  return (
    <section className="carte p-3.5" aria-labelledby="examen-epreuves">
      <div className="flex items-baseline justify-between gap-2">
        <h2 id="examen-epreuves" className="font-heading text-[17px] font-extrabold">
          Tes épreuves
        </h2>
        <span className="text-muted-foreground text-[11.5px] font-extrabold">touche pour ouvrir</span>
      </div>
      <ul className="mt-1">
        {epreuves.map((e, i) => {
          const p = pourcent(e.preparation)
          return (
            <li key={e.id} className={cn(i > 0 && 'border-secondary border-t-[1.5px]')}>
              <button
                type="button"
                onClick={() => {
                  sfx.tap()
                  setOuverte(e)
                }}
                className="flex min-h-14 w-full items-center gap-2.5 py-1.5 text-left active:opacity-80"
              >
                <span className="bg-card grid size-10 shrink-0 place-items-center rounded-xl ring-2 ring-[color-mix(in_oklch,var(--primary),white_82%)]">
                  <Image src={imageEpreuve(e)} alt="" width={34} height={34} unoptimized className="size-[34px] object-contain" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="font-heading block truncate text-[14.5px] leading-tight font-extrabold">{e.titre}</span>
                  <span className="text-muted-foreground block truncate text-[11px] font-bold">
                    {e.nature === 'oral' ? 'Oral' : 'Écrit'} · {e.duree.replace(/ \+ .*/, '')}
                    {e.coefficient ? ` · coef. ${e.coefficient.replace(/ \(.*/, '')}` : ''}
                  </span>
                  <span className="bg-secondary mt-1 block h-[7px] overflow-hidden rounded-full">
                    <span className="bg-primary block h-full rounded-full" style={{ width: `${Math.max(p, 2)}%` }} />
                  </span>
                </span>
                <span className="font-heading text-primary w-11 shrink-0 text-right text-[14px] leading-none font-extrabold">
                  {p} %<span className="text-muted-foreground block font-sans text-[10px] font-bold">prêt</span>
                </span>
                <ChevronRight aria-hidden="true" className="text-primary/40 size-4 shrink-0" strokeWidth={2.6} />
              </button>
            </li>
          )
        })}
      </ul>
      <FeuilleEpreuve
        epreuve={ouverte}
        ouvert={ouvert}
        onClose={() => setOuverte(null)}
        onOralBlanc={() => {
          setOuverte(null)
          onOralBlanc()
        }}
      />
    </section>
  )
}
