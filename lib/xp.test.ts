import { describe, it, expect } from 'vitest'
import { computeXp, levelFor, XP_RULES } from '@/lib/xp'

describe('computeXp', () => {
  it('additionne quiz, decks, leçons et défis selon les règles', () => {
    const xp = computeXp({
      quizzes: [{ score: 4 }], // 4×10 + 20 = 60
      decks: [{ cards_count: 10 }], // 10×5 + 20 = 70
      lessonsCount: 2, // 2×15 = 30
      challengesXp: 80,
    })
    expect(xp).toBe(60 + 70 + 30 + 80)
  })

  it('vaut 0 sans activité', () => {
    expect(
      computeXp({ quizzes: [], decks: [], lessonsCount: 0, challengesXp: 0 }),
    ).toBe(0)
  })

  it('le bonus de session est payé même à 0 bonne réponse', () => {
    expect(
      computeXp({
        quizzes: [{ score: 0 }],
        decks: [],
        lessonsCount: 0,
        challengesXp: 0,
      }),
    ).toBe(XP_RULES.quizBonus)
  })
})

describe('levelFor', () => {
  it('niveau 1 à 0 XP, progression nulle', () => {
    const level = levelFor(0)
    expect(level.level).toBe(1)
    expect(level.progress).toBe(0)
    expect(level.nextAt).toBe(100)
  })

  it('franchit le palier pile au seuil', () => {
    expect(levelFor(99).level).toBe(1)
    expect(levelFor(100).level).toBe(2)
  })

  it('progression 0..1 entre deux paliers', () => {
    // Palier 2 : 100 → 250. À 175 : mi-chemin.
    expect(levelFor(175).progress).toBeCloseTo(0.5)
  })

  it('au max : progress = 1 et pas de palier suivant', () => {
    const top = levelFor(999999)
    expect(top.level).toBe(10)
    expect(top.progress).toBe(1)
    expect(top.nextAt).toBeNull()
  })
})
