'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { Lock } from 'lucide-react'
import { echelon, railLigue, type EtatRail } from '@/lib/ligue'
import { cn } from '@/lib/utils'

/**
 * LE RAIL DES RANGS DE LA LIGUE — le haut de l'écran de ligue de Duolingo
 * (Lucas, 16/09/2026 : « je veux cela comme Duolingo, voici les écussons par
 * division, ils doivent être cachés tant que le joueur n'a pas atteint le
 * palier suivant »).
 *
 * Les six blasons de rang (`public/images/defi/ranks`, les mêmes que l'arène)
 * côte à côte, qui se font défiler. Celui de l'élève se tient au centre, en
 * grand, et respire ; ceux qu'il a traversés restent en couleur, plus petits ;
 * ceux qu'il n'a pas atteints sont GRIS ET CADENASSÉS — on ne les découvre
 * qu'en y arrivant, comme la coupe d'argent grisée à côté de la coupe de
 * bronze chez Duolingo. Le gris est un filtre sur l'illustration (grayscale +
 * opacité), pas un second dessin : le jour où l'élève monte, c'est le même
 * blason qui prend ses couleurs.
 *
 * Depuis le 24/09/2026, le rail suit l'ÉCHELON de la ligue de la semaine
 * (lib/ligue : Bronze 4 → Maître), et non plus les trophées : sous le blason
 * courant s'écrit la division (« Bronze 4 »). L'état de chaque blason vient de
 * `railLigue` (testé) ; ici on ne fait que dessiner.
 */

// Resserré le 17/09/2026 (Lucas : « ce bloc doit être plus petit ») : chez
// Duolingo la coupe courante fait à peu près un quart de la largeur, pas un
// tiers — le rail doit laisser l'écran à la liste. Puis remonté d'un cran le
// 19/09/2026 (« l'illustration du rang n'est pas assez grande, agrandis tout
// en étant raisonnable ») : 96 px au centre, soit un quart d'un écran de
// 390 px, et les voisins à 54 — le blason se lit, la liste garde l'écran.
const TAILLE: Record<EtatRail, number> = {
  courante: 96,
  passee: 54,
  verrouillee: 54,
}

export default function RailDivisions({ echelon: index }: { echelon: number }) {
  const rail = useRef<HTMLUListElement>(null)
  const actuel = useRef<HTMLLIElement>(null)
  const divisions = railLigue(index)
  const division = echelon(index)

  // La division courante au CENTRE du rail à l'ouverture. On déplace le rail
  // lui-même (scrollLeft) plutôt que `scrollIntoView`, qui ferait aussi défiler
  // la page verticalement pour amener le blason à l'écran. En mouvement réduit,
  // on y va d'un coup.
  useEffect(() => {
    const conteneur = rail.current
    const cible = actuel.current
    if (!conteneur || !cible) return
    const reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const gauche = cible.offsetLeft - (conteneur.clientWidth - cible.offsetWidth) / 2
    conteneur.scrollTo({ left: gauche, behavior: reduit ? 'auto' : 'smooth' })
  }, [index])

  return (
    <ul
      ref={rail}
      aria-label="Les rangs de la ligue"
      // Une marge d'une demi-largeur de chaque côté : même le premier blason
      // (Bronze, où tout le monde commence) peut se tenir AU CENTRE, comme la
      // coupe de Duolingo, avec la division suivante qui dépasse à droite.
      // `overscroll-x-contain` : arrivé au bout du rail, le geste s'arrête
      // là — il ne se transmet pas à la page. Le
      // rail est LA SEULE chose de l'écran qui glisse sur le côté.
      //
      // `relative` : INDISPENSABLE. Sans lui, les libellés `sr-only` des
      // blasons (position absolue) se calaient sur la PAGE et non sur le rail,
      // échappaient au découpage du défilement et élargissaient le document
      // jusqu'au dernier blason (869 px sur un écran de 412). Chrome Android
      // agrandissait alors la zone de mise en page : la barre d'onglets, fixée
      // en bas de CETTE zone, sortait de l'écran (17/09/2026).
      // `w-full self-stretch` : dans une colonne centrée (LigueSemaine), le
      // rail prenait la largeur de ses six blasons au lieu de défiler — il
      // débordait de l'écran et centrait Argent → Diamant (24/09/2026).
      className="relative flex w-full self-stretch snap-x snap-mandatory items-end gap-3 overflow-x-auto overscroll-x-contain px-[calc(50%-48px)] pt-2 pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {divisions.map(({ rang: tier, etat }) => {
        const taille = TAILLE[etat]
        const verrouillee = etat === 'verrouillee'
        return (
          <li
            key={tier.id}
            ref={etat === 'courante' ? actuel : undefined}
            aria-current={etat === 'courante' ? 'true' : undefined}
            className="flex shrink-0 snap-center flex-col items-center gap-1"
            style={{ minWidth: TAILLE.courante }}
          >
            {/* Le blason courant respire doucement : c'est le seul mouvement
                du rail, donc l'œil y va. Immobile en mouvement réduit — sa
                taille le désigne déjà. En CSS (`float-y` de globals.css) et
                non plus framer-motion : c'était le seul usage de la librairie
                sur l'onglet Amis, ~65 Ko compressés chargés d'entrée pour un
                balancement de 5 px (18/09/2026). */}
            <span
              aria-hidden="true"
              className={cn(
                'relative grid place-items-center',
                etat === 'courante' && 'motion-safe:animate-[float-y_2.6s_ease-in-out_infinite]',
              )}
              style={{ width: taille, height: taille }}
            >
              <Image
                src={tier.image}
                alt=""
                width={224}
                height={224}
                // Le blason courant ouvre l'onglet : chargé d'emblée.
                loading={etat === 'courante' ? 'eager' : undefined}
                className={cn(
                  'size-full select-none object-contain',
                  verrouillee
                    ? // Caché derrière le gris : l'illustration est là, mais
                      // elle ne se lit pas — on la découvrira en y arrivant.
                      'opacity-40 grayscale'
                    : 'drop-shadow-[0_4px_6px_rgba(0,0,0,0.18)]',
                  etat === 'passee' && 'opacity-90',
                )}
              />
              {verrouillee ? (
                <Lock
                  className="absolute text-foreground/70 drop-shadow-[0_1px_1px_rgba(255,255,255,0.6)]"
                  style={{ width: taille * 0.3, height: taille * 0.3 }}
                  strokeWidth={2.6}
                  aria-hidden="true"
                />
              ) : null}
            </span>
            <span
              className={cn(
                'font-heading text-[11px] font-extrabold',
                etat === 'courante'
                  ? 'text-foreground'
                  : etat === 'passee'
                    ? 'text-muted-foreground'
                    : 'text-muted-foreground/60',
              )}
            >
              {verrouillee ? '?' : etat === 'courante' ? division.nom : tier.name}
              <span className="sr-only">
                {etat === 'courante'
                  ? ` — ta division, ${division.nom}`
                  : etat === 'passee'
                    ? ' — traversée'
                    : ' — à débloquer'}
              </span>
            </span>
          </li>
        )
      })}
    </ul>
  )
}
