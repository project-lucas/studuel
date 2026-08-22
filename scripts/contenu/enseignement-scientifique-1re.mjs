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
            cours: `Tous les atomes qui composent votre corps ont été fabriqués ailleurs, et avant vous : dans les trois premières minutes de l’Univers pour les plus légers, au cœur des étoiles pour tous les autres.

## Un élément, c’est un numéro atomique
Un **élément chimique** est défini par son **numéro atomique Z**, c’est-à-dire son nombre de protons : tout noyau à 6 protons est du carbone, quel que soit son nombre de neutrons. Deux noyaux de même Z mais de nombres de neutrons différents sont des **isotopes** (carbone 12 et carbone 14). L’élément se conserve au cours des transformations chimiques : brûler du carbone ne le détruit pas, il se retrouve dans le CO2.

## Trois fabriques successives
- **La nucléosynthèse primordiale**, dans les trois premières minutes après le Big Bang (il y a **13,8 milliards d’années**) : elle ne produit que l’hydrogène et l’hélium.
- **La nucléosynthèse stellaire** : par **fusion**, les étoiles assemblent des noyaux légers en noyaux plus lourds, jusqu’au **fer**. Au-delà du fer, la fusion consomme de l’énergie au lieu d’en libérer : elle s’arrête là.
- **Les explosions d’étoiles** (supernovae, fusions d’astres compacts) : elles forment les éléments plus lourds que le fer — l’or, l’uranium — et dispersent le tout dans l’espace.

## Des abondances très inégales
Dans l’Univers, **92 % des atomes sont de l’hydrogène** et près de 8 % de l’hélium : tout le reste pèse moins de 1 %. Sur Terre, la croûte est faite surtout d’**oxygène** (≈ 47 % en masse) et de **silicium** (≈ 28 %). Dans le corps humain, quatre éléments — **O, C, H, N** — font plus de 99 % de la masse. Trois inventaires, trois classements différents : la matière s’est triée en se rassemblant.

## Un chronomètre dans le noyau
Certains noyaux sont **radioactifs** : ils se désintègrent spontanément, au hasard, mais à un rythme statistique fixe. La **demi-vie** (ou période) est la durée au bout de laquelle la moitié des noyaux d’un échantillon s’est désintégrée. Au bout de deux demi-vies il en reste le quart, au bout de trois le huitième : N = N0 × (1/2)^(t/T). Ni la température, ni la pression, ni la chimie ne modifient cette durée. C’est ce qui en fait une horloge — et c’est de là que viendra l’âge de la Terre.`,
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
            cours: `Un cristal, ce n’est pas une pierre précieuse : c’est un **empilement ordonné et périodique** d’atomes, d’ions ou de molécules. Le sel de table en est un, le sable aussi, et l’os également.

## Cristallin ou amorphe
Dans un solide **cristallin**, le motif se répète à l’identique dans les trois directions de l’espace : on parle d’**ordre à longue distance**. Dans un solide **amorphe** — le verre, l’obsidienne —, les atomes sont figés en désordre, comme un liquide arrêté net. Une même espèce chimique peut donner les deux : le dioxyde de silicium donne le quartz (cristallin) ou le verre (amorphe), selon la vitesse de refroidissement.

## Maille, motif, compacité
La **maille** est le plus petit volume qui, répété par translation, reconstruit tout le cristal. Deux exemples au programme :
- **maille cubique simple** : un atome à chaque sommet, soit 8 × 1/8 = **1 atome par maille**, compacité ≈ **0,52** ;
- **maille cubique à faces centrées** : sommets et centres des faces, soit 8 × 1/8 + 6 × 1/2 = **4 atomes par maille**, compacité ≈ **0,74**, l’empilement le plus dense.
De la maille se déduit la **masse volumique** : ρ = (masse des atomes de la maille) / (volume de la maille).

## Les cristaux des roches
Une roche est un **assemblage de cristaux**, et leur taille raconte son histoire : un refroidissement **lent**, en profondeur, laisse le temps aux cristaux de grossir — c’est le **granite**, entièrement cristallisé et à gros grains (quartz, feldspaths, micas). Un refroidissement **rapide**, en surface, ne le permet pas : le **basalte** montre de petits cristaux noyés dans un verre. Même magma, deux textures.

## Les cristaux du vivant
Les êtres vivants fabriquent eux aussi des cristaux : **carbonate de calcium** (CaCO3) des coquilles de mollusques et des tests d’oursins, **phosphate de calcium** de l’os et de l’émail dentaire. Ces biominéraux se déposent sur une trame organique, ce qui leur donne des propriétés que le minéral seul n’a pas — la nacre résiste bien mieux à la fracture que l’aragonite pure.`,
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
            cours: `Après l’atome et le cristal, le programme monte d’un cran : la matière du vivant s’organise elle aussi, mais en une structure capable de se maintenir et de se reproduire.

## Une théorie née du microscope
La **théorie cellulaire** s’est construite en deux temps : Schleiden et Schwann affirment vers 1838 que tous les êtres vivants sont constitués de cellules ; Virchow ajoute en 1855 que **toute cellule provient d’une cellule** préexistante. Autrement dit, la lignée cellulaire est ininterrompue depuis les origines de la vie.

## Des ordres de grandeur à connaître
Une cellule animale mesure **10 à 100 micromètres** (µm), une bactérie environ **1 µm**, la membrane plasmique environ **7,5 nanomètres**. Le microscope optique ne sépare pas deux points plus proches que **0,2 µm** : il montre la cellule, jamais sa membrane — il a fallu le microscope électronique pour cela.

## La membrane, une frontière qui se forme toute seule
La membrane est une **bicouche de phospholipides**. Ces molécules sont **amphiphiles** : une tête **hydrophile** tournée vers l’eau, deux queues **hydrophobes** qui la fuient. Placées dans l’eau, elles s’organisent spontanément en bicouche, sans qu’aucune information ne le commande. La membrane délimite un **milieu intérieur** distinct du milieu extérieur et contrôle les échanges : c’est la condition première d’une cellule.

## Le métabolisme, l’activité chimique de la cellule
L’ensemble des réactions chimiques d’une cellule forme son **métabolisme**. Deux grands types :
- l’**autotrophie** — la cellule fabrique sa matière organique à partir de matière minérale et d’une source d’énergie, comme la cellule chlorophyllienne par photosynthèse ;
- l’**hétérotrophie** — la cellule prélève sa matière organique dans son milieu, puis la dégrade par **respiration** (avec dioxygène) ou par **fermentation** (sans).
Ce métabolisme dépend du **patrimoine génétique** (les enzymes disponibles) et des **conditions du milieu** (lumière, dioxygène, nutriments).`,
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
            cours: `Le Soleil rayonne **3,8 × 10^26 watts** depuis 4,6 milliards d’années. Cette puissance n’a rien de chimique : aucune combustion ne tiendrait plus de quelques milliers d’années.

## La fusion, et la masse qui manque
Au cœur du Soleil, à environ **15 millions de degrés**, quatre noyaux d’hydrogène fusionnent en un noyau d’hélium. Or l’hélium formé est **moins massif** que les quatre noyaux de départ : cette masse manquante est convertie en énergie selon la relation d’Einstein **E = m × c²**, avec c = 3,0 × 10^8 m/s. Le Soleil perd ainsi environ **4 millions de tonnes par seconde** — une paille pour un astre de 2 × 10^30 kg.

## La loi de Wien : la couleur dit la température
Tout corps chaud émet un rayonnement dont la longueur d’onde du maximum d’émission dépend **seulement** de sa température :
**λmax × T = 2,9 × 10^-3 m·K**
La surface du Soleil est à **5 800 K** : λmax ≈ 500 nm, en plein milieu du visible (vert-jaune). Une étoile plus froide (3 000 K) émet surtout dans le rouge et l’infrarouge, une étoile plus chaude (10 000 K) dans le bleu. La couleur d’une étoile est un thermomètre.

## La loi de Stefan : la puissance par mètre carré
La puissance rayonnée par unité de surface croît comme la **puissance quatrième** de la température :
**P/S = σ × T⁴**, avec σ = 5,67 × 10^-8 W·m^-2·K^-4.
Doubler la température multiplie donc la puissance émise par **16**.

## Ce qui arrive jusqu’à nous
À la distance de la Terre (150 millions de km), la puissance solaire reçue par mètre carré face au Soleil vaut **1 360 W/m²** : c’est la **constante solaire**. Elle ne dépend que de la distance — elle décroît comme 1/d².
Cette puissance ne se répartit pas également : plus la latitude est élevée, plus les rayons arrivent **inclinés** et étalent la même énergie sur une plus grande surface. La puissance reçue par mètre carré de sol est proportionnelle au **cosinus de l’angle d’incidence**. C’est cette inégalité, et elle seule, qui crée les zones climatiques et les saisons.`,
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
            cours: `La Terre ne se réchauffe ni ne se refroidit tant qu’elle **renvoie vers l’espace exactement autant d’énergie qu’elle en reçoit**. Tout le sujet du climat tient dans cette égalité, et dans le petit écart qui s’y est glissé.

## Des 1 360 aux 340 watts
La Terre intercepte le rayonnement solaire sur un **disque** (π R²) mais le répartit sur une **sphère** (4 π R²), quatre fois plus grande, en tournant sur elle-même. La puissance moyenne reçue par mètre carré vaut donc 1 360 / 4 = **340 W/m²**.

## L’albédo : la part renvoyée sans être absorbée
Environ **30 %** de cette puissance est réfléchie directement vers l’espace par les nuages, l’atmosphère, la neige et les surfaces claires : c’est l’**albédo** terrestre, soit **100 W/m²** perdus d’emblée. Restent **240 W/m²** réellement absorbés. L’albédo dépend des surfaces : proche de 0,9 pour la neige fraîche, de 0,1 pour l’océan — fondre la banquise, c’est baisser l’albédo, donc absorber davantage. C’est une **rétroaction positive**.

## Le rayonnement de la Terre et l’effet de serre
À 288 K, la Terre rayonne à son tour, mais dans l’**infrarouge** (loi de Wien : λmax ≈ 10 µm). Une partie de cet infrarouge est **absorbée par les gaz à effet de serre** — vapeur d’eau, **CO2**, méthane, protoxyde d’azote — qui la réémettent dans toutes les directions, donc en partie vers le sol. Le sol reçoit ainsi deux apports : le Soleil et l’atmosphère.
Sans effet de serre, la température moyenne de surface serait de **−18 °C**. Elle est de **+15 °C** : l’effet de serre naturel vaut **33 °C**, et il est la condition de l’eau liquide.

## Le déséquilibre actuel
Depuis l’ère industrielle, la teneur en CO2 est passée d’environ **280 ppm** à plus de **420 ppm**. L’atmosphère renvoie davantage d’infrarouge vers le sol : la Terre émet vers l’espace un peu moins qu’elle n’absorbe, avec un excédent de l’ordre de **1 W/m²**. Cet écart minuscule, accumulé sur toute la surface et sur des décennies, est le réchauffement climatique.`,
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
            cours: `La photosynthèse est la seule porte d’entrée notable de l’énergie solaire dans la matière vivante. Tout ce que nous mangeons, brûlons ou respirons en dépend.

## Une équation à connaître
**6 CO2 + 6 H2O → C6H12O6 + 6 O2**, en présence de lumière et de **chlorophylle**.
Du minéral (dioxyde de carbone et eau) devient de l’organique (glucose), et du **dioxygène** est libéré comme sous-produit. L’énergie lumineuse est stockée dans les liaisons chimiques de la matière organique.

## Où et grâce à quoi
La réaction a lieu dans les **chloroplastes** des cellules végétales. Les **pigments chlorophylliens** absorbent surtout le **bleu** et le **rouge**, et réfléchissent le **vert** : c’est pourquoi les feuilles sont vertes. Une chromatographie sépare ces pigments (chlorophylles a et b, caroténoïdes) ; un spectre d’action superposé au spectre d’absorption montre que l’activité photosynthétique suit exactement les longueurs d’onde absorbées.

## Un rendement très faible
Sur toute l’énergie solaire reçue par une plante, **moins de 1 %** finit stockée en matière organique. Ce rendement dérisoire alimente pourtant toute la biosphère : la **production primaire** de la planète est de l’ordre de **100 milliards de tonnes de carbone par an**, à parts à peu près égales entre continents et océans (phytoplancton).

## Le stock : biomasse, fossiles, biocarburants
La matière organique produite forme la **biomasse**, utilisable comme aliment ou comme combustible. Enfouie et transformée pendant des dizaines de millions d’années, elle donne les **combustibles fossiles** — le charbon vient surtout des forêts du **Carbonifère** (il y a environ 350 millions d’années), le pétrole du plancton marin. Brûler un litre d’essence, c’est libérer en quelques secondes une énergie solaire captée il y a des millions d’années : le stock se consomme infiniment plus vite qu’il ne se reconstitue.`,
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
            cours: `L’être humain est **homéotherme** : sa température interne reste voisine de **37 °C**, que l’air soit à −10 °C ou à 40 °C. Cette constance a un coût énergétique permanent.

## Le corps, un convertisseur d’énergie
Les aliments apportent de l’énergie chimique ; la **respiration cellulaire** la libère. Une part sert au travail des muscles et au fonctionnement des organes, **tout le reste finit en chaleur**. Au repos, le **métabolisme de base** dissipe environ **100 watts** — l’équivalent d’une vieille ampoule —, soit de l’ordre de **2 000 kcal par jour**, c’est-à-dire près de **8 400 kJ** (1 kcal = 4,18 kJ). À l’effort, cette puissance peut être multipliée par dix.

## Quatre voies pour évacuer la chaleur
- le **rayonnement** infrarouge émis par la peau ;
- la **convection** avec l’air (le vent l’amplifie) ;
- la **conduction** avec les objets touchés (d’où le danger de l’eau froide, bien plus conductrice que l’air) ;
- l’**évaporation** de la sueur, qui prélève environ **2 400 kJ par litre** évaporé — la seule voie qui fonctionne encore quand l’air est plus chaud que la peau.

## La régulation
La température est surveillée par l’**hypothalamus**, qui compare l’information des thermorécepteurs à une valeur de consigne et déclenche les réponses. Contre le froid : **vasoconstriction** des vaisseaux de la peau (moins de sang en surface, moins de pertes), **frissons** (contractions musculaires productrices de chaleur), horripilation. Contre le chaud : **vasodilatation** et **sudation**.

## Quand le bilan est rompu
Si les pertes dépassent durablement la production, la température interne chute : **hypothermie** en dessous de 35 °C, avec confusion puis arrêt cardiaque. Si l’évacuation ne suffit plus — effort intense, chaleur humide qui empêche l’évaporation —, c’est l’**hyperthermie**, le coup de chaleur. La fièvre, elle, n’est pas une panne : c’est la valeur de consigne qui est délibérément relevée par l’organisme.`,
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
            cours: `La sphéricité de la Terre n’est pas une découverte moderne : elle est établie depuis l’Antiquité grecque, et sa **taille** a été mesurée avec une précision remarquable trois siècles avant notre ère.

## Les indices anciens
Trois observations suffisaient : l’**ombre circulaire** de la Terre sur la Lune lors des éclipses, la **disparition des navires par la coque** avant le mât à l’horizon, et le fait qu’une **étoile change de hauteur** dans le ciel quand on se déplace vers le nord ou le sud. La troisième est la plus féconde : elle rend la Terre **mesurable**.

## Ératosthène, vers 240 avant J.-C.
Le jour du solstice d’été, le Soleil est au zénith à **Syène** (Assouan) : un puits y est éclairé jusqu’au fond. Au même instant à **Alexandrie**, un gnomon fait une ombre correspondant à un angle de **7,2°**, soit **1/50 de 360°**. Les deux villes étant distantes d’environ **5 000 stades**, la circonférence terrestre vaut 50 × 5 000 = 250 000 stades, soit environ **40 000 km**. La valeur moderne est de 40 075 km à l’équateur.

## Repérage et distances
Un point de la surface se repère par sa **latitude** (angle depuis l’équateur, de −90° à +90°, mesurée sur un **méridien**) et sa **longitude** (angle depuis le méridien de Greenwich, de −180° à +180°). La longueur d’un arc de méridien se calcule par **L = R × α**, l’angle α étant exprimé en **radians** : un degré de latitude vaut environ **111 km**, une minute d’arc vaut **1 852 m**, c’est-à-dire un **mille marin**.
En 1791, le **mètre** a d’ailleurs été défini comme la dix-millionième partie du quart du méridien terrestre : d’où les 40 000 km de tour de Terre, qui ne sont pas une coïncidence.

## Ni tout à fait ronde, ni tout à fait plate
La rotation aplatit légèrement la Terre aux pôles : le rayon équatorial vaut **6 378 km**, le rayon polaire **6 357 km**, soit 21 km d’écart. C’est un **ellipsoïde**, mais l’écart reste inférieur à 0,4 % du rayon.
Sur cette sphère, le plus court chemin entre deux points n’est pas la ligne droite d’une carte : c’est l’arc de **grand cercle**, ou **orthodromie**. La **loxodromie**, trajet à cap constant, est plus simple à suivre mais plus longue — d’où les trajectoires d’avion qui semblent remonter vers le nord sur un planisphère.`,
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
            cours: `L’âge de la Terre est un cas d’école : une même question, des réponses successives qui varient d’un facteur **un million**, et à chaque fois une méthode défendable avec les connaissances du moment.

## Les premières estimations
- **Ussher (1650)** date la Création de 4004 av. J.-C. par l’addition des générations bibliques : quelques milliers d’années.
- **Buffon (1778)** chauffe des boulets de fer de tailles différentes, mesure leur temps de refroidissement, extrapole à la taille de la Terre : il annonce publiquement **75 000 ans**, et note dans ses manuscrits des durées bien plus longues.
- Les **géologues du XIXe siècle** (Hutton, Lyell) opposent l’épaisseur des séries sédimentaires et la lenteur de l’érosion : il faut des centaines de millions d’années.
- **Lord Kelvin (1862)** reprend le calcul de refroidissement avec la thermodynamique et obtient **20 à 100 millions d’années** — un résultat impeccable, mais faux.

## Pourquoi Kelvin s’est trompé
Son modèle supposait une Terre qui se refroidit sans **aucune source de chaleur interne** et sans **convection** du manteau. Or la **radioactivité**, découverte par Becquerel en **1896**, chauffe l’intérieur du globe en permanence. Une hypothèse manquante suffit à fausser un raisonnement rigoureux : c’est la leçon épistémologique du chapitre.

## La radiochronologie
La radioactivité fournit l’horloge qui manquait. La **demi-vie** d’un isotope étant constante, le rapport entre l’isotope **père** restant et l’isotope **fils** accumulé donne l’âge de fermeture du système. Chaque couple a son domaine : **carbone 14** (demi-vie 5 730 ans) pour l’archéologie, **potassium-argon**, **rubidium-strontium**, **uranium-plomb** (demi-vies de l’ordre du milliard d’années) pour les temps géologiques.

## 4,54 milliards d’années
En **1953**, Clair Patterson date des **météorites** par la méthode uranium-plomb et obtient **4,55 milliards d’années**, valeur toujours admise (4,54 Ga). Pourquoi des météorites et non des roches terrestres ? Parce que la **tectonique des plaques** recycle sans cesse la croûte : les plus vieilles roches connues ont environ **4 milliards d’années** (gneiss d’Acasta) et les plus vieux cristaux de zircon **4,4 milliards**. La Terre a effacé ses propres archives ; les météorites, elles, n’ont pas bougé depuis la formation du système solaire.`,
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
            cours: `Situer la Terre dans l’Univers, c’est d’abord une histoire de modèles successifs, chacun jugé sur sa capacité à **rendre compte des observations**.

## Deux modèles en concurrence
Le modèle **géocentrique** de Ptolémée (IIe siècle) place la Terre immobile au centre et rend compte du mouvement des planètes au prix d’**épicycles** de plus en plus nombreux. Le modèle **héliocentrique**, proposé par Copernic en **1543**, met le Soleil au centre : il explique d’un coup le mouvement rétrograde apparent des planètes.
Les preuves viennent ensuite : **Galilée** (1610) observe à la lunette les **quatre satellites de Jupiter** — tout ne tourne donc pas autour de la Terre — et les **phases de Vénus**, incompatibles avec Ptolémée. **Kepler** énonce que les orbites sont des **ellipses** dont le Soleil occupe un foyer. **Newton** (1687) en donne la cause avec la **gravitation universelle** : F = G × m × M / d².

## Des distances qui changent d’unité
Dans le système solaire on compte en **unités astronomiques** : 1 UA = distance Terre-Soleil ≈ **150 millions de km**, parcourue par la lumière en **8 minutes**. Au-delà, on compte en **années-lumière** : 1 al ≈ 9,5 × 10^12 km. L’étoile la plus proche est à 4,2 al, la Voie lactée mesure environ **100 000 al** de diamètre, et l’Univers observable environ 13,8 milliards d’années-lumière de rayon apparent. Regarder loin, c’est regarder tôt : la lumière met du temps.

## Une planète dans une zone étroite
La Terre est une **planète tellurique** (rocheuse, dense, petite), comme Mercure, Vénus et Mars, par opposition aux **planètes géantes** gazeuses et glacées. Sa singularité tient à trois conditions réunies : une **distance** au Soleil qui place sa température dans la **zone d’habitabilité**, là où l’eau peut rester **liquide** ; une **masse** suffisante pour retenir une atmosphère ; un **champ magnétique** qui dévie le vent solaire.

## Ailleurs ?
Depuis 1995 et la première détection autour d’une étoile de type solaire, plus de **5 000 exoplanètes** ont été confirmées. Deux méthodes principales : la méthode des **transits** (la luminosité de l’étoile baisse légèrement, périodiquement, quand la planète passe devant) et celle des **vitesses radiales** (l’étoile est légèrement entraînée par la planète). Certaines se trouvent dans la zone d’habitabilité de leur étoile — condition nécessaire, pas suffisante.`,
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
            cours: `Un son est une **onde mécanique** : la vibration d’une source met en mouvement les particules du milieu, de proche en proche. Sans matière, pas de son — dans le vide, la cloche sonne pour personne.

## Une onde longitudinale
Les particules d’air vibrent **dans la direction de propagation**, créant une succession de **compressions** et de **dilatations**. Elles oscillent autour de leur position : c’est l’**énergie** qui se déplace, pas la matière.

## Célérité, période, fréquence
La célérité du son dépend du **milieu** et de sa température :
- **340 m/s** dans l’air à 20 °C ;
- **1 500 m/s** dans l’eau ;
- environ **5 000 m/s** dans l’acier.
Un son pur est caractérisé par sa **période T** (en secondes) et sa **fréquence f = 1/T** (en hertz). La **longueur d’onde** vaut **λ = v × T = v / f** : elle est la distance parcourue pendant une période. Un la3 à 440 Hz a ainsi dans l’air une longueur d’onde de 340/440 ≈ 0,77 m.

## Ce que l’oreille entend
Le domaine audible humain s’étend d’environ **20 Hz à 20 000 Hz**. En dessous ce sont les **infrasons**, au-dessus les **ultrasons** — utilisés par les chauves-souris, l’échographie et les sonars.
Trois caractéristiques d’un son musical :
- la **hauteur**, donnée par la **fréquence fondamentale** (aigu = fréquence élevée) ;
- le **timbre**, donné par les **harmoniques**, ces fréquences multiples du fondamental qui distinguent une flûte d’un violon jouant la même note ;
- l’**intensité**, liée à l’amplitude.

## Le décibel, une échelle qui trompe
L’intensité sonore I se mesure en W/m², mais l’oreille répond de façon **logarithmique**. On définit donc le **niveau d’intensité sonore** :
**L = 10 × log(I / I0)**, avec I0 = 10^-12 W/m², seuil d’audibilité.
Conséquence à retenir : **+10 dB, c’est une intensité multipliée par 10**, et **doubler l’intensité n’ajoute que 3 dB**. Deux machines identiques à 80 dB ne font pas 160 dB, mais 83. Le seuil de risque est fixé à **85 dB** pour une exposition prolongée, le seuil de douleur autour de **120 dB**.`,
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
Sur une corde tendue, la fréquence du son émis est **inversement proportionnelle à la longueur** de la corde qui vibre. Diviser la longueur par deux double la fréquence. L’école pythagoricienne constate que les intervalles jugés **consonants** correspondent à des **rapports de nombres entiers simples** :
- **octave** : rapport de fréquences **2/1** ;
- **quinte** : **3/2** ;
- **quarte** : **4/3**.
Deux notes séparées d’une octave portent d’ailleurs le même nom : le la3 vaut **440 Hz**, le la4 **880 Hz**, le la2 **220 Hz**.

