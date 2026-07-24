'use client'

import Link from 'next/link'
import { SwordsIcon } from '@/components/defi/icons'
import { sfx } from '@/lib/sounds'

/**
 * Le CTA « MATCH CLASSÉ » de l'arène — la plaque « or ciselé », l'élément le plus
 * proéminent de l'écran Défi, façon bouton « Battle! » de Clash Royale. Isolé en
 * composant client uniquement pour porter LE son épique de l'app au clic
 * (`sfx.battle`) : l'écran /defi reste un composant serveur. La robe (or ciselé,
 * ombre dure qui s'écrase, reflet qui balaye) vit dans globals.css.
 */
export default function MatchClasseCta() {
  return (
    <Link
      href="/defi/jouer?mode=ranked"
      onClick={() => sfx.battle()}
      className="olympe-gold olympe-press attract-sheen relative isolate flex min-h-16 w-full flex-col items-center justify-center gap-0.5 overflow-hidden rounded-2xl px-5 py-3 focus-visible:ring-4 focus-visible:ring-highlight/50 focus-visible:outline-none"
      aria-label="Lancer un match classé"
    >
      <span className="font-heading flex items-center gap-2.5 text-xl font-extrabold tracking-wide">
        <SwordsIcon className="size-6 shrink-0" />
        MATCH CLASSÉ
      </span>
      <span className="text-[0.72rem] font-bold opacity-75">
        Au meilleur des 3 manches · Victoire +30 · Défaite −20
      </span>
    </Link>
  )
}
