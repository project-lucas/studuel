import { describe, it, expect } from 'vitest'
import {
  POINTS_BASE,
  POINTS_SPEED_MAX,
  SPEED_FAST_MS,
  SPEED_SLOW_MS,
  MAX_COMBO_MULTIPLIER,
  comboMultiplier,
  speedBonus,
  answerPoints,
} from './duel90'

describe('comboMultiplier', () => {
  it('vaut 1 avant 3 bonnes réponses d’affilée', () => {
    expect(comboMultiplier(0)).toBe(1)
    expect(comboMultiplier(2)).toBe(1)
  })

  it('passe à 2 à 3 d’affilée, à 3 à 6', () => {
    expect(comboMultiplier(3)).toBe(2)
    expect(comboMultiplier(5)).toBe(2)
    expect(comboMultiplier(6)).toBe(3)
  })

  it('plafonne au multiplicateur maximum', () => {
    expect(comboMultiplier(50)).toBe(MAX_COMBO_MULTIPLIER)
  })

  it('encaisse une valeur incohérente sans casser', () => {
    expect(comboMultiplier(-5)).toBe(1)
    expect(comboMultiplier(Number.NaN)).toBe(1)
  })
})

describe('speedBonus', () => {
  it('donne le bonus plein sous le seuil rapide', () => {
    expect(speedBonus(0)).toBe(POINTS_SPEED_MAX)
    expect(speedBonus(SPEED_FAST_MS)).toBe(POINTS_SPEED_MAX)
  })

  it('ne donne rien au-delà du seuil lent', () => {
    expect(speedBonus(SPEED_SLOW_MS)).toBe(0)
    expect(speedBonus(30_000)).toBe(0)
  })

  it('décroît entre les deux seuils', () => {
    const milieu = speedBonus((SPEED_FAST_MS + SPEED_SLOW_MS) / 2)
    expect(milieu).toBeGreaterThan(0)
    expect(milieu).toBeLessThan(POINTS_SPEED_MAX)
    expect(speedBonus(3000)).toBeGreaterThan(speedBonus(6000))
  })
})

describe('answerPoints', () => {
  it('combine la base, la vitesse et la série', () => {
    // 3 d'affilée → ×2 ; réponse instantanée → bonus plein.
    expect(answerPoints(3, 0)).toBe((POINTS_BASE + POINTS_SPEED_MAX) * 2)
  })

  it('rapporte toujours au moins la base', () => {
    expect(answerPoints(0, 60_000)).toBe(POINTS_BASE)
  })
})
