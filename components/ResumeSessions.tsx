'use client'

import Link from 'next/link'
import { CheckCircle2, ChevronRight, Flame, Timer } from 'lucide-react'
import { sfx } from '@/lib/sounds'
import { subjectPastel } from '@/lib/subject-style'
import SubjectIcon from '@/components/SubjectIcon'
import ProgressRing from '@/components/ProgressRing'
import type { Subject } from '@/lib/types'

export type ResumeItem = {
  subject: Subject
  chapterId: string
  chapterTitle: string
  progress: number // 0..1
  minutes: number // durée estimée de la session
  isNew: boolean // chapitre jamais commencé (→ « Nouveau » plutôt qu'un anneau)
}

// La pastille de matière : rond pastel + icône, puis le nom.
function SubjectChip({ subject }: { subject: Subject }) {
  return (
    <span className="flex min-w-0 items-center gap-1.5 text-[11px] font-bold text-muted-foreground">
      <span
        aria-hidden="true"
        className="grid size-6 shrink-0 place-items-center rounded-full"
        style={{ backgroundColor: subjectPastel(subject.color) }}
      >
        <SubjectIcon
          slug={subject.slug}
          className="size-3.5 text-foreground"
          strokeWidth={2.6}
        />
      </span>
      <span className="truncate">{subject.name}</span>
    </span>
  )
}

/**
 * Carte de suggestion : entièrement tactile (pas de bouton interne — le tap
 * n'importe où lance la session), une seule info de durée, un chevron qui dit
 * « ça s'ouvre ». Le badge « Nouveau » ne sort que sur un chapitre jamais
 * commencé — quand tout est signalé, plus rien ne l'est.
 */
function SessionCard({ item }: { item: ResumeItem }) {
  const pct = Math.round(item.progress * 100)

  return (
    <li className="w-44 shrink-0">
      <Link
        href={`/reviser/${item.subject.slug}/${item.chapterId}`}
        onClick={() => sfx.tap()}
        className="rev-card group flex h-full flex-col rounded-3xl bg-white p-3.5 ring-1 ring-black/5 transition-transform hover:-translate-y-0.5 active:scale-[0.99]"
      >
        <div className="flex min-h-8 items-start justify-between gap-2">
          <SubjectChip subject={item.subject} />
          {item.isNew ? (
            <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-extrabold text-secondary-foreground">
              Nouveau
            </span>
          ) : (
            <ProgressRing
              value={item.progress}
              size={30}
              strokeWidth={4}
              label={`${pct}% fait`}
              trackClassName="stroke-muted"
              fillClassName="stroke-primary"
            >
              <span className="font-mono text-[9px] font-bold text-foreground tabular-nums">
                {pct}%
              </span>
            </ProgressRing>
          )}
        </div>

        <p className="font-heading mt-1.5 line-clamp-2 text-sm leading-tight font-extrabold text-foreground">
          {item.chapterTitle}
        </p>

        <span className="mt-auto flex items-center justify-between pt-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-bold text-muted-foreground">
            <Timer className="size-3" aria-hidden="true" />
            {item.minutes} min
          </span>
          <ChevronRight
            aria-hidden="true"
            className="size-4.5 text-primary transition-transform group-hover:translate-x-0.5"
            strokeWidth={2.6}
          />
        </span>
      </Link>
    </li>
  )
}

/**
 * « Ensuite » — les sessions en réserve, après la mission du jour. Un rail
 * horizontal de cartes tactiles : on encourage à explorer, on n'impose plus
 * trois choix égaux à coups de boutons jumeaux.
 */
export default function ResumeSessions({
  items,
  goalReached = false,
}: {
  items: ResumeItem[]
  // Objectif du jour ATTEINT — dérivé des minutes travaillées. On n'en montre
  // que l'état : l'unité (les minutes) vit dans l'anneau du héros.
  goalReached?: boolean
}) {
  if (items.length === 0) return null

  return (
    <section aria-label="Continuer avec une autre session">
      <div className="mb-2 px-1">
        <h2 className="font-heading text-sm font-bold tracking-wide text-muted-foreground uppercase">
          {goalReached ? 'Beau travail !' : 'Ensuite'}
        </h2>
        <p className="mt-0.5 flex items-center gap-1 text-xs font-bold text-foreground">
          {goalReached ? (
            <>
              <CheckCircle2
                className="size-3.5 text-success"
                aria-hidden="true"
              />
              Objectif du jour atteint
            </>
          ) : (
            <>
              <Flame className="size-3.5 text-highlight" aria-hidden="true" />
              Encore un peu pour ton objectif du jour
            </>
          )}
        </p>
      </div>

      <ul className="hide-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pt-1 pb-4 sm:mx-0 sm:px-1">
        {items.map((item) => (
          <SessionCard key={item.chapterId} item={item} />
        ))}
      </ul>
    </section>
  )
}
