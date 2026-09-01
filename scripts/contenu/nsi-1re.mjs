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
            cours: `Un ordinateur ne connaît que deux états : présence ou absence de tension, aimantation dans un sens ou dans l'autre. On les note 0 et 1.

## Pourquoi le binaire
Un circuit électronique distingue mal dix niveaux de tension, et très bien deux.

> Le binaire n'est pas un choix mathématique mais une conséquence de la **fiabilité physique** : un signal bruité reste lisible tant qu'on ne demande à le classer que dans deux catégories.

## Compter en base 2
Chaque bit porte un **poids**, puissance de 2 croissante de droite à gauche.

| Le bit | 1 | 1 | 0 | 1 |
| Son poids | 8 | 4 | 2 | 1 |
| Sa contribution | 8 | 4 | 0 | 1 |

Le nombre 1101 vaut donc **13**.

## Du décimal au binaire
Divisions successives par 2, restes lus **de bas en haut**.

| L'opération | Le quotient | Le reste |
| 13 ÷ 2 | 6 | **1** |
| 6 ÷ 2 | 3 | **0** |
| 3 ÷ 2 | 1 | **1** |
| 1 ÷ 2 | 0 | **1** |

Lu de bas en haut : 1101.

## Combien de valeurs
| Le nombre de bits | Les valeurs codées |
| 1 | 2 |
| 2 | 4 |
| 8 | 256 |
| 10 | 1 024 |

Avec n bits, **2 puissance n** valeurs. La relation se manie dans les deux sens : pour coder 300 valeurs, 8 bits ne suffisent pas, il en faut **9**.

> La croissance est exponentielle : ajouter un seul bit **double** le nombre de valeurs représentables.

## Les opérations
| L'opération | Comment elle se fait |
| **Addition** | Comme en décimal, avec une **retenue** dès 1 + 1 : en binaire, 1 + 1 vaut 10 |
| **Opérations logiques** bit à bit (ET, OU, XOR, NON) | Position par position, **sans** retenue |

## L'information n'est pas la donnée
| Le mot 01000001, lu comme… | Vaut |
| Un entier | 65 |
| Un caractère ASCII | La lettre A |
| Un pixel | Une nuance de gris |

> Rien dans le mot ne dit ce qu'il représente : c'est la **convention** du programme qui l'interprète.`,
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
            cours: `Un bit seul ne dit presque rien. On les groupe par huit : c'est l'octet, qui code 2 puissance 8 = 256 valeurs, de 0 à 255.

## Les multiples
| Le préfixe décimal | Sa valeur | Le préfixe binaire | Sa valeur |
| kilooctet (ko) | 1 000 octets | kibioctet (Kio) | 1 024 octets |
| mégaoctet (Mo) | 10⁶ octets | mébioctet (Mio) | 2²⁰ octets |
| gigaoctet (Go) | 10⁹ octets | gibioctet (Gio) | 2³⁰ octets |

> Les fabricants de disques comptent en puissances de 10, les systèmes affichaient longtemps des puissances de 2 : d'où l'impression, à l'achat, qu'il « manque » de la place.

| La notation | Ce qu'elle désigne |
| **b** minuscule | Le **bit** |
| **B** majuscule (ou « o ») | L'**octet** |

> Un débit annoncé en Mb/s est huit fois plus petit qu'en Mo/s.

## L'hexadécimal
Écrire un octet en binaire demande huit chiffres ; en hexadécimal, **deux** suffisent, un chiffre valant exactement quatre bits.

| La couleur web | Sa lecture |
| #FF8000 | Rouge à 255, vert à 128, bleu à 0 |

## Coder les caractères
| Le codage | Sa taille | Sa couverture |
| **ASCII** | 7 bits, 128 caractères | Alphabet latin non accentué, chiffres, ponctuation |
| **Unicode** + **UTF-8** | 1 à 4 octets selon le caractère | Toutes les écritures, en gardant l'ASCII inchangé sur un octet |

> Un texte lu avec le mauvais encodage produit ces caractères parasites à la place des accents : l'octet est intact, c'est la **table de lecture** qui est fausse.

## Coder les images et les sons
| Le média | Sa structure | Son poids brut |
| Image **matricielle** | Un tableau de pixels, chacun sur 3 octets (rouge, vert, bleu) | largeur × hauteur × 3 octets |
| Son numérisé | Une suite d'échantillons | Selon la fréquence d'échantillonnage et la résolution |

Trois octets par pixel donnent plus de **16 millions** de couleurs. Ces poids s'entendent **avant compression**.`,
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
            cours: `Sous les logiciels, il n'y a que des circuits qui commutent. Comprendre la machine, c'est remonter cette chaîne.

## Du transistor au circuit
| Le niveau | Ce qu'il est |
| **Transistor** | Un **interrupteur commandé électriquement**, sans pièce mobile — un processeur en contient plusieurs **milliards** |
| **Porte logique** | Quelques transistors : NON, ET, OU et leurs dérivés |
| **Circuit combinatoire** | Des portes : additionneur, comparateur, multiplexeur, décodeur |
| **Bascule** | Un circuit qui **garde un bit** : le passage du circuit qui calcule au circuit qui **se souvient** |

## Le modèle de von Neumann
| La partie | Son rôle |
| **Unité arithmétique et logique** | Elle calcule |
| **Unité de commande** | Elle séquence les instructions |
| **Mémoire** | Elle contient **à la fois les données et le programme** |
| **Entrées-sorties** | Elles relient au monde |

> Que le programme soit stocké dans la **même mémoire** que les données est l'idée décisive : une machine peut alors charger un autre logiciel, ou en compiler un nouveau. Sans elle, un ordinateur serait figé dans une seule tâche.

## Le cycle d'exécution
Le processeur répète indéfiniment trois étapes :

| L'étape | Ce qu'elle fait |
| **Charger** | L'instruction pointée par le compteur ordinal |
| **Décoder** | Reconnaître l'opération et ses opérandes |
| **Exécuter** | La réaliser, puis passer à la suivante |

Le rythme est donné par l'**horloge** : trois milliards de cycles par seconde pour un processeur à 3 GHz.

## La hiérarchie des mémoires
| La mémoire | Sa vitesse | Sa taille | Sa persistance |
| **Registres** | La plus rapide | Quelques mots | Volatile |
| **Cache** | Très rapide | Quelques Mo | Volatile |
| **Mémoire vive** | Rapide | Quelques Go | **Volatile** |
| **Stockage** | Lente | Plusieurs To | **Persistant** |

> Plus une mémoire est rapide, plus elle coûte cher et plus elle est petite.`,
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
            cours: `Ce qui distingue un ordinateur d'une calculatrice, c'est qu'on peut lui décrire ce qu'il doit faire — et changer cette description.

## Le langage machine
Le processeur n'exécute que des instructions élémentaires codées en binaire : charger une valeur en registre, additionner, comparer, sauter à une adresse, écrire en mémoire.

| Le langage | Ce qu'il est |
| **Machine** | Le binaire réellement exécuté ; chaque famille de processeurs a son **jeu d'instructions** |
| **Assembleur** | Sa traduction lisible : un mot mnémonique par instruction |
| **Haut niveau** | Une notation proche des mathématiques et du langage naturel |

## Compilation ou interprétation
| Le point | **Compilation** | **Interprétation** |
| Ce qui est traduit | **Tout le programme**, avant l'exécution | **Instruction par instruction**, pendant |
| Le résultat | Un exécutable rapide, lié à une plateforme | Aucun fichier produit |
| La souplesse | Faible | Élevée |
| Les erreurs de syntaxe | Détectées **avant** le lancement | Au moment où la ligne est atteinte |

> Python est interprété : un programme peut s'exécuter longtemps avant de s'arrêter sur une faute située à la fin.

## Ce qu'un programme manipule
| L'élément | Ce qu'il est |
| **Variable** | Une case nommée qui contient une valeur |
| **Type** | Entier, flottant, booléen, chaîne, liste |
| **Structure de contrôle** | Test conditionnel, boucle bornée, boucle non bornée |
| **Fonction** | Un traitement nommé, donc réutilisable |

> Un **flottant** n'est pas un réel exact : 0,1 + 0,2 ne donne pas exactement 0,3, parce que 0,1 n'a pas d'écriture binaire finie. Une comparaison d'égalité entre flottants se fait donc **à une tolérance près**.

## Ce qui reste hors de portée
| La limite | Son énoncé |
| **Complexité** | Toute fonction calculable ne l'est pas en temps raisonnable |
| **Indécidabilité** | Aucun programme ne peut déterminer, dans le cas général, si un autre programme s'arrêtera |

> C'est un résultat démontré, pas une limite technique appelée à être levée.`,
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
            cours: `Le système d'exploitation s'interpose entre le matériel et les applications. Sans lui, chaque logiciel devrait connaître le modèle exact de chaque composant.

## Ses quatre fonctions
| La fonction | Ce qu'elle fait | Ce qu'elle garantit |
| Gérer les **processus** | L'**ordonnanceur** donne à chacun de très courtes tranches de temps | L'illusion que tout tourne simultanément |
| Gérer la **mémoire** | Attribuer son espace à chaque processus | Le **cloisonnement** : un logiciel qui plante n'emporte pas la machine |
| Gérer les **fichiers** | Organiser le stockage en arborescence, avec des **droits** par utilisateur | Lecture, écriture, exécution |
| Gérer les **périphériques** | Charger un **pilote** par matériel | Une interface uniforme pour les applications |

## Utilisateur et noyau
| Le mode | Ses droits |
| **Utilisateur** | Restreints : pas d'accès direct au matériel |
| **Noyau** | Tous |

Une application accède au matériel en demandant un service au noyau : c'est un **appel système**.

> C'est cette frontière qui fait la sécurité de l'ensemble.

## Le système de fichiers
Un fichier est une suite d'octets accompagnée de **métadonnées** : nom, taille, dates, droits.

| Le chemin | D'où il part |
| **Absolu** | De la **racine** |
| **Relatif** | Du **répertoire courant** |

> L'extension d'un fichier n'est qu'une **convention de nom** : renommer une image en « .txt » ne change rien à son contenu. Le système la lit pour choisir l'application à ouvrir, rien de plus.

## Logiciel libre et logiciel propriétaire
Un **logiciel libre** garantit quatre libertés : l'exécuter, en étudier le code, le redistribuer, le modifier et publier ses versions.

| L'idée reçue | La réalité |
| Libre = gratuit | Un logiciel libre peut être **payant** |
| Gratuit = libre | Un logiciel gratuit peut être **fermé** |

> Linux, dont le noyau est libre, fait tourner l'essentiel des serveurs du web et, sous Android, la majorité des téléphones.`,
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
            cours: `Un périphérique est tout composant relié à l'unité centrale. On les classe par le sens de l'information.

## Trois familles
| La famille | Ce qu'ils font | Des exemples |
| **Entrée** | Convertir une grandeur du monde réel en données | Clavier, souris, micro, webcam, scanner, capteur |
| **Sortie** | L'inverse | Écran, imprimante, haut-parleur |
| **Entrée-sortie** | Les deux | Écran tactile, disque, carte réseau, clé USB |

## Le stockage
| Le support | Son principe | Ses forces | Ses limites |
| **Disque dur** (HDD) | Plateaux magnétiques, tête mobile | Capacité élevée, coût faible | Lent, fragile aux chocs |
| **SSD** | Mémoire flash, aucune pièce mobile | Rapide, silencieux | Plus cher au téraoctet, cycles d'écriture limités |
| **Optique**, **bandes** | Gravure, magnétisme | Archivage longue durée | Accès lent |

> Tous sont **persistants**, à la différence de la mémoire vive.

## Les interfaces
Un périphérique se relie par un **bus** : USB, HDMI, Bluetooth, Wi-Fi. Chacun est défini par un **débit** maximal et un **protocole**.

> Le débit réel est toujours inférieur au débit théorique : l'encodage et les contrôles d'erreur consomment une part du canal.

## Comment le système les voit
Le noyau charge un **pilote** par périphérique, puis expose une interface uniforme : un logiciel de dessin ne sait rien du modèle d'imprimante, il demande au système d'imprimer.

## Interruption ou scrutation
| Le mécanisme | Son principe | Son coût |
| **Interruption** | Le périphérique prévient le processeur, qui suspend son travail | Efficace : c'est le mécanisme normal |
| **Scrutation** | Le processeur va vérifier périodiquement | Simple, mais coûteux en temps de calcul |

> C'est l'interruption qui explique qu'un ordinateur réagisse instantanément à une frappe au clavier sans passer son temps à le surveiller.`,
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
            cours: `Un réseau relie des machines pour qu'elles échangent des données. Deux problèmes : désigner la machine visée, et acheminer les données jusqu'à elle.

## Deux adresses, deux rôles
| L'adresse | Sa nature | Qui l'attribue | Sa portée |
| **MAC** | Physique, gravée à la fabrication, unique au monde | Le constructeur | Le **réseau local** |
| **IP** | Logique, elle change avec le réseau | Le réseau, souvent par DHCP | **Mondiale** |

| La version | Sa taille | Son espace d'adresses |
| **IPv4** | 4 octets, de 0.0.0.0 à 255.255.255.255 | Environ 4 milliards — **épuisé** |
| **IPv6** | 16 octets | Pratiquement illimité |

## Le masque de sous-réseau
Il sépare l'adresse IP en deux parties. Avec le masque 255.255.255.0, les trois premiers octets identifient le **réseau**, le dernier la **machine**.

Il répond à la seule question qui compte au moment d'envoyer : **le destinataire est-il sur mon réseau ?**

| La réponse | Ce qu'on fait |
| **Oui** | On lui parle **directement**, en trouvant son adresse MAC |
| **Non** | On remet le paquet à la **passerelle** — le routeur |

## Le routage
Un paquet ne connaît jamais tout son trajet. Chaque routeur consulte sa **table de routage** et choisit le **prochain saut**, de proche en proche.

| Le mécanisme | Ce qu'il fait |
| Le routage de proche en proche | Deux paquets d'un même échange peuvent suivre des chemins différents et arriver dans le désordre |
| Le champ **TTL** | Décrémenté à chaque routeur ; à zéro le paquet est détruit, ce qui empêche un paquet mal routé de tourner indéfiniment |

> IP est un protocole **sans connexion et sans garantie** : il fait de son mieux, ne promet ni l'ordre, ni l'unicité, ni l'arrivée. Toutes ces garanties sont l'affaire de la couche au-dessus.

## Les équipements
| L'équipement | Ce qu'il fait | D'après quoi |
| **Commutateur** | Distribue les trames dans un réseau local | L'adresse **MAC** |
| **Routeur** | Relie des réseaux différents | L'adresse **IP** |
| **Serveur DNS** | Traduit un nom de domaine en adresse IP | Sa base de noms |`,
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
            cours: `IP perd des paquets, les duplique et les mélange. TCP construit par-dessus un canal fiable, ordonné et sans doublon.

## Le principe de l'accusé de réception
L'émetteur envoie un message et attend un **accusé de réception** (ACK). Sans ACK avant l'expiration du **délai de garde**, il **retransmet**.

| Ce qui se perd | Le problème créé |
| Le **message** | L'émetteur retransmet : c'est correct |
| L'**accusé** | L'émetteur retransmet un message **déjà reçu** : le destinataire le compte deux fois |

## Le protocole du bit alterné
La solution tient en **un seul bit**. Chaque message porte un numéro qui alterne, 0, 1, 0, 1… et chaque accusé rappelle le numéro qu'il acquitte.

| Le numéro reçu | Ce que fait le récepteur |
| Celui **attendu** | Il garde le message, bascule son bit, acquitte |
| Le **précédent** | Il sait que son ACK s'est perdu : il **jette le doublon** et **réacquitte** |

> Un seul bit suffit parce que l'émetteur n'envoie **qu'un message à la fois** : il ne peut jamais y avoir plus de deux messages en jeu.

C'est le plus simple des protocoles à fenêtre, et il illustre l'idée générale : **numéroter et acquitter** suffit à rendre fiable un canal qui ne l'est pas.

## Ce que TCP ajoute
| Le mécanisme | Ce qu'il apporte |
| Des numéros de séquence **longs** | Plusieurs messages **en vol** simultanément : une **fenêtre** |
| L'**établissement de connexion** en trois temps | Un canal ouvert avant tout échange |
| Le **contrôle de flux** | Ne pas noyer un récepteur lent |
| Le **contrôle de congestion** | Réduire le débit quand le réseau sature |

## TCP ou UDP
| Le point | **TCP** | **UDP** |
| Connexion | Oui | Non |
| Retransmission | Oui | Non |
| Ordre garanti | Oui | Non |
| Vitesse | Moindre | **Élevée** |
| Son usage | Fichier, page web, courriel | Voix et vidéo **en direct** |

> Pour la voix, un paquet retransmis arriverait de toute façon trop tard pour être joué : l'absence de garantie est ici une qualité.`,
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
            cours: `Le web repose sur un modèle client-serveur : le client demande, le serveur répond. Le serveur ne prend jamais l'initiative.

## Ce qui se passe quand on ouvre une page
| L'étape | Ce qui se fait |
| 1 | Le navigateur interroge le **DNS** : nom de domaine → adresse IP |
| 2 | Il ouvre une connexion **TCP**, port 80 (HTTP) ou 443 (HTTPS) |
| 3 | Il envoie une **requête HTTP** |
| 4 | Le serveur renvoie une **réponse** : code de statut, en-têtes, corps |
| 5 | Le navigateur analyse le HTML et **redemande** chaque ressource : styles, scripts, images |

> Une page affichée est le résultat de **dizaines** de requêtes.

## Les deux méthodes
| La méthode | Où passent les données | Sa visibilité | Son usage |
| **GET** | Dans l'**URL** | Visible, historisée, mise en cache | Les **lectures** |
| **POST** | Dans le **corps** de la requête | Non affichée | Formulaires qui modifient, mots de passe |

> Envoyer un identifiant en GET le fait apparaître dans l'URL, l'historique du navigateur et les journaux du serveur. C'est la faute de conception la plus courante — et la plus facile à éviter.

## Les codes de statut
| Le code | Sa signification |
| **200** | Succès |
| **301**, **302** | Redirection |
| **403** | Accès interdit |
| **404** | Ressource introuvable |
| **500** | Erreur du serveur |

> Le premier chiffre suffit à situer : 2 succès, 3 redirection, 4 faute du **client**, 5 faute du **serveur**.

## HTTP est sans état
Chaque requête est indépendante : le serveur ne se souvient de rien. Pour reconnaître un visiteur d'une page à l'autre, on emploie un **cookie** — une petite donnée déposée chez le client et renvoyée à chaque requête.

> C'est ce qui permet de rester connecté, et c'est aussi ce qui permet le pistage.

## HTTPS
HTTP transporté dans un canal **chiffré** par TLS.

| Ce qu'il garantit | Ce qu'il ne garantit pas |
| Confidentialité, intégrité, **authenticité du serveur** attestée par un certificat | L'**honnêteté** du site : un site frauduleux peut afficher un cadenas |`,
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
| Le langage | Ce qu'il décrit | Des exemples |
| **HTML** | La **structure** et le sens | Titres, paragraphes, listes, liens, formulaires |
| **CSS** | La **présentation** | Couleurs, polices, marges, adaptation à l'écran |
| **JavaScript** | Le **comportement** | Réagir à un clic, valider un champ, modifier la page sans la recharger |

