export default {
  slug: 'snt',
  titreMigration: 'QUESTIONS EN PLUS — SNT 2de',
  motif: `Quatre questions de plus par quiz : huit suffisaient pour se tester une fois, pas pour réviser sur plusieurs semaines.`,
  chapitres: [
    {
      niveau: '2de',
      titre: 'Internet : le réseau des réseaux',
      questions: [
        ['Combien de sites américains ARPANET relie-t-il en 1969 ?', ['Deux', 'Quatre', 'Dix', 'Cent'], 1, 'ARPANET relie quatre sites, trois universités et un institut de recherche ; l’objectif est de faire circuler l’information même si une partie du réseau tombe.'],
        ['De quoi s’occupe la couche Internet du modèle TCP/IP ?', ['Du support physique', 'De l’acheminement fiable', 'De l’adressage, avec le protocole IP', 'De ce que voit l’utilisateur'], 2, 'La couche Internet gère l’adressage grâce à IP ; TCP et UDP relèvent de la couche transport.'],
        ['À quelle couche du modèle TCP/IP appartiennent HTTP, SMTP et DNS ?', ['Application', 'Transport', 'Internet', 'Accès réseau'], 0, 'Ce sont des protocoles de la couche application, celle des services que voit l’utilisateur.'],
        ['Le courrier électronique est une application du Web.', ['Vrai', 'Faux'], 1, 'Le courrier électronique est une application d’Internet, indépendante du Web, comme la messagerie instantanée.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'Internet',
      questions: [
        ['Qu’est-ce que le protocole IP ne garantit pas ?', ['L’adressage des paquets', 'L’acheminement vers la destination', 'Le découpage en paquets', 'Que les paquets arrivent'], 3, 'IP achemine les paquets grâce aux adresses mais ne garantit pas leur arrivée : c’est le rôle de TCP.'],
        ['Que connaît un routeur pour acheminer un paquet ?', ['Le chemin complet jusqu’à la destination', 'Seulement le prochain saut vers la destination', 'Le contenu du paquet', 'Le nom de l’expéditeur'], 1, 'Un routeur ne connaît pas tout le trajet : il choisit seulement vers quel voisin envoyer le paquet.'],
        ['Combien d’adresses IPv4 différentes existe-t-il environ ?', ['Environ 4,3 milliards', 'Environ 65 000', 'Environ 16,7 millions', 'Un nombre pratiquement illimité'], 0, 'Codées sur 32 bits, les adresses IPv4 sont environ 4,3 milliards : elles sont épuisées, d’où IPv6.'],
        ['Sur combien de bits une adresse IPv6 est-elle codée ?', ['32 bits', '64 bits', '128 bits', '256 bits'], 2, 'IPv6 code les adresses sur 128 bits, ce qui en offre un nombre pratiquement illimité.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'Adressage (IP)',
      questions: [
        ['Laquelle de ces adresses IPv4 est bien écrite ?', ['192.168.1.256', '192.168.1', '192.168.1.10', '300.12.5.1'], 2, 'Une adresse IPv4 compte quatre nombres de 0 à 255 séparés par des points : 256 et 300 sont impossibles.'],
        ['À quoi sert le NAT ?', ['À traduire les adresses privées vers l’unique adresse publique du foyer', 'À attribuer les adresses privées', 'À traduire un nom de domaine en adresse IP', 'À chiffrer les échanges'], 0, 'Le NAT de la box fait sortir toutes les machines du foyer sous une seule adresse publique ; le DHCP, lui, distribue les adresses privées.'],
        ['Combien d’adresses publiques un foyer reçoit-il généralement ?', ['Une par appareil', 'Aucune', 'Une par personne', 'Une seule, portée par la box'], 3, 'Le foyer a une seule adresse publique, portée par la box ; les appareils ont des adresses privées dans le réseau local.'],
        ['Comment s’écrit une adresse IPv6 ?', ['En décimal, avec des points', 'En hexadécimal, séparée par des deux-points', 'En binaire, avec des tirets', 'En lettres, comme un nom de domaine'], 1, 'Une adresse IPv6 s’écrit en hexadécimal, par groupes séparés par des deux-points.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'Le Web',
      questions: [
        ['Que décrit le langage CSS ?', ['La structure du contenu', 'La présentation : couleurs, polices, mise en page', 'Le transfert des pages', 'L’adresse des ressources'], 1, 'HTML décrit la structure, CSS la présentation : on peut changer l’apparence d’un site sans toucher à son contenu.'],
        ['Dans le modèle client-serveur du Web, quel est le rôle du navigateur ?', ['Il est le client qui demande la page', 'Il est le serveur qui stocke la page', 'Il route les paquets', 'Il indexe les pages'], 0, 'Le navigateur est le client : il demande la page, et le serveur la lui renvoie.'],
        ['Quel est le rôle du protocole HTTP ?', ['Décrire une page', 'Donner une adresse à chaque ressource', 'Classer les résultats de recherche', 'Transférer la ressource entre serveur et client'], 3, 'HTTP transfère la ressource ; HTML la décrit et l’URL lui donne une adresse unique.'],
        ['Que se passe-t-il quand une page est échangée en HTTP, sans le S ?', ['Elle ne s’affiche pas', 'Elle est plus lente', 'Son contenu circule en clair et peut être lu par un intermédiaire', 'Elle n’est pas indexée'], 2, 'Sans HTTPS, rien n’est chiffré : n’importe quel intermédiaire du réseau peut lire ce qui circule.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'Routage (TCP)',
      questions: [
        ['Quel protocole de routage est utilisé entre les grands opérateurs d’Internet ?', ['RIP', 'OSPF', 'BGP', 'DHCP'], 2, 'BGP relie les grands opérateurs ; RIP et OSPF servent au routage à l’intérieur d’un réseau.'],
        ['Pourquoi TCP numérote-t-il les paquets ?', ['Pour pouvoir les remettre dans l’ordre', 'Pour les chiffrer', 'Pour choisir leur route', 'Pour réduire leur taille'], 0, 'Les paquets pouvant arriver dans le désordre, la numérotation permet de les remettre dans l’ordre à l’arrivée.'],
        ['À quoi servent les accusés de réception de TCP ?', ['À accélérer le transfert', 'À donner une adresse aux machines', 'À choisir le routeur suivant', 'À confirmer que les paquets sont bien arrivés'], 3, 'L’expéditeur attend un accusé de réception : sans lui, il sait qu’un paquet s’est perdu et le renvoie.'],
        ['Pourquoi TCP ajuste-t-il son débit ?', ['Pour économiser de l’énergie', 'Pour éviter la congestion du réseau', 'Pour chiffrer les données', 'Pour changer de route'], 1, 'En ralentissant quand le réseau sature, TCP évite la congestion.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'Les réseaux sociaux',
      questions: [
        ['Que mesure la centralité d’un sommet dans un graphe social ?', ['Son nombre de relations', 'À quel point il est un passage obligé', 'Sa date d’inscription', 'Sa distance au sommet le plus éloigné'], 1, 'La centralité dit à quel point un sommet est un passage obligé entre les autres ; le degré compte ses relations.'],
        ['En quelle année l’expérience de Milgram a-t-elle lieu ?', ['1945', '1989', '2004', '1967'], 3, 'L’expérience de Milgram, en 1967, a popularisé l’idée des « six degrés de séparation ».'],
        ['Qu’encadre le DSA européen, entré en application en 2023 ?', ['La modération et la transparence des plateformes', 'Les données personnelles', 'Les droits d’auteur', 'Les tarifs des opérateurs'], 0, 'Le DSA encadre la modération et la transparence ; les données personnelles relèvent du RGPD.'],
        ['Sur quoi les algorithmes de recommandation des réseaux sociaux sont-ils optimisés ?', ['La véracité', 'La diversité des opinions', 'L’engagement', 'L’ordre chronologique'], 2, 'Optimisés sur l’engagement, ils favorisent ce qui fait réagir, d’où la viralité des contenus clivants.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'Les données structurées',
      questions: [
        ['Dans une table de données, que représente une colonne ?', ['Un enregistrement', 'Un attribut', 'Un fichier', 'Une jointure'], 1, 'Les lignes sont les enregistrements, les colonnes les attributs qui les décrivent.'],
        ['Pourquoi le type d’un attribut compte-t-il ?', ['Il fixe la couleur de la colonne', 'Il détermine la taille du fichier', 'Il autorise ou interdit un traitement', 'Il indique l’auteur des données'], 2, 'On ne fait pas la moyenne d’une chaîne de caractères : c’est le type qui dit quels traitements sont possibles.'],
        ['Que fait l’opération de filtrage sur une table ?', ['Elle garde seulement les lignes qui vérifient un critère', 'Elle ordonne les lignes', 'Elle fusionne deux tables', 'Elle calcule une moyenne'], 0, 'Filtrer, c’est ne garder que les lignes qui vérifient un critère ; trier, c’est les ordonner.'],
        ['« 37,2 °C est une température corporelle normale » relève de…', ['La donnée', 'L’information', 'Le format', 'La connaissance'], 3, '37,2 est une donnée, « 37,2 °C, température corporelle » une information ; la juger normale, c’est une connaissance, fruit de l’interprétation.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'Deux modèles de service : les réseaux client-serveur et pair-à-pair',
      questions: [
        ['Quelle parade protège un service contre la panne d’un serveur ?', ['La réplication sur plusieurs machines', 'Le pair-à-pair', 'Le chiffrement', 'La compression'], 0, 'En répliquant les données sur plusieurs machines, le service survit à la panne de l’une d’elles.'],
        ['Qu’est-ce qui répond au problème de l’éloignement géographique d’un serveur ?', ['Les fermes de serveurs', 'Les réseaux de distribution de contenu', 'Les tables de routage', 'Le DHCP'], 1, 'Les réseaux de distribution de contenu placent des copies près des utilisateurs, pour raccourcir le trajet.'],
        ['Quelle force le pair-à-pair présente-t-il ?', ['Il garantit la qualité des contenus', 'Il facilite le retrait des contenus illicites', 'Il résiste à la censure et aux pannes', 'Il repose sur un serveur unique'], 2, 'Sans centre, le pair-à-pair résiste à la censure et aux pannes ; en contrepartie, retirer un contenu illicite est difficile.'],
        ['Où se trouve le contenu dans un réseau pair-à-pair ?', ['Sur un serveur central', 'Dans le navigateur', 'Chez le fournisseur d’accès', 'Réparti entre les participants'], 3, 'Chaque participant détient une partie du contenu et le partage avec les autres.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'L’hypertexte',
      questions: [
        ['Qui invente le mot « hypertexte », en 1965 ?', ['Vannevar Bush', 'Tim Berners-Lee', 'Ted Nelson', 'Vinton Cerf'], 2, 'Ted Nelson invente le mot en 1965 ; Vannevar Bush avait imaginé le Memex dès 1945.'],
        ['Dans une URL, que trouve-t-on après le point d’interrogation ?', ['Le protocole', 'Des paramètres transmis à la page', 'Le nom de domaine', 'L’extension du domaine'], 1, 'Après le point d’interrogation viennent les paramètres, des données transmises à la page.'],
        ['Dans l’URL https://exemple.fr/cours/page.html, que désigne /cours/page.html ?', ['Le chemin vers la page visée', 'Le protocole', 'Le nom de domaine', 'Les paramètres'], 0, 'https est le protocole, exemple.fr le nom de domaine, /cours/page.html le chemin vers la ressource.'],
        ['Quelle brique du Web permet de demander une ressource à un serveur ?', ['HTML', 'L’URL', 'Le DNS', 'HTTP'], 3, 'HTTP est le protocole de la demande ; l’URL donne l’adresse, HTML décrit la page et ses liens.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'Localisation et photographie numérique',
      questions: [
        ['Comment s’appelle la trame qui transporte les données de position d’un récepteur GPS ?', ['EXIF', 'RVB', 'NMEA', 'HTML'], 2, 'La trame NMEA transporte les données de position ; EXIF désigne les métadonnées d’une photo.'],
        ['Que mesure la résolution d’une image ?', ['La densité des pixels, en points par pouce', 'Le nombre total de pixels', 'Le poids du fichier', 'Le nombre de couleurs'], 0, 'La résolution est la densité des pixels ; la définition, leur nombre total.'],
        ['À quoi sert le quatrième satellite dans le calcul GPS ?', ['À augmenter la vitesse', 'À afficher la carte', 'À envoyer la position au satellite', 'À corriger l’horloge du récepteur'], 3, 'Trois satellites suffisent pour la position ; le quatrième corrige l’horloge du récepteur, dont une erreur d’un millionième de seconde fausse la position de 300 mètres.'],
        ['Entre quelles valeurs varie chaque composante d’un pixel en RVB ?', ['Entre 0 et 100', 'Entre 0 et 255', 'Entre 1 et 3', 'Entre 0 et 16,7 millions'], 1, 'Chaque composante, codée sur un octet, varie de 0 à 255.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'La page web (HTTP et langages HTML et CSS)',
      questions: [
        ['Que signifie le code de réponse HTTP 500 ?', ['Succès', 'Redirection', 'Ressource introuvable', 'Erreur du serveur'], 3, '200 signifie succès, 301 redirection, 404 introuvable et 500 erreur du serveur.'],
        ['Quelle balise HTML crée un lien ?', ['a', 'p', 'img', 'ul'], 0, 'La balise a crée un lien ; p un paragraphe, img une image, ul une liste.'],
        ['En HTTPS, qu’est-ce qui authentifie l’identité du site ?', ['Le cookie', 'Le certificat', 'L’adresse IP', 'La feuille de style'], 1, 'Le chiffrement TLS rend le contenu illisible pour un tiers, et le certificat authentifie l’identité du site.'],
        ['Que signifie le code de réponse HTTP 301 ?', ['Erreur du serveur', 'Succès', 'Redirection', 'Accès interdit'], 2, 'Le code 301 indique une redirection : la ressource a changé d’adresse.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'Navigateur web et sécurité sur Internet',
      questions: [
        ['Quelle est la première étape d’un navigateur pour afficher un site ?', ['Exécuter le JavaScript', 'Dessiner la page', 'Résoudre le DNS pour trouver l’adresse IP du site', 'Télécharger les images'], 2, 'Le navigateur doit d’abord trouver l’adresse IP du site par le DNS, avant d’envoyer sa requête HTTP.'],
        ['À quoi sert un cookie propre au site visité ?', ['À se souvenir de vous : panier, connexion, préférences', 'À vous suivre d’un site à l’autre', 'À chiffrer la connexion', 'À bloquer les publicités'], 0, 'Le cookie propre au site mémorise panier, connexion et préférences ; ce sont les cookies tiers qui pistent d’un site à l’autre.'],
        ['Pourquoi faut-il limiter le nombre d’extensions du navigateur ?', ['Elles consomment trop de batterie', 'Elles empêchent HTTPS', 'Elles effacent l’historique', 'Chacune peut voir tout ce que vous faites'], 3, 'Une extension a accès à ce que vous faites dans le navigateur : chacune est une porte d’entrée possible.'],
        ['Pourquoi utiliser un mot de passe différent pour chaque site ?', ['Pour que les sites se chargent plus vite', 'Pour qu’une fuite n’en compromette qu’un seul', 'Parce que la loi l’impose', 'Pour éviter les cookies'], 1, 'Si un site se fait voler ses mots de passe, un mot de passe unique ne donne accès qu’à ce compte ; un gestionnaire aide à les retenir.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'Moteur de recherche : principes et usages',
      questions: [
        ['Que mesure le critère de pertinence dans le classement ?', ['Le nombre de liens entrants', 'Le nombre de visiteurs', 'La présence des mots de la requête dans la page, son titre, ses liens', 'L’âge du site'], 2, 'La pertinence vérifie la présence des mots de la requête ; la popularité, les liens entrants.'],
        ['Qu’appelle-t-on le référencement ?', ['L’optimisation faite par les sites eux-mêmes pour être mieux classés', 'Le paiement d’un lien sponsorisé', 'L’index inversé', 'L’historique de l’utilisateur'], 0, 'Les sites s’optimisent eux-mêmes pour remonter dans les résultats : c’est le référencement.'],
        ['Un moteur de recherche parcourt le Web au moment où l’on tape sa requête.', ['Vrai', 'Faux'], 1, 'Le moteur a tout exploré et indexé à l’avance : à la requête, il interroge son propre index.'],
        ['Que faut-il faire avant de citer une information trouvée en ligne ?', ['La partager', 'Vérifier qu’elle est en première page', 'Lire les commentaires', 'La recouper : auteur, date, source, autre origine'], 3, 'Recouper, c’est vérifier l’auteur, la date et la source, et croiser avec une autre origine.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'Le web 2.0, ou web participatif',
      questions: [
        ['Que permet un wiki ?', ['Écrire à plusieurs sur la même page', 'Publier des vidéos', 'Chiffrer ses messages', 'Classer des résultats de recherche'], 0, 'Un wiki, comme Wikipédia, permet à plusieurs personnes d’écrire et de corriger la même page.'],
        ['Qu’est-ce qui change vraiment avec le web 2.0 ?', ['Le protocole HTTP', 'L’interface, qui permet de publier sans savoir coder', 'Le réseau physique', 'Les adresses IP'], 1, 'Les techniques existaient déjà : c’est l’interface qui permet à chacun de publier sans programmer.'],
        ['Quelle conséquence économique les effets de réseau favorisent-ils ?', ['La multiplication des petits acteurs', 'La baisse des prix', 'La concentration en quelques très grands acteurs', 'La disparition de la publicité'], 2, 'Plus un service a d’utilisateurs, plus il est coûteux de le quitter : le marché se concentre.'],
        ['À partir de quand le Web devient-il participatif ?', ['Dès 1969', 'En 1989', 'Dans les années 2020', 'À partir des années 2000'], 3, 'Le premier Web se lisait ; à partir des années 2000, il s’écrit.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'Open data',
      questions: [
        ['Une donnée ouverte peut-elle être réutilisée à des fins commerciales ?', ['Non, jamais', 'Oui', 'Seulement par l’État', 'Seulement après autorisation du maire'], 1, 'L’open data se consulte, se réutilise et se redistribue librement, y compris à des fins commerciales.'],
        ['Que signifie qu’une donnée est « lisible par machine » ?', ['Qu’elle est exploitable sans ressaisie', 'Qu’elle est imprimable', 'Qu’elle est chiffrée', 'Qu’elle est affichée sur un écran'], 0, 'Une donnée lisible par machine se traite directement par un programme, sans devoir la recopier à la main.'],
        ['Comment appelle-t-on les enquêtes fondées sur des chiffres publics ?', ['Le big data', 'Le référencement', 'Le crowdfunding', 'Le journalisme de données'], 3, 'Le journalisme de données exploite les jeux publics pour enquêter, au même titre que le contrôle citoyen.'],
        ['Pourquoi certaines données publiques ne peuvent-elles pas être ouvertes ?', ['Elles sont trop volumineuses', 'Elles sont en format CSV', 'Elles relèvent du secret statistique ou de la sécurité', 'Elles datent de plus de dix ans'], 2, 'Le secret statistique et la sécurité interdisent de publier certaines données, comme les données personnelles non anonymisées.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'Cloud et datacenters',
      questions: [
        ['Quel est le principal poste d’émissions du numérique ?', ['Les datacenters', 'La fabrication des terminaux', 'Les câbles sous-marins', 'Les box internet'], 1, 'La fabrication des terminaux pèse le plus ; les datacenters consomment surtout pour l’électricité et le refroidissement.'],
        ['Que fournit le cloud au niveau « logiciel » ?', ['Des machines et du stockage', 'Un environnement d’exécution', 'Un câble réseau', 'Une application prête à l’emploi'], 3, 'Trois niveaux : l’infrastructure (machines, stockage), la plateforme (environnement d’exécution) et le logiciel (application prête à l’emploi).'],
        ['Pourquoi un datacenter a-t-il une alimentation redondante et des groupes électrogènes ?', ['Pour survivre à une coupure de courant', 'Pour refroidir les serveurs', 'Pour chiffrer les données', 'Pour réduire la facture'], 0, 'Un datacenter doit rester joignable en toutes circonstances : il double son alimentation et prévoit des groupes électrogènes.'],
        ['Que signifie une capacité « élastique » dans le cloud ?', ['Elle ne tombe jamais en panne', 'Elle est gratuite', 'Elle s’ajuste à la demande sans investir dans du matériel', 'Elle stocke les données chez l’utilisateur'], 2, 'On loue plus ou moins de ressources selon les besoins, sans acheter de machines ; en contrepartie, le coût grimpe avec le volume.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'Les réseaux sociaux, l’expérience du petit monde et les graphes',
      questions: [
        ['Qu’appelle-t-on la distance entre deux sommets d’un graphe ?', ['Le nombre total d’arêtes', 'La longueur de la plus courte chaîne qui les relie', 'La longueur de la plus longue chaîne', 'Le degré du plus grand des deux'], 1, 'La distance est la longueur de la plus courte chaîne ; le diamètre est la plus grande de ces distances.'],
        ['Quelle relation se modélise par un graphe orienté ?', ['Deux personnes qui sont amies', 'Deux villes reliées par une route', 'Deux cousins', 'Je te suis sans que tu me suives'], 3, 'Dans un graphe orienté, une arête a un sens : suivre quelqu’un n’implique pas d’être suivi en retour.'],
        ['Que révèle une forte densité de triangles dans un réseau social ?', ['Mes amis sont souvent amis entre eux', 'Le réseau a un grand diamètre', 'Les comptes sont faux', 'Il y a peu de liens faibles'], 0, 'Un triangle, ce sont trois personnes toutes reliées : sur les réseaux sociaux, mes amis sont souvent amis entre eux.'],
        ['En quoi consistait le protocole de l’expérience de Milgram ?', ['Envoyer un courriel à des inconnus', 'Compter les amis de chaque participant', 'Faire parvenir une lettre à un inconnu de Boston en passant uniquement par des connaissances', 'Appeler au hasard des numéros de téléphone'], 2, 'Chaque lettre devait passer de connaissance en connaissance jusqu’au destinataire : environ six intermédiaires suffisaient.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'Filtrage de l’information',
      questions: [
        ['Qui a popularisé la notion de bulle de filtre ?', ['Stanley Milgram', 'Eli Pariser', 'Tim Berners-Lee', 'Mark Zuckerberg'], 1, 'Eli Pariser a popularisé l’expression pour désigner l’enfermement algorithmique dans des contenus conformes à ses opinions.'],
        ['Qu’appelle-t-on l’effet de répétition ?', ['Ce qu’on lit souvent finit par paraître vrai', 'On oublie ce qu’on a lu deux fois', 'Un message répété est bloqué', 'Un contenu répété perd sa visibilité'], 0, 'À force d’être lue, une affirmation paraît vraie, même si elle est fausse : c’est un ressort de la désinformation.'],
        ['Pourquoi se méfier d’un titre qui provoque une forte indignation ?', ['Parce qu’il est toujours faux', 'Parce qu’il est trop long', 'Parce qu’il est écrit par un robot', 'Parce que cette émotion est précisément le levier utilisé pour le faire circuler'], 3, 'La surprise et l’indignation font circuler une infox plus vite qu’une information vérifiée : sa propre émotion est le levier.'],
        ['Sur quoi un système de recommandation s’appuie-t-il pour prédire vos réactions ?', ['Sur l’avis d’un journaliste', 'Sur l’ordre chronologique des publications', 'Sur vos clics, le temps passé et vos interactions', 'Sur un tirage au sort'], 2, 'Clics, temps passé et interactions nourrissent la prédiction : l’algorithme vous montre ce qui a le plus de chances de vous faire réagir.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'Exister en ligne',
      questions: [
        ['Une photo que l’on publie soi-même est une trace…', ['Volontaire', 'Involontaire', 'Héritée', 'Anonyme'], 0, 'Ce que l’on publie est une trace volontaire ; ce que la machine laisse est involontaire ; ce que les autres publient sur nous est hérité.'],
        ['Que permet le droit à la portabilité ?', ['Effacer ses données', 'Récupérer ses données pour les transférer ailleurs', 'Corriger une erreur', 'Refuser un traitement'], 1, 'La portabilité permet de récupérer ses données pour les transférer à un autre service.'],
        ['Qu’appelle-t-on la résurgence d’une publication ?', ['Sa suppression automatique', 'Son chiffrement', 'Son ressurgissement, des années plus tard, hors de son contexte', 'Sa traduction'], 2, 'Recopiée, une publication peut ressortir des années plus tard, par exemple lors d’un recrutement.'],
        ['Quelle bonne pratique protège son identité numérique ?', ['Utiliser le même compte pour tout', 'Publier sous son adresse personnelle', 'Accepter tous les cookies', 'Séparer les usages personnel, scolaire et professionnel'], 3, 'Séparer les usages, régler la confidentialité et réfléchir avant de publier l’image d’autrui limitent les risques.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'L’image numérique',
      questions: [
        ['Quel est le poids brut d’une image en niveaux de gris de 1000 × 1000 pixels, à un octet par pixel ?', ['Mille octets', 'Un million d’octets', 'Trois millions d’octets', 'Un milliard d’octets'], 1, 'Poids brut = nombre de pixels × octets par pixel : 1 000 000 × 1 = un million d’octets.'],
        ['Quelles composantes RVB donnent un rouge vif ?', ['(0, 0, 0)', '(255, 255, 255)', '(0, 255, 255)', '(255, 0, 0)'], 3, 'Rouge au maximum, vert et bleu à zéro : (255, 0, 0). (0, 0, 0) est le noir, (255, 255, 255) le blanc.'],
        ['Quelle est la limite du format GIF ?', ['Il ne gère pas l’animation', 'Il est toujours vectoriel', 'Il est limité à 256 couleurs', 'Il ne se compresse pas'], 2, 'Le GIF est limité à 256 couleurs : il sert surtout pour de petites animations.'],
        ['Quel type de compression utilise le format JPEG ?', ['Une compression avec perte', 'Une compression sans perte', 'Aucune compression', 'Une compression vectorielle'], 0, 'Le JPEG compresse avec perte : adapté aux photos, il laisse des artefacts visibles si on compresse trop.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'La colorisation d’une image',
      questions: [
        ['Quel est le négatif du pixel rouge vif (255, 0, 0) ?', ['(0, 0, 0)', '(0, 255, 255)', '(255, 255, 0)', '(128, 0, 0)'], 1, 'Chaque composante devient 255 moins sa valeur : (0, 255, 255), c’est-à-dire du cyan.'],
        ['Avec la méthode de la moyenne, quel niveau de gris donne le pixel (30, 60, 90) ?', ['30', '90', '180', '60'], 3, '(30 + 60 + 90) / 3 = 180 / 3 = 60.'],
        ['Lors d’un seuillage, que devient un pixel dont la valeur dépasse le seuil ?', ['Il devient blanc', 'Il devient noir', 'Il garde sa valeur', 'Il devient gris'], 0, 'Au-dessus du seuil, le pixel devient blanc ; en dessous, noir : on sépare la forme du fond.'],
        ['Comment obtient-on une teinte sépia ?', ['En supprimant le bleu', 'En inversant les composantes', 'Par une combinaison linéaire des trois composantes', 'Par un seuillage'], 2, 'Chaque nouvelle composante est une somme pondérée des trois anciennes : c’est une combinaison linéaire.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'Traitement par histogramme',
      questions: [
        ['Que porte l’axe des abscisses d’un histogramme d’image ?', ['Le nombre de pixels', 'La position des pixels', 'Le poids du fichier', 'Les valeurs de 0 à 255, des sombres aux clairs'], 3, 'En abscisse, les valeurs de 0 (sombre, à gauche) à 255 (clair, à droite) ; en ordonnée, le nombre de pixels.'],
        ['Que révèle un histogramme tassé vers la droite ?', ['Une image sous-exposée', 'Une image surexposée', 'Une image peu contrastée', 'Une image bien équilibrée'], 1, 'Les pixels s’entassent dans les valeurs claires : l’image est surexposée.'],
        ['Les pixels d’une image vont de 80 à 170. Après étirement, que devient la valeur 170 ?', ['255', '170', '85', '0'], 0, 'L’étirement étale les valeurs sur toute la plage : 80 devient 0 et 170 devient 255.'],
        ['Quel inconvénient l’égalisation d’histogramme présente-t-elle ?', ['Elle réduit le contraste', 'Elle supprime les couleurs', 'Elle accentue le bruit', 'Elle diminue la définition'], 2, 'L’égalisation renforce fortement le contraste local, mais accentue aussi le bruit et peut donner une image peu naturelle.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'Résolution et filtrage d’une image',
      questions: [
        ['Combien de pixels compte une image de 4000 × 3000 ?', ['7 000', '1,2 million', '120 millions', '12 millions'], 3, '4000 × 3000 = 12 000 000 pixels : c’est la définition de l’image.'],
        ['En quelle unité exprime-t-on la résolution ?', ['En pixels', 'En points par pouce', 'En octets', 'En hertz'], 1, 'La résolution est une densité, en points par pouce ; la définition se compte en pixels, le poids en octets.'],
        ['Quel est le poids brut d’une image couleur de 1000 × 1000 pixels codée sur 3 octets par pixel ?', ['3 millions d’octets', '1 million d’octets', '3 000 octets', '24 millions d’octets'], 0, 'Poids = définition × octets par pixel : 1 000 000 × 3 = 3 millions d’octets.'],
        ['Que forment les filtres de convolution une fois empilés ?', ['Un format de compression', 'Un histogramme', 'Les premières couches des réseaux de neurones de vision', 'Une table de routage'], 2, 'Les mêmes opérations de convolution, empilées, constituent les premières couches des réseaux de neurones qui analysent les images.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'Comment est captée une image ?',
      questions: [
        ['Quel composant transforme la charge d’un photosite en nombre entier ?', ['Le convertisseur analogique-numérique', 'La matrice de Bayer', 'L’objectif', 'Le dématriçage'], 0, 'Le convertisseur analogique-numérique traduit chaque charge électrique en nombre entier.'],
        ['Sur combien de bits le format RAW code-t-il souvent chaque composante ?', ['1 bit', '4 bits', '8 bits', '12 ou 14 bits'], 3, 'Le RAW garde souvent 12 ou 14 bits par composante, bien plus que les 256 niveaux du 8 bits.'],
        ['Qu’est-ce qui détermine la quantité de lumière reçue par le capteur ?', ['Le nombre de mégapixels', 'L’ouverture et la durée d’exposition', 'Le format du fichier', 'La taille de l’écran'], 1, 'Plus l’ouverture est grande et la pose longue, plus le capteur reçoit de lumière.'],
        ['Qu’est-ce qui est aujourd’hui décisif pour la qualité des photos de téléphone ?', ['La taille de l’écran', 'La matrice de Bayer', 'Le traitement logiciel embarqué', 'Le format JPEG'], 2, 'Sur un téléphone, au petit capteur, le traitement logiciel embarqué est devenu décisif.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'Géolocalisation',
      questions: [
        ['Quel pays a développé le système de positionnement Beidou ?', ['La Russie', 'Les États-Unis', 'La Chine', 'Le Japon'], 2, 'Beidou est chinois, GLONASS russe, GPS américain et Galileo européen.'],
        ['Avec un seul satellite, quel est l’ensemble des positions possibles du récepteur ?', ['Une sphère', 'Un cercle', 'Deux points', 'Un point unique'], 0, 'Une distance à un satellite place le récepteur sur une sphère ; deux sphères se coupent en un cercle, trois en deux points.'],
        ['Quelle précision le GPS atteint-il en terrain dégagé ?', ['Quelques centimètres', 'Quelques kilomètres', 'Une centaine de mètres', 'Quelques mètres'], 3, 'En terrain dégagé, la précision est de quelques mètres ; elle se dégrade en ville, sous les arbres ou en intérieur.'],
        ['À quoi servent l’accéléromètre et le gyroscope d’un téléphone pour la localisation ?', ['À recevoir les satellites', 'À assurer la continuité entre deux positions', 'À corriger l’horloge atomique', 'À chiffrer la position'], 1, 'Ces capteurs internes estiment le déplacement entre deux points mesurés, par exemple dans un tunnel.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'Calcul d’itinéraire',
      questions: [
        ['Dans le graphe d’un réseau routier, que représente un sommet ?', ['Un tronçon de route', 'Une intersection', 'Une durée', 'Un véhicule'], 1, 'Les sommets sont les intersections, les arêtes les tronçons de route, et le poids ce que l’on cherche à minimiser.'],
        ['Quelle condition l’algorithme de Dijkstra impose-t-il aux poids ?', ['Ils doivent être positifs', 'Ils doivent être entiers', 'Ils doivent être tous égaux', 'Ils doivent être des distances'], 0, 'Dijkstra ne fonctionne qu’avec des poids positifs.'],
        ['À quoi servent les prétraitements des calculateurs d’itinéraire ?', ['À dessiner la carte', 'À mesurer le trafic', 'À hiérarchiser le réseau, les autoroutes d’abord', 'À supprimer les péages'], 2, 'Sur des millions de sommets, Dijkstra seul explore trop : on hiérarchise le réseau pour aller plus vite.'],
        ['Quel poids faut-il minimiser pour obtenir le trajet le plus rapide ?', ['La distance', 'Le nombre d’intersections', 'La pente', 'La durée'], 3, 'Minimiser la durée donne le plus rapide ; minimiser la distance donne le plus court, qui n’est pas forcément le même.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'Systèmes automatisés',
      questions: [
        ['Quel composant joue souvent le rôle de partie commande ?', ['Un vérin', 'Un microcontrôleur', 'Un capteur de lumière', 'Une vanne'], 1, 'Le microcontrôleur applique le programme ; vérins et vannes sont des actionneurs.'],
        ['Lequel de ces éléments est un actionneur ?', ['Un capteur de présence', 'Un thermomètre', 'Un microcontrôleur', 'Un vérin'], 3, 'Le vérin agit sur le monde physique ; thermomètre et capteur de présence mesurent, le microcontrôleur décide.'],
        ['Quel risque apparaît dès qu’un système automatisé est connecté ?', ['La cybersécurité', 'La rouille', 'La surchauffe', 'La perte de la consigne'], 0, 'Connecté, un système devient attaquable à distance : la cybersécurité devient un enjeu.'],
        ['Qu’est-ce que la consigne d’un thermostat ?', ['La température mesurée', 'Le mode d’emploi', 'La température visée, à laquelle la mesure est comparée', 'La résistance chauffante'], 2, 'La consigne est la valeur à atteindre ; le thermostat compare la mesure à la consigne et corrige.'],
      ],
    },
    {
      niveau: '2de',
      titre: 'L’Internet des objets (ou IoT)',
      questions: [
        ['Qu’apporte l’Internet des objets à l’industrie ?', ['La maintenance prédictive', 'Les compteurs communicants', 'La domotique', 'La traçabilité des colis'], 0, 'Dans l’industrie, les capteurs permettent d’anticiper les pannes : c’est la maintenance prédictive.'],
        ['Quel rôle joue le cloud dans l’Internet des objets ?', ['Il fabrique les capteurs', 'Il stocke et traite les flux de données collectés', 'Il remplace le wifi', 'Il attribue les adresses IPv6'], 1, 'Les objets envoient leurs mesures vers le cloud, qui les stocke et les traite.'],
        ['Quelle est la conséquence de l’absence de chiffrement sur un objet connecté ?', ['L’objet consomme plus', 'L’objet ne se connecte plus', 'Les données circulent en clair', 'Les mises à jour sont bloquées'], 2, 'Sans chiffrement, n’importe qui sur le chemin peut lire les données envoyées par l’objet.'],
        ['Quel est l’enjeu environnemental de l’Internet des objets ?', ['Le manque d’adresses IP', 'La lenteur du réseau', 'Le coût des abonnements', 'La fabrication, les terres rares, l’obsolescence et les déchets électroniques'], 3, 'Des milliards d’objets à fabriquer, souvent vite obsolètes, pèsent sur les ressources et produisent des déchets électroniques.'],
      ],
    },
  ],
}
