// Les supports d'un chapitre — Cours · Fiche · Flashcards · Quiz · Exercice ·
// Moi vs IA, plus « Mes erreurs » les jours où il y en a — choisis et étiquetés
// au même endroit pour les TROIS écrans qui les proposent :
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
  BIENTOT_LABEL,
  COMPLETE_THRESHOLD,
  SUPPORT_LABELS,
  cahierBadge,
  cahierMeta,
  carteMeta,
  erreursBadge,
  erreursMeta,
  exerciceBadge,
  exerciceMeta,
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
  /** Le quiz est-il celui de la leçon (`false` = emprunté au chapitre) ? */
  ownQuiz: boolean
  /**
   * La leçon a-t-elle été TERMINÉE (`lesson_completions`) ?
   *
   * C'est le seul jalon que l'élève pose lui-même, et il n'était pas remonté
   * jusqu'ici : la tuile « Cours » affichait `done: false` en dur, quel que
   * soit le travail fourni. Sous une fiche dépliée, aucun des six supports ne
   * portait donc jamais la moindre marque — on ne pouvait pas savoir ce qu'on
   * avait déjà fait sans rouvrir chacun d'eux.
   */
  read: boolean
}

export type ChapterSupportsInput = {
  subjectSlug: string
  chapterId: string
  lessons: SupportLesson[]
  /** Carte mentale du chapitre : existante (ou dérivable) et déverrouillée ? */
  carte: { available: boolean; locked: boolean }
  /**
   * L'exercice du chapitre (le faux contrôle IA) : la meilleure copie rendue,
   * et l'élève a-t-il l'abonnement qui l'ouvre. La tuile se montre dans tous
   * les cas — c'est l'offre — mais elle porte la couronne.
   */
  exercice: {
    best: { note: number; sur: number } | null
    premium: boolean
    /**
     * Le CAHIER d'exercices du chapitre (migration 372) : combien d'exercices
     * réussis sur combien. Absent ou vide = le chapitre n'a pas encore le sien,
     * la tuile parle alors du contrôle blanc (la meilleure copie).
     */
    cahier?: { reussis: number; total: number } | null
  }
  /** Notions de CE chapitre dans la file de révision du jour (0 = pas de tuile). */
  erreurs: number
}

/**
 * Les supports du chapitre, dans l'ordre des trois groupes : APPRENDRE (cours,
 * fiche), MÉMORISER (flashcards, mes erreurs s'il y en a), SE TESTER (quiz,
 * exercice, moi vs IA). C'est `groupSupports` qui les range à l'écran ; ici
 * on les émet déjà dans cet ordre pour que les rendus en ligne (fiche dépliée)
 * le suivent sans rien savoir des groupes.
 *
 * `focusLessonId` (pied de cours) épingle la leçon que l'élève vient de lire :
 * ses supports à elle, pas ceux d'une autre. Sans lui (onglet « Mode de jeu »),
 * chaque support pointe vers ce qu'il RESTE à faire dans le chapitre.
 */
export function buildChapterSupports(
  input: ChapterSupportsInput,
  focusLessonId?: string,
): SupportChip[] {
  const { subjectSlug, chapterId, lessons, carte, exercice, erreurs } = input
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
      // Lu = fait. En pied de cours, la tuile pointe la leçon SUIVANTE : c'est
      // donc bien l'état de celle-là qu'on affiche, pas de celle qu'on vient
      // de finir.
      done: coursLesson.read,
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
      // ⚠️ JAMAIS « FAIT », ET C'EST VOLONTAIRE. On serait tenté de cocher
      // quand plus rien n'est dû (`dueCount === 0`) — mais un paquet JAMAIS
      // OUVERT ne doit rien non plus, et les deux se ressemblent d'ici. Cocher
      // sur cette base afficherait « à jour » sur des cartes qu'on n'a jamais
      // vues. Le badge, lui, dit l'état sans mentir : « 12 cartes » quand rien
      // n'est dû, « 4 à revoir » sinon.
      done: false,
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

  // Exercice : le faux contrôle du CHAPITRE (pas d'une leçon), rédigé et
  // corrigé par l'IA. Toujours proposé dès qu'il y a de quoi l'écrire — le
  // cours — et coiffé de la couronne Studuel+.
  // Le chapitre a son cahier (trois exercices à étoiles) : la tuile compte les
  // exercices réussis, et se coche quand les trois le sont.
  const cahier = exercice.cahier && exercice.cahier.total > 0 ? exercice.cahier : null
  chips.push({
    kind: 'exercice',
    label: SUPPORT_LABELS.exercice,
    meta: cahier ? cahierMeta(cahier) : exerciceMeta(exercice.best),
    badge: cahier ? cahierBadge(cahier) : exerciceBadge(exercice.best),
    href: `/reviser/${subjectSlug}/${chapterId}/exercice`,
    done: cahier
      ? cahier.reussis >= cahier.total
      : exercice.best !== null &&
        exercice.best.sur > 0 &&
        exercice.best.note / exercice.best.sur >= COMPLETE_THRESHOLD,
    premium: true,
    locked: !exercice.premium,
  })

  // Moi vs IA : le BLOC RÉSERVÉ. Pas de page derrière — la tuile dit
  // « Bientôt » et ne mène nulle part. Elle tient sa place dans « Se tester »
  // pour qu'on voie l'écran tel qu'il sera si Lucas y revient.
  chips.push({
    kind: 'ia',
    label: SUPPORT_LABELS.ia,
    meta: BIENTOT_LABEL,
    badge: BIENTOT_LABEL,
    href: '',
    done: false,
    premium: true,
    bientot: true,
  })

  return chips
}
