// -----------------------------------------------------------------------------
// LA TEINTE D'UNE MATIÈRE — la robe de sa bannière.
//
// Lucas, 05/10/2026 : « seul l'onglet Mode de jeu a des couleurs à offrir ». Le
// dossier d'une matière s'ouvre désormais sur une BANNIÈRE à sa teinte — rose en
// français, bleu en maths, vert en SVT —, la même que celle de ses billets de
// jeu : on reconnaît son dossier à sa couleur avant d'avoir lu son nom.
//
// C'est la décision (c) du 23/09/2026 (« la teinte d'une matière n'est plus
// jamais un fond ») qui est levée, pour la bannière SEULEMENT : le reste de la
// page reste sur le mur crème, et les boutons restent violets.
//
// Les teintes sont celles de la palette d'identité (`[data-teinte]`,
// globals.css) : aucune couleur n'est inventée ici. Pur, sans import : la
// bannière est un composant client.
// -----------------------------------------------------------------------------

export type TeinteMatiere =
  | 'violet'
  | 'rose'
  | 'bleu'
  | 'vert'
  | 'ambre'
  | 'indigo'
  | 'corail'
  | 'turquoise'

/**
 * Les matières qui ont leurs jeux dans l'arène portent la teinte de leurs
 * billets (`TEINTE_MATIERE`, lib/defi/modes-catalog) — un test les tient en
 * miroir.
 */
const PAR_MATIERE: Record<string, TeinteMatiere> = {
  'histoire-geo': 'ambre',
  francais: 'rose',
  maths: 'bleu',
  anglais: 'indigo',
  espagnol: 'corail',
  svt: 'vert',
  'physique-chimie': 'turquoise',
  musique: 'indigo',
  sport: 'corail',
  'arts-plastiques': 'rose',
}

/** Les autres suivent la couleur que la base leur donne (`subjects.color`). */
const PAR_COULEUR: Record<string, TeinteMatiere> = {
  blue: 'bleu',
  red: 'corail',
  orange: 'ambre',
  green: 'vert',
  purple: 'violet',
  indigo: 'indigo',
  teal: 'turquoise',
  pink: 'rose',
  yellow: 'ambre',
  slate: 'indigo',
}

export function teinteMatiere(slug: string, color: string | null | undefined): TeinteMatiere {
  return PAR_MATIERE[slug] ?? (color ? PAR_COULEUR[color] : undefined) ?? 'violet'
}

/** Cette couleur de matière a-t-elle sa teinte ? (garde-fou du catalogue) */
export function aUneTeinte(color: string): boolean {
  return color in PAR_COULEUR
}
