// Quel quiz alimente les supports d'une leçon (flashcards, défi de leçon) —
// logique pure, testée.
//
// LE PROBLÈME MESURÉ (sonde du 01/08/2026) : 564 leçons pour 295 quiz. Un
// chapitre porte presque toujours DEUX leçons et UN seul quiz : la seconde
// leçon affichait donc « les flashcards arrivent bientôt » et « le défi de
// cette leçon arrive bientôt » — 269 impasses, soit près d'une leçon sur deux.
//
// LA RÈGLE : une leçon se sert d'abord de SON quiz. À défaut, elle emprunte
// celui d'une leçon voisine DU MÊME CHAPITRE — même programme, même niveau,
// donc des cartes et un défi légitimes. L'appelant sait si le quiz est emprunté
// (`source`) et le dit à l'élève : on ne fait jamais passer le quiz du voisin
// pour celui de la leçon.
//
// Le repli est DÉTERMINISTE (première leçon du chapitre, dans l'ordre
// d'affichage, qui possède un quiz) : deux visites donnent les mêmes cartes.

export type ChapterQuiz = {
  id: string
  lesson_id: string | null
  is_free: boolean
}

export type LessonQuizPick = {
  quizId: string
  isFree: boolean
  // 'lesson'  : le quiz de cette leçon ;
  // 'chapter' : emprunté à une leçon voisine du chapitre.
  source: 'lesson' | 'chapter'
}

// `orderedLessonIds` : les leçons du chapitre dans leur ordre d'affichage
// (position croissante), telles que la page chapitre les liste.
export function pickLessonQuiz(
  lessonId: string,
  orderedLessonIds: readonly string[],
  quizzes: readonly ChapterQuiz[],
): LessonQuizPick | null {
  const propre = quizzes.find((q) => q.lesson_id === lessonId)
  if (propre) {
    return { quizId: propre.id, isFree: propre.is_free, source: 'lesson' }
  }

  for (const voisine of orderedLessonIds) {
    if (voisine === lessonId) continue
    const emprunte = quizzes.find((q) => q.lesson_id === voisine)
    if (emprunte) {
      return { quizId: emprunte.id, isFree: emprunte.is_free, source: 'chapter' }
    }
  }

  return null
}

// Libellé honnête pour l'élève : on nomme l'emprunt.
export function quizSourceLabel(
  source: LessonQuizPick['source'],
  chapterTitle: string,
): string | null {
  return source === 'chapter' ? `Questions du chapitre · ${chapterTitle}` : null
}
