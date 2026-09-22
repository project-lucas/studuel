import { describe, expect, it } from 'vitest'
import {
  cleEtatCompte,
  libelleTop,
  lireEtatCompte,
  mouvementCompte,
  topPourcent,
} from './classement-arene'

describe('topPourcent', () => {
  it('arrondit CONTRE l’élève, au pas de 5', () => {
    expect(topPourcent(21, 23)).toBe(95) // 91,3 % → 95
    expect(topPourcent(1, 23)).toBe(5) // 4,3 % → 5
    expect(topPourcent(12, 23)).toBe(55) // 52,2 % → 55
    expect(topPourcent(23, 23)).toBe(100)
  })

  it('ne descend jamais sous 5 ni au-dessus de 100', () => {
    expect(topPourcent(1, 10_000)).toBe(5)
    expect(topPourcent(10_000, 10_000)).toBe(100)
  })

  it('ne dit rien sans rang, seul, ou hors cohorte', () => {
    expect(topPourcent(null, 23)).toBeNull()
    expect(topPourcent(undefined, 23)).toBeNull()
    expect(topPourcent(1, 1)).toBeNull()
    expect(topPourcent(0, 23)).toBeNull()
    expect(topPourcent(24, 23)).toBeNull()
    expect(topPourcent(Number.NaN, 23)).toBeNull()
  })

  it('s’écrit « Top 90 % »', () => {
    expect(libelleTop(90)).toBe('Top 90 %')
  })
})

describe('mouvementCompte', () => {
  it('ne fête rien à la première visite ni quand rien n’a bougé', () => {
    expect(mouvementCompte(null, { trophees: 30, top: 90 })).toBeNull()
    expect(mouvementCompte({ trophees: 30, top: 90 }, { trophees: 30, top: 90 })).toBeNull()
  })

  it('dit le compte qui défile et la bande qui change', () => {
    expect(
      mouvementCompte({ trophees: 30, top: 90 }, { trophees: 38, top: 85 }),
    ).toEqual({ trophees: { de: 30, a: 38 }, top: { de: 90, a: 85 } })
  })

  it('anime seulement ce qui a bougé', () => {
    expect(
      mouvementCompte({ trophees: 30, top: 90 }, { trophees: 28, top: 90 }),
    ).toEqual({ trophees: { de: 30, a: 28 }, top: null })
    expect(
      mouvementCompte({ trophees: 30, top: null }, { trophees: 30, top: 90 }),
    ).toEqual({ trophees: null, top: { de: null, a: 90 } })
  })
})

describe('la mémoire du compte', () => {
  it('a une clé par élève', () => {
    expect(cleEtatCompte('abc')).toBe('studuel:arene:trophees:abc')
  })

  it('relit un état, et rend null pour ce qui est absent ou abîmé', () => {
    expect(lireEtatCompte(JSON.stringify({ trophees: 30, top: 90 }))).toEqual({
      trophees: 30,
      top: 90,
    })
    expect(lireEtatCompte(JSON.stringify({ trophees: 30, top: null }))).toEqual({
      trophees: 30,
      top: null,
    })
    expect(lireEtatCompte(null)).toBeNull()
    expect(lireEtatCompte('')).toBeNull()
    expect(lireEtatCompte('{pas du json')).toBeNull()
    expect(lireEtatCompte(JSON.stringify({ top: 90 }))).toBeNull()
    expect(lireEtatCompte(JSON.stringify({ trophees: 'trente' }))).toBeNull()
  })
})
