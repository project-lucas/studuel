// -----------------------------------------------------------------------------
// LES CŒURS DU COMBAT (02/11/2026) — docs/CADRAGE-COMBAT-HEROS.md § 2.
//
// Lucas : « les cœurs, la perte des cœurs ». Une barre de PV dit « combien » ;
// un cœur se compte d'un coup d'œil et se perd avec un drame. Chaque cœur se
// découpe en QUARTS : c'est l'unité que l'écran dessine.
//
// Trois combats, trois façons de remplir la même rangée :
//   · le duel classé : 5 cœurs pour les 1 000 points de la course, un quart =
//     50 points (une bonne réponse en arrache un demi à trois quarts) ;
//   · moi face au gardien : mes 3 vies, une vie = un cœur entier ;
//   · le gardien : ses PV de rang, un coup = un demi-cœur.
//
// Rien ici ne décide d'une victoire : la course et la Traque restent juges, les
// cœurs LISENT leur état.
// -----------------------------------------------------------------------------

export const QUARTS_PAR_COEUR = 4

/** Le duel classé : 5 cœurs, la course à 1 000 points. */
export const COEURS_DUEL = 5
export const PV_DUEL = 1000
const PV_PAR_QUART = PV_DUEL / (COEURS_DUEL * QUARTS_PAR_COEUR)

/** Un coup porté au gardien lui retire un demi-cœur. */
const QUARTS_PAR_COUP_BOSS = 2

export type Coeurs = {
  /** Les quarts qui restent (0 = K.O.). */
  quarts: number
  /** Le nombre de cœurs de la rangée. */
  max: number
}

function entier(n: number): number {
  return Number.isFinite(n) ? Math.max(0, Math.floor(n)) : 0
}

/**
 * Les cœurs d'un camp du duel classé, d'après ses PV (1 000 − le score de
 * l'adversaire). Arrondi au quart SUPÉRIEUR : tant qu'il reste un point, il
 * reste un bout de cœur — un camp n'a l'air K.O. que s'il l'est.
 */
export function coeursDuDuel(pv: number): Coeurs {
  const p = Math.min(PV_DUEL, entier(pv))
  return { quarts: Math.ceil(p / PV_PAR_QUART), max: COEURS_DUEL }
}

/** Mes cœurs face au gardien : une vie, un cœur entier. */
export function coeursDeVies(vies: number, viesMax: number): Coeurs {
  const max = Math.max(1, entier(viesMax))
  return { quarts: Math.min(max, entier(vies)) * QUARTS_PAR_COEUR, max }
}

/** Les cœurs du gardien : ses PV de rang, un demi-cœur par coup. */
export function coeursDuBoss(pv: number, pvMax: number): Coeurs {
  const total = Math.max(1, entier(pvMax))
  return {
    quarts: Math.min(total, entier(pv)) * QUARTS_PAR_COUP_BOSS,
    max: Math.ceil((total * QUARTS_PAR_COUP_BOSS) / QUARTS_PAR_COEUR),
  }
}

/** Le remplissage de chaque cœur de la rangée, de gauche à droite (0 à 4 quarts). */
export function remplissages(c: Coeurs): number[] {
  return Array.from({ length: c.max }, (_, i) =>
    Math.max(0, Math.min(QUARTS_PAR_COEUR, c.quarts - i * QUARTS_PAR_COEUR)),
  )
}

/**
 * Ce qu'un coup a fait à la rangée : les quarts perdus cœur par cœur, et les
 * cœurs BRISÉS (pleins ou entamés avant, vides après) — ceux-là se fendent en
 * deux à l'écran, les autres ne perdent qu'un morceau.
 */
export function pertes(avant: Coeurs, apres: Coeurs): { perdus: number[]; brises: number[] } {
  const a = remplissages(avant)
  const b = remplissages({ ...apres, max: avant.max })
  const perdus = a.map((q, i) => Math.max(0, q - (b[i] ?? 0)))
  const brises = a.flatMap((q, i) => (q > 0 && (b[i] ?? 0) === 0 ? [i] : []))
  return { perdus, brises }
}

/** Il ne reste qu'un cœur, ou moins : le cœur bat, le bord de l'écran rougit. */
export function dernierCoeur(c: Coeurs): boolean {
  return c.quarts > 0 && c.quarts <= QUARTS_PAR_COEUR
}

const FRACTIONS = ['', '¼', '½', '¾']

/** « 3½ » : le compte écrit, pour qui ne lit pas les dessins (lecteur d'écran, daltonisme). */
export function compteCoeurs(c: Coeurs): string {
  const entiers = Math.floor(c.quarts / QUARTS_PAR_COEUR)
  const reste = c.quarts % QUARTS_PAR_COEUR
  if (entiers === 0 && reste > 0) return FRACTIONS[reste]
  return `${entiers}${FRACTIONS[reste]}`
}

/** La phrase du lecteur d'écran : « 3½ cœurs sur 5 ». */
export function lectureCoeurs(c: Coeurs): string {
  const n = compteCoeurs(c)
  const pluriel = c.quarts > QUARTS_PAR_COEUR ? 'cœurs' : 'cœur'
  return `${n} ${pluriel} sur ${c.max}`
}
