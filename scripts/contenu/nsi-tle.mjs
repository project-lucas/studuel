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
            cours: `Un appareil connecté superpose plusieurs couches : du circuit électronique jusqu’à l’application, chacune ne connaît que sa voisine immédiate.

## Le matériel
Le **processeur** exécute les instructions ; la **mémoire vive** stocke ce qui est en cours d’exécution et disparaît à l’extinction ; le **stockage** persistant conserve les données ; les **périphériques** assurent les entrées-sorties. Sur un objet connecté, tout cela tient dans un **système sur puce**.

## Le système d’exploitation
Il est l’intermédiaire obligé entre les programmes et le matériel. Ses quatre fonctions :
- **ordonnancer** les processus : donner à chacun son tour de processeur, ce qui crée l’illusion du parallélisme ;
- **gérer la mémoire** : allouer, libérer, isoler les processus les uns des autres ;
- **gérer le système de fichiers** ;
- **gérer les droits** : chaque fichier a un propriétaire et des permissions (lecture, écriture, exécution).

Un **processus** est un programme en cours d’exécution, avec son espace mémoire propre. Deux processus qui s’attendent mutuellement produisent un **interblocage** (*deadlock*) : chacun détient la ressource que l’autre demande.

## Le modèle en couches d’un réseau
Le modèle **TCP/IP** en compte quatre :
1. **accès réseau** : la transmission physique et locale (Ethernet, Wi-Fi) ;
2. **Internet** : l’**adressage** et le **routage** des paquets (protocole **IP**) ;
3. **transport** : la remise des données entre applications (**TCP** ou **UDP**) ;
4. **application** : HTTP, DNS, SMTP.

Chaque couche **encapsule** les données de la couche supérieure en y ajoutant son en-tête. À l’arrivée, on retire les en-têtes dans l’ordre inverse.

## Le routage
Internet transporte des **paquets** indépendants, chacun trouvant sa route de proche en proche. Les **routeurs** consultent une table de routage et transmettent au voisin le plus proche de la destination.

- **RIP** choisit la route au plus petit nombre de sauts, avec une limite à 15 : simple, mais aveugle au débit ;
- **OSPF** attribue un coût à chaque lien (lié au débit) et calcule le plus court chemin par l’algorithme de **Dijkstra** : plus efficace, plus complexe.

## TCP et UDP
- **TCP** établit une connexion, numérote les segments, retransmet ce qui manque et remet les données dans l’ordre : **fiable**, mais plus lent ;
- **UDP** envoie sans garantie ni accusé de réception : **rapide**, adapté au direct vidéo ou au jeu en ligne, où une donnée en retard ne sert plus à rien.

> Le protocole ne décide pas de ce qu’on transporte, mais de ce qui se passe quand un paquet se perd. C’est la seule différence qui compte pour choisir entre TCP et UDP.`,
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
            cours: `La sécurité d’un échange repose sur trois garanties distinctes : la **confidentialité** (personne d’autre ne lit), l’**intégrité** (rien n’a été modifié), l’**authenticité** (l’interlocuteur est bien celui qu’il prétend être).

## Le chiffrement symétrique
Une **même clé** sert à chiffrer et à déchiffrer (AES). Rapide et adapté à de gros volumes, mais il pose le **problème de l’échange de clé** : comment transmettre la clé sans qu’elle soit interceptée ?

## Le chiffrement asymétrique
Chaque personne détient une **paire de clés** :
- la **clé publique**, diffusée à tous : elle sert à **chiffrer** un message qui lui est destiné ;
- la **clé privée**, gardée secrète : elle seule permet de **déchiffrer**.

Le problème de l’échange disparaît. En contrepartie, le calcul est bien plus lent. D’où l’usage réel : l’asymétrique sert à **échanger une clé de session symétrique**, et tout le reste de la communication est symétrique. C’est ce que fait **HTTPS** à chaque connexion.

## La signature numérique
Le mécanisme est **inversé** : l’émetteur chiffre avec sa **clé privée** l’empreinte du message ; n’importe qui peut la vérifier avec sa **clé publique**. Cela ne protège rien du regard, mais prouve l’**origine** et l’**intégrité**.

## Les fonctions de hachage
Une fonction de hachage (SHA-256) transforme un message de taille quelconque en une **empreinte** de taille fixe. Elle est **à sens unique** (impossible de remonter au message) et la moindre modification change entièrement l’empreinte. Elle sert à vérifier l’intégrité et à stocker les mots de passe — jamais en clair, et toujours avec un **sel** aléatoire pour empêcher les attaques par dictionnaire précalculé.

## Le certificat et les autorités de certification
Rien n’empêche un attaquant de publier une clé publique en se faisant passer pour un autre. Un **certificat** lie une clé publique à une identité et il est **signé** par une **autorité de certification** en laquelle le navigateur a confiance. Le cadenas de la barre d’adresse ne dit qu’une chose : la chaîne de certificats remonte à une autorité connue.

## Les attaques au programme
- l’**homme du milieu** : l’attaquant s’intercale et relaie les messages en les lisant ;
- l’**hameçonnage** : obtenir des identifiants par une fausse page ;
- le **déni de service distribué** : saturer un serveur de requêtes ;
- l’**injection SQL** : voir le chapitre sur les bases de données ;
- les **rançongiciels**, qui chiffrent les données de la victime.

## Les protections d’un réseau
Pare-feu (filtrage des ports), VPN (tunnel chiffré), segmentation du réseau, mises à jour, authentification à plusieurs facteurs. Le maillon le plus faible reste l’utilisateur : la majorité des intrusions commencent par un courriel.

> Chiffrer avec la clé publique = confidentialité. Chiffrer avec la clé privée = signature. C’est la seule chose à ne pas confondre dans ce chapitre.`,
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
            cours: `Une structure de données se choisit d’après les **opérations** qu’on va lui demander, jamais d’après ce qu’elle contient. Le programme distingue le **type abstrait** — ce qu’une structure promet — de son **implémentation** — la façon dont la promesse est tenue.

## Le type abstrait
Un type abstrait de données définit un **jeu d’opérations** et leur comportement, sans dire comment elles sont réalisées. Une **pile** promet d’empiler, de dépiler et de tester si elle est vide ; qu’elle repose sur une liste ou sur un tableau ne regarde pas celui qui l’utilise. C’est le principe d’**encapsulation** appliqué aux données.

## La pile (LIFO)
Dernier entré, premier sorti. Opérations : **empiler**, **dépiler**, **sommet**, **est_vide**. Usages : évaluation d’une expression, vérification du bon parenthésage, historique de navigation, et surtout la **pile d’appels** d’un programme récursif.

## La file (FIFO)
Premier entré, premier sorti. Opérations : **enfiler**, **défiler**, **est_vide**. Usages : file d’attente, tampon d’impression, ordonnancement des tâches, et le **parcours en largeur** d’un graphe ou d’un arbre.

## La liste chaînée
Chaque **maillon** contient une valeur et une référence vers le suivant. Insérer ou supprimer en tête coûte un temps **constant**, mais accéder au i-ième élément demande de parcourir la chaîne : coût **linéaire**. C’est l’inverse du tableau.

## Le tableau (liste Python)
Accès direct à l’indice i en temps **constant**, mais insertion en début coûteuse, puisqu’il faut décaler tout le reste.

## Le dictionnaire
Il associe une **clé** à une **valeur**. Grâce au **hachage**, la recherche, l’insertion et la suppression se font en temps **constant en moyenne**. C’est la structure à choisir dès qu’on cherche « la valeur associée à » plutôt que « le i-ième élément ».

## Choisir
- beaucoup d’accès par indice → **tableau** ;
- beaucoup d’insertions et suppressions aux extrémités → **liste chaînée**, **pile** ou **file** ;
- recherche par identifiant → **dictionnaire** ;
- relation hiérarchique → **arbre** ; relation quelconque → **graphe**.

> Une structure de données mal choisie ne rend pas un programme faux : elle le rend lent, et sur des données réelles c’est la même chose.`,
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
            cours: `La programmation orientée objet regroupe dans une même entité les **données** et les **opérations** qui les concernent. C’est d’abord une façon d’organiser un programme, pas une technique de calcul.

## Classe et instance
Une **classe** est un modèle : elle décrit des **attributs** (les données) et des **méthodes** (les fonctions qui agissent dessus). Une **instance** est un objet construit sur ce modèle. La classe Compte décrit ce qu’est un compte ; mon compte est une instance.

## Le constructeur
En Python, la méthode spéciale **__init__** est appelée à la création. Le paramètre **self** désigne l’instance en cours : il permet à une méthode de lire et de modifier les attributs de l’objet sur lequel elle est appelée. Écrire un attribut sans self, c’est créer une variable locale qui disparaîtra à la fin de la méthode — l’erreur la plus fréquente des débutants.

## Attribut d’instance, attribut de classe
Un attribut d’instance appartient à un objet ; un **attribut de classe** est partagé par tous les objets de la classe (un compteur d’instances, une constante).

## L’encapsulation
Les attributs ne devraient pas être manipulés directement de l’extérieur : on passe par des **méthodes d’accès** (*getters*) et de **modification** (*setters*), qui peuvent vérifier la validité de ce qu’on écrit. Python ne l’impose pas — un attribut préfixé d’un souligné signale par **convention** qu’il est interne. La discipline vient du programmeur, pas du langage.

L’intérêt : on peut changer la représentation interne d’une classe sans casser le code qui l’utilise, tant que les méthodes gardent le même comportement. C’est ce qui rend un programme modifiable.

## L’héritage
Une classe peut **hériter** d’une autre : elle en reprend attributs et méthodes, et peut en ajouter ou en **redéfinir**. La relation exprime un « est un » : un CompteEpargne **est un** Compte. Quand la relation est un « a un » (une voiture a un moteur), il faut préférer la **composition** — un attribut qui est lui-même un objet.

## Le polymorphisme
Deux classes différentes peuvent proposer une méthode de même nom, chacune avec son propre code. Le même appel produit alors un comportement adapté au type réel de l’objet, sans que l’appelant ait besoin de le savoir. C’est ce qui permet d’écrire un traitement unique pour une collection d’objets hétérogènes.

## Le lien avec les structures de données
La POO est la façon naturelle d’implémenter un type abstrait : une classe Pile expose empiler et dépiler, et cache le tableau ou la liste chaînée qui les réalise. Changer l’implémentation ne change rien pour l’utilisateur.

> Une classe bien conçue se juge à ce qu’elle **cache**, pas à ce qu’elle expose. C’est le critère qui distingue un objet d’un simple regroupement de variables.`,
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
            cours: `Un **arbre** organise des données par une relation hiérarchique. Sa force est qu’à chaque nœud, on écarte une partie de l’ensemble sans l’examiner.

## Le vocabulaire
- la **racine** est l’unique nœud sans parent ;
- une **feuille** est un nœud sans enfant ;
- la **taille** est le nombre de nœuds ;
- la **hauteur** est la longueur du plus long chemin de la racine à une feuille (par convention, un arbre réduit à sa racine a une hauteur de 0, un arbre vide de −1) ;
- un **sous-arbre** est l’arbre formé par un nœud et sa descendance.

## L’arbre binaire
Chaque nœud a **au plus deux** enfants, gauche et droit. Un arbre binaire de hauteur h contient **au plus 2^(h+1) − 1** nœuds. Inversement, un arbre binaire à n nœuds a une hauteur d’au moins log₂(n) : c’est cette borne qui fonde toute l’efficacité des arbres.

Sa définition est naturellement **récursive** : un arbre binaire est soit vide, soit un nœud portant une valeur et deux arbres binaires.

## L’arbre binaire de recherche
Un **ABR** ajoute une contrainte d’ordre : pour tout nœud, **toutes** les valeurs du sous-arbre gauche lui sont inférieures, et **toutes** celles du sous-arbre droit lui sont supérieures.

Rechercher une valeur revient alors à descendre : comparer, choisir un côté, recommencer. Le coût est proportionnel à la **hauteur**, donc **logarithmique** si l’arbre est équilibré. Mais si l’on insère des valeurs déjà triées, l’arbre **dégénère en peigne** : la hauteur devient n et la recherche redevient linéaire. C’est le piège classique du chapitre — et la raison d’être des arbres équilibrés.

## Les parcours
- **infixe** (gauche, nœud, droite) : sur un ABR, il produit les valeurs **triées** ;
- **préfixe** (nœud, gauche, droite) : sert à copier ou sérialiser un arbre ;
- **suffixe** (gauche, droite, nœud) : sert à libérer ou évaluer une expression ;
- **en largeur** : niveau par niveau, à l’aide d’une **file**.

Les trois premiers s’écrivent naturellement de façon **récursive** ; le dernier est itératif.

## À quoi servent les arbres
Systèmes de fichiers, arborescence d’un document, arbres de décision en apprentissage automatique, index de bases de données, compression de Huffman, arbres syntaxiques d’un compilateur.

> Retenir la chaîne : hauteur logarithmique → recherche logarithmique. Tout l’intérêt d’un arbre disparaît dès qu’il n’est plus équilibré.`,
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
            cours: `Un **graphe** décrit des objets — les **sommets** — reliés par des **arêtes**. Contrairement à l’arbre, aucune hiérarchie n’est imposée, et les cycles sont permis.

## Le vocabulaire
- **orienté** ou **non orienté**, selon que la relation a un sens (« suit sur un réseau social ») ou non (« est ami avec ») ;
- **pondéré** quand chaque arête porte une valeur (distance, coût, débit) ;
- le **degré** d’un sommet est son nombre de voisins ;
- un **chemin** est une suite d’arêtes consécutives, un **cycle** un chemin qui revient à son point de départ ;
- un graphe est **connexe** si tout sommet est atteignable depuis tout autre.

## Les deux représentations
**Matrice d’adjacence** : un tableau n × n où la case (i, j) vaut 1 s’il existe une arête de i vers j. Test d’adjacence en temps **constant**, mais occupation mémoire en **n²** — inadaptée à un graphe **creux** (peu d’arêtes).

**Liste d’adjacence** : à chaque sommet, la liste de ses voisins. Occupation proportionnelle au nombre d’arêtes, parcours des voisins immédiat, mais test d’adjacence plus coûteux. C’est la représentation à choisir dès que le graphe est grand et creux — le cas de presque tous les graphes réels.

## Les deux parcours
- **en largeur** (BFS) : on visite tous les voisins avant d’aller plus loin, à l’aide d’une **file**. Sur un graphe **non pondéré**, il donne le **plus court chemin** en nombre d’arêtes ;
- **en profondeur** (DFS) : on s’enfonce le plus loin possible avant de revenir, à l’aide d’une **pile** ou par récursivité. Il sert à détecter les **cycles**, à trouver les composantes connexes et à faire un tri topologique.

Dans les deux cas, il faut **marquer les sommets visités** : sans cela, le moindre cycle fait boucler le programme indéfiniment. C’est l’erreur la plus fréquente à l’écrit.

## Le plus court chemin pondéré
BFS ne suffit plus dès que les arêtes portent des poids. **Dijkstra** traite ce cas en choisissant à chaque étape le sommet non traité le plus proche — à condition que tous les poids soient **positifs**. C’est l’algorithme du GPS et du protocole de routage OSPF.

## Les usages
Réseaux sociaux, cartographie et itinéraires, routage réseau, ordonnancement de tâches, moteurs de recherche, résolution de jeux.

> Le choix de la représentation décide de la complexité du programme avant même que le premier algorithme soit écrit : matrice pour un graphe dense et petit, listes pour tout le reste.`,
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
Stocker tout dans une seule table crée trois anomalies :
- **redondance** : la même information est répétée à chaque ligne ;
- **anomalie de mise à jour** : corriger une adresse oblige à la corriger partout, et une occurrence oubliée rend la base incohérente ;
- **anomalie d’insertion et de suppression** : on ne peut pas enregistrer un professeur qui n’a pas encore de classe, et supprimer la dernière ligne d’un élève efface aussi les informations de sa classe.