## La gamme de Pythagore
On construit la gamme en empilant des **quintes** (× 3/2), puis en ramenant chaque note obtenue dans l’octave de départ (en divisant par 2 autant de fois qu’il le faut). Le procédé donne sept notes, puis douze.

## Le comma, ou l’impossibilité arithmétique
Le problème est qu’aucune puissance de 3/2 n’est jamais égale à une puissance de 2. Douze quintes donnent (3/2)^12 ≈ **129,7**, tandis que sept octaves donnent 2^7 = **128** : l’écart, environ 1,4 %, s’appelle le **comma pythagoricien**. La gamme ne se referme pas sur elle-même, et un instrument accordé ainsi sonne faux dès qu’on change de tonalité.

## La gamme tempérée
La solution, généralisée à l’époque de Bach, consiste à répartir l’erreur : l’octave est divisée en **douze demi-tons rigoureusement égaux**, chacun de rapport **2^(1/12) ≈ 1,059**. Douze demi-tons redonnent exactement l’octave, puisque (2^(1/12))^12 = 2. Aucun intervalle n’est plus parfaitement juste — la quinte tempérée vaut 1,498 au lieu de 1,5 —, mais **toutes les tonalités deviennent également jouables**. C’est un compromis assumé entre la pureté arithmétique et la liberté musicale.`,
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
            cours: `Un microphone transforme une onde sonore en **signal électrique analogique** : une tension qui varie continûment. Pour être stockée et transmise, cette variation doit devenir une **suite de nombres**.

