import { describe, expect, it } from 'vitest'
import {
  DECOUVERTES,
  DERNIER_NIVEAU_DECOUVERTE,
  decouverteParCle,
  decouvertesAuNiveau,
  decouvertesOuvertes,
  estCleDecouverte,
  niveauDOuverture,
} from './catalogue'

describe('le catalogue des découvertes', () => {
  it('a des clés uniques, en kebab-case, et un niveau entier ≥ 1', () => {
    const cles = DECOUVERTES.map((d) => d.cle)
    expect(new Set(cles).size).toBe(cles.length)
    for (const d of DECOUVERTES) {
      expect(d.cle).toMatch(/^[a-z][a-z0-9-]*$/)
      expect(Number.isInteger(d.niveau)).toBe(true)
      expect(d.niveau).toBeGreaterThanOrEqual(1)
      expect(d.href.startsWith('/')).toBe(true)
      expect(d.etapes.length).toBeGreaterThan(0)
    }
  })

  it('ne verrouille jamais Réviser ni Moi', () => {
    for (const d of DECOUVERTES) {
      expect(d.onglet).not.toBe('reviser')
      expect(d.onglet).not.toBe('moi')
    }
    expect(niveauDOuverture('reviser')).toBe(1)
    expect(niveauDOuverture('moi')).toBe(1)
  })

  it('verrouille chaque onglet par UNE seule découverte', () => {
    const onglets = DECOUVERTES.map((d) => d.onglet).filter((o) => o !== null)
    expect(new Set(onglets).size).toBe(onglets.length)
  })

  it('ouvre quelque chose dès le premier jour', () => {
    expect(decouvertesAuNiveau(1).map((d) => d.cle)).toContain('reviser')
  })

  it('dit ce qu’un niveau ouvre et ce qui est ouvert', () => {
    expect(decouvertesAuNiveau(2).map((d) => d.cle)).toEqual(['marcel', 'bibliotheque', 'defi'])
    expect(decouvertesOuvertes(1).every((d) => d.niveau === 1)).toBe(true)
    expect(decouvertesOuvertes(DERNIER_NIVEAU_DECOUVERTE)).toHaveLength(DECOUVERTES.length)
    expect(niveauDOuverture('amis')).toBe(3)
    expect(niveauDOuverture('defi')).toBe(2)
  })

  it('retrouve une découverte par sa clé, et rien pour une clé inconnue', () => {
    expect(decouverteParCle('defi')?.nom).toBe('L’arène')
    expect(decouverteParCle('inconnue')).toBeNull()
    expect(estCleDecouverte('defi')).toBe(true)
    expect(estCleDecouverte('inconnue')).toBe(false)
    expect(estCleDecouverte(3)).toBe(false)
  })
})
