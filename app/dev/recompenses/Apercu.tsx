'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import XpIcon from '@/components/ui/XpIcon'
import { CristalIcon } from '@/components/ui/MonnaieIcon'
import { useRecompenses } from '@/components/recompenses/RecompensesProvider'
import { ecouterGains } from '@/lib/hud-gains'
import type { Gain } from '@/lib/gains'

/** Le ruban de récompenses rejouable (voir page.tsx). */
export default function ApercuRecompenses({
  gains,
  auto,
  sousTitre,
}: {
  gains: Gain[]
  auto: boolean
  sousTitre: string | null
}) {
  const { ouvrirRuban } = useRecompenses()
  const options = sousTitre ? { sousTitre } : undefined

  useEffect(() => {
    if (!auto) return
    const t = setTimeout(() => ouvrirRuban(gains, options), 400)
    return () => clearTimeout(t)
    // Une seule ouverture, à l'arrivée.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex min-h-svh flex-col items-center gap-4 p-4 pt-6">
      <BandeauDemo />
      <p className="text-sm text-muted-foreground">
        {gains.map((g) => `${g.montant} ${g.unite}`).join(' · ')}
      </p>
      <Button size="xl" onClick={() => ouvrirRuban(gains, options)}>
        Ouvrir le ruban
      </Button>
    </div>
  )
}

/**
 * Un faux bandeau, à la place du vrai (absent sans compte) : la barre de
 * niveau et le compteur de gemmes sont les CIBLES de la vague
 * (`data-hud-cible`), et ils montent jeton après jeton comme les vrais.
 */
function BandeauDemo() {
  const [xp, setXp] = useState(120)
  const [gemmes, setGemmes] = useState(40)
  useEffect(
    () =>
      ecouterGains((g) => {
        if (g.unite === 'xp') setXp((v) => v + g.montant)
        if (g.unite === 'gemme') setGemmes((v) => v + g.montant)
      }),
    [],
  )
  const part = (xp % 400) / 400
  return (
    <div className="carte flex w-full max-w-md items-center gap-2 px-3 py-2">
      <span className="font-heading text-sm font-extrabold">Niveau {Math.floor(xp / 400) + 7}</span>
      <XpIcon className="size-4" />
      <span data-hud-cible="xp" className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-secondary">
        <span
          className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-primary transition-transform duration-200"
          style={{ transform: `scaleX(${part})` }}
        />
      </span>
      <span className="font-heading text-xs font-extrabold tabular-nums">{xp} XP</span>
      <span data-hud-cible="gemme" className="font-heading flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs font-extrabold tabular-nums">
        <CristalIcon className="size-4" />
        {gemmes}
      </span>
    </div>
  )
}
