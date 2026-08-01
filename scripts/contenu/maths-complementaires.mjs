// Maths complémentaires — option de Terminale, pour les élèves ayant quitté la
// spécialité mathématiques en fin de 1re. Programme orienté vers les usages.
//
// ⚠️ NOTATION : le rendu des leçons (components/LessonRichContent) ne gère PAS
// le LaTeX — un `$x^2$` s'afficherait tel quel. Les formules sont donc écrites
// en notation lisible en texte brut (u(n+1), x², √n).

export default {
  slug: 'maths-complementaires',
  nom: 'Maths complémentaires',
  blocs: [
    {
      niveaux: ['Tle'],
      chapitres: [
        {
          titre: 'Suites et modèles d’évolution',
          lecon: {
            titre: 'Modéliser une évolution avec une suite',
            cours: `Une suite décrit une grandeur qui évolue par étapes : une population, un capital, une dose de médicament.

## Arithmétique ou géométrique ?
Une suite est **arithmétique** si l'on ajoute toujours la même quantité : u(n+1) = u(n) + r, donc u(n) = u(0) + n × r.
Elle est **géométrique** si l'on multiplie toujours par le même nombre : u(n+1) = q × u(n), donc u(n) = u(0) × q puissance n.

## Évolution en pourcentage
Une hausse de t % correspond à une multiplication par le **coefficient multiplicateur** 1 + t/100 ; une baisse, par 1 − t/100. Deux évolutions successives se composent en **multipliant** les coefficients, jamais en additionnant les pourcentages : deux hausses de 10 % donnent 1,1 × 1,1 = 1,21, soit +21 %.

## Comportement à long terme
Pour une suite géométrique de raison q strictement positive : si q > 1, elle croît sans limite ; si q est entre 0 et 1, elle tend vers 0 ; si q = 1, elle est constante.

## Suites arithmético-géométriques
Du type u(n+1) = a × u(n) + b. On cherche le **point fixe** L tel que L = a × L + b, puis on montre que v(n) = u(n) − L est géométrique de raison a. C'est le modèle classique d'un capital avec versements réguliers, ou d'une population avec migration constante.`,
          },
          questions: [
            ['Une suite géométrique de raison 0,8 tend vers…', ['0', '1', 'l’infini', '0,8'], 0, 'Une raison strictement comprise entre 0 et 1 fait tendre la suite vers 0.'],
            ['Une hausse de 20 % correspond à un coefficient multiplicateur de…', ['1,2', '0,8', '20', '0,2'], 0, '1 + 20/100 = 1,2.'],
            ['Deux hausses successives de 10 % équivalent à une hausse de 20 %.', ['Vrai', 'Faux'], 1, '1,1 × 1,1 = 1,21, soit +21 %.'],
            ['Quel est le terme général d’une suite arithmétique ?', ['u(n) = u(0) + n × r', 'u(n) = u(0) × q puissance n', 'u(n) = n × r', 'u(n) = u(0) − n × q'], 0, 'On ajoute n fois la raison au premier terme.'],
            ['Une baisse de 25 % se traduit par un coefficient multiplicateur de 0,75.', ['Vrai', 'Faux'], 0, '1 − 25/100 = 0,75.'],
            ['Pour une suite u(n+1) = a·u(n) + b, on introduit la suite…', ['v(n) = u(n) − L, où L est le point fixe', 'v(n) = u(n) + n', 'v(n) = u(n) × n', 'v(n) = la somme des u(k)'], 0, 'v est alors géométrique de raison a.'],
            ['Une suite géométrique de raison 1,05 croît sans limite.', ['Vrai', 'Faux'], 0, 'Toute raison strictement supérieure à 1 fait diverger la suite.'],
            ['Un capital qui augmente de 3 % par an se modélise par…', ['Une suite géométrique de raison 1,03', 'Une suite arithmétique de raison 3', 'Une suite constante', 'Une suite arithmétique de raison 0,03'], 0, 'La croissance est multiplicative, pas additive.'],
          ],
        },
        {
          titre: 'Fonctions, dérivées et optimisation',
          lecon: {
            titre: 'Chercher un maximum, un minimum',
            cours: `L'optimisation est l'usage le plus concret de la dérivation : quel prix maximise la recette ? quelles dimensions minimisent le coût ?

## Le nombre dérivé
f'(a) est le **coefficient directeur de la tangente** à la courbe au point d'abscisse a. Il mesure la vitesse de variation instantanée de la fonction.

## Les dérivées à connaître
La dérivée de x puissance n est n × x puissance (n−1). La dérivée de exp(x) est exp(x). La dérivée de ln(x) est 1/x.
Produit : (u × v)' = u'v + uv'. Quotient : (u/v)' = (u'v − uv') / v².

## Le signe de la dérivée
Si f' est positive sur un intervalle, f y est **croissante** ; si f' est négative, f y est **décroissante**. Un **extremum local** n'apparaît que là où la dérivée s'annule **en changeant de signe** : une dérivée nulle ne suffit pas, comme le montre la fonction cube en 0.

## La méthode d'optimisation
1. Exprimer la grandeur à optimiser en fonction d'**une seule** variable. 2. Préciser l'intervalle où le problème a un sens. 3. Dériver, étudier le signe. 4. Conclure par un tableau de variations — et vérifier que la solution trouvée est concrètement acceptable.`,
          },
          questions: [
            ['Que représente f’(a) géométriquement ?', ['Le coefficient directeur de la tangente en a', 'L’ordonnée du point', 'L’aire sous la courbe', 'La limite de f en a'], 0, 'C’est la pente de la tangente au point d’abscisse a.'],
            ['Si f’ est positive sur un intervalle, f y est croissante.', ['Vrai', 'Faux'], 0, 'Le signe de la dérivée donne le sens de variation.'],
            ['Quelle est la dérivée de ln(x) ?', ['1/x', 'ln(x)', 'x·ln(x)', 'exp(x)'], 0, 'Sur l’intervalle des réels strictement positifs.'],
            ['Une dérivée qui s’annule garantit un extremum.', ['Vrai', 'Faux'], 1, 'Il faut un changement de signe : la fonction cube a une dérivée nulle en 0 sans extremum.'],
            ['Quelle est la dérivée de exp(x) ?', ['exp(x)', 'x·exp(x−1)', '1/x', 'e'], 0, 'C’est la propriété caractéristique de l’exponentielle.'],
            ['La dérivée d’un produit u×v vaut…', ['u’v + uv’', 'u’v’', 'u’v − uv’', '(u’ + v’)/2'], 0, 'À ne pas confondre avec la formule du quotient.'],
            ['Pour optimiser, il faut d’abord tout exprimer avec une seule variable.', ['Vrai', 'Faux'], 0, 'C’est l’étape de mise en équation, souvent la plus délicate.'],
            ['Quelle est la dérivée de x⁴ ?', ['4x³', 'x³', '4x', '3x⁴'], 0, 'Règle : dérivée de x puissance n = n × x puissance (n−1).'],
          ],
        },
        {
          titre: 'Probabilités conditionnelles',
          lecon: {
            titre: 'Conditionner, c’est réévaluer',
            cours: `Une probabilité conditionnelle répond à la question : « sachant que B s'est produit, quelle chance a A ? »

## La définition
P_B(A) = P(A inter B) / P(B), avec P(B) non nulle. On en déduit la formule des probabilités composées : P(A inter B) = P(B) × P_B(A).

## L'arbre pondéré
La somme des branches issues d'un même nœud vaut 1. La probabilité d'un **chemin** est le **produit** des probabilités rencontrées. La probabilité d'un événement est la **somme** des chemins qui y mènent : c'est la **formule des probabilités totales**.

## L'indépendance
A et B sont indépendants lorsque P(A inter B) = P(A) × P(B), autrement dit lorsque P_B(A) = P(A) : savoir que B s'est produit ne change rien à A.

## Le piège du test médical
Un test fiable à 99 % appliqué à une maladie rare produit surtout des **faux positifs**. Si la maladie touche 1 personne sur 10 000, un résultat positif reste très probablement une erreur : les bien-portants sont tellement plus nombreux que leurs 1 % d'erreurs écrasent les vrais malades. On confond alors P(positif sachant malade), très élevée, avec P(malade sachant positif), très faible.`,
          },
          questions: [
            ['Quelle est la formule de la probabilité conditionnelle ?', ['P_B(A) = P(A inter B) / P(B)', 'P_B(A) = P(A) × P(B)', 'P_B(A) = P(A) + P(B)', 'P_B(A) = P(B) / P(A)'], 0, 'Avec P(B) non nulle.'],
            ['Dans un arbre pondéré, la probabilité d’un chemin est le produit de ses branches.', ['Vrai', 'Faux'], 0, 'Et la somme des branches issues d’un même nœud vaut 1.'],
            ['Deux événements sont indépendants lorsque…', ['P(A inter B) = P(A) × P(B)', 'P(A union B) = P(A) + P(B)', 'P(A) = P(B)', 'P(A inter B) = 0'], 0, 'Savoir que l’un s’est produit ne change pas la probabilité de l’autre.'],
            ['P(A sachant B) et P(B sachant A) sont toujours égales.', ['Vrai', 'Faux'], 1, 'Les confondre est l’erreur classique du test médical.'],
            ['La formule des probabilités totales consiste à…', ['Sommer les probabilités des chemins menant à l’événement', 'Multiplier toutes les branches', 'Diviser par le nombre de cas', 'Prendre le maximum'], 0, 'Elle s’appuie sur une partition de l’univers.'],
            ['Un test très fiable appliqué à une maladie rare produit beaucoup de faux positifs.', ['Vrai', 'Faux'], 0, 'Les bien-portants sont si nombreux que leurs erreurs dominent.'],
            ['Deux événements incompatibles de probabilités non nulles sont indépendants.', ['Vrai', 'Faux'], 1, 'Au contraire : si l’un se produit, l’autre devient impossible.'],
            ['P(A inter B) se calcule aussi par…', ['P(B) × P_B(A)', 'P(A) + P(B)', 'P(A) / P(B)', 'P(A) − P(B)'], 0, 'C’est la formule des probabilités composées.'],
          ],
        },
        {
          titre: 'Statistiques et échantillonnage',
          lecon: {
            titre: 'Ce qu’un sondage peut dire — et ne peut pas dire',
            cours: `Toute mesure faite sur un échantillon comporte une **incertitude** qu'il faut savoir chiffrer.

## Résumer une série
La **moyenne** est sensible aux valeurs extrêmes ; la **médiane** ne l'est pas. L'**écart-type** mesure la dispersion autour de la moyenne. Deux séries de même moyenne peuvent avoir des allures radicalement différentes : le graphique reste indispensable.

## La loi binomiale
On répète n fois, de façon indépendante, une expérience à deux issues de probabilité p. Le nombre de succès suit la loi binomiale de paramètres n et p, d'**espérance n × p** et de variance n × p × (1 − p).

## L'intervalle de confiance
Pour une fréquence f observée sur un échantillon de taille n, un intervalle de confiance au niveau 95 % est [f − 1/√n ; f + 1/√n]. Sa largeur décroît en 1/√n : **quadrupler** la taille de l'échantillon ne divise l'incertitude que par 2.

## Lire un sondage
Un sondage sur 1 000 personnes donne une marge d'environ ± 3 points (1/√1000 ≈ 0,032). Un écart d'un point entre deux candidats n'est donc pas un écart : c'est du bruit statistique.`,
          },
          questions: [
            ['Quel indicateur est le plus sensible aux valeurs extrêmes ?', ['La moyenne', 'La médiane', 'Le mode', 'Le premier quartile'], 0, 'Une seule valeur aberrante peut la déplacer fortement.'],
            ['Quelle est l’espérance d’une loi binomiale de paramètres n et p ?', ['n × p', 'n × p × (1 − p)', 'p / n', 'n / p'], 0, 'La variance, elle, vaut n × p × (1 − p).'],
            ['La largeur d’un intervalle de confiance décroît en 1/√n.', ['Vrai', 'Faux'], 0, 'Quadrupler l’échantillon ne divise l’incertitude que par 2.'],
            ['Pour un échantillon de 1 000 personnes, la marge d’erreur est d’environ…', ['3 points', '1 point', '10 points', '0,1 point'], 0, '1/√1000 ≈ 0,032, soit 3,2 points.'],
            ['Un écart d’un point dans un sondage sur 1 000 personnes est significatif.', ['Vrai', 'Faux'], 1, 'Il est très inférieur à la marge d’erreur.'],
            ['Que mesure l’écart-type ?', ['La dispersion autour de la moyenne', 'La valeur centrale', 'La valeur la plus fréquente', 'L’étendue totale'], 0, 'Plus il est grand, plus les valeurs sont dispersées.'],
            ['La loi binomiale suppose des répétitions indépendantes.', ['Vrai', 'Faux'], 0, 'C’est l’une de ses conditions d’application.'],
            ['Deux séries de même moyenne ont forcément la même allure.', ['Vrai', 'Faux'], 1, 'La dispersion et la forme peuvent être très différentes.'],
          ],
        },
      ],
    },
  ],
}
