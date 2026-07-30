'use client'

import Link from 'next/link'
import { Trophy } from 'lucide-react'
import { sfx } from '@/lib/sounds'

/**
 * Le bouton « Classé » de l'arène — TUILE CARRÉE de flanc, à gauche du bouton
 * de combat (Modes tient l'autre flanc, même gabarit, même robe sombre). Il ne
 * porte plus qu'un picto et son mot : dans un carré de 4,5 rem, une sous-ligne
 * « BO3 · +30/−20 » se serait cassée en deux — la règle du jeu compétitif vit
 * maintenant dans l'`aria-label` (lecteurs d'écran) et l'infobulle.
 *
 * Le TROPHÉE est ici à sa place : c'est le seul mode qui fait bouger le compteur
 * de trophées de la cartouche de rang. (Le tournoi des écoles, qui portait ce
 * picto dans le burger, prend l'école — un dessin, un sens.)
 *
 * Composant client uniquement pour porter LE son épique de l'app au clic
 * (`sfx.battle`) : l'écran /defi reste un composant serveur.
 */
export default function MatchClasseCta() {
  return (
    <Link
      href="/defi/jouer?mode=ranked"
      onClick={() => sfx.battle()}
      title="Classé — au meilleur des 3 manches, victoire +30, défaite −20"
      className="arena-flank olympe-press relative isolate flex w-[4.5rem] shrink-0 flex-col items-center justify-center gap-1 rounded-lg px-1 py-2 focus-visible:ring-4 focus-visible:ring-highlight/60 focus-visible:outline-none"
      aria-label="Lancer un match classé — au meilleur des 3 manches, victoire +30 trophées, défaite −20"
    >
      <Trophy className="size-5 shrink-0" strokeWidth={2.4} aria-hidden="true" />
      <span className="font-heading text-[0.7rem] leading-none font-extrabold">
        Classé
      </span>
    </Link>
  )
}
