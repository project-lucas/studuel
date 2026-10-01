// Mathématiques — Troisième : LES COMPLÉMENTS (14 fiches).
//
// POURQUOI. La 3e n'avait que 14 fiches (maths-3e.mjs, migration 294) contre 36
// en 4e, alors que c'est l'année du brevet. Confronté au programme du cycle 4
// EN VIGUEUR en 3e en 2026-2027 — celui de 2020 (BO n° 31 du 30 juillet 2020) :
// le nouveau programme du cycle 4 (BO du 5 mars 2026) n'entre en 3e qu'à la
// rentrée 2028 — et aux attendus du brevet (épreuve refondue : partie
// automatismes de 20 min sans calculatrice, note de service du 4 septembre
// 2025), il manquait : Pythagore, les transformations du plan, l'algorithmique,
// les pourcentages et évolutions, les grandeurs composées, le repérage, les
// identités remarquables approfondies, les inéquations, la racine carrée,
// l'arithmétique (division euclidienne, diviseurs communs), la lecture de
// graphiques et du tableur, le formulaire des aires et volumes,
// l'agrandissement-réduction et la méthode de l'épreuve.
//
// Les statistiques (moyenne, médiane, étendue) sont déjà couvertes par
// « Caractéristiques d’une série statistique » : pas de doublon.
//
// LES AXES. On reprend ceux de maths-3e.mjs et on ajoute deux thèmes OFFICIELS
// du cycle 4 que la 3e n'avait pas encore : « Grandeurs et mesures » (déjà
// utilisé en 4e et 6e) et « Algorithmique et programmation ». La fiche de
// méthode est rangée sous « Réussir le brevet ».
//
// ⚠️ PAS DE LATEX (convention de maths-3e.mjs) : formules en texte.
// ⚠️ Toujours générer avec `--modules maths-3e-complements`, jamais `--slugs maths`.

