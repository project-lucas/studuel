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
      [4, 'night'],
      [5, 'dawn'],
      [7, 'dawn'],
      [8, 'morning'],
      [11, 'morning'],
      [12, 'noon'],
      [14, 'noon'],
      [15, 'afternoon'],
      [17, 'afternoon'],
      [18, 'evening'],
      [20, 'evening'],
      [21, 'night'],
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
  it('enchaîne les plages dans l’ordre et boucle nuit → aube', () => {
    expect(nextArenaSlot(6).period).toBe('morning')
    expect(nextArenaSlot(9).period).toBe('noon')
    expect(nextArenaSlot(13).period).toBe('afternoon')
    expect(nextArenaSlot(16).period).toBe('evening')
    expect(nextArenaSlot(19).period).toBe('night')
    expect(nextArenaSlot(23).period).toBe('dawn')
    expect(nextArenaSlot(3).period).toBe('dawn')
  })
})

describe('msUntilNextArenaChange', () => {
  it('vise exactement la prochaine frontière de plage', () => {
    // 11h30 → bascule à 12h00 : 30 min.
    const at1130 = new Date(2026, 6, 17, 11, 30, 0)
    expect(msUntilNextArenaChange(at1130)).toBe(30 * 60_000)

    // 4h59m30 → bascule à 5h00 : 30 s.
    const at0459 = new Date(2026, 6, 17, 4, 59, 30)
    expect(msUntilNextArenaChange(at0459)).toBe(30_000)

    // 23h00 → prochaine frontière 5h00 le lendemain : 6 h.
    const at2300 = new Date(2026, 6, 17, 23, 0, 0)
    expect(msUntilNextArenaChange(at2300)).toBe(6 * 3_600_000)

    // Pile sur une frontière (5h00) → la suivante est 8h00 : 3 h.
    const at0500 = new Date(2026, 6, 17, 5, 0, 0)
    expect(msUntilNextArenaChange(at0500)).toBe(3 * 3_600_000)
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
  it('accepte les six plages et rejette le reste', () => {
    expect(isArenaPeriod('dawn')).toBe(true)
    expect(isArenaPeriod('morning')).toBe(true)
    expect(isArenaPeriod('night')).toBe(true)
    expect(isArenaPeriod('minuit')).toBe(false)
    expect(isArenaPeriod(null)).toBe(false)
    expect(isArenaPeriod(undefined)).toBe(false)
  })
})
