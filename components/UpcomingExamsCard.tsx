'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { createPortal } from 'react-dom'
import { Target, Plus, Play, X, CalendarClock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { subjectIcon } from '@/lib/subject-style'
import { examCountdownLabel, type NextExam } from '@/lib/next-exam'
import { removeUpcomingExam } from '@/app/moi/actions'
import AddExamSheet, {
  type SubjectLite,
  type ChapterLite,
} from '@/components/AddExamSheet'

// -----------------------------------------------------------------------------
// « Mes contrôles à venir » — l'élève annonce ses prochains contrôles (matière +
// chapitre + date). La liste s'empile au fil des jours ; le Défi pioche ensuite
// ses questions dans ces chapitres. Style claymorphism (cartes jouet, coins
// doux, doubles ombres), mobile-first. Voir lib/next-exam.ts.
// -----------------------------------------------------------------------------
export default function UpcomingExamsCard({
  exams,
  today,
  subjects,
  chaptersBySubject,
}: {
  exams: NextExam[]
  today: string
  subjects: SubjectLite[]
  chaptersBySubject: Record<string, ChapterLite[]>
}) {
  const [adding, setAdding] = useState(false)
  const [pending, startTransition] = useTransition()

  function remove(chapterId: string) {
    sfx.tap()
    startTransition(async () => {
      await removeUpcomingExam(chapterId)
    })
  }

  // Pas de matière disponible (catalogue non chargé / classe non réglée).
  if (subjects.length === 0) {
    return (
      <section className="moi-card rounded-3xl bg-white px-5 py-4 text-center">
        <p className="text-sm text-muted-foreground">
          Choisis ta classe pour annoncer tes prochains contrôles.
        </p>
      </section>
    )
  }

  return (
    <section
      aria-label="Mes contrôles à venir"
      className="moi-card overflow-hidden rounded-3xl bg-white"
    >
      <div className="flex items-center justify-between gap-2 px-5 pt-4">
        <div className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Target className="size-5" strokeWidth={2.2} aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-heading text-base font-bold text-foreground">
              Mes contrôles à venir
            </h2>
            <p className="text-xs text-muted-foreground">
              {exams.length === 0
                ? 'Le Défi révisera avec toi'
                : `${exams.length} au programme · le Défi les révise`}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            sfx.tap()
            setAdding(true)
          }}
          aria-label="Annoncer un nouveau contrôle"
          className="flex h-11 items-center gap-1.5 rounded-full bg-primary px-3.5 font-heading text-sm font-extrabold text-primary-foreground shadow-sm transition active:translate-y-px"
        >
          <Plus className="size-4" strokeWidth={2.8} aria-hidden="true" />
          Contrôle
        </button>
      </div>

      {/* Liste des contrôles annoncés. */}
      {exams.length > 0 ? (
        <ul className="mt-3 space-y-2 px-4">
          {exams.map((exam) => {
            const countdown = examCountdownLabel(exam, today)
            const soon = exam.date !== null && countdown !== 'contrôle passé'
            // Icône dessinée de la matière (lib/subject-style) : même rendu
            // que la grille des matières et « Ma maîtrise », pas d'emoji brut.
            const Icon = subjectIcon(exam.subject)
            return (
              <li
                key={exam.chapterId}
                className="flex items-center gap-3 rounded-2xl bg-muted/50 py-2.5 pr-2 pl-3"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-4.5" strokeWidth={2} aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-foreground">
                    {exam.chapterTitle}
                  </p>
                  {countdown ? (
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 text-xs font-semibold',
                        soon ? 'text-primary' : 'text-muted-foreground',
                      )}
                    >
                      <CalendarClock className="size-3" aria-hidden="true" />
                      {countdown}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      Sans date
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => remove(exam.chapterId)}
                  disabled={pending}
                  aria-label={`Retirer le contrôle sur ${exam.chapterTitle}`}
                  className="flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted active:scale-90 disabled:opacity-60"
                >
                  <X className="size-4" strokeWidth={2.4} aria-hidden="true" />
                </button>
              </li>
            )
          })}
        </ul>
      ) : null}

      {/* Le pont vers le Défi : c'est LUI qui révise les contrôles annoncés. */}
      {exams.length > 0 ? (
        <div className="px-4 pt-3 pb-4">
          <Link
            href="/defi"
            onClick={() => sfx.tap()}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3.5 font-heading text-base font-extrabold text-primary-foreground shadow-sm transition active:translate-y-px"
          >
            <Play className="size-5" strokeWidth={2.6} aria-hidden="true" />
            Réviser mes contrôles
          </Link>
        </div>
      ) : (
        <div className="px-5 pb-5" />
      )}

      {adding
        ? createPortal(
            <AddExamSheet
              subjects={subjects}
              chaptersBySubject={chaptersBySubject}
              existing={new Set(exams.map((e) => e.chapterId))}
              onClose={() => setAdding(false)}
            />,
            document.body,
          )
        : null}
    </section>
  )
}
