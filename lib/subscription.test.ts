import { describe, it, expect } from 'vitest'
import {
  canAccessPremiumTests,
  canAccessMindMaps,
  type Tier,
} from '@/lib/subscription'

const PREMIUM: Tier[] = ['tier1', 'tier2', 'tier3']
const NON_PREMIUM: Tier[] = ['anonymous', 'free']

describe('canAccessPremiumTests', () => {
  it('débloqué à partir de l’Offre 1 (tier1+)', () => {
    for (const tier of PREMIUM) expect(canAccessPremiumTests(tier)).toBe(true)
  })

  it('bloqué pour les visiteurs et les comptes gratuits', () => {
    for (const tier of NON_PREMIUM) {
      expect(canAccessPremiumTests(tier)).toBe(false)
    }
  })
})

describe('canAccessMindMaps', () => {
  it('réservé aux abonnés (Offre 1+)', () => {
    for (const tier of PREMIUM) expect(canAccessMindMaps(tier)).toBe(true)
  })

  it('inaccessible en gratuit ou anonyme', () => {
    for (const tier of NON_PREMIUM) expect(canAccessMindMaps(tier)).toBe(false)
  })
})
