// NSI TERMINALE (spécialité) — les 20 fiches du programme officiel, dans l'ordre
// de ses 5 chapitres : « Appareils en réseaux » (2), « Structures de données »
// (4), « Bases de données » (5), « Génie logiciel » (5), « Algorithmique » (4).
//
// POURQUOI UN MODULE NEUF : la NSI de Terminale vient des migrations 008 et 146,
// écrites à la main et DÉJÀ EXÉCUTÉES, qui ne doivent plus être régénérées. Le
// slug `nsi` n'avait encore aucun module dans scripts/contenu — d'où la
// génération par `--modules` (cf. le README).
//
// PÉRIMÈTRE : la TERMINALE SEULE. Le ménage est borné à `level = 'Tle'` : la
// Première, qui a son propre programme, ne bouge pas.
//
// CONVENTION DE LA MAISON : le code est cité en EXEMPLE, jamais en énoncé, et
// toujours en français dans la formulation de la question. Les fiches ne portent
// aucun bloc de code délimité par des accents graves — le contenu des cours est
// écrit dans des littéraux de gabarit JavaScript, où l'accent grave fermerait la
// chaîne. Les extraits sont donc donnés en ligne, en gras.
//
// ⚠️ POURQUOI AUCUN EXTRAIT SQL N'EST ÉCRIT SOUS SA FORME EXÉCUTABLE.
// Le 20/08/2026, la migration 254 a échoué dans l'éditeur SQL de Supabase sur
// « 42P01 : la relation eleve n'existe pas », alors que le fichier est
// irréprochable — vérifié par node _ASSOCIE/verifie-chaines.mjs, qui le découpe
// selon les règles de Postgres : 12 instructions, zéro « eleve » hors chaîne,
// aucun « -- », « /* » ni « $$ » dans le contenu.
// Ce module était le SEUL du dépôt dont les cours citaient de vraies requêtes en
// début de ligne, point-virgule compris. Il suffit qu'un maillon de la chaîne
// (l'éditeur, le presse-papiers, un formateur) rompe la chaîne SQL qui porte le
// cours pour que ces lignes deviennent des instructions RÉELLES — et comme elles
// sont syntaxiquement valides, l'erreur ne parle pas de la vraie cause : elle
// parle d'une table « eleve » qui n'a jamais eu à exister.
// Les extraits sont donc écrits mot-clé par mot-clé EN GRAS (**SELECT** nom
// **FROM** eleve …) et SANS point-virgule. L'élève lit exactement la même
// requête ; aucune ligne du contenu ne commence plus par un mot-clé SQL nu, et
// une rupture de chaîne ne peut plus produire qu'une erreur de syntaxe — laquelle
// désigne au moins le bon endroit.
// Bonne nouvelle au passage : l'éditeur Supabase joue le script dans une
// TRANSACTION. L'échec du 20/08 n'a rien appliqué, la matière n'a jamais été
// laissée à moitié vidée.

