import { describe, it, expect } from 'vitest'
import {
  CAPACITY_QUESTIONS,
  computeCapacity,
  capacityPriorities,
} from '@/lib/capacity'

const allAnswers = (value: number) =>
  Object.fromEntries(CAPACITY_QUESTIONS.map((q) => [q.id, value]))

describe('computeCapacity', () => {
  it('toutes les réponses à « Toujours » → 100 %', () => {
    expect(computeCapacity(allAnswers(3))).toBe(100)
  })

  it('toutes les réponses à « Jamais » → 0 %', () => {
    expect(computeCapacity(allAnswers(0))).toBe(0)
  })

  it('aucune réponse → 0 (pas de division par zéro)', () => {
    expect(computeCapacity({})).toBe(0)
  })

  it('moyenne sur les seules réponses valides', () => {
    // Une seule réponse, à 3 → 100 % (les autres questions sont ignorées).
    expect(computeCapacity({ [CAPACITY_QUESTIONS[0].id]: 3 })).toBe(100)
  })

  it('ignore les valeurs hors plage ou non entières', () => {
    expect(
      computeCapacity({
        [CAPACITY_QUESTIONS[0].id]: 5,
        [CAPACITY_QUESTIONS[1].id]: -1,
        [CAPACITY_QUESTIONS[2].id]: 1.5,
        [CAPACITY_QUESTIONS[3].id]: 3,
      }),
    ).toBe(100)
  })
})

describe('capacityPriorities', () => {
  it('classe les habitudes les plus faibles en premier', () => {
    const answers = allAnswers(3)
    answers[CAPACITY_QUESTIONS[4].id] = 0
    answers[CAPACITY_QUESTIONS[1].id] = 1

    const priorities = capacityPriorities(answers)
    expect(priorities.map((p) => p.id)).toEqual([
      CAPACITY_QUESTIONS[4].id,
      CAPACITY_QUESTIONS[1].id,
    ])
  })

  it('exclut les réponses parfaites (3) et respecte la limite', () => {
    expect(capacityPriorities(allAnswers(3))).toEqual([])
    expect(capacityPriorities(allAnswers(0), 2)).toHaveLength(2)
  })
})
