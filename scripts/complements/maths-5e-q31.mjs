export default {
  slug: 'maths',
  titreMigration: 'QUESTIONS EN PLUS — MATHS 5e (lot 31)',
  motif: `Quatre questions de plus par quiz : huit suffisaient pour se tester une fois, pas pour réviser sur plusieurs semaines.`,
  chapitres: [
    {
      niveau: "5e", titre: "Calculer le volume d’un parallélépipède, d’un cube et d’une pyramide",
      questions: [
        ["Un aquarium en forme de pavé droit mesure 50 cm, 30 cm et 40 cm. Combien de litres d’eau contient-il quand il est plein ?", ["60 L", "6 L", "600 L", "6 000 L"], 0, "50 × 30 × 40 = 60 000 cm³ = 60 dm³, soit 60 L (1 dm³ = 1 L)."],
        ["Un cube a un volume de 27 cm³. Quelle est la longueur de son arête ?", ["9 cm", "3 cm", "13,5 cm", "6 cm"], 1, "Le volume d’un cube est c³ : 3 × 3 × 3 = 27, donc l’arête mesure 3 cm."],
        ["Un pavé droit a pour base un rectangle de 2 m sur 3 m et pour hauteur 50 cm. Quel est son volume ?", ["300 m³", "30 m³", "0,3 m³", "3 m³"], 3, "Il faut d’abord tout convertir dans la même unité : 50 cm = 0,5 m, puis 2 × 3 × 0,5 = 3 m³."],
        ["Une pyramide a une base d’aire 45 cm² et une hauteur de 12 cm. Quel est son volume ?", ["540 cm³", "270 cm³", "180 cm³", "60 cm³"], 2, "V = (aire de la base × hauteur) ÷ 3 = (45 × 12) ÷ 3 = 540 ÷ 3 = 180 cm³."],
      ],
    },
    {
      niveau: "5e", titre: "Aire et périmètre de figures géométriques",
      questions: [
        ["Quelle est l’aire d’un trapèze de bases 8 cm et 4 cm et de hauteur 5 cm ?", ["60 cm²", "40 cm²", "30 cm²", "20 cm²"], 2, "Aire = ((B + b) × h) ÷ 2 = ((8 + 4) × 5) ÷ 2 = 60 ÷ 2 = 30 cm²."],
        ["Quel est le périmètre d’un cercle de rayon 5 cm (avec π ≈ 3,14) ?", ["15,7 cm", "78,5 cm", "314 cm", "31,4 cm"], 3, "Périmètre = 2 × π × R = 2 × 3,14 × 5 = 31,4 cm. 78,5 serait l’aire du disque, en cm²."],
        ["Quel est le périmètre d’un rectangle de 12 m sur 5 m ?", ["60 m", "34 m", "17 m", "30 m"], 1, "P = 2 × (L + l) = 2 × (12 + 5) = 34 m. Le produit 60 est l’aire, en m²."],
        ["Un champ mesure 2 hectares. Combien cela fait-il de mètres carrés ?", ["200 m²", "2 000 m²", "20 000 m²", "200 000 m²"], 2, "1 ha = 10 000 m², donc 2 ha = 20 000 m²."],
      ],
    },
    {
      niveau: "5e", titre: "Visualiser et représenter des solides",
      questions: [
        ["Combien de sommets a une pyramide à base carrée ?", ["4", "5", "6", "8"], 1, "Elle a les 4 sommets de la base et le sommet principal : 5 sommets."],
        ["Quel solide a pour patron un disque et un secteur circulaire ?", ["Le cône", "Le cylindre", "La pyramide", "La sphère"], 0, "Le cône se déplie en un disque (la base) et un secteur circulaire (la surface latérale)."],
        ["En perspective cavalière, quelle face est dessinée en vraie grandeur ?", ["La face du dessus", "Toutes les faces", "La face avant", "La face cachée"], 2, "La face avant garde sa forme réelle ; les fuyantes sont dessinées en biais et souvent réduites."],
        ["Lequel de ces solides est un polyèdre ?", ["Le cylindre", "Le cône", "La sphère", "Le prisme"], 3, "Un polyèdre a toutes ses faces planes, comme le prisme. Cylindre, cône et sphère sont des solides de révolution."],
      ],
    },
    {
      niveau: "5e", titre: "Prisme droit et cylindre de révolution",
      questions: [
        ["Un prisme droit a pour base un triangle. Combien a-t-il d’arêtes ?", ["6", "9", "8", "12"], 1, "Une base à n côtés donne 3n arêtes : 3 × 3 = 9 arêtes (3 + 3 pour les bases, 3 latérales)."],
        ["Quel est le volume d’un cylindre de rayon 3 cm et de hauteur 10 cm (avec π ≈ 3,14) ?", ["94,2 cm³", "188,4 cm³", "282,6 cm³", "847,8 cm³"], 2, "V = π × R² × h = 3,14 × 9 × 10 = 282,6 cm³. Attention : c’est R² (9), pas 2R."],
        ["Un prisme droit a pour base un rectangle de 4 cm sur 3 cm et pour hauteur 10 cm. Quelle est son aire latérale ?", ["140 cm²", "120 cm²", "240 cm²", "168 cm²"], 0, "Aire latérale = périmètre de la base × hauteur = 2 × (4 + 3) × 10 = 140 cm²."],
        ["Lequel de ces solides a un volume égal à (aire de la base × hauteur) ÷ 3 ?", ["Le prisme droit", "Le cylindre", "Le pavé droit", "La pyramide"], 3, "Le tiers ne concerne que la pyramide et le cône. Prisme, pavé et cylindre : aire de la base × hauteur."],
      ],
    },
    {
      niveau: "5e", titre: "Angles et parallélisme",
      questions: [
        ["Deux droites parallèles sont coupées par une sécante. Un angle mesure 65°. Que mesure son alterne-interne ?", ["115°", "25°", "65°", "90°"], 2, "Si les droites sont parallèles, les angles alternes-internes sont égaux : 65°."],
        ["Deux angles sont supplémentaires. L’un mesure 110°. Que mesure l’autre ?", ["70°", "80°", "20°", "250°"], 0, "Deux angles supplémentaires ont une somme de 180° : 180 − 110 = 70°."],
        ["Deux angles sont complémentaires. L’un mesure 35°. Que mesure l’autre ?", ["145°", "55°", "65°", "35°"], 1, "Deux angles complémentaires ont une somme de 90° : 90 − 35 = 55°."],
        ["Deux angles alternes-internes ne sont pas égaux. Que peut-on conclure ?", ["Les droites sont parallèles", "Les droites sont perpendiculaires", "On ne peut rien dire", "Les droites ne sont pas parallèles"], 3, "C’est la contraposée : si les droites étaient parallèles, ces angles seraient égaux. Elles ne le sont donc pas."],
      ],
    },
    {
      niveau: "5e", titre: "Connaître et utiliser les triangles",
      questions: [
        ["Dans un triangle rectangle, comment s’appelle le côté opposé à l’angle droit ?", ["La médiane", "La base", "La hauteur", "L’hypoténuse"], 3, "L’hypoténuse est le côté opposé à l’angle droit ; c’est toujours le plus long des trois côtés."],
        ["Peut-on construire un triangle de côtés 5 cm, 6 cm et 12 cm ?", ["Oui, un triangle isocèle", "Non, car 5 + 6 < 12", "Non, car les points seraient alignés", "Oui, un triangle rectangle"], 1, "Inégalité triangulaire : 5 + 6 = 11 est inférieur à 12, donc le triangle est impossible (il faudrait l’égalité pour des points alignés)."],
        ["Un triangle a un angle de 110°. Comment l’appelle-t-on ?", ["Acutangle", "Rectangle", "Obtusangle", "Équilatéral"], 2, "Un angle de plus de 90° est obtus : le triangle est obtusangle."],
        ["Combien d’axes de symétrie a un triangle isocèle qui n’est pas équilatéral ?", ["Un", "Deux", "Trois", "Aucun"], 0, "Il a un seul axe : la médiatrice de sa base, qui passe par le sommet principal."],
      ],
    },
    {
      niveau: "5e", titre: "Connaître et utiliser les triangles (suite)",
      questions: [
        ["Dans un triangle obtusangle, où se trouve l’orthocentre ?", ["Au milieu d’un côté", "À l’intérieur du triangle", "Sur un sommet", "À l’extérieur du triangle"], 3, "Dans un triangle obtusangle, les hauteurs tombent hors des côtés et leur point de concours est à l’extérieur du triangle."],
        ["Une médiane mesure 12 cm. À quelle distance du sommet se trouve le centre de gravité ?", ["4 cm", "8 cm", "6 cm", "9 cm"], 1, "Le centre de gravité est aux deux tiers de la médiane en partant du sommet : 12 × 2/3 = 8 cm."],
        ["Que peut-on dire de tout point de la médiatrice d’un segment [AB] ?", ["Il est à égale distance de A et de B", "Il est le milieu de [AB]", "Il est aligné avec A et B", "Il est sur la bissectrice de l’angle A"], 0, "Tout point de la médiatrice est équidistant des extrémités du segment."],
        ["Le cercle circonscrit à un triangle passe par…", ["les milieux des côtés", "les pieds des hauteurs", "ses trois sommets", "le centre de gravité seulement"], 2, "Son centre est le point de concours des médiatrices, et il passe par les trois sommets."],
      ],
    },
    {
      niveau: "5e", titre: "Connaître les angles d’un triangle",
      questions: [
        ["Un triangle isocèle a des angles à la base de 50°. Que mesure l’angle au sommet ?", ["80°", "50°", "100°", "40°"], 0, "Les deux angles à la base valent 50° chacun : 180 − 50 − 50 = 80°."],
        ["Un triangle rectangle a un angle aigu de 32°. Que mesure l’autre angle aigu ?", ["148°", "68°", "58°", "32°"], 2, "Les angles aigus sont complémentaires : 90 − 32 = 58°."],
        ["Les deux angles intérieurs non adjacents à un angle extérieur mesurent 50° et 60°. Que mesure l’angle extérieur ?", ["70°", "110°", "130°", "120°"], 1, "L’angle extérieur est égal à la somme des deux angles intérieurs non adjacents : 50 + 60 = 110°."],
        ["Un élève dessine un triangle d’angles 100°, 50° et 40°. Que peut-on dire ?", ["Il est obtusangle", "Il est isocèle", "Il est rectangle", "Il est impossible, car la somme dépasse 180°"], 3, "100 + 50 + 40 = 190°, or la somme des angles d’un triangle vaut toujours 180° : ce triangle n’existe pas."],
      ],
    },
    {
      niveau: "5e", titre: "Symétrie axiale et centrale",
      questions: [
        ["Quel est le symétrique d’un point situé sur l’axe de symétrie ?", ["Le centre", "Un autre point de l’axe", "Un point de l’autre côté", "Lui-même"], 3, "Un point de l’axe est sa propre image."],
        ["Combien d’axes de symétrie a un losange qui n’est pas un carré ?", ["4", "2", "1", "0"], 1, "Ses deux diagonales sont ses axes de symétrie."],
        ["Dans une symétrie centrale de centre O, on a OM = 3 cm. Que mesure [MM′] ?", ["3 cm", "9 cm", "6 cm", "1,5 cm"], 2, "O est le milieu de [MM′], donc MM′ = 2 × OM = 6 cm."],
        ["Quelle figure a un centre de symétrie mais aucun axe de symétrie ?", ["Le parallélogramme", "Le rectangle", "Le triangle isocèle", "Le losange"], 0, "Le parallélogramme quelconque a un centre (l’intersection des diagonales) mais aucun axe."],
      ],
    },
    {
      niveau: "5e", titre: "Connaître et reconnaître les parallélogrammes",
      questions: [
        ["Un parallélogramme a des diagonales de même longueur. Quelle figure est-ce ?", ["Un losange", "Un rectangle", "Un carré obligatoirement", "Un trapèze"], 1, "Un parallélogramme aux diagonales égales est un rectangle. Ce ne serait un carré que si elles étaient aussi perpendiculaires."],
        ["Dans un parallélogramme ABCD, l’angle A mesure 70°. Que mesure l’angle B, consécutif ?", ["110°", "70°", "20°", "140°"], 0, "Deux angles consécutifs sont supplémentaires : 180 − 70 = 110°."],
        ["Un parallélogramme a pour base 8 cm, pour hauteur 5 cm et pour côté oblique 6 cm. Quelle est son aire ?", ["48 cm²", "30 cm²", "20 cm²", "40 cm²"], 3, "Aire = base × hauteur = 8 × 5 = 40 cm². Le côté oblique ne sert pas."],
        ["Un quadrilatère a deux côtés opposés parallèles et de même longueur. C’est au moins…", ["un losange", "un rectangle", "un parallélogramme", "un carré"], 2, "Deux côtés opposés à la fois parallèles et égaux suffisent pour démontrer un parallélogramme."],
      ],
    },
    {
      niveau: "5e", titre: "Passer d’une écriture décimale à une écriture fractionnaire",
      questions: [
        ["Comment s’écrit 0,008 sous forme de fraction décimale ?", ["8/100", "80/1000", "8/1000", "0,8/1000"], 2, "Trois chiffres après la virgule : dénominateur 1 000, donc 8/1000."],
        ["Quelle est la fraction irréductible égale à 0,6 ?", ["6/10", "2/3", "1/6", "3/5"], 3, "0,6 = 6/10 ; on simplifie par 2 : 3/5."],
        ["Laquelle de ces fractions a une écriture décimale qui s’arrête ?", ["1/6", "1/8", "1/7", "1/9"], 1, "1/8 = 0,125 : son dénominateur ne contient que des 2. Les autres ont une écriture illimitée."],
        ["Quelle est l’écriture décimale de 1/20 ?", ["0,05", "0,5", "0,2", "0,02"], 0, "1/20 = 5/100 = 0,05."],
      ],
    },
    {
      niveau: "5e", titre: "Calculer avec des nombres décimaux",
      questions: [
        ["Combien vaut 8,4 − 2,75 ?", ["6,35", "5,65", "5,75", "6,65"], 1, "On aligne les virgules : 8,40 − 2,75 = 5,65."],
        ["Combien vaut 0,5 × 0,4 ?", ["0,9", "0,02", "2", "0,2"], 3, "5 × 4 = 20, avec deux décimales au total : 0,20 = 0,2."],
        ["Combien vaut 18 − 2 × (3 + 1) ?", ["64", "16", "10", "12"], 2, "Parenthèses d’abord : 3 + 1 = 4 ; puis la multiplication : 2 × 4 = 8 ; enfin 18 − 8 = 10."],
        ["Combien vaut 6,3 ÷ 0,9 ?", ["7", "0,7", "70", "0,07"], 0, "On multiplie les deux nombres par 10 : 63 ÷ 9 = 7."],
      ],
    },
    {
      niveau: "5e", titre: "Les fractions décimales",
      questions: [
        ["Quelle est l’écriture décimale de 125/10 ?", ["1,25", "12,5", "125,10", "0,125"], 1, "Un zéro au dénominateur : la virgule recule d’un rang, 125/10 = 12,5."],
        ["Dans le nombre 5,308, que vaut le chiffre 8 ?", ["8 dixièmes", "8 centièmes", "8 unités", "8 millièmes"], 3, "Le 8 est au troisième rang après la virgule : 8 millièmes."],
        ["Combien font 2/10 + 35/100 ?", ["37/100", "37/110", "55/100", "55/110"], 2, "On met au même dénominateur : 20/100 + 35/100 = 55/100 (on n’additionne pas les dénominateurs)."],
        ["Quelle fraction décimale est égale à 1/25 ?", ["4/100", "25/100", "1/100", "5/100"], 0, "On multiplie haut et bas par 4 : 1/25 = 4/100 = 0,04."],
      ],
    },
  ],
}
