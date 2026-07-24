'use client'

import { Lock, Check } from 'lucide-react'
import { MAX_EQUIPPED, type BadgeState } from '@/lib/badges'
import { cn } from '@/lib/utils'

// La galerie des badges : catalogue complet, acquis en couleur, verrouillés
// grisés avec leur condition en indice. En mode édition, un tap sur un badge
// ACQUIS l'ajoute/retire des favoris mis en avant (max 3, ordre conservé).
export default function BadgeGallery({
  badges,
  equippedIds,
  editing = false,
  onToggle,
}: {
  badges: BadgeState[]
  equippedIds: string[]
  editing?: boolean
  onToggle?: (id: string) => void
}) {
  const earnedCount = badges.filter((b) => b.earned).length
  const rank = (id: string) => equippedIds.indexOf(id)

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-sm font-extrabold tracking-wide text-white uppercase">
          Badges
        </h3>
        <span className="text-[11px] font-semibold text-white/60 tabular-nums">
          {earnedCount}/{badges.length}
          {editing ? ` · ${equippedIds.length}/${MAX_EQUIPPED} en avant` : ''}
        </span>
      </div>

      <ul className="grid grid-cols-4 gap-2" role="list">
        {badges.map((b) => {
          const equipped = rank(b.id) !== -1
          const interactive = editing && b.earned
          const Wrapper = interactive ? 'button' : 'div'
          return (
            <li key={b.id}>
              <Wrapper
                {...(interactive
                  ? {
                      type: 'button' as const,
                      onClick: () => onToggle?.(b.id),
                      'aria-pressed': equipped,
                      'aria-label': `${equipped ? 'Retirer' : 'Mettre en avant'} le badge ${b.title}`,
                    }
                  : {})}
                title={b.earned ? b.title : `${b.title} — ${b.description}`}
                className={cn(
                  'relative flex aspect-square w-full flex-col items-center justify-center rounded-2xl p-1 text-center transition-transform',
                  b.earned
                    ? 'olympe-glass'
                    : 'border border-dashed border-white/15 bg-black/20',
                  interactive && 'cursor-pointer active:scale-95',
                  equipped && 'ring-2 ring-highlight',
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn('text-2xl', !b.earned && 'opacity-30 grayscale')}
                >
                  {b.icon}
                </span>
                {!b.earned ? (
                  <Lock
                    className="absolute right-1 top-1 size-3 text-white/40"
                    aria-hidden="true"
                  />
                ) : null}
                {editing && equipped ? (
                  <span className="absolute -top-1.5 -left-1.5 flex size-5 items-center justify-center rounded-full bg-highlight text-[10px] font-extrabold text-foreground tabular-nums">
                    {rank(b.id) + 1}
                  </span>
                ) : null}
                {!editing && b.earned && equipped ? (
                  <Check
                    className="absolute right-1 top-1 size-3 text-highlight"
                    aria-hidden="true"
                  />
                ) : null}
              </Wrapper>
            </li>
          )
        })}
      </ul>

      {editing ? (
        <p className="text-[11px] leading-snug text-white/50">
          Touche un badge acquis pour le mettre en avant sur ta carte (3 max).
        </p>
      ) : null}
    </div>
  )
}
