import { Flag, Star, Layers, Flame } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Milestone, MilestoneKind } from '@/lib/milestones'

// Icône + teinte (rôles du design system) par type de jalon.
const KIND_STYLE: Record<
  MilestoneKind,
  { Icon: typeof Flag; ring: string; text: string }
> = {
  first: { Icon: Flag, ring: 'bg-primary/12', text: 'text-primary' },
  perfect: { Icon: Star, ring: 'bg-highlight/20', text: 'text-highlight' },
  volume: { Icon: Layers, ring: 'bg-primary/12', text: 'text-primary' },
  streak: { Icon: Flame, ring: 'bg-highlight/20', text: 'text-highlight' },
}

// Formate une clé jour UTC 'YYYY-MM-DD' en « 13 juil. 2026 » (en UTC pour éviter
// tout décalage de fuseau).
function frenchDate(key: string): string {
  const d = new Date(`${key}T00:00:00Z`)
  if (Number.isNaN(d.getTime())) return key
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

// « Journal de progression » — timeline verticale des jalons du parcours, du plus
// récent au plus ancien (cf. lib/milestones). Purement présentationnel.
export default function MilestonesTimeline({
  milestones,
}: {
  milestones: Milestone[]
}) {
  return (
    <section
      aria-label="Journal de progression"
      className="moi-card rounded-[1.75rem] bg-white p-5"
    >
      <div className="mb-4 flex items-center gap-2">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Flag className="size-4.5" strokeWidth={2.2} aria-hidden="true" />
        </span>
        <h2 className="font-heading text-lg font-extrabold text-foreground">
          Ton parcours
        </h2>
      </div>

      {milestones.length === 0 ? (
        <p className="rounded-2xl bg-muted/40 px-3 py-3 text-center text-xs text-muted-foreground">
          Tes premiers jalons apparaîtront ici — termine une leçon ou joue un quiz
          pour lancer ton journal.
        </p>
      ) : (
        <ol className="relative flex flex-col gap-3 pl-1">
          {milestones.map((m, i) => {
            const { Icon, ring, text } = KIND_STYLE[m.kind]
            const isLast = i === milestones.length - 1
            return (
              <li key={`${m.date}-${m.label}`} className="flex gap-3">
                {/* Pastille + trait de liaison façon frise. */}
                <div className="flex flex-col items-center">
                  <span
                    className={cn(
                      'flex size-8 shrink-0 items-center justify-center rounded-full',
                      ring,
                      text,
                    )}
                  >
                    <Icon className="size-4" strokeWidth={2.4} aria-hidden="true" />
                  </span>
                  {!isLast ? (
                    <span
                      aria-hidden="true"
                      className="mt-1 w-0.5 flex-1 rounded-full bg-border"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 pb-1">
                  <p className="text-sm font-semibold text-foreground">
                    {m.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {frenchDate(m.date)}
                  </p>
                </div>
              </li>
            )
          })}
        </ol>
      )}
    </section>
  )
}
