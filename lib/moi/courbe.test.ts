import { describe, it, expect } from 'vitest'
import {
  cheminArrondi,
  cheminRempli,
  pointsDeCreneau,
  pointsDeSerie,
  type Point,
} from './courbe'

describe('cheminArrondi', () => {
  it('ne rend rien sans point', () => {
    expect(cheminArrondi([], 4)).toBe('')
  })

  it('rend un simple déplacement pour un point unique', () => {
    expect(cheminArrondi([{ x: 1, y: 2 }], 4)).toBe('M 1 2')
  })

  it('trace une droite entre deux points, sans courbe', () => {
    const d = cheminArrondi(
      [
        { x: 0, y: 0 },
        { x: 10, y: 0 },
      ],
      4,
    )
    expect(d).toBe('M 0 0 L 10 0')
    expect(d).not.toContain('Q')
  })

  it('adoucit l’angle d’un créneau', () => {
    const d = cheminArrondi(
      [
        { x: 0, y: 10 },
        { x: 10, y: 10 },
        { x: 10, y: 0 },
      ],
      3,
    )
    // L'angle est remplacé par une entrée, une courbe quadratique, une sortie.
    expect(d).toBe('M 0 10 L 7 10 Q 10 10 10 7 L 10 0')
  })

  it('rabote le rayon quand les points sont trop rapprochés', () => {
    // Segments de longueur 2 : le rayon demandé (10) ne peut pas dépasser 1.
    const d = cheminArrondi(
      [
        { x: 0, y: 0 },
        { x: 2, y: 0 },
        { x: 2, y: 2 },
      ],
      10,
    )
    expect(d).toBe('M 0 0 L 1 0 Q 2 0 2 1 L 2 2')
  })

  it('n’insère pas de courbe sur deux points confondus', () => {
    const d = cheminArrondi(
      [
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 5, y: 0 },
      ],
      4,
    )
    expect(d).toBe('M 0 0 L 0 0 L 5 0')
  })

  it('arrondit les coordonnées à deux décimales', () => {
    const d = cheminArrondi(
      [
        { x: 0.123456, y: 1.987654 },
        { x: 3.14159, y: 2 },
      ],
      2,
    )
    expect(d).toBe('M 0.12 1.99 L 3.14 2')
  })
})

describe('cheminRempli', () => {
  it('referme le tracé sur le bas du cadre', () => {
    const points: Point[] = [
      { x: 0, y: 5 },
      { x: 10, y: 2 },
    ]
    const ligne = cheminArrondi(points, 2)
    expect(cheminRempli(ligne, points, 20)).toBe('M 0 5 L 10 2 L 10 20 L 0 20 Z')
  })

  it('ne rend rien sans tracé', () => {
    expect(cheminRempli('', [], 10)).toBe('')
  })
})

describe('pointsDeSerie', () => {
  it('étale les points sur toute la largeur', () => {
    const p = pointsDeSerie([1, 2, 3], 100, 50)
    expect(p.map((pt) => pt.x)).toEqual([0, 50, 100])
  })

  it('met la plus grande valeur en haut et zéro en bas', () => {
    const p = pointsDeSerie([0, 10], 100, 50)
    expect(p[0].y).toBe(50)
    expect(p[1].y).toBe(0)
  })

  it('respecte la marge demandée', () => {
    const p = pointsDeSerie([0, 10], 100, 50, 5)
    expect(p[0].x).toBe(5)
    expect(p[1].x).toBe(95)
    expect(p[0].y).toBe(45)
    expect(p[1].y).toBe(5)
  })

  it('pose une série toute plate à mi-hauteur, pas écrasée sur l’axe', () => {
    const p = pointsDeSerie([0, 0, 0], 100, 50)
    expect(p.every((pt) => pt.y === 25)).toBe(true)
  })

  it('traite les valeurs aberrantes comme zéro', () => {
    const p = pointsDeSerie([Number.NaN, 10, -5], 100, 50)
    expect(p[0].y).toBe(50)
    expect(p[1].y).toBe(0)
    expect(p[2].y).toBe(50)
  })

  it('ne rend rien sur une série vide', () => {
    expect(pointsDeSerie([], 100, 50)).toEqual([])
  })
})

describe('pointsDeCreneau', () => {
  it('donne deux points par jour — un palier, pas une diagonale', () => {
    const p = pointsDeCreneau([true, false], 100, 20)
    expect(p).toHaveLength(4)
    expect(p[0]).toEqual({ x: 0, y: 0 })
    expect(p[1]).toEqual({ x: 50, y: 0 })
    expect(p[2]).toEqual({ x: 50, y: 20 })
    expect(p[3]).toEqual({ x: 100, y: 20 })
  })

  it('garde un jour tenu en HAUT du cadre (y petit en SVG)', () => {
    const p = pointsDeCreneau([true], 10, 20)
    expect(p.every((pt) => pt.y === 0)).toBe(true)
  })

  it('ne rend rien sur une série vide', () => {
    expect(pointsDeCreneau([], 100, 20)).toEqual([])
  })
})
