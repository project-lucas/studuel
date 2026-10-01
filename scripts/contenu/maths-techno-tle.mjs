// MATHÉMATIQUES — Tle de la VOIE TECHNOLOGIQUE, tronc commun (STMG, STI2D,
// STL, ST2S, STD2A, STHR, S2TMD).
//
// SOURCE : programme de l'arrêté du 19 juillet 2019 (BO spécial n° 8 du
// 25 juillet 2019), TOUJOURS EN VIGUEUR en 2026-2027. Le programme qui le
// remplace (arrêté du 26 février 2026, BO n° 14 du 2 avril 2026) ne s'applique
// qu'à la rentrée 2027-2028, et il garde les mêmes rubriques (automatismes,
// suites, fonctions exponentielles, logarithme décimal, fonction inverse,
// séries à deux variables, probabilités conditionnelles, variables aléatoires) :
// à relire à ce moment-là.
//
// En Tle technologique, les mathématiques du tronc commun n'ont pas d'épreuve
// écrite terminale : elles comptent au contrôle continu. Pas de fiche « épreuve »
// donc, mais deux fiches d'automatismes (les tirets propres à la terminale y
// sont : suite géométrique reconnue dans une évolution, dérivée d'un polynôme de
// degré ≤ 3, coefficient directeur d'une tangente, signe par l'image mentale
// d'une parabole).
//
// Formules en texte simple (l'app ne rend pas LaTeX) : a^x, log, √, Σ.

