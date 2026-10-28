import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { ARENA_SCHEDULE } from './arena-background'
import {
  barreNiveau,
  bureauDuPortrait,
  DECOR_JOUEUR,
  decorBureau,
  ligneRang,
  periodeInitiale,
  piedDuPortrait,
  xpSemaineDepuisClassement,
} from './joueur'
import { PORTRAIT_KEYS } from './portraits'
import { walletLevelInfo } from './wallet'

describe('barreNiveau', () => {
  it('compte l’XP depuis le plancher du niveau, pas depuis zéro', () => {
    // Niveau 7 commence à 50·7·6 = 2 100 XP, le niveau 8 à 2 800.
    const b = barreNiveau(walletLevelInfo(2440))
    expect(b).toEqual({ level: 7, fait: 340, pas: 700, reste: 360, pct: 49 })
  })

  it('écrit 0 % sur un niveau tout juste atteint', () => {
    const b = barreNiveau(walletLevelInfo(2100))
    expect(b.fait).toBe(0)
    expect(b.pct).toBe(0)
    expect(b.reste).toBe(700)
  })

  it('ne dépasse jamais le pas, même avec une XP incohérente', () => {
    const b = barreNiveau({ level: 3, currentXp: 9_999, nextAt: 600 })
    expect(b.fait).toBe(b.pas)
    expect(b.pct).toBe(100)
    expect(b.reste).toBe(0)
  })
})

describe('ligneRang', () => {
  it('joint le niveau et la division, ou le niveau seul', () => {
    expect(ligneRang(7, 'Argent II')).toBe('Niveau 7 · Argent II')
    expect(ligneRang(1, null)).toBe('Niveau 1')
  })
})

describe('xpSemaineDepuisClassement', () => {
  it('relit ma ligne dans la réponse de classement_amis()', () => {
    const brut = [
      { id: 'lea', nom: 'Léa', moi: false, xp_semaine: 900 },
      { id: 'moi', nom: 'Lucas', moi: true, xp_semaine: 320 },
    ]
    expect(xpSemaineDepuisClassement(brut)).toBe(320)
  })

  it('rend null sans ma ligne ou sans la colonne (558 absente)', () => {
    expect(xpSemaineDepuisClassement(null)).toBeNull()
    expect(xpSemaineDepuisClassement([{ id: 'lea', nom: 'Léa', moi: false, xp_semaine: 1 }])).toBeNull()
    expect(xpSemaineDepuisClassement([{ id: 'moi', nom: 'Lucas', moi: true }])).toBeNull()
  })
})

describe('piedDuPortrait', () => {
  it('ne dessine debout que les treize portraits libres', () => {
    expect(piedDuPortrait('7')).toBe('/images/profil/pied/7.webp')
    expect(piedDuPortrait('perso:charlemagne')).toBeNull()
    expect(piedDuPortrait('')).toBeNull()
    expect(piedDuPortrait(undefined)).toBeNull()
  })
})

describe('DECOR_JOUEUR', () => {
  it('est une image servie depuis public/images/joueur', () => {
    expect(DECOR_JOUEUR).toMatch(/^\/images\/joueur\/[a-z-]+\.webp$/)
  })
})

describe('bureauDuPortrait', () => {
  it('n’assoit au bureau que les treize portraits libres', () => {
    expect(bureauDuPortrait('7')).toBe('7')
    expect(bureauDuPortrait('perso:charlemagne')).toBeNull()
    expect(bureauDuPortrait('')).toBeNull()
    expect(bureauDuPortrait(undefined)).toBeNull()
  })
})

describe('decorBureau', () => {
  it('nomme la scène par le portrait et la plage', () => {
    expect(decorBureau('7', 'night')).toBe('/images/joueur/bureau/7-night.webp')
  })

  it('a ses 78 scènes servies (13 portraits × 6 plages)', () => {
    const PUBLIC = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public')
    const manquantes = PORTRAIT_KEYS.flatMap((k) =>
      ARENA_SCHEDULE.map((s) => decorBureau(k, s.period)).filter((src) => !existsSync(path.join(PUBLIC, src))),
    )
    expect(manquantes).toEqual([])
  })
})

describe('periodeInitiale', () => {
  it('lit la plage à l’heure de Paris, pas en UTC', () => {
    // 21 h 30 UTC un 27 octobre = 22 h 30 à Paris (heure d'hiver) : la nuit.
    expect(periodeInitiale(new Date('2026-10-27T21:30:00Z'))).toBe('night')
    // 11 h 30 UTC un 1er juillet = 13 h 30 à Paris (heure d'été) : midi.
    expect(periodeInitiale(new Date('2026-07-01T11:30:00Z'))).toBe('noon')
    // 4 h 30 UTC un 1er juillet = 6 h 30 à Paris : l'aube, alors qu'en UTC c'est encore la nuit.
    expect(periodeInitiale(new Date('2026-07-01T04:30:00Z'))).toBe('dawn')
  })
})
