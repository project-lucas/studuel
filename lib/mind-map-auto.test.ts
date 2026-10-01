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

// Le cas de TOUTES les fiches du programme : un chapitre = une leçon. La carte
// ne peut plus être « une branche par leçon » (elle n'en aurait qu'une) : elle
// suit les sections du cours.
describe('mindMapFromLessons — une seule leçon', () => {
  const guerre = `La Grande Guerre dure quatre ans.

## Les deux camps
La **Triple-Entente** (France, Royaume-Uni, Russie) affronte la **Triple-Alliance**.

## Trois phases
| La phase | Ses dates |
| Guerre de mouvement | 1914 |
| Guerre de position | 1915-1917 |
| Retour du mouvement | 1918 |

## Les grandes dates
@ 1916 — Bataille de Verdun
@ 11 novembre 1918 — Armistice

## Un bilan écrasant
- dix millions de morts
- des empires disparus`

  test('une branche par section, ses mots-clés en rameaux', () => {
    const carte = mindMapFromLessons('La Première Guerre mondiale', [
      { title: '1914-1918 : quatre ans de guerre', content: guerre },
    ])
    expect(carte?.centre).toBe('La Première Guerre mondiale')
    expect(carte?.branches).toEqual([
      { titre: 'Les deux camps', enfants: ['Triple-Entente', 'Triple-Alliance'] },
      {
        titre: 'Trois phases',
        enfants: ['Guerre de mouvement', 'Guerre de position', 'Retour du mouvement'],
      },
      {
        titre: 'Les grandes dates',
        enfants: ['1916 · Bataille de Verdun', '11 novembre 1918 · Armistice'],
      },
      {
        titre: 'Un bilan écrasant',
        enfants: ['dix millions de morts', 'des empires disparus'],
      },
    ])
  })

  test('les termes en gras passent avant les tableaux et les puces', () => {
    const carte = mindMapFromLessons('Chapitre', [
      {
        title: 'Leçon',
        content:
          '## Une section\nLe **courant** et la **tension**.\n- une puce\n\n## Une autre\nTexte.',
      },
    ])
    expect(carte?.branches[0]).toEqual({
      titre: 'Une section',
      enfants: ['courant', 'tension'],
    })
  })

  test('le cœur porte le titre entier du chapitre, sans le couper', () => {
    const titre = 'La Première Guerre mondiale : vers une guerre totale, des sociétés   bouleversées'
    const carte = mindMapFromLessons(titre, [
      { title: 'Leçon', content: '## Les camps\n**Entente**\n\n## Les phases\n**Verdun**' },
    ])
    expect(carte?.centre).toBe(
      'La Première Guerre mondiale : vers une guerre totale, des sociétés bouleversées',
    )
  })

  test('une section sans mot-clé garde sa branche, sans rameau', () => {
    const carte = mindMapFromLessons('Chapitre', [
      { title: 'Leçon', content: '## Première\nDu texte.\n\n## Seconde\nLe **mot**.' },
    ])
    expect(carte?.branches).toEqual([
      { titre: 'Première', enfants: [] },
      { titre: 'Seconde', enfants: ['mot'] },
    ])
  })

  test('plafonne à 8 branches et 5 rameaux, et écarte d’abord les « Exemple »', () => {
    const sections = [
      ...Array.from({ length: 8 }, (_, i) => `## Idée ${i + 1}\n${'**alpha** **bêta** **gamma** **delta** **epsilon** **zêta**'}`),
      '## Exemple travaillé\nUn **calcul**.',
    ].join('\n\n')
    const carte = mindMapFromLessons('Chapitre', [{ title: 'Leçon', content: sections }])
    expect(carte?.branches).toHaveLength(8)
    expect(carte?.branches.map((b) => b.titre)).not.toContain('Exemple travaillé')
    expect(carte?.branches[0].enfants).toEqual(['alpha', 'bêta', 'gamma', 'delta', 'epsilon'])
  })

  test('« Oui », « Non », « deux » : en gras dans un tableau, ils ne sont pas des mots-clés', () => {
    const carte = mindMapFromLessons('La ponctuation', [
      {
        title: 'Leçon',
        content:
          '## Virgule ou pas\n| Devant une **subordonnée** | **Oui** |\n| Entre **deux** principales | **Non** |\n| Autour d’une **enchâssée** | **Oui** |\n\n## Le reste\nTexte.',
      },
    ])
    expect(carte?.branches[0].enfants).toEqual(['subordonnée', 'enchâssée'])
  })

  test('une seule section : la carte reste celle de la leçon', () => {
    const carte = mindMapFromLessons('Chapitre', [
      { title: 'Leçon', content: '## Une idée\nLe **mot**.' },
    ])
    expect(carte?.branches).toEqual([{ titre: 'Leçon', enfants: ['Une idée'] }])
  })

  test('un terme en gras trop long ne devient pas un rameau', () => {
    const long = `**${'mot '.repeat(20).trim()}**`
    const carte = mindMapFromLessons('Chapitre', [
      { title: 'Leçon', content: `## A\n${long} et **bref**.\n\n## B\n**x1**` },
    ])
    expect(carte?.branches[0].enfants).toEqual(['bref'])
  })
})
