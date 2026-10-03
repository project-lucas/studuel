import { describe, expect, it } from 'vitest'
import { compteCourt } from './compte-court'

const ESPACE = (s: string) => s.replace(/\s/g, ' ')

describe('compteCourt', () => {
  it('écrit en entier jusqu’à 99 999', () => {
    expect(compteCourt(0)).toBe('0')
    expect(compteCourt(245)).toBe('245')
    expect(ESPACE(compteCourt(99_999))).toBe('99 999')
  })

  it('abrège en milliers, arrondi vers le bas', () => {
    expect(compteCourt(100_000)).toBe('100 k')
    expect(compteCourt(125_999)).toBe('125 k')
  })

  it('abrège en millions, une décimale au plus', () => {
    expect(compteCourt(1_000_015)).toBe('1 M')
    expect(compteCourt(1_250_000)).toBe('1,2 M')
    expect(compteCourt(1_299_999)).toBe('1,2 M')
  })

  it('survit à une valeur absurde', () => {
    expect(compteCourt(Number.NaN)).toBe('0')
    expect(compteCourt(-5)).toBe('0')
  })
})
