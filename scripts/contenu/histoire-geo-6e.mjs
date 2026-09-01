// Histoire-géographie — Sixième : LE PROGRAMME COMPLET (30 fiches, 2 ONGLETS).
//
// LE DÉFAUT. La page « Histoire-Géo » d'un élève de 6e s'ouvrait sur cinq fiches
// héritées du premier jeu de données (migration 008) : « La longue histoire de
// l'humanité », « Premiers États, premières écritures », « Rome : du mythe à
// l'histoire », « Habiter une métropole » et « Habiter les littoraux ». Cinq
// titres pour deux disciplines et une année entière.
//
// ⚠️ CE MODULE OUVRE LES DEUX ONGLETS D'UN SEUL COUP, comme celui de 5e (306) :
// un seul module, DEUX blocs, DEUX rayons (`chapters.discipline`, migration
// 247). `disciplinesOf` (lib/subject-template) rend un onglet par rayon dès
// qu'il y en a deux — le dossier s'ouvre donc sur « Histoire » et
// « Géographie » dès l'exécution.
//
// LE DÉCOUPAGE.
//   RAYON HISTOIRE — positions 1 → 20, sous 3 thèmes :
//     1. La longue histoire de l'humanité et des migrations          (6)
//     2. Récits fondateurs, croyances et citoyenneté (Ier mill. av.)  (9)
//     3. L'Empire romain dans le monde antique                       (5)
//   RAYON GÉOGRAPHIE — positions 21 → 30, sous 4 thèmes :
//     1. Habiter une métropole              (3)
//     2. Habiter un espace de faible densité (3)
//     3. Habiter les littoraux               (1)
//     4. Le monde habité                     (3)
//
// ⚠️ UNE COLLISION DE TITRE, traitée par `theme IS NULL`. La fiche neuve
// « Habiter les littoraux » porte EXACTEMENT le titre d'un chapitre hérité de la
// 008, et `chapters` porte UNIQUE(subject_id, level, title). Le ménage tournant
// AVANT les insertions et visant `theme IS NULL`, l'ancien est parti quand le
// neuf arrive : aucune collision possible, ni au premier passage ni au rejeu.
//
// ⚠️ Le slug `histoire-geo` porte plusieurs modules (Tle = 227/229/246,
// 1re = 245, 2de = 279, 3e = 291/293, 5e = 306, celui-ci = 6e) : ne JAMAIS
// générer avec `--slugs histoire-geo`. Toujours `--modules histoire-geo-6e`.

