import { describe, expect, it } from 'vitest'
import { ES_FALSE_FRIENDS, buildFalsosAmigosPool } from './falsos-amigos'

describe('dataset falsos amigos', () => {
  it('a des ids uniques et 4 propositions distinctes (vrai sens, piège, 2 leurres)', () => {
    const ids = ES_FALSE_FRIENDS.map((f) => f.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const f of ES_FALSE_FRIENDS) {
      const opts = [f.real, f.trap, ...f.decoys]
      expect(new Set(opts).size).toBe(4)
      expect(f.tip.length).toBeGreaterThan(5)
    }
  })
})

describe('buildFalsosAmigosPool', () => {
  it('pointe le vrai sens parmi 4 options distinctes', () => {
    const pool = buildFalsosAmigosPool('test')
    const realById = new Map(ES_FALSE_FRIENDS.map((f) => [`jx-fauxes-${f.id}`, f.real]))
    expect(pool.length).toBeGreaterThan(0)
    for (const q of pool) {
      expect(q.options).toHaveLength(4)
      expect(new Set(q.options).size).toBe(4)
      expect(q.options[q.correctIndex]).toBe(realById.get(q.id))
      expect(q.subject).toBe('Espagnol')
    }
  })

  it('est déterministe : même graine, même duel', () => {
    expect(buildFalsosAmigosPool('g')).toEqual(buildFalsosAmigosPool('g'))
  })
})
