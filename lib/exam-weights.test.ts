import { describe, it, expect } from 'vitest'
import { weightsForGrade, weightsAreComparable } from '@/lib/exam-weights'

// LES POIDS D'ÉPREUVE.
//
// Ce que ces tests gardent : les barèmes officiels tels qu'ils sont publiés, et
// surtout les trois cas où une erreur ne se verrait PAS à l'écran — le niveau
// sans épreuve, le niveau à épreuve unique, et la terminale où aucune matière
// ne pèse zéro.

describe('weightsForGrade — brevet', () => {
  const brevet = weightsForGrade('3e')

  it('rend les cinq matières écrites avec leurs points', () => {
    expect(brevet).toEqual({
      francais: 100,
      maths: 100,
      'histoire-geo': 50,
      svt: 25,
      'physique-chimie': 25,
    })
  })

  it('partage les 50 points de Sciences entre SVT et physique-chimie', () => {
    // L'élève ne sait pas laquelle des deux tombera : lui en afficher une à 50
    // et l'autre à 0 l'enverrait réviser la mauvaise.
    expect(brevet.svt).toBe(brevet['physique-chimie'])
    expect(brevet.svt + brevet['physique-chimie']).toBe(50)
  })

  it('n’inclut ni l’oral ni le contrôle continu', () => {
    const total = Object.values(brevet).reduce((s, p) => s + p, 0)
    expect(total).toBe(300)
  })
})

describe('weightsForGrade — les autres niveaux', () => {
  it('1re : le français seul, et la comparaison devient impossible', () => {
    expect(weightsForGrade('1re')).toEqual({ francais: 10 })
    expect(weightsAreComparable(weightsForGrade('1re'))).toBe(false)
    expect(weightsForGrade('1re techno')).toEqual({ francais: 10 })
  })

  it('6e à 2de : aucune épreuve, table vide — et c’est un cas normal', () => {
    for (const grade of ['6e', '5e', '4e', '2de']) {
      expect(weightsForGrade(grade), grade).toEqual({})
      expect(weightsAreComparable(weightsForGrade(grade)), grade).toBe(false)
    }
  })

  it('Terminale : la spécialité pèse le double de la philo, et RIEN ne pèse zéro', () => {
    const tle = weightsForGrade('Terminale', [
      { slug: 'maths', category: 'specialite' },
      { slug: 'nsi', category: 'specialite' },
      { slug: 'histoire-geo', category: 'tronc_commun' },
      { slug: 'anglais', category: 'tronc_commun' },
    ])
    expect(tle.maths).toBe(16)
    expect(tle.nsi).toBe(16)
    expect(tle.philosophie).toBe(8)
    expect(tle['grand-oral']).toBe(10)
    // Le contrôle continu vaut 40 % du bac : ces matières comptent, moins.
    expect(tle['histoire-geo']).toBeGreaterThan(0)
    expect(tle['histoire-geo']).toBeLessThan(tle.philosophie)
    expect(weightsAreComparable(tle)).toBe(true)
  })

  it('Terminale : philo et grand oral gardent leur coefficient propre', () => {
    // Même si le profil les renvoie comme des matières ordinaires, elles ne
    // doivent PAS retomber sur le poids du contrôle continu.
    const tle = weightsForGrade('Terminale', [
      { slug: 'philosophie', category: 'tronc_commun' },
      { slug: 'grand-oral', category: 'tronc_commun' },
    ])
    expect(tle.philosophie).toBe(8)
    expect(tle['grand-oral']).toBe(10)
  })
})
