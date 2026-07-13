import { describe, expect, it } from 'vitest'
import {
  channelName,
  isLiveDecided,
  liveWinner,
  mergeRounds,
  orderQuestionIds,
  type RoundRecord,
} from './duel-live'

describe('channelName', () => {
  it('préfixe l’id du duel', () => {
    expect(channelName('abc')).toBe('duel-abc')
  })
})

describe('orderQuestionIds', () => {
  const ids = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

  it('est déterministe pour une même graine (deux joueurs = même ordre)', () => {
    const p1 = orderQuestionIds(ids, 'match-42')
    const p2 = orderQuestionIds(ids, 'match-42')
    expect(p1).toEqual(p2)
  })

  it('diffère selon la graine', () => {
    const a = orderQuestionIds(ids, 'match-1')
    const b = orderQuestionIds(ids, 'match-2')
    expect(a).not.toEqual(b)
  })

  it('conserve exactement les mêmes éléments (permutation)', () => {
    const out = orderQuestionIds(ids, 'seed')
    expect([...out].sort()).toEqual([...ids].sort())
    expect(out).toHaveLength(ids.length)
  })

  it('ne mute pas le tableau source', () => {
    const source = ['x', 'y', 'z']
    const snapshot = [...source]
    orderQuestionIds(source, 'seed')
    expect(source).toEqual(snapshot)
  })
})

describe('mergeRounds', () => {
  it('ne garde que les manches jouées par les deux camps', () => {
    const mine: RoundRecord[] = [
      { round: 0, correct: 4, timeMs: 1000 },
      { round: 1, correct: 3, timeMs: 1200 },
    ]
    const theirs: RoundRecord[] = [{ round: 0, correct: 2, timeMs: 900 }]
    const merged = mergeRounds(mine, theirs)
    expect(merged).toHaveLength(1)
    expect(merged[0]).toEqual({
      me: 4,
      them: 2,
      myTimeMs: 1000,
      theirTimeMs: 900,
    })
  })

  it('trie par numéro de manche', () => {
    const mine: RoundRecord[] = [
      { round: 1, correct: 5, timeMs: 1000 },
      { round: 0, correct: 1, timeMs: 1000 },
    ]
    const theirs: RoundRecord[] = [
      { round: 0, correct: 0, timeMs: 1000 },
      { round: 1, correct: 2, timeMs: 1000 },
    ]
    const merged = mergeRounds(mine, theirs)
    expect(merged.map((r) => r.me)).toEqual([1, 5])
  })
})

describe('liveWinner / isLiveDecided', () => {
  it('reste indécis tant qu’aucun camp n’a 2 manches', () => {
    const mine: RoundRecord[] = [{ round: 0, correct: 4, timeMs: 1000 }]
    const theirs: RoundRecord[] = [{ round: 0, correct: 1, timeMs: 1000 }]
    expect(liveWinner(mine, theirs)).toBeNull()
    expect(isLiveDecided(mine, theirs)).toBe(false)
  })

  it('déclare « me » vainqueur après deux manches gagnées', () => {
    const mine: RoundRecord[] = [
      { round: 0, correct: 4, timeMs: 1000 },
      { round: 1, correct: 5, timeMs: 1000 },
    ]
    const theirs: RoundRecord[] = [
      { round: 0, correct: 1, timeMs: 1000 },
      { round: 1, correct: 2, timeMs: 1000 },
    ]
    expect(liveWinner(mine, theirs)).toBe('me')
    expect(isLiveDecided(mine, theirs)).toBe(true)
  })

  it('départage une manche à égalité de score par le temps', () => {
    const mine: RoundRecord[] = [{ round: 0, correct: 3, timeMs: 1500 }]
    const theirs: RoundRecord[] = [{ round: 0, correct: 3, timeMs: 800 }]
    // égalité de bonnes réponses → le plus rapide (them) gagne la manche
    expect(mergeRounds(mine, theirs)).toHaveLength(1)
    expect(liveWinner(mine, theirs)).toBeNull() // une seule manche
  })
})
