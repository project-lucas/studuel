import { describe, it, expect } from 'vitest'
import {
  rankFor,
  divisionRoman,
  tierFloor,
  nextTier,
  RANK_TIERS,
  DIVISION_SPAN,
  DIVISIONS_PER_TIER,
  APEX_FLOOR,
} from './rank'

describe('divisionRoman', () => {
  it('mappe les index 0..3 vers IV, III, II, I (on gravit de IV vers I)', () => {
    expect(divisionRoman(0)).toBe('IV')
    expect(divisionRoman(1)).toBe('III')
    expect(divisionRoman(2)).toBe('II')
    expect(divisionRoman(3)).toBe('I')
  })

  it('borne les index hors plage', () => {
    expect(divisionRoman(-5)).toBe('IV')
    expect(divisionRoman(99)).toBe('I')
    expect(divisionRoman(1.9)).toBe('III') // tronqué à 1
  })
})

describe('constantes de barème', () => {
  it('le sommet démarre après tous les paliers à divisions', () => {
    // 5 paliers à divisions × 4 × 100 = 2000
    expect(APEX_FLOOR).toBe(5 * DIVISIONS_PER_TIER * DIVISION_SPAN)
    expect(APEX_FLOOR).toBe(2000)
  })

  it('a bien 6 paliers, le dernier sans divisions', () => {
    expect(RANK_TIERS).toHaveLength(6)
    expect(RANK_TIERS[RANK_TIERS.length - 1].id).toBe('maitre')
    expect(RANK_TIERS[RANK_TIERS.length - 1].hasDivisions).toBe(false)
    expect(RANK_TIERS.slice(0, 5).every((t) => t.hasDivisions)).toBe(true)
  })
})

describe('rankFor — divisions', () => {
  it('0 trophée = Bronze IV, en bas de la division', () => {
    const r = rankFor(0)
    expect(r.tier.id).toBe('bronze')
    expect(r.roman).toBe('IV')
    expect(r.label).toBe('Bronze IV')
    expect(r.divisionIndex).toBe(0)
    expect(r.progress).toBe(0)
    expect(r.inDivision).toBe(0)
    expect(r.toNext).toBe(DIVISION_SPAN)
    expect(r.floor).toBe(0)
    expect(r.ceiling).toBe(100)
  })

  it('milieu de division : progression et restes cohérents', () => {
    const r = rankFor(50)
    expect(r.label).toBe('Bronze IV')
    expect(r.inDivision).toBe(50)
    expect(r.progress).toBeCloseTo(0.5)
    expect(r.toNext).toBe(50)
  })

  it('99 reste en Bronze IV, 100 passe en Bronze III', () => {
    expect(rankFor(99).label).toBe('Bronze IV')
    const r = rankFor(100)
    expect(r.label).toBe('Bronze III')
    expect(r.divisionIndex).toBe(1)
    expect(r.progress).toBe(0)
  })

  it('haut du palier Bronze : 399 = Bronze I', () => {
    const r = rankFor(399)
    expect(r.tier.id).toBe('bronze')
    expect(r.roman).toBe('I')
    expect(r.toNext).toBe(1) // 400 = palier suivant
  })

  it('changement de palier : 400 = Argent IV, 799 = Argent I', () => {
    expect(rankFor(400).label).toBe('Argent IV')
    expect(rankFor(799).label).toBe('Argent I')
  })

  it('paliers intermédiaires alignés sur des tranches de 400 trophées', () => {
    expect(rankFor(800).label).toBe('Or IV')
    expect(rankFor(1199).label).toBe('Or I')
    expect(rankFor(1200).label).toBe('Platine IV')
    expect(rankFor(1600).label).toBe('Diamant IV')
    expect(rankFor(1999).label).toBe('Diamant I')
  })
})

describe('rankFor — sommet (Maître)', () => {
  it("2000 trophées = Maître, sans division", () => {
    const r = rankFor(2000)
    expect(r.tier.id).toBe('maitre')
    expect(r.roman).toBeNull()
    expect(r.divisionIndex).toBeNull()
    expect(r.label).toBe('Maître')
    expect(r.progress).toBe(1)
    expect(r.toNext).toBe(0)
    expect(r.ceiling).toBeNull()
    expect(r.floor).toBe(APEX_FLOOR)
  })

  it('au sommet, inDivision compte les trophées au-dessus du seuil', () => {
    expect(rankFor(2000).inDivision).toBe(0)
    expect(rankFor(2500).inDivision).toBe(500)
  })
})

describe('rankFor — robustesse', () => {
  it('borne les valeurs négatives à Bronze IV', () => {
    const r = rankFor(-999)
    expect(r.label).toBe('Bronze IV')
    expect(r.floor).toBe(0)
  })

  it('tronque les décimales', () => {
    expect(rankFor(150.9).label).toBe('Bronze III')
  })
})

describe('tierFloor', () => {
  it("donne le seuil d'entrée (division IV) de chaque palier", () => {
    expect(tierFloor('bronze')).toBe(0)
    expect(tierFloor('argent')).toBe(400)
    expect(tierFloor('or')).toBe(800)
    expect(tierFloor('platine')).toBe(1200)
    expect(tierFloor('diamant')).toBe(1600)
    expect(tierFloor('maitre')).toBe(APEX_FLOOR)
  })
})

describe('nextTier', () => {
  it('donne le palier suivant', () => {
    expect(nextTier('bronze')?.id).toBe('argent')
    expect(nextTier('diamant')?.id).toBe('maitre')
  })

  it('null au sommet', () => {
    expect(nextTier('maitre')).toBeNull()
  })
})
