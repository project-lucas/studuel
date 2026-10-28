import { describe, expect, it } from 'vitest'
import { COHORTE_MIN_SEUILS_TEMPS, SEUILS_TEMPS, xpSeuilTemps } from '@/lib/economie'
import {
  CAPS,
  CRANS_BARRE,
  barreTemps,
  capFranchi,
  capsFranchis,
  parseCaps,
  partDeTete,
  phrasePlace,
  positionBarre,
  positionCran,
  prochainCap,
  xpDesCaps,
} from './palier-temps'

describe('le barème des caps (miroir de palier_temps_xp, 603)', () => {
  it('paie 5 · 10 · 15 · 25 · 40 XP du top 50 % au top 1 %', () => {
    expect(SEUILS_TEMPS).toEqual([50, 30, 15, 5, 1])
    expect(SEUILS_TEMPS.map(xpSeuilTemps)).toEqual([5, 10, 15, 25, 40])
    expect(CAPS.map((c) => c.xp)).toEqual([5, 10, 15, 25, 40])
  })

  it('un cap inconnu ne paie rien', () => {
    expect(xpSeuilTemps(20)).toBe(0)
    expect(xpSeuilTemps(0)).toBe(0)
  })

  it('95 XP par palier, chaque cap compté une fois', () => {
    expect(xpDesCaps([50, 30, 15, 5, 1])).toBe(95)
    expect(xpDesCaps([50, 50, 30, 99])).toBe(15)
    expect(xpDesCaps([])).toBe(0)
  })
})

describe('partDeTete', () => {
  it('rang / total dans ]0, 1]', () => {
    expect(partDeTete(1, 10)).toBe(0.1)
    expect(partDeTete(10, 10)).toBe(1)
  })

  it('refuse une place illisible', () => {
    expect(partDeTete(0, 10)).toBeNull()
    expect(partDeTete(11, 10)).toBeNull()
    expect(partDeTete(3, 0)).toBeNull()
    expect(partDeTete(Number.NaN, 10)).toBeNull()
  })
})

describe('capFranchi — en entiers, comme la 603', () => {
  it('rang × 100 ≤ cap × total', () => {
    // 1er sur 10 = 10 % : top 50, 30, 15 ; pas top 5 ni 1.
    expect(capsFranchis(1, 10)).toEqual([50, 30, 15])
    // 3e sur 12 = 25 % : top 50 et 30.
    expect(capsFranchis(3, 12)).toEqual([50, 30])
    // 140e sur 1 250 = 11,2 % : top 50, 30, 15.
    expect(capsFranchis(140, 1250)).toEqual([50, 30, 15])
    // Exactement sur le cap : 15e sur 100 = 15 % → franchi.
    expect(capFranchi(15, 100, 15)).toBe(true)
    expect(capFranchi(16, 100, 15)).toBe(false)
  })

  it('ne paie rien sous dix joueurs classés', () => {
    expect(COHORTE_MIN_SEUILS_TEMPS).toBe(10)
    expect(capsFranchis(1, 9)).toEqual([])
    expect(capsFranchis(1, 1)).toEqual([])
  })

  it('le top 1 % demande cent joueurs au moins', () => {
    expect(capFranchi(1, 99, 1)).toBe(false)
    expect(capFranchi(1, 100, 1)).toBe(true)
  })
})

describe('phrasePlace — la même grille que les crans', () => {
  it('rien sans place', () => {
    expect(phrasePlace(null)).toBeNull()
    expect(phrasePlace({ rank: 0, total: 10 })).toBeNull()
  })

  it('sous cent joueurs, le rang brut', () => {
    expect(phrasePlace({ rank: 3, total: 12 })).toBe('3e sur 12 joueurs')
    expect(phrasePlace({ rank: 1, total: 99 })).toBe('1er sur 99 joueurs')
  })

  it('dès cent joueurs, le cap le plus serré franchi', () => {
    expect(phrasePlace({ rank: 140, total: 1250 })).toBe('Top 15 % des joueurs')
    expect(phrasePlace({ rank: 1, total: 100 })).toBe('Top 1 % des joueurs')
    expect(phrasePlace({ rank: 50, total: 100 })).toBe('Top 50 % des joueurs')
  })

  it('sans cap franchi, le rang brut même à mille', () => {
    expect(phrasePlace({ rank: 700, total: 1250 })).toBe('700e sur 1250 joueurs')
  })
})

