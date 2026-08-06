'use client'

import Link from 'next/link'
import { Check, ChevronRight, Clock3, Crown, Timer } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import {
  CROWN_THRESHOLDS,
  STATUS_LABELS,
  minutesLabel,
  type ChapterRow,
} from '@/lib/subject-template'

// Une SEULE entrée par chapitre : numéro + titre, durée estimée, couronnes
// gagnées, état. Le clic ouvre le chapitre (son premier cours).
//
// `resumeLabel` : le chapitre à reprendre porte le CTA jaune (« Reprendre » /
// « Commencer »). Il y en a toujours exactement un tant qu'il reste quelque
// chose à faire — cf. `resumeCta`.
//
// Les couronnes ne s'affichent qu'à partir de la première GAGNÉE : trois
// couronnes éteintes sur chacune des 28 lignes, c'est un mur d'échecs pour
// quelqu'un qui n'a encore rien fait de mal.
export default function ChapterItem({
  chapter,
  resumeLabel = null,
}: {
  chapter: ChapterRow
  resumeLabel?: string | null
}) {
  const started = chapter.status !== 'non_commence'

  return (
    <Link
      href={chapter.href}
      onClick={() => sfx.tap()}
      className={cn(
        'flex items-center gap-3 rounded-2xl border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99]',
        // Une ligne encore vierge n'a rien à raconter : elle se fait discrète
        // pour laisser respirer celles qui portent un vrai avancement.
        started ? 'p-4' : 'px-4 py-3',
        resumeLabel ? 'border-highlight ring-2 ring-highlight/40' : null,
      )}
    >
      {/* Numéro du chapitre */}
      <span
        className={cn(
          'font-heading flex shrink-0 items-center justify-center rounded-xl font-bold',
          started ? 'size-11 text-lg' : 'size-9 text-base',
          chapter.status === 'complete'
            ? 'bg-primary text-primary-foreground'
            : 'bg-primary/10 text-primary',
        )}
        aria-hidden="true"
      >
        {chapter.status === 'complete' ? (
          <Check className="size-5.5" strokeWidth={3} />
        ) : (
          chapter.position
        )}
      </span>

      <span className="min-w-0 flex-1">
        {chapter.examHint ? (
          <span
            className={cn(
              'mb-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-extrabold',
              chapter.examHint.proximity === 'imminent'
                ? 'bg-destructive text-white'
                : 'bg-highlight text-foreground',
            )}
          >
            <Timer className="size-3" aria-hidden="true" />
            {chapter.examHint.label}
          </span>
        ) : null}
        <span className="block font-semibold text-balance">
          Chapitre {chapter.position} · {chapter.title}
        </span>
        <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs font-semibold text-muted-foreground">
          {chapter.minutes !== null ? (
            <span className="inline-flex items-center gap-1">
              <Clock3 className="size-3.5" aria-hidden="true" />
              {minutesLabel(chapter.minutes)}
            </span>
          ) : null}
          {/* Les couronnes n'apparaissent qu'une fois la première décrochée. */}
          {chapter.crowns > 0 ? (
            <span
              className="inline-flex items-center gap-0.5"
              role="img"
              aria-label={`${chapter.crowns} couronne${chapter.crowns > 1 ? 's' : ''} sur ${CROWN_THRESHOLDS.length}`}
            >
              {CROWN_THRESHOLDS.map((threshold, i) => (
                <Crown
                  key={threshold}
                  className={cn(
                    'size-3.5',
                    i < chapter.crowns
                      ? 'fill-highlight text-highlight'
                      : 'text-foreground/20',
                  )}
                  aria-hidden="true"
                />
              ))}
            </span>
          ) : null}
          {started ? <span>{STATUS_LABELS[chapter.status]}</span> : null}
        </span>
      </span>

      {resumeLabel ? (
        <span className="font-heading shrink-0 rounded-full border-b-4 border-b-black/20 bg-highlight px-4 py-2 text-sm font-bold text-foreground">
          {resumeLabel}
        </span>
      ) : (
        <ChevronRight
          className="size-4 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
      )}
    </Link>
  )
}
