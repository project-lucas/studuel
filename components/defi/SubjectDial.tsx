'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { ChevronDown, ChevronUp, Lock } from 'lucide-react'
import { sfx } from '@/lib/sounds'
import { useDuelSubject } from '@/components/defi/DuelSubjectProvider'

/** Amplitude minimale, en pixels, pour qu'un glissement compte comme un cran. */
const SWIPE_THRESHOLD = 22

/**
 * Hauteur d'un cran du tambour, et diamètre du médaillon, en pixels.
 *
 * En pixels et non en `rem` : le tambour se positionne par calcul
 * (`translateY(-index × CRAN)`), et une unité relative obligerait à mesurer le
 * DOM pour connaître le pas. Le CRAN est à peine plus haut que le médaillon —
 * c'est cet écart de 2 px qui laisse dépasser un croissant des matières
 * voisines en haut et en bas, et qui fait lire l'objet comme une roulette
 * plutôt que comme une image qui change.
 */
const ITEM = 44
const MEDALLION = 34

/**
 * LA ROULETTE DE MATIÈRES — le flanc droit de la rangée de combat.
 *
 * Elle prend la place du bouton « Route », parti dans le HUD. Ce n'est pas un
 * échange à somme nulle : la Route était un écran de LECTURE coincé contre le
 * seul bouton d'ACTION de l'arène, alors que la question qu'on se pose devant
 * COMBAT est « sur quoi ? ». La réponse est maintenant collée au bouton, et
 * elle tourne.
 *
 * ELLE NE PORTE AUCUN TEXTE. Le nom de la matière est écrit sous COMBAT, à
 * 8 px de là : le répéter aurait mangé la moitié de la tuile pour ne rien
 * apprendre. Ce que la roulette montre, c'est le VISAGE de la matière — sa
 * vignette de Réviser sur son médaillon pastel, une couleur par matière. On
 * reconnaît sa matière avant de lire son nom, et c'est plus rapide.
 *
 * POURQUOI DU CSS ET NON FRAMER-MOTION, alors que tout le HUD s'anime avec.
 * Une animation JS ne retire son nœud qu'à la FIN de sa course : premier essai,
 * quelques crans enchaînés pendant que la boucle d'images était suspendue
 * (onglet en arrière-plan) ont laissé trois matières empilées dans le bouton, à
 * des opacités gelées. Une transition CSS est déclarative — l'état visé EST le
 * style, donc une transition interrompue ou étranglée finit quand même au bon
 * endroit. Sur un objet dont dépend la destination du CTA, c'est non
 * négociable.
 *
 * Trois entrées vers le même geste : les chevrons (précis, et les seuls que
 * connaisse un clavier), le glissement vertical (le geste naturel d'une
 * roulette) et le tap sur le cran (qui avance d'un). Toutes bouclent : après la
 * dernière matière revient la première — le tambour rembobine alors d'un trait,
 * ce qui se lit comme un tour de roulette et non comme un bug.
 */
