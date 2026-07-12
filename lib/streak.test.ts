import { describe, it, expect } from 'vitest'
import { toDayKey, computeStreak, weekProgress } from '@/lib/streak'

// Mercredi 8 juillet 2026, midi UTC — repère stable pour tous les tests.
const NOW = new Date('2026-07-08T12:00:00Z')

describe('toDayKey', () => {
  it('extrait la clé UTC YYYY-MM-DD', () => {
    expect(toDayKey(new Date('2026-07-08T23:59:59Z'))).toBe('2026-07-08')
    expect(toDayKey(new Date('2026-07-08T00:00:00Z'))).toBe('2026-07-08')
  })
})

describe('computeStreak', () => {
  it('vaut 0 sans aucune activité', () => {
    expect(computeStreak(new Set(), NOW)).toBe(0)
  })

  it("compte les jours consécutifs en remontant depuis aujourd'hui", () => {
    const days = new Set(['2026-07-08', '2026-07-07', '2026-07-06'])
    expect(computeStreak(days, NOW)).toBe(3)
  })

  it("clémence : rien aujourd'hui mais activité hier → la série d'hier vit", () => {
    const days = new Set(['2026-07-07', '2026-07-06'])
    expect(computeStreak(days, NOW)).toBe(2)
  })

  it("vaut 0 si la dernière activité date d'avant-hier", () => {
    const days = new Set(['2026-07-06', '2026-07-05'])
    expect(computeStreak(days, NOW)).toBe(0)
  })

  it("un trou casse la série : seuls les jours contigus comptent", () => {
    const days = new Set(['2026-07-08', '2026-07-06', '2026-07-05'])
    expect(computeStreak(days, NOW)).toBe(1)
  })
})

describe('weekProgress', () => {
  it('aligne la semaine sur lundi et marque aujourd’hui + le futur', () => {
    const days = new Set(['2026-07-06', '2026-07-08'])
    const week = weekProgress(days, NOW)

    expect(week).toHaveLength(7)
    // Lundi 6 juillet : fait. Mardi : rien. Mercredi (aujourd'hui) : fait.
    expect(week[0]).toEqual({ done: true, isToday: false, isFuture: false })
    expect(week[1]).toEqual({ done: false, isToday: false, isFuture: false })
    expect(week[2]).toEqual({ done: true, isToday: true, isFuture: false })
    // Jeudi → dimanche : futur.
    for (const day of week.slice(3)) {
      expect(day.isFuture).toBe(true)
      expect(day.done).toBe(false)
    }
  })

  it('un dimanche reste dans la semaine commencée le lundi précédent', () => {
    const sunday = new Date('2026-07-12T12:00:00Z')
    const week = weekProgress(new Set(['2026-07-06']), sunday)
    expect(week[0].done).toBe(true) // lundi 6 juillet
    expect(week[6].isToday).toBe(true) // dimanche 12 juillet
  })
})
