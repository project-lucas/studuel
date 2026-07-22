import { describe, it, expect } from 'vitest'
import { computeXp, levelFor, sessionXp, XP_RULES } from '@/lib/xp'

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

describe('sessionXp', () => {
  it('paye le forfait du quiz, bonus compris à partir de 8/10', () => {
    expect(sessionXp('quiz', 7, 10)).toBe(20)
    expect(sessionXp('quiz', 8, 10)).toBe(30)
    expect(sessionXp('quiz', 10, 10)).toBe(30)
  })

  it("verse l'XP MÊME sans aucune bonne réponse", () => {
    // Doctrine du projet : on récompense d'être venu réviser, on ne punit pas.
    expect(sessionXp('quiz', 0, 10)).toBe(20)
  })

  it('paye les flashcards au forfait', () => {
    expect(sessionXp('deck', 12, 12)).toBe(10)
  })

  it('la file « À revoir » ne rapporte pas moins que le quiz', () => {
    // C'est le geste qu'on veut quotidien : il serait absurde qu'il paye moins.
    expect(sessionXp('review', 8, 10)).toBe(sessionXp('quiz', 8, 10))
  })

  it('borne les valeurs aberrantes', () => {
    expect(sessionXp('quiz', 999, 10)).toBe(30) // ratio absurde → simple bonus
    expect(sessionXp('quiz', -5, 10)).toBe(20) // score négatif ramené au forfait
    expect(sessionXp('quiz', 3, -1)).toBe(20) // total absurde → pas de bonus
  })
})
