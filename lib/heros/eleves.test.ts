import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { HEROS_ELEVES, HEROS_KEYS, herosParGenre, herosSceneSrc, herosVisageSrc, isHerosKey } from './eleves'
import { PORTRAITS_CLASSIQUES, isPortraitKey, portraitPourId, portraitSrc } from '../portraits'
import { decorDuPortrait, DECOR_JOUEUR, bureauDuPortrait, piedDuPortrait } from '../joueur'

describe('les élèves-héros', () => {
  it('ont des clés uniques, distinctes des treize blasons', () => {
    expect(new Set(HEROS_KEYS).size).toBe(HEROS_KEYS.length)
    for (const k of HEROS_KEYS) expect(PORTRAITS_CLASSIQUES as readonly string[]).not.toContain(k)
  })

  it('se rangent en garçons et filles, sans en oublier', () => {
    expect(herosParGenre('garcons').length + herosParGenre('filles').length).toBe(HEROS_ELEVES.length)
    expect(herosParGenre('garcons').length).toBeGreaterThan(0)
    expect(herosParGenre('filles').length).toBeGreaterThan(0)
  })

  it('ont chacun leur scène et leur visage servis', () => {
    for (const k of HEROS_KEYS) {
      expect(existsSync(join(process.cwd(), 'public', herosSceneSrc(k))), k).toBe(true)
      expect(existsSync(join(process.cwd(), 'public', herosVisageSrc(k))), k).toBe(true)
    }
  })

  it('sont des portraits valides dont l’avatar est le visage', () => {
    expect(isPortraitKey('elfe-rodeur')).toBe(true)
    expect(isHerosKey('elfe-rodeur')).toBe(true)
    expect(isHerosKey('7')).toBe(false)
    expect(portraitSrc('elfe-rodeur')).toBe('/images/heros/eleves/elfe-rodeur-visage.webp')
  })

  it('ne servent jamais de blason fixe à qui n’a rien choisi', () => {
    for (const id of ['a', 'b0b', 'c-123', 'zzzz', 'élève']) {
      expect(PORTRAITS_CLASSIQUES as readonly string[]).toContain(portraitPourId(id))
    }
  })

  it('s’assoient au bureau de la page du joueur (01/11), sans pose en pied', () => {
    expect(decorDuPortrait('troll-pont')).toBe('/images/heros/eleves/troll-pont.webp')
    expect(bureauDuPortrait('troll-pont')).toBe('troll-pont')
    expect(piedDuPortrait('troll-pont')).toBeNull()
    expect(decorDuPortrait('7')).toBe(DECOR_JOUEUR)
  })
})
