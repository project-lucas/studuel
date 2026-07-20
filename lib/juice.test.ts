import { describe, it, expect } from 'vitest'
import {
  comboTier,
  comboLabel,
  comboSemitones,
  transpose,
  buzzPattern,
  MAX_COMBO_SEMITONES,
  BUZZ_WRONG,
  autoAdvanceDelay,
  AUTO_ADVANCE_MS,
} from './juice'

describe('comboTier', () => {
  it('ne fête rien avant la 2e bonne réponse d’affilée', () => {
    expect(comboTier(0)).toBe('aucun')
    expect(comboTier(1)).toBe('aucun')
  })

  it('escalade avec la série', () => {
    expect(comboTier(2)).toBe('chaud')
    expect(comboTier(4)).toBe('feu')
    expect(comboTier(7)).toBe('inarretable')
    expect(comboTier(50)).toBe('inarretable')
  })
})

describe('comboLabel', () => {
  it('ne montre aucun badge tant qu’il n’y a rien à fêter', () => {
    expect(comboLabel(1)).toBeNull()
  })

  it('affiche la série atteinte', () => {
    expect(comboLabel(3)).toBe('×3')
    expect(comboLabel(5)).toContain('En feu')
    expect(comboLabel(9)).toContain('Inarrêtable')
  })
})

describe('comboSemitones', () => {
  it('la première bonne réponse garde la note de base', () => {
    expect(comboSemitones(0)).toBe(0)
    expect(comboSemitones(1)).toBe(0)
  })

  it('monte d’un demi-ton par bonne réponse', () => {
    expect(comboSemitones(2)).toBe(1)
    expect(comboSemitones(5)).toBe(4)
  })

  it('PLAFONNE : une longue série ne doit pas finir dans les aigus pénibles', () => {
    expect(comboSemitones(100)).toBe(MAX_COMBO_SEMITONES)
  })
})

describe('transpose', () => {
  it('12 demi-tons = une octave (le double)', () => {
    expect(transpose(440, 12)).toBeCloseTo(880, 6)
  })

  it('0 demi-ton ne change rien', () => {
    expect(transpose(523.25, 0)).toBe(523.25)
  })
})

describe('buzzPattern', () => {
  it('une erreur vibre en deux temps (ça se ressent comme un « non »)', () => {
    expect(buzzPattern(false, 0)).toEqual(BUZZ_WRONG)
    expect(buzzPattern(false, 9)).toEqual(BUZZ_WRONG)
  })

  it('une bonne réponse vibre court, un peu plus franc en série', () => {
    const simple = buzzPattern(true, 1) as number
    const enSerie = buzzPattern(true, 5) as number

    expect(typeof simple).toBe('number')
    expect(enSerie).toBeGreaterThan(simple)
  })
})

describe('autoAdvanceDelay', () => {
  it('enchaîne tout seul sur une bonne réponse sans rien à lire', () => {
    expect(autoAdvanceDelay(true, false)).toBe(AUTO_ADVANCE_MS)
  })

  it('laisse le temps de LIRE quand il y a une explication', () => {
    expect(autoAdvanceDelay(true, true)).toBeNull()
  })

  it('n’enchaîne JAMAIS tout seul après une erreur', () => {
    // L'élève doit avoir le temps de voir la bonne réponse : c'est le seul
    // moment où il apprend vraiment quelque chose.
    expect(autoAdvanceDelay(false, false)).toBeNull()
    expect(autoAdvanceDelay(false, true)).toBeNull()
  })
})
