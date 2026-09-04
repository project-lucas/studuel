import { describe, it, expect } from 'vitest'
import {
  isHudAccountHidden,
  isHudDataSkipped,
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
    for (const path of ['/', '/defi', '/reviser', '/amis', '/coffre']) {
      expect(isHudHidden(path), path).toBe(false)
    }
  })

  it('le masque sur l’onglet Moi, dont la carte porte déjà tous ses chiffres', () => {
    expect(isHudHidden('/moi')).toBe(true)
    // Le vestiaire et les habitudes n'ont pas la carte : ils gardent le bandeau.
    expect(isHudHidden('/moi/avatar')).toBe(false)
    expect(isHudHidden('/moi/habitudes')).toBe(false)
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
  it('retire l’engrenage PARTOUT pour un élève connecté', () => {
    // Les réglages n'ont plus qu'une porte : la carte de profil de l'onglet
    // Moi. Le bandeau est une rangée d'objets `shrink-0` — le carré de 44 px
    // de l'engrenage se payait sur la pastille de niveau, seule élastique.
    for (const path of ['/', '/moi', '/reviser', '/amis', '/tresor', '/defi/jouer']) {
      expect(isHudAccountHidden(path, true), path).toBe(true)
    }
  })

  it('LAISSE au visiteur son bouton — ce n’est pas un engrenage', () => {
    // Chez qui n'a pas de compte, cette case affiche « Se connecter » : c'est
    // la seule porte d'entrée du bandeau. La règle porte sur les RÉGLAGES.
    for (const path of ['/', '/moi', '/reviser', '/defi/jouer']) {
      expect(isHudAccountHidden(path, false), path).toBe(false)
    }
  })

  it('replie la case sur l’arène même pour un visiteur (le menu a la sienne)', () => {
    expect(isHudAccountHidden('/defi', false)).toBe(true)
    expect(isHudAccountHidden('/defi', true)).toBe(true)
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

describe('isHudDataSkipped', () => {
  it('autorise le saut des requêtes sur l’onboarding', () => {
    expect(isHudDataSkipped('/bienvenue')).toBe(true)
    expect(isHudDataSkipped('/bienvenue/3')).toBe(true)
  })

  it('le REFUSE sur une session de quiz, même si le bandeau y est masqué', () => {
    // Le chargeur est SERVEUR et le layout racine n'est pas re-rendu en
    // navigation client : sauter les requêtes ici supprimerait le bandeau pour
    // toute la session, y compris après la sortie du quiz. C'est le sens de
    // l'écart entre les deux verdicts — ne pas « simplifier » en les fusionnant.
    expect(isHudHidden('/test/abc-123')).toBe(true)
    expect(isHudDataSkipped('/test/abc-123')).toBe(false)
  })
})
