import { describe, expect, it } from 'vitest'
import {
  HINT_PENALTY,
  LEVEL_BASE_POINTS,
  MIN_LEVEL_POINTS,
  WRONG_PENALTY,
  levelPoints,
  maxScore,
  planLevels,
  starsForScore,
} from './defi-solo'
import type { QuizQuestion } from './types'

const mkQ = (i: number): QuizQuestion => ({
  id: `q${i}`,
  quiz_id: 'quiz1',
  question: `Q${i}`,
  kind: 'mcq',
  options: [`r${i}`, `x${i}`],
  correct_index: 0,
  explanation: null,
  position: i,
})

describe('levelPoints', () => {
  it('plein tarif du premier coup sans indice', () => {
    expect(levelPoints(0, false)).toBe(LEVEL_BASE_POINTS)
  })

  it('retire le malus par mauvaise tentative et par indice', () => {
    expect(levelPoints(1, false)).toBe(LEVEL_BASE_POINTS - WRONG_PENALTY)
    expect(levelPoints(0, true)).toBe(LEVEL_BASE_POINTS - HINT_PENALTY)
    expect(levelPoints(1, true)).toBe(
      LEVEL_BASE_POINTS - WRONG_PENALTY - HINT_PENALTY,
    )
  })

  it('ne descend jamais sous le plancher', () => {
    expect(levelPoints(10, true)).toBe(MIN_LEVEL_POINTS)
  })

  it('ignore un nombre de tentatives négatif', () => {
    expect(levelPoints(-3, false)).toBe(LEVEL_BASE_POINTS)
  })
})

describe('maxScore', () => {
  it('multiplie le nombre de niveaux par le plein tarif', () => {
    expect(maxScore(3)).toBe(3 * LEVEL_BASE_POINTS)
    expect(maxScore(0)).toBe(0)
  })
})

describe('starsForScore', () => {
  it('donne 5 étoiles au quasi-parfait, 0 à zéro', () => {
    expect(starsForScore(100, 100)).toBe(5)
    expect(starsForScore(0, 100)).toBe(0)
  })

  it('échelonne les étoiles selon le ratio', () => {
    expect(starsForScore(80, 100)).toBe(4)
    expect(starsForScore(60, 100)).toBe(3)
    expect(starsForScore(40, 100)).toBe(2)
    expect(starsForScore(10, 100)).toBe(1)
  })

  it('gère un dénominateur nul', () => {
    expect(starsForScore(0, 0)).toBe(0)
  })
})

describe('planLevels', () => {
  it('intercale une manche paires en 3e position quand ≥3 paires', () => {
    const levels = planLevels(Array.from({ length: 5 }, (_, i) => mkQ(i)))
    expect(levels).toHaveLength(6) // 5 QCM + 1 manche paires
    expect(levels.map((l) => l.kind)).toEqual([
      'qcm',
      'qcm',
      'pairs',
      'qcm',
      'qcm',
      'qcm',
    ])
    const pairsLevel = levels[2]
    if (pairsLevel.kind !== 'pairs') throw new Error('attendu: pairs')
    expect(pairsLevel.pairs.length).toBeGreaterThanOrEqual(3)
  })

  it('ne met que des QCM quand moins de 3 paires dérivables', () => {
    const levels = planLevels([mkQ(0), mkQ(1)])
    expect(levels.map((l) => l.kind)).toEqual(['qcm', 'qcm'])
  })

  it('gère un quiz vide', () => {
    expect(planLevels([])).toEqual([])
  })
})
