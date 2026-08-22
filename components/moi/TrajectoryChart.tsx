'use client'

import {
  Area,
  ComposedChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'
import { formatNote } from '@/lib/notes'

/**
 * LA COURBE de la trajectoire au bac, isolée dans son propre module.
 *
 * POURQUOI CE FICHIER EXISTE. `recharts` pèse près de neuf méga-octets sur le
 * disque et se retrouvait dans le paquet JavaScript de TOUT l'onglet Moi, pour
 * une seule carte que l'élève ne voit qu'après avoir fait défiler la page — et
 * jamais du tout s'il n'a saisi aucune moyenne. Tout le monde payait le
 * téléchargement d'une bibliothèque de graphiques pour un dessin optionnel.
 *
 * En vivant à part, elle n'est chargée que lorsque la carte a réellement des
 * données à tracer (import dynamique dans TrajectoryCard). L'onglet s'ouvre
 * sans elle.
 */

export type ChartPoint = {
  label: string
  reel: number | null
  sans: number | null
  avec: number | null
  zone: [number, number] | null
}

/**
 * Étiquette de valeur au-dessus/en dessous d'un point — recharts appelle ce
 * rendu pour CHAQUE point de la série, on ne dessine que ceux demandés.
 */
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

export default function TrajectoryChart({
  data,
  domain,
}: {
  data: ChartPoint[]
  domain: [number, number]
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={data}
        margin={{ top: 20, right: 16, left: 16, bottom: 0 }}
      >
        <XAxis
          dataKey="label"
          tick={{
            fontSize: 12,
            fill: 'var(--muted-foreground)',
            fontWeight: 700,
          }}
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
  )
}
