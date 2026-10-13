import { describe, expect, it } from 'vitest'
import type { EtatLigue, MembreLigue } from '@/lib/ligue'
import { enjeuLigue, ligueApresCourse, ordinal } from './ligue-course'

function membre(cle: string, xp: number, rang: number, moi = false): MembreLigue {
  return { cle, id: moi ? 'moi' : null, nom: cle, portrait: '', xp, rang, robot: !moi, moi }
}

/** Un groupe déjà classé, moi 3e avec 100 XP. */
function etat(groupe: MembreLigue[], patch: Partial<EtatLigue> = {}): EtatLigue {
  return {
    semaine: '2026-10-12',
    fin: '2026-10-19T00:00:00.000Z',
    echelon: 3,
    inscrit: true,
    groupe,
    xpSemaine: 100,
    nbAmis: 0,
    amis: [],
    bilan: null,
    coffre: null,
    coffresPrets: [],
    ...patch,
  }
}

const GROUPE = [
  membre('a', 150, 1),
  membre('b', 120, 2),
  membre('moi', 100, 3, true),
  membre('c', 90, 4),
  membre('d', 60, 5),
  membre('e', 50, 6),
]

describe('ligueApresCourse', () => {
  it('rend null sans ligue ou hors groupe', () => {
    expect(ligueApresCourse(null, 20)).toBeNull()
    expect(ligueApresCourse(etat(GROUPE, { inscrit: false }), 20)).toBeNull()
    expect(ligueApresCourse(etat(GROUPE.filter((m) => !m.moi)), 20)).toBeNull()
  })

  it('recompte ma place d’avant : ceux qui ont plus que mon XP d’avant étaient devant', () => {
    // Avant la course j'avais 70 : a (150), b (120) et c (90) étaient devant → 4e.
    const l = ligueApresCourse(etat(GROUPE), 30)
    expect(l).toMatchObject({ rang: 3, rangAvant: 4, xpSemaine: 100, xpAjoutee: 30, entree: false })
    expect(l?.nom).toBe('Bronze 1')
    expect(l?.taille).toBe(6)
  })

  it('ne bouge pas quand la course n’a rien versé', () => {
    expect(ligueApresCourse(etat(GROUPE), 0)).toMatchObject({ rang: 3, rangAvant: 3 })
  })

  it('n’invente jamais une montée : la place d’avant n’est jamais meilleure', () => {
    // Un ajout plus grand que mon XP : avant, j'avais 0 — tout le monde était devant.
    const l = ligueApresCourse(etat(GROUPE), 500)
    expect(l?.rangAvant).toBe(6)
    expect(l?.entree).toBe(true)
  })

  it('compte les promus et relégués du groupe', () => {
    const l = ligueApresCourse(etat(GROUPE), 10)
    // 6 joueurs : floor(6 × 7 / 30) = 1 promu, floor(6 × 5 / 30) = 1 relégué.
    expect(l?.promus).toBe(1)
    expect(l?.relegues).toBe(1)
  })
})

describe('enjeuLigue', () => {
  const base = ligueApresCourse(etat(GROUPE), 10)!
  it('dit la distance à la zone de promotion', () => {
    expect(enjeuLigue({ ...base, rang: 3, promus: 1 })).toBe('À 2 places de la promotion')
    expect(enjeuLigue({ ...base, rang: 2, promus: 1 })).toBe('À 1 place de la promotion')
  })
  it('dit quand on y est, ou qu’on est en bas', () => {
    expect(enjeuLigue({ ...base, rang: 1, promus: 1 })).toBe('En zone de promotion')
    expect(enjeuLigue({ ...base, rang: 6, taille: 6, relegues: 1, promus: 1 })).toBe('En zone de relégation')
  })
})

describe('ordinal', () => {
  it('écrit 1er puis Ne', () => {
    expect(ordinal(1)).toBe('1er')
    expect(ordinal(2)).toBe('2e')
    expect(ordinal(14)).toBe('14e')
  })
})