export default {
  slug: 'maths',
  nom: 'Maths',

  titreMigration: 'MATHS 3e — LES COMPLÉMENTS DU PROGRAMME ET DU BREVET (14 fiches)',

  motif: `CONSTAT : la Troisième n'avait que 14 fiches de maths, contre 36 en
Quatrième, alors que c'est l'année du brevet. Il manquait des pans entiers du
programme du cycle 4 (Pythagore, transformations, algorithmique et Scratch,
grandeurs composées, repérage, racine carrée, inéquations, arithmétique,
tableur, aires et volumes) et rien ne préparait à la nouvelle épreuve, avec sa
partie automatismes sans calculatrice. Cette migration AJOUTE 14 fiches, après
les 14 existantes, sans rien retirer.`,

  blocs: [
    {
      niveaux: ['3e'],
      positionDepart: 15,
      chapitres: [
        // ===================================================================
        // 1. Pythagore
        // ===================================================================
        {
          titre: 'Le théorème de Pythagore et sa réciproque',
          axe: 'Espace et géométrie',
          lecon: {
            titre: 'Calculer une longueur, prouver un angle droit',
            cours: `Vu en 4e, le théorème de Pythagore revient dans presque tous les sujets de brevet : pour calculer une longueur, pour prouver qu'un triangle est rectangle, ou comme première étape avant Thalès ou la trigonométrie.

## Le théorème
Si un triangle ABC est **rectangle en A**, alors le carré de l'hypoténuse est égal à la somme des carrés des deux autres côtés :

**BC² = AB² + AC²**

L'**hypoténuse** est le côté opposé à l'angle droit : c'est toujours le **plus long** des trois.

## Calculer une longueur
| Ce qu'on cherche | Le calcul | Exemple |
| L'**hypoténuse** | On **additionne** les carrés | AB = 6, AC = 8 : BC² = 36 + 64 = 100, donc BC = **10** |
| Un **autre côté** | On **soustrait** les carrés | BC = 13, AB = 5 : AC² = 169 − 25 = 144, donc AC = **12** |

> On termine toujours par une racine carrée : BC = √100. Si elle ne tombe pas juste, on donne la valeur exacte (√50) ou l'arrondi demandé (≈ 7,1).

## La réciproque : prouver qu'un triangle est rectangle
1. Repérer le **plus long** côté.
2. Calculer **son carré** d'un côté.
3. Calculer la **somme des carrés** des deux autres de l'autre côté.
4. Comparer.

| Le résultat | La conclusion | La propriété utilisée |
| Égalité | Le triangle **est** rectangle, au sommet opposé au plus long côté | La **réciproque** |
| Différence | Le triangle **n'est pas** rectangle | La **contraposée** |

Exemple travaillé : un triangle a pour côtés 7,5 cm, 10 cm et 12,5 cm.
- 12,5² = 156,25
- 7,5² + 10² = 56,25 + 100 = 156,25

Les deux résultats sont égaux : d'après la réciproque du théorème de Pythagore, le triangle est rectangle.

> Ne jamais écrire l'égalité AVANT de l'avoir vérifiée : on calcule les deux membres séparément, puis on compare.

## Les triplets à connaître
3, 4, 5 — 5, 12, 13 — 8, 15, 17, et leurs multiples (6, 8, 10 ; 9, 12, 15). Les reconnaître fait gagner du temps, notamment dans la partie automatismes.

## Pythagore dans les situations du brevet
| La situation | Le triangle rectangle caché |
| La **diagonale d'un carré** de côté 5 | d² = 5² + 5² = 50, d ≈ 7,07 |
| Une **échelle** contre un mur | Le mur, le sol et l'échelle (hypoténuse) |
| La **grande diagonale d'un pavé** 3 × 4 × 12 | D'abord la diagonale de la base : 5 ; puis 5² + 12² = 169, soit **13** |

> Le théorème ne s'applique qu'aux triangles **rectangles**. Il faut écrire cette hypothèse dans la copie avant tout calcul.`,
          },
          questions: [
            ['ABC est rectangle en A. Quelle égalité est vraie ?', ['AB² = AC² + BC²', 'AC² = AB² + BC²', 'BC² = AB² + AC²', 'BC = AB + AC'], 2, 'Le côté opposé à l’angle droit, ici [BC], est l’hypoténuse : c’est son carré qui vaut la somme des deux autres.'],
            ['ABC est rectangle en A avec AB = 6 cm et AC = 8 cm. Combien mesure BC ?', ['14 cm', '10 cm', '48 cm', '√14 cm'], 1, 'BC² = 36 + 64 = 100, donc BC = √100 = 10 cm.'],
            ['Dans un triangle rectangle, l’hypoténuse mesure 13 cm et un côté 5 cm. Combien mesure le troisième côté ?', ['8 cm', '√194 cm', '12 cm', '18 cm'], 2, 'Pour un côté de l’angle droit, on soustrait : 169 − 25 = 144, et √144 = 12.'],
            ['À quoi sert la réciproque du théorème de Pythagore ?', ['À calculer une longueur', 'À calculer un angle', 'À prouver que deux droites sont parallèles', 'À prouver qu’un triangle est rectangle'], 3, 'Si le carré du plus long côté égale la somme des carrés des deux autres, le triangle est rectangle.'],
            ['Un triangle a pour côtés 7,5 cm, 10 cm et 12,5 cm. Est-il rectangle ?', ['Non, car 7,5 + 10 est différent de 12,5', 'Oui, car 12,5² = 7,5² + 10² = 156,25', 'Oui, car tous ses côtés sont des décimaux', 'On ne peut pas le savoir sans rapporteur'], 1, 'On compare 12,5² = 156,25 et 56,25 + 100 = 156,25 : l’égalité est vérifiée.'],
            ['Un triangle a pour côtés 5, 6 et 8 : 8² = 64 mais 5² + 6² = 61. Quelle propriété permet de conclure qu’il n’est pas rectangle ?', ['La réciproque de Pythagore', 'La contraposée de Pythagore', 'Le théorème de Thalès', 'La trigonométrie'], 1, 'Quand l’égalité n’est pas vérifiée, c’est la contraposée qui prouve que le triangle n’est pas rectangle.'],
            ['Pour tester si un triangle est rectangle, on compare le carré du plus long côté à la somme des carrés des deux autres.', ['Vrai', 'Faux'], 0, 'Seul le plus long côté peut être l’hypoténuse : c’est lui qu’on isole.'],
            ['Un pavé droit mesure 3 cm × 4 cm × 12 cm. Combien mesure sa grande diagonale ?', ['19 cm', '12 cm', '13 cm', '15 cm'], 2, 'La diagonale de la base vaut 5 cm (3, 4, 5), puis 5² + 12² = 169, soit 13 cm.'],
            ['Quelle est la longueur de la diagonale d’un carré de côté 5 cm ?', ['10 cm', '25 cm', '6,5 cm environ', '7,07 cm environ'], 3, 'd² = 5² + 5² = 50, donc d = √50 ≈ 7,07 cm.'],
            ['Une échelle de 5 m est posée contre un mur vertical, son pied à 1,4 m du mur. À quelle hauteur touche-t-elle le mur ?', ['4,8 m', '3,6 m', '5,2 m', '6,4 m'], 0, 'L’échelle est l’hypoténuse : h² = 25 − 1,96 = 23,04, donc h = 4,8 m.'],
            ['Le théorème de Pythagore s’applique à tous les triangles.', ['Vrai', 'Faux'], 1, 'Il exige un triangle rectangle : c’est l’hypothèse à écrire avant tout calcul.'],
            ['Lequel de ces triplets correspond aux côtés d’un triangle rectangle ?', ['6, 8, 11', '4, 5, 6', '5, 11, 13', '8, 15, 17'], 3, '8² + 15² = 64 + 225 = 289 = 17².'],
          ],
        },

        // ===================================================================
        // 2. Transformations du plan
        // ===================================================================
        {
          titre: 'Transformations du plan : symétries, translation, rotation',
          axe: 'Espace et géométrie',
          lecon: {
            titre: 'Déplacer une figure sans la déformer, frises et pavages',
            cours: `Une transformation du plan associe à chaque point M un point image M′. Au brevet, il faut savoir reconnaître la transformation qui fait passer d'un motif à un autre, et construire une image.

## Les quatre transformations qui gardent la taille
| La transformation | L'image mentale | Ce qui la définit |
| **Symétrie axiale** | Un pliage | Un **axe** : c'est la médiatrice de [MM′] |
| **Symétrie centrale** | Un demi-tour | Un **centre** O : c'est le milieu de [MM′] |
| **Translation** | Un glissement | Une direction, un sens et une longueur (A vers B) |
| **Rotation** | Un tour autour d'un point | Un **centre**, un **angle** et un **sens** |

## Ce qu'elles conservent
Ces quatre transformations sont des **isométries** : elles conservent les **longueurs**, les **angles**, les **aires**, l'**alignement** et le **parallélisme**. La figure image est superposable à la figure de départ.

| La transformation | L'orientation de la figure |
| Symétrie axiale | **Retournée** : l'image est vue « dans un miroir » |
| Symétrie centrale, translation, rotation | **Conservée** : on peut faire glisser et tourner la figure sur la feuille pour la superposer |

> L'homothétie, elle, change la taille (longueurs multipliées par k) : ce n'est pas une isométrie, sauf si k = 1 ou k = −1.

## Construire une image
1. **Translation** qui transforme A en B : pour un point C, son image D est telle que **ABDC est un parallélogramme**.
2. **Rotation** de centre O, d'angle 90°, sens inverse des aiguilles d'une montre : OM′ = OM et l'angle MOM′ mesure 90°, tourné dans le bon sens. On utilise compas et rapporteur.
3. **Symétrie centrale** : c'est une rotation de **180°** ; O est le milieu de [MM′].

## Frises et pavages
| L'objet | Sa construction |
| Une **frise** | Un motif répété par **translation dans une seule direction** (bande) |
| Un **pavage** | Le plan couvert **sans trou ni chevauchement** : translations dans deux directions, souvent avec rotations ou symétries |

Exemple travaillé : un hexagone régulier est invariant par une rotation de centre son centre et d'angle **360° ÷ 6 = 60°** (et ses multiples). Dans un pavage d'hexagones, on passe d'une case à la voisine par une **translation**.

> Pour reconnaître la transformation : la figure est-elle retournée ? (symétrie axiale) A-t-elle tourné ? (rotation ou symétrie centrale) A-t-elle seulement glissé ? (translation)

## Au brevet
Les exercices de transformations s'appuient souvent sur un motif de Scratch ou une rosace : on demande quelle transformation fait passer du motif 1 au motif 2, ou l'angle d'une rotation. Il faut nommer **tous** les éléments : l'axe, le centre, l'angle et le sens, ou le point de départ et le point d'arrivée de la translation.`,
          },
          questions: [
            ['Quelle transformation fait glisser une figure sans la tourner ni la retourner ?', ['La symétrie axiale', 'La translation', 'La rotation de 90°', 'La symétrie centrale'], 1, 'La translation est un glissement : direction, sens et longueur fixés.'],
            ['À quelle transformation correspond une rotation de 180° ?', ['Une symétrie axiale', 'Une translation', 'Une symétrie centrale', 'Une homothétie de rapport 2'], 2, 'Un demi-tour autour de O : c’est la symétrie de centre O.'],
            ['Laquelle de ces transformations retourne la figure, comme un miroir ?', ['La symétrie axiale', 'La translation', 'La rotation', 'La symétrie centrale'], 0, 'Seule la symétrie axiale inverse l’orientation de la figure.'],
            ['M′ est l’image de M par la symétrie de centre O. Que peut-on dire de O ?', ['O est sur la médiatrice de [MM′] seulement', 'O est le milieu de [MM′]', 'O est confondu avec M', 'OM′ = 2 × OM'], 1, 'Dans une symétrie centrale, le centre est le milieu du segment qui joint un point à son image.'],
            ['La translation qui transforme A en B transforme C en D. Quelle figure est un parallélogramme ?', ['ABCD', 'ACBD', 'ABDC', 'ADBC'], 2, 'Les segments [AB] et [CD] sont parallèles, de même longueur et de même sens : ABDC est un parallélogramme.'],
            ['Qu’est-ce qu’une rotation ne conserve PAS en général ?', ['Les longueurs', 'Les angles', 'Les aires', 'La direction des droites'], 3, 'Une rotation fait tourner les droites : leur direction change, sauf pour un angle de 180°.'],
            ['Comment obtient-on une frise ?', ['En répétant un motif par translation dans une seule direction', 'En agrandissant un motif', 'En faisant tourner un motif autour d’un point', 'En coloriant un pavage'], 0, 'Une frise est une bande : le motif se répète par translation dans une direction.'],
            ['Quel est le plus petit angle de rotation qui laisse un hexagone régulier invariant autour de son centre ?', ['30°', '45°', '60°', '120°'], 2, '360° ÷ 6 = 60° : chaque sommet vient sur le suivant.'],
            ['M′ est l’image de M par une symétrie axiale. Qu’est l’axe pour le segment [MM′] ?', ['Sa médiane', 'Sa médiatrice', 'Une droite parallèle', 'Sa diagonale'], 1, 'L’axe coupe [MM′] en son milieu, perpendiculairement : c’est sa médiatrice.'],
            ['Une symétrie, une translation ou une rotation conserve les aires.', ['Vrai', 'Faux'], 0, 'Ce sont des isométries : la figure image est superposable, donc de même aire.'],
            ['M′ est l’image de M par la rotation de centre O et d’angle 90°. Que sait-on ?', ['OM′ = 2 × OM', 'M, O et M′ sont alignés', 'O est le milieu de [MM′]', 'OM′ = OM et l’angle MOM′ mesure 90°'], 3, 'Une rotation conserve la distance au centre et fait tourner de l’angle donné.'],
            ['Une homothétie de rapport 2 conserve les longueurs.', ['Vrai', 'Faux'], 1, 'Elle les multiplie par 2 : ce n’est pas une isométrie.'],
          ],
        },

        // ===================================================================
        // 3. Algorithmique et programmation
        // ===================================================================
        {
          titre: 'Programmer avec Scratch : boucles, conditions, variables',
          axe: 'Algorithmique et programmation',
          lecon: {
            titre: 'Lire, compléter et écrire un script',
            cours: `Au brevet, un exercice sur Scratch tombe presque chaque année : lire un script, prédire ce qu'il affiche ou dessine, le compléter. Quatre notions suffisent.

## Les briques d'un programme
| La notion | Le bloc Scratch | Ce qu'il fait |
| Un **événement** | « quand le drapeau vert est cliqué » | Déclenche le script |
| Une **variable** | « mettre x à 3 », « ajouter 2 à x » | Une case mémoire nommée dont la valeur peut changer |
| Une **boucle** | « répéter 4 fois », « répéter jusqu'à », « répéter indéfiniment » | Répète les blocs placés **à l'intérieur** |
| Une **condition** | « si … alors … sinon » | Exécute une partie ou l'autre selon un test |

## Suivre une variable pas à pas
Script : mettre x à 3, puis répéter 4 fois « ajouter 2 à x ».

| Le passage | La valeur de x |
| Départ | 3 |
| 1er tour | 5 |
| 2e tour | 7 |
| 3e tour | 9 |
| 4e tour | **11** |

> La méthode la plus sûre : un tableau, une ligne par tour de boucle. On ne fait jamais le calcul « de tête » d'un coup.

## Les conditions
Script : mettre n à 5 ; si n > 3 alors dire « grand », sinon dire « petit ». Le test n > 3 est vrai, donc le lutin dit **grand**.

La boucle « répéter jusqu'à » s'arrête dès que sa condition devient **vraie** : elle peut ne jamais tourner, ou tourner indéfiniment si la condition n'est jamais atteinte.

## Dessiner avec le stylo
| Le repère de la scène | Sa valeur |
| Le centre | (0 ; 0) |
| Abscisses | de −240 à 240 |
| Ordonnées | de −180 à 180 |
| « s'orienter à 90 » | Vers la **droite** (0 : vers le haut) |

Pour un polygone régulier à n côtés : répéter n fois « avancer de L », « tourner de 360 ÷ n degrés ».

| La figure | L'angle dont on tourne |
| Triangle équilatéral | **120°** (et non 60°) |
| Carré | 90° |
| Hexagone régulier | 60° |

> Le lutin tourne de l'**angle extérieur** : c'est 180° moins l'angle intérieur de la figure.

## Les blocs personnalisés
« Créer un bloc » (catégorie Mes blocs) permet de nommer une suite d'instructions, par exemple « carré », avec un **paramètre** (la longueur du côté). On l'appelle ensuite autant de fois que nécessaire : le script principal devient court et lisible.

## Pièges fréquents
1. Un bloc placé **après** la boucle n'est exécuté qu'**une** fois.
2. « mettre x à 5 » remplace la valeur ; « ajouter 5 à x » l'augmente.
3. Plusieurs lutins peuvent agir **en même temps** : chaque script a son propre drapeau vert.`,
          },
          questions: [
            ['Quel script trace un carré de côté 50 ?', ['Répéter 4 fois : avancer de 50, tourner de 90°', 'Répéter 4 fois : avancer de 50, tourner de 45°', 'Répéter 2 fois : avancer de 50, tourner de 90°', 'Avancer de 200, tourner de 90°'], 0, 'Quatre côtés, et un quart de tour après chacun.'],
            ['Pour tracer un triangle équilatéral, de combien le lutin doit-il tourner après chaque côté ?', ['60°', '120°', '180°', '90°'], 1, 'Il tourne de l’angle extérieur : 180° − 60° = 120°, soit 360° ÷ 3.'],
            ['Pour tracer un hexagone régulier, de combien le lutin tourne-t-il à chaque sommet ?', ['120°', '30°', '90°', '60°'], 3, '360° ÷ 6 = 60°.'],
            ['On met x à 3, puis on répète 4 fois « ajouter 2 à x ». Que vaut x à la fin ?', ['9', '11', '12', '8'], 1, '3 + 4 × 2 = 11 : un tableau tour par tour évite l’erreur.'],
            ['Qu’est-ce qu’une variable en programmation ?', ['Un bloc qui fait bouger le lutin', 'Une boucle infinie', 'Une case mémoire nommée dont la valeur peut changer', 'Un message envoyé à un autre lutin'], 2, 'On la crée, on lui donne une valeur, puis on la modifie au fil du programme.'],
            ['Comment s’appelle le bloc « si … alors … sinon » ?', ['Une boucle', 'Une instruction conditionnelle', 'Un événement', 'Une variable'], 1, 'Il teste une condition et choisit entre deux suites d’instructions.'],
            ['Quel est l’intérêt d’un bloc personnalisé ?', ['Réutiliser une suite d’instructions, avec des paramètres', 'Accélérer l’ordinateur', 'Changer le costume du lutin', 'Effacer la scène'], 0, 'On écrit « carré » une fois, on l’appelle partout : le script est plus court et plus lisible.'],
            ['Dans Scratch, vers où pointe un lutin orienté à 90 ?', ['Vers le haut', 'Vers le bas', 'Vers la gauche', 'Vers la droite'], 3, 'L’orientation 0 est vers le haut, 90 vers la droite.'],
            ['Quelles sont les coordonnées du centre de la scène de Scratch ?', ['(240 ; 180)', '(0 ; 0)', '(−240 ; −180)', '(100 ; 100)'], 1, 'Les abscisses vont de −240 à 240, les ordonnées de −180 à 180 : le centre est l’origine.'],
            ['Quand la boucle « répéter jusqu’à » s’arrête-t-elle ?', ['Après 10 tours', 'Quand sa condition devient fausse', 'Quand sa condition devient vraie', 'Jamais'], 2, 'Elle répète TANT QUE la condition n’est pas remplie, et s’arrête dès qu’elle l’est.'],
            ['On met n à 5 ; si n > 3 alors le lutin dit « grand », sinon « petit ». Que dit-il ?', ['Petit', 'Rien', '5', 'Grand'], 3, 'Le test 5 > 3 est vrai : c’est la branche « alors » qui s’exécute.'],
            ['Un bloc placé juste APRÈS une boucle « répéter 10 fois » est exécuté 10 fois.', ['Vrai', 'Faux'], 1, 'Seuls les blocs placés À L’INTÉRIEUR de la boucle sont répétés.'],
          ],
        },

        // ===================================================================
        // 4. Pourcentages
        // ===================================================================
        {
          titre: 'Pourcentages et évolutions',
          axe: 'Organisation et gestion de données – Fonctions',
          lecon: {
            titre: 'Appliquer, calculer, remonter à la valeur de départ',
            cours: `Soldes, TVA, population, résultats d'élection : les pourcentages sont partout, au brevet comme dans la vie. Tout repose sur la **proportionnalité** et sur un seul outil, le **coefficient multiplicateur**.

## Les trois calculs de base
| Ce qu'on cherche | Le calcul | Exemple |
| **t %** d'une quantité | quantité × t ÷ 100 | 30 % de 250 = 250 × 0,3 = **75** |
| La **part** en pourcentage | partie ÷ total × 100 | 18 filles sur 24 élèves : 18 ÷ 24 = 0,75, soit **75 %** |
| Le **taux d'évolution** | (valeur d'arrivée − valeur de départ) ÷ valeur de départ | De 1 200 à 1 500 : 300 ÷ 1 200 = 0,25, soit **+25 %** |

> On divise toujours par la valeur de **départ**. De 50 à 40, la baisse est de 10 ÷ 50 = 20 %, pas de 10 ÷ 40 = 25 %.

## Le coefficient multiplicateur
| L'évolution | Le coefficient | Exemple |
| Hausse de t % | 1 + t ÷ 100 | +20 % : × **1,2** |
| Baisse de t % | 1 − t ÷ 100 | −25 % : × **0,75** ; −8 % : × **0,92** |

Exemple travaillé : un jean à 80 € est soldé à −25 %. Nouveau prix : 80 × 0,75 = **60 €**.

## Remonter à la valeur de départ
On **divise** par le coefficient.

| La situation | Le calcul |
| Après une hausse de 20 %, un prix vaut 96 € | 96 ÷ 1,2 = **80 €** |
| Un article coûte 120 € TTC, avec une TVA de 20 % | 120 ÷ 1,2 = **100 € HT** |

> L'erreur classique : retirer 20 % de 96 € (on trouve 76,80 €). Les 20 % portaient sur l'ancien prix, pas sur le nouveau.

## Les évolutions successives
Les coefficients se **multiplient**, les pourcentages ne s'additionnent pas.

| L'enchaînement | Le calcul | Le bilan |
| +50 % puis −50 % | 1,5 × 0,5 = 0,75 | **−25 %** |
| +25 % puis −20 % | 1,25 × 0,8 = 1 | Retour au départ |

L'**évolution réciproque** d'une hausse de 25 % est donc une baisse de 20 % : il faut 1 ÷ 1,25 = 0,8.

## Un pourcentage de pourcentage
Dans un collège, 60 % des élèves sont demi-pensionnaires et 25 % d'entre eux choisissent le menu végétarien. Part des élèves du collège : 0,6 × 0,25 = 0,15, soit **15 %**.

## La méthode en résumé
1. Repérer la valeur de **référence** (celle qui fait 100 %).
2. Écrire le **coefficient** multiplicateur.
3. **Multiplier** pour avancer, **diviser** pour remonter.
4. Vérifier l'ordre de grandeur : une hausse doit donner plus, une baisse moins.`,
          },
          questions: [
            ['Combien vaut 30 % de 250 ?', ['83,3', '7,5', '75', '220'], 2, '250 × 0,3 = 75.'],
            ['Une classe compte 18 filles sur 24 élèves. Quel pourcentage de filles ?', ['18 %', '75 %', '66 %', '133 %'], 1, '18 ÷ 24 = 0,75, soit 75 %.'],
            ['Un jean à 80 € est soldé à −25 %. Quel est son nouveau prix ?', ['55 €', '60 €', '64 €', '100 €'], 1, '80 × 0,75 = 60 €.'],
            ['Par quel coefficient multiplie-t-on pour une baisse de 8 % ?', ['0,08', '1,08', '0,8', '0,92'], 3, '1 − 0,08 = 0,92.'],
            ['Une population passe de 1 200 à 1 500 habitants. Quel est le taux d’évolution ?', ['+25 %', '+20 %', '+300 %', '+30 %'], 0, '(1 500 − 1 200) ÷ 1 200 = 0,25.'],
            ['Après une hausse de 20 %, un prix vaut 96 €. Quel était le prix de départ ?', ['76,80 €', '76 €', '115,20 €', '80 €'], 3, 'On divise par le coefficient : 96 ÷ 1,2 = 80 €.'],
            ['Un prix augmente de 25 %. Quelle baisse le ramène à sa valeur de départ ?', ['−25 %', '−20 %', '−30 %', '−12,5 %'], 1, 'Il faut multiplier par 1 ÷ 1,25 = 0,8, soit une baisse de 20 %.'],
            ['Un prix passe de 50 € à 40 €. Quel est le pourcentage de baisse ?', ['25 %', '10 %', '20 %', '40 %'], 2, 'On divise par la valeur de départ : 10 ÷ 50 = 0,2.'],
            ['Une hausse de 50 % suivie d’une baisse de 50 % ramène au prix de départ.', ['Vrai', 'Faux'], 1, '1,5 × 0,5 = 0,75 : le prix a baissé de 25 %.'],
            ['Comment calcule-t-on un taux d’évolution ?', ['(arrivée − départ) ÷ départ', '(arrivée − départ) ÷ arrivée', 'arrivée ÷ départ', 'départ − arrivée'], 0, 'La référence est toujours la valeur de départ.'],
            ['60 % des élèves sont demi-pensionnaires, et 25 % d’entre eux mangent végétarien. Quelle part des élèves du collège mange végétarien ?', ['35 %', '85 %', '15 %', '25 %'], 2, 'Un pourcentage de pourcentage se multiplie : 0,6 × 0,25 = 0,15.'],
            ['Un article coûte 120 € TTC avec une TVA de 20 %. Quel est son prix hors taxes ?', ['96 €', '144 €', '24 €', '100 €'], 3, 'TTC = HT × 1,2, donc HT = 120 ÷ 1,2 = 100 €.'],
          ],
        },

        // ===================================================================
        // 5. Grandeurs composées
        // ===================================================================
        {
          titre: 'Grandeurs composées : vitesse, débit, masse volumique',
          axe: 'Grandeurs et mesures',
          lecon: {
            titre: 'Calculer et convertir des grandeurs fabriquées avec d’autres',
            cours: `Une vitesse en km/h, un débit en L/min, une énergie en kWh : ces grandeurs sont fabriquées à partir de deux autres. Au brevet, elles demandent surtout de bien **convertir** avant de calculer.

## Deux familles
| La famille | Sa construction | Exemples |
| **Grandeur quotient** | Une grandeur **divisée** par une autre | Vitesse (km/h), débit (L/min), masse volumique (g/cm³), densité de population (hab/km²), consommation (L/100 km) |
| **Grandeur produit** | Une grandeur **multipliée** par une autre | Aire (m²), énergie (kWh = kW × h) |

## La vitesse
**v = d ÷ t**, donc **d = v × t** et **t = d ÷ v**.

Exemple travaillé : 150 km parcourus en 1 h 15 min.
1. Convertir la durée en heures décimales : 15 min = 15 ÷ 60 = 0,25 h, donc 1 h 15 = **1,25 h**.
2. v = 150 ÷ 1,25 = **120 km/h**.

> Le piège le plus fréquent : écrire 1 h 15 = 1,15 h. Une heure compte 60 minutes, pas 100.

| Les minutes | En heures |
| 15 min | 0,25 h |
| 20 min | 1/3 h |
| 30 min | 0,5 h |
| 40 min | 2/3 h |
| 0,3 h | 18 min |

## Convertir une vitesse
1 km/h = 1 000 m ÷ 3 600 s. Pour passer des km/h aux m/s, on **divise par 3,6** : 72 km/h = **20 m/s**. Dans l'autre sens, on multiplie par 3,6.

## Le débit
Débit = volume ÷ durée. Un robinet de 12 L/min remplit une baignoire de 300 L en 300 ÷ 12 = **25 min**. En une heure, il débite 12 × 60 = 720 L.

## La masse volumique
**ρ = m ÷ V**, donc m = ρ × V.

| La matière | Sa masse volumique |
| Eau | 1 kg/L = 1 g/cm³ = 1 000 kg/m³ |
| Fer | environ 7,8 g/cm³ |

Un bloc de fer de 100 cm³ pèse 7,8 × 100 = **780 g**.

## L'énergie, une grandeur produit
Énergie = puissance × durée. Un radiateur de 2 000 W = 2 kW allumé 3 h consomme 2 × 3 = **6 kWh**.

## Les conversions de volume à connaître
| L'équivalence | |
| 1 m³ | 1 000 L |
| 1 dm³ | 1 L |
| 1 cm³ | 1 mL |

## La densité de population
6 000 habitants sur 15 km² : 6 000 ÷ 15 = **400 hab/km²**.

> L'unité dit le calcul : « km/h » se lit « des km divisés par des heures ». En cas de doute, écrire les unités dans chaque ligne de calcul.`,
          },
          questions: [
            ['Une voiture parcourt 150 km en 1 h 15 min. Quelle est sa vitesse moyenne ?', ['130,4 km/h environ', '120 km/h', '115 km/h', '187,5 km/h'], 1, '1 h 15 = 1,25 h, et 150 ÷ 1,25 = 120 km/h.'],
            ['Combien vaut 72 km/h en m/s ?', ['20 m/s', '72 000 m/s', '7,2 m/s', '259,2 m/s'], 0, 'On divise par 3,6 : 72 ÷ 3,6 = 20.'],
            ['Comment écrit-on 1 h 30 min en heures décimales ?', ['1,3 h', '1,03 h', '1,5 h', '1,75 h'], 2, '30 min = 30 ÷ 60 = 0,5 h.'],
            ['Un scooter roule à 90 km/h pendant 40 min. Quelle distance parcourt-il ?', ['36 km', '50 km', '60 km', '360 km'], 2, '40 min = 2/3 h, et 90 × 2/3 = 60 km.'],
            ['Le fer a une masse volumique d’environ 7,8 g/cm³. Quelle est la masse d’un bloc de fer de 100 cm³ ?', ['78 g', '780 g', '7,8 g', '12,8 g'], 1, 'm = ρ × V = 7,8 × 100 = 780 g.'],
            ['Un robinet débite 12 L/min. Combien de temps faut-il pour remplir 300 L ?', ['36 min', '3 600 min', '20 min', '25 min'], 3, 'Durée = volume ÷ débit = 300 ÷ 12 = 25 min.'],
            ['Combien de litres contient 1 m³ ?', ['10 L', '100 L', '1 000 L', '1 000 000 L'], 2, '1 m³ = 1 000 dm³ et 1 dm³ = 1 L.'],
            ['Un radiateur de 2 000 W fonctionne pendant 3 h. Quelle énergie consomme-t-il ?', ['6 kWh', '6 000 kWh', '667 Wh', '2,003 kWh'], 0, '2 kW × 3 h = 6 kWh : l’énergie est une grandeur produit.'],
            ['Laquelle de ces grandeurs est une grandeur quotient ?', ['Une aire en m²', 'Une énergie en kWh', 'Une longueur en m', 'Une vitesse en km/h'], 3, 'Une vitesse est une distance divisée par une durée.'],
            ['1 g/cm³ correspond à combien de kg/m³ ?', ['1 kg/m³', '1 000 kg/m³', '100 kg/m³', '0,001 kg/m³'], 1, '1 m³ = 1 000 000 cm³ ; 1 000 000 g = 1 000 kg.'],
            ['0,3 h correspond à 30 minutes.', ['Vrai', 'Faux'], 1, '0,3 × 60 = 18 minutes.'],
            ['Une commune de 15 km² compte 6 000 habitants. Quelle est sa densité de population ?', ['90 000 hab/km²', '0,0025 hab/km²', '400 hab/km²', '600 hab/km²'], 2, 'Densité = habitants ÷ superficie = 6 000 ÷ 15 = 400.'],
          ],
        },

        // ===================================================================
        // 6. Repérage
        // ===================================================================
        {
          titre: 'Se repérer dans le plan, dans l’espace et sur la sphère terrestre',
          axe: 'Espace et géométrie',
          lecon: {
            titre: 'Abscisse, ordonnée, altitude, latitude, longitude',
            cours: `Se repérer, c'est donner une adresse à un point avec des nombres. En 3e, on le fait sur un plan, dans un pavé droit et sur la Terre.

## Dans le plan
Un repère est formé de deux axes gradués perpendiculaires qui se coupent à l'**origine** O. Un point M a deux coordonnées, écrites **(abscisse ; ordonnée)**.

| La coordonnée | Ce qu'elle indique | Où on la lit |
| L'**abscisse** | La position de gauche à droite | Sur l'axe horizontal |
| L'**ordonnée** | La position de bas en haut | Sur l'axe vertical |

> On lit **toujours** l'abscisse en premier. (2 ; −4) et (−4 ; 2) sont deux points différents.

| La position | Les coordonnées |
| Sur l'axe des abscisses | Ordonnée **nulle** : (x ; 0) |
| Sur l'axe des ordonnées | Abscisse **nulle** : (0 ; y) |
| À droite et en dessous de O | Abscisse positive, ordonnée négative |

## Symétriques d'un point
Pour M(3 ; −2) :

| La symétrie | L'image |
| Par rapport à l'**origine** | (−3 ; 2) : on change les deux signes |
| Par rapport à l'axe des **ordonnées** | (−3 ; −2) : on change le signe de l'abscisse |
| Par rapport à l'axe des **abscisses** | (3 ; 2) : on change le signe de l'ordonnée |

## Dans un pavé droit
Dans l'espace, il faut **trois** coordonnées : **(abscisse ; ordonnée ; altitude)**. L'altitude s'appelle aussi la cote.

Exemple travaillé : le pavé ABCDEFGH a pour sommet A l'origine, avec B(4 ; 0 ; 0), D(0 ; 3 ; 0) et E(0 ; 0 ; 2). Le sommet G, opposé à A, cumule les trois longueurs : **G(4 ; 3 ; 2)**. Le sommet C, sur la base, a pour coordonnées (4 ; 3 ; 0).

1. Repérer sur quelles arêtes le point est « avancé ».
2. Reporter la longueur de chaque arête parcourue.
3. Mettre 0 pour les directions non parcourues.

## Sur la sphère terrestre
| La notion | Sa définition |
| Les **parallèles** | Cercles parallèles à l'équateur |
| Les **méridiens** | Demi-cercles qui relient les deux pôles |
| La **latitude** | Angle mesuré à partir de l'**équateur**, de 0° à 90° Nord ou Sud |
| La **longitude** | Angle mesuré à partir du **méridien de Greenwich**, de 0° à 180° Est ou Ouest |

| Le lieu | Ses coordonnées approximatives |
| Paris | 49° N, 2° E |
| Un point de l'équateur | Latitude 0° |
| Le pôle Nord | Latitude 90° N |

> Tous les points de l'équateur ont la même latitude (0°) ; tous les points d'un même méridien ont la même longitude.

## Au brevet
On demande de lire les coordonnées d'un point sur un graphique, de placer un point dans un pavé ou de situer une ville par sa latitude et sa longitude. Le réflexe : nommer l'axe avant de lire la graduation.`,
          },
          questions: [
            ['Dans le point de coordonnées (−3 ; 5), que représente −3 ?', ['L’ordonnée', 'L’abscisse', 'L’altitude', 'La distance à l’origine'], 1, 'La première coordonnée est toujours l’abscisse.'],
            ['Où se trouve le point de coordonnées (2 ; −4) ?', ['À gauche de l’axe des ordonnées, au-dessus de l’axe des abscisses', 'Sur l’axe des ordonnées', 'À droite de l’axe des ordonnées, en dessous de l’axe des abscisses', 'À l’origine'], 2, 'Abscisse positive : à droite ; ordonnée négative : en dessous.'],
            ['Quel est le symétrique de M(3 ; −2) par rapport à l’origine ?', ['(3 ; 2)', '(−3 ; −2)', '(−2 ; 3)', '(−3 ; 2)'], 3, 'La symétrie centrale de centre O change le signe des deux coordonnées.'],
            ['Quel est le symétrique de M(3 ; −2) par rapport à l’axe des ordonnées ?', ['(−3 ; −2)', '(3 ; 2)', '(−3 ; 2)', '(2 ; −3)'], 0, 'L’axe des ordonnées est vertical : seule l’abscisse change de signe.'],
            ['Combien de coordonnées faut-il pour repérer un point dans l’espace ?', ['Une', 'Deux', 'Trois', 'Quatre'], 2, 'Abscisse, ordonnée et altitude.'],
            ['Comment s’appelle la troisième coordonnée d’un point dans l’espace ?', ['L’altitude', 'La latitude', 'La longitude', 'La diagonale'], 0, 'On dit aussi la cote : elle indique la hauteur.'],
            ['Dans un pavé ABCDEFGH, A est l’origine, B(4 ; 0 ; 0), D(0 ; 3 ; 0) et E(0 ; 0 ; 2). Quelles sont les coordonnées de G, opposé à A ?', ['(4 ; 0 ; 2)', '(4 ; 3 ; 0)', '(3 ; 4 ; 2)', '(4 ; 3 ; 2)'], 3, 'G cumule les trois longueurs : 4 en abscisse, 3 en ordonnée, 2 en altitude.'],
            ['À partir de quoi mesure-t-on la latitude ?', ['Du méridien de Greenwich', 'De l’équateur', 'Du pôle Sud', 'De Paris'], 1, 'La latitude va de 0° à l’équateur à 90° aux pôles.'],
            ['Quelle est la référence de la longitude ?', ['L’équateur', 'Le tropique du Cancer', 'Le méridien de Greenwich', 'Le pôle Nord'], 2, 'La longitude se mesure vers l’Est ou l’Ouest depuis ce méridien, jusqu’à 180°.'],
            ['Quelle est la latitude maximale possible ?', ['360°', '180°', '45°', '90°'], 3, 'Elle vaut 90° Nord au pôle Nord et 90° Sud au pôle Sud.'],
            ['Tous les points de l’équateur ont une latitude de 0°.', ['Vrai', 'Faux'], 0, 'L’équateur est le parallèle de référence.'],
            ['Un point est situé sur l’axe des ordonnées. Que peut-on dire de ses coordonnées ?', ['Son ordonnée est nulle', 'Son abscisse est nulle', 'Ses deux coordonnées sont égales', 'Ses deux coordonnées sont positives'], 1, 'Il n’a pas bougé de gauche à droite : son abscisse vaut 0.'],
          ],
        },

        // ===================================================================
        // 7. Identités remarquables
        // ===================================================================
        {
          titre: 'Identités remarquables : développer, factoriser, démontrer',
          axe: 'Nombres et calculs',
          lecon: {
            titre: 'Trois égalités qui font gagner du temps',
            cours: `Les trois identités remarquables sont des raccourcis de la double distributivité. Elles servent à développer vite, à factoriser, à calculer de tête et à démontrer une propriété générale.

## Les trois identités
| L'identité | Le développement | D'où elle vient |
| (a + b)² | a² + 2ab + b² | (a + b)(a + b) = a² + ab + ba + b² |
| (a − b)² | a² − 2ab + b² | Même calcul avec −b |
| (a + b)(a − b) | a² − b² | Les termes ab et −ab s'annulent |

> (a + b)² n'est **pas** a² + b². Contre-exemple : (1 + 2)² = 9, mais 1² + 2² = 5. Il manque le **double produit** 2ab.

## Développer
| L'expression | Le résultat | Le détail |
| (x + 5)² | x² + 10x + 25 | 2 × x × 5 = 10x |
| (2x − 3)² | 4x² − 12x + 9 | (2x)² = 4x², 2 × 2x × 3 = 12x |
| (3x + 1)(3x − 1) | 9x² − 1 | (3x)² − 1² |

Attention au signe moins devant une parenthèse : −(x − 3)² = −(x² − 6x + 9) = **−x² + 6x − 9**. On développe d'abord, on distribue le signe ensuite.

## Factoriser
On lit les identités **de droite à gauche**.

| L'expression | Ce qu'on reconnaît | La forme factorisée |
| x² + 6x + 9 | a² + 2ab + b² avec a = x, b = 3 | (x + 3)² |
| 25x² − 16 | Une différence de deux carrés | (5x − 4)(5x + 4) |
| (x + 2)(3x − 1) + (x + 2)(x + 4) | Un **facteur commun** (x + 2) | (x + 2)(4x + 3) |

Pour le dernier : (x + 2)[(3x − 1) + (x + 4)] = (x + 2)(4x + 3).

> Avant tout, chercher un facteur commun. Ensuite seulement, chercher une identité.

## Calculer de tête
| Le calcul | L'astuce | Le résultat |
| 49 × 51 | (50 − 1)(50 + 1) = 2 500 − 1 | **2 499** |
| 101² | (100 + 1)² = 10 000 + 200 + 1 | **10 201** |
| 99² | (100 − 1)² = 10 000 − 200 + 1 | 9 801 |

## Démontrer avec le calcul littéral
Exercice type du brevet : « Choisir un nombre, lui ajouter 1, élever le résultat au carré, puis soustraire le carré du nombre de départ. Montrer que le résultat est toujours le double du nombre de départ augmenté de 1. »

1. Appeler x le nombre de départ.
2. Traduire : (x + 1)² − x².
3. Développer : x² + 2x + 1 − x² = **2x + 1**.
4. Conclure : quel que soit x, on obtient 2x + 1.

| Ce qu'on veut | L'outil |
| Prouver qu'une propriété est **toujours vraie** | Le calcul littéral, avec une lettre |
| Prouver qu'elle est **fausse** | **Un seul contre-exemple** suffit |

> Tester sur trois nombres ne démontre rien : c'est une conjecture. Seule la lettre démontre.`,
          },
          questions: [
            ['Quel est le développement de (x + 5)² ?', ['x² + 25', 'x² + 10x + 25', 'x² + 5x + 25', '2x + 10'], 1, 'Il ne faut pas oublier le double produit : 2 × x × 5 = 10x.'],
            ['Quel est le développement de (2x − 3)² ?', ['4x² − 9', '2x² − 12x + 9', '4x² − 12x + 9', '4x² − 6x + 9'], 2, '(2x)² = 4x², double produit 2 × 2x × 3 = 12x, et (−3)² = 9.'],
            ['Quel est le développement de (3x + 1)(3x − 1) ?', ['9x² − 1', '9x² + 1', '3x² − 1', '9x² − 6x − 1'], 0, 'C’est (a + b)(a − b) = a² − b², avec a = 3x et b = 1.'],
            ['Quelle est la forme factorisée de 25x² − 16 ?', ['(25x − 16)(25x + 16)', '(5x − 4)²', '(5x − 16)(5x + 1)', '(5x − 4)(5x + 4)'], 3, '25x² = (5x)² et 16 = 4² : c’est une différence de deux carrés.'],
            ['Quelle est la forme factorisée de x² + 6x + 9 ?', ['(x + 9)(x + 1)', '(x + 3)²', 'x(x + 6) + 9', '(x − 3)²'], 1, 'On reconnaît a² + 2ab + b² avec a = x et b = 3.'],
            ['Quel calcul mental permet de trouver 49 × 51 ?', ['(50 − 1)(50 + 1) = 2 500 − 1 = 2 499', '50 × 50 = 2 500', '49 × 50 + 1 = 2 451', '(50 + 1)² = 2 601'], 0, 'C’est l’identité (a − b)(a + b) = a² − b².'],
            ['Combien vaut 101² ?', ['10 101', '10 001', '10 201', '1 021'], 2, '(100 + 1)² = 10 000 + 200 + 1 = 10 201.'],
            ['Quelle est la forme factorisée de (x + 2)(3x − 1) + (x + 2)(x + 4) ?', ['(x + 2)(4x + 3)', '(x + 2)(2x − 5)', '(x + 2)²(4x + 3)', '(4x + 3)(3x − 1)'], 0, 'On met (x + 2) en facteur : (3x − 1) + (x + 4) = 4x + 3.'],
            ['Programme : ajouter 1 au nombre x, élever au carré, soustraire x². Que donne-t-il toujours ?', ['1', 'x²', '2x', '2x + 1'], 3, '(x + 1)² − x² = x² + 2x + 1 − x² = 2x + 1.'],
            ['Pour tous nombres a et b, (a + b)² = a² + b².', ['Vrai', 'Faux'], 1, 'Contre-exemple : (1 + 2)² = 9, alors que 1² + 2² = 5. Il manque 2ab.'],
            ['Que suffit-il de trouver pour prouver qu’une affirmation générale est fausse ?', ['Trois exemples', 'Un calcul avec une lettre', 'Un seul contre-exemple', 'Une figure'], 2, 'Un seul cas où l’affirmation échoue suffit à la réfuter.'],
            ['Quel est le développement de −(x − 3)² ?', ['−x² − 6x − 9', '−x² + 6x − 9', 'x² − 6x + 9', '−x² + 9'], 1, 'On développe d’abord (x − 3)² = x² − 6x + 9, puis on change tous les signes.'],
          ],
        },

        // ===================================================================
        // 8. Équations produit nul et inéquations
        // ===================================================================
        {
          titre: 'Équations produits nuls, inéquations et mise en équation',
          axe: 'Nombres et calculs',
          lecon: {
            titre: 'Factoriser pour résoudre, retourner le signe au bon moment',
            cours: `Résoudre une équation, c'est trouver toutes les valeurs qui la rendent vraie. En 3e, on va plus loin qu'en 4e : les équations du second degré qui se factorisent, les inéquations et la mise en équation d'un problème.

## L'équation produit nul
**Un produit est nul si et seulement si l'un au moins de ses facteurs est nul.**

| L'équation | Ce qu'on écrit | Les solutions |
| (2x + 1)(x − 3) = 0 | 2x + 1 = 0 ou x − 3 = 0 | **−0,5** et **3** |
| x(x + 7) = 0 | x = 0 ou x + 7 = 0 | **0** et **−7** |

## Se ramener à un produit nul
Quand l'équation contient un x², le premier réflexe est de **tout passer d'un côté puis de factoriser**.

Exemple travaillé : x² − 4x = 0.
1. Factoriser par x : x(x − 4) = 0.
2. Produit nul : x = 0 ou x − 4 = 0.
3. Solutions : **0 et 4**.

> Diviser les deux membres par x ferait perdre la solution 0 : on ne divise jamais par une expression qui peut être nulle.

## Les inéquations
Une inéquation utilise <, >, ≤ ou ≥. On la résout comme une équation, avec **une seule règle nouvelle** :

| L'opération sur les deux membres | Le sens de l'inégalité |
| Ajouter ou soustraire un nombre | **Inchangé** |
| Multiplier ou diviser par un **positif** | **Inchangé** |
| Multiplier ou diviser par un **négatif** | **Inversé** |

| L'inéquation | Les étapes | La solution |
| 3x − 5 < 7 | 3x < 12, puis diviser par 3 | **x < 4** |
| −2x + 1 ≥ 9 | −2x ≥ 8, puis diviser par −2 (on retourne) | **x ≤ −4** |

## Représenter les solutions
Sur une droite graduée, x ≥ 3 se représente par un trait qui part de 3 vers la droite, avec un **crochet tourné vers les solutions** en 3 (3 est inclus). Pour x > 3, le crochet est tourné vers l'extérieur : 3 est exclu.

## Tester une valeur
Le nombre 2 est-il solution de 5x − 3 > 8 ? On remplace : 5 × 2 − 3 = 7, et 7 n'est pas supérieur à 8. Donc **non**.

## Mettre un problème en équation
1. **Choisir** l'inconnue et l'écrire : « soit x l'âge du frère ».
2. **Traduire** l'énoncé : Léa a trois fois l'âge de son frère, et à eux deux ils ont 48 ans : x + 3x = 48.
3. **Résoudre** : 4x = 48, x = 12.
4. **Répondre** par une phrase : le frère a 12 ans, Léa 36 ans.
5. **Vérifier** : 12 + 36 = 48.

Autre exemple : trois entiers consécutifs ont pour somme 72. Avec x le plus petit : x + (x + 1) + (x + 2) = 72, soit 3x + 3 = 72, donc x = **23**.`,
          },
          questions: [
            ['Quelles sont les solutions de (2x + 1)(x − 3) = 0 ?', ['0,5 et −3', '−0,5 et 3', '−1 et 3', '2 et 3'], 1, '2x + 1 = 0 donne x = −0,5 ; x − 3 = 0 donne x = 3.'],
            ['Quelles sont les solutions de x² − 4x = 0 ?', ['4 seulement', '−4 et 4', '0 et 4', '0 et −4'], 2, 'On factorise : x(x − 4) = 0, donc x = 0 ou x = 4.'],
            ['Quel est le premier réflexe pour résoudre x² − 4x = 0 ?', ['Diviser par x', 'Prendre la racine carrée', 'Ajouter 4x des deux côtés puis diviser par x', 'Factoriser'], 3, 'La factorisation ramène à un produit nul ; diviser par x ferait perdre la solution 0.'],
            ['Quelle est la solution de l’inéquation 3x − 5 < 7 ?', ['x < 4', 'x > 4', 'x < 2/3', 'x < 12'], 0, '3x < 12, puis on divise par 3, un nombre positif : le sens ne change pas.'],
            ['Quelle est la solution de −2x + 1 ≥ 9 ?', ['x ≥ −4', 'x ≤ 4', 'x ≤ −4', 'x ≥ 4'], 2, '−2x ≥ 8 ; en divisant par −2, négatif, on retourne l’inégalité : x ≤ −4.'],
            ['Que se passe-t-il quand on multiplie les deux membres d’une inéquation par un nombre négatif ?', ['Rien ne change', 'Le sens de l’inégalité s’inverse', 'L’inéquation devient une équation', 'On doit ajouter 1'], 1, 'Exemple : 2 < 3, mais −2 > −3.'],
            ['Le nombre 2 est-il solution de 5x − 3 > 8 ?', ['Oui, car 7 > 3', 'On ne peut pas savoir sans résoudre', 'Oui, car 2 est positif', 'Non, car 5 × 2 − 3 = 7 et 7 n’est pas supérieur à 8'], 3, 'On teste une valeur en la remplaçant dans l’inéquation.'],
            ['Trois entiers consécutifs ont pour somme 72. Quel est le plus petit ?', ['23', '24', '22', '25'], 0, 'x + (x + 1) + (x + 2) = 72, donc 3x = 69 et x = 23.'],
            ['Les solutions de (x − 5)(x + 2) = 0 sont 5 et 2.', ['Vrai', 'Faux'], 1, 'x + 2 = 0 donne x = −2 : les solutions sont 5 et −2.'],
            ['Comment représente-t-on les solutions de x ≥ 3 sur une droite graduée ?', ['Un trait de 3 vers la gauche', 'Un point en 3 seulement', 'Un trait de 3 vers la droite, 3 inclus', 'Un trait de 3 vers la droite, 3 exclu'], 2, '« Supérieur ou égal » inclut 3, et les solutions sont les nombres plus grands.'],
            ['Quelles sont les solutions de x(x + 7) = 0 ?', ['0 et −7', '0 et 7', '−7 seulement', '7 seulement'], 0, 'x = 0 ou x + 7 = 0, c’est-à-dire x = −7.'],
            ['Léa a trois fois l’âge de son frère ; à eux deux, ils ont 48 ans. Avec x l’âge du frère, quelle équation traduit l’énoncé ?', ['3x = 48', 'x + 3 = 48', '3(x + 48) = 0', 'x + 3x = 48'], 3, 'L’âge du frère plus celui de Léa, 3x, font 48 : 4x = 48, soit x = 12.'],
          ],
        },

        // ===================================================================
        // 9. Racine carrée
        // ===================================================================
        {
          titre: 'La racine carrée et l’équation x² = a',
          axe: 'Nombres et calculs',
          lecon: {
            titre: 'Le nombre positif dont le carré vaut a',
            cours: `La racine carrée est l'opération qui « défait » le carré. On la croise avec Pythagore, avec les aires et avec les équations du type x² = a.

## La définition
Pour un nombre **a positif ou nul**, la racine carrée de a, notée **√a**, est le nombre **positif** dont le carré vaut a.

| L'exemple | Pourquoi |
| √81 = 9 | 9² = 81 et 9 est positif |
| √0 = 0 | 0² = 0 |
| √(−9) | **N'existe pas** : aucun carré n'est négatif |
| (√7)² = 7 | Par définition |

> Une racine carrée est toujours **positive ou nulle**. Même si (−9)² = 81, √81 vaut 9 et non −9.

## Les carrés parfaits à connaître
| n | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
| n² | 1 | 4 | 9 | 16 | 25 | 36 | 49 | 64 |

| n | 9 | 10 | 11 | 12 | 13 | 14 | 15 |
| n² | 81 | 100 | 121 | 144 | 169 | 196 | 225 |

Ils permettent d'**encadrer** une racine qui ne tombe pas juste : 49 < 50 < 64, donc **7 < √50 < 8**.

## Valeur exacte et valeur approchée
| L'écriture | Son statut |
| √2 | Valeur **exacte** |
| 1,414 | Valeur **approchée** au millième |

Au brevet, on garde la valeur exacte tant qu'on calcule, et on n'arrondit qu'à la fin, comme demandé.

## Un piège à éviter
√(a + b) n'est **pas** √a + √b. Contre-exemple : √9 + √16 = 3 + 4 = 7, alors que √(9 + 16) = √25 = 5.

## L'équation x² = a
| La valeur de a | Le nombre de solutions | Exemple |
| a > 0 | **Deux** : √a et −√a | x² = 49 : **7 et −7** ; x² = 10 : √10 et −√10 |
| a = 0 | **Une** : 0 | x² = 0 |
| a < 0 | **Aucune** | x² = −4 : un carré n'est jamais négatif |

> Ne pas oublier la solution négative : (−7)² = 49 aussi.

## Les usages
| La situation | Le calcul |
| Le côté d'un carré d'aire 36 cm² | √36 = **6 cm** (une longueur est positive : une seule réponse) |
| La fin d'un calcul de Pythagore | BC² = 100, donc BC = √100 = 10 |
| La diagonale d'un carré de côté 1 | √2 ≈ 1,414 |

Exemple travaillé : un champ carré a une aire de 2 500 m². Quelle longueur de clôture faut-il pour en faire le tour ? Le côté vaut √2 500 = 50 m, donc le périmètre vaut 4 × 50 = **200 m**.

> Dans un problème de géométrie, la solution négative d'une équation x² = a est écartée : une longueur est positive.`,
          },
          questions: [
            ['Combien vaut √81 ?', ['−9', '40,5', '9', '8,1'], 2, '9² = 81 et 9 est positif.'],
            ['Entre quels entiers consécutifs se trouve √50 ?', ['7 et 8', '6 et 7', '24 et 25', '5 et 6'], 0, '49 < 50 < 64, donc 7 < √50 < 8.'],
            ['Quelles sont les solutions de l’équation x² = 49 ?', ['7 seulement', '24,5 et −24,5', '−7 seulement', '7 et −7'], 3, '7² = 49 et (−7)² = 49 : deux solutions.'],
            ['Combien de solutions a l’équation x² = −4 ?', ['Deux : 2 et −2', 'Aucune', 'Une : −2', 'Une : 2'], 1, 'Un carré n’est jamais négatif.'],
            ['Que vaut √(−9) ?', ['−3', '3', 'Cela n’existe pas', '−81'], 2, 'La racine carrée n’est définie que pour un nombre positif ou nul.'],
            ['Combien vaut (√7)² ?', ['49', '7', '√49', '14'], 1, 'Par définition, le carré de √7 vaut 7.'],
            ['√9 + √16 = √25.', ['Vrai', 'Faux'], 1, '√9 + √16 = 3 + 4 = 7, alors que √25 = 5.'],
            ['Lequel de ces nombres est un carré parfait ?', ['140', '150', '160', '144'], 3, '144 = 12 × 12 = 12² : c’est un carré parfait. Les trois autres tombent entre 11² = 121 et 13² = 169 sans être des carrés.'],
            ['Quelle est une valeur approchée de √2 ?', ['1,414', '1,5', '2,828', '0,707'], 0, '1,414² ≈ 1,999 : c’est √2 au millième près.'],
            ['Un carré a une aire de 36 cm². Combien mesure son côté ?', ['9 cm', '18 cm', '6 cm', '12 cm'], 2, '√36 = 6 ; une longueur est positive, on garde une seule valeur.'],
            ['Quelles sont les solutions de x² = 10 ?', ['√10 et −√10', '5 et −5', '√10 seulement', '100 et −100'], 0, 'Comme 10 > 0, il y a deux solutions opposées.'],
            ['La racine carrée d’un nombre positif est toujours positive ou nulle.', ['Vrai', 'Faux'], 0, 'C’est la définition : √a est LE nombre positif dont le carré vaut a.'],
          ],
        },

        // ===================================================================
        // 10. Arithmétique
        // ===================================================================
        {
          titre: 'Division euclidienne, diviseurs et problèmes de partage',
          axe: 'Nombres et calculs',
          lecon: {
            titre: 'Partager équitablement, sans reste',
            cours: `L'arithmétique étudie les nombres entiers : qui divise qui, combien il reste, comment partager sans rien laisser. Elle revient au brevet sous forme de problèmes concrets de bouquets, de paquets ou d'horaires.

## La division euclidienne
Diviser a par b (b non nul), c'est trouver le **quotient** q et le **reste** r tels que :

**a = b × q + r, avec 0 ≤ r < b**

| La division | L'égalité | Quotient | Reste |
| 187 par 12 | 187 = 12 × 15 + 7 | 15 | 7 |
| 100 par 7 | 100 = 7 × 14 + 2 | 14 | 2 |

> Le reste est toujours **strictement plus petit** que le diviseur. Si on trouve un reste de 13 en divisant par 12, c'est que le quotient est trop petit.

## Diviseurs et multiples
Si le reste est **nul**, b est un **diviseur** de a, et a est un **multiple** de b. Exemple : 91 = 7 × 13, donc 7 divise 91.

Les diviseurs de 36 vont par paires : 1 × 36, 2 × 18, 3 × 12, 4 × 9, 6 × 6. Il y en a **9** : 1, 2, 3, 4, 6, 9, 12, 18, 36.

## Le plus grand diviseur commun
On décompose les deux nombres en facteurs premiers et on garde les facteurs communs, avec le plus petit exposant.

| Le nombre | Sa décomposition |
| 84 | 2² × 3 × 7 |
| 60 | 2² × 3 × 5 |
| Facteurs communs | 2² × 3 = **12** |

On l'appelle aussi le PGCD. Deux nombres dont le seul diviseur commun est 1 sont dits **premiers entre eux** : par exemple 15 = 3 × 5 et 28 = 2² × 7. La fraction 15/28 est alors **irréductible**.

## Le problème de partage type
Une fleuriste a 84 roses et 60 tulipes. Elle veut faire le **plus grand nombre** de bouquets **identiques** en utilisant toutes les fleurs.

1. Le nombre de bouquets doit diviser 84 **et** 60.
2. On cherche le plus grand diviseur commun : **12**.
3. Chaque bouquet contient 84 ÷ 12 = **7 roses** et 60 ÷ 12 = **5 tulipes**.

## Le problème de rendez-vous
Deux bus partent ensemble à 8 h ; l'un passe toutes les 6 min, l'autre toutes les 8 min. Ils repartiront ensemble après un **multiple commun** de 6 et 8. Multiples de 8 : 8, 16, **24**… et 24 est multiple de 6. Prochain départ commun : **8 h 24**.

| La question | L'outil |
| « le plus grand nombre de paquets identiques » | Le plus grand **diviseur** commun |
| « la prochaine fois qu'ils se retrouvent » | Le plus petit **multiple** commun |

## Le reste dans les problèmes
250 œufs rangés par boîtes de 12 : 250 = 12 × 20 + 10. On remplit **20 boîtes**, il reste 10 œufs, et il faut 21 boîtes pour tout ranger. Toujours relire la question : quotient ou quotient + 1 ?`,
          },
          questions: [
            ['Quels sont le quotient et le reste de la division euclidienne de 187 par 12 ?', ['Quotient 15, reste 7', 'Quotient 15, reste 17', 'Quotient 16, reste 5', 'Quotient 14, reste 19'], 0, '12 × 15 = 180 et 187 − 180 = 7, qui est bien inférieur à 12.'],
            ['Dans a = b × q + r, quelle condition doit vérifier le reste r ?', ['r < q', '0 ≤ r < b', 'r > b', 'r est pair'], 1, 'Le reste est positif ou nul et strictement inférieur au diviseur.'],
            ['Combien le nombre 36 a-t-il de diviseurs ?', ['6', '8', '9', '12'], 2, '1, 2, 3, 4, 6, 9, 12, 18, 36 : neuf diviseurs (6 × 6 ne compte qu’une fois).'],
            ['Quel est le plus grand diviseur commun de 84 et 60 ?', ['6', '4', '24', '12'], 3, '84 = 2² × 3 × 7 et 60 = 2² × 3 × 5 : on garde 2² × 3 = 12.'],
            ['Avec 84 roses et 60 tulipes, on fait 12 bouquets identiques. Combien de roses par bouquet ?', ['5', '7', '12', '14'], 1, '84 ÷ 12 = 7 roses (et 60 ÷ 12 = 5 tulipes).'],
            ['Lequel de ces couples est formé de nombres premiers entre eux ?', ['12 et 18', '14 et 21', '15 et 28', '9 et 33'], 2, '15 = 3 × 5 et 28 = 2² × 7 n’ont aucun facteur premier commun.'],
            ['Deux bus partent ensemble à 8 h, l’un toutes les 6 min, l’autre toutes les 8 min. Quand repartent-ils ensemble ?', ['8 h 48', '8 h 14', '8 h 12', '8 h 24'], 3, '24 est le plus petit multiple commun de 6 et de 8.'],
            ['7 est un diviseur de 91.', ['Vrai', 'Faux'], 0, '91 = 7 × 13 : le reste est nul.'],
            ['On range 250 œufs dans des boîtes de 12. Combien de boîtes sont pleines ?', ['21', '20', '22', '10'], 1, '250 = 12 × 20 + 10 : 20 boîtes pleines, et 10 œufs dans une 21e boîte.'],
            ['Quel est le reste de la division euclidienne de 100 par 7 ?', ['2', '3', '4', '14'], 0, '7 × 14 = 98 et 100 − 98 = 2.'],
            ['Si le numérateur et le dénominateur d’une fraction sont premiers entre eux, la fraction est…', ['décimale', 'supérieure à 1', 'égale à 1', 'irréductible'], 3, 'Aucun diviseur commun autre que 1 : on ne peut plus simplifier.'],
            ['Si le reste de la division euclidienne de a par b est nul, alors b est un diviseur de a.', ['Vrai', 'Faux'], 0, 'a = b × q exactement : b divise a.'],
          ],
        },

        // ===================================================================
        // 11. Lecture graphique et tableur
        // ===================================================================
        {
          titre: 'Lire un graphique, un diagramme et une feuille de tableur',
          axe: 'Organisation et gestion de données – Fonctions',
          lecon: {
            titre: 'Extraire l’information sans se laisser piéger',
            cours: `Presque chaque sujet de brevet contient un graphique, un diagramme ou une capture de tableur. Les points se gagnent sur la **lecture**, à condition de regarder les axes avant les courbes.

## Lire un graphique cartésien
1. **Identifier** ce que représente chaque axe et son unité (heures, euros, mètres…).
2. **Lire la graduation** : combien vaut un carreau ? Les graduations ne commencent pas forcément à 0.
3. **Lire** la valeur demandée en suivant les pointillés : de l'axe horizontal vers la courbe, puis vers l'axe vertical (ou l'inverse).
4. **Répondre** par une phrase, avec l'unité.

| Ce qu'on voit | Ce que ça signifie |
| La courbe **monte** de gauche à droite | La grandeur **augmente** |
| La courbe **descend** | La grandeur **diminue** |
| Un palier horizontal | La grandeur ne change pas |
| Deux courbes qui se **croisent** | Les deux grandeurs ont **la même valeur** à ce moment-là |

> Un axe des ordonnées qui commence à 900 au lieu de 0 grossit les écarts : une petite hausse paraît énorme. Toujours lire les nombres, pas seulement la forme.

## Les diagrammes statistiques
| Le diagramme | Ce qui représente l'effectif |
| **En bâtons** | La **hauteur** de chaque bâton est proportionnelle à l'effectif |
| **Circulaire** | L'**angle** de chaque secteur est proportionnel à l'effectif |
| **Histogramme** | L'aire de chaque rectangle, pour des classes de valeurs |

Dans un diagramme circulaire, angle = fréquence × 360°.

| La fréquence | L'angle |
| 25 % | 90° |
| 50 % | 180° |
| 0,15 | 0,15 × 360 = **54°** |

## Le tableur
Une feuille de calcul est une grille de **cellules** repérées par une lettre (colonne) et un nombre (ligne) : B3.

| L'élément | Ce qu'il faut savoir |
| Une **formule** | Commence **toujours** par = |
| =3*A2+1 | Si A2 contient 4, la cellule affiche 13 |
| =SOMME(B2:B5) | Additionne B2, B3, B4 et B5 |
| =MOYENNE(C2:C11) | Moyenne des **10** cellules de C2 à C11 |

**La recopie vers le bas** décale les références : la formule =3*A2+1 écrite en B2, recopiée en B3, devient =3*A3+1. C'est ce qui permet de calculer tout un tableau de valeurs d'une fonction en une seule formule.

> Au brevet, la question type est : « Quelle formule a-t-on saisie dans la cellule B2 avant de la recopier vers le bas ? » On répond avec le signe = et la référence de la cellule de la même ligne.

## Exemple travaillé
Un graphique donne la température d'un four en fonction du temps. À 10 min, on lit 180 °C ; la courbe atteint un palier à 220 °C à partir de 15 min. Réponses : la température à 10 min est de 180 °C ; le four ne chauffe plus au-delà de 220 °C ; il faut environ 15 min pour l'atteindre.`,
          },
          questions: [
            ['Dans un diagramme circulaire, quel angle représente 25 % de l’effectif ?', ['25°', '90°', '45°', '180°'], 1, '0,25 × 360° = 90°, un quart de tour.'],
            ['Dans un diagramme circulaire, quel angle correspond à une fréquence de 0,15 ?', ['15°', '36°', '54°', '150°'], 2, '0,15 × 360 = 54°.'],
            ['Par quel signe commence toujours une formule de tableur ?', ['=', '+', '#', '*'], 0, 'Sans le signe =, le tableur affiche le texte tel quel.'],
            ['Que calcule la formule =SOMME(B2:B5) ?', ['B2 + B5 seulement', 'La moyenne de B2 à B5', 'Le produit de B2 par B5', 'B2 + B3 + B4 + B5'], 3, 'Les deux-points désignent toute la plage, de B2 à B5.'],
            ['La formule =3*A2+1, écrite en B2, est recopiée vers le bas. Que devient-elle en B3 ?', ['=3*A2+1', '=3*B3+1', '=3*A3+1', '=4*A2+1'], 2, 'La recopie décale la référence d’une ligne.'],
            ['La cellule A2 contient 4. Qu’affiche une cellule contenant =3*A2+1 ?', ['13', '34', '7', '12'], 0, '3 × 4 + 1 = 13.'],
            ['Quelle est la première chose à vérifier avant de lire un graphique ?', ['La couleur de la courbe', 'Ce que représentent les axes et leurs graduations', 'Le titre de l’exercice', 'Le nombre de points tracés'], 1, 'Sans l’unité et la valeur d’un carreau, toute lecture est fausse.'],
            ['Deux courbes se croisent en un point. Que signifie ce point ?', ['Les deux grandeurs sont nulles', 'Les deux courbes sont parallèles', 'Une erreur de tracé', 'Les deux grandeurs ont la même valeur à cet instant'], 3, 'Au point d’intersection, les deux courbes ont la même ordonnée.'],
            ['Sur un intervalle où la courbe descend de gauche à droite, la grandeur en ordonnée…', ['augmente', 'diminue', 'reste constante', 'devient négative'], 1, 'Descendre quand l’abscisse augmente, c’est diminuer.'],
            ['Combien de cellules compte la plage C2:C11 ?', ['9', '11', '10', '2'], 2, 'De la ligne 2 à la ligne 11 incluses : 11 − 2 + 1 = 10.'],
            ['Sur un graphique dont l’axe des ordonnées commence à 900, une petite hausse peut paraître énorme.', ['Vrai', 'Faux'], 0, 'Un axe tronqué grossit les écarts : il faut lire les nombres, pas la forme.'],
            ['Dans un diagramme en bâtons, qu’est-ce qui est proportionnel à l’effectif ?', ['La largeur des bâtons', 'La hauteur des bâtons', 'L’écart entre les bâtons', 'La couleur des bâtons'], 1, 'Tous les bâtons ont la même largeur ; seule leur hauteur porte l’information.'],
          ],
        },

        // ===================================================================
        // 12. Aires et volumes
        // ===================================================================
        {
          titre: 'Aires, volumes et conversions : le formulaire du brevet',
          axe: 'Grandeurs et mesures',
          lecon: {
            titre: 'Choisir la bonne formule, convertir au bon moment',
            cours: `Les calculs d'aires et de volumes se retrouvent dans presque tous les problèmes du brevet : peinture d'un mur, remplissage d'une piscine, contenance d'une boîte. Il faut connaître les formules, et surtout convertir correctement.

## Les périmètres et les aires
| La figure | Le périmètre | L'aire |
| Rectangle L × l | 2 × (L + l) | L × l |
| Triangle | Somme des côtés | base × hauteur ÷ 2 |
| Parallélogramme | Somme des côtés | base × hauteur |
| Trapèze (bases B et b) | Somme des côtés | (B + b) × h ÷ 2 |
| Disque de rayon r | 2 × π × r | π × r² |

Exemples : un triangle de base 8 cm et de hauteur 5 cm a une aire de 8 × 5 ÷ 2 = **20 cm²** ; un disque de rayon 3 cm a une aire de 9π ≈ **28,3 cm²** ; un cercle de rayon 5 cm a un périmètre de 10π ≈ 31,4 cm.

## Les volumes
| Le solide | Le volume |
| Pavé droit | L × l × h |
| **Prisme droit**, cylindre | **aire de la base × hauteur** |
| Cylindre de rayon r | π × r² × h |
| **Pyramide**, cône | **aire de la base × hauteur ÷ 3** |
| Boule de rayon r | 4/3 × π × r³ |

> Deux familles à retenir : les solides « droits » (base × hauteur) et les solides « pointus » (le tiers de base × hauteur).

Exemples : un cylindre de rayon 2 cm et de hauteur 5 cm a un volume de π × 4 × 5 = 20π ≈ **62,8 cm³** ; un cône de rayon 3 cm et de hauteur 10 cm a un volume de π × 9 × 10 ÷ 3 = 30π ≈ **94,2 cm³**.

## Les conversions
| Les unités | Pour passer à l'unité voisine plus petite |
| Longueurs (m, dm, cm) | × 10 |
| Aires (m², dm², cm²) | × **100** |
| Volumes (m³, dm³, cm³) | × **1 000** |

| L'équivalence | |
| 1 m² | 10 000 cm² |
| 1 ha | 10 000 m² |
| 1 dm³ | 1 L |
| 1 m³ | 1 000 L |
| 1 cm³ | 1 mL |

## Exemple travaillé
Un aquarium a la forme d'un pavé droit de 60 cm × 30 cm × 40 cm. Quelle est sa contenance en litres ?
1. Volume : 60 × 30 × 40 = 72 000 cm³.
2. Conversion : 1 000 cm³ = 1 dm³ = 1 L, donc 72 000 cm³ = **72 L**.

Autre méthode, plus rapide : convertir d'abord en dm (6 × 3 × 4 = 72 dm³).

## Les réflexes du brevet
1. Mettre **toutes** les longueurs dans la même unité avant de calculer.
2. Garder π dans le calcul (valeur exacte 30π), arrondir à la fin.
3. Vérifier l'unité : une aire en unité **carrée**, un volume en unité **cube**.
4. Pour un solide composé (un cylindre surmonté d'un cône), additionner les volumes de chaque partie.`,
          },
          questions: [
            ['Quelle est l’aire d’un triangle de base 8 cm et de hauteur 5 cm ?', ['40 cm²', '13 cm²', '20 cm²', '26 cm²'], 2, 'base × hauteur ÷ 2 = 8 × 5 ÷ 2 = 20 cm².'],
            ['Quelle est l’aire d’un disque de rayon 3 cm ?', ['6π cm², environ 18,8 cm²', '9π cm², environ 28,3 cm²', '3π cm², environ 9,4 cm²', '36π cm², environ 113 cm²'], 1, 'π × r² = π × 9. Le périmètre, lui, vaudrait 6π cm.'],
            ['Comment calcule-t-on le volume d’un prisme droit ?', ['Aire de la base × hauteur ÷ 3', 'Périmètre de la base × hauteur', 'Aire de la base × hauteur', 'Longueur × largeur'], 2, 'Tous les solides « droits » suivent la même formule.'],
            ['Quelle est la contenance d’un aquarium de 60 cm × 30 cm × 40 cm ?', ['7,2 L', '720 L', '72 000 L', '72 L'], 3, '72 000 cm³ = 72 dm³ = 72 L.'],
            ['Combien de cm² y a-t-il dans 1 m² ?', ['100', '1 000', '10 000', '1 000 000'], 2, '1 m² = 100 cm × 100 cm = 10 000 cm².'],
            ['Combien de litres représentent 2,5 m³ ?', ['2 500 L', '250 L', '25 L', '25 000 L'], 0, '1 m³ = 1 000 L.'],
            ['Quel est le volume d’un cône de rayon 3 cm et de hauteur 10 cm ?', ['90π cm³', '30π cm³', '10π cm³', '60π cm³'], 1, 'π × 9 × 10 ÷ 3 = 30π ≈ 94,2 cm³ : il ne faut pas oublier le tiers.'],
            ['Quel est le volume d’un cylindre de rayon 2 cm et de hauteur 5 cm ?', ['10π cm³', '20π cm³', '40π cm³', '100π cm³'], 1, 'π × 2² × 5 = 20π ≈ 62,8 cm³.'],
            ['Combien de m² y a-t-il dans un hectare ?', ['100 m²', '1 000 m²', '100 000 m²', '10 000 m²'], 3, 'Un hectare est un carré de 100 m de côté.'],
            ['1 dm³ correspond à 1 litre.', ['Vrai', 'Faux'], 0, 'C’est l’équivalence de base entre volumes et contenances.'],
            ['Quel est le périmètre d’un cercle de rayon 5 cm ?', ['10π cm, environ 31,4 cm', '25π cm, environ 78,5 cm', '5π cm, environ 15,7 cm', '100π cm'], 0, 'Périmètre = 2 × π × r = 10π.'],
            ['Quelle est l’aire d’un trapèze de bases 10 cm et 6 cm, et de hauteur 4 cm ?', ['64 cm²', '240 cm²', '20 cm²', '32 cm²'], 3, '(10 + 6) × 4 ÷ 2 = 32 cm².'],
          ],
        },

        // ===================================================================
        // 13. Agrandissement et réduction
        // ===================================================================
        {
          titre: 'Agrandissement et réduction : échelles, aires et volumes',
          axe: 'Grandeurs et mesures',
          lecon: {
            titre: 'Les longueurs par k, les aires par k², les volumes par k³',
            cours: `Plans, cartes, maquettes, pyramides coupées : dès qu'une figure est agrandie ou réduite, un seul nombre gouverne tout, le coefficient k. Encore faut-il savoir ce qu'il multiplie.

## Le coefficient
| La valeur de k | L'effet |
| k > 1 | Un **agrandissement** |
| k < 1 (et positif) | Une **réduction** |
| k = 1 | La figure est inchangée |

On le trouve en divisant une longueur de l'image par la longueur **correspondante** de la figure de départ : un segment de 5 cm devenu 2 cm donne k = 2 ÷ 5 = **0,4**.

## La règle des trois puissances
| La grandeur | Elle est multipliée par | Avec k = 3 | Avec k = 0,5 |
| Les longueurs | k | × 3 | × 0,5 |
| Les aires | **k²** | × 9 | × 0,25 |
| Les volumes | **k³** | × 27 | × 0,125 |
| Les angles | **Inchangés** | | |

> Doubler les dimensions d'une boîte ne double pas sa contenance : elle est multipliée par 2³ = **8**.

Exemple : un rectangle de 6 cm × 4 cm (aire 24 cm²) agrandi avec k = 1,5 a une aire de 24 × 1,5² = 24 × 2,25 = **54 cm²**. Vérification : 9 × 6 = 54.

## Remonter au coefficient
| Ce qu'on sait | Ce qu'on en déduit |
| Les aires sont multipliées par 16 | k² = 16, donc k = **4** |
| Les volumes sont divisés par 8 | k³ = 1/8, donc k = **1/2** |

## Les échelles
L'échelle d'un plan ou d'une carte est le coefficient de réduction.

| L'échelle | Ce qu'elle signifie |
| 1/25 000 | 1 cm sur la carte = 25 000 cm = **250 m** en vrai |
| 1/100 | 1 cm sur le plan = 1 m en vrai |

1. 4 cm sur une carte au 1/25 000 : 4 × 25 000 = 100 000 cm = **1 km**.
2. Une voiture de 4,3 m en maquette au 1/43 : 430 cm ÷ 43 = **10 cm**.
3. Une pièce de 12 m² sur un plan au 1/100 : les aires sont divisées par 100² = 10 000, donc 12 m² = 120 000 cm² deviennent **12 cm²**.

## La pyramide coupée
Une section parallèle à la base découpe une petite pyramide, réduction de la grande. Exemple travaillé : une pyramide de hauteur 12 cm et de volume 240 cm³ est coupée à 6 cm du sommet.
1. Coefficient : k = 6 ÷ 12 = 1/2.
2. Volume de la petite pyramide : 240 × (1/2)³ = 240 ÷ 8 = **30 cm³**.
3. Volume du tronc restant : 240 − 30 = 210 cm³.

> Au brevet, écrire la phrase « la petite pyramide est une réduction de la grande de coefficient k = … » avant tout calcul : c'est elle qui justifie le k³.`,
          },
          questions: [
            ['Une figure est agrandie avec k = 3. Par combien son aire est-elle multipliée ?', ['3', '6', '27', '9'], 3, 'Les aires sont multipliées par k² = 9.'],
            ['Un solide est réduit avec k = 0,5. Par combien son volume est-il multiplié ?', ['0,5', '0,125', '0,25', '1,5'], 1, 'k³ = 0,5 × 0,5 × 0,5 = 0,125 : le volume est divisé par 8.'],
            ['Sur une carte au 1/25 000, deux villages sont à 4 cm. Quelle est la distance réelle ?', ['1 km', '100 m', '10 km', '4 km'], 0, '4 × 25 000 = 100 000 cm = 1 000 m = 1 km.'],
            ['Une voiture de 4,3 m est reproduite en maquette au 1/43. Quelle est la longueur de la maquette ?', ['43 cm', '1 cm', '10 cm', '4,3 cm'], 2, '430 cm ÷ 43 = 10 cm.'],
            ['Les aires d’une figure ont été multipliées par 16. Par combien ses longueurs l’ont-elles été ?', ['16', '8', '256', '4'], 3, 'k² = 16, donc k = 4.'],
            ['Les volumes d’un solide sont divisés par 8. Quel est le coefficient de réduction ?', ['1/8', '1/2', '1/4', '2'], 1, 'k³ = 1/8, donc k = 1/2.'],
            ['Une pyramide de volume 240 cm³ est coupée au milieu de sa hauteur, parallèlement à la base. Quel est le volume de la petite pyramide ?', ['30 cm³', '120 cm³', '60 cm³', '80 cm³'], 0, 'k = 1/2, donc V = 240 × 1/8 = 30 cm³.'],
            ['Un rectangle de 6 cm × 4 cm est agrandi avec k = 1,5. Quelle est l’aire de l’image ?', ['36 cm²', '54 cm²', '24 cm²', '60 cm²'], 1, '24 × 1,5² = 24 × 2,25 = 54 cm², soit 9 × 6.'],
            ['Un agrandissement ou une réduction conserve les angles.', ['Vrai', 'Faux'], 0, 'La forme est conservée : seules les dimensions changent.'],
            ['Un segment de 5 cm devient un segment de 2 cm. Quel est le coefficient ?', ['2,5', '0,4', '3', '−3'], 1, 'k = longueur de l’image ÷ longueur de départ = 2 ÷ 5 = 0,4.'],
            ['Si l’on double toutes les dimensions d’une boîte, on peut y mettre deux fois plus de sable.', ['Vrai', 'Faux'], 1, 'Le volume est multiplié par 2³ = 8.'],
            ['Sur un plan au 1/100, quelle surface occupe une pièce de 12 m² ?', ['1 200 cm²', '120 cm²', '0,12 cm²', '12 cm²'], 3, 'Les aires sont divisées par 100² = 10 000 : 120 000 cm² ÷ 10 000 = 12 cm².'],
          ],
        },

        // ===================================================================
        // 14. Méthode du brevet
        // ===================================================================
        {
          titre: 'Méthode : réussir l’épreuve de maths du brevet',
          axe: 'Réussir le brevet',
          lecon: {
            titre: 'Automatismes, problèmes, rédaction : la stratégie de l’épreuve',
            cours: `L'épreuve de mathématiques du brevet a changé : elle commence désormais par une partie d'**automatismes**, sans calculatrice. Connaître son déroulé, c'est déjà gagner des points.

## Le déroulé de l'épreuve
| La partie | Durée | Points | Calculatrice | Le format |
| **1. Automatismes** | 20 min | **6 / 20** | **Interdite** | Réponses directes, QCM ou vrai-faux, 0,5 ou 1 point chacune, sans justification |
| **2. Raisonnement et résolution de problèmes** | 1 h 40 | **14 / 20** | Autorisée (mode examen) | Exercices à justifier : 12 points, plus 2 points pour la rédaction et la clarté du raisonnement |

La partie 1 est ramassée au bout de 20 minutes. On reçoit tout le sujet au départ.

## Les automatismes à maîtriser
| Le domaine | Exemples de questions |
| **Fractions** | 3/4 de 20 = **15** ; simplifier 12/18 = 2/3 |
| **Calcul mental** | 25 × 4, 0,5 × 30, 10² |
| **Pourcentages** | 10 % de 350 = **35** ; 50 % = la moitié |
| **Proportionnalité** | Compléter un tableau, une quatrième proportionnelle |
| **Équations simples** | 2x + 3 = 11, donc x = **4** |
| **Lecture de graphique ou de diagramme** | Une image, un antécédent, un effectif |
| **Géométrie** | Périmètre, aire, triplets de Pythagore, somme des angles |
| **Probabilités** | Un tirage simple : 1/6, 1/2 |
| **Conversions** | 1 h 30 = 1,5 h ; 1 L = 1 dm³ |

> La stratégie : ne pas rester bloqué. Une question qui résiste plus de 30 secondes, on la passe et on y revient à la fin. Chaque question rapporte autant qu'une autre.

## La partie 2 : méthode en cinq temps
1. **Lire tout le sujet** (5 min) et repérer les exercices où l'on se sent le plus à l'aise.
2. **Commencer par un exercice sûr** pour prendre confiance. Les exercices sont indépendants : on peut les traiter dans l'ordre qu'on veut.
3. **Justifier chaque réponse**, sauf mention contraire : citer la propriété, vérifier ses hypothèses, conclure.
4. **Soigner les résultats** : l'unité, l'arrondi demandé, une phrase de conclusion.
5. **Garder 10 minutes** pour relire et vérifier les ordres de grandeur.

## Rédiger pour gagner les 2 points de rédaction
Modèle avec Pythagore :
- « Le triangle ABC est rectangle en A. »
- « D'après le théorème de Pythagore : BC² = AB² + AC². »
- « BC² = 6² + 8² = 36 + 64 = 100, donc BC = √100 = 10 cm. »

| Le théorème | L'hypothèse à écrire avant |
| Pythagore, trigonométrie | Le triangle est rectangle, et en quel sommet |
| Thalès | Les points alignés et les droites parallèles |
| Produit nul | L'équation est bien de la forme A × B = 0 |

## Les exercices qui reviennent
Scratch (lire un script, prédire une valeur), tableur (la formule d'une cellule), statistiques et probabilités, fonctions affines (comparer deux tarifs), géométrie dans l'espace (volumes, sections), Thalès et trigonométrie dans une même figure, pourcentages en contexte.

> Une recherche incomplète mais bien présentée rapporte des points : on n'efface pas un calcul entamé, on écrit ce qu'on a trouvé.

## Réglages avant l'épreuve
Calculatrice en mode **degrés** et en mode examen si nécessaire, formules d'aires et de volumes relues la veille, carrés parfaits jusqu'à 15² et tables de multiplication sûres pour les automatismes.`,
          },
          questions: [
            ['Combien de temps dure la partie automatismes de l’épreuve de maths du brevet ?', ['10 min', '20 min', '30 min', '1 h'], 1, 'Elle dure 20 minutes et elle est ramassée à la fin de ce temps.'],
            ['La calculatrice est-elle autorisée dans la partie automatismes ?', ['Oui, en mode examen', 'Oui, sans restriction', 'Seulement pour les fractions', 'Non, elle est interdite'], 3, 'Les automatismes se font sans calculatrice ; elle est autorisée dans la partie 2.'],
            ['Sur combien de points est notée la partie automatismes ?', ['6 points sur 20', '14 points sur 20', '2 points sur 20', '10 points sur 20'], 0, 'Automatismes : 6 points ; raisonnement et résolution de problèmes : 14 points.'],
            ['Que faire face à une question d’automatisme qui bloque ?', ['Rester dessus jusqu’à trouver', 'La passer et y revenir à la fin', 'Rendre la copie', 'Répondre au hasard sans relire'], 1, 'Toutes les questions rapportent à peu près autant : ne pas y laisser son temps.'],
            ['Que faut-il écrire avant d’appliquer le théorème de Pythagore ?', ['La valeur de π', 'Que les droites sont parallèles', 'Que le triangle est rectangle, et en quel sommet', 'La formule du cosinus'], 2, 'C’est l’hypothèse du théorème : sans elle, le raisonnement est incomplet.'],
            ['Dans la partie 2, une recherche incomplète mais bien présentée peut rapporter des points.', ['Vrai', 'Faux'], 0, 'Les correcteurs valorisent les démarches entamées : on n’efface pas un calcul commencé.'],
            ['Combien de points la partie 2 réserve-t-elle à la rédaction et à la clarté du raisonnement ?', ['6 points', '1 point', '2 points', '4 points'], 2, 'La partie 2 compte 12 points d’exercices et 2 points de rédaction.'],
            ['Comment présenter un résultat numérique dans la partie 2 ?', ['Avec l’arrondi demandé, l’unité et une phrase de conclusion', 'Avec le plus de décimales possible', 'Sans unité, pour gagner du temps', 'En écriture scientifique obligatoirement'], 0, 'L’arrondi et l’unité font partie de la réponse attendue.'],
            ['Automatisme : combien valent les 3/4 de 20 ?', ['12', '15', '16', '5'], 1, '20 ÷ 4 = 5, puis 5 × 3 = 15.'],
            ['Automatisme : combien vaut 10 % de 350 ?', ['3,5', '350', '35', '36'], 2, 'Prendre 10 %, c’est diviser par 10.'],
            ['Automatisme : quelle est la solution de 2x + 3 = 11 ?', ['x = 7', 'x = 5,5', 'x = 8', 'x = 4'], 3, '2x = 8, donc x = 4.'],
            ['Dans la partie 2, on peut donner un résultat sans justification quand on est sûr de soi.', ['Vrai', 'Faux'], 1, 'Toute réponse doit être justifiée, sauf indication contraire de l’énoncé.'],
          ],
        },
      ],
    },
  ],
}
