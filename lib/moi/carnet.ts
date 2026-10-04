// -----------------------------------------------------------------------------
// LE CARNET DE MOI — la mécanique des pages, pure et testée (04/10/2026).
//
// Maquette « cahier ouvert » choisie par Lucas : un carnet à spirale posé sur
// un bureau. Une DOUBLE PAGE par section — l'identité d'abord, puis les quatre
// intercalaires (Progrès · Amis · Collection · Palmarès) — et des pages qu'on
// TOURNE, au doigt ou par l'onglet.
//
// LE MODÈLE. Avec N doubles pages, il y a N − 1 FEUILLES. La feuille i porte au
// recto la page de droite de la double page i, au verso la page de gauche de
// la double page i + 1 ; elle pivote autour de la spirale, de 0° (posée à
// droite) à 180° (posée à gauche). Restent deux pages fixes : la gauche de la
// première double page et la droite de la dernière.
//
// Ce fichier répond aux questions que l'écran se pose à chaque image :
//   · quel angle donner à la feuille sous le doigt (`angleSousLeDoigt`) ;
//   · faut-il finir le geste ou le rendre (`gesteAbouti`) ;
//   · quelles feuilles tourner, dans quel ordre, pour aller d'une section à
//     une autre (`feuillesATourner`) ;
//   · dans quel ordre empiler les feuilles, et lesquelles peindre (`pile`).
// -----------------------------------------------------------------------------

export type SectionCarnet = 'moi' | 'progres' | 'amis' | 'collection' | 'palmares'

/** Les sections, dans l'ordre des pages. Les quatre dernières ont leur onglet. */
export const SECTIONS_CARNET: readonly { id: SectionCarnet; titre: string }[] = [
  { id: 'moi', titre: 'Moi' },
  { id: 'progres', titre: 'Progrès' },
  { id: 'amis', titre: 'Amis' },
  { id: 'collection', titre: 'Collection' },
  { id: 'palmares', titre: 'Palmarès' },
]

export const indexSection = (id: SectionCarnet): number => SECTIONS_CARNET.findIndex((s) => s.id === id)

/** La section lue dans l'URL (`?page=amis`), ou la première. */
export function sectionDepuis(valeur: string | null | undefined): number {
  const i = SECTIONS_CARNET.findIndex((s) => s.id === valeur)
  return i < 0 ? 0 : i
}

const borner = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

/**
 * L'angle (en degrés, 0 = posée à droite, 180 = posée à gauche) de la feuille
 * que tient le doigt.
 *
 * Le point de la feuille saisi par le doigt reste SOUS le doigt : vu de
 * dessus, un point situé à `rayon` de la spirale se projette à
 * `rayon · cos(angle)` — l'angle est donc l'arc cosinus de la position du
 * doigt rapportée à ce rayon. C'est ce qui donne la sensation de tenir le
 * papier, et non de pousser un curseur.
 *
 * Un doigt posé tout près de la spirale ferait tourner la page à toute vitesse
 * au moindre mouvement : le rayon ne descend jamais sous `rayonMin`.
 */
export function angleSousLeDoigt(
  xDoigt: number,
  xSpirale: number,
  rayonSaisi: number,
  rayonMin: number,
): number {
  const rayon = Math.max(Math.abs(rayonSaisi), rayonMin)
  const cos = borner((xDoigt - xSpirale) / rayon, -1, 1)
  return (Math.acos(cos) * 180) / Math.PI
}

/** Vitesse (px/ms) d'un lancer franc : au-delà, le geste aboutit même court. */
export const VITESSE_LANCER = 0.35
/** En dessous de cet angle, un lancer n'est qu'un tremblement. */
export const ANGLE_LANCER_MIN = 8

/**
 * Le doigt se lève : la page finit-elle de tourner, ou retombe-t-elle ?
 *
 * Elle tourne si elle a passé la verticale, OU si elle a été lancée dans le
 * bon sens (vitesse horizontale franche) après avoir quitté sa pile. Un lancer
 * dans le sens contraire la ramène toujours.
 *
 * `sens` : `avant` (la feuille part de 0° vers 180°) ou `arriere`.
 * `vitesse` : px/ms, négative vers la gauche.
 */