export default {
  slug: 'maths-techno',
  nom: 'Mathématiques',

  titreMigration: 'MATHS Tle techno — le programme du tronc commun',

  motif: `Les mathématiques de la voie technologique sont une matière à part : un
élève de Tle STMG, STI2D, STL ou ST2S étudie les fonctions exponentielles de
base a, le logarithme décimal, la fonction inverse et la loi binomiale, pas le
programme de la spécialité de la voie générale. Cette migration installe les
15 fiches du programme de Tle technologique (BO spécial n° 8 du 25 juillet 2019,
en vigueur en 2026-2027) : deux fiches d'automatismes, neuf d'analyse, quatre
de statistique et probabilités.`,

  blocs: [
    {
      niveaux: ['Tle'],
      positionDepart: 1,
      chapitres: [
        // ---- Automatismes -------------------------------------------------
        {
          titre: 'Automatismes : évolutions, indices et taux',
          axe: 'Automatismes',
          lecon: {
            titre: 'Coefficients multiplicateurs et indices base 100',
            cours: `Les automatismes s’entretiennent toute l’année, en questions flash. En terminale technologique, les mathématiques du tronc commun n’ont pas d’épreuve écrite finale : elles comptent au contrôle continu, et ces réflexes servent dans chaque devoir.

## Le coefficient multiplicateur
| Évolution | Coefficient multiplicateur (CM) |
| Hausse de t % | 1 + t/100 |
| Baisse de t % | 1 − t/100 |

= valeur finale = valeur initiale × CM
= taux d’évolution = (valeur finale − valeur initiale) ÷ valeur initiale

| Situation | Ce qu’on fait |
| Évolutions successives | On **multiplie** les CM : + 10 % puis + 10 % donne 1,21, soit + 21 % |
| Évolution réciproque | On prend l’**inverse** du CM : pour annuler + 25 % (× 1,25), × 0,8, soit − 20 % |
| Retrouver la valeur initiale | On **divise** par le CM |

## Les indices base 100
L’indice d’une valeur V par rapport à une valeur de référence V0 est :
= indice = 100 × V ÷ V0

Si un loyer passe de 80 € (base 100 en 2020) à 92 €, son indice vaut 100 × 92 ÷ 80 = **115** : il a augmenté de 15 %.

Entre deux indices, le taux d’évolution se calcule comme entre deux valeurs : de l’indice 120 à l’indice 150, (150 − 120) ÷ 120 = **+ 25 %**, et non + 30 %.

!> Une différence d’indices n’est un pourcentage que si l’on part de l’indice 100.

## Reconnaître une suite géométrique
Une grandeur qui évolue d’un **même pourcentage** à chaque étape se modélise par une suite géométrique dont la **raison** est le coefficient multiplicateur :
| Situation | Raison |
| « augmente de 4 % par an » | 1,04 |
| « perd 4 % par an » | 0,96 |
| « double chaque heure » | 2 |
| « diminue de moitié chaque année » | 0,5 |

> Un pourcentage d’évolution se traduit toujours d’abord en coefficient multiplicateur.

## Exemple travaillé
Le prix d’un abonnement augmente de 10 % en 2024, puis baisse de 10 % en 2025.
1. CM global : 1,1 × 0,9 = 0,99.
2. Évolution globale : **− 1 %** : le prix final est plus bas qu’au départ.
3. Pour revenir au prix de départ en 2026, il faudrait un CM de 1 ÷ 0,99 ≈ 1,0101, soit une hausse d’environ 1,01 %.`,
          },
          questions: [
            ['Une baisse de 4 % par an correspond à une suite géométrique de raison…', ['0,04', '0,96', '1,04', '−0,04'], 1, '1 − 4/100 = 0,96.'],
            ['Un loyer passe de 80 € (indice 100) à 92 €. Quel est son nouvel indice ?', ['112', '92', '115', '120'], 2, '100 × 92 ÷ 80 = 115.'],
            ['Un indice passe de 120 à 150. Quel est le taux d’évolution ?', ['+ 30 %', '+ 20 %', '+ 50 %', '+ 25 %'], 3, '(150 − 120) ÷ 120 = 0,25.'],
            ['Une hausse de 10 % suivie d’une baisse de 10 % équivaut à…', ['Une baisse de 1 %', 'Aucune évolution', 'Une hausse de 1 %', 'Une baisse de 10 %'], 0, '1,1 × 0,9 = 0,99.'],
            ['Quelle évolution annule une hausse de 25 % ?', ['− 25 %', '− 20 %', '− 30 %', '− 75 %'], 1, '1 ÷ 1,25 = 0,8.'],
            ['Après une baisse de 20 %, un article coûte 40 €. Quel était son prix initial ?', ['48 €', '32 €', '50 €', '60 €'], 2, 'Baisser de 20 %, c’est multiplier par 0,8. On remonte au prix initial en divisant : 40 ÷ 0,8 = 50 €.'],
            ['Une grandeur qui double chaque heure se modélise par une suite géométrique de raison…', ['1', '0,5', '100', '2'], 3, 'On multiplie par 2 à chaque étape.'],
            ['Deux hausses successives de 10 % équivalent à une hausse de 21 %.', ['Vrai', 'Faux'], 0, '1,1 × 1,1 = 1,21.'],
            ['Un indice de 85 (base 100) signifie…', ['Une baisse de 15 %', 'Une hausse de 85 %', 'Une baisse de 85 %', 'Une hausse de 15 %'], 0, '85 ÷ 100 = 0,85 = 1 − 0,15.'],
            ['Un prix passe de 200 € à 150 €. Quel est le taux d’évolution ?', ['− 50 %', '− 25 %', '− 33 %', '+ 25 %'], 1, '(150 − 200) ÷ 200 = − 0,25.'],
            ['Une différence d’indices donne toujours directement un pourcentage d’évolution.', ['Vrai', 'Faux'], 1, 'Seulement si l’on part de l’indice 100.'],
            ['Une population diminue de moitié chaque année. La raison de la suite géométrique est…', ['2', '−0,5', '0,5', '50'], 2, 'Diminuer de moitié, c’est multiplier par 0,5.'],
          ],
        },
        {
          titre: 'Automatismes : calcul, dérivée et lectures graphiques',
          axe: 'Automatismes',
          lecon: {
            titre: 'Les réflexes de calcul de la terminale',
            cours: `Aux automatismes de première s’ajoutent en terminale quelques gestes qui doivent devenir immédiats : dériver un polynôme, lire une pente, deviner un signe d’après une parabole.

## Dériver un polynôme de degré au plus 3
| f(x) | f′(x) |
| k | 0 |
| x | 1 |
| x² | 2x |
| x³ | 3x² |

On dérive terme à terme : f(x) = 2x³ − 5x² + 4x − 1 donne **f′(x) = 6x² − 10x + 4**.

## Le coefficient directeur de la tangente
Le coefficient directeur de la tangente au point d’abscisse a est **f′(a)**. Pour f(x) = x³ − 2x en a = 1 : f′(x) = 3x² − 2, donc f′(1) = **1**.

**Graphiquement** : on choisit deux points bien lisibles de la tangente tracée et on calcule (yB − yA) ÷ (xB − xA).

## Le signe par l’image mentale d’une parabole
Pour a(x − x1)(x − x2), on imagine la parabole : ouverte vers le haut si a > 0, vers le bas si a < 0, coupant l’axe en x1 et x2.
| Expression | Image mentale | Négative sur… |
| (x − 1)(x − 3) | Ouverte vers le haut | ]1 ; 3[ |
| −2(x − 1)(x − 3) | Ouverte vers le bas | ]−∞ ; 1[ et ]3 ; +∞[ |

## Factoriser des différences de carrés
= a² − b² = (a − b)(a + b)

x² − 9 = (x − 3)(x + 3) ; 4x² − 25 = (2x − 5)(2x + 5) ; x² − k² = (x − k)(x + k).

## Autres réflexes
- Résoudre ax + b = 0, x² = a (deux solutions si a > 0, aucune si a < 0).
- Isoler une variable : P = U × I donne I = P ÷ U.
- Écriture scientifique : 0,000 32 = 3,2 × 10^(−4).
- Puissances : 10³ × 10^(−5) = 10^(−2) ; (2³)² = 2⁶.

!> Multiplier une inégalité par un nombre négatif en change le sens.

> Le signe de la dérivée donne les variations ; sa valeur en a donne la pente de la tangente.

## Exemple travaillé
f(x) = x³ − 3x² sur les réels.
1. f′(x) = 3x² − 6x = 3x(x − 2).
2. Image mentale : parabole ouverte vers le haut, qui coupe l’axe en 0 et 2 ; f′ est négative sur ]0 ; 2[, positive ailleurs.
3. f est décroissante sur [0 ; 2], croissante ailleurs.
4. Tangente en 1 : f′(1) = 3 − 6 = −3 ; la courbe descend en ce point.`,
          },
          questions: [
            ['Quelle est la dérivée de f(x) = 2x³ − 5x² + 4x − 1 ?', ['6x² − 5x + 4', '2x² − 10x + 4', '6x² − 10x + 4', '6x³ − 10x² + 4x'], 2, 'On dérive terme à terme ; la constante disparaît.'],
            ['Pour f(x) = x³ − 2x, que vaut le coefficient directeur de la tangente en 1 ?', ['−1', '3', '0', '1'], 3, 'f′(x) = 3x² − 2, donc f′(1) = 1.'],
            ['Sur quel intervalle (x − 1)(x − 3) est-elle négative ?', [']1 ; 3[', ']−∞ ; 1[', ']3 ; +∞[', 'Jamais'], 0, 'Parabole ouverte vers le haut : négative entre les racines.'],
            ['−2(x − 1)(x − 3) est positive…', ['Avant 1 et après 3', 'Entre 1 et 3', 'Partout', 'Nulle part'], 1, 'Parabole ouverte vers le bas : positive entre les racines.'],
            ['Quelle est la forme factorisée de 4x² − 25 ?', ['(4x − 5)(4x + 5)', '(2x − 5)²', '(2x − 5)(2x + 5)', '(x − 5)(4x + 5)'], 2, '4x² = (2x)² et 25 = 5².'],
            ['Dans P = U × I, comment exprimer I ?', ['I = P × U', 'I = U ÷ P', 'I = P − U', 'I = P ÷ U'], 3, 'On divise les deux membres par U.'],
            ['Quelle est l’écriture scientifique de 0,000 32 ?', ['3,2 × 10^(−4)', '32 × 10^(−5)', '3,2 × 10⁴', '0,32 × 10^(−3)'], 0, 'Il faut 1 ≤ a < 10.'],
            ['Une tangente passe par les points (1 ; 2) et (3 ; −2). Quel est son coefficient directeur ?', ['2', '−2', '−4', '1/2'], 1, '(−2 − 2) ÷ (3 − 1) = −2.'],
            ['Pour f(x) = x³ − 3x², f′(x) = 3x(x − 2).', ['Vrai', 'Faux'], 0, '3x² − 6x = 3x(x − 2).'],
            ['Combien vaut (2³)² ?', ['2⁵', '2⁹', '2⁶', '4⁵'], 2, 'On multiplie les exposants.'],
            ['Quelles sont les solutions de x² = 49 ?', ['7', '24,5', 'Aucune', '−7 et 7'], 3, 'Deux solutions opposées pour un nombre positif.'],
            ['Si f′(a) > 0, la tangente à la courbe en a est horizontale.', ['Vrai', 'Faux'], 1, 'Elle monte ; elle est horizontale quand f′(a) = 0.'],
          ],
        },
        // ---- Analyse : suites ----------------------------------------------
        {
          titre: 'Suites arithmétiques : terme général et somme',
          axe: 'Analyse',
          lecon: {
            titre: 'Le terme de rang n et la somme des termes',
            cours: `Une suite arithmétique ajoute toujours la même quantité, la **raison r**. En terminale, on sait calculer n’importe quel terme directement, et additionner des termes consécutifs sans les écrire tous.

## Le terme général
= u(n) = u(0) + n × r
= u(n) = u(1) + (n − 1) × r

Exemple : u(0) = 12 et r = −1,5 donne u(8) = 12 − 12 = **0**.

## Trois nombres consécutifs
a, b, c sont trois termes consécutifs d’une suite arithmétique si et seulement si b − a = c − b, c’est-à-dire si b est la **moyenne arithmétique** de a et c :
= b = (a + c) ÷ 2

5 ; 8 ; 11 conviennent car (5 + 11) ÷ 2 = 8. En revanche 2 ; 5 ; 9 ne conviennent pas : les écarts 3 et 4 sont différents.

## La somme des termes consécutifs
= somme = nombre de termes × (premier terme + dernier terme) ÷ 2

| Somme | Nombre de termes | Calcul | Résultat |
| 1 + 2 + … + 100 | 100 | 100 × 101 ÷ 2 | 5 050 |
| u(0) + … + u(9) avec u(n) = 3 + 2n | 10 | 10 × (3 + 21) ÷ 2 | 120 |

En particulier : **1 + 2 + … + n = n(n + 1) ÷ 2**.

!> Le nombre de termes de u(0) à u(n) est n + 1, pas n : on compte le terme de rang 0.

## La notation Σ
La somme u(0) + u(1) + … + u(n) s’écrit **Σ u(k)** pour k allant de 0 à n. Σ (la lettre grecque sigma majuscule) se lit « somme ». Exemple : Σ k pour k de 1 à 4 = 1 + 2 + 3 + 4 = 10.

## Croissance linéaire
Une suite arithmétique modélise une **croissance linéaire** : ses points (n ; u(n)) sont alignés. C’est le modèle des **intérêts simples** : 1 000 € placés à 3 % d’intérêts simples rapportent 30 € chaque année, et la valeur acquise après n années est u(n) = 1 000 + 30n.

> Somme de termes arithmétiques : on apparie le premier et le dernier, le deuxième et l’avant-dernier… chaque paire a la même valeur.

## Exemple travaillé
Un club compte 40 adhérents la première année et en gagne 6 chaque année. Combien d’adhésions au total sur 10 ans ?
1. u(1) = 40, r = 6, donc u(10) = 40 + 9 × 6 = 94.
2. Somme de 10 termes : 10 × (40 + 94) ÷ 2 = **670** adhésions.`,
          },
          questions: [
            ['u(0) = 12 et r = −1,5. Combien vaut u(8) ?', ['24', '−12', '10,5', '0'], 3, '12 + 8 × (−1,5) = 0.'],
            ['5 ; 8 ; 11 sont-ils trois termes consécutifs d’une suite arithmétique ?', ['Oui, car 8 est la moyenne de 5 et 11', 'Non, car 8 ≠ 5 × 11', 'Non, car 11 n’est pas pair', 'On ne peut pas savoir'], 0, '(5 + 11) ÷ 2 = 8.'],
            ['Combien vaut 1 + 2 + … + 100 ?', ['5 000', '5 050', '10 100', '100'], 1, '100 × 101 ÷ 2 = 5 050.'],
            ['Combien de termes compte la somme u(0) + u(1) + … + u(20) ?', ['20', '19', '21', '22'], 2, 'On compte le terme de rang 0.'],
            ['u(n) = 3 + 2n. Combien vaut u(0) + u(1) + … + u(9) ?', ['210', '105', '240', '120'], 3, '10 termes, de 3 à 21 : 10 × 24 ÷ 2 = 120.'],
            ['Que vaut Σ k pour k allant de 1 à 4 ?', ['10', '4', '24', '16'], 0, '1 + 2 + 3 + 4 = 10.'],
            ['2 ; 5 ; 9 sont trois termes consécutifs d’une suite arithmétique.', ['Vrai', 'Faux'], 1, 'Les écarts 3 et 4 sont différents.'],
            ['La moyenne arithmétique de 6 et 14 est…', ['8', '10', '20', '84'], 1, '(6 + 14) ÷ 2 = 10.'],
            ['Quelle formule donne 1 + 2 + … + n ?', ['n²', 'n(n − 1)', 'n(n + 1) ÷ 2', '2n + 1'], 2, 'On apparie les termes deux à deux.'],
            ['Des intérêts simples se modélisent par une suite…', ['Géométrique', 'Constante', 'Ni l’une ni l’autre', 'Arithmétique'], 3, 'On ajoute chaque année le même montant d’intérêts.'],
            ['u(1) = 40 et r = 6. Combien vaut u(10) ?', ['94', '100', '46', '240'], 0, 'u(10) = 40 + 9 × 6 = 94.'],
            ['Les points représentant une suite arithmétique sont alignés.', ['Vrai', 'Faux'], 0, 'C’est la croissance linéaire.'],
          ],
        },
        {
          titre: 'Suites géométriques : terme général et somme',
          axe: 'Analyse',
          lecon: {
            titre: 'Le terme de rang n et la somme des termes',
            cours: `Une suite géométrique multiplie toujours par le même nombre, la **raison q** (ici q > 0, termes positifs). Elle modélise les évolutions à **pourcentage constant** : c’est la croissance exponentielle.

## Le terme général
= u(n) = u(0) × q^n
= u(n) = u(1) × q^(n − 1)

Exemple : un capital de 2 000 € placé à 5 % par an vaut, au bout de n années, u(n) = 2 000 × 1,05^n.

## Trois nombres consécutifs
a, b, c (positifs) sont trois termes consécutifs d’une suite géométrique si et seulement si b ÷ a = c ÷ b, c’est-à-dire b² = a × c. b est alors la **moyenne géométrique** de a et c :
= b = √(a × c)

4 ; 6 ; 9 conviennent : 6² = 36 = 4 × 9. La moyenne géométrique de 2 et 8 est √16 = **4** (leur moyenne arithmétique est 5).

## La somme des termes consécutifs
Pour q ≠ 1 :
= 1 + q + q² + … + q^n = (1 − q^(n+1)) ÷ (1 − q)

Plus généralement :
= somme = premier terme × (1 − q^(nombre de termes)) ÷ (1 − q)

| Somme | Calcul | Résultat |
| 1 + 2 + 4 + … + 2⁹ (10 termes) | (1 − 2¹⁰) ÷ (1 − 2) | 1 023 |
| 3 + 6 + 12 + 24 (4 termes) | 3 × (1 − 2⁴) ÷ (1 − 2) | 45 |
| 1 + 0,5 + 0,25 + 0,125 | (1 − 0,5⁴) ÷ (1 − 0,5) | 1,875 |

!> L’exposant du numérateur est le **nombre de termes**, pas le rang du dernier.

## Le sens de variation
| q | La suite (termes positifs) |
| q > 1 | Croissante |
| 0 < q < 1 | Décroissante |
| q = 1 | Constante |

## Linéaire ou exponentielle ?
| | Arithmétique | Géométrique |
| On passe au suivant en | ajoutant r | multipliant par q |
| Évolution | absolue constante | relative constante |
| Langage courant | croissance linéaire | croissance exponentielle |

> Géométrique : chaque terme se calcule en multipliant ; une somme de termes se calcule d’un seul coup.

## Exemple travaillé
Une influenceuse gagne 500 abonnés la première semaine, puis 20 % de plus chaque semaine que la précédente. Combien d’abonnés gagnés en 4 semaines ?
1. Gains hebdomadaires : suite géométrique, premier terme 500, raison 1,2.
2. Somme de 4 termes : 500 × (1 − 1,2⁴) ÷ (1 − 1,2).
3. 1,2⁴ = 2,0736, donc 500 × (−1,0736) ÷ (−0,2) = **2 684** abonnés.
Vérification terme à terme : 500 + 600 + 720 + 864 = 2 684.`,
          },
          questions: [
            ['u(0) = 2 000 et q = 1,05. Quelle est l’expression de u(n) ?', ['2 000 × 1,05^n', '2 000 + 1,05n', '2 000 × 0,05^n', '1,05 × 2 000n'], 0, 'u(n) = u(0) × q^n.'],
            ['4 ; 6 ; 9 sont trois termes consécutifs d’une suite géométrique.', ['Vrai', 'Faux'], 0, '6² = 36 = 4 × 9 : la raison est 1,5.'],
            ['Quelle est la moyenne géométrique de 2 et 8 ?', ['5', '4', '16', '10'], 1, '√(2 × 8) = √16 = 4.'],
            ['Combien vaut 1 + 2 + 4 + … + 2⁹ ?', ['512', '1 024', '1 023', '2 047'], 2, '(1 − 2¹⁰) ÷ (1 − 2) = 1 023.'],
            ['Combien vaut 3 + 6 + 12 + 24 ?', ['48', '42', '90', '45'], 3, '3 × (1 − 2⁴) ÷ (1 − 2) = 3 × 15.'],
            ['Dans la formule de la somme, l’exposant de q au numérateur est…', ['Le nombre de termes', 'Le rang du dernier terme', 'Toujours n', 'La raison'], 0, 'C’est l’erreur la plus fréquente.'],
            ['Une suite géométrique de raison 0,9 (termes positifs) est…', ['Croissante', 'Décroissante', 'Constante', 'Arithmétique'], 1, 'Chaque terme vaut 0,9 fois le précédent : avec 0 < q < 1 et des termes positifs, la suite décroît.'],
            ['Combien vaut 1 + 0,5 + 0,25 + 0,125 ?', ['1,75', '2', '1,875', '0,875'], 2, '(1 − 0,5⁴) ÷ 0,5 = 0,9375 ÷ 0,5.'],
            ['Pour q ≠ 1, 1 + q + … + q^n = …', ['(1 − q^n) ÷ (1 − q)', 'n × q', '(q^n − 1) ÷ n', '(1 − q^(n+1)) ÷ (1 − q)'], 3, 'Il y a n + 1 termes de q⁰ à q^n.'],
            ['Une évolution de + 20 % par semaine se modélise par une suite géométrique de raison…', ['1,2', '0,2', '20', '0,8'], 0, 'Augmenter de 20 %, c’est multiplier par 1 + 20/100 = 1,2 : c’est la raison de la suite.'],
            ['u(1) = 5 et q = 3. Combien vaut u(4) ?', ['60', '135', '405', '45'], 1, 'u(4) = 5 × 3³ = 135.'],
            ['Une suite géométrique modélise une croissance linéaire.', ['Vrai', 'Faux'], 1, 'Elle modélise une croissance exponentielle ; la croissance linéaire est arithmétique.'],
          ],
        },
        {
          titre: 'Placements, versements réguliers et sommes',
          axe: 'Analyse',
          lecon: {
            titre: 'Épargner chaque année : une somme géométrique',
            cours: `Placer 1 000 € une seule fois ou verser 1 000 € chaque année : dans le second cas, chaque versement rapporte des intérêts pendant une durée différente. Le calcul de la valeur acquise devient une **somme de termes d’une suite géométrique**.

## Intérêts simples, intérêts composés
| | Intérêts simples | Intérêts composés |
| Les intérêts sont calculés sur | Le capital de départ seulement | Le capital augmenté des intérêts déjà gagnés |
| Modèle | Suite arithmétique | Suite géométrique |
| 1 000 € à 5 % pendant 2 ans | 1 100 € | 1 000 × 1,05² = 1 102,50 € |

## Les versements réguliers
On verse V euros au début de chaque année sur un placement à t % par an (intérêts composés). Juste après le n-ième versement :
- le dernier versement vaut V ;
- l’avant-dernier vaut V × (1 + t) ;
- … le premier vaut V × (1 + t)^(n − 1).

= valeur acquise = V × (1 + (1 + t) + … + (1 + t)^(n−1)) = V × ((1 + t)^n − 1) ÷ t

(t écrit en décimal : 5 % donne t = 0,05.)

## Exemple travaillé
1 000 € versés chaque 1er janvier à 5 % par an. Valeur juste après le 3e versement :
1. Premier versement : 1 000 × 1,05² = 1 102,50.
2. Deuxième : 1 000 × 1,05 = 1 050.
3. Troisième : 1 000.
4. Total : **3 152,50 €**. Avec la formule : 1 000 × (1,05³ − 1) ÷ 0,05 = 1 000 × 0,157625 ÷ 0,05 = 3 152,50.

## La notation Σ sur d’autres sommes
Le programme fait aussi calculer des sommes qui ne sont ni arithmétiques ni géométriques :
| Somme | Écriture | Valeur pour n = 4 |
| Des carrés | Σ k² pour k de 1 à n | 1 + 4 + 9 + 16 = 30 |
| Des cubes | Σ k³ pour k de 1 à n | 1 + 8 + 27 + 64 = 100 |
| Des inverses | Σ 1/k pour k de 1 à n | 1 + 1/2 + 1/3 + 1/4 = 25/12 |

## En Python : l’accumulateur
Une fonction qui renvoie la somme des n premiers carrés :

\`\`\`python
def somme_carres(n):
    s = 0
    for k in range(1, n + 1):
        s = s + pow(k, 2)
    return s
\`\`\`

| Élément de l’algorithme | Son rôle dans Σ |
| s = 0 | L’**initialisation** de l’accumulateur |
| k | Le **compteur**, l’indice de la somme |
| s = s + pow(k, 2) | On **accumule** chaque terme |
| range(1, n + 1) | Les bornes : k va de 1 à n |

!> range(1, n + 1) s’arrête à n : la borne de droite est exclue.

> Versements réguliers : chaque versement est un terme d’une suite géométrique ; la valeur acquise est leur somme.`,
          },
          questions: [
            ['1 000 € placés à 5 % d’intérêts composés pendant 2 ans deviennent…', ['1 100 €', '1 102,50 €', '1 105 €', '1 050 €'], 1, '1 000 × 1,05² = 1 102,50.'],
            ['Des intérêts simples se modélisent par une suite…', ['Géométrique', 'Décroissante', 'Arithmétique', 'Constante'], 2, 'On ajoute chaque année le même montant.'],
            ['1 000 € versés chaque année à 5 % : valeur juste après le 3e versement ?', ['3 000 €', '3 150 €', '3 310,13 €', '3 152,50 €'], 3, '1 102,50 + 1 050 + 1 000.'],
            ['Avec des versements réguliers, le premier versement a rapporté des intérêts…', ['Pendant la plus longue durée', 'Pendant la plus courte durée', 'Pendant la même durée que les autres', 'Jamais'], 0, 'Il est placé depuis le plus longtemps.'],
            ['Que vaut Σ k² pour k allant de 1 à 4 ?', ['10', '30', '16', '100'], 1, '1 + 4 + 9 + 16 = 30.'],
            ['Que vaut Σ k³ pour k allant de 1 à 4 ?', ['64', '30', '100', '256'], 2, '1 + 8 + 27 + 64 = 100.'],
            ['Que vaut 1 + 1/2 + 1/3 + 1/4 ?', ['4/10', '1', '10/24', '25/12'], 3, '12/12 + 6/12 + 4/12 + 3/12 = 25/12.'],
            ['Dans une fonction Python qui calcule une somme, s = 0 est…', ['L’initialisation de l’accumulateur', 'Le compteur', 'La condition d’arrêt', 'Le résultat final'], 0, 'On part de 0 avant d’ajouter les termes.'],
            ['range(1, n + 1) fait prendre à k les valeurs…', ['0 à n', '1 à n', '1 à n + 1', '0 à n + 1'], 1, 'La borne de droite est exclue.'],
            ['La valeur acquise par des versements réguliers est la somme de termes d’une suite géométrique.', ['Vrai', 'Faux'], 0, 'Chaque versement a été multiplié par (1 + t) un nombre différent de fois.'],
            ['Quelle formule donne la valeur acquise après n versements annuels V à t % ?', ['V × n × t', 'V × (1 + t)^n', 'V × ((1 + t)^n − 1) ÷ t', 'V × n'], 2, 'C’est la somme géométrique de raison 1 + t.'],
            ['Dans s = s + pow(k, 2), que fait l’instruction ?', ['Elle remet s à 0', 'Elle calcule k puissance s', 'Elle arrête la boucle', 'Elle ajoute le carré de k à la somme'], 3, 'C’est le principe de l’accumulateur.'],
          ],
        },
        // ---- Analyse : fonctions exponentielles et logarithme -------------
        {
          titre: 'Les fonctions exponentielles de base a',
          axe: 'Analyse',
          lecon: {
            titre: 'Prolonger une suite géométrique au temps continu',
            cours: `Une suite géométrique u(n) = q^n ne dit rien entre deux années. Or une population croît aussi au bout de six mois. La fonction **x ↦ a^x** prolonge la suite géométrique à tous les réels : elle modélise une **évolution relative constante en continu**.

## Définition (a > 0)
Pour les entiers, a^n est déjà connu. On prolonge à tous les réels x la fonction **f(x) = a^x**, avec :
- a⁰ = 1 et a¹ = a ;
- a^(−x) = 1 ÷ a^x ;
- a^(1/2) = √a (car a^(1/2) × a^(1/2) = a¹).

a^x est **toujours strictement positif**, et la courbe passe par le point **(0 ; 1)**.

## Les propriétés algébriques
Les règles des puissances entières restent vraies :
| Propriété | Exemple |
| a^(x + y) = a^x × a^y | 2^(1,5) × 2^(0,5) = 2² = 4 |
| a^(x − y) = a^x ÷ a^y | 10^(2,5) ÷ 10^(0,5) = 10² |
| a^(−x) = 1 ÷ a^x | 4^(−1/2) = 1 ÷ 2 = 0,5 |
| (a^x)^n = a^(nx) | (1,1^x)² = 1,21^x |

## Le sens de variation
| a | x ↦ a^x est |
| a > 1 | Strictement croissante |
| 0 < a < 1 | Strictement décroissante |
| a = 1 | Constante (égale à 1) |

Pour **f(x) = k × a^x** :
| k | Sens de variation |
| k > 0 | Le même que a^x |
| k < 0 | Le contraire de a^x |

Exemple : f(x) = −3 × 0,8^x. Ici 0,8^x est décroissante et k = −3 < 0, donc f est **croissante**.

## Le lien avec les suites géométriques
| Suite géométrique | Fonction exponentielle |
| u(n) = u(0) × q^n | f(x) = k × a^x |
| n entier | x réel |
| Croissante si q > 1 | Croissante si a > 1 (k > 0) |

!> a^x n’est pas une fonction puissance : dans a^x, c’est l’exposant qui varie ; dans x², c’est la base.

> Une grandeur qui augmente de t % par unité de temps se modélise par k × (1 + t/100)^x.

## Exemple travaillé
Une culture compte 500 bactéries à t = 0 et augmente de 40 % par heure. On modélise N(t) = 500 × 1,4^t.
1. Au bout de 2 h : 500 × 1,96 = **980** bactéries.
2. Au bout de 30 min : 500 × 1,4^(0,5) = 500 × √1,4 ≈ 592 bactéries — ce que la suite ne donnait pas.
3. 1,4 > 1 et k > 0 : N est croissante.`,
          },
          questions: [
            ['Combien vaut a⁰ pour tout a > 0 ?', ['0', 'a', '1', 'Cela dépend de a'], 2, 'La courbe de x ↦ a^x passe toujours par (0 ; 1).'],
            ['Combien vaut 2^(1,5) × 2^(0,5) ?', ['2', '2^(0,75)', '3', '4'], 3, 'On additionne les exposants : 2² = 4.'],
            ['Combien vaut 4^(−1/2) ?', ['0,5', '−2', '2', '−0,5'], 0, '4^(1/2) = 2, donc 4^(−1/2) = 1 ÷ 2.'],
            ['La fonction x ↦ 0,7^x est…', ['Strictement croissante', 'Strictement décroissante', 'Constante', 'Négative'], 1, 'Une fonction x ↦ aˣ est strictement décroissante quand 0 < a < 1 : ici a = 0,7.'],
            ['La fonction f(x) = −3 × 0,8^x est…', ['Décroissante', 'Constante', 'Croissante', 'Positive'], 2, 'k < 0 inverse le sens de 0,8^x, qui est décroissante.'],
            ['a^x peut prendre des valeurs négatives.', ['Vrai', 'Faux'], 1, 'Pour a > 0, a^x est toujours strictement positif.'],
            ['Combien vaut a^(1/2) ?', ['a ÷ 2', 'a²', '2a', '√a'], 3, 'Car a^(1/2) × a^(1/2) = a.'],
            ['(1,1^x)² est égal à…', ['1,21^x', '1,1^(x+2)', '2,2^x', '1,1^(2+x)'], 0, '(a^x)² = a^(2x) = (a²)^x et 1,1² = 1,21.'],
            ['Une grandeur augmente de 40 % par heure. Quelle fonction la modélise (N0 au départ) ?', ['N0 + 0,4t', 'N0 × 1,4^t', 'N0 × 0,4^t', 'N0 × 40^t'], 1, 'Coefficient multiplicateur 1 + 40/100 = 1,4.'],
            ['N(t) = 500 × 1,4^t. Combien vaut N(2) ?', ['700', '1 400', '980', '1 960'], 2, '1,4² = 1,96 et 500 × 1,96 = 980.'],
            ['Quelle est la différence entre a^x et x² ?', ['Aucune', 'a^x est toujours plus petit', 'x² est toujours décroissante', 'Dans a^x c’est l’exposant qui varie, dans x² c’est la base'], 3, 'Ne pas confondre fonction exponentielle et fonction puissance.'],
            ['La fonction x ↦ a^x prolonge aux réels…', ['Une suite géométrique', 'Une suite arithmétique', 'La fonction carré', 'Une droite'], 0, 'Pour x entier, a^x est le terme d’une suite géométrique de raison a.'],
          ],
        },
        {
          titre: 'Le taux d’évolution moyen',
          axe: 'Analyse',
          lecon: {
            titre: 'Une seule évolution qui en remplace plusieurs',
            cours: `Un prix a augmenté de 21 % en deux ans. Combien par an « en moyenne » ? Pas 10,5 % : le taux moyen se calcule avec une **racine**, c’est-à-dire l’exposant **1/n**.

## Le principe
Le **taux d’évolution moyen** est le taux unique qui, appliqué n fois de suite, donne la même évolution globale.

Si le coefficient multiplicateur global est C sur n périodes, le coefficient moyen c vérifie c^n = C, donc :
= c = C^(1/n)
= taux moyen = C^(1/n) − 1

## La méthode
1. Calculer le **coefficient multiplicateur global** C (en multipliant les CM, ou valeur finale ÷ valeur initiale).
2. Calculer **C^(1/n)**.
3. Retrancher 1 et écrire en pourcentage.

## Exemples
| Évolution globale | n | C | C^(1/n) | Taux moyen |
| + 21 % | 2 ans | 1,21 | 1,1 | + 10 % par an |
| + 44 % | 2 ans | 1,44 | 1,2 | + 20 % par an |
| − 19 % | 2 ans | 0,81 | 0,9 | − 10 % par an |
| + 33,1 % | 3 ans | 1,331 | 1,1 | + 10 % par an |

Vérification de la première ligne : 1,1 × 1,1 = 1,21.

!> La moyenne des pourcentages n’est pas le taux moyen : + 30 % puis + 10 % donnent 1,3 × 1,1 = 1,43, et le taux moyen est 1,43^(1/2) − 1 ≈ 19,6 %, pas 20 %.

## Taux mensuel équivalent à un taux annuel
Un placement rapporte 12 % par an. Le taux mensuel équivalent est le taux t tel que (1 + t)^12 = 1,12 :
= 1 + t = 1,12^(1/12) ≈ 1,0095
Soit environ **0,95 % par mois** — un peu moins que 12 ÷ 12 = 1 %, car les intérêts mensuels se capitalisent.

## Quand l’utiliser
- Évolution moyenne d’une population sur une décennie.
- Croissance annuelle moyenne d’un chiffre d’affaires.
- Taux mensuel équivalent d’un crédit.

> Taux moyen : on raisonne sur les coefficients multiplicateurs, et on prend la racine n-ième du coefficient global.

## Exemple travaillé
Une ville passe de 50 000 à 60 500 habitants en 2 ans.
1. C = 60 500 ÷ 50 000 = 1,21.
2. C^(1/2) = √1,21 = 1,1.
3. Taux moyen : **+ 10 % par an**. Contrôle : 50 000 → 55 000 → 60 500.`,
          },
          questions: [
            ['Un prix augmente de 21 % en 2 ans. Quel est le taux d’évolution annuel moyen ?', ['+ 10,5 %', '+ 11 %', '+ 21 %', '+ 10 %'], 3, '1,21^(1/2) = 1,1.'],
            ['Une grandeur augmente de 44 % en 2 ans. Taux annuel moyen ?', ['+ 20 %', '+ 22 %', '+ 12 %', '+ 44 %'], 0, 'Le coefficient global est 1,44. Sur deux ans, le coefficient annuel est sa racine carrée : √1,44 = 1,2, soit + 20 % par an.'],
            ['Une grandeur baisse de 19 % en 2 ans. Taux annuel moyen ?', ['− 9,5 %', '− 10 %', '− 19 %', '− 81 %'], 1, 'Le coefficient global est 0,81. Le coefficient annuel est sa racine carrée : √0,81 = 0,9, soit − 10 % par an.'],
            ['Une population augmente de 33,1 % en 3 ans. Taux annuel moyen ?', ['+ 11 %', '+ 33,1 %', '+ 10 %', '+ 9 %'], 2, '1,331^(1/3) = 1,1 car 1,1³ = 1,331.'],
            ['Le coefficient multiplicateur moyen sur n périodes est…', ['C ÷ n', 'C^n', 'C − n', 'C^(1/n)'], 3, 'On cherche c tel que c^n = C.'],
            ['Le taux moyen de deux évolutions est la moyenne de leurs pourcentages.', ['Vrai', 'Faux'], 1, 'On raisonne sur les coefficients multiplicateurs et on prend la racine.'],
            ['+ 30 % puis + 10 % : quel est le coefficient multiplicateur global ?', ['1,43', '1,4', '1,3', '0,43'], 0, '1,3 × 1,1 = 1,43.'],
            ['Un placement rapporte 12 % par an. Le taux mensuel équivalent est…', ['Exactement 1 %', 'Un peu moins de 1 %', 'Un peu plus de 1 %', '12 %'], 1, '1,12^(1/12) ≈ 1,0095, soit environ 0,95 %.'],
            ['Une ville passe de 50 000 à 60 500 habitants en 2 ans. Taux annuel moyen ?', ['+ 10,5 %', '+ 21 %', '+ 10 %', '+ 5 %'], 2, 'C = 1,21 et √1,21 = 1,1.'],
            ['Quelle est la première étape du calcul d’un taux moyen ?', ['Additionner les pourcentages', 'Diviser par le nombre de périodes', 'Calculer un logarithme', 'Calculer le coefficient multiplicateur global'], 3, 'Tout le calcul repose sur le coefficient global.'],
            ['Combien vaut 1,21^(1/2) ?', ['1,1', '1,105', '0,605', '1,2'], 0, 'Car 1,1² = 1,21.'],
            ['Appliquer n fois le taux moyen redonne l’évolution globale.', ['Vrai', 'Faux'], 0, 'C’est sa définition : c^n = C.'],
          ],
        },
        {
          titre: 'La fonction logarithme décimal',
          axe: 'Analyse',
          lecon: {
            titre: 'L’exposant qu’il faut donner à 10',
            cours: `Combien de fois faut-il multiplier 10 par lui-même pour obtenir 1 000 ? Trois fois : 10³ = 1 000. Le **logarithme décimal** répond à la même question pour n’importe quel nombre positif, même quand la réponse n’est pas entière.

## Définition
Pour b > 0, **log(b)** est l’unique nombre x tel que **10^x = b**.
= 10^x = b équivaut à x = log(b)

| b | 0,001 | 0,1 | 1 | 10 | 100 | 1 000 |
| log(b) | −3 | −1 | 0 | 1 | 2 | 3 |

- log(10^n) = n et 10^(log(b)) = b.
- log(1) = 0 et log(10) = 1.
- log(b) n’existe que pour **b > 0**.

## Le sens de variation
La fonction log est **strictement croissante** sur ]0 ; +∞[ :
| b | log(b) |
| 0 < b < 1 | Négatif |
| b = 1 | Nul |
| b > 1 | Positif |

Et a < b équivaut à log(a) < log(b) : le logarithme **conserve l’ordre**.

## Les propriétés algébriques
Pour a > 0, b > 0 et n entier naturel :
| Propriété | Exemple |
| log(a × b) = log(a) + log(b) | log(2) + log(5) = log(10) = 1 |
| log(a ÷ b) = log(a) − log(b) | log(200) − log(2) = log(100) = 2 |
| log(1 ÷ b) = −log(b) | log(0,5) = −log(2) |
| log(a^n) = n × log(a) | log(8) = 3 log(2) ≈ 0,903 |

!> log(a + b) n’est pas log(a) + log(b) : le logarithme transforme les **produits** en sommes, pas les sommes.

## Ordre de grandeur et nombre de chiffres
Un entier N a **k chiffres** si 10^(k−1) ≤ N < 10^k, c’est-à-dire si k − 1 ≤ log(N) < k.
Exemple : log(2^100) = 100 × log(2) ≈ 30,1 : 2^100 s’écrit avec **31 chiffres**.

## Des échelles logarithmiques
Le logarithme décimal sert à mesurer des grandeurs qui varient énormément :
| Grandeur | Définition |
| pH d’une solution | pH = −log[H₃O⁺] : une solution 10 fois plus acide perd 1 point de pH |
| Niveau sonore | Il s’exprime en décibels, avec un logarithme du rapport des intensités |

On utilise aussi des **repères semi-logarithmiques** : une suite géométrique y apparaît alignée.

> log(b) répond à la question : « 10 puissance combien donne b ? »

## Exemple travaillé
Sachant log(2) ≈ 0,301, calculer log(20) et log(0,25).
1. log(20) = log(2 × 10) = log(2) + 1 ≈ **1,301**.
2. log(0,25) = log(1 ÷ 4) = −log(2²) = −2 log(2) ≈ **−0,602**.`,
          },
          questions: [
            ['Combien vaut log(1 000) ?', ['3', '2', '100', '10'], 0, 'log(1 000) est la puissance de 10 qui donne 1 000 : 10³ = 1 000, donc log(1 000) = 3.'],
            ['Combien vaut log(0,001) ?', ['3', '−3', '0,001', '−1 000'], 1, '10^(−3) = 0,001.'],
            ['Combien vaut log(2) + log(5) ?', ['log(7)', '10', '1', '0,7'], 2, 'log(2 × 5) = log(10) = 1.'],
            ['Sachant log(2) ≈ 0,301, combien vaut log(8) ?', ['2,408', '0,602', '3,301', '0,903'], 3, 'log(2³) = 3 log(2).'],
            ['Pour 0 < b < 1, log(b) est…', ['Négatif', 'Positif', 'Nul', 'Non défini'], 0, 'La fonction est croissante et log(1) = 0.'],
            ['log(−5) existe.', ['Vrai', 'Faux'], 1, 'Le logarithme n’est défini que pour les nombres strictement positifs.'],
            ['Combien vaut log(200) − log(2) ?', ['log(198)', '2', '100', '1'], 1, 'log(200 ÷ 2) = log(100) = 2.'],
            ['log(2^100) ≈ 30,1. Combien de chiffres compte 2^100 ?', ['30', '100', '31', '301'], 2, 'k − 1 ≤ 30,1 < k donne k = 31.'],
            ['Combien vaut 10^(log(7)) ?', ['70', 'log(70)', '1', '7'], 3, 'Par définition, log(7) est l’exposant qui donne 7.'],
            ['log(a + b) = log(a) + log(b) pour tous a, b > 0.', ['Vrai', 'Faux'], 1, 'C’est le logarithme d’un PRODUIT qui est une somme.'],
            ['Sachant log(2) ≈ 0,301, combien vaut log(20) ?', ['1,301', '0,602', '3,01', '2,301'], 0, 'log(2 × 10) = log(2) + 1.'],
            ['Une solution 10 fois plus acide voit son pH…', ['Augmenter de 1', 'Diminuer de 1', 'Diviser par 10', 'Rester le même'], 1, 'pH = −log[H₃O⁺] : multiplier la concentration par 10 retire 1.'],
          ],
        },
        {
          titre: 'Résoudre une équation avec le logarithme décimal',
          axe: 'Analyse',
          lecon: {
            titre: 'Trouver une durée ou un taux inconnus',
            cours: `« Au bout de combien d’années mon capital aura-t-il doublé ? » L’inconnue est dans l’**exposant** : le logarithme décimal permet de la faire descendre.

## Équations du type a^x = b (a > 0, b > 0)
On prend le logarithme des deux membres :
= a^x = b équivaut à x × log(a) = log(b), soit x = log(b) ÷ log(a) (si a ≠ 1)

Exemple : 2^x = 10 donne x = log(10) ÷ log(2) = 1 ÷ 0,301 ≈ **3,32**.

## Équations du type x^a = b (x > 0)
Ici l’inconnue est la **base** : on élève à la puissance 1/a.
= x^a = b équivaut à x = b^(1/a)

Exemples : x³ = 27 donne x = 27^(1/3) = **3** ; x⁴ = 16 donne x = 2. C’est ainsi qu’on retrouve un **taux moyen** : (1 + t)⁵ = 1,5 donne 1 + t = 1,5^(1/5).

## Inéquations a^n < b, d’inconnue n entière
On prend le logarithme (qui conserve l’ordre), puis on divise par log(a).

!> Si 0 < a < 1, alors log(a) < 0 : diviser par log(a) **change le sens** de l’inégalité.

| Inéquation | Calcul | Résultat |
| 1,05^n ≥ 2 | n × log(1,05) ≥ log(2), log(1,05) > 0 | n ≥ 14,2…, donc n = 15 |
| 0,8^n < 0,1 | n × log(0,8) < −1, log(0,8) < 0 | n > 10,3…, donc n = 11 |

Vérification de la seconde : 0,8^10 ≈ 0,107 et 0,8^11 ≈ 0,086.

## La méthode
1. Isoler la puissance : a^x = b (diviser par le capital de départ, par exemple).
2. Prendre le logarithme des deux membres.
3. Faire descendre l’exposant : log(a^x) = x × log(a).
4. Diviser par log(a) en surveillant son **signe**.
5. Pour un nombre d’années, prendre le **premier entier** qui convient et conclure par une phrase.

> Inconnue dans l’exposant : logarithme. Inconnue dans la base : exposant 1/a.

## Exemple travaillé
Un capital de 3 000 € est placé à 5 % par an. En combien d’années dépasse-t-il 6 000 € ?
1. 3 000 × 1,05^n ≥ 6 000, soit 1,05^n ≥ 2.
2. n × log(1,05) ≥ log(2).
3. log(1,05) > 0, donc n ≥ log(2) ÷ log(1,05) ≈ 0,3010 ÷ 0,0212 ≈ 14,2.
4. Le capital double au bout de **15 ans**.`,
          },
          questions: [
            ['Quelle est la solution de 2^x = 10 ?', ['x = 5', 'x = 1 ÷ log(2) ≈ 3,32', 'x = log(2) ÷ log(10)', 'x = 10 ÷ 2'], 1, 'x = log(10) ÷ log(2) = 1 ÷ log(2).'],
            ['Quelle est la solution positive de x³ = 27 ?', ['9', '81', '3', '27^3'], 2, 'x = 27^(1/3) = 3.'],
            ['Pour résoudre a^x = b, on commence par…', ['Diviser par a', 'Élever au carré', 'Calculer b^a', 'Prendre le logarithme des deux membres'], 3, 'Le logarithme fait descendre l’exposant.'],
            ['log(a^x) est égal à…', ['x × log(a)', 'a × log(x)', 'log(a) + x', 'log(a) ÷ x'], 0, 'C’est la propriété qui fait descendre l’exposant.'],
            ['À partir de quel entier n a-t-on 1,05^n ≥ 2 ?', ['14', '15', '20', '10'], 1, 'n ≥ log(2) ÷ log(1,05) ≈ 14,2.'],
            ['À partir de quel entier n a-t-on 0,8^n < 0,1 ?', ['10', '12', '11', '9'], 2, 'n > −1 ÷ log(0,8) ≈ 10,3.'],
            ['Si 0 < a < 1, diviser une inégalité par log(a) en change le sens.', ['Vrai', 'Faux'], 0, 'log(a) est alors négatif.'],
            ['Quelle est la solution positive de x⁴ = 16 ?', ['4', '8', '64', '2'], 3, 'x = 16^(1/4) : la racine quatrième de 16 est 2, car 2⁴ = 16.'],
            ['(1 + t)⁵ = 1,5. Comment obtient-on 1 + t ?', ['1,5^(1/5)', '1,5 ÷ 5', 'log(1,5) ÷ 5', '1,5⁵'], 0, 'Inconnue dans la base : exposant 1/5.'],
            ['Un capital placé à 5 % par an double au bout de…', ['10 ans', '15 ans', '20 ans', '14 ans exactement'], 1, 'Le premier entier n tel que 1,05^n ≥ 2 est 15.'],
            ['3 000 × 1,05^n ≥ 6 000 équivaut à…', ['1,05^n ≥ 3 000', 'n ≥ 2', '1,05^n ≥ 2', '1,05n ≥ 2'], 2, 'On divise d’abord par 3 000.'],
            ['Signe de log(0,8) ?', ['Positif', 'Nul', 'Non défini', 'Négatif'], 3, 'Le logarithme décimal est négatif pour les nombres compris entre 0 et 1 : 0,8 < 1, donc log(0,8) < 0.'],
          ],
        },
        // ---- Analyse : fonction inverse -------------------------------------
        {
          titre: 'La fonction inverse',
          axe: 'Analyse',
          lecon: {
            titre: 'Quand l’un double, l’autre est divisé par deux',
            cours: `Pour parcourir 120 km, plus on roule vite, moins on met de temps : la durée est **inversement proportionnelle** à la vitesse. La fonction qui décrit ce lien est la **fonction inverse**, f(x) = 1/x.

## Définition
f(x) = 1/x est définie pour tout x **non nul** : on ne divise jamais par 0. Son ensemble de définition est ]−∞ ; 0[ ∪ ]0 ; +∞[.

## Comportement aux bornes
| Quand x… | 1/x… |
| devient très grand (positif) | se rapproche de 0 par valeurs positives |
| se rapproche de 0 par la droite | devient très grand |
| se rapproche de 0 par la gauche | devient très grand en valeur absolue, négatif |
| devient très grand négatif | se rapproche de 0 par valeurs négatives |

L’inverse d’un très petit nombre est très grand : 1 ÷ 0,001 = 1 000. L’inverse d’un très grand nombre est très petit : 1 ÷ 10⁶ = 10^(−6).

## La courbe : une hyperbole
Elle a deux branches, symétriques par rapport à l’**origine** (1/(−x) = −1/x). Les axes du repère sont ses **asymptotes** : la courbe s’en rapproche autant qu’on veut sans jamais les toucher.

## La dérivée
= (1/x)′ = −1/x²

On l’obtient par le taux de variation : (1/(a+h) − 1/a) ÷ h = −1 ÷ (a(a + h)), qui se rapproche de −1/a² quand h tend vers 0.

Comme −1/x² < 0, la fonction inverse est **décroissante sur ]−∞ ; 0[** et **décroissante sur ]0 ; +∞[**.

!> Elle n’est pas décroissante sur tout son ensemble de définition : −1 < 1 mais 1/(−1) = −1 < 1/1 = 1. La décroissance vaut sur chaque intervalle séparément.

## Le coût moyen
Si produire q objets coûte C(q), le **coût moyen** par objet est C(q) ÷ q. Avec des frais fixes de 500 € et 2 € par objet : C(q) = 500 + 2q et le coût moyen vaut **2 + 500/q**. Plus on produit, plus les frais fixes se répartissent : le coût moyen diminue et se rapproche de 2 €.

> 1/x : grand quand x est petit, petit quand x est grand, jamais nul.

## Exemple travaillé
Tangente à la courbe de f(x) = 1/x au point d’abscisse 2.
1. f(2) = 0,5.
2. f′(2) = −1/4 = −0,25.
3. y = −0,25(x − 2) + 0,5, soit **y = −0,25x + 1**.`,
          },
          questions: [
            ['Pour quelle valeur de x la fonction inverse n’est-elle pas définie ?', ['1', '−1', '0', 'Aucune'], 2, 'On ne divise jamais par 0.'],
            ['Quelle est la dérivée de f(x) = 1/x ?', ['1/x²', '−1/x', 'ln(x)', '−1/x²'], 3, 'On l’obtient par la limite du taux de variation.'],
            ['Quand x devient très grand, 1/x…', ['Se rapproche de 0', 'Devient très grand', 'Vaut 1', 'Devient négatif'], 0, 'L’inverse d’un très grand nombre est très petit.'],
            ['Combien vaut l’inverse de 0,001 ?', ['0,000 001', '1 000', '100', '−1 000'], 1, '1 ÷ 0,001 = 1 000.'],
            ['La fonction inverse est décroissante sur tout son ensemble de définition.', ['Vrai', 'Faux'], 1, 'Elle l’est sur ]−∞ ; 0[ et sur ]0 ; +∞[ séparément.'],
            ['Quelles sont les asymptotes de la courbe de 1/x ?', ['La droite y = x', 'La droite y = 1', 'Les deux axes du repère', 'Aucune'], 2, 'La courbe s’en approche sans jamais les toucher.'],
            ['La courbe de la fonction inverse est symétrique par rapport…', ['À l’axe des ordonnées', 'À l’axe des abscisses', 'À la droite x = 1', 'À l’origine du repère'], 3, 'Car 1/(−x) = −1/x.'],
            ['Quelle est l’équation de la tangente à la courbe de 1/x en 2 ?', ['y = −0,25x + 1', 'y = 0,25x', 'y = −4x + 8,5', 'y = −0,5x + 1'], 0, 'f(2) = 0,5 et f′(2) = −0,25.'],
            ['Frais fixes 500 €, coût variable 2 € par objet. Quel est le coût moyen pour q objets ?', ['500 + 2q', '2 + 500/q', '502/q', '500q + 2'], 1, 'C(q) ÷ q = 500/q + 2.'],
            ['Quand la production augmente, ce coût moyen…', ['Augmente', 'Reste constant', 'Diminue et se rapproche de 2 €', 'Devient nul'], 2, 'Les frais fixes se répartissent sur plus d’objets.'],
            ['Combien vaut la dérivée de 1/x en x = 1 ?', ['1', '0', '−2', '−1'], 3, 'La dérivée de 1/x est −1/x². En x = 1, elle vaut −1/1² = −1.'],
            ['Deux grandeurs inversement proportionnelles : quand l’une double, l’autre…', ['Est divisée par deux', 'Double', 'Reste la même', 'Est multipliée par quatre'], 0, 'Leur produit reste constant.'],
          ],
        },
        {
          titre: 'Étudier une fonction avec la fonction inverse',
          axe: 'Analyse',
          lecon: {
            titre: 'Inverse et polynômes : trouver un optimum',
            cours: `Un fabricant cherche la quantité qui rend le coût moyen le plus bas ; un ingénieur, les dimensions d’une boîte qui économisent le plus de matière. Ces problèmes mènent souvent à une fonction qui mélange **polynôme** et **inverse**.

## Les dérivées utiles
| f(x) | f′(x) |
| k/x | −k/x² |
| ax + b | a |
| x² | 2x |
| x³ | 3x² |

On dérive terme à terme : f(x) = x + 16/x donne **f′(x) = 1 − 16/x²**.

## Étudier le signe de f′ : mettre au même dénominateur
1 − 16/x² = (x² − 16) ÷ x² = (x − 4)(x + 4) ÷ x².

Sur ]0 ; +∞[, x² > 0 et x + 4 > 0 : le signe de f′ est celui de **x − 4**.

| x | 0 | … | 4 | … |
| f′(x) | ‖ | − | 0 | + |
| f | ‖ | décroissante | 8 | croissante |

Le **minimum** est f(4) = 4 + 16/4 = **8**.

## La méthode complète
1. Préciser l’**intervalle** d’étude (souvent ]0 ; +∞[ pour une quantité).
2. Dériver terme à terme.
3. Réduire f′(x) au **même dénominateur**.
4. Étudier le signe du numérateur (le dénominateur x² est positif).
5. Dresser le tableau de variations et calculer l’extremum avec **f**.

!> Le dénominateur x² ne s’annule qu’en 0, valeur interdite : il n’influence pas le signe, mais il faut l’écrire.

## Un problème de coût moyen
Le coût total de fabrication de q centaines d’objets est C(q) = 2q² + 50 (en centaines d’euros). Le coût moyen est C_M(q) = C(q) ÷ q = **2q + 50/q**.
1. C_M′(q) = 2 − 50/q² = (2q² − 50) ÷ q² = 2(q − 5)(q + 5) ÷ q².
2. Sur ]0 ; +∞[, le signe est celui de q − 5.
3. Minimum pour q = 5 : C_M(5) = 10 + 10 = 20.
Le coût moyen est minimal pour **500 objets** et vaut alors 20 centaines d’euros par centaine d’objets, soit 20 € par objet.

> Pour un optimum : dériver, réduire au même dénominateur, étudier le signe du numérateur.

## Exemple travaillé
f(x) = x² + 2/x sur ]0 ; +∞[.
1. f′(x) = 2x − 2/x² = (2x³ − 2) ÷ x² = 2(x³ − 1) ÷ x².
2. x³ − 1 est négatif pour x < 1, positif pour x > 1 (car x³ est croissante et 1³ = 1).
3. Minimum en 1 : f(1) = 1 + 2 = **3**.`,
          },
          questions: [
            ['Quelle est la dérivée de f(x) = 16/x ?', ['16/x²', '−16/x', '16', '−16/x²'], 3, '(k/x)′ = −k/x².'],
            ['Quelle est la dérivée de f(x) = x + 16/x ?', ['1 − 16/x²', '1 + 16/x²', '1 − 16/x', 'x − 16/x²'], 0, 'On dérive terme à terme.'],
            ['1 − 16/x² s’écrit aussi…', ['(x − 16) ÷ x²', '(x² − 16) ÷ x²', '(16 − x²) ÷ x²', '1 ÷ (x² − 16)'], 1, 'On réduit au même dénominateur.'],
            ['Quel est le minimum de f(x) = x + 16/x sur ]0 ; +∞[ ?', ['4', '16', '8', '0'], 2, 'Atteint en 4 : 4 + 4 = 8.'],
            ['Pour C_M(q) = 2q + 50/q, pour quelle valeur de q le coût moyen est-il minimal ?', ['q = 25', 'q = 10', 'q = 2', 'q = 5'], 3, 'C_M′(q) = 2(q − 5)(q + 5) ÷ q² s’annule en 5.'],
            ['Quelle est la valeur minimale de C_M(q) = 2q + 50/q ?', ['20', '10', '25', '52'], 0, 'C_M(5) = 10 + 10 = 20.'],
            ['Sur ]0 ; +∞[, le dénominateur x² de f′ ne change pas son signe.', ['Vrai', 'Faux'], 0, 'x² est strictement positif sur cet intervalle.'],
            ['Pour trouver la valeur d’un minimum, on calcule…', ['f′ en ce point', 'f en ce point', 'La limite en 0', 'f′(0)'], 1, 'f′ indique où ; f donne la valeur.'],
            ['Quelle est la dérivée de f(x) = x² + 2/x ?', ['2x + 2/x²', '2x − 2/x', '2x − 2/x²', 'x − 2/x²'], 2, 'Dérivée de x² : 2x ; de 2/x : −2/x².'],
            ['Quel est le minimum de f(x) = x² + 2/x sur ]0 ; +∞[ ?', ['2', '1', '4', '3'], 3, 'Atteint en 1 : 1 + 2 = 3.'],
            ['Le coût moyen se calcule par…', ['Coût total ÷ quantité', 'Coût total × quantité', 'Coût total − quantité', 'Dérivée du coût total'], 0, 'C’est le coût par unité produite.'],
            ['Pourquoi étudie-t-on souvent un coût moyen sur ]0 ; +∞[ ?', ['Parce que la fonction est positive', 'Parce que la quantité produite est positive et que q = 0 est interdit', 'Parce que c’est plus simple', 'Par convention sans raison'], 1, 'Une quantité est positive, et on ne divise pas par 0.'],
          ],
        },
        // ---- Statistique et probabilités ----------------------------------------
        {
          titre: 'Séries statistiques à deux variables et ajustement affine',
          axe: 'Statistique et probabilités',
          lecon: {
            titre: 'Du nuage de points à la prévision',
            cours: `Quand on mesure deux grandeurs sur les mêmes individus — dépenses de publicité et ventes, tension et intensité, âge et taille —, on cherche une relation qui permette d’**estimer** l’une à partir de l’autre.

## Nuage de points et point moyen
Chaque couple (x_i ; y_i) est un point du repère. Le **point moyen** est G(x̄ ; ȳ), où x̄ et ȳ sont les moyennes des x_i et des y_i.

## L’ajustement affine
Si le nuage a une forme **allongée**, on le résume par une droite y = ax + b.
| Méthode | Principe |
| Au jugé | Une droite tracée « au milieu » du nuage, qui passe de préférence par G |
| Moindres carrés | La droite qui rend minimale Σ (y_i − (ax_i + b))², la somme des carrés des écarts verticaux ; on l’obtient à la calculatrice ou au tableur |

La droite des moindres carrés passe par le **point moyen G**.

## Interpoler et extrapoler
- **Interpoler** : estimer une valeur **dans** le domaine des données : fiable si le nuage est bien aligné.
- **Extrapoler** : prévoir **au-delà** : plus risqué, la tendance peut changer.

!> Un bon ajustement ne prouve pas de lien de cause à effet : il décrit une tendance.

## Quand le nuage n’est pas aligné : le changement de variable
Si le nuage s’incurve, on peut transformer une variable pour **redresser** le nuage.
| Si l’on soupçonne… | On pose… | Alors |
| y ≈ k × a^x (croissance exponentielle) | z = log(y) | z = log(k) + x × log(a) est affine en x |
| y ≈ a/x + b | t = 1/x | y = at + b est affine en t |
| y ≈ ax² + b | u = x² | y = au + b est affine en u |

Exemple : si y ≈ 3 × 2^x, alors log(y) ≈ log(3) + x × log(2) : dans un repère (x ; log(y)), les points sont presque alignés, et le coefficient directeur vaut log(2) ≈ 0,301.

## La méthode
1. Représenter le nuage et le point moyen.
2. Juger de la forme : allongée (affine) ou incurvée (changement de variable).
3. Obtenir la droite d’ajustement (calculatrice, tableur).
4. L’utiliser pour estimer, en précisant si l’on interpole ou extrapole.

> Un ajustement est un modèle : il faut toujours discuter de sa pertinence et de ses limites.

## Exemple travaillé
Une entreprise relève ses dépenses de publicité x (en milliers d’euros) et ses ventes y (en milliers d’unités). La calculatrice donne y = 1,8x + 12.
1. Pour x = 10 (dans le domaine observé) : y = 30, soit 30 000 unités (interpolation).
2. Pour x = 50 (bien au-delà) : y = 102 — une extrapolation fragile, car le marché finit par saturer.`,
          },
          questions: [
            ['Que minimise la droite des moindres carrés ?', ['Σ (y_i − (ax_i + b))²', 'La somme des écarts horizontaux', 'La distance à l’origine', 'Le nombre de points'], 0, 'La somme des carrés des écarts verticaux.'],
            ['Par quel point passe toujours la droite des moindres carrés ?', ['L’origine', 'Le point moyen G', 'Le premier point', 'Le point le plus haut'], 1, 'La droite d’ajustement passe toujours par le point moyen G, dont les coordonnées sont les moyennes x̄ et ȳ.'],
            ['Estimer une valeur au-delà des données observées, c’est…', ['Interpoler', 'Ajuster', 'Extrapoler', 'Linéariser'], 2, 'L’extrapolation est plus risquée que l’interpolation.'],
            ['Si y ≈ k × a^x, quel changement de variable rend le nuage alignable ?', ['z = y²', 'z = 1/y', 'z = y + x', 'z = log(y)'], 3, 'log(y) = log(k) + x log(a), affine en x.'],
            ['Si y ≈ 3 × 2^x, que vaut le coefficient directeur dans le repère (x ; log(y)) ?', ['log(2) ≈ 0,301', '3', '2', 'log(3)'], 0, 'log(y) = log(3) + x × log(2).'],
            ['Si y ≈ a/x + b, quel changement de variable convient ?', ['t = x²', 't = 1/x', 't = log(x)', 't = x + 1'], 1, 'y = at + b devient affine en t.'],
            ['Avec l’ajustement y = 1,8x + 12, quelle estimation pour x = 10 ?', ['28', '18', '30', '120'], 2, '1,8 × 10 + 12 = 30.'],
            ['Un bon ajustement affine prouve un lien de cause à effet.', ['Vrai', 'Faux'], 1, 'Il décrit une tendance, pas une cause.'],
            ['Pourquoi une extrapolation lointaine est-elle fragile ?', ['La calculatrice se trompe', 'Elle est interdite', 'Elle ne passe pas par G', 'Rien ne garantit que la tendance se poursuive'], 3, 'Saturation, changement de contexte : le modèle peut cesser d’être valable.'],
            ['Quand envisage-t-on directement un ajustement affine ?', ['Quand le nuage est allongé, à peu près rectiligne', 'Quand le nuage est circulaire', 'Quand il y a un seul point', 'Jamais'], 0, 'Sinon, on cherche un changement de variable.'],
            ['Le point moyen a pour coordonnées…', ['(x_1 ; y_1)', '(x̄ ; ȳ)', '(0 ; 0)', '(max x ; max y)'], 1, 'Les moyennes des deux séries.'],
            ['Dans un repère semi-logarithmique, une croissance exponentielle apparaît…', ['En forme de parabole', 'Circulaire', 'Alignée', 'Aléatoire'], 2, 'Le logarithme la transforme en relation affine.'],
          ],
        },
        {
          titre: 'Probabilités conditionnelles, arbres et indépendance',
          axe: 'Statistique et probabilités',
          lecon: {
            titre: 'Conditionner, additionner les chemins, tester l’indépendance',
            cours: `Une usine a trois machines qui ne produisent pas la même proportion de pièces défectueuses. Une pièce est défectueuse : de quelle machine vient-elle probablement ? Les **arbres** et la **formule des probabilités totales** répondent.

## Probabilité conditionnelle
Pour P(A) ≠ 0 :
= P_A(B) = P(A ∩ B) ÷ P(A), d’où P(A ∩ B) = P(A) × P_A(B)

## Les règles de l’arbre
| Règle | Contenu |
| Somme des branches issues d’un nœud | 1 |
| Branches du second niveau | Des probabilités conditionnelles |
| Probabilité d’un chemin | Le produit des probabilités de ses branches |
| Probabilité d’un événement | La somme des probabilités des chemins qui y mènent |

## La formule des probabilités totales
Si A1, A2, A3 forment une **partition** de l’univers (ils ne se chevauchent pas et couvrent tous les cas) :
= P(B) = P(A1 ∩ B) + P(A2 ∩ B) + P(A3 ∩ B)
= P(B) = P(A1) × P_A1(B) + P(A2) × P_A2(B) + P(A3) × P_A3(B)

Avec deux événements, la partition est simplement A et son contraire Ā.

## L’indépendance
Pour des probabilités non nulles, B est **indépendant** de A si P_A(B) = P(B), ce qui équivaut à :
= P(A ∩ B) = P(A) × P(B)

L’indépendance est **symétrique** : si B est indépendant de A, A l’est de B.

!> Indépendants et incompatibles sont deux notions différentes : deux événements incompatibles (P(A ∩ B) = 0) de probabilités non nulles ne sont jamais indépendants.

> Dans un arbre : on multiplie le long d’un chemin, on additionne les chemins.

## Exemple travaillé
Machine A : 50 % de la production, 2 % de défauts. Machine B : 30 %, 3 % de défauts. Machine C : 20 %, 5 % de défauts. On note D « la pièce est défectueuse ».
1. P(A ∩ D) = 0,5 × 0,02 = 0,010.
2. P(B ∩ D) = 0,3 × 0,03 = 0,009.
3. P(C ∩ D) = 0,2 × 0,05 = 0,010.
4. Probabilités totales : P(D) = 0,010 + 0,009 + 0,010 = **0,029**.
5. Une pièce est défectueuse : P_D(C) = 0,010 ÷ 0,029 ≈ **0,345**. La machine C ne fait que 20 % de la production, mais un tiers des défauts.
6. P_C(D) = 0,05 ≠ P(D) = 0,029 : D n’est pas indépendant de C.`,
          },
          questions: [
            ['P(A) = 0,4 et P(A ∩ B) = 0,1. Combien vaut P_A(B) ?', ['0,04', '0,25', '0,5', '4'], 1, '0,1 ÷ 0,4 = 0,25.'],
            ['La machine A fabrique 50 % des pièces, et 2 % de ses pièces ont un défaut (D). Combien vaut P(A ∩ D) ?', ['0,52', '0,02', '0,010', '0,5'], 2, '0,5 × 0,02 = 0,010.', 'Dans l’exemple de la fiche, combien vaut P(A ∩ D) ?'],
            ['P(A ∩ D) = 0,010, P(B ∩ D) = 0,009 et P(C ∩ D) = 0,010. Combien vaut P(D) ?', ['0,10', '0,033', '0,01', '0,029'], 3, '0,010 + 0,009 + 0,010.', 'Dans l’exemple de la fiche, combien vaut P(D) ?'],
            ['P(C ∩ D) = 0,010 et P(D) = 0,029. P_D(C) vaut environ…', ['0,345', '0,05', '0,2', '0,01'], 0, 'On divise la probabilité de l’intersection par celle de D : 0,010 ÷ 0,029 ≈ 0,345.', 'Dans l’exemple de la fiche, P_D(C) vaut environ…'],
            ['La probabilité d’un chemin dans un arbre est…', ['La somme des probabilités de ses branches', 'Le produit des probabilités de ses branches', 'Toujours 1', 'La plus petite de ses branches'], 1, 'On multiplie le long d’un chemin.'],
            ['Pour appliquer la formule des probabilités totales, les événements A1, A2, A3 doivent…', ['Être indépendants', 'Avoir la même probabilité', 'Former une partition de l’univers', 'Être incompatibles avec B'], 2, 'Sans chevauchement et couvrant tous les cas.'],
            ['P(A) = 0,5 et P(B) = 0,6. A et B sont indépendants. Combien vaut P(A ∩ B) ?', ['1,1', '0,1', '0,5', '0,3'], 3, '0,5 × 0,6 = 0,3.'],
            ['P(A) = 0,2, P(B) = 0,5 et P(A ∩ B) = 0,15. A et B sont-ils indépendants ?', ['Non, car 0,2 × 0,5 = 0,1 ≠ 0,15', 'Oui', 'Oui, car 0,15 < 0,5', 'On ne peut pas savoir'], 0, 'Il faudrait P(A ∩ B) = P(A) × P(B).'],
            ['L’indépendance de deux événements (de probabilités non nulles) est symétrique.', ['Vrai', 'Faux'], 0, 'Si B est indépendant de A, A est indépendant de B.'],
            ['Deux événements incompatibles de probabilités non nulles sont indépendants.', ['Vrai', 'Faux'], 1, 'P(A ∩ B) = 0 alors que P(A) × P(B) > 0.'],
            ['P(A) = 0,7, P_A(B) = 0,2 et P_Ā(B) = 0,5. Combien vaut P(B) ?', ['0,7', '0,29', '0,35', '0,14'], 1, '0,7 × 0,2 + 0,3 × 0,5 = 0,14 + 0,15 = 0,29.'],
            ['Que vaut la somme des probabilités des branches issues d’un même nœud ?', ['0', '0,5', '1', 'La probabilité du nœud'], 2, 'Elles couvrent toutes les issues possibles.'],
          ],
        },
        {
          titre: 'Coefficients binomiaux et triangle de Pascal',
          axe: 'Statistique et probabilités',
          lecon: {
            titre: 'Compter les chemins sans dessiner l’arbre',
            cours: `Avec 3 lancers, l’arbre a 8 chemins et se dessine facilement. Avec 10, il en a 1 024 : impossible. Les **coefficients binomiaux** comptent les chemins sans les dessiner.

## Définition
Dans l’arbre d’un schéma de Bernoulli à n épreuves, le coefficient binomial **(n k)** — qu’on lit « k parmi n » — est le **nombre de chemins** qui comportent exactement **k succès**.

Exemple : avec n = 3, les chemins à 2 succès sont SSE, SES, ESS : (3 2) = **3**.

## Les valeurs à connaître
| Propriété | Pourquoi |
| (n 0) = 1 | Un seul chemin sans succès : E…E |
| (n n) = 1 | Un seul chemin tout en succès : S…S |
| (n 1) = n | Le succès unique peut être à n places |
| (n k) = (n n−k) | Choisir les k succès revient à choisir les n − k échecs |

## La formule de Pascal
= (n k) + (n k+1) = (n+1 k+1)

Raisonnement sur l’arbre : un chemin de n + 1 épreuves avec k + 1 succès se termine soit par un succès (il en avait k avant : (n k) chemins), soit par un échec (il en avait k + 1 avant : (n k+1) chemins).

## Le triangle de Pascal
Chaque nombre est la **somme des deux nombres au-dessus** de lui.
| n | k = 0 | 1 | 2 | 3 | 4 | 5 | 6 |
| 0 | 1 | | | | | | |
| 1 | 1 | 1 | | | | | |
| 2 | 1 | 2 | 1 | | | | |
| 3 | 1 | 3 | 3 | 1 | | | |
| 4 | 1 | 4 | 6 | 4 | 1 | | |
| 5 | 1 | 5 | 10 | 10 | 5 | 1 | |
| 6 | 1 | 6 | 15 | 20 | 15 | 6 | 1 |

La **somme** de la ligne n vaut **2^n** : c’est le nombre total de chemins (ligne 4 : 1 + 4 + 6 + 4 + 1 = 16).

!> (n k) n’est pas n × k : (6 2) vaut 15, alors que 6 × 2 = 12. On le lit dans le triangle ou on compte les chemins.

## En Python : générer le triangle
\`\`\`python
def triangle(n):
    ligne = [1]
    for i in range(n):
        ligne = [1] + [ligne[k] + ligne[k+1] for k in range(len(ligne) - 1)] + [1]
    return ligne
\`\`\`

triangle(4) renvoie [1, 4, 6, 4, 1].

> (n k) : le nombre de façons de placer k succès parmi n épreuves.

## Exemple travaillé
Un QCM a 5 questions ; on répond au hasard. Combien de façons d’avoir exactement 2 bonnes réponses ?
1. C’est le nombre de chemins à 2 succès parmi 5 épreuves : (5 2).
2. Ligne 5 du triangle : 1, 5, **10**, 10, 5, 1.
3. Il y a **10** façons.`,
          },
          questions: [
            ['Que représente le coefficient binomial (n k) ?', ['n × k', 'La probabilité de k succès', 'Le nombre de chemins à exactement k succès parmi n épreuves', 'k divisé par n'], 2, 'C’est sa définition à partir de l’arbre.'],
            ['Combien vaut (4 2) ?', ['4', '8', '2', '6'], 3, 'Ligne 4 : 1, 4, 6, 4, 1.'],
            ['Combien vaut (5 2) ?', ['10', '7', '5', '25'], 0, 'Ligne 5 : 1, 5, 10, 10, 5, 1.'],
            ['Combien vaut (6 3) ?', ['18', '20', '15', '6'], 1, 'Ligne 6 : 1, 6, 15, 20, 15, 6, 1.'],
            ['Combien vaut (10 1) ?', ['1', '11', '10', '0'], 2, '(n 1) = n : le succès peut être à n places.'],
            ['Combien vaut (7 7) ?', ['7', '49', '0', '1'], 3, 'Un seul chemin tout en succès.'],
            ['(5 3) est égal à (5 2).', ['Vrai', 'Faux'], 0, 'Symétrie : (n k) = (n n−k).'],
            ['Que vaut la somme des nombres de la ligne 4 du triangle de Pascal ?', ['16', '8', '10', '32'], 0, '1 + 4 + 6 + 4 + 1 = 16 = 2⁴.'],
            ['Par la formule de Pascal, (4 1) + (4 2) est égal à…', ['(4 3)', '(5 2)', '(8 3)', '(5 3) + 1'], 1, '(n k) + (n k+1) = (n+1 k+1).'],
            ['Combien vaut (6 2) ?', ['12', '8', '15', '30'], 2, 'Ligne 6 : 1, 6, 15… — pas 6 × 2.'],
            ['Combien vaut (10 9) ?', ['9', '90', '1', '10'], 3, '(10 9) = (10 1) = 10.'],
            ['Dans le triangle de Pascal, chaque nombre est…', ['La somme des deux nombres au-dessus', 'Le produit des deux nombres au-dessus', 'Le double du nombre au-dessus', 'Le rang de la ligne'], 0, 'C’est la formule de Pascal.'],
          ],
        },
        {
          titre: 'La loi binomiale et l’espérance',
          axe: 'Statistique et probabilités',
          lecon: {
            titre: 'Compter les succès d’une répétition d’épreuves',
            cours: `Un joueur tire 10 lancers francs, chacun réussi avec probabilité 0,8 ; une machine produit 20 pièces, chacune défectueuse avec probabilité 0,05. Le **nombre de succès** suit une **loi binomiale**.

## L’espérance d’une variable aléatoire
Pour une variable aléatoire X de loi donnée :
= E(X) = x_1 × p_1 + x_2 × p_2 + … + x_n × p_n

L’espérance est la **moyenne à long terme** des valeurs de X. Un jeu est équitable si l’espérance du gain est nulle.

## Le schéma de Bernoulli et la loi binomiale
On répète n fois, de façon **identique et indépendante**, une épreuve à deux issues (succès de probabilité p). La variable X qui **compte les succès** suit la loi binomiale **B(n ; p)**.

Pour reconnaître une loi binomiale, il faut vérifier :
1. Une épreuve à **deux issues** (succès / échec).
2. Répétée **n fois**, dans des conditions **identiques**.
3. De façon **indépendante**.
4. X **compte** le nombre de succès.

## Les probabilités
= P(X = k) = (n k) × p^k × (1 − p)^(n − k)

| Événement | Probabilité |
| X = 0 | (1 − p)^n |
| X = n | p^n |
| X = 1 | n × p × (1 − p)^(n − 1) |
| X ≥ 1 | 1 − (1 − p)^n |

!> « Au moins un succès » se calcule presque toujours par le contraire : 1 − P(X = 0).

## L’espérance de la loi binomiale
= E(X) = n × p (résultat admis)

Avec 10 lancers réussis chacun avec probabilité 0,8, le joueur marque en moyenne **8** paniers.

## Exemple travaillé
On lance 4 fois une pièce équilibrée ; X compte les « pile ». X suit B(4 ; 0,5).
1. P(X = 2) = (4 2) × 0,5² × 0,5² = 6 × 0,0625 = **0,375**.
2. P(X = 0) = 0,5⁴ = 0,0625.
3. P(X ≥ 1) = 1 − 0,0625 = **0,9375**.
4. E(X) = 4 × 0,5 = **2** : en moyenne, deux « pile » sur quatre lancers.

## Un contrôle qualité
Chaque pièce est défectueuse avec probabilité 0,1, indépendamment ; on en prélève 3. X suit B(3 ; 0,1).
- P(X = 0) = 0,9³ = 0,729.
- P(X = 1) = 3 × 0,1 × 0,9² = 0,243.
- P(au moins une défectueuse) = 1 − 0,729 = **0,271**.

> Loi binomiale : deux issues, n répétitions identiques et indépendantes, on compte les succès.`,
          },
          questions: [
            ['X suit B(4 ; 0,5). Combien vaut P(X = 2) ?', ['0,5', '0,25', '0,0625', '0,375'], 3, '6 × 0,5⁴ = 6 × 0,0625.'],
            ['X suit B(n ; p). Quelle est son espérance ?', ['n × p', 'p', 'n + p', 'n × (1 − p)'], 0, 'Résultat admis au programme.'],
            ['X suit B(10 ; 0,2). Combien vaut E(X) ?', ['0,2', '2', '8', '10'], 1, 'Pour une loi binomiale, E(X) = n × p = 10 × 0,2 = 2.'],
            ['X suit B(3 ; 0,1). Combien vaut P(X = 0) ?', ['0,1', '0,001', '0,729', '0,271'], 2, 'Aucun succès en trois épreuves : trois échecs de probabilité 0,9 chacun, soit 0,9³ = 0,729.'],
            ['X suit B(3 ; 0,1). Combien vaut P(X ≥ 1) ?', ['0,729', '0,3', '0,1', '0,271'], 3, '« Au moins un succès » est le contraire de « aucun succès » : 1 − P(X = 0) = 1 − 0,729 = 0,271.'],
            ['X suit B(3 ; 0,1). Combien vaut P(X = 1) ?', ['0,243', '0,1', '0,081', '0,3'], 0, '3 × 0,1 × 0,81.'],
            ['Quelle condition n’est PAS nécessaire pour une loi binomiale ?', ['Deux issues par épreuve', 'Une probabilité de succès égale à 0,5', 'Des répétitions indépendantes', 'Des épreuves identiques'], 1, 'p peut prendre n’importe quelle valeur entre 0 et 1.'],
            ['Pour calculer P(X ≥ 1), le plus simple est de calculer…', ['P(X = 1)', 'P(X = n)', '1 − P(X = 0)', 'E(X)'], 2, 'On passe par l’événement contraire.'],
            ['X suit B(n ; p). Combien vaut P(X = n) ?', ['(1 − p)^n', 'n × p', '1', 'p^n'], 3, 'Un seul chemin : tous les succès.'],
            ['Un jeu est équitable si l’espérance du gain est égale à 1.', ['Vrai', 'Faux'], 1, 'Il est équitable si l’espérance est nulle.'],
            ['X prend les valeurs 0, 5 et 20 avec les probabilités 0,5 ; 0,4 et 0,1. Combien vaut E(X) ?', ['4', '8,33', '2', '25'], 0, 'E(X) = 0 × 0,5 + 5 × 0,4 + 20 × 0,1 = 0 + 2 + 2 = 4.'],
            ['Tirer 5 boules SANS remise dans une petite urne et compter les rouges donne une loi binomiale.', ['Vrai', 'Faux'], 1, 'Sans remise, les tirages ne sont ni identiques ni indépendants.'],
          ],
        },
      ],
    },
  ],
}
