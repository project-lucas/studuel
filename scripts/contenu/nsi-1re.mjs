// NSI PREMIÈRE (spécialité) — les 19 fiches du programme officiel, rangées sous
// ses 6 chapitres : au cœur de l’ordinateur · l’ordinateur de bureau · réseaux ·
// interagir sur le web · génie logiciel · algorithmique et programmation.
//
// LE DÉFAUT. Sondé le 21/08/2026 (node _ASSOCIE/sonde-chapitres.mjs 1re nsi) :
// la spécialité de Première n’a que QUATRE fiches composites — « Types de
// données et représentation », « Python : bases de la programmation »,
// « Tableaux et dictionnaires », « Le web : HTML, CSS, HTTP ». L’architecture
// machine, les systèmes d’exploitation, les protocoles réseau, le bit alterné,
// la complexité, les algorithmes gloutons et l’apprentissage n’ont AUCUNE
// entrée : c’est-à-dire la moitié des thèmes du programme, dont ceux qui
// fondent la Terminale.
//
// POURQUOI UN MODULE NEUF plutôt qu’un ajout dans `nsi-tle.mjs` : celui-ci part
// dans la migration 254, qui ne doit plus être régénérée. Deux fichiers, même
// slug `nsi` — d’où la génération par `--modules` et non par `--slugs`.
//
// PÉRIMÈTRE : la PREMIÈRE SEULE. Le ménage est borné à `level = '1re'`.
//
// ⚠️ RÈGLE DE LA MAISON, APPRISE SUR LA 254 : jamais d’extrait SQL exécutable
// dans un cours. Le contenu voyage dans des littéraux E'…' ; qu’un maillon de la
// chaîne rompe le littéral, et le texte du cours repart à l’exécution — un cours
// de NSI citant une requête produit alors une erreur qui parle d’une table
// fantôme. Aucune ligne de ce module ne commence par un mot-clé SQL nu, et les
// exemples de code sont écrits en prose ou en gras, sans point-virgule.

