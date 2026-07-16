'use client'

import Link from 'next/link'
import { Plus, CalendarClock, Flame, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { examCountdownLabel, type NextExam } from '@/lib/next-exam'
import type { SubjectLite } from '@/components/AddExamSheet'

// Jours de la semaine, lundi → dimanche (index 0 = lundi, cf. lib/streak).
const DAY_LABELS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

type WeekDay = { done: boolean; isToday: boolean; isFuture: boolean }

// -----------------------------------------------------------------------------
// Barre de semaine « sans contour » de l'onglet Réviser : la ligne des 7 jours
// (activité de la semaine, aujourd'hui mis en avant) + un mini-planning du
// prochain contrôle, en LECTURE SEULE. L'ajout/retrait de contrôles a un point
// d'entrée unique : « Mes contrôles à venir » dans Mon carnet — le « + » d'ici
// y renvoie au lieu d'ouvrir une deuxième feuille d'ajout.
// -----------------------------------------------------------------------------
export default function WeekPlannerStrip({
  week,
  exams,
  today,
  subjects,
}: {
  week: WeekDay[]
  exams: NextExam[]
  today: string
  subjects: SubjectLite[]
}) {
  const iconBySlug = new Map(subjects.map((s) => [s.slug, s.icon]))

  // Le contrôle le plus proche (les dates nulles passent en dernier).
  const next = exams[0] ?? null
  const countdown = next ? examCountdownLabel(next, today) : null

  return (
    <section aria-label="Ta semaine" className="px-1">
      {/* Ligne des 7 jours — sans cadre, juste des pastilles. */}
      <ul className="flex items-end justify-between gap-1">
        {week.map((d, i) => (
          <li key={i} className="flex flex-1 flex-col items-center gap-1.5">
            <span
              className={cn(
                'text-[11px] font-bold uppercase',
                d.isToday ? 'text-primary' : 'text-muted-foreground',
              )}
            >
              {DAY_LABELS[i]}
            </span>
            <span
              aria-hidden="true"
              className={cn(
                'flex size-8 items-center justify-center rounded-full text-xs font-bold transition',
                d.done
                  ? 'bg-highlight text-foreground shadow-sm'
                  : d.isFuture
                    ? 'bg-white/60 text-muted-foreground/50'
                    : 'bg-white text-muted-foreground ring-1 ring-black/5',
                d.isToday && 'ring-2 ring-primary ring-offset-1 ring-offset-background',
              )}
            >
              {d.done ? (
                <Flame className="size-4" strokeWidth={2.4} />
              ) : (
                DAY_LABELS[i]
              )}
            </span>
          </li>
        ))}
      </ul>

      {/* Mini-planning : le prochain contrôle + renvoi vers Mon carnet. */}
      <div className="mt-3 flex items-center gap-2">
        {next ? (
          <Link
            href="/defi"
            onClick={() => sfx.tap()}
            className="group flex min-w-0 flex-1 items-center gap-2.5 rounded-2xl bg-white/70 px-3 py-2 ring-1 ring-black/5 transition active:scale-[0.99]"
          >
            <span className="text-lg" aria-hidden="true">
              {iconBySlug.get(next.subject) ?? '📘'}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-bold text-foreground">
                {next.chapterTitle}
              </span>
              {countdown ? (
                <span className="flex items-center gap-1 text-xs font-semibold text-primary">
                  <CalendarClock className="size-3" aria-hidden="true" />
                  {countdown}
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">Sans date</span>
              )}
            </span>
            <ChevronRight
              className="size-4 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        ) : (
          <p className="min-w-0 flex-1 text-sm font-medium text-muted-foreground">
            Aucun contrôle prévu — annonce-en un dans Mon carnet.
          </p>
        )}

        <Link
          href="/reviser?espace=carnet"
          onClick={() => sfx.tap()}
          aria-label="Annoncer un contrôle dans Mon carnet"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition active:translate-y-px"
        >
          <Plus className="size-5" strokeWidth={2.8} aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}
