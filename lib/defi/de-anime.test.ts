import { describe, expect, it } from 'vitest'
import {
  BOUCLE_DE,
  COTE_DE,
  FACES_DE,
  OMBRE_MAX,
  PHASE_DE,
  PISTES_DE,
  PISTE_CUBE,
  POINTS_DE,
  POINT_DE,
  ROULE_DE,
  PAS_DE,
  echantillonsGardes,
  etatDuDe,
  faceVisible,
  feuilleDuDe,
  imageDeDepart,
  imagesClesDe,
  normaleVue,
  ombreDeFace,
  placePoint,
  placementPeinte,
  type FaceDe,
} from './de-anime'

type M3 = number[][]

// Les matrices de rotation de la spécification CSS (CSS Transforms 2), écrites
// ici indépendamment du module : c'est contre elles qu'on vérifie le portage.
const cssRotateX = (deg: number): M3 => {
  const a = (deg * Math.PI) / 180
  return [
    [1, 0, 0],
    [0, Math.cos(a), -Math.sin(a)],
    [0, Math.sin(a), Math.cos(a)],
  ]
}
const cssRotateY = (deg: number): M3 => {
  const a = (deg * Math.PI) / 180
  return [
    [Math.cos(a), 0, Math.sin(a)],
    [0, 1, 0],
    [-Math.sin(a), 0, Math.cos(a)],
  ]
}
const produit = (a: M3, b: M3): M3 =>
  a.map((ligne) => b[0].map((_, j) => ligne.reduce((s, x, k) => s + x * b[k][j], 0)))
const applique = (m: M3, v: readonly number[]) =>
  m.map((ligne) => ligne.reduce((s, x, k) => s + x * v[k], 0))

/** La rotation d'une image de la piste du cube, lue dans sa chaîne CSS. */
function rotationDuCube(transform: string): M3 {
  const fonctions = [...transform.matchAll(/(rotate[XY])\((-?[\d.]+)deg\)/g)]
  expect(fonctions.map((f) => f[1])).toEqual(['rotateX', 'rotateY', 'rotateX'])
  const [x1, y, x2] = fonctions.map((f) => Number(f[2]))
  // Une liste de transformations s'applique de droite à gauche.
  return produit(produit(cssRotateX(x1), cssRotateY(y)), cssRotateX(x2))
}

/** La rotation d'un placement de face, lue dans son `matrix3d` (par colonnes). */
function rotationDeFace(face: FaceDe): M3 {
  const m = /matrix3d\(([^)]*)\)/.exec(placementPeinte(face))
  const c = m![1].split(',').map(Number)
  return [
    [c[0], c[4], c[8]],
    [c[1], c[5], c[9]],
    [c[2], c[6], c[10]],
  ]
}

const faceDessus = (t: number) =>
  FACES_DE.reduce((a, b) => (normaleVue(b, etatDuDe(t))[1] < normaleVue(a, etatDuDe(t))[1] ? b : a)).n

const facesVisibles = (t: number) =>
  FACES_DE.filter((f) => faceVisible(normaleVue(f, etatDuDe(t)))).map((f) => f.n)

/** Les instants de repos : juste avant chaque roulé. */
const reposAvant = (i: number) => i * PAS_DE + (PAS_DE - ROULE_DE) - 0.01

