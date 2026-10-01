// MATHÉMATIQUES — 1re de la VOIE TECHNOLOGIQUE, tronc commun (STMG, STI2D,
// STL, ST2S, STD2A, STHR, S2TMD).
//
// SOURCE : le NOUVEAU programme de première technologique, arrêté du
// 26 février 2026 (BO n° 14 du 2 avril 2026, NOR MENE2602918A), qui remplace
// celui du 17 janvier 2019 et s'applique à la RENTRÉE 2026-2027. Ce qui change
// par rapport à 2019 et que ce module suit :
//   - les fonctions polynômes de degré 3 quittent la partie « fonctions » (il
//     reste x ↦ x³ et la dérivée des polynômes de degré ≤ 3 en dérivation) ;
//   - le terme de rang n des suites arithmétiques et géométriques se calcule
//     désormais dès la 1re ;
//   - les séries statistiques à deux variables quantitatives (nuage, point
//     moyen, ajustement affine) et l'indépendance / la formule des
//     probabilités totales descendent de la terminale ;
//   - les tableaux croisés passent dans les automatismes (P_A(B), P(A ∩ B)).
// Le discriminant n'est toujours PAS au programme.
//
// L'ÉPREUVE ANTICIPÉE de mathématiques (fin de 1re, depuis la session 2026) :
// 2 h, sans calculatrice, coefficient 2 ; partie 1 = QCM d'automatismes
// (6 points, 12 questions en voie technologique), partie 2 = 2 ou 3 exercices
// guidés (14 points). D'où cinq fiches d'automatismes, écrites pour le calcul
// mental, et une fiche méthode de l'épreuve.
//
// Formules en texte simple (l'app ne rend pas LaTeX) : x², √, ×, ≤.

