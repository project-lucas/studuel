'use client'

import { useState, useTransition } from 'react'
import { Target, Plus, X, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import {
  addWeeklyGoalAction,
  toggleWeeklyGoalAction,
  removeWeeklyGoalAction,
} from '@/app/moi/actions'
import {
  goalsForWeek,
  weeklyGoalsProgress,
  MAX_WEEKLY_GOALS,
  type WeeklyGoal,
} from '@/lib/weekly-goals'

// « Mes objectifs de la semaine » — l'élève se fixe 1 à 3 objectifs, les coche,
// la liste se remet à zéro chaque lundi (le serveur purge les autres semaines).
// La liste locale se resynchronise sur ce que renvoie chaque action (migration
// 157). `initial`/`weekStart` : les objectifs de la semaine courante.
export default function WeeklyGoalsCard({
  initial,
  weekStart,
}: {
  initial: WeeklyGoal[]
  weekStart: string
}) {
  const [goals, setGoals] = useState<WeeklyGoal[]>(initial)
  const [text, setText] = useState('')
  const [error, setError] = useState(false)
  const [pending, startTransition] = useTransition()

  const { done, total } = weeklyGoalsProgress(goals, weekStart)
  const isFull = total >= MAX_WEEKLY_GOALS

  // Après une action : on ne garde que la semaine courante (le serveur a déjà
  // purgé les autres, mais on refiltre par sûreté).
  const sync = (list: WeeklyGoal[]) => setGoals(goalsForWeek(list, weekStart))

  const add = () => {
    const t = text.trim()
    if (t.length === 0 || isFull || pending) return
    sfx.tap()
    setError(false)
    startTransition(async () => {
      const res = await addWeeklyGoalAction(t, weekStart)
      if (res.ok) {
        sync(res.goals)
        setText('')
      } else {
        setError(true)
      }
    })
  }

  const toggle = (id: string) => {
    if (pending) return
    sfx.tap()
    setError(false)
    startTransition(async () => {
      const res = await toggleWeeklyGoalAction(id)
      if (res.ok) sync(res.goals)
      else setError(true)
    })
  }

  const remove = (id: string) => {
    if (pending) return
    setError(false)
    startTransition(async () => {
      const res = await removeWeeklyGoalAction(id)
      if (res.ok) sync(res.goals)
      else setError(true)
    })
  }

  return (
    <section
      aria-label="Mes objectifs de la semaine"
      className="moi-card rounded-[1.75rem] bg-white p-5"
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Target className="size-4.5" strokeWidth={2.2} aria-hidden="true" />
        </span>
        <h2 className="font-heading flex-1 text-lg font-extrabold text-foreground">
          Mes objectifs
        </h2>
        {total > 0 ? (
          <span className="shrink-0 text-xs font-bold text-primary tabular-nums">
            {done}/{total}
          </span>
        ) : null}
      </div>

      {goals.length > 0 ? (
        <ul className="mb-3 flex flex-col gap-2">
          {goals.map((g) => (
            <li key={g.id} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toggle(g.id)}
                disabled={pending}
                role="checkbox"
                aria-checked={g.done}
                aria-label={g.done ? `Décocher : ${g.text}` : `Cocher : ${g.text}`}
                className={cn(
                  'flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition active:scale-90',
                  g.done
                    ? 'border-success bg-success text-white'
                    : 'border-border bg-white text-transparent',
                )}
              >
                <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
              </button>
              <span
                className={cn(
                  'min-w-0 flex-1 text-sm font-medium',
                  g.done
                    ? 'text-muted-foreground line-through'
                    : 'text-foreground',
                )}
              >
                {g.text}
              </span>
              <button
                type="button"
                onClick={() => remove(g.id)}
                disabled={pending}
                aria-label={`Retirer ${g.text}`}
                className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted active:scale-90"
              >
                <X className="size-4" strokeWidth={2.4} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mb-3 rounded-xl bg-muted/40 px-3 py-2.5 text-center text-xs text-muted-foreground">
          Fixe-toi 1 à 3 objectifs pour la semaine — coche-les au fur et à mesure.
        </p>
      )}

      {!isFull ? (
        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') add()
            }}
            maxLength={200}
            placeholder="Ex. 3 sessions de maths"
            aria-label="Nouvel objectif de la semaine"
            className="min-h-11 min-w-0 flex-1 rounded-2xl border border-border bg-muted/40 px-3 text-sm font-medium text-foreground"
          />
          <button
            type="button"
            onClick={add}
            disabled={text.trim().length === 0 || pending}
            aria-label="Ajouter cet objectif"
            className={cn(
              'flex min-h-11 shrink-0 items-center gap-1.5 rounded-full bg-primary px-4 font-heading text-sm font-extrabold text-primary-foreground shadow-sm transition active:translate-y-px',
              (text.trim().length === 0 || pending) && 'opacity-60',
            )}
          >
            <Plus className="size-4" strokeWidth={2.8} aria-hidden="true" />
            {pending ? '…' : 'Ajouter'}
          </button>
        </div>
      ) : (
        <p className="text-center text-xs font-medium text-muted-foreground">
          Objectifs de la semaine au complet — beau programme !
        </p>
      )}

      {error ? (
        <p
          role="alert"
          className="mt-3 rounded-2xl bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive"
        >
          Impossible d&apos;enregistrer pour le moment. Réessaie.
        </p>
      ) : null}
    </section>
  )
}
