import { describe, expect, test } from 'vitest'
import type { ChapterRow } from '@/lib/subject-template'
import {
  CLE_SANS_THEME,
  afficheEnMondes,
  basculerFavori,
  estFavori,
  jaugeDesFiches,
  mondesDuProgramme,
  ordonnerMondes,
  progressionAffichee,
  repriseDuProgramme,
  xpRestantFiche,
} from './programme'

const fiche = (over: Partial<ChapterRow> & { id: string }): ChapterRow => ({
  position: 1,
  title: `Fiche ${over.id}`,
  status: 'non_commence',
  value: 0,
  crowns: 0,
  href: `/reviser/maths/${over.id}`,
  examHint: null,
  minutes: 6,
  theme: 'Nombres et calculs',
  discipline: null,
  aQuiz: true,
  quizTeste: false,
  xpRestant: 140,
  ...over,
})

const finie = (id: string, theme: string): ChapterRow =>
  fiche({ id, theme, status: 'complete', value: 1, crowns: 3, xpRestant: 0 })
const entamee = (id: string, theme: string): ChapterRow =>
  fiche({ id, theme, status: 'en_cours', value: 0.5, crowns: 1, xpRestant: 100 })

describe('progressionAffichee — une jauge qui encourage', () => {
  test('zéro reste zéro, cent reste cent', () => {
    expect(progressionAffichee(0)).toBe(0)
    expect(progressionAffichee(100)).toBe(100)
  })

  test('les premiers pas remplissent beaucoup', () => {
    // Une fiche sur vingt-huit : 3,6 % réels, onze pixels sur une barre.
    expect(progressionAffichee(3.6)).toBeGreaterThanOrEqual(13)
    expect(progressionAffichee(10)).toBe(25)
    expect(progressionAffichee(25)).toBe(44)
    expect(progressionAffichee(50)).toBe(66)
  })

  test('un travail minuscule se voit quand même', () => {
    expect(progressionAffichee(0.3)).toBe(6)
  })

  test('ne paraît jamais finie avant de l’être', () => {
    expect(progressionAffichee(99.9)).toBe(99)
  })

  test('croît toujours avec le travail', () => {
    let precedent = -1
    for (let p = 0; p <= 100; p += 1) {
      const valeur = progressionAffichee(p)
      expect(valeur).toBeGreaterThanOrEqual(precedent)
      precedent = valeur
    }
  })

  test('survit à une valeur absurde', () => {
    expect(progressionAffichee(Number.NaN)).toBe(0)
    expect(progressionAffichee(-12)).toBe(0)
    expect(progressionAffichee(340)).toBe(100)
  })
})

describe('jaugeDesFiches', () => {
  test('un seul cours lu sur soixante fiches allume déjà la jauge', () => {
    const fiches = [{ value: 0.3 }, ...Array.from({ length: 59 }, () => ({ value: 0 }))]
    expect(jaugeDesFiches(fiches)).toBeGreaterThan(0)
  })

  test('vide sans fiche, pleine quand tout est maîtrisé', () => {
    expect(jaugeDesFiches([])).toBe(0)
    expect(jaugeDesFiches([{ value: 1 }, { value: 1 }])).toBe(100)
  })
})

describe('xpRestantFiche', () => {
  test('une fiche vierge à une leçon vaut 140 XP (leçon à 10 depuis la 557)', () => {
    expect(xpRestantFiche({ leconsALire: 1, couronnes: 0 })).toBe(140)
  })

  test('ne compte que ce qui reste', () => {
    expect(xpRestantFiche({ leconsALire: 0, couronnes: 1 })).toBe(100)
    expect(xpRestantFiche({ leconsALire: 0, couronnes: 3 })).toBe(0)
    expect(xpRestantFiche({ leconsALire: 2, couronnes: 3 })).toBe(20)
  })
})

describe('mondesDuProgramme', () => {
  const programme = [
    finie('a', 'Nombres et calculs'),
    finie('b', 'Nombres et calculs'),
    entamee('c', 'Fonctions'),
    fiche({ id: 'd', theme: 'Fonctions' }),
    fiche({ id: 'e', theme: 'Géométrie' }),
  ]

  test('un monde par thème, dans l’ordre du programme', () => {
    const mondes = mondesDuProgramme(programme)
    expect(mondes.map((m) => m.titre)).toEqual(['Nombres et calculs', 'Fonctions', 'Géométrie'])
    expect(mondes.map((m) => m.etat)).toEqual(['termine', 'entame', 'vierge'])
    expect(mondes[1].avancement).toMatchObject({ done: 0, total: 2 })
    expect(mondes[0].jauge).toBe(100)
    expect(mondes[2].jauge).toBe(0)
  })

  test('remonte le contrôle le plus proche du thème', () => {
    const mondes = mondesDuProgramme([
      fiche({ id: 'a', theme: 'Géométrie', examHint: { label: 'Contrôle dans 9 jours', proximity: 'far' } }),
      fiche({ id: 'b', theme: 'Géométrie', examHint: { label: 'Contrôle demain', proximity: 'imminent' } }),
      fiche({ id: 'c', theme: 'Fonctions' }),
    ])
    expect(mondes[0].controle?.label).toBe('Contrôle demain')
    expect(mondes[1].controle).toBeNull()
  })

  test('les fiches sans thème d’une matière rangée ont leur monde', () => {
    const mondes = mondesDuProgramme([fiche({ id: 'a' }), fiche({ id: 'z', theme: null })])
    expect(mondes[1]).toMatchObject({ cle: CLE_SANS_THEME, titre: 'Autres chapitres' })
  })
})

