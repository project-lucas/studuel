// SVT PREMIÈRE (spécialité) — les 21 fiches du programme officiel, rangées sous
// ses 4 chapitres : la transmission, la variation et l’expression du patrimoine
// génétique · la dynamique interne de la Terre · les enjeux contemporains de la
// planète · le corps humain et la santé.
//
// LE DÉFAUT. Sondé le 21/08/2026 (node _ASSOCIE/sonde-chapitres.mjs 1re svt) :
// la spécialité SVT de Première n’a que QUATRE fiches composites — « Expression
// du patrimoine génétique », « La dynamique interne de la Terre », « Écosystèmes
// et services », « Variation génétique et santé ». Chacune résume un thème
// entier du programme en une fiche. La réplication de l’ADN, la mitose et la
// méiose, la sismologie, les zones de divergence, de subduction et de collision,
// la cancérisation, l’immunité innée, l’immunité adaptative et la vaccination
// n’ont AUCUNE entrée : c’est-à-dire l’essentiel de ce sur quoi porte le contrôle
// continu de Première et le socle de la Terminale.
//
// POURQUOI UN MODULE NEUF plutôt qu’un ajout dans `svt-tle.mjs` : celui-ci part
// dans la migration 233, DÉJÀ EXÉCUTÉE, qui ne doit plus être régénérée. Deux
// fichiers, même slug `svt` — d’où la génération par `--modules` et non par
// `--slugs`, qui les fusionnerait (cf. le README).
//
// PÉRIMÈTRE : la PREMIÈRE SEULE. Le ménage est borné à `level = '1re'` : la SVT
// existe sur six niveaux, et seule la Terminale a déjà reçu son programme (233,
// rangée par la 251).
//
// LE DÉCOUPAGE EST CELUI DES 4 THÈMES DU BO, qui sont aussi ceux de la maquette
// de référence. Ici, à la différence des SES, thèmes du BO et chapitres du
// cahier coïncident : « La Terre, la vie et l’organisation du vivant » se lit
// dans le cahier comme « transmission, variation et expression du patrimoine
// génétique », et le BO lui-même intitule les deux derniers « Enjeux
// contemporains de la planète » et « Corps humain et santé ».

