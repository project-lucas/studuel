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
            cours: `Le système solaire s'est formé il y a environ 4,6 milliards d'années à partir d'un nuage de gaz et de poussières.

## Deux familles de planètes
| La famille | Ses membres | Ses caractères |
| **Telluriques** | Mercure, Vénus, **Terre**, Mars | Petites, rocheuses, denses, proches du Soleil |
| **Géantes gazeuses** | Jupiter, Saturne | Volumineuses, peu denses, anneaux et nombreux satellites |
| **Géantes glacées** | Uranus, Neptune | Idem, plus froides |

S'y ajoutent la ceinture d'astéroïdes, les comètes et les planètes naines comme Pluton.

## Les mouvements de la Terre
| Le mouvement | Sa durée | Ce qu'il produit |
| La **rotation** sur elle-même | **24 heures** | L'alternance jour-nuit |
| La **révolution** autour du Soleil | **365,25 jours** | L'année |
| L'**inclinaison** de l'axe | 23,5° | Les **saisons** |

> Ce sont les saisons de l'inclinaison, non de la distance au Soleil. En été, l'hémisphère concerné reçoit les rayons plus à la verticale et plus longtemps : il chauffe davantage.

## Pourquoi la Terre est habitable
| La condition | Ce qu'elle permet |
| Sa **distance au Soleil** | De l'eau **liquide** |
| Sa **masse** | Retenir une **atmosphère** |
| L'**effet de serre naturel** | +15 °C en moyenne, au lieu de −18 °C sans lui |
| La couche d'**ozone** | Elle filtre les ultraviolets |
| Le **champ magnétique** | Il dévie le vent solaire |

| La planète voisine | Son problème |
| **Vénus** | Un emballement de l'effet de serre : trop chaude |
| **Mars** | Elle a perdu son atmosphère |

> Cet équilibre est étroit.

## Le temps long
| Le repère | Sa valeur |
| L'âge de la Terre | **4,54 milliards d'années** |
| Les outils de datation | Roches, fossiles, **radioactivité** |

> Rapportée à une année, l'apparition d'*Homo sapiens* tiendrait dans les dernières minutes du 31 décembre.`,
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
            cours: `La lithosphère — croûte et partie supérieure du manteau, rigide — est découpée en une douzaine de plaques qui se déplacent de quelques centimètres par an sur l'asthénosphère, plus ductile.

## L'histoire d'une idée
| L'étape | Sa date | Son contenu |
| La **dérive des continents** de **Wegener** | 1912 | Forme des côtes, fossiles identiques, chaînes continues, traces glaciaires |
| Son rejet | — | Faute d'expliquer le **moteur** |
| La confirmation | Années **1960** | Cartographie des fonds, sismologie, **anomalies magnétiques** symétriques : l'**expansion océanique** |

## Trois types de frontières
| La frontière | Le mouvement | Ce qui s'y passe | Ses manifestations |
| **Divergente** | Les plaques s'**écartent** | Du magma remonte aux **dorsales** et crée de la lithosphère neuve | Volcanisme effusif, séismes superficiels |
| **Convergente**, en **subduction** | Une plaque océanique **plonge** | Fosse océanique | Séismes profonds, volcanisme explosif |
| **Convergente**, en **collision** | Deux plaques continentales se heurtent | Chaînes de montagnes | Himalaya, Alpes |
| **Coulissante** | Les plaques **glissent** l'une contre l'autre | Une **faille transformante** | Séismes ; pas de volcanisme |

> Ce qui naît aux dorsales disparaît en subduction : la surface de la Terre se **recycle**.

## Le moteur
| L'élément | Son rôle |
| La **chaleur interne** | Issue de la radioactivité et de la formation de la planète |
| La **convection** du manteau | Elle entraîne les plaques |
| La **traction** de la plaque plongeante | Elle y contribue fortement |

## Ce que cela explique
| Le fait | Son explication |
| Séismes et volcans **en ceintures** | La « ceinture de feu » du Pacifique suit les frontières |
| La formation des **montagnes** | La collision |
| L'ouverture et la fermeture des **océans** | Le cycle des plaques |
| La **Pangée**, il y a environ 250 millions d'années | Le déplacement passé des continents |`,
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
            cours: `Un séisme est une vibration du sol provoquée par une rupture brutale des roches en profondeur, le long d'une faille.

## Le mécanisme
| L'étape | Ce qui se passe |
| 1 | Les mouvements de plaques **déforment** les roches |
| 2 | Elles accumulent de l'**énergie élastique** |
| 3 | La contrainte dépasse leur résistance : elles **cassent** |
| 4 | L'énergie part d'un coup en **ondes sismiques** |
| 5 | Des **répliques** suivent souvent |

| Le point | Sa position |
| Le **foyer** (hypocentre) | Le point de rupture, en profondeur |
| L'**épicentre** | À sa verticale, en surface : les dégâts y sont en général maximaux |

## Mesurer un séisme
| La grandeur | Ce qu'elle mesure | Combien de valeurs par séisme |
| La **magnitude** | L'**énergie libérée** | **Une seule** |
| L'**intensité** | Les **effets** ressentis et observés | **Une par lieu** |

L'échelle de magnitude est **logarithmique** : +1 correspond à environ **30 fois** plus d'énergie.

> Un séisme de magnitude modérée peut faire plus de victimes qu'un séisme puissant, si les constructions sont fragiles et la population dense.

## Risque, aléa, vulnérabilité
| La notion | Sa définition | Peut-on agir dessus |
| L'**aléa** | La probabilité qu'un séisme se produise | **Non** |
| La **vulnérabilité** | Les personnes, bâtiments et activités exposés | **Oui** |
| Le **risque** | Le croisement des deux | Par la vulnérabilité |

## Prévoir et prévenir
> On ne sait pas **prédire** la date d'un séisme.

| Le moyen | Ce qu'il apporte |
| Cartographier les **zones sismiques** | Savoir où le risque est fort |
| Les **normes parasismiques** | Des bâtiments qui tiennent |
| Les réseaux de **sismographes** | Une surveillance continue |
| L'**éducation** et les secours | Les bons réflexes |
| L'alerte **tsunami** | Quand un séisme sous-marin déplace la colonne d'eau |

## En France
| La zone | Sa sismicité |
| Alpes, Pyrénées, Provence, Alsace | Modérée mais réelle |
| Les **Antilles** | Forte : normes parasismiques obligatoires |`,
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
            cours: `Le volcanisme est l'arrivée en surface de magma, une roche fondue formée en profondeur.

Il s'accumule dans un **réservoir**, remonte par une **cheminée**, sort par un **cratère**.

## Les deux types d'éruption
| Le critère | Éruption **effusive** | Éruption **explosive** |
| Le magma | **Fluide**, pauvre en silice | **Visqueux**, riche en silice |
| Les gaz | Ils s'échappent facilement | Ils sont **retenus** jusqu'à la rupture |
| Ce qui sort | **Coulées de lave**, fontaines | **Cendres**, blocs, **nuées ardentes** |
| Ses exemples | Piton de la Fournaise, Hawaï, Islande | Montagne Pelée, Vésuve, Merapi |

> Le magma fluide fait des coulées qu'on peut souvent fuir ; le magma visqueux fait des nuées ardentes qu'on ne peut pas fuir — plusieurs centaines de km/h.

## Où sont les volcans
| Le contexte | Le type de volcanisme |
| Les **dorsales** et les rifts | **Effusif** |
| Les zones de **subduction** | **Explosif** — la ceinture de feu du Pacifique |
| Les **points chauds**, loin de toute frontière | Hawaï, La Réunion |

## Les risques
| L'aléa | Son danger |
| Coulées de lave | Destruction, mais lente |
| **Nuées ardentes** | Mortelles, immédiates |
| Retombées de **cendres** | Toits effondrés, trafic aérien interrompu |
| **Lahars** | Coulées de boue |
| Gaz toxiques | Asphyxie |
| Effondrement d'édifice | Tsunami |

## Prévoir et se protéger
Contrairement aux séismes, une éruption est souvent **précédée de signes**.

| Le signe précurseur | Son instrument |
| Petits **séismes** | Sismographes |
| **Gonflement** de l'édifice | GPS, inclinomètres |
| Changement de composition des **gaz** | Analyseurs |
| Hausse de **température** | Capteurs, imagerie |

> Les **observatoires volcanologiques** surveillent en continu, définissent des niveaux d'alerte et préparent les évacuations — c'est ce qui a sauvé des dizaines de milliers de vies au **Pinatubo**, en 1991.`,
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
            cours: `L'atmosphère et les océans sont en mouvement permanent. Le moteur est toujours le même : le rayonnement solaire chauffe la Terre de façon inégale.

## Un chauffage inégal
| La latitude | L'angle des rayons | Le bilan d'énergie |
| L'**équateur** | Presque à la verticale : l'énergie se concentre | **Excédent** |
| Les **pôles** | Très inclinés, sur une grande surface, à travers plus d'atmosphère | **Déficit** |

> Les circulations d'air et d'eau **redistribuent** cette chaleur.

## La circulation atmosphérique
| L'air | Sa densité | Son mouvement | La pression créée |
| **Chaud** | Plus faible | Il **s'élève** | **Basse** : une dépression |
| **Froid** | Plus forte | Il **descend** | **Haute** : un anticyclone |

Le **vent** est de l'air qui va de la haute vers la basse pression. La rotation de la Terre le dévie : c'est la **force de Coriolis**, qui organise l'atmosphère en grandes cellules et en vents dominants — alizés, vents d'ouest.

> **Météo** et **climat** ne sont pas la même chose : la météo décrit le temps sur quelques jours, le climat les moyennes et la variabilité sur au moins **trente ans**.

## Les courants océaniques
| Le niveau | Son moteur | Son exemple |
| En **surface** | Les vents | Le **Gulf Stream**, qui adoucit le climat de l'Europe de l'Ouest |
| En **profondeur** | Les différences de **température** et de **salinité** | La **circulation thermohaline**, un tapis roulant de mille ans |

## Les phénomènes météorologiques
| Le phénomène | Son mécanisme |
| Les **fronts** | La rencontre de masses d'air différentes |
| Le **cycle de l'eau** | Évaporation, condensation en nuages, précipitations |
| Les **cyclones tropicaux** | Ils naissent sur des océans à plus de **26 °C** |

## Prévoir le temps
| L'outil | Ce qu'il apporte |
| Satellites, stations au sol, ballons-sondes, bouées | Les données |
| Les **modèles numériques** | La prévision |

> L'atmosphère est un système **chaotique** : au-delà d'environ **deux semaines**, la prévision détaillée devient impossible.`,
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
            cours: `Le climat a toujours varié. Ce qui change aujourd'hui, c'est la vitesse de la variation, et sa cause.

## Les variations naturelles
| La cause | Son échelle de temps |
| Les **paramètres de Milankovitch** — variations de l'orbite | Des dizaines de milliers d'années |
| L'activité **volcanique** | Des années à des siècles |
| La teneur de l'atmosphère en gaz à effet de serre | Longue |

Elles produisent l'alternance de périodes **glaciaires** et **interglaciaires**.

## Ce qui est différent aujourd'hui
| Le fait | Sa valeur |
| Le réchauffement depuis l'ère industrielle | Environ **1,1 à 1,2 °C** |
| Sa **vitesse** | Sans équivalent connu |
| Sa cause | Les **émissions de gaz à effet de serre** d'origine humaine |

| Le gaz | Ses sources principales |
| **CO₂** | Combustibles fossiles, déforestation, ciment |
| **Méthane** | Élevage, rizières, fuites de gaz |
| **Protoxyde d'azote** | Engrais |

## L'effet de serre, naturel puis renforcé
| L'état | Son effet |
| **Naturel** | Il rend la Terre habitable |
| **Renforcé** par les activités humaines | Il déséquilibre le bilan énergétique de la planète |

Les gaz laissent passer le rayonnement solaire et retiennent une partie de l'infrarouge renvoyé par le sol.

## Comment le sait-on
| L'archive | Ce qu'elle donne |
| Les **carottes de glace** du Groenland et de l'Antarctique | Des bulles d'air vieilles de **800 000 ans** : la teneur passée en CO₂ |
| Sédiments, pollens, cernes des arbres | Des températures reconstituées |
| Les mesures directes | Depuis 1850 |

## Les conséquences
| La conséquence | Son mécanisme |
| La hausse du **niveau des mers** | Dilatation de l'eau, fonte des glaciers et des calottes |
| La fonte de la **banquise** et du **permafrost** | Le réchauffement polaire, deux fois plus rapide |
| L'**acidification** des océans | La dissolution du CO₂ |
| Les **événements extrêmes** | Canicules, sécheresses, incendies, pluies diluviennes, cyclones plus intenses |
| Le déplacement des **espèces** | Perte de récoltes, migrations |

> Le climat ne réagit pas instantanément : une partie du réchauffement à venir est **déjà engagée** par les émissions passées.

## Agir
| L'action | Son objet | Ses moyens |
| L'**atténuation** | Réduire les émissions | Énergies décarbonées, sobriété, transports, isolation, alimentation, reforestation |
| L'**adaptation** | Réduire la vulnérabilité | Digues, urbanisme, alerte, cultures adaptées |

L'**accord de Paris** (2015) fixe l'objectif de contenir le réchauffement nettement en dessous de 2 °C.`,
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
            cours: `L'eau couvre 70 % de la surface du globe. Elle est pourtant rare — parce que presque tout est salé ou inaccessible.

## La répartition
| L'eau | Sa part |
| **Salée** | **97,5 %** |
| Douce | 2,5 % |
| Douce **accessible** | Moins de **1 %** du total |

L'essentiel de l'eau douce est immobilisé dans les glaces et les nappes profondes.

## Le cycle de l'eau
| L'étape | Ce qui se passe |
| L'**évaporation** | Le Soleil vaporise l'eau des océans et des sols |
| La **condensation** | La vapeur forme des nuages |
| Les **précipitations** | L'eau retombe |
| Le **ruissellement** | Elle rejoint les rivières |
| L'**infiltration** | Elle alimente les **nappes phréatiques** |

> La ressource est **renouvelable**, mais à un rythme qui ne dépend pas de nous.

## Comment on la prélève
Captage de sources, pompage en rivière, **forages** dans les nappes, retenues de **barrages** — et, là où il n'y a rien d'autre, **dessalement** de l'eau de mer, très coûteux en énergie.

## Qui la consomme
| L'usage | Sa part mondiale |
| L'**agriculture**, par l'irrigation | Environ **70 %** |
| L'**industrie** | 20 % |
| Le **domestique** | 10 % |

Un Français utilise environ **150 litres par jour** à la maison, dont une part infime pour boire.

> L'**eau virtuelle** est celle qu'il a fallu pour produire un bien : environ 15 000 litres pour un kilo de bœuf, 2 700 litres pour un tee-shirt en coton.

## Rendre l'eau potable, puis la rendre au milieu
| L'étape de potabilisation | Son rôle |
| Dégrillage | Retirer les gros débris |
| Floculation-décantation | Agglomérer et faire tomber les particules |
| Filtration sur **sable** | Retenir les fines |
| Filtration sur **charbon actif** | Retenir les molécules dissoutes |
| **Désinfection** | Chlore ou ozone |

Après usage, une **station d'épuration** traite les eaux usées par voie mécanique puis biologique.

## Les pressions et les remèdes
| La pression | Le remède |
| **Surexploitation** des nappes | Réduire les prélèvements |
| **Pollutions** agricoles, industrielles, domestiques | Protéger les zones de captage |
| **Salinisation** des nappes côtières | Limiter le pompage littoral |
| **Conflits d'usage** | Arbitrer entre agriculture, industrie, tourisme, particuliers |
| Les **fuites** des réseaux, parfois plus de 20 % | Les réparer |
| L'irrigation gourmande | Le **goutte-à-goutte** |`,
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
            cours: `Le pétrole est une énergie fossile : il provient de la transformation, sur des millions d'années, de matière organique accumulée au fond des mers.

## Les quatre conditions de formation
| La condition | Son contenu |
| Une **roche mère** | Riche en matière organique, déposée en milieu pauvre en oxygène |
| L'**enfouissement** | Sous des sédiments : température et pression s'élèvent |
| La **migration** | Les hydrocarbures montent à travers une **roche réservoir** poreuse |
| La **roche couverture** | Imperméable, elle les **piège** |

> Sans le piège, pas de gisement exploitable.

> Le pétrole met des millions d'années à se former et quelques décennies à se consommer : c'est ce qui le rend **non renouvelable** à l'échelle humaine.

## De la prospection au produit
| L'étape | Sa technique |
| La **prospection** | La géologie, et surtout la **sismique réflexion** : des ondes envoyées dans le sous-sol, et leurs échos |
| Le **forage** | À terre ou en mer |
| L'**extraction** | Puis le transport par oléoducs et pétroliers |
| Le **raffinage** | La **distillation fractionnée**, qui sépare selon les températures d'ébullition |

| Le produit issu du raffinage | Son usage |
| Gaz, essences | Carburants légers |
| Kérosène | L'aviation |
| Gazole, fiouls | Transport lourd, chauffage |
| Bitumes | Les routes |

## À quoi il sert
| Le débouché | Ses produits |
| Les **carburants** | Routier, aérien, maritime |
| Le **chauffage** | Fioul domestique |
| La **pétrochimie** | Plastiques, textiles synthétiques, engrais, médicaments, cosmétiques, peintures |

> Sortir du pétrole ne concerne donc pas que les voitures.

## Les problèmes
| Le problème | Son contenu |
| L'**épuisement** | Des réserves finies et inégalement réparties |
| Le **climat** | La combustion libère du **CO₂** |
| Les **pollutions** | Marées noires, dégazages, fuites, torchage, particules, oxydes d'azote |
| La **géopolitique** | Dépendance des importateurs, volatilité des prix, conflits |

## Les alternatives
Énergies **renouvelables** — solaire, éolien, hydraulique, biomasse, géothermie —, nucléaire, **sobriété** et efficacité énergétiques, recyclage des plastiques, transports collectifs.

> Aucune ne remplace le pétrole à elle seule : c'est la **combinaison** qui compte.`,
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
            cours: `Un écosystème est l'ensemble formé par un milieu et par les êtres vivants qui l'occupent, avec toutes leurs relations.

## Ce que le réchauffement modifie
| Le changement | Sa manifestation |
| Les **aires de répartition** | Elles se déplacent vers le nord, et vers l'altitude en montagne |
| La **phénologie** | Floraisons précoces, migrateurs décalés, insectes en avance |
| Les **désynchronisations** | Si les chenilles éclosent avant l'arrivée des oiseaux, les nichées manquent de nourriture |
| Le **blanchissement des coraux** | Au-delà d'un seuil, ils expulsent leurs algues symbiotiques |
| L'**acidification** des océans | Elle fragilise coquilles et squelettes calcaires |

> Les espèces de haute montagne, qui n'ont plus où monter, sont particulièrement menacées.

> Le problème n'est pas seulement l'ampleur du changement, c'est sa **vitesse** : beaucoup d'espèces ne peuvent ni se déplacer ni s'adapter aussi vite.

## Les trois réponses possibles du vivant
| La réponse | Sa condition |
| Se **déplacer** | Un milieu accessible, sans obstacle |
| S'**adapter** | Par sélection naturelle, sur plusieurs générations |
| **Disparaître** localement | Quand aucune des deux n'est possible |

> Les espèces à génération courte et à forte descendance s'en tirent mieux.

## Les effets en chaîne
| Le mécanisme | Son effet |
| La disparition d'une espèce **clé de voûte** | Elle en entraîne d'autres |
| La fonte du **permafrost** | Elle libère du méthane, qui renforce le réchauffement |

> C'est une **rétroaction positive** : un effet qui amplifie sa propre cause.

## Les services écosystémiques
| Le service | Ce qu'il apporte |
| La **pollinisation** | Une large part des cultures |
| L'**épuration** de l'eau | Zones humides et sols |
| Le **stockage de carbone** | Forêts et océans |
| La protection des côtes | Mangroves et récifs |
| La **fertilité des sols** | La production agricole |
| Les ressources alimentaires et médicinales | Des molécules issues du vivant |

## Protéger
Aires protégées, **corridors écologiques** pour permettre les déplacements, restauration des zones humides et des forêts, réduction des autres pressions.

> Réduire pollution et surexploitation laisse aux écosystèmes une chance de s'adapter au climat.`,
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
            cours: `Depuis deux siècles, l'humanité modifie la planète à une échelle telle que certains scientifiques parlent d'Anthropocène.

## Les cinq grandes pressions
| La pression | Sa forme |
| Le **changement climatique** | Les émissions de gaz à effet de serre |
| La **destruction des habitats** | Déforestation, urbanisation, artificialisation, drainage |
| La **surexploitation** | Surpêche, coupes forestières, prélèvement dans les nappes |
| Les **pollutions** | Plastiques, pesticides, nitrates, métaux lourds, air, bruit, lumière |
| Les **espèces invasives** | Transportées par le commerce mondial |

> Elles agissent **ensemble**, et leurs effets se cumulent.

## L'érosion de la biodiversité
| Le repère | Sa valeur |
| Le taux d'extinction actuel | **100 à 1 000 fois** le taux naturel |
| Son nom | La **sixième extinction de masse** |

| Le niveau de perte | Ce qu'il recouvre |
| Les **écosystèmes** | Des milieux entiers disparaissent |
| Les **espèces** | Le niveau visible |
| Les **gènes** | Invisible, il conditionne la capacité future à s'adapter |

> Une espèce disparue ne revient pas : la perte est **irréversible**, à la différence d'une pollution qui peut être traitée.

## Mesurer l'impact
| L'indicateur | Ce qu'il mesure |
| L'**empreinte écologique** | La surface nécessaire pour produire ce qu'on consomme et absorber ses déchets |
| Le **jour du dépassement** | La date à laquelle l'humanité a consommé le renouvelable annuel — il tombe chaque année plus tôt |
| L'**empreinte carbone** | Les émissions liées à un mode de vie |

## Développement durable
| Son pilier | Son exigence |
| **Économique** | Une activité viable |
| **Social** | Des conditions de vie décentes |
| **Environnemental** | Des milieux préservés |

Sur le terrain : économie **circulaire** — réduire, réutiliser, réparer, recycler —, agroécologie, énergies renouvelables, transports collectifs, aires protégées, restauration des milieux.

## Ce qui marche déjà
| Le succès | Son résultat |
| Le protocole de **Montréal**, 1987 | La couche d'**ozone** se reconstitue |
| Les plans de protection d'espèces | Certaines ont été sauvées |
| La dépollution de rivières | Les poissons sont revenus |

> Les décisions collectives produisent des effets mesurables.`,
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
            cours: `Toutes les cellules, quelle que soit leur spécialité, ont les mêmes besoins fondamentaux.

## Les besoins
| Le besoin | Son rôle |
| Le **dioxygène** | La respiration cellulaire |
| Le **glucose** | La source d'énergie |
| Les **acides aminés** | Fabriquer les protéines |
| Les **acides gras** | Les membranes, et une réserve d'énergie |
| L'**eau**, les **sels minéraux**, les **vitamines** | Le fonctionnement général |

La respiration cellulaire :

glucose + dioxygène donne dioxyde de carbone + eau + énergie

## Une organisation en niveaux
| Le niveau | Ce qu'il est |
| La **cellule** | L'unité |
| Le **tissu** | Des cellules de même type |
| L'**organe** | Plusieurs tissus, pour une fonction |
| L'**appareil** | Des organes qui concourent au même but |
| L'**organisme** | L'ensemble |

## Trois appareils, un même service
| L'appareil | Ce qu'il fournit ou évacue |
| **Digestif** | Les **nutriments**, en simplifiant les aliments |
| **Respiratoire** | Le **dioxygène** ; il évacue le CO₂ |
| **Circulatoire** | Il **transporte** les uns et les autres jusqu'à chaque cellule |
| **Excréteur** | Il élimine les déchets |

> Aucun ne se suffit à lui-même : c'est leur **coordination** qui maintient l'organisme en vie.

## Des besoins variables
| L'organe | Sa consommation |
| Un **muscle** au repos | Faible |
| Le même en **effort** | Multipliée |
| Le **cerveau** | Environ **20 %** du glucose, pour **2 %** de la masse — et sans interruption possible |

## L'échelle des échanges
| La surface d'échange | Son étendue |
| Les **alvéoles pulmonaires** | Environ **100 m²** |
| Les **villosités intestinales** | Environ **200 m²** |
| Les **capillaires** | Une paroi d'une seule cellule |

> La nature répète partout la même solution : **maximiser la surface** dans un volume réduit.`,
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
            cours: `Le corps ne fabrique ni son dioxygène ni ses nutriments : il les prélève dans le milieu, par deux appareils spécialisés.

## L'appareil respiratoire
| L'étape du trajet de l'air | L'organe |
| L'entrée | Les **fosses nasales**, le pharynx |
| La conduction | Le **larynx**, la **trachée**, les deux **bronches**, les bronchioles |
| L'échange | Les **alvéoles pulmonaires** : environ 300 millions, pour **100 m²** |

| Le mouvement | Ce qui se passe |
| L'**inspiration** | Le **diaphragme** s'abaisse, les côtes se soulèvent : le volume augmente, l'air entre |
| L'**expiration** | Le mouvement s'inverse |

Dans l'alvéole, les gaz traversent une paroi très fine par **diffusion**, du plus concentré vers le moins concentré.

| Le gaz | Son sens de passage |
| Le **dioxygène** | De l'air vers le sang |
| Le **dioxyde de carbone** | Du sang vers l'air |

## L'appareil digestif
| L'action | Ses moyens |
| **Mécanique** | Mastication, brassage de l'estomac, péristaltisme |
| **Chimique** | Les **enzymes** de la salive, de l'estomac, du pancréas et de l'intestin |

L'**absorption** se fait dans l'**intestin grêle** : replis, **villosités** et microvillosités portent la surface à environ **200 m²**, richement irriguée.

> Deux appareils, deux milieux, une même stratégie : une **paroi fine**, une **très grande surface**, une **circulation abondante** de l'autre côté.

## Le transport
| Ce qui est transporté | Comment |
| Le **dioxygène** | Fixé par l'**hémoglobine** des globules rouges |
| Les **nutriments** | Dissous dans le **plasma** |

Le sang venu de l'intestin passe d'abord par le **foie**, qui trie, stocke le glucose en **glycogène** et neutralise certaines substances.

## Quand cela ne fonctionne plus
| Le trouble | Son effet |
| Asthme, bronchite | Les voies respiratoires s'obstruent |
| Le **tabac** | Il détruit les cils et les alvéoles |
| Le **monoxyde de carbone** | Il prend la place du dioxygène sur l'hémoglobine |
| Une maladie de l'intestin, une résection | La surface d'absorption diminue : **carences** |`,
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
            cours: `Le cœur est une double pompe : quatre cavités séparées par une cloison étanche, et des valves qui imposent un sens unique au sang.

## Deux circulations
| La circulation | Son départ | Son trajet | Son retour |
| **Pulmonaire** (petite) | Ventricule **droit** | Vers les **poumons** | Oreillette gauche, sang enrichi |
| **Générale** (grande) | Ventricule **gauche**, le plus musclé | Vers tous les organes | Oreillette droite, sang chargé de CO₂ |

## Trois types de vaisseaux
| Le vaisseau | Son sens | Sa paroi | Son rôle |
| **Artère** | Elle **part** du cœur | Épaisse, élastique | Résister à la pression |
| **Veine** | Elle y **revient** | Fine, souvent à valvules | Le retour |
| **Capillaire** | Entre les deux | **Une seule cellule** | Le lieu **exclusif** des échanges |

## Le sang
| Le constituant | Sa part ou son rôle |
| Le **plasma** | 55 %, essentiellement de l'eau : nutriments, hormones, déchets |
| Les **globules rouges** | Le dioxygène, par l'hémoglobine |
| Les **globules blancs** | La défense |
| Les **plaquettes** | La coagulation |

## L'élimination des déchets
| L'organe | Ce qu'il élimine |
| Les **reins** | L'**urée**, l'excès d'eau et de sels, dans l'**urine** |
| Les **poumons** | Le **dioxyde de carbone** |
| Le **foie** | Il transforme les déchets azotés et neutralise certains toxiques |
| La **peau** | Un peu d'eau et de sels, par la sueur |

> Toute substance absorbée finit par passer par le sang : c'est pourquoi une drogue, un médicament ou un polluant atteignent l'organisme **entier**.

## Les micro-organismes
| Le groupe | Son statut |
| Bactéries, virus, champignons, protozoaires | La plupart sont **inoffensifs** |
| Le **microbiote** intestinal, cutané, respiratoire | **Utile** : digestion, vitamines, éducation immunitaire |
| Les **pathogènes** | Une **minorité** |

## Les barrières naturelles
| La barrière | Son action |
| La **peau** intacte | Une frontière physique |
| Les **muqueuses** et le mucus | Ils piègent |
| Les **cils** des voies respiratoires | Ils évacuent |
| L'**acidité** de l'estomac | Elle détruit |
| Le **microbiote** | Il occupe la place |

| Le terme | Sa définition |
| La **contamination** | L'entrée du micro-organisme |
| L'**infection** | Sa multiplication dans l'organisme |`,
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
            cours: `Les plantes chlorophylliennes sont autotrophes : elles fabriquent leur propre matière organique à partir de matière minérale et de lumière.

## La photosynthèse
Dans les **chloroplastes** des feuilles, la **chlorophylle** capte l'énergie lumineuse :

dioxyde de carbone + eau + énergie lumineuse donne glucose + dioxygène

| Le produit | Son devenir |
| Le **glucose** | Il construit toute la plante : amidon, cellulose, protéines après incorporation d'azote |
| Le **dioxygène** | Il est rejeté |

> Attention : la plante **respire aussi**, jour et nuit. Le jour, la photosynthèse l'emporte largement.

## Deux prélèvements, deux organes
| L'organe | Ce qu'il prélève | Son dispositif |
| Les **racines** | L'eau et les **sels minéraux** | Les **poils absorbants**, qui multiplient la surface |
| Les **feuilles** | Le **dioxyde de carbone** | Les **stomates**, qui règlent aussi les pertes d'eau |

## Deux circulations
| Le vaisseau | Sa sève | Son sens | Son moteur |
| Le **xylème** | **Brute** : eau et sels minéraux | Racines vers feuilles | La **transpiration** des stomates |
| Le **phloème** | **Élaborée** : riche en sucres | Feuilles vers tous les organes | La pression osmotique |

## Un organisme fixé
Une plante ne peut pas fuir. Elle a donc d'autres réponses.

| La contrainte | Sa réponse |
| Chercher la lumière | Une **croissance orientée** |
| Les herbivores | Épines et substances toxiques |
| L'hiver | Les feuilles **caduques** |
| Les mauvaises saisons | Graines et spores résistantes |
| L'immobilité | Des **relations** : mycorhizes, nodosités à bactéries fixatrices d'azote, pollinisation par les insectes |

## De la plante à l'écosystème
| Son rôle | Son effet |
| **Producteur primaire** | Le premier maillon des réseaux trophiques |
| Le **stockage de carbone** | Il freine le réchauffement |
| La **rétention des sols** | Elle limite l'érosion |
| La filtration de l'eau | Elle alimente la nappe |
| L'abri | Une part majeure de la biodiversité terrestre |`,
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
            cours: `La reproduction sexuée met en jeu deux cellules reproductrices — les gamètes — produites par deux individus.

## La fécondation
| L'étape | Ce qui se passe |
| La rencontre | Un gamète **mâle** et un gamète **femelle** fusionnent |
| Le résultat | Une **cellule œuf**, avec **la moitié de l'information génétique de chaque parent** |
| La suite | Elle se divise et se différencie : le **développement** |

| Le type de fécondation | Où | Son rendement | Ses exemples |
| **Externe** | Dans l'eau | Faible : d'où **énormément** de gamètes | Poissons, amphibiens, oursins |
| **Interne** | Dans les voies femelles | Bien meilleur : descendance moins nombreuse, mieux protégée | Mammifères, oiseaux, reptiles, insectes |

> Un individu issu de reproduction sexuée n'est identique à aucun de ses deux parents : le brassage crée à chaque fois une **combinaison nouvelle**.

## Ce que le milieu décide
| Le facteur | Son effet |
| La **température** | Elle détermine même le sexe des petits chez certaines tortues et crocodiles |
| La **photopériode** | Elle déclenche la reproduction saisonnière |
| Les **ressources alimentaires** | Elles conditionnent la survie de la descendance |
| La présence de **partenaires** | Et la densité de population |
| Les **abris** et sites de ponte | Ils permettent la nidification |
| Les **polluants** | Certains, perturbateurs endocriniens, dérèglent la fertilité |

## La dynamique d'une population
| Le terme | Son effet sur l'effectif |
| La **natalité** | Il augmente |
| La **mortalité** | Il diminue |
| L'**immigration** | Il augmente |
| L'**émigration** | Il diminue |

| La stratégie | Son principe | Ses exemples |
| Beaucoup de descendants **peu protégés** | Miser sur le nombre | Poissons, insectes |
| Peu de descendants **longuement pris en charge** | Miser sur la survie | Grands mammifères, oiseaux |

## L'action humaine
| Ce qui fait chuter le succès reproducteur | Ce qui le fait remonter |
| Destruction des sites de reproduction | Restauration de zones humides |
| **Fragmentation** des milieux | Passes à poissons, corridors |
| Surpêche des adultes reproducteurs | Mise en réserve |
| Pollutions lumineuse et sonore | Calendriers de protection |
| Introduction d'espèces concurrentes | Lutte contre les invasives |`,
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
            cours: `La reproduction asexuée produit de nouveaux individus à partir d'un seul parent, sans gamète ni fécondation. Les descendants sont des clones.

## Les formes chez les animaux
| La forme | Son principe | Ses exemples |
| **Bourgeonnement** | Un bourgeon se forme puis se détache | Hydre, corail, éponge, levure |
| **Scissiparité** | L'individu se divise en deux | Bactéries, paramécies, certaines anémones |
| **Fragmentation** et régénération | Un fragment reconstitue un individu entier | Étoile de mer, planaire |
| **Parthénogenèse** | Un ovule se développe **sans** être fécondé | Pucerons en été, certains lézards, abeilles pour les mâles |

## Les formes chez les végétaux
| L'organe ou la technique | Son exemple |
| **Stolons** | Le fraisier |
| **Rhizomes** | Le bambou, l'iris |
| **Tubercules** | La pomme de terre |
| **Bulbes** | La tulipe |
| **Marcottage**, **bouturage** | Pratiques horticoles |
| **Drageons** | Le peuplier |

> Un cépage de vigne ou une variété de pomme de terre est un **clone** entretenu depuis des décennies.

## Avantages et inconvénients
| L'avantage | L'inconvénient |
| **Rapidité** : aucune recherche de partenaire | **Aucune diversité génétique** |
| **Sécurité** : un individu isolé peut coloniser seul | Tous réagissent de la même façon à une maladie |
| **Fidélité** : les caractères avantageux sont conservés | **Compétition** entre individus identiques |
| — | **Accumulation** des mutations défavorables, sans brassage pour les éliminer |

> La grande famine irlandaise de la pomme de terre, au XIXe siècle, est la démonstration du premier inconvénient.

## L'arbitrage
| La reproduction | Ce qu'elle coûte | Ce qu'elle fabrique |
| **Sexuée** | Cher : partenaire, temps, énergie | De la **diversité** |
| **Asexuée** | Peu | De l'**uniformité** |

> C'est un arbitrage entre la **vitesse** et l'**avenir**.

## Les deux à la fois
| L'espèce | Son alternance |
| Le **puceron** | Parthénogenèse tant que les conditions sont bonnes, puis reproduction sexuée à l'automne : des œufs résistants |
| Le **fraisier** | Des stolons **et** des fleurs |

> L'un sert à occuper le terrain, l'autre à préparer l'imprévu.`,
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
            cours: `Chaque cellule du corps humain contient 46 chromosomes, soit 23 paires. Dans chaque paire, un chromosome vient du père, l'autre de la mère.

| La 23e paire | Le sexe |
| **XX** | Femme |
| **XY** | Homme |

## Deux divisions, deux rôles
| La division | Ce qu'elle produit | Le nombre de chromosomes | Son rôle |
| La **mitose** | **Deux cellules identiques** | 46 → 46 | Croissance, renouvellement, réparation |
| La **méiose** | Les **gamètes** | **46 → 23** | Un chromosome de chaque paire |

## Pourquoi la réduction est indispensable
| Sans méiose | Avec méiose |
| Les gamètes auraient 46 chromosomes | Ils en ont **23** |
| La cellule œuf en aurait **92**, puis 184 | Elle en a **46** |

> La méiose divise, la fécondation rétablit : le nombre reste **constant** d'une génération à l'autre.

## Le brassage
| Le mécanisme | Ce qu'il apporte |
| La répartition **au hasard** des chromosomes lors de la méiose | Plus de **8 millions** de combinaisons par individu |
| La rencontre **aléatoire** d'un spermatozoïde et d'un ovule | Un tirage parmi des millions |

> C'est pourquoi deux enfants des mêmes parents se ressemblent sans être identiques — sauf les **vrais jumeaux**, issus d'une même cellule œuf.

## Les anomalies
| L'erreur | Sa conséquence | Sa mise en évidence |
| Une mauvaise répartition lors de la méiose | Un gamète avec un chromosome en trop ou en moins | Le **caryotype**, photographie ordonnée des chromosomes |
| La **trisomie 21** | Trois exemplaires du chromosome 21 | — |

## Ce qui se transmet, ce qui ne se transmet pas
| Le caractère | Est-il transmis |
| Une modification des **cellules reproductrices** | **Oui** |
| Un caractère **acquis** : musculature, bronzage, cicatrice, langue apprise | **Non** |

> Un caractère acquis ne modifie pas l'information génétique des gamètes.`,
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
            cours: `Tous les êtres vivants actuels descendent d'ancêtres communs. Les classer, c'est reconstituer leurs liens de parenté.

## Les indices de la parenté
| L'indice | Ce qu'il montre |
| Les **caractères partagés** | Plus deux espèces partagent de caractères **dérivés**, plus leur ancêtre commun est récent |
| Les **homologies** | Le membre antérieur du chat, de la baleine, de la chauve-souris et de l'humain suit le **même plan** : un os, puis deux, puis les doigts |
| Les **similitudes moléculaires** | Tous utilisent l'**ADN** et le même code génétique |
| Le développement **embryonnaire** | Des ressemblances effacées chez l'adulte |
| Les **fossiles** | Les formes intermédiaires |

| À ne pas confondre | Sa définition | Son exemple |
| L'**homologie** | Une ressemblance **héritée** d'un ancêtre commun | Bras humain et aile de chauve-souris |
| La **convergence** | Une ressemblance due à un **mode de vie** commun | Aile d'oiseau et aile d'insecte |

## L'arbre du vivant
| L'élément de l'arbre | Ce qu'il représente |
| Un **nœud** | Un ancêtre commun hypothétique |
| Une **branche** | Une lignée |

Les groupes sont **emboîtés** : les humains sont des primates, qui sont des mammifères, qui sont des vertébrés, qui sont des eucaryotes.

## Les grandes étapes
| L'événement | Sa date |
| L'apparition de la vie, unicellulaire | Environ **3,8 milliards d'années** |
| Les cellules à noyau, puis la pluricellularité | Ensuite |
| L'explosion du **Cambrien** | −540 millions d'années |
| La sortie des eaux | −400 millions d'années |
| La fin des dinosaures non aviens | **−66 millions d'années** |
| L'apparition d'*Homo sapiens* | Environ **300 000 ans** |

## Les crises, moteurs de renouvellement
> Cinq grandes extinctions de masse ont éliminé une part majeure des espèces. Chaque fois, les survivants se sont diversifiés dans les milieux libérés : les **mammifères** doivent leur essor à la disparition des dinosaures.`,
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
            cours: `L'évolution est la transformation des espèces au cours du temps. Son mécanisme principal, décrit par Darwin en 1859, est la sélection naturelle.

## Le raisonnement en quatre temps
| L'étape | Son contenu |
| 1 | Les individus présentent des **variations héréditaires** |
| 2 | Ils produisent **plus de descendants** que le milieu ne peut en nourrir : il y a **compétition** |
| 3 | Les mieux **adaptés** survivent et se reproduisent davantage |
| 4 | Leurs caractères deviennent plus **fréquents**, génération après génération |

> La sélection ne crée rien : elle **trie** ce que le hasard des mutations a produit. Le hasard fournit, le milieu choisit.

## L'origine des variations
| La source | Son caractère |
| Les **mutations** de l'ADN | **Aléatoires**, spontanées ou provoquées |
| Le **brassage** de la reproduction sexuée | Il redistribue à chaque génération |

> Une mutation n'est ni bonne ni mauvaise en soi : c'est le **milieu** qui décide de sa valeur.

## Des exemples observés
| L'exemple | Ce qui se passe |
| La **phalène du bouleau** | Les troncs noircis favorisent la forme sombre ; l'air redevenu propre, la forme claire revient |
| La **résistance aux antibiotiques** | Les bactéries mutées survivent au traitement et se multiplient — en quelques jours |
| Les insectes et les insecticides | Même mécanisme |
| Les **pinsons des Galápagos** | La taille des becs varie selon les sécheresses |

## Deux autres mécanismes
| Le mécanisme | Son principe |
| La **dérive génétique** | Le pur hasard, surtout dans les petites populations |
| La **sélection sexuelle** | Elle favorise les caractères qui améliorent l'accès aux partenaires, même coûteux — la queue du paon |

## De la population à l'espèce nouvelle
| L'étape | Ce qui se passe |
| L'**isolement** durable | Montagne, mer, comportement |
| L'accumulation de différences | Génération après génération |
| La **spéciation** | Les deux populations ne peuvent plus se reproduire entre elles |

## Ce qu'il ne faut pas dire
| L'erreur | La correction |
| L'évolution va « vers le mieux » | Elle n'a **aucun but** |
| Un organisme se transforme pour s'adapter | Il ne le décide pas |
| Les girafes ont allongé leur cou en tendant vers les branches | Celles dont le cou était **déjà** plus long se sont mieux reproduites |`,
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
            cours: `Au sein d'une même espèce, tous partagent les mêmes caractères d'espèce, mais diffèrent par leurs caractères individuels.

| Le caractère | Ses exemples |
| D'**espèce** | Deux yeux, une colonne vertébrale, cinq doigts |
| **Individuel** | Couleur des yeux, groupe sanguin, taille, forme du visage |

## Où est l'information
Elle est dans le **noyau** de chaque cellule.

| L'expérience | Ce qu'elle démontre |
| Le **transfert de noyau** chez l'acétabulaire ou l'ovule de grenouille | C'est le **noyau** qui impose les caractères |
| Le clonage de la brebis **Dolly**, 1996 | Le même principe, appliqué à un mammifère |

## Chromosomes, ADN, gènes
| Le niveau | Ce qu'il est |
| Le **chromosome** | Visible au microscope au moment de la division |
| L'**ADN** | Une longue molécule associée à des protéines |
| Le **gène** | Un segment d'ADN portant l'information d'un caractère — plus exactement, de fabrication d'une **protéine** |

> Le même ADN est présent dans **toutes** les cellules d'un individu ; ce qui change d'un tissu à l'autre, ce sont les gènes qui s'y **expriment**.

## La structure de l'ADN
| Le point | Son contenu |
| Sa forme | Une **double hélice** de deux brins complémentaires |
| Sa description | Watson, Crick, Franklin et Wilkins, **1953** |
| Ses bases | **A**, **T**, **G**, **C** |
| Leur appariement | **A avec T**, **G avec C** |

> L'ordre de ces bases constitue le message génétique : un alphabet de quatre lettres, universel dans tout le vivant.

## Deux origines à la diversité
| L'origine | Son action |
| **Génétique** | Chaque individu reçoit une combinaison unique de versions de gènes |
| **Environnementale** | Alimentation, activité physique, soleil, apprentissage modulent l'expression |

> La taille adulte dépend des gènes **et** de la nutrition pendant la croissance.

## Deux individus identiques
Seuls les **vrais jumeaux** et les individus issus de reproduction asexuée partagent le même ADN.

> Et même eux ne sont pas exactement semblables : l'environnement et le hasard du développement finissent toujours par les distinguer.`,
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
            cours: `Un gène occupe toujours la même place — le même locus — sur le même chromosome. Mais il peut en exister plusieurs versions : les allèles.

## Le vocabulaire
Chaque individu porte **deux allèles** de chaque gène : un du père, un de la mère.

| Le terme | Sa définition |
| **Homozygote** | Les deux allèles sont **identiques** |
| **Hétérozygote** | Ils sont **différents** |
| Allèle **dominant** | Il s'exprime dès qu'il est présent |
| Allèle **récessif** | Il ne s'exprime qu'en **double** |
| Allèles **codominants** | Tous deux s'expriment — le groupe AB |

## Génotype et phénotype
| Le terme | Ce qu'il désigne |
| Le **génotype** | L'ensemble des allèles portés |
| Le **phénotype** | L'ensemble des caractères **observables** |

> Deux génotypes différents peuvent donner le même phénotype : un homozygote dominant et un hétérozygote se ressemblent, mais ne transmettront pas la même chose.

> C'est pourquoi une maladie récessive peut apparaître chez un enfant dont **aucun** des parents n'est malade : chacun était **porteur sain**.

## Un exemple : les groupes sanguins
| L'allèle | Sa relation aux autres |
| **A** | Dominant sur O, codominant avec B |
| **B** | Dominant sur O, codominant avec A |
| **O** | **Récessif** |

| Le groupe | Les génotypes possibles |
| A | A//A ou A//O |
| B | B//B ou B//O |
| AB | A//B |
| O | **O//O** seulement |

## D'où viennent les allèles
Des **mutations** : une modification de la séquence d'ADN crée une nouvelle version du gène.

| L'origine de la mutation | Ses agents |
| **Spontanée** | Erreurs de copie |
| **Provoquée** | Ultraviolets, tabac, produits chimiques, rayonnements ionisants |

La plupart sont neutres, certaines défavorables, quelques-unes avantageuses.

## Pourquoi la diversité compte
| La population | Sa résistance |
| Génétiquement **diverse** | Certains individus résistent à une maladie ou à un changement |
| **Uniforme** — un champ d'une seule variété clonée | Elle peut être détruite d'un seul coup |

> La diversité génétique est une **assurance sur l'avenir**.`,
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
            cours: `Pour que chaque cellule possède la même information, l'ADN doit être copié avant chaque division. Pour que l'espèce se perpétue, il doit ensuite être transmis.

## La réplication de l'ADN
| L'étape | Ce qui se passe |
| 1 | La double hélice s'**ouvre** |
| 2 | Chaque brin sert de **modèle** |
| 3 | La complémentarité (A-T, G-C) impose la séquence du brin neuf |
| 4 | On obtient **deux molécules identiques** |

## Les deux divisions
| La division | Son résultat | Ce qu'elle assure |
| La **mitose** | Deux cellules **identiques**, à 46 chromosomes | Croissance, cicatrisation, renouvellement de la peau et du sang |
| La **méiose** | Des gamètes à **23** chromosomes, tirés au hasard | La variabilité |
| La **fécondation** | Deux gamètes tirés au hasard parmi des millions | Chaque individu est **génétiquement unique** |

> La mitose **conserve**, la méiose et la fécondation **brassent**. Un organisme a besoin des deux : de stabilité pour fonctionner, de variabilité pour durer en tant qu'espèce.

## Comment on suit un caractère
| L'observation sur l'arbre généalogique | La conclusion probable |
| Le caractère **saute une génération** | Il est **récessif** |
| Il touche presque uniquement les **garçons** | Il est porté par le chromosome **X** — daltonisme, hémophilie |

## Quand la copie se trompe
| Où survient la mutation | Sa portée |
| Dans une cellule **du corps** | Elle ne touche que la descendance de cette cellule — c'est ainsi que naissent certains cancers |
| Dans une cellule **reproductrice** | Elle est **transmissible** à la descendance |

## Ce que cela permet aujourd'hui
| L'application | Son usage |
| Les **tests génétiques** | Dépistage, diagnostic |
| Le **diagnostic prénatal** | Détecter une anomalie |
| Les **empreintes génétiques** | Identification |
| La **thérapie génique** | Corriger un gène |
| La **sélection variétale** | Agriculture |

> Toutes reposent sur la connaissance de l'ADN — et posent des questions **éthiques** que la science seule ne tranche pas.`,
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
            cours: `Pendant un effort, les muscles consomment beaucoup plus de glucose et de dioxygène qu'au repos. L'organisme s'adapte immédiatement.

## Les modifications immédiates
| La modification | Sa valeur |
| La **fréquence cardiaque** | De 70 à **150-190** battements par minute |
| Le **débit cardiaque** | Multiplié par 5 |
| La **ventilation** | Fréquence et amplitude augmentent ; la consommation de dioxygène est multipliée par 10 ou plus |
| La **redistribution du sang** | Les muscles passent d'environ 20 % à plus de **80 %** du débit |
| La **sudation** | Elle évacue la chaleur, au prix d'eau et de sels |

> Toutes ces adaptations poursuivent un seul but : amener **plus de dioxygène et de glucose aux muscles**, et évacuer plus vite CO₂ et chaleur.

## D'où vient l'énergie
| L'ordre de puisement | La réserve |
| 1 | Le **glycogène** du muscle |
| 2 | Le **glucose sanguin**, réapprovisionné par le foie |
| 3 | Les **lipides**, pour les efforts longs |

| La voie | Sa condition | Son rendement |
| La **respiration cellulaire** | Assez de dioxygène | Élevé |
| La **fermentation lactique** | Le dioxygène manque | Faible, et productrice d'acide lactique |

## Les limites
| Le signal d'alerte | Ce qu'il indique |
| Essoufflement, douleur | La limite est atteinte |
| **Crampes** | Fatigue, déshydratation |
| **Déshydratation** | Une perte d'eau non compensée |
| **Hypoglycémie** | Les réserves de glucose sont épuisées |
| Coup de chaleur | La thermorégulation est dépassée |

L'**échauffement** prépare progressivement cœur, muscles et articulations ; la **récupération** et l'hydratation reconstituent les réserves.

## L'entraînement
| L'effet durable | Sa manifestation |
| Un cœur plus puissant | La fréquence de **repos diminue** |
| Des muscles renforcés | Plus de force et d'endurance |
| Un réseau de **capillaires** densifié | Un meilleur apport |
| Une capacité respiratoire accrue | Plus de dioxygène disponible |
| Une récupération plus rapide | Des séances plus rapprochées |

## Ce qu'il ne faut pas faire
Forcer sans échauffement, s'entraîner malade, jeûner avant un effort long, ignorer la douleur, se **doper**.

> Les produits dopants améliorent une performance immédiate au prix de risques cardiaques, hormonaux et psychiques majeurs.`,
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
            cours: `Selon l'OMS, la santé n'est pas seulement l'absence de maladie : c'est un état de complet bien-être physique, mental et social. L'activité physique agit sur les trois.

## Les bénéfices
| Le domaine | Ce que l'activité apporte |
| **Cardiovasculaire** | Cœur plus efficace, pression mieux régulée, moins d'infarctus et d'AVC |
| **Métabolique** | Contrôle du poids, prévention du diabète de type 2, meilleur cholestérol |
| **Musculo-squelettique** | Muscles renforcés, os plus denses, articulations tenues, meilleur équilibre |
| **Mental** | Moins de stress et d'anxiété, meilleur sommeil, humeur et concentration |
| **Social** | Appartenance à un groupe, règles partagées, coopération |

> L'OMS recommande aux adolescents au moins **60 minutes** d'activité modérée à soutenue **par jour**.

## Les risques de la sédentarité
| Le risque | Son mécanisme |
| Surpoids, diabète | Une dépense énergétique trop faible |
| Maladies cardiovasculaires | Un facteur de risque **indépendant** |
| Mal de dos, troubles du sommeil | La position assise prolongée |

> Le temps passé devant les écrans y contribue directement.

## Bien pratiquer
| La règle | Son objet |
| **Échauffement**, progressivité | Préparer le corps |
| Matériel adapté | Éviter la blessure |
| **Hydratation**, récupération, sommeil | Reconstituer |
| Alimentation équilibrée | Fournir |

| Le signe de **surcharge** | Ce qu'il indique |
| Fatigue persistante | Le repos manque |
| Blessures à répétition | Le corps ne récupère plus |
| Troubles du sommeil, perte de motivation | Le surentraînement |

## Alimentation et effort
| L'apport | Son rôle |
| Les **glucides complexes** | L'endurance |
| Les **protéines** | La réparation musculaire |
| Les **lipides** de qualité | Une réserve, et les membranes |
| Vitamines et minéraux | Le fonctionnement |
| L'**eau** | Indispensable |

> Aucun complément ne remplace une alimentation variée, et les régimes restrictifs à l'adolescence sont dangereux pendant la croissance.

## Le dopage
| Ce qu'il est | Ce qu'il coûte |
| Une tricherie sportive | Troubles cardiaques, hormonaux, psychiques, dépendance |

## Une responsabilité individuelle et collective
| Le niveau | Ce dont il dépend |
| **Individuel** | Le choix de bouger |
| **Collectif** | Pistes cyclables, équipements accessibles, cours d'EPS, sécurité des trajets |

> La santé publique se joue autant dans l'aménagement que dans la volonté individuelle.`,
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
            cours: `Le système nerveux relie l'organisme à son environnement.

| Sa partie | Ce qu'elle comprend |
| Le système nerveux **central** | L'encéphale et la moelle épinière |
| Le système nerveux **périphérique** | Les **nerfs** |

## Le trajet d'un message
| L'étape | Ce qui se passe |
| 1 | Un **stimulus** est capté par un **récepteur sensoriel** : œil, oreille, peau, langue, nez |
| 2 | Un message **sensitif** part par un **nerf sensitif** |
| 3 | Le **centre nerveux** traite et élabore une réponse |
| 4 | Un message **moteur** part vers un **organe effecteur** : muscle, glande |

| Le type de réaction | Où se fait le traitement | Sa vitesse |
| Volontaire | Le **cerveau** | Plus lente |
| Le **réflexe** | La **moelle épinière** | Beaucoup plus rapide |

> On retire sa main d'une source brûlante **avant** d'avoir eu mal.

## Le neurone
| Sa partie | Son rôle |
| Le **corps cellulaire** | Le centre de la cellule |
| Les **dendrites** | Elles **reçoivent** |
| L'**axone** | Il **transmet** |
| La **synapse** | Le message y passe par des **neurotransmetteurs** chimiques |

> C'est à la synapse que la plupart des drogues agissent.

> Le cerveau adulte compte environ **86 milliards** de neurones et des milliers de milliards de connexions, qui se remodèlent avec l'apprentissage : c'est la **plasticité cérébrale**.

## Ce qui perturbe le système nerveux
| Le facteur | Ses effets |
| L'**alcool** | Réflexes ralentis, jugement altéré, coma à forte dose — particulièrement toxique pour le cerveau **en développement** |
| Le **cannabis** | Troubles de la mémoire, de l'attention, de la motivation ; risques psychiatriques accrus chez les jeunes |
| Le **tabac** et les autres drogues | Dépendance, altération du circuit de la récompense |
| Le **manque de sommeil** | Le sommeil consolide les apprentissages : en manquer dégrade mémoire, humeur, attention |
| Le **bruit** intense, les écouteurs forts | Destruction **irréversible** des cellules ciliées de l'oreille interne |

## Le comportement responsable
Casque à vélo et en deux-roues, protection auditive, respect du temps de sommeil, refus des substances, prudence sur les écrans avant le coucher.

> Un neurone détruit n'est, dans la plupart des cas, **pas remplacé**.`,
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
            cours: `Les aliments apportent des nutriments. La digestion sert à les rendre assimilables : simplifier les grosses molécules en petites, capables de traverser la paroi intestinale.

## Le trajet des aliments
| L'organe | Ce qui s'y passe |
| La **bouche** | Mastication, salive |
| L'**œsophage** | Péristaltisme |
| L'**estomac** | Brassage, suc gastrique acide |
| L'**intestin grêle** | Sucs pancréatique, biliaire, intestinal : l'essentiel de la digestion **et** de l'absorption |
| Le **gros intestin** | Réabsorption d'eau, microbiote, formation des matières fécales |

## Deux actions complémentaires
| L'action | Ce qu'elle fait | Ses moyens |
| **Mécanique** | Elle **fragmente**, augmentant la surface d'attaque | Mastication, brassage, contractions |
| **Chimique** | Elle **coupe** les liaisons | Les **enzymes**, chacune **spécifique** |

| L'enzyme | Ce qu'elle attaque |
| **Amylase** | L'amidon |
| **Protéases** | Les protéines |
| **Lipases** | Les graisses |

## Ce que deviennent les grandes familles
| L'aliment | Le nutriment obtenu |
| Glucides complexes (amidon) | Le **glucose** |
| Protéines | Les **acides aminés** |
| Lipides | Les **acides gras** et le glycérol |
| Eau, sels minéraux, vitamines | Ils passent **sans transformation** |

> Les **fibres** ne sont pas digérées par nos enzymes : elles régulent le transit et nourrissent le microbiote. Indispensables, même sans valeur énergétique.

## L'équilibre alimentaire
Il ne s'évalue pas repas par repas, mais **sur plusieurs jours**.

| Le repère | Sa fréquence |
| Fruits et légumes | À chaque repas |
| Féculents, de préférence complets | Selon l'appétit et l'activité |
| Protéines variées, dont **légumineuses** | Chaque jour |
| Produits laitiers | Chaque jour |
| Produits sucrés, salés, ultratransformés | **Peu** |
| **Eau** | La seule boisson indispensable |

> Les besoins **varient** : un adolescent en croissance, un sportif, une femme enceinte et une personne âgée n'ont ni les mêmes besoins énergétiques ni les mêmes besoins en calcium, fer ou protéines.

## Quand l'équilibre est rompu
| Le trouble | Sa cause ou son effet |
| **Dénutrition**, carences en fer, calcium, vitamine D | Croissance freinée, fatigue |
| **Surpoids** et **obésité** | Un apport durablement supérieur aux dépenses ; risque de diabète de type 2 et de maladies cardiovasculaires |
| Les **troubles du comportement alimentaire** | Anorexie, boulimie : des **maladies** qui se soignent — il faut demander de l'aide |

## Sécurité alimentaire
Chaîne du froid, cuisson suffisante, lavage des mains et des végétaux, dates de consommation, séparation du cru et du cuit.

> Ces règles évitent les **intoxications alimentaires**, dues à des bactéries comme *Salmonella* ou *Listeria*.`,
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
            cours: `Malgré les barrières naturelles, un micro-organisme peut franchir la peau ou une muqueuse. Le système immunitaire intervient alors en deux temps.

## Les deux réponses
| La réponse | Sa vitesse | Sa spécificité | Ses acteurs |
| **Innée** | Quelques minutes à quelques heures | **Non spécifique** | Réaction inflammatoire, **phagocytes** |
| **Adaptative** | Quelques **jours** | **Spécifique** | **Lymphocytes B** et **T** |

## La réponse immédiate
| Le signe de la réaction inflammatoire | Sa cause |
| Rougeur, chaleur | La dilatation des vaisseaux |
| Gonflement | Le passage de liquide |
| Douleur | Les médiateurs chimiques |

La **phagocytose** : un phagocyte englobe le micro-organisme et le digère.

> Dans la plupart des cas, cela suffit.

## La réponse adaptative
| Le lymphocyte | Ce qu'il fait |
| **B** | Il fabrique des **anticorps**, protéines en Y qui se fixent sur un **antigène** et neutralisent l'intrus |
| **T** | Il détruit directement les cellules infectées |

> Un anticorps ne reconnaît **qu'un seul** antigène. C'est la clé de la spécificité — et c'est pourquoi on peut attraper plusieurs fois un rhume, provoqué chaque fois par un virus différent.

## La mémoire immunitaire
| Le contact | La réponse |
| Le **premier** | Lente, quelques jours ; des **cellules mémoire** persistent des années |
| Le **second**, avec le même antigène | **Beaucoup plus rapide et intense** : l'intrus est éliminé avant tout symptôme |

La personne est **immunisée**.

## La vaccination
| Ce que le vaccin apporte | Ce qu'il ne provoque pas |
| Un **antigène rendu inoffensif** : micro-organisme tué, atténué, fragment, ou instruction pour en fabriquer un | La **maladie** |

Il déclenche une réponse et surtout une **mémoire**. Un **rappel** l'entretient.

## L'immunité collective
Quand une proportion suffisante de la population est immunisée, le micro-organisme ne circule plus assez pour atteindre les personnes non protégées — nourrissons, immunodéprimés.

> C'est ce qui a permis d'**éradiquer la variole**, en 1980.`,
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
            cours: `Face aux infections, trois moyens complémentaires — qu'il est essentiel de ne pas confondre.

## Les trois leviers
| Le levier | Son moment | Ce qu'il fait |
| L'**hygiène** | Avant la contamination | Elle empêche l'arrivée du microbe |
| La **vaccination** | Avant la maladie | Elle **prépare** l'organisme |
| Les **antibiotiques** | Après l'infection | Ils **soignent** — les bactéries seulement |

## Prévenir la contamination
| La mesure | Son objet |
| Lavage des mains, eau potable, assainissement | Le quotidien |
| Cuisson et conservation, protection des plaies, aération | Les gestes simples |
| L'**asepsie** | Éviter l'arrivée des microbes : stérilisation, usage unique |
| L'**antisepsie** | Éliminer ceux déjà présents sur la peau |

> Pour les **IST**, le **préservatif** est le seul moyen qui protège à la fois d'une infection et d'une grossesse non désirée. Le dépistage permet de traiter tôt et d'éviter la transmission.

## La vaccination
| Le statut en France | Ce qu'il recouvre |
| **Obligatoires** | Plusieurs vaccins pour les jeunes enfants |
| **Recommandés** | Papillomavirus, grippe, rappels |

> C'est une mesure **préventive** : elle n'a aucun effet sur une infection déjà déclarée. Elle protège l'individu **et** la collectivité.

## Les antibiotiques
| Ce qu'ils font | Ce qu'ils ne font pas |
| Ils tuent les **bactéries** ou bloquent leur multiplication | **Aucun effet sur les virus** : grippe, rhume, bronchiolite, angine virale |

| L'outil du médecin | Ce qu'il permet |
| Le **test rapide** d'angine | Distinguer bactérienne et virale |
| L'**antibiogramme** | Choisir la molécule efficace |

> Deux règles : **le bon antibiotique**, et **le traitement complet**. Arrêter dès qu'on va mieux laisse survivre les bactéries les plus résistantes.

## L'antibiorésistance
| Le mécanisme | Sa conséquence |
| Un usage excessif ou mal conduit **sélectionne** les bactéries résistantes | C'est la sélection naturelle appliquée aux microbes |
| Certaines infections deviennent difficiles à traiter | L'OMS classe l'antibiorésistance parmi les grandes menaces sanitaires |

D'où la campagne : « les antibiotiques, c'est pas automatique ».

## Sérum et antiviraux
| Le traitement | Son action |
| Le **sérum thérapeutique** | Des anticorps déjà formés : effet **immédiat**, **sans mémoire** — pour l'urgence |
| Les **antiviraux** | Ils ciblent les virus, mais sont peu nombreux et très spécifiques |

## Ce qui a changé l'espérance de vie
Eau potable, assainissement, hygiène, vaccination et antibiotiques ont fait reculer la mortalité infectieuse plus qu'aucune autre avancée médicale.`,
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
            cours: `La puberté est la période de transformation qui rend l'organisme capable de se reproduire. Elle se déroule en moyenne entre 10 et 16 ans, avec de grandes variations individuelles parfaitement normales.

## Ce qui change
| Le domaine | Ses transformations |
| Caractères sexuels **primaires** | Les organes génitaux se développent et deviennent fonctionnels |
| Caractères sexuels **secondaires** | Pilosité, seins, mue de la voix, hanches ou épaules, poussée de croissance, peau |
| **Psychologiques et sociales** | Nouvelles émotions, sentiment amoureux, besoin d'autonomie, rapport au corps |

## Ce qui déclenche tout
| L'étage | Son action |
| Le **cerveau** | Il commande |
| L'**hypophyse** | Elle libère des hormones dans le sang |
| Les **gonades** — testicules ou ovaires | Elles produisent **testostérone**, ou **œstrogènes** et **progestérone** |

> Une **hormone** est un message chimique produit par une glande, transporté par le sang, et qui n'agit que sur les cellules capables de le reconnaître.

## Les deux appareils
| Le point | **Masculin** | **Féminin** |
| La production de gamètes | **Continue**, dès la puberté et toute la vie | **Cyclique** : un ovule environ tous les **28 jours** |
| Le stock initial | Aucun : ils sont fabriqués en permanence | Constitué **dès la naissance** |
| L'organe producteur | Les **testicules** | Les **ovaires** |
| Le trajet | Épididyme, canaux déférents, mélange aux sécrétions des vésicules séminales et de la prostate : le **sperme** | La **trompe**, lieu possible de la fécondation |
| L'organe d'accueil | — | L'**utérus**, dont la muqueuse s'épaissit chaque cycle |
| Sans fécondation | — | La muqueuse est éliminée : les **règles**, premier jour du cycle |
| L'arrêt | Aucun net | La **ménopause** |

## Ce qu'il faut retenir sur la fertilité
| Le moment | Ce qui est possible |
| Dès la **première ovulation** — qui **précède** les premières règles | Une grossesse |
| Dès les premières éjaculations | Idem |

> Les cycles irréguliers du début n'offrent **aucune** protection.`,
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
            cours: `La fécondation a lieu dans une trompe : un seul spermatozoïde pénètre l'ovule, et les deux noyaux fusionnent.

La **cellule œuf** contient 46 chromosomes et porte déjà toute l'information du futur individu — dont son **sexe**, déterminé par le chromosome apporté par le spermatozoïde.

## Le calendrier
| L'étape | Sa date |
| La **division** de la cellule œuf, en descendant vers l'utérus | Jours 1 à 6 |
| La **nidation** dans la muqueuse utérine | **6e ou 7e jour** |
| L'**embryon** : mise en place de tous les organes, l'**organogenèse** | Jusqu'à la **8e semaine** |
| Le **fœtus** : croissance et maturation | De la 9e semaine à la naissance |

> Sans nidation, il n'y a pas de grossesse. Et la période embryonnaire est la **plus sensible** aux agressions extérieures.

| Le stade | La taille |
| À 8 semaines | Environ 3 cm |
| À terme | Environ 50 cm |

## Les échanges avec la mère
| L'organe | Son rôle |
| Le **placenta** | L'organe des échanges |
| Le **cordon ombilical** | Il relie le fœtus au placenta |
| Le **liquide amniotique** | Il amortit, protège des chocs, maintient la température |

| Le sens de passage | Ce qui passe |
| De la mère au fœtus | **Dioxygène** et **nutriments** |
| Du fœtus à la mère | **Dioxyde de carbone** et **déchets** |

> Les sangs maternel et fœtal **ne se mélangent pas** : ils circulent de part et d'autre d'une barrière très fine.

> Le placenta n'est **pas** un filtre absolu : alcool, tabac, drogues, certains médicaments et certains virus le traversent.

## Ce qui protège la grossesse
| La règle | Sa raison |
| **Aucun alcool** | Il n'existe **aucune dose sans risque** |
| Ni tabac, ni drogue | Ils traversent le placenta |
| Aucun médicament sans avis médical | Certains sont tératogènes |
| Une alimentation équilibrée, vaccination à jour | Les besoins augmentent |
| Un **suivi médical** régulier | Consultations, **échographies** de datation, morphologie, croissance ; analyses |

## L'accouchement
| L'étape | Ce qui se passe |
| Les **contractions** | Elles dilatent le col |
| L'**expulsion** | Le bébé naît, après environ **9 mois** |
| Le **cordon** | Il est coupé |
| La **délivrance** | Le placenta est expulsé |
| Les premières minutes | Le nouveau-né respire seul, sa circulation se réorganise |

## Les débuts de la vie
L'allaitement ou le lait infantile assurent la nutrition ; le nouveau-né bénéficie encore quelques mois des **anticorps** transmis par sa mère.`,
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
            cours: `Maîtriser sa procréation, c'est pouvoir éviter une grossesse non désirée — et, à l'inverse, être aidé lorsqu'une grossesse souhaitée ne vient pas.

## Les moyens de contraception
| Le type | Ses moyens | Son principe |
| **Hormonal** | Pilule, implant, patch, anneau, injection | La pilule bloque l'**ovulation** ; efficace si prise régulièrement |
| **Mécanique** | **Préservatif** masculin ou féminin, **stérilet**, diaphragme | Une barrière ou une action locale |
| **Définitif** | Ligature des trompes, vasectomie | Réservé à l'adulte, après réflexion et délai légal |
| D'**urgence** | La « pilule du lendemain » | Après un rapport non protégé, **le plus tôt possible** |

La contraception d'urgence est délivrée sans ordonnance, gratuitement pour les mineures.

> Elle ne remplace **jamais** une contraception régulière.

> Un seul moyen protège **à la fois** d'une grossesse et des **infections sexuellement transmissibles** : le **préservatif**.

## Comment choisir
| Ce dont dépend le choix | Où en parler |
| L'âge, la santé, le mode de vie | En **centre de santé sexuelle** |
| Les contre-indications, le désir de chacun | La consultation est **gratuite et confidentielle** pour les mineurs |

## L'IVG
| Le point | Son contenu |
| Son statut | Un **droit** en France, autorisé par la **loi Veil de 1975** |
| Son délai | Jusqu'à **14 semaines de grossesse**, soit 16 d'aménorrhée |
| Ses méthodes | Médicamenteuse ou chirurgicale |
| Sa prise en charge | **100 %** |

> Ce n'est pas un moyen de contraception, mais un droit garanti.

## L'infertilité
| L'origine | Ses causes possibles |
| **Féminine** | Trompes obstruées, troubles de l'ovulation, endométriose |
| **Masculine** | Spermatozoïdes peu nombreux ou peu mobiles |
| **Mixte** ou inexpliquée | — |

Un couple sur six consulte pour des difficultés à concevoir.

## L'assistance médicale à la procréation
| La technique | Son principe |
| La **stimulation ovarienne** | Des hormones déclenchent ou régularisent l'ovulation |
| L'**insémination artificielle** | Le sperme est déposé dans l'utérus |
| La **FIV** | La rencontre des gamètes se fait au laboratoire ; un embryon est transféré |
| L'**ICSI** | Un spermatozoïde unique est injecté dans l'ovule |
| Le **don** de gamètes | Quand les gamètes du couple ne conviennent pas |

> Ces techniques posent des questions **éthiques** — devenir des embryons congelés, anonymat des donneurs, accès aux techniques — que la **loi de bioéthique**, régulièrement révisée, tranche par le débat démocratique et non par la seule science.`,
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
