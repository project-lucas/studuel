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
            cours: `La bactérie, le chêne, la fourmi, toi : tous faits de cellules. C’est le point commun de tout ce qui vit.

## Qu’est-ce qu’une cellule
La **plus petite unité capable de vivre**. Quelques centièmes de millimètre : il faut un **microscope** pour la voir.

## Ce qu’on trouve dans TOUTE cellule
| L’élément | Son rôle |
| La **membrane** | Elle délimite et contrôle les échanges |
| Le **cytoplasme** | Milieu gélatineux où se déroulent les réactions |
| Le **noyau** | Il contient l’information génétique et commande la cellule |

## Ce que la cellule végétale a EN PLUS
| L’élément | Son rôle |
| La **paroi** rigide | Elle donne la forme et soutient la plante |
| Les **chloroplastes** verts | Ils contiennent la **chlorophylle** : la photosynthèse s’y fait |
| La grande **vacuole** | Elle est remplie de liquide |

!> C’est la **paroi** qui explique qu’une tige tienne debout, et qu’une cellule végétale ait des **angles droits** là où la cellule animale est arrondie.

## Unicellulaire et pluricellulaire
| Le type | Ce qu’il est | Exemples |
| **Unicellulaire** | **Une seule** cellule | Bactérie, paramécie, levure |
| **Pluricellulaire** | Des milliards, organisées en tissus et en organes | L’humain en a environ **30 000 milliards** |

## Toute cellule vient d’une cellule
~ Une cellule se divise → deux cellules → elles se divisent à leur tour

> Une cellule ne naît **jamais de rien**. C’est ainsi que l’on grandit et que les blessures cicatrisent.`,
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
            cours: `On ne classe pas les êtres vivants par ce qu’ils font, mais par ce qu’ils possèdent.

## Le principe : les attributs
Squelette interne, vertèbres, poils, plumes, quatre membres, mamelles : ce sont des **attributs**.

!> La **chauve-souris vole** comme l’oiseau, mais elle a des **poils** et des **mamelles** : c’est un **mammifère**. Le critère est ce qu’on **possède**, pas ce qu’on fait ni où l’on vit.

## Les groupes emboîtés
~ Vertèbres → contient les poils et mamelles (mammifères) → contient le pouce opposable (primates)

Chaque boîte porte un attribut, et une boîte incluse dans une autre partage **tous** les attributs de la plus grande.

## Quelques grands groupes
| Le groupe | Son attribut | Ses membres |
| Les **vertébrés** | Squelette **interne** et vertèbres | Poissons, amphibiens, reptiles, oiseaux, mammifères |
| Les **arthropodes** | Squelette **externe** et pattes articulées | Insectes (**6 pattes**), arachnides (**8 pattes**), crustacés |
| Les **mollusques** | Corps mou, souvent une coquille | Escargot, moule, poulpe |

## Espèce, genre, nom scientifique
= Une espèce : les individus qui peuvent se reproduire entre eux ET donner une descendance elle-même féconde

Chaque espèce porte un **nom scientifique en latin**, en deux mots.

= Homo sapiens · Canis lupus

> Ce nom est le **même dans tous les pays** : il évite les confusions entre langues.

## Un lien de parenté
Partager des attributs, c’est partager un **ancêtre commun**.

> La classification ne range pas seulement : elle raconte une **histoire de famille**.`,
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
            cours: `Les espèces apparaissent, se transforment et disparaissent. L’immense majorité de celles qui ont existé sont éteintes.

## L’échelle du temps
@ Il y a 3,8 milliards d’années — Apparition de la vie sur Terre
@ Il y a 66 millions d’années — Une extinction de masse fait disparaître les dinosaures non-aviens
@ Ensuite — Les mammifères se diversifient dans la place libérée

## Les fossiles, nos archives
Un **fossile** est un reste ou une trace d’un être vivant du passé, conservé dans la roche : os, coquille, empreinte, terrier.

~ Une couche profonde = ancienne → une couche superficielle = récente

Les fossiles prouvent que des espèces différentes des actuelles ont vécu, et permettent de les **dater**.

## Comment ça marche
~ Les individus VARIENT → le milieu change → certaines variations donnent un avantage → ces individus laissent plus de descendants → sur des milliers de générations, l’espèce se transforme

!> **Ce n’est pas l’individu qui s’adapte au cours de sa vie.** C’est l’**espèce** qui change, parce que certains individus laissent plus de descendants que d’autres. La girafe n’a pas allongé son cou en tirant dessus.

## Les crises biologiques
= Cinq extinctions de masse ont éliminé une grande part du vivant

## La biodiversité aujourd’hui
La **biodiversité** est la variété du vivant. Elle diminue vite sous l’effet des activités humaines.

| La menace | |
| Destruction des **milieux** | |
| **Pollution** | |
| **Surexploitation** | |
| **Réchauffement** | |

> La protéger, c’est protéger les équilibres dont nous dépendons.`,
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
            cours: `Les aliments apportent des nutriments. L’organisme en a besoin pour fonctionner, grandir et se réparer.

## Les grandes familles de nutriments
| Le nutriment | Son rôle | Où on le trouve |
| Les **glucides** (sucres) | Le **carburant** principal | Pain, pâtes, riz, fruits |
| Les **lipides** (graisses) | Réserve d’énergie, constituants des membranes | Huile, beurre, fruits secs |
| Les **protides** (protéines) | Les **matériaux de construction** | Viande, poisson, œufs, légumineuses |
| Les **vitamines** et **minéraux** | En très petite quantité, mais indispensables | Calcium, fer |
| L’**eau** | Environ **60 %** de la masse du corps | |
| Les **fibres** | Elles ne nourrissent pas, mais font fonctionner l’intestin | |

## Le rôle de la digestion
!> Les aliments sont **trop gros** pour passer dans le sang.

~ La digestion réduit les aliments en nutriments → l’absorption les fait traverser la paroi de l’intestin grêle → le sang les distribue à tous les organes

## Une alimentation équilibrée
| Le repère | |
| Des **fruits et légumes** | À chaque repas |
| Des **féculents** | À chaque repas |
| Des **protéines** | Une à deux fois par jour |
| Gras, sucré, salé | **Peu** |
| L’**eau** | La seule boisson indispensable |

> Équilibré ne veut pas dire parfait à chaque repas, mais **varié sur la semaine**.

## Les besoins varient
Un adolescent en croissance, un sportif et une personne âgée n’ont pas les mêmes besoins. L’**activité physique**, l’**âge** et la **taille** les font changer.`,
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
            cours: `Le sang livre, les organes consomment. Toute la circulation tient dans cette phrase.

## Ce dont un organe a besoin
| Il reçoit | Il rejette |
| Du **dioxygène** | Du **dioxyde de carbone** |
| Des **nutriments** | De l’**urée** |

## Le sang, le livreur
Le **sang** circule dans les vaisseaux : il **apporte** dioxygène et nutriments, il **emporte** les déchets. Le **cœur** est la pompe qui le fait circuler sans arrêt.

## D’où vient le dioxygène
~ L’air → les poumons → les alvéoles pulmonaires → le sang

Les **alvéoles pulmonaires** sont de minuscules sacs très nombreux, à la paroi extrêmement fine. Le dioxyde de carbone fait le trajet **inverse**.

## D’où viennent les nutriments
~ Les aliments → la digestion → l’absorption dans l’intestin grêle → le sang

## Ce que devient l’énergie
= Nutriments + dioxygène → énergie + dioxyde de carbone + eau

C’est la **respiration cellulaire**, et elle a lieu **dans chaque organe**.

## Pendant l’effort
| Ce qui change | Pourquoi |
| Le **rythme cardiaque** augmente | Il faut livrer plus vite |
| La **respiration** s’accélère | Il faut plus de dioxygène |
| Le sang est **redistribué** | En priorité vers les muscles |

> Un cœur qui bat plus vite pendant un effort n’est pas un cœur en difficulté : c’est un cœur qui **livre plus vite**.

## L’élimination des déchets
| L’organe | Ce qu’il évacue |
| Les **reins** | Ils filtrent le sang et fabriquent l’**urine**, qui évacue l’**urée** |
| Les **poumons** | Ils évacuent le **dioxyde de carbone** |`,
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
            cours: `Une plante ne mange pas : elle produit. C’est le point de départ de toute la chaîne alimentaire.

## Deux grandes voies
| La voie | Ce qu’elle produit |
| L’**agriculture** | Des végétaux : céréales, légumes, fruits |
| L’**élevage** | Des animaux et leurs produits : viande, lait, œufs |

## Les besoins d’une plante cultivée
| Ce qu’il lui faut | D’où ça vient |
| La **lumière** | Le Soleil |
| L’**eau** | Le sol, par les racines |
| Le **dioxyde de carbone** | L’air |
| Les **sels minéraux** | Le sol, par les racines |

= Avec ces éléments et la lumière, la plante fabrique sa propre matière : c’est la PHOTOSYNTHÈSE

> Une plante est **productrice primaire** : elle ne mange pas, elle produit.

## Pourquoi on amende les sols
~ Les cultures prélèvent des sels minéraux → sans apport, le sol s’appauvrit → engrais et rotation des cultures

| Le remède | Ce qu’il fait |
| Les **engrais** | Organiques (fumier) ou minéraux |
| La **rotation des cultures** | Alterner les espèces pour ménager le sol |

## Le coût de l’élevage
!> À **chaque maillon** de la chaîne alimentaire, une grande partie de l’énergie est **perdue**. Nourrir un animal pour le manger ensuite coûte beaucoup plus de végétaux, d’eau et de surface que de manger directement des végétaux.

> C’est pourquoi un kilo de viande mobilise bien plus de ressources qu’un kilo de céréales.

## Les impacts et les choix
| Le modèle | Ce qu’il donne | Ce qu’il coûte |
| L’agriculture **intensive** | Beaucoup de production | Engrais et **pesticides** : eau polluée, biodiversité réduite |
| L’agriculture **biologique** | Elle s’en passe largement | Des rendements souvent inférieurs |

~ Manger local → manger de saison → limiter le gaspillage

= Un tiers de la nourriture produite est perdue`,
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
            cours: `Certains micro-organismes fabriquent nos aliments. D’autres les abîment. Toute la conservation est là.

## Les micro-organismes qui transforment
= La fermentation

| L’aliment | Le micro-organisme |
| Le **pain** | La **levure**, qui produit du dioxyde de carbone : la pâte lève |
| Le **yaourt**, le **fromage** | Des **bactéries** qui transforment le lait |
| Le vin, la bière, la choucroute | D’autres fermentations |

## Les micro-organismes qui abîment
| Ce dont ils ont besoin | |
| De la **chaleur** | |
| De l’**eau** | |
| Des **nutriments** | |

> Toute technique de conservation consiste à leur **retirer au moins l’un des trois**.

## Les techniques de conservation
| La technique | Ce qu’elle fait | Le détail |
| Le **réfrigérateur** (≈ 4 °C) | Il **ralentit** | |
| Le **congélateur** (−18 °C) | Il **arrête presque** | |
| La **pasteurisation** (≈ 70 °C) | Elle en **détruit** une grande partie | |
| La **stérilisation** (> 100 °C) | Elle les **élimine** | C’est la conserve |
| Le **séchage** | Il retire l’**eau** | Fruits secs, pâtes |
| Le **sel** et le **sucre** | Ils rendent l’eau indisponible | Jambon sec, confiture |
| Le **vide**, la **fumaison** | | |

!> **Le froid ne tue pas : il met en pause.** C’est pourquoi un produit décongelé ne doit **jamais** être recongelé — les micro-organismes ont repris leur multiplication.

## Lire une étiquette
| La mention | Ce qu’elle signifie |
| La **DLC** — « à consommer jusqu’au » | Produits frais : elle **ne se dépasse pas** |
| La **DDM** — « à consommer de préférence avant » | Une baisse de **qualité**, pas un danger |

## L’hygiène
~ Se laver les mains → respecter la chaîne du froid → séparer le cru et le cuit

Ces gestes simples évitent la plupart des intoxications alimentaires.`,
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
            cours: `La reproduction sexuée fabrique de la diversité ; l’asexuée fabrique des copies.

## Deux formes de reproduction
| La reproduction | Ce qu’elle demande | Ses descendants |
| **Sexuée** | **Deux** cellules reproductrices : un **spermatozoïde** et un **ovule** | Tous **différents** |
| **Asexuée** | **Un seul** individu — bouturage, division d’une bactérie, stolons du fraisier | **Identiques** au parent |

~ Spermatozoïde + ovule → fécondation → cellule-œuf → nouvel être vivant

## Où se fait la fécondation
| Le type | Où | Sa conséquence |
| **Externe** | Dans l’eau : les cellules sont libérées dans le milieu (poissons, grenouilles) | Il en faut **beaucoup**, car peu survivent |
| **Interne** | Dans le corps de la femelle (mammifères, oiseaux, reptiles, insectes) | Moins de descendants, **mieux protégés** |

## Le développement
| Le type | Ce qui se passe | Exemples |
| **Direct** | Le jeune ressemble à l’adulte, en plus petit | Chat, humain, oiseau |
| **Indirect** | Une **larve**, puis une **métamorphose** | Têtard → grenouille, chenille → papillon |

## Chez les plantes à fleurs
~ Le pollen atteint le pistil (pollinisation) → fécondation → l’ovaire devient un FRUIT et l’ovule une GRAINE

La **pollinisation** est assurée par le **vent** ou par les **insectes pollinisateurs**. La **dispersion** des graines — vent, animaux, eau — éloigne les jeunes plantes de la plante mère.

## Peuplement et saisons
| La forme de résistance | Qui l’emploie |
| **Graines**, **bulbes** | Les plantes |
| **Œufs** | De nombreux animaux |
| **Migration**, **hibernation** | Les animaux mobiles |

> C’est ainsi qu’un milieu se **repeuple** au printemps.`,
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
            cours: `La puberté commence entre 10 et 15 ans, à un âge qui varie beaucoup d’une personne à l’autre — et cette variation est normale.

## La puberté
C’est le passage de l’enfance à l’âge adulte.

| Ce qui change | Le détail |
| Une **croissance** rapide | |
| Les **caractères sexuels secondaires** | Pilosité, mue de la voix et développement musculaire chez le garçon ; développement des seins et élargissement du bassin chez la fille |
| Les **organes reproducteurs** entrent en fonction | Production de **spermatozoïdes** par les testicules ; premières **règles** chez la fille |

!> Il n’y a pas d’âge « normal » à la puberté : il y a une **fourchette**. Être en avance ou en retard sur ses camarades ne veut rien dire.

## Le cycle et les règles
~ Un ovaire libère un ovule (ovulation) → pas de fécondation → la paroi de l’utérus est évacuée : les RÈGLES

Cela se produit environ une fois par mois ; les règles durent quelques jours.

## De la fécondation à la naissance
~ Fécondation dans une trompe → la cellule-œuf se divise → nidation dans l’utérus → embryon → fœtus vers la fin du 2e mois → accouchement

| L’organe | Son rôle |
| Le **placenta** | Il assure les échanges avec la mère |
| Le **cordon ombilical** | Il apporte dioxygène et nutriments, évacue les déchets |

= La grossesse dure environ 9 mois

## Contraception et protection
| Le moyen | Ce qu’il évite |
| La **pilule**, et les autres contraceptifs | Une **grossesse** |
| Le **préservatif** | Une grossesse **ET** les infections sexuellement transmissibles |

!> Le **préservatif est le seul** moyen qui protège **aussi** des IST. Deux fonctions différentes, un seul objet qui remplit les deux.

## Respect et consentement
> Le corps de chacun lui appartient. Le **consentement** est libre, éclairé, et peut être **retiré à tout moment**. Aucune pression, aucune moquerie sur le corps d’autrui n’est acceptable.`,
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
