import { describe, expect, it } from 'vitest'
import { EN_WORDS, buildTraductionFlashPool } from './traduction-flash'

describe('dataset traduction flash', () => {
  it('a des mots anglais uniques et des traductions uniques', () => {
    expect(new Set(EN_WORDS.map((w) => w.en)).size).toBe(EN_WORDS.length)
    expect(new Set(EN_WORDS.map((w) => w.fr)).size).toBe(EN_WORDS.length)
  })
})

describe('buildTraductionFlashPool', () => {
  it('pointe la bonne traduction parmi 4 options distinctes', () => {
    const pool = buildTraductionFlashPool('test')
    const frByPrompt = new Map(EN_WORDS.map((w) => [`Traduis « ${w.en} » en français`, w.fr]))
    expect(pool.length).toBeGreaterThan(0)
    for (const q of pool) {
      expect(q.options).toHaveLength(4)
      expect(new Set(q.options).size).toBe(4)
      expect(q.options[q.correctIndex]).toBe(frByPrompt.get(q.prompt))
      expect(q.subject).toBe('Anglais')
    }
  })

  it('est déterministe : même graine, même duel', () => {
    expect(buildTraductionFlashPool('g')).toEqual(buildTraductionFlashPool('g'))
  })
})
