import { describe, it, expect } from 'vitest'
import { missedQuestions, canRetryMissed } from './quiz-retry'
import type { QuizQuestion } from './types'

function q(id: string, correct: number): QuizQuestion {
  return {
    id,
    quiz_id: 'quiz',
    question: `Question ${id}`,
    kind: 'mcq',
    options: ['a', 'b', 'c', 'd'],
    correct_index: correct,
    explanation: null,
    position: 0,
  }
}

const QUESTIONS = [q('1', 0), q('2', 1), q('3', 2), q('4', 3)]

describe('missedQuestions', () => {
  it('ne garde que les ratées, dans l’ordre du quiz', () => {
    // Justes : 1 et 3. Ratées : 2 et 4.
    const missed = missedQuestions(QUESTIONS, [0, 3, 2, 0])

    expect(missed.map((m) => m.id)).toEqual(['2', '4'])
  })

  it('renvoie une liste vide sur un sans-faute', () => {
    expect(missedQuestions(QUESTIONS, [0, 1, 2, 3])).toEqual([])
  })

  it('compte une question sans réponse comme ratée', () => {
    // Session interrompue : `choices` plus court que le quiz. Ces questions
    // n'ont pas été traitées, il ne faut surtout pas les considérer sues.
    const missed = missedQuestions(QUESTIONS, [0, 1])

    expect(missed.map((m) => m.id)).toEqual(['3', '4'])
  })
})

describe('canRetryMissed', () => {
  it('propose le rejeu quand il reste des erreurs à travailler', () => {
    expect(canRetryMissed(10, 2)).toBe(true)
  })

  it('ne propose rien sur un sans-faute', () => {
    expect(canRetryMissed(10, 0)).toBe(false)
  })

  it('ne propose rien quand TOUT est raté', () => {
    // Sinon « Revoir mes erreurs » ferait exactement la même chose que
    // « Recommencer » : deux boutons identiques côte à côte.
    expect(canRetryMissed(10, 10)).toBe(false)
  })
})
