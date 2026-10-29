'use client'

import { useCallback, useEffect, useState } from 'react'
import { preload } from 'react-dom'
import Image from 'next/image'
import type { CinematiqueVictoire as Cinematique, Heros } from '@/lib/heros/catalogue'
import s from './CinematiqueVictoire.module.css'

// LA CINÉMATIQUE DE VICTOIRE (29/10/2026) — chaque héros fête son K.O. à sa
// façon ; d'autres cinématiques s'achètent (`prixGemmes`), jamais des points.
//
// Des tableaux peints en plein écran, enchaînés en fondu, chacun animé d'un
// mouvement de caméra lent (Ken Burns) ; sur le dernier, « Victoire ! » tombe
// comme un tampon, la devise de la cinématique dessous. Aucune vidéo : ≈ 100 Ko
// par tableau. Un tap passe au tableau suivant, « Passer » va droit au bilan,
// et le dernier tableau rend la main tout seul.

/** Le temps d'un tableau avant le suivant. */
export const MS_TABLEAU = 1500
/** Le dernier tableau reste à l'écran, le titre posé, avant de rendre la main. */
export const MS_FINAL = 2600

const MOUVEMENTS = ['avance', 'droite', 'recule'] as const

export function PrechargeVictoire({ victoire }: { victoire: Cinematique }) {
  for (const t of victoire.tableaux) preload(t.image, { as: 'image', fetchPriority: 'low' })
  return null
}

export default function CinematiqueVictoire({
  heros,
  victoire,
  onFin,
}: {
  heros: Heros
  victoire: Cinematique
  onFin: () => void
}) {
  const [index, setIndex] = useState(0)
  const dernier = victoire.tableaux.length - 1
  const estDernier = index === dernier
  for (const t of victoire.tableaux) preload(t.image, { as: 'image' })

  const suivant = useCallback(() => setIndex((i) => Math.min(i + 1, dernier)), [dernier])

  useEffect(() => {
    const t = window.setTimeout(estDernier ? onFin : suivant, estDernier ? MS_FINAL : MS_TABLEAU)
    return () => window.clearTimeout(t)
  }, [estDernier, index, onFin, suivant])

  const visibles = index === 0 ? [0] : [index - 1, index]

  return (
    <div className={s.scene} role="dialog" aria-modal="true" aria-label={`Victoire — ${victoire.nom}`}>
      {visibles.map((i) => (
        <div
          key={i}
          className={s.tableau}
          data-mouvement={MOUVEMENTS[i % MOUVEMENTS.length]}
          style={{ zIndex: i === index ? 1 : 0 }}
        >
          <Image
            src={victoire.tableaux[i].image}
            alt={victoire.tableaux[i].alt}
            fill
            priority
            unoptimized
            sizes="100vw"
            draggable={false}
            className={s.image}
          />
        </div>
      ))}

      <div className={s.lueur} aria-hidden="true" />

      <button
        type="button"
        className={s.zone}
        onClick={estDernier ? onFin : suivant}
        aria-label={estDernier ? 'Continuer' : 'Tableau suivant'}
      />

      {estDernier ? (
        <div className={s.titre} key="titre">
          <span className={`${s.victoire} font-heading`}>Victoire !</span>
          <span className={s.devise}>{victoire.devise}</span>
          <span className={s.signature}>
            {heros.nom} · {victoire.nom}
          </span>
        </div>
      ) : null}

      <button type="button" className={s.passer} onClick={onFin}>
        Passer
      </button>
    </div>
  )
}
