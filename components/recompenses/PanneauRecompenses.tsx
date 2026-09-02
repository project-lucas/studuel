'use client'

import { useEffect, useRef } from 'react'
import IconeUnite from '@/components/recompenses/IconeUnite'
import {
  agregerGains,
  definition,
  libelleGain,
  volJeton,
  type Gain,
  type UniteGain,
} from '@/lib/gains'
import {
  useRecompenses,
  type OriginesParUnite,
} from '@/components/recompenses/RecompensesProvider'
import { cn } from '@/lib/utils'

/**
 * LE PANNEAU DE RÉCOMPENSES — ce que la partie a rapporté, dit une bonne fois.
 *
 * C'est la moitié visible du geste de Clash Royale ; l'autre est le vol
 * (RecompensesProvider). Les deux sont indissociables et c'est pour ça qu'ils
 * sont ici ensemble : les jetons partent DES PASTILLES de ce panneau, pas d'un
 * point arbitraire. L'élève voit donc la chaîne entière — ce que j'ai gagné,
 * d'où ça sort, où ça va, mon solde qui monte.
 *
 * ⚠️ ON N'AFFICHE QUE CE QUI A ÉTÉ VERSÉ. Les montants viennent de la Server
 * Action, qui rend ce que la base a réellement écrit — jamais le barème espéré.
 * Un quiz rejoué ne verse plus d'XP (elle ne se paye qu'une fois, cf.
 * lib/wallet) : le panneau ne s'affiche alors pas du tout, au lieu d'annoncer
 * un « +30 XP » que le solde ne montrerait jamais.
 *
 * Rien à annoncer = rien à l'écran. Un cadre vide intitulé « Récompenses »
 * transformerait chaque rejeu en constat d'échec.
 */
export default function PanneauRecompenses({
  gains,
  titre = 'Récompenses',
  className,
  /**
   * Délai avant le décollage (ms). Le défaut laisse l'écran de fin se poser :
   * des jetons qui partent d'une pastille encore en train d'apparaître volent
   * depuis un point qui a bougé depuis.
   */
  delai = 520,
}: {
  gains: readonly Gain[]
  titre?: string
  className?: string
  delai?: number
}) {
  const propres = agregerGains(gains)
  const { celebrer } = useRecompenses()
  // Une pastille par unité : c'est d'elle que part la volée correspondante.
  const pastilles = useRef(new Map<UniteGain, HTMLElement>())
  // Le vol ne se joue qu'UNE fois. Sans ce verrou, tout re-rendu du parent
  // (un état de bilan qui arrive en retard, très courant sur ces écrans)
  // relancerait la volée — et le compteur monterait deux fois.
  const envole = useRef(false)

  const signature = propres.map((g) => `${g.unite}:${g.montant}`).join('|')

  useEffect(() => {
    if (envole.current || signature.length === 0) return
    envole.current = true

    const t = setTimeout(() => {
      const origines: OriginesParUnite = {}
      for (const [unite, el] of pastilles.current) {
        const r = el.getBoundingClientRect()
        if (r.width <= 0 || r.height <= 0) continue
        origines[unite] = { x: r.left + r.width / 2, y: r.top + r.height / 2 }
      }
      celebrer(
        signature.split('|').map((part) => {
          const [unite, montant] = part.split(':')
          return { unite: unite as UniteGain, montant: Number(montant) }
        }),
        origines,
      )
    }, delai)

    return () => clearTimeout(t)
  }, [signature, delai, celebrer])

  if (propres.length === 0) return null

  return (
    <div
      className={cn(
        'rounded-2xl bg-highlight/15 px-3 py-2.5 ring-1 ring-highlight/25',
        className,
      )}
    >
      <p className="font-heading text-center text-[11px] font-extrabold tracking-wide text-[color-mix(in_oklch,var(--highlight),black_38%)] uppercase">
        {titre}
      </p>

      {/* La phrase que le lecteur d'écran entend. Les pastilles sont muettes
          (`aria-hidden`) : lues une à une, elles donnent « plus cent XP plus
          trente cristaux », sans liaison ni verbe. */}
      <p className="sr-only">
        Tu as gagné {propres.map((g) => libelleGain(g)).join(', ')}.
      </p>

      <ul
        className="mt-1.5 flex flex-wrap items-center justify-center gap-2"
        aria-hidden="true"
      >
        {propres.map((gain, i) => (
          <li
            key={gain.unite}
            ref={(el) => {
              if (el) pastilles.current.set(gain.unite, el)
              else pastilles.current.delete(gain.unite)
            }}
            className="gain-apparait font-heading flex items-center gap-1.5 rounded-full bg-card px-2.5 py-1 text-sm font-extrabold text-foreground shadow-sm ring-1 ring-black/5"
            // Les pastilles se posent dans l'ordre, au rythme exact de la
            // volée qui va en partir : même cadence, donc un seul mouvement.
            style={{ animationDelay: `${volJeton(i, propres.length).retard}ms` }}
          >
            <IconeUnite
              unite={gain.unite}
              className={
                gain.unite === 'xp' ? 'text-primary' : 'text-highlight'
              }
            />
            <span className="tabular-nums">+{gain.montant}</span>
            <span className="text-[11px] font-bold text-muted-foreground">
              {gain.montant > 1
                ? definition(gain.unite).plusieurs
                : definition(gain.unite).un}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
