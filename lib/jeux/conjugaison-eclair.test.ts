import { describe, expect, it } from 'vitest'
import { CONJUGATIONS, buildConjugaisonPool } from './conjugaison-eclair'

describe('dataset conjugaison', () => {
  it('a des ids uniques et 4 formes distinctes par item', () => {
    const ids = CONJUGATIONS.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const c of CONJUGATIONS) {
      const forms = [c.right, ...c.wrong]
      expect(new Set(forms).size).toBe(4)
      expect(c.tip.length).toBeGreaterThan(5)
    }
  })
})

describe('buildConjugaisonPool', () => {
  it('génère des questions valides (4 options distinctes, bonne réponse dans les bornes)', () => {
    const pool = buildConjugaisonPool('test')
    expect(pool.length).toBeGreaterThan(0)
    for (const q of pool) {
      expect(q.options).toHaveLength(4)
      expect(new Set(q.options).size).toBe(4)
      expect(q.correctIndex).toBeGreaterThanOrEqual(0)
      expect(q.correctIndex).toBeLessThan(q.options.length)
      expect(q.options[q.correctIndex]).toBeTruthy()
      expect(q.subject).toBe('Français')
      expect(q.explanation).toBeTruthy()
    }
  })

  it('est déterministe : même graine, même duel', () => {
    expect(buildConjugaisonPool('g')).toEqual(buildConjugaisonPool('g'))
  })

  it('varie avec la graine', () => {
    expect(buildConjugaisonPool('a').map((q) => q.id)).not.toEqual(
      buildConjugaisonPool('b').map((q) => q.id),
    )
  })
})
