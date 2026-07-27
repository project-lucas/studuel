'use client'

import Link from 'next/link'
import { Timer } from 'lucide-react'
import { SwordsIcon } from '@/components/defi/icons'
import { sfx } from '@/lib/sounds'
import { DUEL_SECONDS } from '@/lib/duel90'

/**
 * Le CTA « DUEL 90 s » — LE bouton de l'app.
 *
 * Il occupe la place la plus proéminente de l'arène parce qu'il lance la boucle
 * centrale : 90 secondes, sur le chapitre le plus utile de l'élève, contre un
 * rival dont le score monte en direct. Aucun choix à faire avant de jouer —
 * chaque écran intermédiaire coûte des joueurs.
 *
 * La ligne du dessous dit POURQUOI ce duel (« Contrôle dans 3 jours ») : c'est
 * elle qui transforme « un quiz de plus » en « le quiz dont j'ai besoin ».
 */
export default function Duel90Cta({ reason }: { reason?: string }) {
  return (
    <Link
      href="/defi/duel"
      onClick={() => sfx.battle()}
      className="olympe-gold olympe-press attract-sheen relative isolate flex min-h-16 w-full flex-col items-center justify-center gap-0.5 overflow-hidden rounded-2xl px-5 py-3 focus-visible:ring-4 focus-visible:ring-highlight/50 focus-visible:outline-none"
      aria-label={
        reason
          ? `Lancer un duel de ${DUEL_SECONDS} secondes — ${reason}`
          : `Lancer un duel de ${DUEL_SECONDS} secondes`
      }
    >
      <span className="font-heading flex items-center gap-2.5 text-xl font-extrabold tracking-wide">
        <SwordsIcon className="size-6 shrink-0" />
        DUEL {DUEL_SECONDS} S
      </span>
      <span className="flex items-center gap-1.5 text-[0.72rem] font-bold opacity-75">
        <Timer className="size-3.5 shrink-0" />
        {reason ?? 'Sur ton chapitre en cours'}
      </span>
    </Link>
  )
}
