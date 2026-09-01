// Les supports d'un chapitre — Cours · Quiz · Flashcards · Carte mentale ·
// Défi, plus « Mes erreurs » les jours où il y en a — choisis et étiquetés au
// même endroit pour les TROIS écrans qui les proposent :
//
//  1. l'écran de chapitre, où l'élève choisit par quoi il commence (rien n'est
//     encore lu : chaque support pointe le premier de son genre) ;
//  2. l'onglet « Mode de jeu » de la page matière, où chaque chapitre porte ses
//     formats en pastilles (on vise ce qui RESTE à faire) ;
//  3. le pied du cours, où l'élève vient de lire une leçon PRÉCISE : les
//     supports se calent alors sur elle.
//
// Une seule règle de choix, testée, pour que le pied de cours et l'onglet ne
// racontent jamais deux histoires différentes du même chapitre.

import {
  COMPLETE_THRESHOLD,
  SUPPORT_LABELS,
  carteMeta,
  defiMeta,
  erreursBadge,
  erreursMeta,
  flashcardsBadge,
  flashcardsMeta,
  quizBadge,
  quizMeta,
  type SupportChip,
} from '@/lib/subject-template'

export type SupportLesson = {
  id: string
  /** Titre de la leçon — l'état affiché sous la pastille « Cours ». */
  title: string
  /**
   * Quiz qui alimente les supports de la leçon : le sien, ou celui emprunté au
   * chapitre (la base compte 564 leçons pour 295 quiz — cf. lib/lesson-quiz).
   */
  quizId: string | null
  /** Nombre de questions du quiz retenu — 0 = aucun support jouable. */
  questionCount: number
  /** Items de la file SRS du jour rattachés à ce quiz. */
  dueCount: number
  /** Meilleur essai du quiz PROPRE à la leçon, `null` s'il n'a jamais été joué. */
  best: { score: number; total: number; ratio: number } | null
  /** Le défi de cette leçon a-t-il déjà été relevé ? */
  defiAttempted: boolean
  /** Le quiz est-il celui de la leçon (`false` = emprunté au chapitre) ? */
  ownQuiz: boolean
}

export type ChapterSupportsInput = {
  subjectSlug: string
  chapterId: string
  lessons: SupportLesson[]
  /** Carte mentale du chapitre : existante (ou dérivable) et déverrouillée ? */
  carte: { available: boolean; locked: boolean }
  /** Notions de CE chapitre dans la file de révision du jour (0 = pas de tuile). */
  erreurs: number
}

/**
 * Les supports du chapitre, dans l'ordre d'usage : lire (cours), réviser
 * (quiz), mémoriser (flashcards), prendre de la hauteur (carte), jouer (défi),
 * corriger (mes erreurs, seulement s'il y en a).
 *
 * `focusLessonId` (pied de cours) épingle la leçon que l'élève vient de lire :
 * ses supports à elle, pas ceux d'une autre. Sans lui (onglet « Mode de jeu »),
 * chaque support pointe vers ce qu'il RESTE à faire dans le chapitre.
 */
export function buildChapterSupports(
  input: ChapterSupportsInput,
  focusLessonId?: string,
): SupportChip[] {
  const { subjectSlug, chapterId, lessons, carte, erreurs } = input
  const focusIndex = focusLessonId
    ? lessons.findIndex((l) => l.id === focusLessonId)
    : -1
  const focus = focusIndex >= 0 ? lessons[focusIndex] : null
  const chips: SupportChip[] = []

  // Cours : le premier support, parce que c'est par là qu'on commence. En pied
  // de cours, il ne pointe pas sur la leçon qu'on vient de lire (elle est à
  // l'écran) mais sur la SUIVANTE — et disparaît sur la dernière du chapitre,
  // où il n'y a plus rien à lire.
  const coursLesson = focus ? (lessons[focusIndex + 1] ?? null) : (lessons[0] ?? null)
  if (coursLesson) {
    chips.push({
      kind: 'cours',
      label: SUPPORT_LABELS.cours,
      meta: coursLesson.title,
      badge: null,
      href: `/reviser/${subjectSlug}/${chapterId}/${coursLesson.id}/cours`,
      done: false,
    })
  }

  // Quiz : celui de la leçon lue, sinon le premier du chapitre qui n'est pas
  // déjà acquis — reprendre un quiz à 10/10 n'apprend plus rien.
  const quizLesson =
    (focus?.ownQuiz && focus.quizId ? focus : null) ??
    lessons.find(
      (l) => l.ownQuiz && l.quizId && (l.best?.ratio ?? 0) < COMPLETE_THRESHOLD,
    ) ??
    lessons.find((l) => l.ownQuiz && l.quizId) ??
    null
  if (quizLesson?.quizId) {
    chips.push({
      kind: 'quiz',
      label: SUPPORT_LABELS.quiz,
      meta: quizMeta(quizLesson.best),
      badge: quizBadge(quizLesson.best, quizLesson.questionCount),
      href: `/test/${quizLesson.quizId}`,
      done: (quizLesson.best?.ratio ?? 0) >= COMPLETE_THRESHOLD,
    })
  }

  // Flashcards : la leçon lue si elle a des cartes, sinon la première qui en a.
  const cardsLesson =
    (focus && focus.questionCount > 0 ? focus : null) ??
    lessons.find((l) => l.questionCount > 0) ??
    null
  if (cardsLesson) {
    chips.push({
      kind: 'flashcards',
      label: SUPPORT_LABELS.flashcards,
      meta: flashcardsMeta(cardsLesson.questionCount, cardsLesson.dueCount),
      badge: flashcardsBadge(cardsLesson.questionCount, cardsLesson.dueCount),
      href: `/reviser/${subjectSlug}/${chapterId}/${cardsLesson.id}/flashcards`,
      done: false,
    })
  }

  // Carte mentale : portée par le chapitre, pas par la leçon.
  if (carte.available) {
    chips.push({
      kind: 'carte',
      label: SUPPORT_LABELS.carte,
      meta: carteMeta(carte.locked),
      badge: carte.locked ? carteMeta(true) : null,
      href: `/reviser/${subjectSlug}/${chapterId}/carte`,
      done: false,
      locked: carte.locked,
    })
  }

  // Défi : la leçon lue, sinon la première dont le défi n'a pas été relevé.
  const defiLesson =
    (focus && focus.questionCount > 0 ? focus : null) ??
    lessons.find((l) => l.questionCount > 0 && !l.defiAttempted) ??
    lessons.find((l) => l.questionCount > 0) ??
    null
  if (defiLesson) {
    chips.push({
      kind: 'defi',
      label: SUPPORT_LABELS.defi,
      meta: defiMeta(defiLesson.defiAttempted),
      badge: null,
      href: `/reviser/${subjectSlug}/${chapterId}/${defiLesson.id}/defi`,
      done: defiLesson.defiAttempted,
    })
  }

  // Mes erreurs : la tuile n'apparaît QUE s'il y a des notions à corriger.
  // Une tuile « 0 à revoir » occuperait une place pour ne rien proposer — et
  // c'est le seul support qui puisse légitimement ne pas exister ce jour-là.
  if (erreurs > 0) {
    chips.push({
      kind: 'erreurs',
      label: SUPPORT_LABELS.erreurs,
      meta: erreursMeta(erreurs),
      badge: erreursBadge(erreurs),
      href: `/reviser/revoir?matiere=${subjectSlug}&chapitre=${chapterId}`,
      done: false,
    })
  }

  return chips
}
