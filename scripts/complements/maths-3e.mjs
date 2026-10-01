export default {
  slug: 'maths',
  titreMigration: 'QUESTIONS EN PLUS — MATHS 3e',
  motif: `Quatre questions de plus par quiz : huit suffisaient pour se tester une fois, pas pour réviser sur plusieurs semaines.`,
  chapitres: [
    {
      niveau: '3e',
      titre: 'Puissances d’un nombre et écriture scientifique',
      questions: [
        ['Combien vaut 2⁻³ ?', ['8', '−8', '1/8', '−6'], 2, 'Un exposant négatif signifie « on divise » : 2⁻³ = 1 / 2³ = 1/8.'],
        ['Que vaut 10⁷ ÷ 10³ ?', ['10¹⁰', '10⁴', '10²¹', '1⁴'], 1, 'Pour diviser deux puissances de même base, on soustrait les exposants : 7 − 3 = 4.'],
        ['Comment simplifier 2³ × 5³ ?', ['10⁶', '7³', '10³', '7⁶'], 2, 'Les bases diffèrent : on regroupe (2 × 5)³ = 10³ = 1 000, les exposants ne s’additionnent pas.'],
        ['Quel nombre est le plus grand : 3,2 × 10⁵ ou 9,8 × 10⁴ ?', ['9,8 × 10⁴, car 9,8 est plus grand que 3,2', '3,2 × 10⁵, car son exposant est plus grand', 'Ils sont égaux', 'On ne peut pas les comparer'], 1, 'En écriture scientifique, c’est d’abord l’exposant qui compte : 3,2 × 10⁵ = 320 000 et 9,8 × 10⁴ = 98 000.'],
      ],
    },
    {
      niveau: '3e',
      titre: 'Nombres premiers et fractions irréductibles',
      questions: [
        ['Pourquoi 1 n’est-il pas un nombre premier ?', ['Parce qu’il est impair', 'Parce qu’il n’a qu’un seul diviseur', 'Parce qu’il divise tous les nombres', 'Parce qu’il est trop petit pour être décomposé'], 1, 'Un nombre premier a exactement deux diviseurs, 1 et lui-même ; 1 n’en a qu’un seul.'],
        ['Lequel de ces nombres est premier ?', ['21', '27', '29', '33'], 2, '29 n’est divisible que par 1 et 29 ; 21 = 3 × 7, 27 = 3 × 9 et 33 = 3 × 11.'],
        ['Lequel de ces nombres est divisible par 9 ?', ['2 345', '3 456', '1 234', '4 321'], 1, 'La somme des chiffres de 3 456 vaut 3 + 4 + 5 + 6 = 18, qui est divisible par 9.'],
        ['Quelle est la décomposition en facteurs premiers de 84 ?', ['2 × 42', '2² × 21', '4 × 3 × 7', '2² × 3 × 7'], 3, '84 = 2 × 42 = 2 × 2 × 21 = 2² × 3 × 7 : tous les facteurs doivent être premiers, ce que 42, 21 et 4 ne sont pas.'],
      ],
    },
    {
      niveau: '3e',
      titre: 'Calcul littéral et équation',
      questions: [
        ['Que donne le développement de (x − 4)² ?', ['x² − 16', 'x² − 8x + 16', 'x² + 16', 'x² − 4x + 16'], 1, 'On applique (a − b)² = a² − 2ab + b² : x² − 2 × x × 4 + 4² = x² − 8x + 16.'],
        ['Que donne le développement de (x + 2)(x + 5) ?', ['x² + 10', '2x + 7', 'x² + 7x + 10', 'x² + 10x + 7'], 2, 'Double distributivité : x × x + x × 5 + 2 × x + 2 × 5 = x² + 7x + 10.'],
        ['Que devient 3x + 3x² une fois réduite ?', ['6x³', '6x²', 'Elle reste 3x + 3x² : les termes ne sont pas de même nature', '9x'], 2, 'On ne regroupe que des termes de même nature : des x avec des x, des x² avec des x².'],
        ['Développer une expression, c’est transformer…', ['une somme en produit', 'une équation en inégalité', 'une fraction en nombre décimal', 'un produit en somme'], 3, 'Développer transforme un produit en somme ; factoriser fait l’inverse.'],
      ],
    },
    {
      niveau: '3e',
      titre: 'Caractéristiques d’une série statistique',
      questions: [
        ['Quelle est la moyenne de la série 8, 12, 12, 16, 17 ?', ['12', '13', '14', '65'], 1, 'La somme vaut 65 et il y a 5 valeurs : 65 ÷ 5 = 13.'],
        ['Quelle est la médiane de la série 3, 5, 9, 10 ?', ['9', '6,75', '7', '5'], 2, 'L’effectif est pair : on fait la moyenne des deux valeurs centrales, (5 + 9) ÷ 2 = 7. 6,75 est la moyenne de la série.'],
        ['Que vaut la somme des fréquences de toutes les valeurs d’une série ?', ['1, soit 100 %', 'L’effectif total', 'La moyenne de la série', 'Cela dépend de la série'], 0, 'Chaque fréquence est une part de l’effectif total : toutes ensemble, elles font 1, soit 100 %.'],
        ['Dans une classe, 6 élèves ont 10 et 4 élèves ont 15. Quelle est la moyenne ?', ['12,5', '25', '11', '12'], 3, 'Moyenne pondérée : (6 × 10 + 4 × 15) ÷ 10 = 120 ÷ 10 = 12. 12,5 serait la moyenne des deux notes sans tenir compte des effectifs.'],
      ],
    },
    {
      niveau: '3e',
      titre: 'Les probabilités',
      questions: [
        ['Que vaut la probabilité d’un événement certain ?', ['0', '0,5', '1', '100'], 2, 'Une probabilité est comprise entre 0 (impossible) et 1 (certain).'],
        ['Dans un arbre de probabilités, que fait-on le long d’une branche ?', ['On additionne les probabilités', 'On multiplie les probabilités', 'On soustrait les probabilités', 'On divise les probabilités'], 1, 'On multiplie le long d’une branche, puis on additionne les branches qui réalisent l’événement.'],
        ['On lance deux pièces équilibrées. Quelle est la probabilité d’obtenir deux fois pile ?', ['1/2', '1/3', '3/4', '1/4'], 3, 'Il y a quatre issues équiprobables (PP, PF, FP, FF) et une seule favorable : 1/2 × 1/2 = 1/4.'],
        ['Quel est le chemin le plus court pour calculer la probabilité d’obtenir « au moins un 6 » en plusieurs lancers ?', ['Passer par l’événement contraire « aucun 6 »', 'Additionner la probabilité de chaque lancer', 'Multiplier 1/6 par le nombre de lancers', 'Tracer un diagramme en bâtons'], 0, '« Au moins un » a pour contraire « aucun » : P(au moins un 6) = 1 − P(aucun 6).'],
      ],
    },
    {
      niveau: '3e',
      titre: 'Comprendre et utiliser la notion de fonction',
      questions: [
        ['Pour f(x) = 2x + 5, quel est l’antécédent de 17 ?', ['39', '6', '11', '8,5'], 1, 'On résout 2x + 5 = 17 : 2x = 12, donc x = 6. 39 serait l’image de 17.'],
        ['Dans un tableau de valeurs, que lit-on sur la ligne du bas ?', ['Les antécédents', 'Les coefficients', 'Les images', 'Les abscisses des points'], 2, 'La ligne du haut porte les antécédents x, celle du bas leurs images f(x).'],
        ['Si f(3) = 7, que peut-on affirmer ?', ['7 est l’antécédent de 3', '3 est un antécédent de 7', '3 est l’image de 7', '7 est un antécédent de 3'], 1, '7 est l’image de 3, et 3 est UN antécédent de 7 : il peut y en avoir d’autres.'],
        ['Sur un graphique, comment lit-on un antécédent de 7 ?', ['On part de 7 en abscisse, on monte jusqu’à la courbe, on lit en ordonnée', 'On lit la pente de la courbe au point 7', 'On cherche le point de coordonnées (7 ; 7)', 'On part de 7 en ordonnée, on va horizontalement jusqu’à la courbe, on lit en abscisse'], 3, 'Pour un antécédent, on part de l’axe des ordonnées ; la ligne horizontale peut couper la courbe en plusieurs points.'],
      ],
    },
    {
      niveau: '3e',
      titre: 'Fonction linéaire et proportionnalité',
      questions: [
        ['Par quel nombre multiplie-t-on pour diminuer une valeur de 15 % ?', ['0,15', '1,15', '0,85', '−15'], 2, 'Diminuer de 15 %, c’est garder 85 % de la valeur : on multiplie par 1 − 0,15 = 0,85.'],
        ['f est linéaire et f(4) = 10. Que vaut son coefficient a ?', ['40', '2,5', '0,4', '6'], 1, 'a = f(x) ÷ x = 10 ÷ 4 = 2,5 : une seule valeur non nulle suffit à connaître toute la fonction.'],
        ['Pour f(x) = 3x, que devient f(x) quand x double ?', ['Il double', 'Il augmente de 2', 'Il est multiplié par 3', 'Il est multiplié par 9'], 0, 'C’est la proportionnalité : f(2x) = 3 × 2x = 2 × f(x).'],
        ['Dans un tableau de valeurs, à quoi reconnaît-on une fonction linéaire ?', ['La différence f(x) − x est constante', 'Les images augmentent toujours', 'L’image de 0 vaut 1', 'Le quotient f(x) ÷ x est constant'], 3, 'Ce quotient constant est le coefficient a ; une fonction linéaire peut aussi être décroissante si a est négatif.'],
      ],
    },
    {
      niveau: '3e',
      titre: 'Les fonctions affines',
      questions: [
        ['Quelle est l’ordonnée à l’origine de f(x) = −2x + 7 ?', ['7', '−2', '2', '−7'], 0, 'L’ordonnée à l’origine est b = f(0) = 7 ; −2 est le coefficient directeur.'],
        ['Laquelle de ces droites est la plus raide ?', ['y = 0,5x + 4', 'y = 2x', 'y = x − 5', 'y = −3x + 1'], 3, 'La raideur dépend de la valeur absolue de a : 3 est la plus grande, même si cette droite descend.'],
        ['Un forfait de 15 € plus 2 € par heure : quelle fonction donne le prix pour x heures ?', ['f(x) = 15x + 2', 'f(x) = 17x', 'f(x) = 2x + 15', 'f(x) = 2x'], 2, 'Le prix à l’heure est le coefficient a = 2, le forfait est l’ordonnée à l’origine b = 15.'],
        ['Pour quelle valeur de x les offres f(x) = 2x + 15 et g(x) = 5x coûtent-elles le même prix ?', ['3', '5', '15', '7,5'], 1, 'On résout 2x + 15 = 5x : 15 = 3x, donc x = 5. C’est l’abscisse du point d’intersection des deux droites.'],
      ],
    },
    {
      niveau: '3e',
      titre: 'Sphère et boule',
      questions: [
        ['Une sphère a un diamètre de 10 cm. Quelle est son aire ?', ['400π cm²', '40π cm²', '25π cm²', '100π cm²'], 3, 'Le rayon vaut 10 ÷ 2 = 5 cm, donc A = 4 × π × 5² = 100π cm². 400π vient d’un diamètre pris pour un rayon.'],
        ['Quel est le volume d’une boule de rayon 3 cm ?', ['12π cm³', '108π cm³', '36π cm³, soit environ 113,1 cm³', '9π cm³'], 2, 'V = (4/3) × π × 3³ = (4/3) × 27π = 36π cm³.'],
        ['À combien équivaut 1 litre ?', ['1 cm³', '1 dm³', '1 m³', '10 cm³'], 1, '1 L = 1 dm³, et 1 mL = 1 cm³ : utile pour convertir le volume d’une boule en contenance.'],
        ['Qu’appelle-t-on un grand cercle d’une sphère ?', ['La section par un plan passant par son centre', 'Toute section de la sphère par un plan', 'Le cercle de l’équateur uniquement', 'Un cercle de rayon supérieur à celui de la sphère'], 0, 'Un plan passant par le centre coupe la sphère selon un cercle de même rayon qu’elle : c’est la plus grande section possible.'],
      ],
    },
    {
      niveau: '3e',
      titre: 'Sections planes de solides',
      questions: [
        ['Quelle section obtient-on en coupant une pyramide à base carrée par un plan parallèle à sa base ?', ['Un triangle', 'Un carré plus petit', 'Un rectangle non carré', 'Un disque'], 1, 'La section parallèle à la base d’une pyramide a la même forme que la base : c’en est une réduction.'],
        ['Quelle section obtient-on en coupant un pavé droit par un plan parallèle à une arête ?', ['Un triangle', 'Un disque', 'Un rectangle', 'Un cercle'], 2, 'Un plan parallèle à une arête d’un pavé droit le coupe selon un rectangle.'],
        ['Un cône est coupé parallèlement à sa base, à mi-hauteur depuis le sommet. Quelle fraction du volume du grand cône représente le petit cône ?', ['1/2', '1/4', '1/8', '1/6'], 2, 'Le rapport de réduction vaut k = 1/2 ; les volumes sont multipliés par k³ = 1/8.'],
        ['Quel est le volume d’un cylindre de rayon 2 cm et de hauteur 5 cm ?', ['10π cm³', '(20/3)π cm³', '40π cm³', '20π cm³'], 3, 'V = π × R² × h = π × 4 × 5 = 20π cm³ ; le tiers ne concerne que le cône et la pyramide.'],
      ],
    },
    {
      niveau: '3e',
      titre: 'L’homothétie',
      questions: [
        ['Avec quelle valeur de k une homothétie laisse-t-elle la figure immobile ?', ['0', '1', '−1', '2'], 1, 'Avec k = 1, chaque point est sa propre image ; k = −1 donne une symétrie centrale.'],
        ['Par l’homothétie de centre O et de rapport 2, OM = 3 cm. Combien vaut OM′ ?', ['1,5 cm', '5 cm', '6 cm', '9 cm'], 2, 'OM′ = 2 × OM = 6 cm, et M′ est sur la droite (OM), du même côté que M puisque k est positif.'],
        ['Par combien une homothétie de rapport −2 multiplie-t-elle les longueurs ?', ['−2', '4', '1/2', '2'], 3, 'Les longueurs sont multipliées par la valeur absolue de k, soit 2 ; le signe moins indique seulement que l’image est de l’autre côté du centre.'],
        ['Quel théorème décrit la même configuration qu’une homothétie ?', ['Le théorème de Thalès', 'Le théorème de Pythagore', 'La trigonométrie', 'La règle du produit nul'], 0, 'Une homothétie transforme une droite en une droite parallèle : c’est la configuration de Thalès.'],
      ],
    },
    {
      niveau: '3e',
      titre: 'Utiliser le théorème de Thalès',
      questions: [
        ['(MN) et (BC) sont parallèles, avec AM = 3, AB = 6 et AC = 10. Combien vaut AN ?', ['20', '2', '5', '7'], 2, 'AM / AB = AN / AC donne 3 / 6 = AN / 10, donc AN = 10 × 3 ÷ 6 = 5.'],
        ['Pour utiliser la réciproque de Thalès, que faut-il vérifier en plus de l’égalité des quotients ?', ['Que le triangle est rectangle', 'Que les points sont alignés dans le même ordre', 'Que les segments ont la même longueur', 'Que l’angle en A mesure 90°'], 1, 'Sans le même ordre des points sur les deux droites, l’égalité des quotients ne suffit pas à conclure au parallélisme.'],
        ['Quel réflexe évite de mélanger les segments dans les quotients de Thalès ?', ['Écrire toujours petit sur grand, en partant du sommet commun', 'Mettre le côté parallèle au numérateur', 'Additionner les longueurs connues', 'Commencer par le plus grand segment'], 0, 'Chaque quotient commence par le sommet commun A et compare le petit segment au grand : AM / AB, AN / AC, MN / BC.'],
        ['(MN) et (BC) sont parallèles, avec AM = 4, AB = 10 et BC = 15. Combien vaut MN ?', ['37,5', '9', '11', '6'], 3, 'AM / AB = MN / BC donne 4 / 10 = MN / 15, donc MN = 15 × 4 ÷ 10 = 6.'],
      ],
    },
    {
      niveau: '3e',
      titre: 'Trigonométrie dans un triangle rectangle',
      questions: [
        ['Que vaut sin 30° ?', ['1', '0,5', '0', 'Environ 0,87'], 1, 'sin 30° = 0,5, comme cos 60° : l’opposé à un angle de 30° mesure la moitié de l’hypoténuse.'],
        ['Que vaut cos 60° ?', ['0', '1', '0,5', '60'], 2, 'cos 60° = 0,5 : c’est une des valeurs à connaître par cœur.'],
        ['L’hypoténuse mesure 10 cm et un angle aigu mesure 30°. Combien mesure le côté opposé à cet angle ?', ['Environ 8,66 cm', '20 cm', '10 cm', '5 cm'], 3, 'sin 30° = opposé ÷ hypoténuse, donc opposé = 10 × 0,5 = 5 cm.'],
        ['Quel moyen mnémotechnique résume les trois formules de trigonométrie ?', ['CAH – SOH – TOA', 'SOS – TAC – CHA', 'COT – SAH – TOH', 'HYP – ADJ – OPP'], 0, 'CAH : cos = adjacent / hypoténuse ; SOH : sin = opposé / hypoténuse ; TOA : tan = opposé / adjacent.'],
      ],
    },
    {
      niveau: '3e',
      titre: 'Triangles semblables',
      questions: [
        ['Deux triangles semblables ont un rapport k = 3. Un côté du petit mesure 4 cm : combien mesure son côté homologue dans le grand ?', ['7 cm', '12 cm', '36 cm', '4/3 cm'], 1, 'Les longueurs sont multipliées par k : 4 × 3 = 12 cm. 36 serait le coefficient des aires appliqué à tort.'],
        ['Un triangle a des angles de 50° et 70°, un autre des angles de 70° et 60°. Sont-ils semblables ?', ['Non, les deux angles donnés ne sont pas les mêmes', 'On ne peut pas savoir sans les côtés', 'Oui : tous deux ont pour angles 50°, 60° et 70°', 'Seulement s’ils ont la même aire'], 2, 'Le troisième angle se déduit de la somme de 180° : 60° pour le premier, 50° pour le second. Deux angles égaux suffisent.'],
        ['Deux solides semblables ont un rapport k = 2. Par combien le volume est-il multiplié ?', ['2', '4', '6', '8'], 3, 'Les volumes sont multipliés par k³ = 2³ = 8, les aires par k² = 4.'],
        ['Comment les triangles semblables permettent-ils de mesurer la hauteur d’un arbre ?', ['En comparant son ombre à celle d’un bâton de hauteur connue', 'En mesurant la circonférence de son tronc', 'En comptant ses branches', 'En calculant l’aire de son ombre'], 0, 'L’arbre, le bâton et leurs ombres forment deux triangles semblables : le rapport des ombres donne le rapport des hauteurs.'],
      ],
    },
  ],
}
