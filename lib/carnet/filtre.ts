// -----------------------------------------------------------------------------
// FILTRER LES DOSSIERS DU CARNET — retrouver un cours quand on en a beaucoup.
//
// Un élève qui saisit un dossier par chapitre en a vite trente ; un étudiant,
// cent. La grille ne suffit plus : il faut pouvoir taper trois lettres, ou
// toucher une pastille de couleur, et ne voir que ce qui correspond. La
// couleur n'est pas décorative ici : c'est LE moyen de ranger que l'élève a
// sous la main (« tout ce qui est menthe, c'est l'histoire »), et la filtrer
// donne un sens à la personnalisation.
//
// Logique PURE, aucun accès base. `BentoCarnet` tient l'état du filtre et
// applique ces fonctions ; la recherche n'apparaît qu'à partir de
// `SEUIL_RECHERCHE` dossiers — avant, elle prendrait la place pour rien.
// -----------------------------------------------------------------------------

import { COURSE_COLORS, normalizeCourseColor, type CourseColor } from '@/lib/carnet-cours'
import type { CoursCarnet } from './priorite'

/** À partir de combien de dossiers la barre de recherche apparaît. */
export const SEUIL_RECHERCHE = 6

export type FiltreCarnet = {
  /** Texte tapé par l'élève, tel quel (la normalisation est faite ici). */
  texte: string
  /** Une couleur de dossier, ou `null` = toutes. */
  couleur: CourseColor | null
}

export const FILTRE_VIDE: FiltreCarnet = { texte: '', couleur: null }

/** Le libellé français de chaque couleur (pastilles du filtre, aria). */
export const COULEUR_LABEL: Record<CourseColor, string> = {
  violet: 'Violet',
  jaune: 'Jaune',
  corail: 'Corail',
  menthe: 'Menthe',
  ciel: 'Ciel',
  sable: 'Sable',
}

/**
 * Minuscules, sans accents, espaces repliés : « Été » retrouve « ete » et
 * « Grande  Guerre » retrouve « grande guerre ».
 */
export function normaliserTexte(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Y a-t-il quelque chose à filtrer ? */
export function estFiltreActif(f: FiltreCarnet): boolean {
  return normaliserTexte(f.texte).length > 0 || f.couleur !== null
}

/**
 * Un dossier passe-t-il le filtre ? Le texte est cherché dans le titre, la
 * description et l'objectif — l'élève qui a écrit « Brevet blanc » comme
 * objectif doit retrouver le dossier en tapant « brevet ».
 */
export function correspond(cours: CoursCarnet, f: FiltreCarnet): boolean {
  if (f.couleur !== null && normalizeCourseColor(cours.color) !== f.couleur) return false
  const q = normaliserTexte(f.texte)
  if (q.length === 0) return true
  const corpus = normaliserTexte([cours.title, cours.description ?? '', cours.objectif ?? ''].join(' '))
  return corpus.includes(q)
}

/** Les dossiers qui passent le filtre, dans l'ordre reçu (le tri est fait avant). */
export function filtrerCours(cours: readonly CoursCarnet[], f: FiltreCarnet): CoursCarnet[] {
  if (!estFiltreActif(f)) return [...cours]
  return cours.filter((c) => correspond(c, f))
}

/**
 * Les couleurs qu'au moins un dossier porte, dans l'ordre de la palette. Le
 * filtre ne propose que celles-là : une pastille qui ne rendrait rien est un
 * bouton mort.
 */
export function couleursPresentes(cours: readonly CoursCarnet[]): CourseColor[] {
  const presentes = new Set(cours.map((c) => normalizeCourseColor(c.color)))
  return COURSE_COLORS.filter((couleur) => presentes.has(couleur))
}
