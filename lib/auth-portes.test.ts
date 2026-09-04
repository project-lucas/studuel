import { describe, expect, it } from 'vitest'
import {
  AUCUNE_PORTE_OAUTH,
  auMoinsUnePorteOAuth,
  cheminInterne,
  destinationApresConnexion,
  portesOAuthDepuisSettings,
} from '@/lib/auth-portes'

describe('portesOAuthDepuisSettings', () => {
  it('ne montre une porte que si Supabase la déclare activée', () => {
    const portes = portesOAuthDepuisSettings({
      external: { google: true, apple: false, email: true },
    })
    expect(portes).toEqual({ google: true, apple: false })
  })

  it('ferme tout quand la réponse est absente ou mal formée', () => {
    expect(portesOAuthDepuisSettings(null)).toEqual(AUCUNE_PORTE_OAUTH)
    expect(portesOAuthDepuisSettings('oops')).toEqual(AUCUNE_PORTE_OAUTH)
    expect(portesOAuthDepuisSettings({})).toEqual(AUCUNE_PORTE_OAUTH)
    expect(portesOAuthDepuisSettings({ external: 'non' })).toEqual(
      AUCUNE_PORTE_OAUTH,
    )
  })

  it('exige un vrai `true` — une chaîne ou un 1 ne suffit pas', () => {
    expect(
      portesOAuthDepuisSettings({ external: { google: 'true', apple: 1 } }),
    ).toEqual(AUCUNE_PORTE_OAUTH)
  })

  it('sait dire si au moins une porte est ouverte', () => {
    expect(auMoinsUnePorteOAuth(AUCUNE_PORTE_OAUTH)).toBe(false)
    expect(auMoinsUnePorteOAuth({ google: false, apple: true })).toBe(true)
  })
})

describe('destinationApresConnexion', () => {
  it('envoie un parent dans son espace, quoi qu’il en soit de l’onboarding', () => {
    expect(
      destinationApresConnexion({ profile_type: 'parent', onboarded: false }),
    ).toBe('/parents')
    expect(
      destinationApresConnexion({ profile_type: 'parent', onboarded: true }),
    ).toBe('/parents')
  })

  it('envoie un élève configuré dans l’arène', () => {
    expect(
      destinationApresConnexion({ profile_type: 'eleve', onboarded: true }),
    ).toBe('/defi')
  })

  it('envoie un compte jamais configuré — ou sans profil — à l’onboarding', () => {
    expect(destinationApresConnexion({ onboarded: false })).toBe('/onboarding')
    expect(destinationApresConnexion({ onboarded: null })).toBe('/onboarding')
    expect(destinationApresConnexion(null)).toBe('/onboarding')
  })
})

describe('cheminInterne', () => {
  it('garde un chemin relatif à la racine', () => {
    expect(cheminInterne('/login/suite')).toBe('/login/suite')
    expect(cheminInterne('/bienvenue?finish=1')).toBe('/bienvenue?finish=1')
  })

  it('refuse tout ce qui pourrait sortir du site', () => {
    expect(cheminInterne('//evil.example')).toBe('/')
    expect(cheminInterne('https://evil.example')).toBe('/')
    expect(cheminInterne('')).toBe('/')
    expect(cheminInterne(null)).toBe('/')
  })
})
