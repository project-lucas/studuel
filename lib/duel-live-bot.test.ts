import { describe, expect, it } from 'vitest'
import {
  BOT_JOIN_MAX_MS,
  BOT_JOIN_MIN_MS,
  BOT_QUESTION_MAX_MS,
  BOT_QUESTION_MIN_MS,
  botAccuracy,
  botJoinDelayMs,
  botRound,
} from '@/lib/duel-live-bot'
import { BOTS } from '@/lib/duel/bots'
import { ROUND_SIZE } from '@/lib/defi-modes'
import { liveWinner } from '@/lib/duel-live'

describe('le robot du duel en direct', () => {
  it('rejoint après un délai borné, le même pour la même graine', () => {
    const d = botJoinDelayMs('graine')
    expect(d).toBeGreaterThanOrEqual(BOT_JOIN_MIN_MS)
    expect(d).toBeLessThanOrEqual(BOT_JOIN_MAX_MS)
    expect(botJoinDelayMs('graine')).toBe(d)
  })

  it('joue une manche déterministe, dans les bornes d’une vraie manche', () => {
    const a = botRound('nina', 'g', 0, 3)
    expect(a).not.toBeNull()
    expect(botRound('nina', 'g', 0, 3)).toEqual(a)
    expect(a!.round).toBe(0)
    expect(a!.correct).toBeGreaterThanOrEqual(0)
    expect(a!.correct).toBeLessThanOrEqual(ROUND_SIZE)
    expect(a!.timeMs).toBeGreaterThanOrEqual(ROUND_SIZE * BOT_QUESTION_MIN_MS * 0.7)
    expect(a!.timeMs).toBeLessThanOrEqual(ROUND_SIZE * BOT_QUESTION_MAX_MS * 1.6)
  })

  it('refuse un robot inconnu et assainit l’index de manche', () => {
    expect(botRound('inconnu', 'g', 0)).toBeNull()
    expect(botRound('nina', 'g', -3)!.round).toBe(0)
    expect(botRound('nina', 'g', Number.NaN)!.round).toBe(0)
  })

  it('change de manche en manche et de graine en graine', () => {
    const rounds = [0, 1, 2].map((r) => botRound('sofiane', 'g', r)!)
    expect(new Set(rounds.map((r) => `${r.correct}/${r.timeMs}`)).size).toBeGreaterThan(1)
    expect(botRound('sofiane', 'autre', 0)).not.toEqual(rounds[0])
  })

  it('vise mieux quand il est fort ou quand l’élève monte, sans sortir des bornes', () => {
    expect(botAccuracy(1, 1)).toBeGreaterThan(botAccuracy(-1, 1))
    expect(botAccuracy(0, 12)).toBeGreaterThan(botAccuracy(0, 1))
    expect(botAccuracy(1, 40)).toBeLessThanOrEqual(0.85)
    expect(botAccuracy(-1, 1)).toBeGreaterThanOrEqual(0.4)
    expect(botAccuracy(Number.NaN, Number.NaN)).toBeCloseTo(0.55)
  })

  it('une flèche boucle sa première manche plus vite que sa dernière, un finisseur l’inverse', () => {
    const seeds = Array.from({ length: 40 }, (_, i) => `s${i}`)
    const moyenne = (id: string, round: number) =>
      seeds.reduce((s, seed) => s + botRound(id, seed, round)!.timeMs, 0) / seeds.length
    expect(moyenne('nina', 0)).toBeLessThan(moyenne('nina', 2))
    expect(moyenne('sofiane', 0)).toBeGreaterThan(moyenne('sofiane', 2))
  })

  it('tranche un BO3 par les mêmes fonctions que le vrai duel, avec chaque robot du banc', () => {
    for (const bot of BOTS) {
      const theirs = [0, 1, 2].map((r) => botRound(bot.id, 'bo3', r)!)
      const mine = [0, 1, 2].map((round) => ({ round, correct: 3, timeMs: 12_000 }))
      expect(liveWinner(mine, theirs)).not.toBeNull()
    }
  })
})
