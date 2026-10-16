import { describe, expect, it } from 'vitest'
import { accesAnnale, annalesGratuites, marquerReservees, phraseAnnales } from './acces'
import { annalesParAnnee } from './apercu'
import { ANNALES_CORRIGEES } from './registre'

const a = (id: string, annee: number, centre: string, matiere = 'svt', niveau: 'Tle' | '1re' = 'Tle') => ({
  id,
  matiere,
  niveau,
  annee,
  centre,
  jour: null,
})

describe('qui lit quelle annale', () => {
  const liste = [a('svt-2023', 2023, 'Métropole'), a('svt-2025-am', 2025, 'Amérique du Nord'), a('svt-2025-me', 2025, 'Métropole'), a('svt-2024', 2024, 'Asie'), a('philo-2025', 2025, 'Métropole', 'philosophie')]

  it('offre au gratuit les deux plus récentes de chaque matière', () => {
    expect([...annalesGratuites(liste, 'svt', 'Tle')]).toEqual(['svt-2025-am', 'svt-2025-me'])
    expect([...annalesGratuites(liste, 'philosophie', 'Tle')]).toEqual(['philo-2025'])
  })

  it('réserve le reste à Studuel+', () => {
    expect(accesAnnale(liste[0], false, liste)).toBe('plus')
    expect(accesAnnale(liste[1], false, liste)).toBe('libre')
    expect(accesAnnale(liste[0], true, liste)).toBe('libre')
  })

  it('pose la couronne sur les annales réservées, et seulement pour le gratuit', () => {
    const groupes = annalesParAnnee(ANNALES_CORRIGEES, 'svt', 'Tle')
    const marquees = marquerReservees(groupes, ANNALES_CORRIGEES, 'svt', 'Tle', false).flatMap((g) => g.annales)
    expect(marquees.filter((a) => !a.reservee)).toHaveLength(2)
    expect(marquees.slice(0, 2).every((a) => !a.reservee)).toBe(true)
    const abonne = marquerReservees(groupes, ANNALES_CORRIGEES, 'svt', 'Tle', true).flatMap((g) => g.annales)
    expect(abonne.every((a) => !a.reservee)).toBe(true)
  })

  it('le dit en une ligne', () => {
    expect(phraseAnnales(7, false)).toBe('2 offertes sur 7 · toutes avec Studuel+')
    expect(phraseAnnales(7, true)).toBe('7 annales corrigées')
    expect(phraseAnnales(1, false)).toBe('1 annale corrigée')
  })

  it('laisse au moins une annale gratuite dans chaque matière du registre', () => {
    const paires = new Set(ANNALES_CORRIGEES.map((x) => `${x.matiere}|${x.niveau}`))
    for (const p of paires) {
      const [matiere, niveau] = p.split('|')
      expect(annalesGratuites(ANNALES_CORRIGEES, matiere, niveau).size).toBeGreaterThan(0)
    }
  })
})
