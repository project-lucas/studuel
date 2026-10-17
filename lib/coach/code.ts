// Le CODE D'UN GROUPE de coach (migration 560) : 8 caractères de l'alphabet du
// code ami (sans 0/O/1/I/L). Pur : la forme du code, rien d'autre.

/** Le cookie qui porte le code saisi dans l'onboarding jusqu'à la session (cf. le parrainage). */
export const COACH_COOKIE = 'studuel_coach'

/** Le cookie vit deux semaines : le temps de confirmer un e-mail et de revenir. */
export const COACH_COOKIE_JOURS = 14

const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
const FORME = new RegExp(`^[${ALPHABET}]{8}$`)

/** Majuscules, sans espaces ni tirets : ce que l'élève tape avec des espaces passe. */
export function normaliserCode(brut: string): string {
  return brut.toUpperCase().replace(/[^A-Z0-9]/g, '')
}

export function codeValide(code: string): boolean {
  return FORME.test(code)
}

/** « U15 · coach Lucas » : ce que l'onboarding affiche du groupe rejoint. */
export function libelleGroupe(nom: string, categorie: string | null, coach: string): string {
  return `${nom}${categorie && categorie !== nom ? ` · ${categorie}` : ''} · coach ${coach}`
}

/** « ABCD EFGH » : le code en deux moitiés, plus facile à dicter. */
export function afficherCode(code: string): string {
  return code.length === 8 ? `${code.slice(0, 4)} ${code.slice(4)}` : code
}
