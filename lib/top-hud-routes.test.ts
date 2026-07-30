import { describe, it, expect } from 'vitest'
import {
  isHudAccountHidden,
  isHudHidden,
  isHudLevelHidden,
  isHudOverDarkScene,
} from './top-hud-routes'

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

describe('isHudLevelHidden', () => {
  it('replie la pastille niveau sur l’écran d’arène uniquement', () => {
    expect(isHudLevelHidden('/defi')).toBe(true)
  })

  it('la garde partout ailleurs, y compris les sous-pages du Défi', () => {
    for (const path of ['/', '/moi', '/reviser', '/defi/jouer', '/defi/duel']) {
      expect(isHudLevelHidden(path), path).toBe(false)
    }
  })
})

describe('isHudAccountHidden', () => {
  it('replie l’engrenage sur l’arène (il vit dans le burger)', () => {
    expect(isHudAccountHidden('/defi')).toBe(true)
  })

  it('le garde partout ailleurs, y compris les sous-pages du Défi', () => {
    for (const path of ['/', '/moi', '/reviser', '/defi/jouer', '/defi/duel']) {
      expect(isHudAccountHidden(path), path).toBe(false)
    }
  })
})

describe('isHudOverDarkScene', () => {
  it('reconnaît l’arène et ses salles de jeu', () => {
    for (const path of ['/defi', '/defi/jouer', '/defi/duel/abc']) {
      expect(isHudOverDarkScene(path), path).toBe(true)
    }
  })

  it('laisse le bandeau crème sur les onglets à fond clair', () => {
    for (const path of ['/', '/moi', '/reviser', '/amis', '/tresor']) {
      expect(isHudOverDarkScene(path), path).toBe(false)
    }
  })

  it('ne confond pas une route qui commence par le même mot', () => {
    expect(isHudOverDarkScene('/defis-du-mois')).toBe(false)
  })
})
