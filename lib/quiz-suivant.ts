// -----------------------------------------------------------------------------
// L'ÉCRAN DE FIN D'UN QUIZ, EN XP — logique pure (convention projet).
//
// Depuis le 16/09/2026 (demande de Lucas, modèle Wilgo), la fin d'un quiz ne
// dit plus « 7/10 » : elle dit ce que le chapitre a ACQUIS (« Questions
// maîtrisées 10/28 »), ce que la manche a RAPPORTÉ (« +14 XP »), et TENTE le
// quiz suivant avec l'XP qu'il promet (« Quiz suivant · +30 XP »). Tout ce qui
// se calcule pour cet écran vit ici, testé : quel quiz vient après, combien il
// paye, quelles questions comptent comme acquises.
//
// Aucun accès à la base : `app/test/[id]/page.tsx` lit les lignes et appelle.
// -----------------------------------------------------------------------------

import { MIN_BOX, isUnseen, type QuestionState } from '@/lib/questions/engine'
import { XP_AWARDS, couronneSource } from '@/lib/wallet'
import { crowns } from '@/lib/subject-template'

/** Une leçon du chapitre, avec son quiz s'il en a un (le premier par id). */
export type LeconRef = {
  id: string
  position: number
  quizId: string | null
  quizTitre: string | null
}

/** Un chapitre de la matière, au niveau de l'élève. */
export type ChapitreRef = { id: string; position: number }

/** Le quiz désigné comme suivant. */
export type QuizCible = { quizId: string; titre: string }

/** Ce que l'écran de fin reçoit : où aller, comment ça s'appelle, ce que ça paye. */
export type QuizSuivant = { href: string; titre: string; xp: number }

// Ordre de lecture d'une liste : la position du programme, puis l'id pour que
// deux positions égales (import en double) donnent toujours le même ordre.
function parPosition<T extends { id: string; position: number }>(
  liste: readonly T[],
): T[] {
  return [...liste].sort(
    (a, b) => a.position - b.position || a.id.localeCompare(b.id),
  )
}

/**
 * Le quiz de la LEÇON SUIVANTE du même chapitre — la première, après celle qui
 * porte `quizId`, qui ait un quiz. Null si `quizId` n'est porté par aucune
 * leçon de la liste, ou s'il n'y a plus de quiz derrière.
 */
export function quizDeLaLeconSuivante(
  lecons: readonly LeconRef[],
  quizId: string,
): QuizCible | null {
  const ordre = parPosition(lecons)
  const index = ordre.findIndex((l) => l.quizId === quizId)
  if (index < 0) return null
  return premierQuiz(ordre.slice(index + 1))
}

/** Le chapitre qui suit `courant` dans le programme, ou null au dernier. */
export function chapitreSuivant(
  chapitres: readonly ChapitreRef[],
  courant: string,
): ChapitreRef | null {
  const ordre = parPosition(chapitres)
  const index = ordre.findIndex((c) => c.id === courant)
  if (index < 0) return null
  return ordre[index + 1] ?? null
}

/** Le premier quiz d'une liste de leçons, dans l'ordre du programme. */
export function premierQuiz(lecons: readonly LeconRef[]): QuizCible | null {
  const lecon = parPosition(lecons).find((l) => l.quizId !== null)
  if (!lecon || !lecon.quizId) return null
  return { quizId: lecon.quizId, titre: lecon.quizTitre ?? 'Quiz' }
}

/**
 * L'XP QUE PROMET un quiz, d'après l'avancement (0..1) de son chapitre.
 *
 * L'XP ne paye que l'ACQUIS (cf. lib/wallet) : un quiz rapporte l'XP de la
 * couronne qu'il fait franchir, et rien s'il n'en franchit aucune. La promesse
 * honnête est donc celle de la PROCHAINE couronne du chapitre — 30 XP pour un
 * chapitre vierge, 40 puis 60 ensuite, et 0 quand les trois sont acquises :
 * on ne promet pas ce que la base ne versera pas.
 */
export function xpPromise(valeurChapitre: number): number {
  const acquises = crowns(Math.max(0, Math.min(1, valeurChapitre)))
  if (acquises >= 3) return 0
  const prochaine = (acquises + 1) as 1 | 2 | 3
  return XP_AWARDS[couronneSource(prochaine)]
}

/**
 * Une question est ACQUISE quand elle a quitté la première boîte de Leitner :
 * répondue juste au moins une fois, et jamais ratée depuis (une erreur ramène
 * en boîte 1, cf. `applyAnswer`). C'est le même seuil que l'entrée dans la
 * jauge de maîtrise du chapitre (`chapterMastery`, boîte 1 = 0).
 */
export function estAcquise(state: QuestionState | undefined | null): boolean {
  if (isUnseen(state)) return false
  return (state as QuestionState).box > MIN_BOX
}

/** Les ids acquis parmi `questionIds`, d'après les états lus en base. */
export function questionsAcquises(
  questionIds: readonly string[],
  states: ReadonlyMap<string, QuestionState>,
): string[] {
  return questionIds.filter((id) => estAcquise(states.get(id)))
}

/**
 * Le compte affiché : les acquises DÉJÀ en base, plus les réussites de la
 * manche qui vient de se jouer (les états sont lus avant l'écriture des
 * réponses, donc elles n'y sont pas encore). Sans doublon, borné au total.
 */
export function compteAcquises(
  acquisesIds: readonly string[],
  reussiesIds: readonly string[],
  total: number,
): number {
  const ensemble = new Set([...acquisesIds, ...reussiesIds])
  return Math.min(Math.max(0, total), ensemble.size)
}
