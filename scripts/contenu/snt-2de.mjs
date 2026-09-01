// Sciences numériques et technologie — Seconde : LE PROGRAMME COMPLET (23 fiches).
//
// CE QUE REMPLACE CE MODULE. La SNT n'avait que CINQ chapitres, posés par la
// migration 219 (module `snt.mjs`) pour qu'une matière créée vide cesse d'être
// une coquille cliquable : « Internet », « Le Web », « Les réseaux sociaux »,
// « Les données structurées », « Localisation et photographie numérique ».
// Cinq fiches de survol pour les SEPT thèmes du programme officiel.
//
// LE DÉCOUPAGE. Les 7 thèmes du programme — Connecter, Naviguer, Mémoriser et
// traiter, Rassembler, Numériser, Cartographier, Commander — éclatés en leurs
// 23 fiches. Chaque fiche est un chapitre en base ; le THÈME est porté par
// `axe` (colonne `chapters.theme`), qui fait grouper la page matière — cf.
// docs/template-matiere.md. Un seul rayon : pas de `rayon` ici, la page garde
// un onglet Programme unique.
//
// LES CINQ ANCIENS PARTENT (voir `menage`). Aucun de leurs titres n'entre en
// collision avec les 23 neufs, mais tous les cinq sont recouverts : « Internet »
// par les quatre fiches de Connecter, « Le Web » par les cinq de Naviguer, et
// ainsi de suite. Les garder afficherait cinq fiches de survol hors de tout
// chapitre, au-dessus du programme. Le ménage est borné à leurs cinq titres
// exacts et au seul niveau 2de — rejoué, il ne trouve plus rien.
//
// ⚠️ `snt.mjs` reste dans le dépôt : c'est la source de la 219, qui ne doit
// jamais être régénérée autrement. Ce module se génère par
// `--modules snt-2de` ; `--slugs snt` fusionnerait les deux et réécrirait une
// migration déjà collée. Corollaire : rejouer la 219 APRÈS celle-ci
// réinstallerait les cinq fiches de survol — il n'y a aucune raison de le faire.

