// CE QU'ON SERT QUAND ON ROUVRE UN QUIZ DÉJÀ PASSÉ.
//
// Le quiz d'une fiche servait ses N questions, dans l'ordre, à chaque fois.
// Sur les 300 chapitres du catalogue, ça fait le même rituel 300 fois — et
// surtout, revenir sur un chapitre voulait dire refaire en entier les questions
// qu'on maîtrisait déjà pour retomber sur les deux qui coincent.
//
// Le moteur de sélection (`lib/questions/engine`) sait pourtant composer une
// session : échues d'abord, jamais vues ensuite, le reste au sort, fenêtre
// anti-répétition. Le quiz le NOURRISSAIT (`recordReviewAnswers`) sans jamais
// le LIRE. Il le lit maintenant — mais seulement au deuxième passage :
//
//   1er passage      → le quiz entier, dans l'ordre. C'est l'ÉVALUATION : elle
//                      donne la note, la couronne et la maîtrise du chapitre,
//                      et une note ne se calcule pas sur un échantillon choisi
//                      pour être difficile ;
//   passages suivants → une SÉANCE d'entraînement plus courte, composée par le
//                      moteur. Elle ne recompte pas dans la maîtrise (elle est
//                      `isPartial`, exactement comme le rejeu des erreurs) mais
//                      elle reprogramme la répétition espacée.

/**
 * La longueur d'une séance d'entraînement.
 *
 * Cinq et pas huit : la séance n'a plus à couvrir le chapitre (l'évaluation
 * l'a fait), seulement à remettre à l'épreuve ce qui bouge. Assez court pour
 * qu'on la refasse un soir sans y penser — c'est tout l'intérêt d'un passage
 * qui ne compte pas.
 */
export const ENTRAINEMENT_TAILLE = 5

/**
 * En dessous de ce compte, on renonce et on ressert le quiz entier.
 *
 * Une « séance » de deux questions ne vaut pas son écran de fin ; et un tirage
 * trop maigre signale en général que le moteur n'a pas d'état à lire (vue ou
 * colonnes absentes tant que la migration 239 n'est pas passée), auquel cas le
 * quiz complet reste la meilleure réponse.
 */
export const ENTRAINEMENT_MINIMUM = 3

/**
 * Faut-il composer une séance d'entraînement plutôt que resservir le quiz ?
 *
 * Non au premier passage — l'évaluation d'abord. Non si le quiz est déjà plus
 * court que la séance : tirer 5 questions parmi 4 ne choisit rien, et le paquet
 * ne serait pas `isPartial`, donc il recompterait dans la maîtrise sans que
 * l'élève l'ait demandé.
 */
export function veutEntrainement({
  dejaPasse,
  total,
}: {
  /** L'élève a-t-il déjà terminé ce quiz au moins une fois ? */
  dejaPasse: boolean
  /** Le nombre de questions du quiz. */
  total: number
}): boolean {
  return dejaPasse && total > ENTRAINEMENT_TAILLE
}