## Échantillonner : découper le temps
On relève la valeur du signal à intervalles réguliers. La **fréquence d’échantillonnage fe** est le nombre de relevés par seconde. Le **critère de Shannon-Nyquist** impose **fe ≥ 2 × fmax** : pour reconstituer sans erreur un son contenant des fréquences jusqu’à 20 kHz, il faut échantillonner à plus de 40 kHz. C’est exactement pourquoi le CD audio utilise **44,1 kHz**. Un échantillonnage trop lent produit un **repliement de spectre** : des fréquences inventées, absentes du son d’origine.

## Quantifier : découper l’amplitude
Chaque valeur relevée est arrondie au niveau le plus proche parmi ceux que permet la **résolution**, exprimée en **bits**. Avec n bits, on dispose de **2^n niveaux** : 8 bits donnent 256 niveaux, **16 bits** en donnent **65 536**. Plus la résolution est fine, plus le **bruit de quantification** est faible.

## Calculer une taille de fichier
La taille d’un enregistrement non compressé vaut :
**taille = fe × n × durée × nombre de voies**.
Une seconde de CD audio stéréo : 44 100 × 16 × 2 = **1 411 200 bits**, soit environ **1,4 Mbit** ou **176 ko**. Une chanson de trois minutes pèse ainsi une trentaine de mégaoctets — d’où la nécessité de compresser.

