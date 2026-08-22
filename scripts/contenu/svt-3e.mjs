// SVT — Troisième : LE PROGRAMME COMPLET (31 fiches).
//
// CE QUE REMPLACE CE MODULE. La 3e n'avait que CINQ chapitres de SVT, hérités du
// tout premier jeu de données (migration 008, contenu rempli par la 117) : « Le
// programme génétique », « L'évolution des espèces », « Le système immunitaire »,
// « Santé et responsabilité », « Les risques géologiques ». Cinq titres pour un
// programme de cycle 4 qui couvre trois grands domaines — la planète Terre et
// l'action humaine, le vivant et son évolution, le corps humain et la santé — et
// se déplie en trente et une fiches. Rien sur la tectonique des plaques, rien sur
// la météorologie, rien sur l'exploitation de l'eau et du pétrole, rien sur la
// nutrition des animaux et des plantes, rien sur la reproduction asexuée, rien
// sur l'effort physique, rien sur la digestion : un élève de 3e ne trouvait, sur
// ces sujets, RIEN.
//
// LE DÉCOUPAGE. Les 14 chapitres de la maquette de référence, éclatés en leurs
// 31 fiches. Chaque fiche est un chapitre en base ; le CHAPITRE du programme est
// porté par `axe` (colonne `chapters.theme`), qui fait grouper la page matière —
// cf. docs/template-matiere.md. La SVT n'a qu'un seul rayon : pas de `rayon`
// ici, la page garde un onglet Programme unique.
//
// SEPT CHAPITRES NE PORTENT QU'UNE SEULE FICHE (« Nutrition et organisation des
// plantes », « Système nerveux et comportement responsable », « Alimentation et
// digestion »). C'est la maquette qui en décide ainsi, et on la suit : découper
// artificiellement une fiche en deux pour équilibrer les chapitres donnerait
// deux demi-cours là où l'élève en attend un.
//
// LES CINQ ANCIENS PARTENT (voir `menage`). Tous les cinq sont recouverts par le
// nouveau découpage : « Le programme génétique » et « L'évolution des espèces »
// deviennent les chapitres 8 et 9, « Le système immunitaire » le chapitre 13,
// « Santé et responsabilité » se répartit entre les chapitres 10, 11 et 14, et
// « Les risques géologiques » devient le chapitre 1. Les laisser en base ferait
// deux objets voisins à deux places différentes. Le ménage est borné à leurs
// cinq titres exacts et au seul niveau 3e — rejoué, il ne trouve plus rien et ne
// touche jamais les 31 fiches neuves.
//
// ⚠️ Le slug reste `svt` et QUATRE modules le portent désormais (`svt-tle` =
// 233, `svt-1re` = 269, `svt-2de` = 285, celui-ci = 292) : ne JAMAIS générer
// avec `--slugs svt`, qui les fusionnerait et réécrirait trois migrations. La
// SVT des autres niveaux vient encore des migrations écrites à la main
// (094 → 142), qui ne doivent plus être régénérées. Toujours `--modules svt-3e`.

