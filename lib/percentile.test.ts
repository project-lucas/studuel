import { describe, expect, it } from 'vitest'
import {
  COHORT_MIN,
  EMPTY_STANDINGS,
  TOP_BANDS,
  cohortLabel,
  isCelebrationBand,
  ordinal,
  parseGradeStandings,
  standingFor,
  standingLabel,
  topBandFor,
} from './percentile'

describe('topBandFor', () => {
  it('remonte à la première bande qui contient le percentile', () => {
    expect(topBandFor(0.4)).toBe(1)
    expect(topBandFor(1)).toBe(1)
    expect(topBandFor(1.01)).toBe(2)
    expect(topBandFor(2.3)).toBe(5)
    expect(topBandFor(7)).toBe(10)
    expect(topBandFor(40)).toBe(50)
  })

  it('ne descend jamais en dessous de la bande réelle', () => {
    // La règle d'honnêteté : l'arrondi défavorise l'élève, toujours.
    for (const pct of [0.3, 1.4, 3.7, 9.9, 24.2, 49.5]) {
      expect(topBandFor(pct), `pct=${pct}`).toBeGreaterThanOrEqual(pct)
    }
  })
})

describe('standingFor — le plancher de cohorte', () => {
  it('donne le rang brut sous le seuil, jamais un pourcentage', () => {
    const s = standingFor({ rank: 4, total: 61 })
    expect(s).toEqual({ kind: 'rang', rank: 4, total: 61 })
  })

  it('bascule en pourcentage pile au seuil', () => {
    expect(standingFor({ rank: 1, total: COHORT_MIN - 1 }).kind).toBe('rang')
    expect(standingFor({ rank: 1, total: COHORT_MIN }).kind).toBe('pourcentage')
  })

  it('ne prétend pas classer un élève seul', () => {
    // Le piège que le plancher existe pour éviter : 1er sur 1 = « top 100 % ».
    expect(standingFor({ rank: 1, total: 1 })).toEqual({
      kind: 'rang',
      rank: 1,
      total: 1,
    })
  })
})

describe('standingFor — la formulation à l’endroit', () => {
  it('parle en « top » dans la moitié haute', () => {
    const s = standingFor({ rank: 20, total: 1000 })
    expect(s).toMatchObject({ kind: 'pourcentage', side: 'top', value: 2 })
  })

  it('parle en « mieux que » dans la moitié basse', () => {
    // 680e sur 1000 : top 68 %, ce qu'on n'affiche jamais tel quel.
    const s = standingFor({ rank: 680, total: 1000 })
    expect(s).toMatchObject({ kind: 'pourcentage', side: 'mieux', value: 30 })
  })

  it('bascule à la médiane', () => {
    expect(standingFor({ rank: 500, total: 1000 })).toMatchObject({ side: 'top' })
    expect(standingFor({ rank: 501, total: 1000 })).toMatchObject({ side: 'mieux' })
  })

  it('arrondit la part devancée vers le BAS', () => {
    // 656e sur 1000 devance 34,4 % → on annonce 30 %, jamais 35.
    expect(standingFor({ rank: 656, total: 1000 })).toMatchObject({ value: 30 })
  })

  it('n’annonce jamais plus que la réalité, des deux côtés', () => {
    for (let rank = 1; rank <= 1000; rank += 7) {
      const s = standingFor({ rank, total: 1000 })
      if (s.kind !== 'pourcentage') throw new Error('cohorte suffisante attendue')
      if (s.side === 'top') {
        expect(s.value, `rang ${rank}`).toBeGreaterThanOrEqual(s.raw * 100)
      } else {
        const devance = ((1000 - rank) / 1000) * 100
        expect(s.value, `rang ${rank}`).toBeLessThanOrEqual(devance)
      }
    }
  })

  it('n’utilise que des bandes déclarées côté « top »', () => {
    for (let rank = 1; rank <= 500; rank += 3) {
      const s = standingFor({ rank, total: 1000 })
      if (s.kind === 'pourcentage' && s.side === 'top') {
        expect(TOP_BANDS as readonly number[], `rang ${rank}`).toContain(s.value)
      }
    }
  })
})

describe('standingFor — données douteuses', () => {
  it('renvoie « aucun » plutôt que de propager un NaN à l’écran', () => {
    expect(standingFor(null).kind).toBe('aucun')
    expect(standingFor(undefined).kind).toBe('aucun')
    expect(standingFor({ rank: Number.NaN, total: 500 }).kind).toBe('aucun')
    expect(standingFor({ rank: 3, total: Number.POSITIVE_INFINITY }).kind).toBe('aucun')
  })

  it('refuse un rang hors de la cohorte', () => {
    expect(standingFor({ rank: 0, total: 500 }).kind).toBe('aucun')
    expect(standingFor({ rank: 501, total: 500 }).kind).toBe('aucun')
  })
})

