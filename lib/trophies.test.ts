import { describe, it, expect } from 'vitest'
import {
  matchmakeOpponentTrophies,
  rankPlayers,
  rivalAhead,
  rivalBehind,
  friendsPassed,
  friendsLostTo,
  bestTrophies,
  type RankPlayer,
} from './trophies'

// Les suites `trophyDelta`, `applyTrophyDelta` et `bronzeLossShield` ont été
// retirées avec le barème Elo qu'elles couvraient : les trophées se gagnent
// désormais par (matière × jeu) sur une courbe par bandes, testée dans
// `lib/trophy-road.test.ts`. Ce fichier ne garde que le CLASSEMENT.

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
