import { describe, expect, it } from 'vitest'
import {
  INSTRUMENTS,
  INSTRUMENT_TIER_BRIEF,
  buildClasseInstrumentPool,
  instrumentsForTier,
} from './classe-instrument'

describe('Classe-moi l’instrument — la banque', () => {
  it('a des identifiants uniques, un nom, une famille et un repère', () => {
    expect(new Set(INSTRUMENTS.map((i) => i.id)).size).toBe(INSTRUMENTS.length)
    for (const i of INSTRUMENTS) {
      expect(i.id).toMatch(/^[a-z-]+$/)
      expect(i.name.length).toBeGreaterThan(3)
      expect(i.tip.length).toBeGreaterThan(15)
    }
  })

  it('couvre les six familles de l’orchestre, chacune par plusieurs instruments', () => {
    const parFamille = new Map<string, number>()
    for (const i of INSTRUMENTS) parFamille.set(i.famille, (parFamille.get(i.famille) ?? 0) + 1)
    expect(parFamille.size).toBe(6)
    for (const [famille, n] of parFamille) expect(n, famille).toBeGreaterThanOrEqual(4)
  })

  it('commence doucement : la banque grandit avec le palier', () => {
    expect(instrumentsForTier(1)).toHaveLength(14)
    expect(instrumentsForTier(2)).toHaveLength(14)
    expect(instrumentsForTier(3).length).toBeGreaterThan(14)
    expect(instrumentsForTier(5)).toHaveLength(INSTRUMENTS.length)
    // Le saxophone, le piège classique, attend le palier Confirmé.
    expect(instrumentsForTier(1).some((i) => i.id === 'saxophone')).toBe(false)
    expect(instrumentsForTier(3).some((i) => i.id === 'saxophone')).toBe(true)
    for (const level of [1, 2, 3, 4, 5] as const) expect(INSTRUMENT_TIER_BRIEF[level].length).toBeGreaterThan(10)
  })
})

describe('buildClasseInstrumentPool', () => {
  it('est déterministe et sert le nombre demandé', () => {
    expect(buildClasseInstrumentPool('a', 20, 3)).toEqual(buildClasseInstrumentPool('a', 20, 3))
    expect(buildClasseInstrumentPool('a', 25, 1)).toHaveLength(25)
    expect(buildClasseInstrumentPool('a', 12, 1)).not.toEqual(buildClasseInstrumentPool('b', 12, 1))
  })

  it('pose quatre familles distinctes dont la bonne', () => {
    for (const q of buildClasseInstrumentPool('z', 40, 5)) {
      expect(q.options).toHaveLength(4)
      expect(new Set(q.options).size).toBe(4)
      const bonne = q.options[q.correctIndex]
      // L'id exact : « cor » est contenu dans « cor-anglais », on ne cherche pas par inclusion.
      const instrument = INSTRUMENTS.find((i) => q.id === `jx-musique-${i.id}-${q.id.split('-').pop()}`)!
      expect(bonne).toBe(instrument.famille)
      expect(q.subject).toBe('Musique')
    }
  })

  it('ne répète pas un instrument tant que le stock suffit', () => {
    const ids = buildClasseInstrumentPool('r', 14, 1).map((q) => q.id.replace(/-\d+$/, ''))
    expect(new Set(ids).size).toBe(14)
  })

  it('ne tire que les instruments du palier', () => {
    const rares = new Set(INSTRUMENTS.filter((i) => i.from >= 3).map((i) => `jx-musique-${i.id}`))
    for (const q of buildClasseInstrumentPool('p', 30, 1)) {
      expect(rares.has(q.id.replace(/-\d+$/, ''))).toBe(false)
    }
  })
})
