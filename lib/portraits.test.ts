import { describe, expect, it } from 'vitest'
import { PORTRAIT_KEYS, portraitDe, portraitPourId } from './portraits'

describe('portraitPourId', () => {
  it('donne toujours le même blason au même élève', () => {
    expect(portraitPourId('abc-123')).toBe(portraitPourId('abc-123'))
  })

  it('reste dans la liste des blasons servis', () => {
    for (const id of ['', 'me', 'lea', 'c0ffee-0000-4444']) {
      expect(PORTRAIT_KEYS).toContain(portraitPourId(id))
    }
  })

  it('répartit les élèves sur plusieurs blasons', () => {
    const vus = new Set(
      Array.from({ length: 50 }, (_, i) => portraitPourId(`eleve-${i}`)),
    )
    expect(vus.size).toBeGreaterThan(5)
  })
})

describe('portraitDe', () => {
  it('garde le blason choisi par l’élève', () => {
    expect(portraitDe('7', 'x')).toBe('7')
  })

  it('retombe sur le blason fixe quand le choix est vide ou inconnu', () => {
    expect(portraitDe('', 'x')).toBe(portraitPourId('x'))
    expect(portraitDe('99', 'x')).toBe(portraitPourId('x'))
    expect(portraitDe(null, 'x')).toBe(portraitPourId('x'))
  })
})