describe('etatDuDe — les formules de dice-roll.jsx', () => {
  it('part posé, sans saut ni rebond', () => {
    expect(etatDuDe(0)).toEqual({ rx: 0, ry: 0, saut: 0, rebond: 0 })
  })

  it('est au plus haut du saut au milieu du premier roulé, à 45°', () => {
    const milieu = PAS_DE - ROULE_DE + ROULE_DE / 2
    const e = etatDuDe(milieu)
    expect(e.rx).toBeCloseTo(45, 6)
    expect(e.saut).toBeCloseTo(1, 6)
  })

  it('prend son élan en arrière avant de rouler, et dépasse avant de se poser', () => {
    const depart = PAS_DE - ROULE_DE
    const angles = Array.from({ length: 56 }, (_, i) => etatDuDe(depart + i / 100).rx)
    expect(Math.min(...angles)).toBeLessThan(-5)
    expect(Math.max(...angles)).toBeGreaterThan(95)
  })

  it('a fait un tour complet vers l’avant à la fin de la première phase', () => {
    expect(etatDuDe(PHASE_DE)).toMatchObject({ rx: 360, ry: 0 })
  })

  it('a fait ses deux tours à la fin de la boucle, sans être ramené à zéro', () => {
    const e = etatDuDe(BOUCLE_DE)
    expect(e.rx).toBe(360)
    expect(e.ry).toBeCloseTo(360, 6)
    expect(e.saut).toBeCloseTo(0, 6)
    expect(e.rebond).toBe(0)
  })

  it('s’écrase en arrivant, puis se tait avant le roulé suivant', () => {
    const fin = PAS_DE
    expect(Math.abs(etatDuDe(fin + 0.06).rebond)).toBeGreaterThan(0.2)
    expect(etatDuDe(fin + 0.5).rebond).toBeCloseTo(0, 6)
  })
})

describe('les faces', () => {
  it('roule vers l’avant sur les faces 1, 2, 6 et 5 (le dessus change à chaque roulé)', () => {
    const dessus = [0, 1, 2, 3].map((i) => faceDessus(reposAvant(i) + PAS_DE))
    expect(new Set(dessus)).toEqual(new Set([1, 2, 5, 6]))
    expect(faceDessus(0.1)).toBe(2)
  })

  it('tourne sur le côté en montrant les faces 1, 3, 6 et 4, le 2 restant dessus', () => {
    const faces = new Set<number>()
    for (let i = 0; i < 4; i++) {
      const t = PHASE_DE + reposAvant(i) + PAS_DE
      expect(faceDessus(t)).toBe(2)
      facesVisibles(t).forEach((n) => faces.add(n))
    }
    expect([...faces].filter((n) => n !== 2).sort()).toEqual([1, 3, 4, 6])
  })

  it('montre trois faces au repos, et l’instant zéro est la pose de l’export (2 dessus, 4 et 1)', () => {
    for (let i = 0; i < 8; i++) {
      expect(facesVisibles(reposAvant(i % 4) + (i >= 4 ? PHASE_DE : 0))).toHaveLength(3)
    }
    expect(facesVisibles(0).sort()).toEqual([1, 2, 4])
  })

  it('assombrit une face de 0 à OMBRE_MAX, jamais au-delà', () => {
    for (let t = 0; t <= BOUCLE_DE; t += 0.05) {
      for (const f of FACES_DE) {
        const o = ombreDeFace(normaleVue(f, etatDuDe(t)))
        expect(o).toBeGreaterThanOrEqual(0)
        expect(o).toBeLessThanOrEqual(OMBRE_MAX)
      }
    }
  })

  it('pose toutes les pastilles dans le carré de la face, cerne compris', () => {
    const cerne = 7
    for (const points of Object.values(POINTS_DE)) {
      for (const p of points) {
        const { x, y } = placePoint(p)
        expect(x).toBeGreaterThanOrEqual(cerne)
        expect(y).toBeGreaterThanOrEqual(cerne)
        expect(x + POINT_DE.w).toBeLessThanOrEqual(COTE_DE - cerne)
        expect(y + POINT_DE.h).toBeLessThanOrEqual(COTE_DE - cerne)
      }
    }
  })
})

