// Enseignement scientifique — PREMIÈRE générale (tronc commun).
//
// CE QU'IL Y AVAIT (node _ASSOCIE/sonde-chapitres.mjs 1re enseignement-scientifique,
// 20/08/2026) : QUATRE chapitres composites hérités des migrations 008 / 142 —
// « La Terre, un astre singulier », « Le Soleil, source d'énergie », « Une
// longue histoire de la matière », « Son et musique ». Chacun résumait tout un
// thème du programme en UNE fiche, et le cinquième chapitre — les
// MATHÉMATIQUES, entrées dans l'enseignement scientifique de première à la
// rentrée 2023 pour les élèves qui ne prennent pas la spécialité — n'existait
// nulle part. Un élève qui révisait les cristaux, la loi de Wien, l'albédo, la
// gamme de Pythagore, l'échantillonnage d'un son, le taux d'évolution ou le
// nombre dérivé ne trouvait rien.
//
// LE DÉCOUPAGE EN 5 CHAPITRES × 22 FICHES vient de la maquette transmise par
// Lucas, qui suit le sommaire du cours. Il colle au BO : quatre thèmes (« Une
// longue histoire de la matière », « Le Soleil, notre source d'énergie », « La
// Terre, un astre singulier », « Son et musique, porteurs d'informations »),
// plus la partie mathématique. Le « projet expérimental et numérique » n'est
// pas un chapitre de cours mais un travail d'année, sans fiche à réviser — même
// arbitrage qu'en Terminale (248).
//
// PÉRIMÈTRE : LA PREMIÈRE SEULE. Le ménage est borné à `level = '1re'`. La
// Terminale a été traitée par les migrations 228 (les 16 fiches) et 248 (leurs
// six chapitres) et ne bouge pas.
//
// Cette matière est bicéphale — physique-chimie, SVT, histoire des sciences et
// maintenant mathématiques dans un même programme. Chaque cours reste donc
// ancré sur des ORDRES DE GRANDEUR chiffrés (1 360 W/m², 5 800 K, 40 000 km,
// 4,54 milliards d'années, 340 m/s, 44,1 kHz) : l'épreuve porte moins sur des
// définitions que sur l'exploitation de données, et un élève sans repères
// chiffrés ne sait pas commenter un graphique.
//
// Pas de LaTeX (LessonRichContent ne le rend pas) : u(n) = u0 × q^n, P = σ × T^4.

