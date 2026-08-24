// L'ÉCRAN DE RECHERCHE D'ADVERSAIRE — la seconde qui sépare le tap du duel.
//
// À ne pas confondre avec `lib/defi/matchmaking` : celui-là CHOISIT vraiment
// l'adversaire (fourchette de trophées, élargissements, entraîneur de repli) et
// tourne côté serveur au rendu de la route du duel. Ce fichier-ci ne décide de
// rien — il ne tient que la mise en scène du rideau qui couvre l'attente.
//
// Pourquoi une attente VOLONTAIRE, alors que l'adversaire est déjà apparié au
// moment où la page se rend : parce qu'un duel qui commence sans qu'on ait vu
// chercher ne se lit pas comme un duel. L'écran d'appariement est ce qui
// transforme « j'ouvre un quiz » en « on m'a trouvé quelqu'un ».
//
// Elles ne sont pas perdues pour autant : la navigation part EN MÊME TEMPS que
// l'animation (cf. `MatchmakingOverlay`). Pendant que la loupe tourne, Next
// charge la route du duel. L'attente affichée COUVRE le vrai chargement au lieu
// de s'y ajouter.

/**
 * La durée de la recherche, en millisecondes.
 *
 * Deux secondes : assez pour que la loupe fasse deux tours complets et que
 * l'annonce se lise, assez court pour ne pas devenir un péage. En dessous d'une
 * seconde et demie l'écran clignote sans qu'on ait le temps de le voir, ce qui
 * est pire que pas d'écran du tout.
 */
export const RECHERCHE_MS = 2000

/**
 * La part de la recherche au-delà de laquelle l'adversaire est annoncé trouvé.
 *
 * Cette bascule n'est pas cosmétique : sans elle, l'écran reste identique
 * pendant deux secondes et l'élève doute que quelque chose se passe. Voir
 * « Adversaire trouvé » avant de partir referme la boucle — c'est la réponse à
 * la question qu'on venait de poser.
 */
export const SEUIL_TROUVE = 0.7

/**
 * L'annonce, selon l'avancement de la recherche.
 *
 * SANS POINTS DE SUSPENSION. Ils sont rendus à part par la vue, un par un et
 * animés (`.recherche-points`) : gravés dans la chaîne, ils seraient figés, et
 * il faudrait les retirer de l'annonce de fin où ils n'ont rien à faire.
 */
export function annonceRecherche(progres: number): string {
  return progres >= SEUIL_TROUVE
    ? 'Adversaire trouvé !'
    : 'Recherche d’adversaire'
}

/**
 * LA TRAJECTOIRE DE LA LOUPE — un CERCLE, parcouru sans jamais pivoter.
 *
 * Trois formes essayées, et l'ordre compte pour comprendre :
 *
 *   1. une ROTATION sur l'axe. Fausse : une loupe qui pivote ne cherche rien,
 *      elle visse. Et comme le dessin est asymétrique, on voyait surtout le
 *      manche orbiter autour du verre ;
 *   2. un HUIT. Juste sur le fond — un balayage, pas un vissage — mais la
 *      figure est trop bavarde pour un objet de 84 px vu deux secondes : ses
 *      deux changements de sens se lisent comme des hésitations ;
 *   3. un CERCLE. L'objet tourne AUTOUR de sa place sans changer d'orientation.
 *      Un seul sens, une seule vitesse, rien à interpréter.
 *
 * Le cercle est CENTRÉ sur la position de repos : la loupe orbite autour de son
 * point, et quand l'adversaire est trouvé elle rejoint ce centre — le retour au
 * calme est le centre de l'orbite, pas un endroit arbitraire de la courbe.
 *
 * Elle ne tourne jamais sur elle-même : l'orientation du dessin (manche en bas
 * à gauche) reste fixe pendant tout le trajet. C'est la différence entre une
 * loupe qu'on promène et une roue.
 */

