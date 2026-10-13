import { describe, expect, it } from 'vitest'
import { blasonDeLigue, libellePlace, lireMaPlaceLigue } from './ligue-place'

describe('blasonDeLigue', () => {
  it('dessine la division sur le bouclier de son rang', () => {
    expect(blasonDeLigue(0)).toMatchObject({ roman: '4', label: 'Bronze 4' })
    expect(blasonDeLigue(0).tier.id).toBe('bronze')
    expect(blasonDeLigue(3)).toMatchObject({ roman: '1', label: 'Bronze 1' })
    expect(blasonDeLigue(4).tier.id).toBe('argent')
  })
  it('n’a pas de division au sommet', () => {
    expect(blasonDeLigue(20)).toMatchObject({ roman: null, label: 'Maître' })
  })
  it('borne un échelon hors échelle', () => {
    expect(blasonDeLigue(-3).label).toBe('Bronze 4')
    expect(blasonDeLigue(99).label).toBe('Maître')
  })
})

describe('lireMaPlaceLigue', () => {
  it('relit une place dans un groupe', () => {
    expect(lireMaPlaceLigue({ echelon: 3, inscrit: true, rang: 9, taille: 30 })).toEqual({
      echelon: 3,
      inscrit: true,
      rang: 9,
      taille: 30,
    })
  })
  it('garde l’échelon mais pas de place hors groupe', () => {
    expect(lireMaPlaceLigue({ echelon: '5', inscrit: false, rang: null, taille: null })).toEqual({
      echelon: 5,
      inscrit: false,
      rang: null,
      taille: null,
    })
  })
  it('refuse une réponse sans forme', () => {
    expect(lireMaPlaceLigue(null)).toBeNull()
    expect(lireMaPlaceLigue([])).toBeNull()
    expect(lireMaPlaceLigue('x')).toBeNull()
  })
  it('ne croit pas « inscrit » sans rang', () => {
    expect(lireMaPlaceLigue({ echelon: 2, inscrit: true, rang: null, taille: 30 })?.inscrit).toBe(false)
  })
})

describe('libellePlace', () => {
  it('écrit la place', () => {
    expect(libellePlace({ echelon: 3, inscrit: true, rang: 1, taille: 30 })).toBe('1er sur 30')
    expect(libellePlace({ echelon: 3, inscrit: true, rang: 9, taille: 30 })).toBe('9e sur 30')
    expect(libellePlace({ echelon: 3, inscrit: false, rang: null, taille: null })).toBeNull()
  })
})
