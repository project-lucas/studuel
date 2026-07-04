'use client'

import Link from 'next/link'
import { Play } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { subjectTheme, GRID_PATTERN, MASCOT } from '@/lib/subject-style'
import type { Subject } from '@/lib/types'

export type ContinueTarget = {
  subject: Subject
  chapterId: string
  chapterTitle: string
  progress: number // 0..1
  isNew: boolean // premier chapitre jamais travaillé
}

// LE geste du jour : une grande carte action, façon « Continue » de Duolingo.
export default function ContinueCard({ target }: { target: ContinueTarget }) {
  const theme = subjectTheme(target.subject.color)
  const pct = Math.round(target.progress * 100)

  return (
    <Link
      href={`/reviser/${target.subject.slug}/${target.chapterId}`}
      onClick={() => sfx.tap()}
      className={cn(
        'group pop-in relative block overflow-hidden rounded-2xl p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99]',
        theme.header,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={GRID_PATTERN}
        aria-hidden="true"
      />
      <div className="relative flex items-center gap-4">
        <span className="float-slow text-5xl leading-none drop-shadow-sm">
          {MASCOT}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold tracking-widest uppercase opacity-70">
            {target.isNew ? 'Commence ici' : 'Reprendre'}
          </p>
          <p className="font-heading truncate text-xl font-bold">
            {target.chapterTitle}
          </p>
          <p className="text-sm font-medium opacity-75">
            {target.subject.icon} {target.subject.name}
            {target.isNew
              ? ' · nouveau chapitre'
              : ` · ${pct}% — ${pct >= 50 ? 'encore un effort, tu y es presque !' : 'continue, ça rentre !'}`}
          </p>
        </div>
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-card text-foreground shadow-md transition-transform group-hover:scale-110">
          <Play className="size-5" />
        </span>
      </div>

      {!target.isNew ? (
        <div className="relative mt-4 h-2 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
          <div
            className={cn('bar-fill h-full rounded-full', theme.bar)}
            style={{ width: `${pct}%` }}
          />
        </div>
      ) : null}
    </Link>
  )
}