## Compresser
La **compression sans perte** (FLAC, ZIP) code l’information plus efficacement : le fichier d’origine est restitué **à l’identique**, pour un gain modeste. La **compression avec perte** (MP3, AAC) supprime ce que l’oreille ne perçoit pas ou peu — sons masqués par un son plus fort, fréquences extrêmes — et divise la taille par **dix** environ. Le fichier d’origine n’est alors **pas récupérable** : c’est le prix du streaming.

## Pourquoi le numérique
Un signal analogique se dégrade à chaque copie et à chaque transmission. Une suite de 0 et de 1 se **régénère** exactement, se corrige (codes détecteurs d’erreurs), se duplique sans perte et se traite par calcul. C’est ce qui a fait basculer toute la chaîne du son.`,
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
            cours: `L’oreille est un convertisseur : elle transforme une variation de pression de l’air en **message nerveux**, puis le cerveau en fait une perception — une note, une voix, une musique.

## Trois étages
- L’**oreille externe** (pavillon, conduit auditif) capte et canalise les sons jusqu’au **tympan**, qu’ils font vibrer.
- L’**oreille moyenne** contient la chaîne des trois **osselets** — marteau, enclume, **étrier**, le plus petit os du corps. Elle **amplifie** la vibration et l’adapte, en concentrant la force du grand tympan sur la petite fenêtre ovale.
- L’**oreille interne** abrite la **cochlée**, un tube enroulé rempli de liquide où siège l’**organe de Corti** et ses **cellules ciliées**.

