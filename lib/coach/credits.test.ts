import { describe, expect, it } from 'vitest'
import {
  CAFES_MENSUELS,
  COUT_AVATAR,
  COUT_QUESTION,
  CREDITS_MENSUELS,
  PHRASE_CAFES_GRATUIT,
  cafesMensuels,
  creditsMensuels,
  debutDuMois,
  etatCredits,
  motCafes,
  motCredits,
  phraseSoldeCafes,
} from './credits'

describe('les cafés mensuels de Marcel', () => {
  it('donne 200 cafés à un abonné, rien au gratuit', () => {
    expect(cafesMensuels('tier1')).toBe(CAFES_MENSUELS)
    expect(cafesMensuels('free')).toBe(0)
  })

  it('garde les anciens noms en alias, pour ne rien casser ailleurs', () => {
    expect(CREDITS_MENSUELS).toBe(CAFES_MENSUELS)
    expect(creditsMensuels).toBe(cafesMensuels)
    expect(motCredits).toBe(motCafes)
  })

  it('compte ce qui reste, et combien d’avatars ça paie', () => {
    const e = etatCredits({ tier: 'tier1', depenses: 30, jetons: 4 })
    expect(e).toEqual({ abonne: true, mensuels: 200, depenses: 30, restants: 170, jetons: 4, avatarsPossibles: 6 })
    expect(etatCredits({ tier: 'tier1', depenses: 190, jetons: 0 }).avatarsPossibles).toBe(0)
    expect(etatCredits({ tier: 'free', depenses: 0, jetons: 10 }).abonne).toBe(false)
  })

  it('ne descend jamais sous zéro', () => {
    expect(etatCredits({ tier: 'tier1', depenses: 500, jetons: -3 })).toMatchObject({ restants: 0, jetons: 0 })
  })

  it('un avatar coûte 25 cafés : 8 par mois au plus ; une demande, 1 café', () => {
    expect(COUT_AVATAR).toBe(25)
    expect(COUT_QUESTION).toBe(1)
    expect(Math.floor(CAFES_MENSUELS / COUT_AVATAR)).toBe(8)
  })

  it('range les cafés par mois UTC', () => {
    expect(debutDuMois(new Date('2026-09-24T15:00:00Z'))).toBe('2026-09-01')
    expect(debutDuMois(new Date('2026-12-31T23:59:59Z'))).toBe('2026-12-01')
    expect(debutDuMois(new Date('2027-01-01T00:00:00Z'))).toBe('2027-01-01')
  })

  it('accorde le mot, et ne dit jamais « crédit »', () => {
    expect(motCafes(1)).toBe('1 café')
    expect(motCafes(174)).toBe('174 cafés')
    expect(motCafes(0)).toBe('0 cafés')
    expect(motCafes(-2)).toBe('0 cafés')
    expect(motCafes(3.7)).toBe('3 cafés')
  })

  it('dit le solde et le barème en une phrase, pour la tête des outils', () => {
    expect(phraseSoldeCafes(174)).toBe('Il te reste 174 cafés · une demande = 1 café')
    expect(phraseSoldeCafes(1)).toBe('Il te reste 1 café · une demande = 1 café')
    expect(PHRASE_CAFES_GRATUIT).toBe('Studuel+ offre 200 cafés par mois')
    expect(`${phraseSoldeCafes(12)} ${PHRASE_CAFES_GRATUIT}`).not.toMatch(/cr[ée]dit/i)
  })
})
