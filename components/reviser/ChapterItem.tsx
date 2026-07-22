'use client'

import Link from 'next/link'
import { Check, Crown, Timer } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import {
  STATUS_LABELS,
  CROWN_THRESHOLDS,
  type ChapterRow,
} from '@/lib/subject-template'

// Une SEULE entrée par chapitre : numéro + titre, couronnes de progression,
// état (non commencé / en cours / complété). Le clic ouvre le hub du chapitre.
// `highlight` (élève 100 % nouveau, chapitre 1) : CTA « Commencer » jaune.
export default function ChapterItem({
  chapter,
  highlight = false,
}: {
  chapter: ChapterRow
  highlight?: boolean
}) {
  return (
    <Link
      href={chapter.href}
      onClick={() => sfx.tap()}
      className="flex items-center gap-4 rounded-2xl border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99]"
    >
      {/* Numéro du chapitre */}
      <span
        className={cn(
          'font-heading flex size-11 shrink-0 items-center justify-center rounded-xl text-lg font-bold',
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
        <span className="mt-0.5 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
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
          {STATUS_LABELS[chapter.status]}
        </span>
      </span>

      {highlight ? (
        <span className="font-heading shrink-0 rounded-full border-b-4 border-b-black/20 bg-highlight px-4 py-2 text-sm font-bold text-foreground">
          Commencer
        </span>
      ) : null}
    </Link>
  )
}
