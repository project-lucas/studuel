import { describe, expect, it } from 'vitest'
import { construireLivre, pagesReussies, sensDuGeste, voisinage, type PageSource } from './livre'

const page = (chapitreId: string, position: number, etat: PageSource['etat'] = 'ouvert'): PageSource => ({
  chapitreId,
  position,
  etoiles: position as 1 | 2 | 3,
  titre: `${chapitreId}-${position}`,
  etat,
})

const chapitres = [
  { id: 'a', titre: 'Chapitre A' },
  { id: 'vide', titre: 'Sans exercice' },
  { id: 'b', titre: 'Chapitre B' },
]
// Données volontairement dans le désordre : le livre les range.
const sources = [page('b', 2), page('a', 3, 'verrouille'), page('a', 1, 'reussi'), page('b', 1), page('a', 2)]

describe('construireLivre', () => {
  const livre = construireLivre('Le thème', 'maths', chapitres, sources)

  it('numérote les pages dans l’ordre des chapitres puis des positions', () => {
    expect(livre.pages.map((p) => `${p.chapitreId}${p.position}:${p.numero}`)).toEqual(['a1:1', 'a2:2', 'a3:3', 'b1:4', 'b2:5'])
  })

  it('saute un chapitre sans exercice', () => {
    expect(livre.sections.map((s) => s.id)).toEqual(['a', 'b'])
  })

  it('donne à chaque section ses bornes et ses pages', () => {
    expect(livre.sections.map((s) => [s.debut, s.fin, s.pages.length])).toEqual([
      [1, 3, 3],
      [4, 5, 2],
    ])
  })

  it('construit l’adresse de chaque page', () => {
    expect(livre.pages[3].href).toBe('/reviser/maths/b/exercice/1')
  })

  it('compte les pages réussies', () => {
    expect(pagesReussies(livre)).toBe(1)
  })
})

describe('voisinage', () => {
  const livre = construireLivre('Le thème', 'maths', chapitres, sources)

  it('passe d’un chapitre à l’autre sans repasser par un sommaire', () => {
    const v = voisinage(livre, 'a', 3)!
    expect(v.suivante?.href).toBe('/reviser/maths/b/exercice/1')
    expect(v.precedente?.position).toBe(2)
    expect(v.section.id).toBe('a')
  })

  it('n’a ni page précédente au début ni page suivante à la fin', () => {
    expect(voisinage(livre, 'a', 1)!.precedente).toBeNull()
    expect(voisinage(livre, 'b', 2)!.suivante).toBeNull()
  })

  it('mesure l’avancée dans le livre', () => {
    expect(voisinage(livre, 'b', 1)!.avancee).toBeCloseTo(4 / 5)
  })

  it('rend null pour une page absente du livre', () => {
    expect(voisinage(livre, 'vide', 1)).toBeNull()
  })
})

describe('sensDuGeste', () => {
  it('tourne la page vers la suivante quand le doigt part à gauche', () => {
    expect(sensDuGeste(-120, 10)).toBe('suivante')
  })

  it('revient en arrière quand le doigt part à droite', () => {
    expect(sensDuGeste(120, -5)).toBe('precedente')
  })

  it('ignore un geste trop court ou un défilement vertical', () => {
    expect(sensDuGeste(-40, 0)).toBeNull()
    expect(sensDuGeste(-100, 80)).toBeNull()
  })
})
