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
            cours: `## Le temps très long
L’histoire de l’humanité commence il y a environ **3 millions d’années**, en **Afrique**. C’est le **Paléolithique**, la période la plus longue de toutes : elle représente plus de **99 %** du temps de l’humanité.

## Les premiers représentants du genre *Homo*
- ***Homo habilis*** (≈ 2,5 millions d’années) : les premiers outils taillés.
- ***Homo erectus*** (≈ 1,9 million d’années) : la maîtrise du **feu**, les premières sorties d’Afrique.
- ***Homo neanderthalensis*** : en Europe, disparu il y a environ 40 000 ans.
- ***Homo sapiens*** (≈ 300 000 ans) : notre espèce, née en Afrique elle aussi.

## Ce qui caractérise ces sociétés
Les humains du Paléolithique sont **chasseurs-cueilleurs** et **nomades** : ils se déplacent au rythme du gibier et des saisons. Ils vivent en petits groupes, dans des abris sous roche ou des campements.

## Les grandes acquisitions
- La **bipédie**, qui libère les mains ;
- l’**outil** taillé, d’abord le galet aménagé puis le biface ;
- le **feu**, qui protège, chauffe, éclaire et permet de cuire ;
- le **langage** et, plus tard, l’**art**.

## L’art pariétal
Les peintures de **Lascaux** (≈ 18 000 ans) et de **Chauvet** (≈ 36 000 ans) montrent des animaux d’un réalisme saisissant. Elles prouvent une pensée **symbolique** : ces humains ne se contentaient pas de survivre, ils représentaient le monde.

> Une main peinte sur une paroi il y a 30 000 ans est un message : « j’étais là ».

## Comment on le sait
L’historien travaille sur des **traces** : outils, ossements, foyers, peintures. L’**archéologie** les met au jour, et des méthodes de datation (dont le **carbone 14**) leur donnent un âge.`,
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
            cours: `## Le grand départ
Depuis l’Afrique, les humains ont peu à peu **peuplé toute la planète**. *Homo erectus* sort le premier ; *Homo sapiens* suit, à partir d’environ **100 000 à 60 000 ans**.

## Les grandes étapes
- **Proche-Orient**, puis **Asie** ;
- **Europe** : vers 45 000 ans ;
- **Australie** : vers 50 000 ans, franchissant des bras de mer — donc en **navigant** ;
- **Amérique** : vers 15 000 à 20 000 ans, par le **détroit de Béring**, alors émergé du fait de la baisse du niveau des mers pendant la glaciation.

## Pourquoi partir ?
- la recherche de **gibier** et de ressources ;
- les **variations du climat**, qui rendent des régions vivables ou invivables ;
- l’**augmentation** lente des groupes humains.
Ces déplacements se comptent en **millénaires** : ce ne sont pas des voyages, mais des glissements de génération en génération.

## S’adapter à chaque milieu
Chaque environnement impose ses solutions : vêtements cousus et lampes à graisse dans le froid, habitats légers sous les tropiques, techniques de pêche sur les côtes. L’**adaptation technique** est la marque de l’espèce.

> L’humain n’est pas fait pour un milieu : il fabrique de quoi vivre dans tous.

## Ce que la génétique a confirmé
L’étude de l’**ADN** des populations actuelles confirme le scénario africain et retrace les routes du peuplement. Elle établit aussi que les différences génétiques entre groupes humains sont **très faibles** : l’humanité forme une seule espèce, sans races biologiques.

## Migrer, hier et aujourd’hui
Se déplacer est constitutif de l’histoire humaine. Les causes — climat, ressources, sécurité — n’ont pas fondamentalement changé.`,
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
            cours: `## Le basculement
Vers **10 000 av. J.-C.**, au **Proche-Orient**, dans la région du **Croissant fertile**, des groupes humains cessent de seulement prélever ce que la nature offre : ils se mettent à **produire** leur nourriture. C’est la **révolution néolithique**, le changement le plus profond de toute l’histoire humaine.

## Les deux inventions
- L’**agriculture** : on sème et on récolte (blé, orge, lentilles).
- L’**élevage** : on domestique des animaux (chèvre, mouton, bœuf, porc).
On sélectionne, de génération en génération, les plantes et les bêtes les plus utiles : c’est la **domestication**.

## La sédentarisation
Produire sa nourriture oblige à **rester sur place** pour surveiller les champs et les troupeaux. Naissent les premiers **villages** permanents, faits de maisons en terre, avec des greniers.

## Les conséquences en chaîne
- des **surplus** agricoles, donc des réserves ;
- une **population** qui augmente fortement ;
- une **spécialisation** des tâches : tous ne cultivent plus, certains deviennent potiers, tisserands, forgerons ;
- des **inégalités** : ce qui se stocke peut s’accumuler, donc se posséder inégalement ;
- de nouvelles techniques : **poterie**, **tissage**, pierre **polie**, plus tard les **métaux**.

> Tant qu’on ne stocke rien, il n’y a rien à posséder. Le grenier est aussi la naissance de la richesse — et de l’inégalité.

## La diffusion
Le Néolithique gagne l’Europe entre 7000 et 3000 av. J.-C. Il apparaît aussi **indépendamment** en Chine, en Afrique et en Amérique : plusieurs foyers, sans contact entre eux.

## Les monuments
**Dolmens**, **menhirs** et **cromlechs** (Carnac, Stonehenge) témoignent de sociétés capables d’organiser des chantiers collectifs considérables.`,
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
            cours: `## Naître d’un fleuve
Vers **3500-3000 av. J.-C.**, les premières **cités** et les premiers **États** apparaissent dans deux vallées fluviales : la **Mésopotamie** (entre le Tigre et l’Euphrate, l’actuel Irak) et l’**Égypte** (vallée du **Nil**).
Le fleuve donne l’**eau**, des **crues** qui fertilisent les terres, et une **voie de transport**.

## Ce qui définit un État
- un **territoire** délimité ;
- une **population** ;
- un **pouvoir** qui commande, prélève l’**impôt** et rend la justice ;
- des **lois** et des **fonctionnaires** — dont les **scribes**.

## L’irrigation, moteur du pouvoir
Creuser et entretenir des **canaux** dépasse les forces d’une famille : il faut organiser le travail de milliers de personnes. Ce besoin d’organisation collective **appelle** un pouvoir central.

## La cité mésopotamienne
Chaque cité (Ur, Uruk, Lagash) a son **roi**, son **dieu** et sa **ziggurat**, temple à degrés qui domine la ville. Les cités se font la guerre puis sont unifiées en empires — celui d’**Akkad**, puis **Babylone**.

## L’Égypte pharaonique
Le **pharaon** est un roi **divin**, maître des terres et des hommes. Vers 3100 av. J.-C., la Haute et la Basse-Égypte sont unifiées. Les **pyramides** (Gizeh, ≈ 2500 av. J.-C.) sont des tombeaux, et la mesure du pouvoir royal.

> Une pyramide ne dit pas seulement la foi dans l’au-delà : elle dit qu’un homme pouvait mobiliser des dizaines de milliers de bras pendant vingt ans.

## Une société hiérarchisée
Au sommet le roi, puis les prêtres, les scribes et les guerriers ; en bas les paysans et les artisans, largement majoritaires, et les esclaves.`,
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
            cours: `## Le Croissant fertile
C’est une bande de terres arquée, allant du golfe Persique à l’Égypte en passant par la Mésopotamie et le Levant. Ses sols et son eau en font le berceau de l’agriculture — et des premiers États.

## Trois formes politiques
- La **cité-État** : une ville et son territoire, gouvernée par un roi (Ur, Uruk, Mari). Elles rivalisent et se combattent.
- Le **royaume** : un ensemble plus large sous un même roi.
- L’**empire** : la domination d’un peuple sur de nombreux autres, souvent conquis. Akkad (Sargon, ≈ 2300 av. J.-C.), Babylone, puis l’**Assyrie**.

## Le code de Hammurabi
Vers **1750 av. J.-C.**, le roi de Babylone **Hammurabi** fait graver sur une **stèle** de pierre près de 300 articles de loi. C’est l’un des plus anciens recueils juridiques connus.
Ce qu’il apporte :
- la loi est **écrite**, donc la même pour des cas semblables ;
- elle est **publique**, exposée à la vue de tous ;
- elle prévoit des **peines** graduées — mais **différentes selon le rang social** de la victime et du coupable.

> Écrire la loi ne la rend pas égalitaire ; cela la rend **connaissable**. C’est déjà un immense progrès sur l’arbitraire.

## Le rôle des échanges
Ces États commercent sur de longues distances : bois du Liban, métaux d’Anatolie, pierres précieuses. Le commerce diffuse aussi les **techniques**, les **écritures** et les **croyances**.

## La fragilité
Aucun de ces empires ne dure : conquêtes, révoltes, sécheresses et invasions les font tomber les uns après les autres. Ce qui subsiste, ce sont les **inventions** — l’écriture, le droit, l’administration.`,
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
            cours: `## La date qui sépare tout
L’**écriture** apparaît vers **3300 av. J.-C.** en Mésopotamie. Cette invention marque, par convention, la fin de la **Préhistoire** et le début de l’**Histoire** : à partir de là, les sociétés laissent des **textes**.

## Pourquoi elle est inventée
Pas pour la littérature : pour **compter**. Les premières tablettes sont des **comptes** — sacs de grain, têtes de bétail, dettes. L’écriture naît d’un besoin d’**administration** et de mémoire économique.

## Le cunéiforme
En Mésopotamie, on écrit avec un **calame** (roseau taillé) sur de l’**argile** fraîche, en imprimant des signes en forme de coins — d’où le nom **cunéiforme** (du latin *cuneus*, coin). La tablette est ensuite séchée : c’est pourquoi il en subsiste des centaines de milliers.

## Les hiéroglyphes
En Égypte, on écrit des **hiéroglyphes** (« signes sacrés ») sur les murs des temples et sur le **papyrus**. Le système mêle des signes qui notent des **sons** et d’autres qui notent des **choses**.
Ils resteront illisibles jusqu’à ce que **Champollion** les déchiffre en **1822**, grâce à la **pierre de Rosette**, qui porte le même texte en trois écritures.

## L’alphabet
Vers **1200-1000 av. J.-C.**, les **Phéniciens** mettent au point un **alphabet** d’une vingtaine de signes notant uniquement des **consonnes**. Les Grecs y ajoutent les **voyelles**. C’est l’ancêtre direct de notre alphabet.

> Passer de plusieurs centaines de signes à une vingtaine, c’est mettre l’écriture à la portée de bien plus de gens.

## Les scribes
Écrire est un métier. Le **scribe**, longuement formé, tient les comptes, rédige les lois et les contrats. Il occupe une position sociale élevée : dans ces sociétés, savoir écrire, c’est détenir un pouvoir.`,
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
            cours: `## Un espace fragmenté
La Grèce antique n’est pas un État : c’est une poussière de **cités** indépendantes, appelées **polis**. Le relief montagneux et les îles y sont pour beaucoup. Chaque cité a ses lois, sa monnaie, son armée et ses dieux protecteurs.

## Qu’est-ce qu’une cité ?
Une cité comprend :
- une **ville**, souvent bâtie autour d’une **acropole** (la « ville haute », lieu des temples) et d’une **agora** (place publique, marché et lieu de débat) ;
- un **territoire** rural qui la nourrit ;
- une **communauté de citoyens**.
Athènes, Sparte, Corinthe, Thèbes en sont les plus connues.

## Ce qui les unit
Malgré leurs guerres, les Grecs se reconnaissent un même monde :
- une **langue** commune ;
- une **religion** commune, avec les dieux de l’**Olympe** ;
- des **récits fondateurs** partagés : l’*Iliade* et l’*Odyssée*, attribuées à **Homère** (VIIIe siècle av. J.-C.) ;
- des **sanctuaires** panhelléniques (Delphes) et des **jeux** communs — les **Jeux olympiques**, dont la tradition situe les premiers en **776 av. J.-C.**
Ils s’appellent **Hellènes** et nomment **Barbares** ceux qui ne parlent pas leur langue.

## Les colonies
Entre le VIIIe et le VIe siècle av. J.-C., manquant de terres, les cités fondent des **colonies** sur tout le pourtour méditerranéen — jusqu’à **Massalia** (Marseille), vers 600 av. J.-C. La cité mère et sa colonie gardent des liens religieux et commerciaux.

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
            cours: `## Une religion polythéiste