## Le codage dans la cochlée
La cochlée réalise une véritable **analyse en fréquences** : sa membrane basilaire, rigide et étroite à la base, souple et large au sommet, entre en résonance à un endroit différent selon la fréquence — les **aigus** à l’entrée, les **graves** au fond. C’est la **tonotopie**. La cellule ciliée excitée à cet endroit précis convertit la déformation en **message nerveux** : la **hauteur** du son est donc codée par la **position** des cellules stimulées, et l’**intensité** par la **fréquence des potentiels d’action** et le nombre de fibres recrutées.

## Jusqu’au cerveau
Le message circule par le **nerf auditif** jusqu’aux **aires auditives** du cortex temporal, où il est comparé, identifié, associé à la mémoire et aux émotions. La perception n’est pas la mesure : le cerveau reconstruit, comble les manques et se laisse tromper — c’est ce qui rend possibles les illusions auditives.

## Des lésions irréversibles
Les cellules ciliées de l’oreille interne **ne se régénèrent pas**. Un traumatisme sonore — concert, casque poussé, explosion — les détruit définitivement : la perte est **irréversible**. Les signes d’alerte sont les **acouphènes** (sifflements) et l’impression d’oreilles cotonneuses. Le risque dépend à la fois du **niveau** et de la **durée** : au-delà de **85 dB**, il croît vite, et chaque tranche de +3 dB divise par deux la durée d’exposition tolérable.`,
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
            cours: `Un chiffre seul ne dit rien : c’est le **rapport** qu’il entretient avec un autre qui l’informe. Ce premier chapitre outille la lecture des données que le reste du programme manipule.