> Cette séparation n'est pas cosmétique : elle permet de changer toute l'apparence sans toucher au contenu, et elle assure l'accessibilité aux lecteurs d'écran, qui s'appuient sur la structure HTML.

## Le DOM
Le navigateur transforme le HTML en un **arbre d'objets**, le **DOM**. JavaScript agit sur cet arbre : sélectionner un élément, changer son texte, en ajouter un.

Un **événement** est une action détectable — clic, saisie, envoi de formulaire, chargement — à laquelle on associe une fonction, le **gestionnaire d'événement**.

> C'est le mécanisme central de toute page interactive.

## Où s'exécute le code
| Le code | Où il s'exécute | Sa vitesse | Sa maîtrise |
| **Côté client** | Dans le navigateur du visiteur | Immédiate, sans aller-retour | **Entièrement sous le contrôle du visiteur** : lisible, modifiable, désactivable |
| **Côté serveur** | Sur la machine distante | Un aller-retour réseau | Le seul lieu sûr, et le seul qui accède aux données |

> La règle de sécurité attendue en devoir : **une validation côté client est un confort, jamais une sécurité**. Elle évite un aller-retour inutile ; elle ne protège de rien, puisque n'importe qui peut envoyer la requête sans passer par la page. Toute donnée reçue doit être **revérifiée côté serveur**.

