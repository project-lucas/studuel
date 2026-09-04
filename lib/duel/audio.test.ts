import { describe, expect, it } from 'vitest'
import {
  FILL_ROOT,
  HEARTBEAT_FAST_MS,
  HEARTBEAT_SLOW_MS,
  fillTone,
  finishTones,
  goldenTones,
  heartbeatIntervalMs,
  heartbeatTones,
  overtakeTones,
  rivalGoodTones,
  rivalWrongTones,
  sprintTones,
  vsTones,
} from '@/lib/duel/audio'
import { correctTones } from '@/lib/game-audio'
import type { ToneSpec } from '@/lib/game-audio'

const sane = (tones: ToneSpec[]) => {
  expect(tones.length).toBeGreaterThan(0)
  for (const t of tones) {
    expect(t.freq).toBeGreaterThan(20)
    expect(t.freq).toBeLessThan(5000)
    expect(t.at).toBeGreaterThanOrEqual(0)
    expect(t.dur).toBeGreaterThan(0)
    expect(t.peak).toBeGreaterThan(0)
    expect(t.peak).toBeLessThanOrEqual(0.06)
  }
}

describe('la partition de la course', () => {
  it('toutes les figures sont jouables et restent à volume de feedback', () => {
    for (const f of [rivalGoodTones(), rivalWrongTones(), overtakeTones(true), overtakeTones(false), goldenTones(), vsTones(), finishTones(true), finishTones(false), sprintTones(), heartbeatTones()]) {
      sane(f)
    }
  })

  it('le rival marque plus grave et plus doux que moi', () => {
    const mine = correctTones('cuivre', 1)
    const theirs = rivalGoodTones()
    expect(Math.max(...theirs.map((t) => t.freq))).toBeLessThan(Math.min(...mine.map((t) => t.freq)))
    expect(Math.max(...theirs.map((t) => t.peak))).toBeLessThanOrEqual(Math.max(...mine.map((t) => t.peak)))
  })

  it('le dépassement monte quand je passe devant, descend quand on me double', () => {
    const up = overtakeTones(true).map((t) => t.freq)
    const down = overtakeTones(false).map((t) => t.freq)
    for (let i = 1; i < up.length; i++) expect(up[i]).toBeGreaterThan(up[i - 1])
    for (let i = 1; i < down.length; i++) expect(down[i]).toBeLessThan(down[i - 1])
  })

  it('la jauge chante plus haut à mesure qu’elle se remplit', () => {
    expect(fillTone(0).freq).toBeCloseTo(FILL_ROOT)
    expect(fillTone(0.5).freq).toBeGreaterThan(fillTone(0.2).freq)
    expect(fillTone(1).freq).toBeGreaterThan(fillTone(0.5).freq)
    expect(fillTone(7).freq).toBe(fillTone(1).freq)
  })

  it('le cœur se resserre avec la course', () => {
    expect(heartbeatIntervalMs(0)).toBe(HEARTBEAT_SLOW_MS)
    expect(heartbeatIntervalMs(1)).toBe(HEARTBEAT_FAST_MS)
    expect(heartbeatIntervalMs(0.5)).toBeLessThan(HEARTBEAT_SLOW_MS)
    expect(heartbeatIntervalMs(Number.NaN)).toBe(HEARTBEAT_SLOW_MS)
  })

  it('l’arrivée gagnée monte, l’arrivée perdue tombe', () => {
    const won = finishTones(true).map((t) => t.freq)
    const lost = finishTones(false).map((t) => t.freq)
    expect(won[won.length - 1]).toBeGreaterThan(won[0])
    expect(lost[lost.length - 1]).toBeLessThan(lost[0])
  })
})