## Proportion et pourcentage
La **proportion** d’une sous-population A dans une population E est le quotient p = effectif(A) / effectif(E), compris entre 0 et 1. Multipliée par 100, elle s’exprime en **pourcentage**. Attention aux proportions **emboîtées** : si 40 % des élèves sont en 1re et si 25 % d’entre eux prennent l’option théâtre, la proportion d’élèves de 1re option théâtre dans l’établissement vaut 0,40 × 0,25 = **0,10**, soit 10 %. Les proportions successives se **multiplient**, elles ne s’additionnent pas.

## Taux d’évolution et coefficient multiplicateur
Pour une grandeur passant de V1 à V2 :
**t = (V2 − V1) / V1** — le taux d’évolution, souvent donné en pourcentage ;
**CM = 1 + t** — le coefficient multiplicateur, tel que V2 = V1 × CM.
Une hausse de 20 % correspond à CM = 1,20 ; une baisse de 20 % à CM = 0,80.

## Évolutions successives : on multiplie
Deux évolutions qui s’enchaînent se composent en **multipliant les coefficients** : CM global = CM1 × CM2. Une hausse de 20 % suivie d’une baisse de 20 % donne 1,20 × 0,80 = **0,96**, soit une baisse finale de **4 %** — et non un retour au point de départ. C’est l’erreur la plus fréquente du chapitre.

## Évolution réciproque
Pour annuler une évolution, on applique le coefficient **inverse** : après une hausse de 25 % (CM = 1,25), il faut multiplier par 1/1,25 = 0,80, soit une **baisse de 20 %**.

## Point de pourcentage et indice
Passer de 8 % à 10 % de chômage, c’est une hausse de **2 points de pourcentage**, mais de **25 %** en valeur relative : les deux formulations sont justes et ne disent pas la même chose. Enfin, un **indice base 100** rapporte chaque valeur à celle d’une année de référence : indice = 100 × V / V(référence). Un indice de 112 signifie « +12 % depuis l’année de base ».`,
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
            cours: `Un phénomène est **aléatoire** quand on connaît l’ensemble de ses résultats possibles sans pouvoir prévoir lequel se produira. L’imprévisible individuel devient pourtant régulier en grand nombre : c’est tout l’objet de ce chapitre.

## Vocabulaire
Une **expérience aléatoire** a plusieurs **issues** possibles, dont l’ensemble forme l’**univers**. Un **événement** est un ensemble d’issues. La **probabilité** d’un événement est un nombre entre **0** (impossible) et **1** (certain), et la somme des probabilités de toutes les issues vaut 1.
En situation d’**équiprobabilité**, P(A) = (nombre d’issues favorables) / (nombre d’issues possibles). Avec un dé équilibré, P(obtenir un nombre pair) = 3/6 = 0,5.

## Fréquence n’est pas probabilité
La **fréquence** d’un événement se mesure **après coup**, sur des données : f = (nombre de réalisations) / (nombre d’essais). La probabilité, elle, est un modèle posé **avant**. Les deux se rejoignent quand l’échantillon grandit : c’est la **loi des grands nombres**. Quand n augmente, la fréquence observée se rapproche de la probabilité, et les fréquences observées sur des échantillons différents se resserrent.

## Fluctuation d’échantillonnage
Deux échantillons de même taille tirés de la même population ne donnent pas la même fréquence : cet écart, normal, s’appelle la **fluctuation d’échantillonnage**. Il **diminue** quand la taille de l’échantillon augmente — en 1/√n, ce qui signifie qu’il faut multiplier la taille par **100** pour diviser l’incertitude par **10**.
Pour une proportion p et un échantillon de taille n assez grand, environ 95 % des échantillons donnent une fréquence dans l’**intervalle de fluctuation** [p − 1/√n ; p + 1/√n].

## Simuler pour comprendre
Un tableur ou un programme permet de **simuler** des milliers de tirages en quelques secondes, et de voir se stabiliser une fréquence qu’aucun raisonnement simple ne donnerait. C’est la méthode retenue par le programme : on observe la régularité avant d’en écrire la loi.
Un piège à connaître : le hasard n’a **pas de mémoire**. Après cinq « pile » consécutifs, la probabilité du prochain lancer reste 1/2.`,
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
            cours: `Une évolution est **linéaire** quand la grandeur augmente ou diminue d’une **quantité constante** à chaque étape. Le modèle mathématique correspondant est la **suite arithmétique**.

## Définition
Une suite (u) est **arithmétique de raison r** si, pour tout entier n :
**u(n+1) = u(n) + r**.
La raison r est ce que l’on ajoute à chaque pas — négative, la suite décroît. On la retrouve par soustraction de deux termes consécutifs : r = u(n+1) − u(n).

