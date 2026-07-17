'use client'

import { useTransition } from 'react'
import { Bus, Check, Clock, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { habitDays, habitTimeForDay } from '@/lib/habits'
import { toggleHabitLog } from '@/app/moi/actions'
import HabitIcon from '@/components/HabitIcon'
import type { Habit } from '@/lib/types'

// -----------------------------------------------------------------------------
// « Missions du jour » : la checklist du jour, toujours visible sous le tableau
// de l'année (plus besoin d'ouvrir l'onglet Habitudes pour pointer). Compacte :
// une ligne par mission, coche directe (toggleHabitLog), compteur x/y.
// Le planning complet (semaine type, autres jours) reste dans l'onglet.
// -----------------------------------------------------------------------------
export default function MissionsJour({
  habits,
  doneByHabit,
  todayIdx,
  date,
}: {
  habits: Habit[]
  // Validations du jour : habit_id → complétée ?
  doneByHabit: Record<string, boolean>
  todayIdx: number // 0 = lundi
  date: string // clé 'YYYY-MM-DD' du jour
}) {
  const [pending, startTransition] = useTransition()

  const missions = habits
    .filter((h) => habitDays(h).includes(todayIdx))
    .sort((a, b) =>
      (habitTimeForDay(a, todayIdx) ?? '99:99').localeCompare(
        habitTimeForDay(b, todayIdx) ?? '99:99',
      ),
    )
  const doneCount = missions.filter((h) => doneByHabit[h.id]).length

  return (
    <section
      aria-label="Missions du jour"
      className="moi-card rounded-[1.75rem] bg-white p-4"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="font-heading text-base font-extrabold text-foreground">
          Missions du jour
        </h2>
        <span
          className={cn(
            'rounded-full px-2.5 py-1 font-mono text-xs font-extrabold tabular-nums',
            missions.length > 0 && doneCount === missions.length
              ? 'bg-highlight text-foreground'
              : 'bg-primary/10 text-primary',
          )}
          aria-label={`${doneCount} mission${doneCount > 1 ? 's' : ''} sur ${missions.length} accomplie${doneCount > 1 ? 's' : ''}`}
        >
          {doneCount}/{missions.length}
        </span>
      </div>

      {missions.length === 0 ? (
        <p className="rounded-xl border-2 border-dashed border-muted-foreground/20 p-4 text-center text-sm text-muted-foreground">
          Repos — rien de prévu aujourd&apos;hui. Ajoute des missions dans
          l&apos;onglet Habitudes.
        </p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {missions.map((habit) => {
            const entry = habit.habit_catalog
            if (!entry) return null
            const isAuto = entry.validation_type !== 'manual'
            const isDone = Boolean(doneByHabit[habit.id])
            const time = habitTimeForDay(habit, todayIdx)

            return (
              <li
                key={habit.id}
                className={cn(
                  'flex items-center gap-3 rounded-xl border border-l-4 bg-card p-2.5',
                  isDone ? 'border-l-green-500 opacity-75' : 'border-l-primary',
                )}
              >
                <HabitIcon entry={entry} />
                <span className="min-w-0 flex-1">
                  <span
                    className={cn(
                      'block truncate text-sm font-bold text-foreground',
                      isDone && 'text-muted-foreground line-through',
                    )}
                  >
                    {entry.title}
                  </span>
                  {time ? (
                    <span className="flex items-center gap-1 text-[11px] font-medium tabular-nums text-muted-foreground">
                      <Clock className="size-3" aria-hidden="true" /> {time}
                    </span>
                  ) : null}
                </span>

                {isAuto ? (
                  <span
                    title="Validée automatiquement par tes sessions"
                    className={cn(
                      'flex size-8 shrink-0 items-center justify-center rounded-lg border',
                      isDone
                        ? 'border-transparent bg-highlight text-foreground'
                        : 'text-muted-foreground',
                    )}
                  >
                    {entry.validation_type === 'auto_commute' ? (
                      <Bus className="size-4" aria-hidden="true" />
                    ) : (
                      <Zap className="size-4" aria-hidden="true" />
                    )}
                  </span>
                ) : (
                  <button
                    type="button"
                    disabled={pending}
                    aria-pressed={isDone}
                    title={isDone ? 'Annuler la validation' : 'Marquer comme fait'}
                    onClick={() =>
                      startTransition(async () => {
                        await toggleHabitLog(habit.id, date, !isDone)
                        if (!isDone) sfx.correct()
                        else sfx.tap()
                      })
                    }
                    className={cn(
                      'flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border transition-all duration-200 active:scale-90',
                      isDone
                        ? 'border-transparent bg-green-500 text-white hover:bg-green-600'
                        : 'text-muted-foreground hover:border-emerald-400 hover:text-emerald-500',
                    )}
                  >
                    <Check className="size-4" strokeWidth={3} aria-hidden="true" />
                  </button>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