describe('prochainCap', () => {
  it('le plus large qui ne soit pas franchi', () => {
    expect(prochainCap(1, 10)).toEqual({ pct: 5, xp: 25 })
    expect(prochainCap(3, 12)).toEqual({ pct: 15, xp: 15 })
  })

  it('pas encore classé → le top 50 %', () => {
    expect(prochainCap(null, null)).toEqual({ pct: 50, xp: 5 })
    expect(prochainCap(0, 10)).toEqual({ pct: 50, xp: 5 })
  })

  it('tout franchi → null', () => {
    expect(prochainCap(1, 100)).toBeNull()
  })
})

describe('positionBarre — échelle logarithmique', () => {
  it('100 % → 0, 10 % → ½, 1 % → 1', () => {
    expect(positionBarre(1)).toBe(0)
    expect(positionBarre(0.1)).toBeCloseTo(0.5, 6)
    expect(positionBarre(0.01)).toBeCloseTo(1, 6)
  })

  it('reste dans [0, 1] : au-delà du top 1 %, c’est le bout', () => {
    expect(positionBarre(0.001)).toBe(1)
    expect(positionBarre(0)).toBe(0)
    expect(positionBarre(-1)).toBe(0)
  })

  it('les trois crans ont chacun leur place', () => {
    expect(CRANS_BARRE).toEqual([50, 15, 1])
    expect(positionCran(50)).toBeCloseTo(0.1505, 3)
    expect(positionCran(15)).toBeCloseTo(0.412, 3)
    expect(positionCran(5)).toBeCloseTo(0.6505, 3)
    expect(positionCran(1)).toBeCloseTo(1, 6)
  })
})

describe('parseCaps', () => {
  it('ne garde que les caps connus, dédoublonnés, du plus large au plus serré', () => {
    expect(parseCaps([1, 50, '30', 50, 20, null])).toEqual([50, 30, 1])
    expect(parseCaps(null)).toEqual([])
    expect(parseCaps('50')).toEqual([])
  })
})

describe('barreTemps', () => {
  it('sans place : pas de curseur, aucun cran pris, le top 50 % à viser', () => {
    const b = barreTemps(null)
    expect(b.position).toBeNull()
    expect(b.crans.map((c) => c.atteint)).toEqual([false, false, false])
    expect(b.prochain).toEqual({ pct: 50, xp: 5 })
    expect(b.atteints).toEqual([])
  })

  it('une place : le curseur, les crans franchis, le prochain cap', () => {
    const b = barreTemps({ rank: 140, total: 1250, seuils: [50] })
    expect(b.position).toBeCloseTo(positionBarre(140 / 1250), 6)
    expect(b.atteints).toEqual([50, 30, 15])
    expect(b.crans).toEqual([
      { pct: 50, at: positionCran(50), atteint: true },
      { pct: 15, at: positionCran(15), atteint: true },
      { pct: 1, at: positionCran(1), atteint: false },
    ])
    expect(b.prochain).toEqual({ pct: 5, xp: 25 })
  })

  it('un cap payé jadis reste pris même si la place a reculé', () => {
    const b = barreTemps({ rank: 9, total: 10, seuils: [50, 30] })
    expect(b.atteints).toEqual([50, 30])
    expect(b.prochain).toEqual({ pct: 15, xp: 15 })
  })

  it('tout pris : plus rien à viser', () => {
    expect(barreTemps({ rank: 1, total: 200 }).prochain).toBeNull()
  })
})
