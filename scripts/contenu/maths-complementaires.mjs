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
            cours: `Une suite décrit une grandeur qui évolue **par étapes** : une population, un capital, une dose de médicament. Reconnaître le bon modèle, c’est déjà avoir fait la moitié de l’exercice.

## Arithmétique ou géométrique ?
| | Arithmétique | Géométrique |
| Ce qu’on fait à chaque étape | On **ajoute** toujours la même quantité | On **multiplie** toujours par le même nombre |
| Relation de récurrence | u(n+1) = u(n) + r | u(n+1) = q × u(n) |
| Terme général | u(n) = u(0) + n × r | u(n) = u(0) × q puissance n |
| Le cas typique | Un versement fixe chaque mois | Une évolution en pourcentage |

## Évolution en pourcentage
Une hausse de t % correspond à une multiplication par le **coefficient multiplicateur** 1 + t/100 ; une baisse, par 1 − t/100.

> Deux évolutions successives se composent en **multipliant** les coefficients, jamais en additionnant les pourcentages. Deux hausses de 10 % donnent 1,1 × 1,1 = 1,21, soit **+21 %** et non +20 %.

| Évolution | Coefficient | Le piège |
| +10 % | 1,1 | |
| −10 % | 0,9 | |
| +10 % puis −10 % | 1,1 × 0,9 = 0,99 | On ne revient pas au point de départ |

## Comportement à long terme
Pour une suite géométrique de raison q strictement positive :

| Valeur de q | Comportement de la suite |
| q > 1 | Elle croît sans limite |
| q = 1 | Elle est constante |
| 0 < q < 1 | Elle tend vers 0 |

## Suites arithmético-géométriques
Du type u(n+1) = a × u(n) + b. La méthode est toujours la même :

1. Chercher le **point fixe** L tel que L = a × L + b.
2. Poser v(n) = u(n) − L, et montrer que v est **géométrique** de raison a.
3. En déduire v(n), puis u(n) = v(n) + L.

C’est le modèle d’un capital avec versements réguliers, ou d’une population avec migration constante.`,
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
            cours: `L’optimisation est l’usage le plus concret de la dérivation : quel prix maximise la recette ? quelles dimensions minimisent le coût ?

## Le nombre dérivé
f'(a) est le **coefficient directeur de la tangente** à la courbe au point d’abscisse a. Il mesure la **vitesse de variation instantanée** de la fonction en ce point.

## Les dérivées à connaître
| Fonction | Sa dérivée |
| x puissance n | n × x puissance (n−1) |
| exp(x) | exp(x) |
| ln(x) | 1/x |
| u × v | u'v + uv' |
| u/v | (u'v − uv') / v² |

## Le signe de la dérivée
| Si f' est… | Alors f est… |
| Positive sur un intervalle | **Croissante** sur cet intervalle |
| Négative sur un intervalle | **Décroissante** sur cet intervalle |
| Nulle **en changeant de signe** | À un **extremum local** |
| Nulle **sans changer de signe** | À un point d’inflexion, pas à un extremum |

> Une dérivée nulle ne suffit **jamais** à conclure à un extremum : la fonction cube a une dérivée nulle en 0 et y reste strictement croissante. C’est le changement de signe qui fait l’extremum, pas l’annulation.

## La méthode d’optimisation
1. Exprimer la grandeur à optimiser en fonction d’**une seule** variable.
2. Préciser l’**intervalle** sur lequel le problème a un sens (une longueur est positive).
3. Dériver, puis étudier le **signe** de la dérivée.
4. Conclure par un **tableau de variations**.
5. Vérifier que la solution trouvée est **concrètement** acceptable — un optimum mathématique hors de l’intervalle ne vaut rien.`,
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
            cours: `Une probabilité conditionnelle répond à une question précise : « sachant que B s’est produit, quelle chance a A ? » Conditionner, c’est **réévaluer** une probabilité à la lumière d’une information nouvelle.

## La définition
P_B(A) = P(A inter B) / P(B), avec P(B) non nulle.

On en déduit la **formule des probabilités composées** : P(A inter B) = P(B) × P_B(A).

## L’arbre pondéré
| Règle | Ce qu’elle dit |
| Somme des branches d’un nœud | Elle vaut toujours 1 |
| Probabilité d’un **chemin** | C’est le **produit** des probabilités rencontrées |
| Probabilité d’un **événement** | C’est la **somme** des chemins qui y mènent |

La dernière ligne est la **formule des probabilités totales** : l’arbre n’est pas un dessin d’appoint, c’est la démonstration elle-même.

## L’indépendance
A et B sont indépendants lorsque P(A inter B) = P(A) × P(B), autrement dit lorsque P_B(A) = P(A) : savoir que B s’est produit **ne change rien** à A.

## Le piège du test médical
Un test fiable à 99 % appliqué à une maladie rare produit surtout des **faux positifs**. Sur 10 000 personnes, avec une maladie touchant 1 personne sur 10 000 :

| Groupe | Effectif | Résultats positifs |
| Malades | 1 | 1 (le test est fiable) |
| Bien portants | 9 999 | environ 100 (les 1 % d’erreur) |

Un résultat positif a donc environ **1 chance sur 100** d’être un vrai malade.

> L’erreur consiste à confondre P(positif sachant malade), très élevée, avec P(malade sachant positif), très faible. Les deux se ressemblent en français et n’ont rien à voir en mathématiques.`,
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
            cours: `Toute mesure faite sur un échantillon comporte une **incertitude** — et le chapitre consiste à savoir la chiffrer, pour savoir ce qu’un chiffre ne dit pas.

## Résumer une série
| Indicateur | Ce qu’il mesure | Sa faiblesse |
| Moyenne | Le centre, au sens de l’équilibre | Très sensible aux valeurs extrêmes |
| Médiane | Le centre, au sens du rang | Ignore l’ampleur des écarts |
| Écart-type | La dispersion autour de la moyenne | Ne dit rien de la forme de la distribution |

> Deux séries de **même moyenne** peuvent avoir des allures radicalement différentes. Le graphique n’est pas une illustration du calcul : c’est une donnée que le calcul ne contient pas.

## La loi binomiale
On répète n fois, de façon **indépendante**, une expérience à deux issues de probabilité p. Le nombre de succès suit la loi binomiale de paramètres n et p.

| Grandeur | Formule |
| Espérance | n × p |
| Variance | n × p × (1 − p) |

## L’intervalle de confiance
Pour une fréquence f observée sur un échantillon de taille n, un intervalle de confiance au niveau 95 % est [f − 1/√n ; f + 1/√n].

| Taille de l’échantillon | Marge d’erreur environ |
| 100 | ± 10 points |
| 1 000 | ± 3 points |
| 4 000 | ± 1,6 point |
| 10 000 | ± 1 point |

La largeur décroît en 1/√n : **quadrupler** l’échantillon ne divise l’incertitude que par 2. C’est pourquoi les sondages ne dépassent presque jamais 1 000 personnes — au-delà, on paie beaucoup pour gagner très peu.

## Lire un sondage
Un sondage sur 1 000 personnes donne une marge d’environ ± 3 points. Un écart d’**un point** entre deux candidats n’est donc pas un écart : c’est du bruit statistique, et le commenter est une faute de raisonnement.`,
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
