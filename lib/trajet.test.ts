import { describe, it, expect } from 'vitest'
import { isCommuteNow, commuteDayKeys, commuteStreak } from '@/lib/trajet'

// Créneau 08:00-09:00 heure de Paris. En janvier (UTC+1), 07:30 UTC = 08:30.
const SLOTS = [{ start: '08:00', end: '09:00' }]

describe('isCommuteNow', () => {
  it('false sans créneaux configurés', () => {
    expect(isCommuteNow([], new Date('2026-01-15T07:30:00Z'))).toBe(false)
  })

  it('true dans le créneau, false en dehors', () => {
    expect(isCommuteNow(SLOTS, new Date('2026-01-15T07:30:00Z'))).toBe(true)
    expect(isCommuteNow(SLOTS, new Date('2026-01-15T11:00:00Z'))).toBe(false)
  })
})

describe('commuteDayKeys', () => {
  it('ne retient que les jours avec une session dans un créneau', () => {
    const days = commuteDayKeys(
      [
        { created_at: '2026-01-14T07:30:00Z' }, // 08:30 Paris → trajet
        { created_at: '2026-01-15T12:00:00Z' }, // 13:00 Paris → hors trajet
      ],
      SLOTS,
    )
    expect(days).toEqual(new Set(['2026-01-14']))
  })
})

describe('commuteStreak', () => {
  it('compte les jours consécutifs de sessions en trajet', () => {
    const sessions = [
      { created_at: '2026-01-14T07:30:00Z' },
      { created_at: '2026-01-15T07:35:00Z' },
    ]
    const now = new Date('2026-01-15T12:00:00Z')
    expect(commuteStreak(sessions, SLOTS, now)).toBe(2)
  })

  it('une session hors créneau ne nourrit pas la série', () => {
    const sessions = [{ created_at: '2026-01-15T12:00:00Z' }]
    const now = new Date('2026-01-15T13:00:00Z')
    expect(commuteStreak(sessions, SLOTS, now)).toBe(0)
  })
})
