import { describe, expect, test } from 'vitest'
import { branchChildren, mindMapFromLessons } from './mind-map-auto'

const cours = `Un objet technique répond à un besoin.

## La fonction d'usage
À quoi ça sert.

## La fonction d'estime
Pourquoi on le choisit.

## Les contraintes
Sécurité, coût, environnement.`

describe('branchChildren', () => {
  test('prend les titres de section quand il y en a', () => {
    expect(branchChildren(cours)).toEqual([
      "La fonction d'usage",
      "La fonction d'estime",
      'Les contraintes',
    ])
  })

  test('retombe sur les termes en gras si aucun titre', () => {
    const sansTitre = 'Les **métaux** conduisent, les **plastiques** isolent.'
    expect(branchChildren(sansTitre)).toEqual(['métaux', 'plastiques'])
  })

  test('retombe sur les puces si ni titre ni gras', () => {
    const puces = 'Retenir :\n- fusion\n- solidification\n- vaporisation'
    expect(branchChildren(puces)).toEqual([
      'fusion',
      'solidification',
      'vaporisation',
    ])
  })

  test('déduplique, ignore le vide et plafonne à 5 rameaux', () => {
    const repete = Array.from({ length: 9 }, (_, i) => `## Idée ${i % 3}`).join('\n')
    expect(branchChildren(repete)).toEqual(['Idée 0', 'Idée 1', 'Idée 2'])
  })

  test('coupe sur un mot les rameaux trop longs', () => {
    const long = `## ${'mot '.repeat(30)}`
    const [enfant] = branchChildren(long)
    expect(enfant.length).toBeLessThanOrEqual(49)
    expect(enfant.endsWith('…')).toBe(true)
  })

  test('sans contenu, aucun rameau', () => {
    expect(branchChildren(null)).toEqual([])
    expect(branchChildren('')).toEqual([])
  })
})

describe('mindMapFromLessons', () => {
  test('le chapitre au centre, une branche par leçon', () => {
    const carte = mindMapFromLessons('Objets techniques', [
      { title: 'À quoi sert un objet technique ?', content: cours },
      { title: 'Choisir le bon matériau', content: '- métal\n- plastique' },
    ])
    expect(carte?.centre).toBe('Objets techniques')
    expect(carte?.branches).toHaveLength(2)
    expect(carte?.branches[1]).toEqual({
      titre: 'Choisir le bon matériau',
      enfants: ['métal', 'plastique'],
    })
  })

  test('écarte les leçons dont on ne tire aucun rameau', () => {
    const carte = mindMapFromLessons('Chapitre', [
      { title: 'Vide', content: null },
      { title: 'Pleine', content: '## Une idée' },
    ])
    expect(carte?.branches).toEqual([{ titre: 'Pleine', enfants: ['Une idée'] }])
  })

  test('null quand rien n’est dérivable (la page reste honnête)', () => {
    expect(mindMapFromLessons('Chapitre', [])).toBeNull()
    expect(
      mindMapFromLessons('Chapitre', [{ title: 'Vide', content: 'Deux mots.' }]),
    ).toBeNull()
  })

  test('nettoie le markdown des titres', () => {
    const carte = mindMapFromLessons('**Les fractions**', [
      { title: '`Addition`', content: '## Même dénominateur' },
    ])
    expect(carte?.centre).toBe('Les fractions')
    expect(carte?.branches[0].titre).toBe('Addition')
  })
})
