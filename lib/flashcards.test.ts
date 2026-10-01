import { describe, expect, it } from 'vitest'
import { deckProgress } from './flashcards'

describe('deckProgress', () => {
  it('avance les PREMIERS PASSAGES même quand aucune carte n’est sue', () => {
    // Le scénario du bug : l'élève rate ses 3 premières cartes. La barre des
    // cartes sues ne bouge pas (c'est correct), mais l'élève doit quand même
    // voir qu'il avance dans le paquet.
    const p = deckProgress(10, ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'], new Set(['a', 'b', 'c']))

    expect(p.known).toBe(0)
    expect(p.knownRatio).toBe(0)
    expect(p.seenRatio).toBeCloseTo(0.3)
  })

  it('compte les cartes à repasser (vues, ratées, encore en file)', () => {
    // 10 cartes, 7 sues ; 'h' et 'i' ont été ratées et attendent, 'j' jamais vue.
    const p = deckProgress(10, ['h', 'i', 'j'], new Set(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']))

    expect(p.known).toBe(7)
    expect(p.toRedo).toBe(2)
    expect(p.knownRatio).toBeCloseTo(0.7)
  })

  it('garde seenRatio au-dessus de knownRatio (la barre claire ne recule pas)', () => {
    const p = deckProgress(4, ['d'], new Set(['a', 'b', 'c', 'd']))

    expect(p.seenRatio).toBeGreaterThanOrEqual(p.knownRatio)
    expect(p.seenRatio).toBe(1)
  })

  it('ne déborde pas sur un paquet vide ou incohérent', () => {
    expect(deckProgress(0, [], new Set())).toEqual({
      known: 0,
      toRedo: 0,
      knownRatio: 0,
      seenRatio: 0,
    })
    // Plus de cartes vues que le total : borné, pas de barre > 100 %.
    expect(deckProgress(2, [], new Set(['a', 'b', 'c'])).seenRatio).toBe(1)
  })
})