## Formulaires
Un formulaire envoie ses champs par GET ou POST. Chaque champ porte un **nom**, qui devient la clé sous laquelle le serveur lira la valeur.

> Les types de champ — courriel, nombre, date — apportent une aide à la saisie, et là encore aucune garantie.`,
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
            cours: `Un langage de programmation est une notation formelle : sa syntaxe dit ce qui est bien écrit, sa sémantique ce que cela signifie.

## Les types de base
| Le type | Ce qu'il contient | Sa particularité |
| **int** | Un entier | Exact, sans limite de taille en Python |
| **float** | Un nombre à virgule | **Approché** |
| **bool** | Vrai ou faux | — |
| **str** | Une suite de caractères | Non modifiable |
| **list**, **tuple**, **dict** | Des types construits | La liste est modifiable, le tuple non |

## Le typage en Python
| Le caractère | Ce qu'il signifie |
| **Dynamique** | Une variable peut changer de type |
| **Fort** | Additionner un entier et une chaîne provoque une **erreur**, sans conversion silencieuse |

## Deux opérateurs à ne pas confondre
| L'opérateur | Ce qu'il fait |
| Le simple signe égal | Il **affecte** une valeur à une variable |
| Le double signe égal | Il **compare** et rend un booléen |

> Les confondre est l'erreur d'entrée en programmation.

