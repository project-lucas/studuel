import { describe, it, expect } from 'vitest'
import {
  tierMeta,
  normalizeLeagueStandings,
  buildLeague,
  LEAGUE_TIERS,
  MAX_TIER,
} from '@/lib/league'

const avatarFor = (id: string) => `emoji-${id}`

describe('tierMeta', () => {
  it('renvoie le palier, borné aux extrêmes', () => {
    expect(tierMeta(0).name).toBe('Ligue Bronze')
    expect(tierMeta(MAX_TIER).name).toBe('Ligue Maître')
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
    expect(l.name).toBe('Ligue Bronze')
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
    expect(l.name).toBe('Ligue Maître')
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
