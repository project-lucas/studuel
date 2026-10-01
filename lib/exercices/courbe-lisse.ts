/**
 * LE TRACÉ LISSE D'UNE COURBE — interpolation cubique MONOTONE (Fritsch-Carlson,
 * celle de `d3.curveMonotoneX`), 30/09/2026 : un oscillogramme de 9 points relié
 * par des segments droits se lisait comme des dents de scie.
 *
 * Pourquoi monotone et pas une spline ordinaire : la courbe passe par chaque
 * point, ne dépasse JAMAIS la valeur de deux points voisins (pas de bosse
 * inventée entre deux mesures), garde droits les points alignés (une situation
 * de proportionnalité reste une droite) et plats les paliers (P1 = P2 → tangente
 * nulle : un changement d'état garde son palier horizontal). Et une suite de
 * DROITES garde ses cassures : un segment de même pente qu'un voisin est tracé
 * droit (un titrage conductimétrique en V ne devient pas un U).
 */
export type Point = readonly [number, number]

/** Les pentes aux points, selon Fritsch-Carlson. */
function tangentes(p: readonly Point[]): number[] {
  const n = p.length
  const d: number[] = []
  for (let i = 0; i < n - 1; i++) d.push((p[i + 1][1] - p[i][1]) / (p[i + 1][0] - p[i][0]))
  const m: number[] = new Array(n).fill(0)
  m[0] = d[0]
  m[n - 1] = d[n - 2]
  for (let i = 1; i < n - 1; i++) {
    // Changement de sens ou palier : tangente horizontale, sinon la moyenne harmonique.
    m[i] = d[i - 1] * d[i] <= 0 ? 0 : (2 * d[i - 1] * d[i]) / (d[i - 1] + d[i])
  }
  return m
}

const arrondi = (v: number) => Math.round(v * 100) / 100

/**
 * Le `d` d'un <path> SVG qui relie les points (x croissants) en douceur.
 * Un point `null` coupe la courbe (donnée manquante) : chaque morceau est tracé à part.
 */
export function cheminLisse(points: readonly (Point | null)[]): string {
  const morceaux: Point[][] = [[]]
  for (const p of points) {
    if (p) morceaux[morceaux.length - 1].push(p)
    else if (morceaux[morceaux.length - 1].length) morceaux.push([])
  }
  return morceaux
    .filter((m) => m.length > 0)
    .map((m) => {
      if (m.length === 1) return `M${arrondi(m[0][0])} ${arrondi(m[0][1])}`
      const t = tangentes(m)
      const pente = (i: number) => (m[i + 1][1] - m[i][1]) / (m[i + 1][0] - m[i][0])
      const egales = (a: number, b: number) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b))
      // Un segment qui PROLONGE une droite (même pente qu'un voisin) reste droit :
      // un titrage en V garde sa cassure franche, seules les vraies courbes s'arrondissent.
      const droit = (i: number) => (i > 0 && egales(pente(i - 1), pente(i))) || (i < m.length - 2 && egales(pente(i), pente(i + 1)))
      let d = `M${arrondi(m[0][0])} ${arrondi(m[0][1])}`
      for (let i = 0; i < m.length - 1; i++) {
        const [x0, y0] = m[i]
        const [x1, y1] = m[i + 1]
        if (droit(i)) {
          d += `L${arrondi(x1)} ${arrondi(y1)}`
          continue
        }
        const h = (x1 - x0) / 3
        d += `C${arrondi(x0 + h)} ${arrondi(y0 + t[i] * h)} ${arrondi(x1 - h)} ${arrondi(y1 - t[i + 1] * h)} ${arrondi(x1)} ${arrondi(y1)}`
      }
      return d
    })
    .join('')
}
