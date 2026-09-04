import { describe, expect, it } from 'vitest'
import { COURSE_MAX_MS, GOAL_POINTS, goldenIndex } from '@/lib/duel/course'
import {
  ACCURACY_MAX,
  ACCURACY_MIN,
  PACE_MAX_MS,
  PACE_MIN_MS,
  TEMPERAMENTS,
  buildTimeline,
  paceFactor,
  rivalScoreAtEnd,
  rivalStateAt,
  timelineFromSteps,
  tuningForTrophies,
  type RivalTuning,
} from '@/lib/duel/rival'
import { seededRng } from '@/lib/defi-modes'

const tuning = (over: Partial<RivalTuning> = {}): RivalTuning => ({
  accuracy: 0.7,
  paceMs: 4500,
  temperament: 'metronome',
  ...over,
})

describe('le réglage par trophées', () => {
  it('monte avec la bande, reste dans les bornes', () => {
    const debutant = tuningForTrophies(0)
    const fort = tuningForTrophies(900)
    expect(fort.accuracy).toBeGreaterThan(debutant.accuracy)
    expect(fort.paceMs).toBeLessThan(debutant.paceMs)
    for (const t of [-50, 0, 120, 450, 800, 5000, Number.NaN]) {
      const r = tuningForTrophies(t, 1)
      expect(r.accuracy).toBeGreaterThanOrEqual(ACCURACY_MIN)
      expect(r.accuracy).toBeLessThanOrEqual(ACCURACY_MAX)
      expect(r.paceMs).toBeGreaterThanOrEqual(PACE_MIN_MS)
      expect(r.paceMs).toBeLessThanOrEqual(PACE_MAX_MS)
    }
  })

  it('la force ne décale que légèrement', () => {
    const a = tuningForTrophies(300, -1)
    const b = tuningForTrophies(300, 1)
    expect(b.accuracy - a.accuracy).toBeLessThanOrEqual(0.21)
  })
})

describe('le tempérament', () => {
  it('déforme la cadence dans le sens annoncé', () => {
    const rng = () => 0.5
    expect(paceFactor('fleche', 0, rng)).toBeLessThan(paceFactor('fleche', 1, rng))
    expect(paceFactor('finisseur', 0, rng)).toBeGreaterThan(paceFactor('finisseur', 1, rng))
    expect(paceFactor('metronome', 0, rng)).toBeCloseTo(paceFactor('metronome', 1, rng))
  })

  it('reste positif pour tous, à tout instant', () => {
    const rng = seededRng('t')
    for (const t of TEMPERAMENTS) {
      for (let p = 0; p <= 1; p += 0.1) expect(paceFactor(t, p, rng)).toBeGreaterThan(0.3)
    }
  })
})

describe('la ligne de temps d’un robot', () => {
  it('est déterministe et varie avec la graine', () => {
    const a = buildTimeline('s1', tuning(), 4)
    const b = buildTimeline('s1', tuning(), 4)
    const c = buildTimeline('s2', tuning(), 4)
    expect(a).toEqual(b)
    expect(a.events.map((e) => e.atMs)).not.toEqual(c.events.map((e) => e.atMs))
  })

  it('ne dépasse jamais les 90 s, et s’arrête à la barre pleine', () => {
    for (const t of TEMPERAMENTS) {
      const tl = buildTimeline(`x-${t}`, tuning({ temperament: t, accuracy: 0.95, paceMs: 3000 }), 3)
      for (const e of tl.events) expect(e.atMs).toBeLessThanOrEqual(COURSE_MAX_MS)
      if (tl.goalAtMs !== null) {
        expect(tl.finalScore).toBeGreaterThanOrEqual(GOAL_POINTS)
        expect(tl.events[tl.events.length - 1].atMs).toBe(tl.goalAtMs)
      }
    }
  })

  it('le score ne redescend jamais et compte la dorée', () => {
    const tl = buildTimeline('dorée', tuning({ accuracy: 1 }), 2)
    let prev = 0
    for (const e of tl.events) {
      expect(e.total).toBeGreaterThanOrEqual(prev)
      prev = e.total
    }
    // 3e réponse (index 2) juste et dorée : elle vaut le double de la 2e à
    // vitesse égale — on vérifie au moins qu'elle vaut plus qu'une réponse
    // ordinaire de même série.
    const sansDoree = buildTimeline('dorée', tuning({ accuracy: 1 }), 99)
    expect(tl.events[2].total - tl.events[1].total).toBeGreaterThan(
      sansDoree.events[2].total - sansDoree.events[1].total,
    )
  })

  it('un rival réglé sur un débutant ne boucle pas la barre trop vite', () => {
    const t = tuningForTrophies(0)
    const tl = buildTimeline('lent', { ...t, temperament: 'metronome' }, 4)
    expect(tl.goalAtMs === null || tl.goalAtMs > 30_000).toBe(true)
  })
})

