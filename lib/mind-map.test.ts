import { describe, it, expect } from 'vitest'
import { mindMapDecoy } from './mind-map'
import type { MindMapData } from '@/lib/types'

const CARTE: MindMapData = {
  centre: 'Théorème de Pythagore',
  branches: [
    { titre: 'Énoncé', enfants: ['a² + b² = c²', 'triangle rectangle'] },
    { titre: 'Réciproque', enfants: ['prouver l’angle droit'] },
  ],
}

describe('mindMapDecoy', () => {
  it('ne laisse fuir AUCUN mot du contenu payant', () => {
    const decoy = mindMapDecoy(CARTE)

    // Le test qui compte : tout le texte rendu ne doit être que des points.
    const rendu = [
      decoy.centre,
      ...decoy.branches.flatMap((b) => [b.titre, ...b.enfants]),
    ].join(' ')
    expect(rendu).toMatch(/^[• ]+$/)
    expect(rendu).not.toContain('Pythagore')
    expect(rendu).not.toContain('triangle')
  })

  it('garde la silhouette de la carte (aperçu crédible)', () => {
    const decoy = mindMapDecoy(CARTE)

    expect(decoy.branches).toHaveLength(CARTE.branches.length)
    expect(decoy.branches[0].enfants).toHaveLength(2)
    expect(decoy.branches[1].enfants).toHaveLength(1)
  })

  it('borne les cartes très longues', () => {
    const enorme: MindMapData = {
      centre: 'x'.repeat(200),
      branches: Array.from({ length: 20 }, () => ({
        titre: 'y'.repeat(80),
        enfants: Array.from({ length: 20 }, () => 'z'.repeat(200)),
      })),
    }

    const decoy = mindMapDecoy(enorme)

    expect(decoy.centre.length).toBeLessThanOrEqual(14)
    expect(decoy.branches.length).toBeLessThanOrEqual(6)
    expect(decoy.branches[0].enfants.length).toBeLessThanOrEqual(4)
    expect(decoy.branches[0].enfants[0].length).toBeLessThanOrEqual(18)
  })

  it('reste lisible sur une carte vide ou minuscule', () => {
    const mini: MindMapData = { centre: '', branches: [{ titre: '', enfants: [''] }] }

    const decoy = mindMapDecoy(mini)

    // Des longueurs minimales, sinon l'aperçu serait vide et l'offre invisible.
    expect(decoy.centre.length).toBeGreaterThanOrEqual(3)
    expect(decoy.branches[0].titre.length).toBeGreaterThanOrEqual(4)
    expect(decoy.branches[0].enfants[0].length).toBeGreaterThanOrEqual(6)
  })
})
