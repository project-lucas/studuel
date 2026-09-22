// -----------------------------------------------------------------------------
// GÉOMÉTRIE D'UN CHEMIN SVG — pur, sans DOM.
//
// Les jeux où l'on répond en DÉSIGNANT un endroit (le moteur « Vise » du
// cadrage : la planche d'anatomie aujourd'hui, une carte ou une droite graduée
// demain) ont besoin de savoir, hors navigateur, si un point tombe dans une
// forme. Le navigateur sait le faire (`isPointInFill`), mais pas Vitest : or
// c'est par un test qu'on veut garantir qu'une zone est atteignable, qu'elle
// ne se cache pas sous une autre, qu'elle est assez grande pour un doigt.
//
// On aplatit donc un attribut `d` en polygones (les courbes de Bézier
// deviennent des lignes brisées), puis tout devient de l'arithmétique :
// point dans le polygone (lancer de rayon), distance à un bord, aire.
//
// Commandes prises en charge : M L H V C S Q T Z, absolues et relatives — tout
// ce qu'une forme dessinée à la main utilise. Les arcs (A) ne le sont pas :
// aucune planche n'en a besoin, et leur aplatissement est le seul cas
// vraiment délicat. On préfère refuser franchement que rater en silence.
// -----------------------------------------------------------------------------

export type Point = readonly [number, number]
/** Une ligne brisée. Fermée (un polygone) ou non (le tracé d'un tube). */
export type Polyligne = Point[]

/** Segments de droite par courbe : dix suffisent à un rendu au dixième d'unité. */
const PAS_COURBE = 10

// Toute lettre est lue comme une commande, pour qu'une commande inconnue soit
// REFUSÉE et non ignorée en silence.
const LEXEME = /([A-Za-z])|(-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?)/g

/** Combien de nombres chaque commande consomme. */
const ARITE: Record<string, number> = {
  M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, Z: 0,
}

/**
 * Découpe un attribut `d` en sous-chemins aplatis. Chaque `M` ouvre un
 * nouveau sous-chemin ; un `Z` le ferme (le point de départ n'est pas
 * dupliqué : un polygone se ferme implicitement).
 *
 * Refuse un chemin vide, une commande inconnue, un arc, ou un nombre en trop.
 */
export function aplatirChemin(d: string): Polyligne[] {
  const lexemes = [...d.matchAll(LEXEME)].map((m) => m[1] ?? m[2])
  const sousChemins: Polyligne[] = []
  let courant: Polyligne | null = null
  // Position courante, départ du sous-chemin, et dernier point de contrôle
  // (pour les commandes « lisses » S et T qui le reflètent).
  let x = 0
  let y = 0
  let x0 = 0
  let y0 = 0
  let cx: number | null = null
  let cy: number | null = null
  let i = 0

  const nombre = (): number => {
    const v = Number(lexemes[i++])
    if (!Number.isFinite(v)) throw new Error(`Chemin SVG : nombre attendu (« ${d} »)`)
    return v
  }
  const pousser = (px: number, py: number) => {
    if (!courant) throw new Error(`Chemin SVG : segment avant le premier M (« ${d} »)`)
    courant.push([px, py])
  }
  const courbeCubique = (
    c1x: number, c1y: number, c2x: number, c2y: number, ex: number, ey: number,
  ) => {
    for (let k = 1; k <= PAS_COURBE; k++) {
      const t = k / PAS_COURBE
      const u = 1 - t
      pousser(
        u * u * u * x + 3 * u * u * t * c1x + 3 * u * t * t * c2x + t * t * t * ex,
        u * u * u * y + 3 * u * u * t * c1y + 3 * u * t * t * c2y + t * t * t * ey,
      )
    }
    cx = c2x
    cy = c2y
    x = ex
    y = ey
  }
  const courbeQuadratique = (qx: number, qy: number, ex: number, ey: number) => {
    for (let k = 1; k <= PAS_COURBE; k++) {
      const t = k / PAS_COURBE
      const u = 1 - t
      pousser(
        u * u * x + 2 * u * t * qx + t * t * ex,
        u * u * y + 2 * u * t * qy + t * t * ey,
      )
    }
    cx = qx
    cy = qy
    x = ex
    y = ey
  }

  while (i < lexemes.length) {
    const lexeme = lexemes[i++]
    if (!/^[A-Za-z]$/.test(lexeme)) throw new Error(`Chemin SVG : commande attendue, reçu « ${lexeme} »`)
    if (lexeme === 'A' || lexeme === 'a') throw new Error('Chemin SVG : les arcs (A) ne sont pas pris en charge')
    const commande = lexeme.toUpperCase()
    const relative = lexeme !== commande
    const arite = ARITE[commande]
    if (arite === undefined) throw new Error(`Chemin SVG : commande inconnue « ${lexeme} »`)

    // Une commande peut être suivie de plusieurs jeux de paramètres
    // (« L 1 2 3 4 » = deux segments) ; un M répété se lit comme un L.
    let premierTour = true
    do {
      const dx = relative ? x : 0
      const dy = relative ? y : 0
      switch (commande) {
        case 'M': {
          const nx = nombre() + dx
          const ny = nombre() + dy
          if (premierTour) {
            courant = []
            sousChemins.push(courant)
            x0 = nx
            y0 = ny
          }
          x = nx
          y = ny
          pousser(x, y)
          cx = cy = null
          break
        }
        case 'L': {
          x = nombre() + dx
          y = nombre() + dy
          pousser(x, y)
          cx = cy = null
          break
        }
        case 'H': {
          x = nombre() + dx
          pousser(x, y)
          cx = cy = null
          break
        }
        case 'V': {
          y = nombre() + dy
          pousser(x, y)
          cx = cy = null
          break
        }
        case 'C': {
          const c1x = nombre() + dx
          const c1y = nombre() + dy
          const c2x = nombre() + dx
          const c2y = nombre() + dy
          const ex = nombre() + dx
          const ey = nombre() + dy
          courbeCubique(c1x, c1y, c2x, c2y, ex, ey)
          break
        }
        case 'S': {
          const c2x = nombre() + dx
          const c2y = nombre() + dy
          const ex = nombre() + dx
          const ey = nombre() + dy
          const c1x = cx === null ? x : 2 * x - cx
          const c1y = cy === null ? y : 2 * y - cy
          courbeCubique(c1x, c1y, c2x, c2y, ex, ey)
          break
        }
        case 'Q': {
          const qx = nombre() + dx
          const qy = nombre() + dy
          const ex = nombre() + dx
          const ey = nombre() + dy
          courbeQuadratique(qx, qy, ex, ey)
          break
        }
        case 'T': {
          const ex = nombre() + dx
          const ey = nombre() + dy
          const qx = cx === null ? x : 2 * x - cx
          const qy = cy === null ? y : 2 * y - cy
          courbeQuadratique(qx, qy, ex, ey)
          break
        }
        case 'Z': {
          x = x0
          y = y0
          cx = cy = null
          break
        }
      }
      premierTour = false
    } while (arite > 0 && i < lexemes.length && !/^[A-Za-z]$/.test(lexemes[i]))
  }

  if (sousChemins.length === 0) throw new Error('Chemin SVG vide')
  return sousChemins
}

