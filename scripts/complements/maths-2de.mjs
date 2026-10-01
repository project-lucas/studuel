export default {
  slug: 'maths',
  titreMigration: 'QUESTIONS EN PLUS — MATHS 2de',
  motif: `Quatre questions de plus par quiz : huit suffisaient pour se tester une fois, pas pour réviser sur plusieurs semaines.`,
  chapitres: [
    {
      niveau: '2de',
      titre: 'Ensemble des nombres réels et intervalles',
      questions: [
        ['Que donne la réunion de [0 ; 2] et [1 ; 5] ?', ['[0 ; 5]', '[1 ; 2]', '[0 ; 1]', '[2 ; 5]'], 0, 'La réunion garde ce qui est dans l’un OU l’autre : de 0 à 5. L’intersection, elle, serait [1 ; 2].'],
        ['À quel intervalle correspond l’inéquation |x − 1| ≤ 3 ?', ['[−2 ; 4]', '[1 ; 3]', '[−3 ; 3]', '[−4 ; 2]'], 0, 'C’est l’intervalle centré en 1, de rayon 3 : [1 − 3 ; 1 + 3] = [−2 ; 4].'],
        ['Quel nombre appartient à ℤ mais pas à ℕ ?', ['−5', '5', '0,5', '√2'], 0, 'ℤ ajoute les entiers négatifs aux entiers naturels : −5 est un entier relatif, pas un entier naturel.'],
        ['Comment note-t-on l’ensemble des réels strictement supérieurs à 2 ?', [']2 ; +∞[', '[2 ; +∞[', ']2 ; +∞]', ']−∞ ; 2['], 0, '2 est exclu, donc crochet ouvert ; et le crochet est toujours ouvert du côté de l’infini.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'Les nombres décimaux, rationnels et irrationnels',
      questions: [
        ['Laquelle de ces fractions irréductibles est un nombre décimal ?', ['7/20', '1/6', '2/9', '5/12'], 0, '20 = 2² × 5 ne contient que les facteurs 2 et 5 : 7/20 = 0,35. Les autres dénominateurs contiennent un 3.'],
        ['Que vaut 2/3 × 3/4 ?', ['1/2', '6/7', '5/12', '8/9'], 0, 'On multiplie terme à terme : 6/12 = 1/2.'],
        ['Que vaut (1/2) ÷ (3/4) ?', ['2/3', '3/8', '3/2', '1/4'], 0, 'Diviser, c’est multiplier par l’inverse : 1/2 × 4/3 = 4/6 = 2/3.'],
        ['Dans la preuve de l’irrationalité de √2, que déduit-on de l’égalité 2q² = p² ?', ['Que p² est pair, donc p est pair', 'Que q est impair', 'Que p = 2q', 'Que √2 est décimal'], 0, 'p² = 2q² est un multiple de 2, donc pair ; et un entier dont le carré est pair est lui-même pair.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'Nombres entiers : multiples, diviseurs et nombres premiers',
      questions: [
        ['Lequel de ces nombres est divisible par 4 ?', ['2 316', '1 234', '3 318', '5 422'], 0, 'On regarde les deux derniers chiffres : 16 est divisible par 4, alors que 34, 18 et 22 ne le sont pas.'],
        ['Quel est le PGCD de 12 = 2² × 3 et 18 = 2 × 3² ?', ['6', '36', '3', '2'], 0, 'On prend les facteurs communs au plus petit exposant : 2¹ × 3¹ = 6.'],
        ['Lequel de ces nombres est premier ?', ['97', '87', '91', '99'], 0, '√97 < 10 : on teste 2, 3, 5 et 7, aucun ne divise 97. En revanche 87 = 3 × 29, 91 = 7 × 13, 99 = 9 × 11.'],
        ['Lequel de ces nombres est divisible par 9 ?', ['4 527', '4 528', '3 421', '1 118'], 0, 'La somme des chiffres de 4 527 vaut 4 + 5 + 2 + 7 = 18, divisible par 9.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'Calcul littéral : quotients, puissances, racines carrées',
      questions: [
        ['Que vaut a⁷ / a² (a non nul) ?', ['a⁵', 'a⁹', 'a¹⁴', 'a^3,5'], 0, 'Pour un quotient de même base, on soustrait les exposants : 7 − 2 = 5.'],
        ['Comment simplifier √50 ?', ['5√2', '25√2', '2√5', '10√5'], 0, '√50 = √(25 × 2) = √25 × √2 = 5√2.'],
        ['Que vaut (2x)³ ?', ['8x³', '2x³', '6x³', '6x'], 0, '(ab)ⁿ = aⁿbⁿ : (2x)³ = 2³ × x³ = 8x³.'],
        ['Quelle est la notation scientifique de 0,00042 ?', ['4,2 × 10⁻⁴', '42 × 10⁻⁵', '4,2 × 10⁴', '0,42 × 10⁻³'], 0, 'On écrit a × 10ⁿ avec 1 ≤ |a| < 10 : la virgule se déplace de 4 rangs vers la droite, d’où 10⁻⁴.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'Les identités remarquables',
      questions: [
        ['Développez (2x + 7)(2x − 7).', ['4x² − 49', '4x² + 49', '4x² − 28x − 49', '2x² − 49'], 0, '(a + b)(a − b) = a² − b² avec a = 2x et b = 7 : 4x² − 49.'],
        ['Comment factoriser 16x² − 25 ?', ['(4x − 5)(4x + 5)', '(4x − 5)²', '(16x − 25)(16x + 25)', '(8x − 5)(8x + 5)'], 0, '16x² = (4x)² et 25 = 5² : on applique a² − b² = (a − b)(a + b).'],
        ['Comment factoriser x² − 6x + 9 ?', ['(x − 3)²', '(x + 3)²', '(x − 3)(x + 3)', '(x − 9)(x + 1)'], 0, 'On reconnaît a² − 2ab + b² avec a = x et b = 3 : le double produit vaut bien 6x.'],
        ['Que vaut 99² en utilisant une identité remarquable ?', ['9 801', '9 999', '9 981', '10 201'], 0, '99² = (100 − 1)² = 10 000 − 200 + 1 = 9 801.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'Les équations et inéquations',
      questions: [
        ['Quelle est la solution de 5x − 2 = 3x + 8 ?', ['x = 5', 'x = 3', 'x = 10', 'x = 0,75'], 0, 'On regroupe : 5x − 3x = 8 + 2, soit 2x = 10, donc x = 5.'],
        ['Quelle est la solution de (x − 1)/(x + 2) = 0 ?', ['x = 1', 'x = −2', 'x = 1 et x = −2', 'Aucune'], 0, 'Le numérateur doit être nul et le dénominateur non nul : x = 1 convient, −2 est une valeur interdite.'],
        ['Résolvez −3x ≤ 12.', ['x ≥ −4', 'x ≤ −4', 'x ≥ 4', 'x ≤ 4'], 0, 'On divise par −3, nombre négatif : le sens de l’inégalité s’inverse, d’où x ≥ −4.'],
        ['Que signale une double barre dans un tableau de signes ?', ['Une valeur interdite, qui annule un dénominateur', 'Une solution de l’équation', 'Un changement de signe obligatoire', 'Le maximum de la fonction'], 0, 'Le quotient n’est pas défini en cette valeur : on la marque d’une double barre.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'Géométrie plane : triangles et projeté orthogonal d’un point sur une droite',
      questions: [
        ['Où se coupent les bissectrices d’un triangle ?', ['Au centre du cercle inscrit', 'Au centre du cercle circonscrit', 'À l’orthocentre', 'Au centre de gravité'], 0, 'Le point de concours des bissectrices est équidistant des trois côtés : c’est le centre du cercle inscrit.'],
        ['Dans un triangle rectangle, comment définit-on le sinus d’un angle aigu ?', ['Côté opposé sur hypoténuse', 'Côté adjacent sur hypoténuse', 'Côté opposé sur côté adjacent', 'Hypoténuse sur côté opposé'], 0, 'Sinus : opposé / hypoténuse ; cosinus : adjacent / hypoténuse ; tangente : opposé / adjacent.'],
        ['Dans un triangle rectangle, comment définit-on la tangente d’un angle aigu ?', ['Côté opposé sur côté adjacent', 'Côté adjacent sur côté opposé', 'Côté opposé sur hypoténuse', 'Hypoténuse sur côté adjacent'], 0, 'La tangente est le rapport du côté opposé au côté adjacent, sans intervention de l’hypoténuse.'],
        ['De quoi le centre du cercle circonscrit à un triangle est-il équidistant ?', ['Des trois sommets', 'Des trois côtés', 'Des trois milieux', 'Des trois hauteurs'], 0, 'Il est sur chaque médiatrice, donc à la même distance des trois sommets : c’est le rayon du cercle circonscrit.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'Vecteurs du plan et opérations',
      questions: [
        ['Que vaut la somme des vecteurs AB + BC + CD ?', ['Le vecteur AD', 'Le vecteur DA', 'Le vecteur AC', 'Le vecteur nul'], 0, 'On enchaîne la relation de Chasles : AB + BC = AC, puis AC + CD = AD.'],
        ['Comparé au vecteur u, que peut-on dire du vecteur 2u ?', ['Même direction, même sens, norme double', 'Même direction, sens opposé, norme double', 'Direction différente, même norme', 'Même sens, norme divisée par deux'], 0, 'Multiplier par un réel positif conserve direction et sens, et multiplie la norme par ce réel.'],
        ['Selon la règle du parallélogramme, où lit-on la somme de deux vecteurs de même origine ?', ['Sur la diagonale issue du point commun', 'Sur l’autre diagonale', 'Sur le côté le plus long', 'Au centre du parallélogramme'], 0, 'On construit le parallélogramme sur les deux vecteurs : leur somme est la diagonale partant de l’origine commune.'],
        ['Deux droites ont des vecteurs directeurs colinéaires. Que peut-on en conclure ?', ['Elles sont parallèles', 'Elles sont perpendiculaires', 'Elles sont sécantes', 'Rien'], 0, 'La colinéarité traduit le parallélisme des directions ; si les droites ont en plus un point commun, elles sont confondues.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'Repère et coordonnées de vecteurs',
      questions: [
        ['Quelles sont les coordonnées de u + v, avec u(1 ; 2) et v(3 ; −5) ?', ['(4 ; −3)', '(3 ; −10)', '(−2 ; 7)', '(4 ; 7)'], 0, 'On additionne coordonnée par coordonnée : 1 + 3 = 4 et 2 + (−5) = −3.'],
        ['Quelles sont les coordonnées de 3u, avec u(2 ; −1) ?', ['(6 ; −3)', '(5 ; 2)', '(6 ; −1)', '(2 ; −3)'], 0, 'On multiplie chaque coordonnée par 3.'],
        ['Les vecteurs u(2 ; 3) et v(4 ; 5) sont-ils colinéaires ?', ['Non, car 2 × 5 − 3 × 4 = −2', 'Oui, car 4 = 2 × 2', 'Oui, car leurs coordonnées augmentent', 'On ne peut pas le savoir'], 0, 'Le déterminant xy′ − yx′ vaut 10 − 12 = −2, non nul : ils ne sont pas colinéaires.'],
        ['Quelle autre méthode prouve qu’un quadrilatère est un parallélogramme ?', ['Ses diagonales ont le même milieu', 'Ses quatre côtés sont égaux deux à deux consécutifs', 'Ses diagonales sont perpendiculaires', 'Il a un angle droit'], 0, 'Un quadrilatère dont les diagonales se coupent en leur milieu est un parallélogramme : on compare les coordonnées des deux milieux.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'Équations de droites',
      questions: [
        ['Quelle est l’équation réduite de la droite passant par A(0 ; 1) et B(2 ; 5) ?', ['y = 2x + 1', 'y = x + 1', 'y = 2x + 5', 'y = 3x + 1'], 0, 'm = (5 − 1)/(2 − 0) = 2, et la droite coupe l’axe des ordonnées en 1 : p = 1.'],
        ['Quel est un vecteur directeur de la droite d’équation y = 3x + 1 ?', ['(1 ; 3)', '(3 ; 1)', '(1 ; 1)', '(−3 ; 1)'], 0, 'Pour y = mx + p, le vecteur (1 ; m) est directeur : avancer de 1 fait monter de 3.'],
        ['Quel point appartient à la droite d’équation y = 2x − 3 ?', ['(2 ; 1)', '(1 ; 2)', '(0 ; 3)', '(3 ; 0)'], 0, 'Pour x = 2, y = 2 × 2 − 3 = 1 : le point (2 ; 1) vérifie l’équation.'],
        ['Que dire d’une droite dont le coefficient directeur est nul ?', ['Elle est horizontale', 'Elle est verticale', 'Elle passe par l’origine', 'Elle n’existe pas'], 0, 'y = p : y ne varie pas quand x augmente, la droite est parallèle à l’axe des abscisses.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'Généralités sur les fonctions',
      questions: [
        ['Quel est l’ensemble de définition de f(x) = 1/(x − 2) ?', ['ℝ privé de 2', 'ℝ', '[2 ; +∞[', 'ℝ privé de 0'], 0, 'On exclut la valeur qui annule le dénominateur : x − 2 = 0 pour x = 2.'],
        ['Le point M(2 ; 5) appartient-il à la courbe de f(x) = x² + 1 ?', ['Oui, car f(2) = 5', 'Non, car f(2) = 3', 'Non, car f(5) = 26', 'On ne peut pas le savoir'], 0, 'M(x ; y) est sur la courbe si et seulement si y = f(x) ; ici f(2) = 4 + 1 = 5.'],
        ['Comment résout-on graphiquement f(x) ≥ k ?', ['On lit les abscisses des points de la courbe situés au-dessus de la droite y = k', 'On lit l’image de k', 'On cherche où la courbe coupe l’axe des ordonnées', 'On lit les ordonnées supérieures à k sur l’axe'], 0, 'Les solutions sont les abscisses des portions de courbe au-dessus (ou sur) la droite horizontale y = k.'],
        ['Que fait apparaître un tableau de variations ?', ['Les extremums et les valeurs de x où ils sont atteints', 'Le signe de f', 'Les antécédents de 0 uniquement', 'L’équation de la courbe'], 0, 'Les flèches résument le sens de variation, et aux changements de sens se lisent les maximums et minimums.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'La fonction affine',
      questions: [
        ['Quelle fonction affine vérifie f(1) = 5 et f(3) = 9 ?', ['f(x) = 2x + 3', 'f(x) = 4x + 1', 'f(x) = 2x + 5', 'f(x) = 3x + 2'], 0, 'a = (9 − 5)/(3 − 1) = 2, puis 5 = 2 × 1 + b donne b = 3.'],
        ['Un abonnement coûte 10 € par mois plus 2 € par séance. Quelle fonction donne le coût pour x séances ?', ['f(x) = 2x + 10', 'f(x) = 10x + 2', 'f(x) = 12x', 'f(x) = 2x'], 0, 'Le forfait fixe est l’ordonnée à l’origine, le tarif par unité le coefficient directeur.'],
        ['Que peut-on dire de la droite représentant une fonction linéaire ?', ['Elle passe par l’origine', 'Elle est horizontale', 'Elle est verticale', 'Elle ne coupe jamais l’axe des abscisses'], 0, 'Pour une fonction linéaire, b = 0 : f(0) = 0, la droite passe par l’origine et traduit une proportionnalité.'],
        ['Quel est le signe de f(x) = 3x − 6 pour x < 2 ?', ['Négatif', 'Positif', 'Nul', 'Il dépend de x²'], 0, 'f s’annule en 2 ; comme a = 3 > 0, f est négative avant 2 et positive après.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'La fonction carré',
      questions: [
        ['Quelle est la solution de x² > 9 ?', [']−∞ ; −3[ ∪ ]3 ; +∞[', ']3 ; +∞[', ']−3 ; 3[', ']9 ; +∞['], 0, 'Les points de la parabole au-dessus de y = 9 ont une abscisse inférieure à −3 ou supérieure à 3 : ne pas oublier la partie négative.'],
        ['Quelles sont les solutions de x² = 7 ?', ['√7 et −√7', '√7 seulement', '3,5 et −3,5', '49 et −49'], 0, 'Pour k > 0, x² = k admet deux solutions, √k et −√k.'],
        ['Combien de solutions a l’équation x² = 0 ?', ['Une seule : 0', 'Deux', 'Aucune', 'Une infinité'], 0, 'Le seul réel dont le carré est nul est 0.'],
        ['Quelles sont les coordonnées du sommet de la parabole représentant x ↦ x² ?', ['(0 ; 0)', '(1 ; 1)', '(0 ; 1)', '(−1 ; 1)'], 0, 'Le minimum 0 est atteint en x = 0 : le sommet est l’origine du repère.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'La fonction cube',
      questions: [
        ['Quelle est la solution de x³ = 64 ?', ['4', '8', '−4 et 4', '21,3'], 0, '4³ = 4 × 4 × 4 = 64 ; l’équation x³ = k a toujours une seule solution.'],
        ['Que vaut (−2)³ ?', ['−8', '8', '−6', '6'], 0, '(−2) × (−2) × (−2) = 4 × (−2) = −8 : le cube garde le signe.'],
        ['Combien de solutions a l’équation x³ = k, quel que soit le réel k ?', ['Toujours exactement une', 'Zéro, une ou deux selon k', 'Toujours deux', 'Aucune si k est négatif'], 0, 'La fonction cube est croissante sur ℝ et prend toutes les valeurs : chaque k a un seul antécédent.'],
        ['Comparez 0,5 et 0,5³.', ['0,5³ = 0,125 est plus petit que 0,5', '0,5³ = 1,5 est plus grand que 0,5', 'Ils sont égaux', '0,5³ est négatif'], 0, 'Sur [0 ; 1], élever à une puissance plus grande rapproche de 0 : x³ ≤ x² ≤ x.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'La fonction racine carrée',
      questions: [
        ['Quel est le minimum de la fonction racine carrée ?', ['0, atteint en 0', '1, atteint en 1', 'Elle n’en a pas', '−1, atteint en 1'], 0, 'Croissante sur [0 ; +∞[, elle part de √0 = 0.'],
        ['Pour x ≥ 1, comment se comparent √x et x ?', ['√x ≤ x', '√x ≥ x', 'Ils sont toujours égaux', 'On ne peut pas comparer'], 0, 'Par exemple √16 = 4 ≤ 16 ; l’ordre s’inverse sur [0 ; 1].'],
        ['Quelle est la solution de √x = 1,2 ?', ['x = 1,44', 'x = 2,4', 'x = 1,2', 'x = 0,6'], 0, 'Pour k ≥ 0, √x = k donne x = k² = 1,44.'],
        ['Pour quelles valeurs a-t-on √x = x ?', ['0 et 1', '1 seulement', '0 seulement', 'Aucune'], 0, '√0 = 0 et √1 = 1 : ce sont les points où les courbes de √x et de x se croisent.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'La fonction inverse',
      questions: [
        ['Quelles sont les asymptotes de l’hyperbole de la fonction inverse ?', ['Les deux axes du repère', 'La droite y = x', 'La droite y = 1', 'Elle n’en a pas'], 0, 'La courbe se rapproche de l’axe des abscisses quand x devient grand, et de l’axe des ordonnées près de 0.'],
        ['Combien de solutions a l’équation 1/x = 0 ?', ['Aucune', 'Une : x = 0', 'Une : x = 1', 'Une infinité'], 0, 'Un quotient de numérateur 1 n’est jamais nul : 1/x ne vaut jamais 0.'],
        ['Quelle est la solution de 1/x = −0,5 ?', ['x = −2', 'x = 2', 'x = −0,5', 'x = 0,5'], 0, 'Pour k non nul, la solution est x = 1/k = 1/(−0,5) = −2.'],
        ['Que devient 1/x quand x se rapproche de 0 ?', ['Sa valeur absolue devient arbitrairement grande', 'Il se rapproche de 0', 'Il se rapproche de 1', 'Il reste constant'], 0, 'Diviser 1 par un nombre de plus en plus petit donne un résultat de plus en plus grand en valeur absolue.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'Information chiffrée',
      questions: [
        ['Deux hausses successives de 10 % correspondent à quelle hausse globale ?', ['21 %', '20 %', '11 %', '100 %'], 0, '1,10 × 1,10 = 1,21 : une hausse de 21 %, et non de 20 %.'],
        ['Après une hausse de 25 %, quelle baisse ramène à la valeur de départ ?', ['20 %', '25 %', '75 %', '12,5 %'], 0, 'Le coefficient réciproque est 1/1,25 = 0,80, soit une baisse de 20 %.'],
        ['Un article à 80 € augmente de 15 %. Quel est son nouveau prix ?', ['92 €', '95 €', '68 €', '80,15 €'], 0, '80 × 1,15 = 92 €.'],
        ['Dans une classe de 30 élèves, 12 font du latin. Quelle est la proportion de latinistes ?', ['0,4', '0,12', '2,5', '0,18'], 0, 'Proportion = effectif partiel / effectif total = 12/30 = 0,4, soit 40 %.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'Statistique descriptive',
      questions: [
        ['Quelle est la médiane de la série 2 ; 4 ; 6 ; 8 ; 20 ?', ['6', '8', '4', '10'], 0, 'La série est ordonnée et compte 5 valeurs : la médiane est la 3e, soit 6. La moyenne (8) est tirée vers le haut par 20.'],
        ['Quelle est l’étendue de la série 2 ; 4 ; 6 ; 8 ; 20 ?', ['18', '20', '6', '22'], 0, 'L’étendue est l’écart entre la plus grande et la plus petite valeur : 20 − 2 = 18.'],
        ['Un élève a 12 (coefficient 2) et 15 (coefficient 1). Quelle est sa moyenne pondérée ?', ['13', '13,5', '14', '27'], 0, '(12 × 2 + 15 × 1) / (2 + 1) = 39 / 3 = 13.'],
        ['Quel piège présente une moyenne calculée sur une série bimodale ?', ['Elle cache deux groupes distincts', 'Elle est toujours nulle', 'Elle est égale à la médiane', 'Elle exagère une variation'], 0, 'Avec deux groupes bien séparés, la moyenne tombe entre les deux et ne décrit aucun d’eux.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'Probabilités : vocabulaire et outils',
      questions: [
        ['Quel ensemble correspond à l’événement impossible ?', ['L’ensemble vide', 'L’univers Ω', 'Un événement de probabilité 1', 'Une issue unique'], 0, 'L’événement impossible ne contient aucune issue : sa probabilité est 0.'],
        ['P(A) = 0,5, P(B) = 0,4 et P(A ∩ B) = 0,2. Que vaut P(A ∪ B) ?', ['0,7', '0,9', '0,2', '1,1'], 0, 'P(A ∪ B) = 0,5 + 0,4 − 0,2 = 0,7 : on retire l’intersection comptée deux fois.'],
        ['On lance deux pièces équilibrées. Quelle est la probabilité d’obtenir au moins un pile ?', ['3/4', '1/2', '1/4', '2/3'], 0, 'L’événement contraire « aucun pile » a une probabilité de 1/2 × 1/2 = 1/4 ; donc 1 − 1/4 = 3/4.'],
        ['Une expérience a trois issues ; deux ont pour probabilités 0,2 et 0,5. Quelle est la probabilité de la troisième ?', ['0,3', '0,7', '0,35', '0,1'], 0, 'La somme des probabilités des issues vaut 1 : 1 − 0,2 − 0,5 = 0,3.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'Échantillonnage',
      questions: [
        ['Pour un échantillon de taille n = 400, quelle est la demi-largeur 1/√n de l’intervalle de fluctuation ?', ['0,05', '0,0025', '0,02', '0,5'], 0, '√400 = 20, donc 1/√n = 1/20 = 0,05.'],
        ['Quel est l’intervalle de fluctuation au seuil de 95 % pour p = 0,3 et n = 100 ?', ['[0,2 ; 0,4]', '[0,29 ; 0,31]', '[0,25 ; 0,35]', '[0 ; 0,6]'], 0, '1/√100 = 0,1 : [0,3 − 0,1 ; 0,3 + 0,1] = [0,2 ; 0,4].'],
        ['La fréquence observée tombe dans l’intervalle de fluctuation. Que conclut-on ?', ['On ne rejette pas l’hypothèse, sans pour autant la démontrer', 'L’hypothèse est démontrée', 'On rejette l’hypothèse', 'L’échantillon est biaisé'], 0, 'Ne pas rejeter une hypothèse n’est pas la prouver : l’échantillon est seulement compatible avec elle.'],
        ['Que désigne la proportion p dans le vocabulaire de l’échantillonnage ?', ['La valeur, souvent inconnue, du caractère dans toute la population', 'La fréquence observée dans l’échantillon', 'La taille de l’échantillon', 'La marge d’erreur'], 0, 'p concerne la population entière ; f est ce qu’on mesure dans l’échantillon.'],
      ],
    },
  ],
}
