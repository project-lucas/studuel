import { describe, expect, it } from 'vitest'
import { cheminLisse, type Point } from './courbe-lisse'

/** Les points de contrôle d'un chemin, dans l'ordre. */
const nombres = (d: string) => (d.match(/-?\d+(\.\d+)?/g) ?? []).map(Number)

describe('cheminLisse', () => {
  it('passe par chaque point', () => {
    const pts: Point[] = [[0, 10], [10, 30], [20, 5], [30, 25]]
    const n = nombres(cheminLisse(pts))
    // M x0 y0, puis pour chaque segment : c1x c1y c2x c2y x y
    expect([n[0], n[1]]).toEqual([0, 10])
    for (let i = 1; i < pts.length; i++) expect([n[2 + 6 * (i - 1) + 4], n[2 + 6 * (i - 1) + 5]]).toEqual(pts[i])
  })

  it('garde droits des points alignés (proportionnalité)', () => {
    const n = nombres(cheminLisse([[0, 0], [10, 20], [20, 40]]))
    // Les points de contrôle sont sur la droite y = 2x.
    for (let i = 0; i < n.length; i += 2) expect(Math.abs(n[i + 1] - 2 * n[i])).toBeLessThan(0.02)
  })

  it('garde plat un palier (pas de bosse entre deux valeurs égales)', () => {
    const n = nombres(cheminLisse([[0, 0], [10, 50], [20, 50], [30, 50], [40, 90]]))
    // Segment du palier 10 → 20 : ses deux points de contrôle restent à y = 50.
    const s = 2 + 6
    expect([n[s + 1], n[s + 3]]).toEqual([50, 50])
  })

  it('ne dépasse jamais les valeurs de deux points voisins', () => {
    const pts: Point[] = [[0, 0], [10, 100], [20, 0], [30, 100]]
    const n = nombres(cheminLisse(pts))
    for (let i = 3; i < n.length; i += 2) {
      expect(n[i]).toBeGreaterThanOrEqual(0)
      expect(n[i]).toBeLessThanOrEqual(100)
    }
  })

  it('garde franche la cassure d’un titrage en V (deux droites)', () => {
    const d = cheminLisse([[0, 426], [1, 366], [2, 306], [3, 246], [4, 186], [5, 126], [6, 176], [7, 226], [8, 276]])
    // Tout est droit : aucune courbe de Bézier, la pointe du V reste à (5 ; 126).
    expect(d).not.toContain('C')
    expect(d).toContain('L5 126L6 176')
  })

  it('lisse une sinusoïde échantillonnée', () => {
    expect(cheminLisse([[0, 0], [1, 2], [2, 0], [3, -2], [4, 0]])).toContain('C')
  })

  it('coupe la courbe sur une donnée manquante', () => {
    const d = cheminLisse([[0, 0], [10, 10], null, [30, 30], [40, 40]])
    expect(d.match(/M/g)).toHaveLength(2)
  })

  it('trace un point isolé sans planter', () => {
    expect(cheminLisse([[5, 5]])).toBe('M5 5')
    expect(cheminLisse([])).toBe('')
  })
})
