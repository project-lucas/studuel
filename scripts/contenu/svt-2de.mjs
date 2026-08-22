// SVT — Seconde : LE PROGRAMME COMPLET (19 fiches).
//
// CE QUE REMPLACE CE MODULE. La 2de n'avait que CINQ chapitres de SVT, hérités
// du tout premier jeu de données (migration 008, contenu rempli par la 126) :
// « La cellule, unité du vivant », « Biodiversité et évolution », « Le
// métabolisme cellulaire », « Érosion et sédimentation », « Microorganismes et
// santé ». Cinq titres pour un programme qui en compte SIX — et surtout cinq
// fiches là où le programme demande dix-neuf. Rien sur la spécialisation
// cellulaire, la communication intraspécifique, la sélection sexuelle, les sols
// et la biomasse, les rendements agricoles, la fécondation, le rôle des hormones
// ni le microbiote intestinal : un élève de 2de ne trouvait, sur ces sujets,
// RIEN.
//
// LE DÉCOUPAGE. Les 6 chapitres du programme de seconde (arrêté du 17 janvier
// 2019, BO spécial n° 1 du 22 janvier 2019), éclatés en leurs 19 fiches. Chaque
// fiche est un chapitre en base ; le CHAPITRE du programme est porté par `axe`
// (colonne `chapters.theme`), qui fait grouper la page matière — cf.
// docs/template-matiere.md. La SVT n'a qu'un seul rayon : pas de `rayon` ici, la
// page garde un onglet Programme unique.
//
// LES CINQ ANCIENS PARTENT (voir `menage`). Trois d'entre eux sont littéralement
// des CHAPITRES du programme reformulés (« La cellule, unité du vivant »,
// « Biodiversité et évolution », « Microorganismes et santé ») : les laisser en
// base ferait deux objets du même nom à deux places différentes. Les deux autres
// (« Le métabolisme cellulaire », « Érosion et sédimentation ») sont des fiches
// de synthèse que les fiches neuves recouvrent entièrement. Le ménage est borné
// à leurs cinq titres exacts et au seul niveau 2de — rejoué, il ne trouve plus
// rien et ne touche jamais les 19 fiches neuves.
//
// ⚠️ Le slug reste `svt` et TROIS modules le portent désormais (`svt-tle.mjs` →
// 233, `svt-1re.mjs` → 269, celui-ci → 285) : ne JAMAIS générer avec
// `--slugs svt`, qui les fusionnerait et réécrirait deux migrations. La SVT des
// autres niveaux vient encore des migrations écrites à la main (094 → 142), qui
// ne doivent plus être régénérées. Toujours `--modules svt-2de`.

