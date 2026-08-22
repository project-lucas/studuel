// Physique-Chimie TERMINALE (spécialité) — les 31 fiches du programme officiel,
// dans l'ordre de ses 7 chapitres : « Déterminer les composantes d'un système
// chimique » (4), « Modéliser l'évolution temporelle d'un système chimique » (4),
// « Prévoir l'état final d'un système chimique » (5), « Stratégies en synthèse
// organique » (2), « Mouvements et interactions » (5), « L'énergie : conversion
// et transferts » (4), « Ondes et signaux » (7).
//
// POURQUOI UN MODULE NEUF plutôt qu'un ajout dans une migration existante : la
// physique-chimie de Terminale vient de la migration 143, DÉJÀ EXÉCUTÉE et
// écrite à la main, qui ne doit plus jamais être régénérée. Le slug
// `physique-chimie` n'avait encore aucun module dans scripts/contenu — d'où la
// génération par `--modules`, pour que la commande imprimée dans l'en-tête reste
// juste le jour où un second module apparaîtra (cf. le README).
//
// PÉRIMÈTRE : la TERMINALE SEULE. Le ménage est borné à `level = 'Tle'` : les
// six autres niveaux de physique-chimie (6e → 1re) portent les mêmes leçons
// génériques (« L'essentiel du cours », « Exercices types ») et ne bougent pas.
//
// LE DÉCOUPAGE EST CELUI DES 7 CHAPITRES, pas des 4 thèmes du BO. Le BO range le
// programme sous quatre thèmes (« Constitution et transformations de la
// matière » → chapitres 1 à 4, « Mouvement et interactions » → 5, « L'énergie :
// conversions et transferts » → 6, « Ondes et signaux » → 7). Laisser le premier
// thème d'un bloc lui ferait peser 15 fiches sur 31 — la moitié du dossier sous
// un seul en-tête, ce qui ne range presque rien. Ce sont les chapitres, pas les
// thèmes, que l'élève lit sur le cahier de son professeur. Même arbitrage que
// pour l'enseignement scientifique (248) et la SVT (251).

