import { describe, expect, it } from 'vitest'
import {
  MAX_REPLAY_STEPS,
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
})