## Forme explicite
Pour calculer un terme lointain sans passer par tous les autres :
**u(n) = u(0) + n × r**, si la suite commence au rang 0 ;
**u(n) = u(1) + (n − 1) × r**, si elle commence au rang 1.
Exemple : un abonnement de 15 € par mois avec 40 € de frais d’inscription donne u(n) = 40 + 15 n. Au bout de deux ans, u(24) = 40 + 360 = 400 €.

## Reconnaître une suite arithmétique
Le test est toujours le même : calculer les **différences** entre termes consécutifs. Constantes, la suite est arithmétique. La suite 3, 7, 11, 15 est arithmétique de raison 4 ; la suite 3, 6, 12, 24 ne l’est pas — ses différences valent 3, 6, 12 —, elle est géométrique.

## Représentation et somme
Les points d’une suite arithmétique sont **alignés** : c’est la signature graphique de la croissance linéaire. Sur un tableur, la formule d’une cellule reprend la précédente augmentée de r.
Enfin, la somme des n premiers entiers est **1 + 2 + … + n = n (n + 1) / 2**, résultat qu’on attribue au jeune Gauss additionnant 1 à 100 : cinquante paires valant 101, soit 5 050.`,
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
            cours: `La suite arithmétique décrit une évolution par **pas entiers** ; la **fonction affine** décrit la même croissance mais de façon **continue**, pour toute valeur de la variable.

## Définition et vocabulaire
Une fonction **affine** s’écrit **f(x) = a x + b**, où :
- **a** est le **coefficient directeur** — ce que gagne f quand x augmente de 1 ;
- **b** est l’**ordonnée à l’origine** — la valeur f(0), point de départ.
Si b = 0, la fonction est **linéaire** : elle traduit une situation de **proportionnalité**. Si a = 0, elle est **constante**.

## La représentation graphique est une droite
Elle est **croissante** si a > 0, **décroissante** si a < 0. Deux points suffisent à la tracer : (0 ; b) et un autre, par exemple (1 ; a + b).
Le coefficient directeur se lit comme un **taux d’accroissement** :
**a = (f(x2) − f(x1)) / (x2 − x1)**.
Ce quotient est **le même quels que soient les deux points choisis** : c’est la définition même d’une droite, et c’est ce qui distingue le linéaire de tout le reste.

## Le lien avec la suite arithmétique
Une suite arithmétique u(n) = u(0) + n r est exactement la restriction aux entiers de la fonction affine f(x) = r x + u(0). La **raison** de la suite est le **coefficient directeur** de la fonction : même croissance, deux écritures selon que le temps se compte par pas ou en continu.

## Modéliser
Prenons un forfait téléphonique : 10 € fixes plus 0,05 € par minute. Le coût s’écrit f(x) = 0,05 x + 10, avec x en minutes. Résoudre f(x) = 25 revient à chercher au bout de combien de minutes la facture atteint 25 € : 0,05 x = 15, donc x = **300 minutes**.
Attention : un modèle affine n’est valable que sur un **intervalle**. Extrapoler une droite hors de son domaine de validité — une croissance de population, une fonte de glacier — est une faute classique de lecture de données.`,
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
            cours: `Une évolution est **exponentielle** quand la grandeur est multipliée par un **facteur constant** à chaque étape — et non augmentée d’une quantité constante. C’est le modèle de l’intérêt composé, d’une population, d’une épidémie ou d’une décroissance radioactive.

## Définition
Une suite (u) est **géométrique de raison q** (q > 0) si, pour tout entier n :
**u(n+1) = q × u(n)**.
La raison se retrouve en **divisant** deux termes consécutifs : q = u(n+1) / u(n). Le lien avec le chapitre sur l’information chiffrée est direct : **q est le coefficient multiplicateur** d’un taux d’évolution constant t, avec **q = 1 + t**.

## Forme explicite
**u(n) = u(0) × q^n**.
Un capital de 1 000 € placé à 4 % par an donne u(n) = 1 000 × 1,04^n. Au bout de 10 ans : 1 000 × 1,04^10 ≈ **1 480 €** — et non 1 400 €, car les intérêts produisent eux-mêmes des intérêts.

## Croissante, décroissante
- **q > 1** : la suite croît, de plus en plus vite ;
- **0 < q < 1** : la suite décroît vers 0 sans jamais l’atteindre ;
- **q = 1** : la suite est constante.
Une population qui perd 15 % par an suit une suite géométrique de raison 0,85.

## Temps de doublement, demi-vie
Une croissance exponentielle possède un **temps de doublement constant** : la durée nécessaire pour multiplier la grandeur par 2 est la même au début qu’à la fin. Symétriquement, une décroissance exponentielle a une **demi-vie** constante — exactement la propriété qui sert à dater les roches au chapitre 1.
Une règle utile : pour un taux annuel de t %, le temps de doublement vaut approximativement **70 / t** années. À 4 % l’an, il faut environ 17,5 ans.

## Linéaire ou exponentiel ?
Le test est simple : différences constantes → **arithmétique** ; **quotients** constants → **géométrique**. La distinction n’a rien de scolaire. Une croissance exponentielle finit **toujours** par dépasser n’importe quelle croissance linéaire, même très rapide au départ : c’est ce que l’intuition refuse, et ce que le graphique montre.`,
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
            cours: `Comme la fonction affine prolongeait la suite arithmétique, la **fonction exponentielle** prolonge la suite géométrique : elle décrit la même croissance, mais pour **toute** valeur de la variable, et non plus seulement aux rangs entiers.

## Définition
Pour un réel **q > 0**, la fonction exponentielle de base q est **f(x) = k × q^x**, où k = f(0) est la valeur initiale.
La suite géométrique u(n) = u(0) × q^n en est exactement la restriction aux entiers : mêmes points, mais la fonction relie les intervalles.

