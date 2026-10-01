import { describe, expect, test } from 'vitest'
import { avecChoix, cleDossier, parserFavoris } from './favoris'

describe('parserFavoris', () => {
  test('relit les choix, dossier par dossier', () => {
    const brut = JSON.stringify({ 'maths|3e': { Fonctions: true, Géométrie: false } })
    expect(parserFavoris(brut)).toEqual({ 'maths|3e': { Fonctions: true, Géométrie: false } })
  })

  test('survit à un stockage vide, tronqué ou trafiqué', () => {
    expect(parserFavoris(null)).toEqual({})
    expect(parserFavoris('{"maths|3e":')).toEqual({})
    expect(parserFavoris('["maths"]')).toEqual({})
    expect(parserFavoris('"oui"')).toEqual({})
  })

  test('écarte ce qui n’est pas un choix', () => {
    const brut = JSON.stringify({
      'maths|3e': { Fonctions: true, Truc: 'oui', Autre: 1 },
      'svt|3e': 'tout',
    })
    expect(parserFavoris(brut)).toEqual({ 'maths|3e': { Fonctions: true } })
  })
})

describe('avecChoix', () => {
  test('remplace les choix d’un dossier sans toucher aux autres ni à l’original', () => {
    const stock = { 'maths|3e': { Fonctions: true }, 'svt|3e': { Climat: true } }
    const suite = avecChoix(stock, 'maths|3e', { Fonctions: false })
    expect(suite).toEqual({ 'maths|3e': { Fonctions: false }, 'svt|3e': { Climat: true } })
    expect(stock['maths|3e']).toEqual({ Fonctions: true })
  })
})

describe('cleDossier', () => {
  test('la matière et la classe', () => {
    expect(cleDossier('maths', '3e')).toBe('maths|3e')
  })
})
