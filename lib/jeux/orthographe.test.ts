import { describe, expect, it } from 'vitest'
import {
  HOMOPHONES,
  SPELLING_PAIRS,
  buildOrthographePool,
} from './orthographe'

describe('dataset orthographe', () => {
  it('a des ids uniques à travers les deux familles', () => {
    const ids = [
      ...SPELLING_PAIRS.map((p) => p.id),
      ...HOMOPHONES.map((h) => h.id),
    ]
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('a des paires où la bonne et la mauvaise graphie diffèrent', () => {
    for (const p of SPELLING_PAIRS) {
      expect(p.right).not.toBe(p.wrong)
      expect(p.tip.length).toBeGreaterThan(5)
    }
  })

  it('a des phrases à trou cohérentes (trou présent, bornes valides)', () => {
    for (const h of HOMOPHONES) {
      expect(h.sentence).toContain('___')
      expect(h.correctIndex).toBeGreaterThanOrEqual(0)
      expect(h.correctIndex).toBeLessThan(h.options.length)
      expect(new Set(h.options).size).toBe(h.options.length)
    }
  })
})

describe('buildOrthographePool', () => {
  it('génère des questions valides et mélange les deux familles', () => {
    const pool = buildOrthographePool('test', 30)
    expect(pool).toHaveLength(30)
    for (const q of pool) {
      expect(q.options.length).toBeGreaterThanOrEqual(2)
      expect(q.correctIndex).toBeGreaterThanOrEqual(0)
      expect(q.correctIndex).toBeLessThan(q.options.length)
      expect(q.subject).toBe('Français')
      expect(q.explanation).toBeTruthy()
      // Le trou brut « ___ » ne fuit jamais dans l'énoncé affiché.
      expect(q.prompt).not.toContain('___')
    }
  })

  it('pointe toujours la bonne réponse après permutation', () => {
    const pool = buildOrthographePool('permutation', 60)
    const rightById = new Map<string, string>([
      ...SPELLING_PAIRS.map((p) => [`jx-ort-${p.id}`, p.right] as const),
      ...HOMOPHONES.map(
        (h) => [`jx-ort-${h.id}`, h.options[h.correctIndex]] as const,
      ),
    ])
    for (const q of pool) {
      expect(q.options[q.correctIndex]).toBe(rightById.get(q.id))
    }
  })

  it('est déterministe : même graine, même duel', () => {
    expect(buildOrthographePool('graine')).toEqual(
      buildOrthographePool('graine'),
    )
  })
})
