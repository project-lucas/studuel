// L'ÉLIGIBILITÉ AU DUEL CLASSÉ — logique pure, sans React ni Supabase.
//
// Une matière ne s'ouvre au classé que quand l'élève y a TERMINÉ un chapitre.
// C'est la seule porte, et elle existe pour une raison précise : le classé tire
// ses questions dans le programme de la matière (cf. `lib/questions`). Ouvrir
// une matière jamais travaillée, ce serait envoyer un élève de 3e affronter un
// ladder sur des chapitres qu'il n'a pas lus, perdre, et conclure qu'il est
// mauvais en physique — alors qu'on ne lui a rien appris.
//
// CE QUE « TERMINÉ » VEUT DIRE. Le quiz du chapitre réussi à au moins 70 %, au
// moins une fois. Trois définitions concurrentes ont été écartées :
//
//   · « vu en cours » coché par l'élève (table `chapitres_vus`, migration 224)
//     est une DÉCLARATION de périmètre, pas une preuve de travail : le
//     classement entier s'ouvrirait en dix taps. La 224 le dit elle-même — on y
//     déclare ce qu'on a vu, jamais son niveau.
//
//   · la maîtrise de `lib/mastery.ts` au-dessus d'un seuil DÉCROÎT avec le
//     temps (elle mélange score de quiz et plancher de leçon, et se recalcule) :
//     une matière débloquée pourrait se REVERROUILLER. En jeu, reprendre une
//     ouverture est la faute la plus mal vécue qui soit.
//
//   · le boss du chapitre battu se lit très bien (« bats le gardien pour ouvrir
//     le classé »), mais tous les chapitres n'ont pas de boss câblé : des
//     matières entières resteraient fermées à vie.
//
// Le seuil retenu se calcule à partir de données DÉJÀ LUES sur chaque écran
// (`test_sessions` via `lib/mastery`), donc sans une requête de plus, et il ne
// peut que monter : un score n'est jamais retiré à l'élève.

import type { ChapterProgress } from '@/lib/mastery'

/**
 * Score minimal, sur le meilleur passage du quiz, pour qu'un chapitre compte
 * comme terminé. 70 % : au-dessus du hasard d'un QCM à quatre options (25 %) et
 * au-dessus du « à peu près » (50 %), sans exiger le sans-faute — la porte
 * doit s'ouvrir, pas se mériter deux fois.
 */
export const CHAPTER_COMPLETE_SCORE = 0.7

/**
 * Un chapitre terminé : quiz réellement TENTÉ et réussi au seuil. La condition
 * `quizAttempted` n'est pas redondante — une leçon lue pose un plancher de
 * maîtrise (`LESSON_FLOOR`) sans qu'aucune question ait été posée, et on ne
 * débloque pas un ladder sur une lecture.
 */
export function isChapterCompleted(progress: ChapterProgress | undefined): boolean {
  if (!progress) return false
  return progress.quizAttempted && progress.value >= CHAPTER_COMPLETE_SCORE
}

/** Le rattachement d'un chapitre à sa matière, tel que le rend le catalogue. */
export type ChapterSubject = {
  chapterId: string
  subjectSlug: string
}

/**
 * Les matières ouvertes au classé : celles qui comptent au moins un chapitre
 * terminé.
 *
 * Rendre un `Set` de slugs et non un tableau de matières : les trois écrans qui
 * s'en servent (l'arène, la vitrine de la Boutique, l'appariement) posent tous
 * la même question — « celle-ci est-elle ouverte ? » — et aucun n'a besoin de
 * l'ordre.
 */
export function unlockedSubjectSlugs(
  mastery: ReadonlyMap<string, ChapterProgress>,
  chapters: readonly ChapterSubject[],
): Set<string> {
  const ouvertes = new Set<string>()
  for (const chapter of chapters) {
    if (ouvertes.has(chapter.subjectSlug)) continue
    if (isChapterCompleted(mastery.get(chapter.chapterId))) {
      ouvertes.add(chapter.subjectSlug)
    }
  }
  return ouvertes
}

/**
 * Les matières qu'un chapitre VIENT d'ouvrir : celles présentes dans le nouvel
 * ensemble et absentes de l'ancien.
 *
 * Sert la célébration de fin de quiz (« Physique-Chimie rejoint le classé ! »).
 * Un déblocage est le seul moment où le ladder d'une matière démarre à zéro
 * trophée, et le taire reviendrait à ouvrir une porte dans le dos de l'élève.
 */
export function newlyUnlocked(
  before: ReadonlySet<string>,
  after: ReadonlySet<string>,
): string[] {
  return [...after].filter((slug) => !before.has(slug))
}
