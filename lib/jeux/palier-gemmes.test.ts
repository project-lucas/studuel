import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

import {
  AUCUNE_ETOILE,
  XP_PAR_JEU,
  avecXpPalier,
  etoilesDeProgression,
  xpDesEtoiles,
  xpDuPalier,
  xpParEtoile,
  lirePalierGemmes,
  lireReclamation,
  resteAReclamer,
} from './palier-gemmes'
import { cheminMigration } from '@/lib/migrations-lecture'

describe('le tarif des étoiles', () => {
  it('palier N → 5 × N XP par étoile, de l’Éveil au Maître (557)', () => {
    expect([1, 2, 3, 4, 5].map((l) => xpParEtoile(l as 1 | 2 | 3 | 4 | 5))).toEqual([5, 10, 15, 20, 25])
    expect(xpDuPalier(1)).toBe(15)
    expect(xpDuPalier(5)).toBe(75)
  })

  it('un jeu entier vaut 225 XP', () => {
    expect(XP_PAR_JEU).toBe(225)
  })

  it('est le miroir du tarif de la migration 557 (5 × le numéro du palier)', () => {
    const sql = readFileSync(cheminMigration('557_economie_xp_partout.sql'), 'utf8')
    expect(sql).toContain('5 * v_palier);')
  })

  it('compte ce que valent des étoiles, bornées à 0..3', () => {
    expect(xpDesEtoiles([3, 3, 3, 3, 3])).toBe(225)
    expect(xpDesEtoiles([2, 1, 0, 0, 0])).toBe(10 + 10)
    expect(xpDesEtoiles([9, -1, 0, 0, 0])).toBe(15)
  })
})

describe('la progression locale', () => {
  it('range les étoiles du stockage local, palier par palier', () => {
    expect(
      etoilesDeProgression({
        1: { stars: 3, best: 10 },
        3: { stars: 1, best: 4 },
      } as never),
    ).toEqual([3, 0, 1, 0, 0])
    expect(etoilesDeProgression({})).toEqual(AUCUNE_ETOILE)
  })

  it('dit s’il reste des étoiles à faire payer', () => {
    expect(resteAReclamer([2, 0, 0, 0, 0], [2, 0, 0, 0, 0])).toBe(false)
    expect(resteAReclamer([3, 0, 0, 0, 0], [2, 0, 0, 0, 0])).toBe(true)
    // Plus d'étoiles payées qu'en local (stockage vidé) : rien à réclamer.
    expect(resteAReclamer([0, 0, 0, 0, 0], [3, 3, 0, 0, 0])).toBe(false)
  })
})

describe('lirePalierGemmes', () => {
  it('lignes de la base → étoiles payées par palier', () => {
    expect(
      lirePalierGemmes([
        { palier: 1, etoiles: 3 },
        { palier: 4, etoiles: 2 },
      ]),
    ).toEqual([3, 0, 0, 2, 0])
  })

  it('ignore le reste sans casser', () => {
    expect(lirePalierGemmes(null)).toEqual(AUCUNE_ETOILE)
    expect(lirePalierGemmes([{ palier: 9, etoiles: 3 }, 'x', { palier: 2, etoiles: 7 }])).toEqual([
      0, 3, 0, 0, 0,
    ])
  })
})

describe('lireReclamation', () => {
  it('lit une réponse réussie', () => {
    expect(lireReclamation({ ok: true, gemmes: 0, xp: 30, solde: 51, etoiles: [3, 1, 0, 0, 0] })).toEqual({
      ok: true,
      xp: 30,
      etoiles: [3, 1, 0, 0, 0],
    })
  })

  it('un refus garde sa raison, l’illisible est une panne', () => {
    expect(lireReclamation({ ok: false, raison: 'inconnu' })).toEqual({ ok: false, raison: 'inconnu' })
    expect(lireReclamation(null)).toEqual({ ok: false, raison: 'panne' })
    expect(lireReclamation('oui')).toEqual({ ok: false, raison: 'panne' })
  })
})

describe('avecXpPalier', () => {
  it('ajoute une ligne d’XP quand la partie n’en avait pas', () => {
    expect(avecXpPalier([{ unite: 'trophee', montant: 8 }], 15)).toEqual([
      { unite: 'trophee', montant: 8 },
      { unite: 'xp', montant: 15 },
    ])
  })

  it('additionne à l’XP déjà là, jamais deux lignes', () => {
    expect(avecXpPalier([{ unite: 'xp', montant: 12 }], 10)).toEqual([{ unite: 'xp', montant: 22 }])
  })

  it('rien de plus sans XP d’étoiles', () => {
    const gains = [{ unite: 'xp' as const, montant: 5 }]
    expect(avecXpPalier(gains, null)).toEqual(gains)
    expect(avecXpPalier(gains, 0)).toEqual(gains)
  })
})
