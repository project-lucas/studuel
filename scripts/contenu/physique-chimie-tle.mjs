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
| Espèce | Ce qu’elle fait du proton |
| Un **acide** | Il le **cède** |
| Une **base** | Elle le **capte** |

> Rien n’est acide ou basique dans l’absolu : une espèce l’est **face à une autre**, qui joue le rôle inverse. C’est ce qui distingue Brönsted de toutes les définitions antérieures.

## Le couple acide/base
À tout acide AH correspond la base A⁻ qu’il devient en perdant son proton. Ils forment un **couple**, relié par une **demi-équation** :

AH = A⁻ + H⁺

| Couple | Acide | Base |
| Acide éthanoïque | CH₃COOH | CH₃COO⁻ |
| Ammonium | NH₄⁺ | NH₃ |
| Oxonium | H₃O⁺ | H₂O |
| Eau | H₂O | HO⁻ |
| Dioxyde de carbone | CO₂,H₂O | HCO₃⁻ |

## La réaction acido-basique
Le proton ne reste **jamais seul** en solution : il passe **directement** de l’acide d’un couple à la base d’un autre. On additionne les deux demi-équations, l’une dans le sens direct, l’autre dans le sens inverse.

CH₃COOH + HO⁻ donne CH₃COO⁻ + H₂O

Une réaction acido-basique est donc **toujours** un transfert de proton **entre deux couples**.

## L’eau, espèce amphotère
| Couple | Rôle de l’eau |
| H₂O / HO⁻ | Elle y est l’**acide** |
| H₃O⁺ / H₂O | Elle y est la **base** |

Une espèce qui joue les deux rôles est dite **amphotère** — c’est aussi le cas de HCO₃⁻ et des acides aminés.

## L’autoprotolyse de l’eau
Deux molécules d’eau échangent un proton entre elles : 2 H₂O = H₃O⁺ + HO⁻

Cette réaction, très limitée, explique deux faits : l’eau pure conduit **faiblement** le courant, et H₃O⁺ et HO⁻ sont **toujours présents ensemble**.

> Le proton H⁺ n’existe **pas libre** en solution aqueuse : il est immédiatement fixé par une molécule d’eau pour donner l’**ion oxonium H₃O⁺**. D’où la convention d’écriture — H₃O⁺ dans les équations, H⁺ seulement dans les demi-équations.`,
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
            cours: `Les concentrations en ions oxonium d’une solution courante s’étalent sur **quatorze puissances de dix**. Les comparer en écriture décimale serait illisible : le **pH** compresse cette étendue sur une échelle de 0 à 14.

## La définition
pH = −log([H₃O⁺]/c°), avec c° = 1 mol·L⁻¹ — la concentration standard, qui rend l’argument du logarithme sans dimension.

D’où la relation inverse : **[H₃O⁺] = c° × 10^(−pH)**

## Ce qu’une unité de pH représente
| Écart de pH | Facteur sur [H₃O⁺] |
| 1 unité | **×10** |
| 2 unités | ×100 |
| 3 unités | ×1000 |

> Passer de pH 3 à pH 2, c’est **multiplier** la concentration par 10 — pas l’augmenter d’un tiers. C’est le contresens le plus fréquent sur une échelle logarithmique.

Un pH mesuré au dixième près donne une concentration à environ 2 % près : **au-delà d’une décimale, le chiffre n’a plus de sens expérimental**.

## Le produit ionique de l’eau
Dans **toute** solution aqueuse à 25 °C :

Ke = ([H₃O⁺]/c°) × ([HO⁻]/c°) = 1,0 × 10⁻¹⁴, soit pKe = 14,0

Les deux concentrations sont donc **liées** : si l’une monte, l’autre descend. C’est pourquoi une solution basique contient tout de même des ions H₃O⁺.

## Acide, neutre, basique
| Solution | La relation | Le pH à 25 °C |
| **Acide** | [H₃O⁺] > [HO⁻] | pH < 7,0 |
| **Neutre** | [H₃O⁺] = [HO⁻] = 1,0 × 10⁻⁷ mol·L⁻¹ | pH = 7,0 |
| **Basique** | [H₃O⁺] < [HO⁻] | pH > 7,0 |

Le 7 n’est **pas** une constante universelle : il vaut 7,0 **à 25 °C**, parce que Ke dépend de la température.

## L’effet d’une dilution
| Solution | Diluée 10 fois | Ce que cela donne |
| Acide fort | pH **+1** | Il se rapproche de 7 |
| Base forte | pH **−1** | Il se rapproche de 7 |

La dilution rapproche le pH de 7 **sans jamais le franchir** : une solution acide diluée reste acide.

> Un pH-mètre s’**étalonne** avant chaque série avec au moins deux solutions tampon — pH 4,0 et 7,0 par exemple. La sonde dérive, et une mesure non étalonnée peut se tromper de plusieurs dixièmes.`,
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
            cours: `Une solution ionique conduit le courant parce que ses **ions se déplacent**. Mesurer cette aptitude, c’est mesurer indirectement **combien** d’ions sont là — et **lesquels**.

## Conductance et conductivité
| Grandeur | Symbole, unité | Dépend de… |
| **Conductance** | G, en siemens (S) | La solution **et** la géométrie de la cellule |
| **Conductivité** | σ, en S·m⁻¹ | La **solution seule** |

G = 1/R = I/U, et G = σ × S/L, où S est la surface des électrodes et L leur distance.

On obtient σ avec un conductimètre **étalonné** sur une solution de conductivité connue.

## La loi de Kohlrausch
Chaque ion apporte sa part, **indépendamment des autres**, tant que la solution est diluée :

σ = Σ λᵢ × [Xᵢ]

> Piège d’unités systématique : les concentrations y entrent en **mol·m⁻³**, pas en mol·L⁻¹. Rappel : 1 mol·L⁻¹ = 10³ mol·m⁻³. Oublier le facteur mille fausse le résultat de trois ordres de grandeur.

## Tous les ions ne se valent pas
| Ion | λ, en mS·m²·mol⁻¹ | Pourquoi |
| **H₃O⁺** | 35,0 | Relais de proton |
| **HO⁻** | 19,9 | Relais de proton |
| Les autres ions courants | de l’ordre de 5 à 8 | Ils traversent physiquement la solution |

H₃O⁺ et HO⁻ conduisent environ **cinq fois mieux** que les autres : ils se déplacent par **relais** de molécule d’eau en molécule d’eau, sans avoir à parcourir la distance eux-mêmes.

## Le titrage conductimétrique
C’est la conséquence directe de la remarque précédente : au cours d’un titrage, la conductivité varie **linéairement par morceaux**.

| Ce qu’on observe | Ce que cela signifie |
| Un segment de droite | Un jeu d’ions donné |
| Une **rupture de pente** | L’**équivalence** |

On trace les deux droites, on lit leur intersection.

| Quand la préférer | Pourquoi |
| Solution **colorée ou trouble** | Un indicateur coloré y serait invisible |
| Saut de pH peu marqué | La conductimétrie ne dépend pas du saut |

> Toujours travailler avec un **grand volume** dans le bécher, ou **corriger la dilution** : sans cela, l’ajout de titrant dilue les ions et **courbe** les segments qu’on veut droits.`,
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
            cours: `Une espèce chimique n’absorbe pas la lumière n’importe comment : elle prélève des longueurs d’onde précises, qui la **signent**. Trois spectroscopies exploitent ce fait, chacune sur son domaine.

## Les trois, et ce qu’elles font
| Spectroscopie | Ce qu’elle sonde | Ce qu’elle donne |
| **UV-visible** | Les électrons | Elle **quantifie** : une concentration |
| **Infrarouge** | Les vibrations des liaisons | Elle **reconnaît** les groupes caractéristiques |
| **RMN** du proton | Les noyaux d’hydrogène | Elle **reconstruit** le squelette |

Elles sont **complémentaires** : aucune ne remplace les autres.

## UV-visible : la loi de Beer-Lambert
Une solution colorée absorbe la couleur **complémentaire** de celle qu’elle laisse passer : une solution bleue absorbe dans l’orange. On mesure l’absorbance à λ_max, là où la mesure est la plus sensible.

**A = ε × ℓ × c**

| Symbole | Ce qu’il désigne | Unité |
| ε | Coefficient d’absorption molaire, propre à l’espèce **et** à λ | L·mol⁻¹·cm⁻¹ |
| ℓ | Largeur de la cuve | cm |
| c | Concentration | mol·L⁻¹ |
| A | Absorbance | **sans unité** |

L’absorbance est **proportionnelle à la concentration** — mais seulement pour les solutions **diluées** : au-delà de A ≈ 2, la loi décroche.

## Le dosage par étalonnage
1. Préparer une **gamme** de solutions de concentrations connues.
2. Régler le spectrophotomètre sur le « **blanc** » — le solvant seul fixe le zéro.
3. Mesurer l’absorbance de chacune à λ_max.
4. Tracer la **droite d’étalonnage** A = f(c), qui doit passer par l’**origine**.
5. Y reporter l’absorbance de la solution inconnue.

## Infrarouge : les bandes à connaître
| Liaison | Nombre d’onde | Allure |
| O—H d’**alcool** | vers 3300 cm⁻¹ | Large |
| O—H d’**acide carboxylique** | 2500 à 3200 cm⁻¹ | **Très** large |
| C=O | vers 1700 cm⁻¹ | Fine et intense |

L’IR ne **compte** pas les atomes : il dit **quelles familles** sont présentes. D’où son usage pour suivre une transformation — une bande disparaît, une autre apparaît.

