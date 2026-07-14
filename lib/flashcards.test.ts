import { describe, expect, it } from 'vitest'
import {
  countReview,
  flashcardsFromQuestions,
  reviewDeck,
  type CardVerdict,
} from './flashcards'
import type { QuizQuestion } from './types'

const q = (over: Partial<QuizQuestion>): QuizQuestion => ({
  id: 'q1',
  quiz_id: 'quiz1',
  question: 'Question ?',
  kind: 'mcq',
  options: ['A', 'B', 'C'],
  correct_index: 0,
  explanation: null,
  position: 0,
  ...over,
})

describe('flashcardsFromQuestions', () => {
  it('dérive recto=question / verso=bonne réponse, trié par position', () => {
    const cards = flashcardsFromQuestions([
      q({ id: 'b', question: 'Deuxième', options: ['x', 'y'], correct_index: 1, position: 2 }),
      q({ id: 'a', question: 'Première', options: ['bon', 'x'], correct_index: 0, position: 1 }),
    ])
    expect(cards.map((c) => c.id)).toEqual(['a', 'b'])
    expect(cards[0]).toMatchObject({ front: 'Première', back: 'bon' })
    expect(cards[1]).toMatchObject({ front: 'Deuxième', back: 'y' })
  })

  it("reprend l'explication comme indice quand elle existe", () => {
    const [card] = flashcardsFromQuestions([
      q({ explanation: '  Parce que.  ' }),
    ])
    expect(card.hint).toBe('Parce que.')
  })

  it('met hint à null quand il n’y a pas d’explication', () => {
    const [card] = flashcardsFromQuestions([q({ explanation: '   ' })])
    expect(card.hint).toBeNull()
  })

  it('écarte les cartes sans énoncé ou sans réponse', () => {
    const cards = flashcardsFromQuestions([
      q({ id: 'ok' }),
      q({ id: 'vide-q', question: '   ' }),
      q({ id: 'vide-r', options: ['', 'B'], correct_index: 0 }),
      q({ id: 'index-hs', options: ['A'], correct_index: 5 }),
    ])
    expect(cards.map((c) => c.id)).toEqual(['ok'])
  })

  it('ne mute pas le tableau source', () => {
    const source = [q({ position: 2 }), q({ id: 'q2', position: 1 })]
    const snapshot = [...source]
    flashcardsFromQuestions(source)
    expect(source).toEqual(snapshot)
  })
})

describe('countReview / reviewDeck', () => {
  const cards = flashcardsFromQuestions([
    q({ id: 'a', question: 'A' }),
    q({ id: 'b', question: 'B' }),
    q({ id: 'c', question: 'C' }),
  ])
  const verdicts: Record<string, CardVerdict> = {
    a: 'review',
    b: 'known',
    c: 'review',
  }

  it('compte les cartes à revoir', () => {
    expect(countReview(verdicts)).toBe(2)
    expect(countReview({})).toBe(0)
  })

  it('reconstruit le paquet à revoir dans l’ordre d’origine', () => {
    expect(reviewDeck(cards, verdicts).map((c) => c.id)).toEqual(['a', 'c'])
  })
})
