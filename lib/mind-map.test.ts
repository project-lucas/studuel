import { describe, it, expect } from 'vitest'
import { mindMapPlaceholder } from './mind-map'

describe('mindMapPlaceholder', () => {
  it('ne contient que des points (aucun mot ne peut fuir)', () => {
    const carte = mindMapPlaceholder()

    const rendu = [
      carte.centre,
      ...carte.branches.flatMap((b) => [b.titre, ...b.enfants]),
    ].join(' ')
    expect(rendu).toMatch(/^[• ]+$/)
  })

  it('ne dépend PAS de la vraie carte (aucun paramètre à lui donner)', () => {
    // Le point de sécurité : la page peut afficher l'aperçu sans jamais avoir
    // chargé le contenu payant. Deux appels donnent donc la même silhouette.
    expect(mindMapPlaceholder()).toEqual(mindMapPlaceholder())
  })

  it('garde une silhouette crédible une fois floutée', () => {
    const carte = mindMapPlaceholder()

    expect(carte.centre.length).toBeGreaterThanOrEqual(3)
    expect(carte.branches.length).toBeGreaterThanOrEqual(3)
    for (const branche of carte.branches) {
      expect(branche.titre.length).toBeGreaterThanOrEqual(4)
      expect(branche.enfants.length).toBeGreaterThanOrEqual(2)
    }
  })
})