## RMN : les trois lectures d’un signal
| Ce qu’on lit | Ce que cela donne |
| Le **déplacement chimique** δ | L’environnement du groupe |
| La **courbe d’intégration** | Le **nombre** d’hydrogènes |
| La **multiplicité** | Le nombre de voisins : n voisins donnent **n+1** pics |`,
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
            cours: `Deux transformations peuvent aboutir au **même état final** et mettre l’une une seconde, l’autre un mois. La thermodynamique dit **où** on va ; la cinétique dit **en combien de temps**.

## La vitesse volumique
Pour a A + b B donnant c C : v = (1/V) × dx/dt

En pratique, on la relie à une concentration :

| Espèce | Expression | Pourquoi le signe |
| Un **réactif** A | v = −(1/a) × d[A]/dt | Le moins compense la **disparition** |
| Un **produit** C | v = +(1/c) × d[C]/dt | Il apparaît |

Dans les deux cas, la vitesse reste **positive**.

## Comment on la lit sur une courbe
La vitesse est le **coefficient directeur de la tangente** à la courbe [A] = f(t).

| Moment | Vitesse | Pourquoi |
| Au début | **Maximale** | Les réactifs sont les plus concentrés |
| À la fin | Elle **s’annule** | Il reste moins de réactif |

> Une réaction ne ralentit pas parce qu’elle « fatigue » : elle ralentit parce qu’il **reste moins de réactif**. La courbe s’aplatit pour une raison de concentration, pas d’usure.

## Le temps de demi-réaction
t₁/₂ est la durée au bout de laquelle l’avancement atteint **la moitié** de sa valeur finale. Il donne l’ordre de grandeur de la durée totale : au bout de **5 à 7 fois** t₁/₂, la transformation est pratiquement terminée.

## Les facteurs cinétiques
| Facteur | Son effet | Pourquoi |
| **Température** | L’élever accélère | Plus de chocs, et plus énergétiques |
| **Concentration** | L’augmenter accélère | Plus de chocs |
| **Catalyseur** | Il accélère | Sans être consommé ni figurer au bilan |
| **État de division** | Plus fin, plus rapide | Plus de surface de contact |
| **Éclairement** | Pour une réaction photochimique | Il apporte l’énergie |

La **trempe** exploite le premier : refroidir brutalement, ou diluer, **fige** un prélèvement le temps de le titrer.

## La loi de vitesse d’ordre 1
Quand v = k × [A] :

[A](t) = [A]₀ × e^(−kt) et **t₁/₂ = ln2 / k**

> Le temps de demi-réaction y est **indépendant de la concentration initiale**. C’est la signature qu’on reconnaît sur un graphe : si t₁/₂ ne change pas quand on part de plus concentré, l’ordre est 1.

## Choisir la méthode de suivi
| Ce qui change au cours de la réaction | La méthode |
| Une espèce est **colorée** | Spectrophotométrie |
| Le nombre ou la nature des **ions** varie | Conductimétrie |
| Le **pH** varie | pH-métrie |
| Un **gaz** se forme | Mesure de pression |
| Rien de tout cela | Titrages successifs, avec trempe |`,
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
            cours: `L’équation de bilan est un **résumé comptable** : elle dit ce qui entre et ce qui sort, **jamais comment**. Le **mécanisme réactionnel** décrit le trajet réel, en une suite d’étapes.

## Les notions de base
| Notion | Ce que c’est | Comment on le reconnaît |
| **Acte élémentaire** | Une étape en une seule rencontre | Au plus **deux** entités : les chocs à trois sont trop improbables |
| **Mécanisme** | Une succession d’actes élémentaires | Leur somme redonne l’équation de bilan |
| **Intermédiaire réactionnel** | Une espèce **formée puis consommée** | Elle n’apparaît **pas** au bilan |
| **Catalyseur** | Consommé à une étape, **régénéré** à une autre | Il n’apparaît pas non plus au bilan |

Carbocations et radicaux sont les intermédiaires les plus fréquents : leur durée de vie est très courte, et ils sont souvent indétectables directement.

## Le catalyseur, vu de près
Il ouvre un **chemin réactionnel différent**, dont les étapes demandent **moins d’énergie**.

| Ce qu’il change | Ce qu’il ne change **pas** |
| La **durée** de la transformation | L’**état final** |
| Le chemin suivi | La **constante d’équilibre** |

## Sites donneurs et accepteurs
Une étape se comprend en repérant **où sont les électrons disponibles**.

| Site | Ce qui le signale |
| **Donneur** | Doublet non liant, liaison multiple, charge négative ou δ⁻ |
| **Accepteur** | Charge positive ou δ⁺, dû à une différence d’**électronégativité** : C—O, C—Cl, C=O |

## Les flèches courbes
> Une flèche courbe part **toujours du site donneur** et pointe **vers le site accepteur**. Elle représente le mouvement d’un **doublet d’électrons**, jamais le déplacement d’un atome.

C’est une convention à respecter à la lettre : une flèche à l’envers est comptée fausse, même si le produit final est juste.

## Le lien avec les facteurs cinétiques
À l’échelle microscopique, une réaction avance par **chocs efficaces** — assez énergétiques **et** bien orientés.

| Le facteur | Ce qu’il augmente |
| La **concentration** | Le **nombre** de chocs |
| La **température** | La **part** de chocs assez énergétiques |

Les deux facteurs cinétiques du chapitre précédent s’expliquent ainsi, sans rien ajouter.

> Le mécanisme ne se **devine** pas d’après le bilan : il s’établit expérimentalement. Deux réactions au bilan identique peuvent suivre des chemins totalement différents.`,
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
            cours: `Toute la chimie jouait jusqu’ici sur les **électrons**. La radioactivité, elle, touche au **noyau** : elle change l’élément lui-même, et aucune action chimique ou physique ordinaire ne peut l’accélérer ou l’empêcher.

## Le noyau et ses isotopes
Un noyau se note ᴬ_Z X : **Z** protons — le numéro atomique, qui **fixe l’élément** — et **A** nucléons au total, donc A − Z neutrons.

Deux **isotopes** ont le même Z et des A différents : carbone 12 et carbone 14, uranium 235 et 238. Chimiquement identiques, nucléairement très différents.

## Les trois caractères de la radioactivité
| Caractère | Ce qu’il signifie |
| **Spontané** | Rien ne la déclenche |
| **Aléatoire** | Impossible de prédire **quand** un noyau donné se désintégrera |
| **Inéluctable** | Ni température, ni pression, ni réaction chimique n’y changent rien |

## Les trois désintégrations
| Type | Ce qui est émis | L’équation | Quels noyaux |
| **α** | Un noyau d’hélium ⁴₂He | ᴬ_Z X donne ᴬ⁻⁴_(Z−2) Y + ⁴₂He | Les noyaux **lourds** |
| **β⁻** | Un électron ⁰₋₁e | ᴬ_Z X donne ᴬ_(Z+1) Y + ⁰₋₁e | Trop riches en **neutrons** |
| **β⁺** | Un positon ⁰₊₁e | ᴬ_Z X donne ᴬ_(Z−1) Y + ⁰₊₁e | Trop riches en **protons** |

En β⁻, un neutron devient proton ; en β⁺, l’inverse.

## Le rayonnement γ
> Ce n’est **pas** une désintégration. Le noyau fils, formé dans un état **excité**, se désexcite en émettant un photon très énergétique. **Ni A ni Z ne changent** — on note le noyau excité d’une étoile, et sa désexcitation s’écrit Y excité donne Y + γ.

## Les lois de Soddy
Dans **toute** équation nucléaire, deux grandeurs se conservent :

| Grandeur | Ce qu’elle conserve |
| **A** | Le nombre de nucléons |
| **Z** | La charge |

Ce sont ces deux égalités qui permettent d’identifier le noyau fils **sans rien connaître d’autre**.

## L’énergie libérée
La masse du noyau est **inférieure** à la somme des masses de ses nucléons séparés : c’est le **défaut de masse** Δm.

E = Δm × c²

C’est cette énergie, **colossale** devant celle des réactions chimiques, qui est libérée lors d’une désintégration.

> La radioactivité **naturelle** — uranium, thorium, potassium 40, radon, carbone 14 — nous entoure en permanence. Elle est naturelle au sens où elle ne vient d’**aucune manipulation humaine**, pas au sens où elle serait inoffensive.`,
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
            cours: `Un noyau isolé se désintègre à un instant **imprévisible**. Mais un échantillon en contient des milliards : à cette échelle, le hasard devient une **loi mathématique exacte**.

## La loi de décroissance
**N(t) = N₀ × e^(−λt)**

| Symbole | Ce qu’il désigne | Unité |
| N(t) | Noyaux **non encore** désintégrés à l’instant t | — |
| N₀ | Noyaux à l’instant initial | — |
| **λ** | La **constante radioactive**, propre au noyau | s⁻¹ |

λ traduit la **probabilité**, pour un noyau donné, de se désintégrer par unité de temps. Elle vérifie dN/dt = −λN.

## La demi-vie
**t₁/₂ = ln2 / λ** — la durée au bout de laquelle **la moitié** des noyaux se sont désintégrés.

| Noyau | Demi-vie | Ce qu’elle permet |
| Iode 131 | **8 jours** | Médecine nucléaire |
| Carbone 14 | **5 730 ans** | Datation jusqu’à environ 50 000 ans |
| Uranium 238 | **4,5 milliards d’années** | Datation des roches |

Elle est **caractéristique du noyau** et ne dépend ni de la quantité initiale, ni des conditions extérieures.

## Lire une courbe
| Après… | Il reste |
| 1 demi-vie | N₀/2 |
| 2 demi-vies | N₀/4 |
| 3 demi-vies | N₀/8 |
| 10 demi-vies | moins d’un **millième** |

