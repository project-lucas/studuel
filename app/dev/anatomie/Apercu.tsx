'use client'

import { useState } from 'react'
import { HeartPulse } from 'lucide-react'
import ModeStage from '@/components/defi/ModeStage'
import AnatomyBoard, { AnatomyCorrection } from '@/components/jeux/AnatomyBoard'
import {
  ORGANS,
  ZONES,
  organsForPalier,
  type Organ,
  type ZonePlanche,
} from '@/lib/jeux/anatomie'
import { palierTitle, type PalierLevel } from '@/lib/jeux/paliers'
import { cn } from '@/lib/utils'

/** La planche jouable à vide : on choisit l'organe, on touche, on voit la correction. */
export default function ApercuPlanche({
  palier,
  cible,
  touche,
  theme,
  scene,
}: {
  palier: PalierLevel
  cible: string | null
  touche: string | null
  theme: string
  scene: string | null
}) {
  const organes = organsForPalier(palier)
  const premier = ORGANS.find((o) => o.id === cible) ?? organes[0]
  const [target, setTarget] = useState<Organ>(premier)
  const [picked, setPicked] = useState<ZonePlanche | null>(
    () => ZONES.find((z) => z.id === touche) ?? null,
  )
  const [revealed, setRevealed] = useState(cible !== null)

  const choisir = (organ: Organ) => {
    setTarget(organ)
    setPicked(null)
    setRevealed(false)
  }

  return (
    <ModeStage
      title="Anatomie express"
      Icon={HeartPulse}
      theme={theme}
      scene={scene}
      onExit={() => window.history.back()}
      headerRight={
        <span className="shrink-0 rounded-full bg-[color:var(--jeu-accent)]/12 px-2.5 py-1 text-[11px] font-bold text-[color:var(--jeu-accent)]">
          {palierTitle(palier)}
        </span>
      }
    >
      <div className="pt-1 pb-6">
        <div className="mb-3 flex flex-wrap gap-1.5">
          {organes.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => choisir(o)}
              className={cn(
                'rounded-full px-2.5 py-1 text-xs font-bold ring-1 transition-colors',
                o.id === target.id
                  ? 'bg-primary text-primary-foreground ring-primary'
                  : 'bg-card text-foreground ring-border',
              )}
            >
              {o.name}
            </button>
          ))}
        </div>

        <h2 className="font-heading mb-3 text-2xl font-extrabold text-balance">
          Où se trouve {target.name} ?
        </h2>

        <AnatomyBoard
          target={target}
          picked={picked}
          revealed={revealed}
          onPick={(zone) => {
            if (!zone) return
            setPicked(zone)
            setRevealed(true)
          }}
        />

        {revealed ? <AnatomyCorrection target={target} picked={picked} /> : null}

        {revealed ? (
          <button
            type="button"
            onClick={() => choisir(target)}
            className="bg-primary text-primary-foreground mx-auto mt-3 block rounded-full px-4 py-2 text-sm font-bold"
          >
            Rejouer
          </button>
        ) : null}
      </div>
    </ModeStage>
  )
}
