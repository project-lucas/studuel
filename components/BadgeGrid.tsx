import { cn } from '@/lib/utils'
import type { Badge } from '@/lib/types'

export type RecordsData = {
  longestStreak: number
  maxSessionsDay: number
  anchoredDays: number
  anchoredTitle: string | null
}

// Bloc 4 de Moi — records personnels et grille de badges
// (débloqués en couleur, verrouillés grisés).
export default function BadgeGrid({
  badges,
  unlockedIds,
  records,
}: {
  badges: Badge[]
  unlockedIds: Set<string>
  records: RecordsData
}) {
  return (
    <section
      aria-label="Records et badges"
      className="moi-card rounded-[1.75rem] bg-white p-5"
    >
      <h2 className="font-heading mb-3 text-lg font-bold">Records & badges</h2>

      {/* Records */}
      <div className="mb-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-muted/60 p-3">
          <p className="font-mono text-xl font-bold tabular-nums">
            {records.longestStreak}
          </p>
          <p className="text-[11px] text-muted-foreground">
            jours de série (record)
          </p>
        </div>
        <div className="rounded-xl bg-muted/60 p-3">
          <p className="font-mono text-xl font-bold tabular-nums">
            {records.maxSessionsDay}
          </p>
          <p className="text-[11px] text-muted-foreground">
            sessions max en 1 jour
          </p>
        </div>
        <div className="rounded-xl bg-muted/60 p-3">
          <p className="font-mono text-xl font-bold tabular-nums">
            {records.anchoredDays}
          </p>
          <p className="text-[11px] text-muted-foreground">
            {records.anchoredTitle
              ? `jours d'ancrage (${records.anchoredTitle})`
              : "jours d'ancrage (habitude)"}
          </p>
        </div>
      </div>

      {/* Badges */}
      <ul className="grid grid-cols-4 gap-2 sm:grid-cols-8">
        {badges.map((badge, i) => {
          const unlocked = unlockedIds.has(badge.id)
          return (
            <li
              key={badge.id}
              title={`${badge.title} — ${badge.description}${unlocked ? '' : ' (à débloquer)'}`}
              style={{ animationDelay: `${i * 50}ms` }}
              className={cn(
                'pop-in relative flex flex-col items-center gap-1 rounded-xl p-2 text-center transition-all',
                unlocked ? 'bg-highlight/15' : 'opacity-45 grayscale',
              )}
            >
              <span className="text-2xl leading-none drop-shadow-sm" aria-hidden="true">
                {badge.icon}
              </span>
              <span className="text-[10px] leading-tight font-semibold">
                {badge.title}
              </span>
              {/* Critère de déblocage + statut : lisibles au lecteur d'écran. */}
              <span className="sr-only">
                {badge.description}
                {unlocked ? ' — débloqué' : ' — à débloquer'}
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
