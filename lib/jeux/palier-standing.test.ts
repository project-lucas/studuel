import { describe, expect, it } from 'vitest'
import { COHORT_MIN } from '@/lib/percentile'
import {
  hasAnyStanding,
  parsePalierStandings,
  speedLabel,
  speedLabelFor,
  speedStanding,
} from './palier-standing'

const place = (rank: number, total: number) => ({
  level: 3 as const,
  bestMs: 84_000,
  rank,
  total,
})

describe('speedStanding', () => {
  it('ne dit rien sans place', () => {
    expect(speedStanding(null).kind).toBe('aucun')
    expect(speedStanding(undefined).kind).toBe('aucun')
  })

  it('parle en POURCENTAGE dès que la cohorte est assez grande', () => {
    const s = speedStanding(place(4, 1000))
    expect(s.kind).toBe('pourcentage')
    if (s.kind !== 'pourcentage') return
    expect(s.side).toBe('top')
  })

  it('retombe sur le RANG BRUT quand ils sont trop peu', () => {
    const s = speedStanding(place(3, COHORT_MIN - 1))
    expect(s).toEqual({ kind: 'rang', rank: 3, total: COHORT_MIN - 1 })
  })
})

describe('speedLabel', () => {
  it('annonce le haut du classement en « top »', () => {
    // 4e sur 1000 = 0,4 % → remonté à la première bande, 1 %.
    expect(speedLabelFor(place(4, 1000))).toBe('Top 1 % des joueurs')
  })

  it('arrondit CONTRE le joueur — jamais de flatterie', () => {
    // 23 sur 1000 = 2,3 % : on annonce 5 %, pas 2 %.
    expect(speedLabelFor(place(23, 1000))).toBe('Top 5 % des joueurs')
  })

  it('retourne la formulation sous la médiane, sans gifler personne', () => {
    // 700e sur 1000 : on dit ce qui est fait, pas ce qui manque.
    expect(speedLabelFor(place(700, 1000))).toBe(
      'Plus rapide que 30 % des joueurs',
    )
  })

  it('dit le rang quand la cohorte est trop petite pour un pourcentage', () => {
    expect(speedLabelFor(place(1, 12))).toBe('1er sur 12 joueurs')
    expect(speedLabelFor(place(3, 12))).toBe('3e sur 12 joueurs')
  })

  it('ne rend rien quand il n’y a rien d’honnête à dire', () => {
    expect(speedLabel({ kind: 'aucun' })).toBeNull()
    expect(speedLabelFor(null)).toBeNull()
  })
})

describe('parsePalierStandings', () => {
  it('lit ce que rend la RPC', () => {
    const standings = parsePalierStandings([
      { palier: 1, best_ms: 42_000, rank: 3, total: 200 },
      { palier: 4, best_ms: 91_500, rank: 12, total: 200 },
    ])
    expect(standings[1]).toEqual({ level: 1, bestMs: 42_000, rank: 3, total: 200 })
    expect(standings[4]?.bestMs).toBe(91_500)
    expect(standings[2]).toBeUndefined()
    expect(hasAnyStanding(standings)).toBe(true)
  })

  it('rend un classement VIDE plutôt que de jeter (migration absente, visiteur)', () => {
    expect(parsePalierStandings(null)).toEqual({})
    expect(parsePalierStandings(undefined)).toEqual({})
    expect(parsePalierStandings({ palier: 1 })).toEqual({})
    expect(hasAnyStanding(parsePalierStandings([]))).toBe(false)
  })

  it('jette les lignes qui ne veulent rien dire au lieu de les afficher', () => {
    const standings = parsePalierStandings([
      { palier: 9, best_ms: 1000, rank: 1, total: 1 },
      { palier: 2, best_ms: 0, rank: 1, total: 1 },
      { palier: 3, best_ms: 5000, rank: null, total: 4 },
      null,
      'du texte',
    ])
    expect(standings).toEqual({})
  })
})
