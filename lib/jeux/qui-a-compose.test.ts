import { describe, expect, it } from 'vitest'
import { COMPOSE_TIER_BRIEF, OEUVRES, buildQuiAComposePool, oeuvresForTier } from './qui-a-compose'

describe('Qui a composé ? — la banque', () => {
  it('a des identifiants uniques, un titre, un compositeur et une date dans le repère', () => {
    expect(new Set(OEUVRES.map((o) => o.id)).size).toBe(OEUVRES.length)
    for (const o of OEUVRES) {
      expect(o.id).toMatch(/^[a-z0-9-]+$/)
      expect(o.titre.length).toBeGreaterThan(3)
      expect(o.compositeur.length).toBeGreaterThan(3)
      // Le repère date l'œuvre (« 1875 », « vers 1705 », « années 1830 ») :
      // la correction situe, elle ne se contente pas de nommer.
      expect(o.tip, o.id).toMatch(/\b1[5-9]\d\d\b|\b20[0-2]\d\b/)
      expect(o.tip.startsWith(o.compositeur.split(' ').pop()!) || o.tip.startsWith(o.compositeur)).toBe(true)
    }
  })

  it('offre assez de compositeurs distincts pour quatre réponses', () => {
    expect(new Set(OEUVRES.map((o) => o.compositeur)).size).toBeGreaterThanOrEqual(20)
  })

  it('commence doucement : les tubes d’abord, le baroque et les œuvres rares ensuite', () => {
    expect(oeuvresForTier(1)).toHaveLength(14)
    expect(oeuvresForTier(2)).toHaveLength(14)
    expect(oeuvresForTier(3).length).toBeGreaterThan(20)
    expect(oeuvresForTier(5)).toHaveLength(OEUVRES.length)
    expect(oeuvresForTier(1).some((o) => o.id === 'bolero')).toBe(true)
    expect(oeuvresForTier(1).some((o) => o.id === 'sacre-du-printemps')).toBe(false)
    for (const level of [1, 2, 3, 4, 5] as const) expect(COMPOSE_TIER_BRIEF[level].length).toBeGreaterThan(10)
  })
})

describe('buildQuiAComposePool', () => {
  it('est déterministe et sert le nombre demandé', () => {
    expect(buildQuiAComposePool('a', 12, 3)).toEqual(buildQuiAComposePool('a', 12, 3))
    expect(buildQuiAComposePool('a', 20, 1)).toHaveLength(20)
  })

  it('pose quatre compositeurs distincts dont le bon', () => {
    for (const q of buildQuiAComposePool('z', 40, 5)) {
      expect(q.options).toHaveLength(4)
      expect(new Set(q.options).size).toBe(4)
      const oeuvre = OEUVRES.find((o) => q.id === `jx-musique-${o.id}-${q.id.split('-').pop()}`)!
      expect(q.options[q.correctIndex]).toBe(oeuvre.compositeur)
      expect(q.prompt).toContain(oeuvre.titre)
      expect(q.subject).toBe('Musique')
    }
  })

  it('ne répète pas une œuvre tant que le stock suffit, et reste au palier', () => {
    const ids = buildQuiAComposePool('r', 14, 1).map((q) => q.id.replace(/-\d+$/, ''))
    expect(new Set(ids).size).toBe(14)
    const rares = new Set(OEUVRES.filter((o) => o.from >= 3).map((o) => `jx-musique-${o.id}`))
    for (const q of buildQuiAComposePool('p', 30, 2)) {
      expect(rares.has(q.id.replace(/-\d+$/, ''))).toBe(false)
    }
  })
})
