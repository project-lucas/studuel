import { describe, it, expect } from 'vitest'
import {
  cartesPourMatiere,
  matiereDuMoment,
  normaliseCle,
} from './matiere-du-moment'
import type { CouvertureMatiere } from '@/lib/coach/couverture'

// Fabrique minimale : seuls les champs que la sélection lit sont significatifs.
function matiere(over: Partial<CouvertureMatiere>): CouvertureMatiere {
  return {
    slug: 'maths',
    name: 'Mathématiques',
    regime: null,
    priorite: 'attention',
    constat: '',
    reste: null,
    consigne: null,
    chapitres: [],
    pct: 60,
    commences: 4,
    total: 10,
    solides: 2,
    enRoute: 2,
    jamais: 6,
    ...over,
  }
}

describe('normaliseCle', () => {
  it('gomme accents, casse et ponctuation', () => {
    expect(normaliseCle('Mathématiques')).toBe('mathematiques')
    expect(normaliseCle('arts-plastiques')).toBe('artsplastiques')
    expect(normaliseCle('SVT')).toBe('svt')
  })
})

describe('cartesPourMatiere', () => {
  it('retrouve la file quand elle est indexée par le NOM', () => {
    const n = cartesPourMatiere(
      { slug: 'maths', name: 'Mathématiques' },
      new Map([['Mathématiques', 12]]),
    )
    expect(n).toBe(12)
  })

  it('retrouve la file quand elle est indexée par le SLUG', () => {
    const n = cartesPourMatiere(
      { slug: 'maths', name: 'Mathématiques' },
      new Map([['maths', 5]]),
    )
    expect(n).toBe(5)
  })

  it('additionne les deux libellés sans doublonner les autres matières', () => {
    const n = cartesPourMatiere(
      { slug: 'maths', name: 'Mathématiques' },
      new Map([
        ['maths', 5],
        ['MATHEMATIQUES', 3],
        ['anglais', 9],
      ]),
    )
    expect(n).toBe(8)
  })

  it('rend zéro quand la matière n’a rien dans la file', () => {
    expect(
      cartesPourMatiere({ slug: 'maths', name: 'Mathématiques' }, new Map()),
    ).toBe(0)
  })
})

describe('matiereDuMoment', () => {
  it('renvoie null quand rien n’a été commencé', () => {
    expect(
      matiereDuMoment([
        matiere({ commences: 0, priorite: 'rien', enRoute: 0, solides: 0 }),
      ]),
    ).toBeNull()
  })

  it('renvoie null sur une liste vide', () => {
    expect(matiereDuMoment([])).toBeNull()
  })

  it('choisit l’urgente avant celle qui demande de l’attention', () => {
    const choix = matiereDuMoment([
      matiere({ slug: 'anglais', name: 'Anglais', priorite: 'attention', pct: 70 }),
      matiere({ slug: 'maths', name: 'Maths', priorite: 'urgente', pct: 30 }),
    ])
    expect(choix?.slug).toBe('maths')
    expect(choix?.ton).toBe('urgence')
  })

  it('départage deux urgentes par le pourcentage le plus bas', () => {
    const choix = matiereDuMoment([
      matiere({ slug: 'a', name: 'A', priorite: 'urgente', pct: 40 }),
      matiere({ slug: 'b', name: 'B', priorite: 'urgente', pct: 20 }),
    ])
    expect(choix?.slug).toBe('b')
  })

  it('départage à égalité par la file « À revoir »', () => {
    const choix = matiereDuMoment(
      [
        matiere({ slug: 'a', name: 'A', priorite: 'urgente', pct: 30 }),
        matiere({ slug: 'b', name: 'B', priorite: 'urgente', pct: 30 }),
      ],
      new Map([['b', 7]]),
    )
    expect(choix?.slug).toBe('b')
    expect(choix?.cartes).toBe(7)
  })

  it('reste stable d’un chargement à l’autre à égalité parfaite', () => {
    const liste = [
      matiere({ slug: 'b', name: 'Physique', priorite: 'urgente', pct: 30 }),
      matiere({ slug: 'a', name: 'Anglais', priorite: 'urgente', pct: 30 }),
    ]
    expect(matiereDuMoment(liste)?.slug).toBe('a')
    expect(matiereDuMoment([...liste].reverse())?.slug).toBe('a')
  })

  it('passe en entretien quand tout est solide', () => {
    const choix = matiereDuMoment([
      matiere({
        slug: 'maths',
        name: 'Maths',
        priorite: 'ok',
        pct: 92,
        enRoute: 0,
        solides: 4,
      }),
    ])
    expect(choix?.ton).toBe('entretien')
    expect(choix?.raison).toBe('4 chapitres solides — garde-les au chaud')
  })

  it('énonce la raison en faits, chapitres puis cartes', () => {
    const choix = matiereDuMoment(
      [
        matiere({
          slug: 'maths',
          name: 'Mathématiques',
          priorite: 'urgente',
          enRoute: 3,
        }),
      ],
      new Map([['Mathématiques', 12]]),
    )
    expect(choix?.raison).toBe('3 chapitres à consolider · 12 cartes à revoir')
  })

  it('accorde le singulier', () => {
    const choix = matiereDuMoment(
      [matiere({ priorite: 'urgente', enRoute: 1 })],
      new Map([['maths', 1]]),
    )
    expect(choix?.raison).toBe('1 chapitre à consolider · 1 carte à revoir')
  })
})
