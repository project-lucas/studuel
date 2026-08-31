// SVT — Sixième : LE PROGRAMME COMPLET (9 fiches).
//
// LE DÉFAUT. La page « SVT » d'un élève de 6e s'ouvrait sur cinq fiches héritées
// du premier jeu de données (migration 008) : « Le vivant et sa diversité »,
// « Le développement des êtres vivants », « Les besoins des plantes vertes »,
// « L'origine de nos aliments » et « La Terre dans le système solaire ». Cinq
// titres larges, sans découpage, pour toute une année.
//
// CE QUE L'ÉLÈVE DOIT VOIR — les 3 chapitres de la maquette de référence et
// leurs 9 fiches :
//   1. Unité et diversité des êtres vivants (3)
//   2. Les aliments                          (4)
//   3. La reproduction des êtres vivants     (2)
//
// POURQUOI CE MODULE EST ÉCRIT ET NON IMPORTÉ. Les SVT de 5e, 4e et 3e partagent
// un module unique — le BO écrit le cycle 4 d'un seul bloc (cf. la campagne
// 300 → 312). La 6e n'entre pas dans ce partage : elle relève du CYCLE 3, dont
// le programme de sciences est écrit avec l'école élémentaire. L'importer aurait
// mis la génétique et l'immunologie devant des élèves de onze ans.
//
// ⚠️ Le slug `svt` porte plusieurs modules (Tle = 233, 1re = 269, 2de = 285,
// 3e/4e/5e = 292 et ses imports, celui-ci = 6e) : ne JAMAIS générer avec
// `--slugs svt`. Toujours `--modules svt-6e`.

