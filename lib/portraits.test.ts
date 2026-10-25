import { describe, expect, it } from 'vitest'
import {
  PORTRAIT_KEYS,
  PORTRAITS_FILLES,
  PORTRAITS_GARCONS,
  PORTRAITS_PAR_GENRE,
  genreDuPortrait,
  portraitDe,
  portraitPiedSrc,
  portraitPourId,
  portraitSrc,
} from './portraits'

describe('portraitPiedSrc', () => {
  it('sert le personnage en pied sous son propre dossier, à côté du buste', () => {
    expect(portraitPiedSrc('7')).toBe('/images/profil/pied/7.webp')
    expect(portraitSrc('7')).toBe('/images/profil/v2/7.webp')
  })
})

describe('la répartition garçons / filles', () => {
  it('couvre les treize portraits, sans en oublier', () => {
    const couverts = new Set([...PORTRAITS_GARCONS, ...PORTRAITS_FILLES])
    for (const key of PORTRAIT_KEYS) expect(couverts.has(key), key).toBe(true)
  })

  it('ne cite que des clés servies, chacune une seule fois par liste', () => {
    for (const liste of [PORTRAITS_GARCONS, PORTRAITS_FILLES]) {
      expect(new Set(liste).size).toBe(liste.length)
      for (const key of liste) expect(PORTRAIT_KEYS).toContain(key)
    }
  })

  it('suit l’ordre de la grille (celui de PORTRAIT_KEYS) dans chaque onglet', () => {
    const rang = (k: string) => PORTRAIT_KEYS.indexOf(k as (typeof PORTRAIT_KEYS)[number])
    for (const liste of Object.values(PORTRAITS_PAR_GENRE)) {
      const rangs = liste.map(rang)
      expect(rangs).toEqual([...rangs].sort((a, b) => a - b))
    }
  })
})

describe('genreDuPortrait', () => {
  it('ouvre l’onglet où figure le portrait déjà choisi', () => {
    expect(genreDuPortrait('4')).toBe('filles')
    expect(genreDuPortrait('13')).toBe('garcons')
  })

  it('ouvre le premier onglet sans choix ou pour un portrait inconnu', () => {
    expect(genreDuPortrait(null)).toBe('garcons')
    expect(genreDuPortrait('')).toBe('garcons')
    expect(genreDuPortrait('perso:charlemagne')).toBe('garcons')
  })
})

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
