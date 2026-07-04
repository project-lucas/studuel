import Link from 'next/link'
import { cn } from '@/lib/utils'
import { subjectTheme } from '@/lib/subject-style'
import type { Subject } from '@/lib/types'

export type ExamProgressEntry = {
  label: string
  subject: Subject
  covered: number // chapitres du programme travaillés au moins une fois
  total: number // chapitres du programme du niveau
}

// Bloc 2 de Réviser — avancement vers les épreuves officielles, dérivé
// automatiquement du profil (classe + matières de l'onboarding).
export default function ExamProgress({ entries }: { entries: ExamProgressEntry[] }) {
  if (entries.length === 0) return null

  return (
    <section aria-label="Avancement vers les examens" className="rounded-2xl border bg-card p-4 shadow-sm">
      <h2 className="font-heading mb-1 text-lg font-bold">Objectif examen</h2>
      <p className="mb-4 text-xs text-muted-foreground">
        Progression = chapitres du programme travaillés au moins une fois.
      </p>

      <ul className="flex flex-col gap-4">
        {entries.map(({ label, subject, covered, total }) => {
          const theme = subjectTheme(subject.color)
          const pct = total > 0 ? Math.round((covered / total) * 100) : 0
          return (
            <li key={label}>
              <Link href={`/reviser/${subject.slug}`} className="group block">
                <div className="mb-1.5 flex items-baseline justify-between gap-2">
                  <span className="flex items-center gap-2 text-sm font-semibold group-hover:underline">
                    <span className="text-base leading-none">{subject.icon}</span>
                    {label}
                  </span>
                  <span className="font-mono text-xs tabular-nums text-muted-foreground">
                    {covered}/{total} ch. · {pct}%
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn('h-full rounded-full transition-all', theme.bar)}
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