> La population est **divisée par deux** à chaque t₁/₂ — jamais réduite d’une quantité fixe. C’est une décroissance **exponentielle**, pas linéaire.

## L’activité
A(t) = λ × N(t) = A₀ × e^(−λt), en **becquerel (Bq)** : le nombre de désintégrations par seconde.

Elle décroît selon **la même loi** que N. C’est elle qu’on **mesure** — au compteur Geiger — jamais N directement.

## La datation
t = (1/λ) × ln(A₀/A)

| Méthode | Ce qui fixe A₀ | Portée |
| **Carbone 14** | L’organisme vivant échange du carbone, et cesse à sa mort | environ 50 000 ans |
| Uranium-plomb, potassium-argon | La composition initiale de la roche | Des milliards d’années |

Au-delà de 50 000 ans, il ne reste **pas assez** de ¹⁴C pour mesurer : ce n’est pas une limite d’appareil, c’est une limite physique.

> Une demi-vie n’est **pas** une durée de vie : après t₁/₂, l’échantillon n’est pas « à moitié mort ». Il a exactement la même probabilité de perdre encore la moitié de ce qui reste pendant la période suivante.`,
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
            cours: `Au collège, une réaction s’arrête quand le réactif limitant est épuisé. En Terminale, on découvre qu’une grande partie des transformations s’arrêtent **avant** : réactifs et produits **coexistent**. C’est l’**état d’équilibre**.

## Le quotient de réaction
Pour a A + b B = c C + d D :

Qr = ([C]/c°)^c × ([D]/c°)^d divisé par ([A]/c°)^a × ([B]/c°)^b

Il est **sans unité**.

| Ce qui figure dans Qr | Ce qui n’y figure **pas** |
| Les espèces dissoutes | Les **solides** |
| Les gaz | Le **solvant** — l’eau en solution diluée |

Leur concentration ne varie pratiquement pas : c’est la raison de leur absence.

## La constante d’équilibre
Quand le système n’évolue plus, Qr atteint **K**, qui ne dépend **que de la température**.

| K ne dépend **pas** de… |
| Des quantités introduites |
| Du volume |
| De la présence d’un **catalyseur** |

## Le critère d’évolution
| Comparaison | Le système évolue… |
| Qr,i **<** K | Dans le **sens direct** : il forme des produits |
| Qr,i **>** K | Dans le **sens indirect** |
| Qr,i **=** K | Il n’évolue pas : il est déjà à l’équilibre |

Ce critère répond à « dans quel sens ? » **sans aucun calcul d’avancement**.

## L’équilibre est dynamique
> À l’équilibre, les deux réactions inverses **continuent** de se produire, à la **même vitesse**. Rien ne s’arrête à l’échelle microscopique : ce sont les concentrations, à l’échelle macroscopique, qui cessent de varier.

## K ou τ
τ = x_f / x_max mesure jusqu’où la transformation est allée.

| | **K** | **τ** |
| Ce que c’est | Une **constante** du couple réactionnel | Le résultat d’une **expérience** |
| De quoi cela dépend | De la **température** seule | Aussi des conditions initiales |
| Valeur limite | K > 10⁴ : transformation quasi totale | τ = 1 : transformation totale |

Diluer une solution d’acide faible **augmente** son taux d’avancement — alors que K, lui, **ne bouge pas**.

> Ne pas confondre K et τ est la difficulté principale du chapitre, et la confusion la plus sanctionnée.`,
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
            cours: `Plongez une lame de zinc dans du sulfate de cuivre : la réaction se fait sur place, et son énergie part en **chaleur**. Séparez les deux couples, et les électrons sont **obligés de passer par un fil** — on obtient un courant.

## Oxydant, réducteur, couple
| Espèce | Ce qu’elle fait des électrons |
| Un **réducteur** | Il en **cède** |
| Un **oxydant** | Il en **capte** |

Ils forment un couple Ox/Red relié par : Ox + n e⁻ = Red. Exemples : Cu²⁺/Cu, Zn²⁺/Zn, Fe³⁺/Fe²⁺, MnO₄⁻/Mn²⁺.

## La constitution d’une pile
| Élément | Son rôle | Ce qui y circule |
| Deux **demi-piles** | Chacune une électrode dans la solution de son couple | — |
| Le **circuit extérieur** | Relier les électrodes | Les **électrons** |
| Le **pont salin** | Fermer le circuit **à l’intérieur** | Les **ions** |

> Sans pont salin, les charges s’accumulent dans chaque compartiment et la pile **s’arrête aussitôt**. Il n’est pas un accessoire : il assure l’électroneutralité, donc la continuité du courant.

## Les deux électrodes
| Électrode | Ce qui s’y passe | Son pôle dans une **pile** |
| **Anode** | L’**oxydation** | Le pôle **négatif** |
| **Cathode** | La **réduction** | Le pôle **positif** |

Moyen mnémotechnique : **a**node et **o**xydation commencent par une **voyelle** ; **c**athode et **r**éduction par une **consonne**.

Les **électrons** vont de l’anode vers la cathode dans le fil ; le **courant conventionnel** circule en sens inverse.

## Le sens d’évolution
| État | Ce qui se passe |
| Qr ≠ K | La pile **débite**, dans le sens qui rapproche Qr de K |
| Qr = K | La pile est **usée** : la tension tombe à zéro |

> Une pile usée n’est pas « vide » : elle est **à l’équilibre**. Il y reste exactement autant de matière qu’au départ.

## La capacité électrique
Q = I × Δt = n(e⁻) × **F**, avec F = **96 500 C·mol⁻¹** — la charge d’une mole d’électrons.

En reliant n(e⁻) à l’avancement par les demi-équations, on calcule la **durée de vie** de la pile ou la masse d’électrode consommée. Le réactif limitant est presque toujours le **métal de l’anode**, qui se dissout.`,
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
            cours: `Une pile suit le sens **spontané**. Une **électrolyse** fait l’inverse : un générateur impose au système d’évoluer **contre** son sens naturel — donc d’**éloigner Qr de K**.

## Pile ou électrolyse
| | **Pile** | **Électrolyse** |
| Le sens | Spontané | **Forcé** |
| Qr par rapport à K | Il s’en **rapproche** | Il s’en **éloigne** |
| L’énergie | Chimique vers électrique | Électrique vers **chimique** |
| L’anode | Pôle **négatif** | Reliée à la borne **+** |
| La cathode | Pôle **positif** | Reliée à la borne **−** |

> Les définitions **ne changent pas** : anode = oxydation, cathode = réduction, **toujours**. C’est le **branchement** qui change. Retenir « anode = oxydation » et rien d’autre évite le piège le plus classique du chapitre.

Le générateur doit fournir une tension **supérieure** à celle que délivrerait la pile correspondante.

## Le bilan quantitatif
Le même calcul que pour une pile : **n(e⁻) = I × Δt / F**

D’où la masse déposée ou dissoute, ou le volume de gaz dégagé. C’est ainsi qu’on dimensionne un dépôt de galvanoplastie ou une production industrielle.

## Les applications
| Application | Ce qui se passe |
| **Électrolyse de l’eau** | Dihydrogène à la cathode, dioxygène à l’anode |
| **Galvanoplastie** | Dépôt d’un métal sur la pièce placée à la **cathode** |
| Production d’**aluminium** | Il ne s’obtient **que** par électrolyse de l’alumine |
| **Raffinage** du cuivre | Purification par transfert d’une anode vers une cathode |

## Accumulateur et pile à combustible
| | **Accumulateur** | **Pile à combustible** |
| Ce que c’est | Un système **réversible** | Une pile **alimentée en continu** |
| À la décharge | Il fonctionne en **pile** | Elle débite |
| À la recharge | Il fonctionne en **électrolyseur** | Elle ne se recharge pas : on l’alimente |
| Exemples | Lithium-ion, plomb-acide | Hydrogène / dioxygène |

Dans un accumulateur en charge, anode et cathode **échangent leurs places** : c’est ce qui le distingue d’une pile jetable.

La pile à combustible ne rejette que de l’**eau** — à condition que le dihydrogène ait lui-même été produit proprement.

> Le rendement du couple charge-décharge n’est **jamais** de 100 % : une part de l’énergie part en chaleur à chaque conversion.`,
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
            cours: `« Acide fort » ne veut **pas** dire « acide dangereux » : cela veut dire que sa réaction avec l’eau est **totale**. Un acide faible concentré peut être bien plus corrosif qu’un acide fort dilué.

## Fort ou faible
| | Acide **fort** | Acide **faible** |
| La réaction avec l’eau | **Totale** | **Limitée** : équilibre |
| La flèche | Simple | Double |
| Ce qui reste en solution | **Plus de AH du tout** | AH et A⁻ **coexistent** |
| Exemples | HCl, HNO₃, H₂SO₄ | CH₃COOH, HF, NH₄⁺ |

Même distinction pour les bases : HO⁻ et les hydroxydes solubles sont **forts**, NH₃ et CH₃COO⁻ sont **faibles**.

## La constante d’acidité
Ka = ([A⁻]/c°) × ([H₃O⁺]/c°) divisé par ([AH]/c°), et **pKa = −log Ka**

| L’acide est… | Ka | pKa |
| Plus **fort** | Plus **grand** | Plus **petit** |
| Plus **faible** | Plus petit | Plus grand |

> L’échelle est **inversée** : c’est le sens à ne jamais perdre. Un pKa de 3 signale un acide plus fort qu’un pKa de 9.

## Le diagramme de prédominance
En prenant le logarithme de l’expression de Ka, on obtient la **relation de Henderson** :

pH = pKa + log([A⁻]/[AH])