Les Grecs honorent de **nombreux dieux**. Les douze principaux siègent sur le mont **Olympe** :
**Zeus** (roi des dieux, le ciel), **Héra** (mariage), **Poséidon** (mer), **Athéna** (sagesse, guerre juste), **Apollon** (arts, lumière), **Artémis** (chasse), **Arès** (guerre), **Aphrodite** (amour), **Héphaïstos** (forge), **Hermès** (messager), **Déméter** (agriculture), **Hestia** ou **Dionysos** (vigne, théâtre).

## Des dieux très humains
Ils sont **anthropomorphes** : forme humaine, sentiments humains — jalousie, colère, amour, vengeance. Ils diffèrent des mortels par l’**immortalité** et la **puissance**, non par la vertu.

## Les héros
Entre dieux et hommes, les **héros** — Héraclès, Thésée, Achille, Ulysse — accomplissent des exploits. Souvent nés d’un dieu et d’une mortelle, ils servent de modèles et fondent des cités.

## Les pratiques
- Le **sacrifice** d’animaux sur un autel, dont la viande est ensuite partagée.
- Les **offrandes** et les **libations**.
- Les **processions** et les **fêtes** civiques : à Athènes, les **Panathénées** en l’honneur d’Athéna.
- Les **oracles** : à **Delphes**, la Pythie rend les réponses d’Apollon, consultées avant toute grande décision.

## Le temple
Le **temple** n’est pas un lieu de rassemblement des fidèles : c’est la **maison du dieu**, qui abrite sa statue. Les cérémonies se déroulent **dehors**, devant l’autel. Le **Parthénon**, sur l’acropole d’Athènes, en est le modèle.

> Religion et cité ne se séparent pas : honorer les dieux, c’est un devoir civique autant qu’un acte de foi.

## Les jeux et le théâtre
Les **Jeux olympiques** sont une fête religieuse en l’honneur de Zeus, avec une **trêve sacrée**. Le **théâtre**, né des fêtes de **Dionysos**, est également un acte religieux et civique.`,
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
            cours: `## Le mot
