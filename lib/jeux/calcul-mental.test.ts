import { describe, expect, it } from 'vitest'
import { CALCUL_OPTIONS, buildCalculMentalPool } from './calcul-mental'

describe('buildCalculMentalPool', () => {
  it('génère le nombre demandé d’opérations valides', () => {
    const pool = buildCalculMentalPool('test', 24)
    expect(pool).toHaveLength(24)
    for (const q of pool) {
      expect(q.options).toHaveLength(CALCUL_OPTIONS)
      expect(new Set(q.options).size).toBe(CALCUL_OPTIONS)
      expect(q.correctIndex).toBeGreaterThanOrEqual(0)
      expect(q.correctIndex).toBeLessThan(q.options.length)
      expect(q.subject).toBe('Maths')
      // Toutes les options sont des entiers positifs.
      for (const o of q.options) expect(Number.isInteger(Number(o))).toBe(true)
      // La bonne option est bien le résultat annoncé dans l'explication.
      expect(q.explanation).toContain(`= ${q.options[q.correctIndex]}.`)
    }
  })

  it('est déterministe : même graine, même feuille', () => {
    expect(buildCalculMentalPool('g')).toEqual(buildCalculMentalPool('g'))
  })

  it('varie avec la graine', () => {
    expect(buildCalculMentalPool('a').map((q) => q.prompt)).not.toEqual(
      buildCalculMentalPool('b').map((q) => q.prompt),
    )
  })
})
