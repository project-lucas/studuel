import { existsSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { PALIERS_VITRINE, etatVitrine, libelleBanniere, pointsCollection } from './vitrine'
import { GEOMETRIE_BANNIERES } from './bannieres-geometrie'

describe('la bannière du joueur', () => {
  it('compte un point par badge et deux par couronne', () => {
    expect(pointsCollection(4, 0)).toBe(4)
    expect(pointsCollection(4, 3)).toBe(10)
    expect(pointsCollection(Number.NaN, -2)).toBe(0)
  })

  it('part du bronze et dit ce qui manque pour l’argent', () => {
    const e = etatVitrine(4, 0)
    expect(e.palier.nom).toBe('Bronze')
    expect(e.suivant?.nom).toBe('Argent')
    expect(e.manque).toBe(4)
  })

  it('monte au seuil exact', () => {
    expect(etatVitrine(8, 0).palier.rang).toBe(2)
    expect(etatVitrine(10, 5).palier.rang).toBe(3)
  })

  it('s’arrête à la légende', () => {
    const e = etatVitrine(100, 50)
    expect(e.palier.nom).toBe('Légende')
    expect(e.suivant).toBeNull()
    expect(e.manque).toBe(0)
  })

  it('garde des seuils croissants', () => {
    for (let i = 1; i < PALIERS_VITRINE.length; i++) {
      expect(PALIERS_VITRINE[i].seuil).toBeGreaterThan(PALIERS_VITRINE[i - 1].seuil)
    }
  })

  it('accorde l’article au métal', () => {
    expect(libelleBanniere('Bronze')).toBe('de bronze')
    expect(libelleBanniere('Argent')).toBe('d’argent')
    expect(libelleBanniere('Or')).toBe('d’or')
    expect(libelleBanniere('Légende')).toBe('de légende')
  })

  it('a son image et la boîte de son intérieur pour chaque métal', () => {
    for (const p of PALIERS_VITRINE) {
      expect(existsSync(`public/images/moi/banniere/banniere-${p.rang}.webp`)).toBe(true)
      const g = GEOMETRIE_BANNIERES[p.rang]
      expect(g.largeur).toBeGreaterThan(50)
      expect(g.hauteur).toBeGreaterThan(25)
      expect(g.gauche + g.largeur).toBeLessThanOrEqual(100)
      expect(g.haut + g.hauteur).toBeLessThanOrEqual(100)
    }
    for (const nom of ['embleme', 'blason-niveau', 'academie']) {
      expect(existsSync(`public/images/moi/banniere/${nom}.webp`)).toBe(true)
    }
  })
})
