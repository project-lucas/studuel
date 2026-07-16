import { describe, expect, it } from 'vitest'
import {
  CAPITALES_OPTIONS,
  COUNTRIES,
  buildCapitalesPool,
} from './capitales'

describe('dataset des capitales', () => {
  it('a des capitales uniques par pays et des drapeaux partout', () => {
    for (const c of COUNTRIES) {
      expect(c.capital.length).toBeGreaterThan(1)
      expect(c.flag.length).toBeGreaterThan(0)
    }
    const names = COUNTRIES.map((c) => c.name)
    expect(new Set(names).size).toBe(names.length)
  })

  it('a assez de pays par continent pour fabriquer des leurres voisins', () => {
    const byContinent = new Map<string, number>()
    for (const c of COUNTRIES) {
      byContinent.set(c.continent, (byContinent.get(c.continent) ?? 0) + 1)
    }
    for (const [, n] of byContinent) {
      expect(n).toBeGreaterThanOrEqual(CAPITALES_OPTIONS)
    }
  })
})

describe('buildCapitalesPool', () => {
  it('génère des questions valides (4 options, bonne réponse dans les bornes)', () => {
    const pool = buildCapitalesPool('test', 30)
    expect(pool).toHaveLength(30)
    for (const q of pool) {
      expect(q.options).toHaveLength(CAPITALES_OPTIONS)
      expect(new Set(q.options).size).toBe(CAPITALES_OPTIONS)
      expect(q.options[q.correctIndex]).toBeDefined()
      expect(q.explanation).toContain(q.options[q.correctIndex])
      expect(q.subject).toBe('Histoire-Géo')
    }
  })

  it('est déterministe : même graine, même duel', () => {
    expect(buildCapitalesPool('graine-a')).toEqual(buildCapitalesPool('graine-a'))
  })

  it('varie avec la graine', () => {
    const a = buildCapitalesPool('graine-a')
    const b = buildCapitalesPool('graine-b')
    expect(a.map((q) => q.id)).not.toEqual(b.map((q) => q.id))
  })

  it('ne dépasse jamais la taille du dataset', () => {
    const pool = buildCapitalesPool('test', 999)
    expect(pool.length).toBe(COUNTRIES.length)
  })

  it('pioche les leurres en priorité sur le même continent', () => {
    const pool = buildCapitalesPool('leurres', 20)
    const capitalToContinent = new Map(
      COUNTRIES.map((c) => [c.capital, c.continent]),
    )
    for (const q of pool) {
      const continents = q.options.map((o) => capitalToContinent.get(o))
      // Toutes les options existent dans le dataset…
      expect(continents.every(Boolean)).toBe(true)
      // …et viennent du même continent (chaque continent a ≥ 4 pays).
      expect(new Set(continents).size).toBe(1)
    }
  })
})