## Mutable ou non
| L'objet | Modifiable en place |
| **Liste** | **Oui** |
| **Tuple**, **chaîne** | Non |

> Conséquence : deux variables peuvent désigner la **même** liste, et modifier l'une modifie l'autre. C'est une source de bugs déroutants tant qu'on n'a pas compris que la variable désigne un objet, non une copie.

## Les paradigmes
| Le paradigme | Son principe |
| **Impératif** | Une suite d'instructions qui modifient un état |
| **Fonctionnel** | Des fonctions sans effet de bord, dont le résultat ne dépend que des arguments |
| **Objet** | Des objets réunissant données et traitements |

La plupart des langages usuels, dont Python, en mélangent plusieurs.

## Choisir un langage
| Le langage | Sa force |
| **Python** | Lisible, très fourni en bibliothèques scientifiques |
| **C** | Rapide, proche de la machine |
| **JavaScript** | S'exécute dans tout navigateur |

> Ce n'est pas une question de goût : la disponibilité des bibliothèques, la lisibilité pour l'équipe et les contraintes de performance décident.`,
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
            cours: `Une fonction nomme un traitement pour le réutiliser. C'est le premier outil de lutte contre la complexité.

## Pourquoi découper
| Le bénéfice | Ce qu'il permet |
| **Réutiliser** | Une correction faite une fois vaut partout |
| **Tester** | Chaque morceau séparément |
| **Lire** | Un nom bien choisi remplace dix lignes à déchiffrer |
| **Répartir** | Le travail entre plusieurs personnes |

