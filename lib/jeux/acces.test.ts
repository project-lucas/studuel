import { describe, expect, it } from 'vitest'
import { SALONS } from '@/lib/jeux/catalog'
import { JEUX_LIBRES, jeuLibre, jeuOuvert } from './acces'

describe('l’accès aux jeux de salon', () => {
  it('ouvre UN jeu par matière en version gratuite : le premier jouable', () => {
    expect(JEUX_LIBRES.size).toBe(SALONS.length)
    for (const salon of SALONS) {
      const libres = salon.games.filter((g) => jeuLibre(g.id))
      expect(libres, salon.subject).toHaveLength(1)
      expect(libres[0].implemented).toBe(true)
      expect(libres[0].id).toBe(salon.games.find((g) => g.implemented)?.id)
    }
  })

  it('garde les autres jeux pour Studuel+', () => {
    expect(jeuLibre('capitales')).toBe(true)
    expect(jeuLibre('frise-folle')).toBe(false)
    expect(jeuOuvert('frise-folle', false)).toBe(false)
    expect(jeuOuvert('frise-folle', true)).toBe(true)
    expect(jeuOuvert('capitales', false)).toBe(true)
  })

  it('la version payante en a plus : chaque matière à plusieurs jeux en garde en réserve', () => {
    const jouables = SALONS.flatMap((s) => s.games.filter((g) => g.implemented))
    expect(jouables.filter((g) => jeuOuvert(g.id, true)).length).toBeGreaterThan(
      jouables.filter((g) => jeuOuvert(g.id, false)).length,
    )
  })

  it('un jeu inconnu n’est libre pour personne', () => {
    expect(jeuLibre('n’importe-quoi')).toBe(false)
    expect(jeuOuvert('n’importe-quoi', false)).toBe(false)
  })
})
