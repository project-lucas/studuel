import { describe, expect, it } from 'vitest'
import { COHORT_MIN, type Standing } from '@/lib/percentile'
import {
  DEPART_COMPTEUR,
  FILTRES_CLASSEMENT,
  NB_BARRES,
  cadreClassement,
  invitationClassement,
  placeDansLaFoule,
  standingNational,
  titreClassement,
  valeurAnimee,
} from './classement'

const top8: Standing = { kind: 'pourcentage', side: 'top', value: 10, raw: 0.08 }
const mieux60: Standing = { kind: 'pourcentage', side: 'mieux', value: 60, raw: 0.38 }
const rang: Standing = { kind: 'rang', rank: 4, total: 61 }
const aucun: Standing = { kind: 'aucun' }

const travail5e = cadreClassement('travail', '5e')
const national = cadreClassement('trophees', '5e')

describe('les filtres', () => {
  it('montre le temps de travail d’abord, puis les trophées', () => {
    expect(FILTRES_CLASSEMENT.map((f) => f.id)).toEqual(['travail', 'trophees'])
  })

  it('classe le temps de travail parmi les élèves du niveau', () => {
    expect(travail5e).toEqual({
      qui: 'des 5e',
      mesure: 'au temps de travail total',
      finDeFoule: 'Toute la classe',
    })
  })

  it('classe les trophées à l’échelle nationale, quel que soit le niveau', () => {
    expect(national).toEqual({
      qui: 'en France',
      mesure: 'aux trophées',
      finDeFoule: 'Toute la France',
    })
    expect(cadreClassement('trophees', null)).toEqual(national)
  })

  it('invite à entrer dans le classement, filtre par filtre', () => {
    expect(invitationClassement('travail').titre).toMatch(/première session/)
    expect(invitationClassement('trophees').texte).toMatch(/classement national/)
  })
})

describe('titreClassement', () => {
  it('écrit la moitié haute en « Top », avec la cohorte et la mesure', () => {
    expect(titreClassement(top8, travail5e)).toEqual({
      grand: 'Top 10 %',
      petit: 'des 5e, au temps de travail total',
    })
    expect(titreClassement(top8, national)?.petit).toBe('en France, aux trophées')
  })

  it('écrit la moitié basse à l’endroit : « Mieux que »', () => {
    expect(titreClassement(mieux60, travail5e)?.grand).toBe('Mieux que 60 %')
  })

  it('dit le rang vrai sous le plancher, et l’exception du premier', () => {
    expect(titreClassement(rang, travail5e)).toEqual({ grand: '4e', petit: 'sur 61 des 5e' })
    expect(titreClassement(rang, national)?.petit).toBe('sur 61 en France')
    expect(titreClassement({ kind: 'rang', rank: 1, total: 12 }, travail5e)?.grand).toBe('1er')
  })

  it('ne dit rien sans classement', () => {
    expect(titreClassement(aucun, travail5e)).toBeNull()
  })
})

describe('standingNational', () => {
  it('parle en pourcentage dès que la France compte assez de joueurs', () => {
    const s = standingNational({ myRank: 12, total: 1_000 }, 340)
    expect(s).toMatchObject({ kind: 'pourcentage', side: 'top', value: 2 })
  })

  it('dit le rang vrai tant que les joueurs sont moins que le plancher', () => {
    expect(standingNational({ myRank: 3, total: COHORT_MIN - 1 }, 40)).toEqual({
      kind: 'rang',
      rank: 3,
      total: COHORT_MIN - 1,
    })
  })

  it('ne classe pas un élève sans trophée : son rang serait tiré au sort', () => {
    expect(standingNational({ myRank: 400, total: 1_000 }, 0)).toEqual(aucun)
  })

  it('ne classe personne sans réponse de la base', () => {
    expect(standingNational(null, 120)).toEqual(aucun)
    expect(standingNational({ myRank: null, total: 1_000 }, 120)).toEqual(aucun)
    expect(standingNational({ myRank: 5, total: 1_000 }, Number.NaN)).toEqual(aucun)
  })
})

describe('placeDansLaFoule', () => {
  it('place le percentile brut, de gauche (premier) à droite (dernier)', () => {
    expect(placeDansLaFoule(top8)).toBeCloseTo(0.08)
    expect(placeDansLaFoule(mieux60)).toBeCloseTo(0.38)
  })

  it('place un rang par sa fraction de la cohorte', () => {
    expect(placeDansLaFoule(rang)).toBeCloseTo(4 / 61)
  })

  it('ne place personne sans classement', () => {
    expect(placeDansLaFoule(aucun)).toBeNull()
  })

  it('reste dans 0..1 même sur une donnée absurde', () => {
    expect(placeDansLaFoule({ kind: 'pourcentage', side: 'top', value: 1, raw: 4 })).toBe(1)
    expect(placeDansLaFoule({ kind: 'pourcentage', side: 'top', value: 1, raw: NaN })).toBe(0)
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

describe('la foule', () => {
  it('a une silhouette par deux pour cent', () => {
    expect(NB_BARRES).toBe(50)
  })
})
