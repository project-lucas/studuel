import { describe, it, expect } from 'vitest'
import {
  WIN_COINS,
  WIN_COINS_DAILY_CAP,
  applyDuelResult,
  coinsForWin,
  totalDuels,
  recordLabel,
} from './duel-record'

describe('applyDuelResult', () => {
  it('incrémente les victoires sur une victoire', () => {
    expect(applyDuelResult({ wins: 3, losses: 1 }, true)).toEqual({
      wins: 4,
      losses: 1,
    })
  })

  it('incrémente les défaites sur une défaite', () => {
    expect(applyDuelResult({ wins: 3, losses: 1 }, false)).toEqual({
      wins: 3,
      losses: 2,
    })
  })

  it('part de zéro proprement', () => {
    expect(applyDuelResult({ wins: 0, losses: 0 }, true)).toEqual({
      wins: 1,
      losses: 0,
    })
  })

  it('assainit les entrées négatives ou décimales sans muter', () => {
    const source = { wins: -2, losses: 1.9 }
    const next = applyDuelResult(source, false)
    expect(next).toEqual({ wins: 0, losses: 2 })
    expect(source).toEqual({ wins: -2, losses: 1.9 }) // immuable
  })
})

describe('coinsForWin', () => {
  it('crédite le plein montant loin du plafond', () => {
    expect(coinsForWin(0)).toBe(WIN_COINS)
    expect(coinsForWin(10)).toBe(WIN_COINS)
  })

  it('crédite le reliquat exact quand le plafond est presque atteint', () => {
    // Reliquat de 3 pièces → on ne verse que 3, pas WIN_COINS (5).
    expect(coinsForWin(WIN_COINS_DAILY_CAP - 3)).toBe(3)
  })

  it('ne crédite rien une fois le plafond atteint ou dépassé', () => {
    expect(coinsForWin(WIN_COINS_DAILY_CAP)).toBe(0)
    expect(coinsForWin(WIN_COINS_DAILY_CAP + 20)).toBe(0)
  })

  it('assainit les entrées aberrantes', () => {
    expect(coinsForWin(-5)).toBe(WIN_COINS)
  })

  it('le plafond est un multiple entier de WIN_COINS (versements nets)', () => {
    expect(WIN_COINS_DAILY_CAP % WIN_COINS).toBe(0)
  })
})

describe('totalDuels', () => {
  it('somme victoires et défaites', () => {
    expect(totalDuels({ wins: 42, losses: 17 })).toBe(59)
  })

  it('ignore les valeurs négatives', () => {
    expect(totalDuels({ wins: -3, losses: 2 })).toBe(2)
  })
})

describe('recordLabel', () => {
  it('accorde le pluriel', () => {
    expect(recordLabel({ wins: 42, losses: 17 })).toBe('42 victoires, 17 défaites')
  })

  it('reste au singulier à un', () => {
    expect(recordLabel({ wins: 1, losses: 1 })).toBe('1 victoire, 1 défaite')
  })

  it('gère le zéro', () => {
    expect(recordLabel({ wins: 0, losses: 0 })).toBe('0 victoire, 0 défaite')
  })
})
