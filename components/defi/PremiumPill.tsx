'use client'

import Link from 'next/link'
import { Plus } from 'lucide-react'
import { useReducedMotion } from 'framer-motion'
import { sfx } from '@/lib/sounds'

/**
 * La pastille Studuel+ — le seul appel PAYANT de l'arène, posé sous le burger.
 *
 * Le passage premium n'existait nulle part sur l'écran d'accueil du jeu : il
 * fallait ouvrir l'onglet Boutique PUIS basculer sur un second volet pour
 * apprendre qu'une offre existe. Autant dire qu'elle n'existait pas. Ici, elle
 * tient l'angle haut-droit avec les autres commandes, dans le même gabarit
 * (jeton rond de 44 px) — mais en OR, la couleur du gain, sur un décor où tout
 * le reste est verre de nuit : c'est le seul objet doré du HUD, donc le premier
 * que l'œil trouve.
 *
 * Elle n'est rendue QUE pour les non-abonnés (décision côté page) : rien à
 * vendre à qui a déjà payé, et un bouton qui ne mène nulle part est pire que
 * pas de bouton.
 */
export default function PremiumPill() {
  const reduce = useReducedMotion()

  return (
    <Link
      href="/tresor?volet=premium"
      onClick={() => sfx.tap()}
      aria-label="Studuel+ — découvrir l’abonnement"
      title="Studuel+"
      className="olympe-gold defi2-press relative grid size-11 place-items-center rounded-full focus-visible:ring-4 focus-visible:ring-highlight/60 focus-visible:outline-none"
    >
      {/* Le halo qui bat. Décoratif, `pointer-events-none`, et neutralisé si
          l'élève a demandé moins de mouvement — un appel commercial n'est pas
          une raison d'ignorer une préférence d'accessibilité. */}
      {reduce ? null : (
        <span
          aria-hidden="true"
          className="premium-pill-halo pointer-events-none absolute inset-0 rounded-full"
        />
      )}
      <span
        aria-hidden="true"
        className="font-heading relative flex items-baseline text-[0.95rem] leading-none font-extrabold"
      >
        S
        <Plus className="size-3" strokeWidth={3.4} />
      </span>
    </Link>
  )
}