**Démocratie** vient du grec *dêmos* (le peuple) et *kratos* (le pouvoir) : le **pouvoir du peuple**. Athènes en est le premier exemple connu.

## Les étapes
- **Solon** (vers 594 av. J.-C.) supprime l’**esclavage pour dettes** et classe les citoyens selon leur richesse.
- **Clisthène** (**508 av. J.-C.**) réorganise la cité en dèmes et donne aux citoyens l’égalité devant la loi : c’est l’**acte de naissance** de la démocratie.
- **Périclès** (Ve siècle av. J.-C.) porte le régime à son apogée et instaure une **indemnité** (le *misthos*) pour que les plus pauvres puissent siéger.

## Les institutions
- L’**Ecclésia** : l’assemblée de **tous** les citoyens, réunie environ 40 fois par an sur la colline de la **Pnyx**. Elle vote les lois, la guerre, la paix.
- La **Boulè** : conseil de **500** citoyens **tirés au sort**, qui prépare les débats.
- L’**Héliée** : le tribunal populaire, 6 000 jurés tirés au sort.
- Les **stratèges** : dix magistrats **élus**, chargés de l’armée. Périclès le fut quinze fois.

## Le tirage au sort
La plupart des charges sont **tirées au sort**, et non élues : pour les Grecs, l’élection favorise les riches et les notables, tandis que le tirage au sort réalise l’**égalité** entre citoyens. Seuls les postes exigeant une compétence technique, comme les stratèges, sont élus.

## L’ostracisme
L’assemblée peut **bannir** dix ans un citoyen jugé dangereux pour la cité, en écrivant son nom sur un tesson de poterie (*ostrakon*).

> Athènes invente la démocratie ; elle invente en même temps le moyen de s’en protéger.

## Une démocratie très étroite
Sur environ **300 000** habitants, seuls **40 000** sont citoyens : les **femmes**, les **métèques** (étrangers libres) et les **esclaves** — la moitié de la population — en sont exclus. C’est une démocratie **directe** mais **réservée**.`,
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
            cours: `## Les quatre groupes
- **Les citoyens** : hommes, de plus de 18 ans, nés de **père citoyen** et, depuis Périclès (451 av. J.-C.), de **mère fille de citoyen**. Environ 40 000.
- **Les femmes** : libres, mais sans droits politiques. Elles ne votent pas, ne possèdent pas de terres en propre et vivent sous l’autorité d’un tuteur — père, puis mari.
- **Les métèques** : étrangers libres installés à Athènes, souvent commerçants ou artisans. Ils paient un impôt spécifique, servent dans l’armée, mais ne sont **jamais** citoyens.
- **Les esclaves** : environ **la moitié** de la population. Prisonniers de guerre, enfants d’esclaves ou achetés, ils sont juridiquement des **biens**. Ils travaillent aux champs, dans les maisons, dans les ateliers, et dans les terribles mines d’argent du **Laurion**.

## Devenir citoyen
Le jeune homme est inscrit dans son dème à 18 ans, puis accomplit l’**éphébie** : deux ans de service militaire au terme desquels il prête serment de défendre la cité.

## Droits et devoirs
- **Droits** : voter à l’Ecclésia, être tiré au sort, posséder la terre, être jugé par ses pairs.
- **Devoirs** : servir dans l’**armée** (hoplite ou rameur), payer l’**impôt** pour les plus riches, participer aux **cultes** de la cité.
La liturgie oblige les plus fortunés à financer une trière ou un chœur de théâtre.

> Être citoyen, à Athènes, ce n’est pas d’abord avoir des droits : c’est appartenir et devoir.

## Les Panathénées
Cette grande fête annuelle en l’honneur d’Athéna rassemble la cité en une **procession** qui monte à l’acropole. Chaque groupe y a sa place — y compris les métèques : la fête met en scène l’ordre social lui-même.

## Comparer avec aujourd’hui
La démocratie athénienne est **directe** (on vote soi-même les lois) et **restreinte**. La nôtre est **représentative** (on élit des représentants) et **universelle**. Comparer les deux, c’est mesurer ce qui a été conquis.`,
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
            cours: `## Le récit fondateur
Selon la légende, **Romulus** fonde Rome le **21 avril 753 av. J.-C.** Romulus et son frère jumeau **Rémus**, fils du dieu **Mars**, ont été abandonnés sur le Tibre puis allaités par une **louve**. Devenus adultes, ils décident de fonder une ville ; ils se disputent, et Romulus tue Rémus.

## Le lien avec Troie
**Virgile**, dans l’**Énéide** (Ier siècle av. J.-C.), fait descendre les Romains d’**Énée**, prince troyen ayant fui sa ville en flammes. Rome se rattache ainsi au prestigieux monde grec — et se donne une origine aussi ancienne.

## Pourquoi ces récits comptent
Ces mythes ne racontent pas ce qui s’est passé : ils disent ce que Rome **veut être**. Une ville née d’un dieu, protégée par les auspices, destinée à dominer. Ils sont écrits **sept siècles après** les faits supposés, à une époque où Rome domine la Méditerranée et cherche à justifier cette domination.

> Un récit fondateur n’est pas un mensonge : c’est un portrait que le présent fait de son passé.

## Ce que dit l’archéologie
Les fouilles du **Palatin** montrent des cabanes de bergers dès le **VIIIe siècle av. J.-C.** : la date légendaire n’est pas absurde. Mais Rome n’est alors qu’un village, non une ville fondée d’un coup. La ville se forme **progressivement**, par regroupement de villages sur les collines, et subit l’influence des **Étrusques**, dont elle emprunte les techniques et les insignes du pouvoir.

## Les trois périodes
- La **Royauté** (753-509 av. J.-C.) : sept rois selon la tradition ;
- la **République** (509-27 av. J.-C.) ;
- l’**Empire** (27 av. J.-C. - 476 apr. J.-C. en Occident).

## Confronter les sources
L’historien croise **textes** (Tite-Live, Virgile) et **traces matérielles**. Les premiers disent les croyances d’une époque ; les secondes disent ce qui a été. Les deux sont des sources — mais elles ne répondent pas à la même question.`,
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
            cours: `## Le travail de l’archéologue
L’**archéologie** étudie les **traces matérielles** laissées par les sociétés : murs, tombes, poteries, ossements, outils. Elle procède par **fouilles** méthodiques, en relevant précisément la position de chaque objet — car c’est le **contexte** qui donne le sens, bien plus que l’objet lui-même.

## La stratigraphie
Le sol s’accumule en **couches** successives : les plus profondes sont les plus **anciennes**. Lire ces couches, c’est lire une chronologie. Un objet trouvé hors de sa couche perd presque tout intérêt scientifique — d’où l’extrême lenteur des fouilles.

## Les méthodes de datation
- **Relative** : par la stratigraphie, ou par comparaison des styles de poterie ;
- **Absolue** : par le **carbone 14** (matières organiques), la **dendrochronologie** (cernes des arbres) ou l’étude des monnaies.

## Ce que l’on a trouvé à Rome
- Sur le **Palatin** : des trous de poteaux dessinant des **cabanes** du VIIIe siècle av. J.-C. ;
- au **Forum** : une nécropole, puis un dallage marquant le passage du marécage à un espace public ;
- des importations grecques et étrusques, preuves d’**échanges** précoces.

