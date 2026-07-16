import { describe, expect, it } from 'vitest'
import { toModeQuestions, type QuickQuestionRow } from '@/lib/defi/quick-pool'

const row = (over: Partial<QuickQuestionRow> = {}): QuickQuestionRow => ({
  id: 'q1',
  quiz_id: 'quiz-a',
  question: 'Combien font 2 + 2 ?',
  kind: 'true_false',
  options: ['Vrai', 'Faux'],
  correct_index: 0,
  explanation: null,
  ...over,
})

describe('toModeQuestions', () => {
  it('convertit une ligne valide en ModeQuestion avec sa matière', () => {
    const out = toModeQuestions([row()], () => 'Maths')
    expect(out).toHaveLength(1)
    expect(out[0]).toMatchObject({
      id: 'q1',
      prompt: 'Combien font 2 + 2 ?',
      correctIndex: 0,
      subject: 'Maths',
    })
  })

  it('écarte les questions injouables (options ou index invalides)', () => {
    const bad: QuickQuestionRow[] = [
      row({ id: 'a', options: ['seule'] }), // moins de 2 options
      row({ id: 'b', options: 'pas un tableau' }),
      row({ id: 'c', correct_index: 5 }), // hors bornes
      row({ id: 'd', correct_index: -1 }),
    ]
    expect(toModeQuestions(bad, () => null)).toEqual([])
  })

  it('garde la bonne réponse après permutation des QCM', () => {
    const q = row({
      id: 'mcq-1',
      kind: 'mcq',
      options: ['A', 'B', 'C', 'D'],
      correct_index: 2,
    })
    const [out] = toModeQuestions([q], () => null)
    expect(out.options[out.correctIndex]).toBe('C')
  })

  it('la permutation est déterministe (même id → même ordre)', () => {
    const q = row({
      id: 'mcq-2',
      kind: 'mcq',
      options: ['A', 'B', 'C', 'D'],
      correct_index: 0,
    })
    const first = toModeQuestions([q], () => null)[0]
    const again = toModeQuestions([q], () => null)[0]
    expect(first.options).toEqual(again.options)
    expect(first.correctIndex).toBe(again.correctIndex)
  })

  it('tolère null et les listes vides', () => {
    expect(toModeQuestions(null, () => null)).toEqual([])
    expect(toModeQuestions([], () => null)).toEqual([])
  })
})
