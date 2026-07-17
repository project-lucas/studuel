import { describe, it, expect } from 'vitest'
import {
  CAPSULES,
  PERSO_CATALOG,
  euroLabel,
  capsuleCta,
  capsuleById,
  persoByCategory,
} from './coffre'

describe('catalogue des capsules', () => {
  it('propose au moins une capsule offerte, en tête', () => {
    expect(CAPSULES.length).toBeGreaterThan(0)
    expect(CAPSULES[0].priceEuros).toBe(0)
    expect(CAPSULES[0].available).toBe(true)
  })

  it('garde des ids uniques', () => {
    const ids = CAPSULES.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('reste dans la fourchette micro-achat (0 à 3 €)', () => {
    for (const c of CAPSULES) {
      expect(c.priceEuros).toBeGreaterThanOrEqual(0)
      expect(c.priceEuros).toBeLessThanOrEqual(3)
    }
  })

  it('décrit toujours ce que la capsule couvre', () => {
    for (const c of CAPSULES) {
      expect(c.covers.length).toBeGreaterThan(0)
    }
  })
})

describe('euroLabel', () => {
  it('affiche « Offert » pour la gratuité', () => {
    expect(euroLabel(0)).toBe('Offert')
    expect(euroLabel(-1)).toBe('Offert')
  })

  it('formate les entiers sans décimale', () => {
    expect(euroLabel(3)).toBe('3 €')
  })

  it('formate les décimales à la française (virgule)', () => {
    expect(euroLabel(2.5)).toBe('2,50 €')
  })
})

describe('capsuleCta', () => {
  it('propose de regarder une capsule offerte disponible', () => {
    const free = CAPSULES.find((c) => c.priceEuros === 0 && c.available)!
    expect(capsuleCta(free)).toBe('Regarder')
  })

  it('affiche le prix pour une capsule payante disponible', () => {
    const paid = CAPSULES.find((c) => c.priceEuros > 0 && c.available)!
    expect(capsuleCta(paid)).toBe(`Débloquer · ${euroLabel(paid.priceEuros)}`)
  })

  it('annonce « Bientôt » pour une capsule indisponible', () => {
    expect(
      capsuleCta({
        id: 'x',
        title: 't',
        tagline: 't',
        duration: '1 min',
        priceEuros: 2,
        emoji: '❓',
        accent: 'violet',
        available: false,
        covers: ['a'],
      }),
    ).toBe('Bientôt')
  })
})

describe('capsuleById', () => {
  it('retrouve une capsule existante', () => {
    expect(capsuleById(CAPSULES[0].id)?.id).toBe(CAPSULES[0].id)
  })

  it('renvoie null pour un id inconnu', () => {
    expect(capsuleById('inconnu')).toBeNull()
  })
})

describe('personnalisation', () => {
  it('garde des ids uniques', () => {
    const ids = PERSO_CATALOG.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('filtre par catégorie', () => {
    const fonds = persoByCategory('fond')
    expect(fonds.length).toBeGreaterThan(0)
    expect(fonds.every((p) => p.category === 'fond')).toBe(true)
  })

  it('affiche des prix en pièces strictement positifs', () => {
    for (const p of PERSO_CATALOG) {
      expect(p.priceCoins).toBeGreaterThan(0)
    }
  })
})