## Ce que cela change au récit
L’archéologie ne confirme ni n’infirme Romulus : elle **déplace la question**. Rome n’est pas née d’un acte fondateur unique, mais d’un **processus** — des villages sur des collines qui se regroupent et deviennent une ville au fil du VIIe siècle.

> L’archéologue ne demande pas « la légende est-elle vraie ? » mais « que reste-t-il dans le sol, et qu’est-ce que cela permet d’affirmer ? »

## Croiser les sources
Textes et fouilles se **complètent** : les textes donnent des noms, des intentions, des récits ; les fouilles donnent des dates, des objets, des réalités matérielles. L’histoire se construit en confrontant les deux.`,
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
            cours: `## La naissance de la République
En **509 av. J.-C.**, les Romains chassent leur dernier roi et fondent la **République** (*res publica*, « la chose publique »). Le pouvoir n’appartient plus à un homme mais à la communauté des citoyens.
La devise **SPQR** — *Senatus PopulusQue Romanus* — signifie « le Sénat et le peuple romain ».

## Les institutions
- Les **comices** : assemblées où les citoyens élisent les magistrats et votent les lois. Mais le vote se fait par **groupes**, pondérés selon la richesse : les plus riches votent en premier et pèsent bien davantage.
- Les **magistrats**, élus pour **un an** et par **deux** au moins : deux **consuls** (chefs de l’État et de l’armée), des préteurs (justice), des questeurs (finances), des censeurs. La brièveté et la collégialité empêchent la confiscation du pouvoir.
- Le **Sénat** : environ 300 anciens magistrats, nommés à vie. Officiellement consultatif, il dirige en fait la politique étrangère et les finances.

## Patriciens et plébéiens
- Les **patriciens** : les grandes familles, longtemps seules à accéder aux magistratures.
- Les **plébéiens** : le reste des citoyens. Par des révoltes successives, ils obtiennent des **tribuns de la plèbe**, qui peuvent opposer leur **veto**, puis l’accès aux magistratures.

> « Veto » signifie « je m’oppose ». Le mot est resté ; le rapport de force qui l’a imposé aussi.

## Une république très inégalitaire
Comme à Athènes, femmes, esclaves et étrangers sont exclus. Et parmi les citoyens, le système de vote favorise ouvertement les riches. La République romaine est **oligarchique** : le pouvoir réel appartient à quelques familles.

## La fin
Les conquêtes enrichissent une minorité, la crise sociale s’aggrave, les généraux s’appuient sur leurs armées. Après la guerre civile et l’assassinat de **César** (44 av. J.-C.), **Auguste** installe l’**Empire** en **27 av. J.-C.**`,
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
            cours: `## Ce qu’est la Bible hébraïque
La **Bible hébraïque** (que les chrétiens appellent **Ancien Testament**) n’est pas un livre mais une **bibliothèque** : une collection de textes — récits, lois, poèmes, prophéties — rédigés et rassemblés entre le **VIIIe et le IIe siècle av. J.-C.**

## Sa composition
- La **Torah** (les cinq premiers livres, ou Pentateuque) : la Loi, de la création à la mort de Moïse ;
- les **Prophètes** ;
- les **Écrits** (Psaumes, Proverbes, Job…).

## Les grands récits
- La **Création** et le **Déluge** ;
- **Abraham**, à qui Dieu promet une terre et une descendance : c’est l’**Alliance** ;
- **Moïse**, qui fait sortir les Hébreux d’Égypte — l’**Exode** — et reçoit les **Dix Commandements** au Sinaï ;
- **David** et **Salomon**, rois de Jérusalem ; Salomon bâtit le **Temple**.

## Texte religieux et source historique
Ces récits sont des textes de **foi**, non des reportages. L’archéologie confirme certains éléments (l’existence du royaume de Juda, les destructions de Jérusalem) et n’en atteste pas d’autres (l’Exode tel qu’il est raconté).
L’historien traite donc la Bible comme une **source** : elle renseigne avec certitude sur les **croyances** et l’**organisation** de ceux qui l’ont écrite.

> Un texte sacré est toujours une source historique — mais sur ceux qui l’écrivent, pas nécessairement sur ce qu’il raconte.

## Les événements marquants
- **587 av. J.-C.** : le roi babylonien **Nabuchodonosor** prend Jérusalem, détruit le Temple et déporte une partie de la population : c’est l’**exil à Babylone**. C’est en exil que beaucoup de textes sont mis par écrit.
- **515 av. J.-C.** : retour et reconstruction du Temple.

## L’héritage
Le judaïsme est le premier **monothéisme** durable. Le christianisme et l’islam s’y rattachent : les trois religions partagent Abraham, d’où l’expression « religions abrahamiques ».`,
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
            cours: `## Le monothéisme
Le **judaïsme** est la religion des **Hébreux**, puis des **Juifs**. Sa singularité dans le monde antique est totale : au milieu de peuples polythéistes, il affirme l’existence d’un **Dieu unique**, sans corps ni image. La **représentation** de Dieu est interdite.

## Le peuple et son histoire
Les Hébreux forment de petits royaumes au Levant : **Israël** au nord, **Juda** au sud, avec **Jérusalem** pour capitale. Le mot « juif » vient de « Juda ».
Écrasés par des empires bien plus puissants — assyrien, babylonien, perse, puis romain — ils conservent leur identité par leur **religion** et leur **Livre** plutôt que par un État.

## Les pratiques
- Le **shabbat** : le repos du septième jour ;
- la **circoncision**, signe de l’Alliance ;
- les **interdits alimentaires** (la *cacherout*) ;
- les **fêtes** : Pessah (la sortie d’Égypte), Yom Kippour (le Grand Pardon), Hanoucca ;
- la **synagogue**, lieu de prière et d’étude, dirigé par un **rabbin**.

## Le rôle du Temple, puis son absence
Le **Temple de Jérusalem** est le centre du culte. Détruit une première fois en 587 av. J.-C., reconstruit, il est **détruit définitivement par les Romains en 70 apr. J.-C.** Il n’en subsiste que le **Mur occidental**.
Privé de Temple, le judaïsme se réorganise autour de l’**étude des textes** et de la **synagogue** — ce qui lui permet de survivre partout, sans territoire.

> Une religion qui tient dans un livre peut voyager. C’est ce qui a permis au judaïsme de traverser vingt siècles de dispersion.

## La diaspora
La **diaspora** est la dispersion des Juifs hors de Judée, autour du bassin méditerranéen puis dans le monde entier. Des communautés vivent à Alexandrie, à Rome, plus tard dans toute l’Europe.

## L’héritage
Le judaïsme transmet au monde le monothéisme, une **loi morale** commune (les Dix Commandements) et un rapport à l’écrit qui fait de l’étude un acte religieux.`,
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
            cours: `## De la cité à l’Empire
En quelques siècles, Rome passe d’une petite cité du Latium à la maîtrise de tout le pourtour **méditerranéen** — qu’elle nomme *Mare Nostrum*, « notre mer ». Les guerres puniques contre **Carthage** (264-146 av. J.-C.), la conquête de la **Grèce**, puis celle de la **Gaule** par **César** (58-51 av. J.-C., victoire d’**Alésia** sur **Vercingétorix** en 52) en sont les étapes majeures.

