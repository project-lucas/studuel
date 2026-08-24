import { describe, it, expect } from 'vitest'
import {
  LOUPE_BOUCLE_S,
  LOUPE_RAYON,
  RECHERCHE_MS,
  trajectoireLoupe,
} from '@/lib/defi/recherche-adversaire'

// LA TRAJECTOIRE DE LA LOUPE — un cercle, centré sur sa position de repos.
//
// Ce que ces tests gardent : la courbe est vraiment un CERCLE (tous ses points
// à la même distance du centre), la boucle se referme, et elle est assez
// densément échantillonnée pour se passer d'amortissement.
//
// La forme a changé deux fois — rotation, puis huit, puis cercle. À chaque fois
// les tests ont suivi l'intention plutôt que d'être contournés : ceux du huit
// vérifiaient qu'il CROISAIT en son milieu, ce qui n'a plus aucun sens ici.

/** Distance de chaque point au centre de l'orbite. */
const rayons = (pas?: number) => {
  const { x, y } = trajectoireLoupe(pas)
  return x.map((v, i) => Math.hypot(v, y[i]))
}

/** Longueur de la polyligne, en pixels. */
const longueur = (pas?: number) => {
  const { x, y } = trajectoireLoupe(pas)
  let l = 0
  for (let i = 1; i < x.length; i++) {
    l += Math.hypot(x[i] - x[i - 1], y[i] - y[i - 1])
  }
  return l
}

describe('trajectoireLoupe', () => {
  it('tient tous ses points à la même distance du centre', () => {
    // C'EST LA DÉFINITION D'UN CERCLE, et le seul test qui distingue vraiment
    // cette courbe d'une ellipse ou du huit qui la précédait.
    for (const r of rayons()) {
      expect(r).toBeCloseTo(LOUPE_RAYON, 1)
    }
  })

  it('referme la boucle sur son point de départ', () => {
    const { x, y } = trajectoireLoupe()
    // Sans ce dernier point identique au premier, l'objet saute à chaque tour.
    expect(x.at(-1)).toBe(x[0])
    expect(y.at(-1)).toBe(y[0])
  })

  it('part du haut de l’orbite', () => {
    const { x, y } = trajectoireLoupe()
    expect(x[0]).toBe(0)
    expect(y[0]).toBe(-LOUPE_RAYON)
  })

  it('fait un tour COMPLET, dans un seul sens', () => {
    const { x } = trajectoireLoupe(48)
    // Un quart de tour : à droite. Trois quarts : à gauche.
    expect(x[12]).toBeCloseTo(LOUPE_RAYON, 1)
    expect(x[36]).toBeCloseTo(-LOUPE_RAYON, 1)
  })

  it('rend un point de plus que le nombre de pas', () => {
    expect(trajectoireLoupe(8).x).toHaveLength(9)
    expect(trajectoireLoupe(12).y).toHaveLength(13)
  })
})

describe('la fluidité', () => {
  it('échantillonne assez finement pour se passer d’amortissement', () => {
    // Le défaut vu le 23/08/2026 : à 8 sommets, le moteur d'animation amortit
    // chaque segment séparément et la loupe s'arrête huit fois par tour.
    const { x, y } = trajectoireLoupe()
    let saut = 0
    for (let i = 1; i < x.length; i++) {
      saut = Math.max(saut, Math.hypot(x[i] - x[i - 1], y[i] - y[i - 1]))
    }
    // Moins de 2,5 px entre deux points : à cette échelle, une droite et l'arc
    // qu'elle remplace sont indiscernables à l'œil.
    expect(saut).toBeLessThan(2.5)
  })

  it('garde un pas parfaitement régulier', () => {
    // Sur un cercle échantillonné à angle constant, tous les segments ont la
    // même longueur — la vitesse est donc constante sans aucun réglage. C'est
    // ce qui rend l'interpolation linéaire non seulement suffisante mais JUSTE.
    const { x, y } = trajectoireLoupe()
    const sauts: number[] = []
    for (let i = 1; i < x.length; i++) {
      sauts.push(Math.hypot(x[i] - x[i - 1], y[i] - y[i - 1]))
    }
    expect(Math.max(...sauts) / Math.min(...sauts)).toBeLessThan(1.05)
  })
})

describe('la vitesse du balayage', () => {
  it('fait parcourir à la loupe une distance visible pendant la recherche', () => {
    // LE BON REPÈRE EST LA DISTANCE, PAS LE NOMBRE DE TOURS. On a d'abord borné
    // la durée de la boucle à celle de la recherche, en croyant qu'une courbe
    // non bouclée se verrait — elle ne se voit pas : personne ne regarde le
    // tracé, on regarde un objet bouger. Ce qui se voit, c'est une loupe qui
    // semble immobile parce qu'elle a dérivé de dix pixels en deux secondes.
    //
    // Le plancher est à 20 px : sur une loupe de 84 px, c'est encore un quart
    // de sa largeur en deux secondes, largement au-dessus du seuil où l'œil
    // cesse de percevoir un déplacement.
    const parcouru = (longueur() * (RECHERCHE_MS / 1000)) / LOUPE_BOUCLE_S
    expect(parcouru).toBeGreaterThan(20)
    expect(parcouru).toBeLessThan(100)
  })

  it('mesure bien le périmètre du cercle', () => {
    // Garde-fou de la mesure elle-même : si la polyligne s'écartait du cercle,
    // le test de vitesse ci-dessus mesurerait autre chose que ce qu'il croit.
    expect(longueur()).toBeCloseTo(2 * Math.PI * LOUPE_RAYON, 0)
  })
})
