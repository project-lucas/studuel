import { describe, expect, it } from 'vitest'
import { ELEMENTS, buildChasseElementsPool } from './chasse-elements'

describe('dataset chasse aux éléments', () => {
  it('a des noms et des symboles uniques', () => {
    expect(new Set(ELEMENTS.map((e) => e.name)).size).toBe(ELEMENTS.length)
    expect(new Set(ELEMENTS.map((e) => e.symbol)).size).toBe(ELEMENTS.length)
  })
})

describe('buildChasseElementsPool', () => {
  it('pointe le bon symbole parmi 4 options distinctes', () => {
    const pool = buildChasseElementsPool('test')
    const symbolBySymbolId = new Map(ELEMENTS.map((e) => [`jx-elt-${e.symbol}`, e.symbol]))
    expect(pool.length).toBeGreaterThan(0)
    for (const q of pool) {
      expect(q.options).toHaveLength(4)
      expect(new Set(q.options).size).toBe(4)
      expect(q.options[q.correctIndex]).toBe(symbolBySymbolId.get(q.id))
      expect(q.subject).toBe('Physique-Chimie')
    }
  })

  it('est déterministe : même graine, même duel', () => {
    expect(buildChasseElementsPool('g')).toEqual(buildChasseElementsPool('g'))
  })
})
