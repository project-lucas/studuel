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
            cours: `Internet n’est pas une entreprise, ni un ordinateur géant : c’est un **réseau de réseaux**, formé de millions de réseaux locaux qui acceptent de parler la même langue.

## Une naissance militaire, puis universitaire
En 1969, **ARPANET** relie quatre universités américaines. L’objectif est de faire circuler l’information même si une partie du réseau tombe. En 1983, la famille de protocoles **TCP/IP** devient la règle commune ; c’est la date de naissance d’Internet tel qu’on le connaît.

## Le principe de commutation de paquets
Un message n’est pas envoyé d’un bloc : il est découpé en **paquets** qui voyagent indépendamment, empruntent des chemins différents et sont réassemblés à l’arrivée. Si un lien tombe, les paquets suivants passent ailleurs. C’est ce qui rend le réseau **résilient**.

> Internet n’a pas de centre. C’est un choix technique, et c’est aussi ce qui le rend si difficile à couper.

## Les couches
Le modèle **TCP/IP** empile quatre couches : accès réseau (le câble, le wifi, la fibre), Internet (l’adressage, avec le protocole **IP**), transport (l’acheminement fiable, avec **TCP** ou **UDP**), application (ce que voit l’utilisateur, avec HTTP, SMTP, DNS). Chaque couche ignore les détails des autres.

## Internet et le Web
Ce sont deux choses différentes. Internet est l’**infrastructure** ; le **Web**, inventé en 1989 par **Tim Berners-Lee** au CERN, n’est qu’une application parmi d’autres, au même titre que le courrier électronique ou la messagerie instantanée.`,
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
            cours: `Pour qu’un paquet arrive à destination, il faut savoir où il va. C’est le rôle du protocole **IP**, qui attribue à chaque machine connectée une **adresse** unique sur le réseau.

## IPv4 et IPv6
Une adresse **IPv4** s’écrit sur 32 bits, soit quatre nombres de 0 à 255 séparés par des points, comme 192.168.1.10. Cela n’autorise qu’environ **4,3 milliards** d’adresses — insuffisant depuis longtemps. L’**IPv6**, sur 128 bits, en offre un nombre gigantesque, écrit en hexadécimal et séparé par des deux-points.

## Réseau et machine
Une adresse IP se lit en deux parties : la partie **réseau**, commune à toutes les machines d’un même réseau local, et la partie **hôte**, propre à chaque machine. Le **masque de sous-réseau** indique où passe la frontière entre les deux.

> Une adresse IP ne dit pas qui vous êtes : elle dit où joindre la machine que vous utilisez, à cet instant.

## Adresses privées et publiques
Certaines plages, comme celles commençant par 192.168 ou 10, sont **privées** : elles ne circulent pas sur Internet et servent aux réseaux domestiques. La box attribue ces adresses par **DHCP** et traduit vers l’unique adresse **publique** du foyer grâce au mécanisme de **NAT**.

## Le DNS
Personne ne retient une adresse IP. Le **DNS** est l’annuaire qui traduit un nom de domaine lisible en adresse IP. Sans lui, le Web resterait praticable, mais illisible.`,
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
            cours: `Une fois l’adresse connue, il faut acheminer les paquets. Deux mécanismes travaillent ensemble : le **routage**, qui choisit le chemin, et **TCP**, qui garantit que le message arrive entier.

## Les routeurs
Un **routeur** est un appareil qui relie deux réseaux et décide, pour chaque paquet, vers quel voisin l’envoyer. Il consulte pour cela sa **table de routage**, qui associe des destinations à des directions. Les tables sont mises à jour automatiquement par des protocoles de routage : RIP, OSPF, ou BGP entre les grands opérateurs.

## Le chemin le plus court
Les algorithmes de routage cherchent la route de **coût minimal** : nombre de sauts, débit disponible, latence. Une **traceroute** permet de visualiser les routeurs traversés. Le chemin peut changer d’un paquet à l’autre, et il n’est pas toujours géographiquement direct.

> Un message envoyé de Lille à Lyon peut passer par Francfort. Le réseau optimise ses coûts, pas la carte.

## Le rôle de TCP
Le protocole **TCP** numérote les paquets, vérifie leur arrivée par des **accusés de réception**, redemande ceux qui manquent et les remet dans l’ordre. Il ajuste aussi le débit pour éviter la congestion. C’est ce qui rend fiable un réseau qui, lui, ne l’est pas.

## TCP ou UDP
**UDP** ne vérifie rien : il envoie sans accusé de réception. Plus rapide, il convient à la visioconférence, au jeu en ligne ou au streaming, où une image perdue vaut mieux qu’une image en retard. TCP convient au web, au courrier, au transfert de fichiers.`,
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
            cours: `Une fois les machines reliées, reste à décider **qui fournit le service**. Deux organisations coexistent, avec des propriétés très différentes.

## Le modèle client-serveur
Un **serveur** attend des requêtes et y répond ; un **client** demande. C’est le modèle du Web, du courrier électronique, des applications mobiles. Il est simple à administrer, permet un contrôle centralisé et une mise à jour immédiate du contenu.

Ses limites : le serveur est un **point unique de défaillance**. S’il tombe ou s’il est saturé — c’est le principe d’une attaque par **déni de service** —, plus personne n’est servi. D’où les fermes de serveurs, la réplication et les réseaux de distribution de contenu.

## Le modèle pair-à-pair
Dans un réseau **pair-à-pair**, chaque machine est à la fois client et serveur : elle télécharge et fournit en même temps. Le contenu est **réparti** entre les participants. Plus il y a de participants, plus le réseau est rapide, alors qu’un serveur ralentit quand la demande augmente.

> Client-serveur : une bibliothèque. Pair-à-pair : chacun prête ses livres à ses voisins.

## Usages et enjeux
Le pair-à-pair sert au partage de fichiers, à certaines mises à jour de jeux, aux crypto-monnaies, à des messageries décentralisées. Il résiste bien à la censure et à la panne, mais il rend le contrôle des contenus difficile — d’où son usage massif pour le partage illégal d’œuvres protégées.

## En pratique, des modèles mixtes
Beaucoup de services combinent les deux : un serveur central pour l’annuaire et l’authentification, du pair-à-pair pour le transfert lourd. C’est le cas de nombreuses plateformes de visioconférence et de distribution de logiciels.`,
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
            cours: `L’**hypertexte** est l’idée qui distingue le Web de tout ce qui existait avant : un texte dont certains mots renvoient à d’autres documents, atteignables d’un simple clic.

## Une idée plus ancienne que le Web
En 1945, **Vannevar Bush** imagine le Memex, une machine reliant des documents par des associations. En 1965, **Ted Nelson** invente le mot hypertexte. En **1989**, **Tim Berners-Lee** propose au CERN un système reliant les documents de laboratoires du monde entier : le Web naît de ce besoin très concret.

## Les trois inventions fondatrices
Le Web repose sur trois briques : l’**URL**, qui donne une adresse unique à chaque ressource ; le **HTTP**, protocole qui permet de la demander ; le **HTML**, langage qui décrit la page et ses liens.

> Un lien hypertexte n’est pas un renvoi de bas de page : c’est une adresse exécutable. C’est ce qui change tout.

## Lire une URL
Une URL se lit en morceaux : le **protocole** (https), le **nom de domaine** (exemple.fr), éventuellement un **chemin** vers un fichier, et parfois des **paramètres** après un point d’interrogation. Le nom de domaine se lit de droite à gauche : extension, domaine, sous-domaine.

## Ce que le lien a produit
Le Web forme un immense **graphe** de pages reliées entre elles. Cette structure permet aux moteurs de recherche de mesurer la popularité d’une page par le nombre et la qualité des liens qui pointent vers elle. Sans hypertexte, pas de PageRank, et probablement pas de moteur de recherche efficace.`,
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
            cours: `Afficher une page suppose trois choses : un **protocole** pour la demander, un **langage** pour en décrire le contenu, un autre pour en régler l’apparence.

## HTTP et HTTPS
Le protocole **HTTP** fonctionne par requête et réponse : le navigateur demande une ressource, le serveur répond avec un **code** — 200 pour succès, 301 pour redirection, 404 pour introuvable, 500 pour erreur du serveur. **HTTPS** ajoute le chiffrement **TLS** : le contenu échangé devient illisible pour un tiers, et l’identité du site est authentifiée par un certificat.

## HTML : le contenu et sa structure
Le **HTML** décrit la structure d’une page à l’aide de **balises** encadrant le contenu : titres de niveau h1 à h6, paragraphes p, listes ul et li, liens a, images img, tableaux. Une page bien structurée est lisible par un lecteur d’écran et mieux comprise par un moteur de recherche.

> HTML dit ce que sont les choses ; CSS dit à quoi elles ressemblent. Mélanger les deux est la première erreur du débutant.

## CSS : la présentation
Le **CSS** applique des règles de style à des éléments sélectionnés : couleur, taille, police, marges, disposition. Une seule feuille de style peut habiller des milliers de pages, et l’on peut adapter l’affichage à la taille de l’écran — c’est le **responsive**.

## Ce qui se passe à l’affichage
Le navigateur télécharge le HTML, construit une représentation de la page, télécharge les feuilles de style, les images et les scripts, puis dessine le résultat. **JavaScript** peut ensuite modifier la page en cours d’usage : c’est ce qui rend une page interactive sans la recharger.`,
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
            cours: `Le **navigateur** est le logiciel qui demande les pages, les interprète et les affiche. C’est aussi le principal point d’exposition de l’utilisateur.

## Ce que fait un navigateur
Il résout le nom de domaine par le DNS, envoie une requête HTTP, reçoit le HTML, télécharge les ressources associées, exécute le JavaScript et dessine la page. Il gère aussi un **cache**, un **historique**, des **cookies** et des **extensions**.

## Les cookies et le pistage
Un **cookie** est un petit fichier déposé par un site pour se souvenir de vous : panier, connexion, préférences. Les **cookies tiers**, déposés par des régies publicitaires présentes sur de nombreux sites, permettent de suivre la navigation d’un site à l’autre. Le **RGPD** impose depuis 2018 le consentement libre et éclairé pour les cookies non nécessaires.

> Le service est gratuit parce que l’attention et les données sont le produit. Ce n’est pas un slogan : c’est un modèle économique.

## Les menaces courantes
Le **hameçonnage** imite un site de confiance pour voler des identifiants. Les **logiciels malveillants** s’installent par une pièce jointe ou un téléchargement. Les **rançongiciels** chiffrent les fichiers et exigent une rançon. Une connexion wifi publique non chiffrée expose les échanges.

## Les bons réflexes
Vérifier l’adresse et le cadenas HTTPS avant de saisir un mot de passe, mettre à jour navigateur et système, utiliser des **mots de passe longs et différents** avec un gestionnaire, activer la **double authentification**, se méfier des pièces jointes, limiter les extensions installées, et savoir que la navigation privée n’efface la trace que sur la machine, pas chez le fournisseur d’accès ni chez le site.`,
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
            cours: `Un **moteur de recherche** ne parcourt pas le Web au moment où vous tapez votre requête : il a déjà tout lu, tout rangé, et il interroge son propre index.

## Les trois étapes
L’**exploration** : des robots, les crawlers, suivent les liens de page en page et téléchargent leur contenu. L’**indexation** : chaque page est analysée et rangée dans un **index inversé** qui associe à chaque mot la liste des pages où il figure. L’**interrogation** : à la requête, le moteur consulte l’index et **classe** les résultats.

## Le classement
Il combine la **pertinence** — les mots de la requête figurent-ils dans la page, dans le titre, dans les liens ? — et la **popularité**, mesurée par le nombre et la qualité des liens entrants. C’est le principe du **PageRank**, algorithme fondateur de Google : une page est importante si des pages importantes pointent vers elle.

> Le premier résultat n’est pas la vérité : c’est la réponse la mieux classée par un algorithme dont les critères sont privés.

## Ce qui influence les résultats
La personnalisation selon l’historique et la localisation, les **liens sponsorisés** signalés comme publicité, l’optimisation faite par les sites eux-mêmes — le référencement. Deux personnes tapant la même requête n’obtiennent pas nécessairement la même page de résultats.

## Chercher efficacement
Choisir des mots précis, utiliser les guillemets pour une expression exacte, restreindre à un site ou à un type de fichier, filtrer par date. Et surtout **recouper** : vérifier l’auteur, la date, la source et croiser avec une autre origine avant de citer.`,
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
            cours: `Le premier Web se lisait. À partir des années 2000, il s’écrit : chacun peut publier sans savoir programmer. C’est ce que l’on appelle le **web 2.0**.

## Le basculement
Blogs, wikis, forums, réseaux sociaux, plateformes vidéo, commentaires, avis, cartes collaboratives : le **contenu généré par les utilisateurs** devient majoritaire. Les techniques qui le permettent existaient ; ce qui change, c’est l’interface — publier devient aussi simple qu’écrire un message.

## Les effets de réseau
La valeur d’une plateforme croît avec le nombre de ses utilisateurs : plus il y a de monde, plus il est coûteux de partir, ce qui favorise la concentration en quelques très grands acteurs. C’est un mécanisme économique, pas seulement technique.

> Une encyclopédie écrite par des inconnus a fini par battre celles écrites par des spécialistes payés. Personne ne l’avait prévu.

## L’intelligence collective et ses limites
Wikipédia, OpenStreetMap, les logiciels libres montrent la fécondité de la contribution ouverte, à condition qu’existent des règles, une vérification et des contributeurs réguliers. Sans elles, la contribution ouverte produit vandalisme, désinformation et harcèlement.

## Les enjeux
Modération et responsabilité des plateformes, **droit d’auteur** et licences libres comme les Creative Commons, protection des données personnelles, **traces** laissées par chaque publication. Le contributeur n’est jamais seulement un lecteur : il est aussi une source de données monétisées.`,
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
            cours: `L’**open data**, ou donnée ouverte, désigne une donnée que chacun peut librement consulter, réutiliser et redistribuer, y compris à des fins commerciales.

## Les critères
Une donnée est ouverte si elle est **accessible** en ligne, **gratuite** ou à coût marginal, publiée dans un **format ouvert et lisible par machine** — CSV, JSON, XML plutôt qu’un PDF scanné —, accompagnée de **métadonnées** qui la décrivent, et couverte par une **licence** qui autorise explicitement la réutilisation.

## Qui publie
En France, la loi pour une République numérique de 2016 impose aux administrations de publier par défaut leurs données d’intérêt public. Le portail national data.gouv.fr les rassemble : budgets, résultats électoraux, horaires de transport, qualité de l’air, accidents, prix des carburants. L’Union européenne et de nombreuses collectivités font de même.

> Une donnée ouverte ne vaut que par ce qu’on en fait. Un fichier que personne ne réutilise est un fichier, pas une politique publique.

## Ce que cela permet
Applications d’horaires en temps réel, comparateurs de prix, cartes de qualité de l’air, journalisme de données, recherche, contrôle citoyen de l’action publique. L’ouverture crée aussi de la valeur économique pour des entreprises qui bâtissent des services sur ces données.

## Les limites
Les **données personnelles** ne sont pas ouvrables sans anonymisation solide — et la réidentification par croisement est un risque réel. S’ajoutent le secret statistique, la sécurité, la qualité inégale des jeux publiés, et le coût de leur mise à jour.`,
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
            cours: `Le **cloud** n’a rien d’immatériel : quand un fichier part dans le nuage, il atterrit sur un disque, dans un **centre de données** que quelqu’un possède, alimente et refroidit.

## Ce qu’est le cloud
C’est la mise à disposition, par le réseau, de ressources informatiques — stockage, puissance de calcul, logiciels — hébergées ailleurs et facturées à l’usage. On distingue l’infrastructure, la plateforme et le logiciel en tant que service.

## Les datacenters
Un **datacenter** rassemble des milliers de serveurs en baies, avec alimentation redondante, groupes électrogènes, climatisation et liaisons réseau multiples. Les données sont **répliquées** sur plusieurs machines, souvent sur plusieurs sites, pour survivre à une panne ou à un incendie.

> Le nuage, ce sont des bâtiments climatisés, des câbles sous-marins et des factures d’électricité. Rien d’aérien là-dedans.

## Avantages et contreparties
Le cloud offre l’accès depuis n’importe où, la synchronisation, le partage, la sauvegarde automatique et une capacité élastique sans investissement matériel. En contrepartie : dépendance à la connexion, dépendance au fournisseur, coût qui grimpe avec le volume, et question de la **souveraineté** — la loi applicable dépend du pays où les données sont stockées et de la nationalité de l’hébergeur.

## L’empreinte environnementale
Le numérique représente environ **4 %** des émissions mondiales de gaz à effet de serre, en croissance. L’essentiel vient de la fabrication des terminaux, mais les datacenters pèsent lourd par leur consommation électrique et leur refroidissement. On mesure leur efficacité par le **PUE**, rapport entre l’énergie totale consommée et celle qui sert réellement aux calculs.`,
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
            cours: `Un réseau social se représente mathématiquement par un **graphe** : des **sommets**, les personnes, et des **arêtes**, les relations. Cette représentation permet de mesurer ce qu’on croyait insaisissable.

## Le vocabulaire des graphes
Le **degré** d’un sommet est le nombre de ses voisins. Une **chaîne** relie deux sommets par une suite d’arêtes ; la **distance** entre deux sommets est la longueur de la plus courte chaîne. Le **diamètre** du graphe est la plus grande de ces distances. Un graphe peut être **orienté** — je te suis sans que tu me suives — ou non.

## L’expérience du petit monde
En 1967, le psychologue **Stanley Milgram** demande à des habitants du Midwest de faire parvenir une lettre à un inconnu de Boston, en passant uniquement par des connaissances personnelles. Les lettres arrivées ont mis en moyenne **six** intermédiaires : c’est l’origine des **six degrés de séparation**.

> Ce ne sont pas les amis proches qui raccourcissent les chemins, mais les connaissances lointaines — les liens faibles, qui relient des mondes séparés.

## Vérification à grande échelle
Les réseaux sociaux ont permis de rejouer l’expérience sur des centaines de millions de comptes : la distance moyenne y est de l’ordre de quatre à cinq. Ces graphes ont deux propriétés typiques : un **diamètre faible** et une forte densité de triangles — mes amis sont amis entre eux.

## À quoi cela sert
Recommander des contacts ou des contenus, détecter des communautés, repérer des comptes influents, modéliser la diffusion d’une information ou d’une épidémie. Le même modèle sert à étudier une rumeur et un virus.`,
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
            cours: `Aucun utilisateur ne peut lire tout ce qui se publie. Une sélection est donc inévitable — la question est de savoir **qui la fait**, et selon quels critères.

## Les systèmes de recommandation
Un fil d’actualité n’est pas chronologique : il est **classé**. L’algorithme prédit ce qui vous fera réagir à partir de vos clics, du temps passé, de vos interactions et de celles d’utilisateurs jugés semblables — c’est le **filtrage collaboratif**. L’objectif optimisé est l’**engagement**, c’est-à-dire le temps et l’attention.

## Bulle de filtre et chambre d’écho
La **bulle de filtre**, notion popularisée par Eli Pariser, désigne l’enfermement progressif dans des contenus conformes à ses opinions. La **chambre d’écho** décrit le phénomène social correspondant : on ne discute qu’avec ceux qui pensent comme soi, ce qui renforce les convictions et fait paraître minoritaires les avis contraires.

> Un algorithme qui maximise l’engagement n’optimise ni la vérité, ni l’équilibre : il optimise la réaction.

## Désinformation
Une **infox** circule plus vite qu’une information vérifiée, parce qu’elle est plus surprenante et plus indignante. Les biais cognitifs y aident : biais de confirmation, effet de répétition, illusion de familiarité.

## Se défendre
Vérifier la **source** et sa date, remonter à l’information d’origine, chercher la même information ailleurs, faire une recherche d’image inversée, se méfier des titres qui provoquent une émotion forte, consulter les rubriques de vérification des rédactions. Et savoir que sa propre indignation est le levier utilisé.`,
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
            cours: `Chaque usage laisse une trace. L’ensemble de ces traces compose une **identité numérique** que l’on ne maîtrise qu’en partie.

## Traces volontaires et involontaires
Les traces **volontaires** sont ce que l’on publie : messages, photos, avis. Les traces **involontaires** sont laissées par la machine : adresse IP, cookies, identifiants d’appareil, position, historique d’achat, durée de lecture. Les traces **héritées** viennent des autres : une photo où l’on est identifié, un commentaire qui vous cite.

## Le droit
Le **RGPD**, en vigueur depuis 2018, donne des droits : être informé, **accéder** à ses données, les faire **rectifier**, les faire **effacer** — le droit à l’oubli —, s’opposer au traitement, récupérer ses données pour les transférer. La **CNIL** contrôle et sanctionne. Le consentement doit être libre, spécifique, éclairé et révocable.

> Publier, c’est écrire à trois publics à la fois : ceux que l’on vise, ceux que l’on n’a pas prévus, et ceux qui liront dans dix ans.

## Réputation et risques
Une publication peut être recopiée, sortie de son contexte et resurgir des années plus tard, lors d’un recrutement par exemple. Le **cyberharcèlement** est un délit ; l’usurpation d’identité, la diffusion d’images sans consentement et le partage d’images intimes le sont également, avec des peines lourdes.

## Bonnes pratiques
Régler les paramètres de confidentialité, séparer les usages, réfléchir avant de publier une image d’autrui, exercer ses droits auprès des plateformes, signaler les contenus illicites, et savoir qu’un compte supprimé ne fait pas disparaître ce qui a déjà été copié.`,
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
            cours: `Une photo affichée à l’écran n’est pas une image au sens ancien : c’est un **tableau de nombres** que l’ordinateur interprète en couleurs.

## Le pixel
L’image matricielle est découpée en **pixels**, points élémentaires rangés en lignes et en colonnes. Chaque pixel porte une valeur : un niveau de gris, ou trois valeurs pour la couleur.

## Le codage des couleurs
Le modèle **RVB** compose chaque couleur à partir de trois composantes — rouge, vert, bleu — codées le plus souvent sur **8 bits**, soit 256 niveaux chacune. Un pixel occupe alors 24 bits et peut prendre environ **16,7 millions** de couleurs. Noir : trois zéros. Blanc : trois valeurs à 255.

> Une image en niveaux de gris de 1000 sur 1000 pixels, c’est un million d’octets. Rien d’autre.

## Poids et compression
Le poids brut d’une image est le nombre de pixels multiplié par le nombre d’octets par pixel. Les formats compressent : **PNG** sans perte, ce qui conserve toute l’information ; **JPEG** avec perte, ce qui allège fortement en supprimant des détails peu perceptibles ; **GIF** limité à 256 couleurs. Une image très compressée en JPEG montre des artefacts.

## Matriciel et vectoriel
Une image **vectorielle** — format SVG — n’est pas une grille : elle décrit des formes par des équations. Elle s’agrandit sans perte de qualité, ce que ne permet pas une image matricielle, mais convient mal à la photographie. Les **métadonnées EXIF** d’une photo enregistrent au passage l’appareil, la date et parfois la position GPS.`,
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
            cours: `Comme une image est un tableau de nombres, la transformer revient à appliquer un calcul à chacun de ses pixels. C’est ce que fait tout filtre de retouche.

## Du couleur au gris
Pour convertir en **niveaux de gris**, on remplace les trois composantes d’un pixel par une valeur unique. La moyenne simple des trois convient, mais la **luminance** donne un meilleur résultat visuel, car l’œil est plus sensible au vert qu’au bleu : on pondère donc davantage la composante verte.

## Le négatif
Le **négatif** s’obtient en remplaçant chaque composante par 255 moins sa valeur. Un pixel rouge vif devient cyan, le noir devient blanc. L’opération est **réversible** : l’appliquer deux fois redonne l’image d’origine.

> Une retouche n’est pas un geste artistique mystérieux : c’est une fonction appliquée à un million de nombres.

## Le seuillage
Le **seuillage** transforme l’image en noir et blanc pur : au-dessus d’un seuil, le pixel devient blanc ; en dessous, noir. C’est la base de la reconnaissance de caractères et de nombreux traitements automatiques, car il sépare la forme du fond.

## Coloriser et modifier les teintes
On peut renforcer une composante, permuter les canaux, appliquer une **teinte sépia** par une combinaison linéaire des trois composantes, ou coloriser une image ancienne. Les logiciels récents utilisent pour cela des modèles d’apprentissage : le résultat est **vraisemblable**, pas véridique — coloriser une photo de 1900, c’est inventer des couleurs plausibles, pas les retrouver.`,
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
            cours: `L’**histogramme** d’une image compte, pour chaque valeur possible, le nombre de pixels qui la portent. C’est l’outil de diagnostic de base de tout photographe et de tout logiciel de retouche.

## Le lire
En abscisse, les valeurs de 0 à 255, des tons sombres à gauche aux tons clairs à droite. En ordonnée, le nombre de pixels. Une image **sous-exposée** a un histogramme tassé à gauche ; **surexposée**, tassé à droite ; **peu contrastée**, resserré au centre.

## L’étirement
L’**étirement d’histogramme** consiste à étaler les valeurs occupées sur toute la plage disponible. Si les pixels d’une image vont de 80 à 170, on applique une transformation qui envoie 80 sur 0 et 170 sur 255 : le contraste augmente, et aucun détail n’est inventé — on utilise mieux la place existante.

> L’histogramme ne dit pas si l’image est belle. Il dit si l’information est répartie ou entassée.

## L’égalisation
L’**égalisation** va plus loin : elle redistribue les valeurs pour que l’histogramme devienne aussi plat que possible. Le contraste local est fortement renforcé, ce qui révèle des détails invisibles — très utile en imagerie médicale, satellitaire ou astronomique — mais peut aussi accentuer le bruit et produire une image peu naturelle.

## Les limites
Ces traitements ne créent pas d’information : ce qui a été perdu par surexposition, une zone entièrement à 255, est irrécupérable. C’est pourquoi les photographes exposent en surveillant l’histogramme plutôt que l’écran, dont la luminosité trompe.`,
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
            cours: `Deux notions se confondent souvent : la **définition**, qui compte les pixels, et la **résolution**, qui dit à quelle densité ils sont restitués.

## Définition, résolution, poids
La **définition** est le nombre de pixels en largeur et en hauteur, par exemple 4000 sur 3000, soit 12 millions de pixels. La **résolution** s’exprime en points par pouce et concerne l’affichage ou l’impression : la même image imprimée en grand format devient floue parce que ses pixels s’étalent. Le **poids** brut se calcule à partir de la définition et du nombre d’octets par pixel.

## Rééchantillonner
**Réduire** la définition supprime de l’information de façon définitive. **Agrandir** n’en ajoute pas : l’algorithme interpole, c’est-à-dire invente des valeurs intermédiaires à partir des pixels voisins. L’image paraît plus grande, pas plus détaillée.

> Zoomer sur une plaque d’immatriculation pour la rendre lisible n’existe qu’au cinéma. L’information absente ne se retrouve pas.

## Le filtrage par convolution
Un **filtre** remplace la valeur de chaque pixel par une combinaison de celles de ses voisins, définie par une petite matrice appelée **noyau**. Un noyau de moyenne produit un **flou** ; un noyau qui accentue les écarts produit une **netteté** renforcée ; d’autres détectent les **contours** en repérant les variations brutales de valeur.

## À quoi servent les filtres
Réduire le **bruit** d’une photo prise dans l’obscurité, préparer une image avant analyse automatique, détecter des formes, extraire des contours pour la reconnaissance de caractères ou l’imagerie médicale. Ce sont les mêmes opérations qui, empilées, forment les premières couches des réseaux de neurones de vision.`,
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
            cours: `Avant d’être un tableau de nombres, une image est de la **lumière**. Le capteur d’un appareil photo fait la traduction, en trois temps : collecter, mesurer, coder.

## Le capteur
Derrière l’objectif, un **capteur** — technologie CCD ou, le plus souvent, **CMOS** — porte des millions de **photosites**, cellules sensibles qui accumulent des charges électriques proportionnelles à la quantité de lumière reçue pendant la pose.

## La couleur
Un photosite ne perçoit pas la couleur : il compte des photons. On place donc devant lui un filtre coloré. La **matrice de Bayer** dispose ces filtres selon un motif comptant deux verts pour un rouge et un bleu — encore la sensibilité de l’œil au vert. Un algorithme de **dématriçage** reconstitue ensuite les trois composantes de chaque pixel en s’aidant des voisins.

> Un capteur ne voit pas de couleurs : il compte de la lumière derrière des filtres, et le reste est du calcul.

## La conversion
Un **convertisseur analogique-numérique** transforme chaque charge en un nombre entier. Le nombre de bits de codage détermine la finesse des nuances : 8 bits donnent 256 niveaux par composante, 12 ou 14 bits en donnent bien davantage — c’est l’intérêt du format brut, dit RAW, qui conserve les données du capteur avant traitement.

## Ce qui détermine la qualité
La **taille du capteur** et celle des photosites, plus déterminantes que le seul nombre de mégapixels ; l’**ouverture** et la **durée d’exposition** ; la **sensibilité**, dont la montée génère du bruit ; la qualité de l’optique ; et le traitement logiciel embarqué, qui joue aujourd’hui un rôle considérable dans les téléphones.`,
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
            cours: `Un téléphone affiche sa position sans rien émettre vers les satellites : il **écoute**, et calcule. Le principe tient en une idée — mesurer des temps de parcours.

## Le principe
Chaque satellite d’un système comme le **GPS** américain, **Galileo** européen, GLONASS ou Beidou émet en permanence un signal contenant l’heure d’émission, donnée par une horloge atomique, et sa position. Le récepteur compare cette heure à l’heure de réception et en déduit sa **distance** au satellite.

## La trilatération
Une distance connue place le récepteur sur une sphère. Deux sphères se coupent selon un cercle, trois selon deux points, dont un seul est plausible. Un **quatrième satellite** est nécessaire pour corriger l’imprécision de l’horloge du récepteur, qui n’est pas atomique. Avec quatre satellites, la position et l’altitude sont déterminées.

> Ce n’est pas de la magie ni de la triangulation d’angles : c’est un calcul de distances à partir de temps de vol.

## La précision et ses limites
Quelques mètres en conditions dégagées. Elle se dégrade en ville par la réflexion des signaux sur les façades, sous les arbres, en intérieur ou en tunnel. Les téléphones améliorent le résultat en s’appuyant aussi sur les **antennes du réseau mobile**, sur les **réseaux wifi** répertoriés et sur les capteurs internes — accéléromètre, gyroscope, boussole.

## Les usages et les données
Navigation, trafic en temps réel, agriculture de précision, secours, horodatage des transactions. En contrepartie, la position est l’une des données les plus **sensibles** qui soient : elle révèle domicile, travail, habitudes, fréquentations. Le RGPD la protège, et l’autorisation demandée par les applications mérite d’être limitée à l’usage réel.`,
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
            cours: `Un calculateur d’itinéraire ne regarde pas une carte : il parcourt un **graphe**. Les intersections sont les sommets, les tronçons de route les arêtes, et chaque arête porte un **poids**.

## Modéliser la route
Le poids peut être la distance, mais aussi la durée, qui dépend de la vitesse autorisée, du type de voie, des feux et du trafic en temps réel. Un péage, une pente, une interdiction de tourner se modélisent également. Changer le poids change l’itinéraire : le plus court n’est pas le plus rapide.

## L’algorithme de Dijkstra
Publié en 1959, il calcule le plus court chemin d’un sommet vers tous les autres. Il part de l’origine, explore progressivement les sommets les plus proches et met à jour les distances trouvées. Il est exact, à condition que les poids soient positifs.

> Un GPS ne cherche pas la belle route : il minimise une quantité qu’on lui a demandé de minimiser.

## Aller plus vite
Sur un réseau routier de millions de sommets, Dijkstra explore trop. L’algorithme **A étoile** l’améliore en utilisant une estimation de la distance restante — la distance à vol d’oiseau — pour explorer d’abord dans la bonne direction. Les services réels ajoutent des prétraitements qui hiérarchisent le réseau, les autoroutes d’abord.

## Les données et leurs effets
Les fonds de carte proviennent de bases comme **OpenStreetMap** ou de fournisseurs privés ; le trafic vient des téléphones des utilisateurs eux-mêmes. Le calcul d’itinéraire a des effets réels sur le terrain : reporter le trafic dans des rues résidentielles, faire disparaître un commerce d’un trajet, ou saturer une déviation que tout le monde emprunte au même moment.`,
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
            cours: `Un **système automatisé** exécute une tâche sans intervention humaine permanente. Il repose toujours sur le même triplet : des capteurs, un programme, des actionneurs.

## Les trois organes
Les **capteurs** transforment une grandeur physique — température, lumière, distance, pression, présence — en signal exploitable. La **partie commande**, souvent un microcontrôleur, applique un programme. Les **actionneurs** agissent sur le monde : moteur, vérin, résistance chauffante, vanne, voyant.

## La boucle de rétroaction
Un système en **boucle ouverte** exécute sans vérifier le résultat, comme un grille-pain à minuterie. Un système en **boucle fermée** mesure l’effet de son action et corrige : c’est la **rétroaction**. Un thermostat compare la température mesurée à la **consigne** et commande le chauffage en conséquence.

> Sans rétroaction, une machine applique une recette. Avec rétroaction, elle poursuit un objectif.

## Des exemples partout
Chauffage, régulateur de vitesse, feux de circulation adaptatifs, ascenseur, distributeur de boissons, chaîne de production, drone stabilisé, robot aspirateur. Un même schéma décrit une machine à laver et un avion en pilotage automatique — seule la complexité change.

## Enjeux
Gain de sécurité, de régularité et de productivité ; en contrepartie, questions de **fiabilité** — un capteur en panne peut faire prendre une mauvaise décision —, de **cybersécurité** dès que le système est connecté, de dépendance et de transformation du travail. La question de la **responsabilité** en cas d’accident, notamment pour les véhicules autonomes, reste largement ouverte.`,
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
            cours: `L’**Internet des objets** désigne l’extension du réseau à des objets du quotidien capables de mesurer, de communiquer et parfois d’agir : montres, ampoules, compteurs, capteurs agricoles, machines industrielles.

## Ce qui a rendu cela possible
La miniaturisation et l’effondrement du coût des capteurs et des microcontrôleurs, l’essor des réseaux sans fil — wifi, Bluetooth, 4G et 5G, réseaux basse consommation à longue portée —, l’adressage sans limite offert par **IPv6**, et le cloud pour stocker et traiter les flux collectés.

## À quoi cela sert
Domotique et suivi de consommation, santé connectée, **compteurs communicants**, logistique et traçabilité, **agriculture de précision** avec sondes d’humidité, industrie avec maintenance prédictive, ville avec éclairage adaptatif, stationnement et qualité de l’air.

> Un capteur à trois euros qui envoie une mesure par heure, multiplié par des milliards : voilà le véritable changement d’échelle.

## Les risques
Beaucoup d’objets sont vendus avec un mot de passe par défaut, sans chiffrement et sans mise à jour. Ils deviennent des portes d’entrée sur le réseau domestique et des recrues pour des **réseaux de machines compromises** — le botnet Mirai a ainsi mobilisé des caméras connectées pour saturer de grands services en 2016.

## Les enjeux
**Vie privée** : ces objets mesurent des habitudes intimes, présence, sommeil, déplacements. **Environnement** : fabrication, terres rares, obsolescence et déchets électroniques. **Souveraineté** : dépendance à un service distant, un objet cessant parfois de fonctionner quand son fabricant ferme ses serveurs.`,
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
