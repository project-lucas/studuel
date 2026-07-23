'use client'

import { useMemo, useState, useTransition } from 'react'
import { Info, Pencil, TrendingUp } from 'lucide-react'
import {
  Area,
  ComposedChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'
import BottomSheet from '@/components/carnet/BottomSheet'
import { Button } from '@/components/ui/button'
import { sfx } from '@/lib/sounds'
import { formatNote, type Trimestre } from '@/lib/notes'
import {
  MAX_UPLIFT,
  UPLIFT_PER_CAPACITY_POINT,
  type BacTrajectory,
} from '@/lib/trajectoire-bac'
import { saveTermAverageAction } from '@/app/moi/actions'

type ChartPoint = {
  label: string
  reel: number | null
  sans: number | null
  avec: number | null
  zone: [number, number] | null
}

// Étiquette de valeur au-dessus/en dessous d'un point — recharts appelle ce
// rendu pour CHAQUE point de la série, on ne dessine que ceux demandés.
function pointLabel(indexes: number[], dy: number, fill: string) {
  return function PointLabel(props: unknown) {
    const { x, y, value, index } = props as {
      x?: unknown
      y?: unknown
      value?: unknown
      index?: unknown
    }
    if (typeof index !== 'number' || !indexes.includes(index)) return null
    if (typeof x !== 'number' || typeof y !== 'number') return null
    const n = Number(value)
    if (!Number.isFinite(n)) return null
    return (
      <text
        x={x}
        y={y + dy}
        textAnchor="middle"
        fontSize={12}
        fontWeight={800}
        fill={fill}
      >
        {formatNote(n)}
      </text>
    )
  }
}

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
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="font-heading text-lg leading-tight font-bold text-foreground">
            Ta trajectoire au bac
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Deux futurs possibles selon ce que tu fais cette semaine
          </p>
        </div>
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <TrendingUp className="size-4.5" aria-hidden="true" />
        </span>
      </div>

      {hasData ? (
        <>
          <div className="mt-3 h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 20, right: 16, left: 16, bottom: 0 }}>
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12, fill: 'var(--muted-foreground)', fontWeight: 700 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis domain={domain} hide />
                {/* La zone d'écart entre les deux futurs, en violet doux. */}
                <Area
                  dataKey="zone"
                  fill="var(--primary)"
                  fillOpacity={0.12}
                  stroke="none"
                  connectNulls
                  isAnimationActive={false}
                />
                <Line
                  dataKey="sans"
                  stroke="var(--muted-foreground)"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 3.5, fill: 'var(--muted-foreground)', strokeWidth: 0 }}
                  connectNulls
                  isAnimationActive={false}
                  label={pointLabel([2], 20, 'var(--muted-foreground)')}
                />
                <Line
                  dataKey="avec"
                  stroke="var(--primary)"
                  strokeWidth={2.5}
                  dot={{ r: 4.5, fill: 'var(--primary)', strokeWidth: 0 }}
                  connectNulls
                  isAnimationActive={false}
                  label={pointLabel([2], -10, 'var(--primary)')}
                />
                <Line
                  dataKey="reel"
                  stroke="var(--foreground)"
                  strokeWidth={2.5}
                  dot={{ r: 4.5, fill: 'var(--foreground)', strokeWidth: 0 }}
                  connectNulls
                  isAnimationActive={false}
                  label={pointLabel([0, 1], -10, 'var(--foreground)')}
                />
              </ComposedChart>
            </ResponsiveContainer>
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

      <TermForm
        open={showForm}
        onClose={() => setShowForm(false)}
        trajectory={trajectory}
      />
    </section>
  )
}

// Saisie des moyennes trimestrielles (repli quand un trimestre n'a pas de
// notes détaillées). Les trimestres déjà calculés depuis les notes sont
// verrouillés — pas de double source de vérité.
function TermForm({
  open,
  onClose,
  trajectory,
}: {
  open: boolean
  onClose: () => void
  trajectory: BacTrajectory
}) {
  const [values, setValues] = useState<Record<number, string>>({})
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const submit = () => {
    setError(null)
    const updates: { term: Trimestre; average: number }[] = []
    for (const p of trajectory.terms) {
      if (p.source === 'notes') continue
      const raw = values[p.t]
      if (raw === undefined || raw.trim() === '') continue
      const n = Number(raw.replace(',', '.'))
      if (!Number.isFinite(n) || n < 0 || n > 20) {
        setError('Chaque moyenne doit être un nombre entre 0 et 20.')
        return
      }
      updates.push({ term: p.t, average: n })
    }
    if (updates.length === 0) {
      onClose()
      return
    }
    startTransition(async () => {
      for (const u of updates) {
        const { ok } = await saveTermAverageAction(u.term, u.average)
        if (!ok) {
          setError('Impossible d’enregistrer pour l’instant. Réessaie plus tard.')
          return
        }
      }
      sfx.tap()
      onClose()
    })
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="Mes moyennes de trimestre">
      <div className="space-y-3">
        {trajectory.terms.map((p) => (
          <label key={p.t} className="flex items-center justify-between gap-3">
            <span className="text-sm font-bold text-foreground">
              Trimestre {p.t}
              {p.source === 'notes' ? (
                <span className="block text-xs font-semibold text-muted-foreground">
                  calculée depuis tes notes
                </span>
              ) : null}
            </span>
            <input
              type="number"
              inputMode="decimal"
              min={0}
              max={20}
              step={0.1}
              disabled={p.source === 'notes'}
              defaultValue={p.avg ?? undefined}
              onChange={(e) =>
                setValues((v) => ({ ...v, [p.t]: e.target.value }))
              }
              placeholder="— /20"
              className="w-24 rounded-xl border border-border bg-white px-3 py-2 text-right font-mono text-sm font-bold text-foreground tabular-nums disabled:bg-muted disabled:text-muted-foreground"
            />
          </label>
        ))}
        {error ? (
          <p role="alert" className="text-xs font-bold text-destructive">
            {error}
          </p>
        ) : null}
        <Button className="w-full" onClick={submit} disabled={pending}>
          {pending ? 'Enregistrement…' : 'Enregistrer'}
        </Button>
      </div>
    </BottomSheet>
  )
}