export default {
  slug: 'svt',
  nom: 'SVT',

  titreMigration: 'SVT 2de — LE PROGRAMME COMPLET (19 fiches)',

  motif: `CONSTAT : la Seconde n'avait que CINQ chapitres de SVT, hérités du premier
jeu de données de l'app, avec une leçon générique chacun. Le programme officiel
s'organise en SIX chapitres — la cellule unité du vivant, la biodiversité comme
résultat et étape de l'évolution, les géosciences et les paysages, nourrir
l'humanité, procréation et sexualité humaine, microorganismes et santé — qui se
déplient en 19 fiches. Un élève de 2de qui révisait la spécialisation
cellulaire, la diversité génétique intraspécifique, la communication
intraspécifique et la sélection sexuelle, la sédimentation, les sols et la
biomasse végétale, les rendements agricoles, la fécondation, le rôle des
hormones dans la reproduction ou le microbiote intestinal ne trouvait RIEN.
Cette migration installe les 19 fiches, rangées sous leurs 6 chapitres, et
retire les 5 fiches génériques que ce découpage recouvre.`,

  menage: [
    {
      raison: `La colonne chapters.theme (migration 234) conditionne tout ce qui suit :
ce module range ses 19 fiches sous 6 chapitres, et l'INSERT écrit la colonne.
Elle est REPRISE ici en ADD COLUMN IF NOT EXISTS parce qu'on ne peut pas
garantir que la 234 soit passée en production — sans cette reprise, la migration
échouerait sur "column chapters.theme does not exist", les 5 anciens chapitres
déjà supprimés et les 19 neufs pas encore posés : une matière vide.
Le GRANT n'est pas décoratif : la migration 182 a révoqué le SELECT de table sur
chapters (pour cacher mind_map) et ne l'a rendu que colonne par colonne. Une
colonne ajoutée après elle n'hérite d'aucun droit — sans lui, l'app lirait
"permission denied" au lieu du chapitre.`,
      sql: `ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;`,
    },
    {
      raison: `Les 5 chapitres hérités partent. Trois d'entre eux sont des CHAPITRES du
programme reformulés ("La cellule, unité du vivant", "Biodiversité et
évolution", "Microorganismes et santé") : les garder en base ferait deux objets
du même nom à deux places différentes, un en-tête de section et une ligne dans
la liste. Les deux autres ("Le métabolisme cellulaire", "Érosion et
sédimentation") sont des fiches de synthèse que les fiches neuves recouvrent
entièrement.
ATTENTION AUX ACCENTS ET À LA VIRGULE : les titres de la 008 s'écrivent avec
leur ponctuation exacte ("La cellule, unité du vivant" porte une virgule,
"Érosion et sédimentation" un É majuscule accentué). Un DELETE approximatif ne
trouverait rien EN SILENCE.
Le filtre level = '2de' est indispensable : la 1re et la Tle ont leurs propres
chapitres, et "Microorganismes et santé" n'est pas un titre unique dans la base.
L'ordre compte : la file "À revoir" d'abord (review_items.item_id n'a PAS de clé
étrangère), puis les quiz (quizzes.lesson_id est ON DELETE SET NULL : ils
survivraient orphelins à leur chapitre, mais toujours tirables par le moteur de
questions), puis les chapitres, dont les leçons partent en cascade.
Le ménage tourne AVANT les insertions à CHAQUE passage : sans la borne des cinq
titres, un rejeu effacerait les quiz des 19 fiches neuves.`,
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
   AND c.level = '2de'
   AND c.title IN ('La cellule, unité du vivant',
                   'Biodiversité et évolution',
                   'Le métabolisme cellulaire',
                   'Érosion et sédimentation',
                   'Microorganismes et santé');

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'svt'
   AND c.level = '2de'
   AND c.title IN ('La cellule, unité du vivant',
                   'Biodiversité et évolution',
                   'Le métabolisme cellulaire',
                   'Érosion et sédimentation',
                   'Microorganismes et santé');

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'svt'
   AND c.level = '2de'
   AND c.title IN ('La cellule, unité du vivant',
                   'Biodiversité et évolution',
                   'Le métabolisme cellulaire',
                   'Érosion et sédimentation',
                   'Microorganismes et santé');`,
    },
  ],

  blocs: [
    {
      niveaux: ['2de'],
      chapitres: [
        // ===================================================================
        // Chapitre 1 : la cellule unité du vivant
        // ===================================================================
        {
          titre: 'Les êtres vivants pluricellulaires et la spécialisation des cellules',
          axe: 'La cellule unité du vivant',
          lecon: {
            titre: 'Un même génome, des cellules toutes différentes',
            cours: `Tous les êtres vivants sont faits de **cellules**. Certains n’en possèdent qu’une (unicellulaires), d’autres des milliers de milliards (pluricellulaires).

## Ce que toute cellule possède
Une **membrane plasmique** qui délimite un milieu intérieur, un **cytoplasme** contenant les molécules et les organites, et de l’**ADN** support de l’information génétique. Les cellules **eucaryotes** enferment leur ADN dans un **noyau** ; les cellules **procaryotes** (bactéries) n’en ont pas.

## Voir les cellules
Le **microscope optique** permet d’observer des cellules et leur noyau (résolution de l’ordre du micromètre) ; le **microscope électronique** révèle les organites (mitochondries, chloroplastes, réticulum). Les tailles s’échelonnent : une bactérie mesure quelques micromètres, une cellule animale de 10 à 100 micromètres, un ovule humain environ 100 micromètres.

## La spécialisation
Chez un organisme pluricellulaire, toutes les cellules issues de la cellule-œuf possèdent **le même génome**. Pourtant, une cellule musculaire, un neurone, une cellule de la peau et un globule rouge n’ont ni la même forme, ni la même taille, ni la même fonction.

> Même génome, expressions différentes : chaque type cellulaire n’utilise qu’une **partie** des gènes disponibles. C’est la **différenciation cellulaire**.

## Structure et fonction
La forme d’une cellule spécialisée sert sa fonction : les fibres musculaires sont allongées et riches en protéines contractiles ; le neurone porte de longs prolongements pour transmettre un message ; le globule rouge humain, sans noyau, est bourré d’hémoglobine ; la cellule intestinale multiplie les replis pour absorber.

## L’organisation en tissus
Des cellules spécialisées de même type forment un **tissu**, plusieurs tissus un **organe**, plusieurs organes un **appareil**. Cette organisation hiérarchisée permet une division du travail impossible chez un unicellulaire.`,
          },
          questions: [
            ['Quel élément est commun à toutes les cellules ?', ['Une membrane plasmique, du cytoplasme et de l’ADN', 'Un noyau', 'Des chloroplastes', 'Une paroi'], 0, 'Le noyau n’existe que chez les eucaryotes.'],
            ['Qu’est-ce qui distingue une cellule procaryote d’une cellule eucaryote ?', ['L’absence de noyau chez la procaryote', 'L’absence de membrane chez la procaryote', 'L’absence d’ADN chez la procaryote', 'La présence de chloroplastes chez la procaryote'], 0, 'Les bactéries sont des procaryotes.'],
            ['Quel ordre de grandeur pour une cellule animale ?', ['De 10 à 100 micromètres', 'De 1 à 10 nanomètres', 'De 1 à 5 millimètres', 'Environ 1 centimètre'], 0, 'Une bactérie ne mesure que quelques micromètres.'],
            ['Les cellules d’un même organisme pluricellulaire ont-elles le même génome ?', ['Oui, elles proviennent toutes de la cellule-œuf', 'Non, chacune a un génome propre', 'Seules les cellules du même organe', 'Seulement les cellules sexuelles'], 0, 'Ce sont les gènes exprimés qui diffèrent.'],
            ['Qu’est-ce que la différenciation cellulaire ?', ['L’acquisition d’une structure et d’une fonction spécialisées par expression d’une partie des gènes', 'La multiplication des cellules', 'La mort programmée des cellules', 'Le transfert d’ADN entre cellules'], 0, 'Même génome, expressions différentes.'],
            ['Pourquoi le globule rouge humain est-il dépourvu de noyau ?', ['Pour maximiser la place disponible pour l’hémoglobine', 'Parce qu’il n’a pas d’ADN à l’origine', 'Parce qu’il ne respire pas', 'Parce qu’il est une bactérie'], 0, 'Sa forme sert sa fonction de transport du dioxygène.'],
            ['Un ensemble de cellules spécialisées de même type forme un organe.', ['Vrai', 'Faux'], 1, 'Il forme un tissu ; plusieurs tissus forment un organe.'],
            ['Quel microscope permet d’observer les organites comme les mitochondries ?', ['Le microscope électronique', 'Le microscope optique', 'La loupe binoculaire', 'Le télescope'], 0, 'Sa résolution est bien supérieure à celle du microscope optique.'],
          ],
        },
        {
          titre: 'Le métabolisme des cellules',
          axe: 'La cellule unité du vivant',
          lecon: {
            titre: 'Comment une cellule fabrique sa matière et son énergie',
            cours: `Le **métabolisme** est l’ensemble des réactions chimiques qui se déroulent dans une cellule. Il assure deux besoins : produire de la **matière** et fournir de l’**énergie**.

## Deux grands modes
Les cellules **autotrophes** produisent leur matière organique à partir de matière **minérale** et d’une source d’énergie ; les cellules **hétérotrophes** doivent prélever de la matière organique déjà formée.

## La photosynthèse
Dans les **chloroplastes** des cellules chlorophylliennes, la **photosynthèse** utilise l’énergie lumineuse pour produire du glucose à partir de dioxyde de carbone et d’eau, en libérant du dioxygène. On peut l’écrire : 6 CO2 + 6 H2O + énergie lumineuse donne C6H12O6 + 6 O2. C’est la porte d’entrée de la matière et de l’énergie dans presque tous les écosystèmes.

## La respiration et la fermentation
La **respiration cellulaire**, dans les **mitochondries**, dégrade complètement le glucose en présence de dioxygène, avec libération de CO2, d’eau et de beaucoup d’énergie. La **fermentation**, en l’absence de dioxygène, dégrade partiellement le glucose : elle libère peu d’énergie et produit de l’éthanol (fermentation alcoolique) ou de l’acide lactique (fermentation lactique).

> Respirer rapporte beaucoup plus d’énergie que fermenter, mais fermenter permet de survivre sans dioxygène.

## Ce qui détermine le métabolisme d’une cellule
Deux facteurs : son **patrimoine génétique** — les gènes codant les enzymes dont elle dispose — et son **environnement** — la présence de lumière, de dioxygène, de nutriments. Une levure respire en présence de dioxygène et fermente en son absence : même génome, deux métabolismes.

## Les enzymes
Chaque réaction du métabolisme est catalysée par une **enzyme**, protéine spécifique de son substrat et de la réaction. Une cellule qui ne possède pas le gène d’une enzyme ne peut pas réaliser la réaction correspondante — c’est ce qui explique les besoins nutritionnels particuliers de chaque espèce.`,
          },
          questions: [
            ['Qu’est-ce que le métabolisme d’une cellule ?', ['L’ensemble des réactions chimiques qui s’y déroulent', 'Sa vitesse de division', 'Sa taille et sa forme', 'Son mode de déplacement'], 0, 'Il assure production de matière et fourniture d’énergie.'],
            ['Qu’est-ce qu’une cellule autotrophe ?', ['Une cellule qui produit sa matière organique à partir de matière minérale', 'Une cellule qui se nourrit d’autres cellules', 'Une cellule sans noyau', 'Une cellule qui ne respire pas'], 0, 'Les cellules chlorophylliennes en sont l’exemple type.'],
            ['Dans quel organite se déroule la photosynthèse ?', ['Le chloroplaste', 'La mitochondrie', 'Le noyau', 'Le réticulum'], 0, 'Il contient la chlorophylle qui capte l’énergie lumineuse.'],
            ['Que produit la photosynthèse ?', ['Du glucose et du dioxygène', 'Du dioxyde de carbone et de l’eau', 'De l’éthanol', 'De l’acide lactique'], 0, 'À partir de CO2, d’eau et d’énergie lumineuse.'],
            ['Où se déroule la respiration cellulaire ?', ['Dans les mitochondries', 'Dans les chloroplastes', 'Dans le noyau', 'Dans la membrane plasmique'], 0, 'Elle dégrade complètement le glucose en présence de dioxygène.'],
            ['Quelle différence énergétique entre respiration et fermentation ?', ['La respiration libère beaucoup plus d’énergie', 'La fermentation libère plus d’énergie', 'Les deux libèrent autant d’énergie', 'La fermentation ne libère aucune énergie'], 0, 'Mais la fermentation permet de survivre sans dioxygène.'],
            ['Le métabolisme d’une cellule dépend uniquement de son patrimoine génétique.', ['Vrai', 'Faux'], 1, 'Il dépend aussi de son environnement : lumière, dioxygène, nutriments.'],
            ['Quel est le rôle d’une enzyme ?', ['Catalyser une réaction chimique de façon spécifique', 'Transporter le dioxygène', 'Stocker l’information génétique', 'Constituer la membrane'], 0, 'Sans le gène de l’enzyme, la réaction n’est pas réalisable.'],
          ],
        },
        // ===================================================================
        // Chapitre 2 : biodiversité, résultat et étape de l'évolution
        // ===================================================================
        {
          titre: 'Biosphère et diversité des écosystèmes',
          axe: 'Biodiversité, résultat et étape de l’évolution',
          lecon: {
            titre: 'Trois échelles pour une seule biodiversité',
            cours: `La **biodiversité** désigne la diversité du monde vivant. Elle se mesure à **trois échelles** emboîtées : la diversité des **écosystèmes**, la diversité des **espèces**, et la diversité **génétique** au sein de chaque espèce.

## La biosphère
La **biosphère** rassemble tous les êtres vivants de la planète et les milieux qu’ils occupent. Elle est très mince à l’échelle de la Terre : de la haute atmosphère aux fonds océaniques, elle occupe une pellicule de quelques kilomètres.

## Qu’est-ce qu’un écosystème
Un **écosystème** associe un **biotope** — le milieu physique et chimique, avec sa température, sa lumière, son eau, son sol — et une **biocénose** — l’ensemble des êtres vivants qui l’occupent et les relations qu’ils entretiennent : prédation, compétition, coopération, parasitisme.

> Un écosystème n’est pas une collection d’espèces : c’est un réseau de relations. Retirer une espèce, c’est modifier tout le réseau.

## Les flux
Un écosystème est traversé par un **flux d’énergie**, entrant surtout par la photosynthèse des **producteurs primaires**, transmis aux **consommateurs** puis dissipé, et par des **cycles de matière** — carbone, azote, eau — refermés par les **décomposeurs**, qui reminéralisent la matière organique morte.

## Un état, pas un aboutissement
La biodiversité actuelle est un **état** de l’évolution, pas son point final. Elle a beaucoup varié : cinq **crises biologiques** majeures ont éliminé une grande partie des espèces, la plus connue étant celle de la limite Crétacé-Paléogène, il y a 66 millions d’années. Chaque crise a été suivie d’une diversification des groupes survivants.

## L’ordre de grandeur
Environ 2 millions d’espèces ont été décrites ; les estimations du total varient de quelques millions à plusieurs dizaines de millions. L’essentiel de la biodiversité reste donc inconnu.`,
          },
          questions: [
            ['À quelles trois échelles la biodiversité se mesure-t-elle ?', ['Écosystèmes, espèces, diversité génétique', 'Continents, pays, régions', 'Cellules, tissus, organes', 'Passé, présent, futur'], 0, 'Ces trois niveaux sont emboîtés.'],
            ['Que désigne la biosphère ?', ['L’ensemble des êtres vivants et des milieux qu’ils occupent', 'La couche d’ozone', 'Les océans uniquement', 'La partie solide de la Terre'], 0, 'Elle n’occupe qu’une fine pellicule à l’échelle du globe.'],
            ['De quoi un écosystème est-il constitué ?', ['D’un biotope et d’une biocénose', 'De producteurs uniquement', 'D’un sol et d’un climat', 'D’espèces sans interactions'], 0, 'Le milieu physique et l’ensemble des vivants en relation.'],
            ['Quel rôle jouent les décomposeurs ?', ['Ils reminéralisent la matière organique morte', 'Ils produisent la matière organique', 'Ils consomment les producteurs primaires', 'Ils fixent l’énergie lumineuse'], 0, 'Ils referment les cycles de matière.'],
            ['Par où l’énergie entre-t-elle principalement dans un écosystème ?', ['Par la photosynthèse des producteurs primaires', 'Par la respiration des animaux', 'Par les décomposeurs', 'Par les précipitations'], 0, 'Elle est ensuite transmise puis dissipée.'],
            ['Combien de crises biologiques majeures l’histoire de la vie compte-t-elle ?', ['Cinq', 'Deux', 'Dix', 'Aucune'], 0, 'La plus connue marque la limite Crétacé-Paléogène.'],
            ['Il y a combien de millions d’années la crise Crétacé-Paléogène s’est-elle produite ?', ['66 millions d’années', '250 millions d’années', '10 millions d’années', '541 millions d’années'], 0, 'Elle a notamment vu disparaître les dinosaures non aviens.'],
            ['La biodiversité actuelle est l’aboutissement définitif de l’évolution.', ['Vrai', 'Faux'], 1, 'Elle en est un état, qui continue de changer.'],
          ],
        },
        {
          titre: 'La diversité génétique au sein d’une espèce',
          axe: 'Biodiversité, résultat et étape de l’évolution',
          lecon: {
            titre: 'Pourquoi aucun individu n’est identique à un autre',
            cours: `Deux individus d’une même espèce partagent les mêmes **gènes**, mais pas les mêmes **allèles** : c’est la diversité génétique intraspécifique.

## Gènes et allèles
Un **gène** est une séquence d’ADN portant l’information d’un caractère ; un **allèle** est une version particulière de ce gène. Un individu diploïde possède deux allèles de chaque gène, un sur chaque chromosome de la paire.

## Les sources de la diversité
La première source est la **mutation** : une modification aléatoire de la séquence de l’ADN, qui crée de nouveaux allèles. Elle peut être spontanée (erreur de réplication) ou provoquée par des agents **mutagènes** — rayons UV, rayons X, certaines substances chimiques.

> Toutes les mutations ne se valent pas : la plupart sont sans effet, certaines sont défavorables, quelques-unes sont avantageuses dans un environnement donné.

## Le brassage de la reproduction sexuée
La **méiose** produit des gamètes tous différents, par **brassage interchromosomique** (répartition indépendante des chromosomes de chaque paire) et **brassage intrachromosomique** (échanges entre chromosomes homologues, ou crossing-over). La **fécondation** réunit ensuite deux gamètes au hasard parmi des millions de combinaisons possibles.

## Ce que ça donne
Chez l’espèce humaine, avec 23 paires de chromosomes, le seul brassage interchromosomique produit déjà 2 puissance 23 combinaisons de gamètes, soit plus de 8 millions — avant même le crossing-over et le hasard de la fécondation.

## À quoi sert cette diversité
Une population génétiquement diverse résiste mieux à un changement d’environnement ou à une maladie : la probabilité qu’au moins certains individus portent un allèle avantageux est plus grande. À l’inverse, une population peu diverse — un cheptel très sélectionné, une espèce réduite à quelques individus — est fragile.`,
          },
          questions: [
            ['Quelle différence entre un gène et un allèle ?', ['Le gène est la séquence, l’allèle en est une version particulière', 'Le gène est une protéine, l’allèle un chromosome', 'Ce sont deux mots synonymes', 'L’allèle est plus long que le gène'], 0, 'Deux individus partagent les gènes, mais pas forcément les allèles.'],
            ['Quelle est la source première de nouveaux allèles ?', ['La mutation', 'La méiose', 'La fécondation', 'La respiration cellulaire'], 0, 'Elle modifie aléatoirement la séquence de l’ADN.'],
            ['Qu’est-ce qu’un agent mutagène ?', ['Un facteur qui augmente la fréquence des mutations', 'Une enzyme de réparation', 'Un allèle dominant', 'Un chromosome supplémentaire'], 0, 'Les UV, les rayons X et certaines substances chimiques en sont.'],
            ['Que produit le brassage interchromosomique ?', ['Une répartition indépendante des chromosomes de chaque paire dans les gamètes', 'Un échange de segments entre chromosomes homologues', 'La fusion de deux gamètes', 'Une duplication du génome'], 0, 'Le brassage intrachromosomique, lui, correspond au crossing-over.'],
            ['Combien de combinaisons produit le seul brassage interchromosomique chez l’humain ?', ['Plus de 8 millions', 'Environ 200', 'Environ 46', 'Environ 1 000'], 0, 'Soit 2 puissance 23, avant crossing-over et fécondation.'],
            ['À quel moment se produit la réunion au hasard de deux gamètes ?', ['À la fécondation', 'À la méiose', 'À la mitose', 'À la naissance'], 0, 'Elle multiplie encore le nombre de combinaisons possibles.'],
            ['La plupart des mutations sont avantageuses pour l’individu.', ['Vrai', 'Faux'], 1, 'La plupart sont sans effet, certaines défavorables, peu sont avantageuses.'],
            ['Pourquoi une population génétiquement diverse est-elle plus robuste ?', ['Parce qu’il est plus probable que certains individus portent un allèle avantageux', 'Parce qu’elle se reproduit plus vite', 'Parce qu’elle mute davantage', 'Parce qu’elle occupe un territoire plus grand'], 0, 'Une population peu diverse est fragile face aux changements.'],
          ],
        },
        {
          titre: 'La biodiversité et son évolution dans le temps',
          axe: 'Biodiversité, résultat et étape de l’évolution',
          lecon: {
            titre: 'Dérive, sélection, spéciation',
            cours: `Les fréquences des allèles dans une population changent au fil des générations : c’est l’**évolution**. Deux mécanismes principaux la produisent.

## La dérive génétique
La **dérive génétique** est la modification **aléatoire** de la fréquence des allèles d’une génération à l’autre, due au hasard de la reproduction et de la survie. Son effet est d’autant plus fort que la population est **petite** : dans un grand effectif, les écarts s’annulent ; dans un petit, un allèle peut disparaître ou devenir majoritaire par pur hasard.

## La sélection naturelle
La **sélection naturelle** n’est pas aléatoire : dans un environnement donné, les individus porteurs d’allèles conférant un **avantage** — mieux survivre, mieux se reproduire — laissent en moyenne plus de descendants. La fréquence de ces allèles augmente donc au fil des générations.

> La sélection ne crée pas les allèles : elle trie ceux que la mutation a produits.

## Un exemple de référence
La **phalène du bouleau**, papillon de nuit, existe sous une forme claire et une forme sombre. Lors de la révolution industrielle en Angleterre, les troncs noircis par la suie ont rendu la forme claire très visible pour les oiseaux : la forme sombre est devenue majoritaire dans les régions polluées. La dépollution a inversé la tendance.

## La spéciation
Quand deux populations d’une même espèce sont **isolées** — par une barrière géographique, un décalage des périodes de reproduction, un comportement différent —, elles accumulent des différences génétiques. Si l’isolement dure, elles finissent par ne plus pouvoir se reproduire entre elles en donnant une descendance fertile : ce sont alors deux **espèces** distinctes. C’est la **spéciation**.

## L’espèce, une notion utile mais floue
La définition la plus courante — un ensemble d’individus interféconds donnant une descendance fertile — ne s’applique ni aux espèces fossiles, ni aux organismes à reproduction asexuée, et souffre de nombreux cas limites, comme les hybrides fertiles.`,
          },
          questions: [
            ['Qu’est-ce que la dérive génétique ?', ['Une modification aléatoire de la fréquence des allèles au fil des générations', 'Le tri des individus les mieux adaptés', 'L’apparition de nouveaux allèles', 'Le déplacement d’une population'], 0, 'Elle agit d’autant plus fort que la population est petite.'],
            ['Dans quel type de population l’effet de la dérive est-il le plus marqué ?', ['Une population de petit effectif', 'Une population de grand effectif', 'Une population en croissance', 'Une population migratrice'], 0, 'Dans un grand effectif, les écarts aléatoires s’annulent.'],
            ['La sélection naturelle est-elle un processus aléatoire ?', ['Non, elle trie selon l’avantage conféré dans un environnement donné', 'Oui, entièrement', 'Oui, comme la dérive', 'Elle ne concerne que les plantes'], 0, 'Le hasard intervient dans la mutation, pas dans le tri.'],
            ['Que montre l’exemple de la phalène du bouleau ?', ['Un changement de fréquence des formes selon la pollution des troncs', 'L’apparition d’une nouvelle espèce', 'Un effet de dérive génétique', 'Une mutation provoquée par la suie'], 0, 'La forme sombre a été favorisée quand les troncs ont noirci.'],
            ['La sélection naturelle crée-t-elle de nouveaux allèles ?', ['Non, elle trie ceux produits par la mutation', 'Oui, en réponse au besoin', 'Oui, à chaque génération', 'Seulement chez les bactéries'], 0, 'C’est une distinction essentielle du raisonnement évolutif.'],
            ['Qu’est-ce que la spéciation ?', ['L’apparition de nouvelles espèces à partir de populations isolées', 'La disparition d’une espèce', 'Le croisement de deux espèces', 'La classification des espèces'], 0, 'L’isolement permet l’accumulation de différences génétiques.'],
            ['Quelle définition courante de l’espèce est utilisée en seconde ?', ['Un ensemble d’individus interféconds dont la descendance est fertile', 'Un ensemble d’individus vivant au même endroit', 'Un ensemble d’individus de même taille', 'Un ensemble d’individus au même génome'], 0, 'Elle connaît de nombreux cas limites.'],
            ['La notion d’espèce s’applique sans difficulté aux fossiles et aux bactéries.', ['Vrai', 'Faux'], 1, 'Ni les fossiles ni la reproduction asexuée n’entrent dans le critère d’interfécondité.'],
          ],
        },
        {
          titre: 'Variation naturelle et impact humain',
          axe: 'Biodiversité, résultat et étape de l’évolution',
          lecon: {
            titre: 'Une sixième crise, et ce qui la distingue des cinq autres',
            cours: `La biodiversité a toujours varié. Ce qui change aujourd’hui, c’est la **vitesse** de cette variation et sa **cause**.

## Les variations naturelles
Les crises passées sont liées à des causes géologiques ou astronomiques : volcanisme massif, chute d’astéroïde, variations climatiques de grande ampleur, modification de la composition de l’atmosphère. Chacune a été suivie d’une **radiation évolutive** : les groupes survivants se diversifient et occupent les niches libérées.

## Le taux d’extinction actuel
Le rythme actuel d’extinction est estimé de **10 à 100 fois** supérieur au rythme moyen observé dans les archives fossiles, ce qui conduit de nombreux scientifiques à parler d’une **sixième crise biologique**, la première d’origine humaine.

## Les cinq causes
Retenues sous l’acronyme des travaux de l’IPBES : la **destruction et la fragmentation des habitats** (première cause), la **surexploitation** des ressources (pêche, chasse, prélèvements), les **pollutions** (chimiques, plastiques, lumineuses, sonores), les **espèces exotiques envahissantes**, et le **changement climatique**, dont l’effet s’amplifie.

> Une espèce ne disparaît presque jamais d’une seule cause : c’est l’addition d’un habitat réduit, d’un climat qui change et d’un prélèvement excessif qui la fait basculer.

## Les indicateurs
Les **listes rouges** de l’UICN classent les espèces selon leur risque d’extinction ; les indices d’abondance suivent l’évolution des populations. La disparition d’insectes et d’oiseaux communs montre que ce n’est pas seulement l’espèce rare qui recule, mais l’abondance générale.

## Agir
Aires protégées et réserves, **corridors écologiques** reliant les habitats fragmentés, restauration des milieux, réglementation des prélèvements (CITES), agriculture moins intensive, lutte contre les espèces envahissantes, réduction des émissions de gaz à effet de serre.`,
          },
          questions: [
            ['Quelles causes expliquent les crises biologiques passées ?', ['Volcanisme, impact d’astéroïde, changements climatiques majeurs', 'L’activité humaine', 'Les épidémies uniquement', 'La dérive génétique'], 0, 'Elles sont géologiques ou astronomiques.'],
            ['Qu’est-ce qu’une radiation évolutive après une crise ?', ['La diversification rapide des groupes survivants', 'L’extinction totale d’un groupe', 'L’émission de rayonnements', 'Le retour des espèces disparues'], 0, 'Les niches libérées sont réoccupées.'],
            ['Comment se situe le taux d’extinction actuel par rapport à la moyenne des archives fossiles ?', ['De 10 à 100 fois supérieur', 'Équivalent', 'Deux fois inférieur', 'Impossible à estimer'], 0, 'D’où l’expression de sixième crise biologique.'],
            ['Quelle est la première cause d’érosion actuelle de la biodiversité ?', ['La destruction et la fragmentation des habitats', 'Le changement climatique', 'Les espèces envahissantes', 'Les pollutions lumineuses'], 0, 'Le changement climatique est une cause dont le poids augmente.'],
            ['Qu’est-ce qu’une espèce exotique envahissante ?', ['Une espèce introduite hors de son aire d’origine qui s’y développe au détriment des espèces locales', 'Une espèce protégée', 'Une espèce migratrice', 'Une espèce en danger'], 0, 'C’est l’une des cinq grandes causes identifiées.'],
            ['Que classent les listes rouges de l’UICN ?', ['Les espèces selon leur risque d’extinction', 'Les zones protégées', 'Les pollutions industrielles', 'Les espèces introduites'], 0, 'Elles servent d’indicateur international.'],
            ['À quoi sert un corridor écologique ?', ['Relier des habitats fragmentés pour permettre la circulation des espèces', 'Interdire l’accès à une réserve', 'Canaliser un cours d’eau', 'Séparer deux populations'], 0, 'La fragmentation isole les populations et les fragilise.'],
            ['La sixième crise se distingue des précédentes par son origine humaine.', ['Vrai', 'Faux'], 0, 'Et par sa vitesse, très supérieure au rythme naturel.'],
          ],
        },
        {
          titre: 'Communication intraspécifique et sélection sexuelle',
          axe: 'Biodiversité, résultat et étape de l’évolution',
          lecon: {
            titre: 'Séduire, dissuader, coordonner',
            cours: `Au sein d’une même espèce, les individus **communiquent** : ils échangent des signaux qui modifient le comportement du receveur.

## Les canaux
La communication **chimique** utilise des **phéromones**, molécules émises en très faible quantité et détectées à grande distance : marquage de territoire, piste des fourmis, attraction sexuelle des papillons. La communication **sonore** porte loin et de nuit : chant des oiseaux, stridulation des criquets, coassement des grenouilles. La communication **visuelle** joue sur la couleur, la posture, les mouvements — parades, danses, exhibition d’ornements. S’y ajoutent le **toucher** et, chez certaines espèces, les signaux électriques ou vibratoires.

## À quoi servent ces signaux
Trois grandes fonctions : la **reproduction** (attirer un partenaire, signaler sa disponibilité), la **compétition** (défendre un territoire, dissuader un rival sans combattre), et la **cohésion sociale** (alerter d’un danger, indiquer une ressource, coordonner un groupe).

> Un signal coûteux — un chant qui attire aussi les prédateurs, une queue immense qui gêne la fuite — est difficile à truquer : c’est ce qui en fait une information fiable.

## La sélection sexuelle
Décrite par **Darwin**, la **sélection sexuelle** favorise les caractères qui augmentent le **succès reproducteur**, même s’ils diminuent la survie. Elle opère de deux manières : la **compétition intrasexuelle** (des mâles s’affrontent pour l’accès aux femelles : bois des cerfs, combats) et le **choix intersexuel** (les femelles choisissent selon des critères : couleur, chant, parade, taille du territoire).

## Le paradoxe du paon
La queue du paon gêne le vol et signale l’oiseau aux prédateurs : la sélection naturelle devrait la contre-sélectionner. Elle persiste parce que le succès reproducteur qu’elle procure compense la perte de survie.

## La conséquence
La sélection sexuelle explique une part importante du **dimorphisme sexuel** — différences de taille, de couleur ou d’ornements entre mâles et femelles — et participe, comme la sélection naturelle et la dérive, à l’évolution de la biodiversité.`,
          },
          questions: [
            ['Qu’est-ce qu’une phéromone ?', ['Une molécule émise par un individu qui modifie le comportement d’un congénère', 'Une hormone circulant dans le sang', 'Un signal sonore de basse fréquence', 'Un pigment de la peau'], 0, 'Elle agit à très faible concentration, parfois à grande distance.'],
            ['Quel avantage présente la communication sonore ?', ['Elle porte loin et fonctionne de nuit', 'Elle est indétectable par les prédateurs', 'Elle ne coûte aucune énergie', 'Elle est propre aux insectes'], 0, 'Chants d’oiseaux, stridulations, coassements.'],
            ['Quelles sont les trois grandes fonctions des signaux intraspécifiques ?', ['Reproduction, compétition, cohésion sociale', 'Nutrition, respiration, excrétion', 'Croissance, mue, migration', 'Défense, camouflage, fuite'], 0, 'Un même signal peut en servir plusieurs.'],
            ['Pourquoi un signal coûteux est-il une information fiable ?', ['Parce qu’un individu en mauvais état ne peut pas le produire', 'Parce qu’il est rare', 'Parce qu’il est silencieux', 'Parce qu’il est appris'], 0, 'Le coût rend le signal difficile à truquer.'],
            ['Qui a décrit la sélection sexuelle ?', ['Charles Darwin', 'Gregor Mendel', 'Jean-Baptiste de Lamarck', 'Louis Pasteur'], 0, 'Elle complète sa théorie de la sélection naturelle.'],
            ['Quelle est la différence entre compétition intrasexuelle et choix intersexuel ?', ['L’une oppose des individus du même sexe, l’autre repose sur le choix du partenaire', 'L’une concerne les plantes, l’autre les animaux', 'L’une est génétique, l’autre comportementale', 'Il n’y a pas de différence'], 0, 'Combats de cerfs d’un côté, choix des femelles de l’autre.'],
            ['Pourquoi la queue du paon persiste-t-elle malgré son coût ?', ['Parce que le gain en succès reproducteur compense la perte de survie', 'Parce qu’elle protège des prédateurs', 'Parce qu’elle facilite le vol', 'Parce qu’elle est neutre pour la survie'], 0, 'C’est le paradoxe classique de la sélection sexuelle.'],
            ['La sélection sexuelle favorise toujours des caractères qui améliorent la survie.', ['Vrai', 'Faux'], 1, 'Elle peut favoriser des caractères coûteux en survie.'],
          ],
        },
        // ===================================================================
        // Chapitre 3 : géosciences et compréhension des paysages
        // ===================================================================
        {
          titre: 'L’érosion, phénomène naturel et inexorable',
          axe: 'Géosciences et compréhension des paysages',
          lecon: {
            titre: 'Comment une montagne finit en grains de sable',
            cours: `L’**érosion** est l’ensemble des processus qui usent les roches à la surface de la Terre et transportent les débris produits. Elle façonne tous les paysages continentaux.

## Trois étapes
L’**altération** fragilise la roche sur place ; l’**ablation** arrache les débris ; le **transport** les emporte vers un lieu de dépôt.

## L’altération physique
Elle fragmente la roche sans changer sa composition : la **gélifraction** (l’eau qui gèle dans une fissure augmente de volume et fait éclater la roche), les variations de température, l’action des racines, l’abrasion par le vent et les grains.

## L’altération chimique
Elle transforme les minéraux. L’eau chargée de dioxyde de carbone forme un acide faible qui **dissout** le calcaire : c’est l’origine des paysages **karstiques** — grottes, gouffres, lapiaz, résurgences. L’**hydrolyse** attaque les silicates du granite : le feldspath se transforme en **argile**, le mica se dégrade, seul le **quartz**, très résistant, subsiste sous forme de grains de sable. C’est ainsi qu’un granite devient de l’**arène granitique**.

> Un grain de sable de plage est très souvent un cristal de quartz, dernier survivant d’un granite désagrégé.

## Le transport
Les débris voyagent par l’eau (rivières, torrents, glaciers), par le vent, ou simplement par gravité sur les pentes. Plus le transport est long, plus les grains sont **arrondis** et **triés** par taille : la forme d’un grain raconte son histoire.

## Ce qui contrôle l’intensité
Trois facteurs : la **nature de la roche** (un calcaire se dissout, un granite s’hydrolyse, un grès résiste), le **climat** (chaleur et humidité accélèrent l’altération chimique, le gel favorise l’altération physique) et la **pente**, qui commande la vitesse d’évacuation. La végétation, elle, freine l’érosion en retenant les sols.

## Un phénomène inexorable
Sans les forces internes qui soulèvent les reliefs, l’érosion aurait depuis longtemps aplani les continents : les paysages résultent d’une course entre surrection et usure.`,
          },
          questions: [
            ['Quelles sont les trois étapes de l’érosion ?', ['Altération, ablation, transport', 'Dépôt, compaction, cimentation', 'Fusion, cristallisation, refroidissement', 'Pluie, ruissellement, infiltration'], 0, 'Le dépôt relève ensuite de la sédimentation.'],
            ['Qu’est-ce que la gélifraction ?', ['L’éclatement d’une roche par le gel de l’eau dans ses fissures', 'La dissolution du calcaire', 'L’usure par le vent', 'La transformation du feldspath en argile'], 0, 'L’eau qui gèle augmente de volume.'],
            ['Quel type de paysage résulte de la dissolution du calcaire ?', ['Un paysage karstique', 'Une arène granitique', 'Un delta', 'Une moraine'], 0, 'Grottes, gouffres, lapiaz et résurgences.'],
            ['En quoi se transforme le feldspath du granite lors de l’hydrolyse ?', ['En argile', 'En quartz', 'En calcaire', 'En sel'], 0, 'Le quartz, lui, résiste et subsiste en grains.'],
            ['Comment appelle-t-on le sable issu de la désagrégation d’un granite sur place ?', ['L’arène granitique', 'Le lœss', 'La marne', 'Le gneiss'], 0, 'Elle est composée surtout de quartz et d’argiles.'],
            ['Que devient un grain transporté longtemps par une rivière ?', ['Il s’arrondit et se trie par taille', 'Il devient anguleux', 'Il grossit', 'Il se dissout entièrement'], 0, 'La forme du grain renseigne sur la distance parcourue.'],
            ['Quel climat favorise le plus l’altération chimique ?', ['Un climat chaud et humide', 'Un climat froid et sec', 'Un climat désertique', 'Un climat polaire'], 0, 'Le gel favorise plutôt l’altération physique.'],
            ['La végétation accélère l’érosion des sols.', ['Vrai', 'Faux'], 1, 'Elle la freine en retenant les particules avec ses racines.'],
          ],
        },
        {
          titre: 'La sédimentation et les roches sédimentaires',
          axe: 'Géosciences et compréhension des paysages',
          lecon: {
            titre: 'Des débris au calcaire',
            cours: `Ce que l’érosion arrache finit par se déposer : c’est la **sédimentation**, deuxième moitié du cycle qui façonne les paysages.

## Le dépôt
Un sédiment se dépose lorsque l’agent de transport perd de l’énergie. Un torrent rapide charrie des blocs ; en ralentissant, il abandonne d’abord les plus gros éléments, puis les sables, enfin les argiles, qui se déposent en eau calme. Ce **tri granulométrique** explique l’organisation des dépôts, du piémont au delta et jusqu’au fond des océans.

## De sédiment à roche : la diagenèse
Un sédiment meuble devient une roche par **diagenèse** : la **compaction** sous le poids des dépôts supérieurs chasse l’eau, puis la **cimentation** colle les grains entre eux par précipitation de minéraux. Le sable devient **grès**, l’argile devient **argilite**, les débris de coquilles deviennent **calcaire**.

## Les trois familles
Les roches **détritiques** sont faites de débris (conglomérats, grès, argilites) ; les roches **biogènes** proviennent de restes d’êtres vivants (calcaires coquilliers, craie, charbon) ; les roches **chimiques** naissent d’une précipitation (sel gemme, gypse, certains calcaires).

> La craie du Bassin parisien est un empilement de squelettes microscopiques d’algues marines : une roche entièrement construite par le vivant.

## Des archives
Les couches sédimentaires, ou **strates**, se déposent horizontalement, les plus anciennes en bas : c’est le **principe de superposition**. Elles enferment des **fossiles** et des indices du milieu de dépôt — nature des grains, rides, traces —, ce qui permet de reconstituer les paysages du passé et les climats anciens.

## Le cycle
Érosion, transport, dépôt, diagenèse, puis soulèvement et nouvelle érosion : les mêmes atomes traversent des roches successives. Une roche sédimentaire enfouie profondément peut aussi être transformée en roche **métamorphique**, ou fondre et redonner une roche magmatique.`,
          },
          questions: [
            ['Quand un sédiment se dépose-t-il ?', ['Quand l’agent de transport perd de l’énergie', 'Quand la température augmente', 'Quand la pression diminue', 'Quand le vent se lève'], 0, 'Les gros éléments se déposent en premier.'],
            ['Qu’est-ce que le tri granulométrique ?', ['Le classement des dépôts selon la taille des grains', 'La séparation des minéraux par densité', 'La mesure de la porosité', 'Le comptage des fossiles'], 0, 'Blocs en amont, argiles en eau calme.'],
            ['Quelles sont les deux étapes de la diagenèse ?', ['La compaction et la cimentation', 'La fusion et la cristallisation', 'L’altération et l’ablation', 'La dissolution et la précipitation'], 0, 'Elles transforment un sédiment meuble en roche cohérente.'],
            ['En quelle roche le sable se transforme-t-il ?', ['Le grès', 'L’argilite', 'Le calcaire', 'Le granite'], 0, 'L’argile donne, elle, une argilite.'],
            ['À quelle famille appartient la craie ?', ['Aux roches biogènes', 'Aux roches détritiques', 'Aux roches magmatiques', 'Aux roches métamorphiques'], 0, 'Elle est formée de squelettes microscopiques d’algues marines.'],
            ['Que dit le principe de superposition ?', ['Dans une série non déformée, les couches les plus anciennes sont en bas', 'Les couches les plus épaisses sont les plus anciennes', 'Les fossiles sont toujours au sommet', 'Les strates se déposent verticalement'], 0, 'Il fonde la lecture chronologique des séries sédimentaires.'],
            ['Le sel gemme est une roche détritique.', ['Vrai', 'Faux'], 1, 'C’est une roche chimique, née de l’évaporation et de la précipitation.'],
            ['Que peut devenir une roche sédimentaire enfouie très profondément ?', ['Une roche métamorphique, voire une roche magmatique si elle fond', 'Un sédiment meuble', 'Un fossile', 'Un sol'], 0, 'Le cycle des roches boucle sur lui-même.'],
          ],
        },
        {
          titre: 'Érosion et activité humaine',
          axe: 'Géosciences et compréhension des paysages',
          lecon: {
            titre: 'Subir, exploiter, aggraver',
            cours: `L’érosion est un phénomène naturel, mais les sociétés humaines la **subissent**, l’**exploitent** et souvent l’**accélèrent**.

## Ce que l’humain subit
Les **glissements de terrain**, les **coulées de boue**, les **crues torrentielles**, l’**érosion côtière** — recul du trait de côte, effondrement de falaises — menacent des habitations et des infrastructures. La **perte des sols** agricoles par ruissellement est un problème mondial : un sol met des siècles à se former et peut partir en une saison.

## Ce que l’humain exploite
Les produits de l’érosion sont des ressources : **granulats** (sables et graviers) indispensables au béton, **argiles** pour la brique et la céramique, **sables** industriels, minerais concentrés par le tri naturel dans certains dépôts alluviaux, et paysages remarquables valorisés par le tourisme. Le sable est aujourd’hui la deuxième ressource la plus consommée au monde après l’eau, et son extraction pose de graves problèmes environnementaux.

> Extraire du sable dans un lit de rivière ou au large ne prélève pas seulement de la matière : cela modifie l’équilibre des courants et fragilise les côtes.

## Ce que l’humain aggrave
La **déforestation**, le **labour** dans le sens de la pente, la disparition des **haies** et des talus, l’**imperméabilisation** des sols par l’urbanisation, le surpâturage augmentent le ruissellement et l’ablation. La construction de **barrages** piège les sédiments en amont et prive les plages de leur alimentation en sable, accélérant leur recul.

## Prévenir et s’adapter
Reboisement, cultures en terrasses, bandes enherbées, haies et talus, labour perpendiculaire à la pente, sols couverts en hiver, protection des dunes, cartes d’aléas et plans de prévention des risques, et parfois **repli stratégique** : déplacer un bâtiment plutôt que défendre indéfiniment un trait de côte.

## L’enjeu
Ces choix mêlent des données scientifiques et des décisions politiques : protéger, laisser faire ou reculer n’a ni le même coût, ni les mêmes conséquences pour les habitants.`,
          },
          questions: [
            ['Quel risque lié à l’érosion menace directement le littoral ?', ['Le recul du trait de côte', 'Les séismes', 'Les éruptions volcaniques', 'Les tempêtes solaires'], 0, 'Il conduit parfois à l’effondrement de falaises et d’habitations.'],
            ['Pourquoi la perte des sols agricoles est-elle grave ?', ['Parce qu’un sol met des siècles à se former', 'Parce que les sols sont radioactifs', 'Parce qu’ils sont rares en montagne', 'Parce qu’ils sont peu profonds partout'], 0, 'Il peut partir en une seule saison de ruissellement.'],
            ['À quoi servent principalement les granulats extraits ?', ['À fabriquer le béton', 'À produire de l’électricité', 'À fertiliser les cultures', 'À fabriquer du verre uniquement'], 0, 'Sables et graviers sont la base des matériaux de construction.'],
            ['Quel est le rang du sable parmi les ressources les plus consommées au monde ?', ['Le deuxième, après l’eau', 'Le premier', 'Le cinquième', 'Le dixième'], 0, 'Son extraction pose de graves problèmes environnementaux.'],
            ['Quel effet un barrage a-t-il sur les plages situées en aval ?', ['Il piège les sédiments et prive les plages de sable', 'Il augmente leur alimentation en sable', 'Il n’a aucun effet', 'Il élève le niveau de la mer'], 0, 'Le recul du littoral s’en trouve accéléré.'],
            ['Quelle pratique agricole limite le ruissellement sur une pente ?', ['Labourer perpendiculairement à la pente', 'Labourer dans le sens de la pente', 'Retirer les haies', 'Laisser le sol nu en hiver'], 0, 'Les bandes enherbées et les terrasses ont le même but.'],
            ['L’imperméabilisation des sols urbains réduit le ruissellement.', ['Vrai', 'Faux'], 1, 'Elle l’augmente fortement, l’eau ne pouvant plus s’infiltrer.'],
            ['Qu’appelle-t-on repli stratégique face à l’érosion côtière ?', ['Déplacer les constructions plutôt que défendre indéfiniment le rivage', 'Construire une digue plus haute', 'Interdire l’accès à la plage', 'Recharger la plage en sable chaque année'], 0, 'C’est une décision politique autant que technique.'],
          ],
        },
        // ===================================================================
        // Chapitre 4 : nourrir l'humanité
        // ===================================================================
        {
          titre: 'L’agriculture, la biomasse végétale et les sols',
          axe: 'Nourrir l’humanité : vers une agriculture durable pour l’humanité ?',
          lecon: {
            titre: 'Le sol, une ressource vivante et lente',
            cours: `Toute agriculture repose sur la production de **biomasse végétale**, elle-même dépendante d’une ressource fragile : le **sol**.

## La biomasse
La **biomasse** est la masse de matière organique produite par les êtres vivants. À la base des écosystèmes, les végétaux chlorophylliens la produisent par **photosynthèse**, à partir de matière minérale et d’énergie lumineuse. L’agriculture consiste à orienter cette production vers l’alimentation humaine ou animale.

## Ce qu’est un sol
Un sol est un mélange de matière **minérale** issue de l’altération de la roche mère (sables, limons, argiles), de matière **organique** (l’**humus**, issu de la décomposition), d’**eau**, d’**air** et d’une intense **vie souterraine** : bactéries, champignons, vers de terre, arthropodes. Un seul gramme de sol contient des centaines de millions de micro-organismes.

> Un sol fertile n’est pas un support inerte : c’est un écosystème, et sa fertilité est le produit de son activité biologique.

## Une ressource lente
La formation d’un centimètre de sol demande de plusieurs décennies à plusieurs siècles selon le climat et la roche. À l’échelle d’une vie humaine, le sol est donc une ressource **non renouvelable**.

## Les rendements des cultures
La production dépend de la lumière, de l’eau, de la température, de la disponibilité en éléments minéraux — azote, phosphore, potassium principalement — et de l’état biologique du sol. Les plantes ne prélèvent que ce qui est disponible dans la solution du sol.

## Les pressions
Érosion, tassement par les engins lourds, salinisation par irrigation mal maîtrisée, perte de matière organique, pollution par certains intrants, et **artificialisation** — en France, plusieurs dizaines de milliers d’hectares disparaissent chaque année sous les constructions et les infrastructures.

## Préserver
Rotation des cultures, couverture permanente du sol, apports de matière organique, réduction du travail du sol, agroforesterie, maintien des haies : autant de pratiques qui entretiennent la vie du sol au lieu de l’épuiser.`,
          },
          questions: [
            ['Qu’est-ce que la biomasse ?', ['La masse de matière organique produite par les êtres vivants', 'La masse de minéraux d’un sol', 'La quantité d’eau d’un écosystème', 'Le poids des engrais utilisés'], 0, 'Les végétaux la produisent par photosynthèse.'],
            ['De quoi un sol est-il composé ?', ['De matière minérale, de matière organique, d’eau, d’air et d’organismes vivants', 'Uniquement de sable et d’argile', 'De roche mère non altérée', 'D’humus uniquement'], 0, 'C’est un écosystème à part entière.'],
            ['Qu’est-ce que l’humus ?', ['La matière organique du sol issue de la décomposition', 'La couche de roche mère', 'Un engrais chimique', 'Une argile particulière'], 0, 'Il joue un rôle majeur dans la fertilité.'],
            ['Combien de temps faut-il pour former un centimètre de sol ?', ['De plusieurs décennies à plusieurs siècles', 'Quelques mois', 'Environ dix ans', 'Quelques jours'], 0, 'À l’échelle humaine, le sol n’est donc pas renouvelable.'],
            ['Quels éléments minéraux sont les principaux facteurs limitants des cultures ?', ['L’azote, le phosphore et le potassium', 'Le carbone, l’hydrogène et l’oxygène', 'Le fer, le cuivre et le zinc', 'Le sodium et le chlore'], 0, 'Ce sont les trois composants des engrais NPK.'],
            ['Qu’est-ce que l’artificialisation des sols ?', ['Leur recouvrement par des constructions et des infrastructures', 'Leur enrichissement en engrais', 'Leur labour profond', 'Leur irrigation'], 0, 'Elle retire définitivement des surfaces à l’agriculture.'],
            ['Un sol est un support inerte pour les plantes.', ['Vrai', 'Faux'], 1, 'Sa fertilité vient largement de son activité biologique.'],
            ['Quelle pratique entretient la fertilité d’un sol ?', ['La rotation des cultures et la couverture permanente du sol', 'Le sol nu toute l’année', 'Le passage répété d’engins lourds', 'La monoculture continue'], 0, 'Ces pratiques limitent érosion et perte de matière organique.'],
          ],
        },
        {
          titre: 'Une agriculture pour nourrir les hommes',
          axe: 'Nourrir l’humanité : vers une agriculture durable pour l’humanité ?',
          lecon: {
            titre: 'Ce que coûte, en surface et en énergie, une assiette',
            cours: `Nourrir huit milliards d’humains suppose des choix : quoi produire, où, comment, et à quel coût pour les écosystèmes.

## Les chaînes alimentaires
Dans une chaîne, seule une petite partie de l’énergie passe d’un maillon au suivant : environ **10 %**, le reste étant dissipé par la respiration et les déchets. Conséquence directe : produire un kilogramme de protéines animales demande beaucoup plus de surface, d’eau et d’énergie que produire un kilogramme de protéines végétales.

> Un régime riche en produits animaux mobilise plusieurs fois plus de surface agricole qu’un régime majoritairement végétal, à apport nutritionnel comparable.

## Les grands modèles
L’agriculture **vivrière** nourrit d’abord la famille du producteur, avec peu d’intrants. L’agriculture **intensive** maximise le rendement à l’hectare par les engrais, les produits phytosanitaires, l’irrigation, la mécanisation et la sélection variétale. L’agriculture **extensive** utilise de grandes surfaces avec peu d’intrants. L’agriculture **biologique** exclut les produits de synthèse et les OGM. L’**agroécologie** cherche à s’appuyer sur les régulations naturelles.

## Les intrants
Les **engrais** apportent les éléments minéraux ; les **produits phytosanitaires** luttent contre ravageurs, maladies et adventices ; l’**irrigation** lève la contrainte hydrique. Ils augmentent les rendements, mais posent des problèmes : eutrophisation des eaux par les nitrates et les phosphates, résidus dans les aliments, résistances chez les ravageurs, épuisement des nappes.

## Les pertes
Un tiers environ de la production alimentaire mondiale est perdu ou gaspillé, au champ, au transport, au commerce ou chez le consommateur. Réduire ces pertes est un levier au moins aussi puissant que l’augmentation des rendements.

## L’enjeu
La question n’est pas seulement de produire plus, mais de produire **autrement** et de répartir : la faim dans le monde tient largement à l’accès et aux revenus, pas seulement au volume produit.`,
          },
          questions: [
            ['Quelle part de l’énergie passe environ d’un maillon à l’autre d’une chaîne alimentaire ?', ['Environ 10 %', 'Environ 90 %', 'Environ 50 %', 'La totalité'], 0, 'Le reste est dissipé par la respiration et les déchets.'],
            ['Quelle conséquence en tire-t-on pour l’alimentation humaine ?', ['Produire des protéines animales demande beaucoup plus de surface que des protéines végétales', 'Les protéines animales sont plus économes en surface', 'La surface nécessaire est la même', 'L’énergie ne joue aucun rôle'], 0, 'Le régime alimentaire a un effet direct sur la surface mobilisée.'],
            ['Qu’est-ce qu’une agriculture intensive ?', ['Une agriculture qui maximise le rendement par hectare grâce aux intrants et à la mécanisation', 'Une agriculture sur de grandes surfaces avec peu d’intrants', 'Une agriculture sans engrais de synthèse', 'Une agriculture destinée à la seule famille du producteur'], 0, 'L’agriculture extensive fait l’inverse.'],
            ['Qu’exclut l’agriculture biologique ?', ['Les produits de synthèse et les OGM', 'Toute mécanisation', 'L’irrigation', 'La rotation des cultures'], 0, 'Elle est encadrée par un cahier des charges et une certification.'],
            ['Qu’est-ce que l’eutrophisation ?', ['L’enrichissement excessif d’un milieu aquatique en nutriments, qui asphyxie le milieu', 'L’assèchement d’une nappe', 'L’érosion d’un sol', 'La salinisation d’un champ'], 0, 'Nitrates et phosphates en sont les principaux responsables.'],
            ['Quelle part de la production alimentaire mondiale est perdue ou gaspillée ?', ['Environ un tiers', 'Environ 5 %', 'Environ deux tiers', 'Moins de 1 %'], 0, 'Réduire ces pertes est un levier majeur.'],
            ['Un usage répété du même produit phytosanitaire peut sélectionner des ravageurs résistants.', ['Vrai', 'Faux'], 0, 'C’est une application directe de la sélection naturelle.'],
            ['La faim dans le monde s’explique-t-elle uniquement par un manque de production ?', ['Non, l’accès et les revenus jouent un rôle majeur', 'Oui, uniquement', 'Oui, à cause du climat seul', 'Non, elle a disparu'], 0, 'Produire autrement et répartir comptent autant que produire plus.'],
          ],
        },
        {
          titre: 'Amélioration des rendements agricoles, santé et environnement',
          axe: 'Nourrir l’humanité : vers une agriculture durable pour l’humanité ?',
          lecon: {
            titre: 'Augmenter les rendements sans détruire ce qui les permet',
            cours: `Depuis un siècle, les rendements agricoles ont été multipliés par plusieurs fois en Europe. Cette hausse a un prix, aujourd’hui mesuré.

## Les leviers de la hausse
La **sélection variétale**, d’abord empirique puis assistée par la génétique, a produit des variétés plus productives et plus résistantes. Les **engrais de synthèse**, permis par la fixation industrielle de l’azote atmosphérique, ont levé la principale limite. S’y ajoutent la **mécanisation**, l’**irrigation**, les **produits phytosanitaires** et le **remembrement** des parcelles.

## Les effets sur l’environnement
Pollution des eaux par les nitrates et les phosphates, marées vertes et zones mortes littorales, résidus de pesticides dans les sols et les cours d’eau, **effondrement des populations d’insectes** pollinisateurs et d’oiseaux des champs, perte de biodiversité liée à la disparition des haies, tassement et érosion des sols, consommation d’eau des nappes.

> On ne peut pas augmenter durablement un rendement en détruisant le sol, les pollinisateurs et l’eau qui le rendent possible.

## Les effets sur la santé
Exposition professionnelle des agriculteurs à certains produits, résidus dans l’alimentation, développement de **résistances** chez les ravageurs et de l’**antibiorésistance** liée aux usages en élevage. L’évaluation des risques repose sur des seuils, des autorisations de mise sur le marché et une surveillance continue.

## Les pistes de la durabilité
Les **rotations** et l’allongement des successions culturales, la **lutte biologique** — utiliser un ennemi naturel du ravageur —, les auxiliaires de culture favorisés par les haies, la **lutte intégrée** qui réserve le traitement chimique au dernier recours, la sélection de variétés résistantes, l’agriculture de précision qui n’applique un intrant que là où il est utile, l’**agroforesterie** et la couverture des sols.

## Un arbitrage permanent
Une agriculture durable doit tenir trois exigences à la fois : nourrir, préserver les milieux, et faire vivre ceux qui produisent. Aucune solution technique ne dispense de ce triple arbitrage.`,
          },
          questions: [
            ['Quel progrès a levé la principale limite minérale des cultures au XXe siècle ?', ['Les engrais azotés de synthèse', 'L’irrigation goutte à goutte', 'La récolte mécanisée', 'Le stockage réfrigéré'], 0, 'Ils reposent sur la fixation industrielle de l’azote atmosphérique.'],
            ['Quel phénomène littoral résulte d’un excès de nitrates et de phosphates ?', ['Les marées vertes et les zones mortes', 'L’érosion des falaises', 'La salinisation des sols', 'Les remontées de nappe'], 0, 'C’est une conséquence de l’eutrophisation.'],
            ['Quel groupe animal connaît un effondrement lié notamment aux pratiques agricoles intensives ?', ['Les insectes pollinisateurs', 'Les cétacés', 'Les reptiles marins', 'Les rongeurs urbains'], 0, 'Avec les oiseaux des champs.'],
            ['Qu’est-ce que la lutte biologique ?', ['Utiliser un ennemi naturel pour contrôler un ravageur', 'Traiter avec un pesticide d’origine végétale', 'Détruire mécaniquement les adventices', 'Semer des variétés stériles'], 0, 'Coccinelles contre pucerons, par exemple.'],
            ['Que propose la lutte intégrée ?', ['Combiner les méthodes et réserver le traitement chimique au dernier recours', 'Supprimer tout traitement', 'Traiter systématiquement par précaution', 'Remplacer les pesticides par des engrais'], 0, 'Elle repose sur la surveillance et les seuils d’intervention.'],
            ['Qu’apporte l’agriculture de précision ?', ['Appliquer un intrant seulement là où il est nécessaire', 'Augmenter les doses appliquées', 'Supprimer la mécanisation', 'Standardiser toutes les parcelles'], 0, 'Elle s’appuie sur capteurs, cartographie et géolocalisation.'],
            ['L’usage d’antibiotiques en élevage peut favoriser l’antibiorésistance.', ['Vrai', 'Faux'], 0, 'C’est un enjeu de santé publique reconnu.'],
            ['Quelles trois exigences une agriculture durable doit-elle concilier ?', ['Nourrir, préserver les milieux, faire vivre les producteurs', 'Produire, exporter, stocker', 'Mécaniser, irriguer, fertiliser', 'Sélectionner, traiter, récolter'], 0, 'Aucune technique ne dispense de cet arbitrage.'],
          ],
        },
        // ===================================================================
        // Chapitre 5 : procréation et sexualité humaine
        // ===================================================================
        {
          titre: 'De la fécondation à la puberté',
          axe: 'Procréation et sexualité humaine',
          lecon: {
            titre: 'Devenir un individu sexué, en trois temps',
            cours: `Le sexe d’un individu ne se met pas en place en une fois : il se construit de la fécondation à la puberté, en plusieurs étapes contrôlées.

## Le sexe chromosomique
Il est déterminé dès la **fécondation** : l’ovule apporte toujours un chromosome X, le spermatozoïde un X ou un Y. Une cellule-œuf **XX** donnera en règle générale un individu de sexe féminin, une cellule-œuf **XY** un individu de sexe masculin. C’est le gène **SRY**, porté par le chromosome Y, qui déclenche la différenciation en testicules.

## Le sexe gonadique
Jusqu’à la septième semaine environ, l’embryon possède des **gonades indifférenciées** et une double ébauche de conduits. La présence ou l’absence du gène SRY oriente ces gonades vers des testicules ou des ovaires.

> Un même point de départ, deux trajectoires : l’appareil génital masculin et l’appareil génital féminin dérivent des mêmes ébauches embryonnaires.

## Le sexe phénotypique
Les gonades différenciées produisent ensuite des **hormones** : la **testostérone** et l’hormone antimüllérienne chez le fœtus masculin font régresser un jeu de conduits et développer l’autre. Le phénotype sexuel se met en place avant la naissance, mais reste incomplet.

## La puberté
Entre 10 et 16 ans environ, une élévation de la production hormonale déclenche la **puberté** : développement des caractères sexuels secondaires (pilosité, voix, seins, morphologie), croissance rapide, acquisition de la **fonction reproductrice** — premières règles chez la fille, premières éjaculations chez le garçon. La production de gamètes commence.

## Ce qui se joue en même temps
La puberté est aussi un bouleversement psychologique et social : image du corps, identité, relations aux autres. L’âge de la puberté varie fortement d’un individu à l’autre, et cette variabilité est normale.`,
          },
          questions: [
            ['À quel moment le sexe chromosomique est-il déterminé ?', ['À la fécondation', 'À la puberté', 'À la septième semaine de développement', 'À la naissance'], 0, 'Le spermatozoïde apporte un X ou un Y.'],
            ['Quel gène déclenche la différenciation des gonades en testicules ?', ['Le gène SRY, porté par le chromosome Y', 'Le gène X', 'Le gène de la testostérone', 'Le gène FSH'], 0, 'En son absence, les gonades deviennent des ovaires.'],
            ['Comment sont les gonades de l’embryon avant la septième semaine ?', ['Indifférenciées', 'Déjà des testicules', 'Déjà des ovaires', 'Absentes'], 0, 'Les deux appareils dérivent des mêmes ébauches.'],
            ['Quelle hormone est produite par les testicules fœtaux ?', ['La testostérone', 'L’insuline', 'L’adrénaline', 'La thyroxine'], 0, 'Avec l’hormone antimüllérienne, elle oriente le développement des conduits.'],
            ['Qu’acquiert-on à la puberté ?', ['La fonction reproductrice et les caractères sexuels secondaires', 'Le sexe chromosomique', 'Le sexe gonadique', 'Les gonades indifférenciées'], 0, 'La production de gamètes commence à ce moment.'],
            ['Entre quels âges la puberté se produit-elle généralement ?', ['Entre 10 et 16 ans environ', 'Entre 3 et 6 ans', 'Entre 18 et 22 ans', 'À un âge identique pour tous'], 0, 'La variabilité individuelle est normale.'],
            ['Le phénotype sexuel se met en place uniquement à la puberté.', ['Vrai', 'Faux'], 1, 'Il commence avant la naissance et s’achève à la puberté.'],
            ['Qu’est-ce qu’un caractère sexuel secondaire ?', ['Un caractère qui apparaît à la puberté, comme la pilosité ou le développement des seins', 'Un organe génital présent à la naissance', 'Un chromosome sexuel', 'Une hormone'], 0, 'Les caractères primaires sont les organes génitaux eux-mêmes.'],
          ],
        },
        {
          titre: 'Le système nerveux et la sexualité',
          axe: 'Procréation et sexualité humaine',
          lecon: {
            titre: 'Deux niveaux de contrôle : réflexes et cerveau',
            cours: `Chez l’être humain, la sexualité n’est pas gouvernée par les seules hormones : elle met en jeu le **système nerveux**, à deux niveaux.

## Le niveau automatique
Certaines réponses sexuelles sont des **réflexes** contrôlés par la **moelle épinière** : un stimulus, un circuit nerveux court, une réponse. Ces mécanismes fonctionnent sans décision consciente et sont comparables à ceux d’autres mammifères.

## Le niveau cérébral
Ces réflexes sont **modulés** par le **cerveau**. Le **système de récompense**, qui met en jeu des zones profondes et le neurotransmetteur **dopamine**, associe certains comportements à une sensation de plaisir et favorise leur répétition. Le **cortex** intervient par la mémoire, l’imaginaire, l’anticipation, l’émotion, l’attention portée à l’autre.

> Chez l’humain, l’activité sexuelle est largement dissociée de la reproduction : elle est aussi un comportement de plaisir, de lien et de communication.

## Ce que cela implique
La sexualité humaine dépend fortement du **contexte** : histoire personnelle, apprentissages, culture, normes sociales, relations. C’est ce qui la distingue des comportements sexuels de nombreuses espèces, strictement rythmés par les hormones et les saisons.

## Le respect et le consentement
Parce que le cerveau est engagé, la sexualité relève de la **décision** et de la **relation**. Le **consentement** de chaque personne est nécessaire, libre, éclairé et révocable à tout moment ; il ne se présume pas. Le droit sanctionne toute atteinte sexuelle imposée, ainsi que le harcèlement.

## S’informer
Les sources fiables existent : professionnels de santé, infirmerie scolaire, centres de santé sexuelle, sites publics d’information. Les représentations diffusées par la pornographie ne sont ni un documentaire, ni un modèle : elles sont des productions commerciales, souvent éloignées de la réalité des relations.`,
          },
          questions: [
            ['Quel organe contrôle les réponses sexuelles réflexes ?', ['La moelle épinière', 'Le cortex cérébral', 'L’hypophyse', 'Le cervelet'], 0, 'Ces réflexes fonctionnent sans décision consciente.'],
            ['Quel neurotransmetteur est associé au système de récompense ?', ['La dopamine', 'L’insuline', 'La testostérone', 'L’hémoglobine'], 0, 'Il associe un comportement à une sensation de plaisir.'],
            ['Quel rôle joue le cortex dans la sexualité humaine ?', ['Il intègre mémoire, imaginaire, émotions et relation à l’autre', 'Il déclenche les réflexes', 'Il produit les hormones sexuelles', 'Il fabrique les gamètes'], 0, 'Il module les réponses automatiques.'],
            ['Qu’est-ce qui distingue la sexualité humaine de celle de nombreuses espèces ?', ['Elle est largement dissociée de la seule reproduction et dépend du contexte', 'Elle est uniquement hormonale', 'Elle est saisonnière', 'Elle ne fait pas intervenir le système nerveux'], 0, 'Apprentissages, culture et relations y jouent un rôle majeur.'],
            ['Quelles caractéristiques doit avoir un consentement ?', ['Libre, éclairé, révocable à tout moment', 'Donné une fois pour toutes', 'Implicite dans un couple', 'Valable pour toute la soirée'], 0, 'Il ne se présume jamais.'],
            ['Que prévoit le droit face à une atteinte sexuelle imposée ?', ['Elle est sanctionnée pénalement', 'Elle relève du seul règlement intérieur', 'Elle est tolérée entre majeurs', 'Elle ne concerne que les mineurs'], 0, 'Le harcèlement sexuel est également puni.'],
            ['La pornographie constitue une source fiable d’information sur la sexualité.', ['Vrai', 'Faux'], 1, 'Ce sont des productions commerciales, éloignées de la réalité des relations.'],
            ['Vers qui se tourner pour une information fiable sur la santé sexuelle ?', ['L’infirmerie scolaire, un médecin ou un centre de santé sexuelle', 'Les réseaux sociaux', 'Les forums anonymes', 'La publicité'], 0, 'Des structures publiques et gratuites existent.'],
          ],
        },
        {
          titre: 'Le rôle des hormones dans la reproduction',
          axe: 'Procréation et sexualité humaine',
          lecon: {
            titre: 'Un dialogue permanent entre le cerveau et les gonades',
            cours: `La fonction de reproduction est pilotée par un **système hormonal** reliant le cerveau et les gonades.

## Le complexe hypothalamo-hypophysaire
L’**hypothalamus** libère une hormone qui commande l’**hypophyse** ; celle-ci sécrète deux **gonadostimulines**, **FSH** et **LH**, transportées par le sang jusqu’aux gonades. Une hormone est justement définie comme une substance produite par une glande, transportée par le sang, et agissant à distance sur des **cellules cibles** qui possèdent le récepteur correspondant.

## Chez l’homme
FSH et LH stimulent les testicules : production continue de **spermatozoïdes** et sécrétion de **testostérone**. Cette dernière exerce en retour un **rétrocontrôle négatif** sur le complexe hypothalamo-hypophysaire, ce qui maintient un taux hormonal stable.

## Chez la femme
Le fonctionnement est **cyclique**, d’environ 28 jours. FSH permet la maturation d’un **follicule** ovarien ; un pic de **LH** déclenche l’**ovulation** vers le 14e jour. Les ovaires sécrètent des **œstrogènes** puis, après l’ovulation, de la **progestérone**, qui préparent la **muqueuse utérine** à une éventuelle implantation. En l’absence de fécondation, la chute hormonale provoque l’élimination de cette muqueuse : ce sont les **règles**.

> Le cycle utérin est l’image, avec un léger décalage, de ce qui se passe dans l’ovaire : les deux sont synchronisés par les hormones ovariennes.

## La maîtrise de la procréation
La **contraception hormonale** (pilule, implant, patch) apporte des hormones de synthèse qui bloquent l’ovulation par rétrocontrôle et modifient la glaire cervicale. Le **préservatif** est le seul moyen protégeant aussi des **infections sexuellement transmissibles**. La **contraception d’urgence** agit en retardant l’ovulation ; le **DIU** (stérilet) offre une contraception de longue durée.

## L’aide médicale à la procréation
En cas d’infertilité, des techniques comme la stimulation ovarienne, l’insémination artificielle ou la **fécondation in vitro** utilisent précisément ces mécanismes hormonaux.`,
          },
          questions: [
            ['Qu’est-ce qu’une hormone ?', ['Une substance produite par une glande, transportée par le sang, agissant sur des cellules cibles', 'Un message nerveux rapide', 'Une enzyme digestive', 'Un nutriment'], 0, 'Seules les cellules portant le récepteur y répondent.'],
            ['Quelles hormones l’hypophyse sécrète-t-elle pour commander les gonades ?', ['FSH et LH', 'Testostérone et œstrogènes', 'Insuline et glucagon', 'Adrénaline et cortisol'], 0, 'Ce sont les gonadostimulines.'],
            ['Quel événement le pic de LH déclenche-t-il chez la femme ?', ['L’ovulation', 'Les règles', 'La nidation', 'La ménopause'], 0, 'Il survient vers le 14e jour d’un cycle de 28 jours.'],
            ['Quelle hormone prépare la muqueuse utérine après l’ovulation ?', ['La progestérone', 'La FSH', 'La testostérone', 'L’insuline'], 0, 'Avec les œstrogènes, elle rend la muqueuse apte à l’implantation.'],
            ['Qu’est-ce qu’un rétrocontrôle négatif ?', ['Une hormone qui freine en retour la structure qui l’a fait produire', 'Une hormone qui amplifie sa propre production', 'Un message nerveux inhibiteur', 'Une réaction allergique'], 0, 'Il stabilise les taux hormonaux.'],
            ['Que provoque la chute hormonale en fin de cycle, sans fécondation ?', ['L’élimination de la muqueuse utérine, soit les règles', 'Une nouvelle ovulation immédiate', 'La nidation', 'L’arrêt définitif du cycle'], 0, 'Un nouveau cycle démarre alors.'],
            ['Le préservatif est le seul moyen de contraception protégeant aussi des IST.', ['Vrai', 'Faux'], 0, 'La contraception hormonale ne protège pas des infections.'],
            ['Comment agit une contraception hormonale de type pilule combinée ?', ['Elle bloque l’ovulation par rétrocontrôle et modifie la glaire cervicale', 'Elle détruit les spermatozoïdes', 'Elle empêche la formation de la muqueuse utérine uniquement', 'Elle agit après la fécondation'], 0, 'Elle utilise le mécanisme hormonal naturel.'],
          ],
        },
        // ===================================================================
        // Chapitre 6 : microorganismes et santé
        // ===================================================================
        {
          titre: 'Agents pathogènes et maladies à vecteur',
          axe: 'Microorganismes et santé',
          lecon: {
            titre: 'Qui rend malade, et comment le microbe voyage',
            cours: `Une **maladie infectieuse** est causée par un **agent pathogène** : un micro-organisme capable de provoquer une maladie chez son hôte.

## Les quatre grandes familles
Les **bactéries** sont des cellules procaryotes, capables de se multiplier seules (tuberculose, salmonellose, angine à streptocoque). Les **virus** ne sont pas des cellules : ils doivent parasiter une cellule hôte pour se répliquer (grippe, VIH, Covid-19). Les **champignons** microscopiques causent les mycoses. Les **protozoaires**, eucaryotes unicellulaires, sont responsables du paludisme ou de la toxoplasmose.

## Les modes de transmission
Directe, par contact ou par gouttelettes ; indirecte, par l’eau, les aliments ou les objets ; et **vectorielle**, par un animal qui transporte l’agent d’un hôte à l’autre.

## Les maladies à vecteur
Le vecteur le plus meurtrier est le **moustique**. Le genre *Anopheles* transmet le **paludisme**, dû à un protozoaire du genre *Plasmodium* ; le moustique **tigre** (*Aedes albopictus*) transmet la **dengue**, le **chikungunya** et le **Zika**. La **tique** transmet la **maladie de Lyme**, due à une bactérie.

> Un vecteur n’est pas seulement un moyen de transport : le parasite y accomplit souvent une partie de son cycle, ce qui rend la lutte plus complexe.

## Le rôle de l’environnement
La répartition des maladies à vecteur dépend du climat, de l’eau stagnante, de l’urbanisation, de la déforestation et des déplacements humains. Le **réchauffement climatique** étend l’aire du moustique tigre vers le nord : il est aujourd’hui installé dans une grande partie de la France métropolitaine.

## Prévenir
Éliminer les eaux stagnantes, se protéger des piqûres (répulsifs, moustiquaires, vêtements couvrants), surveiller les cas, vacciner quand un vaccin existe, respecter l’hygiène des mains et des aliments, traiter les eaux. La prévention collective compte autant que la protection individuelle.`,
          },
          questions: [
            ['Qu’est-ce qu’un agent pathogène ?', ['Un micro-organisme capable de provoquer une maladie', 'Un organisme utile à la digestion', 'Un vecteur animal', 'Un vaccin atténué'], 0, 'Bactéries, virus, champignons et protozoaires en font partie.'],
            ['Qu’est-ce qui distingue un virus d’une bactérie ?', ['Le virus n’est pas une cellule et doit parasiter une cellule hôte', 'Le virus est plus gros', 'La bactérie n’a pas d’ADN', 'La bactérie ne se multiplie pas'], 0, 'La bactérie est une cellule procaryote autonome.'],
            ['Quel agent est responsable du paludisme ?', ['Un protozoaire du genre Plasmodium', 'Une bactérie', 'Un virus', 'Un champignon'], 0, 'Il est transmis par un moustique du genre Anopheles.'],
            ['Quelles maladies le moustique tigre peut-il transmettre ?', ['La dengue, le chikungunya et le Zika', 'La tuberculose et le tétanos', 'La maladie de Lyme', 'La grippe'], 0, 'Aedes albopictus est un vecteur en expansion.'],
            ['Quel animal transmet la maladie de Lyme ?', ['La tique', 'Le moustique', 'La puce', 'Le rat'], 0, 'L’agent est une bactérie du genre Borrelia.'],
            ['Qu’est-ce qu’une transmission vectorielle ?', ['La transmission par un animal qui transporte l’agent pathogène', 'La transmission par l’eau', 'La transmission par contact direct', 'La transmission par voie aérienne'], 0, 'Le parasite accomplit souvent une partie de son cycle dans le vecteur.'],
            ['Le réchauffement climatique modifie la répartition des maladies à vecteur.', ['Vrai', 'Faux'], 0, 'Le moustique tigre s’est installé dans une grande partie de la France.'],
            ['Quel geste simple limite la prolifération du moustique tigre ?', ['Éliminer les eaux stagnantes autour des habitations', 'Aérer les pièces', 'Se laver les mains plus souvent', 'Faire bouillir l’eau de boisson'], 0, 'Ses larves se développent dans de très petits volumes d’eau.'],
          ],
        },
        {
          titre: 'Symbiose et microbiote humain',
          axe: 'Microorganismes et santé',
          lecon: {
            titre: 'Vivre avec des milliards de partenaires',
            cours: `Tous les micro-organismes ne sont pas des ennemis : l’immense majorité de ceux qui vivent avec nous sont neutres ou utiles.

## Les types de relations
Le **mutualisme** ou la **symbiose** au sens strict profite aux deux partenaires ; le **commensalisme** profite à l’un sans nuire à l’autre ; le **parasitisme** profite à l’un aux dépens de l’autre. Une même espèce peut changer de rôle selon les circonstances : un micro-organisme habituellement inoffensif peut devenir **opportuniste** chez une personne immunodéprimée.

## Des symbioses célèbres
Les **légumineuses** hébergent dans leurs racines des bactéries du genre *Rhizobium* capables de fixer l’azote de l’air : la plante reçoit de l’azote, la bactérie du sucre. Les **mycorhizes**, associations entre racines et champignons, améliorent l’absorption d’eau et de minéraux de la plupart des plantes. Les **ruminants** digèrent la cellulose grâce aux micro-organismes de leur rumen.

> Sans ces associations, ni les prairies, ni les forêts, ni l’élevage tels que nous les connaissons n’existeraient.

## Le microbiote humain
Le **microbiote** est l’ensemble des micro-organismes qui vivent sur et dans notre corps : intestin, peau, bouche, voies respiratoires, voies génitales. Il compte un nombre de cellules du même ordre de grandeur que celui des cellules du corps humain, et bien plus de gènes.

## Sa mise en place
Il se constitue dès la **naissance** — mode d’accouchement, allaitement, environnement —, se diversifie durant les premières années et se stabilise ensuite, tout en restant influencé par l’alimentation, l’âge, les traitements et le mode de vie. Chaque individu possède un microbiote qui lui est propre.

## Ses fonctions
Digestion d’aliments que nous ne pouvons pas dégrader seuls, synthèse de certaines vitamines, maturation et éducation du **système immunitaire**, et **effet barrière** : en occupant la place, le microbiote empêche l’installation d’agents pathogènes.`,
          },
          questions: [
            ['Qu’est-ce que le mutualisme ?', ['Une association bénéfique aux deux partenaires', 'Une association bénéfique à un seul, sans nuire à l’autre', 'Une association nuisible à l’un des deux', 'Une absence de relation'], 0, 'Le commensalisme ne profite qu’à l’un, sans nuire.'],
            ['Que gagnent les légumineuses associées aux Rhizobium ?', ['De l’azote, fixé à partir de l’air par la bactérie', 'Du sucre', 'De l’eau', 'De la lumière'], 0, 'La bactérie reçoit en échange des sucres de la plante.'],
            ['Qu’est-ce qu’une mycorhize ?', ['Une association entre les racines d’une plante et un champignon', 'Une maladie fongique', 'Un organe de réserve', 'Une bactérie du sol'], 0, 'Elle améliore l’absorption d’eau et de minéraux.'],
            ['Qu’est-ce que le microbiote humain ?', ['L’ensemble des micro-organismes vivant sur et dans le corps', 'L’ensemble des cellules humaines', 'Les agents pathogènes du corps', 'Les cellules immunitaires'], 0, 'Il occupe l’intestin, la peau, la bouche, les muqueuses.'],
            ['Quand le microbiote se met-il en place ?', ['Dès la naissance, puis il se diversifie les premières années', 'À la puberté', 'À l’âge adulte', 'Avant la naissance uniquement'], 0, 'Mode d’accouchement, allaitement et environnement l’influencent.'],
            ['Qu’est-ce que l’effet barrière du microbiote ?', ['Occuper la place et empêcher l’installation d’agents pathogènes', 'Produire des anticorps', 'Détruire les cellules infectées', 'Filtrer les toxines du sang'], 0, 'C’est une protection par occupation du milieu.'],
            ['Chaque être humain possède un microbiote qui lui est propre.', ['Vrai', 'Faux'], 0, 'Sa composition dépend de l’histoire et du mode de vie de chacun.'],
            ['Qu’est-ce qu’un micro-organisme opportuniste ?', ['Un micro-organisme habituellement inoffensif qui devient pathogène quand les défenses sont affaiblies', 'Un agent toujours pathogène', 'Un virus mutant', 'Une bactérie résistante aux antibiotiques'], 0, 'Le rôle d’un micro-organisme dépend du contexte.'],
          ],
        },
        {
          titre: 'Microbiote intestinal et santé',
          axe: 'Microorganismes et santé',
          lecon: {
            titre: 'Un organe à part entière',
            cours: `Le **microbiote intestinal** est le plus riche de l’organisme : plusieurs centaines d’espèces bactériennes, essentiellement dans le côlon.

## Ce qu’il fait
Il **dégrade** les fibres alimentaires que nos enzymes ne savent pas digérer, produisant des acides gras à chaîne courte utilisés par les cellules de la paroi intestinale. Il **synthétise** certaines vitamines, dont la vitamine K et des vitamines du groupe B. Il **éduque** le système immunitaire intestinal, qui doit apprendre à tolérer ce qui est inoffensif tout en réagissant aux agresseurs. Il exerce enfin un **effet barrière** contre les bactéries pathogènes.

> Ce n’est pas un passager : la paroi intestinale, le système immunitaire et le microbiote se construisent ensemble.

## La dysbiose
Un déséquilibre durable de composition s’appelle une **dysbiose**. Elle est associée — les études parlent le plus souvent d’**association**, pas de cause démontrée — à des maladies inflammatoires chroniques de l’intestin, à l’obésité, à certaines allergies, au diabète de type 2, et fait l’objet de recherches sur l’axe intestin-cerveau.

## Ce qui déséquilibre
Les **antibiotiques**, qui détruisent aussi les bactéries utiles ; une alimentation très pauvre en fibres et riche en produits ultratransformés ; certaines infections ; le stress chronique.

## Ce qui entretient l’équilibre
Une alimentation variée et riche en **fibres** (légumes, légumineuses, céréales complètes, fruits), les aliments **fermentés**, un usage raisonné des antibiotiques — inefficaces sur les virus, donc inutiles contre une grippe ou un rhume. Les **probiotiques** apportent des micro-organismes vivants, les **prébiotiques** nourrissent ceux déjà présents.

## Une piste thérapeutique
La **transplantation de microbiote fécal** est aujourd’hui un traitement reconnu de certaines infections récidivantes à *Clostridioides difficile* : elle rétablit un microbiote fonctionnel là où les antibiotiques échouent.`,
          },
          questions: [
            ['Où se concentre l’essentiel du microbiote intestinal ?', ['Dans le côlon', 'Dans l’estomac', 'Dans l’œsophage', 'Dans le foie'], 0, 'Il y compte plusieurs centaines d’espèces bactériennes.'],
            ['Que produit le microbiote en dégradant les fibres alimentaires ?', ['Des acides gras à chaîne courte utilisés par la paroi intestinale', 'Des protéines musculaires', 'De l’insuline', 'Des anticorps'], 0, 'Nos propres enzymes ne savent pas dégrader ces fibres.'],
            ['Quelle vitamine le microbiote intestinal contribue-t-il à synthétiser ?', ['La vitamine K', 'La vitamine C', 'La vitamine D', 'La vitamine A'], 0, 'Ainsi que plusieurs vitamines du groupe B.'],
            ['Qu’est-ce qu’une dysbiose ?', ['Un déséquilibre durable de la composition du microbiote', 'Une infection virale de l’intestin', 'Une allergie alimentaire', 'Une carence en fer'], 0, 'Elle est associée à plusieurs pathologies chroniques.'],
            ['Quel traitement perturbe fortement le microbiote intestinal ?', ['Les antibiotiques', 'Les antalgiques', 'Les vaccins', 'Les antihistaminiques'], 0, 'Ils détruisent aussi les bactéries utiles.'],
            ['Un antibiotique est-il efficace contre un virus ?', ['Non, il n’agit que sur les bactéries', 'Oui, sur tous les microbes', 'Oui, s’il est pris tôt', 'Seulement contre la grippe'], 0, 'D’où l’inutilité d’en prendre contre un rhume.'],
            ['Quelle différence entre probiotiques et prébiotiques ?', ['Les probiotiques apportent des micro-organismes vivants, les prébiotiques les nourrissent', 'Les probiotiques sont des médicaments, les prébiotiques des aliments', 'Ils sont synonymes', 'Les prébiotiques détruisent les bactéries'], 0, 'Les fibres sont l’exemple type des prébiotiques.'],
            ['La transplantation de microbiote fécal est utilisée contre certaines infections récidivantes.', ['Vrai', 'Faux'], 0, 'Notamment contre Clostridioides difficile, quand les antibiotiques échouent.'],
          ],
        },
      ],
    },
  ],
}
