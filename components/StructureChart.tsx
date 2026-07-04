'use client'

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts'

export type WeekPoint = {
  week: string // libellé (ex : '12/05')
  structure: number | null // score de structure 0-100
  notes: number | null // moyenne des quiz 0-100
}

// Bloc 3 de Moi — la preuve par la courbe : quand la structure monte,
// les notes suivent.
export default function StructureChart({ data }: { data: WeekPoint[] }) {
  return (
    <section
      aria-label="Corrélation structure et notes"
      className="rounded-2xl border bg-card p-4 shadow-sm"
    >
      <h2 className="font-heading mb-1 text-lg font-bold">
        Structure ↔ notes
      </h2>
      <p className="mb-3 text-xs text-muted-foreground">
        8 dernières semaines — quand la structure monte, les notes suivent.
      </p>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 8, left: -22, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="week"
              tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                fontSize: 12,
                color: 'var(--foreground)',
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line
              type="monotone"
              dataKey="structure"
              name="Structure"
              stroke="var(--highlight)"
              strokeWidth={2.5}
              dot={{ r: 3 }}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="notes"
              name="Notes (quiz)"
              stroke="var(--primary)"
              strokeWidth={2.5}
              dot={{ r: 3 }}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
