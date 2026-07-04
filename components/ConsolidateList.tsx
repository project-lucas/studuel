import Link from 'next/link'
import { TriangleAlert, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { subjectTheme } from '@/lib/subject-style'
import type { Subject } from '@/lib/types'

export type ConsolidateEntry = {
  subject: Subject
  chapterId: string
  chapterTitle: string
  state: 'fragile' | 'a_commencer'
  progress: number // 0..1
}

// Ce qui manque, rendu visible ET jouable : les chapitres fragiles d'abord,
// puis ceux jamais commencés.
export default function ConsolidateList({
  entries,
}: {
  entries: ConsolidateEntry[]
}) {
  if (entries.length === 0) return null

  return (
    <section
      aria-label="Chapitres à consolider"
      className="rounded-2xl border bg-card p-4 shadow-sm"
    >
      <h2 className="font-heading mb-3 flex items-center gap-2 text-lg font-bold">
        <TriangleAlert className="size-4 text-destructive" /> À consolider
      </h2>
      <ul className="flex flex-col gap-1.5">
        {entries.map((e) => {
          const theme = subjectTheme(e.subject.color)
          return (
            <li key={e.chapterId}>
              <Link
                href={`/reviser/${e.subject.slug}/${e.chapterId}`}
                className="group flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-muted/60"
              >
                <span
                  className={cn(
                    'flex size-9 shrink-0 items-center justify-center rounded-lg text-lg',
                    theme.chip,
                  )}
                >
                  {e.subject.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold group-hover:underline">
                    {e.chapterTitle}
                  </span>
                  <span
                    className={cn(
                      'font-mono text-[11px] tabular-nums',
                      e.state === 'fragile'
                        ? 'font-semibold text-destructive'
                        : 'text-muted-foreground',
                    )}
                  >
                    {e.state === 'fragile'
                      ? `Fragile · ${Math.round(e.progress * 100)}%`
                      : 'À commencer'}
                  </span>
                </span>
                <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
