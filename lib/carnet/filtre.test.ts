import { describe, expect, it } from 'vitest'
import type { CoursCarnet } from './priorite'
import {
  FILTRE_VIDE,
  SEUIL_RECHERCHE,
  correspond,
  couleursPresentes,
  estFiltreActif,
  filtrerCours,
  normaliserTexte,
} from './filtre'

function cours(patch: Partial<CoursCarnet> & { id: string; title: string }): CoursCarnet {
  return {
    description: null,
    icon: null,
    color: null,
    subjectId: null,
    questionCount: 5,
    dueCount: 0,
    nouvelles: 0,
    crowns: 0,
    examOn: null,
    objectif: null,
    epingle: false,
    archive: false,
    updatedAt: '2026-09-01T10:00:00.000Z',
    dernierRevuLe: null,
    ...patch,
  }
}

const maths = cours({ id: 'a', title: 'Maths — mon cours de l’année', color: 'violet' })
const histoire = cours({
  id: 'b',
  title: 'Histoire — la Grande Guerre',
  color: 'menthe',
  description: 'Dates, cartes et personnages',
})
const anglais = cours({ id: 'c', title: 'Anglais', color: 'ciel', objectif: 'Brevet blanc, mi-juin' })
const sansCouleur = cours({ id: 'd', title: 'Été 1914', color: 'inconnue' })

describe('normaliserTexte', () => {
  it('retire accents, casse et espaces en trop', () => {
    expect(normaliserTexte('  Été  1914 ')).toBe('ete 1914')
    expect(normaliserTexte('GRANDE   Guerre')).toBe('grande guerre')
  })
})

describe('estFiltreActif', () => {
  it('est inactif pour le filtre vide ou un texte fait d’espaces', () => {
    expect(estFiltreActif(FILTRE_VIDE)).toBe(false)
    expect(estFiltreActif({ texte: '   ', couleur: null })).toBe(false)
  })

  it('est actif dès qu’un texte ou une couleur est posé', () => {
    expect(estFiltreActif({ texte: 'a', couleur: null })).toBe(true)
    expect(estFiltreActif({ texte: '', couleur: 'menthe' })).toBe(true)
  })
})

describe('correspond', () => {
  it('cherche dans le titre sans se soucier des accents ni de la casse', () => {
    expect(correspond(histoire, { texte: 'grande guerre', couleur: null })).toBe(true)
    expect(correspond(sansCouleur, { texte: 'ete', couleur: null })).toBe(true)
    expect(correspond(maths, { texte: 'histoire', couleur: null })).toBe(false)
  })

  it('cherche aussi dans la description et l’objectif', () => {
    expect(correspond(histoire, { texte: 'personnages', couleur: null })).toBe(true)
    expect(correspond(anglais, { texte: 'brevet', couleur: null })).toBe(true)
  })

  it('filtre par couleur, une couleur inconnue valant violet', () => {
    expect(correspond(histoire, { texte: '', couleur: 'menthe' })).toBe(true)
    expect(correspond(histoire, { texte: '', couleur: 'violet' })).toBe(false)
    expect(correspond(sansCouleur, { texte: '', couleur: 'violet' })).toBe(true)
  })

  it('combine texte ET couleur', () => {
    expect(correspond(histoire, { texte: 'guerre', couleur: 'menthe' })).toBe(true)
    expect(correspond(histoire, { texte: 'guerre', couleur: 'ciel' })).toBe(false)
  })
})

describe('filtrerCours', () => {
  const tous = [maths, histoire, anglais, sansCouleur]

  it('rend une copie intacte quand le filtre est vide', () => {
    const r = filtrerCours(tous, FILTRE_VIDE)
    expect(r).toEqual(tous)
    expect(r).not.toBe(tous)
  })

  it('garde l’ordre reçu et ne garde que ce qui correspond', () => {
    expect(filtrerCours(tous, { texte: 'an', couleur: null }).map((c) => c.id)).toEqual(['a', 'b', 'c'])
    expect(filtrerCours(tous, { texte: '', couleur: 'violet' }).map((c) => c.id)).toEqual(['a', 'd'])
  })
})

describe('couleursPresentes', () => {
  it('rend les couleurs portées, dans l’ordre de la palette, sans doublon', () => {
    expect(couleursPresentes([anglais, histoire, maths, sansCouleur])).toEqual(['violet', 'menthe', 'ciel'])
    expect(couleursPresentes([])).toEqual([])
  })
})

describe('SEUIL_RECHERCHE', () => {
  it('reste un petit nombre : la recherche n’a pas sa place devant trois dossiers', () => {
    expect(SEUIL_RECHERCHE).toBeGreaterThanOrEqual(4)
    expect(SEUIL_RECHERCHE).toBeLessThanOrEqual(10)
  })
})
