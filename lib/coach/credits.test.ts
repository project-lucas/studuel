import { describe, expect, it } from 'vitest'
import {
  COUT_AVATAR,
  CREDITS_MENSUELS,
  creditsMensuels,
  debutDuMois,
  etatCredits,
  motCredits,
} from './credits'

describe('les crédits mensuels de Marcel', () => {
  it('donne 200 crédits à un abonné, rien au gratuit', () => {
    expect(creditsMensuels('tier1')).toBe(CREDITS_MENSUELS)
    expect(creditsMensuels('free')).toBe(0)
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

  it('un avatar coûte 25 crédits : 8 par mois au plus', () => {
    expect(COUT_AVATAR).toBe(25)
    expect(Math.floor(CREDITS_MENSUELS / COUT_AVATAR)).toBe(8)
  })

  it('range les crédits par mois UTC', () => {
    expect(debutDuMois(new Date('2026-09-24T15:00:00Z'))).toBe('2026-09-01')
    expect(debutDuMois(new Date('2026-12-31T23:59:59Z'))).toBe('2026-12-01')
    expect(debutDuMois(new Date('2027-01-01T00:00:00Z'))).toBe('2027-01-01')
  })

  it('accorde le mot', () => {
    expect(motCredits(1)).toBe('1 crédit')
    expect(motCredits(175)).toBe('175 crédits')
  })
})
