import { describe, expect, it } from 'vitest'
import { COHORT_MIN } from '@/lib/percentile'
import { coteTitle } from './ultime'
import {
  gradeLabel,
  gradeStanding,
  parseUltimeStanding,
  standingTitle,
  worldLabel,
  worldStanding,
} from './ultime-standing'

const rpc = (over: Record<string, unknown> = {}) => ({
  cote: 940,
  best_level: 13,
  runs: 7,
  grade: '6e',
  rank: 42,
  total: 3400,
  grade_rank: 1,
  grade_total: 210,
  ...over,
})

describe('parseUltimeStanding', () => {
  it('lit ce que rend la RPC', () => {
    expect(parseUltimeStanding(rpc())).toEqual({
      cote: 940,
      bestLevel: 13,
      runs: 7,
      grade: '6e',
      rank: 42,
      total: 3400,
      gradeRank: 1,
      gradeTotal: 210,
    })
  })

  it('rend null plutôt que de jeter (migration absente, jamais joué, visiteur)', () => {
    expect(parseUltimeStanding(null)).toBeNull()
    expect(parseUltimeStanding(undefined)).toBeNull()
    expect(parseUltimeStanding([])).toBeNull()
    expect(parseUltimeStanding('du texte')).toBeNull()
    expect(parseUltimeStanding({})).toBeNull()
  })

  it('refuse une place incohérente au lieu de l’afficher', () => {
    expect(parseUltimeStanding(rpc({ rank: 0 }))).toBeNull()
    // Plus de rang que de joueurs : impossible, donc on ne l'affiche pas.
    expect(parseUltimeStanding(rpc({ rank: 50, total: 10 }))).toBeNull()
  })

  it('laisse tomber le classement de CLASSE quand elle n’est pas renseignée', () => {
    const sans = parseUltimeStanding(
      rpc({ grade: null, grade_rank: null, grade_total: null }),
    )
    expect(sans?.grade).toBeNull()
    expect(sans?.gradeRank).toBeNull()
    // Le mondial, lui, reste : il ne dépend d'aucune classe. C'est tout l'objet.
    expect(sans?.rank).toBe(42)
    expect(gradeLabel(sans)).toBeNull()
    expect(worldLabel(sans)).not.toBeNull()
  })
})

describe('le classement mondial', () => {
  it('parle en pourcentage dès que la cohorte le permet', () => {
    // 42e sur 3400 = 1,2 % → remonté à la bande 2 %.
    expect(worldLabel(parseUltimeStanding(rpc()))).toBe('Top 2 % mondial')
  })

  it('retombe sur le rang brut quand les joueurs sont trop peu', () => {
    const petit = parseUltimeStanding(
      rpc({ rank: 3, total: COHORT_MIN - 1, grade_rank: null, grade_total: null }),
    )
    expect(worldStanding(petit).kind).toBe('rang')
    expect(worldLabel(petit)).toBe(`3e sur ${COHORT_MIN - 1} joueurs`)
  })

  it('retourne la formulation sous la médiane, sans gifler personne', () => {
    const bas = parseUltimeStanding(rpc({ rank: 2800, total: 3400 }))
    expect(worldLabel(bas)).toMatch(/^Devant \d+ % des joueurs$/)
  })

  it('ne dit rien quand il n’y a rien à dire', () => {
    expect(worldLabel(null)).toBeNull()
    expect(worldStanding(null).kind).toBe('aucun')
  })
})

describe('le classement de classe', () => {
  it('nomme la cohorte scolaire, pas « les joueurs »', () => {
    // 1er sur 210 : cohorte suffisante, donc pourcentage.
    expect(gradeLabel(parseUltimeStanding(rpc()))).toBe('Top 1 % des 6e')
  })

  it('dit le rang brut dans une petite classe — « 1er des 6e » vaut mieux qu’un %', () => {
    const petit = parseUltimeStanding(rpc({ grade_rank: 1, grade_total: 40 }))
    expect(gradeLabel(petit)).toBe('1er sur 40 des 6e')
  })

  it('n’existe pas sans classe déclarée', () => {
    expect(gradeStanding(null).kind).toBe('aucun')
  })
})

describe('le titre', () => {
  it('suit la cote', () => {
    const s = parseUltimeStanding(rpc())
    expect(standingTitle(s)).toBe(coteTitle(940))
    expect(standingTitle(null)).toBeNull()
  })
})
