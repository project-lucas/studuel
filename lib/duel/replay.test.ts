import { describe, expect, it } from 'vitest'
import { hasReachedGoal } from '@/lib/duel/course'
import { timelineFromSteps } from '@/lib/duel/rival'
import {
  MAX_REPLAY_STEPS,
  MIN_GAP_MS,
  isReplayUsable,
  sanitizeSteps,
  stepsFromEvents,
} from '@/lib/duel/replay'

describe('l’assainissement d’un replay', () => {
  it('garde les pas valides, dans l’ordre, et écarte le reste', () => {
    const steps = sanitizeSteps([
      { at: 3000, good: true, ms: 2800 },
      { at: 2000, good: true, ms: 1000 }, // remonte le temps : écarté
      { at: 6000, good: 'oui', ms: 1000 }, // good non booléen : écarté
      { at: 7000, good: false, ms: 50 }, // réflexion impossible : écarté
      { at: 8000, good: false, ms: 1500 },
      null,
      'x',
      { at: 500_000, good: true, ms: 1000 }, // hors course : écarté
    ])
    expect(steps).toEqual([
      { at: 3000, good: true, ms: 2800 },
      { at: 8000, good: false, ms: 1500 },
    ])
  })

  it('plafonne le volume et rend vide sur n’importe quoi', () => {
    const trop = Array.from({ length: 200 }, (_, i) => ({ at: i * 100, good: true, ms: 400 }))
    expect(sanitizeSteps(trop)).toHaveLength(MAX_REPLAY_STEPS)
    expect(sanitizeSteps(null)).toEqual([])
    expect(sanitizeSteps({ at: 1 })).toEqual([])
  })

  it('une trace trop courte ne fait pas un rival', () => {
    expect(isReplayUsable([])).toBe(false)
    expect(isReplayUsable(sanitizeSteps([{ at: 1000, good: true, ms: 900 }]))).toBe(false)
    expect(
      isReplayUsable(
        sanitizeSteps([
          { at: 1000, good: true, ms: 900 },
          { at: 2000, good: true, ms: 900 },
          { at: 3000, good: false, ms: 900 },
        ]),
      ),
    ).toBe(true)
  })

  it('se construit depuis les frappes de l’écran', () => {
    expect(
      stepsFromEvents([
        { atMs: 2500, good: true, answerMs: 2500, total: 150 },
        { atMs: 5200, good: false, answerMs: 2000, total: 150 },
      ]),
    ).toEqual([
      { at: 2500, good: true, ms: 2500 },
      { at: 5200, good: false, ms: 2000 },
    ])
  })

  it('ne va jamais plus vite qu’un joueur : une trace forgée est ralentie', () => {
    // Cinq bonnes réponses « à l'instant 0 » : la barre se remplissait à 0 ms.
    const forgee = Array.from({ length: 5 }, () => ({ at: 0, good: true, ms: 250 }))
    const steps = sanitizeSteps(forgee)
    expect(steps).toHaveLength(5)
    expect(steps[0].at).toBe(250)
    for (let i = 1; i < steps.length; i++) {
      expect(steps[i].at - steps[i - 1].at).toBeGreaterThanOrEqual(MIN_GAP_MS + steps[i].ms)
    }
    const rival = timelineFromSteps(steps, 99)
    expect(hasReachedGoal(rival.finalScore)).toBe(true)
    expect(rival.goalAtMs).toBeGreaterThanOrEqual(250 + 4 * (MIN_GAP_MS + 250))
  })

  it('laisse intacte une trace réellement jouée', () => {
    const jouee = [
      { at: 2100, good: true, ms: 2100 },
      { at: 5000, good: false, ms: 2250 },
      { at: 7400, good: true, ms: 1750 },
    ]
    expect(sanitizeSteps(jouee)).toEqual(jouee)
  })
})
