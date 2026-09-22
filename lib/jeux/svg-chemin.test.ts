import { describe, expect, it } from 'vitest'
import {
  airePolygone,
  aplatirChemin,
  boiteEnglobante,
  distanceALaLigne,
  distanceAuPolygone,
  pointDansForme,
  pointDansPolygone,
} from '@/lib/jeux/svg-chemin'

describe('aplatirChemin', () => {
  it('lit un rectangle en lignes droites', () => {
    const [poly] = aplatirChemin('M0 0 L10 0 L10 5 L0 5 Z')
    expect(poly).toEqual([
      [0, 0],
      [10, 0],
      [10, 5],
      [0, 5],
    ])
  })

  it('accepte H, V et les commandes relatives', () => {
    const [poly] = aplatirChemin('m1 1 h4 v3 l-4 0 z')
    expect(poly).toEqual([
      [1, 1],
      [5, 1],
      [5, 4],
      [1, 4],
    ])
  })

  it('accepte les paramètres répétés sans re-écrire la commande', () => {
    const [poly] = aplatirChemin('M0 0 L1 0 2 0 3 0')
    expect(poly).toHaveLength(4)
    expect(poly[3]).toEqual([3, 0])
  })

  it('aplatit une courbe cubique en passant par ses extrémités', () => {
    const [poly] = aplatirChemin('M0 0 C0 10 10 10 10 0')
    expect(poly[0]).toEqual([0, 0])
    expect(poly[poly.length - 1]).toEqual([10, 0])
    // Le milieu de la courbe est à (5, 7.5) : il doit être approché.
    const milieu = poly[Math.floor(poly.length / 2)]
    expect(milieu[0]).toBeCloseTo(5, 5)
    expect(milieu[1]).toBeCloseTo(7.5, 5)
  })

  it('reflète le contrôle précédent pour S et T', () => {
    const [lisse] = aplatirChemin('M0 0 C0 10 10 10 10 0 S20 -10 20 0')
    const [explicite] = aplatirChemin('M0 0 C0 10 10 10 10 0 C10 -10 20 -10 20 0')
    expect(lisse).toEqual(explicite)
    const [t] = aplatirChemin('M0 0 Q5 10 10 0 T20 0')
    const [q] = aplatirChemin('M0 0 Q5 10 10 0 Q15 -10 20 0')
    expect(t).toEqual(q)
  })

  it('sépare les sous-chemins à chaque M', () => {
    const polys = aplatirChemin('M0 0 L1 0 L1 1 Z M5 5 L6 5 L6 6 Z')
    expect(polys).toHaveLength(2)
    expect(polys[1][0]).toEqual([5, 5])
  })

  it('refuse un arc, une commande inconnue et un chemin vide', () => {
    expect(() => aplatirChemin('M0 0 A5 5 0 0 1 10 0')).toThrow(/arc/)
    expect(() => aplatirChemin('M0 0 X1 1')).toThrow()
    expect(() => aplatirChemin('')).toThrow(/vide/)
    expect(() => aplatirChemin('L1 1')).toThrow(/premier M/)
  })
})

describe('pointDansPolygone / pointDansForme', () => {
  const carre = aplatirChemin('M0 0 L10 0 L10 10 L0 10 Z')[0]

  it('distingue dedans et dehors', () => {
    expect(pointDansPolygone(carre, 5, 5)).toBe(true)
    expect(pointDansPolygone(carre, 15, 5)).toBe(false)
    expect(pointDansPolygone(carre, 5, -1)).toBe(false)
  })

  it('unit deux formes disjointes et creuse une forme dans une autre', () => {
    const deux = aplatirChemin('M0 0 L2 0 L2 2 L0 2 Z M5 5 L7 5 L7 7 L5 7 Z')
    expect(pointDansForme(deux, 1, 1)).toBe(true)
    expect(pointDansForme(deux, 6, 6)).toBe(true)
    expect(pointDansForme(deux, 3.5, 3.5)).toBe(false)

    const anneau = aplatirChemin('M0 0 L10 0 L10 10 L0 10 Z M3 3 L7 3 L7 7 L3 7 Z')
    expect(pointDansForme(anneau, 1, 1)).toBe(true)
    expect(pointDansForme(anneau, 5, 5)).toBe(false)
  })
})

describe('distances', () => {
  it('mesure la distance à une ligne brisée ouverte', () => {
    const ligne = aplatirChemin('M0 0 L10 0')[0]
    expect(distanceALaLigne(ligne, 5, 3)).toBeCloseTo(3)
    expect(distanceALaLigne(ligne, 13, 4)).toBeCloseTo(5)
    // Ouverte : le bout ne rejoint pas le début.
    const coude = aplatirChemin('M0 0 L10 0 L10 10')[0]
    expect(distanceALaLigne(coude, 0, 10)).toBeCloseTo(10)
  })

  it('vaut zéro dans un polygone et la distance au bord dehors', () => {
    const carre = aplatirChemin('M0 0 L10 0 L10 10 L0 10 Z')[0]
    expect(distanceAuPolygone(carre, 5, 5)).toBe(0)
    expect(distanceAuPolygone(carre, 12, 5)).toBeCloseTo(2)
    // Le côté de fermeture (dernier → premier point) compte aussi.
    expect(distanceAuPolygone(carre, -3, 5)).toBeCloseTo(3)
  })
})

describe('mesures', () => {
  it('calcule une aire et une boîte englobante', () => {
    const polys = aplatirChemin('M0 0 L10 0 L10 5 L0 5 Z')
    expect(airePolygone(polys[0])).toBe(50)
    expect(boiteEnglobante(polys)).toEqual({ x0: 0, y0: 0, x1: 10, y1: 5 })
  })

  it('approche l’aire d’un disque tracé en quatre courbes', () => {
    const k = 0.5523
    const r = 10
    const [poly] = aplatirChemin(
      `M${r} 0 C${r} ${k * r} ${k * r} ${r} 0 ${r} C${-k * r} ${r} ${-r} ${k * r} ${-r} 0 ` +
        `C${-r} ${-k * r} ${-k * r} ${-r} 0 ${-r} C${k * r} ${-r} ${r} ${-k * r} ${r} 0 Z`,
    )
    expect(airePolygone(poly)).toBeCloseTo(Math.PI * r * r, -1)
  })
})
