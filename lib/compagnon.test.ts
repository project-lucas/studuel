import { describe, it, expect } from 'vitest'
import {
  COMPANION_STAGES,
  stageForStreak,
  nextStage,
  stageProgress,
  companionMood,
} from '@/lib/compagnon'

describe('stageForStreak', () => {
  it('suit les paliers d’évolution', () => {
    expect(stageForStreak(0).name).toBe('Braise')
    expect(stageForStreak(1).name).toBe('Étincelle')
    expect(stageForStreak(2).name).toBe('Étincelle')
    expect(stageForStreak(3).name).toBe('Flamme vive')
    expect(stageForStreak(7).name).toBe('Rayonnante')
    expect(stageForStreak(14).name).toBe('Brasier')
    expect(stageForStreak(30).name).toBe('Légendaire')
    expect(stageForStreak(365).name).toBe('Légendaire')
  })

  it('les paliers sont strictement croissants', () => {
    for (let i = 1; i < COMPANION_STAGES.length; i++) {
      expect(COMPANION_STAGES[i].minStreak).toBeGreaterThan(
        COMPANION_STAGES[i - 1].minStreak,
      )
    }
  })
})

describe('nextStage', () => {
  it('annonce la prochaine évolution, null à la forme finale', () => {
    expect(nextStage(0)?.name).toBe('Étincelle')
    expect(nextStage(5)?.name).toBe('Rayonnante')
    expect(nextStage(30)).toBeNull()
  })
})

describe('stageProgress', () => {
  it('progresse de 0 à 1 entre deux paliers', () => {
    expect(stageProgress(3)).toBe(0) // tout juste Flamme vive (3 → 7)
    expect(stageProgress(5)).toBe(0.5)
    expect(stageProgress(30)).toBe(1) // forme finale
  })
})

describe('companionMood', () => {
  it('nourri aujourd’hui : en forme, rayonnant dès 7 jours de série', () => {
    expect(companionMood(true, 1)).toBe('en_forme')
    expect(companionMood(true, 7)).toBe('rayonnant')
  })

  it('rien aujourd’hui : affamé si la série vit, endormi sinon', () => {
    expect(companionMood(false, 3)).toBe('affame')
    expect(companionMood(false, 0)).toBe('endormi')
  })
})