## Le passage à l’Empire
Après la guerre civile et l’assassinat de César, son fils adoptif **Octave** devient **Auguste** en **27 av. J.-C.** : c’est le premier **empereur**. L’Empire atteint son extension maximale sous **Trajan** (117 apr. J.-C.), de la Bretagne à la Mésopotamie.

## Le pouvoir de l’empereur
Il concentre tout : chef de l’**armée** (*imperator*), chef de la **religion** (*pontifex maximus*), maître de l’**administration** et de la **justice**. Les institutions républicaines subsistent, mais vidées de leur pouvoir réel.
Le **culte impérial** — rendre un culte à l’empereur et à Rome — devient un ciment politique dans tout l’Empire.

## L’armée
Environ **300 000 à 400 000** hommes. Les **légions**, formées de citoyens, sont stationnées aux frontières le long du **limes**, fortifié (mur d’Hadrien en Bretagne). Les **auxiliaires**, recrutés parmi les peuples conquis, obtiennent la citoyenneté après leur service.

## L’administration
L’Empire est découpé en **provinces**, dirigées par des **gouverneurs** nommés. Un réseau de **routes** — plus de 80 000 km, jalonnés de bornes milliaires — permet de circuler, de commercer et surtout de déplacer les troupes.

> Les routes romaines n’ont pas été construites pour les marchands : elles ont été construites pour les légions. Le commerce a suivi.

## La paix romaine
La *Pax Romana*, du Ier au IIe siècle, est une longue période de stabilité intérieure qui favorise le commerce, les villes et les échanges culturels — imposée et maintenue par la force.`,
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
            cours: `## Ce qu’est la romanisation
La **romanisation** est la diffusion du **mode de vie** romain — langue, droit, urbanisme, religion, techniques — dans les provinces conquises. Elle n’est pas seulement imposée : elle est aussi **adoptée**, parce qu’elle ouvre des carrières et un statut.

## La ville, instrument principal
Rome bâtit partout des villes construites sur le même modèle :
- un **forum** (place publique), un **temple**, des **thermes**, un **théâtre**, un **amphithéâtre**, un **cirque** ;
- un plan en damier, autour de deux axes, le **cardo** (nord-sud) et le **decumanus** (est-ouest) ;
- des **aqueducs** amenant l’eau (le **pont du Gard**), un système d’**égouts**.
En Gaule : Lugdunum (Lyon), Nemausus (Nîmes), Arelate (Arles).

## Le syncrétisme religieux
Rome n’impose pas ses dieux : elle les **assimile** à ceux des peuples conquis, ou les adopte. Les divinités gauloises sont associées aux romaines ; les cultes orientaux (Isis, Mithra) se diffusent. La seule exigence est le **culte impérial**, marque de loyauté politique.

> Rome tolère toutes les croyances, à condition qu’elles n’empêchent pas d’honorer l’empereur. C’est ce point précis qui posera problème aux juifs et aux chrétiens.

## Le latin et le droit
Le **latin** devient la langue de l’administration et du commerce en Occident ; il donnera le français, l’espagnol, l’italien, le portugais et le roumain. Le **droit romain** structure encore nos codes juridiques.

## La citoyenneté, moteur de l’intégration
Accordée progressivement aux élites provinciales, la **citoyenneté romaine** devient un puissant instrument d’adhésion. En **212 apr. J.-C.**, l’**édit de Caracalla** l’étend à **tous les hommes libres** de l’Empire.

## Les limites
La romanisation touche surtout les **villes** et les **élites**. Dans les campagnes, langues et coutumes locales se maintiennent longtemps.`,
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
            cours: `## Le contexte
Au Ier siècle apr. J.-C., la **Judée** est une province romaine, agitée et surveillée. **Jésus de Nazareth**, juif de Galilée, y prêche vers 28-30 apr. J.-C. : il annonce le royaume de Dieu, s’adresse aux humbles, appelle à l’amour du prochain.
Condamné et **crucifié** à Jérusalem sous le gouverneur **Ponce Pilate**, il est, selon ses disciples, **ressuscité** — c’est ce message qui fonde la nouvelle religion.

## Les sources
Les **Évangiles** (Matthieu, Marc, Luc, Jean) sont écrits entre **70 et 100 apr. J.-C.**, soit plusieurs décennies après les faits. Ce sont des textes de **foi**, destinés à convaincre.
Des sources **non chrétiennes** (l’historien juif **Flavius Josèphe**, les Romains **Tacite** et **Suétone**) mentionnent Jésus et les premiers chrétiens : elles confirment l’existence du mouvement, sans en valider le contenu religieux.

> Deux types de sources, deux usages : les Évangiles disent ce que l’on croyait ; Tacite atteste que l’on y croyait.

## La diffusion
Les **apôtres**, en particulier **Paul de Tarse**, portent le message hors de Judée. Trois facteurs l’accélèrent :
- les **routes** et la sécurité de l’Empire ;
- le **grec**, langue commune de la Méditerranée orientale ;
- l’ouverture aux **non-juifs**, décision majeure qui fait passer le christianisme d’un mouvement juif à une religion universelle.

## Le christianisme, une religion nouvelle
Il hérite du judaïsme le **monothéisme** et la Bible, mais s’en distingue par la foi en **Jésus-Christ**, fils de Dieu, mort et ressuscité. Le **baptême** remplace la circoncision comme rite d’entrée.

## Les premières communautés
Elles sont d’abord urbaines, modestes, réunies dans des maisons. Elles partagent un repas (l’**eucharistie**), pratiquent l’entraide et se dotent progressivement de responsables : diacres, prêtres, **évêques**.`,
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
            cours: `## Pourquoi les chrétiens dérangent
Rome est tolérante envers les cultes — à une condition : honorer l’**empereur** et les dieux de Rome. Les chrétiens, monothéistes, **refusent** le culte impérial. Ce refus n’est pas lu comme une opinion religieuse mais comme un acte de **déloyauté politique**.
S’y ajoutent des rumeurs nées du secret de leurs réunions, et la méfiance envers un groupe qui se tient à l’écart des fêtes civiques.

## Les persécutions
Elles sont **intermittentes**, souvent locales, et non continues :
- sous **Néron** (**64 apr. J.-C.**), les chrétiens sont accusés de l’incendie de Rome ;
- au IIIe siècle, sous Dèce puis **Dioclétien** (303-311), les persécutions deviennent générales.
Les chrétiens tués pour leur foi sont vénérés comme **martyrs** — le mot grec signifie « témoin ». Loin de l’éteindre, ces persécutions renforcent la cohésion des communautés.

> Persécuter une croyance en fabrique les héros. Rome l’a expérimenté à ses dépens.

## Le tournant du IVe siècle
- **313** : l’**édit de Milan** de **Constantin** accorde la **liberté de culte** à tous, chrétiens compris. Constantin protège l’Église et convoque le concile de **Nicée** (325).
- **380** : l’**édit de Thessalonique** de **Théodose** fait du christianisme la **religion officielle** de l’Empire. Les cultes païens sont ensuite interdits.

En moins d’un siècle, les persécutés deviennent la religion d’État.