| La situation | Ce qui prédomine |
| pH **<** pKa | L’**acide** AH |
| pH **>** pKa | La **base** A⁻ |
| pH **=** pKa | Les deux, à **concentrations égales** |

Un diagramme de prédominance est donc un axe de pH **coupé en deux au pKa**. Pour un diacide, deux pKa découpent trois domaines.

## Les indicateurs colorés
Un indicateur est un couple acide/base dont les deux formes **n’ont pas la même couleur**. Il change de teinte sur une **zone de virage** d’environ deux unités, centrée sur son pKa.

> On le choisit pour que sa zone de virage soit **contenue dans le saut de pH** du titrage. Sinon, le virage n’indique **pas** l’équivalence — et le dosage est faux malgré une manipulation correcte.

## Deux repères à retenir
| Couple | pKa |
| Acide éthanoïque / éthanoate | **4,8** |
| Ion ammonium / ammoniac | **9,2** |

Ils permettent de situer presque tous les autres.`,
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
            cours: `Calculer un pH, c’est **toujours** la même démarche : identifier la réaction prépondérante, dresser un tableau d’avancement, écrire la constante d’équilibre, résoudre.

## Acide fort ou acide faible
| | **Acide fort** | **Acide faible** |
| La réaction | **Totale** | **Limitée** |
| Le calcul | Direct : [H₃O⁺] = c | Par tableau d’avancement et Ka |
| Le pH | pH = −log(c/c°) | **Plus élevé**, à concentration égale |
| Pourquoi | Tout l’acide est converti | Moins de H₃O⁺ ont été libérés |

Pour une **base forte**, on passe par [HO⁻] puis par Ke : pH = 14,0 + log(c/c°) à 25 °C.

> La formule de l’acide fort n’est vraie que si c reste au-dessus de **10⁻⁶ mol·L⁻¹**. En dessous, l’autoprotolyse de l’eau domine — et le pH d’une solution acide ne dépasse **jamais** 7, si diluée soit-elle.

## Le taux d’avancement
τ = [A⁻]/c mesure l’écart au cas de l’acide fort. Il **augmente quand on dilue** : un acide faible très dilué se comporte presque comme un acide fort.

## La solution tampon
Une solution contenant **l’acide ET sa base conjuguée** en quantités comparables voit son pH varier peu.

| Ce à quoi elle résiste | Le pH |
| Un ajout modéré d’acide | Il bouge peu |
| Un ajout modéré de base | Il bouge peu |
| Une dilution | Il ne bouge pratiquement pas |

pH = pKa + log([A⁻]/[AH]) — et le tampon est **maximalement efficace quand [A⁻] = [AH]**, c’est-à-dire quand **pH = pKa**.

Le sang est tamponné par le couple CO₂,H₂O / HCO₃⁻ autour de **pH 7,4**.

## Le titrage pH-métrique
La réaction de titrage doit être **totale, rapide et unique**.

| Point remarquable | Ce qui s’y passe | Ce qu’on en tire |
| L’**équivalence** | Les réactifs sont mélangés dans les proportions stœchiométriques | La **concentration** cherchée |
| La **demi-équivalence** | La moitié de AH est transformée : [A⁻] = [AH] | **pH = pKa** |

L’équivalence est le point d’inflexion du saut de pH : on la repère par la méthode des **tangentes** ou par le **maximum de la dérivée**.

> À l’équivalence, le pH ne vaut 7 **que** si l’on titre un acide fort par une base forte. Titrer un acide **faible** par une base forte donne un pH d’équivalence **supérieur à 7** — la base conjuguée formée est basique. C’est ce qui commande le choix de l’indicateur coloré.`,
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
            cours: `Une molécule organique se lit à **trois niveaux** : la **chaîne carbonée** qui lui sert de squelette, les **groupes caractéristiques** qui portent sa réactivité, et sa **forme dans l’espace** — qui décide parfois de tout.

## Les trois formules
| Formule | Ce qu’elle montre | Sa limite |
| **Brute** | Le nombre d’atomes : C₂H₆O | Elle ne distingue pas les isomères |
| **Semi-développée** | Les liaisons entre atomes lourds | Illisible au-delà de quelques carbones |
| **Topologique** | Une ligne brisée : chaque sommet est un carbone | La seule lisible sur les grosses molécules |

C₂H₆O est aussi bien l’**éthanol** que le **méthoxyméthane** : ce sont des **isomères de constitution**.

## Les familles et leurs groupes
| Famille | Groupe | Position |
| **Alcool** | —OH | Sur un carbone tétragonal |
| **Aldéhyde** | —CHO | **Toujours** en bout de chaîne |
| **Cétone** | —CO— | **Toujours** en milieu de chaîne |
| **Acide carboxylique** | —COOH | En bout de chaîne |
| **Ester** | —COO— | |
| **Amine** | —NH₂, —NH—, —N | |
| **Amide** | —CONH— | |
| **Halogénoalcane** | —X, avec X = F, Cl, Br, I | |

Les alcools se classent en **primaire, secondaire, tertiaire** selon le nombre de carbones voisins de celui qui porte le —OH. Distinction décisive : un alcool **tertiaire ne s’oxyde pas**.

## Les isoméries
| Type | Ce qui diffère | Ce qui l’engendre |
| **De constitution** | L’enchaînement des atomes | Chaîne, position, fonction |
| **Z / E** | La disposition autour d’une double liaison | La C=C ne tourne pas |
| **Énantiomérie** | Images dans un miroir, non superposables | Un **carbone asymétrique** : quatre substituants différents |
| **Diastéréo-isomérie** | Stéréo-isomères non énantiomères | Plusieurs centres |

> Deux énantiomères ont **exactement** les mêmes propriétés physiques — température de fusion, solubilité — et peuvent avoir des effets **biologiques radicalement différents**. La raison : un récepteur biologique est lui-même **chiral**, et ne reconnaît qu’une des deux formes.

## La polarité, source de réactivité
| Site | Ce qui le crée | Exemple |
| **Accepteur**, δ⁺ | Le carbone d’une liaison polarisée | C—O, C—Cl, C=O |
| **Donneur**, δ⁻ | L’atome électronégatif et ses doublets | L’oxygène du C=O |

C’est cette **carte des charges** qui prédit où une molécule sera attaquée — et c’est elle qu’on dessine avant d’écrire le moindre mécanisme.`,
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
            cours: `Synthétiser une molécule, ce n’est pas trouver « la » réaction : c’est **enchaîner des étapes**, dans un ordre qui protège ce qu’il faut protéger, avec des réactifs qui n’attaquent que ce qu’on veut.

## Les trois modifications possibles
| Ce qu’on modifie | Exemple |
| La **chaîne carbonée** | L’allonger, la raccourcir, la ramifier |
| Le **groupe caractéristique** | Alcool vers aldéhyde vers acide |
| La **stéréochimie** | Obtenir un énantiomère plutôt que l’autre |

## Les trois catégories de réactions
| Réaction | Ce qui se passe | Comment la reconnaître |
| **Substitution** | Un groupe en remplace un autre | Même nombre d’atomes, un groupe échangé |
| **Addition** | Deux entités s’ajoutent sur une liaison multiple | Une **insaturation disparaît** |
| **Élimination** | Une liaison multiple se crée | Une **insaturation apparaît** |

On les identifie en **comparant réactif et produit**, jamais en lisant le nom du réactif.

## Les trois sélectivités
| Sélectivité | Ce qu’elle garantit |
| **Chimiosélectivité** | Un seul **type de groupe** réagit, alors que plusieurs sont présents |
| **Régiosélectivité** | Une seule **position** réagit parmi plusieurs possibles |
| **Stéréosélectivité** | Un seul **stéréo-isomère** se forme |

Un réactif « brutal » manque de sélectivité et donne un mélange à séparer : **la sélectivité, c’est du rendement gagné et de la purification épargnée**.

## La protection de fonction
| Étape | Ce qu’on fait |
| 1 | **Protéger** : transformer temporairement le groupe en un groupe inerte |
| 2 | Réaliser l’étape voulue |
| 3 | **Déprotéger** : restaurer le groupe d’origine |

Cela ajoute **deux étapes** — donc du coût et une perte de rendement — mais c’est souvent le seul chemin possible. C’est la stratégie systématique en **synthèse peptidique**, où seule la bonne extrémité de chaque acide aminé doit réagir.

## La synthèse multi-étapes
> Le rendement global est le **produit** des rendements de chaque étape : **cinq étapes à 80 % ne donnent que 33 %** au total.

D’où deux principes qui commandent toute stratégie : **le moins d’étapes possible**, et **les étapes coûteuses le plus tard possible**.

## Le coût et l’impact
| Critère | Ce qu’on évalue |
| Prix | Celui des réactifs et des solvants |
| **Sécurité** | Solvants inflammables, toxicité |
| Énergie | Chauffage à reflux prolongé |
| **Économie d’atomes** | La part de la masse des réactifs qui finit dans le produit |

Ce sont les principes de la **chimie verte** : moins de solvants, catalyse plutôt que réactifs stœchiométriques, matières premières renouvelables.

> Le protocole d’un TP se lit à cette lumière : **reflux** (accélérer sans perdre de matière), **distillation ou recristallisation** (purifier), **CCM** (vérifier), **rendement** (mesurer).`,
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
            cours: `Décrire un mouvement, c’est répondre à trois questions **dans l’ordre** : par rapport à quoi, où, et comment cela change.

## Le référentiel
Aucun mouvement n’existe dans l’absolu. Un passager est **immobile** dans le référentiel du train et animé de 300 km/h dans celui du sol — les deux descriptions sont vraies.

