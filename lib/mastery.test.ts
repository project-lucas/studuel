import { describe, it, expect } from 'vitest'
import { masteryRank, type ChapterProgress } from '@/lib/mastery'

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
