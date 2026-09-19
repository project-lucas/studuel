import { describe, expect, it } from 'vitest'
import { allureDeMatiere, cleTitre, trouverDoublon } from './matiere'
import type { CoursCarnet } from './priorite'

const cours = (over: Partial<CoursCarnet> = {}): CoursCarnet => ({
  id: 'c1',
  title: 'Anglais',
  description: null,
  icon: null,
  color: null,
  subjectId: 'sub-anglais',
  questionCount: 0,
  dueCount: 0,
  nouvelles: 0,
  crowns: 0,
  examOn: null,
  objectif: null,
  epingle: false,
  archive: false,
  updatedAt: '2026-09-01T10:00:00Z',
  dernierRevuLe: null,
  ...over,
})

describe('allureDeMatiere', () => {
  it('donne l’icône par slug et la couleur par jeton', () => {
    expect(allureDeMatiere({ slug: 'maths', color: 'blue' })).toEqual({ icon: 'calculator', color: 'ciel' })
    expect(allureDeMatiere({ slug: 'physique-chimie', color: 'teal' })).toEqual({ icon: 'atom', color: 'menthe' })
    expect(allureDeMatiere({ slug: 'anglais', color: 'indigo' })).toEqual({ icon: 'languages', color: 'violet' })
  })

  it('retombe sur le livre violet sans matière ou pour une matière inconnue', () => {
    expect(allureDeMatiere(null)).toEqual({ icon: 'book-open', color: 'violet' })
    expect(allureDeMatiere({ slug: 'inconnue', color: 'fuchsia' })).toEqual({ icon: 'book-open', color: 'violet' })
  })
})

describe('cleTitre', () => {
  it('fond majuscules, accents, tirets et espaces', () => {
    expect(cleTitre('Anglais — Verbes irréguliers')).toBe('anglais verbes irreguliers')
    expect(cleTitre('  anglais   verbes-irreguliers ')).toBe('anglais verbes irreguliers')
    expect(cleTitre('   ')).toBe('')
  })
})

describe('trouverDoublon', () => {
  const existants = [cours(), cours({ id: 'c2', title: 'Maths', subjectId: 'sub-maths' })]

  it('repère le même titre dans la même matière, aux majuscules près', () => {
    expect(trouverDoublon(existants, 'ANGLAIS', 'sub-anglais')?.id).toBe('c1')
  })

  it('laisse passer le même titre dans une autre matière', () => {
    expect(trouverDoublon(existants, 'Anglais', 'sub-espagnol')).toBeNull()
  })

  it('prévient quand l’un des deux n’a pas de matière', () => {
    expect(trouverDoublon(existants, 'anglais', null)?.id).toBe('c1')
    expect(trouverDoublon([cours({ subjectId: null })], 'anglais', 'sub-anglais')?.id).toBe('c1')
  })

  it('compte les archivés, ignore un titre vide', () => {
    expect(trouverDoublon([cours({ archive: true })], 'anglais', 'sub-anglais')?.id).toBe('c1')
    expect(trouverDoublon(existants, '   ', 'sub-anglais')).toBeNull()
  })
})