export default {
  slug: 'enseignement-scientifique',
  nom: 'Ens. scientifique',

  titreMigration: 'ENSEIGNEMENT SCIENTIFIQUE 1re — LES 22 FICHES DU PROGRAMME',

  motif: `CONSTAT MESURÉ (node _ASSOCIE/sonde-chapitres.mjs 1re enseignement-scientifique,
20/08/2026) : l'enseignement scientifique de PREMIÈRE n'avait que QUATRE
chapitres, taillés dans un découpage maison hérité des migrations 008 et 142
(« La Terre, un astre singulier », « Le Soleil, source d'énergie », « Une
longue histoire de la matière », « Son et musique »). Chacun résumait tout un
thème du programme en une seule fiche, et la partie MATHÉMATIQUES — entrée
dans l'enseignement scientifique de première à la rentrée 2023 pour les élèves
sans spécialité maths, soit huit fiches du taux d'évolution à la fonction
dérivée — n'avait AUCUNE entrée. Un élève qui révisait les cristaux, la loi de
Wien, l'albédo, la photosynthèse, la thermorégulation, Ératosthène, la
radiochronologie, la gamme tempérée, l'échantillonnage d'un son, la cochlée ou
le nombre dérivé ne trouvait rien.

Cette migration installe les 22 fiches du programme, rangées sous leurs 5
chapitres, et retire les 4 fiches composites qu'elles recouvrent.

⚠️ CE QUI EST PERDU AU PASSAGE : les 4 leçons « Exercices types » (aucun quiz
en base, sondé le 20/08/2026) et les 40 questions des 4 leçons « L'essentiel
du cours » — 10 par chapitre composite.

⚠️ LES MIGRATIONS 008 ET 142 SONT REJOUABLES : les recoller un jour ferait
revenir les 4 fiches composites en doublon.`,

  menage: [
    {
      raison: `La colonne chapters.theme (migration 234) conditionne tout ce qui suit :
ce module range ses 22 fiches sous 5 chapitres, et l'INSERT écrit la colonne.
Elle est REPRISE ici en ADD COLUMN IF NOT EXISTS, comme dans les migrations 243
à 256 : la 234 elle-même n'a jamais été exécutée. Sans cette reprise, la
migration échouerait sur "column chapters.theme does not exist" APRÈS avoir
supprimé les 4 fiches composites — une matière vide.
Le GRANT n'est pas décoratif : la 182 a révoqué le SELECT de table sur chapters
(pour cacher mind_map) et ne l'a rendu que colonne par colonne ; une colonne
ajoutée après elle n'hérite d'aucun droit, et l'app lirait « permission denied »
au lieu du chapitre.`,
      sql: `ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;`,
    },
    {
      raison: `Les 4 fiches composites partent, au niveau 1re SEULEMENT.

LE REPÈRE EST theme IS NULL, PAS LE TITRE — et c'est un choix, pas une
paresse. Les quatre titres en base sont « La Terre, un astre singulier »,
« Le Soleil, source d'énergie », « Une longue histoire de la matière » et
« Son et musique » : le deuxième porte une apostrophe DROITE (relevé
caractère par caractère en base le 20/08/2026), là où le reste du contenu
récent porte l'apostrophe typographique. Un ménage par titre ne trouverait pas
la ligne EN SILENCE — c'est le piège de la 249 — et laisserait une fiche
composite en tête du dossier. Le critère « pas de chapitre de programme » vise
exactement les mêmes quatre lignes, sans dépendre d'un caractère.
Il est sûr dans les deux sens : au premier passage, les seuls chapitres de
1re de cette matière sont les 4 composites, antérieures à la 234, qui n'ont
jamais eu d'axe (theme IS NULL, vérifié) ; au rejeu, les 22 fiches neuves
portent toutes leur chapitre dès l'INSERT et sont donc hors de portée. Le
ménage tourne AVANT les insertions, il ne peut jamais mordre sur elles.
Le filtre level = '1re' est indispensable : la Terminale de la même matière est
déjà rangée (228 + 248) et ne doit pas bouger.
L'ordre compte : la file « À revoir » d'abord (review_items.item_id n'a PAS de
clé étrangère — rien ne casserait, mais le compteur « X à revoir » continuerait
de compter des questions disparues), puis les quiz (quizzes.lesson_id est ON
DELETE SET NULL : ils survivraient orphelins, rattachés à aucune leçon et
toujours tirables par le moteur de questions), puis les chapitres, dont les
leçons partent en cascade.`,
      sql: `DELETE FROM public.review_items ri
 USING public.quiz_questions qq, public.quizzes qz, public.lessons l,
       public.chapters c, public.subjects s
 WHERE ri.item_kind = 'question'
   AND ri.item_id = qq.id
   AND qq.quiz_id = qz.id
   AND qz.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'enseignement-scientifique'
   AND c.level = '1re'
   AND c.theme IS NULL;

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'enseignement-scientifique'
   AND c.level = '1re'
   AND c.theme IS NULL;

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'enseignement-scientifique'
   AND c.level = '1re'
   AND c.theme IS NULL;`,
    },
  ],

  blocs: [
    {
      niveaux: ['1re'],
      chapitres: [
        // ===================================================================
        // Chapitre 1 — Une longue histoire de la matière
        // ===================================================================
        {
          titre: 'Un niveau d’organisation : les éléments chimiques',
          axe: 'Une longue histoire de la matière',
          lecon: {
            titre: 'Les éléments chimiques, fabriqués par les étoiles',
            cours: `Tous les atomes qui composent votre corps ont été fabriqués **ailleurs**, et **avant vous** : dans les trois premières minutes de l’Univers pour les plus légers, au cœur des étoiles pour tous les autres.

## Un élément, c’est un numéro atomique
Un **élément chimique** est défini par son **numéro atomique Z** — son nombre de **protons**. Tout noyau à 6 protons est du carbone, quel que soit son nombre de neutrons.

| Notion | Sa définition |
| **Élément** | Même nombre de **protons** |
| **Isotopes** | Même Z, **nombre de neutrons différent** — carbone 12 et carbone 14 |
| La **conservation** | L’élément se conserve dans une transformation chimique : brûler du carbone ne le détruit pas, il passe dans le CO2 |

## Les trois fabriques successives
| Fabrique | Quand | Ce qu’elle produit |
| **Nucléosynthèse primordiale** | Les 3 premières minutes après le Big Bang, il y a **13,8 milliards d’années** | **Hydrogène** et **hélium** seulement |
| **Nucléosynthèse stellaire** | Pendant la vie de l’étoile | Par **fusion**, jusqu’au **fer** |
| **Explosions d’étoiles** | Supernovae, fusions d’astres compacts | Les éléments **plus lourds que le fer** — or, uranium |

> Pourquoi le fer arrête tout : **au-delà du fer, la fusion consomme de l’énergie** au lieu d’en libérer. L’étoile ne peut plus s’en servir pour tenir.

## Des abondances très inégales
| Inventaire | Les éléments dominants |
| Dans l’**Univers** | **92 %** des atomes sont de l’**hydrogène**, près de 8 % d’hélium — tout le reste pèse **moins de 1 %** |
| Dans la **croûte terrestre** | **Oxygène** (environ 47 % en masse) et **silicium** (environ 28 %) |
| Dans le **corps humain** | **O, C, H, N** font plus de **99 %** de la masse |

> Trois inventaires, **trois classements différents** : la matière s’est **triée** en se rassemblant.

## Un chronomètre dans le noyau
Certains noyaux sont **radioactifs** : ils se désintègrent spontanément, **au hasard**, mais à un rythme statistique fixe.

La **demi-vie** T est la durée au bout de laquelle **la moitié** des noyaux s’est désintégrée : N = N0 × (1/2)^(t/T).

| Temps écoulé | Noyaux restants |
| 1 demi-vie | la **moitié** |
| 2 demi-vies | le **quart** |
| 3 demi-vies | le **huitième** |

> Ni la température, ni la pression, ni la chimie ne modifient cette durée. C’est ce qui en fait une **horloge** — et c’est de là que viendra l’âge de la Terre.`,
          },
          questions: [
            ['Qu’est-ce qui définit un élément chimique ?', ['Son nombre de protons (numéro atomique Z)', 'Son nombre de neutrons', 'Son nombre total de nucléons', 'Sa masse volumique'], 0, 'Deux noyaux de même Z sont le même élément, même si leurs nombres de neutrons diffèrent : ce sont des isotopes.'],
            ['Quels éléments ont été formés dans les premières minutes de l’Univers ?', ['L’hydrogène et l’hélium', 'Le carbone et l’oxygène', 'Le fer et le nickel', 'L’or et l’uranium'], 0, 'La nucléosynthèse primordiale ne va pas plus loin : tout le reste viendra des étoiles.'],
            ['Jusqu’à quel élément la fusion au cœur des étoiles libère-t-elle de l’énergie ?', ['Le fer', 'Le carbone', 'L’uranium', 'L’hélium'], 0, 'Au-delà du fer, la fusion consommerait de l’énergie : les éléments plus lourds naissent dans les explosions d’étoiles.'],
            ['Quel élément représente environ 92 % des atomes de l’Univers ?', ['L’hydrogène', 'L’hélium', 'L’oxygène', 'Le carbone'], 0, 'L’hélium suit avec près de 8 % ; tout le reste pèse moins de 1 % des atomes.'],
            ['Quels sont les deux éléments les plus abondants en masse dans la croûte terrestre ?', ['L’oxygène et le silicium', 'L’hydrogène et l’hélium', 'Le fer et le nickel', 'Le carbone et l’azote'], 0, 'Environ 47 % d’oxygène et 28 % de silicium : la croûte est faite de silicates.'],
            ['Que reste-t-il d’un échantillon radioactif au bout de deux demi-vies ?', ['Un quart des noyaux initiaux', 'La moitié', 'Un huitième', 'Plus rien'], 0, 'Une demi-vie divise par deux, deux demi-vies par quatre : la décroissance est multiplicative, jamais linéaire.'],
            ['On peut accélérer la désintégration d’un noyau radioactif en le chauffant fortement.', ['Vrai', 'Faux'], 1, 'La demi-vie ne dépend ni de la température, ni de la pression, ni des liaisons chimiques : c’est ce qui en fait une horloge fiable.'],
            ['Quels quatre éléments forment plus de 99 % de la masse du corps humain ?', ['Oxygène, carbone, hydrogène, azote', 'Fer, calcium, sodium, potassium', 'Silicium, oxygène, aluminium, fer', 'Hydrogène, hélium, carbone, azote'], 0, 'Ce sont les éléments de l’eau et des molécules organiques.'],
          ],
        },
        {
          titre: 'Les édifices ordonnés : les cristaux',
          axe: 'Une longue histoire de la matière',
          lecon: {
            titre: 'Quand la matière s’organise en réseau',
            cours: `Un cristal, ce n’est **pas une pierre précieuse** : c’est un **empilement ordonné et périodique** d’atomes, d’ions ou de molécules. Le sel de table en est un, le sable aussi, et l’os également.

## Cristallin ou amorphe
| | **Cristallin** | **Amorphe** |
| L’organisation | Le motif se répète **à l’identique** dans les trois directions | Les atomes sont **figés en désordre** |
| L’image | Un **ordre à longue distance** | Un **liquide arrêté net** |
| L’exemple | Le **quartz** | Le **verre**, l’obsidienne |

> Une **même espèce chimique** peut donner les deux : le dioxyde de silicium donne le quartz **ou** le verre, selon la **vitesse de refroidissement**.

## Maille, motif, compacité
La **maille** est le plus petit volume qui, répété par translation, reconstruit tout le cristal.

| Maille | Le compte des atomes | Compacité |
| **Cubique simple** | 8 × 1/8 = **1 atome** | environ **0,52** |
| **Cubique à faces centrées** | 8 × 1/8 + 6 × 1/2 = **4 atomes** | environ **0,74** — l’empilement le plus dense |

> De la maille se déduit la **masse volumique** : ρ = (masse des atomes de la maille) / (volume de la maille).

## Les cristaux des roches
Une roche est un **assemblage de cristaux** — et leur **taille raconte son histoire**.

| Roche | Son refroidissement | Sa texture |
| **Granite** | **Lent**, en profondeur | Entièrement cristallisé, **gros grains** : quartz, feldspaths, micas |
| **Basalte** | **Rapide**, en surface | **Petits cristaux** noyés dans un **verre** |

> Même magma, **deux textures**. La vitesse de refroidissement est la seule variable.

## Les cristaux du vivant
| Biominéral | Où on le trouve |
| **Carbonate de calcium** (CaCO3) | Coquilles de mollusques, tests d’oursins |
| **Phosphate de calcium** | L’**os** et l’**émail** dentaire |

Ces cristaux se déposent sur une **trame organique**.

> C’est ce qui leur donne des propriétés que le minéral seul n’a pas : la **nacre résiste bien mieux à la fracture** que l’aragonite pure.`,
          },
          questions: [
            ['Qu’est-ce qui caractérise un solide cristallin ?', ['Un empilement ordonné et périodique de son motif', 'Une absence totale d’organisation', 'Une parfaite transparence', 'Une origine forcément minérale'], 0, 'C’est l’ordre à longue distance qui définit le cristal, pas son aspect ni sa provenance.'],
            ['Combien d’atomes contient une maille cubique à faces centrées ?', ['4', '1', '2', '8'], 0, '8 sommets comptés 1/8 et 6 faces comptées 1/2 : 1 + 3 = 4 atomes.'],
            ['Quelle est la compacité d’une maille cubique simple ?', ['Environ 0,52', 'Environ 0,74', 'Environ 0,32', '1'], 0, 'Un peu plus de la moitié du volume est occupée ; la maille cubique à faces centrées atteint 0,74.'],
            ['Pourquoi le granite présente-t-il de gros cristaux visibles à l’œil nu ?', ['Parce que le magma a refroidi lentement en profondeur', 'Parce qu’il a refroidi très vite en surface', 'Parce qu’il est d’origine sédimentaire', 'Parce qu’il ne contient qu’un seul minéral'], 0, 'Le temps de refroidissement contrôle la taille des cristaux : lent en profondeur, rapide en surface.'],
            ['Le verre est un solide cristallin.', ['Vrai', 'Faux'], 1, 'Il est amorphe : ses atomes sont figés en désordre, comme dans un liquide immobilisé.'],
            ['Quels minéraux dominent dans le granite ?', ['Quartz, feldspaths et micas', 'Calcite et gypse', 'Olivine et pyroxène seuls', 'Halite et sylvite'], 0, 'Ces trois familles suffisent à reconnaître un granite à l’œil.'],
            ['De quoi sont faites les coquilles de mollusques ?', ['De carbonate de calcium', 'De silice pure', 'De phosphate de fer', 'De carbone amorphe'], 0, 'CaCO3, cristallisé en calcite ou en aragonite sur une trame organique.'],
            ['Que représente la maille d’un cristal ?', ['Le plus petit volume qui, répété, reconstruit le cristal', 'La plus grosse pièce visible du minéral', 'La surface externe du cristal', 'Le nombre d’électrons de l’atome'], 0, 'Tout le cristal se déduit de la maille par translations successives.'],
          ],
        },
        {
          titre: 'Une structure complexe : la cellule vivante',
          axe: 'Une longue histoire de la matière',
          lecon: {
            titre: 'La cellule, plus petite unité capable de vivre',
            cours: `Après l’atome et le cristal, le programme monte d’un cran : la matière du vivant s’organise elle aussi — mais en une structure capable de **se maintenir** et de **se reproduire**.

## Une théorie née du microscope
| Date | Qui | Ce qu’il établit |
| vers **1838** | Schleiden et Schwann | Tous les êtres vivants sont **constitués de cellules** |
| **1855** | Virchow | **Toute cellule provient d’une cellule** préexistante |

> Autrement dit : la **lignée cellulaire est ininterrompue** depuis les origines de la vie.

## Des ordres de grandeur à connaître
| Objet | Sa taille |
| Une cellule **animale** | **10 à 100 µm** |
| Une **bactérie** | environ **1 µm** |
| La **membrane** plasmique | environ **7,5 nm** |
| Le pouvoir de résolution du microscope **optique** | **0,2 µm** |

> Le microscope optique montre la **cellule**, jamais sa **membrane** : il a fallu le microscope **électronique** pour cela.

## La membrane, une frontière qui se forme toute seule
La membrane est une **bicouche de phospholipides**, molécules **amphiphiles**.

| Partie de la molécule | Son comportement dans l’eau |
| La **tête hydrophile** | Elle se tourne **vers l’eau** |
| Les deux **queues hydrophobes** | Elles la **fuient** |

> Placées dans l’eau, elles s’organisent **spontanément** en bicouche — **sans qu’aucune information ne le commande**. C’est la propriété la plus contre-intuitive du chapitre.

La membrane délimite un **milieu intérieur** distinct de l’extérieur et **contrôle les échanges** : c’est la condition première d’une cellule.

## Le métabolisme
L’ensemble des réactions chimiques d’une cellule.

| Type | Ce que la cellule fait | Exemple |
| **Autotrophie** | Elle **fabrique** sa matière organique à partir de minéral et d’une source d’énergie | La cellule chlorophyllienne, par **photosynthèse** |
| **Hétérotrophie** | Elle **prélève** sa matière organique dans le milieu | Puis la dégrade par **respiration** (avec O2) ou **fermentation** (sans) |

> Le métabolisme dépend de **deux** choses : le **patrimoine génétique** — les enzymes disponibles — et les **conditions du milieu** : lumière, dioxygène, nutriments.`,
          },
          questions: [
            ['Qu’affirme la théorie cellulaire complétée par Virchow en 1855 ?', ['Toute cellule provient d’une cellule préexistante', 'Les cellules naissent spontanément de la matière inerte', 'Seuls les animaux sont formés de cellules', 'Une cellule peut vivre sans membrane'], 0, 'C’est la fin de la génération spontanée : la continuité du vivant est cellulaire.'],
            ['Quelle est la taille typique d’une cellule animale ?', ['10 à 100 µm', '1 à 5 nm', '1 à 2 mm', '0,1 à 1 µm'], 0, 'Une bactérie est dix à cent fois plus petite, autour de 1 µm.'],
            ['De quoi la membrane plasmique est-elle principalement constituée ?', ['D’une bicouche de phospholipides', 'D’une paroi de cellulose', 'D’un feuillet d’ADN', 'D’une couche de cristaux de calcite'], 0, 'Des protéines s’y insèrent, mais l’ossature est la bicouche lipidique.'],
            ['Que signifie « molécule amphiphile » ?', ['Elle possède une partie hydrophile et une partie hydrophobe', 'Elle est soluble dans tous les solvants', 'Elle change de forme avec la température', 'Elle ne réagit avec rien'], 0, 'C’est cette double nature qui fait s’organiser spontanément la bicouche dans l’eau.'],
            ['Quelle est la limite de résolution d’un microscope optique ?', ['Environ 0,2 µm', 'Environ 7,5 nm', 'Environ 1 mm', 'Environ 10 µm'], 0, 'Il montre donc la cellule et son noyau, mais pas l’épaisseur de la membrane.'],
            ['Qu’est-ce que le métabolisme d’une cellule ?', ['L’ensemble de ses réactions chimiques', 'Sa vitesse de division', 'Sa taille au repos', 'Le nombre de ses chromosomes'], 0, 'Il dépend du patrimoine génétique de la cellule et des conditions du milieu.'],
            ['Une cellule chlorophyllienne éclairée est autotrophe pour le carbone.', ['Vrai', 'Faux'], 0, 'Elle fabrique sa matière organique à partir du CO2 minéral, grâce à l’énergie lumineuse.'],
            ['Quelle voie métabolique dégrade la matière organique SANS dioxygène ?', ['La fermentation', 'La respiration', 'La photosynthèse', 'La cristallisation'], 0, 'Elle libère beaucoup moins d’énergie que la respiration, et produit lactate ou éthanol.'],
          ],
        },
        // ===================================================================
        // Chapitre 2 — Le Soleil, notre source d’énergie
        // ===================================================================
        {
          titre: 'Le rayonnement solaire',
          axe: 'Le Soleil, notre source d’énergie',
          lecon: {
            titre: 'Une étoile qui perd de la masse pour nous éclairer',
            cours: `Le Soleil rayonne **3,8 × 10^26 watts** depuis 4,6 milliards d’années. Cette puissance n’a **rien de chimique** : aucune combustion ne tiendrait plus de quelques milliers d’années.

## La fusion, et la masse qui manque
Au cœur du Soleil, à environ **15 millions de degrés**, **quatre** noyaux d’hydrogène fusionnent en **un** noyau d’hélium.

> L’hélium formé est **moins massif** que les quatre noyaux de départ. Cette masse manquante devient de l’énergie : **E = m × c²**, avec c = 3,0 × 10^8 m/s.

| Grandeur | Sa valeur |
| Masse perdue par le Soleil | environ **4 millions de tonnes par seconde** |
| Masse totale du Soleil | 2 × 10^30 kg |

Une paille, donc, à l’échelle de l’astre.

## Les deux lois du rayonnement
| Loi | Sa formule | Ce qu’elle donne |
| **Wien** | λmax × T = **2,9 × 10^-3** m·K | La **couleur** dit la **température** |
| **Stefan** | P/S = **σ × T⁴**, σ = 5,67 × 10^-8 | La **puissance** par mètre carré |

| Température de surface | Où se situe le maximum d’émission |
| **3 000 K** | Rouge et infrarouge |
| **5 800 K** — le Soleil | λmax environ **500 nm** : le **vert-jaune**, en plein visible |
| **10 000 K** | Le bleu |

> Stefan est une puissance **quatrième** : **doubler la température multiplie la puissance émise par 16**.

## Ce qui arrive jusqu’à nous
À 150 millions de km, la puissance reçue par mètre carré **face au Soleil** vaut **1 360 W/m²** : c’est la **constante solaire**. Elle ne dépend que de la distance, et décroît comme 1/d².

## Pourquoi il fait plus chaud à l’équateur
Cette puissance ne se répartit **pas également** : plus la latitude est élevée, plus les rayons arrivent **inclinés** et étalent la **même énergie** sur une **plus grande surface**.

> La puissance reçue par mètre carré de sol est proportionnelle au **cosinus de l’angle d’incidence**. C’est cette inégalité, **et elle seule**, qui crée les **zones climatiques** et les **saisons**.`,
          },
          questions: [
            ['Quelle réaction produit l’énergie du Soleil ?', ['La fusion de l’hydrogène en hélium', 'La fission de l’uranium', 'La combustion du carbone', 'La désintégration du potassium'], 0, 'La masse perdue au cours de la fusion est convertie en énergie selon E = mc².'],
            ['Que donne la loi de Wien ?', ['La longueur d’onde du maximum d’émission selon la température', 'La puissance totale émise par une étoile', 'La distance d’une étoile', 'La masse d’une étoile'], 0, 'λmax × T = 2,9 × 10^-3 m·K : la couleur d’un corps chaud renseigne sur sa température.'],
            ['Quelle est la valeur de la constante solaire au-dessus de l’atmosphère ?', ['Environ 1 360 W/m²', 'Environ 340 W/m²', 'Environ 240 W/m²', 'Environ 5 800 W/m²'], 0, 'C’est la puissance reçue par un mètre carré placé face au Soleil, à 150 millions de kilomètres.'],
            ['Si on double la température de surface d’une étoile, par combien la puissance émise par mètre carré est-elle multipliée ?', ['16', '2', '4', '8'], 0, 'La loi de Stefan est en T⁴ : 2⁴ = 16.'],
            ['Pourquoi un mètre carré de sol reçoit-il moins d’énergie aux pôles qu’à l’équateur ?', ['Parce que les rayons y arrivent inclinés et s’étalent sur une plus grande surface', 'Parce que le Soleil y est plus éloigné', 'Parce que l’atmosphère y est plus épaisse', 'Parce que le Soleil y rayonne moins'], 0, 'La puissance reçue varie avec le cosinus de l’angle d’incidence : c’est l’origine des zones climatiques.'],
            ['Quelle est approximativement la température de surface du Soleil ?', ['5 800 K', '15 millions de K', '300 K', '1 000 K'], 0, '15 millions de kelvins, c’est le cœur, où a lieu la fusion ; la surface est bien plus froide.'],
            ['Le Soleil perd de la masse en rayonnant.', ['Vrai', 'Faux'], 0, 'Environ 4 millions de tonnes par seconde, converties en énergie selon E = mc².'],
            ['Comment évolue la constante solaire si l’on s’éloigne deux fois plus du Soleil ?', ['Elle est divisée par 4', 'Elle est divisée par 2', 'Elle est divisée par 8', 'Elle ne change pas'], 0, 'La puissance reçue par unité de surface décroît comme 1/d².'],
          ],
        },
        {
          titre: 'Le bilan radiatif de la Terre',
          axe: 'Le Soleil, notre source d’énergie',
          lecon: {
            titre: 'Ce que la Terre reçoit, renvoie et garde',
            cours: `La Terre ne se réchauffe ni ne se refroidit tant qu’elle **renvoie vers l’espace exactement autant d’énergie qu’elle en reçoit**. Tout le sujet du climat tient dans cette égalité — et dans le petit écart qui s’y est glissé.

## Des 1 360 aux 340 watts
La Terre **intercepte** le rayonnement sur un **disque** (π R²) mais le **répartit** sur une **sphère** (4 π R²), quatre fois plus grande, en tournant sur elle-même.

> Puissance moyenne reçue : 1 360 / 4 = **340 W/m²**.

## Le bilan en trois nombres
| Flux | Sa valeur | Ce qu’il devient |
| Reçu en moyenne | **340 W/m²** | — |
| Réfléchi — l’**albédo**, environ **30 %** | **100 W/m²** | Renvoyé **sans être absorbé** |
| Réellement **absorbé** | **240 W/m²** | Il chauffe le système |

| Surface | Son albédo |
| **Neige fraîche** | proche de **0,9** |
| **Océan** | environ **0,1** |

> Fondre la banquise, c’est **baisser l’albédo**, donc **absorber davantage**, donc réchauffer encore : c’est une **rétroaction positive**.

## Le rayonnement de la Terre et l’effet de serre
À 288 K, la Terre rayonne à son tour — mais dans l’**infrarouge** : loi de Wien, λmax environ **10 µm**.

| Étape | Ce qui se passe |
| Les **gaz à effet de serre** absorbent cet infrarouge | Vapeur d’eau, **CO2**, méthane, protoxyde d’azote |
| Ils le **réémettent dans toutes les directions** | Donc en partie **vers le sol** |
| Le sol reçoit **deux** apports | Le Soleil **et** l’atmosphère |

| Sans effet de serre | Avec effet de serre |
| **−18 °C** | **+15 °C** |

> L’effet de serre **naturel** vaut **33 °C** — et il est la condition de l’**eau liquide**.

## Le déséquilibre actuel
| Grandeur | Sa valeur |
| Teneur en CO2, ère préindustrielle | environ **280 ppm** |
| Teneur actuelle | plus de **420 ppm** |
| Excédent d’énergie | de l’ordre de **1 W/m²** |

> Cet écart **minuscule**, accumulé sur toute la surface et sur des décennies, **est** le réchauffement climatique.`,
          },
          questions: [
            ['Pourquoi la puissance solaire moyenne reçue par la Terre est-elle de 340 W/m² et non de 1 360 ?', ['Parce que l’énergie interceptée par un disque se répartit sur une sphère quatre fois plus grande', 'Parce que l’atmosphère en absorbe les trois quarts', 'Parce que le Soleil ne brille que la moitié du temps', 'Parce que l’albédo vaut 75 %'], 0, 'π R² d’interception pour 4 π R² de surface : le rapport est exactement 4.'],
            ['Qu’est-ce que l’albédo ?', ['La fraction du rayonnement solaire réfléchie sans être absorbée', 'La chaleur emmagasinée par les océans', 'La part d’infrarouge émise par le sol', 'La puissance de la fusion solaire'], 0, 'Il vaut environ 0,30 pour la Terre entière, 0,9 pour la neige fraîche et 0,1 pour l’océan.'],
            ['Quelle serait la température moyenne de surface de la Terre sans effet de serre ?', ['Environ −18 °C', 'Environ 0 °C', 'Environ +15 °C', 'Environ −60 °C'], 0, 'L’effet de serre naturel apporte les 33 °C qui rendent l’eau liquide possible.'],
            ['Dans quel domaine la Terre émet-elle son rayonnement thermique ?', ['L’infrarouge', 'Le visible', 'L’ultraviolet', 'Les rayons X'], 0, 'À 288 K, la loi de Wien place le maximum vers 10 µm, donc dans l’infrarouge.'],
            ['Quelle était la teneur de l’atmosphère en CO2 avant l’ère industrielle ?', ['Environ 280 ppm', 'Environ 420 ppm', 'Environ 30 ppm', 'Environ 1 000 ppm'], 0, 'Elle dépasse aujourd’hui 420 ppm, soit une hausse de 50 %.'],
            ['La fonte de la banquise amplifie le réchauffement.', ['Vrai', 'Faux'], 0, 'La glace claire cède la place à un océan sombre : l’albédo baisse, l’absorption augmente. C’est une rétroaction positive.'],
            ['Quelle puissance la Terre absorbe-t-elle réellement, en moyenne, par mètre carré ?', ['Environ 240 W/m²', 'Environ 340 W/m²', 'Environ 100 W/m²', 'Environ 1 360 W/m²'], 0, '340 reçus moins 100 réfléchis par l’albédo.'],
            ['Que font les gaz à effet de serre au rayonnement infrarouge du sol ?', ['Ils l’absorbent puis le réémettent dans toutes les directions', 'Ils le réfléchissent intégralement vers l’espace', 'Ils le transforment en lumière visible', 'Ils le laissent passer sans interagir'], 0, 'Une part revient vers le sol : le sol est chauffé deux fois, par le Soleil et par l’atmosphère.'],
          ],
        },
        {
          titre: 'La photosynthèse : une conversion de l’énergie solaire',
          axe: 'Le Soleil, notre source d’énergie',
          lecon: {
            titre: 'Comment la lumière devient de la matière',
            cours: `La photosynthèse est la **seule porte d’entrée notable** de l’énergie solaire dans la matière vivante. Tout ce que nous mangeons, brûlons ou respirons en dépend.

## L’équation à connaître
**6 CO2 + 6 H2O → C6H12O6 + 6 O2**, en présence de **lumière** et de **chlorophylle**

| Ce qui entre | Ce qui sort |
| Du **minéral** : dioxyde de carbone et eau | De l’**organique** : le glucose |
| De l’**énergie lumineuse** | Du **dioxygène**, sous-produit |

> L’énergie lumineuse est **stockée dans les liaisons chimiques** de la matière organique. C’est là tout le mécanisme.

## Où et grâce à quoi
La réaction a lieu dans les **chloroplastes**.

| Couleur | Ce que les pigments en font |
| **Bleu** et **rouge** | **Absorbés** |
| **Vert** | **Réfléchi** — d’où la couleur des feuilles |

> Une **chromatographie** sépare les pigments — chlorophylles a et b, caroténoïdes. Superposer le **spectre d’action** au **spectre d’absorption** montre que l’activité suit **exactement** les longueurs d’onde absorbées.

## Un rendement très faible
| Grandeur | Sa valeur |
| Part de l’énergie solaire **stockée** en matière organique | **moins de 1 %** |
| **Production primaire** de la planète | de l’ordre de **100 milliards de tonnes de carbone par an** |
| Sa répartition | À parts à peu près **égales** entre continents et océans (phytoplancton) |

> Ce rendement dérisoire alimente pourtant **toute la biosphère**.

## Le stock : biomasse, fossiles, biocarburants
| Forme | Son origine |
| La **biomasse** | La matière organique produite, aliment ou combustible |
| Le **charbon** | Surtout les forêts du **Carbonifère**, il y a environ **350 millions d’années** |
| Le **pétrole** | Le **plancton marin** enfoui |

> Brûler un litre d’essence, c’est libérer en quelques **secondes** une énergie solaire captée il y a des **millions d’années** : le stock se consomme **infiniment plus vite** qu’il ne se reconstitue.`,
          },
          questions: [
            ['Quelle est l’équation bilan de la photosynthèse ?', ['6 CO2 + 6 H2O → C6H12O6 + 6 O2', 'C6H12O6 + 6 O2 → 6 CO2 + 6 H2O', '2 H2 + O2 → 2 H2O', 'CO2 + CaO → CaCO3'], 0, 'La seconde équation est celle de la respiration, exactement l’inverse.'],
            ['Pourquoi les feuilles sont-elles vertes ?', ['Les pigments absorbent le bleu et le rouge, et réfléchissent le vert', 'La chlorophylle est un pigment vert qui absorbe le vert', 'Le vert est la couleur dominante de la lumière solaire', 'Les feuilles émettent leur propre lumière verte'], 0, 'Le spectre d’absorption montre deux pics, dans le bleu et dans le rouge.'],
            ['Quel est l’ordre de grandeur du rendement de la photosynthèse ?', ['Moins de 1 % de l’énergie lumineuse reçue', 'Environ 30 %', 'Environ 70 %', 'Environ 10 %'], 0, 'Rendement minuscule, mais appliqué à une surface planétaire : environ 100 Gt de carbone fixées par an.'],
            ['Dans quel organite la photosynthèse a-t-elle lieu ?', ['Le chloroplaste', 'La mitochondrie', 'Le noyau', 'Le ribosome'], 0, 'La mitochondrie, elle, est le siège de la respiration cellulaire.'],
            ['D’où vient principalement le charbon ?', ['De forêts enfouies au Carbonifère', 'Du plancton des océans actuels', 'De coulées volcaniques refroidies', 'De cristaux de carbone formés en profondeur'], 0, 'Environ 350 millions d’années : c’est de l’énergie solaire fossile.'],
            ['La photosynthèse consomme du dioxygène et rejette du dioxyde de carbone.', ['Vrai', 'Faux'], 1, 'C’est l’inverse : elle consomme du CO2 et libère de l’O2. La respiration fait le contraire.'],
            ['Que devient l’énergie lumineuse captée par la plante ?', ['Elle est stockée dans les liaisons chimiques de la matière organique', 'Elle est intégralement transformée en chaleur', 'Elle est renvoyée sous forme de lumière verte', 'Elle est stockée dans le dioxygène libéré'], 0, 'C’est ce stock que la respiration ou la combustion viendra ensuite libérer.'],
            ['Quel organisme assure environ la moitié de la production primaire mondiale ?', ['Le phytoplancton des océans', 'Les forêts tropicales seules', 'Les prairies tempérées', 'Les cyanobactéries des sols'], 0, 'Continents et océans contribuent à parts comparables : les océans par le phytoplancton.'],
          ],
        },
        {
          titre: 'Le bilan thermique du corps humain',
          axe: 'Le Soleil, notre source d’énergie',
          lecon: {
            titre: 'Tenir 37 °C, quoi qu’il arrive dehors',
            cours: `L’être humain est **homéotherme** : sa température interne reste voisine de **37 °C**, que l’air soit à −10 °C ou à 40 °C. Cette constance a un **coût énergétique permanent**.

## Le corps, un convertisseur d’énergie
Les aliments apportent de l’énergie chimique ; la **respiration cellulaire** la libère. Une part sert aux muscles et aux organes — **tout le reste finit en chaleur**.

| Situation | La puissance dissipée |
| Au **repos** — métabolisme de base | environ **100 watts**, l’équivalent d’une vieille ampoule |
| Sur une journée | de l’ordre de **2 000 kcal**, soit près de **8 400 kJ** (1 kcal = 4,18 kJ) |
| À l’**effort** | Jusqu’à **dix fois** plus |

## Quatre voies pour évacuer la chaleur
| Voie | Son mécanisme | Sa particularité |
| Le **rayonnement** | Infrarouge émis par la peau | Permanent |
| La **convection** | Échange avec l’air | Le **vent** l’amplifie |
| La **conduction** | Contact avec les objets | D’où le danger de l’**eau froide**, bien plus conductrice que l’air |
| L’**évaporation** de la sueur | Elle prélève environ **2 400 kJ par litre** | La **seule** voie qui fonctionne quand l’air est **plus chaud que la peau** |

## La régulation
L’**hypothalamus** compare l’information des thermorécepteurs à une **valeur de consigne** et déclenche les réponses.

| Contre le **froid** | Contre le **chaud** |
| **Vasoconstriction** : moins de sang en surface, moins de pertes | **Vasodilatation** |
| **Frissons** : des contractions musculaires qui produisent de la chaleur | **Sudation** |
| Horripilation | — |

## Quand le bilan est rompu
| Situation | Ce qui se passe |
| Les **pertes dépassent** durablement la production | **Hypothermie** en dessous de **35 °C** : confusion, puis arrêt cardiaque |
| L’**évacuation ne suffit plus** — effort intense, chaleur **humide** | **Hyperthermie**, le coup de chaleur |

> La **fièvre** n’est **pas une panne** : c’est la **valeur de consigne** elle-même qui est **délibérément relevée** par l’organisme.`,
          },
          questions: [
            ['Quelle est la puissance thermique dissipée par un adulte au repos ?', ['Environ 100 W', 'Environ 10 W', 'Environ 1 000 W', 'Environ 5 W'], 0, 'Soit de l’ordre de 2 000 kcal par jour, près de 8 400 kJ.'],
            ['Quelle voie d’évacuation fonctionne encore quand l’air est plus chaud que la peau ?', ['L’évaporation de la sueur', 'Le rayonnement', 'La convection', 'La conduction'], 0, 'Les trois autres exigent que le milieu soit plus froid que le corps ; c’est pourquoi la chaleur humide est dangereuse.'],
            ['Combien vaut 1 kcal en kilojoules ?', ['4,18 kJ', '1 kJ', '10 kJ', '0,24 kJ'], 0, 'Les étiquettes alimentaires affichent souvent les deux unités.'],
            ['Quelle structure du cerveau régule la température corporelle ?', ['L’hypothalamus', 'Le cervelet', 'L’hypophyse', 'Le bulbe rachidien'], 0, 'Il compare l’information des thermorécepteurs à une valeur de consigne.'],
            ['Que provoque la vasoconstriction des vaisseaux de la peau ?', ['Une diminution des pertes de chaleur', 'Une augmentation de la sudation', 'Une hausse du métabolisme de base', 'Une accélération de l’évaporation'], 0, 'Moins de sang chaud en surface, donc moins de chaleur cédée au milieu : c’est une réponse au froid.'],
            ['En dessous de quelle température interne parle-t-on d’hypothermie ?', ['35 °C', '37 °C', '30 °C', '36,5 °C'], 0, 'En dessous apparaissent confusion, ralentissement cardiaque puis arrêt.'],
            ['Toute l’énergie des aliments qui n’est pas utilisée en travail finit en chaleur.', ['Vrai', 'Faux'], 0, 'C’est la conséquence directe de la conservation de l’énergie appliquée au corps humain.'],
            ['Quelle énergie faut-il pour évaporer un litre de sueur ?', ['Environ 2 400 kJ', 'Environ 100 kJ', 'Environ 42 kJ', 'Environ 10 000 kJ'], 0, 'C’est cette chaleur prélevée sur le corps qui refroidit la peau.'],
          ],
        },
        // ===================================================================
        // Chapitre 3 — La Terre, un astre singulier
        // ===================================================================
        {
          titre: 'La forme de la Terre',
          axe: 'La Terre, un astre singulier',
          lecon: {
            titre: 'Mesurer une planète avec une ombre et un angle',
            cours: `La sphéricité de la Terre n’est **pas** une découverte moderne : elle est établie depuis l’Antiquité grecque, et sa **taille** a été mesurée avec une précision remarquable **trois siècles avant notre ère**.

## Les trois indices anciens
| Observation | Ce qu’elle prouve |
| L’**ombre circulaire** de la Terre sur la Lune, lors des éclipses | La Terre est ronde |
| Les navires disparaissent **par la coque** avant le mât | La surface est **courbe** |
| Une **étoile change de hauteur** quand on se déplace vers le nord ou le sud | La Terre est **mesurable** |

> La troisième est la plus féconde : c’est elle qui transforme une forme en un **nombre**.

## Ératosthène, vers 240 avant J.-C.
| Étape | La donnée |
| Au solstice, à **Syène** (Assouan) | Le Soleil est **au zénith** : un puits est éclairé jusqu’au fond |
| Au même instant, à **Alexandrie** | Un gnomon fait une ombre de **7,2°**, soit **1/50 de 360°** |
| Distance entre les villes | environ **5 000 stades** |
| Le calcul | 50 × 5 000 = **250 000 stades**, soit environ **40 000 km** |

> La valeur moderne est de **40 075 km** à l’équateur. L’erreur est de quelques pour cent, avec un bâton et une ombre.

## Repérage et distances
| Coordonnée | Ce qu’elle mesure | Sa plage |
| La **latitude** | L’angle depuis l’**équateur**, sur un méridien | −90° à +90° |
| La **longitude** | L’angle depuis le méridien de **Greenwich** | −180° à +180° |

La longueur d’un arc de méridien vaut **L = R × α**, l’angle étant en **radians**.

| Équivalence | Sa valeur |
| Un **degré** de latitude | environ **111 km** |
| Une **minute** d’arc | **1 852 m**, soit un **mille marin** |

> En **1791**, le **mètre** a été défini comme la dix-millionième partie du **quart du méridien**. Les 40 000 km de tour de Terre ne sont donc **pas une coïncidence**.

## Ni tout à fait ronde, ni tout à fait plate
| Rayon | Sa valeur |
| **Équatorial** | **6 378 km** |
| **Polaire** | **6 357 km** |
| L’écart | **21 km**, soit moins de **0,4 %** |

C’est un **ellipsoïde**, aplati par la rotation.

## Le plus court chemin
| Trajet | Sa nature |
| L’**orthodromie** | L’arc de **grand cercle** : le **plus court** |
| La **loxodromie** | Le trajet à **cap constant** : plus simple à suivre, mais **plus long** |

> D’où les trajectoires d’avion qui **semblent remonter vers le nord** sur un planisphère : elles sont pourtant les plus courtes.`,
          },
          questions: [
            ['Comment Ératosthène a-t-il mesuré la circonférence de la Terre ?', ['En comparant l’ombre d’un gnomon à Alexandrie et un puits éclairé à Syène', 'En faisant le tour de la Méditerranée en bateau', 'En mesurant la durée d’une éclipse de Lune', 'En observant la chute des corps'], 0, 'L’angle de 7,2° vaut 1/50 de tour : la distance entre les deux villes vaut donc 1/50 de la circonférence.'],
            ['Quelle valeur Ératosthène trouve-t-il pour le tour de la Terre ?', ['Environ 40 000 km', 'Environ 6 400 km', 'Environ 150 millions de km', 'Environ 12 000 km'], 0, 'La valeur moderne est de 40 075 km à l’équateur : l’écart est de moins de 1 %.'],
            ['Que mesure la latitude d’un lieu ?', ['Son angle par rapport à l’équateur, compté sur un méridien', 'Son angle par rapport au méridien de Greenwich', 'Sa distance au pôle Nord en kilomètres', 'Son altitude au-dessus du niveau de la mer'], 0, 'De −90° au pôle Sud à +90° au pôle Nord.'],
            ['Combien vaut approximativement un degré de latitude en kilomètres ?', ['111 km', '60 km', '1 852 km', '40 km'], 0, '40 000 km divisés par 360° : une minute d’arc donne le mille marin, 1 852 m.'],
            ['Quelle est la formule de la longueur d’un arc de méridien ?', ['L = R × α, avec α en radians', 'L = R × α, avec α en degrés', 'L = 2 π R × α', 'L = R / α'], 0, 'Convertir l’angle en radians est l’erreur de calcul la plus fréquente de ce chapitre.'],
            ['Quelle est la forme réelle de la Terre ?', ['Un ellipsoïde légèrement aplati aux pôles', 'Une sphère parfaite', 'Un disque plat', 'Un ellipsoïde allongé aux pôles'], 0, '6 378 km de rayon à l’équateur contre 6 357 km aux pôles : la rotation en est la cause.'],
            ['Le plus court chemin entre deux points de la surface terrestre est l’arc de grand cercle.', ['Vrai', 'Faux'], 0, 'C’est l’orthodromie ; la loxodromie, à cap constant, est plus simple à suivre mais plus longue.'],
            ['Comment le mètre a-t-il été défini en 1791 ?', ['Comme la dix-millionième partie du quart du méridien terrestre', 'Comme la longueur d’un pendule battant la seconde', 'Comme un milliardième du rayon terrestre', 'Comme la distance parcourue par la lumière en une seconde'], 0, 'D’où le tour de Terre voisin de 40 000 km : ce n’est pas une coïncidence.'],
          ],
        },
        {
          titre: 'L’histoire de l’âge de la Terre',
          axe: 'La Terre, un astre singulier',
          lecon: {
            titre: 'Quatre siècles pour arriver à 4,54 milliards d’années',
            cours: `L’âge de la Terre est un **cas d’école** : une même question, des réponses successives qui varient d’un facteur **un million** — et à chaque fois une méthode **défendable** avec les connaissances du moment.

## Les estimations successives
| Auteur, date | Sa méthode | Son résultat |
| **Ussher**, 1650 | L’addition des **générations bibliques** | Quelques **milliers** d’années |
| **Buffon**, 1778 | Le **refroidissement** de boulets de fer, extrapolé | **75 000 ans** annoncés — bien plus dans ses manuscrits |
| **Hutton**, **Lyell**, XIXe siècle | L’épaisseur des séries **sédimentaires** et la lenteur de l’érosion | Des **centaines de millions** d’années |
| **Lord Kelvin**, 1862 | La thermodynamique du refroidissement | **20 à 100 millions** d’années |

## Pourquoi Kelvin s’est trompé
Son modèle supposait une Terre qui se refroidit **sans aucune source de chaleur interne** et **sans convection** du manteau.

> Or la **radioactivité**, découverte par Becquerel en **1896**, chauffe l’intérieur du globe **en permanence**. Une **hypothèse manquante** suffit à fausser un raisonnement rigoureux : c’est la leçon épistémologique du chapitre.

## La radiochronologie
La radioactivité fournit l’horloge qui manquait : la **demi-vie** étant constante, le rapport entre l’isotope **père** restant et l’isotope **fils** accumulé donne l’âge de fermeture du système.

| Couple | Demi-vie | Son domaine |
| **Carbone 14** | **5 730 ans** | L’archéologie |
| **Potassium-argon** | Longue | Les temps géologiques |
| **Rubidium-strontium** | Longue | Idem |
| **Uranium-plomb** | De l’ordre du **milliard d’années** | Les plus vieux objets |

## 4,54 milliards d’années
En **1953**, **Clair Patterson** date des **météorites** par uranium-plomb : **4,55 milliards d’années**. La valeur admise aujourd’hui est **4,54 Ga**.

| Pourquoi des météorites | L’âge des roches terrestres |
| La **tectonique des plaques recycle** sans cesse la croûte | Les plus vieilles roches : environ **4 milliards d’années** (gneiss d’Acasta) |
| Les météorites **n’ont pas bougé** depuis la formation du système solaire | Les plus vieux **zircons** : **4,4 milliards** |

> **La Terre a effacé ses propres archives.** C’est ailleurs qu’il a fallu aller les chercher.`,
          },
          questions: [
            ['Quelle expérience Buffon a-t-il menée pour estimer l’âge de la Terre ?', ['Le refroidissement de boulets de fer de tailles croissantes', 'La mesure de l’épaisseur des sédiments', 'Le comptage des générations bibliques', 'La datation de météorites'], 0, 'Il extrapole ensuite à la taille de la Terre et publie 75 000 ans.'],
            ['Pourquoi l’estimation de Kelvin (20 à 100 millions d’années) est-elle fausse ?', ['Il ignorait la chaleur produite par la radioactivité et la convection du manteau', 'Il avait mal mesuré le rayon de la Terre', 'Il utilisait une mauvaise valeur de la constante solaire', 'Il confondait Terre et Soleil'], 0, 'Un calcul rigoureux mais fondé sur une hypothèse manquante : la radioactivité n’était pas encore découverte.'],
            ['Quel est l’âge admis de la Terre ?', ['4,54 milliards d’années', '4,54 millions d’années', '13,8 milliards d’années', '540 millions d’années'], 0, '13,8 milliards d’années est l’âge de l’Univers, pas celui de la Terre.'],
            ['Pourquoi date-t-on des météorites plutôt que des roches terrestres ?', ['Parce que la tectonique recycle la croûte et efface les roches les plus anciennes', 'Parce que les météorites sont plus faciles à trouver', 'Parce que les roches terrestres ne contiennent pas d’uranium', 'Parce que les météorites sont plus âgées que le système solaire'], 0, 'Les plus vieilles roches terrestres connues plafonnent vers 4 milliards d’années.'],
            ['Quelle est la demi-vie du carbone 14 ?', ['5 730 ans', '1,3 milliard d’années', '4,5 milliards d’années', '700 000 ans'], 0, 'Trop courte pour la géologie : au-delà de 50 000 ans, il n’en reste plus assez pour mesurer.'],
            ['Sur quoi repose la datation radiochronologique ?', ['Sur la constance de la demi-vie d’un isotope radioactif', 'Sur la vitesse de sédimentation des roches', 'Sur la mesure du champ magnétique terrestre', 'Sur le comptage des couches de glace'], 0, 'On compare l’isotope père restant à l’isotope fils accumulé depuis la fermeture du système.'],
            ['Quel âge ont les plus vieux cristaux de zircon connus sur Terre ?', ['Environ 4,4 milliards d’années', 'Environ 4,54 milliards d’années', 'Environ 2 milliards d’années', 'Environ 540 millions d’années'], 0, 'Trouvés en Australie (Jack Hills), ils sont plus vieux que toute roche entière conservée.'],
            ['La découverte de la radioactivité a permis de dater la Terre.', ['Vrai', 'Faux'], 0, 'Becquerel en 1896, puis la radiochronologie : c’est elle qui a fourni l’horloge que les géologues cherchaient.'],
          ],
        },
        {
          titre: 'La Terre dans l’Univers',
          axe: 'La Terre, un astre singulier',
          lecon: {
            titre: 'Du géocentrisme aux exoplanètes',
            cours: `Situer la Terre dans l’Univers, c’est d’abord une histoire de **modèles successifs**, chacun jugé sur sa capacité à **rendre compte des observations**.

## Deux modèles en concurrence
| | **Géocentrisme** (Ptolémée, IIe s.) | **Héliocentrisme** (Copernic, **1543**) |
| Au centre | La **Terre**, immobile | Le **Soleil** |
| Le mouvement rétrograde des planètes | Expliqué par des **épicycles** de plus en plus nombreux | Expliqué **d’un coup**, par la composition des mouvements |

## Les preuves et les lois
| Qui | Ce qu’il apporte |
| **Galilée**, 1610 | Les **quatre satellites de Jupiter** — tout ne tourne donc pas autour de la Terre — et les **phases de Vénus**, incompatibles avec Ptolémée |
| **Kepler** | Les orbites sont des **ellipses** dont le Soleil occupe un **foyer** |
| **Newton**, 1687 | La **cause** : la gravitation universelle, F = G × m × M / d² |

## Des distances qui changent d’unité
| Unité | Sa valeur | Son domaine |
| L’**unité astronomique** | distance Terre-Soleil, environ **150 millions de km** — la lumière met **8 minutes** | Le système solaire |
| L’**année-lumière** | environ **9,5 × 10^12 km** | Les étoiles et au-delà |

| Objet | Sa distance ou sa taille |
| L’étoile la plus proche | **4,2 al** |
| La **Voie lactée** | environ **100 000 al** de diamètre |
| L’Univers observable | environ **13,8 milliards** d’années-lumière |

> **Regarder loin, c’est regarder tôt** : la lumière met du temps.

## Une planète dans une zone étroite
La Terre est une **planète tellurique** — rocheuse, dense, petite — comme Mercure, Vénus et Mars, par opposition aux **planètes géantes** gazeuses et glacées.

| Condition | Ce qu’elle apporte |
| Une **distance** dans la **zone d’habitabilité** | L’eau peut rester **liquide** |
| Une **masse** suffisante | Elle **retient une atmosphère** |
| Un **champ magnétique** | Il **dévie le vent solaire** |

## Ailleurs ?
Depuis **1995** et la première détection autour d’une étoile de type solaire, plus de **5 000 exoplanètes** ont été confirmées.

| Méthode | Son principe |
| Les **transits** | La luminosité de l’étoile **baisse périodiquement** quand la planète passe devant |
| Les **vitesses radiales** | L’étoile est **légèrement entraînée** par la planète |

> Certaines sont dans la zone d’habitabilité de leur étoile : **condition nécessaire, pas suffisante**.`,
          },
          questions: [
            ['Qui propose le modèle héliocentrique en 1543 ?', ['Copernic', 'Ptolémée', 'Galilée', 'Newton'], 0, 'Galilée l’appuiera par ses observations, Kepler le corrigera avec les ellipses, Newton l’expliquera.'],
            ['Quelle observation de Galilée contredit directement le géocentrisme ?', ['Les satellites en orbite autour de Jupiter', 'Les taches solaires', 'Les cratères de la Lune', 'La Voie lactée composée d’étoiles'], 0, 'Si des astres tournent autour de Jupiter, tout ne tourne pas autour de la Terre. Les phases de Vénus jouent le même rôle.'],
            ['Selon Kepler, quelle est la forme des orbites planétaires ?', ['Des ellipses dont le Soleil occupe un foyer', 'Des cercles parfaits centrés sur le Soleil', 'Des spirales', 'Des cercles centrés sur la Terre'], 0, 'C’est l’abandon du cercle, dogme antique, qui permet enfin de coller aux observations de Tycho Brahe.'],
            ['Combien de temps la lumière du Soleil met-elle pour atteindre la Terre ?', ['Environ 8 minutes', 'Environ 1 seconde', 'Environ 1 heure', 'Environ 1 an'], 0, '150 millions de kilomètres à 300 000 km/s.'],
            ['Qu’est-ce que la zone d’habitabilité d’une étoile ?', ['La région où l’eau peut exister à l’état liquide à la surface d’une planète', 'La zone où la gravité est la plus forte', 'La région où les planètes sont telluriques', 'La zone où l’étoile émet le plus d’ultraviolets'], 0, 'C’est une condition nécessaire mais pas suffisante : encore faut-il une masse et une atmosphère adéquates.'],
            ['Sur quoi repose la méthode des transits pour détecter une exoplanète ?', ['Sur la baisse périodique de luminosité de l’étoile', 'Sur la photographie directe de la planète', 'Sur le décalage de couleur de la planète', 'Sur la mesure de son champ magnétique'], 0, 'La planète passe devant son étoile et en masque une infime fraction, régulièrement.'],
            ['La Terre est une planète tellurique.', ['Vrai', 'Faux'], 0, 'Rocheuse, dense et petite, comme Mercure, Vénus et Mars, par opposition aux planètes géantes.'],
            ['Quelle loi Newton énonce-t-il en 1687 pour expliquer le mouvement des astres ?', ['La gravitation universelle', 'La loi de Wien', 'La loi de Stefan', 'La conservation de la masse'], 0, 'F = G × m × M / d² : la même force fait tomber une pomme et tourner la Lune.'],
          ],
        },
        // ===================================================================
        // Chapitre 4 — Son et musique, porteurs d’informations
        // ===================================================================
        {
          titre: 'Le son, phénomène vibratoire',
          axe: 'Son et musique, porteurs d’informations',
          lecon: {
            titre: 'Une onde qui a besoin de matière',
            cours: `Un son est une **onde mécanique** : la vibration d’une source met en mouvement les particules du milieu, de proche en proche.

> **Sans matière, pas de son** — dans le vide, la cloche sonne pour personne.

## Une onde longitudinale
Les particules d’air vibrent **dans la direction de propagation**, créant une succession de **compressions** et de **dilatations**.

> Elles **oscillent autour de leur position** : c’est l’**énergie** qui se déplace, **pas la matière**.

## La célérité dépend du milieu
| Milieu | Célérité |
| L’**air** à 20 °C | **340 m/s** |
| L’**eau** | **1 500 m/s** |
| L’**acier** | environ **5 000 m/s** |

## Période, fréquence, longueur d’onde
| Grandeur | Sa définition | Son unité |
| La **période T** | La durée d’un cycle | la seconde |
| La **fréquence f = 1/T** | Le nombre de cycles par seconde | le **hertz** |
| La **longueur d’onde λ = v × T = v/f** | La distance parcourue pendant une période | le mètre |

> Un **la3** à **440 Hz** a dans l’air une longueur d’onde de 340/440, soit environ **0,77 m**.

## Ce que l’oreille entend
| Domaine | Ses fréquences | Ses usages |
| Les **infrasons** | en dessous de **20 Hz** | — |
| L’**audible** | **20 Hz à 20 000 Hz** | — |
| Les **ultrasons** | au-dessus de 20 kHz | Chauves-souris, échographie, sonars |

| Caractéristique d’un son musical | Ce qui la détermine |
| La **hauteur** | La **fréquence fondamentale** — aigu = fréquence élevée |
| Le **timbre** | Les **harmoniques** : ils distinguent une flûte d’un violon **sur la même note** |
| L’**intensité** | L’amplitude |

## Le décibel, une échelle qui trompe
L’oreille répond de façon **logarithmique**. D’où le niveau d’intensité sonore :

**L = 10 × log(I / I0)**, avec I0 = 10^-12 W/m², seuil d’audibilité

| Ce qu’on fait | L’effet en décibels |
| **Multiplier** l’intensité par **10** | **+10 dB** |
| **Doubler** l’intensité | **+3 dB** seulement |

> Deux machines identiques à 80 dB ne font **pas** 160 dB, mais **83**.

| Seuil | Sa valeur |
| Risque en exposition prolongée | **85 dB** |
| Douleur | environ **120 dB** |`,
          },
          questions: [
            ['Pourquoi le son ne se propage-t-il pas dans le vide ?', ['C’est une onde mécanique : il lui faut un milieu matériel', 'Parce que la lumière y va trop vite', 'Parce que la température y est trop basse', 'Parce qu’il n’y a pas de gravité'], 0, 'Contrairement à la lumière, onde électromagnétique, qui traverse le vide.'],
            ['Quelle est la célérité du son dans l’air à 20 °C ?', ['Environ 340 m/s', 'Environ 1 500 m/s', 'Environ 3 × 10^8 m/s', 'Environ 5 000 m/s'], 0, '1 500 m/s est la valeur dans l’eau, 5 000 m/s dans l’acier.'],
            ['Quelle relation lie longueur d’onde, célérité et fréquence ?', ['λ = v / f', 'λ = v × f', 'λ = f / v', 'λ = v × f²'], 0, 'La longueur d’onde est la distance parcourue par l’onde pendant une période.'],
            ['Quel est le domaine des fréquences audibles par l’oreille humaine ?', ['20 Hz à 20 000 Hz', '2 Hz à 2 000 Hz', '200 Hz à 200 000 Hz', '20 Hz à 2 000 Hz'], 0, 'En dessous, les infrasons ; au-dessus, les ultrasons.'],
            ['Qu’est-ce qui distingue le timbre d’une flûte de celui d’un violon jouant la même note ?', ['La composition en harmoniques', 'La fréquence fondamentale', 'La célérité du son émis', 'Le niveau sonore en décibels'], 0, 'La hauteur est la même, ce sont les fréquences multiples du fondamental qui diffèrent.'],
            ['De combien augmente le niveau sonore si l’intensité est multipliée par 10 ?', ['De 10 dB', 'De 3 dB', 'De 100 dB', 'Il est multiplié par 10'], 0, 'L’échelle est logarithmique : L = 10 log(I/I0).'],
            ['Deux sources identiques de 80 dB placées côte à côte produisent 160 dB.', ['Vrai', 'Faux'], 1, 'Doubler l’intensité n’ajoute que 3 dB : on obtient 83 dB.'],
            ['À partir de quel niveau sonore une exposition prolongée devient-elle risquée ?', ['85 dB', '120 dB', '60 dB', '40 dB'], 0, '120 dB est le seuil de douleur ; le risque, lui, commence bien avant et dépend aussi de la durée.'],
          ],
        },
        {
          titre: 'La musique ou l’art de faire entendre les nombres',
          axe: 'Son et musique, porteurs d’informations',
          lecon: {
            titre: 'Des rapports simples aux douze demi-tons',
            cours: `« La musique est un exercice d’arithmétique secret », écrivait Leibniz. Le programme le prend au mot : une gamme est une **suite de rapports de fréquences**.

## Pythagore et le monocorde
Sur une corde tendue, la fréquence est **inversement proportionnelle à la longueur** qui vibre : diviser la longueur par deux **double** la fréquence.

| Intervalle consonant | Son rapport de fréquences |
| L’**octave** | **2/1** |
| La **quinte** | **3/2** |
| La **quarte** | **4/3** |

> Les intervalles jugés **consonants** correspondent à des **rapports de nombres entiers simples**. C’est la découverte fondatrice.

| Note | Sa fréquence |
| la2 | **220 Hz** |
| **la3** | **440 Hz** |
| la4 | **880 Hz** |

Deux notes séparées d’une octave portent d’ailleurs le **même nom**.

## La gamme de Pythagore
On empile des **quintes** (× 3/2), puis on ramène chaque note dans l’octave de départ en divisant par 2 autant de fois qu’il le faut. Le procédé donne sept notes, puis douze.

## Le comma, ou l’impossibilité arithmétique
| Empilement | Sa valeur |
| **Douze quintes** : (3/2)^12 | environ **129,7** |
| **Sept octaves** : 2^7 | **128** |

> L’écart, environ **1,4 %**, s’appelle le **comma pythagoricien**. Aucune puissance de 3/2 n’est jamais égale à une puissance de 2 : **la gamme ne se referme pas sur elle-même**, et un instrument ainsi accordé sonne faux dès qu’on change de tonalité.

## La gamme tempérée
Généralisée à l’époque de Bach : l’octave est divisée en **douze demi-tons rigoureusement égaux**, de rapport **2^(1/12), soit environ 1,059**.

| Ce qu’on perd | Ce qu’on gagne |
| Aucun intervalle n’est **parfaitement juste** — la quinte tempérée vaut **1,498** au lieu de 1,5 | **Toutes les tonalités** deviennent également jouables |

Douze demi-tons redonnent **exactement** l’octave, puisque (2^(1/12))^12 = 2.

> C’est un **compromis assumé** entre la pureté arithmétique et la liberté musicale.`,
          },
          questions: [
            ['Quel est le rapport de fréquences d’une octave ?', ['2', '3/2', '4/3', '1,059'], 0, 'Le la3 à 440 Hz donne un la4 à 880 Hz.'],
            ['Quel rapport de fréquences correspond à une quinte ?', ['3/2', '2', '4/3', '5/4'], 0, 'C’est l’intervalle qui sert à construire la gamme de Pythagore, de quinte en quinte.'],
            ['Comment varie la fréquence émise par une corde quand on divise par deux sa longueur vibrante ?', ['Elle est multipliée par deux', 'Elle est divisée par deux', 'Elle ne change pas', 'Elle est multipliée par quatre'], 0, 'La fréquence est inversement proportionnelle à la longueur : c’est l’expérience du monocorde.'],
            ['Qu’est-ce que le comma pythagoricien ?', ['L’écart entre douze quintes et sept octaves', 'La plus petite note audible', 'Le rapport d’un demi-ton tempéré', 'L’intervalle entre deux notes voisines de la gamme'], 0, '(3/2)^12 ≈ 129,7 alors que 2^7 = 128 : la gamme construite par quintes ne se referme pas.'],
            ['Quel est le rapport de fréquences d’un demi-ton dans la gamme tempérée ?', ['2^(1/12) ≈ 1,059', '3/2', '1,5', '2/12'], 0, 'Douze demi-tons égaux redonnent exactement l’octave : (2^(1/12))^12 = 2.'],
            ['Quelle est la fréquence du la3, note de référence de l’accord des instruments ?', ['440 Hz', '220 Hz', '880 Hz', '400 Hz'], 0, '220 Hz est le la de l’octave inférieure, 880 Hz celui de l’octave supérieure.'],
            ['Dans la gamme tempérée, la quinte est parfaitement juste.', ['Vrai', 'Faux'], 1, 'Elle vaut 1,498 au lieu de 1,5 : le tempérament sacrifie un peu de pureté pour rendre toutes les tonalités jouables.'],
            ['Pourquoi la gamme tempérée s’est-elle imposée ?', ['Parce qu’elle permet de jouer dans toutes les tonalités', 'Parce qu’elle rend tous les intervalles parfaitement justes', 'Parce qu’elle simplifie la fabrication des cordes', 'Parce qu’elle supprime les harmoniques'], 0, 'L’erreur est répartie équitablement au lieu de s’accumuler sur certains intervalles.'],
          ],
        },
        {
          titre: 'Le son, une information à coder',
          axe: 'Son et musique, porteurs d’informations',
          lecon: {
            titre: 'De l’onde continue à la suite de nombres',
            cours: `Un microphone transforme une onde sonore en **signal analogique** : une tension qui varie **continûment**. Pour être stockée et transmise, cette variation doit devenir une **suite de nombres**.

## Les deux opérations
| Opération | Ce qu’elle découpe | Le paramètre |
| **Échantillonner** | Le **temps** | La **fréquence d’échantillonnage** fe |
| **Quantifier** | L’**amplitude** | La **résolution**, en bits |

## Échantillonner
Le **critère de Shannon-Nyquist** impose **fe supérieure ou égale à 2 × fmax**.

> Pour reconstituer un son allant jusqu’à **20 kHz**, il faut échantillonner à **plus de 40 kHz** : c’est exactement pourquoi le CD audio utilise **44,1 kHz**.

> Un échantillonnage trop lent produit un **repliement de spectre** : des fréquences **inventées**, absentes du son d’origine.

## Quantifier
Avec n bits, on dispose de **2^n niveaux**.

| Résolution | Nombre de niveaux |
| **8 bits** | **256** |
| **16 bits** | **65 536** |

> Plus la résolution est fine, plus le **bruit de quantification** est faible.

## Calculer une taille de fichier
**taille = fe × n × durée × nombre de voies**

| Une seconde de CD audio stéréo | Le calcul |
| 44 100 × 16 × 2 | **1 411 200 bits** |
| Soit | environ **1,4 Mbit**, ou **176 ko** |

> Une chanson de trois minutes pèse ainsi une **trentaine de mégaoctets** — d’où la nécessité de compresser.

## Compresser
| Type | Ce qu’elle fait | Le gain | Le fichier d’origine |
| **Sans perte** — FLAC, ZIP | Code l’information plus efficacement | **Modeste** | Restitué **à l’identique** |
| **Avec perte** — MP3, AAC | Supprime ce que l’oreille ne perçoit pas : sons **masqués**, fréquences extrêmes | Divise par **dix** environ | **Non récupérable** |

> C’est le prix du streaming.

## Pourquoi le numérique
| L’analogique | Le numérique |
| Se **dégrade** à chaque copie et transmission | Se **régénère** exactement |
| Aucune correction possible | Se **corrige** — codes détecteurs d’erreurs |
| — | Se **duplique** sans perte et se **traite par calcul** |

> C’est ce qui a fait basculer **toute la chaîne du son**.`,
          },
          questions: [
            ['Qu’impose le critère de Shannon-Nyquist ?', ['Échantillonner à au moins deux fois la fréquence maximale du signal', 'Échantillonner à la fréquence maximale du signal', 'Quantifier sur au moins 16 bits', 'Compresser avant de transmettre'], 0, 'D’où les 44,1 kHz du CD audio pour des sons allant jusqu’à 20 kHz.'],
            ['Combien de niveaux permet une quantification sur 16 bits ?', ['65 536', '256', '16', '1 024'], 0, '2^16 = 65 536 : c’est la résolution du CD audio.'],
            ['Quelle est la fréquence d’échantillonnage du CD audio ?', ['44,1 kHz', '20 kHz', '16 kHz', '96 kHz'], 0, 'Un peu plus du double de 20 kHz, la limite de l’audition humaine.'],
            ['Que se passe-t-il si la fréquence d’échantillonnage est trop faible ?', ['Un repliement de spectre fait apparaître des fréquences inexistantes', 'Le fichier devient plus lourd', 'Le son devient plus aigu', 'La quantification devient impossible'], 0, 'Le signal reconstitué contient des fréquences qui n’étaient pas dans le son d’origine.'],
            ['Quelle est la taille d’une seconde de son stéréo au format CD non compressé ?', ['Environ 1,4 Mbit', 'Environ 1,4 kbit', 'Environ 176 Mbit', 'Environ 44 kbit'], 0, '44 100 × 16 × 2 = 1 411 200 bits, soit environ 176 ko.'],
            ['Que perd-on avec une compression MP3 ?', ['Une partie de l’information sonore, non récupérable', 'Rien, le fichier est restitué à l’identique', 'Seulement la voie droite du signal', 'La fréquence d’échantillonnage'], 0, 'C’est une compression avec perte, qui supprime ce que l’oreille perçoit mal : le gain est d’un facteur dix environ.'],
            ['La compression FLAC restitue exactement le fichier d’origine.', ['Vrai', 'Faux'], 0, 'C’est une compression sans perte : gain plus modeste, mais aucune information supprimée.'],
            ['Quel est l’avantage majeur d’un signal numérique sur un signal analogique ?', ['Il se copie et se transmet sans dégradation', 'Il occupe toujours moins de place', 'Il a une meilleure qualité sonore par nature', 'Il n’a pas besoin d’être quantifié'], 0, 'Une suite de 0 et de 1 se régénère exactement et se corrige ; une tension continue se dégrade à chaque copie.'],
          ],
        },
        {
          titre: 'Entendre la musique',
          axe: 'Son et musique, porteurs d’informations',
          lecon: {
            titre: 'De la vibration de l’air au message nerveux',
            cours: `L’oreille est un **convertisseur** : elle transforme une variation de pression de l’air en **message nerveux** — puis le cerveau en fait une **perception**.

## Trois étages
| Étage | Ses éléments | Son rôle |
| **Externe** | Pavillon, conduit auditif, **tympan** | **Capter** et canaliser ; le tympan vibre |
| **Moyenne** | Les trois **osselets** : marteau, enclume, **étrier** | **Amplifier** et adapter |
| **Interne** | La **cochlée**, l’**organe de Corti**, les **cellules ciliées** | **Coder** en message nerveux |

> L’oreille moyenne concentre la force du **grand tympan** sur la **petite fenêtre ovale** : c’est là qu’est l’amplification. L’étrier est le **plus petit os du corps**.

## Le codage dans la cochlée
La membrane basilaire est **rigide et étroite à la base**, **souple et large au sommet** : elle entre en résonance à un **endroit différent selon la fréquence**.

| Fréquence | Où elle résonne |
| Les **aigus** | À l’**entrée** de la cochlée |
| Les **graves** | Au **fond** |

C’est la **tonotopie**.

| Ce qui est codé | Comment |
| La **hauteur** | Par la **position** des cellules stimulées |
| L’**intensité** | Par la **fréquence des potentiels d’action** et le nombre de fibres recrutées |

## Jusqu’au cerveau
Le message circule par le **nerf auditif** jusqu’aux **aires auditives** du cortex **temporal**, où il est comparé, identifié, associé à la mémoire et aux émotions.

> La **perception n’est pas la mesure** : le cerveau **reconstruit**, comble les manques et se laisse tromper — c’est ce qui rend possibles les **illusions auditives**.

## Des lésions irréversibles
Les cellules ciliées **ne se régénèrent pas**.

| Signe d’alerte | Ce qu’il indique |
| Les **acouphènes** — sifflements | Une atteinte en cours |
| L’impression d’oreilles **cotonneuses** | Une fatigue auditive |

| Le risque dépend de… | La règle |
| Le **niveau** | Au-delà de **85 dB**, il croît vite |
| La **durée** | Chaque **+3 dB divise par deux** la durée d’exposition tolérable |

> Un traumatisme sonore — concert, casque poussé, explosion — détruit ces cellules **définitivement**.`,
          },
          questions: [
            ['Quel est le rôle de la chaîne des osselets ?', ['Amplifier et transmettre la vibration du tympan à l’oreille interne', 'Analyser les fréquences du son', 'Convertir la vibration en message nerveux', 'Protéger le conduit auditif'], 0, 'Marteau, enclume et étrier concentrent la force du tympan sur la fenêtre ovale.'],
            ['Où les fréquences aiguës sont-elles détectées dans la cochlée ?', ['À la base, près de l’entrée', 'Au sommet, au fond du tube', 'Sur toute la longueur indifféremment', 'Dans le nerf auditif'], 0, 'C’est la tonotopie : les graves sont détectés au sommet, les aigus à la base.'],
            ['Quelles cellules convertissent la vibration en message nerveux ?', ['Les cellules ciliées de l’organe de Corti', 'Les cellules du tympan', 'Les neurones du cortex auditif', 'Les cellules osseuses de l’étrier'], 0, 'Elles sont situées dans la cochlée, sur la membrane basilaire.'],
            ['Comment la hauteur d’un son est-elle codée par l’oreille interne ?', ['Par la position des cellules ciliées stimulées', 'Par l’amplitude du message nerveux', 'Par la vitesse du son dans la cochlée', 'Par le nombre d’osselets mis en mouvement'], 0, 'Chaque zone de la membrane basilaire résonne pour une fréquence donnée.'],
            ['Les cellules ciliées détruites par un traumatisme sonore se régénèrent en quelques semaines.', ['Vrai', 'Faux'], 1, 'Elles ne se régénèrent pas : la perte auditive est définitive.'],
            ['Quel signe doit alerter après une exposition sonore intense ?', ['Des acouphènes ou une sensation d’oreilles cotonneuses', 'Un léger mal de tête passager', 'Une vision troublée', 'Une perte d’équilibre isolée'], 0, 'Ce sont les symptômes d’un traumatisme sonore, qui peut laisser des séquelles définitives.'],
            ['Vers quelle région du cerveau le nerf auditif conduit-il le message ?', ['Les aires auditives du cortex temporal', 'Le cervelet', 'Le cortex visuel occipital', 'La moelle épinière'], 0, 'C’est là que le message est identifié et associé à la mémoire et aux émotions.'],
            ['Quel est le rôle du tympan ?', ['Vibrer sous l’effet des variations de pression de l’air', 'Analyser les fréquences du son', 'Produire le message nerveux', 'Amplifier le son par résonance de liquide'], 0, 'Il transmet ensuite sa vibration aux osselets de l’oreille moyenne.'],
          ],
        },
        // ===================================================================
        // Chapitre 5 — Mathématiques
        // (entrées dans l’enseignement scientifique de 1re à la rentrée 2023,
        //  pour les élèves qui n’ont pas la spécialité mathématiques)
        // ===================================================================
        {
          titre: 'Analyse de l’information chiffrée',
          axe: 'Mathématiques',
          lecon: {
            titre: 'Proportions, pourcentages et évolutions',
            cours: `Un chiffre **seul** ne dit rien : c’est le **rapport** qu’il entretient avec un autre qui l’informe.

## Proportion et pourcentage
La **proportion** de A dans E vaut effectif(A) / effectif(E), entre 0 et 1. Multipliée par 100, elle s’exprime en **pourcentage**.

| Situation | Le calcul |
| 40 % des élèves sont en 1re | 0,40 |
| 25 % d’entre eux prennent l’option théâtre | 0,25 |
| Leur part dans l’établissement | 0,40 × **0,25** = **0,10**, soit **10 %** |

> Les proportions **emboîtées se multiplient** — elles ne s’additionnent **jamais**.

## Taux d’évolution et coefficient multiplicateur
| Grandeur | Sa formule |
| Le **taux d’évolution** | t = (V2 − V1) / V1 |
| Le **coefficient multiplicateur** | **CM = 1 + t**, tel que V2 = V1 × CM |

| Évolution | Son CM |
| Hausse de **20 %** | **1,20** |
| Baisse de **20 %** | **0,80** |

## Évolutions successives : on multiplie
CM global = CM1 × CM2.

| L’enchaînement | Le calcul | Le résultat |
| +20 % puis −20 % | 1,20 × 0,80 | **0,96**, soit une **baisse de 4 %** |

> **Ce n’est pas un retour au point de départ.** C’est l’erreur la plus fréquente du chapitre.

## Évolution réciproque
Pour **annuler** une évolution, on applique le coefficient **inverse**.

> Après une hausse de **25 %** (CM = 1,25), il faut multiplier par 1/1,25 = **0,80** — soit une **baisse de 20 %**, et non de 25 %.

## Point de pourcentage et indice
| Formulation | Ce qu’elle dit | Passer de 8 % à 10 % |
| En **points de pourcentage** | La différence **absolue** | **+2 points** |
| En **valeur relative** | Le taux d’évolution | **+25 %** |

> Les deux formulations sont **justes** et ne disent **pas la même chose**.

Un **indice base 100** rapporte chaque valeur à une année de référence : indice = 100 × V / V(référence).

> Un indice de **112** signifie « **+12 % depuis l’année de base** ».`,
          },
          questions: [
            ['Une grandeur passe de 200 à 250. Quel est le taux d’évolution ?', ['+25 %', '+50 %', '+20 %', '+2,5 %'], 0, 't = (250 − 200)/200 = 0,25, soit +25 %.'],
            ['À quel coefficient multiplicateur correspond une baisse de 20 % ?', ['0,80', '1,20', '0,20', '−0,20'], 0, 'CM = 1 + t = 1 + (−0,20) = 0,80.'],
            ['Une hausse de 20 % suivie d’une baisse de 20 % ramène-t-elle à la valeur de départ ?', ['Non, il reste une baisse de 4 %', 'Oui, exactement', 'Non, il reste une hausse de 4 %', 'Cela dépend de la valeur de départ'], 0, '1,20 × 0,80 = 0,96 : le coefficient global est inférieur à 1, quelle que soit la valeur initiale.'],
            ['Quelle baisse annule une hausse de 25 % ?', ['Une baisse de 20 %', 'Une baisse de 25 %', 'Une baisse de 30 %', 'Une baisse de 12,5 %'], 0, 'Le coefficient réciproque est 1/1,25 = 0,80, soit −20 %.'],
            ['Le taux de chômage passe de 8 % à 10 %. Que peut-on dire ?', ['Il augmente de 2 points de pourcentage, soit de 25 %', 'Il augmente de 2 %', 'Il augmente de 20 points', 'Il augmente de 2 points, soit de 20 %'], 0, 'Point de pourcentage et pourcentage d’évolution sont deux lectures différentes du même écart.'],
            ['40 % des élèves sont en 1re, et 25 % d’entre eux prennent l’option théâtre. Quelle proportion de l’établissement cela représente-t-il ?', ['10 %', '65 %', '15 %', '25 %'], 0, 'Les proportions emboîtées se multiplient : 0,40 × 0,25 = 0,10.'],
            ['Que signifie un indice de 112 en base 100 ?', ['Une hausse de 12 % depuis l’année de référence', 'Une hausse de 112 % depuis l’année de référence', 'Une valeur de 112 unités', 'Une baisse de 12 %'], 0, 'L’indice rapporte chaque valeur à celle de l’année de base, ramenée à 100.'],
            ['Deux taux d’évolution successifs s’additionnent.', ['Vrai', 'Faux'], 1, 'Ce sont les coefficients multiplicateurs qui se multiplient : +10 % puis +10 % donnent +21 %, pas +20 %.'],
          ],
        },
        {
          titre: 'Phénomènes aléatoires',
          axe: 'Mathématiques',
          lecon: {
            titre: 'Du hasard aux fréquences stables',
            cours: `Un phénomène est **aléatoire** quand on connaît l’**ensemble des résultats possibles** sans pouvoir prévoir **lequel** se produira. L’imprévisible individuel devient pourtant **régulier en grand nombre**.

## Le vocabulaire
| Terme | Sa définition |
| L’**expérience aléatoire** | Elle a plusieurs **issues** possibles |
| L’**univers** | L’ensemble des issues |
| Un **événement** | Un ensemble d’issues |
| La **probabilité** | Un nombre entre **0** (impossible) et **1** (certain) |

La somme des probabilités de **toutes** les issues vaut **1**.

En **équiprobabilité** : P(A) = nombre d’issues **favorables** / nombre d’issues **possibles**. Avec un dé équilibré, P(pair) = 3/6 = **0,5**.

## Fréquence n’est pas probabilité
| | La **fréquence** | La **probabilité** |
| Quand on l’obtient | **Après coup**, sur des données | **Avant**, comme un modèle |
| Sa formule | réalisations / essais | Posée par hypothèse |

> Les deux **se rejoignent** quand l’échantillon grandit : c’est la **loi des grands nombres**.

## Fluctuation d’échantillonnage
Deux échantillons de **même taille**, tirés de la **même population**, ne donnent **pas** la même fréquence. Cet écart est **normal**.

| Ce qu’on augmente | Ce qui se passe |
| La taille n de l’échantillon | La fluctuation **diminue**, en **1/√n** |
| Multiplier n par **100** | Diviser l’incertitude par **10** seulement |

Pour une proportion p et un n assez grand, environ **95 %** des échantillons donnent une fréquence dans l’**intervalle de fluctuation** [p − 1/√n ; p + 1/√n].

## Simuler pour comprendre
Un tableur ou un programme simule des **milliers** de tirages en quelques secondes, et l’on **voit se stabiliser** une fréquence qu’aucun raisonnement simple ne donnerait.

> C’est la méthode retenue par le programme : **observer la régularité avant d’en écrire la loi**.

> Un piège à connaître : le hasard **n’a pas de mémoire**. Après cinq « pile » consécutifs, la probabilité du prochain lancer reste **1/2**.`,
          },
          questions: [
            ['Entre quelles valeurs une probabilité est-elle comprise ?', ['Entre 0 et 1', 'Entre −1 et 1', 'Entre 0 et 100', 'Entre 1 et 10'], 0, '0 pour un événement impossible, 1 pour un événement certain.'],
            ['Qu’énonce la loi des grands nombres ?', ['La fréquence observée se rapproche de la probabilité quand le nombre d’essais augmente', 'Un événement rare finit toujours par se produire', 'La probabilité augmente avec le nombre d’essais', 'Les grands échantillons donnent tous la même fréquence exacte'], 0, 'C’est le pont entre le modèle probabiliste et les données observées.'],
            ['Après cinq « pile » consécutifs, quelle est la probabilité d’obtenir « face » au lancer suivant ?', ['1/2', 'Plus de 1/2', 'Moins de 1/2', '1'], 0, 'Les lancers sont indépendants : le hasard n’a pas de mémoire.'],
            ['Qu’est-ce que la fluctuation d’échantillonnage ?', ['La variation de la fréquence observée d’un échantillon à l’autre', 'Une erreur de mesure de l’expérimentateur', 'Le changement de probabilité au cours du temps', 'La différence entre deux probabilités théoriques'], 0, 'Elle est normale, et elle diminue quand la taille de l’échantillon augmente.'],
            ['Par combien faut-il multiplier la taille d’un échantillon pour diviser par 10 la fluctuation ?', ['100', '10', '1 000', '2'], 0, 'La fluctuation évolue en 1/√n : diviser par 10 exige de multiplier n par 100.'],
            ['Quelle est la probabilité d’obtenir un nombre pair avec un dé équilibré à six faces ?', ['0,5', '1/6', '1/3', '2/3'], 0, 'Trois issues favorables sur six possibles, en situation d’équiprobabilité.'],
            ['La fréquence se mesure sur des données observées, la probabilité est un modèle théorique.', ['Vrai', 'Faux'], 0, 'La loi des grands nombres rapproche l’une de l’autre quand le nombre d’essais grandit.'],
            ['Quel intervalle de fluctuation au seuil de 95 % le programme retient-il pour une proportion p ?', ['[p − 1/√n ; p + 1/√n]', '[p − 1/n ; p + 1/n]', '[p − √n ; p + √n]', '[p − n ; p + n]'], 0, 'Environ 95 % des échantillons de taille n donnent une fréquence dans cet intervalle.'],
          ],
        },
        {
          titre: 'Croissance linéaire et suites arithmétiques',
          axe: 'Mathématiques',
          lecon: {
            titre: 'Ajouter toujours la même chose',
            cours: `Une évolution est **linéaire** quand la grandeur augmente ou diminue d’une **quantité constante** à chaque étape. Le modèle correspondant est la **suite arithmétique**.

## Définition
Une suite est **arithmétique de raison r** si **u(n+1) = u(n) + r**.

| Comment retrouver r | Ce qu’il signifie |
| Par **soustraction** : r = u(n+1) − u(n) | Ce que l’on **ajoute** à chaque pas |
| r **négatif** | La suite **décroît** |

## Forme explicite
| Si la suite commence au rang… | Sa formule |
| **0** | u(n) = u(0) + **n × r** |
| **1** | u(n) = u(1) + **(n − 1) × r** |

> Un abonnement de **15 € par mois** avec **40 €** de frais d’inscription : u(n) = 40 + 15 n. Au bout de deux ans, u(24) = 40 + 360 = **400 €**.

## Reconnaître une suite arithmétique
Le test est toujours le même : calculer les **différences** entre termes consécutifs.

| Suite | Ses différences | Sa nature |
| 3, 7, 11, 15 | **4, 4, 4** | **Arithmétique** de raison 4 |
| 3, 6, 12, 24 | 3, 6, 12 | **Géométrique**, pas arithmétique |

## Représentation et somme
> Les points d’une suite arithmétique sont **alignés** : c’est la **signature graphique** de la croissance linéaire.

Sur un tableur, la formule d’une cellule reprend la précédente **augmentée de r**.

La somme des n premiers entiers vaut **n (n + 1) / 2**.

> Le jeune **Gauss** additionnant 1 à 100 : **cinquante paires valant 101**, soit **5 050**. La formule se retrouve, elle ne s’apprend pas.`,
          },
          questions: [
            ['Comment définit-on une suite arithmétique de raison r ?', ['u(n+1) = u(n) + r', 'u(n+1) = u(n) × r', 'u(n+1) = r × n', 'u(n+1) = u(n)^r'], 0, 'On ajoute toujours la même quantité : c’est la croissance linéaire.'],
            ['Quelle est la forme explicite d’une suite arithmétique de premier terme u(0) ?', ['u(n) = u(0) + n × r', 'u(n) = u(0) × r^n', 'u(n) = u(0) + r^n', 'u(n) = n × r'], 0, 'Elle permet de calculer directement un terme de rang élevé.'],
            ['La suite 3 ; 7 ; 11 ; 15 est-elle arithmétique ?', ['Oui, de raison 4', 'Non', 'Oui, de raison 3', 'Oui, de raison 7'], 0, 'Les différences entre termes consécutifs sont constantes et valent 4.'],
            ['Un abonnement coûte 40 € d’inscription puis 15 € par mois. Combien a-t-on payé après 24 mois ?', ['400 €', '360 €', '415 €', '600 €'], 0, 'u(24) = 40 + 15 × 24 = 40 + 360 = 400 €.'],
            ['Comment reconnaît-on graphiquement une suite arithmétique ?', ['Ses points sont alignés', 'Ses points forment une courbe qui s’envole', 'Ses points forment une hyperbole', 'Ses points sont dispersés au hasard'], 0, 'C’est la signature de la croissance linéaire, à ne pas confondre avec la courbe exponentielle.'],
            ['Combien vaut la somme 1 + 2 + … + 100 ?', ['5 050', '10 100', '5 000', '4 950'], 0, 'n(n+1)/2 = 100 × 101 / 2 = 5 050.'],
            ['La suite 3 ; 6 ; 12 ; 24 est arithmétique.', ['Vrai', 'Faux'], 1, 'Ses différences (3, 6, 12) ne sont pas constantes : elle est géométrique, de raison 2.'],
            ['Une suite arithmétique de raison négative est :', ['Décroissante', 'Croissante', 'Constante', 'Alternée'], 0, 'On retranche la même quantité à chaque étape.'],
          ],
        },
        {
          titre: 'Croissance linéaire et fonctions affines',
          axe: 'Mathématiques',
          lecon: {
            titre: 'La droite, version continue de la suite arithmétique',
            cours: `La suite arithmétique décrit une évolution **par pas entiers** ; la **fonction affine** décrit la même croissance de façon **continue**, pour **toute** valeur de la variable.

## Définition et vocabulaire
**f(x) = a x + b**

| Coefficient | Son nom | Ce qu’il représente |
| **a** | Le **coefficient directeur** | Ce que gagne f quand x augmente de 1 |
| **b** | L’**ordonnée à l’origine** | La valeur f(0), le point de départ |

| Cas particulier | Ce qu’il donne |
| **b = 0** | Fonction **linéaire** : une **proportionnalité** |
| **a = 0** | Fonction **constante** |

## La représentation est une droite
| Signe de a | La droite |
| **a > 0** | **Croissante** |
| **a < 0** | **Décroissante** |

Deux points suffisent à la tracer : (0 ; b) et (1 ; a + b).

Le coefficient directeur se lit comme un **taux d’accroissement** :

**a = (f(x2) − f(x1)) / (x2 − x1)**

> Ce quotient est **le même quels que soient les deux points choisis**. C’est la **définition** d’une droite — et ce qui distingue le linéaire de tout le reste.

## Le lien avec la suite arithmétique
| Objet | Son écriture |
| La **suite** | u(n) = u(0) + n r |
| La **fonction** | f(x) = r x + u(0) |

> La **raison** de la suite **est** le **coefficient directeur** de la fonction : même croissance, deux écritures selon que le temps se compte **par pas** ou **en continu**.

## Modéliser
Un forfait : **10 €** fixes plus **0,05 €** par minute, soit f(x) = 0,05 x + 10.

> Résoudre f(x) = 25 : 0,05 x = 15, donc x = **300 minutes**.

> Attention : un modèle affine n’est valable que sur un **intervalle**. Extrapoler une droite **hors de son domaine de validité** — une croissance de population, une fonte de glacier — est une faute classique de lecture de données.`,
          },
          questions: [
            ['Quelle est la forme générale d’une fonction affine ?', ['f(x) = a x + b', 'f(x) = a x²', 'f(x) = a / x', 'f(x) = a^x'], 0, 'a est le coefficient directeur, b l’ordonnée à l’origine.'],
            ['Que représente le coefficient directeur a ?', ['La variation de f quand x augmente de 1', 'La valeur de f(0)', 'Le point d’intersection avec l’axe des abscisses', 'La pente du repère'], 0, 'C’est le taux d’accroissement, constant sur toute la droite.'],
            ['Quelle est la représentation graphique d’une fonction affine ?', ['Une droite', 'Une parabole', 'Une hyperbole', 'Une courbe exponentielle'], 0, 'Croissante si a > 0, décroissante si a < 0.'],
            ['Une fonction affine avec b = 0 traduit :', ['Une situation de proportionnalité', 'Une croissance exponentielle', 'Une évolution constante', 'Une suite géométrique'], 0, 'f(x) = a x : la droite passe par l’origine du repère.'],
            ['Un forfait coûte 10 € plus 0,05 € par minute. Au bout de combien de minutes la facture atteint-elle 25 € ?', ['300 minutes', '500 minutes', '150 minutes', '250 minutes'], 0, '0,05 x + 10 = 25 donne 0,05 x = 15, soit x = 300.'],
            ['Quel lien unit suite arithmétique et fonction affine ?', ['La raison de la suite est le coefficient directeur de la fonction', 'La raison est l’ordonnée à l’origine', 'Il n’y a aucun lien', 'La suite est le carré de la fonction'], 0, 'La suite est la restriction de la fonction affine aux valeurs entières.'],
            ['Le taux d’accroissement d’une fonction affine dépend des deux points choisis.', ['Vrai', 'Faux'], 1, 'Il est constant : c’est précisément ce qui caractérise une droite.'],
            ['Quelle précaution s’impose avec un modèle affine ?', ['Ne pas l’extrapoler hors de son domaine de validité', 'Ne jamais l’utiliser sur des données réelles', 'Toujours l’appliquer à des valeurs entières', 'Toujours prendre b = 0'], 0, 'Prolonger une droite au-delà de l’intervalle observé est une faute classique de lecture de données.'],
          ],
        },
        {
          titre: 'Croissance exponentielle et suites géométriques',
          axe: 'Mathématiques',
          lecon: {
            titre: 'Multiplier toujours par le même nombre',
            cours: `Une évolution est **exponentielle** quand la grandeur est **multipliée** par un facteur constant à chaque étape — et **non augmentée** d’une quantité constante.

## Définition
Une suite est **géométrique de raison q** (q > 0) si **u(n+1) = q × u(n)**.

| Comment retrouver q | Le lien avec l’information chiffrée |
| Par **division** : q = u(n+1) / u(n) | **q est le coefficient multiplicateur** : **q = 1 + t** |

## Forme explicite
**u(n) = u(0) × q^n**

> Un capital de **1 000 €** placé à **4 %** par an : u(n) = 1 000 × 1,04^n. Au bout de 10 ans, environ **1 480 €** — et **non 1 400 €**, car les intérêts produisent eux-mêmes des intérêts.

## Croissante, décroissante
| La raison q | Le comportement |
| **q > 1** | La suite **croît**, de plus en plus vite |
| **0 < q < 1** | Elle **décroît vers 0** sans jamais l’atteindre |
| **q = 1** | Elle est **constante** |

Une population qui perd **15 %** par an suit une suite géométrique de raison **0,85**.

## Temps de doublement, demi-vie
| Type de croissance | Sa constante |
| Exponentielle **croissante** | Un **temps de doublement constant** |
| Exponentielle **décroissante** | Une **demi-vie** constante |

> La durée pour multiplier par 2 est **la même au début qu’à la fin**. C’est exactement la propriété qui sert à **dater les roches**.

> Règle utile : pour un taux annuel de t %, le temps de doublement vaut environ **70 / t** années. À 4 % l’an, environ **17,5 ans**.

## Linéaire ou exponentiel ?
| Ce qui est constant | Le modèle |
| Les **différences** | **Arithmétique** |
| Les **quotients** | **Géométrique** |

> Une croissance exponentielle finit **toujours** par dépasser n’importe quelle croissance linéaire, même très rapide au départ. C’est ce que l’intuition refuse, et ce que le graphique montre.`,
          },
          questions: [
            ['Comment définit-on une suite géométrique de raison q ?', ['u(n+1) = q × u(n)', 'u(n+1) = u(n) + q', 'u(n+1) = q^n', 'u(n+1) = u(n) / n'], 0, 'On multiplie toujours par le même nombre : c’est la croissance exponentielle.'],
            ['Quelle est la forme explicite d’une suite géométrique ?', ['u(n) = u(0) × q^n', 'u(n) = u(0) + n q', 'u(n) = q × n', 'u(n) = u(0)^n'], 0, 'C’est la puissance qui fait toute la différence avec le modèle linéaire.'],
            ['Un capital de 1 000 € est placé à 4 % par an. Que vaut-il après 10 ans ?', ['Environ 1 480 €', 'Exactement 1 400 €', 'Environ 1 040 €', 'Environ 2 000 €'], 0, '1 000 × 1,04^10 : les intérêts produisent eux-mêmes des intérêts.'],
            ['Quelle raison correspond à une baisse annuelle de 15 % ?', ['0,85', '−0,15', '1,15', '0,15'], 0, 'q = 1 + t = 1 − 0,15 = 0,85.'],
            ['Que se passe-t-il si la raison q est comprise entre 0 et 1 ?', ['La suite décroît vers 0 sans jamais l’atteindre', 'La suite croît de plus en plus vite', 'La suite est constante', 'La suite devient négative'], 0, 'C’est le modèle de la décroissance radioactive ou d’une population qui décline.'],
            ['Comment distingue-t-on une suite arithmétique d’une suite géométrique ?', ['Différences constantes pour l’une, quotients constants pour l’autre', 'Par le signe du premier terme', 'Par le nombre de termes', 'Par la valeur du rang n'], 0, 'C’est le seul test à faire, et il suffit.'],
            ['Une croissance exponentielle finit toujours par dépasser une croissance linéaire.', ['Vrai', 'Faux'], 0, 'Quel que soit le coefficient directeur de la droite, la courbe exponentielle finit par la dépasser.'],
            ['Quel est l’ordre de grandeur du temps de doublement pour une croissance de 4 % par an ?', ['Environ 17 ans', 'Environ 4 ans', 'Environ 25 ans', 'Environ 50 ans'], 0, 'La règle approchée 70/t donne 70/4 ≈ 17,5 ans.'],
          ],
        },
        {
          titre: 'Croissance et fonctions exponentielles',
          axe: 'Mathématiques',
          lecon: {
            titre: 'La courbe qui s’envole, version continue',
            cours: `Comme la fonction affine prolongeait la suite arithmétique, la **fonction exponentielle** prolonge la **suite géométrique** : même croissance, mais pour **toute** valeur de la variable.

## Définition
Pour un réel **q > 0** : **f(x) = k × q^x**, où **k = f(0)** est la valeur initiale.

> La suite géométrique en est exactement la **restriction aux entiers** : mêmes points, mais la fonction **relie les intervalles**.

## Propriétés
| Propriété | Ce qu’elle dit |
| Elle est **toujours strictement positive** | Une exponentielle ne s’**annule jamais** et ne devient jamais négative |
| **q > 1** | Croissante |
| **0 < q < 1** | Décroissante |
| **q^(a+b) = q^a × q^b** | **Additionner les durées revient à multiplier les facteurs** |
| Sa courbe, pour q > 1 | Elle part **lentement**, puis **s’envole** |

> La propriété fondamentale est la quatrième : c’est **cela**, exactement, qu’on appelle une croissance exponentielle.

## Lire un graphique
| Repère | Ce qu’il révèle |
| Le **temps de doublement est constant** | Si la grandeur double en 5 ans entre 2000 et 2005, elle double encore en 5 ans entre 2020 et 2025 |
| En **échelle logarithmique** verticale | Une exponentielle devient une **droite** |

> C’est pourquoi les graphiques d’épidémie ou de croissance économique sont souvent tracés ainsi : **la droite se lit, la courbe se subit**.

## Modéliser
| Phénomène | Son modèle |
| Décroissance **radioactive** | N(t) = N0 × 0,5^(t/T), avec T la demi-vie |
| Croissance d’un **placement** | C(t) = C0 × 1,04^t |
| **Refroidissement**, dilution, absorption de la lumière dans l’eau | Le même modèle |

> Ce que le programme veut faire percevoir tient en une phrase : **un pourcentage constant d’évolution ne produit jamais une droite**.`,
          },
          questions: [
            ['Quelle est la forme d’une fonction exponentielle de base q ?', ['f(x) = k × q^x', 'f(x) = k × x^q', 'f(x) = k x + q', 'f(x) = k / x^q'], 0, 'La variable est à l’exposant : c’est ce qui distingue exponentielle et fonction puissance.'],
            ['Une fonction exponentielle peut-elle prendre des valeurs négatives ?', ['Non, elle est toujours strictement positive', 'Oui, si q est négatif', 'Oui, si x est négatif', 'Oui, si k vaut 0'], 0, 'Elle ne s’annule jamais et ne change jamais de signe.'],
            ['Quelle propriété fondamentale caractérise l’exponentielle ?', ['q^(a+b) = q^a × q^b', 'q^(a+b) = q^a + q^b', 'q^(a×b) = q^a + q^b', 'q^a = a^q'], 0, 'Additionner les durées revient à multiplier les facteurs : c’est la définition même de la croissance exponentielle.'],
            ['Que devient une courbe exponentielle tracée avec un axe vertical en échelle logarithmique ?', ['Une droite', 'Une parabole', 'Une courbe encore plus raide', 'Une horizontale'], 0, 'C’est le repère graphique le plus sûr pour identifier une croissance exponentielle.'],
            ['Quelle formule décrit la décroissance radioactive ?', ['N(t) = N0 × 0,5^(t/T)', 'N(t) = N0 − t/T', 'N(t) = N0 × t^0,5', 'N(t) = N0 / t'], 0, 'T est la demi-vie : c’est bien une fonction exponentielle de base 0,5.'],
            ['Le temps de doublement d’une croissance exponentielle change-t-il au cours du temps ?', ['Non, il est constant', 'Oui, il augmente', 'Oui, il diminue', 'Il dépend de la valeur initiale'], 0, 'C’est même le meilleur critère de reconnaissance d’un modèle exponentiel.'],
            ['Une fonction exponentielle de base 0,8 est décroissante.', ['Vrai', 'Faux'], 0, 'Pour 0 < q < 1, la fonction décroît vers 0 sans jamais l’atteindre.'],
            ['Quel lien unit suite géométrique et fonction exponentielle ?', ['La suite est la restriction de la fonction aux valeurs entières', 'La suite est la dérivée de la fonction', 'Il n’y a aucun lien', 'La fonction est la somme des termes de la suite'], 0, 'Même raison, même croissance : l’une procède par pas, l’autre en continu.'],
          ],
        },
        {
          titre: 'Variation instantanée et nombre dérivé',
          axe: 'Mathématiques',
          lecon: {
            titre: 'La pente en un point',
            cours: `Jusqu’ici, les variations se mesuraient **entre deux instants**. Ce chapitre demande une vitesse **à un instant précis** — celle qu’affiche le **compteur** d’une voiture, et non la vitesse moyenne du trajet.

## Le taux de variation moyen
**(f(b) − f(a)) / (b − a)**

C’est le **coefficient directeur de la sécante**, la droite qui joint les points d’abscisses a et b.

| Type de fonction | Ce taux |
| **Affine** | Il est **constant** |
| Toute autre | Il **dépend des deux points** choisis |

## Passer à l’instantané
En écrivant b = a + h, le taux devient **(f(a + h) − f(a)) / h**. On regarde ce qu’il devient quand **h tend vers 0**.

> Quand ce quotient se rapproche d’un **nombre unique**, ce nombre est le **nombre dérivé de f en a**, noté **f’(a)**.

| Exemple avec f(x) = x², en a = 3 | Le calcul |
| Le quotient | ((3+h)² − 9)/h = (6h + h²)/h |
| Simplifié | **6 + h** |
| Quand h tend vers 0 | **f’(3) = 6** |

## L’interprétation graphique
Quand h tend vers 0, la **sécante pivote** et vient se confondre avec la **tangente**.

> **f’(a) est le coefficient directeur de la tangente** au point d’abscisse a. Son équation : **y = f’(a) (x − a) + f(a)**.

Lire un nombre dérivé sur un graphique, c’est lire la **pente de la tangente** : deux points, puis « ce que l’on monte divisé par ce que l’on avance ».

## Ce que le signe indique
| Signe de f’(a) | Ce qui se passe en a |
| **Positif** | La fonction **croît** — la tangente monte |
| **Négatif** | Elle **décroît** |
| **Nul** | La tangente est **horizontale** : souvent un maximum ou un minimum |

## En physique
| La fonction | Sa dérivée |
| La **position** x(t) | La **vitesse instantanée** |
| La **vitesse** v(t) | L’**accélération** |

> Le nombre dérivé n’est pas un objet purement mathématique : c’est la mesure de **ce qui change maintenant**.`,
          },
          questions: [
            ['Que vaut le taux de variation moyen de f entre a et b ?', ['(f(b) − f(a)) / (b − a)', '(f(b) + f(a)) / (b + a)', 'f(b) − f(a)', '(b − a) / (f(b) − f(a))'], 0, 'C’est le coefficient directeur de la sécante qui joint les deux points.'],
            ['Que représente graphiquement le nombre dérivé f’(a) ?', ['Le coefficient directeur de la tangente à la courbe au point d’abscisse a', 'L’ordonnée du point d’abscisse a', 'L’aire sous la courbe jusqu’à a', 'La longueur de la sécante'], 0, 'La sécante devient tangente quand le second point se rapproche du premier.'],
            ['Pour f(x) = x², combien vaut f’(3) ?', ['6', '9', '3', '0'], 0, '((3+h)² − 9)/h = 6 + h, qui tend vers 6 quand h tend vers 0.'],
            ['Quelle est l’équation de la tangente à la courbe de f au point d’abscisse a ?', ['y = f’(a)(x − a) + f(a)', 'y = f(a)(x − a) + f’(a)', 'y = f’(a) x', 'y = f(a) x + f’(a)'], 0, 'Elle passe par le point (a ; f(a)) et a pour pente f’(a).'],
            ['Que peut-on dire si f’(a) = 0 ?', ['La tangente est horizontale en a', 'La fonction s’annule en a', 'La fonction n’est pas définie en a', 'La fonction est croissante en a'], 0, 'C’est souvent le signe d’un maximum ou d’un minimum local.'],
            ['Si x(t) désigne la position d’un mobile, que représente x’(t) ?', ['Sa vitesse instantanée', 'Sa distance parcourue', 'Son accélération', 'Sa vitesse moyenne'], 0, 'Et la dérivée de la vitesse donne, elle, l’accélération.'],
            ['Le taux de variation moyen d’une fonction affine dépend des deux points choisis.', ['Vrai', 'Faux'], 1, 'Il est constant et vaut le coefficient directeur : c’est ce qui caractérise une droite.'],
            ['Comment obtient-on le nombre dérivé à partir du taux de variation ?', ['En faisant tendre h vers 0 dans (f(a+h) − f(a))/h', 'En prenant h très grand', 'En multipliant le taux par h', 'En prenant la moyenne de tous les taux'], 0, 'On passe de la variation moyenne à la variation instantanée.'],
          ],
        },
        {
          titre: 'Variation globale et fonction dérivée',
          axe: 'Mathématiques',
          lecon: {
            titre: 'Du signe de la dérivée au tableau de variation',
            cours: `Le nombre dérivé décrit un **point**. En le calculant en **tout** point, on obtient une **fonction** — et cette fonction raconte à elle seule les variations de la première sur tout un intervalle.

## Les formules à connaître
| f(x) | f’(x) |
| k, constante | **0** |
| x | **1** |
| a x + b | **a** |
| x² | **2 x** |
| x³ | **3 x²** |
| 1/x | **−1/x²** |

Et les deux règles d’usage : **(u + v)’ = u’ + v’** et **(k u)’ = k u’**.

> Exemple : f(x) = 3x² − 5x + 2 donne **f’(x) = 6x − 5**.

## Le théorème central
| Sur un intervalle, si… | Alors f est… |
| **f’(x) > 0** | **Croissante** |
| **f’(x) < 0** | **Décroissante** |
| **f’(x) = 0** partout | **Constante** |

> Étudier les variations d’une fonction se ramène donc à **étudier le signe de sa dérivée** — un problème de signe, souvent celui d’une expression affine ou d’un produit.

## La méthode du tableau de variation
1. Calculer **f’(x)** ;
2. Résoudre **f’(x) = 0** et étudier le **signe** de f’ ;
3. Dresser le tableau : x, signe de f’, **flèches** de variation de f ;
4. Calculer les **valeurs** de f aux bornes et là où f’ s’annule.

## Extremums
| Le signe de f’ passe… | L’extremum est un… |
| De **+ à −** | **Maximum** |
| De **− à +** | **Minimum** |

> L’**annulation seule ne suffit pas** : f(x) = x³ a une dérivée nulle en 0 **sans** y présenter d’extremum — la fonction continue de croître.

## Un exemple complet
| Étape | Le résultat |
| La fonction | f(x) = −2x² + 8x + 3 |
| Sa dérivée | f’(x) = −4x + 8 |
| Elle s’annule | En **x = 2**, en passant du **positif au négatif** |
| Conclusion | **Maximum en x = 2**, avec **f(2) = 11** |

> C’est ainsi que se résolvent les problèmes d’**optimisation** : la boîte de volume maximal, le bénéfice le plus élevé, la plus grande surface à clôture donnée.`,
          },
          questions: [
            ['Quelle est la dérivée de f(x) = x² ?', ['f’(x) = 2x', 'f’(x) = x', 'f’(x) = x³/3', 'f’(x) = 2'], 0, 'Et la dérivée de x³ est 3x².'],
            ['Quelle est la dérivée de f(x) = 3x² − 5x + 2 ?', ['f’(x) = 6x − 5', 'f’(x) = 6x − 5 + 2', 'f’(x) = 3x − 5', 'f’(x) = 6x'], 0, 'On dérive terme à terme : (u + v)’ = u’ + v’, et la dérivée d’une constante est nulle.'],
            ['Que peut-on conclure si f’(x) > 0 sur un intervalle ?', ['f est croissante sur cet intervalle', 'f est positive sur cet intervalle', 'f est décroissante', 'f est constante'], 0, 'Le signe de la dérivée donne le sens de variation, pas le signe de la fonction.'],
            ['Quelle est la dérivée d’une fonction constante ?', ['0', '1', 'La constante elle-même', 'x'], 0, 'Rien ne varie, donc la variation instantanée est nulle partout.'],
            ['À quelle condition un point où f’ s’annule est-il un extremum ?', ['Il faut que f’ change de signe en ce point', 'Il suffit que f’ s’annule', 'Il faut que f s’annule aussi', 'Il faut que f soit positive'], 0, 'f(x) = x³ a une dérivée nulle en 0 sans extremum : la dérivée y garde le même signe.'],
            ['Pour f(x) = −2x² + 8x + 3, en quelle valeur de x la fonction atteint-elle son maximum ?', ['x = 2', 'x = 4', 'x = 0', 'x = 8'], 0, 'f’(x) = −4x + 8 s’annule en x = 2 en passant du positif au négatif.'],
            ['Étudier les variations d’une fonction revient à étudier le signe de sa dérivée.', ['Vrai', 'Faux'], 0, 'C’est le théorème central du chapitre, et la méthode de tout tableau de variation.'],
            ['Quelle est la dérivée de f(x) = a x + b ?', ['f’(x) = a', 'f’(x) = a x', 'f’(x) = b', 'f’(x) = a + b'], 0, 'La pente d’une droite est la même partout : la dérivée est constante.'],
          ],
        },
      ],
    },
  ],
}
