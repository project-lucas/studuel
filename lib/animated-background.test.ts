import { describe, it, expect } from 'vitest'
import {
  createRng,
  makeDustParticles,
  DUST_COUNT,
  sensDeDerive,
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

describe('makeDustParticles', () => {
  it('produit 14 particules par défaut, de façon déterministe', () => {
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
      // Des cycles LONGS : chaque fin de cycle se paie sur le fil principal.
      expect(p.durationSec).toBeGreaterThanOrEqual(16)
      expect(p.durationSec).toBeLessThanOrEqual(26)
      expect(p.peakOpacity).toBeGreaterThanOrEqual(0.3)
      expect(p.peakOpacity).toBeLessThanOrEqual(0.6)
    }
  })

  it('accepte un nombre et une graine sur mesure', () => {
    expect(makeDustParticles(5)).toHaveLength(5)
    expect(makeDustParticles(5, 1)).not.toEqual(makeDustParticles(5, 2))
  })
})

describe('sensDeDerive', () => {
  it('range chaque dérive dans l’une des trois variantes du CSS', () => {
    expect(sensDeDerive(-18)).toBe('gauche')
    expect(sensDeDerive(-6)).toBe('gauche')
    expect(sensDeDerive(-5.9)).toBe('aucune')
    expect(sensDeDerive(0)).toBe('aucune')
    expect(sensDeDerive(6)).toBe('droite')
    expect(sensDeDerive(18)).toBe('droite')
  })

  it('donne aux points du semis les trois sens', () => {
    const sens = new Set(makeDustParticles().map((p) => sensDeDerive(p.driftPx)))
    expect(sens).toEqual(new Set(['gauche', 'aucune', 'droite']))
  })
})
