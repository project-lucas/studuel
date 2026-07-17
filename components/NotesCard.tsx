'use client'

import { useState, useTransition } from 'react'
import { GraduationCap, Plus, TrendingUp, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { removeGradeAction } from '@/app/moi/actions'
import AddGradeSheet, { type SubjectLite } from '@/components/AddGradeSheet'
import {
  displayedTrimestre,
  formatNote,
  gradesOfTrimestre,
  subjectAverages,
  trimestreDelta,
  trimestreLabel,
  trimestreSummaries,
  trimestreTrendMessage,
  type SchoolGrade,
} from '@/lib/notes'

const RECENT_COUNT = 5

// 'YYYY-MM-DD' → 'JJ/MM' (affichage compact des dernières notes).
const shortDate = (dayKey: string) => `${dayKey.slice(8, 10)}/${dayKey.slice(5, 7)}`

// -----------------------------------------------------------------------------
// « Mes notes » — les notes réelles de l'élève (migration 167) : moyenne du
// trimestre en évidence, évolution T1 → T2 → T3, moyennes par matière et
// dernières notes. La liste locale se resynchronise sur ce que renvoient les
// actions (pas de re-fetch). Toute la logique vit dans lib/notes.ts.
// -----------------------------------------------------------------------------
export default function NotesCard({
  initial,
  subjects,
  today,
  needsMigration,
}: {
  initial: SchoolGrade[]
  subjects: SubjectLite[]
  today: string
  needsMigration: boolean
}) {
  const [grades, setGrades] = useState<SchoolGrade[]>(initial)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [error, setError] = useState(false)
  const [pending, startTransition] = useTransition()

  const bySlug = new Map(subjects.map((s) => [s.slug, s]))
  const subjectName = (slug: string) => bySlug.get(slug)?.name ?? slug
  const subjectIcon = (slug: string) => bySlug.get(slug)?.icon ?? '📘'

  const summaries = trimestreSummaries(grades, today)
  const displayed = displayedTrimestre(summaries, today)
  const delta = trimestreDelta(summaries, displayed)
  const trendMessage = trimestreTrendMessage(delta)
  const perSubject = displayed
    ? subjectAverages(gradesOfTrimestre(grades, today, displayed.t))
    : []
  const recent = grades.slice(0, RECENT_COUNT)

  const add = (grade: SchoolGrade) => {
    // Insérée à sa place chronologique (plus récentes d'abord).
    setGrades((list) =>
      [grade, ...list].sort((a, b) =>
        a.date < b.date ? 1 : a.date > b.date ? -1 : 0,
      ),
    )
  }

  const remove = (id: string) => {
    if (pending) return
    setError(false)
    startTransition(async () => {
      const res = await removeGradeAction(id)
      if (res.ok) setGrades((list) => list.filter((g) => g.id !== id))
      else setError(true)
    })
  }

  return (
    <section
      aria-label="Mes notes"
      className="moi-card rounded-[1.75rem] bg-white p-5"
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <GraduationCap className="size-4.5" strokeWidth={2.2} aria-hidden="true" />
        </span>
        <h2 className="font-heading flex-1 text-lg font-extrabold text-foreground">
          Mes notes
        </h2>
        <button
          type="button"
          onClick={() => {
            sfx.tap()
            setSheetOpen(true)
          }}
          className="flex min-h-9 shrink-0 items-center gap-1 rounded-full bg-primary px-3.5 font-heading text-sm font-extrabold text-primary-foreground shadow-sm transition active:translate-y-px"
        >
          <Plus className="size-4" strokeWidth={2.8} aria-hidden="true" />
          Ajouter
        </button>
      </div>

      {needsMigration ? (
        <p className="rounded-xl bg-muted/40 px-3 py-2.5 text-xs text-muted-foreground">
          Les notes arrivent bientôt ici — cette partie est en cours
          d&apos;installation.
        </p>
      ) : grades.length === 0 ? (
        <p className="rounded-xl bg-muted/40 px-3 py-2.5 text-center text-xs text-muted-foreground">
          Reporte ici les notes de tes vrais contrôles : tu verras ta moyenne
          par trimestre et ta progression sur l&apos;année.
        </p>
      ) : (
        <>
          {/* Moyenne du trimestre en évidence + évolution T1 → T2 → T3. */}
          {displayed && displayed.avg !== null ? (
            <div className="mb-3 flex items-center gap-4">
              <div className="shrink-0 text-center">
                <p className="font-heading text-4xl font-extrabold text-foreground tabular-nums">
                  {formatNote(displayed.avg)}
                  <span className="text-base font-bold text-muted-foreground">
                    /20
                  </span>
                </p>
                <p className="text-[11px] font-semibold text-muted-foreground">
                  {trimestreLabel(displayed.t)}
                </p>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex gap-1.5">
                  {summaries.map((s) => (
                    <div
                      key={s.t}
                      className={cn(
                        'flex-1 rounded-xl px-2 py-1.5 text-center',
                        s.t === displayed.t
                          ? 'bg-primary/10 text-primary'
                          : 'bg-muted/40 text-muted-foreground',
                      )}
                    >
                      <p className="text-[10px] font-bold">T{s.t}</p>
                      <p className="text-sm font-extrabold tabular-nums">
                        {s.avg === null ? '—' : formatNote(s.avg)}
                      </p>
                    </div>
                  ))}
                </div>
                {trendMessage && delta !== null ? (
                  <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-muted-foreground">
                    <TrendingUp
                      className={cn(
                        'size-3.5 shrink-0',
                        delta >= 0 ? 'text-success' : 'text-destructive',
                        delta < 0 && 'rotate-180 -scale-x-100',
                      )}
                      strokeWidth={2.4}
                      aria-hidden="true"
                    />
                    {trendMessage}
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}

          {/* Moyennes par matière du trimestre affiché. */}
          {perSubject.length > 0 ? (
            <ul className="mb-3 flex flex-col gap-1.5">
              {perSubject.map((s) => (
                <li
                  key={s.subject}
                  className="flex items-center gap-2 rounded-xl bg-muted/30 px-3 py-2"
                >
                  <span className="shrink-0 text-base" aria-hidden="true">
                    {subjectIcon(s.subject)}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">
                    {subjectName(s.subject)}
                  </span>
                  <span className="shrink-0 text-[11px] text-muted-foreground">
                    {s.count} note{s.count > 1 ? 's' : ''}
                  </span>
                  <span className="shrink-0 font-heading text-sm font-extrabold text-foreground tabular-nums">
                    {formatNote(s.avg)}/20
                  </span>
                </li>
              ))}
            </ul>
          ) : null}

          {/* Dernières notes, avec retrait (saisie par erreur). */}
          <p className="mb-1.5 text-xs font-bold text-muted-foreground">
            Dernières notes
          </p>
          <ul className="flex flex-col gap-1">
            {recent.map((g) => (
              <li key={g.id} className="flex items-center gap-2 py-0.5">
                <span className="shrink-0 text-sm" aria-hidden="true">
                  {subjectIcon(g.subject)}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                  {g.label ?? subjectName(g.subject)}
                </span>
                <span className="shrink-0 text-[11px] text-muted-foreground tabular-nums">
                  {shortDate(g.date)}
                </span>
                <span className="shrink-0 text-sm font-extrabold text-foreground tabular-nums">
                  {formatNote(g.score)}/{formatNote(g.outOf)}
                </span>
                <button
                  type="button"
                  onClick={() => remove(g.id)}
                  disabled={pending}
                  aria-label={`Retirer la note ${formatNote(g.score)}/${formatNote(g.outOf)} en ${subjectName(g.subject)}`}
                  className="flex size-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted active:scale-90"
                >
                  <X className="size-3.5" strokeWidth={2.4} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {error ? (
        <p
          role="alert"
          className="mt-3 rounded-2xl bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive"
        >
          Impossible d&apos;enregistrer pour le moment. Réessaie.
        </p>
      ) : null}

      {sheetOpen ? (
        <AddGradeSheet
          subjects={subjects}
          today={today}
          onAdded={add}
          onClose={() => setSheetOpen(false)}
        />
      ) : null}
    </section>
  )
}
