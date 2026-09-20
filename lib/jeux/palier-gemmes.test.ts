import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

import {
  AUCUNE_ETOILE,
  GEMMES_PAR_JEU,
  avecGemmesPalier,
  etoilesDeProgression,
  gemmesDesEtoiles,
  gemmesDuPalier,
  gemmesParEtoile,
  lirePalierGemmes,
  lireReclamation,
  resteAReclamer,
} from './palier-gemmes'
import { cheminMigration } from '@/lib/migrations-lecture'

describe('le tarif des étoiles', () => {
  it('palier N → N gemmes par étoile, de l’Éveil au Maître', () => {
    expect([1, 2, 3, 4, 5].map((l) => gemmesParEtoile(l as 1 | 2 | 3 | 4 | 5))).toEqual([1, 2, 3, 4, 5])
    expect(gemmesDuPalier(1)).toBe(3)
    expect(gemmesDuPalier(5)).toBe(15)
  })

  it('un jeu entier vaut 45 gemmes', () => {
    expect(GEMMES_PAR_JEU).toBe(45)
  })

  it('est le miroir du tarif de la migration 373 (le numéro du palier)', () => {
    const sql = readFileSync(
      cheminMigration('373_boost_jour_gemmes_paliers.sql'),
      'utf8',
    )
    expect(sql).toContain('v_montant := public.gemmes_avec_bonus(v_user, v_palier);')
  })

  it('compte ce que valent des étoiles, bornées à 0..3', () => {
    expect(gemmesDesEtoiles([3, 3, 3, 3, 3])).toBe(45)
    expect(gemmesDesEtoiles([2, 1, 0, 0, 0])).toBe(2 + 2)
    expect(gemmesDesEtoiles([9, -1, 0, 0, 0])).toBe(3)
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
    expect(lireReclamation({ ok: true, gemmes: 6, solde: 51, etoiles: [3, 1, 0, 0, 0] })).toEqual({
      ok: true,
      gemmes: 6,
      solde: 51,
      etoiles: [3, 1, 0, 0, 0],
    })
  })

  it('un refus garde sa raison, l’illisible est une panne', () => {
    expect(lireReclamation({ ok: false, raison: 'inconnu' })).toEqual({ ok: false, raison: 'inconnu' })
    expect(lireReclamation(null)).toEqual({ ok: false, raison: 'panne' })
    expect(lireReclamation('oui')).toEqual({ ok: false, raison: 'panne' })
  })
})

describe('avecGemmesPalier', () => {
  it('ajoute une ligne de gemmes quand la partie en a rapporté', () => {
    expect(avecGemmesPalier([{ unite: 'xp', montant: 10 }], 4)).toEqual([
      { unite: 'xp', montant: 10 },
      { unite: 'gemme', montant: 4 },
    ])
  })

  it('additionne au gain de gemmes déjà là, jamais deux lignes', () => {
    expect(avecGemmesPalier([{ unite: 'gemme', montant: 20 }], 3)).toEqual([
      { unite: 'gemme', montant: 23 },
    ])
  })

  it('rien de plus sans gemmes de palier', () => {
    const gains = [{ unite: 'xp' as const, montant: 5 }]
    expect(avecGemmesPalier(gains, null)).toEqual(gains)
    expect(avecGemmesPalier(gains, 0)).toEqual(gains)
  })
})
