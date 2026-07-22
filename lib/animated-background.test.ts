import { describe, it, expect } from 'vitest'
import {
  createRng,
  leafCountFor,
  spawnLeaf,
  stepLeaf,
  makeDustParticles,
  LEAF_COLORS,
  LEAF_MIN_COUNT,
  LEAF_MAX_COUNT,
  LEAF_MARGIN,
  DUST_COUNT,
} from './animated-background'

describe('createRng', () => {
  it('est déterministe : même graine → même séquence', () => {
    const a = createRng(42)
    const b = createRng(42)
    for (let i = 0; i < 20; i++) expect(a()).toBe(b())
  })

  it('deux graines différentes divergent', () => {
    const a = createRng(1)
    const b = createRng(2)
    const seqA = Array.from({ length: 5 }, () => a())
    const seqB = Array.from({ length: 5 }, () => b())
    expect(seqA).not.toEqual(seqB)
  })

  it('produit des valeurs dans [0, 1)', () => {
    const rng = createRng(7)
    for (let i = 0; i < 1000; i++) {
      const v = rng()
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThan(1)
    }
  })
})

describe('leafCountFor', () => {
  it('borne à 15 sur mobile étroit', () => {
    expect(leafCountFor(320)).toBe(LEAF_MIN_COUNT)
    expect(leafCountFor(390)).toBe(LEAF_MIN_COUNT)
  })

  it('borne à 25 sur grand écran', () => {
    expect(leafCountFor(1440)).toBe(LEAF_MAX_COUNT)
    expect(leafCountFor(4000)).toBe(LEAF_MAX_COUNT)
  })

  it('grandit entre les deux bornes', () => {
    const mid = leafCountFor(900) // 900/45 = 20
    expect(mid).toBe(20)
  })
})

describe('spawnLeaf', () => {
  const W = 400
  const H = 800

  it('naît au-dessus du bord haut quand scatterY est faux', () => {
    const rng = createRng(3)
    for (let i = 0; i < 50; i++) {
      const leaf = spawnLeaf(rng, W, H, false)
      expect(leaf.y).toBeLessThanOrEqual(-LEAF_MARGIN)
      expect(leaf.x).toBeGreaterThanOrEqual(0)
      expect(leaf.x).toBeLessThanOrEqual(W)
    }
  })

  it('se disperse sur toute la hauteur quand scatterY est vrai', () => {
    const rng = createRng(3)
    const ys = Array.from({ length: 50 }, () => spawnLeaf(rng, W, H, true).y)
    expect(Math.min(...ys)).toBeGreaterThanOrEqual(0)
    expect(Math.max(...ys)).toBeLessThanOrEqual(H)
    // Vraiment dispersé, pas tassé en haut.
    expect(Math.max(...ys) - Math.min(...ys)).toBeGreaterThan(H / 3)
  })

  it('tire sa couleur dans la palette et des paramètres bornés', () => {
    const rng = createRng(11)
    for (let i = 0; i < 50; i++) {
      const leaf = spawnLeaf(rng, W, H, true)
      expect(LEAF_COLORS).toContain(leaf.color)
      expect(leaf.vy).toBeGreaterThan(0)
      expect(leaf.size).toBeGreaterThanOrEqual(10)
      expect(leaf.size).toBeLessThanOrEqual(18)
      expect(leaf.opacity).toBeGreaterThanOrEqual(0.55)
      expect(leaf.opacity).toBeLessThanOrEqual(0.9)
    }
  })
})

describe('stepLeaf', () => {
  const W = 400
  const H = 800
  const rng = createRng(5)

  it('tombe et tourne sans muter la feuille d’origine', () => {
    const leaf = spawnLeaf(rng, W, H, true)
    const before = { ...leaf }
    const next = stepLeaf(leaf, 1000, 0, W, H, rng)
    expect(leaf).toEqual(before) // immutabilité
    expect(next.y).toBeCloseTo(leaf.y + leaf.vy) // 1 s de chute
    expect(next.rotation).not.toBe(leaf.rotation)
  })

  it('le vent fait dériver horizontalement selon l’horloge globale', () => {
    const leaf = { ...spawnLeaf(rng, W, H, true), x: 200, windPhase: 0, windAmp: 20 }
    // sin(π/2) = 1 → dérive pleine amplitude vers la droite sur 1 s.
    const next = stepLeaf(leaf, 1000, (Math.PI / 2) * 1000, W, H, rng)
    expect(next.x).toBeCloseTo(220, 0)
  })

  it('se recycle en haut quand elle sort par le bas', () => {
    const leaf = { ...spawnLeaf(rng, W, H, true), y: H + LEAF_MARGIN + 1, vy: 30 }
    const next = stepLeaf(leaf, 16, 0, W, H, rng)
    expect(next.y).toBeLessThanOrEqual(-LEAF_MARGIN)
  })

  it('rebouche les bords latéraux (wrap gauche/droite)', () => {
    const base = spawnLeaf(rng, W, H, true)
    const gauche = { ...base, x: -LEAF_MARGIN - 5, windPhase: Math.PI / 2, windAmp: 0 }
    expect(stepLeaf(gauche, 16, 0, W, H, rng).x).toBe(W + LEAF_MARGIN)
    const droite = { ...base, x: W + LEAF_MARGIN + 5, windAmp: 0 }
    expect(stepLeaf(droite, 16, 0, W, H, rng).x).toBe(-LEAF_MARGIN)
  })
})

describe('makeDustParticles', () => {
  it('produit 30 particules par défaut, de façon déterministe', () => {
    const a = makeDustParticles()
    const b = makeDustParticles()
    expect(a).toHaveLength(DUST_COUNT)
    expect(a).toEqual(b) // même graine → mêmes styles SSR/client
  })

  it('respecte les bornes visuelles (subtilité imposée)', () => {
    for (const p of makeDustParticles()) {
      expect(p.leftPct).toBeGreaterThanOrEqual(2)
      expect(p.leftPct).toBeLessThanOrEqual(98)
      expect(p.topPct).toBeGreaterThanOrEqual(30)
      expect(p.topPct).toBeLessThanOrEqual(95)
      expect(p.size).toBeGreaterThanOrEqual(2)
      expect(p.size).toBeLessThanOrEqual(4.5)
      expect(p.delaySec).toBeLessThanOrEqual(0)
      expect(p.durationSec).toBeGreaterThanOrEqual(6)
      expect(p.durationSec).toBeLessThanOrEqual(14)
      expect(p.peakOpacity).toBeGreaterThanOrEqual(0.3)
      expect(p.peakOpacity).toBeLessThanOrEqual(0.6)
    }
  })

  it('accepte un nombre et une graine sur mesure', () => {
    expect(makeDustParticles(5)).toHaveLength(5)
    expect(makeDustParticles(5, 1)).not.toEqual(makeDustParticles(5, 2))
  })
})
