export default {
  slug: 'maths',
  titreMigration: 'QUESTIONS EN PLUS — MATHS 5e (lot 32)',
  motif: `Quatre questions de plus par quiz : huit suffisaient pour se tester une fois, pas pour réviser sur plusieurs semaines.`,
  chapitres: [
    {
      niveau: "5e", titre: "Les nombres relatifs",
      questions: [
        ["Quel est le plus petit de ces nombres : −2 ; −9 ; 0 ; 3 ?", ["−9", "−2", "0", "3"], 0, "Chez les négatifs, plus la distance à zéro est grande, plus le nombre est petit : −9 est le plus petit."],
        ["Où se place le point de coordonnées (−2 ; 3) ?", ["À droite de l’axe vertical et au-dessus de l’axe horizontal", "À droite de l’axe vertical et en dessous de l’axe horizontal", "À gauche de l’axe vertical et au-dessus de l’axe horizontal", "À gauche de l’axe vertical et en dessous de l’axe horizontal"], 2, "L’abscisse −2 est négative : on va à gauche. L’ordonnée 3 est positive : on monte."],
        ["Quel est le bon rangement dans l’ordre croissant de −4 ; 2 ; −1 ; 0 ?", ["−1 < −4 < 0 < 2", "0 < −1 < −4 < 2", "−4 < 0 < −1 < 2", "−4 < −1 < 0 < 2"], 3, "On range d’abord les négatifs (−4 est plus petit que −1), puis zéro, puis les positifs."],
        ["La mer Morte est à −400 m d’altitude et un lac à −120 m. Lequel est le plus haut ?", ["La mer Morte, car 400 est plus grand que 120", "Le lac, car −120 est plus grand que −400", "Ils sont à la même altitude", "On ne peut pas les comparer"], 1, "Entre deux négatifs, le plus grand est celui qui a la plus petite distance à zéro : −120 > −400."],
      ],
    },
    {
      niveau: "5e", titre: "Additionner et soustraire des nombres relatifs",
      questions: [
        ["Combien vaut (−6) + (+10) ?", ["−16", "−4", "+16", "+4"], 3, "Signes différents : on soustrait les distances à zéro (10 − 6 = 4) et on garde le signe du plus fort, ici +."],
        ["Combien vaut (+3) − (+8) ?", ["−5", "+5", "−11", "+11"], 0, "Soustraire 8, c’est ajouter −8 : 3 + (−8) = −5."],
        ["Combien vaut −4 − (−9) + 2 ?", ["−15", "7", "−7", "11"], 1, "− (−9) devient + 9 : −4 + 9 + 2 = 7."],
        ["Combien vaut 8 + (−3) − (−5) ?", ["0", "6", "10", "16"], 2, "On simplifie les signes : 8 − 3 + 5 = 10."],
      ],
    },
    {
      niveau: "5e", titre: "Les fractions",
      questions: [
        ["Quelle est la forme irréductible de 12/16 ?", ["6/8", "3/4", "2/3", "4/3"], 1, "On divise le numérateur et le dénominateur par 4 : 12/16 = 3/4."],
        ["Laquelle de ces fractions est supérieure à 1 ?", ["7/9", "5/5", "9/8", "3/4"], 2, "Une fraction est supérieure à 1 quand son numérateur dépasse son dénominateur : 9 > 8. Et 5/5 vaut exactement 1."],
        ["Combien font les 2/5 de 35 ?", ["14", "70", "7", "28"], 0, "35 ÷ 5 = 7 (un cinquième), puis 7 × 2 = 14."],
        ["Que vaut la fraction 0/7 ?", ["1", "7", "n’existe pas", "0"], 3, "0/a = 0 pour tout a non nul : on partage zéro en 7 parts, chacune vaut 0."],
      ],
    },
    {
      niveau: "5e", titre: "Comparer, additionner, soustraire des fractions",
      questions: [
        ["Combien font 1/2 + 3/8 ?", ["4/10", "7/8", "4/8", "5/8"], 1, "On réduit au dénominateur 8 : 4/8 + 3/8 = 7/8."],
        ["Comment se comparent 2/3 et 5/8 ?", ["5/8 est plus grand", "Elles sont égales", "2/3 est plus grand", "On ne peut pas les comparer"], 2, "Au dénominateur 24 : 2/3 = 16/24 et 5/8 = 15/24, donc 2/3 > 5/8."],
        ["Combien font 7/4 − 1/2 ?", ["5/2", "6/2", "6/4", "5/4"], 3, "On écrit 1/2 = 2/4 : 7/4 − 2/4 = 5/4."],
        ["Quel dénominateur commun est le plus simple pour 3 et 12 ?", ["12", "36", "15", "24"], 0, "12 est un multiple de 3 : il suffit de multiplier la première fraction par 4."],
      ],
    },
    {
      niveau: "5e", titre: "Division euclidienne et nombres premiers",
      questions: [
        ["Quel est le reste de la division euclidienne de 100 par 7 ?", ["3", "2", "14", "6"], 1, "100 = 7 × 14 + 2, avec un reste 2 inférieur au diviseur 7."],
        ["Lequel de ces nombres est premier ?", ["21", "27", "29", "33"], 2, "29 n’a que deux diviseurs, 1 et 29. 21 = 3 × 7, 27 = 3 × 9 et 33 = 3 × 11."],
        ["Par lequel de ces nombres 84 est-il divisible ?", ["5", "9", "10", "4"], 3, "Les deux derniers chiffres, 84, forment un multiple de 4 (84 = 4 × 21). 84 ne finit ni par 0 ni par 5, et 8 + 4 = 12 n’est pas divisible par 9."],
        ["Quelle est la décomposition de 36 en facteurs premiers ?", ["2² × 3²", "2 × 3 × 6", "6 × 6", "2 × 18"], 0, "36 = 4 × 9 = 2² × 3². Dans une décomposition, tous les facteurs doivent être premiers (6 et 18 ne le sont pas)."],
      ],
    },
    {
      niveau: "5e", titre: "Le calcul littéral",
      questions: [
        ["Comment réduire 4x + 3 − x + 2 ?", ["5x + 5", "3x + 5", "3x + 1", "4x + 5"], 1, "On regroupe les termes en x (4x − x = 3x) et les nombres (3 + 2 = 5)."],
        ["Que vaut 2x² pour x = 3 ?", ["36", "12", "9", "18"], 3, "On calcule d’abord la puissance : 3² = 9, puis 2 × 9 = 18."],
        ["Que donne le développement de 5(a − 2) ?", ["5a − 2", "5a + 10", "5a − 10", "a − 10"], 2, "On multiplie chaque terme par 5 : 5 × a − 5 × 2 = 5a − 10."],
        ["Quelle est la forme factorisée de 6x + 9 ?", ["3(2x + 3)", "6(x + 9)", "3(2x + 9)", "9(x + 1)"], 0, "Le facteur commun est 3 : 6x = 3 × 2x et 9 = 3 × 3, donc 6x + 9 = 3(2x + 3)."],
      ],
    },
    {
      niveau: "5e", titre: "Les statistiques",
      questions: [
        ["Une valeur a un effectif de 6 dans une classe de 24 élèves. Quelle est sa fréquence ?", ["4 %", "25 %", "6 %", "18 %"], 1, "Fréquence = 6 ÷ 24 = 1/4 = 25 %."],
        ["Quel est l’angle du secteur qui représente 20 % dans un diagramme circulaire ?", ["20°", "36°", "72°", "90°"], 2, "Angle = fréquence × 360° = 0,20 × 360° = 72°."],
        ["Quelle est l’étendue de la série 12 ; 5 ; 18 ; 9 ?", ["13", "23", "9", "6"], 0, "Étendue = plus grande valeur − plus petite valeur = 18 − 5 = 13."],
        ["Le nombre de frères et sœurs d’un élève est un caractère…", ["qualitatif", "un effectif", "une fréquence", "quantitatif"], 3, "Il se mesure (on peut le compter) : c’est un caractère quantitatif."],
      ],
    },
    {
      niveau: "5e", titre: "Calculer une moyenne et une moyenne pondérée",
      questions: [
        ["Quelle est la moyenne des notes 12, 14, 10 et 16 ?", ["14", "12", "13", "52"], 2, "(12 + 14 + 10 + 16) ÷ 4 = 52 ÷ 4 = 13. Le nombre 52 n’est que la somme."],
        ["Une élève a 15 avec le coefficient 3 et 9 avec le coefficient 1. Quelle est sa moyenne ?", ["12", "13,5", "14", "24"], 1, "(15 × 3 + 9 × 1) ÷ (3 + 1) = 54 ÷ 4 = 13,5."],
        ["Une moyenne de 12 sur 5 notes signifie que la somme des notes vaut…", ["60", "17", "2,4", "5"], 0, "Somme = moyenne × nombre de valeurs = 12 × 5 = 60."],
        ["Un élève trouve 17 de moyenne pour des notes comprises entre 8 et 15. Que conclure ?", ["C’est possible avec beaucoup de notes", "C’est possible si on pondère", "C’est possible selon les coefficients", "C’est une erreur : elle est entre 8 et 15"], 3, "Une moyenne est toujours comprise entre la plus petite et la plus grande valeur de la série."],
      ],
    },
    {
      niveau: "5e", titre: "Statistiques à l’aide d’un tableur",
      questions: [
        ["Quelle formule calcule la somme des cellules de B2 à B10 ?", ["=B2:B10", "=SOMME(B2:B10)", "=NB(B2:B10)", "SOMME(B2:B10)"], 1, "Une formule commence toujours par =, et SOMME additionne une plage."],
        ["La formule =B2/$B$12 est recopiée une ligne plus bas. Que devient-elle ?", ["=B3/B13", "=B2/$B$12", "=B3/$B$12", "=B3/$B$13"], 2, "B2 est une référence relative : elle devient B3. $B$12 est absolue : elle reste figée."],
        ["Quelle formule donne la plus petite valeur d’une plage A1:A20 ?", ["=MIN(A1:A20)", "=MOYENNE(A1:A20)", "=NB(A1:A20)", "=MAX(A1:A20)"], 0, "MIN renvoie la plus petite valeur, MAX la plus grande ; leur différence donne l’étendue."],
        ["Que renvoie =NB(A1:A20) si la plage contient 20 nombres ?", ["La somme des nombres", "La moyenne", "Le plus grand nombre", "20"], 3, "NB compte le nombre de valeurs de la plage : ici 20."],
      ],
    },
    {
      niveau: "5e", titre: "Les probabilités",
      questions: [
        ["Une urne contient 4 boules rouges et 6 bleues. Quelle est la probabilité de tirer une boule bleue ?", ["2/5", "1/2", "6/4", "3/5"], 3, "6 issues favorables sur 10 possibles : 6/10 = 3/5."],
        ["Quelle est la probabilité d’obtenir un multiple de 3 avec un dé à six faces ?", ["1/6", "1/3", "1/2", "2/3"], 1, "Les multiples de 3 sont 3 et 6 : 2 issues favorables sur 6, soit 2/6 = 1/3."],
        ["Un événement A a une probabilité de 0,3. Quelle est la probabilité de l’événement contraire ?", ["0,3", "1,3", "0,7", "−0,3"], 2, "P(non A) = 1 − P(A) = 1 − 0,3 = 0,7. Une probabilité ne dépasse jamais 1."],
        ["Quelle est la probabilité d’un événement impossible ?", ["0", "1", "0,5", "−1"], 0, "Un événement impossible ne se produit jamais : sa probabilité est 0 (1 pour un événement certain)."],
      ],
    },
    {
      niveau: "5e", titre: "Calculer une quatrième proportionnelle",
      questions: [
        ["6 stylos coûtent 9 €. Combien coûtent 10 stylos, au même prix ?", ["13,5 €", "15 €", "60 €", "12 €"], 1, "Un stylo coûte 9 ÷ 6 = 1,5 €, donc 10 stylos coûtent 10 × 1,5 = 15 €."],
        ["Quelle valeur de x vérifie 3/7 = x/21 ?", ["49", "1", "63", "9"], 3, "Produit en croix : 7 × x = 3 × 21 = 63, donc x = 63 ÷ 7 = 9."],
        ["Une voiture roule 150 km en 2 h. À la même vitesse, quelle distance en 5 h ?", ["300 km", "750 km", "375 km", "450 km"], 2, "Elle roule 150 ÷ 2 = 75 km par heure, donc 5 × 75 = 375 km."],
        ["Laquelle de ces situations n’est PAS proportionnelle ?", ["L’aire d’un carré selon son côté", "Le prix de pommes selon leur masse", "La distance à vitesse constante selon le temps", "Le périmètre d’un carré selon son côté"], 0, "Si le côté double, l’aire est multipliée par 4 : ce n’est pas proportionnel (le périmètre, lui, double)."],
      ],
    },
    {
      niveau: "5e", titre: "Pourcentages : définition et application",
      questions: [
        ["Un article à 60 € baisse de 25 %. Quel est son nouveau prix ?", ["15 €", "35 €", "45 €", "75 €"], 2, "25 % de 60 = 15 €, donc 60 − 15 = 45 € (ou 60 × 0,75)."],
        ["Un article à 80 € augmente de 5 %. Quel est son nouveau prix ?", ["85 €", "84 €", "80,5 €", "4 €"], 1, "80 × 1,05 = 84 €. Les 4 € sont la hausse, pas le nouveau prix."],
        ["Par quel coefficient multiplie-t-on pour diminuer de 30 % ?", ["0,7", "0,3", "1,3", "30"], 0, "Diminuer de 30 %, c’est garder 70 % : on multiplie par 1 − 0,30 = 0,7."],
        ["12 € représentent 15 % d’un prix. Quel est ce prix ?", ["1,8 €", "180 €", "8 €", "80 €"], 3, "Le tout se trouve en divisant : 12 ÷ 0,15 = 80 €."],
      ],
    },
    {
      niveau: "5e", titre: "Proportionnalité : échelles et ratios",
      questions: [
        ["Sur une carte au 1/50 000, deux villes sont distantes de 4 cm. Quelle est la distance réelle ?", ["200 m", "2 km", "20 km", "20 m"], 1, "4 × 50 000 = 200 000 cm = 2 000 m = 2 km."],
        ["Un chemin de 3 km est dessiné sur un plan au 1/100 000. Quelle longueur a-t-il sur le plan ?", ["3 cm", "30 cm", "0,3 cm", "300 cm"], 0, "3 km = 300 000 cm, et 300 000 ÷ 100 000 = 3 cm."],
        ["On partage 90 € selon le ratio 1 : 2. Quelles sont les deux parts ?", ["20 € et 70 €", "45 € et 45 €", "60 € et 30 €", "30 € et 60 €"], 3, "3 parts en tout : 90 ÷ 3 = 30 € la part, donc 30 € et 60 €."],
        ["Dans le ratio 3 : 2, quelle fraction du total reçoit le second ?", ["2/3", "3/5", "2/5", "1/2"], 2, "Le total est 3 + 2 = 5 parts : le second en reçoit 2 sur 5, soit 2/5."],
      ],
    },
  ],
}
