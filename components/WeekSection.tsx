'use client'

import { useState } from 'react'
import WeekStrip from '@/components/WeekStrip'
import WeekPlanner from '@/components/WeekPlanner'
import DisciplineCalendar, {
  type DayStatus,
} from '@/components/DisciplineCalendar'
import type { Habit, HabitCatalogEntry, CommuteSlot } from '@/lib/types'

// -----------------------------------------------------------------------------
// « Ta série » + « Mon planning », reliés : cliquer un cercle de la semaine
// affiche le planning de ce jour-là (fait / à faire) dans le bloc du dessous.
// L'icône agenda de « Ta série » déplie le calendrier « Ma discipline ».
// -----------------------------------------------------------------------------
export default function WeekSection({
  week,
  streak,
  weekDates,
  todayIdx,
  habits,
  catalog,
  doneByDate,
  dayStatuses,
  commuteSlots,
}: {
  week: { done: boolean; isToday: boolean; isFuture: boolean }[]
  streak: number
  weekDates: string[] // les 7 clés 'YYYY-MM-DD' de la semaine courante (L→D)
  todayIdx: number
  habits: Habit[]
  catalog: HabitCatalogEntry[]
  // Validations de la semaine : date → (habit_id → complétée ?)
  doneByDate: Record<string, Record<string, boolean>>
  // Statut de chaque journée sur un an, pour le calendrier « Ma discipline ».
  dayStatuses: Record<string, DayStatus>
  commuteSlots: CommuteSlot[]
}) {
  const [dayIdx, setDayIdx] = useState(todayIdx)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const date = weekDates[dayIdx]

  return (
    <>
      {/* Une seule carte : la série et le planning du jour font un tout. */}
      <section className="moi-card rounded-[1.75rem] bg-white p-5">
        <WeekStrip
          week={week}
          streak={streak}
          selectedIdx={dayIdx}
          onSelectDay={setDayIdx}
          onOpenCalendar={() => setCalendarOpen(true)}
        />

        {/* Simple respiration entre la série et le planning — pas de trait. */}
        <div aria-hidden="true" className="h-6" />

        {/* key : changer de jour repart d'un bloc propre (onglet À faire). */}
        <WeekPlanner
          key={dayIdx}
          habits={habits}
          catalog={catalog}
          doneByHabit={doneByDate[date] ?? {}}
          dayIdx={dayIdx}
          todayIdx={todayIdx}
          date={date}
          commuteSlots={commuteSlots}
        />
      </section>

      {/* Monté seulement ouvert : réouvre toujours sur le mois courant. */}
      {calendarOpen ? (
        <DisciplineCalendar
          dayStatuses={dayStatuses}
          today={weekDates[todayIdx]}
          onClose={() => setCalendarOpen(false)}
        />
      ) : null}
    </>
  )
}
