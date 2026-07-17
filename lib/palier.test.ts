import { describe, expect, it } from 'vitest'
import { allPalierIds, arenaPalier, leaguePalier } from './palier'
import { ARENAS } from './trophies'
import { LEAGUE_TIERS, MAX_TIER } from './league'

describe('arenaPalier', () => {
  it('détecte le franchissement d’un seuil d’arène vers le haut', () => {
    // Arrange : 290 → 310 franchit le seuil 300 (Salle d'étude).
    const palier = arenaPalier(290, 310)

    // Assert
    expect(palier).not.toBeNull()
    expect(palier?.id).toBe('arene:etude')
    expect(palier?.name).toBe("Salle d'étude")
    expect(palier?.shareText).toContain('Studuel')
  })

  it('fête l’arène la plus haute si plusieurs seuils sautent d’un coup', () => {
    const palier = arenaPalier(290, 750)
    expect(palier?.id).toBe('arene:honneur')
  })

  it('ne fête rien sans franchissement ni en descente', () => {
    expect(arenaPalier(310, 320)).toBeNull() // même arène
    expect(arenaPalier(310, 290)).toBeNull() // descente
    expect(arenaPalier(300, 300)).toBeNull() // aucun mouvement
  })

  it('couvre chaque seuil d’arène (hors première, qui démarre à 0)', () => {
    for (const arena of ARENAS.slice(1)) {
      const palier = arenaPalier(arena.min - 1, arena.min)
      expect(palier?.id, arena.id).toBe(`arene:${arena.id}`)
      expect(palier?.emoji).toBe(arena.emoji)
    }
  })
})

describe('leaguePalier', () => {
  it('fête une promotion d’un palier', () => {
    const palier = leaguePalier(1, 2)
    expect(palier?.id).toBe('ligue:2')
    expect(palier?.name).toBe('Ligue Or')
    expect(palier?.title).toBe('Promotion !')
  })

  it('adapte le message au sommet (Ligue Maître)', () => {
    const palier = leaguePalier(MAX_TIER - 1, MAX_TIER)
    expect(palier?.name).toBe(LEAGUE_TIERS[MAX_TIER].name)
    expect(palier?.subtitle).toContain('sommet')
  })

  it('ne fête ni la première visite, ni la relégation, ni le surplace', () => {
    expect(leaguePalier(null, 3)).toBeNull() // première visite : on mémorise
    expect(leaguePalier(3, 2)).toBeNull() // relégation
    expect(leaguePalier(3, 3)).toBeNull() // surplace
  })

  it('borne un palier hors limites au maximum connu', () => {
    const palier = leaguePalier(MAX_TIER, MAX_TIER + 3)
    expect(palier?.id).toBe(`ligue:${MAX_TIER}`)
  })
})

describe('allPalierIds', () => {
  it('ne contient aucune collision de clé', () => {
    const ids = allPalierIds()
    expect(new Set(ids).size).toBe(ids.length)
  })
})
