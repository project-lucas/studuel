import { describe, it, expect } from 'vitest'
import {
  lessonProgress,
  lessonSupportCount,
  lessonSupportsDone,
  EMPTY_LESSON_ACTIVITY,
} from './lesson-progress'

const ALL = { hasRevision: true, hasStudygram: true, hasQuiz: true }
const COURS_SEUL = { hasRevision: false, hasStudygram: false, hasQuiz: false }

describe('lessonSupportCount', () => {
  it('compte toujours le cours', () => {
    expect(lessonSupportCount(COURS_SEUL)).toBe(1)
  })
  it('compte chaque support disponible', () => {
    expect(lessonSupportCount(ALL)).toBe(4)
    expect(
      lessonSupportCount({ hasRevision: true, hasStudygram: false, hasQuiz: true }),
    ).toBe(3)
  })
})

describe('lessonProgress', () => {
  it('vaut 0 quand rien n’a été fait', () => {
    expect(lessonProgress(ALL, EMPTY_LESSON_ACTIVITY)).toBe(0)
  })

  it('vaut 1 quand tout est fait avec un quiz parfait', () => {
    expect(
      lessonProgress(ALL, {
        coursDone: true,
        revisionDone: true,
        studygramDone: true,
        bestQuizRatio: 1,
      }),
    ).toBe(1)
  })

  it('pondère le quiz par son meilleur score', () => {
    // 4 supports : cours fait (1) + quiz à 50 % (0.5) → 1.5/4
    expect(
      lessonProgress(ALL, {
        ...EMPTY_LESSON_ACTIVITY,
        coursDone: true,
        bestQuizRatio: 0.5,
      }),
    ).toBeCloseTo(1.5 / 4)
  })

  it('ignore les supports absents (pas de pénalité)', () => {
    // Cours seul : lu → 100 %.
    expect(
      lessonProgress(COURS_SEUL, { ...EMPTY_LESSON_ACTIVITY, coursDone: true }),
    ).toBe(1)
  })

  it('un quiz jamais tenté ne compte pas comme 0 fait mais vaut 0 dans l’anneau', () => {
    const s = { hasRevision: false, hasStudygram: false, hasQuiz: true }
    expect(lessonProgress(s, { ...EMPTY_LESSON_ACTIVITY, coursDone: true })).toBe(0.5)
    expect(
      lessonSupportsDone(s, { ...EMPTY_LESSON_ACTIVITY, coursDone: true }),
    ).toBe(1)
  })

  it('borne les ratios hors limites', () => {
    const s = { hasRevision: false, hasStudygram: false, hasQuiz: true }
    expect(
      lessonProgress(s, { ...EMPTY_LESSON_ACTIVITY, bestQuizRatio: 2 }),
    ).toBe(0.5)
    expect(
      lessonProgress(s, { ...EMPTY_LESSON_ACTIVITY, bestQuizRatio: -1 }),
    ).toBe(0)
  })
})

describe('lessonSupportsDone', () => {
  it('le quiz est « fait » dès qu’il a été tenté', () => {
    expect(
      lessonSupportsDone(ALL, {
        coursDone: true,
        revisionDone: false,
        studygramDone: true,
        bestQuizRatio: 0.2,
      }),
    ).toBe(3)
  })
})