export default {
  slug: 'histoire-geo',
  nom: 'Histoire-Géo',

  titreMigration: 'HISTOIRE-GÉO 6e — LE PROGRAMME COMPLET (30 fiches, 2 onglets)',

  motif: `CONSTAT : l'histoire-géo de 6e n'avait que les 5 fiches du premier jeu de données
de l'app, pour DEUX disciplines et une année entière. Un élève qui révisait le
néolithique, la démocratie athénienne, la naissance du judaïsme, la romanisation,
les espaces de faible densité ou la répartition de la population mondiale ne
trouvait RIEN. Cette migration installe les 30 fiches du programme, rangées sous
7 chapitres et DEUX RAYONS, et retire les 5 fiches génériques.
LE DOSSIER S'OUVRE SUR DEUX ONGLETS — « Histoire » et « Géographie » — grâce à
chapters.discipline (247), comme en 5e (306) et en 3e (291/293).
UNE COLLISION DE TITRE EST NEUTRALISÉE : la fiche neuve « Habiter les littoraux »
porte exactement le titre d'un chapitre hérité, et chapters impose
UNIQUE(subject_id, level, title). Le ménage par theme IS NULL tourne avant les
insertions : l'ancien est parti quand le neuf arrive.`,

  menage: [
    {
      raison: `Les colonnes chapters.theme (migration 234) et chapters.discipline
(migration 247) conditionnent tout ce qui suit : ce module range ses 30 fiches
sous 7 chapitres et deux rayons, et l'INSERT écrit les deux colonnes. Elles sont
REPRISES ici en ADD COLUMN IF NOT EXISTS parce qu'on ne peut pas garantir que la
234 et la 247 soient passées en production — sans cette reprise, la migration
échouerait sur "column chapters.theme does not exist", les 5 anciens chapitres
déjà supprimés et les 30 neufs pas encore posés : une matière vide.
Le ménage qui suit LIT la colonne theme : elle doit exister avant lui.
Le GRANT n'est pas décoratif : la migration 182 a révoqué le SELECT de table sur
chapters (pour cacher mind_map) et ne l'a rendu que colonne par colonne. Sans le
GRANT sur discipline, les deux onglets ne s'afficheraient pas.`,
      sql: `ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;

ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS discipline TEXT;
GRANT SELECT (discipline) ON public.chapters TO anon;
GRANT SELECT (discipline) ON public.chapters TO authenticated;`,
    },
    {
      raison: `Les 5 chapitres hérités de la 008 partent, au niveau 6e SEULEMENT.

LE REPÈRE EST theme IS NULL, PAS LE TITRE — et ici ce n'est pas un confort, c'est
la CONDITION du bon fonctionnement. La fiche neuve « Habiter les littoraux »
porte exactement le titre d'un chapitre hérité, or chapters impose
UNIQUE(subject_id, level, title) : un ménage par titre laisserait passer la
collision. Le critère « pas de chapitre de programme » vise exactement les cinq
lignes voulues — elles datent de la 008, bien avant la colonne theme, tandis que
les 30 fiches neuves en portent une dès l'INSERT. Le ménage tourne AVANT les
insertions et ne peut donc jamais mordre sur elles, ni au premier passage ni au
rejeu.
Le filtre level = '6e' est indispensable : l'histoire-géo existe sur sept
niveaux, et chacun a ses propres migrations.
L'ordre compte : la file "À revoir" d'abord (review_items.item_id n'a PAS de clé
étrangère), puis les quiz (quizzes.lesson_id est ON DELETE SET NULL), puis les
chapitres, dont les leçons partent en cascade.`,
      sql: `DELETE FROM public.review_items ri
 USING public.quiz_questions qq, public.quizzes qz, public.lessons l,
       public.chapters c, public.subjects s
 WHERE ri.item_kind = 'question'
   AND ri.item_id = qq.id
   AND qq.quiz_id = qz.id
   AND qz.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'histoire-geo'
   AND c.level = '6e'
   AND c.theme IS NULL;

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'histoire-geo'
   AND c.level = '6e'
   AND c.theme IS NULL;

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'histoire-geo'
   AND c.level = '6e'
   AND c.theme IS NULL;`,
    },
  ],

  blocs: [
    // =====================================================================
    // RAYON HISTOIRE — positions 1 → 20
    // =====================================================================
    {
      niveaux: ['6e'],
      rayon: 'histoire',
      chapitres: [
        // --- Thème 1 : La longue histoire de l'humanité et des migrations ---
        {
          titre: 'Les débuts de l’humanité',
          axe: 'La longue histoire de l’humanité et des migrations',
          lecon: {
            titre: 'Une histoire qui commence en Afrique',
            cours: `L’histoire de l’humanité commence en Afrique, il y a environ 3 millions d’années. Cette période, le Paléolithique, occupe plus de 99 % du temps humain.

## Les premiers Homo
@ ≈ 2,5 millions d’années — *Homo habilis* : les premiers outils taillés
@ ≈ 1,9 million d’années — *Homo erectus* : la maîtrise du feu, les premières sorties d’Afrique
@ ≈ 300 000 ans — *Homo sapiens*, notre espèce, née en Afrique elle aussi
@ ≈ 40 000 ans — Disparition d’*Homo neanderthalensis* en Europe

## Comment ils vivent
| Leur mode de vie | Ce que cela veut dire |
| **Chasseurs-cueilleurs** | Ils prélèvent ce que la nature offre, sans rien produire |
| **Nomades** | Ils se déplacent au rythme du gibier et des saisons |
| En **petits groupes** | Abris sous roche, campements |

## Les quatre grandes acquisitions
~ La bipédie (les mains libres) → L’outil taillé → Le feu → Le langage, puis l’art

| L’acquisition | Ce qu’elle change |
| La **bipédie** | Elle libère les mains |
| L’**outil taillé** | Du galet aménagé au biface |
| Le **feu** | Il protège, chauffe, éclaire et cuit |
| Le **langage** | Il permet de transmettre |

## L’art pariétal
| La grotte | Son âge |
| **Chauvet** | ≈ 36 000 ans |
| **Lascaux** | ≈ 18 000 ans |

Ces peintures d’animaux, d’un réalisme saisissant, prouvent une pensée **symbolique**.

> Une main peinte sur une paroi il y a 30 000 ans est un message : « j’étais là ».

## Comment on le sait
L’historien travaille sur des **traces** : outils, ossements, foyers, peintures. L’**archéologie** les met au jour, et le **carbone 14** leur donne un âge.`,
          },
          questions: [
            ['Sur quel continent l’humanité apparaît-elle ?', ['En Afrique', 'En Europe', 'En Asie', 'En Amérique'], 0, 'Homo sapiens y naît également.'],
            ['Comment appelle-t-on la période des premiers humains ?', ['Le Paléolithique', 'Le Néolithique', 'L’Antiquité', 'Le Moyen Âge'], 0, 'Elle représente plus de 99 % du temps de l’humanité.'],
            ['Quel mode de vie ont les humains du Paléolithique ?', ['Chasseurs-cueilleurs et nomades', 'Agriculteurs sédentaires', 'Éleveurs sédentaires', 'Commerçants'], 0, 'Ils suivent le gibier et les saisons.'],
            ['Quelle espèce maîtrise le feu et sort d’Afrique ?', ['Homo erectus', 'Homo habilis', 'Homo sapiens', 'Homo neanderthalensis'], 0, 'Il y a environ 1,9 million d’années.'],
            ['Depuis combien de temps Homo sapiens existe-t-il ?', ['Environ 300 000 ans', 'Environ 3 millions d’années', 'Environ 40 000 ans', 'Environ 10 000 ans'], 0, 'Notre espèce est née en Afrique.'],
            ['Que prouvent les peintures de Lascaux et Chauvet ?', ['Une pensée symbolique', 'La pratique de l’agriculture', 'L’existence de villes', 'L’usage de l’écriture'], 0, 'Ces humains représentaient le monde.'],
            ['Sur quoi l’historien travaille-t-il pour cette période ?', ['Des traces matérielles : outils, ossements, foyers, peintures', 'Des textes écrits', 'Des témoignages oraux', 'Des registres d’État'], 0, 'L’écriture n’existe pas encore.'],
            ['Le Paléolithique est la période la plus courte de l’histoire humaine.', ['Vrai', 'Faux'], 1, 'C’est de très loin la plus longue.'],
          ],
        },
        {
          titre: 'Les migrations et le mode de vie des premiers êtres humains',
          axe: 'La longue histoire de l’humanité et des migrations',
          lecon: {
            titre: 'Peupler la planète',
            cours: `Depuis l’Afrique, les humains ont peuplé toute la planète — non pas en voyageant, mais en glissant de génération en génération.

## Les grandes étapes
@ ≈ 100 000 à 60 000 ans — *Homo sapiens* sort d’Afrique vers le Proche-Orient, puis l’Asie
@ ≈ 50 000 ans — L’Australie, atteinte en franchissant des bras de mer : donc en NAVIGUANT
@ ≈ 45 000 ans — L’Europe
@ ≈ 20 000 à 15 000 ans — L’Amérique, par le détroit de Béring alors émergé

!> Le détroit de **Béring** était **à sec** : pendant la glaciation, l’eau piégée dans les glaces avait fait baisser le niveau des mers. Ce n’était pas une traversée, mais un passage à pied.

## Pourquoi partir
| La cause | Le détail |
| Le **gibier** et les ressources | On suit ce dont on vit |
| Les **variations du climat** | Une région devient vivable, une autre non |
| L’**augmentation** des groupes | Il faut de la place |

> Ces déplacements se comptent en **millénaires**. Personne n’est « parti pour l’Australie » : chaque génération s’installait un peu plus loin.

## S’adapter à chaque milieu
| Le milieu | La solution technique |
| Le **froid** | Vêtements cousus, lampes à graisse |
| Les **tropiques** | Habitats légers |
| Les **côtes** | Techniques de pêche |

> L’humain n’est pas fait pour un milieu : il fabrique de quoi vivre dans tous.

## Ce que la génétique a confirmé
L’étude de l’**ADN** confirme le scénario africain et retrace les routes du peuplement.

!> Elle établit aussi que les différences génétiques entre groupes humains sont **très faibles** : l’humanité forme **une seule espèce**, sans races biologiques.`,
          },
          questions: [
            ['Par où les humains sont-ils passés pour atteindre l’Amérique ?', ['Le détroit de Béring, alors émergé', 'L’océan Atlantique', 'Le détroit de Gibraltar', 'Le canal de Panama'], 0, 'Le niveau des mers était plus bas pendant la glaciation.'],
            ['Vers quelle date l’Australie a-t-elle été peuplée ?', ['Vers 50 000 ans', 'Vers 15 000 ans', 'Vers 5 000 ans', 'Vers 100 000 ans'], 0, 'Ce peuplement supposait de naviguer.'],
            ['Quelle cause explique les migrations préhistoriques ?', ['La recherche de ressources et les variations du climat', 'Les guerres entre États', 'Le commerce', 'La religion'], 0, 'Les groupes suivaient le gibier.'],
            ['Sur quelle durée ces migrations se sont-elles étalées ?', ['Des millénaires', 'Quelques années', 'Quelques siècles', 'Quelques mois'], 0, 'Ce sont des glissements de génération en génération.'],
            ['Qu’a confirmé l’étude de l’ADN des populations actuelles ?', ['L’origine africaine et les routes du peuplement', 'L’existence de races biologiques', 'Une origine européenne', 'Plusieurs espèces humaines actuelles'], 0, 'Les différences entre groupes humains sont très faibles.'],
            ['Vers quelle date Homo sapiens atteint-il l’Europe ?', ['Vers 45 000 ans', 'Vers 100 000 ans', 'Vers 15 000 ans', 'Vers 5 000 ans'], 0, 'Il y côtoie Néandertal.'],
            ['Comment les humains se sont-ils installés dans des milieux très froids ?', ['Par des adaptations techniques : vêtements cousus, lampes à graisse', 'En hibernant', 'En ne s’y installant pas', 'Par une transformation biologique rapide'], 0, 'L’adaptation technique est la marque de l’espèce.'],
            ['L’humanité actuelle se divise en plusieurs races biologiques.', ['Vrai', 'Faux'], 1, 'La génétique établit l’unité de l’espèce humaine.'],
          ],
        },
        {
          titre: 'La révolution néolithique',
          axe: 'La longue histoire de l’humanité et des migrations',
          lecon: {
            titre: 'Quand l’humanité se met à produire',
            cours: `Vers 10 000 av. J.-C., des humains cessent de prélever ce que la nature offre : ils se mettent à produire. C’est le changement le plus profond de toute l’histoire.

## Où et quand
@ ≈ 10 000 av. J.-C. — Au Proche-Orient, dans le Croissant fertile : la révolution néolithique
@ 7000 à 3000 av. J.-C. — Le Néolithique gagne l’Europe

Il apparaît aussi **indépendamment** en Chine, en Afrique et en Amérique : plusieurs foyers, sans contact entre eux.

## Les deux inventions
| L’invention | Ce qu’on fait |
| L’**agriculture** | On sème et on récolte : blé, orge, lentilles |
| L’**élevage** | On domestique chèvre, mouton, bœuf, porc |

La **domestication** est cette sélection, de génération en génération, des plantes et des bêtes les plus utiles.

## La sédentarisation
~ Produire sa nourriture → Rester pour surveiller champs et troupeaux → Premiers villages permanents

Maisons en terre, greniers : on ne repart plus.

## Les conséquences en chaîne
| La conséquence | Ce qu’elle entraîne |
| Des **surplus** | On stocke des réserves |
| Une **population** en hausse | Plus de nourriture, plus d’humains |
| Une **spécialisation** | Potiers, tisserands, forgerons |
| Des **inégalités** | Ce qui se stocke peut s’accumuler |
| Des **techniques** | Poterie, tissage, pierre polie, puis métaux |

> Tant qu’on ne stocke rien, il n’y a rien à posséder. Le grenier est aussi la naissance de la richesse — et de l’inégalité.

## Les monuments
**Dolmens**, **menhirs** et **cromlechs** — Carnac, Stonehenge — témoignent de sociétés capables d’organiser des chantiers collectifs considérables.`,
          },
          questions: [
            ['Quand commence la révolution néolithique ?', ['Vers 10 000 av. J.-C.', 'Vers 3 000 av. J.-C.', 'Vers 100 000 av. J.-C.', 'Vers 500 av. J.-C.'], 0, 'Au Proche-Orient, dans le Croissant fertile.'],
            ['Quelles sont les deux inventions majeures du Néolithique ?', ['L’agriculture et l’élevage', 'Le feu et l’outil', 'L’écriture et la roue', 'Le bronze et le fer'], 0, 'On passe du prélèvement à la production.'],
            ['Quelle conséquence directe l’agriculture a-t-elle sur le mode de vie ?', ['La sédentarisation', 'Le nomadisme accru', 'La disparition des villages', 'La fin de l’élevage'], 0, 'Il faut rester pour surveiller champs et troupeaux.'],
            ['Qu’est-ce que la domestication ?', ['La sélection des plantes et des animaux les plus utiles au fil des générations', 'L’enfermement des animaux', 'La construction de maisons', 'La cuisson des aliments'], 0, 'Elle transforme durablement les espèces.'],
            ['Quelle conséquence sociale les surplus agricoles entraînent-ils ?', ['L’apparition d’inégalités et de métiers spécialisés', 'La disparition des chefs', 'L’égalité entre tous', 'La fin des échanges'], 0, 'Ce qui se stocke peut s’accumuler.'],
            ['Où le Néolithique est-il apparu ?', ['Dans plusieurs foyers indépendants : Proche-Orient, Chine, Afrique, Amérique', 'Uniquement au Proche-Orient', 'Uniquement en Europe', 'Uniquement en Chine'], 0, 'Ces foyers n’étaient pas en contact.'],
            ['Quels monuments témoignent des sociétés néolithiques d’Europe ?', ['Les dolmens et les menhirs', 'Les pyramides', 'Les temples grecs', 'Les cathédrales'], 0, 'Carnac et Stonehenge en sont célèbres.'],
            ['Au Néolithique, tous les habitants d’un village cultivaient la terre.', ['Vrai', 'Faux'], 1, 'Les surplus permettent des métiers spécialisés.'],
          ],
        },
        {
          titre: 'Les premiers États',
          axe: 'La longue histoire de l’humanité et des migrations',
          lecon: {
            titre: 'Des villages aux royaumes',
            cours: `Les premiers États naissent au bord de deux fleuves. Ce n’est pas un hasard : l’eau y commande tout, y compris le pouvoir.

## Naître d’un fleuve
@ ≈ 3500-3000 av. J.-C. — Premières cités et premiers États en Mésopotamie et en Égypte
@ ≈ 3100 av. J.-C. — Unification de la Haute et de la Basse-Égypte
@ ≈ 2500 av. J.-C. — Les pyramides de Gizeh

| Le pays | Son fleuve |
| La **Mésopotamie** (Irak actuel) | Entre le **Tigre** et l’**Euphrate** |
| L’**Égypte** | La vallée du **Nil** |

Le fleuve donne l’**eau**, des **crues** qui fertilisent, et une **voie de transport**.

## Ce qui définit un État
| L’élément | Son rôle |
| Un **territoire** | Délimité |
| Une **population** | |
| Un **pouvoir** | Il commande, prélève l’**impôt**, rend la justice |
| Des **lois** et des **fonctionnaires** | Dont les **scribes** |

## L’irrigation, moteur du pouvoir
~ Creuser des canaux → Organiser le travail de milliers de personnes → Un pouvoir central devient nécessaire

> Le besoin d’organisation collective n’accompagne pas l’État : il l’**appelle**.

## La cité mésopotamienne
Chaque cité — **Ur**, **Uruk**, **Lagash** — a son **roi**, son **dieu** et sa **ziggurat**, temple à degrés qui domine la ville. Elles se font la guerre, puis sont unifiées en empires : **Akkad**, puis **Babylone**.

## L’Égypte pharaonique
Le **pharaon** est un roi **divin**, maître des terres et des hommes. Les **pyramides** sont des tombeaux.

> Une pyramide ne dit pas seulement la foi dans l’au-delà : elle dit qu’un homme pouvait mobiliser des dizaines de milliers de bras pendant vingt ans.

## Une société hiérarchisée
~ Le roi → les prêtres, scribes et guerriers → les paysans et artisans (l’immense majorité) → les esclaves`,
          },
          questions: [
            ['Où apparaissent les premiers États ?', ['En Mésopotamie et en Égypte', 'En Grèce et à Rome', 'En Chine et en Inde', 'En Europe du Nord'], 0, 'Dans les vallées du Tigre, de l’Euphrate et du Nil.'],
            ['Vers quelle date apparaissent les premiers États ?', ['Vers 3500-3000 av. J.-C.', 'Vers 10 000 av. J.-C.', 'Vers 500 av. J.-C.', 'Vers 1000 apr. J.-C.'], 0, 'Environ 7 000 ans après le début du Néolithique.'],
            ['Pourquoi les fleuves sont-ils décisifs ?', ['Ils fournissent eau, crues fertilisantes et voie de transport', 'Ils protègent des invasions', 'Ils fournissent du métal', 'Ils délimitent les frontières'], 0, 'L’irrigation appelle une organisation collective.'],
            ['Comment appelle-t-on le temple à degrés des cités mésopotamiennes ?', ['La ziggurat', 'La pyramide', 'Le parthénon', 'Le forum'], 0, 'Il domine la ville.'],
            ['Quel est le statut du pharaon ?', ['Un roi divin, maître des terres et des hommes', 'Un chef élu', 'Un grand prêtre sans pouvoir politique', 'Un chef de guerre temporaire'], 0, 'Il unifie la Haute et la Basse-Égypte.'],
            ['À quoi servaient les pyramides de Gizeh ?', ['De tombeaux royaux', 'De temples de culte quotidien', 'De greniers', 'De forteresses'], 0, 'Elles mesurent aussi la puissance du pouvoir.'],
            ['Qui compose la majorité de la population dans ces premiers États ?', ['Les paysans et les artisans', 'Les scribes', 'Les prêtres', 'Les guerriers'], 0, 'La société est fortement hiérarchisée.'],
            ['Un État se définit par un territoire, une population et un pouvoir organisé.', ['Vrai', 'Faux'], 0, 'Avec des lois, un impôt et des fonctionnaires.'],
          ],
        },
        {
          titre: 'Une diversité d’États dans le Croissant fertile',
          axe: 'La longue histoire de l’humanité et des migrations',
          lecon: {
            titre: 'Cités, royaumes et empires',
            cours: `Cité-État, royaume, empire : trois façons d’organiser le pouvoir, nées au même endroit et souvent l’une après l’autre.

## Le Croissant fertile
Une bande de terres arquée, du golfe Persique à l’Égypte en passant par la Mésopotamie et le Levant. Ses sols et son eau en font le berceau de l’agriculture — et des premiers États.

## Trois formes politiques
| La forme | Ce qu’elle est | Ses exemples |
| La **cité-État** | Une ville et son territoire, sous un roi | Ur, Uruk, Mari |
| Le **royaume** | Un ensemble plus large sous un même roi | |
| L’**empire** | La domination d’un peuple sur beaucoup d’autres | Akkad, Babylone, l’Assyrie |

@ ≈ 2300 av. J.-C. — Sargon fonde l’empire d’Akkad
@ ≈ 1750 av. J.-C. — Hammurabi fait graver son code à Babylone

## Le code de Hammurabi
Près de **300 articles** de loi gravés sur une **stèle** de pierre : l’un des plus anciens recueils juridiques connus.

| Ce qu’il apporte | Pourquoi c’est nouveau |
| La loi est **écrite** | La même pour des cas semblables |
| La loi est **publique** | Exposée à la vue de tous |
| Les **peines** sont graduées | Selon la gravité |

!> Mais les peines diffèrent **selon le rang social** de la victime et du coupable. Écrire la loi ne la rend pas égalitaire.

> Écrire la loi la rend **connaissable**. C’est déjà un immense progrès sur l’arbitraire.

## Le rôle des échanges
Bois du Liban, métaux d’Anatolie, pierres précieuses : le commerce circule loin, et diffuse avec lui les **techniques**, les **écritures** et les **croyances**.

## La fragilité
Aucun de ces empires ne dure : conquêtes, révoltes, sécheresses, invasions. Ce qui subsiste, ce sont les **inventions** — l’écriture, le droit, l’administration.`,
          },
          questions: [
            ['Qu’est-ce qu’une cité-État ?', ['Une ville et son territoire, gouvernée par un roi', 'Un empire de plusieurs peuples', 'Un village agricole', 'Une région sans pouvoir'], 0, 'Ur, Uruk et Mari en sont des exemples.'],
            ['Qu’est-ce qu’un empire ?', ['La domination d’un peuple sur de nombreux autres', 'Une cité indépendante', 'Un territoire sans roi', 'Une alliance de villages'], 0, 'Akkad, Babylone et l’Assyrie en sont.'],
            ['Vers quelle date le code de Hammurabi est-il gravé ?', ['Vers 1750 av. J.-C.', 'Vers 3000 av. J.-C.', 'Vers 500 av. J.-C.', 'Vers 1000 apr. J.-C.'], 0, 'Par le roi de Babylone.'],
            ['Quel est l’apport majeur du code de Hammurabi ?', ['La loi est écrite et publique, donc connaissable de tous', 'La loi devient égalitaire', 'Il supprime les peines', 'Il abolit l’esclavage'], 0, 'Les peines restent différentes selon le rang social.'],
            ['Où le code de Hammurabi est-il gravé ?', ['Sur une stèle de pierre exposée publiquement', 'Sur des tablettes conservées au palais', 'Sur des papyrus', 'Sur les murs d’un temple fermé'], 0, 'Il devait être vu de tous.'],
            ['Qu’est-ce que le Croissant fertile ?', ['Une bande de terres allant du golfe Persique à l’Égypte', 'Une région d’Afrique du Nord', 'Une vallée d’Europe', 'Une île de Méditerranée'], 0, 'Berceau de l’agriculture et des premiers États.'],
            ['Que diffusent les échanges commerciaux de ces États ?', ['Les techniques, les écritures et les croyances', 'Uniquement des marchandises', 'Uniquement des armes', 'Rien d’immatériel'], 0, 'Le commerce transporte aussi des idées.'],
            ['Les peines du code de Hammurabi sont les mêmes pour tous.', ['Vrai', 'Faux'], 1, 'Elles varient selon le rang social.'],
          ],
        },
        {
          titre: 'Les premières écritures',
          axe: 'La longue histoire de l’humanité et des migrations',
          lecon: {
            titre: 'Le geste qui ouvre l’Histoire',
            cours: `L’écriture ne sépare pas seulement deux périodes : elle sépare ce dont on garde trace de ce qui se perd.

## La date qui sépare tout
@ ≈ 3300 av. J.-C. — Invention de l’écriture en Mésopotamie : fin de la Préhistoire, début de l’Histoire
@ ≈ 1200-1000 av. J.-C. — Les Phéniciens mettent au point l’alphabet
@ 1822 — Champollion déchiffre les hiéroglyphes grâce à la pierre de Rosette

## Pourquoi elle est inventée
!> **Pas pour la littérature : pour compter.** Les premières tablettes sont des **comptes** — sacs de grain, têtes de bétail, dettes. L’écriture naît d’un besoin d’administration.

## Les trois systèmes
| Le système | Où | Sur quoi | Comment |
| **Cunéiforme** | Mésopotamie | Argile fraîche | Un **calame** imprime des signes en forme de coins |
| **Hiéroglyphes** | Égypte | Murs des temples, **papyrus** | Des signes de **sons** et des signes de **choses** |
| **Alphabet** | Phénicie | | Une vingtaine de signes pour les **consonnes** |

Le mot cunéiforme vient du latin *cuneus*, « coin ». Les tablettes d’argile séchée se conservent : il en subsiste des centaines de milliers.

## L’alphabet
Les Phéniciens notent les **consonnes** ; les **Grecs** y ajoutent les **voyelles**. C’est l’ancêtre direct de notre alphabet.

> Passer de plusieurs centaines de signes à une vingtaine, c’est mettre l’écriture à la portée de bien plus de gens.

## Les scribes
Écrire est un **métier**, et une position sociale élevée. Le scribe, longuement formé, tient les comptes, rédige les lois et les contrats.

> Dans ces sociétés, savoir écrire, c’est détenir un pouvoir.`,
          },
          questions: [
            ['Vers quelle date l’écriture apparaît-elle ?', ['Vers 3300 av. J.-C.', 'Vers 10 000 av. J.-C.', 'Vers 1200 av. J.-C.', 'Vers 500 apr. J.-C.'], 0, 'En Mésopotamie.'],
            ['Quel événement marque le passage de la Préhistoire à l’Histoire ?', ['L’invention de l’écriture', 'L’invention de l’agriculture', 'La maîtrise du feu', 'La naissance des villes'], 0, 'Les sociétés laissent alors des textes.'],
            ['Pourquoi l’écriture a-t-elle été inventée ?', ['Pour tenir des comptes et administrer', 'Pour écrire des poèmes', 'Pour écrire des lois religieuses', 'Pour envoyer des lettres'], 0, 'Les premières tablettes sont des comptes.'],
            ['Sur quel support écrit-on le cunéiforme ?', ['Sur des tablettes d’argile', 'Sur du papyrus', 'Sur du parchemin', 'Sur de la pierre uniquement'], 0, 'Avec un calame, un roseau taillé.'],
            ['Qui a déchiffré les hiéroglyphes, et quand ?', ['Champollion, en 1822', 'Hammurabi, en 1750 av. J.-C.', 'Hérodote, au Ve siècle av. J.-C.', 'Sargon, en 2300 av. J.-C.'], 0, 'Grâce à la pierre de Rosette.'],
            ['Quel peuple met au point le premier alphabet ?', ['Les Phéniciens', 'Les Égyptiens', 'Les Grecs', 'Les Romains'], 0, 'Les Grecs y ajouteront les voyelles.'],
            ['Quel est l’avantage de l’alphabet sur le cunéiforme ?', ['Une vingtaine de signes au lieu de plusieurs centaines', 'Il est plus beau', 'Il s’écrit plus vite sur l’argile', 'Il note davantage de mots'], 0, 'Il met l’écriture à la portée de bien plus de gens.'],
            ['Dans ces sociétés, savoir écrire était courant.', ['Vrai', 'Faux'], 1, 'C’était le métier des scribes, une position sociale élevée.'],
          ],
        },

        // --- Thème 2 : Récits fondateurs, croyances et citoyenneté ---
        {
          titre: 'Le monde des cités grecques',
          axe: 'Récits fondateurs, croyances et citoyenneté dans la Méditerranée antique au Ier millénaire avant J.-C.',
          lecon: {
            titre: 'Un monde morcelé, une culture commune',
            cours: `La Grèce antique n’est pas un pays : c’est une poussière de cités indépendantes, qui se font la guerre tout en se sachant grecques.

## Un espace fragmenté
Chaque **cité** — *polis* — a ses lois, sa monnaie, son armée et ses dieux protecteurs. Le relief montagneux et les îles y sont pour beaucoup.

## Ce qu’est une cité
| Sa partie | Ce qu’on y trouve |
| L’**acropole** | La « ville haute » : les temples |
| L’**agora** | La place publique : marché et lieu de débat |
| Le **territoire** rural | Il nourrit la ville |
| La **communauté de citoyens** | Elle fait la cité |

Athènes, Sparte, Corinthe, Thèbes en sont les plus connues.

## Ce qui les unit malgré tout
| Le lien | Le détail |
| Une **langue** commune | |
| Une **religion** commune | Les dieux de l’**Olympe** |
| Des **récits fondateurs** | L’*Iliade* et l’*Odyssée*, attribuées à **Homère** (VIIIe siècle av. J.-C.) |
| Des **sanctuaires** communs | **Delphes** |
| Des **jeux** communs | Les **Jeux olympiques** |

@ 776 av. J.-C. — Date traditionnelle des premiers Jeux olympiques
@ VIIIe-VIe siècle av. J.-C. — Les cités fondent des colonies dans toute la Méditerranée
@ ≈ 600 av. J.-C. — Fondation de Massalia, l’actuelle Marseille

Ils s’appellent **Hellènes** et nomment **Barbares** ceux qui ne parlent pas leur langue.

## Les colonies
Manquant de terres, les cités fondent des **colonies** sur tout le pourtour méditerranéen. La cité mère et sa colonie gardent des liens religieux et commerciaux.

> Les Grecs se sont installés « comme des grenouilles autour d’une mare », écrivait Platon de cette Méditerranée.

## L’héritage
Le mot **politique** vient de *polis*. Notre vocabulaire, notre théâtre, notre philosophie et nos sciences en descendent directement.`,
          },
          questions: [
            ['Comment appelle-t-on une cité grecque ?', ['Une polis', 'Une civitas', 'Une agora', 'Une acropole'], 0, 'Le mot « politique » en vient.'],
            ['Qu’est-ce que l’agora ?', ['La place publique, marché et lieu de débat', 'Le temple principal', 'La ville haute', 'Le port'], 0, 'L’acropole est la ville haute.'],
            ['Quelles œuvres sont attribuées à Homère ?', ['L’Iliade et l’Odyssée', 'La Théogonie', 'Les Fables', 'L’Énéide'], 0, 'Ce sont les récits fondateurs communs aux Grecs.'],
            ['En quelle année la tradition situe-t-elle les premiers Jeux olympiques ?', ['776 av. J.-C.', '1200 av. J.-C.', '508 av. J.-C.', '146 av. J.-C.'], 0, 'Ils réunissaient toutes les cités.'],
            ['Comment les Grecs s’appellent-ils eux-mêmes ?', ['Les Hellènes', 'Les Barbares', 'Les Latins', 'Les Achéens seulement'], 0, 'Ils nomment Barbares ceux qui ne parlent pas leur langue.'],
            ['Quelle cité les Grecs ont-ils fondée vers 600 av. J.-C. en Gaule ?', ['Massalia (Marseille)', 'Lutèce', 'Alexandrie', 'Byzance'], 0, 'C’est une colonie de la cité de Phocée.'],
            ['Pourquoi les Grecs fondent-ils des colonies ?', ['Par manque de terres dans leurs cités', 'Pour fuir une invasion', 'Pour convertir d’autres peuples', 'Par ordre d’un roi unique'], 0, 'Elles gardent des liens avec la cité mère.'],
            ['La Grèce antique formait un État unifié.', ['Vrai', 'Faux'], 1, 'C’était une multitude de cités indépendantes.'],
          ],
        },
        {
          titre: 'La religion des Grecs',
          axe: 'Récits fondateurs, croyances et citoyenneté dans la Méditerranée antique au Ier millénaire avant J.-C.',
          lecon: {
            titre: 'Des dieux à l’image des hommes',
            cours: `Les dieux grecs ont une forme humaine, des sentiments humains, et des défauts humains. Ce qui les sépare des mortels, ce n’est pas la vertu.

## Une religion polythéiste
Les douze principaux siègent sur le mont **Olympe**.

| Le dieu | Son domaine |
| **Zeus** | Roi des dieux, le ciel |
| **Héra** | Le mariage |
| **Poséidon** | La mer |
| **Athéna** | La sagesse, la guerre juste |
| **Apollon** | Les arts, la lumière |
| **Artémis** | La chasse |
| **Arès** | La guerre |
| **Aphrodite** | L’amour |
| **Héphaïstos** | La forge |
| **Hermès** | Le messager |
| **Déméter** | L’agriculture |
| **Dionysos** | La vigne, le théâtre |

## Des dieux très humains
Ils sont **anthropomorphes** : forme humaine, sentiments humains — jalousie, colère, amour, vengeance.

!> Ils diffèrent des mortels par l’**immortalité** et la **puissance**, **non par la vertu**. Un dieu grec peut être injuste.

## Les héros
Entre dieux et hommes : **Héraclès**, **Thésée**, **Achille**, **Ulysse**. Souvent nés d’un dieu et d’une mortelle, ils accomplissent des exploits, servent de modèles et fondent des cités.

## Les pratiques
| La pratique | Ce qu’elle est |
| Le **sacrifice** | Un animal sur un autel, dont la viande est ensuite partagée |
| Les **offrandes** et **libations** | |
| Les **fêtes civiques** | À Athènes, les **Panathénées** pour Athéna |
| Les **oracles** | À **Delphes**, la Pythie rend les réponses d’Apollon |

## Le temple
!> Le temple **n’est pas** un lieu de rassemblement des fidèles : c’est la **maison du dieu**, qui abrite sa statue. Les cérémonies se déroulent **dehors**, devant l’autel.

Le **Parthénon**, sur l’acropole d’Athènes, en est le modèle.

> Religion et cité ne se séparent pas : honorer les dieux est un devoir civique autant qu’un acte de foi.

## Les jeux et le théâtre
Les **Jeux olympiques** sont une fête religieuse en l’honneur de Zeus, avec une **trêve sacrée**. Le **théâtre**, né des fêtes de **Dionysos**, est lui aussi un acte religieux et civique.`,
          },
          questions: [
            ['Où siègent les principaux dieux grecs ?', ['Sur le mont Olympe', 'À Delphes', 'Sur l’Acropole', 'Aux Enfers'], 0, 'Ils sont douze.'],
            ['Quelle déesse protège la cité d’Athènes ?', ['Athéna', 'Héra', 'Aphrodite', 'Artémis'], 0, 'Le Parthénon lui est consacré.'],
            ['Que signifie « dieux anthropomorphes » ?', ['Ils ont une forme et des sentiments humains', 'Ils sont invisibles', 'Ils sont parfaits moralement', 'Ils vivent parmi les hommes'], 0, 'Ils diffèrent par l’immortalité, pas par la vertu.'],
            ['À quoi sert un temple grec ?', ['Il abrite la statue du dieu ; les cérémonies ont lieu dehors', 'Il rassemble les fidèles à l’intérieur', 'Il sert d’école', 'Il sert de marché'], 0, 'C’est la maison du dieu.'],
            ['Qui rend les oracles à Delphes ?', ['La Pythie, au nom d’Apollon', 'Le grand prêtre de Zeus', 'Un roi', 'Un devin itinérant'], 0, 'On la consultait avant toute grande décision.'],
            ['Qu’est-ce qu’un héros dans la religion grecque ?', ['Un être entre dieux et hommes, accomplissant des exploits', 'Un prêtre', 'Un soldat courageux ordinaire', 'Un roi'], 0, 'Héraclès, Thésée, Achille, Ulysse.'],
            ['En l’honneur de quel dieu se déroulent les Jeux olympiques ?', ['Zeus', 'Apollon', 'Dionysos', 'Poséidon'], 0, 'Une trêve sacrée les accompagne.'],
            ['Le théâtre grec était une activité purement profane.', ['Vrai', 'Faux'], 1, 'Il naît des fêtes de Dionysos : c’est un acte religieux et civique.'],
          ],
        },
        {
          titre: 'La naissance de la démocratie athénienne',
          axe: 'Récits fondateurs, croyances et citoyenneté dans la Méditerranée antique au Ier millénaire avant J.-C.',
          lecon: {
            titre: 'Le pouvoir au peuple — mais lequel ?',
            cours: `Athènes invente la démocratie. Elle invente en même temps le moyen de s’en protéger — et elle en exclut les trois quarts de ses habitants.

## Le mot
= Démocratie = dêmos (le peuple) + kratos (le pouvoir)

## Les trois étapes
@ ≈ 594 av. J.-C. — Solon supprime l’esclavage pour dettes
@ 508 av. J.-C. — Clisthène réorganise la cité : l’acte de naissance de la démocratie
@ Ve siècle av. J.-C. — Périclès porte le régime à son apogée et crée le misthos

Le **misthos** est une indemnité qui permet aux plus pauvres de siéger.

## Les institutions
| L’institution | Ce qu’elle est | Son rôle |
| L’**Ecclésia** | L’assemblée de **tous** les citoyens, ≈ 40 fois par an sur la **Pnyx** | Voter les lois, la guerre, la paix |
| La **Boulè** | **500** citoyens **tirés au sort** | Préparer les débats |
| L’**Héliée** | **6 000** jurés tirés au sort | Le tribunal populaire |
| Les **stratèges** | **10** magistrats **élus** | Commander l’armée |

Périclès fut stratège quinze fois.

## Pourquoi le tirage au sort
!> Pour les Grecs, l’**élection favorise les riches** et les notables ; le **tirage au sort** réalise l’égalité entre citoyens. Seuls les postes exigeant une compétence technique — les stratèges — sont élus.

## L’ostracisme
L’assemblée peut **bannir dix ans** un citoyen jugé dangereux, en écrivant son nom sur un tesson de poterie, l’*ostrakon*.

> Athènes invente la démocratie ; elle invente en même temps le moyen de s’en protéger.

## Une démocratie très étroite
| Sur ≈ 300 000 habitants | |
| **Citoyens** | ≈ **40 000** |
| **Femmes** | Exclues |
| **Métèques** (étrangers libres) | Exclus |
| **Esclaves** | Environ la moitié de la population, exclus |

C’est une démocratie **directe** mais **réservée**.`,
          },
          questions: [
            ['Que signifie le mot « démocratie » ?', ['Le pouvoir du peuple', 'Le pouvoir des riches', 'Le pouvoir d’un seul', 'Le pouvoir des prêtres'], 0, 'De dêmos, le peuple, et kratos, le pouvoir.'],
            ['Quelle date marque l’acte de naissance de la démocratie athénienne ?', ['508 av. J.-C., les réformes de Clisthène', '594 av. J.-C.', '776 av. J.-C.', '146 av. J.-C.'], 0, 'Solon l’avait préparée, Périclès l’a portée à son apogée.'],
            ['Qu’est-ce que l’Ecclésia ?', ['L’assemblée de tous les citoyens', 'Le conseil de 500 membres', 'Le tribunal populaire', 'Le collège des stratèges'], 0, 'Elle se réunit sur la Pnyx.'],
            ['Combien de citoyens composent la Boulè ?', ['500, tirés au sort', '6 000, élus', '10, élus', '40 000'], 0, 'Elle prépare les débats de l’Ecclésia.'],
            ['Pourquoi les Athéniens préfèrent-ils le tirage au sort à l’élection ?', ['Le tirage au sort réalise l’égalité, l’élection favorise les notables', 'Il est plus rapide', 'Il coûte moins cher', 'Il était imposé par les dieux'], 0, 'Seuls les stratèges sont élus.'],
            ['Qu’est-ce que l’ostracisme ?', ['Le bannissement pour dix ans d’un citoyen jugé dangereux', 'Une amende', 'Une charge publique', 'Un impôt'], 0, 'On écrivait le nom sur un tesson de poterie.'],
            ['Qui est exclu de la citoyenneté à Athènes ?', ['Les femmes, les métèques et les esclaves', 'Seulement les esclaves', 'Seulement les étrangers', 'Personne'], 0, '40 000 citoyens sur 300 000 habitants.'],
            ['La démocratie athénienne concernait toute la population.', ['Vrai', 'Faux'], 1, 'Environ un habitant sur sept était citoyen.'],
          ],
        },
        {
          titre: 'L’organisation de la société athénienne',
          axe: 'Récits fondateurs, croyances et citoyenneté dans la Méditerranée antique au Ier millénaire avant J.-C.',
          lecon: {
            titre: 'Qui est citoyen, qui ne l’est pas',
            cours: `À Athènes, être citoyen n’est pas d’abord avoir des droits. C’est appartenir, et devoir.

## Les quatre groupes
| Le groupe | Qui | Sa situation |
| Les **citoyens** | Hommes de plus de 18 ans, nés de père citoyen | ≈ 40 000. Ils votent |
| Les **femmes** | Libres | Aucun droit politique, sous l’autorité d’un tuteur |
| Les **métèques** | Étrangers libres, souvent commerçants ou artisans | Ils paient un impôt, servent à l’armée, **jamais** citoyens |
| Les **esclaves** | Prisonniers de guerre, enfants d’esclaves, achetés | Environ **la moitié** de la population. Juridiquement des **biens** |

@ 451 av. J.-C. — Périclès exige en plus une mère fille de citoyen

!> Les esclaves travaillent aux champs, dans les maisons, dans les ateliers — et dans les terribles **mines d’argent du Laurion**, dont on ne revenait guère.

## Devenir citoyen
~ Inscrit dans son dème à 18 ans → Éphébie : deux ans de service militaire → Serment de défendre la cité

## Droits et devoirs
| Ses droits | Ses devoirs |
| Voter à l’**Ecclésia** | Servir dans l’**armée** : hoplite ou rameur |
| Être **tiré au sort** | Payer l’**impôt**, pour les plus riches |
| **Posséder** la terre | Participer aux **cultes** de la cité |
| Être **jugé par ses pairs** | La **liturgie** : financer une trière ou un chœur |

> Être citoyen, à Athènes, ce n’est pas d’abord avoir des droits : c’est appartenir et devoir.

## Les Panathénées
Cette grande fête annuelle en l’honneur d’Athéna rassemble la cité en une **procession** qui monte à l’acropole. Chaque groupe y a sa place — métèques compris.

> La fête ne rassemble pas les Athéniens : elle met en scène l’**ordre social** lui-même.

## Comparer avec aujourd’hui
| La démocratie athénienne | La nôtre |
| **Directe** : on vote soi-même les lois | **Représentative** : on élit des représentants |
| **Restreinte** : un habitant sur sept | **Universelle** |`,
          },
          questions: [
            ['Qui peut être citoyen à Athènes après 451 av. J.-C. ?', ['Un homme de plus de 18 ans né de père citoyen et de mère fille de citoyen', 'Tout homme libre', 'Tout habitant de la cité', 'Tout homme payant l’impôt'], 0, 'C’est la loi de Périclès.'],
            ['Qui sont les métèques ?', ['Des étrangers libres installés à Athènes', 'Des esclaves affranchis', 'Des citoyens pauvres', 'Des prêtres'], 0, 'Ils paient un impôt mais ne sont jamais citoyens.'],
            ['Quelle proportion de la population les esclaves représentent-ils ?', ['Environ la moitié', 'Environ un dixième', 'Environ un quart', 'Une infime minorité'], 0, 'Ils sont juridiquement des biens.'],
            ['Qu’est-ce que l’éphébie ?', ['Deux ans de service militaire pour les jeunes citoyens', 'Une fête religieuse', 'Un impôt', 'Un tribunal'], 0, 'Elle s’achève par un serment de défendre la cité.'],
            ['Quel est le statut des femmes à Athènes ?', ['Libres, mais sans droits politiques', 'Citoyennes à part entière', 'Esclaves', 'Métèques'], 0, 'Elles vivent sous l’autorité d’un tuteur.'],
            ['Qu’est-ce qu’une liturgie ?', ['L’obligation faite aux plus riches de financer une trière ou un chœur', 'Une cérémonie religieuse quotidienne', 'Un vote à l’assemblée', 'Une peine judiciaire'], 0, 'C’est un devoir civique des grandes fortunes.'],
            ['Quelle grande fête rassemble la cité en l’honneur d’Athéna ?', ['Les Panathénées', 'Les Jeux olympiques', 'Les Dionysies seules', 'L’Ecclésia'], 0, 'La procession met en scène l’ordre social.'],
            ['La démocratie athénienne était représentative, comme la nôtre.', ['Vrai', 'Faux'], 1, 'Elle était directe : les citoyens votaient eux-mêmes les lois.'],
          ],
        },
        {
          titre: 'Les origines de Rome, du mythe à l’histoire',
          axe: 'Récits fondateurs, croyances et citoyenneté dans la Méditerranée antique au Ier millénaire avant J.-C.',
          lecon: {
            titre: 'Ce que Rome raconte d’elle-même',
            cours: `Rome se raconte une naissance de dieu et de louve. Le récit ne dit pas ce qui s’est passé : il dit ce que Rome veut être.

## Le récit fondateur
@ 21 avril 753 av. J.-C. — Date légendaire de la fondation de Rome par Romulus

Romulus et son frère jumeau **Rémus**, fils du dieu **Mars**, abandonnés sur le Tibre puis allaités par une **louve**. Devenus adultes, ils fondent une ville ; ils se disputent, et Romulus tue Rémus.

## Le lien avec Troie
**Virgile**, dans l’**Énéide** (Ier siècle av. J.-C.), fait descendre les Romains d’**Énée**, prince troyen ayant fui sa ville en flammes.

!> Ces récits sont écrits **sept siècles après** les faits supposés, à une époque où Rome domine la Méditerranée et cherche à justifier cette domination.

> Un récit fondateur n’est pas un mensonge : c’est un portrait que le présent fait de son passé.

## Ce que dit l’archéologie
Les fouilles du **Palatin** montrent des cabanes de bergers dès le **VIIIe siècle av. J.-C.** : la date légendaire n’est pas absurde.

~ Des villages sur les collines → un regroupement progressif → une ville

Rome n’est alors qu’un village. Elle subit l’influence des **Étrusques**, dont elle emprunte les techniques et les insignes du pouvoir.

## Les trois périodes
@ 753-509 av. J.-C. — La Royauté : sept rois selon la tradition
@ 509-27 av. J.-C. — La République
@ 27 av. J.-C. - 476 apr. J.-C. — L’Empire, en Occident

## Confronter les sources
| La source | Ce qu’elle dit |
| Les **textes** (Tite-Live, Virgile) | Les croyances d’une époque |
| Les **traces matérielles** | Ce qui a été |

> Les deux sont des sources — mais elles ne répondent pas à la même question.`,
          },
          questions: [
            ['Quelle date la légende donne-t-elle à la fondation de Rome ?', ['753 av. J.-C.', '509 av. J.-C.', '27 av. J.-C.', '476 apr. J.-C.'], 0, 'Romulus en serait le fondateur.'],
            ['Qui aurait allaité Romulus et Rémus ?', ['Une louve', 'Une chèvre', 'Une bergère', 'Une déesse'], 0, 'Ils sont fils du dieu Mars.'],
            ['Quel héros troyen Virgile donne-t-il pour ancêtre aux Romains ?', ['Énée', 'Ulysse', 'Achille', 'Hector'], 0, 'Dans l’Énéide, au Ier siècle av. J.-C.'],
            ['Que montre l’archéologie du Palatin ?', ['Des cabanes de bergers dès le VIIIe siècle av. J.-C.', 'Une grande ville fondée d’un coup', 'Aucune trace avant le Ier siècle', 'Un camp militaire grec'], 0, 'Rome se forme progressivement.'],
            ['Quel peuple a fortement influencé les débuts de Rome ?', ['Les Étrusques', 'Les Égyptiens', 'Les Perses', 'Les Carthaginois'], 0, 'Rome leur emprunte techniques et insignes du pouvoir.'],
            ['Quelles sont les trois grandes périodes de l’histoire romaine ?', ['Royauté, République, Empire', 'Empire, République, Royauté', 'Royauté, Empire, République', 'République, Royauté, Empire'], 0, 'La République commence en 509 av. J.-C.'],
            ['Pourquoi les récits fondateurs sont-ils écrits sept siècles après les faits ?', ['Rome domine alors la Méditerranée et veut justifier cette domination', 'Les auteurs manquaient de sources', 'L’écriture n’existait pas avant', 'Par hasard'], 0, 'Le récit dit ce que Rome veut être.'],
            ['Les récits de Virgile et de Tite-Live sont des comptes rendus fidèles des faits.', ['Vrai', 'Faux'], 1, 'Ils disent les croyances de leur époque, non ce qui s’est passé.'],
          ],
        },
        {
          titre: 'La fondation de Rome selon l’archéologie',
          axe: 'Récits fondateurs, croyances et citoyenneté dans la Méditerranée antique au Ier millénaire avant J.-C.',
          lecon: {
            titre: 'Ce que les fouilles nous apprennent',
            cours: `L’archéologue ne demande pas si la légende est vraie. Il demande ce qui reste dans le sol.

## Le travail de l’archéologue
L’**archéologie** étudie les **traces matérielles** : murs, tombes, poteries, ossements, outils. Elle procède par **fouilles** méthodiques, en relevant la position exacte de chaque objet.

!> C’est le **contexte** qui donne le sens, bien plus que l’objet. Un objet trouvé hors de sa couche perd presque tout intérêt scientifique — d’où l’extrême lenteur des fouilles.

## La stratigraphie
~ Les couches profondes = les plus anciennes → les couches superficielles = les plus récentes

Lire ces couches, c’est lire une chronologie.

## Les méthodes de datation
| Le type | Comment |
| **Relative** | Par la stratigraphie, ou la comparaison des styles de poterie |
| **Absolue** | Le **carbone 14**, la **dendrochronologie** (cernes des arbres), les monnaies |

## Ce que l’on a trouvé à Rome
| Le lieu | La trouvaille |
| Le **Palatin** | Des trous de poteaux dessinant des **cabanes** du VIIIe siècle av. J.-C. |
| Le **Forum** | Une nécropole, puis un dallage : le marécage devient un espace public |
| Partout | Des importations grecques et étrusques : des **échanges** précoces |

## Ce que cela change au récit
L’archéologie ne confirme ni n’infirme Romulus : elle **déplace la question**. Rome n’est pas née d’un acte fondateur unique, mais d’un **processus**, au fil du VIIe siècle.

> L’archéologue ne demande pas « la légende est-elle vraie ? » mais « que reste-t-il dans le sol, et qu’est-ce que cela permet d’affirmer ? »

## Croiser les sources
| Les textes donnent | Les fouilles donnent |
| Des **noms**, des **intentions**, des **récits** | Des **dates**, des **objets**, des réalités matérielles |`,
          },
          questions: [
            ['Qu’étudie l’archéologie ?', ['Les traces matérielles laissées par les sociétés', 'Uniquement les textes anciens', 'Les langues anciennes', 'Les traditions orales'], 0, 'Murs, tombes, poteries, ossements, outils.'],
            ['Qu’est-ce que la stratigraphie ?', ['L’étude des couches du sol, les plus profondes étant les plus anciennes', 'La datation par le carbone 14', 'L’étude des monnaies', 'Le dessin des objets trouvés'], 0, 'Elle donne une chronologie relative.'],
            ['Pourquoi note-t-on précisément la position de chaque objet ?', ['Le contexte donne le sens, plus que l’objet lui-même', 'Pour le retrouver plus tard', 'Pour le vendre', 'Pour le nettoyer'], 0, 'Un objet hors de sa couche perd son intérêt scientifique.'],
            ['Quelle méthode date les matières organiques ?', ['Le carbone 14', 'La stratigraphie', 'La dendrochronologie des monnaies', 'La comparaison des styles'], 0, 'C’est une datation absolue.'],
            ['Qu’a-t-on trouvé sur le Palatin ?', ['Des trous de poteaux de cabanes du VIIIe siècle av. J.-C.', 'Un palais royal', 'Un temple grec', 'Rien avant le Ier siècle'], 0, 'La date légendaire n’est donc pas absurde.'],
            ['Que montrent les importations grecques et étrusques trouvées à Rome ?', ['Des échanges précoces avec d’autres peuples', 'Une conquête étrangère', 'Une famine', 'L’absence de commerce'], 0, 'Rome n’était pas isolée.'],
            ['Comment l’archéologie décrit-elle la naissance de Rome ?', ['Comme un processus de regroupement de villages', 'Comme une fondation en un seul jour', 'Comme une colonie grecque', 'Comme une invention tardive'], 0, 'Elle déplace la question plutôt que de trancher la légende.'],
            ['L’archéologie a prouvé que Romulus avait bien fondé Rome en 753 av. J.-C.', ['Vrai', 'Faux'], 1, 'Elle ne confirme ni n’infirme la légende : elle décrit un processus.'],
          ],
        },
        {
          titre: 'Citoyenneté et République romaine',
          axe: 'Récits fondateurs, croyances et citoyenneté dans la Méditerranée antique au Ier millénaire avant J.-C.',
          lecon: {
            titre: 'SPQR : le sénat et le peuple romain',
            cours: `La République romaine remplace un roi par des magistrats élus pour un an. Elle n’en devient pas égalitaire pour autant.

## La naissance de la République
@ 509 av. J.-C. — Les Romains chassent leur dernier roi et fondent la République
@ 44 av. J.-C. — Assassinat de César
@ 27 av. J.-C. — Auguste installe l’Empire

= SPQR = Senatus PopulusQue Romanus, « le Sénat et le peuple romain »

*Res publica* signifie « la chose publique » : le pouvoir n’appartient plus à un homme, mais à la communauté des citoyens.

## Les institutions
| L’institution | Ce qu’elle est | Sa faiblesse ou sa force |
| Les **comices** | Assemblées qui élisent et votent les lois | Le vote se fait par **groupes pondérés selon la richesse** |
| Les **magistrats** | Élus pour **un an**, par **deux** au moins : consuls, préteurs, questeurs, censeurs | Brièveté et collégialité empêchent la confiscation du pouvoir |
| Le **Sénat** | ≈ 300 anciens magistrats, nommés **à vie** | Officiellement consultatif, il dirige en fait |

Les deux **consuls** sont chefs de l’État et de l’armée.

## Patriciens et plébéiens
| Le groupe | Qui | Ce qu’il obtient |
| Les **patriciens** | Les grandes familles | Longtemps seuls aux magistratures |
| Les **plébéiens** | Le reste des citoyens | Des **tribuns de la plèbe**, avec droit de **veto**, puis l’accès aux magistratures |

> « Veto » signifie « je m’oppose ». Le mot est resté ; le rapport de force qui l’a imposé aussi.

## Une république très inégalitaire
!> Femmes, esclaves et étrangers sont exclus — comme à Athènes. Et **parmi les citoyens**, le système de vote favorise ouvertement les riches : la République romaine est **oligarchique**.

## La fin
~ Les conquêtes enrichissent une minorité → la crise sociale s’aggrave → les généraux s’appuient sur leurs armées → guerre civile → l’Empire`,
          },
          questions: [
            ['En quelle année la République romaine est-elle fondée ?', ['509 av. J.-C.', '753 av. J.-C.', '27 av. J.-C.', '44 av. J.-C.'], 0, 'Les Romains chassent leur dernier roi.'],
            ['Que signifie SPQR ?', ['Le Sénat et le peuple romain', 'La République romaine unie', 'Rome, reine du monde', 'Le pouvoir du peuple'], 0, 'Senatus PopulusQue Romanus.'],
            ['Combien de consuls dirigent la République chaque année ?', ['Deux', 'Un', 'Trois', 'Dix'], 0, 'La collégialité empêche la confiscation du pouvoir.'],
            ['Quelle est la durée d’une magistrature romaine ?', ['Un an', 'Cinq ans', 'À vie', 'Dix ans'], 0, 'La brièveté limite les abus.'],
            ['Qui compose le Sénat ?', ['Environ 300 anciens magistrats nommés à vie', 'Des citoyens tirés au sort', 'Les tribuns de la plèbe', 'Des représentants élus chaque année'], 0, 'Il dirige en fait la politique étrangère et les finances.'],
            ['Quel droit les tribuns de la plèbe obtiennent-ils ?', ['Le droit de veto', 'Le commandement de l’armée', 'La nomination des sénateurs', 'La levée de l’impôt'], 0, '« Veto » signifie « je m’oppose ».'],
            ['Pourquoi qualifie-t-on la République romaine d’oligarchique ?', ['Le vote par groupes pondérés donne le pouvoir réel à quelques familles', 'Elle est dirigée par un roi', 'Seuls les prêtres votent', 'Les magistrats sont tirés au sort'], 0, 'Les plus riches votent en premier et pèsent davantage.'],
            ['La République romaine accordait un vote de poids égal à chaque citoyen.', ['Vrai', 'Faux'], 1, 'Le vote se faisait par groupes pondérés selon la richesse.'],
          ],
        },
        {
          titre: 'La Bible, récits et bases du judaïsme',
          axe: 'Récits fondateurs, croyances et citoyenneté dans la Méditerranée antique au Ier millénaire avant J.-C.',
          lecon: {
            titre: 'Un livre écrit sur des siècles',
            cours: `La Bible hébraïque n’est pas un livre : c’est une bibliothèque, écrite et rassemblée sur six siècles.

## Ce qu’elle est
Une collection de textes — récits, lois, poèmes, prophéties — rédigés entre le **VIIIe et le IIe siècle av. J.-C.** Les chrétiens l’appellent **Ancien Testament**.

## Sa composition
| La partie | Son contenu |
| La **Torah** | Les cinq premiers livres, ou Pentateuque : la Loi, de la Création à la mort de Moïse |
| Les **Prophètes** | |
| Les **Écrits** | Psaumes, Proverbes, Job… |

## Les grands récits
~ La Création et le Déluge → Abraham et l’Alliance → Moïse et l’Exode → David et Salomon

| Le personnage | Ce qu’il fait |
| **Abraham** | Dieu lui promet une terre et une descendance : c’est l’**Alliance** |
| **Moïse** | Il fait sortir les Hébreux d’Égypte — l’**Exode** — et reçoit les **Dix Commandements** au Sinaï |
| **David** et **Salomon** | Rois de Jérusalem ; Salomon bâtit le **Temple** |

## Texte religieux et source historique
!> Ces récits sont des textes de **foi**, non des reportages. L’archéologie confirme certains éléments — l’existence du royaume de Juda, les destructions de Jérusalem — et n’en atteste pas d’autres, comme l’Exode tel qu’il est raconté.

> Un texte sacré est toujours une source historique — mais sur **ceux qui l’écrivent**, pas nécessairement sur ce qu’il raconte.

## Deux dates
@ 587 av. J.-C. — Nabuchodonosor prend Jérusalem, détruit le Temple et déporte : c’est l’exil à Babylone
@ 515 av. J.-C. — Retour et reconstruction du Temple

C’est **en exil** que beaucoup de textes sont mis par écrit.

## L’héritage
Le judaïsme est le premier **monothéisme** durable. Christianisme et islam s’y rattachent : les trois partagent Abraham, d’où l’expression « religions abrahamiques ».`,
          },
          questions: [
            ['Qu’est-ce que la Bible hébraïque ?', ['Une collection de textes écrits sur plusieurs siècles', 'Un livre unique écrit d’un seul jet', 'Un recueil de lois romaines', 'Un roman grec'], 0, 'Récits, lois, poèmes et prophéties.'],
            ['Comment appelle-t-on les cinq premiers livres de la Bible hébraïque ?', ['La Torah', 'Les Prophètes', 'Les Psaumes', 'L’Évangile'], 0, 'On dit aussi le Pentateuque.'],
            ['Qu’est-ce que l’Alliance dans le récit biblique ?', ['La promesse de Dieu à Abraham d’une terre et d’une descendance', 'Un traité entre deux royaumes', 'Une loi romaine', 'Un pacte entre tribus'], 0, 'Elle fonde la relation entre Dieu et son peuple.'],
            ['Qui reçoit les Dix Commandements au Sinaï ?', ['Moïse', 'Abraham', 'David', 'Salomon'], 0, 'Après la sortie d’Égypte, l’Exode.'],
            ['Que se passe-t-il en 587 av. J.-C. ?', ['Nabuchodonosor prend Jérusalem, détruit le Temple et déporte la population', 'Salomon bâtit le Temple', 'Les Hébreux sortent d’Égypte', 'Le Temple est reconstruit'], 0, 'C’est l’exil à Babylone.'],
            ['Qui a fait bâtir le premier Temple de Jérusalem ?', ['Salomon', 'David', 'Moïse', 'Abraham'], 0, 'David avait fait de Jérusalem sa capitale.'],
            ['Comment l’historien utilise-t-il la Bible ?', ['Comme une source sur les croyances de ceux qui l’ont écrite', 'Comme un reportage exact des faits', 'Il ne l’utilise pas', 'Comme un texte de loi actuel'], 0, 'L’archéologie confirme certains éléments, pas tous.'],
            ['Le judaïsme est le premier monothéisme durable de l’histoire.', ['Vrai', 'Faux'], 0, 'Le christianisme et l’islam s’y rattachent.'],
          ],
        },
        {
          titre: 'La naissance du judaïsme',
          axe: 'Récits fondateurs, croyances et citoyenneté dans la Méditerranée antique au Ier millénaire avant J.-C.',
          lecon: {
            titre: 'Croire en un seul Dieu',
            cours: `Au milieu de peuples qui honorent des dizaines de dieux, les Hébreux n’en reconnaissent qu’un — et lui interdisent toute image.

## Le monothéisme
Un **Dieu unique**, sans corps ni image. La **représentation** de Dieu est interdite. Dans le monde antique, cette position est absolument singulière.

## Le peuple et son histoire
| Le royaume | Où |
| **Israël** | Au nord |
| **Juda** | Au sud, capitale **Jérusalem** |

Le mot « juif » vient de « Juda ». Écrasés par des empires bien plus puissants — assyrien, babylonien, perse, puis romain — ils conservent leur identité par leur **religion** et leur **Livre**, plutôt que par un État.

## Les pratiques
| La pratique | Ce qu’elle est |
| Le **shabbat** | Le repos du septième jour |
| La **circoncision** | Le signe de l’Alliance |
| La ***cacherout*** | Les interdits alimentaires |
| Les **fêtes** | Pessah (la sortie d’Égypte), Yom Kippour (le Grand Pardon), Hanoucca |
| La **synagogue** | Lieu de prière et d’étude, dirigé par un **rabbin** |

## Le Temple, puis son absence
@ 587 av. J.-C. — Première destruction du Temple de Jérusalem
@ 70 apr. J.-C. — Les Romains le détruisent définitivement

Il n’en subsiste que le **Mur occidental**.

~ Privé de Temple → le judaïsme se réorganise autour de l’étude des textes et de la synagogue → il survit partout, sans territoire

> Une religion qui tient dans un livre peut voyager. C’est ce qui a permis au judaïsme de traverser vingt siècles de dispersion.

## La diaspora
La **diaspora** est la dispersion des Juifs hors de Judée : Alexandrie, Rome, puis toute l’Europe et le monde entier.

## L’héritage
Le monothéisme, une **loi morale** commune — les Dix Commandements — et un rapport à l’écrit qui fait de l’étude un acte religieux.`,
          },
          questions: [
            ['Qu’est-ce qui distingue le judaïsme dans le monde antique ?', ['La croyance en un Dieu unique, sans image', 'Le culte de nombreux dieux', 'L’absence de textes sacrés', 'Le refus de tout rite'], 0, 'La représentation de Dieu y est interdite.'],
            ['D’où vient le mot « juif » ?', ['Du royaume de Juda', 'Du royaume d’Israël', 'De Jérusalem', 'De la Judée romaine seulement'], 0, 'Jérusalem en était la capitale.'],
            ['Qu’est-ce que le shabbat ?', ['Le repos du septième jour', 'Une fête annuelle', 'Un interdit alimentaire', 'Un pèlerinage'], 0, 'C’est une pratique hebdomadaire.'],
            ['Quand le Temple de Jérusalem est-il détruit définitivement ?', ['En 70 apr. J.-C., par les Romains', 'En 587 av. J.-C.', 'En 515 av. J.-C.', 'En 132 apr. J.-C.'], 0, 'Il n’en subsiste que le Mur occidental.'],
            ['Autour de quoi le judaïsme se réorganise-t-il après la destruction du Temple ?', ['L’étude des textes et la synagogue', 'Un nouveau temple', 'Un royaume reconstitué', 'Les sacrifices'], 0, 'Cela lui permet de survivre sans territoire.'],
            ['Qu’est-ce que la diaspora ?', ['La dispersion des Juifs hors de Judée', 'Une fête religieuse', 'Un livre sacré', 'Un tribunal religieux'], 0, 'Des communautés s’installent à Alexandrie, à Rome, puis en Europe.'],
            ['Qui dirige la prière et l’étude à la synagogue ?', ['Le rabbin', 'Le grand prêtre', 'Le roi', 'Le scribe'], 0, 'La synagogue est un lieu de prière et d’étude.'],
            ['Le judaïsme a disparu avec la destruction du Temple en 70.', ['Vrai', 'Faux'], 1, 'Il s’est réorganisé autour du Livre et de la synagogue.'],
          ],
        },

        // --- Thème 3 : L'Empire romain dans le monde antique ---
        {
          titre: 'Les conquêtes et la gestion de l’Empire romain',
          axe: 'L’Empire romain dans le monde antique',
          lecon: {
            titre: 'Gouverner un monde',
            cours: `Rome passe d’une cité du Latium à la maîtrise de toute la Méditerranée, qu’elle finit par appeler « notre mer ».

## Les étapes de la conquête
@ 264-146 av. J.-C. — Les guerres puniques contre Carthage
@ 58-51 av. J.-C. — César conquiert la Gaule ; Alésia et la reddition de Vercingétorix en 52
@ 27 av. J.-C. — Octave devient Auguste : le premier empereur
@ 117 apr. J.-C. — Sous Trajan, l’Empire atteint son extension maximale, de la Bretagne à la Mésopotamie

Rome nomme la Méditerranée *Mare Nostrum*, « notre mer ».

## Le pouvoir de l’empereur
| Son titre | Ce qu’il commande |
| ***Imperator*** | L’**armée** |
| ***Pontifex maximus*** | La **religion** |
| Maître de l’État | L’**administration** et la **justice** |

Les institutions républicaines subsistent, mais **vidées de leur pouvoir réel**. Le **culte impérial** — rendre un culte à l’empereur et à Rome — devient un ciment politique.

## L’armée
| Le corps | Qui | Où |
| Les **légions** | Des **citoyens** | Aux frontières, le long du ***limes*** |
| Les **auxiliaires** | Recrutés parmi les peuples conquis | Ils obtiennent la citoyenneté après leur service |

= 300 000 à 400 000 hommes

Le *limes* est fortifié : **mur d’Hadrien** en Bretagne.

## L’administration
L’Empire est découpé en **provinces**, dirigées par des **gouverneurs** nommés. Plus de **80 000 km** de **routes**, jalonnées de bornes milliaires.

> Les routes romaines n’ont pas été construites pour les marchands : elles ont été construites pour les **légions**. Le commerce a suivi.

## La paix romaine
La *Pax Romana*, du Ier au IIe siècle, est une longue période de stabilité intérieure qui favorise le commerce, les villes et les échanges — **imposée et maintenue par la force**.`,
          },
          questions: [
            ['Comment les Romains appelaient-ils la Méditerranée ?', ['Mare Nostrum, « notre mer »', 'Mare Magnum', 'Pax Romana', 'Mare Romanum'], 0, 'Ils en maîtrisaient tout le pourtour.'],
            ['Qui est le premier empereur romain, et en quelle année ?', ['Auguste, en 27 av. J.-C.', 'César, en 44 av. J.-C.', 'Trajan, en 117', 'Romulus, en 753 av. J.-C.'], 0, 'Octave devient Auguste après la guerre civile.'],
            ['Qui César bat-il à Alésia en 52 av. J.-C. ?', ['Vercingétorix', 'Hannibal', 'Spartacus', 'Pompée'], 0, 'C’est l’achèvement de la conquête de la Gaule.'],
            ['Sous quel empereur l’Empire atteint-il son extension maximale ?', ['Trajan, en 117 apr. J.-C.', 'Auguste', 'Constantin', 'Néron'], 0, 'De la Bretagne à la Mésopotamie.'],
            ['Qu’est-ce que le limes ?', ['La frontière fortifiée de l’Empire', 'La route principale de Rome', 'Le titre de l’empereur', 'Le conseil des provinces'], 0, 'Le mur d’Hadrien en fait partie.'],
            ['Pourquoi les Romains ont-ils construit un immense réseau de routes ?', ['Pour déplacer les légions', 'Uniquement pour le commerce', 'Pour les pèlerinages', 'Pour les courses de chars'], 0, 'Le commerce en a profité ensuite.'],
            ['Qu’obtiennent les auxiliaires après leur service militaire ?', ['La citoyenneté romaine', 'Une terre en Italie', 'Le titre de sénateur', 'Une exemption d’impôt à vie'], 0, 'Ils sont recrutés parmi les peuples conquis.'],
            ['La Pax Romana était une paix librement consentie par les peuples conquis.', ['Vrai', 'Faux'], 1, 'Elle était imposée et maintenue par la force.'],
          ],
        },
        {
          titre: 'Paix romaine et romanisation dans l’Empire romain',
          axe: 'L’Empire romain dans le monde antique',
          lecon: {
            titre: 'Devenir romain sans cesser d’être soi',
            cours: `La romanisation n’est pas seulement imposée : elle est aussi adoptée, parce qu’elle ouvre des carrières.

## Ce qu’est la romanisation
La diffusion du **mode de vie** romain — langue, droit, urbanisme, religion, techniques — dans les provinces conquises.

## La ville, instrument principal
Rome bâtit partout des villes sur le même modèle.

| L’équipement | Sa fonction |
| Le **forum** | La place publique |
| Le **temple** | Le culte |
| Les **thermes** | Les bains |
| Le **théâtre**, l’**amphithéâtre**, le **cirque** | Les spectacles |
| Les **aqueducs** et les **égouts** | L’eau — le **pont du Gard** |

~ Le plan en damier : le cardo (nord-sud) → croise le decumanus (est-ouest)

En Gaule : **Lugdunum** (Lyon), **Nemausus** (Nîmes), **Arelate** (Arles).

## Le syncrétisme religieux
Rome n’impose pas ses dieux : elle les **assimile** à ceux des peuples conquis. Les divinités gauloises sont associées aux romaines ; les cultes orientaux — **Isis**, **Mithra** — se diffusent.

!> Une seule exigence : le **culte impérial**, marque de loyauté politique. C’est précisément ce point qui posera problème aux juifs et aux chrétiens.

## Le latin et le droit
Le **latin** devient la langue de l’administration et du commerce en Occident ; il donnera le français, l’espagnol, l’italien, le portugais et le roumain. Le **droit romain** structure encore nos codes.

## La citoyenneté, moteur de l’intégration
@ 212 apr. J.-C. — L’édit de Caracalla étend la citoyenneté à TOUS les hommes libres de l’Empire

> La citoyenneté est le plus puissant instrument d’adhésion dont Rome dispose : elle transforme un vaincu en participant.

## Les limites
!> La romanisation touche surtout les **villes** et les **élites**. Dans les campagnes, langues et coutumes locales se maintiennent longtemps.`,
          },
          questions: [
            ['Qu’est-ce que la romanisation ?', ['La diffusion du mode de vie romain dans les provinces', 'La conquête militaire des provinces', 'Le déplacement de Romains en province', 'L’interdiction des cultes locaux'], 0, 'Elle est imposée mais aussi adoptée.'],
            ['Comment appelle-t-on les deux axes principaux d’une ville romaine ?', ['Le cardo et le decumanus', 'Le forum et l’agora', 'Le cirque et le théâtre', 'Le limes et la via'], 0, 'Nord-sud et est-ouest, en damier.'],
            ['Quel ouvrage amenait l’eau dans les villes romaines ?', ['L’aqueduc', 'Le forum', 'Les thermes', 'Le cirque'], 0, 'Le pont du Gard en est un exemple célèbre.'],
            ['Que fait Rome des dieux des peuples conquis ?', ['Elle les assimile ou les adopte', 'Elle les interdit', 'Elle les détruit systématiquement', 'Elle les ignore totalement'], 0, 'Seule exigence : le culte impérial.'],
            ['Qu’établit l’édit de Caracalla en 212 apr. J.-C. ?', ['La citoyenneté romaine pour tous les hommes libres de l’Empire', 'La liberté religieuse totale', 'La fin de l’esclavage', 'La division de l’Empire'], 0, 'C’est l’aboutissement d’une politique d’intégration.'],
            ['Quelles langues descendent du latin ?', ['Le français, l’espagnol, l’italien, le portugais, le roumain', 'L’anglais et l’allemand', 'Le grec et le russe', 'Le basque et le breton'], 0, 'Le latin était la langue de l’administration en Occident.'],
            ['Quelle est la limite principale de la romanisation ?', ['Elle touche surtout les villes et les élites', 'Elle ne concerne que l’armée', 'Elle échoue partout', 'Elle est limitée à l’Italie'], 0, 'Les campagnes gardent longtemps leurs langues et coutumes.'],
            ['Rome imposait ses dieux et interdisait les cultes locaux.', ['Vrai', 'Faux'], 1, 'Elle les assimilait, n’exigeant que le culte impérial.'],
          ],
        },
        {
          titre: 'Les débuts du christianisme',
          axe: 'L’Empire romain dans le monde antique',
          lecon: {
            titre: 'Une naissance en Judée romaine',
            cours: `Le christianisme naît dans une petite province romaine agitée, et devient en trois siècles la religion d’un empire.

## Le contexte
@ ≈ 28-30 apr. J.-C. — Jésus de Nazareth prêche en Galilée, puis est crucifié à Jérusalem sous Ponce Pilate
@ 70-100 apr. J.-C. — Rédaction des Évangiles

Jésus, juif de Galilée, annonce le royaume de Dieu, s’adresse aux humbles, appelle à l’amour du prochain. Il est, selon ses disciples, **ressuscité** — et c’est ce message qui fonde la nouvelle religion.

## Les sources
| La source | Ce qu’elle est | Ce qu’elle prouve |
| Les **Évangiles** (Matthieu, Marc, Luc, Jean) | Des textes de **foi**, écrits des décennies après | Ce que l’on croyait |
| **Flavius Josèphe**, **Tacite**, **Suétone** | Des auteurs **non chrétiens** | Que le mouvement a existé |

> Deux types de sources, deux usages : les Évangiles disent ce que l’on croyait ; Tacite atteste que l’on y croyait.

## Pourquoi le message se diffuse vite
| Le facteur | Son effet |
| Les **routes** et la sécurité de l’Empire | On circule |
| Le **grec**, langue commune de l’Orient | On se comprend |
| L’ouverture aux **non-juifs** | Le christianisme devient universel |

**Paul de Tarse** est le principal artisan de cette diffusion.

!> L’ouverture aux non-juifs est la décision **majeure** : elle fait passer le christianisme d’un mouvement juif à une religion universelle.

## Une religion nouvelle
| Hérité du judaïsme | Propre au christianisme |
| Le **monothéisme** | La foi en **Jésus-Christ**, fils de Dieu, mort et ressuscité |
| La **Bible** | Le **baptême** remplace la circoncision |

## Les premières communautés
Urbaines, modestes, réunies dans des maisons. Elles partagent un repas — l’**eucharistie** —, pratiquent l’entraide, et se dotent de responsables : diacres, prêtres, **évêques**.`,
          },
          questions: [
            ['Où et quand Jésus de Nazareth prêche-t-il ?', ['En Judée romaine, vers 28-30 apr. J.-C.', 'À Rome, au IIe siècle', 'En Grèce, au Ier siècle av. J.-C.', 'En Égypte, vers 100 apr. J.-C.'], 0, 'La Judée est alors une province romaine.'],
            ['Sous quel gouverneur romain Jésus est-il crucifié ?', ['Ponce Pilate', 'Néron', 'Trajan', 'Caracalla'], 0, 'À Jérusalem.'],
            ['Quand les Évangiles ont-ils été écrits ?', ['Entre 70 et 100 apr. J.-C.', 'Du vivant de Jésus', 'Au IIIe siècle', 'Au Ve siècle'], 0, 'Plusieurs décennies après les faits.'],
            ['Quel apôtre a le plus contribué à diffuser le christianisme hors de Judée ?', ['Paul de Tarse', 'Pierre seulement', 'Flavius Josèphe', 'Tacite'], 0, 'Il ouvre le message aux non-juifs.'],
            ['Quelles sources non chrétiennes mentionnent les premiers chrétiens ?', ['Flavius Josèphe, Tacite et Suétone', 'Les Évangiles', 'Virgile et Tite-Live', 'Homère'], 0, 'Elles confirment l’existence du mouvement.'],
            ['Quel facteur a favorisé la diffusion du christianisme ?', ['Les routes de l’Empire et le grec comme langue commune', 'L’interdiction des autres religions', 'Le soutien immédiat des empereurs', 'L’absence de communications'], 0, 'L’ouverture aux non-juifs a été décisive.'],
            ['Quel rite marque l’entrée dans la communauté chrétienne ?', ['Le baptême', 'La circoncision', 'Le shabbat', 'Le sacrifice'], 0, 'Il remplace la circoncision du judaïsme.'],
            ['Le christianisme est né indépendamment du judaïsme.', ['Vrai', 'Faux'], 1, 'Il en hérite le monothéisme et la Bible.'],
          ],
        },
        {
          titre: 'Les chrétiens et le christianisme dans l’Empire romain',
          axe: 'L’Empire romain dans le monde antique',
          lecon: {
            titre: 'De la persécution à la religion officielle',
            cours: `En moins d’un siècle, les persécutés deviennent la religion d’État. Rome n’avait rien vu venir.

## Pourquoi les chrétiens dérangent
Rome tolère tous les cultes — à une condition : honorer l’**empereur** et les dieux de Rome.

!> Les chrétiens, monothéistes, **refusent** le culte impérial. Ce refus n’est pas lu comme une opinion religieuse mais comme un acte de **déloyauté politique**.

S’y ajoutent des rumeurs nées du secret de leurs réunions, et la méfiance envers un groupe qui se tient à l’écart des fêtes civiques.

## Les persécutions
@ 64 apr. J.-C. — Sous Néron, les chrétiens sont accusés de l’incendie de Rome
@ IIIe siècle — Persécutions générales sous Dèce
@ 303-311 — Persécution de Dioclétien, la plus violente

Elles sont **intermittentes** et souvent locales, non continues. Les chrétiens tués pour leur foi sont vénérés comme **martyrs** — le mot grec signifie « témoin ».

> Persécuter une croyance en fabrique les héros. Rome l’a expérimenté à ses dépens.

## Le tournant du IVe siècle
@ 313 — L’édit de Milan de Constantin accorde la liberté de culte à tous
@ 325 — Constantin convoque le concile de Nicée
@ 380 — L’édit de Thessalonique de Théodose fait du christianisme la religion officielle

Les cultes païens sont ensuite interdits.

## L’organisation de l’Église
| Le terme | Ce qu’il désigne |
| L’**Église** (*ekklesia*) | D’abord la **communauté** |
| Les **évêques** | Ils dirigent les communautés urbaines |
| L’évêque de **Rome** | Il acquiert une autorité particulière |
| Les **conciles** | Ils réunissent les évêques pour fixer la doctrine |

## Les traces
**Catacombes**, premières **basiliques**, sarcophages sculptés, et le poisson — *ichthus* — comme symbole discret.`,
          },
          questions: [
            ['Pourquoi les chrétiens sont-ils persécutés dans l’Empire ?', ['Ils refusent le culte impérial, lu comme une déloyauté politique', 'Ils refusent de payer l’impôt', 'Ils prennent les armes', 'Ils parlent une autre langue'], 0, 'Rome tolérait les cultes, à cette condition près.'],
            ['Quel empereur accuse les chrétiens de l’incendie de Rome en 64 ?', ['Néron', 'Dioclétien', 'Constantin', 'Théodose'], 0, 'C’est l’une des premières persécutions.'],
            ['Que signifie le mot « martyr » ?', ['Témoin', 'Victime', 'Prêtre', 'Croyant'], 0, 'Ils sont vénérés par les communautés.'],
            ['Qu’accorde l’édit de Milan en 313 ?', ['La liberté de culte à tous, chrétiens compris', 'Le statut de religion officielle au christianisme', 'L’interdiction des cultes païens', 'La citoyenneté à tous'], 0, 'Constantin en est l’auteur.'],
            ['Que fait l’édit de Thessalonique en 380 ?', ['Il fait du christianisme la religion officielle de l’Empire', 'Il autorise tous les cultes', 'Il persécute les chrétiens', 'Il divise l’Empire'], 0, 'Théodose en est l’auteur.'],
            ['Les persécutions contre les chrétiens étaient-elles continues ?', ['Non, elles étaient intermittentes et souvent locales', 'Oui, sans interruption pendant trois siècles', 'Elles n’ont jamais eu lieu', 'Elles ont duré un an'], 0, 'Elles deviennent générales au IIIe siècle.'],
            ['Quel concile Constantin convoque-t-il en 325 ?', ['Le concile de Nicée', 'Le concile de Milan', 'Le concile de Rome', 'Le concile de Thessalonique'], 0, 'Les conciles fixent la doctrine.'],
            ['Les persécutions ont fait disparaître les communautés chrétiennes.', ['Vrai', 'Faux'], 1, 'Elles ont au contraire renforcé leur cohésion.'],
          ],
        },
        {
          titre: 'La Chine des Han',
          axe: 'L’Empire romain dans le monde antique',
          lecon: {
            titre: 'L’autre empire du monde antique',
            cours: `Pendant que Rome domine la Méditerranée, un empire de taille comparable règne à l’autre bout du continent. Les deux se connaissent à peine.

## Avant les Han
@ 221 av. J.-C. — Qin Shi Huangdi unifie la Chine et prend le titre de premier empereur
@ 206 av. J.-C. - 220 apr. J.-C. — La dynastie Han
@ ≈ 105 apr. J.-C. — Invention du papier

Qin Shi Huangdi unifie l’**écriture**, les **poids et mesures**, la **monnaie**, lance la **Grande Muraille** et se fait enterrer avec une **armée de terre cuite** de plus de **8 000** statues. Sa dynastie tombe très vite.

## L’organisation
| L’élément | Ce qu’il est |
| L’empereur | Le **Fils du Ciel**, détenteur du **mandat céleste** |
| L’administration | Des **fonctionnaires lettrés** recrutés sur **concours** |
| La morale d’État | La pensée de **Confucius** : ordre social, respect des aînés, devoir |

!> Le **mandat céleste** peut se **perdre** : une catastrophe naturelle ou une révolte peut être lue comme son retrait. Le pouvoir chinois est absolu, mais jamais garanti.

> Le recrutement des fonctionnaires **sur concours** est une invention chinoise sans aucun équivalent à Rome.

## Les inventions
| L’invention | |
| Le **papier** | Vers 105 apr. J.-C. |
| La **brouette** | |
| Le **gouvernail d’étambot** | |
| Le **sismographe** | |
| La **fonte du fer**, la **boussole** | |

Ces techniques mettront des siècles à parvenir en Occident.

## La route de la soie
~ La Chine → l’Asie centrale → la Perse → la Méditerranée

| Ce qui circule | |
| Des marchandises | **Soie**, épices, verre, métaux |
| Des idées | **Religions** et **techniques** |
| Et aussi | Des **épidémies** |

> Deux empires d’une taille comparable, aux deux bouts du même continent, reliés par une route que presque personne ne parcourait en entier.

## Deux modèles à comparer
| Rome intègre par… | La Chine intègre par… |
| La **citoyenneté** et le **droit** | Une **administration lettrée** et une **morale** commune |`,
          },
          questions: [
            ['Quelles sont les dates de la dynastie Han ?', ['206 av. J.-C. - 220 apr. J.-C.', '221-206 av. J.-C.', '27 av. J.-C. - 476 apr. J.-C.', '509-27 av. J.-C.'], 0, 'Elle est contemporaine de Rome.'],
            ['Qui unifie la Chine en 221 av. J.-C. ?', ['Qin Shi Huangdi', 'Confucius', 'Un empereur Han', 'Trajan'], 0, 'Il se fait enterrer avec une armée de terre cuite.'],
            ['Comment appelle-t-on l’empereur chinois ?', ['Le Fils du Ciel', 'Le Grand Pontife', 'L’Imperator', 'Le Roi des rois'], 0, 'Il détient le mandat céleste.'],
            ['Comment les fonctionnaires chinois sont-ils recrutés ?', ['Sur concours', 'Par naissance', 'Par tirage au sort', 'Par élection'], 0, 'C’est une invention sans équivalent à Rome.'],
            ['Quelle invention majeure les Han mettent-ils au point vers 105 apr. J.-C. ?', ['Le papier', 'La poudre', 'L’imprimerie', 'Le verre'], 0, 'Elle mettra des siècles à parvenir en Occident.'],
            ['Qu’est-ce que la route de la soie ?', ['Un réseau de pistes caravanières reliant la Chine à la Méditerranée', 'Une route maritime', 'Une voie romaine', 'Un fleuve navigable'], 0, 'Y circulent marchandises, religions, techniques et épidémies.'],
            ['Quelle pensée structure l’État chinois des Han ?', ['Le confucianisme', 'Le stoïcisme', 'Le christianisme', 'Le bouddhisme uniquement'], 0, 'Ordre social, respect des aînés, devoir.'],
            ['Rome et la Chine des Han entretenaient des relations directes et régulières.', ['Vrai', 'Faux'], 1, 'Les contacts directs étaient rarissimes : chacun connaissait l’autre par ouï-dire.'],
          ],
        },
      ],
    },

    // =====================================================================
    // RAYON GÉOGRAPHIE — positions 21 → 30
    // =====================================================================
    {
      niveaux: ['6e'],
      rayon: 'geographie',
      positionDepart: 21,
      chapitres: [
        // --- Thème 1 : Habiter une métropole ---
        {
          titre: 'Les métropoles et leurs habitants',
          axe: 'Habiter une métropole',
          lecon: {
            titre: 'Vivre dans une très grande ville',
            cours: `Une métropole ne se mesure pas à ses limites sur la carte, mais à la distance que ses habitants parcourent chaque matin.

## Ce qu’est une métropole
Une grande ville qui **concentre** les fonctions de commandement — sièges d’entreprises, universités, hôpitaux, musées, aéroports, administrations — et **rayonne** bien au-delà de ses limites. Le mot vient du grec : la « ville-mère ».

## L’urbanisation du monde
@ 2007 — Pour la première fois, plus de la moitié de l’humanité vit en ville

= Aujourd’hui : près de 60 % de citadins · plus de 30 mégapoles

Une **mégapole** est une agglomération de plus de **10 millions** d’habitants : Tokyo, Delhi, Shanghai, São Paulo, Mexico, Le Caire, Lagos.

## L’organisation d’une métropole
~ Centre-ville → Quartier d’affaires → Banlieues → Périphéries

| La zone | Ce qu’on y trouve |
| Le **centre-ville** | Commerces, services, patrimoine ; souvent le plus cher |
| Le **quartier d’affaires** (CBD) | Des tours de bureaux — La Défense, Manhattan |
| Les **banlieues** | Des logements, en couronnes successives |
| Les **périphéries** | Zones commerciales, industrielles, aéroports |

L’ensemble forme une **aire urbaine**, souvent bien plus étendue que la commune-centre.

## Les mobilités quotidiennes
Les **migrations pendulaires** sont les navettes quotidiennes domicile-travail. Elles saturent les transports aux heures de pointe.

> Une métropole ne se mesure pas à ses limites administratives, mais à la distance que ses habitants parcourent chaque matin.

## Des inégalités marquées
!> Dans une même métropole coexistent des quartiers très riches et des **bidonvilles** — *favelas* à Rio, *slums* à Mumbai. Environ **un citadin sur quatre** y vit dans les pays en développement.

## Les villes mondiales
Quelques-unes commandent l’économie mondiale : **New York**, **Londres**, **Tokyo**, **Paris**, **Shanghai**.`,
          },
          questions: [
            ['Qu’est-ce qu’une métropole ?', ['Une grande ville qui concentre les fonctions de commandement', 'Une ville de plus de 10 000 habitants', 'Une capitale d’État', 'Une ville industrielle'], 0, 'Elle rayonne bien au-delà de ses limites.'],
            ['Depuis quelle année plus de la moitié de l’humanité vit-elle en ville ?', ['2007', '1950', '1990', '2020'], 0, 'La proportion approche 60 % aujourd’hui.'],
            ['Qu’est-ce qu’une mégapole ?', ['Une agglomération de plus de 10 millions d’habitants', 'Une capitale politique', 'Une ville de plus d’un million d’habitants', 'Une ville mondiale'], 0, 'On en compte plus de trente.'],
            ['Qu’est-ce que le CBD d’une métropole ?', ['Le quartier d’affaires', 'Le centre historique', 'La banlieue résidentielle', 'La zone industrielle'], 0, 'La Défense et Manhattan en sont des exemples.'],
            ['Que sont les migrations pendulaires ?', ['Les navettes quotidiennes domicile-travail', 'Les déménagements définitifs', 'Les migrations internationales', 'Les départs en vacances'], 0, 'Elles saturent les transports aux heures de pointe.'],
            ['Comment appelle-t-on les bidonvilles à Rio de Janeiro ?', ['Les favelas', 'Les slums', 'Les townships', 'Les barrios'], 0, 'On dit slums à Mumbai.'],
            ['Qu’est-ce qu’une aire urbaine ?', ['L’ensemble formé par la ville-centre et les espaces qui en dépendent', 'La commune-centre seule', 'Le centre-ville', 'La zone industrielle'], 0, 'Elle dépasse largement les limites administratives.'],
            ['Une métropole est un espace socialement homogène.', ['Vrai', 'Faux'], 1, 'Quartiers très riches et très pauvres y coexistent.'],
          ],
        },
        {
          titre: 'Les défis des métropoles',
          axe: 'Habiter une métropole',
          lecon: {
            titre: 'Trop de monde, trop vite',
            cours: `Les métropoles du Sud grandissent bien plus vite que leurs équipements. C’est de ce décalage que naissent tous leurs défis.

## Une croissance très inégale
| Les métropoles… | Leur croissance |
| Des pays **développés** | Lente, et anciennes |
| Des pays **en développement** | **Explosive** |

~ Lagos : 300 000 habitants en 1950 → plus de 15 millions aujourd’hui

## Le défi du logement
Faute de logements abordables, l’habitat auto-construit se multiplie : **bidonvilles** sans titre de propriété, souvent privés d’eau courante, d’électricité et d’égouts.

= Environ un milliard de personnes y vivent dans le monde

## Le défi des transports
| Le problème | Les réponses |
| Embouteillages, trajets démesurés, pollution | **Métro**, **tramway**, bus en site propre, **pistes cyclables**, télétravail, péages urbains |

## Le défi de l’environnement
| Le problème | Ce qu’il produit |
| La **pollution de l’air** | Des millions de décès prématurés par an |
| Les **déchets** | Collecte et traitement deviennent un problème majeur |
| L’**îlot de chaleur urbain** | Béton et asphalte stockent la chaleur : plusieurs degrés de plus qu’à la campagne |
| L’**étalement urbain** | La ville grignote terres agricoles et milieux naturels |

## Le défi des inégalités
> Une ville peut concentrer les plus grandes richesses du pays et sa plus grande pauvreté, à quelques centaines de mètres de distance.

Quartiers fermés d’un côté, bidonvilles de l’autre : la métropole rassemble sans mélanger.

## Les risques
!> Plus la densité est forte, plus le **nombre de personnes exposées** est élevé. Séismes à **Tokyo**, cyclones à **Manille**, inondations et **montée du niveau de la mer** à Jakarta, Lagos, Miami.`,
          },
          questions: [
            ['Où la croissance urbaine est-elle la plus rapide ?', ['Dans les pays en développement', 'Dans les pays développés', 'Partout au même rythme', 'Nulle part, elle ralentit'], 0, 'Lagos est passée de 300 000 à plus de 15 millions d’habitants.'],
            ['Combien de personnes vivent dans des bidonvilles dans le monde ?', ['Environ un milliard', 'Environ 100 millions', 'Environ 10 millions', 'Environ 3 milliards'], 0, 'Habitat auto-construit, sans titre de propriété.'],
            ['Qu’est-ce que l’îlot de chaleur urbain ?', ['La ville est plus chaude que la campagne voisine à cause du béton et de l’asphalte', 'Une zone industrielle', 'Un quartier chauffé collectivement', 'Un parc urbain'], 0, 'C’est un enjeu croissant avec le réchauffement.'],
            ['Qu’est-ce que l’étalement urbain ?', ['L’extension de la ville sur les terres agricoles et naturelles', 'La construction en hauteur', 'La densification du centre', 'La rénovation des quartiers'], 0, 'Il consomme des espaces non urbanisés.'],
            ['Quelle réponse apporte-t-on au défi des transports ?', ['Métro, tramway, bus en site propre et pistes cyclables', 'Élargir toutes les routes', 'Interdire la ville aux habitants', 'Supprimer les transports publics'], 0, 'Le télétravail et les péages urbains y contribuent aussi.'],
            ['Quel risque menace particulièrement Jakarta et Lagos ?', ['La montée du niveau de la mer et les inondations', 'Les éruptions volcaniques', 'Les avalanches', 'Les tempêtes de sable'], 0, 'Ce sont des métropoles littorales.'],
            ['Qu’est-ce que la ségrégation spatiale ?', ['La séparation des groupes sociaux dans des quartiers distincts', 'Le mélange des populations', 'La limitation de la hauteur des immeubles', 'La séparation des zones d’activité'], 0, 'La métropole rassemble sans mélanger.'],
            ['Dans les métropoles à croissance rapide, les équipements suivent le rythme de la population.', ['Vrai', 'Faux'], 1, 'C’est précisément ce décalage qui produit les bidonvilles.'],
          ],
        },
        {
          titre: 'Habiter la ville de demain',
          axe: 'Habiter une métropole',
          lecon: {
            titre: 'Imaginer une ville vivable',
            cours: `D’ici 2050, sept habitants sur dix vivront en ville. La question n’est plus de savoir si, mais comment.

## La ville durable
Elle cherche à concilier trois exigences.

| L’exigence | Ce qu’elle demande |
| **Environnementale** | Moins d’énergie, moins de pollution, plus de nature |
| **Sociale** | Logements accessibles, mixité, services pour tous |
| **Économique** | Des emplois et des activités sur place |

## Les pistes concrètes
| La piste | Ce qu’elle vise |
| **Densifier** plutôt que s’étaler | Préserver les terres agricoles |
| **Végétaliser** : parcs, arbres, toitures | Combattre l’îlot de chaleur |
| **Réhabiliter les friches** industrielles | Ne pas construire sur du neuf |
| **Bâtiments à énergie positive** | Produire plus qu’on ne consomme |
| La **ville du quart d’heure** | Trouver l’essentiel à 15 minutes à pied ou à vélo |
| L’**économie circulaire** | Trier, réparer, réutiliser, composter |

## Les écoquartiers
| Le quartier | Où |
| **Vauban** | Fribourg, Allemagne |
| **Hammarby** | Stockholm |
| **BedZED** | Londres |
| **Confluence** | Lyon |

Ils servent de laboratoires.

## La ville intelligente
La **smart city** utilise le numérique pour optimiser l’éclairage, la circulation, la collecte des déchets, la consommation d’eau.

!> Elle pose aussi une question de **protection des données** : tout ce qui est mesuré peut être **suivi**.

> Une ville n’est pas durable parce qu’elle est équipée de capteurs. Elle l’est parce que ses habitants peuvent y vivre bien, longtemps, sans épuiser ce qui les entoure.

## Le rôle des habitants
Les projets réussis associent les habitants dès la conception : **concertation**, budgets participatifs, jardins partagés.

> Une ville se fait **avec** ceux qui y vivent, pas seulement pour eux.`,
          },
          questions: [
            ['Quelle part de l’humanité vivra en ville en 2050 ?', ['Environ 7 sur 10', 'Environ 3 sur 10', 'Environ 5 sur 10', 'La totalité'], 0, 'La proportion est d’environ 60 % aujourd’hui.'],
            ['Quelles sont les trois exigences de la ville durable ?', ['Environnementale, sociale et économique', 'Politique, militaire et religieuse', 'Esthétique, historique et touristique', 'Technique, numérique et financière'], 0, 'Elles doivent être conciliées.'],
            ['Pourquoi densifier plutôt que s’étaler ?', ['Pour préserver les terres agricoles et naturelles', 'Pour construire moins cher', 'Pour augmenter la circulation', 'Pour réduire le nombre d’habitants'], 0, 'L’étalement urbain consomme les espaces naturels.'],
            ['Qu’est-ce que la « ville du quart d’heure » ?', ['Trouver l’essentiel à quinze minutes à pied ou à vélo', 'Une ville traversable en quinze minutes', 'Un quartier construit en quinze mois', 'Un temps de trajet maximal en voiture'], 0, 'Elle réduit les déplacements motorisés.'],
            ['Qu’est-ce qu’un écoquartier ?', ['Un quartier conçu selon les principes du développement durable', 'Un quartier réservé aux espaces verts', 'Un quartier sans habitants', 'Un quartier industriel'], 0, 'Vauban à Fribourg et Hammarby à Stockholm en sont.'],
            ['Quel intérêt présente la réhabilitation des friches industrielles ?', ['Elle évite de construire sur des terrains neufs', 'Elle coûte toujours moins cher', 'Elle augmente l’étalement urbain', 'Elle supprime les transports'], 0, 'On réutilise un espace déjà artificialisé.'],
            ['Quelle question pose la smart city ?', ['La protection des données et la surveillance', 'Le coût de l’éclairage seul', 'La hauteur des bâtiments', 'Le nombre d’habitants'], 0, 'Tout ce qui est mesuré peut être suivi.'],
            ['Une ville devient durable dès qu’elle installe des capteurs numériques.', ['Vrai', 'Faux'], 1, 'La technique ne suffit pas : ce sont les conditions de vie qui comptent.'],
          ],
        },

        // --- Thème 2 : Habiter un espace de faible densité ---
        {
          titre: 'Habiter un espace à fortes contraintes naturelles',
          axe: 'Habiter un espace de faible densité',
          lecon: {
            titre: 'Vivre là où c’est difficile',
            cours: `Les espaces de faible densité couvrent l’essentiel des terres émergées et n’abritent qu’une petite part de l’humanité. Aucun n’est vide.

## La densité
La **densité de population** est le nombre d’habitants par km². Un espace de **faible densité** en compte peu — moins de **30 hab./km²** comme ordre de grandeur.

## Les grandes contraintes
| La contrainte | Où | Ce qu’elle impose |
| Le **froid** | Sibérie, Grand Nord canadien, Groenland | Sols gelés (**permafrost**), nuit polaire, cultures impossibles |
| La **sécheresse** | Sahara, Australie centrale, Atacama | L’eau commande tout |
| L’**altitude** | Himalaya, Andes | Air raréfié, pentes fortes, isolement |
| La **forêt dense** | Amazonie, bassin du Congo | Accès difficile, sols pauvres |

## S’adapter, toujours
| La contrainte | La réponse humaine |
| Le désert | **Oasis**, puits profonds |
| La montagne | **Cultures en terrasses**, qui retiennent la terre et l’eau |
| Les ressources rares et mobiles | Le **nomadisme** pastoral : Touaregs, Mongols, Sames |
| Le gel et les inondations | Maisons **sur pilotis** ou sur pieux |

> Une contrainte n’est jamais un obstacle absolu : c’est un problème auquel une société a répondu, souvent depuis très longtemps.

## Ce qui change aujourd’hui
| Le changement | Son effet |
| Le **tourisme** | Des revenus, mais des milieux fragilisés |
| L’exploitation des **ressources** | Pétrole, minerais, bois : des transformations brutales |
| Le **changement climatique** | Fonte du permafrost, recul des glaciers, sécheresses aggravées |
| L’**exode** des jeunes | Les villages se vident |

!> Ces milieux sont frappés **les premiers** par le réchauffement, alors qu’ils y contribuent le moins.

## Contrainte ou atout
> La montagne, longtemps obstacle, est devenue une ressource touristique majeure. Un même trait change de nature selon l’époque.`,
          },
          questions: [
            ['Comment calcule-t-on la densité de population ?', ['Nombre d’habitants ÷ superficie en km²', 'Nombre d’habitants × superficie', 'Superficie ÷ nombre d’habitants', 'Nombre de logements par habitant'], 0, 'Elle s’exprime en hab./km².'],
            ['Qu’est-ce que le permafrost ?', ['Un sol gelé en permanence', 'Un vent polaire', 'Une culture de l’Arctique', 'Un type d’habitat'], 0, 'Sa fonte est un effet du changement climatique.'],
            ['Quelle technique permet de cultiver en montagne ?', ['Les cultures en terrasses', 'Les oasis', 'Les pilotis', 'Le nomadisme'], 0, 'Elles retiennent la terre et l’eau.'],
            ['Qu’est-ce qu’une oasis ?', ['Un espace cultivé grâce à un point d’eau dans un désert', 'Une forêt tropicale', 'Un village de montagne', 'Un campement nomade'], 0, 'On y pratique souvent la culture en étages.'],
            ['Quel peuple pratique le nomadisme pastoral au Sahara ?', ['Les Touaregs', 'Les Sames', 'Les Inuits', 'Les Mongols'], 0, 'Les Sames sont en Laponie, les Mongols en Asie centrale.'],
            ['Quelle contrainte caractérise l’Amazonie et le bassin du Congo ?', ['La forêt dense, difficile d’accès, aux sols pauvres', 'Le froid extrême', 'La sécheresse', 'L’altitude'], 0, 'Malgré l’abondance végétale, les sols y sont pauvres.'],
            ['Quel effet du changement climatique touche ces milieux en premier ?', ['La fonte du permafrost et le recul des glaciers', 'La hausse de la densité', 'L’urbanisation rapide', 'La disparition du tourisme'], 0, 'Les sécheresses s’aggravent également.'],
            ['Les espaces à fortes contraintes naturelles sont inhabités.', ['Vrai', 'Faux'], 1, 'Des sociétés y vivent depuis très longtemps, avec des adaptations précises.'],
          ],
        },
        {
          titre: 'Habiter un espace de grande biodiversité',
          axe: 'Habiter un espace de faible densité',
          lecon: {
            titre: 'Vivre dans un milieu à protéger',
            cours: `Certains espaces concentrent une part exceptionnelle du vivant. Ils sont peuplés, et c’est souvent ce qui les protège le mieux.

## Ce qu’est la biodiversité
La variété du vivant : des **espèces**, des **gènes** et des **milieux**.

## Les hauts lieux
| Le lieu | Ce qu’il abrite |
| L’**Amazonie** | Environ **10 %** des espèces connues sur Terre |
| La **Grande Barrière de corail** (Australie) | **1 500** espèces de poissons |
| Le bassin du **Congo**, **Bornéo** | Des forêts denses |
| **Madagascar** | **80 %** d’espèces **endémiques** — qui ne vivent nulle part ailleurs |

## Qui y habite
Peuples autochtones d’Amazonie, communautés forestières du Congo, pêcheurs des récifs. Leurs pratiques — brûlis à petite échelle, chasse réglée collectivement, pêche saisonnière — sont **compatibles** avec le maintien du milieu.

## Les menaces
| La menace | Sa cause |
| La **déforestation** | Soja, huile de palme, élevage, exploitation du bois |
| L’**orpaillage** et les mines | Ils polluent les fleuves au **mercure** |
| Le **braconnage** | Le trafic d’espèces |
| Le **réchauffement** | Il blanchit et tue les coraux |

> Un hectare de forêt tropicale abattu ne se « replante » pas : on peut remettre des arbres, pas remettre l’écosystème qui a mis des millénaires à s’installer.

## Protéger
| Le moyen | Ce qu’il fait |
| Les **parcs nationaux** et **réserves** | Ils interdisent ou encadrent |
| Le **patrimoine mondial de l’UNESCO** | Il classe et attire l’attention |
| L’**écotourisme** | Il finance la protection — à condition de rester à faible impact |
| Les **droits des peuples autochtones** | Les territoires qu’ils gèrent sont **mieux préservés que la moyenne** |

!> C’est le résultat le plus contre-intuitif du chapitre : la meilleure protection n’est pas toujours la mise sous cloche, c’est souvent la **reconnaissance de ceux qui y vivent**.

## Le dilemme
Protéger ou développer ? La réponse cherchée est le **développement durable** : permettre aux habitants de vivre correctement sans détruire ce dont ils dépendent.`,
          },
          questions: [
            ['Qu’est-ce que la biodiversité ?', ['La variété du vivant : espèces, gènes et milieux', 'Le nombre d’arbres d’une forêt', 'La densité de population', 'La surface protégée d’un pays'], 0, 'Certains espaces en concentrent une part exceptionnelle.'],
            ['Que signifie qu’une espèce est « endémique » ?', ['Elle ne vit nulle part ailleurs', 'Elle est menacée', 'Elle est très nombreuse', 'Elle a été introduite'], 0, '80 % des espèces de Madagascar le sont.'],
            ['Quelle part des espèces connues l’Amazonie abrite-t-elle ?', ['Environ 10 %', 'Environ 50 %', 'Environ 1 %', 'Environ 80 %'], 0, 'C’est un haut lieu de la biodiversité mondiale.'],
            ['Quelle est la principale cause de la déforestation tropicale ?', ['L’agriculture industrielle et l’élevage', 'Le tourisme', 'Les peuples autochtones', 'Les parcs nationaux'], 0, 'Soja, huile de palme et exploitation du bois.'],
            ['Quelle menace pèse sur les récifs coralliens ?', ['Le réchauffement, qui provoque leur blanchiment', 'Le froid', 'La déforestation', 'L’orpaillage seul'], 0, 'La Grande Barrière en souffre fortement.'],
            ['Qu’est-ce que l’écotourisme ?', ['Un tourisme à faible impact qui finance la protection du milieu', 'Un tourisme de masse', 'Un tourisme interdit aux étrangers', 'La visite de parcs urbains'], 0, 'Il fait du milieu une ressource économique.'],
            ['Quel moyen de protection se révèle particulièrement efficace ?', ['La reconnaissance des droits des peuples autochtones', 'L’interdiction totale d’accès', 'Le déplacement des habitants', 'L’exploitation encadrée du bois'], 0, 'Leurs territoires sont mieux préservés que la moyenne.'],
            ['Les espaces de grande biodiversité sont des espaces vierges de toute présence humaine.', ['Vrai', 'Faux'], 1, 'Ils sont peuplés depuis des millénaires.'],
          ],
        },
        {
          titre: 'Habiter le monde rural',
          axe: 'Habiter un espace de faible densité',
          lecon: {
            titre: 'Des campagnes qui ne se ressemblent pas',
            cours: `Toutes les campagnes ne se ressemblent pas : certaines gagnent des habitants, d’autres se vident.

## Ce qu’est un espace rural
Faible densité, paysage dominé par les champs, les prés ou les forêts, et un poids important — mais **plus jamais exclusif** — de l’**agriculture**.

## Trois visages du rural
| Le type | Ce qui s’y passe |
| Les campagnes **périurbaines** | Proches des villes, elles **gagnent** des habitants : on travaille en ville, on loge à la campagne |
| Les campagnes **agricoles productives** | Grandes cultures mécanisées, peu d’actifs, forte production — Beauce, Grand Ouest |
| Les campagnes **en déclin** | **Exode rural**, vieillissement, fermeture de l’école, du commerce, du médecin |

## Le recul de l’agriculture dans l’emploi
@ 1950 — Plus de 30 % des actifs français sont agriculteurs
@ Aujourd’hui — Moins de 2 % des actifs

!> **Et pourtant la production a fortement augmenté.** Moins d’agriculteurs ne veut pas dire moins d’agriculture : c’est l’effet de la **mécanisation** et de l’agrandissement des exploitations.

## Les difficultés
| La difficulté | Le mot qui la désigne |
| L’accès aux soins | Les **déserts médicaux** |
| L’absence de transports collectifs | La **dépendance à la voiture** |
| La connexion internet | Les zones blanches |

> Dans un espace peu dense, la distance devient une inégalité : le même service existe, mais il est à quarante minutes de route.

## Les atouts
Cadre de vie, prix du logement, espace, lien social, patrimoine, nature. Le **télétravail** a renforcé l’attractivité de certaines campagnes.

## Les nouvelles fonctions
~ Productive → résidentielle → touristique → récréative → énergétique

Les espaces ruraux produisent aussi de l’**énergie** : éolien, solaire, méthanisation.`,
          },
          questions: [
            ['Quelle part des actifs les agriculteurs représentent-ils en France aujourd’hui ?', ['Moins de 2 %', 'Environ 10 %', 'Environ 30 %', 'Environ 20 %'], 0, 'Ils étaient plus de 30 % en 1950.'],
            ['Quelles campagnes gagnent des habitants ?', ['Les campagnes périurbaines, proches des villes', 'Les campagnes de montagne isolées', 'Toutes les campagnes', 'Aucune'], 0, 'Leurs habitants travaillent souvent en ville.'],
            ['Qu’est-ce que l’exode rural ?', ['Le départ des habitants des campagnes vers les villes', 'L’arrivée de citadins à la campagne', 'Le déplacement des troupeaux', 'Le tourisme rural'], 0, 'Il touche surtout les campagnes éloignées.'],
            ['Qu’appelle-t-on un « désert médical » ?', ['Un espace où l’accès aux soins est très difficile', 'Un désert sans végétation', 'Un hôpital fermé', 'Une zone sans pharmacie uniquement'], 0, 'C’est une difficulté majeure des espaces peu denses.'],
            ['Qu’est-ce qui explique la hausse de la production agricole malgré la baisse du nombre d’agriculteurs ?', ['La mécanisation et l’agrandissement des exploitations', 'L’augmentation des surfaces cultivées seule', 'Le retour des jeunes à la terre', 'La réduction des exportations'], 0, 'La productivité a fortement augmenté.'],
            ['Quelle nouvelle fonction les espaces ruraux assurent-ils ?', ['Résidentielle, touristique et productrice d’énergie', 'Uniquement agricole', 'Uniquement industrielle', 'Aucune fonction nouvelle'], 0, 'Éolien, solaire et méthanisation s’y développent.'],
            ['Quelle contrainte pèse fortement sur les habitants des campagnes peu denses ?', ['La dépendance à la voiture', 'L’excès de transports collectifs', 'La densité trop forte', 'Le coût du logement'], 0, 'Les transports collectifs y sont rares.'],
            ['Tous les espaces ruraux perdent des habitants.', ['Vrai', 'Faux'], 1, 'Les campagnes périurbaines en gagnent.'],
          ],
        },

        // --- Thème 3 : Habiter les littoraux ---
        {
          titre: 'Habiter les littoraux',
          axe: 'Habiter les littoraux',
          lecon: {
            titre: 'La frange la plus convoitée de la planète',
            cours: `Le littoral est une ligne étroite. Six humains sur dix vivent à moins de cent kilomètres d’elle.

## Une attraction considérable
= Environ 60 % de l’humanité vit à moins de 100 km d’une côte

Ce mouvement de concentration s’appelle la **littoralisation**.

## Deux grands types de littoraux
| Le type | Ses aménagements | Ses exemples |
| **Industrialo-portuaire** | **Ports en eau profonde**, **terminaux à conteneurs**, raffineries, entrepôts — la **ZIP** | **Shanghai** (premier port mondial), Rotterdam, Singapour, Le Havre |
| **Touristique** | Hôtels, résidences, marinas, plages équipées, aéroports | Côte d’Azur, Baléares, Cancún, Bali |

= Environ 80 % des marchandises mondiales voyagent par la mer

!> Le littoral touristique crée des emplois, mais souvent **saisonniers**, et provoque une **bétonisation** du rivage.

## Les autres usages
Pêche, aquaculture, énergies marines, extraction de granulats, conservation de la nature.

> Ces usages **se concurrencent** sur un espace étroit : c’est le principal enjeu d’aménagement du littoral.

## Les fragilités
| La fragilité | Ce qu’elle produit |
| L’**érosion** du trait de côte | Aggravée par les aménagements eux-mêmes |
| Les **pollutions** | Marées noires, plastiques, rejets urbains et agricoles |
| La destruction des **milieux** | Mangroves, dunes, zones humides |
| La **montée du niveau de la mer** | Des dizaines de millions de personnes menacées |
| La **submersion** | Tempêtes et cyclones |

> Un littoral est une ligne : ce qu’on y ajoute d’un côté se retire presque toujours de l’autre.

## Protéger
Loi Littoral en France, **Conservatoire du littoral**, aires marines protégées, réensablement, restauration des dunes et des **mangroves** — ces dernières étant les meilleures protections naturelles contre les tempêtes.`,
          },
          questions: [
            ['Quelle part de l’humanité vit à moins de 100 km d’une côte ?', ['Environ 60 %', 'Environ 20 %', 'Environ 90 %', 'Environ 40 %'], 0, 'C’est le processus de littoralisation.'],
            ['Qu’est-ce qu’une ZIP ?', ['Une zone industrialo-portuaire', 'Une zone d’intérêt paysager', 'Une zone interdite à la pêche', 'Une zone d’implantation piscicole'], 0, 'Ports en eau profonde, terminaux, raffineries.'],
            ['Quel est le premier port mondial ?', ['Shanghai', 'Rotterdam', 'Le Havre', 'Singapour'], 0, 'Rotterdam est le premier port européen.'],
            ['Quelle part des marchandises mondiales voyage par la mer ?', ['Environ 80 %', 'Environ 30 %', 'Environ 50 %', 'Environ 10 %'], 0, 'Les ports sont les nœuds de la mondialisation.'],
            ['Quel est un inconvénient du littoral touristique ?', ['Des emplois saisonniers et une bétonisation du rivage', 'L’absence totale d’emplois', 'Une baisse de la population', 'La disparition des ports'], 0, 'L’aménagement transforme durablement la côte.'],
            ['Quelle menace pèse sur les littoraux du fait du changement climatique ?', ['La montée du niveau de la mer', 'Le refroidissement des eaux', 'L’assèchement des océans', 'La baisse du tourisme'], 0, 'Elle menace des dizaines de millions de personnes.'],
            ['Quel milieu protège naturellement les côtes tropicales des tempêtes ?', ['La mangrove', 'La plage de sable nue', 'Le port', 'La marina'], 0, 'Sa restauration est un moyen de protection efficace.'],
            ['Les différents usages du littoral se répartissent sans se concurrencer.', ['Vrai', 'Faux'], 1, 'Ils se disputent un espace étroit : c’est l’enjeu principal.'],
          ],
        },

        // --- Thème 4 : Le monde habité ---
        {
          titre: 'L’inégale répartition de la population mondiale',
          axe: 'Le monde habité',
          lecon: {
            titre: 'Des foyers de peuplement et des vides',
            cours: `Huit milliards d’humains, et des vides immenses. La répartition de la population n’a rien d’uniforme.

## Un monde très inégalement peuplé
= La Terre compte environ 8 milliards d’habitants

Les **terres émergées** couvrent 30 % de la planète, et l’**écoumène** — la partie habitée en permanence — n’en représente qu’une fraction.

## Les grands foyers de peuplement
| Le foyer | |
| L’**Asie du Sud** | Inde, Pakistan, Bangladesh |
| L’**Asie de l’Est** | Chine, Japon, Corées |
| L’**Europe** | |

Ces trois concentrations rassemblent **plus de la moitié** de l’humanité. S’y ajoutent des foyers secondaires : nord-est des États-Unis, golfe de Guinée, vallée du Nil, Brésil littoral, Java.

## Les vides
| Le désert humain | Ses exemples |
| **Déserts chauds** | Sahara, Arabie, Australie centrale |
| **Déserts froids** | Sibérie, Groenland, Antarctique |
| **Hautes montagnes** | Himalaya, Andes |
| **Forêts denses** | Amazonie, Congo |

## Les facteurs de la répartition
| Le facteur | Ce qu’il apporte |
| **Naturels** | Climat tempéré, eau, sols fertiles, relief accessible, proximité de la mer |
| **Historiques** | Les foyers anciens sont restés peuplés |
| **Économiques** | Villes, ports et régions industrielles attirent |

> La géographie n’explique pas tout : la vallée du Nil est peuplée depuis 5 000 ans, et c’est cette **histoire**, autant que le fleuve, qui explique sa densité d’aujourd’hui.

## Lire une carte de densité
~ Repérer les aplats de couleur → LIRE LA LÉGENDE → comparer

!> Deux cartes aux couleurs semblables peuvent utiliser des **seuils très différents**. Sans la légende, une carte de densité ne se lit pas.

## Un phénomène qui bouge
L’**urbanisation** concentre, les **migrations** déplacent, et la croissance démographique est très inégale selon les régions.`,
          },
          questions: [
            ['Combien la Terre compte-t-elle d’habitants ?', ['Environ 8 milliards', 'Environ 5 milliards', 'Environ 10 milliards', 'Environ 1 milliard'], 0, 'Ils sont très inégalement répartis.'],
            ['Qu’est-ce que l’écoumène ?', ['La partie de la Terre habitée en permanence', 'L’ensemble des terres émergées', 'Les zones urbaines', 'Les déserts humains'], 0, 'Il ne couvre qu’une fraction des terres émergées.'],
            ['Quels sont les trois grands foyers de peuplement ?', ['Asie du Sud, Asie de l’Est et Europe', 'Amérique du Nord, Europe et Afrique', 'Afrique, Asie et Océanie', 'Amérique du Sud, Europe et Asie'], 0, 'Ils rassemblent plus de la moitié de l’humanité.'],
            ['Qu’est-ce qu’un désert humain ?', ['Un espace très peu peuplé', 'Un espace sans végétation', 'Un espace sans eau', 'Un espace protégé'], 0, 'Déserts chauds et froids, hautes montagnes, forêts denses.'],
            ['Quel facteur naturel favorise le peuplement ?', ['Un climat tempéré et de l’eau disponible', 'Un relief très accidenté', 'Un froid extrême', 'Une forêt dense'], 0, 'Sols fertiles et proximité de la mer y contribuent aussi.'],
            ['Que faut-il toujours lire sur une carte de densité ?', ['La légende, car les seuils varient d’une carte à l’autre', 'Uniquement les couleurs', 'Uniquement le titre', 'Le nom des pays'], 0, 'Deux cartes semblables peuvent utiliser des seuils différents.'],
            ['Pourquoi la vallée du Nil est-elle si densément peuplée ?', ['Pour des raisons naturelles et historiques anciennes', 'Uniquement à cause du tourisme', 'À cause de l’industrie récente', 'Par hasard'], 0, 'Elle est peuplée depuis 5 000 ans.'],
            ['La population mondiale est répartie de façon à peu près régulière sur les terres émergées.', ['Vrai', 'Faux'], 1, 'La répartition est très inégale : foyers denses et déserts humains.'],
          ],
        },
        {
          titre: 'Les dynamiques de la population mondiale',
          axe: 'Le monde habité',
          lecon: {
            titre: 'Naître, mourir, partir',
            cours: `La population mondiale n’a pas explosé parce qu’on faisait plus d’enfants. Elle a explosé parce qu’on mourait moins.

## Les deux moteurs
= Accroissement naturel = natalité − mortalité

= Solde migratoire = entrées − sorties

La somme des deux donne la variation totale d’un territoire.

## Une croissance historique
@ Vers 1800 — 1 milliard d’humains
@ 1950 — 2,5 milliards
@ Aujourd’hui — 8 milliards

## La transition démographique
| Le régime | La natalité | La mortalité | La population |
| **Ancien** | Forte | Forte | Stable |
| **En transition** | Forte | **Elle chute** | Elle **explose** |
| **Moderne** | Faible | Faible | Stable, à un niveau plus élevé |

!> La clé est le **décalage** : la mortalité baisse **avant** la natalité. C’est entre les deux que la population explose — et tous les pays n’en sont pas au même stade.

> La croissance démographique n’est pas venue d’un excès de naissances, mais d’un recul de la mort. Ce n’est pas la même histoire.

## Aujourd’hui : des situations opposées
| La région | Sa situation |
| L’**Afrique subsaharienne** | Forte croissance, population très **jeune** ; elle pourrait doubler d’ici 2050 |
| L’**Europe**, le **Japon**, de plus en plus la **Chine** | Population qui **vieillit**, voire diminue. Enjeux : retraites, santé, main-d’œuvre |

## Les migrations
= Environ 280 millions de personnes vivent hors de leur pays de naissance, soit 3,5 % de l’humanité

!> **La majorité des migrations se font entre pays voisins**, et non des pays pauvres vers les pays riches. C’est l’idée reçue la plus répandue du chapitre.

## Les indicateurs
| L’indicateur | Comment il se compte |
| **Taux de natalité** et **de mortalité** | Pour 1 000 habitants |
| **Indice de fécondité** | Enfants par femme ; seuil de renouvellement : **2,1** |
| **Espérance de vie** | En années |`,
          },
          questions: [
            ['Comment calcule-t-on l’accroissement naturel ?', ['Natalité − mortalité', 'Entrées − sorties', 'Natalité + mortalité', 'Population totale ÷ superficie'], 0, 'Le solde migratoire est entrées moins sorties.'],
            ['Qu’est-ce qui explique surtout l’explosion démographique depuis 1800 ?', ['L’effondrement de la mortalité', 'Une hausse brutale de la natalité', 'Les migrations', 'L’allongement de la scolarité'], 0, 'Médecine, vaccins, eau potable, alimentation.'],
            ['Qu’est-ce que la transition démographique ?', ['Le passage d’un régime à forte natalité et mortalité à un régime à faible natalité et mortalité', 'Une migration massive', 'Le vieillissement d’une population', 'L’urbanisation'], 0, 'Entre les deux, la population explose.'],
            ['Quelle région connaît aujourd’hui la plus forte croissance démographique ?', ['L’Afrique subsaharienne', 'L’Europe', 'Le Japon', 'La Chine'], 0, 'Sa population pourrait doubler d’ici 2050.'],
            ['Quel est le seuil de renouvellement des générations ?', ['2,1 enfants par femme', '1 enfant par femme', '3 enfants par femme', '2,5 enfants par femme'], 0, 'C’est l’indice de fécondité.'],
            ['Combien de personnes vivent hors de leur pays de naissance ?', ['Environ 280 millions, soit 3,5 % de l’humanité', 'Environ 1 milliard', 'Environ 50 millions', 'Environ 20 % de l’humanité'], 0, 'C’est une part relativement faible.'],
            ['Où se font la majorité des migrations internationales ?', ['Entre pays voisins', 'Des pays pauvres vers les pays riches uniquement', 'Vers l’Europe uniquement', 'Vers l’Amérique du Nord uniquement'], 0, 'C’est l’idée reçue la plus répandue sur le sujet.'],
            ['Tous les pays du monde sont au même stade de la transition démographique.', ['Vrai', 'Faux'], 1, 'Ce décalage explique l’essentiel des différences actuelles.'],
          ],
        },
        {
          titre: 'Les différentes formes d’occupation spatiale dans le monde',
          axe: 'Le monde habité',
          lecon: {
            titre: 'Toutes les façons d’habiter la Terre',
            cours: `Habiter, en géographie, ce n’est pas seulement loger : c’est occuper, pratiquer, aménager et se représenter un espace.

## Habiter, un verbe large
~ Y dormir → y travailler → s’y déplacer → s’y divertir → y tenir

## Les grandes formes d’occupation
| L’espace | Ses caractères |
| **Urbain** | Forte densité, bâti continu, services. De la petite ville à la mégapole |
| **Périurbain** | Entre ville et campagne, maisons individuelles, emploi en ville |
| **Rural** | Faible densité, agriculture, forêts, villages |
| De **très faible densité** | Déserts, hautes montagnes, forêts denses, régions polaires |

## Les formes d’habitat
| La forme | Ce qu’elle est | Où |
| **Groupé** | Village dense autour d’une place ou d’une église | |
| **Dispersé** | Fermes isolées | Le bocage de l’Ouest français |
| **Linéaire** | Le long d’une route, d’un fleuve ou d’une côte | |

Ces formes s’expliquent par l’histoire, l’agriculture pratiquée et le relief.

## Ce qui relie ces espaces
Routes, voies ferrées, lignes aériennes, câbles numériques, réseaux électriques.

~ La ville dépend des campagnes pour se nourrir → les campagnes dépendent de la ville pour les services

> Il n’existe pas d’espace autosuffisant : la géographie est d’abord une affaire de **relations**.

## Des espaces qui se transforment
| Le mot | Ce qu’il désigne |
| **Urbanisation** | La ville gagne du terrain |
| **Périurbanisation** | Elle s’étale sur les campagnes proches |
| **Déprise** | Certains espaces se vident, les friches gagnent |
| **Métropolisation** | Les fonctions rares se concentrent dans quelques très grandes villes |

## Habiter demain
Limiter l’étalement, réduire les émissions liées aux déplacements, préserver les terres agricoles, adapter les territoires au changement climatique, et **maintenir des services accessibles à tous** — y compris là où il y a peu d’habitants.`,
          },
          questions: [
            ['Que signifie « habiter » en géographie ?', ['Occuper, pratiquer, aménager et se représenter un espace', 'Uniquement y avoir son logement', 'Y être né', 'Y travailler seulement'], 0, 'Le verbe est bien plus large que « loger ».'],
            ['Qu’est-ce que l’espace périurbain ?', ['Un espace entre ville et campagne, dépendant de la ville pour l’emploi', 'Le centre-ville', 'Une zone industrielle', 'Un espace de très faible densité'], 0, 'Il est marqué par les maisons individuelles.'],
            ['Qu’est-ce qu’un habitat dispersé ?', ['Des fermes isolées les unes des autres', 'Un village dense autour d’une place', 'Des maisons le long d’une route', 'Un quartier de tours'], 0, 'Le bocage de l’Ouest français en est un exemple.'],
            ['Qu’est-ce qu’un habitat linéaire ?', ['Un habitat installé le long d’une route, d’un fleuve ou d’une côte', 'Un habitat groupé autour d’une église', 'Des fermes isolées', 'Un habitat en hauteur'], 0, 'La forme suit un axe.'],
            ['Qu’est-ce que la métropolisation ?', ['La concentration des fonctions rares dans quelques très grandes villes', 'L’étalement de la ville sur les campagnes', 'Le vidage des campagnes', 'La construction de métros'], 0, 'Elle renforce le poids des métropoles.'],
            ['Qu’est-ce que la périurbanisation ?', ['L’étalement de la ville sur les campagnes proches', 'La densification du centre-ville', 'L’abandon des campagnes', 'La création de parcs urbains'], 0, 'Elle consomme des terres agricoles.'],
            ['Qu’est-ce qui relie les différents types d’espaces ?', ['Des réseaux : routes, voies ferrées, câbles, électricité', 'Rien, ils sont indépendants', 'Uniquement les frontières', 'Seulement les fleuves'], 0, 'Aucun espace n’est autosuffisant.'],
            ['Un espace rural peut vivre en autosuffisance totale, sans lien avec la ville.', ['Vrai', 'Faux'], 1, 'Il en dépend pour les services, comme la ville dépend de lui pour l’alimentation.'],
          ],
        },
      ],
    },
  ],
}
