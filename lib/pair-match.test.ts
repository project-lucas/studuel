import { describe, expect, it } from 'vitest'
import { pairsFromQuestions, rightColumnOrder, type Pair } from './pair-match'
import type { QuizQuestion } from './types'

const q = (over: Partial<QuizQuestion>): QuizQuestion => ({
  id: 'q1',
  quiz_id: 'quiz1',
  question: 'Énoncé ?',
  kind: 'mcq',
  options: ['bonne', 'x', 'y'],
  correct_index: 0,
  explanation: null,
  position: 0,
  ...over,
})

describe('pairsFromQuestions', () => {
  it('associe énoncé ↔ bonne réponse, dans l’ordre du quiz', () => {
    const pairs = pairsFromQuestions([
      q({ id: 'b', question: 'B', options: ['rb'], correct_index: 0, position: 2 }),
      q({ id: 'a', question: 'A', options: ['ra'], correct_index: 0, position: 1 }),
    ])
    expect(pairs).toEqual<Pair[]>([
      { id: 'a', left: 'A', right: 'ra' },
      { id: 'b', left: 'B', right: 'rb' },
    ])
  })

  it('écarte les vrai/faux', () => {
    const pairs = pairsFromQuestions([
      q({ id: 'tf', kind: 'true_false', options: ['Vrai', 'Faux'], correct_index: 0 }),
      q({ id: 'ok', options: ['bonne'], correct_index: 0 }),
    ])
    expect(pairs.map((p) => p.id)).toEqual(['ok'])
  })

  it('écarte les réponses en doublon à droite (ambigu)', () => {
    const pairs = pairsFromQuestions([
      q({ id: 'a', question: 'A', options: ['Paris'], correct_index: 0 }),
      q({ id: 'b', question: 'B', options: ['paris'], correct_index: 0, position: 1 }),
    ])
    expect(pairs.map((p) => p.id)).toEqual(['a'])
  })

  it('écarte les incomplets et respecte la limite', () => {
    const many = Array.from({ length: 8 }, (_, i) =>
      q({ id: `q${i}`, question: `Q${i}`, options: [`r${i}`], correct_index: 0, position: i }),
    )
    expect(pairsFromQuestions(many, 3)).toHaveLength(3)
    expect(
      pairsFromQuestions([q({ options: [''], correct_index: 0 })]),
    ).toHaveLength(0)
  })

  it('ne mute pas la source', () => {
    const src = [q({ position: 2 }), q({ id: 'q2', position: 1 })]
    const snap = [...src]
    pairsFromQuestions(src)
    expect(src).toEqual(snap)
  })
})

describe('rightColumnOrder', () => {
  const pairs = pairsFromQuestions(
    Array.from({ length: 5 }, (_, i) =>
      q({ id: `q${i}`, question: `Q${i}`, options: [`r${i}`], correct_index: 0, position: i }),
    ),
  )

  it('est une permutation de [0..n-1]', () => {
    const order = rightColumnOrder(pairs, 'seed')
    expect([...order].sort((a, b) => a - b)).toEqual([0, 1, 2, 3, 4])
  })

  it('est déterministe pour un même seed', () => {
    expect(rightColumnOrder(pairs, 'x')).toEqual(rightColumnOrder(pairs, 'x'))
  })

  it('gère 0 ou 1 paire', () => {
    expect(rightColumnOrder([], 's')).toEqual([])
    expect(rightColumnOrder(pairs.slice(0, 1), 's')).toEqual([0])
  })
})
