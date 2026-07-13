import { describe, it, expect } from 'vitest'
import {
  coopQuestionState,
  coopStatus,
  coopScore,
  partnerProgress,
  COOP_QUESTIONS,
  COOP_LIVES,
  type CoopAnswer,
} from './coop'

const a = (q: number, correct: boolean): CoopAnswer => ({ q, correct })

describe('coopQuestionState', () => {
  it('is cleared when I got it right', () => {
    expect(coopQuestionState([a(0, true)], [], 0)).toBe('cleared')
  })

  it('is cleared when the partner got it right (mutual aid)', () => {
    expect(coopQuestionState([a(0, false)], [a(0, true)], 0)).toBe('cleared')
  })

  it('is failed only when both answered and both wrong', () => {
    expect(coopQuestionState([a(0, false)], [a(0, false)], 0)).toBe('failed')
  })

  it('is pending when only one has answered wrong so far', () => {
    expect(coopQuestionState([a(0, false)], [], 0)).toBe('pending')
  })

  it('is pending when nobody answered', () => {
    expect(coopQuestionState([], [], 0)).toBe('pending')
  })
})

describe('coopStatus', () => {
  it('counts cleared and failed across the series', () => {
    const mine = [a(0, true), a(1, false), a(2, false)]
    const theirs = [a(0, false), a(1, true), a(2, false)]
    // q0 cleared (me), q1 cleared (them), q2 failed (both wrong)
    const s = coopStatus(mine, theirs, 3, COOP_LIVES)
    expect(s.cleared).toBe(2)
    expect(s.failed).toBe(1)
    expect(s.livesLeft).toBe(COOP_LIVES - 1)
    expect(s.outcome).toBeNull()
  })

  it('is a team win when all questions are cleared', () => {
    const mine = [a(0, true), a(1, true)]
    const theirs = [a(0, false), a(1, false)]
    const s = coopStatus(mine, theirs, 2, COOP_LIVES)
    expect(s.outcome).toBe('won')
    expect(s.cleared).toBe(2)
  })

  it('is a team loss when shared lives run out', () => {
    const mine = [a(0, false), a(1, false), a(2, false)]
    const theirs = [a(0, false), a(1, false), a(2, false)]
    const s = coopStatus(mine, theirs, 10, 3)
    expect(s.failed).toBe(3)
    expect(s.livesLeft).toBe(0)
    expect(s.outcome).toBe('lost')
  })

  it('stays ongoing while questions are still pending', () => {
    const mine = [a(0, true)]
    const s = coopStatus(mine, [], 10, 3)
    expect(s.outcome).toBeNull()
    expect(s.cleared).toBe(1)
  })

  it('uses default series length and lives', () => {
    const s = coopStatus([], [])
    expect(s.livesLeft).toBe(COOP_LIVES)
    expect(s.cleared).toBe(0)
    // Nothing answered on a 10-question series → not won, not lost.
    expect(s.outcome).toBeNull()
  })
})

describe('coopScore', () => {
  it('equals the number of cleared questions', () => {
    const mine = [a(0, true), a(1, false)]
    const theirs = [a(1, true)]
    expect(coopScore(mine, theirs)).toBe(2)
  })
})

describe('partnerProgress', () => {
  it('counts how many questions the partner has answered', () => {
    expect(partnerProgress([a(0, true), a(1, false)])).toBe(2)
  })

  it('ignores out-of-range indices', () => {
    expect(partnerProgress([a(0, true), a(COOP_QUESTIONS + 5, true)])).toBe(1)
  })
})
