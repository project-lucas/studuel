'use client'

import { Swords, Zap } from 'lucide-react'
import { DUEL_XP_BONUS } from '@/lib/social'
import { useDuelLaunch } from '@/components/amis/useDuelLaunch'
import type { RankRow } from '@/lib/trophies'

/**
 * Le rival direct — LA action du jour de l'onglet : « Rayan est à +12 🏆 »,
 * un bouton « Défier ». C'est la mise en scène du duel réel (create_duel,
 * 1/jour, +XP) qui était noyé dans les lignes du classement.
 */
export default function RivalCard({
  rival,
  myTrophies,
  onDuelBlocked,
}: {
  rival: RankRow
  myTrophies: number
  onDuelBlocked: () => void
}) {
  const { launch, launching } = useDuelLaunch(onDuelBlocked)
  const gap = Math.max(1, rival.trophies - myTrophies)

  return (
    <section
      aria-label="Ton rival du moment"
      className="flex items-center gap-3 rounded-3xl bg-highlight/20 p-3.5 ring-1 ring-highlight/40"
    >
      <span
        aria-hidden="true"
        className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-highlight/40 text-2xl"
      >
        ⚔️
      </span>
      <span className="min-w-0 flex-1">
        <span className="font-heading block truncate text-[0.95rem] font-extrabold text-foreground">
          {rival.name} est à +{gap} 🏆
        </span>
        <span className="block text-xs font-semibold text-muted-foreground">
          Gagne ton duel du jour pour{' '}
          {gap <= 15 ? 'doubler ce rival' : 'te rapprocher'}
        </span>
      </span>
      <button
        type="button"
        disabled={launching}
        onClick={() => launch(rival.id)}
        aria-label={`Défier ${rival.name} (+${DUEL_XP_BONUS} XP)`}
        className="font-heading flex shrink-0 cursor-pointer items-center gap-1 rounded-full bg-highlight px-3.5 py-2 text-sm font-extrabold text-foreground shadow-sm transition active:translate-y-px disabled:opacity-60"
      >
        <Swords className="size-4" strokeWidth={2.6} aria-hidden="true" />
        Défier
        <span className="flex items-center font-mono text-[11px] font-bold tabular-nums">
          <Zap className="size-3" aria-hidden="true" />+{DUEL_XP_BONUS}
        </span>
      </button>
    </section>
  )
}
