// -----------------------------------------------------------------------------
// Ligue hebdomadaire — logique pure (convention projet). L'XP de la semaine est
// calculée côté base (RPC league_standings, migration 161) ; ici on normalise le
// résultat et on le met en forme pour le composant WeeklyLeague. Les paliers —
// des DIVISIONS, comme chez Duolingo — vont de Bronze (0) à Diamant (5) ;
// chaque lundi, les 5 premiers montent, les 5 derniers descendent (traité par
// le cron). ⚠️ SIX paliers, pas un de plus : le cron SQL (161/164) borne le
// palier à MAX_TIER — renommer est libre, en ajouter demande une migration.
// -----------------------------------------------------------------------------

import type { League, LeaguePlayer, LeagueZone } from '@/lib/defi/types'

export type LeagueTier = {
  name: string
  icon: string
  /**
   * LA COULEUR DU BOUCLIER de la division, et sa version sombre (le bord).
   * Ce sont des IDENTITÉS de palier — le bronze est cuivré, le saphir est
   * bleu — pas des rôles de la DA : comme les teintes des outils de Marcel,
   * elles ne touchent que le dessin du bouclier, jamais un fond, un texte ni
   * un bouton.
   */
  couleur: string
  couleurSombre: string
}

export const LEAGUE_TIERS: readonly LeagueTier[] = [
  {
    name: 'Division Bronze',
    icon: '🥉',
    couleur: 'oklch(0.72 0.11 55)',
    couleurSombre: 'oklch(0.52 0.1 50)',
  },
  {
    name: 'Division Argent',
    icon: '🥈',
    couleur: 'oklch(0.84 0.02 250)',
    couleurSombre: 'oklch(0.62 0.03 250)',
  },
  {
    name: 'Division Or',
    icon: '🥇',
    couleur: 'oklch(0.85 0.17 90)',
    couleurSombre: 'oklch(0.66 0.15 75)',
  },
  {
    name: 'Division Saphir',
    icon: '💎',
    couleur: 'oklch(0.62 0.19 262)',
    couleurSombre: 'oklch(0.44 0.17 262)',
  },
  {
    name: 'Division Émeraude',
    icon: '🟢',
    couleur: 'oklch(0.72 0.17 160)',
    couleurSombre: 'oklch(0.5 0.14 160)',
  },
  {
    name: 'Division Diamant',
    icon: '🔷',
    couleur: 'oklch(0.85 0.1 210)',
    couleurSombre: 'oklch(0.62 0.12 215)',
  },
]

export const LEAGUE_PROMOTE = 5
export const LEAGUE_RELEGATE = 5
// Le cron (161/164) ne relègue que si le palier compte PLUS de 10 joueurs
// (« pour ne pas vider les petits paliers ») — l'UI doit refléter la même
// règle, sinon elle peint une zone de relégation qui ne tombera jamais.
export const LEAGUE_RELEGATION_MIN_SIZE = 11
export const MAX_TIER = LEAGUE_TIERS.length - 1

export function tierMeta(tier: number): LeagueTier {
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
    tier: standings.tier,
    name: meta.name,
    tierIcon: meta.icon,
    resetLabel: 'Reset lundi',
    players,
    // Pas de promotion depuis le sommet ; pas de relégation depuis le bas,
    // ni dans un petit palier (le cron exige > 10 joueurs, cf. 161/164).
    promotionCount: standings.tier < MAX_TIER ? LEAGUE_PROMOTE : 0,
    relegationCount:
      standings.tier > 0 && standings.total >= LEAGUE_RELEGATION_MIN_SIZE
        ? LEAGUE_RELEGATE
        : 0,
  }
}

// --- Mise en page de la liste (rangs, zones, séparateurs) ---------------------
// Tout ce que le composant affiche est décidé ICI, pour être testable : la zone
// d'un rang, l'endroit exact où s'intercalent les bandeaux « ZONE DE
// PROMOTION » / « ZONE DE RELÉGATION », la phrase sous le titre, l'état de
// chaque bouclier du rail.

/** La zone d'un rang : promotion en tête, relégation en queue, sûr entre les deux. */
export function zoneOf(
  rank: number,
  total: number,
  promotionCount: number,
  relegationCount: number,
): LeagueZone {
  if (promotionCount > 0 && rank <= promotionCount) return 'promotion'
  if (relegationCount > 0 && rank > total - relegationCount) return 'relegation'
  return 'safe'
}

export type LeagueLine =
  | { kind: 'joueur'; player: LeaguePlayer; zone: LeagueZone }
  | { kind: 'separateur'; zone: 'promotion' | 'relegation' }

/**
 * La liste telle qu'elle se lit de haut en bas, séparateurs compris — le
 * geste de Duolingo : un bandeau vert SOUS la dernière place qui monte, un
 * bandeau corail AU-DESSUS de la première place qui descend. Pas de bandeau
 * quand la zone est vide (sommet sans promotion, petit palier sans
 * relégation), ni quand il tomberait en bord de liste où il ne séparerait
 * rien, ni deux bandeaux collés quand les zones se touchent.
 */
export function leagueLines(league: League): LeagueLine[] {
  const { players, promotionCount, relegationCount } = league
  const total = players.length
  const lines: LeagueLine[] = []
  const firstRelegated = total - relegationCount + 1
  players.forEach((player, i) => {
    const rank = player.rank
    if (
      relegationCount > 0 &&
      rank === firstRelegated &&
      i > 0 &&
      lines[lines.length - 1]?.kind !== 'separateur'
    ) {
      lines.push({ kind: 'separateur', zone: 'relegation' })
    }
    lines.push({
      kind: 'joueur',
      player,
      zone: zoneOf(rank, total, promotionCount, relegationCount),
    })
    if (
      promotionCount > 0 &&
      rank === promotionCount &&
      i < players.length - 1
    ) {
      lines.push({ kind: 'separateur', zone: 'promotion' })
    }
  })
  return lines
}

/** La règle de la semaine, dite en une phrase sous le nom de la division. */
export function promotionSentence(
  league: Pick<League, 'promotionCount'>,
): string {
  if (league.promotionCount <= 0) {
    return 'Tu es au sommet : reste dans le top pour y rester.'
  }
  return `Les ${league.promotionCount} premiers passent à la division supérieure`
}

export type TierEtat = 'passee' | 'courante' | 'verrouillee'

/** L'état d'un bouclier du rail, vu depuis la division courante. */
export function tierEtat(index: number, courante: number): TierEtat {
  if (index === courante) return 'courante'
  return index < courante ? 'passee' : 'verrouillee'
}
