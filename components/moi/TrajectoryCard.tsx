'use client'

import { useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { Info, Pencil } from 'lucide-react'
import type { ChartPoint } from '@/components/moi/TrajectoryChart'

// LA COURBE, CHARGÉE À LA DEMANDE. `recharts` est une grosse bibliothèque, et
// elle se retrouvait dans le paquet JavaScript de tout l'onglet Moi pour une
// seule carte — que l'élève ne voit qu'en faisant défiler, et jamais s'il n'a
// saisi aucune moyenne. Elle ne part plus sur le réseau que si la carte a
// vraiment quelque chose à tracer.
//
// Le repli occupe EXACTEMENT la hauteur de la courbe (h-44) : sans lui, la page
// sauterait au moment où le graphique arrive.
const TrajectoryChart = dynamic(
  () => import('@/components/moi/TrajectoryChart'),
  {
    loading: () => (
      <div className="size-full animate-pulse rounded-2xl bg-muted motion-reduce:animate-none" />
    ),
  },
)
import BottomSheet from '@/components/carnet/BottomSheet'
import { Button } from '@/components/ui/button'
import { sfx } from '@/lib/sounds'
import { formatNote } from '@/lib/notes'
import {
  MAX_UPLIFT,
  UPLIFT_PER_CAPACITY_POINT,
  type BacTrajectory,
} from '@/lib/trajectoire-bac'
// La saisie des moyennes vivait ICI, en composant privé — la trajectoire était
// donc le seul endroit d'où l'élève pouvait déclarer ses notes. La tuile
// « Moyenne générale » de l'onglet ouvre désormais le même formulaire : une
// seule implémentation, sinon les deux divergeront sur les bornes ou sur le
// verrouillage des trimestres déjà calculés.
import { SaisieMoyennesSheet } from '@/components/moi/SaisieMoyennes'

// « Ta trajectoire au bac » : T1/T2 réels, T3 en deux futurs possibles —
// pointillé plat « sans changement », ligne violette « avec tes leviers »,
// zone dégradée entre les deux. Saisie des moyennes + modale explicative.
export default function TrajectoryCard({
  trajectory,
  needsMigration,
}: {
  trajectory: BacTrajectory
  needsMigration: boolean
}) {
  const [showInfo, setShowInfo] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const { terms, hasData, sansChangement, avecLeviers, uplift } = trajectory

  const data: ChartPoint[] = useMemo(() => {
    const known = terms.filter((p) => p.avg !== null)
    const anchor = known.length > 0 ? known[known.length - 1].t : null
    return terms.map((p) => {
      const isAnchor = p.t === anchor
      const isT3 = p.t === 3
      const projectHere = sansChangement !== null && (isAnchor || (isT3 && p.avg === null))
      const sans = projectHere ? (isT3 ? sansChangement : p.avg) : null
      const avec =
        avecLeviers !== null && projectHere ? (isT3 ? avecLeviers : p.avg) : null
      return {
        label: `T${p.t}`,
        reel: p.avg,
        sans,
        avec,
        zone:
          sans !== null && avec !== null ? ([sans, avec] as [number, number]) : null,
      }
    })
  }, [terms, sansChangement, avecLeviers])

  const values = data
    .flatMap((d) => [d.reel, d.sans, d.avec])
    .filter((v): v is number => v !== null)
  const domain: [number, number] = [
    Math.max(0, Math.floor(Math.min(...values, 20)) - 1),
    Math.min(20, Math.ceil(Math.max(...values, 0)) + 1),
  ]

  const editable = terms.some((p) => p.source !== 'notes')

  return (
    <section
      aria-label="Ta trajectoire au bac"
      className="moi-card rounded-3xl bg-white p-4"
    >
      <div>
        <h2 className="font-heading text-xl leading-tight font-extrabold text-foreground">
          Ta trajectoire au bac
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Deux futurs possibles selon ce que tu fais cette semaine
        </p>
      </div>

      {hasData ? (
        <>
          <div className="mt-3 h-44 w-full">
            <TrajectoryChart data={data} domain={domain} />
          </div>

          {/* Les deux futurs, en pills comparatives. */}
          {sansChangement !== null ? (
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div className="rounded-2xl bg-muted px-3 py-2 text-center">
                <p className="text-[11px] font-bold text-muted-foreground">
                  Si tu ne fais rien
                </p>
                <p className="font-heading text-lg leading-tight font-extrabold text-foreground/70 tabular-nums">
                  {formatNote(sansChangement)}
                </p>
              </div>
              {avecLeviers !== null ? (
                <div className="relative rounded-2xl bg-primary/10 px-3 py-2 text-center ring-1 ring-primary/25">
                  {uplift !== null && uplift > 0 ? (
                    <span className="absolute -top-2 right-2 rounded-full bg-primary px-1.5 py-0.5 font-mono text-[10px] font-extrabold text-primary-foreground tabular-nums">
                      +{formatNote(uplift)}
                    </span>
                  ) : null}
                  <p className="text-[11px] font-bold text-primary">
                    Si tu tiens tes leviers
                  </p>
                  <p className="font-heading text-lg leading-tight font-extrabold text-primary tabular-nums">
                    {formatNote(avecLeviers)}
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl bg-primary/5 px-3 py-2 text-center">
                  <p className="text-[11px] font-semibold text-muted-foreground">
                    Active tes leviers pour voir ton deuxième futur
                  </p>
                </div>
              )}
            </div>
          ) : null}
        </>
      ) : (
        <div className="mt-3 rounded-2xl bg-muted/60 px-4 py-6 text-center">
          <p className="text-sm font-semibold text-foreground">
            Ajoute tes moyennes de trimestre pour voir ta trajectoire
          </p>
          <Button
            className="mt-3"
            onClick={() => setShowForm(true)}
            disabled={needsMigration}
          >
            Ajouter mes moyennes
          </Button>
          {needsMigration ? (
            <p className="mt-2 text-xs text-muted-foreground">
              La saisie arrive bientôt — mise à jour en cours.
            </p>
          ) : null}
        </div>
      )}

      <div className="mt-3 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => {
            sfx.tap()
            setShowInfo(true)
          }}
          className="flex cursor-pointer items-center gap-1.5 text-xs font-bold text-muted-foreground underline underline-offset-2 hover:text-foreground"
        >
          <Info className="size-3.5" aria-hidden="true" />
          Comment c&apos;est calculé ?
        </button>
        {hasData && editable && !needsMigration ? (
          <button
            type="button"
            onClick={() => {
              sfx.tap()
              setShowForm(true)
            }}
            className="flex cursor-pointer items-center gap-1.5 text-xs font-bold text-primary hover:underline"
          >
            <Pencil className="size-3.5" aria-hidden="true" />
            Mes moyennes
          </button>
        ) : null}
      </div>

      <BottomSheet
        open={showInfo}
        onClose={() => setShowInfo(false)}
        title="Comment c'est calculé ?"
      >
        <div className="space-y-3 text-sm text-foreground">
          <p>
            <strong>T1 et T2</strong> sont tes vraies moyennes : calculées depuis
            les notes que tu saisis, ou tapées directement depuis ton bulletin.
          </p>
          <p>
            <strong>« Si tu ne fais rien »</strong> prolonge simplement ta
            dernière moyenne connue, à plat.
          </p>
          <p>
            <strong>« Si tu tiens tes leviers »</strong> ajoute un bonus prudent :
            chaque point de capacité que tu peux regagner (l&apos;écart entre ta
            capacité et ton plafond) vaut {formatNote(UPLIFT_PER_CAPACITY_POINT)}{' '}
            point de moyenne — jamais plus de +{MAX_UPLIFT} points au total.
          </p>
          <p className="text-muted-foreground">
            Ce n&apos;est pas une promesse, c&apos;est un cap : l&apos;app te
            montre ce que tes habitudes peuvent changer, à toi de choisir.
          </p>
        </div>
      </BottomSheet>

      <SaisieMoyennesSheet
        open={showForm}
        onClose={() => setShowForm(false)}
        terms={terms}
      />
    </section>
  )
}
