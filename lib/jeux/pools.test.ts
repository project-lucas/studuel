import { describe, expect, it } from 'vitest'
import { POOL_BUILDERS, buildSalonPool } from './pools'
import { SALONS, playableSalonGame } from './catalog'

// Tous les ids de jeux marqués « implemented » dans le catalogue.
const implementedIds = SALONS.flatMap((s) =>
  s.games.filter((g) => g.implemented).map((g) => g.id),
)

describe('cohérence catalogue ↔ banques de questions', () => {
  it('chaque jeu jouable a une banque enregistrée (aucun cul-de-sac)', () => {
    for (const id of implementedIds) {
      expect(POOL_BUILDERS[id], `builder manquant pour « ${id} »`).toBeDefined()
    }
  })

  it('aucune banque orpheline (chaque builder cible un jeu implémenté)', () => {
    for (const id of Object.keys(POOL_BUILDERS)) {
      expect(implementedIds, `builder « ${id} » sans jeu implémenté`).toContain(id)
    }
  })

  it('playableSalonGame résout exactement les jeux ayant une banque', () => {
    for (const id of Object.keys(POOL_BUILDERS)) {
      expect(playableSalonGame(id)).not.toBeNull()
    }
  })
})

describe('buildSalonPool', () => {
  it('produit un pool non vide et bien formé pour chaque jeu jouable', () => {
    for (const id of implementedIds) {
      const pool = buildSalonPool(id, 'verif')
      expect(pool, `pool null pour « ${id} »`).not.toBeNull()
      // Assez de questions pour tenir un BO3 (jusqu'à 15 questions) sans
      // recyclage trop visible.
      expect(pool!.length).toBeGreaterThanOrEqual(10)
      for (const q of pool!) {
        expect(q.prompt.length).toBeGreaterThan(0)
        expect(q.options.length).toBeGreaterThanOrEqual(2)
        expect(q.correctIndex).toBeGreaterThanOrEqual(0)
        expect(q.correctIndex).toBeLessThan(q.options.length)
        expect(q.options[q.correctIndex]).toBeTruthy()
        expect(q.subject).toBeTruthy()
      }
    }
  })

  it('renvoie null pour un id sans banque', () => {
    expect(buildSalonPool('frise-folle', 'x')).toBeNull()
    expect(buildSalonPool('nimporte-quoi', 'x')).toBeNull()
  })
})
