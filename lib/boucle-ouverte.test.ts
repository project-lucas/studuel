import { describe, expect, test } from 'vitest'
import { UNITES, boucleARappeler, plusQue, plusQueCourt, resteAFaire } from './boucle-ouverte'
import type { BrouillonQuiz } from './quiz-brouillon'
import type { LectureEntamee } from './lecture-entamee'

describe('resteAFaire — une boucle entamée à moitié au moins', () => {
  test('rien commencé, moins de la moitié, déjà bouclée : rien à dire', () => {
    expect(resteAFaire(0, 10)).toBeNull()
    expect(resteAFaire(4, 10)).toBeNull()
    expect(resteAFaire(10, 10)).toBeNull()
    expect(resteAFaire(12, 10)).toBeNull()
  })

  test('à la moitié et au-delà, le reste', () => {
    expect(resteAFaire(5, 10)).toBe(5)
    expect(resteAFaire(9, 10)).toBe(1)
  })

  test('des nombres absurdes ne disent rien', () => {
    expect(resteAFaire(Number.NaN, 10)).toBeNull()
    expect(resteAFaire(1, 0)).toBeNull()
    expect(resteAFaire(1, -3)).toBeNull()
  })
})

describe('plusQue — la phrase', () => {
  test('au singulier et au pluriel', () => {
    expect(plusQue(6, 10, UNITES.question)).toBe('Plus que 4 questions')
    expect(plusQue(9, 10, UNITES.question)).toBe('Plus que 1 question')
    expect(plusQue(2, 3, UNITES.fiche)).toBe('Plus que 1 fiche')
  })

  test('muette sous la moitié', () => {
    expect(plusQue(1, 10, UNITES.reponse)).toBeNull()
  })

  test('la forme courte, pour une fin de phrase', () => {
    expect(plusQueCourt(3, 5)).toBe('plus que 2')
    expect(plusQueCourt(1, 5)).toBeNull()
  })
})

describe('boucleARappeler — une carte, jamais deux', () => {
  const brouillon = { quizId: 'q', at: '2026-10-28T10:00:00.000Z' } as BrouillonQuiz
  const lecture = { lessonId: 'l', at: '2026-10-28T11:00:00.000Z' } as LectureEntamee

  test('la plus récente des deux', () => {
    expect(boucleARappeler(brouillon, lecture)?.genre).toBe('lecture')
    expect(boucleARappeler({ ...brouillon, at: '2026-10-28T12:00:00.000Z' }, lecture)?.genre).toBe('quiz')
  })

  test('celle qui existe, ou rien', () => {
    expect(boucleARappeler(brouillon, null)?.genre).toBe('quiz')
    expect(boucleARappeler(null, lecture)?.genre).toBe('lecture')
    expect(boucleARappeler(null, null)).toBeNull()
  })
})