## Paramètres et retour
| Le mot | Ce qu'il désigne |
| **Paramètre** | Le nom figurant dans la **définition** |
| **Argument** | La valeur passée à l'**appel** |
| **Retour** | La valeur rendue ; en Python, *None* si aucune |

> Erreur classique : **afficher** au lieu de **retourner**. Une fonction qui affiche ne peut pas être réutilisée dans un calcul — la valeur est partie à l'écran, elle n'est plus disponible.

## Portée des variables
| La variable | Où elle existe | Ce qu'elle vaut |
| **Locale** | Dans la fonction seulement | Le bon usage |
| **Globale** | Partout | Elle crée des dépendances invisibles entre parties du programme |

> Une fonction doit recevoir ce dont elle a besoin par ses **paramètres** et rendre son résultat par son **retour**.

## Les effets de bord
Une fonction a un effet de bord si elle modifie autre chose que sa valeur de retour : une variable globale, une liste reçue en argument, un fichier.

> Ce n'est pas interdit, mais cela doit être **voulu et documenté**. Une fonction qui modifie sournoisement la liste qu'on lui passe produit des bugs très difficiles à localiser.

## Spécifier une fonction
| La question | Ce qu'elle précise |
| Que **fait**-elle ? | Son objet, en une phrase |
| Que **reçoit**-elle ? | Types et **préconditions** |
| Que **rend**-elle ? | Type et signification |
| Qu'est-ce qui est **garanti** ? | Les **postconditions** |

