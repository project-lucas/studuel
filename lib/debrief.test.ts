import { describe, expect, it } from 'vitest'
import {
  DEBRIEF_CATALOG,
  debriefIcon,
  debriefMessage,
  debriefScore,
  isDebriefOutcome,
  isDebriefPairId,
} from './debrief'

describe('DEBRIEF_CATALOG', () => {
  it('a des identifiants uniques', () => {
    const ids = DEBRIEF_CATALOG.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('a un frein, une habitude saine et un bénéfice sur chaque paire', () => {
    for (const p of DEBRIEF_CATALOG) {
      expect(p.bad.length).toBeGreaterThan(0)
      expect(p.good.length).toBeGreaterThan(0)
      expect(p.benefit.length).toBeGreaterThan(0)
      expect(p.badEmoji.length).toBeGreaterThan(0)
      expect(p.goodEmoji.length).toBeGreaterThan(0)
    }
  })
})

describe('debriefIcon', () => {
  it("reste indéfinie tant que l'image n'est pas déposée", () => {
    expect(debriefIcon('hydratation', 'bad')).toBeUndefined()
    expect(debriefIcon('inconnue', 'good')).toBeUndefined()
  })
})

describe('isDebriefOutcome / isDebriefPairId', () => {
  it('ne reconnaît que bad et good', () => {
    expect(isDebriefOutcome('bad')).toBe(true)
    expect(isDebriefOutcome('good')).toBe(true)
    expect(isDebriefOutcome('meh')).toBe(false)
    expect(isDebriefOutcome(null)).toBe(false)
  })

  it('valide un id du catalogue et rejette le reste', () => {
    expect(isDebriefPairId('hydratation')).toBe(true)
    expect(isDebriefPairId('inconnue')).toBe(false)
  })
})

describe('debriefScore', () => {
  it('compte victoires, rechutes et sans réponse', () => {
    const score = debriefScore(['a', 'b', 'c', 'd'], {
      a: 'good',
      b: 'bad',
      c: 'good',
    })
    expect(score).toEqual({ wins: 2, slips: 1, pending: 1, total: 4 })
  })

  it('ignore les issues hors sélection', () => {
    const score = debriefScore(['a'], { a: 'good', z: 'bad' })
    expect(score).toEqual({ wins: 1, slips: 0, pending: 0, total: 1 })
  })

  it('sélection vide → tout à zéro', () => {
    expect(debriefScore([], {})).toEqual({
      wins: 0,
      slips: 0,
      pending: 0,
      total: 0,
    })
  })
})

describe('debriefMessage', () => {
  it('reste vide sans habitude référencée', () => {
    expect(debriefMessage(0, 0)).toBe('')
  })

  it('célèbre la journée parfaite', () => {
    expect(debriefMessage(3, 3)).toContain('parfaite')
  })

  it('encourage à partir de la moitié', () => {
    expect(debriefMessage(2, 4)).toContain('Belle journée')
  })

  it('valorise la moindre victoire', () => {
    expect(debriefMessage(1, 4)).toContain('victoire')
  })

  it('relance sans culpabiliser à zéro victoire', () => {
    expect(debriefMessage(0, 4)).toContain('Demain')
  })
})
