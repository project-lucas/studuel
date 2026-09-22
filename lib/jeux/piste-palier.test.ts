import { describe, expect, it } from 'vitest'
import { formatAccuracy, pistePalier, positionSurPiste } from './piste-palier'

describe('positionSurPiste', () => {
  it('place les trois seuils aux tiers de la piste', () => {
    expect(positionSurPiste(0.6)).toBeCloseTo(1 / 3)
    expect(positionSurPiste(0.8)).toBeCloseTo(2 / 3)
    expect(positionSurPiste(0.95)).toBe(1)
    expect(positionSurPiste(1)).toBe(1)
  })

  it('remplit chaque segment proportionnellement, entre ses deux jalons', () => {
    expect(positionSurPiste(0)).toBe(0)
    expect(positionSurPiste(0.3)).toBeCloseTo(1 / 6)
    expect(positionSurPiste(0.7)).toBeCloseTo(0.5)
    expect(positionSurPiste(0.875)).toBeCloseTo(5 / 6)
  })

  it('borne les valeurs aberrantes', () => {
    expect(positionSurPiste(-1)).toBe(0)
    expect(positionSurPiste(7)).toBe(1)
  })
})

describe('pistePalier', () => {
  it('pose trois jalons aux tiers, au tarif du palier, gagnés selon les étoiles acquises', () => {
    const p = pistePalier({ level: 3, stars: 2, acquises: 2, accuracy: 0.85 })
    expect(p.jalons.map((j) => j.at)).toEqual([1 / 3, 2 / 3, 1])
    expect(p.jalons.map((j) => j.gemmes)).toEqual([3, 3, 3])
    expect(p.jalons.map((j) => j.gagne)).toEqual([true, true, false])
    expect(p.jalons.map((j) => j.seuil)).toEqual([0.6, 0.8, 0.95])
    expect(p.prochainSeuil).toBe(0.95)
    expect(p.fill).toBeCloseTo(2 / 3 + (0.05 / 0.15) / 3)
  })

  it('un palier jamais joué a le curseur à zéro et aucun seuil atteint', () => {
    const p = pistePalier({ level: 1, stars: 0, acquises: 0, accuracy: null })
    expect(p.fill).toBe(0)
    expect(p.accuracy).toBeNull()
    expect(p.prochainSeuil).toBe(0.6)
  })

  it('ne recule jamais sous ce que les étoiles prouvent (ancienne progression sans précision)', () => {
    const p = pistePalier({ level: 2, stars: 2, acquises: 2, accuracy: null })
    expect(p.accuracy).toBe(0.8)
    expect(p.fill).toBeCloseTo(2 / 3)
    // Et une précision mémorisée plus basse que le seuil des étoiles ne compte pas.
    const q = pistePalier({ level: 2, stars: 3, acquises: 3, accuracy: 0.5 })
    expect(q.accuracy).toBe(0.95)
    expect(q.fill).toBe(1)
    expect(q.prochainSeuil).toBeNull()
  })

  it('les jetons suivent les étoiles PAYÉES, pas seulement les locales', () => {
    // Un appareil neuf : rien en local, mais les gemmes ont déjà été versées.
    const p = pistePalier({ level: 5, stars: 0, acquises: 3, accuracy: null })
    expect(p.jalons.every((j) => j.gagne)).toBe(true)
    expect(p.jalons[0].gemmes).toBe(5)
  })
})

describe('formatAccuracy', () => {
  it('arrondit au pour cent', () => {
    expect(formatAccuracy(0.9166)).toBe('92 %')
    expect(formatAccuracy(1)).toBe('100 %')
  })
})
