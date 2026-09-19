import { describe, it, expect } from 'vitest'
import {
  tierMeta,
  normalizeLeagueStandings,
  buildLeague,
  zoneOf,
  leagueLines,
  promotionSentence,
  tierEtat,
  LEAGUE_TIERS,
  MAX_TIER,
} from '@/lib/league'
import type { League, LeaguePlayer } from '@/lib/defi/types'

const avatarFor = (id: string) => `emoji-${id}`

describe('tierMeta', () => {
  it('renvoie le palier, borné aux extrêmes', () => {
    expect(tierMeta(0).name).toBe('Division Bronze')
    expect(tierMeta(MAX_TIER).name).toBe('Division Diamant')
    expect(tierMeta(99)).toBe(LEAGUE_TIERS[MAX_TIER])
    expect(tierMeta(-5)).toBe(LEAGUE_TIERS[0])
  })
})

describe('normalizeLeagueStandings', () => {
  it('normalise et trie par rang', () => {
    const s = normalizeLeagueStandings({
      tier: 2,
      my_rank: 4,
      total: 12,
      entries: [
        { id: 'b', name: 'Bob', weekly_xp: 80, rank: 2 },
        { id: 'a', name: 'Ana', weekly_xp: 120, rank: 1 },
      ],
    })
    expect(s.tier).toBe(2)
    expect(s.myRank).toBe(4)
    expect(s.total).toBe(12)
    expect(s.entries.map((e) => e.rank)).toEqual([1, 2])
    expect(s.entries[0].name).toBe('Ana')
  })

  it('jette les entrées sans id, borne palier/xp/rang', () => {
    const s = normalizeLeagueStandings({
      tier: 99,
      entries: [{ weekly_xp: 5, rank: 1 }, { id: 'x', weekly_xp: -3, rank: 0 }],
    })
    expect(s.tier).toBe(MAX_TIER)
    expect(s.entries).toHaveLength(1)
    expect(s.entries[0].weeklyXp).toBe(0)
    expect(s.entries[0].rank).toBe(1)
  })

  it('forme vide → standings vides sûrs', () => {
    expect(normalizeLeagueStandings(null)).toEqual({
      tier: 0,
      myRank: null,
      total: 0,
      entries: [],
    })
  })
})

describe('buildLeague', () => {
  const standings = {
    tier: 0,
    myRank: 1,
    total: 2,
    entries: [
      { id: 'me', name: 'Lucas', weeklyXp: 200, rank: 1 },
      { id: 'z', name: 'Zoé', weeklyXp: 50, rank: 2 },
    ],
  }

  it('mappe en League avec « Toi », avatar injecté, zones promo/relégation', () => {
    const l = buildLeague(standings, 'me', avatarFor)
    expect(l.name).toBe('Division Bronze')
    expect(l.tier).toBe(0)
    expect(l.players[0]).toMatchObject({ name: 'Toi', isMe: true, avatar: 'emoji-me' })
    expect(l.players[1].name).toBe('Zoé')
    // Bronze : pas de relégation (palier le plus bas), promotion oui.
    expect(l.promotionCount).toBe(5)
    expect(l.relegationCount).toBe(0)
  })

  it('au palier max : promotion coupée, relégation active (si palier assez peuplé)', () => {
    const l = buildLeague(
      { ...standings, tier: MAX_TIER, total: 30 },
      'me',
      avatarFor,
    )
    expect(l.promotionCount).toBe(0)
    expect(l.relegationCount).toBe(5)
    expect(l.name).toBe('Division Diamant')
  })

  it('petit palier (≤ 10 joueurs) : pas de zone de relégation — le cron ne relègue pas', () => {
    // Miroir de la garde SQL « tier_size > 10 » (161/164) : l'UI ne doit pas
    // promettre une descente que le lundi n'appliquera jamais.
    const l = buildLeague({ ...standings, tier: 2, total: 8 }, 'me', avatarFor)
    expect(l.relegationCount).toBe(0)
    const big = buildLeague({ ...standings, tier: 2, total: 11 }, 'me', avatarFor)
    expect(big.relegationCount).toBe(5)
  })
})

// --- Mise en page de la liste --------------------------------------------------

