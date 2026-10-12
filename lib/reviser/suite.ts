// -----------------------------------------------------------------------------
// LA SUITE D'UNE FICHE — où mène son bouton, sans rien demander au serveur.
//
// Lucas, 05/10/2026 : « ce que le user doit avoir rapidement ». Atteindre un
// cours coûtait trois gestes et une attente : la tuile du thème, le « + » de la
// fiche, le temps que ses supports reviennent du serveur (neuf lectures en
// quatre temps), puis « Cours ». Chaque fiche du sommaire porte maintenant UN
// bouton, qui est un simple lien vers ce qu'il reste à faire :
//
//     Cours   la première leçon pas encore lue ;
//     Quiz    le quiz d'une leçon lue, tant qu'il n'est pas acquis ;
//     Revoir  quand la fiche est terminée — on y revient, on ne la refait pas.
//
// Tout se calcule avec ce que la page de la matière lit DÉJÀ (le programme en
// cache, les leçons terminées, les meilleurs scores) : zéro requête de plus.
// Les quatre supports au complet restent derrière la ligne, dépliés à la
// demande comme avant — ce n'est plus le passage obligé.
//
// Les adresses sont celles de `lib/chapter-supports` (les tuiles de l'écran de
// chapitre) : un test les tient en miroir.
// -----------------------------------------------------------------------------

import { COMPLETE_THRESHOLD } from '@/lib/subject-template'

export type GenreSuite = 'cours' | 'quiz' | 'revoir'

export type SuiteFiche = {
  genre: GenreSuite
  /** Le mot du bouton : « Cours », « Quiz », « Revoir ». */
  label: string
  href: string
}

/** Une leçon de la fiche, vue par la suite. */
export type LeconDeFiche = {
  id: string
  /** La leçon a-t-elle été terminée (`lesson_completions`) ? */
  lue: boolean
  /** Le quiz PROPRE à la leçon, s'il existe. */
  quizId: string | null
  /** Le meilleur score à ce quiz (0 → 1), `null` s'il n'a jamais été joué. */
  meilleur: number | null
}

export const LIBELLES_SUITE: Record<GenreSuite, string> = {
  cours: 'Cours',
  quiz: 'Quiz',
  revoir: 'Revoir',
}

export const hrefCours = (subjectSlug: string, chapterId: string, lessonId: string) =>
  `/reviser/${subjectSlug}/${chapterId}/${lessonId}/cours`

export const hrefQuiz = (quizId: string) => `/test/${quizId}`

const suite = (genre: GenreSuite, href: string): SuiteFiche => ({
  genre,
  label: LIBELLES_SUITE[genre],
  href,
})

/**
 * Ce que le bouton de la fiche propose. Les leçons se suivent dans l'ordre du
 * chapitre : on lit, on se teste, on passe à la suivante.
 *
 * `null` quand la fiche n'a aucune leçon : il n'y a rien vers quoi conduire, la
 * ligne ne porte pas de bouton.
 */
export function suiteDeFiche(input: {
  subjectSlug: string
  chapterId: string
  lecons: readonly LeconDeFiche[]
  /** La fiche a atteint le seuil « terminé » (`chapterStatus`). */
  terminee: boolean
}): SuiteFiche | null {
  const { subjectSlug, chapterId, lecons, terminee } = input
  const premiere = lecons[0]
  if (!premiere) return null
  const revoir = suite('revoir', hrefCours(subjectSlug, chapterId, premiere.id))
  if (terminee) return revoir

  for (const lecon of lecons) {
    if (!lecon.lue) return suite('cours', hrefCours(subjectSlug, chapterId, lecon.id))
    if (lecon.quizId && (lecon.meilleur ?? 0) < COMPLETE_THRESHOLD) {
      return suite('quiz', hrefQuiz(lecon.quizId))
    }
  }
  // Tout est lu, et il n'y a pas (ou plus) de quiz à passer.
  return revoir
}