export default {
  slug: 'physique-chimie',
  nom: 'Physique-Chimie',

  titreMigration: 'PHYSIQUE-CHIMIE Tle (spécialité) — LE PROGRAMME OFFICIEL (31 fiches)',

  motif: `CONSTAT MESURÉ (node _ASSOCIE/sonde-chapitres.mjs Tle physique-chimie,
20/08/2026) : la spécialité physique-chimie de Terminale n'avait que CINQ
chapitres, taillés dans un découpage maison hérité des migrations 008 et 143
(« Cinétique chimique », « Acides et bases », « Mécanique : lois de Newton »,
« Ondes lumineuses : diffraction », « Énergie et thermodynamique »), chacun
résumant un pan entier du programme en UNE fiche de dix questions. Des chapitres
entiers du BO n'avaient aucune entrée : la radioactivité et la décroissance
radioactive, les piles et l'électrolyse, l'équilibre chimique et le quotient de
réaction, toute la synthèse organique, le mouvement dans un champ de gravitation
et les lois de Kepler, l'écoulement des fluides, le premier principe de la
thermodynamique, les transferts thermiques, l'intensité sonore, l'effet Doppler,
les interférences, la lunette astronomique, le photon, le condensateur. Sur une
spécialité à coefficient 16, dont l'épreuve dure 3 h 30, un élève ne trouvait
rien sur les deux tiers de son année.

Cette migration installe les 31 fiches du programme, rangées sous ses 7
chapitres, et retire les 5 fiches composites qu'elles recouvrent.

PÉRIMÈTRE : la TERMINALE SEULE. Le ménage est borné au niveau Tle — les six
autres niveaux de physique-chimie portent les mêmes leçons génériques et ne sont
pas touchés.

⚠️ CE QUI EST PERDU AU PASSAGE : les 5 leçons « Exercices types » de la 143
(elles n'ont aucun quiz en base, sondé le 20/08/2026) et les 50 questions des 5
leçons « L'essentiel du cours ». Elles étaient adossées au découpage composite ;
les réécrire fiche par fiche est un chantier à part.

⚠️ LES MIGRATIONS 008 ET 143 SONT REJOUABLES : les recoller un jour ferait
revenir les 5 fiches composites en doublon des 31 fiches du programme.`,

  menage: [
    {
      raison: `La colonne chapters.theme (migration 234) conditionne tout ce qui suit :
ce module range ses 31 fiches sous 7 chapitres, et l'INSERT écrit la colonne.
Elle est REPRISE ici en ADD COLUMN IF NOT EXISTS parce que la 234 n'a jamais été
exécutée en production (sondé le 20/08/2026) — sans cette reprise, la migration
échouerait sur "column chapters.theme does not exist", les 5 anciennes fiches
déjà supprimées et les 31 neuves pas encore posées : une matière vide.
Le GRANT n'est pas décoratif : la migration 182 a révoqué le SELECT de table sur
chapters (pour cacher mind_map) et ne l'a rendu que colonne par colonne. Une
colonne ajoutée après elle n'hérite d'aucun droit — sans lui, l'app lirait
"permission denied" au lieu du chapitre.`,
      sql: `ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;`,
    },
    {
      raison: `Les 5 fiches composites partent, au niveau Tle SEULEMENT. Ce sont des
résumés d'un chapitre entier du BO en une fiche, que les 31 fiches neuves
recouvrent : « Cinétique chimique » se lit désormais en « Suivi temporel d'une
réaction chimique : modèle macroscopique » et « Étapes d'une transformation
chimique : modèle microscopique », « Acides et bases » en quatre fiches réparties
sur les chapitres 1 et 3, « Énergie et thermodynamique » en les quatre fiches du
chapitre 6.
L'ordre compte : la file « À revoir » d'abord (review_items.item_id n'a PAS de
clé étrangère — rien ne casserait, mais le compteur « X à revoir » continuerait
de compter des questions disparues), puis les quiz (quizzes.lesson_id est
ON DELETE SET NULL : ils survivraient orphelins à leur chapitre, et toujours
tirables par le moteur de questions), puis les chapitres, dont les leçons, fiches
de révision, supports et progression partent en cascade.
Les trois DELETE sont bornés aux CINQ TITRES EXACTS et au seul niveau Tle. Sans
cette borne, un rejeu effacerait les quiz des 31 fiches neuves — le ménage tourne
avant les insertions à CHAQUE passage.
Aucun des cinq titres ne porte d'apostrophe : contrairement au ménage de la 249,
il n'y a pas ici de piège d'apostrophe typographique.`,
      sql: `DELETE FROM public.review_items ri
 USING public.quiz_questions qq, public.quizzes qz, public.lessons l,
       public.chapters c, public.subjects s
 WHERE ri.item_kind = 'question'
   AND ri.item_id = qq.id
   AND qq.quiz_id = qz.id
   AND qz.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'physique-chimie'
   AND c.level = 'Tle'
   AND c.title IN ('Cinétique chimique',
                   'Acides et bases',
                   'Mécanique : lois de Newton',
                   'Ondes lumineuses : diffraction',
                   'Énergie et thermodynamique');

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'physique-chimie'
   AND c.level = 'Tle'
   AND c.title IN ('Cinétique chimique',
                   'Acides et bases',
                   'Mécanique : lois de Newton',
                   'Ondes lumineuses : diffraction',
                   'Énergie et thermodynamique');

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'physique-chimie'
   AND c.level = 'Tle'
   AND c.title IN ('Cinétique chimique',
                   'Acides et bases',
                   'Mécanique : lois de Newton',
                   'Ondes lumineuses : diffraction',
                   'Énergie et thermodynamique');`,
    },
  ],

  blocs: [
    {
      niveaux: ['Tle'],
      chapitres: [
        // ---- Chapitre 1 : Déterminer les composantes d'un système chimique ----
        {
          titre: 'Acides et bases selon Brönsted',
          axe: 'Déterminer les composantes d’un système chimique',
          lecon: {
            titre: 'Un proton qui change de main',
            cours: `Toute la chimie des solutions de Terminale tient dans une seule particule qui se déplace : le **proton H⁺**. Brönsted en a donné une définition qui vaut pour toutes les réactions acido-basiques.

## Les deux définitions
Un **acide** est une espèce capable de **céder** un proton H⁺. Une **base** est une espèce capable d’en **capter** un. Rien n’est acide ou basique dans l’absolu : une espèce l’est **face à une autre**, qui joue le rôle inverse.

## Le couple acide/base
À tout acide AH correspond la base A⁻ qu’il devient en perdant son proton : c’est un **couple acide/base**, noté AH/A⁻, relié par une **demi-équation** :

AH = A⁻ + H⁺

Exemples à connaître : CH₃COOH/CH₃COO⁻, NH₄⁺/NH₃, H₃O⁺/H₂O, H₂O/HO⁻, CO₂,H₂O/HCO₃⁻.

## La réaction acido-basique
Le proton ne reste jamais seul en solution : il passe **directement** de l’acide d’un couple à la base d’un autre. On additionne les deux demi-équations, l’une dans le sens direct, l’autre dans le sens inverse :

CH₃COOH + HO⁻ → CH₃COO⁻ + H₂O

Une réaction acido-basique est donc toujours un **transfert de proton entre deux couples**.

## L’eau, espèce amphotère
L’eau appartient à deux couples : elle est l’acide de H₂O/HO⁻ et la base de H₃O⁺/H₂O. Une espèce qui joue les deux rôles est dite **amphotère** — c’est aussi le cas de HCO₃⁻ et des acides aminés.

## L’autoprotolyse de l’eau
Deux molécules d’eau échangent un proton entre elles :

2 H₂O = H₃O⁺ + HO⁻

Cette réaction, très limitée, explique pourquoi l’eau pure conduit (faiblement) le courant et pourquoi H₃O⁺ et HO⁻ sont toujours présents ensemble.

> Le proton H⁺ n’existe pas libre en solution aqueuse : il est immédiatement fixé par une molécule d’eau pour donner l’**ion oxonium H₃O⁺**. C’est pour cela qu’on écrit H₃O⁺ dans les équations, et H⁺ seulement dans les demi-équations.`,
          },
          questions: [
            ['Selon Brönsted, un acide est une espèce qui…', ['Cède un proton H⁺', 'Capte un proton H⁺', 'Cède un électron', 'Libère un ion HO⁻'], 0, 'La base, elle, capte le proton. La définition ne parle ni d’électron ni de HO⁻.'],
            ['Quelle est la base conjuguée de l’acide éthanoïque CH₃COOH ?', ['CH₃COO⁻', 'CH₃COOH₂⁺', 'CH₃OH', 'CH₃CO⁻'], 0, 'L’acide perd son proton : CH₃COOH = CH₃COO⁻ + H⁺.'],
            ['Une espèce amphotère peut jouer le rôle d’acide ET de base.', ['Vrai', 'Faux'], 0, 'L’eau est le cas type : acide du couple H₂O/HO⁻, base du couple H₃O⁺/H₂O.'],
            ['Dans une réaction acido-basique, que s’échangent les réactifs ?', ['Un proton H⁺', 'Un électron', 'Un neutron', 'Une molécule d’eau'], 0, 'Le transfert d’électron, lui, définit une réaction d’oxydoréduction.'],
            ['Pourquoi écrit-on H₃O⁺ plutôt que H⁺ dans les équations en solution aqueuse ?', ['Le proton est aussitôt fixé par une molécule d’eau', 'Parce que H⁺ n’a pas de charge', 'Par convention d’écriture des manuels', 'Parce que l’eau est un acide fort'], 0, 'Le proton libre n’existe pas en solution : il donne l’ion oxonium H₃O⁺.'],
            ['L’équation 2 H₂O = H₃O⁺ + HO⁻ porte le nom de…', ['Autoprotolyse de l’eau', 'Électrolyse de l’eau', 'Dissolution de l’eau', 'Hydrolyse acide'], 0, 'Elle explique la présence simultanée de H₃O⁺ et HO⁻ dans toute solution aqueuse.'],
            ['NH₄⁺ et NH₃ forment un couple acide/base.', ['Vrai', 'Faux'], 0, 'NH₄⁺ = NH₃ + H⁺ : NH₄⁺ est l’acide, NH₃ la base conjuguée.'],
            ['Une demi-équation acido-basique s’écrit sous la forme…', ['AH = A⁻ + H⁺', 'AH = A⁻ + e⁻', 'AH + H₂O = A⁻', 'A⁻ = AH + HO⁻'], 0, 'Elle isole le proton, qui sera pris en charge par la base de l’autre couple.'],
          ],
        },
        {
          titre: 'Le pH des solutions',
          axe: 'Déterminer les composantes d’un système chimique',
          lecon: {
            titre: 'Une échelle logarithmique, pas une échelle de valeurs',
            cours: `Les concentrations en ions oxonium d’une solution courante s’étalent sur quatorze puissances de dix. Les comparer en écriture décimale serait illisible : le **pH** compresse cette étendue sur une échelle de 0 à 14.

## La définition
pH = −log([H₃O⁺]/c°), où c° = 1 mol·L⁻¹ est la concentration standard (elle rend l’argument du logarithme sans dimension). En pratique :

[H₃O⁺] = c° × 10^(−pH)

Un pH mesuré au dixième près donne une concentration à environ 2 % près : au-delà d’une décimale, le chiffre n’a plus de sens expérimental.

## Ce que « une unité de pH » veut dire
Une unité de pH = un **facteur 10** sur la concentration. Passer de pH 3 à pH 2, c’est multiplier [H₃O⁺] par 10, pas l’augmenter d’un tiers.

## Le produit ionique de l’eau
Dans toute solution aqueuse à 25 °C :

Ke = ([H₃O⁺]/c°) × ([HO⁻]/c°) = 1,0 × 10⁻¹⁴, soit pKe = 14,0

Les deux concentrations sont donc **liées** : si l’une monte, l’autre descend. C’est pourquoi une solution basique contient tout de même des ions H₃O⁺.

## Acide, neutre, basique
- solution **acide** : [H₃O⁺] > [HO⁻], donc pH < 7,0 à 25 °C ;
- solution **neutre** : [H₃O⁺] = [HO⁻] = 1,0 × 10⁻⁷ mol·L⁻¹, donc pH = 7,0 ;
- solution **basique** : pH > 7,0.

Le 7 n’est pas une constante universelle : il vaut 7,0 **à 25 °C**, parce que Ke dépend de la température.

## L’effet d’une dilution
Diluer une solution d’acide fort **dix fois** augmente son pH d’**une unité** (et le diminue d’une unité pour une base forte). La dilution rapproche le pH de 7 sans jamais le franchir : une solution acide diluée reste acide.

> Un pH-mètre s’**étalonne** avant chaque série de mesures avec au moins deux solutions tampon (pH 4,0 et 7,0 par exemple) : la sonde dérive, et une mesure non étalonnée peut se tromper de plusieurs dixièmes.`,
          },
          questions: [
            ['Quelle relation donne [H₃O⁺] à partir du pH ?', ['[H₃O⁺] = c° × 10^(−pH)', '[H₃O⁺] = c° × 10^(pH)', '[H₃O⁺] = pH / 14', '[H₃O⁺] = c° × ln(pH)'], 0, 'C’est la relation réciproque de pH = −log([H₃O⁺]/c°).'],
            ['Une solution de pH 3 est combien de fois plus concentrée en H₃O⁺ qu’une solution de pH 5 ?', ['100 fois', '2 fois', '10 fois', '1000 fois'], 0, 'Deux unités de pH = deux puissances de dix.'],
            ['Que vaut le produit ionique de l’eau Ke à 25 °C ?', ['1,0 × 10⁻¹⁴', '1,0 × 10⁻⁷', '1,0 × 10⁻¹', '14'], 0, 'Soit pKe = 14,0. C’est lui qui fixe la neutralité à pH 7,0 à cette température.'],
            ['Une solution basique ne contient aucun ion H₃O⁺.', ['Vrai', 'Faux'], 1, 'Le produit ionique impose leur présence : ils sont seulement moins nombreux que les HO⁻.'],
            ['On dilue dix fois une solution d’acide chlorhydrique de pH 2. Le nouveau pH vaut environ…', ['3', '1', '20', '7'], 0, 'Diluer 10 fois un acide fort augmente le pH d’une unité.'],
            ['Pourquoi le pH de neutralité vaut-il 7,0 seulement à 25 °C ?', ['Parce que Ke dépend de la température', 'Parce que les pH-mètres sont réglés à 25 °C', 'Parce que l’eau gèle en dessous', 'Ce n’est pas vrai, il vaut toujours 7,0'], 0, 'La neutralité est définie par [H₃O⁺] = [HO⁻], donc par pH = pKe/2, qui varie avec T.'],
            ['Combien de décimales un pH mesuré a-t-il de sens expérimental ?', ['Une seule', 'Trois', 'Aucune', 'Autant que l’affichage en donne'], 0, 'Le dixième d’unité correspond déjà à environ 2 % sur la concentration.'],
            ['Avant une série de mesures, un pH-mètre doit être étalonné avec des solutions tampon.', ['Vrai', 'Faux'], 0, 'Au moins deux, encadrant la zone de mesure : la sonde dérive avec le temps.'],
          ],
        },
        {
          titre: 'Propriétés électriques des solutions',
          axe: 'Déterminer les composantes d’un système chimique',
          lecon: {
            titre: 'Ce que la conductivité sait dire des ions présents',
            cours: `Une solution ionique conduit le courant parce que ses **ions se déplacent**. Mesurer cette aptitude, c’est mesurer indirectement combien d’ions sont là — et lesquels.

## Conductance et conductivité
La **conductance** G d’une portion de solution, en siemens (S), est l’inverse de sa résistance : G = 1/R = I/U. Elle dépend de la cellule de mesure (surface S des électrodes, distance L entre elles) :

G = σ × S/L

La **conductivité** σ, en S·m⁻¹, ne dépend plus de la géométrie : c’est une propriété de la solution seule. On l’obtient avec un conductimètre préalablement **étalonné** sur une solution de conductivité connue.

## La loi de Kohlrausch
Chaque ion apporte sa part, indépendamment des autres, tant que la solution est diluée :

σ = Σ λᵢ × [Xᵢ]

où λᵢ est la **conductivité molaire ionique** de l’ion Xᵢ (en S·m²·mol⁻¹), tabulée à 25 °C. Attention aux unités : les concentrations y entrent en **mol·m⁻³**, pas en mol·L⁻¹ (1 mol·L⁻¹ = 10³ mol·m⁻³).

## Tous les ions ne se valent pas
H₃O⁺ (35,0 mS·m²·mol⁻¹) et HO⁻ (19,9) conduisent bien mieux que les autres, d’un facteur 5 environ. Ils se déplacent par **relais de proton** de molécule d’eau en molécule d’eau, sans avoir à traverser physiquement la solution.

## Le titrage conductimétrique
C’est la conséquence directe de la remarque précédente. Au cours d’un titrage, la conductivité varie **linéairement par morceaux** : chaque segment correspond à un jeu d’ions donné, et la **rupture de pente** marque l’équivalence. On trace les deux droites, on lit leur intersection.

C’est la méthode de choix quand la solution est **colorée ou trouble** (un indicateur coloré y serait invisible) ou quand la réaction donne un saut de pH trop peu marqué.

> Toujours travailler avec un grand volume dans le bécher, ou **corriger la dilution** : sans cela, l’ajout de solution titrante dilue les ions et courbe les segments qu’on veut droits.`,
          },
          questions: [
            ['Quelle est l’unité de la conductivité σ ?', ['S·m⁻¹', 'S', 'S·m²·mol⁻¹', 'Ω'], 0, 'Le siemens seul est l’unité de la conductance G ; S·m²·mol⁻¹ celle de λ.'],
            ['La conductance G dépend de la géométrie de la cellule de mesure.', ['Vrai', 'Faux'], 0, 'G = σ × S/L. La conductivité σ, elle, ne dépend que de la solution.'],
            ['Que dit la loi de Kohlrausch ?', ['La conductivité est la somme des contributions de chaque ion', 'La conductivité est proportionnelle au pH', 'La conductance est inversement proportionnelle à la concentration', 'Tous les ions ont la même conductivité molaire'], 0, 'σ = Σ λᵢ[Xᵢ], valable en solution diluée.'],
            ['Dans la loi de Kohlrausch, en quelle unité entrent les concentrations ?', ['mol·m⁻³', 'mol·L⁻¹', 'g·L⁻¹', 'mol'], 0, 'Piège classique : 1 mol·L⁻¹ = 10³ mol·m⁻³.'],
            ['Quels ions conduisent le mieux le courant en solution aqueuse ?', ['H₃O⁺ et HO⁻', 'Na⁺ et Cl⁻', 'Ca²⁺ et SO₄²⁻', 'Tous conduisent également'], 0, 'Ils se déplacent par relais de proton entre molécules d’eau, d’où un λ environ 5 fois plus grand.'],
            ['Comment repère-t-on l’équivalence sur un titrage conductimétrique ?', ['À la rupture de pente entre deux segments de droite', 'Au maximum de la courbe', 'Au changement de couleur', 'À l’annulation de la conductivité'], 0, 'On trace les deux droites et on lit leur intersection.'],
            ['Le titrage conductimétrique est adapté à une solution colorée ou trouble.', ['Vrai', 'Faux'], 0, 'Un indicateur coloré y serait invisible ; la conductivité, elle, se mesure quand même.'],
            ['Pourquoi travailler avec un grand volume dans le bécher lors d’un titrage conductimétrique ?', ['Pour limiter l’effet de dilution par la solution titrante', 'Pour accélérer la réaction', 'Pour économiser du réactif', 'Pour élever la température'], 0, 'Sans cela, la dilution courbe les segments qu’on veut droits.'],
          ],
        },
        {
          titre: 'Propriétés spectrales des substances chimiques et solutions',
          axe: 'Déterminer les composantes d’un système chimique',
          lecon: {
            titre: 'Lire une espèce dans la lumière qu’elle absorbe',
            cours: `Une espèce chimique n’absorbe pas la lumière n’importe comment : elle prélève des longueurs d’onde précises, qui la signent. Trois spectroscopies exploitent ce fait, chacune sur son domaine.

## Spectroscopie UV-visible : doser
Une solution colorée absorbe la couleur **complémentaire** de celle qu’elle laisse passer : une solution bleue absorbe dans l’orange. On mesure l’**absorbance** A, sans unité, à la longueur d’onde λ_max où l’absorption est maximale — c’est là que la mesure est la plus sensible.

## La loi de Beer-Lambert
A = ε × ℓ × c

- ε : coefficient d’absorption molaire (L·mol⁻¹·cm⁻¹), propre à l’espèce ET à λ ;
- ℓ : largeur de la cuve (cm) ;
- c : concentration (mol·L⁻¹).

L’absorbance est donc **proportionnelle à la concentration** — mais seulement pour les solutions **diluées** (au-delà de A ≈ 2, la loi décroche).

## Le dosage par étalonnage
On prépare une gamme de solutions de concentrations connues, on mesure leur absorbance à λ_max, on trace la **droite d’étalonnage** A = f(c) qui doit passer par l’origine, puis on y reporte l’absorbance de la solution inconnue. Le spectrophotomètre est réglé au préalable sur le « blanc » (solvant seul), qui fixe le zéro.

## Spectroscopie infrarouge : identifier les groupes
L’IR sonde les **vibrations des liaisons**. Chaque groupe caractéristique donne une bande à un nombre d’onde tabulé : O—H d’alcool, large, vers 3300 cm⁻¹ ; C=O vers 1700 cm⁻¹ ; O—H d’acide carboxylique, très large, de 2500 à 3200 cm⁻¹. L’IR ne compte pas les atomes : il dit **quelles familles** sont présentes, et sert donc à suivre une transformation (disparition d’une bande, apparition d’une autre).

## Spectroscopie RMN : compter les hydrogènes
La RMN du proton donne, pour chaque groupe d’hydrogènes équivalents, un **signal** dont on lit trois choses : le **déplacement chimique** δ (l’environnement), la **courbe d’intégration** (le nombre de H) et la **multiplicité** (n voisins → n+1 pics, règle des (n+1)-uplets).

> Ces trois spectroscopies sont **complémentaires** : l’UV-visible quantifie, l’IR reconnaît les fonctions, la RMN reconstruit le squelette.`,
          },
          questions: [
            ['Que relie la loi de Beer-Lambert ?', ['L’absorbance et la concentration', 'L’absorbance et la température', 'La conductivité et la concentration', 'Le pH et l’absorbance'], 0, 'A = ε × ℓ × c, pour une solution diluée et à une longueur d’onde fixée.'],
            ['À quelle longueur d’onde effectue-t-on une mesure d’absorbance ?', ['À λ_max, où l’absorption est maximale', 'À 500 nm systématiquement', 'À la longueur d’onde de la couleur de la solution', 'À n’importe quelle longueur d’onde'], 0, 'C’est là que la mesure est la plus sensible et la moins affectée par un léger décalage.'],
            ['Une solution bleue absorbe principalement…', ['Dans l’orange', 'Dans le bleu', 'Dans le vert', 'Dans l’ultraviolet'], 0, 'Une solution laisse passer sa couleur et absorbe la couleur complémentaire.'],
            ['La droite d’étalonnage A = f(c) doit passer par l’origine.', ['Vrai', 'Faux'], 0, 'Une solution de concentration nulle n’absorbe pas — d’où le réglage préalable du « blanc ».'],
            ['Quelle spectroscopie identifie les groupes caractéristiques d’une molécule ?', ['L’infrarouge', 'L’UV-visible', 'La RMN du carbone uniquement', 'La spectroscopie de masse'], 0, 'L’IR sonde les vibrations des liaisons : chaque groupe donne une bande à un nombre d’onde tabulé.'],
            ['En RMN du proton, que lit-on sur la courbe d’intégration ?', ['Le nombre d’hydrogènes du groupe', 'Le nombre de voisins', 'La masse molaire', 'Le déplacement chimique'], 0, 'La multiplicité donne les voisins (règle des n+1), le déplacement chimique donne l’environnement.'],
            ['Un signal RMN qui se présente en triplet indique combien d’hydrogènes voisins ?', ['Deux', 'Trois', 'Un', 'Quatre'], 0, 'Règle des (n+1)-uplets : 3 pics = 2 voisins.'],
            ['La loi de Beer-Lambert reste valable quelle que soit la concentration.', ['Vrai', 'Faux'], 1, 'Elle décroche pour les solutions concentrées, au-delà d’une absorbance d’environ 2.'],
          ],
        },
        // ---- Chapitre 2 : Modéliser l'évolution temporelle d'un système ------
        {
          titre: 'Suivi temporel d’une réaction chimique : modèle macroscopique',
          axe: 'Modéliser l’évolution temporelle d’un système chimique',
          lecon: {
            titre: 'La vitesse d’une réaction, c’est une pente',
            cours: `Deux transformations peuvent aboutir au même état final et mettre l’une une seconde, l’autre un mois. La thermodynamique dit **où** on va ; la cinétique dit **en combien de temps**.

## La vitesse volumique de réaction
Pour une réaction d’équation a A + b B → c C, on définit la vitesse volumique à partir de l’avancement :

v = (1/V) × dx/dt

En pratique, on la relie à une concentration : v = −(1/a) × d[A]/dt = +(1/c) × d[C]/dt. Le signe moins compense la **disparition** du réactif, pour que la vitesse reste positive.

## Comment on la lit sur une courbe
La vitesse est le **coefficient directeur de la tangente** à la courbe [A] = f(t). Elle est donc **maximale au début** (les réactifs sont les plus concentrés) et **s’annule à la fin** : la courbe s’aplatit. Une réaction ne ralentit pas parce qu’elle « fatigue », mais parce qu’il reste moins de réactif.

## Le temps de demi-réaction
Noté t₁/₂, c’est la durée au bout de laquelle l’avancement atteint **la moitié** de sa valeur finale. Il fournit l’ordre de grandeur de la durée totale : au bout d’environ 5 à 7 fois t₁/₂, la transformation est pratiquement terminée.

## Les facteurs cinétiques
- la **température** : l’élever accélère (plus de chocs, et plus énergétiques) ;
- la **concentration** des réactifs : plus elle est grande, plus la vitesse est grande ;
- le **catalyseur** : il accélère sans être consommé ni figurer dans le bilan ;
- l’**état de division** d’un solide, l’éclairement pour une réaction photochimique.

La **trempe** exploite le premier : refroidir brutalement (ou diluer) un prélèvement **fige** la réaction le temps de le titrer.

## La loi de vitesse d’ordre 1
Quand v = k × [A], la concentration décroît exponentiellement :

[A](t) = [A]₀ × e^(−kt), et t₁/₂ = ln2 / k

Le temps de demi-réaction y est **indépendant de la concentration initiale** — signature qu’on reconnaît sur un graphe. La constante k, elle, dépend de la température.

> Le choix de la méthode de suivi dépend de ce qui change : **spectrophotométrie** si une espèce est colorée, **conductimétrie** si le nombre ou la nature des ions varie, **pH-métrie**, mesure de pression pour un gaz, ou titrages successifs avec trempe.`,
          },
          questions: [
            ['Pourquoi écrit-on un signe moins dans v = −d[A]/dt pour un réactif ?', ['Pour que la vitesse reste positive malgré la disparition de A', 'Parce que la concentration est négative', 'Pour convertir en mol·L⁻¹', 'C’est une erreur d’écriture fréquente'], 0, '[A] décroît, donc sa dérivée est négative : le signe moins rétablit une vitesse positive.'],
            ['Comment lit-on la vitesse de réaction sur la courbe [A] = f(t) ?', ['C’est le coefficient directeur de la tangente', 'C’est l’ordonnée à l’origine', 'C’est l’aire sous la courbe', 'C’est la valeur finale de [A]'], 0, 'La vitesse est une dérivée : elle se lit sur la pente, pas sur la hauteur.'],
            ['La vitesse d’une réaction est maximale…', ['Au début de la transformation', 'À la fin', 'Au temps de demi-réaction', 'Elle est constante'], 0, 'Les réactifs sont alors les plus concentrés ; la courbe s’aplatit ensuite.'],
            ['Que désigne le temps de demi-réaction t₁/₂ ?', ['La durée au bout de laquelle l’avancement atteint la moitié de sa valeur finale', 'La moitié de la durée totale', 'Le temps de disparition complète du réactif limitant', 'La durée d’un chauffage à reflux'], 0, 'Après 5 à 7 fois t₁/₂, la transformation est pratiquement terminée.'],
            ['Élever la température accélère une réaction chimique.', ['Vrai', 'Faux'], 0, 'Les chocs entre entités sont plus nombreux et plus énergétiques.'],
            ['À quoi sert la trempe lors d’un suivi par titrages successifs ?', ['À figer la réaction dans le prélèvement le temps du titrage', 'À accélérer la réaction', 'À colorer la solution', 'À étalonner le pH-mètre'], 0, 'On refroidit brutalement ou on dilue : ce sont les facteurs cinétiques joués à l’envers.'],
            ['Pour une réaction d’ordre 1, le temps de demi-réaction dépend de la concentration initiale.', ['Vrai', 'Faux'], 1, 'Il vaut ln2/k : c’est justement la signature d’un ordre 1.'],
            ['Un catalyseur…', ['Accélère la réaction sans être consommé', 'Déplace l’état final vers plus de produits', 'Est consommé en quantité stœchiométrique', 'Diminue la température du système'], 0, 'Il n’apparaît pas dans l’équation de bilan et ne change pas l’état final.'],
          ],
        },
        {
          titre: 'Étapes d’une transformation chimique : modèle microscopique',
          axe: 'Modéliser l’évolution temporelle d’un système chimique',
          lecon: {
            titre: 'Ce qui se passe vraiment entre deux molécules',
            cours: `L’équation de bilan est un **résumé comptable** : elle dit ce qui entre et ce qui sort, jamais comment. Le **mécanisme réactionnel** décrit le trajet réel, en une suite d’étapes.

## L’acte élémentaire
Un **acte élémentaire** est une étape qui se produit en une seule rencontre, sans étape intermédiaire. Il met en jeu au plus deux entités (les chocs à trois sont trop improbables). Un mécanisme est une **succession d’actes élémentaires** dont la somme redonne l’équation de bilan.

## L’intermédiaire réactionnel
Une espèce **formée puis consommée** au cours du mécanisme n’apparaît pas dans le bilan : c’est un **intermédiaire réactionnel** (carbocation, radical…). Sa durée de vie est très courte ; il est souvent indétectable directement.

## Le catalyseur, vu de près
Un catalyseur ouvre un **chemin réactionnel différent**, dont les étapes demandent moins d’énergie. Il est consommé à une étape et **régénéré** à une autre : d’où son absence du bilan malgré sa participation réelle. Il ne modifie **ni l’état final ni la constante d’équilibre** — seulement la durée.

## Sites donneurs et sites accepteurs
Une étape se comprend en repérant, sur les molécules, **où sont les électrons disponibles** :
- **site donneur** : doublet non liant, liaison multiple, atome porteur d’une charge négative ou d’un δ⁻ ;
- **site accepteur** : atome porteur d’une charge positive ou d’un δ⁺, dû à une différence d’**électronégativité** (C—O, C—Cl, C=O).

## Les flèches courbes
Une flèche courbe part **toujours du site donneur** et pointe **vers le site accepteur**. Elle représente le mouvement d’un **doublet d’électrons**, jamais le déplacement d’un atome. C’est la convention à respecter à la lettre : une flèche à l’envers est comptée fausse.

## Le lien avec les facteurs cinétiques
À l’échelle microscopique, une réaction avance par **chocs efficaces** — c’est-à-dire assez énergétiques ET bien orientés. Augmenter la concentration multiplie les chocs ; augmenter la température rend une plus grande part d’entre eux assez énergétiques. Les deux facteurs cinétiques du chapitre précédent s’expliquent ainsi.

> Le mécanisme ne se devine pas d’après le bilan : il s’établit expérimentalement, et deux réactions au bilan identique peuvent suivre des chemins totalement différents.`,
          },
          questions: [
            ['Qu’est-ce qu’un acte élémentaire ?', ['Une étape se produisant en une seule rencontre, sans intermédiaire', 'L’équation de bilan de la réaction', 'La réaction la plus rapide du mécanisme', 'Un choc entre trois molécules'], 0, 'Il met en jeu au plus deux entités : les chocs à trois sont trop improbables.'],
            ['Une flèche courbe, dans un mécanisme, représente…', ['Le mouvement d’un doublet d’électrons', 'Le déplacement d’un atome', 'Le sens d’évolution du système', 'Un transfert de proton uniquement'], 0, 'Elle part du site donneur et pointe vers le site accepteur.'],
            ['Un intermédiaire réactionnel figure dans l’équation de bilan.', ['Vrai', 'Faux'], 1, 'Formé puis consommé, il se simplifie dans la somme des actes élémentaires.'],
            ['Qu’est-ce qui fait d’un atome un site accepteur ?', ['Une charge positive ou une charge partielle δ⁺', 'Un doublet non liant', 'Une liaison double', 'Une charge négative'], 0, 'La polarisation vient d’une différence d’électronégativité, comme dans C=O ou C—Cl.'],
            ['Comment un catalyseur agit-il, à l’échelle microscopique ?', ['Il ouvre un chemin réactionnel moins coûteux en énergie', 'Il augmente la concentration des réactifs', 'Il déplace l’équilibre vers les produits', 'Il élève la température du milieu'], 0, 'Consommé puis régénéré, il change la durée mais ni l’état final ni la constante d’équilibre.'],
            ['Un choc efficace est un choc…', ['Assez énergétique et bien orienté', 'Entre trois entités au moins', 'Toujours suivi d’une réaction', 'Entre deux catalyseurs'], 0, 'C’est l’explication microscopique des facteurs cinétiques.'],
            ['La somme des actes élémentaires d’un mécanisme redonne l’équation de bilan.', ['Vrai', 'Faux'], 0, 'Les intermédiaires réactionnels s’y simplifient, puisqu’ils sont formés puis consommés.'],
            ['Un doublet non liant sur un atome d’oxygène fait de lui…', ['Un site donneur d’électrons', 'Un site accepteur d’électrons', 'Un catalyseur', 'Un intermédiaire réactionnel'], 0, 'Les électrons disponibles y sont : la flèche courbe part de là.'],
          ],
        },
        {
          titre: 'La radioactivité naturelle',
          axe: 'Modéliser l’évolution temporelle d’un système chimique',
          lecon: {
            titre: 'Quand le noyau, et non le cortège, se transforme',
            cours: `Toute la chimie jouait jusqu’ici sur les électrons. La radioactivité, elle, touche au **noyau** : elle change l’élément lui-même, et aucune action chimique ou physique ordinaire ne peut l’accélérer ou l’empêcher.

## Le noyau et ses isotopes
Un noyau se note ᴬ_Z X : **Z** protons (le numéro atomique, qui fixe l’élément), **A** nucléons au total, donc A − Z neutrons. Deux **isotopes** ont le même Z et des A différents : carbone 12 et carbone 14, uranium 235 et 238.

## La définition de la radioactivité
Un noyau **instable** se transforme **spontanément** et **aléatoirement** en un autre noyau, en émettant une particule. Le phénomène est :
- **spontané** : rien ne le déclenche ;
- **aléatoire** : impossible de prédire quand un noyau donné se désintégrera ;
- **inéluctable** : ni la température, ni la pression, ni une réaction chimique n’y changent rien.

## Les trois désintégrations
- **α** : émission d’un noyau d’hélium ⁴₂He. ᴬ_Z X → ᴬ⁻⁴_(Z−2) Y + ⁴₂He. Concerne les noyaux lourds.
- **β⁻** : un neutron devient proton, avec émission d’un électron ⁰₋₁e. ᴬ_Z X → ᴬ_(Z+1) Y + ⁰₋₁e. Concerne les noyaux trop riches en neutrons.
- **β⁺** : un proton devient neutron, avec émission d’un positon ⁰₊₁e. ᴬ_Z X → ᴬ_(Z−1) Y + ⁰₊₁e.

## Le rayonnement γ
Il n’est **pas une désintégration** : le noyau fils, formé dans un état excité, se désexcite en émettant un photon très énergétique. Ni A ni Z ne changent — d’où l’étoile : Y* → Y + γ.

## Les lois de conservation (Soddy)
Dans toute équation nucléaire, le **nombre de nucléons A** et la **charge Z** se conservent. Ce sont ces deux égalités qui permettent d’identifier le noyau fils sans rien connaître d’autre.

## L’énergie libérée
La masse du noyau est **inférieure** à la somme des masses de ses nucléons séparés : c’est le **défaut de masse** Δm. L’énergie de liaison correspondante vaut E = Δm × c². C’est cette énergie, colossale devant celle des réactions chimiques, qui est libérée lors d’une désintégration.

> La radioactivité **naturelle** (uranium, thorium, potassium 40, radon, carbone 14) nous entoure en permanence. Elle est **naturelle** au sens où elle ne vient d’aucune manipulation humaine — pas au sens où elle serait inoffensive.`,
          },
          questions: [
            ['Dans la notation ᴬ_Z X, que représente Z ?', ['Le nombre de protons', 'Le nombre de neutrons', 'Le nombre de nucléons', 'La masse du noyau'], 0, 'A est le nombre de nucléons ; le nombre de neutrons vaut donc A − Z.'],
            ['Quelle particule est émise lors d’une désintégration α ?', ['Un noyau d’hélium ⁴₂He', 'Un électron', 'Un positon', 'Un photon'], 0, 'Le noyau père perd 4 nucléons et 2 charges : ᴬ_Z X → ᴬ⁻⁴_(Z−2) Y + ⁴₂He.'],
            ['Lors d’une désintégration β⁻, que devient un neutron ?', ['Un proton, avec émission d’un électron', 'Un positon', 'Un noyau d’hélium', 'Il disparaît sans rien émettre'], 0, 'Z augmente d’une unité, A ne change pas.'],
            ['L’émission γ modifie le nombre de nucléons du noyau.', ['Vrai', 'Faux'], 1, 'Ni A ni Z ne changent : c’est une désexcitation, pas une désintégration.'],
            ['Quelles grandeurs se conservent dans une équation nucléaire ?', ['Le nombre de nucléons A et la charge Z', 'La masse et le volume', 'L’énergie cinétique seule', 'Le nombre d’électrons'], 0, 'Ce sont les lois de Soddy : elles suffisent à identifier le noyau fils.'],
            ['La désintégration d’un noyau donné peut être prédite à l’avance.', ['Vrai', 'Faux'], 1, 'Le phénomène est aléatoire : seule une population nombreuse suit une loi prévisible.'],
            ['Qu’appelle-t-on défaut de masse d’un noyau ?', ['L’écart entre la masse du noyau et la somme des masses de ses nucléons séparés', 'La masse des neutrons manquants', 'La masse perdue lors d’une réaction chimique', 'L’erreur de mesure sur la masse'], 0, 'L’énergie de liaison correspondante vaut E = Δm × c².'],
            ['Chauffer fortement un échantillon radioactif accélère sa désintégration.', ['Vrai', 'Faux'], 1, 'Le phénomène est nucléaire : température, pression et réactions chimiques n’y changent rien.'],
          ],
        },
        {
          titre: 'Évolution d’une population de noyaux radioactifs',
          axe: 'Modéliser l’évolution temporelle d’un système chimique',
          lecon: {
            titre: 'Imprévisible un par un, parfaitement régulier en masse',
            cours: `Un noyau isolé se désintègre à un instant imprévisible. Mais un échantillon en contient des milliards : à cette échelle, le hasard devient une **loi mathématique exacte**.

## La loi de décroissance
Le nombre N de noyaux non encore désintégrés à l’instant t vaut :

N(t) = N₀ × e^(−λt)

où **λ** est la **constante radioactive** (en s⁻¹), propre au noyau considéré. Elle traduit la probabilité, pour un noyau donné, de se désintégrer par unité de temps. Elle vérifie l’équation différentielle dN/dt = −λN.

## La demi-vie
La **demi-vie** t₁/₂ est la durée au bout de laquelle **la moitié** des noyaux se sont désintégrés :

t₁/₂ = ln2 / λ

Elle est **caractéristique du noyau** et ne dépend ni de la quantité initiale ni des conditions extérieures. Elle va de la microseconde à des milliards d’années : 5730 ans pour le carbone 14, 4,5 milliards d’années pour l’uranium 238, 8 jours pour l’iode 131.

## Lire une courbe de décroissance
Après une demi-vie il reste N₀/2, après deux il reste N₀/4, après trois N₀/8 : la population est **divisée par deux à chaque t₁/₂**, jamais réduite d’une quantité fixe. Au bout de 10 demi-vies, il reste moins d’un millième de l’échantillon.

## L’activité
L’**activité** A d’un échantillon est le nombre de désintégrations par seconde, en **becquerel (Bq)** :

A(t) = λ × N(t) = A₀ × e^(−λt)

Elle décroît donc **selon la même loi** que N. C’est elle qu’on mesure (compteur Geiger), jamais N directement.

## La datation
On compare l’activité (ou la quantité de noyaux) d’un échantillon à celle d’un échantillon de référence :

t = (1/λ) × ln(A₀/A)

La **datation au carbone 14** exploite le fait qu’un organisme vivant échange du carbone avec son milieu, et cesse à sa mort : sa teneur en ¹⁴C se met alors à décroître. Sa demi-vie de 5730 ans la rend utilisable jusqu’à 50 000 ans environ ; au-delà, il n’en reste pas assez pour mesurer. Pour les roches, on emploie des couples à demi-vie beaucoup plus longue (uranium-plomb, potassium-argon).

> Une demi-vie n’est **pas** une durée de vie : après t₁/₂, l’échantillon n’est pas « à moitié mort », il a exactement la même probabilité de perdre encore la moitié de ce qui reste pendant la période suivante.`,
          },
          questions: [
            ['Quelle est la loi de décroissance radioactive ?', ['N(t) = N₀ × e^(−λt)', 'N(t) = N₀ − λt', 'N(t) = N₀ / (λt)', 'N(t) = N₀ × λ^t'], 0, 'Elle est la solution de l’équation différentielle dN/dt = −λN.'],
            ['Quelle relation lie la demi-vie t₁/₂ et la constante radioactive λ ?', ['t₁/₂ = ln2 / λ', 't₁/₂ = λ / ln2', 't₁/₂ = 2λ', 't₁/₂ = 1 / λ²'], 0, 'ln2 ≈ 0,693 : c’est la constante à retenir.'],
            ['Après trois demi-vies, quelle fraction de l’échantillon initial subsiste ?', ['Un huitième', 'Un tiers', 'Un sixième', 'Rien'], 0, 'La population est divisée par deux à chaque demi-vie : 1/2, 1/4, 1/8.'],
            ['Quelle est l’unité de l’activité d’un échantillon radioactif ?', ['Le becquerel (Bq)', 'Le sievert (Sv)', 'Le gray (Gy)', 'Le hertz (Hz)'], 0, 'Un becquerel = une désintégration par seconde.'],
            ['Comment l’activité A est-elle reliée au nombre de noyaux N ?', ['A = λ × N', 'A = N / λ', 'A = λ / N', 'A = N × t₁/₂'], 0, 'Elle décroît donc selon la même exponentielle que N.'],
            ['La demi-vie d’un noyau dépend de la quantité initiale d’échantillon.', ['Vrai', 'Faux'], 1, 'Elle est caractéristique du noyau, et indépendante de la quantité comme des conditions extérieures.'],
            ['Pourquoi la datation au carbone 14 est-elle inutilisable au-delà de 50 000 ans environ ?', ['Il ne reste plus assez de ¹⁴C pour une mesure fiable', 'Le carbone 14 cesse de se désintégrer', 'Sa demi-vie change avec le temps', 'Les organismes anciens n’en contenaient pas'], 0, 'Sa demi-vie est de 5730 ans : après une dizaine de demi-vies, il en reste moins d’un millième.'],
            ['Pour dater une roche ancienne, on emploie un couple à demi-vie très longue.', ['Vrai', 'Faux'], 0, 'Uranium-plomb ou potassium-argon : leur demi-vie est à l’échelle du milliard d’années.'],
          ],
        },
        // ---- Chapitre 3 : Prévoir l'état final d'un système chimique --------
        {
          titre: 'L’équilibre chimique',
          axe: 'Prévoir l’état final d’un système chimique',
          lecon: {
            titre: 'Toutes les réactions ne vont pas jusqu’au bout',
            cours: `Au collège, une réaction s’arrête quand le réactif limitant est épuisé. En Terminale, on découvre qu’une grande partie des transformations s’arrêtent **avant**, dans un état où réactifs et produits coexistent : l’**état d’équilibre**.

## Le quotient de réaction
Pour une réaction a A + b B = c C + d D, à un instant quelconque :

Qr = ([C]/c°)^c × ([D]/c°)^d / (([A]/c°)^a × ([B]/c°)^b)

Il est **sans unité**. Règle d’écriture : les **solides** et le **solvant** (l’eau, dans une solution aqueuse diluée) n’y figurent pas — leur concentration ne varie pratiquement pas.

## La constante d’équilibre
Quand le système n’évolue plus, Qr atteint une valeur qui ne dépend **que de la température** : c’est la **constante d’équilibre K**. Elle ne dépend ni des quantités introduites, ni du volume, ni de la présence d’un catalyseur.

## Le critère d’évolution spontanée
On compare Qr,i (à l’état initial) à K :
- Qr,i < K : le système évolue dans le **sens direct** (formation de produits) ;
- Qr,i > K : il évolue dans le **sens indirect** ;
- Qr,i = K : il n’évolue pas, il est déjà à l’équilibre.

Ce critère répond à la question « dans quel sens ? » sans aucun calcul d’avancement.

## L’équilibre est dynamique
À l’équilibre, les deux réactions inverses continuent de se produire, **à la même vitesse**. Rien ne s’arrête à l’échelle microscopique : ce sont les concentrations, à l’échelle macroscopique, qui cessent de varier.

## Le taux d’avancement final
τ = x_f / x_max mesure à quel point la transformation est allée loin :
- τ = 1 (ou > 0,99) : transformation **totale** ;
- τ < 1 : transformation **limitée** par un équilibre.

Un K très grand (au-delà de 10⁴) correspond à une transformation quasi totale ; un K très petit à une transformation quasi nulle. Mais **τ dépend aussi des conditions initiales** : diluer une solution d’acide faible augmente son taux d’avancement, alors que K, lui, ne bouge pas.

> Ne pas confondre **K** et **τ** : K est une constante du couple réactionnel à une température donnée, τ est le résultat d’une expérience particulière. C’est la confusion la plus fréquente sur ce chapitre.`,
          },
          questions: [
            ['De quoi dépend la constante d’équilibre K ?', ['De la température seule', 'Des quantités initiales', 'Du volume du récipient', 'De la présence d’un catalyseur'], 0, 'C’est ce qui la distingue du taux d’avancement final τ, propre à chaque expérience.'],
            ['Si Qr,i < K, dans quel sens le système évolue-t-il ?', ['Dans le sens direct, vers les produits', 'Dans le sens indirect', 'Il n’évolue pas', 'Cela dépend du catalyseur'], 0, 'Le système évolue toujours de façon à rapprocher Qr de K.'],
            ['Un solide en excès figure-t-il dans l’expression du quotient de réaction ?', ['Non, il n’y figure pas', 'Oui, avec sa masse', 'Oui, avec sa concentration', 'Seulement s’il est le réactif limitant'], 0, 'Les solides et le solvant sont exclus : leur « concentration » ne varie pas.'],
            ['À l’équilibre, les réactions directe et inverse se produisent à la même vitesse.', ['Vrai', 'Faux'], 0, 'L’équilibre est dynamique : seules les concentrations cessent de varier.'],
            ['Que vaut le taux d’avancement final d’une transformation totale ?', ['1', '0', '0,5', 'Il est égal à K'], 0, 'τ = x_f/x_max : il vaut 1 quand la transformation va au bout.'],
            ['Le quotient de réaction Qr possède une unité.', ['Vrai', 'Faux'], 1, 'Les concentrations y sont divisées par c° = 1 mol·L⁻¹ : Qr est sans dimension.'],
            ['Diluer une solution d’acide faible modifie…', ['Le taux d’avancement final, mais pas K', 'K, mais pas le taux d’avancement', 'Les deux', 'Ni l’un ni l’autre'], 0, 'K ne dépend que de la température ; τ dépend des conditions initiales.'],
            ['Une constante d’équilibre K de l’ordre de 10⁶ signale…', ['Une transformation quasi totale', 'Une transformation quasi nulle', 'Un équilibre à mi-parcours', 'Une réaction impossible'], 0, 'Au-delà de 10⁴, la réaction peut être traitée comme totale.'],
          ],
        },
        {
          titre: 'Les piles : générateurs électrochimiques',
          axe: 'Prévoir l’état final d’un système chimique',
          lecon: {
            titre: 'Une réaction d’oxydoréduction dont on récolte les électrons',
            cours: `Plongez une lame de zinc dans une solution de sulfate de cuivre : la réaction se fait sur place, et son énergie part en chaleur. Séparez les deux couples : les électrons sont **obligés de passer par un fil**, et l’on obtient un courant.

## Oxydant, réducteur, couple
Un **réducteur** cède des électrons, un **oxydant** en capte. Ils forment un **couple Ox/Red** relié par une demi-équation : Ox + n e⁻ = Red. Exemples : Cu²⁺/Cu, Zn²⁺/Zn, Fe³⁺/Fe²⁺, MnO₄⁻/Mn²⁺.

## La constitution d’une pile
Deux **demi-piles** (chacune une électrode plongée dans la solution de son couple), reliées par :
- un **circuit extérieur** (le fil, où circulent les **électrons**) ;
- un **pont salin**, qui ferme le circuit **à l’intérieur** en laissant migrer les ions et assure l’électroneutralité de chaque compartiment. Sans lui, les charges s’accumulent et la pile s’arrête aussitôt.

## Les deux électrodes
- l’**anode** est le siège de l’**oxydation** ; dans une pile, c’est le pôle **négatif** (elle libère les électrons) ;
- la **cathode** est le siège de la **réduction** ; c’est le pôle **positif**.

Moyen mnémotechnique : **anode/oxydation** commencent par une voyelle, **cathode/réduction** par une consonne. Les électrons vont de l’anode vers la cathode dans le fil ; le **courant** conventionnel circule en sens inverse.

## Le sens d’évolution
La pile débite tant que Qr ≠ K. Elle **fonctionne** dans le sens qui rapproche Qr de K, et elle est **usée** quand Qr = K : le système a atteint son équilibre, la tension tombe à zéro. Une pile usée n’est pas « vide », elle est **à l’équilibre**.

## La capacité électrique
La quantité d’électricité débitée vaut :

Q = I × Δt = n(e⁻) × F

avec **F = 96 500 C·mol⁻¹** (constante de Faraday, la charge d’une mole d’électrons). En reliant n(e⁻) à l’avancement par les demi-équations, on calcule la **durée de vie** de la pile ou la masse d’électrode consommée.

> Le réactif limitant fixe la capacité : c’est presque toujours le métal de l’anode, qui se dissout, ou l’oxydant en solution.`,
          },
          questions: [
            ['Dans une pile, l’anode est le siège de…', ['L’oxydation, et c’est le pôle négatif', 'La réduction, et c’est le pôle négatif', 'L’oxydation, et c’est le pôle positif', 'La réduction, et c’est le pôle positif'], 0, 'Elle libère les électrons dans le circuit extérieur, d’où sa polarité négative.'],
            ['À quoi sert le pont salin ?', ['À fermer le circuit et assurer l’électroneutralité des compartiments', 'À conduire les électrons', 'À catalyser la réaction', 'À mesurer la tension'], 0, 'Sans lui, les charges s’accumulent et la pile cesse immédiatement de débiter.'],
            ['Dans le circuit extérieur d’une pile, les électrons circulent…', ['De l’anode vers la cathode', 'De la cathode vers l’anode', 'Dans les deux sens', 'Ils ne circulent pas, seuls les ions le font'], 0, 'Le courant conventionnel, lui, circule en sens inverse.'],
            ['Une pile usée est un système qui a atteint son état d’équilibre.', ['Vrai', 'Faux'], 0, 'Qr = K : plus aucune évolution possible, donc plus de tension.'],
            ['Que vaut la constante de Faraday ?', ['96 500 C·mol⁻¹', '6,02 × 10²³ mol⁻¹', '1,6 × 10⁻¹⁹ C', '8,31 J·K⁻¹·mol⁻¹'], 0, 'C’est la charge portée par une mole d’électrons.'],
            ['Quelle relation donne la quantité d’électricité débitée ?', ['Q = I × Δt = n(e⁻) × F', 'Q = U × I', 'Q = n(e⁻) / F', 'Q = m × c × ΔT'], 0, 'Elle relie la mesure électrique à l’avancement chimique.'],
            ['Un réducteur capte des électrons.', ['Vrai', 'Faux'], 1, 'Il en cède : c’est l’oxydant qui les capte.'],
            ['Qu’est-ce qui limite la capacité d’une pile ?', ['Le réactif limitant de la réaction', 'La longueur du fil', 'La taille du pont salin', 'La température ambiante seule'], 0, 'Le plus souvent le métal de l’anode qui se dissout, ou l’oxydant en solution.'],
          ],
        },
        {
          titre: 'Électrolyse et générateurs électrochimiques',
          axe: 'Prévoir l’état final d’un système chimique',
          lecon: {
            titre: 'Forcer un système à remonter la pente',
            cours: `Une pile suit le sens spontané. Une **électrolyse** fait l’inverse : un générateur impose au système d’évoluer **contre** son sens naturel — et donc **d’éloigner Qr de K**.

## La transformation forcée
On plonge deux électrodes dans un électrolyte et on les relie à un **générateur de tension continue**, qui doit fournir une tension supérieure à celle que délivrerait la pile correspondante. Le système, laissé seul, reviendrait spontanément en arrière.

## Le repérage des électrodes
Les définitions **ne changent pas** — c’est le branchement qui change :
- l’**anode** reste le siège de l’**oxydation**, mais elle est reliée à la borne **+** du générateur ;
- la **cathode** reste le siège de la **réduction**, reliée à la borne **−**.

C’est le piège classique : dans une pile l’anode est le pôle négatif, dans une électrolyse elle est reliée au pôle positif. La règle sûre est « anode = oxydation », toujours.

## Le bilan quantitatif
Le même calcul que pour une pile s’applique :

n(e⁻) = I × Δt / F

d’où la masse déposée ou dissoute, ou le volume de gaz dégagé. C’est ainsi qu’on dimensionne un dépôt de galvanoplastie ou une production industrielle.

## Les applications
- **électrolyse de l’eau** : production de dihydrogène (réduction à la cathode) et de dioxygène (oxydation à l’anode) ;
- **galvanoplastie** : dépôt d’un métal (chromage, dorure) sur une pièce placée à la cathode ;
- **production de métaux** : l’aluminium s’obtient exclusivement par électrolyse de l’alumine ;
- **raffinage** du cuivre.

## L’accumulateur
Un **accumulateur** (batterie lithium-ion, plomb-acide) est un système réversible : il fonctionne **en pile** à la décharge, **en électrolyseur** à la recharge — le chargeur y joue le rôle du générateur, et l’anode et la cathode échangent leurs places. C’est ce qui le distingue d’une pile jetable.

## La pile à combustible
Elle n’est pas un accumulateur : ses réactifs (dihydrogène et dioxygène) sont **alimentés en continu** au lieu d’être stockés. Elle débite tant qu’on l’alimente et ne rejette que de l’eau — à condition que le dihydrogène ait lui-même été produit proprement.

> Une électrolyse consomme de l’énergie électrique et la stocke sous forme chimique ; une pile fait le trajet inverse. Le rendement du couple charge-décharge n’est jamais de 100 %.`,
          },
          questions: [
            ['Lors d’une électrolyse, l’anode est reliée à…', ['La borne + du générateur', 'La borne − du générateur', 'Aucune borne', 'Au pont salin'], 0, 'Elle reste le siège de l’oxydation : seule sa polarité change par rapport à une pile.'],
            ['Une électrolyse fait évoluer le système…', ['Dans le sens qui éloigne Qr de K', 'Dans le sens spontané', 'Vers l’équilibre', 'Sans changer Qr'], 0, 'C’est une transformation forcée : le générateur impose le sens contraire au sens naturel.'],
            ['La règle « anode = oxydation » vaut aussi bien pour une pile que pour une électrolyse.', ['Vrai', 'Faux'], 0, 'C’est la seule règle sûre ; c’est la polarité, elle, qui s’inverse.'],
            ['Quelle relation donne la quantité de matière d’électrons échangés ?', ['n(e⁻) = I × Δt / F', 'n(e⁻) = F / (I × Δt)', 'n(e⁻) = I × F × Δt', 'n(e⁻) = U × I × Δt'], 0, 'C’est elle qui relie la durée d’électrolyse à la masse déposée.'],
            ['Que produit la réduction à la cathode lors de l’électrolyse de l’eau ?', ['Du dihydrogène', 'Du dioxygène', 'De l’ozone', 'Du peroxyde d’hydrogène'], 0, 'Le dioxygène se forme à l’anode, par oxydation.'],
            ['Un accumulateur fonctionne en électrolyseur pendant sa recharge.', ['Vrai', 'Faux'], 0, 'Le chargeur joue le rôle du générateur ; anode et cathode échangent leurs places.'],
            ['Qu’est-ce qui distingue une pile à combustible d’un accumulateur ?', ['Ses réactifs sont alimentés en continu au lieu d’être stockés', 'Elle ne produit pas d’électricité', 'Elle ne se recharge jamais', 'Elle fonctionne sans électrode'], 0, 'Elle débite tant qu’on l’alimente en dihydrogène et en dioxygène.'],
            ['Par quel procédé l’aluminium est-il produit industriellement ?', ['Par électrolyse de l’alumine', 'Par distillation', 'Par pile à combustible', 'Par réduction au carbone dans un haut-fourneau'], 0, 'C’est un procédé très consommateur d’énergie électrique.'],
          ],
        },
        {
          titre: 'Force des acides et des bases',
          axe: 'Prévoir l’état final d’un système chimique',
          lecon: {
            titre: 'Fort ou faible : une question de taux, pas de danger',
            cours: `« Acide fort » ne veut pas dire « acide dangereux » : cela veut dire que sa réaction avec l’eau est **totale**. Un acide faible concentré peut être bien plus corrosif qu’un acide fort dilué.

## Acide fort, acide faible
- **acide fort** : réagit **totalement** avec l’eau. AH + H₂O → A⁻ + H₃O⁺, flèche simple. Dans la solution, il ne reste **plus de AH**. Exemples : HCl, HNO₃, H₂SO₄ (première acidité).
- **acide faible** : la réaction est **limitée**, l’équilibre s’établit. AH + H₂O = A⁻ + H₃O⁺, double flèche. AH et A⁻ **coexistent**. Exemples : CH₃COOH, HF, NH₄⁺.

Même distinction pour les bases : HO⁻ et les hydroxydes solubles sont forts, NH₃ et CH₃COO⁻ sont faibles.

## La constante d’acidité
Pour un couple AH/A⁻, la constante d’équilibre de la réaction avec l’eau porte un nom propre :

Ka = ([A⁻]/c°) × ([H₃O⁺]/c°) / ([AH]/c°), et pKa = −log Ka

**Plus l’acide est fort, plus Ka est grand, donc plus le pKa est petit.** L’échelle est inversée : c’est le sens à ne pas perdre.

## Le diagramme de prédominance
En prenant le logarithme de l’expression de Ka, on obtient la **relation de Henderson** :

pH = pKa + log([A⁻]/[AH])

D’où la lecture immédiate :
- **pH < pKa** : l’**acide** AH prédomine ;
- **pH > pKa** : la **base** A⁻ prédomine ;
- **pH = pKa** : les deux espèces sont en **concentrations égales**.

Un diagramme de prédominance est donc un axe de pH coupé en deux au pKa. Pour un diacide, deux pKa découpent trois domaines.

## Les indicateurs colorés
Un indicateur coloré est un couple acide/base dont les deux formes n’ont **pas la même couleur**. Il change de teinte sur une **zone de virage** d’environ deux unités, centrée sur son pKa. On le choisit pour que sa zone de virage soit **contenue dans le saut de pH** du titrage : sinon, le virage n’indique pas l’équivalence.

> Le pKa de l’acide éthanoïque vaut 4,8, celui de l’ion ammonium 9,2 : deux repères qui permettent de situer presque tous les autres.`,
          },
          questions: [
            ['Un acide fort est un acide qui…', ['Réagit totalement avec l’eau', 'Est très concentré', 'Est très corrosif', 'A un pKa élevé'], 0, 'Après réaction, il n’en reste plus sous forme AH dans la solution.'],
            ['Plus un acide est fort, plus son pKa est…', ['Petit', 'Grand', 'Proche de 7', 'Proche de 14'], 0, 'Ka est grand, donc pKa = −log Ka est petit : l’échelle est inversée.'],
            ['Si pH > pKa, quelle espèce du couple prédomine ?', ['La base A⁻', 'L’acide AH', 'Les deux à parts égales', 'Ni l’une ni l’autre'], 0, 'La relation pH = pKa + log([A⁻]/[AH]) le donne directement.'],
            ['Quand pH = pKa, les deux espèces du couple ont la même concentration.', ['Vrai', 'Faux'], 0, 'Le rapport [A⁻]/[AH] vaut 1, donc son logarithme est nul.'],
            ['Dans une solution d’acide faible, l’acide AH a entièrement disparu.', ['Vrai', 'Faux'], 1, 'La réaction est limitée : AH et A⁻ coexistent à l’équilibre.'],
            ['Comment choisit-on un indicateur coloré pour un titrage ?', ['Sa zone de virage doit être contenue dans le saut de pH', 'Il doit avoir le pKa de l’acide titré', 'Il doit être incolore en milieu acide', 'N’importe quel indicateur convient'], 0, 'Sinon le virage se produit ailleurs qu’à l’équivalence.'],
            ['Quelle est la largeur approximative de la zone de virage d’un indicateur coloré ?', ['Environ deux unités de pH', 'Une demi-unité', 'Cinq unités', 'Elle est ponctuelle'], 0, 'Elle est centrée sur le pKa de l’indicateur.'],
            ['Que vaut le pKa du couple CH₃COOH/CH₃COO⁻ ?', ['4,8', '2,1', '9,2', '14,0'], 0, 'C’est un repère à connaître, avec 9,2 pour NH₄⁺/NH₃.'],
          ],
        },
        {
          titre: 'Équilibre chimique et calcul du pH d’une solution',
          axe: 'Prévoir l’état final d’un système chimique',
          lecon: {
            titre: 'Du tableau d’avancement au pH, et retour',
            cours: `Calculer un pH, c’est toujours la même démarche : identifier la réaction prépondérante, dresser un tableau d’avancement, écrire la constante d’équilibre, résoudre.

## Le cas de l’acide fort
La réaction avec l’eau étant totale, tout l’acide est converti :

[H₃O⁺] = c, donc pH = −log(c/c°)

Vrai tant que c n’est pas trop faible (au-delà de 10⁻⁶ mol·L⁻¹, l’autoprotolyse de l’eau doit être prise en compte, et le pH ne dépasse jamais 7). Pour une base forte, on passe par [HO⁻] puis par Ke : pH = 14,0 + log(c/c°) à 25 °C.

## Le cas de l’acide faible
La réaction est limitée. On dresse le tableau d’avancement de AH + H₂O = A⁻ + H₃O⁺, on exprime Ka en fonction de l’avancement volumique, et on résout. Le résultat est **toujours un pH plus élevé** que celui d’un acide fort de même concentration : moins de H₃O⁺ ont été libérés.

Le taux d’avancement final τ = [A⁻]/c mesure cet écart. Il **augmente quand on dilue** : un acide faible très dilué se comporte presque comme un acide fort.

## La solution tampon
Une solution contenant **l’acide ET sa base conjuguée en quantités comparables** possède un pH qui varie peu par ajout modéré d’acide, de base, ou par dilution : c’est un **tampon**. Son pH vaut :

pH = pKa + log([A⁻]/[AH])

Il est **maximalement efficace quand [A⁻] = [AH]**, c’est-à-dire quand pH = pKa. Le sang est tamponné par le couple CO₂,H₂O/HCO₃⁻ autour de pH 7,4.

## Le titrage pH-métrique
On suit le pH en fonction du volume de solution titrante versé. La réaction de titrage doit être **totale, rapide et unique**.
- l’**équivalence** est atteinte quand les réactifs ont été mélangés dans les **proportions stœchiométriques** ; c’est le point d’inflexion du saut de pH, repéré par la méthode des tangentes ou par le maximum de la dérivée ;
- à la **demi-équivalence** d’un titrage d’acide faible, la moitié de AH a été transformée : [A⁻] = [AH], donc **pH = pKa**. C’est la façon la plus simple de mesurer un pKa.

> À l’équivalence, le pH ne vaut 7 que si l’on titre un acide fort par une base forte. Titrer un acide **faible** par une base forte donne un pH d’équivalence **supérieur à 7** : la base conjuguée formée est basique.`,
          },
          questions: [
            ['Quel est le pH d’une solution d’acide fort de concentration 1,0 × 10⁻³ mol·L⁻¹ ?', ['3,0', '11,0', '1,0', '7,0'], 0, 'La réaction est totale : [H₃O⁺] = c, donc pH = −log c.'],
            ['À concentration égale, un acide faible donne un pH…', ['Plus élevé qu’un acide fort', 'Plus bas qu’un acide fort', 'Identique', 'Toujours égal à 7'], 0, 'Sa réaction limitée libère moins d’ions H₃O⁺.'],
            ['Qu’est-ce qu’une solution tampon ?', ['Un mélange d’un acide et de sa base conjuguée dont le pH varie peu', 'Une solution de pH exactement 7', 'Une solution très concentrée en acide fort', 'Une solution sans ions H₃O⁺'], 0, 'Elle résiste aux ajouts modérés d’acide ou de base et à la dilution.'],
            ['À la demi-équivalence d’un titrage d’acide faible, que vaut le pH ?', ['pH = pKa', 'pH = 7', 'pH = pKe/2', 'pH = pKa/2'], 0, '[A⁻] = [AH] : c’est la méthode la plus simple pour mesurer un pKa.'],
            ['À l’équivalence, les réactifs ont été mélangés dans les proportions stœchiométriques.', ['Vrai', 'Faux'], 0, 'C’est la définition même de l’équivalence.'],
            ['Le pH à l’équivalence d’un titrage d’acide faible par une base forte vaut 7,0.', ['Vrai', 'Faux'], 1, 'Il est supérieur à 7 : la base conjuguée formée rend le milieu basique.'],
            ['Une solution tampon est la plus efficace quand…', ['[A⁻] = [AH], soit pH = pKa', 'l’acide est en large excès', 'la base est seule présente', 'le pH vaut 7'], 0, 'C’est le point où le pH est le moins sensible à un ajout.'],
            ['Quelles qualités doit posséder la réaction support d’un titrage ?', ['Totale, rapide et unique', 'Limitée et lente', 'Catalysée et réversible', 'Exothermique et colorée'], 0, 'Sans cela, l’équivalence ne correspond pas à la quantité cherchée.'],
          ],
        },
        // ---- Chapitre 4 : Stratégies en synthèse organique ------------------
        {
          titre: 'Structure des molécules organiques',
          axe: 'Stratégies en synthèse organique',
          lecon: {
            titre: 'Le squelette, les groupes, et l’espace',
            cours: `Une molécule organique se lit à trois niveaux : la **chaîne carbonée** qui lui sert de squelette, les **groupes caractéristiques** qui portent sa réactivité, et sa **forme dans l’espace**, qui décide parfois de tout.

## Les formules
- **brute** : C₂H₆O — elle compte les atomes, rien de plus ;
- **semi-développée** : CH₃—CH₂—OH — les liaisons entre atomes lourds sont écrites ;
- **topologique** : la chaîne carbonée en ligne brisée, chaque sommet et chaque extrémité étant un carbone, les H portés par les carbones étant sous-entendus.

Une même formule brute peut correspondre à plusieurs molécules : C₂H₆O est aussi bien l’éthanol que le méthoxyméthane. Ce sont des **isomères de constitution**.

## Les familles et leurs groupes
- **alcool** : —OH porté par un carbone tétragonal ;
- **aldéhyde** : —CHO, toujours en bout de chaîne ;
- **cétone** : —CO—, toujours en milieu de chaîne ;
- **acide carboxylique** : —COOH ;
- **ester** : —COO— ;
- **amine** : —NH₂, —NH— ou —N ;
- **amide** : —CONH— ;
- **halogénoalcane** : —X, avec X = F, Cl, Br ou I.

Les alcools se classent en **primaire, secondaire, tertiaire** selon le nombre de carbones voisins du carbone porteur du —OH — distinction décisive pour l’oxydation (un alcool tertiaire ne s’oxyde pas).

## La nomenclature
Chaîne principale la plus longue contenant le groupe caractéristique, numérotation donnant l’indice le plus petit à ce groupe, substituants en préfixe par ordre alphabétique. *Pentan-2-ol*, *3-méthylbutanoate d’éthyle*.

## Les isoméries
- **de constitution** : même formule brute, enchaînement différent (chaîne, position, fonction) ;
- **stéréo-isomérie Z/E** : autour d’une double liaison C=C, qui ne tourne pas ;
- **énantiomérie** : deux molécules images l’une de l’autre dans un miroir et non superposables. Elle apparaît dès qu’un **carbone asymétrique** (quatre substituants différents) est présent. La molécule est alors **chirale**.
- **diastéréo-isomérie** : stéréo-isomères qui ne sont pas énantiomères.

Deux énantiomères ont **les mêmes propriétés physiques** (température de fusion, solubilité) mais peuvent avoir des **effets biologiques radicalement différents** : un récepteur biologique est lui-même chiral et ne reconnaît qu’une des deux formes.

## La polarité, source de réactivité
Une liaison entre atomes d’**électronégativités différentes** est polarisée : le carbone d’un C—O ou d’un C=O porte un δ⁺ (site accepteur), l’oxygène un δ⁻ et ses doublets non liants (site donneur). C’est cette carte des charges qui prédit où une molécule sera attaquée.

> La formule topologique est la seule qui reste lisible au-delà d’une dizaine de carbones : c’est celle des énoncés de bac.`,
          },
          questions: [
            ['Sur une formule topologique, que représente chaque sommet de la ligne brisée ?', ['Un atome de carbone', 'Un atome d’hydrogène', 'Une liaison double', 'Un groupe caractéristique'], 0, 'Les hydrogènes portés par ces carbones sont sous-entendus.'],
            ['Quel groupe caractéristique définit un acide carboxylique ?', ['—COOH', '—CHO', '—OH', '—COO—'], 0, '—CHO est l’aldéhyde, —COO— l’ester, —OH l’alcool.'],
            ['Qu’est-ce qu’un carbone asymétrique ?', ['Un carbone portant quatre substituants différents', 'Un carbone portant une double liaison', 'Un carbone en bout de chaîne', 'Un carbone chargé positivement'], 0, 'Sa présence rend la molécule chirale.'],
            ['Deux énantiomères ont les mêmes propriétés physiques.', ['Vrai', 'Faux'], 0, 'Mais leurs effets biologiques peuvent être très différents : les récepteurs sont eux-mêmes chiraux.'],
            ['L’éthanol CH₃CH₂OH et le méthoxyméthane CH₃OCH₃ sont…', ['Des isomères de constitution', 'Des énantiomères', 'La même molécule', 'Des diastéréo-isomères'], 0, 'Même formule brute C₂H₆O, enchaînement différent — ici une isomérie de fonction.'],
            ['Un alcool tertiaire s’oxyde facilement.', ['Vrai', 'Faux'], 1, 'Le carbone porteur du —OH n’a plus d’hydrogène à céder : il ne s’oxyde pas.'],
            ['Quelle isomérie est possible autour d’une double liaison C=C ?', ['La stéréo-isomérie Z/E', 'L’énantiomérie', 'L’isomérie de chaîne', 'Aucune'], 0, 'La double liaison ne tourne pas, ce qui fige deux dispositions distinctes.'],
            ['Dans un groupe carbonyle C=O, quel atome porte la charge partielle positive ?', ['Le carbone', 'L’oxygène', 'Les deux', 'Aucun, la liaison est apolaire'], 0, 'L’oxygène, plus électronégatif, attire les électrons : le carbone devient site accepteur.'],
          ],
        },
        {
          titre: 'Stratégie et sélectivité en chimie organique',
          axe: 'Stratégies en synthèse organique',
          lecon: {
            titre: 'Choisir un chemin, pas seulement une réaction',
            cours: `Synthétiser une molécule, ce n’est pas trouver « la » réaction : c’est enchaîner des étapes, dans un ordre qui protège ce qu’il faut protéger, avec des réactifs qui n’attaquent que ce qu’on veut.

## Les trois modifications possibles
Une synthèse joue sur :
- la **chaîne carbonée** (l’allonger, la raccourcir, la ramifier) ;
- le **groupe caractéristique** (le transformer : alcool → aldéhyde → acide) ;
- la **stéréochimie** (obtenir un énantiomère plutôt que l’autre).

## Les grandes catégories de réactions
- **substitution** : un atome ou un groupe en remplace un autre ;
- **addition** : deux entités s’ajoutent sur une liaison multiple, qui devient simple ;
- **élimination** : une liaison multiple se crée par départ de deux groupes portés par des carbones voisins.

On les reconnaît en **comparant réactif et produit** : nombre d’atomes conservé et un groupe échangé (substitution), insaturation qui disparaît (addition), insaturation qui apparaît (élimination).

## La sélectivité
- **chimiosélectivité** : le réactif n’attaque qu’un seul type de groupe alors que plusieurs sont présents ;
- **régiosélectivité** : parmi plusieurs positions possibles, une seule réagit (ou majoritairement) ;
- **stéréosélectivité** : un stéréo-isomère se forme préférentiellement.

Un réactif « brutal » manque de sélectivité et donne un mélange à séparer : la sélectivité, c’est du rendement gagné et de la purification épargnée.

## La protection de fonction
Quand un groupe risque de réagir alors qu’on ne le souhaite pas, on le **protège** : on le transforme temporairement en un groupe inerte, on réalise l’étape voulue, puis on **déprotège**. Cela ajoute deux étapes — donc du coût et une perte de rendement — mais c’est souvent le seul chemin possible. C’est la stratégie systématique en synthèse peptidique, où seule la bonne extrémité de chaque acide aminé doit réagir.

## La synthèse multi-étapes
Le rendement global est le **produit** des rendements de chaque étape : cinq étapes à 80 % ne donnent que 33 % au total. D’où deux principes : **peu d’étapes**, et **les étapes coûteuses le plus tard possible**.

## Le coût et l’impact
Le choix d’une voie de synthèse intègre le prix des réactifs, la **sécurité** (solvants inflammables, toxicité), la consommation d’énergie (chauffage à reflux) et l’**économie d’atomes** — la part de la masse des réactifs qui se retrouve dans le produit voulu. Ce sont les principes de la **chimie verte** : moins de solvants, catalyse plutôt que réactifs stœchiométriques, matières premières renouvelables.

> Le protocole d’un TP de synthèse se lit à cette lumière : chauffage à reflux (accélérer sans perdre de matière), montage à distiller ou recristallisation (purifier), CCM (vérifier), calcul du rendement (mesurer).`,
          },
          questions: [
            ['Comment reconnaît-on une réaction d’addition ?', ['Une liaison multiple disparaît au profit de liaisons simples', 'Un groupe en remplace un autre', 'Une liaison multiple apparaît', 'La chaîne carbonée se raccourcit'], 0, 'L’élimination fait exactement l’inverse ; la substitution conserve les insaturations.'],
            ['Qu’est-ce que la chimiosélectivité ?', ['Le fait de n’attaquer qu’un seul type de groupe caractéristique', 'Le fait de ne réagir qu’à une seule position', 'Le fait de former un seul stéréo-isomère', 'Le fait d’utiliser un catalyseur'], 0, 'La régiosélectivité vise la position, la stéréosélectivité la géométrie.'],
            ['À quoi sert une protection de fonction ?', ['À empêcher un groupe de réagir pendant une étape', 'À augmenter le rendement d’une étape', 'À accélérer la réaction', 'À purifier le produit final'], 0, 'On protège, on réalise l’étape voulue, puis on déprotège — deux étapes de plus.'],
            ['Une synthèse en cinq étapes à 80 % de rendement chacune donne un rendement global d’environ…', ['33 %', '80 %', '16 %', '100 %'], 0, 'Les rendements se multiplient : 0,8⁵ ≈ 0,33.'],
            ['Il vaut mieux placer les étapes les plus coûteuses en début de synthèse.', ['Vrai', 'Faux'], 1, 'Le plus tard possible : on ne gaspille alors le réactif cher que sur la matière déjà purifiée.'],
            ['Que mesure l’économie d’atomes ?', ['La part de la masse des réactifs retrouvée dans le produit voulu', 'Le nombre d’atomes de carbone du produit', 'Le coût des réactifs', 'Le rendement de la réaction'], 0, 'C’est l’un des principes de la chimie verte.'],
            ['À quoi sert un chauffage à reflux ?', ['À accélérer la réaction sans perdre de matière par évaporation', 'À purifier le produit', 'À séparer deux isomères', 'À refroidir le mélange'], 0, 'Les vapeurs se condensent dans le réfrigérant et retombent dans le ballon.'],
            ['La protection de fonction est systématique en synthèse peptidique.', ['Vrai', 'Faux'], 0, 'Seule la bonne extrémité de chaque acide aminé doit réagir : les autres sont protégées.'],
          ],
        },
        // ---- Chapitre 5 : Mouvements et interactions ------------------------
        {
          titre: 'Modélisation d’un mouvement',
          axe: 'Mouvements et interactions',
          lecon: {
            titre: 'Position, vitesse, accélération : trois vecteurs, deux dérivations',
            cours: `Décrire un mouvement, c’est répondre à trois questions dans l’ordre : par rapport à quoi, où, et comment cela change.

## Le référentiel
Aucun mouvement n’existe dans l’absolu : il faut d’abord choisir un **référentiel** (un solide de référence muni d’une horloge). Un passager est immobile dans le référentiel du train et animé de 300 km/h dans celui du sol. Les référentiels usuels : **terrestre** (le sol), **géocentrique** (centre de la Terre, axes vers des étoiles lointaines), **héliocentrique** (centre du Soleil).

## Le vecteur position
Dans un repère (O, i, j, k), la position du point M s’écrit OM = x(t) i + y(t) j + z(t) k. Les fonctions x(t), y(t), z(t) sont les **équations horaires** du mouvement ; en éliminant t entre elles, on obtient l’**équation de la trajectoire**.

## Vitesse et accélération
Le vecteur vitesse est la **dérivée** du vecteur position :

v = dOM/dt, soit v_x = dx/dt, v_y = dy/dt

Le vecteur accélération est la dérivée du vecteur vitesse (donc la dérivée seconde de la position) :

a = dv/dt = d²OM/dt²

Le vecteur vitesse est **toujours tangent à la trajectoire** et orienté dans le sens du mouvement. Le vecteur accélération, lui, est toujours dirigé **vers l’intérieur** de la courbure.

## La méthode expérimentale
Sur une chronophotographie ou un pointage vidéo, on n’a pas de fonction dérivable mais une suite de positions à intervalle τ. On approche alors la dérivée par une **différence finie centrée** :

v(Mᵢ) ≈ M(ᵢ₋₁)M(ᵢ₊₁) / (2τ)

Plus τ est petit, meilleure est l’approximation — mais plus l’incertitude de pointage pèse.

## Le repère de Frenet
Pour un mouvement courbe, on projette l’accélération sur deux directions liées à la trajectoire :
- la **composante tangentielle** aₜ = dv/dt : elle traduit la variation de la **valeur** de la vitesse ;
- la **composante normale** aₙ = v²/R (R = rayon de courbure), dirigée vers le centre : elle traduit la variation de la **direction**.

## Deux mouvements de référence
- **rectiligne uniforme** : a = 0, v constant en direction et en valeur ;
- **circulaire uniforme** : la valeur de v est constante, mais **a n’est pas nulle** — elle vaut v²/R et pointe vers le centre. C’est le point le plus contre-intuitif du chapitre.

> Un mouvement uniforme n’est pas un mouvement sans accélération : « uniforme » ne parle que de la **valeur** de la vitesse, pas de sa direction.`,
          },
          questions: [
            ['Le vecteur vitesse est toujours…', ['Tangent à la trajectoire', 'Perpendiculaire à la trajectoire', 'Dirigé vers le centre de courbure', 'Vertical'], 0, 'C’est le vecteur accélération qui pointe vers l’intérieur de la courbure.'],
            ['Dans un mouvement circulaire uniforme, l’accélération est nulle.', ['Vrai', 'Faux'], 1, 'Elle vaut v²/R et pointe vers le centre : la direction de la vitesse change en permanence.'],
            ['Que vaut la composante normale de l’accélération ?', ['aₙ = v²/R', 'aₙ = dv/dt', 'aₙ = v × R', 'aₙ = 0 toujours'], 0, 'La composante tangentielle aₜ = dv/dt traduit, elle, la variation de la valeur de la vitesse.'],
            ['Comment obtient-on l’équation de la trajectoire à partir des équations horaires ?', ['En éliminant le temps entre elles', 'En les dérivant', 'En les additionnant', 'En les intégrant'], 0, 'On exprime t à partir de l’une, puis on le remplace dans l’autre.'],
            ['Quel référentiel choisit-on pour étudier le mouvement des planètes ?', ['Le référentiel héliocentrique', 'Le référentiel terrestre', 'Le référentiel géocentrique', 'N’importe lequel'], 0, 'Le géocentrique convient aux satellites de la Terre, le terrestre aux mouvements au sol.'],
            ['Sur un pointage vidéo, comment estime-t-on la vitesse en un point ?', ['Par la différence finie centrée entre les points voisins', 'En mesurant la distance à l’origine', 'En dérivant deux fois la position', 'En divisant la distance totale par la durée totale'], 0, 'v ≈ M(i−1)M(i+1) / (2τ) : c’est l’approximation de la dérivée.'],
            ['L’accélération est la dérivée seconde du vecteur position.', ['Vrai', 'Faux'], 0, 'a = dv/dt = d²OM/dt².'],
            ['Un mouvement rectiligne uniforme se caractérise par…', ['Un vecteur accélération nul', 'Une accélération constante non nulle', 'Une vitesse nulle', 'Une trajectoire circulaire'], 0, 'Le vecteur vitesse y est constant en valeur ET en direction.'],
          ],
        },
        {
          titre: 'Appliquer la deuxième loi de Newton',
          axe: 'Mouvements et interactions',
          lecon: {
            titre: 'Une méthode, toujours la même, en cinq gestes',
            cours: `La deuxième loi de Newton est l’outil central de la mécanique de Terminale. Sa difficulté n’est pas la formule : c’est la rigueur de la mise en place.

## Les trois lois
- **1re loi (principe d’inertie)** : dans un référentiel galiléen, un système isolé ou pseudo-isolé (somme des forces nulle) est au repos ou en mouvement rectiligne uniforme. Réciproque vraie.
- **2e loi** : ΣF = dp/dt, où p = m v est la **quantité de mouvement**. Si la masse est constante : **ΣF = m a**.
- **3e loi (actions réciproques)** : si A exerce F(A→B) sur B, alors B exerce F(B→A) = −F(A→B) sur A. Les deux forces ont **toujours** même valeur et sens opposés, quelles que soient les masses — et elles s’appliquent à **deux corps différents**, donc ne se compensent jamais entre elles.

## La méthode
1. **Définir le système** (le corps étudié) et le préciser par écrit ;
2. choisir le **référentiel**, supposé galiléen ;
3. faire le **bilan des forces extérieures** : poids, réaction du support (normale + frottements), tension, poussée d’Archimède, force électrique… et le représenter sur un schéma ;
4. **appliquer ΣF = m a** ;
5. **projeter** sur les axes du repère choisi, puis intégrer deux fois pour obtenir vitesse puis position, en déterminant les constantes par les **conditions initiales**.

## Ce que la loi ne dit pas
La force ne donne pas la vitesse mais sa **variation**. Un objet peut avancer vite alors qu’aucune force ne s’exerce sur lui (inertie), et être immobile un instant alors qu’une force agit (sommet d’un lancer vertical).

## La chute avec frottement
Quand un frottement fluide s’oppose au mouvement (f = k v ou k v²), l’accélération diminue à mesure que v augmente. La vitesse tend vers une **vitesse limite**, atteinte quand ΣF = 0 : le poids est alors exactement compensé. On la calcule en posant a = 0 dans l’équation différentielle, sans avoir à la résoudre.

## La méthode d’Euler
Quand l’équation différentielle n’a pas de solution analytique simple, on la résout **pas à pas** :

v(t + Δt) = v(t) + a(t) × Δt, puis x(t + Δt) = x(t) + v(t) × Δt

C’est ce que fait un tableur ou un programme Python. Plus Δt est petit, plus la solution approchée est fidèle.

> Une force intérieure au système ne figure jamais dans le bilan : seules les forces **extérieures** comptent. C’est pour cela que définir le système est le premier geste, et pas une formalité.`,
          },
          questions: [
            ['Quel est l’énoncé de la deuxième loi de Newton ?', ['ΣF = dp/dt, soit ΣF = m a à masse constante', 'ΣF = 0 pour tout système', 'F(A→B) = −F(B→A)', 'p = m v'], 0, 'La troisième loi est celle des actions réciproques ; p = m v en est la définition.'],
            ['Deux forces d’interaction réciproque se compensent et le système reste immobile.', ['Vrai', 'Faux'], 1, 'Elles s’appliquent à DEUX corps différents : elles ne se compensent jamais entre elles.'],
            ['Un système pseudo-isolé est animé d’un mouvement…', ['Rectiligne uniforme, ou est au repos', 'Circulaire uniforme', 'Uniformément accéléré', 'Toujours nul'], 0, 'C’est le principe d’inertie, et sa réciproque est vraie.'],
            ['Quelle est la première étape de la méthode de résolution ?', ['Définir le système étudié', 'Projeter sur les axes', 'Calculer l’accélération', 'Écrire les conditions initiales'], 0, 'Sans système défini, le bilan des forces extérieures n’a pas de sens.'],
            ['Comment calcule-t-on une vitesse limite ?', ['En posant l’accélération égale à zéro dans l’équation', 'En intégrant deux fois', 'En dérivant la position', 'En annulant la vitesse initiale'], 0, 'À la vitesse limite, le frottement compense exactement le poids : ΣF = 0.'],
            ['La méthode d’Euler sert à…', ['Résoudre pas à pas une équation différentielle sans solution simple', 'Mesurer une vitesse expérimentale', 'Vérifier la troisième loi de Newton', 'Calculer une énergie'], 0, 'v(t+Δt) = v(t) + a(t)Δt : c’est ce que fait un tableur ou un script Python.'],
            ['Une force intérieure au système figure dans le bilan des forces.', ['Vrai', 'Faux'], 1, 'Seules les forces extérieures interviennent dans ΣF = m a.'],
            ['Au sommet d’un lancer vertical, la vitesse s’annule. Que vaut l’accélération ?', ['Elle vaut g, dirigée vers le bas', 'Elle est nulle', 'Elle est dirigée vers le haut', 'Elle est infinie'], 0, 'Le poids agit toujours : la force donne la variation de vitesse, pas la vitesse.'],
          ],
        },
        {
          titre: 'Mouvement dans un champ uniforme',
          axe: 'Mouvements et interactions',
          lecon: {
            titre: 'Une parabole, qu’il s’agisse d’un ballon ou d’un électron',
            cours: `Un champ **uniforme** a même valeur, même direction et même sens en tout point de la région considérée. La force qui en découle est constante, donc l’accélération aussi : le mouvement est toujours le même, à un facteur près.

## Le champ de pesanteur
Près de la surface terrestre, g est uniforme (g ≈ 9,81 m·s⁻² en France) sur quelques dizaines de mètres. Un projectile en **chute libre** (soumis à son seul poids) a pour accélération a = g, **indépendante de sa masse** : c’est pourquoi une plume et une bille tombent ensemble dans le vide.

## Les équations du tir
Avec une vitesse initiale v₀ faisant un angle α avec l’horizontale, en projetant a = g puis en intégrant deux fois :

- a_x = 0 → v_x = v₀ cos α → x = v₀ cos α × t
- a_y = −g → v_y = −g t + v₀ sin α → y = −½ g t² + v₀ sin α × t + y₀

En éliminant t : y = −g x² / (2 v₀² cos²α) + x tan α + y₀ — l’équation d’une **parabole**.

Le mouvement se décompose donc en un mouvement **uniforme** à l’horizontale et **uniformément accéléré** à la verticale : les deux sont indépendants.

## Portée et flèche
La **flèche** (altitude maximale) est atteinte quand v_y = 0. La **portée** s’obtient en cherchant le second point où y retrouve sa valeur initiale. Sans frottement, la portée est maximale pour α = 45°.

## Le champ électrique uniforme
Entre deux plaques planes parallèles séparées de d et soumises à une tension U, le champ est uniforme, dirigé du **+** vers le **−**, de valeur :

E = U / d

Une particule de charge q y subit F = q E. Si la charge est positive, la force est dans le sens de E ; si elle est négative, en sens inverse. L’accélération a = qE/m dépend cette fois de la **masse et de la charge** — c’est ce qui permet de trier des particules.

## L’analogie
Un électron lancé perpendiculairement à E entre deux plaques suit **exactement la même parabole** qu’un ballon lancé horizontalement : mêmes équations, seul le rapport force/masse change. Le poids d’un électron est d’ailleurs totalement négligeable devant la force électrique.

## L’énergie
En l’absence de frottement, l’**énergie mécanique** Em = Ec + Ep se conserve. Elle donne une vitesse en un point sans passer par les équations horaires : ½mv² + mgz = constante. C’est souvent le chemin le plus court.

> Le mouvement d’un projectile ne dépend pas de sa masse ; celui d’une particule chargée en dépend. Confondre les deux cas est l’erreur la plus fréquente du chapitre.`,
          },
          questions: [
            ['Un champ uniforme est un champ…', ['De même valeur, direction et sens en tout point', 'Qui ne varie pas dans le temps', 'Dont la valeur décroît en 1/r²', 'Qui n’exerce aucune force'], 0, 'Le champ de pesanteur l’est localement ; le champ de gravitation ne l’est pas à grande échelle.'],
            ['La trajectoire d’un projectile en chute libre avec vitesse initiale oblique est…', ['Une parabole', 'Une droite', 'Un cercle', 'Une hyperbole'], 0, 'Mouvement uniforme à l’horizontale, uniformément accéléré à la verticale.'],
            ['Le mouvement d’un projectile en chute libre dépend de sa masse.', ['Vrai', 'Faux'], 1, 'a = g, indépendante de m : plume et bille tombent ensemble dans le vide.'],
            ['Que vaut le champ électrique entre deux plaques parallèles distantes de d, sous tension U ?', ['E = U / d', 'E = U × d', 'E = d / U', 'E = q / d'], 0, 'Il est dirigé de la plaque positive vers la plaque négative.'],
            ['Quand la flèche d’un tir est-elle atteinte ?', ['Quand la composante verticale de la vitesse s’annule', 'Quand la vitesse totale s’annule', 'À la moitié de la portée en temps seulement', 'Au moment du lancer'], 0, 'La composante horizontale, elle, ne s’annule jamais dans un tir sans frottement.'],
            ['L’accélération d’une particule chargée dans un champ électrique uniforme vaut…', ['a = qE/m', 'a = g', 'a = qE', 'a = E/q'], 0, 'Elle dépend donc de la charge ET de la masse, contrairement à la chute libre.'],
            ['Pour un tir sans frottement, quel angle donne la portée maximale ?', ['45°', '30°', '60°', '90°'], 0, 'C’est le compromis entre durée de vol et vitesse horizontale.'],
            ['En l’absence de frottement, l’énergie mécanique d’un projectile se conserve.', ['Vrai', 'Faux'], 0, 'Ec + Ep = constante : cela donne une vitesse sans passer par les équations horaires.'],
          ],
        },
        {
          titre: 'Mouvement dans un champ de gravitation',
          axe: 'Mouvements et interactions',
          lecon: {
            titre: 'Tomber sans jamais toucher le sol',
            cours: `Un satellite en orbite n’échappe pas à la gravitation : il tombe en permanence, mais sa vitesse horizontale est telle que le sol se dérobe aussi vite qu’il descend.

## La loi de gravitation universelle
Deux corps de masses m_A et m_B, distants de r, s’attirent avec une force de valeur :

F = G × m_A × m_B / r²

avec G = 6,67 × 10⁻¹¹ N·m²·kg⁻². Le **champ de gravitation** créé par un astre de masse M à la distance r vaut G(r) = G M / r², dirigé **vers** l’astre. Il n’est **pas uniforme** : il décroît en 1/r².

## Le mouvement circulaire d’un satellite
En appliquant la deuxième loi de Newton à un satellite en orbite circulaire de rayon r, la seule force étant l’attraction de l’astre, l’accélération est **centripète** de valeur v²/r. D’où :

v² / r = G M / r², soit **v = √(G M / r)**

Trois conséquences immédiates :
- la vitesse ne dépend **pas de la masse du satellite** ;
- plus l’orbite est **basse**, plus le satellite va **vite** ;
- le mouvement est **uniforme** (la valeur de v est constante), car aucune force n’a de composante tangentielle.

## La période et la troisième loi de Kepler
La période de révolution vaut T = 2πr / v, d’où :

T² / r³ = 4π² / (G M) = constante pour tous les satellites du même astre

C’est la **troisième loi de Kepler**. Elle permet de peser un astre à partir de l’orbite d’un seul de ses satellites.

## Les trois lois de Kepler
1. Les planètes décrivent des **ellipses** dont le Soleil occupe un **foyer**.
2. Le segment astre-planète balaie des **aires égales en des durées égales** (loi des aires) : la planète va plus vite au périhélie.
3. T²/a³ est la même constante pour toutes les planètes du système (a = demi-grand axe).

## Le satellite géostationnaire
Il paraît immobile au-dessus d’un point du sol, ce qui impose trois conditions : orbite **équatoriale**, sens de rotation **identique** à celui de la Terre, et période **égale à un jour sidéral** (86 164 s). La troisième loi de Kepler donne alors un rayon d’orbite unique, d’environ 42 200 km depuis le centre de la Terre — soit environ 36 000 km d’altitude.

## L’impesanteur
Un astronaute en orbite n’est pas « hors de la gravité » : il est en **chute libre permanente** avec son vaisseau. Tous deux tombent avec la même accélération, d’où l’absence de force de contact — et la sensation d’apesanteur.

> Le champ de gravitation près du sol est assimilé à un champ uniforme : sur quelques dizaines de mètres, r varie si peu que G M/r² ne bouge pas. C’est le lien entre ce chapitre et le précédent.`,
          },
          questions: [
            ['Quelle est l’expression de la vitesse d’un satellite en orbite circulaire de rayon r ?', ['v = √(G M / r)', 'v = G M / r²', 'v = √(G M r)', 'v = 2πr / G'], 0, 'Elle ne dépend pas de la masse du satellite, seulement de celle de l’astre et du rayon.'],
            ['Plus l’orbite d’un satellite est basse, plus sa vitesse est…', ['Grande', 'Petite', 'Inchangée', 'Nulle'], 0, 'v = √(GM/r) : la vitesse décroît quand r augmente.'],
            ['Que dit la troisième loi de Kepler ?', ['T²/a³ est une constante pour tous les satellites d’un même astre', 'Les orbites sont circulaires', 'Les aires balayées sont égales en des durées égales', 'La force varie en 1/r'], 0, 'C’est la deuxième loi qui énonce la loi des aires.'],
            ['Le mouvement circulaire d’un satellite est uniforme.', ['Vrai', 'Faux'], 0, 'La force est purement centripète : aucune composante tangentielle, donc v constante en valeur.'],
            ['Quelles conditions doit remplir un satellite géostationnaire ?', ['Orbite équatoriale, même sens de rotation que la Terre, période d’un jour sidéral', 'Orbite polaire et période de 12 h', 'Altitude de 400 km', 'Masse égale à celle de la station spatiale'], 0, 'Ces trois conditions fixent une orbite unique, à environ 36 000 km d’altitude.'],
            ['Un astronaute en orbite ne subit plus la gravitation terrestre.', ['Vrai', 'Faux'], 1, 'Il est en chute libre permanente avec son vaisseau : c’est l’impesanteur, pas l’absence de gravité.'],
            ['Selon la première loi de Kepler, la trajectoire d’une planète est…', ['Une ellipse dont le Soleil occupe un foyer', 'Un cercle centré sur le Soleil', 'Une parabole', 'Une droite'], 0, 'Le cercle n’en est que le cas particulier.'],
            ['Comment le champ de gravitation varie-t-il avec la distance à l’astre ?', ['Il décroît en 1/r²', 'Il est uniforme partout', 'Il décroît en 1/r', 'Il croît avec r'], 0, 'Près du sol, r varie si peu qu’on peut l’assimiler à un champ uniforme.'],
          ],
        },
        {
          titre: 'Écoulement d’un fluide incompressible',
          axe: 'Mouvements et interactions',
          lecon: {
            titre: 'Là où le fluide accélère, la pression tombe',
            cours: `Un fluide en mouvement obéit encore à la conservation de la matière et de l’énergie — mais réécrites pour un milieu qui coule.

## Le débit volumique
Le **débit volumique** Dv, en m³·s⁻¹, est le volume traversant une section par unité de temps :

Dv = V / Δt = S × v

où S est l’aire de la section et v la vitesse moyenne du fluide.

## La conservation du débit
Pour un fluide **incompressible** (masse volumique constante — les liquides, et les gaz à faible vitesse) en écoulement **stationnaire**, le débit est le **même dans toutes les sections** d’une canalisation :

S₁ v₁ = S₂ v₂

Là où la section se **rétrécit**, la vitesse **augmente**. C’est pourquoi on pince l’extrémité d’un tuyau d’arrosage pour envoyer l’eau plus loin.

## La relation de Bernoulli
Le long d’une ligne de courant, pour un fluide incompressible en écoulement stationnaire et **sans frottement** :

P + ½ρv² + ρgz = constante

Les trois termes sont homogènes à une pression : la **pression statique** P, la **pression dynamique** ½ρv², et le terme de **hauteur** ρgz. La relation est une conservation de l’énergie par unité de volume.

## L’effet Venturi
Dans un rétrécissement horizontal (z constant), la vitesse augmente donc la pression **diminue**. C’est contre-intuitif : le fluide va plus vite là où il est le moins comprimé.

Applications : trompe à eau, carburateur, débitmètre à Venturi, portance d’une aile, et le fait qu’une douche colle au rideau.

## Les limites du modèle
Bernoulli suppose un fluide parfait : sans **viscosité**, donc sans perte de charge. Dans une conduite réelle, les frottements font chuter la pression le long du trajet, et il faut une pompe pour l’entretenir. La relation reste néanmoins un excellent modèle sur de courtes distances et à vitesse modérée.

## Écoulement laminaire ou turbulent
Un écoulement **laminaire** se fait en couches parallèles qui ne se mélangent pas ; un écoulement **turbulent** est chaotique et dissipe beaucoup plus d’énergie. Le passage de l’un à l’autre dépend de la vitesse, du diamètre et de la viscosité.

> Vérifier les hypothèses avant d’appliquer Bernoulli — incompressible, stationnaire, sans frottement, le long d’une même ligne de courant — vaut la moitié des points de l’exercice.`,
          },
          questions: [
            ['Quelle relation donne le débit volumique ?', ['Dv = S × v', 'Dv = S / v', 'Dv = ρ × v', 'Dv = v / S'], 0, 'S est l’aire de la section, v la vitesse moyenne du fluide.'],
            ['Dans un rétrécissement de canalisation, la vitesse du fluide…', ['Augmente', 'Diminue', 'Ne change pas', 'S’annule'], 0, 'La conservation du débit impose S₁v₁ = S₂v₂.'],
            ['Que dit la relation de Bernoulli ?', ['P + ½ρv² + ρgz est constante le long d’une ligne de courant', 'P × V = constante', 'P = ρgh toujours', 'La vitesse est constante partout'], 0, 'C’est une conservation de l’énergie par unité de volume.'],
            ['Dans un rétrécissement horizontal, la pression du fluide augmente.', ['Vrai', 'Faux'], 1, 'Effet Venturi : la vitesse augmente, donc la pression statique diminue.'],
            ['Un fluide incompressible est un fluide dont…', ['La masse volumique reste constante', 'La vitesse est constante', 'La pression est constante', 'La viscosité est nulle'], 0, 'C’est une bonne approximation pour les liquides et pour les gaz à faible vitesse.'],
            ['Quelle hypothèse la relation de Bernoulli exige-t-elle en plus de l’incompressibilité ?', ['Un écoulement stationnaire et sans frottement', 'Un écoulement turbulent', 'Une température constante', 'Une section constante'], 0, 'La viscosité réelle provoque des pertes de charge que le modèle ignore.'],
            ['Un écoulement laminaire se fait en couches parallèles qui ne se mélangent pas.', ['Vrai', 'Faux'], 0, 'L’écoulement turbulent, chaotique, dissipe bien davantage d’énergie.'],
            ['Quel dispositif exploite directement l’effet Venturi ?', ['Le débitmètre à Venturi', 'Le thermomètre', 'Le conductimètre', 'Le pH-mètre'], 0, 'Comme la trompe à eau ou le carburateur : la dépression y est créée par l’accélération du fluide.'],
          ],
        },
        // ---- Chapitre 6 : L'énergie, conversion et transferts ---------------
        {
          titre: 'Description d’un système thermodynamique',
          axe: 'L’énergie : conversion et transferts',
          lecon: {
            titre: 'Deux échelles pour un même objet',
            cours: `Un litre d’eau, c’est 3 × 10²⁵ molécules en mouvement désordonné. On ne les suivra jamais une par une : la thermodynamique décrit ce même système avec **quatre grandeurs**.

## Macroscopique et microscopique
- **échelle microscopique** : les entités individuelles (molécules, ions), leurs vitesses, leurs positions ;
- **échelle macroscopique** : les grandeurs mesurables sur l’ensemble — pression, volume, température, quantité de matière.

Les grandeurs macroscopiques sont des **moyennes statistiques** de ce qui se passe en bas. La pression d’un gaz, c’est l’effet moyen des chocs des molécules sur les parois ; la température, l’agitation moyenne.

## Le système et son extérieur
Un **système** est la portion d’univers qu’on décide d’étudier ; tout le reste est l’**extérieur**. Il peut être :
- **ouvert** : échange matière et énergie (une casserole sans couvercle) ;
- **fermé** : échange l’énergie mais pas la matière (une bouteille bouchée) ;
- **isolé** : n’échange rien (le calorimètre idéal).

## Les variables d’état
P, V, T et n décrivent l’état du système à un instant donné, sans rien dire de son histoire. Une **transformation** fait passer d’un état initial à un état final ; l’**équilibre thermodynamique** est atteint quand elles ne varient plus.

## La température
La **température thermodynamique** T se mesure en **kelvin (K)** : T(K) = θ(°C) + 273,15. Le zéro absolu (0 K = −273,15 °C) correspond à l’agitation minimale. La température est directement liée à l’**énergie cinétique moyenne** des entités : deux fois plus chaud en kelvin, c’est deux fois plus agité.

Toute formule contenant T doit employer le **kelvin** — l’usage des °C n’est licite que dans les **écarts** ΔT, puisqu’un écart de 1 °C vaut un écart de 1 K.

## L’énergie interne
L’**énergie interne U** d’un système est la somme de **toutes** les énergies à l’échelle microscopique : énergies cinétiques d’agitation et énergies d’interaction entre entités. Elle ne comprend **ni** l’énergie cinétique d’ensemble du système, **ni** son énergie potentielle de pesanteur : une bouteille d’eau posée sur une table et la même bouteille dans un train lancé ont la même énergie interne.

C’est une **fonction d’état** : sa variation ΔU ne dépend que de l’état initial et de l’état final, jamais du chemin suivi.

## La capacité thermique
La **capacité thermique** C d’un corps (en J·K⁻¹) est l’énergie à lui fournir pour élever sa température de 1 K. Pour un corps homogène de masse m, C = m × c, où **c** est la **capacité thermique massique** (en J·kg⁻¹·K⁻¹). Celle de l’eau liquide, 4185 J·kg⁻¹·K⁻¹, est remarquablement élevée : c’est ce qui fait de l’eau un bon fluide caloporteur et ce qui adoucit les climats côtiers.

> Chaleur et température ne sont pas la même chose : la température est un état, le transfert thermique est un échange. Un système « ne contient pas de chaleur », il contient de l’énergie interne.`,
          },
          questions: [
            ['Un système fermé…', ['Échange de l’énergie mais pas de matière', 'N’échange rien du tout', 'Échange matière et énergie', 'Est toujours à l’équilibre'], 0, 'Le système isolé n’échange rien, le système ouvert échange les deux.'],
            ['Quelle unité employer pour la température dans les formules de thermodynamique ?', ['Le kelvin', 'Le degré Celsius', 'Le degré Fahrenheit', 'Le joule'], 0, 'Sauf pour les écarts ΔT, où 1 °C et 1 K sont équivalents.'],
            ['L’énergie interne d’un système comprend son énergie cinétique d’ensemble.', ['Vrai', 'Faux'], 1, 'Elle ne rassemble que les énergies à l’échelle microscopique.'],
            ['À quoi la température est-elle directement liée à l’échelle microscopique ?', ['À l’énergie cinétique moyenne des entités', 'Au nombre d’entités', 'À la masse du système', 'Au volume occupé'], 0, 'C’est ce qui donne un sens physique au zéro absolu.'],
            ['L’énergie interne est une fonction d’état.', ['Vrai', 'Faux'], 0, 'Sa variation ne dépend que des états initial et final, pas du chemin suivi.'],
            ['Que vaut la capacité thermique massique de l’eau liquide ?', ['4185 J·kg⁻¹·K⁻¹', '385 J·kg⁻¹·K⁻¹', '1000 J·kg⁻¹·K⁻¹', '4185 J·K⁻¹'], 0, 'Une valeur remarquablement élevée, qui fait de l’eau un bon fluide caloporteur.'],
            ['Que vaut 25 °C en kelvin ?', ['298,15 K', '273,15 K', '25 K', '248,15 K'], 0, 'T(K) = θ(°C) + 273,15.'],
            ['La pression d’un gaz s’interprète, à l’échelle microscopique, comme…', ['L’effet moyen des chocs des molécules sur les parois', 'Le poids du gaz', 'La vitesse moyenne des molécules', 'Le nombre de molécules par unité de volume'], 0, 'Les grandeurs macroscopiques sont des moyennes statistiques.'],
          ],
        },
        {
          titre: 'Variation de l’énergie interne d’un système',
          axe: 'L’énergie : conversion et transferts',
          lecon: {
            titre: 'Chauffer, ou changer d’état : deux factures différentes',
            cours: `Faire monter la température d’un corps a un coût énergétique ; le faire fondre en a un autre, sans qu’aucun thermomètre ne bouge.

## La variation d’énergie interne d’une phase condensée
Pour un solide ou un liquide (**phase condensée incompressible**), dont le volume ne change pratiquement pas, l’énergie interne ne dépend que de la température :

ΔU = C × ΔT = m × c × ΔT

avec C en J·K⁻¹, c en J·kg⁻¹·K⁻¹, ΔT = T_final − T_initial en K (ou en °C, puisque c’est un écart). Le signe de ΔU suit celui de ΔT : refroidir, c’est perdre de l’énergie interne.

## Le changement d’état
Pendant un changement d’état d’un corps pur, la **température reste constante** alors que le système reçoit ou cède de l’énergie. L’énergie sert à **rompre ou former les interactions** entre entités, pas à les agiter davantage :

Q = m × L

où **L** est l’**énergie massique de changement d’état** (J·kg⁻¹). Pour l’eau : L_fusion ≈ 3,34 × 10⁵ J·kg⁻¹, L_vaporisation ≈ 2,26 × 10⁶ J·kg⁻¹ — près de sept fois plus. Fondre un glaçon coûte l’équivalent d’un chauffage de 80 °C ; le vaporiser, l’équivalent de 540 °C.

C’est ce qui explique la transpiration : l’eau qui s’évapore prélève cette énergie sur la peau.

## Les modes de transfert
L’énergie entre ou sort d’un système par deux voies :
- le **travail W** : transfert **ordonné**, par une force (compression d’un gaz, agitation mécanique, travail électrique) ;
- le **transfert thermique Q** : transfert **désordonné**, dû à une différence de température.

Les deux se comptent en joules, et la distinction n’est pas de nature mais d’ordre : le travail déplace la matière en bloc, le transfert thermique passe de proche en proche.

## La convention de signe
Toute énergie **reçue** par le système est comptée **positivement**, toute énergie **cédée** négativement. C’est la convention du « banquier » : ce qui entre sur le compte est positif. Se tromper de signe, c’est se tromper de sens physique.

## Le calorimètre
Un calorimètre approche un système **isolé**. En y mélangeant deux corps de températures différentes, l’énergie cédée par l’un est reçue par l’autre : Q₁ + Q₂ = 0 (aux pertes et à la capacité du vase près, qu’on modélise par une **valeur en eau**). C’est la méthode expérimentale pour mesurer une capacité thermique massique ou une énergie de changement d’état.

> Une erreur classique : appliquer ΔU = mcΔT à travers un changement d’état. Il faut découper le calcul en tranches — chauffer jusqu’à la température de changement d’état, changer d’état, puis chauffer à nouveau.`,
          },
          questions: [
            ['Quelle relation donne la variation d’énergie interne d’une phase condensée ?', ['ΔU = m × c × ΔT', 'ΔU = m × L', 'ΔU = P × ΔV', 'ΔU = Q / m'], 0, 'Valable tant qu’il n’y a pas de changement d’état.'],
            ['Pendant un changement d’état d’un corps pur, la température…', ['Reste constante', 'Augmente régulièrement', 'Diminue', 'Varie de façon imprévisible'], 0, 'L’énergie sert à rompre ou former les interactions entre entités.'],
            ['Quelle énergie faut-il pour faire fondre une masse m de glace ?', ['Q = m × L_fusion', 'Q = m × c × ΔT', 'Q = m × g × h', 'Q = m × c'], 0, 'L_fusion de l’eau vaut environ 3,34 × 10⁵ J·kg⁻¹.'],
            ['Selon la convention adoptée, une énergie reçue par le système est comptée…', ['Positivement', 'Négativement', 'Nulle', 'Selon le sens du travail'], 0, 'Convention du banquier : ce qui entre est positif.'],
            ['Le travail est un mode de transfert d’énergie désordonné.', ['Vrai', 'Faux'], 1, 'C’est le transfert thermique qui est désordonné ; le travail est ordonné.'],
            ['Vaporiser de l’eau coûte plus d’énergie que la fondre.', ['Vrai', 'Faux'], 0, 'Environ sept fois plus : 2,26 × 10⁶ contre 3,34 × 10⁵ J·kg⁻¹.'],
            ['Que modélise la « valeur en eau » d’un calorimètre ?', ['La capacité thermique du vase lui-même', 'La masse d’eau à introduire', 'Les pertes par rayonnement', 'Le volume utile du calorimètre'], 0, 'Elle s’ajoute à la masse d’eau dans le bilan Q₁ + Q₂ = 0.'],
            ['Pour chauffer de la glace à −10 °C jusqu’à de l’eau à 20 °C, on applique directement ΔU = mcΔT.', ['Vrai', 'Faux'], 1, 'Il faut découper : chauffage de la glace, fusion à 0 °C, puis chauffage de l’eau liquide.'],
          ],
        },
        {
          titre: 'Le premier principe de la thermodynamique',
          axe: 'L’énergie : conversion et transferts',
          lecon: {
            titre: 'Rien ne se perd : tout se compte',
            cours: `Le premier principe n’est pas une formule de plus : c’est la **conservation de l’énergie**, énoncée pour un système qui échange avec son extérieur.

## L’énoncé
Pour un système fermé au repos, entre un état initial et un état final :

**ΔU = W + Q**

La variation d’énergie interne est égale à la somme du **travail** et du **transfert thermique** reçus, comptés algébriquement. Deux conséquences immédiates :
- l’énergie ne se crée ni ne se détruit : elle **change de forme** ou **change de main** ;
- ΔU ne dépend **que des états initial et final** (fonction d’état), alors que W et Q dépendent **du chemin suivi**. Deux chemins différents entre les mêmes états donnent des W et des Q différents, mais la même somme.

## Le cas du système isolé
Un système isolé n’échange ni travail ni transfert thermique : W = Q = 0, donc **ΔU = 0**. Son énergie interne est constante — ce qui n’empêche aucune transformation à l’intérieur, seulement toute variation du total.

## Les bilans usuels
- **transformation isotherme d’une phase condensée** : ΔU = 0, donc W = −Q ;
- **transfert thermique seul** (pas de travail) : ΔU = Q ;
- **travail seul** (parois calorifugées, transformation dite adiabatique) : ΔU = W. C’est le cas de l’expérience de Joule : agiter de l’eau la réchauffe, sans jamais l’avoir chauffée.

## Les machines thermiques
Une machine thermique échange avec deux sources à des températures différentes. Le premier principe impose que le total se conserve, mais **il n’interdit rien sur le sens** : c’est le second principe (hors programme ici) qui interdit à la chaleur de remonter spontanément du froid vers le chaud.

Le **rendement** d’un convertisseur est le rapport de l’énergie utile à l’énergie fournie :

η = E_utile / E_fournie, toujours inférieur à 1

Le complément part en pertes, essentiellement en transfert thermique vers l’extérieur.

## La chaîne énergétique
Un diagramme de chaîne énergétique représente les réservoirs, les convertisseurs et les transferts (flèches). Il rend le bilan lisible : **la somme des flèches entrantes égale la somme des flèches sortantes**, pour chaque bloc. C’est le premier principe dessiné.

> « Consommer de l’énergie » est un abus de langage : on la **convertit** en une forme moins utilisable. Ce qu’on paye sur une facture, c’est une conversion, pas une disparition.`,
          },
          questions: [
            ['Quel est l’énoncé du premier principe pour un système fermé au repos ?', ['ΔU = W + Q', 'ΔU = W − Q', 'ΔU = Q / W', 'U = W × Q'], 0, 'C’est la conservation de l’énergie, écrite pour un système qui échange avec l’extérieur.'],
            ['W et Q dépendent du chemin suivi, mais leur somme n’en dépend pas.', ['Vrai', 'Faux'], 0, 'ΔU est une fonction d’état : elle ne dépend que des états initial et final.'],
            ['Pour un système isolé, que vaut ΔU ?', ['Zéro', 'W seulement', 'Q seulement', 'Cela dépend de la transformation'], 0, 'Il n’échange ni travail ni transfert thermique avec l’extérieur.'],
            ['Que vaut ΔU lors d’une transformation adiabatique ?', ['ΔU = W', 'ΔU = Q', 'ΔU = 0', 'ΔU = W + Q ≠ 0 sans simplification'], 0, 'Les parois calorifugées annulent Q : c’est l’expérience de Joule.'],
            ['Le rendement d’un convertisseur d’énergie peut-il dépasser 1 ?', ['Non, jamais', 'Oui, avec un bon isolant', 'Oui, pour une machine thermique', 'Oui, si le système est isolé'], 0, 'L’énergie utile ne peut pas dépasser l’énergie fournie.'],
            ['Sur un diagramme de chaîne énergétique, que vérifie chaque bloc ?', ['La somme des flèches entrantes égale la somme des sortantes', 'Les flèches entrantes sont toujours plus nombreuses', 'Seule l’énergie utile est représentée', 'Les pertes ne sont pas figurées'], 0, 'C’est le premier principe mis en dessin.'],
            ['Le premier principe interdit à la chaleur de passer spontanément du corps froid au corps chaud.', ['Vrai', 'Faux'], 1, 'Il impose seulement la conservation ; c’est le second principe qui fixe le sens.'],
            ['« Consommer de l’énergie » signifie rigoureusement…', ['La convertir en une forme moins utilisable', 'La détruire', 'La stocker', 'La créer à partir de matière'], 0, 'Rien ne disparaît : le premier principe l’interdit.'],
          ],
        },
        {
          titre: 'Transferts thermiques',
          axe: 'L’énergie : conversion et transferts',
          lecon: {
            titre: 'Trois façons de passer du chaud au froid',
            cours: `Un transfert thermique est spontané et **toujours orienté du corps chaud vers le corps froid**, jusqu’à l’égalité des températures. Trois mécanismes le portent.

## Les trois modes
- la **conduction** : de proche en proche, sans déplacement de matière. C’est le mode des solides — une cuillère métallique dans une casserole.
- la **convection** : par déplacement de matière, dans les fluides. L’air chaud, moins dense, monte, et un mouvement d’ensemble s’installe. C’est ainsi que chauffe un radiateur.
- le **rayonnement** : par ondes électromagnétiques, **sans support matériel**. C’est le seul mode qui traverse le vide — celui par lequel le Soleil nous chauffe.

Dans la plupart des situations réelles, les trois coexistent.

## Le flux thermique
Le **flux thermique** Φ est l’énergie transférée par unité de temps, en **watts** :

Φ = Q / Δt

## La résistance thermique
Pour une paroi plane d’épaisseur e, de surface S et de conductivité thermique λ (en W·m⁻¹·K⁻¹) :

R_th = e / (λ × S), en K·W⁻¹, et Φ = ΔT / R_th

L’analogie électrique est complète : ΔT joue le rôle de la tension, Φ celui de l’intensité, R_th celui de la résistance. Des parois en série **additionnent** leurs résistances — d’où le calcul d’un mur multicouche.

Un bon **isolant** a une faible λ (laine de verre : 0,04 W·m⁻¹·K⁻¹) ; un bon **conducteur** une grande λ (cuivre : 390). L’air immobile est un excellent isolant — c’est tout le principe du double vitrage, du pull et du plumage.

## La loi de refroidissement de Newton
Pour un corps de température T dans un milieu à T_ext, le flux perdu est proportionnel à l’écart :

Φ = h × S × (T − T_ext)

Il en résulte une décroissance **exponentielle** de l’écart de température : un café chaud refroidit vite au début, lentement ensuite. C’est la même forme mathématique que la décroissance radioactive ou la décharge d’un condensateur.

## Le bilan thermique d’un système
En régime **stationnaire**, ce qui entre égale ce qui sort et la température ne varie plus. Si l’un des deux l’emporte, le système s’échauffe ou se refroidit : la différence vaut m c dT/dt. C’est ce bilan qui gouverne aussi bien le chauffage d’une maison que l’**effet de serre** — le rayonnement solaire reçu contre le rayonnement infrarouge réémis, dont une partie est renvoyée au sol par l’atmosphère.

> Un manteau ne « donne » pas de chaleur : il **freine** le flux qui sort. C’est la résistance thermique qu’on achète, pas une source.`,
          },
          questions: [
            ['Quel mode de transfert thermique ne nécessite aucun support matériel ?', ['Le rayonnement', 'La conduction', 'La convection', 'Aucun'], 0, 'C’est ainsi que l’énergie du Soleil nous parvient à travers le vide.'],
            ['Quelle est l’unité du flux thermique Φ ?', ['Le watt', 'Le joule', 'Le kelvin', 'Le watt par mètre'], 0, 'Φ = Q/Δt : c’est une puissance.'],
            ['Quelle est l’expression de la résistance thermique d’une paroi plane ?', ['R_th = e / (λ × S)', 'R_th = λ × S / e', 'R_th = e × λ / S', 'R_th = ΔT × Φ'], 0, 'Elle croît avec l’épaisseur et décroît avec la conductivité et la surface.'],
            ['Des parois placées en série additionnent leurs résistances thermiques.', ['Vrai', 'Faux'], 0, 'L’analogie avec les résistances électriques en série est complète.'],
            ['Un bon isolant thermique possède…', ['Une faible conductivité thermique λ', 'Une grande conductivité thermique λ', 'Une grande surface', 'Une faible épaisseur'], 0, 'Laine de verre : 0,04 W·m⁻¹·K⁻¹, contre 390 pour le cuivre.'],
            ['Que dit la loi de refroidissement de Newton ?', ['Le flux perdu est proportionnel à l’écart de température', 'La température décroît linéairement', 'Le flux est constant', 'Le refroidissement est instantané'], 0, 'L’écart de température décroît alors exponentiellement.'],
            ['La convection suppose un déplacement de matière.', ['Vrai', 'Faux'], 0, 'C’est ce qui la distingue de la conduction, qui se fait de proche en proche.'],
            ['En régime stationnaire, la température d’un système…', ['Ne varie plus, car les flux entrant et sortant se compensent', 'Augmente régulièrement', 'Décroît exponentiellement', 'Oscille'], 0, 'Si un flux l’emporte, le système s’échauffe ou se refroidit.'],
          ],
        },
        // ---- Chapitre 7 : Ondes et signaux ----------------------------------
        {
          titre: 'L’intensité sonore',
          axe: 'Ondes et signaux',
          lecon: {
            titre: 'Pourquoi l’échelle des décibels n’est pas une échelle ordinaire',
            cours: `L’oreille humaine perçoit des sons dont les intensités s’étalent sur **douze puissances de dix**. Aucune échelle linéaire ne pourrait les porter : d’où le décibel.

## L’intensité sonore
L’**intensité sonore** I est la puissance sonore reçue par unité de surface, en **W·m⁻²**. Deux repères :
- **seuil d’audibilité** : I₀ = 1,0 × 10⁻¹² W·m⁻² (la référence) ;
- **seuil de douleur** : environ 1 W·m⁻², soit 10¹² fois plus.

## Le niveau d’intensité sonore
L = 10 × log(I / I₀), en **décibels (dB)**

Le seuil d’audibilité vaut donc 0 dB, le seuil de douleur 120 dB. Une conversation, 60 dB ; une rue passante, 80 dB.

## Les trois règles à retenir
- intensité **multipliée par 10** → niveau **+ 10 dB** ;
- intensité **multipliée par 2** → niveau **+ 3 dB** (car 10 log 2 ≈ 3) ;
- deux sources identiques ensemble → **+ 3 dB**, jamais le double du niveau.

Une erreur classique : croire que 60 dB + 60 dB font 120 dB. Deux machines à 60 dB donnent 63 dB.

## L’atténuation géométrique
Loin d’une source ponctuelle rayonnant dans toutes les directions, la puissance se répartit sur une sphère de surface 4πd² :

I = P / (4π d²)

L’intensité décroît donc en **1/d²** : doubler la distance divise l’intensité par 4, soit **− 6 dB**. C’est l’atténuation **géométrique**, qui n’a rien à voir avec une perte d’énergie : l’énergie est seulement étalée.

## L’atténuation par absorption
Le milieu, lui, absorbe réellement : une paroi, un isolant, l’air sur de grandes distances convertissent une part de l’énergie sonore en énergie interne. C’est l’**atténuation par absorption**, exprimée elle aussi en dB, et qui **s’additionne** à l’atténuation géométrique :

A = L_émis − L_reçu

## La sensibilité de l’oreille
La perception ne suit ni I ni exactement L : l’oreille est plus sensible entre 1 et 4 kHz qu’aux extrêmes, ce qui a conduit à la pondération **dB(A)** utilisée en acoustique réglementaire. Une exposition prolongée au-delà de 85 dB endommage l’audition, de façon **irréversible** — les cellules ciliées ne se régénèrent pas.

> Le décibel n’est pas une unité au sens strict : c’est un **rapport** transformé en logarithme. Un niveau de 0 dB ne signifie donc pas « pas de son », mais « son au seuil d’audibilité ».`,
          },
          questions: [
            ['Quelle est l’expression du niveau d’intensité sonore ?', ['L = 10 × log(I / I₀)', 'L = log(I / I₀)', 'L = 10 × I / I₀', 'L = 20 × ln(I / I₀)'], 0, 'Avec I₀ = 1,0 × 10⁻¹² W·m⁻², le seuil d’audibilité.'],
            ['Que vaut le niveau sonore résultant de deux sources identiques de 60 dB chacune ?', ['63 dB', '120 dB', '60 dB', '70 dB'], 0, 'Les intensités s’additionnent, pas les niveaux : doubler I ajoute 3 dB.'],
            ['Multiplier l’intensité sonore par 10 revient à ajouter…', ['10 dB', '3 dB', '100 dB', '1 dB'], 0, 'Le facteur 2 correspond, lui, à environ 3 dB.'],
            ['Doubler la distance à une source sonore ponctuelle fait perdre…', ['6 dB', '3 dB', '10 dB', '12 dB'], 0, 'L’intensité décroît en 1/d² : quadruplement de la surface, donc division par 4.'],
            ['L’atténuation géométrique correspond à une perte réelle d’énergie sonore.', ['Vrai', 'Faux'], 1, 'L’énergie est seulement répartie sur une sphère plus grande ; c’est l’absorption qui la convertit.'],
            ['Quelle est l’unité de l’intensité sonore I ?', ['W·m⁻²', 'dB', 'W', 'J·m⁻²'], 0, 'Le décibel mesure le niveau L, pas l’intensité elle-même.'],
            ['Un niveau sonore de 0 dB signifie qu’il n’y a aucun son.', ['Vrai', 'Faux'], 1, 'Cela signifie que l’intensité vaut exactement I₀, le seuil d’audibilité.'],
            ['À partir de quel niveau une exposition prolongée endommage-t-elle l’audition ?', ['Environ 85 dB', '120 dB', '40 dB', '60 dB'], 0, 'Les dommages aux cellules ciliées sont irréversibles.'],
          ],
        },
        {
          titre: 'L’effet Doppler',
          axe: 'Ondes et signaux',
          lecon: {
            titre: 'La fréquence dépend de qui bouge',
            cours: `Le son d’une sirène qui s’approche est plus aigu que celui de la même sirène qui s’éloigne. Ce n’est pas la source qui change de note : c’est le mouvement relatif qui modifie la fréquence **reçue**.

## Le mécanisme
Quand la source se rapproche du récepteur, chaque front d’onde est émis **plus près** que le précédent : les fronts se resserrent, la longueur d’onde perçue diminue, donc la **fréquence perçue augmente**. Quand elle s’éloigne, l’inverse. La fréquence **émise**, elle, n’a jamais changé.

## La relation
Pour une source de fréquence f_e s’approchant du récepteur à la vitesse v, l’onde se propageant à la célérité c :

f_r = f_e × c / (c − v) si la source s’approche
f_r = f_e × c / (c + v) si elle s’éloigne

Quand v est petite devant c, on retient la forme approchée, celle qui sert le plus :

**Δf / f_e ≈ v / c**, avec Δf = f_r − f_e

## Le décalage temporel
On mesure souvent, non pas une fréquence, mais un **retard** entre deux signaux successifs. La méthode expérimentale consiste à enregistrer le son (par exemple avec un smartphone), à en extraire le spectre avant et après le passage, et à mesurer l’écart des deux pics.

## Les applications
- **radar routier** : l’onde émise se réfléchit sur le véhicule, qui joue successivement le rôle de récepteur puis de source. Le décalage subit donc **deux fois** l’effet, d’où Δf/f = 2v/c ;
- **échographie Doppler** : mesure la vitesse du sang dans un vaisseau, sur la réflexion sur les globules rouges ;
- **astrophysique** : le spectre d’une étoile qui s’éloigne est décalé vers les grandes longueurs d’onde — le **décalage vers le rouge**, ou *redshift*. Sa mesure systématique sur les galaxies lointaines a établi l’expansion de l’Univers ;
- **détection d’exoplanètes** : l’étoile tourne légèrement autour du centre de masse du système, et son spectre oscille au rythme de la planète.

## Ce que l’effet Doppler ne change pas
La **célérité** de l’onde reste celle du milieu : elle ne dépend pas du mouvement de la source. Seules la fréquence et la longueur d’onde perçues sont modifiées. Et si la source se déplace **perpendiculairement** à la ligne de visée, l’effet est nul : ce n’est pas la vitesse qui compte, mais sa **composante radiale**.

> Le mur du son se produit quand v atteint c : les fronts d’onde s’accumulent en une seule surface, l’onde de choc. La formule f_r = f_e c/(c−v) diverge — elle annonce le phénomène.`,
          },
          questions: [
            ['Quand une source sonore s’approche du récepteur, la fréquence perçue…', ['Augmente', 'Diminue', 'Ne change pas', 'S’annule'], 0, 'Les fronts d’onde se resserrent : la longueur d’onde perçue diminue.'],
            ['L’effet Doppler modifie la fréquence émise par la source.', ['Vrai', 'Faux'], 1, 'La source émet toujours la même fréquence : c’est la fréquence REÇUE qui change.'],
            ['Quelle est la forme approchée du décalage Doppler pour v petite devant c ?', ['Δf / f ≈ v / c', 'Δf / f ≈ c / v', 'Δf ≈ v × c', 'Δf / f ≈ v² / c²'], 0, 'C’est la relation utilisée dans la plupart des exercices.'],
            ['Pourquoi le décalage vaut-il 2v/c pour un radar routier ?', ['Le véhicule joue successivement le rôle de récepteur puis de source', 'La vitesse est doublée par la réflexion', 'L’onde parcourt deux fois la distance', 'Le radar émet deux ondes'], 0, 'L’effet Doppler s’applique donc deux fois de suite.'],
            ['Qu’observe-t-on sur le spectre d’une étoile qui s’éloigne de nous ?', ['Un décalage vers le rouge', 'Un décalage vers le bleu', 'Aucun décalage', 'Une disparition des raies'], 0, 'Le redshift des galaxies lointaines a établi l’expansion de l’Univers.'],
            ['La célérité de l’onde dépend-elle du mouvement de la source ?', ['Non, elle ne dépend que du milieu', 'Oui, elle augmente si la source approche', 'Oui, elle diminue si la source s’éloigne', 'Elle devient infinie au mur du son'], 0, 'Seules la fréquence et la longueur d’onde perçues sont modifiées.'],
            ['Une source se déplaçant perpendiculairement à la ligne de visée produit un effet Doppler nul.', ['Vrai', 'Faux'], 0, 'Seule la composante radiale de la vitesse compte.'],
            ['L’échographie Doppler mesure…', ['La vitesse du sang dans un vaisseau', 'La température du corps', 'L’épaisseur d’un organe', 'La composition du sang'], 0, 'Elle exploite la réflexion des ultrasons sur les globules rouges en mouvement.'],
          ],
        },
        {
          titre: 'Diffraction d’une onde',
          axe: 'Ondes et signaux',
          lecon: {
            titre: 'Ce qui prouve qu’une onde est une onde',
            cours: `Faites passer de la lumière par une fente très fine : au lieu d’un trait net, vous obtenez une figure étalée. Aucun modèle de particule ne prédit cela — c’est la signature du caractère **ondulatoire**.

## Le phénomène
La **diffraction** est l’étalement d’une onde lorsqu’elle rencontre une **ouverture** ou un **obstacle** dont la dimension a est du même ordre de grandeur que sa **longueur d’onde λ**. Elle concerne toutes les ondes : lumière, son, houle, ondes radio.

Plus l’ouverture est **petite**, plus l’étalement est **grand** — c’est contraire à l’intuition, et c’est le point à retenir.

## L’écart angulaire
Le demi-angle d’ouverture de la tache centrale vaut :

θ = λ / a (θ en radians)

Sur un écran placé à la distance D, la **largeur de la tache centrale** vaut :

L = 2 D θ = 2 λ D / a

C’est la relation qui permet de mesurer λ connaissant a, ou l’inverse — la mesure du diamètre d’un cheveu par diffraction en est l’application classique.

## Ce que la diffraction ne change pas
La diffraction **ne modifie ni la fréquence, ni la longueur d’onde, ni la célérité** de l’onde. Elle change seulement sa **répartition dans l’espace**. C’est une erreur fréquente de croire que la lumière « ralentit » ou « change de couleur » en traversant la fente.

## Les conséquences observables
- le son **contourne** un obstacle (grandes longueurs d’onde, de quelques centimètres à plusieurs mètres), alors que la lumière semble se propager en ligne droite : λ vaut pour elle quelques centaines de nanomètres, très inférieure à la taille des objets courants ;
- les **graves** se diffractent mieux que les aigus : c’est pourquoi, d’une pièce voisine, on n’entend que les basses ;
- la **résolution** d’un instrument d’optique est limitée par la diffraction sur son ouverture : deux étoiles trop proches donnent deux taches qui se recouvrent. C’est la raison profonde pour laquelle on construit de grands télescopes.

## En pratique au laboratoire
Un laser, une fente calibrée, un écran à quelques mètres : on mesure L, on connaît D et a, on en déduit λ. Le tracé de L en fonction de 1/a doit donner une **droite passant par l’origine**, de coefficient directeur 2λD — c’est la vérification quantitative du modèle.

> Diffraction et interférences se produisent souvent ensemble : la figure des fentes d’Young est faite de franges d’interférences **modulées** par l’enveloppe de diffraction de chaque fente.`,
          },
          questions: [
            ['À quelle condition une onde est-elle notablement diffractée ?', ['Quand la dimension de l’ouverture est de l’ordre de sa longueur d’onde', 'Quand l’ouverture est très grande', 'Quand la fréquence est très élevée', 'Quand le milieu est absorbant'], 0, 'Plus l’ouverture est petite devant λ, plus l’étalement est marqué.'],
            ['Quelle relation donne le demi-angle de diffraction ?', ['θ = λ / a', 'θ = a / λ', 'θ = λ × a', 'θ = 2λ / D'], 0, 'θ est exprimé en radians ; la tache centrale a pour largeur L = 2λD/a.'],
            ['Réduire la largeur de la fente…', ['Élargit la tache centrale', 'Rétrécit la tache centrale', 'Ne change rien', 'Supprime la diffraction'], 0, 'θ = λ/a : l’étalement est inversement proportionnel à la largeur.'],
            ['La diffraction modifie la longueur d’onde de l’onde diffractée.', ['Vrai', 'Faux'], 1, 'Ni la fréquence, ni la longueur d’onde, ni la célérité ne changent : seule la répartition spatiale change.'],
            ['Pourquoi entend-on surtout les basses depuis la pièce voisine ?', ['Leur grande longueur d’onde se diffracte mieux', 'Elles sont émises plus fort', 'Elles traversent les murs sans être absorbées', 'Les aigus sont réfléchis par le plafond'], 0, 'La diffraction est d’autant plus marquée que λ est grande devant l’ouverture.'],
            ['Quelle largeur a la tache centrale de diffraction sur un écran à la distance D ?', ['L = 2λD / a', 'L = λD / a', 'L = λ / (aD)', 'L = aD / λ'], 0, 'C’est le double de Dθ, la tache s’étalant de part et d’autre de l’axe.'],
            ['Le tracé de L en fonction de 1/a doit donner une droite passant par l’origine.', ['Vrai', 'Faux'], 0, 'De coefficient directeur 2λD : c’est la vérification quantitative du modèle.'],
            ['La diffraction limite la résolution des télescopes.', ['Vrai', 'Faux'], 0, 'Deux étoiles proches donnent deux taches qui se recouvrent — d’où l’intérêt des grands diamètres.'],
          ],
        },
        {
          titre: 'Interférences de deux ondes',
          axe: 'Ondes et signaux',
          lecon: {
            titre: 'Deux lumières qui donnent de l’ombre',
            cours: `Superposer deux ondes ne donne pas toujours « plus ». Selon leur décalage, elles peuvent s’additionner ou s’annuler : c’est l’**interférence**, second phénomène exclusivement ondulatoire.

## Le principe de superposition
Quand deux ondes se rencontrent, les élongations **s’ajoutent** algébriquement en chaque point. Après la rencontre, chacune poursuit son chemin sans avoir été modifiée.

## La condition de cohérence
Pour observer une figure d’interférences **stable**, les deux sources doivent être **cohérentes** : même fréquence et déphasage constant dans le temps. En pratique, on n’y parvient qu’en **dédoublant une même source** (deux fentes éclairées par le même laser, réflexion, division du faisceau). Deux lampes distinctes ne donnent jamais d’interférences visibles.

## La différence de marche
En un point M du champ d’interférences, la **différence de marche** est l’écart des distances parcourues par les deux ondes :

δ = |S₂M − S₁M|

- **interférences constructives** : δ = k λ (k entier) → les ondes sont en phase, l’amplitude est maximale ;
- **interférences destructives** : δ = (k + ½) λ → les ondes sont en opposition de phase, l’amplitude est minimale (nulle si les amplitudes sont égales).

## Le dispositif des fentes d’Young
Deux fentes distantes de b, éclairées par la même source, donnent sur un écran à la distance D un système de **franges** rectilignes, alternativement brillantes et sombres. La distance entre deux franges de même nature, l’**interfrange**, vaut :

i = λ D / b

L’interfrange est donc **proportionnel à λ** : c’est ainsi qu’on mesure une longueur d’onde avec une règle. En lumière blanche, chaque couleur donne son propre interfrange : les franges apparaissent irisées, et seule la frange centrale reste blanche.

## Les manifestations courantes
Les couleurs d’une bulle de savon, d’une flaque d’essence ou d’une plume de paon ne viennent d’aucun pigment : elles naissent d’interférences entre les rayons réfléchis sur les deux faces d’une couche mince. On parle de **couleurs interférentielles** — elles changent avec l’angle de vue, ce qu’aucun pigment ne fait.

Le son connaît le même phénomène : deux haut-parleurs en phase créent, dans une salle, des zones où l’on entend fort et d’autres presque rien. C’est le principe, retourné, du **casque à réduction active de bruit**, qui émet l’onde en opposition de phase.

> Interférences destructives ne veut pas dire « énergie détruite » : elle est **redistribuée** vers les franges brillantes. Le bilan énergétique total est inchangé.`,
          },
          questions: [
            ['Quelle condition deux sources doivent-elles remplir pour interférer de façon stable ?', ['Être cohérentes : même fréquence, déphasage constant', 'Avoir la même intensité', 'Être placées à la même distance de l’écran', 'Émettre en lumière blanche'], 0, 'En pratique, on dédouble une source unique : deux lampes distinctes ne suffisent pas.'],
            ['Quelle est la condition d’interférences destructives ?', ['δ = (k + ½) λ', 'δ = k λ', 'δ = λ / 2 uniquement', 'δ = 0'], 0, 'Les ondes arrivent alors en opposition de phase.'],
            ['Quelle est l’expression de l’interfrange dans le dispositif des fentes d’Young ?', ['i = λD / b', 'i = bD / λ', 'i = λ / (bD)', 'i = 2λD / b'], 0, 'D est la distance à l’écran, b l’écart entre les deux fentes.'],
            ['Lors d’interférences destructives, l’énergie lumineuse est détruite.', ['Vrai', 'Faux'], 1, 'Elle est redistribuée vers les franges brillantes : le bilan total est inchangé.'],
            ['Que se passe-t-il si l’on éclaire les fentes d’Young en lumière blanche ?', ['Chaque couleur donne son interfrange, les franges sont irisées', 'On n’observe rien', 'Toutes les franges restent blanches', 'Les franges disparaissent au centre'], 0, 'Seule la frange centrale, où δ = 0 pour toutes les couleurs, reste blanche.'],
            ['Les couleurs d’une bulle de savon proviennent…', ['D’interférences entre les rayons réfléchis sur ses deux faces', 'De pigments dissous dans le savon', 'De la diffraction sur les bords', 'De l’effet Doppler'], 0, 'Elles changent avec l’angle de vue, ce qu’aucun pigment ne fait.'],
            ['L’interfrange est proportionnel à la longueur d’onde.', ['Vrai', 'Faux'], 0, 'i = λD/b : c’est ce qui permet de mesurer λ avec une simple règle.'],
            ['Sur quel principe repose un casque à réduction active de bruit ?', ['L’émission d’une onde en opposition de phase avec le bruit', 'L’absorption du son par une mousse', 'La diffraction du son', 'L’effet Doppler'], 0, 'C’est une interférence destructive provoquée volontairement.'],
          ],
        },
        {
          titre: 'Système optique et formation d’images : la lunette astronomique',
          axe: 'Ondes et signaux',
          lecon: {
            titre: 'Deux lentilles, un foyer commun, et le ciel s’agrandit',
            cours: `Une lunette astronomique ne rapproche rien : elle **augmente l’angle** sous lequel on voit l’objet. Tout le chapitre tient dans cette phrase.

## La lentille mince convergente
Caractérisée par sa **distance focale** f′ (en m) ou sa **vergence** V = 1/f′ (en dioptries). Trois rayons se tracent sans calcul :
- un rayon passant par le **centre optique** O n’est pas dévié ;
- un rayon **parallèle à l’axe** émerge en passant par le **foyer image** F′ ;
- un rayon passant par le **foyer objet** F émerge **parallèle à l’axe**.

## La relation de conjugaison
1/OA′ − 1/OA = 1/f′, et le **grandissement** γ = A′B′/AB = OA′/OA

Les mesures sont **algébriques** : elles se comptent positivement dans le sens de propagation de la lumière, à partir de O. Un grandissement négatif signale une image **renversée**.

## Le cas particulier de l’objet à l’infini
Un astre est si lointain que ses rayons arrivent **parallèles entre eux**. Leur image se forme alors exactement **dans le plan focal image**. Si l’objet est vu sous le **diamètre apparent** θ, l’image intermédiaire a pour taille :

A₁B₁ = f′₁ × θ (θ en radians)

## La lunette afocale
Elle associe deux lentilles convergentes :
- l’**objectif**, de grande distance focale f′₁, qui donne de l’astre une image réelle dans son plan focal image ;
- l’**oculaire**, de courte distance focale f′₂, à travers lequel l’œil observe cette image.

Le montage est dit **afocale** quand le **foyer image de l’objectif est confondu avec le foyer objet de l’oculaire** : F′₁ = F₂. L’image finale est alors rejetée **à l’infini**, ce qui permet à l’œil d’observer **sans accommoder** — donc sans fatigue, pendant des heures.

## Le grossissement
G = θ′ / θ = f′₁ / f′₂

où θ est le diamètre apparent de l’astre à l’œil nu et θ′ celui de l’image finale. Un grossissement élevé demande donc un **objectif de grande focale** et un **oculaire de courte focale** — c’est en changeant d’oculaire qu’on change de grossissement.

L’image finale est **renversée**, ce qui est sans importance en astronomie (une lunette terrestre ajoute un redresseur).

## Ce qui limite vraiment une lunette
Pas le grossissement, mais le **diamètre de l’objectif** : il fixe la quantité de lumière collectée (donc la capacité à voir les objets faibles) et la limite de **diffraction** (donc le pouvoir séparateur). Grossir au-delà ne fait qu’agrandir une image floue — c’est le « grossissement vide » des publicités d’instruments bon marché.

> Un œil normal accommode sans effort sur l’infini : c’est pourquoi l’afocalité n’est pas un détail de montage, mais la condition d’un confort réel d’observation.`,
          },
          questions: [
            ['Où se forme l’image d’un objet situé à l’infini à travers une lentille convergente ?', ['Dans le plan focal image', 'Au centre optique', 'Dans le plan focal objet', 'À l’infini également'], 0, 'Les rayons arrivent parallèles entre eux et convergent en un point de ce plan.'],
            ['Une lunette est dite afocale quand…', ['Le foyer image de l’objectif est confondu avec le foyer objet de l’oculaire', 'Les deux lentilles ont la même focale', 'L’objectif est divergent', 'L’image finale se forme sur la rétine'], 0, 'L’image finale est alors rejetée à l’infini : l’œil observe sans accommoder.'],
            ['Quelle est l’expression du grossissement d’une lunette afocale ?', ['G = f′₁ / f′₂', 'G = f′₂ / f′₁', 'G = f′₁ × f′₂', 'G = 1 / (f′₁ f′₂)'], 0, 'Objectif de grande focale, oculaire de courte focale.'],
            ['Un rayon passant par le centre optique d’une lentille mince…', ['N’est pas dévié', 'Émerge parallèle à l’axe', 'Passe par le foyer image', 'Est réfléchi'], 0, 'C’est le premier des trois rayons particuliers à connaître.'],
            ['L’image donnée par une lunette astronomique est renversée.', ['Vrai', 'Faux'], 0, 'Sans importance en astronomie ; une lunette terrestre ajoute un redresseur.'],
            ['Quelle est la relation de conjugaison d’une lentille mince ?', ['1/OA′ − 1/OA = 1/f′', '1/OA′ + 1/OA = 1/f′', 'OA′ − OA = f′', 'OA′ × OA = f′²'], 0, 'Les mesures y sont algébriques, comptées à partir du centre optique.'],
            ['Qu’est-ce qui limite réellement les performances d’une lunette ?', ['Le diamètre de son objectif', 'Le grossissement de l’oculaire', 'La longueur du tube', 'Le poids de l’instrument'], 0, 'Il fixe la lumière collectée et la limite de diffraction, donc le pouvoir séparateur.'],
            ['Un grandissement négatif signifie que l’image est…', ['Renversée', 'Plus petite', 'Virtuelle', 'Située avant la lentille'], 0, 'Le signe porte sur le sens, la valeur absolue sur la taille.'],
          ],
        },
        {
          titre: 'Modèle corpusculaire de la lumière : le photon',
          axe: 'Ondes et signaux',
          lecon: {
            titre: 'Une onde qui arrive par paquets',
            cours: `Les deux chapitres précédents ont établi que la lumière est une onde. Celui-ci montre qu’elle est aussi, dans les mêmes expériences, un flot de grains d’énergie. Les deux descriptions sont vraies.

## Le photon
La lumière échange son énergie par **quanta** indivisibles, les **photons**. L’énergie d’un photon dépend uniquement de la fréquence :

E = h ν = h c / λ

avec **h = 6,63 × 10⁻³⁴ J·s** (constante de Planck) et c = 3,00 × 10⁸ m·s⁻¹. Une lumière rouge (λ = 700 nm) transporte des photons moins énergétiques qu’une lumière bleue (λ = 450 nm), quelle que soit son intensité.

L’**électronvolt** est l’unité commode à cette échelle : 1 eV = 1,60 × 10⁻¹⁹ J. Les photons visibles portent de 1,8 à 3,1 eV.

## L’effet photoélectrique
Éclairer un métal peut lui arracher des électrons — mais **seulement si la fréquence dépasse un seuil**, quelle que soit l’intensité. Une lumière rouge très intense n’arrache rien ; une lumière ultraviolette très faible y parvient aussitôt.

Le modèle ondulatoire ne l’explique pas : il prédirait qu’en attendant assez longtemps, n’importe quelle lumière finit par accumuler l’énergie nécessaire. Le modèle corpusculaire l’explique en une ligne : **un électron reçoit un photon entier, ou rien**. Il faut donc hν > W₀, le **travail d’extraction** du métal.

## La dualité onde-corpuscule
La lumière se comporte comme une **onde** dans les phénomènes de propagation (diffraction, interférences) et comme un **flot de corpuscules** dans les échanges d’énergie (effet photoélectrique, absorption, émission). Les deux modèles ne s’opposent pas : ils décrivent des aspects différents d’un même objet, et chacun est indispensable.

L’expérience des fentes d’Young **photon par photon** le montre de façon spectaculaire : chaque photon arrive en un point unique (corpuscule), mais l’accumulation de milliers d’impacts reconstitue les franges (onde).

## Les niveaux d’énergie quantifiés
Un atome ne peut posséder que certaines valeurs d’énergie, ses **niveaux**. Il ne peut absorber ou émettre que la **différence** entre deux niveaux :

ΔE = E_haut − E_bas = h ν

D’où les **spectres de raies** : chaque élément absorbe et émet un jeu de longueurs d’onde qui lui est propre. C’est ainsi qu’on identifie la composition d’une étoile sans y aller, et que se lisent les raies de Fraunhofer du spectre solaire.

## Le laser
Il exploite l’**émission stimulée** : un photon qui traverse un atome excité en déclenche l’émission d’un second, identique en direction, en phase et en longueur d’onde. D’où un faisceau **monochromatique, directif et cohérent** — c’est cette cohérence qui rend possibles les expériences d’interférences du chapitre précédent.

> Le photon n’a pas de masse, mais il transporte de l’énergie et une quantité de mouvement. Ce n’est pas une contradiction : la relation E = mc² ne s’applique pas telle quelle à une particule sans masse.`,
          },
          questions: [
            ['Quelle est l’expression de l’énergie d’un photon ?', ['E = h c / λ', 'E = h λ', 'E = c / (h λ)', 'E = ½ h ν²'], 0, 'Soit E = hν : elle ne dépend que de la fréquence.'],
            ['Que vaut la constante de Planck ?', ['6,63 × 10⁻³⁴ J·s', '1,60 × 10⁻¹⁹ C', '3,00 × 10⁸ m·s⁻¹', '9,81 J·s'], 0, '1,60 × 10⁻¹⁹ C est la charge élémentaire, qui définit l’électronvolt.'],
            ['Une lumière rouge très intense peut-elle arracher des électrons à un métal de seuil situé dans l’ultraviolet ?', ['Non, quelle que soit son intensité', 'Oui, si elle est assez intense', 'Oui, en attendant assez longtemps', 'Cela dépend de la durée d’exposition'], 0, 'Un électron reçoit un photon entier ou rien : il faut hν > W₀.'],
            ['L’effet photoélectrique s’explique par le modèle ondulatoire de la lumière.', ['Vrai', 'Faux'], 1, 'Le modèle ondulatoire prédirait une accumulation progressive d’énergie, ce qu’on n’observe pas.'],
            ['Que traduit la dualité onde-corpuscule ?', ['La lumière se décrit comme une onde ou comme un flot de photons selon le phénomène', 'La lumière change de nature avec la fréquence', 'Les photons sont des ondes de matière', 'Seul le modèle corpusculaire est correct'], 0, 'Propagation : onde. Échanges d’énergie : corpuscule.'],
            ['Pourquoi un atome n’émet-il que certaines longueurs d’onde ?', ['Parce que ses niveaux d’énergie sont quantifiés', 'Parce que sa masse est fixe', 'Parce qu’il ne reçoit que certains photons', 'Parce que sa température est constante'], 0, 'Il n’échange que la différence entre deux niveaux : ΔE = hν.'],
            ['Un spectre de raies permet d’identifier les éléments présents dans une étoile.', ['Vrai', 'Faux'], 0, 'Chaque élément possède son propre jeu de longueurs d’onde absorbées et émises.'],
            ['Sur quel phénomène repose le fonctionnement d’un laser ?', ['L’émission stimulée', 'L’effet photoélectrique', 'L’effet Doppler', 'La diffraction'], 0, 'Elle donne un faisceau monochromatique, directif et cohérent.'],
          ],
        },
        {
          titre: 'Dynamique d’un circuit électrique et capteurs capacitifs',
          axe: 'Ondes et signaux',
          lecon: {
            titre: 'Le temps qu’il faut à un condensateur pour se remplir',
            cours: `Un circuit électrique n’atteint pas son régime final instantanément. Un condensateur y introduit une **durée caractéristique**, qu’on peut mesurer, calculer — et exploiter comme capteur.

## Le condensateur
Deux armatures conductrices séparées par un isolant. Il stocke une charge q proportionnelle à la tension entre ses bornes :

q = C × u

où **C** est la **capacité**, en **farads (F)**. Le farad est une unité énorme : les condensateurs usuels se comptent en microfarads (µF) ou en nanofarads (nF).

L’intensité qui le traverse est le débit de charge : i = dq/dt = C × du/dt. Un condensateur ne laisse donc passer du courant que **tant que la tension varie** : en régime permanent, il se comporte comme un interrupteur ouvert.

## La charge d’un dipôle RC
Un condensateur initialement déchargé, mis en série avec une résistance R sous une tension continue E, obéit à l’équation différentielle :

RC × du/dt + u = E, de solution u(t) = E × (1 − e^(−t/RC))

La tension croît d’abord vite, puis de plus en plus lentement, et tend vers E sans jamais l’atteindre exactement.

## La constante de temps
**τ = R × C**, homogène à un temps (Ω × F = s). Elle se lit sur la courbe de trois façons :
- à t = τ, la tension a atteint **63 %** de sa valeur finale ;
- la **tangente à l’origine** coupe l’asymptote à t = τ ;
- le régime permanent est pratiquement atteint au bout de **5τ**.

## La décharge
En court-circuitant le générateur, u(t) = E × e^(−t/τ) : la même constante de temps gouverne la décroissance. À t = τ, il reste 37 % de la tension initiale.

## L’énergie stockée
E_stockée = ½ C u²

Un condensateur peut restituer cette énergie très rapidement — d’où son emploi dans un flash d’appareil photo : la pile le charge lentement, il se décharge en quelques millisecondes.

## Les capteurs capacitifs
La capacité d’un condensateur plan dépend de la surface des armatures, de leur écartement et de l’isolant qui les sépare. **Faire varier l’un de ces paramètres fait varier C**, donc τ, donc une durée mesurable par un circuit électronique. D’où toute une famille de capteurs :
- **écran tactile** : le doigt, conducteur, modifie localement la capacité de la grille d’électrodes ;
- **capteur de niveau** dans un réservoir : le liquide remplace l’air entre les armatures ;
- **capteur d’humidité**, de pression, de position : même principe, autre grandeur.

> Le condensateur est le troisième système de l’année à décroissance exponentielle, après les noyaux radioactifs et le refroidissement d’un corps. Trois phénomènes sans rapport, une seule équation : c’est ce qu’on appelle une analogie formelle, et elle vaut d’être vue comme telle.`,
          },
          questions: [
            ['Quelle relation lie la charge d’un condensateur à la tension à ses bornes ?', ['q = C × u', 'q = u / C', 'q = C / u', 'q = C × u²'], 0, 'C est la capacité, exprimée en farads.'],
            ['Que vaut la constante de temps d’un dipôle RC ?', ['τ = R × C', 'τ = R / C', 'τ = C / R', 'τ = RC²'], 0, 'Elle est homogène à un temps : Ω × F = s.'],
            ['À t = τ lors de la charge, quel pourcentage de la tension finale est atteint ?', ['63 %', '50 %', '37 %', '99 %'], 0, 'Lors de la décharge, il reste symétriquement 37 % de la tension initiale.'],
            ['Au bout de combien de constantes de temps le régime permanent est-il pratiquement atteint ?', ['Environ 5τ', 'Environ τ', 'Environ 2τ', 'Jamais'], 0, 'La tangente à l’origine, elle, coupe l’asymptote à t = τ.'],
            ['En régime permanent, un condensateur se comporte comme un interrupteur ouvert.', ['Vrai', 'Faux'], 0, 'i = C du/dt : sans variation de tension, aucun courant ne le traverse.'],
            ['Quelle est l’expression de l’énergie stockée dans un condensateur ?', ['E = ½ C u²', 'E = C u', 'E = ½ u² / C', 'E = C² u'], 0, 'C’est cette énergie qu’un flash restitue en quelques millisecondes.'],
            ['Sur quel principe repose un écran tactile capacitif ?', ['Le doigt modifie localement la capacité de la grille d’électrodes', 'Le doigt ferme un circuit électrique', 'Le doigt chauffe la surface', 'Le doigt réfléchit un faisceau lumineux'], 0, 'La variation de capacité est convertie en position par l’électronique.'],
            ['La décharge d’un condensateur suit la même loi mathématique que la décroissance radioactive.', ['Vrai', 'Faux'], 0, 'Deux phénomènes sans rapport physique, une même équation exponentielle.'],
          ],
        },
      ],
    },
  ],
}