## L’organisation de l’Église
Le mot **Église** (*ekklesia*) désigne d’abord la communauté. Elle se structure : les **évêques** dirigent les communautés urbaines, l’évêque de **Rome** acquiert une autorité particulière. Les **conciles** réunissent les évêques pour fixer la doctrine.

## Les traces
**Catacombes**, premières **basiliques**, sarcophages sculptés, symboles discrets (le poisson, *ichthus*) : l’archéologie chrétienne documente cette transformation.`,
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
            cours: `## Un empire contemporain de Rome
Pendant que Rome domine la Méditerranée, la **Chine des Han** (**206 av. J.-C. - 220 apr. J.-C.**) règne sur l’Asie orientale. Les deux empires sont comparables par leur taille, leur population et leur durée — et se connaissent à peine.

## Avant les Han
En **221 av. J.-C.**, **Qin Shi Huangdi** unifie la Chine et prend le titre de premier empereur. Il unifie l’**écriture**, les **poids et mesures**, la **monnaie**, lance la construction de la **Grande Muraille** et se fait enterrer avec une **armée de terre cuite** de plus de 8 000 statues. Sa dynastie tombe très vite ; les **Han** lui succèdent.

## L’organisation
- L’empereur est le **Fils du Ciel** : il détient le **mandat céleste**, qu’il peut perdre s’il gouverne mal — une catastrophe naturelle ou une révolte peut être lue comme le retrait de ce mandat.
- L’Empire est administré par des **fonctionnaires lettrés**, recrutés sur **concours** — une invention chinoise sans équivalent à Rome.
- La pensée de **Confucius** (VIe-Ve siècle av. J.-C.), fondée sur l’ordre social, le respect des aînés et le devoir, structure l’État.

## Les inventions
Les Han inventent ou perfectionnent le **papier** (vers 105 apr. J.-C.), la brouette, le gouvernail d’étambot, le sismographe, la fonte du fer, la boussole. Ces techniques mettront des siècles à parvenir en Occident.

## La route de la soie
Un réseau de pistes caravanières relie la Chine à la Méditerranée, en passant par l’Asie centrale et la Perse. Y circulent la **soie**, les épices, le verre, les métaux — mais aussi les **religions**, les **techniques** et, malheureusement, les **épidémies**.
Les contacts directs entre Rome et la Chine restent rarissimes : chacun connaît l’autre par ouï-dire.

> Deux empires d’une taille comparable, aux deux bouts du même continent, reliés par une route que presque personne ne parcourait en entier.

## Deux modèles à comparer
Rome intègre par la **citoyenneté** et le **droit** ; la Chine par une **administration lettrée** et une **morale** commune. Deux réponses différentes à la même question : comment tenir un empire immense ?`,
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
            cours: `## Qu’est-ce qu’une métropole ?
Une **métropole** est une grande ville qui **concentre** les fonctions de commandement : sièges d’entreprises, universités, hôpitaux, musées, aéroports, administrations. Elle **rayonne** bien au-delà de ses limites.
Le mot vient du grec : la « ville-mère ».

## L’urbanisation du monde
Depuis **2007**, plus de la **moitié** de l’humanité vit en ville ; la proportion approche les **60 %** aujourd’hui. On compte plus de **30 mégapoles** — des agglomérations de plus de 10 millions d’habitants : Tokyo, Delhi, Shanghai, São Paulo, Mexico, Le Caire, Lagos.

## L’organisation d’une métropole
- Le **centre-ville** : commerces, services, patrimoine ; souvent le quartier le plus cher.
- Le **quartier d’affaires** (CBD) : tours de bureaux — La Défense à Paris, Manhattan à New York.
- Les **banlieues** : logements, en couronnes successives.
- Les **périphéries** : zones commerciales, industrielles, aéroports.
L’ensemble forme une **aire urbaine**, souvent bien plus étendue que la commune-centre.

## Les mobilités quotidiennes
Beaucoup d’habitants font la **navette** entre leur domicile et leur travail : ce sont les **migrations pendulaires**. Elles saturent les transports aux heures de pointe et façonnent la journée de millions de gens.

> Une métropole ne se mesure pas à ses limites administratives mais à la distance que ses habitants parcourent chaque matin.

## Des inégalités marquées
Dans une même métropole coexistent des quartiers très riches et des quartiers très pauvres — jusqu’aux **bidonvilles** (*favelas* à Rio, *slums* à Mumbai), où vit environ un citadin sur quatre dans les pays en développement.

## Les métropoles mondiales
Quelques-unes — New York, Londres, Tokyo, Paris, Shanghai — commandent l’économie mondiale. On parle de **villes mondiales**.`,
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
            cours: `## Une croissance très inégale
Les métropoles des pays **développés** croissent lentement et sont anciennes. Celles des pays **en développement** connaissent une croissance **explosive** : Lagos est passée de 300 000 habitants en 1950 à plus de 15 millions aujourd’hui. Les équipements ne suivent pas ce rythme.

## Le défi du logement
Le manque de logements abordables produit des **bidonvilles** : habitat auto-construit, sans titre de propriété, souvent privé d’eau courante, d’électricité et d’égouts. Environ **un milliard** de personnes y vivent dans le monde.

## Le défi des transports
Embouteillages, temps de trajet démesurés, pollution de l’air. Les réponses : **métro**, **tramway**, bus en site propre, **pistes cyclables**, télétravail, péages urbains.

## Le défi de l’environnement
- **Pollution de l’air** : responsable de millions de décès prématurés chaque année.
- **Déchets** : leur collecte et leur traitement deviennent un problème majeur.
- **Îlot de chaleur urbain** : le béton et l’asphalte stockent la chaleur, rendant la ville plusieurs degrés plus chaude que la campagne voisine — un enjeu croissant avec le réchauffement.
- **Étalement urbain** : la ville grignote les terres agricoles et les milieux naturels.

## Le défi des inégalités
Ségrégation spatiale, quartiers fermés d’un côté, bidonvilles de l’autre : la métropole rassemble sans mélanger.

> Une ville peut concentrer les plus grandes richesses du pays et sa plus grande pauvreté, à quelques centaines de mètres de distance.

## Les risques
Beaucoup de métropoles sont exposées : séismes (Tokyo), cyclones (Manille), inondations et **montée du niveau de la mer** (Jakarta, Lagos, Miami). Plus la densité est forte, plus le nombre de personnes exposées est élevé.`,
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
            cours: `## La question posée
D’ici **2050**, environ **7 habitants sur 10** vivront en ville. Comment loger, déplacer, nourrir et rafraîchir tout ce monde sans épuiser la planète ?

## La ville durable
Elle cherche à concilier trois exigences :
- **environnementale** : moins d’énergie, moins de pollution, plus de nature ;
- **sociale** : logements accessibles, mixité, services pour tous ;
- **économique** : emplois et activités sur place.

## Les pistes concrètes
- **Densifier** plutôt que s’étaler, pour préserver les terres agricoles.
- **Végétaliser** : parcs, arbres d’alignement, toitures végétales — contre l’îlot de chaleur.
- **Réhabiliter les friches** industrielles au lieu de construire sur des terrains neufs.
- **Bâtiments à énergie positive**, qui produisent plus qu’ils ne consomment.
- **Transports doux** et **ville du quart d’heure** : trouver l’essentiel à quinze minutes à pied ou à vélo de chez soi.
- **Économie circulaire** : trier, réparer, réutiliser, composter.

