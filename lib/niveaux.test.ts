import { describe, expect, it } from 'vitest'
import {
  estPalier,
  gemmesPalier,
  niveauxAFeter,
  paliersAOuvrir,
  prochainPalier,
  recompenseNiveau,
} from './niveaux'

describe('les paliers de niveau', () => {
  it('tombent tous les 5 niveaux', () => {
    expect([1, 4, 5, 6, 10, 15].map(estPalier)).toEqual([false, false, true, false, true, true])
  })

  it('rapportent 10 gemmes, 25 tous les 25 niveaux (557 : la gemme est rare)', () => {
    expect(gemmesPalier(5)).toBe(10)
    expect(gemmesPalier(10)).toBe(10)
    expect(gemmesPalier(25)).toBe(25)
    expect(gemmesPalier(40)).toBe(10)
    expect(gemmesPalier(50)).toBe(25)
    expect(gemmesPalier(7)).toBe(0)
  })

  it('désignent le prochain palier, strictement après', () => {
    expect(prochainPalier(1)).toBe(5)
    expect(prochainPalier(5)).toBe(10)
    expect(prochainPalier(8)).toBe(10)
  })

  it('listent les coffres atteints et pas encore ouverts', () => {
    expect(paliersAOuvrir(12, [5])).toEqual([10])
    expect(paliersAOuvrir(4, [])).toEqual([])
    expect(paliersAOuvrir(15, [5, 10, 15])).toEqual([])
  })
})

describe('la récompense d’un niveau', () => {
  it('ne verse plus de gemme d’office, seulement un coffre sur un palier', () => {
    expect(recompenseNiveau(7)).toEqual({ niveau: 7, coffre: null })
    expect(recompenseNiveau(10)).toEqual({ niveau: 10, coffre: { gemmes: 10 } })
  })
})

describe('la fête de niveau', () => {
  it('fête les niveaux franchis depuis le dernier vu', () => {
    expect(niveauxAFeter(7, 9)).toEqual([8, 9])
  })

  it('ne fête rien la première fois, ni sans progrès', () => {
    expect(niveauxAFeter(null, 9)).toEqual([])
    expect(niveauxAFeter(9, 9)).toEqual([])
  })
})

describe('miroir SQL : niveau_palier_gemmes (556 → 557)', () => {
  it('suit le même barème que gemmesPalier', async () => {
    const { derniereDefinition } = await import('@/lib/migrations-lecture')
    const def = derniereDefinition('niveau_palier_gemmes')
    expect(def, 'aucune migration ne définit niveau_palier_gemmes').not.toBeNull()
    expect(def!.sql).toMatch(/p_niveau\s*<\s*5\s+OR\s+p_niveau\s*%\s*5\s*<>\s*0\s+THEN\s+0/)
    expect(def!.sql).toMatch(/p_niveau\s*%\s*25\s*=\s*0\s+THEN\s+25\s+ELSE\s+10/)
    // Lire toutes les migrations prend du temps : même délai que les autres miroirs.
  }, 60_000)
})
