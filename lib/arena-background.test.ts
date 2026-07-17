import { describe, expect, it } from 'vitest'
import {
  ARENA_SCHEDULE,
  arenaPeriodAt,
  arenaSlotAt,
  arenaSrcOf,
  isArenaPeriod,
  msUntilNextArenaChange,
  nextArenaSlot,
} from './arena-background'

describe('arenaPeriodAt', () => {
  it('couvre chaque plage horaire, bornes incluses', () => {
    // Arrange : les attentes du cahier des charges (heure → plage).
    const cases: Array<[number, string]> = [
      [0, 'night'],
      [5, 'night'],
      [6, 'morning'],
      [10, 'morning'],
      [11, 'noon'],
      [13, 'noon'],
      [14, 'afternoon'],
      [17, 'afternoon'],
      [18, 'evening'],
      [21, 'evening'],
      [22, 'night'],
      [23, 'night'],
    ]

    for (const [hour, period] of cases) {
      expect(arenaPeriodAt(hour), `à ${hour}h`).toBe(period)
    }
  })
})

describe('arenaSlotAt / arenaSrcOf', () => {
  it('retourne une image webp du dossier arene pour chaque plage', () => {
    for (const slot of ARENA_SCHEDULE) {
      expect(arenaSlotAt(slot.start).src).toMatch(/^\/images\/arene\/.+\.webp$/)
      expect(arenaSrcOf(slot.period)).toBe(slot.src)
    }
  })
})

describe('nextArenaSlot', () => {
  it('enchaîne les plages dans l’ordre et boucle nuit → matin', () => {
    expect(nextArenaSlot(7).period).toBe('noon')
    expect(nextArenaSlot(12).period).toBe('afternoon')
    expect(nextArenaSlot(15).period).toBe('evening')
    expect(nextArenaSlot(19).period).toBe('night')
    expect(nextArenaSlot(23).period).toBe('morning')
    expect(nextArenaSlot(3).period).toBe('morning')
  })
})

describe('msUntilNextArenaChange', () => {
  it('vise exactement la prochaine frontière de plage', () => {
    // 10h30 → bascule à 11h00 : 30 min.
    const at1030 = new Date(2026, 6, 17, 10, 30, 0)
    expect(msUntilNextArenaChange(at1030)).toBe(30 * 60_000)

    // 5h59m30 → bascule à 6h00 : 30 s.
    const at0559 = new Date(2026, 6, 17, 5, 59, 30)
    expect(msUntilNextArenaChange(at0559)).toBe(30_000)

    // 23h00 → prochaine frontière 6h00 le lendemain : 7 h.
    const at2300 = new Date(2026, 6, 17, 23, 0, 0)
    expect(msUntilNextArenaChange(at2300)).toBe(7 * 3_600_000)

    // Pile sur une frontière (6h00) → la suivante est 11h00 : 5 h.
    const at0600 = new Date(2026, 6, 17, 6, 0, 0)
    expect(msUntilNextArenaChange(at0600)).toBe(5 * 3_600_000)
  })

  it('reste strictement positif à toute heure', () => {
    for (let hour = 0; hour < 24; hour++) {
      const ms = msUntilNextArenaChange(new Date(2026, 6, 17, hour, 0, 0))
      expect(ms).toBeGreaterThan(0)
      expect(ms).toBeLessThanOrEqual(24 * 3_600_000)
    }
  })
})

describe('isArenaPeriod', () => {
  it('accepte les cinq plages et rejette le reste', () => {
    expect(isArenaPeriod('morning')).toBe(true)
    expect(isArenaPeriod('night')).toBe(true)
    expect(isArenaPeriod('minuit')).toBe(false)
    expect(isArenaPeriod(null)).toBe(false)
    expect(isArenaPeriod(undefined)).toBe(false)
  })
})
