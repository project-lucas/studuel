import { describe, expect, test } from 'vitest'
import {
  budgetChrono,
  chronoApresReponse,
  chronoEnAlerte,
  chronoRatio,
  chronoTick,
  CHRONO_BONUS_BONNE_REPONSE,
  CHRONO_MAX_SECONDES,
  CHRONO_MIN_SECONDES,
  formatChrono,
  tempsEcoule,
} from './quiz-chrono'

describe('budgetChrono — un budget pour toute la manche', () => {
  test('12 s par question : huit questions font 96 s, l’ordre de grandeur du duel', () => {
    expect(budgetChrono(8)).toBe(96)
    expect(budgetChrono(10)).toBe(120)
  })

  test('plancher pour les petits paquets, plafond pour les gros', () => {
    expect(budgetChrono(1)).toBe(CHRONO_MIN_SECONDES)
    expect(budgetChrono(2)).toBe(CHRONO_MIN_SECONDES)
    expect(budgetChrono(50)).toBe(CHRONO_MAX_SECONDES)
  })

  test('ne casse pas sur une valeur absurde', () => {
    expect(budgetChrono(0)).toBe(CHRONO_MIN_SECONDES)
    expect(budgetChrono(-3)).toBe(CHRONO_MIN_SECONDES)
    expect(budgetChrono(Number.NaN)).toBe(CHRONO_MIN_SECONDES)
  })
})

describe('chronoApresReponse — une bonne réponse rend du temps, une erreur n’en retire pas', () => {
  test('bonne réponse : +bonus', () => {
    expect(chronoApresReponse(40, true)).toBe(40 + CHRONO_BONUS_BONNE_REPONSE)
  })

  test('erreur : rien ne bouge — le point est déjà perdu', () => {
    expect(chronoApresReponse(40, false)).toBe(40)
  })

  test('jamais au-dessus du plafond, jamais sous zéro', () => {
    expect(chronoApresReponse(CHRONO_MAX_SECONDES, true)).toBe(CHRONO_MAX_SECONDES)
    expect(chronoApresReponse(-5, false)).toBe(0)
  })
})

describe('le cadran', () => {
  test('tick : une seconde de moins, plancher zéro', () => {
    expect(chronoTick(10)).toBe(9)
    expect(chronoTick(0)).toBe(0)
  })

  test('tempsEcoule à zéro, pas avant', () => {
    expect(tempsEcoule(1)).toBe(false)
    expect(tempsEcoule(0)).toBe(true)
  })

  test('alerte sous 10 s, mais pas une fois à zéro', () => {
    expect(chronoEnAlerte(11)).toBe(false)
    expect(chronoEnAlerte(10)).toBe(true)
    expect(chronoEnAlerte(0)).toBe(false)
  })

  test('format mm:ss, minutes nues', () => {
    expect(formatChrono(96)).toBe('1:36')
    expect(formatChrono(7)).toBe('0:07')
    expect(formatChrono(0)).toBe('0:00')
    expect(formatChrono(-4)).toBe('0:00')
  })

  test('ratio borné 0..1', () => {
    expect(chronoRatio(48, 96)).toBe(0.5)
    expect(chronoRatio(200, 96)).toBe(1)
    expect(chronoRatio(-1, 96)).toBe(0)
    expect(chronoRatio(10, 0)).toBe(0)
  })
})
