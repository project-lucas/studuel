import { describe, it, expect } from 'vitest'
import {
  SRS_INTERVALS,
  addDays,
  intervalForStreak,
  reviewAfterAnswer,
  reviewQueue,
  countsBySubject,
  type ReviewItem,
} from '@/lib/srs'

const item = (over: Partial<ReviewItem>): ReviewItem => ({
  item_kind: 'question',
  item_id: 'q1',
  subject: 'Maths',
  streak: 0,
  lapses: 0,
  due_date: '2026-07-08',
  in_revanche: false,
  ...over,
})

describe('addDays', () => {
  it('avance dans le mois et passe les fins de mois', () => {
    expect(addDays('2026-07-08', 1)).toBe('2026-07-09')
    expect(addDays('2026-07-30', 3)).toBe('2026-08-02')
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01')
  })
})

describe('intervalForStreak', () => {
  it('suit les paliers J+1, J+3, J+7, J+16, J+35', () => {
    expect(intervalForStreak(1)).toBe(1)
    expect(intervalForStreak(2)).toBe(3)
    expect(intervalForStreak(3)).toBe(7)
    expect(intervalForStreak(4)).toBe(16)
    expect(intervalForStreak(5)).toBe(35)
  })

  it('plafonne au dernier palier sur les longues séries', () => {
    expect(intervalForStreak(12)).toBe(SRS_INTERVALS[SRS_INTERVALS.length - 1])
  })
})

describe('reviewAfterAnswer', () => {
  const today = '2026-07-08'

  it('premier passage réussi : J+1, hors Revanche', () => {
    expect(reviewAfterAnswer(null, true, today)).toEqual({
      streak: 1,
      lapses: 0,
      due_date: '2026-07-09',
      in_revanche: false,
    })
  })

  it('les succès consécutifs éloignent la prochaine révision', () => {
    const after = reviewAfterAnswer({ streak: 2, lapses: 1 }, true, today)
    expect(after.streak).toBe(3)
    expect(after.due_date).toBe(addDays(today, 7))
    expect(after.lapses).toBe(1) // les erreurs passées restent comptées
  })

  it("une erreur réinitialise la série, revient demain et entre dans la Revanche", () => {
    expect(reviewAfterAnswer({ streak: 4, lapses: 0 }, false, today)).toEqual({
      streak: 0,
      lapses: 1,
      due_date: '2026-07-09',
      in_revanche: true,
    })
  })

  it('une bonne réponse venge une erreur (sortie de la Revanche)', () => {
    const failed = reviewAfterAnswer(null, false, today)
    expect(failed.in_revanche).toBe(true)
    const avenged = reviewAfterAnswer(failed, true, addDays(today, 1))
    expect(avenged.in_revanche).toBe(false)
    expect(avenged.streak).toBe(1)
  })
})

describe('reviewQueue', () => {
  const today = '2026-07-08'

  it('retient les items dus (aujourd’hui ou en retard) et la Revanche', () => {
    const items = [
      item({ item_id: 'due', due_date: '2026-07-08' }),
      item({ item_id: 'late', due_date: '2026-07-01' }),
      item({ item_id: 'future', due_date: '2026-07-20' }),
      item({ item_id: 'rev', due_date: '2026-07-20', in_revanche: true }),
    ]
    const ids = reviewQueue(items, today).map((i) => i.item_id)
    expect(ids).toContain('due')
    expect(ids).toContain('late')
    expect(ids).toContain('rev')
    expect(ids).not.toContain('future')
  })

  it('classe la Revanche d’abord, puis les plus en retard', () => {
    const items = [
      item({ item_id: 'due', due_date: '2026-07-08' }),
      item({ item_id: 'late', due_date: '2026-07-01' }),
      item({ item_id: 'rev', due_date: '2026-07-09', in_revanche: true }),
    ]
    expect(reviewQueue(items, today).map((i) => i.item_id)).toEqual([
      'rev',
      'late',
      'due',
    ])
  })
})

describe('countsBySubject', () => {
  it('compte par matière, « Autre » pour les items sans matière', () => {
    const counts = countsBySubject([
      item({ subject: 'Maths' }),
      item({ subject: 'Maths' }),
      item({ subject: 'Anglais' }),
      item({ subject: null }),
    ])
    expect(counts.get('Maths')).toBe(2)
    expect(counts.get('Anglais')).toBe(1)
    expect(counts.get('Autre')).toBe(1)
  })
})
