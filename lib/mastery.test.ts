import { describe, it, expect } from 'vitest'
import { masteryRank, chapterState, type ChapterProgress } from '@/lib/mastery'

const p = (
  value: number,
  quizAttempted = true,
  lessonDone = false,
): ChapterProgress => ({ value, quizAttempted, lessonDone })

describe('masteryRank', () => {
  it('chapitre pas commencé → pas de rang', () => {
    expect(masteryRank(undefined)).toBeNull()
    expect(masteryRank(p(0, false, false))).toBeNull()
  })

  it('quiz tenté et raté 0/10 (sans leçon) → bronze, pas null', () => {
    // L'élève en difficulté ne doit pas disparaître du radar.
    expect(masteryRank(p(0, true, false))).toBe('bronze')
  })

  it('leçon lue sans quiz → bronze, quel que soit le plancher', () => {
    expect(masteryRank(p(0.3, false, true))).toBe('bronze')
    // Lire ne suffit pas pour grimper : pas d'argent sans quiz.
    expect(masteryRank(p(0.6, false, true))).toBe('bronze')
  })

  it('les rangs suivent le meilleur score de quiz', () => {
    expect(masteryRank(p(0.4))).toBe('bronze')
    expect(masteryRank(p(0.5))).toBe('argent')
    expect(masteryRank(p(0.8))).toBe('or')
    expect(masteryRank(p(0.9))).toBe('diamant')
    expect(masteryRank(p(1))).toBe('legendaire')
  })

  it('les seuils sont exacts (bornes incluses)', () => {
    expect(masteryRank(p(0.79))).toBe('argent')
    expect(masteryRank(p(0.89))).toBe('or')
    expect(masteryRank(p(0.99))).toBe('diamant')
  })
})

describe('chapterState', () => {
  it('rien de posé → à commencer', () => {
    expect(chapterState(undefined)).toBe('a_commencer')
    expect(chapterState(p(0, false, false))).toBe('a_commencer')
  })

  it('quiz tenté et raté 0/10 (sans leçon) → fragile, pas à commencer', () => {
    // Le quiz raté est justement le chapitre à retravailler en priorité.
    expect(chapterState(p(0, true, false))).toBe('fragile')
  })

  it('leçon lue sans quiz → en cours', () => {
    expect(chapterState(p(0.3, false, true))).toBe('en_cours')
  })

  it('quiz < 50 % → fragile ; ≥ 50 % → en cours ; ≥ 80 % → maîtrisé', () => {
    expect(chapterState(p(0.4))).toBe('fragile')
    expect(chapterState(p(0.5))).toBe('en_cours')
    expect(chapterState(p(0.8))).toBe('maitrise')
  })
})
