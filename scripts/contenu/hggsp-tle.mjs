// HGGSP — spécialité TERMINALE : les 24 fiches du programme officiel, rangées
// sous leurs 6 chapitres (les 6 thèmes du BO).
//
// CE QU'IL Y AVAIT (sondé le 20/08/2026) : QUATRE chapitres composites hérités
// des migrations 008 / 054 / 075 / 147 — « Environnement : exploiter,
// préserver », « Guerres et paix », « L'enjeu de la connaissance », « Le
// patrimoine ». Chacun résumait tout un thème du programme en UNE fiche, et
// DEUX thèmes sur six n'existaient nulle part : « De nouveaux espaces de
// conquête » (mers, océans, espace extra-atmosphérique) et « Histoire et
// mémoires ». Un élève qui révisait la conquête spatiale, la convention de
// Montego Bay, la guerre d'Algérie, le procès Eichmann ou le TPIR ne trouvait
// rien.
//
// LE DÉCOUPAGE EN 6 CHAPITRES × 4 FICHES vient de la maquette de référence
// transmise par Lucas, qui suit thème par thème le programme de spécialité. La
// page matière affiche « Chapitre N » (hggsp n'est pas dans MATIERES_SANS_ORDRE,
// cf. lib/subject-template.ts) : c'est l'ORDRE des 24 fiches, positions 1 → 24,
// qui porte le regroupement, et `chapters.theme` qui l'affiche.
//
// PÉRIMÈTRE : LA TERMINALE SEULE. Le ménage est borné à `level = 'Tle'`. La
// PREMIÈRE reste en l'état — elle porte 4 fiches composites pour les 5 thèmes de
// son programme (il lui manque « Analyser les dynamiques des puissances
// internationales »), c'est un chantier à part.