| Référentiel | Son origine | Quand l’employer |
| **Terrestre** | Le sol | Mouvements courants |
| **Géocentrique** | Le centre de la Terre | Satellites |
| **Héliocentrique** | Le centre du Soleil | Planètes |

## Les trois vecteurs
| Vecteur | Comment on l’obtient | Sa direction |
| **Position** OM | Les équations horaires x(t), y(t), z(t) | Du repère vers le point |
| **Vitesse** v | La **dérivée** de OM | **Tangente** à la trajectoire, dans le sens du mouvement |
| **Accélération** a | La dérivée de v, donc la dérivée **seconde** de OM | Toujours vers l’**intérieur** de la courbure |

En éliminant t entre les équations horaires, on obtient l’**équation de la trajectoire**.

## La méthode expérimentale
Sur un pointage vidéo, on n’a pas de fonction dérivable mais une suite de positions à intervalle τ. On approche la dérivée par une **différence finie centrée** :

v(Mᵢ) ≈ M(ᵢ₋₁)M(ᵢ₊₁) / (2τ)

> Plus τ est petit, meilleure est l’approximation de la dérivée — mais **plus l’incertitude de pointage pèse**. C’est un compromis, pas une optimisation.

## Le repère de Frenet
| Composante | Formule | Ce qu’elle traduit |
| **Tangentielle** aₜ | dv/dt | La variation de la **valeur** de la vitesse |
| **Normale** aₙ | v²/R, vers le centre | La variation de la **direction** |

## Deux mouvements de référence
| Mouvement | L’accélération | Pourquoi |
| Rectiligne **uniforme** | **a = 0** | Ni la valeur ni la direction ne changent |
| Circulaire **uniforme** | **a = v²/R**, vers le centre | La valeur ne change pas, la **direction** si |

> Un mouvement uniforme n’est **pas** un mouvement sans accélération : « uniforme » ne parle que de la **valeur** de la vitesse. C’est le point le plus contre-intuitif du chapitre — et le plus testé.`,
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
            cours: `La deuxième loi de Newton est l’outil central de la mécanique de Terminale. Sa difficulté n’est **pas** la formule : c’est la **rigueur de la mise en place**.

## Les trois lois
| Loi | Son énoncé | Ce qu’elle permet |
| **1re** — inertie | Un système pseudo-isolé est au repos ou en mouvement rectiligne uniforme | La réciproque est vraie : elle sert de test |
| **2e** | ΣF = dp/dt, avec p = m v ; si m est constante, **ΣF = m a** | Tout le reste du chapitre |
| **3e** — actions réciproques | F(A→B) = −F(B→A) | Relier deux corps en interaction |

> Les deux forces de la 3e loi ont **toujours** même valeur et sens opposés, **quelles que soient les masses** — et elles s’appliquent à **deux corps différents**, donc elles ne se compensent **jamais** entre elles. C’est l’erreur classique.

## La méthode, en cinq gestes
1. **Définir le système** — et l’écrire noir sur blanc.
2. Choisir le **référentiel**, supposé galiléen.
3. Faire le **bilan des forces extérieures** et le **schématiser** : poids, réaction du support (normale et frottements), tension, poussée d’Archimède, force électrique.
4. **Appliquer ΣF = m a**.
5. **Projeter** sur les axes, puis intégrer **deux fois** — les constantes viennent des **conditions initiales**.

> Une force **intérieure** au système ne figure jamais dans le bilan. C’est pour cela que définir le système est le **premier** geste, et non une formalité.

## Ce que la loi ne dit pas
| L’idée fausse | Ce qui est vrai |
| Une force donne la vitesse | Elle donne sa **variation** |
| Pas de force, pas de mouvement | L’inertie : on avance vite sans aucune force |
| Une force, donc du mouvement | Au sommet d’un lancer vertical, v = 0 alors que le poids agit |

## La chute avec frottement
| Ce qui se passe | Pourquoi |
| L’accélération **diminue** à mesure que v augmente | Le frottement f = k v ou k v² grandit |
| La vitesse tend vers une **vitesse limite** | Elle est atteinte quand ΣF = 0 |

On la calcule en posant **a = 0** dans l’équation différentielle — **sans avoir à la résoudre**. C’est le raccourci à connaître.

## La méthode d’Euler
Quand l’équation n’a pas de solution analytique simple, on avance **pas à pas** :

v(t + Δt) = v(t) + a(t) × Δt, puis x(t + Δt) = x(t) + v(t) × Δt

C’est ce que fait un tableur ou un programme Python. Plus Δt est petit, plus la solution approchée est fidèle.`,
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
            cours: `Un champ **uniforme** a même valeur, même direction et même sens en tout point. La force qui en découle est **constante**, donc l’accélération aussi : le mouvement est toujours le même, à un facteur près.

## Les deux champs, côte à côte
| | Champ de **pesanteur** | Champ **électrique** |
| Sa valeur | g ≈ 9,81 m·s⁻² près du sol | E = U / d entre deux plaques |
| La force | P = m g | F = q E |
| L’accélération | **a = g** | **a = qE/m** |
| Dépend-elle de l’objet ? | **Non** : indépendante de la masse | **Oui** : masse et charge |
| Ce que cela permet | Une plume et une bille tombent ensemble dans le vide | **Trier** des particules |

> Le mouvement d’un projectile ne dépend **pas** de sa masse ; celui d’une particule chargée en dépend. Confondre les deux cas est l’erreur la plus fréquente du chapitre.

## Les équations du tir
Avec une vitesse initiale v₀ faisant un angle α avec l’horizontale :

| Axe | Accélération | Vitesse | Position |
| x | a_x = 0 | v_x = v₀ cos α | x = v₀ cos α × t |
| y | a_y = −g | v_y = −g t + v₀ sin α | y = −½ g t² + v₀ sin α × t + y₀ |

En éliminant t : y = −g x² / (2 v₀² cos²α) + x tan α + y₀ — l’équation d’une **parabole**.

Le mouvement se décompose donc en un mouvement **uniforme** à l’horizontale et **uniformément accéléré** à la verticale, et les deux sont **indépendants**.

## Portée et flèche
| Grandeur | Comment on la trouve |
| La **flèche** — altitude maximale | Quand v_y = 0 |
| La **portée** | Le second point où y retrouve sa valeur initiale |
| L’angle optimal, sans frottement | **45°** |

## Le champ électrique entre deux plaques
E = U / d, dirigé du **+** vers le **−**.

| La charge est… | La force est… |
| Positive | Dans le sens de E |
| Négative | En sens **inverse** de E |

## L’analogie
Un électron lancé perpendiculairement à E entre deux plaques suit **exactement la même parabole** qu’un ballon lancé horizontalement : mêmes équations, seul le rapport force/masse change.

Le **poids** d’un électron est d’ailleurs totalement négligeable devant la force électrique — on ne le fait pas figurer au bilan.

## Le raccourci énergétique
En l’absence de frottement, l’**énergie mécanique** se conserve : ½mv² + mgz = constante.

Elle donne une vitesse en un point **sans passer par les équations horaires**. C’est très souvent le chemin le plus court.`,
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
            cours: `Un satellite en orbite n’**échappe pas** à la gravitation : il tombe en permanence, mais sa vitesse horizontale est telle que le sol se dérobe **aussi vite** qu’il descend.

## La loi de gravitation universelle
F = G × m_A × m_B / r², avec G = 6,67 × 10⁻¹¹ N·m²·kg⁻²

Le **champ de gravitation** créé par un astre de masse M vaut G(r) = G M / r², dirigé **vers** l’astre.

> Ce champ n’est **pas uniforme** : il décroît en 1/r². S’il est traité comme uniforme près du sol, c’est parce que sur quelques dizaines de mètres r varie si peu que G M/r² ne bouge pas. C’est le lien avec le chapitre précédent.

## Le mouvement circulaire d’un satellite
La seule force étant l’attraction, l’accélération est **centripète** : v²/r = G M/r², d’où

**v = √(G M / r)**

| Ce qu’on en déduit | Pourquoi |
| La vitesse ne dépend **pas de la masse du satellite** | Elle disparaît de l’équation |
| Plus l’orbite est **basse**, plus le satellite va **vite** | v varie en 1/√r |
| Le mouvement est **uniforme** | Aucune force n’a de composante tangentielle |

## Les trois lois de Kepler
| Loi | Son énoncé | Ce qu’elle permet |
| **1re** | Les planètes décrivent des **ellipses**, le Soleil à un **foyer** | Corriger le modèle circulaire |
| **2e** — loi des aires | Le segment astre-planète balaie des **aires égales en des durées égales** | La planète va plus vite au **périhélie** |
| **3e** | **T²/a³** est la même constante pour tous les satellites d’un même astre | **Peser un astre** à partir d’une seule orbite |

T² / r³ = 4π² / (G M)

## Le satellite géostationnaire
| Condition | Pourquoi |
| Orbite **équatoriale** | Sinon il oscille en latitude |
| Même **sens** que la rotation terrestre | Sinon il défile en sens inverse |
| Période = **un jour sidéral**, 86 164 s | Pour rester à la verticale du même point |

La troisième loi de Kepler donne alors un rayon **unique** : environ **42 200 km** depuis le centre de la Terre, soit **36 000 km d’altitude**.

## L’impesanteur
> Un astronaute en orbite n’est **pas** « hors de la gravité » : il est en **chute libre permanente** avec son vaisseau. Tous deux tombent avec la même accélération — d’où l’absence de force de contact, et la sensation d’apesanteur.`,
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
            cours: `Un fluide en mouvement obéit encore à la conservation de la matière et de l’énergie — mais réécrites pour un milieu qui **coule**.

