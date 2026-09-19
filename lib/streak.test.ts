import { describe, it, expect } from 'vitest'
import {
  AUCUN_GEL,
  computeStreak,
  parseGelsSerie,
  toDayKey,
  weekProgress,
  type GelsSerie,
} from '@/lib/streak'

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

describe('computeStreak — gels de série (368)', () => {
  const gels = (joursGeles: string[], gelsDisponibles = 0): GelsSerie => ({
    joursGeles: new Set(joursGeles),
    gelsDisponibles,
  })

  it('sans gels, le calcul est celui d’avant', () => {
    const days = new Set(['2026-07-08', '2026-07-06'])
    expect(computeStreak(days, NOW, AUCUN_GEL)).toBe(computeStreak(days, NOW))
  })

  it('un jour gelé ponte la série sans la faire monter', () => {
    const days = new Set(['2026-07-08', '2026-07-06', '2026-07-05'])
    expect(computeStreak(days, NOW, gels(['2026-07-07']))).toBe(3)
  })

  it('un jour gelé hier garde la clémence d’aujourd’hui', () => {
    const days = new Set(['2026-07-06', '2026-07-05'])
    expect(computeStreak(days, NOW, gels(['2026-07-07']))).toBe(2)
  })

  it('un gel EN RÉSERVE couvre le trou qui court', () => {
    // Rien hier ni aujourd'hui : sans gel, la série est morte (0) ; avec un
    // gel en réserve, elle attend que l'élève revienne le consommer.
    const days = new Set(['2026-07-06', '2026-07-05'])
    expect(computeStreak(days, NOW, gels([], 0))).toBe(0)
    expect(computeStreak(days, NOW, gels([], 1))).toBe(2)
  })

  it('deux jours manqués demandent deux gels', () => {
    const days = new Set(['2026-07-05', '2026-07-04'])
    expect(computeStreak(days, NOW, gels([], 1))).toBe(0)
    expect(computeStreak(days, NOW, gels([], 2))).toBe(2)
  })

  it('la réserve ne répare pas un ancien trou', () => {
    // Aujourd'hui actif : le trou du 07 est derrière, wallet_touch l'a déjà
    // tranché (gel consommé → jour gelé, sinon série repartie à 1).
    expect(computeStreak(new Set(['2026-07-08', '2026-07-06']), NOW, gels([], 2))).toBe(1)
    // Hier actif, trou avant-hier : la réserve ne remonte pas si loin.
    expect(computeStreak(new Set(['2026-07-07', '2026-07-05']), NOW, gels([], 2))).toBe(1)
  })

  it('des jours gelés sans activité autour ne font pas une série', () => {
    expect(computeStreak(new Set(), NOW, gels(['2026-07-07', '2026-07-06'], 2))).toBe(0)
  })

  it('une réserve démesurée est bornée à deux gels', () => {
    const days = new Set(['2026-07-01'])
    expect(computeStreak(days, NOW, gels([], 1_000_000))).toBe(0)
  })
})

describe('parseGelsSerie', () => {
  it('rend AUCUN_GEL sur une ligne absente', () => {
    expect(parseGelsSerie(null)).toBe(AUCUN_GEL)
    expect(parseGelsSerie(undefined)).toBe(AUCUN_GEL)
  })

  it('lit les jours gelés et la réserve', () => {
    const g = parseGelsSerie({ jours_geles: ['2026-07-07'], gels_serie: 1 })
    expect([...g.joursGeles]).toEqual(['2026-07-07'])
    expect(g.gelsDisponibles).toBe(1)
  })

  it('écarte les dates illisibles et borne la réserve', () => {
    const g = parseGelsSerie({ jours_geles: ['07/07/2026', 3, '2026-07-06'], gels_serie: 9 })
    expect([...g.joursGeles]).toEqual(['2026-07-06'])
    expect(g.gelsDisponibles).toBe(2)
    expect(parseGelsSerie({ jours_geles: null, gels_serie: 'x' }).gelsDisponibles).toBe(0)
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
