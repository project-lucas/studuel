export default {
  slug: 'maths',
  titreMigration: 'QUESTIONS EN PLUS — MATHS 6e (lot 33)',
  motif: `Quatre questions de plus par quiz : huit suffisaient pour se tester une fois, pas pour réviser sur plusieurs semaines.`,
  chapitres: [
    {
      niveau: "6e", titre: "Géométrie : éléments de base, propriétés des droites parallèles et perpendiculaires, médiatrices et bissectrices",
      questions: [
        ['Que désigne la notation AB, écrite sans crochets ni parenthèses ?', ['La droite passant par A et B', 'La demi-droite d’origine A', 'Le milieu du segment [AB]', 'La longueur du segment [AB]'], 3, 'Crochets pour le segment, parenthèses pour la droite ; AB seul est la longueur, un nombre.'],
        ['Les droites (d1) et (d2) sont parallèles, et (d3) est perpendiculaire à (d1). Que peut-on dire de (d3) et (d2) ?', ['Elle est perpendiculaire à (d2)', 'Elle est parallèle à (d2)', 'Elle est confondue avec (d2)', 'On ne peut rien conclure'], 0, 'Une perpendiculaire à l’une de deux parallèles est perpendiculaire à l’autre : c’est une propriété qui se démontre.'],
        ['Le point M est sur la médiatrice du segment [AB]. Que sait-on avec certitude ?', ['M est le milieu de [AB]', 'MA = MB', 'MA = AB', '(MA) est perpendiculaire à (MB)'], 1, 'Les points de la médiatrice sont à égale distance des deux extrémités ; M n’est le milieu que s’il est aussi sur le segment.'],
        ['Quel instrument sert à reporter une longueur sans la mesurer ?', ['La règle graduée', 'Le rapporteur', 'Le compas', 'L’équerre'], 2, 'Le compas reporte une longueur d’un endroit à un autre et trace les cercles ; c’est aussi lui qui construit une médiatrice.'],
      ],
    },
    {
      niveau: "6e", titre: "Travailler avec les angles",
      questions: [
        ['Comment appelle-t-on un angle qui mesure exactement 180° ?', ['Un angle droit', 'Un angle obtus', 'Un angle plat', 'Un angle aigu'], 2, 'Un angle plat mesure 180° : ses deux côtés sont dans le prolongement l’un de l’autre.'],
        ['Quel est le complémentaire d’un angle de 35° ?', ['145°', '55°', '65°', '125°'], 1, 'Deux angles complémentaires font 90° ensemble : 90 − 35 = 55. Le 145° est le supplémentaire (180 − 35).'],
        ['Quel est le supplémentaire d’un angle de 110° ?', ['80°', '250°', '20°', '70°'], 3, 'Deux angles supplémentaires font 180° ensemble : 180 − 110 = 70°.'],
        ['Tu mesures un angle visiblement aigu et tu lis 130° sur une graduation. Que fais-tu ?', ['Je lis l’autre graduation : 50°', 'Je garde 130°, c’est la mesure', 'Je retranche 90° à 130°', 'J’ajoute 50° à 130°'], 0, 'Le rapporteur a deux graduations complémentaires à 180° (130 + 50). Un angle aigu mesure moins de 90°, donc c’est 50°.'],
      ],
    },
    {
      niveau: "6e", titre: "Construire des triangles et utiliser la somme des angles d’un triangle",
      questions: [
        ['Un triangle a deux angles de 100° et 30°. Combien mesure le troisième ?', ['50°', '60°', '80°', '130°'], 0, 'La somme vaut 180° : 180 − 100 − 30 = 50°.'],
        ['Peut-on construire un triangle dont les côtés mesurent 5 cm, 6 cm et 10 cm ?', ['Non, car 5 + 6 = 11 est différent de 10', 'Non, car 10 est le plus grand côté', 'Oui, car 10 < 5 + 6 = 11', 'Oui, car les trois côtés sont différents'], 2, 'Le plus grand côté (10) est plus petit que la somme des deux autres (11) : le triangle existe. On vérifie toujours avant de construire.'],
        ['Pour construire un triangle dont on connaît deux côtés et l’angle compris entre eux, on utilise…', ['la règle et le compas seulement', 'la règle et le rapporteur', 'l’équerre et le compas', 'le rapporteur seul'], 1, 'On trace un côté, on reporte l’angle au rapporteur, puis on trace le second côté à la règle.'],
        ['Un triangle rectangle a un angle aigu de 37°. Combien mesure l’autre angle aigu ?', ['143°', '63°', '37°', '53°'], 3, 'Les deux angles aigus d’un triangle rectangle sont complémentaires : 90 − 37 = 53°.'],
      ],
    },
    {
      niveau: "6e", titre: "Connaître les triangles isocèles, équilatéraux et rectangles",
      questions: [
        ['Un triangle isocèle a des angles à la base de 50°. Combien mesure l’angle au sommet principal ?', ['50°', '100°', '80°', '130°'], 2, 'Les angles à la base sont égaux : 50 + 50 = 100, et 180 − 100 = 80°.'],
        ['Dans un triangle rectangle, l’hypoténuse est…', ['toujours le côté le plus court', 'toujours le côté le plus long', 'l’un des côtés de l’angle droit', 'un côté de longueur moyenne'], 1, 'L’hypoténuse, opposée à l’angle droit, est toujours le plus long côté du triangle rectangle.'],
        ['Un triangle équilatéral est…', ['un triangle jamais isocèle', 'un triangle forcément rectangle', 'isocèle seulement s’il est petit', 'un cas particulier de triangle isocèle'], 3, 'Ayant trois côtés égaux, il en a au moins deux : tout équilatéral est isocèle, mais l’inverse est faux.'],
        ['Sur une figure, deux côtés portent le même petit trait. Que sait-on ?', ['Ils ont la même longueur', 'Ils sont perpendiculaires', 'Ils sont parallèles', 'Ils mesurent chacun 1 cm'], 0, 'Des traits identiques codent des longueurs égales. On se fie au codage, pas à la règle graduée.'],
      ],
    },
    {
      niveau: "6e", titre: "Connaître la symétrie axiale",
      questions: [
        ['Le point A est à 3 cm de l’axe (d). Quelle est la distance AA’ entre A et son symétrique A’ ?', ['3 cm', '6 cm', '9 cm', '1,5 cm'], 1, 'L’axe est la médiatrice de [AA’] : A’ est à 3 cm de l’autre côté, donc AA’ = 3 + 3 = 6 cm.'],
        ['Combien d’axes de symétrie a un rectangle qui n’est pas un carré ?', ['4', '1', '2', 'Aucun'], 2, 'Un rectangle a deux axes : les médiatrices de ses côtés. Ses diagonales n’en sont pas.'],
        ['Un triangle isocèle qui n’est pas équilatéral a…', ['un seul axe de symétrie', 'deux axes de symétrie', 'trois axes de symétrie', 'aucun axe de symétrie'], 0, 'Son axe est la médiatrice de la base. Seul le triangle équilatéral en possède trois.'],
        ['Les points A’ et B’ sont les symétriques de A et B, et AB = 5 cm. Combien mesure A’B’ ?', ['10 cm', '2,5 cm', '0 cm', '5 cm'], 3, 'La symétrie axiale conserve les longueurs : A’B’ = AB = 5 cm.'],
      ],
    },
    {
      niveau: "6e", titre: "Voir dans l’espace et calculer des volumes",
      questions: [
        ['Quel est le volume d’un cube de 4 cm de côté ?', ['16 cm³', '64 cm³', '12 cm³', '48 cm³'], 1, 'V = c × c × c = 4 × 4 × 4 = 64 cm³. Le 16 est l’aire d’une face.'],
        ['Quel est le volume d’un pavé droit de 5 cm sur 4 cm sur 3 cm ?', ['12 cm³', '94 cm³', '60 cm³', '20 cm³'], 2, 'V = L × l × h = 5 × 4 × 3 = 60 cm³.'],
        ['Une bouteille contient 1,5 L. Quel est son volume en cm³ ?', ['150 cm³', '15 cm³', '15 000 cm³', '1 500 cm³'], 3, '1 L = 1 dm³ = 1 000 cm³, donc 1,5 L = 1 500 cm³.'],
        ['Combien de patrons différents un cube possède-t-il ?', ['11', '6', '12', '8'], 0, 'Le cube a onze patrons : six carrés ne suffisent pas, il faut qu’ils soient bien disposés pour se replier.'],
      ],
    },
    {
      niveau: "6e", titre: "Calculer des périmètres",
      questions: [
        ['Quel est le périmètre d’un rectangle de 12 cm de long et 8 cm de large ?', ['96 cm', '20 cm', '40 cm', '32 cm'], 2, 'P = 2 × (12 + 8) = 2 × 20 = 40 cm. Le 96 serait l’aire.'],
        ['Quel est le périmètre d’un cercle de rayon 5 cm (avec π ≈ 3,14) ?', ['31,4 cm', '15,7 cm', '78,5 cm', '314 cm'], 0, 'P = 2 × π × r = 2 × 3,14 × 5 = 31,4 cm. Le 78,5 serait l’aire du disque.'],
        ['Un rectangle mesure 2 m sur 50 cm. Quel est son périmètre en centimètres ?', ['104 cm', '500 cm', '250 cm', '5 cm'], 1, 'On convertit d’abord : 2 m = 200 cm, puis P = 2 × (200 + 50) = 500 cm. Additionner 2 et 50 mélange les unités.'],
        ['Pour le périmètre d’une figure composée, les segments intérieurs (traits de découpe)…', ['comptent une fois', 'comptent deux fois', 'comptent la moitié', 'ne comptent pas'], 3, 'On n’additionne que les segments du contour : les traits intérieurs ne font pas partie du tour de la figure.'],
      ],
    },
    {
      niveau: "6e", titre: "Calculer et convertir des aires",
      questions: [
        ['Quelle est l’aire d’un triangle de base 10 cm et de hauteur 6 cm ?', ['60 cm²', '30 cm²', '16 cm²', '32 cm²'], 1, 'A = (base × hauteur) ÷ 2 = (10 × 6) ÷ 2 = 30 cm². Oublier de diviser par 2 donne 60.'],
        ['Quelle est l’aire d’un disque de rayon 3 cm (avec π ≈ 3,14) ?', ['28,26 cm²', '18,84 cm²', '56,52 cm²', '9 cm²'], 0, 'A = π × r × r = 3,14 × 3 × 3 = 28,26 cm². Le 18,84 est le périmètre du cercle (2 × π × r), à ne pas confondre.'],
        ['Combien de cm² dans 3 m² ?', ['300 cm²', '3 000 cm²', '30 000 cm²', '300 000 cm²'], 2, '1 m² = 10 000 cm², donc 3 m² = 30 000 cm².'],
        ['Un terrain mesure 5 ares. Quelle est son aire en m² ?', ['50 m²', '5 000 m²', '50 000 m²', '500 m²'], 3, '1 are = 100 m², donc 5 ares = 500 m².'],
      ],
    },
    {
      niveau: "6e", titre: "Calculer des horaires et des durées, convertir des durées",
      questions: [
        ['Que vaut 45 minutes exprimées en heures ?', ['0,45 h', '0,75 h', '4,5 h', '0,6 h'], 1, '45 ÷ 60 = 0,75 h. Le temps se compte en base 60 : 0,45 h ne fait pas 45 minutes.'],
        ['Combien de minutes font 3 h 20 min ?', ['320 min', '180 min', '200 min', '230 min'], 2, '3 h = 3 × 60 = 180 min, puis 180 + 20 = 200 min.'],
        ['Un train part à 9 h 40 et roule 2 h 35. À quelle heure arrive-t-il ?', ['12 h 15', '11 h 75', '12 h 05', '12 h 75'], 0, '9 h 40 + 2 h 35 = 11 h 75. Comme 75 min = 1 h 15, on obtient 12 h 15.'],
        ['Une voiture parcourt 120 km en 1 h 30 à vitesse constante. Quelle est sa vitesse ?', ['90 km/h', '120 km/h', '60 km/h', '80 km/h'], 3, '1 h 30 = 1,5 h, donc v = d ÷ t = 120 ÷ 1,5 = 80 km/h.'],
      ],
    },
    {
      niveau: "6e", titre: "Initiation à la pensée informatique",
      questions: [
        ['Pour tracer un hexagone régulier avec une boucle, de quel angle tourne-t-on à chaque tour ?', ['90°', '120°', '60°', '30°'], 2, 'Pour un polygone à n côtés, on tourne de 360 ÷ n degrés : 360 ÷ 6 = 60°.'],
        ['Dans l’instruction « aller à (3 ; 5) », que représente le 3 ?', ['L’ordonnée', 'L’abscisse', 'Le nombre de pas', 'Le nombre de tours'], 1, 'Dans un couple de coordonnées, l’abscisse (horizontale) vient toujours en premier : x = 3, puis l’ordonnée y = 5.'],
        ['Sans boucle, combien d’instructions faut-il écrire pour répéter 4 fois [avancer de 100 ; tourner de 90°] ?', ['4', '6', '12', '8'], 3, 'Chaque tour compte deux instructions et il y a 4 tours : 8 instructions. Avec une boucle, trois suffisent.'],
        ['Dans « si le lutin touche le bord, alors rebondir », que représente « le lutin touche le bord » ?', ['La condition', 'L’instruction répétée', 'La variable', 'Le bug'], 0, 'Dans une instruction « si … alors … », la partie testée est la condition : elle décide si l’action a lieu.'],
      ],
    },
    {
      niveau: "6e", titre: "Proportionnalité",
      questions: [
        ['4 cahiers identiques coûtent 6 €. Combien coûtent 10 cahiers au même prix ?', ['10 €', '24 €', '15 €', '60 €'], 2, 'Un cahier coûte 6 ÷ 4 = 1,5 €, donc 10 cahiers coûtent 10 × 1,5 = 15 €.'],
        ['Sur une carte à l’échelle 1/50 000, 4 cm représentent en réalité…', ['200 m', '2 km', '20 km', '4 km'], 1, '4 × 50 000 = 200 000 cm, soit 2 000 m, soit 2 km.'],
        ['Dans le produit en croix 3/5 = x/20, que vaut x ?', ['60', '15', '8', '12'], 3, 'x = 3 × 20 ÷ 5 = 60 ÷ 5 = 12.'],
        ['Le tableau 2 → 7 ; 4 → 14 ; 6 → 20 est-il un tableau de proportionnalité ?', ['Non : 20 ÷ 6 ne donne pas 3,5', 'Oui : les nombres augmentent', 'Oui : 7 est impair', 'Non : il n’a que trois colonnes'], 0, 'Les deux premières colonnes donnent 3,5, mais 20 ÷ 6 n’est pas égal à 3,5 : il faut que toutes les colonnes donnent le même quotient.'],
      ],
    },
    {
      niveau: "6e", titre: "Nombres entiers et décimaux : définition, repérage et comparaisons",
      questions: [
        ['Quel est le plus petit de ces nombres ?', ['3,09', '3,1', '3,012', '3,2'], 2, 'On compare les dixièmes : 3,012 et 3,09 ont 0 dixième, et 3,012 a 1 centième contre 9. 3,012 est le plus petit malgré ses trois décimales.'],
        ['Dans 58,724, quel est le chiffre des centièmes ?', ['7', '2', '4', '8'], 1, 'Après la virgule : 7 dixièmes, 2 centièmes, 4 millièmes. Le 8 est le chiffre des unités.'],
        ['Que vaut 6,95 arrondi au dixième ?', ['6,9', '6,0', '7,1', '7,0'], 3, 'Le chiffre suivant est 5 : on arrondit au supérieur, ce qui donne 7,0 (soit 7).'],
        ['Quelle est l’écriture décomposée de 4,07 ?', ['4 + 7/100', '4 + 7/10', '4 + 7/1 000', '47/100'], 0, '4,07 c’est 4 unités, 0 dixième et 7 centièmes : 4 + 7/100. Le 47/100 vaut 0,47.'],
      ],
    },
    {
      niveau: "6e", titre: "Nombres décimaux : addition, soustraction et multiplication",
      questions: [
        ['Combien font 12,5 − 3,75 ?', ['9,25', '8,75', '8,25', '9,75'], 1, 'On aligne les virgules : 12,50 − 3,75 = 8,75.'],
        ['Combien font 0,4 × 0,3 ?', ['1,2', '0,7', '0,12', '0,012'], 2, '4 × 3 = 12, et il y a 1 + 1 = 2 décimales : 0,12.'],
        ['Combien font 250 ÷ 1 000 ?', ['2,5', '25', '0,025', '0,25'], 3, 'Diviser par 1 000 déplace la virgule de trois rangs vers la gauche : 250 devient 0,25.'],
        ['Combien font 5 × (3 + 2) − 4 ?', ['21', '13', '5', '41'], 0, 'On commence par la parenthèse : 5 × 5 = 25, puis 25 − 4 = 21.'],
      ],
    },
    {
      niveau: "6e", titre: "Division euclidienne et divisibilité",
      questions: [
        ['Laquelle de ces écritures est la division euclidienne de 100 par 7 ?', ['100 = 7 × 13 + 9', '100 = 7 × 14 + 2', '100 = 7 × 15 − 5', '100 = 7 × 12 + 16'], 1, '7 × 14 = 98 et 100 − 98 = 2. Les autres écritures sont fausses ou ont un reste qui n’est pas plus petit que 7.'],
        ['Lequel de ces nombres est divisible par 4 ?', ['1 214', '2 350', '3 716', '5 026'], 2, 'On regarde les deux derniers chiffres : 16 est divisible par 4, alors que 14, 50 et 26 ne le sont pas.'],
        ['Lequel de ces nombres est divisible à la fois par 2, par 5 et par 10 ?', ['370', '375', '372', '365'], 0, 'Un nombre qui se termine par 0 est divisible par 2, 5 et 10.'],
        ['Lequel de ces nombres est premier ?', ['21', '27', '39', '29'], 3, '21 = 3 × 7, 27 = 3 × 9 et 39 = 3 × 13 ont d’autres diviseurs. 29 n’a que 1 et lui-même.'],
      ],
    },
    {
      niveau: "6e", titre: "Division décimale",
      questions: [
        ['Combien font 21 ÷ 4 ?', ['5,5', '5,2', '5,25', '5,05'], 2, '21 = 4 × 5 + 1 ; on abaisse un zéro : 10 ÷ 4 = 2 reste 2, puis 20 ÷ 4 = 5. Le quotient est 5,25.'],
        ['Combien font 6,3 ÷ 0,9 ?', ['7', '70', '0,7', '5,4'], 0, 'On multiplie les deux nombres par 10 : 63 ÷ 9 = 7.'],
        ['Quelle est la valeur approchée par excès de 2 ÷ 3 au centième ?', ['0,66', '0,67', '0,7', '0,65'], 1, '2 ÷ 3 = 0,666… La valeur juste au-dessus au centième est 0,67 (par défaut, ce serait 0,66).'],
        ['Combien font 0,7 ÷ 5 ?', ['1,4', '0,014', '0,35', '0,14'], 3, '7 ÷ 5 = 1,4, donc 0,7 ÷ 5 = 0,14. Vérification : 0,14 × 5 = 0,7.'],
      ],
    },
    {
      niveau: "6e", titre: "Fraction : sens - quotient",
      questions: [
        ['Dans la fraction 5/8, que dit le numérateur ?', ['On coupe en 5 parts', 'On prend 8 parts', 'On prend 5 parts', 'On coupe en 8 parts'], 2, 'Le dénominateur (8) dit en combien de parts on coupe, le numérateur (5) combien on en prend.'],
        ['Comment s’écrit le quotient 7 ÷ 4 sous forme de fraction ?', ['7/4', '4/7', '7/11', '3/4'], 0, 'Une fraction est un quotient : a/b = a ÷ b. Ici 7 ÷ 4 = 7/4 = 1,75.'],
        ['Combien font les 2/3 de 45 ?', ['15', '30', '90', '22,5'], 1, 'On divise par 3 puis on multiplie par 2 : 45 ÷ 3 × 2 = 15 × 2 = 30.'],
        ['Quelle est la forme irréductible de 24/36 ?', ['6/9', '12/18', '3/4', '2/3'], 3, 'On divise en haut et en bas par 12 : 24/36 = 2/3. Les fractions 6/9 et 12/18 sont égales mais encore simplifiables.'],
      ],
    },
    {
      niveau: "6e", titre: "Fraction : encadrer - comparer - ordonner",
      questions: [
        ['Comment ranger 1/2, 3/4 et 1/4 dans l’ordre croissant ?', ['1/4 ; 1/2 ; 3/4', '3/4 ; 1/2 ; 1/4', '1/2 ; 1/4 ; 3/4', '1/4 ; 3/4 ; 1/2'], 0, 'En quarts : 1/2 = 2/4. Avec le même dénominateur, on compare les numérateurs : 1 < 2 < 3.'],
        ['Entre quels entiers se situe 29/4 ?', ['Entre 6 et 7', 'Entre 7 et 8', 'Entre 8 et 9', 'Entre 29 et 30'], 1, '29 ÷ 4 = 7,25, donc 7 < 29/4 < 8.'],
        ['Comment se comparent 7/9 et 9/7 ?', ['9/7 < 7/9', '7/9 = 9/7', '7/9 < 9/7', 'Impossible sans calcul'], 2, '7/9 est inférieur à 1 (7 < 9) et 9/7 est supérieur à 1 (9 > 7) : on conclut sans aucun calcul.'],
        ['Quelle fraction est égale à 50 % ?', ['1/5', '1/4', '1/50', '1/2'], 3, '50 % = 50/100 = 1/2 : la moitié.'],
      ],
    },
    {
      niveau: "6e", titre: "Fractions et calculs",
      questions: [
        ['Combien font 3/5 + 4/5 ?', ['7/10', '7/5', '12/5', '1/5'], 1, 'Même dénominateur : on additionne les numérateurs et on garde le dénominateur. 3 + 4 = 7, donc 7/5.'],
        ['Combien font 1/4 + 1/2 ?', ['2/6', '1/6', '3/4', '2/8'], 2, 'On met au même dénominateur : 1/2 = 2/4, puis 1/4 + 2/4 = 3/4.'],
        ['Combien font 2/5 × 5/6 ?', ['1/3', '7/11', '10/11', '2/3'], 0, 'Numérateurs entre eux, dénominateurs entre eux : 10/30 = 1/3 après simplification.'],
        ['Quel est le résultat de 4 × 3/8, écrit sous forme irréductible ?', ['12/8', '12/32', '3/8', '3/2'], 3, 'On multiplie le numérateur seul : 12/8, puis on simplifie par 4 : 3/2. Le résultat 12/8 n’est pas irréductible.'],
      ],
    },
    {
      niveau: "6e", titre: "Pourcentages",
      questions: [
        ['Combien font 35 % de 200 ?', ['70', '35', '7', '65'], 0, '35 % = 25 % + 10 % : 200 ÷ 4 = 50 et 200 ÷ 10 = 20, donc 50 + 20 = 70.'],
        ['Un article à 80 € est en réduction de 30 %. Quel est son nouveau prix ?', ['24 €', '56 €', '50 €', '110 €'], 1, 'On garde 70 % du prix : 80 × 0,7 = 56 €. Le 24 € est le montant de la réduction.'],
        ['Un prix de 40 € augmente de 10 %. Quel est le nouveau prix ?', ['4 €', '41 €', '44 €', '50 €'], 2, '10 % de 40 = 4 €, donc 40 + 4 = 44 € (ou 40 × 1,1 = 44).'],
        ['Dans une classe de 20 élèves, 9 sont demi-pensionnaires. Quel pourcentage cela représente-t-il ?', ['9 %', '20 %', '55 %', '45 %'], 3, '9 ÷ 20 = 0,45, soit 45 %.'],
      ],
    },
    {
      niveau: "6e", titre: "Résoudre des problèmes mettant en jeu des nombres inconnus",
      questions: [
        ['Comment trouve-t-on x dans x − 9 = 15 ?', ['En calculant 15 − 9', 'En calculant 15 + 9', 'En calculant 15 × 9', 'En calculant 9 − 15'], 1, 'L’opération inverse de la soustraction est l’addition : x = 15 + 9 = 24.'],
        ['Comment trouve-t-on x dans x ÷ 5 = 8 ?', ['En calculant 8 + 5', 'En calculant 8 − 5', 'En calculant 8 × 5', 'En calculant 8 ÷ 5'], 2, 'L’opération inverse de la division est la multiplication : x = 8 × 5 = 40. Vérification : 40 ÷ 5 = 8.'],
        ['Un livre coûte 3 fois moins cher qu’un autre qui coûte 24 €. Quel est son prix ?', ['72 €', '21 €', '27 €', '8 €'], 3, '« 3 fois moins » est une division, malgré le mot « fois » : 24 ÷ 3 = 8 €.'],
        ['Léa a 35 € et achète 3 cahiers à 4 € pièce. Combien lui reste-t-il ?', ['23 €', '31 €', '8 €', '32 €'], 0, 'Étape 1 : 3 × 4 = 12 € dépensés. Étape 2 : 35 − 12 = 23 €. Un problème à deux étapes demande deux calculs.'],
      ],
    },
    {
      niveau: "6e", titre: "Statistiques",
      questions: [
        ['Sur 30 élèves, 6 viennent à vélo. Quelle est la fréquence des élèves à vélo ?', ['6 %', '20 %', '30 %', '180 %'], 1, 'Fréquence = effectif ÷ effectif total = 6 ÷ 30 = 0,2, soit 20 %.'],
        ['Dans un diagramme circulaire, quel angle occupe une catégorie de 20 % ?', ['20°', '36°', '72°', '144°'], 2, 'Angle = fréquence × 360° = 0,2 × 360 = 72°.'],
        ['Quelle est la moyenne des notes 8, 12, 14, 10 et 16 ?', ['10', '14', '60', '12'], 3, 'La somme vaut 60 et il y a 5 notes : 60 ÷ 5 = 12.'],
        ['Quel graphique convient le mieux pour montrer une évolution dans le temps ?', ['Le graphique cartésien', 'Le diagramme circulaire', 'Le diagramme en barres', 'Le tableau de données'], 0, 'Le graphique cartésien relie des valeurs au fil du temps ; le diagramme circulaire montre des parts d’un tout.'],
      ],
    },
    {
      niveau: "6e", titre: "Probabilités",
      questions: [
        ['Une urne contient 3 boules rouges et 5 boules bleues. Quelle est la probabilité de tirer une boule rouge ?', ['3/5', '3/8', '5/8', '1/3'], 1, 'Il y a 3 cas favorables sur 3 + 5 = 8 cas possibles : 3/8.'],
        ['Un événement A a pour probabilité 0,3. Quelle est la probabilité de son contraire ?', ['0,3', '1,3', '0,7', '0,03'], 2, 'P(A) + P(contraire) = 1, donc 1 − 0,3 = 0,7.'],
        ['Avec un dé à 6 faces, quelle est la probabilité d’obtenir un nombre strictement supérieur à 4 ?', ['1/6', '2/3', '1/2', '1/3'], 3, 'Les issues favorables sont 5 et 6 : 2 cas sur 6, soit 2/6 = 1/3.'],
        ['Quand on répète une expérience aléatoire un très grand nombre de fois, la fréquence observée…', ['se rapproche de la probabilité', 's’éloigne de la probabilité', 'devient égale à 1', 'devient égale à 0'], 0, 'Sur peu d’essais la fréquence peut s’écarter de la probabilité ; plus on répète, plus elle s’en rapproche.'],
      ],
    },
  ],
}