function joueur(rank: number, over: Partial<LeaguePlayer> = {}): LeaguePlayer {
  return {
    id: `p${rank}`,
    rank,
    name: `Élève ${rank}`,
    avatar: '🦊',
    weeklyXp: 100 - rank,
    isMe: false,
    ...over,
  }
}

function ligue(total: number, over: Partial<League> = {}): League {
  return {
    tier: 1,
    name: 'Division Argent',
    tierIcon: '🥈',
    resetLabel: 'Reset lundi',
    players: Array.from({ length: total }, (_, i) => joueur(i + 1)),
    promotionCount: 5,
    relegationCount: 5,
    ...over,
  }
}

describe('zoneOf', () => {
  it('promotion en tête, relégation en queue, sûr entre les deux', () => {
    expect(zoneOf(1, 30, 5, 5)).toBe('promotion')
    expect(zoneOf(5, 30, 5, 5)).toBe('promotion')
    expect(zoneOf(6, 30, 5, 5)).toBe('safe')
    expect(zoneOf(25, 30, 5, 5)).toBe('safe')
    expect(zoneOf(26, 30, 5, 5)).toBe('relegation')
    expect(zoneOf(30, 30, 5, 5)).toBe('relegation')
  })

  it('zones à zéro : tout le monde est sûr', () => {
    expect(zoneOf(1, 30, 0, 0)).toBe('safe')
    expect(zoneOf(30, 30, 0, 0)).toBe('safe')
  })
})

describe('leagueLines', () => {
  it('intercale le bandeau de promotion après la 5e place et celui de relégation avant la 26e', () => {
    const lines = leagueLines(ligue(30))
    const idxPromo = lines.findIndex(
      (l) => l.kind === 'separateur' && l.zone === 'promotion',
    )
    const idxReleg = lines.findIndex(
      (l) => l.kind === 'separateur' && l.zone === 'relegation',
    )
    expect(lines).toHaveLength(32)
    expect(lines[idxPromo - 1]).toMatchObject({ kind: 'joueur', player: { rank: 5 } })
    expect(lines[idxPromo + 1]).toMatchObject({ kind: 'joueur', player: { rank: 6 } })
    expect(lines[idxReleg - 1]).toMatchObject({ kind: 'joueur', player: { rank: 25 } })
    expect(lines[idxReleg + 1]).toMatchObject({
      kind: 'joueur',
      player: { rank: 26 },
      zone: 'relegation',
    })
  })

  it('pas de bandeau pour une zone vide', () => {
    const sommet = leagueLines(ligue(30, { promotionCount: 0 }))
    expect(
      sommet.some((l) => l.kind === 'separateur' && l.zone === 'promotion'),
    ).toBe(false)
    const petit = leagueLines(ligue(8, { relegationCount: 0 }))
    expect(
      petit.some((l) => l.kind === 'separateur' && l.zone === 'relegation'),
    ).toBe(false)
  })

  it('un bandeau ne tombe jamais en bord de liste', () => {
    // 5 joueurs, 5 places de promotion : tout le monde monte, rien à séparer.
    const lines = leagueLines(ligue(5, { relegationCount: 0 }))
    expect(lines.every((l) => l.kind === 'joueur')).toBe(true)
  })

  it('zones qui se touchent (10 joueurs) : un seul bandeau entre les deux', () => {
    const lines = leagueLines(ligue(10))
    const seps = lines.filter((l) => l.kind === 'separateur')
    expect(seps).toHaveLength(1)
    expect(seps[0]).toMatchObject({ zone: 'promotion' })
  })
})

describe('promotionSentence', () => {
  it('dit combien montent, ou que l’on est au sommet', () => {
    expect(promotionSentence({ promotionCount: 5 })).toBe(
      'Les 5 premiers passent à la division supérieure',
    )
    expect(promotionSentence({ promotionCount: 0 })).toContain('sommet')
  })
})

describe('tierEtat', () => {
  it('passée, courante, verrouillée', () => {
    expect(tierEtat(0, 2)).toBe('passee')
    expect(tierEtat(2, 2)).toBe('courante')
    expect(tierEtat(3, 2)).toBe('verrouillee')
  })
})