## Le débit et sa conservation
Dv = V / Δt = **S × v**, en m³·s⁻¹

Pour un fluide **incompressible** en écoulement **stationnaire**, le débit est le même dans **toutes** les sections :

**S₁ v₁ = S₂ v₂**

| Si la section… | La vitesse… | Exemple |
| Se **rétrécit** | **Augmente** | On pince un tuyau d’arrosage pour envoyer l’eau plus loin |
| S’élargit | Diminue | Un fleuve ralentit dans une plaine |

## La relation de Bernoulli
Le long d’une ligne de courant : **P + ½ρv² + ρgz = constante**

| Terme | Son nom | Ce qu’il représente |
| P | Pression **statique** | La pression du fluide |
| ½ρv² | Pression **dynamique** | Son mouvement |
| ρgz | Terme de **hauteur** | Son altitude |

Les trois sont homogènes à une pression : la relation est une **conservation de l’énergie par unité de volume**.

## L’effet Venturi
Dans un rétrécissement **horizontal**, la vitesse augmente donc la pression **diminue**.

> C’est contre-intuitif : le fluide va **plus vite** là où il est **le moins comprimé**. C’est pourtant ce qui explique la trompe à eau, le carburateur, le débitmètre à Venturi, la portance d’une aile — et le rideau de douche qui colle.

## Les limites du modèle
| Hypothèse de Bernoulli | Ce qui arrive dans le réel |
| Fluide **sans viscosité** | Les frottements font chuter la pression le long du trajet |
| Écoulement **stationnaire** | Les régimes transitoires y échappent |
| **Incompressible** | Faux pour un gaz à grande vitesse |
| Le long d’une **même** ligne de courant | Ne pas comparer deux lignes différentes |

Il faut une **pompe** pour entretenir la pression dans une conduite réelle. Le modèle reste excellent sur de courtes distances et à vitesse modérée.

## Laminaire ou turbulent
| Écoulement | Comment il se fait | Ce qu’il coûte |
| **Laminaire** | En couches parallèles qui ne se mélangent pas | Peu d’énergie |
| **Turbulent** | Chaotique | Beaucoup plus de dissipation |

Le passage de l’un à l’autre dépend de la vitesse, du diamètre et de la viscosité.

> Vérifier les hypothèses **avant** d’appliquer Bernoulli vaut la moitié des points de l’exercice.`,
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
            cours: `Un litre d’eau, c’est **3 × 10²⁵ molécules** en mouvement désordonné. On ne les suivra jamais une par une : la thermodynamique décrit ce même système avec **quatre grandeurs**.

## Les deux échelles
| Échelle | Ce qu’elle décrit | Le lien |
| **Microscopique** | Les entités, leurs vitesses, leurs positions | — |
| **Macroscopique** | P, V, T, n — mesurables | Ce sont des **moyennes statistiques** de l’échelle du dessous |

La **pression** d’un gaz est l’effet moyen des chocs sur les parois ; la **température**, l’agitation moyenne.

## Le système et son extérieur
| Type de système | Il échange… | Exemple |
| **Ouvert** | Matière **et** énergie | Une casserole sans couvercle |
| **Fermé** | L’énergie seulement | Une bouteille bouchée |
| **Isolé** | **Rien** | Le calorimètre idéal |

## Les variables d’état
P, V, T et n décrivent l’état à un instant donné, **sans rien dire de son histoire**. Une **transformation** fait passer d’un état initial à un état final ; l’**équilibre thermodynamique** est atteint quand elles ne varient plus.

## La température
T(K) = θ(°C) + 273,15. Le **zéro absolu** — 0 K, soit −273,15 °C — correspond à l’agitation minimale.

> Toute formule contenant T doit employer le **kelvin**. Les °C ne sont licites que dans les **écarts** ΔT, puisqu’un écart de 1 °C vaut exactement un écart de 1 K. C’est une source d’erreur permanente.

La température est directement liée à l’**énergie cinétique moyenne** : deux fois plus chaud en kelvin, c’est deux fois plus agité.

## L’énergie interne
| Ce que U **comprend** | Ce que U ne comprend **pas** |
| L’énergie cinétique d’**agitation** | L’énergie cinétique d’**ensemble** du système |
| Les énergies d’**interaction** entre entités | L’énergie potentielle de **pesanteur** |

> Une bouteille d’eau posée sur une table et la même bouteille dans un train lancé ont **exactement la même énergie interne**.

C’est une **fonction d’état** : ΔU ne dépend que de l’état initial et de l’état final, **jamais du chemin suivi**.

## La capacité thermique
C = m × c, où c est la **capacité thermique massique**, en J·kg⁻¹·K⁻¹.

| Corps | c |
| Eau liquide | **4185** J·kg⁻¹·K⁻¹ |
| Air | environ 1000 |
| Fer | environ 450 |

Celle de l’eau est remarquablement élevée : c’est ce qui en fait un bon **fluide caloporteur**, et ce qui **adoucit les climats côtiers**.

> Chaleur et température ne sont pas la même chose : la température est un **état**, le transfert thermique un **échange**. Un système « ne contient pas de chaleur » — il contient de l’énergie interne.`,
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
            cours: `Faire monter la température d’un corps a un coût énergétique ; le faire **fondre** en a un autre — sans qu’aucun thermomètre ne bouge.

## Les deux calculs
| Situation | La formule | La température |
| Chauffer une phase condensée | **ΔU = m × c × ΔT** | Elle **varie** |
| Changer d’état | **Q = m × L** | Elle reste **constante** |

Pendant un changement d’état, l’énergie sert à **rompre ou former les interactions** entre entités — pas à les agiter davantage.

## Le coût des changements d’état de l’eau
| Transformation | L, en J·kg⁻¹ | Équivalent en chauffage |
| Fusion | 3,34 × 10⁵ | Environ **80 °C** |
| Vaporisation | **2,26 × 10⁶** | Environ **540 °C** |

Vaporiser coûte près de **sept fois** plus que fondre. C’est ce qui explique la **transpiration** : l’eau qui s’évapore prélève cette énergie sur la peau.

## Les deux modes de transfert
| Mode | Sa nature | Exemples |
| Le **travail W** | Transfert **ordonné**, par une force | Compression d’un gaz, agitation, travail électrique |
| Le **transfert thermique Q** | Transfert **désordonné** | Une différence de température |

Les deux se comptent en joules. La distinction n’est pas de nature mais d’**ordre** : le travail déplace la matière en bloc, le transfert thermique passe de proche en proche.

## La convention de signe
| Énergie | Signe |
| **Reçue** par le système | **Positif** |
| **Cédée** par le système | **Négatif** |

C’est la convention du banquier : ce qui entre sur le compte est positif. Se tromper de signe, c’est se tromper de **sens physique**.

## Le calorimètre
Un calorimètre approche un système **isolé**. En y mélangeant deux corps de températures différentes :

**Q₁ + Q₂ = 0**

Aux pertes et à la capacité du vase près, qu’on modélise par une **valeur en eau**. C’est la méthode expérimentale pour mesurer une capacité thermique massique ou une énergie de changement d’état.

> Erreur classique : appliquer ΔU = mcΔT **à travers** un changement d’état. Il faut découper le calcul en tranches — chauffer jusqu’à la température de changement d’état, **changer d’état**, puis chauffer à nouveau.`,
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
**ΔU = W + Q**

La variation d’énergie interne égale la somme du **travail** et du **transfert thermique** reçus, comptés algébriquement.

| Grandeur | Dépend-elle du chemin ? |
| **ΔU** | **Non** : c’est une fonction d’état |
| W | **Oui** |
| Q | **Oui** |

> Deux chemins différents entre les **mêmes** états donnent des W et des Q différents — mais **la même somme**. C’est tout le contenu du principe.

## Les bilans usuels
| Transformation | Ce qui est nul | Ce qui reste |
| Système **isolé** | W = Q = 0 | **ΔU = 0** |
| **Isotherme** d’une phase condensée | ΔU = 0 | W = −Q |
| **Transfert thermique seul** | W = 0 | ΔU = Q |
| **Adiabatique** — parois calorifugées | Q = 0 | ΔU = W |

Le dernier cas est celui de l’**expérience de Joule** : agiter de l’eau la réchauffe, sans jamais l’avoir chauffée. C’est ce qui a établi l’équivalence entre travail et chaleur.

## Les machines thermiques
Une machine thermique échange avec deux sources à températures différentes. Le premier principe impose que le **total se conserve** — mais il **n’interdit rien sur le sens**.

> C’est le **second principe** qui interdit à la chaleur de remonter spontanément du froid vers le chaud. Le premier, à lui seul, autoriserait un réfrigérateur sans électricité.

Le **rendement** d’un convertisseur : η = E_utile / E_fournie, **toujours inférieur à 1**. Le complément part en pertes, essentiellement en transfert thermique vers l’extérieur.

## La chaîne énergétique
Un diagramme représente les réservoirs, les convertisseurs et les transferts. Il rend le bilan lisible :

> Pour **chaque bloc**, la somme des flèches entrantes égale la somme des flèches sortantes. C’est le premier principe **dessiné**.

## Un abus de langage
« Consommer de l’énergie » n’a aucun sens physique : on la **convertit** en une forme moins utilisable. Ce qu’on paye sur une facture, c’est une **conversion**, pas une disparition.`,
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
            cours: `Un transfert thermique est **spontané** et toujours orienté **du corps chaud vers le corps froid**, jusqu’à l’égalité des températures. Trois mécanismes le portent.

## Les trois modes
| Mode | Comment | Support matériel ? | Exemple |
| **Conduction** | De proche en proche, sans déplacement de matière | Oui | Une cuillère dans une casserole |
| **Convection** | Par déplacement de matière | Oui, un **fluide** | Un radiateur : l’air chaud monte |
| **Rayonnement** | Par ondes électromagnétiques | **Non** | Le Soleil nous chauffe à travers le vide |

Dans la plupart des situations réelles, les **trois coexistent**.

## Flux et résistance
| Grandeur | Formule | Unité |
| **Flux thermique** Φ | Q / Δt | Le **watt** |
| **Résistance thermique** R_th | e / (λ × S) | K·W⁻¹ |
| La loi | **Φ = ΔT / R_th** | |

## L’analogie électrique
| En thermique | En électricité |
| ΔT, l’écart de température | La tension U |
| Φ, le flux | L’intensité I |
| R_th | La résistance R |

Elle est complète : des parois **en série additionnent** leurs résistances — c’est ainsi qu’on calcule un mur multicouche.

## Isolants et conducteurs
| Matériau | λ, en W·m⁻¹·K⁻¹ | Rôle |
| Laine de verre | **0,04** | Très bon isolant |
| Air **immobile** | 0,026 | Excellent isolant |
| Verre | environ 1 | Médiocre |
| Cuivre | **390** | Très bon conducteur |

> C’est l’**air immobile** qui isole, pas le matériau qui l’emprisonne. Tout le principe du double vitrage, du pull et du plumage tient là — et c’est pourquoi un isolant mouillé ou comprimé n’isole plus.

## La loi de refroidissement de Newton
Φ = h × S × (T − T_ext)

Le flux perdu est **proportionnel à l’écart** — d’où une décroissance **exponentielle** de cet écart : un café chaud refroidit vite au début, lentement ensuite.

C’est la **même forme mathématique** que la décroissance radioactive ou la décharge d’un condensateur.

## Le bilan thermique
| Régime | Ce qui se passe |
| **Stationnaire** | Ce qui entre égale ce qui sort : T ne varie plus |
| Déséquilibré | La différence vaut m c dT/dt : le système s’échauffe ou refroidit |

Ce bilan gouverne aussi bien le chauffage d’une maison que l’**effet de serre** — le rayonnement solaire reçu contre l’infrarouge réémis, dont une partie est renvoyée au sol par l’atmosphère.

> Un manteau ne « donne » pas de chaleur : il **freine le flux qui sort**. C’est une résistance thermique qu’on achète, pas une source.`,
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