export default {
  slug: 'nsi',
  nom: 'NSI',

  titreMigration: 'NSI 1re (spécialité) — LE PROGRAMME OFFICIEL (19 fiches)',

  motif: `CONSTAT MESURÉ (node _ASSOCIE/sonde-chapitres.mjs 1re nsi, 21/08/2026) :
la spécialité NSI de Première n'avait que QUATRE fiches composites — « Types de
données et représentation », « Python : bases de la programmation », « Tableaux
et dictionnaires », « Le web : HTML, CSS, HTTP ». L'architecture de la machine,
les systèmes d'exploitation, les périphériques, les protocoles réseau, le bit
alterné, la terminaison et la complexité, les algorithmes gloutons et les
algorithmes d'apprentissage n'avaient AUCUNE entrée : la moitié des thèmes du
programme, et précisément ceux sur lesquels la Terminale s'appuie.

Cette migration installe les 19 fiches du programme, rangées sous ses 6
chapitres, et retire les 4 fiches composites qu'elles recouvrent.

PÉRIMÈTRE : la PREMIÈRE SEULE. Le ménage est borné au niveau 1re ; la Terminale
a reçu son programme avec la 254.

⚠️ CE QUI EST PERDU AU PASSAGE : les cours et les quiz des 4 fiches composites.
Ils étaient adossés à un découpage que les 19 fiches recouvrent entièrement.`,

  menage: [
    {
      raison: `La colonne chapters.theme (migration 234) conditionne tout ce qui suit :
ce module range ses 19 fiches sous 6 chapitres, et l'INSERT écrit la colonne.
Elle est REPRISE ici en ADD COLUMN IF NOT EXISTS parce que la 234 n'a jamais été
exécutée telle quelle — sans cette reprise, la migration échouerait sur
"column chapters.theme does not exist", les 4 anciennes fiches déjà supprimées
et les 19 neuves pas encore posées : une matière vide.
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
theme, tandis que les 19 fiches neuves en portent un dès l'INSERT — le ménage
tourne AVANT les insertions et ne peut donc jamais mordre sur elles, ni au
premier passage ni au rejeu. C'est aussi le seul repère sûr : rien ne garantit
que la base porte les mêmes apostrophes ni la même ponctuation que ce fichier
(piège de la 249).
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
   AND s.slug = 'nsi'
   AND c.level = '1re'
   AND c.theme IS NULL;

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'nsi'
   AND c.level = '1re'
   AND c.theme IS NULL;

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'nsi'
   AND c.level = '1re'
   AND c.theme IS NULL;`,
    },
  ],

  blocs: [
    {
      niveaux: ['1re'],
      chapitres: [
        // ---- Chapitre 1 : au cœur de l’ordinateur ---------------------------
        {
          titre: 'Une machine à calculer : le bit',
          axe: 'Au cœur de l’ordinateur',
          lecon: {
            titre: 'Deux états, et tout le reste',
            cours: `Un ordinateur ne connaît que **deux états** : présence ou absence de tension, aimantation dans un sens ou dans l’autre. On les note **0** et **1**, et l’unité correspondante est le **bit** (*binary digit*).

## Pourquoi le binaire
Un circuit électronique distingue mal dix niveaux de tension, et très bien deux. Le binaire n’est pas un choix mathématique mais une conséquence de la **fiabilité physique** : un signal bruité reste lisible tant qu’on ne demande à le classer que dans deux catégories.

## Compter en base 2
Chaque bit porte un **poids**, puissance de 2 croissante de droite à gauche : 1, 2, 4, 8, 16… Le nombre binaire 1101 vaut donc 8 + 4 + 0 + 1 = **13**.

Conversion inverse, du décimal au binaire : **divisions successives par 2**, en lisant les restes **de bas en haut**. 13 divisé par 2 donne 6 reste 1 ; 6 donne 3 reste 0 ; 3 donne 1 reste 1 ; 1 donne 0 reste 1 — d’où 1101.

## Combien de valeurs
Avec n bits, on code **2 puissance n** valeurs distinctes. Un bit en code 2, deux bits en codent 4, dix bits en codent 1 024. La relation se manie dans les deux sens : pour coder 300 valeurs différentes, 8 bits (256) ne suffisent pas, il en faut 9.

> La croissance est exponentielle, et c’est ce qui surprend : ajouter un seul bit **double** le nombre de valeurs représentables.

## Les opérations binaires
L’addition binaire se fait comme en décimal, avec une **retenue** dès que 1 + 1 est atteint : 1 + 1 vaut 10 en binaire, c’est-à-dire zéro et je retiens un. C’est l’opération que le processeur réalise le plus souvent.

Les opérations **logiques** bit à bit — ET, OU, OU EXCLUSIF, NON — s’appliquent, elles, à chaque position indépendamment, sans retenue.

## L’information n’est pas la donnée
Le mot binaire 01000001 vaut 65 si on le lit comme un entier, la lettre A si on le lit en code ASCII, une nuance de gris si on le lit comme un pixel. Rien dans le mot ne dit ce qu’il représente : c’est la **convention** du programme qui l’interprète.`,
          },
          questions: [
            ['Que signifie le mot « bit » ?', ['Binary digit, l’unité d’information à deux états', 'Byte information transfer', 'Un octet', 'Une unité de vitesse'], 0, 'Il ne prend que deux valeurs : 0 ou 1.'],
            ['Pourquoi les ordinateurs utilisent-ils le binaire ?', ['Parce qu’un circuit distingue de façon fiable deux états, pas dix', 'Parce que c’est plus rapide à calculer', 'Parce que les mathématiques l’imposent', 'Parce que cela économise de l’énergie'], 0, 'C’est une conséquence de la fiabilité physique du signal.'],
            ['Que vaut le nombre binaire 1101 en décimal ?', ['13', '11', '14', '9'], 0, '8 + 4 + 0 + 1 = 13.'],
            ['Combien de valeurs peut-on coder sur n bits ?', ['2 puissance n', 'n puissance 2', '2 × n', 'n / 2'], 0, 'Ajouter un seul bit double le nombre de valeurs représentables.'],
            ['Huit bits suffisent à coder 300 valeurs différentes.', ['Vrai', 'Faux'], 1, 'Huit bits n’en codent que 256 : il en faut neuf.'],
            ['Comment convertit-on un nombre décimal en binaire ?', ['Par divisions successives par 2, restes lus de bas en haut', 'Par multiplications par 2', 'Par divisions par 10', 'En additionnant les chiffres'], 0, 'L’ordre de lecture des restes est le piège habituel.'],
            ['Combien vaut 1 + 1 en binaire ?', ['10', '2', '11', '0'], 0, 'Zéro et je retiens un : la retenue est le mécanisme de base de l’addition.'],
            ['Un même mot binaire peut représenter un entier, une lettre ou une couleur.', ['Vrai', 'Faux'], 0, 'Seule la convention du programme décide de son interprétation.'],
          ],
        },
        {
          titre: 'Une machine à calculer : l’octet',
          axe: 'Au cœur de l’ordinateur',
          lecon: {
            titre: 'Grouper les bits pour coder le monde',
            cours: `Un bit seul ne dit presque rien. On les groupe par **huit** : c’est l’**octet** (*byte* en anglais), qui code 2 puissance 8 = **256** valeurs, de 0 à 255.

## Les multiples
Le vocabulaire est une source d’erreurs constante :
- 1 **kilooctet** (ko) = 1 000 octets, 1 **kibioctet** (Kio) = 1 024 octets ;
- de même pour le méga, le giga, le téra.

Les fabricants de disques comptent en puissances de 10, les systèmes d’exploitation affichaient longtemps des puissances de 2 : d’où l’impression, à l’achat, qu’il « manque » de la place.

Attention aussi au **b minuscule** (bit) et au **B majuscule** (octet) : un débit annoncé en Mb/s est huit fois plus petit qu’en Mo/s.

## L’hexadécimal
Écrire un octet en binaire demande huit chiffres. En **hexadécimal** (base 16, chiffres 0 à 9 puis A à F), il n’en faut que **deux**, puisqu’un chiffre hexadécimal vaut exactement **quatre bits**. C’est pourquoi les couleurs du web s’écrivent ainsi : #FF8000 se lit rouge à 255, vert à 128, bleu à 0.

## Coder les caractères
- L’**ASCII** code 128 caractères sur 7 bits : l’alphabet latin non accentué, les chiffres et la ponctuation. Insuffisant pour le français, et à plus forte raison pour le grec ou le japonais.
- **Unicode** attribue un numéro à chaque caractère de toutes les écritures ; **UTF-8** l’encode sur **1 à 4 octets** selon le caractère, ce qui garde l’ASCII inchangé sur un octet tout en couvrant le reste.

> Un texte lu avec le mauvais encodage produit ces caractères parasites que l’on voit encore parfois à la place des accents : l’octet est intact, c’est la table de lecture qui est fausse.

## Coder les images et les sons
Une image **matricielle** est un tableau de pixels ; chacun est souvent codé sur trois octets, un par composante rouge, verte et bleue — soit plus de 16 millions de couleurs. Le poids brut d’une image est donc **largeur × hauteur × 3 octets**, avant toute compression. Un son numérisé est une suite d’échantillons, dont le poids dépend de la fréquence d’échantillonnage et de la résolution.`,
          },
          questions: [
            ['Combien de valeurs un octet peut-il coder ?', ['256', '8', '128', '1 024'], 0, 'De 0 à 255 : 2 puissance 8.'],
            ['Combien de bits vaut un chiffre hexadécimal ?', ['Quatre', 'Huit', 'Deux', 'Seize'], 0, 'Deux chiffres hexadécimaux suffisent donc à écrire un octet.'],
            ['Un kibioctet vaut 1 000 octets.', ['Vrai', 'Faux'], 1, 'Il vaut 1 024 octets ; c’est le kilooctet qui en vaut 1 000.'],
            ['Que signifie un débit annoncé en Mb/s plutôt qu’en Mo/s ?', ['Il est huit fois plus petit, car b désigne le bit', 'Il est huit fois plus grand', 'C’est identique', 'Cela dépend du fournisseur'], 0, 'b minuscule pour bit, B majuscule pour octet.'],
            ['Sur combien d’octets UTF-8 encode-t-il un caractère ?', ['De un à quatre selon le caractère', 'Toujours un', 'Toujours deux', 'Toujours quatre'], 0, 'Les caractères ASCII y tiennent toujours sur un seul octet.'],
            ['Quel est le poids brut d’une image de 1 000 par 1 000 pixels en couleurs vraies ?', ['Environ 3 millions d’octets', 'Environ 1 million d’octets', 'Environ 1 000 octets', 'Environ 24 octets'], 0, 'Trois octets par pixel, avant toute compression.'],
            ['Des caractères parasites à la place des accents signalent un octet corrompu.', ['Vrai', 'Faux'], 1, 'L’octet est intact : c’est l’ENCODAGE de lecture qui est faux.'],
            ['Que représente le code couleur hexadécimal #FF8000 ?', ['Rouge à 255, vert à 128, bleu à 0', 'Rouge à 0, vert à 128, bleu à 255', 'Une couleur grise', 'Une transparence'], 0, 'Deux chiffres hexadécimaux par composante.'],
          ],
        },
        {
          titre: 'Une machine électronique',
          axe: 'Au cœur de l’ordinateur',
          lecon: {
            titre: 'Du transistor au processeur',
            cours: `Sous les logiciels, il n’y a que des **circuits** qui commutent. Comprendre la machine, c’est remonter cette chaîne.

## Le transistor
C’est l’élément de base : un **interrupteur commandé électriquement**, sans pièce mobile. Un signal faible sur son électrode de commande laisse passer, ou bloque, un courant plus fort. Un processeur moderne en contient plusieurs **milliards**.

## Les portes logiques
En associant quelques transistors, on réalise les opérateurs **NON**, **ET**, **OU**, et leurs dérivés. En associant des portes, on construit :
- un **additionneur**, qui calcule la somme de deux mots binaires avec ses retenues ;
- un **comparateur**, un **multiplexeur**, un **décodeur** ;
- une **bascule**, qui garde un bit en mémoire — c’est le passage du circuit qui calcule au circuit qui **se souvient**.

## Le modèle de von Neumann
L’architecture qui gouverne encore aujourd’hui presque toutes les machines comprend quatre parties :
- l’**unité arithmétique et logique**, qui calcule ;
- l’**unité de commande**, qui séquence les instructions ;
- la **mémoire**, qui contient **à la fois les données et le programme** ;
- les **entrées-sorties**.

> Que le programme soit stocké dans la même mémoire que les données est l’idée décisive : une machine peut alors modifier son propre programme, charger un autre logiciel, ou en compiler un nouveau. Sans elle, un ordinateur serait figé dans une seule tâche.

## Le cycle d’exécution
Le processeur répète indéfiniment trois étapes : **charger** l’instruction pointée par le compteur ordinal, la **décoder**, l’**exécuter** — puis passer à la suivante. Le rythme est donné par l’**horloge**, en gigahertz : trois milliards de cycles par seconde pour un processeur à 3 GHz.

## La hiérarchie des mémoires
Plus une mémoire est rapide, plus elle coûte cher et plus elle est petite : **registres**, puis **cache**, puis **mémoire vive**, puis **stockage**. La mémoire vive est **volatile** — son contenu disparaît à l’extinction —, le stockage est **persistant**.`,
          },
          questions: [
            ['Qu’est-ce qu’un transistor, dans un processeur ?', ['Un interrupteur commandé électriquement', 'Une mémoire permanente', 'Un amplificateur de son', 'Une horloge'], 0, 'Un processeur moderne en contient plusieurs milliards.'],
            ['Quelles sont les quatre parties de l’architecture de von Neumann ?', ['Unité de calcul, unité de commande, mémoire, entrées-sorties', 'Processeur, écran, clavier, disque', 'Cache, registre, mémoire vive, disque', 'Logiciel, système, pilote, matériel'], 0, 'C’est le modèle de presque toutes les machines actuelles.'],
            ['Dans l’architecture de von Neumann, programme et données partagent la même mémoire.', ['Vrai', 'Faux'], 0, 'C’est ce qui permet à une machine de charger et d’exécuter n’importe quel programme.'],
            ['Quelles sont les trois étapes du cycle d’exécution d’une instruction ?', ['Charger, décoder, exécuter', 'Lire, écrire, effacer', 'Compiler, lier, lancer', 'Saisir, calculer, afficher'], 0, 'Le processeur les répète indéfiniment, au rythme de l’horloge.'],
            ['Quel composant garde un bit en mémoire dans un circuit logique ?', ['La bascule', 'L’additionneur', 'Le multiplexeur', 'Le comparateur'], 0, 'C’est le passage du circuit qui calcule au circuit qui se souvient.'],
            ['La mémoire vive conserve son contenu quand la machine est éteinte.', ['Vrai', 'Faux'], 1, 'Elle est VOLATILE ; seul le stockage est persistant.'],
            ['Comment sont classées les mémoires dans la hiérarchie ?', ['De la plus rapide et petite aux plus lentes et grandes', 'Par ordre alphabétique', 'De la plus grande à la plus petite capacité seulement', 'Par date de fabrication'], 0, 'Registres, cache, mémoire vive, stockage.'],
            ['Que mesure la fréquence d’horloge d’un processeur ?', ['Le nombre de cycles par seconde', 'Le nombre d’instructions par programme', 'La taille de la mémoire', 'La vitesse du réseau'], 0, 'Trois milliards de cycles par seconde à 3 GHz.'],
          ],
        },
        {
          titre: 'Une machine programmable',
          axe: 'Au cœur de l’ordinateur',
          lecon: {
            titre: 'Instructions, langages et compilation',
            cours: `Ce qui distingue un ordinateur d’une calculatrice, c’est qu’on peut lui **décrire** ce qu’il doit faire — et changer cette description.

## Le langage machine
Le processeur n’exécute que des instructions élémentaires, codées en binaire : charger une valeur en registre, additionner deux registres, comparer, sauter à une adresse, écrire en mémoire. Chaque famille de processeurs a son **jeu d’instructions** propre.

L’**assembleur** est la traduction lisible de ce langage : à chaque instruction machine correspond un mot mnémonique. Il reste très éloigné de la façon dont un humain formule un problème.

## Les langages de haut niveau
Ils permettent d’écrire l’algorithme dans une notation proche des mathématiques et du langage naturel. Deux façons de les ramener au langage machine :
- la **compilation** traduit **tout le programme** avant l’exécution, produisant un exécutable rapide, lié à une plateforme ; les erreurs de syntaxe et de type sont détectées avant le lancement ;
- l’**interprétation** traduit et exécute **instruction par instruction** ; plus souple, plus lente, et les erreurs n’apparaissent qu’au moment où la ligne fautive est atteinte.

Python est interprété, ce qui explique qu’un programme puisse s’exécuter longtemps avant de s’arrêter sur une faute située à la fin.

## Ce qu’un programme manipule
- des **variables**, cases nommées qui contiennent une valeur ;
- des **types** : entier, flottant, booléen, chaîne, liste ;
- des **structures de contrôle** : le test conditionnel, la boucle bornée, la boucle non bornée ;
- des **fonctions**, qui nomment un traitement pour le réutiliser.

> Deux nuances qui coûtent cher : un **flottant** n’est pas un réel exact — 0,1 + 0,2 ne donne pas exactement 0,3 en machine, parce que 0,1 n’a pas d’écriture binaire finie. Et une comparaison d’égalité entre flottants doit donc se faire à une tolérance près.

## Ce qui reste hors de portée
Toute fonction calculable ne l’est pas en temps raisonnable, et certains problèmes ne sont **pas décidables** du tout : aucun programme ne peut déterminer, dans le cas général, si un autre programme s’arrêtera. C’est un résultat, pas une limite technique appelée à être levée.`,
          },
          questions: [
            ['Quelle est la différence entre compilation et interprétation ?', ['La compilation traduit tout le programme avant l’exécution, l’interprétation ligne à ligne', 'La compilation est plus lente à l’exécution', 'L’interprétation produit un exécutable', 'Il n’y a aucune différence'], 0, 'Python est interprété, ce qui décale la découverte des erreurs.'],
            ['Qu’est-ce que l’assembleur ?', ['La traduction lisible du langage machine', 'Un langage de haut niveau', 'Un système d’exploitation', 'Un compilateur'], 0, 'Chaque instruction machine y correspond à un mot mnémonique.'],
            ['En machine, 0,1 + 0,2 donne exactement 0,3.', ['Vrai', 'Faux'], 1, '0,1 n’a pas d’écriture binaire finie : les flottants sont approchés.'],
            ['Comment comparer deux flottants de façon fiable ?', ['En testant si leur écart est inférieur à une tolérance', 'Avec un test d’égalité stricte', 'En les convertissant en chaînes', 'En les arrondissant à l’entier'], 0, 'L’égalité stricte entre flottants est une source classique de bugs.'],
            ['Un programme peut-il déterminer si un autre programme s’arrêtera ?', ['Non, pas dans le cas général', 'Oui, toujours', 'Oui, s’il est assez rapide', 'Oui, depuis les processeurs modernes'], 0, 'C’est le problème de l’arrêt : un résultat d’indécidabilité, non une limite technique.'],
            ['Un programme compilé détecte les erreurs de syntaxe avant son lancement.', ['Vrai', 'Faux'], 0, 'Un programme interprété, lui, s’arrête au moment où il atteint la ligne fautive.'],
            ['Qu’est-ce qu’un jeu d’instructions ?', ['L’ensemble des instructions élémentaires qu’une famille de processeurs sait exécuter', 'La liste des programmes installés', 'Le manuel d’un langage', 'Les fonctions d’une bibliothèque'], 0, 'Il diffère d’une architecture de processeur à l’autre.'],
            ['Quelles sont les trois grandes structures de contrôle d’un programme ?', ['Le test conditionnel, la boucle bornée et la boucle non bornée', 'La variable, la fonction et le type', 'L’entrée, le calcul et la sortie', 'Le module, la classe et l’objet'], 0, 'Elles suffisent à exprimer tout algorithme.'],
          ],
        },

        // ---- Chapitre 2 : l’ordinateur de bureau ----------------------------
        {
          titre: 'Système d’exploitation et logiciel',
          axe: 'L’ordinateur de bureau',
          lecon: {
            titre: 'Le chef d’orchestre de la machine',
            cours: `Le **système d’exploitation** est le programme qui s’interpose entre le matériel et les applications. Sans lui, chaque logiciel devrait connaître le modèle exact de chaque composant.

## Ses quatre fonctions
- **Gérer les processus** : décider quel programme s’exécute, quand, et sur quel cœur du processeur. C’est l’**ordonnanceur** qui, en donnant à chacun de très courtes tranches de temps, donne l’illusion que tout tourne simultanément.
- **Gérer la mémoire** : attribuer à chaque processus son espace, et l’empêcher d’écrire dans celui des autres. C’est ce **cloisonnement** qui fait qu’un logiciel qui plante n’emporte pas la machine entière.
- **Gérer les fichiers** : organiser le stockage en arborescence, avec des **droits** (lecture, écriture, exécution) par utilisateur.
- **Gérer les périphériques**, à travers des **pilotes** qui traduisent les demandes générales du système en commandes propres à chaque matériel.

## Utilisateur et système
Le processeur distingue deux modes : le **mode utilisateur**, restreint, et le **mode noyau**, qui a tous les droits. Une application ne peut accéder au matériel qu’en demandant un service au noyau — un **appel système**. C’est cette frontière qui fait la sécurité de l’ensemble.

## Le système de fichiers
Un fichier est une suite d’octets accompagnée de **métadonnées** : nom, taille, dates, droits. Les fichiers sont rangés dans une **arborescence** de répertoires. Un **chemin absolu** part de la racine, un **chemin relatif** du répertoire courant.

> L’extension d’un fichier n’est qu’une **convention de nom** : renommer une image en « .txt » ne change rien à son contenu. Le système la lit pour choisir l’application à ouvrir, rien de plus.

## Logiciel libre et logiciel propriétaire
Un **logiciel libre** garantit quatre libertés : l’exécuter, en étudier le code, le redistribuer, le modifier et publier ses versions. Ce n’est pas une question de prix : un logiciel libre peut être payant, un logiciel gratuit peut être fermé. Linux, dont le noyau est libre, fait tourner l’essentiel des serveurs du web et, sous Android, la majorité des téléphones.`,
          },
          questions: [
            ['Quel composant du système décide quel programme s’exécute et quand ?', ['L’ordonnanceur', 'Le compilateur', 'Le pilote', 'Le système de fichiers'], 0, 'Il donne à chacun de courtes tranches de temps processeur.'],
            ['Qu’est-ce qu’un appel système ?', ['Une demande de service adressée par une application au noyau', 'Le démarrage de la machine', 'Un message d’erreur', 'Une commande du terminal'], 0, 'C’est la seule voie par laquelle une application atteint le matériel.'],
            ['Le cloisonnement de la mémoire empêche un programme qui plante d’emporter toute la machine.', ['Vrai', 'Faux'], 0, 'Chaque processus est confiné dans son propre espace mémoire.'],
            ['À quoi sert un pilote (driver) ?', ['À traduire les demandes générales du système en commandes propres à un matériel', 'À accélérer le processeur', 'À compiler les programmes', 'À gérer les mots de passe'], 0, 'Sans lui, chaque logiciel devrait connaître chaque modèle de composant.'],
            ['Que change le renommage d’une image en fichier .txt ?', ['Rien à son contenu : l’extension n’est qu’une convention de nom', 'Le fichier devient du texte', 'Le fichier est détruit', 'Le fichier est compressé'], 0, 'Le système s’en sert seulement pour choisir l’application d’ouverture.'],
            ['Un logiciel libre est nécessairement gratuit.', ['Vrai', 'Faux'], 1, 'La liberté porte sur l’usage, l’étude, la modification et la redistribution, pas sur le prix.'],
            ['Qu’est-ce qu’un chemin absolu ?', ['Un chemin qui part de la racine de l’arborescence', 'Un chemin qui part du répertoire courant', 'Le nom du fichier seul', 'L’adresse d’un serveur'], 0, 'Le chemin relatif, lui, dépend d’où l’on se trouve.'],
            ['Quelle est la différence entre mode utilisateur et mode noyau ?', ['Le mode noyau a tous les droits sur le matériel, le mode utilisateur est restreint', 'Le mode noyau est réservé à l’administrateur humain', 'Le mode utilisateur est plus rapide', 'Il n’y a pas de différence technique'], 0, 'Cette frontière fait la sécurité de tout le système.'],
          ],
        },
        {
          titre: 'Périphériques',
          axe: 'L’ordinateur de bureau',
          lecon: {
            titre: 'Entrées, sorties et stockage',
            cours: `Un **périphérique** est tout composant relié à l’unité centrale. On les classe par le **sens** de l’information.

## Trois familles
- **Entrée** : clavier, souris, micro, webcam, scanner, capteur. Ils convertissent une grandeur du monde réel en données.
- **Sortie** : écran, imprimante, haut-parleur. Ils font l’inverse.
- **Entrée-sortie** : écran tactile, disque, carte réseau, clé USB.

## Le stockage
- Le **disque dur** (HDD) stocke sur des plateaux magnétiques que survole une tête mobile. Capacité élevée, coût faible, mais des pièces mobiles — donc lent et fragile aux chocs.
- Le **disque à mémoire flash** (SSD) n’a aucune pièce mobile : accès bien plus rapide, silencieux, plus cher au téraoctet, et un nombre limité de cycles d’écriture par cellule.
- Le stockage **optique** et les bandes magnétiques servent encore à l’archivage longue durée.

Tous sont **persistants**, à la différence de la mémoire vive.

## Les interfaces
Un périphérique se relie par un **bus** : USB, HDMI, Bluetooth, Wi-Fi. Chacun est défini par un **débit** maximal et un **protocole**. Le débit réel est toujours inférieur au débit théorique — l’encodage et les contrôles d’erreur consomment une part du canal.

## Comment le système les voit
Le noyau charge un **pilote** par périphérique, puis expose une interface uniforme aux applications : un logiciel de dessin ne sait rien du modèle d’imprimante, il demande au système d’imprimer.

Deux façons pour un périphérique de signaler qu’il a quelque chose à dire :
- l’**interruption** : il prévient le processeur, qui suspend son travail pour le traiter. Efficace, c’est le mécanisme normal ;
- la **scrutation** : le processeur va lui-même vérifier périodiquement. Simple mais coûteux en temps de calcul.

> C’est l’interruption qui explique qu’un ordinateur réagisse instantanément à une frappe au clavier sans passer son temps à surveiller le clavier.`,
          },
          questions: [
            ['Dans quelle catégorie ranger un écran tactile ?', ['Entrée-sortie', 'Entrée seulement', 'Sortie seulement', 'Stockage'], 0, 'Il affiche et il capte le toucher.'],
            ['Quel avantage principal un SSD a-t-il sur un disque dur ?', ['Un accès bien plus rapide, sans pièce mobile', 'Une capacité toujours supérieure', 'Un coût plus faible au téraoctet', 'Un nombre illimité d’écritures'], 0, 'Il est en revanche plus cher et ses cellules ont une usure à l’écriture.'],
            ['Le contenu d’un SSD disparaît quand la machine est éteinte.', ['Vrai', 'Faux'], 1, 'Le stockage est persistant ; c’est la mémoire vive qui est volatile.'],
            ['Qu’est-ce qu’une interruption ?', ['Un signal par lequel un périphérique demande l’attention du processeur', 'Un arrêt du système', 'Une erreur de programme', 'Une coupure de courant'], 0, 'Elle évite au processeur de surveiller en permanence chaque périphérique.'],
            ['Quelle méthode consiste à vérifier périodiquement l’état d’un périphérique ?', ['La scrutation', 'L’interruption', 'La compilation', 'L’ordonnancement'], 0, 'Simple, mais coûteuse en temps de calcul.'],
            ['Le débit réel d’une interface est toujours inférieur à son débit théorique.', ['Vrai', 'Faux'], 0, 'L’encodage et les contrôles d’erreur consomment une part du canal.'],
            ['Comment une application accède-t-elle à une imprimante ?', ['En demandant le service au système, qui passe par le pilote', 'En pilotant directement le matériel', 'En écrivant sur le disque', 'En envoyant une interruption'], 0, 'Le logiciel n’a pas à connaître le modèle d’imprimante.'],
            ['Qu’est-ce qu’un bus, pour un périphérique ?', ['La liaison, physique ou sans fil, définie par un débit et un protocole', 'Un composant de la carte mère uniquement', 'Le pilote du périphérique', 'Un type de mémoire'], 0, 'USB, HDMI, Bluetooth et Wi-Fi en sont des exemples.'],
          ],
        },

        // ---- Chapitre 3 : réseaux --------------------------------------------
        {
          titre: 'IP et le réseau local',
          axe: 'Réseaux',
          lecon: {
            titre: 'Adresser et acheminer',
            cours: `Un **réseau** relie des machines pour qu’elles échangent des données. Deux problèmes à résoudre : **désigner** la machine visée, et **acheminer** les données jusqu’à elle.

## Deux adresses, deux rôles
- L’**adresse MAC** est **physique**, gravée dans la carte réseau à la fabrication, unique au monde. Elle sert à l’intérieur d’un même réseau local.
- L’**adresse IP** est **logique**, attribuée par le réseau (souvent par un serveur DHCP), et change quand la machine change de réseau. Elle sert à situer la machine à l’échelle mondiale.

Une adresse IPv4 s’écrit sur 4 octets, de 0.0.0.0 à 255.255.255.255 — environ 4 milliards d’adresses, épuisées depuis des années, d’où le passage progressif à **IPv6** sur 16 octets.

## Le masque de sous-réseau
Il sépare l’adresse IP en deux parties : celle qui désigne le **réseau** et celle qui désigne la **machine** dans ce réseau. Avec le masque 255.255.255.0, les trois premiers octets identifient le réseau, le dernier la machine.

C’est le masque qui répond à la seule question qui compte au moment d’envoyer : **le destinataire est-il sur mon réseau ?**
- s’il y est, on lui parle **directement**, en trouvant son adresse MAC ;
- s’il n’y est pas, on remet le paquet à la **passerelle** — le routeur —, qui se charge de la suite.

## Le routage
Un paquet ne connaît jamais tout son trajet. Chaque routeur consulte sa **table de routage** et choisit le **prochain saut**, de proche en proche. Deux paquets d’un même échange peuvent donc emprunter des chemins différents et arriver dans le désordre.

Le champ **TTL** (*time to live*) est décrémenté à chaque routeur ; à zéro, le paquet est détruit. C’est ce qui empêche un paquet mal routé de tourner indéfiniment.

> IP est un protocole **sans connexion et sans garantie** : il fait de son mieux, ne promet ni l’ordre, ni l’unicité, ni l’arrivée. Toutes ces garanties sont l’affaire de la couche au-dessus.

## Les équipements
Le **commutateur** distribue les trames dans un réseau local d’après l’adresse MAC ; le **routeur** relie des réseaux différents et décide d’après l’adresse IP ; le **serveur DNS** traduit un nom de domaine lisible en adresse IP.`,
          },
          questions: [
            ['Quelle différence entre adresse MAC et adresse IP ?', ['La MAC est physique et fixe, l’IP est logique et attribuée par le réseau', 'La MAC change à chaque connexion', 'L’IP est gravée dans la carte réseau', 'Elles sont interchangeables'], 0, 'La MAC sert dans le réseau local, l’IP à l’échelle mondiale.'],
            ['À quoi sert le masque de sous-réseau ?', ['À savoir si le destinataire est sur le même réseau', 'À chiffrer les données', 'À compter les machines connectées', 'À accélérer la transmission'], 0, 'Il sépare la partie réseau de la partie machine dans l’adresse IP.'],
            ['Le protocole IP garantit que les paquets arrivent dans l’ordre.', ['Vrai', 'Faux'], 1, 'IP est sans connexion et sans garantie : c’est TCP qui apporte l’ordre.'],
            ['À quoi sert le champ TTL d’un paquet ?', ['À détruire un paquet qui a traversé trop de routeurs', 'À mesurer le débit', 'À chiffrer l’en-tête', 'À identifier l’expéditeur'], 0, 'Il empêche un paquet mal routé de tourner indéfiniment.'],
            ['Comment un routeur choisit-il où envoyer un paquet ?', ['Il consulte sa table de routage et choisit le prochain saut', 'Il connaît tout le trajet à l’avance', 'Il demande à l’expéditeur', 'Il diffuse le paquet à tout le réseau'], 0, 'Le routage se fait de proche en proche.'],
            ['Sur combien d’octets s’écrit une adresse IPv4 ?', ['Quatre', 'Six', 'Seize', 'Huit'], 0, 'Soit environ 4 milliards d’adresses, épuisées depuis des années.'],
            ['Que fait un serveur DNS ?', ['Il traduit un nom de domaine en adresse IP', 'Il attribue les adresses MAC', 'Il route les paquets', 'Il chiffre les communications'], 0, 'Sans lui, il faudrait retenir des suites de chiffres.'],
            ['Deux paquets d’un même échange peuvent emprunter des chemins différents.', ['Vrai', 'Faux'], 0, 'Chaque routeur décide indépendamment : l’ordre d’arrivée n’est pas garanti.'],
          ],
        },
        {
          titre: 'TCP et le bit alterné',
          axe: 'Réseaux',
          lecon: {
            titre: 'Rendre fiable un canal qui ne l’est pas',
            cours: `IP perd des paquets, les duplique et les mélange. **TCP** construit par-dessus un canal **fiable, ordonné et sans doublon**. Comprendre comment est l’objet du chapitre.

## Le principe de l’accusé de réception
L’émetteur envoie un message et attend un **accusé de réception** (ACK). S’il ne le reçoit pas avant l’expiration d’un **délai de garde**, il **retransmet**.

Ce mécanisme simple a un défaut immédiat : si c’est l’ACK qui s’est perdu, l’émetteur retransmet un message **déjà reçu**, et le destinataire le compte deux fois.

## Le protocole du bit alterné
La solution tient en **un seul bit**. Chaque message porte un numéro qui alterne, 0, 1, 0, 1… et chaque accusé rappelle le numéro qu’il acquitte.

- Le récepteur qui reçoit un message portant le numéro **attendu** le garde, bascule son bit et acquitte.
- S’il reçoit un message portant le numéro **précédent**, il sait que son ACK s’est perdu : il **jette le doublon** et **réacquitte**, sans compter deux fois.

> Un seul bit suffit parce que l’émetteur n’envoie **qu’un message à la fois** et attend son acquittement avant le suivant : il ne peut donc jamais y avoir plus de deux messages en jeu.

C’est le plus simple des protocoles à fenêtre, et il illustre l’idée générale : **numéroter et acquitter** suffit à rendre fiable un canal qui ne l’est pas.

## Ce que TCP ajoute
- des numéros de séquence sur beaucoup plus d’un bit, ce qui permet d’avoir **plusieurs messages en vol** simultanément — une **fenêtre** — sans attendre chaque acquittement ;
- l’**établissement de connexion** en trois temps, avant tout échange ;
- le **contrôle de flux**, pour ne pas noyer un récepteur lent ;
- le **contrôle de congestion**, qui réduit le débit quand le réseau sature.

## TCP ou UDP
**UDP** n’offre rien de tout cela : ni connexion, ni retransmission, ni ordre. C’est un défaut pour un fichier, une qualité pour la voix et la vidéo en direct — un paquet retransmis y arriverait de toute façon trop tard pour être joué.`,
          },
          questions: [
            ['Que se passe-t-il si l’émetteur ne reçoit pas d’accusé de réception ?', ['Il retransmet le message après un délai de garde', 'Il abandonne l’envoi', 'Il passe au message suivant', 'Il ferme la connexion'], 0, 'C’est le mécanisme de base de la fiabilité.'],
            ['Quel problème le protocole du bit alterné résout-il ?', ['Le doublon créé par la retransmission quand un accusé s’est perdu', 'La lenteur du réseau', 'Le chiffrement des données', 'Le routage des paquets'], 0, 'Sans numéro, le récepteur compterait deux fois le même message.'],
            ['Pourquoi un seul bit suffit-il dans le protocole du bit alterné ?', ['Parce que l’émetteur n’envoie qu’un message à la fois et attend son acquittement', 'Parce que les messages sont très courts', 'Parce que le réseau est fiable', 'Parce que le récepteur mémorise tout'], 0, 'Il ne peut jamais y avoir plus de deux messages en jeu.'],
            ['Que fait le récepteur s’il reçoit un message portant le numéro précédent ?', ['Il jette le doublon et réacquitte', 'Il l’enregistre une seconde fois', 'Il ferme la connexion', 'Il l’ignore sans répondre'], 0, 'Son accusé précédent s’était perdu : il faut le renvoyer.'],
            ['TCP permet d’avoir plusieurs messages en vol simultanément.', ['Vrai', 'Faux'], 0, 'C’est le mécanisme de fenêtre, qui généralise le bit alterné.'],
            ['Que garantit TCP que IP ne garantit pas ?', ['La fiabilité, l’ordre et l’absence de doublon', 'L’adressage des machines', 'Le routage des paquets', 'Le chiffrement'], 0, 'IP se contente de faire de son mieux.'],
            ['Pourquoi préfère-t-on UDP pour la vidéo en direct ?', ['Un paquet retransmis arriverait trop tard pour être joué', 'UDP est plus fiable', 'UDP chiffre les données', 'UDP garantit l’ordre'], 0, 'La latence y prime sur l’exhaustivité.'],
            ['Le contrôle de congestion de TCP réduit le débit quand le réseau sature.', ['Vrai', 'Faux'], 0, 'Le contrôle de flux, lui, protège un récepteur trop lent.'],
          ],
        },

        // ---- Chapitre 4 : interagir sur le web ------------------------------
        {
          titre: 'Interactions client-serveur',
          axe: 'Interagir sur le web',
          lecon: {
            titre: 'Requête, réponse, et ce qui se passe entre les deux',
            cours: `Le web repose sur un modèle **client-serveur** : le **client** (le navigateur) demande, le **serveur** répond. Le serveur ne prend jamais l’initiative.

## Ce qui se passe quand on ouvre une page
1. Le navigateur interroge le **DNS** pour convertir le nom de domaine en adresse IP.
2. Il ouvre une connexion **TCP** vers le serveur, sur le port 80 (HTTP) ou 443 (HTTPS).
3. Il envoie une **requête HTTP**.
4. Le serveur renvoie une **réponse** : un code de statut, des en-têtes, et un corps — le plus souvent du HTML.
5. Le navigateur analyse le HTML et **redemande** chaque ressource référencée : feuilles de style, scripts, images. Une page affichée est donc le résultat de dizaines de requêtes.

## Les méthodes HTTP
- **GET** demande une ressource ; ses paramètres passent **dans l’URL**, donc visibles, historisés, mis en cache. À réserver aux lectures.
- **POST** envoie des données **dans le corps** de la requête : c’est la méthode des formulaires qui modifient quelque chose ou transportent un mot de passe.

> Envoyer un identifiant en GET le fait apparaître dans l’URL, dans l’historique du navigateur et dans les journaux du serveur. C’est la faute de conception la plus courante — et la plus facile à éviter.

## Les codes de statut
- **200** : succès ;
- **301** et **302** : redirection ;
- **404** : ressource introuvable ;
- **403** : accès interdit ;
- **500** : erreur du serveur.

La première chiffre suffit à situer : 2 pour un succès, 3 pour une redirection, 4 pour une faute du client, 5 pour une faute du serveur.

## HTTP est sans état
Chaque requête est indépendante : le serveur ne se souvient de rien. Pour reconnaître un visiteur d’une page à l’autre, on emploie un **cookie** — une petite donnée déposée chez le client et renvoyée à chaque requête. C’est ce qui permet de rester connecté, et c’est aussi ce qui permet le pistage.

## HTTPS
HTTPS est HTTP transporté dans un canal **chiffré** par TLS. Il garantit la **confidentialité**, l’**intégrité** et l’**authenticité** du serveur, attestée par un **certificat**. Il ne dit rien de l’honnêteté du site : un site frauduleux peut parfaitement afficher un cadenas.`,
          },
          questions: [
            ['Dans le modèle client-serveur, qui prend l’initiative de l’échange ?', ['Le client', 'Le serveur', 'Les deux indifféremment', 'Le routeur'], 0, 'Le serveur ne fait que répondre aux requêtes reçues.'],
            ['Quelle méthode HTTP place ses paramètres dans l’URL ?', ['GET', 'POST', 'HEAD', 'DELETE'], 0, 'Ils sont donc visibles, historisés et mis en cache.'],
            ['Pourquoi ne faut-il pas envoyer un mot de passe par la méthode GET ?', ['Il apparaîtrait dans l’URL, l’historique et les journaux du serveur', 'GET est plus lent', 'GET ne supporte pas le texte', 'GET est obsolète'], 0, 'POST place les données dans le corps de la requête.'],
            ['Que signifie un code de statut 404 ?', ['La ressource demandée est introuvable', 'L’accès est interdit', 'Le serveur a échoué', 'La requête a réussi'], 0, 'Un 403 signale un accès interdit, un 500 une erreur du serveur.'],
            ['HTTP est un protocole avec état : le serveur se souvient du client.', ['Vrai', 'Faux'], 1, 'Il est SANS état ; ce sont les cookies qui rétablissent une continuité.'],
            ['À quoi sert un cookie ?', ['À reconnaître un visiteur d’une requête à l’autre', 'À accélérer le chargement des images', 'À chiffrer la connexion', 'À router les paquets'], 0, 'C’est ce qui permet de rester connecté — et ce qui permet le pistage.'],
            ['Le cadenas HTTPS garantit-il l’honnêteté d’un site ?', ['Non, seulement la confidentialité et l’identité du serveur', 'Oui, il atteste du sérieux du site', 'Oui, il garantit l’exactitude du contenu', 'Non, il ne garantit rien du tout'], 0, 'Un site frauduleux peut parfaitement présenter un certificat valide.'],
            ['Afficher une page web ne demande qu’une seule requête HTTP.', ['Vrai', 'Faux'], 1, 'Chaque style, script et image fait l’objet d’une requête supplémentaire.'],
          ],
        },
        {
          titre: 'Pages interactives',
          axe: 'Interagir sur le web',
          lecon: {
            titre: 'HTML, CSS, JavaScript et la question de la confiance',
            cours: `Une page web se construit avec trois langages, aux rôles strictement distincts.

## Les trois rôles
- **HTML** décrit la **structure** et le sens : titres, paragraphes, listes, liens, formulaires. Il ne s’occupe pas de l’apparence.
- **CSS** décrit la **présentation** : couleurs, polices, marges, dispositions, adaptation à la taille de l’écran.
- **JavaScript** décrit le **comportement** : réagir à un clic, valider un champ, modifier la page sans la recharger.

Cette séparation n’est pas cosmétique : elle permet de changer toute l’apparence d’un site sans toucher au contenu, et d’assurer l’accessibilité aux lecteurs d’écran, qui s’appuient sur la structure HTML.

## Le DOM
Le navigateur transforme le HTML en un **arbre d’objets**, le **DOM**. JavaScript agit sur cet arbre : sélectionner un élément, changer son texte, en ajouter un, réagir à un **événement**.

Un **événement** est une action détectable — clic, saisie, envoi de formulaire, chargement — à laquelle on associe une fonction, appelée **gestionnaire d’événement**. C’est le mécanisme central de toute page interactive.

## Où s’exécute le code
- Le code **côté client** s’exécute dans le navigateur du visiteur. Il est rapide, sans aller-retour réseau, mais **entièrement sous le contrôle du visiteur** : lisible, modifiable, désactivable.
- Le code **côté serveur** s’exécute sur la machine distante. C’est le seul lieu où l’on peut vérifier quelque chose de sûr, et le seul qui accède aux données.

> La règle de sécurité qui découle de là, et qu’on attend en devoir : **une validation côté client est un confort, jamais une sécurité**. Elle évite un aller-retour inutile quand l’utilisateur se trompe ; elle ne protège de rien, puisque n’importe qui peut envoyer la requête sans passer par la page. Toute donnée reçue doit être revérifiée côté serveur.

## Formulaires
Un formulaire envoie ses champs au serveur par GET ou POST. Chaque champ porte un **nom**, qui devient la clé sous laquelle le serveur lira la valeur. Les types de champ (courriel, nombre, date) apportent une aide à la saisie — et, là encore, aucune garantie.`,
          },
          questions: [
            ['Quel langage décrit la structure d’une page web ?', ['HTML', 'CSS', 'JavaScript', 'HTTP'], 0, 'CSS gère la présentation, JavaScript le comportement.'],
            ['Qu’est-ce que le DOM ?', ['La représentation de la page en arbre d’objets, manipulable par JavaScript', 'Un protocole réseau', 'Un langage de style', 'Un serveur web'], 0, 'C’est sur lui qu’agit tout script d’interactivité.'],
            ['Une validation de formulaire côté client suffit à sécuriser une application.', ['Vrai', 'Faux'], 1, 'Le code client est modifiable : toute donnée doit être revérifiée côté serveur.'],
            ['Où s’exécute le code JavaScript d’une page ?', ['Dans le navigateur du visiteur', 'Sur le serveur web', 'Dans la base de données', 'Sur le routeur'], 0, 'Il est donc lisible, modifiable et désactivable par le visiteur.'],
            ['Qu’est-ce qu’un gestionnaire d’événement ?', ['Une fonction appelée quand une action détectable se produit', 'Un serveur qui trie les requêtes', 'Une balise HTML', 'Une règle CSS'], 0, 'Clic, saisie, envoi de formulaire : c’est le cœur de l’interactivité.'],
            ['Pourquoi séparer structure, présentation et comportement ?', ['Pour changer l’apparence sans toucher au contenu et préserver l’accessibilité', 'Pour accélérer le réseau', 'Parce que les navigateurs l’imposent', 'Pour réduire le nombre de fichiers'], 0, 'Les lecteurs d’écran s’appuient sur la structure HTML.'],
            ['À quoi sert l’attribut « name » d’un champ de formulaire ?', ['Il devient la clé sous laquelle le serveur lira la valeur', 'Il affiche une étiquette à l’écran', 'Il valide le contenu', 'Il chiffre la donnée'], 0, 'Sans lui, le champ n’est pas transmis.'],
            ['Le code côté serveur est accessible au visiteur.', ['Vrai', 'Faux'], 1, 'Seul le résultat lui parvient ; c’est pourquoi les vérifications s’y font.'],
          ],
        },

        // ---- Chapitre 5 : génie logiciel -------------------------------------
        {
          titre: 'Langages de programmation',
          axe: 'Génie logiciel',
          lecon: {
            titre: 'Types, valeurs et paradigmes',
            cours: `Un **langage de programmation** est une notation formelle : sa **syntaxe** dit ce qui est bien écrit, sa **sémantique** ce que cela signifie.

## Les types de base
- **entier** (int) : nombre exact, sans limite de taille en Python ;
- **flottant** (float) : nombre à virgule, **approché** ;
- **booléen** (bool) : vrai ou faux ;
- **chaîne** (str) : suite de caractères ;
- et les types construits : **liste**, **tuple**, **dictionnaire**.

Le **type** d’une valeur détermine les opérations permises. En Python, le typage est **dynamique** (une variable peut changer de type) et **fort** (additionner un entier et une chaîne provoque une erreur, sans conversion silencieuse).

## Deux opérateurs à ne pas confondre
Le simple signe égal **affecte** une valeur à une variable ; le double signe égal **compare** deux valeurs et rend un booléen. Confondre les deux est l’erreur d’entrée en programmation.

## Mutable ou non
Une **liste** est modifiable en place ; un **tuple** et une **chaîne** ne le sont pas. Conséquence pratique : deux variables peuvent désigner la **même** liste, et modifier l’une modifie l’autre. C’est une source de bugs déroutants tant qu’on n’a pas compris que la variable désigne un objet, et non une copie.

## Les paradigmes
- **impératif** : une suite d’instructions qui modifient un état ;
- **fonctionnel** : des fonctions sans effet de bord, dont le résultat ne dépend que des arguments ;
- **objet** : des objets réunissant données et traitements.

La plupart des langages usuels, dont Python, en mélangent plusieurs.

> Choisir un langage n’est pas une question de goût : la disponibilité des **bibliothèques**, la lisibilité pour l’équipe et les contraintes de performance décident. Python est lisible et très fourni en bibliothèques scientifiques ; C est plus rapide et plus proche de la machine ; JavaScript s’exécute dans tout navigateur.`,
          },
          questions: [
            ['Quelle est la différence entre le simple et le double signe égal ?', ['Le simple affecte une valeur, le double compare', 'Le simple compare, le double affecte', 'Ils sont équivalents', 'Le double sert à la division'], 0, 'C’est l’erreur d’entrée en programmation.'],
            ['Le typage de Python est dynamique et fort. Que signifie « fort » ?', ['Une opération entre types incompatibles provoque une erreur, sans conversion silencieuse', 'Les types ne peuvent jamais changer', 'Les variables doivent être déclarées', 'Les types sont vérifiés à la compilation'], 0, 'Additionner un entier et une chaîne échoue au lieu de deviner.'],
            ['Une liste Python est modifiable en place.', ['Vrai', 'Faux'], 0, 'Contrairement au tuple et à la chaîne, qui ne le sont pas.'],
            ['Que se passe-t-il si deux variables désignent la même liste ?', ['Modifier l’une modifie l’autre', 'Chacune a sa propre copie', 'Python lève une erreur', 'La seconde devient un tuple'], 0, 'Une variable désigne un objet, non une copie de cet objet.'],
            ['Quel type de nombre est approché en machine ?', ['Le flottant', 'L’entier', 'Le booléen', 'La chaîne'], 0, 'En Python, les entiers sont exacts et sans limite de taille.'],
            ['Qu’est-ce que le paradigme fonctionnel ?', ['Des fonctions sans effet de bord, dont le résultat ne dépend que des arguments', 'Des objets réunissant données et traitements', 'Une suite d’instructions modifiant un état', 'Un langage compilé'], 0, 'La plupart des langages usuels mélangent plusieurs paradigmes.'],
            ['Sur quels critères choisit-on un langage pour un projet ?', ['Bibliothèques disponibles, lisibilité pour l’équipe, contraintes de performance', 'La date de création du langage', 'Le nombre de mots-clés', 'La couleur de son logo'], 0, 'Ce n’est pas une question de goût personnel.'],
            ['La syntaxe d’un langage dit ce que signifie un programme.', ['Vrai', 'Faux'], 1, 'La syntaxe dit ce qui est bien écrit ; c’est la SÉMANTIQUE qui dit le sens.'],
          ],
        },
        {
          titre: 'Fonctions et structure du code',
          axe: 'Génie logiciel',
          lecon: {
            titre: 'Découper pour maîtriser',
            cours: `Une **fonction** nomme un traitement pour le réutiliser. C’est le premier outil de lutte contre la complexité.

## Pourquoi découper
- **Réutiliser** au lieu de recopier : une correction faite une fois vaut partout.
- **Tester** séparément chaque morceau.
- **Lire** : un nom bien choisi remplace dix lignes à déchiffrer.
- **Répartir** le travail entre plusieurs personnes.

## Paramètres et retour
Les **paramètres** sont les noms figurant dans la définition, les **arguments** les valeurs passées à l’appel. Une fonction qui rend une valeur la **retourne** ; une fonction qui n’en rend aucune rend, en Python, la valeur *None*.

> Erreur classique : **afficher** au lieu de **retourner**. Une fonction qui affiche ne peut pas être réutilisée dans un calcul — la valeur est partie à l’écran, elle n’est plus disponible.

## Portée des variables
Une variable définie **dans** une fonction est **locale** : elle n’existe pas à l’extérieur. Une variable **globale** est visible partout, mais elle crée des dépendances invisibles entre parties du programme. On les évite : une fonction doit recevoir ce dont elle a besoin par ses **paramètres** et rendre son résultat par son **retour**.

## Les effets de bord
Une fonction a un **effet de bord** si elle modifie autre chose que sa valeur de retour — une variable globale, une liste reçue en argument, un fichier. Ce n’est pas interdit, mais cela doit être **voulu et documenté** : une fonction qui modifie sournoisement la liste qu’on lui passe produit des bugs très difficiles à localiser.

## Spécifier une fonction
Une spécification complète répond à quatre questions : ce que la fonction fait, ce qu’elle reçoit (types et **préconditions**), ce qu’elle rend, et ce qui est garanti en sortie (**postconditions**). En Python, elle s’écrit dans la **docstring**, la chaîne placée juste sous la ligne de définition.

Les **assertions** permettent de vérifier une précondition à l’exécution : elles arrêtent le programme au bon endroit plutôt que de le laisser produire un résultat faux dix étapes plus loin.`,
          },
          questions: [
            ['Quelle est la différence entre un paramètre et un argument ?', ['Le paramètre est le nom dans la définition, l’argument la valeur passée à l’appel', 'Ce sont deux synonymes', 'Le paramètre est toujours un entier', 'L’argument est le résultat de la fonction'], 0, 'Distinction classique, souvent demandée.'],
            ['Pourquoi vaut-il mieux retourner une valeur que l’afficher ?', ['Parce qu’une valeur affichée n’est plus disponible pour un autre calcul', 'Parce que l’affichage est plus lent', 'Parce que Python l’interdit', 'Parce que cela consomme de la mémoire'], 0, 'Une fonction qui affiche ne se réutilise pas.'],
            ['Une variable définie dans une fonction est visible à l’extérieur.', ['Vrai', 'Faux'], 1, 'Elle est LOCALE : elle n’existe que pendant l’exécution de la fonction.'],
            ['Qu’est-ce qu’un effet de bord ?', ['Une modification autre que la valeur de retour', 'Une erreur d’exécution', 'Un retour de plusieurs valeurs', 'Un appel récursif'], 0, 'Permis, mais il doit être voulu et documenté.'],
            ['Que contient une spécification complète de fonction ?', ['Ce qu’elle fait, ce qu’elle reçoit, ce qu’elle rend, ce qui est garanti en sortie', 'Le nom de son auteur et la date', 'Le nombre de lignes de code', 'La liste des variables globales'], 0, 'Préconditions et postconditions en font partie.'],
            ['À quoi sert une assertion ?', ['À vérifier une condition et arrêter le programme au bon endroit si elle est fausse', 'À afficher une valeur', 'À accélérer l’exécution', 'À documenter le code'], 0, 'Mieux vaut échouer tôt que produire un résultat faux dix étapes plus loin.'],
            ['Pourquoi éviter les variables globales ?', ['Elles créent des dépendances invisibles entre parties du programme', 'Elles ralentissent l’exécution', 'Python les interdit', 'Elles occupent trop de mémoire'], 0, 'Une fonction doit recevoir par ses paramètres et rendre par son retour.'],
            ['En Python, une fonction sans instruction de retour rend la valeur None.', ['Vrai', 'Faux'], 0, 'C’est une source d’erreurs quand on oublie le retour.'],
          ],
        },
        {
          titre: 'Vérifications',
          axe: 'Génie logiciel',
          lecon: {
            titre: 'Tester, tracer, prouver',
            cours: `Un programme qui « a l’air de marcher » n’est pas un programme vérifié. Trois familles de moyens permettent d’acquérir de la confiance.

## Les jeux de tests
Un **test** confronte une entrée à la sortie **attendue**. Un bon jeu de tests couvre :
- les cas **courants** ;
- les cas **limites** — liste vide, un seul élément, valeur minimale ou maximale, zéro, nombre négatif ;
- les cas **interdits**, pour vérifier que la fonction refuse proprement.

> Ce sont les cas limites qui trouvent les bugs. Le cas courant, on l’a en tête en écrivant le code : c’est justement pour cela qu’il fonctionne.

Un test **unitaire** porte sur une seule fonction ; les tests d’**intégration** vérifient que les fonctions travaillent bien ensemble. Les tests s’écrivent une fois et se **rejouent** à chaque modification : c’est ce qui permet de détecter une **régression**, un bug réintroduit dans du code qui marchait.

## Ce que les tests ne peuvent pas faire
Ils montrent la **présence** de bugs, jamais leur **absence**. Une fonction qui passe cent tests peut échouer au cent-unième. Pour garantir, il faut **prouver** — raisonner sur le programme lui-même : montrer qu’un **invariant** de boucle est vrai à chaque tour, et qu’un **variant** décroît strictement, donc que la boucle termine.

## Le débogage
Quand un test échoue, la méthode est toujours la même :
1. **reproduire** l’erreur de façon fiable, avec l’entrée la plus petite possible ;
2. **localiser**, en affichant des valeurs intermédiaires ou en avançant pas à pas dans un débogueur ;
3. **comprendre** la cause avant de corriger — une correction faite au hasard déplace le bug plus qu’elle ne le supprime ;
4. **ajouter un test** qui échouait avant la correction, pour que le bug ne revienne pas.

## Les bonnes pratiques
Nommer clairement, indenter, documenter par une **docstring**, commenter le **pourquoi** et non le **quoi**, et employer un système de **gestion de versions** : il conserve l’historique, permet de revenir en arrière et de travailler à plusieurs sans s’écraser.`,
          },
          questions: [
            ['Que montre un jeu de tests réussi ?', ['Rien sur l’absence de bugs : il montre seulement leur présence quand il échoue', 'Que le programme est prouvé correct', 'Que le programme est optimal', 'Que le code est lisible'], 0, 'Passer cent tests n’empêche pas d’échouer au cent-unième.'],
            ['Quels cas de test trouvent le plus de bugs ?', ['Les cas limites', 'Les cas courants', 'Les cas les plus longs', 'Les cas aléatoires'], 0, 'Le cas courant, on l’avait en tête en écrivant le code.'],
            ['Qu’est-ce qu’une régression ?', ['Un bug réintroduit dans du code qui fonctionnait', 'Une baisse de performance', 'Un retour à une version antérieure', 'Une erreur de compilation'], 0, 'Rejouer les tests à chaque modification sert à la détecter.'],
            ['Qu’est-ce qu’un variant de boucle ?', ['Une quantité entière positive qui décroît strictement, prouvant la terminaison', 'Une propriété vraie à chaque tour', 'Une variable modifiée dans la boucle', 'Un compteur d’itérations'], 0, 'L’invariant, lui, sert à prouver la correction.'],
            ['Quelle est la première étape du débogage ?', ['Reproduire l’erreur de façon fiable, sur la plus petite entrée possible', 'Corriger la ligne suspecte', 'Réécrire la fonction', 'Ajouter des commentaires'], 0, 'Corriger au hasard déplace le bug plus qu’il ne le supprime.'],
            ['Que faut-il faire après avoir corrigé un bug ?', ['Ajouter un test qui échouait avant la correction', 'Supprimer les anciens tests', 'Recompiler le projet', 'Changer de langage'], 0, 'C’est ce qui empêche le bug de revenir.'],
            ['Un commentaire doit expliquer ce que fait la ligne de code.', ['Vrai', 'Faux'], 1, 'Il doit expliquer POURQUOI : le « quoi » se lit déjà dans le code.'],
            ['À quoi sert un système de gestion de versions ?', ['À conserver l’historique, revenir en arrière et travailler à plusieurs', 'À accélérer l’exécution', 'À compiler le code', 'À tester automatiquement'], 0, 'C’est l’outil de base du travail en équipe.'],
          ],
        },

        // ---- Chapitre 6 : algorithmique et programmation --------------------
        {
          titre: 'Terminaison et complexité',
          axe: 'Algorithmique et programmation',
          lecon: {
            titre: 'S’arrête-t-il ? et en combien de temps ?',
            cours: `Deux questions se posent devant tout algorithme, et elles sont indépendantes : **termine-t-il ?** et **combien d’opérations coûte-t-il ?**

## La terminaison
Une boucle **bornée** termine par construction : le nombre de tours est fixé d’avance.

Une boucle **non bornée** — « tant que » — ne termine pas d’office. Pour le prouver, on exhibe un **variant** : une quantité **entière**, **positive**, qui **décroît strictement** à chaque tour. Une suite d’entiers positifs strictement décroissante ne peut pas être infinie, donc la boucle s’arrête.

## La correction
Un algorithme peut terminer et rendre un résultat faux. On le prouve correct par un **invariant de boucle** : une propriété vraie avant la boucle, conservée par chaque tour, et qui, jointe à la condition de sortie, donne le résultat voulu.

Variant et invariant répondent donc à deux questions différentes : **est-ce que ça s’arrête** et **est-ce que c’est juste**.

## Le coût
On compte le **nombre d’opérations élémentaires** en fonction de la taille n des données, et l’on ne retient que l’**ordre de grandeur** — le comportement quand n devient grand. Les constantes et les termes dominés disparaissent.

Les classes à connaître, par coût croissant :
- **constant** : le coût ne dépend pas de n — accéder à la case i d’un tableau ;
- **logarithmique** : recherche dichotomique dans un tableau trié ;
- **linéaire** : un parcours complet — chercher un élément dans une liste non triée ;
- **n log n** : les bons algorithmes de tri ;
- **quadratique** : deux boucles imbriquées — tri par sélection, tri par insertion ;
- **exponentiel** : essayer toutes les combinaisons — impraticable au-delà de quelques dizaines d’éléments.

> Ce que ces classes veulent dire concrètement : sur un million d’éléments, un algorithme linéaire fait un million d’opérations, un algorithme quadratique mille milliards. Le premier s’exécute en une seconde, le second en des semaines. Améliorer l’algorithme bat toujours l’achat d’une machine plus rapide.

## Pire cas, meilleur cas
On raisonne d’ordinaire sur le **pire cas** : c’est la seule garantie. La recherche séquentielle coûte une seule comparaison si l’élément est en tête, n comparaisons s’il est absent — et c’est ce dernier chiffre qui compte pour dimensionner un système.`,
          },
          questions: [
            ['Qu’est-ce qu’un variant de boucle ?', ['Une quantité entière positive qui décroît strictement à chaque tour', 'Une propriété vraie à chaque tour', 'Une variable modifiée dans la boucle', 'Le nombre total d’itérations'], 0, 'Il prouve la TERMINAISON ; l’invariant prouve la correction.'],
            ['Quelle est la complexité d’une recherche dichotomique dans un tableau trié ?', ['Logarithmique', 'Linéaire', 'Quadratique', 'Constante'], 0, 'Chaque comparaison élimine la moitié des candidats.'],
            ['Un algorithme qui termine rend nécessairement un résultat correct.', ['Vrai', 'Faux'], 1, 'Terminaison et correction sont deux propriétés indépendantes.'],
            ['Quelle est la complexité de deux boucles imbriquées parcourant chacune n éléments ?', ['Quadratique', 'Linéaire', 'Logarithmique', 'n log n'], 0, 'C’est celle du tri par sélection ou par insertion.'],
            ['Pourquoi raisonne-t-on d’ordinaire sur le pire cas ?', ['Parce que c’est la seule garantie sur laquelle dimensionner un système', 'Parce qu’il est plus simple à calculer', 'Parce qu’il se produit le plus souvent', 'Parce que le meilleur cas est imprévisible'], 0, 'Le meilleur cas ne dit rien de ce qu’on peut promettre.'],
            ['Combien d’opérations un algorithme quadratique effectue-t-il sur un million d’éléments ?', ['Environ mille milliards', 'Environ un million', 'Environ deux millions', 'Environ mille'], 0, 'Le linéaire en ferait un million : d’où l’écart entre une seconde et des semaines.'],
            ['Dans un calcul de complexité, on garde les constantes multiplicatives.', ['Vrai', 'Faux'], 1, 'On ne retient que l’ordre de grandeur quand n devient grand.'],
            ['Que prouve un invariant de boucle ?', ['La correction de l’algorithme', 'Sa terminaison', 'Sa complexité', 'Sa lisibilité'], 0, 'Il est vrai avant la boucle et conservé par chaque tour.'],
          ],
        },
        {
          titre: 'Tableaux et matrices',
          axe: 'Algorithmique et programmation',
          lecon: {
            titre: 'Ranger des données en lignes et en colonnes',
            cours: `Un **tableau** — une **liste** en Python — range des valeurs dans un ordre déterminé, chacune accessible par son **indice**.

## Indices
Les indices commencent à **0** : le premier élément est d’indice 0, le dernier d’indice n − 1 pour un tableau de n éléments. Sortir de ces bornes provoque une erreur — c’est le bug le plus fréquent du chapitre, et il vient presque toujours d’une boucle qui va « jusqu’à n » au lieu de « jusqu’à n − 1 ».

L’accès par indice est **immédiat**, quelle que soit la taille du tableau : coût constant.

## Construire un tableau
Trois façons :
- par **énumération** de ses éléments ;
- par **ajout** successif dans une boucle, à partir d’une liste vide ;
- par **compréhension**, notation compacte qui décrit le contenu en une ligne — et qui est à la fois plus lisible et plus rapide.

## Parcourir
- Le parcours **par élément** convient quand on n’a pas besoin de la position ;
- le parcours **par indice** est nécessaire dès qu’on veut modifier le tableau ou comparer un élément à son voisin.

## Les matrices
Une **matrice** est un tableau à deux dimensions : une liste dont chaque élément est une liste. On accède à un élément par **deux** indices, ligne puis colonne. Le parcours complet demande **deux boucles imbriquées**, donc un coût **quadratique** pour une matrice carrée.

> Piège redoutable : créer une matrice en multipliant une liste par un entier fabrique n références vers **la même** ligne. Modifier une case en modifie alors une par ligne. Il faut construire chaque ligne séparément, par compréhension.

## Le tranchage
Extraire une portion de tableau produit une **nouvelle** liste, indépendante de l’originale. C’est aussi la façon la plus simple d’en obtenir une **copie** — utile précisément parce qu’une affectation, elle, ne copie rien : elle fait désigner le même objet par deux noms.`,
          },
          questions: [
            ['Quel est l’indice du premier élément d’une liste Python ?', ['0', '1', '−1', 'Cela dépend de la liste'], 0, 'Le dernier est d’indice n − 1.'],
            ['Quel est le coût d’un accès à la case d’indice i d’un tableau ?', ['Constant', 'Linéaire', 'Logarithmique', 'Quadratique'], 0, 'Il ne dépend pas de la taille du tableau.'],
            ['Que provoque une boucle allant « jusqu’à n » sur un tableau de n éléments ?', ['Une erreur d’indice hors bornes', 'Un résultat correct', 'Une boucle infinie', 'Une copie du tableau'], 0, 'Le dernier indice valide est n − 1.'],
            ['Créer une matrice en multipliant une liste par un entier est une méthode sûre.', ['Vrai', 'Faux'], 1, 'On obtient n références vers la MÊME ligne : modifier une case en modifie une par ligne.'],
            ['Quel est le coût du parcours complet d’une matrice carrée de côté n ?', ['Quadratique', 'Linéaire', 'Constant', 'Logarithmique'], 0, 'Deux boucles imbriquées de n tours chacune.'],
            ['Quand faut-il parcourir un tableau par indice plutôt que par élément ?', ['Quand on veut modifier le tableau ou comparer un élément à son voisin', 'Toujours', 'Jamais', 'Uniquement pour les matrices'], 0, 'Le parcours par élément suffit quand la position n’importe pas.'],
            ['Une affectation entre deux variables de type liste crée une copie.', ['Vrai', 'Faux'], 1, 'Les deux noms désignent le même objet ; le tranchage, lui, copie.'],
            ['Comment accède-t-on à un élément d’une matrice ?', ['Par deux indices : ligne puis colonne', 'Par un seul indice', 'Par son nom', 'Par une clé'], 0, 'Une matrice est une liste de listes.'],
          ],
        },
        {
          titre: 'Algorithmes sur les tableaux',
          axe: 'Algorithmique et programmation',
          lecon: {
            titre: 'Rechercher, trier, agréger',
            cours: `Quatre algorithmes de base reviennent partout, et il faut savoir les écrire, les prouver et les évaluer.

## La recherche séquentielle
On parcourt le tableau du début à la fin en comparant. Coût **linéaire** dans le pire cas : n comparaisons quand l’élément est absent. Aucune condition sur le tableau.

## La recherche dichotomique
Sur un tableau **trié** seulement. On compare l’élément cherché à celui du **milieu**, et l’on élimine la moitié où il ne peut pas se trouver. Coût **logarithmique** : sur un million d’éléments, une vingtaine de comparaisons suffisent, contre un million pour la recherche séquentielle.

> La condition « trié » n’est pas un détail : appliquée à un tableau non trié, la dichotomie rend un résultat faux sans le signaler.

Son variant de boucle est la taille de l’intervalle de recherche, qui est divisée par deux à chaque tour : c’est ce qui prouve la terminaison.

## Le calcul d’un extremum
On mémorise le premier élément comme candidat, puis on parcourt en remplaçant le candidat dès qu’on trouve mieux. Coût **linéaire**, et un seul parcours suffit — chercher le maximum puis le minimum en deux parcours est un gaspillage évitable.

L’invariant est simple à énoncer : après i tours, le candidat est le maximum des i premiers éléments.

## Les tris
- Le **tri par sélection** cherche le plus petit élément du reste et le place à sa position finale, n fois.
- Le **tri par insertion** insère chaque élément à sa place dans la partie déjà triée, comme on trie des cartes en main.

Tous deux sont **quadratiques** dans le pire cas. Le tri par insertion est nettement meilleur sur un tableau **presque trié**, où il devient quasi linéaire.

Les tris employés en pratique par les bibliothèques sont en **n log n**, ce qui change tout à grande échelle : sur un million d’éléments, l’écart entre n log n et n² est celui qui sépare une seconde de plusieurs jours.`,
          },
          questions: [
            ['Quelle condition la recherche dichotomique exige-t-elle ?', ['Que le tableau soit trié', 'Que le tableau soit de taille paire', 'Que les éléments soient uniques', 'Aucune condition'], 0, 'Sur un tableau non trié, elle rend un résultat faux sans le signaler.'],
            ['Quel est le coût de la recherche séquentielle dans le pire cas ?', ['Linéaire', 'Logarithmique', 'Constant', 'Quadratique'], 0, 'n comparaisons quand l’élément est absent.'],
            ['Combien de comparaisons environ pour une dichotomie sur un million d’éléments ?', ['Une vingtaine', 'Un million', 'Mille', 'Cent mille'], 0, 'Chaque comparaison élimine la moitié des candidats.'],
            ['Quel est le variant de boucle de la recherche dichotomique ?', ['La taille de l’intervalle de recherche, divisée par deux à chaque tour', 'L’indice courant', 'Le nombre d’éléments trouvés', 'La valeur cherchée'], 0, 'Une quantité entière positive strictement décroissante.'],
            ['Le tri par insertion et le tri par sélection sont tous deux quadratiques dans le pire cas.', ['Vrai', 'Faux'], 0, 'Mais l’insertion est bien meilleure sur un tableau presque trié.'],
            ['Comment trouver le maximum d’un tableau ?', ['En mémorisant un candidat et en le remplaçant dès qu’on trouve mieux', 'En triant d’abord le tableau', 'Par recherche dichotomique', 'En comparant tous les couples d’éléments'], 0, 'Un seul parcours linéaire suffit.'],
            ['Quelle est la complexité des tris employés par les bibliothèques standard ?', ['n log n', 'Quadratique', 'Linéaire', 'Exponentielle'], 0, 'Sur un million d’éléments, l’écart avec n² sépare la seconde de plusieurs jours.'],
            ['Le tri par sélection place à chaque tour un élément à sa position définitive.', ['Vrai', 'Faux'], 0, 'Il cherche le minimum du reste et l’échange avec la première case non triée.'],
          ],
        },
        {
          titre: 'Traitement de tables matricielles (tableur)',
          axe: 'Algorithmique et programmation',
          lecon: {
            titre: 'Des données en table, et ce qu’on en tire',
            cours: `Une **table de données** est un tableau où chaque **ligne** est un enregistrement et chaque **colonne** un **descripteur** — un attribut. C’est la forme la plus répandue de données du monde réel : un fichier CSV, une feuille de tableur, une table de base.

## Le format CSV
Chaque ligne du fichier est un enregistrement, les valeurs séparées par un caractère — le plus souvent la virgule ou le point-virgule. La **première ligne** porte d’ordinaire les noms des descripteurs.

C’est un format **texte**, donc lisible par n’importe quel outil et indépendant d’un logiciel particulier. Ses pièges : un séparateur présent dans une valeur, un encodage de caractères mal deviné, une virgule décimale prise pour un séparateur de colonnes.

## Représenter une table en mémoire
Deux choix :
- une **liste de listes** : simple, mais on accède aux colonnes par un **numéro**, ce qui rend le code illisible et fragile dès qu’une colonne se déplace ;
- une **liste de dictionnaires** : chaque enregistrement associe un nom de descripteur à sa valeur. Le code se lit tout seul et résiste à un changement d’ordre des colonnes. C’est la représentation à préférer.

## Les trois traitements
- **Rechercher** (ou sélectionner) : ne garder que les lignes vérifiant une condition ;
- **Trier** selon un ou plusieurs descripteurs ;
- **Agréger** : compter, sommer, calculer une moyenne, un maximum — éventuellement **par groupe**, ce qui revient à faire une sélection pour chaque valeur du descripteur de regroupement.

## Fusionner deux tables
On rapproche deux tables partageant un descripteur commun, qui sert de **clé**. Une clé doit **identifier de façon unique** un enregistrement : si deux lignes portent la même clé, la fusion produit des doublons silencieux.

> Le vrai travail sur des données réelles est rarement le calcul : c’est le **nettoyage**. Valeurs manquantes, doublons, dates écrites dans trois formats, unités mélangées, fautes de frappe dans les noms — et chaque décision prise pour y remédier doit être documentée, parce qu’elle influence le résultat.`,
          },
          questions: [
            ['Que représente une colonne dans une table de données ?', ['Un descripteur, c’est-à-dire un attribut', 'Un enregistrement', 'Une clé primaire', 'Un fichier'], 0, 'Chaque ligne est un enregistrement.'],
            ['Quelle représentation en mémoire est la plus lisible pour une table ?', ['Une liste de dictionnaires', 'Une liste de listes', 'Une chaîne de caractères', 'Un tuple d’entiers'], 0, 'On accède aux valeurs par le nom du descripteur, pas par un numéro.'],
            ['Un fichier CSV est un format binaire propriétaire.', ['Vrai', 'Faux'], 1, 'C’est un format TEXTE, lisible par n’importe quel outil.'],
            ['Quels sont les trois traitements de base sur une table ?', ['Rechercher, trier, agréger', 'Créer, modifier, supprimer', 'Lire, écrire, fermer', 'Compresser, chiffrer, envoyer'], 0, 'L’agrégation peut se faire par groupe.'],
            ['Que doit garantir une clé de fusion entre deux tables ?', ['Qu’elle identifie de façon unique un enregistrement', 'Qu’elle soit un nombre', 'Qu’elle soit triée', 'Qu’elle soit la première colonne'], 0, 'Sinon la fusion produit des doublons silencieux.'],
            ['Quel piège guette la lecture d’un fichier CSV ?', ['Un séparateur présent dans une valeur, ou un encodage mal deviné', 'Un fichier trop court', 'L’absence de titre', 'Un nombre pair de colonnes'], 0, 'La virgule décimale prise pour un séparateur en est un cas classique.'],
            ['Que représente la première ligne d’un fichier CSV, d’ordinaire ?', ['Les noms des descripteurs', 'Le premier enregistrement', 'La taille du fichier', 'La date de création'], 0, 'C’est une convention, pas une obligation du format.'],
            ['Le nettoyage des données influence le résultat de l’analyse et doit être documenté.', ['Vrai', 'Faux'], 0, 'Valeurs manquantes, doublons et formats mélangés appellent des décisions explicites.'],
          ],
        },
        {
          titre: 'Algorithmes gloutons',
          axe: 'Algorithmique et programmation',
          lecon: {
            titre: 'Le meilleur choix immédiat, et ses limites',
            cours: `Un **algorithme glouton** construit une solution par étapes, en faisant à chaque fois le choix qui **paraît le meilleur sur le moment**, sans jamais revenir en arrière.

## Le schéma
1. trier ou évaluer les candidats selon un **critère** ;
2. prendre le meilleur candidat encore **admissible** ;
3. l’ajouter à la solution, définitivement ;
4. recommencer jusqu’à ce qu’il n’y ait plus de candidat.

Ce schéma est **rapide** — souvent linéaire après un tri, donc n log n au total — et **simple à écrire**. Ce sont ses deux qualités.

## Le rendu de monnaie
Rendre une somme avec le moins de pièces possible : on prend à chaque étape la plus grosse pièce qui n’excède pas ce qui reste à rendre.

Avec le système européen, le glouton donne toujours la solution **optimale**. Avec un système fabriqué exprès — des pièces de 1, 3 et 4, pour rendre 6 — il donne 4 + 1 + 1, soit trois pièces, quand 3 + 3 en demandait deux.

> C’est le point capital du chapitre : le glouton donne toujours **une** solution, rarement la garantie que c’est **la meilleure**. Que cela marche pour les euros est une propriété du système de pièces, pas de l’algorithme.

## Le problème du sac à dos
Remplir un sac de capacité limitée en maximisant la valeur emportée. Le glouton par **rapport valeur sur poids** donne un excellent résultat, souvent non optimal. La solution exacte demande une exploration bien plus coûteuse.

## Autres exemples
- **Choix d’activités** : sélectionner le plus grand nombre de créneaux compatibles en prenant à chaque fois celui qui **finit le plus tôt** — ici le glouton est prouvé **optimal** ;
- **Chemin le plus court** : l’algorithme de Dijkstra, glouton, est optimal tant que les poids sont positifs.

## Quand l’employer
Quand une solution **approchée** suffit, quand le temps de calcul compte, ou quand la structure du problème garantit l’optimalité. Sinon, il faut une méthode exacte — et savoir que son coût sera bien plus élevé.`,
          },
          questions: [
            ['Qu’est-ce qu’un algorithme glouton ?', ['Un algorithme qui fait à chaque étape le meilleur choix immédiat, sans revenir en arrière', 'Un algorithme qui explore toutes les solutions', 'Un algorithme récursif', 'Un algorithme qui consomme beaucoup de mémoire'], 0, 'Rapide et simple, mais rarement garanti optimal.'],
            ['Un algorithme glouton donne-t-il toujours la solution optimale ?', ['Non, seulement dans certains problèmes', 'Oui, toujours', 'Oui, si les données sont triées', 'Non, jamais'], 0, 'Il donne toujours UNE solution, pas nécessairement la meilleure.'],
            ['Avec des pièces de 1, 3 et 4, combien de pièces le glouton rend-il pour 6 ?', ['Trois : 4 + 1 + 1', 'Deux : 3 + 3', 'Six pièces de 1', 'Quatre'], 0, 'L’optimum était 3 + 3 : le glouton échoue sur ce système.'],
            ['Que le glouton fonctionne pour le rendu de monnaie en euros est une propriété…', ['du système de pièces, pas de l’algorithme', 'de l’algorithme lui-même', 'de la monnaie électronique', 'du hasard'], 0, 'Un autre système de pièces le met en défaut.'],
            ['Quel critère glouton donne un bon résultat au problème du sac à dos ?', ['Le rapport valeur sur poids', 'Le poids le plus faible', 'La valeur la plus élevée', 'L’ordre d’arrivée'], 0, 'Excellent en général, mais non optimal.'],
            ['L’algorithme de Dijkstra est glouton et optimal si les poids sont positifs.', ['Vrai', 'Faux'], 0, 'C’est un cas où la structure du problème garantit l’optimalité.'],
            ['Quelle est la complexité typique d’un glouton après un tri préalable ?', ['n log n', 'Quadratique', 'Exponentielle', 'Constante'], 0, 'Le tri domine, le parcours qui suit est linéaire.'],
            ['Quand faut-il préférer une méthode exacte à un glouton ?', ['Quand l’optimalité est exigée et que la structure ne la garantit pas', 'Quand les données sont nombreuses', 'Quand le temps de calcul est limité', 'Toujours'], 0, 'Son coût sera bien plus élevé : c’est un arbitrage.'],
          ],
        },
        {
          titre: 'Algorithmes d’apprentissage',
          axe: 'Algorithmique et programmation',
          lecon: {
            titre: 'Apprendre à partir de données',
            cours: `Un algorithme d’**apprentissage automatique** ne reçoit pas une règle explicite : il l’**induit** à partir d’exemples. C’est un renversement complet de la démarche habituelle, où le programmeur écrit la règle.

## Les deux grandes familles
- L’apprentissage **supervisé** part d’exemples **étiquetés** — des données dont on connaît la réponse — et cherche à prédire l’étiquette de données nouvelles. Deux sous-cas : la **classification** (l’étiquette est une catégorie : courriel indésirable ou non) et la **régression** (l’étiquette est un nombre : le prix d’un logement).
- L’apprentissage **non supervisé** travaille sur des données **sans étiquette** et cherche une structure : le **partitionnement** regroupe les données semblables sans qu’on ait dit ce que sont les groupes.

## L’algorithme des k plus proches voisins
Le plus simple des algorithmes supervisés, et celui du programme. Pour classer un point nouveau :
1. calculer sa **distance** à tous les points de l’ensemble d’apprentissage ;
2. retenir les **k plus proches** ;
3. lui attribuer la classe **majoritaire** parmi ces k voisins.

Il n’y a pas d’entraînement : tout le travail se fait à la prédiction, ce qui la rend coûteuse — le coût est **linéaire** en le nombre d’exemples, pour chaque point à classer.

Le choix de **k** est décisif : trop petit, la prédiction suit le bruit ; trop grand, elle lisse les frontières entre classes jusqu’à les effacer. Il est également indispensable de **normaliser** les descripteurs : une variable exprimée en milliers écraserait, dans le calcul de distance, une variable comprise entre 0 et 1.

## Évaluer un modèle
On sépare les données en un ensemble d’**apprentissage** et un ensemble de **test**, et l’on mesure la performance sur des données **jamais vues**. Évaluer sur les données d’apprentissage donne un résultat flatteur et faux : c’est le **surapprentissage**, un modèle qui a retenu les exemples au lieu d’en tirer une règle.

## Les limites, qui sont au programme
Un modèle **reproduit les biais** de ses données : entraîné sur des décisions passées inégalitaires, il les perpétue en leur donnant l’apparence de l’objectivité. Il **corrèle** sans expliquer — une corrélation n’est pas une cause. Et il ne sait rien dire des situations absentes de ses données.

> D’où une exigence, et non une précaution de style : dire d’où viennent les données, ce qu’elles ne couvrent pas, et ce que le modèle ne permet pas de conclure.`,
          },
          questions: [
            ['Quelle est la différence entre apprentissage supervisé et non supervisé ?', ['Le supervisé part d’exemples étiquetés, le non supervisé de données sans étiquette', 'Le supervisé est plus rapide', 'Le non supervisé exige plus de données', 'Le supervisé ne fait que de la régression'], 0, 'Le non supervisé cherche une structure, comme un partitionnement.'],
            ['Comment l’algorithme des k plus proches voisins classe-t-il un point nouveau ?', ['Par la classe majoritaire parmi ses k voisins les plus proches', 'Par la classe de son voisin le plus lointain', 'Par tirage aléatoire', 'Par la moyenne de toutes les classes'], 0, 'Aucun entraînement : tout le travail se fait à la prédiction.'],
            ['Pourquoi faut-il normaliser les descripteurs avant un calcul de distance ?', ['Sinon une variable de grande amplitude écrase les autres', 'Pour accélérer le calcul', 'Pour éviter les valeurs manquantes', 'Pour équilibrer les classes'], 0, 'Une variable en milliers dominerait une variable entre 0 et 1.'],
            ['Qu’est-ce que le surapprentissage ?', ['Un modèle qui a retenu ses exemples au lieu d’en tirer une règle générale', 'Un modèle entraîné trop longtemps sur peu de données seulement', 'Un modèle trop rapide', 'Un modèle mal normalisé'], 0, 'Il donne d’excellents résultats sur ses données et de mauvais sur les nouvelles.'],
            ['Sur quelles données faut-il évaluer un modèle ?', ['Sur des données jamais vues pendant l’apprentissage', 'Sur les données d’apprentissage', 'Sur toutes les données disponibles', 'Sur des données générées au hasard'], 0, 'D’où la séparation en ensemble d’apprentissage et ensemble de test.'],
            ['Un modèle entraîné sur des données biaisées produit des prédictions neutres.', ['Vrai', 'Faux'], 1, 'Il reproduit les biais, en leur donnant l’apparence de l’objectivité.'],
            ['Quel est le coût de la prédiction avec les k plus proches voisins ?', ['Linéaire en le nombre d’exemples, pour chaque point à classer', 'Constant', 'Logarithmique', 'Nul, tout est calculé à l’entraînement'], 0, 'C’est le prix de l’absence de phase d’entraînement.'],
            ['Que se passe-t-il si k est choisi trop grand ?', ['Les frontières entre classes sont lissées jusqu’à s’effacer', 'La prédiction suit le bruit', 'Le calcul devient impossible', 'Le modèle refuse de prédire'], 0, 'Un k trop petit, à l’inverse, rend le modèle sensible au bruit.'],
          ],
        },
      ],
    },
  ],
}
