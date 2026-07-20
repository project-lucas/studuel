'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Plus,
  CalendarClock,
  CalendarDays,
  Check,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { examCountdownLabel, type NextExam } from '@/lib/next-exam'
import YearHistory from '@/components/YearHistory'
import AddExamSheet, {
  type SubjectLite,
  type ChapterLite,
} from '@/components/AddExamSheet'

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
  chaptersBySubject = {},
  existingExamChapters = [],
  activeDays = [],
}: {
  week: WeekDay[]
  exams: NextExam[]
  today: string
  subjects: SubjectLite[]
  // Chapitres par matière + chapitres déjà planifiés : de quoi ouvrir la bulle
  // « Nouveau contrôle » sur place (au lieu de renvoyer vers le carnet).
  chaptersBySubject?: Record<string, ChapterLite[]>
  existingExamChapters?: string[]
  // Jours travaillés (clés UTC) sur la fenêtre d'activité — alimentent
  // l'historique ANNUEL ouvert par l'icône agenda.
  activeDays?: string[]
}) {
  const iconBySlug = new Map(subjects.map((s) => [s.slug, s.icon]))
  const [historyOpen, setHistoryOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)

  // Le contrôle le plus proche (les dates nulles passent en dernier).
  const next = exams[0] ?? null
  const countdown = next ? examCountdownLabel(next, today) : null

  return (
    <section aria-label="Ta semaine" className="px-1">
      {/* En-tête : titre à gauche, agenda à droite — l'icône se cale AU-DESSUS
          de la colonne du dimanche (dernière du strip). */}
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-heading text-sm font-extrabold text-foreground">
          Ta semaine
        </h3>
        <button
          type="button"
          onClick={() => {
            sfx.tap()
            setHistoryOpen(true)
          }}
          aria-label="Voir mon historique de travail complet"
          aria-haspopup="dialog"
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-primary ring-1 ring-black/5 shadow-sm transition active:translate-y-px"
        >
          <CalendarDays className="size-5" strokeWidth={2.4} aria-hidden="true" />
        </button>
      </div>

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
                <Check className="size-4" strokeWidth={3} aria-hidden="true" />
              ) : (
                DAY_LABELS[i]
              )}
            </span>
          </li>
        ))}
      </ul>

      {/* Le prochain contrôle : carte cliquable, ou rien s'il n'y en a pas. */}
      {next ? (
        <Link
          href="/defi"
          onClick={() => sfx.tap()}
          className="group mt-3 flex min-w-0 items-center gap-2.5 rounded-2xl bg-white/70 px-3 py-2 ring-1 ring-black/5 transition active:scale-[0.99]"
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
      ) : null}

      {/* Ligne compacte : à défaut de contrôle, un mot discret + un bouton
          « + Nouveau contrôle » resserré qui OUVRE LA BULLE de configuration
          (matière · chapitre · date) sur place — plus de détour par le carnet. */}
      <div className="mt-2.5 flex items-center justify-between gap-2">
        {next ? (
          <span aria-hidden="true" />
        ) : (
          <span className="text-xs font-medium text-muted-foreground">
            Aucun contrôle prévu.
          </span>
        )}
        <button
          type="button"
          onClick={() => {
            sfx.tap()
            setAddOpen(true)
          }}
          aria-haspopup="dialog"
          className="flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border border-dashed border-primary/40 py-1.5 pr-3 pl-1.5 font-heading text-xs font-bold text-primary transition hover:bg-primary/5 active:translate-y-px"
        >
          <span className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Plus className="size-3.5" strokeWidth={2.8} aria-hidden="true" />
          </span>
          Nouveau contrôle
        </button>
      </div>

      {/* La bulle « Nouveau contrôle » (bottom-sheet), montée à la demande. */}
      {addOpen ? (
        <AddExamSheet
          subjects={subjects}
          chaptersBySubject={chaptersBySubject}
          existing={new Set(existingExamChapters)}
          onClose={() => setAddOpen(false)}
        />
      ) : null}

      {/* L'historique annuel, en plein écran, ouvert par l'icône agenda. */}
      {historyOpen ? (
        <YearHistory
          activeDays={activeDays}
          today={today}
          onClose={() => setHistoryOpen(false)}
        />
      ) : null}
    </section>
  )
}
