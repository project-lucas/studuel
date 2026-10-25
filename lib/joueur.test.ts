import { describe, expect, it } from 'vitest'
import { barreNiveau, ligneRang, piedDuPortrait, xpSemaineDepuisClassement } from './joueur'
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
