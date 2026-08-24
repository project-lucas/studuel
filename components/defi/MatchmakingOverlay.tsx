'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import { sfx } from '@/lib/sounds'
import ArenaBackdrop from '@/components/ArenaBackdrop'
import { FLANK_CLASS } from '@/components/defi/ArenaActionBar'
import {
  annonceRecherche,
  LOUPE_BOUCLE_S,
  RECHERCHE_MS,
  SEUIL_TROUVE,
  trajectoireLoupe,
} from '@/lib/defi/recherche-adversaire'

/**
 * L'ÉCRAN DE RECHERCHE D'ADVERSAIRE — le rideau entre le tap sur DUEL et le duel.
 *
 * TOUT LE RESTE S'EFFACE. C'est le point : le HUD de l'arène (niveau, monnaies,
 * missions, roulette de matières, barre d'onglets) disparaît d'un coup, et il ne
 * reste que la loupe, le nom de la matière et « Annuler ». Un écran d'appariement
 * qui laisse le menu visible derrière lui n'est pas un rideau, c'est une modale —
 * et une modale ne fait pas monter la tension.
 *
 * Monté en PORTAIL sur `<body>` : l'arène est un empilement de plaques et de
 * voiles, et un overlay ancré dans cet arbre finirait sous l'un d'eux au
 * premier ajout. Le portail le met hors d'atteinte de tout contexte
 * d'empilement — même raison que la modale de sortie et le rideau des boss.
 *
 * LA NAVIGATION PART TOUT DE SUITE, l'animation n'attend pas la page : Next
 * charge la route du duel pendant que la loupe tourne. Sans ce recouvrement,
 * les deux secondes de mise en scène s'AJOUTERAIENT au temps de chargement réel
 * au lieu de le couvrir.
 */
