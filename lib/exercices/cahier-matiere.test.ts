import { describe, expect, it } from 'vitest'
import {
  construireCahierMatiere,
  type ChapitreSource,
  type ExerciceSource,
} from '@/lib/exercices/cahier-matiere'

const chapitres: ChapitreSource[] = [
  { id: 'c1', titre: 'Rimbaud', theme: 'La poésie' },
  { id: 'c2', titre: 'Ponge', theme: 'La poésie' },
  { id: 'c3', titre: 'Musset', theme: 'Le théâtre' },
  { id: 'c4', titre: 'Méthode du commentaire', theme: null },
]

/** Trois exercices (★, ★★, ★★★) par chapitre. */
const troisPar = (ids: string[]): ExerciceSource[] =>
  ids.flatMap((chapitreId) =>
    ([1, 2, 3] as const).map((position) => ({
      id: `${chapitreId}-${position}`,
      chapitreId,
      position,
      etoiles: position,
      titre: `Exercice ${position} de ${chapitreId}`,
    })),
  )

const cahier = (reussis: string[] = [], ids = ['c1', 'c2', 'c3', 'c4']) =>
  construireCahierMatiere({
    matiere: 'francais',
    chapitres,
    exercices: troisPar(ids),
    reussis: new Set(reussis),
  })

describe('construireCahierMatiere', () => {
  it('un manuel par thème, dans l’ordre du programme', () => {
    expect(cahier().manuels.map((m) => [m.titre, m.pages, m.chapitres])).toEqual([
      ['La poésie', 6, 2],
      ['Le théâtre', 3, 1],
      ['Méthode du commentaire', 3, 1],
    ])
    expect(cahier().total).toBe(12)
  })

  it('un cahier neuf : le marque-page est la première page', () => {
    expect(cahier().marque).toEqual({
      numero: 1,
      titre: 'Exercice 1 de c1',
      etoiles: 1,
      manuel: 'La poésie',
      href: '/reviser/francais/c1/exercice/1',
    })
  })

  it('le marque-page avance avec les exercices réussis', () => {
    const c = cahier(['c1-1', 'c1-2'])
    expect(c.reussis).toBe(2)
    expect(c.marque?.numero).toBe(3)
    expect(c.marque?.href).toBe('/reviser/francais/c1/exercice/3')
    expect(c.manuels[0].reussies).toBe(2)
  })

  it('un exercice verrouillé n’est jamais le marque-page : on passe au chapitre suivant', () => {
    // c1 fini ; dans c2 seul le premier est ouvert.
    const c = cahier(['c1-1', 'c1-2', 'c1-3'])
    expect(c.marque?.href).toBe('/reviser/francais/c2/exercice/1')
    expect(c.marque?.numero).toBe(4)
  })

  it('chaque manuel mène à SA première page à faire', () => {
    const c = cahier(['c3-1'])
    expect(c.manuels.map((m) => m.href)).toEqual([
      '/reviser/francais/c1/exercice/1',
      '/reviser/francais/c3/exercice/2',
      '/reviser/francais/c4/exercice/1',
    ])
  })

  it('un manuel fini garde l’adresse de sa première page', () => {
    const c = cahier(['c3-1', 'c3-2', 'c3-3'])
    expect(c.manuels[1]).toMatchObject({ reussies: 3, pages: 3, href: '/reviser/francais/c3/exercice/1' })
  })

  it('tout est réussi : plus de marque-page', () => {
    const tout = troisPar(['c1', 'c2', 'c3', 'c4']).map((e) => e.id)
    const c = cahier(tout)
    expect(c.marque).toBeNull()
    expect(c.reussis).toBe(c.total)
  })

  it('un chapitre sans exercice n’a pas de page, un thème sans page pas de manuel', () => {
    const c = cahier([], ['c1', 'c4'])
    expect(c.manuels.map((m) => m.titre)).toEqual(['La poésie', 'Méthode du commentaire'])
    expect(c.manuels[0]).toMatchObject({ pages: 3, chapitres: 1 })
  })

  it('une matière sans cahier rend un cahier vide', () => {
    expect(cahier([], [])).toEqual({ total: 0, reussis: 0, marque: null, manuels: [] })
  })
})
