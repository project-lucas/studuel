'use client'

import { useCallback, useEffect, useRef } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { sfx } from '@/lib/sounds'

export type RouletteItem = {
  subject: string
  emoji: string
  /**
   * L'illustration de la matière (celle des cartes de Réviser). Prioritaire sur
   * l'emoji : une matière n'a qu'un visage dans l'app, et c'est celui-là.
   */
  image?: string
  /**
   * Fond du médaillon qui porte l'illustration — le pastel de la matière. Les
   * vignettes sont dessinées pour un fond clair : sans lui, sur le violet de
   * l'arène, il n'en reste qu'une tache. Absent = pas de médaillon.
   */
  tint?: string
  /** Pastille facultative sous le nom (le total de trophées, dans l'espace duel). */
  badge?: string
}

/**
 * La roulette de matières : une rangée de crans qui défile (snap-scroll), avec
 * deux chevrons pour la faire tourner cran par cran. Le cran centré est le
 * « sélectionné » — il pilote ce qui s'affiche dessous. On peut aussi taper un
 * cran directement. La sélection suit le scroll (on lit le cran le plus proche
 * du centre), pour un vrai ressenti de roulette.
 *
 * Extraite de `ModesSheet` le jour où l'espace duel a eu besoin de la même :
 * deux copies auraient fini par ne plus proposer les mêmes matières, ni le même
 * geste.
 */
export default function SubjectRoulette({
  items,
  activeIndex,
  onSelect,
}: {
  items: readonly RouletteItem[]
  activeIndex: number
  onSelect: (index: number) => void
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([])
  const rafRef = useRef<number | null>(null)
  // Vrai quand c'est NOTRE scroll qui vient de changer la sélection : on ne se
  // recentre pas dessus, sinon le glissement du doigt se bat contre un
  // `scrollTo` lissé et la piste tremble.
  const selfScroll = useRef(false)

  // Centre le cran d'index donné dans la piste (scroll horizontal contrôlé,
  // jamais scrollIntoView qui ferait aussi bouger la page verticalement).
  const centerCard = useCallback(
    (index: number, behavior: ScrollBehavior = 'smooth') => {
      const track = trackRef.current
      const card = cardRefs.current[index]
      if (!track || !card) return
      const left = card.offsetLeft - (track.clientWidth - card.clientWidth) / 2
      // `scrollTo` manque aux vieux WebView (et à jsdom) : on se rabat alors
      // sur l'affectation directe, qui recentre sans l'animation.
      if (typeof track.scrollTo === 'function') track.scrollTo({ left, behavior })
      else track.scrollLeft = left
    },
    [],
  )

  // Au scroll, on élit le cran dont le centre est le plus proche du centre de
  // la piste et on le sélectionne (throttlé à un rAF).
  const onScroll = useCallback(() => {
    if (rafRef.current !== null) return
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null
      const track = trackRef.current
      if (!track) return
      const mid = track.scrollLeft + track.clientWidth / 2
      let best = 0
      let bestDist = Infinity
      cardRefs.current.forEach((card, i) => {
        if (!card) return
        const center = card.offsetLeft + card.clientWidth / 2
        const dist = Math.abs(center - mid)
        if (dist < bestDist) {
          bestDist = dist
          best = i
        }
      })
      if (best === activeIndex) return
      selfScroll.current = true
      onSelect(best)
    })
  }, [onSelect, activeIndex])

  // La sélection peut venir d'AILLEURS (la roulette de l'arène, partagée par
  // contexte) : la piste suit alors le choix au lieu de rester sur un cran que
  // plus rien ne désigne.
  useEffect(() => {
    if (selfScroll.current) {
      selfScroll.current = false
      return
    }
    centerCard(activeIndex, 'smooth')
  }, [activeIndex, centerCard])

  // Au montage, le cran actif doit être centré SANS animation : la piste porte
  // un padding de 38 %, un cran non centré s'ouvrirait collé au bord.
  useEffect(() => {
    centerCard(activeIndex, 'auto')
    // eslint-disable-next-line react-hooks/exhaustive-deps -- au montage seulement
  }, [])

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const step = (delta: number) => {
    const next = Math.max(0, Math.min(items.length - 1, activeIndex + delta))
    if (next === activeIndex) return
    sfx.tap()
    onSelect(next)
    centerCard(next)
  }

  return (
    <div className="flex items-center gap-1 px-2">
      <button
        type="button"
        onClick={() => step(-1)}
        disabled={activeIndex === 0}
        aria-label="Matière précédente"
        className="grid size-9 shrink-0 place-items-center rounded-full text-white/70 transition-colors hover:bg-white/10 disabled:opacity-30 active:scale-90"
      >
        <ChevronLeft className="size-5" strokeWidth={2.6} aria-hidden="true" />
      </button>

      <div
        ref={trackRef}
        onScroll={onScroll}
        role="tablist"
        aria-label="Choisis ta matière"
        className="flex flex-1 snap-x snap-mandatory gap-2.5 overflow-x-auto scroll-px-4 px-[38%] py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, i) => {
          const isActive = i === activeIndex
          return (
            <button
              key={item.subject}
              ref={(el) => {
                cardRefs.current[i] = el
              }}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => {
                sfx.tap()
                onSelect(i)
                centerCard(i)
              }}
              className={`flex aspect-square w-[4.75rem] shrink-0 snap-center flex-col items-center justify-center gap-0.5 rounded-2xl border p-1 transition-all ${
                isActive
                  ? 'scale-105 border-highlight bg-highlight/15 shadow-[0_8px_20px_-8px_rgba(0,0,0,0.8)]'
                  : 'scale-90 border-white/10 bg-white/5 opacity-70'
              }`}
            >
              {item.image ? (
                <span
                  className={item.tint ? 'subject-medallion size-9' : undefined}
                  style={item.tint ? { background: item.tint } : undefined}
                  aria-hidden="true"
                >
                  <Image
                    src={item.image}
                    alt=""
                    width={72}
                    height={72}
                    className="size-[26px] shrink-0 object-contain"
                  />
                </span>
              ) : (
                <span className="text-2xl leading-none" aria-hidden="true">
                  {item.emoji}
                </span>
              )}
              <span
                className={`font-heading line-clamp-1 text-[10px] font-extrabold ${
                  isActive ? 'text-white' : 'text-white/70'
                }`}
              >
                {item.subject}
              </span>
              {item.badge ? (
                <span
                  className={`font-mono text-[9px] leading-none font-bold tabular-nums ${
                    isActive ? 'text-highlight' : 'text-white/50'
                  }`}
                >
                  {item.badge}
                </span>
              ) : null}
            </button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={() => step(1)}
        disabled={activeIndex === items.length - 1}
        aria-label="Matière suivante"
        className="grid size-9 shrink-0 place-items-center rounded-full text-white/70 transition-colors hover:bg-white/10 disabled:opacity-30 active:scale-90"
      >
        <ChevronRight className="size-5" strokeWidth={2.6} aria-hidden="true" />
      </button>
    </div>
  )
}
