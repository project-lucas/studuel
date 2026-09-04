import { describe, expect, it } from 'vitest'
import {
  botOpponent,
  opponentCaption,
  opponentTemperament,
  opponentTimeline,
  type ReplayOpponent,
} from '@/lib/duel/opponent'
import { BOTS } from '@/lib/duel/bots'
import { DEFAULT_AVATAR } from '@/lib/avatar'
import { goldenIndex } from '@/lib/duel/course'
import { timelineFromSteps } from '@/lib/duel/rival'

const replay: ReplayOpponent = {
  kind: 'replay',
  replayId: 'r1',
  steps: [
    { at: 3000, good: true, ms: 3000 },
    { at: 6000, good: true, ms: 2500 },
    { at: 9000, good: false, ms: 2500 },
  ],
  range: 150,
  identity: { name: 'Léa', avatar: DEFAULT_AVATAR, trophies: 320, isBot: false, tagline: '' },
}

describe('l’adversaire robot', () => {
  it('porte l’identité du banc et se règle sur MES trophées', () => {
    const o = botOpponent(BOTS[0].id, 412)
    expect(o).not.toBeNull()
    expect(o?.identity.isBot).toBe(true)
    expect(o?.identity.name).toBe(BOTS[0].name)
    expect(o?.trophiesRef).toBe(412)
    expect(opponentTemperament(o!)).toBe(BOTS[0].temperament)
    expect(botOpponent('nobody', 10)).toBeNull()
  })

  it('sa ligne de temps se refabrique à l’identique de la graine', () => {
    const o = botOpponent(BOTS[3].id, 120)!
    const a = opponentTimeline(o, 'duel-1')
    const b = opponentTimeline(o, 'duel-1')
    const c = opponentTimeline(o, 'duel-2')
    expect(a).toEqual(b)
    expect(a).not.toEqual(c)
    expect(a?.events.length ?? 0).toBeGreaterThan(3)
  })

  it('un robot inconnu ne donne JAMAIS un rival inventé', () => {
    const o = { ...botOpponent(BOTS[0].id, 0)!, botId: 'fantome' }
    expect(opponentTimeline(o, 'x')).toBeNull()
  })
})

describe('l’adversaire replay', () => {
  it('rejoue les pas avec la dorée du duel', () => {
    const tl = opponentTimeline(replay, 'seed-r')
    expect(tl).toEqual(timelineFromSteps(replay.steps, goldenIndex('seed-r')))
    expect(opponentTemperament(replay)).toBeNull()
  })

  it('la légende dit honnêtement ce qu’on a trouvé', () => {
    expect(opponentCaption(replay)).toBe('320 trophées · à ta portée')
    expect(opponentCaption({ ...replay, range: 600 })).toBe('320 trophées · fourchette élargie')
    expect(opponentCaption({ ...replay, range: null })).toBe('320 trophées · appariement ouvert')
    expect(opponentCaption(botOpponent(BOTS[1].id, 0)!)).toContain('robot')
  })
})