export default {
  slug: 'svt',
  nom: 'SVT',

  titreMigration: 'SVT 3e — LE PROGRAMME COMPLET (31 fiches)',

  motif: `CONSTAT : la Troisième n'avait que CINQ chapitres de SVT, hérités du premier
jeu de données de l'app, avec une leçon générique chacun. Le programme du cycle 4
couvre trois grands domaines — la planète Terre et l'action humaine, le vivant et
son évolution, le corps humain et la santé — qui se déplient en 31 fiches. Un
élève de 3e qui révisait la tectonique des plaques, les séismes, le volcanisme,
la dynamique des masses d'air, l'exploitation de l'eau et du pétrole, la
nutrition des animaux et des plantes, la reproduction asexuée, la sélection
naturelle, l'effort physique, la digestion ou la procréation médicalement
assistée ne trouvait RIEN. Cette migration installe les 31 fiches, rangées sous
leurs 14 chapitres, et retire les 5 fiches génériques que ce découpage recouvre.`,

  menage: [
    {
      raison: `La colonne chapters.theme (migration 234) conditionne tout ce qui suit :
ce module range ses 31 fiches sous 14 chapitres, et l'INSERT écrit la colonne.
Elle est REPRISE ici en ADD COLUMN IF NOT EXISTS parce qu'on ne peut pas
garantir que la 234 soit passée en production — sans cette reprise, la migration
échouerait sur "column chapters.theme does not exist", les 5 anciens chapitres
déjà supprimés et les 31 neufs pas encore posés : une matière vide.
Le GRANT n'est pas décoratif : la migration 182 a révoqué le SELECT de table sur
chapters (pour cacher mind_map) et ne l'a rendu que colonne par colonne. Une
colonne ajoutée après elle n'hérite d'aucun droit — sans lui, l'app lirait
"permission denied" au lieu du chapitre.`,
      sql: `ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;`,
    },
    {
      raison: `Les 5 chapitres hérités partent. Tous les cinq sont recouverts par le
nouveau découpage : "Le programme génétique" et "L'évolution des espèces"
deviennent les chapitres 8 et 9, "Le système immunitaire" le chapitre 13,
"Santé et responsabilité" se répartit entre les chapitres 10, 11 et 14, et "Les
risques géologiques" devient le chapitre 1. Les garder en base ferait deux
objets voisins à deux places différentes, un en-tête de section et une ligne
dans la liste.
ATTENTION À L'APOSTROPHE : le titre "L'évolution des espèces" s'écrit dans la
008 avec l'apostrophe DROITE, pas la typographique qu'emploient les fiches
neuves. Un DELETE qui se tromperait de signe ne trouverait rien EN SILENCE.
Le filtre level = '3e' est indispensable : "Le système immunitaire" et
"L'évolution des espèces" ne sont pas des titres uniques dans la base, et le
ménage mordrait sur le lycée.
L'ordre compte : la file "À revoir" d'abord (review_items.item_id n'a PAS de clé
étrangère), puis les quiz (quizzes.lesson_id est ON DELETE SET NULL : ils
survivraient orphelins à leur chapitre, mais toujours tirables par le moteur de
questions), puis les chapitres, dont les leçons partent en cascade.
Le ménage tourne AVANT les insertions à CHAQUE passage : sans la borne des cinq
titres, un rejeu effacerait les quiz des 31 fiches neuves.`,
      sql: `DELETE FROM public.review_items ri
 USING public.quiz_questions qq, public.quizzes qz, public.lessons l,
       public.chapters c, public.subjects s
 WHERE ri.item_kind = 'question'
   AND ri.item_id = qq.id
   AND qq.quiz_id = qz.id
   AND qz.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'svt'
   AND c.level = '3e'
   AND c.title IN ('Le programme génétique',
                   'L''évolution des espèces',
                   'Le système immunitaire',
                   'Santé et responsabilité',
                   'Les risques géologiques');

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'svt'
   AND c.level = '3e'
   AND c.title IN ('Le programme génétique',
                   'L''évolution des espèces',
                   'Le système immunitaire',
                   'Santé et responsabilité',
                   'Les risques géologiques');

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'svt'
   AND c.level = '3e'
   AND c.title IN ('Le programme génétique',
                   'L''évolution des espèces',
                   'Le système immunitaire',
                   'Santé et responsabilité',
                   'Les risques géologiques');`,
    },
  ],

  blocs: [
    {
      niveaux: ['3e'],
      chapitres: [
        // ===================================================================
        // Chapitre 1 : La planète Terre, l'environnement et l'action humaine
        // ===================================================================
        {
          titre: 'La Terre et le système solaire',
          axe: 'La planète Terre, l’environnement et l’action humaine',
          lecon: {
            titre: 'Une planète parmi d’autres, mais habitable',
            cours: `Le **système solaire** s’est formé il y a environ **4,6 milliards d’années** à partir d’un nuage de gaz et de poussières. Au centre, le **Soleil**, une étoile qui produit son énergie par fusion nucléaire ; autour, huit planètes en orbite.

## Deux familles de planètes
- Les planètes **telluriques** (Mercure, Vénus, la Terre, Mars) : petites, rocheuses, denses, proches du Soleil.
- Les planètes **géantes gazeuses** (Jupiter, Saturne) et **glacées** (Uranus, Neptune) : volumineuses, peu denses, entourées d’anneaux et de nombreux satellites.
S’y ajoutent la ceinture d’astéroïdes, les comètes et les planètes naines comme Pluton.

## Les mouvements de la Terre
La Terre tourne sur elle-même en **24 heures** (la **rotation**, qui produit l’alternance jour-nuit) et autour du Soleil en **365,25 jours** (la **révolution**). L’axe de rotation est **incliné de 23,5°** : c’est cette inclinaison, et non la distance au Soleil, qui produit les **saisons**.

> En été, l’hémisphère concerné reçoit les rayons plus à la verticale et pendant plus longtemps : il chauffe davantage.

## Pourquoi la Terre est habitable
- Sa **distance au Soleil** permet l’existence d’eau **liquide**.
- Sa **masse** est suffisante pour retenir une **atmosphère**.
- L’atmosphère assure un **effet de serre naturel** (sans lui, environ −18 °C en moyenne au lieu de +15 °C) et filtre les ultraviolets grâce à la couche d’**ozone**.
- Un **champ magnétique** dévie le vent solaire.
Vénus, trop chaude par emballement de l’effet de serre, et Mars, qui a perdu son atmosphère, montrent à quel point cet équilibre est étroit.

## Le temps long
La Terre a **4,54 milliards d’années**. Les roches, les fossiles et la radioactivité permettent de la dater. À cette échelle, l’humanité n’occupe qu’un instant : rapportée à une année, l’apparition d’*Homo sapiens* tiendrait dans les dernières minutes du 31 décembre.`,
          },
          questions: [
            ['Quel âge a le système solaire ?', ['Environ 4,6 milliards d’années', 'Environ 4,6 millions d’années', 'Environ 13,8 milliards d’années', 'Environ 500 millions d’années'], 0, 'Il s’est formé à partir d’un nuage de gaz et de poussières.'],
            ['Quelles sont les quatre planètes telluriques ?', ['Mercure, Vénus, la Terre, Mars', 'Jupiter, Saturne, Uranus, Neptune', 'La Terre, Mars, Jupiter, Saturne', 'Mercure, la Terre, Jupiter, Pluton'], 0, 'Elles sont rocheuses, denses et proches du Soleil.'],
            ['Qu’est-ce qui provoque l’alternance du jour et de la nuit ?', ['La rotation de la Terre sur elle-même en 24 heures', 'La révolution autour du Soleil', 'L’inclinaison de l’axe', 'Le mouvement de la Lune'], 0, 'La révolution, elle, dure 365,25 jours.'],
            ['Qu’est-ce qui explique les saisons ?', ['L’inclinaison de 23,5° de l’axe de rotation', 'La distance variable au Soleil', 'La rotation de la Lune', 'Les variations de l’activité solaire'], 0, 'Les rayons arrivent plus ou moins à la verticale selon la période.'],
            ['Pourquoi l’eau peut-elle être liquide sur Terre ?', ['Grâce à sa distance au Soleil', 'Grâce à son champ magnétique', 'Grâce à la Lune', 'Grâce à sa vitesse de rotation'], 0, 'Trop près, elle s’évaporerait ; trop loin, elle gèlerait.'],
            ['Quelle serait la température moyenne terrestre sans effet de serre naturel ?', ['Environ −18 °C', 'Environ 0 °C', 'Environ +40 °C', 'Environ −60 °C'], 0, 'Elle est en réalité d’environ +15 °C.'],
            ['Quel gaz atmosphérique filtre une grande partie des ultraviolets ?', ['L’ozone', 'Le dioxyde de carbone', 'L’azote', 'Le méthane'], 0, 'Il forme une couche dans la stratosphère.'],
            ['La Terre est âgée d’environ 4,54 milliards d’années.', ['Vrai', 'Faux'], 0, 'La datation repose notamment sur la radioactivité des roches.'],
          ],
        },
        {
          titre: 'La tectonique des plaques',
          axe: 'La planète Terre, l’environnement et l’action humaine',
          lecon: {
            titre: 'Une surface découpée et mobile',
            cours: `La surface de la Terre n’est pas d’un seul tenant : la **lithosphère** (croûte + partie supérieure du manteau, rigide) est découpée en une douzaine de **plaques** qui se déplacent de quelques **centimètres par an** sur l’**asthénosphère**, plus ductile.

## L’histoire d’une idée
En 1912, **Alfred Wegener** propose la **dérive des continents** : la forme des côtes, les fossiles identiques de part et d’autre de l’Atlantique, la continuité des chaînes de montagnes et les traces glaciaires convergent. Faute d’expliquer le moteur, l’idée est rejetée. Les années 1960 lui donnent raison : cartographie des fonds océaniques, sismologie et **anomalies magnétiques** symétriques de part et d’autre des dorsales démontrent l’**expansion océanique**.

## Trois types de frontières
- **Divergentes** : au niveau des **dorsales océaniques**, deux plaques s’écartent, du magma remonte et crée de la lithosphère neuve. Volcanisme effusif, séismes superficiels.
- **Convergentes** : deux plaques se rapprochent. Une plaque océanique dense plonge sous l’autre (**subduction**) : fosse océanique, séismes profonds, volcanisme explosif. Deux plaques continentales se heurtent (**collision**) : chaînes de montagnes comme l’Himalaya ou les Alpes.
- **Coulissantes** : les plaques glissent l’une contre l’autre le long d’une **faille transformante** (San Andreas) : séismes, pas de volcanisme.

> Ce qui naît aux dorsales disparaît en subduction : la surface de la Terre se **recycle**.

## Le moteur
La chaleur interne, issue de la radioactivité et de la formation de la planète, met le manteau en **convection** lente. Les mouvements de matière entraînent les plaques ; la traction de la plaque plongeante y contribue fortement.

## Ce que cela explique
La répartition des **séismes** et des **volcans** en ceintures étroites (la « ceinture de feu » du Pacifique), la formation des montagnes, l’ouverture et la fermeture des océans, et le déplacement passé des continents (la **Pangée**, il y a environ 250 millions d’années).`,
          },
          questions: [
            ['De quoi est faite la lithosphère ?', ['De la croûte et de la partie supérieure rigide du manteau', 'Du noyau et du manteau', 'De la croûte uniquement', 'De l’asthénosphère uniquement'], 0, 'Elle repose sur l’asthénosphère, plus ductile.'],
            ['À quelle vitesse les plaques se déplacent-elles ?', ['Quelques centimètres par an', 'Quelques mètres par an', 'Quelques millimètres par siècle', 'Quelques kilomètres par an'], 0, 'C’est l’ordre de grandeur de la croissance des ongles.'],
            ['Qui propose la dérive des continents en 1912 ?', ['Alfred Wegener', 'Charles Darwin', 'Louis Pasteur', 'Charles Richter'], 0, 'Son idée est rejetée faute de moteur explicatif.'],
            ['Que se passe-t-il au niveau d’une dorsale océanique ?', ['Deux plaques s’écartent et de la lithosphère neuve se forme', 'Une plaque plonge sous une autre', 'Deux plaques glissent latéralement', 'Deux continents entrent en collision'], 0, 'C’est une frontière divergente.'],
            ['Qu’est-ce qu’une zone de subduction ?', ['Une zone où une plaque océanique plonge sous une autre plaque', 'Une zone où deux plaques s’écartent', 'Une zone sans activité sismique', 'Une zone de faille transformante'], 0, 'Elle s’accompagne de fosses, de séismes profonds et de volcanisme explosif.'],
            ['Que produit la collision de deux plaques continentales ?', ['Une chaîne de montagnes', 'Une fosse océanique', 'Une dorsale', 'Un point chaud'], 0, 'L’Himalaya en est l’exemple actuel.'],
            ['Quel phénomène met le manteau en mouvement ?', ['La convection due à la chaleur interne', 'Le vent solaire', 'La rotation de la Lune', 'Les marées océaniques'], 0, 'La traction de la plaque plongeante y contribue également.'],
            ['La surface de la Terre se recycle : ce qui naît aux dorsales disparaît en subduction.', ['Vrai', 'Faux'], 0, 'La surface totale du globe reste ainsi constante.'],
          ],
        },
        {
          titre: 'Les séismes : causes et risques associés',
          axe: 'La planète Terre, l’environnement et l’action humaine',
          lecon: {
            titre: 'De la rupture de la roche au risque humain',
            cours: `Un **séisme** est une vibration du sol provoquée par une **rupture brutale** des roches en profondeur, le long d’une **faille**.

## Le mécanisme
Sous l’effet des mouvements des plaques, les roches se **déforment** et accumulent de l’énergie élastique. Quand la contrainte dépasse leur résistance, elles **cassent** : l’énergie est libérée d’un coup sous forme d’**ondes sismiques**. Le point de rupture en profondeur est le **foyer** (ou hypocentre) ; le point situé à sa verticale en surface est l’**épicentre**, là où les dégâts sont en général maximaux. Des **répliques** suivent souvent la secousse principale.

## Mesurer un séisme
- La **magnitude** (échelle de Richter, puis magnitude de moment) mesure l’**énergie libérée**. Elle est **logarithmique** : +1 de magnitude correspond à environ 30 fois plus d’énergie. Il n’y a qu’une magnitude par séisme.
- L’**intensité** (échelle MSK ou EMS) mesure les **effets ressentis et observés** en un lieu donné : elle varie d’un endroit à l’autre pour un même séisme.

> Un séisme de magnitude modérée peut faire plus de victimes qu’un séisme puissant, si les constructions sont fragiles et la population dense.

## Risque, aléa, vulnérabilité
Le **risque** est le croisement d’un **aléa** (la probabilité qu’un séisme se produise) et d’une **vulnérabilité** (des personnes, des bâtiments, des activités exposés). On ne peut pas agir sur l’aléa ; on peut réduire la vulnérabilité.

## Prévoir et prévenir
On ne sait pas **prédire** la date d’un séisme. On peut en revanche :
- cartographier les **zones sismiques** et les failles actives ;
- imposer des **normes parasismiques** aux constructions ;
- surveiller en continu par des réseaux de **sismographes** ;
- éduquer la population aux bons réflexes et organiser les secours ;
- alerter en cas de **tsunami**, quand un séisme sous-marin déplace la colonne d’eau.

## En France
La sismicité est modérée mais réelle : Alpes, Pyrénées, Provence, Alsace, et forte aux Antilles, où les normes parasismiques sont obligatoires.`,
          },
          questions: [
            ['Quelle est la cause d’un séisme ?', ['La rupture brutale de roches le long d’une faille', 'Une éruption volcanique systématique', 'Le passage d’une comète', 'Le réchauffement de l’atmosphère'], 0, 'Les roches accumulent de l’énergie avant de casser.'],
            ['Comment appelle-t-on le point de rupture en profondeur ?', ['Le foyer', 'L’épicentre', 'La faille', 'La dorsale'], 0, 'L’épicentre est le point situé à sa verticale en surface.'],
            ['Que mesure la magnitude ?', ['L’énergie libérée par le séisme', 'Les dégâts observés en un lieu', 'La profondeur du foyer', 'La durée de la secousse'], 0, 'Il n’y a qu’une seule magnitude par séisme.'],
            ['Que mesure l’intensité ?', ['Les effets ressentis et observés en un lieu donné', 'L’énergie totale libérée', 'La vitesse des ondes', 'La longueur de la faille'], 0, 'Elle varie d’un endroit à l’autre pour un même séisme.'],
            ['Que représente une augmentation de 1 sur l’échelle de magnitude ?', ['Environ 30 fois plus d’énergie libérée', 'Deux fois plus d’énergie', 'Dix fois plus de victimes', 'Une secousse deux fois plus longue'], 0, 'L’échelle est logarithmique.'],
            ['Comment définit-on le risque sismique ?', ['Le croisement d’un aléa et d’une vulnérabilité', 'La magnitude du dernier séisme', 'Le nombre de failles actives', 'La profondeur moyenne des foyers'], 0, 'On agit sur la vulnérabilité, pas sur l’aléa.'],
            ['Quelle mesure réduit efficacement les dégâts d’un séisme ?', ['Les normes parasismiques de construction', 'La prédiction exacte de la date', 'L’interdiction des sismographes', 'Le comblement des failles'], 0, 'On ne sait pas prédire la date d’un séisme.'],
            ['Un séisme sous-marin peut déclencher un tsunami.', ['Vrai', 'Faux'], 0, 'Le déplacement du fond met en mouvement toute la colonne d’eau.'],
          ],
        },
        {
          titre: 'Volcanisme et risques associés',
          axe: 'La planète Terre, l’environnement et l’action humaine',
          lecon: {
            titre: 'Deux types d’éruptions, deux dangers',
            cours: `Le **volcanisme** est l’arrivée en surface de **magma**, une roche fondue formée en profondeur. Le magma s’accumule dans un **réservoir**, remonte par une **cheminée** et sort par un **cratère**.

## Ce qui décide du type d’éruption
Tout tient à la **viscosité** du magma et à sa teneur en **gaz** dissous.
- Un magma **fluide**, pauvre en silice, laisse les gaz s’échapper facilement : l’éruption est **effusive**. Des **coulées de lave** s’écoulent, parfois sur des kilomètres, et des fontaines de lave jaillissent. Exemples : Piton de la Fournaise, volcans d’Hawaï, Islande.
- Un magma **visqueux**, riche en silice, retient les gaz jusqu’à la rupture : l’éruption est **explosive**. Elle projette des **cendres**, des blocs, et produit des **nuées ardentes** (mélange brûlant de gaz et de particules dévalant les pentes à plusieurs centaines de km/h). Exemples : montagne Pelée, Vésuve, Merapi.

> Le magma fluide fait des coulées qu’on peut souvent fuir ; le magma visqueux fait des nuées ardentes qu’on ne peut pas fuir.

## Où sont les volcans ?
Ils se concentrent le long des frontières de plaques : volcanisme **effusif** aux dorsales et aux rifts, **explosif** dans les zones de **subduction** (ceinture de feu du Pacifique). Certains apparaissent loin de toute frontière, au-dessus d’un **point chaud** (Hawaï, La Réunion).

## Les risques
Coulées de lave, nuées ardentes, retombées de cendres (toits effondrés, trafic aérien interrompu), **lahars** (coulées de boue), gaz toxiques, tsunamis en cas d’effondrement.

## Prévoir et se protéger
Contrairement aux séismes, une éruption est souvent **précédée de signes** : petits séismes, gonflement de l’édifice mesuré par GPS et inclinomètres, changement de composition des gaz, hausse de température. Les **observatoires volcanologiques** surveillent en continu, définissent des niveaux d’alerte et préparent les **plans d’évacuation** — c’est ce qui a sauvé des dizaines de milliers de vies au Pinatubo en 1991.`,
          },
          questions: [
            ['Qu’est-ce que le magma ?', ['De la roche fondue formée en profondeur', 'De la lave refroidie en surface', 'Un mélange de cendres et d’eau', 'Un gaz volcanique'], 0, 'On parle de lave une fois qu’il est sorti.'],
            ['Qu’est-ce qui détermine le type d’éruption ?', ['La viscosité du magma et sa teneur en gaz', 'La hauteur du volcan', 'La saison', 'La proximité de la mer'], 0, 'Un magma visqueux retient les gaz jusqu’à l’explosion.'],
            ['Quel type d’éruption produit des coulées de lave ?', ['L’éruption effusive', 'L’éruption explosive', 'L’éruption phréatique', 'Aucune'], 0, 'Le magma fluide laisse les gaz s’échapper.'],
            ['Qu’est-ce qu’une nuée ardente ?', ['Un mélange brûlant de gaz et de particules qui dévale les pentes', 'Une coulée de lave lente', 'Un nuage de vapeur d’eau', 'Une pluie de cendres froides'], 0, 'Elle progresse à plusieurs centaines de kilomètres par heure.'],
            ['Où se situe le volcanisme explosif ?', ['Dans les zones de subduction', 'Aux dorsales océaniques', 'Uniquement aux points chauds', 'Au centre des continents stables'], 0, 'La ceinture de feu du Pacifique en est l’exemple.'],
            ['Qu’est-ce qu’un point chaud ?', ['Une remontée de magma indépendante des frontières de plaques', 'Une zone de collision continentale', 'Une faille transformante', 'Une fosse océanique'], 0, 'Hawaï et La Réunion en sont des exemples.'],
            ['Quel signe annonce souvent une éruption ?', ['Le gonflement de l’édifice volcanique', 'Une baisse de la température du sol', 'L’arrêt de toute activité sismique', 'Une hausse du niveau de la mer'], 0, 'GPS et inclinomètres le mesurent en continu.'],
            ['Contrairement aux séismes, les éruptions sont souvent précédées de signes détectables.', ['Vrai', 'Faux'], 0, 'C’est ce qui rend l’évacuation possible, comme au Pinatubo en 1991.'],
          ],
        },

        // ===================================================================
        // Chapitre 2 : Le climat et la météorologie
        // ===================================================================
        {
          titre: 'La dynamique des masses d’air et d’eau',
          axe: 'Le climat et la météorologie',
          lecon: {
            titre: 'Le moteur solaire de l’atmosphère et des océans',
            cours: `L’atmosphère et les océans sont en mouvement permanent. Le moteur est toujours le même : le **rayonnement solaire** chauffe la Terre de façon **inégale** selon la latitude.

## Un chauffage inégal
À l’**équateur**, les rayons arrivent presque à la verticale : l’énergie se concentre sur une petite surface. Aux **pôles**, ils arrivent très inclinés et se répartissent sur une grande surface, en traversant plus d’atmosphère. Il en résulte un **excédent** d’énergie aux basses latitudes et un **déficit** aux hautes latitudes. Les circulations d’air et d’eau **redistribuent** cette chaleur.

## La circulation atmosphérique
L’air chaud est moins dense : il **s’élève**, ce qui crée une zone de **basse pression** (dépression) ; l’air froid, plus dense, **descend** et crée une **haute pression** (anticyclone). Le **vent** est simplement de l’air qui se déplace de la haute vers la basse pression. La rotation de la Terre dévie ces mouvements (**force de Coriolis**), ce qui organise l’atmosphère en grandes cellules et en vents dominants (alizés, vents d’ouest).

> Météo et climat ne sont pas la même chose : la **météo** décrit le temps qu’il fait sur quelques jours, le **climat** décrit les moyennes et la variabilité sur au moins trente ans.

## Les courants océaniques
En surface, les **courants** sont entraînés par les vents : le **Gulf Stream** transporte de l’eau chaude vers l’Atlantique nord et adoucit le climat de l’Europe de l’Ouest. En profondeur, les différences de **température** et de **salinité** créent la **circulation thermohaline**, un immense tapis roulant qui met environ mille ans à boucler son parcours.

## Les phénomènes météorologiques
La rencontre de masses d’air aux caractéristiques différentes forme des **fronts**, à l’origine des perturbations. L’évaporation, la condensation en nuages et les précipitations constituent le **cycle de l’eau**. Les **cyclones tropicaux** naissent au-dessus d’océans chauds (plus de 26 °C) et libèrent une énergie considérable.

## Prévoir le temps
Satellites, stations au sol, ballons-sondes et bouées alimentent des **modèles numériques**. La prévision est fiable à quelques jours, mais l’atmosphère est un système **chaotique** : au-delà d’environ deux semaines, la prévision détaillée devient impossible.`,
          },
          questions: [
            ['Pourquoi l’équateur reçoit-il plus d’énergie solaire que les pôles ?', ['Les rayons y arrivent presque à la verticale', 'L’équateur est plus proche du Soleil', 'L’atmosphère y est absente', 'Le sol y est plus sombre'], 0, 'Aux pôles, la même énergie se répartit sur une plus grande surface.'],
            ['Qu’est-ce qu’une dépression ?', ['Une zone de basse pression où l’air s’élève', 'Une zone de haute pression où l’air descend', 'Un courant océanique froid', 'Une masse d’air sèche'], 0, 'L’air chaud, moins dense, monte.'],
            ['Qu’est-ce que le vent ?', ['De l’air qui se déplace de la haute vers la basse pression', 'Un mouvement vertical de l’océan', 'Une variation de température du sol', 'Un phénomène lié aux marées'], 0, 'La force de Coriolis dévie ensuite ce déplacement.'],
            ['Quelle différence entre météo et climat ?', ['La météo décrit quelques jours, le climat des moyennes sur au moins trente ans', 'La météo concerne l’océan, le climat l’atmosphère', 'La météo est mondiale, le climat local', 'Il n’y a aucune différence'], 0, 'Confondre les deux est l’erreur la plus fréquente.'],
            ['Quel courant chaud adoucit le climat de l’Europe de l’Ouest ?', ['Le Gulf Stream', 'Le courant de Humboldt', 'Le courant du Labrador', 'Le courant circumpolaire'], 0, 'Il transporte de l’eau chaude vers l’Atlantique nord.'],
            ['Qu’est-ce que la circulation thermohaline ?', ['Une circulation profonde liée à la température et à la salinité', 'Un vent d’altitude', 'Un courant de surface entraîné par les vents', 'Un cycle des saisons'], 0, 'Son parcours complet dure environ mille ans.'],
            ['À quelle condition de température océanique naissent les cyclones tropicaux ?', ['Au-dessus de 26 °C', 'Au-dessus de 15 °C', 'En dessous de 10 °C', 'La température n’intervient pas'], 0, 'L’évaporation intense fournit leur énergie.'],
            ['La prévision météorologique détaillée devient impossible au-delà d’environ deux semaines.', ['Vrai', 'Faux'], 0, 'L’atmosphère est un système chaotique.'],
          ],
        },
        {
          titre: 'L’évolution du climat, les risques climatiques et météorologiques',
          axe: 'Le climat et la météorologie',
          lecon: {
            titre: 'Un réchauffement rapide et ses conséquences',
            cours: `Le climat de la Terre a toujours varié : alternance de périodes **glaciaires** et **interglaciaires**, liée notamment aux variations de l’orbite terrestre (**paramètres de Milankovitch**), à l’activité volcanique et à la teneur de l’atmosphère en gaz à effet de serre. Ces variations naturelles s’étalent sur des **dizaines de milliers d’années**.

## Ce qui est différent aujourd’hui
Depuis l’ère industrielle, la température moyenne mondiale a augmenté d’environ **1,1 à 1,2 °C**, et la **vitesse** de ce réchauffement n’a pas d’équivalent connu. La cause est identifiée : les **émissions de gaz à effet de serre** d’origine humaine — **CO₂** (combustibles fossiles, déforestation, ciment), **méthane** (élevage, rizières, fuites de gaz), **protoxyde d’azote** (engrais).

## L’effet de serre, naturel puis renforcé
Les gaz à effet de serre laissent passer le rayonnement solaire et retiennent une partie du rayonnement infrarouge renvoyé par le sol. Naturel, cet effet rend la Terre habitable ; **renforcé** par les activités humaines, il déséquilibre le bilan énergétique de la planète.

## Comment le sait-on ?
Les **carottes de glace** du Groenland et de l’Antarctique piègent des bulles d’air vieilles de 800 000 ans : on y lit directement la teneur passée en CO₂. S’y ajoutent les sédiments, les pollens, les cernes des arbres et, depuis 1850, les mesures directes.

## Les conséquences
- Hausse du **niveau des mers** (dilatation de l’eau, fonte des glaciers et des calottes).
- **Fonte** de la banquise arctique et du **permafrost**.
- **Acidification** des océans par dissolution du CO₂.
- Multiplication et intensification des **événements extrêmes** : canicules, sécheresses, incendies, pluies diluviennes, cyclones plus intenses.
- Déplacement des aires de répartition des espèces, perte de récoltes, migrations.

> Le climat ne réagit pas instantanément : une partie du réchauffement à venir est déjà engagée par les émissions passées.

## Agir
L’**atténuation** réduit les émissions (énergies décarbonées, sobriété, transports, isolation, alimentation, reforestation). L’**adaptation** réduit la vulnérabilité (digues, urbanisme, alerte, cultures adaptées). L’**accord de Paris** (2015) fixe l’objectif de contenir le réchauffement nettement en dessous de 2 °C.`,
          },
          questions: [
            ['Quelle est la cause principale du réchauffement climatique actuel ?', ['Les émissions humaines de gaz à effet de serre', 'Les variations de l’orbite terrestre', 'L’activité volcanique récente', 'La fonte naturelle des glaciers'], 0, 'CO₂, méthane et protoxyde d’azote en sont les principaux.'],
            ['De combien la température moyenne mondiale a-t-elle augmenté depuis l’ère industrielle ?', ['Environ 1,1 à 1,2 °C', 'Environ 5 °C', 'Environ 0,1 °C', 'Environ 3 °C'], 0, 'C’est la vitesse de ce réchauffement qui est inédite.'],
            ['Comment connaît-on la teneur en CO₂ de l’atmosphère il y a 800 000 ans ?', ['Grâce aux bulles d’air piégées dans les carottes de glace', 'Grâce aux relevés météorologiques anciens', 'Grâce aux textes historiques', 'Grâce aux satellites'], 0, 'Groenland et Antarctique conservent ces archives.'],
            ['Qu’est-ce que l’effet de serre ?', ['Des gaz retiennent une partie du rayonnement infrarouge renvoyé par le sol', 'Une couche qui bloque le rayonnement solaire', 'Un phénomène uniquement urbain', 'Un effet du champ magnétique'], 0, 'Naturel, il rend la Terre habitable ; renforcé, il la réchauffe.'],
            ['Quelles causes expliquent la hausse du niveau des mers ?', ['La dilatation de l’eau et la fonte des glaciers et calottes', 'La fonte de la banquise flottante uniquement', 'L’augmentation des précipitations', 'L’acidification des océans'], 0, 'La banquise, déjà flottante, ne fait pas monter le niveau en fondant.'],
            ['Qu’est-ce que l’acidification des océans ?', ['La baisse du pH due à la dissolution du CO₂', 'Le rejet d’acides industriels', 'La hausse de la salinité', 'Le réchauffement des eaux de surface'], 0, 'Elle fragilise les organismes à coquille et les coraux.'],
            ['Quelle différence entre atténuation et adaptation ?', ['L’atténuation réduit les émissions, l’adaptation réduit la vulnérabilité', 'L’atténuation est locale, l’adaptation mondiale', 'L’atténuation concerne l’eau, l’adaptation l’air', 'Les deux mots sont synonymes'], 0, 'Les deux stratégies sont complémentaires.'],
            ['L’accord de Paris de 2015 vise à contenir le réchauffement nettement en dessous de 2 °C.', ['Vrai', 'Faux'], 0, 'Avec l’ambition de le limiter à 1,5 °C.'],
          ],
        },

        // ===================================================================
        // Chapitre 3 : L'exploitation des ressources naturelles
        // ===================================================================
        {
          titre: 'L’exploitation de l’eau',
          axe: 'L’exploitation des ressources naturelles',
          lecon: {
            titre: 'Une ressource abondante et pourtant rare',
            cours: `L’eau couvre 70 % de la surface du globe, mais **97,5 %** de ce volume est **salé**. Sur les 2,5 % d’eau douce restants, l’essentiel est immobilisé dans les glaces et les nappes profondes : l’eau douce **accessible** représente moins de 1 % du total.

## Le cycle de l’eau
Le Soleil fait **s’évaporer** l’eau des océans et des sols ; la vapeur se **condense** en nuages ; les **précipitations** la restituent. Une partie **ruisselle** vers les rivières, une autre **s’infiltre** et alimente les **nappes phréatiques**. La ressource est donc **renouvelable**, mais à un rythme qui ne dépend pas de nous.

## Comment on la prélève
Captage de **sources**, pompage en **rivière**, **forages** dans les nappes, retenues de **barrages**, et — là où il n’y a rien d’autre — **dessalement** de l’eau de mer, très coûteux en énergie.

## Qui la consomme ?
À l’échelle mondiale, environ **70 %** des prélèvements vont à l’**agriculture** (irrigation), **20 %** à l’**industrie** et **10 %** aux **usages domestiques**. Un Français utilise environ 150 litres par jour à la maison, dont une part infime pour boire.

> L’**eau virtuelle** est celle qu’il a fallu pour produire un bien : environ 15 000 litres pour un kilo de bœuf, 2 700 litres pour un tee-shirt en coton. Notre consommation réelle dépasse largement le robinet.

## Rendre l’eau potable
Une **station de potabilisation** enchaîne dégrillage, floculation-décantation, filtration sur sable, filtration sur charbon actif et **désinfection** (chlore ou ozone). Après usage, une **station d’épuration** traite les eaux usées par voie mécanique puis biologique avant de les rejeter dans le milieu.

## Les pressions sur la ressource
**Surexploitation** des nappes (niveau qui baisse plus vite qu’il ne se recharge), **pollutions** agricoles (nitrates, pesticides), industrielles et domestiques, **salinisation** des nappes côtières, **conflits d’usage** entre agriculture, industrie, tourisme et particuliers, et sécheresses plus fréquentes avec le changement climatique.

## Économiser
Réparer les fuites des réseaux (elles peuvent dépasser 20 % de l’eau distribuée), irriguer au goutte-à-goutte, recycler les eaux industrielles, récupérer l’eau de pluie, protéger les zones de captage.`,
          },
          questions: [
            ['Quelle part de l’eau de la planète est salée ?', ['Environ 97,5 %', 'Environ 70 %', 'Environ 50 %', 'Environ 30 %'], 0, 'L’eau douce accessible représente moins de 1 % du total.'],
            ['Qu’est-ce qu’une nappe phréatique ?', ['Une réserve d’eau souterraine alimentée par l’infiltration', 'Un lac artificiel de barrage', 'Une couche de glace continentale', 'Un bras de rivière souterrain unique'], 0, 'Elle se recharge lentement par les précipitations.'],
            ['Quel secteur consomme le plus d’eau dans le monde ?', ['L’agriculture, avec environ 70 % des prélèvements', 'L’industrie', 'Les usages domestiques', 'La production d’électricité'], 0, 'L’irrigation en représente l’essentiel.'],
            ['Qu’est-ce que l’eau virtuelle ?', ['L’eau nécessaire à la production d’un bien', 'L’eau des nappes profondes', 'L’eau de pluie non captée', 'L’eau perdue par évaporation'], 0, 'Environ 15 000 litres pour un kilo de bœuf.'],
            ['Quelle étape termine la potabilisation de l’eau ?', ['La désinfection au chlore ou à l’ozone', 'La floculation', 'Le dégrillage', 'La décantation'], 0, 'Elle élimine les micro-organismes restants.'],
            ['À quoi sert une station d’épuration ?', ['À traiter les eaux usées avant leur rejet dans le milieu', 'À rendre l’eau potable', 'À dessaler l’eau de mer', 'À stocker l’eau de pluie'], 0, 'Le traitement est mécanique puis biologique.'],
            ['Qu’appelle-t-on surexploitation d’une nappe ?', ['Un prélèvement plus rapide que sa recharge naturelle', 'Une pollution par les nitrates', 'Un captage interdit', 'Une baisse de la pluviométrie'], 0, 'Le niveau de la nappe baisse durablement.'],
            ['Les fuites des réseaux de distribution peuvent dépasser 20 % de l’eau transportée.', ['Vrai', 'Faux'], 0, 'Leur réparation est l’un des premiers gisements d’économie.'],
          ],
        },
        {
          titre: 'L’exploitation du pétrole',
          axe: 'L’exploitation des ressources naturelles',
          lecon: {
            titre: 'Une énergie fossile, donc non renouvelable',
            cours: `Le **pétrole** est une **énergie fossile** : il provient de la transformation, sur des **millions d’années**, de matière organique (plancton, algues) accumulée au fond des mers.

## Comment il se forme
Quatre conditions doivent être réunies :
1. une **roche mère** riche en matière organique, déposée en milieu pauvre en oxygène ;
2. un **enfouissement** progressif sous des sédiments, qui élève la température et la pression ;
3. la **migration** des hydrocarbures formés vers le haut, à travers une roche poreuse (**roche réservoir**) ;
4. une **roche couverture** imperméable qui les **piège** et les empêche de s’échapper.
Sans le piège, pas de gisement exploitable.

> Le pétrole met des millions d’années à se former et quelques décennies à se consommer : c’est ce qui le rend **non renouvelable** à l’échelle humaine.

## De la prospection au produit
La **prospection** utilise la géologie et surtout la **sismique réflexion** (des ondes envoyées dans le sous-sol et leurs échos analysés). Vient ensuite le **forage**, à terre ou en mer, puis l’**extraction**, le **transport** (oléoducs, pétroliers) et le **raffinage**. La **distillation fractionnée** sépare le brut selon les températures d’ébullition : gaz, essences, kérosène, gazole, fiouls, bitumes.

## À quoi il sert
Aux **carburants** (transport routier, aérien, maritime), au **chauffage**, et à la **pétrochimie** : plastiques, textiles synthétiques, engrais, médicaments, cosmétiques, peintures. Sortir du pétrole ne concerne donc pas que les voitures.

## Les problèmes
- **Épuisement** : les réserves sont finies et inégalement réparties.
- **Climat** : la combustion libère du **CO₂**, principal gaz à effet de serre d’origine humaine.
- **Pollutions** : marées noires, dégazages, fuites, torchage, pollution de l’air (particules, oxydes d’azote).
- **Géopolitique** : dépendance des pays importateurs, volatilité des prix, conflits.

## Les alternatives
Énergies **renouvelables** (solaire, éolien, hydraulique, biomasse, géothermie), nucléaire, sobriété et efficacité énergétiques, recyclage des plastiques, développement des transports collectifs. Aucune ne remplace le pétrole à elle seule : c’est la combinaison qui compte.`,
          },
          questions: [
            ['De quoi provient le pétrole ?', ['De la transformation de matière organique marine sur des millions d’années', 'De la fusion des roches du manteau', 'De la décomposition rapide de déchets végétaux', 'De réactions chimiques dans l’atmosphère'], 0, 'Plancton et algues en sont à l’origine.'],
            ['Qu’est-ce qu’une roche mère ?', ['Une roche riche en matière organique où se forme le pétrole', 'Une roche imperméable qui piège le pétrole', 'Une roche poreuse où le pétrole s’accumule', 'Une roche volcanique'], 0, 'La roche réservoir accueille ensuite les hydrocarbures.'],
            ['Quel est le rôle de la roche couverture ?', ['Empêcher les hydrocarbures de s’échapper vers la surface', 'Produire la matière organique', 'Faciliter la migration', 'Chauffer le gisement'], 0, 'Sans piège, pas de gisement exploitable.'],
            ['Quelle méthode sert principalement à la prospection pétrolière ?', ['La sismique réflexion', 'La radiographie', 'L’analyse des marées', 'Le magnétisme terrestre uniquement'], 0, 'Les échos d’ondes envoyées dans le sous-sol dessinent les structures.'],
            ['Quel procédé sépare les composants du pétrole brut ?', ['La distillation fractionnée', 'La filtration sur sable', 'La décantation', 'L’électrolyse'], 0, 'Elle exploite les différences de température d’ébullition.'],
            ['Pourquoi le pétrole est-il dit non renouvelable ?', ['Il met des millions d’années à se former et se consomme en quelques décennies', 'Il ne se forme plus du tout aujourd’hui', 'Il est interdit d’en extraire', 'Il n’en existe qu’un seul gisement'], 0, 'L’échelle de temps de formation est sans rapport avec celle de la consommation.'],
            ['Quel gaz la combustion du pétrole libère-t-elle principalement ?', ['Le dioxyde de carbone', 'L’ozone', 'Le diazote', 'L’hélium'], 0, 'C’est le principal gaz à effet de serre d’origine humaine.'],
            ['Le pétrole ne sert qu’à produire des carburants.', ['Vrai', 'Faux'], 1, 'La pétrochimie en tire plastiques, textiles, engrais et médicaments.'],
          ],
        },

        // ===================================================================
        // Chapitre 4 : Écosystèmes et activités humaines
        // ===================================================================
        {
          titre: 'Le changement climatique et les écosystèmes',
          axe: 'Écosystèmes et activités humaines',
          lecon: {
            titre: 'Quand le climat bouge plus vite que le vivant',
            cours: `Un **écosystème** est l’ensemble formé par un **milieu** (la biocénose vit dans un biotope) et par les **êtres vivants** qui l’occupent, avec toutes leurs relations : alimentation, compétition, coopération, reproduction.

## Ce que le réchauffement modifie
- Les **aires de répartition** se déplacent : vers le nord dans l’hémisphère nord, et vers l’altitude en montagne. Les espèces de haute montagne, qui n’ont plus où monter, sont menacées.
- La **phénologie** change : floraisons plus précoces, arrivée décalée des migrateurs, éclosion des insectes en avance.
- Des **désynchronisations** apparaissent : si les chenilles éclosent avant l’arrivée des oiseaux qui s’en nourrissent, les nichées manquent de nourriture.
- Les **coraux blanchissent** : au-delà d’un seuil de température, ils expulsent les algues symbiotiques qui les nourrissent, et meurent si l’épisode dure.
- L’**acidification** des océans fragilise les organismes à coquille et à squelette calcaire.

> Le problème n’est pas seulement l’ampleur du changement, c’est sa **vitesse** : beaucoup d’espèces ne peuvent ni se déplacer ni s’adapter aussi vite.

## Les réponses possibles du vivant
Trois issues, et une seule est bonne : **se déplacer**, **s’adapter** (par sélection naturelle, sur plusieurs générations), ou **disparaître** localement. Les espèces à génération courte et à forte descendance s’en tirent mieux.

## Les effets en chaîne
Un écosystème est un réseau : la disparition d’une espèce **clé de voûte** en entraîne d’autres. La fonte du permafrost libère du méthane, qui renforce le réchauffement — c’est une **rétroaction positive**, un effet qui amplifie sa propre cause.

## Ce que les écosystèmes nous rendent
Ce sont les **services écosystémiques** : pollinisation des cultures, épuration de l’eau, stockage de carbone par les forêts et les océans, protection des côtes par les mangroves et les récifs, fertilité des sols, ressources alimentaires et médicinales.

## Protéger
Aires protégées, **corridors écologiques** qui permettent aux espèces de se déplacer, restauration des zones humides et des forêts, réduction des autres pressions (pollution, surexploitation) pour laisser aux écosystèmes une chance de s’adapter.`,
          },
          questions: [
            ['Qu’est-ce qu’un écosystème ?', ['Un milieu et l’ensemble des êtres vivants qui l’occupent, avec leurs relations', 'Une population d’une seule espèce', 'Un climat régional', 'Une réserve naturelle protégée'], 0, 'Il associe un biotope et une biocénose.'],
            ['Dans quel sens se déplacent les aires de répartition avec le réchauffement ?', ['Vers le nord et vers l’altitude dans l’hémisphère nord', 'Vers le sud et vers le niveau de la mer', 'Elles ne se déplacent pas', 'De façon aléatoire'], 0, 'Les espèces de haute montagne n’ont plus où monter.'],
            ['Qu’est-ce qu’une désynchronisation écologique ?', ['Un décalage entre deux espèces dépendantes, comme les oiseaux et leurs proies', 'Une extinction simultanée', 'Une migration groupée', 'Un changement de régime alimentaire'], 0, 'Les nichées peuvent alors manquer de nourriture.'],
            ['Pourquoi les coraux blanchissent-ils ?', ['Ils expulsent les algues symbiotiques qui les nourrissent quand l’eau est trop chaude', 'Ils perdent leur squelette calcaire', 'Ils sont recouverts de sédiments', 'Ils manquent de lumière'], 0, 'Si l’épisode dure, ils meurent.'],
            ['Quelles sont les trois réponses possibles d’une espèce au changement climatique ?', ['Se déplacer, s’adapter ou disparaître localement', 'Hiberner, migrer ou muter instantanément', 'Se reproduire plus, manger plus ou dormir plus', 'Changer d’espèce'], 0, 'Une seule de ces issues est favorable.'],
            ['Qu’est-ce qu’une rétroaction positive ?', ['Un effet qui amplifie sa propre cause', 'Un effet qui annule sa cause', 'Une conséquence bénéfique pour l’écosystème', 'Une adaptation réussie'], 0, 'La fonte du permafrost libère du méthane, qui réchauffe davantage.'],
            ['Qu’appelle-t-on services écosystémiques ?', ['Les bénéfices que les écosystèmes apportent aux sociétés humaines', 'Les mesures de protection des espèces', 'Les inventaires de biodiversité', 'Les subventions agricoles'], 0, 'Pollinisation, épuration de l’eau, stockage de carbone.'],
            ['Les corridors écologiques permettent aux espèces de se déplacer entre milieux favorables.', ['Vrai', 'Faux'], 0, 'Ils sont essentiels quand les aires de répartition se déplacent.'],
          ],
        },
        {
          titre: 'Les impacts globaux de l’activité humaine',
          axe: 'Écosystèmes et activités humaines',
          lecon: {
            titre: 'Une empreinte à l’échelle de la planète',
            cours: `Depuis deux siècles, l’humanité modifie la planète à une échelle telle que certains scientifiques parlent d’**Anthropocène**, une époque géologique marquée par l’action humaine.

## Les grandes pressions
- **Changement climatique** : émissions de gaz à effet de serre.
- **Destruction et fragmentation des habitats** : déforestation, urbanisation, artificialisation des sols, drainage des zones humides.
- **Surexploitation** : surpêche, coupes forestières, prélèvement excessif dans les nappes.
- **Pollutions** : plastiques, pesticides, nitrates, métaux lourds, air, bruit, lumière.
- **Espèces invasives** transportées par le commerce mondial.
Ces cinq pressions agissent ensemble, et leurs effets se cumulent.

## L’érosion de la biodiversité
Le taux d’extinction actuel est estimé de **100 à 1 000 fois** supérieur au taux naturel : on parle de **sixième extinction de masse**. La biodiversité se perd à trois niveaux : la diversité des **écosystèmes**, celle des **espèces** et celle des **gènes** au sein d’une espèce — cette dernière, invisible, conditionne la capacité future à s’adapter.

> Une espèce disparue ne revient pas : la perte est **irréversible**, à la différence d’une pollution qui peut être traitée.

## Mesurer l’impact
L’**empreinte écologique** évalue la surface nécessaire pour produire ce qu’une population consomme et absorber ses déchets. Le **jour du dépassement** marque la date à laquelle l’humanité a consommé ce que la planète peut renouveler en un an : il tombe chaque année plus tôt. L’**empreinte carbone** mesure les émissions liées à un mode de vie.

## Développement durable
Il vise à concilier trois piliers : **économique**, **social** et **environnemental**, en répondant aux besoins du présent sans compromettre ceux des générations futures. Sur le terrain : économie **circulaire** (réduire, réutiliser, réparer, recycler), agroécologie, énergies renouvelables, transports collectifs, protection d’aires naturelles, restauration des milieux.

## Ce qui marche déjà
Le protocole de Montréal (1987) a réduit les gaz destructeurs d’**ozone** et la couche se reconstitue ; des espèces ont été sauvées par des plans de protection ; des rivières autrefois mortes ont retrouvé des poissons. Les décisions collectives produisent des effets mesurables.`,
          },
          questions: [
            ['Que désigne le terme Anthropocène ?', ['Une époque géologique marquée par l’action humaine sur la planète', 'La période des grandes glaciations', 'L’ère des dinosaures', 'Le début de l’agriculture'], 0, 'Le terme souligne l’ampleur de l’empreinte humaine.'],
            ['Quelles sont les grandes pressions sur la biodiversité ?', ['Climat, destruction des habitats, surexploitation, pollutions, espèces invasives', 'Uniquement le changement climatique', 'Uniquement la chasse', 'Uniquement la pollution plastique'], 0, 'Leurs effets se cumulent.'],
            ['De combien le taux d’extinction actuel dépasse-t-il le taux naturel ?', ['De 100 à 1 000 fois', 'De 2 à 3 fois', 'De 10 000 fois', 'Il est identique'], 0, 'On parle de sixième extinction de masse.'],
            ['À quels niveaux la biodiversité se mesure-t-elle ?', ['Écosystèmes, espèces et gènes', 'Continents, pays et régions', 'Plantes, animaux et champignons', 'Terre, mer et air'], 0, 'La diversité génétique conditionne la capacité future à s’adapter.'],
            ['Qu’est-ce que l’empreinte écologique ?', ['La surface nécessaire pour produire ce qu’on consomme et absorber ses déchets', 'La quantité de déchets produits par jour', 'Le nombre d’espèces disparues', 'La superficie des aires protégées'], 0, 'Le jour du dépassement en est une traduction calendaire.'],
            ['Quels sont les trois piliers du développement durable ?', ['Économique, social et environnemental', 'Politique, militaire et culturel', 'Agricole, industriel et tertiaire', 'Local, national et mondial'], 0, 'Il s’agit de répondre au présent sans compromettre l’avenir.'],
            ['Que vise l’économie circulaire ?', ['Réduire, réutiliser, réparer et recycler', 'Produire davantage à coût constant', 'Délocaliser la production', 'Augmenter la consommation de matières premières'], 0, 'Elle s’oppose au modèle extraire-produire-jeter.'],
            ['Le protocole de Montréal a permis à la couche d’ozone de se reconstituer.', ['Vrai', 'Faux'], 0, 'C’est l’exemple type d’une décision collective aux effets mesurables.'],
          ],
        },

        // ===================================================================
        // Chapitre 5 : Nutrition et organisation des animaux
        // ===================================================================
        {
          titre: 'Les besoins nutritifs des cellules et l’organisation des organes chez les êtres vivants',
          axe: 'Nutrition et organisation des animaux',
          lecon: {
            titre: 'Ce que chaque cellule réclame, et comment le corps le fournit',
            cours: `Toutes les cellules de l’organisme, quelle que soit leur spécialité, ont les mêmes besoins fondamentaux : du **dioxygène**, des **nutriments** (glucose, acides aminés, acides gras), de l’**eau**, des **sels minéraux** et des **vitamines**.

## Pourquoi ces besoins
Le **glucose** et le **dioxygène** permettent la **respiration cellulaire**, qui libère l’énergie nécessaire au fonctionnement de la cellule :
**glucose + dioxygène → dioxyde de carbone + eau + énergie**
Les **acides aminés** servent à fabriquer les protéines ; les **acides gras** entrent dans la composition des membranes et constituent une réserve d’énergie.

## Une organisation en niveaux
**Cellule → tissu → organe → appareil → organisme.** Un **tissu** rassemble des cellules de même type ; un **organe** associe plusieurs tissus pour une fonction ; un **appareil** réunit des organes qui concourent au même but.

## Trois appareils, un même service
- L’appareil **digestif** fournit les **nutriments** en simplifiant les aliments.
- L’appareil **respiratoire** fournit le **dioxygène** et évacue le **dioxyde de carbone**.
- L’appareil **circulatoire** **transporte** les uns et les autres jusqu’à chaque cellule, et emporte les déchets.
- L’appareil **excréteur** élimine ces déchets.

> Aucun de ces appareils ne se suffit à lui-même : c’est leur **coordination** qui maintient l’organisme en vie.

## Des besoins variables
Un muscle au repos consomme peu ; en effort, sa consommation de dioxygène et de glucose est multipliée. Le **cerveau**, lui, consomme environ 20 % du glucose de l’organisme alors qu’il n’en représente que 2 % de la masse — et il ne supporte aucune interruption d’approvisionnement.

## L’échelle des échanges
Les échanges se font toujours à travers des **surfaces d’échange** fines, très étendues et très vascularisées : alvéoles pulmonaires (environ 100 m²), villosités intestinales (environ 200 m²), capillaires sanguins. La nature répète partout la même solution : maximiser la surface dans un volume réduit.`,
          },
          questions: [
            ['Quels sont les besoins fondamentaux de toute cellule ?', ['Dioxygène, nutriments, eau, sels minéraux et vitamines', 'Dioxyde de carbone et azote', 'Uniquement du glucose', 'Uniquement du dioxygène'], 0, 'Ils sont les mêmes quelle que soit la spécialité de la cellule.'],
            ['Que produit la respiration cellulaire à partir du glucose et du dioxygène ?', ['Du dioxyde de carbone, de l’eau et de l’énergie', 'De l’oxygène et du glucose', 'Des protéines et des lipides', 'De l’azote et de l’eau'], 0, 'L’énergie libérée fait fonctionner la cellule.'],
            ['Quelle est l’organisation du vivant, du plus simple au plus complexe ?', ['Cellule, tissu, organe, appareil, organisme', 'Organe, cellule, tissu, organisme', 'Tissu, cellule, appareil, organe', 'Organisme, appareil, cellule, tissu'], 0, 'Chaque niveau intègre le précédent.'],
            ['Quel appareil transporte nutriments et dioxygène jusqu’aux cellules ?', ['L’appareil circulatoire', 'L’appareil digestif', 'L’appareil respiratoire', 'L’appareil excréteur'], 0, 'Il emporte aussi les déchets vers les organes d’élimination.'],
            ['À quoi servent les acides aminés apportés par l’alimentation ?', ['À fabriquer les protéines', 'À stocker l’énergie sous forme de graisse', 'À transporter le dioxygène', 'À fabriquer l’ADN uniquement'], 0, 'Les acides gras, eux, entrent dans les membranes et les réserves.'],
            ['Quelle part du glucose de l’organisme le cerveau consomme-t-il ?', ['Environ 20 %', 'Environ 2 %', 'Environ 50 %', 'Environ 5 %'], 0, 'Alors qu’il ne représente que 2 % de la masse corporelle.'],
            ['Quel est le point commun des alvéoles pulmonaires et des villosités intestinales ?', ['Ce sont des surfaces d’échange fines, étendues et très vascularisées', 'Elles produisent des hormones', 'Elles filtrent le sang', 'Elles stockent des nutriments'], 0, 'Maximiser la surface dans un volume réduit est la solution générale.'],
            ['Les besoins d’un muscle sont identiques au repos et pendant l’effort.', ['Vrai', 'Faux'], 1, 'La consommation de dioxygène et de glucose augmente fortement à l’effort.'],
          ],
        },
        {
          titre: 'L’approvisionnement du corps en dioxygène et en nutriments',
          axe: 'Nutrition et organisation des animaux',
          lecon: {
            titre: 'Respirer et absorber : deux portes d’entrée',
            cours: `Le corps ne fabrique ni son dioxygène ni ses nutriments : il les **prélève** dans le milieu, par deux appareils spécialisés.

## L’appareil respiratoire
L’air entre par les **fosses nasales**, passe par le pharynx, le **larynx**, la **trachée**, se divise dans les deux **bronches**, puis dans les bronchioles, jusqu’aux **alvéoles pulmonaires** — environ 300 millions, pour une surface totale d’environ **100 m²**.

La **ventilation** est mécanique : à l’**inspiration**, le **diaphragme** s’abaisse et les muscles intercostaux soulèvent les côtes ; la cage thoracique augmente de volume et l’air entre. À l’**expiration**, le mouvement s’inverse.

Dans l’alvéole, les gaz traversent une paroi très fine, par **diffusion**, du plus concentré vers le moins concentré : le **dioxygène** passe de l’air vers le sang, le **dioxyde de carbone** fait le trajet inverse.

## L’appareil digestif
Les aliments sont d’abord **transformés** : action **mécanique** (mastication, brassage de l’estomac, péristaltisme) et action **chimique** (les **enzymes** de la salive, de l’estomac, du pancréas et de l’intestin coupent les grosses molécules en molécules simples).

Le résultat est **absorbé** au niveau de l’**intestin grêle**, dont la paroi porte des replis, des **villosités** et des microvillosités : environ **200 m²** de surface d’échange, richement irriguée. Nutriments, eau, sels minéraux et vitamines passent dans le sang (et les graisses en partie dans la lymphe).

> Deux appareils, deux milieux, une même stratégie : une **paroi fine**, une **très grande surface**, une **circulation abondante** de l’autre côté.

## Le transport
Le **sang** prend le relais. Le **dioxygène** est fixé par l’**hémoglobine** des globules rouges ; les nutriments circulent dissous dans le **plasma**. Le sang venu de l’intestin passe d’abord par le **foie**, qui trie, stocke le glucose sous forme de **glycogène** et neutralise certaines substances.

## Quand cela ne fonctionne plus
Asthme et bronchite obstruent les voies respiratoires ; le tabac détruit les cils et les alvéoles ; le monoxyde de carbone prend la place du dioxygène sur l’hémoglobine ; une maladie de l’intestin ou une résection réduisent la surface d’absorption et provoquent des carences.`,
          },
          questions: [
            ['Où se font les échanges gazeux dans le poumon ?', ['Dans les alvéoles pulmonaires', 'Dans la trachée', 'Dans les bronches principales', 'Dans le larynx'], 0, 'Elles offrent environ 100 m² de surface d’échange.'],
            ['Quel muscle principal permet l’inspiration ?', ['Le diaphragme', 'Le cœur', 'Le muscle abdominal', 'Le muscle cardiaque droit'], 0, 'Il s’abaisse et augmente le volume de la cage thoracique.'],
            ['Comment le dioxygène passe-t-il de l’alvéole au sang ?', ['Par diffusion, du plus concentré vers le moins concentré', 'Par transport actif avec dépense d’énergie', 'Par filtration mécanique', 'Grâce à une pompe cellulaire'], 0, 'Le dioxyde de carbone fait le trajet inverse.'],
            ['Quel rôle jouent les enzymes digestives ?', ['Elles coupent les grosses molécules en molécules simples', 'Elles broient mécaniquement les aliments', 'Elles transportent les nutriments dans le sang', 'Elles stockent le glucose'], 0, 'C’est la digestion chimique, complémentaire de la digestion mécanique.'],
            ['Où se fait l’essentiel de l’absorption des nutriments ?', ['Dans l’intestin grêle', 'Dans l’estomac', 'Dans le gros intestin', 'Dans l’œsophage'], 0, 'Ses villosités offrent environ 200 m² de surface.'],
            ['Quelle molécule fixe le dioxygène dans le sang ?', ['L’hémoglobine des globules rouges', 'Le plasma', 'Le glycogène', 'L’albumine'], 0, 'Les nutriments, eux, circulent dissous dans le plasma.'],
            ['Quel organe le sang venu de l’intestin traverse-t-il en premier ?', ['Le foie', 'Le cœur', 'Le rein', 'Le poumon'], 0, 'Il y trie les nutriments et stocke le glucose en glycogène.'],
            ['Le monoxyde de carbone prend la place du dioxygène sur l’hémoglobine.', ['Vrai', 'Faux'], 0, 'C’est ce qui rend ce gaz mortel même à faible concentration.'],
          ],
        },
        {
          titre: 'Le système de transport du sang, l’élimination des déchets et les micro-organismes',
          axe: 'Nutrition et organisation des animaux',
          lecon: {
            titre: 'Circuler, filtrer, se défendre',
            cours: `Le **cœur** est une double pompe : quatre cavités (deux **oreillettes**, deux **ventricules**) séparées par une cloison étanche, et des **valves** qui imposent un sens unique au sang.

## Deux circulations
- La **circulation pulmonaire** (ou petite circulation) : le ventricule droit envoie le sang pauvre en dioxygène vers les **poumons** ; il en revient enrichi vers l’oreillette gauche.
- La **circulation générale** (ou grande circulation) : le ventricule gauche — le plus musclé — envoie le sang riche en dioxygène vers tous les organes ; il revient chargé de CO₂ à l’oreillette droite.

## Trois types de vaisseaux
Les **artères** partent du cœur, à paroi épaisse et élastique ; les **veines** y reviennent, à paroi fine, souvent munies de valvules ; les **capillaires**, d’un diamètre proche de celui d’un globule rouge et à paroi d’une seule cellule, sont le lieu **exclusif** des échanges avec les cellules.

## Le sang
**Plasma** (55 %, essentiellement de l’eau, qui transporte nutriments, hormones et déchets), **globules rouges** (transport du dioxygène par l’hémoglobine), **globules blancs** (défense), **plaquettes** (coagulation).

## L’élimination des déchets
Les **reins** filtrent en permanence le sang et forment l’**urine**, qui évacue l’**urée** (déchet du métabolisme des protéines), l’excès d’eau, de sels et certaines substances. Les **poumons** éliminent le **dioxyde de carbone**, le **foie** transforme les déchets azotés et neutralise certains toxiques, la **peau** élimine un peu d’eau et de sels par la sueur.

> Toute substance absorbée finit par passer par le sang : c’est pourquoi une drogue, un médicament ou un polluant atteignent l’organisme entier.

## Les micro-organismes
Nous vivons entourés de **bactéries**, **virus**, **champignons** et **protozoaires**. La plupart sont inoffensifs, beaucoup sont utiles — le **microbiote** intestinal, cutané et respiratoire participe à la digestion, à la synthèse de vitamines et à l’éducation du système immunitaire. Seule une minorité est **pathogène**.

## Les barrières naturelles
La **peau** intacte, les **muqueuses** et leur mucus, les **cils** des voies respiratoires, l’**acidité** de l’estomac et le microbiote lui-même empêchent l’installation des pathogènes. Une **contamination** est l’entrée du micro-organisme ; l’**infection** est sa multiplication dans l’organisme.`,
          },
          questions: [
            ['Combien de cavités compte le cœur humain ?', ['Quatre', 'Deux', 'Trois', 'Six'], 0, 'Deux oreillettes et deux ventricules, séparés par une cloison étanche.'],
            ['Que fait la circulation pulmonaire ?', ['Elle envoie le sang du ventricule droit vers les poumons', 'Elle envoie le sang vers tous les organes', 'Elle relie le foie à l’intestin', 'Elle filtre le sang dans les reins'], 0, 'Le sang en revient enrichi en dioxygène.'],
            ['Où se font exclusivement les échanges entre le sang et les cellules ?', ['Dans les capillaires', 'Dans les artères', 'Dans les veines', 'Dans le cœur'], 0, 'Leur paroi ne compte qu’une seule couche de cellules.'],
            ['Quel est le rôle des plaquettes sanguines ?', ['La coagulation', 'Le transport du dioxygène', 'La défense immunitaire', 'Le transport des nutriments'], 0, 'Les globules blancs assurent la défense.'],
            ['Quel déchet les reins éliminent-ils principalement ?', ['L’urée', 'Le dioxyde de carbone', 'Le glucose', 'L’hémoglobine'], 0, 'C’est le déchet du métabolisme des protéines.'],
            ['La plupart des micro-organismes qui nous entourent sont-ils dangereux ?', ['Non, seule une minorité est pathogène', 'Oui, presque tous', 'Oui, tous les virus le sont', 'Aucun ne l’est'], 0, 'Beaucoup sont même utiles, comme le microbiote.'],
            ['Quelle différence entre contamination et infection ?', ['La contamination est l’entrée du micro-organisme, l’infection sa multiplication', 'La contamination touche la peau, l’infection le sang', 'La contamination est virale, l’infection bactérienne', 'Les deux mots sont synonymes'], 0, 'Une contamination ne débouche pas toujours sur une infection.'],
            ['La peau intacte et l’acidité de l’estomac constituent des barrières naturelles.', ['Vrai', 'Faux'], 0, 'Elles empêchent l’installation de la plupart des pathogènes.'],
          ],
        },

        // ===================================================================
        // Chapitre 6 : Nutrition et organisation des plantes
        // ===================================================================
        {
          titre: 'Nutrition et organisation des plantes',
          axe: 'Nutrition et organisation des plantes',
          lecon: {
            titre: 'Fabriquer sa matière avec de la lumière',
            cours: `Les plantes chlorophylliennes sont **autotrophes** : elles **fabriquent** leur propre matière organique à partir de matière minérale et de lumière. Les animaux, **hétérotrophes**, doivent la prélever toute faite.

## La photosynthèse
Dans les **chloroplastes** des cellules des feuilles, la **chlorophylle** capte l’énergie lumineuse :
**dioxyde de carbone + eau + énergie lumineuse → glucose + dioxygène**
Le glucose produit sert à construire l’ensemble de la plante (amidon, cellulose, protéines après incorporation d’azote) ; le dioxygène est rejeté. La photosynthèse est à la base de presque toutes les chaînes alimentaires et de la teneur en dioxygène de l’atmosphère.

> Attention : la plante **respire aussi**, jour et nuit. Le jour, la photosynthèse l’emporte largement sur la respiration.

## Deux prélèvements, deux organes
- Les **racines** prélèvent dans le sol l’**eau** et les **sels minéraux**, grâce aux **poils absorbants**, qui multiplient énormément la surface de contact.
- Les **feuilles** prélèvent le **dioxyde de carbone** de l’air par de minuscules ouvertures, les **stomates**, qui s’ouvrent et se ferment pour régler à la fois les échanges gazeux et les pertes d’eau.

## Deux circulations
Les **vaisseaux du xylème** conduisent la **sève brute** (eau + sels minéraux) des racines vers les feuilles ; la **transpiration** au niveau des stomates crée l’appel qui la fait monter. Les **vaisseaux du phloème** conduisent la **sève élaborée** (riche en sucres) des feuilles vers tous les organes, y compris les racines et les organes de réserve.

## Un organisme fixé
Une plante ne peut pas fuir. Elle a donc développé d’autres réponses : **croissance orientée** vers la lumière, épines et substances toxiques contre les herbivores, feuilles caduques pour passer l’hiver, graines et spores résistantes pour traverser les mauvaises saisons, et des **relations** avec d’autres espèces — **mycorhizes** avec des champignons, **nodosités** à bactéries fixatrices d’azote chez les légumineuses, pollinisation par les insectes.

## De la plante à l’écosystème
En tant que **producteurs primaires**, les plantes sont le premier maillon des réseaux trophiques, stockent du carbone, retiennent les sols, alimentent la nappe en filtrant l’eau et abritent une part majeure de la biodiversité terrestre.`,
          },
          questions: [
            ['Que signifie « autotrophe » ?', ['Capable de fabriquer sa propre matière organique', 'Capable de se déplacer pour se nourrir', 'Qui se nourrit d’autres organismes', 'Qui vit sans dioxygène'], 0, 'Les animaux, eux, sont hétérotrophes.'],
            ['Quels sont les produits de la photosynthèse ?', ['Du glucose et du dioxygène', 'Du dioxyde de carbone et de l’eau', 'De l’azote et du glucose', 'Des sels minéraux et de l’eau'], 0, 'Ils sont formés à partir de CO₂, d’eau et d’énergie lumineuse.'],
            ['Dans quel organite cellulaire se déroule la photosynthèse ?', ['Le chloroplaste', 'La mitochondrie', 'Le noyau', 'La vacuole'], 0, 'Il contient la chlorophylle, qui capte la lumière.'],
            ['Que prélèvent les racines dans le sol ?', ['De l’eau et des sels minéraux', 'Du dioxyde de carbone', 'Du glucose', 'Du dioxygène uniquement'], 0, 'Les poils absorbants multiplient la surface de contact.'],
            ['À quoi servent les stomates des feuilles ?', ['Aux échanges gazeux et au contrôle des pertes d’eau', 'À capter la lumière', 'À conduire la sève élaborée', 'À fixer la plante au sol'], 0, 'Ils s’ouvrent et se ferment selon les conditions.'],
            ['Que transporte la sève brute ?', ['De l’eau et des sels minéraux, des racines vers les feuilles', 'Des sucres, des feuilles vers les racines', 'Du dioxygène vers les racines', 'Des protéines vers les fruits'], 0, 'La sève élaborée, riche en sucres, circule dans le phloème.'],
            ['Qu’est-ce qu’une mycorhize ?', ['Une association entre les racines d’une plante et un champignon', 'Une maladie des feuilles', 'Un organe de réserve souterrain', 'Une graine résistante'], 0, 'Le champignon améliore l’absorption, la plante fournit des sucres.'],
            ['Une plante ne respire que la nuit.', ['Vrai', 'Faux'], 1, 'Elle respire jour et nuit ; le jour, la photosynthèse l’emporte.'],
          ],
        },

        // ===================================================================
        // Chapitre 7 : Reproduction sexuée et asexuée
        // ===================================================================
        {
          titre: 'La reproduction sexuée et l’influence de l’environnement sur la reproduction d’une population',
          axe: 'Reproduction sexuée et asexuée : dynamique des populations',
          lecon: {
            titre: 'Deux cellules, un nouvel individu, et un milieu qui décide',
            cours: `La **reproduction sexuée** met en jeu deux **cellules reproductrices** — ou **gamètes** — produites par deux individus : un gamète **mâle** (spermatozoïde, grain de pollen) et un gamète **femelle** (ovule, ovule végétal).

## La fécondation
La **fécondation** est la fusion des deux gamètes. Elle donne une **cellule œuf** (ou zygote), unique, qui contient **la moitié de l’information génétique de chaque parent**. Cette cellule se divise ensuite et se différencie : c’est le **développement**.
- **Fécondation externe** : gamètes libérés dans l’eau (poissons, amphibiens, oursins). Peu de chances de rencontre, donc énormément de gamètes produits.
- **Fécondation interne** : dépôt du gamète mâle dans les voies femelles (mammifères, oiseaux, reptiles, insectes). Rendement bien meilleur, descendance moins nombreuse mais mieux protégée.

> Un nouvel individu issu de reproduction sexuée n’est identique à aucun de ses deux parents : le brassage des gamètes crée à chaque fois une **combinaison nouvelle**.

## Ce que le milieu décide
La reproduction n’a lieu que si les conditions le permettent :
- **température** (elle détermine même le sexe des petits chez certaines tortues et crocodiles) ;
- **durée du jour** (photopériode), qui déclenche la reproduction saisonnière ;
- **ressources alimentaires** disponibles pour nourrir la descendance ;
- **présence de partenaires** et densité de la population ;
- **abris et sites de ponte** ;
- **polluants**, dont certains (perturbateurs endocriniens) dérèglent la fertilité.

## La dynamique d’une population
L’effectif d’une population dépend de quatre termes : **natalité**, **mortalité**, **immigration**, **émigration**. Deux stratégies s’observent : produire **beaucoup** de descendants peu protégés (poissons, insectes), ou **peu** de descendants longuement pris en charge (grands mammifères, oiseaux).

## L’action humaine
Destruction des sites de reproduction, **fragmentation** des milieux qui empêche les rencontres, surpêche prélevant les adultes reproducteurs, pollution lumineuse et sonore, introduction d’espèces concurrentes : autant de facteurs qui font chuter le **succès reproducteur**. À l’inverse, passes à poissons, mise en réserve, restauration de zones humides et calendriers de protection le font remonter.`,
          },
          questions: [
            ['Qu’est-ce que la fécondation ?', ['La fusion d’un gamète mâle et d’un gamète femelle', 'La division de la cellule œuf', 'La production de gamètes', 'Le développement de l’embryon'], 0, 'Elle donne une cellule œuf unique.'],
            ['Que contient la cellule œuf ?', ['La moitié de l’information génétique de chaque parent', 'La totalité de l’information de la mère', 'Une information génétique entièrement nouvelle', 'Deux fois l’information du père'], 0, 'C’est ce qui explique la ressemblance partielle avec chaque parent.'],
            ['Pourquoi les espèces à fécondation externe produisent-elles énormément de gamètes ?', ['Parce que les chances de rencontre dans le milieu sont faibles', 'Parce que leurs gamètes sont plus petits', 'Parce qu’elles vivent moins longtemps', 'Parce qu’elles n’ont pas de partenaire'], 0, 'La fécondation interne a un bien meilleur rendement.'],
            ['Quel facteur détermine le sexe des petits chez certaines tortues ?', ['La température d’incubation', 'La taille de l’œuf', 'La profondeur du nid seule', 'Le nombre d’œufs pondus'], 0, 'C’est un exemple frappant d’influence du milieu.'],
            ['Qu’est-ce que la photopériode ?', ['La durée du jour, qui déclenche la reproduction saisonnière', 'L’intensité de la lumière solaire', 'La durée de gestation', 'Le temps d’incubation d’un œuf'], 0, 'Elle synchronise la reproduction avec la bonne saison.'],
            ['De quoi dépend l’effectif d’une population ?', ['De la natalité, de la mortalité, de l’immigration et de l’émigration', 'De la seule natalité', 'De la seule mortalité', 'De la surface du territoire uniquement'], 0, 'Ces quatre termes se compensent ou se cumulent.'],
            ['Quelle stratégie caractérise les grands mammifères ?', ['Peu de descendants, longuement pris en charge', 'Beaucoup de descendants peu protégés', 'Aucune prise en charge des jeunes', 'Une reproduction asexuée'], 0, 'Les poissons et insectes suivent la stratégie inverse.'],
            ['La fragmentation des milieux réduit le succès reproducteur d’une population.', ['Vrai', 'Faux'], 0, 'Elle empêche les rencontres entre partenaires.'],
          ],
        },
        {
          titre: 'La reproduction asexuée',
          axe: 'Reproduction sexuée et asexuée : dynamique des populations',
          lecon: {
            titre: 'Se reproduire seul : des clones et une conquête rapide',
            cours: `La **reproduction asexuée** produit de nouveaux individus **à partir d’un seul parent**, **sans gamète ni fécondation**. Les descendants sont des **clones** : ils possèdent la même information génétique que le parent.

## Les formes chez les animaux
- **Bourgeonnement** : un bourgeon se forme sur le parent puis se détache (hydre, corail, éponge, levure).
- **Scissiparité** : l’individu se divise en deux (bactéries, paramécies, certaines anémones).
- **Fragmentation** et **régénération** : un fragment reconstitue un individu entier (étoile de mer, planaire).
- **Parthénogenèse** : un ovule se développe sans être fécondé (pucerons en été, certains lézards, abeilles pour les mâles).

## Les formes chez les végétaux
La **multiplication végétative** est la règle : **stolons** du fraisier, **rhizomes** du bambou et de l’iris, **tubercules** de la pomme de terre, **bulbes** de la tulipe, **marcottage**, **bouturage**, **drageons** du peuplier. L’horticulture l’exploite systématiquement — un cépage de vigne ou une variété de pomme de terre est un clone entretenu depuis des décennies.

## Avantages
- **Rapidité** : aucune recherche de partenaire, aucun temps perdu.
- **Sécurité** : un individu isolé peut coloniser à lui seul un milieu favorable.
- **Fidélité** : les caractères avantageux du parent sont conservés à l’identique.

## Inconvénients
- **Aucune diversité génétique** : tous les individus réagissent de la même façon. Une maladie ou un changement du milieu peut anéantir la population entière — c’est ce qui s’est produit lors de la grande famine irlandaise de la pomme de terre au XIXe siècle.
- **Compétition** entre individus identiques pour les mêmes ressources.
- **Accumulation** des mutations défavorables, sans brassage pour les éliminer.

> La reproduction sexuée coûte cher mais fabrique de la **diversité** ; l’asexuée est efficace mais fabrique de l’**uniformité**. C’est un arbitrage entre la vitesse et l’avenir.

## Les deux à la fois
Beaucoup d’espèces alternent : le puceron se reproduit par parthénogenèse tant que les conditions sont bonnes, puis sexuellement à l’automne, produisant des œufs résistants. Le fraisier fait des stolons **et** des fleurs. L’un sert à occuper le terrain, l’autre à préparer l’imprévu.`,
          },
          questions: [
            ['Qu’est-ce que la reproduction asexuée ?', ['La production de descendants à partir d’un seul parent, sans fécondation', 'La fusion de deux gamètes identiques', 'La reproduction sans partenaire mais avec gamètes', 'La reproduction par pollinisation'], 0, 'Les descendants sont des clones du parent.'],
            ['Quel mode de reproduction asexuée caractérise l’hydre et le corail ?', ['Le bourgeonnement', 'La scissiparité', 'La parthénogenèse', 'Le marcottage'], 0, 'Un bourgeon se forme puis se détache du parent.'],
            ['Qu’est-ce que la parthénogenèse ?', ['Le développement d’un ovule sans fécondation', 'La division d’un individu en deux', 'La régénération d’un fragment', 'La fusion de deux ovules'], 0, 'Les pucerons la pratiquent en été.'],
            ['Comment le fraisier se multiplie-t-il de façon asexuée ?', ['Par stolons', 'Par bulbes', 'Par rhizomes', 'Par tubercules'], 0, 'La pomme de terre utilise des tubercules, la tulipe des bulbes.'],
            ['Quel est le principal avantage de la reproduction asexuée ?', ['La rapidité de colonisation, sans besoin de partenaire', 'La diversité génétique produite', 'La résistance aux maladies', 'La longévité des individus'], 0, 'Un individu isolé suffit à occuper un milieu favorable.'],
            ['Quel est son principal inconvénient ?', ['L’absence de diversité génétique dans la population', 'La lenteur du processus', 'Le coût énergétique élevé', 'La nécessité de deux parents'], 0, 'Une maladie peut anéantir toute la population.'],
            ['Que fait le puceron selon la saison ?', ['Il se reproduit par parthénogenèse en été et sexuellement à l’automne', 'Il ne se reproduit qu’au printemps', 'Il ne pratique que la reproduction sexuée', 'Il alterne bourgeonnement et scissiparité'], 0, 'Les œufs issus de la reproduction sexuée résistent à l’hiver.'],
            ['Les descendants d’une reproduction asexuée sont génétiquement identiques au parent.', ['Vrai', 'Faux'], 0, 'Ce sont des clones, aux mutations près.'],
          ],
        },
        {
          titre: 'La transmission du patrimoine génétique',
          axe: 'Reproduction sexuée et asexuée : dynamique des populations',
          lecon: {
            titre: 'Comment l’information passe d’une génération à l’autre',
            cours: `Chaque cellule du corps humain contient **46 chromosomes**, soit **23 paires**. Dans chaque paire, un chromosome vient du **père**, l’autre de la **mère**. La 23e paire détermine le sexe : **XX** chez la femme, **XY** chez l’homme.

## Deux divisions, deux rôles
- La **mitose** est la division des cellules du corps : une cellule mère à 46 chromosomes donne **deux cellules filles identiques**, à 46 chromosomes. Elle assure la croissance, le renouvellement et la réparation des tissus.
- La **méiose** est la division qui produit les **gamètes** : elle réduit le nombre de chromosomes de **46 à 23**. Chaque spermatozoïde et chaque ovule ne reçoit ainsi qu’**un chromosome de chaque paire**.

## Pourquoi cette réduction est indispensable
Si les gamètes avaient 46 chromosomes, la cellule œuf en aurait 92, puis 184 à la génération suivante. La méiose divise, la fécondation rétablit : le nombre reste **constant** d’une génération à l’autre.

## Le brassage
Deux mécanismes fabriquent la diversité :
- lors de la méiose, la répartition des chromosomes de chaque paire dans les gamètes se fait **au hasard** — plus de 8 millions de combinaisons possibles pour un seul individu ;
- lors de la fécondation, la rencontre d’**un** spermatozoïde parmi des millions et d’**un** ovule est elle aussi aléatoire.

> C’est pourquoi deux enfants des mêmes parents se ressemblent sans être identiques — sauf les **vrais jumeaux**, issus d’une même cellule œuf, donc génétiquement identiques.

## Les anomalies
Une erreur de répartition lors de la méiose peut donner un gamète avec un chromosome en trop ou en moins. La **trisomie 21** correspond à trois exemplaires du chromosome 21 : le caryotype (photographie ordonnée des chromosomes) permet de la mettre en évidence.

## Ce qui se transmet, ce qui ne se transmet pas
Seules les modifications présentes dans les **cellules reproductrices** se transmettent. Un caractère acquis au cours de la vie — une musculature développée, un bronzage, une cicatrice, une langue apprise — n’est **pas** transmis à la descendance : il ne modifie pas l’information génétique des gamètes.`,
          },
          questions: [
            ['Combien de chromosomes contient une cellule humaine ?', ['46, soit 23 paires', '23, soit 46 paires', '48, soit 24 paires', '44, soit 22 paires'], 0, 'Un chromosome de chaque paire vient de chaque parent.'],
            ['Quelle paire de chromosomes détermine le sexe ?', ['La 23e paire', 'La première paire', 'La 21e paire', 'La 46e paire'], 0, 'XX chez la femme, XY chez l’homme.'],
            ['Que produit la mitose ?', ['Deux cellules filles identiques à 46 chromosomes', 'Quatre gamètes à 23 chromosomes', 'Une cellule œuf', 'Deux cellules à 23 chromosomes'], 0, 'Elle assure croissance, renouvellement et réparation.'],
            ['Que fait la méiose ?', ['Elle réduit le nombre de chromosomes de 46 à 23 dans les gamètes', 'Elle double le nombre de chromosomes', 'Elle produit deux cellules identiques', 'Elle répare l’ADN endommagé'], 0, 'Chaque gamète reçoit un chromosome de chaque paire.'],
            ['Pourquoi la réduction du nombre de chromosomes est-elle indispensable ?', ['Sinon le nombre doublerait à chaque génération', 'Sinon les gamètes seraient trop gros', 'Sinon la fécondation serait impossible', 'Sinon les chromosomes se casseraient'], 0, 'La méiose divise, la fécondation rétablit.'],
            ['Pourquoi deux enfants des mêmes parents ne sont-ils pas identiques ?', ['La répartition des chromosomes et la fécondation se font au hasard', 'Ils reçoivent des chromosomes de parents différents', 'Leur ADN change après la naissance', 'La méiose supprime des chromosomes au hasard'], 0, 'Les vrais jumeaux font exception : ils viennent d’une même cellule œuf.'],
            ['À quoi correspond la trisomie 21 ?', ['À trois exemplaires du chromosome 21', 'À l’absence du chromosome 21', 'À une anomalie de la 23e paire', 'À un chromosome cassé'], 0, 'Le caryotype permet de la mettre en évidence.'],
            ['Une musculature développée par l’entraînement se transmet aux enfants.', ['Vrai', 'Faux'], 1, 'Un caractère acquis ne modifie pas l’information génétique des gamètes.'],
          ],
        },
        // ===================================================================
        // Chapitre 8 : La parenté des êtres vivants
        // ===================================================================
        {
          titre: 'Parenté et évolution des êtres vivants',
          axe: 'La parenté des êtres vivants',
          lecon: {
            titre: 'Un arbre unique pour tout le vivant',
            cours: `Tous les êtres vivants actuels descendent d’**ancêtres communs**. Les classer, ce n’est pas les ranger par ressemblance générale, c’est reconstituer leurs **liens de parenté**.

## Les indices de la parenté
- Les **caractères partagés** : quatre membres, une colonne vertébrale, des plumes, un squelette interne. Plus deux espèces partagent de caractères **dérivés**, plus leur ancêtre commun est récent.
- Les **homologies** : le membre antérieur du chat, de la baleine, de la chauve-souris et de l’humain a le même plan d’organisation (un os, puis deux, puis les doigts) malgré des fonctions très différentes. Même plan = même héritage.
- Les **similitudes moléculaires** : tous les êtres vivants utilisent l’**ADN** et le même code génétique. Plus deux espèces ont des séquences proches, plus leur parenté est étroite.
- Le développement **embryonnaire**, qui révèle des ressemblances effacées chez l’adulte.
- Les **fossiles**, qui documentent les formes intermédiaires.

> Ne pas confondre **homologie** (ressemblance héritée d’un ancêtre commun : bras et aile de chauve-souris) et **convergence** (ressemblance due à un mode de vie commun : aile d’oiseau et aile d’insecte).

## L’arbre du vivant
On le représente par un **arbre phylogénétique** : chaque **nœud** est un ancêtre commun hypothétique, chaque **branche** une lignée. Les groupes sont **emboîtés** : les humains sont des primates, qui sont des mammifères, qui sont des vertébrés, qui sont des eucaryotes.

## Les grandes étapes
La vie apparaît il y a environ **3,8 milliards d’années**, sous forme unicellulaire. Suivent les cellules à noyau, la pluricellularité, l’explosion de formes du Cambrien (−540 Ma), la sortie des eaux, les grandes **crises biologiques** — dont celle qui met fin aux dinosaures non aviens il y a **66 millions d’années** — puis la diversification des mammifères, et l’apparition d’*Homo sapiens* il y a environ **300 000 ans**.

## Les crises, moteurs de renouvellement
Cinq grandes extinctions de masse ont éliminé une part majeure des espèces. Chaque fois, les groupes survivants se sont diversifiés dans les milieux libérés : les mammifères doivent leur essor à la disparition des dinosaures.`,
          },
          questions: [
            ['Sur quoi repose la classification actuelle des êtres vivants ?', ['Sur les liens de parenté et les caractères partagés', 'Sur la taille et le poids des organismes', 'Sur le milieu de vie', 'Sur l’ordre alphabétique des noms'], 0, 'Plus les caractères dérivés partagés sont nombreux, plus l’ancêtre commun est récent.'],
            ['Qu’est-ce qu’une homologie ?', ['Une ressemblance de plan d’organisation héritée d’un ancêtre commun', 'Une ressemblance due à un mode de vie identique', 'Une différence entre deux espèces proches', 'Une mutation partagée par hasard'], 0, 'Le membre antérieur des vertébrés en est l’exemple classique.'],
            ['Qu’est-ce qu’une convergence évolutive ?', ['Une ressemblance due à un mode de vie commun, sans lien de parenté proche', 'Un héritage direct d’un ancêtre commun', 'Une extinction simultanée de deux groupes', 'Un croisement entre deux espèces'], 0, 'L’aile d’oiseau et l’aile d’insecte n’ont pas la même origine.'],
            ['Quel argument moléculaire montre la parenté de tous les êtres vivants ?', ['Ils utilisent tous l’ADN et le même code génétique', 'Ils ont tous des chromosomes en même nombre', 'Ils respirent tous du dioxygène', 'Ils ont tous des cellules à noyau'], 0, 'La proximité des séquences mesure la proximité de parenté.'],
            ['Que représente un nœud dans un arbre phylogénétique ?', ['Un ancêtre commun hypothétique', 'Une espèce actuelle', 'Une extinction de masse', 'Un fossile daté'], 0, 'Les branches représentent les lignées issues de cet ancêtre.'],
            ['Quand la vie apparaît-elle sur Terre ?', ['Il y a environ 3,8 milliards d’années', 'Il y a environ 540 millions d’années', 'Il y a environ 66 millions d’années', 'Il y a environ 300 000 ans'], 0, 'Sous forme unicellulaire, bien avant la pluricellularité.'],
            ['Quand disparaissent les dinosaures non aviens ?', ['Il y a environ 66 millions d’années', 'Il y a environ 540 millions d’années', 'Il y a environ 2 millions d’années', 'Il y a environ 250 millions d’années'], 0, 'Leur disparition ouvre la voie à la diversification des mammifères.'],
            ['Les groupes du vivant sont emboîtés : les humains sont des primates, des mammifères et des vertébrés.', ['Vrai', 'Faux'], 0, 'L’emboîtement traduit la succession des ancêtres communs.'],
          ],
        },
        {
          titre: 'L’évolution des espèces et la sélection naturelle',
          axe: 'La parenté des êtres vivants',
          lecon: {
            titre: 'Le mécanisme découvert par Darwin',
            cours: `L’**évolution** est la transformation des espèces au cours du temps. Son mécanisme principal, décrit par **Charles Darwin** en 1859 dans *L’Origine des espèces*, est la **sélection naturelle**.

## Le raisonnement en quatre temps
1. Au sein d’une population, les individus présentent des **variations** héréditaires (couleur, taille, résistance, comportement).
2. Ils produisent **plus de descendants** que le milieu ne peut en nourrir : il y a **compétition** pour les ressources.
3. Les individus dont les caractères sont les **mieux adaptés** au milieu survivent et se reproduisent davantage.
4. Ces caractères deviennent, **génération après génération**, plus fréquents dans la population.

> La sélection ne crée rien : elle **trie** ce que le hasard des mutations a produit. Le hasard fournit, le milieu choisit.

## L’origine des variations
Les **mutations** de l’ADN, aléatoires, apparaissent spontanément ou sous l’effet d’agents mutagènes. Une mutation n’est ni bonne ni mauvaise en soi : c’est le **milieu** qui décide de sa valeur. Le brassage de la reproduction sexuée redistribue ensuite ces variations à chaque génération.

## Des exemples observés
- La **phalène du bouleau** : en Angleterre industrielle, les troncs noircis par la suie ont favorisé la forme sombre du papillon ; l’air redevenu propre, la forme claire est redevenue majoritaire.
- La **résistance aux antibiotiques** : les bactéries porteuses d’une mutation de résistance survivent au traitement et se multiplient. C’est la sélection naturelle à l’œuvre en quelques jours.
- La résistance des insectes aux insecticides, la taille des becs des pinsons des Galápagos selon les sécheresses.

## Deux autres mécanismes
La **dérive génétique** modifie les fréquences par simple hasard, surtout dans les petites populations. La **sélection sexuelle** favorise les caractères qui améliorent l’accès aux partenaires, même coûteux (la queue du paon).

## De la population à l’espèce nouvelle
Si deux populations d’une même espèce sont **isolées** durablement (montagne, mer, comportement), elles accumulent des différences jusqu’à ne plus pouvoir se reproduire entre elles : c’est la **spéciation**, l’apparition d’une espèce nouvelle.

## Ce qu’il ne faut pas dire
L’évolution n’a **pas de but** et ne va pas « vers le mieux ». Aucun organisme ne se transforme volontairement pour s’adapter : les girafes n’ont pas allongé leur cou en tendant vers les branches — celles dont le cou était plus long se sont simplement mieux reproduites.`,
          },
          questions: [
            ['Qui décrit le mécanisme de la sélection naturelle en 1859 ?', ['Charles Darwin', 'Jean-Baptiste de Lamarck', 'Gregor Mendel', 'Louis Pasteur'], 0, 'Dans L’Origine des espèces.'],
            ['D’où viennent les variations héréditaires dans une population ?', ['Des mutations aléatoires de l’ADN et du brassage de la reproduction sexuée', 'De la volonté des individus de s’adapter', 'De l’usage ou du non-usage des organes', 'Du climat qui modifie directement les gènes'], 0, 'Le hasard fournit, le milieu trie.'],
            ['Que fait la sélection naturelle ?', ['Elle trie les variations existantes selon leur avantage dans le milieu', 'Elle crée de nouvelles mutations utiles', 'Elle supprime toutes les mutations', 'Elle oriente les mutations vers un but'], 0, 'Elle ne crée rien : elle sélectionne.'],
            ['Que montre l’exemple de la phalène du bouleau ?', ['La forme sombre a été favorisée quand les troncs étaient noircis par la suie', 'Les papillons changent de couleur au cours de leur vie', 'La pollution provoque directement des mutations utiles', 'La forme claire a toujours dominé'], 0, 'Quand l’air est redevenu propre, la forme claire est redevenue majoritaire.'],
            ['Pourquoi des bactéries deviennent-elles résistantes à un antibiotique ?', ['Les bactéries porteuses d’une mutation de résistance survivent et se multiplient', 'Elles apprennent à résister au contact du médicament', 'L’antibiotique crée la mutation de résistance', 'Elles échangent leur ADN avec l’hôte'], 0, 'C’est la sélection naturelle observable en quelques jours.'],
            ['Qu’est-ce que la dérive génétique ?', ['Une modification des fréquences par simple hasard, surtout en petite population', 'Une sélection par le milieu', 'Un échange de gènes entre espèces', 'Une mutation dirigée'], 0, 'Elle agit indépendamment de tout avantage.'],
            ['Qu’est-ce que la spéciation ?', ['L’apparition d’une espèce nouvelle après isolement durable de populations', 'La disparition d’une espèce', 'Le croisement de deux espèces', 'La classification des espèces'], 0, 'Les populations isolées accumulent des différences jusqu’à ne plus pouvoir se reproduire entre elles.'],
            ['L’évolution a un but et tend vers des organismes toujours plus perfectionnés.', ['Vrai', 'Faux'], 1, 'Elle n’a aucun but : seul compte l’avantage reproductif dans un milieu donné.'],
          ],
        },

        // ===================================================================
        // Chapitre 9 : Diversité et stabilité génétique des êtres vivants
        // ===================================================================
        {
          titre: 'La diversité des individus au sein d’une espèce et la localisation de l’information génétique',
          axe: 'Diversité et stabilité génétique des êtres vivants',
          lecon: {
            titre: 'Où est écrite l’information, et pourquoi nous différons',
            cours: `Au sein d’une même espèce, tous les individus partagent les mêmes **caractères d’espèce** (deux yeux, une colonne vertébrale, cinq doigts) mais diffèrent par leurs **caractères individuels** (couleur des yeux, groupe sanguin, taille, forme du visage).

## Où est l’information ?
Elle est dans le **noyau** de chaque cellule. Les expériences de **transfert de noyau** l’ont démontré : si l’on remplace le noyau d’une cellule d’acétabulaire ou d’un ovule de grenouille par celui d’un autre individu, c’est le **noyau** qui impose les caractères. Le clonage de la brebis **Dolly** (1996) repose exactement sur ce principe.

## Chromosomes, ADN, gènes
Dans le noyau, l’information est portée par les **chromosomes**, visibles au microscope au moment de la division cellulaire. Un chromosome est une longue molécule d’**ADN** (acide désoxyribonucléique) associée à des protéines. Un **gène** est un segment d’ADN qui porte l’information d’un **caractère** — ou plus exactement l’information pour fabriquer une **protéine**.

> Le même ADN est présent dans **toutes** les cellules d’un individu ; ce qui change d’un tissu à l’autre, ce sont les gènes qui s’y **expriment**.

## La structure de l’ADN
L’ADN est une **double hélice** formée de deux brins complémentaires, décrite en 1953 par Watson, Crick, Franklin et Wilkins. Il est composé de quatre bases : **A**, **T**, **G**, **C**, qui s’apparient toujours A avec T et G avec C. L’ordre de ces bases constitue le **message** génétique — un alphabet de quatre lettres, universel dans tout le vivant.

## Deux origines à la diversité
- **Génétique** : chaque individu reçoit une combinaison unique de versions de gènes.
- **Environnementale** : l’alimentation, l’activité physique, l’exposition au soleil, l’apprentissage modulent l’expression des caractères. La taille adulte, par exemple, dépend des gènes **et** de la nutrition pendant la croissance.

## Deux individus identiques ?
Seuls les **vrais jumeaux** et les individus issus de reproduction asexuée partagent le même ADN. Et même eux ne sont pas exactement semblables : l’environnement et le hasard du développement finissent toujours par les distinguer.`,
          },
          questions: [
            ['Où se trouve l’information génétique dans une cellule ?', ['Dans le noyau', 'Dans la membrane', 'Dans le cytoplasme uniquement', 'Dans les mitochondries uniquement'], 0, 'Les expériences de transfert de noyau l’ont démontré.'],
            ['Qu’a démontré le clonage de la brebis Dolly en 1996 ?', ['Le noyau transféré impose les caractères de l’individu donneur', 'L’environnement détermine seul les caractères', 'Les gamètes sont indispensables au clonage', 'L’ADN est présent dans le cytoplasme'], 0, 'Il repose sur le transfert de noyau dans un ovule énucléé.'],
            ['Qu’est-ce qu’un gène ?', ['Un segment d’ADN portant l’information d’un caractère', 'Un chromosome entier', 'Une protéine du noyau', 'Une cellule spécialisée'], 0, 'Il porte l’information pour fabriquer une protéine.'],
            ['Quelle est la structure de l’ADN ?', ['Une double hélice formée de deux brins complémentaires', 'Une simple chaîne linéaire', 'Un anneau fermé', 'Un réseau ramifié'], 0, 'Elle a été décrite en 1953.'],
            ['Quelles bases s’apparient dans l’ADN ?', ['A avec T, et G avec C', 'A avec G, et T avec C', 'A avec C, et T avec G', 'Chaque base avec elle-même'], 0, 'Cette complémentarité permet la copie fidèle de l’ADN.'],
            ['L’ADN est-il le même dans toutes les cellules d’un individu ?', ['Oui, ce sont les gènes exprimés qui changent selon les tissus', 'Non, chaque organe a son propre ADN', 'Non, seules les cellules reproductrices en contiennent', 'Oui, et tous les gènes s’y expriment de la même façon'], 0, 'La spécialisation vient de l’expression, pas du contenu.'],
            ['Qu’est-ce qui explique la diversité des individus d’une même espèce ?', ['Une combinaison unique de versions de gènes, et l’influence de l’environnement', 'L’environnement seul', 'Les gènes seuls', 'Le hasard des mutations après la naissance'], 0, 'La taille adulte dépend des gènes et de la nutrition.'],
            ['Les vrais jumeaux sont strictement identiques en tout point.', ['Vrai', 'Faux'], 1, 'Ils partagent le même ADN, mais l’environnement les distingue.'],
          ],
        },
        {
          titre: 'La diversité génétique au sein d’une espèce, le gène et ses allèles',
          axe: 'Diversité et stabilité génétique des êtres vivants',
          lecon: {
            titre: 'Un gène, plusieurs versions',
            cours: `Un **gène** occupe toujours la **même place** (le même **locus**) sur le même chromosome, chez tous les individus de l’espèce. Mais il peut en exister plusieurs **versions** : ce sont les **allèles**.

## Le vocabulaire
Comme les chromosomes vont par paires, chaque individu porte **deux allèles** de chaque gène — un venu du père, un de la mère.
- Si les deux allèles sont identiques, l’individu est **homozygote** pour ce gène.
- S’ils sont différents, il est **hétérozygote**.
- Un allèle **dominant** s’exprime dès qu’il est présent ; un allèle **récessif** ne s’exprime que s’il est présent **en double**.
- Certains allèles sont **codominants** : tous deux s’expriment (groupe sanguin AB).

## Génotype et phénotype
Le **génotype** est l’ensemble des allèles portés par l’individu ; le **phénotype** est l’ensemble des caractères observables. Deux génotypes différents peuvent donner le même phénotype : un individu homozygote dominant et un hétérozygote se ressemblent, mais ne transmettront pas la même chose.

> C’est pourquoi une maladie récessive peut apparaître chez un enfant dont **aucun** des deux parents n’est malade : chacun était **porteur sain**.

## Un exemple : les groupes sanguins
Le gène du système ABO possède trois allèles : **A**, **B** et **O**. A et B sont dominants sur O et codominants entre eux. Un individu de groupe A peut donc être A//A ou A//O ; un individu de groupe O est nécessairement O//O.

## D’où viennent les allèles ?
Des **mutations** : une modification de la séquence d’ADN crée une nouvelle version du gène. La plupart sont neutres, certaines défavorables, quelques-unes avantageuses. Les mutations peuvent être spontanées (erreurs de copie) ou provoquées par des agents **mutagènes** : ultraviolets, tabac, certains produits chimiques, rayonnements ionisants.

## Pourquoi la diversité compte
Une population génétiquement diverse contient des individus capables de résister à une maladie ou à un changement du milieu. Une population uniforme — un champ d’une seule variété clonée, par exemple — peut être détruite d’un seul coup. La **diversité génétique** est une assurance sur l’avenir.`,
          },
          questions: [
            ['Qu’est-ce qu’un allèle ?', ['Une version d’un gène', 'Un chromosome entier', 'Une cellule reproductrice', 'Une protéine codée par un gène'], 0, 'Un gène occupe toujours le même locus, mais peut avoir plusieurs versions.'],
            ['Combien d’allèles de chaque gène un individu porte-t-il ?', ['Deux, un de chaque parent', 'Un seul', 'Quatre', 'Autant que de chromosomes'], 0, 'Les chromosomes vont par paires.'],
            ['Que signifie être hétérozygote pour un gène ?', ['Porter deux allèles différents de ce gène', 'Porter deux allèles identiques', 'Ne porter qu’un seul allèle', 'Porter un allèle muté'], 0, 'Homozygote signifie deux allèles identiques.'],
            ['Quand un allèle récessif s’exprime-t-il ?', ['Seulement s’il est présent en double exemplaire', 'Dès qu’il est présent une fois', 'Jamais', 'Uniquement chez les femmes'], 0, 'Un allèle dominant s’exprime dès qu’il est présent.'],
            ['Quelle différence entre génotype et phénotype ?', ['Le génotype est l’ensemble des allèles, le phénotype les caractères observables', 'Le génotype est visible, le phénotype non', 'Le génotype concerne les gamètes, le phénotype les cellules du corps', 'Ils sont synonymes'], 0, 'Deux génotypes différents peuvent donner le même phénotype.'],
            ['Comment un enfant peut-il être atteint d’une maladie récessive sans parent malade ?', ['Chacun des parents était porteur sain d’un allèle récessif', 'La maladie est apparue par mutation après la naissance', 'Un seul parent a transmis les deux allèles', 'La maladie vient de l’environnement seul'], 0, 'Les parents hétérozygotes ne présentent pas la maladie.'],
            ['D’où viennent les nouveaux allèles ?', ['De mutations de la séquence d’ADN', 'Du brassage lors de la fécondation', 'De l’alimentation', 'De l’entraînement physique'], 0, 'Ultraviolets, tabac et rayonnements sont des agents mutagènes.'],
            ['Une population génétiquement uniforme est plus vulnérable à une maladie nouvelle.', ['Vrai', 'Faux'], 0, 'Aucun individu ne dispose d’une résistance différente.'],
          ],
        },
        {
          titre: 'La transmission de l’information génétique et des informations héréditaires',
          axe: 'Diversité et stabilité génétique des êtres vivants',
          lecon: {
            titre: 'Copier fidèlement, transmettre à la génération suivante',
            cours: `Pour que chaque cellule d’un organisme possède la même information, l’ADN doit être **copié** avant chaque division. Pour que l’espèce se perpétue, cette information doit ensuite être **transmise** aux descendants.

## La réplication de l’ADN
Avant une division, la double hélice s’ouvre et chaque brin sert de **modèle** : la complémentarité des bases (A-T, G-C) impose la séquence du brin neuf. On obtient **deux molécules identiques** à l’originale. C’est cette copie fidèle qui explique que toutes les cellules d’un individu aient le même ADN.

## Mitose : la stabilité
Après la réplication, la **mitose** répartit les chromosomes copiés en deux lots strictement égaux : **deux cellules filles identiques** entre elles et à la cellule mère. Croissance, cicatrisation, renouvellement de la peau et du sang reposent sur elle.

## Méiose et fécondation : la variabilité
La **méiose** produit des gamètes à **23 chromosomes**, un de chaque paire, tirés au hasard. La **fécondation** réunit ensuite deux gamètes tirés eux aussi au hasard parmi des millions. Résultat : chaque individu issu de reproduction sexuée est **génétiquement unique**.

> La mitose **conserve**, la méiose et la fécondation **brassent**. Un organisme a besoin des deux : de stabilité pour fonctionner, de variabilité pour durer en tant qu’espèce.

## Comment on suit un caractère
Un **arbre généalogique** permet de déterminer si un caractère est dominant ou récessif, porté ou non par un chromosome sexuel. Deux indices classiques : un caractère qui **saute une génération** est probablement récessif ; un caractère qui touche presque uniquement les garçons est probablement porté par le chromosome **X**, comme le daltonisme ou l’hémophilie.

## Quand la copie se trompe
Une erreur de réplication non réparée devient une **mutation**. Si elle survient dans une cellule du corps, elle ne touche que la descendance de cette cellule — c’est ainsi que naissent certains cancers. Si elle survient dans une cellule reproductrice, elle est **transmissible** à la descendance.

## Ce que cela permet aujourd’hui
Tests génétiques, diagnostic prénatal, identification par empreintes génétiques, thérapie génique, sélection variétale : toutes ces techniques reposent sur la connaissance de la structure et de la transmission de l’ADN — et posent des questions **éthiques** que la science seule ne tranche pas.`,
          },
          questions: [
            ['Que se passe-t-il lors de la réplication de l’ADN ?', ['Chaque brin sert de modèle pour fabriquer un brin complémentaire', 'Les deux brins sont détruits puis reconstruits', 'L’ADN se transforme en protéine', 'Les chromosomes s’échangent entre paires'], 0, 'On obtient deux molécules identiques à l’originale.'],
            ['Quel est le résultat d’une mitose ?', ['Deux cellules filles identiques à la cellule mère', 'Quatre cellules à 23 chromosomes', 'Une cellule œuf', 'Deux gamètes'], 0, 'Elle assure la stabilité génétique de l’organisme.'],
            ['Qu’apportent la méiose et la fécondation ?', ['La variabilité génétique des descendants', 'La stabilité de l’information génétique', 'La réparation des mutations', 'La copie fidèle des chromosomes'], 0, 'Chaque individu issu de reproduction sexuée est unique.'],
            ['Que suggère un caractère qui saute une génération dans un arbre généalogique ?', ['Qu’il est probablement récessif', 'Qu’il est dominant', 'Qu’il est acquis', 'Qu’il est porté par le chromosome Y'], 0, 'Les porteurs sains le transmettent sans le présenter.'],
            ['Quel indice suggère un caractère porté par le chromosome X ?', ['Il touche presque uniquement les garçons', 'Il touche uniquement les filles', 'Il saute deux générations', 'Il apparaît après 40 ans'], 0, 'Daltonisme et hémophilie en sont les exemples classiques.'],
            ['Quelle mutation est transmissible à la descendance ?', ['Celle qui survient dans une cellule reproductrice', 'Celle qui survient dans une cellule de la peau', 'Toutes les mutations', 'Aucune mutation'], 0, 'Une mutation dans une cellule du corps ne touche que la descendance de cette cellule.'],
            ['Comment naissent certains cancers ?', ['À partir de mutations non réparées dans des cellules du corps', 'Par transmission systématique des parents', 'Par contamination virale exclusivement', 'Par carence en vitamines'], 0, 'La cellule mutée se multiplie sans contrôle.'],
            ['La mitose conserve l’information, la méiose et la fécondation la brassent.', ['Vrai', 'Faux'], 0, 'Un organisme a besoin des deux : stabilité et variabilité.'],
          ],
        },

        // ===================================================================
        // Chapitre 10 : Le fonctionnement de l'organisme
        // ===================================================================
        {
          titre: 'L’effort physique',
          axe: 'Le fonctionnement de l’organisme',
          lecon: {
            titre: 'Ce que le corps modifie pour fournir de l’énergie',
            cours: `Pendant un effort, les muscles consomment beaucoup plus de **glucose** et de **dioxygène** qu’au repos, et produisent davantage de **dioxyde de carbone** et de **chaleur**. L’organisme s’adapte immédiatement.

## Les modifications immédiates
- **Fréquence cardiaque** : elle passe d’environ 70 à 150-190 battements par minute.
- **Débit cardiaque** : il peut être multiplié par 5 (volume d’éjection × fréquence).
- **Fréquence et amplitude respiratoires** augmentent fortement ; la consommation de dioxygène est multipliée par 10 ou plus.
- **Redistribution du sang** : les vaisseaux des muscles se **dilatent**, ceux des organes digestifs se **contractent**. Au repos, les muscles reçoivent environ 20 % du débit sanguin ; à l’effort intense, plus de 80 %.
- **Sudation** : elle évacue la chaleur produite, au prix d’une perte d’eau et de sels.

> Toutes ces adaptations poursuivent un seul but : **amener plus de dioxygène et de glucose aux muscles**, et évacuer plus vite le CO₂ et la chaleur.

## D’où vient l’énergie
Le muscle puise d’abord dans ses **réserves de glycogène**, puis dans le **glucose sanguin** — réapprovisionné par le foie — puis dans les **lipides** pour les efforts longs. La respiration cellulaire produit l’énergie ; lorsque l’apport en dioxygène ne suffit plus, la **fermentation lactique** prend le relais, moins efficace et productrice d’acide lactique.

## Les limites
Essoufflement, douleur, crampes, **déshydratation**, hypoglycémie, coup de chaleur : ce sont des signaux d’alerte. Les ignorer expose à l’accident. L’**échauffement** prépare progressivement le cœur, les muscles et les articulations ; la **récupération** et l’hydratation permettent au corps de reconstituer ses réserves.

## L’entraînement
Répété, l’effort transforme durablement l’organisme : le cœur devient plus puissant et la fréquence de repos **diminue** chez le sportif entraîné, les muscles se renforcent, le réseau de capillaires se densifie, la capacité respiratoire augmente et la récupération est plus rapide.

## Ce qu’il ne faut pas faire
Forcer sans échauffement, s’entraîner malade, jeûner avant un effort long, ignorer la douleur, se doper. Les produits dopants améliorent une performance immédiate au prix de risques cardiaques, hormonaux et psychiques majeurs.`,
          },
          questions: [
            ['Que consomment davantage les muscles pendant un effort ?', ['Du glucose et du dioxygène', 'Du dioxyde de carbone et de l’eau', 'Des protéines uniquement', 'De l’azote'], 0, 'Ils produisent en retour du CO₂ et de la chaleur.'],
            ['Comment le sang est-il redistribué à l’effort ?', ['Vers les muscles, au détriment des organes digestifs', 'Vers les organes digestifs', 'De façon inchangée', 'Uniquement vers le cerveau'], 0, 'Les vaisseaux musculaires se dilatent, les vaisseaux digestifs se contractent.'],
            ['De combien la consommation de dioxygène peut-elle être multipliée à l’effort ?', ['Par 10 ou plus', 'Par 2', 'Elle reste identique', 'Elle diminue'], 0, 'La ventilation augmente en fréquence et en amplitude.'],
            ['Dans quoi le muscle puise-t-il en premier ?', ['Ses réserves de glycogène', 'Les lipides du tissu adipeux', 'Les protéines musculaires', 'Le calcium des os'], 0, 'Le glucose sanguin puis les lipides prennent ensuite le relais.'],
            ['Que se passe-t-il quand l’apport en dioxygène devient insuffisant ?', ['La fermentation lactique prend le relais', 'La respiration cellulaire s’accélère', 'Le muscle stocke du glycogène', 'Le cœur ralentit'], 0, 'Elle est moins efficace et produit de l’acide lactique.'],
            ['À quoi sert la sudation pendant l’effort ?', ['À évacuer la chaleur produite', 'À éliminer le dioxyde de carbone', 'À apporter du glucose à la peau', 'À augmenter le débit cardiaque'], 0, 'Elle coûte de l’eau et des sels, d’où le risque de déshydratation.'],
            ['Quel effet l’entraînement régulier a-t-il sur la fréquence cardiaque de repos ?', ['Elle diminue', 'Elle augmente', 'Elle reste identique', 'Elle devient irrégulière'], 0, 'Le cœur, plus puissant, éjecte davantage à chaque battement.'],
            ['Une douleur pendant l’effort est un signal d’alerte à ne pas ignorer.', ['Vrai', 'Faux'], 0, 'Crampes, essoufflement et douleur signalent une limite atteinte.'],
          ],
        },
        {
          titre: 'Sport et santé',
          axe: 'Le fonctionnement de l’organisme',
          lecon: {
            titre: 'Bouger, un déterminant majeur de la santé',
            cours: `La santé, selon l’**OMS**, n’est pas seulement l’absence de maladie : c’est un état de complet bien-être **physique**, **mental** et **social**. L’activité physique agit sur les trois.

## Les bénéfices
- **Cardiovasculaires** : cœur plus efficace, pression artérielle mieux régulée, réduction du risque d’infarctus et d’AVC.
- **Métaboliques** : meilleur contrôle du poids, prévention du diabète de type 2, meilleur profil de cholestérol.
- **Musculo-squelettiques** : muscles renforcés, os plus denses (prévention de l’ostéoporose), articulations mieux tenues, meilleur équilibre.
- **Mentaux** : réduction du stress et de l’anxiété, amélioration du sommeil, de l’humeur et de la concentration.
- **Sociaux** : appartenance à un groupe, règles partagées, coopération.

> L’OMS recommande aux adolescents au moins **60 minutes** d’activité physique modérée à soutenue **par jour**.

## Les risques de la sédentarité
Rester assis longtemps est un facteur de risque **indépendant** : surpoids, diabète, maladies cardiovasculaires, mal de dos, troubles du sommeil. Le temps passé devant les écrans y contribue directement.

## Bien pratiquer
Échauffement, progressivité, matériel adapté, hydratation, récupération, sommeil suffisant, alimentation équilibrée. La **surcharge d’entraînement** existe aussi : fatigue persistante, blessures à répétition, troubles du sommeil, perte de motivation en sont les signes.

## Alimentation et effort
Les besoins énergétiques augmentent avec l’activité, mais l’équilibre reste le même : **glucides complexes** pour l’endurance, **protéines** pour la réparation musculaire, **lipides** de qualité, vitamines et minéraux, et surtout de l’**eau**. Aucun complément ne remplace une alimentation variée, et les régimes restrictifs à l’adolescence sont dangereux pendant la croissance.

## Le dopage
Utiliser une substance interdite pour améliorer une performance, c’est tricher — et se mettre en danger : troubles cardiaques, hormonaux, psychiques, dépendance. La règle sportive rejoint ici la règle sanitaire.

## Une responsabilité individuelle et collective
Choisir de bouger relève de chacun, mais dépend aussi des **conditions** : pistes cyclables, équipements sportifs accessibles, cours d’EPS, sécurité des trajets. La santé publique se joue autant dans l’aménagement que dans la volonté individuelle.`,
          },
          questions: [
            ['Comment l’OMS définit-elle la santé ?', ['Un état de complet bien-être physique, mental et social', 'L’absence de maladie', 'Une bonne condition physique', 'Une espérance de vie élevée'], 0, 'L’activité physique agit sur les trois dimensions.'],
            ['Quelle durée d’activité physique quotidienne l’OMS recommande-t-elle aux adolescents ?', ['Au moins 60 minutes', 'Au moins 20 minutes', 'Au moins 2 heures', 'Au moins 10 minutes'], 0, 'D’intensité modérée à soutenue.'],
            ['Quel bénéfice osseux l’activité physique apporte-t-elle ?', ['Une densité osseuse plus élevée, qui prévient l’ostéoporose', 'Un allongement des os', 'Une diminution du nombre d’articulations', 'Un durcissement des cartilages'], 0, 'L’os se renforce sous contrainte mécanique.'],
            ['La sédentarité est-elle un facteur de risque à elle seule ?', ['Oui, indépendamment des autres facteurs', 'Non, seulement combinée au tabac', 'Non, si l’alimentation est équilibrée', 'Uniquement après 50 ans'], 0, 'Rester assis longtemps augmente plusieurs risques.'],
            ['Quels signes indiquent une surcharge d’entraînement ?', ['Fatigue persistante, blessures répétées, troubles du sommeil', 'Une progression rapide des performances', 'Une meilleure récupération', 'Un appétit accru'], 0, 'S’entraîner trop nuit autant que pas assez.'],
            ['Quel nutriment est privilégié pour les efforts d’endurance ?', ['Les glucides complexes', 'Les protéines', 'Les lipides saturés', 'Les vitamines liposolubles'], 0, 'Les protéines servent surtout à la réparation musculaire.'],
            ['Quels risques le dopage fait-il courir ?', ['Des troubles cardiaques, hormonaux et psychiques', 'Une simple sanction sportive', 'Aucun risque à faible dose', 'Une perte de masse musculaire uniquement'], 0, 'La règle sportive rejoint ici la règle sanitaire.'],
            ['La pratique d’une activité physique ne dépend que de la volonté individuelle.', ['Vrai', 'Faux'], 1, 'Équipements, pistes cyclables et sécurité des trajets pèsent aussi.'],
          ],
        },

        // ===================================================================
        // Chapitre 11 : Système nerveux et comportement responsable
        // ===================================================================
        {
          titre: 'Système nerveux et comportement responsable',
          axe: 'Système nerveux et comportement responsable',
          lecon: {
            titre: 'Recevoir, traiter, réagir — et protéger son cerveau',
            cours: `Le **système nerveux** relie l’organisme à son environnement. Il se compose du **système nerveux central** (encéphale et moelle épinière) et du **système nerveux périphérique** (les **nerfs**).

## Le trajet d’un message
1. Un **stimulus** est capté par un **récepteur sensoriel** (œil, oreille, peau, langue, nez).
2. Un **message nerveux sensitif** part par un **nerf sensitif** vers le centre nerveux.
3. Le **centre nerveux** (cerveau ou moelle épinière) **traite** l’information et élabore une réponse.
4. Un **message nerveux moteur** part par un **nerf moteur** vers un **organe effecteur** (muscle, glande).

Le **réflexe** court-circuite le cerveau : le traitement se fait dans la **moelle épinière**, ce qui rend la réaction beaucoup plus rapide (retirer sa main d’une source brûlante avant même d’avoir eu mal).

## Le neurone
La cellule nerveuse comprend un **corps cellulaire**, des **dendrites** qui reçoivent et un **axone** qui transmet. Le message circule sous forme d’**influx électrique** le long du neurone, puis franchit la **synapse** grâce à des **neurotransmetteurs** chimiques. C’est précisément là que la plupart des drogues agissent.

> Le cerveau adulte compte environ 86 milliards de neurones et des milliers de milliards de connexions, qui se remodèlent avec l’apprentissage : c’est la **plasticité cérébrale**.

## Ce qui perturbe le système nerveux
- L’**alcool** : ralentissement des réflexes, altération du jugement, coma à forte dose. Il est particulièrement toxique pour le cerveau **en développement** de l’adolescent.
- Le **cannabis** : troubles de la mémoire, de l’attention et de la motivation, risques psychiatriques accrus chez les jeunes usagers.
- Le **tabac** et les autres **drogues** : dépendance, altération du circuit de la récompense.
- Le **manque de sommeil** : le sommeil consolide les apprentissages ; en manquer dégrade mémoire, humeur et attention.
- Le **bruit** intense et les écouteurs à fort volume : destruction irréversible des cellules ciliées de l’oreille interne.

## Le comportement responsable
Casque à vélo et en deux-roues, protection auditive, respect du temps de sommeil, refus des substances, prudence sur les écrans avant le coucher : ces gestes protègent un organe qui ne se répare pas comme la peau. Un neurone détruit n’est, dans la plupart des cas, pas remplacé.`,
          },
          questions: [
            ['De quoi se compose le système nerveux central ?', ['De l’encéphale et de la moelle épinière', 'Des nerfs sensitifs et moteurs', 'Des récepteurs sensoriels', 'Des muscles et des glandes'], 0, 'Les nerfs forment le système nerveux périphérique.'],
            ['Quel est l’ordre du trajet d’un message nerveux ?', ['Récepteur, nerf sensitif, centre nerveux, nerf moteur, effecteur', 'Effecteur, nerf moteur, centre nerveux, récepteur', 'Centre nerveux, récepteur, effecteur', 'Récepteur, effecteur, centre nerveux'], 0, 'Le centre nerveux traite l’information et élabore la réponse.'],
            ['Où se fait le traitement lors d’un réflexe ?', ['Dans la moelle épinière', 'Dans le cerveau', 'Dans le nerf sensitif', 'Dans le muscle lui-même'], 0, 'Court-circuiter le cerveau rend la réaction beaucoup plus rapide.'],
            ['Comment le message franchit-il la synapse ?', ['Grâce à des neurotransmetteurs chimiques', 'Par un courant électrique direct', 'Par contact des noyaux', 'Par diffusion sanguine'], 0, 'C’est là que la plupart des drogues agissent.'],
            ['Quelles parties du neurone reçoivent le message ?', ['Les dendrites', 'L’axone', 'Le corps cellulaire uniquement', 'La synapse'], 0, 'L’axone, lui, transmet le message vers la synapse.'],
            ['Qu’est-ce que la plasticité cérébrale ?', ['La capacité des connexions à se remodeler avec l’apprentissage', 'La capacité des neurones à se multiplier sans limite', 'La souplesse des membranes cellulaires', 'La résistance du crâne aux chocs'], 0, 'Elle permet l’apprentissage tout au long de la vie.'],
            ['Pourquoi l’alcool est-il particulièrement risqué à l’adolescence ?', ['Le cerveau est encore en développement', 'Le foie est plus gros', 'Les réflexes sont plus lents', 'La consommation est autorisée'], 0, 'Les effets sur le cerveau immature sont durables.'],
            ['Les cellules ciliées de l’oreille interne détruites par le bruit se régénèrent.', ['Vrai', 'Faux'], 1, 'La perte auditive due au bruit est irréversible.'],
          ],
        },

        // ===================================================================
        // Chapitre 12 : Alimentation et digestion
        // ===================================================================
        {
          titre: 'Alimentation et digestion',
          axe: 'Alimentation et digestion',
          lecon: {
            titre: 'De l’aliment au nutriment, et ce qui fait un repas équilibré',
            cours: `Les **aliments** apportent des **nutriments** en proportions variables. La digestion sert à les rendre assimilables : c’est la **simplification** des grosses molécules en petites, capables de traverser la paroi intestinale.

## Le trajet des aliments
**Bouche** (mastication, salive) → **œsophage** (péristaltisme) → **estomac** (brassage, suc gastrique acide) → **intestin grêle** (suc pancréatique, bile, suc intestinal ; c’est là que se fait l’essentiel de la digestion **et** de l’absorption) → **gros intestin** (réabsorption d’eau, microbiote, formation des matières fécales) → rectum et anus.

## Deux actions complémentaires
- L’action **mécanique** : mastication, brassage, contractions. Elle **fragmente**, augmentant la surface d’attaque.
- L’action **chimique** : les **enzymes** digestives coupent les liaisons des grosses molécules. Chaque enzyme est **spécifique** d’un type de molécule (amylase pour l’amidon, protéases pour les protéines, lipases pour les graisses).

## Ce que deviennent les grandes familles
- **Glucides complexes** (amidon) → **glucose**.
- **Protéines** → **acides aminés**.
- **Lipides** → **acides gras** et **glycérol**.
- **Eau**, **sels minéraux** et **vitamines** passent sans transformation.

> Les **fibres** ne sont pas digérées par nos enzymes : elles régulent le transit et nourrissent le microbiote. Elles sont indispensables même sans valeur énergétique.

## L’équilibre alimentaire
Il ne s’évalue pas repas par repas mais **sur plusieurs jours**. Les repères : des fruits et légumes à chaque repas, des féculents (de préférence complets) selon l’appétit et l’activité, des protéines variées (dont légumineuses), des produits laitiers, peu de produits sucrés, salés et ultratransformés, et de l’**eau** comme seule boisson indispensable.

Les besoins **varient** : un adolescent en croissance, un sportif, une femme enceinte et une personne âgée n’ont ni les mêmes besoins énergétiques ni les mêmes besoins en calcium, fer ou protéines.

## Quand l’équilibre est rompu
**Dénutrition** et **carences** (fer, calcium, vitamine D) freinent la croissance et fatiguent. **Surpoids** et **obésité** résultent d’un apport durablement supérieur aux dépenses, et augmentent le risque de diabète de type 2 et de maladies cardiovasculaires. Les **troubles du comportement alimentaire** (anorexie, boulimie) sont des maladies qui se soignent et pour lesquelles il faut demander de l’aide.

## Sécurité alimentaire
Chaîne du froid, cuisson suffisante, lavage des mains et des végétaux, dates de consommation, séparation du cru et du cuit : ces règles évitent les **intoxications alimentaires**, dues à des bactéries comme *Salmonella* ou *Listeria*.`,
          },
          questions: [
            ['À quoi sert la digestion ?', ['À simplifier les grosses molécules en nutriments assimilables', 'À stocker les aliments dans l’estomac', 'À produire de l’énergie directement', 'À éliminer les déchets du sang'], 0, 'Les nutriments peuvent alors traverser la paroi intestinale.'],
            ['Où se fait l’essentiel de la digestion et de l’absorption ?', ['Dans l’intestin grêle', 'Dans l’estomac', 'Dans le gros intestin', 'Dans la bouche'], 0, 'Sucs pancréatique, biliaire et intestinal y agissent ensemble.'],
            ['Quelle est la particularité des enzymes digestives ?', ['Chacune est spécifique d’un type de molécule', 'Elles agissent toutes sur tous les aliments', 'Elles agissent uniquement dans l’estomac', 'Elles fragmentent mécaniquement les aliments'], 0, 'Amylase, protéases et lipases ont chacune leur cible.'],
            ['En quoi les protéines sont-elles transformées ?', ['En acides aminés', 'En glucose', 'En acides gras', 'En glycérol'], 0, 'L’amidon donne du glucose, les lipides des acides gras et du glycérol.'],
            ['Quel est le rôle des fibres alimentaires ?', ['Réguler le transit et nourrir le microbiote', 'Fournir l’essentiel de l’énergie', 'Remplacer les protéines', 'Transporter les vitamines dans le sang'], 0, 'Elles ne sont pas digérées par nos propres enzymes.'],
            ['Sur quelle durée l’équilibre alimentaire s’évalue-t-il ?', ['Sur plusieurs jours', 'Repas par repas', 'Sur une année', 'Sur une heure'], 0, 'Un repas déséquilibré isolé n’a pas d’importance.'],
            ['Quelle boisson est indispensable ?', ['L’eau', 'Le jus de fruits', 'Le lait', 'Les boissons sucrées'], 0, 'Toutes les autres sont facultatives.'],
            ['Les troubles du comportement alimentaire sont des maladies qui se soignent.', ['Vrai', 'Faux'], 0, 'Il faut demander de l’aide, sans attendre.'],
          ],
        },

        // ===================================================================
        // Chapitre 13 : Le monde microbien et la santé
        // ===================================================================
        {
          titre: 'La contamination par les micro-organismes et la mémoire immunitaire',
          axe: 'Le monde microbien et la santé',
          lecon: {
            titre: 'Comment le corps se défend, et comment il apprend',
            cours: `Malgré les barrières naturelles, un micro-organisme peut franchir la peau ou une muqueuse : c’est la **contamination**. S’il se multiplie dans l’organisme, il y a **infection**. Le **système immunitaire** intervient alors en deux temps.

## La réponse immédiate : l’immunité innée
Elle est **rapide** (quelques minutes à quelques heures) et **non spécifique** : elle traite tous les intrus de la même façon. Elle se manifeste par la **réaction inflammatoire** — rougeur, chaleur, gonflement, douleur — et par la **phagocytose** : des globules blancs appelés **phagocytes** englobent le micro-organisme et le digèrent. Dans la plupart des cas, cela suffit.

## La réponse adaptative
Si l’infection persiste, une réponse **plus lente** (quelques jours) mais **spécifique** se met en place, portée par les **lymphocytes**.
- Les **lymphocytes B** fabriquent des **anticorps**, protéines en forme de Y qui se fixent **spécifiquement** sur un **antigène** — un élément reconnu comme étranger — et neutralisent le micro-organisme, qui est ensuite phagocyté.
- Les **lymphocytes T** détruisent directement les cellules infectées.

> Un anticorps ne reconnaît **qu’un seul** antigène : c’est la clé de la spécificité, et c’est aussi ce qui explique qu’on puisse attraper plusieurs fois un rhume, provoqué chaque fois par un virus différent.

## La mémoire immunitaire
Après une infection, une partie des lymphocytes devient des **cellules mémoire**, qui persistent des années. Lors d’un second contact avec le même antigène, la réponse est **beaucoup plus rapide et plus intense** : le micro-organisme est éliminé avant même de provoquer des symptômes. La personne est **immunisée**.

## La vaccination
Le **vaccin** exploite exactement ce mécanisme : il présente à l’organisme un antigène rendu inoffensif (micro-organisme tué, atténué, fragment, ou instruction pour en fabriquer un fragment). Il déclenche une réponse et surtout une **mémoire**, **sans** provoquer la maladie. Un **rappel** entretient cette mémoire.

## L’immunité collective
Quand une proportion suffisante d’une population est immunisée, le micro-organisme ne circule plus assez pour atteindre les personnes non protégées — nourrissons, immunodéprimés. C’est ce qui a permis d’**éradiquer la variole** en 1980.`,
          },
          questions: [
            ['Quelle différence entre contamination et infection ?', ['La contamination est l’entrée du micro-organisme, l’infection sa multiplication', 'La contamination est bactérienne, l’infection virale', 'La contamination est bénigne, l’infection grave', 'Les deux termes sont synonymes'], 0, 'Toute contamination ne débouche pas sur une infection.'],
            ['Qu’est-ce que la phagocytose ?', ['Un globule blanc englobe et digère le micro-organisme', 'Un anticorps neutralise un antigène', 'Un lymphocyte détruit une cellule infectée', 'Une barrière naturelle bloque l’entrée d’un microbe'], 0, 'C’est une réponse rapide et non spécifique.'],
            ['Quels signes caractérisent la réaction inflammatoire ?', ['Rougeur, chaleur, gonflement et douleur', 'Fièvre uniquement', 'Toux et éternuements', 'Fatigue et pâleur'], 0, 'Elle accompagne la réponse immunitaire innée.'],
            ['Que fabriquent les lymphocytes B ?', ['Des anticorps', 'Des phagocytes', 'Des antigènes', 'Des cellules infectées'], 0, 'Les lymphocytes T détruisent les cellules infectées.'],
            ['Quelle est la propriété essentielle d’un anticorps ?', ['Il ne reconnaît qu’un seul antigène', 'Il détruit tous les micro-organismes', 'Il agit immédiatement dès la contamination', 'Il remplace les phagocytes'], 0, 'C’est le principe de la spécificité immunitaire.'],
            ['Qu’est-ce que la mémoire immunitaire ?', ['Des cellules qui persistent et rendent la réponse plus rapide au second contact', 'La capacité du corps à oublier une infection', 'La transmission de l’immunité aux enfants', 'Le stockage des anticorps dans le foie'], 0, 'C’est ce qui rend une personne immunisée.'],
            ['Sur quel mécanisme repose la vaccination ?', ['La création d’une mémoire immunitaire sans provoquer la maladie', 'L’injection directe d’anticorps', 'La destruction des barrières naturelles', 'L’élimination du microbiote'], 0, 'Un rappel entretient cette mémoire.'],
            ['L’immunité collective protège aussi les personnes qui ne peuvent pas être vaccinées.', ['Vrai', 'Faux'], 0, 'Le micro-organisme ne circule plus assez pour les atteindre.'],
          ],
        },
        {
          titre: 'Prévenir et soigner les infections',
          axe: 'Le monde microbien et la santé',
          lecon: {
            titre: 'Hygiène, vaccins, antibiotiques : trois leviers distincts',
            cours: `Face aux infections, trois moyens complémentaires existent — et il est essentiel de ne pas les confondre.

## Prévenir la contamination
L’**hygiène** reste le premier levier : lavage des mains, eau potable, assainissement, cuisson et conservation des aliments, protection des plaies, aération des locaux. En milieu de soins s’y ajoutent l’**asepsie** (éviter l’arrivée des microbes : stérilisation, matériel à usage unique) et l’**antisepsie** (éliminer ceux déjà présents sur la peau, par un antiseptique).

Pour les infections **sexuellement transmissibles**, le **préservatif** est le seul moyen qui protège à la fois des IST et d’une grossesse non désirée ; le dépistage permet de traiter tôt et d’éviter la transmission.

## Prévenir la maladie : la vaccination
Le vaccin prépare l’organisme **avant** la rencontre. Certains vaccins sont **obligatoires** en France pour les jeunes enfants, d’autres **recommandés** (papillomavirus, grippe, rappels). La vaccination protège l’individu **et** la collectivité. C’est une mesure **préventive** : elle n’a aucun effet sur une infection déjà déclarée.

## Soigner : les antibiotiques
Un **antibiotique** est une substance qui tue les **bactéries** ou bloque leur multiplication. Il est **sans aucun effet sur les virus** : grippe, rhume, bronchiolite, angine virale ne s’en traitent pas. Le médecin peut recourir à un **test rapide** (angine) ou à un **antibiogramme** pour choisir la molécule efficace.

> Deux règles : **le bon antibiotique** et **le traitement complet**. Arrêter dès qu’on va mieux laisse survivre les bactéries les plus résistantes.

## L’antibiorésistance
Un usage excessif ou mal conduit sélectionne les bactéries résistantes — c’est la sélection naturelle appliquée aux microbes. Certaines infections deviennent difficiles à traiter, et l’OMS classe l’antibiorésistance parmi les grandes menaces sanitaires mondiales. D’où la campagne : « les antibiotiques, c’est pas automatique ».

## Sérum et antiviraux
Le **sérum thérapeutique** apporte des anticorps déjà formés : il agit **immédiatement** mais **sans mémoire**, et sert en urgence. Les **antiviraux** ciblent les virus, mais sont peu nombreux et spécifiques.

## Ce qui a changé l’espérance de vie
Eau potable, assainissement, hygiène, vaccination et antibiotiques ont fait reculer la mortalité infectieuse plus qu’aucune autre avancée médicale. Les préserver est un enjeu collectif.`,
          },
          questions: [
            ['Quelle différence entre asepsie et antisepsie ?', ['L’asepsie évite l’arrivée des microbes, l’antisepsie élimine ceux déjà présents', 'L’asepsie concerne la peau, l’antisepsie le matériel', 'L’asepsie utilise des antibiotiques', 'Les deux termes sont synonymes'], 0, 'Stérilisation d’un côté, antiseptique de l’autre.'],
            ['Contre quoi les antibiotiques sont-ils efficaces ?', ['Contre les bactéries uniquement', 'Contre les virus uniquement', 'Contre tous les micro-organismes', 'Contre les champignons uniquement'], 0, 'Ils n’ont aucun effet sur une grippe ou un rhume.'],
            ['Pourquoi faut-il aller au bout d’un traitement antibiotique ?', ['Arrêter trop tôt laisse survivre les bactéries les plus résistantes', 'Pour éviter les effets secondaires', 'Pour renforcer la mémoire immunitaire', 'Pour ne pas gâcher le médicament'], 0, 'C’est l’un des mécanismes de l’antibiorésistance.'],
            ['Qu’est-ce qu’un antibiogramme ?', ['Un test qui identifie l’antibiotique efficace contre une bactérie donnée', 'Un vaccin contre les bactéries', 'Un dosage sanguin d’anticorps', 'Un examen radiologique'], 0, 'Il permet de choisir la bonne molécule.'],
            ['La vaccination agit-elle sur une infection déjà déclarée ?', ['Non, c’est une mesure préventive', 'Oui, elle guérit l’infection', 'Oui, si elle est faite le premier jour', 'Uniquement chez l’enfant'], 0, 'Elle prépare l’organisme avant la rencontre avec l’agent infectieux.'],
            ['Quel moyen protège à la fois des IST et d’une grossesse non désirée ?', ['Le préservatif', 'La pilule', 'Le stérilet', 'L’implant'], 0, 'Les autres contraceptifs ne protègent pas des infections.'],
            ['Quelle est la particularité du sérum thérapeutique ?', ['Il agit immédiatement mais ne laisse pas de mémoire', 'Il agit lentement et crée une mémoire durable', 'Il tue les bactéries comme un antibiotique', 'Il empêche la contamination'], 0, 'Il apporte des anticorps déjà formés, en urgence.'],
            ['L’antibiorésistance est classée par l’OMS parmi les grandes menaces sanitaires mondiales.', ['Vrai', 'Faux'], 0, 'Un usage excessif sélectionne les bactéries résistantes.'],
          ],
        },

        // ===================================================================
        // Chapitre 14 : Reproduction et comportements sexuels responsables
        // ===================================================================
        {
          titre: 'La puberté et le fonctionnement des appareils génitaux',
          axe: 'Reproduction et comportements sexuels responsables',
          lecon: {
            titre: 'Devenir capable de se reproduire',
            cours: `La **puberté** est la période de transformation qui rend l’organisme **capable de se reproduire**. Elle se déroule en moyenne entre 10 et 16 ans, avec de **grandes variations individuelles** parfaitement normales.

## Ce qui change
- **Caractères sexuels primaires** : les organes génitaux se développent et deviennent fonctionnels.
- **Caractères sexuels secondaires** : pilosité, développement des seins, mue de la voix, élargissement des hanches ou des épaules, poussée de croissance, modification de la peau.
- **Transformations psychologiques et sociales** : nouvelles émotions, sentiment amoureux, besoin d’autonomie, rapport au corps et au regard des autres.

## Ce qui déclenche tout
Le **cerveau** commande. L’**hypophyse**, une petite glande située à sa base, libère des **hormones** qui circulent dans le sang et activent les **gonades** — les **testicules** chez le garçon, les **ovaires** chez la fille. Ceux-ci produisent à leur tour la **testostérone** ou les **œstrogènes** et la **progestérone**, responsables des transformations.

> Une **hormone** est un message chimique produit par une glande, transporté par le sang, et qui n’agit que sur les cellules capables de le reconnaître.

## L’appareil génital masculin
Les **testicules** produisent, **de façon continue à partir de la puberté et pendant toute la vie**, des **spermatozoïdes**. Ceux-ci mûrissent dans l’**épididyme**, transitent par les **canaux déférents** et sont mélangés aux sécrétions des **vésicules séminales** et de la **prostate** pour former le **sperme**, émis lors de l’**éjaculation**.

## L’appareil génital féminin
Les **ovaires** contiennent dès la naissance un stock d’ovules. À partir de la puberté, **un ovule** est libéré environ **tous les 28 jours** : c’est l’**ovulation**, au milieu du **cycle menstruel**. Il est capté par une **trompe**, où peut avoir lieu la fécondation. L’**utérus** prépare chaque cycle une muqueuse épaissie pour accueillir un embryon ; sans fécondation, elle est éliminée : ce sont les **règles**, qui marquent le premier jour du cycle. Ce fonctionnement cyclique s’arrête à la **ménopause**.

## Ce qu’il faut retenir sur la fertilité
Dès la première ovulation — qui précède les premières règles — une grossesse est possible. Chez le garçon, dès les premières éjaculations. Les cycles irréguliers du début n’offrent aucune protection.`,
          },
          questions: [
            ['Qu’est-ce que la puberté ?', ['La période qui rend l’organisme capable de se reproduire', 'Le début de la croissance', 'La fin de la croissance osseuse', 'La première année de la vie'], 0, 'Elle s’accompagne de transformations physiques et psychologiques.'],
            ['Quelle glande du cerveau déclenche la puberté ?', ['L’hypophyse', 'La thyroïde', 'Le pancréas', 'La glande surrénale'], 0, 'Ses hormones activent les testicules ou les ovaires.'],
            ['Qu’est-ce qu’une hormone ?', ['Un message chimique produit par une glande et transporté par le sang', 'Un message nerveux transmis par un nerf', 'Une cellule reproductrice', 'Une protéine du muscle'], 0, 'Elle n’agit que sur les cellules capables de la reconnaître.'],
            ['Comment les testicules produisent-ils les spermatozoïdes ?', ['De façon continue à partir de la puberté', 'Une fois par mois', 'Uniquement pendant l’adolescence', 'Par cycles de 28 jours'], 0, 'La production dure toute la vie.'],
            ['Qu’est-ce que l’ovulation ?', ['La libération d’un ovule par un ovaire, environ tous les 28 jours', 'La formation d’un ovule dans l’utérus', 'L’élimination de la muqueuse utérine', 'La fusion de l’ovule et du spermatozoïde'], 0, 'Elle a lieu au milieu du cycle menstruel.'],
            ['Que sont les règles ?', ['L’élimination de la muqueuse utérine en l’absence de fécondation', 'La libération de l’ovule', 'Une infection bénigne', 'Le début de la grossesse'], 0, 'Elles marquent le premier jour du cycle.'],
            ['Où a lieu la fécondation chez la femme ?', ['Dans une trompe', 'Dans l’utérus', 'Dans l’ovaire', 'Dans le vagin'], 0, 'L’embryon migre ensuite vers l’utérus.'],
            ['Une grossesse est possible dès la première ovulation, avant même les premières règles.', ['Vrai', 'Faux'], 0, 'Les cycles irréguliers du début n’offrent aucune protection.'],
          ],
        },
        {
          titre: 'De la fécondation à la naissance',
          axe: 'Reproduction et comportements sexuels responsables',
          lecon: {
            titre: 'Neuf mois de développement',
            cours: `La **fécondation** a lieu dans une **trompe** : un seul **spermatozoïde** pénètre l’**ovule**, et les deux noyaux fusionnent. La **cellule œuf** ainsi formée contient 46 chromosomes et porte déjà toute l’information du futur individu — dont son sexe, déterminé par le chromosome apporté par le spermatozoïde (X ou Y).

## Les premiers jours
La cellule œuf se **divise** en descendant vers l’utérus. Vers le **6e ou 7e jour**, l’amas de cellules s’implante dans la muqueuse utérine : c’est la **nidation**. Sans nidation, il n’y a pas de grossesse.

## Embryon puis fœtus
- De la nidation à la **8e semaine** : l’**embryon** met en place tous les organes (**organogenèse**). C’est la période la **plus sensible** aux agressions extérieures.
- De la 9e semaine à la naissance : le **fœtus** grandit, ses organes achèvent leur maturation. Il mesure environ 3 cm à 8 semaines et 50 cm à terme.

## Les échanges avec la mère
Le **placenta** est l’organe des échanges. Les sangs maternel et fœtal **ne se mélangent pas** : ils circulent de part et d’autre d’une barrière très fine, à travers laquelle passent le **dioxygène** et les **nutriments** vers le fœtus, et le **dioxyde de carbone** et les **déchets** vers la mère. Le **cordon ombilical** relie le fœtus au placenta ; le **liquide amniotique** l’amortit, le protège des chocs et maintient sa température.

> Le placenta n’est **pas** un filtre absolu : alcool, tabac, drogues, certains médicaments et certains virus le traversent.

## Ce qui protège la grossesse
Aucun alcool — il n’existe **aucune dose sans risque** —, pas de tabac ni de drogue, pas de médicament sans avis médical, une alimentation équilibrée, la vaccination à jour, et un **suivi médical** régulier : consultations, **échographies** (datation, morphologie, croissance), analyses.

## L’accouchement
Après environ **9 mois** (39 semaines depuis la fécondation), les contractions de l’utérus dilatent le col, le bébé est expulsé, le cordon est coupé, puis le placenta est délivré. Le nouveau-né respire alors par lui-même et sa circulation se réorganise en quelques minutes.

## Les débuts de la vie
L’allaitement ou le lait infantile assurent la nutrition ; le nouveau-né bénéficie encore quelques mois des **anticorps** transmis par sa mère, avant que son propre système immunitaire ne prenne le relais.`,
          },
          questions: [
            ['Où a lieu la fécondation ?', ['Dans une trompe', 'Dans l’utérus', 'Dans l’ovaire', 'Dans le placenta'], 0, 'La cellule œuf descend ensuite vers l’utérus.'],
            ['Qu’est-ce que la nidation ?', ['L’implantation de l’embryon dans la muqueuse utérine', 'La fusion des noyaux des gamètes', 'La formation du placenta', 'La première division cellulaire'], 0, 'Elle a lieu vers le 6e ou 7e jour.'],
            ['Quelle période met en place tous les organes ?', ['Les huit premières semaines, stade embryonnaire', 'Le dernier trimestre', 'Les deux dernières semaines', 'Le neuvième mois'], 0, 'C’est aussi la période la plus sensible aux agressions.'],
            ['Les sangs de la mère et du fœtus se mélangent-ils ?', ['Non, ils circulent de part et d’autre d’une barrière fine', 'Oui, complètement', 'Oui, à partir du sixième mois', 'Uniquement pendant l’accouchement'], 0, 'Les échanges se font par diffusion à travers le placenta.'],
            ['Que passe du placenta vers le fœtus ?', ['Le dioxygène et les nutriments', 'Le dioxyde de carbone et l’urée', 'Uniquement de l’eau', 'Des globules rouges maternels'], 0, 'Les déchets font le trajet inverse.'],
            ['À quoi sert le liquide amniotique ?', ['À amortir les chocs et maintenir la température du fœtus', 'À nourrir le fœtus', 'À oxygéner le sang fœtal', 'À déclencher l’accouchement'], 0, 'Le cordon ombilical assure, lui, les échanges.'],
            ['Quelle quantité d’alcool est sans risque pendant la grossesse ?', ['Aucune', 'Un verre par semaine', 'Un verre par jour', 'Un verre par mois'], 0, 'L’alcool traverse le placenta et atteint le fœtus.'],
            ['Le nouveau-né bénéficie quelques mois des anticorps transmis par sa mère.', ['Vrai', 'Faux'], 0, 'Son propre système immunitaire prend ensuite le relais.'],
          ],
        },
        {
          titre: 'La contraception et la procréation médicalement assistée',
          axe: 'Reproduction et comportements sexuels responsables',
          lecon: {
            titre: 'Choisir d’avoir un enfant, ou d’attendre',
            cours: `Maîtriser sa **procréation**, c’est pouvoir éviter une grossesse non désirée — la **contraception** — et, à l’inverse, être aidé lorsqu’une grossesse souhaitée ne vient pas.

## Les moyens de contraception
- **Hormonaux** : **pilule** (bloque l’ovulation), implant, patch, anneau, injection. Efficaces s’ils sont pris régulièrement.
- **Mécaniques** : **préservatif** masculin ou féminin, **stérilet** (dispositif intra-utérin, hormonal ou au cuivre), diaphragme.
- **Définitifs** : ligature des trompes, vasectomie — réservés à l’adulte, après réflexion et délai légal.
- La **contraception d’urgence** (« pilule du lendemain ») s’utilise après un rapport non protégé ou un accident de contraception, le plus tôt possible. Elle est délivrée sans ordonnance, gratuitement pour les mineures, et ne remplace **jamais** une contraception régulière.

> Un seul moyen protège **à la fois** d’une grossesse et des **infections sexuellement transmissibles** : le **préservatif**.

## Comment choisir
Un moyen adapté dépend de l’âge, de la santé, du mode de vie, des contre-indications et du désir de chacun. La consultation, gratuite et **confidentielle** pour les mineurs en centre de santé sexuelle (ex-planning familial), permet d’en parler et d’obtenir une prescription.

## L’IVG
L’**interruption volontaire de grossesse** est un droit en France, autorisée par la loi Veil de 1975. Elle est possible jusqu’à **14 semaines de grossesse** (16 semaines d’aménorrhée), par voie médicamenteuse ou chirurgicale, et prise en charge à 100 %. Elle n’est pas un moyen de contraception, mais un droit garanti.

## L’infertilité
Un couple sur six consulte pour des difficultés à concevoir. Les causes peuvent être féminines (trompes obstruées, troubles de l’ovulation, endométriose), masculines (spermatozoïdes peu nombreux ou peu mobiles), mixtes, ou inexpliquées.

## L’assistance médicale à la procréation
- **Stimulation ovarienne** : des hormones déclenchent ou régularisent l’ovulation.
- **Insémination artificielle** : le sperme est déposé directement dans l’utérus.
- **FIV** (fécondation in vitro) : la rencontre des gamètes se fait au laboratoire, puis un embryon est transféré dans l’utérus.
- **ICSI** : un spermatozoïde unique est injecté dans l’ovule.
- Recours possible à un **don** de gamètes.

Ces techniques posent des questions **éthiques** — devenir des embryons congelés, anonymat des donneurs, accès aux techniques — que la **loi de bioéthique**, régulièrement révisée, tranche par le débat démocratique et non par la seule science.`,
          },
          questions: [
            ['Comment la pilule contraceptive agit-elle principalement ?', ['Elle bloque l’ovulation', 'Elle détruit les spermatozoïdes', 'Elle empêche la nidation uniquement', 'Elle ferme les trompes'], 0, 'C’est une contraception hormonale.'],
            ['Quel moyen protège à la fois d’une grossesse et des IST ?', ['Le préservatif', 'La pilule', 'L’implant', 'Le stérilet'], 0, 'C’est le seul à assurer cette double protection.'],
            ['Que faut-il savoir sur la contraception d’urgence ?', ['Elle s’utilise le plus tôt possible et ne remplace pas une contraception régulière', 'Elle protège pendant un mois', 'Elle nécessite toujours une ordonnance', 'Elle est efficace à 100 %'], 0, 'Elle est gratuite pour les mineures et délivrée sans ordonnance.'],
            ['Jusqu’à quel terme l’IVG est-elle possible en France ?', ['14 semaines de grossesse', '8 semaines de grossesse', '20 semaines de grossesse', '6 semaines de grossesse'], 0, 'Soit 16 semaines d’aménorrhée, avec prise en charge à 100 %.'],
            ['Qu’est-ce qu’une FIV ?', ['Une fécondation réalisée au laboratoire, suivie d’un transfert d’embryon', 'Le dépôt de sperme dans l’utérus', 'Une stimulation hormonale de l’ovulation', 'Une opération des trompes'], 0, 'L’ICSI consiste à injecter un seul spermatozoïde dans l’ovule.'],
            ['Qu’est-ce que l’insémination artificielle ?', ['Le dépôt du sperme directement dans l’utérus', 'La fécondation en laboratoire', 'Le don d’ovocytes', 'La congélation d’embryons'], 0, 'Elle est plus simple qu’une fécondation in vitro.'],
            ['La consultation en centre de santé sexuelle est-elle confidentielle pour un mineur ?', ['Oui, et gratuite', 'Non, l’accord parental est obligatoire', 'Oui, mais payante', 'Uniquement à partir de 16 ans'], 0, 'Elle permet d’obtenir information et prescription.'],
            ['Les questions éthiques posées par l’assistance médicale à la procréation sont tranchées par la loi de bioéthique.', ['Vrai', 'Faux'], 0, 'Le débat démocratique décide, pas la science seule.'],
          ],
        },
      ],
    },
  ],
}