export default {
  slug: 'nsi',
  nom: 'NSI',

  titreMigration: 'NSI Tle (spécialité) — LE PROGRAMME OFFICIEL (20 fiches)',

  motif: `CONSTAT MESURÉ (node _ASSOCIE/sonde-chapitres.mjs Tle nsi, 20/08/2026) :
la spécialité NSI de Terminale n'avait que QUATRE chapitres, taillés dans un
découpage maison hérité des migrations 008 et 146 (« Structures de données »,
« Bases de données et SQL », « Réseaux et protocoles », « Algorithmique : les
graphes »), chacun résumant un pan entier du programme en UNE fiche de dix
questions. Des parties entières du BO n'avaient AUCUNE entrée : tout le génie
logiciel (paradigmes de programmation, modularité, tests, mise au point), la
programmation orientée objet, les arbres, la programmation dynamique, la
recherche de sous-chaîne, la modélisation d'une base de données et le rôle d'un
SGBD. Sur une spécialité à coefficient 16, dont l'épreuve écrite dure 3 h 30 et
comporte une partie pratique, l'élève ne trouvait rien sur les trois quarts de
son année.

Cette migration installe les 20 fiches du programme, rangées sous ses 5
chapitres, et retire les 4 fiches composites qu'elles recouvrent.

PÉRIMÈTRE : la TERMINALE SEULE. La Première garde ses fiches : le ménage est
borné au niveau Tle.

⚠️ CE QUI EST PERDU AU PASSAGE : les 4 leçons « Exercices types » de la 146
(elles n'ont aucun quiz en base, sondé le 20/08/2026) et les 40 questions des 4
leçons « L'essentiel du cours ».

⚠️ LES MIGRATIONS 008 ET 146 SONT REJOUABLES : les recoller un jour ferait
revenir les 4 fiches composites en doublon des 20 fiches du programme.

⚠️ LES EXTRAITS SQL DES COURS SONT ÉCRITS EN GRAS ET SANS POINT-VIRGULE, à
dessein. Le 20/08/2026, une première version de cette migration a échoué dans
l'éditeur SQL de Supabase sur « 42P01 : la relation eleve n'existe pas », alors
que le fichier était sain — vérifié par node _ASSOCIE/verifie-chaines.mjs, qui le
découpe selon les règles de Postgres : 12 instructions, zéro « eleve » hors
chaîne. Ce module est le seul du dépôt dont les cours citent de vraies requêtes ;
écrites en début de ligne avec leur point-virgule, il suffit qu'un maillon de la
chaîne rompe le littéral qui porte le cours pour qu'elles deviennent des
instructions réelles — et comme elles sont valides, l'erreur désigne une table
fantôme au lieu de la vraie cause. En gras et sans point-virgule, l'élève lit la
même requête et le fichier n'a plus de prise.
L'éditeur Supabase joue le script dans une TRANSACTION : un échec n'applique
rien, la matière n'est jamais laissée à moitié vidée.`,

  menage: [
    {
      raison: `La colonne chapters.theme (migration 234) conditionne tout ce qui suit :
ce module range ses 20 fiches sous 5 chapitres, et l'INSERT écrit la colonne.
Elle est REPRISE ici en ADD COLUMN IF NOT EXISTS parce que la 234 n'a jamais été
exécutée en production (sondé le 20/08/2026) — sans cette reprise, la migration
échouerait sur "column chapters.theme does not exist", les 4 anciennes fiches
déjà supprimées et les 20 neuves pas encore posées : une matière vide.
Le GRANT n'est pas décoratif : la migration 182 a révoqué le SELECT de table sur
chapters (pour cacher mind_map) et ne l'a rendu que colonne par colonne. Une
colonne ajoutée après elle n'hérite d'aucun droit — sans lui, l'app lirait
"permission denied" au lieu du chapitre.`,
      sql: `ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;`,
    },
    {
      raison: `Les 4 fiches composites partent, au niveau Tle SEULEMENT. Ce sont des
résumés que les 20 fiches neuves recouvrent : « Structures de données » se lit
désormais en les quatre fiches du chapitre 2, « Bases de données et SQL » en les
cinq du chapitre 3, « Réseaux et protocoles » en les deux du chapitre 1, et
« Algorithmique : les graphes » en « Graphes abstraits » plus les quatre fiches
du chapitre 5.
⚠️ CE MÉNAGE EST INDISPENSABLE, pas seulement souhaitable : le chapitre neuf
« Structures de données » porte EXACTEMENT le titre d'un chapitre existant, et
chapters est UNIQUE(subject_id, level, title). Sans suppression préalable,
l'INSERT tomberait dans son ON CONFLICT DO NOTHING, le chapitre neuf ne serait
pas créé, et ses quatre leçons échoueraient sur une clé étrangère absente : la
migration s'arrêterait à mi-parcours.
L'ordre compte : la file « À revoir » d'abord (review_items.item_id n'a PAS de
clé étrangère), puis les quiz (quizzes.lesson_id est ON DELETE SET NULL : ils
survivraient orphelins), puis les chapitres, dont les leçons partent en cascade.
Les trois DELETE sont bornés aux QUATRE TITRES EXACTS et au seul niveau Tle. Sans
cette borne, un rejeu effacerait les quiz des 20 fiches neuves — le ménage tourne
avant les insertions à CHAQUE passage.`,
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
   AND c.level = 'Tle'
   AND c.title IN ('Structures de données',
                   'Bases de données et SQL',
                   'Réseaux et protocoles',
                   'Algorithmique : les graphes');

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'nsi'
   AND c.level = 'Tle'
   AND c.title IN ('Structures de données',
                   'Bases de données et SQL',
                   'Réseaux et protocoles',
                   'Algorithmique : les graphes');

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'nsi'
   AND c.level = 'Tle'
   AND c.title IN ('Structures de données',
                   'Bases de données et SQL',
                   'Réseaux et protocoles',
                   'Algorithmique : les graphes');`,
    },
  ],

  blocs: [
    {
      niveaux: ['Tle'],
      chapitres: [
        // ---- Chapitre 1 : Appareils en réseaux -------------------------------
        {
          titre: 'Matériels, systèmes et logiciels',
          axe: 'Appareils en réseaux',
          lecon: {
            titre: 'Ce qui se passe entre le clic et l’écran',
            cours: `Un appareil connecté superpose plusieurs couches : du circuit électronique jusqu’à l’application, **chacune ne connaît que sa voisine immédiate**.

## Le matériel
| Élément | Son rôle |
| Le **processeur** | Il exécute les instructions |
| La **mémoire vive** | Ce qui est en cours d’exécution — elle **disparaît** à l’extinction |
| Le **stockage** | Il conserve les données de façon persistante |
| Les **périphériques** | Les entrées-sorties |

Sur un objet connecté, tout cela tient dans un **système sur puce**.

## Les quatre fonctions du système d’exploitation
| Fonction | Ce qu’elle fait |
| **Ordonnancer** | Donner à chaque processus son tour de processeur — d’où l’illusion du parallélisme |
| **Gérer la mémoire** | Allouer, libérer, **isoler** les processus les uns des autres |
| **Gérer les fichiers** | L’arborescence et son accès |
| **Gérer les droits** | Chaque fichier a un propriétaire et des permissions : lecture, écriture, exécution |

Un **processus** est un programme en cours d’exécution, avec son espace mémoire propre.

> Deux processus qui s’attendent mutuellement produisent un **interblocage** : chacun détient la ressource que l’autre demande.

## Le modèle TCP/IP en quatre couches
| Couche | Ce dont elle s’occupe | Exemples |
| 4. **Application** | Le service rendu | HTTP, DNS, SMTP |
| 3. **Transport** | La remise entre applications | TCP, UDP |
| 2. **Internet** | L’**adressage** et le **routage** | IP |
| 1. **Accès réseau** | La transmission physique et locale | Ethernet, Wi-Fi |

Chaque couche **encapsule** les données de la couche supérieure en y ajoutant son en-tête. À l’arrivée, on retire les en-têtes dans l’ordre inverse.

## Le routage
Internet transporte des **paquets indépendants**, chacun trouvant sa route de proche en proche. Les routeurs consultent une table et transmettent au voisin le plus proche de la destination.

| Protocole | Son critère | Sa limite |
| **RIP** | Le plus petit **nombre de sauts** | Plafond de 15 sauts, **aveugle au débit** |
| **OSPF** | Un **coût** par lien, plus court chemin par **Dijkstra** | Plus efficace, plus complexe |

## TCP ou UDP
| | **TCP** | **UDP** |
| La connexion | Établie | Aucune |
| Les pertes | Détectées et **retransmises** | Ignorées |
| L’ordre | Rétabli | Non garanti |
| L’usage | Web, courriel, transfert | Direct vidéo, jeu en ligne |

> Le protocole ne décide pas de ce qu’on transporte, mais de **ce qui se passe quand un paquet se perd**. C’est la seule différence qui compte pour choisir.`,
          },
          questions: [
            ['Combien de couches compte le modèle TCP/IP ?', ['Quatre', 'Sept', 'Trois', 'Cinq'], 0, 'Accès réseau, Internet, transport et application. Le modèle OSI, lui, en compte sept.'],
            ['Quelle est la différence essentielle entre TCP et UDP ?', ['TCP garantit la remise et l’ordre des données, UDP non', 'TCP est plus rapide qu’UDP', 'UDP chiffre les données', 'TCP ne fonctionne que sur Wi-Fi'], 0, 'UDP convient au direct vidéo, où une donnée en retard ne sert plus à rien.'],
            ['Quel algorithme le protocole OSPF utilise-t-il ?', ['L’algorithme de Dijkstra', 'L’algorithme de Bellman-Ford', 'Le tri rapide', 'La recherche dichotomique'], 0, 'Il calcule le plus court chemin en tenant compte du coût des liens.'],
            ['Quelle est la limite du nombre de sauts dans le protocole RIP ?', ['15', '32', '64', 'Il n’y en a pas'], 0, 'Au-delà, la destination est considérée comme inaccessible.'],
            ['Qu’est-ce qu’un interblocage entre deux processus ?', ['Chacun détient la ressource que l’autre attend', 'Un processus consomme tout le processeur', 'Un processus écrase la mémoire d’un autre', 'Un processus se termine sans libérer la mémoire'], 0, 'Aucun des deux ne peut avancer : le système est bloqué.'],
            ['Un processus est un programme en cours d’exécution.', ['Vrai', 'Faux'], 0, 'Il dispose de son propre espace mémoire, isolé des autres par le système.'],
            ['Que fait une couche du modèle TCP/IP aux données qu’elle reçoit de la couche supérieure ?', ['Elle les encapsule en y ajoutant son en-tête', 'Elle les chiffre systématiquement', 'Elle les compresse', 'Elle les supprime après envoi'], 0, 'À l’arrivée, les en-têtes sont retirés dans l’ordre inverse.'],
            ['Le protocole RIP tient compte du débit des liens.', ['Vrai', 'Faux'], 1, 'Il ne compte que les sauts : c’est justement ce qu’OSPF corrige.'],
          ],
        },
        {
          titre: 'Sécurité des réseaux',
          axe: 'Appareils en réseaux',
          lecon: {
            titre: 'Chiffrer, signer, authentifier',
            cours: `La sécurité d’un échange repose sur **trois garanties distinctes**, qu’il ne faut jamais confondre.

## Les trois garanties
| Garantie | Ce qu’elle promet | Ce qui l’assure |
| **Confidentialité** | Personne d’autre ne lit | Le chiffrement |
| **Intégrité** | Rien n’a été modifié | Le hachage |
| **Authenticité** | L’interlocuteur est bien celui qu’il prétend | La signature et le certificat |

## Symétrique ou asymétrique
| | **Symétrique** (AES) | **Asymétrique** (RSA) |
| Les clés | **Une seule**, partagée | Une **paire** : publique et privée |
| La vitesse | Rapide, adapté aux gros volumes | Bien plus lent |
| Le problème | Comment **transmettre la clé** sans qu’elle soit interceptée | Résolu : la clé publique se diffuse |

> D’où l’usage réel : l’asymétrique sert à **échanger une clé de session** symétrique, et tout le reste de la communication est symétrique. C’est exactement ce que fait **HTTPS** à chaque connexion.

## Chiffrer ou signer — le point à ne pas rater
| L’émetteur utilise… | Le résultat |
| La **clé publique** du destinataire | **Confidentialité** : lui seul peut déchiffrer |
| Sa propre **clé privée** | **Signature** : tous vérifient l’origine et l’intégrité |

La signature ne protège rien du regard : elle **prouve** qui a écrit.

## Les fonctions de hachage
SHA-256 transforme un message de taille quelconque en une **empreinte de taille fixe**.

| Propriété | Sa conséquence |
| **À sens unique** | Impossible de remonter au message |
| **Effet d’avalanche** | La moindre modification change **entièrement** l’empreinte |

Elle sert à vérifier l’intégrité et à stocker les mots de passe — jamais en clair, et toujours avec un **sel** aléatoire pour empêcher les attaques par dictionnaire précalculé.

## Certificats et autorités
Rien n’empêche un attaquant de publier une clé publique en se faisant passer pour un autre. Un **certificat** lie une clé publique à une identité, et il est **signé** par une **autorité de certification** en laquelle le navigateur a confiance.

> Le cadenas de la barre d’adresse ne dit qu’une chose : la chaîne de certificats **remonte à une autorité connue**.

## Les attaques au programme
| Attaque | Son principe |
| L’**homme du milieu** | L’attaquant s’intercale et relaie les messages en les lisant |
| L’**hameçonnage** | Obtenir des identifiants par une fausse page |
| Le **déni de service distribué** | Saturer un serveur de requêtes |
| L’**injection SQL** | Détourner une requête par les données saisies |
| Les **rançongiciels** | Chiffrer les données de la victime |

## Les protections
Pare-feu (filtrage des ports), VPN (tunnel chiffré), segmentation du réseau, mises à jour, authentification à plusieurs facteurs.

> Le maillon le plus faible reste l’utilisateur : la majorité des intrusions commencent par un **courriel**.`,
          },
          questions: [
            ['Dans un chiffrement asymétrique, quelle clé sert à chiffrer un message destiné à quelqu’un ?', ['Sa clé publique', 'Sa clé privée', 'Une clé partagée à l’avance', 'La clé du serveur'], 0, 'Seule sa clé privée permettra ensuite de le déchiffrer.'],
            ['Pourquoi HTTPS combine-t-il chiffrement asymétrique et symétrique ?', ['L’asymétrique sert à échanger une clé de session, le symétrique à chiffrer les échanges', 'Pour doubler la sécurité', 'Parce que le symétrique n’est pas sûr', 'Pour compresser les données'], 0, 'L’asymétrique est bien plus lent : on ne l’emploie que pour la mise en place.'],
            ['Qu’est-ce qu’une fonction de hachage ?', ['Une fonction à sens unique produisant une empreinte de taille fixe', 'Un algorithme de chiffrement réversible', 'Un protocole de transport', 'Une méthode de compression'], 0, 'La moindre modification du message change entièrement l’empreinte.'],
            ['Un mot de passe doit être stocké chiffré et déchiffrable par le serveur.', ['Vrai', 'Faux'], 1, 'Il est stocké sous forme d’empreinte, salée : le serveur n’a pas besoin de le retrouver.'],
            ['Que garantit une signature numérique ?', ['L’origine et l’intégrité du message', 'La confidentialité du message', 'La rapidité de transmission', 'L’anonymat de l’émetteur'], 0, 'L’émetteur chiffre l’empreinte avec sa clé privée : chacun peut vérifier avec la publique.'],
            ['À quoi sert une autorité de certification ?', ['À signer un certificat liant une clé publique à une identité', 'À chiffrer les communications', 'À filtrer les ports réseau', 'À stocker les mots de passe'], 0, 'Sans elle, rien n’empêcherait un attaquant de publier une clé au nom d’un autre.'],
            ['En quoi consiste une attaque de l’homme du milieu ?', ['L’attaquant s’intercale entre deux interlocuteurs et relaie leurs messages', 'Il sature le serveur de requêtes', 'Il devine le mot de passe par force brute', 'Il chiffre les données de la victime'], 0, 'Le certificat sert précisément à la rendre détectable.'],
            ['À quoi sert le sel ajouté avant le hachage d’un mot de passe ?', ['À empêcher les attaques par dictionnaire précalculé', 'À rendre le hachage réversible', 'À raccourcir l’empreinte', 'À chiffrer la base de données'], 0, 'Deux mots de passe identiques donnent alors deux empreintes différentes.'],
          ],
        },
        // ---- Chapitre 2 : Structures de données ------------------------------
        {
          titre: 'Conteneurs de données',
          axe: 'Structures de données',
          lecon: {
            titre: 'Choisir la bonne boîte pour la bonne opération',
            cours: `Une structure de données se choisit d’après les **opérations** qu’on va lui demander, jamais d’après ce qu’elle contient.

## Type abstrait et implémentation
| | **Type abstrait** | **Implémentation** |
| Il définit | Un jeu d’**opérations** et leur comportement | La façon dont la promesse est tenue |
| Exemple | Une **pile** promet d’empiler, dépiler, tester le vide | Un tableau ou une liste chaînée |
| Qui le voit | L’utilisateur | Seulement l’auteur de la structure |

C’est le principe d’**encapsulation** appliqué aux données.

## Pile et file
| | **Pile** (LIFO) | **File** (FIFO) |
| La règle | Dernier entré, **premier sorti** | Premier entré, **premier sorti** |
| Les opérations | empiler, dépiler, sommet, est_vide | enfiler, défiler, est_vide |
| Les usages | Parenthésage, historique, **pile d’appels** d’un programme récursif | File d’attente, tampon d’impression, **parcours en largeur** |

## Tableau ou liste chaînée — l’arbitrage
| Opération | **Tableau** (liste Python) | **Liste chaînée** |
| Accès au i-ième élément | **Constant** | **Linéaire** : il faut parcourir |
| Insertion en tête | Coûteuse : tout décaler | **Constante** |

Dans une liste chaînée, chaque **maillon** contient une valeur et une **référence vers le suivant**.

## Le dictionnaire
Il associe une **clé** à une **valeur**. Grâce au **hachage**, recherche, insertion et suppression se font en temps **constant en moyenne**.

> C’est la structure à choisir dès qu’on cherche « la valeur **associée à** » plutôt que « le **i-ième** élément ».

## Le tableau de décision
| Ce dont le programme a besoin | La structure |
| Beaucoup d’accès par indice | Le **tableau** |
| Insertions et suppressions aux extrémités | **Liste chaînée**, **pile** ou **file** |
| Recherche par identifiant | Le **dictionnaire** |
| Une relation **hiérarchique** | L’**arbre** |
| Une relation quelconque | Le **graphe** |

> Une structure mal choisie ne rend pas un programme faux : elle le rend **lent** — et sur des données réelles, c’est la même chose.`,
          },
          questions: [
            ['Qu’est-ce qu’un type abstrait de données ?', ['Un jeu d’opérations défini indépendamment de son implémentation', 'Une classe Python sans attribut', 'Un tableau de taille variable', 'Une donnée non typée'], 0, 'C’est le principe d’encapsulation appliqué aux structures de données.'],
            ['Quelle structure fonctionne en « dernier entré, premier sorti » ?', ['La pile', 'La file', 'Le dictionnaire', 'L’arbre'], 0, 'La file, elle, est « premier entré, premier sorti ».'],
            ['Quelle structure est utilisée pour un parcours en largeur ?', ['La file', 'La pile', 'Le dictionnaire', 'Le tableau trié'], 0, 'Le parcours en profondeur, lui, s’appuie sur une pile.'],
            ['Quel est le coût d’accès au i-ième élément d’une liste chaînée ?', ['Linéaire : il faut parcourir la chaîne', 'Constant', 'Logarithmique', 'Quadratique'], 0, 'C’est l’inverse du tableau, qui offre un accès direct.'],
            ['Quel est le coût moyen d’une recherche dans un dictionnaire ?', ['Constant', 'Linéaire', 'Logarithmique', 'Quadratique'], 0, 'Grâce au hachage de la clé.'],
            ['Insérer un élément en tête d’une liste chaînée coûte un temps constant.', ['Vrai', 'Faux'], 0, 'Il suffit de créer un maillon et de le faire pointer vers l’ancienne tête.'],
            ['Quelle structure choisir pour retrouver une valeur à partir d’un identifiant ?', ['Le dictionnaire', 'La pile', 'La file', 'La liste chaînée'], 0, 'C’est exactement ce que le type associatif est fait pour faire.'],
            ['La pile d’appels d’un programme récursif est une file.', ['Vrai', 'Faux'], 1, 'C’est une pile : le dernier appel ouvert est le premier à se terminer.'],
          ],
        },
        {
          titre: 'Programmation orientée objet',
          axe: 'Structures de données',
          lecon: {
            titre: 'Ranger les données avec ce qui sait les manipuler',
            cours: `La programmation orientée objet regroupe dans une même entité les **données** et les **opérations** qui les concernent. C’est d’abord une façon d’**organiser** un programme.

## Classe et instance
| | **Classe** | **Instance** |
| Ce que c’est | Un **modèle** | Un objet construit sur ce modèle |
| Ce qu’elle décrit | Des **attributs** (données) et des **méthodes** (fonctions) | Des valeurs concrètes |
| Exemple | Ce qu’est un compte bancaire | **Mon** compte |

## Le constructeur et self
La méthode spéciale d’initialisation est appelée à la création de l’objet. Le paramètre **self** désigne l’instance en cours : il permet à une méthode de lire et modifier les attributs de l’objet sur lequel elle est appelée.

> Écrire un attribut **sans self**, c’est créer une variable **locale** qui disparaîtra à la fin de la méthode. C’est l’erreur la plus fréquente du chapitre.

## Où vit l’attribut
| Type d’attribut | À qui il appartient |
| D’**instance** | À **un** objet |
| De **classe** | Partagé par **tous** les objets : un compteur d’instances, une constante |

## L’encapsulation
Les attributs ne devraient pas être manipulés directement de l’extérieur : on passe par des **méthodes d’accès** et de **modification**, qui peuvent **vérifier la validité** de ce qu’on écrit.

Python ne l’impose pas : un attribut préfixé d’un souligné signale par **convention** qu’il est interne. La discipline vient du programmeur, pas du langage.

> L’intérêt : on peut **changer la représentation interne** d’une classe sans casser le code qui l’utilise, tant que les méthodes gardent le même comportement. C’est ce qui rend un programme modifiable.

## Héritage ou composition
| Relation | Le mécanisme | L’exemple |
| « **est un** » | L’**héritage** : la classe reprend attributs et méthodes, en ajoute, en **redéfinit** | Un compte épargne **est un** compte |
| « **a un** » | La **composition** : un attribut qui est lui-même un objet | Une voiture **a un** moteur |

## Le polymorphisme
Deux classes différentes peuvent proposer une méthode de **même nom**, chacune avec son propre code. Le même appel produit alors un comportement adapté au **type réel** de l’objet, sans que l’appelant ait besoin de le savoir.

> C’est ce qui permet d’écrire un traitement **unique** pour une collection d’objets hétérogènes.

## Le lien avec les structures de données
La POO est la façon naturelle d’implémenter un type abstrait : une classe Pile expose empiler et dépiler, et **cache** le tableau ou la liste chaînée qui les réalise.

> Une classe bien conçue se juge à ce qu’elle **cache**, pas à ce qu’elle expose.`,
          },
          questions: [
            ['Quelle est la différence entre une classe et une instance ?', ['La classe est le modèle, l’instance un objet construit sur ce modèle', 'La classe contient les données, l’instance les méthodes', 'Il n’y a aucune différence', 'L’instance est une classe sans méthode'], 0, 'La classe Compte décrit ce qu’est un compte ; mon compte est une instance.'],
            ['À quoi sert le paramètre self dans une méthode Python ?', ['Il désigne l’instance sur laquelle la méthode est appelée', 'Il représente la classe elle-même', 'Il déclare une variable globale', 'Il est purement décoratif'], 0, 'Sans lui, on crée une variable locale qui disparaît à la fin de la méthode.'],
            ['Quelle méthode spéciale Python est appelée à la création d’un objet ?', ['__init__', '__new__', '__str__', '__call__'], 0, 'C’est le constructeur : il initialise les attributs de l’instance.'],
            ['Qu’apporte l’encapsulation ?', ['La possibilité de changer la représentation interne sans casser le code utilisateur', 'Un gain de vitesse d’exécution', 'La réduction de la taille du programme', 'La suppression des erreurs de syntaxe'], 0, 'C’est ce qui rend un programme modifiable dans la durée.'],
            ['Quelle relation l’héritage exprime-t-il ?', ['Une relation « est un »', 'Une relation « a un »', 'Une relation « contient »', 'Une relation « utilise »'], 0, 'Pour « a un », il faut préférer la composition.'],
            ['En Python, un attribut préfixé d’un souligné est inaccessible de l’extérieur.', ['Vrai', 'Faux'], 1, 'C’est une convention, pas une contrainte : le langage ne l’interdit pas.'],
            ['Qu’est-ce que le polymorphisme ?', ['Une même méthode se comporte différemment selon le type réel de l’objet', 'Une classe qui hérite de plusieurs classes', 'Un attribut de plusieurs types', 'Une fonction à nombre variable d’arguments'], 0, 'Il permet un traitement unique sur une collection d’objets hétérogènes.'],
            ['Un attribut de classe est partagé par toutes les instances.', ['Vrai', 'Faux'], 0, 'Contrairement à l’attribut d’instance, propre à chaque objet.'],
          ],
        },
        {
          titre: 'Arbres et structure de données',
          axe: 'Structures de données',
          lecon: {
            titre: 'Diviser l’ensemble à chaque nœud',
            cours: `Un **arbre** organise des données par une relation hiérarchique. Sa force : à chaque nœud, on **écarte** une partie de l’ensemble sans l’examiner.

## Le vocabulaire
| Terme | Sa définition |
| La **racine** | L’unique nœud sans parent |
| Une **feuille** | Un nœud sans enfant |
| La **taille** | Le nombre de nœuds |
| La **hauteur** | Le plus long chemin racine-feuille — 0 pour un arbre réduit à sa racine, −1 pour un arbre vide |
| Un **sous-arbre** | Un nœud et toute sa descendance |

## L’arbre binaire
Chaque nœud a **au plus deux** enfants.

| Relation | Ce qu’elle dit |
| Un arbre de hauteur h contient au plus **2^(h+1) − 1** nœuds | La croissance est exponentielle en hauteur |
| Un arbre à n nœuds a une hauteur d’au moins **log₂(n)** | C’est la borne qui fonde toute l’efficacité des arbres |

Sa définition est naturellement **récursive** : un arbre binaire est soit **vide**, soit un nœud portant une valeur et **deux** arbres binaires.

## L’arbre binaire de recherche
Contrainte d’ordre : pour tout nœud, **toutes** les valeurs du sous-arbre gauche lui sont inférieures, **toutes** celles du sous-arbre droit lui sont supérieures.

Rechercher revient à descendre : comparer, choisir un côté, recommencer.

| L’arbre est… | Sa hauteur | Le coût d’une recherche |
| **Équilibré** | environ log₂(n) | **Logarithmique** |
| Dégénéré en **peigne** (valeurs insérées déjà triées) | **n** | **Linéaire** — tout l’intérêt disparaît |

> C’est le piège classique du chapitre, et la raison d’être des arbres équilibrés.

## Les quatre parcours
| Parcours | L’ordre | Son usage |
| **Infixe** | gauche, nœud, droite | Sur un ABR, il produit les valeurs **triées** |
| **Préfixe** | nœud, gauche, droite | Copier ou sérialiser un arbre |
| **Suffixe** | gauche, droite, nœud | Libérer, ou évaluer une expression |
| **En largeur** | Niveau par niveau | Il utilise une **file** |

Les trois premiers s’écrivent naturellement de façon **récursive** ; le dernier est **itératif**.

## À quoi servent les arbres
Systèmes de fichiers, arborescence d’un document, arbres de décision en apprentissage automatique, index de bases de données, compression de Huffman, arbres syntaxiques d’un compilateur.

> Retenir la chaîne : **hauteur logarithmique → recherche logarithmique**.`,
          },
          questions: [
            ['Qu’est-ce que la hauteur d’un arbre ?', ['La longueur du plus long chemin de la racine à une feuille', 'Le nombre total de nœuds', 'Le nombre de feuilles', 'Le nombre d’enfants de la racine'], 0, 'La taille, elle, compte les nœuds.'],
            ['Quelle propriété définit un arbre binaire de recherche ?', ['Tout le sous-arbre gauche est inférieur au nœud, tout le sous-arbre droit lui est supérieur', 'Chaque nœud a exactement deux enfants', 'Toutes les feuilles sont au même niveau', 'Les valeurs sont stockées dans les feuilles'], 0, 'C’est cette contrainte d’ordre qui permet la recherche par descente.'],
            ['Quel parcours d’un ABR produit les valeurs triées ?', ['Le parcours infixe', 'Le parcours préfixe', 'Le parcours suffixe', 'Le parcours en largeur'], 0, 'Gauche, nœud, droite : c’est la propriété la plus utile de cette structure.'],
            ['Quelle structure utilise-t-on pour un parcours en largeur d’un arbre ?', ['Une file', 'Une pile', 'Un dictionnaire', 'Un arbre auxiliaire'], 0, 'C’est le seul des quatre parcours qui ne s’écrit pas naturellement de façon récursive.'],
            ['Que se passe-t-il si l’on insère des valeurs déjà triées dans un ABR ?', ['L’arbre dégénère en peigne et la recherche redevient linéaire', 'L’arbre reste parfaitement équilibré', 'L’insertion échoue', 'L’arbre se réorganise automatiquement'], 0, 'C’est la raison d’être des arbres équilibrés.'],
            ['Un arbre binaire de hauteur h contient au plus 2^(h+1) − 1 nœuds.', ['Vrai', 'Faux'], 0, 'Inversement, un arbre à n nœuds a une hauteur d’au moins log₂(n).'],
            ['La définition d’un arbre binaire est naturellement récursive.', ['Vrai', 'Faux'], 0, 'Soit vide, soit un nœud portant une valeur et deux arbres binaires.'],
            ['Quel est le coût d’une recherche dans un ABR équilibré à n nœuds ?', ['Logarithmique en n', 'Linéaire en n', 'Constant', 'Quadratique en n'], 0, 'Le coût est proportionnel à la hauteur, qui vaut environ log₂(n).'],
          ],
        },
        {
          titre: 'Graphes abstraits',
          axe: 'Structures de données',
          lecon: {
            titre: 'Modéliser une relation quelconque',
            cours: `Un **graphe** décrit des objets — les **sommets** — reliés par des **arêtes**. Contrairement à l’arbre, aucune hiérarchie n’est imposée et les **cycles** sont permis.

## Le vocabulaire
| Terme | Sa définition |
| **Orienté** ou non | Selon que la relation a un sens : « suit » contre « est ami avec » |
| **Pondéré** | Chaque arête porte une valeur : distance, coût, débit |
| Le **degré** | Le nombre de voisins d’un sommet |
| Un **chemin**, un **cycle** | Une suite d’arêtes ; un chemin qui revient à son départ |
| **Connexe** | Tout sommet est atteignable depuis tout autre |

## Les deux représentations
| | **Matrice d’adjacence** | **Liste d’adjacence** |
| La forme | Un tableau n × n, la case (i, j) vaut 1 s’il y a une arête | À chaque sommet, la liste de ses voisins |
| Test d’adjacence | **Constant** | Plus coûteux |
| Mémoire | En **n²** | Proportionnelle au nombre d’**arêtes** |
| Quand la choisir | Graphe **dense** et petit | Graphe **grand et creux** — presque tous les graphes réels |

## Les deux parcours
| | **En largeur** (BFS) | **En profondeur** (DFS) |
| La structure | Une **file** | Une **pile**, ou la récursivité |
| Sa marche | Tous les voisins avant d’aller plus loin | S’enfoncer au plus loin, puis revenir |
| Son usage | Le **plus court chemin** en nombre d’arêtes, sur graphe **non pondéré** | Détecter les **cycles**, les composantes connexes, le tri topologique |

> Dans les deux cas, il faut **marquer les sommets visités**. Sans cela, le moindre cycle fait boucler le programme indéfiniment — l’erreur la plus fréquente à l’écrit.

## Le plus court chemin pondéré
BFS ne suffit plus dès que les arêtes portent des poids. **Dijkstra** choisit à chaque étape le sommet non traité **le plus proche** — à condition que tous les poids soient **positifs**.

> C’est l’algorithme du GPS et du protocole de routage OSPF.

## Les usages
Réseaux sociaux, cartographie et itinéraires, routage réseau, ordonnancement de tâches, moteurs de recherche, résolution de jeux.

> Le choix de la **représentation** décide de la complexité du programme **avant** que le premier algorithme soit écrit.`,
          },
          questions: [
            ['Quelle représentation d’un graphe convient à un grand graphe creux ?', ['La liste d’adjacence', 'La matrice d’adjacence', 'Un arbre binaire', 'Un dictionnaire de matrices'], 0, 'La matrice occupe une mémoire en n² quel que soit le nombre d’arêtes.'],
            ['Quel parcours donne le plus court chemin dans un graphe non pondéré ?', ['Le parcours en largeur', 'Le parcours en profondeur', 'Le parcours infixe', 'L’algorithme de Dijkstra'], 0, 'Il visite tous les voisins avant d’aller plus loin.'],
            ['Quelle structure le parcours en profondeur utilise-t-il ?', ['Une pile, ou la récursivité', 'Une file', 'Un dictionnaire', 'Une matrice'], 0, 'Le parcours en largeur, lui, utilise une file.'],
            ['Pourquoi faut-il marquer les sommets visités lors d’un parcours de graphe ?', ['Sans cela, un cycle fait boucler le programme indéfiniment', 'Pour accélérer le calcul', 'Pour économiser la mémoire', 'Pour respecter l’ordre alphabétique'], 0, 'C’est l’erreur la plus fréquente à l’écrit.'],
            ['Quelle condition l’algorithme de Dijkstra impose-t-il ?', ['Des poids d’arêtes positifs', 'Un graphe non orienté', 'Un graphe sans cycle', 'Un graphe connexe'], 0, 'Il choisit à chaque étape le sommet non traité le plus proche.'],
            ['Un graphe connexe est un graphe où tout sommet est atteignable depuis tout autre.', ['Vrai', 'Faux'], 0, 'Le parcours en profondeur permet de repérer les composantes connexes.'],
            ['Quel est le degré d’un sommet ?', ['Son nombre de voisins', 'Sa distance à la racine', 'Le nombre de chemins qui le traversent', 'Le poids de ses arêtes'], 0, 'Dans un graphe orienté, on distingue degré entrant et degré sortant.'],
            ['Un arbre est un cas particulier de graphe.', ['Vrai', 'Faux'], 0, 'C’est un graphe connexe et sans cycle.'],
          ],
        },
        // ---- Chapitre 3 : Bases de données -----------------------------------
        {
          titre: 'Modélisation d’une base de données',
          axe: 'Bases de données',
          lecon: {
            titre: 'Décider de la forme avant d’écrire la première ligne',
            cours: `Avant toute requête, il faut décider **quelles tables** existent et **comment** elles se répondent. Une base mal modélisée produit des données fausses, quelle que soit la qualité du code au-dessus.

## Pourquoi pas un seul grand tableau
| Anomalie | Ce qu’elle produit |
| **Redondance** | La même information répétée à chaque ligne |
| Anomalie de **mise à jour** | Corriger une adresse oblige à la corriger **partout** ; un oubli rend la base incohérente |
| Anomalie d’**insertion** | On ne peut pas enregistrer un professeur qui n’a pas encore de classe |
| Anomalie de **suppression** | Effacer la dernière ligne d’un élève efface aussi les informations de sa classe |

## Le modèle relationnel
Proposé par **Codd** en **1970** : des **relations** — les tables — composées d’**attributs** (colonnes) et d’**enregistrements** (lignes). Chaque attribut a un **domaine**, le type de valeurs admissibles.

Le **schéma relationnel** énumère tables, attributs et contraintes. On l’écrit ainsi, le gras marquant la clé primaire et le dièse une clé étrangère :

eleve(**id**, nom, prenom, date_naissance, #classe_id)

## Les contraintes d’intégrité
| Contrainte | Ce qu’elle impose |
| **Clé primaire** | Elle identifie **de façon unique** chaque enregistrement : ni nulle, ni dupliquée |
| **Clé étrangère** | Elle **référence** la clé primaire d’une autre table — c’est elle qui relie |
| Intégrité **référentielle** | Une clé étrangère doit pointer vers un enregistrement **existant** |
| Contrainte de **domaine** | Une note comprise entre 0 et 20 |
| **Unicité** | Deux comptes ne partagent pas la même adresse électronique |

## Les relations entre tables
| Cardinalité | Comment on la réalise |
| **Un à plusieurs** | La clé étrangère se place du côté « **plusieurs** » : un élève porte l’identifiant de sa classe |
| **Plusieurs à plusieurs** | Elle **exige une table de jonction** portant les deux clés étrangères |
| **Un à un** | Rare, souvent réductible à une seule table |

> La table de jonction est le point le plus souvent manqué à l’écrit : un élève suit plusieurs matières **et** une matière est suivie par plusieurs élèves — aucune des deux tables ne peut porter la clé de l’autre.

> Modéliser, c’est décider où l’information est écrite **une seule fois**. Chaque duplication est une incohérence future.`,
          },
          questions: [
            ['Qu’est-ce qu’une clé primaire ?', ['Un attribut qui identifie de façon unique chaque enregistrement', 'Le premier attribut de la table', 'Un attribut qui référence une autre table', 'Un attribut obligatoirement numérique'], 0, 'Elle ne peut être ni nulle ni dupliquée.'],
            ['Qu’est-ce qu’une clé étrangère ?', ['Un attribut qui référence la clé primaire d’une autre table', 'Une clé venant d’une base externe', 'Un attribut chiffré', 'Un identifiant temporaire'], 0, 'C’est elle qui relie les tables entre elles.'],
            ['Comment représente-t-on une relation « plusieurs à plusieurs » ?', ['Par une table intermédiaire portant les deux clés étrangères', 'Par une clé étrangère dans chacune des deux tables', 'Par une seule table fusionnée', 'Ce n’est pas représentable'], 0, 'C’est le point le plus souvent manqué à l’écrit.'],
            ['Que garantit l’intégrité référentielle ?', ['Qu’une clé étrangère pointe vers un enregistrement existant', 'Que les données sont sauvegardées', 'Que la base est chiffrée', 'Que les requêtes sont rapides'], 0, 'Elle interdit d’inscrire un élève dans une classe inexistante.'],
            ['Quel problème une table unique et redondante provoque-t-elle ?', ['Des anomalies de mise à jour, d’insertion et de suppression', 'Une perte de performance uniquement', 'Une impossibilité de faire des requêtes', 'Un dépassement de mémoire'], 0, 'Une occurrence oubliée lors d’une correction rend la base incohérente.'],
            ['Qui a proposé le modèle relationnel ?', ['Codd, en 1970', 'Turing, en 1936', 'Von Neumann, en 1945', 'Berners-Lee, en 1989'], 0, 'Les tables y sont appelées relations, d’où le nom du modèle.'],
            ['Dans une relation « un à plusieurs », où se place la clé étrangère ?', ['Du côté « plusieurs »', 'Du côté « un »', 'Dans une table intermédiaire', 'Dans les deux tables'], 0, 'Chaque élève porte l’identifiant de sa classe, et non l’inverse.'],
            ['Une contrainte de domaine limite les valeurs admissibles d’un attribut.', ['Vrai', 'Faux'], 0, 'Une note comprise entre 0 et 20, par exemple.'],
          ],
        },
        {
          titre: 'Structure de base de données',
          axe: 'Bases de données',
          lecon: {
            titre: 'Du schéma aux tables réelles',
            cours: `Une fois le modèle décidé, il faut **créer** les tables, choisir les types, poser les contraintes — et savoir comment les données seront réellement rangées.

## Les types de données
| Type | Ce qu’il accueille |
| **INTEGER** | Les entiers |
| **REAL** (ou FLOAT) | Les décimaux |
| **TEXT** (ou VARCHAR) | Les chaînes |
| **DATE** | Les dates |
| **BOOLEAN** | Vrai ou faux |

> Le type est une **contrainte** : il interdit d’écrire une chaîne dans une colonne numérique, et il conditionne les opérations possibles. Additionner deux nombres stockés en TEXT n’a pas de sens.

## Créer une table
**CREATE TABLE** eleve (id **INTEGER PRIMARY KEY**, nom **TEXT NOT NULL**, classe_id **INTEGER REFERENCES** classe(id))

| Mot-clé | Ce qu’il impose |
| **PRIMARY KEY** | Identifiant unique, jamais nul |
| **NOT NULL** | La valeur est obligatoire |
| **UNIQUE** | Pas deux fois la même valeur |
| **DEFAULT** | Une valeur par défaut si rien n’est fourni |
| **CHECK** | Une condition à respecter |
| **REFERENCES** | Une clé étrangère vers une autre table |

## Le piège NULL
NULL n’est **ni zéro ni la chaîne vide** : c’est l’**absence** de valeur. Toute comparaison avec NULL renvoie « inconnu » — y compris NULL = NULL.

> On teste avec **IS NULL** et **IS NOT NULL**, **jamais** avec l’égalité. Piège récurrent des sujets.

## La normalisation
Décomposer les tables pour éliminer la redondance. Le programme s’en tient à l’essentiel : chaque information stockée **une seule fois**, chaque table décrivant **une seule entité**. Une table qui mêle élève et classe est à découper.

## Les index
Un **index** est une structure auxiliaire — souvent un arbre équilibré — qui accélère la recherche sur une colonne.

| Ce qu’il apporte | Ce qu’il coûte |
| La recherche passe d’un coût **linéaire** à **logarithmique** | De l’espace disque |
| — | Un **ralentissement des insertions** : l’index doit être tenu à jour |

> On indexe les colonnes **très souvent interrogées**, pas toutes. La clé primaire est indexée automatiquement.

## Les vues
Une **vue** est une requête enregistrée sous un nom, utilisable comme une table. Elle simplifie les requêtes complexes et **restreint l’accès** : on donne accès à une vue qui ne montre que certaines colonnes plutôt qu’à la table entière.

## Les droits
**GRANT** attribue un droit — SELECT, INSERT, UPDATE, DELETE — et **REVOKE** le retire. Le principe de **moindre privilège** s’applique : une application qui ne fait que lire ne doit disposer que du droit de lecture.

> Un schéma **sans contraintes** n’est pas un schéma : c’est un tableur. Ce sont les contraintes qui empêchent une base d’accumuler des données fausses.`,
          },
          questions: [
            ['Que signifie NULL dans une base de données ?', ['L’absence de valeur', 'La valeur zéro', 'Une chaîne vide', 'Une erreur de saisie'], 0, 'Toute comparaison avec NULL renvoie « inconnu », y compris NULL = NULL.'],
            ['Comment teste-t-on l’absence de valeur en SQL ?', ['Avec IS NULL', 'Avec = NULL', 'Avec == NULL', 'Avec NOT 0'], 0, 'L’égalité ne fonctionne jamais avec NULL : c’est un piège récurrent.'],
            ['À quoi sert un index sur une colonne ?', ['À accélérer les recherches sur cette colonne', 'À trier définitivement la table', 'À garantir l’unicité', 'À chiffrer la colonne'], 0, 'Il fait passer une recherche d’un coût linéaire à un coût logarithmique.'],
            ['Quel est le prix d’un index ?', ['De l’espace disque et un ralentissement des insertions', 'Une perte de précision des données', 'Une limitation du nombre de lignes', 'Une baisse de sécurité'], 0, 'On indexe les colonnes très souvent interrogées, pas toutes.'],
            ['Qu’est-ce qu’une vue ?', ['Une requête enregistrée sous un nom, utilisable comme une table', 'Une copie de sauvegarde', 'Un index particulier', 'Une interface graphique'], 0, 'Elle sert aussi à restreindre l’accès à certaines colonnes.'],
            ['Quelle commande SQL attribue un droit à un utilisateur ?', ['GRANT', 'ALLOW', 'PERMIT', 'SET'], 0, 'REVOKE retire un droit précédemment accordé.'],
            ['La clé primaire d’une table est indexée automatiquement.', ['Vrai', 'Faux'], 0, 'C’est ce qui rend la recherche par identifiant immédiate.'],
            ['Quel mot-clé SQL interdit qu’une colonne soit vide ?', ['NOT NULL', 'UNIQUE', 'CHECK', 'DEFAULT'], 0, 'UNIQUE interdit les doublons, CHECK impose une condition sur les valeurs.'],
          ],
        },
        {
          titre: 'Système de gestion de bases de données (SGBD)',
          axe: 'Bases de données',
          lecon: {
            titre: 'Le programme qui garde la base cohérente',
            cours: `Une base de données n’est pas un fichier : c’est un fichier **plus un programme** qui en contrôle tous les accès. Ce programme est le **SGBD**.

## Ce qu’il prend en charge
| Fonction | Ce qu’elle garantit |
| L’**exécution des requêtes** | Et leur optimisation : choisir le meilleur plan |
| Le **contrôle des accès concurrents** | Plusieurs clients écrivent sans se corrompre |
| La **gestion des droits** | Par utilisateur |
| La **persistance** | Et la reprise après panne |
| Le respect des **contraintes** | Qu’aucune application ne peut contourner |

> Le dernier point est décisif : une vérification placée dans le SGBD s’applique **à tous les clients**, présents et futurs.

## La transaction
Un ensemble d’opérations traitées comme un **tout indivisible**. L’exemple canonique est le virement : débiter un compte et créditer l’autre doivent réussir **ensemble** ou échouer ensemble.

On ouvre la transaction, puis on la valide par **COMMIT** ou on l’annule par **ROLLBACK**.

## Les propriétés ACID
| Propriété | Ce qu’elle promet |
| **Atomicité** | Tout ou rien |
| **Cohérence** | La base passe d’un état valide à un autre état valide |
| **Isolation** | Deux transactions simultanées se déroulent comme si elles étaient **successives** |
| **Durabilité** | Une transaction validée survit à une panne — c’est le rôle du **journal**, écrit **avant** les données |

## Les accès concurrents
Sans isolation, deux clients qui lisent puis modifient la même ligne peuvent **écraser mutuellement** leur travail. Le SGBD emploie des **verrous** ou un mécanisme de **versions**. Deux transactions qui s’attendent produisent un **interblocage**, que le SGBD détecte et résout en annulant l’une d’elles.

## L’architecture client-serveur
| Avantage | Contrepartie |
| Centralisation de la donnée | Le serveur est un **point de défaillance unique** |
| Un seul point de sauvegarde | Et une **cible** |
| Cohérence garantie, accès simultané de plusieurs applications | — |

## Quelques SGBD
| SGBD | Son profil |
| **PostgreSQL**, **MySQL** | Serveurs, multi-utilisateurs |
| **SQLite** | **Embarqué**, sans serveur : téléphones, navigateurs |
| **Oracle**, **SQL Server** | Propriétaires |
| Les bases **NoSQL** | Elles renoncent à une partie du modèle relationnel pour gagner en volume et en répartition |

> Une contrainte écrite dans l’**application** protège cette application. Une contrainte écrite dans le **SGBD** protège la base — donc toutes les applications, y compris celles que personne n’a encore écrites.`,
          },
          questions: [
            ['Qu’est-ce qu’une transaction ?', ['Un ensemble d’opérations traité comme un tout indivisible', 'Une requête de lecture', 'Un échange entre deux serveurs', 'Une sauvegarde périodique'], 0, 'Un virement doit débiter et créditer ensemble, ou ne rien faire.'],
            ['Que signifient les propriétés ACID ?', ['Atomicité, Cohérence, Isolation, Durabilité', 'Accès, Concurrence, Index, Données', 'Authentification, Chiffrement, Intégrité, Disponibilité', 'Analyse, Compilation, Interprétation, Déploiement'], 0, 'Elles définissent ce qu’un SGBD transactionnel garantit.'],
            ['Quelle commande SQL annule une transaction en cours ?', ['ROLLBACK', 'COMMIT', 'DELETE', 'REVOKE'], 0, 'COMMIT, à l’inverse, la valide définitivement.'],
            ['Pourquoi vaut-il mieux placer les contraintes dans le SGBD que dans l’application ?', ['Elles s’appliquent alors à tous les clients, présents et futurs', 'Elles s’exécutent plus vite', 'Elles sont plus faciles à écrire', 'Elles évitent d’écrire du SQL'], 0, 'Une contrainte applicative ne protège que cette application.'],
            ['Que garantit la propriété d’isolation ?', ['Deux transactions simultanées se déroulent comme si elles étaient successives', 'Les données sont chiffrées', 'La base est inaccessible pendant l’écriture', 'Chaque utilisateur a sa propre base'], 0, 'Sans elle, deux clients pourraient écraser mutuellement leur travail.'],
            ['SQLite est un SGBD embarqué, sans serveur.', ['Vrai', 'Faux'], 0, 'On le trouve dans les téléphones et les navigateurs.'],
            ['Qu’est-ce qui assure la durabilité d’une transaction validée ?', ['Le journal des transactions, écrit avant les données', 'La mémoire vive du serveur', 'L’index de la table', 'Le chiffrement du disque'], 0, 'Il permet de rejouer les opérations après une panne.'],
            ['Dans une architecture client-serveur, le serveur constitue un point de défaillance unique.', ['Vrai', 'Faux'], 0, 'C’est la contrepartie de la centralisation des données.'],
          ],
        },
        {
          titre: 'Le langage SQL',
          axe: 'Bases de données',
          lecon: {
            titre: 'Dire ce qu’on veut, pas comment l’obtenir',
            cours: `SQL est un langage **déclaratif** : on décrit le **résultat souhaité**, et le SGBD choisit lui-même comment l’obtenir. C’est ce qui le distingue de Python.

## Les deux familles
| Famille | Ses commandes |
| **Définition** des données | CREATE TABLE, ALTER TABLE, DROP TABLE |
| **Manipulation** des données | SELECT, INSERT, UPDATE, DELETE |

## L’interrogation
**SELECT** nom, moyenne **FROM** eleve **WHERE** moyenne >= 15 **ORDER BY** moyenne **DESC**

| Clause | Son rôle |
| **SELECT** | Choisit les **colonnes** — l’étoile les prend toutes, à éviter en production |
| **FROM** | Désigne la ou les **tables** |
| **WHERE** | Filtre les **lignes** |
| **ORDER BY** | Trie, en ASC (défaut) ou DESC |
| **DISTINCT**, **LIMIT** | Élimine les doublons ; borne le nombre de résultats |

Dans WHERE : les comparaisons, **AND**, **OR**, **NOT**, **BETWEEN**, **IN**, **LIKE** (avec le joker pour-cent), **IS NULL**.

## Écrire dans la base
| Commande | Sa forme |
| **INSERT** | INSERT INTO eleve (nom, classe_id) VALUES ('Dupont', 3) |
| **UPDATE** | UPDATE eleve SET moyenne = 14 WHERE id = 12 |
| **DELETE** | DELETE FROM eleve WHERE id = 12 |

> UPDATE et DELETE **sans WHERE** s’appliquent à **toutes** les lignes de la table. C’est l’erreur la plus coûteuse du langage.

## Les jointures
**SELECT** eleve.nom, classe.niveau **FROM** eleve **JOIN** classe **ON** eleve.classe_id = classe.id

| Jointure | Ce qu’elle garde |
| **JOIN** (INNER) | Seulement les lignes ayant une correspondance **des deux côtés** |
| **LEFT JOIN** | **Toutes** les lignes de gauche, complétées par NULL — c’est ce qu’il faut pour lister les élèves **sans** classe |

> Oublier la condition ON produit un **produit cartésien** : chaque ligne de la première table combinée à chaque ligne de la seconde.

## Les agrégats
**COUNT**, **SUM**, **AVG**, **MIN**, **MAX** résument un ensemble de lignes en une valeur. Avec **GROUP BY**, le résumé se fait par groupe :

**SELECT** classe_id, **AVG**(moyenne) **FROM** eleve **GROUP BY** classe_id

| Clause | Sur quoi elle porte | Quand elle agit |
| **WHERE** | Les **lignes** | **Avant** le regroupement |
| **HAVING** | Les **groupes** | **Après** le regroupement |

## L’injection SQL
Construire une requête en **concaténant** une saisie utilisateur permet à un attaquant d’en modifier le sens.

> La parade n’est **ni** le filtrage des apostrophes **ni** la vérification côté navigateur, mais les **requêtes paramétrées** — où la valeur ne peut jamais être interprétée comme du code.

> Ordre logique d’exécution : **FROM**, puis **WHERE**, puis **GROUP BY**, puis **HAVING**, puis **SELECT**, puis **ORDER BY**. Il explique à lui seul pourquoi HAVING ne peut pas remplacer WHERE.`,
          },
          questions: [
            ['SQL est un langage…', ['Déclaratif : on décrit le résultat voulu, pas la façon de l’obtenir', 'Impératif, comme Python', 'Fonctionnel', 'Orienté objet'], 0, 'Le SGBD choisit lui-même le plan d’exécution.'],
            ['Quelle est la différence entre WHERE et HAVING ?', ['WHERE filtre les lignes avant regroupement, HAVING filtre les groupes après', 'HAVING est plus rapide', 'WHERE ne fonctionne qu’avec SELECT', 'Il n’y a aucune différence'], 0, 'C’est la distinction la plus demandée en évaluation.'],
            ['Que fait un LEFT JOIN de plus qu’un JOIN ?', ['Il garde les lignes de gauche même sans correspondance, complétées par NULL', 'Il trie les résultats', 'Il supprime les doublons', 'Il joint trois tables à la fois'], 0, 'C’est ce qu’il faut pour lister les élèves sans classe.'],
            ['Que produit une jointure dont on a oublié la condition ON ?', ['Un produit cartésien', 'Une erreur de syntaxe', 'Un résultat vide', 'Une jointure externe'], 0, 'Chaque ligne de la première table est combinée à chaque ligne de la seconde.'],
            ['Que se passe-t-il si l’on écrit un DELETE sans clause WHERE ?', ['Toutes les lignes de la table sont supprimées', 'Rien, la requête est refusée', 'Seule la première ligne est supprimée', 'La table est verrouillée'], 0, 'C’est l’erreur la plus coûteuse du langage.'],
            ['Quelle est la parade efficace contre l’injection SQL ?', ['Les requêtes paramétrées', 'Le filtrage des apostrophes', 'La vérification côté navigateur', 'Le chiffrement de la base'], 0, 'La valeur ne peut alors jamais être interprétée comme du code.'],
            ['Quel mot-clé regroupe les lignes avant d’appliquer un agrégat ?', ['GROUP BY', 'ORDER BY', 'DISTINCT', 'JOIN'], 0, 'AVG, SUM ou COUNT s’appliquent alors groupe par groupe.'],
            ['Dans l’ordre logique d’exécution, SELECT s’applique avant WHERE.', ['Vrai', 'Faux'], 1, 'FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY : SELECT vient tard.'],
          ],
        },
        {
          titre: 'Tri de données avec le langage SQL',
          axe: 'Bases de données',
          lecon: {
            titre: 'Ordonner, classer, extraire le haut du panier',
            cours: `Trier n’est pas seulement afficher joliment : c’est la brique de toutes les questions « les meilleurs », « les plus récents », « le premier de chaque groupe ».

## ORDER BY
**SELECT** nom, moyenne **FROM** eleve **ORDER BY** moyenne **DESC**, nom **ASC**

| Possibilité | Ce qu’elle permet |
| **ASC** (défaut) ou **DESC** | Croissant ou décroissant |
| **Plusieurs colonnes** | La seconde départage les ex æquo de la première |
| Une colonne **non affichée** | Ou le résultat d’un calcul, ou un agrégat |

Le tri des chaînes suit la **collation** de la base : selon le paramétrage, majuscules et accents ne se classent pas pareil.

> Trier un numéro stocké en **TEXT** le classe **alphabétiquement** : « 10 » passe avant « 9 ».

## LIMIT et OFFSET
**SELECT** nom **FROM** eleve **ORDER BY** moyenne **DESC LIMIT** 3

**LIMIT** borne le nombre de lignes, **OFFSET** en saute un certain nombre : ensemble ils réalisent la **pagination**.

> Un **LIMIT sans ORDER BY** renvoie des lignes **arbitraires** : rien n’oblige le SGBD à respecter un ordre qu’on ne lui a pas demandé. Erreur **silencieuse**, donc redoutable.

## Trier un résultat agrégé
**SELECT** classe_id, **AVG**(moyenne) **AS** moy **FROM** eleve **GROUP BY** classe_id **ORDER BY** moy **DESC**

Le mot-clé **AS** donne un **alias** à une colonne calculée : on peut la réutiliser dans ORDER BY, et le résultat devient lisible.

## Trier n’est pas indexer
| | **ORDER BY** | Un **index** |
| Ce qu’il ordonne | Le **résultat d’une requête** | Une structure **auxiliaire** durable |
| Sa durée | Le temps de l’exécution | Permanent |
| Sur les lignes de la table | Aucun effet | Aucun effet non plus |

Un tri sur une colonne indexée est bien plus rapide, puisque l’index fournit déjà l’ordre.

## Le coût du tri
Un tri général coûte de l’ordre de **n log n** comparaisons — la borne théorique des tris par comparaison.

> Sur de gros volumes : **filtrer avant de trier**, et ne trier que les colonnes nécessaires. Trier un million de lignes pour n’en afficher dix est le gaspillage typique.

## Le lien avec l’algorithmique
Les tris étudiés en NSI — insertion et sélection, en n² — et le tri fusion, en n log n, sont exactement ce que le SGBD implémente sous ORDER BY. La différence : il **choisit lui-même** l’algorithme selon la taille des données et les index disponibles.

> Un ORDER BY oublié devant un LIMIT donne un résultat qui **a l’air juste** et qui ne l’est pas.`,
          },
          questions: [
            ['Quel est l’ordre de tri appliqué par défaut par ORDER BY ?', ['Croissant (ASC)', 'Décroissant (DESC)', 'Aléatoire', 'L’ordre d’insertion'], 0, 'DESC doit être précisé explicitement.'],
            ['Que se passe-t-il si l’on utilise LIMIT sans ORDER BY ?', ['Les lignes renvoyées sont arbitraires', 'La requête échoue', 'Les premières lignes insérées sont renvoyées', 'Le tri est fait automatiquement sur la clé primaire'], 0, 'Rien n’oblige le SGBD à respecter un ordre qu’on ne lui a pas demandé.'],
            ['À quoi sert le mot-clé AS ?', ['À donner un alias à une colonne, notamment calculée', 'À trier les résultats', 'À joindre deux tables', 'À créer un index'], 0, 'L’alias peut ensuite être réutilisé dans ORDER BY.'],
            ['Que réalisent ensemble LIMIT et OFFSET ?', ['La pagination des résultats', 'Le regroupement des lignes', 'La jointure de deux tables', 'Le filtrage des doublons'], 0, 'OFFSET saute un certain nombre de lignes avant d’en renvoyer LIMIT.'],
            ['Peut-on trier sur plusieurs colonnes à la fois ?', ['Oui, la seconde départage les ex æquo de la première', 'Non, une seule colonne est possible', 'Oui, mais uniquement en ordre croissant', 'Seulement avec GROUP BY'], 0, 'On peut aussi trier sur une colonne non affichée.'],
            ['Un ORDER BY modifie l’ordre de stockage des lignes dans la table.', ['Vrai', 'Faux'], 1, 'Il ordonne le résultat d’une requête ; c’est l’index qui ordonne une structure auxiliaire.'],
            ['Quel est le coût théorique d’un tri par comparaison ?', ['De l’ordre de n log n', 'De l’ordre de n', 'De l’ordre de n²', 'Constant'], 0, 'C’est la borne des tris par comparaison, atteinte par le tri fusion.'],
            ['Trier un numéro stocké en TEXT le classe alphabétiquement.', ['Vrai', 'Faux'], 0, '« 10 » se retrouve alors avant « 9 » : le type des colonnes n’est pas décoratif.'],
          ],
        },
        // ---- Chapitre 4 : Génie logiciel -------------------------------------
        {
          titre: 'Programmes et données',
          axe: 'Génie logiciel',
          lecon: {
            titre: 'Un programme est une donnée comme une autre',
            cours: `L’idée fondatrice de l’informatique tient en une phrase : dans la mémoire d’une machine, **un programme et une donnée ont la même nature**.

## L’architecture de von Neumann
Elle place dans une **même mémoire** les instructions et les données, adressées de la même façon.

> C’est ce qui permet à un programme d’en lire, d’en écrire, d’en transformer un autre — et donc l’existence des compilateurs, des interpréteurs, des systèmes d’exploitation… et des virus.

## Compilation ou interprétation
| | **Compilateur** | **Interpréteur** |
| Quand il traduit | **Une fois pour toutes** | **Au fil** de la lecture |
| L’exécution | Rapide | Plus lente |
| Les erreurs de type | Détectées **avant** l’exécution | À l’exécution |
| La portabilité | Le résultat est lié à une machine | Le programme est portable |
| Exemples | C, Rust | Python |

Des solutions **mixtes** existent : Java compile vers un code intermédiaire, exécuté par une machine virtuelle.

## La fonction, donnée de première classe
Dans un langage comme Python, une fonction peut être **stockée** dans une variable, **passée en argument** et **renvoyée** par une autre fonction.

> C’est ce qui permet d’écrire un tri qui **reçoit** sa clé de comparaison, ou une interface graphique qui reçoit le traitement à exécuter au clic.

## Le typage
| Distinction | Ce qu’elle oppose |
| **Statique** ou **dynamique** | Vérifié à la compilation, ou à l’exécution |
| **Fort** ou **faible** | Pas de conversion implicite hasardeuse, ou bien si |

Python est à typage **dynamique et fort** : il n’exige pas de déclarer les types, mais refuse d’additionner un entier et une chaîne. Les **annotations de type** sont facultatives — l’interpréteur ne les vérifie pas.

## Les limites théoriques
Puisqu’un programme peut analyser un programme, on pourrait espérer un programme qui détecte tous les bugs. **Turing** a montré que non : le **problème de l’arrêt** — décider si un programme quelconque s’arrête sur une entrée donnée — est **indécidable**.

> Conséquence directe : aucun outil ne prouvera jamais automatiquement qu’un programme quelconque est correct. **Tester reste indispensable.**

## Données et représentation
Une même suite de bits ne veut rien dire hors du **type** qu’on lui attribue : elle peut être un entier, un flottant, un caractère ou une instruction.

> Le type n’est pas **dans** la donnée : il est dans l’**interprétation** qu’on en fait.`,
          },
          questions: [
            ['Que postule l’architecture de von Neumann ?', ['Programmes et données partagent la même mémoire', 'Les programmes sont stockés séparément des données', 'Le processeur exécute plusieurs instructions à la fois', 'La mémoire est infinie'], 0, 'C’est ce qui rend possibles compilateurs, systèmes d’exploitation et virus.'],
            ['Quelle est la différence entre compilation et interprétation ?', ['Le compilateur traduit une fois pour toutes, l’interpréteur exécute au fil de la lecture', 'Le compilateur est plus lent à l’exécution', 'L’interpréteur produit un exécutable', 'Il n’y a aucune différence'], 0, 'Java combine les deux avec un code intermédiaire et une machine virtuelle.'],
            ['Que signifie « une fonction est une donnée de première classe » ?', ['Elle peut être stockée, passée en argument et renvoyée', 'Elle est définie en premier dans le fichier', 'Elle est plus rapide que les autres', 'Elle ne peut pas être modifiée'], 0, 'C’est ce qui permet de passer une clé de comparaison à une fonction de tri.'],
            ['Python est à typage dynamique et fort.', ['Vrai', 'Faux'], 0, 'Il n’exige pas de déclarer les types, mais refuse d’additionner un entier et une chaîne.'],
            ['Que dit le problème de l’arrêt ?', ['Aucun algorithme ne peut décider si un programme quelconque s’arrête', 'Tout programme finit par s’arrêter', 'Un programme peut vérifier n’importe quel autre programme', 'Un interpréteur ne s’arrête jamais'], 0, 'Démontré par Turing : la question est indécidable.'],
            ['Les annotations de type de Python sont vérifiées par l’interpréteur.', ['Vrai', 'Faux'], 1, 'Elles servent à la documentation et aux outils d’analyse statique.'],
            ['Une même suite de bits peut représenter un entier ou une instruction.', ['Vrai', 'Faux'], 0, 'Le type n’est pas dans la donnée, mais dans l’interprétation qu’on en fait.'],
            ['Quelle conséquence pratique le problème de l’arrêt a-t-il ?', ['Aucun outil ne prouvera automatiquement qu’un programme quelconque est correct', 'Les compilateurs sont inutiles', 'Les boucles infinies sont interdites', 'Les tests sont inutiles'], 0, 'C’est pourquoi les tests restent indispensables.'],
          ],
        },
        {
          titre: 'Paradigmes de programmation',
          axe: 'Génie logiciel',
          lecon: {
            titre: 'Quatre façons de dire la même chose',
            cours: `Un **paradigme** est une manière de concevoir un programme. Le programme de Terminale en retient **quatre** — et demande surtout de savoir **lequel choisir**.

## Les quatre paradigmes
| Paradigme | Le programme est… | Son terrain |
| **Impératif** | Une suite d’**instructions** qui modifient l’état | Algorithme court, performance critique |
| **Fonctionnel** | Une **composition de fonctions** | Calcul, transformation de données, tests fiables |
| **Objet** | Des **objets** qui échangent des messages | Modélisation d’un domaine, code appelé à durer |
| **Événementiel** | Une **réaction** à des événements | Interface, réseau, temps réel |

## Impératif
Affectations, boucles, conditions : le paradigme le plus proche de l’exécution réelle. Son point faible : l’**état partagé** rend le raisonnement difficile dès que le programme grandit.

## Fonctionnel
| Principe | Ce qu’il impose |
| **Pas d’effet de bord** | Une fonction ne modifie rien hors d’elle-même |
| **Transparence référentielle** | Mêmes arguments, même résultat — l’appel peut être remplacé par sa valeur |
| **Immutabilité** | On crée une nouvelle valeur au lieu de modifier l’ancienne |
| **Récursivité** | Plutôt que des boucles |

> Conséquence pratique : une fonction pure est **facile à tester** — aucun contexte à préparer — et **sûre** à exécuter en parallèle.

## Événementiel
Le programme réagit à des événements — clic, message réseau, minuteur — au moyen de **gestionnaires**. Le flot d’exécution n’est plus décidé par le programme mais par **ce qui arrive**.

## Ils se mélangent
Python est **multiparadigme**. Un programme réel les combine : une interface événementielle, des objets pour le domaine, des fonctions pures pour les calculs, de l’impératif dans les boucles internes.

## Ce que le paradigme change vraiment
Il ne change **pas** ce que la machine calcule — tous sont équivalents en puissance d’expression. Il change ce que le **lecteur** du code peut comprendre sans tout lire, et donc le **coût de la modification**.

> Un test unitaire est facile à écrire sur une **fonction pure** et pénible sur du code à **état global**. Ce seul critère justifie l’essentiel de l’engouement pour le fonctionnel.`,
          },
          questions: [
            ['Qu’est-ce qu’un effet de bord ?', ['Une modification, par une fonction, de quelque chose en dehors d’elle-même', 'Une erreur d’exécution', 'Un retour de valeur inattendu', 'Un appel récursif trop profond'], 0, 'Le paradigme fonctionnel cherche précisément à les éliminer.'],
            ['Que signifie la transparence référentielle ?', ['Un appel peut être remplacé par sa valeur, sans changer le programme', 'Le code est lisible', 'Les variables sont globales', 'Les fonctions sont documentées'], 0, 'Elle découle de l’absence d’effet de bord.'],
            ['Quel paradigme convient à une interface graphique ?', ['L’événementiel', 'Le fonctionnel', 'L’impératif', 'Le logique'], 0, 'Le flot d’exécution est décidé par les événements, pas par le programme.'],
            ['Python impose un seul paradigme de programmation.', ['Vrai', 'Faux'], 1, 'Il est multiparadigme : impératif, fonctionnel, objet et événementiel.'],
            ['Pourquoi une fonction pure est-elle facile à tester ?', ['Elle ne dépend d’aucun contexte extérieur et donne toujours le même résultat', 'Elle est plus courte', 'Elle ne renvoie rien', 'Elle est compilée séparément'], 0, 'Aucun état à préparer, aucun effet à vérifier ailleurs.'],
            ['Le choix d’un paradigme change ce que la machine peut calculer.', ['Vrai', 'Faux'], 1, 'Tous sont équivalents en puissance : c’est la lisibilité et la maintenance qui changent.'],
            ['Quel principe le paradigme fonctionnel privilégie-t-il à la place des boucles ?', ['La récursivité', 'Les instructions conditionnelles', 'Les objets', 'Les gestionnaires d’événements'], 0, 'Il évite ainsi la modification d’un compteur, donc un état mutable.'],
            ['Quel paradigme convient le mieux à la modélisation d’un domaine appelé à durer ?', ['L’objet', 'L’impératif', 'L’événementiel', 'Le fonctionnel pur'], 0, 'Encapsulation et héritage y facilitent la maintenance.'],
          ],
        },
        {
          titre: 'Modularité des programmes',
          axe: 'Génie logiciel',
          lecon: {
            titre: 'Découper pour pouvoir changer d’avis plus tard',
            cours: `Un programme d’un seul bloc devient illisible passé quelques centaines de lignes. La **modularité** consiste à le découper en unités qui se comprennent **séparément**.

## Les niveaux de découpage
| Niveau | Ce qu’il regroupe |
| La **fonction** | Une tâche, un nom, des paramètres, une valeur de retour |
| Le **module** | Un fichier de fonctions ou de classes cohérentes |
| Le **paquet** | Un ensemble de modules |
| La **bibliothèque** | Un paquet destiné à être **réutilisé** |

## Interface et implémentation
Un module expose une **interface** — ce qu’il promet — et cache son **implémentation** — la façon dont il tient sa promesse.

> Celui qui l’utilise ne doit connaître que la première. C’est ce qui permet de **changer l’intérieur sans casser l’extérieur**.

## Les deux critères d’un bon découpage
| Critère | Ce qu’il exige |
| **Forte cohésion** | Tout ce qui est dans un module concerne le **même sujet** |
| **Faible couplage** | Les modules dépendent le **moins possible** les uns des autres |

Un module qui a besoin de connaître l’intérieur d’un autre est mal découpé : toute modification de l’un obligera à modifier l’autre.

## Les trois formes d’importation en Python
| Forme | Son effet |
| Importer le **module entier**, puis préfixer les appels | La plus **lisible** |
| Importer un **nom précis** | Commode, mais on perd la trace de l’origine |
| Importer **tout le contenu** dans l’espace courant | **À proscrire** : deux modules peuvent définir le même nom, et le second écrase **silencieusement** le premier |

## La documentation
Une **docstring** décrit ce que fait une fonction, ses paramètres, sa valeur de retour et ses erreurs éventuelles.

> Une bonne docstring décrit le **contrat**, pas l’algorithme : elle dit ce que la fonction **garantit**, pas comment elle s’y prend — sinon elle devra être réécrite à chaque modification interne.

## Préconditions et postconditions
| Notion | Qui la garantit |
| La **précondition** | L’**appelant** : la liste ne doit pas être vide |
| La **postcondition** | La **fonction** : la liste renvoyée est triée |

L’instruction **assert** permet de les vérifier pendant le développement — mais ce n’est **pas** un mécanisme de gestion d’erreur en production, puisqu’elle peut être désactivée.

## Réutiliser
Le premier réflexe devant un besoin courant est de chercher une **bibliothèque existante**, éprouvée et testée par d’autres. Écrire soi-même un tri, une date ou une fonction de hachage produit presque toujours un code plus lent et moins sûr.

> Le bon test d’un découpage : peut-on expliquer ce que fait un module **en une phrase, sans employer le mot « et »** ? Si non, il en contient deux.`,
          },
          questions: [
            ['Qu’est-ce que l’interface d’un module ?', ['Ce que le module promet, indépendamment de la façon dont il le réalise', 'Son code source complet', 'Son interface graphique', 'La liste de ses dépendances'], 0, 'Cacher l’implémentation permet de la changer sans casser le code appelant.'],
            ['Que signifie « faible couplage » ?', ['Les modules dépendent le moins possible les uns des autres', 'Les modules sont peu nombreux', 'Le code est peu commenté', 'Les fonctions sont courtes'], 0, 'Il va de pair avec une forte cohésion à l’intérieur de chaque module.'],
            ['Pourquoi éviter d’importer tout le contenu d’un module dans l’espace courant ?', ['Deux modules peuvent définir le même nom, et le second écrase le premier silencieusement', 'C’est plus lent à l’exécution', 'Cela consomme trop de mémoire', 'Python l’interdit'], 0, 'On perd aussi la trace de l’origine de chaque nom.'],
            ['Que doit décrire une bonne docstring ?', ['Le contrat de la fonction : ce qu’elle garantit', 'L’algorithme employé, ligne par ligne', 'L’auteur et la date', 'Les tests associés'], 0, 'Décrire l’algorithme oblige à réécrire la docstring à chaque modification interne.'],
            ['Qu’est-ce qu’une précondition ?', ['Ce que l’appelant doit garantir avant l’appel', 'Ce que la fonction garantit en retour', 'Une variable globale', 'Un test unitaire'], 0, 'La postcondition, elle, porte sur ce que la fonction renvoie.'],
            ['L’instruction assert est un mécanisme de gestion d’erreur adapté à la production.', ['Vrai', 'Faux'], 1, 'Elle peut être désactivée : elle sert au développement, pas à la robustesse en production.'],
            ['Quel est le bon réflexe devant un besoin courant, comme un tri ou une date ?', ['Chercher une bibliothèque existante et éprouvée', 'Écrire sa propre implémentation', 'Copier du code trouvé en ligne', 'Éviter le problème'], 0, 'Un code maison est presque toujours plus lent et moins sûr.'],
            ['Un module qui a besoin de connaître l’intérieur d’un autre est bien découpé.', ['Vrai', 'Faux'], 1, 'C’est le signe d’un couplage fort : toute modification de l’un touchera l’autre.'],
          ],
        },
        {
          titre: 'Bonnes pratiques logicielles',
          axe: 'Génie logiciel',
          lecon: {
            titre: 'Écrire pour celui qui relira dans six mois',
            cours: `Le coût d’un programme se joue moins à l’écriture qu’à la **relecture** et à la **modification**. Les bonnes pratiques ne sont pas des règles de politesse : ce sont des économies mesurables.

## Nommer
Un nom doit dire **ce que la chose est**, pas ce qu’elle vaut ni comment elle est faite.

| Nom | Ce qu’il exige |
| nb_eleves_inscrits | Aucun commentaire |
| x | Un commentaire, forcément |

> La règle : **plus la portée est large, plus le nom doit être explicite**. Un compteur de boucle courte peut s’appeler i.

## Commenter
| Commentaire | Son verdict |
| « incrémente i » | **Inutile** : il répète le code |
| « on saute le premier enregistrement, qui est l’en-tête » | **Indispensable** : il explique le pourquoi |

> Un commentaire **faux** est pire que pas de commentaire : il induit en erreur celui qui lui fait confiance.

## Les deux règles de structure
| Règle | Ce qu’elle évite |
| **Pas de duplication** | Deux morceaux identiques évolueront séparément : on corrigera un bug dans l’un et pas dans l’autre |
| **Fonctions courtes** | Une fonction fait **une seule chose**. Si son nom contient « et », elle en fait deux |

## Les tests
Un **test unitaire** vérifie une fonction isolée sur des cas choisis.

| Cas à couvrir | Exemples |
| Le cas **nominal** | L’usage attendu |
| Les cas **limites** | Liste vide, un seul élément, valeur nulle, borne exacte |
| Les cas d’**erreur** | Entrée invalide |

> Dijkstra : les tests montrent la **présence** de bugs, jamais leur **absence**. Un test réussi prouve seulement qu’on n’échoue pas sur les cas testés.

Les tests servent aussi de **filet** : ils permettent de modifier le code sans crainte, ce qui rend la **refactorisation** possible.

## La gestion de versions
**git** enregistre l’historique, permet de revenir en arrière, de travailler à plusieurs sur le même fichier et de retrouver **quand** et **pourquoi** une ligne a changé.

> Chaque enregistrement doit être **petit** et porter un message qui explique l’**intention**.

## La spécification
Avant d’écrire, il faut savoir ce que le programme doit faire — **et ce qu’il ne doit pas faire**.

> Un programme conforme à une **mauvaise spécification** est un programme raté, même sans aucun bug.

> La question avant de valider une modification : « quelqu’un qui découvre ce fichier comprendra-t-il en une minute ce qu’il fait ? » Si non, ce n’est pas fini.`,
          },
          questions: [
            ['Que doit expliquer un bon commentaire ?', ['Pourquoi le code est ainsi, et non ce qu’il fait', 'Ce que fait chaque ligne', 'L’auteur et la date', 'La complexité de l’algorithme'], 0, 'Un commentaire qui répète le code devient faux dès la première modification.'],
            ['Que prouve un test unitaire réussi ?', ['Que le programme n’échoue pas sur les cas testés', 'Que le programme est correct', 'Que le programme est rapide', 'Que le code est bien nommé'], 0, 'Dijkstra : les tests montrent la présence de bugs, jamais leur absence.'],
            ['Quels cas un jeu de tests doit-il couvrir ?', ['Le cas nominal, les cas limites et les cas d’erreur', 'Uniquement le cas nominal', 'Uniquement les cas d’erreur', 'Un cas choisi au hasard'], 0, 'Liste vide, élément unique et borne exacte sont les oublis les plus fréquents.'],
            ['Pourquoi la duplication de code est-elle un problème ?', ['Les deux copies évoluent séparément et un bug corrigé d’un côté subsiste de l’autre', 'Elle ralentit l’exécution', 'Elle consomme trop de mémoire', 'Elle empêche la compilation'], 0, 'C’est une dette technique, à rembourser en factorisant.'],
            ['À quoi sert un système de gestion de versions comme git ?', ['À conserver l’historique, revenir en arrière et travailler à plusieurs', 'À sauvegarder automatiquement le disque', 'À compiler le code', 'À tester le programme'], 0, 'Chaque enregistrement doit être petit et expliquer l’intention.'],
            ['Les tests rendent la refactorisation possible.', ['Vrai', 'Faux'], 0, 'Ils servent de filet : on peut modifier le code sans craindre de casser un comportement.'],
            ['Comment savoir qu’une fonction fait plus d’une chose ?', ['Son nom contient « et »', 'Elle dépasse dix lignes', 'Elle a plus de deux paramètres', 'Elle est récursive'], 0, 'Une fonction doit faire une seule chose, et son nom doit pouvoir le dire.'],
            ['Un programme sans bug est nécessairement un programme réussi.', ['Vrai', 'Faux'], 1, 'S’il est conforme à une mauvaise spécification, il fait parfaitement la mauvaise chose.'],
          ],
        },
        {
          titre: 'Mise au point logicielle',
          axe: 'Génie logiciel',
          lecon: {
            titre: 'Trouver la cause, pas seulement le symptôme',
            cours: `Corriger un programme est une **enquête** : le message d’erreur signale l’endroit où le problème est devenu **visible**, presque jamais celui où il a été **introduit**.

## Les trois familles d’erreurs
| Famille | Quand elle se manifeste | Sa dangerosité |
| De **syntaxe** | Avant toute exécution : le code ne peut pas être lu | La plus **facile** |
| D’**exécution** | Le programme s’arrête en route : division par zéro, indice hors bornes, fichier absent | Bruyante, donc repérable |
| De **logique** | Jamais : le programme s’exécute et donne un **résultat faux** | La plus **dangereuse** |

## La méthode en cinq temps
1. **Reproduire** l’erreur de façon fiable, avec le plus **petit** cas d’entrée possible ;
2. **Localiser** : encadrer la zone où l’état devient incorrect ;
3. **Comprendre** la cause, et non seulement le symptôme ;
4. **Corriger** ;
5. **Ajouter un test** qui échouait avant la correction.

> L’étape 5 est celle qu’on saute — et c’est elle qui distingue une **correction** d’un **rafistolage**.

## Les outils
| Outil | Ce qu’il donne |
| L’**affichage** de valeurs intermédiaires | Rudimentaire mais efficace |
| Le **débogueur** | Points d’arrêt, pas à pas, inspection des variables |
| Les **assertions** | Elles font échouer **au moment exact** où une hypothèse est violée, pas dix lignes plus loin |
| La **journalisation** | Une trace en production, là où le débogueur n’existe pas |

## Les exceptions
Une **exception** signale une situation anormale. On la traite **au niveau où l’on sait quoi faire** : essayer d’ouvrir le fichier, et s’il est absent, avertir l’utilisateur et proposer un autre chemin.

| Erreur opposée | Ce qu’elle produit |
| **Tout attraper** sans rien en faire | Les bugs sont **masqués** au lieu d’être traités |
| **Ne rien attraper** | Le programme tombe sur une cause pourtant prévisible |

> Une exception ne doit pas servir de **contrôle de flux ordinaire** : elle signale l’exceptionnel.

## Les bugs les plus fréquents
Les erreurs de **borne** (le décalage d’un rang), la confusion entre affectation et comparaison, la modification d’une liste **pendant** son parcours, les effets de bord sur un argument mutable, l’oubli du cas **collection vide**.

## La complexité comme bug
Un programme **correct mais trop lent** est inutilisable. Estimer la complexité **avant** de coder évite de découvrir sur des données réelles qu’un algorithme quadratique ne passera jamais à l’échelle.

> Un bug n’est jamais « bizarre » : il est la **conséquence exacte** de ce qui est écrit. Cesser de trouver l’ordinateur capricieux, c’est commencer à déboguer vraiment.`,
          },
          questions: [
            ['Quelle famille d’erreurs est la plus dangereuse ?', ['L’erreur de logique, car le programme s’exécute et donne un résultat faux', 'L’erreur de syntaxe', 'L’erreur d’exécution', 'Toutes sont équivalentes'], 0, 'Rien ne la signale : ni l’interpréteur, ni un arrêt du programme.'],
            ['Quelle étape de la correction d’un bug est le plus souvent oubliée ?', ['Ajouter un test qui échouait avant la correction', 'Reproduire l’erreur', 'Localiser la zone fautive', 'Corriger le code'], 0, 'C’est elle qui empêche le bug de revenir.'],
            ['À quoi sert une assertion pendant la mise au point ?', ['Faire échouer le programme à l’endroit exact où une hypothèse est violée', 'Corriger automatiquement l’erreur', 'Documenter la fonction', 'Accélérer l’exécution'], 0, 'Sans elle, l’erreur ne se manifeste souvent que bien plus loin.'],
            ['Attraper toutes les exceptions sans rien en faire est une bonne pratique.', ['Vrai', 'Faux'], 1, 'Cela masque les bugs au lieu de les traiter : le programme continue sur un état incorrect.'],
            ['Que permet la journalisation, qu’un débogueur ne permet pas ?', ['Garder une trace en production, où le débogueur n’est pas disponible', 'Exécuter le programme pas à pas', 'Inspecter les variables en direct', 'Poser des points d’arrêt'], 0, 'Les deux outils sont complémentaires, pas concurrents.'],
            ['Un message d’erreur indique l’endroit où le bug a été introduit.', ['Vrai', 'Faux'], 1, 'Il indique l’endroit où le problème est devenu visible, ce qui est rarement le même.'],
            ['Quelle erreur classique consiste à se tromper d’un rang sur un indice ?', ['L’erreur de borne', 'L’erreur de type', 'L’erreur de syntaxe', 'L’interblocage'], 0, 'Elle guette toutes les boucles indexées et tous les découpages de listes.'],
            ['Un programme correct mais trop lent peut être considéré comme défectueux.', ['Vrai', 'Faux'], 0, 'D’où l’intérêt d’estimer la complexité avant de coder.'],
          ],
        },
        // ---- Chapitre 5 : Algorithmique --------------------------------------
        {
          titre: 'Algorithme récursif',
          axe: 'Algorithmique',
          lecon: {
            titre: 'Une fonction qui s’appelle elle-même, et qui s’arrête',
            cours: `Un algorithme est **récursif** quand il résout un problème en s’appelant lui-même sur un cas plus petit. Sa correction repose **entièrement** sur deux éléments.

## Les deux composants obligatoires
| Composant | Ce qu’il garantit | S’il manque |
| Le **cas de base** | Une valeur renvoyée **sans** rappel | La récursion ne s’arrête jamais |
| L’appel sur un cas **strictement plus petit** | On se rapproche du cas de base | Le cas de base n’est jamais atteint |

Dans les deux cas : **récursion infinie**, qui se termine par un dépassement de la pile d’appels.

## La pile d’appels
Chaque appel en cours occupe une **place** en mémoire : ses paramètres et l’endroit où reprendre. Les appels s’**empilent**, puis se dépilent du plus profond au plus superficiel.

> La profondeur est donc **limitée** : Python la borne par défaut autour de **mille** appels. Une récursion sur une liste d’un million d’éléments échouera là où une boucle passe sans difficulté.

## Écrire une fonction récursive
1. Identifier le **cas de base** et sa valeur ;
2. **Supposer que la fonction fonctionne déjà** pour le cas plus petit — l’acte de foi qui rend la récursivité écrivable ;
3. Écrire comment **combiner** ce résultat avec le cas courant.

Exemples classiques : factorielle, somme d’une liste, puissance, inversion d’une chaîne, tours de Hanoï, parcours d’arbre.

## Récursivité et arbres
Les structures **récursives par définition** — un arbre est un nœud et deux arbres — se traitent naturellement par récursivité.

> Un parcours d’arbre écrit en récursif tient en **trois lignes** ; sa version itérative exige de gérer explicitement une pile.

## Le piège de la double récursion
La suite de Fibonacci écrite naïvement rappelle **deux fois** la fonction à chaque niveau : le nombre d’appels **double** à chaque rang, le coût devient **exponentiel**.

> Calculer le trentième terme demande plus d’un **million** d’appels, dont l’immense majorité recalcule ce qui l’a déjà été. La solution — mémoriser — est l’objet de la programmation dynamique.

## Récursif ou itératif
| | **Récursif** | **Itératif** |
| Puissance | Identique | Identique |
| Quand le choisir | Structures **récursives**, code court | Grande **profondeur**, performance critique |

> La question devant une fonction récursive : « sur quel argument **décroît**-elle, et jusqu’où ? » Si la réponse n’est pas immédiate, la fonction est fausse.`,
          },
          questions: [
            ['Quels sont les deux composants obligatoires d’un algorithme récursif ?', ['Un cas de base et un appel sur un cas strictement plus proche de ce cas', 'Une boucle et une condition', 'Deux appels récursifs', 'Une pile et une file'], 0, 'Oublier l’un des deux produit une récursion infinie.'],
            ['Que se passe-t-il en cas de récursion infinie ?', ['La pile d’appels déborde et le programme s’arrête', 'Le programme tourne indéfiniment sans erreur', 'Le résultat est faux mais le programme se termine', 'Python détecte l’erreur avant l’exécution'], 0, 'Chaque appel en cours occupe une place en mémoire.'],
            ['Dans quel ordre les appels récursifs se terminent-ils ?', ['Du plus profond au plus superficiel', 'Dans l’ordre où ils ont été lancés', 'De façon indéterminée', 'Tous en même temps'], 0, 'C’est le fonctionnement d’une pile : dernier entré, premier sorti.'],
            ['Pourquoi une récursion sur un million d’éléments échoue-t-elle en Python ?', ['La profondeur de récursion est bornée, autour de mille appels par défaut', 'Le calcul est trop long', 'Python interdit la récursivité', 'La mémoire vive est insuffisante pour les données'], 0, 'Une boucle passerait sans difficulté sur les mêmes données.'],
            ['Pourquoi la version naïve de Fibonacci est-elle si coûteuse ?', ['Chaque niveau relance deux appels, et les mêmes valeurs sont recalculées', 'Les nombres deviennent trop grands', 'La pile est trop petite', 'Le cas de base est mal choisi'], 0, 'Le coût devient exponentiel : c’est ce que la programmation dynamique corrige.'],
            ['Toute fonction récursive peut être réécrite de façon itérative.', ['Vrai', 'Faux'], 0, 'Avec une boucle et une pile explicite : le choix est une question de lisibilité.'],
            ['Quelle structure de données se traite le plus naturellement par récursivité ?', ['L’arbre', 'Le tableau', 'La file', 'Le dictionnaire'], 0, 'Sa définition est elle-même récursive : un nœud et deux arbres.'],
            ['Écrire une fonction récursive suppose de supposer qu’elle fonctionne déjà pour le cas plus petit.', ['Vrai', 'Faux'], 0, 'C’est l’acte de foi qui rend la récursivité écrivable — et que la preuve par récurrence justifie.'],
          ],
        },
        {
          titre: 'Diviser pour régner',
          axe: 'Algorithmique',
          lecon: {
            titre: 'Couper en deux, résoudre, recoller',
            cours: `**Diviser pour régner** est une stratégie en trois temps : **diviser** le problème en sous-problèmes de même nature, les **résoudre** récursivement, **combiner** leurs solutions.

## Les trois étapes
| Étape | Ce qu’elle fait |
| **Diviser** | Découper l’entrée en parties, généralement deux moitiés |
| **Régner** | Résoudre chaque partie par un appel récursif, jusqu’au cas de base |
| **Combiner** | Reconstruire la solution globale |

> C’est la **troisième** étape qui distingue les algorithmes : triviale pour la recherche dichotomique, **coûteuse** pour le tri fusion.

## La recherche dichotomique
Sur un tableau **trié**, on compare la valeur cherchée à l’élément **du milieu** : chaque comparaison écarte **la moitié** du tableau.

| Méthode | Comparaisons pour un million d’éléments |
| Recherche **séquentielle** | jusqu’à **1 000 000** |
| Recherche **dichotomique** | environ **20** |

> La condition est absolue : le tableau **doit** être trié. Sur un tableau non trié, la dichotomie ne signale rien — elle renvoie simplement un résultat **faux**.

## Le tri fusion
| Étape | Ce qu’elle fait |
| Diviser | Couper le tableau en deux moitiés |
| Régner | Trier chaque moitié récursivement |
| Combiner | **Fusionner** les deux moitiés triées en prenant à chaque étape le plus petit élément disponible |

| Sa qualité | Son défaut |
| **n log n** dans **tous** les cas — la borne optimale des tris par comparaison | Un tableau **auxiliaire** : mémoire proportionnelle à n |
| **Stable** : deux éléments égaux gardent leur ordre | — |
| Performance indépendante des données | — |

## L’ordre de grandeur qui décide
| Tri | Coût | Pour un million d’éléments |
| Insertion, sélection | **n²** | environ **10¹²** opérations |
| Fusion | **n log n** | environ **2 × 10⁷** opérations |

> Ce n’est pas une nuance, mais la différence entre « instantané » et « impossible ».

## Les autres exemples
Exponentiation rapide (élever au carré plutôt que multiplier n fois), tri rapide, multiplication de Karatsuba, enveloppe convexe, transformée de Fourier rapide.

## Quand la stratégie ne s’applique pas
Il faut que les sous-problèmes soient **indépendants**. Quand ils se **recouvrent**, diviser pour régner recalcule inutilement — et c’est la **programmation dynamique** qui prend le relais.

> Retenir la mécanique du logarithme : diviser la taille par deux à chaque étape, c’est atteindre 1 en **log₂(n)** étapes. Tout le chapitre en découle.`,
          },
          questions: [
            ['Quelles sont les trois étapes de la stratégie « diviser pour régner » ?', ['Diviser, régner, combiner', 'Trier, chercher, fusionner', 'Découper, tester, corriger', 'Lire, calculer, écrire'], 0, 'C’est l’étape de combinaison qui distingue les algorithmes entre eux.'],
            ['Quelle condition la recherche dichotomique exige-t-elle ?', ['Que le tableau soit trié', 'Que le tableau soit de taille paire', 'Que les valeurs soient entières', 'Que le tableau soit indexé à partir de 1'], 0, 'Sur un tableau non trié, elle renvoie un résultat faux sans rien signaler.'],
            ['Quel est le coût d’une recherche dichotomique sur n éléments ?', ['Logarithmique', 'Linéaire', 'Quadratique', 'Constant'], 0, 'Environ 20 comparaisons pour un million d’éléments.'],
            ['Quel est le coût du tri fusion ?', ['n log n dans tous les cas', 'n² dans le pire cas', 'n dans le meilleur cas', 'Constant'], 0, 'Log n niveaux de découpage, n opérations de fusion par niveau.'],
            ['Quel est le principal inconvénient du tri fusion ?', ['Il utilise une mémoire supplémentaire proportionnelle à n', 'Il est instable', 'Il est lent sur des données triées', 'Il ne fonctionne que sur des entiers'], 0, 'En contrepartie, il est stable et sa performance ne dépend pas des données.'],
            ['Un tri est dit stable quand deux éléments égaux gardent leur ordre d’origine.', ['Vrai', 'Faux'], 0, 'C’est une propriété du tri fusion, utile pour trier successivement sur plusieurs critères.'],
            ['Quand la stratégie « diviser pour régner » devient-elle inefficace ?', ['Quand les sous-problèmes se recouvrent et sont recalculés plusieurs fois', 'Quand les données sont trop petites', 'Quand le tableau est déjà trié', 'Quand la mémoire est limitée'], 0, 'C’est alors la programmation dynamique qui prend le relais.'],
            ['Sur un million d’éléments, un tri quadratique demande environ 10¹² opérations.', ['Vrai', 'Faux'], 0, 'Contre environ 2 × 10⁷ pour un tri en n log n : la différence est de nature, pas de degré.'],
          ],
        },
        {
          titre: 'Programmation dynamique',
          axe: 'Algorithmique',
          lecon: {
            titre: 'Ne jamais calculer deux fois la même chose',
            cours: `La **programmation dynamique** s’applique aux problèmes dont les sous-problèmes **se recouvrent** : les mêmes calculs y reviennent un grand nombre de fois. L’idée est de les **mémoriser**.

## Les deux conditions
| Condition | Ce qu’elle signifie |
| **Sous-structure optimale** | La solution optimale se construit à partir des solutions optimales des sous-problèmes |
| **Chevauchement** des sous-problèmes | Les mêmes sous-problèmes **réapparaissent** |

> Si la première seule est vérifiée, **diviser pour régner** suffit. C’est la **seconde** qui justifie la programmation dynamique.

## Les deux façons de faire
| | **Descendante** (mémoïsation) | **Ascendante** (tabulation) |
| L’écriture | On garde la récursivité naturelle | On **remplit un tableau**, sans récursivité |
| Le mécanisme | Ranger chaque résultat dans un dictionnaire avant de le renvoyer | Aller des plus petits sous-problèmes vers les plus grands |
| L’avantage | Le code change à peine | Plus rapide, **aucun risque** de dépassement de pile |
| La contrainte | La pile reste limitée | Il faut déterminer soi-même le bon **ordre de remplissage** |

## L’exemple de Fibonacci
| Version | Coût | Appels pour le 30ᵉ terme |
| Naïve | **Exponentiel** | plus d’un **million** |
| Avec mémoïsation | **Linéaire** | **trente** |

> Le même algorithme, plus un dictionnaire, **change de classe de complexité**. C’est l’illustration la plus nette du chapitre.

## Le rendu de monnaie
Rendre une somme avec le moins de pièces possible.

| Méthode | Son résultat |
| L’algorithme **glouton** | Optimal avec le système européen, mais **il échoue** ailleurs |
| La programmation dynamique | **Toujours** l’optimum |

> Avec des pièces de 1, 3 et 4, rendre 6 : le glouton donne 4 + 1 + 1 (**trois** pièces) au lieu de 3 + 3 (**deux**).

La méthode dynamique calcule le nombre minimal de pièces pour **chaque** somme de 0 jusqu’à la somme visée, en réutilisant les résultats précédents.

## Deux autres problèmes classiques
Le **sac à dos** — choisir des objets de valeurs et de poids donnés sans dépasser une capacité — et l’**alignement de séquences** en bio-informatique se traitent de la même façon, par un tableau **à deux dimensions**.

## Le compromis
On échange de la **mémoire** contre du **temps**. Un tableau de taille n coûte de la place, mais évite un nombre **exponentiel** de recalculs.

> Le signal à repérer : dans l’arbre des appels récursifs, **le même argument revient plusieurs fois**. Dès qu’on le voit, un dictionnaire suffit.`,
          },
          questions: [
            ['Quelles sont les deux conditions d’application de la programmation dynamique ?', ['Sous-structure optimale et chevauchement des sous-problèmes', 'Données triées et taille connue', 'Récursivité et cas de base', 'Indépendance des sous-problèmes'], 0, 'C’est le chevauchement qui la distingue de « diviser pour régner ».'],
            ['Qu’est-ce que la mémoïsation ?', ['Garder l’écriture récursive et mémoriser chaque résultat déjà calculé', 'Remplir un tableau du plus petit au plus grand', 'Trier les données avant le calcul', 'Réduire la taille du problème de moitié'], 0, 'C’est l’approche descendante : le code change à peine, le coût s’effondre.'],
            ['Quelle est l’approche ascendante de la programmation dynamique ?', ['Remplir un tableau des plus petits sous-problèmes vers les plus grands', 'Partir du résultat et remonter', 'Appeler la fonction récursivement', 'Diviser le problème en deux'], 0, 'Plus rapide et sans risque de dépassement de pile, mais l’ordre est à déterminer.'],
            ['Quel est le coût de Fibonacci calculé avec mémoïsation ?', ['Linéaire', 'Exponentiel', 'Quadratique', 'Logarithmique'], 0, 'Chaque terme n’est calculé qu’une seule fois.'],
            ['L’algorithme glouton donne toujours l’optimum pour le rendu de monnaie.', ['Vrai', 'Faux'], 1, 'Avec des pièces de 1, 3 et 4, rendre 6 lui fait choisir trois pièces au lieu de deux.'],
            ['Que troque-t-on en programmation dynamique ?', ['De la mémoire contre du temps', 'Du temps contre de la précision', 'De la lisibilité contre de la sécurité', 'Rien du tout'], 0, 'Sur des tailles réalistes, l’échange est presque toujours favorable.'],
            ['Quel signal doit faire penser à la programmation dynamique ?', ['Le même argument revient plusieurs fois dans l’arbre des appels récursifs', 'Le tableau est trié', 'La fonction est très longue', 'Les données sont volumineuses'], 0, 'Dès qu’on le repère, un dictionnaire de mémoïsation suffit.'],
            ['Le problème du sac à dos se résout par programmation dynamique.', ['Vrai', 'Faux'], 0, 'À l’aide d’un tableau à deux dimensions : objets en lignes, capacités en colonnes.'],
          ],
        },
        {
          titre: 'Recherche de sous-chaîne',
          axe: 'Algorithmique',
          lecon: {
            titre: 'Retrouver un motif dans un texte, sans tout relire',
            cours: `Chercher un **motif** de longueur m dans un **texte** de longueur n est l’opération la plus fréquente de l’informatique : chaque recherche dans un document, chaque filtre, chaque analyse de séquence génétique la met en jeu.

## Les trois algorithmes
| Algorithme | Son coût | Son idée |
| **Naïf** | jusqu’à **m × n** | Décaler d’un cran à chaque échec |
| **Boyer-Moore-Horspool** | m × n en pire cas, très rapide en pratique | Comparer **de droite à gauche**, sauter d’un bloc |
| **Knuth-Morris-Pratt** | **n + m**, garanti | Ne **jamais revenir en arrière** dans le texte |

## L’algorithme naïf
On aligne le motif sur la première position, on compare caractère par caractère, et au moindre désaccord on décale **d’un cran** en repartant du début du motif.

| Avantage | Pire cas |
| Aucun prétraitement, cinq lignes de code | Un texte fait d’une lettre répétée et un motif presque identique : chaque alignement va **presque au bout** avant d’échouer |

> Ce qu’il gaspille : à chaque échec, il **oublie tout** ce qu’il vient d’apprendre. Or les caractères déjà comparés renseignent — certains décalages sont **impossibles**.

## Boyer-Moore-Horspool
| Idée | Ce qu’elle permet |
| Comparer le motif **de droite à gauche** | L’échec survient plus tôt |
| Une **table de décalage** calculée sur le motif | En cas d’échec, on décale d’après le caractère fautif du texte |

> Si ce caractère **n’apparaît pas** dans le motif, on décale d’un coup de la **longueur entière** du motif : des positions sont écartées **sans jamais être examinées**. D’où sa rapidité sur du texte naturel — d’autant plus grande que le motif est long.

## Knuth-Morris-Pratt
Il précalcule, pour chaque préfixe du motif, la **longueur du plus long préfixe qui est aussi un suffixe**. Cette table permet, en cas d’échec, de reprendre au bon endroit sans jamais reculer dans le texte.

> Coût **n + m** dans **tous** les cas : linéaire, **garanti**.

## Le prétraitement
Les deux algorithmes efficaces partagent le même principe : **investir** un calcul sur le motif — en m opérations — pour économiser ensuite sur le texte. Rentable dès que le texte est bien plus long que le motif, ce qui est le cas usuel.

## Choisir
| La situation | L’algorithme |
| Motif court, texte court, code à écrire vite | Le **naïf** |
| Texte naturel, motif long, recherche unique | **Boyer-Moore** |
| Garantie de performance, motif très répétitif | **Knuth-Morris-Pratt** |
| Recherches nombreuses dans un texte **fixe** | Construire un **index** une fois pour toutes |

> Le fil commun de tout le chapitre d’algorithmique : **ne pas refaire ce qui a déjà été fait**. Diviser pour régner évite de tout examiner, la programmation dynamique évite de recalculer, la recherche de motif évite de recomparer.`,
          },
          questions: [
            ['Quel est le coût de l’algorithme naïf de recherche de sous-chaîne dans le pire cas ?', ['m × n comparaisons', 'n comparaisons', 'log n comparaisons', 'm + n comparaisons'], 0, 'Chaque alignement peut aller presque au bout du motif avant d’échouer.'],
            ['Dans quel sens l’algorithme de Boyer-Moore compare-t-il le motif ?', ['De droite à gauche', 'De gauche à droite', 'Du milieu vers les bords', 'Dans un ordre aléatoire'], 0, 'C’est ce qui permet les grands décalages en cas d’échec.'],
            ['De combien peut-on décaler en Boyer-Moore quand le caractère fautif n’apparaît pas dans le motif ?', ['De la longueur entière du motif', 'D’un caractère', 'De la moitié du motif', 'On ne peut pas décaler'], 0, 'Des positions sont ainsi écartées sans jamais être examinées.'],
            ['Quel est le coût garanti de l’algorithme de Knuth-Morris-Pratt ?', ['n + m dans tous les cas', 'm × n dans le pire cas', 'log n en moyenne', 'n² dans le pire cas'], 0, 'Il ne revient jamais en arrière dans le texte.'],
            ['Que précalcule Knuth-Morris-Pratt ?', ['Pour chaque préfixe du motif, le plus long préfixe qui est aussi un suffixe', 'La position de chaque caractère du texte', 'Le nombre d’occurrences attendues', 'La table des décalages par caractère'], 0, 'La table de décalage par caractère est celle de Boyer-Moore.'],
            ['Le prétraitement du motif n’est rentable que si le texte est bien plus long que le motif.', ['Vrai', 'Faux'], 0, 'On investit m opérations pour économiser ensuite sur les n caractères du texte.'],
            ['Que faire si l’on doit effectuer de très nombreuses recherches dans un texte fixe ?', ['Construire un index une fois pour toutes', 'Utiliser l’algorithme naïf', 'Trier le texte', 'Découper le texte en deux'], 0, 'Relire le texte à chaque recherche serait du gaspillage.'],
            ['L’algorithme naïf tire parti des caractères déjà comparés lors d’un échec.', ['Vrai', 'Faux'], 1, 'Il oublie tout et décale d’un seul cran : c’est exactement ce que KMP corrige.'],
          ],
        },
      ],
    },
  ],
}
