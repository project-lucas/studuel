import { describe, expect, it } from 'vitest'
import { QUANTITIES, buildBonneUnitePool } from './bonne-unite'

describe('dataset la bonne unité', () => {
  it('a des ids uniques et des unités uniques', () => {
    expect(new Set(QUANTITIES.map((q) => q.id)).size).toBe(QUANTITIES.length)
    expect(new Set(QUANTITIES.map((q) => q.unit)).size).toBe(QUANTITIES.length)
  })
})

describe('buildBonneUnitePool', () => {
  it('pointe la bonne unité parmi 4 options distinctes', () => {
    const pool = buildBonneUnitePool('test')
    const unitById = new Map(QUANTITIES.map((q) => [`jx-unite-${q.id}`, q.unit]))
    expect(pool.length).toBeGreaterThan(0)
    for (const q of pool) {
      expect(q.options).toHaveLength(4)
      expect(new Set(q.options).size).toBe(4)
      expect(q.options[q.correctIndex]).toBe(unitById.get(q.id))
      expect(q.subject).toBe('Physique-Chimie')
    }
  })

  it('est déterministe : même graine, même duel', () => {
    expect(buildBonneUnitePool('g')).toEqual(buildBonneUnitePool('g'))
  })
})
