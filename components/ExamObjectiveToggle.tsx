'use client'

import { useState } from 'react'
import { Target, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import ExamProgress, {
  examGlobalPct,
  type ExamProgressEntry,
} from '@/components/ExamProgress'

// « Objectif Bac » repliable, en haut de l'onglet Réviser : une petite pastille
// discrète (icône cible + % global) qui se déplie pour révéler le détail par
// matière + l'accès à l'examen blanc. Repliée par défaut pour ne pas alourdir
// l'accueil. Rendu null hors classes à examen (entries vide).
export default function ExamObjectiveToggle({
  title,
  entries,
}: {
  title: string
  entries: ExamProgressEntry[]
}) {
  const [open, setOpen] = useState(false)
  if (entries.length === 0) return null

  const pct = examGlobalPct(entries)

  return (
    <section aria-label={title} className="px-1">
      <button
        type="button"
        onClick={() => {
          sfx.tap()
          setOpen((v) => !v)
        }}
        aria-expanded={open}
        className="flex w-full items-center gap-2.5 rounded-full bg-white/70 py-1.5 pr-3 pl-1.5 text-left ring-1 ring-black/5 transition active:scale-[0.99]"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Target className="size-4.5" strokeWidth={2.4} aria-hidden="true" />
        </span>
        <span className="font-heading min-w-0 flex-1 truncate text-sm font-bold text-foreground">
          {title}
        </span>
        <span className="font-mono text-sm font-extrabold text-primary tabular-nums">
          {pct}%
        </span>
        <ChevronDown
          className={cn(
            'size-4 shrink-0 text-muted-foreground transition-transform',
            open && 'rotate-180',
          )}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div className="mt-2 rounded-2xl bg-card p-4 shadow-sm ring-1 ring-black/5">
          <ExamProgress title={title} entries={entries} embedded />
        </div>
      ) : null}
    </section>
  )
}
