'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, useReducedMotion } from 'framer-motion'
import { Check, Lock } from 'lucide-react'
import SheetShell from '@/components/defi/SheetShell'
import { FLANK_CLASS } from '@/components/defi/ArenaActionBar'
import { useDuelSubject } from '@/components/defi/DuelSubjectProvider'
import { plaqueClaire } from '@/lib/defi/plaque-claire'
import Image from 'next/image'
import SubjectIcon from '@/components/SubjectIcon'
import { sfx } from '@/lib/sounds'

/**
 * LE FLANC DROIT DE LA BARRE — la matière du combat, et la feuille qui la change.
 *
 * Il remplace la roulette à tambour. Celle-ci demandait DEUX gestes distincts
 * pour la même chose (deux chevrons de 16 px de haut, ou un balayage vertical),
 * ne montrait qu'une matière à la fois, et obligeait à traverser tout
 * l'alphabet pour aller d'Anglais à SVT — six taps sur une cible haute comme un
 * ongle. Elle imposait surtout au flanc une géométrie de cylindre que les deux
 * autres plaques n'avaient pas : trois formes, trois grammaires, une seule
 * rangée.
 *
 * Un tap, une feuille, toutes les matières visibles, une cible par matière. Le
 * geste est plus court dans le pire cas comme dans le meilleur, et le flanc
 * redevient une plaque comme ses deux voisines.
 *
 * IL MONTRE LA MATIÈRE ACTIVE — en ILLUSTRATION, sur un médaillon pastel.
 *
 * Il a longtemps porté l'icône de trait (`SubjectIcon`), et pour une raison
 * juste : la vignette illustrée est dessinée pour le crème des cartes de
 * Réviser, et posée telle quelle sur une plaque sombre, son cerne d'encre se
 * confond avec le fond. Mais la conclusion était trop courte — ce n'est pas la
 * vignette qu'il fallait écarter, c'est le fond sombre sous elle.
 *
 * D'où le MÉDAILLON : un disque du pastel de la matière (`entry.pastel`, dont
 * la doc dit déjà « une vignette est dessinée pour un fond clair »), et la
 * vignette dessus. Elle retrouve exactement les conditions pour lesquelles elle
 * a été peinte, et la matière a enfin le même visage ici que dans Réviser — une
 * matière, un seul visage dans toute l'app. Repli sur l'icône de trait quand le
 * dessin n'existe pas encore.
 *
 * LES DEUX TRIANGLES, au-dessus et en dessous, changent de matière sans ouvrir
 * la feuille. Ils ne la remplacent pas : la feuille reste le chemin court pour
 * aller d'Anglais à SVT, les triangles servent au voisinage immédiat — le geste
 * qu'on fait sans réfléchir quand on s'est trompé d'un cran.
 *
 * Le verrou du classé se dit par une pastille de 8 px dans l'angle, qui ne
 * mange pas l'illustration.
 */
/**
 * UN DES DEUX TRIANGLES qui font défiler les matières.
 *
 * Dessiné en SVG et non en bordures CSS : il porte un CERNE d'encre, comme tout
 * objet de l'arène, et l'astuce des bordures ne sait pas cerner un triangle.
 *
 * ELLES SE POSENT SUR LA PLAQUE, aux deux bords, et non au-dessus et en dessous.
 * Flottant dehors, elles se détachaient sur l'illustration de l'arène — un fond
 * peint, clair par endroits — où un petit triangle doré se perd. Ramenées sur le
 * violet de la plaque, elles ont enfin un fond uni et sombre derrière elles :
 * c'est le contraste qui les rend visibles, pas leur taille.
 *
 * LA CIBLE EST PLUS GRANDE QUE LE DESSIN, et c'est délibéré. Le triangle fait
 * 18 px de large — bien en dessous des 44 px recommandés au doigt. Sa boîte
 * tapable couvre toute la largeur du flanc (92 px) sur 26 px de haut. En
 * contrepartie, les deux bandes du haut et du bas cessent d'ouvrir la feuille :
 * c'est le prix de deux commandes sur une plaque de 92 px, et il est payé là où
 * le doigt vise le moins — le centre, qui porte l'illustration, reste à la
 * feuille.
 */
