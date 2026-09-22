'use client'

import { useState } from 'react'
import CompteTropheesArene from '@/components/defi/CompteTropheesArene'

const CLE = 'studuel:arene:trophees:apercu'

/**
 * Pose l'ANCIEN état en mémoire avant le premier rendu du compte (l'initialiseur
 * d'état court avant les effets des enfants), puis rend le compte avec le
 * nouveau : la fête se joue à chaque chargement.
 */
export default function ApercuCompte({
  de,
  a,
  topDe,
  topA,
}: {
  de: number
  a: number
  topDe: number | null
  topA: number | null
}) {
  const [pret] = useState(() => {
    try {
      window.localStorage.setItem(CLE, JSON.stringify({ trophees: de, top: topDe }))
    } catch {
      // stockage indisponible : le compte se posera sans fête
    }
    return true
  })
  if (!pret) return null
  return (
    <div className="defi-arena-bg flex min-h-dvh items-start justify-start p-6">
      <div className="flex flex-col gap-4">
        <CompteTropheesArene trophees={a} top={topA} cle={CLE} />
        <p className="max-w-[16rem] text-xs font-semibold text-white/80">
          {de} → {a} trophées
          {topDe !== null || topA !== null
            ? `, Top ${topDe ?? '—'} % → Top ${topA ?? '—'} %`
            : ''}
          . Recharge la page pour rejouer.
        </p>
      </div>
    </div>
  )
}