export default {
  slug: 'svt',
  nom: 'SVT',

  titreMigration: 'SVT 1re (spécialité) — LE PROGRAMME OFFICIEL (21 fiches)',

  motif: `CONSTAT MESURÉ (node _ASSOCIE/sonde-chapitres.mjs 1re svt, 21/08/2026) :
la spécialité SVT de Première n'avait que QUATRE fiches composites — « Expression
du patrimoine génétique », « La dynamique interne de la Terre », « Écosystèmes et
services », « Variation génétique et santé » —, chacune résumant un thème entier
du programme. La réplication de l'ADN, la mitose et la méiose, la sismologie et
la structure interne du globe, les trois types de frontières de plaques, la
cancérisation, l'immunité innée, l'immunité adaptative et la vaccination
n'avaient AUCUNE entrée : l'essentiel de ce sur quoi porte l'année, et le socle
de la Terminale.

Cette migration installe les 21 fiches du programme, rangées sous ses 4
chapitres, et retire les 4 fiches composites qu'elles recouvrent.

PÉRIMÈTRE : la PREMIÈRE SEULE. Les autres niveaux gardent leurs fiches : le
ménage est borné au niveau 1re. La Terminale a reçu les siennes avec la 233,
rangée sous ses chapitres par la 251.

⚠️ CE QUI EST PERDU AU PASSAGE : les cours et les quiz des 4 fiches composites.
Ils étaient adossés à un découpage que les 21 fiches recouvrent entièrement.`,

  menage: [
    {
      raison: `La colonne chapters.theme (migration 234) conditionne tout ce qui suit :
ce module range ses 21 fiches sous 4 chapitres, et l'INSERT écrit la colonne.
Elle est REPRISE ici en ADD COLUMN IF NOT EXISTS parce que la 234 n'a jamais été
exécutée telle quelle — sans cette reprise, la migration échouerait sur
"column chapters.theme does not exist", les 4 anciennes fiches déjà supprimées
et les 21 neuves pas encore posées : une matière vide.
Le GRANT n'est pas décoratif : la migration 182 a révoqué le SELECT de table sur
chapters (pour cacher mind_map) et ne l'a rendu que colonne par colonne. Une
colonne ajoutée après elle n'hérite d'aucun droit — sans lui, l'app lirait
"permission denied" au lieu du chapitre.`,
      sql: `ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;`,
    },
    {
      raison: `Les 4 fiches composites partent, au niveau 1re SEULEMENT.

LE REPÈRE EST theme IS NULL, PAS LE TITRE : le critère « pas de chapitre de
programme » vise exactement les quatre lignes voulues, antérieures à la colonne
theme, tandis que les 21 fiches neuves en portent un dès l'INSERT — le ménage
tourne AVANT les insertions et ne peut donc jamais mordre sur elles, ni au
premier passage ni au rejeu. C'est aussi le seul repère sûr : rien ne garantit
que la base porte les mêmes apostrophes que ce fichier (piège rencontré en 249,
contourné depuis en 258, 259, 266).
⚠️ CONSÉQUENCE À CONNAÎTRE : « La dynamique interne de la Terre » existe en base
comme TITRE de fiche et revient ici comme THÈME. La fiche part, le thème reste —
ce n'est pas une contradiction, c'est le passage d'une fiche unique à un chapitre
de sept fiches.
L'ordre compte : la file « À revoir » d'abord (review_items.item_id n'a PAS de
clé étrangère — rien ne casserait, mais le compteur « X à revoir » continuerait
de compter des questions disparues), puis les quiz (quizzes.lesson_id est ON
DELETE SET NULL : ils survivraient orphelins à leur chapitre, et toujours
tirables par le moteur de questions), puis les chapitres, dont les leçons
partent en cascade.`,
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
   AND c.level = '1re'
   AND c.theme IS NULL;

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'svt'
   AND c.level = '1re'
   AND c.theme IS NULL;

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'svt'
   AND c.level = '1re'
   AND c.theme IS NULL;`,
    },
  ],

  blocs: [
    {
      niveaux: ['1re'],
      chapitres: [
        // ---- Chapitre 1 : patrimoine génétique ------------------------------
        {
          titre: 'La division cellulaire chez les eucaryotes',
          axe: 'Transmission, variation et expression du patrimoine génétique',
          lecon: {
            titre: 'Mitose et méiose',
            cours: `Toutes les cellules d'un organisme dérivent d'une seule, par divisions successives. Deux divisions coexistent, aux conséquences génétiques opposées.

## Le cycle cellulaire
| La phase | Ce qui s'y passe |
| **G1** | Croissance de la cellule |
| **S** | **Réplication** de l'ADN : chaque chromosome passe d'une à deux chromatides |
| **G2** | Préparation à la division |
| **Mitose** | La division elle-même |

Les trois premières forment l'**interphase**.

## La mitose : la conformité
Une cellule mère donne **deux cellules filles génétiquement identiques** entre elles et à la cellule mère.

| La phase | Ce qui se passe |
| **Prophase** | Les chromosomes se condensent, l'enveloppe nucléaire disparaît |
| **Métaphase** | Les chromosomes s'alignent à l'équateur |
| **Anaphase** | Les deux chromatides de chaque chromosome migrent aux pôles |
| **Télophase** | Deux noyaux se reforment, puis la cytodiérèse sépare les cytoplasmes |

> Elle assure la croissance, le renouvellement des tissus et la reproduction asexuée.

## La méiose : la diversité
Deux divisions successives à partir d'une cellule à 2n chromosomes donnent **quatre cellules haploïdes** (n).

| La division | Son nom | Ce qu'elle sépare | Le brassage produit |
| **Méiose I** | Réductionnelle | Les chromosomes **homologues** | **Interchromosomique** (répartition aléatoire) et **intrachromosomique** (crossing-over) |
| **Méiose II** | Équationnelle | Les **chromatides**, comme une mitose | Aucun |

> Chez l'humain, le seul brassage interchromosomique offre 2 puissance 23 combinaisons, soit plus de 8 millions — avant même le crossing-over et la fécondation.

## Le contrôle du cycle
Des **points de contrôle** vérifient l'intégrité de l'ADN et l'attachement des chromosomes. Leur défaillance ouvre la voie aux anomalies : c'est l'un des mécanismes de la cancérisation.`,
          },
          questions: [
            ['Que produit une mitose ?', ['Deux cellules filles génétiquement identiques à la cellule mère', 'Quatre cellules haploïdes', 'Deux cellules haploïdes', 'Une cellule à 4n chromosomes'], 0, 'La mitose est une division conforme : elle assure la stabilité génétique.'],
            ['Pendant quelle phase du cycle l’ADN est-il répliqué ?', ['La phase S de l’interphase', 'La prophase', 'L’anaphase', 'La phase G2'], 0, 'Chaque chromosome passe alors d’une à deux chromatides.'],
            ['La méiose produit quatre cellules haploïdes à partir d’une cellule diploïde.', ['Vrai', 'Faux'], 0, 'Deux divisions successives pour une seule réplication de l’ADN.'],
            ['Qu’est-ce que le brassage intrachromosomique ?', ['L’échange de segments entre chromatides de chromosomes homologues', 'La répartition aléatoire des homologues', 'La séparation des chromatides en anaphase II', 'La fusion des gamètes'], 0, 'C’est le crossing-over, qui se produit en prophase I.'],
            ['À quel moment de la méiose se sépare la paire de chromosomes homologues ?', ['En anaphase I', 'En anaphase II', 'En métaphase I', 'En télophase II'], 0, 'C’est ce qui rend la première division réductionnelle.'],
            ['Le brassage interchromosomique résulte de la disposition aléatoire des paires d’homologues en métaphase I.', ['Vrai', 'Faux'], 0, 'Chaque paire s’oriente indépendamment des autres : plus de 8 millions de combinaisons chez l’humain.'],
            ['Que se passe-t-il pendant l’anaphase d’une mitose ?', ['Les deux chromatides de chaque chromosome se séparent', 'Les chromosomes homologues se séparent', 'Les chromosomes se condensent', 'La cellule se coupe en deux'], 0, 'Chaque pôle reçoit ainsi un exemplaire complet de l’information.'],
            ['La méiose II ressemble à une mitose dans son déroulement.', ['Vrai', 'Faux'], 0, 'Elle sépare les chromatides sœurs, sans nouvelle réplication de l’ADN.'],
          ],
        },
        {
          titre: 'La réplication de l’ADN',
          axe: 'Transmission, variation et expression du patrimoine génétique',
          lecon: {
            titre: 'Un mécanisme semi-conservatif',
            cours: `Avant chaque division, la cellule copie tout son ADN. Le mécanisme est d'une fidélité remarquable — mais pas infaillible, et c'est de là que naît une part de la diversité du vivant.

## Le principe semi-conservatif
Chaque molécule d'ADN fille est formée d'un **brin parental** conservé et d'un **brin néoformé**.

| L'hypothèse | Ce qu'elle prévoyait | Le verdict de Meselson et Stahl (1958) |
| **Conservative** | Une molécule intacte, une entièrement neuve | Écartée |
| **Dispersive** | Des fragments anciens et neufs mêlés | Écartée |
| **Semi-conservative** | Un brin ancien, un brin neuf | **Confirmée** |

## Le déroulement
| L'acteur | Son rôle |
| **ADN hélicase** | Ouvre la double hélice et forme un **œil de réplication** bordé de deux **fourches** |
| **ADN polymérase** | Synthétise le brin complémentaire en respectant l'appariement A-T et C-G |

La synthèse est **orientée** : la polymérase ne travaille que dans un sens, d'où un brin copié en continu et l'autre par fragments. Chez les eucaryotes, la réplication démarre en **de nombreuses origines simultanées**.

> Sans ces origines multiples, copier 3 milliards de paires de bases prendrait des semaines.

## La fidélité, et ses limites
La polymérase corrige la plupart de ses erreurs, des systèmes de **réparation** interviennent ensuite. Il subsiste environ **une erreur par milliard de nucléotides** copiés : c'est une **mutation**.

> Une fidélité totale interdirait toute évolution ; une fidélité médiocre rendrait la vie impossible. Le vivant fonctionne sur ce compromis.

## Les agents mutagènes
| L'agent | Son effet sur l'ADN |
| **Rayons UV** | Soudent deux bases voisines |
| **Radiations ionisantes** | Cassent les brins |
| **Agents chimiques** (benzène, goudrons du tabac) | Endommagent les bases ou gênent la réplication |`,
          },
          questions: [
            ['Que signifie « réplication semi-conservative » ?', ['Chaque molécule fille garde un brin parental et un brin néoformé', 'Une molécule fille est ancienne, l’autre entièrement neuve', 'Les deux molécules filles sont entièrement neuves', 'Les brins parentaux se fragmentent au hasard'], 0, 'C’est ce que l’expérience de Meselson et Stahl a établi.'],
            ['Quelle enzyme synthétise le brin complémentaire lors de la réplication ?', ['L’ADN polymérase', 'L’ARN polymérase', 'L’ADN hélicase', 'La ligase seule'], 0, 'Elle respecte l’appariement A-T et C-G.'],
            ['L’ADN hélicase ouvre la double hélice au niveau des origines de réplication.', ['Vrai', 'Faux'], 0, 'Elle forme un œil de réplication bordé de deux fourches.'],
            ['Pourquoi la réplication démarre-t-elle en de multiples origines chez les eucaryotes ?', ['Pour copier un génome très long en un temps compatible avec le cycle cellulaire', 'Parce que l’ADN polymérase est lente à démarrer', 'Pour éviter les mutations', 'Parce que les chromosomes sont circulaires'], 0, 'Trois milliards de paires de bases à partir d’une seule origine prendraient des semaines.'],
            ['La réplication de l’ADN est parfaitement fidèle.', ['Vrai', 'Faux'], 1, 'Il subsiste environ une erreur par milliard de nucléotides : c’est une mutation.'],
            ['Quel agent mutagène provoque la soudure de deux bases voisines d’un même brin ?', ['Les rayons ultraviolets', 'Les rayons X uniquement', 'La chaleur', 'Le froid'], 0, 'Les dimères de thymine ainsi formés bloquent la réplication.'],
            ['Quelle base s’apparie avec la cytosine ?', ['La guanine', 'L’adénine', 'La thymine', 'L’uracile'], 0, 'C-G d’un côté, A-T de l’autre : l’appariement est strict.'],
            ['Sans mutation, l’évolution des espèces serait impossible.', ['Vrai', 'Faux'], 0, 'La mutation est la source première de la variabilité génétique.'],
          ],
        },
        {
          titre: 'L’expression du patrimoine génétique',
          axe: 'Transmission, variation et expression du patrimoine génétique',
          lecon: {
            titre: 'De l’ADN à la protéine',
            cours: `Un gène est une portion d'ADN qui porte l'information nécessaire à la fabrication d'une protéine. Le passage de l'une à l'autre se fait en deux étapes.

## Les deux étapes
| L'étape | Le lieu | Ce qui est produit |
| **Transcription** | Le **noyau** | Un ARN pré-messager |
| **Maturation** | Le noyau | Un ARN messager |
| **Traduction** | Le **cytoplasme** | Une protéine |

## La transcription
L'**ARN polymérase** copie le brin transcrit du gène en **ARN pré-messager**.

| L'ADN | L'ARN |
| Double brin | **Simple** brin |
| Désoxyribose | **Ribose** |
| Thymine (T) | **Uracile** (U) |

## La maturation
Le pré-messager subit un **épissage** : les **introns**, non codants, sont excisés ; les **exons** sont raboutés.

> L'**épissage alternatif** permet à un même gène de produire plusieurs ARN messagers, donc plusieurs protéines — une des raisons pour lesquelles l'humain fabrique bien plus de protéines qu'il n'a de gènes.

## La traduction
Le **ribosome** lit l'ARN messager par groupes de trois nucléotides, les **codons**. À chaque codon correspond un acide aminé, apporté par un **ARN de transfert**. La chaîne s'allonge jusqu'au **codon stop**.

## Le code génétique
| Sa propriété | Ce qu'elle signifie | Sa conséquence |
| **Universel** | Le même chez presque tous les vivants | Rend possible le génie génétique |
| **Redondant** | 64 codons pour 20 acides aminés | Des codons synonymes |
| **Non ambigu** | Un codon ne code qu'un acide aminé | Pas d'ambiguïté de lecture |

> La redondance explique qu'une mutation ponctuelle puisse être **silencieuse** : si le codon modifié reste synonyme, la protéine est inchangée.

## Du gène à l'individu
La protéine détermine une fonction cellulaire, qui se traduit à l'échelle de l'organisme. Mais le phénotype résulte de l'interaction entre le **génotype** et l'**environnement**.`,
          },
          questions: [
            ['Où se déroule la transcription chez les eucaryotes ?', ['Dans le noyau', 'Dans le cytoplasme', 'Dans le ribosome', 'Dans la mitochondrie uniquement'], 0, 'L’ARN messager rejoint ensuite le cytoplasme pour être traduit.'],
            ['Quelle base remplace la thymine dans l’ARN ?', ['L’uracile', 'La guanine', 'La cytosine', 'L’adénine'], 0, 'C’est l’une des trois différences entre ADN et ARN.'],
            ['Qu’est-ce que l’épissage ?', ['L’excision des introns et le raboutage des exons', 'La copie de l’ADN en ARN', 'La lecture de l’ARN par le ribosome', 'La réparation de l’ADN'], 0, 'Il transforme le pré-messager en ARN messager mature.'],
            ['L’épissage alternatif permet à un seul gène de coder plusieurs protéines.', ['Vrai', 'Faux'], 0, 'C’est une des raisons pour lesquelles les protéines sont bien plus nombreuses que les gènes.'],
            ['Combien de nucléotides forment un codon ?', ['Trois', 'Deux', 'Quatre', 'Un'], 0, '64 codons possibles pour 20 acides aminés.'],
            ['Que signifie « le code génétique est redondant » ?', ['Plusieurs codons différents codent le même acide aminé', 'Un codon peut coder plusieurs acides aminés', 'Le code varie selon les espèces', 'Chaque gène est présent en double'], 0, 'C’est ce qui rend possibles les mutations silencieuses.'],
            ['Un même codon peut coder plusieurs acides aminés différents.', ['Vrai', 'Faux'], 1, 'Le code est NON AMBIGU : un codon, un seul acide aminé.'],
            ['Quelle molécule apporte l’acide aminé correspondant à un codon ?', ['L’ARN de transfert', 'L’ARN messager', 'L’ADN polymérase', 'Le ribosome lui-même'], 0, 'Son anticodon s’apparie au codon de l’ARN messager.'],
          ],
        },
        {
          titre: 'Les mutations de l’ADN et la variabilité génétique',
          axe: 'Transmission, variation et expression du patrimoine génétique',
          lecon: {
            titre: 'Source de diversité, source de maladie',
            cours: `Une mutation est une modification de la séquence des nucléotides. Elle est le point de départ de toute la diversité génétique — et parfois d'une maladie.

## Les trois types
| Le type | Ce qui change |
| **Substitution** | Un nucléotide est remplacé par un autre |
| **Délétion** | Un ou plusieurs nucléotides sont perdus |
| **Insertion** | Un ou plusieurs nucléotides sont ajoutés |

> Délétions et insertions non multiples de trois provoquent un **décalage du cadre de lecture** : toute la suite de la protéine est modifiée. Les conséquences sont bien plus graves qu'une substitution.

## Les conséquences sur la protéine
| La mutation | Ce qu'elle produit | La protéine |
| **Silencieuse** | Un codon synonyme | Inchangée |
| **Faux-sens** | Un acide aminé remplacé | Fonctionnelle, moins efficace, ou inactive |
| **Non-sens** | Un codon stop prématuré | Tronquée, le plus souvent inactive |

## Somatique ou germinale
| Le type | La cellule touchée | Sa transmission |
| **Somatique** | Une cellule du corps | Aux seules cellules filles ; disparaît avec l'individu. Point de départ des cancers |
| **Germinale** | Une cellule de la lignée reproductrice | **À la descendance**. Seule celle-là compte pour l'évolution |

## La diversité des allèles
Les mutations accumulées créent les **allèles**, versions différentes d'un même gène. Leur fréquence évolue sous trois forces :
- la **sélection naturelle**, qui favorise les allèles avantageux ;
- la **dérive génétique**, effet du hasard, surtout efficace dans les petites populations ;
- les **migrations**, qui font circuler les allèles entre populations.

> Une mutation n'est ni bonne ni mauvaise en soi : c'est l'environnement qui décide. L'allèle de la drépanocytose protège du paludisme là où il sévit.`,
          },
          questions: [
            ['Quels sont les trois grands types de mutation ponctuelle ?', ['Substitution, délétion, insertion', 'Transcription, traduction, réplication', 'Mitose, méiose, fécondation', 'Duplication, translocation, fusion'], 0, 'Ils modifient la séquence de nucléotides de manières différentes.'],
            ['Pourquoi une délétion d’un seul nucléotide est-elle souvent plus grave qu’une substitution ?', ['Parce qu’elle décale le cadre de lecture de toute la suite du gène', 'Parce qu’elle supprime le gène entier', 'Parce qu’elle empêche la réplication', 'Parce qu’elle touche toujours un codon stop'], 0, 'Tous les codons suivants sont lus différemment.'],
            ['Une mutation silencieuse ne modifie pas la protéine produite.', ['Vrai', 'Faux'], 0, 'Le codon muté reste synonyme grâce à la redondance du code génétique.'],
            ['Qu’est-ce qu’une mutation non-sens ?', ['Une mutation qui fait apparaître un codon stop prématuré', 'Une mutation sans effet', 'Une mutation qui remplace un acide aminé', 'Une mutation dans un intron'], 0, 'La protéine est tronquée, le plus souvent non fonctionnelle.'],
            ['Une mutation somatique est transmise à la descendance.', ['Vrai', 'Faux'], 1, 'Seules les mutations GERMINALES sont transmissibles.'],
            ['Qu’est-ce que la dérive génétique ?', ['Une variation aléatoire des fréquences alléliques, surtout marquée dans les petites populations', 'La sélection des individus les mieux adaptés', 'La migration d’individus entre populations', 'L’apparition d’une nouvelle mutation'], 0, 'Le hasard y pèse davantage que la sélection.'],
            ['Que sont des allèles ?', ['Des versions différentes d’un même gène', 'Des gènes situés sur des chromosomes différents', 'Des protéines de même fonction', 'Des séquences non codantes'], 0, 'Ils naissent de l’accumulation des mutations.'],
            ['Un allèle avantageux dans un environnement peut être défavorable dans un autre.', ['Vrai', 'Faux'], 0, 'L’allèle drépanocytaire protège du paludisme mais entraîne une maladie grave à l’état homozygote.'],
          ],
        },
        {
          titre: 'L’histoire humaine lue dans les génomes',
          axe: 'Transmission, variation et expression du patrimoine génétique',
          lecon: {
            titre: 'Ce que l’ADN garde en mémoire',
            cours: `Comparer les génomes de populations actuelles et d'individus fossiles permet de reconstituer l'histoire du peuplement.

## La méthode
On compare des **marqueurs génétiques**, mutations neutres accumulées au fil du temps.

| L'observation | Ce qu'elle indique |
| Deux populations partagent beaucoup de marqueurs | Elles ont divergé **récemment** |
| Deux populations très différentes | Elles ont divergé **tôt** |

Le taux de mutation sert d'**horloge moléculaire** : on peut dater les séparations.

| Le marqueur | Sa transmission | La lignée tracée |
| **ADN mitochondrial** | Uniquement par la mère | Maternelle |
| **Chromosome Y** | De père en fils | Paternelle |

## Ce que l'on sait
| Le fait | Le détail |
| L'origine | *Homo sapiens* apparaît en **Afrique** il y a environ 300 000 ans |
| La diversité | Elle est **maximale en Afrique** : argument majeur en faveur de cette origine |
| Les métissages | Les populations non africaines portent quelques pour cent d'ADN de **Néandertal** ; certaines populations d'Asie et d'Océanie, de l'ADN de **Denisova** |

## Des adaptations récentes
| L'allèle sélectionné | La population concernée |
| Persistance de la **lactase** à l'âge adulte | Populations d'éleveurs |
| Variants facilitant la vie en **haute altitude** | Tibétains |
| Résistances à certaines maladies infectieuses | Diverses |

> Conclusion forte du programme : la variabilité entre individus d'une même population **dépasse** la variabilité moyenne entre populations. La notion biologique de « race » humaine n'a aucun fondement génétique.`,
          },
          questions: [
            ['Que trace l’ADN mitochondrial ?', ['La lignée maternelle', 'La lignée paternelle', 'Les deux lignées', 'Aucune lignée'], 0, 'Il est transmis uniquement par la mère.'],
            ['Où la diversité génétique humaine est-elle la plus grande ?', ['En Afrique', 'En Europe', 'En Asie', 'En Océanie'], 0, 'C’est un argument majeur en faveur de l’origine africaine d’Homo sapiens.'],
            ['Les populations non africaines actuelles portent quelques pour cent d’ADN néandertalien.', ['Vrai', 'Faux'], 0, 'L’ADN fossile a mis en évidence ces métissages.'],
            ['Qu’est-ce que l’horloge moléculaire ?', ['L’usage du taux de mutation pour dater la divergence entre deux lignées', 'La mesure du rythme circadien', 'La durée d’un cycle cellulaire', 'La vitesse de la réplication de l’ADN'], 0, 'Plus les génomes diffèrent, plus la divergence est ancienne.'],
            ['Quelle adaptation récente s’observe dans les populations d’éleveurs ?', ['La persistance de la lactase à l’âge adulte', 'La résistance au froid extrême', 'Une vision nocturne accrue', 'Une taille plus élevée'], 0, 'Elle permet de digérer le lait après le sevrage.'],
            ['La variabilité génétique entre deux individus d’une même population est en moyenne plus faible qu’entre deux populations.', ['Vrai', 'Faux'], 1, 'C’est l’inverse : la variabilité intrapopulationnelle domine largement.'],
            ['Que transmet le chromosome Y ?', ['Une information suivant la lignée paternelle', 'L’information maternelle', 'L’ensemble du génome', 'Les mitochondries'], 0, 'Il passe de père en fils, sans recombinaison sur l’essentiel de sa longueur.'],
            ['Il y a combien de temps, environ, Homo sapiens est-il apparu en Afrique ?', ['Environ 300 000 ans', 'Environ 30 000 ans', 'Environ 3 millions d’années', 'Environ 10 000 ans'], 0, 'Les fossiles du Jebel Irhoud, au Maroc, en sont un jalon.'],
          ],
        },
        {
          titre: 'Le rôle des enzymes dans les réactions métaboliques',
          axe: 'Transmission, variation et expression du patrimoine génétique',
          lecon: {
            titre: 'Des catalyseurs biologiques spécifiques',
            cours: `Le métabolisme est l'ensemble des réactions chimiques d'une cellule. Presque toutes seraient trop lentes à température corporelle sans enzymes.

## Ce qu'est une enzyme
Une **protéine catalytique** : elle accélère une réaction sans être consommée ni modifiée, et sans changer le bilan de la réaction.

> Comme c'est une protéine, elle est codée par un gène : un gène muté peut donner une enzyme inefficace et bloquer une voie métabolique entière.

## La double spécificité
| La spécificité | Ce qu'elle signifie | Le modèle |
| De **substrat** | L'enzyme ne reconnaît qu'un substrat, ou une famille très proche | Le **site actif** est complémentaire du substrat : clé-serrure, affiné en ajustement induit |
| D'**action** | Elle ne catalyse qu'un seul type de réaction | — |

## Le complexe enzyme-substrat
1. Le substrat se fixe au **site actif**.
2. La réaction s'effectue.
3. Les produits sont libérés.
4. L'enzyme, intacte, recommence.

> Une seule molécule d'enzyme peut traiter des milliers de substrats par seconde.

## Ce qui fait varier l'activité
| Le facteur | Son effet |
| **Température** | L'activité augmente, puis chute brutalement quand la protéine se **dénature** |
| **pH** | Chaque enzyme a son optimum : la pepsine en milieu très acide, l'amylase salivaire à pH neutre |
| **Concentration en substrat** | L'activité croît, puis atteint un **plateau de saturation** |
| **Inhibiteurs** | Ils bloquent le site actif ou déforment l'enzyme — de nombreux médicaments et poisons agissent ainsi |

> Le contrôle génétique du métabolisme se lit dans les maladies métaboliques : la phénylcétonurie résulte d'une enzyme déficiente qui interrompt la dégradation d'un acide aminé.`,
          },
          questions: [
            ['Qu’est-ce qu’une enzyme ?', ['Une protéine qui catalyse une réaction sans être consommée', 'Un glucide énergétique', 'Un lipide membranaire', 'Une molécule d’ARN structurale'], 0, 'Elle accélère la réaction sans en modifier le bilan.'],
            ['Quelles sont les deux spécificités d’une enzyme ?', ['Spécificité de substrat et spécificité d’action', 'Spécificité de température et de pH', 'Spécificité de cellule et de tissu', 'Spécificité d’espèce et d’organe'], 0, 'Elle ne reconnaît qu’un substrat et ne catalyse qu’un type de réaction.'],
            ['L’enzyme est consommée au cours de la réaction qu’elle catalyse.', ['Vrai', 'Faux'], 1, 'Elle est régénérée intacte et peut recommencer aussitôt.'],
            ['Que se passe-t-il quand la température dépasse largement l’optimum d’une enzyme ?', ['La protéine se dénature et l’activité chute', 'L’activité continue d’augmenter', 'Le substrat change de nature', 'La spécificité disparaît sans perte d’activité'], 0, 'La structure tridimensionnelle du site actif est détruite.'],
            ['Pourquoi l’activité enzymatique atteint-elle un plateau quand on augmente la concentration en substrat ?', ['Parce que tous les sites actifs sont occupés', 'Parce que le substrat devient toxique', 'Parce que le pH change', 'Parce que l’enzyme est consommée'], 0, 'C’est la saturation de l’enzyme.'],
            ['La pepsine et l’amylase salivaire ont le même pH optimal.', ['Vrai', 'Faux'], 1, 'La pepsine travaille en milieu très acide, l’amylase à pH proche de la neutralité.'],
            ['Comment agit un inhibiteur compétitif ?', ['Il occupe le site actif à la place du substrat', 'Il détruit l’enzyme', 'Il augmente la température', 'Il modifie le substrat'], 0, 'Beaucoup de médicaments exploitent ce mécanisme.'],
            ['Une mutation d’un gène codant une enzyme peut bloquer toute une voie métabolique.', ['Vrai', 'Faux'], 0, 'La phénylcétonurie en est un exemple : l’enzyme déficiente interrompt une dégradation.'],
          ],
        },

        // ---- Chapitre 2 : la dynamique interne de la Terre ------------------
        {
          titre: 'La surface de la Terre, contrastes entre les continents et les océans',
          axe: 'La dynamique interne de la Terre',
          lecon: {
            titre: 'Deux croûtes, deux mondes',
            cours: `La courbe hypsométrique, qui représente la répartition des altitudes du globe, présente deux maxima. Cette bimodalité est le premier indice d'une différence de nature.

## Deux maxima
| Le maximum | L'altitude | Ce qu'il correspond |
| Le premier | De 0 à 1 000 m | Les **continents** |
| Le second | De −4 000 à −5 000 m | Les **fonds océaniques** |

## Deux croûtes de composition différente
| Le caractère | Croûte **continentale** | Croûte **océanique** |
| Roches | Type **granitique** | **Basaltes** et **gabbros** |
| Riche en | Silice, aluminium | Fer, magnésium |
| Densité | Environ 2,7 | Environ 2,9 |
| Épaisseur | 30 km, jusqu'à 70 km sous les chaînes | 7 km seulement |
| Âge maximal | Plus de 4 milliards d'années | Moins de 200 millions d'années |

> Le contraste d'âge est décisif : la croûte océanique est **renouvelée en permanence**, la croûte continentale est **conservée**.

## L'isostasie
Les blocs crustaux flottent sur le **manteau** ductile, comme des icebergs sur l'eau.

| Le bloc | Son comportement |
| Léger et épais (continent) | Il flotte **haut** |
| Dense et mince (océan) | Il flotte **bas** |
| Une chaîne de montagnes | Elle possède une **racine crustale** profonde, qui explique son altitude |

> Après la fonte d'une calotte glaciaire, le continent allégé remonte : la Scandinavie s'élève encore de près d'un centimètre par an.

## Les indices de terrain
Roches, âges et densités se mesurent : forages océaniques, sondages sismiques, gravimétrie. C'est la convergence de ces mesures qui a rendu la tectonique des plaques indiscutable.`,
          },
          questions: [
            ['Que montre la courbe hypsométrique du globe terrestre ?', ['Deux maxima d’altitude, correspondant aux continents et aux océans', 'Une répartition uniforme des altitudes', 'Un maximum unique proche du niveau de la mer', 'Trois maxima distincts'], 0, 'Cette bimodalité traduit deux types de croûte de nature différente.'],
            ['De quelles roches la croûte océanique est-elle principalement constituée ?', ['Basaltes et gabbros', 'Granites et gneiss', 'Calcaires et grès', 'Péridotites'], 0, 'Elles sont plus denses et plus riches en fer et magnésium que les granites.'],
            ['La croûte continentale est plus dense que la croûte océanique.', ['Vrai', 'Faux'], 1, 'Elle est moins dense (environ 2,7 contre 2,9), ce qui explique qu’elle flotte plus haut.'],
            ['Quel est l’âge maximal de la croûte océanique actuelle ?', ['Environ 200 millions d’années', 'Environ 4 milliards d’années', 'Environ 2 milliards d’années', 'Environ 10 millions d’années'], 0, 'Elle est constamment renouvelée, alors que la croûte continentale est conservée.'],
            ['Qu’est-ce que l’équilibre isostatique ?', ['L’équilibre des blocs crustaux flottant sur le manteau ductile', 'L’équilibre des températures dans le globe', 'L’égalité des masses entre continents et océans', 'La stabilité des plaques tectoniques'], 0, 'Comparable à celui d’un iceberg flottant sur l’eau.'],
            ['Une chaîne de montagnes est soutenue par une racine crustale profonde.', ['Vrai', 'Faux'], 0, 'La croûte y atteint jusqu’à 70 km d’épaisseur.'],
            ['Pourquoi la Scandinavie s’élève-t-elle encore aujourd’hui ?', ['Parce que le continent, allégé par la fonte de la calotte glaciaire, remonte', 'Parce qu’un volcan la soulève', 'Parce que la mer se retire', 'Parce que deux plaques y entrent en collision'], 0, 'C’est un rééquilibrage isostatique en cours depuis la fin de la dernière glaciation.'],
            ['Quelle est l’épaisseur moyenne de la croûte océanique ?', ['Environ 7 km', 'Environ 30 km', 'Environ 70 km', 'Environ 100 km'], 0, 'Bien plus mince que la croûte continentale.'],
          ],
        },
        {
          titre: 'Sismologie et structure de la Terre',
          axe: 'La dynamique interne de la Terre',
          lecon: {
            titre: 'Les ondes qui révèlent l’intérieur du globe',
            cours: `Personne n'a jamais vu l'intérieur de la Terre : le forage le plus profond atteint 12 km, sur 6 371 km de rayon. Ce sont les ondes sismiques qui l'ont cartographié.

## Les deux ondes
| L'onde | Sa nature | Sa vitesse | Ce qu'elle traverse |
| **P** (primaire) | Compression | La plus rapide | Solides **et** liquides |
| **S** (secondaire) | Cisaillement | Plus lente | **Solides uniquement** |

La vitesse dépend de la **rigidité** et de la **densité** du milieu : une variation brutale signale une **discontinuité**.

## Les discontinuités majeures
| La discontinuité | Sa profondeur | Ce qu'elle sépare | L'indice |
| **Moho** (1909) | 30 km sous les continents, 7 km sous les océans | Croûte et **manteau** | Les ondes accélèrent nettement |
| **Gutenberg** | Environ 2 900 km | Manteau et **noyau externe** | Les ondes S **disparaissent** : le noyau externe est liquide |
| **Lehmann** | Environ 5 100 km | Noyau externe et **graine** | La graine est solide |

> La **zone d'ombre**, entre 103° et 143° de l'épicentre, s'explique par la réfraction des ondes P à l'entrée du noyau et l'extinction des ondes S. C'est elle qui a révélé le noyau liquide.

## Deux découpages à ne pas confondre
| Le découpage | Ses couches | Son critère |
| **Chimique** | Croûte / manteau / noyau | La **composition** |
| **Mécanique** | **Lithosphère** rigide (croûte + manteau supérieur, environ 100 km) sur **asthénosphère** ductile | Le **comportement** |

L'asthénosphère se repère au ralentissement des ondes : c'est la LVZ, *low velocity zone*.

> C'est le découpage mécanique qui compte pour la tectonique : ce sont des plaques **lithosphériques** qui se déplacent sur l'asthénosphère.`,
          },
          questions: [
            ['Quelle onde sismique ne se propage pas dans les liquides ?', ['L’onde S', 'L’onde P', 'Les deux', 'Aucune des deux'], 0, 'Son absence au-delà de 103° a révélé que le noyau externe est liquide.'],
            ['Que sépare la discontinuité de Mohorovičić ?', ['La croûte et le manteau', 'Le manteau et le noyau externe', 'Le noyau externe et la graine', 'La lithosphère et l’asthénosphère'], 0, 'Les ondes sismiques y accélèrent brutalement.'],
            ['Le noyau externe de la Terre est liquide.', ['Vrai', 'Faux'], 0, 'L’extinction des ondes S à la discontinuité de Gutenberg le démontre.'],
            ['Qu’est-ce que la lithosphère ?', ['La couche rigide formée par la croûte et le sommet du manteau', 'La croûte seule', 'Le manteau entier', 'La couche ductile sous les plaques'], 0, 'C’est l’unité mécanique qui constitue les plaques tectoniques.'],
            ['La distinction croûte/manteau/noyau est de nature chimique, celle lithosphère/asthénosphère de nature mécanique.', ['Vrai', 'Faux'], 0, 'Ne pas les confondre est une exigence classique du programme.'],
            ['Pourquoi les ondes ralentissent-elles dans l’asthénosphère ?', ['Parce qu’elle est ductile, partiellement fondue', 'Parce qu’elle est plus froide', 'Parce qu’elle est plus dense', 'Parce qu’elle est liquide en totalité'], 0, 'C’est la LVZ, zone à faible vitesse.'],
            ['À quelle profondeur se situe la discontinuité de Gutenberg ?', ['Environ 2 900 km', 'Environ 100 km', 'Environ 5 100 km', 'Environ 700 km'], 0, 'Elle marque la limite manteau / noyau externe.'],
            ['La zone d’ombre sismique s’explique par la réfraction des ondes à l’entrée du noyau.', ['Vrai', 'Faux'], 0, 'Ondes P déviées et ondes S éteintes créent cette bande sans enregistrement direct.'],
          ],
        },
        {
          titre: 'Mécanismes de transferts thermiques',
          axe: 'La dynamique interne de la Terre',
          lecon: {
            titre: 'La chaleur interne, moteur de la tectonique',
            cours: `La Terre perd en permanence de la chaleur vers l'espace. C'est cette évacuation qui met en mouvement son manteau, et avec lui ses plaques.

## L'origine de la chaleur
| La source | Sa part |
| **Radioactivité naturelle** des roches (uranium, thorium, potassium 40) | Environ 80 % |
| **Chaleur résiduelle** de l'accrétion et de la différenciation du noyau | Le reste |

## Deux modes de transfert
| Le mode | Son principe | Où il domine | Son efficacité |
| **Conduction** | De proche en proche, **sans** déplacement de matière | La **lithosphère** rigide | Faible : la roche est un mauvais conducteur |
| **Convection** | **Par déplacement de matière** : le chaud monte, le froid redescend | Le **manteau ductile** | Élevée : elle évacue l'essentiel de la chaleur |

> Le manteau est **solide** et pourtant il flue : à ces températures et sur des millions d'années, il se déforme comme un solide ductile, à quelques centimètres par an.

## Le flux géothermique
Puissance thermique évacuée par unité de surface. Il n'est pas uniforme :

| La zone | Son flux | Pourquoi |
| **Dorsales océaniques** | **Élevé** | Le matériel chaud remonte |
| Vieux boucliers continentaux, lithosphère océanique âgée | **Faible** | Refroidie et épaissie |

> La carte du flux dessine, à elle seule, les frontières de plaques.

## Le lien avec la tectonique
La convection mantellique est le **moteur**. S'y ajoute la **traction de la plaque plongeante** à la subduction, dont on estime aujourd'hui la contribution importante.

En s'éloignant de la dorsale, la lithosphère océanique se refroidit, s'épaissit et gagne en densité — jusqu'à dépasser celle de l'asthénosphère, ce qui rend sa plongée possible.`,
          },
          questions: [
            ['Quelle est la principale source de la chaleur interne de la Terre ?', ['La radioactivité naturelle des roches', 'Le rayonnement solaire', 'Les marées océaniques', 'Les impacts de météorites'], 0, 'Elle fournit environ 80 % du flux, le reste étant la chaleur résiduelle.'],
            ['Quel mode de transfert thermique domine dans la lithosphère ?', ['La conduction', 'La convection', 'Le rayonnement', 'L’advection'], 0, 'La lithosphère est rigide : la chaleur s’y transmet de proche en proche.'],
            ['La convection implique un déplacement de matière.', ['Vrai', 'Faux'], 0, 'C’est ce qui la rend bien plus efficace que la conduction.'],
            ['Où le flux géothermique est-il le plus élevé ?', ['Au niveau des dorsales océaniques', 'Au centre des vieux continents', 'Dans les fosses océaniques profondes', 'Sous les calottes glaciaires'], 0, 'Le matériel mantellique chaud y remonte près de la surface.'],
            ['Le manteau terrestre est liquide, ce qui explique la convection.', ['Vrai', 'Faux'], 1, 'Il est SOLIDE mais ductile : il flue lentement, de quelques centimètres par an.'],
            ['Que devient la lithosphère océanique en s’éloignant de la dorsale ?', ['Elle se refroidit, s’épaissit et devient plus dense', 'Elle se réchauffe et s’allège', 'Elle reste identique', 'Elle se dissout dans l’asthénosphère'], 0, 'C’est ce qui rend possible sa plongée en subduction.'],
            ['Quel élément radioactif contribue au flux géothermique ?', ['Le potassium 40', 'Le carbone 14', 'L’hélium 3', 'Le fer 56'], 0, 'Avec l’uranium et le thorium, il chauffe l’intérieur du globe.'],
            ['La convection mantellique est un des moteurs du déplacement des plaques.', ['Vrai', 'Faux'], 0, 'S’y ajoute la traction exercée par la plaque plongeante en subduction.'],
          ],
        },
        {
          titre: 'La tectonique des plaques, caractérisation de la mobilité horizontale',
          axe: 'La dynamique interne de la Terre',
          lecon: {
            titre: 'De Wegener aux GPS',
            cours: `L'idée que les continents se déplacent a mis un demi-siècle à s'imposer. L'histoire de cette acceptation fait partie du programme.

## Wegener, 1912
Il propose la **dérive des continents** sur quatre séries d'arguments :

| L'argument | Ce qu'il montre |
| Le **tracé des côtes** | Elles s'emboîtent de part et d'autre de l'Atlantique |
| Les **structures géologiques** | Elles se prolongent d'un continent à l'autre |
| Les **fossiles** | *Mesosaurus* et *Glossopteris* sur des continents aujourd'hui séparés |
| La **glaciation** du Carbonifère | Ses traces sont communes à plusieurs continents |

> Son hypothèse est rejetée faute de mécanisme : on ne voyait pas comment un continent pourrait labourer un plancher océanique rigide.

## Les preuves décisives
| La preuve | Sa date | Ce qu'elle établit |
| L'**expansion des fonds océaniques** de Hess | 1962 | La croûte se crée à la dorsale et disparaît dans les fosses |
| Les **anomalies magnétiques** de Vine et Matthews | 1963 | Des bandes **symétriques** de part et d'autre de la dorsale, enregistrant les inversions du champ magnétique |
| Les **forages** | Années 1960-1970 | L'âge des sédiments basaux croît avec la distance à la dorsale |
| Les **points chauds** | — | La chaîne d'Hawaï aligne des volcans d'âge croissant : sens et vitesse du déplacement |

## La mesure directe
Depuis les années 1990, le **GPS** mesure les déplacements en temps réel : quelques centimètres par an, cohérents avec les vitesses déduites des anomalies magnétiques. La discussion est close.

> Une plaque **lithosphérique** est délimitée par des frontières marquées par la **sismicité** et le **volcanisme** : leur carte dessine les plaques bien mieux que celle des continents.`,
          },
          questions: [
            ['Quel argument N’A PAS été utilisé par Wegener en 1912 ?', ['Les anomalies magnétiques du plancher océanique', 'La forme complémentaire des côtes', 'La répartition de fossiles identiques', 'Les traces d’une glaciation commune'], 0, 'Elles n’ont été découvertes qu’en 1963, par Vine et Matthews.'],
            ['Pourquoi l’hypothèse de Wegener a-t-elle été rejetée ?', ['Parce qu’aucun mécanisme plausible n’expliquait le déplacement', 'Parce que ses observations étaient fausses', 'Parce que les fossiles étaient mal datés', 'Parce que les continents étaient jugés immobiles par la religion'], 0, 'On ne voyait pas comment un continent traverserait un plancher rigide.'],
            ['Les anomalies magnétiques du plancher océanique sont symétriques de part et d’autre de la dorsale.', ['Vrai', 'Faux'], 0, 'Elles enregistrent les inversions du champ magnétique au fil de l’expansion.'],
            ['Qui a proposé l’expansion des fonds océaniques en 1962 ?', ['Harry Hess', 'Alfred Wegener', 'Andrija Mohorovičić', 'Inge Lehmann'], 0, 'La croûte naît à la dorsale et disparaît dans les fosses.'],
            ['Que montre l’âge des sédiments les plus profonds d’un forage océanique ?', ['Il augmente avec la distance à la dorsale', 'Il est identique partout', 'Il diminue avec la distance à la dorsale', 'Il dépasse toujours un milliard d’années'], 0, 'C’est une confirmation directe de l’expansion océanique.'],
            ['Que permet d’estimer un alignement de volcans de point chaud ?', ['Le sens et la vitesse de déplacement de la plaque', 'L’âge de la Terre', 'L’épaisseur de la croûte continentale', 'La température du noyau'], 0, 'La chaîne d’Hawaï en est l’exemple canonique.'],
            ['Quel ordre de grandeur ont les vitesses de déplacement des plaques mesurées par GPS ?', ['Quelques centimètres par an', 'Quelques mètres par an', 'Quelques millimètres par siècle', 'Quelques kilomètres par an'], 0, 'Cohérent avec les vitesses déduites des anomalies magnétiques.'],
            ['Les frontières de plaques sont soulignées par la sismicité et le volcanisme.', ['Vrai', 'Faux'], 0, 'Leur carte dessine les plaques bien mieux que le contour des continents.'],
          ],
        },
        {
          titre: 'Les zones de divergence entre les plaques lithosphériques',
          axe: 'La dynamique interne de la Terre',
          lecon: {
            titre: 'Les dorsales, usines à croûte océanique',
            cours: `Une dorsale est une chaîne de montagnes sous-marine longue de 60 000 km, où deux plaques s'écartent et où naît la croûte océanique.

## Le mécanisme de fusion
L'écartement provoque une **décompression** du manteau qui remonte. Sans aucun apport de chaleur, cette seule baisse de pression suffit à faire fondre partiellement la **péridotite**.

> C'est la **fusion partielle par décompression adiabatique** — mécanisme à connaître précisément.

## Un magma, deux roches
| La roche | Où elle se forme | Son refroidissement | Sa structure |
| **Gabbro** | En profondeur | Lent, cristallisation entière | **Grenue** |
| **Basalte** | En surface | Brutal, au contact de l'eau de mer | **Microlitique**, en coussins (*pillow lavas*) |

> Deux roches, un seul magma basaltique : c'est la **vitesse de refroidissement** qui fait la différence.

## Dorsales rapides et dorsales lentes
| Le type | Sa vitesse | Son profil |
| **Rapide** (Pacifique est) | Jusqu'à 15 cm/an | Bombé, sans rift marqué |
| **Lente** (Atlantique) | 2 à 3 cm/an | **Rift** axial profond, reliefs escarpés |

## Les indices en surface
- Une **sismicité superficielle** et de faible magnitude.
- Des **failles normales**, signature de l'extension.
- Un **flux géothermique** très élevé.
- Des **sources hydrothermales** — les fumeurs noirs : l'eau de mer circule dans la croûte fissurée, s'enrichit en métaux et ressort à plus de 300 °C, abritant des écosystèmes indépendants de la lumière.

> En s'éloignant, la lithosphère océanique se refroidit, s'épaissit par accrétion du manteau à sa base et gagne en densité : elle devient à terme subductible.`,
          },
          questions: [
            ['Quel mécanisme produit le magma au niveau des dorsales ?', ['La fusion partielle de la péridotite par décompression', 'Un apport de chaleur venu du noyau', 'La fusion de la croûte continentale', 'La cristallisation du basalte'], 0, 'C’est la baisse de pression, et non une hausse de température, qui déclenche la fusion.'],
            ['Quelle roche se forme quand le magma basaltique refroidit lentement en profondeur ?', ['Le gabbro', 'Le basalte', 'Le granite', 'La péridotite'], 0, 'Le refroidissement lent permet une cristallisation complète : structure grenue.'],
            ['Basalte et gabbro proviennent du même magma.', ['Vrai', 'Faux'], 0, 'Seule la vitesse de refroidissement diffère, donc la texture.'],
            ['Quel type de faille domine au niveau d’une dorsale ?', ['Les failles normales', 'Les failles inverses', 'Les failles décrochantes uniquement', 'Aucune faille'], 0, 'Elles sont la signature d’un contexte d’extension.'],
            ['La sismicité des dorsales est profonde et de forte magnitude.', ['Vrai', 'Faux'], 1, 'Elle est SUPERFICIELLE et de magnitude modérée.'],
            ['Que sont les fumeurs noirs ?', ['Des sources hydrothermales sous-marines riches en métaux', 'Des volcans terrestres explosifs', 'Des panaches de cendres volcaniques', 'Des cheminées de subduction'], 0, 'Ils abritent des écosystèmes indépendants de la lumière solaire.'],
            ['Qu’est-ce qui distingue une dorsale rapide d’une dorsale lente ?', ['La dorsale lente présente un rift axial profond', 'La dorsale rapide produit du granite', 'La dorsale lente ne produit pas de magma', 'La dorsale rapide est asismique'], 0, 'L’Atlantique, lente, a un rift marqué ; le Pacifique est, rapide, un profil bombé.'],
            ['Les pillow lavas se forment par refroidissement brutal du basalte au contact de l’eau de mer.', ['Vrai', 'Faux'], 0, 'Ces coussins sont caractéristiques du volcanisme sous-marin.'],
          ],
        },
        {
          titre: 'Les zones de subduction entre les plaques lithosphériques',
          axe: 'La dynamique interne de la Terre',
          lecon: {
            titre: 'Quand une lithosphère plonge',
            cours: `La subduction est la plongée d'une lithosphère océanique dense et froide sous une autre plaque. C'est le lieu des séismes les plus puissants et du volcanisme le plus explosif.

## Pourquoi elle plonge
En vieillissant, la lithosphère océanique se refroidit et s'épaissit ; sa densité moyenne finit par **dépasser** celle de l'asthénosphère. Elle devient instable et plonge.

> La lithosphère continentale, trop peu dense, ne subduit pas. D'où la conservation des continents.

## Les marqueurs de surface
| Le marqueur | Le détail |
| **Fosse océanique** | Celle des Mariannes approche 11 000 m |
| **Prisme d'accrétion** | Sédiments raclés sur la plaque plongeante |
| **Anomalie thermique négative** | La plaque plongeante est froide |
| **Arc volcanique** | Insulaire (Japon, Antilles) ou continental (Andes), à 100-150 km au-dessus du plan de subduction |

## Le plan de Wadati-Benioff
Les foyers sismiques se répartissent sur un **plan incliné** qui matérialise la plaque plongeante, de la surface jusqu'à environ 700 km. C'est la preuve directe de la plongée.

## Le magmatisme : le rôle de l'eau
Contre-intuitif, et régulièrement demandé : ce n'est **pas la fusion de la plaque plongeante** qui produit le magma.

1. La croûte océanique hydratée s'enfonce.
2. Des **transformations métamorphiques** libèrent son eau.
3. Cette eau monte dans le manteau sus-jacent.
4. Elle **abaisse sa température de fusion** : c'est la **fusion partielle par hydratation**.

| La roche produite | Où elle refroidit |
| **Granodiorites** | En profondeur |
| **Andésites**, **rhyolites** | En surface |

Le magma, riche en silice et en eau, est **visqueux** : il piège les gaz, d'où un volcanisme **explosif** — nuées ardentes, dômes, panaches.

> La subduction est le principal mécanisme de **production de croûte continentale** : c'est là que se fabrique, aujourd'hui encore, du matériau continental neuf.`,
          },
          questions: [
            ['Pourquoi une lithosphère océanique âgée plonge-t-elle en subduction ?', ['Parce que sa densité dépasse celle de l’asthénosphère', 'Parce qu’elle est plus chaude', 'Parce qu’elle est poussée par la dorsale seule', 'Parce qu’elle est plus fine'], 0, 'Le refroidissement l’épaissit et l’alourdit jusqu’à l’instabilité.'],
            ['Qu’est-ce que le plan de Wadati-Benioff ?', ['Le plan incliné sur lequel se répartissent les foyers sismiques d’une subduction', 'La limite croûte-manteau', 'Le plan d’une faille transformante', 'La surface d’un prisme d’accrétion'], 0, 'Il matérialise la plaque plongeante jusqu’à environ 700 km.'],
            ['Le magma des zones de subduction provient de la fusion de la plaque plongeante.', ['Vrai', 'Faux'], 1, 'Il provient de la fusion du MANTEAU sus-jacent, hydraté par l’eau libérée par la plaque.'],
            ['Quel rôle joue l’eau dans le magmatisme de subduction ?', ['Elle abaisse la température de fusion du manteau', 'Elle refroidit le magma', 'Elle augmente la densité de la plaque', 'Elle empêche toute fusion'], 0, 'Libérée par les transformations métamorphiques, elle déclenche la fusion partielle.'],
            ['Pourquoi le volcanisme de subduction est-il explosif ?', ['Parce que le magma, visqueux et riche en gaz, les libère brutalement', 'Parce que le magma est très fluide', 'Parce que l’eau de mer entre en contact avec la lave', 'Parce que les éruptions sont sous-marines'], 0, 'La viscosité piège les gaz jusqu’à la rupture.'],
            ['Qu’est-ce qu’un prisme d’accrétion ?', ['Un empilement de sédiments raclés sur la plaque plongeante', 'Un volcan sous-marin', 'Une racine crustale de montagne', 'Une chambre magmatique'], 0, 'Il se forme à l’avant de la plaque chevauchante.'],
            ['Une anomalie thermique négative caractérise les zones de subduction.', ['Vrai', 'Faux'], 0, 'La plaque plongeante est froide : elle abaisse localement le flux géothermique.'],
            ['Quelle roche magmatique de subduction se forme en profondeur ?', ['La granodiorite', 'L’andésite', 'Le basalte en coussins', 'La péridotite'], 0, 'En surface, le même magma donne des andésites et des rhyolites.'],
          ],
        },
        {
          titre: 'Les zones de collision continentales (convergence)',
          axe: 'La dynamique interne de la Terre',
          lecon: {
            titre: 'La naissance et la disparition des chaînes de montagnes',
            cours: `Quand la lithosphère océanique qui séparait deux continents a été entièrement subduite, les deux blocs entrent en collision. Aucun ne peut plonger : la croûte s'épaissit.

## Les marqueurs de la collision
| Le marqueur | Ce qu'il montre |
| **Plis** | Un raccourcissement, du pli d'échantillon au pli kilométrique |
| **Failles inverses** et **chevauchements** | L'empilement des unités |
| **Nappes de charriage** | Des terrains déplacés sur des dizaines de kilomètres |
| **Racine crustale** jusqu'à 70 km | Elle soutient le relief par isostasie |

## Les témoins d'un océan disparu
| Le témoin | Ce qu'il prouve |
| **Ophiolites** — péridotites, gabbros, basaltes charriés en altitude | Un océan existait là |
| **Marges passives fossilisées** — blocs basculés, failles normales | L'ouverture initiale de cet océan |

## Le métamorphisme
L'enfouissement soumet les roches à des conditions nouvelles de **pression** et de **température** : sans fondre, elles changent de minéralogie.

Glaucophane, disthène, sillimanite, grenat sont des **marqueurs** : ils permettent de reconstituer le trajet pression-température subi, donc l'histoire de la chaîne.

## Le cycle de Wilson
1. Ouverture d'un **rift**.
2. **Océanisation**.
3. **Subduction**.
4. **Collision**.
5. **Érosion**.

> Les chaînes anciennes — Massif central, Appalaches — ne sont plus que des reliefs usés, quand les Alpes et l'Himalaya s'élèvent encore.

## Le devenir d'une chaîne
| Le processus | Son effet |
| **Érosion** | Elle rabote le relief et exporte les sédiments vers les bassins |
| **Rééquilibrage isostatique** | La racine remonte à mesure que le sommet s'allège |

> C'est ce second processus qui amène en surface les roches métamorphiques formées à 30 km de profondeur.`,
          },
          questions: [
            ['Que sont les ophiolites ?', ['Des fragments de lithosphère océanique charriés dans une chaîne de montagnes', 'Des roches volcaniques de subduction', 'Des sédiments de fond de fosse', 'Des minéraux du manteau profond'], 0, 'Leur présence en altitude prouve la disparition d’un ancien océan.'],
            ['Quel type de faille témoigne d’un raccourcissement en collision ?', ['La faille inverse', 'La faille normale', 'La faille transformante', 'Aucune faille'], 0, 'Elle empile les unités et épaissit la croûte.'],
            ['La croûte continentale peut subduire aussi facilement que la croûte océanique.', ['Vrai', 'Faux'], 1, 'Trop peu dense, elle résiste à l’enfouissement : d’où la collision et l’épaississement.'],
            ['Qu’est-ce que le métamorphisme ?', ['La transformation minéralogique d’une roche à l’état solide sous l’effet de la pression et de la température', 'La fusion complète d’une roche', 'L’altération chimique par l’eau de pluie', 'Le dépôt de sédiments en couches'], 0, 'Les minéraux nouveaux permettent de reconstituer l’histoire de l’enfouissement.'],
            ['Que révèle la présence de blocs basculés et de failles normales fossiles dans une chaîne ?', ['Une ancienne marge passive, témoin de l’ouverture d’un océan', 'Une ancienne zone de subduction', 'Un ancien point chaud', 'Une ancienne calotte glaciaire'], 0, 'C’est le témoin du stade initial du cycle de Wilson.'],
            ['Une chaîne de montagnes possède une racine crustale profonde.', ['Vrai', 'Faux'], 0, 'Elle peut atteindre 70 km : c’est elle qui soutient le relief par isostasie.'],
            ['Quels processus font disparaître une chaîne de montagnes ?', ['L’érosion et le rééquilibrage isostatique', 'La subduction et le volcanisme', 'La sédimentation et le métamorphisme', 'L’expansion océanique'], 0, 'Le second fait remonter les roches profondes à mesure que le sommet s’allège.'],
            ['Qu’est-ce qu’une nappe de charriage ?', ['Un ensemble de terrains déplacé horizontalement sur des dizaines de kilomètres', 'Une couche de sédiments marins', 'Une coulée de lave fluide', 'Un glacier de vallée'], 0, 'C’est une structure caractéristique des chaînes de collision.'],
          ],
        },

        // ---- Chapitre 3 : les enjeux contemporains de la planète ------------
        {
          titre: 'Les écosystèmes : des interactions dynamiques entre les êtres vivants et avec leur milieu',
          axe: 'Les enjeux contemporains de la planète',
          lecon: {
            titre: 'Structure et fonctionnement d’un écosystème',
            cours: `Un écosystème, c'est une biocénose, un biotope, et tout ce qui les relie.

## La définition
| Le terme | Ce qu'il désigne |
| **Biocénose** | Les êtres vivants d'un milieu |
| **Biotope** | Le milieu physico-chimique |
| **Écosystème** | Les deux, plus toutes leurs **interactions** |

## Les interactions entre êtres vivants
| L'interaction | Le bilan pour chacun | Un exemple |
| **Prédation** | L'un se nourrit de l'autre | Renard et lapin |
| **Compétition** | Même ressource limitée | Deux plantes pour la lumière |
| **Mutualisme** | Les deux y gagnent | **Mycorhizes**, pollinisation, nodosités à *Rhizobium* |
| **Parasitisme** | L'un gagne, l'autre perd | Tique |
| **Commensalisme** | L'un gagne, l'autre est indifférent | Épiphytes |

## Le flux d'énergie
L'énergie entre par la **photosynthèse** des **producteurs primaires**, puis circule le long des **réseaux trophiques**. Elle se **dégrade** à chaque niveau : de l'ordre de **10 %** seulement passe au niveau suivant, le reste étant dissipé en chaleur et consommé par la respiration.

> C'est pourquoi les chaînes alimentaires comptent rarement plus de quatre ou cinq maillons, et pourquoi les grands prédateurs sont peu nombreux.

## Le cycle de la matière
À l'inverse de l'énergie, la matière **circule en boucle** : les **décomposeurs** — bactéries, champignons, faune du sol — minéralisent la matière organique morte et rendent au milieu l'azote, le phosphore et le carbone que les producteurs réutilisent.

| L'écosystème est… | Pour quoi |
| **Ouvert** | L'énergie |
| Largement **fermé** | La matière |

## Une dynamique permanente
Un écosystème subit des **perturbations** — incendie, tempête, maladie, activité humaine — et se reconstruit par **succession écologique**, du stade pionnier au stade mature.

> Sa **résilience** est sa capacité à retrouver un fonctionnement comparable. Elle n'est pas illimitée : au-delà d'un seuil, l'écosystème bascule vers un autre état.`,
          },
          questions: [
            ['De quoi est composé un écosystème ?', ['D’une biocénose, d’un biotope et de leurs interactions', 'Des seuls animaux d’un milieu', 'Du seul milieu physico-chimique', 'D’une population unique et de son territoire'], 0, 'Les interactions font partie intégrante de la définition.'],
            ['Qu’est-ce qu’une relation de mutualisme ?', ['Une interaction bénéfique aux deux partenaires', 'Une interaction où l’un se nourrit de l’autre', 'Une interaction où l’un profite sans nuire à l’autre', 'Une compétition pour une ressource'], 0, 'Les mycorhizes en sont l’exemple le plus étudié.'],
            ['L’énergie circule en boucle fermée dans un écosystème.', ['Vrai', 'Faux'], 1, 'C’est la MATIÈRE qui circule en boucle ; l’énergie se dégrade et doit être renouvelée.'],
            ['Quelle part de l’énergie passe environ d’un niveau trophique au suivant ?', ['Environ 10 %', 'Environ 50 %', 'Environ 90 %', 'La totalité'], 0, 'Cette déperdition limite le nombre de maillons d’une chaîne alimentaire.'],
            ['Quel est le rôle des décomposeurs ?', ['Minéraliser la matière organique morte et restituer les éléments au milieu', 'Produire de la matière organique par photosynthèse', 'Consommer les producteurs primaires', 'Fixer l’énergie lumineuse'], 0, 'Sans eux, le cycle de la matière serait interrompu.'],
            ['Qu’est-ce que la résilience d’un écosystème ?', ['Sa capacité à retrouver un fonctionnement comparable après une perturbation', 'Son absence totale de variation', 'Sa productivité maximale', 'Sa richesse en espèces'], 0, 'Elle n’est pas illimitée : au-delà d’un seuil, l’écosystème bascule.'],
            ['Les mycorhizes associent un champignon et les racines d’une plante au bénéfice des deux.', ['Vrai', 'Faux'], 0, 'La plante fournit des sucres, le champignon améliore l’absorption d’eau et de sels minéraux.'],
            ['Qu’appelle-t-on succession écologique ?', ['L’enchaînement des communautés qui recolonisent un milieu après perturbation', 'Le remplacement d’un prédateur par un autre', 'La migration saisonnière des espèces', 'La disparition progressive d’un écosystème'], 0, 'Du stade pionnier au stade mature, chaque stade prépare le suivant.'],
          ],
        },
        {
          titre: 'L’humanité et les écosystèmes : les services écosystémiques et leur gestion',
          axe: 'Les enjeux contemporains de la planète',
          lecon: {
            titre: 'Ce que les écosystèmes nous rendent',
            cours: `Les services écosystémiques sont les bénéfices que les sociétés humaines tirent du fonctionnement des écosystèmes.

## Les trois catégories
| La catégorie | Ce qu'elle recouvre |
| **Approvisionnement** | Nourriture, bois, fibres, eau douce, molécules médicinales |
| **Régulation** | Pollinisation, épuration de l'eau, stockage du carbone, protection contre l'érosion et les crues |
| **Culturels** | Loisirs, tourisme, valeur esthétique, spirituelle et patrimoniale |

> La pollinisation par les insectes conditionne à elle seule une part très importante des cultures alimentaires — un service qu'aucune technique ne remplace à ce coût.

## Les pressions humaines
| La pression | Son effet |
| **Destruction et fragmentation des habitats** | Première cause d'érosion de la biodiversité |
| **Surexploitation** | Pêche, chasse, bois |
| **Pollutions** | Nitrates, pesticides, plastiques ; **eutrophisation** des milieux aquatiques |
| **Espèces exotiques envahissantes** | Introduites volontairement ou non |
| **Changement climatique** | Il déplace les aires de répartition plus vite que les espèces ne suivent |

## Gérer, pas seulement protéger
La gestion suppose des **choix entre services concurrents** :

| L'objectif | Ce qu'il coûte |
| Maximiser la production de bois | Une biodiversité forestière réduite |
| Construire une digue contre les crues | La suppression d'une zone humide |

Une décision repose sur trois piliers : un **état scientifique** des connaissances, une **évaluation** des coûts et des bénéfices, un **débat social** sur ce que l'on veut préserver.

Les outils existent : aires protégées, corridors écologiques (trames verte et bleue), restauration de zones humides, agroécologie, quotas de pêche, paiements pour services environnementaux.

> Le programme insiste : la science établit les faits et éclaire les conséquences des options, elle ne décide pas à la place de la société.`,
          },
          questions: [
            ['À quelle catégorie appartient le service de pollinisation ?', ['Les services de régulation', 'Les services d’approvisionnement', 'Les services culturels', 'Les services de production'], 0, 'Il régule le fonctionnement des cultures sans fournir directement un bien.'],
            ['Quelle est la première cause d’érosion de la biodiversité ?', ['La destruction et la fragmentation des habitats', 'Le changement climatique', 'La pollution plastique', 'Les espèces envahissantes'], 0, 'Agriculture, urbanisation et déforestation en sont les moteurs principaux.'],
            ['Le bois de construction est un service d’approvisionnement.', ['Vrai', 'Faux'], 0, 'Comme la nourriture, l’eau douce ou les molécules médicinales.'],
            ['Qu’est-ce que l’eutrophisation ?', ['L’enrichissement excessif d’un milieu aquatique en nutriments', 'L’assèchement d’une zone humide', 'L’acidification des océans', 'L’introduction d’une espèce exotique'], 0, 'Elle provoque une prolifération d’algues puis une désoxygénation du milieu.'],
            ['Une décision de gestion d’un écosystème est une décision purement scientifique.', ['Vrai', 'Faux'], 1, 'La science éclaire les options ; le choix relève du débat social.'],
            ['Qu’est-ce qu’un corridor écologique ?', ['Un espace reliant des habitats pour permettre la circulation des espèces', 'Une zone interdite à toute activité humaine', 'Un couloir de migration des oiseaux uniquement', 'Une bande de terre cultivée sans pesticides'], 0, 'C’est le principe des trames verte et bleue, contre la fragmentation.'],
            ['La valeur récréative et esthétique d’un paysage constitue un service écosystémique.', ['Vrai', 'Faux'], 0, 'C’est un service culturel, au même titre que la valeur patrimoniale.'],
            ['Pourquoi la gestion d’un écosystème suppose-t-elle des arbitrages ?', ['Parce que maximiser un service se fait souvent au détriment d’un autre', 'Parce que les services sont tous équivalents', 'Parce que la science ne dispose d’aucune donnée', 'Parce que les écosystèmes sont indestructibles'], 0, 'Produire plus de bois, par exemple, réduit la biodiversité forestière.'],
          ],
        },

        // ---- Chapitre 4 : corps humain et santé -----------------------------
        {
          titre: 'Mutations, patrimoine génétique et santé',
          axe: 'Corps humain et santé',
          lecon: {
            titre: 'Quand une mutation devient une maladie',
            cours: `Une maladie génétique résulte d'une modification de l'ADN qui altère une protéine et, par elle, une fonction de l'organisme.

## Les modes de transmission
| Le mode | Qui exprime la maladie | Un exemple |
| **Autosomique récessive** | Seul l'**homozygote** ; les parents sont **porteurs sains** | Mucoviscidose, drépanocytose |
| **Autosomique dominante** | Un seul allèle muté suffit ; un parent atteint transmet à la moitié de ses enfants | Chorée de Huntington |
| **Liée à l'X** | Surtout les garçons, qui n'ont qu'un X | Hémophilie, daltonisme, myopathie de Duchenne |

## Lire un arbre généalogique
C'est l'exercice classique de l'année. Deux repères suffisent le plus souvent :

| L'observation | La conclusion |
| Deux parents **non atteints** ont un enfant atteint | L'allèle est **récessif** |
| Une maladie récessive touche surtout les garçons | Le gène est vraisemblablement **porté par l'X** |

## Monogénique ou multifactorielle
| Le type | Ce qui la détermine | Sa transmission |
| **Monogénique** | Un seul gène | Elle suit les lois de Mendel |
| **Multifactorielle** | Plusieurs gènes de **prédisposition** et l'**environnement** | Diabète de type 2, hypertension, obésité, nombreux cancers |

> Porter un allèle de prédisposition n'est pas être malade : c'est avoir une probabilité plus élevée de le devenir.

## Diagnostic et thérapies
Le **séquençage** repère une mutation avant l'apparition des symptômes. Deux pistes thérapeutiques :
- la **thérapie génique**, qui apporte une version fonctionnelle du gène ;
- l'**édition du génome** par CRISPR-Cas9.

> La distinction entre soigner un individu (cellules **somatiques**) et modifier sa descendance (cellules **germinales**) est au cœur du débat bioéthique, et la loi l'encadre strictement.`,
          },
          questions: [
            ['Qu’est-ce qu’un porteur sain ?', ['Un individu hétérozygote qui ne développe pas la maladie mais peut la transmettre', 'Un individu guéri d’une maladie génétique', 'Un individu sans aucune mutation', 'Un individu atteint mais sans symptôme visible'], 0, 'Il n’existe que pour les maladies récessives.'],
            ['Deux parents non atteints ayant un enfant malade indiquent une transmission récessive.', ['Vrai', 'Faux'], 0, 'C’est le repère de base pour lire un arbre généalogique.'],
            ['Pourquoi les maladies liées à l’X touchent-elles surtout les garçons ?', ['Parce qu’ils ne possèdent qu’un seul chromosome X', 'Parce que le chromosome Y porte la mutation', 'Parce qu’ils héritent toujours de l’X paternel', 'Parce que leurs mutations sont plus fréquentes'], 0, 'Sans second X, aucun allèle sain ne peut compenser.'],
            ['Qu’est-ce qu’une maladie multifactorielle ?', ['Une maladie résultant de l’interaction entre plusieurs gènes et l’environnement', 'Une maladie causée par un seul gène', 'Une maladie infectieuse', 'Une maladie sans cause identifiable'], 0, 'Diabète de type 2, obésité, hypertension en relèvent.'],
            ['Porter un allèle de prédisposition signifie que l’on développera nécessairement la maladie.', ['Vrai', 'Faux'], 1, 'Cela accroît la probabilité, sans la rendre certaine : le mode de vie compte.'],
            ['Quel outil permet de modifier une séquence d’ADN de manière ciblée ?', ['CRISPR-Cas9', 'L’électrophorèse', 'La PCR seule', 'Le microscope électronique'], 0, 'Son usage sur les cellules germinales est strictement encadré par la loi.'],
            ['Quel est le mode de transmission de la chorée de Huntington ?', ['Autosomique dominante', 'Autosomique récessive', 'Liée à l’X récessive', 'Liée à l’Y'], 0, 'Un seul allèle muté suffit à provoquer la maladie.'],
            ['Modifier le génome de cellules somatiques et celui de cellules germinales soulèvent les mêmes questions éthiques.', ['Vrai', 'Faux'], 1, 'La modification germinale se transmet à la descendance : c’est ce qui change tout.'],
          ],
        },
        {
          titre: 'Origine et mécanismes de la cancérisation',
          axe: 'Corps humain et santé',
          lecon: {
            titre: 'Une cellule qui échappe au contrôle',
            cours: `Un cancer naît d'une cellule de l'organisme qui prolifère sans contrôle. Le processus est progressif : il faut plusieurs mutations accumulées dans une même lignée cellulaire.

## Les gènes en cause
| Le gène | Son rôle normal | Ce que fait la mutation | L'image |
| **Proto-oncogène** | Favoriser la division | Il devient un **oncogène** hyperactif | L'accélérateur bloqué |
| **Gène suppresseur de tumeur** | Freiner la division, déclencher réparation ou **apoptose** | Perte de fonction | Le frein qui lâche |
| Gène de **réparation de l'ADN** | Corriger les erreurs | Les autres mutations s'accumulent plus vite | Le correcteur en panne |

> Le gène **p53**, « gardien du génome », est muté dans une grande part des cancers humains.

## Les quatre étapes
1. **Initiation** — une première mutation dans une cellule.
2. **Promotion** — d'autres mutations s'accumulent, un clone prolifère.
3. **Progression** — la tumeur devient maligne, recrute des vaisseaux (**angiogenèse**), devient invasive.
4. **Métastases** — des cellules migrent par le sang ou la lymphe et colonisent d'autres organes.

## Les facteurs de risque
| Le type | Des exemples |
| **Environnementaux** | Tabac (première cause évitable), alcool, UV, amiante, particules fines, papillomavirus, hépatites B et C |
| **Génétiques** | Prédispositions héritées, comme *BRCA1* et *BRCA2* |
| **Comportementaux** | Alimentation, sédentarité, surpoids |

> Un facteur de risque n'est pas une cause suffisante : il augmente une probabilité. Et l'immense majorité des mutations impliquées sont **somatiques**, donc non transmissibles — ce qui se transmet dans les formes familiales est une **prédisposition**.

## Prévention et traitements
La **prévention primaire** — ne pas fumer, se protéger du soleil, vaccination contre le papillomavirus — et le **dépistage** précoce restent les leviers les plus efficaces.

Les traitements combinent chirurgie, radiothérapie, chimiothérapie, thérapies ciblées et **immunothérapies**, qui réactivent le système immunitaire contre la tumeur.`,
          },
          questions: [
            ['Qu’est-ce qu’un oncogène ?', ['Un proto-oncogène muté devenu hyperactif, qui stimule la division cellulaire', 'Un gène qui freine la division cellulaire', 'Un gène de réparation de l’ADN', 'Un gène viral uniquement'], 0, 'C’est l’accélérateur de la prolifération resté bloqué.'],
            ['Quel gène suppresseur de tumeur est surnommé le « gardien du génome » ?', ['p53', 'BRCA1', 'RAS', 'MYC'], 0, 'Il est muté dans une grande part des cancers humains.'],
            ['Une seule mutation suffit à transformer une cellule normale en cellule cancéreuse.', ['Vrai', 'Faux'], 1, 'La cancérisation est un processus multi-étapes qui accumule plusieurs mutations.'],
            ['Qu’est-ce que l’apoptose ?', ['La mort cellulaire programmée', 'La division cellulaire', 'La migration d’une cellule tumorale', 'La formation de nouveaux vaisseaux'], 0, 'Sa mise en échec permet à la cellule anormale de survivre.'],
            ['Qu’est-ce que l’angiogenèse tumorale ?', ['La formation de nouveaux vaisseaux sanguins irriguant la tumeur', 'La migration des cellules tumorales', 'La mort des cellules cancéreuses', 'La réparation de l’ADN'], 0, 'Elle permet à la tumeur de croître au-delà de quelques millimètres.'],
            ['Les mutations à l’origine d’un cancer sont le plus souvent somatiques.', ['Vrai', 'Faux'], 0, 'Elles ne sont donc pas transmissibles ; seule une prédisposition peut l’être.'],
            ['Quel est le premier facteur de risque évitable de cancer ?', ['Le tabac', 'Le stress', 'Le manque de sommeil', 'Les ondes électromagnétiques'], 0, 'Il est impliqué dans une part majeure des cancers évitables.'],
            ['Que sont les métastases ?', ['Des colonies tumorales secondaires formées à distance de la tumeur d’origine', 'Les premières mutations d’une cellule', 'Des cellules immunitaires anticancéreuses', 'Des vaisseaux irriguant la tumeur'], 0, 'Les cellules migrent par le sang ou la lymphe.'],
          ],
        },
        {
          titre: 'Variation génétique des bactéries et résistance aux antibiotiques',
          axe: 'Corps humain et santé',
          lecon: {
            titre: 'La sélection naturelle observée en direct',
            cours: `Un antibiotique tue les bactéries ou bloque leur multiplication. Il n'a aucun effet sur les virus — d'où l'inutilité d'en prescrire contre une grippe ou un rhume.

## D'où vient la résistance
| L'origine | Le mécanisme |
| **Mutation spontanée** | Le génome bactérien change au hasard |
| **Conjugaison** | Échange de **plasmides** entre deux bactéries, même d'espèces différentes |
| **Transformation** | Capture d'ADN libre dans le milieu |
| **Transduction** | Transport de gènes par un virus bactériophage |

> Les trois derniers sont des **transferts de gènes**, propres au monde bactérien : ils expliquent la vitesse de la diffusion.

## Le rôle exact de l'antibiotique
Point capital, souvent mal formulé en devoir : l'antibiotique **ne crée pas** la résistance.

1. La mutation **préexiste**, au hasard, dans une population immense.
2. L'antibiotique élimine toutes les bactéries sensibles.
3. Les rares résistantes ont désormais la place et les ressources.
4. Elles se multiplient et deviennent majoritaires.

> C'est un exemple de **sélection naturelle** observable en quelques jours, sur un organisme dont les générations se succèdent en vingt minutes.

## Ce qui accélère le phénomène
- La **surprescription**, et l'usage contre des infections virales.
- L'**arrêt prématuré** d'un traitement, qui laisse survivre les bactéries les moins sensibles.
- L'usage **massif en élevage**, longtemps comme facteur de croissance.
- La **transmission** des souches résistantes, notamment à l'hôpital.

## Comment lutter
| Le levier | Ce qu'il fait |
| Le **bon usage** | Prescrire seulement quand c'est nécessaire, respecter la durée |
| L'**antibiogramme** | Teste in vitro la sensibilité de la souche et cible la molécule efficace |
| L'**hygiène** | Isolement des patients porteurs, lavage des mains |
| La **recherche** | Nouvelles molécules, phagothérapie — sans dispenser du bon usage |`,
          },
          questions: [
            ['Un antibiotique est-il efficace contre un virus ?', ['Non, il n’agit que sur les bactéries', 'Oui, sur tous les virus', 'Oui, mais seulement à forte dose', 'Uniquement sur les virus respiratoires'], 0, 'Le prescrire contre une grippe est inutile et favorise les résistances.'],
            ['L’antibiotique provoque l’apparition de la mutation de résistance.', ['Vrai', 'Faux'], 1, 'La mutation préexiste au hasard : l’antibiotique ne fait que la SÉLECTIONNER.'],
            ['Qu’est-ce que la conjugaison bactérienne ?', ['Le transfert d’un plasmide d’une bactérie à une autre', 'La capture d’ADN libre dans le milieu', 'Le transport de gènes par un virus', 'La division d’une bactérie en deux'], 0, 'Elle permet la diffusion rapide des gènes de résistance, même entre espèces.'],
            ['Comment s’appelle le transfert de gènes bactériens par un virus bactériophage ?', ['La transduction', 'La transformation', 'La conjugaison', 'La transcription'], 0, 'Le virus emporte avec lui des fragments du génome bactérien.'],
            ['Pourquoi l’arrêt prématuré d’un traitement antibiotique est-il dangereux ?', ['Il laisse survivre les bactéries les moins sensibles, qui se multiplient ensuite', 'Il détruit la flore intestinale', 'Il rend le patient allergique', 'Il transforme les bactéries en virus'], 0, 'La population résiduelle est justement la plus résistante.'],
            ['Qu’est-ce qu’un antibiogramme ?', ['Un test de sensibilité d’une souche bactérienne aux différents antibiotiques', 'Une radiographie des poumons', 'Un dosage sanguin de l’antibiotique', 'Un vaccin contre les bactéries'], 0, 'Il permet de cibler la molécule réellement efficace.'],
            ['La résistance aux antibiotiques est un exemple de sélection naturelle observable en laboratoire.', ['Vrai', 'Faux'], 0, 'Les générations bactériennes se succèdent en quelques dizaines de minutes.'],
            ['Quel usage a longtemps accéléré la diffusion des résistances en dehors de la médecine humaine ?', ['L’usage massif d’antibiotiques en élevage', 'L’usage en agriculture céréalière', 'L’usage dans les produits ménagers', 'L’usage dans les cosmétiques'], 0, 'Ils y ont longtemps été employés comme facteurs de croissance.'],
          ],
        },
        {
          titre: 'L’immunité innée',
          axe: 'Corps humain et santé',
          lecon: {
            titre: 'La première ligne de défense',
            cours: `L'immunité innée est présente dès la naissance, commune à tous les animaux, immédiate et non spécifique : elle réagit de la même façon quel que soit l'intrus, sans mémoire.

## Les barrières
Peau, muqueuses, mucus, cils, acidité gastrique et microbiote forment une première frontière mécanique et chimique.

## La réaction inflammatoire aiguë
| Le signe cardinal | Sa cause |
| **Rougeur** et **chaleur** | La vasodilatation locale |
| **Gonflement** (œdème) | L'augmentation de la perméabilité des vaisseaux |
| **Douleur** | Les médiateurs qui stimulent les terminaisons nerveuses |

## Le déroulement
Les **cellules sentinelles** — macrophages, cellules dendritiques, mastocytes — résident dans les tissus. Leurs **récepteurs** détectent des motifs moléculaires **communs à des familles entières** d'agents infectieux : d'où le caractère non spécifique de la réponse.

Elles libèrent des **médiateurs de l'inflammation** — histamine, prostaglandines, cytokines — qui provoquent la vasodilatation et attirent les **phagocytes**.

| Le temps de la phagocytose | Ce qui se passe |
| **Adhésion** | Le phagocyte se lie au microbe |
| **Ingestion** | Il l'englobe dans une vésicule |
| **Digestion** | Les enzymes du phagolysosome le détruisent |
| **Élimination** | Les débris sont rejetés |

## Le lien avec l'immunité adaptative
La cellule dendritique qui a phagocyté migre vers un **ganglion lymphatique** et y présente des fragments de l'intrus : elle devient **cellule présentatrice de l'antigène**.

> C'est ce geste qui **déclenche** l'immunité adaptative. Les deux systèmes ne sont pas indépendants : l'inné commande l'adaptatif.

## Les anti-inflammatoires
Aspirine, ibuprofène et corticoïdes réduisent la réaction inflammatoire. Utiles quand elle est excessive ou douloureuse, ils affaiblissent aussi une défense utile — d'où la prudence lors de certaines infections.`,
          },
          questions: [
            ['Quelles sont les caractéristiques de l’immunité innée ?', ['Immédiate, non spécifique et sans mémoire', 'Lente, spécifique et avec mémoire', 'Immédiate, spécifique et avec mémoire', 'Lente, non spécifique et avec mémoire'], 0, 'Elle est présente dès la naissance et commune à tous les animaux.'],
            ['Quels sont les quatre signes de la réaction inflammatoire aiguë ?', ['Rougeur, chaleur, gonflement, douleur', 'Fièvre, toux, fatigue, douleur', 'Rougeur, démangeaison, pâleur, fièvre', 'Gonflement, fièvre, éruption, frissons'], 0, 'Ils sont décrits depuis l’Antiquité.'],
            ['La réaction inflammatoire est spécifique de l’agent infectieux rencontré.', ['Vrai', 'Faux'], 1, 'Elle est stéréotypée : la même réponse quel que soit l’intrus.'],
            ['Quelles sont les quatre étapes de la phagocytose ?', ['Adhésion, ingestion, digestion, élimination des débris', 'Reconnaissance, division, migration, mémoire', 'Adhésion, division, sécrétion, apoptose', 'Ingestion, multiplication, migration, présentation'], 0, 'La digestion a lieu dans le phagolysosome.'],
            ['Quelle cellule fait le lien entre immunité innée et immunité adaptative ?', ['La cellule dendritique', 'Le globule rouge', 'La plaquette', 'Le lymphocyte B naïf'], 0, 'Elle migre vers un ganglion et y présente l’antigène.'],
            ['Comment les cellules sentinelles reconnaissent-elles un micro-organisme ?', ['Par des récepteurs détectant des motifs moléculaires communs à des familles entières', 'Par un récepteur unique propre à chaque agent', 'Par la mémoire d’une rencontre antérieure', 'Par les anticorps qu’elles produisent'], 0, 'C’est ce qui rend la réponse non spécifique.'],
            ['Les médiateurs de l’inflammation provoquent une vasodilatation locale.', ['Vrai', 'Faux'], 0, 'D’où la rougeur, la chaleur et l’afflux de cellules immunitaires.'],
            ['Les anti-inflammatoires suppriment une réponse toujours nuisible à l’organisme.', ['Vrai', 'Faux'], 1, 'L’inflammation est une défense utile : la réduire n’est justifié que si elle est excessive.'],
          ],
        },
        {
          titre: 'L’immunité adaptative',
          axe: 'Corps humain et santé',
          lecon: {
            titre: 'Une réponse spécifique et une mémoire',
            cours: `L'immunité adaptative prend le relais quand l'innée ne suffit pas. Spécifique, lente à se mettre en place, et dotée d'une mémoire.

## La sélection clonale
Un **antigène** est une molécule reconnue comme étrangère. Chaque **lymphocyte** possède un récepteur d'un seul type, et le répertoire compte des milliards de spécificités, engendrées **avant toute rencontre**.

> La rencontre ne crée rien : elle **sélectionne** le clone qui possédait déjà le bon récepteur, puis le fait proliférer.

## Les deux voies
| La voie | Sa cellule | Son arme | Contre quoi |
| **Humorale** | **Lymphocyte B**, différencié en **plasmocyte** | Les **anticorps**, qui forment des **complexes immuns** éliminés par phagocytose | Les agents **dans les liquides** de l'organisme |
| **Cellulaire** | **Lymphocyte T cytotoxique (LT8)** | La destruction de la cellule cible | Les agents **à l'intérieur** des cellules : virus, cellule cancéreuse |

> Un anticorps n'entre jamais dans une cellule. C'est pourquoi la voie cellulaire est indispensable.

## Le chef d'orchestre
Le **lymphocyte T auxiliaire (LT4)** est activé par la cellule présentatrice de l'antigène et sécrète des **interleukines** qui amplifient et coordonnent les deux voies.

> Sa destruction par le **VIH** désorganise toute la réponse adaptative : c'est le mécanisme du sida.

## La mémoire immunitaire
Des **lymphocytes mémoire** persistent après la réponse. Au second contact, la réponse est **plus rapide, plus intense, plus efficace** : l'infection est souvent stoppée avant tout symptôme. C'est le fondement de la vaccination.

## Le tableau à retenir
| Le critère | Immunité **innée** | Immunité **adaptative** |
| Délai | Immédiate | Plusieurs jours |
| Spécificité | Non spécifique | **Spécifique** d'un antigène |
| Mémoire | Aucune | **Oui** |
| Présence | Dès la naissance | Se construit au fil des rencontres |`,
          },
          questions: [
            ['Quelles cellules produisent les anticorps ?', ['Les plasmocytes, issus des lymphocytes B', 'Les lymphocytes T cytotoxiques', 'Les macrophages', 'Les cellules dendritiques'], 0, 'Ils sont la forme différenciée et sécrétrice du lymphocyte B.'],
            ['Un anticorps peut pénétrer dans une cellule pour y détruire un virus.', ['Vrai', 'Faux'], 1, 'Il agit dans les liquides ; contre un agent intracellulaire, c’est le LT8 qui intervient.'],
            ['Quelle cellule coordonne l’ensemble de la réponse adaptative ?', ['Le lymphocyte T auxiliaire (LT4)', 'Le lymphocyte B', 'Le macrophage', 'Le plasmocyte'], 0, 'Ses interleukines amplifient les réponses humorale et cellulaire.'],
            ['Qu’est-ce que la sélection clonale ?', ['L’antigène sélectionne et amplifie le clone de lymphocytes qui le reconnaît déjà', 'L’antigène crée un récepteur adapté', 'Les lymphocytes se clonent au hasard', 'Les cellules infectées sont clonées'], 0, 'Le répertoire préexiste à toute rencontre avec l’antigène.'],
            ['Quel type de lymphocyte détruit les cellules infectées par un virus ?', ['Le lymphocyte T cytotoxique (LT8)', 'Le lymphocyte B', 'Le plasmocyte', 'Le lymphocyte T auxiliaire'], 0, 'C’est la réponse cellulaire, seule efficace contre un agent intracellulaire.'],
            ['Pourquoi le VIH désorganise-t-il toute la réponse immunitaire ?', ['Parce qu’il détruit les lymphocytes T auxiliaires', 'Parce qu’il détruit les globules rouges', 'Parce qu’il empêche la phagocytose', 'Parce qu’il bloque la moelle osseuse'], 0, 'Le chef d’orchestre disparaissant, les deux voies s’effondrent.'],
            ['La réponse adaptative secondaire est plus rapide et plus intense que la première.', ['Vrai', 'Faux'], 0, 'Grâce aux lymphocytes mémoire : c’est le principe même de la vaccination.'],
            ['Qu’est-ce qu’un complexe immun ?', ['L’association d’un anticorps et de son antigène', 'Un groupe de lymphocytes mémoire', 'Un organe lymphoïde', 'Un récepteur membranaire'], 0, 'Il est ensuite éliminé par phagocytose.'],
          ],
        },
        {
          titre: 'La vaccination et l’immunothérapie',
          axe: 'Corps humain et santé',
          lecon: {
            titre: 'Utiliser le système immunitaire comme traitement',
            cours: `La médecine sait aujourd'hui provoquer ou emprunter une réponse immunitaire. Deux stratégies à ne pas confondre.

## La vaccination : une immunité active
Le vaccin présente un antigène **inoffensif** — agent inactivé, atténué, fragment protéique, ou ARN messager codant un antigène. Le système immunitaire monte une réponse adaptative complète et constitue une **mémoire**, sans avoir subi la maladie.

| L'élément | Son rôle |
| Le **rappel** | Il sollicite les lymphocytes mémoire et produit une réponse secondaire qui renforce durablement la protection |
| L'**adjuvant** | Il stimule l'immunité innée au point d'injection, condition d'une bonne réponse adaptative |

## L'immunité collective
Au-delà d'un certain taux de couverture, la chaîne de transmission se rompt : les personnes qui ne peuvent pas être vaccinées — nourrissons, immunodéprimés — sont protégées par les autres.

> Ce seuil dépend de la contagiosité : il est très élevé pour la rougeole. La vaccination a donc une dimension **collective**, pas seulement individuelle.

## Vaccin ou sérum : la distinction classique
| Le critère | **Vaccination** | **Sérothérapie** |
| Ce qu'on injecte | Un **antigène** inoffensif | Des **anticorps** déjà formés |
| Le système immunitaire | Il **travaille** | Il est **remplacé** |
| Le délai | Lent | **Immédiat** |
| La durée | Durable | **Brève** |
| La mémoire | **Oui** | Aucune |
| L'usage | Prévention | Urgence : morsure suspectée de rage, tétanos chez un non-vacciné |

## Les immunothérapies antitumorales
| La technique | Son principe |
| **Anticorps monoclonaux** | Dirigés contre une cible de la tumeur |
| **Inhibiteurs de points de contrôle** | Ils lèvent le frein que la tumeur exerce sur les lymphocytes T |
| Thérapies cellulaires **CAR-T** | Les lymphocytes du patient sont modifiés en laboratoire, puis réinjectés |`,
          },
          questions: [
            ['Sur quoi repose l’efficacité de la vaccination ?', ['La constitution d’une mémoire immunitaire', 'L’injection d’anticorps déjà formés', 'La destruction directe de l’agent infectieux', 'Le renforcement de la barrière cutanée'], 0, 'La réponse secondaire, plus rapide et plus intense, stoppe l’infection précocement.'],
            ['La sérothérapie confère une protection durable.', ['Vrai', 'Faux'], 1, 'Elle est immédiate mais brève et sans mémoire : les anticorps injectés se dégradent.'],
            ['À quoi sert un adjuvant dans un vaccin ?', ['À stimuler l’immunité innée pour déclencher une bonne réponse adaptative', 'À conserver le vaccin plus longtemps', 'À neutraliser l’agent infectieux', 'À réduire la douleur de l’injection'], 0, 'Sans réponse innée suffisante, l’immunité adaptative se met mal en place.'],
            ['Qu’est-ce que l’immunité collective ?', ['La protection des non-vaccinés par un taux de couverture vaccinale élevé', 'L’immunité acquise par un groupe après une épidémie uniquement', 'La vaccination obligatoire', 'La mémoire immunitaire d’un individu'], 0, 'Au-delà d’un certain seuil, la chaîne de transmission se rompt.'],
            ['Pourquoi le rappel vaccinal est-il utile ?', ['Il sollicite les lymphocytes mémoire et renforce durablement la protection', 'Il remplace le vaccin initial devenu inefficace', 'Il apporte de nouveaux anticorps', 'Il élimine les effets secondaires'], 0, 'La réponse secondaire est plus intense et plus durable.'],
            ['Un vaccin à ARN messager fournit à l’organisme les instructions pour fabriquer lui-même l’antigène.', ['Vrai', 'Faux'], 0, 'La cellule traduit l’ARN, présente l’antigène, et la réponse adaptative se déclenche.'],
            ['Que font les inhibiteurs de points de contrôle en immunothérapie ?', ['Ils lèvent le frein exercé par la tumeur sur les lymphocytes T', 'Ils tuent directement les cellules tumorales', 'Ils empêchent l’angiogenèse', 'Ils réparent l’ADN muté'], 0, 'Le système immunitaire du patient redevient capable d’attaquer la tumeur.'],
            ['Quelle stratégie convient à une urgence, chez une personne non vaccinée exposée au tétanos ?', ['La sérothérapie', 'La vaccination seule', 'Un traitement antibiotique préventif', 'Une immunothérapie CAR-T'], 0, 'Seuls des anticorps déjà formés agissent immédiatement.'],
          ],
        },
      ],
    },
  ],
}