/** Rayon de l'orbite, en pixels. Petit : la loupe doit rester sur sa plaque. */
export const LOUPE_RAYON = 9

/**
 * Durée d'un tour complet, en secondes.
 *
 * CE QU'IL FAUT RÉGLER N'EST PAS LA DURÉE MAIS LA VITESSE. J'avais d'abord
 * borné cette valeur à une fois et demie la durée de la recherche, en me disant
 * qu'au-delà la courbe ne serait pas parcourue en entier. C'était le mauvais
 * repère : personne ne voit le TRACÉ, on voit un objet qui se déplace. Qu'il
 * boucle ou non pendant les deux secondes n'a aucune conséquence.
 *
 * Ce qui compte, c'est le CHEMIN PARCOURU pendant la recherche. Le cercle
 * mesure 2πr ≈ 57 px ; à 4 s la loupe en couvre 28 pendant les deux secondes
 * visibles, à une quinzaine de pixels par seconde — exactement l'allure qui
 * avait été réglée sur la forme précédente : seule la figure a changé.
 *
 * ET ÉLARGIR L'ORBITE N'AIDERAIT PAS À RALENTIR. La fenêtre visible est fixe
 * (deux secondes) : le chemin parcouru y vaut toujours vitesse × 2, quel que
 * soit le rayon. Le rayon change l'ÉTENDUE du balayage, jamais sa lenteur. Les
 * deux réglages sont indépendants, et il faut les penser séparément.
 */
export const LOUPE_BOUCLE_S = 4

/**
 * Le nombre d'intervalles échantillonnés sur le cercle.
 *
 * QUARANTE-HUIT, ET C'EST LE RÉGLAGE QUI REND LE MOUVEMENT FLUIDE. Avec une
 * poignée de points, le moteur d'animation traite chaque segment comme une
 * animation à part : il en amortit l'entrée et la sortie, et l'objet s'ARRÊTE à
 * chaque sommet — autant de micro-pauses par tour, parfaitement visibles.
 *
 * On ne corrige pas ça en changeant l'amortissement mais en RAPPROCHANT les
 * points : à cette densité, deux points voisins ne sont jamais distants de plus
 * de 2,5 px (le test le garde), et la polyligne épouse le cercle d'assez près
 * pour qu'une interpolation LINÉAIRE (côté composant) donne un tracé continu.
 * Sur un cercle, linéaire est même la seule interpolation juste : la vitesse y
 * est constante par nature, il n'y a aucune accélération à imiter.
 */
export const LOUPE_PAS = 48

/**
 * Les points du cercle, prêts à être passés en images-clés.
 *
 * `pas` compte les intervalles, pas les points : on rend `pas + 1` valeurs pour
 * refermer la boucle sur son point de départ. Sans ce dernier point, l'objet
 * saute de la fin au début à chaque tour.
 *
 * Le départ se fait en haut de l'orbite (`-cos`), ce qui n'a aucune importance
 * visuelle — un cercle n'a pas de début — mais rend la suite lisible en test.
 */
export function trajectoireLoupe(pas = LOUPE_PAS): { x: number[]; y: number[] } {
  const x: number[] = []
  const y: number[] = []
  for (let i = 0; i <= pas; i++) {
    const t = (i / pas) * 2 * Math.PI
    x.push(arrondi(LOUPE_RAYON * Math.sin(t)))
    y.push(arrondi(-LOUPE_RAYON * Math.cos(t)))
  }
  return { x, y }
}

/**
 * Deux décimales, et le ZÉRO NÉGATIF ramené à zéro.
 *
 * `Math.sin(2π)` ne rend pas 0 mais un négatif infime, qui s'arrondit en `-0`.
 * Sans conséquence à l'écran — CSS traite les deux pareil — mais le point de
 * fermeture de la boucle cesse alors d'être strictement égal à son point de
 * départ, ce qui rend la courbe impossible à comparer honnêtement en test.
 */
function arrondi(valeur: number): number {
  return Math.round(valeur * 100) / 100 + 0
}