function Fleche({
  direction,
  onClick,
}: {
  direction: 'haut' | 'bas'
  onClick: () => void
}) {
  const haut = direction === 'haut'
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={haut ? 'Matière précédente' : 'Matière suivante'}
      // LA POINTE SORT DU CADRE. La bande déborde de 8 px au-delà de la plaque
      // (`-top-2` / `-bottom-2`) : le triangle a donc un pied sur le violet et
      // la tête dehors. C'est ce débordement qui en fait une COMMANDE posée sur
      // l'objet plutôt qu'une gravure dedans — et il libère du même coup la
      // place qu'il prenait au médaillon.
      //
      // Rien ne le rogne : ni la plaque ni le conteneur du flanc ne portent
      // `overflow-hidden`. Si l'un des deux venait à en recevoir un, les deux
      // pointes seraient tranchées net.
      //
      // La bande fait 34 px de haut sur les 92 px de large du flanc : c'est la
      // cible du doigt, et elle est bien plus grande que le dessin qu'elle
      // porte.
      className={`absolute left-0 z-10 flex h-[34px] w-full cursor-pointer justify-center focus-visible:outline-none ${
        haut ? '-top-2 items-start' : '-bottom-2 items-end'
      }`}
    >
      <svg
        viewBox="0 0 24 16"
        // 22 × 15 px. Il a pu grandir de moitié parce que la bande est sortie
        // de la plaque : posé à −8 px du bord, le triangle occupe −8 → 7 en
        // coordonnées de plaque, quand le médaillon commence à 16. Sept pixels
        // de jeu, là où la version précédente en cherchait un seul.
        className={`h-[15px] w-[22px] transition-transform active:scale-90 ${
          haut ? '' : 'rotate-180'
        }`}
        aria-hidden="true"
      >
        <path
          d="M12 1.6 22.4 14.4H1.6z"
          fill="#ffd66b"
          stroke="#1e1638"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}