En Python, tout cela s'écrit dans la **docstring**, la chaîne placée juste sous la ligne de définition.

> Les **assertions** vérifient une précondition à l'exécution : elles arrêtent le programme au bon endroit, plutôt que de le laisser produire un résultat faux dix étapes plus loin.`,
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
            cours: `Un programme qui « a l'air de marcher » n'est pas un programme vérifié. Trois familles de moyens permettent d'acquérir de la confiance.

## Les jeux de tests
Un test confronte une entrée à la sortie **attendue**. Un bon jeu couvre :

| Le type de cas | Des exemples |
| **Courants** | Une liste ordinaire, une valeur typique |
| **Limites** | Liste vide, un seul élément, valeur minimale ou maximale, zéro, nombre négatif |
| **Interdits** | Vérifier que la fonction refuse proprement |

> Ce sont les cas limites qui trouvent les bugs. Le cas courant, on l'a en tête en écrivant le code : c'est justement pour cela qu'il fonctionne.

| Le test | Ce qu'il vérifie |
| **Unitaire** | Une seule fonction |
| D'**intégration** | Que les fonctions travaillent bien ensemble |

Les tests s'écrivent une fois et se **rejouent** à chaque modification : c'est ce qui détecte une **régression**, un bug réintroduit dans du code qui marchait.

## Ce que les tests ne peuvent pas faire
> Ils montrent la **présence** de bugs, jamais leur **absence**. Une fonction qui passe cent tests peut échouer au cent-unième.

Pour garantir, il faut **prouver** : montrer qu'un **invariant** de boucle est vrai à chaque tour, et qu'un **variant** décroît strictement, donc que la boucle termine.

## Le débogage
| L'étape | Ce qu'on fait |
| 1. **Reproduire** | Fiablement, avec l'entrée la plus petite possible |
| 2. **Localiser** | Afficher des valeurs intermédiaires, ou avancer pas à pas dans un débogueur |
| 3. **Comprendre** | La cause **avant** de corriger |
| 4. **Ajouter un test** | Celui qui échouait avant la correction |

> Une correction faite au hasard déplace le bug plus qu'elle ne le supprime.

## Les bonnes pratiques
- Nommer clairement, indenter, documenter par une **docstring**.
- Commenter le **pourquoi**, jamais le **quoi** — le code dit déjà le quoi.
- Employer un système de **gestion de versions** : il conserve l'historique, permet de revenir en arrière et de travailler à plusieurs sans s'écraser.`,
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
            cours: `Deux questions se posent devant tout algorithme, et elles sont indépendantes : termine-t-il ? et combien d'opérations coûte-t-il ?

## La terminaison
| La boucle | Sa terminaison |
| **Bornée** (pour) | Assurée par construction : le nombre de tours est fixé d'avance |
| **Non bornée** (tant que) | À **prouver** |

Pour la prouver, on exhibe un **variant** : une quantité **entière**, **positive**, qui **décroît strictement** à chaque tour.

> Une suite d'entiers positifs strictement décroissante ne peut pas être infinie : la boucle s'arrête.

## La correction
Un algorithme peut terminer et rendre un résultat faux. On le prouve correct par un **invariant de boucle** : une propriété vraie avant la boucle, conservée par chaque tour, et qui, jointe à la condition de sortie, donne le résultat voulu.

| L'outil | La question à laquelle il répond |
| **Variant** | Est-ce que ça **s'arrête** ? |
| **Invariant** | Est-ce que c'est **juste** ? |

## Les classes de complexité
On compte les opérations élémentaires en fonction de la taille n, et l'on ne retient que l'**ordre de grandeur**.

| La classe | Un exemple |
| **Constant** | Accéder à la case i d'un tableau |
| **Logarithmique** | Recherche dichotomique dans un tableau trié |
| **Linéaire** | Chercher un élément dans une liste non triée |
| **n log n** | Les bons algorithmes de tri |
| **Quadratique** | Tri par sélection, tri par insertion : deux boucles imbriquées |
| **Exponentiel** | Essayer toutes les combinaisons : impraticable au-delà de quelques dizaines d'éléments |

## Ce que cela veut dire concrètement
| Sur un million d'éléments | Le nombre d'opérations | Le temps |
| Algorithme **linéaire** | Un million | Une seconde |
| Algorithme **quadratique** | Mille milliards | Des semaines |

> Améliorer l'algorithme bat toujours l'achat d'une machine plus rapide.

## Pire cas, meilleur cas
| Le cas de la recherche séquentielle | Son coût |
| L'élément est en **tête** | Une comparaison |
| L'élément est **absent** | n comparaisons |

> On raisonne d'ordinaire sur le **pire cas** : c'est la seule garantie, et c'est lui qui sert à dimensionner un système.`,
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
            cours: `Un tableau — une liste en Python — range des valeurs dans un ordre déterminé, chacune accessible par son indice.

## Indices
| L'élément | Son indice |
| Le **premier** | 0 |
| Le **dernier** | n − 1, pour un tableau de n éléments |

> Sortir de ces bornes provoque une erreur. C'est le bug le plus fréquent du chapitre, et il vient presque toujours d'une boucle qui va « jusqu'à n » au lieu de « jusqu'à n − 1 ».

L'accès par indice est **immédiat**, quelle que soit la taille : coût **constant**.

## Construire un tableau
| La façon | Ce qu'elle vaut |
| Par **énumération** | Directe, pour peu d'éléments |
| Par **ajout** successif dans une boucle | Explicite, un peu verbeuse |
| Par **compréhension** | Une ligne : plus lisible **et** plus rapide |

## Parcourir
| Le parcours | Quand l'employer |
| **Par élément** | On n'a pas besoin de la position |
| **Par indice** | Dès qu'on veut **modifier** le tableau, ou comparer un élément à son voisin |

## Les matrices
Une matrice est un tableau à deux dimensions : une liste dont chaque élément est une liste. On y accède par **deux** indices, ligne puis colonne.

| Le parcours | Son coût |
| Deux boucles imbriquées | **Quadratique** pour une matrice carrée |

> Piège redoutable : créer une matrice en **multipliant une liste par un entier** fabrique n références vers **la même** ligne. Modifier une case en modifie alors une par ligne. Il faut construire chaque ligne séparément, par compréhension.

## Le tranchage
Extraire une portion produit une **nouvelle** liste, indépendante de l'originale.

> C'est aussi la façon la plus simple d'obtenir une **copie** — utile précisément parce qu'une affectation, elle, ne copie rien : elle fait désigner le même objet par deux noms.`,
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
            cours: `Quatre algorithmes de base reviennent partout : il faut savoir les écrire, les prouver et les évaluer.

## Les deux recherches
| La recherche | Sa condition | Son coût (pire cas) | Sur un million d'éléments |
| **Séquentielle** | Aucune | **Linéaire** : n comparaisons | Un million de comparaisons |
| **Dichotomique** | Le tableau doit être **trié** | **Logarithmique** | Une vingtaine |

La dichotomie compare l'élément cherché à celui du **milieu** et élimine la moitié où il ne peut pas se trouver.

> La condition « trié » n'est pas un détail : appliquée à un tableau non trié, la dichotomie rend un résultat **faux sans le signaler**.

Son **variant** est la taille de l'intervalle de recherche, divisée par deux à chaque tour : c'est ce qui prouve la terminaison.

## Le calcul d'un extremum
| L'étape | Ce qu'on fait |
| 1 | Mémoriser le premier élément comme candidat |
| 2 | Parcourir, en remplaçant le candidat dès qu'on trouve mieux |

Coût **linéaire**, un seul parcours.

> Chercher le maximum puis le minimum en **deux** parcours est un gaspillage évitable.

L'**invariant** s'énonce simplement : après i tours, le candidat est le maximum des i premiers éléments.

## Les tris
| Le tri | Son principe | Son point fort |
| **Par sélection** | Chercher le plus petit du reste et le placer à sa position finale, n fois | Un nombre d'échanges minimal |
| **Par insertion** | Insérer chaque élément à sa place dans la partie déjà triée, comme on trie des cartes en main | Quasi **linéaire** sur un tableau presque trié |

Tous deux sont **quadratiques** dans le pire cas.

## Pourquoi n log n change tout
| L'algorithme | Sur un million d'éléments |
| En **n log n** (bibliothèques) | Une seconde |
| En **n²** | Plusieurs jours |

> C'est l'écart qui justifie de connaître la complexité avant d'écrire le code.`,
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
            cours: `Une table de données est un tableau où chaque ligne est un enregistrement et chaque colonne un descripteur. C'est la forme la plus répandue de données du monde réel.

## Le format CSV
Chaque ligne du fichier est un enregistrement, les valeurs séparées par un caractère — virgule ou point-virgule. La **première ligne** porte d'ordinaire les noms des descripteurs.

| Sa force | Ses pièges |
| Format **texte** : lisible par n'importe quel outil, indépendant d'un logiciel | Un séparateur **présent dans une valeur** |
| | Un **encodage** de caractères mal deviné |
| | Une **virgule décimale** prise pour un séparateur de colonnes |

## Représenter une table en mémoire
| La représentation | L'accès à une colonne | Sa robustesse |
| **Liste de listes** | Par un **numéro** | Fragile : tout se casse si une colonne se déplace |
| **Liste de dictionnaires** | Par un **nom** | Le code se lit tout seul et résiste au changement d'ordre |

> La seconde est celle à préférer.

## Les trois traitements
| Le traitement | Ce qu'il fait |
| **Rechercher** (sélectionner) | Ne garder que les lignes vérifiant une condition |
| **Trier** | Selon un ou plusieurs descripteurs |
| **Agréger** | Compter, sommer, moyenner, maximiser — éventuellement **par groupe** |

Agréger par groupe revient à faire une sélection pour chaque valeur du descripteur de regroupement.

## Fusionner deux tables
On rapproche deux tables partageant un descripteur commun, qui sert de **clé**.

> Une clé doit **identifier de façon unique** un enregistrement. Si deux lignes portent la même clé, la fusion produit des doublons silencieux.

## Le vrai travail
| Le problème rencontré | Ce qu'il faut décider |
| Valeurs **manquantes** | Les écarter, les remplacer, ou les signaler |
| **Doublons** | Sur quelle clé les repérer |
| Dates en **trois formats** | Un format cible |
| **Unités** mélangées | Une unité de référence |
| **Fautes de frappe** dans les noms | Une normalisation |

> Sur des données réelles, le calcul est rarement le difficile : c'est le **nettoyage**. Et chaque décision prise pour y remédier doit être documentée, parce qu'elle influence le résultat.`,
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
            cours: `Un algorithme glouton construit une solution par étapes, en faisant à chaque fois le choix qui paraît le meilleur sur le moment, sans jamais revenir en arrière.

## Le schéma
| L'étape | Ce qu'on fait |
| 1 | Trier ou évaluer les candidats selon un **critère** |
| 2 | Prendre le meilleur candidat encore **admissible** |
| 3 | L'ajouter à la solution, **définitivement** |
| 4 | Recommencer jusqu'à épuisement |

Ses deux qualités : **rapide** — souvent n log n, tri compris — et **simple à écrire**.

## Le rendu de monnaie
On prend à chaque étape la plus grosse pièce qui n'excède pas ce qui reste à rendre.

| Le système de pièces | Pour rendre 6 | Le glouton donne | L'optimal est |
| Européen (1, 2, 5…) | — | Optimal | Le même |
| Fabriqué exprès : 1, 3, 4 | 6 | 4 + 1 + 1, soit **3** pièces | 3 + 3, soit **2** pièces |

> Point capital du chapitre : le glouton donne toujours **une** solution, rarement la garantie que c'est **la meilleure**. Que cela marche pour les euros est une propriété du système de pièces, pas de l'algorithme.

## Trois autres problèmes
| Le problème | Le critère glouton | Le résultat |
| **Sac à dos** | Le rapport valeur sur poids | Excellent, souvent **non optimal** |
| **Choix d'activités** | Celle qui **finit le plus tôt** | Prouvé **optimal** |
| **Plus court chemin** (Dijkstra) | Le sommet le plus proche | **Optimal** tant que les poids sont positifs |

## Quand l'employer
| La situation | Le glouton convient-il |
| Une solution **approchée** suffit | **Oui** |
| Le temps de calcul compte | **Oui** |
| La structure du problème garantit l'optimalité | **Oui**, et c'est démontrable |
| Il faut l'optimum garanti sans cette garantie | **Non** : il faut une méthode exacte, bien plus coûteuse |`,
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
            cours: `Un algorithme d'apprentissage automatique ne reçoit pas une règle explicite : il l'induit à partir d'exemples. C'est un renversement complet de la démarche habituelle.

## Les deux grandes familles
| La famille | Ses données | Ce qu'elle cherche | Ses sous-cas |
| **Supervisé** | Des exemples **étiquetés** | Prédire l'étiquette de données nouvelles | **Classification** (courriel indésirable ou non), **régression** (le prix d'un logement) |
| **Non supervisé** | Des données **sans étiquette** | Une structure | Le **partitionnement** regroupe les données semblables |

## Les k plus proches voisins
Le plus simple des algorithmes supervisés, et celui du programme.

| L'étape | Ce qu'on fait |
| 1 | Calculer la **distance** du point nouveau à tous les points d'apprentissage |
| 2 | Retenir les **k plus proches** |
| 3 | Lui attribuer la classe **majoritaire** parmi ces k voisins |

> Il n'y a pas d'entraînement : tout le travail se fait à la prédiction. Le coût est **linéaire** en le nombre d'exemples, pour **chaque** point à classer.

## Les deux réglages qui décident de tout
| Le réglage | Le risque si… | Ce qu'il produit |
| **k** trop petit | — | La prédiction suit le **bruit** |
| **k** trop grand | — | Les frontières entre classes sont lissées jusqu'à s'effacer |
| Descripteurs **non normalisés** | Une variable en milliers face à une variable entre 0 et 1 | La première **écrase** la seconde dans le calcul de distance |

## Évaluer un modèle
On sépare les données en un ensemble d'**apprentissage** et un ensemble de **test**, et l'on mesure la performance sur des données **jamais vues**.

> Évaluer sur les données d'apprentissage donne un résultat flatteur et faux : c'est le **surapprentissage**, un modèle qui a retenu les exemples au lieu d'en tirer une règle.

## Les limites, qui sont au programme
| La limite | Ce qu'elle signifie |
| Les **biais** | Entraîné sur des décisions passées inégalitaires, le modèle les perpétue en leur donnant l'apparence de l'objectivité |
| La **corrélation** | Il corrèle sans expliquer : une corrélation n'est pas une cause |
| La **couverture** | Il ne sait rien dire des situations absentes de ses données |

> D'où une exigence, et non une précaution de style : dire d'où viennent les données, ce qu'elles ne couvrent pas, et ce que le modèle ne permet pas de conclure.`,
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
