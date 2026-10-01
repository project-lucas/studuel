export default {
  slug: 'maths-complementaires',
  titreMigration: 'QUESTIONS EN PLUS — MATHS COMPLÉMENTAIRES Tle',
  motif: `Quatre questions de plus par quiz : huit suffisaient pour se tester une fois, pas pour réviser sur plusieurs semaines.`,
  chapitres: [
    {
      niveau: 'Tle',
      titre: 'Suites et modèles d’évolution',
      questions: [
        ['Une hausse de 10 % suivie d’une baisse de 10 % donne au total…', ['Une baisse de 1 %', 'Aucune variation', 'Une hausse de 1 %', 'Une baisse de 10 %'], 0, 'On multiplie les coefficients : 1,1 × 0,9 = 0,99, soit −1 % : on ne revient pas au point de départ.'],
        ['Un versement fixe de 50 € chaque mois sur un compte sans intérêts se modélise par…', ['Une suite géométrique de raison 50', 'Une suite arithmétique de raison 50', 'Une suite géométrique de raison 1,5', 'Une suite constante'], 1, 'On ajoute toujours la même quantité : c’est le cas typique d’une suite arithmétique.'],
        ['Que se passe-t-il pour une suite géométrique de raison q = 1 ?', ['Elle tend vers 0', 'Elle croît sans limite', 'Elle est constante', 'Elle alterne de signe'], 2, 'Multiplier par 1 à chaque étape ne change rien : tous les termes sont égaux au premier.'],
        ['Pour u(n+1) = 0,5 u(n) + 10, quel est le point fixe L ?', ['10', '5', '40', '20'], 3, 'L = 0,5 L + 10 donne 0,5 L = 10, soit L = 20.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Suites numériques, modèles discrets et limites',
      questions: [
        ['Quel type de croissance décrit une suite arithmétique de raison positive ?', ['Exponentielle', 'Linéaire', 'Logarithmique', 'Oscillante'], 1, 'On ajoute la même quantité à chaque étape : la croissance est linéaire, contrairement à la géométrique, exponentielle.'],
        ['Quelle est la limite d’une suite géométrique de raison q = −2 ?', ['+∞', '0', '−∞', 'Elle n’a pas de limite'], 3, 'Pour q inférieur ou égal à −1, les termes changent de signe à chaque étape en grossissant : la suite n’a pas de limite.'],
        ['Que garantit le théorème de la limite monotone pour une suite croissante et majorée ?', ['L’existence de la limite, pas sa valeur', 'Que la limite vaut le majorant', 'Que la suite est géométrique', 'Que la suite est constante à partir d’un rang'], 0, 'Le théorème affirme que la suite converge, mais la limite peut être strictement inférieure au majorant donné.'],
        ['Pour u(n+1) = a u(n) + b et v(n) = u(n) − c (c point fixe), quelle est la forme de u(n) ?', ['u(n) = u(0) × aⁿ + c', 'u(n) = (u(0) − c) × aⁿ + c', 'u(n) = u(0) + n b', 'u(n) = c × aⁿ'], 1, 'v est géométrique de raison a, donc v(n) = (u(0) − c) aⁿ, et on ajoute c pour revenir à u.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Limites de fonctions',
      questions: [
        ['Quelle est la limite de ln(x) quand x tend vers 0 par valeurs positives ?', ['0', '+∞', '−∞', '1'], 2, 'Le logarithme plonge vers −∞ au voisinage de 0 : l’axe des ordonnées est une asymptote verticale.'],
        ['Quelle est la limite de e^(−x) en +∞ ?', ['0', '+∞', '1', '−∞'], 0, 'e^(−x) = 1/e^x, et e^x tend vers +∞ : le quotient tend vers 0.'],
        ['Quelle est la limite en +∞ de (3x² + 1)/(x² − 5) ?', ['+∞', '0', '1', '3'], 3, 'Une fraction rationnelle se comporte en +∞ comme le quotient de ses termes de plus haut degré : 3x²/x² = 3.'],
        ['Obtenir une forme indéterminée signifie que la limite n’existe pas.', ['Vrai', 'Faux'], 1, 'Une forme indéterminée signale seulement qu’il faut transformer l’écriture (factoriser, croissances comparées) pour conclure.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Fonctions, dérivées et optimisation',
      questions: [
        ['Quelle est la dérivée d’un quotient u/v ?', ['(u′v − uv′)/v²', '(u′v + uv′)/v²', 'u′/v′', '(uv′ − u′v)/v²'], 0, 'Au numérateur, l’ordre compte : u′v moins uv′, le tout divisé par v².'],
        ['Que mesure le nombre dérivé f′(a) dans un modèle ?', ['La valeur de la grandeur en a', 'La vitesse de variation instantanée en a', 'La moyenne de la grandeur', 'La valeur maximale de la grandeur'], 1, 'f′(a) est la vitesse de variation instantanée : combien la grandeur change par unité de x au voisinage de a.'],
        ['On cherche les dimensions d’un enclos ; le calcul donne un optimum pour une longueur négative. Que conclure ?', ['On garde cette valeur', 'On prend sa valeur absolue', 'La solution n’est pas acceptable : il faut revenir à l’intervalle où le problème a un sens', 'On change la fonction à optimiser'], 2, 'Une longueur est positive : un optimum hors de l’intervalle de sens ne vaut rien concrètement.'],
        ['Pour f(x) = x³, que se passe-t-il en 0 ?', ['f admet un maximum local', 'f admet un minimum local', 'f n’est pas dérivable', 'f′(0) = 0 mais f reste croissante'], 3, 'La dérivée 3x² s’annule en 0 sans changer de signe : pas d’extremum, seulement un point d’inflexion.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Probabilités conditionnelles',
      questions: [
        ['Que vaut la somme des probabilités des branches issues d’un même nœud d’un arbre ?', ['0', '1', 'La probabilité du nœud', 'Elle dépend de l’arbre'], 1, 'Les branches d’un nœud décrivent toutes les issues possibles à partir de lui : leurs probabilités totalisent 1.'],
        ['Deux événements A et B sont indépendants si et seulement si…', ['P_B(A) = P(A)', 'P_B(A) = P(B)', 'P(A) = P(B)', 'P_B(A) = 1'], 0, 'L’indépendance signifie que savoir que B s’est produit ne change rien à la probabilité de A.'],
        ['P(B) = 0,4 et P_B(A) = 0,5. Que vaut P(A inter B) ?', ['0,9', '0,1', '0,2', '0,8'], 2, 'Formule des probabilités composées : P(A inter B) = P(B) × P_B(A) = 0,4 × 0,5 = 0,2.'],
        ['Dans l’exemple du cours (maladie touchant 1 personne sur 10 000, test fiable à 99 %), quelle est environ la probabilité d’être malade sachant que le test est positif ?', ['99 %', '50 %', '10 %', '1 %'], 3, 'Environ 100 faux positifs pour 1 vrai malade : un positif a environ 1 chance sur 100 d’être un vrai malade.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Continuité de fonctions',
      questions: [
        ['Quelle image intuitive traduit la continuité d’une fonction sur un intervalle ?', ['La courbe se trace sans lever le crayon', 'La courbe est une droite', 'La courbe est toujours croissante', 'La courbe passe par l’origine'], 0, 'Une fonction continue ne fait pas de saut : on trace sa courbe d’un seul trait.'],
        ['Une fonction continue est-elle toujours dérivable ?', ['Oui, toujours', 'Non, la réciproque de « dérivable implique continue » est fausse', 'Oui, sur un intervalle fermé', 'Oui, si elle est croissante'], 1, 'Dérivable entraîne continue, mais pas l’inverse : une fonction peut être continue avec un point anguleux.'],
        ['Pourquoi ne peut-on pas appliquer le théorème des valeurs intermédiaires à un nombre d’individus ?', ['Parce qu’il est toujours positif', 'Parce qu’il est trop grand', 'Parce que c’est un modèle discret, qui avance par sauts', 'Parce qu’il est décroissant'], 2, 'Un nombre d’individus ne prend que des valeurs entières : le modèle est discret, les théorèmes de continuité ne s’y appliquent pas.'],
        ['À chaque étape de la dichotomie, la précision de l’encadrement…', ['Reste la même', 'Est multipliée par 10', 'Diminue', 'Double'], 3, 'On garde la moitié de l’intervalle où le signe change : sa longueur est divisée par 2, la précision double.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Statistiques et échantillonnage',
      questions: [
        ['Quelle est la variance d’une loi binomiale de paramètres n et p ?', ['n × p × (1 − p)', 'n × p', 'p × (1 − p)', '√(n × p)'], 0, 'La variance vaut n p (1 − p) ; l’espérance, elle, vaut n p.'],
        ['Quel intervalle de confiance au niveau 95 % le cours donne-t-il pour une fréquence f observée sur n personnes ?', ['[f − 1/n ; f + 1/n]', '[f − 1/√n ; f + 1/√n]', '[f − √n ; f + √n]', '[f − 2/n ; f + 2/n]'], 1, 'La marge est 1/√n : pour n = 1 000, environ 0,03, soit ± 3 points.'],
        ['Par combien faut-il multiplier la taille d’un échantillon pour diviser la marge d’erreur par 2 ?', ['Par 2', 'Par 8', 'Par 4', 'Par 10'], 2, 'La marge décroît en 1/√n : quadrupler n divise la marge par √4 = 2.'],
        ['Quelle est la principale faiblesse de la médiane comme indicateur de centre ?', ['Elle est très sensible aux valeurs extrêmes', 'Elle ne se calcule que sur des effectifs pairs', 'Elle mesure la dispersion', 'Elle ignore l’ampleur des écarts'], 3, 'La médiane repose sur le rang : elle résiste aux valeurs extrêmes, mais ne dit rien de l’ampleur des écarts.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Fonction logarithme népérien (ln)',
      questions: [
        ['Que vaut ln(e) ?', ['0', '1', 'e', '−1'], 1, 'ln est la réciproque de l’exponentielle : ln(e) = ln(e¹) = 1, et ln(1) = 0.'],
        ['Que vaut ln(a^n) pour a strictement positif ?', ['n ln(a)', '(ln a)^n', 'ln(a) + n', 'ln(n) × a'], 0, 'Le logarithme fait descendre l’exposant en facteur : c’est ce qui permet de résoudre une inconnue en exposant.'],
        ['Quelle est la dérivée de ln(u) pour u strictement positive ?', ['1/u', 'u′ ln(u)', 'u′/u', 'u/u′'], 2, 'On n’oublie pas le facteur u′ : (ln u)′ = u′/u.'],
        ['Si u(n) est une suite géométrique de raison q, alors ln(u(n)) est…', ['Géométrique de raison ln(q)', 'Constante', 'Arithmétique de raison q', 'Arithmétique de raison ln(q)'], 3, 'ln(u(n)) = ln(u(0)) + n ln(q) : le logarithme transforme une suite géométrique en suite arithmétique.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Compléments sur la dérivation',
      questions: [
        ['Quelle est la dérivée de √x ?', ['1/(2√x)', '2√x', '1/√x', '√x/2'], 0, 'La dérivée de √x est 1/(2√x), définie pour x strictement positif.'],
        ['Quelle est la dérivée de 1/x ?', ['1/x²', '−1/x²', 'ln(x)', '−1/x'], 1, 'La dérivée de 1/x est −1/x² : la fonction est décroissante sur chaque intervalle où elle est définie.'],
        ['Selon le cours, où le bénéfice est-il maximal ?', ['Là où le coût total est minimal', 'Là où la recette est maximale', 'Là où le coût marginal égale la recette marginale', 'Là où le coût moyen est nul'], 2, 'Le bénéfice est recette moins coût ; sa dérivée s’annule quand recette marginale et coût marginal sont égaux.'],
        ['Quelle est la dérivée de uⁿ ?', ['n uⁿ⁻¹', 'u′ⁿ', 'uⁿ⁺¹/(n+1)', 'n u′ uⁿ⁻¹'], 3, 'Comme pour toute composée, on n’oublie pas le facteur u′ : (uⁿ)′ = n u′ uⁿ⁻¹.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Fonctions convexes',
      questions: [
        ['Pour une fonction deux fois dérivable, être convexe équivaut à…', ['f′ décroissante', 'f′ croissante', 'f positive', 'f croissante'], 1, 'f convexe, f′ croissante et f″ positive ou nulle sont trois propositions équivalentes.'],
        ['Une fonction affine est…', ['Convexe et concave à la fois', 'Seulement convexe', 'Seulement concave', 'Ni convexe ni concave'], 0, 'Sa dérivée seconde est nulle : elle est à la fois positive ou nulle et négative ou nulle.'],
        ['Où se situe le point d’inflexion d’une courbe logistique en S ?', ['Au démarrage', 'Au plafond', 'À mi-chemin du plafond', 'Il n’y en a pas'], 2, 'La courbe passe de convexe à concave à mi-chemin du plafond : c’est là que la vitesse de croissance est maximale.'],
        ['Une grandeur décroissante et convexe…', ['Baisse en accélérant', 'Augmente de plus en plus vite', 'Est constante', 'Baisse en ralentissant'], 3, 'f′ < 0 et f′ croissante : la pente négative se rapproche de 0, la baisse ralentit.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Primitives et équations différentielles',
      questions: [
        ['Deux primitives d’une même fonction continue sur un intervalle…', ['Diffèrent d’une constante', 'Sont égales', 'Sont opposées', 'Diffèrent d’un facteur multiplicatif'], 0, 'Toutes les primitives diffèrent d’une constante ; une condition initiale en désigne une seule.'],
        ['Quelle est une primitive de x² ?', ['2x', 'x³/3', 'x³', '3x²'], 1, 'Pour xⁿ avec n différent de −1, une primitive est x^(n+1)/(n+1) : ici x³/3.'],
        ['Quelle est une primitive de 2x e^(x²) ?', ['e^(2x)', '2 e^(x²)', 'e^(x²)', 'x² e^(x²)'], 2, 'On reconnaît u′ e^u avec u = x² et u′ = 2x : une primitive est e^u = e^(x²).'],
        ['Quel phénomène est décrit par une vitesse d’évolution proportionnelle à la quantité présente ?', ['Une évolution linéaire', 'Une oscillation', 'Une évolution constante', 'L’équation y′ = a y'], 3, 'Vitesse proportionnelle à la quantité : c’est l’équation y′ = a y, dont les solutions sont x ↦ C e^(a x).'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Intégration',
      questions: [
        ['La valeur moyenne d’une fonction sur [a ; b] est-elle toujours égale à (f(a) + f(b))/2 ?', ['Oui, toujours', 'Non, seulement si la fonction est affine', 'Oui, si f est positive', 'Non, jamais'], 1, 'La demi-somme des bornes ne coïncide avec la valeur moyenne que pour une fonction affine : piège fréquent.'],
        ['Un débit en L/min intégré sur des minutes donne…', ['Un volume en litres', 'Un débit moyen en L/min', 'Une durée en minutes', 'Une vitesse en L/min²'], 0, 'L’unité du résultat est le produit des unités des deux axes : L/min × min = L.'],
        ['Si f est inférieure à g sur [a ; b], alors…', ['L’intégrale de f vaut celle de g', 'L’intégrale de f est positive', 'L’intégrale de f est inférieure ou égale à celle de g', 'L’intégrale de g est nulle'], 2, 'C’est la croissance de l’intégrale : l’inégalité entre fonctions se conserve en intégrant.'],
        ['Pour f supérieure à g sur [a ; b], l’aire entre les deux courbes vaut…', ['L’intégrale de f × g', 'L’intégrale de f plus celle de g', 'L’intégrale de (g − f)', 'L’intégrale de (f − g)'], 3, 'On intègre la différence « au-dessus moins au-dessous », f − g, positive sur l’intervalle.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Lois discrètes',
      questions: [
        ['Quelle formule donne la variance d’une variable aléatoire X ?', ['E(X)² − E(X²)', 'E(X²) − E(X)²', 'E(X) − E(X)²', 'E(X²)'], 1, 'V(X) = E(X²) − E(X)² : la moyenne des carrés moins le carré de la moyenne.'],
        ['Pourquoi préfère-t-on souvent l’écart-type à la variance ?', ['Il est dans la même unité que X', 'Il est toujours plus grand', 'Il peut être négatif', 'Il ne dépend pas de la loi'], 0, 'L’écart-type est la racine de la variance : il s’exprime dans l’unité de X, donc se lit plus facilement.'],
        ['Que vaut E(aX + b) ?', ['a² E(X)', 'a E(X)', 'a E(X) + b', 'E(X) + b'], 2, 'L’espérance est linéaire : E(aX + b) = a E(X) + b ; c’est la variance qui prend a² et perd b.'],
        ['Quelle condition de la loi binomiale un tirage sans remise dans une petite population viole-t-il ?', ['Les deux issues', 'Le nombre d’épreuves', 'L’identité des épreuves seulement', 'L’indépendance des épreuves'], 3, 'Sans remise, chaque tirage modifie la composition de la population : les épreuves ne sont plus indépendantes.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Lois à densité',
      questions: [
        ['Que vaut l’intégrale d’une densité de probabilité sur tout son intervalle de définition ?', ['0', 'Son maximum', '1', 'Son espérance'], 2, 'Une densité est continue, positive et d’intégrale totale 1 : la probabilité de l’univers entier.'],
        ['Quelle est l’espérance d’une loi uniforme sur [a ; b] ?', ['(a + b)/2', 'b − a', '1/(b − a)', '(b − a)/2'], 0, 'Toutes les valeurs de l’intervalle se valent : la moyenne est le milieu, (a + b)/2.'],
        ['Pour une loi exponentielle de paramètre λ, que vaut P(X > t) ?', ['1 − e^(−λt)', 'e^(−λt)', 'λ e^(−λt)', 'e^(λt)'], 1, 'P(X > t) = e^(−λt) : la probabilité de dépasser t décroît exponentiellement.'],
        ['X suit une loi uniforme sur [0 ; 10]. Que vaut P(2 ≤ X ≤ 5) ?', ['0,5', '0,2', '0,7', '0,3'], 3, 'P = (5 − 2)/(10 − 0) = 3/10 = 0,3 : seule la longueur de l’intervalle compte.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Statistique à deux variables',
      questions: [
        ['Quelles sont les coordonnées du point moyen G d’un nuage ?', ['Le premier et le dernier point', 'La moyenne des x et la moyenne des y', 'La médiane des x et la médiane des y', 'Le maximum des x et le maximum des y'], 1, 'G a pour abscisse la moyenne des x et pour ordonnée la moyenne des y ; la droite de régression y passe toujours.'],
        ['Que faut-il faire avant tout calcul d’ajustement ?', ['Calculer r', 'Extrapoler', 'Regarder le nuage de points', 'Passer au logarithme'], 2, 'La lecture du nuage dit si un ajustement affine a un sens et signale les points aberrants.'],
        ['Selon le cours, qu’est-ce qui seul permet d’établir une causalité ?', ['Une expérimentation contrôlée', 'Un coefficient r proche de 1', 'Un très grand échantillon', 'Une droite de régression'], 0, 'Un coefficient de corrélation ne prouve jamais une causalité ; seule une expérience contrôlée le peut.'],
        ['Quel changement de variable linéarise un modèle logarithmique ?', ['Poser z = ln(y)', 'Poser z = y²', 'Poser z = e^x', 'Poser z = ln(x)'], 3, 'Pour un modèle y = a ln(x) + b, poser z = ln(x) donne une relation affine entre z et y.'],
      ],
    },
  ],
}
