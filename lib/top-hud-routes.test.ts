import { describe, it, expect } from 'vitest'
import { isHudHidden } from './top-hud-routes'

describe('isHudHidden', () => {
  it('masque le bandeau sur le parcours d’accueil', () => {
    expect(isHudHidden('/bienvenue')).toBe(true)
    expect(isHudHidden('/bienvenue/etape-3')).toBe(true)
  })

  it('affiche le bandeau sur les onglets de l’app', () => {
    for (const path of ['/', '/moi', '/defi', '/reviser', '/amis', '/coffre']) {
      expect(isHudHidden(path), path).toBe(false)
    }
  })

  it('ne masque pas une route qui commence par le même mot', () => {
    // Garde-fou : `startsWith('/bienvenue')` seul masquerait aussi celle-ci.
    expect(isHudHidden('/bienvenue-parents')).toBe(false)
  })
})