export default function MatchmakingOverlay({
  href,
  subject,
  onCancel,
}: {
  /** La route du duel — le PvP de la matière choisie. */
  href: string
  /**
   * La matière, pour l'étiquette lue à voix haute. Le nom de ce qui se joue
   * (« Duel classé ») était aussi passé ici, pour une sous-ligne qui n'existe
   * plus : le rideau ne porte que l'annonce, et le bouton qui l'a ouvert vient
   * de dire tout le reste.
   */
  subject: string
  onCancel: () => void
}) {
  const router = useRouter()
  const reduce = useReducedMotion()
  const [progres, setProgres] = useState(0)
  // La navigation ne doit partir qu'UNE fois, et jamais après une annulation.
  const parti = useRef(false)
  const annule = useRef(false)

  useEffect(() => {
    // Le préchargement démarre à l'ouverture du rideau : c'est lui qui rend
    // l'attente utile plutôt que décorative.
    router.prefetch(href)
    const debut = performance.now()
    let raf = 0

    const tick = () => {
      if (annule.current) return
      const p = Math.min(1, (performance.now() - debut) / RECHERCHE_MS)
      setProgres(p)
      if (p >= 1) {
        if (!parti.current) {
          parti.current = true
          sfx.battle()
          router.push(href)
        }
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      annule.current = true
      cancelAnimationFrame(raf)
    }
  }, [href, router])

  if (typeof document === 'undefined') return null

  const trouve = progres >= SEUIL_TROUVE
  // Les images-clés du 8, calculées une fois : elles ne dépendent de rien.
  const balayage = trajectoireLoupe()

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Recherche d’un adversaire en ${subject}`}
      // LE RIDEAU REJOUE LE DÉCOR — il ne le laisse pas transparaître.
      //
      // Deux tentatives ratées avant celle-ci, et elles se corrigent l'une
      // l'autre : d'abord un aplat violet opaque (`defi-arena-bg`, qui n'est
      // que le REPLI du fond) — il cachait tout, académie comprise, et il ne
      // restait qu'un mur. Puis un rideau TRANSPARENT pour laisser voir la
      // scène — mais l'illustration vit sur `<body>` en `-z-10`, donc SOUS le
      // HUD : ce qui est assez transparent pour montrer le décor l'est aussi
      // pour montrer le niveau, les monnaies, la barre d'onglets. Un rideau
      // transparent ne cache rien, il bloque juste les taps.
      //
      // La seule façon de masquer le HUD tout en gardant la scène est donc de
      // REPEINDRE la scène au-dessus de lui. `ArenaBackdrop` est justement le
      // composant qui choisit l'illustration de l'heure : on le remonte ici, à
      // l'identique, et le rideau devient l'arène débarrassée de son interface.
      //
      // LA COQUILLE EST CELLE DE LA PAGE, au pixel : mêmes marges latérales
      // (`px-3`), même réserve basse (la barre d'onglets et l'encoche). C'est
      // ce qui permet à la rangée du bas de retomber exactement sur la barre
      // d'action qu'elle recouvre — et donc au bouton « Annuler » de prendre la
      // place du bouton DUEL, sans qu'aucun des deux ne connaisse l'autre.
      className="fixed inset-0 z-[200] flex h-dvh flex-col pt-14 pb-[calc(4.75rem+env(safe-area-inset-bottom))] text-white md:pt-4 md:pb-4"
    >
      {/* La scène, repeinte par-dessus le HUD. `defi-arena-bg` sert de socle
          opaque le temps que l'illustration se décode — sans lui, le HUD
          réapparaîtrait une fraction de seconde à travers le rideau. */}
      <div
        aria-hidden="true"
        className="defi-arena-bg absolute inset-0 overflow-hidden"
      >
        {/* `anime={false}` : l'illustration seule. Le ciel et les
            particules tournent déjà sous la page, les redoubler pendant le
            chargement du duel coûterait des images par seconde pour rien. */}
        <ArenaBackdrop anime={false} />
      </div>

      {/* Voile de LECTURE, pas de masquage : sombre en haut et en bas, où se
          posent l'annonce et « Annuler », transparent au milieu pour ne pas
          ternir la mascotte. Sans lui, le texte blanc passe sur les torches. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/75"
      />
      {/* L'ANNONCE, en haut : la bannière, sa loupe posée dessus, le délai
          dessous. La plaque emprunte la grammaire des plaques de l'arène —
          bordure d'encre, liseré clair, tranche en bas — et le titre est CERNÉ
          plutôt que coloré : sur une illustration, seul un contour tient le
          contraste au-dessus d'une torche comme au-dessus du ciel.
          Marge à gauche : la loupe déborde de la plaque, le texte doit lui
          laisser la place au lieu de passer dessous. */}
      <div className="relative mx-auto flex w-full max-w-sm flex-col items-center px-3 pl-9">
        <div className="recherche-plaque relative w-full px-5 py-4 pl-20">
          {/* LA LOUPE. Elle ne tourne JAMAIS : son orientation est celle du
              dessin, manche en bas à gauche, et c'est l'objet ENTIER qui se
              déplace. Une rotation, même autour de la lentille, se lit comme un
              manche qui orbite autour du verre — un objet qu'on visse, pas un
              regard qui cherche. Le déplacement, lui, est le geste de quelqu'un
              qui promène sa loupe sur une page. */}
          <motion.img
            src="/images/defi/loupe.webp"
            alt=""
            aria-hidden="true"
            draggable={false}
            width={256}
            height={256}
            className="recherche-loupe absolute top-1/2 -left-7 z-10 size-[84px] -translate-y-1/2"
            // ELLE ORBITE, elle ne visse pas. Un petit cercle autour de sa
            // place (cf. `trajectoireLoupe`), l'orientation du dessin restant
            // fixe : le geste de quelqu'un qui promène sa loupe. Une rotation
            // sur l'axe disait « je visse », pas « je cherche ».
            //
            // Elle se pose au centre quand l'adversaire est trouvé : une
            // animation qui continue après l'annonce dit le contraire du texte.
            animate={reduce || trouve ? { x: 0, y: 0 } : balayage}
            transition={
              reduce || trouve
                ? { duration: 0.25, ease: 'easeOut' }
                : {
                    duration: LOUPE_BOUCLE_S,
                    // LINÉAIRE, et c'est délibéré. `easeInOut` s'applique entre
                    // CHAQUE paire d'images-clés : l'objet ralentissait puis
                    // repartait à chaque sommet, ce qui se voyait comme une
                    // série de micro-arrêts. Les 48 échantillons suffisent à la
                    // fluidité — et sur un cercle, la vitesse constante EST le
                    // mouvement juste : il n'y a aucune accélération à imiter.
                    ease: 'linear',
                    repeat: Infinity,
                  }
            }
          />
          <span
            className="recherche-titre font-heading block"
            aria-live="polite"
          >
            {annonceRecherche(progres)}
            {/* Les trois points, RÉSERVÉS EN PLACE et allumés l'un après
                l'autre par CSS. `aria-hidden` : un lecteur d'écran annoncerait
                « point point point » à chaque tour de l'`aria-live` ci-dessus,
                alors qu'ils ne portent aucune information — l'attente est déjà
                dite par la phrase. */}
            {trouve ? null : (
              <span className="recherche-points" aria-hidden="true">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </span>
            )}
          </span>
        </div>
      </div>

      {/* ANNULER PREND LA PLACE DE DUEL, exactement.
          Même rangée, même hauteur de 92 px, mêmes flancs — invisibles ici,
          mais présents : ce sont eux qui donnent au centre sa largeur. La classe
          des flancs vient d'`ArenaActionBar`, qui l'exporte précisément pour que
          personne ne la réécrive et ne la laisse dériver.

          Pourquoi cette place et pas une autre : le pouce vient de frapper là.
          Un bouton d'annulation posé au milieu de l'écran, dans une autre forme,
          l'obligerait à chercher — alors que c'est le geste qu'on veut rendre le
          plus facile possible à quelqu'un qui a tapé par erreur. */}
      {/* LA COLONNE DE CONTENU, REJOUÉE À L'IDENTIQUE.
          Le rideau est en `fixed inset-0` : il occupe tout l'écran, alors que la
          barre d'action qu'il recouvre vit dans la colonne de lecture de l'app.
          Mesuré à 1275 px de large : « Annuler » sortait 379 px plus large que
          DUEL et 317 px trop à gauche — l'écart exact de la barre latérale et
          de la colonne.

          Les trois cales ci-dessous reprennent, de l'extérieur vers
          l'intérieur, la géométrie d'`app/layout.tsx` puis celle de la page :
            · `md:pl-64` — la barre latérale (`w-64`), absente sous md ;
            · `md:px-8`  — les marges de <main> (`px-4 md:px-8`), le `px-4` du
              mobile étant déjà annulé par le `-mx-4` de la coquille de /defi ;
            · `max-w-4xl mx-auto` — la colonne de lecture ;
            · `px-3` puis `px-1` — la coquille de /defi, puis la barre d'action.

          C'est un COUPLAGE, et il faut le savoir : ces quatre valeurs sont
          écrites dans `app/layout.tsx` et `app/defi/page.tsx`. Les changer là-bas
          sans venir ici décalerait le bouton. Le prix à payer pour que
          l'annulation retombe exactement sous le pouce qui vient de frapper. */}
      <div className="relative mt-auto md:pl-64">
        <div className="md:px-8">
          <div className="mx-auto w-full max-w-4xl px-3">
            <div className="px-1">
              <div className="flex h-[92px] items-stretch gap-3">
                <span className={FLANK_CLASS} aria-hidden="true" />
                <button
                  type="button"
                  aria-label="Annuler"
                  onClick={() => {
                    annule.current = true
                    sfx.back()
                    onCancel()
                  }}
                  className="arena-plate arena-plate--rouge arena-plate--press relative isolate flex min-w-0 flex-1 cursor-pointer flex-col items-center justify-center overflow-hidden px-1 focus-visible:ring-4 focus-visible:ring-white/70 focus-visible:outline-none"
                >
                  <span className="combat-word combat-word--rouge font-heading">
                    ANNULER
                  </span>
                </button>
                <span className={FLANK_CLASS} aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
