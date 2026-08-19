import { describe, expect, it } from 'vitest'
import {
  BOT_NAME,
  calibratedBot,
  MATCH_RANGE,
  MATCH_WIDENING,
  opponentCaption,
  pickOpponent,
  withinRange,
  type MatchCandidate,
} from './matchmaking'

function candidate(
  userId: string,
  trophies: number,
  score = 8,
): MatchCandidate {
  return { userId, name: userId, trophies, score }
}

describe('fourchette', () => {
  it('retient les candidats à ±150 trophées, bornes comprises', () => {
    const pool = [
      candidate('a', 500),
      candidate('b', 650), // exactement +150
      candidate('c', 651), // juste au-delà
      candidate('d', 350), // exactement −150
      candidate('e', 349),
    ]
    expect(withinRange(pool, 500, MATCH_RANGE).map((c) => c.userId)).toEqual([
      'a',
      'b',
      'd',
    ])
  })

  it('ouvre tout quand la fourchette est nulle', () => {
    const pool = [candidate('a', 0), candidate('b', 5000)]
    expect(withinRange(pool, 500, null)).toHaveLength(2)
  })

  it('élargit par paliers, et le dernier est l’appariement ouvert', () => {
    expect(MATCH_WIDENING[0]).toBe(MATCH_RANGE)
    expect(MATCH_WIDENING[MATCH_WIDENING.length - 1]).toBeNull()
  })
})

describe('choix de l’adversaire', () => {
  it('prend le plus proche en trophées, pas le meilleur score', () => {
    const pool = [
      candidate('loin', 620, 20),
      candidate('proche', 510, 3),
    ]
    const opp = pickOpponent(pool, 500)
    // C'est l'écart de NIVEAU qui fait un bon duel, pas la performance brute.
    expect(opp!.userId).toBe('proche')
    expect(opp!.range).toBe(MATCH_RANGE)
    expect(opp!.isBot).toBe(false)
  })

  it('ne s’élargit pas quand la fourchette serrée suffit', () => {
    const pool = [candidate('a', 500), candidate('b', 2000)]
    expect(pickOpponent(pool, 520)!.range).toBe(MATCH_RANGE)
  })

  it('élargit quand personne n’est à portée', () => {
    const pool = [candidate('loin', 900)]
    const opp = pickOpponent(pool, 500)
    // 400 d'écart : ni 150 ni 300 ne l'attrapent, 600 oui.
    expect(opp!.userId).toBe('loin')
    expect(opp!.range).toBe(600)
  })

  it('finit par apparier hors fourchette plutôt que de refuser la partie', () => {
    const pool = [candidate('tres-loin', 5000)]
    const opp = pickOpponent(pool, 100)
    expect(opp!.userId).toBe('tres-loin')
    expect(opp!.range).toBeNull()
    expect(opp!.isBot).toBe(false)
  })

  it('rend null sans candidat et sans repli — l’appelant décide', () => {
    expect(pickOpponent([], 500)).toBeNull()
  })

  it('fabrique un adversaire calibré en dernier recours, et le DIT', () => {
    const opp = pickOpponent([], 500, calibratedBot(10))!
    expect(opp.isBot).toBe(true)
    expect(opp.name).toBe(BOT_NAME)
    expect(opp.trophies).toBe(500)
    expect(opp.score).toBe(6) // 60 % de 10 questions
  })

  it('ne sert le repli QUE si aucun élève réel n’est disponible', () => {
    const opp = pickOpponent([candidate('reel', 4000)], 100, calibratedBot(10))!
    expect(opp.isBot).toBe(false)
    expect(opp.userId).toBe('reel')
  })

  it('départage deux candidats à écart égal de façon stable', () => {
    const pool = [candidate('zoe', 450), candidate('adam', 550)]
    expect(pickOpponent(pool, 500)!.userId).toBe('adam')
    expect(pickOpponent([...pool].reverse(), 500)!.userId).toBe('adam')
  })
})

describe('adversaire de repli', () => {
  it('vise un score battable, jamais nul', () => {
    expect(calibratedBot(10)(0).score).toBe(6)
    expect(calibratedBot(1)(0).score).toBe(1)
    expect(calibratedBot(0)(0).score).toBe(1)
  })

  it('se cale sur le compteur de l’élève', () => {
    expect(calibratedBot(10)(1200).trophies).toBe(1200)
    expect(calibratedBot(10)(-5).trophies).toBe(0)
  })
})

describe('phrase affichée', () => {
  it('nomme honnêtement ce qu’on a trouvé', () => {
    const base = candidate('a', 500)
    expect(opponentCaption({ ...base, range: 150, isBot: false })).toContain('portée')
    expect(opponentCaption({ ...base, range: 600, isBot: false })).toContain('élargie')
    expect(opponentCaption({ ...base, range: null, isBot: false })).toContain(
      'hors fourchette',
    )
    expect(opponentCaption({ ...base, range: null, isBot: true })).toContain(
      'entraînement',
    )
  })
})
