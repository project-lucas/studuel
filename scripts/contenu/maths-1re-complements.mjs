// MATHS PREMIÈRE — COMPLÉMENTS : ce que les 11 fiches du programme
// (maths-1re.mjs, migration 271) laissaient de côté.
//
// LE CONSTAT. Les onze fiches couvrent les chapitres du programme de
// spécialité, mais rien sur l'ALGORITHMIQUE ET LA PROGRAMMATION (listes,
// boucles, fonctions en Python, algorithmes du programme : seuil, Newton,
// Euler), rien de dédié aux sommes de termes, au tableau des dérivées usuelles,
// aux applications de la dérivation, aux méthodes de la géométrie repérée
// (vecteur normal, projeté orthogonal), à la simulation et à l'échantillonnage.
// Et surtout rien sur L'ÉPREUVE ANTICIPÉE DE MATHÉMATIQUES que TOUS les élèves
// de Première passent désormais en juin (2 h, sans calculatrice, coefficient
// 2 : automatismes sur 6 points, exercices sur 14 points).
//
// SOURCES : note de service et annexe « Automatismes évaluables lors de
// l'épreuve anticipée de mathématiques » (BO n° 24 du 12 juin 2025) ;
// programme de spécialité mathématiques de Première (BO spécial n° 1 du
// 22 janvier 2019) ; pages académiques et Éduscol sur l'épreuve anticipée.
//
// PÉRIMÈTRE : la PREMIÈRE seule, AJOUT pur (aucun ménage). Positions à partir
// de 12, derrière les onze fiches du programme.
//
// ⚠️ PAS DE LATEX, PAS DE BLOC DE CODE : le rendu des cours
// (components/LessonRichContent) ne connaît ni l'un ni l'autre, et il rogne les
// retraits en tête de ligne. Le code Python s'écrit donc en TABLEAU, une ligne
// par instruction, le retrait figuré par « ···· » (quatre espaces). Jamais deux
// astérisques sur une même ligne de code (le rendu y verrait de l'italique).

