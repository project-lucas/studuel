export default {
  slug: 'nsi',
  titreMigration: 'QUESTIONS EN PLUS — NSI 1re',
  motif: `Quatre questions de plus par quiz : huit suffisaient pour se tester une fois, pas pour réviser sur plusieurs semaines.`,
  chapitres: [
    {
      niveau: '1re',
      titre: 'Une machine à calculer : le bit',
      questions: [
        ['Combien de bits faut-il au minimum pour coder 300 valeurs différentes ?', ['8', '10', '9', '300'], 2, '8 bits donnent 256 valeurs, trop peu ; 9 bits en donnent 512, ce qui suffit.'],
        ['Que se passe-t-il quand on ajoute un bit à un codage ?', ['Le nombre de valeurs représentables double', 'Il augmente de un', 'Il est multiplié par dix', 'Il ne change pas'], 0, 'Avec n bits, on code 2 puissance n valeurs : un bit de plus multiplie ce nombre par 2.'],
        ['Combien de valeurs peut-on coder sur 10 bits ?', ['100', '20', '512', '1 024'], 3, '2 puissance 10 = 1 024 : c’est pour cela que « kilo » a longtemps désigné 1 024 en informatique.'],
        ['Qu’est-ce qui distingue une opération logique bit à bit (ET, OU) d’une addition binaire ?', ['Elle se fait en base 10', 'Elle se fait position par position, sans retenue', 'Elle ne s’applique qu’à un seul bit', 'Elle donne toujours 0'], 1, 'L’addition propage une retenue dès 1 + 1 ; une opération logique traite chaque position indépendamment.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Une machine à calculer : l’octet',
      questions: [
        ['Combien d’octets vaut un kibioctet (Kio) ?', ['1 000', '1 024', '8', '100'], 1, 'Le préfixe binaire kibi vaut 2 puissance 10 = 1 024 ; le kilo décimal vaut 1 000.'],
        ['Combien de caractères le code ASCII permet-il de représenter ?', ['128', '256', '65 536', '26'], 0, 'L’ASCII tient sur 7 bits, soit 128 caractères : alphabet latin non accentué, chiffres et ponctuation.'],
        ['Combien de chiffres hexadécimaux faut-il pour écrire un octet ?', ['Un', 'Quatre', 'Huit', 'Deux'], 3, 'Un chiffre hexadécimal vaut quatre bits : deux suffisent pour les huit bits d’un octet.'],
        ['Combien de couleurs peut-on représenter avec trois octets par pixel ?', ['Environ 256', 'Environ 65 000', 'Plus de 16 millions', 'Exactement 24'], 2, '3 octets font 24 bits, soit 2 puissance 24 ≈ 16,7 millions de couleurs.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Une machine électronique',
      questions: [
        ['Quel est le rôle de l’unité de commande dans l’architecture de von Neumann ?', ['Elle calcule', 'Elle séquence les instructions', 'Elle stocke les données', 'Elle relie la machine au monde'], 1, 'L’unité arithmétique et logique calcule ; l’unité de commande organise l’enchaînement des instructions.'],
        ['Qu’est-ce qu’une porte logique ?', ['Un circuit fait de quelques transistors réalisant NON, ET, OU…', 'Une mémoire permanente', 'Un port USB', 'Un programme du système'], 0, 'Des transistors forment des portes, des portes forment des circuits combinatoires comme l’additionneur.'],
        ['Combien de cycles par seconde effectue un processeur cadencé à 3 GHz ?', ['Trois mille', 'Trois millions', 'Trente', 'Trois milliards'], 3, 'Le préfixe giga vaut un milliard : 3 GHz, ce sont trois milliards de cycles par seconde.'],
        ['Quelle mémoire est la plus rapide ?', ['La mémoire vive', 'Le stockage', 'Les registres', 'Le cache'], 2, 'Les registres, au cœur du processeur, sont les plus rapides et les plus petits : quelques mots seulement.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Une machine programmable',
      questions: [
        ['Pourquoi 0,1 + 0,2 ne donne-t-il pas exactement 0,3 en machine ?', ['Parce que 0,1 n’a pas d’écriture binaire finie', 'Parce que le processeur arrondit à l’entier', 'Parce que Python est interprété', 'Parce que l’addition des flottants est interdite'], 0, 'Comme 1/3 en décimal, 0,1 s’écrit en binaire avec une infinité de chiffres : il est stocké de façon approchée.'],
        ['Python étant interprété, quand une division par zéro en fin de programme est-elle détectée ?', ['Avant le lancement', 'Jamais', 'À l’installation de Python', 'Au moment où la ligne est atteinte'], 3, 'C’est une erreur d’exécution : le programme peut tourner longtemps avant de s’arrêter sur la faute. Une erreur de syntaxe, elle, empêche le lancement.'],
        ['Quel est l’inconvénient d’un exécutable compilé ?', ['Il est lent', 'Il est lié à une plateforme', 'Il ne détecte aucune erreur', 'Il doit être retraduit à chaque lancement'], 1, 'La compilation donne un programme rapide, mais traduit pour un jeu d’instructions et un système précis.'],
        ['L’indécidabilité de l’arrêt d’un programme est…', ['une limite technique qui sera levée', 'un problème de vitesse des processeurs', 'un résultat démontré', 'propre au langage Python'], 2, 'Aucun programme ne peut décider, dans le cas général, si un autre s’arrête : c’est un théorème, pas un manque de puissance.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Système d’exploitation et logiciel',
      questions: [
        ['D’où part un chemin relatif ?', ['De la racine', 'Du répertoire courant', 'Du disque dur', 'Du répertoire de l’utilisateur administrateur'], 1, 'Un chemin absolu part de la racine de l’arborescence ; un chemin relatif part du répertoire où l’on se trouve.'],
        ['Qu’appelle-t-on les métadonnées d’un fichier ?', ['Son nom, sa taille, ses dates et ses droits', 'Son contenu chiffré', 'Une copie de sauvegarde', 'Le programme qui l’a créé'], 0, 'Un fichier est une suite d’octets accompagnée de ces informations, gérées par le système de fichiers.'],
        ['Comment l’ordonnanceur donne-t-il l’illusion que plusieurs programmes tournent en même temps ?', ['En les exécutant sur autant d’ordinateurs', 'En les compilant ensemble', 'En supprimant les programmes inactifs', 'En donnant à chacun de très courtes tranches de temps'], 3, 'Les processus se relaient si vite sur le processeur que tout paraît simultané.'],
        ['Un logiciel gratuit est-il forcément libre ?', ['Oui, toujours', 'Oui, s’il est téléchargeable', 'Non, il peut être fermé', 'Non, un logiciel gratuit ne peut jamais être libre'], 2, 'Le libre garantit des libertés (étudier, modifier, redistribuer le code) ; la gratuité ne dit rien du code.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Périphériques',
      questions: [
        ['Dans quelle famille ranger un micro ?', ['Entrée', 'Sortie', 'Stockage', 'Entrée-sortie'], 0, 'Un micro convertit une grandeur du monde réel, le son, en données : c’est un périphérique d’entrée.'],
        ['Quel est le principe d’un disque dur (HDD) ?', ['De la mémoire flash sans pièce mobile', 'Une gravure optique', 'Des plateaux magnétiques lus par une tête mobile', 'De la mémoire vive alimentée en permanence'], 2, 'Ses pièces mobiles le rendent plus lent et fragile aux chocs, mais sa capacité reste bon marché.'],
        ['Quel support convient à l’archivage longue durée ?', ['Les registres', 'La mémoire vive', 'Le cache', 'Les bandes magnétiques'], 3, 'Bandes et supports optiques ont un accès lent mais conviennent à la conservation longue.'],
        ['Pourquoi la scrutation est-elle moins efficace que l’interruption ?', ['Elle est plus compliquée à programmer', 'Elle consomme du temps de calcul à vérifier sans cesse le périphérique', 'Elle ne marche qu’avec le Wi-Fi', 'Elle fait perdre des données'], 1, 'Avec l’interruption, c’est le périphérique qui prévient le processeur : celui-ci ne perd pas son temps à surveiller.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'IP et le réseau local',
      questions: [
        ['Avec le masque 255.255.255.0, quelle partie de l’adresse 192.168.1.42 identifie la machine ?', ['192', '192.168', '42', '192.168.1'], 2, 'Les trois premiers octets désignent le réseau (192.168.1), le dernier la machine (42).'],
        ['Sur combien d’octets s’écrit une adresse IPv6 ?', ['4', '16', '6', '8'], 1, 'IPv6 utilise 16 octets, un espace pratiquement illimité ; l’espace d’IPv4, sur 4 octets, est épuisé.'],
        ['Quel équipement distribue les trames dans un réseau local d’après l’adresse MAC ?', ['Le commutateur', 'Le routeur', 'Le serveur DNS', 'La passerelle Internet'], 0, 'Le commutateur (switch) travaille dans le réseau local ; le routeur relie des réseaux différents d’après l’adresse IP.'],
        ['Le destinataire n’est pas sur mon réseau. À qui remet-on le paquet ?', ['Directement au destinataire', 'Au serveur DNS', 'Au commutateur, qui le diffuse partout', 'À la passerelle, c’est-à-dire au routeur'], 3, 'Le masque dit si le destinataire est local ; sinon, on confie le paquet à la passerelle.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'TCP et le bit alterné',
      questions: [
        ['Dans le bit alterné, quelle perte provoque un doublon chez le récepteur ?', ['La perte de l’accusé de réception', 'La perte du message', 'La perte de la connexion', 'Aucune perte'], 0, 'Si l’ACK se perd, l’émetteur renvoie un message déjà reçu : c’est ce doublon que le numéro permet de repérer.'],
        ['Quelle suite de numéros portent les messages successifs du bit alterné ?', ['1, 2, 3, 4…', '0, 0, 0, 0…', 'Des numéros aléatoires', '0, 1, 0, 1…'], 3, 'Le numéro alterne entre 0 et 1 ; chaque accusé rappelle le numéro qu’il acquitte.'],
        ['À quoi sert le contrôle de flux de TCP ?', ['À chiffrer les données', 'À ne pas noyer un récepteur lent', 'À choisir le chemin des paquets', 'À traduire les noms de domaine'], 1, 'Le contrôle de flux protège le récepteur ; le contrôle de congestion, lui, protège le réseau.'],
        ['Pour télécharger un fichier, quel protocole utilise-t-on ?', ['UDP, car il est plus rapide', 'Aucun, IP suffit', 'TCP, car chaque octet doit arriver, dans l’ordre', 'Le bit alterné seul'], 2, 'Un fichier doit être complet et ordonné : TCP retransmet et remet en ordre. UDP convient au direct.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Interactions client-serveur',
      questions: [
        ['Quel port utilise d’ordinaire une connexion HTTPS ?', ['80', '443', '21', '8080'], 1, 'HTTP utilise le port 80, HTTPS le port 443.'],
        ['Que signifie un code de statut commençant par 5, comme 500 ?', ['Une erreur du serveur', 'Une redirection', 'Une faute du client', 'Un succès'], 0, 'Le premier chiffre situe : 2 succès, 3 redirection, 4 faute du client, 5 faute du serveur.'],
        ['Quelle méthode HTTP convient à l’envoi d’un mot de passe ?', ['GET', 'HEAD', 'Aucune, c’est impossible', 'POST'], 3, 'POST place les données dans le corps de la requête : elles n’apparaissent ni dans l’URL ni dans l’historique.'],
        ['Quelle est la première étape quand on ouvre une page web par son nom de domaine ?', ['Envoyer la requête HTTP', 'Analyser le HTML', 'Interroger le DNS pour obtenir l’adresse IP', 'Télécharger les images'], 2, 'Il faut d’abord l’adresse IP du serveur ; viennent ensuite la connexion TCP, la requête et la réponse.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Pages interactives',
      questions: [
        ['Quel langage gère la présentation d’une page : couleurs, polices, marges ?', ['HTML', 'JavaScript', 'CSS', 'HTTP'], 2, 'HTML donne la structure, CSS la présentation, JavaScript le comportement.'],
        ['Pourquoi la séparation HTML / CSS aide-t-elle les lecteurs d’écran ?', ['Ils s’appuient sur la structure HTML', 'Ils lisent les couleurs du CSS', 'Ils exécutent le JavaScript plus vite', 'Ils n’ont besoin d’aucun des trois'], 0, 'Une structure HTML propre (titres, listes, liens) permet à un lecteur d’écran de restituer la page.'],
        ['Pourquoi une validation en JavaScript ne protège-t-elle de rien ?', ['JavaScript est trop lent', 'Elle ne marche que sur ordinateur', 'Elle ne s’exécute que sur le serveur', 'N’importe qui peut envoyer la requête sans passer par la page'], 3, 'Le code client est sous le contrôle du visiteur : toute donnée doit être revérifiée côté serveur.'],
        ['Un champ de type « courriel » dans un formulaire garantit-il une adresse valide côté serveur ?', ['Oui, le navigateur le garantit', 'Non, c’est une aide à la saisie, pas une garantie', 'Oui, si le formulaire utilise POST', 'Oui, s’il est en HTTPS'], 1, 'Les types de champ aident l’utilisateur ; le serveur doit toujours vérifier ce qu’il reçoit.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Langages de programmation',
      questions: [
        ['Que provoque 3 + "4" en Python ?', ['Le nombre 7', 'La chaîne "34"', 'Une erreur de type', 'Le nombre 34'], 2, 'Le typage fort de Python refuse d’additionner un entier et une chaîne, sans conversion silencieuse.'],
        ['Lequel de ces types Python n’est PAS modifiable en place ?', ['Le tuple', 'La liste', 'Le dictionnaire', 'Aucun des trois'], 0, 'La liste et le dictionnaire se modifient en place ; le tuple et la chaîne non.'],
        ['Qu’est-ce que la sémantique d’un langage ?', ['Les règles d’écriture correcte', 'La liste de ses mots-clés', 'Sa vitesse d’exécution', 'Ce que signifie un programme'], 3, 'La syntaxe dit ce qui est bien écrit ; la sémantique, ce que cela veut dire.'],
        ['Quelle est la force principale du langage C ?', ['Il s’exécute dans tout navigateur', 'Il est rapide et proche de la machine', 'Il n’a pas de types', 'Il est le plus fourni en bibliothèques scientifiques'], 1, 'C est rapide et proche de la machine ; JavaScript s’exécute dans le navigateur ; Python brille par ses bibliothèques.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Fonctions et structure du code',
      questions: [
        ['Dans def carre(x): return x * x puis carre(5), que sont x et 5 ?', ['x est l’argument, 5 le paramètre', 'x est le paramètre, 5 l’argument', 'Ce sont deux paramètres', 'Ce sont deux valeurs de retour'], 1, 'Le paramètre est le nom dans la définition ; l’argument, la valeur passée à l’appel.'],
        ['Où s’écrit la spécification d’une fonction en Python ?', ['Dans la docstring, juste sous la ligne de définition', 'Dans un fichier à part', 'Dans le nom de la fonction', 'Dans un commentaire en fin de fichier'], 0, 'La docstring dit ce que fait la fonction, ce qu’elle reçoit, ce qu’elle rend et ce qu’elle garantit.'],
        ['Comment appelle-t-on les conditions que doivent remplir les entrées d’une fonction ?', ['Les postconditions', 'Les invariants', 'Les préconditions', 'Les effets de bord'], 2, 'Les préconditions portent sur ce que la fonction reçoit ; les postconditions sur ce qu’elle garantit en sortie.'],
        ['Quel est l’avantage de découper un programme en fonctions pour la correction des bugs ?', ['Le programme devient plus rapide', 'Les bugs disparaissent', 'Python l’exige', 'Une correction faite une fois vaut partout où la fonction sert'], 3, 'Réutiliser une fonction, c’est aussi corriger en un seul endroit ; on peut en plus la tester séparément.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Vérifications',
      questions: [
        ['Lequel de ces cas est un cas limite pour une fonction qui traite une liste ?', ['Une liste de dix nombres ordinaires', 'La liste vide', 'Une liste triée de valeurs moyennes', 'Une liste de nombres pairs'], 1, 'Liste vide, un seul élément, zéro, valeur extrême : c’est là que se cachent les bugs.'],
        ['Que vérifie un test d’intégration ?', ['Que les fonctions travaillent bien ensemble', 'Une seule fonction isolée', 'La vitesse du programme', 'L’orthographe des commentaires'], 0, 'Le test unitaire vérifie une fonction ; le test d’intégration, leur coopération.'],
        ['Que doit expliquer un bon commentaire ?', ['Ce que fait chaque ligne', 'Le nom de l’auteur', 'La date de modification', 'Pourquoi le code est écrit ainsi'], 3, 'Le code dit déjà le « quoi » ; le commentaire doit dire le « pourquoi ».'],
        ['Que faut-il faire avant de corriger un bug qu’on a localisé ?', ['Supprimer la fonction', 'Corriger au hasard et relancer', 'Comprendre sa cause', 'Ajouter des commentaires partout'], 2, 'Une correction faite sans comprendre la cause déplace le bug plus qu’elle ne le supprime.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Terminaison et complexité',
      questions: [
        ['Pour quel type de boucle faut-il prouver la terminaison ?', ['La boucle bornée (for)', 'La boucle non bornée (while)', 'Aucune, elles terminent toujours', 'Seulement les boucles imbriquées'], 1, 'Une boucle for a un nombre de tours fixé d’avance ; une boucle while peut tourner indéfiniment.'],
        ['Quelle est la complexité de l’accès à la case i d’un tableau ?', ['Linéaire', 'Logarithmique', 'Quadratique', 'Constante'], 3, 'L’accès par indice est immédiat, quelle que soit la taille du tableau.'],
        ['Pourquoi un algorithme exponentiel est-il impraticable ?', ['Au-delà de quelques dizaines d’éléments, le nombre d’opérations explose', 'Il ne termine jamais', 'Il donne des résultats faux', 'Il demande un tableau trié'], 0, 'Essayer toutes les combinaisons de n éléments demande de l’ordre de 2 puissance n opérations.'],
        ['Dans une recherche séquentielle, quel est le meilleur cas ?', ['L’élément est absent', 'L’élément est au milieu', 'L’élément est en tête', 'L’élément est en dernière position'], 2, 'Une seule comparaison suffit s’il est en tête ; s’il est absent, il en faut n, c’est le pire cas.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Tableaux et matrices',
      questions: [
        ['Quel est l’indice du dernier élément d’un tableau de n éléments ?', ['n', 'n + 1', '1', 'n − 1'], 3, 'Les indices vont de 0 à n − 1 ; demander l’indice n provoque une erreur.'],
        ['Que produit le tranchage t[1:3] d’une liste t ?', ['Une nouvelle liste, indépendante de t', 'Une vue qui modifie t', 'Un tuple', 'Une erreur'], 0, 'Le tranchage fabrique une nouvelle liste : c’est une façon simple d’obtenir une copie.'],
        ['Quelle façon de construire un tableau est à la fois plus lisible et plus rapide ?', ['Par ajouts successifs dans une boucle', 'Par compréhension', 'En multipliant une liste par un entier', 'En le recopiant à la main'], 1, 'Une liste par compréhension, comme [i * i for i in range(10)], tient en une ligne.'],
        ['On crée m = [[0] * 3] * 3 puis on exécute m[0][0] = 1. Que devient m ?', ['Seule la première case vaut 1', 'Toute la matrice vaut 1', 'La première case de chaque ligne vaut 1', 'Python lève une erreur'], 2, 'Les trois lignes sont la même liste : modifier une case la modifie dans chaque ligne. Il faut construire chaque ligne par compréhension.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Algorithmes sur les tableaux',
      questions: [
        ['Que se passe-t-il si l’on applique la dichotomie à un tableau non trié ?', ['Python lève une erreur', 'Elle devient linéaire', 'Elle trie le tableau au passage', 'Elle peut rendre un résultat faux sans le signaler'], 3, 'Rien ne prévient : la dichotomie élimine une moitié à tort et répond faux.'],
        ['Quel est l’invariant du calcul du maximum ?', ['Après i tours, le candidat est le maximum des i premiers éléments', 'Le candidat est toujours le premier élément', 'Le tableau est trié après chaque tour', 'Le candidat diminue à chaque tour'], 0, 'Cet invariant, vrai à la fin du parcours, prouve que le candidat est le maximum de tout le tableau.'],
        ['Sur quel tableau le tri par insertion est-il quasi linéaire ?', ['Un tableau trié à l’envers', 'Un tableau presque trié', 'Un tableau aléatoire', 'Un tableau de taille paire'], 1, 'Chaque élément est déjà presque à sa place : il y a très peu de décalages à faire.'],
        ['Quel est le point fort du tri par sélection ?', ['Il est en n log n', 'Il est linéaire sur un tableau trié', 'Il fait un nombre d’échanges minimal', 'Il ne fait aucune comparaison'], 2, 'Chaque tour place un élément à sa position finale par un seul échange ; les comparaisons restent quadratiques.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Traitement de tables matricielles (tableur)',
      questions: [
        ['Que représente une ligne dans une table de données ?', ['Un descripteur', 'Un enregistrement', 'Un séparateur', 'Un type'], 1, 'Chaque ligne est un enregistrement, chaque colonne un descripteur.'],
        ['Pourquoi une liste de listes est-elle fragile pour représenter une table ?', ['On accède aux colonnes par un numéro : tout se casse si une colonne se déplace', 'Elle prend trop de mémoire', 'Elle ne peut pas contenir de texte', 'Elle ne se trie pas'], 0, 'Avec une liste de dictionnaires, on accède par un nom, et le code résiste au changement d’ordre.'],
        ['Que se passe-t-il si deux lignes portent la même clé lors d’une fusion ?', ['Python refuse la fusion', 'La seconde ligne est ignorée', 'Les deux tables sont triées', 'La fusion produit des doublons silencieux'], 3, 'Une clé doit identifier un enregistrement de façon unique, sinon le résultat est faussé sans alerte.'],
        ['Quel piège pose une virgule décimale dans un fichier CSV séparé par des virgules ?', ['Le fichier devient binaire', 'Les nombres sont arrondis', 'Elle peut être prise pour un séparateur de colonnes', 'Aucun'], 2, '« 3,5 » risque d’être lu comme deux colonnes : 3 et 5. D’où l’usage du point-virgule comme séparateur en France.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Algorithmes gloutons',
      questions: [
        ['Dans le rendu de monnaie glouton, quelle pièce prend-on à chaque étape ?', ['La plus petite pièce', 'La plus grosse pièce qui n’excède pas ce qui reste à rendre', 'Une pièce au hasard', 'La pièce la plus fréquente'], 1, 'Le glouton prend le meilleur choix immédiat, sans jamais revenir en arrière.'],
        ['Quel critère glouton est prouvé optimal pour le choix d’activités ?', ['Choisir l’activité qui finit le plus tôt', 'Choisir la plus longue', 'Choisir celle qui commence le plus tôt', 'Choisir au hasard'], 0, 'Finir le plus tôt laisse le plus de place aux activités suivantes : ce choix est démontré optimal.'],
        ['Avec les pièces de 1, 2 et 5, combien de pièces le glouton rend-il pour 8 ?', ['Quatre', 'Deux', 'Huit', 'Trois'], 3, '5, puis 2 (il reste 1), puis 1 : trois pièces, et c’est optimal avec ce système.'],
        ['Quelle est l’étape que le glouton ne fait jamais ?', ['Trier les candidats', 'Ajouter un candidat à la solution', 'Revenir sur un choix déjà fait', 'Évaluer les candidats selon un critère'], 2, 'Un choix glouton est définitif : c’est ce qui le rend rapide, et parfois non optimal.'],
      ],
    },
    {
      niveau: '1re',
      titre: 'Algorithmes d’apprentissage',
      questions: [
        ['Prédire le prix d’un logement relève de…', ['la classification', 'la régression', 'le partitionnement', 'l’apprentissage non supervisé'], 1, 'On prédit une valeur numérique : c’est une régression. Classer un courriel en indésirable ou non est une classification.'],
        ['Que se passe-t-il si k est choisi trop petit dans les k plus proches voisins ?', ['La prédiction suit le bruit', 'Les frontières s’effacent', 'Le calcul devient impossible', 'Le modèle refuse de prédire'], 0, 'Avec un seul voisin, un exemple aberrant suffit à fausser la prédiction.'],
        ['Que cherche l’apprentissage non supervisé ?', ['Une étiquette pour chaque donnée nouvelle', 'Le prix d’un bien', 'La vitesse de calcul', 'Une structure dans des données sans étiquette'], 3, 'Le partitionnement, par exemple, regroupe les données semblables sans étiquette donnée d’avance.'],
        ['Un modèle constate qu’acheter des glaces et se noyer sont liés. Que peut-on en conclure ?', ['Que les glaces causent les noyades', 'Que les noyades causent l’achat de glaces', 'Rien sur la cause : une corrélation n’est pas une cause', 'Que le modèle est en surapprentissage'], 2, 'Un modèle corrèle sans expliquer ; ici, l’été fait monter les deux à la fois.'],
      ],
    },
  ],
}
