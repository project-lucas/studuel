import { describe, it, expect } from 'vitest'
import {
  ARENAS,
  arenaFor,
  arenaProgress,
  trophyDelta,
  applyTrophyDelta,
  matchmakeOpponentTrophies,
  rankPlayers,
  rivalAhead,
  rivalBehind,
  friendsPassed,
  friendsLostTo,
  bestTrophies,
  WIN_MIN,
  WIN_MAX,
  LOSS_MIN,
  LOSS_MAX,
  type RankPlayer,
} from './trophies'

describe('arenaFor', () => {
  it('returns the first arena at zero trophies', () => {
    expect(arenaFor(0).id).toBe('recre')
  })

  it('clamps negative trophies to the first arena', () => {
    expect(arenaFor(-50).id).toBe('recre')
  })

  it('returns the arena whose threshold is reached but not the next', () => {
    expect(arenaFor(300).id).toBe('etude')
    expect(arenaFor(699).id).toBe('etude')
    expect(arenaFor(700).id).toBe('honneur')
  })

  it('returns the top arena above the last threshold', () => {
    const top = ARENAS[ARENAS.length - 1]
    expect(arenaFor(99999).id).toBe(top.id)
  })

  it('arenas are strictly increasing thresholds', () => {
    for (let i = 1; i < ARENAS.length; i++) {
      expect(ARENAS[i].min).toBeGreaterThan(ARENAS[i - 1].min)
    }
  })
})

describe('arenaProgress', () => {
  it('is at the start of an arena at its floor', () => {
    const p = arenaProgress(300)
    expect(p.arena.id).toBe('etude')
    expect(p.progress).toBe(0)
    expect(p.next?.id).toBe('honneur')
    expect(p.toNext).toBe(700 - 300)
  })

  it('is halfway between two thresholds', () => {
    // etude 300 → honneur 700, midpoint 500
    const p = arenaProgress(500)
    expect(p.progress).toBeCloseTo(0.5, 5)
    expect(p.toNext).toBe(200)
  })

  it('caps at full progress in the top arena', () => {
    const p = arenaProgress(10000)
    expect(p.next).toBeNull()
    expect(p.progress).toBe(1)
    expect(p.toNext).toBe(0)
    expect(p.ceiling).toBeNull()
  })
})

describe('trophyDelta', () => {
  it('gains at least WIN_MIN even against a much weaker opponent', () => {
    const d = trophyDelta(true, 1000, 200)
    expect(d).toBe(WIN_MIN)
  })

  it('gains up to WIN_MAX against a much stronger opponent', () => {
    const d = trophyDelta(true, 200, 1000)
    expect(d).toBe(WIN_MAX)
  })

  it('loses only LOSS_MIN against a much stronger opponent', () => {
    const d = trophyDelta(false, 200, 1000)
    expect(d).toBe(-LOSS_MIN)
  })

  it('loses up to LOSS_MAX against a much weaker opponent', () => {
    const d = trophyDelta(false, 1000, 200)
    expect(d).toBe(-LOSS_MAX)
  })

  it('is symmetric-ish around even matchups (win positive, loss negative)', () => {
    const win = trophyDelta(true, 500, 500)
    const loss = trophyDelta(false, 500, 500)
    expect(win).toBeGreaterThan(0)
    expect(loss).toBeLessThan(0)
    // Even matchup: expected 0.5 → raw ±20, within bounds.
    expect(win).toBe(20)
    expect(loss).toBe(-20)
  })

  it('never returns a positive number on a loss', () => {
    for (const [me, opp] of [[100, 100], [100, 900], [900, 100], [500, 480]]) {
      expect(trophyDelta(false, me, opp)).toBeLessThan(0)
    }
  })
})

describe('applyTrophyDelta', () => {
  it('adds a positive delta', () => {
    expect(applyTrophyDelta(500, 30)).toBe(530)
  })

  it('never drops below zero', () => {
    expect(applyTrophyDelta(10, -30)).toBe(0)
  })
})

describe('matchmakeOpponentTrophies', () => {
  it('is deterministic for a given seed', () => {
    expect(matchmakeOpponentTrophies(500, 'abc')).toBe(
      matchmakeOpponentTrophies(500, 'abc'),
    )
  })

  it('stays within ±120 of the player', () => {
    for (const seed of ['a', 'b', 'c', 'zzz', 'match-42', 'seed-999']) {
      const opp = matchmakeOpponentTrophies(500, seed)
      expect(opp).toBeGreaterThanOrEqual(500 - 120)
      expect(opp).toBeLessThanOrEqual(500 + 120)
    }
  })

  it('never goes below zero for a low-rated player', () => {
    expect(matchmakeOpponentTrophies(10, 'deep')).toBeGreaterThanOrEqual(0)
  })
})

