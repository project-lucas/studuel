import { describe, expect, it } from 'vitest'
import { CRITTERS, buildClasseMoiCaPool } from './classe-moi-ca'

describe('dataset classe-moi ça', () => {
  it('a des ids uniques et un emoji + une astuce partout', () => {
    const ids = CRITTERS.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const c of CRITTERS) {
      expect(c.emoji.length).toBeGreaterThan(0)
      expect(c.tip.length).toBeGreaterThan(5)
    }
  })
})

describe('buildClasseMoiCaPool', () => {
  it('pointe la bonne classe parmi 4 options distinctes', () => {
    const pool = buildClasseMoiCaPool('test')
    const klassById = new Map(CRITTERS.map((c) => [`jx-svt-${c.id}`, c.klass]))
    expect(pool.length).toBeGreaterThan(0)
    for (const q of pool) {
      expect(q.options).toHaveLength(4)
      expect(new Set(q.options).size).toBe(4)
      expect(q.options[q.correctIndex]).toBe(klassById.get(q.id))
      expect(q.subject).toBe('SVT')
    }
  })

  it('est déterministe : même graine, même duel', () => {
    expect(buildClasseMoiCaPool('g')).toEqual(buildClasseMoiCaPool('g'))
  })
})
