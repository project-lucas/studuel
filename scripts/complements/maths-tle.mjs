export default {
  slug: 'maths',
  titreMigration: 'QUESTIONS EN PLUS — MATHS Tle',
  motif: `Quatre questions de plus par quiz : huit suffisaient pour se tester une fois, pas pour réviser sur plusieurs semaines.`,
  chapitres: [
    {
      niveau: 'Tle',
      titre: 'Factorielle, k-uplet, permutation et combinaison',
      questions: [
        ['Combien de codes à 4 chiffres (de 0 à 9) peut-on former ?', ['4 000', '10 000', '5 040', '210'], 1, 'L’ordre compte et les chiffres peuvent se répéter : c’est un 4-uplet, soit 10⁴ = 10 000 codes.'],
        ['Combien de podiums de 3 places peut-on former avec 8 coureurs ?', ['56', '512', '336', '24'], 2, 'L’ordre compte et un coureur n’occupe qu’une place : c’est un arrangement, 8 × 7 × 6 = 336.'],
        ['De combien de façons peut-on ranger 5 objets distincts en ligne ?', ['120', '25', '3 125', '60'], 0, 'Ordonner n objets distincts, c’est une permutation : 5! = 5 × 4 × 3 × 2 × 1 = 120.'],
        ['Pourquoi divise-t-on par k! dans la formule de C(n,k) ?', ['Pour autoriser les répétitions', 'Pour exclure les éléments non choisis', 'Pour obtenir un nombre pair', 'Pour effacer l’ordre des k éléments choisis'], 3, 'On part des arrangements n!/(n−k)!, puis on divise par les k! façons d’ordonner les éléments choisis : il ne reste que la partie, sans ordre.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Droites, plans et vecteurs de l’espace',
      questions: [
        ['Quelles sont les coordonnées du vecteur AB pour A(1 ; 2 ; 3) et B(4 ; 0 ; 5) ?', ['(5 ; 2 ; 8)', '(−3 ; 2 ; −2)', '(3 ; −2 ; 2)', '(3 ; 2 ; 2)'], 2, 'On calcule « arrivée moins départ » coordonnée par coordonnée : (4 − 1 ; 0 − 2 ; 5 − 3) = (3 ; −2 ; 2).'],
        ['Comment obtient-on les coordonnées du milieu de [AB] dans l’espace ?', ['En faisant la moyenne des coordonnées de A et de B', 'En soustrayant les coordonnées de A à celles de B', 'En additionnant les coordonnées de A et de B', 'En multipliant les coordonnées de A et de B'], 0, 'Comme dans le plan, avec une coordonnée de plus : chaque coordonnée du milieu est la moyenne de celles de A et de B.'],
        ['Deux plans parallèles coupés par un troisième plan déterminent deux droites…', ['Sécantes', 'Non coplanaires', 'Orthogonales', 'Parallèles'], 3, 'C’est l’un des théorèmes du chapitre : les deux droites d’intersection sont parallèles.'],
        ['Parmi ces données, laquelle suffit à définir un plan ?', ['Deux points distincts', 'Trois points non alignés', 'Un point et un seul vecteur directeur', 'Trois points alignés'], 1, 'Trois points non alignés fournissent un point et deux vecteurs directeurs non colinéaires ; alignés, ils ne définissent qu’une droite.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Positions relatives de droites et de plans de l’espace',
      questions: [
        ['Combien de points communs une droite sécante à un plan a-t-elle avec lui ?', ['Aucun', 'Deux', 'Un seul', 'Une infinité'], 2, 'Une droite sécante coupe le plan en un unique point ; une infinité signifie qu’elle y est incluse, aucun qu’elle lui est strictement parallèle.'],
        ['Deux droites ont des vecteurs directeurs colinéaires et un point commun. Elles sont…', ['Confondues', 'Sécantes', 'Non coplanaires', 'Strictement parallèles'], 0, 'Directeurs colinéaires : les droites sont parallèles ; si un point de l’une appartient à l’autre, elles sont confondues.'],
        ['Quand trois plans ont-ils un unique point commun ?', ['Quand leurs vecteurs normaux sont colinéaires', 'Quand deux d’entre eux sont parallèles', 'Quand ils passent tous par l’origine', 'Quand leurs trois vecteurs normaux sont non coplanaires'], 3, 'Des vecteurs normaux non coplanaires garantissent que le système des trois équations a une solution unique : un point.'],
        ['Qu’appelle-t-on la configuration « en prisme » de trois plans ?', ['Trois plans qui se coupent en un point', 'Trois plans sécants deux à deux selon trois droites parallèles distinctes', 'Trois plans confondus', 'Trois plans parallèles entre eux'], 1, 'Chaque paire de plans se coupe selon une droite, mais les trois droites sont parallèles : les trois plans n’ont aucun point commun.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Produit scalaire, orthogonalité et distances dans l’espace',
      questions: [
        ['Que vaut ‖u + v‖² ?', ['‖u‖² + ‖v‖²', '‖u‖² − 2 u · v + ‖v‖²', '(‖u‖ + ‖v‖)²', '‖u‖² + 2 u · v + ‖v‖²'], 3, 'Les identités remarquables s’appliquent aux vecteurs : le terme 2 u · v disparaît seulement si u et v sont orthogonaux.'],
        ['Que vaut u · v pour u(1 ; 2 ; −1) et v(3 ; −1 ; 1) ?', ['2', '0', '4', '−2'], 1, '1 × 3 + 2 × (−1) + (−1) × 1 = 3 − 2 − 1 = 0 : les deux vecteurs sont orthogonaux.'],
        ['Quel vecteur est normal au plan d’équation 2x − y + 3z + 4 = 0 ?', ['n(2 ; −1 ; 3)', 'n(2 ; 1 ; 3)', 'n(−1 ; 3 ; 4)', 'n(2 ; −1 ; 4)'], 0, 'Les coefficients de x, y et z sont exactement les coordonnées d’un vecteur normal ; le terme constant d n’y entre pas.'],
        ['Quelle est la distance de l’origine O au plan d’équation x + 2y + 2z − 6 = 0 ?', ['6', '3', '2', '6/5'], 2, 'On divise |0 + 0 + 0 − 6| = 6 par √(1² + 2² + 2²) = √9 = 3 : la distance vaut 2.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Représentations paramétriques de droites et équations cartésiennes de plans de l’espace',
      questions: [
        ['Quel point de la droite x = 1 + 2t, y = −t, z = 3 + t obtient-on pour t = 1 ?', ['(1 ; 0 ; 3)', '(3 ; 1 ; 4)', '(2 ; −1 ; 1)', '(3 ; −1 ; 4)'], 3, 'On remplace t par 1 : x = 1 + 2 = 3, y = −1, z = 3 + 1 = 4.'],
        ['Quel est un vecteur directeur de la droite x = 2 + 3t, y = 1 − t, z = 4 ?', ['(3 ; −1 ; 0)', '(2 ; 1 ; 4)', '(3 ; −1 ; 4)', '(3 ; 1 ; 0)'], 0, 'Le vecteur directeur se lit sur les coefficients de t ; z ne dépend pas de t, sa coordonnée est donc 0.'],
        ['Que décrit l’équation obtenue en multipliant 2x − y + z − 1 = 0 par 3 ?', ['Un plan parallèle distinct', 'Le même plan', 'Un plan orthogonal', 'Un plan passant par l’origine'], 1, 'Multiplier toute l’équation par un réel non nul ne change pas l’ensemble des points : l’équation cartésienne d’un plan n’est pas unique.'],
        ['Comment vérifier que deux représentations paramétriques décrivent la même droite ?', ['En comparant leurs constantes', 'En comparant leurs paramètres', 'En testant la colinéarité des directeurs, puis l’appartenance d’un point de l’une à l’autre', 'En calculant le produit scalaire des directeurs'], 2, 'Des directeurs colinéaires donnent des droites parallèles ; un point commun les rend confondues.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Raisonnement par récurrence',
      questions: [
        ['Dans l’image de l’échelle, à quoi correspond l’initialisation ?', ['Passer d’un barreau au suivant', 'Atteindre le sommet', 'Monter sur le premier barreau', 'Choisir la hauteur de l’échelle'], 2, 'L’initialisation met le pied sur le premier barreau ; l’hérédité permet de passer de chaque barreau au suivant.'],
        ['La propriété « 2ⁿ > n² » est-elle vraie pour n = 3 ?', ['Oui, car 8 > 6', 'Non, car 8 < 9', 'Oui, car 9 > 8', 'On ne peut pas le savoir'], 1, '2³ = 8 et 3² = 9 : elle est fausse. Elle est pourtant héréditaire à partir d’un rang, preuve que l’hérédité seule ne démontre rien.'],
        ['Pourquoi est-ce une faute d’utiliser P(n+1) pour démontrer l’hérédité ?', ['Parce que P(n+1) est toujours fausse', 'Parce que cela allonge la démonstration', 'Parce que P(n+1) ne dépend pas de n', 'Parce que c’est supposer ce qu’on veut démontrer'], 3, 'L’hypothèse de récurrence est P(n) ; P(n+1) est la conclusion à atteindre.'],
        ['Qu’attend-on dans la rédaction de l’initialisation ?', ['La vérification de P(n₀) par le calcul, en écrivant les deux membres', 'La supposition que P(n) est vraie', 'Le calcul de P(n+1)', 'La phrase de conclusion'], 0, 'On vérifie P(n₀) par un calcul explicite de chaque membre : la rigueur de la rédaction fait partie de la note.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Limites de suites',
      questions: [
        ['Quel est le comportement de la suite (−2)ⁿ ?', ['Elle tend vers +∞', 'Elle tend vers 0', 'Elle tend vers −∞', 'Elle n’a pas de limite'], 3, 'Pour q inférieur ou égal à −1, qⁿ n’a pas de limite : ici les termes changent de signe en grandissant en valeur absolue.'],
        ['Comment lever l’indétermination de n² − n en +∞ ?', ['En factorisant par n², le terme dominant', 'En multipliant par l’expression conjuguée', 'En appliquant le théorème des gendarmes', 'En passant au logarithme'], 0, 'n² − n = n²(1 − 1/n) : le premier facteur tend vers +∞, le second vers 1, donc la limite est +∞.'],
        ['Quel outil démontre que qⁿ tend vers +∞ lorsque q > 1 ?', ['Le théorème des gendarmes', 'L’inégalité de Bernoulli', 'La relation de Pascal', 'Le théorème de la limite monotone'], 1, 'En écrivant q = 1 + a avec a > 0, on a qⁿ supérieur ou égal à 1 + n a, qui tend vers +∞ : on conclut par minoration.'],
        ['Quelle est la limite de cos(n)/n ?', ['1', 'Elle n’existe pas', '0', '+∞'], 2, 'cos(n) est compris entre −1 et 1, donc cos(n)/n est encadré par −1/n et 1/n, qui tendent vers 0 : c’est le théorème des gendarmes.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Limites de fonctions',
      questions: [
        ['Quelle est la limite de 1/√x quand x tend vers 0 par valeurs positives ?', ['0', '+∞', '1', '−∞'], 1, 'Le dénominateur √x tend vers 0 en restant positif : le quotient tend vers +∞.'],
        ['Quelle est la limite de (3x² + 1)/(x² − 5) en +∞ ?', ['+∞', '0', '−1/5', '3'], 3, 'En +∞, une fraction rationnelle a la limite du quotient de ses termes de plus haut degré : 3x²/x² = 3.'],
        ['Quand la droite x = a est-elle asymptote verticale à la courbe de f ?', ['Quand f(x) tend vers ±∞ quand x tend vers a', 'Quand f(a) = 0', 'Quand f(x) tend vers a en l’infini', 'Quand f n’est pas dérivable en a'], 0, 'Une asymptote verticale traduit une limite infinie en un réel, souvent une valeur interdite.'],
        ['Quelle technique lève en général une forme 0/0 en un point ?', ['Factoriser par le terme de plus haut degré', 'Multiplier par x', 'Reconnaître un taux d’accroissement', 'Remplacer x par sa valeur'], 2, 'Une forme 0/0 en a cache souvent (f(x) − f(a))/(x − a), dont la limite est le nombre dérivé f′(a).'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Dérivée de 2 fonctions composées',
      questions: [
        ['Quelle est la dérivée de 1/u, pour u non nulle ?', ['1/u′', '−u′/u²', '−1/u²', 'u′/u²'], 1, 'C’est la dérivée de la fonction inverse (−1/y²) prise en u, multipliée par u′.'],
        ['Quelle est la dérivée de e^(3x² + 1) ?', ['e^(3x² + 1)', '6x', '(3x² + 1) e^(3x²)', '6x e^(3x² + 1)'], 3, 'Avec u = 3x² + 1 et u′ = 6x, la formule (e^u)′ = u′ e^u donne 6x e^(3x² + 1).'],
        ['Quelle est la dérivée de ln(x² + 1) ?', ['2x / (x² + 1)', '1 / (x² + 1)', '2x ln(x² + 1)', '1 / (2x)'], 0, 'x² + 1 est toujours strictement positif ; (ln u)′ = u′/u avec u′ = 2x.'],
        ['Pourquoi √u n’est-elle dérivable que là où u est strictement positive ?', ['Parce que √u n’est pas définie en 0', 'Parce que u′ s’annule en 0', 'Parce que la racine carrée n’est pas dérivable en 0, bien qu’elle y soit définie', 'Parce que √u est décroissante'], 2, 'La dérivée u′/(2√u) exige √u non nulle : la racine est définie en 0 mais pas dérivable.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Fonctions convexes',
      questions: [
        ['Où se place la courbe d’une fonction convexe par rapport à ses cordes ?', ['Au-dessus', 'Confondue avec elles', 'Elle les traverse toujours', 'Au-dessous'], 3, 'Convexe : au-dessus des tangentes, mais au-dessous des cordes entre deux de ses points.'],
        ['Pour f dérivable, f est convexe sur un intervalle si et seulement si…', ['f′ est croissante', 'f′ est positive', 'f est croissante', 'f′ est nulle'], 0, 'La convexité se lit sur la croissance de f′, c’est-à-dire sur le signe positif de f″ ; pas sur le signe de f′.'],
        ['En quel point la fonction cube change-t-elle de convexité ?', ['En 1', 'En 0', 'En −1', 'Elle n’en change jamais'], 1, 'Sa dérivée seconde 6x change de signe en 0 : x³ est concave sur les négatifs, convexe sur les positifs.'],
        ['Sur une courbe, f′ > 0 et f″ > 0 se lisent comme…', ['« ça augmente de moins en moins vite »', '« ça diminue de plus en plus vite »', '« ça augmente de plus en plus vite »', '« ça stagne »'], 2, 'f′ > 0 : la fonction croît ; f″ > 0 : sa pente elle-même augmente, la croissance accélère.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Continuité des fonctions d’une variable réelle',
      questions: [
        ['Quel exemple montre qu’une fonction continue n’est pas forcément dérivable ?', ['L’exponentielle en 0', 'La valeur absolue en 0', 'Le cosinus en 0', 'Un polynôme en 0'], 1, 'La valeur absolue est continue en 0, mais sa courbe y présente un point anguleux : elle n’y est pas dérivable.'],
        ['Pour appliquer le théorème des valeurs intermédiaires à f(x) = k sur [a ; b], que faut-il vérifier sur k ?', ['Qu’il est positif', 'Qu’il est entier', 'Qu’il vaut f((a + b)/2)', 'Qu’il est compris entre f(a) et f(b)'], 3, 'Continuité et encadrement de k entre les valeurs aux bornes : ce sont les deux hypothèses du théorème.'],
        ['Environ combien d’étapes de dichotomie faut-il pour gagner trois décimales ?', ['Dix', 'Trois', 'Cent', 'Mille'], 0, 'Chaque étape divise l’amplitude par deux ; après dix étapes, elle est divisée par 2¹⁰ = 1 024, soit environ mille.'],
        ['La fonction x ↦ e^(sin x) est-elle continue sur ℝ ?', ['Non, car sin s’annule', 'Seulement sur [0 ; π]', 'Oui, comme composée de fonctions continues', 'Non, car elle est périodique'], 2, 'Sinus et exponentielle sont continues sur ℝ ; une composée de fonctions continues est continue.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Fonction logarithme népérien (ln)',
      questions: [
        ['Que vaut ln(a/b) pour a et b strictement positifs ?', ['ln a / ln b', 'ln(a − b)', 'ln a − ln b', 'ln b − ln a'], 2, 'Le logarithme transforme un quotient en différence, comme il transforme un produit en somme.'],
        ['Quel est le signe de ln(x) pour x strictement compris entre 0 et 1 ?', ['Positif', 'Négatif', 'Nul', 'Il n’est pas défini'], 1, 'ln(1) = 0 et ln est strictement croissante : avant 1, ln(x) est négatif.'],
        ['Quelle formule donne la demi-vie d’un noyau radioactif de constante λ ?', ['ln(2)/λ', 'λ/ln(2)', '2λ', 'e^(−λ)'], 0, 'On cherche t tel que e^(−λt) = 1/2, soit −λt = −ln 2, donc t = ln(2)/λ.'],
        ['Comment se placent les courbes de ln et de l’exponentielle l’une par rapport à l’autre ?', ['Elles sont confondues', 'Elles sont symétriques par rapport à l’axe des abscisses', 'Elles sont parallèles', 'Elles sont symétriques par rapport à la droite y = x'], 3, 'Les deux fonctions sont réciproques l’une de l’autre : leurs courbes sont symétriques par rapport à la droite y = x.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Fonction ln (logarithme népérien) : continuité, limites et dérivabilité',
      questions: [
        ['Que vaut la dérivée seconde de ln ?', ['1/x²', '−1/x', '−1/x²', 'ln(x)'], 2, 'On dérive 1/x : on obtient −1/x², strictement négatif, d’où la concavité de ln.'],
        ['Quelle est la limite de ln(1 + x)/x quand x tend vers 0 ?', ['0', '1', '+∞', 'e'], 1, 'C’est un taux d’accroissement de ln en 1 : sa limite est ln′(1) = 1.'],
        ['Quelle est la limite de e^x/x² en +∞ ?', ['+∞', '0', '1', 'Elle n’existe pas'], 0, 'Croissance comparée : l’exponentielle l’emporte sur toute puissance de x.'],
        ['Sur quel ensemble étudie-t-on la fonction x ↦ ln(x − 2) ?', ['ℝ', '[2 ; +∞[', ']0 ; +∞[', ']2 ; +∞['], 3, 'L’argument doit être strictement positif : x − 2 > 0, soit x > 2.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Fonctions cosinus et sinus',
      questions: [
        ['Que vaut cos(x + π) ?', ['cos x', '−cos x', 'sin x', '−sin x'], 1, 'Ajouter π fait un demi-tour sur le cercle trigonométrique : cosinus et sinus changent de signe.'],
        ['Que vaut cos(π/2 − x) ?', ['cos x', '−sin x', '−cos x', 'sin x'], 3, 'Le passage à l’angle complémentaire échange les deux fonctions : cos(π/2 − x) = sin x.'],
        ['Quelles sont les solutions de sin(x) = sin(a) ?', ['x = a + 2kπ ou x = π − a + 2kπ', 'x = a + 2kπ seulement', 'x = a + 2kπ ou x = −a + 2kπ', 'x = a + kπ'], 0, 'Deux familles de solutions : la seconde est π − a pour le sinus (et −a pour le cosinus). L’oublier est l’erreur classique.'],
        ['Quelle est la limite de (cos(x) − 1)/x quand x tend vers 0 ?', ['1', '−1', '0', 'Elle n’existe pas'], 2, 'C’est le taux d’accroissement du cosinus en 0 : sa limite est cos′(0) = −sin(0) = 0.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Primitives et équations différentielles',
      questions: [
        ['Quelle est une primitive de sin x ?', ['cos x', 'sin x', '−sin x', '−cos x'], 3, 'La dérivée de −cos x est sin x. Le signe moins est l’oubli classique.'],
        ['Quelle est une primitive de x e^(x² + 1) ?', ['(1/2) e^(x² + 1)', 'e^(x² + 1)', '2x e^(x² + 1)', 'x² e^(x² + 1)'], 0, 'Avec u = x² + 1, u′ = 2x : il manque un facteur 2, d’où le coefficient 1/2 devant e^u.'],
        ['Quelles sont les solutions de y′ = 2y + 6 ?', ['x ↦ C e^(2x) + 3', 'x ↦ C e^(2x) − 3', 'x ↦ C e^(6x) + 2', 'x ↦ C e^(2x) − 6'], 1, 'La solution constante vérifie 0 = 2y + 6, soit y = −3 ; on y ajoute les solutions C e^(2x) de y′ = 2y.'],
        ['Quelle est une primitive de 1/√x sur ]0 ; +∞[ ?', ['√x', '1/(2√x)', '2√x', '−2/√x'], 2, 'La dérivée de √x est 1/(2√x) : celle de 2√x est donc 1/√x.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Calcul intégral',
      questions: [
        ['Que vaut l’intégrale de 0 à 1 de 2x dx ?', ['2', '1', '1/2', '0'], 1, 'Une primitive de 2x est x² : 1² − 0² = 1, l’aire du triangle de base 1 et de hauteur 2.'],
        ['Quelle est la valeur moyenne de f(x) = 2x sur [0 ; 2] ?', ['4', '1', '8', '2'], 3, 'L’intégrale de 0 à 2 de 2x vaut 2² = 4 ; on la divise par la longueur de l’intervalle, 2.'],
        ['Pour intégrer ln x par parties, que pose-t-on ?', ['v = ln x et u′ = 1', 'u = ln x et v′ = ln x', 'u′ = ln x et v = x', 'v = 1/x et u′ = x'], 0, 'ln x n’a pas de primitive simple mais se dérive en 1/x : on le choisit comme facteur à dériver, avec u′ = 1.'],
        ['Quelle propriété permet d’encadrer une intégrale ?', ['La relation de Chasles', 'L’inversion des bornes', 'La croissance : si f est inférieure à g, son intégrale l’est aussi', 'La linéarité'], 2, 'Pour a inférieur à b, encadrer f entre deux fonctions encadre son intégrale entre les leurs.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Succession d’épreuves indépendantes, lois de Bernoulli et binomiale',
      questions: [
        ['Quelle est la variance d’une variable de Bernoulli de paramètre p ?', ['p', 'p²', 'p(1 − p)', '1 − p'], 2, 'E(X) = p et V(X) = p(1 − p) : la loi binomiale multiplie ces valeurs par n.'],
        ['X suit la loi B(3 ; 0,5). Que vaut P(X = 2) ?', ['0,375', '0,25', '0,125', '0,5'], 0, 'C(3,2) × 0,5² × 0,5 = 3 × 0,125 = 0,375 : trois chemins réalisent exactement deux succès.'],
        ['Sur 100 lancers d’une pièce équilibrée, combien de piles attend-on en moyenne ?', ['25', '100', '10', '50'], 3, 'X suit B(100 ; 0,5), d’espérance n p = 100 × 0,5 = 50.'],
        ['Pour une loi binomiale, les épreuves doivent être identiques, indépendantes et…', ['Sans remise', 'À deux issues seulement', 'Au nombre de deux', 'De même durée'], 1, 'Chaque épreuve n’a que deux issues, succès ou échec : ce sont les trois conditions à vérifier.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Sommes de variables aléatoires',
      questions: [
        ['Que vaut E(aX + b) ?', ['a E(X) + b', 'a² E(X)', 'a E(X)', 'a² E(X) + b'], 0, 'L’espérance est linéaire : la constante b se retrouve dans l’espérance, alors qu’elle disparaît de la variance.'],
        ['X et Y sont indépendantes, avec V(X) = 4 et V(Y) = 9. Que vaut V(X + Y) ?', ['5', '25', '36', '13'], 3, 'Sous indépendance, les variances s’additionnent : 4 + 9 = 13. Ce sont les variances qui s’ajoutent, pas les écarts-types.'],
        ['Quel est l’écart-type de la somme S de n variables indépendantes de même écart-type σ ?', ['n σ', 'σ √n', 'σ/√n', 'σ'], 1, 'V(S) = n σ² par additivité sous indépendance, donc σ(S) = σ √n.'],
        ['Quelle formule donne la variance à partir d’espérances ?', ['V(X) = E(X)² − E(X²)', 'V(X) = E(X²)', 'V(X) = E(X²) − E(X)²', 'V(X) = √E(X)'], 2, 'La variance est l’espérance du carré moins le carré de l’espérance ; elle est toujours positive.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Loi des grands nombres et concentration',
      questions: [
        ['X a pour espérance 10 et pour variance 4. Quel majorant Bienaymé-Tchebychev donne-t-il pour P(|X − 10| ≥ 4) ?', ['1', '0,25', '0,4', '0,0625'], 1, 'Le majorant vaut V/δ² = 4/4² = 4/16 = 0,25.'],
        ['X est positive d’espérance 2. Que donne l’inégalité de Markov pour P(X ≥ 10) ?', ['Elle est au plus 0,2', 'Elle vaut 0,2', 'Elle est au moins 0,2', 'Elle est au plus 0,02'], 0, 'P(X ≥ a) est majorée par E(X)/a = 2/10 = 0,2 : c’est une borne, pas une valeur exacte.'],
        ['Quel majorant l’inégalité de concentration donne-t-elle pour P(|M − μ| ≥ δ) ?', ['σ/(n δ)', 'σ² / δ²', 'n σ² / δ²', 'σ² / (n δ²)'], 3, 'C’est Bienaymé-Tchebychev appliquée à M, dont la variance est σ²/n.'],
        ['Quelle est la faiblesse de l’inégalité de Bienaymé-Tchebychev ?', ['Elle ne vaut que pour la loi binomiale', 'Elle exige de connaître la loi exacte', 'Elle est grossière : son majorant dépasse souvent de loin la probabilité réelle', 'Elle n’utilise pas la variance'], 2, 'Valable pour toute loi, elle sert à garantir une précision, pas à estimer finement une probabilité.'],
      ],
    },
  ],
}
