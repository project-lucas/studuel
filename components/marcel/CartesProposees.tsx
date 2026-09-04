'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { BookMarked, Check, Layers, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { toast } from '@/lib/toast'
import { rangerCartesProposees } from '@/app/marcel/conversations-actions'
import type { CarteIa } from '@/lib/coach/cartes-ia'

// LES CARTES PROPOSÉES — l'écran de relecture, entre le modèle et le carnet.
//
// Rien n'est écrit tant que l'élève n'a pas validé. C'est la même règle que la
// génération du carnet (« l'IA rédige, TU valides ») et elle n'est pas un
// confort : un modèle se trompe, et le carnet est le support de révision de
// l'élève — une carte fausse s'y réviserait pendant des mois, en apprenant
// l'erreur au lieu de la corriger.
//
// Tout est gardé par défaut : l'élève RETIRE ce qui ne va pas, il n'a pas à
// cocher huit cases pour obtenir ce qu'il vient de demander.
//
// UNE FOIS RANGÉ, LE PANNEAU RESTE — il montre « c'est fait » et le lien vers le
// carnet. Première version : il prévenait le parent, qui vidait les cartes, ce
// qui DÉMONTAIT le panneau dans la foulée — l'écriture réussissait et l'écran
// n'en gardait aucune trace. C'est le fil qui décide de l'oublier, au prochain
// envoi ; le `key` du parent garantit qu'un nouveau lot repart d'un panneau
// neuf.

export default function CartesProposees({ cartes }: { cartes: CarteIa[] }) {
  const [retirees, setRetirees] = useState<Set<number>>(new Set())
  const [pending, start] = useTransition()
  const [range, setRange] = useState<{ courseId: string; nombre: number } | null>(
    null,
  )

  const gardees = cartes.filter((_, i) => !retirees.has(i))

  const ranger = () => {
    if (pending || gardees.length === 0) return
    sfx.tap()
    start(async () => {
      const res = await rangerCartesProposees(gardees)
      if (res.ok && res.courseId) {
        setRange({ courseId: res.courseId, nombre: res.ajoutees ?? gardees.length })
        toast(
          `${res.ajoutees ?? gardees.length} cartes dans ton carnet !`,
          'success',
        )
        return
      }
      toast('Je n’ai pas réussi à écrire dans ton carnet.', 'error')
    })
  }

  if (range) {
    return (
      <div className="bg-success/10 mt-2 ml-10 rounded-[18px] p-3">
        <p className="text-success flex items-center gap-2 text-[13px] font-extrabold">
          <Check aria-hidden="true" className="size-4" strokeWidth={3} />
          {range.nombre} cartes rangées dans ton carnet
        </p>
        <Link
          href={`/reviser/cours/${range.courseId}`}
          className="text-primary mt-1 inline-flex min-h-9 items-center text-xs font-extrabold underline-offset-4 hover:underline"
        >
          Les voir dans « Avec Marcel »
        </Link>
      </div>
    )
  }

  return (
    <div
      data-teinte="vert"
      className="bg-card outil-carte mt-2 ml-10 rounded-[18px] p-3"
    >
      <p className="outil-encre mb-2 flex items-center gap-1.5 text-[11px] font-extrabold tracking-wide uppercase">
        <Layers aria-hidden="true" className="size-3.5" />
        {gardees.length} carte{gardees.length > 1 ? 's' : ''} à relire
      </p>

      <ul className="space-y-1.5">
        {cartes.map((carte, index) => {
          const retiree = retirees.has(index)
          return (
            <li
              key={`${carte.recto}-${index}`}
              className={cn(
                'bg-background/60 flex items-start gap-2 rounded-xl p-2 transition',
                retiree && 'opacity-40',
              )}
            >
              <span className="min-w-0 flex-1">
                <b
                  className={cn(
                    'block text-[12.5px] leading-snug font-extrabold',
                    retiree && 'line-through',
                  )}
                >
                  {carte.recto}
                </b>
                <span className="text-muted-foreground block text-[12px] leading-snug font-semibold">
                  {carte.verso}
                </span>
              </span>
              <button
                type="button"
                onClick={() =>
                  setRetirees((s) => {
                    const suivant = new Set(s)
                    if (retiree) suivant.delete(index)
                    else suivant.add(index)
                    return suivant
                  })
                }
                aria-label={
                  retiree
                    ? `Remettre « ${carte.recto} »`
                    : `Retirer « ${carte.recto} »`
                }
                className="text-muted-foreground grid size-8 shrink-0 place-items-center rounded-lg"
              >
                {retiree ? (
                  <Check aria-hidden="true" className="size-4" />
                ) : (
                  <X aria-hidden="true" className="size-4" />
                )}
              </button>
            </li>
          )
        })}
      </ul>

      <button
        type="button"
        onClick={ranger}
        disabled={pending || gardees.length === 0}
        className="bg-primary text-primary-foreground mt-2.5 flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl text-[13px] font-extrabold shadow-[0_3px_0_color-mix(in_oklch,var(--primary),black_28%)] transition active:translate-y-px disabled:opacity-40 disabled:shadow-none"
      >
        <BookMarked aria-hidden="true" className="size-4" />
        {pending ? 'J’écris…' : 'Ajouter à mon carnet'}
      </button>
    </div>
  )
}
