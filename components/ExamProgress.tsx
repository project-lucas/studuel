import Link from 'next/link'
import { Target } from 'lucide-react'
import { cn } from '@/lib/utils'
import { subjectTheme } from '@/lib/subject-style'
import type { Subject } from '@/lib/types'

export type ExamProgressEntry = {
  label: string
  subject: Subject
  progress: number // 0..1, pondéré par les scores
  total: number
}

// Objectif examen, compact : le % global vers l'épreuve + une mini-barre
// par matière. Le détail chapitre par chapitre vit sur les pages matières.
export default function ExamProgress({
  title,
  entries,
}: {
  title: string
  entries: ExamProgressEntry[]
}) {
  if (entries.length === 0) return null

  const totalChapters = entries.reduce((s, e) => s + e.total, 0)
  const globalPct =
    totalChapters > 0
      ? Math.round(
          (entries.reduce((s, e) => s + e.progress * e.total, 0) /
            totalChapters) *
            100,
        )
      : 0

  return (
    <section
      aria-label={title}
      className="rounded-2xl border bg-card p-4 shadow-sm"
    >
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <h2 className="font-heading flex items-center gap-2 text-lg font-bold">
          <Target className="size-4 text-primary" /> {title}
        </h2>
        <span className="font-mono text-xl font-bold tabular-nums">
          {globalPct}%
        </span>
      </div>

      {/* Barre globale */}
      <div className="mb-4 h-3 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="bar-fill h-full rounded-full bg-highlight transition-all"
          style={{ width: `${globalPct}%` }}
        />
      </div>

      {/* Mini-barres par épreuve */}
      <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
        {entries.map((e) => {
          const theme = subjectTheme(e.subject.color)
          const pct = Math.round(e.progress * 100)
          return (
            <li key={e.label}>
              <Link href={`/reviser/${e.subject.slug}`} className="group block">
                <div className="mb-1 flex items-baseline justify-between gap-2 text-xs">
                  <span className="truncate font-medium group-hover:underline">
                    {e.subject.icon} {e.label}
                  </span>
                  <span className="font-mono shrink-0 tabular-nums text-muted-foreground">
                    {pct}%
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn('bar-fill h-full rounded-full transition-all', theme.bar)}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
