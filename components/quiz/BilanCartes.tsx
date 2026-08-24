'use client'

import { useState } from 'react'
import { Info, Anchor, Rocket, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import type { Bilan } from '@/lib/quiz-bilan'

/**
 * LES TROIS CHIFFRES DE FIN DE QUIZ.
 *
 * L'écran de fin n'affichait qu'un score — « 3 / 8 » — qui mélange trois
 * questions sans réponse : est-ce que j'ai réussi aujourd'hui ? est-ce que j'ai
 * fait le tour du chapitre ? est-ce que ça tient dans le temps ?
 *
 * Chaque carte porte donc UNE lecture, et un « i » qui dit ce qu'elle mesure —
 * sans quoi « ancrage » n'est qu'un mot. Les couleurs suivent les rôles de la
 * DA : vert pour la réussite (le succès), violet pour l'avancement (l'action
 * en cours), jaune pour l'ancrage (le gain qui reste).
 */

type Carte = {
  cle: keyof Bilan
  titre: string
  aide: string
  Icone: typeof Trophy
  /** Teinte de la pastille d'icône. */
  pastille: string
  /** Teinte du grand chiffre et de la barre. */
  chiffre: string
  barre: string
}

const CARTES: Carte[] = [
  {
    cle: 'reussite',
    titre: 'Réussite',
    aide: 'Le pourcentage de bonnes réponses de cette session.',
    Icone: Trophy,
    pastille: 'bg-success/15 text-success',
    chiffre: 'text-success',
    barre: 'bg-success',
  },
  {
    cle: 'avancement',
    titre: 'Avancement',
    aide: 'La part des questions de ce quiz que tu as déjà rencontrées au moins une fois.',
    Icone: Rocket,
    pastille: 'bg-primary/12 text-primary',
    chiffre: 'text-primary',
    barre: 'bg-primary',
  },
  {
    cle: 'ancrage',
    titre: 'Ancrage',
    aide: 'La part des notions retenues durablement — celles que tu ne reverras pas avant deux semaines.',
    Icone: Anchor,
    pastille: 'bg-highlight/25 text-[color-mix(in_oklch,var(--highlight),black_25%)]',
    chiffre: 'text-[color-mix(in_oklch,var(--highlight),black_20%)]',
    barre: 'bg-highlight',
  },
]

export default function BilanCartes({ bilan }: { bilan: Bilan }) {
  const [ouvert, setOuvert] = useState<string | null>(null)

  return (
    <ul className="grid grid-cols-3 gap-2">
      {CARTES.map(({ cle, titre, aide, Icone, pastille, chiffre, barre }) => {
        const valeur = bilan[cle]
        const estOuvert = ouvert === cle
        return (
          <li
            key={cle}
            className="flex flex-col rounded-2xl bg-card p-2.5 text-left ring-1 ring-black/5"
          >
            <div className="flex items-start gap-1.5">
              <span
                className={cn(
                  'flex size-6 shrink-0 items-center justify-center rounded-full',
                  pastille,
                )}
              >
                <Icone className="size-3" strokeWidth={2.6} aria-hidden="true" />
              </span>
              <span className="font-heading min-w-0 flex-1 text-[11px] leading-tight font-extrabold text-foreground">
                {titre}
              </span>
              <button
                type="button"
                onClick={() => {
                  sfx.tap()
                  setOuvert(estOuvert ? null : cle)
                }}
                aria-expanded={estOuvert}
                aria-label={`Que veut dire « ${titre} » ?`}
                className="-mt-0.5 -mr-0.5 flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground/60 transition hover:text-foreground"
              >
                <Info className="size-3.5" aria-hidden="true" />
              </button>
            </div>

            <p
              className={cn(
                'font-heading mt-1.5 text-3xl leading-none font-extrabold tabular-nums',
                chiffre,
              )}
            >
              {valeur}
              <span className="text-base">&nbsp;%</span>
            </p>

            <div
              className="mt-2 h-1 overflow-hidden rounded-full bg-black/5"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={valeur}
              aria-label={titre}
            >
              <div
                className={cn('h-full rounded-full transition-all', barre)}
                style={{ width: `${Math.max(valeur, valeur > 0 ? 3 : 0)}%` }}
              />
            </div>

            {estOuvert ? (
              <p className="mt-2 text-[10px] leading-snug text-pretty text-muted-foreground">
                {aide}
              </p>
            ) : null}
          </li>
        )
      })}
    </ul>
  )
}
