// -----------------------------------------------------------------------------
// Ligue hebdomadaire — logique pure (convention projet). L'XP de la semaine est
// calculée côté base (RPC league_standings, migration 161) ; ici on normalise le
// résultat et on le met en forme pour le composant WeeklyLeague. Les paliers vont
// de Bronze (0) à Maître (5) ; chaque lundi, les 5 premiers montent, les 5
// derniers descendent (traité par le cron).
// -----------------------------------------------------------------------------

import type { League, LeaguePlayer } from '@/lib/defi/types'

export const LEAGUE_TIERS: readonly { name: string; icon: string }[] = [
  { name: 'Ligue Bronze', icon: '🥉' },
  { name: 'Ligue Argent', icon: '🥈' },
  { name: 'Ligue Or', icon: '🥇' },
  { name: 'Ligue Platine', icon: '💎' },
  { name: 'Ligue Diamant', icon: '🔷' },
  { name: 'Ligue Maître', icon: '👑' },
]

export const LEAGUE_PROMOTE = 5
export const LEAGUE_RELEGATE = 5
export const MAX_TIER = LEAGUE_TIERS.length - 1

export function tierMeta(tier: number): { name: string; icon: string } {
  const t = Number.isFinite(tier) ? Math.max(0, Math.min(Math.round(tier), MAX_TIER)) : 0
  return LEAGUE_TIERS[t]
}

export type LeagueStandingEntry = {
  id: string
  name: string
  weeklyXp: number
  rank: number
}

export type LeagueStandings = {
  tier: number
  myRank: number | null
  total: number
  entries: LeagueStandingEntry[]
}

const int = (v: unknown): number => {
  const n = Number(v)
  return Number.isFinite(n) ? Math.round(n) : 0
}

export function normalizeLeagueStandings(raw: unknown): LeagueStandings {
  const o = (raw ?? {}) as Record<string, unknown>
  const entries = Array.isArray(o.entries)
    ? o.entries.flatMap((e) => {
        const eo = (e ?? {}) as Record<string, unknown>
        const id = String(eo.id ?? '')
        if (id.length === 0) return []
        return [
          {
            id,
            name: String(eo.name ?? 'Élève').trim() || 'Élève',
            weeklyXp: Math.max(0, int(eo.weekly_xp)),
            rank: Math.max(1, int(eo.rank)),
          },
        ]
      })
    : []
  entries.sort((a, b) => a.rank - b.rank)
  const myRankRaw = o.my_rank
  return {
    tier: Math.max(0, Math.min(int(o.tier), MAX_TIER)),
    myRank:
      myRankRaw === null || myRankRaw === undefined ? null : Math.max(1, int(myRankRaw)),
    total: Math.max(0, int(o.total)),
    entries,
  }
}

// Met en forme le classement pour le composant WeeklyLeague. `avatarFor` fournit
// l'emoji d'avatar (injecté pour garder ce module découplé).
export function buildLeague(
  standings: LeagueStandings,
  myId: string,
  avatarFor: (id: string) => string,
): League {
  const meta = tierMeta(standings.tier)
  const players: LeaguePlayer[] = standings.entries.map((e) => ({
    id: e.id,
    rank: e.rank,
    name: e.id === myId ? 'Toi' : e.name,
    avatar: avatarFor(e.id),
    weeklyXp: e.weeklyXp,
    isMe: e.id === myId,
  }))
  return {
    name: meta.name,
    tierIcon: meta.icon,
    resetLabel: 'Reset lundi',
    players,
    // Pas de promotion depuis le sommet, pas de relégation depuis le bas.
    promotionCount: standings.tier < MAX_TIER ? LEAGUE_PROMOTE : 0,
    relegationCount: standings.tier > 0 ? LEAGUE_RELEGATE : 0,
  }
}
