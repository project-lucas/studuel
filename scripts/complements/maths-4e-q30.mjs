export default {
  slug: 'maths',
  titreMigration: 'QUESTIONS EN PLUS — MATHS 4e (lot 30)',
  motif: `Quatre questions de plus par quiz : huit suffisaient pour se tester une fois, pas pour réviser sur plusieurs semaines.`,
  chapitres: [
    {
      niveau: "4e", titre: "Utiliser une translation",
      questions: [
        ['Le point M′ est l’image de M par la translation qui transforme A en B. Dans le parallélogramme ABM′M, quel segment est parallèle à [AB] et de même longueur ?', ['[AM′]', '[MM′]', '[BM]', '[AM]'], 1, 'Dans le parallélogramme ABM′M, les côtés opposés sont [AB] et [MM′] : ils sont parallèles et ont la même longueur. Les segments [AM′] et [BM] sont ses diagonales.'],
        ['Un angle de 50° est transformé par une translation. Quelle est la mesure de son image ?', ['100°', '25°', '50°', '130°'], 2, 'Une translation conserve les angles : l’image d’un angle de 50° mesure 50°.'],
        ['Quelle est l’image d’une droite (d) par une translation ?', ['Une droite perpendiculaire à (d)', 'Un segment de même longueur que (d)', 'Une droite sécante à (d)', 'Une droite parallèle à (d)'], 3, 'Une translation conserve le parallélisme et l’alignement : l’image de (d) est une droite parallèle à (d) (ou confondue avec elle si la flèche est dirigée le long de (d)).'],
        ['Le milieu d’un segment a pour image, par une translation, le milieu du segment image.', ['Vrai', 'Faux'], 0, 'La translation conserve les milieux, comme les longueurs, les angles et l’alignement.'],
      ],
    },
    {
      niveau: "4e", titre: "Grandeurs produits et grandeurs quotients",
      questions: [
        ['Quelle unité correspond à un débit ?', ['min/L', 'L × min', 'L/min', 'm³'], 2, 'Un débit est un volume divisé par une durée : on l’exprime en litres par minute (L/min), par exemple.'],
        ['Une « personne-heure » de travail est une grandeur…', ['produit : nombre de personnes × durée', 'quotient : nombre de personnes ÷ durée', 'quotient : durée ÷ nombre de personnes', 'simple, sans aucun calcul'], 0, 'On multiplie le nombre de personnes par la durée du travail : 3 personnes pendant 4 h font 12 personnes-heures.'],
        ['Un bloc de 500 g a un volume de 250 cm³. Quelle est sa masse volumique ?', ['0,5 g/cm³', '750 g/cm³', '125 000 g/cm³', '2 g/cm³'], 3, 'Masse volumique = masse ÷ volume = 500 ÷ 250 = 2 g/cm³.'],
        ['Une puissance de 3 kW utilisée pendant 4 h consomme 7 kWh.', ['Vrai', 'Faux'], 1, 'L’énergie est un produit : 3 kW × 4 h = 12 kWh, et non 3 + 4 = 7.'],
      ],
    },
    {
      niveau: "4e", titre: "Étudier des grandeurs quotients",
      questions: [
        ['Un cycliste roule à 18 km/h. Quelle est sa vitesse en m/s ?', ['64,8 m/s', '0,3 m/s', '5 m/s', '18 m/s'], 2, 'Pour passer de km/h à m/s, on divise par 3,6 : 18 ÷ 3,6 = 5 m/s.'],
        ['Un train parcourt 240 km en 1 h 30 min. Quelle est sa vitesse moyenne ?', ['160 km/h', '184,6 km/h', '8 km/h', '360 km/h'], 0, '1 h 30 min = 1,5 h, donc v = 240 ÷ 1,5 = 160 km/h. Écrire 1,30 h donnerait un résultat faux (184,6).'],
        ['Quelle distance parcourt un piéton qui marche à 4 km/h pendant 45 min ?', ['180 km', '3 km', '5,33 km', '1,8 km'], 1, '45 min = 0,75 h et d = v × t = 4 × 0,75 = 3 km.'],
        ['Une voiture consomme 5 L/100 km. Quelle distance peut-elle parcourir avec 35 L ?', ['175 km', '70 km', '1 750 km', '700 km'], 3, '35 ÷ 5 = 7 fois 100 km, soit 700 km.'],
      ],
    },
    {
      niveau: "4e", titre: "Multiplier et diviser des nombres relatifs",
      questions: [
        ['Combien vaut (−4) × (−5) × (+2) × (−1) ?', ['+40', '−40', '−20', '+20'], 1, 'Il y a trois facteurs négatifs (nombre impair) : le produit est négatif. On calcule 4 × 5 × 2 × 1 = 40, donc −40.'],
        ['Combien vaut (−45) ÷ (+9) ?', ['+5', '−36', '−5', '−405'], 2, 'Signes contraires : le quotient est négatif. 45 ÷ 9 = 5, donc −5.'],
        ['Combien vaut (−2)³ ?', ['−6', '+8', '+6', '−8'], 3, '(−2)³ = (−2) × (−2) × (−2) : trois facteurs négatifs donnent un résultat négatif, soit −8.'],
        ['Le carré d’un nombre relatif est toujours positif ou nul.', ['Vrai', 'Faux'], 0, 'Un nombre multiplié par lui-même donne toujours deux signes identiques, donc un résultat positif (ou nul pour zéro).'],
      ],
    },
    {
      niveau: "4e", titre: "Comparaison et encadrement",
      questions: [
        ['Quel est le rangement dans l’ordre croissant des nombres −2 ; 1,5 ; −2,5 ; 0 ?', ['−2 < −2,5 < 0 < 1,5', '−2,5 < −2 < 0 < 1,5', '0 < 1,5 < −2 < −2,5', '−2,5 < 0 < −2 < 1,5'], 1, 'Entre deux négatifs, le plus petit est celui qui est le plus loin de zéro : −2,5 < −2. Puis viennent 0 et 1,5.'],
        ['Quelle fraction est la plus grande : 5/6 ou 7/9 ?', ['7/9', 'Elles sont égales', '5/6', 'On ne peut pas savoir'], 2, 'Au même dénominateur 18 : 5/6 = 15/18 et 7/9 = 14/18. Donc 5/6 > 7/9.'],
        ['On sait que π ≈ 3,14159. Quel est son encadrement au dixième ?', ['3,14 < π < 3,15', '3 < π < 4', '3,2 < π < 3,3', '3,1 < π < 3,2'], 3, 'Au dixième, les bornes sont deux dixièmes consécutifs qui encadrent 3,14159 : 3,1 et 3,2.'],
        ['Quelle est l’amplitude de l’encadrement 2,3 < x < 2,4 ?', ['0,1', '0,01', '4,7', '2,35'], 0, 'L’amplitude est l’écart entre les bornes : 2,4 − 2,3 = 0,1.'],
      ],
    },
    {
      niveau: "4e", titre: "Fractions égales",
      questions: [
        ['Quelle fraction est égale à 3/5 ?', ['4/6', '6/15', '12/20', '9/20'], 2, '3/5 = (3 × 4)/(5 × 4) = 12/20. On multiplie le numérateur et le dénominateur par le même nombre.'],
        ['Quelle valeur de x rend l’égalité 4/7 = x/21 vraie ?', ['10', '17', '28', '12'], 3, '21 = 7 × 3, donc x = 4 × 3 = 12. On multiplie, on n’ajoute pas (ajouter 14 aux deux termes donnerait 17, ce qui est faux).'],
        ['Quelle est la forme irréductible de 84/126 ?', ['14/21', '2/3', '6/9', '42/63'], 1, '84 = 2² × 3 × 7 et 126 = 2 × 3² × 7. On simplifie par 42 : 84/126 = 2/3. Les autres fractions proposées peuvent encore être simplifiées.'],
        ['La fraction 35/7 est égale à un nombre entier.', ['Vrai', 'Faux'], 0, '35 ÷ 7 = 5 : une fraction peut très bien être égale à un entier.'],
      ],
    },
    {
      niveau: "4e", titre: "Additionner, soustraire, multiplier et diviser les nombres rationnels",
      questions: [
        ['Combien vaut 5/6 − 1/4 ?', ['1/2', '4/12', '7/12', '5/24'], 2, 'Au dénominateur 12 : 10/12 − 3/12 = 7/12.'],
        ['Combien vaut (3/4) ÷ (9/8) ?', ['2/3', '27/32', '3/2', '1/3'], 0, 'On multiplie par l’inverse : 3/4 × 8/9 = 24/36 = 2/3.'],
        ['Combien vaut 1/2 + 1/3 × 3/4 ?', ['5/8', '1/4', '4/9', '3/4'], 3, 'La multiplication est prioritaire : 1/3 × 3/4 = 1/4, puis 1/2 + 1/4 = 2/4 + 1/4 = 3/4.'],
        ['Les écritures (−5)/8 et 5/(−8) désignent deux nombres opposés.', ['Vrai', 'Faux'], 1, 'Le signe moins au numérateur ou au dénominateur donne le même nombre : (−5)/8 = 5/(−8) = −5/8. Ce ne sont pas des opposés.'],
      ],
    },
    {
      niveau: "4e", titre: "Puissances et notations scientifiques",
      questions: [
        ['Combien vaut 2⁻³ ?', ['−8', '1/8', '−6', '1/6'], 1, 'a^(−n) = 1/aⁿ, donc 2⁻³ = 1/2³ = 1/8. Un exposant négatif ne rend pas le nombre négatif.'],
        ['Quelle est l’écriture scientifique de 0,0056 ?', ['5,6 × 10⁻²', '56 × 10⁻⁴', '5,6 × 10⁻³', '0,56 × 10⁻²'], 2, 'La virgule recule de 3 rangs pour obtenir 5,6, qui est compris entre 1 et 10 : 0,0056 = 5,6 × 10⁻³.'],
        ['Que vaut (3²)⁴ ?', ['3⁶', '3¹⁶', '9⁶', '3⁸'], 3, '(aᵐ)ⁿ = a^(m×n), donc (3²)⁴ = 3^(2×4) = 3⁸. On multiplie les exposants.'],
        ['Quelle est l’écriture scientifique de (2 × 10⁵) × (3 × 10⁴) ?', ['6 × 10⁹', '6 × 10²⁰', '5 × 10⁹', '6 × 10¹'], 0, 'On multiplie les facteurs (2 × 3 = 6) et on additionne les exposants (5 + 4 = 9) : 6 × 10⁹.'],
      ],
    },
    {
      niveau: "4e", titre: "Les racines carrées",
      questions: [
        ['Quelle est la forme simplifiée de √72 ?', ['36√2', '2√6', '6√2', '9√8'], 2, '72 = 36 × 2 et 36 est un carré parfait : √72 = √36 × √2 = 6√2.'],
        ['Combien vaut √12 × √3 ?', ['√15', '4', '15', '6'], 3, '√a × √b = √(a × b), donc √12 × √3 = √36 = 6.'],
        ['Entre quels deux entiers consécutifs se trouve √30 ?', ['5 et 6', '4 et 5', '6 et 7', '15 et 16'], 0, '5² = 25 et 6² = 36 : comme 25 < 30 < 36, on a 5 < √30 < 6.'],
        ['On a √25 − √9 = √16.', ['Vrai', 'Faux'], 1, '√25 − √9 = 5 − 3 = 2, alors que √16 = 4. Comme pour l’addition, la racine carrée ne « passe » pas sur la soustraction.'],
      ],
    },
    {
      niveau: "4e", titre: "Les nombres premiers",
      questions: [
        ['Lequel de ces nombres est premier ?', ['51', '57', '59', '63'], 2, '51 = 3 × 17, 57 = 3 × 19 et 63 = 7 × 9. Seul 59 n’a que deux diviseurs, 1 et lui-même.'],
        ['Quelle est la décomposition en facteurs premiers de 84 ?', ['2 × 6 × 7', '2² × 3 × 7', '2³ × 3 × 7', '3 × 4 × 7'], 1, '84 = 2 × 42 = 2² × 21 = 2² × 3 × 7. Dans « 2 × 6 × 7 » ou « 3 × 4 × 7 », les nombres 6 et 4 ne sont pas premiers.'],
        ['Quelle est la forme irréductible de 18/30, obtenue avec les facteurs premiers ?', ['9/15', '6/10', '3/10', '3/5'], 3, '18 = 2 × 3² et 30 = 2 × 3 × 5. On barre 2 et 3 : il reste 3/5.'],
        ['Deux nombres premiers distincts sont toujours premiers entre eux.', ['Vrai', 'Faux'], 0, 'Chacun n’a pour facteur premier que lui-même : ils n’ont donc aucun facteur premier commun.'],
      ],
    },
    {
      niveau: "4e", titre: "Utiliser le langage littéral : la distributivité",
      questions: [
        ['Développe et réduis (x − 3)(x + 4).', ['x² − 12', 'x² + x − 12', 'x² + 7x − 12', 'x² − x − 12'], 1, 'x² + 4x − 3x − 12 = x² + x − 12. Les termes 4x et −3x se regroupent en x.'],
        ['Développe −2(3x − 5).', ['−6x − 10', '−5x + 10', '−6x + 10', '6x + 10'], 2, 'Le facteur −2 multiplie chaque terme : −2 × 3x = −6x et −2 × (−5) = +10.'],
        ['Factorise (x + 2)(x − 1) + 3(x + 2) et réduis le second facteur.', ['(x + 2)(x − 4)', '(x + 2)(x + 4)', '(x + 2)(3x − 1)', '(x + 2)(x + 2)'], 3, 'Le facteur commun est (x + 2) : (x + 2)[(x − 1) + 3] = (x + 2)(x + 2).'],
        ['Pour x = 1, on a (x + 3)² ≠ x² + 9 : l’égalité (x + 3)² = x² + 9 est donc fausse.', ['Vrai', 'Faux'], 0, 'Pour x = 1, (1 + 3)² = 16 et 1² + 9 = 10. Un seul contre-exemple suffit à prouver qu’une égalité est fausse.'],
      ],
    },
    {
      niveau: "4e", titre: "Égalité et équation",
      questions: [
        ['Quelle est la solution de 3x + 7 = 22 ?', ['x = 15', 'x = 5', 'x = 29/3', 'x = −5'], 1, 'On soustrait 7 aux deux membres : 3x = 15, puis on divise par 3 : x = 5.'],
        ['Quelle est la solution de 4(x − 2) = 2x + 6 ?', ['x = 1', 'x = 14', 'x = 7', 'x = 4'], 2, 'On développe : 4x − 8 = 2x + 6. Alors 2x = 14 et x = 7. Vérification : 4 × 5 = 20 et 2 × 7 + 6 = 20.'],
        ['Quelles sont les solutions de x(x − 6) = 0 ?', ['6 seulement', '0 et −6', '−6 seulement', '0 et 6'], 3, 'Un produit est nul si l’un des facteurs est nul : x = 0 ou x − 6 = 0, donc x = 0 ou x = 6.'],
        ['Le nombre 3 est-il solution de 2x + 5 = 3x + 2 ?', ['Oui, les deux membres valent 11', 'Non, 11 est différent de 9', 'Non, 11 est différent de 8', 'Oui, les deux membres valent 9'], 0, 'Pour x = 3, 2 × 3 + 5 = 11 et 3 × 3 + 2 = 11 : l’égalité est vraie, donc 3 est solution.'],
      ],
    },
    {
      niveau: "4e", titre: "Modéliser une situation",
      questions: [
        ['Un rectangle a pour largeur x et pour longueur x + 5. Quelle expression donne son périmètre ?', ['x + x + 5', '2x + 5', '4x + 10', '4x + 5'], 2, 'Périmètre = 2 × (largeur + longueur) = 2 × (x + x + 5) = 2 × (2x + 5) = 4x + 10.'],
        ['Programme : choisis x, multiplie par 3, ajoute 6, puis divise par 3. Quelle expression réduite obtient-on ?', ['x + 2', 'x + 6', '3x + 2', '3x + 6'], 0, '(3x + 6) ÷ 3 = x + 2 : le programme revient à ajouter 2 au nombre de départ.'],
        ['Comment traduit-on « le prix p diminué de 30 % » ?', ['p − 30', '0,3 × p', '1,3 × p', '0,7 × p'], 3, 'Diminuer de 30 %, c’est multiplier par 1 − 0,30 = 0,7.'],
        ['Trouver 2,5 personnes dans une classe est un résultat vraisemblable.', ['Vrai', 'Faux'], 1, 'Un nombre de personnes est un entier : un résultat décimal signale une erreur de mise en équation, même si le calcul est juste.'],
      ],
    },
    {
      niveau: "4e", titre: "Statistiques",
      questions: [
        ['Quelle est la médiane de la série 12 ; 8 ; 15 ; 10 ; 9 ?', ['10', '12', '10,8', '9'], 0, 'On ordonne d’abord : 8 ; 9 ; 10 ; 12 ; 15. La valeur du milieu est 10. Le nombre 10,8 est la moyenne.'],
        ['Quelle est la médiane de la série 4 ; 6 ; 7 ; 11 ?', ['6', '6,5', '7', '8'], 1, 'L’effectif est pair : la médiane est le milieu entre les deux valeurs centrales, (6 + 7) ÷ 2 = 6,5.'],
        ['Dans un diagramme circulaire, un secteur de 90° représente une part d’un effectif total de 200. Quel est l’effectif ?', ['90', '25', '45', '50'], 3, '90° représente 90/360 = 1/4 du total : 200 ÷ 4 = 50.'],
        ['L’étendue de la série 3 ; 8 ; 5 ; 12 est 9.', ['Vrai', 'Faux'], 0, 'Étendue = plus grande valeur − plus petite valeur = 12 − 3 = 9.'],
      ],
    },
    {
      niveau: "4e", titre: "Les probabilités",
      questions: [
        ['On lance un dé équilibré à six faces. Quelle est la probabilité d’obtenir un multiple de 3 ?', ['1/6', '1/2', '1/3', '2/3'], 2, 'Les multiples de 3 sont 3 et 6 : 2 issues favorables sur 6, soit 2/6 = 1/3.'],
        ['Une urne contient 4 boules rouges et 6 vertes. On tire deux fois avec remise. Quelle est la probabilité d’obtenir deux rouges ?', ['0,8', '0,4', '0,24', '0,16'], 3, 'Le long d’une branche, on multiplie : 0,4 × 0,4 = 0,16.'],
        ['On lance deux fois une pièce équilibrée. Quelle est la probabilité d’obtenir au moins une fois pile ?', ['1/2', '3/4', '1/4', '1'], 1, 'Le contraire est « aucun pile », donc deux faces : probabilité 1/4. Ainsi P(au moins un pile) = 1 − 1/4 = 3/4.'],
        ['Deux événements contraires sont toujours incompatibles.', ['Vrai', 'Faux'], 0, 'Un événement et son contraire ne peuvent pas se produire en même temps : ils sont incompatibles, et leurs probabilités s’ajoutent pour faire 1.'],
      ],
    },
    {
      niveau: "4e", titre: "La proportionnalité",
      questions: [
        ['Un tableau donne 2 → 7 ; 4 → 14 ; 6 → 20. Est-ce un tableau de proportionnalité ?', ['Oui, le coefficient est 3,5', 'Non, les quotients ne sont pas tous égaux', 'Oui, car les valeurs augmentent', 'Non, car 2 ne divise pas 7'], 1, '7 ÷ 2 = 3,5 et 14 ÷ 4 = 3,5, mais 20 ÷ 6 ≈ 3,33. Les quotients ne sont pas tous égaux : ce n’est pas de la proportionnalité.'],
        ['Une recette pour 6 personnes utilise 450 g de farine. Quelle quantité faut-il pour 10 personnes ?', ['510 g', '675 g', '750 g', '600 g'], 2, 'Passage à l’unité : 450 ÷ 6 = 75 g par personne, donc 75 × 10 = 750 g.'],
        ['Une droite passe par l’origine et par le point (4 ; 10). Quel est le coefficient de proportionnalité ?', ['0,4', '6', '14', '2,5'], 3, 'Le coefficient est le quotient ordonnée ÷ abscisse : 10 ÷ 4 = 2,5.'],
        ['Le périmètre d’un carré est proportionnel à la longueur de son côté.', ['Vrai', 'Faux'], 0, 'P = 4 × c : le périmètre s’obtient en multipliant le côté par le coefficient 4.'],
      ],
    },
    {
      niveau: "4e", titre: "Les pourcentages",
      questions: [
        ['Un pull à 60 € est soldé à −25 %. Quel est son nouveau prix ?', ['35 €', '45 €', '15 €', '75 €'], 1, 'On multiplie par 0,75 : 60 × 0,75 = 45 €. Le prix baisse de 15 €, donc 60 − 15 = 45 €.'],
        ['Quel pourcentage de la classe représentent 18 filles dans une classe de 24 élèves ?', ['18 %', '25 %', '75 %', '133 %'], 2, '(partie ÷ tout) × 100 = 18 ÷ 24 × 100 = 75 %.'],
        ['Le prix d’un livre passe de 20 € à 17 €. Quel est le taux d’évolution ?', ['−17,6 %', '−3 %', '−85 %', '−15 %'], 3, '(17 − 20) ÷ 20 × 100 = −15 %. On divise par la valeur initiale, 20.'],
        ['Diminuer un prix de 10 % revient à le multiplier par 0,9.', ['Vrai', 'Faux'], 0, 'Le coefficient d’une baisse de t % est 1 − t/100 = 1 − 0,1 = 0,9.'],
      ],
    },
    {
      niveau: "4e", titre: "Dépendance de deux grandeurs",
      questions: [
        ['Un taxi facture 3 € de prise en charge plus 2 € par kilomètre. Quelle formule donne le prix P pour d km ?', ['P = 5d', 'P = 3d + 2', 'P = 2d + 3', 'P = 6d'], 2, 'Le prix est la part fixe (3 €) ajoutée à 2 € par km : P = 2d + 3. Ce n’est pas une proportionnalité, à cause de la part fixe.'],
        ['Sur un graphique, une courbe descend puis devient horizontale. Que dit-elle de la grandeur dépendante ?', ['Elle augmente puis se stabilise', 'Elle diminue puis ne change plus', 'Elle diminue puis augmente', 'Elle est constante puis diminue'], 1, 'Une courbe qui descend traduit une diminution, et le palier horizontal une valeur qui ne change pas.'],
        ['Avec la formule P = 2,50 × n, quel est le prix pour n = 8 ?', ['10,50 €', '8 €', '2,50 €', '20 €'], 3, 'P = 2,50 × 8 = 20 €. On remplace la variable n par sa valeur.'],
        ['Dans un tableau de valeurs, on place en général la variable sur la première ligne.', ['Vrai', 'Faux'], 0, 'La variable occupe la première ligne, la grandeur dépendante la seconde, comme on la lit ensuite en abscisse puis en ordonnée sur un graphique.'],
      ],
    },
  ],
}