export default {
  slug: 'hggsp',
  nom: 'HGGSP',

  titreMigration: 'HGGSP Tle — LES 24 FICHES DU PROGRAMME OFFICIEL',

  motif: `CONSTAT MESURÉ (node _ASSOCIE/sonde-chapitres.mjs Tle hggsp, 20/08/2026) :
la spécialité HGGSP de Terminale n'avait que QUATRE chapitres, taillés dans un
découpage maison hérité des migrations 008, 054, 075 et 147 (« Environnement :
exploiter, préserver », « Guerres et paix », « L'enjeu de la connaissance »,
« Le patrimoine »). Le programme en compte SIX, et chacun se déplie en quatre
fiches. Deux thèmes entiers n'avaient AUCUNE entrée : « De nouveaux espaces de
conquête » — mers, océans et espace extra-atmosphérique, soit la conquête
spatiale, le droit de la mer, les câbles sous-marins et la stratégie chinoise —
et « Histoire et mémoires » — la guerre d'Algérie, les responsabilités de 1914,
le génocide des Juifs et des Tsiganes, le jugement des crimes de masse au Rwanda
et dans les Balkans. Sur une spécialité à coefficient 16, dont l'épreuve dure
4 heures et porte sur deux thèmes tirés au sort, un tiers du programme était
hors d'atteinte.

Cette migration installe les 24 fiches du programme, rangées sous leurs 6
chapitres, et retire les 4 fiches composites qu'elles recouvrent.

⚠️ CE QUI EST PERDU AU PASSAGE : les 4 leçons « Exercices types » de la
migration 147 (2 exercices type bac corrigés chacune, aucun quiz en base, sondé
le 20/08/2026) et les 40 questions des leçons « L'essentiel du cours » qu'elles
accompagnaient — 10 par chapitre composite.

⚠️ LES MIGRATIONS 008, 054, 075 ET 147 SONT REJOUABLES : les recoller un jour
ferait revenir les 4 fiches composites en doublon.`,

  menage: [
    {
      raison: `La colonne chapters.theme (migration 234) conditionne tout ce qui suit :
ce module range ses 24 fiches sous 6 chapitres, et l'INSERT écrit la colonne.
Elle est REPRISE ici en ADD COLUMN IF NOT EXISTS, comme dans les migrations 243
à 255 : la 234 elle-même n'a jamais été exécutée. Sans cette reprise, la
migration échouerait sur "column chapters.theme does not exist" APRÈS avoir
supprimé les 4 fiches composites — une matière vide.
Le GRANT n'est pas décoratif : la 182 a révoqué le SELECT de table sur chapters
(pour cacher mind_map) et ne l'a rendu que colonne par colonne ; une colonne
ajoutée après elle n'hérite d'aucun droit.`,
      sql: `ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;`,
    },
    {
      raison: `Les 4 fiches composites partent, au niveau Tle SEULEMENT.
Le filtre level = 'Tle' est indispensable : hggsp existe aussi en 1re, avec les
mêmes deux leçons génériques ("L'essentiel du cours" et "Exercices types"), et
la première n'est pas touchée par cette migration.
La garde "theme IS NULL" rend le rejeu inoffensif. Aucune des 24 fiches neuves
ne porte l'un de ces quatre titres — ils ont été comparés un à un — mais le
ménage tourne AVANT les insertions à chaque rejeu, et les fiches neuves portent
toutes un axe dès l'INSERT tandis que les composites, antérieures à la 234, n'en
ont jamais eu : la garde les sépare quoi qu'il arrive.
L'ordre compte : la file "À revoir" d'abord (review_items.item_id n'a PAS de clé
étrangère — rien ne casserait, mais le compteur "X à revoir" continuerait de
compter des questions disparues), puis les quiz (quizzes.lesson_id est ON DELETE
SET NULL : ils survivraient orphelins, rattachés à aucune leçon et toujours
tirables par le moteur de questions), puis les chapitres, dont les leçons partent
en cascade.`,
      sql: `DELETE FROM public.review_items ri
 USING public.quiz_questions qq, public.quizzes qz, public.lessons l,
       public.chapters c, public.subjects s
 WHERE ri.item_kind = 'question'
   AND ri.item_id = qq.id
   AND qq.quiz_id = qz.id
   AND qz.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'hggsp'
   AND c.level = 'Tle'
   AND c.theme IS NULL
   AND c.title IN ('Environnement : exploiter, préserver',
                   'Guerres et paix',
                   'L''enjeu de la connaissance',
                   'Le patrimoine');

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'hggsp'
   AND c.level = 'Tle'
   AND c.theme IS NULL
   AND c.title IN ('Environnement : exploiter, préserver',
                   'Guerres et paix',
                   'L''enjeu de la connaissance',
                   'Le patrimoine');

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'hggsp'
   AND c.level = 'Tle'
   AND c.theme IS NULL
   AND c.title IN ('Environnement : exploiter, préserver',
                   'Guerres et paix',
                   'L''enjeu de la connaissance',
                   'Le patrimoine');`,
    },
  ],

  blocs: [
    {
      niveaux: ['Tle'],
      chapitres: [
        // ===================================================================
        // Chapitre 1 — De nouveaux espaces de conquête
        // ===================================================================
        {
          titre: 'Les spécificités de l’espace et des océans',
          axe: 'De nouveaux espaces de conquête',
          lecon: {
            titre: 'Deux immensités que le droit a voulu soustraire à l’appropriation',
            cours: `Océans et espace ont une histoire commune : longtemps hors d’atteinte, ils ont été déclarés « **bien commun** » **au moment même** où la technique permettait enfin de les exploiter. C’est toute la tension du thème.

## Deux immensités mal connues
| Espace | Ce qu’il représente |
| Les **océans** | **71 %** de la surface du globe, l’essentiel de la biodiversité — moins d’un quart des fonds cartographié avec précision |
| L’**espace extra-atmosphérique** | Il commence à **100 km** d’altitude (ligne de Kármán) : au-delà, **aucune souveraineté** nationale |

## Les ressources convoitées
| En mer | Dans l’espace |
| Ressources **halieutiques** (pêche) | Les **orbites**, ressource rare — surtout la géostationnaire, à 36 000 km |
| **Hydrocarbures offshore** | Les **fréquences radio**, attribuées par l’Union internationale des télécommunications |
| **Nodules polymétalliques** et terres rares des grands fonds | — |

## Deux textes fondateurs
| | **Montego Bay** (1982, en vigueur 1994) | **Traité de l’espace** (1967) |
| Le principe | Des zones de droits **graduées** | L’espace est « l’**apanage de l’humanité tout entière** » |
| L’appropriation | Souveraineté jusqu’à 12 milles | **Aucune** appropriation nationale possible |
| La militarisation | — | Pas d’**arme de destruction massive** en orbite |
| Sa faiblesse | La ZEE se surveille difficilement | Le traité sur la **Lune** (1979) n’a été ratifié par **aucune** grande puissance spatiale |

## Les zones maritimes
| Zone | Sa largeur | Ce qu’elle donne |
| **Mer territoriale** | **12 milles marins** | Souveraineté **pleine** |
| **Zone économique exclusive** | **200 milles** | Droits **exclusifs d’exploitation** |
| **Haute mer** | Au-delà | **Libre** |
| Les **grands fonds** | — | « **Patrimoine commun de l’humanité** », gérés par l’Autorité internationale des fonds marins |

> Un droit qui **interdit l’appropriation mais pas l’exploitation** : c’est par cette brèche que passent les États et les entreprises.

## Des espaces devenus vitaux
| Fait | Ce qu’il implique |
| **99 %** des données numériques mondiales passent par des **câbles sous-marins** | Une infrastructure invisible et vulnérable |
| **80 %** du commerce mondial en volume passe par la mer | Via des **détroits** exposés : Malacca, Ormuz, Bab el-Mandeb |
| GPS, météo, télécommunications, renseignement | La vie quotidienne dépend de **satellites** |

> Ces deux espaces ne sont plus des **marges** : ce sont des **infrastructures**.`,
          },
          questions: [
            ['Quelle convention fixe aujourd’hui le droit de la mer ?', ['La convention de Montego Bay (1982)', 'Le traité de Versailles (1919)', 'La convention de Genève (1949)', 'Le protocole de Kyoto (1997)'], 0, 'Signée en 1982, elle entre en vigueur en 1994 et découpe l’espace maritime en zones.'],
            ['Quelle est la largeur de la zone économique exclusive (ZEE) ?', ['200 milles marins', '12 milles marins', '50 milles marins', '500 milles marins'], 0, 'L’État y détient des droits exclusifs d’exploitation, mais pas la souveraineté pleine.'],
            ['À quelle altitude commence conventionnellement l’espace ?', ['100 km', '10 km', '1 000 km', '36 000 km'], 0, 'C’est la ligne de Kármán ; 36 000 km est l’altitude de l’orbite géostationnaire.'],
            ['Le traité de l’espace de 1967 interdit toute appropriation nationale de l’espace et des corps célestes.', ['Vrai', 'Faux'], 0, 'L’espace y est déclaré « apanage de l’humanité tout entière ».'],
            ['Par quoi transite l’essentiel des données numériques mondiales ?', ['Les câbles sous-marins', 'Les satellites géostationnaires', 'Les relais hertziens terrestres', 'Les réseaux mobiles'], 0, 'Environ 99 % du trafic : d’où la vulnérabilité stratégique de ces câbles.'],
            ['Que sont les nodules polymétalliques ?', ['Des concrétions minérales des grands fonds riches en métaux', 'Des réserves de gaz sous-marines', 'Des récifs coralliens artificiels', 'Des déchets industriels immergés'], 0, 'Nickel, cobalt, manganèse : leur exploitation est encadrée par l’Autorité internationale des fonds marins.'],
            ['Quelle est la largeur de la mer territoriale, où l’État exerce sa pleine souveraineté ?', ['12 milles marins', '200 milles marins', '24 milles marins', '3 milles marins'], 0, 'Au-delà s’ouvre la zone contiguë, puis la ZEE.'],
            ['La haute mer appartient à l’État côtier le plus proche.', ['Vrai', 'Faux'], 1, 'Elle est libre : nul ne peut se l’approprier, et ses grands fonds sont « patrimoine commun de l’humanité ».'],
          ],
        },
        {
          titre: 'Les enjeux géopolitiques de la conquête spatiale',
          axe: 'De nouveaux espaces de conquête',
          lecon: {
            titre: 'De la course à la Lune au New Space',
            cours: `La conquête spatiale n’a jamais été une aventure scientifique désintéressée : née de la guerre froide, elle est redevenue un terrain de rivalité — avec des acteurs **privés** en plus.

## Née de la guerre froide
Les fusées viennent des **V2 allemands**, dont ingénieurs et plans sont récupérés par les deux Grands en 1945.

| Date | L’événement | Pour qui |
| **1957** | **Spoutnik**, premier satellite | URSS |
| **1961** | **Gagarine**, premier homme dans l’espace | URSS |
| 1962 | Le discours de Kennedy | États-Unis |
| **1969** | **Apollo 11**, premiers pas sur la Lune | États-Unis |

> Chaque succès est une démonstration de supériorité technique, **donc militaire** : la fusée qui met un satellite en orbite peut porter une **ogive**.

## Le temps de la coopération
| Programme | Ce qu’il marque |
| **Apollo-Soyouz** (1975) | La détente jusque dans l’espace |
| L’**ISS**, assemblée à partir de 1998 | Quinze pays associés |
| L’**Agence spatiale européenne** (1975) et **Ariane** | L’Europe se dote de son **propre accès** à l’espace, depuis Kourou |

## Le retour de la rivalité
| Puissance | Ses jalons |
| **Chine** | Vol habité **2003**, face cachée de la Lune **2019**, station **Tiangong** |
| **Inde** | Alunissage près du **pôle Sud**, 2023 |
| **États-Unis** | **Space Force** (2019), programme **Artemis** de retour lunaire |

La militarisation avance : essais **antisatellites** chinois (2007), indien (2019), russe (2021).

## Le New Space
| Ce que le privé change | Sa conséquence |
| **SpaceX**, Blue Origin : des lanceurs **réutilisables** | Le coût de l’accès à l’orbite **s’effondre** |
| Des **constellations** de milliers de satellites (Starlink) | La puissance spatiale n’est plus **seulement étatique** |
| — | L’orbite basse s’encombre de **débris**, menace directe pour les satellites en service |

> Le thème se résume à une bascule : d’une compétition **entre deux États** à une compétition **entre puissances et entreprises**, sur un espace juridiquement inappropriable et physiquement saturé.`,
          },
          questions: [
            ['Quel satellite ouvre la conquête spatiale en 1957 ?', ['Spoutnik', 'Explorer 1', 'Vostok 1', 'Telstar'], 0, 'Le « choc du Spoutnik » soviétique pousse les États-Unis à créer la NASA en 1958.'],
            ['En quelle année a lieu le premier pas de l’homme sur la Lune ?', ['1969', '1961', '1975', '1957'], 0, 'Apollo 11, aboutissement de l’engagement pris par Kennedy en 1962.'],
            ['Quelle mission symbolise la coopération spatiale de la détente, en 1975 ?', ['Apollo-Soyouz', 'Apollo 13', 'Vostok 6', 'Mir'], 0, 'Un amarrage américano-soviétique en orbite, en pleine détente.'],
            ['Quelle station spatiale la Chine a-t-elle construite pour son propre compte ?', ['Tiangong', 'Mir', 'Skylab', 'Salyout'], 0, 'Écartée de l’ISS, la Chine s’est dotée de sa propre station.'],
            ['Qu’est-ce qui explique la chute du coût de l’accès à l’orbite depuis les années 2010 ?', ['Les lanceurs réutilisables', 'L’abandon des satellites', 'La fin des programmes militaires', 'Le passage aux ballons stratosphériques'], 0, 'C’est le pari technique de SpaceX, cœur du « New Space ».'],
            ['La conquête spatiale est restée un domaine exclusivement étatique.', ['Vrai', 'Faux'], 1, 'Le New Space fait des entreprises privées des acteurs majeurs de l’accès à l’espace.'],
            ['Quelle organisation donne à l’Europe un accès autonome à l’espace ?', ['L’Agence spatiale européenne', 'La NASA', 'L’OTAN', 'L’Union internationale des télécommunications'], 0, 'Créée en 1975, elle exploite les lanceurs Ariane depuis Kourou.'],
            ['Quel risque croissant menace directement les satellites en orbite basse ?', ['Les débris spatiaux', 'Le seul rayonnement solaire', 'La raréfaction des fréquences', 'La hausse du niveau des mers'], 0, 'Les essais antisatellites et les constellations multiplient les objets en orbite.'],
          ],
        },
        {
          titre: 'L’affirmation de la puissance des États à partir des espaces maritimes',
          axe: 'De nouveaux espaces de conquête',
          lecon: {
            titre: 'Contrôler la mer, c’est peser sur le monde',
            cours: `« Qui tient la mer tient le commerce du monde » : la formule attribuée à Walter Raleigh vaut encore. La maîtrise des espaces maritimes est un **attribut de puissance**.

## Ce qui se mesure
| Critère | Ce qu’il recouvre |
| La flotte de **guerre** | **Porte-avions**, sous-marins nucléaires lanceurs d’engins |
| La flotte de **commerce** | Maersk, CMA CGM, COSCO |
| Les **ports** | Capacité, hinterland, connexions |
| L’étendue de la **ZEE** | La France en détient la **deuxième du monde** — près de 11 millions de km², derrière les États-Unis |

## Les États-Unis, puissance maritime globale
Onze porte-avions, des bases prépositionnées sur toutes les mers, et une doctrine de **liberté de navigation** — les opérations FONOP.

> La marine américaine **garantit la sécurité des routes commerciales** — et par là même son influence.

## Trois espaces sous tension
| Espace | Ce qui s’y joue |
| **Mer de Chine méridionale** | La Chine revendique 80 à 90 % de la zone par sa « **ligne en neuf traits** » et militarise des **îles artificielles**, contre le Vietnam, les Philippines, la Malaisie |
| **Arctique** | La fonte ouvre des **routes** et l’accès aux hydrocarbures : Russie, Canada et Danemark revendiquent l’extension de leur **plateau continental** |
| Les **zones grises** | **Piraterie** (golfe d’Aden, golfe de Guinée), pêche illégale, trafics |

> En **2016**, la Cour permanente d’arbitrage a donné tort à Pékin sur la mer de Chine méridionale. **Pékin ignore la sentence** — la preuve que le droit de la mer n’a pas de gendarme.

> Une ZEE ne se **décrète** pas : elle se **surveille**. C’est pourquoi la puissance maritime reste **militaire autant que juridique**.

## La France, puissance maritime par ses outre-mer
| Territoire | Ce qu’il ouvre |
| Clipperton, Polynésie, Kerguelen, la Réunion, la Guyane | Chacun ouvre une **ZEE** |
| Bases de Djibouti, Nouvelle-Calédonie | Une **présence** permanente |

> Ces territoires donnent à la France une voix dans l’**Indo-Pacifique** — un statut qu’aucun autre pays européen ne possède.`,
          },
          questions: [
            ['Quel pays détient la deuxième zone économique exclusive du monde ?', ['La France', 'Le Royaume-Uni', 'La Chine', 'Le Japon'], 0, 'Près de 11 millions de km², grâce aux territoires ultramarins.'],
            ['Quelle zone maritime la Chine revendique-t-elle par sa « ligne en neuf traits » ?', ['La mer de Chine méridionale', 'La mer d’Okhotsk', 'Le golfe du Bengale', 'La mer Rouge'], 0, 'Une revendication portant sur 80 à 90 % de la zone, contestée par ses voisins.'],
            ['Qu’a décidé la Cour permanente d’arbitrage en 2016 au sujet de la mer de Chine méridionale ?', ['Elle a donné tort aux revendications chinoises', 'Elle a validé la ligne en neuf traits', 'Elle a partagé la zone en deux', 'Elle s’est déclarée incompétente'], 0, 'Pékin refuse d’appliquer la sentence : le droit ne vaut que si les États s’y plient.'],
            ['Qu’est-ce qu’une opération FONOP menée par la marine américaine ?', ['Une patrouille affirmant la liberté de navigation', 'Une opération humanitaire', 'Un exercice de lutte anti-pollution', 'Une mission de cartographie'], 0, 'Elle conteste par la présence les revendications maritimes jugées excessives.'],
            ['Pourquoi l’Arctique devient-il un espace de rivalités ?', ['La fonte de la banquise ouvre des routes et l’accès aux hydrocarbures', 'Sa population augmente rapidement', 'Il échappe à tout droit international', 'Il concentre la pêche mondiale'], 0, 'Russie, Canada et Danemark y revendiquent l’extension de leur plateau continental.'],
            ['La puissance maritime d’un État se mesure uniquement à sa flotte de guerre.', ['Vrai', 'Faux'], 1, 'Flotte de commerce, ports, compagnies et étendue de la ZEE comptent tout autant.'],
            ['Quelle région concentre aujourd’hui l’essentiel de la piraterie maritime en Afrique de l’Ouest ?', ['Le golfe de Guinée', 'La mer Méditerranée', 'La mer Baltique', 'La mer Noire'], 0, 'Avec le golfe d’Aden à l’est, c’est l’une des zones les plus exposées.'],
            ['Quelle part du commerce mondial, en volume, passe par la mer ?', ['Environ 80 %', 'Environ 20 %', 'Environ 50 %', 'Moins de 10 %'], 0, 'D’où l’importance stratégique des détroits comme Malacca ou Ormuz.'],
          ],
        },
        {
          titre: 'La Chine à la conquête de l’espace, des mers et des océans',
          axe: 'De nouveaux espaces de conquête',
          lecon: {
            titre: 'Une puissance qui prend la mer et le ciel',
            cours: `En quarante ans, la Chine est passée d’une puissance continentale repliée à un acteur majeur des mers **et** de l’espace. C’est l’étude de cas qui permet de relire tout le thème d’un seul point de vue.

## L’objectif politique affiché
Le « **rêve chinois** » de Xi Jinping vise le « grand renouveau de la nation » pour **2049**, centenaire de la République populaire.

> Mer et espace en sont deux instruments : ils effacent le souvenir du « **siècle des humiliations** », pendant lequel la Chine avait été **forcée d’ouvrir ses ports**.

## Une puissance maritime en une génération
| Levier | Ce qu’il représente |
| La **marine** | La **première du monde en nombre de bâtiments** : porte-avions Liaoning, Shandong, Fujian, et sous-marins nucléaires |
| Les **ports** | **Sept** des dix premiers ports à conteneurs mondiaux : Shanghai, Ningbo, Shenzhen |
| Les **routes de la soie** (2013) | Volet maritime : le Pirée, Gwadar, Hambantota, et une base militaire à **Djibouti** (2017) |
| Les **îles artificielles** | En mer de Chine méridionale : un rapport de force juridique transformé en **fait accompli** |

## Une puissance spatiale complète
| Jalon | Sa date |
| Premier **vol habité** | 2003 |
| Sonde sur la **face cachée de la Lune** | 2019 |
| Retour d’**échantillons lunaires** (Chang’e 5) | 2020 |
| **Rover** sur Mars | 2021 |
| Station **Tiangong** habitée en continu | Depuis 2021 |
| Système de navigation **Beidou** | Concurrent du GPS |

> La Chine dispose d’une **chaîne complète** : lanceurs, satellites, station, programme lunaire habité. Ce que peu d’États peuvent dire.

> Ce que la Chine construit en mer et dans l’espace, elle le construit d’abord comme une **infrastructure** — puis comme un **levier diplomatique**.

## Les limites
| Limite | Ce qu’elle produit |
| La dépendance aux **détroits** | Le « **dilemme de Malacca** » : l’essentiel des importations passe par un goulot qu’elle ne contrôle pas |
| La **méfiance des voisins** | Ils se rapprochent des États-Unis : **Quad**, **AUKUS** |
| Le **coût** des investissements | Et l’**endettement** des pays partenaires, qui alimente les critiques |

> La montée en puissance suscite mécaniquement des **contre-alliances**. C’est le paradoxe classique de la puissance.`,
          },
          questions: [
            ['Quel horizon Xi Jinping fixe-t-il au « rêve chinois » de renouveau national ?', ['2049, centenaire de la République populaire', '2030', '2100', '2025'], 0, 'La date structure les grands programmes chinois, maritimes comme spatiaux.'],
            ['En quelle année la Chine réalise-t-elle son premier vol habité ?', ['2003', '1992', '2013', '2019'], 0, 'Elle devient la troisième puissance à envoyer seule un homme dans l’espace.'],
            ['Quel système de navigation par satellites la Chine a-t-elle déployé face au GPS ?', ['Beidou', 'Galileo', 'Glonass', 'Starlink'], 0, 'Galileo est européen, Glonass russe : chaque puissance veut son autonomie.'],
            ['Où la Chine a-t-elle ouvert sa première base militaire à l’étranger, en 2017 ?', ['À Djibouti', 'Au Pirée', 'À Gwadar', 'À Hambantota'], 0, 'Sur la route stratégique de Bab el-Mandeb, verrou de la mer Rouge.'],
            ['Qu’appelle-t-on le « dilemme de Malacca » ?', ['La dépendance chinoise à un détroit qu’elle ne contrôle pas', 'Un conflit frontalier avec la Malaisie', 'Un litige sur la pêche', 'Une querelle de souveraineté avec l’Indonésie'], 0, 'L’essentiel des hydrocarbures chinois y transite, sous surveillance américaine.'],
            ['La Chine participe à la Station spatiale internationale.', ['Vrai', 'Faux'], 1, 'Écartée du programme, elle a construit sa propre station, Tiangong.'],
            ['Quel volet des nouvelles routes de la soie concerne les mers ?', ['Les investissements dans les ports étrangers', 'Les voies ferrées transcontinentales', 'Le financement de barrages', 'Les échanges universitaires'], 0, 'Pirée, Gwadar, Hambantota : une chaîne de ports jalonne la route maritime.'],
            ['Quelle réaction la montée en puissance chinoise a-t-elle provoquée dans l’Indo-Pacifique ?', ['Le rapprochement de ses voisins avec les États-Unis (Quad, AUKUS)', 'Un désengagement américain de la région', 'La dissolution de l’ASEAN', 'Un accord de partage de la mer de Chine'], 0, 'La puissance suscite des contre-alliances : c’est un classique des relations internationales.'],
          ],
        },
        // ===================================================================
        // Chapitre 2 — Faire la guerre, faire la paix
        // ===================================================================
        {
          titre: 'Conflits et tentatives de paix dans le monde contemporain',
          axe: 'Faire la guerre, faire la paix : formes de conflits et modes de résolution',
          lecon: {
            titre: 'Ce qu’on appelle « guerre », et ce qu’on appelle « paix »',
            cours: `Le thème s’ouvre sur une **question de définition**. Depuis 1945, les guerres déclarées entre États sont rares, mais la violence armée n’a pas reculé : elle a changé de forme — et la paix aussi.

## Définir la guerre
Pour **Clausewitz** (*De la guerre*, 1832), la guerre est « la continuation de la politique par d’autres moyens » : un affrontement de **volontés politiques**.

| Le modèle « classique », dit **trinitaire** | Ce qu’il suppose |
| Les acteurs | Des **États** |
| Les combattants | Des **armées régulières** |
| Le début | Une **déclaration** |
| La fin | Un **traité** |

## Pourquoi ce modèle ne suffit plus
| Depuis 1945 | Ce qui change |
| Les guerres sont surtout **intra-étatiques** | Guerres civiles, guérillas, insurrections |
| Elles ne se **déclarent** pas | Et ne se terminent pas par un traité |
| Les **civils** sont majoritairement les victimes | — |
| Les guerres sont **asymétriques** | Une armée régulière contre un adversaire irrégulier |

Mary Kaldor parle de « **nouvelles guerres** ».

## Définir la paix
| Type de paix | Ce qu’elle est |
| **Négative** | La simple **absence de guerre** : cessez-le-feu, trêve, ligne de démarcation |
| **Positive** (Johan Galtung) | Elle suppose la **justice**, la reconstruction, la réconciliation — elle s’installe dans la durée |

**Kant**, dans *Vers la paix perpétuelle* (1795), pose l’idée d’une **fédération d’États républicains** — matrice lointaine de la SDN puis de l’ONU.

> Un **conflit gelé** — Chypre, la Corée, le Cachemire — est une paix **négative qui dure** : les armes se sont tues, le différend n’est pas réglé.

## Les acteurs de la paix
| Acteur | Son rôle |
| Les **États** | La négociation et la garantie |
| L’**ONU** | Casques bleus, opérations de maintien de la paix |
| Les organisations **régionales** | Union africaine, OTAN, Union européenne |
| Les **ONG** et médiateurs privés | Le contact quand les États ne se parlent plus |

> Les conflits contemporains mêlent **tous** ces acteurs, plus des **groupes armés non étatiques** et des **sociétés militaires privées**. C’est ce qui rend la sortie de guerre si difficile à organiser.`,
          },
          questions: [
            ['Pour Clausewitz, la guerre est…', ['la continuation de la politique par d’autres moyens', 'un accident de l’histoire', 'un phénomène purement économique', 'une maladie des sociétés'], 0, 'Elle est un instrument au service d’une fin politique, pas une fin en soi.'],
            ['Qu’est-ce qu’une paix négative ?', ['La simple absence de guerre, sans règlement du différend', 'Une paix imposée par un vainqueur', 'Une paix accompagnée de réparations', 'Une paix garantie par l’ONU'], 0, 'Par opposition à la paix positive, qui suppose justice et réconciliation.'],
            ['Depuis 1945, quelle forme de conflit domine ?', ['Les conflits intra-étatiques', 'Les guerres déclarées entre États', 'Les guerres coloniales', 'Les guerres de succession dynastique'], 0, 'Guerres civiles, guérillas et insurrections l’emportent sur la guerre classique.'],
            ['Qu’appelle-t-on un conflit asymétrique ?', ['Une armée régulière face à un adversaire irrégulier', 'Un conflit entre deux armées de taille égale', 'Un conflit sans victimes civiles', 'Une guerre menée uniquement par des drones'], 0, 'La disproportion des moyens y change les formes de combat.'],
            ['Quel philosophe pose en 1795 le projet d’une paix perpétuelle entre États ?', ['Kant', 'Machiavel', 'Hobbes', 'Rousseau'], 0, 'Son projet de fédération d’États républicains inspire la SDN puis l’ONU.'],
            ['Un conflit gelé signifie que le différend a été réglé.', ['Vrai', 'Faux'], 1, 'Les armes se taisent, mais le désaccord demeure : Chypre, la Corée, le Cachemire.'],
            ['Qui a forgé la distinction entre paix négative et paix positive ?', ['Johan Galtung', 'Clausewitz', 'Mary Kaldor', 'Raymond Aron'], 0, 'Le fondateur des études sur la paix, dans les années 1960.'],
            ['Quelle est la principale victime des conflits contemporains ?', ['Les populations civiles', 'Les armées régulières', 'Les forces de maintien de la paix', 'Les sociétés militaires privées'], 0, 'C’est l’un des traits majeurs des « nouvelles guerres ».'],
          ],
        },
        {
          titre: 'De la guerre entre États à de nouvelles formes de conflits',
          axe: 'Faire la guerre, faire la paix : formes de conflits et modes de résolution',
          lecon: {
            titre: 'De la guerre de Trente Ans au terrorisme et au cyber',
            cours: `Ce jalon suit la mutation des conflits sur quatre siècles : de la guerre de **religion** à la guerre d’**État**, puis de la guerre d’État aux **conflits diffus** d’aujourd’hui.

## Le modèle : la guerre de Trente Ans (1618-1648)
Guerre de religion devenue guerre européenne, elle ravage l’Empire et coûte peut-être **un tiers** de sa population à certaines régions.

> Elle se clôt par les **traités de Westphalie (1648)**, acte de naissance du **système des États souverains** : chaque État est maître chez lui, et les relations internationales deviennent des relations **entre États**.

## L’âge de la guerre totale
| Étape | Ce qu’elle ajoute |
| La Révolution et l’Empire | La **levée en masse** |
| La **Première Guerre mondiale** | L’industrie, l’économie et les sociétés entières au service du front |
| La **Seconde** | Le **bombardement stratégique** des villes et l’extermination |

> La distinction entre **combattants et civils s’efface**. C’est ce que résume l’expression « guerre totale ».

## Les conflits contemporains
| Forme | Son principe | Ses exemples |
| **Terrorisme** | Une violence **non étatique** cherchant un effet politique **par la peur** | Al-Qaïda (11 septembre 2001), Daech (2015-2016 en France) |
| **Guerres hybrides** | Forces régulières, milices, mercenaires, désinformation, cyberattaques — **sans déclaration** | L’annexion de la **Crimée**, 2014 |
| **Cyberconflictualité** | Attaques d’infrastructures, espionnage, manipulation de l’information | Estonie 2007, **Stuxnet** contre le programme nucléaire iranien |

La riposte au terrorisme prend la forme d’une « **guerre contre le terrorisme** » aux contours flous : Afghanistan, Sahel.

> Ces guerres n’ont **ni ligne de front ni traité de paix** : elles n’ont donc **pas de fin claire**. C’est leur trait commun, et ce qui les distingue du modèle westphalien.

## Ce qui reste de la guerre classique
L’invasion de l’**Ukraine en 2022** rappelle que la guerre interétatique de **haute intensité** — chars, artillerie, front continu — n’a pas disparu.

> Elle **coexiste** désormais avec les drones et la guerre informationnelle. Le mot juste n’est pas « remplacement », mais **superposition**.`,
          },
          questions: [
            ['Quels traités mettent fin à la guerre de Trente Ans en 1648 ?', ['Les traités de Westphalie', 'Le traité de Versailles', 'Le traité d’Utrecht', 'Le congrès de Vienne'], 0, 'Ils fondent le système des États souverains.'],
            ['Qu’instaure le système westphalien ?', ['La souveraineté des États sur leur territoire', 'Un gouvernement mondial', 'La liberté religieuse universelle', 'L’interdiction de la guerre'], 0, 'Chaque État est maître chez lui : c’est la matrice du droit international moderne.'],
            ['Qu’est-ce qu’une guerre hybride ?', ['Un conflit mêlant forces régulières, milices, cyberattaques et désinformation', 'Une guerre entre deux coalitions', 'Une guerre limitée à la mer', 'Un conflit arbitré par l’ONU'], 0, 'La Crimée en 2014 en est le cas d’école : agression sans déclaration.'],
            ['Quel attentat marque l’entrée du terrorisme djihadiste dans l’agenda mondial ?', ['Le 11 septembre 2001', 'L’attentat de Munich en 1972', 'Les attentats de Madrid en 2004', 'L’attentat d’Oklahoma City'], 0, 'Il déclenche la « guerre contre le terrorisme » et l’intervention en Afghanistan.'],
            ['Quel virus informatique a visé le programme nucléaire iranien ?', ['Stuxnet', 'WannaCry', 'NotPetya', 'Mirai'], 0, 'Une cyberattaque produisant un effet physique : les centrifugeuses en ont été détruites.'],
            ['Les guerres interétatiques de haute intensité ont totalement disparu depuis 1945.', ['Vrai', 'Faux'], 1, 'L’invasion de l’Ukraine en 2022 en administre la preuve inverse.'],
            ['Qu’est-ce que la guerre totale ?', ['Une guerre mobilisant l’ensemble des ressources et des populations', 'Une guerre menée sur tous les continents', 'Une guerre sans prisonniers', 'Une guerre menée sans alliés'], 0, 'Économie, science et sociétés entières sont mises au service du front.'],
            ['Quel acteur privé russe illustre le recours aux mercenaires dans les conflits récents ?', ['Le groupe Wagner', 'Blackwater', 'La Légion étrangère', 'Les Casques bleus'], 0, 'Sociétés militaires privées et milices brouillent la responsabilité des États.'],
          ],
        },
        {
          titre: 'Construire la paix par la diplomatie',
          axe: 'Faire la guerre, faire la paix : formes de conflits et modes de résolution',
          lecon: {
            titre: 'De Westphalie à l’ONU : les institutions de la paix',
            cours: `Faire la paix n’est pas seulement **arrêter de se battre** : c’est construire des règles, des institutions et des procédures qui rendent la guerre **moins probable**. Le jalon suit cette construction — et ses échecs.

## Le congrès de Vienne (1814-1815)
Il organise l’Europe autour d’un **équilibre** entre grandes puissances et d’un « **concert européen** » de consultations régulières.

| Sa réussite | Sa limite |
| Il stabilise le continent pour un **demi-siècle** | Il **ignore les nationalités** — ce qui prépare les crises suivantes |

## La SDN, une tentative manquée
Née du traité de Versailles (1919) sur une idée de **Wilson**, première organisation à vocation **universelle** chargée de la sécurité collective.

| Cause de l’échec | Sa conséquence |
| Les **États-Unis n’y adhèrent pas** | L’organisation naît amputée de son inspirateur |
| Elle n’a **pas d’armée** | Aucune sanction crédible |
| La règle de l’**unanimité** | La paralysie |
| Aucune réponse à l’invasion de l’**Éthiopie** (1935) ni aux coups de force allemands | La démonstration publique de son impuissance |

## L’ONU
La **Charte de San Francisco (1945)** interdit le recours à la force — sauf **légitime défense** ou décision du **Conseil de sécurité**.

| Instrument | Ce qu’il permet |
| Le **Conseil de sécurité** | Seul habilité à autoriser la force |
| Le **droit de veto** des cinq permanents | Il **garantit leur participation** — et **bloque** le Conseil dès qu’ils s’opposent |
| Les **Casques bleus** | Les opérations de maintien de la paix |
| La **médiation** du Secrétaire général | La diplomatie préventive |

## La justice comme instrument de paix
| Juridiction | Qui elle juge | Sa limite |
| **Cour internationale de justice** (1945) | Les **États**, sur leurs différends | Elle exige leur consentement |
| **Cour pénale internationale** (Rome 1998, en vigueur 2002) | Les **individus** : génocide, crimes de guerre, crimes contre l’humanité | **Ni la Chine, ni la Russie, ni les États-Unis** n’en sont parties |

> La diplomatie ne **supprime** pas les rapports de force : elle leur donne un **cadre** où ils s’expriment autrement que par les armes. C’est la formule à retenir pour toute la partie.`,
          },
          questions: [
            ['Quel congrès réorganise l’Europe après la chute de Napoléon ?', ['Le congrès de Vienne (1814-1815)', 'Le congrès de Berlin (1878)', 'La conférence de Yalta', 'La conférence de Bandung'], 0, 'Il instaure un équilibre entre grandes puissances, le « concert européen ».'],
            ['Quel président américain est à l’origine de la Société des Nations ?', ['Wilson', 'Roosevelt', 'Truman', 'Taft'], 0, 'Paradoxe fameux : le Sénat américain refuse ensuite d’y adhérer.'],
            ['Quelle faiblesse majeure explique l’échec de la SDN ?', ['L’absence des États-Unis et de moyens de contrainte', 'Un budget trop important', 'Un siège mal situé', 'Le trop grand nombre de membres'], 0, 'Sans armée ni unanimité possible, elle ne peut faire respecter ses décisions.'],
            ['Combien d’États disposent du droit de veto au Conseil de sécurité de l’ONU ?', ['5', '3', '10', '15'], 0, 'États-Unis, Russie, Chine, France, Royaume-Uni : les vainqueurs de 1945.'],
            ['Quelle juridiction juge les individus pour crimes contre l’humanité depuis 2002 ?', ['La Cour pénale internationale', 'La Cour internationale de justice', 'La Cour européenne des droits de l’homme', 'Le Conseil de sécurité'], 0, 'La CIJ, elle, tranche les différends entre États, pas entre personnes.'],
            ['La Charte de l’ONU autorise le recours à la force dans tous les cas.', ['Vrai', 'Faux'], 1, 'Seulement en légitime défense ou sur décision du Conseil de sécurité.'],
            ['Comment appelle-t-on les forces déployées par l’ONU dans les opérations de maintien de la paix ?', ['Les Casques bleus', 'Les Bérets verts', 'La Force de réaction rapide', 'La Légion internationale'], 0, 'Elles s’interposent, mais n’ont qu’un mandat limité et des règles d’engagement strictes.'],
            ['Quel principe fondamental le système westphalien lègue-t-il à la diplomatie moderne ?', ['La souveraineté des États', 'Le droit d’ingérence', 'La sécurité collective', 'Le désarmement général'], 0, 'Tout le droit international s’est construit à partir de ce principe — et contre ses excès.'],
          ],
        },
        {
          titre: 'Guerres et paix au Moyen-Orient',
          axe: 'Faire la guerre, faire la paix : formes de conflits et modes de résolution',
          lecon: {
            titre: 'Un siècle de conflits enchevêtrés',
            cours: `Le Moyen-Orient sert d’étude de cas parce qu’on y trouve **toutes** les formes de conflit du thème : guerres entre États, guerres civiles, terrorisme, interventions extérieures — et des tentatives de paix qui n’ont jamais pris.

## Les héritages
| Décision | Sa date | Ce qu’elle laisse |
| Démantèlement de l’**Empire ottoman** | Après 1918 | La région sous mandats français et britannique |
| Accords **Sykes-Picot** | 1916 | Des frontières **tracées de l’extérieur** |
| Déclaration **Balfour** | 1917 | La promesse d’un foyer national juif en Palestine |

> Ces décisions **pèsent encore** : c’est le point de départ obligé de toute copie sur le thème.

## Le conflit israélo-palestinien
| Date | L’événement |
| **1947** | Plan de partage de l’ONU |
| **1948** | Création d’**Israël**, première guerre israélo-arabe |
| **1967** | Guerre des **Six Jours** : occupation de la Cisjordanie, de Gaza, du Golan et de Jérusalem-Est |
| **1973** | Guerre du Kippour |
| **1993** | **Accords d’Oslo** : reconnaissance mutuelle, autonomie palestinienne |

> Le processus d’Oslo s’enraye : **colonisation**, **seconde Intifada**, blocage durable. C’est la tentative de paix la plus aboutie — et son échec structure tout ce qui suit.

## Les autres foyers
| Conflit | Sa période |
| Guerre **Iran-Irak** | 1980-1988 |
| Guerres du **Golfe** | 1991, 2003 |
| Guerre civile **syrienne** | Depuis 2011 |
| Guerre au **Yémen** | Depuis 2014 |

S’y superposent la rivalité entre l’**Arabie saoudite** et l’**Iran**, la **question kurde**, et l’implication de puissances extérieures : États-Unis, Russie, Turquie.

## Les ressources et les puissances
| Enjeu | Ce qu’il représente |
| Le **pétrole** et le gaz | Ils font de la région un enjeu mondial depuis les années 1930 |
| Le détroit d’**Ormuz** | Un point de passage **vital** pour l’approvisionnement mondial |
| Les **États-Unis** | Longtemps garants de l’équilibre régional |
| La **Russie** | Revenue par la **Syrie** à partir de 2015 |

> **Aucun conflit du Moyen-Orient n’est isolé** : chacun sert de terrain à des rivalités plus larges. C’est ce qui rend les médiations si difficiles — un accord local suppose l’accord de puissances extérieures.`,
          },
          questions: [
            ['Quels accords secrets de 1916 préparent le partage du Moyen-Orient entre la France et le Royaume-Uni ?', ['Les accords Sykes-Picot', 'Les accords de Camp David', 'Les accords d’Oslo', 'Le pacte de Bagdad'], 0, 'Ils dessinent des frontières décidées hors de la région.'],
            ['En quelle année l’État d’Israël est-il proclamé ?', ['1948', '1917', '1967', '1993'], 0, 'La proclamation suit le plan de partage de l’ONU de 1947.'],
            ['Que promet la déclaration Balfour de 1917 ?', ['Un foyer national juif en Palestine', 'L’indépendance de la Syrie', 'Un État kurde', 'La fin des mandats'], 0, 'Elle engage le Royaume-Uni et pèse sur tout le siècle qui suit.'],
            ['Quelle guerre conduit Israël à occuper la Cisjordanie, Gaza et le Golan ?', ['La guerre des Six Jours (1967)', 'La guerre du Kippour (1973)', 'La guerre de 1948', 'La guerre du Liban'], 0, 'L’occupation issue de 1967 reste au cœur du conflit.'],
            ['Que prévoient les accords d’Oslo de 1993 ?', ['Une reconnaissance mutuelle et une autonomie palestinienne', 'La création immédiate d’un État palestinien', 'Le retrait israélien du Golan', 'Une union douanière régionale'], 0, 'Le processus s’enraye ensuite, faute d’application et sous l’effet de la colonisation.'],
            ['Quelle rivalité régionale structure de nombreux conflits actuels du Moyen-Orient ?', ['Arabie saoudite / Iran', 'Turquie / Égypte', 'Israël / Jordanie', 'Irak / Koweït'], 0, 'Elle se rejoue par procuration au Yémen, en Syrie, au Liban.'],
            ['Le détroit d’Ormuz est un point de passage stratégique pour les hydrocarbures.', ['Vrai', 'Faux'], 0, 'Une part majeure du pétrole mondial y transite : le fermer serait une arme.'],
            ['Quelle guerre oppose deux États de la région entre 1980 et 1988 ?', ['La guerre Iran-Irak', 'La guerre du Golfe', 'La guerre du Kippour', 'La guerre civile libanaise'], 0, 'Huit ans de conflit, avec emploi d’armes chimiques et centaines de milliers de morts.'],
          ],
        },
        // ===================================================================
        // Chapitre 3 — Histoire et mémoires
        // ===================================================================
        {
          titre: 'Histoire et mémoires : l’exemple de la guerre d’Algérie',
          axe: 'Histoire et mémoires',
          lecon: {
            titre: 'Une guerre longtemps sans nom',
            cours: `Le thème commence par une **distinction**.

| | L’**histoire** | La **mémoire** |
| Ce que c’est | Un **savoir critique** | Un **souvenir vécu** |
| Sur quoi elle repose | Des **sources**, une méthode | L’**affect**, le témoignage |
| Sa nature | Discutable, révisable | **Sélective**, portée par un groupe |

La guerre d’Algérie montre ce que devient un passé quand les mémoires **s’affrontent**.

## Une guerre longtemps sans nom
De 1954 à 1962, la France parle d’« **événements** », d’« opérations de maintien de l’ordre ». Le mot « **guerre** » n’est officiellement employé qu’en **1999**.

> Les accords d’Évian (1962) sont suivis d’**amnisties** qui **interdisent les poursuites** et referment le dossier. Le silence n’est pas un oubli : c’est une décision politique.

## Des mémoires plurielles et concurrentes
| Groupe | Sa mémoire |
| Les **appelés** du contingent | Longtemps **silencieux** |
| Les **pieds-noirs** | Rapatriés en 1962 : une mémoire de l’**arrachement** |
| Les **harkis** | Supplétifs **abandonnés**, puis mal accueillis — reconnaissance tardive |
| Les **immigrés algériens** et leurs enfants | Marqués par la répression du **17 octobre 1961** à Paris |
| Côté **algérien** | Une mémoire d’**État**, centrée sur le FLN et la « révolution », qui laisse peu de place aux divisions internes |

## Le travail des historiens
À partir des années 1980-1990, l’**ouverture des archives** permet d’écrire l’histoire de la **torture** (Aussaresses, 2000), du 17 octobre 1961, du sort des harkis.

Les travaux de **Benjamin Stora** structurent le champ ; son **rapport de 2021** propose des gestes de réconciliation mémorielle.

## Les gestes politiques
| Date | Le geste |
| **1999** | Reconnaissance du mot « guerre » |
| **2001** | Plaque commémorative pour le 17 octobre 1961 ; journée d’hommage aux **harkis** |
| **2018** | Responsabilité de la France dans l’assassinat de **Maurice Audin** |
| **2021** | Reconnaissance pour **Ali Boumendjel** |

> Une mémoire n’est pas une histoire : l’**État peut reconnaître**, l’**historien doit établir**. Les deux gestes ne se remplacent pas.`,
          },
          questions: [
            ['Quelle est la différence essentielle entre histoire et mémoire ?', ['L’histoire est un savoir critique, la mémoire un souvenir vécu et sélectif', 'La mémoire est écrite, l’histoire est orale', 'L’histoire est officielle, la mémoire est privée', 'Il n’y a aucune différence'], 0, 'L’une se discute et se démontre, l’autre se transmet et s’éprouve.'],
            ['En quelle année la France reconnaît-elle officiellement le terme de « guerre d’Algérie » ?', ['1999', '1962', '1982', '2012'], 0, 'Jusque-là, on parlait d’« événements » ou d’« opérations de maintien de l’ordre ».'],
            ['Quel événement de 1961 a longtemps été occulté en France ?', ['La répression de la manifestation algérienne du 17 octobre à Paris', 'Le putsch d’Alger', 'La bataille d’Alger', 'Les accords d’Évian'], 0, 'Une plaque commémorative n’a été posée qu’en 2001.'],
            ['Qui sont les harkis ?', ['Des supplétifs algériens engagés aux côtés de l’armée française', 'Les combattants du FLN', 'Les colons français d’Algérie', 'Les appelés du contingent'], 0, 'Abandonnés en 1962, leur reconnaissance a été très tardive.'],
            ['Quel effet ont eu les lois d’amnistie qui suivent les accords d’Évian ?', ['Elles interdisent les poursuites et referment le dossier', 'Elles ouvrent les archives', 'Elles indemnisent les victimes', 'Elles créent une commission vérité'], 0, 'L’oubli organisé a longtemps empêché le travail de mémoire.'],
            ['Quel historien a structuré le champ des travaux sur la mémoire de la guerre d’Algérie ?', ['Benjamin Stora', 'Robert Paxton', 'Henry Rousso', 'Pierre Nora'], 0, 'Son rapport de 2021 propose des gestes de réconciliation mémorielle.'],
            ['Les pieds-noirs et les harkis partagent la même mémoire de la guerre.', ['Vrai', 'Faux'], 1, 'Chaque groupe porte une mémoire distincte, parfois concurrente des autres.'],
            ['Qu’a reconnu l’État français en 2018 au sujet de Maurice Audin ?', ['Sa responsabilité dans son arrestation et sa mort', 'Son statut de héros national', 'Son engagement au FLN', 'Son innocence judiciaire'], 0, 'Une reconnaissance qui vaut aussi pour le système de torture mis en place.'],
          ],
        },
        {
          titre: 'Les responsabilités des États dans le déclenchement de la Première Guerre mondiale',
          axe: 'Histoire et mémoires',
          lecon: {
            titre: 'Qui a voulu la guerre de 1914 ? Un siècle de débat',
            cours: `La question des responsabilités de 1914 est le meilleur exemple d’un **débat historiographique** qui traverse un siècle : la réponse a changé plusieurs fois — non parce que les faits ont changé, mais parce que les **sources** et les **questions** ont changé.

## Les quatre temps du débat
| Moment | La thèse dominante |
| **1919** | L’**article 231** de Versailles : l’Allemagne et ses alliés sont **responsables** |
| Années **1920** | La bataille des **recueils de documents** : chacun se disculpe |
| **1961** | **Fritz Fischer** : l’Allemagne poursuivait des buts **expansionnistes** |
| Aujourd’hui | L’**engrenage** : responsabilités partagées, mais inégales |

## Le verdict de 1919
L’article 231 est la « **clause de culpabilité** ». Elle justifie les **réparations**.

> Elle nourrit en Allemagne le sentiment d’un *Diktat*, thème **massivement exploité** par les nationalistes puis par les nazis. Une clause juridique devient une arme politique.

## La bataille des documents
Dans les années 1920, l’Allemagne publie des recueils diplomatiques pour se disculper ; la France et le Royaume-Uni répliquent.

> L’**histoire devient un terrain de politique étrangère**. C’est l’illustration la plus nette de l’usage public du passé.

## La thèse Fischer
En **1961**, l’historien **allemand** Fritz Fischer montre, **archives à l’appui**, que l’Allemagne a délibérément pris le risque du conflit.

> La thèse fait scandale en Allemagne : elle rouvre la question de la responsabilité, cette fois **de l’intérieur**. Ce n’est plus le vainqueur qui accuse.

## Les lectures actuelles
| Facteur invoqué | Ce qu’il explique |
| Le jeu des **alliances** | L’extension automatique du conflit |
| La **course aux armements** | Le climat d’attente |
| Les **plans de mobilisation rigides** | Le plan Schlieffen laisse peu de marge à la diplomatie |
| Les **nationalismes** | Le consentement des opinions |
| L’**aveuglement** des dirigeants | Christopher Clark parle de « **somnambules** » |

D’autres historiens maintiennent une responsabilité **principale** des empires centraux.

> Le débat ne porte pas seulement sur 1914 : dire qui est responsable, c’est **justifier ou non le traité de Versailles**, donc l’ordre européen qui en est sorti.

> Ce que cela apprend : une même série de faits admet plusieurs interprétations — mais **toutes ne se valent pas**. Elles se jugent aux **sources**, à la **méthode**, et à la capacité de rendre compte des documents connus.`,
          },
          questions: [
            ['Que dispose l’article 231 du traité de Versailles ?', ['Il désigne l’Allemagne et ses alliés comme responsables des dommages', 'Il crée la Société des Nations', 'Il fixe les frontières de la Pologne', 'Il interdit l’armée allemande'], 0, 'C’est la « clause de culpabilité », fondement juridique des réparations.'],
            ['Quel effet cette clause a-t-elle eu en Allemagne ?', ['Elle a nourri le sentiment d’un Diktat exploité par les nationalistes', 'Elle a été acceptée sans débat', 'Elle a provoqué une révolution', 'Elle a été annulée dès 1920'], 0, 'Le ressentiment de Versailles est un ressort de la propagande nazie.'],
            ['Quel historien allemand rouvre en 1961 la question des buts de guerre allemands ?', ['Fritz Fischer', 'Christopher Clark', 'Ernst Nolte', 'Hannah Arendt'], 0, 'Sa thèse fait scandale car elle vient d’Allemagne même.'],
            ['Comment les historiens actuels caractérisent-ils souvent le déclenchement de 1914 ?', ['Comme un engrenage d’alliances, d’armements et de plans rigides', 'Comme un accident sans cause', 'Comme le fruit d’un complot unique', 'Comme une décision de la SDN'], 0, 'Christopher Clark parle de dirigeants « somnambules ».'],
            ['Pourquoi les États ont-ils publié des recueils de documents diplomatiques dans les années 1920 ?', ['Pour peser sur le débat sur les responsabilités', 'Pour former les étudiants', 'Pour respecter une obligation du traité', 'Pour préparer la SDN'], 0, 'L’écriture de l’histoire devient un instrument de politique étrangère.'],
            ['Le débat sur les responsabilités de 1914 a été tranché définitivement en 1919.', ['Vrai', 'Faux'], 1, 'Il a été rouvert dans les années 1960 et se poursuit aujourd’hui.'],
            ['Quel plan militaire allemand illustre la rigidité des mobilisations de 1914 ?', ['Le plan Schlieffen', 'Le plan XVII', 'Le plan Dawes', 'Le plan Marshall'], 0, 'Une fois lancée, la mécanique de mobilisation laissait peu de place à la diplomatie.'],
            ['Que montre ce jalon sur le travail de l’historien ?', ['Les interprétations évoluent avec les sources et la méthode', 'L’histoire ne change jamais', 'Toutes les interprétations se valent', 'L’histoire dépend des seuls témoignages'], 0, 'Plusieurs lectures existent, mais elles se jugent aux archives et à la démonstration.'],
          ],
        },
        {
          titre: 'Juger un crime de masse à l’échelle locale et internationale : les exemples du Rwanda et des Balkans',
          axe: 'Histoire et mémoires',
          lecon: {
            titre: 'Quand la justice prend en charge le passé',
            cours: `Juger un crime de masse, c’est **établir des faits**, **désigner des responsables** et permettre à une société de **continuer à vivre ensemble**. Le Rwanda et l’ex-Yougoslavie montrent deux échelles de justice — et leurs limites.

## Deux crimes des années 1990
| | **Rwanda, 1994** | **Ex-Yougoslavie, 1991-1999** |
| Les faits | En **cent jours**, le génocide des **Tutsi** fait environ **800 000** morts | Guerres d’éclatement, **nettoyage ethnique**, siège de Sarajevo |
| Les auteurs | Planifié par le pouvoir hutu, exécuté par l’armée, les milices *interahamwe* et une partie de la population | Forces serbes, milices, armées des républiques |
| Le point culminant | — | **Srebrenica**, juillet 1995 : plus de **8 000** hommes et adolescents bosniaques musulmans |
| La communauté internationale | Elle **n’intervient pas** | Elle intervient tard |

Srebrenica a été qualifié de **génocide** par la justice internationale.

## Les tribunaux internationaux
Créés par le Conseil de sécurité — **TPIY** (1993) et **TPIR** (1994) —, héritiers lointains de **Nuremberg** (1945-1946), qui avait forgé la notion de **crime contre l’humanité**.

| Accusé | L’issue |
| **Milošević** | Mort **avant** son verdict |
| **Karadžić** et **Mladić** | Condamnés à la **perpétuité** |
| **Jean Kambanda**, Premier ministre rwandais | Condamné pour **génocide** |

La **CPI**, permanente, prend le relais à partir de **2002**.

## La justice locale : les gacaca
Le Rwanda, avec plus de **cent mille détenus**, rouvre des juridictions traditionnelles : les **gacaca**, tribunaux communautaires **en plein air**.

| Ce qu’elles apportent | Ce qu’on leur reproche |
| Près de **deux millions** de dossiers jugés entre 2002 et 2012 | Des **garanties procédurales** insuffisantes |
| Rapidité, proximité avec les victimes | Le risque de règlements de comptes |

> Justice **internationale** et justice **locale** ne font pas le même travail : l’une fixe la **qualification** et l’**exemplarité**, l’autre traite la **masse** et la **vie du village**.

## Justice et mémoire
Les procès produisent des **archives**, des **témoignages** et une **vérité judiciaire** qui nourrit l’histoire. Ils ne suffisent pas : commémorations, mémoriaux (Gisozi, Srebrenica-Potočari) et **enseignement** prennent le relais.

> En France, le **rapport Duclert (2021)** a établi les « responsabilités accablantes » de l’État français au Rwanda — un exemple de ce que l’**historien** peut établir là où le **juge** n’a pas été saisi.`,
          },
          questions: [
            ['Quel génocide a lieu au Rwanda en 1994 ?', ['Le génocide des Tutsi', 'Le génocide des Hutu', 'Le génocide des Twa', 'Le génocide des Bantous'], 0, 'Environ 800 000 morts en cent jours, planifiés par le pouvoir en place.'],
            ['Quel massacre de juillet 1995 a été qualifié de génocide par la justice internationale ?', ['Srebrenica', 'Vukovar', 'Mostar', 'Pristina'], 0, 'Plus de 8 000 hommes et adolescents bosniaques musulmans y ont été tués.'],
            ['Que sont les gacaca ?', ['Des tribunaux communautaires rwandais jugeant les participants au génocide', 'Des commissions vérité sud-africaines', 'Des chambres du TPIR', 'Des mémoriaux du génocide'], 0, 'Près de deux millions de dossiers traités entre 2002 et 2012.'],
            ['Quel tribunal a forgé en 1945-1946 la notion de crime contre l’humanité ?', ['Le tribunal de Nuremberg', 'Le TPIY', 'La Cour internationale de justice', 'Le tribunal de Tokyo'], 0, 'Les TPI des années 1990 en sont les héritiers directs.'],
            ['Qui a créé le TPIY et le TPIR ?', ['Le Conseil de sécurité de l’ONU', 'L’Union européenne', 'L’Assemblée générale de l’ONU', 'La Cour pénale internationale'], 0, 'Des tribunaux ad hoc, créés pour un conflit et une période précis.'],
            ['La Cour pénale internationale a été créée pour juger un conflit précis.', ['Vrai', 'Faux'], 1, 'À la différence des TPI ad hoc, elle est permanente et à vocation générale.'],
            ['Quelle critique majeure a été adressée aux juridictions gacaca ?', ['La faiblesse des garanties procédurales', 'Leur lenteur excessive', 'Leur coût pour l’ONU', 'Leur refus de juger les responsables'], 0, 'Rapidité et proximité ont été obtenues au prix des droits de la défense.'],
            ['Qu’a établi le rapport Duclert remis en 2021 ?', ['Les responsabilités accablantes de la France au Rwanda', 'La complicité de la Belgique', 'Le bilan exact du génocide', 'L’innocence de l’ONU'], 0, 'Un travail d’historiens commandé par l’État, à partir des archives.'],
          ],
        },
        {
          titre: 'L’histoire et les mémoires du génocide des Juifs et des Tsiganes',
          axe: 'Histoire et mémoires',
          lecon: {
            titre: 'Du silence d’après-guerre au devoir de mémoire',
            cours: `C’est le cas où l’écart entre l’**histoire** et les **mémoires** est le plus visible : les faits ont été connus **très tôt**, mais il a fallu **des décennies** pour qu’ils occupent la place qu’ils ont aujourd’hui.

## Les faits
| Victimes | L’ampleur | Les formes |
| Les **Juifs** | environ **six millions** | Fusillades (la « Shoah par balles »), ghettos, centres de mise à mort — Auschwitz-Birkenau, Treblinka, Sobibor |
| Les **Tsiganes** — le *Porajmos* | entre **200 000 et 500 000** | Internement, déportation, exécutions |

En France, le régime de **Vichy** collabore : **statut des Juifs** (octobre 1940), rafle du **Vél d’Hiv** (juillet 1942), convois vers Auschwitz.

## Le temps du silence — 1945 aux années 1960
| Ce qui se passe | Pourquoi |
| Le retour des déportés se heurte à l’**indifférence** | La société veut reconstruire, pas se souvenir |
| La mémoire nationale privilégie le **résistancialisme** | L’idée d’une France massivement résistante, portée par **de Gaulle comme par le PCF** |
| Les victimes juives sont noyées dans la catégorie « **déportés** » | La spécificité du génocide est effacée |

## Le réveil de la mémoire
| Date | L’événement | Son effet |
| **1961** | Procès **Eichmann** à Jérusalem | Largement médiatisé, il **fait entendre les témoins** |
| **1971** | *Le Chagrin et la Pitié* | Le récit rassurant se fissure |
| **1973** | **Robert Paxton**, *La France de Vichy* | Un historien **américain** établit la collaboration d’État |
| **1985** | *Shoah*, de Claude Lanzmann | Le témoignage devient une forme historique |

## Le temps de la justice et de la reconnaissance
| Date | Le fait |
| **1964** | Les crimes contre l’humanité déclarés **imprescriptibles** |
| **1987**, **1994**, **1998** | Procès **Barbie**, **Touvier**, **Papon** |
| **1995** | Le discours de **Jacques Chirac** au Vél d’Hiv reconnaît la responsabilité de l’**État français** |
| **2016** | Reconnaissance par la France du génocide des **Tsiganes** |

> On est passé du **silence** au « **devoir de mémoire** ». Le risque nouveau n’est plus l’**oubli**, mais la **commémoration sans connaissance** — c’est la conclusion que le programme attend.`,
          },
          questions: [
            ['Quel procès de 1961 relance la mémoire du génocide des Juifs dans le monde ?', ['Le procès Eichmann à Jérusalem', 'Le procès de Nuremberg', 'Le procès Barbie', 'Le procès Papon'], 0, 'Sa médiatisation donne enfin la parole aux témoins.'],
            ['Qu’appelle-t-on le résistancialisme ?', ['Le récit d’une France massivement résistante', 'Un courant de la Résistance', 'Une doctrine militaire', 'Un mouvement littéraire'], 0, 'Il a longtemps occulté la collaboration et le sort des Juifs de France.'],
            ['Quel historien américain a renouvelé en 1973 l’histoire du régime de Vichy ?', ['Robert Paxton', 'Raul Hilberg', 'Henry Rousso', 'Pierre Nora'], 0, 'La France de Vichy montre une collaboration d’État, non une contrainte subie.'],
            ['Quel président français reconnaît en 1995 la responsabilité de l’État dans la déportation ?', ['Jacques Chirac', 'François Mitterrand', 'Charles de Gaulle', 'Nicolas Sarkozy'], 0, 'Son discours du Vél d’Hiv rompt avec la position de ses prédécesseurs.'],
            ['Comment nomme-t-on le génocide des Tsiganes ?', ['Le Porajmos', 'La Shoah', 'L’Aktion T4', 'Le Judenrat'], 0, 'Entre 200 000 et 500 000 victimes, reconnues très tardivement.'],
            ['Les crimes contre l’humanité sont imprescriptibles en droit français.', ['Vrai', 'Faux'], 0, 'Depuis la loi de 1964 : c’est ce qui a rendu possibles les procès Barbie, Touvier et Papon.'],
            ['Quel film de 1985 recueille les témoignages de survivants, de bourreaux et de témoins ?', ['Shoah, de Claude Lanzmann', 'Nuit et brouillard', 'Le Chagrin et la Pitié', 'La Liste de Schindler'], 0, 'Neuf heures de témoignages, sans aucune image d’archives.'],
            ['Quel événement de juillet 1942 marque la participation de l’État français à la déportation ?', ['La rafle du Vél d’Hiv', 'Le statut des Juifs', 'La création de la Milice', 'Le procès de Riom'], 0, 'Plus de 13 000 personnes arrêtées à Paris par la police française.'],
          ],
        },
        // ===================================================================
        // Chapitre 4 — Les enjeux géopolitiques du patrimoine
        // ===================================================================
        {
          titre: 'Du patrimoine individuel au patrimoine mondial',
          axe: 'Les enjeux géopolitiques liés à la conservation et à la valorisation du patrimoine',
          lecon: {
            titre: 'Comment un héritage devient un bien commun',
            cours: `Le mot « patrimoine » vient du latin *patrimonium*, le **bien hérité du père**. En quelques siècles, il est passé de la propriété **privée** à l’héritage d’une **nation**, puis à celui de l’**humanité**. Ce glissement est tout sauf neutre.

## D’un héritage privé à un bien de la nation
La **Révolution française** est le moment décisif : les biens du clergé, de la Couronne et des émigrés sont **nationalisés**, et l’État doit décider quoi en faire.

| Date | Le jalon |
| **1794** | Face au **vandalisme**, l’abbé **Grégoire** forge le mot pour dénoncer les destructions |
| **1830** | Création de l’inspection générale des **Monuments historiques** |
| **1834** | **Prosper Mérimée** en prend la charge |
| **1913** | La **loi** organise le classement et la protection |

## L’élargissement du patrimoine
| Type | Ce qu’il recouvre |
| **Industriel** | Mines, usines, cités ouvrières |
| **Rural** et **maritime** | Paysages, bâti, savoir-faire |
| Du **XXe siècle** | Architecture moderne, béton |
| **Immatériel**, depuis **2003** | Savoir-faire, fêtes, langues, gastronomie |

## L’échelle mondiale
| Étape | Ce qu’elle apporte |
| L’**UNESCO**, 1945 | Le patrimoine devient un enjeu **international** |
| **Abou Simbel**, 1960-1968 | Le sauvetage des temples menacés par le barrage d’Assouan : le **geste fondateur** |
| La **convention de 1972** | Elle crée la **liste du patrimoine mondial** |
| Le critère | Une « **valeur universelle exceptionnelle** » |

Plus de **1 200 biens** sont aujourd’hui inscrits.

> Inscrire un site, c’est affirmer qu’il **n’appartient plus seulement** à l’État qui l’abrite. C’est aussi, pour cet État, une **reconnaissance** et une **ressource**.

## Une répartition inégale
| Région | Sa part des inscriptions |
| L’**Europe** | Près de la **moitié** |
| L’**Afrique** | Moins d’un **dixième** |

> La liste reflète autant les **capacités administratives et diplomatiques** des États que la richesse patrimoniale réelle. C’est la nuance critique que le programme attend.`,
          },
          questions: [
            ['Quel événement fait passer le patrimoine d’un bien privé à un bien de la nation ?', ['La Révolution française', 'La Renaissance', 'Le Second Empire', 'La Libération'], 0, 'La nationalisation des biens du clergé et de la Couronne pose la question de leur conservation.'],
            ['Qui popularise le mot « vandalisme » en 1794 ?', ['L’abbé Grégoire', 'Prosper Mérimée', 'Viollet-le-Duc', 'André Malraux'], 0, 'Il dénonce les destructions révolutionnaires pour mieux défendre la conservation.'],
            ['Qui est nommé inspecteur général des Monuments historiques en 1834 ?', ['Prosper Mérimée', 'Viollet-le-Duc', 'Victor Hugo', 'Guizot'], 0, 'Il parcourt la France pour recenser les édifices à sauver.'],
            ['Quelle convention crée la liste du patrimoine mondial ?', ['La convention de l’UNESCO de 1972', 'La convention de La Haye de 1954', 'La convention de 2003', 'La convention de Faro'], 0, 'Elle repose sur le critère de « valeur universelle exceptionnelle ».'],
            ['Quel sauvetage est considéré comme l’acte fondateur du patrimoine mondial ?', ['Les temples d’Abou Simbel', 'Le Mont-Saint-Michel', 'Angkor', 'Venise'], 0, 'Déplacés pierre par pierre pour échapper à la montée des eaux du barrage d’Assouan.'],
            ['Le patrimoine culturel immatériel est reconnu par l’UNESCO depuis 2003.', ['Vrai', 'Faux'], 0, 'Savoir-faire, fêtes, langues et pratiques entrent alors dans le patrimoine.'],
            ['Quelle loi française organise le classement des monuments historiques ?', ['La loi de 1913', 'La loi de 1830', 'La loi de 1962', 'La loi de 2016'], 0, 'Elle reste la base du droit du patrimoine en France.'],
            ['Comment la liste du patrimoine mondial est-elle répartie dans le monde ?', ['Très inégalement, au profit de l’Europe', 'De façon équilibrée entre continents', 'Au profit de l’Afrique', 'Selon la population des États'], 0, 'La liste reflète aussi les moyens administratifs et diplomatiques des États.'],
          ],
        },
        {
          titre: 'Les usages sociaux et politiques du patrimoine',
          axe: 'Les enjeux géopolitiques liés à la conservation et à la valorisation du patrimoine',
          lecon: {
            titre: 'Un héritage dont on se sert',
            cours: `Le patrimoine n’est jamais **seulement conservé** : il est **utilisé**. Pour construire une identité, attirer des touristes, asseoir un pouvoir — ou pour l’effacer.

## Un instrument politique
| Usage | Exemples |
| **Construire** un récit national | Le **Panthéon** en France, la restauration des palais impériaux en Chine |
| **Affirmer** une survie | La reconstruction de la **vieille ville de Varsovie** après 1945 |
| **Nier** l’existence de l’autre | Le pont de **Mostar** (1993), les bouddhas de **Bamiyan** (2001), **Palmyre** (2015) |

> Détruire le patrimoine de l’autre, c’est **nier son existence**. C’est pourquoi la destruction patrimoniale accompagne presque toujours le nettoyage ethnique.

## Le patrimoine comme arme et comme crime
| Texte ou décision | Ce qu’il établit |
| Convention de **La Haye**, 1954 | La protection des biens culturels en cas de **conflit armé** |
| **CPI, 2016** : condamnation d’**Ahmad al-Faqi al-Mahdi** pour les mausolées de Tombouctou | Pour la **première fois**, la destruction du patrimoine est jugée comme **crime de guerre à part entière** |

## Le patrimoine comme ressource économique
| Ce qu’il apporte | Ce qu’il coûte |
| Il fait vivre des régions entières | La **surfréquentation** : Venise, Barcelone, Machu Picchu |
| Il finance la restauration | La **hausse des loyers** |
| Le label UNESCO est un argument commercial | La **muséification** des centres-villes |

## Les conflits d’usage
Qui décide de ce qui mérite d’être conservé : les habitants, l’État, les experts, les investisseurs ?

| Débat | Ce qu’il révèle |
| Les **restitutions** d’objets acquis en contexte colonial | Rapport **Sarr-Savoy** (2018), restitutions au **Bénin** (2021) |
| — | Le patrimoine engage des **rapports de domination hérités** |

> Le patrimoine n’est pas un **stock d’objets anciens** : c’est un **choix collectif**, toujours révisable, sur ce qu’une société veut transmettre.`,
          },
          questions: [
            ['Quelle convention protège les biens culturels en cas de conflit armé ?', ['La convention de La Haye (1954)', 'La convention de 1972', 'La convention de 2003', 'La convention de Genève'], 0, 'Adoptée après les destructions de la Seconde Guerre mondiale.'],
            ['Qu’a jugé la Cour pénale internationale en 2016 dans l’affaire al-Mahdi ?', ['La destruction des mausolées de Tombouctou comme crime de guerre', 'Un génocide au Mali', 'Un trafic d’antiquités', 'Une prise d’otages'], 0, 'Première condamnation internationale pour destruction de patrimoine.'],
            ['Quelle destruction de 2001 a marqué l’opinion mondiale en Afghanistan ?', ['Les bouddhas de Bamiyan', 'La citadelle d’Hérat', 'Le musée de Kaboul', 'Le minaret de Djam'], 0, 'Les talibans l’ont revendiquée comme un geste idéologique.'],
            ['Quel effet négatif le tourisme culturel de masse produit-il sur les sites patrimoniaux ?', ['La surfréquentation et la muséification des centres', 'La disparition des labels', 'La baisse des financements', 'La perte des archives'], 0, 'Venise, Barcelone ou le Machu Picchu doivent réguler les flux.'],
            ['Que propose le rapport Sarr-Savoy de 2018 ?', ['La restitution d’objets acquis en contexte colonial', 'Le classement de nouveaux monuments', 'La création d’un musée européen', 'Un plan de restauration des cathédrales'], 0, 'Il a conduit aux restitutions au Bénin en 2021.'],
            ['La destruction du patrimoine d’un groupe peut viser à nier son existence.', ['Vrai', 'Faux'], 0, 'Mostar, Bamiyan, Palmyre : effacer les traces, c’est prolonger la guerre autrement.'],
            ['Quelle ville a reconstruit à l’identique sa vieille ville détruite pendant la guerre, comme affirmation nationale ?', ['Varsovie', 'Dresde', 'Rotterdam', 'Coventry'], 0, 'La reconstruction elle-même est aujourd’hui inscrite au patrimoine mondial.'],
            ['Que signifie le label UNESCO pour un territoire ?', ['Une protection, mais aussi un argument touristique et économique', 'Un financement automatique intégral', 'Une exemption de règles nationales', 'Une garantie contre la guerre'], 0, 'La reconnaissance attire les visiteurs autant qu’elle oblige à conserver.'],
          ],
        },
        {
          titre: 'La préservation du patrimoine',
          axe: 'Les enjeux géopolitiques liés à la conservation et à la valorisation du patrimoine',
          lecon: {
            titre: 'Conserver, restaurer, arbitrer',
            cours: `Préserver un patrimoine, c’est répondre à **trois questions** : que garder, dans quel état, et avec quel argent. Aucune n’a de réponse évidente.

## Deux doctrines de la restauration
| | **Viollet-le-Duc** | **John Ruskin** |
| Sa position | Restaurer, c’est « rétablir un édifice dans un état complet **qui peut n’avoir jamais existé** » | **Refuser** la restauration : entretenir et laisser vieillir |
| Son argument | L’unité de style prime | Chaque ajout **falsifie le témoignage** |
| Ses exemples | Carcassonne, les gargouilles de Notre-Dame | — |

La **charte de Venise (1964)** tranche partiellement : respecter l’**authenticité des matériaux**, et rendre **visible** toute intervention nouvelle.

## Les menaces
| Menace | Ce qu’elle produit |
| **Guerres** et pillages | Destruction délibérée, trafic |
| Le **temps** et la pollution | Érosion des matériaux |
| Le **changement climatique** | Érosion côtière, montée des eaux à Venise et sur les sites du Pacifique |
| L’**urbanisation** et le tourisme de masse | Pression sur le bâti et les habitants |
| Le **manque de moyens** | L’entretien différé, plus coûteux à terme |

> Le **trafic illicite d’antiquités finance des groupes armés** : la préservation est aussi un enjeu de sécurité.

## Les outils
| Outil | Son effet |
| La liste du **patrimoine mondial en péril** | Elle alerte l’opinion et débloque des aides |
| Le **retrait** de la liste | Dresde en **2009**, Liverpool en **2021** : la sanction existe |
| En France | Classement et inscription, **architectes des Bâtiments de France**, Fondation du patrimoine |
| Le **Loto du patrimoine** et les souscriptions | Comme celle qui a suivi l’incendie de **Notre-Dame de Paris**, 2019 |

> Conserver **coûte**. Chaque euro dépensé sur un site est un euro **non dépensé ailleurs** : la préservation est aussi un **arbitrage politique**.

## Participer
Journées européennes du patrimoine, chantiers de bénévoles, associations locales, inventaires participatifs.

> La préservation n’est pas réservée aux experts : elle suppose une **appropriation par les habitants**.`,
          },
          questions: [
            ['Quelle conception de la restauration Viollet-le-Duc défend-il ?', ['Rétablir l’édifice dans un état complet, quitte à recréer', 'Ne jamais intervenir', 'Reconstruire en matériaux modernes', 'Déplacer les monuments menacés'], 0, 'D’où les ajouts de Carcassonne ou les gargouilles de Notre-Dame.'],
            ['Quel penseur britannique s’oppose à la restauration au nom de l’authenticité ?', ['John Ruskin', 'William Morris uniquement', 'Prosper Mérimée', 'John Locke'], 0, 'Pour lui, entretenir suffit : restaurer falsifie le témoignage du temps.'],
            ['Quelle charte de 1964 fixe les principes internationaux de la restauration ?', ['La charte de Venise', 'La charte d’Athènes', 'La charte de Faro', 'La charte de Cracovie'], 0, 'Authenticité des matériaux, lisibilité des interventions nouvelles.'],
            ['Que se passe-t-il si un bien inscrit est mal géré ou dénaturé ?', ['Il peut être retiré de la liste du patrimoine mondial', 'Il est automatiquement financé par l’UNESCO', 'Il change de catégorie', 'Rien, l’inscription est définitive'], 0, 'Dresde en 2009 et Liverpool en 2021 en ont fait l’expérience.'],
            ['Quel dispositif français finance la restauration de sites en péril par un jeu de hasard ?', ['Le Loto du patrimoine', 'La taxe de séjour', 'Le crédit d’impôt monuments', 'Le fonds Malraux'], 0, 'Lancé en 2018, il complète les financements publics et le mécénat.'],
            ['Le changement climatique menace directement certains sites patrimoniaux.', ['Vrai', 'Faux'], 0, 'Érosion côtière, montée des eaux, épisodes extrêmes : Venise en est le symbole.'],
            ['À quoi sert la liste du patrimoine mondial en péril ?', ['Alerter l’opinion et mobiliser des aides internationales', 'Déclasser les sites abîmés', 'Interdire le tourisme', 'Transférer la propriété à l’UNESCO'], 0, 'C’est un signal d’alarme, pas une sanction.'],
            ['Quel événement de 2019 a déclenché une souscription internationale en France ?', ['L’incendie de Notre-Dame de Paris', 'L’effondrement d’un pont à Gênes', 'Les inondations de Venise', 'La restauration du Panthéon'], 0, 'Des centaines de millions d’euros promis en quelques jours.'],
          ],
        },
        {
          titre: 'La France et le patrimoine',
          axe: 'Les enjeux géopolitiques liés à la conservation et à la valorisation du patrimoine',
          lecon: {
            titre: 'Une politique publique, et une diplomatie',
            cours: `La France est l’un des pays où le patrimoine est le plus fortement pris en charge par l’**État**, et où il sert le plus explicitement d’**instrument d’influence** à l’étranger.

## Une longue tradition d’État
| Date | Le jalon |
| Révolution | Les premiers **inventaires** |
| **1913** | La loi sur les monuments historiques |
| **1959** | **André Malraux** crée le ministère des Affaires culturelles |
| **1962** | La **loi Malraux** et les **secteurs sauvegardés** |

L’arsenal est complet : classement, inscription, architectes des Bâtiments de France, abords protégés, sites patrimoniaux remarquables.

## Un patrimoine élargi
| Catégorie | Exemples |
| **Immeubles protégés** | Plus de **45 000** |
| Patrimoine **industriel** | Le bassin minier du Nord-Pas-de-Calais, inscrit en **2012** |
| **Paysages culturels** | Val de Loire, Causses et Cévennes |
| Patrimoine **immatériel** | Le repas gastronomique des Français, le savoir-faire de la **baguette**, l’art du zinc des couvreurs parisiens |

## Une ressource économique
Premier pays touristique du monde par le nombre de visiteurs internationaux : le Louvre, Versailles, le Mont-Saint-Michel.

> Les **Journées européennes du patrimoine**, nées **en France en 1984**, attirent chaque année des millions de visiteurs — et ont été reprises dans toute l’Europe.

## Une diplomatie du patrimoine
| Levier | Ce qu’il fait |
| Le siège de l’**UNESCO** à Paris | Une centralité institutionnelle |
| Le fonds **ALIPH**, créé en 2017 avec les Émirats | La protection du patrimoine **en zone de conflit** |
| Coopérations archéologiques, instituts français | Un réseau mondial |
| Le **Louvre Abou Dabi**, 2017 | La forme la plus **commerciale** : le nom du musée est loué |

> Le patrimoine est pour la France un « **soft power** » : il projette une image, ouvre des relations, et **rapporte**.

## Des débats
| Débat | Ce qui s’oppose |
| Les **restitutions** aux anciennes colonies | Inaliénabilité des collections publiques contre réparation historique |
| Le **coût** de l’entretien des églises rurales | Charge des communes contre valeur patrimoniale |
| Préservation contre **logement** ou **transition énergétique** | Isolation, éoliennes en covisibilité |

> La politique du patrimoine est un **arbitrage permanent** — jamais une simple conservation.`,
          },
          questions: [
            ['Qui crée le ministère des Affaires culturelles en 1959 ?', ['André Malraux', 'Jack Lang', 'Prosper Mérimée', 'Georges Pompidou'], 0, 'Il fait du patrimoine et de sa diffusion une politique d’État à part entière.'],
            ['Que crée la loi Malraux de 1962 ?', ['Les secteurs sauvegardés', 'Les monuments historiques', 'Les parcs nationaux', 'Le Loto du patrimoine'], 0, 'Elle protège des quartiers entiers, et non plus des édifices isolés.'],
            ['Dans quel pays sont nées les Journées européennes du patrimoine, en 1984 ?', ['En France', 'En Italie', 'En Allemagne', 'Au Royaume-Uni'], 0, 'L’initiative française a ensuite été reprise dans toute l’Europe.'],
            ['Quel site industriel français a été inscrit au patrimoine mondial en 2012 ?', ['Le bassin minier du Nord-Pas-de-Calais', 'Les salines d’Arc-et-Senans', 'Le viaduc de Millau', 'Les chantiers de Saint-Nazaire'], 0, 'La reconnaissance d’un patrimoine ouvrier et paysager.'],
            ['Qu’est-ce que le fonds ALIPH, créé en 2017 ?', ['Un fonds international de protection du patrimoine en zone de conflit', 'Un fonds d’aide aux musées français', 'Un programme de restitution', 'Un label touristique'], 0, 'Une initiative franco-émirienne, prolongement diplomatique du patrimoine.'],
            ['Le Louvre Abou Dabi illustre une forme commerciale de la diplomatie culturelle française.', ['Vrai', 'Faux'], 0, 'Le nom du musée et son expertise y sont loués contre rémunération.'],
            ['Quel élément du patrimoine immatériel français est inscrit à l’UNESCO ?', ['Le repas gastronomique des Français', 'La Marseillaise', 'Le Tour de France', 'La langue française'], 0, 'Rejoint depuis par le savoir-faire de la baguette et l’art du zinc.'],
            ['Quelle tension traverse aujourd’hui la politique du patrimoine ?', ['Préservation contre transition énergétique et besoins en logement', 'Tourisme contre archéologie', 'État contre UNESCO', 'Musées contre bibliothèques'], 0, 'Isolation, éoliennes en covisibilité, densification : chaque projet doit être arbitré.'],
          ],
        },
        // ===================================================================
        // Chapitre 5 — L’environnement, un enjeu planétaire
        // ===================================================================
        {
          titre: 'Qu’est-ce que l’environnement ?',
          axe: 'L’environnement, un enjeu planétaire',
          lecon: {
            titre: 'Une notion récente, une histoire longue',
            cours: `L’environnement paraît une évidence : le milieu qui nous entoure. C’est en réalité une **construction récente**, et son histoire dit beaucoup du rapport que les sociétés entretiennent avec la nature.

## Une construction culturelle
| Conception | Sa tradition |
| Une nature **à dominer** | La tradition occidentale issue de la Genèse |
| Une nature-**milieu** dont on fait partie | D’autres cosmologies |

> Le mot « environnement » ne s’impose au sens actuel qu’au **XXe siècle**. Il désigne l’ensemble des **relations** entre les sociétés et leur milieu : sols, eau, air, vivant.

## Les jalons de la prise de conscience
| Date | L’événement | Ce qu’il apporte |
| **XIXe siècle** | Premiers **parcs nationaux** — Yellowstone, **1872** | La réaction des naturalistes à l’industrialisation |
| **1972** | Rapport **Halte à la croissance ?** du Club de Rome, et **conférence de Stockholm** | La première conférence mondiale ; création du **PNUE** |
| **1987** | Le **rapport Brundtland** | La définition du **développement durable** |
| **1992** | Le **sommet de Rio** | Le vocabulaire s’installe : biodiversité, climat, Agenda 21 |

Le développement durable « répond aux besoins du présent **sans compromettre** la capacité des générations futures à répondre aux leurs ».

## L’anthropocène
Popularisé par **Paul Crutzen** en **2000** : une époque où l’humanité est devenue une **force géologique** — elle modifie le climat, les cycles de l’azote et du carbone, la biodiversité, la sédimentation.

| Date de départ proposée | Ce qu’elle implique |
| Le **Néolithique** | Une responsabilité **diffuse**, très ancienne |
| La **Révolution industrielle** | La responsabilité des pays **industrialisés en premier** |
| La « **grande accélération** » de 1950 | Une responsabilité **contemporaine**, mesurable |

> Le débat sur la date est aussi un **débat sur les responsabilités**. C’est ce qui le rend politique.

## Trois échelles indissociables
Le **local** (un fleuve, une forêt), le **national** (les politiques publiques), le **mondial** (le climat, les océans).

> Un même problème environnemental se joue **simultanément** sur les trois — ce qui explique la difficulté à le gouverner.`,
          },
          questions: [
            ['Qui a popularisé le terme d’anthropocène en 2000 ?', ['Paul Crutzen', 'Rachel Carson', 'Gro Harlem Brundtland', 'James Lovelock'], 0, 'Le chimiste de l’atmosphère désigne ainsi une humanité devenue force géologique.'],
            ['Quel rapport définit en 1987 le développement durable ?', ['Le rapport Brundtland', 'Le rapport du Club de Rome', 'Le rapport Stern', 'Le rapport Meadows'], 0, 'Répondre aux besoins du présent sans compromettre ceux des générations futures.'],
            ['Quelle conférence de 1972 est la première conférence mondiale sur l’environnement ?', ['La conférence de Stockholm', 'Le sommet de Rio', 'La COP1 de Berlin', 'La conférence de Kyoto'], 0, 'Elle donne naissance au Programme des Nations unies pour l’environnement.'],
            ['Quel est le premier parc national créé au monde, en 1872 ?', ['Yellowstone', 'Yosemite', 'Le Kruger', 'La Vanoise'], 0, 'Il inaugure une conception de la nature protégée par mise à l’écart.'],
            ['Que met en avant le sommet de Rio de 1992 ?', ['La biodiversité, le climat et l’Agenda 21', 'Le protocole de Montréal', 'La création du GIEC', 'La taxe carbone'], 0, 'Il installe le vocabulaire international de l’environnement.'],
            ['La notion d’environnement est une donnée naturelle, identique dans toutes les cultures.', ['Vrai', 'Faux'], 1, 'C’est une construction culturelle et historique, variable selon les sociétés.'],
            ['Que désigne la « grande accélération » ?', ['L’emballement des pressions humaines sur la planète depuis 1950', 'La croissance démographique du XIXe siècle', 'La révolution numérique', 'La hausse des rendements agricoles médiévaux'], 0, 'C’est l’une des dates candidates pour marquer le début de l’anthropocène.'],
            ['Quel rapport de 1972 alerte sur les limites de la croissance ?', ['Halte à la croissance ?, du Club de Rome', 'Le rapport Brundtland', 'Printemps silencieux', 'Le rapport du GIEC'], 0, 'Le rapport Meadows modélise l’épuisement des ressources.'],
          ],
        },
        {
          titre: 'Exploiter, préserver et protéger l’environnement',
          axe: 'L’environnement, un enjeu planétaire',
          lecon: {
            titre: 'Ressources, pressions et politiques de protection',
            cours: `Exploiter et protéger ne sont pas deux moments **successifs** : les sociétés font les deux **en même temps**, et c’est leur articulation qui fait débat.

## Exploiter
| Type de ressource | Exemples |
| **Renouvelables** | Forêts, eau douce, poissons |
| **Non renouvelables** | Pétrole, gaz, minerais |

Exploitation forestière, pêche industrielle, extraction minière et agriculture intensive ont permis de nourrir et d’équiper une population **quadruplée** au XXe siècle — au prix d’une pression inédite.

## Les pressions mesurées
| Pression | Son ampleur |
| **Déforestation** | Amazonie, bassin du Congo, Indonésie |
| **Surpêche** | Un **tiers** des stocks exploités **au-delà** de leur renouvellement |
| Sols | Érosion, **salinisation** |
| Eau | **Stress hydrique** croissant |
| Pollutions | Chimiques et **plastiques** |
| **Biodiversité** | La **sixième extinction**, documentée par l’IPBES |

## Protéger
| Outil | Ce qu’il vise |
| Les **aires protégées** | Parcs nationaux, réserves, aires marines — objectif de **30 % des terres et des mers en 2030** (Kunming-Montréal, 2022) |
| **CITES**, 1973 | Le commerce des espèces menacées |
| Convention sur la **diversité biologique**, 1992 | La protection du vivant |
| Protocole de **Montréal**, 1987 | Les gaz destructeurs de la couche d’ozone |
| Les **réglementations nationales** | Études d’impact, **pollueur-payeur**, **principe de précaution** |

En France, le principe de précaution est inscrit dans la **Charte de l’environnement**, adossée à la Constitution en **2005**.

> L’**ozone** montre qu’un accord mondial **peut** fonctionner : substances **identifiées**, alternatives **disponibles**, industriels **peu nombreux**. Le climat réunit rarement ces trois conditions — c’est toute la différence.

## Des conflits d’usage
Barrages, mines, aéroports, éoliennes, parcs naturels : chaque projet oppose habitants, entreprises, ONG et États.

> La protection de l’environnement est un **rapport de force**, pas seulement une politique publique.`,
          },
          questions: [
            ['Quel protocole de 1987 a permis de réduire les gaz détruisant la couche d’ozone ?', ['Le protocole de Montréal', 'Le protocole de Kyoto', 'L’accord de Paris', 'La convention CITES'], 0, 'C’est le succès le plus net de la coopération environnementale mondiale.'],
            ['Que vise l’accord de Kunming-Montréal de 2022 ?', ['Protéger 30 % des terres et des mers d’ici 2030', 'Interdire le charbon', 'Créer une taxe carbone mondiale', 'Limiter la pêche à 10 %'], 0, 'Un objectif chiffré pour enrayer l’effondrement de la biodiversité.'],
            ['Quelle convention encadre le commerce international des espèces menacées ?', ['La CITES', 'La convention de Ramsar', 'La convention de Bâle', 'La convention de Vienne'], 0, 'Signée en 1973, elle réglemente ou interdit ces échanges.'],
            ['Quel principe est inscrit dans la Charte de l’environnement française de 2005 ?', ['Le principe de précaution', 'Le principe de subsidiarité', 'Le principe de réciprocité', 'Le principe d’unanimité'], 0, 'La Charte a valeur constitutionnelle depuis 2005.'],
            ['Qu’est-ce que la surpêche ?', ['Une exploitation supérieure à la capacité de renouvellement des stocks', 'La pêche en haute mer', 'La pêche pratiquée hors saison', 'La pêche industrielle en général'], 0, 'Environ un tiers des stocks mondiaux sont dans cette situation.'],
            ['La protection de l’environnement fait consensus entre tous les acteurs d’un territoire.', ['Vrai', 'Faux'], 1, 'Chaque projet oppose habitants, entreprises, ONG et États : c’est un rapport de force.'],
            ['Quelle organisation évalue à l’échelle mondiale l’état de la biodiversité ?', ['L’IPBES', 'Le GIEC', 'L’AIEA', 'L’OMC'], 0, 'C’est l’équivalent du GIEC pour le vivant.'],
            ['Que désigne le principe pollueur-payeur ?', ['Faire supporter le coût des dommages à celui qui les cause', 'Interdire toute pollution', 'Taxer les consommateurs', 'Indemniser les industriels'], 0, 'Il vise à internaliser dans le prix le coût environnemental réel.'],
          ],
        },
        {
          titre: 'Le changement climatique : approches historique et géopolitique',
          axe: 'L’environnement, un enjeu planétaire',
          lecon: {
            titre: 'Un savoir scientifique devenu question diplomatique',
            cours: `Le climat a **toujours** varié ; ce qui est nouveau, c’est la **vitesse** du réchauffement actuel et sa cause **humaine**. Ce constat scientifique est devenu, en trente ans, l’un des principaux sujets de négociation internationale.

## Le climat a une histoire
Optimum médiéval, puis **Petit Âge glaciaire** (XIVe-XIXe siècle) : hivers rigoureux, mauvaises récoltes, famines.

> Les historiens — **Emmanuel Le Roy Ladurie** — l’étudient à partir des **dates de vendanges**, des registres paroissiaux et des glaciers. Le climat est donc un objet d’histoire, pas seulement de science physique.

## La construction du savoir
| Étape | Ce qu’elle établit |
| **XIXe siècle** : Fourier, Tyndall, **Arrhenius** | La découverte de l’**effet de serre** |
| **1958** : Charles **Keeling** à Mauna Loa | La mesure continue du **CO₂** atmosphérique |
| **1988** : création du **GIEC** | La synthèse des travaux, rapport après rapport |

Jusqu’à une **certitude** sur l’origine humaine du réchauffement.

## Une gouvernance mondiale difficile
| Date | Le texte | Sa portée |
| **1992** | Convention-cadre de **Rio** | Le cadre général |
| **1997** | Protocole de **Kyoto** | **Contraignant**, mais limité aux pays développés — les **États-Unis ne le ratifient pas** |
| **2015** | Accord de **Paris** (COP21) | **Universel**, mais fondé sur des engagements **volontaires** |

L’objectif de Paris : contenir le réchauffement « **nettement en dessous de 2 °C** », en visant **1,5 °C**.

## Un problème géopolitique
| Groupe de pays | Sa position |
| Les pays **développés** | L’essentiel des émissions **historiques** |
| Les pays **émergents** | Une part croissante des émissions **actuelles** |
| Les **États insulaires** et les pays du Sud | Ils **subissent** les effets les plus violents |

D’où le principe des « **responsabilités communes mais différenciées** », et les débats sur le financement — le fonds « **pertes et dommages** », créé en 2022.

> Négocier le climat, c’est négocier un **partage** : celui d’un **budget carbone restant**, donc d’un **droit à se développer**.

## Des effets déjà là
Montée du niveau des mers, canicules, fonte des glaciers, **migrations environnementales**, tensions sur l’eau.

> Le climat devient un **facteur de conflits** et de recompositions territoriales : il ne relève plus seulement de la politique environnementale.`,
          },
          questions: [
            ['En quelle année le GIEC a-t-il été créé ?', ['1988', '1972', '1997', '2015'], 0, 'Il évalue et synthétise l’état des connaissances scientifiques sur le climat.'],
            ['Quel accord de 2015 fixe l’objectif de contenir le réchauffement nettement sous 2 °C ?', ['L’accord de Paris', 'Le protocole de Kyoto', 'L’accord de Copenhague', 'La convention de Rio'], 0, 'Universel, mais fondé sur des engagements volontaires des États.'],
            ['Quelle limite majeure affectait le protocole de Kyoto ?', ['Il ne contraignait que les pays développés et les États-Unis ne l’ont pas ratifié', 'Il était trop contraignant pour tous', 'Il ne visait que le méthane', 'Il n’a jamais été signé'], 0, 'D’où le changement d’architecture retenu à Paris en 2015.'],
            ['Qu’appelle-t-on le Petit Âge glaciaire ?', ['Une période de refroidissement du XIVe au XIXe siècle', 'La dernière glaciation', 'Un épisode volcanique', 'Le refroidissement des années 1970'], 0, 'Il rappelle que le climat variait déjà avant l’ère industrielle — mais bien plus lentement.'],
            ['Que désigne le principe de « responsabilités communes mais différenciées » ?', ['Tous les États sont concernés, mais pas au même degré', 'Seuls les pays du Sud sont responsables', 'Chaque État agit seul', 'Les entreprises sont seules responsables'], 0, 'Il tient compte des émissions historiques et des capacités de chacun.'],
            ['Les mesures de CO₂ de Mauna Loa ont montré une hausse continue de sa concentration.', ['Vrai', 'Faux'], 0, 'La courbe de Keeling, commencée en 1958, est l’une des preuves les plus parlantes.'],
            ['Quel fonds a été créé en 2022 pour aider les pays les plus vulnérables ?', ['Le fonds « pertes et dommages »', 'Le Fonds vert', 'Le fonds ALIPH', 'Le fonds carbone'], 0, 'Il reconnaît que certains dommages climatiques ne sont plus évitables.'],
            ['Pourquoi le climat est-il un problème géopolitique et pas seulement scientifique ?', ['Parce que responsabilités et effets sont inégalement répartis', 'Parce que la science est incertaine', 'Parce qu’il ne concerne que l’Arctique', 'Parce qu’aucun État ne l’a reconnu'], 0, 'Négocier le climat revient à partager un budget carbone, donc un droit à se développer.'],
          ],
        },
        {
          titre: 'Les États-Unis et la question environnementale',
          axe: 'L’environnement, un enjeu planétaire',
          lecon: {
            titre: 'Pionniers de la protection, réticents du climat',
            cours: `Les États-Unis sont l’étude de cas du thème parce qu’ils **cumulent les contraires** : ils ont **inventé** la protection de la nature, et ils ont longtemps **freiné** la négociation climatique.

## Des pionniers de la protection
| Jalon | Sa date |
| **Yellowstone**, premier parc national du monde | **1872** |
| **John Muir** et le Sierra Club | Fin du XIXe siècle |
| **Theodore Roosevelt** protège des millions d’hectares | Années 1900 |

> La conception américaine **sépare** la *wilderness*, nature sauvage à préserver, des espaces exploités. C’est une protection par **mise à l’écart**, non par gestion intégrée.

## Une prise de conscience précoce
| Date | L’événement |
| **1962** | *Printemps silencieux* de **Rachel Carson** dénonce les pesticides et lance l’écologie moderne |
| **1970** | Le premier **Jour de la Terre** rassemble **vingt millions** d’Américains |
| **1970** | Création de l’**EPA**, l’Agence de protection de l’environnement — **sous Nixon** |
| Années 1970 | **Clean Air Act**, **Clean Water Act** |

## Une puissance très émettrice
| Classement | Sa position |
| Émissions **annuelles** de CO₂ | **Deuxième**, derrière la Chine |
| Émissions **cumulées** depuis 1850 | **Premier** |
| Émissions **par habitant** | Parmi les tout premiers |

Un mode de vie fondé sur l’**automobile**, l’étalement urbain, la climatisation, l’abondance énergétique. La **révolution du gaz de schiste** en a même fait un **exportateur** d’hydrocarbures.

## Une position internationale en dents de scie
| Date | La décision |
| **Kyoto** | Signature, mais **non-ratification** |
| **2015**, sous Obama | Rôle **moteur** dans l’accord de Paris |
| **2017**, sous Trump | **Retrait** annoncé, effectif en 2020 |
| **2021**, sous Biden | **Retour** ; puis l’**Inflation Reduction Act** (2022), plus grand plan d’investissement climatique américain |

> La politique environnementale change **avec les majorités** : c’est le **fédéralisme** et l’**alternance** qui rendent la position du pays si instable.

## Le rôle des contre-pouvoirs
Les **États fédérés** — la **Californie** et ses normes propres —, les villes, les entreprises et les **tribunaux** mènent leur propre politique.

> Le pays **agit même quand Washington recule**. C’est la nuance qui manque à la plupart des copies.`,
          },
          questions: [
            ['Quel ouvrage de Rachel Carson lance l’écologie moderne en 1962 ?', ['Printemps silencieux', 'Halte à la croissance ?', 'La Terre vue du ciel', 'Notre avenir à tous'], 0, 'Il dénonce les effets des pesticides, à commencer par le DDT.'],
            ['Quelle agence fédérale de protection de l’environnement est créée en 1970 ?', ['L’EPA', 'La NOAA', 'Le NPS', 'La FEMA'], 0, 'Créée sous Nixon, elle applique le Clean Air Act et le Clean Water Act.'],
            ['Quelle décision Donald Trump prend-il en 2017 concernant le climat ?', ['Le retrait des États-Unis de l’accord de Paris', 'Le retrait du protocole de Kyoto', 'La fermeture de l’EPA', 'La ratification de Kyoto'], 0, 'Effectif en 2020, il est annulé par Joe Biden dès 2021.'],
            ['Quel plan d’investissement climatique les États-Unis adoptent-ils en 2022 ?', ['L’Inflation Reduction Act', 'Le Green New Deal', 'Le Clean Power Plan', 'L’American Rescue Plan'], 0, 'Le plus important effort d’investissement climatique de leur histoire.'],
            ['Que désigne la notion de wilderness dans la culture américaine ?', ['Une nature sauvage à préserver de toute exploitation', 'Une zone agricole protégée', 'Un parc urbain', 'Une réserve indienne'], 0, 'Elle fonde la conception américaine du parc national.'],
            ['Les États-Unis sont le premier émetteur mondial de CO₂ en émissions cumulées depuis 1850.', ['Vrai', 'Faux'], 0, 'Devant la Chine, qui est aujourd’hui le premier émetteur annuel.'],
            ['Quelle révolution énergétique a fait des États-Unis un exportateur d’hydrocarbures ?', ['Le gaz de schiste', 'Le nucléaire civil', 'L’éolien offshore', 'Le charbon propre'], 0, 'La fracturation hydraulique a bouleversé leur bilan énergétique.'],
            ['Quel échelon institutionnel permet aux États-Unis d’agir même quand l’État fédéral recule ?', ['Les États fédérés et les villes', 'Le Sénat seul', 'La Cour suprême seule', 'Le Pentagone'], 0, 'La Californie impose par exemple ses propres normes d’émissions.'],
          ],
        },
        // ===================================================================
        // Chapitre 6 — L’enjeu de la connaissance
        // ===================================================================
        {
          titre: 'Vers une société de la connaissance',
          axe: 'L’enjeu de la connaissance',
          lecon: {
            titre: 'Quand le savoir devient la première ressource',
            cours: `Une « société de la connaissance » est une société où la **production**, la **circulation** et l’**usage** du savoir sont devenus le principal moteur économique et le principal facteur de puissance. L’expression est récente ; le mouvement, ancien.

## Les étapes d’une longue montée
| Étape | Sa date | Ce qu’elle élargit |
| L’imprimerie de **Gutenberg** | vers **1450** | La reproduction du texte |
| La **République des Lettres** | XVIIe-XVIIIe siècles | La circulation entre savants |
| L’*Encyclopédie* de Diderot et d’Alembert | XVIIIe siècle | L’ambition de tout rassembler |
| Le modèle **Humboldt** | **1810** | L’université **de recherche** |
| Les **lois Ferry** | **1881-1882** | L’instruction **obligatoire** |

## Une économie de la connaissance
Depuis les années 1990, la croissance repose de plus en plus sur l’**immatériel** : recherche et développement, brevets, logiciels, formation.

| L’objectif européen | Son résultat |
| Stratégie de **Lisbonne**, **2000** : devenir « l’économie de la connaissance la plus compétitive du monde » | — |
| Une cible de **3 % du PIB** consacrés à la R&D | **Rarement atteinte** |

## Massification et inégalités
| Constat | Sa portée |
| Le nombre d’étudiants dans le monde a été **multiplié par plus de cinq** depuis 1970 | La massification est réelle |
| L’alphabétisation dépasse **86 %** des adultes | — |
| La **fracture numérique** | L’accès reste très inégal |
| Le sous-financement de la recherche au **Sud** | — |
| La **fuite des cerveaux** | Vers l’Amérique du Nord et l’Europe |

> Ce qui compte n’est plus seulement de **détenir** un savoir, mais d’avoir les **moyens d’en produire** : universités, laboratoires, données, calcul.

## Les nouveaux acteurs
Universités et États, mais aussi **entreprises** — les géants du numérique financent une part croissante de la recherche en **intelligence artificielle** —, fondations, et réseaux **transnationaux** de chercheurs.

> La connaissance échappe de plus en plus au seul **cadre national**.`,
          },
          questions: [
            ['Quelle invention du milieu du XVe siècle accélère la diffusion des savoirs en Europe ?', ['L’imprimerie de Gutenberg', 'Le télescope', 'La machine à vapeur', 'Le papier'], 0, 'Elle rend possible une circulation des textes sans précédent.'],
            ['Quel modèle universitaire, né en 1810, associe enseignement et recherche ?', ['Le modèle Humboldt', 'Le modèle napoléonien', 'Le modèle d’Oxford', 'Le modèle jésuite'], 0, 'Il inspire les universités de recherche du monde entier.'],
            ['Quel objectif de R&D la stratégie de Lisbonne fixe-t-elle en 2000 ?', ['3 % du PIB consacrés à la recherche', '10 % du PIB', '1 % du PIB', 'Aucun objectif chiffré'], 0, 'Un objectif que la plupart des États européens n’ont pas atteint.'],
            ['Qu’est-ce que la fuite des cerveaux ?', ['Le départ de chercheurs qualifiés vers les pays les mieux dotés', 'La perte d’archives scientifiques', 'L’abandon des études supérieures', 'La fermeture de laboratoires'], 0, 'Elle prive les pays de départ du bénéfice de la formation qu’ils ont financée.'],
            ['Quelles lois rendent l’école primaire obligatoire et gratuite en France ?', ['Les lois Ferry (1881-1882)', 'La loi Guizot (1833)', 'La loi Haby (1975)', 'La loi Debré (1959)'], 0, 'Un jalon décisif de la diffusion du savoir à toute une société.'],
            ['Dans une économie de la connaissance, la croissance repose surtout sur l’immatériel.', ['Vrai', 'Faux'], 0, 'R&D, brevets, logiciels et formation en sont les principaux moteurs.'],
            ['Quel ouvrage du XVIIIe siècle incarne le projet de rassembler et diffuser tous les savoirs ?', ['L’Encyclopédie de Diderot et d’Alembert', 'Le Dictionnaire de l’Académie', 'La Somme théologique', 'Les Essais de Montaigne'], 0, 'Un projet éditorial et politique autant que scientifique.'],
            ['Quel acteur privé finance aujourd’hui une part croissante de la recherche en intelligence artificielle ?', ['Les grandes entreprises du numérique', 'Les fondations religieuses', 'Les collectivités locales', 'Les organisations syndicales'], 0, 'Ce qui déplace hors des États une partie du pilotage de la recherche.'],
          ],
        },
        {
          titre: 'Produire et diffuser des connaissances',
          axe: 'L’enjeu de la connaissance',
          lecon: {
            titre: 'Qui produit le savoir, et qui y accède ?',
            cours: `Produire une connaissance suppose des **moyens** ; la diffuser suppose des **canaux**. Les deux sont très inégalement répartis, et les règles qui les encadrent sont elles-mêmes des enjeux de pouvoir.

## Comment se produit la science
| Élément | Son rôle |
| Les **laboratoires** publics et privés | Le lieu du travail |
| Les **financements sur projet** | La sélection des recherches |
| Les revues à **comité de lecture** | L’**évaluation par les pairs** |
| Les **grands équipements** | Accélérateurs, télescopes, supercalculateurs |

> Les grands équipements imposent la **coopération internationale** : CERN, ITER, Station spatiale internationale. Aucun État ne les finance seul.

## Une géographie très concentrée
| Zone | Sa place |
| États-Unis, Chine, Union européenne, Japon, Corée du Sud | L’**essentiel** de la dépense mondiale de R&D |
| La **Chine** | **Premier** producteur d’articles en volume, **premier** déposant de brevets |
| L’**Afrique subsaharienne** | Moins de **1 %** de la production scientifique mondiale |

## Diffuser : entre ouverture et fermeture
| Régime | Ce qu’il fait |
| L’*open access* et les archives ouvertes | Rendre les résultats **gratuitement** accessibles, contre le modèle payant des grands éditeurs |
| Les **brevets** | Protéger l’innovation — mais **réserver** son usage |
| Le **secret** militaire, industriel, d’État | Soustraire des pans entiers de la recherche à la publication |

> Le débat sur les **brevets des vaccins** pendant la pandémie de Covid-19 a porté cette tension à l’échelle mondiale.

> Un savoir **non publié n’existe pas** pour la communauté scientifique ; un savoir **publié échappe** à celui qui l’a produit. Toute politique de recherche **arbitre** entre les deux.

## Les menaces sur la crédibilité
| Menace | Ce qu’elle produit |
| **Fraudes** et rétractations | Le doute sur les résultats |
| Revues **prédatrices** | La publication sans évaluation réelle |
| Études financées par des **industriels intéressés** | Le conflit d’intérêts |
| La **mise en doute organisée** | Le tabac, puis le climat |

> La **confiance** dans la science est devenue un enjeu politique à part entière.`,
          },
          questions: [
            ['Comment s’appelle l’évaluation d’un article scientifique par d’autres chercheurs avant publication ?', ['L’évaluation par les pairs', 'L’audit externe', 'Le contrôle éditorial', 'La certification'], 0, 'C’est la procédure de base du contrôle de qualité scientifique.'],
            ['Quel pays est devenu le premier producteur mondial d’articles scientifiques en volume ?', ['La Chine', 'Les États-Unis', 'Le Japon', 'L’Allemagne'], 0, 'Elle est aussi le premier déposant mondial de brevets.'],
            ['Que défend le mouvement de l’open access ?', ['L’accès gratuit aux résultats de la recherche', 'La suppression des brevets', 'La publication en anglais uniquement', 'La fermeture des archives'], 0, 'Il s’oppose au modèle payant des grands éditeurs scientifiques.'],
            ['Quel grand équipement européen illustre la coopération scientifique internationale ?', ['Le CERN', 'Le CNRS', 'La NASA', 'L’INSERM'], 0, 'Comme ITER ou l’ISS, il dépasse les moyens d’un seul État.'],
            ['Quel débat mondial la pandémie de Covid-19 a-t-elle relancé sur la diffusion du savoir ?', ['Celui des brevets sur les vaccins', 'Celui des revues prédatrices', 'Celui de la fuite des cerveaux', 'Celui du financement des universités'], 0, 'Protéger l’innovation ou permettre l’accès : l’arbitrage est politique.'],
            ['L’Afrique subsaharienne représente moins de 1 % de la production scientifique mondiale.', ['Vrai', 'Faux'], 0, 'Un écart qui traduit la concentration des financements de la recherche.'],
            ['Qu’est-ce qu’une revue prédatrice ?', ['Une revue qui publie contre paiement sans réelle évaluation scientifique', 'Une revue réservée aux militaires', 'Une revue à accès payant', 'Une revue interdisant la citation'], 0, 'Elle profite de la pression à publier et affaiblit la crédibilité de la science.'],
            ['Quelle stratégie a été employée par certaines industries pour retarder des décisions publiques ?', ['La mise en doute organisée des résultats scientifiques', 'Le financement de l’open access', 'La publication systématique des données', 'Le dépôt de brevets libres'], 0, 'Le tabac puis le climat en offrent les exemples les mieux documentés.'],
          ],
        },
        {
          titre: 'La connaissance, enjeu politique et géopolitique',
          axe: 'L’enjeu de la connaissance',
          lecon: {
            titre: 'Savoir, pouvoir et rivalités entre puissances',
            cours: `Le savoir n’est **pas neutre** politiquement : il donne un avantage militaire, économique et symbolique. Les États le savent — et cherchent à le **produire**, à le **capter** ou à le **contrôler**.

## La science sous contrainte politique
| Cas | Ce qu’il montre |
| Le **lyssenkisme** en URSS | Il ruine la génétique soviétique pendant **vingt ans** |
| La « science aryenne » nazie | Elle **chasse** les savants juifs |
| Le procès de **Galilée** | Le symbole du conflit entre **autorité** et **démonstration** |

> Quand un régime décide de **ce qui est vrai**, la science recule. Les régimes autoritaires contrôlent aussi l’accès à l’information et **censurent Internet**.

## Le savoir comme arme
Le **projet Manhattan** (1942-1945) montre l’alliance de l’**État**, de l’**armée** et de la **science** : la connaissance devient une **capacité militaire décisive**.

> Après 1945, la guerre froide se joue aussi dans les **laboratoires** — nucléaire, espace, informatique. Les scientifiques deviennent une **ressource stratégique** que l’on récupère : opération **Paperclip**.

## Les rivalités actuelles
| Domaine | Ce qui s’y joue |
| Les **semi-conducteurs** | Contrôles à l’exportation, **CHIPS Act** américain, plans chinois |
| L’**intelligence artificielle** | La course aux modèles et aux données |
| Le **quantique** et la **5G** | Restrictions sur **Huawei** |

L’**espionnage industriel** et les **cyberattaques** visant les laboratoires font partie du répertoire.

## Le soft power du savoir
| Instrument | Son effet |
| Universités **attractives**, bourses | Former des élites qui garderont un lien avec le pays d’accueil |
| Instituts culturels | Les **instituts Confucius** pour la Chine |
| Classements internationaux — **Shanghai** | Ils orientent les flux d’étudiants |

Les États-Unis en ont fait un **pilier** de leur influence.

> La connaissance est à la fois une **ressource que l’on protège** et une **influence que l’on projette** : c’est ce double statut qui en fait un enjeu géopolitique.`,
          },
          questions: [
            ['Qu’est-ce que le lyssenkisme ?', ['Une doctrine imposée par le pouvoir soviétique qui a ruiné la génétique', 'Une théorie physique russe', 'Un mouvement d’ouverture scientifique', 'Une méthode agricole reconnue'], 0, 'Un cas d’école de science soumise à l’idéologie.'],
            ['Quel programme illustre l’alliance de l’État, de l’armée et de la science pendant la Seconde Guerre mondiale ?', ['Le projet Manhattan', 'Le plan Marshall', 'L’opération Overlord', 'Le programme Apollo'], 0, 'Il aboutit à la bombe atomique en 1945.'],
            ['Sur quelle technologie porte aujourd’hui une part majeure de la rivalité sino-américaine ?', ['Les semi-conducteurs', 'Le textile', 'La sidérurgie', 'L’agroalimentaire'], 0, 'Contrôles à l’exportation et subventions massives de part et d’autre.'],
            ['Quel instrument la Chine utilise-t-elle pour diffuser sa langue et son influence culturelle ?', ['Les instituts Confucius', 'Les instituts Cervantès', 'Les Alliances françaises', 'Le British Council'], 0, 'Le savoir et la langue comme leviers de soft power.'],
            ['Quelle opération a permis aux États-Unis de récupérer des scientifiques allemands après 1945 ?', ['L’opération Paperclip', 'L’opération Overlord', 'L’opération Torch', 'L’opération Barbarossa'], 0, 'Les savants sont devenus eux-mêmes une ressource stratégique.'],
            ['Un régime politique peut infléchir durablement le contenu de la recherche scientifique.', ['Vrai', 'Faux'], 0, 'Le lyssenkisme soviétique et la « science aryenne » nazie en sont les preuves.'],
            ['À quoi sert un classement international d’universités comme celui de Shanghai ?', ['Il alimente la compétition et l’attractivité des systèmes universitaires', 'Il répartit les financements de l’ONU', 'Il fixe les programmes scolaires', 'Il délivre des diplômes'], 0, 'Ces classements sont contestés, mais très utilisés par les États et les étudiants.'],
            ['Quel procès reste le symbole du conflit entre autorité et démonstration scientifique ?', ['Le procès de Galilée', 'Le procès de Nuremberg', 'Le procès Dreyfus', 'Le procès du singe'], 0, 'Condamné en 1633 pour avoir défendu l’héliocentrisme.'],
          ],
        },
        {
          titre: 'Le cyberespace : conflictualité et coopération entre les acteurs',
          axe: 'L’enjeu de la connaissance',
          lecon: {
            titre: 'Un espace sans frontières, mais pas sans puissance',
            cours: `Le cyberespace est le dernier des « nouveaux espaces » du programme. Il n’a **pas de territoire**, mais il a une géographie très concrète : des **câbles**, des **serveurs**, des **normes** — et des États qui cherchent à le contrôler.

## Trois couches
| Couche | Ce qu’elle contient | Ce qui s’y joue |
| **Matérielle** | Câbles sous-marins, data centers, satellites, terminaux | Elle est **localisée**, donc vulnérable et soumise à des souverainetés |
| **Logicielle** | Protocoles, systèmes d’exploitation, normes | Elle est **dominée par quelques acteurs** |
| **Sémantique** | Contenus, réseaux sociaux, information | Les **batailles d’influence** |

## Une origine militaire devenue mondiale
| Date | L’étape |
| **1969** | **ARPANET**, issu d’un programme de recherche militaire américain |
| **1989-1991** | Le **web**, inventé au CERN par Tim Berners-Lee et **donné au domaine public** |

> Cette histoire explique le **poids durable des États-Unis** dans la gouvernance technique : ICANN, standards, entreprises dominantes.

## Une conflictualité réelle
| Type | Exemples |
| **Cyberattaques** d’État | **Estonie** (2007), **Stuxnet** contre le nucléaire iranien |
| **Cybercriminalité** | Rançongiciels contre des hôpitaux, vols de données |
| **Ingérences** | Manipulations électorales, campagnes de désinformation |
| **Surveillance de masse** | Révélée par **Snowden**, 2013 |

La cyberdéfense devient une composante des armées : commandement français dédié, et le cyber **reconnu comme domaine d’opérations par l’OTAN en 2016**.

## Des souverainetés qui se referment
| Acteur | Sa stratégie |
| La **Chine** | Un Internet contrôlé : la « **Grande Muraille numérique** » |
| La **Russie** | Elle teste un **réseau autonome** |
| L’**Union européenne** | Elle **légifère** : **RGPD** (2018), DSA et DMA, pour imposer ses normes aux plateformes |

On parle de **fragmentation** de l’Internet, ou *splinternet*.

> Le cyberespace **n’efface pas les frontières** : il les **déplace** vers les câbles, les normes et les serveurs.

## Et de la coopération
Normes techniques partagées, coopération policière contre la cybercriminalité (**convention de Budapest**, 2001), CERT nationaux, discussions à l’ONU sur un comportement responsable des États.

> La coopération existe — mais elle reste **en retard sur les usages**.`,
          },
          questions: [
            ['Quel réseau, ancêtre d’Internet, naît en 1969 d’un programme militaire américain ?', ['ARPANET', 'Minitel', 'Usenet', 'Ethernet'], 0, 'Cette origine explique le poids durable des États-Unis dans la gouvernance du réseau.'],
            ['Qui invente le World Wide Web au CERN entre 1989 et 1991 ?', ['Tim Berners-Lee', 'Vinton Cerf', 'Steve Jobs', 'Alan Turing'], 0, 'Il choisit de le placer dans le domaine public, ce qui accélère sa diffusion.'],
            ['Quelles sont les trois couches du cyberespace ?', ['Matérielle, logicielle et sémantique', 'Publique, privée et militaire', 'Locale, nationale et mondiale', 'Fixe, mobile et satellitaire'], 0, 'La couche matérielle rappelle que le « virtuel » repose sur des câbles bien réels.'],
            ['Quel règlement européen de 2018 encadre la protection des données personnelles ?', ['Le RGPD', 'Le DSA', 'Le DMA', 'Le Cloud Act'], 0, 'L’Union européenne impose par la norme ce qu’elle ne domine pas par la technique.'],
            ['Qu’a révélé Edward Snowden en 2013 ?', ['Un système de surveillance de masse des communications', 'Une cyberattaque russe', 'Le code source de Windows', 'Un trafic de données médicales'], 0, 'Les révélations ont durablement pesé sur les relations entre alliés.'],
            ['Le cyberespace échappe totalement au contrôle des États.', ['Vrai', 'Faux'], 1, 'Chine, Russie et Union européenne y imposent chacune leurs règles : on parle de fragmentation.'],
            ['Quelle convention de 2001 organise la coopération contre la cybercriminalité ?', ['La convention de Budapest', 'La convention de La Haye', 'La convention de Vienne', 'La convention de Genève'], 0, 'L’un des rares cadres juridiques internationaux en la matière.'],
            ['En quelle année l’OTAN a-t-elle reconnu le cyber comme un domaine d’opérations militaires ?', ['2016', '2001', '2007', '2022'], 0, 'Au même titre que la terre, la mer, l’air et l’espace.'],
          ],
        },
      ],
    },
  ],
}
