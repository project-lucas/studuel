'use client'

import Link from 'next/link'
import { Play } from 'lucide-react'
import { sfx } from '@/lib/sounds'

/** Durée annoncée : ~30 s par carte, jamais moins d'une minute. */
function minutes(cartes: number): number {
  return Math.max(1, Math.round(cartes / 2))
}

/**
 * « À revoir aujourd'hui » — UNE bande, au-dessus de l'étagère.
 *
 * Le carnet avait perdu son héros à dessein : cinq blocs dont aucun n'était un
 * cours en faisaient un tiroir à fourre-tout. Mais la route de la session
 * transverse (`/reviser/cours/revoir`) est restée — SANS AUCUN LIEN vers elle
 * dans toute l'app. Une session entière, écrite et jouable, que personne ne
 * pouvait atteindre.
 *
 * Elle revient donc, mais réduite à ce qui la justifie : un nombre, une durée,
 * un bouton. Et elle DISPARAÎT quand il n'y a rien à revoir — c'est ce qui
 * l'empêche de redevenir du décor permanent.
 */
export default function RevoirBand({ dues }: { dues: number }) {
  if (dues <= 0) return null

  return (
    <Link
      href="/reviser/cours/revoir"
      onClick={() => sfx.tap()}
      className="flex items-center gap-3 rounded-3xl bg-highlight/30 p-3.5 ring-1 ring-highlight/50 transition active:scale-[0.99]"
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-highlight text-xl">
        🔁
      </span>
      <span className="min-w-0 flex-1">
        <span className="font-heading block text-[0.95rem] leading-snug font-extrabold text-foreground">
          {dues} carte{dues > 1 ? 's' : ''} à revoir
        </span>
        <span className="mt-0.5 block text-xs font-semibold text-muted-foreground">
          Tous tes cours · environ {minutes(dues)} min
        </span>
      </span>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
        <Play className="size-4 fill-current" aria-hidden="true" />
      </span>
    </Link>
  )
}