describe('le cube CSS reproduit la projection de l’export', () => {
  it('chaque face pointe, en CSS, exactement là où l’export la dessine', () => {
    // Le cube tourne par ses images-clés, la face est placée par son
    // `matrix3d` : leur composition, lue avec les matrices de la
    // spécification CSS, doit donner la normale R(N) de l'export.
    for (let t = 0; t <= BOUCLE_DE; t += 0.137) {
      const etat = etatDuDe(t)
      const cube = rotationDuCube(PISTE_CUBE.image(PISTE_CUBE.valeurs(etat)).transform!)
      for (const face of FACES_DE) {
        const css = applique(produit(cube, rotationDeFace(face)), [0, 0, 1])
        const attendu = normaleVue(face, etat)
        css.forEach((c, k) => expect(c).toBeCloseTo(attendu[k], 3))
      }
    }
  })

  it('place chaque face sur ses axes U et V', () => {
    for (const face of FACES_DE) {
      const r = rotationDeFace(face)
      expect(applique(r, [1, 0, 0])).toEqual([...face.U])
      expect(applique(r, [0, 1, 0])).toEqual([...face.V])
    }
  })
})

describe('echantillonsGardes', () => {
  it('ne garde que les deux bouts d’une ligne droite', () => {
    const t = [0, 1, 2, 3, 4]
    expect(echantillonsGardes(t, t.map((x) => [2 * x + 1]), 0.01)).toEqual([0, 4])
  })

  it('garde la pointe d’un V', () => {
    const t = [0, 1, 2, 3, 4]
    expect(echantillonsGardes(t, t.map((x) => [Math.abs(x - 2)]), 0.01)).toEqual([0, 2, 4])
  })

  it('ne trahit aucun échantillon de plus que la tolérance', () => {
    const t = Array.from({ length: 81 }, (_, i) => i / 10)
    const v = t.map((x) => [Math.sin(x), Math.cos(2 * x)])
    const gardes = echantillonsGardes(t, v, 0.02)
    for (let g = 0; g < gardes.length - 1; g++) {
      const [a, b] = [gardes[g], gardes[g + 1]]
      for (let i = a; i <= b; i++) {
        const f = (t[i] - t[a]) / (t[b] - t[a])
        v[i].forEach((x, d) => expect(Math.abs(v[a][d] + f * (v[b][d] - v[a][d]) - x)).toBeLessThanOrEqual(0.02))
      }
    }
    expect(gardes.length).toBeLessThan(t.length)
  })
})

describe('les images-clés', () => {
  it('chaque piste va de 0 % à 100 % et n’anime que transform et opacity', () => {
    for (const piste of PISTES_DE) {
      const cles = imagesClesDe(piste)
      expect(cles.startsWith(`@keyframes ${piste.nom}{0%{`)).toBe(true)
      expect(cles).toContain('100%{')
      const proprietes = [...cles.matchAll(/[{;]([a-z-]+):/g)].map((m) => m[1])
      expect(new Set(proprietes).size).toBeGreaterThan(0)
      proprietes.forEach((p) => expect(['transform', 'opacity']).toContain(p))
    }
  })

  it('la première image de chaque piste est celle posée en ligne (le dé figé)', () => {
    for (const piste of PISTES_DE) {
      const premiere = /0%\{([^}]*)\}/.exec(imagesClesDe(piste))![1]
      const enLigne = Object.entries(imageDeDepart(piste))
        .map(([p, v]) => `${p}:${v}`)
        .join(';')
      expect(premiere).toBe(enLigne)
    }
  })

  it('la boucle se referme : la dernière pose est la première, à un tour près', () => {
    const cles = imagesClesDe(PISTE_CUBE)
    expect(cles).toMatch(/0%\{transform:rotateX\(-24deg\) rotateY\(38deg\) rotateX\(0deg\)\}/)
    expect(cles).toMatch(/100%\{transform:rotateX\(-24deg\) rotateY\(398deg\) rotateX\(360deg\)\}\}$/)
  })

  it('un nom d’images-clés par piste, préfixé « de- »', () => {
    const noms = PISTES_DE.map((p) => p.nom)
    expect(new Set(noms).size).toBe(noms.length)
    noms.forEach((n) => expect(n).toMatch(/^de-/))
  })

  it('reste légère : la feuille entière tient sous 24 Ko', () => {
    expect(feuilleDuDe().length).toBeLessThan(24_000)
  })
})
