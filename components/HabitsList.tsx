'use client'

import { useTransition } from 'react'
import { useState } from 'react'
import { Check, Plus, X, Zap, Bus, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import {
  habitDays,
  habitTime,
  PLANIFIER_CATALOG_ID,
} from '@/lib/habits'
import {
  addHabit,
  removeHabit,
  toggleHabitLog,
  updateHabitSchedule,
  saveCommuteSlots,
} from '@/app/moi/actions'
import type { Habit, HabitCatalogEntry, CommuteSlot } from '@/lib/types'

const DAY_LETTERS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

// -----------------------------------------------------------------------------
// Réglage d'une mission : jours de la semaine + heure.
// -----------------------------------------------------------------------------
function ScheduleEditor({ habit }: { habit: Habit }) {
  const [pending, startTransition] = useTransition()
  const days = habitDays(habit)
  const time = habitTime(habit)

  const toggleDay = (d: number) => {
    const next = days.includes(d) ? days.filter((x) => x !== d) : [...days, d]
    if (next.length === 0) return // au moins un jour
    sfx.tap()
    startTransition(() => updateHabitSchedule(habit.id, next, time))
  }

  return (
    <div className="mt-2 flex flex-wrap items-center gap-2">
      <div className="flex gap-1">
        {DAY_LETTERS.map((letter, d) => (
          <button
            key={d}
            type="button"
            disabled={pending}
            aria-pressed={days.includes(d)}
            onClick={() => toggleDay(d)}
            className={cn(
              'flex size-7 items-center justify-center rounded-full text-[11px] font-bold transition-all active:scale-90',
              days.includes(d)
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/70',
            )}
          >
            {letter}
          </button>
        ))}
      </div>
      <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Clock className="size-3.5" />
        <Input
          type="time"
          defaultValue={time ?? ''}
          disabled={pending}
          onChange={(e) =>
            startTransition(() =>
              updateHabitSchedule(habit.id, days, e.target.value || null),
            )
          }
          className="h-7 w-24 text-xs"
        />
      </label>
    </div>
  )
}

// -----------------------------------------------------------------------------
// Missions du jour : les habitudes planifiées aujourd'hui, cochables.
// ⚙️ ouvre le mode réglage (jours, heure, suppression, catalogue).
// -----------------------------------------------------------------------------
export default function HabitsList({
  habits,
  catalog,
  todayByHabit,
  today,
  todayIdx,
  commuteSlots,
}: {
  habits: Habit[]
  catalog: HabitCatalogEntry[]
  todayByHabit: Record<string, boolean>
  today: string
  todayIdx: number
  commuteSlots: CommuteSlot[]
}) {
  const [settings, setSettings] = useState(false)
  const [pending, startTransition] = useTransition()

  const activeCatalogIds = new Set(habits.map((h) => h.catalog_id))
  const available = catalog.filter((c) => !activeCatalogIds.has(c.id))

  const missionsToday = habits
    .filter((h) => habitDays(h).includes(todayIdx))
    .sort((a, b) => (habitTime(a) ?? '99:99').localeCompare(habitTime(b) ?? '99:99'))
  const doneCount = missionsToday.filter((h) => todayByHabit[h.id]).length

  return (
    <section
      aria-label="Missions du jour"
      className="rounded-2xl border bg-card p-4 shadow-sm"
    >
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-heading text-lg font-bold">
          {settings ? 'Régler mes missions' : 'Missions du jour'}
        </h2>
        <div className="flex items-center gap-2">
          {!settings ? (
            <span className="font-mono text-xs tabular-nums text-muted-foreground">
              {doneCount}/{missionsToday.length}
            </span>
          ) : null}
          <button
            type="button"
            aria-label={settings ? 'Fermer les réglages' : 'Régler mes missions'}
            title={settings ? 'Fermer les réglages' : 'Changer, supprimer, planifier'}
            onClick={() => {
              sfx.tap()
              setSettings((v) => !v)
            }}
            className={cn(
              'flex size-8 items-center justify-center rounded-full text-base transition-all active:scale-90',
              settings ? 'bg-primary text-primary-foreground' : 'hover:bg-muted',
            )}
          >
            {settings ? <Check className="size-4" /> : '⚙️'}
          </button>
        </div>
      </div>

      {/* ------------------------------------------------ vue du jour */}
      {!settings ? (
        missionsToday.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Rien de prévu aujourd&apos;hui — ouvre ⚙️ pour planifier tes
            missions.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {missionsToday.map((habit, i) => {
              const entry = habit.habit_catalog
              if (!entry) return null
              const done = todayByHabit[habit.id] ?? false
              const isAuto = entry.validation_type !== 'manual'
              const time = habitTime(habit)

              return (
                <li
                  key={habit.id}
                  className="pop-in flex items-center gap-3 rounded-xl border p-3"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  {isAuto ? (
                    <span
                      title="Validée automatiquement par tes sessions"
                      className={cn(
                        'flex size-9 shrink-0 items-center justify-center rounded-full',
                        done
                          ? 'bg-highlight text-foreground'
                          : 'bg-muted text-muted-foreground',
                      )}
                    >
                      {entry.validation_type === 'auto_commute' ? (
                        <Bus className="size-4" />
                      ) : (
                        <Zap className="size-4" />
                      )}
                    </span>
                  ) : (
                    <button
                      type="button"
                      disabled={pending}
                      aria-pressed={done}
                      title={done ? 'Fait !' : 'Marquer comme fait'}
                      onClick={() =>
                        startTransition(async () => {
                          await toggleHabitLog(habit.id, today, !done)
                          if (!done) sfx.correct()
                        })
                      }
                      className={cn(
                        'flex size-9 shrink-0 items-center justify-center rounded-full border-2 transition-all active:scale-90',
                        done
                          ? 'border-transparent bg-highlight text-foreground'
                          : 'border-muted-foreground/30 hover:border-primary',
                      )}
                    >
                      {done ? <Check className="size-4" strokeWidth={3} /> : null}
                    </button>
                  )}

                  <span className="min-w-0 flex-1">
                    <span
                      className={cn(
                        'flex items-center gap-2 text-sm font-semibold',
                        done && 'text-muted-foreground line-through',
                      )}
                    >
                      <span className="text-base leading-none">{entry.icon}</span>
                      {entry.title}
                    </span>
                  </span>

                  {time ? (
                    <span className="flex shrink-0 items-center gap-1 rounded-full bg-muted px-2 py-0.5 font-mono text-[11px] tabular-nums text-muted-foreground">
                      <Clock className="size-3" /> {time}
                    </span>
                  ) : null}
                </li>
              )
            })}
          </ul>
        )
      ) : (
        /* ------------------------------------------------ mode réglage */
        <div className="flex flex-col gap-3">
          <ul className="flex flex-col gap-2">
            {habits.map((habit) => {
              const entry = habit.habit_catalog
              if (!entry) return null
              const isFixed = habit.catalog_id === PLANIFIER_CATALOG_ID
              const isCommute = entry.validation_type === 'auto_commute'

              return (
                <li key={habit.id} className="group rounded-xl border p-3">
                  <div className="flex items-start gap-2">
                    <span className="text-xl leading-none">{entry.icon}</span>
                    <div className="min-w-0 flex-1">
                      <p className="flex flex-wrap items-center gap-2 text-sm font-semibold">
                        {entry.title}
                        {entry.validation_type !== 'manual' ? (
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary uppercase">
                            auto
                          </span>
                        ) : null}
                        {isFixed ? (
                          <span className="rounded-full bg-highlight px-2 py-0.5 text-[10px] font-bold text-foreground uppercase">
                            fixe · pour tous
                          </span>
                        ) : null}
                      </p>
                      <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                        {entry.rationale}
                      </p>

                      {/* Jours + heure — la mission fixe ne se déplace pas */}
                      {isFixed ? (
                        <p className="mt-2 text-xs font-medium text-muted-foreground">
                          🗓️ Chaque dimanche — non modifiable : c&apos;est le
                          rituel Scolaria.
                        </p>
                      ) : (
                        <ScheduleEditor habit={habit} />
                      )}

                      {/* Créneaux trajets pour l'habitude auto_commute */}
                      {isCommute ? (
                        <form
                          action={saveCommuteSlots}
                          className="mt-2 flex flex-wrap items-center gap-1.5 text-xs"
                        >
                          <span className="text-muted-foreground">Trajets :</span>
                          <Input type="time" name="start1" defaultValue={commuteSlots[0]?.start ?? ''} className="h-7 w-24 text-xs" />
                          <span className="text-muted-foreground">→</span>
                          <Input type="time" name="end1" defaultValue={commuteSlots[0]?.end ?? ''} className="h-7 w-24 text-xs" />
                          <Input type="time" name="start2" defaultValue={commuteSlots[1]?.start ?? ''} className="h-7 w-24 text-xs" />
                          <span className="text-muted-foreground">→</span>
                          <Input type="time" name="end2" defaultValue={commuteSlots[1]?.end ?? ''} className="h-7 w-24 text-xs" />
                          <Button type="submit" size="xs" variant="secondary">
                            OK
                          </Button>
                        </form>
                      ) : null}
                    </div>

                    {!isFixed ? (
                      <button
                        type="button"
                        title="Supprimer cette mission"
                        disabled={pending}
                        onClick={() => {
                          if (confirm(`Retirer « ${entry.title} » ?`)) {
                            startTransition(() => removeHabit(habit.id))
                          }
                        }}
                        className="text-muted-foreground/40 transition-colors hover:text-destructive"
                      >
                        <X className="size-4" />
                      </button>
                    ) : null}
                  </div>
                </li>
              )
            })}
          </ul>

          {/* Catalogue : en ajouter */}
          {available.length > 0 ? (
            <div className="border-t pt-3">
              <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase">
                Ajouter une mission
              </p>
              <ul className="flex flex-col gap-2">
                {available.map((entry) => (
                  <li
                    key={entry.id}
                    className="flex items-start gap-3 rounded-xl bg-muted/50 p-3"
                  >
                    <span className="text-xl leading-none">{entry.icon}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">{entry.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {entry.rationale}
                      </p>
                    </div>
                    <Button
                      size="xs"
                      disabled={pending}
                      onClick={() =>
                        startTransition(async () => {
                          await addHabit(entry.id)
                          sfx.correct()
                        })
                      }
                    >
                      <Plus className="size-3" /> Ajouter
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}
    </section>
  )
}
