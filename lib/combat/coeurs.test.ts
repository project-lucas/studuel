import { describe, expect, test } from 'vitest'
import {
  coeursDeVies,
  coeursDuBoss,
  coeursDuDuel,
  compteCoeurs,
  dernierCoeur,
  lectureCoeurs,
  pertes,
  remplissages,
} from './coeurs'

describe('les cœurs du duel classé', () => {
  test('1 000 PV = cinq cœurs pleins', () => {
    expect(coeursDuDuel(1000)).toEqual({ quarts: 20, max: 5 })
    expect(remplissages(coeursDuDuel(1000))).toEqual([4, 4, 4, 4, 4])
  })

  test('il reste un bout de cœur tant qu’il reste un point', () => {
    expect(coeursDuDuel(1).quarts).toBe(1)
    expect(coeursDuDuel(0).quarts).toBe(0)
  })

  test('une bonne réponse de 150 points arrache trois quarts de cœur', () => {
    const { perdus, brises } = pertes(coeursDuDuel(1000), coeursDuDuel(850))
    expect(perdus).toEqual([0, 0, 0, 0, 3])
    expect(brises).toEqual([])
  })

  test('le coup qui vide un cœur le BRISE', () => {
    const { brises } = pertes(coeursDuDuel(850), coeursDuDuel(790))
    expect(brises).toEqual([4])
  })

  test('les valeurs absurdes ne cassent rien', () => {
    expect(coeursDuDuel(Number.NaN)).toEqual({ quarts: 0, max: 5 })
    expect(coeursDuDuel(5000)).toEqual({ quarts: 20, max: 5 })
  })
})

describe('les cœurs face au gardien', () => {
  test('mes vies : un cœur entier chacune', () => {
    expect(remplissages(coeursDeVies(2, 3))).toEqual([4, 4, 0])
    expect(pertes(coeursDeVies(3, 3), coeursDeVies(2, 3)).brises).toEqual([2])
  })

  test('le gardien de rang I : 10 PV, cinq cœurs, un coup = un demi-cœur', () => {
    expect(coeursDuBoss(10, 10)).toEqual({ quarts: 20, max: 5 })
    expect(remplissages(coeursDuBoss(9, 10))).toEqual([4, 4, 4, 4, 2])
  })

  test('le gardien de rang III : 18 PV, neuf cœurs', () => {
    expect(coeursDuBoss(18, 18).max).toBe(9)
  })
})

describe('ce qu’on lit', () => {
  test('le compte écrit', () => {
    expect(compteCoeurs({ quarts: 14, max: 5 })).toBe('3½')
    expect(compteCoeurs({ quarts: 3, max: 5 })).toBe('¾')
    expect(compteCoeurs({ quarts: 0, max: 5 })).toBe('0')
    expect(compteCoeurs({ quarts: 8, max: 5 })).toBe('2')
  })

  test('la phrase du lecteur d’écran', () => {
    expect(lectureCoeurs({ quarts: 14, max: 5 })).toBe('3½ cœurs sur 5')
    expect(lectureCoeurs({ quarts: 4, max: 3 })).toBe('1 cœur sur 3')
  })

  test('le dernier cœur bat', () => {
    expect(dernierCoeur({ quarts: 4, max: 5 })).toBe(true)
    expect(dernierCoeur({ quarts: 5, max: 5 })).toBe(false)
    expect(dernierCoeur({ quarts: 0, max: 5 })).toBe(false)
  })
})