export function gesteAbouti(sens: 'avant' | 'arriere', angle: number, vitesse: number): boolean {
  if (sens === 'avant') {
    if (vitesse > VITESSE_LANCER) return false
    if (vitesse < -VITESSE_LANCER && angle > ANGLE_LANCER_MIN) return true
    return angle > 90
  }
  if (vitesse < -VITESSE_LANCER) return false
  if (vitesse > VITESSE_LANCER && angle < 180 - ANGLE_LANCER_MIN) return true
  return angle < 90
}

/**
 * Les feuilles à tourner pour passer de la double page `depuis` à `vers`, dans
 * l'ordre où elles partent : en avant, la feuille du dessus de la pile de
 * droite d'abord ; en arrière, celle du dessus de la pile de gauche.
 */
export function feuillesATourner(depuis: number, vers: number): { feuille: number; vers: 0 | 180 }[] {
  if (vers > depuis) {
    return Array.from({ length: vers - depuis }, (_, k) => ({ feuille: depuis + k, vers: 180 as const }))
  }
  return Array.from({ length: depuis - vers }, (_, k) => ({ feuille: depuis - 1 - k, vers: 0 as const }))
}

/** Durée d'une page tournée seule (ms), et d'une page feuilletée. */
export const DUREE_PAGE = 620
export const DUREE_FEUILLETEE = 430
/** Écart entre deux feuilles feuilletées (ms). */
export const ECART_FEUILLETEE = 95

/** Durée du retour à plat après un geste, selon le chemin qui reste. */
export function dureeDeRetour(angleDepart: number, angleArrivee: number): number {
  return Math.round(140 + (Math.abs(angleArrivee - angleDepart) / 180) * 360)
}

/**
 * Courbe d'une page tournée par l'onglet : elle se décolle lentement, file, puis
 * se pose en douceur (une page a de l'inertie, pas un ressort).
 */
export function courbePage(t: number): number {
  const x = borner(t, 0, 1)
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
}

/** Courbe du retour à plat après le doigt : la vitesse du geste continue, puis s'éteint. */
export function courbeRetour(t: number): number {
  const x = borner(t, 0, 1)
  return 1 - Math.pow(1 - x, 3)
}

/**
 * L'empilement des feuilles, image par image.
 *
 * Posées à droite (angle ≤ 90°), la feuille d'indice le plus BAS est dessus ;
 * posées à gauche, celle d'indice le plus HAUT. La règle tient pendant le
 * mouvement : une feuille qui passe la verticale change de pile, et elle
 * arrive sur le dessus de la nouvelle.
 *
 * `peinte` : seules les feuilles qu'on peut voir — celles qui bougent, et la
 * première immobile de chaque pile (les autres sont couvertes). Une page
 * cachée ne coûte rien au navigateur.
 */
export function pile(angles: readonly number[], enMouvement: readonly boolean[]): { z: number; peinte: boolean }[] {
  const n = angles.length
  let dessusDroite = -1
  for (let i = 0; i < n; i++) {
    if (!enMouvement[i] && angles[i] <= 90) {
      dessusDroite = i
      break
    }
  }
  let dessusGauche = -1
  for (let i = n - 1; i >= 0; i--) {
    if (!enMouvement[i] && angles[i] > 90) {
      dessusGauche = i
      break
    }
  }
  return angles.map((angle, i) => ({
    z: angle <= 90 ? 2 * (n - i) + 10 : 2 * (n + i) + 10,
    peinte: enMouvement[i] || i === dessusDroite || i === dessusGauche,
  }))
}

/**
 * La lumière sur une feuille qui tourne, de 0 à 1 : la face qui se dresse
 * s'assombrit à mesure qu'elle se met de chant (sin de l'angle), et l'ombre
 * portée sur la page dessous suit la même loi.
 */
export function ombreDeFeuille(angle: number): number {
  return Math.sin((borner(angle, 0, 180) * Math.PI) / 180)
}