export default {
  slug: 'maths-techno',
  nom: 'Mathématiques',

  titreMigration: 'MATHS 1re techno — le programme du tronc commun (2026)',

  motif: `Les mathématiques de la voie technologique sont une matière à part : un
élève de 1re STMG, STI2D, STL ou ST2S ne suit pas la spécialité de la voie
générale, et passe en juin l'épreuve anticipée de mathématiques (automatismes en
QCM, puis exercices guidés, sans calculatrice). Cette migration installe les
15 fiches du programme de 1re technologique en vigueur à la rentrée 2026 (BO
n° 14 du 2 avril 2026) : cinq fiches d'automatismes, six d'analyse, trois de
statistiques et probabilités, et la méthode de l'épreuve anticipée.`,

  blocs: [
    {
      niveaux: ['1re'],
      positionDepart: 1,
      chapitres: [
        // ---- Automatismes -------------------------------------------------
        {
          titre: 'Automatismes : proportions, pourcentages et évolutions',
          axe: 'Automatismes',
          lecon: {
            titre: 'Passer du pourcentage au coefficient multiplicateur',
            cours: `Soldes, hausse des loyers, baisse d’une population : les pourcentages sont partout, et ce sont les premières questions du QCM d’automatismes. Un seul outil règle presque tout : le **coefficient multiplicateur**.

## Proportions
La proportion d’une partie dans un tout se calcule par **partie ÷ tout**. Elle s’écrit en fraction, en décimal ou en pourcentage : 3/4 = 0,75 = 75 %.

Prendre t % d’une quantité, c’est la multiplier par t/100 : 15 % de 80 = 0,15 × 80 = 12.

La **proportion d’une proportion** se calcule par un produit : si 40 % des élèves sont des filles et que 25 % d’entre elles font de la natation, les nageuses représentent 0,4 × 0,25 = 0,1, soit **10 %** des élèves.

## Le coefficient multiplicateur
| Évolution | Coefficient multiplicateur |
| Augmenter de t % | 1 + t/100 |
| Diminuer de t % | 1 − t/100 |
| + 5 % | × 1,05 |
| − 30 % | × 0,7 |
| + 100 % | × 2 |

= valeur finale = valeur initiale × CM
= valeur initiale = valeur finale ÷ CM

## Calculer un taux d’évolution
= taux = (valeur finale − valeur initiale) ÷ valeur initiale

Un prix qui passe de 40 € à 50 € a augmenté de 10 ÷ 40 = 0,25, soit **+ 25 %**.

## Évolutions successives
Les coefficients se **multiplient**, les pourcentages ne s’additionnent pas.

!> Deux hausses de 10 % ne font pas + 20 % : 1,1 × 1,1 = 1,21, soit + 21 %.

## Évolution réciproque
Pour revenir à la valeur de départ, on applique le coefficient **inverse** : après une hausse de 25 % (× 1,25), il faut multiplier par 1 ÷ 1,25 = 0,8, soit une **baisse de 20 %**.

## Indices base 100
Un indice rapporte une valeur à celle d’une année de référence ramenée à 100. Un indice de 112 signifie une hausse de **12 %** depuis l’année de base ; un indice de 95, une baisse de 5 %.

> Réflexe : traduis toujours un pourcentage d’évolution en coefficient multiplicateur avant de calculer.

## Exemple travaillé
Un article coûte 80 €. Il augmente de 20 %, puis baisse de 20 %.
1. CM global : 1,2 × 0,8 = 0,96.
2. Prix final : 80 × 0,96 = 76,80 €.
3. Évolution globale : 0,96 = 1 − 0,04, soit une **baisse de 4 %** — et non 0 %.`,
          },
          questions: [
            ['Combien vaut 15 % de 80 ?', ['8', '15', '12', '65'], 2, '0,15 × 80 = 12.'],
            ['Augmenter une quantité de 5 %, c’est la multiplier par…', ['0,05', '1,5', '0,95', '1,05'], 3, 'Le coefficient multiplicateur d’une hausse de t % est 1 + t/100.'],
            ['Diminuer une quantité de 30 %, c’est la multiplier par…', ['0,7', '0,3', '1,3', '0,97'], 0, '1 − 30/100 = 0,7.'],
            ['Un prix de 50 € augmente de 10 %. Quel est le nouveau prix ?', ['51 €', '55 €', '60 €', '50,10 €'], 1, 'Augmenter de 10 %, c’est multiplier par 1,1 : 50 × 1,1 = 55 €.'],
            ['Un prix passe de 40 € à 50 €. Quel est le taux d’évolution ?', ['+ 10 %', '+ 20 %', '+ 25 %', '+ 50 %'], 2, '(50 − 40) ÷ 40 = 0,25.'],
            ['Une hausse de 20 % suivie d’une baisse de 20 % équivaut à…', ['Aucune évolution', 'Une hausse de 4 %', 'Une baisse de 40 %', 'Une baisse de 4 %'], 3, '1,2 × 0,8 = 0,96, soit − 4 %.'],
            ['Quelle évolution annule une hausse de 25 % ?', ['Une baisse de 20 %', 'Une baisse de 25 %', 'Une baisse de 75 %', 'Une baisse de 30 %'], 0, '1 ÷ 1,25 = 0,8, soit − 20 %.'],
            ['Après une hausse de 10 %, un prix vaut 66 €. Quel était le prix initial ?', ['59,40 €', '60 €', '56 €', '76 €'], 1, 'Augmenter de 10 %, c’est multiplier par 1,1. On retrouve le prix initial en divisant : 66 ÷ 1,1 = 60 €.'],
            ['40 % des élèves sont des filles et 25 % d’entre elles font de la natation. Quelle proportion des élèves sont des nageuses ?', ['65 %', '15 %', '10 %', '25 %'], 2, 'Proportion d’une proportion : 0,4 × 0,25 = 0,1.'],
            ['Deux hausses successives de 10 % équivalent à une hausse de 20 %.', ['Vrai', 'Faux'], 1, '1,1 × 1,1 = 1,21 : c’est une hausse de 21 %.'],
            ['Un coefficient multiplicateur de 0,75 correspond à…', ['Une hausse de 75 %', 'Une baisse de 75 %', 'Une hausse de 25 %', 'Une baisse de 25 %'], 3, '0,75 = 1 − 0,25.'],
            ['Un indice passe de 100 (en 2020) à 112 (en 2024). Quelle est l’évolution ?', ['+ 12 %', '+ 112 %', '+ 1,12 %', '+ 21 %'], 0, 'L’indice 112 correspond au coefficient 1,12.'],
          ],
        },
        {
          titre: 'Automatismes : fractions, puissances et ordres de grandeur',
          axe: 'Automatismes',
          lecon: {
            titre: 'Calculer vite et juste, sans calculatrice',
            cours: `L’épreuve anticipée se passe **sans calculatrice**. Les fractions, les puissances et les conversions doivent donc devenir des gestes sûrs.

## Les fractions
| Opération | La règle | Exemple |
| Additionner | Même dénominateur d’abord | 1/2 + 1/3 = 3/6 + 2/6 = 5/6 |
| Multiplier | Numérateurs entre eux, dénominateurs entre eux | 2/3 × 3/4 = 6/12 = 1/2 |
| Diviser | Multiplier par l’inverse | 3/4 ÷ 1/2 = 3/4 × 2 = 3/2 |
| Comparer | Même dénominateur, ou écriture décimale | 3/7 ≈ 0,43 < 1/2 |

!> 1/2 + 1/3 ne fait pas 2/5 : on n’additionne jamais les dénominateurs.

## Les puissances
Pour a non nul et m, n entiers :
| La règle | Exemple |
| a^m × a^n = a^(m+n) | 2³ × 2⁴ = 2⁷ |
| a^m ÷ a^n = a^(m−n) | 10⁵ ÷ 10² = 10³ |
| (a^m)^n = a^(m×n) | (5²)³ = 5⁶ |
| a⁰ = 1 | 7⁰ = 1 |
| a^(−n) = 1 ÷ a^n | 2^(−1) = 0,5 ; 10^(−3) = 0,001 |

## L’écriture scientifique
Un nombre s’écrit a × 10^n avec **1 ≤ a < 10** et n entier.
- 45 000 = 4,5 × 10⁴
- 0,00045 = 4,5 × 10^(−4)

## Estimer un ordre de grandeur
On arrondit chaque nombre à une valeur simple avant de calculer : 49 × 2 012 ≈ 50 × 2 000 = **100 000**. Un ordre de grandeur permet surtout de **vérifier** un résultat : si ton calcul donne 10 000, tu sais qu’il y a une erreur.

## Les conversions
| Grandeur | Conversion |
| Longueur | 1 km = 1 000 m ; 1 m = 100 cm |
| Aire | 1 m² = 10 000 cm² (on multiplie par 100²) |
| Volume | 1 L = 1 dm³ ; 1 m³ = 1 000 L |
| Durée | 1 h = 60 min = 3 600 s |
| Vitesse | 1 m/s = 3,6 km/h ; 36 km/h = 10 m/s |

> Une conversion d’aire se fait au carré, une conversion de volume au cube.

## Exemple travaillé
Une voiture roule à 90 km/h. Quelle distance parcourt-elle en 20 minutes ?
1. 20 min = 1/3 h.
2. Distance = vitesse × durée = 90 × 1/3 = **30 km**.
3. Contrôle : en une heure, 90 km ; en un tiers d’heure, trois fois moins. Cohérent.`,
          },
          questions: [
            ['Combien vaut 1/2 + 1/3 ?', ['2/5', '1/6', '2/6', '5/6'], 3, '1/2 + 1/3 = 3/6 + 2/6 = 5/6.'],
            ['Combien vaut 2/3 × 3/4 ?', ['1/2', '5/7', '6/7', '8/9'], 0, 'On multiplie les numérateurs entre eux et les dénominateurs entre eux : 6/12, qui se simplifie en 1/2.'],
            ['Combien vaut 3/4 ÷ 1/2 ?', ['3/8', '3/2', '1/4', '2/3'], 1, 'Diviser par 1/2, c’est multiplier par 2.'],
            ['Combien vaut 10³ × 10^(−5) ?', ['10^(−15)', '10⁸', '10^(−2)', '10²'], 2, 'On additionne les exposants : 3 + (−5) = −2.'],
            ['Combien vaut 2³ × 2⁴ ?', ['2¹²', '4⁷', '4¹²', '2⁷'], 3, 'On additionne les exposants : 3 + 4 = 7.'],
            ['Combien vaut (5²)³ ?', ['5⁶', '5⁵', '5⁸', '25⁵'], 0, 'On multiplie les exposants : 2 × 3 = 6.'],
            ['Quelle est l’écriture scientifique de 0,00045 ?', ['45 × 10^(−5)', '4,5 × 10^(−4)', '4,5 × 10⁴', '0,45 × 10^(−3)'], 1, 'Il faut 1 ≤ a < 10 : 4,5, et on décale la virgule de 4 rangs.'],
            ['36 km/h correspondent à…', ['3,6 m/s', '100 m/s', '10 m/s', '129,6 m/s'], 2, 'On divise par 3,6.'],
            ['Combien de cm² dans 1 m² ?', ['100', '1 000', '1 000 000', '10 000'], 3, '1 m = 100 cm, donc 1 m² = 100² cm².'],
            ['3/7 est supérieur à 1/2.', ['Vrai', 'Faux'], 1, '3/7 ≈ 0,43, plus petit que 0,5.'],
            ['Quel est l’ordre de grandeur de 49 × 2 012 ?', ['100 000', '1 000', '10 000', '1 000 000'], 0, '50 × 2 000 = 100 000.'],
            ['Combien vaut 2^(−1) ?', ['−2', '0,5', '−0,5', '2'], 1, '2^(−1) = 1 ÷ 2.'],
          ],
        },
        {
          titre: 'Automatismes : développer, factoriser, résoudre',
          axe: 'Automatismes',
          lecon: {
            titre: 'Les gestes du calcul littéral',
            cours: `Transformer une expression, résoudre une équation, trouver le signe d’un produit : ce sont les outils de tous les exercices de l’épreuve. Ils doivent venir sans hésiter.

## Développer
| Ce qu’on a | Ce qu’on obtient |
| k(a + b) | ka + kb |
| (a + b)(c + d) | ac + ad + bc + bd |
| (a + b)² | a² + 2ab + b² |
| (a − b)² | a² − 2ab + b² |
| (a − b)(a + b) | a² − b² |

!> (a + b)² n’est pas a² + b² : on oublie le double produit 2ab.

## Factoriser
C’est le chemin inverse : écrire une somme sous forme de **produit**.
1. Chercher un **facteur commun** : 5x² + 10x = 5x(x + 2).
2. Reconnaître une **différence de deux carrés** : x² − 9 = (x − 3)(x + 3).

## Résoudre une équation
**Premier degré** : on isole x. 2x + 5 = 11 donne 2x = 6, donc x = 3.

**Produit nul** : un produit est nul si et seulement si l’un de ses facteurs est nul.
(x − 4)(2x + 6) = 0 équivaut à x − 4 = 0 ou 2x + 6 = 0, soit **x = 4 ou x = −3**.

**Équation x² = a** :
| Si… | Solutions |
| a > 0 | x = √a ou x = −√a |
| a = 0 | x = 0 |
| a < 0 | Aucune solution |

## Les inéquations
On résout comme une équation, avec une règle de plus :

!> Multiplier ou diviser par un nombre **négatif** change le sens de l’inégalité : −3x > 12 donne x < −4.

## Le signe d’une expression
ax + b s’annule en x = −b/a et prend **le signe de a à droite** de cette valeur. Ainsi −2x + 6 est positif pour x < 3 et négatif pour x > 3.

Pour un produit comme (x − 1)(x − 5), on dresse un **tableau de signes** : une ligne par facteur, puis la règle des signes.
| x | moins de 1 | entre 1 et 5 | plus de 5 |
| x − 1 | − | + | + |
| x − 5 | − | − | + |
| produit | + | − | + |

## Isoler une variable
Dans une formule d’une autre discipline, on isole la grandeur cherchée par les mêmes opérations : U = R × I donne **R = U ÷ I**.

> Un produit se lit, une somme se calcule : factoriser, c’est se donner le moyen de résoudre.

## Exemple travaillé
Résoudre x² − 9 = 0.
1. Factoriser : (x − 3)(x + 3) = 0.
2. Produit nul : x = 3 ou x = −3.
3. Vérifier : 3² − 9 = 0 et (−3)² − 9 = 0.`,
          },
          questions: [
            ['Développer 3(x − 2) donne…', ['3x − 6', '3x − 2', '3x + 6', 'x − 6'], 0, 'On multiplie chaque terme par 3.'],
            ['Développer (x + 3)² donne…', ['x² + 9', 'x² + 6x + 9', 'x² + 3x + 9', '2x + 6'], 1, 'On n’oublie pas le double produit : 2 × x × 3 = 6x.'],
            ['Quelle est la forme factorisée de x² − 9 ?', ['(x − 9)(x + 1)', '(x − 3)²', '(x − 3)(x + 3)', 'x(x − 9)'], 2, 'C’est une différence de deux carrés.'],
            ['Quelle est la forme factorisée de 5x² + 10x ?', ['5(x² + 10x)', 'x(5x + 2)', '10x(x + 5)', '5x(x + 2)'], 3, 'Le facteur commun est 5x.'],
            ['Quelle est la solution de 2x + 5 = 11 ?', ['x = 3', 'x = 8', 'x = 6', 'x = 16'], 0, '2x = 6, donc x = 3.'],
            ['Quelles sont les solutions de (x − 4)(2x + 6) = 0 ?', ['4 et 3', '4 et −3', '−4 et 3', '−4 et −3'], 1, 'x − 4 = 0 ou 2x + 6 = 0.'],
            ['Quelles sont les solutions de x² = 25 ?', ['5 seulement', '12,5', '−5 et 5', 'Aucune'], 2, 'Pour a > 0, x² = a a deux solutions opposées.'],
            ['L’équation x² = −4 a pour solutions…', ['2 et −2', '−2 seulement', '2 seulement', 'Aucune solution'], 3, 'Un carré n’est jamais négatif.'],
            ['Pour quelles valeurs de x l’expression −2x + 6 est-elle positive ?', ['x < 3', 'x > 3', 'x > −3', 'x < −3'], 0, 'Elle s’annule en 3 et prend le signe de −2 à droite de 3.'],
            ['Dans U = R × I, comment exprimer R ?', ['R = U × I', 'R = U ÷ I', 'R = U − I', 'R = I ÷ U'], 1, 'On divise les deux membres par I.'],
            ['Quelles sont les solutions de −3x > 12 ?', ['x > −4', 'x > 4', 'x < −4', 'x < 4'], 2, 'Diviser par −3 change le sens de l’inégalité.'],
            ['(a + b)² = a² + b² pour tous les nombres a et b.', ['Vrai', 'Faux'], 1, 'Il manque le double produit : (a + b)² = a² + 2ab + b².'],
          ],
        },
        {
          titre: 'Automatismes : lectures graphiques et droites',
          axe: 'Automatismes',
          lecon: {
            titre: 'Lire une courbe, tracer une droite',
            cours: `Beaucoup de questions du QCM se répondent en **regardant** un graphique. Encore faut-il savoir où regarder.

## Images et antécédents
| Ce qu’on cherche | Où le lire |
| L’**image** de a par f | L’**ordonnée** du point de la courbe d’abscisse a |
| Les **antécédents** de k | Les **abscisses** des points de la courbe d’ordonnée k |

Un nombre a **une seule image**, mais peut avoir **zéro, un ou plusieurs antécédents**.

Un point A(x ; y) est sur la courbe de f si et seulement si **y = f(x)**.

## Résoudre graphiquement
| L’équation ou l’inéquation | Ce qu’on lit |
| f(x) = k | Les abscisses des points d’intersection de la courbe et de la droite horizontale y = k |
| f(x) < k | Les abscisses des points de la courbe situés **sous** cette droite |
| f(x) > k | Les abscisses des points situés **au-dessus** |
| f(x) = 0 | Les abscisses des points où la courbe coupe l’axe des abscisses |

Le **signe** de f se lit de la même façon : f est positive là où la courbe est au-dessus de l’axe des abscisses. Le **tableau de variations** se lit en suivant la courbe de gauche à droite : elle monte (croissante) ou descend (décroissante).

## Les droites
Une droite non verticale a une équation réduite **y = mx + p**.
| Le nombre | Son nom | Sa lecture |
| m | Coefficient directeur | Quand on avance de 1 vers la droite, on monte de m (ou on descend si m < 0) |
| p | Ordonnée à l’origine | La droite coupe l’axe des ordonnées au point (0 ; p) |

= m = (yB − yA) ÷ (xB − xA)

| Signe de m | La droite |
| m > 0 | Monte |
| m < 0 | Descend |
| m = 0 | Horizontale |

## Tracer une droite
Avec un point et le coefficient directeur : on place le point, puis on avance de 1 et on monte de m. Avec l’équation : on calcule deux points, par exemple pour x = 0 et x = 2.

> Pour une lecture graphique, commence toujours par repérer les unités sur chaque axe.

## Exemple travaillé
Déterminer l’équation de la droite passant par A(0 ; −2) et B(2 ; 4).
1. m = (4 − (−2)) ÷ (2 − 0) = 6 ÷ 2 = 3.
2. La droite passe par (0 ; −2), donc p = −2.
3. Équation : **y = 3x − 2**. Vérification avec B : 3 × 2 − 2 = 4.`,
          },
          questions: [
            ['Où lit-on l’image de 2 par f ?', ['L’abscisse du point d’ordonnée 2', 'L’ordonnée du point de la courbe d’abscisse 2', 'Le point où la courbe coupe l’axe des ordonnées', 'Le point le plus haut de la courbe'], 1, 'L’image se lit sur l’axe des ordonnées.'],
            ['Les antécédents de k se lisent…', ['Sur l’axe des ordonnées', 'Au sommet de la courbe', 'Sur l’axe des abscisses', 'Sur la tangente'], 2, 'Ce sont les abscisses des points d’ordonnée k.'],
            ['Quel est le coefficient directeur de la droite passant par A(1 ; 2) et B(3 ; 8) ?', ['2', '6', '1/3', '3'], 3, '(8 − 2) ÷ (3 − 1) = 3.'],
            ['Quelle est l’ordonnée à l’origine de la droite y = −2x + 5 ?', ['5', '−2', '2', '−5'], 0, 'C’est le nombre p dans y = mx + p.'],
            ['Le point (2 ; 5) appartient à la droite d’équation y = 3x − 1.', ['Vrai', 'Faux'], 0, 'On remplace x par 2 : 3 × 2 − 1 = 5, qui est bien l’ordonnée du point. Il appartient donc à la droite.'],
            ['Quelle est l’équation de la droite de coefficient directeur 2 passant par (0 ; 1) ?', ['y = x + 2', 'y = 2x + 1', 'y = 2x', 'y = x + 1'], 1, 'm = 2 et p = 1.'],
            ['Si le coefficient directeur d’une droite est négatif, la droite…', ['Monte', 'Est horizontale', 'Descend', 'Est verticale'], 2, 'Quand on avance de 1, on descend.'],
            ['Pour résoudre graphiquement f(x) = 0, on lit…', ['Les ordonnées des points sur l’axe des ordonnées', 'Le maximum de f', 'La pente de la courbe', 'Les abscisses des points où la courbe coupe l’axe des abscisses'], 3, 'Ce sont les antécédents de 0.'],
            ['Pour résoudre graphiquement f(x) > 2, on cherche les points de la courbe…', ['Au-dessus de la droite y = 2', 'Sous la droite y = 2', 'Sur l’axe des abscisses', 'À droite de x = 2'], 0, 'Puis on lit leurs abscisses.'],
            ['Quel est le coefficient directeur d’une droite horizontale ?', ['1', '0', '−1', 'Il n’existe pas'], 1, 'Quand on avance, on ne monte ni ne descend.'],
            ['Quelle est l’équation de la droite passant par A(0 ; −2) et B(2 ; 4) ?', ['y = 2x − 2', 'y = −2x + 3', 'y = 3x − 2', 'y = 3x + 2'], 2, 'm = 6 ÷ 2 = 3 et p = −2.'],
            ['Un nombre peut avoir plusieurs images par une fonction.', ['Vrai', 'Faux'], 1, 'Une fonction associe à chaque nombre UNE seule image ; ce sont les antécédents qui peuvent être plusieurs.'],
          ],
        },
        {
          titre: 'Automatismes : statistiques et probabilités',
          axe: 'Automatismes',
          lecon: {
            titre: 'Indicateurs, tableaux croisés et probabilités conditionnelles',
            cours: `Un graphique de presse, un tableau d’enquête, un arbre : il faut savoir en tirer un nombre juste en quelques secondes.

## Lire une représentation
Avant toute lecture : repérer l’**origine**, les **unités** de chaque axe et l’**échelle**. Un axe des ordonnées qui ne commence pas à 0 grossit les écarts.

## Les indicateurs
| Indicateur | Ce qu’il mesure | Comment l’obtenir |
| Moyenne | Le centre « équilibré » | Somme des valeurs ÷ effectif total |
| Médiane | Le milieu : la moitié des valeurs en dessous | Valeurs rangées : celle du milieu (ou la moyenne des deux du milieu) |
| Quartiles Q1, Q3 | Un quart des valeurs sous Q1, trois quarts sous Q3 | Sur les valeurs rangées |
| Étendue | L’amplitude | Maximum − minimum |

La **moyenne pondérée** tient compte des coefficients : notes 10 (coefficient 1) et 16 (coefficient 2) donnent (10 + 32) ÷ 3 = **14**.

Dans un **diagramme en boîte**, la boîte va de Q1 à Q3 : elle contient environ **la moitié** des valeurs.

## Le tableau croisé d’effectifs
Enquête sur 200 élèves :
| | Sport | Pas de sport | Total |
| Filles | 48 | 72 | 120 |
| Garçons | 40 | 40 | 80 |
| Total | 88 | 112 | 200 |

| Ce qu’on calcule | Le calcul | Le résultat |
| Fréquence marginale des garçons | 80 ÷ 200 | 0,4 |
| P(F ∩ S) : fille ET sportive | 48 ÷ 200 | 0,24 |
| P_F(S) : sportive SACHANT fille | 48 ÷ 120 | 0,4 |
| P_S(F) : fille SACHANT sportive | 48 ÷ 88 | ≈ 0,55 |

= P_A(B) = P(A ∩ B) ÷ P(A)

!> P_F(S) et P_S(F) sont différentes : « sachant » change la population de référence.

## L’arbre pondéré
Sur les branches du second niveau, on lit des probabilités **conditionnelles**. La probabilité d’un chemin est le **produit** des probabilités de ses branches : si P(A) = 0,3 et P_A(B) = 0,5, alors P(A ∩ B) = 0,3 × 0,5 = **0,15**.

> Pour une probabilité conditionnelle, demande-toi d’abord : quelle est la population de départ ?

## Exemple travaillé
Dans le tableau ci-dessus, on choisit un élève sportif au hasard. Quelle est la probabilité que ce soit un garçon ?
1. Population de référence : les 88 sportifs.
2. Parmi eux, 40 garçons.
3. P_S(G) = 40 ÷ 88 = 5/11 ≈ 0,45.`,
          },
          questions: [
            ['Quelle est la moyenne de 8, 12 et 13 ?', ['10', '12', '11', '33'], 2, '(8 + 12 + 13) ÷ 3 = 33 ÷ 3 = 11.'],
            ['Quelle est la médiane de la série 3 ; 5 ; 7 ; 10 ; 20 ?', ['5', '9', '10', '7'], 3, 'C’est la valeur du milieu de la série rangée.'],
            ['Quelle est la médiane de la série 2 ; 4 ; 6 ; 8 ?', ['5', '4', '6', '20'], 0, 'Nombre pair de valeurs : moyenne des deux du milieu, (4 + 6) ÷ 2.'],
            ['L’étendue d’une série se calcule par…', ['Q3 − Q1', 'Maximum − minimum', 'Somme ÷ effectif', 'Maximum ÷ minimum'], 1, 'Q3 − Q1 est l’écart interquartile, un autre indicateur.'],
            ['Notes 10 (coefficient 1) et 16 (coefficient 2) : quelle est la moyenne ?', ['13', '12', '14', '15'], 2, '(10 + 2 × 16) ÷ 3 = 42 ÷ 3 = 14.'],
            ['Sur 200 élèves, 120 sont des filles, dont 48 sportives. Combien vaut P_F(S) ?', ['0,24', '0,55', '0,6', '0,4'], 3, '48 ÷ 120 = 0,4 : on se restreint aux filles.', 'Dans le tableau de la fiche (48 sportives sur 120 filles, 200 élèves), combien vaut P_F(S) ?'],
            ['Sur 200 élèves, 48 sont des filles sportives. Combien vaut P(F ∩ S) ?', ['0,24', '0,4', '0,6', '0,44'], 0, '48 ÷ 200 = 0,24 : on rapporte à tous les élèves.', 'Dans le même tableau, combien vaut P(F ∩ S) ?'],
            ['Sur 200 élèves, 88 sont sportifs, dont 48 filles. P_S(F) vaut…', ['48 ÷ 200', '48 ÷ 88', '48 ÷ 120', '88 ÷ 200'], 1, 'On se restreint aux 88 sportifs.', 'Dans le même tableau (88 sportifs, dont 48 filles), P_S(F) vaut…'],
            ['P_A(B) et P_B(A) sont toujours égales.', ['Vrai', 'Faux'], 1, 'La population de référence n’est pas la même.'],
            ['Dans un arbre, P(A) = 0,3 et P_A(B) = 0,5. Combien vaut P(A ∩ B) ?', ['0,8', '0,2', '0,15', '0,6'], 2, 'On multiplie les probabilités le long du chemin.'],
            ['Un tableau croisé compte 80 garçons sur 200 élèves. Quelle est la fréquence marginale des garçons ?', ['0,5', '0,6', '0,2', '0,4'], 3, '80 ÷ 200 = 0,4.', 'Dans le tableau de la fiche, quelle est la fréquence marginale des garçons ?'],
            ['Dans un diagramme en boîte, la boîte (de Q1 à Q3) contient…', ['Environ la moitié des valeurs', 'Toutes les valeurs', 'Environ un quart des valeurs', 'Seulement la médiane'], 0, 'Un quart des valeurs est sous Q1, un quart au-dessus de Q3.'],
          ],
        },
        // ---- Analyse : suites ----------------------------------------------
        {
          titre: 'Les suites numériques : générer et représenter',
          axe: 'Analyse',
          lecon: {
            titre: 'Des évolutions pas à pas',
            cours: `Le nombre d’abonnés d’une chaîne mois après mois, un capital année après année : quand une grandeur évolue par **étapes**, on la modélise par une **suite**.

## Qu’est-ce qu’une suite ?
Une suite associe à chaque entier naturel n un nombre noté **u(n)**, le **terme de rang n**. On écrit aussi u_n.

!> u(n) ne veut pas dire u × n : c’est le terme numéro n.

## Deux façons de générer une suite
| Mode | Ce qu’on donne | Exemple | Avantage |
| **Explicite** | u(n) en fonction de n | u(n) = 3n + 1 | On calcule u(100) directement |
| **Par récurrence** | Le premier terme et le passage d’un terme au suivant | u(0) = 2 et u(n+1) = 2u(n) − 1 | Colle à un processus réel, étape par étape |

Avec la récurrence, pour obtenir u(10), il faut calculer **tous les termes précédents**.

## Représenter une suite
On place les points de coordonnées (n ; u(n)) : c’est un **nuage de points isolés**, jamais une courbe continue, puisque n ne prend que des valeurs entières.

## Le sens de variation
| Si pour tout n… | La suite est… |
| u(n+1) − u(n) > 0 | Croissante |
| u(n+1) − u(n) < 0 | Décroissante |
| u(n+1) − u(n) = 0 | Constante |

Exemple : u(n) = 5 − 2n. u(n+1) − u(n) = 5 − 2(n+1) − (5 − 2n) = −2 < 0 : la suite est **décroissante**.

Toutes les suites ne sont ni arithmétiques ni géométriques : u(n) = n² ou u(n) = 1 ÷ (n+1) en sont des exemples.

## Chercher un seuil avec un algorithme
Question classique : à partir de quel rang la suite dépasse-t-elle 100 ? Pour u(0) = 2 et u(n+1) = 2u(n) − 1, on programme une boucle qui calcule les termes tant que le seuil n’est pas franchi.

\`\`\`
n ← 0
u ← 2
tant que u ≤ 100 :
    n ← n + 1
    u ← 2 × u − 1
afficher n
\`\`\`

L’algorithme affiche le **premier rang** pour lequel u(n) > 100.

> Explicite : on saute directement au rang voulu. Récurrence : on avance pas à pas.

## Exemple travaillé
u(0) = 2 et u(n+1) = 2u(n) − 1.
1. u(1) = 2 × 2 − 1 = 3.
2. u(2) = 2 × 3 − 1 = 5.
3. u(3) = 2 × 5 − 1 = 9.
Les écarts (1, 2, 4) ne sont pas constants et les quotients (1,5 ; 1,67 ; 1,8) non plus : la suite n’est ni arithmétique ni géométrique.`,
          },
          questions: [
            ['Si u(n) = 3n + 1, combien vaut u(4) ?', ['12', '7', '16', '13'], 3, '3 × 4 + 1 = 13.'],
            ['u(0) = 2 et u(n+1) = 2u(n) − 1. Combien vaut u(2) ?', ['5', '3', '4', '9'], 0, 'u(1) = 3, puis u(2) = 2 × 3 − 1 = 5.'],
            ['Si u(n) = n², combien vaut u(3) ?', ['6', '9', '3', '12'], 1, 'On remplace n par 3 : u(3) = 3² = 9.'],
            ['Comment représente-t-on graphiquement une suite ?', ['Par une courbe continue', 'Par un histogramme', 'Par des points isolés (n ; u(n))', 'Par une droite'], 2, 'n ne prend que des valeurs entières.'],
            ['Si u(n+1) − u(n) > 0 pour tout n, la suite est…', ['Décroissante', 'Constante', 'Géométrique', 'Croissante'], 3, 'Chaque terme dépasse le précédent.'],
            ['La suite u(n) = 5 − 2n est…', ['Décroissante', 'Croissante', 'Constante', 'Ni croissante ni décroissante'], 0, 'u(n+1) − u(n) = −2 < 0.'],
            ['Pour calculer u(10) d’une suite définie par récurrence, il faut calculer les termes précédents.', ['Vrai', 'Faux'], 0, 'Chaque terme se calcule à partir du précédent.'],
            ['Si u(n) = n² − n, combien vaut u(2) ?', ['0', '2', '4', '6'], 1, 'On remplace n par 2 : u(2) = 2² − 2 = 4 − 2 = 2.'],
            ['Si u(n) = 1 ÷ (n + 1), combien vaut u(3) ?', ['1/3', '3', '1/4', '4'], 2, 'On remplace n par 3 : u(3) = 1 ÷ (3 + 1) = 1/4.'],
            ['Dans l’algorithme de seuil de la fiche, que signifie la condition « tant que u ≤ 100 » ?', ['On calcule exactement 100 termes', 'On s’arrête quand u vaut 0', 'On affiche tous les termes inférieurs à 100', 'On s’arrête au premier terme strictement supérieur à 100'], 3, 'La boucle continue tant que le seuil n’est pas franchi.'],
            ['« Chaque mois, on ajoute 50 € puis on retire 2 % » décrit plutôt une suite définie…', ['Par récurrence', 'De façon explicite', 'Par une fonction affine', 'Par un tableau croisé'], 0, 'On passe d’un terme au suivant par une règle.'],
            ['Que désigne la notation u(n) ?', ['Le produit de u par n', 'Le terme de rang n de la suite', 'La somme des n premiers termes', 'La raison de la suite'], 1, 'C’est la confusion de notation la plus fréquente.'],
          ],
        },
        {
          titre: 'Les suites arithmétiques',
          axe: 'Analyse',
          lecon: {
            titre: 'Ajouter toujours la même quantité',
            cours: `Un abonnement qui coûte 30 € puis 5 € de plus chaque mois, un salaire qui augmente de 40 € par an : quand on **ajoute toujours la même quantité**, la suite est **arithmétique**. On parle de **croissance linéaire**.

## Définition
Une suite est arithmétique de **raison r** si, pour tout n :
= u(n+1) = u(n) + r

Pour **démontrer** qu’une suite est arithmétique, on calcule u(n+1) − u(n) et on montre que ce nombre est **constant**.

## Le terme de rang n
= u(n) = u(0) + n × r
= u(n) = u(1) + (n − 1) × r

Plus généralement, pour deux rangs p et n : u(n) = u(p) + (n − p) × r.

## Le sens de variation
| La raison | La suite |
| r > 0 | Croissante |
| r < 0 | Décroissante |
| r = 0 | Constante |

## La représentation graphique
Les points (n ; u(n)) sont **alignés** : ils sont sur la droite d’équation y = rx + u(0). C’est le lien avec les fonctions affines.

## Reconnaître le modèle
| Situation | Modèle arithmétique ? |
| « + 40 € chaque année » | Oui, r = 40 |
| « − 3 élèves par an » | Oui, r = −3 |
| « + 3 % par an » | Non : c’est une évolution relative, donc géométrique |
| 2 ; 6 ; 18 ; 54 | Non : les écarts 4, 12, 36 ne sont pas constants |

> Arithmétique = écart constant = évolution absolue constante.

## Au tableur
En A1 on écrit le rang 0, en B1 le premier terme. Pour la récurrence, on tape en B2 la formule =B1+15 et on la recopie vers le bas : chaque cellule reprend la précédente et ajoute la raison. Pour la forme explicite, on tape =250+15*A2 : chaque cellule se calcule directement à partir du rang. Les deux colonnes doivent donner les mêmes nombres, ce qui est une bonne vérification.

## Chercher un seuil
Avec u(0) = 10 et r = 7, quand dépasse-t-on 100 ?
10 + 7n > 100 donne 7n > 90, soit n > 12,86… Le premier rang est **n = 13** (u(13) = 101).

## Exemple travaillé
Une salle de sport compte 250 inscrits en janvier (n = 0) et gagne 15 inscrits par mois.
1. u(n+1) = u(n) + 15 : suite arithmétique de raison 15.
2. u(n) = 250 + 15n.
3. En décembre (n = 11) : u(11) = 250 + 165 = **415** inscrits.
4. On atteint 400 quand 15n ≥ 150, soit n ≥ 10 : en novembre.`,
          },
          questions: [
            ['u(0) = 4 et r = 3. Combien vaut u(5) ?', ['19', '15', '12', '23'], 0, 'u(5) = 4 + 5 × 3 = 19.'],
            ['u(1) = 10 et r = −2. Combien vaut u(6) ?', ['−2', '0', '−12', '22'], 1, 'u(6) = u(1) + 5 × (−2) = 0.'],
            ['Pour démontrer qu’une suite est arithmétique, on montre que…', ['u(n+1) ÷ u(n) est constant', 'u(n) est positif', 'u(n+1) − u(n) est constant', 'u(n) augmente'], 2, 'Cette différence constante est la raison.'],
            ['Quelle est la raison de la suite arithmétique 7 ; 11 ; 15 ; … ?', ['7', '11', '1,5', '4'], 3, 'On passe d’un terme au suivant en ajoutant toujours le même nombre : 11 − 7 = 15 − 11 = 4.'],
            ['Une suite arithmétique de raison négative est…', ['Décroissante', 'Croissante', 'Constante', 'Géométrique'], 0, 'On retire toujours la même quantité.'],
            ['Les points représentant une suite arithmétique sont alignés.', ['Vrai', 'Faux'], 0, 'Ils sont sur la droite y = rx + u(0).'],
            ['La suite u(n) = 5n − 3 est arithmétique de raison…', ['−3', '5', '2', '−5'], 1, 'u(n+1) − u(n) = 5.'],
            ['La suite 2 ; 6 ; 18 ; 54 est arithmétique.', ['Vrai', 'Faux'], 1, 'Les écarts 4, 12, 36 ne sont pas constants ; les quotients le sont : elle est géométrique.'],
            ['Un salaire de 1 500 € augmente de 40 € chaque année. Quel modèle convient ?', ['Suite géométrique de raison 40', 'Suite géométrique de raison 1,04', 'Suite arithmétique de raison 40', 'Aucun'], 2, 'On ajoute une quantité fixe chaque année.'],
            ['u(0) = 2 et u(10) = 32. Quelle est la raison de cette suite arithmétique ?', ['30', '16', '2', '3'], 3, '32 = 2 + 10r, donc r = 3.'],
            ['u(0) = 10 et r = 7. À partir de quel rang u(n) dépasse-t-il 100 ?', ['13', '12', '14', '90'], 0, '10 + 7n > 100 donne n > 12,86 : le premier entier est 13.'],
            ['Une suite arithmétique modélise une…', ['Évolution relative constante', 'Évolution absolue constante', 'Évolution aléatoire', 'Évolution exponentielle'], 1, 'On ajoute toujours la même quantité : croissance linéaire.'],
          ],
        },
        {
          titre: 'Les suites géométriques',
          axe: 'Analyse',
          lecon: {
            titre: 'Multiplier toujours par le même nombre',
            cours: `Un capital placé à 2 % par an, une population qui baisse de 5 % chaque année : quand une grandeur évolue d’un **même pourcentage** à chaque étape, on la **multiplie** toujours par le même nombre. La suite est **géométrique** ; on parle de **croissance exponentielle**.

## Définition
Une suite (à termes strictement positifs) est géométrique de **raison q** (q > 0) si, pour tout n :
= u(n+1) = q × u(n)

Pour **démontrer** qu’une suite est géométrique, on montre que le quotient u(n+1) ÷ u(n) est **constant**.

## Du pourcentage à la raison
| Évolution à chaque étape | Raison q |
| + 3 % | 1,03 |
| + 10 % | 1,1 |
| − 5 % | 0,95 |
| − 20 % | 0,8 |

## Le terme de rang n
= u(n) = u(0) × q^n
= u(n) = u(1) × q^(n−1)

## Le sens de variation (termes positifs)
| La raison | La suite |
| q > 1 | Croissante |
| 0 < q < 1 | Décroissante |
| q = 1 | Constante |

## Deux croissances comparées
| | Arithmétique | Géométrique |
| On passe au terme suivant en… | Ajoutant r | Multipliant par q |
| Évolution | Absolue constante | Relative constante |
| Points | Alignés | Sur une courbe qui s’incurve |

Pour q > 1, une suite géométrique finit **toujours** par dépasser n’importe quelle suite arithmétique, même si elle part plus bas : la croissance exponentielle l’emporte à long terme.

!> Ne confonds pas : « + 3 % par an » est géométrique (q = 1,03), « + 3 € par an » est arithmétique (r = 3).

> Géométrique = quotient constant = pourcentage d’évolution constant.

## Chercher un seuil
Sans calculatrice ni logarithme, on avance terme à terme. Une population de 1 000 bactéries double chaque heure : u(n) = 1 000 × 2^n. Quand dépasse-t-elle 10 000 ? u(3) = 8 000 et u(4) = 16 000 : c’est au bout de **4 heures**. Au tableur ou en Python, une boucle « tant que u ≤ 10 000 » donne le même rang.

## Exemple travaillé
On place 1 000 € à 10 % d’intérêts composés par an.
1. u(n+1) = 1,1 × u(n) : suite géométrique de raison 1,1.
2. u(n) = 1 000 × 1,1^n.
3. u(1) = 1 100 € ; u(2) = 1 000 × 1,21 = **1 210 €**.
4. Les intérêts de la 2e année (110 €) dépassent ceux de la 1re (100 €) : ce sont les intérêts des intérêts.`,
          },
          questions: [
            ['u(0) = 3 et q = 2. Combien vaut u(4) ?', ['24', '48', '11', '96'], 1, 'u(4) = 3 × 2⁴ = 3 × 16 = 48.'],
            ['Une hausse de 3 % par an correspond à une raison de…', ['3', '0,03', '1,03', '1,3'], 2, 'Coefficient multiplicateur : 1 + 3/100.'],
            ['Une baisse de 20 % par an correspond à une raison de…', ['0,2', '−0,2', '1,2', '0,8'], 3, '1 − 20/100 = 0,8.'],
            ['Quelle est la raison de la suite géométrique 5 ; 15 ; 45 ; … ?', ['3', '10', '5', '30'], 0, 'On passe d’un terme au suivant en multipliant toujours par le même nombre : 15 ÷ 5 = 45 ÷ 15 = 3.'],
            ['Une suite géométrique de raison q telle que 0 < q < 1 (termes positifs) est…', ['Croissante', 'Décroissante', 'Constante', 'Arithmétique'], 1, 'On multiplie par un nombre plus petit que 1.'],
            ['Si u(n) = 100 × 0,9^n, combien vaut u(2) ?', ['80', '90', '81', '18'], 2, '100 × 0,81 = 81.'],
            ['u(1) = 2 et q = 5. Combien vaut u(3) ?', ['10', '250', '12', '50'], 3, 'u(3) = 2 × 5² = 50.'],
            ['La suite 2 ; 4 ; 6 ; 8 est géométrique.', ['Vrai', 'Faux'], 1, 'Les quotients 2 ; 1,5 ; 1,33 ne sont pas constants : elle est arithmétique.'],
            ['Une suite géométrique modélise une…', ['Évolution relative constante', 'Évolution absolue constante', 'Évolution sans régularité', 'Croissance linéaire'], 0, 'Même pourcentage à chaque étape : croissance exponentielle.'],
            ['1 000 € placés à 10 % d’intérêts composés deviennent, au bout de 2 ans…', ['1 200 €', '1 210 €', '1 100 €', '1 020 €'], 1, '1 000 × 1,1² = 1 210.'],
            ['Pour démontrer qu’une suite à termes positifs est géométrique, on montre que…', ['u(n+1) − u(n) est constant', 'u(n) est croissante', 'u(n+1) ÷ u(n) est constant', 'u(0) = 1'], 2, 'Ce quotient constant est la raison q.'],
            ['Pour q > 1, une suite géométrique finit par dépasser n’importe quelle suite arithmétique.', ['Vrai', 'Faux'], 0, 'La croissance exponentielle l’emporte toujours à long terme.'],
          ],
        },
        // ---- Analyse : fonctions ---------------------------------------------
        {
          titre: 'Les fonctions polynômes du second degré',
          axe: 'Analyse',
          lecon: {
            titre: 'Paraboles, racines et signe',
            cours: `La trajectoire d’un ballon, le bénéfice d’une entreprise selon la quantité produite : beaucoup de situations se modélisent par une fonction du **second degré**, dont la courbe est une **parabole**.

## La forme générale
f(x) = ax² + bx + c avec **a ≠ 0**.

| Le signe de a | La parabole | L’extremum |
| a > 0 | Ouverte vers le haut | Un **minimum** au sommet |
| a < 0 | Ouverte vers le bas | Un **maximum** au sommet |

## Trois formes à reconnaître
| La forme | Ce qu’on en lit |
| f(x) = ax² | Sommet O(0 ; 0), axe de symétrie x = 0 |
| f(x) = ax² + c | Sommet (0 ; c), axe de symétrie x = 0 |
| f(x) = a(x − x1)(x − x2) | Racines x1 et x2, axe de symétrie x = (x1 + x2) ÷ 2 |

La parabole est **symétrique** par rapport à la droite verticale passant par son sommet : l’abscisse du sommet est au milieu des racines.

## Les racines et le signe
Une **racine** est un nombre x tel que f(x) = 0. Pour **vérifier** que 3 est racine de x² − x − 6 : 9 − 3 − 6 = 0.

Si l’on connaît une racine, on peut **factoriser** : x² − x − 6 = (x − 3)(x + 2).

Signe de a(x − x1)(x − x2) avec x1 < x2 :
| x | avant x1 | entre x1 et x2 | après x2 |
| f(x) | signe de a | signe contraire de a | signe de a |

!> Le calcul des racines par le discriminant n’est pas au programme : on travaille avec la forme factorisée, des racines évidentes ou le graphique.

## Trouver l’axe sans formule
Pour f(x) = x² − 4x + 7 : f(x) = 7 revient à x² − 4x = 0, soit x(x − 4) = 0. Les points d’abscisses 0 et 4 ont la même image : l’axe est au milieu, **x = 2**, et le sommet est (2 ; f(2)) = (2 ; 3).

> Deux points de même ordonnée sur une parabole : l’axe de symétrie passe au milieu.

## Exemple travaillé
f(x) = 2(x − 1)(x − 5).
1. Racines : 1 et 5.
2. Axe de symétrie : x = (1 + 5) ÷ 2 = 3.
3. Sommet : f(3) = 2 × 2 × (−2) = −8. Comme a = 2 > 0, **−8 est le minimum**.
4. Signe : f(x) < 0 sur ]1 ; 5[, f(x) > 0 en dehors.`,
          },
          questions: [
            ['La parabole de f(x) = −3x² + 1 est…', ['Ouverte vers le haut', 'Une droite', 'Ouverte vers le bas', 'Symétrique par rapport à l’axe des abscisses'], 2, 'Le coefficient de x² est a = −3, négatif : la parabole est tournée vers le bas.'],
            ['Quelles sont les racines de f(x) = (x − 2)(x + 4) ?', ['2 et 4', '−2 et 4', '−2 et −4', '2 et −4'], 3, 'x − 2 = 0 ou x + 4 = 0.'],
            ['Quel est l’axe de symétrie de la parabole de f(x) = 2(x − 1)(x − 5) ?', ['x = 3', 'x = 1', 'x = 5', 'x = 6'], 0, 'Au milieu des racines : (1 + 5) ÷ 2.'],
            ['Quel est le minimum de f(x) = 2(x − 1)(x − 5) ?', ['3', '−8', '0', '8'], 1, 'f(3) = 2 × 2 × (−2) = −8.'],
            ['Sur ]1 ; 5[, le signe de (x − 1)(x − 5) est…', ['Positif', 'Nul', 'Négatif', 'Variable'], 2, 'Entre les racines : signe contraire de a = 1.'],
            ['Quel est le sommet de la parabole de f(x) = x² + 4 ?', ['(4 ; 0)', '(0 ; 0)', '(−4 ; 0)', '(0 ; 4)'], 3, 'Pour ax² + c, le sommet est (0 ; c).'],
            ['3 est-il une racine de x² − x − 6 ?', ['Oui, car 9 − 3 − 6 = 0', 'Non, car 9 − 3 − 6 = 6', 'Non, les racines sont négatives', 'On ne peut pas savoir sans discriminant'], 0, 'On remplace x par 3 et on trouve 0.'],
            ['Quelle est une forme factorisée de x² − x − 6 ?', ['(x + 3)(x − 2)', '(x − 3)(x + 2)', '(x − 6)(x + 1)', '(x − 3)(x − 2)'], 1, 'Vérification : x² + 2x − 3x − 6 = x² − x − 6.'],
            ['Pour f(x) = x² − 4x + 7, quel est l’axe de symétrie ?', ['x = 4', 'x = 7', 'x = 2', 'x = −2'], 2, 'f(0) = f(4) = 7 : l’axe passe au milieu de 0 et 4.'],
            ['Si a > 0, la fonction f(x) = ax² + bx + c admet un maximum.', ['Vrai', 'Faux'], 1, 'Parabole ouverte vers le haut : c’est un minimum.'],
            ['Pour f(x) = −(x − 1)(x − 3), sur quel intervalle f(x) > 0 ?', [']−∞ ; 1[', ']3 ; +∞[', 'Jamais', ']1 ; 3['], 3, 'a = −1 < 0 : f est positive entre les racines.'],
            ['Une parabole a pour racines −2 et 6. L’abscisse de son sommet est…', ['2', '4', '−2', '8'], 0, '(−2 + 6) ÷ 2 = 2.'],
          ],
        },
        // ---- Analyse : dérivation -----------------------------------------
        {
          titre: 'Taux de variation, nombre dérivé et tangente',
          axe: 'Analyse',
          lecon: {
            titre: 'De la vitesse moyenne à la vitesse instantanée',
            cours: `Un compteur de voiture affiche une vitesse **à un instant**, pas une moyenne sur le trajet. Le **nombre dérivé** est l’outil mathématique de cette vitesse instantanée.

## Le taux de variation
Entre deux valeurs a et b de la variable :
= taux de variation = (f(b) − f(a)) ÷ (b − a)

C’est le **coefficient directeur de la sécante** passant par les points A(a ; f(a)) et B(b ; f(b)). Pour la fonction carré entre 1 et 3 : (9 − 1) ÷ (3 − 1) = **4**.

Si d(t) est la distance parcourue au temps t, le taux de variation entre deux instants est une **vitesse moyenne**.

## Le nombre dérivé
On rapproche b de a en posant b = a + h, avec h de plus en plus petit :
= taux en a = (f(a + h) − f(a)) ÷ h

Quand h se rapproche de 0, ce taux se rapproche d’un nombre : le **nombre dérivé** de f en a, noté **f′(a)**.

Pour f(x) = x² en a = 1 : ((1 + h)² − 1) ÷ h = (2h + h²) ÷ h = **2 + h**. Quand h tend vers 0, on obtient **f′(1) = 2**.

## La tangente
Quand B se rapproche de A, la sécante (AB) se rapproche d’une position limite : la **tangente** à la courbe en A.

> f′(a) est le coefficient directeur de la tangente à la courbe au point d’abscisse a.

= équation de la tangente : y = f′(a)(x − a) + f(a)

| f′(a) | La tangente en a |
| f′(a) > 0 | Monte |
| f′(a) < 0 | Descend |
| f′(a) = 0 | Horizontale |

## Lire un nombre dérivé sur un graphique
On lit le coefficient directeur de la tangente tracée : si elle passe par (0 ; 1) et (2 ; 5), alors f′(a) = (5 − 1) ÷ (2 − 0) = **2**.

## Dans les autres disciplines
| Domaine | Le taux de variation | Le nombre dérivé |
| Mouvement | Vitesse moyenne | Vitesse instantanée |
| Économie | Coût moyen d’un lot supplémentaire | **Coût marginal** |

## Exemple travaillé
f(2) = 5 et f′(2) = 3. Équation de la tangente en 2 :
1. y = 3(x − 2) + 5.
2. y = 3x − 6 + 5, soit **y = 3x − 1**.
3. Vérification : pour x = 2, y = 5, la tangente passe bien par le point de la courbe.`,
          },
          questions: [
            ['Quel est le taux de variation de la fonction carré entre 1 et 3 ?', ['2', '8', '9', '4'], 3, '(9 − 1) ÷ (3 − 1) = 4.'],
            ['Le taux de variation entre a et b est le coefficient directeur…', ['De la sécante passant par A et B', 'De la tangente en a', 'De l’axe des abscisses', 'De la droite y = x'], 0, 'Il mesure la pente moyenne entre A et B.'],
            ['Le nombre dérivé f′(a) est le coefficient directeur…', ['De la sécante', 'De la tangente à la courbe au point d’abscisse a', 'De la droite passant par l’origine', 'De l’axe de symétrie'], 1, 'C’est l’interprétation géométrique du nombre dérivé.'],
            ['f(2) = 5 et f′(2) = 3. Quelle est l’équation de la tangente en 2 ?', ['y = 3x + 5', 'y = 5x + 3', 'y = 3x − 1', 'y = 3x − 6'], 2, 'y = 3(x − 2) + 5 = 3x − 1.'],
            ['Pour f(x) = x², le taux de variation entre 1 et 1 + h vaut…', ['2', 'h', '1 + h', '2 + h'], 3, '((1 + h)² − 1) ÷ h = (2h + h²) ÷ h.'],
            ['Pour f(x) = x², combien vaut f′(1) ?', ['2', '1', '0', '4'], 0, 'Quand h tend vers 0, 2 + h tend vers 2.'],
            ['Si la tangente en a est horizontale, alors…', ['f(a) = 0', 'f′(a) = 0', 'f′(a) = 1', 'f n’est pas dérivable'], 1, 'Une droite horizontale a un coefficient directeur nul.'],
            ['Dans un mouvement, le nombre dérivé de la position par rapport au temps est…', ['La distance totale', 'La vitesse moyenne', 'La vitesse instantanée', 'L’accélération moyenne'], 2, 'Le taux de variation donne la vitesse moyenne.'],
            ['La tangente tracée en a passe par (0 ; 1) et (2 ; 5). Combien vaut f′(a) ?', ['1', '4', '5', '2'], 3, '(5 − 1) ÷ (2 − 0) = 2.'],
            ['Si f′(a) < 0, la tangente en a descend.', ['Vrai', 'Faux'], 0, 'Son coefficient directeur est négatif.'],
            ['En économie, le nombre dérivé de la fonction coût est relié…', ['Au coût marginal', 'Au coût moyen', 'Au prix de vente', 'Au bénéfice total'], 0, 'Il mesure le coût d’une unité supplémentaire.'],
            ['Un mobile est à 0 m à t = 0 s et à 20 m à t = 4 s. Sa vitesse moyenne est…', ['4 m/s', '5 m/s', '20 m/s', '80 m/s'], 1, '(20 − 0) ÷ (4 − 0) = 5 m/s.'],
          ],
        },
        {
          titre: 'Fonction dérivée et sens de variation',
          axe: 'Analyse',
          lecon: {
            titre: 'Le signe de la dérivée dit si la courbe monte',
            cours: `Plutôt que de calculer un nombre dérivé point par point, on calcule d’un coup la **fonction dérivée** f′. Son **signe** donne alors toutes les variations de f.

## Les dérivées à connaître
| La fonction f(x) | Sa dérivée f′(x) |
| k (constante) | 0 |
| x | 1 |
| x² | 2x |
| x³ | 3x² |
| k × u(x) | k × u′(x) |
| u(x) + v(x) | u′(x) + v′(x) |

Avec ces règles, on dérive tout polynôme de degré au plus 3 : si f(x) = x³ − 4x + 7, alors **f′(x) = 3x² − 4**.

## Du signe de f′ aux variations de f
| Sur un intervalle I | Alors f est… |
| f′(x) > 0 | Croissante sur I |
| f′(x) < 0 | Décroissante sur I |
| f′(x) = 0 | Constante sur I |

Un **extremum local** se trouve là où f′ **s’annule en changeant de signe** : de + à −, c’est un maximum ; de − à +, un minimum.

!> f′(a) = 0 ne suffit pas : pour f(x) = x³, f′(0) = 0 mais f′ reste positive des deux côtés, et f n’a pas d’extremum en 0.

## La méthode complète
1. Calculer f′(x).
2. Étudier son **signe** (factoriser si besoin, tableau de signes).
3. Dresser le **tableau de variations**.
4. Calculer les **extremums** en remplaçant x par les valeurs trouvées dans f (et non dans f′).

## Exemple travaillé
f(x) = x³ − 3x sur les réels.
1. f′(x) = 3x² − 3 = 3(x² − 1) = 3(x − 1)(x + 1).
2. Signe : f′(x) > 0 si x < −1 ou x > 1 ; f′(x) < 0 sur ]−1 ; 1[.

| x | avant −1 | −1 | entre −1 et 1 | 1 | après 1 |
| f′(x) | + | 0 | − | 0 | + |
| f | croissante | 2 | décroissante | −2 | croissante |

3. f(−1) = −1 + 3 = **2** (maximum local) ; f(1) = 1 − 3 = **−2** (minimum local).

## Un exemple économique
Le bénéfice d’un atelier est B(x) = −2x² + 8x (en milliers d’euros, x en centaines d’objets). B′(x) = −4x + 8 s’annule en x = 2, positif avant, négatif après : le bénéfice est **maximal pour 200 objets**, et vaut B(2) = −8 + 16 = 8, soit 8 000 €.

> La dérivée ne donne pas la valeur de f, elle donne sa pente : c’est f qui donne les extremums.`,
          },
          questions: [
            ['Quelle est la dérivée de f(x) = 5x² ?', ['10x', '5x', '10x²', '2x'], 0, '(k × x²)′ = k × 2x.'],
            ['Quelle est la dérivée de f(x) = x³ − 4x + 7 ?', ['3x² − 4x', '3x² − 4', 'x² − 4', '3x² − 4 + 7'], 1, 'La dérivée d’une constante est nulle.'],
            ['La dérivée d’une fonction constante est…', ['1', 'La constante elle-même', '0', 'x'], 2, 'Une constante ne varie pas.'],
            ['Si f′(x) > 0 sur un intervalle, f y est…', ['Décroissante', 'Constante', 'Négative', 'Croissante'], 3, 'Le signe de la dérivée donne le sens de variation.'],
            ['Pour B(x) = −2x² + 8x, en quelle valeur de x le bénéfice est-il maximal ?', ['x = 2', 'x = 4', 'x = 8', 'x = −2'], 0, 'B′(x) = −4x + 8 s’annule en 2 en passant de + à −.'],
            ['Si f′(a) = 0, alors f admet toujours un extremum en a.', ['Vrai', 'Faux'], 1, 'Contre-exemple : x³ en 0. Il faut que f′ change de signe.'],
            ['f′(x) = 3(x − 1)(x + 1). Quel est le signe de f′ sur ]−1 ; 1[ ?', ['Positif', 'Négatif', 'Nul', 'Il change de signe'], 1, 'Entre les racines, signe contraire du coefficient 3.'],
            ['Pour f(x) = x³ − 3x, quelle est la valeur du maximum local ?', ['−2', '0', '2', '3'], 2, 'Il est atteint en −1 : f(−1) = −1 + 3 = 2.'],
            ['Quelle est la dérivée de f(x) = 2x³ ?', ['6x³', '2x²', '3x²', '6x²'], 3, 'La dérivée de x³ est 3x² ; le coefficient 2 reste devant : 2 × 3x² = 6x².'],
            ['Quelle est la dérivée de f(x) = 4x − x² ?', ['4 − 2x', '4 − x', '4x − 2x', '−2x'], 0, 'La dérivée de 4x est 4, celle de x² est 2x.'],
            ['Quel est le coefficient directeur de la tangente en 2 à la courbe de f(x) = x³ ?', ['8', '12', '6', '4'], 1, 'f′(x) = 3x², donc f′(2) = 12.'],
            ['Pour calculer la valeur d’un extremum, on remplace x…', ['Dans f′', 'Dans la tangente', 'Dans f', 'Par 0'], 2, 'f′ donne où se trouve l’extremum, f donne sa valeur.'],
          ],
        },
        // ---- Statistiques et probabilités --------------------------------------
        {
          titre: 'Séries statistiques à deux variables',
          axe: 'Statistiques et probabilités',
          lecon: {
            titre: 'Nuage de points, point moyen et ajustement affine',
            cours: `La tension aux bornes d’une résistance et l’intensité, les dépenses de publicité et les ventes, l’âge d’un arbre et sa hauteur : quand on relève **deux grandeurs** sur les mêmes individus, on cherche s’il existe une relation entre elles.

## Le nuage de points
Une série à deux variables est une liste de couples (x_i ; y_i). On les représente par un **nuage de points** dans un repère. Si les points semblent à peu près **alignés**, on peut chercher une droite qui les résume : c’est un **ajustement affine**.

## Le point moyen
= G(x̄ ; ȳ), avec x̄ la moyenne des x_i et ȳ la moyenne des y_i

Exemple : x = 1 ; 2 ; 3 ; 4 et y = 3 ; 5 ; 6 ; 10. Alors x̄ = 10 ÷ 4 = 2,5 et ȳ = 24 ÷ 4 = 6 : **G(2,5 ; 6)**.

## Trois façons d’ajuster
| La méthode | Le principe |
| **Au jugé** | On trace à la règle une droite qui passe « au milieu » du nuage, de préférence par G |
| **Méthode de Mayer** | On coupe le nuage en deux groupes, on calcule leurs points moyens G1 et G2, la droite passe par G1 et G2 |
| **Moindres carrés** | La droite y = ax + b qui rend la plus petite possible la somme des carrés des écarts verticaux, Σ (y_i − (ax_i + b))² ; on l’obtient à la calculatrice ou au tableur |

La droite de Mayer et celle des moindres carrés passent toutes les deux par le point moyen G.

## Interpoler, extrapoler
| | Ce qu’on fait | Le risque |
| **Interpoler** | Estimer une valeur **à l’intérieur** du domaine observé | Faible si le nuage est bien aligné |
| **Extrapoler** | Prévoir **au-delà** des données | Élevé : rien ne garantit que la tendance continue |

!> Un bon ajustement ne prouve pas que x est la cause de y : deux grandeurs peuvent évoluer ensemble sous l’effet d’une troisième.

> Un ajustement est un modèle : il résume les données, il ne les remplace pas.

## Exemple travaillé (méthode de Mayer)
Avec la série ci-dessus :
1. Premier groupe (x = 1 ; 2) : G1(1,5 ; 4). Second groupe (x = 3 ; 4) : G2(3,5 ; 8).
2. Coefficient directeur : a = (8 − 4) ÷ (3,5 − 1,5) = 2.
3. 4 = 2 × 1,5 + b, donc b = 1 : la droite est **y = 2x + 1**.
4. Contrôle : elle passe par G, car 2 × 2,5 + 1 = 6.
5. Extrapolation pour x = 6 : y = 13, estimation à prendre avec prudence.`,
          },
          questions: [
            ['Quel est le point moyen de la série x : 2 ; 4 ; 6 et y : 10 ; 20 ; 36 ?', ['(4 ; 20)', '(4 ; 22)', '(6 ; 22)', '(12 ; 66)'], 1, 'x̄ = 12 ÷ 3 = 4 et ȳ = 66 ÷ 3 = 22.'],
            ['La méthode des moindres carrés rend minimale…', ['La somme des écarts horizontaux', 'La distance entre deux points', 'La somme des carrés des écarts verticaux Σ (y_i − (ax_i + b))²', 'L’étendue des y_i'], 2, 'C’est ce qui lui donne son nom.'],
            ['La droite des moindres carrés passe par le point moyen G.', ['Vrai', 'Faux'], 0, 'Comme la droite de Mayer.'],
            ['Interpoler, c’est estimer une valeur…', ['Au-delà des données observées', 'Au hasard', 'Pour x = 0 seulement', 'À l’intérieur du domaine observé'], 3, 'Extrapoler, c’est aller au-delà.'],
            ['Pourquoi une extrapolation est-elle risquée ?', ['Rien ne garantit que la tendance continue hors des données', 'Elle demande une calculatrice', 'Elle est toujours fausse', 'Elle n’utilise pas la droite'], 0, 'Le modèle n’a été vérifié que sur le domaine observé.'],
            ['Avec l’ajustement y = 2x + 1, quelle estimation obtient-on pour x = 6 ?', ['12', '13', '14', '8'], 1, '2 × 6 + 1 = 13.'],
            ['Dans la méthode de Mayer, la droite passe par…', ['Les deux points extrêmes du nuage', 'L’origine du repère', 'Les points moyens de deux groupes de points', 'Le point le plus haut'], 2, 'On partage le nuage en deux groupes.'],
            ['Une droite passe par G1(1 ; 3) et G2(5 ; 11). Quelle est son équation ?', ['y = 3x', 'y = 2x + 3', 'y = 8x − 5', 'y = 2x + 1'], 3, 'a = 8 ÷ 4 = 2, puis 3 = 2 + b donc b = 1.'],
            ['Quand envisage-t-on un ajustement affine ?', ['Quand les points semblent à peu près alignés', 'Quand le nuage a une forme de cercle', 'Quand il y a moins de 3 points', 'Toujours'], 0, 'Le modèle affine suppose une tendance rectiligne.'],
            ['Avec l’ajustement y = 1,5x + 4, quelle estimation obtient-on pour x = 10 ?', ['15', '19', '14', '40'], 1, '1,5 × 10 + 4 = 19.'],
            ['Quelle est la moyenne des valeurs x : 1 ; 2 ; 3 ; 4 ?', ['2', '3', '2,5', '10'], 2, 'On additionne les valeurs et on divise par leur nombre : (1 + 2 + 3 + 4) ÷ 4 = 10 ÷ 4 = 2,5.'],
            ['Un bon ajustement affine prouve que x est la cause de y.', ['Vrai', 'Faux'], 1, 'Corrélation n’est pas causalité : une troisième grandeur peut agir sur les deux.'],
          ],
        },
        {
          titre: 'Probabilités conditionnelles et indépendance',
          axe: 'Statistiques et probabilités',
          lecon: {
            titre: 'Arbres pondérés, probabilités totales et indépendance',
            cours: `Savoir qu’un événement s’est produit change parfois la probabilité d’un autre. Savoir qu’un client paie par carte change-t-il la probabilité qu’il achète en ligne ? C’est tout l’objet des probabilités **conditionnelles**.

## La probabilité conditionnelle
Pour un événement A de probabilité non nulle :
= P_A(B) = P(A ∩ B) ÷ P(A)

P_A(B) se lit « probabilité de B **sachant** A ». Il en découle :
= P(A ∩ B) = P(A) × P_A(B)

## L’arbre pondéré
| Règle | Ce qu’elle dit |
| Les branches issues d’un même nœud | Ont des probabilités de **somme 1** |
| Les branches du second niveau | Portent des probabilités **conditionnelles** |
| La probabilité d’un chemin | Est le **produit** des probabilités de ses branches |

## La formule des probabilités totales
Si A et son contraire Ā partagent l’univers :
= P(B) = P(A ∩ B) + P(Ā ∩ B)

On additionne les chemins qui mènent à B.

## L’indépendance
B est **indépendant** de A si savoir que A est réalisé ne change rien à la probabilité de B :
= P_A(B) = P(B), ce qui équivaut à P(A ∩ B) = P(A) × P(B)

La relation est **symétrique** : si B est indépendant de A, alors A est indépendant de B (probabilités non nulles).

!> Indépendants n’est pas incompatibles : deux événements incompatibles de probabilités non nulles ne sont jamais indépendants, puisque P(A ∩ B) = 0 alors que P(A) × P(B) > 0.

## Le vocabulaire des tests
Pour un test de dépistage : un **faux positif** est un test positif chez une personne non malade ; un **faux négatif**, un test négatif chez une personne malade. La **sensibilité** est P_malade(positif) et la **spécificité** P_non malade(négatif).

> Dans un arbre : on multiplie le long d’un chemin, on additionne entre les chemins.

## Exemple travaillé
60 % des clients d’un magasin paient par carte (C). Parmi eux, 30 % achètent en ligne (L) ; parmi les autres, 10 %.
1. Arbre : P(C) = 0,6 ; P_C(L) = 0,3 ; P(C̄) = 0,4 ; P_C̄(L) = 0,1.
2. P(C ∩ L) = 0,6 × 0,3 = 0,18 et P(C̄ ∩ L) = 0,4 × 0,1 = 0,04.
3. Probabilités totales : P(L) = 0,18 + 0,04 = **0,22**.
4. P_L(C) = 0,18 ÷ 0,22 = 9/11 ≈ 0,82.
5. P_C(L) = 0,3 ≠ P(L) = 0,22 : les événements ne sont **pas indépendants**.`,
          },
          questions: [
            ['P(A) = 0,5 et P(A ∩ B) = 0,2. Combien vaut P_A(B) ?', ['0,1', '0,7', '0,4', '2,5'], 2, '0,2 ÷ 0,5 = 0,4.'],
            ['P(A) = 0,6 et P_A(B) = 0,3. Combien vaut P(A ∩ B) ?', ['0,9', '0,5', '0,3', '0,18'], 3, '0,6 × 0,3 = 0,18.'],
            ['P(C ∩ L) = 0,18 et P(C̄ ∩ L) = 0,04. Combien vaut P(L) ?', ['0,22', '0,14', '0,4', '0,0072'], 0, 'Formule des probabilités totales : 0,18 + 0,04.', 'Dans l’exemple de la fiche, P(C ∩ L) = 0,18 et P(C̄ ∩ L) = 0,04. Combien vaut P(L) ?'],
            ['Que vaut la somme des probabilités des branches issues d’un même nœud ?', ['0', '1', '0,5', 'Cela dépend de l’arbre'], 1, 'Elles décrivent toutes les issues possibles à partir de ce nœud.'],
            ['Si P(A) = 0,6, combien vaut P(Ā) ?', ['0,6', '1,6', '0,4', '0,36'], 2, 'P(Ā) = 1 − P(A).'],
            ['A et B sont indépendants si…', ['P(A ∩ B) = 0', 'P(A) = P(B)', 'P(A) + P(B) = 1', 'P(A ∩ B) = P(A) × P(B)'], 3, 'C’est équivalent à P_A(B) = P(B).'],
            ['P(A) = 0,5, P(B) = 0,4 et P(A ∩ B) = 0,2. A et B sont-ils indépendants ?', ['Oui, car 0,5 × 0,4 = 0,2', 'Non, car 0,5 + 0,4 ≠ 0,2', 'Non, car P(A) ≠ P(B)', 'On ne peut pas savoir'], 0, 'Le produit des probabilités égale la probabilité de l’intersection.'],
            ['A et B sont indépendants, P(A) = 0,3 et P(B) = 0,5. Combien vaut P(A ∩ B) ?', ['0,8', '0,15', '0,2', '0,6'], 1, '0,3 × 0,5 = 0,15.'],
            ['Si B est indépendant de A (probabilités non nulles), alors A est indépendant de B.', ['Vrai', 'Faux'], 0, 'L’indépendance est une relation symétrique.'],
            ['P(C ∩ L) = 0,18 et P(L) = 0,22. Que vaut P_L(C) ?', ['0,3', '0,6', '9/11', '0,18'], 2, '0,18 ÷ 0,22 = 9/11.', 'Dans l’exemple de la fiche, que vaut P_L(C) ?'],
            ['Deux événements incompatibles de probabilités non nulles sont indépendants.', ['Vrai', 'Faux'], 1, 'P(A ∩ B) = 0 alors que P(A) × P(B) > 0.'],
            ['Un « faux positif » à un test de dépistage désigne…', ['Un test négatif chez un malade', 'Un test positif chez un malade', 'Un test non réalisé', 'Un test positif chez une personne non malade'], 3, 'Le test signale à tort une maladie absente.'],
          ],
        },
        {
          titre: 'Épreuves de Bernoulli et variables aléatoires',
          axe: 'Statistiques et probabilités',
          lecon: {
            titre: 'Répéter une épreuve, compter, calculer une espérance',
            cours: `Un joueur tire trois pénaltys, une machine produit des pièces conformes ou défectueuses, un jeu rapporte ou coûte de l’argent : on modélise ces situations par des **épreuves de Bernoulli** et des **variables aléatoires**.

## L’épreuve de Bernoulli
C’est une expérience à **deux issues** : succès (probabilité p) ou échec (probabilité 1 − p).

La **loi de Bernoulli** de paramètre p : X vaut 1 en cas de succès, 0 sinon. Son espérance est **E(X) = p**.

## Répéter des épreuves identiques et indépendantes
On représente n épreuves (n ≤ 4) par un **arbre**. Les épreuves étant indépendantes, la probabilité d’un chemin est le **produit** des probabilités de ses branches.

Trois tirs, probabilité de réussite 0,6 :
| Nombre de succès | Nombre de chemins | Probabilité |
| 3 | 1 | 0,6³ = 0,216 |
| 2 | 3 | 3 × 0,6² × 0,4 = 0,432 |
| 1 | 3 | 3 × 0,6 × 0,4² = 0,288 |
| 0 | 1 | 0,4³ = 0,064 |

Le total fait bien 1.

## Variable aléatoire et loi de probabilité
Une **variable aléatoire** X associe un nombre à chaque issue (un gain, un nombre de succès…). Sa **loi** donne les probabilités P(X = x_i) ; leur somme vaut **1**.

| x_i | −2 | 0 | 10 |
| P(X = x_i) | 0,5 | 0,3 | 0,2 |

P(X ≤ 0) = 0,5 + 0,3 = 0,8.

## L’espérance
= E(X) = x_1 × p_1 + x_2 × p_2 + … + x_n × p_n

Ici : E(X) = −2 × 0,5 + 0 × 0,3 + 10 × 0,2 = −1 + 0 + 2 = **1**. En jouant un grand nombre de fois, on gagne **en moyenne** 1 € par partie. Un jeu est **équitable** si E(X) = 0.

## La fluctuation d’échantillonnage
Si l’on simule des échantillons de taille n d’une loi de Bernoulli, la fréquence observée des succès **varie** d’un échantillon à l’autre, autour de p. Sa dispersion est de l’ordre de 1 ÷ √n.

!> Pour diviser la dispersion par 2, il faut un échantillon 4 fois plus grand, pas 2 fois : diviser par k demande de multiplier n par k².

> Espérance = moyenne à long terme ; elle ne dit pas ce qui arrivera à la prochaine partie.

## Exemple travaillé
Une pièce est conforme avec une probabilité 0,9. On en prélève 2, indépendamment. Probabilité qu’exactement une soit défectueuse :
1. Deux chemins : (conforme, défectueuse) et (défectueuse, conforme).
2. Chacun : 0,9 × 0,1 = 0,09.
3. Total : 2 × 0,09 = **0,18**.`,
          },
          questions: [
            ['Une épreuve de Bernoulli a…', ['Trois issues', 'Une infinité d’issues', 'Des issues toutes de probabilité 0,5', 'Deux issues : succès et échec'], 3, 'Succès de probabilité p, échec de probabilité 1 − p.'],
            ['Deux épreuves indépendantes, succès de probabilité 0,6. Probabilité de deux succès ?', ['0,36', '1,2', '0,6', '0,24'], 0, '0,6 × 0,6 = 0,36.'],
            ['Trois épreuves indépendantes, succès de probabilité 0,6. Probabilité de n’avoir aucun succès ?', ['0,4', '0,064', '0,216', '0'], 1, 'Aucun succès, c’est trois échecs de suite, chacun de probabilité 1 − 0,6 = 0,4 : 0,4³ = 0,064.'],
            ['Avec 3 épreuves, combien de chemins de l’arbre comportent exactement 1 succès ?', ['1', '2', '3', '6'], 2, 'Le succès peut être au 1er, 2e ou 3e rang.'],
            ['Trois épreuves, p = 0,6. Probabilité d’exactement un succès ?', ['0,096', '0,6', '0,432', '0,288'], 3, '3 × 0,6 × 0,4² = 3 × 0,096 = 0,288.'],
            ['X prend les valeurs −2, 0 et 10 avec les probabilités 0,5 ; 0,3 et 0,2. Combien vaut E(X) ?', ['1', '8', '0', '2,67'], 0, '−1 + 0 + 2 = 1.'],
            ['Un jeu est équitable si…', ['E(X) = 1', 'E(X) = 0', 'Toutes les issues ont la même probabilité', 'On gagne une fois sur deux'], 1, 'En moyenne, on ne gagne ni ne perd.'],
            ['Quelle est l’espérance d’une loi de Bernoulli de paramètre p ?', ['1', '1 − p', 'p', 'p²'], 2, 'E(X) = 1 × p + 0 × (1 − p) = p.'],
            ['X vaut 0, 1 ou 2 avec les probabilités 0,2 ; 0,5 et 0,3. Combien vaut P(X ≤ 1) ?', ['0,5', '0,8', '0,2', '0,7'], 3, '0,2 + 0,5 = 0,7.'],
            ['Pour diviser par 2 la dispersion des fréquences observées, il faut multiplier la taille de l’échantillon par…', ['4', '2', '√2', '8'], 0, 'La dispersion est de l’ordre de 1 ÷ √n.'],
            ['Pour des épreuves indépendantes, la probabilité d’un chemin est le produit des probabilités de ses branches.', ['Vrai', 'Faux'], 0, 'C’est le modèle de la répétition d’épreuves indépendantes.'],
            ['Que vaut la somme des probabilités d’une loi de probabilité ?', ['0', '1', 'L’espérance', 'Le nombre de valeurs'], 1, 'Les issues couvrent tous les cas possibles.'],
          ],
        },
        // ---- Méthode de l'épreuve -----------------------------------------------
        {
          titre: 'L’épreuve anticipée de mathématiques',
          axe: 'Méthode de l’épreuve',
          lecon: {
            titre: 'Deux heures, sans calculatrice : s’y préparer',
            cours: `Depuis la session 2026, tous les élèves de 1re, voie technologique comprise, passent en juin une **épreuve anticipée de mathématiques**. Elle compte pour le baccalauréat, comme les épreuves anticipées de français.

## Le format
| | Ce qu’il faut savoir |
| Durée | **2 heures** |
| Calculatrice | **Non autorisée** |
| Coefficient | **2** |
| Notation | Sur 20 points |
| Partie 1 | **Automatismes** en QCM : **6 points**, 12 questions en voie technologique |
| Partie 2 | **2 ou 3 exercices** indépendants, **guidés** question par question : **14 points** |

Le programme évalué est celui du tronc commun de 1re technologique, avec les automatismes travaillés depuis la seconde. Les modalités précises sont fixées par la note de service de l’épreuve : ton professeur t’en donnera le détail.

## La partie 1 : les automatismes
Pourcentages et évolutions, fractions et puissances, équations, lectures graphiques, droites, statistiques, probabilités : chaque question se traite en **une minute ou deux**, de tête ou avec un calcul très court.
1. Lis toutes les réponses proposées avant de calculer : elles orientent le calcul.
2. **Élimine** les réponses absurdes par un ordre de grandeur.
3. Si tu bloques, passe et reviens à la fin.

## La partie 2 : les exercices
Les thèmes qui reviennent : **suites** (évolution d’un capital, d’une population), **fonctions et dérivation** (bénéfice maximal, tangente), **probabilités** (arbre, tableau croisé, indépendance), **statistiques** (nuage de points, ajustement).
1. Lis l’énoncé en entier : une question s’appuie souvent sur la précédente.
2. Si tu ne sais pas faire une question, **admets son résultat** et continue.
3. **Rédige** : une phrase de conclusion par question, avec l’unité.

## Sans calculatrice : les bons réflexes
| Situation | Réflexe |
| Un pourcentage | Coefficient multiplicateur |
| 1,1² ou 0,9² | 1,21 ; 0,81 : à connaître |
| Une division difficile | Simplifier la fraction d’abord |
| Un résultat surprenant | Contrôler par un ordre de grandeur |

!> Les pièges classiques : additionner des pourcentages successifs, oublier de changer le sens d’une inégalité, confondre P_A(B) et P(A ∩ B), remplacer x dans f′ au lieu de f pour un extremum.

## Gérer les 2 heures
| Temps | Étape |
| 0 – 25 min | QCM d’automatismes |
| 25 – 110 min | Exercices, dans l’ordre où tu te sens le plus à l’aise |
| 110 – 120 min | Relecture, questions laissées de côté |

> Une question sautée ne rapporte rien ; un raisonnement juste, même inachevé, rapporte des points.`,
          },
          questions: [
            ['Combien de temps dure l’épreuve anticipée de mathématiques ?', ['2 heures', '1 heure', '3 heures', '4 heures'], 0, 'Deux heures pour les deux parties.'],
            ['La calculatrice est-elle autorisée ?', ['Oui, pour toute l’épreuve', 'Non', 'Seulement pour la partie 2', 'Seulement en mode examen'], 1, 'L’épreuve se passe entièrement sans calculatrice.'],
            ['Combien de points rapporte la partie automatismes ?', ['4', '10', '6', '14'], 2, '6 points ; les exercices en rapportent 14.'],
            ['Quel est le coefficient de l’épreuve anticipée de mathématiques ?', ['1', '4', '5', '2'], 3, 'Coefficient 2, noté sur 20.'],
            ['En voie technologique, combien de questions compte le QCM d’automatismes ?', ['12', '8', '10', '20'], 0, 'Douze questions, contre huit en voie générale.'],
            ['Que faire si l’on ne sait pas répondre à une question d’un exercice ?', ['Abandonner l’exercice', 'Admettre son résultat et continuer', 'Recommencer depuis le début', 'Rendre la copie'], 1, 'Les questions suivantes restent faisables avec le résultat admis.'],
            ['Combien vaut 1,1² ?', ['1,11', '1,2', '1,21', '2,2'], 2, '1,1 × 1,1 = 1,21 : à connaître pour les évolutions successives.'],
            ['Les exercices de la partie 2 sont guidés question par question.', ['Vrai', 'Faux'], 0, 'Chaque exercice avance pas à pas.'],
            ['À quoi sert un ordre de grandeur dans le QCM ?', ['À perdre du temps', 'À remplacer le calcul exact', 'À rien', 'À éliminer les réponses absurdes'], 3, 'Il permet de contrôler et d’éliminer vite.'],
            ['Quelle est une erreur classique à éviter ?', ['Additionner des pourcentages d’évolutions successives', 'Traduire un pourcentage en coefficient multiplicateur', 'Rédiger une phrase de conclusion', 'Vérifier une racine'], 0, 'Les coefficients se multiplient ; les pourcentages ne s’additionnent pas.'],
            ['Quel programme l’épreuve évalue-t-elle en voie technologique ?', ['Celui de la spécialité maths de la voie générale', 'Celui du tronc commun de 1re technologique, avec les automatismes', 'Uniquement celui de seconde', 'Celui de terminale'], 1, 'Programme de 1re technologique et automatismes entretenus depuis la seconde.'],
            ['Pour trouver la valeur d’un maximum, on remplace x…', ['Dans f′', 'Par 0', 'Dans f', 'Dans la tangente'], 2, 'f′ localise l’extremum, f en donne la valeur.'],
          ],
        },
      ],
    },
  ],
}
