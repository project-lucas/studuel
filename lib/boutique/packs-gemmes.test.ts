import { describe, expect, it } from 'vitest'
import { migrationSql } from '@/lib/migrations-lecture'
import {
  PACKS_GEMMES,
  TITRE_PACK_CQW_MAX,
  libelleQuantite,
  packParId,
  tailleTitrePack,
  tasDeCristaux,
} from './packs-gemmes'

describe('le catalogue des packs de gemmes', () => {
  it('range trois packs du plus petit au plus gros, plus chers à mesure', () => {
    expect(PACKS_GEMMES.map((p) => p.id)).toEqual(['poignee', 'sac', 'baril'])
    for (let i = 1; i < PACKS_GEMMES.length; i++) {
      expect(PACKS_GEMMES[i].gemmes).toBeGreaterThan(PACKS_GEMMES[i - 1].gemmes)
      expect(PACKS_GEMMES[i].prixEuros).toBeGreaterThan(PACKS_GEMMES[i - 1].prixEuros)
    }
  })

  it('est identique au seed de la migration 369 (quantités et prix)', () => {
    // Le crédit lit la base, la vitrine lit ce fichier : un écart ferait
    // afficher un prix et en demander un autre.
    const sql = migrationSql('369_packs_gemmes.sql')
    const seed = [...sql.matchAll(/\('([a-z]+)',\s*'([^']+)',\s*(\d+),\s*([\d.]+),\s*\d+\)/g)].map((m) => ({
      id: m[1],
      titre: m[2],
      gemmes: Number(m[3]),
      prixEuros: Number(m[4]),
    }))
    expect(seed).toEqual(PACKS_GEMMES.map(({ id, titre, gemmes, prixEuros }) => ({ id, titre, gemmes, prixEuros })))
  })

  it('retrouve un pack par son id, et rien pour un id inconnu', () => {
    expect(packParId('baril')?.gemmes).toBe(1200)
    expect(packParId('seau')).toBeNull()
  })

  it('écrit les quantités à la française', () => {
    expect(libelleQuantite(1200)).toBe('1 200')
    expect(libelleQuantite(80)).toBe('80')
  })
})

describe('le nom d’un pack sur sa carte', () => {
  it('garde la taille du modèle pour un nom court', () => {
    expect(tailleTitrePack('Sac')).toBe(TITRE_PACK_CQW_MAX)
  })

  it('se resserre pour un nom long, sans jamais déborder de la carte', () => {
    expect(tailleTitrePack('Quelques gemmes')).toBeLessThan(tailleTitrePack('Sac de gemmes'))
    for (const titre of [...PACKS_GEMMES.map((p) => p.titre), 'Un très long nom de pack de gemmes']) {
      // largeur estimée = caractères × 0,56 em × taille : ≤ 87 % de la carte
      expect(titre.length * 0.56 * tailleTitrePack(titre)).toBeLessThanOrEqual(87)
    }
  })
})

describe('le tas de cristaux de repli', () => {
  it('grossit avec le pack et reste dans sa case', () => {
    const tailles = PACKS_GEMMES.map((p) => tasDeCristaux(p).length)
    expect(tailles).toEqual([3, 5, 7])
    for (const pack of PACKS_GEMMES) {
      for (const c of tasDeCristaux(pack)) {
        expect(c.x - c.taille / 2).toBeGreaterThanOrEqual(0)
        expect(c.x + c.taille / 2).toBeLessThanOrEqual(100)
        expect(c.bas + c.taille).toBeLessThanOrEqual(100)
      }
    }
  })

  it('dessine toujours le même tas pour le même pack', () => {
    expect(tasDeCristaux(PACKS_GEMMES[2])).toEqual(tasDeCristaux(PACKS_GEMMES[2]))
  })
})