describe('rankPlayers', () => {
  const players: RankPlayer[] = [
    { id: 'a', name: 'A', emoji: '🦊', trophies: 300 },
    { id: 'me', name: 'Moi', emoji: '🚀', trophies: 500, isMe: true },
    { id: 'b', name: 'B', emoji: '🐼', trophies: 800 },
  ]

  it('sorts by trophies descending with ranks starting at 1', () => {
    const rows = rankPlayers(players)
    expect(rows.map((r) => r.id)).toEqual(['b', 'me', 'a'])
    expect(rows.map((r) => r.rank)).toEqual([1, 2, 3])
  })

  it('puts me ahead on a tie', () => {
    const rows = rankPlayers([
      { id: 'x', name: 'X', emoji: '🐺', trophies: 500 },
      { id: 'me', name: 'Moi', emoji: '🚀', trophies: 500, isMe: true },
    ])
    expect(rows[0].isMe).toBe(true)
  })
})

describe('rivalAhead / rivalBehind', () => {
  const rows = rankPlayers([
    { id: 'a', name: 'A', emoji: '🦊', trophies: 300 },
    { id: 'me', name: 'Moi', emoji: '🚀', trophies: 500, isMe: true },
    { id: 'b', name: 'B', emoji: '🐼', trophies: 800 },
  ])

  it('finds the player one rank above me', () => {
    expect(rivalAhead(rows)?.id).toBe('b')
  })

  it('finds the player one rank below me', () => {
    expect(rivalBehind(rows)?.id).toBe('a')
  })

  it('returns null ahead when I am first', () => {
    const r = rankPlayers([
      { id: 'me', name: 'Moi', emoji: '🚀', trophies: 900, isMe: true },
      { id: 'a', name: 'A', emoji: '🦊', trophies: 300 },
    ])
    expect(rivalAhead(r)).toBeNull()
  })

  it('returns null behind when I am last', () => {
    const r = rankPlayers([
      { id: 'a', name: 'A', emoji: '🦊', trophies: 900 },
      { id: 'me', name: 'Moi', emoji: '🚀', trophies: 300, isMe: true },
    ])
    expect(rivalBehind(r)).toBeNull()
  })
})

describe('friendsPassed', () => {
  const friends: RankPlayer[] = [
    { id: 'lea', name: 'Léa', emoji: '🦊', trophies: 520 },
    { id: 'tom', name: 'Tom', emoji: '🐼', trophies: 540 },
    { id: 'hugo', name: 'Hugo', emoji: '🐺', trophies: 600 },
  ]

  it('returns friends overtaken by the trophy gain, closest first', () => {
    const passed = friendsPassed(500, 545, friends)
    expect(passed.map((f) => f.id)).toEqual(['tom', 'lea'])
  })

  it('excludes friends still ahead', () => {
    const passed = friendsPassed(500, 545, friends)
    expect(passed.find((f) => f.id === 'hugo')).toBeUndefined()
  })

  it('is empty when nobody was overtaken', () => {
    expect(friendsPassed(500, 515, friends)).toEqual([])
  })

  it('is empty on a loss (after <= before)', () => {
    expect(friendsPassed(500, 480, friends)).toEqual([])
  })
})

describe('friendsLostTo', () => {
  const friends: RankPlayer[] = [
    { id: 'lea', name: 'Léa', emoji: '🦊', trophies: 490 },
    { id: 'tom', name: 'Tom', emoji: '🐼', trophies: 470 },
  ]

  it('returns friends who slipped ahead after a loss', () => {
    const lost = friendsLostTo(500, 465, friends)
    expect(lost.map((f) => f.id)).toEqual(['tom', 'lea'])
  })

  it('is empty on a win', () => {
    expect(friendsLostTo(500, 540, friends)).toEqual([])
  })
})

describe('bestTrophies', () => {
  it('keeps the peak when current is lower', () => {
    expect(bestTrophies(400, 650)).toBe(650)
  })
  it('updates the peak when current is higher', () => {
    expect(bestTrophies(700, 650)).toBe(700)
  })
})