## Le modèle relationnel
Proposé par **Codd** en 1970, il repose sur des **relations** — des tables — composées d’**attributs** (les colonnes) et d’**enregistrements** (les lignes). Chaque attribut a un **domaine** : un type de valeurs admissibles.

## Le schéma relationnel
Il énumère les tables, leurs attributs et leurs contraintes. On l’écrit sous la forme :

eleve(**id**, nom, prenom, date_naissance, #classe_id)

où le gras marque la clé primaire et le dièse une clé étrangère.

## Les contraintes d’intégrité
- **clé primaire** : un attribut (ou un groupe) qui identifie **de façon unique** chaque enregistrement. Elle ne peut être ni nulle ni dupliquée ;
- **clé étrangère** : un attribut qui **référence** la clé primaire d’une autre table. C’est elle qui relie les tables entre elles ;
- **intégrité référentielle** : une clé étrangère doit pointer vers un enregistrement qui existe. Elle interdit d’inscrire un élève dans une classe inexistante ;
- **contrainte de domaine** : une note doit être comprise entre 0 et 20 ;
- **unicité** : deux comptes ne peuvent pas partager la même adresse électronique.

## Les relations entre tables
- **un à plusieurs** : une classe compte plusieurs élèves, un élève appartient à une classe. La clé étrangère se place du côté « plusieurs » ;
- **plusieurs à plusieurs** : un élève suit plusieurs matières, une matière est suivie par plusieurs élèves. Elle **exige une table intermédiaire** (dite table de jonction) portant les deux clés étrangères — c’est le point le plus souvent manqué à l’écrit ;
- **un à un** : rare, souvent réductible à une seule table.

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
Chaque colonne reçoit un type : **INTEGER**, **REAL** (ou FLOAT), **TEXT** (ou VARCHAR), **DATE**, **BOOLEAN**. Le type est une **contrainte** : il interdit d’écrire une chaîne dans une colonne numérique, et il conditionne les opérations possibles — additionner deux nombres écrits comme du texte n’a pas de sens.

## La création d’une table
En SQL, la commande **CREATE TABLE** énumère les colonnes, leur type et leurs contraintes :

**CREATE TABLE** eleve (id **INTEGER PRIMARY KEY**, nom **TEXT NOT NULL**, classe_id **INTEGER REFERENCES** classe(id))

Les mots-clés à connaître : **PRIMARY KEY**, **NOT NULL**, **UNIQUE**, **DEFAULT**, **CHECK**, **REFERENCES** (ou FOREIGN KEY).

## La valeur NULL
NULL n’est **ni zéro ni la chaîne vide** : c’est l’absence de valeur. Toute comparaison avec NULL renvoie « inconnu », y compris NULL = NULL. On teste donc avec **IS NULL** et **IS NOT NULL**, jamais avec l’égalité — piège récurrent des sujets.

## La normalisation
Décomposer les tables pour éliminer la redondance. Le programme s’en tient à l’essentiel : chaque information est stockée **une seule fois**, et chaque table décrit **une seule entité**. Une table qui mêle élève et classe est à découper.

## Les index
Un **index** est une structure auxiliaire (souvent un arbre équilibré) qui accélère la recherche sur une colonne. Il fait passer une recherche d’un coût linéaire à un coût logarithmique. Son prix : de l’espace disque, et un ralentissement des insertions, puisque l’index doit être tenu à jour. On indexe donc les colonnes très souvent interrogées, pas toutes.

La clé primaire est indexée automatiquement.

## Les vues
Une **vue** est une requête enregistrée sous un nom, utilisable comme une table. Elle sert à simplifier des requêtes complexes et à **restreindre l’accès** : on donne accès à une vue qui ne montre que certaines colonnes plutôt qu’à la table entière.

## Les droits
Un SGBD gère des utilisateurs et des permissions : **GRANT** attribue un droit (SELECT, INSERT, UPDATE, DELETE), **REVOKE** le retire. Le principe de moindre privilège s’applique : une application qui ne fait que lire ne doit disposer que du droit de lecture.

> Un schéma sans contraintes n’est pas un schéma : c’est un tableur. Ce sont les contraintes qui empêchent une base d’accumuler des données fausses.`,
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

## Ce que le SGBD prend en charge
- l’**exécution des requêtes** et leur optimisation (choisir le meilleur plan d’exécution) ;
- le **contrôle des accès concurrents** : plusieurs clients écrivent en même temps sans se corrompre ;
- la **gestion des droits** par utilisateur ;
- la **persistance** et la **reprise après panne** ;
- le **respect des contraintes d’intégrité**, qu’aucune application ne peut contourner.

Le dernier point est décisif : mettre les vérifications dans le SGBD plutôt que dans le code applicatif garantit qu’elles s’appliquent **à tous les clients**, présents et futurs.

## La transaction
Une **transaction** est un ensemble d’opérations traitées comme un **tout indivisible**. L’exemple canonique est le virement : débiter un compte et créditer l’autre doivent réussir ensemble ou échouer ensemble. En SQL, on ouvre la transaction, puis on la valide par **COMMIT** ou on l’annule par **ROLLBACK**.

## Les propriétés ACID
- **Atomicité** : tout ou rien ;
- **Cohérence** : la base passe d’un état valide à un autre état valide, contraintes respectées ;
- **Isolation** : deux transactions simultanées se déroulent comme si elles étaient successives ;
- **Durabilité** : une fois validée, une transaction survit à une panne — c’est le rôle du **journal** des transactions, écrit avant les données elles-mêmes.

## Les accès concurrents
Sans isolation, deux clients qui lisent puis modifient la même ligne peuvent écraser mutuellement leur travail. Le SGBD emploie des **verrous** ou un mécanisme de versions. Deux transactions qui s’attendent produisent un **interblocage**, que le SGBD détecte et résout en annulant l’une d’elles.

## L’architecture client-serveur
Le SGBD est un **serveur** ; les applications sont des **clients** qui lui envoient des requêtes par le réseau. Les avantages : centralisation de la donnée, un seul point de sauvegarde, cohérence garantie, accès simultané de plusieurs applications. La contrepartie : le serveur est un point de défaillance unique et une cible.

## Quelques SGBD
**PostgreSQL** et **MySQL** (serveurs, multi-utilisateurs), **SQLite** (embarqué, sans serveur, dans les téléphones et les navigateurs), **Oracle** et **SQL Server** (propriétaires). Les bases dites **NoSQL** renoncent à une partie du modèle relationnel pour gagner en volume et en répartition.

> Une contrainte écrite dans l’application protège cette application. Une contrainte écrite dans le SGBD protège la base — donc toutes les applications, y compris celles que personne n’a encore écrites.`,
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
            cours: `SQL est un langage **déclaratif** : on décrit le résultat souhaité, et le SGBD choisit lui-même comment l’obtenir. C’est ce qui le distingue de Python.

## Les deux familles de commandes
- la **définition** des données : CREATE TABLE, ALTER TABLE, DROP TABLE ;
- la **manipulation** des données : SELECT, INSERT, UPDATE, DELETE.

## L’interrogation
La forme de base :

**SELECT** nom, moyenne **FROM** eleve **WHERE** moyenne >= 15 **ORDER BY** moyenne **DESC**

- **SELECT** choisit les colonnes ; l’étoile les prend toutes, ce qu’il vaut mieux éviter en production ;
- **FROM** désigne la ou les tables ;
- **WHERE** filtre les lignes ;
- **ORDER BY** trie, en ASC (par défaut) ou DESC ;
- **DISTINCT** élimine les doublons ; **LIMIT** borne le nombre de résultats.

Dans WHERE : les opérateurs de comparaison, **AND**, **OR**, **NOT**, **BETWEEN**, **IN**, **LIKE** (avec le caractère joker pour-cent), **IS NULL**.

## L’insertion, la modification, la suppression
**INSERT INTO** eleve (nom, classe_id) **VALUES** ('Dupont', 3)

**UPDATE** eleve **SET** moyenne = 14 **WHERE** id = 12

**DELETE FROM** eleve **WHERE** id = 12

⚠️ UPDATE et DELETE **sans WHERE** s’appliquent à **toutes** les lignes de la table. C’est l’erreur la plus coûteuse du langage.

## Les jointures
Une jointure rassemble les lignes de deux tables reliées par une clé étrangère :

**SELECT** eleve.nom, classe.niveau **FROM** eleve **JOIN** classe **ON** eleve.classe_id = classe.id

- **JOIN** (ou INNER JOIN) ne garde que les lignes ayant une correspondance dans les deux tables ;
- **LEFT JOIN** garde toutes les lignes de la table de gauche, en complétant par NULL quand la correspondance manque — c’est ce qu’il faut pour lister les élèves **sans** classe.

Oublier la condition ON produit un **produit cartésien** : chaque ligne de la première table combinée à chaque ligne de la seconde.

## Les agrégats
**COUNT**, **SUM**, **AVG**, **MIN**, **MAX** résument un ensemble de lignes en une valeur. Avec **GROUP BY**, le résumé se fait par groupe :

**SELECT** classe_id, **AVG**(moyenne) **FROM** eleve **GROUP BY** classe_id

**HAVING** filtre **après** le regroupement, là où WHERE filtre **avant**. C’est la distinction la plus demandée en évaluation : WHERE porte sur les lignes, HAVING sur les groupes.

## L’injection SQL
Construire une requête en concaténant une saisie utilisateur permet à un attaquant d’en modifier le sens. La parade n’est ni le filtrage des apostrophes ni la vérification côté navigateur, mais les **requêtes paramétrées**, où la valeur ne peut jamais être interprétée comme du code.

> Ordre logique d’exécution, à connaître : FROM, puis WHERE, puis GROUP BY, puis HAVING, puis SELECT, puis ORDER BY. Il explique à lui seul pourquoi HAVING ne peut pas remplacer WHERE.`,
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

- **ASC** est l’ordre croissant, appliqué par défaut ; **DESC** l’ordre décroissant ;
- on peut trier sur **plusieurs colonnes** : la seconde départage les ex æquo de la première ;
- on peut trier sur une colonne **non affichée**, ou sur le résultat d’un calcul ou d’un agrégat.

Le tri des chaînes suit la **collation** de la base : selon le paramétrage, les majuscules et les accents ne se classent pas de la même façon. Trier un numéro stocké en TEXT le classe alphabétiquement — « 10 » avant « 9 ».

## LIMIT et OFFSET
**SELECT** nom **FROM** eleve **ORDER BY** moyenne **DESC LIMIT** 3

**LIMIT** borne le nombre de lignes, **OFFSET** en saute un certain nombre : ensemble, ils réalisent la **pagination**. Un LIMIT sans ORDER BY renvoie des lignes **arbitraires** : rien n’oblige le SGBD à respecter un ordre qu’on ne lui a pas demandé. C’est une erreur silencieuse, donc redoutable.

## Trier un résultat agrégé
**SELECT** classe_id, **AVG**(moyenne) **AS** moy **FROM** eleve **GROUP BY** classe_id **ORDER BY** moy **DESC**

Le mot-clé **AS** donne un **alias** à une colonne calculée, ce qui permet de la réutiliser dans ORDER BY et rend le résultat lisible.

## Trier n’est pas indexer
ORDER BY ordonne le **résultat d’une requête**, à chaque exécution. Un **index** ordonne durablement une structure auxiliaire. Un tri sur une colonne indexée est bien plus rapide, puisque l’index fournit déjà l’ordre — mais l’index ne change jamais l’ordre de stockage des lignes de la table.

## Le coût du tri
Un tri général coûte de l’ordre de n log n comparaisons — c’est la borne théorique des tris par comparaison. Sur de gros volumes, mieux vaut filtrer **avant** de trier, et ne trier que les colonnes nécessaires : trier un million de lignes pour n’en afficher dix est le gaspillage typique.

## Le lien avec l’algorithmique
Les tris étudiés en NSI (tri par insertion et tri par sélection, en n²) et le tri fusion (en n log n, voir « diviser pour régner ») sont exactement ce que le SGBD implémente sous ORDER BY. La différence : il choisit lui-même l’algorithme selon la taille des données et les index disponibles.

> Un ORDER BY oublié devant un LIMIT donne un résultat qui a l’air juste et qui ne l’est pas. C’est le bug le plus difficile à repérer dans une requête.`,
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
Elle place dans une **même mémoire** les instructions et les données, adressées de la même façon. C’est ce qui permet à un programme d’en lire, d’en écrire, d’en transformer un autre — et donc l’existence des compilateurs, des interpréteurs, des systèmes d’exploitation… et des virus.

## Compilation et interprétation
- un **compilateur** traduit **une fois pour toutes** le code source en code exécutable. L’exécution est rapide, les erreurs de type sont détectées avant l’exécution, mais le résultat est lié à une machine (C, Rust) ;
- un **interpréteur** lit et exécute le code **au fil de la lecture**. Le développement est plus souple et le programme portable, l’exécution plus lente (Python) ;
- des solutions **mixtes** existent : Java compile vers un code intermédiaire, exécuté par une machine virtuelle.

## La fonction, donnée de première classe
Dans un langage comme Python, une fonction peut être **stockée dans une variable**, **passée en argument** et **renvoyée** par une autre fonction. C’est ce qui permet d’écrire un tri qui reçoit sa clé de comparaison, ou une interface graphique qui reçoit le traitement à exécuter au clic.

## Ce que le langage garantit
Le **typage** distingue :
- **statique** (vérifié à la compilation) ou **dynamique** (à l’exécution) ;
- **fort** (pas de conversion implicite hasardeuse) ou **faible**.

Python est à typage **dynamique et fort** : il n’exige pas de déclarer les types, mais refuse d’additionner un entier et une chaîne. Les **annotations de type** sont facultatives et servent à la documentation et aux outils d’analyse — l’interpréteur ne les vérifie pas.

## Les limites théoriques
Puisqu’un programme peut analyser un programme, on pourrait espérer un programme qui détecte tous les bugs. Turing a montré que non : le **problème de l’arrêt** — décider si un programme quelconque s’arrête sur une entrée donnée — est **indécidable**. Aucun algorithme ne peut le résoudre dans tous les cas.

Conséquence directe : aucun outil ne prouvera jamais automatiquement qu’un programme quelconque est correct. Tester reste indispensable.

## Données et représentation
Une même suite de bits ne veut rien dire hors du **type** qu’on lui attribue : elle peut être un entier, un flottant, un caractère ou une instruction. Le type n’est pas dans la donnée, il est dans l’interprétation qu’on en fait.

> « Le programme est une donnée » n’est pas une formule : c’est ce qui rend possible tout ce que fait un ordinateur au-delà du calcul.`,
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
            cours: `Un **paradigme** est une manière de concevoir un programme. Le programme de Terminale en retient quatre — et demande surtout de savoir **lequel choisir**.

## Impératif
Le programme est une **suite d’instructions** qui modifient l’**état** de la machine : affectations, boucles, conditions. C’est le paradigme le plus proche de l’exécution réelle. Son point faible : l’état partagé rend le raisonnement difficile dès que le programme grandit.

## Fonctionnel
Le programme est une **composition de fonctions**. Ses principes :
- **pas d’effet de bord** : une fonction ne modifie rien hors d’elle-même ;
- **transparence référentielle** : le même appel avec les mêmes arguments donne toujours le même résultat, et peut donc être remplacé par sa valeur ;
- **immutabilité** : on crée une nouvelle valeur au lieu de modifier l’ancienne ;
- usage de la **récursivité** plutôt que des boucles.

Conséquence pratique : une fonction pure est **facile à tester** (aucun contexte à préparer) et sûre à exécuter en parallèle.

## Objet
Le programme est un ensemble d’**objets** qui échangent des messages, chacun regroupant données et traitements. Il convient à la modélisation de domaines riches et à la maintenance sur la durée.

## Événementiel
Le programme **réagit** à des événements (clic, message réseau, minuteur) au moyen de **gestionnaires**. Le flot d’exécution n’est plus décidé par le programme mais par ce qui arrive : c’est le paradigme des interfaces graphiques et des serveurs.

## Les paradigmes se mélangent
Python est **multiparadigme** : il permet les quatre. Un programme réel les combine — une interface événementielle, des objets pour le domaine, des fonctions pures pour les calculs, de l’impératif dans les boucles internes.

## Comment choisir
- calcul, transformation de données, besoin de tests fiables → **fonctionnel** ;
- modélisation d’un domaine, code appelé à durer → **objet** ;
- interface, réseau, temps réel → **événementiel** ;
- algorithme court, performance critique → **impératif**.

## Ce que le paradigme change vraiment
Il ne change pas ce que la machine calcule — tous sont équivalents en puissance d’expression. Il change ce que le **lecteur** du code peut comprendre sans tout lire, et donc le coût de la modification. C’est un choix d’ingénierie, pas de mathématiques.

> Un test unitaire est facile à écrire sur une fonction pure et pénible sur du code à état global. Ce seul critère justifie l’essentiel de l’engouement pour le fonctionnel.`,
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
            cours: `Un programme d’un seul bloc devient illisible passé quelques centaines de lignes. La **modularité** consiste à le découper en unités qui se comprennent séparément.

## Les niveaux de découpage
- la **fonction** : une tâche, un nom, des paramètres, une valeur de retour ;
- le **module** : un fichier regroupant des fonctions ou des classes cohérentes entre elles ;
- le **paquet** : un ensemble de modules ;
- la **bibliothèque** : un paquet destiné à être réutilisé par d’autres programmes.

## L’interface et l’implémentation
Un module expose une **interface** — ce qu’il promet — et cache son **implémentation** — la façon dont il tient sa promesse. Celui qui l’utilise ne doit avoir besoin de connaître que la première. C’est ce qui permet de changer l’intérieur sans casser l’extérieur.

## Les deux critères d’un bon découpage
- **forte cohésion** : tout ce qui est dans un module concerne le même sujet ;
- **faible couplage** : les modules dépendent le moins possible les uns des autres.

Un module qui a besoin de connaître l’intérieur d’un autre est mal découpé : toute modification de l’un obligera à modifier l’autre.

## Les importations en Python
Trois formes, aux effets différents :
- importer le module entier, puis préfixer les appels par son nom : la plus lisible ;
- importer un nom précis depuis un module : commode, mais on perd la trace de l’origine ;
- importer tout le contenu d’un module dans l’espace courant : à proscrire, car deux modules peuvent définir le même nom, et le second écrase silencieusement le premier.

## La documentation
Une **docstring** décrit ce que fait une fonction, ses paramètres, sa valeur de retour et ses éventuelles erreurs. Elle est accessible à l’exécution et exploitée par les outils. Une bonne docstring décrit le **contrat**, pas l’algorithme : elle dit ce que la fonction garantit, pas comment elle s’y prend — sinon elle devra être réécrite à chaque modification interne.

## Les préconditions et postconditions
Une **précondition** est ce que l’appelant doit garantir (la liste ne doit pas être vide) ; une **postcondition** ce que la fonction garantit en retour (la liste renvoyée est triée). L’instruction **assert** permet de les vérifier pendant le développement — mais elle n’est pas un mécanisme de gestion d’erreur en production, puisqu’elle peut être désactivée.

## Réutiliser
Le premier réflexe devant un besoin courant est de chercher une bibliothèque existante, éprouvée et testée par d’autres. Écrire soi-même un tri, une date ou une fonction de hachage produit presque toujours un code plus lent et moins sûr.

> Le bon test d’un découpage : peut-on expliquer ce que fait un module en une phrase, sans employer le mot « et » ? Si non, il en contient deux.`,
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
Un nom doit dire **ce que la chose est**, pas ce qu’elle vaut ni comment elle est faite. Une variable nommée nb_eleves_inscrits n’a pas besoin de commentaire ; une variable nommée x en exige un. La règle : plus la portée est large, plus le nom doit être explicite. Un compteur de boucle courte peut s’appeler i.

## Commenter
Un commentaire ne doit pas **répéter** le code, mais expliquer **pourquoi** il est ainsi. « incrémente i » est inutile ; « on saute le premier enregistrement, qui est l’en-tête du fichier » est indispensable. Un commentaire faux est pire que pas de commentaire : il induit en erreur celui qui lui fait confiance.

## Éviter la duplication
Deux morceaux de code identiques évolueront séparément : on corrigera un bug dans l’un et pas dans l’autre. Toute duplication est une **dette** à rembourser en factorisant dans une fonction.

## Écrire des fonctions courtes
Une fonction doit faire **une seule chose**. Si son nom contient « et », elle en fait deux. Une fonction longue est difficile à tester, à nommer et à réutiliser.

## Les tests
Un **test unitaire** vérifie une fonction isolée sur des cas choisis. Il doit couvrir :
- le **cas nominal** ;
- les **cas limites** : liste vide, un seul élément, valeur nulle, borne exacte ;
- les **cas d’erreur** : entrée invalide.

Un test réussi ne prouve pas qu’un programme est correct : il prouve seulement qu’il n’échoue pas sur les cas testés. Dijkstra le formulait ainsi : les tests montrent la présence de bugs, jamais leur absence.

Les tests servent aussi de **filet** : ils permettent de modifier le code sans crainte, ce qui rend la **refactorisation** possible.

## La gestion de versions
Un outil comme **git** enregistre l’historique des modifications, permet de revenir en arrière, de travailler à plusieurs sur le même fichier et de retrouver **quand** et **pourquoi** une ligne a changé. Chaque enregistrement doit être **petit** et porter un message qui explique l’intention.

## La spécification
Avant d’écrire, il faut savoir ce que le programme doit faire — et ce qu’il ne doit pas faire. Un programme conforme à une mauvaise spécification est un programme raté, même sans aucun bug.

> La question à se poser avant de valider une modification : « quelqu’un qui découvre ce fichier comprendra-t-il en une minute ce qu’il fait ? » Si non, ce n’est pas fini.`,
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
            cours: `Corriger un programme est une **enquête** : le message d’erreur signale l’endroit où le problème est devenu visible, presque jamais celui où il a été introduit.

## Les trois familles d’erreurs
- **erreur de syntaxe** : le code ne peut pas être lu. Détectée avant toute exécution, c’est la plus facile ;
- **erreur d’exécution** : le programme s’arrête en cours de route (division par zéro, indice hors bornes, fichier absent). Elle est bruyante, donc repérable ;
- **erreur de logique** : le programme s’exécute sans broncher et donne un **résultat faux**. C’est la plus dangereuse, parce que rien ne la signale.

## La méthode
1. **reproduire** l’erreur de façon fiable, et si possible avec le plus petit cas d’entrée possible ;
2. **localiser** : encadrer la zone où l’état devient incorrect ;
3. **comprendre** la cause, et non seulement le symptôme ;
4. **corriger** ;
5. **ajouter un test** qui échouait avant la correction : c’est ce qui empêche le bug de revenir.

L’étape 5 est celle qu’on saute, et c’est celle qui distingue une correction d’un rafistolage.

## Les outils
- l’**affichage** de valeurs intermédiaires : rudimentaire mais efficace ;
- le **débogueur** : points d’arrêt, exécution pas à pas, inspection des variables ;
- les **assertions**, qui font échouer le programme au moment exact où une hypothèse est violée, plutôt que dix lignes plus loin ;
- la **journalisation**, qui garde une trace en production, là où le débogueur n’est pas disponible.

## Les exceptions
Une **exception** signale une situation anormale. On la **traite** au niveau où l’on sait quoi faire :

essayer d’ouvrir le fichier, et si le fichier est absent, avertir l’utilisateur et proposer un autre chemin.

Deux erreurs opposées à éviter : **attraper toutes les exceptions** sans rien en faire, ce qui masque les bugs au lieu de les traiter ; et **ne rien attraper**, ce qui fait tomber le programme sur une cause prévisible.

Une exception ne doit pas servir de contrôle de flux ordinaire : elle signale l’exceptionnel.

## Les bugs les plus fréquents
Les erreurs de **borne** (le fameux décalage d’un rang), la confusion entre affectation et comparaison, la modification d’une liste **pendant** son parcours, les effets de bord non voulus sur un argument mutable, et l’oubli d’un cas limite (collection vide).

## La complexité comme bug
Un programme correct mais trop lent est inutilisable. Estimer la **complexité** avant de coder évite de découvrir sur des données réelles qu’un algorithme quadratique ne passera jamais à l’échelle.

> Un bug n’est jamais « bizarre » : il est la conséquence exacte de ce qui est écrit. Le moment où l’on cesse de trouver l’ordinateur capricieux est celui où l’on commence à déboguer vraiment.`,
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
            cours: `Un algorithme est **récursif** quand il résout un problème en s’appelant lui-même sur un cas plus petit. Sa correction repose entièrement sur deux éléments.

## Les deux composants obligatoires
- le **cas de base** : la situation où la fonction renvoie une valeur **sans** se rappeler. Sans lui, la récursion ne s’arrête jamais ;
- l’**appel récursif** sur un cas **strictement plus proche** du cas de base. Sans cette décroissance, le cas de base n’est jamais atteint.

Oublier l’un des deux produit une **récursion infinie**, qui se termine par un dépassement de la pile d’appels.

## La pile d’appels
Chaque appel en cours occupe une **place** en mémoire, où sont conservés ses paramètres et l’endroit où reprendre. Les appels s’**empilent** ; ils se dépilent dans l’ordre inverse, du plus profond au plus superficiel. C’est pourquoi la profondeur de récursion est **limitée** : Python la borne par défaut autour de mille appels.

Conséquence : une récursion sur une liste d’un million d’éléments échouera, là où une boucle passera sans difficulté.

## Écrire une fonction récursive
La démarche est toujours la même :
1. identifier le **cas de base** et sa valeur ;
2. supposer que la fonction **fonctionne déjà** pour le cas plus petit — c’est l’acte de foi qui rend la récursivité écrivable ;
3. écrire comment combiner ce résultat avec le cas courant.

Exemples classiques : factorielle, somme des éléments d’une liste, puissance, inversion d’une chaîne, tours de Hanoï, parcours d’arbre.

## Récursivité et arbres
Les structures **récursives par définition** — un arbre est un nœud et deux arbres — se traitent naturellement par récursivité. Un parcours d’arbre écrit en récursif tient en trois lignes, là où sa version itérative exige de gérer explicitement une pile.

## Le piège de la double récursion
La suite de Fibonacci écrite naïvement rappelle deux fois la fonction à chaque niveau : le nombre d’appels **double** à chaque rang et le coût devient exponentiel. Calculer le trentième terme demande plus d’un million d’appels, dont l’immense majorité recalcule ce qui a déjà été calculé. La solution — mémoriser les résultats — est l’objet de la fiche sur la programmation dynamique.

## Récursif ou itératif ?
Ils ont la même puissance : toute fonction récursive peut être réécrite avec une boucle et une pile explicite. Le choix est une question de **lisibilité** — récursif pour les structures récursives, itératif quand la profondeur est grande ou la performance critique.

> La question à se poser devant une fonction récursive : « sur quel argument décroît-elle, et jusqu’où ? » Si la réponse n’est pas immédiate, la fonction est fausse.`,
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
            cours: `**Diviser pour régner** est une stratégie en trois temps : **diviser** le problème en sous-problèmes de même nature, les **résoudre** récursivement, puis **combiner** leurs solutions.

## Les trois étapes
1. **diviser** : découper l’entrée en parties, généralement deux moitiés ;
2. **régner** : résoudre chaque partie par un appel récursif, jusqu’au cas de base ;
3. **combiner** : reconstruire la solution globale à partir des solutions partielles.

C’est la troisième étape qui distingue les algorithmes entre eux : elle est triviale pour la recherche dichotomique, coûteuse pour le tri fusion.

## La recherche dichotomique
Sur un tableau **trié**, on compare la valeur cherchée à l’élément **du milieu** : on écarte alors la moitié du tableau à chaque comparaison. Le coût est **logarithmique** — environ 20 comparaisons pour un million d’éléments, contre un million dans le pire cas d’une recherche séquentielle.

La condition est absolue : le tableau **doit** être trié. Appliquée à un tableau non trié, la recherche dichotomique ne signale rien, elle renvoie simplement un résultat faux.

## Le tri fusion
- **diviser** : couper le tableau en deux moitiés ;
- **régner** : trier chaque moitié récursivement ;
- **combiner** : **fusionner** les deux moitiés triées en parcourant les deux en parallèle et en prenant à chaque étape le plus petit élément disponible.

Coût : **n log n** dans **tous** les cas — log n niveaux de découpage, et n opérations de fusion à chaque niveau. C’est la borne optimale des tris par comparaison.

Son défaut : il utilise un tableau auxiliaire, donc une mémoire supplémentaire proportionnelle à n. Sa qualité : il est **stable** (deux éléments égaux gardent leur ordre d’origine) et sa performance ne dépend pas des données.

## La comparaison avec les tris quadratiques
Le tri par insertion et le tri par sélection coûtent n² : pour un million d’éléments, cela représente 10¹² opérations contre 2 × 10⁷ pour le tri fusion. À l’échelle de données réelles, ce n’est pas une nuance mais la différence entre « instantané » et « impossible ».

## Les autres exemples
L’exponentiation rapide (élever au carré plutôt que multiplier n fois), le tri rapide, la multiplication de Karatsuba, l’enveloppe convexe, la transformée de Fourier rapide.

## Quand la stratégie ne s’applique pas
Il faut que les sous-problèmes soient **indépendants**. Quand ils se recouvrent — quand les mêmes sous-problèmes reviennent plusieurs fois —, diviser pour régner recalcule inutilement, et c’est la **programmation dynamique** qui prend le relais.

> Retenir la mécanique du logarithme : diviser la taille par deux à chaque étape, c’est atteindre 1 en log₂(n) étapes. Tout le chapitre en découle.`,
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
- **sous-structure optimale** : la solution optimale du problème se construit à partir des solutions optimales de ses sous-problèmes ;
- **chevauchement des sous-problèmes** : les mêmes sous-problèmes réapparaissent.

Si la première condition seule est vérifiée, diviser pour régner suffit. C’est la **seconde** qui justifie la programmation dynamique.

## Les deux façons de faire
- **descendante** (mémoïsation) : on garde l’écriture récursive naturelle, et on **range** chaque résultat dans un dictionnaire avant de le renvoyer. À chaque appel, on regarde d’abord si la réponse est déjà connue. Le code change à peine, le coût s’effondre ;
- **ascendante** (tabulation) : on **remplit un tableau** des plus petits sous-problèmes vers les plus grands, sans récursivité. Plus rapide et sans risque de dépassement de pile, mais il faut déterminer soi-même le bon ordre de remplissage.

## L’exemple de Fibonacci
La version naïve recalcule le même terme des milliers de fois : son coût est **exponentiel**. Avec mémoïsation, chaque terme n’est calculé **qu’une fois** : le coût devient **linéaire**. Le trentième terme passe de plus d’un million d’appels à trente.

C’est l’illustration la plus nette du chapitre : le même algorithme, plus un dictionnaire, change de classe de complexité.

## Le rendu de monnaie
Rendre une somme avec le moins de pièces possible. L’algorithme **glouton** — prendre à chaque étape la plus grosse pièce possible — donne l’optimum avec le système européen, mais **échoue** sur d’autres systèmes : avec des pièces de 1, 3 et 4, rendre 6 donne 4 + 1 + 1 (trois pièces) au lieu de 3 + 3 (deux pièces).

La programmation dynamique, elle, donne toujours l’optimum : on calcule le nombre minimal de pièces pour **chaque** somme de 0 jusqu’à la somme visée, en réutilisant les résultats précédents.

## Le sac à dos et l’alignement de séquences
Le **problème du sac à dos** — choisir des objets de valeurs et de poids donnés sans dépasser une capacité — et l’**alignement de séquences** en bio-informatique se traitent de la même façon, par un tableau à deux dimensions.

## Le compromis
On échange de la **mémoire** contre du **temps**. Un tableau de taille n coûte de la place, mais évite un nombre exponentiel de recalculs. Sur des tailles réalistes, l’échange est presque toujours favorable.

> Le signal qui doit faire penser à la programmation dynamique : dans l’arbre des appels récursifs, le même argument revient plusieurs fois. Dès qu’on le repère, un dictionnaire suffit.`,
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

## L’algorithme naïf
On aligne le motif sur la première position du texte, on compare caractère par caractère, et au moindre désaccord on décale le motif **d’un cran** et on recommence depuis le début du motif.

- **coût** : jusqu’à m × n comparaisons dans le pire cas ;
- **pire cas** typique : un texte fait de la même lettre répétée et un motif presque identique — chaque alignement va presque au bout avant d’échouer ;
- **avantage** : il ne demande aucun prétraitement et tient en cinq lignes.

## Ce que le naïf gaspille
À chaque échec, il **oublie tout** ce qu’il vient d’apprendre. Or les caractères déjà comparés renseignent : si les six premiers caractères du motif ont été reconnus avant l’échec, on sait déjà ce que contient cette portion du texte, et certains décalages sont impossibles.

## Boyer-Moore-Horspool
Il apporte deux idées :
- comparer le motif **de droite à gauche** ;
- en cas d’échec, décaler d’après le caractère du texte qui a provoqué l’échec, grâce à une **table de décalage** calculée sur le motif avant la recherche.

Si ce caractère **n’apparaît pas** dans le motif, on peut décaler d’un coup de la **longueur entière** du motif : des positions sont écartées **sans jamais être examinées**. C’est ce qui le rend, en pratique, souvent plus rapide que tous les autres sur du texte naturel — d’autant plus rapide que le motif est long.

En pire cas théorique, son coût reste cependant en m × n.

## Knuth-Morris-Pratt
Il précalcule, pour chaque préfixe du motif, la **longueur du plus long préfixe qui est aussi un suffixe**. Cette table permet, en cas d’échec, de reprendre au bon endroit **sans jamais revenir en arrière dans le texte**. Le coût est **n + m** dans **tous** les cas — donc **linéaire**, garanti.

## Le prétraitement
Les deux algorithmes efficaces partagent le même principe : **investir** un calcul sur le motif (en m opérations) pour économiser ensuite sur le texte. Ce n’est rentable que si le texte est bien plus long que le motif — ce qui est le cas usuel.

## Choisir
- motif court, texte court, code à écrire vite → **naïf** ;
- texte naturel, motif long, recherche unique → **Boyer-Moore** ;
- garantie de performance nécessaire, motif très répétitif → **Knuth-Morris-Pratt** ;
- recherches très nombreuses dans un texte **fixe** → construire un **index** une fois pour toutes, plutôt que de relire le texte à chaque recherche.

> Le fil commun de tout le chapitre d’algorithmique : ne pas refaire ce qui a déjà été fait. Diviser pour régner évite de tout examiner, la programmation dynamique évite de recalculer, la recherche de motif évite de recomparer.`,
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
