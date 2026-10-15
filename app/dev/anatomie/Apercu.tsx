'use client'

import { useState } from 'react'
import { HeartPulse } from 'lucide-react'
import ModeStage from '@/components/defi/ModeStage'
import AnatomyBoard, { AnatomyCorrection } from '@/components/jeux/AnatomyBoard'
import { ORGANS, PLANCHE_ORGANES, organsForPalier } from '@/lib/jeux/anatomie'
import { MUSCLES, PLANCHES_MUSCLES, musclesForPalier } from '@/lib/jeux/muscles'
import { questionPour, type Cible as Organ, type Planche, type ZonePlanche } from '@/lib/jeux/planche'
import { palierTitle, type PalierLevel } from '@/lib/jeux/paliers'
import { cn } from '@/lib/utils'

/** Les deux planches à désigner : les organes (SVT) et les muscles (Sport, 14/10/2026). */
const PLANCHES: Record<
  'organes' | 'muscles',
  {
    titre: string
    cibles: readonly Organ[]
    /** La planche où chercher une cible (sa vue, pour l'écorché de face et de dos). */
    plancheDe: (cible: Organ) => Planche
    duPalier: (l: PalierLevel) => Organ[]
  }
> = {
  organes: { titre: 'Anatomie express', cibles: ORGANS, plancheDe: () => PLANCHE_ORGANES, duPalier: organsForPalier },
  muscles: {
    titre: 'Muscles express',
    cibles: MUSCLES,
    plancheDe: (c) => (c.vue === 'dos' ? PLANCHES_MUSCLES.dos : PLANCHES_MUSCLES.face),
    duPalier: musclesForPalier,
  },
}

/** La planche jouable à vide : on choisit la cible, on touche, on voit la correction. */
export default function ApercuPlanche({
  planche: nomPlanche,
  palier,
  cible,
  touche,
  theme,
  scene,
}: {
  planche: 'organes' | 'muscles'
  palier: PalierLevel
  cible: string | null
  touche: string | null
  theme: string
  scene: string | null
}) {
  const { titre, cibles, plancheDe, duPalier } = PLANCHES[nomPlanche]
  const organes = duPalier(palier)
  const premier = cibles.find((o) => o.id === cible) ?? organes[0]
  const [target, setTarget] = useState<Organ>(premier)
  const planche = plancheDe(target)
  const [picked, setPicked] = useState<ZonePlanche | null>(
    () => plancheDe(premier).zones.find((z) => z.id === touche) ?? null,
  )
  const [revealed, setRevealed] = useState(cible !== null)

  const choisir = (organ: Organ) => {
    setTarget(organ)
    setPicked(null)
    setRevealed(false)
  }

  return (
    <ModeStage
      title={titre}
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
          {questionPour(target)} {target.name} ?
        </h2>

        <AnatomyBoard
          planche={planche}
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
