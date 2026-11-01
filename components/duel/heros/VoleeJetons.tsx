'use client'

import { useEffect, useRef } from 'react'
import TropheeIcone from '@/components/ui/TropheeIcone'
import XpIcon from '@/components/ui/XpIcon'
import { volVague } from '@/lib/gains'
import { sfx } from '@/lib/sounds'

// LA VAGUE DE LA FIN DU DUEL DES HÉROS (29/10/2026) — le geste des quêtes
// (RecompensesProvider : la gerbe qui jaillit, flotte, puis rentre en file en
// tintant), mais vers les DEUX BARRES de l'écran de fin et non vers le
// bandeau : la démo ne verse rien, elle ne touche donc pas au compteur de
// l'élève. Chaque jeton qui atterrit appelle `onArrivee` avec sa part : c'est
// là que la barre monte.

export type Point = { x: number; y: number }

export type Vague = {
  unite: 'xp' | 'trophee'
  depart: Point
  arrivee: Point
  parts: readonly number[]
}

export default function VoleeJetons({
  vague,
  onArrivee,
}: {
  vague: Vague
  onArrivee: (part: number) => void
}) {
  return (
    <div className="pointer-events-none fixed inset-0 z-[85]" aria-hidden="true">
      {vague.parts.map((part, i) => (
        <Jeton
          key={i}
          rang={i}
          n={vague.parts.length}
          unite={vague.unite}
          depart={vague.depart}
          arrivee={vague.arrivee}
          onFin={() => onArrivee(part)}
        />
      ))}
    </div>
  )
}

function Jeton({
  rang,
  n,
  unite,
  depart,
  arrivee,
  onFin,
}: {
  rang: number
  n: number
  unite: Vague['unite']
  depart: Point
  arrivee: Point
  onFin: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const finRef = useRef(onFin)
  useEffect(() => {
    finRef.current = onFin
  })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const v = volVague(rang, n)
    const projete = { x: depart.x + v.sautX, y: depart.y + v.sautY }
    const sommet = { x: (projete.x + arrivee.x) / 2, y: (projete.y + arrivee.y) / 2 - v.arc }
    const pose = (p: Point, echelle: number) =>
      `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%) scale(${echelle})`

    let annule = false
    const atterrir = () => {
      if (annule) return
      sfx.perle(rang)
      finRef.current()
    }

    // Sans Web Animations (ou en mouvement réduit), on garde le RÉSULTAT :
    // la barre monte à l'heure dite, sans trajet.
    const reduit =
      typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (typeof el.animate !== 'function' || reduit) {
      const t = window.setTimeout(atterrir, v.duree)
      return () => {
        annule = true
        window.clearTimeout(t)
      }
    }

    const [jailli, decroche, auSommet] = v.reperes
    const animation = el.animate(
      [
        { transform: pose(depart, 0.2), opacity: 0, offset: 0, easing: 'cubic-bezier(0.2, 0.9, 0.3, 1.25)' },
        { transform: pose(projete, 1.2), opacity: 1, offset: jailli, easing: 'ease-in-out' },
        { transform: pose({ x: projete.x, y: projete.y - 6 }, 1.05), opacity: 1, offset: decroche, easing: 'cubic-bezier(0.5, 0, 0.75, 0.3)' },
        { transform: pose(sommet, 1), opacity: 1, offset: auSommet, easing: 'cubic-bezier(0.3, 0.2, 0.6, 1)' },
        { transform: pose(arrivee, 0.5), opacity: 1, offset: 1 },
      ],
      { duration: v.duree, fill: 'both' },
    )
    animation.addEventListener('finish', atterrir)
    return () => {
      annule = true
      animation.removeEventListener('finish', atterrir)
      animation.cancel()
    }
    // Un jeton est immuable : son trajet se pose une fois, au montage.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={ref} className="absolute top-0 left-0 will-change-transform" style={{ opacity: 0 }}>
      {unite === 'xp' ? (
        <XpIcon className="size-8 drop-shadow-[0_3px_4px_rgba(40,20,80,0.45)]" />
      ) : (
        <TropheeIcone className="size-8 drop-shadow-[0_3px_4px_rgba(40,20,80,0.45)]" />
      )}
    </div>
  )
}