## Les deux grandeurs
| Grandeur | Symbole, unité | Définition |
| **Intensité sonore** | I, en W·m⁻² | Puissance reçue par unité de surface |
| **Niveau d’intensité** | L, en **décibels** | L = 10 × log(I / I₀) |

avec I₀ = 1,0 × 10⁻¹² W·m⁻², le **seuil d’audibilité**.

| Situation | I, en W·m⁻² | L, en dB |
| Seuil d’audibilité | 10⁻¹² | **0** |
| Conversation | 10⁻⁶ | 60 |
| Rue passante | 10⁻⁴ | 80 |
| Seuil de douleur | **1** | **120** |

## Les trois règles à retenir
| Si l’intensité est… | Le niveau… |
| Multipliée par **10** | **+ 10 dB** |
| Multipliée par **2** | **+ 3 dB** — car 10 log 2 ≈ 3 |
| Doublée par une seconde source identique | **+ 3 dB**, pas le double |

> Erreur classique : croire que 60 dB + 60 dB font 120 dB. **Deux machines à 60 dB donnent 63 dB.** L’échelle est logarithmique, les niveaux ne s’additionnent pas.

## Les deux atténuations
| Atténuation | Sa cause | Sa loi |
| **Géométrique** | L’énergie s’**étale** sur une sphère | I = P / (4π d²) : doubler la distance donne **− 6 dB** |
| Par **absorption** | Le milieu convertit réellement l’énergie | A = L_émis − L_reçu |

Elles **s’additionnent** en décibels. La première ne perd aucune énergie — elle la répartit ; la seconde la transforme en énergie interne.

## La sensibilité de l’oreille
La perception ne suit ni I ni exactement L : l’oreille est **plus sensible entre 1 et 4 kHz** qu’aux extrêmes, d’où la pondération **dB(A)** de l’acoustique réglementaire.

> Une exposition prolongée au-delà de **85 dB** endommage l’audition de façon **irréversible** : les cellules ciliées ne se régénèrent pas.

## Un point de vocabulaire
Le décibel n’est pas une unité au sens strict : c’est un **rapport** transformé en logarithme. Un niveau de **0 dB** ne signifie donc pas « pas de son », mais « son au seuil d’audibilité ».`,
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
            cours: `Le son d’une sirène qui s’approche est plus **aigu** que celui de la même sirène qui s’éloigne. Ce n’est pas la source qui change de note : c’est le **mouvement relatif** qui modifie la fréquence **reçue**.

## Le mécanisme
| La source… | Les fronts d’onde… | La fréquence perçue |
| S’**approche** | Se **resserrent** | **Augmente** — le son monte |
| S’**éloigne** | S’**écartent** | **Diminue** — le son descend |

> La fréquence **émise** n’a jamais changé. C’est le point que toute copie doit poser d’emblée.

## Les relations
| Situation | Formule |
| La source s’approche | f_r = f_e × c / (c − v) |
| La source s’éloigne | f_r = f_e × c / (c + v) |
| v petite devant c | **Δf / f_e ≈ v / c** |

La forme approchée est celle qui sert le plus.

## Les applications
| Application | Ce qu’elle mesure | Particularité |
| **Radar routier** | La vitesse d’un véhicule | Le décalage subit l’effet **deux fois** : Δf/f = **2v/c** |
| **Échographie Doppler** | La vitesse du sang | Réflexion sur les globules rouges |
| **Décalage vers le rouge** | La vitesse d’une galaxie | Il a établi l’**expansion de l’Univers** |
| Détection d’**exoplanètes** | L’oscillation d’une étoile | Le spectre oscille au rythme de la planète |

## Ce que l’effet Doppler ne change pas
| Grandeur | Est-elle modifiée ? |
| La **célérité** de l’onde | **Non** : elle ne dépend que du milieu |
| La fréquence **émise** | Non |
| La fréquence **perçue** | **Oui** |
| La longueur d’onde perçue | Oui |

> Si la source se déplace **perpendiculairement** à la ligne de visée, l’effet est **nul**. Ce n’est pas la vitesse qui compte, mais sa **composante radiale** — c’est ce qui rend la méthode aveugle à certaines orbites d’exoplanètes.

## Le mur du son
Il se produit quand v atteint c : les fronts d’onde s’accumulent en une **seule surface**, l’onde de choc. La formule f_r = f_e c/(c−v) **diverge** — elle annonce le phénomène avant même qu’on l’observe.`,
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
            cours: `Faites passer de la lumière par une fente très fine : au lieu d’un trait net, vous obtenez une figure **étalée**. Aucun modèle de particule ne prédit cela — c’est la signature du caractère **ondulatoire**.

## Le phénomène
La **diffraction** est l’étalement d’une onde rencontrant une ouverture ou un obstacle de dimension **a du même ordre que λ**.

| Si l’ouverture est… | L’étalement est… |
| Petite devant λ | **Grand** |
| Grande devant λ | Faible : l’onde semble aller tout droit |

> Plus l’ouverture est **petite**, plus l’étalement est **grand**. C’est contraire à l’intuition, et c’est **le** point du chapitre.

## Les relations
| Grandeur | Formule | Unité |
| Demi-angle d’ouverture | θ = λ / a | radians |
| Largeur de la tache centrale | **L = 2 λ D / a** | mètres |

C’est la relation qui permet de mesurer λ connaissant a — ou l’inverse, comme dans la mesure du diamètre d’un cheveu.

## Ce que la diffraction ne change pas
| Grandeur | Modifiée ? |
| La **fréquence** | Non |
| La **longueur d’onde** | Non |
| La **célérité** | Non |
| La **répartition dans l’espace** | **Oui** — c’est tout |

C’est une erreur fréquente de croire que la lumière « ralentit » ou « change de couleur » en traversant la fente.

## Les conséquences observables
| Observation | L’explication |
| Le **son contourne** un obstacle | λ vaut de quelques cm à plusieurs mètres |
| La lumière semble aller tout droit | λ vaut quelques centaines de **nanomètres** |
| D’une pièce voisine, on n’entend que les **basses** | Les graves se diffractent mieux que les aigus |
| Deux étoiles proches se confondent | La **résolution** est limitée par la diffraction sur l’ouverture |

C’est cette dernière raison — et non le grossissement — qui pousse à construire de **grands** télescopes.

## En pratique au laboratoire
Un laser, une fente calibrée, un écran à quelques mètres : on mesure L, on connaît D et a, on en déduit λ.

> Le tracé de L en fonction de **1/a** doit donner une **droite passant par l’origine**, de coefficient directeur 2λD. C’est la vérification quantitative du modèle — pas une simple illustration.

Diffraction et interférences se produisent souvent **ensemble** : la figure des fentes d’Young est faite de franges d’interférences **modulées** par l’enveloppe de diffraction de chaque fente.`,
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
            cours: `Superposer deux ondes ne donne pas toujours « plus ». Selon leur décalage, elles peuvent s’**additionner** ou s’**annuler** : c’est l’interférence, second phénomène exclusivement ondulatoire.

## Le principe de superposition
Quand deux ondes se rencontrent, les élongations **s’ajoutent algébriquement** en chaque point. Après la rencontre, **chacune poursuit son chemin sans avoir été modifiée**.

## La condition de cohérence
| Exigence | Pourquoi |
| Même **fréquence** | Sinon le déphasage varie sans cesse |
| **Déphasage constant** dans le temps | Sinon la figure défile trop vite pour être vue |

