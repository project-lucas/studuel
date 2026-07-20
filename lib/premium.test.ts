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

  it('le gratuit est à 0 €', () => {
    expect(PLANS.find((p) => p.id === 'gratuit')!.priceMonthly).toBe(0)
  })

  // Garde anti-promesse-creuse : l'app n'a AUCUN système de publicité. Tant
  // que ce sera le cas, aucune offre ne doit s'en prévaloir — ni en promettant
  // de la retirer, ni en prêtant au gratuit un défaut qu'il n'a pas.
  it('aucune offre ne parle de publicité', () => {
    for (const plan of PLANS) {
      for (const feature of plan.features) {
        expect(feature).not.toMatch(/publicit|pubs?\b/i)
      }
      expect(plan.tagline).not.toMatch(/publicit|pubs?\b/i)
    }
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
