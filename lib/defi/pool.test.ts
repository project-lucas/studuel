import { describe, it, expect } from 'vitest'
import { composePool, isHorsNiveau, MAX_HORS_NIVEAU_IN_POOL } from './pool'

const prog = (n: number) =>
  Array.from({ length: n }, (_, i) => ({ id: `p${i}`, grade_level: '6e' }))
const culture = (n: number) =>
  Array.from({ length: n }, (_, i) => ({ id: `c${i}`, grade_level: 'tous' }))

describe('isHorsNiveau', () => {
  it('reconnaît le contenu hors-programme', () => {
    expect(isHorsNiveau({ grade_level: 'tous' })).toBe(true)
    expect(isHorsNiveau({ grade_level: '6e' })).toBe(false)
    expect(isHorsNiveau({ grade_level: null })).toBe(false)
  })
})

describe('composePool', () => {
  it('laisse au plus UN quiz hors-programme entrer dans le vivier', () => {
    // Le cas qui motive tout : 17 quiz de culture générale sont, comme les
    // chapitres jamais travaillés, en tête de classement. Sans plafond ils
    // rempliraient le vivier et l'élève ne réviserait plus son programme.
    const pool = composePool([...culture(17), ...prog(10)], 8)

    expect(pool.filter(isHorsNiveau)).toHaveLength(MAX_HORS_NIVEAU_IN_POOL)
    expect(pool.filter((q) => !isHorsNiveau(q))).toHaveLength(7)
  })

  it('garde l’ordre de priorité du programme', () => {
    const pool = composePool([...prog(10), ...culture(3)], 4)

    expect(pool.slice(0, 3).map((q) => q.id)).toEqual(['p0', 'p1', 'p2'])
  })

  it('n’invente rien quand il n’y a pas de hors-programme', () => {
    const pool = composePool(prog(10), 8)

    expect(pool).toHaveLength(8)
    expect(pool.every((q) => !isHorsNiveau(q))).toBe(true)
  })

  it('accepte un vivier plus petit que la taille demandée', () => {
    expect(composePool(prog(3), 8)).toHaveLength(3)
    expect(composePool([], 8)).toEqual([])
  })

  it('avec maxBonus = 0, le hors-programme est totalement écarté', () => {
    // C'est ce qu'on veut pour le défi du jour : il porte le programme.
    const pool = composePool([...culture(5), ...prog(5)], 2, 0)

    expect(pool.every((q) => !isHorsNiveau(q))).toBe(true)
  })

  it('ne dépasse jamais la taille demandée', () => {
    expect(composePool([...culture(9), ...prog(9)], 5)).toHaveLength(5)
  })
})