/** Le point est-il dans le polygone (lancer de rayon, règle pair-impair) ? */
export function pointDansPolygone(poly: Polyligne, x: number, y: number): boolean {
  let dedans = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i]
    const [xj, yj] = poly[j]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      dedans = !dedans
    }
  }
  return dedans
}

/**
 * Le point est-il dans la forme ? Plusieurs sous-chemins se combinent en
 * pair-impair, comme `fill-rule: evenodd` : deux formes disjointes s'unissent,
 * une forme dans une autre y creuse un trou.
 */
export function pointDansForme(polys: readonly Polyligne[], x: number, y: number): boolean {
  let n = 0
  for (const poly of polys) if (pointDansPolygone(poly, x, y)) n++
  return n % 2 === 1
}

function distanceAuSegment(
  ax: number, ay: number, bx: number, by: number, x: number, y: number,
): number {
  const vx = bx - ax
  const vy = by - ay
  const longueur2 = vx * vx + vy * vy
  const t = longueur2 === 0 ? 0 : Math.max(0, Math.min(1, ((x - ax) * vx + (y - ay) * vy) / longueur2))
  const px = ax + t * vx
  const py = ay + t * vy
  return Math.hypot(x - px, y - py)
}

/**
 * La distance d'un point à une ligne brisée (ouverte : le dernier point ne
 * rejoint pas le premier). C'est l'axe d'un tube : un point est dans le tube
 * s'il est à moins d'une demi-largeur de l'axe.
 */
export function distanceALaLigne(poly: Polyligne, x: number, y: number): number {
  if (poly.length === 0) return Infinity
  if (poly.length === 1) return Math.hypot(x - poly[0][0], y - poly[0][1])
  let min = Infinity
  for (let i = 1; i < poly.length; i++) {
    const d = distanceAuSegment(poly[i - 1][0], poly[i - 1][1], poly[i][0], poly[i][1], x, y)
    if (d < min) min = d
  }
  return min
}

/** La distance d'un point au CONTOUR d'un polygone (fermé) — 0 s'il est dedans. */
export function distanceAuPolygone(poly: Polyligne, x: number, y: number): number {
  if (pointDansPolygone(poly, x, y)) return 0
  const fermee = poly.length > 1 ? [...poly, poly[0]] : poly
  return distanceALaLigne(fermee, x, y)
}

/** L'aire d'un polygone (formule du lacet), toujours positive. */
export function airePolygone(poly: Polyligne): number {
  let somme = 0
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    somme += poly[j][0] * poly[i][1] - poly[i][0] * poly[j][1]
  }
  return Math.abs(somme) / 2
}

export type Boite = { x0: number; y0: number; x1: number; y1: number }

/** La boîte englobante d'un ensemble de lignes brisées. */
export function boiteEnglobante(polys: readonly Polyligne[]): Boite {
  const boite: Boite = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity }
  for (const poly of polys) {
    for (const [x, y] of poly) {
      if (x < boite.x0) boite.x0 = x
      if (y < boite.y0) boite.y0 = y
      if (x > boite.x1) boite.x1 = x
      if (y > boite.y1) boite.y1 = y
    }
  }
  return boite
}