## Les écoquartiers
Des quartiers conçus selon ces principes existent déjà : **Vauban** à Fribourg (Allemagne), **Hammarby** à Stockholm, **BedZED** à Londres, Confluence à Lyon. Ils servent de laboratoires.

## La ville intelligente
La **smart city** utilise le numérique pour optimiser l’éclairage, la circulation, la collecte des déchets, la consommation d’eau. Elle pose aussi des questions de **protection des données** et de surveillance : tout ce qui est mesuré peut être suivi.

> Une ville n’est pas durable parce qu’elle est équipée de capteurs. Elle l’est parce que ses habitants peuvent y vivre bien, longtemps, sans épuiser ce qui les entoure.

## Le rôle des habitants
Les projets réussis associent les habitants dès la conception : **concertation**, budgets participatifs, jardins partagés. Une ville se fait avec ceux qui y vivent, pas seulement pour eux.`,
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
            cours: `## La densité
La **densité de population** est le nombre d’habitants par km². Un espace de **faible densité** en compte peu — moins de 30 hab./km² comme ordre de grandeur. Ces espaces couvrent l’essentiel des terres émergées mais n’abritent qu’une petite part de l’humanité.

## Les grandes contraintes
- Le **froid** : Sibérie, Grand Nord canadien, Groenland. Sols gelés (**permafrost**), nuit polaire, cultures impossibles.
- La **sécheresse** : Sahara, Australie centrale, Atacama. L’eau commande tout.
- L’**altitude** : Himalaya, Andes. Air raréfié, pentes fortes, isolement.
- La **forêt dense** : Amazonie, bassin du Congo. Accès difficile, sols pauvres.

## S’adapter, toujours
Aucun de ces milieux n’est vide, et les sociétés qui y vivent ont mis au point des solutions précises :
- **oasis** et puits profonds dans les déserts ; culture en étages ;
- **cultures en terrasses** dans les montagnes, pour retenir la terre et l’eau ;
- **nomadisme** pastoral (Touaregs, Mongols, Sames), qui suit les ressources plutôt que de les épuiser ;
- **maisons sur pilotis** ou sur pieux dans les zones gelées et inondables.

> Une contrainte n’est jamais un obstacle absolu : c’est un problème auquel une société a répondu, souvent depuis très longtemps.

## Ce qui change aujourd’hui
- Le **tourisme** (montagne, désert) apporte des revenus mais fragilise les milieux.
- L’exploitation des **ressources** (pétrole, minerais, bois) transforme brutalement certaines régions.
- Le **changement climatique** frappe ces milieux en premier : fonte du permafrost, recul des glaciers, sécheresses aggravées.
- L’**exode** des jeunes vers les villes se poursuit.

## Contrainte ou atout
Un même trait peut être l’un ou l’autre selon l’époque : la montagne, longtemps obstacle, est devenue une ressource touristique majeure.`,
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
            cours: `## Ce qu’est la biodiversité
La **biodiversité** est la variété du vivant : des espèces, des gènes et des milieux. Certains espaces en concentrent une part exceptionnelle : forêts tropicales, récifs coralliens, mangroves, grandes savanes.

## Les hauts lieux
- L’**Amazonie** : environ 10 % des espèces connues sur Terre.
- La **Grande Barrière de corail** (Australie) : 1 500 espèces de poissons.
- Les forêts du **bassin du Congo**, de **Bornéo**, l’île de **Madagascar**, dont 80 % des espèces ne vivent nulle part ailleurs — on dit qu’elles sont **endémiques**.

## Qui y habite
Ces espaces sont peuplés, souvent depuis des millénaires : peuples autochtones d’Amazonie, communautés forestières du Congo, pêcheurs des récifs. Leurs pratiques — agriculture sur brûlis à petite échelle, chasse réglée par des règles collectives, pêche saisonnière — sont généralement compatibles avec le maintien du milieu.

## Les menaces
- La **déforestation** : agriculture industrielle (soja, huile de palme), élevage, exploitation du bois.
- L’**orpaillage** et les mines, qui polluent les fleuves au mercure.
- Le **braconnage** et le trafic d’espèces.
- Le **réchauffement**, qui blanchit et tue les coraux.

> Un hectare de forêt tropicale abattu ne se « replante » pas : on peut remettre des arbres, pas remettre l’écosystème qui a mis des millénaires à s’installer.

