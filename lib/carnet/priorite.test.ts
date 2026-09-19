import { describe, expect, it } from 'vitest'
import {
  coursPrioritaire,
  joursEntre,
  objectifDuJour,
  poidsControle,
  raisonPriorite,
  scoreUrgence,
  separerFavoris,
  trierCours,
  type CoursCarnet,
} from './priorite'

const AUJOURDHUI = '2026-09-08'

const cours = (over: Partial<CoursCarnet> = {}): CoursCarnet => ({
  id: 'c1',
  title: 'Anglais',
  description: null,
  icon: null,
  color: null,
  subjectId: null,
  questionCount: 20,
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

describe('poidsControle', () => {
  it('pèse plus à mesure que le contrôle approche, et rien au-delà de 14 jours', () => {
    expect(poidsControle('2026-09-09', AUJOURDHUI)).toBe(8 * 14)
    expect(poidsControle('2026-09-22', AUJOURDHUI)).toBe(8)
    expect(poidsControle('2026-09-23', AUJOURDHUI)).toBe(0)
    expect(poidsControle('2026-09-07', AUJOURDHUI)).toBe(0)
    expect(poidsControle(null, AUJOURDHUI)).toBe(0)
  })
})

describe('coursPrioritaire', () => {
  it('rend null sans cours jouable', () => {
    expect(coursPrioritaire([], AUJOURDHUI)).toBeNull()
    expect(coursPrioritaire([cours({ questionCount: 0 })], AUJOURDHUI)).toBeNull()
  })

  it('met les cartes dues devant les cartes neuves', () => {
    const due = cours({ id: 'due', dueCount: 3 })
    const neuf = cours({ id: 'neuf', nouvelles: 20 })
    expect(coursPrioritaire([neuf, due], AUJOURDHUI)?.cours.id).toBe('due')
    expect(raisonPriorite(due, AUJOURDHUI)).toBe('3 cartes dues')
  })

  it('un contrôle à J−2 passe devant dix cartes dues', () => {
    const controle = cours({ id: 'ctrl', examOn: '2026-09-10' })
    const due = cours({ id: 'due', dueCount: 10 })
    expect(coursPrioritaire([due, controle], AUJOURDHUI)?.cours.id).toBe('ctrl')
    expect(raisonPriorite(controle, AUJOURDHUI)).toBe('contrôle dans 2 jours')
    expect(raisonPriorite(cours({ examOn: AUJOURDHUI }), AUJOURDHUI)).toBe('contrôle aujourd’hui')
  })

  it('ignore les cours archivés', () => {
    const archive = cours({ id: 'arch', dueCount: 50, archive: true })
    const autre = cours({ id: 'autre', dueCount: 1 })
    expect(coursPrioritaire([archive, autre], AUJOURDHUI)?.cours.id).toBe('autre')
  })

  it('à égalité, le moins révisé récemment passe devant', () => {
    const hier = cours({ id: 'hier', dueCount: 2, dernierRevuLe: '2026-09-07' })
    const jamais = cours({ id: 'jamais', dueCount: 2, dernierRevuLe: null })
    expect(coursPrioritaire([hier, jamais], AUJOURDHUI)?.cours.id).toBe('jamais')
    expect(scoreUrgence(hier, AUJOURDHUI)).toBe(scoreUrgence(jamais, AUJOURDHUI))
  })

  it('dit une raison même sans rien d’urgent', () => {
    expect(raisonPriorite(cours(), AUJOURDHUI)).toMatch(/entretenir/)
    expect(raisonPriorite(cours({ nouvelles: 1 }), AUJOURDHUI)).toBe('1 carte jamais vue')
  })
})

describe('trierCours', () => {
  const a = cours({ id: 'a', title: 'Zoologie', dueCount: 5, updatedAt: '2026-09-01T00:00:00Z' })
  const b = cours({ id: 'b', title: 'Algèbre', dueCount: 0, updatedAt: '2026-09-05T00:00:00Z' })
  const c = cours({ id: 'c', title: 'Maths', dueCount: 1, updatedAt: '2026-09-03T00:00:00Z', epingle: true })

  it('les épinglés passent devant, quel que soit l’ordre', () => {
    expect(trierCours([a, b, c], 'alphabetique').map((x) => x.id)).toEqual(['c', 'b', 'a'])
    expect(trierCours([a, b, c], 'recents').map((x) => x.id)).toEqual(['c', 'b', 'a'])
  })

  it('ne mute pas la liste reçue', () => {
    const liste = [a, b]
    trierCours(liste, 'alphabetique')
    expect(liste.map((x) => x.id)).toEqual(['a', 'b'])
  })
})

describe('objectifDuJour', () => {
  it('calcule le pourcentage, plafonné à 100', () => {
    expect(objectifDuJour(15, 30)).toEqual({ fait: 15, total: 30, pct: 50, atteint: false })
    expect(objectifDuJour(45, 30)).toEqual({ fait: 45, total: 30, pct: 100, atteint: true })
  })

  it('ne divise jamais par zéro', () => {
    expect(objectifDuJour(0, 0).total).toBe(1)
  })
})

describe('joursEntre', () => {
  it('compte les jours, négatif vers le passé', () => {
    expect(joursEntre('2026-09-08', '2026-09-10')).toBe(2)
    expect(joursEntre('2026-09-08', '2026-09-01')).toBe(-7)
  })
})

describe('separerFavoris', () => {
  it('met les favoris d’un côté, les autres de l’autre, sans changer l’ordre', () => {
    const a = cours({ id: 'a', title: 'A', epingle: true })
    const b = cours({ id: 'b', title: 'B' })
    const c = cours({ id: 'c', title: 'C', epingle: true })
    const { favoris, autres } = separerFavoris([b, a, c])
    expect(favoris.map((x) => x.id)).toEqual(['a', 'c'])
    expect(autres.map((x) => x.id)).toEqual(['b'])
  })

  it('rend deux listes vides pour un carnet vide', () => {
    expect(separerFavoris([])).toEqual({ favoris: [], autres: [] })
  })
})