export default function SubjectPlate() {
  const { board, index, active, select } = useDuelSubject()
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()

  if (board.length === 0 || !active) return null

  const locked = !active.unlocked

  /** Le voisin, en tournant en rond : après la dernière matière vient la première. */
  const voisin = (pas: number) => {
    sfx.tap()
    select((index + pas + board.length) % board.length)
  }

  return (
    <>
      {/* Le flanc devient un CONTENEUR : la plaque le remplit, les deux
          triangles se posent juste au-dessus et juste en dessous. La largeur
          reste celle de `FLANK_CLASS` — elle n'a fait que remonter d'un cran. */}
      <div className={`${FLANK_CLASS} relative`}>
        <button
          type="button"
          onClick={() => {
            sfx.tap()
            setOpen(true)
          }}
          aria-haspopup="dialog"
          aria-label={`Matière du duel : ${active.subject}, ${active.trophies} trophées${
            locked ? ' — pas encore ouverte au classé' : ''
          }. Appuie pour en choisir une autre.`}
          title={`${active.subject} — ${active.rank.label}`}
          className="arena-plate arena-plate--clair arena-plate--press relative flex h-full w-full cursor-pointer flex-col items-center justify-center focus-visible:ring-4 focus-visible:ring-white/60 focus-visible:outline-none"
          // LA PLAQUE PORTE LA COULEUR DE LA MATIÈRE, et il n'y a plus de
          // médaillon. Le disque pastel existait pour rendre la vignette
          // lisible sur un fond violet ; en donnant ce pastel à la plaque
          // ENTIÈRE, le problème disparaît et l'illustration récupère la place
          // que le disque lui prenait — 56 px sur une plaque de 86, contre 64
          // aujourd'hui.
          //
          // Le dégradé se fabrique hors du CSS (la teinte change à chaque
          // matière, une classe ne peut pas la connaître) et hors d'ici : les
          // deux flancs doivent baisser du même cran, sinon la rangée se
          // déséquilibre au premier réglage. Cf. `lib/defi/plaque-claire`.
          style={{ background: plaqueClaire() }}
        >
          {active.vignette ? (
            <Image
              src={active.vignette}
              alt=""
              aria-hidden="true"
              width={128}
              height={128}
              sizes="64px"
              className="size-16 object-contain"
            />
          ) : (
            <SubjectIcon
              slug={active.slug}
              size={40}
              strokeWidth={2.3}
              aria-hidden="true"
            />
          )}

          {/* La pastille de verrou : elle dit que la matière AFFICHÉE n'est pas
              ouverte au classé, donc que DUEL repliera sur un jeu. Un point qui
              s'allumerait dès qu'une matière quelconque est fermée serait allumé
              en permanence — c'est-à-dire muet. */}
          {locked ? (
            <span className="arena-plate-dot absolute top-2 right-2" aria-hidden="true" />
          ) : null}
        </button>

        {/* Après la plaque dans l'arbre : elles se posent dessus sans dépendre
            du seul empilement, qui se casse au premier contexte créé. */}
        <Fleche direction="haut" onClick={() => voisin(-1)} />
        <Fleche direction="bas" onClick={() => voisin(1)} />
      </div>

      {typeof document !== 'undefined'
        ? createPortal(
            <AnimatePresence>
              {open ? (
                <SheetShell
                  label="Choisir la matière du combat"
                  reduce={reduce}
                  onClose={() => {
                    sfx.back()
                    setOpen(false)
                  }}
                  header={
                    <div className="min-w-0 flex-1">
                      <h2 className="font-heading text-base font-extrabold text-white">
                        Matière du combat
                      </h2>
                      <p className="text-[0.72rem] text-white/60">
                        Le bouton COMBAT lance le duel de la matière choisie.
                      </p>
                    </div>
                  }
                >
                  <ul className="flex flex-col gap-1.5 p-3">
                    {board.map((entry, i) => {
                      const chosen = i === index
                      return (
                        <li key={entry.slug}>
                          <button
                            type="button"
                            onClick={() => {
                              sfx.tap()
                              select(i)
                              setOpen(false)
                            }}
                            aria-current={chosen ? 'true' : undefined}
                            className={`flex w-full cursor-pointer items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none ${
                              chosen
                                ? 'bg-white/15 ring-1 ring-white/25'
                                : 'bg-white/[0.06] hover:bg-white/10'
                            }`}
                          >
                            <SubjectIcon
                              slug={entry.slug}
                              className="size-6 shrink-0 text-white/85"
                              strokeWidth={2.3}
                              aria-hidden="true"
                            />
                            <span className="min-w-0 flex-1">
                              <span className="font-heading block truncate text-sm font-extrabold text-white">
                                {entry.subject}
                              </span>
                              <span className="block text-[0.7rem] text-white/60">
                                {entry.trophies} trophées · {entry.rank.label}
                              </span>
                            </span>

                            {/* Le verrou du classé, dit en toutes lettres ici :
                                la feuille a la place que la plaque n'a pas. */}
                            {entry.unlocked ? null : (
                              <span
                                className="flex shrink-0 items-center gap-1 rounded-full bg-black/35 px-2 py-1 text-[0.62rem] font-bold text-white/70"
                                title="Classé fermé — termine un chapitre"
                              >
                                <Lock className="size-3" strokeWidth={2.8} aria-hidden="true" />
                                Classé fermé
                              </span>
                            )}
                            {chosen ? (
                              <Check
                                className="text-highlight size-5 shrink-0"
                                strokeWidth={3}
                                aria-hidden="true"
                              />
                            ) : null}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </SheetShell>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}

      {/* Le changement de matière est une information, pas seulement une image :
          sans région vivante, un lecteur d'écran ne l'apprendrait qu'en revenant
          sur la plaque. */}
      <span className="sr-only" aria-live="polite">
        {active.subject}
      </span>
    </>
  )
}
