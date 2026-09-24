'use client'

import Link from 'next/link'
import { ChevronRight, PenLine } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * L'ENTRÉE DU MODE DICTÉE, dans l'onglet « Mode de jeu » du français.
 *
 * Elle ne s'affiche que pour cette matière : une dictée d'histoire-géo n'existe
 * pas, et une carte grisée « bientôt » dans les autres dossiers serait une
 * porte qui ne s'ouvre pas — ce que le projet a déjà refusé ailleurs.
 *
 * L'illustration viendra remplacer l'icône : le carré est déjà à sa taille
 * définitive pour que son arrivée ne déplace rien.
 */
export default function CarteDictee() {
  // Le `Button` de la maison en contour, étiré en tuile : c'est la même
  // famille que tous les autres boutons (socle, son de clic), avec deux lignes
  // dedans au lieu d'un mot. Elle portait la plaque du quiz, retirée le
  // 23/09/2026.
  return (
    <Button
      asChild
      variant="outline"
      className="h-auto w-full justify-start gap-3 rounded-3xl px-4 py-4 text-left whitespace-normal"
    >
      <Link href="/reviser/francais/dictee">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-primary">
          <PenLine className="size-6" strokeWidth={2.2} aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="font-heading block text-base font-extrabold text-foreground">
            Les dictées
          </span>
          <span className="mt-0.5 block text-xs leading-snug font-semibold text-muted-foreground">
            Écoute, écris, et vois tes fautes expliquées une par une.
          </span>
        </span>
        <ChevronRight className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
      </Link>
    </Button>
  )
}
