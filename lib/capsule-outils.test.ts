import { describe, expect, it } from 'vitest'
import {
  euros,
  heureDepuisMinutes,
  heuresDeCoucher,
  libelleDuree,
  libelleMois,
  lireCoches,
  lireGrille,
  minutesDepuisMinuit,
  planEpargne,
  progressionListe,
  remplissageGrille,
} from './capsule-outils'

describe('le calculateur de coucher', () => {
  it('lit une heure, et refuse ce qui n’en est pas une', () => {
    expect(minutesDepuisMinuit('07:05')).toBe(425)
    expect(minutesDepuisMinuit('7:30')).toBe(450)
    expect(minutesDepuisMinuit('24:00')).toBeNull()
    expect(minutesDepuisMinuit('07:60')).toBeNull()
    expect(minutesDepuisMinuit('sept heures')).toBeNull()
  })

  it('repart de minuit quand on recule avant 0 h', () => {
    expect(heureDepuisMinutes(-30)).toBe('23:30')
    expect(heureDepuisMinutes(24 * 60 + 5)).toBe('00:05')
  })

  it('propose six puis cinq cycles, endormissement compris', () => {
    const couchers = heuresDeCoucher('07:00')
    expect(couchers).toEqual([
      { cycles: 6, heure: '21:45', sommeil: '9 h', conseille: true },
      { cycles: 5, heure: '23:15', sommeil: '7 h 30', conseille: false },
    ])
  })

  it('ne propose rien sans heure de réveil valide', () => {
    expect(heuresDeCoucher('')).toEqual([])
  })

  it('écrit les durées comme on les dit', () => {
    expect(libelleDuree(540)).toBe('9 h')
    expect(libelleDuree(450)).toBe('7 h 30')
  })
})

describe('le calculateur d’épargne', () => {
  const base = { argentMensuel: 30, depensesMensuelles: 10, objectif: 100, dejaEconomise: 0 }

  it('compte les mois, arrondis au mois entier supérieur', () => {
    expect(planEpargne(base)).toEqual({ kind: 'possible', epargneMensuelle: 20, mois: 5, reste: 100 })
    expect(planEpargne({ ...base, objectif: 110 })).toMatchObject({ mois: 6 })
  })

  it('tient compte de ce qui est déjà de côté', () => {
    expect(planEpargne({ ...base, dejaEconomise: 60 })).toMatchObject({ mois: 2, reste: 40 })
    expect(planEpargne({ ...base, dejaEconomise: 100 })).toEqual({ kind: 'atteint' })
  })

  it('dit quand rien ne reste à la fin du mois', () => {
    expect(planEpargne({ ...base, depensesMensuelles: 35 })).toEqual({
      kind: 'impossible',
      deficit: 5,
    })
  })

  it('attend des montants valides', () => {
    expect(planEpargne({ ...base, objectif: 0 })).toEqual({ kind: 'incomplet' })
    expect(planEpargne({ ...base, argentMensuel: Number.NaN })).toEqual({ kind: 'incomplet' })
    expect(planEpargne({ ...base, depensesMensuelles: -3 })).toEqual({ kind: 'incomplet' })
  })

  it('écrit les euros et les mois à la française', () => {
    expect(euros(20).replace(/\s/g, ' ')).toBe('20 €')
    expect(euros(12.5).replace(/\s/g, ' ')).toBe('12,50 €')
    expect(libelleMois(7)).toBe('7 mois')
    expect(libelleMois(12)).toBe('1 an')
    expect(libelleMois(26)).toBe('2 ans et 2 mois')
  })
})

describe('les listes à cocher', () => {
  it('compte ce qui est coché et encourage', () => {
    expect(progressionListe([false, false])).toMatchObject({ faits: 0, message: 'Coche ce que tu fais déjà.' })
    expect(progressionListe([true, false, false])).toMatchObject({ faits: 1, message: 'Bon début.' })
    expect(progressionListe([true, true, false])).toMatchObject({ message: 'Plus de la moitié, continue.' })
    expect(progressionListe([true, true])).toMatchObject({ ratio: 1, message: 'Tout est coché : bravo !' })
  })

  it('relit un état enregistré à la bonne longueur, quoi qu’on trouve', () => {
    expect(lireCoches([true, 'oui', true], 4)).toEqual([true, false, true, false])
    expect(lireCoches(null, 2)).toEqual([false, false])
  })
})

describe('le planning', () => {
  const activites = ['Exercices', 'Repos']

  it('ne garde que des activités de la liste, dans une grille de la bonne taille', () => {
    const grille = lireGrille([['Exercices', 'Pirater le Pentagone'], 'x'], 3, 2, activites)
    expect(grille).toEqual([
      ['Exercices', ''],
      ['', ''],
      ['', ''],
    ])
    expect(remplissageGrille(grille)).toEqual({ remplis: 1, total: 6 })
  })
})
