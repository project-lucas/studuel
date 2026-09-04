import { describe, expect, it } from 'vitest'
import {
  COURSE_MAX_MS,
  GOAL_POINTS,
  GOLDEN_MAX_INDEX,
  GOLDEN_MIN_INDEX,
  courseClock,
  courseOutcome,
  countsAsWin,
  fillRatio,
  goldenIndex,
  hasReachedGoal,
  isSprint,
  leader,
  outcomeCaption,
  overtake,
  pointsForAnswer,
  sanitizeStats,
} from '@/lib/duel/course'
import { answerPoints } from '@/lib/duel90'

describe('la question dorée', () => {
  it('se tire de la graine, dans la fenêtre 3e..8e question', () => {
    for (const seed of ['a', 'b', 'course#1', 'course#2', 'xyz']) {
      const i = goldenIndex(seed)
      expect(i).toBeGreaterThanOrEqual(GOLDEN_MIN_INDEX)
      expect(i).toBeLessThanOrEqual(GOLDEN_MAX_INDEX)
      expect(goldenIndex(seed)).toBe(i)
    }
  })

  it('varie avec la graine', () => {
    const seen = new Set(
      Array.from({ length: 40 }, (_, i) => goldenIndex(`graine-${i}`)),
    )
    expect(seen.size).toBeGreaterThan(2)
  })
})

describe('les points', () => {
  it('sont ceux du Duel 90 s, et doublent sur la dorée', () => {
    const base = answerPoints(0, 1500)
    expect(pointsForAnswer({ good: true, comboBefore: 0, answerMs: 1500, golden: false })).toBe(base)
    expect(pointsForAnswer({ good: true, comboBefore: 0, answerMs: 1500, golden: true })).toBe(base * 2)
  })

  it('une erreur ne retire rien, même dorée', () => {
    expect(pointsForAnswer({ good: false, comboBefore: 5, answerMs: 100, golden: true })).toBe(0)
  })
})

describe('la barre', () => {
  it('se remplit jusqu’à 1, jamais au-delà', () => {
    expect(fillRatio(0)).toBe(0)
    expect(fillRatio(GOAL_POINTS / 2)).toBe(0.5)
    expect(fillRatio(GOAL_POINTS * 3)).toBe(1)
    expect(fillRatio(Number.NaN)).toBe(0)
  })

  it('est pleine à GOAL_POINTS', () => {
    expect(hasReachedGoal(GOAL_POINTS - 1)).toBe(false)
    expect(hasReachedGoal(GOAL_POINTS)).toBe(true)
  })

  it('le sprint s’ouvre quand UN camp dépasse 70 %', () => {
    expect(isSprint(0, 0)).toBe(false)
    expect(isSprint(699, 100)).toBe(false)
    expect(isSprint(700, 0)).toBe(true)
    expect(isSprint(0, 700)).toBe(true)
  })
})

describe('qui mène', () => {
  it('et le dépassement ne célèbre que le changement de tête', () => {
    expect(leader(0, 0)).toBeNull()
    expect(leader(100, 0)).toBe('moi')
    expect(leader(0, 100)).toBe('rival')
    // Premier point de la course : un départ, pas un dépassement.
    expect(overtake({ me: 0, rival: 0 }, { me: 100, rival: 0 })).toBeNull()
    // Le rival avait marqué, je le passe.
    expect(overtake({ me: 0, rival: 100 }, { me: 150, rival: 100 })).toBe('moi')
    // Retour à égalité : rien à annoncer.
    expect(overtake({ me: 0, rival: 100 }, { me: 100, rival: 100 })).toBeNull()
    // Depuis l'égalité (non nulle), celui qui repart devant l'a dépassé.
    expect(overtake({ me: 100, rival: 100 }, { me: 100, rival: 250 })).toBe('rival')
    // L'écart se creuse sans changer de tête : silence.
    expect(overtake({ me: 300, rival: 100 }, { me: 450, rival: 100 })).toBeNull()
  })
})

describe('l’issue', () => {
  it('le premier à remplir sa barre gagne', () => {
    expect(courseOutcome({ score: 1000, goalAtMs: 40_000 }, { score: 1100, goalAtMs: 45_000 })).toBe('win')
    expect(courseOutcome({ score: 1000, goalAtMs: 50_000 }, { score: 1000, goalAtMs: 45_000 })).toBe('loss')
    expect(courseOutcome({ score: 1000, goalAtMs: 45_000 }, { score: 1000, goalAtMs: 45_000 })).toBe('draw')
  })

  it('une barre pleine bat une barre plus haute jamais pleine', () => {
    expect(courseOutcome({ score: 1000, goalAtMs: 80_000 }, { score: 950, goalAtMs: null })).toBe('win')
    expect(courseOutcome({ score: 950, goalAtMs: null }, { score: 1000, goalAtMs: 60_000 })).toBe('loss')
  })

  it('sinon, au score ; l’égalité est une égalité — comptée pour l’élève', () => {
    expect(courseOutcome({ score: 600, goalAtMs: null }, { score: 550, goalAtMs: null })).toBe('win')
    expect(courseOutcome({ score: 500, goalAtMs: null }, { score: 550, goalAtMs: null })).toBe('loss')
    expect(courseOutcome({ score: 500, goalAtMs: null }, { score: 500, goalAtMs: null })).toBe('draw')
    expect(countsAsWin('draw')).toBe(true)
    expect(countsAsWin('loss')).toBe(false)
  })

  it('la légende dit l’écart, jamais un jugement', () => {
    expect(
      outcomeCaption('win', 'Nina', { score: 1000, goalAtMs: 40_000 }, { score: 800, goalAtMs: 43_500 }),
    ).toBe('Tu as fini 3,5 s avant Nina.')
    expect(
      outcomeCaption('loss', 'Nina', { score: 640, goalAtMs: null }, { score: 700, goalAtMs: null }),
    ).toBe('Battu d’un cheveu : 60 points.')
    expect(
      outcomeCaption('draw', 'Nina', { score: 640, goalAtMs: null }, { score: 640, goalAtMs: null }),
    ).toContain('l’avantage te revient')
  })
})

describe('l’assainissement', () => {
  it('borne tout, et refuse une arrivée sans le score qui va avec', () => {
    const s = sanitizeStats({ score: 99_999, correct: 80, answered: 70, bestCombo: 90, goalAtMs: 10 })
    expect(s.answered).toBe(50)
    expect(s.correct).toBe(50)
    expect(s.bestCombo).toBe(50)
    expect(s.goalAtMs).toBe(10)
    expect(sanitizeStats({ score: 500, goalAtMs: 3000 }).goalAtMs).toBeNull()
    expect(sanitizeStats({ score: 1200, goalAtMs: COURSE_MAX_MS * 2 }).goalAtMs).toBe(COURSE_MAX_MS)
    expect(sanitizeStats({}).score).toBe(0)
  })

  it('le chrono s’écrit minutes:secondes', () => {
    expect(courseClock(COURSE_MAX_MS)).toBe('1:30')
    expect(courseClock(6_100)).toBe('0:07')
    expect(courseClock(-5)).toBe('0:00')
  })
})
