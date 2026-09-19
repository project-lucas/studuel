import { describe, expect, it } from 'vitest'
import {
  cartesASeance,
  coursDerniereSeance,
  dossierAremplir,
  libelleDerniereSeance,
  suggestionCarnet,
} from './suggestion'
import type { CoursCarnet } from './priorite'

const AUJOURDHUI = '2026-09-10'

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

describe('suggestionCarnet', () => {
  it('propose de créer quand le carnet est vide', () => {
    expect(suggestionCarnet([], AUJOURDHUI)).toEqual({ type: 'creer' })
  })

  it('propose de créer quand il ne reste que des archives', () => {
    expect(suggestionCarnet([cours({ archive: true })], AUJOURDHUI)).toEqual({ type: 'creer' })
  })

  it('reprend le cours qui a des cartes dues, avec le compte et la durée', () => {
    const maths = cours({ id: 'm', title: 'Maths', dueCount: 8 })
    const s = suggestionCarnet([cours(), maths], AUJOURDHUI)
    expect(s.type).toBe('reprendre')
    if (s.type !== 'reprendre') return
    expect(s.cours.id).toBe('m')
    expect(s.cartes).toBe(8)
    expect(s.minutes).toBe(4)
    expect(s.raison).toBe('8 cartes dues')
  })

  it('les cartes dues passent avant un dossier vide', () => {
    const vide = cours({ id: 'v', title: 'Physique', questionCount: 0, updatedAt: '2026-09-09T10:00:00Z' })
    const du = cours({ id: 'd', dueCount: 1 })
    expect(suggestionCarnet([vide, du], AUJOURDHUI).type).toBe('reprendre')
  })

  it('propose de remplir le dossier vide quand rien n’est dû', () => {
    const plein = cours({ id: 'p' })
    const vide = cours({ id: 'v', title: 'Physique', questionCount: 0 })
    const s = suggestionCarnet([plein, vide], AUJOURDHUI)
    expect(s).toMatchObject({ type: 'remplir', cours: { id: 'v' } })
  })

  it('ne propose jamais de remplir un dossier archivé', () => {
    const s = suggestionCarnet([cours({ questionCount: 0, archive: true })], AUJOURDHUI)
    expect(s).toEqual({ type: 'creer' })
  })

  it('reprend pour entretenir quand tout est rempli et rien n’est dû', () => {
    const s = suggestionCarnet([cours({ id: 'a' }), cours({ id: 'b', title: 'Bio' })], AUJOURDHUI)
    expect(s.type).toBe('reprendre')
    if (s.type !== 'reprendre') return
    expect(s.raison).toBe('rien d’urgent, à revoir pour entretenir')
    expect(s.cartes).toBe(20)
  })

  it('reprend le cours de la DERNIÈRE SÉANCE avant le plus urgent, s’il a encore à donner', () => {
    const urgent = cours({ id: 'u', title: 'Maths', dueCount: 8 })
    const hier = cours({ id: 'h', title: 'Anglais', dueCount: 2, dernierRevuLe: '2026-09-09' })
    const s = suggestionCarnet([urgent, hier], AUJOURDHUI)
    expect(s).toMatchObject({ type: 'reprendre', cours: { id: 'h' }, derniereSeance: '2026-09-09' })
  })

  it('laisse la dernière séance quand elle n’a plus rien à donner', () => {
    const urgent = cours({ id: 'u', title: 'Maths', dueCount: 8 })
    const hier = cours({ id: 'h', title: 'Anglais', dernierRevuLe: '2026-09-09' })
    expect(suggestionCarnet([urgent, hier], AUJOURDHUI)).toMatchObject({ type: 'reprendre', cours: { id: 'u' } })
  })

  it('pour entretenir, la dernière séance passe avant le moins revu', () => {
    const jamais = cours({ id: 'j', title: 'Bio' })
    const hier = cours({ id: 'h', title: 'Anglais', dernierRevuLe: '2026-09-09' })
    expect(suggestionCarnet([jamais, hier], AUJOURDHUI)).toMatchObject({ type: 'reprendre', cours: { id: 'h' } })
  })

  it('un contrôle qui approche ou des cartes neuves suffisent à reprendre', () => {
    const controle = cours({ id: 'c', examOn: '2026-09-12' })
    expect(suggestionCarnet([controle, cours({ id: 'v', questionCount: 0 })], AUJOURDHUI).type).toBe('reprendre')
    const neuves = cours({ id: 'n', nouvelles: 5 })
    const s = suggestionCarnet([neuves, cours({ id: 'v', questionCount: 0 })], AUJOURDHUI)
    expect(s).toMatchObject({ type: 'reprendre', cartes: 5 })
  })
})

describe('coursDerniereSeance', () => {
  it('le plus récemment revu, vivant et garni ; null sinon', () => {
    const a = cours({ id: 'a', dernierRevuLe: '2026-09-01' })
    const b = cours({ id: 'b', dernierRevuLe: '2026-09-09' })
    const archive = cours({ id: 'x', dernierRevuLe: '2026-09-10', archive: true })
    const vide = cours({ id: 'v', dernierRevuLe: '2026-09-10', questionCount: 0 })
    expect(coursDerniereSeance([a, b, archive, vide], AUJOURDHUI)?.id).toBe('b')
    expect(coursDerniereSeance([cours()], AUJOURDHUI)).toBeNull()
  })
})

describe('libelleDerniereSeance', () => {
  it('aujourd’hui, hier, il y a n jours, ou rien', () => {
    expect(libelleDerniereSeance('2026-09-10', AUJOURDHUI)).toBe('dernière séance aujourd’hui')
    expect(libelleDerniereSeance('2026-09-09', AUJOURDHUI)).toBe('dernière séance hier')
    expect(libelleDerniereSeance('2026-09-03', AUJOURDHUI)).toBe('dernière séance il y a 7 jours')
    expect(libelleDerniereSeance(null, AUJOURDHUI)).toBeNull()
  })
})

describe('dossierAremplir', () => {
  it('choisit le dossier vide le plus récemment touché', () => {
    const ancien = cours({ id: 'a', questionCount: 0, updatedAt: '2026-09-01T00:00:00Z' })
    const recent = cours({ id: 'r', questionCount: 0, updatedAt: '2026-09-09T00:00:00Z' })
    expect(dossierAremplir([ancien, recent])?.id).toBe('r')
  })

  it('rend null sans dossier vide', () => {
    expect(dossierAremplir([cours()])).toBeNull()
  })
})

describe('cartesASeance', () => {
  it('les dues, sinon les neuves, sinon toutes', () => {
    expect(cartesASeance(cours({ dueCount: 3, nouvelles: 9 }))).toBe(3)
    expect(cartesASeance(cours({ nouvelles: 9 }))).toBe(9)
    expect(cartesASeance(cours({ questionCount: 12 }))).toBe(12)
  })
})
