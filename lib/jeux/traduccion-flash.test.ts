import { describe, expect, it } from 'vitest'
import { ES_WORDS, buildTraduccionFlashPool } from './traduccion-flash'

describe('dataset traducción flash', () => {
  it('a des mots espagnols uniques et des traductions uniques', () => {
    expect(new Set(ES_WORDS.map((w) => w.es)).size).toBe(ES_WORDS.length)
    expect(new Set(ES_WORDS.map((w) => w.fr)).size).toBe(ES_WORDS.length)
  })
})

describe('buildTraduccionFlashPool', () => {
  it('pointe la bonne traduction parmi 4 options distinctes', () => {
    const pool = buildTraduccionFlashPool('test')
    const frByPrompt = new Map(ES_WORDS.map((w) => [`Traduis « ${w.es} » en français`, w.fr]))
    expect(pool.length).toBeGreaterThan(0)
    for (const q of pool) {
      expect(q.options).toHaveLength(4)
      expect(new Set(q.options).size).toBe(4)
      expect(q.options[q.correctIndex]).toBe(frByPrompt.get(q.prompt))
      expect(q.subject).toBe('Espagnol')
    }
  })

  it('est déterministe : même graine, même duel', () => {
    expect(buildTraduccionFlashPool('g')).toEqual(buildTraduccionFlashPool('g'))
  })
})
