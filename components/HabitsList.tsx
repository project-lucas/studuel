'use client'

import { useState, useTransition } from 'react'
import { Check, Plus, X, Zap, Bus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import {
  addHabit,
  removeHabit,
  toggleHabitLog,
  saveCommuteSlots,
} from '@/app/moi/actions'
import type { Habit, HabitCatalogEntry, CommuteSlot } from '@/lib/types'

// Bloc 2 de Moi — les habitudes clés : check manuel quotidien ou validation
// automatique (révision, trajets), avec le pourquoi scientifique affiché.
export default function HabitsList({
  habits,
  catalog,
  todayByHabit,
  today,
  commuteSlots,
}: {
  habits: Habit[]
  catalog: HabitCatalogEntry[]
  todayByHabit: Record<string, boolean>
  today: string
  commuteSlots: CommuteSlot[]
}) {
  const [showCatalog, setShowCatalog] = useState(false)
  const [pending, startTransition] = useTransition()

  const activeCatalogIds = new Set(habits.map((h) => h.catalog_id))
  const available = catalog.filter((c) => !activeCatalogIds.has(c.id))
  const hasCommuteHabit = habits.some(
    (h) => h.habit_catalog?.validation_type === 'auto_commute',
  )

  return (
    <section
      aria-label="Mes habitudes clés"
      className="rounded-2xl border bg-card p-4 shadow-sm"
    >
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-heading text-lg font-bold">Mes habitudes clés</h2>
        {available.length > 0 ? (
          <Button
            size="sm"
            variant={showCatalog ? 'secondary' : 'outline'}
            onClick={() => setShowCatalog((v) => !v)}
          >
            <Plus className="size-3.5" />
            {showCatalog ? 'Fermer' : 'Ajouter'}
          </Button>
        ) : null}
      </div>

      {habits.length === 0 && !showCatalog ? (
        <p className="text-sm text-muted-foreground">
          Ajoute tes premières habitudes — c&apos;est elles qui font monter les
          notes.
        </p>
      ) : null}

      <ul className="flex flex-col gap-2">
        {habits.map((habit) => {
          const entry = habit.habit_catalog
          if (!entry) return null
          const done = todayByHabit[habit.id] ?? false
          const isAuto = entry.validation_type !== 'manual'

          return (
            <li
              key={habit.id}
              className="group flex items-start gap-3 rounded-xl border p-3"
            >
              {/* Check du jour */}
              {isAuto ? (
                <span
                  title="Validée automatiquement par tes sessions"
                  className={cn(
                    'mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full',
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
                  title={done ? 'Fait aujourd’hui' : 'Marquer comme fait'}
                  onClick={() =>
                    startTransition(async () => {
                      await toggleHabitLog(habit.id, today, !done)
                      if (!done) sfx.correct()
                    })
                  }
                  className={cn(
                    'mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full border-2 transition-all active:scale-90',
                    done
                      ? 'border-transparent bg-highlight text-foreground'
                      : 'border-muted-foreground/30 hover:border-primary',
                  )}
                >
                  {done ? <Check className="size-4" strokeWidth={3} /> : null}
                </button>
              )}

              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-2 text-sm font-semibold">
                  <span className="text-base leading-none">{entry.icon}</span>
                  {entry.title}
                  {isAuto ? (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary uppercase">
                      auto
                    </span>
                  ) : null}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  {entry.rationale}
                </p>

                {/* Créneaux trajets pour l'habitude auto_commute */}
                {entry.validation_type === 'auto_commute' ? (
                  <form
                    action={saveCommuteSlots}
                    className="mt-2 flex flex-wrap items-center gap-1.5 text-xs"
                  >
                    <span className="text-muted-foreground">Trajets :</span>
                    <Input
                      type="time"
                      name="start1"
                      defaultValue={commuteSlots[0]?.start ?? ''}
                      className="h-7 w-24 text-xs"
                    />
                    <span className="text-muted-foreground">→</span>
                    <Input
                      type="time"
                      name="end1"
                      defaultValue={commuteSlots[0]?.end ?? ''}
                      className="h-7 w-24 text-xs"
                    />
                    <Input
                      type="time"
                      name="start2"
                      defaultValue={commuteSlots[1]?.start ?? ''}
                      className="h-7 w-24 text-xs"
                    />
                    <span className="text-muted-foreground">→</span>
                    <Input
                      type="time"
                      name="end2"
                      defaultValue={commuteSlots[1]?.end ?? ''}
                      className="h-7 w-24 text-xs"
                    />
                    <Button type="submit" size="xs" variant="secondary">
                      OK
                    </Button>
                  </form>
                ) : null}
              </div>

              <button
                type="button"
                title="Retirer cette habitude"
                disabled={pending}
                onClick={() => {
                  if (confirm(`Retirer « ${entry.title} » ?`)) {
                    startTransition(() => removeHabit(habit.id))
                  }
                }}
                className="text-muted-foreground/40 opacity-0 transition-all group-hover:opacity-100 hover:text-destructive focus-visible:opacity-100"
              >
                <X className="size-4" />
              </button>
            </li>
          )
        })}
      </ul>

      {/* Catalogue */}
      {showCatalog ? (
        <div className="mt-3 border-t pt-3">
          <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase">
            Catalogue
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
                  <p className="text-xs text-muted-foreground">{entry.rationale}</p>
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

      {hasCommuteHabit && commuteSlots.length === 0 ? (
        <p className="mt-3 text-xs text-amber-700 dark:text-amber-400">
          💡 Renseigne tes horaires de trajet ci-dessus pour que tes quiz en
          déplacement soient détectés automatiquement.
        </p>
      ) : null}
    </section>
  )
}
