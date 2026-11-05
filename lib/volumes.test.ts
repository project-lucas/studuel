import { describe, expect, it } from 'vitest'
import { lireVolume, pourcentVolume, VOLUME_DEFAUT } from './volumes'

describe('lireVolume', () => {
  it('rend le défaut (le niveau d’avant) quand rien n’est réglé ou que la valeur est illisible', () => {
    expect(lireVolume(null)).toBe(VOLUME_DEFAUT)
    expect(lireVolume('')).toBe(VOLUME_DEFAUT)
    expect(lireVolume('fort')).toBe(VOLUME_DEFAUT)
    expect(lireVolume('NaN')).toBe(VOLUME_DEFAUT)
  })

  it('garde un volume réglé, borné entre 0 et 1', () => {
    expect(lireVolume('0.4')).toBe(0.4)
    expect(lireVolume('0')).toBe(0)
    expect(lireVolume('3')).toBe(1)
    expect(lireVolume('-1')).toBe(0)
  })
})

describe('pourcentVolume', () => {
  it('arrondit au pour cent et reste dans 0-100', () => {
    expect(pourcentVolume(0.7)).toBe(70)
    expect(pourcentVolume(0.333)).toBe(33)
    expect(pourcentVolume(2)).toBe(100)
  })
})