export default function SubjectDial() {
  const { board, index, active, step } = useDuelSubject()
  // Un glissement se termine aussi par un `click` : sans ce drapeau, un balayage
  // avancerait de deux crans (le sien, puis celui du tap).
  const swiped = useRef(false)
  const startY = useRef<number | null>(null)

  if (board.length === 0 || !active) return null

  const move = (delta: number) => {
    sfx.tap()
    step(delta)
  }

  return (
    <div
      data-no-swipe
      role="group"
      aria-label="Matière du duel"
      className="arena-flank relative flex w-[4.75rem] shrink-0 flex-col items-center rounded-2xl py-0.5"
      // La hauteur minimale est CALCULÉE, pas choisie : il faut un cran plein
      // (ITEM), puis DEUX FOIS de quoi laisser dépasser un croissant des
      // matières voisines (28 px), puis les deux chevrons (24) et le liseré
      // (8). Réglée à vue, la fenêtre retombait à la hauteur exacte d'un cran
      // — et la roulette redevenait une image qui change.
      style={{ minHeight: ITEM + 60 }}
    >
      {/* Le cadenas du classé, en pastille d'angle : le tambour ne porte que
          des visages, et un cadenas dessus aurait masqué celui de la matière. */}
      {active.unlocked ? null : (
        <span
          className="absolute top-1 right-1 z-10 grid size-4 place-items-center rounded-full bg-black/60 ring-1 ring-white/20"
          aria-hidden="true"
        >
          <Lock className="size-2.5 text-white/80" strokeWidth={3} />
        </span>
      )}

      <DialChevron direction={-1} onStep={move} />

      <button
        type="button"
        onClick={() => {
          if (swiped.current) {
            swiped.current = false
            return
          }
          move(1)
        }}
        onTouchStart={(e) => {
          startY.current = e.touches[0]?.clientY ?? null
          swiped.current = false
        }}
        onTouchEnd={(e) => {
          const from = startY.current
          startY.current = null
          if (from === null) return
          const dy = (e.changedTouches[0]?.clientY ?? from) - from
          if (Math.abs(dy) < SWIPE_THRESHOLD) return
          swiped.current = true
          // Glisser vers le HAUT fait monter la matière suivante.
          move(dy < 0 ? 1 : -1)
        }}
        aria-label={`Matière du duel : ${active.subject}, ${active.trophies} trophées${
          active.unlocked ? '' : ' — pas encore ouverte au classé'
        }. Appuie pour passer à la suivante.`}
        title={`${active.subject} — ${active.rank.label}`}
        className="relative w-full min-h-0 flex-1 cursor-pointer touch-none rounded-lg focus-visible:ring-4 focus-visible:ring-highlight/60 focus-visible:outline-none"
      >
        {/* Le voile de fondu, FIXE aux bords de la fenêtre — il ne peut donc pas
            vivre sur le tambour, qui se déplace. Sans lui, les matières
            voisines seraient tranchées net : un tambour a une profondeur. */}
        <span
          aria-hidden="true"
          className="absolute inset-0 overflow-hidden"
          style={{
            maskImage:
              'linear-gradient(to bottom, transparent 0%, #000 26%, #000 74%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, transparent 0%, #000 26%, #000 74%, transparent 100%)',
          }}
        >
          {/* Le tambour : toutes les matières empilées. Il se cale par le HAUT
              de la fenêtre (`top-1/2`) puis remonte d'un demi-cran plus autant
              de crans que d'index — ce qui centre la matière courante quelle
              que soit la hauteur réelle de la fenêtre. */}
          <span
            className="absolute inset-x-0 top-1/2 flex flex-col transition-transform duration-[380ms] ease-[cubic-bezier(0.22,1.15,0.36,1)] motion-reduce:transition-none"
            style={{ transform: `translateY(${-(index * ITEM) - ITEM / 2}px)` }}
          >
            {board.map((entry, i) => {
              const isActive = i === index
              return (
                <span
                  key={entry.slug}
                  className="flex shrink-0 items-center justify-center"
                  style={{ height: ITEM }}
                >
                  <span
                    className="subject-medallion relative transition-[transform,opacity] duration-300 ease-out motion-reduce:transition-none"
                    style={{
                      width: MEDALLION,
                      height: MEDALLION,
                      background: entry.pastel,
                      // Les voisines reculent : plus petites et plus pâles.
                      // C'est ce dégradé d'attention, et non la seule
                      // translation, qui dit laquelle est choisie.
                      transform: isActive ? 'scale(1)' : 'scale(0.92)',
                      opacity: isActive ? 1 : 0.4,
                      // La courante passe DEVANT : son liseré déborde d'un
                      // cheveu sur les crans voisins, qui sont peints après
                      // elle dans l'ordre du DOM.
                      zIndex: isActive ? 1 : 0,
                    }}
                  >
                    {entry.vignette ? (
                      <Image
                        src={entry.vignette}
                        alt=""
                        width={72}
                        height={72}
                        // CHARGÉE D'EMBLÉE, sans attendre d'être à l'écran :
                        // six des sept matières sont hors de la fenêtre du
                        // tambour, donc invisibles pour le chargement paresseux
                        // — la première rotation aurait montré un médaillon
                        // vide le temps du téléchargement. Sept vignettes de
                        // 96 px, c'est le prix d'une icône.
                        loading="eager"
                        className="size-[25px] object-contain"
                      />
                    ) : (
                      <span className="text-lg leading-none">{entry.emoji}</span>
                    )}
                  </span>
                </span>
              )
            })}
          </span>
        </span>
      </button>

      <DialChevron direction={1} onStep={move} />

      {/* Le changement de cran est une information, pas seulement une image :
          sans région vivante, un lecteur d'écran n'apprendrait le nouveau choix
          qu'en revenant sur le bouton. */}
      <span className="sr-only" aria-live="polite">
        {active.subject}
      </span>
    </div>
  )
}

/** Un chevron de la roulette : le seul geste qu'un clavier sache faire ici. */
function DialChevron({
  direction,
  onStep,
}: {
  direction: 1 | -1
  onStep: (delta: number) => void
}) {
  const Icon = direction > 0 ? ChevronDown : ChevronUp
  return (
    <button
      type="button"
      onClick={() => onStep(direction)}
      aria-label={direction > 0 ? 'Matière suivante' : 'Matière précédente'}
      className="grid h-3 w-full shrink-0 cursor-pointer place-items-center rounded text-white/45 transition-colors hover:text-highlight focus-visible:ring-2 focus-visible:ring-highlight/60 focus-visible:outline-none active:scale-90"
    >
      <Icon className="size-3.5" strokeWidth={3} aria-hidden="true" />
    </button>
  )
}
