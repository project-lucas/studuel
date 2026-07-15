'use client'

import Link from 'next/link'
import { Play, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { subjectTheme } from '@/lib/subject-style'
import SubjectIcon from '@/components/SubjectIcon'
import ProgressRing from '@/components/ProgressRing'
import type { Subject } from '@/lib/types'

export type ResumeItem = {
  subject: Subject
  chapterId: string
  chapterTitle: string
  progress: number // 0..1
  isNew: boolean // chapitre jamais commencé (→ « commencer » plutôt que reprise)
}

// « On s'y remet ? » — la reprise en un tap : une rangée horizontale des
// chapitres en cours (ou à commencer), chacun avec son anneau de progression et
// un bouton play. C'est le premier geste proposé en haut de Réviser.
export default function ResumeSessions({ items }: { items: ResumeItem[] }) {
  if (items.length === 0) return null

  return (
    <section aria-label="Reprendre une session">
      <h2 className="font-heading mb-2 px-1 text-sm font-bold tracking-wide text-muted-foreground uppercase">
        On s&apos;y remet ?
      </h2>
      <ul className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
        {items.map((item) => {
          const theme = subjectTheme(item.subject.color)
          const pct = Math.round(item.progress * 100)
          return (
            <li key={item.chapterId} className="w-44 shrink-0">
              <Link
                href={`/reviser/${item.subject.slug}/${item.chapterId}`}
                onClick={() => sfx.tap()}
                className="group flex h-full flex-col rounded-3xl bg-white p-4 shadow-sm ring-1 ring-black/5 transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99]"
              >
                <div className="flex items-start justify-between">
                  <span
                    aria-hidden="true"
                    className={cn(
                      'arena-tile flex size-10 items-center justify-center overflow-hidden rounded-2xl shadow-sm',
                      theme.arena,
                    )}
                  >
                    <SubjectIcon
                      slug={item.subject.slug}
                      className="size-6 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]"
                      strokeWidth={2.25}
                    />
                  </span>
                  {item.isNew ? (
                    <span className="rounded-full bg-highlight px-2 py-0.5 text-[10px] font-bold text-foreground">
                      Nouveau
                    </span>
                  ) : (
                    <ProgressRing
                      value={item.progress}
                      size={34}
                      strokeWidth={4}
                      label={`${pct}% fait`}
                      trackClassName="stroke-muted"
                      fillClassName="stroke-primary"
                    >
                      <span className="font-mono text-[10px] font-bold text-foreground tabular-nums">
                        {pct}%
                      </span>
                    </ProgressRing>
                  )}
                </div>

                <p className="font-heading mt-3 line-clamp-2 text-sm leading-tight font-bold text-foreground">
                  {item.chapterTitle}
                </p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {item.subject.name}
                </p>

                <span className="mt-3 flex items-center gap-1.5 text-xs font-bold text-primary">
                  <span className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-110">
                    {item.isNew ? (
                      <Play className="size-3.5" aria-hidden="true" />
                    ) : (
                      <RotateCcw className="size-3.5" aria-hidden="true" />
                    )}
                  </span>
                  {item.isNew ? 'Commencer' : 'Reprendre'}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