export default {
  slug: 'snt',
  nom: 'SNT',

  titreMigration: 'SNT 2de — LE PROGRAMME COMPLET (23 fiches)',

  motif: `CONSTAT : la SNT n'avait que CINQ chapitres, posés par la migration 219
pour qu'une matière créée vide cesse d'être une coquille cliquable. Le programme
officiel en compte SEPT thèmes — Connecter, Naviguer, Mémoriser et traiter,
Rassembler, Numériser, Cartographier, Commander — soit 23 fiches. Un élève de
2de qui révisait l'adressage IP, le routage, HTTP, HTML et CSS, l'open data, les
datacenters, les graphes du petit monde, l'histogramme d'une image, le calcul
d'itinéraire ou l'Internet des objets ne trouvait RIEN. Cette migration installe
les 23 fiches, rangées sous leurs 7 thèmes, et retire les 5 fiches de survol que
ce découpage recouvre.`,

  menage: [
    {
      raison: `La colonne chapters.theme (migration 234) conditionne tout ce qui suit :
ce module range ses 23 fiches sous 7 thèmes, et l'INSERT écrit la colonne. Elle
est REPRISE ici en ADD COLUMN IF NOT EXISTS parce qu'on ne peut pas garantir que
la 234 soit passée en production — sans cette reprise, la migration échouerait
sur "column chapters.theme does not exist", les 5 anciens chapitres déjà
supprimés et les 23 neufs pas encore posés : une matière vide.
Le GRANT n'est pas décoratif : la migration 182 a révoqué le SELECT de table sur
chapters (pour cacher mind_map) et ne l'a rendu que colonne par colonne. Une
colonne ajoutée après elle n'hérite d'aucun droit — sans lui, l'app lirait
"permission denied" au lieu du chapitre.`,
      sql: `ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;`,
    },
    {
      raison: `Les 5 chapitres posés par la 219 partent. Aucun n'entre en collision de
titre avec les 23 neufs, mais tous les cinq sont RECOUVERTS : "Internet" par les
quatre fiches de Connecter, "Le Web" par les cinq de Naviguer, "Les réseaux
sociaux" par Rassembler, "Les données structurées" par Mémoriser et traiter,
"Localisation et photographie numérique" par Numériser et Cartographier. Les
garder afficherait cinq fiches de survol hors de tout chapitre, au-dessus du
programme.
L'ordre compte : la file "À revoir" d'abord (review_items.item_id n'a PAS de clé
étrangère), puis les quiz (quizzes.lesson_id est ON DELETE SET NULL : ils
survivraient orphelins à leur chapitre, mais toujours tirables par le moteur de
questions), puis les chapitres, dont les leçons partent en cascade.
Les trois DELETE sont bornés aux CINQ TITRES EXACTS et au seul niveau 2de. Sans
cette borne, un rejeu après coup effacerait les quiz des 23 fiches neuves — le
ménage tourne avant les insertions à CHAQUE passage. Si la 219 n'a jamais été
collée, ces DELETE ne trouvent simplement rien.`,
      sql: `DELETE FROM public.review_items ri
 USING public.quiz_questions qq, public.quizzes qz, public.lessons l,
       public.chapters c, public.subjects s
 WHERE ri.item_kind = 'question'
   AND ri.item_id = qq.id
   AND qq.quiz_id = qz.id
   AND qz.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'snt'
   AND c.level = '2de'
   AND c.title IN ('Internet',
                   'Le Web',
                   'Les réseaux sociaux',
                   'Les données structurées',
                   'Localisation et photographie numérique');

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'snt'
   AND c.level = '2de'
   AND c.title IN ('Internet',
                   'Le Web',
                   'Les réseaux sociaux',
                   'Les données structurées',
                   'Localisation et photographie numérique');

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'snt'
   AND c.level = '2de'
   AND c.title IN ('Internet',
                   'Le Web',
                   'Les réseaux sociaux',
                   'Les données structurées',
                   'Localisation et photographie numérique');`,
    },
  ],

  blocs: [
    {
      niveaux: ['2de'],
      chapitres: [
        // ===================================================================
        // Thème 1 : Connecter
        // ===================================================================
        {
          titre: 'Internet : le réseau des réseaux',
          axe: 'Connecter',
          lecon: {
            titre: 'Personne ne possède Internet',
            cours: `Internet n'est pas une entreprise, ni un ordinateur géant : c'est un réseau de réseaux, formé de millions de réseaux locaux qui acceptent de parler la même langue.

## Une naissance militaire, puis universitaire
| La date | L'étape |
| **1969** | **ARPANET** relie quatre universités américaines ; l'objectif est de faire circuler l'information même si une partie du réseau tombe |
| **1983** | La famille de protocoles **TCP/IP** devient la règle commune : c'est la naissance d'Internet tel qu'on le connaît |

## Le principe de commutation de paquets
| L'étape | Ce qui se passe |
| 1 | Le message est découpé en **paquets** |
| 2 | Chaque paquet voyage **indépendamment**, par le chemin disponible |
| 3 | Les paquets sont **réassemblés** à l'arrivée |

> Si un lien tombe, les paquets suivants passent ailleurs. C'est ce qui rend le réseau **résilient**.

> Internet n'a pas de centre. C'est un choix technique, et c'est aussi ce qui le rend si difficile à couper.

## Les quatre couches du modèle TCP/IP
| La couche | Ce dont elle s'occupe | Ses protocoles |
| **Accès réseau** | Le support physique | Câble, wifi, fibre |
| **Internet** | L'adressage | **IP** |
| **Transport** | L'acheminement | **TCP**, **UDP** |
| **Application** | Ce que voit l'utilisateur | HTTP, SMTP, DNS |

Chaque couche ignore les détails des autres.

## Internet et le Web
| Le terme | Ce qu'il est |
| **Internet** | L'**infrastructure** |
| Le **Web** | Une **application** parmi d'autres, inventée en 1989 par **Tim Berners-Lee** au CERN |

> Le courrier électronique et la messagerie instantanée sont d'autres applications d'Internet, indépendantes du Web.`,
          },
          questions: [
            ['Qu’est-ce qu’Internet ?', ['Un réseau de réseaux reliés par des protocoles communs', 'Un ordinateur central géant', 'Une entreprise américaine', 'Un ensemble de pages web'], 0, 'Aucune entité ne le possède ni ne le contrôle entièrement.'],
            ['Comment s’appelle l’ancêtre d’Internet créé en 1969 ?', ['ARPANET', 'CERN', 'NSFNET', 'MINITEL'], 0, 'Il reliait quatre universités américaines.'],
            ['Qu’est-ce que la commutation de paquets ?', ['Le découpage d’un message en paquets voyageant indépendamment', 'Le chiffrement des messages', 'La compression des fichiers', 'La duplication des serveurs'], 0, 'Les paquets sont réassemblés à l’arrivée.'],
            ['Pourquoi Internet est-il résilient ?', ['Si un lien tombe, les paquets empruntent un autre chemin', 'Parce que les données sont sauvegardées', 'Parce qu’il est chiffré', 'Parce qu’un centre le supervise'], 0, 'L’absence de centre est un choix de conception.'],
            ['Combien de couches compte le modèle TCP/IP ?', ['Quatre', 'Sept', 'Deux', 'Cinq'], 0, 'Accès réseau, Internet, transport, application.'],
            ['Internet et le Web sont deux choses différentes.', ['Vrai', 'Faux'], 0, 'Internet est l’infrastructure, le Web une application parmi d’autres.'],
            ['Qui a inventé le Web en 1989 ?', ['Tim Berners-Lee, au CERN', 'Vinton Cerf', 'Steve Jobs', 'Linus Torvalds'], 0, 'Il y invente aussi le premier navigateur et le premier serveur.'],
            ['En quelle année TCP/IP devient-il le protocole commun d’Internet ?', ['1983', '1969', '1989', '1995'], 0, 'C’est la date de naissance d’Internet au sens actuel.'],
          ],
        },
        {
          titre: 'Adressage (IP)',
          axe: 'Connecter',
          lecon: {
            titre: 'Chaque machine a une adresse',
            cours: `Pour qu'un paquet arrive à destination, il faut savoir où il va. C'est le rôle du protocole IP, qui attribue à chaque machine une adresse unique.

## IPv4 et IPv6
| La version | Sa taille | Son écriture | Son espace |
| **IPv4** | 32 bits | Quatre nombres de 0 à 255, séparés par des points : 192.168.1.10 | Environ **4,3 milliards** — insuffisant depuis longtemps |
| **IPv6** | 128 bits | Hexadécimal, séparé par des deux-points | Gigantesque |

## Réseau et machine
| La partie de l'adresse | Ce qu'elle désigne |
| **Réseau** | Commune à toutes les machines du même réseau local |
| **Hôte** | Propre à chaque machine |

Le **masque de sous-réseau** indique où passe la frontière entre les deux.

> Une adresse IP ne dit pas qui vous êtes : elle dit où joindre la machine que vous utilisez, à cet instant.

## Adresses privées et publiques
| L'adresse | Où elle circule | Un exemple |
| **Privée** | Seulement dans le réseau local | Celles commençant par 192.168 ou 10 |
| **Publique** | Sur Internet | Une seule par foyer, portée par la box |

| Le mécanisme | Son rôle |
| Le **DHCP** | La box attribue automatiquement les adresses privées |
| Le **NAT** | Il traduit les adresses privées vers l'unique adresse publique |

## Le DNS
Le **DNS** est l'annuaire qui traduit un nom de domaine lisible en adresse IP.

> Sans lui, le Web resterait praticable, mais illisible : il faudrait retenir des suites de chiffres.`,
          },
          questions: [
            ['Sur combien de bits une adresse IPv4 est-elle codée ?', ['32 bits', '64 bits', '128 bits', '16 bits'], 0, 'Soit quatre nombres de 0 à 255.'],
            ['Combien d’adresses IPv4 existent environ ?', ['Environ 4,3 milliards', 'Environ 4 millions', 'Un nombre illimité', 'Environ 300 millions'], 0, 'Insuffisant depuis longtemps, d’où IPv6.'],
            ['Sur combien de bits une adresse IPv6 est-elle codée ?', ['128 bits', '32 bits', '64 bits', '256 bits'], 0, 'Elle s’écrit en hexadécimal, séparée par des deux-points.'],
            ['Que sépare le masque de sous-réseau ?', ['La partie réseau et la partie hôte d’une adresse', 'L’adresse publique et l’adresse privée', 'Le nom de domaine et l’adresse IP', 'Le protocole et le port'], 0, 'Il indique quelles machines sont sur le même réseau local.'],
            ['Quel protocole attribue automatiquement une adresse IP à un appareil qui se connecte ?', ['DHCP', 'DNS', 'HTTP', 'FTP'], 0, 'La box l’utilise pour vos appareils domestiques.'],
            ['Une adresse commençant par 192.168 est une adresse privée.', ['Vrai', 'Faux'], 0, 'Elle ne circule pas sur Internet ; le NAT fait la traduction.'],
            ['À quoi sert le DNS ?', ['À traduire un nom de domaine en adresse IP', 'À chiffrer les échanges', 'À router les paquets', 'À attribuer les adresses'], 0, 'C’est l’annuaire d’Internet.'],
            ['Une adresse IP identifie-t-elle une personne ?', ['Non, elle identifie une machine ou un accès à un instant donné', 'Oui, précisément', 'Oui, avec le nom de domaine', 'Non, elle est aléatoire'], 0, 'Elle reste une donnée personnelle au sens du RGPD, car indirectement identifiante.'],
          ],
        },
        {
          titre: 'Routage (TCP)',
          axe: 'Connecter',
          lecon: {
            titre: 'Trouver le chemin, et vérifier que tout est arrivé',
            cours: `Une fois l'adresse connue, il faut acheminer les paquets. Deux mécanismes travaillent ensemble : le routage choisit le chemin, TCP garantit que le message arrive entier.

## Les routeurs
| L'élément | Son rôle |
| Le **routeur** | Il relie deux réseaux et décide, pour chaque paquet, vers quel voisin l'envoyer |
| La **table de routage** | Elle associe des destinations à des directions |
| Les protocoles de routage | **RIP**, **OSPF** en interne ; **BGP** entre les grands opérateurs |

## Le chemin le plus court
| Le critère de coût | Ce qu'il mesure |
| Le nombre de **sauts** | Combien de routeurs traversés |
| Le **débit** disponible | La capacité du lien |
| La **latence** | Le délai |

Une commande **traceroute** permet de visualiser les routeurs traversés.

> Un message envoyé de Lille à Lyon peut passer par Francfort. Le réseau optimise ses coûts, pas la carte.

## Le rôle de TCP
| Ce que TCP fait | Ce que cela garantit |
| Il **numérote** les paquets | La remise dans l'ordre |
| Il attend des **accusés de réception** | La certitude de l'arrivée |
| Il **redemande** les manquants | L'intégralité du message |
| Il ajuste le **débit** | Éviter la congestion |

> C'est ce qui rend fiable un réseau qui, lui, ne l'est pas.

## TCP ou UDP
| Le protocole | Ses garanties | Ses usages |
| **TCP** | Ordre, intégralité, retransmission | Web, courrier, transfert de fichiers |
| **UDP** | Aucune : il envoie sans accusé | Visioconférence, jeu en ligne, streaming |

> En visioconférence, une image perdue vaut mieux qu'une image en retard.`,
          },
          questions: [
            ['Que fait un routeur ?', ['Il choisit vers quel réseau voisin envoyer chaque paquet', 'Il chiffre les données', 'Il attribue les adresses IP', 'Il stocke les pages web'], 0, 'Il s’appuie sur sa table de routage.'],
            ['Qu’est-ce qu’une table de routage ?', ['Une table associant des destinations à des directions à emprunter', 'La liste des sites visités', 'La liste des adresses privées', 'Un annuaire de noms de domaine'], 0, 'Mise à jour par des protocoles comme OSPF ou BGP.'],
            ['Que garantit le protocole TCP ?', ['L’arrivée complète et ordonnée des paquets', 'La rapidité maximale', 'Le chiffrement des échanges', 'L’anonymat de l’expéditeur'], 0, 'Numérotation, accusés de réception, retransmission.'],
            ['Quel protocole est préféré pour le jeu en ligne ou la visioconférence ?', ['UDP', 'TCP', 'DNS', 'DHCP'], 0, 'Mieux vaut une donnée perdue qu’une donnée en retard.'],
            ['Tous les paquets d’un même message suivent-ils le même chemin ?', ['Non, ils peuvent emprunter des routes différentes', 'Oui, toujours', 'Oui, sauf en cas de panne', 'Non, ils suivent tous le plus court en distance'], 0, 'Ils sont réassemblés à l’arrivée.'],
            ['La commande traceroute permet de visualiser les routeurs traversés.', ['Vrai', 'Faux'], 0, 'Elle affiche chaque saut et son temps de réponse.'],
            ['Sur quoi se fonde le choix d’une route ?', ['Un coût calculé : nombre de sauts, débit, latence', 'La distance géographique uniquement', 'Le hasard', 'Le choix de l’utilisateur'], 0, 'Le chemin le plus court n’est pas le plus direct sur la carte.'],
            ['Que fait TCP quand un paquet n’arrive pas ?', ['Il le redemande à l’expéditeur', 'Il abandonne le message', 'Il le remplace par un paquet vide', 'Il change de protocole'], 0, 'L’accusé de réception manquant déclenche la retransmission.'],
          ],
        },
        {
          titre: 'Deux modèles de service : les réseaux client-serveur et pair-à-pair',
          axe: 'Connecter',
          lecon: {
            titre: 'Qui demande, qui fournit',
            cours: `Une fois les machines reliées, reste à décider qui fournit le service. Deux organisations coexistent, aux propriétés très différentes.

## Les deux modèles
| Le critère | **Client-serveur** | **Pair-à-pair** |
| Le principe | Un serveur répond, un client demande | Chaque machine est à la fois client **et** serveur |
| Le contenu | Centralisé sur le serveur | **Réparti** entre les participants |
| Quand la demande augmente | Le serveur **ralentit** | Le réseau **accélère** |
| Son point faible | Un **point unique de défaillance** | Le contrôle des contenus est difficile |
| Ses usages | Web, courrier, applications mobiles | Partage de fichiers, mises à jour de jeux, crypto-monnaies, messageries décentralisées |

> Client-serveur : une bibliothèque. Pair-à-pair : chacun prête ses livres à ses voisins.

## Les faiblesses du serveur
| Le risque | Sa parade |
| La panne | La **réplication** sur plusieurs machines |
| La saturation — le **déni de service** | Les fermes de serveurs |
| L'éloignement géographique | Les réseaux de distribution de contenu |

## Les forces du pair-à-pair
| La force | Sa contrepartie |
| Il résiste à la **censure** | Le retrait d'un contenu illicite est difficile |
| Il résiste à la **panne** | Aucune autorité ne garantit la qualité |
| Il monte en charge naturellement | D'où son usage massif pour le partage illégal d'œuvres protégées |

## En pratique, des modèles mixtes
Beaucoup de services combinent les deux : un **serveur central** pour l'annuaire et l'authentification, du **pair-à-pair** pour le transfert lourd.

> C'est le cas de nombreuses plateformes de visioconférence et de distribution de logiciels.`,
          },
          questions: [
            ['Dans le modèle client-serveur, que fait le serveur ?', ['Il attend des requêtes et y répond', 'Il envoie des données sans être sollicité', 'Il télécharge auprès des clients', 'Il route les paquets'], 0, 'Le client demande, le serveur fournit.'],
            ['Quelle est la principale faiblesse du modèle client-serveur ?', ['Le serveur est un point unique de défaillance', 'Il est trop lent en lecture', 'Il ne permet pas la mise à jour', 'Il ne fonctionne pas sur Internet'], 0, 'Panne ou saturation privent tous les clients du service.'],
            ['Qu’est-ce qu’une attaque par déni de service ?', ['Une saturation volontaire d’un serveur par un flot de requêtes', 'Un vol de mot de passe', 'Un chiffrement des données', 'Une usurpation d’adresse IP'], 0, 'Le service devient indisponible pour les utilisateurs légitimes.'],
            ['Dans un réseau pair-à-pair, quel est le rôle de chaque machine ?', ['Elle est à la fois client et serveur', 'Elle est uniquement cliente', 'Elle est uniquement serveur', 'Elle sert de routeur'], 0, 'Elle télécharge et fournit simultanément.'],
            ['Que se passe-t-il dans un réseau pair-à-pair quand le nombre de participants augmente ?', ['Le réseau devient plus rapide et plus robuste', 'Il ralentit comme un serveur', 'Il se bloque', 'Rien ne change'], 0, 'C’est l’inverse du modèle client-serveur.'],
            ['Le pair-à-pair rend le contrôle des contenus plus difficile.', ['Vrai', 'Faux'], 0, 'D’où son usage pour le partage illégal d’œuvres protégées.'],
            ['Quel service repose sur le modèle client-serveur ?', ['Le Web', 'Une crypto-monnaie', 'Un partage de fichiers en torrent', 'Un réseau maillé décentralisé'], 0, 'Le navigateur est le client, le site le serveur.'],
            ['Un service peut-il combiner les deux modèles ?', ['Oui, serveur central pour l’annuaire et pair-à-pair pour les transferts', 'Non, ils sont incompatibles', 'Oui, mais seulement en local', 'Non, sauf en entreprise'], 0, 'C’est le cas de nombreuses plateformes de visioconférence.'],
          ],
        },

        // ===================================================================
        // Thème 2 : Naviguer
        // ===================================================================
        {
          titre: 'L’hypertexte',
          axe: 'Naviguer',
          lecon: {
            titre: 'Le lien qui a fait le Web',
            cours: `L'hypertexte est l'idée qui distingue le Web de tout ce qui existait avant : un texte dont certains mots renvoient à d'autres documents, atteignables d'un simple clic.

## Une idée plus ancienne que le Web
| La date | Le nom | L'apport |
| **1945** | **Vannevar Bush** | Le Memex, une machine reliant des documents par associations |
| **1965** | **Ted Nelson** | Il invente le mot *hypertexte* |
| **1989** | **Tim Berners-Lee**, au CERN | Un système reliant les documents de laboratoires du monde entier : le Web |

## Les trois inventions fondatrices
| La brique | Ce qu'elle fait |
| L'**URL** | Elle donne une **adresse unique** à chaque ressource |
| Le **HTTP** | Le protocole qui permet de la **demander** |
| Le **HTML** | Le langage qui **décrit** la page et ses liens |

> Un lien hypertexte n'est pas un renvoi de bas de page : c'est une **adresse exécutable**. C'est ce qui change tout.

## Lire une URL
| Le morceau | Ce qu'il indique |
| Le **protocole** | https |
| Le **nom de domaine** | exemple.fr |
| Le **chemin** | Le fichier ou la page visée |
| Les **paramètres**, après un point d'interrogation | Des données transmises à la page |

> Le nom de domaine se lit **de droite à gauche** : extension, domaine, sous-domaine.

## Ce que le lien a produit
Le Web forme un immense **graphe** de pages reliées entre elles.

> Cette structure permet aux moteurs de mesurer la popularité d'une page par le nombre et la qualité des liens qui pointent vers elle. Sans hypertexte, pas de PageRank — et probablement pas de moteur de recherche efficace.`,
          },
          questions: [
            ['Qu’est-ce que l’hypertexte ?', ['Un texte comportant des liens vers d’autres documents', 'Un texte très long', 'Un texte chiffré', 'Un texte enrichi de couleurs'], 0, 'Le lien est une adresse activable.'],
            ['En quelle année Tim Berners-Lee propose-t-il le Web ?', ['1989', '1969', '1945', '1995'], 0, 'Au CERN, pour relier les documents des laboratoires.'],
            ['Quelles sont les trois briques fondatrices du Web ?', ['URL, HTTP et HTML', 'IP, TCP et DNS', 'HTML, CSS et JavaScript', 'DNS, DHCP et NAT'], 0, 'Adresser, transporter, décrire.'],
            ['Que désigne une URL ?', ['L’adresse unique d’une ressource sur le Web', 'Le nom d’un serveur', 'Un protocole de transport', 'Un moteur de recherche'], 0, 'Protocole, domaine, chemin, paramètres.'],
            ['Dans quel sens se lit un nom de domaine ?', ['De droite à gauche : extension, domaine, sous-domaine', 'De gauche à droite', 'Par ordre alphabétique', 'Selon le protocole utilisé'], 0, 'L’extension est la partie la plus générale.'],
            ['Le Web forme un graphe de pages reliées par des liens.', ['Vrai', 'Faux'], 0, 'Cette structure est exploitée par les moteurs de recherche.'],
            ['Qui a imaginé le Memex en 1945 ?', ['Vannevar Bush', 'Ted Nelson', 'Tim Berners-Lee', 'Alan Turing'], 0, 'Une machine reliant les documents par associations.'],
            ['Pourquoi l’hypertexte est-il utile aux moteurs de recherche ?', ['Les liens entrants permettent d’estimer l’importance d’une page', 'Il accélère le chargement', 'Il chiffre le contenu', 'Il compresse les pages'], 0, 'C’est le principe du PageRank.'],
          ],
        },
        {
          titre: 'La page web (HTTP et langages HTML et CSS)',
          axe: 'Naviguer',
          lecon: {
            titre: 'Demander, décrire, habiller',
            cours: `Afficher une page suppose trois choses : un protocole pour la demander, un langage pour en décrire le contenu, un autre pour en régler l'apparence.

## HTTP et HTTPS
Le protocole **HTTP** fonctionne par requête et réponse.

| Le code de réponse | Sa signification |
| **200** | Succès |
| **301** | Redirection |
| **404** | Introuvable |
| **500** | Erreur du serveur |

**HTTPS** ajoute le chiffrement **TLS** : le contenu devient illisible pour un tiers, et l'identité du site est authentifiée par un **certificat**.

## HTML : le contenu et sa structure
| La balise | Ce qu'elle décrit |
| h1 à h6 | Les titres, par niveau |
| p | Un paragraphe |
| ul et li | Une liste et ses éléments |
| a | Un lien |
| img | Une image |
| table | Un tableau |

> Une page bien structurée est lisible par un **lecteur d'écran** et mieux comprise par un moteur de recherche.

## CSS : la présentation
Le **CSS** applique des règles de style à des éléments sélectionnés : couleur, taille, police, marges, disposition.

| Son avantage | Ce qu'il permet |
| Une **seule feuille** de style | Habiller des milliers de pages |
| Les requêtes de média | Adapter l'affichage à la taille de l'écran : le **responsive** |

> HTML dit **ce que sont** les choses ; CSS dit **à quoi elles ressemblent**. Mélanger les deux est la première erreur du débutant.

## Ce qui se passe à l'affichage
1. Le navigateur télécharge le **HTML**.
2. Il construit une représentation de la page.
3. Il télécharge feuilles de style, images et scripts.
4. Il **dessine** le résultat.
5. **JavaScript** peut ensuite modifier la page sans la recharger : c'est ce qui la rend interactive.`,
          },
          questions: [
            ['Que signifie le code HTTP 404 ?', ['La ressource demandée est introuvable', 'La requête a réussi', 'Le serveur a rencontré une erreur', 'La page a été déplacée'], 0, '200 = succès, 301 = redirection, 500 = erreur serveur.'],
            ['Qu’ajoute HTTPS par rapport à HTTP ?', ['Le chiffrement des échanges et l’authentification du site', 'Une meilleure vitesse', 'Une compression des images', 'Un référencement prioritaire'], 0, 'Grâce à TLS et à un certificat.'],
            ['À quoi sert le langage HTML ?', ['À décrire la structure et le contenu d’une page', 'À définir les couleurs et les polices', 'À rendre la page interactive', 'À transporter les données'], 0, 'Il fonctionne à l’aide de balises.'],
            ['À quoi sert le langage CSS ?', ['À définir la présentation des éléments de la page', 'À structurer le contenu', 'À interroger une base de données', 'À router les paquets'], 0, 'Une feuille de style peut habiller des milliers de pages.'],
            ['Quel langage rend une page interactive sans la recharger ?', ['JavaScript', 'HTML', 'CSS', 'HTTP'], 0, 'Il s’exécute dans le navigateur et modifie la page.'],
            ['Une page HTML bien structurée est mieux lue par les lecteurs d’écran.', ['Vrai', 'Faux'], 0, 'L’accessibilité dépend directement de la structure des balises.'],
            ['Comment fonctionne le protocole HTTP ?', ['Par requête du client et réponse du serveur', 'Par diffusion permanente du serveur', 'Par échange direct entre navigateurs', 'Par synchronisation périodique'], 0, 'Chaque ressource fait l’objet d’une requête.'],
            ['Qu’appelle-t-on une page responsive ?', ['Une page dont la mise en forme s’adapte à la taille de l’écran', 'Une page qui se charge vite', 'Une page interactive', 'Une page traduite automatiquement'], 0, 'Obtenue par des règles CSS conditionnelles.'],
          ],
        },
        {
          titre: 'Navigateur web et sécurité sur Internet',
          axe: 'Naviguer',
          lecon: {
            titre: 'La fenêtre par laquelle tout passe',
            cours: `Le navigateur est le logiciel qui demande les pages, les interprète et les affiche. C'est aussi le principal point d'exposition de l'utilisateur.

## Ce que fait un navigateur
| L'étape | Ce qu'elle fait |
| Résoudre le **DNS** | Trouver l'adresse IP du site |
| Envoyer une requête **HTTP** | Demander la page |
| Télécharger les ressources | Images, styles, scripts |
| Exécuter le **JavaScript** | Rendre la page interactive |
| Dessiner la page | L'afficher |

Il gère aussi un **cache**, un **historique**, des **cookies** et des **extensions**.

## Les cookies et le pistage
| Le cookie | Son rôle |
| **Propre au site** | Se souvenir de vous : panier, connexion, préférences |
| **Tiers**, déposé par une régie publicitaire | Suivre votre navigation **d'un site à l'autre** |

Le **RGPD** impose depuis 2018 le consentement libre et éclairé pour les cookies non nécessaires.

> Le service est gratuit parce que l'attention et les données sont le produit. Ce n'est pas un slogan : c'est un modèle économique.

## Les menaces courantes
| La menace | Son mécanisme |
| Le **hameçonnage** | Imiter un site de confiance pour voler des identifiants |
| Les **logiciels malveillants** | Une pièce jointe, un téléchargement |
| Les **rançongiciels** | Chiffrer les fichiers et exiger une rançon |
| Le **wifi public** non chiffré | Les échanges sont exposés |

## Les bons réflexes
| Le réflexe | Ce qu'il protège |
| Vérifier l'adresse et le **cadenas HTTPS** | Avant toute saisie de mot de passe |
| Mettre à jour navigateur et système | Les failles connues sont corrigées |
| Des **mots de passe longs et différents**, avec un gestionnaire | Une fuite n'en compromet qu'un |
| La **double authentification** | Le mot de passe seul ne suffit plus |
| Limiter les **extensions** | Chacune voit tout ce que vous faites |

> La navigation privée n'efface la trace que sur la machine : ni chez le fournisseur d'accès, ni chez le site visité.`,
          },
          questions: [
            ['Qu’est-ce qu’un cookie ?', ['Un petit fichier déposé par un site pour mémoriser des informations', 'Un virus informatique', 'Un fichier de cache d’image', 'Un protocole de transport'], 0, 'Panier, session, préférences, mais aussi pistage.'],
            ['À quoi servent les cookies tiers ?', ['À suivre la navigation d’un utilisateur d’un site à l’autre', 'À accélérer le chargement', 'À chiffrer la connexion', 'À bloquer la publicité'], 0, 'Déposés par des régies présentes sur de nombreux sites.'],
            ['Que impose le RGPD depuis 2018 pour les cookies non nécessaires ?', ['Le consentement libre et éclairé de l’utilisateur', 'Leur interdiction totale', 'Leur suppression chaque semaine', 'Leur déclaration à la CNIL'], 0, 'Refuser doit être aussi simple qu’accepter.'],
            ['Qu’est-ce que le hameçonnage ?', ['Une imitation d’un site de confiance pour voler des identifiants', 'Un chiffrement des fichiers contre rançon', 'Une saturation de serveur', 'Une interception de paquets'], 0, 'Il arrive le plus souvent par courriel ou SMS.'],
            ['Qu’est-ce qu’un rançongiciel ?', ['Un logiciel qui chiffre les fichiers et exige une rançon', 'Un logiciel espion', 'Un bloqueur de publicité', 'Un antivirus payant'], 0, 'La sauvegarde régulière est la meilleure protection.'],
            ['La navigation privée rend anonyme sur Internet.', ['Vrai', 'Faux'], 1, 'Elle efface les traces locales, pas celles du site ni du fournisseur d’accès.'],
            ['Quelle protection ajoute une seconde preuve d’identité à la connexion ?', ['La double authentification', 'Le mot de passe long', 'Le chiffrement du disque', 'Le pare-feu'], 0, 'Un code temporaire ou une clé physique.'],
            ['Que vérifier avant de saisir un mot de passe sur un site ?', ['L’adresse exacte du site et la présence de HTTPS', 'La rapidité de chargement', 'La présence de publicité', 'La langue du site'], 0, 'Un domaine légèrement modifié est le signe classique du hameçonnage.'],
          ],
        },
        {
          titre: 'Moteur de recherche : principes et usages',
          axe: 'Naviguer',
          lecon: {
            titre: 'Comment une requête devient une liste de liens',
            cours: `Un moteur de recherche ne parcourt pas le Web au moment où vous tapez votre requête : il a déjà tout lu, tout rangé, et il interroge son propre index.

## Les trois étapes
| L'étape | Ce qu'elle fait |
| L'**exploration** | Des robots, les *crawlers*, suivent les liens de page en page et téléchargent leur contenu |
| L'**indexation** | Chaque page est analysée et rangée dans un **index inversé** : à chaque mot, la liste des pages où il figure |
| L'**interrogation** | À la requête, le moteur consulte l'index et **classe** les résultats |

## Le classement
| Le critère | Ce qu'il mesure |
| La **pertinence** | Les mots de la requête figurent-ils dans la page, le titre, les liens ? |
| La **popularité** | Le nombre et la qualité des liens entrants |

> C'est le principe du **PageRank** : une page est importante si des pages importantes pointent vers elle.

> Le premier résultat n'est pas la vérité : c'est la réponse la mieux classée par un algorithme dont les critères sont privés.

## Ce qui influence les résultats
| Le facteur | Son effet |
| La **personnalisation** | Selon l'historique et la localisation |
| Les **liens sponsorisés** | Signalés comme publicité |
| Le **référencement** | L'optimisation faite par les sites eux-mêmes |

> Deux personnes tapant la même requête n'obtiennent pas nécessairement la même page de résultats.

## Chercher efficacement
| La technique | Ce qu'elle apporte |
| Des mots **précis** | Moins de bruit |
| Les **guillemets** | Une expression exacte |
| La restriction à un **site** ou à un type de fichier | Un périmètre défini |
| Le filtre par **date** | De l'information récente |

> Et surtout **recouper** : vérifier l'auteur, la date, la source, et croiser avec une autre origine avant de citer.`,
          },
          questions: [
            ['Quelles sont les trois étapes du fonctionnement d’un moteur de recherche ?', ['Exploration, indexation, interrogation', 'Requête, chiffrement, réponse', 'Téléchargement, compression, affichage', 'Filtrage, classement, publication'], 0, 'Tout est indexé avant que vous ne tapiez la requête.'],
            ['Qu’est-ce qu’un crawler ?', ['Un robot qui parcourt le Web en suivant les liens', 'Un moteur de classement', 'Un serveur de cache', 'Un filtre anti-spam'], 0, 'Il alimente l’index du moteur.'],
            ['Qu’est-ce qu’un index inversé ?', ['Une structure associant à chaque mot la liste des pages qui le contiennent', 'La liste des pages classées par date', 'Un annuaire de sites', 'Un historique de navigation'], 0, 'C’est ce qui rend la recherche quasi instantanée.'],
            ['Sur quoi repose le PageRank ?', ['Le nombre et la qualité des liens pointant vers une page', 'Le nombre de mots de la page', 'La date de création du site', 'Le nombre de visiteurs'], 0, 'Une page est importante si des pages importantes la citent.'],
            ['Deux personnes obtiennent-elles les mêmes résultats pour une même requête ?', ['Pas nécessairement, à cause de la personnalisation', 'Oui, toujours', 'Oui, sauf en navigation privée', 'Non, jamais'], 0, 'Historique et localisation influent sur le classement.'],
            ['Les liens sponsorisés doivent être signalés comme publicité.', ['Vrai', 'Faux'], 0, 'La loi impose de distinguer résultats naturels et payants.'],
            ['Comment rechercher une expression exacte ?', ['En la plaçant entre guillemets', 'En la mettant en majuscules', 'En ajoutant un point d’exclamation', 'En la soulignant'], 0, 'Le moteur cherche alors la suite de mots telle quelle.'],
            ['Le premier résultat est-il la réponse la plus fiable ?', ['Non, c’est la mieux classée par un algorithme aux critères privés', 'Oui, par définition', 'Oui, s’il s’agit d’un site officiel', 'Non, c’est toujours une publicité'], 0, 'Recouper les sources reste indispensable.'],
          ],
        },
        {
          titre: 'Le web 2.0, ou web participatif',
          axe: 'Naviguer',
          lecon: {
            titre: 'Quand le lecteur devient auteur',
            cours: `Le premier Web se lisait. À partir des années 2000, il s'écrit : chacun peut publier sans savoir programmer.

## Le basculement
| Le service | Ce qu'il permet |
| **Blogs**, forums | Publier un texte sans savoir coder |
| **Wikis** | Écrire à plusieurs sur la même page |
| **Réseaux sociaux**, plateformes vidéo | Diffuser à un large public |
| Commentaires, avis, cartes collaboratives | Enrichir le contenu des autres |

Le **contenu généré par les utilisateurs** devient majoritaire. Les techniques existaient déjà : ce qui change, c'est l'**interface**.

## Les effets de réseau
| Le mécanisme | Sa conséquence |
| La valeur croît avec le nombre d'utilisateurs | Plus il y a de monde, plus il est coûteux de partir |
| Le coût de sortie | Il favorise la **concentration** en quelques très grands acteurs |

> C'est un mécanisme économique, pas seulement technique.

## L'intelligence collective et ses limites
| L'exemple réussi | Sa condition de réussite |
| **Wikipédia** | Des règles, une vérification, des contributeurs réguliers |
| **OpenStreetMap** | Une communauté qui corrige |
| Les **logiciels libres** | Une gouvernance du projet |

> Une encyclopédie écrite par des inconnus a fini par battre celles écrites par des spécialistes payés. Personne ne l'avait prévu.

Sans ces règles, la contribution ouverte produit vandalisme, désinformation et harcèlement.

## Les enjeux
| L'enjeu | Sa question |
| La **modération** | Quelle responsabilité pour les plateformes ? |
| Le **droit d'auteur** | Quelles licences ? Les **Creative Commons** en proposent |
| Les **données personnelles** | Que devient ce que je publie ? |
| Les **traces** | Chaque publication en laisse |

> Le contributeur n'est jamais seulement un lecteur : il est aussi une source de données monétisées.`,
          },
          questions: [
            ['Qu’est-ce que le web 2.0 ?', ['Un Web où les utilisateurs produisent eux-mêmes le contenu', 'Une nouvelle version du protocole HTTP', 'Le Web chiffré', 'Le Web des objets connectés'], 0, 'Blogs, wikis, réseaux sociaux, plateformes vidéo.'],
            ['Qu’est-ce qu’un effet de réseau ?', ['La valeur d’un service augmente avec le nombre de ses utilisateurs', 'La vitesse augmente avec le débit', 'Le coût baisse avec le volume', 'La sécurité croît avec le chiffrement'], 0, 'Il favorise la concentration en quelques très grands acteurs.'],
            ['Quel projet illustre l’intelligence collective en cartographie ?', ['OpenStreetMap', 'Wikipédia', 'GitHub', 'Creative Commons'], 0, 'Une carte mondiale construite par des contributeurs bénévoles.'],
            ['Que sont les licences Creative Commons ?', ['Des licences permettant à un auteur d’autoriser certains usages de son œuvre', 'Des logiciels libres', 'Des contrats de plateforme', 'Des certificats de sécurité'], 0, 'Elles précisent ce qui est permis sans demande préalable.'],
            ['La contribution ouverte suffit-elle à garantir la qualité ?', ['Non, il faut des règles, une vérification et des contributeurs réguliers', 'Oui, le nombre corrige tout', 'Oui, si les contributeurs sont anonymes', 'Non, elle produit toujours de la désinformation'], 0, 'Wikipédia repose sur des règles éditoriales strictes.'],
            ['Sur une plateforme gratuite, les données des utilisateurs constituent une ressource économique.', ['Vrai', 'Faux'], 0, 'Le service est financé par la publicité ciblée.'],
            ['Qu’est-ce que le contenu généré par les utilisateurs ?', ['Le contenu publié par les internautes eux-mêmes', 'Le contenu produit par des algorithmes', 'Le contenu payant', 'Le contenu indexé par les moteurs'], 0, 'Il est devenu majoritaire sur le Web.'],
            ['Quelle responsabilité pèse sur les grandes plateformes ?', ['La modération des contenus illicites qui leur sont signalés', 'La vérification de chaque publication avant mise en ligne', 'La rémunération de tous les contributeurs', 'Le stockage éternel des données'], 0, 'Le cadre européen a été renforcé ces dernières années.'],
          ],
        },
        // ===================================================================
        // Thème 3 : Mémoriser et traiter
        // ===================================================================
        {
          titre: 'Open data',
          axe: 'Mémoriser et traiter',
          lecon: {
            titre: 'Des données publiques, ouvertes à tous',
            cours: `L'open data désigne une donnée que chacun peut librement consulter, réutiliser et redistribuer, y compris à des fins commerciales.

## Les critères
| Le critère | Ce qu'il exige |
| **Accessible** | En ligne, sans démarche |
| **Gratuite** | Ou à coût marginal |
| Dans un **format ouvert** | CSV, JSON, XML — et non un PDF scanné |
| Lisible par **machine** | Exploitable sans ressaisie |
| Documentée par des **métadonnées** | On sait ce que contient le fichier |
| Sous **licence** explicite | La réutilisation est autorisée |

## Qui publie
| L'acteur | Ce qu'il fait |
| Les administrations françaises | La loi pour une République numérique de **2016** impose la publication par défaut des données d'intérêt public |
| Le portail **data.gouv.fr** | Il les rassemble : budgets, résultats électoraux, horaires de transport, qualité de l'air, accidents, prix des carburants |
| L'Union européenne et les collectivités | Elles font de même |

> Une donnée ouverte ne vaut que par ce qu'on en fait. Un fichier que personne ne réutilise est un fichier, pas une politique publique.

## Ce que cela permet
| L'usage | Son exemple |
| Des **applications** | Horaires en temps réel, comparateurs de prix, cartes de qualité de l'air |
| Le **journalisme de données** | Des enquêtes fondées sur des chiffres publics |
| La **recherche** | Des jeux de données réutilisables |
| Le **contrôle citoyen** | Vérifier l'action publique |

## Les limites
| La limite | Son risque |
| Les **données personnelles** | Non ouvrables sans anonymisation solide ; la **réidentification par croisement** est un risque réel |
| Le **secret statistique** et la sécurité | Certaines données ne peuvent pas être publiées |
| La **qualité inégale** des jeux publiés | Des fichiers incomplets ou mal documentés |
| Le **coût de mise à jour** | Une donnée périmée vaut peu |`,
          },
          questions: [
            ['Qu’est-ce qu’une donnée ouverte ?', ['Une donnée librement accessible, réutilisable et redistribuable', 'Une donnée publiée sur un site officiel', 'Une donnée gratuite mais non réutilisable', 'Une donnée anonymisée'], 0, 'La licence doit autoriser explicitement la réutilisation.'],
            ['Quel format convient à l’open data ?', ['Un format ouvert et lisible par machine, comme CSV ou JSON', 'Un PDF scanné', 'Une image', 'Un document de traitement de texte propriétaire'], 0, 'La lisibilité par machine est essentielle à la réutilisation.'],
            ['Quel portail rassemble les données publiques françaises ?', ['data.gouv.fr', 'service-public.fr', 'insee.fr', 'legifrance.fr'], 0, 'Des milliers de jeux de données y sont publiés.'],
            ['Que sont les métadonnées ?', ['Des informations qui décrivent un jeu de données', 'Des données personnelles', 'Des données chiffrées', 'Des données en double'], 0, 'Source, date, périmètre, unité de mesure, licence.'],
            ['Les données personnelles peuvent-elles être ouvertes telles quelles ?', ['Non, elles doivent être anonymisées et le risque de réidentification est réel', 'Oui, si elles sont publiques', 'Oui, avec l’accord du maire', 'Non, jamais sous aucune forme'], 0, 'Le croisement de jeux anonymisés peut réidentifier des individus.'],
            ['La loi pour une République numérique de 2016 impose l’ouverture par défaut des données publiques.', ['Vrai', 'Faux'], 0, 'Sous réserve des secrets protégés par la loi.'],
            ['Quel usage concret l’open data permet-il ?', ['Des applications d’horaires de transport en temps réel', 'Le chiffrement des communications', 'La lutte contre les virus', 'L’accélération du réseau'], 0, 'Comme les comparateurs de prix ou les cartes de qualité de l’air.'],
            ['Quelle est la principale limite pratique de l’open data ?', ['La qualité inégale des jeux publiés et le coût de leur mise à jour', 'Le manque de serveurs', 'L’absence de logiciels de lecture', 'L’interdiction de réutilisation'], 0, 'Un jeu non mis à jour perd rapidement toute utilité.'],
          ],
        },
        {
          titre: 'Cloud et datacenters',
          axe: 'Mémoriser et traiter',
          lecon: {
            titre: 'Le nuage est un bâtiment',
            cours: `Le cloud n'a rien d'immatériel : quand un fichier part dans le nuage, il atterrit sur un disque, dans un bâtiment que quelqu'un possède, alimente et refroidit.

## Ce qu'est le cloud
La mise à disposition, par le réseau, de ressources informatiques hébergées ailleurs et facturées à l'usage.

| Le niveau de service | Ce qui est fourni |
| L'**infrastructure** | Des machines et du stockage |
| La **plateforme** | Un environnement d'exécution |
| Le **logiciel** | Une application prête à l'emploi |

## Les datacenters
| L'élément | Son rôle |
| Des milliers de **serveurs en baies** | La capacité de calcul et de stockage |
| Une alimentation **redondante** et des groupes électrogènes | Survivre à une coupure |
| La **climatisation** | Évacuer la chaleur |
| Des liaisons réseau **multiples** | Rester joignable |
| La **réplication** sur plusieurs machines et plusieurs sites | Survivre à une panne ou à un incendie |

> Le nuage, ce sont des bâtiments climatisés, des câbles sous-marins et des factures d'électricité. Rien d'aérien là-dedans.

## Avantages et contreparties
| L'avantage | La contrepartie |
| L'accès depuis n'importe où, la synchronisation, le partage | La **dépendance à la connexion** |
| La sauvegarde automatique | La **dépendance au fournisseur** |
| Une capacité **élastique** sans investissement matériel | Un coût qui grimpe avec le volume |
| — | La **souveraineté** : la loi applicable dépend du pays de stockage et de la nationalité de l'hébergeur |

## L'empreinte environnementale
| Le repère | Sa valeur |
| La part du numérique dans les émissions mondiales | Environ **4 %**, en croissance |
| Le principal poste | La **fabrication des terminaux** |
| Le poste des datacenters | Électricité et refroidissement |
| L'indicateur d'efficacité | Le **PUE** : énergie totale rapportée à celle qui sert réellement aux calculs |`,
          },
          questions: [
            ['Qu’est-ce que le cloud ?', ['La mise à disposition par le réseau de ressources informatiques hébergées ailleurs', 'Un logiciel de compression', 'Un réseau pair-à-pair', 'Un protocole de transport'], 0, 'Stockage, calcul ou logiciel, facturés à l’usage.'],
            ['Qu’est-ce qu’un datacenter ?', ['Un bâtiment rassemblant des milliers de serveurs', 'Un logiciel de gestion de bases', 'Un centre d’appel', 'Un point d’échange Internet'], 0, 'Avec alimentation, climatisation et réseau redondants.'],
            ['Pourquoi les données sont-elles répliquées ?', ['Pour survivre à une panne matérielle ou à un sinistre', 'Pour économiser de l’espace', 'Pour accélérer le chiffrement', 'Pour réduire la facture'], 0, 'Souvent sur plusieurs sites distincts.'],
            ['Quel est l’un des principaux inconvénients du cloud ?', ['La dépendance à la connexion et au fournisseur', 'L’impossibilité de partager des fichiers', 'L’absence de sauvegarde', 'La lenteur de synchronisation'], 0, 'Sans réseau, les données sont inaccessibles.'],
            ['Que désigne la question de la souveraineté des données ?', ['Le fait que la loi applicable dépende du lieu de stockage et de l’hébergeur', 'Le droit d’auteur sur les fichiers', 'Le chiffrement de bout en bout', 'Le coût du stockage'], 0, 'Un enjeu majeur pour les administrations et les entreprises.'],
            ['Le numérique représente environ 4 % des émissions mondiales de gaz à effet de serre.', ['Vrai', 'Faux'], 0, 'Une part en croissance, dominée par la fabrication des terminaux.'],
            ['Que mesure le PUE d’un datacenter ?', ['Le rapport entre l’énergie totale consommée et celle utile aux calculs', 'La puissance de calcul disponible', 'Le taux de disponibilité', 'La vitesse du réseau'], 0, 'Plus il est proche de 1, plus le centre est efficace.'],
            ['Où sont réellement stockées les données du cloud ?', ['Sur des disques, dans des datacenters appartenant à des entreprises', 'Dans l’atmosphère', 'Sur l’ordinateur de l’utilisateur', 'Sur les routeurs du réseau'], 0, 'Le nuage est une métaphore, pas une description.'],
          ],
        },

        // ===================================================================
        // Thème 4 : Rassembler
        // ===================================================================
        {
          titre: 'Les réseaux sociaux, l’expérience du petit monde et les graphes',
          axe: 'Rassembler',
          lecon: {
            titre: 'Six poignées de main entre deux inconnus',
            cours: `Un réseau social se représente mathématiquement par un graphe : des sommets, les personnes, et des arêtes, les relations.

## Le vocabulaire des graphes
| Le terme | Sa définition |
| Le **degré** d'un sommet | Le nombre de ses voisins |
| Une **chaîne** | Une suite d'arêtes reliant deux sommets |
| La **distance** entre deux sommets | La longueur de la plus **courte** chaîne |
| Le **diamètre** du graphe | La plus **grande** de ces distances |
| Un graphe **orienté** | Je te suis sans que tu me suives |

## L'expérience du petit monde
| L'élément | Le détail |
| L'auteur | Le psychologue **Stanley Milgram**, en **1967** |
| Le protocole | Faire parvenir une lettre à un inconnu de Boston, en passant **uniquement** par des connaissances personnelles |
| Le résultat | Environ **six** intermédiaires en moyenne |
| Le nom resté | Les **six degrés de séparation** |

> Ce ne sont pas les amis proches qui raccourcissent les chemins, mais les connaissances lointaines — les **liens faibles**, qui relient des mondes séparés.

## Vérification à grande échelle
| Le constat | Sa valeur |
| La distance moyenne sur de grands réseaux sociaux | De l'ordre de **quatre à cinq** |
| Le **diamètre** | Faible |
| La densité de **triangles** | Forte : mes amis sont amis entre eux |

## À quoi cela sert
| L'application | Ce qu'elle exploite |
| Recommander contacts et contenus | La proximité dans le graphe |
| Détecter des **communautés** | Les zones fortement connectées |
| Repérer des comptes **influents** | Le degré et la position |
| Modéliser une **diffusion** | Information ou épidémie |

> Le même modèle sert à étudier une rumeur et un virus.`,
          },
          questions: [
            ['Comment modélise-t-on un réseau social en mathématiques ?', ['Par un graphe, avec des sommets et des arêtes', 'Par un tableau de données', 'Par une équation', 'Par un arbre binaire'], 0, 'Les sommets sont les personnes, les arêtes les relations.'],
            ['Qu’est-ce que le degré d’un sommet ?', ['Le nombre de ses voisins', 'La longueur du plus court chemin', 'Le nombre total de sommets', 'Sa position dans le graphe'], 0, 'Un sommet de fort degré est très connecté.'],
            ['Qu’est-ce que le diamètre d’un graphe ?', ['La plus grande distance entre deux sommets', 'Le nombre d’arêtes', 'Le degré maximal', 'Le nombre de communautés'], 0, 'Dans les réseaux sociaux, il reste étonnamment faible.'],
            ['Qui a mené l’expérience du petit monde en 1967 ?', ['Stanley Milgram', 'Mark Zuckerberg', 'Claude Shannon', 'Paul Erdős'], 0, 'Des lettres à faire parvenir de proche en proche.'],
            ['Combien d’intermédiaires en moyenne dans l’expérience de Milgram ?', ['Environ six', 'Environ deux', 'Environ vingt', 'Environ cinquante'], 0, 'D’où l’expression des six degrés de séparation.'],
            ['Sur les grands réseaux sociaux, la distance moyenne est de l’ordre de quatre à cinq.', ['Vrai', 'Faux'], 0, 'Mesurée sur des centaines de millions de comptes.'],
            ['Quels liens raccourcissent le plus les chemins dans un réseau ?', ['Les liens faibles, avec des connaissances lointaines', 'Les liens forts, avec les amis proches', 'Les liens familiaux', 'Les liens professionnels'], 0, 'Ils relient des groupes qui, sinon, resteraient séparés.'],
            ['À quoi sert l’analyse des graphes sur un réseau social ?', ['À recommander des contacts, détecter des communautés et modéliser la diffusion', 'À chiffrer les messages', 'À compresser les images', 'À gérer les mots de passe'], 0, 'Le même modèle décrit une rumeur ou une épidémie.'],
          ],
        },
        {
          titre: 'Filtrage de l’information',
          axe: 'Rassembler',
          lecon: {
            titre: 'Ce que l’algorithme choisit de vous montrer',
            cours: `Aucun utilisateur ne peut lire tout ce qui se publie. Une sélection est donc inévitable — la question est de savoir qui la fait, et selon quels critères.

## Les systèmes de recommandation
| Le mécanisme | Ce qu'il utilise |
| Le **classement** du fil | Il n'est pas chronologique |
| La prédiction de réaction | Vos clics, le temps passé, vos interactions |
| Le **filtrage collaboratif** | Les comportements d'utilisateurs jugés semblables |

L'objectif optimisé est l'**engagement** : le temps et l'attention.

> Un algorithme qui maximise l'engagement n'optimise ni la vérité, ni l'équilibre : il optimise la **réaction**.

## Bulle et chambre
| La notion | Ce qu'elle décrit |
| La **bulle de filtre**, popularisée par Eli Pariser | L'enfermement **algorithmique** dans des contenus conformes à ses opinions |
| La **chambre d'écho** | Le phénomène **social** correspondant : on ne discute qu'avec ceux qui pensent comme soi |

L'effet : les convictions se renforcent, et les avis contraires paraissent minoritaires.

## Désinformation
| Le facteur | Son effet |
| La **surprise** et l'indignation | Une infox circule plus vite qu'une information vérifiée |
| Le **biais de confirmation** | On retient ce qui nous donne raison |
| L'**effet de répétition** | Ce qu'on lit souvent paraît vrai |
| L'**illusion de familiarité** | Ce qui est connu paraît fiable |

## Se défendre
| Le réflexe | Ce qu'il vérifie |
| La **source** et sa date | Qui parle, et quand |
| L'information **d'origine** | Ce que disait le document de départ |
| La même information **ailleurs** | Le recoupement |
| Une recherche d'**image inversée** | Si la photo est ancienne ou détournée |
| Les rubriques de **vérification** des rédactions | Un travail déjà fait |

> Se méfier des titres qui provoquent une émotion forte : sa propre indignation est le levier utilisé.`,
          },
          questions: [
            ['Un fil d’actualité est-il chronologique ?', ['Non, il est classé par un algorithme', 'Oui, du plus récent au plus ancien', 'Oui, sauf pour les publicités', 'Non, il est aléatoire'], 0, 'Le classement vise à maximiser l’engagement.'],
            ['Qu’est-ce que le filtrage collaboratif ?', ['Recommander à un utilisateur ce qu’ont apprécié des utilisateurs similaires', 'Filtrer les contenus illégaux', 'Trier les messages par date', 'Bloquer les publicités'], 0, 'La similarité est calculée sur les comportements passés.'],
            ['Qu’est-ce que la bulle de filtre ?', ['L’enfermement progressif dans des contenus conformes à ses opinions', 'Un filtre anti-spam', 'Une limite de débit', 'Un mode de navigation privée'], 0, 'Notion popularisée par Eli Pariser.'],
            ['Qu’est-ce qu’une chambre d’écho ?', ['Un environnement social où l’on n’échange qu’avec des personnes du même avis', 'Un forum modéré', 'Un salon de discussion privé', 'Un groupe de travail'], 0, 'Elle renforce les convictions et masque les avis contraires.'],
            ['Que cherche à maximiser un algorithme de recommandation ?', ['L’engagement, c’est-à-dire l’attention et le temps passé', 'La véracité de l’information', 'La diversité des points de vue', 'La rapidité de chargement'], 0, 'Ce qui n’est pas la même chose que la qualité.'],
            ['Une information fausse circule souvent plus vite qu’une information vérifiée.', ['Vrai', 'Faux'], 0, 'Parce qu’elle est plus surprenante et suscite plus d’émotion.'],
            ['Qu’est-ce que le biais de confirmation ?', ['La tendance à privilégier ce qui confirme ce qu’on croit déjà', 'La tendance à douter de tout', 'L’effet de la répétition d’un message', 'La confiance dans les sources officielles'], 0, 'Il est puissamment renforcé par la personnalisation.'],
            ['Quel réflexe permet de vérifier l’origine d’une photo ?', ['La recherche d’image inversée', 'La lecture des commentaires', 'Le partage à des proches', 'Le zoom sur l’image'], 0, 'Elle révèle souvent une image ancienne ou détournée.'],
          ],
        },
        {
          titre: 'Exister en ligne',
          axe: 'Rassembler',
          lecon: {
            titre: 'Ce que le réseau garde de vous',
            cours: `Chaque usage laisse une trace. L'ensemble de ces traces compose une identité numérique que l'on ne maîtrise qu'en partie.

## Trois sortes de traces
| La trace | Son origine | Ses exemples |
| **Volontaire** | Ce que l'on publie | Messages, photos, avis |
| **Involontaire** | Laissée par la machine | Adresse IP, cookies, identifiant d'appareil, position, historique d'achat, durée de lecture |
| **Héritée** | Laissée par les autres | Une photo où l'on est identifié, un commentaire qui vous cite |

## Le droit
Le **RGPD**, en vigueur depuis **2018**, donne des droits.

| Le droit | Ce qu'il permet |
| Être **informé** | Savoir ce qui est collecté |
| **Accéder** | Obtenir ses données |
| **Rectifier** | Corriger une erreur |
| **Effacer** | Le droit à l'oubli |
| S'**opposer** | Refuser un traitement |
| La **portabilité** | Récupérer ses données pour les transférer |

La **CNIL** contrôle et sanctionne. Le consentement doit être **libre, spécifique, éclairé et révocable**.

> Publier, c'est écrire à trois publics à la fois : ceux que l'on vise, ceux que l'on n'a pas prévus, et ceux qui liront dans dix ans.

## Réputation et risques
| Le risque | Son mécanisme |
| La **résurgence** | Une publication recopiée, sortie de son contexte, ressort des années plus tard — lors d'un recrutement, par exemple |
| Le **cyberharcèlement** | Un délit, lourdement puni |
| L'**usurpation d'identité** | Un délit |
| La diffusion d'**images sans consentement** | Un délit, aggravé pour les images intimes |

## Bonnes pratiques
- Régler les paramètres de **confidentialité**.
- **Séparer** les usages : personnel, scolaire, professionnel.
- Réfléchir avant de publier l'**image d'autrui**.
- Exercer ses droits auprès des plateformes, et **signaler** les contenus illicites.

> Un compte supprimé ne fait pas disparaître ce qui a déjà été copié.`,
          },
          questions: [
            ['Qu’est-ce qu’une trace involontaire ?', ['Une donnée laissée par la machine, comme l’adresse IP ou un cookie', 'Un message publié par erreur', 'Une photo prise par un ami', 'Un commentaire supprimé'], 0, 'Elle est enregistrée sans action volontaire de l’utilisateur.'],
            ['Qu’est-ce qu’une trace héritée ?', ['Une trace laissée par d’autres à votre sujet', 'Une trace de votre enfance', 'Une trace effacée', 'Une trace chiffrée'], 0, 'Une photo où vous êtes identifié, par exemple.'],
            ['Depuis quand le RGPD est-il applicable ?', ['2018', '2016', '2020', '2014'], 0, 'Adopté en 2016, applicable en mai 2018.'],
            ['Quel droit permet de demander l’effacement de ses données ?', ['Le droit à l’effacement, dit droit à l’oubli', 'Le droit d’accès', 'Le droit d’opposition', 'Le droit à la portabilité'], 0, 'Il connaît des exceptions, notamment pour l’information du public.'],
            ['Quelle autorité veille au respect des données personnelles en France ?', ['La CNIL', 'L’Arcom', 'L’Arcep', 'La DGCCRF'], 0, 'Elle contrôle, conseille et sanctionne.'],
            ['Supprimer un compte fait-il disparaître tout ce qui a été publié ?', ['Non, ce qui a été copié ou archivé subsiste', 'Oui, immédiatement', 'Oui, après trente jours', 'Non, mais les moteurs oublient tout'], 0, 'Captures d’écran et archives échappent à la suppression.'],
            ['Le cyberharcèlement est un délit puni par la loi.', ['Vrai', 'Faux'], 0, 'Avec des peines aggravées lorsque la victime est mineure.'],
            ['Que suppose un consentement valable au sens du RGPD ?', ['Qu’il soit libre, spécifique, éclairé et révocable', 'Qu’il soit donné par écrit', 'Qu’il soit donné une fois pour toutes', 'Qu’il soit implicite'], 0, 'Un consentement arraché par un bandeau piégeux n’est pas valable.'],
          ],
        },

        // ===================================================================
        // Thème 5 : Numériser
        // ===================================================================
        {
          titre: 'L’image numérique',
          axe: 'Numériser',
          lecon: {
            titre: 'Une grille de nombres',
            cours: `Une photo affichée à l'écran n'est pas une image au sens ancien : c'est un tableau de nombres que l'ordinateur interprète en couleurs.

## Le pixel
L'image matricielle est découpée en **pixels**, rangés en lignes et en colonnes. Chaque pixel porte une valeur : un niveau de gris, ou trois valeurs pour la couleur.

## Le codage des couleurs
| L'élément | Sa valeur |
| Le modèle | **RVB** : rouge, vert, bleu |
| Le codage de chaque composante | **8 bits**, soit **256** niveaux |
| Le poids d'un pixel couleur | **24 bits** |
| Le nombre de couleurs possibles | Environ **16,7 millions** |

| La couleur | Ses composantes |
| Noir | 0, 0, 0 |
| Blanc | 255, 255, 255 |
| Rouge vif | 255, 0, 0 |

> Une image en niveaux de gris de 1000 sur 1000 pixels, c'est un million d'octets. Rien d'autre.

## Poids et compression
Poids brut = nombre de pixels × nombre d'octets par pixel.

| Le format | Sa compression | Son usage |
| **PNG** | **Sans perte** | Logos, captures, transparence |
| **JPEG** | **Avec perte** | Photographies ; artefacts visibles si trop compressé |
| **GIF** | Limité à 256 couleurs | Petites animations |

## Matriciel et vectoriel
| Le type | Ce qu'il stocke | Son comportement à l'agrandissement |
| **Matriciel** | Une grille de pixels | Il **pixellise** |
| **Vectoriel** (SVG) | Des formes décrites par des équations | Aucune perte de qualité |

Le vectoriel convient mal à la photographie.

> Les **métadonnées EXIF** d'une photo enregistrent au passage l'appareil, la date et parfois la **position GPS**.`,
          },
          questions: [
            ['Qu’est-ce qu’un pixel ?', ['Le point élémentaire d’une image matricielle', 'Une unité de mesure de l’écran', 'Un format de fichier', 'Un niveau de compression'], 0, 'Il porte une ou trois valeurs numériques.'],
            ['Quelles sont les trois composantes du modèle RVB ?', ['Rouge, vert, bleu', 'Rouge, violet, blanc', 'Cyan, magenta, jaune', 'Rouge, vert, blanc'], 0, 'La synthèse additive des écrans.'],
            ['Combien de niveaux par composante si elle est codée sur 8 bits ?', ['256', '128', '512', '1024'], 0, 'De 0 à 255.'],
            ['Combien de couleurs peut afficher un pixel codé en 24 bits ?', ['Environ 16,7 millions', 'Environ 65 000', '256', 'Un nombre infini'], 0, '256 puissance 3.'],
            ['Quel format compresse sans perte d’information ?', ['PNG', 'JPEG', 'GIF', 'WEBP en mode dégradé'], 0, 'JPEG compresse avec perte, ce qui crée des artefacts.'],
            ['Une image vectorielle peut être agrandie sans perte de qualité.', ['Vrai', 'Faux'], 0, 'Elle décrit des formes par des équations, pas par des pixels.'],
            ['Comment obtient-on un pixel blanc en RVB sur 8 bits ?', ['Trois composantes à 255', 'Trois composantes à 0', 'Rouge à 255 seulement', 'Bleu à 128'], 0, 'Le noir correspond à trois zéros.'],
            ['Que contiennent les métadonnées EXIF d’une photo ?', ['L’appareil, la date et parfois la position GPS', 'Les couleurs dominantes', 'Le nom du photographe uniquement', 'Le taux de compression seulement'], 0, 'Elles peuvent révéler des informations personnelles.'],
          ],
        },
        {
          titre: 'La colorisation d’une image',
          axe: 'Numériser',
          lecon: {
            titre: 'Changer les nombres, changer l’image',
            cours: `Comme une image est un tableau de nombres, la transformer revient à appliquer un calcul à chacun de ses pixels. C'est ce que fait tout filtre de retouche.

## Du couleur au gris
| La méthode | Son calcul | Son résultat |
| La **moyenne** | (R + V + B) / 3 | Correct |
| La **luminance** | Une moyenne **pondérée**, le vert comptant davantage | Meilleur visuellement |

> L'œil est plus sensible au vert qu'au bleu : c'est pourquoi on pondère.

## Le négatif
Chaque composante est remplacée par **255 moins sa valeur**.

| Le pixel d'origine | Son négatif |
| Rouge vif (255, 0, 0) | Cyan (0, 255, 255) |
| Noir (0, 0, 0) | Blanc (255, 255, 255) |

> L'opération est **réversible** : l'appliquer deux fois redonne l'image d'origine.

> Une retouche n'est pas un geste artistique mystérieux : c'est une fonction appliquée à un million de nombres.

## Le seuillage
| La valeur du pixel | Ce qu'il devient |
| Au-dessus du **seuil** | Blanc |
| En dessous | Noir |

> C'est la base de la reconnaissance de caractères et de nombreux traitements automatiques : il **sépare la forme du fond**.

## Coloriser et modifier les teintes
| La transformation | Son principe |
| Renforcer une composante | Multiplier un canal |
| **Permuter** les canaux | Échanger rouge et bleu, par exemple |
| Une teinte **sépia** | Une combinaison linéaire des trois composantes |
| **Coloriser** une image ancienne | Un modèle d'apprentissage prédit des couleurs |

> Le résultat d'une colorisation automatique est **vraisemblable**, pas véridique : coloriser une photo de 1900, c'est inventer des couleurs plausibles, pas les retrouver.`,
          },
          questions: [
            ['Comment convertit-on un pixel couleur en niveau de gris ?', ['En remplaçant les trois composantes par une valeur unique', 'En supprimant la composante bleue', 'En mettant toutes les composantes à 255', 'En doublant la composante rouge'], 0, 'Moyenne simple ou luminance pondérée.'],
            ['Pourquoi pondère-t-on davantage le vert dans le calcul de luminance ?', ['Parce que l’œil humain y est plus sensible', 'Parce qu’il occupe plus de bits', 'Parce que les écrans l’affichent mieux', 'Par convention arbitraire'], 0, 'Le résultat est plus fidèle à la perception.'],
            ['Comment obtient-on le négatif d’un pixel codé sur 8 bits ?', ['En remplaçant chaque composante par 255 moins sa valeur', 'En divisant chaque composante par deux', 'En inversant l’ordre des composantes', 'En mettant tout à zéro'], 0, 'L’opération est réversible.'],
            ['Qu’est-ce que le seuillage ?', ['Transformer l’image en noir et blanc pur selon une valeur limite', 'Réduire la taille du fichier', 'Augmenter le contraste progressivement', 'Ajouter du flou'], 0, 'Il sépare la forme du fond.'],
            ['À quoi sert principalement le seuillage ?', ['À la reconnaissance de formes et de caractères', 'À la compression', 'À la colorisation', 'À l’agrandissement'], 0, 'Il simplifie l’image avant analyse.'],
            ['Appliquer deux fois le négatif redonne l’image d’origine.', ['Vrai', 'Faux'], 0, 'La transformation est son propre inverse.'],
            ['Que vaut la colorisation automatique d’une photo ancienne ?', ['Un résultat vraisemblable, mais non véridique', 'Les couleurs réelles retrouvées', 'Une image aléatoire', 'Une simple teinte sépia'], 0, 'Le modèle invente des couleurs plausibles.'],
            ['Une retouche d’image est-elle autre chose qu’un calcul sur des nombres ?', ['Non, c’est une fonction appliquée à chaque pixel', 'Oui, c’est un procédé optique', 'Oui, c’est une compression', 'Non, c’est une simple copie'], 0, 'Tout filtre se ramène à une opération sur le tableau de valeurs.'],
          ],
        },
        {
          titre: 'Traitement par histogramme',
          axe: 'Numériser',
          lecon: {
            titre: 'La photo d’identité d’une image',
            cours: `L'histogramme d'une image compte, pour chaque valeur possible, le nombre de pixels qui la portent. C'est l'outil de diagnostic de base de toute retouche.

## Le lire
| L'axe | Ce qu'il porte |
| **Abscisse** | Les valeurs de 0 à 255, des tons sombres à gauche aux clairs à droite |
| **Ordonnée** | Le nombre de pixels |

| L'allure | Le diagnostic |
| Tassé à **gauche** | Image **sous-exposée** |
| Tassé à **droite** | Image **surexposée** |
| Resserré au **centre** | Image **peu contrastée** |
| Étalé | Information bien répartie |

> L'histogramme ne dit pas si l'image est belle. Il dit si l'information est répartie ou entassée.

## L'étirement
On étale les valeurs occupées sur toute la plage disponible.

| Avant | Après |
| Les pixels vont de 80 à 170 | 80 devient 0, 170 devient 255 |

> Le contraste augmente, et aucun détail n'est inventé : on utilise mieux la place existante.

## L'égalisation
Elle redistribue les valeurs pour rendre l'histogramme aussi **plat** que possible.

| Son gain | Son coût |
| Un contraste local fortement renforcé | Elle accentue le **bruit** |
| Des détails invisibles révélés | Une image parfois peu naturelle |

Très utile en imagerie médicale, satellitaire ou astronomique.

## Les limites
> Ces traitements ne **créent** pas d'information : une zone entièrement à 255, brûlée par la surexposition, est irrécupérable.

C'est pourquoi les photographes exposent en surveillant l'histogramme plutôt que l'écran, dont la luminosité trompe.`,
          },
          questions: [
            ['Que représente l’histogramme d’une image ?', ['Le nombre de pixels pour chaque valeur possible', 'La taille du fichier', 'La répartition des couleurs sur la surface', 'Le nombre de pixels de l’image'], 0, 'Un diagnostic de la répartition des tons.'],
            ['À quoi ressemble l’histogramme d’une image sous-exposée ?', ['Il est tassé vers la gauche', 'Il est tassé vers la droite', 'Il est parfaitement plat', 'Il est centré'], 0, 'Les tons sombres dominent.'],
            ['Que fait l’étirement d’histogramme ?', ['Il étale les valeurs occupées sur toute la plage disponible', 'Il supprime les pixels extrêmes', 'Il réduit le nombre de couleurs', 'Il compresse le fichier'], 0, 'Le contraste augmente sans inventer d’information.'],
            ['Que fait l’égalisation d’histogramme ?', ['Elle redistribue les valeurs pour aplatir l’histogramme', 'Elle inverse les couleurs', 'Elle floute l’image', 'Elle réduit la résolution'], 0, 'Elle révèle des détails, au risque d’accentuer le bruit.'],
            ['Dans quel domaine l’égalisation est-elle particulièrement utile ?', ['En imagerie médicale, satellitaire ou astronomique', 'En impression papier', 'En compression vidéo', 'En transmission réseau'], 0, 'Elle fait apparaître des structures peu contrastées.'],
            ['Une zone totalement surexposée peut être récupérée par traitement.', ['Vrai', 'Faux'], 1, 'L’information a été perdue : aucun calcul ne la recrée.'],
            ['Que signifie un histogramme resserré au centre ?', ['L’image manque de contraste', 'L’image est surexposée', 'L’image est sous-exposée', 'L’image est saturée'], 0, 'Ni noirs profonds ni blancs francs.'],
            ['Pourquoi les photographes surveillent-ils l’histogramme plutôt que l’écran ?', ['Parce que la luminosité de l’écran trompe l’œil', 'Parce que l’écran est trop petit', 'Parce que l’histogramme est plus rapide', 'Parce que l’écran ne montre pas les couleurs'], 0, 'L’histogramme est une mesure, l’écran une impression.'],
          ],
        },
        {
          titre: 'Résolution et filtrage d’une image',
          axe: 'Numériser',
          lecon: {
            titre: 'Combien de pixels, et que faire de leurs voisins',
            cours: `Deux notions se confondent souvent : la définition, qui compte les pixels, et la résolution, qui dit à quelle densité ils sont restitués.

## Trois grandeurs à distinguer
| La grandeur | Sa définition | Son unité |
| La **définition** | Le nombre de pixels en largeur et en hauteur | 4000 × 3000, soit 12 millions de pixels |
| La **résolution** | La densité à l'affichage ou à l'impression | Points par pouce |
| Le **poids** | Définition × octets par pixel | Octets |

> La même image imprimée en grand format devient floue : ses pixels s'étalent.

## Rééchantillonner
| L'opération | Ce qu'elle fait |
| **Réduire** la définition | Elle supprime de l'information, **définitivement** |
| **Agrandir** | Elle **interpole** : elle invente des valeurs intermédiaires à partir des voisins |

> L'image paraît plus grande, pas plus détaillée. Zoomer sur une plaque d'immatriculation pour la rendre lisible n'existe qu'au cinéma.

## Le filtrage par convolution
Un **filtre** remplace la valeur de chaque pixel par une combinaison de celles de ses voisins, définie par une petite matrice appelée **noyau**.

| Le noyau | Son effet |
| Une **moyenne** des voisins | Un **flou** |
| Une accentuation des écarts | Une **netteté** renforcée |
| Une détection des variations brutales | Les **contours** |

## À quoi servent les filtres
| L'usage | Ce qu'il exploite |
| Réduire le **bruit** d'une photo prise dans l'obscurité | Le lissage |
| Préparer une image avant analyse automatique | Le nettoyage |
| Détecter des formes, extraire des contours | Reconnaissance de caractères, imagerie médicale |

> Ce sont les mêmes opérations qui, empilées, forment les premières couches des réseaux de neurones de vision.`,
          },
          questions: [
            ['Quelle différence entre définition et résolution ?', ['La définition compte les pixels, la résolution dit à quelle densité ils sont restitués', 'Ce sont deux synonymes', 'La définition concerne l’impression', 'La résolution est le poids du fichier'], 0, 'La résolution s’exprime en points par pouce.'],
            ['Agrandir une image ajoute-t-il du détail ?', ['Non, l’algorithme interpole à partir des pixels voisins', 'Oui, si le format est vectoriel', 'Oui, avec un bon logiciel', 'Non, cela réduit la taille'], 0, 'L’information absente ne se recrée pas.'],
            ['Qu’est-ce qu’un noyau de convolution ?', ['Une petite matrice définissant comment combiner les pixels voisins', 'Le centre de l’image', 'Un format de compression', 'Le pixel le plus lumineux'], 0, 'Il définit l’effet du filtre.'],
            ['Quel effet produit un noyau de moyenne ?', ['Un flou', 'Une netteté accrue', 'Une détection de contours', 'Une inversion des couleurs'], 0, 'Chaque pixel prend la moyenne de son voisinage.'],
            ['À quoi sert la détection de contours ?', ['À repérer les variations brutales de valeur, donc les formes', 'À augmenter la résolution', 'À compresser le fichier', 'À corriger l’exposition'], 0, 'Base de la reconnaissance de caractères et de l’imagerie médicale.'],
            ['Réduire la définition d’une image supprime définitivement de l’information.', ['Vrai', 'Faux'], 0, 'La remonter ensuite ne restaure pas les détails.'],
            ['Pourquoi une image imprimée en grand format paraît-elle floue ?', ['Ses pixels s’étalent sur une plus grande surface', 'L’encre se disperse', 'La compression augmente', 'Le format change'], 0, 'La résolution effective baisse.'],
            ['Quel traitement réduit le bruit d’une photo prise dans l’obscurité ?', ['Un filtre de lissage', 'Un seuillage', 'Une égalisation d’histogramme', 'Un agrandissement'], 0, 'Au prix d’une légère perte de détail.'],
          ],
        },
        {
          titre: 'Comment est captée une image ?',
          axe: 'Numériser',
          lecon: {
            titre: 'De la lumière aux nombres',
            cours: `Avant d'être un tableau de nombres, une image est de la lumière. Le capteur fait la traduction, en trois temps : collecter, mesurer, coder.

## Le capteur
| L'élément | Son rôle |
| Le **capteur**, technologie CCD ou le plus souvent **CMOS** | Il porte des millions de **photosites** |
| Un **photosite** | Il accumule des charges électriques proportionnelles à la lumière reçue pendant la pose |

## La couleur
Un photosite ne perçoit pas la couleur : il compte des photons. On place donc devant lui un filtre coloré.

| L'élément | Son principe |
| La **matrice de Bayer** | Un motif de filtres comptant **deux verts** pour un rouge et un bleu |
| Pourquoi deux verts | La sensibilité de l'œil au vert |
| Le **dématriçage** | Un algorithme reconstitue les trois composantes de chaque pixel à partir des voisins |

> Un capteur ne voit pas de couleurs : il compte de la lumière derrière des filtres, et le reste est du calcul.

## La conversion
Un **convertisseur analogique-numérique** transforme chaque charge en nombre entier.

| Le codage | Les niveaux par composante |
| **8 bits** | 256 |
| **12 ou 14 bits** | Bien davantage |

> C'est l'intérêt du format brut, dit **RAW** : il conserve les données du capteur avant traitement.

## Ce qui détermine la qualité
| Le facteur | Son importance |
| La **taille du capteur** et des photosites | Plus déterminante que le seul nombre de mégapixels |
| L'**ouverture** et la **durée d'exposition** | La quantité de lumière reçue |
| La **sensibilité** | Sa montée génère du **bruit** |
| La qualité de l'**optique** | Netteté, aberrations |
| Le **traitement logiciel** embarqué | Aujourd'hui décisif dans les téléphones |`,
          },
          questions: [
            ['Qu’est-ce qu’un photosite ?', ['Une cellule du capteur qui accumule une charge proportionnelle à la lumière reçue', 'Un pixel de l’écran', 'Un filtre coloré', 'Un point de mise au point'], 0, 'Des millions de photosites forment le capteur.'],
            ['Quelle technologie équipe la plupart des capteurs actuels ?', ['CMOS', 'CCD', 'LCD', 'OLED'], 0, 'Moins gourmande en énergie et moins coûteuse que le CCD.'],
            ['Un photosite perçoit-il directement la couleur ?', ['Non, il compte la lumière derrière un filtre coloré', 'Oui, les trois composantes', 'Oui, avec un prisme intégré', 'Non, il ne perçoit que le contraste'], 0, 'La couleur est reconstruite par calcul.'],
            ['Quelle est la particularité de la matrice de Bayer ?', ['Elle compte deux filtres verts pour un rouge et un bleu', 'Elle alterne rouge et bleu seulement', 'Elle utilise quatre couleurs égales', 'Elle n’utilise aucun filtre'], 0, 'Parce que l’œil est plus sensible au vert.'],
            ['Qu’est-ce que le dématriçage ?', ['L’algorithme qui reconstitue les trois composantes de chaque pixel', 'La compression du fichier', 'Le nettoyage du capteur', 'La correction de l’exposition'], 0, 'Il s’appuie sur les valeurs des photosites voisins.'],
            ['Le format RAW conserve les données du capteur avant traitement.', ['Vrai', 'Faux'], 0, 'Il offre plus de latitude en retouche, au prix d’un fichier lourd.'],
            ['Qu’est-ce qui détermine le plus la qualité d’une image ?', ['La taille du capteur et des photosites, plus que le nombre de mégapixels', 'Le seul nombre de mégapixels', 'La taille de l’écran', 'Le format de fichier'], 0, 'De gros photosites captent plus de lumière et génèrent moins de bruit.'],
            ['Que provoque une montée de la sensibilité du capteur ?', ['L’apparition de bruit dans l’image', 'Une perte de définition', 'Un décalage des couleurs uniquement', 'Un agrandissement automatique'], 0, 'Le signal est amplifié, les parasites aussi.'],
          ],
        },

        // ===================================================================
        // Thème 6 : Cartographier
        // ===================================================================
        {
          titre: 'Géolocalisation',
          axe: 'Cartographier',
          lecon: {
            titre: 'Savoir où l’on est, à quelques mètres près',
            cours: `Un téléphone affiche sa position sans rien émettre vers les satellites : il écoute, et calcule.

## Le principe
| L'acteur | Ce qu'il fait |
| Le **satellite** | Il émet en permanence l'heure d'émission, donnée par une **horloge atomique**, et sa position |
| Le **récepteur** | Il compare à l'heure de réception et en déduit sa **distance** au satellite |

| Le système | Son origine |
| **GPS** | États-Unis |
| **Galileo** | Union européenne |
| **GLONASS** | Russie |
| **Beidou** | Chine |

## La trilatération
| Le nombre de satellites | Ce qu'il détermine |
| 1 | Une **sphère** de positions possibles |
| 2 | Un **cercle** |
| 3 | **Deux points**, dont un seul est plausible |
| **4** | La position **et** l'altitude, en corrigeant l'horloge du récepteur, qui n'est pas atomique |

> Ce n'est pas de la triangulation d'angles : c'est un calcul de **distances** à partir de temps de vol.

## La précision et ses limites
| La condition | La précision |
| En terrain dégagé | Quelques **mètres** |
| En ville | Dégradée par la réflexion des signaux sur les façades |
| Sous les arbres, en intérieur, en tunnel | Fortement dégradée, voire nulle |

| L'appoint utilisé par les téléphones | Ce qu'il apporte |
| Les **antennes du réseau mobile** | Une position approchée, rapide |
| Les **réseaux wifi** répertoriés | Une position en intérieur |
| Les capteurs internes — accéléromètre, gyroscope, boussole | La continuité entre deux points |

## Les usages et les données
| L'usage | Son domaine |
| Navigation, trafic en temps réel | Transport |
| Agriculture de précision | Agronomie |
| Secours | Sécurité civile |
| Horodatage des transactions | Finance et réseaux |

> La position est l'une des données les plus **sensibles** : elle révèle domicile, travail, habitudes, fréquentations. Le RGPD la protège, et l'autorisation demandée par les applications mérite d'être limitée à l'usage réel.`,
          },
          questions: [
            ['Comment un récepteur GPS calcule-t-il sa distance à un satellite ?', ['En comparant l’heure d’émission du signal à l’heure de réception', 'En mesurant la puissance du signal', 'En calculant un angle', 'En interrogeant le satellite'], 0, 'La distance se déduit du temps de parcours.'],
            ['Combien de satellites faut-il au minimum pour une position complète ?', ['Quatre', 'Trois', 'Deux', 'Six'], 0, 'Le quatrième corrige l’imprécision de l’horloge du récepteur.'],
            ['Comment s’appelle le système européen de positionnement ?', ['Galileo', 'GLONASS', 'Beidou', 'Copernicus'], 0, 'GLONASS est russe, Beidou chinois.'],
            ['Le récepteur émet-il un signal vers les satellites ?', ['Non, il se contente de recevoir', 'Oui, pour s’identifier', 'Oui, une fois par minute', 'Non, mais il émet vers les antennes relais'], 0, 'C’est pourquoi le GPS fonctionne sans abonnement.'],
            ['Qu’est-ce qui dégrade la précision en ville ?', ['La réflexion des signaux sur les façades', 'La densité de population', 'Le nombre de téléphones connectés', 'La pollution atmosphérique'], 0, 'Les trajets multiples faussent les temps de parcours.'],
            ['Un téléphone utilise aussi le wifi et les antennes mobiles pour se localiser.', ['Vrai', 'Faux'], 0, 'Ce qui améliore la position en intérieur et en ville.'],
            ['Pourquoi les satellites embarquent-ils des horloges atomiques ?', ['Parce qu’une erreur infime de temps produit une grande erreur de distance', 'Pour économiser l’énergie', 'Pour synchroniser les orbites', 'Pour chiffrer le signal'], 0, 'Le signal voyage à la vitesse de la lumière.'],
            ['Pourquoi la position est-elle une donnée sensible ?', ['Elle révèle domicile, travail, habitudes et fréquentations', 'Elle est difficile à mesurer', 'Elle change tout le temps', 'Elle est publique par nature'], 0, 'D’où l’importance de limiter les autorisations accordées aux applications.'],
          ],
        },
        {
          titre: 'Calcul d’itinéraire',
          axe: 'Cartographier',
          lecon: {
            titre: 'Le plus court chemin dans un graphe',
            cours: `Un calculateur d'itinéraire ne regarde pas une carte : il parcourt un graphe.

## Modéliser la route
| L'élément du graphe | Ce qu'il représente |
| Le **sommet** | Une intersection |
| L'**arête** | Un tronçon de route |
| Le **poids** | Ce que l'on cherche à minimiser |

| Le poids choisi | Ce qu'il donne |
| La **distance** | Le trajet le plus court |
| La **durée** | Le plus rapide — vitesse autorisée, type de voie, feux, trafic en temps réel |
| Un **coût** composite | Péages, pente, interdictions de tourner |

> Changer le poids change l'itinéraire : le plus court n'est pas le plus rapide.

## L'algorithme de Dijkstra
| Le point | Son contenu |
| Sa date | **1959** |
| Ce qu'il calcule | Le plus court chemin d'un sommet vers **tous** les autres |
| Sa méthode | Il part de l'origine, explore les sommets les plus proches, met à jour les distances |
| Sa condition | Les poids doivent être **positifs** |

> Un GPS ne cherche pas la belle route : il minimise une quantité qu'on lui a demandé de minimiser.

## Aller plus vite
| L'amélioration | Son principe |
| L'algorithme **A étoile** | Il ajoute une **estimation** de la distance restante — le vol d'oiseau — pour explorer d'abord dans la bonne direction |
| Les **prétraitements** | Ils hiérarchisent le réseau : les autoroutes d'abord |

Sur un réseau de millions de sommets, Dijkstra seul explore trop.

## Les données et leurs effets
| La donnée | Sa source |
| Le fond de carte | **OpenStreetMap** ou des fournisseurs privés |
| Le **trafic** | Les téléphones des utilisateurs eux-mêmes |

> Le calcul d'itinéraire a des effets réels sur le terrain : reporter le trafic dans des rues résidentielles, faire disparaître un commerce d'un trajet, ou saturer une déviation que tout le monde emprunte au même moment.`,
          },
          questions: [
            ['Comment un réseau routier est-il modélisé pour un calcul d’itinéraire ?', ['Par un graphe pondéré, intersections et tronçons', 'Par une image satellite', 'Par un tableau de coordonnées', 'Par une liste d’adresses'], 0, 'Chaque arête porte un poids.'],
            ['Que peut représenter le poids d’une arête ?', ['La distance, la durée, un péage ou une contrainte', 'Uniquement la distance', 'Le nombre de voitures', 'La largeur de la route'], 0, 'Changer le poids change l’itinéraire calculé.'],
            ['Que calcule l’algorithme de Dijkstra ?', ['Le plus court chemin d’un sommet vers tous les autres', 'Le chemin le plus long', 'Le nombre de chemins possibles', 'Le centre du graphe'], 0, 'À condition que les poids soient positifs.'],
            ['En quelle année l’algorithme de Dijkstra a-t-il été publié ?', ['1959', '1975', '1990', '1936'], 0, 'Il reste la base de tous les calculateurs actuels.'],
            ['Qu’apporte l’algorithme A étoile par rapport à Dijkstra ?', ['Il oriente la recherche grâce à une estimation de la distance restante', 'Il accepte les poids négatifs', 'Il donne un résultat approché', 'Il ne nécessite pas de graphe'], 0, 'L’exploration est beaucoup plus rapide sur de grands réseaux.'],
            ['Le trajet le plus court en distance est toujours le plus rapide.', ['Vrai', 'Faux'], 1, 'Vitesse, feux et trafic changent complètement le classement.'],
            ['D’où proviennent les données de trafic en temps réel ?', ['Des téléphones des utilisateurs eux-mêmes', 'Des radars automatiques uniquement', 'Des préfectures', 'Des satellites'], 0, 'Leur position anonymisée renseigne sur la vitesse du flux.'],
            ['Quel effet concret le calcul d’itinéraire peut-il avoir sur le terrain ?', ['Reporter le trafic dans des rues résidentielles', 'Réduire le nombre de véhicules', 'Modifier la vitesse autorisée', 'Créer de nouvelles routes'], 0, 'Des communes ont dû prendre des arrêtés pour s’en protéger.'],
          ],
        },

        // ===================================================================
        // Thème 7 : Commander
        // ===================================================================
        {
          titre: 'Systèmes automatisés',
          axe: 'Commander',
          lecon: {
            titre: 'Capter, décider, agir',
            cours: `Un système automatisé exécute une tâche sans intervention humaine permanente. Il repose toujours sur le même triplet.

## Les trois organes
| L'organe | Ce qu'il fait | Des exemples |
| Les **capteurs** | Ils transforment une grandeur physique en signal | Température, lumière, distance, pression, présence |
| La **partie commande** | Elle applique un programme | Un microcontrôleur |
| Les **actionneurs** | Ils agissent sur le monde | Moteur, vérin, résistance chauffante, vanne, voyant |

## La boucle de rétroaction
| Le système | Son fonctionnement | Un exemple |
| En **boucle ouverte** | Il exécute **sans vérifier** le résultat | Un grille-pain à minuterie |
| En **boucle fermée** | Il mesure l'effet de son action et **corrige** | Un thermostat, qui compare la température à la **consigne** |

> Sans rétroaction, une machine applique une recette. Avec rétroaction, elle poursuit un objectif.

## Des exemples partout
| Le domaine | Le système |
| L'habitat | Chauffage, volets, éclairage |
| Le transport | Régulateur de vitesse, feux adaptatifs, ascenseur |
| L'industrie | Chaîne de production, robot |
| Le quotidien | Distributeur de boissons, robot aspirateur, drone stabilisé |

> Un même schéma décrit une machine à laver et un avion en pilotage automatique. Seule la complexité change.

## Enjeux
| Le gain | Le risque |
| Sécurité, régularité, productivité | La **fiabilité** : un capteur en panne fait prendre une mauvaise décision |
| Moins de tâches pénibles | La **cybersécurité**, dès que le système est connecté |
| Une disponibilité continue | La **dépendance**, et la transformation du travail |

> La question de la **responsabilité** en cas d'accident, notamment pour les véhicules autonomes, reste largement ouverte.`,
          },
          questions: [
            ['Quels sont les trois organes d’un système automatisé ?', ['Capteurs, partie commande, actionneurs', 'Écran, clavier, souris', 'Processeur, mémoire, disque', 'Réseau, serveur, client'], 0, 'Capter, décider, agir.'],
            ['Que fait un capteur ?', ['Il transforme une grandeur physique en signal exploitable', 'Il agit sur le monde extérieur', 'Il exécute le programme', 'Il alimente le système'], 0, 'Température, lumière, distance, présence.'],
            ['Qu’est-ce qu’un actionneur ?', ['Un organe qui agit sur le monde physique', 'Un capteur de mouvement', 'Un microcontrôleur', 'Un logiciel de commande'], 0, 'Moteur, vérin, vanne, résistance chauffante.'],
            ['Qu’est-ce qu’une boucle fermée ?', ['Un système qui mesure l’effet de son action et corrige', 'Un système sans capteur', 'Un système sans programme', 'Un circuit électrique fermé'], 0, 'C’est le principe de la rétroaction.'],
            ['Quel exemple illustre la boucle ouverte ?', ['Un grille-pain à minuterie', 'Un thermostat', 'Un régulateur de vitesse', 'Un pilote automatique'], 0, 'Il exécute sans vérifier le résultat obtenu.'],
            ['Un thermostat compare la température mesurée à une consigne.', ['Vrai', 'Faux'], 0, 'C’est un système asservi, en boucle fermée.'],
            ['Quel risque un capteur défaillant fait-il peser sur un système automatisé ?', ['Le système décide à partir d’une information fausse', 'Le système s’arrête toujours', 'Le programme est effacé', 'Les actionneurs se déconnectent'], 0, 'D’où la redondance des capteurs dans les systèmes critiques.'],
            ['Quelle question juridique posent les véhicules autonomes ?', ['La responsabilité en cas d’accident', 'Le droit d’auteur du logiciel', 'La protection des marques', 'Le régime de la copropriété'], 0, 'Constructeur, éditeur, conducteur : le partage reste débattu.'],
          ],
        },
        {
          titre: 'L’Internet des objets (ou IoT)',
          axe: 'Commander',
          lecon: {
            titre: 'Quand les objets se mettent à parler au réseau',
            cours: `L'Internet des objets désigne l'extension du réseau à des objets du quotidien capables de mesurer, de communiquer et parfois d'agir.

## Ce qui a rendu cela possible
| Le facteur | Son apport |
| La **miniaturisation** et la chute du coût des capteurs | Des objets à quelques euros |
| Les réseaux **sans fil** | Wifi, Bluetooth, 4G et 5G, réseaux basse consommation à longue portée |
| L'**IPv6** | Un adressage sans limite pratique |
| Le **cloud** | Stocker et traiter les flux collectés |

## À quoi cela sert
| Le domaine | L'application |
| L'habitat | Domotique, suivi de consommation |
| La santé | Objets connectés de suivi |
| L'énergie | **Compteurs communicants** |
| La logistique | Traçabilité des colis |
| L'agriculture | **Agriculture de précision**, sondes d'humidité |
| L'industrie | Maintenance prédictive |
| La ville | Éclairage adaptatif, stationnement, qualité de l'air |

> Un capteur à trois euros qui envoie une mesure par heure, multiplié par des milliards : voilà le véritable changement d'échelle.

## Les risques
| La faiblesse | Sa conséquence |
| Un **mot de passe par défaut** | L'objet est accessible à tous |
| L'absence de **chiffrement** | Les données circulent en clair |
| L'absence de **mise à jour** | Les failles restent ouvertes |

> Ces objets deviennent des portes d'entrée sur le réseau domestique et des recrues pour des **réseaux de machines compromises** : le botnet Mirai a mobilisé des caméras connectées pour saturer de grands services en 2016.

## Les enjeux
| L'enjeu | Sa question |
| La **vie privée** | Ces objets mesurent présence, sommeil, déplacements |
| L'**environnement** | Fabrication, terres rares, obsolescence, déchets électroniques |
| La **souveraineté** | Un objet cesse parfois de fonctionner quand son fabricant ferme ses serveurs |`,
          },
          questions: [
            ['Qu’est-ce que l’Internet des objets ?', ['L’extension du réseau à des objets capables de mesurer et de communiquer', 'Un nouveau protocole de transport', 'Un réseau réservé aux entreprises', 'Un moteur de recherche d’objets'], 0, 'Montres, ampoules, compteurs, capteurs industriels.'],
            ['Quelle évolution technique a rendu possible l’IoT ?', ['La baisse du coût des capteurs et des microcontrôleurs', 'L’augmentation de la taille des serveurs', 'La disparition du wifi', 'Le passage au CD-ROM'], 0, 'Avec les réseaux sans fil et le cloud.'],
            ['Pourquoi IPv6 est-il important pour l’IoT ?', ['Il offre un nombre d’adresses pratiquement illimité', 'Il est plus rapide qu’IPv4', 'Il chiffre les échanges', 'Il réduit la consommation'], 0, 'Des milliards d’objets ont besoin d’adresses.'],
            ['Qu’est-ce que l’agriculture de précision ?', ['L’usage de capteurs pour ajuster arrosage et intrants au plus juste', 'La culture sous serre', 'L’agriculture biologique', 'La sélection des semences'], 0, 'Sondes d’humidité, stations météo, guidage par satellite.'],
            ['Quelle faiblesse fréquente présentent les objets connectés bon marché ?', ['Mot de passe par défaut et absence de mises à jour', 'Une consommation excessive', 'Un poids trop élevé', 'Une trop grande portée radio'], 0, 'Ils deviennent des portes d’entrée sur le réseau domestique.'],
            ['Le botnet Mirai a utilisé des objets connectés pour saturer de grands services en 2016.', ['Vrai', 'Faux'], 0, 'Des caméras et enregistreurs vidéo mal protégés.'],
            ['Quel risque pour la vie privée pose l’IoT domestique ?', ['Ces objets mesurent des habitudes intimes : présence, sommeil, déplacements', 'Ils publient automatiquement sur les réseaux sociaux', 'Ils enregistrent les mots de passe', 'Ils ne posent aucun risque'], 0, 'La finesse des mesures rend les profils très détaillés.'],
            ['Que se passe-t-il si le fabricant d’un objet connecté ferme ses serveurs ?', ['L’objet peut cesser de fonctionner', 'L’objet devient autonome', 'Les données sont automatiquement effacées', 'L’objet passe en garantie'], 0, 'La dépendance au service distant est un enjeu de souveraineté.'],
          ],
        },
      ],
    },
  ],
}