export default {
  slug: 'svt',
  nom: 'SVT',

  titreMigration: 'SVT 6e — LE PROGRAMME COMPLET (9 fiches)',

  motif: `CONSTAT : les SVT de 6e n'avaient que les 5 fiches du premier jeu de données de
l'app — cinq titres très larges (« Le vivant et sa diversité », « Le
développement des êtres vivants », « Les besoins des plantes vertes »,
« L'origine de nos aliments », « La Terre dans le système solaire »), sans aucun
découpage. Un élève qui révisait la cellule, la classification, l'évolution, les
besoins vitaux de ses organes, la conservation des aliments ou la reproduction
humaine ne trouvait RIEN de précis. Cette migration installe les 9 fiches du
programme, rangées sous les 3 chapitres de la maquette, et retire les 5 fiches
génériques.
LE CONTENU EST ÉCRIT, PAS IMPORTÉ du cycle 4 : la 6e relève du CYCLE 3, dont le
programme de sciences n'a ni le même découpage ni le même niveau d'exigence.`,

  menage: [
    {
      raison: `La colonne chapters.theme (migration 234) conditionne tout ce qui suit : ce
module range ses 9 fiches sous 3 chapitres, et l'INSERT écrit la colonne. Elle
est REPRISE ici en ADD COLUMN IF NOT EXISTS parce qu'on ne peut pas garantir que
la 234 soit passée en production — sans cette reprise, la migration échouerait
sur "column chapters.theme does not exist", les 5 anciens chapitres déjà
supprimés et les 9 neufs pas encore posés : une matière vide.
Le ménage qui suit LIT cette colonne : elle doit exister avant lui.
Le GRANT n'est pas décoratif : la migration 182 a révoqué le SELECT de table sur
chapters (pour cacher mind_map) et ne l'a rendu que colonne par colonne.`,
      sql: `ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;`,
    },
    {
      raison: `Les 5 chapitres hérités de la 008 partent, au niveau 6e SEULEMENT.

LE REPÈRE EST theme IS NULL, PAS LE TITRE. « Le développement des êtres vivants »
(ancien) et « Le développement et la reproduction des êtres vivants » (neuf) se
ressemblent de très près : un ménage par titre demanderait de vérifier à chaque
relecture qu'aucune fiche neuve ne heurte l'un des cinq anciens libellés, alors
que chapters porte UNIQUE(subject_id, level, title). Le critère « pas de chapitre
de programme » vise exactement les cinq lignes voulues : elles datent de la 008,
bien avant la colonne theme, tandis que les 9 fiches neuves en portent une dès
l'INSERT — le ménage tourne AVANT les insertions et ne peut donc jamais mordre
sur elles, ni au premier passage ni au rejeu.
Le filtre level = '6e' est indispensable : les SVT existent sur sept niveaux.
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
   AND s.slug = 'svt'
   AND c.level = '6e'
   AND c.theme IS NULL;

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'svt'
   AND c.level = '6e'
   AND c.theme IS NULL;

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'svt'
   AND c.level = '6e'
   AND c.theme IS NULL;`,
    },
  ],

  blocs: [
    {
      niveaux: ['6e'],
      chapitres: [
        // ===================================================================
        // Chapitre 1 : Unité et diversité des êtres vivants
        // ===================================================================
        {
          titre: 'La cellule, unité de définition de l’être vivant',
          axe: 'Unité et diversité des êtres vivants',
          lecon: {
            titre: 'La brique commune à tout ce qui vit',
            cours: `Tous les êtres vivants — la bactérie, le chêne, la fourmi, toi — sont faits de **cellules**. C’est le point commun de tout ce qui vit.

## Qu’est-ce qu’une cellule ?
C’est la **plus petite unité** capable de vivre. Elle est si petite qu’il faut un **microscope** pour la voir : quelques centièmes de millimètre.

## Ce qu’on trouve dans toute cellule
- une **membrane** qui la délimite et contrôle les échanges ;
- un **cytoplasme**, milieu gélatineux où se déroulent les réactions ;
- un **noyau**, qui contient l’information génétique et commande la cellule.

## Ce que la cellule végétale a en plus
- une **paroi** rigide, qui lui donne sa forme et soutient la plante ;
- des **chloroplastes** verts, contenant la **chlorophylle**, où se fait la photosynthèse ;
- une grande **vacuole** remplie de liquide.

> C’est la paroi qui explique qu’une tige tienne debout et qu’une cellule végétale ait des angles droits, là où la cellule animale est arrondie.

## Unicellulaire et pluricellulaire
- **Unicellulaire** : l’être vivant tient en **une seule** cellule (bactérie, paramécie, levure).
- **Pluricellulaire** : il en compte des milliards, organisées en tissus et en organes (l’humain en a environ 30 000 milliards).

## Toute cellule vient d’une cellule
Une cellule ne naît jamais de rien : elle provient toujours de la **division** d’une cellule précédente. C’est ainsi que l’on grandit et que les blessures cicatrisent.`,
          },
          questions: [
            ['Quel est le point commun de tous les êtres vivants ?', ['Ils sont constitués de cellules', 'Ils ont un squelette', 'Ils se déplacent', 'Ils respirent de l’air'], 0, 'La cellule est la plus petite unité capable de vivre.'],
            ['Quel élément contient l’information génétique de la cellule ?', ['Le noyau', 'La membrane', 'Le cytoplasme', 'La vacuole'], 0, 'Il commande le fonctionnement cellulaire.'],
            ['Quel élément est présent dans la cellule végétale mais absent de la cellule animale ?', ['La paroi', 'Le noyau', 'La membrane', 'Le cytoplasme'], 0, 'Les chloroplastes et la grande vacuole aussi.'],
            ['Où se trouve la chlorophylle ?', ['Dans les chloroplastes', 'Dans le noyau', 'Dans la paroi', 'Dans la vacuole'], 0, 'C’est le pigment vert de la photosynthèse.'],
            ['Comment appelle-t-on un être vivant formé d’une seule cellule ?', ['Unicellulaire', 'Pluricellulaire', 'Monocellulaire végétal', 'Acellulaire'], 0, 'La bactérie et la paramécie en sont.'],
            ['Quel instrument permet d’observer une cellule ?', ['Le microscope', 'La loupe seulement', 'Le télescope', 'L’œil nu suffit'], 0, 'Une cellule mesure quelques centièmes de millimètre.'],
            ['D’où provient toujours une cellule ?', ['De la division d’une cellule précédente', 'Elle apparaît spontanément', 'Du noyau seul', 'De la matière minérale'], 0, 'C’est ainsi qu’on grandit et qu’on cicatrise.'],
            ['La cellule animale possède une paroi rigide.', ['Vrai', 'Faux'], 1, 'Seule la cellule végétale en a une.'],
          ],
        },
        {
          titre: 'La classification des êtres vivants',
          axe: 'Unité et diversité des êtres vivants',
          lecon: {
            titre: 'Ranger le vivant par ce qu’il possède',
            cours: `## Le principe : les attributs
On ne classe **pas** les êtres vivants par ce qu’ils font (voler, nager) ni par leur milieu de vie, mais par les **attributs** qu’ils **possèdent** : squelette interne, vertèbres, poils, plumes, quatre membres, mamelles…

> La chauve-souris vole comme l’oiseau, mais elle a des **poils** et des **mamelles** : c’est un mammifère. Le critère est ce qu’on possède, pas ce qu’on fait.

## Les groupes emboîtés
On représente la classification par des **boîtes emboîtées** : chaque boîte porte un attribut, et tous les êtres qui la partagent y entrent. Une boîte incluse dans une autre partage tous les attributs de la plus grande.
Exemple : la boîte « vertèbres » contient la boîte « poils et mamelles » (les mammifères), qui contient la boîte « pouce opposable » (les primates).

## Quelques grands groupes
- **Vertébrés** : squelette interne et vertèbres — poissons, amphibiens, reptiles, oiseaux, mammifères.
- **Arthropodes** : squelette **externe** et pattes articulées — insectes (6 pattes), arachnides (8 pattes), crustacés.
- **Mollusques** : corps mou, souvent une coquille.

## Espèce, genre, nom scientifique
Une **espèce** regroupe les individus qui peuvent se reproduire entre eux et donner une descendance elle-même féconde.
Chaque espèce porte un **nom scientifique en latin**, en deux mots : *Homo sapiens*, *Canis lupus*. Ce nom est le même dans tous les pays, ce qui évite les confusions entre langues.

## Un lien de parenté
Partager des attributs, c’est partager un **ancêtre commun**. La classification ne range pas seulement : elle raconte une **histoire de famille**.`,
          },
          questions: [
            ['Sur quoi repose la classification des êtres vivants ?', ['Sur les attributs qu’ils possèdent', 'Sur leur milieu de vie', 'Sur leur mode de déplacement', 'Sur leur taille'], 0, 'On classe par ce qu’on a, pas par ce qu’on fait.'],
            ['Pourquoi la chauve-souris n’est-elle pas un oiseau ?', ['Elle a des poils et des mamelles', 'Elle vole la nuit', 'Elle est trop petite', 'Elle n’a pas de squelette'], 0, 'Voler n’est pas un attribut de classification.'],
            ['Combien de pattes possède un insecte ?', ['Six', 'Huit', 'Quatre', 'Dix'], 0, 'Les arachnides en ont huit.'],
            ['Qu’est-ce qu’une espèce ?', ['Des individus qui se reproduisent entre eux et donnent une descendance féconde', 'Des individus qui vivent au même endroit', 'Des individus de même taille', 'Des individus de même couleur'], 0, 'C’est le critère de la fécondité de la descendance.'],
            ['En combien de mots s’écrit un nom scientifique d’espèce ?', ['Deux, en latin', 'Un seul', 'Trois', 'Cela dépend du pays'], 0, 'Homo sapiens, Canis lupus.'],
            ['Que possèdent les arthropodes ?', ['Un squelette externe et des pattes articulées', 'Un squelette interne', 'Des vertèbres', 'Une coquille toujours'], 0, 'Insectes, arachnides et crustacés en font partie.'],
            ['Que signifie le partage d’attributs entre deux espèces ?', ['Elles ont un ancêtre commun', 'Elles vivent au même endroit', 'Elles ont la même taille', 'Elles se nourrissent pareil'], 0, 'La classification raconte une histoire de parenté.'],
            ['On classe les êtres vivants d’après leur milieu de vie.', ['Vrai', 'Faux'], 1, 'On les classe d’après leurs attributs.'],
          ],
        },
        {
          titre: 'L’évolution des espèces',
          axe: 'Unité et diversité des êtres vivants',
          lecon: {
            titre: 'Le vivant change au fil du temps',
            cours: `## Les espèces ne sont pas figées
Les espèces **apparaissent**, se **transforment** et **disparaissent**. La vie sur Terre a environ **3,8 milliards d’années**, et l’immense majorité des espèces qui ont existé sont aujourd’hui **éteintes**.

## Les fossiles, nos archives
Un **fossile** est un reste ou une trace d’un être vivant du passé, conservé dans la roche (os, coquille, empreinte, terrier). Les fossiles prouvent que des espèces différentes des actuelles ont vécu, et permettent de les **dater** : plus la couche de roche est profonde, plus elle est ancienne.

## Comment ça marche
Au sein d’une espèce, les individus **varient** : taille, couleur, résistance au froid. Quand le milieu change, certaines variations donnent un **avantage** — ces individus survivent mieux, se reproduisent davantage et transmettent leurs caractères. Sur des milliers de générations, l’espèce **se transforme**.

> Ce n’est pas l’individu qui s’adapte au cours de sa vie : c’est l’espèce qui change parce que certains individus laissent plus de descendants que d’autres.

## Les crises biologiques
Cinq **extinctions de masse** ont éliminé une grande part du vivant. La plus connue, il y a **66 millions d’années**, a fait disparaître les dinosaures non-aviens et a libéré la place où les mammifères se sont diversifiés.

## La biodiversité aujourd’hui
La **biodiversité** est la variété du vivant. Elle diminue vite sous l’effet des activités humaines : destruction des milieux, pollution, surexploitation, réchauffement. La protéger, c’est protéger les équilibres dont nous dépendons.`,
          },
          questions: [
            ['Qu’est-ce qu’un fossile ?', ['Un reste ou une trace d’un être vivant du passé conservé dans la roche', 'Une pierre de forme animale', 'Un animal très ancien encore vivant', 'Un minéral rare'], 0, 'Os, coquilles, empreintes et terriers en sont.'],
            ['Comment date-t-on relativement des couches de roche ?', ['Plus la couche est profonde, plus elle est ancienne', 'Plus elle est profonde, plus elle est récente', 'Par leur couleur', 'Par leur épaisseur seule'], 0, 'Les couches se déposent les unes sur les autres.'],
            ['Depuis combien de temps la vie existe-t-elle sur Terre ?', ['Environ 3,8 milliards d’années', 'Environ 66 millions d’années', 'Environ 300 000 ans', 'Environ 3,8 millions d’années'], 0, 'Les dinosaures, eux, ont disparu il y a 66 millions d’années.'],
            ['Comment une espèce se transforme-t-elle au fil du temps ?', ['Les individus les mieux adaptés laissent plus de descendants', 'Chaque individu s’adapte durant sa vie', 'Toutes les espèces changent au même rythme', 'Le milieu modifie directement les caractères'], 0, 'La transformation se joue sur des milliers de générations.'],
            ['Quel événement a eu lieu il y a 66 millions d’années ?', ['Une extinction de masse, dont celle des dinosaures non-aviens', 'L’apparition de la vie', 'L’apparition de l’humain', 'La formation de la Terre'], 0, 'Les mammifères s’y sont ensuite diversifiés.'],
            ['Qu’est-ce que la biodiversité ?', ['La variété du vivant', 'Le nombre d’animaux domestiques', 'La surface des forêts', 'La diversité des roches'], 0, 'Elle diminue sous l’effet des activités humaines.'],
            ['Que sont devenues la plupart des espèces ayant existé sur Terre ?', ['Elles se sont éteintes', 'Elles vivent encore', 'Elles ont fusionné', 'Elles se sont fossilisées vivantes'], 0, 'Les espèces actuelles sont une petite part du total.'],
            ['Les espèces vivantes sont fixes et ne changent pas.', ['Vrai', 'Faux'], 1, 'Elles apparaissent, se transforment et disparaissent.'],
          ],
        },

        // ===================================================================
        // Chapitre 2 : Les aliments
        // ===================================================================
        {
          titre: 'Les aliments, une source d’éléments vitaux pour l’organisme',
          axe: 'Les aliments',
          lecon: {
            titre: 'Ce que contient ce qu’on mange',
            cours: `Les aliments apportent des **nutriments**, dont l’organisme a besoin pour fonctionner, grandir et se réparer.

## Les grandes familles de nutriments
- **Glucides** (sucres) : le **carburant** principal. Pain, pâtes, riz, fruits.
- **Lipides** (graisses) : réserve d’énergie et constituants des membranes. Huile, beurre, fruits secs.
- **Protides** (protéines) : les **matériaux de construction** du corps. Viande, poisson, œufs, légumineuses.
- **Vitamines** et **minéraux** (calcium, fer) : en très petite quantité, mais indispensables.
- **Eau** : elle représente environ **60 %** de la masse du corps.
- **Fibres** : elles ne nourrissent pas mais font fonctionner l’intestin.

## Le rôle de la digestion
Les aliments sont trop gros pour passer dans le sang. La **digestion** les réduit en nutriments assez petits pour traverser la paroi de l’**intestin grêle** : c’est l’**absorption intestinale**. Le sang les distribue ensuite à tous les organes.

## Une alimentation équilibrée
Aucun aliment ne contient tout : il faut **varier**. Les repères sont simples — des fruits et légumes à chaque repas, des féculents à chaque repas, des protéines une à deux fois par jour, peu de produits gras, sucrés et salés, et de l’eau comme seule boisson indispensable.

> Équilibré ne veut pas dire parfait à chaque repas, mais varié sur la semaine.

## Les besoins varient
Un adolescent en croissance, un sportif et une personne âgée n’ont pas les mêmes besoins. L’activité physique, l’âge et la taille les font changer.`,
          },
          questions: [
            ['Quel nutriment est le carburant principal de l’organisme ?', ['Les glucides', 'Les lipides', 'Les protides', 'Les vitamines'], 0, 'Pain, pâtes et riz en apportent.'],
            ['Quels nutriments servent de matériaux de construction du corps ?', ['Les protides', 'Les glucides', 'Les lipides', 'Les fibres'], 0, 'Viande, poisson, œufs et légumineuses en contiennent.'],
            ['Quelle proportion du corps humain l’eau représente-t-elle ?', ['Environ 60 %', 'Environ 20 %', 'Environ 90 %', 'Environ 40 %'], 0, 'C’est le constituant le plus abondant.'],
            ['Où les nutriments passent-ils dans le sang ?', ['Dans l’intestin grêle', 'Dans l’estomac', 'Dans la bouche', 'Dans le gros intestin'], 0, 'C’est l’absorption intestinale.'],
            ['À quoi sert la digestion ?', ['À réduire les aliments en nutriments assez petits pour passer dans le sang', 'À détruire les microbes', 'À produire de la chaleur', 'À fabriquer des vitamines'], 0, 'Les aliments entiers ne peuvent pas traverser la paroi intestinale.'],
            ['À quoi servent les fibres ?', ['À faire fonctionner l’intestin', 'À apporter de l’énergie', 'À construire les muscles', 'À fixer le calcium'], 0, 'Elles ne sont pas des nutriments à proprement parler.'],
            ['Qu’apportent les vitamines et les minéraux ?', ['Des éléments indispensables en très petite quantité', 'La majeure partie de l’énergie', 'Les matériaux de construction', 'Rien d’essentiel'], 0, 'Le calcium et le fer en sont des exemples.'],
            ['Un seul aliment peut couvrir tous les besoins de l’organisme.', ['Vrai', 'Faux'], 1, 'Il faut varier son alimentation.'],
          ],
        },
        {
          titre: 'Les besoins vitaux de nos organes',
          axe: 'Les aliments',
          lecon: {
            titre: 'Le sang livre, les organes consomment',
            cours: `## Ce dont un organe a besoin
Pour fonctionner, tout organe a besoin en permanence de **dioxygène** et de **nutriments**. Il produit en retour des **déchets** : du **dioxyde de carbone** et de l’urée.

## Le sang, le livreur
Le **sang** circule dans les vaisseaux et assure ces échanges : il **apporte** dioxygène et nutriments, il **emporte** les déchets. Le **cœur** est la pompe qui le fait circuler sans arrêt.

## D’où vient le dioxygène
De l’air, par la **respiration**. Il entre dans les **poumons**, passe dans le sang au niveau des **alvéoles pulmonaires** — de minuscules sacs très nombreux, dont la paroi est extrêmement fine — et le dioxyde de carbone fait le trajet inverse.

## D’où viennent les nutriments
Des aliments, par la **digestion** puis l’**absorption** dans l’intestin grêle.

## Ce que devient l’énergie
Dans chaque organe, les nutriments et le dioxygène réagissent : c’est la **respiration cellulaire**. Elle libère l’**énergie** nécessaire au fonctionnement, et produit du dioxyde de carbone et de l’eau.

## Pendant l’effort
Les muscles consomment davantage. Le corps s’adapte : le **rythme cardiaque** augmente, la **respiration** s’accélère, et le sang est redistribué en priorité vers les muscles.

> Un cœur qui bat plus vite pendant un effort n’est pas un cœur en difficulté : c’est un cœur qui livre plus vite.

## L’élimination des déchets
Les **reins** filtrent le sang et fabriquent l’**urine**, qui évacue l’urée. Les poumons, eux, évacuent le dioxyde de carbone.`,
          },
          questions: [
            ['De quoi tout organe a-t-il besoin en permanence ?', ['De dioxygène et de nutriments', 'De dioxyde de carbone', 'D’urée', 'De fibres'], 0, 'Le sang les lui apporte.'],
            ['Quel est le rôle du sang ?', ['Apporter dioxygène et nutriments, emporter les déchets', 'Produire l’énergie', 'Digérer les aliments', 'Filtrer l’urine'], 0, 'Le cœur le met en mouvement.'],
            ['Où le dioxygène passe-t-il de l’air dans le sang ?', ['Dans les alvéoles pulmonaires', 'Dans la trachée', 'Dans le nez', 'Dans le cœur'], 0, 'Leur paroi est extrêmement fine.'],
            ['Comment appelle-t-on la réaction qui libère l’énergie dans les organes ?', ['La respiration cellulaire', 'La digestion', 'La photosynthèse', 'L’absorption'], 0, 'Elle consomme nutriments et dioxygène.'],
            ['Quel déchet les poumons évacuent-ils ?', ['Le dioxyde de carbone', 'L’urée', 'Le glucose', 'Le dioxygène'], 0, 'Les reins évacuent l’urée dans l’urine.'],
            ['Quel organe filtre le sang et fabrique l’urine ?', ['Le rein', 'Le foie', 'Le poumon', 'L’estomac'], 0, 'Il élimine l’urée.'],
            ['Que se passe-t-il pendant un effort physique ?', ['Le rythme cardiaque et la respiration augmentent', 'Le cœur ralentit', 'La respiration s’arrête', 'Le sang cesse de circuler vers les muscles'], 0, 'Les muscles consomment davantage.'],
            ['Les organes produisent des déchets que le sang emporte.', ['Vrai', 'Faux'], 0, 'Dioxyde de carbone et urée notamment.'],
          ],
        },
        {
          titre: 'Nourrir les hommes : la culture et l’élevage',
          axe: 'Les aliments',
          lecon: {
            titre: 'Produire de quoi manger',
            cours: `## Deux grandes voies
- L’**agriculture** cultive des végétaux (céréales, légumes, fruits).
- L’**élevage** produit des animaux et leurs produits (viande, lait, œufs).

## Les besoins d’une plante cultivée
Une plante verte a besoin de **lumière**, d’**eau**, de **dioxyde de carbone** et de **sels minéraux** puisés dans le sol par ses racines. Avec ces éléments et la lumière, elle fabrique sa propre matière : c’est la **photosynthèse**.
Une plante est **productrice primaire** : elle ne mange pas, elle produit.

## Pourquoi on amende les sols
Les cultures **prélèvent** des sels minéraux. Sans apport, le sol s’appauvrit. On y remédie par des **engrais** (organiques comme le fumier, ou minéraux) et par la **rotation des cultures**, qui alterne les espèces pour ménager le sol.

## Le coût de l’élevage
Nourrir un animal pour le manger ensuite coûte beaucoup plus de végétaux, d’eau et de surface que de manger directement des végétaux : à chaque maillon de la chaîne alimentaire, une grande partie de l’énergie est **perdue**.

> C’est pourquoi un kilo de viande mobilise bien plus de ressources qu’un kilo de céréales.

## Les impacts et les choix
L’agriculture intensive produit beaucoup mais utilise engrais et **pesticides**, qui polluent l’eau et réduisent la biodiversité. L’agriculture biologique s’en passe largement, avec des rendements souvent inférieurs.
Manger local et de **saison**, limiter le **gaspillage** — un tiers de la nourriture produite est perdue — sont des leviers accessibles à chacun.`,
          },
          questions: [
            ['De quoi une plante verte a-t-elle besoin pour produire sa matière ?', ['Lumière, eau, dioxyde de carbone et sels minéraux', 'De matière organique du sol', 'D’animaux', 'De dioxygène seulement'], 0, 'C’est la photosynthèse.'],
            ['Comment qualifie-t-on une plante verte dans une chaîne alimentaire ?', ['Productrice primaire', 'Consommatrice', 'Décomposeuse', 'Prédatrice'], 0, 'Elle produit sa matière au lieu de la consommer.'],
            ['Pourquoi apporte-t-on des engrais aux cultures ?', ['Parce que les cultures prélèvent les sels minéraux du sol', 'Pour donner de la couleur aux plantes', 'Pour remplacer la lumière', 'Pour tuer les insectes'], 0, 'La rotation des cultures aide aussi.'],
            ['Qu’est-ce que la rotation des cultures ?', ['Alterner les espèces cultivées pour ménager le sol', 'Retourner la terre chaque année', 'Faire tourner les machines agricoles', 'Changer d’exploitation'], 0, 'Elle limite l’appauvrissement du sol.'],
            ['Pourquoi produire de la viande coûte-t-il plus de ressources ?', ['Une grande partie de l’énergie est perdue à chaque maillon de la chaîne alimentaire', 'Les animaux sont plus lourds', 'La viande se conserve mal', 'Les élevages sont plus petits'], 0, 'Il faut cultiver des végétaux pour nourrir l’animal.'],
            ['Quel est un inconvénient de l’agriculture intensive ?', ['La pollution par les engrais et les pesticides', 'Des rendements trop faibles', 'L’absence de mécanisation', 'Le manque de surfaces'], 0, 'Elle réduit aussi la biodiversité.'],
            ['Quelle part de la nourriture produite est gaspillée ?', ['Environ un tiers', 'Environ un dixième', 'Environ la moitié', 'Presque rien'], 0, 'Le gaspillage est un levier majeur.'],
            ['Une plante verte se nourrit en absorbant de la matière organique du sol.', ['Vrai', 'Faux'], 1, 'Elle fabrique sa propre matière par photosynthèse.'],
          ],
        },
        {
          titre: 'La production et la conservation des aliments',
          axe: 'Les aliments',
          lecon: {
            titre: 'Des micro-organismes utiles, des micro-organismes à arrêter',
            cours: `## Les micro-organismes qui transforment
Certains aliments existent **grâce** aux micro-organismes. C’est la **fermentation** :
- le **pain** lève grâce à la **levure**, qui produit du dioxyde de carbone ;
- le **yaourt** et le **fromage** viennent de **bactéries** qui transforment le lait ;
- le vin, la bière et la choucroute sont aussi des produits fermentés.

## Les micro-organismes qui abîment
D’autres provoquent l’**altération** des aliments et peuvent rendre malade. Ils ont besoin, pour se multiplier, de **chaleur**, d’**eau** et de **nutriments**. Toute technique de conservation consiste à leur retirer au moins l’un des trois.

## Les techniques de conservation
- **Le froid** : le **réfrigérateur** (~4 °C) ralentit leur multiplication ; le **congélateur** (−18 °C) l’arrête presque. Le froid ne **tue** pas : il met en pause.
- **La chaleur** : la **pasteurisation** (~70 °C) en détruit une grande partie ; la **stérilisation** (>100 °C) les élimine — c’est la conserve.
- **Le séchage** : on retire l’eau (fruits secs, pâtes).
- **Le sel et le sucre** : ils retiennent l’eau et la rendent indisponible (jambon sec, confiture).
- **Le vide** et la **fumaison** complètent la liste.

> Le froid met en pause, la chaleur détruit. C’est pourquoi un produit décongelé ne doit jamais être recongelé : les micro-organismes ont repris leur multiplication.

## Lire une étiquette
La **DLC** (« à consommer jusqu’au ») concerne les produits frais : elle ne se dépasse pas. La **DDM** (« à consommer de préférence avant ») signale une baisse de qualité, pas un danger.

## L’hygiène
Se laver les mains, respecter la chaîne du froid, séparer le cru et le cuit : les gestes simples évitent la plupart des intoxications alimentaires.`,
          },
          questions: [
            ['Grâce à quoi le pain lève-t-il ?', ['À la levure, qui produit du dioxyde de carbone', 'Au sel', 'Au froid', 'À la cuisson seule'], 0, 'C’est une fermentation.'],
            ['De quoi les micro-organismes ont-ils besoin pour se multiplier ?', ['De chaleur, d’eau et de nutriments', 'De froid et de sel', 'De lumière', 'De vide'], 0, 'Conserver consiste à leur retirer l’un des trois.'],
            ['Que fait le froid aux micro-organismes ?', ['Il ralentit ou arrête leur multiplication sans les tuer', 'Il les tue tous', 'Il les nourrit', 'Il n’a aucun effet'], 0, 'C’est la chaleur qui les détruit.'],
            ['Quelle technique élimine les micro-organismes au-delà de 100 °C ?', ['La stérilisation', 'La pasteurisation', 'La congélation', 'Le séchage'], 0, 'C’est le principe de la conserve.'],
            ['Comment le sel et le sucre conservent-ils les aliments ?', ['Ils rendent l’eau indisponible pour les micro-organismes', 'Ils tuent les micro-organismes par contact', 'Ils refroidissent l’aliment', 'Ils apportent des nutriments'], 0, 'Jambon sec et confiture en sont des exemples.'],
            ['Que signifie la DLC sur une étiquette ?', ['Une date à ne pas dépasser, sur les produits frais', 'Une simple baisse de qualité après la date', 'La date de fabrication', 'La date de livraison'], 0, 'La DDM, elle, signale une baisse de qualité.'],
            ['Quels aliments viennent d’une fermentation par des bactéries ?', ['Le yaourt et le fromage', 'Les pâtes et le riz', 'Les fruits secs', 'Les conserves'], 0, 'Elles transforment le lait.'],
            ['Un produit décongelé peut être recongelé sans risque.', ['Vrai', 'Faux'], 1, 'Les micro-organismes ont repris leur multiplication pendant la décongélation.'],
          ],
        },

        // ===================================================================
        // Chapitre 3 : La reproduction des êtres vivants
        // ===================================================================
        {
          titre: 'Le développement et la reproduction des êtres vivants',
          axe: 'La reproduction des êtres vivants',
          lecon: {
            titre: 'Naître, grandir, se reproduire',
            cours: `## Deux formes de reproduction
- **Sexuée** : elle demande **deux** cellules reproductrices, un **spermatozoïde** (mâle) et un **ovule** (femelle). Leur rencontre est la **fécondation** ; elle donne une **cellule-œuf**, première cellule du nouvel être vivant. Les descendants sont **tous différents** entre eux.
- **Asexuée** : un seul individu suffit — bouturage d’une plante, division d’une bactérie, stolons du fraisier. Les descendants sont **identiques** au parent.

> La reproduction sexuée fabrique de la diversité ; l’asexuée fabrique des copies.

## Où se fait la fécondation
- **Externe** : dans l’eau, les cellules sont libérées dans le milieu (poissons, grenouilles). Il en faut beaucoup, car peu survivent.
- **Interne** : dans le corps de la femelle (mammifères, oiseaux, reptiles, insectes). Moins de descendants, mieux protégés.

## Le développement
- **Direct** : le jeune ressemble à l’adulte en plus petit (chat, humain, oiseau).
- **Indirect** : le jeune, appelé **larve**, ne ressemble pas à l’adulte et se transforme par **métamorphose** (têtard → grenouille, chenille → papillon).

## Chez les plantes à fleurs
La **fleur** porte les organes reproducteurs. Le **pollen** doit atteindre le **pistil** : c’est la **pollinisation**, assurée par le vent ou par les **insectes pollinisateurs**. Après fécondation, l’**ovaire** devient un **fruit** et l’ovule une **graine**.
La **dispersion** des graines (vent, animaux, eau) éloigne les jeunes plantes de la plante mère.

## Peuplement et saisons
Selon les saisons, les espèces changent de forme ou de lieu : graines, bulbes, œufs, migration, hibernation. C’est ainsi qu’un milieu se **repeuple** au printemps.`,
          },
          questions: [
            ['Comment appelle-t-on la rencontre d’un spermatozoïde et d’un ovule ?', ['La fécondation', 'La pollinisation', 'La métamorphose', 'La germination'], 0, 'Elle donne une cellule-œuf.'],
            ['Quelle est la première cellule d’un nouvel être vivant ?', ['La cellule-œuf', 'L’ovule', 'Le spermatozoïde', 'La larve'], 0, 'Elle naît de la fécondation.'],
            ['Que produit une reproduction asexuée ?', ['Des descendants identiques au parent', 'Des descendants tous différents', 'Une cellule-œuf', 'Une métamorphose'], 0, 'Bouturage, division bactérienne, stolons.'],
            ['Qu’est-ce qu’un développement indirect ?', ['Le jeune est une larve qui se transforme par métamorphose', 'Le jeune ressemble à l’adulte en plus petit', 'Le jeune naît adulte', 'Il n’y a pas de jeune'], 0, 'Têtard → grenouille, chenille → papillon.'],
            ['Qu’est-ce que la pollinisation ?', ['Le transport du pollen jusqu’au pistil', 'La formation du fruit', 'La germination de la graine', 'La dispersion des graines'], 0, 'Elle est assurée par le vent ou les insectes.'],
            ['Que devient l’ovaire de la fleur après la fécondation ?', ['Un fruit', 'Une graine', 'Une racine', 'Une feuille'], 0, 'L’ovule, lui, devient une graine.'],
            ['Pourquoi les poissons produisent-ils beaucoup de cellules reproductrices ?', ['La fécondation est externe et peu de descendants survivent', 'Ils vivent longtemps', 'Leurs œufs sont très gros', 'Ils se reproduisent une seule fois'], 0, 'La fécondation interne protège mieux, avec moins de descendants.'],
            ['La reproduction sexuée produit des descendants identiques entre eux.', ['Vrai', 'Faux'], 1, 'C’est la reproduction asexuée qui fabrique des copies.'],
          ],
        },
        {
          titre: 'Le développement et la reproduction des êtres humains',
          axe: 'La reproduction des êtres vivants',
          lecon: {
            titre: 'La puberté et le début de la vie',
            cours: `## La puberté
La **puberté** est le passage de l’enfance à l’âge adulte. Elle commence en général entre **10 et 15 ans**, à un âge qui varie beaucoup d’une personne à l’autre — et cette variation est **normale**.

Elle se traduit par :
- une **croissance** rapide ;
- l’apparition des **caractères sexuels secondaires** (pilosité, mue de la voix et développement musculaire chez le garçon ; développement des seins et élargissement du bassin chez la fille) ;
- le début du fonctionnement des **organes reproducteurs** : production de **spermatozoïdes** par les testicules, premières **règles** chez la fille, signe qu’un ovule est libéré chaque mois par les ovaires.

## Le cycle et les règles
Environ une fois par mois, un ovaire libère un ovule : c’est l’**ovulation**. En l’absence de fécondation, la paroi de l’utérus est évacuée : ce sont les **règles**, qui durent quelques jours.

## De la fécondation à la naissance
La **fécondation** a lieu dans une trompe. La cellule-œuf se divise et vient se fixer dans l’**utérus** : c’est la **nidation**. L’**embryon** devient **fœtus** vers la fin du deuxième mois.
Il est relié au **placenta** par le **cordon ombilical**, qui lui apporte dioxygène et nutriments et évacue ses déchets. La **grossesse** dure environ **9 mois** et se termine par l’**accouchement**.

## Contraception et protection
La **contraception** (préservatif, pilule…) permet d’éviter une grossesse. Le **préservatif** est le seul moyen qui protège **aussi** des infections sexuellement transmissibles.

> Deux fonctions différentes, un seul objet qui remplit les deux : c’est pourquoi le préservatif a une place à part.

## Respect et consentement
Le corps de chacun lui appartient. Le **consentement** est libre, éclairé et peut être retiré à tout moment. Aucune pression, aucune moquerie sur le corps d’autrui n’est acceptable.`,
          },
          questions: [
            ['Qu’est-ce que la puberté ?', ['Le passage de l’enfance à l’âge adulte', 'La naissance', 'La fin de la croissance', 'Le début de la grossesse'], 0, 'Elle commence en général entre 10 et 15 ans.'],
            ['Que signale l’apparition des premières règles ?', ['Qu’un ovule est libéré chaque mois par les ovaires', 'Qu’une grossesse a commencé', 'Que la croissance est terminée', 'Qu’il y a une maladie'], 0, 'C’est le début du fonctionnement des ovaires.'],
            ['Où a lieu la fécondation chez l’être humain ?', ['Dans une trompe', 'Dans l’utérus', 'Dans un ovaire', 'Dans le placenta'], 0, 'La cellule-œuf migre ensuite vers l’utérus.'],
            ['Comment appelle-t-on la fixation de l’embryon dans l’utérus ?', ['La nidation', 'La fécondation', 'L’ovulation', 'L’accouchement'], 0, 'Elle suit les premières divisions de la cellule-œuf.'],
            ['Quel est le rôle du cordon ombilical ?', ['Apporter dioxygène et nutriments au fœtus et évacuer ses déchets', 'Protéger le fœtus des chocs', 'Fabriquer les cellules du fœtus', 'Déclencher l’accouchement'], 0, 'Il relie le fœtus au placenta.'],
            ['Combien de temps dure environ une grossesse ?', ['9 mois', '6 mois', '12 mois', '3 mois'], 0, 'Elle se termine par l’accouchement.'],
            ['Quel moyen de contraception protège aussi des infections sexuellement transmissibles ?', ['Le préservatif', 'La pilule', 'Le stérilet', 'Aucun'], 0, 'C’est ce qui lui donne une place à part.'],
            ['La puberté commence exactement au même âge pour tout le monde.', ['Vrai', 'Faux'], 1, 'L’âge varie beaucoup, et cette variation est normale.'],
          ],
        },
      ],
    },
  ],
}
