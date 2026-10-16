import { existsSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { echelon, NB_ECHELONS } from './ligue'
import { blasonDeRang, cadreDeRang, divisionRomaine } from './rang-visuel'

const publicDe = (src: string) => path.join(process.cwd(), 'public', src)

describe('divisionRomaine', () => {
  it('écrit les quatre divisions en chiffres romains', () => {
    expect([4, 3, 2, 1].map(divisionRomaine)).toEqual(['IV', 'III', 'II', 'I'])
  })
})

describe('le cadre et le blason de chaque échelon', () => {
  it('existent sur le disque, de Bronze IV à Maître', () => {
    for (let i = 0; i < NB_ECHELONS; i += 1) {
      const e = echelon(i)
      expect(existsSync(publicDe(cadreDeRang(e.rang.id, e.division))), e.nom).toBe(true)
      expect(existsSync(publicDe(blasonDeRang(e.rang.id, e.division))), e.nom).toBe(true)
    }
  })

  it('change d’une division à l’autre', () => {
    expect(cadreDeRang('argent', 3)).not.toBe(cadreDeRang('argent', 2))
    expect(blasonDeRang('or', 4)).toBe('/images/rangs/blasons/or-4.webp')
    expect(cadreDeRang('maitre', null)).toBe('/images/rangs/cadres/maitre.webp')
  })
})