describe('cohortLabel', () => {
  it('dit le niveau comme on le prononce', () => {
    expect(cohortLabel('3e')).toBe('des 3e')
    expect(cohortLabel('2de')).toBe('des 2de')
  })

  it('déplie « Tle », qui ne se lit pas à voix haute', () => {
    expect(cohortLabel('Tle')).toBe('des Terminales')
  })

  it('ne prétend pas connaître la classe quand le niveau manque', () => {
    expect(cohortLabel(null)).toBe('des élèves')
    expect(cohortLabel('  ')).toBe('des élèves')
  })
})

describe('standingLabel', () => {
  it('compose la phrase du haut de tableau', () => {
    expect(standingLabel(standingFor({ rank: 20, total: 1000 }), '3e')).toBe(
      'Top 2 % des 3e',
    )
  })

  it('compose la phrase de la moitié basse à l’endroit', () => {
    expect(standingLabel(standingFor({ rank: 680, total: 1000 }), '3e')).toBe(
      'Mieux que 30 % des 3e',
    )
  })

  it('dit le rang brut quand la cohorte est trop petite', () => {
    expect(standingLabel(standingFor({ rank: 4, total: 61 }), '3e')).toBe(
      '4e sur 61 des 3e',
    )
  })

  it('n’écrit rien quand il n’y a rien d’honnête à dire', () => {
    expect(standingLabel({ kind: 'aucun' }, '3e')).toBeNull()
  })
})

describe('ordinal', () => {
  it('traite l’exception du premier', () => {
    expect(ordinal(1)).toBe('1er')
    expect(ordinal(2)).toBe('2e')
    expect(ordinal(61)).toBe('61e')
  })
})

describe('parseGradeStandings', () => {
  const payload = {
    grade: '3e',
    trophies: { rank: 20, total: 1000 },
    assiduite: { rank: 900, total: 1000 },
    maitrise: [
      { subject: 'Maths', rank: 8, total: 400 },
      { subject: 'Anglais', rank: 2, total: 500 },
    ],
  }

  it('lit les trois classements', () => {
    const s = parseGradeStandings(payload)
    expect(s.grade).toBe('3e')
    expect(s.trophies).toMatchObject({ side: 'top', value: 2 })
    expect(s.assiduite).toMatchObject({ side: 'mieux', value: 10 })
    expect(s.maitrise.map((m) => m.subject)).toEqual(['Maths', 'Anglais'])
  })

  it('retombe sur rien plutôt que de casser quand la RPC manque', () => {
    // Migration 223 pas encore exécutée, ou élève déconnecté.
    expect(parseGradeStandings(null)).toEqual(EMPTY_STANDINGS)
    expect(parseGradeStandings('nawak')).toEqual(EMPTY_STANDINGS)
    expect(parseGradeStandings({})).toEqual(EMPTY_STANDINGS)
  })

  it('ignore une mesure mal formée sans perdre les autres', () => {
    const s = parseGradeStandings({ ...payload, assiduite: { rank: 'x' } })
    expect(s.assiduite.kind).toBe('aucun')
    expect(s.trophies).toMatchObject({ value: 2 })
  })

  it('écarte les matières sans place exploitable', () => {
    const s = parseGradeStandings({
      ...payload,
      maitrise: [
        { subject: 'Maths', rank: 8, total: 400 },
        { subject: '', rank: 1, total: 400 },
        { subject: 'Physique', rank: 9, total: 4 },
      ],
    })
    expect(s.maitrise.map((m) => m.subject)).toEqual(['Maths'])
  })

  it('garde le rang brut d’une petite cohorte de matière', () => {
    const s = parseGradeStandings({
      ...payload,
      maitrise: [{ subject: 'Latin', rank: 3, total: 12 }],
    })
    expect(s.maitrise[0].standing).toEqual({ kind: 'rang', rank: 3, total: 12 })
  })
})

describe('isCelebrationBand', () => {
  it('fête une entrée dans une bande haute', () => {
    expect(isCelebrationBand(standingFor({ rank: 20, total: 1000 }))).toBe(true)
  })

  it('ne fête pas la médiane', () => {
    expect(isCelebrationBand(standingFor({ rank: 480, total: 1000 }))).toBe(false)
  })

  it('ne fête ni la moitié basse ni un rang brut', () => {
    expect(isCelebrationBand(standingFor({ rank: 900, total: 1000 }))).toBe(false)
    expect(isCelebrationBand(standingFor({ rank: 1, total: 20 }))).toBe(false)
  })
})
