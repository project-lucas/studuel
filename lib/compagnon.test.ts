import { describe, it, expect } from 'vitest'
import {
  COMPANION_STAGES,
  stageForStreak,
  nextStage,
  stageProgress,
  companionMood,
  companionWeeklyLine,
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

describe('companionWeeklyLine', () => {
  it('adapte la phrase à la semaine, au nom du compagnon', () => {
    expect(companionWeeklyLine('Pixel', 0, 0)).toContain('attend ta première')
    expect(companionWeeklyLine('Pixel', 4, 2)).toContain('fier')
    expect(companionWeeklyLine('Pixel', 2, -1)).toContain('ennuie')
    expect(companionWeeklyLine('Pixel', 3, 0)).toContain('tient le rythme')
    expect(companionWeeklyLine('Flamme', 1, 0)).toContain('Flamme')
    // Singulier/pluriel propre.
    expect(companionWeeklyLine('Pixel', 1, 0)).toContain('1 session')
    expect(companionWeeklyLine('Pixel', 5, 0)).toContain('5 sessions')
  })
})
