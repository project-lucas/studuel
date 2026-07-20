import { CalendarHeart } from 'lucide-react'
import WeeklyRecapCard from '@/components/WeeklyRecapCard'
import WeeklyGoalsCard from '@/components/WeeklyGoalsCard'
import type { WeeklyRecap } from '@/lib/weekly-recap'
import type { WeeklyGoal } from '@/lib/weekly-goals'

// « Ma semaine » — une seule carte dense qui réunit ce qui était éparpillé sur
// trois cartes fines : les chiffres de la semaine (rétro) et les objectifs
// perso. Les deux sous-blocs sont rendus en mode `bare` (sans leur propre
// chrome) pour tenir dans un seul cadre, séparés d'un filet discret.
export default function SemaineCard({
  recap,
  streak,
  weekGoals,
  weekStart,
}: {
  recap: WeeklyRecap
  streak: number
  weekGoals: WeeklyGoal[]
  weekStart: string
}) {
  return (
    <section
      aria-label="Ma semaine"
      className="moi-card rounded-[1.75rem] bg-white p-5"
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CalendarHeart className="size-4.5" strokeWidth={2.2} aria-hidden="true" />
        </span>
        <h2 className="font-heading text-lg font-extrabold text-foreground">
          Ma semaine
        </h2>
      </div>

      <WeeklyRecapCard recap={recap} streak={streak} bare />

      <div aria-hidden="true" className="my-4 h-px bg-border/60" />

      <WeeklyGoalsCard initial={weekGoals} weekStart={weekStart} bare />
    </section>
  )
}
