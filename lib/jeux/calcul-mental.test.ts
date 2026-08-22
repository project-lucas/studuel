import { describe, expect, it } from 'vitest'
import {
  CALCUL_OPTIONS,
  CALCUL_TIER_BRIEF,
  buildCalculMentalPool,
} from './calcul-mental'
import { PALIER_LEVELS } from './paliers'

describe('buildCalculMentalPool', () => {
  it('génère le nombre demandé d’opérations valides', () => {
    const pool = buildCalculMentalPool('test', 24)
    expect(pool).toHaveLength(24)
    for (const q of pool) {
      expect(q.options).toHaveLength(CALCUL_OPTIONS)
      expect(new Set(q.options).size).toBe(CALCUL_OPTIONS)
      expect(q.correctIndex).toBeGreaterThanOrEqual(0)
      expect(q.correctIndex).toBeLessThan(q.options.length)
      expect(q.subject).toBe('Maths')
      // Toutes les options sont des entiers positifs.
      for (const o of q.options) expect(Number.isInteger(Number(o))).toBe(true)
      // La bonne option est bien le résultat annoncé dans l'explication.
      expect(q.explanation).toContain(`= ${q.options[q.correctIndex]}.`)
    }
  })

  it('est déterministe : même graine, même feuille', () => {
    expect(buildCalculMentalPool('g')).toEqual(buildCalculMentalPool('g'))
  })

  it('varie avec la graine', () => {
    expect(buildCalculMentalPool('a').map((q) => q.prompt)).not.toEqual(
      buildCalculMentalPool('b').map((q) => q.prompt),
    )
  })
})

describe('les paliers de la banque', () => {
  it('produit une feuille valide à CHAQUE palier', () => {
    for (const level of PALIER_LEVELS) {
      const pool = buildCalculMentalPool(`p${level}`, 24, level)
      expect(pool).toHaveLength(24)
      for (const q of pool) {
        expect(new Set(q.options).size).toBe(CALCUL_OPTIONS)
        // Toutes les options restent des entiers strictement positifs : un
        // leurre négatif ou décimal se repère sans calculer.
        for (const o of q.options) {
          const n = Number(o)
          expect(Number.isInteger(n)).toBe(true)
          expect(n).toBeGreaterThan(0)
        }
        expect(q.explanation).toContain(`= ${q.options[q.correctIndex]}.`)
      }
    }
  })

  it('ne sert pas la même feuille d’un palier à l’autre', () => {
    const prompts = PALIER_LEVELS.map((level) =>
      buildCalculMentalPool('meme-graine', 12, level)
        .map((q) => q.prompt)
        .join('|'),
    )
    expect(new Set(prompts).size).toBe(PALIER_LEVELS.length)
  })

  it('monte en difficulté : le résultat moyen grandit avec le palier', () => {
    const moyenne = (level: (typeof PALIER_LEVELS)[number]) => {
      const pool = buildCalculMentalPool('echelle', 40, level)
      const total = pool.reduce(
        (sum, q) => sum + Number(q.options[q.correctIndex]),
        0,
      )
      return total / pool.length
    }
    expect(moyenne(1)).toBeLessThan(moyenne(3))
    expect(moyenne(3)).toBeLessThan(moyenne(5))
  })

  it('n’ouvre les pourcentages et les priorités qu’en haut de l’échelle', () => {
    const bas = buildCalculMentalPool('bas', 40, 2)
      .map((q) => q.prompt)
      .join(' ')
    const haut = buildCalculMentalPool('haut', 40, 5)
      .map((q) => q.prompt)
      .join(' ')
    expect(bas).not.toContain('%')
    expect(haut).toContain('%')
    // « a + b × c » : la priorité opératoire, propre au dernier palier.
    expect(haut).toMatch(/\d+ \+ \d+ × \d+/)
  })

  it('promet, palier par palier, ce qu’il va vraiment servir', () => {
    for (const level of PALIER_LEVELS) {
      expect(CALCUL_TIER_BRIEF[level].length).toBeGreaterThan(10)
    }
  })

  it('reste déterministe à palier fixé', () => {
    expect(buildCalculMentalPool('g', 12, 4)).toEqual(
      buildCalculMentalPool('g', 12, 4),
    )
  })
})

describe('la banque au-delà des paliers (épreuve ultime)', () => {
  it('continue de produire des feuilles valides très haut', () => {
    for (const tier of [6, 8, 12, 20, 40]) {
      const pool = buildCalculMentalPool(`u${tier}`, 12, tier)
      expect(pool).toHaveLength(12)
      for (const q of pool) {
        expect(new Set(q.options).size).toBe(CALCUL_OPTIONS)
        for (const o of q.options) {
          const n = Number(o)
          expect(Number.isInteger(n)).toBe(true)
          expect(n).toBeGreaterThan(0)
        }
        expect(q.explanation).toContain(`= ${q.options[q.correctIndex]}.`)
      }
    }
  })

  it('durcit encore : les résultats grandissent au-delà du palier 5', () => {
    const moyenne = (tier: number) => {
      const pool = buildCalculMentalPool('croissance', 40, tier)
      return (
        pool.reduce((sum, q) => sum + Number(q.options[q.correctIndex]), 0) /
        pool.length
      )
    }
    expect(moyenne(5)).toBeLessThan(moyenne(8))
  })

  it('BORNE la croissance : le niveau 40 reste du calcul, pas de la patience', () => {
    const max = (tier: number) =>
      Math.max(
        ...buildCalculMentalPool('borne', 60, tier).map((q) =>
          Number(q.options[q.correctIndex]),
        ),
      )
    // Passé le plafond de croissance (tier 11), les BORNES cessent d'enfler :
    // c'est le chrono qui continue de durcir l'épreuve. Les tirages diffèrent
    // encore — chaque cran a sa graine — mais ils vivent dans le même intervalle.
    const plafond = max(11)
    expect(max(40)).toBeLessThanOrEqual(plafond * 1.15)
    expect(max(40)).toBeGreaterThan(max(6))
  })

  it('sert la double opération, propre à l’épreuve', () => {
    const prompts = buildCalculMentalPool('double', 60, 9)
      .map((q) => q.prompt)
      .join(' ')
    expect(prompts).toMatch(/\d+ × \d+ \+ \d+ × \d+/)
  })
})
