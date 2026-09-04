import { describe, expect, it } from 'vitest'
import { COHORT_MIN, type GradeStandings, type Standing } from '@/lib/percentile'
import {
  DEPART_COMPTEUR,
  NB_BARRES,
  axesSecondaires,
  jauge,
  libelleAxe,
  placeDansLaFoule,
  progressionCohorte,
  titreClassement,
  valeurAnimee,
} from './classement'

const top8: Standing = { kind: 'pourcentage', side: 'top', value: 10, raw: 0.08 }
const mieux60: Standing = { kind: 'pourcentage', side: 'mieux', value: 60, raw: 0.38 }
const rang: Standing = { kind: 'rang', rank: 4, total: 61 }
const aucun: Standing = { kind: 'aucun' }

describe('titreClassement', () => {
  it('écrit la moitié haute en « Top », avec la cohorte et la mesure', () => {
    expect(titreClassement(top8, '5e')).toEqual({
      grand: 'Top 10 %',
      petit: 'des 5e, au temps de travail',
    })
  })

  it('écrit la moitié basse à l’endroit : « Mieux que »', () => {
    expect(titreClassement(mieux60, '3e')?.grand).toBe('Mieux que 60 %')
  })

  it('dit le rang vrai sous le plancher, et l’exception du premier', () => {
    expect(titreClassement(rang, '5e')).toEqual({ grand: '4e', petit: 'sur 61 des 5e' })
    expect(titreClassement({ kind: 'rang', rank: 1, total: 12 }, 'Tle')?.grand).toBe('1er')
  })

  it('ne dit rien sans classement', () => {
    expect(titreClassement(aucun, '5e')).toBeNull()
  })

  it('accepte une autre mesure pour un autre écran', () => {
    expect(titreClassement(top8, '5e', 'aux trophées')?.petit).toBe('des 5e, aux trophées')
  })
})

describe('placeDansLaFoule et jauge', () => {
  it('place le percentile brut, de gauche (premier) à droite (dernier)', () => {
    expect(placeDansLaFoule(top8)).toBeCloseTo(0.08)
    expect(placeDansLaFoule(mieux60)).toBeCloseTo(0.38)
  })

  it('place un rang par sa fraction de la cohorte', () => {
    expect(placeDansLaFoule(rang)).toBeCloseTo(4 / 61)
  })

  it('ne place personne sans classement', () => {
    expect(placeDansLaFoule(aucun)).toBeNull()
    expect(jauge(aucun)).toBe(0)
  })

  it('remplit la jauge de ce que l’élève devance', () => {
    expect(jauge(top8)).toBeCloseTo(0.92)
    expect(jauge({ kind: 'rang', rank: 61, total: 61 })).toBe(0)
  })

  it('reste dans 0..1 même sur une donnée absurde', () => {
    expect(placeDansLaFoule({ kind: 'pourcentage', side: 'top', value: 1, raw: 4 })).toBe(1)
    expect(placeDansLaFoule({ kind: 'pourcentage', side: 'top', value: 1, raw: NaN })).toBe(0)
  })
})

describe('libelleAxe', () => {
  it('résume chaque forme en quelques signes', () => {
    expect(libelleAxe(top8)).toBe('top 10 %')
    expect(libelleAxe(mieux60)).toBe('mieux que 60 %')
    expect(libelleAxe(rang)).toBe('4e / 61')
    expect(libelleAxe(aucun)).toBeNull()
  })
})

describe('axesSecondaires', () => {
  const base: GradeStandings = {
    grade: '5e',
    trophies: aucun,
    assiduite: top8,
    maitrise: [],
  }

  it('ne prend aucune ligne quand rien n’est classé', () => {
    expect(axesSecondaires(base)).toEqual([])
  })

  it('met l’arène puis la MEILLEURE matière, pas la première', () => {
    const axes = axesSecondaires({
      ...base,
      trophies: mieux60,
      maitrise: [
        { subject: 'Maths', standing: { kind: 'pourcentage', side: 'top', value: 25, raw: 0.2 } },
        { subject: 'Français', standing: { kind: 'pourcentage', side: 'top', value: 5, raw: 0.04 } },
        { subject: 'SVT', standing: aucun },
      ],
    })
    expect(axes.map((a) => a.cle)).toEqual(['arene', 'maitrise'])
    expect(axes[1].titre).toBe('Maîtrise · Français')
  })

  it('garde une matière classée par rang sous le plancher', () => {
    const axes = axesSecondaires({
      ...base,
      maitrise: [{ subject: 'Histoire', standing: rang }],
    })
    expect(axes).toHaveLength(1)
    expect(axes[0].titre).toBe('Maîtrise · Histoire')
  })
})

describe('valeurAnimee', () => {
  it('part de la médiane et arrive exactement à la valeur', () => {
    expect(valeurAnimee(DEPART_COMPTEUR, 8, 0)).toBe(50)
    expect(valeurAnimee(DEPART_COMPTEUR, 8, 1)).toBe(8)
  })

  it('ralentit en arrivant : plus de la moitié du chemin à mi-parcours', () => {
    const miParcours = valeurAnimee(50, 8, 0.5)
    expect(miParcours).toBeLessThan(29)
    expect(miParcours).toBeGreaterThan(8)
  })

  it('ne dépasse jamais ses bornes', () => {
    expect(valeurAnimee(50, 8, 1.7)).toBe(8)
    expect(valeurAnimee(50, 8, -1)).toBe(50)
  })
})

describe('progressionCohorte', () => {
  it('compte les inscrits vers le plancher, sous le plancher seulement', () => {
    expect(progressionCohorte(rang)).toEqual({ total: 61, requis: COHORT_MIN, ratio: 0.61 })
    expect(progressionCohorte(top8)).toBeNull()
    expect(progressionCohorte(aucun)).toBeNull()
  })
})

describe('la foule', () => {
  it('a une silhouette par deux pour cent', () => {
    expect(NB_BARRES).toBe(50)
  })
})
