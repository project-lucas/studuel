export default {
  slug: 'maths-expertes',
  titreMigration: 'QUESTIONS EN PLUS — MATHS EXPERTES Tle',
  motif: `Quatre questions de plus par quiz : huit suffisaient pour se tester une fois, pas pour réviser sur plusieurs semaines.`,
  chapitres: [
    {
      niveau: 'Tle',
      titre: 'Les nombres complexes d’un point de vue algébrique',
      questions: [
        ['Que vaut (1 + i)(2 − i) ?', ['3 + i', '1 + i', '3 − i', '2 + i'], 0, 'On développe : 2 − i + 2i − i² = 2 + i + 1 = 3 + i, en remplaçant i² par −1.'],
        ['Si z = −z̄, alors z est…', ['réel', 'imaginaire pur', 'de module 1', 'forcément nul'], 1, 'z = −z̄ impose une partie réelle nulle : z est imaginaire pur. C’est z = z̄ qui caractérise un réel.'],
        ['Que vaut z + z̄ ?', ['2i Im(z)', '|z|²', '0', '2 Re(z)'], 3, '(a + ib) + (a − ib) = 2a : la somme d’un complexe et de son conjugué est toujours réelle. C’est la différence qui vaut 2i Im(z).'],
        ['Quel est le module de 3 + 4i ?', ['7', '25', '5', '√7'], 2, 'Le module vaut √(a² + b²) = √(9 + 16) = √25 = 5 ; 25 est son carré, égal à z × z̄.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Le point de vue géométrique des nombres complexes',
      questions: [
        ['Quelle est l’affixe du milieu de [AB] ?', ['z(B) − z(A)', '(z(A) + z(B))/2', '(z(B) − z(A))/2', 'z(A) × z(B)'], 1, 'Comme pour les coordonnées, le milieu a pour affixe la demi-somme des affixes. z(B) − z(A) est l’affixe du vecteur AB.'],
        ['Quelle est l’image du point d’affixe −z ?', ['Le symétrique de M par rapport à l’axe des ordonnées', 'Le symétrique de M par rapport à l’axe des abscisses', 'L’image de M par la rotation d’angle π/2', 'Le symétrique de M par rapport à l’origine'], 3, 'Changer z en −z change le signe des deux coordonnées : c’est la symétrie centrale de centre O. L’axe des abscisses correspond au conjugué.'],
        ['Avec Z = (z(C) − z(A))/(z(B) − z(A)), que dit un Z imaginaire pur ?', ['A, B et C sont alignés', 'AB = AC', 'Les droites (AB) et (AC) sont perpendiculaires', 'Le triangle ABC est équilatéral'], 2, 'Un imaginaire pur a pour argument ±π/2 : l’angle entre les vecteurs AB et AC est droit. Un Z réel, lui, traduit l’alignement.'],
        ['Pour trouver l’argument θ de a + ib, pourquoi résoudre cos θ = a/r ET sin θ = b/r ?', ['Parce que le cosinus seul laisse deux angles possibles', 'Parce que le sinus est plus précis', 'Parce que r peut être négatif', 'Ce n’est pas nécessaire, une seule équation suffit'], 0, 'Deux angles opposés ont le même cosinus : c’est le signe du sinus qui les départage.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Nombres complexes et trigonométrie',
      questions: [
        ['Que vaut e^(iπ/2) ?', ['1', '−i', 'i', '−1'], 2, 'e^(iπ/2) = cos(π/2) + i sin(π/2) = 0 + i × 1 = i.'],
        ['Quelle est la forme exponentielle de l’inverse de r e^(iθ) ?', ['r e^(−iθ)', '(1/r) e^(−iθ)', '(1/r) e^(iθ)', '−r e^(iθ)'], 1, 'On inverse le module et on change l’argument de signe. r e^(−iθ) est le conjugué, pas l’inverse.'],
        ['Que forment les images des n racines n-ièmes de l’unité ?', ['Une droite passant par l’origine', 'Un cercle de rayon n', 'Une spirale', 'Un polygone régulier à n côtés inscrit dans le cercle unité'], 3, 'Les racines e^(2ikπ/n) sont de module 1 et régulièrement espacées de 2π/n : elles sont les sommets d’un polygone régulier.'],
        ['Pour factoriser e^(ia) + e^(ib), que met-on en facteur ?', ['L’exponentielle de l’angle moyen, e^(i(a+b)/2)', 'e^(ia) seulement', 'e^(i(a+b))', 'Le cosinus de a'], 0, 'On obtient e^(i(a+b)/2) × (e^(i(a−b)/2) + e^(−i(a−b)/2)), et la parenthèse vaut 2 cos((a − b)/2) par Euler.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Équations polynomiales et nombres complexes',
      questions: [
        ['Quelles sont les solutions de z² + 4 = 0 dans ℂ ?', ['2i et −2i', '2 et −2', 'Il n’y en a aucune', '4i et −4i'], 0, 'z² = −4 = (2i)² : les solutions sont 2i et −2i, conjuguées l’une de l’autre comme l’annonce Δ = −16 < 0.'],
        ['Combien de racines, comptées avec leur multiplicité, a un polynôme de degré n dans ℂ ?', ['Au plus deux', 'Exactement n', 'n − 1', 'Une seule'], 1, 'Par récurrence sur le théorème fondamental de l’algèbre, un polynôme de degré n se factorise en n facteurs du premier degré.'],
        ['On connaît une racine z₀ d’un polynôme de degré 3. Quelle est la méthode attendue pour trouver le quotient ?', ['Calculer un discriminant de degré 3', 'Passer en forme exponentielle', 'Factoriser par (z − z₀) et identifier les coefficients', 'Dériver le polynôme'], 2, 'On pose le quotient avec des coefficients inconnus, on développe et on identifie : il reste alors un trinôme à résoudre.'],
        ['Parmi ces nombres, lequel est une solution de z³ = 8 ?', ['−2', '8', '2i', '2'], 3, '2³ = 8. Les deux autres solutions, 2e^(2iπ/3) et 2e^(−2iπ/3), ne sont pas réelles : il y en a trois en tout.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Utilisation des nombres complexes en géométrie',
      questions: [
        ['Quelle écriture décrit l’homothétie de centre Ω (affixe ω) et de rapport k réel ?', ['z′ = k z + ω', 'z′ − ω = k (z − ω)', 'z′ = z + k', 'z′ − ω = e^(ik) (z − ω)'], 1, 'Une homothétie multiplie par un réel à partir de son centre ; multiplier par e^(iθ), de module 1, donnerait une rotation.'],
        ['Que produit la multiplication par −1 ?', ['Une rotation d’angle π/2 autour de l’origine', 'La symétrie par rapport à l’axe des abscisses', 'Une rotation d’angle π autour de l’origine', 'Une homothétie de rapport 1'], 2, '−1 = e^(iπ) : multiplier par −1, c’est tourner d’un demi-tour autour de O, ce qui est la symétrie centrale.'],
        ['Si Z = (z(C) − z(A))/(z(B) − z(A)) vaut e^(iπ/3), le triangle ABC est…', ['rectangle en A', 'aplati, les points étant alignés', 'rectangle isocèle en A', 'équilatéral'], 3, 'Module 1 donne AB = AC, argument π/3 donne un angle de 60° en A : le triangle est équilatéral (direct).'],
        ['Quel ensemble de points décrit l’équation Re(z) = 3 ?', ['Une droite parallèle à l’axe des ordonnées', 'Une droite parallèle à l’axe des abscisses', 'Le cercle de centre O et de rayon 3', 'Une demi-droite d’origine O'], 0, 'Re(z) = 3 fixe l’abscisse x = 3 : c’est une droite verticale, parallèle à l’axe des ordonnées.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Divisibilité et congruences dans Z',
      questions: [
        ['Si b divise a et a divise c, que peut-on affirmer ?', ['b divise c', 'c divise b', 'a = c', 'b = a'], 0, 'C’est la transitivité : a = bk et c = ak′ donnent c = b(kk′).'],
        ['Si a ≡ 2 [5], à quoi a² est-il congru modulo 5 ?', ['2', '4', '1', '0'], 1, 'Les congruences sont compatibles avec les puissances : a² ≡ 2² = 4 [5].'],
        ['Quelle est la période des puissances de 3 modulo 7 ?', ['3', '7', '6', '2'], 2, 'Les restes successifs sont 3, 2, 6, 4, 5, 1, puis le cycle recommence : la période est 6.'],
        ['Sur quelle congruence repose le critère de divisibilité par 11 en somme alternée des chiffres ?', ['10 ≡ 1 [11]', '11 ≡ 0 [10]', '100 ≡ 0 [11]', '10 ≡ −1 [11]'], 3, 'Comme 10 ≡ −1 [11], les puissances de 10 valent alternativement 1 et −1 modulo 11 : les chiffres comptent avec des signes alternés.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'PGCD, théorèmes de Bézout et de Gauss',
      questions: [
        ['Quel est le PPCM de 12 et 18, sachant que leur PGCD vaut 6 ?', ['36', '216', '72', '6'], 0, 'PGCD × PPCM = 12 × 18 = 216, donc PPCM = 216 / 6 = 36.'],
        ['6 divise 4 × 3 sans diviser ni 4 ni 3. Quelle hypothèse du théorème de Gauss manque ?', ['6 devrait être premier', '6 devrait être premier avec 4 (ou avec 3)', 'Le produit devrait être impair', '4 et 3 devraient être premiers entre eux'], 1, 'Gauss exige que a soit premier avec b ; or PGCD(6 ; 4) = 2 et PGCD(6 ; 3) = 3. Sans cette hypothèse, la conclusion tombe.'],
        ['Dans l’algorithme d’Euclide, le PGCD est…', ['le premier reste obtenu', 'le dernier quotient', 'le dernier reste non nul', 'le plus petit des deux nombres'], 2, 'On remplace (a ; b) par (b ; r) jusqu’à un reste nul : le dernier reste non nul est le PGCD (21 pour 1071 et 462).'],
        ['Que suffit-il de faire pour prouver que a et b sont premiers entre eux ?', ['Montrer qu’ils sont tous deux impairs', 'Montrer que l’un est premier', 'Calculer leur PPCM', 'Exhiber un couple d’entiers (u ; v) tel que a u + b v = 1'], 3, 'C’est le sens utile du théorème de Bézout : un seul couple suffit, et le PGCD vaut alors 1.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Nombres premiers et petit théorème de Fermat',
      questions: [
        ['Combien 72 = 2³ × 3² a-t-il de diviseurs positifs ?', ['12', '6', '5', '72'], 0, 'On multiplie les exposants augmentés de 1 : (3 + 1)(2 + 1) = 12.'],
        ['Si a^(n−1) ≡ 1 [n], que permet de conclure le petit théorème de Fermat ?', ['Que n est premier', 'Rien de sûr : certains nombres composés passent ce test', 'Que n est composé', 'Que n est pair'], 1, 'Le théorème ne s’utilise qu’en contraposée : il prouve qu’un nombre n’est pas premier, jamais qu’il l’est.'],
        ['Comment lit-on le PGCD sur les décompositions en facteurs premiers ?', ['Tous les facteurs, aux plus grands exposants', 'La somme des exposants', 'Les facteurs communs, aux plus petits exposants', 'Les facteurs communs, aux plus grands exposants'], 2, 'Le PGCD garde les facteurs communs aux plus petits exposants ; le PPCM prend tous les facteurs aux plus grands exposants.'],
        ['Quel est le reste de 2^100 dans la division par 7 ?', ['1', '4', '0', '2'], 3, 'Fermat donne 2⁶ ≡ 1 [7] ; 100 = 6 × 16 + 4, donc 2^100 ≡ 2⁴ = 16 ≡ 2 [7].'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Calcul matriciel',
      questions: [
        ['A est de taille 2 × 3 et B de taille 3 × 4. Quelle est la taille de A × B ?', ['2 × 4', '3 × 3', '4 × 2', 'Le produit n’est pas défini'], 0, 'Un produit n × p par p × q donne n × q : les 3 colonnes de A correspondent aux 3 lignes de B.'],
        ['Quel est le déterminant de la matrice de lignes (2 ; 1) et (4 ; 3) ?', ['10', '2', '−2', '6'], 1, 'ad − bc = 2 × 3 − 1 × 4 = 2 : non nul, la matrice est inversible.'],
        ['Si A n’est pas inversible, combien le système A X = B a-t-il de solutions ?', ['Une solution unique', 'Toujours aucune', 'Aucune ou une infinité', 'Exactement deux'], 2, 'La solution unique X = A⁻¹B n’existe que si A est inversible ; sinon le système est soit impossible, soit indéterminé.'],
        ['Comment calcule-t-on Dⁿ pour une matrice D diagonale ?', ['En multipliant chaque coefficient par n', 'En élevant tous les coefficients, même nuls, à la puissance n puis en additionnant', 'Dⁿ = D pour toute diagonale', 'En élevant chaque coefficient diagonal à la puissance n'], 3, 'Le produit de deux matrices diagonales se fait terme à terme sur la diagonale : c’est ce qui rend la diagonalisation si utile.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Graphes et matrices',
      questions: [
        ['Quel est le majorant du nombre chromatique donné par le cours ?', ['Le nombre de sommets au carré', 'Le degré maximal, plus 1', 'Le nombre d’arêtes', 'Le degré minimal'], 1, 'Chaque sommet a au plus « degré maximal » voisins : avec une couleur de plus, on en trouve toujours une libre.'],
        ['Quel minorant du nombre chromatique le cours donne-t-il ?', ['Le degré minimal', 'Le nombre de sommets', 'Le nombre de cycles', 'La taille du plus grand sous-graphe complet'], 3, 'Dans un sous-graphe complet, tous les sommets sont voisins deux à deux : il faut autant de couleurs que de sommets.'],
        ['Un graphe connexe dont tous les sommets sont de degré pair possède un cycle eulérien.', ['Vrai', 'Faux'], 0, 'Avec 0 sommet de degré impair, le théorème d’Euler garantit même un cycle eulérien ; avec 2, seulement une chaîne.'],
        ['Pourquoi le problème du voyageur de commerce est-il difficile ?', ['Parce que les graphes y sont orientés', 'Parce que sa matrice n’est pas symétrique', 'Parce qu’il n’existe aucun critère simple pour les chaînes hamiltoniennes', 'Parce que son nombre chromatique est trop grand'], 2, 'Passer une fois par chaque sommet n’a pas d’équivalent au critère d’Euler sur les degrés : il faut chercher.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Suites de matrices colonnes',
      questions: [
        ['Dans le cas affine U(n+1) = A U(n) + B, quelle est la forme explicite de U(n) ?', ['Aⁿ U(0) + C', 'Aⁿ (U(0) − C) + C', 'Aⁿ U(0) + B', 'Aⁿ U(0) − C'], 1, 'V(n) = U(n) − C vérifie V(n) = Aⁿ V(0) ; on rajoute C pour revenir à U(n).'],
        ['Si Aⁿ converge vers une matrice L, vers quoi converge U(n) = Aⁿ U(0) ?', ['L', 'U(0)', 'L U(0)', 'La matrice nulle'], 2, 'On passe à la limite dans Aⁿ U(0) : la limite est L U(0), une matrice colonne.'],
        ['On pose V(n) = U(n) − C, C étant l’état stable. Quelle relation vérifie V ?', ['V(n+1) = A V(n) + B', 'V(n+1) = V(n) + C', 'V(n+1) = B V(n)', 'V(n+1) = A V(n)'], 3, 'En soustrayant C = AC + B à U(n+1) = A U(n) + B, le terme constant disparaît : la suite V est « géométrique ».'],
        ['u(n+1) = 2u(n) + v(n) et v(n+1) = u(n) + 3v(n). Quelle est la matrice A ?', ['Lignes (2 ; 1) et (1 ; 3)', 'Lignes (2 ; 1) et (3 ; 1)', 'Lignes (1 ; 2) et (3 ; 1)', 'Lignes (2 ; 3) et (1 ; 1)'], 0, 'Chaque ligne de A porte les coefficients d’une équation, dans l’ordre des composantes u puis v.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Chaînes de Markov',
      questions: [
        ['Dans quelle situation l’hypothèse « sans mémoire » est-elle la plus discutable ?', ['La fidélité d’un client, où l’ancienneté compte', 'Le déplacement aléatoire d’un pion sur un graphe', 'Une météo modélisée à deux états', 'Le tirage d’une boule avec remise'], 0, 'Si l’ancienneté d’un client pèse sur son choix, l’avenir dépend de l’historique : la propriété de Markov doit alors être discutée.'],
        ['Avec les distributions écrites en ligne, comment passe-t-on de P(n) à P(n+1) ?', ['P(n+1) = T × P(n)', 'P(n+1) = P(n) × T', 'P(n+1) = P(n) + T', 'P(n+1) = Tⁿ'], 1, 'En ligne, on multiplie à droite par T ; d’où P(n) = P(0) × Tⁿ. En colonne, ce serait à gauche : la convention doit être tenue.'],
        ['T a pour lignes (0,8 ; 0,2) et (0,4 ; 0,6). Quel est son état stable ?', ['(1/2 ; 1/2)', '(0,8 ; 0,2)', '(2/3 ; 1/3)', '(1/3 ; 2/3)'], 2, 'π = (a ; b) avec a = 0,8a + 0,4b donne a = 2b ; avec a + b = 1, on trouve a = 2/3 et b = 1/3.'],
        ['Sans la condition « somme des composantes égale à 1 », combien de solutions le système π × T = π admet-il ?', ['Aucune solution', 'Une seule solution', 'Exactement deux solutions', 'Une infinité de solutions proportionnelles'], 3, 'Si π est solution, tout multiple de π l’est aussi : c’est la condition de somme 1 qui fixe l’unique distribution stable.'],
      ],
    },
  ],
}
