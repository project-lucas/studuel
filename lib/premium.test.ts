import { describe, it, expect } from 'vitest'
import {
  PLANS,
  formatPrice,
  pricePerMember,
  planForTier,
  isCurrentPlan,
} from '@/lib/premium'

describe('PLANS (intégrité du catalogue)', () => {
  it('propose exactement les trois offres attendues', () => {
    expect(PLANS.map((p) => p.id)).toEqual(['gratuit', 'plus', 'famille'])
  })

  it('met en avant une seule offre', () => {
    expect(PLANS.filter((p) => p.recommended)).toHaveLength(1)
  })

  it('respecte le socle demandé : Famille couvre 3 membres', () => {
    const famille = PLANS.find((p) => p.id === 'famille')!
    expect(famille.members).toBe(3)
    expect(famille.priceMonthly).toBeGreaterThan(0)
  })

  it('le gratuit est le seul avec pubs et à 0 €', () => {
    const withAds = PLANS.filter((p) => p.withAds)
    expect(withAds.map((p) => p.id)).toEqual(['gratuit'])
    expect(PLANS.find((p) => p.id === 'gratuit')!.priceMonthly).toBe(0)
  })

  it('le gratuit ne promet aucun « illimité » (réservé au payant)', () => {
    for (const plan of PLANS) {
      const unlimited = plan.features.some((f) => /illimité/i.test(f))
      if (unlimited) expect(plan.priceMonthly).toBeGreaterThan(0)
    }
    const gratuit = PLANS.find((p) => p.id === 'gratuit')!
    expect(gratuit.features.some((f) => /illimité/i.test(f))).toBe(false)
  })
})

describe('formatPrice', () => {
  it('formate en euros avec virgule française', () => {
    expect(formatPrice(4.99)).toBe('4,99 €')
    expect(formatPrice(9.99)).toBe('9,99 €')
  })

  it('affiche « Gratuit » à 0 (ou moins)', () => {
    expect(formatPrice(0)).toBe('Gratuit')
    expect(formatPrice(-1)).toBe('Gratuit')
  })
})

describe('pricePerMember', () => {
  it('divise le prix par le nombre de membres', () => {
    const famille = PLANS.find((p) => p.id === 'famille')!
    expect(pricePerMember(famille)).toBeCloseTo(famille.priceMonthly / 3)
  })

  it('ne divise jamais par zéro', () => {
    expect(pricePerMember({ ...PLANS[1], members: 0 })).toBe(PLANS[1].priceMonthly)
  })
})

describe('planForTier / isCurrentPlan', () => {
  it('mappe chaque niveau vers son offre', () => {
    expect(planForTier('anonymous')).toBe('gratuit')
    expect(planForTier('free')).toBe('gratuit')
    expect(planForTier('tier1')).toBe('plus')
    expect(planForTier('tier2')).toBe('plus')
    expect(planForTier('tier3')).toBe('famille')
  })

  it('reconnaît le plan courant de l’élève', () => {
    expect(isCurrentPlan('plus', 'tier1')).toBe(true)
    expect(isCurrentPlan('gratuit', 'tier1')).toBe(false)
    expect(isCurrentPlan('gratuit', 'anonymous')).toBe(true)
  })
})
