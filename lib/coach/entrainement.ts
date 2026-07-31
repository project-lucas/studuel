// -----------------------------------------------------------------------------
// « S'entraîner » — les contrôles que Marcel propose, matière par matière.
//
// GRANULARITÉ DÉCIDÉE (31/07) : le contrôle porte sur une MATIÈRE À UN NIVEAU,
// pas sur un chapitre. Le comptage du catalogue est sans appel — 521 questions
// pour ~257 chapitres, soit 2 à 3 par chapitre : un contrôle de chapitre serait
// une farce, alors qu'une matière entière rassemble de quoi tenir un vrai sujet.
// Aucune génération, aucun coût, disponible tout de suite.
//
// Le contrôle lui-même est JOUÉ par l'examen blanc ciblé qui existe déjà
// (`/reviser/examen-blanc?subject=…`) : même chrono, même bilan par chapitre.
// Marcel n'écrit pas un second joueur — il oriente vers celui de Réviser.
//
// Logique PURE : décider si une matière est prête et ce que le contrôle
// portera. Le serveur compte, cette fonction juge, le composant affiche.
// -----------------------------------------------------------------------------

import { EXAM_MAX_QUESTIONS, examDurationSeconds } from '../exam-blanc'
import { regimeOf, type Regime } from './regimes'

/**
 * En dessous, le « contrôle » ne vaut pas son nom : six questions ne disent rien
 * d'une matière, et un bilan par chapitre bâti dessus serait du bruit. Marcel
 * préfère annoncer qu'il n'a pas assez de matière plutôt que servir un sujet
 * creux — c'est le même principe que les matières hors doctrine.
 */
export const CONTROLE_MIN_QUESTIONS = 8

export type MatiereEntrainement = {
  slug: string
  name: string
  /** Questions réellement disponibles au niveau de l'élève. */
  disponibles: number
  /** Questions que portera le contrôle (plafonné comme l'examen blanc). */
  questions: number
  /** Durée annoncée, en minutes pleines. */
  minutes: number
  /** Assez de matière pour un vrai contrôle ? */
  pret: boolean
  regime: Regime | null
}

export type EntrainementInput = {
  /** slug → nom d'affichage, pour les matières suivies. */
  matieres: readonly { slug: string; name: string }[]
  /** slug → nombre de questions disponibles au niveau de l'élève. */
  disponiblesBySlug: Readonly<Record<string, number>>
}

/** Durée annoncée d'un contrôle de `questions` questions, en minutes pleines. */
export function controleMinutes(questions: number): number {
  return Math.max(1, Math.round(examDurationSeconds(questions) / 60))
}

/**
 * Ce que Marcel peut proposer aujourd'hui, matière par matière.
 *
 * Les matières PRÊTES d'abord (les seules jouables), puis les autres — mais on
 * garde ces dernières dans la liste : « il me manque des questions ici » est une
 * information utile, un trou silencieux ne l'est pas.
 */
export function entrainementsFor(
  input: EntrainementInput,
): MatiereEntrainement[] {
  const { matieres, disponiblesBySlug } = input

  return matieres
    .map((matiere) => {
      const brut = disponiblesBySlug[matiere.slug] ?? 0
      const disponibles = Number.isFinite(brut) ? Math.max(0, Math.floor(brut)) : 0
      const questions = Math.min(disponibles, EXAM_MAX_QUESTIONS)
      return {
        slug: matiere.slug,
        name: matiere.name,
        disponibles,
        questions,
        minutes: controleMinutes(questions),
        pret: disponibles >= CONTROLE_MIN_QUESTIONS,
        regime: regimeOf(matiere.slug),
      }
    })
    .sort((a, b) => {
      if (a.pret !== b.pret) return Number(b.pret) - Number(a.pret)
      return b.disponibles - a.disponibles
    })
}

/** Où se joue le contrôle d'une matière — chez Réviser, pas chez Marcel. */
export function controleHref(slug: string): string {
  return `/reviser/examen-blanc?subject=${encodeURIComponent(slug)}`
}

/** Combien de matières sont réellement jouables. */
export function countPretes(liste: readonly MatiereEntrainement[]): number {
  return liste.filter((m) => m.pret).length
}
