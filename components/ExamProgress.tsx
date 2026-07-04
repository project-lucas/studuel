import Link from 'next/link'
import { TriangleAlert } from 'lucide-react'
import { cn } from '@/lib/utils'
import { subjectTheme } from '@/lib/subject-style'
import type { Subject } from '@/lib/types'

export type ExamProgressEntry = {
  label: string
  subject: Subject
  progress: number // 0..1, pondéré par les scores (80 % = 0,8 chapitre)
  total: number // chapitres du programme du niveau
  mastered: number // chapitres ≥ 80 %
  fragile: number // chapitres tentés mais < 50 % — à retravailler
  notStarted: number // chapitres jamais travaillés
}

// Bloc 2 de Réviser — avancement vers les épreuves (ou progression simple
// pour les classes sans examen). Chaque quiz fait avancer la barre à hauteur
// de son score ; les chapitres fragiles et manquants restent visibles.
export default function ExamProgress({
  title,
  entries,
}: {
  title: string
  entries: ExamProgressEntry[]
}) {
  if (entries.length === 0) return null

  return (
    <section
      aria-label={title}
      className="rounded-2xl border bg-card p-4 shadow-sm"
    >
      <h2 className="font-heading mb-1 text-lg font-bold">{title}</h2>
      <p className="mb-4 text-xs text-muted-foreground">
        Chaque quiz fait avancer la barre à hauteur de ton score — touche une
        matière pour voir le détail chapitre par chapitre.
      </p>

      <ul className="flex flex-col gap-4">
        {entries.map((e) => {
          const theme = subjectTheme(e.subject.color)
          const pct = e.total > 0 ? Math.round(e.progress * 100) : 0
          return (
            <li key={e.label}>
              <Link href={`/reviser/${e.subject.slug}`} className="group block">
                <div className="mb-1.5 flex items-baseline justify-between gap-2">
                  <span className="flex items-center gap-2 text-sm font-semibold group-hover:underline">
                    <span className="text-base leading-none">{e.subject.icon}</span>
                    {e.label}
                  </span>
                  <span className="font-mono text-xs font-semibold tabular-nums">
                    {pct}%
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn('h-full rounded-full transition-all', theme.bar)}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground">
                  <span>
                    {e.mastered}/{e.total} maîtrisé{e.mastered > 1 ? 's' : ''}
                  </span>
                  {e.fragile > 0 ? (
                    <span className="flex items-center gap-1 font-medium text-destructive">
                      <TriangleAlert className="size-3" />
                      {e.fragile} fragile{e.fragile > 1 ? 's' : ''}
                    </span>
                  ) : null}
                  {e.notStarted > 0 ? (
                    <span>{e.notStarted} à commencer</span>
                  ) : null}
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
