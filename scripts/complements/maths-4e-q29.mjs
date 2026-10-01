export default {
  slug: 'maths',
  titreMigration: 'QUESTIONS EN PLUS — MATHS 4e (lot 29)',
  motif: `Quatre questions de plus par quiz : huit suffisaient pour se tester une fois, pas pour réviser sur plusieurs semaines.`,
  chapitres: [
    {
      niveau: "4e", titre: "Prendre une fraction d’un nombre",
      questions: [
        ['Pour calculer les 2/3 de 45 en commençant par la division, quel est le premier calcul ?', ['45 × 2 = 90', '45 ÷ 2 = 22,5', '45 ÷ 3 = 15', '45 × 3 = 135'], 2, 'On divise d’abord par le dénominateur, puis on multiplie par le numérateur : 45 ÷ 3 = 15, puis 15 × 2 = 30. La division tombe juste, c’est donc l’ordre le plus simple.'],
        ['Diviser un nombre par 3/4 revient à…', ['le multiplier par 3/4', 'le multiplier par 4/3', 'le diviser par 4, puis par 3', 'lui soustraire 3/4'], 1, 'Diviser par une fraction, c’est multiplier par son inverse : 45 ÷ 3/4 = 45 × 4/3 = 60. C’est ainsi qu’on retrouve le tout à partir d’une partie.'],
        ['Léo annonce que les 2/5 de 30 font 75. Que penses-tu de son résultat ?', ['Il est juste, car 30 ÷ 2 × 5 = 75', 'Il est faux, car la partie dépasse le tout', 'Il est juste, car 75 est un multiple de 5', 'Il est faux, car on trouve exactement 60'], 1, '2/5 est inférieur à 1 : la partie doit être plus petite que 30. Léo a divisé par 2/5 au lieu de multiplier ; le bon résultat est 30 × 2/5 = 12.'],
        ['Par quel calcul obtient-on 75 % de 80 ?', ['80 ÷ 75/100', '80 × 75', '75 ÷ 80 × 100', '80 × 75/100'], 3, 'Un pourcentage est une fraction de dénominateur 100 : 75 % de 80 = 80 × 75/100 = 60, c’est-à-dire les trois quarts de 80.'],
      ],
    },
    {
      niveau: "4e", titre: "Égalité des produits en croix",
      questions: [
        ['Dans l’égalité 3/x = 6/10, que vaut x ?', ['x = 20', 'x = 5', 'x = 1,8', 'x = 7'], 1, 'Produit en croix : 3 × 10 = 6 × x, donc 6x = 30 et x = 30 ÷ 6 = 5. On vérifie : 3/5 = 0,6 et 6/10 = 0,6.'],
        ['En résolvant une égalité de quotients, on arrive à 4x = 60. Quelle est l’étape suivante ?', ['Soustraire 4 : x = 56', 'Multiplier par 4 : x = 240', 'Diviser par 4 : x = 15', 'Ajouter 4 : x = 64'], 2, 'On isole l’inconnue en divisant par 4 : x = 15. Il reste ensuite à vérifier en remplaçant x dans l’égalité de départ.'],
        ['Dans quelle situation le produit en croix donne-t-il un résultat faux ?', ['Le prix de pommes vendues 3 € le kilo', 'La distance parcourue à vitesse constante', 'La farine selon le nombre de crêpes', 'L’aire d’un carré selon son côté'], 3, 'Quand le côté double, l’aire est multipliée par 4 : l’aire n’est pas proportionnelle au côté. Le produit en croix y donnerait un résultat faux, sans que rien dans le calcul ne le signale.'],
        ['3 cahiers coûtent 4,50 €. Combien coûtent 7 cahiers au même prix ?', ['10,50 €', '8,50 €', '9 €', '31,50 €'], 0, 'C’est une quatrième proportionnelle : 3/4,50 = 7/x, donc x = 7 × 4,50 ÷ 3 = 31,50 ÷ 3 = 10,50 €.'],
      ],
    },
    {
      niveau: "4e", titre: "La division euclidienne",
      questions: [
        ['Dans l’égalité 47 = 5 × 9 + 2, comment s’appelle le nombre 47 ?', ['Le diviseur', 'Le quotient', 'Le reste', 'Le dividende'], 3, 'Le dividende est le nombre qu’on partage ; ici 5 est le diviseur, 9 le quotient et 2 le reste.'],
        ['Nous sommes lundi. Quel jour serons-nous dans 100 jours ?', ['Mardi', 'Mercredi', 'Jeudi', 'Lundi'], 1, '100 = 7 × 14 + 2 : 14 semaines complètes ramènent au lundi, puis 2 jours de plus mènent au mercredi. Pour un cycle, c’est le reste qui répond.'],
        ['Un élève écrit 50 = 6 × 7 + 8. Que faut-il corriger pour obtenir la division euclidienne de 50 par 6 ?', ['Rien, l’égalité convient', 'Le reste : 50 = 6 × 7 + 6', 'Le quotient : 50 = 6 × 8 + 2', 'Le diviseur : 50 = 7 × 7 + 1'], 2, 'Le reste 8 est plus grand que le diviseur 6 : le quotient est trop petit d’un cran. On écrit 50 = 6 × 8 + 2, avec 2 < 6.'],
        ['On range 75 œufs dans des boîtes de 6. Combien d’œufs restent hors des boîtes pleines ?', ['3', '12', '13', '6'], 0, '75 = 6 × 12 + 3 : on remplit 12 boîtes (le quotient) et il reste 3 œufs (le reste). La question porte ici sur le reste.'],
      ],
    },
    {
      niveau: "4e", titre: "Reconnaître un multiple et un diviseur",
      questions: [
        ['Lequel de ces nombres est un multiple de 7 ?', ['47', '57', '63', '75'], 2, '63 = 7 × 9, avec 9 entier. Les multiples de 7 voisins sont 56, 63 et 70 : 47, 57 et 75 n’en font pas partie.'],
        ['Combien le nombre 36 a-t-il de diviseurs ?', ['8', '9', '10', '6'], 1, 'Par paires : 1 × 36, 2 × 18, 3 × 12, 4 × 9, 6 × 6. On s’arrête quand les facteurs se rejoignent ; 6 ne compte qu’une fois : 9 diviseurs.'],
        ['Lequel de ces nombres est premier ?', ['31', '27', '39', '51'], 0, '31 n’a que deux diviseurs, 1 et 31. Les trois autres sont des multiples de 3 : 27 = 3 × 9, 39 = 3 × 13 et 51 = 3 × 17.'],
        ['Que peut-on dire de la fraction 8/15 ?', ['Elle se simplifie par 2', 'Elle se simplifie par 3', 'Elle se simplifie par 5', 'Elle est déjà irréductible'], 3, 'Diviseurs de 8 : 1, 2, 4, 8 ; diviseurs de 15 : 1, 3, 5, 15. Seul 1 est commun : 8 et 15 sont premiers entre eux, la fraction est irréductible.'],
      ],
    },
    {
      niveau: "4e", titre: "Critères de divisibilité",
      questions: [
        ['Lequel de ces nombres est divisible par 25 ?', ['3 350', '1 205', '2 520', '4 015'], 0, 'Un nombre est divisible par 25 s’il se termine par 00, 25, 50 ou 75 : c’est le cas de 3 350 (3 350 = 25 × 134).'],
        ['Lequel de ces nombres est divisible par 4 ?', ['1 322', '2 514', '3 126', '5 716'], 3, 'On regarde les deux derniers chiffres : 16 est un multiple de 4, donc 5 716 aussi. 22, 14 et 26 sont pairs, mais ne sont pas des multiples de 4.'],
        ['Qu’appelle-t-on la « preuve par neuf » ?', ['Une méthode pour lister les diviseurs', 'Un critère de divisibilité par 99', 'Une vérification rapide des multiplications', 'Une règle pour arrondir un résultat'], 2, 'Fondée sur le critère de divisibilité par 9, elle servait à contrôler une multiplication posée, avant l’arrivée des calculatrices.'],
        ['Quel chiffre faut-il écrire à la place du ■ pour que 52■ soit divisible par 9 ?', ['0', '2', '4', '7'], 1, 'La somme des chiffres doit être divisible par 9 : 5 + 2 + 2 = 9. En effet, 522 = 9 × 58.'],
      ],
    },
    {
      niveau: "4e", titre: "Pourcentages : calculs et quantité totale (suite)",
      questions: [
        ['Par quel nombre multiplie-t-on un prix pour lui appliquer une baisse de 15 % ?', ['0,15', '1,15', '0,85', '1,85'], 2, 'Après une baisse de 15 %, il reste 100 % − 15 % = 85 % du prix : on multiplie par 0,85.'],
        ['Un abonnement passe de 40 € à 30 €. Quel est le taux d’évolution ?', ['−25 %', '−10 %', '−33 %', '+25 %'], 0, '(30 − 40) ÷ 40 × 100 = −25 %. On divise par la valeur INITIALE, 40 ; diviser par 30 donnerait environ −33 %, ce qui est faux.'],
        ['12 représente 30 % d’une quantité. Karim trouve 3,6 pour cette quantité. Pourquoi est-ce forcément faux ?', ['Un pourcentage ne s’applique qu’à 100', 'Il fallait ajouter 30 à 12', 'Il fallait un nombre plus petit que 3,6', 'Le tout doit être plus grand que 12'], 3, 'Karim a multiplié au lieu de diviser : 12 × 0,3 = 3,6. Le tout se divise : 12 ÷ 0,3 = 40, bien plus grand que la partie 12.'],
        ['Un prix augmente de 20 %, puis encore de 10 %. Quelle est l’évolution globale ?', ['+30 %', '+32 %', '+2 %', '+22 %'], 1, 'On multiplie les coefficients : 1,2 × 1,1 = 1,32, soit +32 %. La deuxième hausse porte sur un prix déjà augmenté, on ne peut pas ajouter les pourcentages.'],
      ],
    },
    {
      niveau: "4e", titre: "Utiliser une échelle",
      questions: [
        ['Sur un plan, une rue de 300 m mesure 6 cm. Quelle est l’échelle du plan ?', ['1/50', '1/500', '1/5 000', '1/50 000'], 2, 'On met les deux distances dans la même unité : 300 m = 30 000 cm, puis 6 ÷ 30 000 = 1/5 000.'],
        ['Sur une carte au 1/200 000, deux villes sont à 7 cm l’une de l’autre. Quelle est la distance réelle ?', ['14 km', '1,4 km', '140 km', '140 m'], 0, '7 × 200 000 = 1 400 000 cm. Comme 1 km = 100 000 cm, la distance réelle est de 14 km.'],
        ['Sur une maquette au 1/100, par combien les volumes sont-ils divisés ?', ['100', '10 000', '300', '1 000 000'], 3, 'L’échelle porte sur les longueurs : un volume, produit de trois longueurs, est divisé par 100³ = 1 000 000.'],
        ['Quelle est l’échelle habituelle d’une carte de randonnée ?', ['1/50', '1/25 000', '1/1 000', '1/5 000 000'], 1, 'Au 1/25 000, 1 cm représente 250 m : assez de détails pour suivre un sentier. Le 1/50 sert aux plans de maison, le 1/200 000 aux cartes routières.'],
      ],
    },
    {
      niveau: "4e", titre: "Grandeurs simples et grandeurs composées",
      questions: [
        ['Avec quel instrument mesure-t-on une intensité électrique ?', ['Le voltmètre', 'L’ampèremètre', 'Le thermomètre', 'La balance'], 1, 'L’intensité est une grandeur simple : elle se lit directement sur un ampèremètre, en ampères (A).'],
        ['Quelle est une unité de masse volumique ?', ['g/cm³', 'g × cm³', 'L/min', 'cm³/s'], 0, 'La masse volumique est un quotient, masse ÷ volume : son unité le dit, des grammes divisés par des centimètres cubes.'],
        ['Un radiateur de 2 kW fonctionne pendant 3 h. Quelle énergie consomme-t-il ?', ['1,5 kWh', '5 kWh', '6 kWh', '0,67 kWh'], 2, 'L’énergie est un produit : puissance × durée = 2 kW × 3 h = 6 kWh.'],
        ['Une voiture parcourt 150 km en 2 h. Quelle est sa vitesse moyenne ?', ['300 km/h', '148 km/h', '75 h/km', '75 km/h'], 3, 'Vitesse = distance ÷ durée = 150 km ÷ 2 h = 75 km/h. L’unité km/h dit bien une distance divisée par une durée.'],
      ],
    },
    {
      niveau: "4e", titre: "Convertir des unités de grandeurs simples",
      questions: [
        ['Combien de minutes font 0,75 h ?', ['75 min', '45 min', '7,5 min', '40 min'], 1, 'Une heure compte 60 minutes : 0,75 × 60 = 45 min. Les durées ne se convertissent pas de 10 en 10.'],
        ['Combien de millilitres contient une canette de 33 cL ?', ['3,3 mL', '33 mL', '330 mL', '3 300 mL'], 2, '1 cL = 10 mL, donc 33 cL = 330 mL (et 1 L = 100 cL = 1 000 mL).'],
        ['Que signifie le préfixe « hecto » ?', ['× 100', '÷ 100', '× 1 000', '× 10'], 0, 'Kilo multiplie par 1 000, hecto par 100, déca par 10 : un hectomètre vaut 100 mètres. C’est centi qui divise par 100.'],
        ['Combien de kilogrammes font 2,4 tonnes ?', ['24 kg', '240 kg', '24 000 kg', '2 400 kg'], 3, '1 t = 1 000 kg, donc 2,4 t = 2,4 × 1 000 = 2 400 kg. On passe à une unité plus petite : le nombre grandit.'],
      ],
    },
    {
      niveau: "4e", titre: "Convertir des unités de grandeurs composées",
      questions: [
        ['Combien de km/h font 15 m/s ?', ['4,17 km/h', '54 km/h', '15 000 km/h', '900 km/h'], 1, 'Des m/s vers les km/h, on multiplie par 3,6 : 15 × 3,6 = 54 km/h. En 1 h = 3 600 s, on parcourt en effet 15 × 3 600 = 54 000 m.'],
        ['Un robinet débite 12 L/min. Combien cela fait-il de litres par heure ?', ['0,2 L/h', '72 L/h', '120 L/h', '720 L/h'], 3, 'On convertit le dénominateur : 1 h = 60 min, donc en une heure le robinet débite 12 × 60 = 720 L. Le débit vaut 720 L/h.'],
        ['À combien de mètres carrés correspond 1 are ?', ['1 000 m²', '10 m²', '100 m²', '10 000 m²'], 2, '1 are = 1 dam² = 10 m × 10 m = 100 m². L’hectare, lui, vaut 100 ares, soit 10 000 m².'],
        ['Un fromage coûte 5 €/kg. Quel est son prix en €/g ?', ['0,005 €/g', '0,5 €/g', '5 000 €/g', '0,05 €/g'], 0, '1 kg = 1 000 g : un gramme coûte 1 000 fois moins qu’un kilo, 5 ÷ 1 000 = 0,005 €/g.'],
      ],
    },
    {
      niveau: "4e", titre: "Caractéristiques des triangles",
      questions: [
        ['Dans un triangle, deux angles mesurent 48° et 67°. Combien mesure le troisième ?', ['75°', '65°', '115°', '245°'], 1, 'La somme des angles vaut 180° : 180 − (48 + 67) = 180 − 115 = 65°.'],
        ['Où se coupent les trois médiatrices d’un triangle ?', ['Au centre du cercle inscrit', 'À l’orthocentre', 'Au centre du cercle circonscrit', 'Au centre de gravité'], 2, 'Le point de concours des médiatrices est à la même distance des trois sommets : c’est le centre du cercle circonscrit, qui passe par les trois sommets.'],
        ['Un triangle ABC est isocèle en A et l’angle A mesure 40°. Combien mesure l’angle B ?', ['40°', '140°', '50°', '70°'], 3, 'Les angles à la base B et C sont égaux : ils se partagent 180 − 40 = 140°, soit 70° chacun.'],
        ['ABC est rectangle en A, avec AB = 6 cm et AC = 8 cm. Quelle est son aire ?', ['24 cm²', '48 cm²', '14 cm²', '28 cm²'], 0, 'Les côtés de l’angle droit servent de base et de hauteur : (6 × 8) ÷ 2 = 24 cm². 48 cm² oublie la division par 2.'],
      ],
    },
    {
      niveau: "4e", titre: "Se repérer dans un pavé droit",
      questions: [
        ['Un pavé droit mesure 5 cm de long, 3 cm de large et 2 cm de haut. Un sommet est l’origine, les axes suivent ces trois arêtes. Quelles sont les coordonnées du sommet opposé ?', ['(5 ; 3 ; 2)', '(0 ; 0 ; 0)', '(5 ; 3)', '(10 ; 6 ; 4)'], 0, 'L’origine est (0 ; 0 ; 0) ; le sommet opposé est au bout des trois arêtes, en (L ; l ; h) = (5 ; 3 ; 2). Dans l’espace, il faut trois coordonnées.'],
        ['Quelle est l’aire totale d’un pavé droit de 5 cm × 3 cm × 2 cm ?', ['30 cm²', '31 cm²', '62 cm²', '20 cm²'], 2, 'Aire totale = 2(L×l + L×h + l×h) = 2(15 + 10 + 6) = 2 × 31 = 62 cm². Le nombre 30 est le volume, en cm³.'],
        ['Quelles positions une droite et un plan de l’espace peuvent-ils avoir ?', ['Seulement parallèles ou sécants selon une droite', 'Parallèles, sécants en un point, ou droite dans le plan', 'Seulement perpendiculaires l’un à l’autre', 'Non coplanaires, comme deux droites'], 1, 'Une droite coupe un plan en un seul point, lui est parallèle, ou y est contenue. « Sécants selon une droite » décrit deux plans.'],
        ['En perspective cavalière, sous quelle forme peut apparaître une face carrée qui n’est pas la face avant ?', ['Toujours un carré', 'Un triangle', 'Un trapèze isocèle', 'Un parallélogramme'], 3, 'La perspective cavalière conserve le parallélisme mais pas les angles droits hors de la face avant : les côtés restent parallèles deux à deux, le carré devient un parallélogramme.'],
      ],
    },
    {
      niveau: "4e", titre: "Pyramide et cône de révolution",
      questions: [
        ['Quel est le volume d’une pyramide à base carrée de côté 6 cm et de hauteur 5 cm ?', ['180 cm³', '60 cm³', '90 cm³', '30 cm³'], 1, 'Aire de la base : 6 × 6 = 36 cm². V = (1/3) × 36 × 5 = 60 cm³. 180 cm³ serait le volume du prisme : le tiers a été oublié.'],
        ['Combien de faces a le patron d’une pyramide à base hexagonale ?', ['6', '12', '7', '8'], 2, 'Le patron d’une pyramide comporte la base et autant de triangles que la base a de côtés : 1 hexagone et 6 triangles, soit 7 faces.'],
        ['Dans le patron d’un cône, à quoi est égale la longueur de l’arc du secteur circulaire ?', ['À la génératrice', 'À la hauteur du cône', 'Au rayon de la base', 'Au périmètre de la base'], 3, 'L’arc s’enroule exactement autour de la base : sa longueur est le périmètre du disque de base. Le rayon du secteur, lui, est la génératrice.'],
        ['Une section parallèle à la base découpe une petite pyramide, réduction de rapport 1/2 de la grande. Par combien son volume est-il multiplié ?', ['1/8', '1/2', '1/4', '1/6'], 0, 'Dans une réduction de rapport k, les volumes sont multipliés par k³ : (1/2)³ = 1/8. La petite pyramide occupe le huitième de la grande.'],
      ],
    },
    {
      niveau: "4e", titre: "Agrandissement et réduction d’une figure géométrique",
      questions: [
        ['Un triangle a des côtés de 4 cm, 5 cm et 6 cm. Agrandi, son côté de 4 cm devient 10 cm. Que devient le côté de 6 cm ?', ['12 cm', '15 cm', '16 cm', '24 cm'], 1, 'Le rapport vaut k = 10 ÷ 4 = 2,5 : toutes les longueurs sont multipliées par 2,5, donc 6 × 2,5 = 15 cm. Ajouter 6 cm (16 cm) ne donne pas un agrandissement.'],
        ['Une figure est réduite avec un rapport k = 0,5. Par combien son aire est-elle multipliée ?', ['0,5', '2', '0,25', '0,125'], 2, 'Les aires sont multipliées par k² = 0,5 × 0,5 = 0,25 : l’aire est divisée par 4. Le nombre 0,125 = k³ concerne les volumes.'],
        ['Sur une maquette au 1/50, un réservoir a un volume de 2 cm³. Quel est son volume réel ?', ['100 cm³', '5 000 cm³', '2,5 m³', '0,25 m³'], 3, 'Les volumes sont multipliés par 50³ = 125 000 : 2 × 125 000 = 250 000 cm³, soit 0,25 m³ (1 m³ = 1 000 000 cm³).'],
        ['Deux rectangles mesurent 3 cm × 5 cm et 6 cm × 8 cm. L’un est-il un agrandissement de l’autre ?', ['Non, car 6 ÷ 3 ≠ 8 ÷ 5', 'Oui, de rapport 2', 'Oui, car ils ont quatre angles droits', 'Oui, de rapport 3'], 0, 'Il faut le même rapport pour toutes les paires de côtés : 6 ÷ 3 = 2 mais 8 ÷ 5 = 1,6. Les deux rectangles n’ont pas la même forme.'],
      ],
    },
    {
      niveau: "4e", titre: "Triangles égaux et semblables",
      questions: [
        ['ABC est semblable à DEF, dans cet ordre. Quel côté de DEF correspond au côté BC ?', ['DE', 'EF', 'DF', 'AB'], 1, 'L’ordre des lettres fixe les correspondances A↔D, B↔E, C↔F : le côté BC correspond donc au côté EF.'],
        ['ABC et DEF sont semblables (A↔D, B↔E, C↔F), avec AB = 3 cm, DE = 12 cm et BC = 5 cm. Combien mesure EF ?', ['14 cm', '15 cm', '20 cm', '1,25 cm'], 2, 'Le rapport de similitude vaut k = DE ÷ AB = 12 ÷ 3 = 4. Donc EF = 4 × BC = 4 × 5 = 20 cm.'],
        ['Un bâton vertical de 1 m a une ombre de 1,5 m ; au même moment, un arbre a une ombre de 12 m. Quelle est la hauteur de l’arbre ?', ['8 m', '18 m', '10,5 m', '13,5 m'], 0, 'Le bâton, l’arbre et leurs ombres forment deux triangles semblables : k = 12 ÷ 1,5 = 8, donc l’arbre mesure 8 × 1 = 8 m.'],
        ['Deux triangles ont chacun un côté de 7 cm compris entre deux angles de 40° et 65°. Que peut-on affirmer ?', ['Ils sont semblables mais pas égaux', 'On ne peut rien conclure', 'Ils sont tous deux rectangles', 'Ils sont égaux'], 3, 'Un côté et les deux angles qui lui sont adjacents, égaux deux à deux : c’est l’un des trois cas d’égalité. Les triangles sont égaux, donc superposables.'],
      ],
    },
    {
      niveau: "4e", titre: "Le théorème de Thalès",
      questions: [
        ['Avec (MN) // (BC), M sur [AB] et N sur [AC] : AM = 3 cm, AB = 5 cm et BC = 10 cm. Combien mesure MN ?', ['6 cm', '16,7 cm', '8 cm', '1,5 cm'], 0, 'D’après Thalès, AM/AB = MN/BC, donc 3/5 = MN/10 et, par produit en croix, MN = 3 × 10 ÷ 5 = 6 cm.'],
        ['Pour appliquer la réciproque de Thalès, que faut-il vérifier en plus de l’égalité AM/AB = AN/AC ?', ['Que ABC est rectangle en A', 'Que AM et AN sont égales', 'Que les points sont alignés dans le même ordre', 'Que (MN) et (BC) sont perpendiculaires'], 2, 'La réciproque exige que A, M, B d’une part et A, N, C d’autre part soient alignés dans le même ordre ; sinon, l’égalité des quotients ne suffit pas à conclure au parallélisme.'],
        ['Avec (MN) // (BC) et AM/AB = 1/3, par combien l’aire de AMN est-elle multipliée par rapport à celle de ABC ?', ['1/3', '1/9', '1/6', '2/3'], 1, 'AMN est une réduction de ABC de rapport k = 1/3 : les longueurs sont multipliées par 1/3, les aires par k² = 1/9.'],
        ['A, M, B et A, N, C sont alignés dans le même ordre, avec AM = 2, AB = 5, AN = 3 et AC = 7. Les droites (MN) et (BC) sont-elles parallèles ?', ['Oui, car 2 + 5 = 7', 'Oui, car les quotients sont proches', 'On ne peut rien dire sans un angle', 'Non, car 2 × 7 ≠ 5 × 3'], 3, 'On compare AM/AB = 2/5 et AN/AC = 3/7 par produit en croix : 2 × 7 = 14 et 5 × 3 = 15. Les quotients diffèrent, donc les droites ne sont pas parallèles.'],
      ],
    },
    {
      niveau: "4e", titre: "Le triangle rectangle : théorème de Pythagore et cosinus d’un angle aigu",
      questions: [
        ['ABC est rectangle en A, avec AB = 6 cm et AC = 8 cm. Combien mesure BC ?', ['14 cm', '10 cm', '√28 cm', '100 cm'], 1, 'BC² = AB² + AC² = 36 + 64 = 100, donc BC = √100 = 10 cm. 14 cm additionne les longueurs au lieu de leurs carrés.'],
        ['Un triangle a des côtés de 9 cm, 12 cm et 15 cm. Est-il rectangle ?', ['Non, car 9 + 12 ≠ 15', 'On ne peut pas le savoir sans rapporteur', 'Non, car ses trois côtés sont différents', 'Oui, car 15² = 9² + 12²'], 3, 'Réciproque de Pythagore : 15² = 225 et 9² + 12² = 81 + 144 = 225. L’égalité est vraie : le triangle est rectangle, l’angle droit est opposé au côté de 15 cm.'],
        ['ABC est rectangle en A, l’angle B mesure 60° et BC = 8 cm. Combien mesure AB ?', ['4 cm', '16 cm', '6,9 cm', '7,5 cm'], 0, 'cos B = côté adjacent ÷ hypoténuse = AB ÷ BC. Donc AB = BC × cos 60° = 8 × 0,5 = 4 cm.'],
        ['Quel réglage de la calculatrice faut-il vérifier avant d’utiliser la touche cos⁻¹ ?', ['Le mode radians (RAD)', 'Le mode fraction', 'Le mode degrés (DEG)', 'Le mode scientifique (SCI)'], 2, 'Au collège, les angles se mesurent en degrés : la calculatrice doit être en mode DEG, sinon cos⁻¹ affiche un angle dans une autre unité.'],
      ],
    },
    {
      niveau: "4e", titre: "Les parallélogrammes particuliers",
      questions: [
        ['Dans un parallélogramme ABCD, l’angle A mesure 70°. Combien mesure l’angle C ?', ['110°', '70°', '20°', '290°'], 1, 'Dans un parallélogramme, les angles opposés ont la même mesure : A et C sont opposés, donc l’angle C mesure 70°.'],
        ['Les diagonales d’un quadrilatère se coupent en leur milieu et ont la même longueur. Quelle est sa nature ?', ['Un losange', 'Un carré, forcément', 'Un rectangle', 'Un trapèze isocèle'], 2, 'Milieu commun : c’est un parallélogramme ; diagonales de même longueur en plus : c’est un rectangle. Pour un carré, il faudrait aussi qu’elles soient perpendiculaires.'],
        ['Où se trouve le centre de symétrie d’un parallélogramme ?', ['Au point de rencontre des diagonales', 'Au milieu de son plus grand côté', 'Sur l’un de ses quatre sommets', 'Il n’a aucun centre de symétrie'], 0, 'Le parallélogramme a un centre de symétrie, le point d’intersection de ses diagonales, même s’il n’a aucun axe de symétrie.'],
        ['Quelle propriété des diagonales le carré possède-t-il, que le losange n’a pas forcément ?', ['Elles se coupent en leur milieu', 'Elles sont perpendiculaires', 'Elles sont parallèles', 'Elles ont la même longueur'], 3, 'Les diagonales d’un losange se coupent déjà en leur milieu et sont perpendiculaires ; le carré, qui est aussi un rectangle, a en plus des diagonales de même longueur.'],
      ],
    },
  ],
}
