import { describe, expect, it } from 'vitest'
import {
  casesJeux,
  casesPalmares,
  parsePalmares,
  resumeJeux,
  resumePalmares,
  sousTitreJeux,
  sousTitrePalmares,
} from './palmares'

const rows = [
  {
    mode_id: 'blitz',
    best: 1200,
    best_at: '2026-09-01T10:00:00Z',
    last: 900,
    plays: 4,
    week_best: 1200,
    week_plays: 2,
    week_rank: 1,
    week_total: 12,
    all_rank: 30,
    all_total: 200,
  },
  {
    mode_id: 'survie',
    best: 9,
    best_at: null,
    last: 5,
    plays: 3,
    week_best: null,
    week_plays: null,
    week_rank: null,
    week_total: null,
    all_rank: 4,
    all_total: 40,
  },
  { mode_id: 'ranked', best: 1, plays: 1 },
]

describe('parsePalmares', () => {
  it('lit les lignes de my_mode_palmares et ignore les modes inconnus', () => {
    const l = parsePalmares(rows)
    expect(l.map((x) => x.mode)).toEqual(['blitz', 'survie'])
    expect(l[0].weekRank).toBe(1)
    expect(l[1].weekBest).toBeNull()
    expect(l[1].weekPlays).toBe(0)
  })

  it('rend vide sur autre chose qu’un tableau', () => {
    expect(parsePalmares(undefined)).toEqual([])
  })
})

describe('casesPalmares', () => {
  it('rend toujours les cinq cases, jouées ou non, dans l’ordre du catalogue', () => {
    const cases = casesPalmares(parsePalmares(rows))
    expect(cases.map((c) => c.mode)).toEqual(['blitz', 'chrono', 'survie', 'boss', 'duel'])
    expect(cases[1].ligne).toBeNull()
    expect(cases[1].semaine).toEqual({ kind: 'aucun' })
  })

  it('pose le métal de la semaine et les places aux règles du percentile', () => {
    const cases = casesPalmares(parsePalmares(rows))
    expect(cases[0].metal).toBe('or')
    expect(cases[0].semaine).toEqual({ kind: 'rang', rank: 1, total: 12 })
    expect(cases[0].toujours.kind).toBe('pourcentage')
    expect(cases[2].metal).toBeNull()
    expect(cases[2].semaine).toEqual({ kind: 'aucun' })
    expect(cases[2].toujours).toEqual({ kind: 'rang', rank: 4, total: 40 })
  })
})

describe('resumePalmares et son sous-titre', () => {
  it('compte les épreuves jouées, les podiums, le meilleur rang, les parties de la semaine', () => {
    const r = resumePalmares(casesPalmares(parsePalmares(rows)))
    expect(r).toEqual({
      jouees: 2,
      podiums: 1,
      meilleurRang: { mode: 'blitz', rank: 1 },
      partiesSemaine: 2,
    })
    expect(sousTitrePalmares(r)).toMatch(/Un podium cette semaine/)
  })

  it('invite quand rien n’est joué, relance quand la semaine est vide', () => {
    expect(sousTitrePalmares(resumePalmares(casesPalmares([])))).toMatch(/cinq records/)
    const sansSemaine = resumePalmares(casesPalmares(parsePalmares([rows[1]])))
    expect(sansSemaine.partiesSemaine).toBe(0)
    expect(sousTitrePalmares(sansSemaine)).toMatch(/à reprendre/)
  })

  it('compte au pluriel', () => {
    const deux = parsePalmares([rows[0], { ...rows[0], mode_id: 'chrono', week_rank: 2 }])
    expect(sousTitrePalmares(resumePalmares(casesPalmares(deux)))).toMatch(/2 podiums/)
  })
})

describe('les jeux de salon par matière', () => {
  it('range chaque jeu jouable sous sa matière, cases vides comprises', () => {
    const groupes = casesJeux([])
    expect(groupes.map((g) => g.matiere)).toContain('Maths')
    const maths = groupes.find((g) => g.matiere === 'Maths')!
    expect(maths.cases.map((c) => c.mode)).toContain('calcul-mental')
    expect(maths.cases.every((c) => c.ligne === null)).toBe(true)
    // Toutes les matières des salons y sont, dans l'ordre des salons.
    expect(groupes[0].matiere).toBe('Histoire-Géo')
  })

  it('pose ma ligne sur le bon jeu et compte les podiums', () => {
    const groupes = casesJeux([
      {
        mode: 'calcul-mental',
        best: 4200,
        bestAt: null,
        last: 3100,
        plays: 3,
        weekBest: 4200,
        weekPlays: 2,
        weekRank: 2,
        weekTotal: 18,
        allRank: 5,
        allTotal: 40,
      },
    ])
    const c = groupes.flatMap((g) => g.cases).find((x) => x.mode === 'calcul-mental')!
    expect(c.ligne?.best).toBe(4200)
    expect(c.metal).toBe('argent')
    const r = resumeJeux(groupes)
    expect(r.joues).toBe(1)
    expect(r.podiums).toBe(1)
    expect(r.total).toBeGreaterThanOrEqual(12)
    expect(sousTitreJeux(r)).toMatch(/podium de jeu/)
    expect(sousTitreJeux({ joues: 0, total: 17, podiums: 0 })).toMatch(/17 jeux par matière/)
    expect(sousTitreJeux({ joues: 2, total: 17, podiums: 0 })).toBe('2 jeux joués sur 17.')
  })
})
