import { describe, expect, it } from 'vitest'
import {
  BIG_TILES,
  TARGET_MAX,
  TARGET_MIN,
  TILE_COUNT,
  applyOp,
  buildComptePool,
  buildPuzzle,
  type CountdownPuzzle,
} from '@/lib/jeux/compte-est-bon'

describe('applyOp', () => {
  it('additionne et multiplie normalement', () => {
    expect(applyOp(7, '+', 5)).toBe(12)
    expect(applyOp(7, '×', 5)).toBe(35)
  })

  it('refuse une soustraction négative ou nulle', () => {
    expect(applyOp(3, '−', 5)).toBeNull()
    expect(applyOp(5, '−', 5)).toBeNull()
  })

  it('refuse une division inexacte, par zéro, ou par un', () => {
    expect(applyOp(7, '÷', 2)).toBeNull()
    expect(applyOp(7, '÷', 0)).toBeNull()
    expect(applyOp(7, '÷', 1)).toBeNull()
    expect(applyOp(100, '÷', 4)).toBe(25)
  })

  it('refuse les opérations neutres qui gaspillent une plaque', () => {
    expect(applyOp(9, '×', 1)).toBeNull()
    expect(applyOp(1, '×', 9)).toBeNull()
  })

  it('accepte une division qui tombe juste sur un résultat > 1', () => {
    expect(applyOp(50, '÷', 25)).toBe(2)
    // …mais pas celle qui rendrait 1, sans intérêt dans le jeu.
    expect(applyOp(25, '÷', 25)).toBeNull()
  })
})

// Rejoue la solution de référence sur les plaques du tirage : chaque étape doit
// consommer deux valeurs RÉELLEMENT disponibles et produire le bon résultat.
// C'est le test qui garantit qu'aucun « compte » impossible n'est servi.
function replay(puzzle: CountdownPuzzle): number {
  const pool = [...puzzle.tiles]
  for (const step of puzzle.solution) {
    const i = pool.indexOf(step.a)
    expect(i, `plaque ${step.a} indisponible`).toBeGreaterThanOrEqual(0)
    pool.splice(i, 1)
    const j = pool.indexOf(step.b)
    expect(j, `plaque ${step.b} indisponible`).toBeGreaterThanOrEqual(0)
    pool.splice(j, 1)
    expect(applyOp(step.a, step.op, step.b)).toBe(step.result)
    pool.push(step.result)
  }
  return puzzle.solution[puzzle.solution.length - 1].result
}

describe('buildComptePool', () => {
  const pool = buildComptePool('graine', 12)

  it('sert exactement le nombre de tirages demandé', () => {
    expect(pool).toHaveLength(12)
  })

  it('donne toujours six plaques, dont au moins une grosse', () => {
    for (const p of pool) {
      expect(p.tiles).toHaveLength(TILE_COUNT)
      expect(p.tiles.some((t) => BIG_TILES.includes(t))).toBe(true)
      for (const t of p.tiles) expect(t).toBeGreaterThan(0)
    }
  })

  it('garde la cible dans des bornes jouables', () => {
    for (const p of pool) {
      expect(p.target).toBeGreaterThanOrEqual(TARGET_MIN)
      expect(p.target).toBeLessThanOrEqual(TARGET_MAX)
      expect(Number.isInteger(p.target)).toBe(true)
    }
  })

  it('ne sert QUE des tirages solvables (solution rejouable)', () => {
    for (const p of pool) {
      expect(replay(p), `« ${p.id} » n'atteint pas sa cible`).toBe(p.target)
    }
  })

  it('demande au moins deux opérations (jamais un compte trivial)', () => {
    for (const p of pool) {
      expect(p.solution.length).toBeGreaterThanOrEqual(2)
      expect(p.solution.length).toBeLessThanOrEqual(5)
    }
  })

  it('est déterministe : même graine, mêmes tirages', () => {
    expect(buildComptePool('graine', 5)).toEqual(buildComptePool('graine', 5))
  })

  it('varie d’une graine à l’autre', () => {
    expect(buildComptePool('a', 5)).not.toEqual(buildComptePool('b', 5))
  })

  it('donne un id unique à chaque tirage', () => {
    expect(new Set(pool.map((p) => p.id)).size).toBe(pool.length)
  })

  it('reste productif sur beaucoup de graines (pas de famine)', () => {
    // La génération peut échouer par graine ; la boucle doit malgré tout
    // aboutir. Si ce test devient lent ou incomplet, c'est que les bornes de
    // la cible sont devenues trop étroites.
    for (const seed of ['x', 'y', 'z', 'seed-4', 'seed-5']) {
      expect(buildComptePool(seed, 8)).toHaveLength(8)
    }
  })
})

describe('buildPuzzle', () => {
  it('renvoie null plutôt qu’un tirage bancal quand la marche échoue', () => {
    // On balaie des graines : au moins une doit échouer, sinon la garde `null`
    // n'est jamais exercée en vrai et le repli de buildComptePool est illusoire.
    const results = Array.from({ length: 60 }, (_, i) =>
      buildPuzzle('t', `echec-${i}`),
    )
    expect(results.some((r) => r === null)).toBe(true)
    expect(results.some((r) => r !== null)).toBe(true)
  })
})
