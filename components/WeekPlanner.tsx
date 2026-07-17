'use client'

import { useState, useTransition, type ReactNode } from 'react'
import {
  Backpack,
  BedDouble,
  BookOpen,
  Bus,
  CalendarCheck,
  Check,
  Clock,
  Croissant,
  Dumbbell,
  Footprints,
  GlassWater,
  Lock,
  MonitorOff,
  NotebookPen,
  PhoneOff,
  Sparkles,
  Target,
  Trash2,
  Wind,
  X,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import {
  habitDays,
  habitTimeForDay,
  habitDuration,
  PLANIFIER_CATALOG_ID,
} from '@/lib/habits'
import { formatDuration } from '@/lib/time'
import { toast } from '@/lib/toast'
import {
  addEvent,
  removeEvent,
  setEventDuration,
  toggleHabitLog,
  saveCommuteSlots,
} from '@/app/moi/actions'
import type { Habit, HabitCatalogEntry, CommuteSlot } from '@/lib/types'

const WEEKDAYS = [
  'Lundi',
  'Mardi',
  'Mercredi',
  'Jeudi',
  'Vendredi',
  'Samedi',
  'Dimanche',
]

// Durées proposées (minutes) pour un événement.
const DURATION_OPTIONS = [10, 15, 20, 30, 45, 60, 90, 120]

// L'émoji du catalogue est remplacé par une icône ligne (style produit) :
// icône encre sur pastille encre pâle (cohérent avec le reste de l'app).
const iconProps = { className: 'size-4', strokeWidth: 2.2 }
const ICONS: Record<string, ReactNode> = {
  '😴': <BedDouble {...iconProps} />,
  '🎯': <Target {...iconProps} />,
  '🚌': <Bus {...iconProps} />,
  '⚽': <Dumbbell {...iconProps} />,
  '📖': <BookOpen {...iconProps} />,
  '🌙': <MonitorOff {...iconProps} />,
  '🥐': <Croissant {...iconProps} />,
  '📵': <PhoneOff {...iconProps} />,
  '🗓': <CalendarCheck {...iconProps} />,
  '💧': <GlassWater {...iconProps} />,
  '🚶': <Footprints {...iconProps} />,
  '📓': <NotebookPen {...iconProps} />,
  '🎒': <Backpack {...iconProps} />,
  '🧘': <Wind {...iconProps} />,
}

function IconTile({ entry }: { entry: HabitCatalogEntry }) {
  // U+FE0F (sélecteur de variante) est retiré : « 🗓️ » et « 🗓 » → même clé.
  const key = [...entry.icon]
    .filter((c) => c.codePointAt(0) !== 0xfe0f)
    .join('')
  return (
    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
      {ICONS[key] ?? <Sparkles {...iconProps} />}
    </span>
  )
}

// -----------------------------------------------------------------------------
// « Mon planning » : les missions d'un jour de la semaine (À faire / Fait) —
// aujourd'hui par défaut, ou le jour choisi dans la barre « Ta série » —
// et l'éditeur « Ma semaine type ». Chaque mission est liée à des jours,
// avec une heure propre à chaque jour.
// -----------------------------------------------------------------------------
const MONTHS_SHORT = [
  'janv.',
  'févr.',
  'mars',
  'avr.',
  'mai',
  'juin',
  'juil.',
  'août',
  'sept.',
  'oct.',
  'nov.',
  'déc.',
]

export default function WeekPlanner({
  habits,
  catalog,
  doneByHabit,
  dayIdx,
  todayIdx,
  date,
  commuteSlots,
}: {
  habits: Habit[]
  catalog: HabitCatalogEntry[]
  // Validations du jour affiché : habit_id → complétée ?
  doneByHabit: Record<string, boolean>
  dayIdx: number // jour affiché (0 = lundi)
  todayIdx: number
  date: string // clé 'YYYY-MM-DD' du jour affiché
  commuteSlots: CommuteSlot[]
}) {
  const [editing, setEditing] = useState(false)
  const [tab, setTab] = useState<'todo' | 'done'>('todo')
  const [pending, startTransition] = useTransition()

  const isToday = dayIdx === todayIdx
  const isFuture = dayIdx > todayIdx
  const dateLabel = `${Number(date.slice(8, 10))} ${MONTHS_SHORT[Number(date.slice(5, 7)) - 1]}`

  // Formulaire « Ajouter un événement ».
  const [typeId, setTypeId] = useState('')
  const [formDay, setFormDay] = useState(dayIdx)
  const [formTime, setFormTime] = useState('')
  const [formDuration, setFormDuration] = useState(60)

  const byTime = (day: number) => (a: Habit, b: Habit) =>
    (habitTimeForDay(a, day) ?? '99:99').localeCompare(
      habitTimeForDay(b, day) ?? '99:99',
    )

  const missions = habits
    .filter((h) => habitDays(h).includes(dayIdx))
    .sort(byTime(dayIdx))
  const todo = missions.filter((h) => !doneByHabit[h.id])
  const done = missions.filter((h) => doneByHabit[h.id])
  const shown = tab === 'todo' ? todo : done

  const hasCommute = habits.some(
    (h) => h.habit_catalog?.validation_type === 'auto_commute',
  )

  const submitEvent = () => {
    if (!typeId) return
    sfx.tap()
    startTransition(async () => {
      try {
        await addEvent(typeId, formDay, formTime || null, formDuration)
      } catch {
        toast("Impossible d'ajouter — réessaie.", 'error')
        return
      }
      toast('Ajouté à ton planning ✓')
      sfx.correct()
      // Formulaire prêt pour l'ajout suivant (le jour choisi est conservé).
      setTypeId('')
      setFormTime('')
    })
  }

  return (
    <section aria-label="Mon planning">
      {/* ------------------------------------------------------------ header */}
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="font-heading text-lg font-bold">
          {editing ? (
            'Ma semaine type'
          ) : (
            <>
              {WEEKDAYS[dayIdx]}{' '}
              <span className="font-normal text-muted-foreground">
                · {isToday ? "aujourd'hui" : dateLabel}
              </span>
            </>
          )}
        </h2>
        <button
          type="button"
          onClick={() => {
            sfx.tap()
            setEditing((v) => !v)
          }}
          className={cn(
            'shrink-0 text-sm font-semibold transition-colors',
            editing
              ? 'rounded-full border bg-card px-4 py-1.5 shadow-sm hover:bg-muted'
              : 'text-foreground hover:underline',
          )}
        >
          {editing ? 'Terminé' : 'Modifier ma semaine'}
        </button>
      </div>

      {!editing ? (
        /* ------------------------------------------------- vue du jour */
        <>
          {/* onglets À faire / Fait */}
          <div className="mb-5 grid grid-cols-2 gap-1 rounded-full bg-muted p-1">
            {(
              [
                ['todo', `À faire (${todo.length})`],
                ['done', `Fait (${done.length})`],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                aria-pressed={tab === key}
                onClick={() => {
                  sfx.tap()
                  setTab(key)
                }}
                className={cn(
                  'rounded-full py-1.5 text-sm font-semibold transition-all',
                  tab === key
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground',
                )}
              >
                {label}
              </button>
            ))}
          </div>

          <p className="mb-3 text-[11px] font-bold tracking-wide text-muted-foreground uppercase">
            Mon planning
          </p>

          {shown.length === 0 ? (
            <p className="rounded-xl border-2 border-dashed border-muted-foreground/20 p-5 text-center text-sm text-muted-foreground">
              {tab === 'todo'
                ? missions.length === 0
                  ? 'Repos — rien de prévu ce jour-là.'
                  : isFuture
                    ? 'Rien à voir ici… pour l’instant.'
                    : 'Tout est fait — rien ne traîne. Solide.'
                : isFuture
                  ? 'Ce jour n’est pas encore arrivé.'
                  : 'Rien de validé ce jour-là.'}
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {shown.map((habit, i) => {
                const entry = habit.habit_catalog
                if (!entry) return null
                const isAuto = entry.validation_type !== 'manual'
                const time = habitTimeForDay(habit, dayIdx)
                const isDone = tab === 'done'

                return (
                  <li
                    key={habit.id}
                    style={{ animationDelay: `${i * 60}ms` }}
                    className={cn(
                      'pop-in flex items-center gap-3 rounded-xl border border-l-4 bg-card p-3 shadow-sm',
                      isDone
                        ? 'border-l-green-500 opacity-80'
                        : 'border-l-primary',
                    )}
                  >
                    <IconTile entry={entry} />
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
                          <Clock className="size-3" /> {time}
                        </span>
                      ) : null}
                    </span>

                    {isFuture ? (
                      /* jour à venir : prévu, rien à pointer */
                      <span
                        title="Prévu — ce jour n'est pas encore arrivé"
                        className="flex size-9 shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 text-muted-foreground/40"
                      >
                        <Clock className="size-4" />
                      </span>
                    ) : isAuto ? (
                      <span
                        title="Validée automatiquement par tes sessions"
                        className={cn(
                          'flex size-9 shrink-0 items-center justify-center rounded-lg border',
                          isDone
                            ? 'border-transparent bg-highlight text-foreground'
                            : 'text-muted-foreground',
                        )}
                      >
                        {entry.validation_type === 'auto_commute' ? (
                          <Bus className="size-4" />
                        ) : (
                          <Zap className="size-4" />
                        )}
                      </span>
                    ) : !isDone ? (
                      <button
                        type="button"
                        disabled={pending}
                        title={
                          isToday
                            ? 'Marquer comme fait'
                            : `Marquer comme fait (${dateLabel})`
                        }
                        onClick={() =>
                          startTransition(async () => {
                            await toggleHabitLog(habit.id, date, true)
                            sfx.correct()
                          })
                        }
                        className="flex size-9 shrink-0 items-center justify-center rounded-lg border text-muted-foreground transition-all hover:border-emerald-400 hover:text-emerald-500 active:scale-90"
                      >
                        <Check className="size-4" strokeWidth={3} />
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={pending}
                        title="Annuler la validation"
                        onClick={() => {
                          sfx.tap()
                          startTransition(() =>
                            toggleHabitLog(habit.id, date, false),
                          )
                        }}
                        className="flex size-9 shrink-0 items-center justify-center rounded-lg border text-muted-foreground transition-all hover:border-destructive hover:text-destructive active:scale-90"
                      >
                        <X className="size-4" />
                      </button>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </>
      ) : (
        /* --------------------------------------------- éditeur semaine type */
        <div className="flex flex-col gap-4">
          {/* Ajouter un événement */}
          <div className="rounded-xl border bg-muted/30 p-4">
            <p className="mb-3 text-sm font-bold text-foreground">
              Ajouter un événement
            </p>
            <label className="mb-1 block text-xs font-semibold text-muted-foreground">
              Type
            </label>
            <select
              value={typeId}
              onChange={(e) => setTypeId(e.target.value)}
              className="mb-3 h-10 w-full rounded-lg border bg-background px-3 text-sm"
            >
              <option value="">Choisis une mission…</option>
              {catalog
                .filter((c) => c.id !== PLANIFIER_CATALOG_ID)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
            </select>

            <div className="mb-3 grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                  Jour
                </label>
                <select
                  value={formDay}
                  onChange={(e) => setFormDay(Number(e.target.value))}
                  className="h-10 w-full rounded-lg border bg-background px-3 text-sm"
                >
                  {WEEKDAYS.map((d, i) => (
                    <option key={d} value={i}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                  Heure
                </label>
                <Input
                  type="time"
                  value={formTime}
                  onChange={(e) => setFormTime(e.target.value)}
                  className="h-10 w-full text-sm"
                />
              </div>
            </div>

            <label className="mb-1 block text-xs font-semibold text-muted-foreground">
              Durée
            </label>
            <select
              value={formDuration}
              onChange={(e) => setFormDuration(Number(e.target.value))}
              className="mb-3 h-10 w-full rounded-lg border bg-background px-3 text-sm"
            >
              {DURATION_OPTIONS.map((m) => (
                <option key={m} value={m}>
                  {formatDuration(m)}
                </option>
              ))}
            </select>

            <Button
              type="button"
              disabled={pending || !typeId}
              onClick={submitEvent}
              className="h-10 w-full rounded-xl font-semibold"
            >
              Ajouter
            </Button>
          </div>

          {/* La semaine, jour par jour */}
          {WEEKDAYS.map((dayName, d) => {
            const events = habits
              .filter((h) => habitDays(h).includes(d))
              .sort(byTime(d))
            return (
              <div key={dayName}>
                <p className="mb-1.5 text-sm font-bold text-foreground">
                  {dayName}
                  {d === todayIdx ? (
                    <span className="ml-1.5 font-normal text-muted-foreground">
                      · aujourd&apos;hui
                    </span>
                  ) : null}
                </p>
                {events.length === 0 ? (
                  <p className="rounded-xl border border-dashed p-2.5 text-xs text-muted-foreground">
                    Repos — rien de prévu.
                  </p>
                ) : (
                  <ul className="flex flex-col gap-1.5">
                    {events.map((habit) => {
                      const entry = habit.habit_catalog
                      if (!entry) return null
                      const isFixed = habit.catalog_id === PLANIFIER_CATALOG_ID
                      const time = habitTimeForDay(habit, d)
                      return (
                        <li
                          key={habit.id}
                          className="flex items-center gap-3 rounded-xl border bg-card p-2.5 shadow-sm"
                        >
                          <IconTile entry={entry} />
                          <span className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">
                            {entry.title}
                          </span>
                          {time ? (
                            <span className="shrink-0 text-xs font-medium tabular-nums text-muted-foreground">
                              {time}
                            </span>
                          ) : null}
                          {!isFixed ? (
                            <select
                              aria-label={`Durée de « ${entry.title} »`}
                              value={habitDuration(habit)}
                              disabled={pending}
                              onChange={(e) =>
                                startTransition(() =>
                                  setEventDuration(
                                    habit.id,
                                    Number(e.target.value),
                                  ),
                                )
                              }
                              className="h-8 shrink-0 rounded-lg border bg-background px-2 text-xs text-muted-foreground disabled:opacity-50"
                            >
                              {DURATION_OPTIONS.map((m) => (
                                <option key={m} value={m}>
                                  {formatDuration(m)}
                                </option>
                              ))}
                            </select>
                          ) : null}
                          {isFixed ? (
                            <span
                              title="Rituel Studuel — chaque dimanche, pour tous"
                              className="flex size-8 shrink-0 items-center justify-center text-muted-foreground/50"
                            >
                              <Lock className="size-3.5" />
                            </span>
                          ) : (
                            <button
                              type="button"
                              disabled={pending}
                              title={`Retirer « ${entry.title} » du ${dayName.toLowerCase()}`}
                              onClick={() => {
                                sfx.tap()
                                startTransition(() =>
                                  removeEvent(habit.id, d),
                                )
                              }}
                              className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground/50 transition-colors hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            )
          })}

          {/* Créneaux trajets : alimentent la validation auto « quiz trajets » */}
          {hasCommute ? (
            <form
              action={saveCommuteSlots}
              className="flex flex-wrap items-center gap-1.5 rounded-xl border bg-muted/30 p-3 text-xs"
            >
              <span className="flex w-full items-center gap-1.5 font-bold text-foreground">
                <Bus className="size-3.5 text-primary" /> Mes trajets
                (validation auto des quiz)
              </span>
              <Input type="time" name="start1" defaultValue={commuteSlots[0]?.start ?? ''} className="h-8 w-24 text-xs" />
              <span className="text-muted-foreground">→</span>
              <Input type="time" name="end1" defaultValue={commuteSlots[0]?.end ?? ''} className="h-8 w-24 text-xs" />
              <Input type="time" name="start2" defaultValue={commuteSlots[1]?.start ?? ''} className="h-8 w-24 text-xs" />
              <span className="text-muted-foreground">→</span>
              <Input type="time" name="end2" defaultValue={commuteSlots[1]?.end ?? ''} className="h-8 w-24 text-xs" />
              <Button type="submit" size="xs" variant="secondary">
                OK
              </Button>
            </form>
          ) : null}
        </div>
      )}
    </section>
  )
}
