import { describe, expect, it } from 'vitest'
import { allPalierIds, rankPalier, leaguePalier } from './palier'
import { RANK_TIERS, tierFloor } from './rank'
import { LEAGUE_TIERS, MAX_TIER } from './league'

describe('rankPalier', () => {
  it('détecte le franchissement d’un palier vers le haut', () => {
    // Arrange : 390 → 410 franchit le seuil 400 (Bronze I → Argent IV).
    const palier = rankPalier(390, 410)

    // Assert
    expect(palier).not.toBeNull()
    expect(palier?.id).toBe('rang:argent')
    expect(palier?.name).toBe('Argent')
    expect(palier?.shareText).toContain('Studuel')
  })

  it('fête le palier le plus haut si plusieurs seuils sautent d’un coup', () => {
    expect(rankPalier(390, 1250)?.id).toBe('rang:platine')
  })

  it('ne fête PAS un simple changement de division', () => {
    // 50 → 150 passe de Bronze IV à Bronze III : même palier, pas de bulle
    // plein écran (sinon une célébration tous les 100 trophées).
    expect(rankPalier(50, 150)).toBeNull()
  })

  it('ne fête rien sans franchissement ni en descente', () => {
    expect(rankPalier(410, 420)).toBeNull() // même palier
    expect(rankPalier(410, 390)).toBeNull() // descente
    expect(rankPalier(400, 400)).toBeNull() // aucun mouvement
  })

  it('couvre chaque seuil de palier (hors premier, qui démarre à 0)', () => {
    for (const tier of RANK_TIERS.slice(1)) {
      const floor = tierFloor(tier.id)
      const palier = rankPalier(floor - 1, floor)
      expect(palier?.id, tier.id).toBe(`rang:${tier.id}`)
      expect(palier?.emoji).toBe(tier.emoji)
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
