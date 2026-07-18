import { describe, expect, it } from 'vitest'
import { EN_FALSE_FRIENDS, buildFauxAmisPool } from './faux-amis'

describe('dataset faux amis', () => {
  it('a des ids uniques et 4 propositions distinctes (vrai sens, piège, 2 leurres)', () => {
    const ids = EN_FALSE_FRIENDS.map((f) => f.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const f of EN_FALSE_FRIENDS) {
      const opts = [f.real, f.trap, ...f.decoys]
      expect(new Set(opts).size).toBe(4)
      expect(f.tip.length).toBeGreaterThan(5)
    }
  })
})

describe('buildFauxAmisPool', () => {
  it('pointe le vrai sens parmi 4 options distinctes', () => {
    const pool = buildFauxAmisPool('test')
    const realById = new Map(EN_FALSE_FRIENDS.map((f) => [`jx-fauxen-${f.id}`, f.real]))
    expect(pool.length).toBeGreaterThan(0)
    for (const q of pool) {
      expect(q.options).toHaveLength(4)
      expect(new Set(q.options).size).toBe(4)
      expect(q.options[q.correctIndex]).toBe(realById.get(q.id))
      expect(q.subject).toBe('Anglais')
    }
  })

  it('est déterministe : même graine, même duel', () => {
    expect(buildFauxAmisPool('g')).toEqual(buildFauxAmisPool('g'))
  })
})
