import { describe, expect, it } from 'vitest'
import { CADRES, cadreDuNiveau, cadreSuivant, imageCadre, libelleCadre, phraseCadreSuivant } from '@/lib/moi/cadre-profil'

describe('cadreDuNiveau', () => {
  it('le niveau 1 reste une photo accrochée', () => {
    expect(cadreDuNiveau(1).id).toBe('polaroid')
  })
  it('quelques quiz suffisent pour le bronze', () => {
    expect(cadreDuNiveau(2).id).toBe('bronze')
  })
  it('suit les paliers, au niveau exact', () => {
    expect(cadreDuNiveau(5).id).toBe('bronze')
    expect(cadreDuNiveau(6).id).toBe('argent')
    expect(cadreDuNiveau(8).id).toBe('argent')
    expect(cadreDuNiveau(12).id).toBe('or')
    expect(cadreDuNiveau(200).id).toBe('legende')
  })
  it('résiste à une valeur absurde', () => {
    expect(cadreDuNiveau(Number.NaN).id).toBe('polaroid')
  })
})

describe('cadreSuivant', () => {
  it('dit le prochain cadre et ce qui manque', () => {
    expect(cadreSuivant(8)).toEqual({ cadre: expect.objectContaining({ id: 'or' }), manque: 4 })
  })
  it('rien au sommet', () => {
    expect(cadreSuivant(75)).toBeNull()
  })
})

describe('les paliers', () => {
  it('montent strictement et s’écartent', () => {
    const niveaux = CADRES.map((c) => c.niveau)
    const pas = niveaux.slice(1).map((n, i) => n - niveaux[i])
    expect(niveaux).toEqual([...niveaux].sort((a, b) => a - b))
    expect(pas.slice(2).every((p, i) => p >= pas[i + 1])).toBe(true)
  })
})

describe('libellés et images', () => {
  it('élide devant une voyelle', () => {
    expect(libelleCadre(cadreDuNiveau(6))).toBe('Cadre d’argent')
    expect(libelleCadre(cadreDuNiveau(2))).toBe('Cadre de bronze')
    expect(libelleCadre(cadreDuNiveau(42))).toBe('Cadre d’émeraude')
    expect(libelleCadre(cadreDuNiveau(1))).toBe('Photo accrochée')
  })
  it('le polaroid n’a pas d’image', () => {
    expect(imageCadre(cadreDuNiveau(1))).toBeNull()
    expect(imageCadre(cadreDuNiveau(12))).toBe('/images/moi/cadres/or.webp')
  })
})

describe('phraseCadreSuivant', () => {
  it('écrit l’article juste', () => {
    expect(phraseCadreSuivant(8)).toBe('niv. 12 pour l’or')
    expect(phraseCadreSuivant(12)).toBe('niv. 20 pour le platine')
    expect(phraseCadreSuivant(1)).toBe('niv. 2 pour le bronze')
    expect(phraseCadreSuivant(80)).toBeNull()
  })
})
