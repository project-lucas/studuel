'use client'

import { useState, useTransition } from 'react'
import { Check, Gift, Gem, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { claimDailyQuests } from '@/app/defi/hebdo-actions'
import {
  ALL_DONE_GEMS,
  ALL_DONE_XP,
  BONUS_STEP_ID,
  allDone,
  doneCount,
  questsHeadline,
  type QuestView,
} from '@/lib/quests'

/**
 * Les trois quêtes du jour. Le rendez-vous quotidien : ce bloc répond à
 * « qu'est-ce que je fais maintenant ? » avant même que la question se pose.
 *
 * Il ne calcule aucune récompense : les vues arrivent résolues du serveur
 * (lib/quests-server.fetchQuestViews) et les montants sont recalculés en base
 * à la réclamation. Une quête déjà payée reste affichée, cochée et grisée —
 * l'élève voit ce qu'il a accompli aujourd'hui, pas une liste qui se vide.
 */
export default function DailyQuests({
  views,
  claimedIds,
}: {
  views: QuestView[]
  claimedIds: string[]
}) {
  const [paid, setPaid] = useState<Set<string>>(new Set(claimedIds))
  const [pending, startTransition] = useTransition()
  const [reward, setReward] = useState<{ xp: number; gems: number } | null>(null)

  if (views.length === 0) return null

  const done = doneCount(views)
  const complete = allDone(views)

  // Ce qui est encaissable MAINTENANT : les quêtes finies et pas encore payées,
  // plus le bonus si les trois sont bouclées et qu'il n'a jamais été versé.
  const pendingViews = views.filter((v) => v.done && !paid.has(v.def.id))
  const bonusDue = complete && !paid.has(BONUS_STEP_ID)
  const claimableXp =
    pendingViews.reduce((s, v) => s + v.def.xp, 0) + (bonusDue ? ALL_DONE_XP : 0)
  const claimableGems =
    pendingViews.reduce((s, v) => s + v.def.gems, 0) + (bonusDue ? ALL_DONE_GEMS : 0)
  const claimable = claimableXp > 0 || claimableGems > 0

  const claim = () => {
    if (!claimable || pending) return
    sfx.complete()
    startTransition(async () => {
      const r = await claimDailyQuests()
      if (!r.claimed) return
      setPaid((prev) => {
        const next = new Set(prev)
        for (const v of pendingViews) next.add(v.def.id)
        if (r.allDone) next.add(BONUS_STEP_ID)
        return next
      })
      setReward({ xp: r.xp, gems: r.gems })
    })
  }

  return (
    <section className="rounded-2xl border bg-card p-4 shadow-sm">
      <header className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h2 className="font-heading text-lg font-bold">Quêtes du jour</h2>
          <p className="truncate text-sm text-muted-foreground">
            {questsHeadline(views)}
          </p>
        </div>
        <span
          className={cn(
            'shrink-0 rounded-full px-3 py-1 font-mono text-sm font-bold tabular-nums',
            complete ? 'bg-highlight text-foreground' : 'bg-muted',
          )}
        >
          {done}/{views.length}
        </span>
      </header>

      <ul className="mt-3 space-y-2">
        {views.map((v) => {
          const encaissee = paid.has(v.def.id)
          return (
            <li key={v.def.id} className="flex items-center gap-3">
              <span
                className={cn(
                  'flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                  v.done
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-muted-foreground/30',
                )}
                aria-hidden="true"
              >
                {v.done ? <Check className="size-3.5" strokeWidth={3} /> : null}
              </span>

              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    'truncate text-sm font-medium',
                    v.done && 'text-muted-foreground',
                    encaissee && 'line-through',
                  )}
                >
                  {v.def.label}
                </p>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${Math.round(v.ratio * 100)}%` }}
                  />
                </div>
              </div>

              <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
                {encaissee ? '💎' : v.label}
              </span>
            </li>
          )
        })}
      </ul>

      {claimable ? (
        <Button
          onClick={claim}
          disabled={pending}
          className="mt-4 h-12 w-full font-bold"
          size="lg"
        >
          <Gift className="mr-2 size-5" />
          <span className="flex items-center gap-2">
            Encaisser
            <span className="flex items-center gap-1 font-mono tabular-nums">
              <Zap className="size-4" />
              {claimableXp}
              <Gem className="ml-1 size-4" />
              {claimableGems}
            </span>
          </span>
        </Button>
      ) : reward ? (
        <p className="animate-in zoom-in mt-4 flex items-center justify-center gap-2 rounded-xl bg-highlight px-4 py-2.5 text-sm font-bold">
          +{reward.xp} XP · +{reward.gems} 💎
        </p>
      ) : (
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {done === 0
            ? 'Termine une quête pour encaisser'
            : 'Tout est encaissé — reviens demain !'}
        </p>
      )}

      {/* La promesse du bonus doit être visible AVANT d'être atteignable :
          c'est elle qui fait viser les trois. */}
      {!complete ? (
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Boucle les 3 quêtes : +{ALL_DONE_XP} XP et +{ALL_DONE_GEMS} 💎 de bonus
        </p>
      ) : null}
    </section>
  )
}
