'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FeteNiveauScene } from '@/components/niveau/FeteNiveau'
import { walletLevelInfo, xpForLevel } from '@/lib/wallet'

/** La fête de niveau rejouable (voir page.tsx). */
export default function ApercuNiveau({
  de,
  a,
  part,
  ouverts,
}: {
  de: number
  a: number
  part: number
  ouverts: number[]
}) {
  const [tour, setTour] = useState(0)
  const [ouverte, setOuverte] = useState(true)
  const plancher = xpForLevel(a)
  const prochain = xpForLevel(a + 1)
  const actuel = Math.round(plancher + part * (prochain - plancher))
  const titre = walletLevelInfo(actuel).title

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-3 p-6">
      <p className="text-sm text-muted-foreground">
        Niveau {de} → {a} · {titre}
      </p>
      <Button
        onClick={() => {
          setTour((t) => t + 1)
          setOuverte(true)
        }}
      >
        Rejouer la fête
      </Button>
      {ouverte ? (
        <FeteNiveauScene
          key={tour}
          level={a}
          depuis={de}
          levelTitle={titre}
          paliersOuverts={ouverts}
          xp={{ actuel, plancher, prochain }}
          onFermer={() => setOuverte(false)}
        />
      ) : null}
    </div>
  )
}