export default {
  slug: 'maths',
  nom: 'Maths',

  titreMigration: 'MATHS 1re — COMPLÉMENTS : Python, algorithmes, méthodes et épreuve anticipée (14 fiches)',

  motif: `Les 11 fiches du programme de Première (migration 271) ne couvraient ni
l'algorithmique et la programmation en Python (listes, boucles, fonctions,
algorithmes de seuil, de Newton et d'Euler), ni les sommes de termes, ni le
tableau des dérivées usuelles, ni les applications de la dérivation, ni les
méthodes de la géométrie repérée, ni la simulation et l'échantillonnage — et
surtout rien sur l'ÉPREUVE ANTICIPÉE DE MATHÉMATIQUES que passent désormais
tous les élèves de Première (2 h, sans calculatrice, automatismes sur 6 points
et exercices sur 14 points ; liste des automatismes au BO n° 24 du 12 juin
2025). Cette migration AJOUTE 14 fiches (positions 12 à 25), sans rien retirer.`,

  blocs: [
    {
      niveaux: ['1re'],
      positionDepart: 12,
      chapitres: [
        // ---- Algèbre -------------------------------------------------------
        {
          titre: 'Calculer une somme de termes consécutifs',
          axe: 'Algèbre',
          lecon: {
            titre: 'Compter les termes, puis appliquer la bonne formule',
            cours: `Additionner cinquante termes un par un, c'est long et risqué. Pour les suites arithmétiques et géométriques, deux formules donnent la somme d'un seul coup — à condition de savoir **combien de termes** on additionne.

> Première question à se poser, toujours : combien y a-t-il de termes dans la somme ?

## Compter les termes
De u(p) à u(n) inclus, il y a **n − p + 1** termes.

| La somme | Le nombre de termes |
| u(0) + u(1) + … + u(9) | 10 |
| u(1) + … + u(20) | 20 |
| u(3) + … + u(20) | 18 |

> L'erreur classique est d'oublier le « + 1 » : de u(0) à u(9), il y a dix termes, pas neuf.

## La somme d'une suite arithmétique
La somme de termes consécutifs d'une suite arithmétique vaut :

S = nombre de termes × (premier terme + dernier terme) / 2

Le cas le plus célèbre : 1 + 2 + … + 100 = 100 × 101 / 2 = **5 050**. Plus généralement, 1 + 2 + … + n = n (n + 1) / 2.

**Exemple travaillé.** Calculer S = 3 + 7 + 11 + … + 43.
1. On reconnaît une suite arithmétique de premier terme 3 et de raison 4.
2. On compte les termes : (43 − 3) / 4 + 1 = 11 termes.
3. On applique la formule : S = 11 × (3 + 43) / 2 = 11 × 23 = **253**.

## La somme d'une suite géométrique
Pour une raison q différente de 1 :

S = premier terme × (1 − q puissance N) / (1 − q), où N est le nombre de termes.

| La somme | Le calcul | Le résultat |
| 1 + 2 + 4 + … + 1 024 | 11 termes (1 024 = 2 puissance 10) : (1 − 2 puissance 11) / (1 − 2) | **2 047** |
| 2 + 6 + 18 + … + 486 | 6 termes, raison 3 : 2 × (1 − 729) / (1 − 3) | **728** |

> Si q = 1, la formule divise par zéro : tous les termes sont égaux, et la somme vaut simplement N × premier terme.

## Une somme qui ne dépasse jamais 2
1 + 1/2 + 1/4 + … + (1/2) puissance n = 2 − (1/2) puissance n. On a beau ajouter des termes, la somme s'approche de 2 **sans jamais l'atteindre** : chaque terme ajouté comble la moitié de ce qui manque.

## En situation
Une coureuse parcourt 2 km le premier jour, puis 0,5 km de plus chaque jour. Sur 10 jours : le dernier jour, elle court 2 + 9 × 0,5 = 6,5 km, et au total 10 × (2 + 6,5) / 2 = **42,5 km**.

## Et en Python
Quand aucune formule ne s'applique, on accumule dans une boucle : on part de s = 0 et, à chaque tour, on fait s = s + u, puis on calcule le terme suivant.`,
          },
          questions: [
            ['Combien vaut 1 + 2 + 3 + … + 100 ?', ['5 050', '5 000', '10 100', '4 950'], 0, 'Formule n (n + 1) / 2 avec n = 100 : 100 × 101 / 2 = 5 050.'],
            ['Combien de termes compte la somme u(3) + u(4) + … + u(20) ?', ['17', '20', '23', '18'], 3, 'De u(p) à u(n), il y a n − p + 1 termes : 20 − 3 + 1 = 18.'],
            ['Quelle formule donne la somme de termes consécutifs d’une suite arithmétique ?', ['Premier terme × nombre de termes', '(Premier + dernier) × raison', 'Nombre de termes × (premier + dernier) / 2', 'Dernier terme × (1 − raison)'], 2, 'C’est la moyenne du premier et du dernier terme, multipliée par le nombre de termes.'],
            ['Combien vaut 3 + 7 + 11 + … + 43 ?', ['230', '253', '276', '506'], 1, 'Raison 4, (43 − 3) / 4 + 1 = 11 termes, donc 11 × 46 / 2 = 253.'],
            ['Combien vaut 1 + 2 + 4 + … + 1 024 ?', ['2 048', '1 023', '2 046', '2 047'], 3, 'Onze termes de raison 2 : (1 − 2 puissance 11) / (1 − 2) = 2 048 − 1 = 2 047.'],
            ['Pour une suite géométrique de raison q différente de 1, la somme de N termes consécutifs vaut…', ['premier × (1 − q puissance N) / (1 − q)', 'premier × (1 − q) / (1 − q puissance N)', 'premier × N × q', '(1 − q puissance N) / premier'], 0, 'N désigne le NOMBRE de termes, pas le rang du dernier.'],
            ['Combien vaut 2 + 6 + 18 + 54 + 162 + 486 ?', ['729', '486', '728', '1 458'], 2, 'Six termes de raison 3 : 2 × (1 − 729) / (1 − 3) = 728 ; on peut le vérifier en additionnant.'],
            ['La formule de la somme géométrique s’applique aussi quand la raison vaut 1.', ['Vrai', 'Faux'], 1, 'Elle diviserait par zéro. Si q = 1, tous les termes sont égaux et la somme vaut N × premier terme.'],
            ['Une coureuse fait 2 km le premier jour puis 0,5 km de plus chaque jour. Combien de kilomètres en 10 jours ?', ['65 km', '47 km', '25 km', '42,5 km'], 3, 'Dernier jour : 2 + 9 × 0,5 = 6,5 km ; total : 10 × (2 + 6,5) / 2 = 42,5 km.'],
            ['La somme 1 + 1/2 + 1/4 + … reste toujours strictement inférieure à 2.', ['Vrai', 'Faux'], 0, 'Elle vaut 2 − (1/2) puissance n : elle s’approche de 2 sans jamais l’atteindre.'],
            ['(u) est arithmétique de premier terme u(0) = 5 et de raison 2. Combien vaut u(0) + u(1) + … + u(9) ?', ['115', '230', '140', '120'], 2, 'Dix termes, u(9) = 5 + 9 × 2 = 23, donc 10 × (5 + 23) / 2 = 140.'],
            ['Dans une boucle Python qui additionne des termes, quelle instruction accumule la somme ?', ['s = u', 'u = s + 1', 's == s + u', 's = s + u'], 3, 'On repart de l’ancienne valeur de s et on lui ajoute le terme courant ; == est un test, pas une affectation.'],
          ],
        },

        // ---- Analyse -------------------------------------------------------
        {
          titre: 'Fonctions de référence et tableau des dérivées',
          axe: 'Analyse',
          lecon: {
            titre: 'Les dérivées à savoir sans réfléchir',
            cours: `Dériver une fonction, c'est presque toujours la découper en morceaux dont on connaît déjà la dérivée. D'où ce tableau, à connaître aussi bien que les tables de multiplication.

> Un calcul de dérivée juste commence par le bon domaine : certaines fonctions ne sont pas dérivables partout où elles sont définies.

## Les fonctions de référence et leurs dérivées
| La fonction f(x) | Sa dérivée f'(x) | Dérivable sur |
| k (constante) | 0 | Tous les réels |
| x | 1 | Tous les réels |
| x² | 2x | Tous les réels |
| x³ | 3x² | Tous les réels |
| x puissance n (n entier ≥ 1) | n × x puissance (n − 1) | Tous les réels |
| 1 / x | −1 / x² | ]−∞ ; 0[ et ]0 ; +∞[ |
| √x | 1 / (2√x) | ]0 ; +∞[ — **pas en 0** |
| e puissance x | e puissance x | Tous les réels |
| cos x | −sin x | Tous les réels |
| sin x | cos x | Tous les réels |

> La racine carrée est définie en 0 mais n'y est **pas dérivable** : sa courbe y a une tangente verticale.

## Leurs variations
| La fonction | Ses variations |
| Carré | Décroissante sur ]−∞ ; 0], croissante sur [0 ; +∞[ |
| Cube | Croissante sur tous les réels |
| Inverse | Décroissante sur ]−∞ ; 0[ **et** sur ]0 ; +∞[, séparément |
| Racine carrée | Croissante sur [0 ; +∞[ |
| Exponentielle | Croissante sur tous les réels |

> Piège : la fonction inverse n'est **pas** décroissante sur l'ensemble des réels non nuls pris d'un bloc, puisque f(−1) = −1 < f(1) = 1.

## La composée affine : g(ax + b)
Si f(x) = g(ax + b), alors **f'(x) = a × g'(ax + b)**. On dérive comme si de rien n'était, puis on multiplie par a.

| La fonction | Sa dérivée |
| (5x − 2)² | 2 × 5 × (5x − 2) = 10 (5x − 2) |
| (2x + 1)³ | 3 × 2 × (2x + 1)² = 6 (2x + 1)² |
| √(3x + 1) | 3 / (2√(3x + 1)) |
| e puissance (−2x) | −2 e puissance (−2x) |
| sin(2x) | 2 cos(2x) |
| 1 / (3x + 1) | −3 / (3x + 1)² |

## Exemples travaillés
1. f(x) = 4x³ − x + 7 : on dérive terme à terme, f'(x) = 12x² − 1.
2. f(x) = x e puissance x : c'est un produit u v avec u = x et v = e puissance x, donc f'(x) = 1 × e puissance x + x e puissance x = (x + 1) e puissance x.
3. f(x) = 1 / (x² + 1) : de la forme 1 / v avec v' = 2x, donc f'(x) = −2x / (x² + 1)².

> Réflexe : avant de dériver, repérer la **forme** — somme, produit, quotient, composée affine. La forme dicte la formule.`,
          },
          questions: [
            ['Quelle est la dérivée de x³ ?', ['3x²', 'x²', '3x', '3x³'], 0, 'Formule n × x puissance (n − 1) avec n = 3.'],
            ['Quelle est la dérivée de √x, pour x > 0 ?', ['2√x', '√x / 2', '−1 / (2√x)', '1 / (2√x)'], 3, 'À retenir avec son domaine : ]0 ; +∞[, la racine n’est pas dérivable en 0.'],
            ['La fonction racine carrée est dérivable en 0.', ['Vrai', 'Faux'], 1, 'Elle est définie en 0 mais sa courbe y admet une tangente verticale : pas de nombre dérivé.'],
            ['Quelle est la dérivée de (5x − 2)² ?', ['2 (5x − 2)', '10 (5x − 2)', '5 (5x − 2)²', '10x − 2'], 1, 'Composée affine : 2 × (5x − 2), multiplié par a = 5.'],
            ['Quelle est la dérivée de e puissance (−2x) ?', ['e puissance (−2x)', '−2x e puissance (−2x)', '2 e puissance (−2x)', '−2 e puissance (−2x)'], 3, 'On multiplie par le coefficient a = −2 : le signe moins ne disparaît pas.'],
            ['Quelle est la dérivée de x e puissance x ?', ['(x + 1) e puissance x', 'e puissance x', 'x e puissance x', '(x − 1) e puissance x'], 0, 'Produit u v : 1 × e puissance x + x × e puissance x, que l’on factorise.'],
            ['Quelle est la dérivée de 4x³ − x + 7 ?', ['12x² + 7', '4x² − 1', '12x² − 1', '12x³ − 1'], 2, 'On dérive terme à terme ; la constante 7 a pour dérivée 0.'],
            ['Quelle est la dérivée de sin(2x) ?', ['2 cos(2x)', 'cos(2x)', '−2 cos(2x)', '2 sin(2x)'], 0, 'La dérivée de sin est cos, multipliée par a = 2.'],
            ['Quelle est la dérivée de 1 / (3x + 1) ?', ['1 / 3', '−1 / (3x + 1)²', '3 / (3x + 1)²', '−3 / (3x + 1)²'], 3, 'Forme 1 / v avec v’ = 3 : −v’ / v².'],
            ['La fonction inverse est décroissante sur l’ensemble des réels non nuls, pris d’un seul bloc.', ['Vrai', 'Faux'], 1, 'Elle l’est sur chacun des deux intervalles séparément : f(−1) = −1 est pourtant plus petit que f(1) = 1.'],
            ['Quelle est la dérivée de 1 / (x² + 1) ?', ['1 / (2x)', '2x / (x² + 1)²', '−2x / (x² + 1)²', '−1 / (x² + 1)²'], 2, 'Forme 1 / v avec v’ = 2x : −v’ / v².'],
            ['Sur quel intervalle la fonction carré est-elle croissante ?', ['Tous les réels', ']−∞ ; 0]', 'Aucun', '[0 ; +∞['], 3, 'Sa dérivée 2x est positive pour x ≥ 0 : la parabole remonte à droite de l’origine.'],
          ],
        },
        {
          titre: 'Tangente et optimisation : la dérivée au travail',
          axe: 'Analyse',
          lecon: {
            titre: 'Écrire une tangente, trouver le meilleur',
            cours: `La dérivée ne sert pas qu'à dresser des tableaux : elle donne l'équation d'une tangente et, surtout, elle trouve **le maximum ou le minimum** d'une grandeur — l'aire la plus grande, le coût le plus bas, le bénéfice le plus haut.

## Écrire l'équation d'une tangente
La tangente à la courbe de f au point d'abscisse a a pour équation y = f'(a)(x − a) + f(a).

**Exemple travaillé.** f(x) = x² − 3x + 1, en a = 2.
1. f(2) = 4 − 6 + 1 = −1.
2. f'(x) = 2x − 3, donc f'(2) = 1.
3. y = 1 × (x − 2) + (−1), soit **y = x − 3**.

| Deux tangentes à connaître | Leur équation |
| À la courbe de x² au point d'abscisse 1 | y = 2x − 1 |
| À la courbe de e puissance x au point d'abscisse 0 | y = x + 1 |

## Les questions inverses
| La question | Ce qu'on résout |
| Où la tangente est-elle **horizontale** ? | f'(a) = 0 |
| Où la tangente est-elle **parallèle** à la droite y = 5x + 2 ? | f'(a) = 5 (même coefficient directeur) |
| En quel point de la courbe de x² la tangente a-t-elle pour coefficient directeur 6 ? | 2a = 6, donc a = 3 |

## Optimiser en quatre temps
1. **Choisir la variable** et son intervalle (une longueur est positive, une quantité est bornée).
2. **Exprimer** la grandeur à optimiser en fonction de cette seule variable.
3. **Étudier** ses variations : dérivée, signe, tableau.
4. **Conclure** en répondant à la question posée, avec l'unité.

> L'étape 2 est celle où tout se joue : une fois la fonction écrite, le reste est une étude de variations comme les autres.

**Exemple travaillé : l'enclos.** Avec 40 m de grillage, on clôt un rectangle adossé à un mur (le mur ferme un côté). On note x la largeur, en mètres.
1. La longueur vaut 40 − 2x, avec x dans ]0 ; 20[.
2. L'aire vaut A(x) = x (40 − 2x) = 40x − 2x².
3. A'(x) = 40 − 4x : positive avant 10, nulle en 10, négative après. A est croissante puis décroissante.
4. L'aire est maximale pour x = 10 m : l'enclos mesure 10 m sur 20 m, soit **200 m²**.

**Exemple : le bénéfice.** B(q) = −2q² + 120q − 1 000 euros pour q objets. B'(q) = −4q + 120 s'annule en q = 30 en passant du positif au négatif : le bénéfice est maximal pour 30 objets et vaut B(30) = −1 800 + 3 600 − 1 000 = **800 euros**.

## Ne pas oublier les bornes
Sur un intervalle fermé, le maximum peut se trouver **à une borne** et non là où la dérivée s'annule. On compare donc toujours les valeurs aux extremums locaux **et** aux bornes.

> Un extremum se lit là où f' s'annule **en changeant de signe** ; une dérivée nulle seule ne suffit pas.`,
          },
          questions: [
            ['Quelle est l’équation de la tangente à la courbe de f(x) = x² − 3x + 1 au point d’abscisse 2 ?', ['y = x − 3', 'y = x − 1', 'y = −x + 1', 'y = 2x − 5'], 0, 'f(2) = −1 et f’(2) = 1, donc y = 1 × (x − 2) − 1 = x − 3.'],
            ['Que signifie f’(a) = 0 pour la courbe de f ?', ['La courbe coupe l’axe des abscisses en a', 'f(a) = 0', 'La tangente est verticale', 'La tangente au point d’abscisse a est horizontale'], 3, 'f’(a) est le coefficient directeur de la tangente : il est nul pour une droite horizontale.'],
            ['Quelle est la tangente à la courbe de l’exponentielle au point d’abscisse 0 ?', ['y = x', 'y = e x', 'y = x + 1', 'y = 1'], 2, 'f(0) = 1 et f’(0) = 1, donc y = x + 1.'],
            ['Quelle est la tangente à la courbe de x² au point d’abscisse 1 ?', ['y = x + 1', 'y = 2x − 1', 'y = 2x + 1', 'y = x²'], 1, 'f(1) = 1 et f’(1) = 2 : y = 2(x − 1) + 1 = 2x − 1.'],
            ['En quel point de la courbe de x² la tangente a-t-elle pour coefficient directeur 6 ?', ['x = 6', 'x = 36', 'x = 12', 'x = 3'], 3, 'On résout f’(a) = 6, soit 2a = 6.'],
            ['Pour trouver où la tangente est parallèle à y = 5x + 2, on résout…', ['f’(a) = 5', 'f(a) = 5', 'f’(a) = 2', 'f(a) = 5a + 2'], 0, 'Deux droites parallèles ont le même coefficient directeur.'],
            ['Avec 40 m de grillage et un mur pour un côté, quelle aire maximale peut-on clore en rectangle ?', ['100 m²', '400 m²', '200 m²', '160 m²'], 2, 'A(x) = x (40 − 2x) est maximale en x = 10 : 10 × 20 = 200 m².'],
            ['Dans cet enclos, quelle largeur x rend l’aire maximale ?', ['x = 10 m', 'x = 20 m', 'x = 13 m', 'x = 5 m'], 0, 'A’(x) = 40 − 4x s’annule en 10 en changeant de signe.'],
            ['B(q) = −2q² + 120q − 1 000. Pour combien d’objets le bénéfice est-il maximal ?', ['60', '120', '10', '30'], 3, 'B’(q) = −4q + 120 s’annule en q = 30 ; B(30) = 800 euros.'],
            ['Sur un intervalle fermé, le maximum d’une fonction peut être atteint à une borne.', ['Vrai', 'Faux'], 0, 'D’où la règle : comparer les valeurs aux extremums locaux ET aux bornes.'],
            ['Quelle est la première étape d’un problème d’optimisation ?', ['Dériver', 'Dresser le tableau de variations', 'Choisir la variable et son intervalle', 'Calculer le maximum'], 2, 'On ne peut rien dériver tant que la grandeur n’est pas exprimée en fonction d’une seule variable.'],
            ['Quel est le coefficient directeur de la tangente à la courbe de 1 / x au point d’abscisse 1 ?', ['1', '0', '−2', '−1'], 3, 'f’(x) = −1 / x², donc f’(1) = −1.'],
          ],
        },

        // ---- Géométrie -----------------------------------------------------
        {
          titre: 'Vecteur normal, projeté orthogonal et intersections',
          axe: 'Géométrie',
          lecon: {
            titre: 'Les méthodes types de la géométrie repérée',
            cours: `Le produit scalaire donne à la géométrie repérée ses outils les plus efficaces. Quatre méthodes reviennent sans cesse : la droite définie par un vecteur normal, la tangente à un cercle, le projeté orthogonal et l'intersection d'une droite et d'un cercle. On travaille dans un repère orthonormé.

## La droite de vecteur normal donné
Un vecteur **normal** à une droite est orthogonal à sa direction. La droite de vecteur normal n(a ; b) passant par A(xA ; yA) est l'ensemble des points M tels que AM · n = 0 :

a (x − xA) + b (y − yA) = 0

**Exemple.** n(2 ; −1) et A(1 ; 3) : 2 (x − 1) − (y − 3) = 0, soit **2x − y + 1 = 0**. Contrôle : 2 − 3 + 1 = 0, le point A est bien sur la droite.

> Lecture directe : la droite ax + by + c = 0 a pour vecteur normal n(a ; b). Pour 3x − 5y + 2 = 0, c'est n(3 ; −5).

## La tangente à un cercle
La tangente en un point A d'un cercle de centre Ω est **perpendiculaire au rayon** [ΩA] : le vecteur ΩA est normal à la tangente.

**Exemple.** Cercle de centre Ω(1 ; 2) passant par A(4 ; 6). ΩA(3 ; 4), donc la tangente en A a pour équation 3 (x − 4) + 4 (y − 6) = 0, soit **3x + 4y − 36 = 0**.

## La médiatrice d'un segment
La médiatrice de [AB] passe par le milieu de [AB] et admet AB pour vecteur normal.

**Exemple.** A(1 ; 1) et B(5 ; 3) : milieu I(3 ; 2), AB(4 ; 2). D'où 4 (x − 3) + 2 (y − 2) = 0, soit **2x + y − 8 = 0**.

## Le projeté orthogonal d'un point sur une droite
Le projeté orthogonal H de M sur la droite d est le point de d le plus proche de M. On le trouve en écrivant deux conditions :
1. H appartient à d ;
2. MH est orthogonal à un vecteur directeur u de d (MH · u = 0).

**Exemple.** d : y = x, de vecteur directeur u(1 ; 1), et M(4 ; 0). H(t ; t) et MH(t − 4 ; t) ; MH · u = 2t − 4 = 0, donc t = 2 et **H(2 ; 2)**. La distance de M à d vaut MH = √(4 + 4) = **2√2**.

## L'intersection d'une droite et d'un cercle
On remplace y (ou x) dans l'équation du cercle : on obtient une équation du **second degré**.

| Le discriminant | La position |
| Δ > 0 | Deux points d'intersection : la droite est **sécante** |
| Δ = 0 | Un seul point : la droite est **tangente** |
| Δ < 0 | Aucun point : la droite est **extérieure** |

**Exemple.** Cercle x² + y² = 25 et droite y = x + 1 : x² + (x + 1)² = 25 donne x² + x − 12 = 0, de racines 3 et −4. Les points sont **(3 ; 4)** et **(−4 ; −3)**.

> Toujours vérifier : un point trouvé doit satisfaire les DEUX équations.`,
          },
          questions: [
            ['Quelle est l’équation de la droite de vecteur normal n(2 ; −1) passant par A(1 ; 3) ?', ['2x − y + 1 = 0', 'x + 2y − 7 = 0', '2x + y − 5 = 0', '−x + 2y − 5 = 0'], 0, '2 (x − 1) − (y − 3) = 0 ; contrôle : 2 − 3 + 1 = 0.'],
            ['Quel est un vecteur normal à la droite 3x − 5y + 2 = 0 ?', ['n(5 ; 3)', 'n(−5 ; 3)', 'n(3 ; 5)', 'n(3 ; −5)'], 3, 'Les coefficients de x et de y donnent directement un vecteur normal.'],
            ['La tangente à un cercle en un point A est perpendiculaire au rayon [ΩA].', ['Vrai', 'Faux'], 0, 'C’est pourquoi le vecteur ΩA sert de vecteur normal à la tangente.'],
            ['Cercle de centre Ω(1 ; 2) passant par A(4 ; 6). Quelle est la tangente en A ?', ['4x − 3y + 2 = 0', '3x + 4y − 36 = 0', '3x + 4y − 11 = 0', 'x + y − 10 = 0'], 1, 'ΩA(3 ; 4) est normal : 3 (x − 4) + 4 (y − 6) = 0.'],
            ['Quel est le projeté orthogonal de M(4 ; 0) sur la droite y = x ?', ['(4 ; 4)', '(0 ; 0)', '(1 ; 1)', '(2 ; 2)'], 3, 'H(t ; t) avec MH · u = 2t − 4 = 0, donc t = 2.'],
            ['Quelle est la distance du point M(4 ; 0) à la droite y = x ?', ['2√2', '4', '2', '√2'], 0, 'C’est la distance MH au projeté H(2 ; 2) : √(4 + 4) = 2√2.'],
            ['Pour trouver le projeté orthogonal H de M sur d, quelles conditions écrit-on ?', ['H sur d et MH = 1', 'MH colinéaire à un vecteur directeur de d', 'H sur d et MH orthogonal à un vecteur directeur de d', 'H milieu de M et d’un point de d'], 2, 'Deux conditions, deux inconnues : le système donne H.'],
            ['Quels sont les points d’intersection du cercle x² + y² = 25 et de la droite y = x + 1 ?', ['(3 ; 4) et (−4 ; −3)', '(4 ; 3) et (−3 ; −4)', '(0 ; 1) et (5 ; 6)', 'Il n’y en a pas'], 0, 'On obtient x² + x − 12 = 0, de racines 3 et −4, puis y = x + 1.'],
            ['Après substitution, l’équation du second degré a un discriminant nul. La droite est…', ['sécante au cercle', 'extérieure au cercle', 'un diamètre', 'tangente au cercle'], 3, 'Une seule solution : un seul point commun, la droite touche le cercle.'],
            ['Quelle est la médiatrice de [AB] avec A(1 ; 1) et B(5 ; 3) ?', ['x − 2y + 1 = 0', '2x + y − 8 = 0', 'x + 2y − 7 = 0', '2x − y − 4 = 0'], 1, 'Elle passe par I(3 ; 2) avec AB(4 ; 2) normal : 4 (x − 3) + 2 (y − 2) = 0.'],
            ['Une droite ax + by + c = 0 admet u(−b ; a) comme vecteur directeur et n(a ; b) comme vecteur normal.', ['Vrai', 'Faux'], 0, 'Leur produit scalaire −ab + ba est nul : ils sont bien orthogonaux.'],
            ['Un point trouvé par le calcul appartient à l’intersection si…', ['il vérifie l’équation du cercle', 'il vérifie l’équation de la droite', 'son abscisse est positive', 'il vérifie les deux équations'], 3, 'La vérification dans les deux équations attrape les erreurs de substitution.'],
          ],
        },

        // ---- Probabilités et statistiques -----------------------------------
        {
          titre: 'Simulation et échantillonnage : la moyenne se stabilise',
          axe: 'Probabilité et statistiques',
          lecon: {
            titre: 'Simuler en Python, observer la fluctuation',
            cours: `Répéter mille fois une expérience à la main est impossible ; en Python, cela prend une fraction de seconde. La simulation permet d'**observer** ce que les probabilités annoncent : la moyenne des résultats se rapproche de l'espérance.

## Les deux fonctions du hasard
On les importe par la ligne « from random import random, randint ».

| L'instruction | Ce qu'elle renvoie |
| random() | Un réel au hasard dans [0 ; 1[ |
| randint(1, 6) | Un entier au hasard entre 1 et 6, **bornes comprises** |

> Pour simuler un succès de probabilité p, on teste random() < p : ce test est vrai avec la probabilité p.

## Simuler une variable aléatoire
Une fonction qui renvoie 1 en cas de succès et 0 sinon :

\`\`\`python
def essai(p):
    if random() < p:
        return 1
    return 0
\`\`\`

La **fréquence** des succès sur n essais vaut (nombre de succès) / n.

## Un échantillon, puis beaucoup d'échantillons
Un **échantillon de taille n**, ce sont n répétitions indépendantes de la même expérience. On calcule sa moyenne m. Deux échantillons différents donnent des moyennes différentes : c'est la **fluctuation d'échantillonnage**.

**Exemple : le dé.** Pour un dé équilibré, l'espérance vaut μ = 3,5 et l'écart type σ ≈ 1,71. Lancer 10 dés donne une moyenne qui peut valoir 2,8 ou 4,1 ; avec 1 000 dés, elle reste très près de 3,5.

## Ce que l'on observe
| Ce qu'on fait varier | Ce qu'on constate |
| On augmente la taille n de l'échantillon | Les moyennes se **resserrent** autour de l'espérance μ |
| On mesure la dispersion des moyennes | Leur écart type est proche de **σ / √n** |
| On compte les échantillons où l'écart entre m et μ est au plus 2σ / √n | On en trouve la **grande majorité**, le plus souvent autour de 95 % |

> Multiplier la taille de l'échantillon par 16 divise la dispersion des moyennes par √16 = 4. Pour gagner en précision, il faut beaucoup plus de données.

## La loi des grands nombres
Plus n est grand, plus la moyenne d'un échantillon a de chances d'être proche de l'espérance. C'est ce qui justifie qu'on estime une probabilité inconnue par une **fréquence** observée sur un grand nombre d'essais.

## Les limites d'une simulation
Une simulation **estime** une probabilité ; elle ne la **démontre** pas. Deux simulations ne donnent pas exactement le même résultat, et seul le calcul donne la valeur exacte.

> La simulation propose, le calcul dispose : on s'en sert pour conjecturer ou pour vérifier la vraisemblance d'un résultat.`,
          },
          questions: [
            ['Quelles valeurs peut renvoyer randint(1, 6) ?', ['Les entiers de 1 à 6', 'Les entiers de 1 à 5', 'Les réels entre 1 et 6', 'Les entiers de 0 à 6'], 0, 'Contrairement à range, randint inclut ses deux bornes.'],
            ['Avec quelle probabilité le test random() < 0,3 est-il vrai ?', ['0,7', '0,5', 'On ne peut pas savoir', '0,3'], 3, 'random() est uniforme sur [0 ; 1[ : il tombe sous 0,3 dans 30 % des cas.'],
            ['Que se passe-t-il quand on augmente la taille des échantillons ?', ['Les moyennes s’écartent de l’espérance', 'L’espérance augmente', 'Les moyennes se resserrent autour de l’espérance', 'Rien ne change'], 2, 'C’est la loi des grands nombres, visible en simulation.'],
            ['L’écart type des moyennes d’échantillons de taille n est proche de…', ['σ × n', 'σ / √n', 'σ / n', 'σ'], 1, 'La dispersion diminue comme la racine carrée de la taille.'],
            ['On multiplie par 16 la taille des échantillons. La dispersion des moyennes est…', ['divisée par 16', 'multipliée par 4', 'inchangée', 'divisée par 4'], 3, 'Elle est proportionnelle à 1 / √n, et √16 = 4.'],
            ['Deux échantillons de même taille donnent toujours la même moyenne.', ['Vrai', 'Faux'], 1, 'C’est la fluctuation d’échantillonnage : chaque échantillon a sa moyenne.'],
            ['Quelle est l’espérance du résultat d’un dé équilibré à six faces ?', ['3', '4', '3,5', '6'], 2, '(1 + 2 + 3 + 4 + 5 + 6) / 6 = 21 / 6 = 3,5.'],
            ['Quelle part des échantillons a une moyenne à au plus 2σ / √n de l’espérance, en général ?', ['La grande majorité, souvent autour de 95 %', 'Environ 50 %', 'Environ 5 %', 'Aucun'], 0, 'C’est ce que l’on observe en simulant un grand nombre d’échantillons.'],
            ['Comment calcule-t-on la fréquence des succès sur n essais ?', ['n / nombre de succès', 'nombre de succès × n', 'nombre de succès − n', 'nombre de succès / n'], 3, 'Une fréquence est toujours comprise entre 0 et 1.'],
            ['Une simulation démontre la valeur exacte d’une probabilité.', ['Vrai', 'Faux'], 1, 'Elle l’estime ou permet de la conjecturer ; seul le calcul démontre.'],
            ['Que dit la loi des grands nombres ?', ['Chaque tirage compense le précédent', 'La probabilité d’un succès augmente avec le nombre d’essais', 'Plus l’échantillon est grand, plus sa moyenne a de chances d’être proche de l’espérance', 'Tous les résultats finissent par être égaux'], 2, 'Le hasard n’a pas de mémoire : c’est la moyenne, pas chaque tirage, qui se stabilise.'],
            ['Dans la fonction essai(p), que renvoie return 1 ?', ['Le nombre d’essais', 'Un échec', 'La probabilité p', 'Un succès'], 3, 'On code le succès par 1 et l’échec par 0 : la moyenne des résultats est alors la fréquence des succès.'],
          ],
        },

        // ---- Algorithmique et programmation ---------------------------------
        {
          titre: 'Python : variables, tests, boucles et fonctions',
          axe: 'Algorithmique et programmation',
          lecon: {
            titre: 'Les quatre briques de tout programme',
            cours: `Tous les programmes du lycée sont bâtis avec quatre briques : des **variables**, des **tests**, des **boucles** et des **fonctions**. Les maîtriser, c'est pouvoir lire et écrire n'importe quel algorithme du programme.

> Dans ce cours, les « ···· » figurent le retrait de quatre espaces. En Python, ce retrait n'est pas décoratif : c'est lui qui dit ce qui appartient à une boucle ou à un test.

## Les variables et l'affectation
x = 3 **range** la valeur 3 dans la variable x. Ce n'est pas une égalité mathématique : x = x + 2 veut dire « calcule x + 2, puis range le résultat dans x ». Après x = 3 puis x = x + 2, x vaut 5.

| Le type | Un exemple |
| Entier (int) | 7 |
| Flottant (float) | 2.5 — avec un **point**, pas une virgule |
| Booléen (bool) | True ou False |
| Chaîne (str) | "bonjour" |

## Les tests
| Le symbole | Son sens |
| = | Affectation : on range une valeur |
| == | Test d'égalité : vrai ou faux |
| != | Test de différence |
| % | Reste de la division : 7 % 2 vaut 1 |

Un test s'écrit avec if, elif (sinon si) et else, suivis de deux-points, et le bloc concerné est en retrait.

## Deux boucles pour deux situations
| La boucle | Quand l'employer | Exemple |
| for i in range(n) | On connaît le **nombre** de répétitions | Calculer les 10 premiers termes |
| while condition | On répète **tant que** la condition est vraie, sans savoir combien de fois | Chercher un seuil |

range(5) parcourt 0, 1, 2, 3, 4 — **cinq** valeurs, et 5 n'en fait pas partie. range(2, 6) parcourt 2, 3, 4, 5.

**Trace d'exécution.** Que vaut s à la fin ?

\`\`\`python
s = 0
for i in range(4):
    s = s + i
\`\`\`

i prend les valeurs 0, 1, 2, 3 : s vaut 0 + 1 + 2 + 3 = **6**.

## Les fonctions
Une fonction se définit par def, reçoit des paramètres et **renvoie** un résultat avec return. Exemple : le terme u(n) de la suite u(0) = 5, u(n+1) = 2 u(n) + 1.

\`\`\`python
def terme(n):
    u = 5
    for i in range(n):
        u = 2 * u + 1
    return u
\`\`\`

terme(2) vaut 23 : u passe de 5 à 11, puis à 23.

> return **renvoie** une valeur que le programme peut réutiliser ; print se contente de l'**afficher** à l'écran. Ce n'est pas la même chose.`,
          },
          questions: [
            ['Quelles valeurs parcourt range(5) ?', ['0, 1, 2, 3, 4', '1, 2, 3, 4, 5', '0, 1, 2, 3, 4, 5', '5 seulement'], 0, 'range(n) part de 0 et s’arrête AVANT n : cinq valeurs.'],
            ['Quelles valeurs parcourt range(2, 6) ?', ['2, 3, 4, 5, 6', '3, 4, 5, 6', '2 et 6', '2, 3, 4, 5'], 3, 'La borne de départ est incluse, celle d’arrivée exclue.'],
            ['Quelle est la différence entre = et == en Python ?', ['Aucune', '= teste une égalité, == affecte une valeur', '= affecte une valeur, == teste une égalité', '== sert seulement aux chaînes'], 2, 'Confondre les deux est l’erreur la plus fréquente du débutant.'],
            ['Après x = 3 puis x = x + 2, que vaut x ?', ['3', '5', '2', 'Erreur'], 1, 'On calcule 3 + 2 et on range le résultat dans x.'],
            ['Que vaut s après : s = 0, puis for i in range(4): s = s + i ?', ['10', '4', '3', '6'], 3, 'i prend 0, 1, 2, 3 : la somme vaut 6.'],
            ['Quelle boucle choisir quand on ne sait pas à l’avance combien de fois répéter ?', ['while', 'for', 'if', 'def'], 0, 'while répète tant qu’une condition est vraie : c’est la boucle des seuils.'],
            ['Que vaut 7 % 2 en Python ?', ['3,5', '3', '1', '0'], 2, '% donne le reste de la division euclidienne : 7 = 2 × 3 + 1.'],
            ['print et return font la même chose dans une fonction.', ['Vrai', 'Faux'], 1, 'print affiche ; return renvoie une valeur réutilisable par le programme.'],
            ['Quel mot-clé sert à définir une fonction ?', ['function', 'return', 'for', 'def'], 3, 'def nom(paramètres): puis le corps de la fonction en retrait.'],
            ['À quoi sert le retrait (l’indentation) en Python ?', ['À rien, c’est de la mise en page', 'À indiquer quelles instructions appartiennent à un bloc', 'À ralentir le programme', 'À commenter le code'], 1, 'Une instruction mal alignée sort de la boucle ou du test : le résultat change.'],
            ['Avec u = 5 puis deux passages dans u = 2 * u + 1, que vaut u ?', ['11', '21', '23', '12'], 2, 'Premier passage : 11 ; second : 2 × 11 + 1 = 23.'],
            ['Comment écrit-on le nombre deux et demi en Python ?', ['2,5', '5/2,0', '2½', '2.5'], 3, 'Python utilise le point décimal ; 2,5 serait lu comme un couple de deux nombres.'],
          ],
        },
        {
          titre: 'Les listes en Python',
          axe: 'Algorithmique et programmation',
          lecon: {
            titre: 'Créer, lire, parcourir une liste',
            cours: `Une **liste** range plusieurs valeurs dans une seule variable, dans un ordre précis. C'est l'outil du programme de Première pour stocker les termes d'une suite, les valeurs d'une série ou les résultats d'une simulation.

> Les indices commencent à **0** : le premier élément est L[0], pas L[1].

## Trois façons de créer une liste
| La méthode | Un exemple | La liste obtenue |
| **En extension** | L = [4, 7, 1, 9] | [4, 7, 1, 9] |
| **Par ajouts successifs** | L = [] puis L.append(x) dans une boucle | Elle grandit d'un élément à chaque append |
| **En compréhension** | [i * i for i in range(5)] | [0, 1, 4, 9, 16] |

La compréhension accepte un filtre : [k for k in range(10) if k % 3 == 0] donne [0, 3, 6, 9].

## Lire et modifier les éléments
Avec L = [4, 7, 1, 9] :

| L'instruction | Le résultat |
| L[0] | 4, le premier élément |
| L[2] | 1, le troisième élément |
| L[-1] | 9, le **dernier** élément |
| len(L) | 4, le nombre d'éléments |
| L[1] = 8 | La liste devient [4, 8, 1, 9] |
| L.append(5) | La liste devient [4, 7, 1, 9, 5] |

> Les indices valides vont de 0 à len(L) − 1. Demander L[len(L)] provoque une erreur : cet élément n'existe pas.

## Deux façons de parcourir une liste
| Le parcours | Le code | Quand l'employer |
| Par les **éléments** | for x in L: | On a besoin des valeurs seulement |
| Par les **indices** | for i in range(len(L)): | On a besoin de la position, ou de modifier L[i] |

**Exemple : la somme des éléments.**

\`\`\`python
s = 0
for x in L:
    s = s + x
\`\`\`

Avec L = [4, 7, 1, 9], s vaut 21.

## Une fonction qui renvoie une liste
Le programme demande de savoir écrire une fonction qui renvoie la **liste des premiers termes** d'une suite. Pour u(0) = 1000 et u(n+1) = 1,05 u(n) :

\`\`\`python
def termes(n):
    u = 1000
    L = [u]
    for i in range(n):
        u = 1.05 * u
        L.append(u)
    return L
\`\`\`

termes(2) renvoie [1000, 1050.0, 1102.5] : le terme de départ, puis deux termes calculés.

> Dans « ···· » on lit le retrait : l'append est DANS la boucle, le return est APRÈS elle.`,
          },
          questions: [
            ['Avec L = [4, 7, 1, 9], que vaut L[0] ?', ['4', '7', '9', 'Erreur'], 0, 'Les indices commencent à 0 : L[0] est le premier élément.'],
            ['Avec L = [4, 7, 1, 9], que vaut L[2] ?', ['7', '9', '4', '1'], 3, 'L[2] est le troisième élément, puisque l’on compte à partir de 0.'],
            ['Avec L = [4, 7, 1, 9], que vaut L[-1] ?', ['4', 'Erreur', '9', '1'], 2, 'Un indice négatif compte depuis la fin : L[-1] est le dernier élément.'],
            ['Avec L = [4, 7, 1, 9], que vaut len(L) ?', ['3', '4', '9', '21'], 1, 'len renvoie le nombre d’éléments.'],
            ['Que devient L = [4, 7, 1, 9] après L.append(5) ?', ['[5, 4, 7, 1, 9]', '[4, 7, 5, 1, 9]', '[4, 7, 1, 5]', '[4, 7, 1, 9, 5]'], 3, 'append ajoute l’élément à la fin de la liste.'],
            ['Quelle liste donne [2 * k for k in range(4)] ?', ['[0, 2, 4, 6]', '[2, 4, 6, 8]', '[0, 2, 4, 6, 8]', '[2, 4, 6]'], 0, 'k prend 0, 1, 2, 3 : on obtient leurs doubles.'],
            ['Quelle liste donne [k for k in range(10) if k % 3 == 0] ?', ['[3, 6, 9]', '[0, 3, 6]', '[0, 3, 6, 9]', '[1, 4, 7]'], 2, 'On garde les entiers de 0 à 9 dont le reste par 3 est nul ; 0 en fait partie.'],
            ['Pour L de longueur 5, l’élément L[5] existe.', ['Vrai', 'Faux'], 1, 'Les indices vont de 0 à 4 : L[5] provoque une erreur.'],
            ['Que parcourt la boucle for x in L ?', ['Les indices de L', 'La longueur de L', 'Le dernier élément', 'Les éléments de L'], 3, 'x prend successivement chaque valeur de la liste.'],
            ['Quel parcours choisir pour modifier L[i] ?', ['for x in L', 'for i in range(len(L))', 'while L', 'len(L)'], 1, 'Pour modifier, il faut connaître la position i de l’élément.'],
            ['Avec L = [4, 7, 1, 9], que vaut s après s = 0 puis for x in L: s = s + x ?', ['9', '20', '21', '4'], 2, '4 + 7 + 1 + 9 = 21.'],
            ['Que renvoie termes(2) pour u(0) = 1000 et u(n+1) = 1,05 u(n) ?', ['[1050.0, 1102.5]', '[1000, 1050.0]', '1102.5', '[1000, 1050.0, 1102.5]'], 3, 'La liste contient le premier terme puis un terme de plus à chaque tour de boucle.'],
          ],
        },
        {
          titre: 'Seuil, Newton, Euler : les algorithmes à connaître',
          axe: 'Algorithmique et programmation',
          lecon: {
            titre: 'Les algorithmes du programme de Première',
            cours: `Le programme de Première associe à ses chapitres quelques algorithmes précis. Chacun répond à une question que le calcul seul ne règle pas facilement.

## L'algorithme de seuil (suites)
**La question :** à partir de quel rang n la suite dépasse-t-elle une valeur donnée ?

Un capital de 1 000 euros placé à 5 % par an : u(0) = 1000 et u(n+1) = 1,05 u(n). Quand dépasse-t-il 2 000 euros ?

\`\`\`python
def seuil():
    n = 0
    u = 1000
    while u < 2000:
        n = n + 1
        u = 1.05 * u
    return n
\`\`\`

La fonction renvoie **15** : 1,05 puissance 14 ≈ 1,98 reste sous 2, tandis que 1,05 puissance 15 ≈ 2,08 le dépasse.

> On utilise while : on ne sait pas à l'avance combien de tours il faudra. La condition est celle pour **continuer**, c'est-à-dire le contraire de ce que l'on attend.

## Les sécantes (dérivation)
Le nombre dérivé est la limite du coefficient directeur des sécantes, (f(a + h) − f(a)) / h. Un programme calcule ces coefficients pour h = 0,1 ; 0,01 ; 0,001… et montre qu'ils se rapprochent de f'(a).

## La méthode de Newton (équations)
**La question :** approcher une solution de f(x) = 0. On part d'une valeur x0 et on remplace la courbe par sa tangente : là où la tangente coupe l'axe des abscisses se trouve la valeur suivante.

x(n+1) = x(n) − f(x(n)) / f'(x(n))

**Exemple : approcher √2** avec f(x) = x² − 2, donc f'(x) = 2x, et x0 = 1.

| L'étape | Le calcul | La valeur |
| x1 | 1 − (−1) / 2 | 1,5 |
| x2 | 1,5 − 0,25 / 3 | ≈ 1,4167 |
| x3 | idem | ≈ 1,41422 |

√2 ≈ 1,41421 : trois étapes suffisent pour quatre décimales justes.

> La méthode exige f'(x(n)) non nul — on ne divise pas par zéro — et un point de départ assez proche de la solution : on se limite aux cas favorables.

## La méthode d'Euler (exponentielle)
**La question :** construire point par point une fonction f telle que f' = f et f(0) = 1. Sur un petit pas h, f(x + h) ≈ f(x) + h f'(x) = (1 + h) f(x). D'où la suite :

y(0) = 1 et y(k+1) = (1 + h) y(k)

Avec h = 0,1, dix pas mènent à x = 1 : y(10) = 1,1 puissance 10 ≈ **2,59**, une valeur approchée de e ≈ 2,718. Plus le pas est petit, meilleure est l'approximation.

## La méthode d'Archimède (trigonométrie)
On encadre le périmètre du cercle de rayon 1, donc 2π, entre ceux de polygones réguliers inscrits et circonscrits dont on double le nombre de côtés : l'encadrement de π se resserre à chaque étape.

> Un algorithme se relit toujours à la main sur les premiers tours : c'est la meilleure façon de vérifier une condition de boucle.`,
          },
          questions: [
            ['Quelle boucle utilise un algorithme de seuil ?', ['while', 'for i in range(n)', 'if', 'Aucune boucle'], 0, 'On ne sait pas à l’avance combien de tours seront nécessaires.'],
            ['u(0) = 1000 et u(n+1) = 1,05 u(n). À partir de quel rang u(n) dépasse-t-il 2 000 ?', ['14', '20', '10', '15'], 3, '1,05 puissance 14 ≈ 1,98 et 1,05 puissance 15 ≈ 2,08.'],
            ['Pour chercher quand u dépasse 2 000, quelle condition écrit-on après while ?', ['u > 2000', 'u == 2000', 'u < 2000', 'n < 2000'], 2, 'La boucle continue TANT QUE le seuil n’est pas atteint.'],
            ['Quelle est la formule de la méthode de Newton ?', ['x(n+1) = x(n) + f(x(n)) × f’(x(n))', 'x(n+1) = x(n) − f(x(n)) / f’(x(n))', 'x(n+1) = f(x(n)) / f’(x(n))', 'x(n+1) = x(n) − f’(x(n)) / f(x(n))'], 1, 'On suit la tangente jusqu’à l’axe des abscisses.'],
            ['Avec f(x) = x² − 2 et x0 = 1, que vaut x1 par la méthode de Newton ?', ['2', '1,4', '0,5', '1,5'], 3, 'x1 = 1 − (−1) / 2 = 1,5.'],
            ['La méthode de Newton exige que f’(x(n)) soit non nul.', ['Vrai', 'Faux'], 0, 'On divise par f’(x(n)) : une tangente horizontale ne coupe pas l’axe.'],
            ['Dans la méthode d’Euler pour l’exponentielle, comment passe-t-on de y(k) à y(k+1) ?', ['y(k+1) = y(k) + h', 'y(k+1) = h y(k)', 'y(k+1) = (1 + h) y(k)', 'y(k+1) = y(k) / (1 + h)'], 2, 'f(x + h) ≈ f(x) + h f’(x), et f’ = f.'],
            ['Avec un pas h = 0,1, quelle valeur approchée de e donne la méthode d’Euler ?', ['2,59', '1,1', '2,718', '10'], 0, '1,1 puissance 10 ≈ 2,59, un peu en dessous de e ≈ 2,718.'],
            ['Dans la méthode d’Euler, un pas plus petit donne en général une meilleure approximation.', ['Vrai', 'Faux'], 0, 'La tangente colle mieux à la courbe sur un intervalle plus court.'],
            ['Que calcule-t-on pour approcher le nombre dérivé f’(a) par les sécantes ?', ['f(a + h) − f(a)', '(f(a + h) − f(a)) / h', 'f(a) / h', 'f(a + h) × h'], 1, 'C’est le taux de variation, dont la limite quand h tend vers 0 est f’(a).'],
            ['Un algorithme de seuil cherche quand une suite dépasse une valeur donnée. Que renvoie-t-il ?', ['La valeur de u', 'La somme des termes', 'Le rang n', 'Le nombre 2 000'], 2, 'On cherche un RANG : c’est n que l’on renvoie.', 'Que renvoie la fonction seuil() du cours ?'],
            ['Que fait la méthode d’Archimède ?', ['Elle calcule e', 'Elle résout une équation du second degré', 'Elle calcule une dérivée', 'Elle encadre π par les périmètres de polygones réguliers'], 3, 'En doublant le nombre de côtés, l’encadrement se resserre.'],
          ],
        },

        // ---- Épreuve anticipée de mathématiques -----------------------------
        {
          titre: 'Automatismes : proportions et pourcentages',
          axe: 'Épreuve anticipée de mathématiques',
          lecon: {
            titre: 'Une partie, un tout, une proportion',
            cours: `Les automatismes de l'épreuve anticipée se font **sans calculatrice** et en quelques secondes chacun. Les proportions en sont la première famille : il s'agit toujours d'une **partie** comparée à un **tout**.

> proportion = partie / tout. Une proportion est toujours comprise entre 0 et 1, soit entre 0 % et 100 %.

## Les réflexes
| La situation | Le réflexe | Un exemple |
| Calculer une partie | tout × proportion | 15 % de 80 = 0,15 × 80 = **12** |
| Calculer une proportion | partie / tout | 18 élèves sur 24 : 18 / 24 = 3 / 4 = **75 %** |
| Retrouver le tout | partie / proportion | 30 % valent 45, donc le tout vaut 45 / 0,3 = **150** |
| Proportion d'une proportion | on **multiplie** | 40 % de 25 % = 0,4 × 0,25 = **10 %** |

## Passer d'une écriture à une autre
| Fraction | Décimal | Pourcentage |
| 1/2 | 0,5 | 50 % |
| 1/4 | 0,25 | 25 % |
| 3/4 | 0,75 | 75 % |
| 1/5 | 0,2 | 20 % |
| 1/8 | 0,125 | 12,5 % |
| 3/8 | 0,375 | 37,5 % |
| 1/10 | 0,1 | 10 % |

Pour passer d'un décimal à un pourcentage, on multiplie par 100 : 0,035 = **3,5 %**.

## Calculer de tête
1. **10 %** : on divise par 10 (10 % de 360 = 36).
2. **5 %** : la moitié de 10 % (5 % de 360 = 18).
3. **1 %** : on divise par 100 ; 3 % = 3 × 1 %.
4. **25 %** : le quart ; **50 %** : la moitié ; **75 %** : trois quarts.

> Un pourcentage se calcule dans l'ordre qui arrange : 8 % de 25 = 25 % de 8 = 2.

## La proportion d'une proportion
Dans une classe, 60 % des élèves sont des filles et 20 % des filles font du latin. La proportion de la classe qui est une fille latiniste vaut 0,6 × 0,2 = 0,12, soit **12 %**.

> Les pourcentages de sous-populations se **multiplient** ; ils ne s'additionnent jamais.

## Comparer deux proportions
Pour comparer 7/20 et 0,34, on les écrit sous la même forme : 7/20 = 0,35, qui est plus grand que 0,34.

## Exemple travaillé
Dans un lycée de 1 200 élèves, 45 % sont en Seconde. Combien d'élèves ? 10 % de 1 200 = 120, donc 40 % = 480 et 5 % = 60 : 45 % = **540 élèves**.`,
          },
          questions: [
            ['Combien vaut 15 % de 80 ?', ['12', '8', '15', '1,2'], 0, '10 % de 80 = 8 et 5 % = 4 : 8 + 4 = 12.'],
            ['Quelle est l’écriture en pourcentage de 3/8 ?', ['38 %', '3,8 %', '30 %', '37,5 %'], 3, '1/8 = 12,5 %, donc 3/8 = 37,5 %.'],
            ['18 élèves sur 24 ont réussi. Quelle proportion ?', ['18 %', '66 %', '75 %', '80 %'], 2, '18 / 24 = 3 / 4 = 75 %.'],
            ['30 % d’une quantité valent 45. Combien vaut la quantité entière ?', ['135', '150', '13,5', '75'], 1, 'Tout = partie / proportion = 45 / 0,3 = 150.'],
            ['Combien vaut 40 % de 25 % ?', ['65 %', '15 %', '100 %', '10 %'], 3, 'On multiplie : 0,4 × 0,25 = 0,1.'],
            ['Quelle est l’écriture en pourcentage de 0,035 ?', ['3,5 %', '35 %', '0,35 %', '350 %'], 0, 'On multiplie par 100.'],
            ['Combien vaut 5 % de 360 ?', ['36', '5', '18', '72'], 2, '10 % de 360 = 36, et 5 % en est la moitié.'],
            ['Une proportion peut être strictement supérieure à 1.', ['Vrai', 'Faux'], 1, 'Une partie ne peut pas dépasser le tout : une proportion est entre 0 et 1.'],
            ['60 % des élèves sont des filles et 20 % des filles font du latin. Quelle part de la classe est une fille latiniste ?', ['80 %', '40 %', '20 %', '12 %'], 3, 'On multiplie les proportions : 0,6 × 0,2 = 0,12.'],
            ['Lequel est le plus grand : 7/20 ou 0,34 ?', ['0,34', '7/20', 'Ils sont égaux', 'On ne peut pas comparer'], 1, '7/20 = 35/100 = 0,35, plus grand que 0,34.'],
            ['Dans un lycée de 1 200 élèves, 45 % sont en Seconde. Combien sont-ils ?', ['450', '600', '540', '520'], 2, '40 % = 480 et 5 % = 60 : 540.'],
            ['Quelle fraction vaut 12,5 % ?', ['1/12', '1/5', '1/4', '1/8'], 3, '12,5 % = 0,125 = 1/8.'],
          ],
        },
        {
          titre: 'Automatismes : évolutions et taux',
          axe: 'Épreuve anticipée de mathématiques',
          lecon: {
            titre: 'Tout passe par le coefficient multiplicateur',
            cours: `Une hausse, une baisse, deux évolutions successives, un retour au prix de départ : toutes ces questions se règlent avec un seul outil, le **coefficient multiplicateur**.

> Augmenter de t %, c'est multiplier par 1 + t/100. Diminuer de t %, c'est multiplier par 1 − t/100.

## Les réflexes
| L'évolution | Le coefficient multiplicateur |
| Hausse de 20 % | × 1,2 |
| Hausse de 5 % | × 1,05 |
| Hausse de 100 % | × 2 (on double) |
| Baisse de 15 % | × 0,85 |
| Baisse de 50 % | × 0,5 (on divise par deux) |

## Calculer une valeur finale ou initiale
| La question | Le calcul | Un exemple |
| Valeur **finale** | initiale × CM | 80 euros augmentés de 15 % : 80 × 1,15 = **92 euros** |
| Valeur **initiale** | finale / CM | Après une baisse de 20 %, un prix vaut 64 euros : 64 / 0,8 = **80 euros** |

> Piège : pour retrouver le prix d'avant une baisse de 20 %, on n'ajoute pas 20 % au prix final. 64 × 1,2 = 76,80, et non 80.

## Calculer un taux d'évolution
taux = (valeur finale − valeur initiale) / valeur initiale

De 80 à 92 : (92 − 80) / 80 = 12 / 80 = 0,15, soit **+15 %**. De 50 à 40 : −10 / 50 = **−20 %**.

## Les évolutions successives
Les coefficients se **multiplient**, les taux ne s'additionnent pas.

| Les évolutions | Le calcul | L'évolution globale |
| +10 % puis +10 % | 1,1 × 1,1 = 1,21 | **+21 %** |
| +50 % puis −50 % | 1,5 × 0,5 = 0,75 | **−25 %** |
| −10 % puis −10 % | 0,9 × 0,9 = 0,81 | **−19 %** |
| +20 % puis −20 % | 1,2 × 0,8 = 0,96 | **−4 %** |

## Le taux réciproque
Quelle évolution ramène à la valeur de départ ? Celle dont le coefficient est l'**inverse** : 1 / CM.

| L'évolution | Le coefficient réciproque | L'évolution réciproque |
| +25 % | 1 / 1,25 = 0,8 | **−20 %** |
| +100 % | 1 / 2 = 0,5 | **−50 %** |
| −50 % | 1 / 0,5 = 2 | **+100 %** |

> Après une baisse de 50 %, il faut une hausse de 100 % pour revenir au départ.

## Pourcentage ou point ?
Un taux qui passe de 10 % à 12 % augmente de **2 points** de pourcentage, mais de **20 %** (2 / 10).`,
          },
          questions: [
            ['Par quel coefficient multiplie-t-on pour une baisse de 15 % ?', ['0,85', '1,15', '0,15', '−0,15'], 0, '1 − 15/100 = 0,85.'],
            ['Un article à 80 euros augmente de 15 %. Quel est son nouveau prix ?', ['95 euros', '81,20 euros', '68 euros', '92 euros'], 3, '80 × 1,15 = 92.'],
            ['Après une baisse de 20 %, un prix vaut 64 euros. Quel était le prix initial ?', ['76,80 euros', '84 euros', '80 euros', '51,20 euros'], 2, 'On divise par le coefficient : 64 / 0,8 = 80.'],
            ['Un prix passe de 80 à 92 euros. Quel est le taux d’évolution ?', ['+12 %', '+15 %', '+13 %', '+20 %'], 1, '(92 − 80) / 80 = 12 / 80 = 0,15.'],
            ['Une hausse de 10 % suivie d’une hausse de 10 % équivaut à…', ['+20 %', '+11 %', '+100 %', '+21 %'], 3, '1,1 × 1,1 = 1,21.'],
            ['Une hausse de 50 % suivie d’une baisse de 50 % ramène au prix de départ.', ['Vrai', 'Faux'], 1, '1,5 × 0,5 = 0,75 : c’est une baisse de 25 %.'],
            ['Quelle évolution annule une hausse de 25 % ?', ['−25 %', '−75 %', '−20 %', '−15 %'], 2, 'Le coefficient réciproque vaut 1 / 1,25 = 0,8.'],
            ['Après une baisse de 50 %, quelle hausse ramène à la valeur de départ ?', ['+100 %', '+50 %', '+150 %', '+200 %'], 0, 'Coefficient réciproque : 1 / 0,5 = 2.'],
            ['Une hausse de 20 % puis une baisse de 20 % donnent…', ['aucune évolution', 'une hausse de 4 %', 'une baisse de 40 %', 'une baisse de 4 %'], 3, '1,2 × 0,8 = 0,96.'],
            ['Un effectif passe de 50 à 40. Quel est le taux d’évolution ?', ['−10 %', '−20 %', '−25 %', '+20 %'], 1, '(40 − 50) / 50 = −0,2.'],
            ['Un taux passe de 10 % à 12 %. De combien a-t-il augmenté ?', ['De 2 %', 'De 12 %', 'De 2 points, soit 20 %', 'De 20 points'], 2, 'L’écart est de 2 points ; rapporté à 10, il représente une hausse de 20 %.'],
            ['Multiplier par 2, c’est…', ['augmenter de 200 %', 'augmenter de 2 %', 'augmenter de 50 %', 'augmenter de 100 %'], 3, 'Le coefficient 2 correspond à 1 + 100/100.'],
          ],
        },
        {
          titre: 'Automatismes : calcul numérique et littéral',
          axe: 'Épreuve anticipée de mathématiques',
          lecon: {
            titre: 'Fractions, puissances, identités, équations',
            cours: `Sans calculatrice, chaque calcul doit être sûr et rapide. Cette fiche rassemble les réflexes de calcul numérique et algébrique attendus à l'épreuve anticipée.

## Fractions
| L'opération | La règle | Un exemple |
| Additionner | Même dénominateur d'abord | 2/3 + 1/6 = 4/6 + 1/6 = **5/6** |
| Multiplier | Numérateurs entre eux, dénominateurs entre eux | 2/3 × 9/4 = 18/12 = **3/2** |
| Diviser | Multiplier par l'inverse | (2/3) / (4/9) = 2/3 × 9/4 = **3/2** |

## Puissances
| La règle | Un exemple |
| a puissance m × a puissance n = a puissance (m + n) | 2³ × 2⁴ = 2⁷ |
| (a puissance m) puissance n = a puissance (m × n) | (2³)² = 2⁶ = 64 |
| a puissance m / a puissance n = a puissance (m − n) | 10⁵ / 10² = 10³ |
| a puissance (−n) = 1 / a puissance n | 10 puissance (−3) = 0,001 |

10³ × 10 puissance (−5) = 10 puissance (−2) = 0,01.

## Calcul littéral
| L'automatisme | Le réflexe |
| −(a + b) | −a − b |
| −(a − b) | b − a |
| (a + b)² | a² + 2ab + b² |
| (a − b)² | a² − 2ab + b² |
| (a + b)(a − b) | a² − b² |
| Factoriser 3x² + 6x | 3x (x + 2) |
| Factoriser x² − 25 | (x − 5)(x + 5) |

> Une factorisation se vérifie en redéveloppant de tête : c'est la meilleure assurance contre l'erreur de signe.

## Équations et signes
| L'équation | Les solutions |
| x² = 16 | x = −4 ou x = 4 — **deux** solutions |
| x² = −4 | **Aucune** : un carré est positif |
| 3 / x = 6 | x = 3 / 6 = 1/2 |
| (2x − 1)(x + 3) = 0 | Produit nul : x = 1/2 ou x = −3 |
| 5x − 3 = 2x + 9 | 3x = 12, x = 4 |

Le signe de ax + b change en x = −b/a : il est du signe de a **à droite** de cette valeur. Ainsi −2x + 4 est positif pour x < 2 et négatif pour x > 2.

## Isoler une variable
Dans v = d / t, on isole t : t = d / v. Dans E = m c², on isole m : m = E / c². On applique les mêmes opérations aux deux membres.

## Conversions et ordres de grandeur
| La conversion | Le réflexe |
| 1 h 15 min | 1,25 h (15 min = un quart d'heure) |
| 72 km/h | 72 / 3,6 = 20 m/s |
| 1 m² | 10 000 cm² |
| 1 L | 1 dm³ |

> Un résultat se contrôle par son **ordre de grandeur** : 49 × 21 est proche de 50 × 20 = 1 000 ; trouver 10 290 signale une erreur.

## Comparer deux nombres
On étudie le signe de leur **différence**, ou, s'ils sont strictement positifs, on compare leur **quotient** à 1.`,
          },
          questions: [
            ['Combien vaut 2/3 + 1/6 ?', ['5/6', '3/9', '1/2', '3/6'], 0, 'On met au même dénominateur : 4/6 + 1/6.'],
            ['Combien vaut (2/3) / (4/9) ?', ['8/27', '2/3', '6/12', '3/2'], 3, 'Diviser, c’est multiplier par l’inverse : 2/3 × 9/4 = 18/12 = 3/2.'],
            ['Combien vaut 10³ × 10 puissance (−5) ?', ['10 puissance (−15)', '10 puissance 8', '10 puissance (−2)', '10 puissance 2'], 2, 'On additionne les exposants : 3 + (−5) = −2.'],
            ['Quel est le développement de (x − 3)² ?', ['x² − 9', 'x² − 6x + 9', 'x² + 9', 'x² − 3x + 9'], 1, 'Identité (a − b)² = a² − 2ab + b².'],
            ['Quelle est la factorisation de x² − 25 ?', ['(x − 5)²', '(x − 25)(x + 1)', 'x (x − 25)', '(x − 5)(x + 5)'], 3, 'Identité a² − b² = (a − b)(a + b).'],
            ['Quelles sont les solutions de x² = 16 ?', ['−4 et 4', '4 seulement', '8 et −8', '16'], 0, 'Deux nombres ont pour carré 16 : ne pas oublier le négatif.'],
            ['Quelle est la solution de 3 / x = 6 ?', ['x = 2', 'x = 18', 'x = 1/2', 'x = 3'], 2, 'x = 3 / 6 = 1/2.'],
            ['Quelles sont les solutions de (2x − 1)(x + 3) = 0 ?', ['1/2 et −3', '−1/2 et 3', '1 et 3', '2 et −3'], 0, 'Un produit est nul si l’un de ses facteurs est nul.'],
            ['Dans v = d / t, comment exprime-t-on t ?', ['t = v × d', 't = v / d', 't = d − v', 't = d / v'], 3, 'On multiplie par t puis on divise par v.'],
            ['Combien vaut 72 km/h en m/s ?', ['259,2 m/s', '20 m/s', '7,2 m/s', '12 m/s'], 1, 'On divise par 3,6 : 1 m/s = 3,6 km/h.'],
            ['−(a − b) est égal à b − a.', ['Vrai', 'Faux'], 0, 'Le signe moins change le signe de chaque terme : −a + b.'],
            ['Quelle est la factorisation de 3x² + 6x ?', ['3 (x² + 6x)', 'x (3x + 2)', '3x (x + 6)', '3x (x + 2)'], 3, 'Le facteur commun est 3x ; on vérifie en redéveloppant.'],
          ],
        },
        {
          titre: 'Automatismes : fonctions et représentations graphiques',
          axe: 'Épreuve anticipée de mathématiques',
          lecon: {
            titre: 'Lire un graphique, exploiter une droite',
            cours: `Une bonne partie des automatismes se lit sur un graphique ou se tire d'une équation de droite. La rapidité vient d'une règle simple : **l'abscisse se lit en bas, l'ordonnée sur le côté**.

## Image et antécédent
| La question | Ce qu'on cherche | Sur le graphique |
| L'**image** de a | f(a) | On part de a sur l'axe des **abscisses**, on monte à la courbe, on lit l'**ordonnée** |
| Les **antécédents** de b | Les x tels que f(x) = b | On part de b sur l'axe des **ordonnées**, on cherche les points de la courbe à cette hauteur |

> Un nombre a **une seule** image, mais il peut avoir zéro, un ou plusieurs antécédents. Si f(3) = 7, alors 7 est l'image de 3 et 3 est un antécédent de 7.

## Un point sur une courbe ?
Le point A(2 ; 5) est sur la courbe d'équation y = 3x − 1 si ses coordonnées vérifient l'équation : 3 × 2 − 1 = 5. **Oui.**

## Fonctions affines et linéaires
| La fonction | Son expression | Sa courbe |
| **Affine** | f(x) = m x + p | Une droite, de coefficient directeur m et d'ordonnée à l'origine p |
| **Linéaire** | f(x) = m x | Une droite qui passe par l'**origine** |

| Le signe de m | La fonction affine est… |
| m > 0 | Croissante |
| m < 0 | Décroissante |
| m = 0 | Constante |

## Le coefficient directeur par deux points
m = (yB − yA) / (xB − xA)

**Exemple.** A(1 ; 2) et B(3 ; 8) : m = (8 − 2) / (3 − 1) = 3. Puis p = yA − m xA = 2 − 3 = −1 : la droite a pour équation **y = 3x − 1**.

## Lire l'équation réduite d'une droite
1. p se lit là où la droite coupe l'axe des ordonnées.
2. m se lit en avançant d'une unité vers la droite : on compte de combien on monte (m > 0) ou on descend (m < 0).

Pour **tracer** y = −x + 2 : on place (0 ; 2), puis on avance de 1 et on descend de 1.

## Résoudre graphiquement
| La question | Ce qu'on lit |
| f(x) = k | Les abscisses des points d'intersection avec la droite horizontale y = k |
| f(x) > k | Les abscisses des points où la courbe est **au-dessus** de cette droite |
| f(x) = g(x) | Les abscisses des points d'intersection des deux courbes |

## Signe et variations lus sur un graphique
- La fonction est **positive** là où la courbe est au-dessus de l'axe des abscisses.
- Elle est **croissante** là où la courbe monte quand on va vers la droite.
- Un **maximum** est un sommet où la courbe passe de la montée à la descente.

Le zéro d'une fonction affine se calcule : 2x − 6 = 0 donne x = 3. Et −2x + 4 est positif pour x < 2.

> Toujours vérifier les **unités des axes** avant de lire : une graduation de 2 en 2 fausse tous les résultats si on la prend pour 1 en 1.`,
          },
          questions: [
            ['Le point A(2 ; 5) appartient-il à la droite d’équation y = 3x − 1 ?', ['Oui', 'Non', 'On ne peut pas savoir', 'Seulement si x = 5'], 0, '3 × 2 − 1 = 5 : les coordonnées vérifient l’équation.'],
            ['Quel est le coefficient directeur de la droite passant par A(1 ; 2) et B(3 ; 8) ?', ['2', '6', '1/3', '3'], 3, 'm = (8 − 2) / (3 − 1) = 6 / 2 = 3.'],
            ['Quelle est l’équation de la droite passant par A(1 ; 2) et B(3 ; 8) ?', ['y = 3x + 2', 'y = 2x + 1', 'y = 3x − 1', 'y = 6x − 4'], 2, 'm = 3, puis p = 2 − 3 × 1 = −1.'],
            ['La fonction f(x) = −2x + 4 est…', ['linéaire et croissante', 'affine et décroissante', 'affine et croissante', 'constante'], 1, 'Son coefficient directeur −2 est négatif.'],
            ['La courbe d’une fonction linéaire passe toujours par l’origine du repère.', ['Vrai', 'Faux'], 0, 'f(0) = m × 0 = 0.'],
            ['Si f(3) = 7, alors…', ['7 est l’image de 3', '3 est l’image de 7', '7 est un antécédent de 3', 'f(7) = 3'], 0, 'L’image se lit en ordonnée, à partir de l’abscisse 3.'],
            ['Un nombre peut avoir plusieurs antécédents par une fonction.', ['Vrai', 'Faux'], 0, 'Une droite horizontale peut couper la courbe en plusieurs points ; en revanche, chaque nombre a une seule image.'],
            ['Quelle est l’ordonnée à l’origine de la droite y = −x + 2 ?', ['2', '−1', '−2', '1'], 0, 'C’est p, la valeur de y pour x = 0.'],
            ['Pour quelle valeur de x la fonction 2x − 6 s’annule-t-elle ?', ['x = −3', 'x = 6', 'x = 2', 'x = 3'], 3, '2x − 6 = 0 donne x = 3.'],
            ['Pour quelles valeurs de x l’expression −2x + 4 est-elle positive ?', ['x > 2', 'x < 2', 'x < −2', 'x > 4'], 1, 'Elle s’annule en 2 et, avec un coefficient négatif, elle est positive à gauche.'],
            ['Sur un graphique, comment résout-on f(x) > k ?', ['On lit les ordonnées des points au-dessus de l’axe', 'On calcule f(k)', 'On cherche les abscisses des points de la courbe au-dessus de la droite y = k', 'On cherche où la courbe coupe l’axe des ordonnées'], 2, 'La réponse est un ensemble d’ABSCISSES, souvent un intervalle.'],
            ['Pour tracer y = 3x − 1, on peut placer le point (0 ; −1) puis…', ['avancer de 3 et monter de 1', 'avancer de 1 et descendre de 3', 'monter de 1', 'avancer de 1 et monter de 3'], 3, 'Le coefficient directeur 3 dit de combien on monte pour une unité en abscisse.'],
          ],
        },
        {
          titre: 'Automatismes : statistiques et probabilités',
          axe: 'Épreuve anticipée de mathématiques',
          lecon: {
            titre: 'Indicateurs, graphiques, tableau croisé',
            cours: `Dernière famille d'automatismes : lire et résumer des données, puis calculer des probabilités simples. Beaucoup de ces notions viennent de la Seconde, et l'épreuve les attend quand même.

## Les indicateurs statistiques
Série : 3 ; 5 ; 7 ; 8 ; 10 ; 12 ; 15 (7 valeurs, déjà rangées).

| L'indicateur | Sa définition | Pour la série |
| **Moyenne** | Somme des valeurs / effectif | 60 / 7 ≈ 8,6 |
| **Médiane** | Partage la série rangée en deux moitiés | 8, la 4e valeur |
| **Premier quartile Q1** | Plus petite valeur telle qu'au moins 25 % des valeurs lui soient inférieures ou égales | 5, la 2e valeur (7 / 4 = 1,75, on arrondit au rang supérieur) |
| **Troisième quartile Q3** | Même chose avec 75 % | 12, la 6e valeur (21 / 4 = 5,25 donne le rang 6) |
| **Étendue** | Maximum − minimum | 15 − 3 = 12 |
| **Écart interquartile** | Q3 − Q1 | 12 − 5 = 7 |

**Moyenne pondérée** : une note de 12 coefficient 2 et une note de 15 coefficient 1 donnent (12 × 2 + 15 × 1) / 3 = 39 / 3 = **13**.

> La médiane résiste aux valeurs extrêmes, la moyenne non : remplacer 15 par 150 change la moyenne, pas la médiane.

## Les graphiques
| Le graphique | Ce qu'il montre |
| Diagramme en barres | Des effectifs par catégorie |
| Diagramme circulaire | Des parts : l'angle vaut proportion × 360° — 25 % font **90°** |
| Histogramme | Des classes de valeurs |
| Boîte à moustaches | Minimum, Q1, médiane, Q3, maximum : idéale pour **comparer** deux séries |

## Les probabilités de base
| La règle | Son énoncé |
| Encadrement | Une probabilité est toujours comprise entre 0 et 1 |
| Contraire | P(non A) = 1 − P(A) |
| Somme des issues | P(A) = somme des probabilités des issues qui composent A |
| Équiprobabilité | P(A) = nombre d'issues favorables / nombre total d'issues |

Exemple : avec un dé équilibré, P(obtenir un nombre pair) = 3 / 6 = 1/2.

## Le tableau croisé d'effectifs
200 élèves, dont 120 filles ; 45 filles et 15 garçons font du latin.

| | Latin | Pas de latin | Total |
| Filles | 45 | 75 | 120 |
| Garçons | 15 | 65 | 80 |
| Total | 60 | 140 | 200 |

On choisit un élève au hasard (F : fille ; L : latiniste).

| La probabilité | Sa lecture | Sa valeur |
| P(F inter L) | Fille **et** latiniste, parmi **tous** | 45 / 200 = 0,225 |
| P(F)(L) | Latiniste, **parmi les filles** | 45 / 120 = 0,375 |
| P(L)(F) | Fille, **parmi les latinistes** | 45 / 60 = 0,75 |

> Tout se joue sur le dénominateur : « parmi » désigne la population à laquelle on se restreint.`,
          },
          questions: [
            ['Quelle est la médiane de la série 3 ; 5 ; 7 ; 8 ; 10 ; 12 ; 15 ?', ['8', '7', '8,6', '10'], 0, 'Avec 7 valeurs rangées, la médiane est la 4e.'],
            ['Quel est le premier quartile de cette série ?', ['3', '6', '7', '5'], 3, '7 / 4 = 1,75 : on prend la valeur de rang 2.'],
            ['Une note de 12 coefficient 2 et une note de 15 coefficient 1 donnent une moyenne de…', ['13,5', '14', '13', '12,5'], 2, '(12 × 2 + 15) / 3 = 39 / 3 = 13.'],
            ['Quel est l’écart interquartile d’une série de Q1 = 5 et Q3 = 12 ?', ['17', '7', '8,5', '12'], 1, 'Écart interquartile = Q3 − Q1.'],
            ['Remplacer la plus grande valeur d’une série par une valeur bien plus grande change sa médiane.', ['Vrai', 'Faux'], 1, 'La médiane dépend du rang des valeurs, pas de leur grandeur : elle résiste aux extrêmes.'],
            ['Dans un diagramme circulaire, quel angle représente une part de 25 % ?', ['90°', '25°', '45°', '180°'], 0, '0,25 × 360° = 90°.'],
            ['Quel graphique est le plus adapté pour comparer la dispersion de deux séries ?', ['Le diagramme circulaire', 'Le diagramme en barres', 'La boîte à moustaches', 'Le nuage de points'], 2, 'Deux boîtes côte à côte montrent médianes, quartiles et étendues.'],
            ['Si P(A) = 0,3, que vaut P(non A) ?', ['0,7', '0,3', '1,3', '0'], 0, 'P(non A) = 1 − P(A).'],
            ['Avec un dé équilibré, quelle est la probabilité d’obtenir un nombre pair ?', ['1/3', '1/6', '2/3', '1/2'], 3, 'Trois issues favorables (2, 4, 6) sur six.'],
            ['Sur 200 élèves, 120 sont des filles ; 60 élèves font du latin, dont 45 filles. Que vaut P(F inter L) ?', ['0,375', '0,225', '0,75', '0,3'], 1, 'Filles latinistes parmi TOUS les élèves : 45 / 200.', 'Dans le tableau croisé du cours, que vaut P(F inter L) ?'],
            ['Sur 200 élèves, 120 sont des filles ; 60 font du latin, dont 45 filles. Quelle est la probabilité qu’un élève soit latiniste sachant que c’est une fille ?', ['45 / 200', '45 / 60', '45 / 120', '60 / 200'], 2, 'On se restreint aux 120 filles.', 'Dans le même tableau, que vaut la probabilité qu’un élève soit latiniste sachant que c’est une fille ?'],
            ['Sur 200 élèves, 120 sont des filles ; 60 font du latin, dont 45 filles. Quelle est la probabilité qu’un élève soit une fille sachant qu’il est latiniste ?', ['0,375', '0,6', '0,225', '0,75'], 3, 'On se restreint aux 60 latinistes : 45 / 60.', 'Dans le même tableau, que vaut la probabilité qu’un élève soit une fille sachant qu’il est latiniste ?'],
          ],
        },
        {
          titre: 'L’épreuve anticipée de mathématiques : la méthode',
          axe: 'Épreuve anticipée de mathématiques',
          lecon: {
            titre: 'Comprendre l’épreuve, s’y préparer, la réussir',
            cours: `Depuis la session 2026, **tous** les élèves de Première des voies générale et technologique passent en juin une épreuve anticipée de mathématiques, qu'ils suivent la spécialité ou non. Elle compte pour le baccalauréat.

## L'épreuve en un tableau
| Le point | Ce qu'il faut savoir |
| Qui | Tous les élèves de Première, générale et technologique |
| Quand | En fin de Première, au mois de juin |
| Durée | **2 heures** |
| Note | Sur **20 points** |
| Coefficient | **2** au baccalauréat |
| Calculatrice | **Interdite** pendant toute l'épreuve |
| Sujet | Différent selon le parcours : spécialité mathématiques, enseignement de mathématiques sans spécialité, ou voie technologique |

## Deux parties
| La partie | Les points | Ce qu'elle évalue |
| **1. Automatismes** | **6 points** | Une série de questions courtes, souvent en QCM : pourcentages, fractions, calcul littéral, lecture graphique, statistiques, probabilités |
| **2. Exercices** | **14 points** | Deux ou trois exercices indépendants sur le programme de Première du parcours suivi |

> Les automatismes s'appuient sur une liste publiée au Bulletin officiel, qui comprend des notions de **Seconde** : statistiques, proportions et évolutions reviennent même si l'on ne les a pas revues en Première.

## La partie automatismes : vite et juste
1. Viser une **vingtaine de minutes** pour garder l'essentiel du temps aux exercices.
2. Faire d'abord les questions évidentes, marquer les autres et y revenir.
3. **Contrôler la vraisemblance** : un prix après une baisse ne peut pas être plus élevé, une probabilité ne dépasse jamais 1.
4. Dans un QCM, éliminer les réponses impossibles : l'ordre de grandeur suffit souvent.

## La partie exercices : justifier
1. **Lire tout l'énoncé** avant de commencer : les questions s'enchaînent, et la suivante éclaire souvent la précédente.
2. **Rédiger** : le raisonnement compte, pas seulement le résultat.
3. **Ne jamais bloquer** : si une question résiste, on admet son résultat (souvent donné) et on continue.
4. Les exercices sont **indépendants** : on les traite dans l'ordre qu'on veut.

## Calculer sans machine
| Le réflexe | Un exemple |
| Garder les fractions | 1/3 plutôt que 0,333… |
| Décomposer | 25 × 36 = 25 × 4 × 9 = 900 |
| Simplifier avant de calculer | 45 / 120 = 3 / 8 |
| Estimer d'abord | 49 × 21 ≈ 1 000, donc 1 029 est plausible |

## Se préparer toute l'année
- **Dix minutes d'automatismes par jour** valent mieux qu'une révision de dernière minute : ce sont des réflexes, ils s'entretiennent.
- S'entraîner **sans calculatrice** dès le début de l'année.
- Refaire les sujets zéro et les annales, en temps limité.
- Tenir une liste de ses erreurs récurrentes : signes, pourcentages successifs, confusion entre image et antécédent.

> La partie automatismes rapporte ses 6 points à qui s'est entraîné régulièrement : c'est la plus « rentable » de l'épreuve.`,
          },
          questions: [
            ['Combien de temps dure l’épreuve anticipée de mathématiques ?', ['2 heures', '1 heure', '3 heures', '4 heures'], 0, 'Deux heures pour les deux parties.'],
            ['La calculatrice est autorisée pendant la partie exercices.', ['Vrai', 'Faux'], 1, 'Elle est interdite pendant TOUTE l’épreuve.'],
            ['Sur combien de points est notée la partie automatismes ?', ['4', '10', '6', '14'], 2, 'Automatismes 6 points, exercices 14 points.'],
            ['Sur combien de points est notée la partie exercices ?', ['6', '14', '10', '20'], 1, 'Deux ou trois exercices indépendants pour 14 points.'],
            ['Quel est le coefficient de l’épreuve anticipée de mathématiques au baccalauréat ?', ['1', '5', '16', '2'], 3, 'Elle est notée sur 20 avec un coefficient 2.'],
            ['Qui passe l’épreuve anticipée de mathématiques ?', ['Tous les élèves de Première des voies générale et technologique', 'Seulement les élèves de spécialité mathématiques', 'Seulement la voie technologique', 'Seulement les volontaires'], 0, 'Tous les élèves de Première, avec un sujet adapté à leur parcours.'],
            ['Tous les élèves reçoivent exactement le même sujet.', ['Vrai', 'Faux'], 1, 'Le sujet dépend du parcours : spécialité, enseignement de mathématiques sans spécialité, ou voie technologique.'],
            ['Les automatismes peuvent porter sur des notions de Seconde.', ['Vrai', 'Faux'], 0, 'La liste officielle en comprend : statistiques, proportions, évolutions.'],
            ['Que faire quand une question d’exercice résiste ?', ['Abandonner l’exercice', 'Recommencer tout l’exercice', 'Passer à la partie automatismes', 'Admettre son résultat et continuer'], 3, 'Les résultats intermédiaires sont souvent donnés : on s’en sert pour la suite.'],
            ['Un prix après une baisse est calculé plus élevé qu’avant. Que faire ?', ['Le garder', 'Vérifier le calcul : le résultat n’est pas vraisemblable', 'L’arrondir', 'Changer d’unité'], 1, 'Le contrôle de vraisemblance attrape les erreurs de coefficient.'],
            ['Combien d’exercices compte la seconde partie ?', ['Un seul', 'Cinq', 'Deux ou trois', 'Dix'], 2, 'Deux ou trois exercices indépendants.'],
            ['Quelle préparation est la plus efficace pour les automatismes ?', ['Une révision intensive la veille', 'Apprendre les corrigés par cœur', 'S’entraîner uniquement avec la calculatrice', 'Un entraînement court et régulier, sans calculatrice'], 3, 'Ce sont des réflexes : ils s’installent par la répétition, jour après jour.'],
          ],
        },
      ],
    },
  ],
}