describe('la ligne de temps d’un replay', () => {
  it('recalcule les points depuis les pas, avec la dorée du duel', () => {
    const steps = [
      { at: 3000, good: true, ms: 3000 },
      { at: 6500, good: true, ms: 3000 },
      { at: 9000, good: false, ms: 2000 },
      { at: 12_000, good: true, ms: 2500 },
    ]
    const tl = timelineFromSteps(steps, 1)
    expect(tl.events).toHaveLength(4)
    expect(tl.events[1].total - tl.events[0].total).toBeGreaterThan(tl.events[0].total)
    expect(tl.events[2].total).toBe(tl.events[1].total)
    expect(tl.goalAtMs).toBeNull()
  })

  it('ignore les pas au-delà de la course et remet les instants dans l’ordre', () => {
    const tl = timelineFromSteps(
      [
        { at: 5000, good: true, ms: 1000 },
        { at: 4000, good: true, ms: 1000 },
        { at: 200_000, good: true, ms: 1000 },
      ],
      9,
    )
    expect(tl.events.map((e) => e.atMs)).toEqual([5000, 5000])
  })
})

describe('l’instantané du rival', () => {
  it('rejoue l’escalier : avant la première frappe, rien', () => {
    const tl = buildTimeline('snap', tuning({ accuracy: 1, paceMs: 4000 }), 5)
    const zero = rivalStateAt(tl, 0)
    expect(zero.total).toBe(0)
    expect(zero.answered).toBe(0)
    expect(zero.thinking).toBe(true)
    expect(zero.nextAtMs).toBe(tl.events[0].atMs)

    const apres = rivalStateAt(tl, tl.events[1].atMs)
    expect(apres.answered).toBe(2)
    expect(apres.total).toBe(tl.events[1].total)
    expect(apres.lastEvent).toEqual(tl.events[1])
  })

  it('sait quand il a fini', () => {
    const tl = buildTimeline('fin', tuning({ accuracy: 1, paceMs: 3000 }), 5)
    expect(tl.goalAtMs).not.toBeNull()
    const fini = rivalStateAt(tl, (tl.goalAtMs ?? 0) + 1)
    expect(fini.finished).toBe(true)
    expect(fini.thinking).toBe(false)
    expect(fini.total).toBe(tl.finalScore)
  })

  it('le score à l’arrêt de la course est celui du moment, pas la projection à 90 s', () => {
    const tl = buildTimeline('arret', tuning({ accuracy: 0.8, paceMs: 4000 }), 5)
    // Je finis à 20 s : on lit le rival à 20 s, pas plus loin.
    expect(rivalScoreAtEnd(tl, 20_000)).toBe(rivalStateAt(tl, 20_000).total)
    expect(rivalScoreAtEnd(tl, 20_000)).toBeLessThanOrEqual(tl.finalScore)
    // Personne n'a fini : la course va au bout.
    const lent = buildTimeline('lent', tuning({ accuracy: 0.3, paceMs: 7000 }), 5)
    expect(lent.goalAtMs).toBeNull()
    expect(rivalScoreAtEnd(lent, null)).toBe(lent.finalScore)
    // Le rival a fini avant moi : on s'arrête à SON arrivée.
    const rapide = buildTimeline('rapide', tuning({ accuracy: 1, paceMs: 3000 }), 5)
    expect(rapide.goalAtMs).not.toBeNull()
    expect(rivalScoreAtEnd(rapide, (rapide.goalAtMs ?? 0) + 5000)).toBe(rapide.finalScore)
  })

  it('le hasard de la graine ne fait pas de la triche : même graine, même course', () => {
    const rng = seededRng('goal')
    expect(goldenIndex('goal')).toBe(goldenIndex('goal'))
    expect(rng()).toBeGreaterThanOrEqual(0)
  })
})
