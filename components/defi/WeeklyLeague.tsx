'use client'

import { Fragment, useMemo, useState } from 'react'
import type { League, LeaguePlayer, LeagueZone } from '@/lib/defi/types'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ClockIcon,
} from './icons'

interface WeeklyLeagueProps {
  league: League
  // true = classement de démonstration (visiteur / migration absente) :
  // badge « Aperçu » pour ne jamais faire passer le mock pour du réel.
  isDemo?: boolean
}

function zoneOf(
  rank: number,
  total: number,
  promotionCount: number,
  relegationCount: number,
): LeagueZone {
  if (rank <= promotionCount) return 'promotion'
  if (rank > total - relegationCount) return 'relegation'
  return 'safe'
}

/**
 * Ligue hebdomadaire : classement de 30, avec zones de promotion (vert) et de
 * relégation (corail). En replié, on montre le top 5, les 3 joueurs autour de
 * toi et le bottom 5 ; « Voir tout » déplie l'intégralité.
 */
export default function WeeklyLeague({ league, isDemo = false }: WeeklyLeagueProps) {
  const [expanded, setExpanded] = useState(false)
  const { players, promotionCount, relegationCount } = league
  const total = players.length
  const me = players.find((p) => p.isMe)

  // Rangs visibles en mode replié : top 5 ∪ {moi-1, moi, moi+1} ∪ bottom 5.
  const collapsedRanks = useMemo(() => {
    const set = new Set<number>()
    for (let r = 1; r <= promotionCount; r++) set.add(r)
    for (let r = total - relegationCount + 1; r <= total; r++) set.add(r)
    if (me) {
      for (const r of [me.rank - 1, me.rank, me.rank + 1]) {
        if (r >= 1 && r <= total) set.add(r)
      }
    }
    return set
  }, [me, promotionCount, relegationCount, total])

  const visible = expanded
    ? players
    : players.filter((p) => collapsedRanks.has(p.rank))

  return (
    <div>
      {/* La monnaie de la ligue, dite explicitement : l'XP de la semaine —
          à ne pas confondre avec les trophées des Classements. */}
      <p className="flex items-center justify-between gap-2 px-4 pt-2 text-[0.7rem] font-bold text-white/55">
        <span>Classement à l&apos;XP gagnée cette semaine</span>
        {isDemo ? (
          <span className="shrink-0 rounded-full bg-highlight/25 px-2 py-0.5 text-[10px] font-extrabold text-white/85">
            Aperçu
          </span>
        ) : null}
      </p>

      {/* Légende des zones + rappel du reset hebdomadaire */}
      <div className="flex items-center gap-4 px-4 py-2 text-[0.7rem] font-bold">
        <span className="defi2-promo-ink flex items-center gap-1">
          <ArrowUpIcon className="size-3.5" />
          Promotion (top {promotionCount})
        </span>
        <span className="flex items-center gap-1 text-[oklch(0.72_0.17_25)]">
          <ArrowDownIcon className="size-3.5" />
          Relégation
        </span>
        <span className="ml-auto flex items-center gap-1 text-white/50">
          <ClockIcon className="size-3.5" />
          {league.resetLabel}
        </span>
      </div>

      {/* Classement */}
      <ol>
        {visible.map((player, i) => {
          const prev = visible[i - 1]
          const gap = prev && player.rank - prev.rank > 1
          return (
            <Fragment key={player.id}>
              {gap ? (
                <li
                  className="py-1 text-center text-sm font-bold text-white/30 select-none"
                  aria-hidden
                >
                  ···
                </li>
              ) : null}
              <PlayerRow
                player={player}
                zone={zoneOf(
                  player.rank,
                  total,
                  promotionCount,
                  relegationCount,
                )}
              />
            </Fragment>
          )
        })}
      </ol>

      {/* Bascule Voir tout / Réduire */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-center gap-1 border-t border-white/10 bg-white/5 py-2.5 text-sm font-extrabold text-highlight transition-colors hover:bg-white/8 focus-visible:ring-2 focus-visible:ring-highlight/40 focus-visible:outline-none"
        aria-expanded={expanded}
      >
        {expanded ? (
          <>
            Réduire <ChevronUpIcon className="size-4" />
          </>
        ) : (
          <>
            Voir tout ({total}) <ChevronDownIcon className="size-4" />
          </>
        )}
      </button>
    </div>
  )
}

const ZONE_BG: Record<LeagueZone, string> = {
  promotion: 'defi2-zone-promo',
  safe: '',
  relegation: 'defi2-zone-releg',
}

function PlayerRow({
  player,
  zone,
}: {
  player: LeaguePlayer
  zone: LeagueZone
}) {
  const rowBg = player.isMe
    ? 'bg-highlight/15 ring-1 ring-inset ring-highlight/60'
    : ZONE_BG[zone]

  return (
    <li
      className={`flex items-center gap-3 px-4 py-2 ${rowBg}`}
      aria-current={player.isMe ? 'true' : undefined}
    >
      <span
        className={`w-6 text-center font-heading text-sm font-extrabold ${
          zone === 'promotion'
            ? 'defi2-promo-ink'
            : zone === 'relegation'
              ? 'text-[oklch(0.72_0.17_25)]'
              : 'text-white/45'
        }`}
      >
        {player.rank}
      </span>
      <span className="text-xl leading-none" aria-hidden>
        {player.avatar}
      </span>
      <span className="min-w-0 flex-1 truncate font-bold text-white/90">
        {player.name}
        {player.isMe ? (
          <span className="ml-1.5 rounded-full bg-highlight px-1.5 py-0.5 text-[0.6rem] font-extrabold text-[oklch(0.24_0.06_75)]">
            TOI
          </span>
        ) : null}
      </span>
      <span className="shrink-0 text-sm font-extrabold text-white tabular-nums">
        {player.weeklyXp}{' '}
        <span className="text-xs font-bold text-white/45">XP</span>
      </span>
    </li>
  )
}
