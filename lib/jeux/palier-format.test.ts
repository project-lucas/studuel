import { describe, expect, it } from 'vitest'
import { GAME_FORMATS, MIN_WAVE_SECONDS, poolSizeFor } from './formats'
import { bankBrief, hasGradedBank, palierChips, scaleFormat } from './palier-format'
import { DEFAULT_PALIER, PALIER_LEVELS, type PalierLevel } from './paliers'

const FORMATS = Object.values(GAME_FORMATS)

describe('scaleFormat', () => {
  it('rend le format INTACT au palier de référence', () => {
    for (const format of FORMATS) {
      expect(scaleFormat(format, DEFAULT_PALIER)).toBe(format)
    }
  })

  it('garde la mécanique, la robe et le lexique du jeu', () => {
    for (const format of FORMATS) {
      for (const level of PALIER_LEVELS) {
        const scaled = scaleFormat(format, level)
        expect(scaled.params.mechanic).toBe(format.params.mechanic)
        expect(scaled.theme).toBe(format.theme)
        expect(scaled.lexicon).toEqual(format.lexicon)
      }
    }
  })

  it('laisse toujours au moins une vie', () => {
    for (const format of FORMATS) {
      for (const level of PALIER_LEVELS) {
        const p = scaleFormat(format, level).params
        if (p.mechanic === 'vies') expect(p.vies.lives).toBeGreaterThanOrEqual(1)
        if (p.mechanic === 'paliers') {
          expect(p.paliers.lives).toBeGreaterThanOrEqual(1)
        }
        if (p.mechanic === 'ordre' && p.ordre.lives !== null) {
          expect(p.ordre.lives).toBeGreaterThanOrEqual(1)
        }
      }
    }
  })

  it('ne descend jamais un chrono sous le plancher jouable', () => {
    for (const format of FORMATS) {
      for (const level of PALIER_LEVELS) {
        const p = scaleFormat(format, level).params
        if (p.mechanic === 'paliers') {
          expect(p.paliers.startSeconds).toBeGreaterThan(MIN_WAVE_SECONDS)
        }
        if (p.mechanic === 'vies' && p.vies.questionSeconds !== null) {
          expect(p.vies.questionSeconds).toBeGreaterThanOrEqual(3)
        }
        if (p.mechanic === 'expedition') {
          expect(p.expedition.questionSeconds).toBeGreaterThanOrEqual(3)
        }
      }
    }
  })

  it('presse le temps quand le palier monte, et le desserre quand il descend', () => {
    // Le calcul mental est à paliers : son chrono de départ est le témoin.
    const bas = scaleFormat(GAME_FORMATS['calcul-mental'], 1).params
    const haut = scaleFormat(GAME_FORMATS['calcul-mental'], 5).params
    if (bas.mechanic !== 'paliers' || haut.mechanic !== 'paliers') {
      throw new Error('le calcul mental doit rester une mécanique à paliers')
    }
    expect(bas.paliers.startSeconds).toBeGreaterThan(haut.paliers.startSeconds)
    expect(bas.paliers.lives).toBeGreaterThan(haut.paliers.lives)
    expect(bas.paliers.waves).toBeLessThan(haut.paliers.waves)
  })

  it('ne fait pas varier la durée d’un sprint — c’est sa promesse', () => {
    const base = GAME_FORMATS['traduction-flash'].params
    for (const level of PALIER_LEVELS) {
      const p = scaleFormat(GAME_FORMATS['traduction-flash'], level).params
      if (base.mechanic !== 'sprint' || p.mechanic !== 'sprint') {
        throw new Error('la traduction flash doit rester un sprint')
      }
      expect(p.sprint.seconds).toBe(base.sprint.seconds)
    }
  })

  it('garde une banque calculable pour chaque palier', () => {
    for (const format of FORMATS) {
      for (const level of PALIER_LEVELS) {
        const size = poolSizeFor(scaleFormat(format, level))
        expect(Number.isFinite(size)).toBe(true)
        expect(size).toBeGreaterThan(0)
      }
    }
  })
})

describe('la règle affichée', () => {
  it('est la règle d’origine au palier de référence', () => {
    for (const format of FORMATS) {
      expect(scaleFormat(format, DEFAULT_PALIER).rule).toBe(format.rule)
    }
  })

  it('est RÉÉCRITE ailleurs — la règle d’origine porte des chiffres devenus faux', () => {
    for (const format of FORMATS) {
      for (const level of PALIER_LEVELS) {
        if (level === DEFAULT_PALIER) continue
        const scaled = scaleFormat(format, level)
        expect(scaled.rule).not.toBe(format.rule)
        expect(scaled.rule).toContain(`Palier ${level}`)
      }
    }
  })

  it('annonce les chiffres RÉELS du format re-réglé', () => {
    const scaled = scaleFormat(GAME_FORMATS['faux-amis'], 5)
    if (scaled.params.mechanic !== 'vies') throw new Error('mécanique inattendue')
    expect(scaled.rule).toContain(String(scaled.params.vies.target))
    expect(scaled.rule).toContain(String(scaled.params.vies.lives))
  })
})

describe('les jetons de la carte', () => {
  it('donnent au moins un chiffre à lire pour chaque jeu et chaque palier', () => {
    for (const format of FORMATS) {
      for (const level of PALIER_LEVELS) {
        expect(palierChips(format, level).length).toBeGreaterThan(0)
      }
    }
  })

  it('annoncent la banque UNIQUEMENT là où elle est réellement graduée', () => {
    expect(hasGradedBank('calcul-mental')).toBe(true)
    expect(hasGradedBank('capitales')).toBe(false)
    expect(bankBrief('capitales', 5)).toBeNull()
    for (const level of PALIER_LEVELS) {
      expect(bankBrief('calcul-mental', level)).toBeTruthy()
    }
  })

  it('décrit une banque différente à chaque palier gradué', () => {
    for (const id of ['calcul-mental', 'conjugaison-eclair']) {
      const briefs = PALIER_LEVELS.map((l: PalierLevel) => bankBrief(id, l))
      expect(new Set(briefs).size).toBe(PALIER_LEVELS.length)
    }
  })
})