describe('afficheEnMondes', () => {
  test('la grille demande au moins deux thèmes', () => {
    expect(afficheEnMondes([{ theme: 'A' }, { theme: 'B' }])).toBe(true)
    expect(afficheEnMondes([{ theme: 'A' }, { theme: 'A' }])).toBe(false)
    expect(afficheEnMondes([{ theme: null }, { theme: null }])).toBe(false)
  })
})

describe('les favoris', () => {
  const calme = { cle: 'Fonctions', controle: null }
  const controle = {
    cle: 'Géométrie',
    controle: { label: 'Contrôle dans 3 jours', proximity: 'soon' as const },
  }

  test('un thème où un contrôle est annoncé est favori d’office', () => {
    expect(estFavori(controle, {})).toBe(true)
    expect(estFavori(calme, {})).toBe(false)
  })

  test('le choix de l’élève l’emporte, dans les deux sens', () => {
    expect(estFavori(calme, { Fonctions: true })).toBe(true)
    expect(estFavori(controle, { Géométrie: false })).toBe(false)
  })

  test('toucher l’étoile inverse ce qu’elle montrait, sans muter le choix', () => {
    const choix = {}
    expect(basculerFavori(calme, choix)).toEqual({ Fonctions: true })
    expect(basculerFavori(controle, choix)).toEqual({ Géométrie: false })
    expect(choix).toEqual({})
  })

  test('les favoris passent devant, chaque paquet dans l’ordre du programme', () => {
    const mondes = [
      { cle: 'A', controle: null },
      { cle: 'B', controle: null },
      controle,
      { cle: 'D', controle: null },
    ]
    expect(ordonnerMondes(mondes, { D: true }).map((m) => m.cle)).toEqual(['Géométrie', 'D', 'A', 'B'])
  })
})

describe('repriseDuProgramme', () => {
  test('rien à faire : on commence par la première fiche', () => {
    const r = repriseDuProgramme([fiche({ id: 'a' }), fiche({ id: 'b' })], null)
    expect(r).toMatchObject({ libelle: 'Commencer', rang: 1, cle: 'Nombres et calculs' })
    expect(r?.fiche.id).toBe('a')
  })

  test('la fiche de la dernière session, tant qu’elle n’est pas finie', () => {
    const r = repriseDuProgramme(
      [finie('a', 'Nombres'), entamee('b', 'Fonctions'), entamee('c', 'Fonctions')],
      { chapterId: 'c', label: 'Dernière session' },
    )
    expect(r).toMatchObject({ libelle: 'Reprendre', rang: 2, cle: 'Fonctions' })
    expect(r?.fiche.id).toBe('c')
  })

  test('dernière session finie : la suivante à faire dans le MÊME thème', () => {
    const r = repriseDuProgramme(
      [
        fiche({ id: 'x', theme: 'Nombres' }),
        finie('a', 'Fonctions'),
        fiche({ id: 'b', theme: 'Fonctions' }),
      ],
      { chapterId: 'a', label: 'Dernière session' },
    )
    expect(r?.fiche.id).toBe('b')
    expect(r?.libelle).toBe('Continuer')
  })

  test('thème de la dernière session terminé : la première fiche entamée ailleurs', () => {
    const r = repriseDuProgramme(
      [finie('a', 'Fonctions'), fiche({ id: 'b', theme: 'Géométrie' }), entamee('c', 'Géométrie')],
      { chapterId: 'a', label: 'Dernière session' },
    )
    expect(r?.fiche.id).toBe('c')
    expect(r?.libelle).toBe('Reprendre')
  })

  test('tout est terminé : plus rien à reprendre', () => {
    expect(repriseDuProgramme([finie('a', 'A'), finie('b', 'B')], null)).toBeNull()
  })

  test('une fiche hors thème n’a pas de rang', () => {
    const r = repriseDuProgramme([fiche({ id: 'a', theme: null })], null)
    expect(r?.rang).toBeNull()
  })
})