> En pratique, on n’y parvient qu’en **dédoublant une même source** : deux fentes éclairées par le même laser, une réflexion, une division du faisceau. **Deux lampes distinctes ne donnent jamais d’interférences visibles.**

## La différence de marche
δ = |S₂M − S₁M|

| Condition | Type d’interférence | Ce qu’on voit |
| δ = **k λ** | **Constructive** | Amplitude maximale : frange brillante |
| δ = **(k + ½) λ** | **Destructive** | Amplitude minimale : frange sombre |

## Les fentes d’Young
Deux fentes distantes de b, un écran à la distance D. L’**interfrange** vaut :

**i = λ D / b**

| Ce qui augmente i | Ce qui le diminue |
| Une grande longueur d’onde λ | Des fentes plus écartées |
| Un écran plus éloigné | |

L’interfrange est **proportionnel à λ** : c’est ainsi qu’on mesure une longueur d’onde **avec une règle**. En lumière blanche, chaque couleur a son propre interfrange — les franges s’irisent, et seule la **frange centrale** reste blanche.

## Les manifestations courantes
| Phénomène | Sa cause |
| Les couleurs d’une **bulle de savon** | Interférences entre les rayons réfléchis sur les deux faces |
| Une flaque d’**essence**, une plume de **paon** | Idem : ce ne sont pas des pigments |
| Le **casque à réduction active** | Il émet l’onde en **opposition de phase** |

> Les couleurs interférentielles **changent avec l’angle de vue** — ce qu’aucun pigment ne fait. C’est le test qui les distingue.

## Une précision qui compte
Interférences destructives ne veut **pas** dire « énergie détruite » : elle est **redistribuée** vers les franges brillantes. Le bilan énergétique total est inchangé.`,
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
            cours: `Une lunette astronomique ne **rapproche rien** : elle **augmente l’angle** sous lequel on voit l’objet. Tout le chapitre tient dans cette phrase.

## La lentille mince convergente
Caractérisée par sa **distance focale** f′ ou sa **vergence** V = 1/f′, en dioptries.

| Rayon incident | Ce qu’il devient |
| Passant par le **centre optique** O | Non dévié |
| **Parallèle à l’axe** | Il passe par le **foyer image** F′ |
| Passant par le **foyer objet** F | Il ressort **parallèle à l’axe** |

Trois rayons, aucun calcul : c’est la construction de base.

## Les relations
| Relation | Formule | Ce qu’elle donne |
| Conjugaison | 1/OA′ − 1/OA = 1/f′ | La position de l’image |
| Grandissement | γ = A′B′/AB = OA′/OA | Sa taille et son sens |

Les mesures sont **algébriques**, comptées dans le sens de propagation à partir de O. Un grandissement **négatif** signale une image **renversée**.

## L’objet à l’infini
Un astre est si lointain que ses rayons arrivent **parallèles**. Leur image se forme donc **exactement dans le plan focal image** — et si l’astre est vu sous le diamètre apparent θ :

A₁B₁ = f′₁ × θ, avec θ en radians

## La lunette afocale
| Élément | Sa focale | Son rôle |
| L’**objectif** | Grande, f′₁ | Il donne une image réelle dans son plan focal |
| L’**oculaire** | Courte, f′₂ | On y observe cette image |

Le montage est **afocal** quand **F′₁ = F₂** : le foyer image de l’objectif est confondu avec le foyer objet de l’oculaire.

> L’image finale est alors rejetée **à l’infini**, ce qui permet à l’œil d’observer **sans accommoder**. Ce n’est pas un détail de montage : c’est la condition d’un confort d’observation sur plusieurs heures.

## Le grossissement
**G = θ′ / θ = f′₁ / f′₂**

| Pour grossir davantage | Ce qu’il faut |
| Augmenter G | Un objectif de **grande** focale |
| Augmenter G | Un oculaire de **courte** focale |

C’est en **changeant d’oculaire** qu’on change de grossissement. L’image finale est **renversée** — sans importance en astronomie.

## Ce qui limite vraiment une lunette
| Ce qu’on croit limitant | Ce qui l’est vraiment |
| Le grossissement | Le **diamètre de l’objectif** |

Le diamètre fixe la **lumière collectée** — donc la capacité à voir les objets faibles — et la limite de **diffraction**, donc le pouvoir séparateur.

Grossir au-delà ne fait qu’agrandir une image floue : c’est le « **grossissement vide** » des publicités d’instruments bon marché.`,
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
            cours: `Les deux chapitres précédents ont établi que la lumière est une **onde**. Celui-ci montre qu’elle est aussi un flot de **grains d’énergie**. Les deux descriptions sont vraies.

## Le photon
**E = h ν = h c / λ**, avec h = 6,63 × 10⁻³⁴ J·s et c = 3,00 × 10⁸ m·s⁻¹

| Lumière | λ | Énergie du photon |
| Rouge | 700 nm | environ **1,8 eV** |
| Bleue | 450 nm | environ **2,8 eV** |

L’énergie d’un photon dépend **uniquement de la fréquence** — jamais de l’intensité. L’**électronvolt** est l’unité commode : 1 eV = 1,60 × 10⁻¹⁹ J.

## L’effet photoélectrique
| L’observation | Ce que prédit le modèle **ondulatoire** | Ce que dit le modèle **corpusculaire** |
| Une lumière rouge très **intense** n’arrache rien | Elle devrait finir par y arriver | Chaque photon est trop peu énergétique |
| Une lumière UV très **faible** y parvient aussitôt | Elle devrait mettre longtemps | Un seul photon suffit |

> Un électron reçoit **un photon entier, ou rien**. Il faut donc hν > W₀, le **travail d’extraction** du métal. C’est cette condition de seuil que le modèle ondulatoire ne peut pas produire.

## La dualité onde-corpuscule
| Phénomène | Modèle qui l’explique |
| Diffraction, interférences | **Ondulatoire** |
| Effet photoélectrique, absorption, émission | **Corpusculaire** |

Les deux ne s’opposent pas : ils décrivent des **aspects différents** d’un même objet, et chacun est indispensable.

L’expérience des fentes d’Young **photon par photon** le montre : chaque photon arrive en un **point unique** (corpuscule), mais l’accumulation de milliers d’impacts reconstitue les **franges** (onde).

## Les niveaux d’énergie quantifiés
Un atome ne possède que certaines valeurs d’énergie. Il ne peut absorber ou émettre que la **différence** entre deux niveaux :

**ΔE = E_haut − E_bas = h ν**

D’où les **spectres de raies** : chaque élément a son jeu de longueurs d’onde propre. C’est ainsi qu’on identifie la composition d’une **étoile sans y aller**, et que se lisent les raies de Fraunhofer du spectre solaire.

## Le laser
Il exploite l’**émission stimulée** : un photon traversant un atome excité en déclenche l’émission d’un second — **identique** en direction, en phase et en longueur d’onde.

D’où un faisceau **monochromatique, directif et cohérent** — et c’est cette cohérence qui rend possibles les expériences d’interférences du chapitre précédent.

> Le photon n’a **pas de masse**, mais il transporte énergie et quantité de mouvement. Ce n’est pas une contradiction : la relation E = mc² ne s’applique pas telle quelle à une particule sans masse.`,
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
            cours: `Un circuit électrique n’atteint pas son régime final instantanément. Un condensateur y introduit une **durée caractéristique**, qu’on peut mesurer, calculer — et exploiter comme **capteur**.

## Le condensateur
| Relation | Ce qu’elle dit |
| **q = C × u** | La charge est proportionnelle à la tension |
| **i = C × du/dt** | L’intensité est le **débit de charge** |

C est la **capacité**, en farads. Le farad est une unité énorme : les condensateurs usuels se comptent en µF ou en nF.

> Un condensateur ne laisse passer du courant que **tant que la tension varie**. En régime permanent, il se comporte comme un **interrupteur ouvert** — c’est la conséquence directe de i = C du/dt.

## La charge d’un dipôle RC
RC × du/dt + u = E, de solution **u(t) = E × (1 − e^(−t/RC))**

La tension croît d’abord vite, puis de plus en plus lentement, et tend vers E **sans jamais l’atteindre** exactement.

## La constante de temps
**τ = R × C**, homogène à un temps : Ω × F = s.

| Comment la lire sur la courbe | Ce qu’on observe |
| À t = τ | La tension a atteint **63 %** de sa valeur finale |
| La **tangente à l’origine** | Elle coupe l’asymptote à t = τ |
| À t = **5τ** | Le régime permanent est pratiquement atteint |

À la décharge, u(t) = E × e^(−t/τ) : la même constante gouverne la décroissance, et à t = τ il reste **37 %**.

## L’énergie stockée
E = ½ C u²

Un condensateur peut **restituer très vite** cette énergie : c’est le principe du flash d’appareil photo — la pile le charge lentement, il se décharge en quelques millisecondes.

## Les capteurs capacitifs
La capacité d’un condensateur plan dépend de trois paramètres. **Faire varier l’un d’eux fait varier C, donc τ, donc une durée mesurable.**

| Capteur | Le paramètre qui varie |
| **Écran tactile** | Le doigt, conducteur, modifie la capacité locale |
| **Capteur de niveau** | Le liquide remplace l’air entre les armatures |
| Capteur d’humidité, de pression, de position | L’isolant, l’écartement, la surface en regard |

> Le condensateur est le **troisième** système de l’année à décroissance exponentielle, après les noyaux radioactifs et le refroidissement d’un corps. Trois phénomènes sans aucun rapport, **une seule équation** : c’est une analogie formelle, et elle vaut d’être vue comme telle.`,
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
