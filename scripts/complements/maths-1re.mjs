export default {
  slug: 'maths',
  titreMigration: 'QUESTIONS EN PLUS — MATHS 1re',
  motif: `Quatre questions de plus par quiz : huit suffisaient pour se tester une fois, pas pour réviser sur plusieurs semaines.`,
  chapitres: [
    {
      niveau: '1re',
      titre: 'Les suites numériques',
      questions: [
        ['Pour la suite définie par u(n) = 3n − 2, que vaut u(4) ?', ['12', '7', '10', '14'], 2, 'On remplace n par 4 : 3 × 4 − 2 = 10. C’est l’avantage d’une définition explicite.'],
        ['On a u(0) = 5 et u(n+1) = 2 u(n) + 1. Que vaut u(2) ?', ['11', '23', '21', '13'], 1, 'u(1) = 2 × 5 + 1 = 11, puis u(2) = 2 × 11 + 1 = 23 : avec une récurrence, on avance pas à pas.'],
        ['Quand peut-on comparer u(n+1) / u(n) à 1 pour étudier les variations ?', ['Pour n’importe quelle suite', 'Seulement si la suite est arithmétique', 'Seulement si la suite est majorée', 'Seulement si tous les termes sont strictement positifs'], 3, 'Si un terme était négatif, l’inégalité changerait de sens en multipliant : la méthode du quotient exige des termes strictement positifs.'],
        ['Que signifie « la suite (u) est majorée » ?', ['Il existe un nombre M tel que u(n) ≤ M pour tout n', 'Elle est croissante', 'Tous ses termes sont positifs', 'Elle tend vers plus l’infini'], 0, 'Un majorant est un plafond que la suite ne dépasse jamais ; une suite croissante peut très bien ne pas en avoir.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Les suites arithmétiques et géométriques',
      questions: [
        ['Une suite arithmétique vérifie u(3) = 10 et a pour raison r = 4. Que vaut u(10) ?', ['40', '38', '50', '44'], 1, 'On utilise u(n) = u(p) + (n − p) × r : u(10) = 10 + 7 × 4 = 38.'],
        ['Comment se représentent graphiquement les termes d’une suite arithmétique ?', ['Par des points alignés', 'Par une courbe qui s’emballe', 'Par une parabole', 'Par des points sur un cercle'], 0, 'Chaque pas ajoute la même raison r : les points (n ; u(n)) sont sur une droite, c’est une croissance linéaire.'],
        ['Quelle est la raison de la suite géométrique qui modélise une baisse de 5 % par an ?', ['0,05', '−0,05', '0,95', '1,05'], 2, 'Une évolution de t % revient à multiplier par 1 + t / 100 ; ici 1 − 0,05 = 0,95.'],
        ['Que vaut la somme 1 + 2 + 2² + … + 2⁵ ?', ['32', '64', '31', '63'], 3, 'Avec q = 2 et n = 5 : (1 − 2⁶) / (1 − 2) = (1 − 64) / (−1) = 63.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Le second degré',
      questions: [
        ['Pour f(x) = x² − 5x + 6, que vaut le discriminant Δ ?', ['1', '49', '−1', '11'], 0, 'Δ = b² − 4ac = 25 − 24 = 1 : il est positif, donc le trinôme a deux racines, 2 et 3.'],
        ['Dans la forme canonique a (x − α)² + β, que représente le point (α ; β) ?', ['Les deux racines', 'Le sommet de la parabole', 'L’ordonnée à l’origine', 'Le point d’intersection avec l’axe des abscisses'], 1, 'La forme canonique donne à lire le sommet, avec α = −b / (2a) et β = f(α).'],
        ['Quelle forme du trinôme donne directement l’ordonnée à l’origine ?', ['La forme canonique', 'La forme factorisée', 'La forme développée', 'Aucune des trois'], 2, 'Dans a x² + b x + c, f(0) = c : la forme développée donne l’ordonnée à l’origine sans calcul.'],
        ['Que vaut le produit des racines d’un trinôme a x² + b x + c qui en a deux ?', ['−b / a', 'b / a', '−c / a', 'c / a'], 3, 'La somme des racines vaut −b / a et leur produit c / a : de quoi vérifier un calcul de racines en un instant.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Dérivation',
      questions: [
        ['Quelle est la dérivée de √x, pour x > 0 ?', ['2√x', '1 / (2√x)', '√x / 2', '1 / √x'], 1, '(√x)’ = 1 / (2√x) ; elle n’est définie que pour x strictement positif.'],
        ['Quelle est la dérivée de f(x) = x³ ?', ['3x²', 'x²', '3x³', '3x'], 0, 'On applique (x puissance n)’ = n × x puissance (n − 1) avec n = 3.'],
        ['Que vaut la dérivée de 1 / v ?', ['1 / v’', 'v’ / v²', '−1 / v²', '−v’ / v²'], 3, '(1 / v)’ = −v’ / v² : on retrouve −1 / x² pour v(x) = x.'],
        ['Pour f(x) = x³, que se passe-t-il en 0 ?', ['f admet un maximum', 'f admet un minimum', 'La tangente est horizontale mais f reste croissante', 'f n’est pas dérivable'], 2, 'f’(0) = 0 sans changement de signe : il n’y a pas d’extremum. C’est le contre-exemple classique.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Variations et courbes représentatives de fonctions',
      questions: [
        ['Quelle valeur faut-il exclure de l’ensemble de définition de f(x) = 1 / (x − 2) ?', ['0', '2', '−2', '1'], 1, 'La division par zéro est interdite : x − 2 ne doit pas s’annuler, donc x ≠ 2.'],
        ['Qu’appelle-t-on un extremum global ?', ['Un extremum sur tout l’ensemble de définition', 'Un extremum sur un petit intervalle autour du point', 'Un point où la courbe coupe l’axe des abscisses', 'Un point où la dérivée est positive'], 0, 'Un extremum local ne vaut qu’autour du point ; un extremum global vaut sur tout l’ensemble de définition.'],
        ['Quelle symétrie a la courbe d’une fonction impaire ?', ['Par rapport à l’axe des abscisses', 'Par rapport à l’axe des ordonnées', 'Par rapport à la droite y = x', 'Par rapport à l’origine'], 3, 'Une fonction impaire vérifie f(−x) = −f(x) : sa courbe est symétrique par rapport à l’origine.'],
        ['Sans stricte monotonie, que garantit encore le théorème des valeurs intermédiaires pour une fonction continue ?', ['Rien du tout', 'L’unicité de la solution', 'L’existence d’au moins une solution', 'Que la solution est un entier'], 2, 'La continuité suffit pour l’existence ; c’est la stricte monotonie qui apporte l’unicité.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Fonction exponentielle',
      questions: [
        ['Que vaut e puissance (−a) ?', ['−e puissance a', '1 / (e puissance a)', 'e puissance a', '0'], 1, 'Puisque e puissance a × e puissance (−a) = e puissance 0 = 1, on a e puissance (−a) = 1 / (e puissance a).'],
        ['Quelle est une valeur approchée du nombre e ?', ['2,718', '3,142', '1,414', '1,618'], 0, 'e ≈ 2,718 est l’image de 1 par la fonction exponentielle ; 3,142 est π, 1,414 est √2.'],
        ['Quelle est la dérivée de e puissance (x²) ?', ['e puissance (x²)', 'x² e puissance (x²)', 'e puissance (2x)', '2x e puissance (x²)'], 3, 'On applique (e puissance u)’ = u’ × e puissance u avec u = x², donc u’ = 2x.'],
        ['On étudie le signe de (x − 1) × e puissance x. De quoi dépend-il ?', ['Du signe de e puissance x', 'Des deux facteurs à la fois', 'Uniquement du signe de x − 1', 'Il est toujours positif'], 2, 'L’exponentielle est strictement positive : elle ne change jamais le signe d’un produit.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Fonctions trigonométriques',
      questions: [
        ['Combien de radians valent 45° ?', ['π/4', 'π/6', 'π/3', 'π/2'], 0, '180° correspondent à π radians ; 45° en sont le quart, soit π/4.'],
        ['Que vaut cos(π − x) ?', ['cos x', '−cos x', 'sin x', '−sin x'], 1, 'Les points associés à x et à π − x sont symétriques par rapport à l’axe des ordonnées : même sinus, cosinus opposés.'],
        ['Quelle est la dérivée de la fonction sinus ?', ['−sin x', '−cos x', 'cos x', 'sin x'], 2, '(sin x)’ = cos x ; c’est la dérivée du cosinus qui porte un signe moins.'],
        ['Que vaut sin(π/6) ?', ['√3 / 2', '√2 / 2', '1', '1/2'], 3, 'À π/6 (30°), le sinus vaut 1/2 et le cosinus √3 / 2 ; à π/3, c’est l’inverse.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Calcul vectoriel et produit scalaire',
      questions: [
        ['Que vaut le produit scalaire des vecteurs u(2 ; 3) et v(4 ; −1) en repère orthonormé ?', ['11', '5', '8', '−3'], 1, 'u · v = x x’ + y y’ = 2 × 4 + 3 × (−1) = 8 − 3 = 5.'],
        ['Deux vecteurs de normes 3 et 4 forment un angle de 60°. Que vaut leur produit scalaire ?', ['6', '12', '7', '6√3'], 0, 'u · v = 3 × 4 × cos 60° = 12 × 1/2 = 6.'],
        ['Que permet d’écrire la bilinéarité du produit scalaire ?', ['u · v = v · u', 'u · u = norme de u au carré', 'u · (v + w) = u · v + u · w', 'u · v = 0 si u et v sont orthogonaux'], 2, 'La bilinéarité, c’est la distributivité et la sortie des coefficients : u · (v + w) = u · v + u · w et (k u) · v = k (u · v).'],
        ['Quelle formule donne le théorème d’Al-Kashi dans un triangle ABC ?', ['a² = b² + c²', 'a² = b² + c² + 2 b c cos A', 'a = b + c − 2 cos A', 'a² = b² + c² − 2 b c cos A'], 3, 'Al-Kashi vaut dans tout triangle ; quand A = 90°, cos A = 0 et l’on retrouve Pythagore.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Géométrie repérée',
      questions: [
        ['Quel est un vecteur normal à la droite d’équation 2x − 3y + 1 = 0 ?', ['n(2 ; −3)', 'n(3 ; 2)', 'n(−3 ; 2)', 'n(1 ; 2)'], 0, 'Pour a x + b y + c = 0, le vecteur n(a ; b) est normal ; le vecteur directeur est u(−b ; a), ici u(3 ; 2).'],
        ['Quel est le milieu du segment [AB] avec A(2 ; 4) et B(6 ; −2) ?', ['(8 ; 2)', '(4 ; 1)', '(2 ; −3)', '(4 ; 3)'], 1, 'On fait la moyenne des coordonnées : ((2 + 6) / 2 ; (4 − 2) / 2) = (4 ; 1).'],
        ['Quel est le coefficient directeur de la droite (AB) avec A(1 ; 2) et B(3 ; 8) ?', ['2', '1/3', '6', '3'], 3, 'm = (y(B) − y(A)) / (x(B) − x(A)) = (8 − 2) / (3 − 1) = 3.'],
        ['Après avoir complété les carrés, on obtient (x − 1)² + (y + 2)² = −4. Quel est l’ensemble ?', ['Un cercle de rayon 2', 'Le point (1 ; −2)', 'L’ensemble vide', 'Un cercle de rayon 4'], 2, 'Une somme de carrés ne peut pas valoir un nombre négatif : aucun point ne convient.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Probabilités conditionnelles et indépendance',
      questions: [
        ['On a P(A) = 0,4 et P(A)(B) = 0,5. Que vaut P(A inter B) ?', ['0,9', '0,2', '0,8', '0,1'], 1, 'P(A inter B) = P(A) × P(A)(B) = 0,4 × 0,5 = 0,2 : c’est le produit des branches du chemin.'],
        ['Comment obtient-on la probabilité d’un événement à partir d’un arbre pondéré ?', ['En additionnant les probabilités des chemins qui y mènent', 'En multipliant toutes les branches de l’arbre', 'En prenant la branche la plus probable', 'En divisant par le nombre de chemins'], 0, 'On multiplie le long d’un chemin, puis on additionne les chemins qui mènent à l’événement : c’est la formule des probabilités totales.'],
        ['A et B sont indépendants avec P(B) = 0,3. Que vaut P(A)(B) ?', ['0,7', '0', '1', '0,3'], 3, 'L’indépendance signifie que savoir A ne change rien : P(A)(B) = P(B).'],
        ['Comment prouve-t-on que deux événements sont indépendants ?', ['On le voit sur l’énoncé', 'On vérifie qu’ils sont incompatibles', 'On vérifie par le calcul que P(A inter B) = P(A) × P(B)', 'On vérifie que P(A) = P(B)'], 2, 'L’indépendance ne se devine pas, elle se démontre par un calcul.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Variable aléatoire et loi de probabilité',
      questions: [
        ['Quelle est l’espérance du lancer d’un dé équilibré à six faces ?', ['3', '3,5', '4', '6'], 1, '(1 + 2 + 3 + 4 + 5 + 6) / 6 = 21 / 6 = 3,5 : une valeur que le dé ne peut jamais donner.'],
        ['Une espérance de gain de −0,50 € signifie que le jeu est…', ['favorable au joueur', 'équitable', 'favorable à l’organisateur', 'impossible à jouer'], 2, 'En moyenne, sur un grand nombre de parties, le joueur perd 50 centimes par partie : l’organisateur gagne.'],
        ['Que vaut E(2X + 3) si E(X) = 5 ?', ['13', '10', '16', '8'], 0, 'E(aX + b) = a E(X) + b = 2 × 5 + 3 = 13 ; contrairement à la variance, b reste.'],
        ['Si X est une durée en minutes, en quelle unité s’exprime sa variance ?', ['En minutes', 'Sans unité', 'En pourcentage', 'En minutes au carré'], 3, 'La variance est dans le carré de l’unité de X ; l’écart type, sa racine, revient en minutes et s’interprète.'],
      ],
    },
  ],
}
