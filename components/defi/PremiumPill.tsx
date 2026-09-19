'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useReducedMotion } from 'framer-motion'
import { sfx } from '@/lib/sounds'

/**
 * La pastille Studuel+ — le seul appel PAYANT de l'arène, posé sous le burger.
 *
 * Le passage premium n'existait nulle part sur l'écran d'accueil du jeu : il
 * fallait ouvrir l'onglet Boutique PUIS basculer sur un second volet pour
 * apprendre qu'une offre existe. Autant dire qu'elle n'existait pas. Ici, elle
 * tient l'angle haut-droit avec les autres plaques, dans le même gabarit
 * (plaque de 68 px) — mais en OR, la couleur du gain, sur un décor où tout le
 * reste est violet profond : c'est le seul objet doré du HUD, donc le premier
 * que l'œil trouve.
 *
 * ELLE PORTE UNE ÉTOILE DESSINÉE, plus les deux lettres « S+ ». Le sigle était
 * du TEXTE composé — une capitale et un signe plus de la police des titres —
 * dans un HUD où tout le reste est illustré. Il détonnait pour dire une chose
 * que le dessin dit mieux : l'or domine (l'abonnement est une récompense, et
 * dans la charte c'est le jaune qui porte ce rôle), la gemme violette au centre
 * signe la marque sans en faire un bouton d'action. Le nom du produit reste
 * dans l'`aria-label` et l'infobulle, où il se traduit et se corrige.
 *
 * Elle n'est rendue QUE pour les non-abonnés (décision côté page) : rien à
 * vendre à qui a déjà payé, et un bouton qui ne mène nulle part est pire que
 * pas de bouton.
 */
export default function PremiumPill() {
  const reduce = useReducedMotion()

  return (
    <Link
      href="/tresor"
      onClick={() => sfx.tap()}
      aria-label="Studuel+ — découvrir l’abonnement"
      title="Studuel+"
      // Une plaque de la colonne de l'angle, au format des voisines (68 px,
      // coins ronds) — mais EN OR : le seul objet doré du HUD.
      className="olympe-gold defi2-press relative grid size-[68px] place-items-center rounded-2xl focus-visible:ring-4 focus-visible:ring-highlight/60 focus-visible:outline-none"
    >
      {/* Le halo qui bat. Décoratif, `pointer-events-none`, et neutralisé si
          l'élève a demandé moins de mouvement — un appel commercial n'est pas
          une raison d'ignorer une préférence d'accessibilité. */}
      {reduce ? null : (
        <span
          aria-hidden="true"
          className="premium-pill-halo pointer-events-none absolute inset-0 rounded-2xl"
        />
      )}
      <Image
        src="/images/defi/icones/premium-v3.webp"
        alt=""
        aria-hidden="true"
        width={256}
        height={256}
        sizes="58px"
        className="relative size-[58px] object-contain drop-shadow-[0_3px_4px_rgba(90,61,0,0.45)]"
      />
    </Link>
  )
}