## Protéger
- Les **parcs nationaux** et **réserves naturelles** ;
- le classement au **patrimoine mondial de l’UNESCO** ;
- l’**écotourisme**, qui finance la protection en faisant du milieu une ressource économique — à condition de rester à faible impact ;
- la **reconnaissance des droits des peuples autochtones**, qui se révèle l’un des moyens les plus efficaces : les territoires qu’ils gèrent sont mieux préservés que la moyenne.

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
            cours: `## Ce qu’est un espace rural
Un espace **rural** se caractérise par une faible densité, un paysage dominé par les champs, les prés ou les forêts, et un poids important — mais plus jamais exclusif — de l’**agriculture**.

## Trois visages du rural
- Les **campagnes périurbaines**, proches des villes : elles **gagnent** des habitants, souvent des ménages qui travaillent en ville et logent à la campagne. On y observe des **migrations pendulaires**.
- Les **campagnes agricoles productives** : grandes cultures mécanisées, peu d’actifs, forte production (Beauce, Grand Ouest).
- Les **campagnes en déclin**, souvent en montagne ou éloignées : **exode rural**, vieillissement, fermeture de l’école, du commerce, du cabinet médical.

## Le recul de l’agriculture dans l’emploi
En France, les agriculteurs représentent aujourd’hui moins de **2 %** des actifs, contre plus de 30 % en 1950. La production, elle, a fortement augmenté : c’est l’effet de la **mécanisation** et de l’agrandissement des exploitations.

## Les difficultés
- L’**accès aux services** : santé, école, commerces, administration. On parle de **déserts médicaux**.
- La **dépendance à la voiture**, faute de transports collectifs.
- Le **manque de connexion** numérique dans certaines zones.

> Dans un espace peu dense, la distance devient une inégalité : le même service existe, mais il est à quarante minutes de route.

## Les atouts
Cadre de vie, prix du logement, espace, lien social, patrimoine, nature. Le **télétravail** a renforcé l’attractivité de certaines campagnes.

## Les nouvelles fonctions
Les espaces ruraux ne sont plus seulement productifs : ils sont aussi **résidentiels**, **touristiques** (gîtes, randonnée), **récréatifs**, et producteurs d’**énergie** (éolien, solaire, méthanisation).`,
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
            cours: `## Une attraction considérable
Le **littoral** est la zone de contact entre la terre et la mer. Environ **60 %** de l’humanité vit à moins de **100 km** d’une côte, et les densités y sont bien supérieures à la moyenne mondiale. C’est le processus de **littoralisation**.

## Deux grands types de littoraux
**Le littoral industrialo-portuaire**
Il est aménagé pour le commerce et l’industrie : **ports en eau profonde**, **terminaux à conteneurs**, raffineries, chantiers, entrepôts. On appelle **ZIP** (zone industrialo-portuaire) cet ensemble.
Exemples : **Shanghai** (premier port mondial), **Rotterdam**, **Singapour**, **Le Havre**.
Ils sont les nœuds de la **mondialisation** : environ 80 % des marchandises mondiales voyagent par la mer.

**Le littoral touristique**
Aménagé pour les vacanciers : hôtels, résidences, marinas, plages équipées, aéroports.
Exemples : la **Côte d’Azur**, les Baléares, Cancún, Bali.
Il crée des emplois mais souvent **saisonniers**, et provoque une **bétonisation** du rivage.

## Les autres usages
Pêche, aquaculture, énergies marines (éolien en mer), extraction de granulats, conservation de la nature. Ces usages **se concurrencent** sur un espace étroit : c’est le principal enjeu d’aménagement.

## Les fragilités
- **Érosion** du trait de côte, aggravée par les aménagements ;
- **pollutions** : marées noires, plastiques, rejets urbains et agricoles ;
- destruction des **milieux** : mangroves, dunes, zones humides ;
- **montée du niveau de la mer**, qui menace des dizaines de millions de personnes ;
- **submersion** lors des tempêtes et **cyclones**.

> Un littoral est une ligne : ce qu’on y ajoute d’un côté se retire presque toujours de l’autre.

## Protéger
Loi Littoral en France, **Conservatoire du littoral**, aires marines protégées, réensablement, restauration des dunes et des mangroves — ces dernières étant les meilleures protections naturelles contre les tempêtes.`,
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
            cours: `## Un monde très inégalement peuplé
La Terre compte environ **8 milliards** d’habitants, très inégalement répartis. Les **terres émergées** couvrent 30 % de la planète, et l’**écoumène** — la partie habitée en permanence — n’en représente qu’une fraction.

## Les grands foyers de peuplement
Trois concentrations majeures rassemblent plus de la moitié de l’humanité :
- l’**Asie du Sud** (Inde, Pakistan, Bangladesh) ;
- l’**Asie de l’Est** (Chine, Japon, Corées) ;
- l’**Europe**.
S’y ajoutent des foyers secondaires : nord-est des États-Unis, golfe de Guinée, vallée du Nil, Brésil littoral, Java.

## Les vides
Les **déserts humains** correspondent aux grandes contraintes :
- déserts chauds (Sahara, Arabie, Australie centrale) ;
- déserts froids (Sibérie, Groenland, Antarctique) ;
- hautes montagnes (Himalaya, Andes) ;
- forêts denses (Amazonie, Congo).

## Les facteurs de la répartition
- **Naturels** : climat tempéré, eau disponible, sols fertiles, relief accessible, proximité de la mer.
- **Historiques** : les foyers anciens (vallées fluviales, berceaux de l’agriculture) sont restés peuplés.
- **Économiques** : les villes, les ports et les régions industrielles attirent.

> La géographie n’explique pas tout : la vallée du Nil est peuplée depuis 5 000 ans, et c’est cette histoire, autant que le fleuve, qui explique sa densité d’aujourd’hui.

## Lire une carte de densité
Une **carte de densité** emploie des **aplats de couleur** : plus la teinte est foncée, plus la densité est forte. Il faut toujours lire la **légende** : deux cartes aux couleurs semblables peuvent utiliser des seuils très différents.

## Un phénomène qui bouge
La répartition évolue : l’**urbanisation** concentre, les **migrations** déplacent, et la croissance démographique est aujourd’hui très inégale selon les régions.`,
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
            cours: `## Les deux moteurs
La population d’un territoire varie sous l’effet de deux mouvements :
- l’**accroissement naturel** = **natalité − mortalité** ;
- le **solde migratoire** = **entrées − sorties**.
La somme des deux donne la variation totale.

## Une croissance historique
1 milliard d’humains vers 1800, 2,5 milliards en 1950, **8 milliards** aujourd’hui. Cette accélération s’explique surtout par l’**effondrement de la mortalité** — médecine, vaccins, eau potable, alimentation — bien avant la baisse de la natalité.

## La transition démographique
C’est le passage d’un régime **ancien** (forte natalité, forte mortalité, population stable) à un régime **moderne** (faible natalité, faible mortalité, population stable à un niveau plus élevé). Entre les deux, la mortalité baisse **avant** la natalité : la population **explose**.
Tous les pays ne sont pas au même stade — c’est ce décalage qui explique l’essentiel des différences actuelles.

> La croissance démographique n’est pas venue d’un excès de naissances, mais d’un recul de la mort. Ce n’est pas la même histoire.

## Aujourd’hui : des situations opposées
- L’**Afrique subsaharienne** connaît une forte croissance ; sa population pourrait doubler d’ici 2050. Sa population est très **jeune**.
- L’**Europe**, le **Japon** et de plus en plus la **Chine** voient leur population **vieillir**, voire diminuer. Enjeux : retraites, santé, main-d’œuvre.

## Les migrations
Environ **280 millions** de personnes vivent hors de leur pays de naissance, soit 3,5 % de l’humanité. Les causes sont économiques, politiques (guerres, persécutions), familiales, et de plus en plus environnementales.
La majorité des migrations se font **entre pays voisins**, et non des pays pauvres vers les pays riches — c’est l’idée reçue la plus répandue.

## Les indicateurs
**Taux de natalité** et **de mortalité** (pour 1 000 habitants), **indice de fécondité** (enfants par femme ; le seuil de renouvellement est **2,1**), **espérance de vie**.`,
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
            cours: `## Habiter, un verbe large
**Habiter**, en géographie, ne signifie pas seulement « loger ». C’est **occuper**, **pratiquer**, **aménager** et **se représenter** un espace : y dormir, y travailler, s’y déplacer, s’y divertir, y tenir à quelque chose.

## Les grandes formes d’occupation
- **L’espace urbain** : forte densité, bâti continu, activités de services. De la petite ville à la mégapole.
- **L’espace périurbain** : entre ville et campagne, maisons individuelles, dépendance à la ville pour l’emploi.
- **L’espace rural** : faible densité, agriculture, forêts, villages.
- **Les espaces de très faible densité** : déserts, hautes montagnes, forêts denses, régions polaires.

## Les formes d’habitat
- **Groupé** : village dense autour d’une place ou d’une église.
- **Dispersé** : fermes isolées (bocage de l’Ouest français).
- **Linéaire** : le long d’une route, d’un fleuve ou d’une côte.
Ces formes s’expliquent par l’histoire, l’agriculture pratiquée et le relief.

## Ce qui relie ces espaces
Aucun n’est isolé. Ils sont liés par des **réseaux** : routes, voies ferrées, lignes aériennes, câbles numériques, réseaux électriques. La ville dépend des campagnes pour se nourrir ; les campagnes dépendent de la ville pour les services.

> Il n’existe pas d’espace autosuffisant : la géographie est d’abord une affaire de relations.

## Des espaces qui se transforment
- **Urbanisation** : la ville gagne du terrain.
- **Périurbanisation** : elle s’étale sur les campagnes proches.
- **Déprise** : certains espaces se vident et les friches gagnent.
- **Métropolisation** : les fonctions rares se concentrent dans quelques très grandes villes.

## Habiter demain
Les enjeux se rejoignent partout : limiter l’étalement, réduire les émissions liées aux déplacements, préserver les terres agricoles, adapter les territoires au changement climatique, et maintenir des services accessibles à tous — y compris là où il y a peu d’habitants.`,
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