## Propriétés
- La fonction est **toujours strictement positive** : une exponentielle ne s’annule jamais et ne devient jamais négative.
- Elle est **croissante si q > 1**, **décroissante si 0 < q < 1**.
- Sa propriété fondamentale est **q^(a+b) = q^a × q^b** : additionner les durées revient à multiplier les facteurs. C’est cela, exactement, qu’on appelle une croissance exponentielle.
- Sa courbe est **concave vers le haut** quand q > 1 : elle part lentement, puis s’envole.

## Lire un graphique
Deux repères permettent d’identifier un modèle exponentiel :
- le **temps de doublement** (ou la demi-vie) est **constant** : si la grandeur double en 5 ans entre 2000 et 2005, elle double encore en 5 ans entre 2020 et 2025 ;
- en **échelle logarithmique** sur l’axe vertical, une exponentielle devient une **droite**. C’est pourquoi les graphiques d’épidémie ou de croissance économique sont souvent tracés ainsi : la droite se lit, la courbe se subit.

## Modéliser
Décroissance radioactive : N(t) = N0 × 0,5^(t/T), avec T la demi-vie — la formule du chapitre 1, désormais reconnue comme une exponentielle.
Croissance d’un placement : C(t) = C0 × 1,04^t.
Refroidissement, dilution, absorption de la lumière dans l’eau : tous suivent le même modèle. Ce que le programme veut faire percevoir tient en une phrase : **un pourcentage constant d’évolution ne produit jamais une droite**.`,
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
            cours: `Jusqu’ici, les variations se mesuraient **entre deux instants**. Ce chapitre demande une vitesse **à un instant précis** — celle qu’affiche le compteur d’une voiture, et non la vitesse moyenne du trajet.

## Le taux de variation moyen
Pour une fonction f et deux réels a et b distincts :
**taux de variation moyen = (f(b) − f(a)) / (b − a)**.
C’est le **coefficient directeur de la sécante**, la droite qui joint les points d’abscisses a et b. Pour une fonction affine, ce taux est constant ; pour toute autre fonction, il dépend des deux points choisis.

## Passer à l’instantané
On rapproche b de a. En écrivant b = a + h, le taux devient **(f(a + h) − f(a)) / h**, et l’on regarde ce qu’il devient quand **h tend vers 0**. Quand ce quotient se rapproche d’un nombre unique, ce nombre est le **nombre dérivé de f en a**, noté **f’(a)**.
Exemple avec f(x) = x² en a = 3 : ((3+h)² − 9)/h = (6h + h²)/h = **6 + h**, qui tend vers **6**. Donc f’(3) = 6.

## L’interprétation graphique : la tangente
Quand h tend vers 0, la sécante pivote et vient se confondre avec la **tangente** à la courbe au point d’abscisse a. Le nombre dérivé **f’(a) est le coefficient directeur de cette tangente**. Son équation s’écrit :
**y = f’(a) (x − a) + f(a)**.
Lire un nombre dérivé sur un graphique, c’est donc lire la pente de la tangente : on repère deux points de la tangente et l’on calcule « ce que l’on monte divisé par ce que l’on avance ».

## Ce que le signe indique
- **f’(a) > 0** : la fonction croît au voisinage de a — la tangente monte ;
- **f’(a) < 0** : elle décroît ;
- **f’(a) = 0** : la tangente est **horizontale**, ce qui signale souvent un maximum ou un minimum.

## En physique
Si x(t) est la position d’un mobile, x’(t) est sa **vitesse instantanée** ; si v(t) est la vitesse, v’(t) est son **accélération**. Le nombre dérivé n’est pas un objet purement mathématique : c’est la mesure de ce qui change **maintenant**.`,
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
            cours: `Le nombre dérivé décrit un **point**. En le calculant en tout point, on obtient une **fonction** — et cette fonction raconte à elle seule les variations de la première sur tout un intervalle.

## La fonction dérivée
La **fonction dérivée** f’ associe à chaque x le nombre dérivé f’(x). Les formules à connaître :
- f(x) = k (constante) → **f’(x) = 0**
- f(x) = x → **f’(x) = 1**
- f(x) = a x + b → **f’(x) = a**
- f(x) = x² → **f’(x) = 2 x**
- f(x) = x³ → **f’(x) = 3 x²**
- f(x) = 1/x → **f’(x) = −1/x²**

Et les deux règles d’usage : **(u + v)’ = u’ + v’** et **(k u)’ = k u’**.
Exemple : f(x) = 3x² − 5x + 2 donne f’(x) = 6x − 5.

## Le théorème central
Sur un intervalle :
- si **f’(x) > 0**, alors f est **croissante** ;
- si **f’(x) < 0**, alors f est **décroissante** ;
- si **f’(x) = 0** sur tout l’intervalle, f est **constante**.
Étudier les variations d’une fonction se ramène donc à **étudier le signe de sa dérivée** — un problème de signe, souvent celui d’une expression affine ou d’un produit.

## Le tableau de variation
La méthode est toujours la même, et elle se rédige :
1. calculer f’(x) ;
2. résoudre f’(x) = 0 et étudier le signe de f’ ;
3. dresser le tableau : x, signe de f’, flèches de variation de f ;
4. calculer les valeurs de f aux bornes et aux points où f’ s’annule.

## Extremums
Un **extremum local** apparaît là où la dérivée s’**annule en changeant de signe** : de + à −, c’est un **maximum** ; de − à +, un **minimum**. L’annulation seule ne suffit pas — f(x) = x³ a une dérivée nulle en 0 sans y présenter d’extremum, la fonction continuant de croître.
Exemple complet : f(x) = −2x² + 8x + 3 donne f’(x) = −4x + 8, qui s’annule en x = 2 et passe du positif au négatif. La fonction croît jusqu’à 2, décroît ensuite : elle atteint son **maximum en x = 2**, avec f(2) = 11. C’est ainsi que se résolvent les problèmes d’optimisation — la boîte de volume maximal, le bénéfice le plus élevé, la surface la plus grande à clôture donnée.`,
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
