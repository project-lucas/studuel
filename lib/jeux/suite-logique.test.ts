import { describe, expect, it } from 'vitest'
import { SUITE_OPTIONS, buildSuiteLogiquePool } from './suite-logique'

describe('buildSuiteLogiquePool', () => {
  it('génère le nombre demandé de suites valides', () => {
    const pool = buildSuiteLogiquePool('test', 20)
    expect(pool).toHaveLength(20)
    for (const q of pool) {
      expect(q.options).toHaveLength(SUITE_OPTIONS)
      expect(new Set(q.options).size).toBe(SUITE_OPTIONS)
      expect(q.correctIndex).toBeGreaterThanOrEqual(0)
      expect(q.correctIndex).toBeLessThan(q.options.length)
      expect(q.subject).toBe('Maths')
      for (const o of q.options) expect(Number.isInteger(Number(o))).toBe(true)
      // La bonne option est le terme suivant annoncé dans l'explication.
      expect(q.explanation).toContain(`est ${q.options[q.correctIndex]}.`)
    }
  })

  it('est déterministe : même graine, même feuille', () => {
    expect(buildSuiteLogiquePool('g')).toEqual(buildSuiteLogiquePool('g'))
  })

  it('varie avec la graine', () => {
    expect(buildSuiteLogiquePool('a').map((q) => q.prompt)).not.toEqual(
      buildSuiteLogiquePool('b').map((q) => q.prompt),
    )
  })
})
