import { describe, expect, it } from 'vitest'
import { barreTrophees, barreXp, partsVague } from './fin-duel'

describe('barreXp', () => {
  it('lit le niveau et la progression dans le pas en cours', () => {
    // Niveau 2 : de 100 à 300 XP.
    expect(barreXp(160)).toEqual({ cran: 2, fait: 60, pas: 200, part: 0.3 })
  })

  it('passe au niveau suivant pile au seuil', () => {
    expect(barreXp(300)).toMatchObject({ cran: 3, fait: 0 })
  })

  it('ne descend jamais sous le niveau 1', () => {
    expect(barreXp(-40)).toMatchObject({ cran: 1, fait: 0, pas: 100 })
  })
})

describe('barreTrophees', () => {
  it('lit la progression dans le palier de cent', () => {
    expect(barreTrophees(86)).toEqual({ cran: 0, fait: 86, pas: 100, part: 0.86 })
  })

  it('change de palier en franchissant la centaine', () => {
    expect(barreTrophees(104)).toMatchObject({ cran: 100, fait: 4 })
  })

  it('continue par centaines dans la dernière bande, ouverte', () => {
    expect(barreTrophees(1234)).toMatchObject({ cran: 1200, fait: 34 })
  })
})

describe('partsVague', () => {
  it('reverse exactement le montant', () => {
    const parts = partsVague(20)
    expect(parts.reduce((a, b) => a + b, 0)).toBe(20)
  })

  it('donne au moins une unité à chaque jeton', () => {
    const parts = partsVague(10)
    expect(parts).toHaveLength(10)
    expect(parts.every((p) => p >= 1)).toBe(true)
  })

  it('ne lance rien pour un gain nul', () => {
    expect(partsVague(0)).toEqual([])
  })
})
