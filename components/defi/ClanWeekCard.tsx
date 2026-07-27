'use client'

import { useState, useTransition } from 'react'
import { Users, Timer, Gift, Crown, School } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { claimClanWeek } from '@/app/defi/hebdo-actions'
import {
  countdownLabel,
  gapHeadline,
  isEndgame,
  myShare,
  type ClanWeekBoard,
} from '@/lib/clan-week'

/**
 * Le clan de la semaine : le compte à rebours, la place de l'école, et ce que
 * l'élève y a personnellement apporté.
 *
 * Ce bloc porte la rétention à 30 jours : on ne revient pas pour soi, on revient
 * parce que le classement se clôt dimanche et que le clan compte les points.
 * D'où la hiérarchie visuelle : le compte à rebours et l'écart avec le clan du
 * dessus passent AVANT le classement lui-même.
 */
export default function ClanWeekCard({
  board,
  today,
  /** Coffre de la semaine précédente, réclamable une seule fois. */
  pendingReward,
}: {
  board: ClanWeekBoard
  today: string
  pendingReward: { weekKey: string; label: string } | null
}) {
  const [claimed, setClaimed] = useState<{ gems: number; xp: number } | null>(null)
  const [pending, startTransition] = useTransition()

  const mine = board.myClan
  const endgame = isEndgame(today)
  const share = myShare(board)

  const claim = () => {
    if (!pendingReward || pending) return
    sfx.complete()
    startTransition(async () => {
      const r = await claimClanWeek(pendingReward.weekKey)
      if (r.claimed) setClaimed({ gems: r.gems, xp: r.xp })
    })
  }

  return (
    <section className="rounded-2xl border bg-card p-4 shadow-sm">
      <header className="flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 font-heading text-lg font-bold">
          <Users className="size-5 text-primary" />
          Clan de la semaine
        </h2>
        <span
          className={cn(
            'flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-xs font-bold',
            endgame ? 'bg-destructive text-destructive-foreground' : 'bg-muted',
          )}
        >
          <Timer className="size-3.5" />
          {countdownLabel(today)}
        </span>
      </header>

      {/* Le coffre de la semaine passée, s'il attend : il passe DEVANT tout le
          reste — une récompense non réclamée est la meilleure raison de revenir. */}
      {pendingReward && !claimed ? (
        <Button
          onClick={claim}
          disabled={pending}
          size="lg"
          className="mt-3 h-12 w-full font-bold"
        >
          <Gift className="mr-2 size-5" />
          {pendingReward.label}
        </Button>
      ) : null}
      {claimed ? (
        <p className="animate-in zoom-in mt-3 rounded-xl bg-highlight px-4 py-2.5 text-center text-sm font-bold">
          Coffre du clan ouvert : +{claimed.gems} 💎 · +{claimed.xp} XP
        </p>
      ) : null}

      {mine ? (
        <>
          <div className="mt-3 flex items-baseline justify-between gap-2">
            <p className="flex min-w-0 items-center gap-1.5">
              <School className="size-4 shrink-0 text-muted-foreground" />
              <span className="truncate font-semibold">{mine.schoolName}</span>
            </p>
            <span className="shrink-0 font-mono text-lg font-bold tabular-nums">
              {mine.rank === 1 ? '🥇' : `#${mine.rank}`}
            </span>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">{gapHeadline(board)}</p>

          {/* Ma part dans le total : la contribution personnelle doit être
              lisible, sinon le classement du clan reste abstrait. */}
          <div className="mt-3 rounded-xl bg-muted/60 p-3">
            <div className="flex items-baseline justify-between text-sm">
              <span className="font-semibold">Ton apport</span>
              <span className="font-mono font-bold tabular-nums">
                {board.myPoints.toLocaleString('fr-FR')} pts
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-background">
              <div
                className="h-full rounded-full bg-primary transition-all duration-700"
                style={{ width: `${share}%` }}
              />
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">
              {share}% des {mine.points.toLocaleString('fr-FR')} points du clan ·{' '}
              {mine.members} joueur{mine.members > 1 ? 's' : ''}
            </p>
          </div>

          {board.topMembers.length > 0 ? (
            <ol className="mt-3 space-y-1.5">
              {board.topMembers.slice(0, 3).map((m, i) => (
                <li key={m.id} className="flex items-center gap-2 text-sm">
                  <span className="w-5 shrink-0 text-center">
                    {i === 0 ? <Crown className="mx-auto size-4 text-highlight" /> : i + 1}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{m.name}</span>
                  <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
                    {m.points.toLocaleString('fr-FR')}
                  </span>
                </li>
              ))}
            </ol>
          ) : null}
        </>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">
          Rejoins ton école dans ton profil pour jouer avec ton clan cette semaine.
        </p>
      )}
    </section>
  )
}
