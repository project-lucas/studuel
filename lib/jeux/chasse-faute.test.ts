import { describe, expect, it } from 'vitest'
import { MISSPELLINGS, buildChasseFautePool } from './chasse-faute'

describe('dataset chasse à la faute', () => {
  it('a des ids uniques, un mot fautif distinct de sa forme correcte, 4 mots distincts', () => {
    const ids = MISSPELLINGS.map((m) => m.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const m of MISSPELLINGS) {
      expect(m.wrong).not.toBe(m.right)
      const words = [m.wrong, ...m.others]
      expect(new Set(words).size).toBe(4)
      expect(m.tip.length).toBeGreaterThan(5)
    }
  })
})

describe('buildChasseFautePool', () => {
  it('pointe le mot fautif parmi 4 options distinctes', () => {
    const pool = buildChasseFautePool('test')
    const wrongById = new Map(MISSPELLINGS.map((m) => [`jx-faute-${m.id}`, m.wrong]))
    expect(pool.length).toBeGreaterThan(0)
    for (const q of pool) {
      expect(q.options).toHaveLength(4)
      expect(new Set(q.options).size).toBe(4)
      expect(q.options[q.correctIndex]).toBe(wrongById.get(q.id))
      expect(q.subject).toBe('Français')
      expect(q.explanation).toBeTruthy()
    }
  })

  it('est déterministe : même graine, même duel', () => {
    expect(buildChasseFautePool('g')).toEqual(buildChasseFautePool('g'))
  })
})
