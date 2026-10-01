export default {
  slug: 'nsi',
  titreMigration: 'QUESTIONS EN PLUS — NSI Tle',
  motif: `Quatre questions de plus par quiz : huit suffisaient pour se tester une fois, pas pour réviser sur plusieurs semaines.`,
  chapitres: [
    {
      niveau: 'Tle',
      titre: 'Matériels, systèmes et logiciels',
      questions: [
        ['Que devient le contenu de la mémoire vive quand on éteint l’appareil ?', ['Il est recopié automatiquement sur le stockage', 'Il disparaît', 'Il est compressé', 'Il reste intact jusqu’au prochain démarrage'], 1, 'La mémoire vive contient ce qui est en cours d’exécution et s’efface à l’extinction ; seul le stockage conserve les données de façon persistante.'],
        ['Quelle fonction du système d’exploitation donne à chaque processus son tour de processeur ?', ['La gestion des fichiers', 'La gestion des droits', 'L’ordonnancement', 'La gestion de la mémoire'], 2, 'L’ordonnanceur alterne très vite entre les processus : c’est ce qui donne l’illusion qu’ils s’exécutent en parallèle.'],
        ['À quelle couche du modèle TCP/IP appartient le protocole IP ?', ['Application', 'Transport', 'Accès réseau', 'Internet'], 3, 'La couche Internet s’occupe de l’adressage et du routage : c’est le rôle d’IP. TCP et UDP sont au-dessus, dans la couche Transport.'],
        ['Sur un objet connecté, processeur, mémoire et périphériques tiennent souvent dans…', ['un système sur puce', 'un disque dur', 'un routeur', 'une carte réseau'], 0, 'Un système sur puce réunit sur un seul circuit les éléments d’un ordinateur : c’est ce qui permet des objets connectés minuscules.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Sécurité des réseaux',
      questions: [
        ['Quelle garantie le hachage assure-t-il ?', ['La confidentialité', 'L’intégrité', 'L’authenticité', 'L’anonymat'], 1, 'Comparer deux empreintes permet de vérifier que rien n’a été modifié : c’est l’intégrité. La confidentialité relève du chiffrement.'],
        ['Quel est le problème du chiffrement symétrique utilisé seul ?', ['Il est trop lent pour de gros volumes', 'Il n’utilise aucune clé', 'Il faut transmettre la clé commune sans qu’elle soit interceptée', 'Il ne protège que les images'], 2, 'Symétrique veut dire une seule clé partagée : tout le problème est de la faire parvenir à l’autre. L’asymétrique résout ce point.'],
        ['Qu’appelle-t-on l’effet d’avalanche d’une fonction de hachage ?', ['L’empreinte grandit avec la taille du message', 'Le calcul ralentit quand le message s’allonge', 'Deux messages différents ont toujours la même empreinte', 'La moindre modification du message change entièrement l’empreinte'], 3, 'Changer une seule lettre produit une empreinte méconnaissable : on ne peut donc pas deviner le message en tâtonnant autour d’une empreinte.'],
        ['Quelle protection crée un tunnel chiffré entre un appareil et un réseau ?', ['Le VPN', 'Le pare-feu', 'La segmentation du réseau', 'La mise à jour du système'], 0, 'Le VPN chiffre tout ce qui circule dans son tunnel ; le pare-feu, lui, filtre les ports sans chiffrer.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Conteneurs de données',
      questions: [
        ['Que coûte l’insertion d’un élément en tête d’un tableau (une liste Python) ?', ['Un temps constant', 'Un temps proportionnel à sa taille, car il faut tout décaler', 'Un temps logarithmique', 'Rien, l’opération est impossible'], 1, 'Chaque élément doit reculer d’une case : c’est là que la liste chaînée, qui insère en tête en temps constant, prend l’avantage.'],
        ['Quelle structure permet de vérifier qu’une expression est bien parenthésée ?', ['Une file', 'Un dictionnaire', 'Une pile', 'Un tableau trié'], 2, 'On empile chaque parenthèse ouvrante et on dépile à chaque fermante : la dernière ouverte doit être la première fermée.'],
        ['Quelle structure choisir pour représenter une relation hiérarchique, comme des dossiers et sous-dossiers ?', ['Un dictionnaire', 'Une file', 'Une pile', 'Un arbre'], 3, 'Une hiérarchie se représente par un arbre ; une relation quelconque, avec des cycles, demanderait un graphe.'],
        ['Que contient chaque maillon d’une liste chaînée ?', ['Une valeur et une référence vers le maillon suivant', 'Une valeur et son indice', 'Une clé et une valeur', 'Deux valeurs et leur somme'], 0, 'C’est la référence vers le suivant qui relie les maillons : pour atteindre le i-ième, il faut donc suivre la chaîne depuis le début.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Programmation orientée objet',
      questions: [
        ['Dans une méthode, on écrit `total = 0` au lieu de `self.total = 0`. Que se passe-t-il ?', ['L’attribut total de l’objet est mis à zéro', 'On crée une variable locale qui disparaît à la fin de la méthode', 'Python lève une erreur de syntaxe', 'On crée un attribut de classe'], 1, 'Sans self, la variable n’est pas rattachée à l’objet : l’attribut reste inchangé. C’est l’erreur la plus fréquente du chapitre.'],
        ['Une voiture a un moteur. Quel mécanisme traduit cette relation ?', ['L’héritage', 'Le polymorphisme', 'La composition', 'L’encapsulation'], 2, 'Une relation « a un » se traduit par un attribut qui est lui-même un objet : c’est la composition. L’héritage traduit « est un ».'],
        ['Pourquoi modifier un attribut par une méthode plutôt que de l’écrire directement ?', ['C’est plus rapide à l’exécution', 'Python interdit l’accès direct aux attributs', 'Cela évite d’écrire un constructeur', 'La méthode peut vérifier la validité de la valeur écrite'], 3, 'Une méthode de modification peut refuser un solde négatif ou une note de 25 : c’est l’un des intérêts de l’encapsulation.'],
        ['Avec `class Epargne(Compte):`, que reçoit la classe Epargne ?', ['Les attributs et méthodes de Compte, qu’elle peut compléter ou redéfinir', 'Un attribut qui contient un objet Compte', 'Une copie figée de Compte qu’elle ne peut pas modifier', 'Rien, les parenthèses ne servent qu’à la documentation'], 0, 'C’est l’héritage : Epargne reprend tout ce que sait faire Compte, en ajoute et peut redéfinir certaines méthodes.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Arbres et structure de données',
      questions: [
        ['Quelle est la hauteur d’un arbre réduit à sa seule racine ?', ['−1', '0', '1', '2'], 1, 'La hauteur compte les arêtes du plus long chemin racine-feuille : aucune ici, donc 0. L’arbre vide, lui, a pour hauteur −1.'],
        ['Dans quel ordre le parcours préfixe visite-t-il un arbre binaire ?', ['Gauche, nœud, droite', 'Gauche, droite, nœud', 'Nœud, gauche, droite', 'Niveau par niveau'], 2, 'Le préfixe traite le nœud avant ses sous-arbres : c’est l’ordre utile pour copier ou sérialiser un arbre.'],
        ['Que désigne la taille d’un arbre ?', ['Son nombre de feuilles', 'Sa hauteur', 'Le nombre d’enfants de la racine', 'Son nombre de nœuds'], 3, 'Taille et hauteur sont deux mesures différentes : la taille compte les nœuds, la hauteur mesure le plus long chemin depuis la racine.'],
        ['Quelle est la hauteur minimale d’un arbre binaire de 1 000 nœuds ?', ['9', '31', '99', '999'], 0, 'Un arbre de hauteur 9 contient au plus 2^10 − 1 = 1 023 nœuds, assez pour 1 000 ; une hauteur de 8 n’en permet que 511. D’où la recherche en log₂(n).'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Graphes abstraits',
      questions: [
        ['Quelle mémoire occupe la matrice d’adjacence d’un graphe à n sommets ?', ['Proportionnelle au nombre d’arêtes', 'De l’ordre de n²', 'De l’ordre de n', 'De l’ordre de log n'], 1, 'Le tableau n × n réserve une case pour chaque couple de sommets, qu’il y ait une arête ou non : c’est un gâchis sur un grand graphe creux.'],
        ['Quel parcours utilise-t-on pour détecter des cycles ou établir un tri topologique ?', ['Le parcours en largeur', 'L’algorithme de Dijkstra', 'Le parcours en profondeur', 'Le parcours infixe'], 2, 'Le parcours en profondeur s’enfonce le plus loin possible puis revient : c’est lui qui révèle les cycles et les composantes connexes.'],
        ['Qu’est-ce qu’un graphe pondéré ?', ['Un graphe dont les arêtes ont un sens', 'Un graphe sans cycle', 'Un graphe où tout sommet est relié à tous les autres', 'Un graphe dont chaque arête porte une valeur'], 3, 'Distance, coût ou débit : la valeur portée par l’arête. C’est dès qu’il y a des poids que le parcours en largeur ne suffit plus et que Dijkstra prend le relais.'],
        ['Contrairement à un arbre, un graphe peut contenir des cycles.', ['Vrai', 'Faux'], 0, 'Le graphe n’impose aucune hiérarchie : un chemin peut revenir à son point de départ. C’est pour cela qu’il faut marquer les sommets visités.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Modélisation d’une base de données',
      questions: [
        ['Dans le schéma eleve(id, nom, prenom, date_naissance, #classe_id), que signale le dièse ?', ['Une clé primaire', 'Un attribut obligatoire', 'Une clé étrangère', 'Un attribut indexé'], 2, 'Le dièse marque une clé étrangère : classe_id référence la clé primaire de la table classe. La clé primaire, elle, est notée en gras.'],
        ['Laquelle de ces situations est une anomalie d’insertion ?', ['Corriger une adresse oblige à la corriger sur plusieurs lignes', 'On ne peut pas enregistrer un professeur qui n’a pas encore de classe', 'Effacer un élève efface aussi les informations de sa classe', 'Deux élèves portent le même nom'], 1, 'L’anomalie d’insertion empêche d’enregistrer une information tant qu’une autre manque. La première est une anomalie de mise à jour, la troisième de suppression.'],
        ['Dans le modèle relationnel, qu’est-ce qu’un enregistrement ?', ['Une colonne de la table', 'La table elle-même', 'Le domaine d’un attribut', 'Une ligne de la table'], 3, 'Une relation (table) est faite d’attributs, les colonnes, et d’enregistrements, les lignes.'],
        ['Que dire d’une relation « un à un » entre deux tables ?', ['Elle est rare et souvent réductible à une seule table', 'Elle exige une table de jonction', 'Elle impose une clé étrangère dans chacune des deux tables', 'Elle est impossible dans le modèle relationnel'], 0, 'Si chaque ligne de l’une correspond à exactement une ligne de l’autre, les deux tables décrivent souvent la même entité : on peut les fusionner.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Structure de base de données',
      questions: [
        ['Que renvoie la comparaison NULL = NULL en SQL ?', ['Vrai', 'Faux', 'Inconnu', 'Zéro'], 2, 'Toute comparaison avec NULL renvoie « inconnu », même avec un autre NULL : c’est pourquoi on teste avec IS NULL.'],
        ['Quelle commande SQL retire un droit à un utilisateur ?', ['DROP', 'REVOKE', 'DELETE', 'DENY'], 1, 'GRANT attribue un droit, REVOKE le retire. DROP supprime une table entière, DELETE des lignes.'],
        ['Quel mot-clé fournit une valeur quand l’insertion n’en donne aucune ?', ['CHECK', 'UNIQUE', 'NOT NULL', 'DEFAULT'], 3, 'DEFAULT fixe une valeur par défaut ; NOT NULL, lui, rendrait la valeur obligatoire et refuserait l’insertion.'],
        ['Une application ne fait que lire la base. Selon le principe de moindre privilège, quels droits lui donner ?', ['Seulement le droit de lecture (SELECT)', 'Tous les droits, par précaution', 'SELECT et DELETE', 'Aucun droit'], 0, 'On ne donne que ce qui est nécessaire : si l’application est piratée, l’attaquant ne pourra ni modifier ni effacer les données.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Système de gestion de bases de données (SGBD)',
      questions: [
        ['Un virement débite un compte, puis une panne survient avant le crédit. Quelle propriété impose d’annuler le débit ?', ['L’isolation', 'La durabilité', 'L’atomicité', 'La concurrence'], 2, 'L’atomicité, c’est tout ou rien : les deux opérations réussissent ensemble ou aucune n’est gardée.'],
        ['Quels mécanismes le SGBD emploie-t-il pour gérer les accès concurrents ?', ['Le chiffrement et le hachage', 'Des verrous ou des versions', 'Des index et des vues', 'Le tri et la pagination'], 1, 'Verrous ou versions empêchent deux clients qui modifient la même ligne d’écraser mutuellement leur travail.'],
        ['Comment un SGBD sort-il d’un interblocage entre deux transactions ?', ['Il attend indéfiniment', 'Il redémarre le serveur', 'Il valide les deux transactions', 'Il détecte l’interblocage et annule l’une des deux transactions'], 3, 'Chacune attend la ressource de l’autre : le SGBD tranche en annulant l’une, qui pourra être relancée.'],
        ['Que font les bases NoSQL par rapport aux bases relationnelles ?', ['Elles renoncent à une partie du modèle relationnel pour gagner en volume et en répartition', 'Elles n’enregistrent aucune donnée durablement', 'Elles interdisent les requêtes', 'Elles sont toujours embarquées, sans serveur'], 0, 'Elles sacrifient certaines garanties du relationnel pour répartir d’énormes volumes sur de nombreuses machines.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Le langage SQL',
      questions: [
        ['À quelle famille de commandes appartient ALTER TABLE ?', ['La manipulation des données', 'La définition des données', 'La gestion des droits', 'Le contrôle des transactions'], 1, 'CREATE, ALTER et DROP TABLE définissent la structure ; SELECT, INSERT, UPDATE et DELETE manipulent le contenu.'],
        ['Quelle condition sélectionne les noms qui commencent par D ?', ["nom = 'D%'", "nom IN ('D')", "nom LIKE 'D%'", "nom IS 'D'"], 2, 'LIKE compare à un motif où le pour-cent remplace n’importe quelle suite de caractères ; l’égalité, elle, chercherait littéralement « D% ».'],
        ['Que renvoie `SELECT COUNT(*) FROM eleve` ?', ['La liste de tous les élèves', 'La somme des moyennes', 'Le premier élève de la table', 'Le nombre de lignes de la table eleve'], 3, 'COUNT est un agrégat : il résume l’ensemble des lignes en une seule valeur, leur nombre.'],
        ['Quel mot-clé élimine les doublons d’un résultat ?', ['DISTINCT', 'UNIQUE', 'LIMIT', 'HAVING'], 0, 'SELECT DISTINCT ne garde qu’un exemplaire de chaque ligne ; UNIQUE est une contrainte posée à la création de la table.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Tri de données avec le langage SQL',
      questions: [
        ['Après un ORDER BY, quelles lignes renvoie `LIMIT 10 OFFSET 20` ?', ['Les lignes 1 à 10', 'Les lignes 21 à 30', 'Les lignes 20 à 30', 'Les lignes 10 à 20'], 1, 'OFFSET saute les 20 premières lignes, puis LIMIT en garde 10 : c’est la troisième page d’un affichage par dix.'],
        ['Qu’est-ce que la collation d’une base ?', ['L’ordre de stockage des lignes', 'La liste des index', 'Les règles de tri des chaînes, notamment pour les majuscules et les accents', 'La taille maximale d’une table'], 2, 'Selon la collation, « Élise » et « elise » ne se classent pas au même endroit.'],
        ['Pourquoi un tri sur une colonne indexée est-il plus rapide ?', ['Parce que la table est rangée sur le disque dans cet ordre', 'Parce que le SGBD ignore alors les lignes', 'Parce que l’index supprime les doublons', 'Parce que l’index fournit déjà l’ordre'], 3, 'L’index est une structure auxiliaire déjà ordonnée : le SGBD n’a plus qu’à la suivre, sans trier le résultat.'],
        ['Sur un gros volume, quelle bonne pratique réduit le coût d’un tri ?', ['Filtrer avant de trier', 'Trier toutes les colonnes', 'Trier deux fois pour vérifier', 'Supprimer le LIMIT'], 0, 'Un tri coûte de l’ordre de n log n : réduire n par un WHERE d’abord rend le tri bien moins cher.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Programmes et données',
      questions: [
        ['Que se passe-t-il en Python quand on évalue `1 + "2"` ?', ['On obtient le nombre 3', 'Une erreur de type est levée', 'On obtient la chaîne « 12 »', 'On obtient le nombre 12'], 1, 'Le typage fort de Python refuse d’additionner un entier et une chaîne, sans tenter de conversion implicite.'],
        ['Qui a montré que le problème de l’arrêt est indécidable ?', ['Von Neumann', 'Codd', 'Turing', 'Dijkstra'], 2, 'Alan Turing l’a démontré : aucun algorithme ne peut décider, pour tout programme, s’il s’arrête sur une entrée donnée.'],
        ['Comment fonctionne Java, cité comme solution mixte ?', ['Il est interprété ligne à ligne comme Python', 'Il est compilé directement pour un seul processeur', 'Il ne peut pas être exécuté sans navigateur', 'Il est compilé vers un code intermédiaire exécuté par une machine virtuelle'], 3, 'Le code intermédiaire est portable ; la machine virtuelle de chaque système se charge de l’exécuter.'],
        ['Dans `sorted(mots, key=len)`, que montre l’argument key ?', ['Qu’une fonction peut être passée en argument comme une donnée', 'Que len est une variable globale', 'Que sorted est une méthode de liste', 'Que les mots sont triés par ordre alphabétique'], 0, 'La fonction len est transmise à sorted, qui l’applique à chaque mot : c’est la fonction « donnée de première classe ».'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Paradigmes de programmation',
      questions: [
        ['Que signifie l’immutabilité en programmation fonctionnelle ?', ['Les fonctions ne peuvent pas être appelées deux fois', 'On crée une nouvelle valeur au lieu de modifier l’ancienne', 'Les variables sont toutes globales', 'Le programme ne peut plus être modifié'], 1, 'Ne jamais modifier une valeur existante évite qu’une autre partie du programme voie ses données changer sans prévenir.'],
        ['Quel est le point faible du paradigme impératif quand le programme grandit ?', ['Il ne sait pas faire de boucles', 'Il est trop lent', 'L’état partagé rend le raisonnement difficile', 'Il interdit les fonctions'], 2, 'Quand de nombreuses instructions modifient le même état, il faut tout lire pour savoir ce que vaut une variable à un instant donné.'],
        ['Dans un programme événementiel, qu’est-ce qui décide du flot d’exécution ?', ['L’ordre des lignes du fichier', 'Le compilateur', 'Le programmeur, à l’avance', 'Les événements qui arrivent : clic, message réseau, minuteur'], 3, 'Le programme attend et réagit : ses gestionnaires sont appelés au gré de ce qui se produit.'],
        ['Quel paradigme est le plus proche de l’exécution réelle de la machine ?', ['L’impératif', 'Le fonctionnel', 'L’événementiel', 'L’objet'], 0, 'Affectations, boucles et conditions correspondent directement à ce que fait le processeur : d’où son usage quand la performance est critique.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Modularité des programmes',
      questions: [
        ['Que signifie qu’un module a une forte cohésion ?', ['Il dépend de nombreux autres modules', 'Il contient beaucoup de fonctions', 'Tout ce qu’il contient concerne le même sujet', 'Il est écrit par une seule personne'], 2, 'Forte cohésion à l’intérieur, faible couplage entre modules : ce sont les deux critères d’un bon découpage.'],
        ['Qui doit garantir la postcondition d’une fonction ?', ['L’appelant', 'La fonction elle-même', 'L’interpréteur', 'L’utilisateur final'], 1, 'La postcondition est ce que la fonction promet en retour ; la précondition, ce que l’appelant doit garantir avant l’appel.'],
        ['Quel avantage a `import math` suivi de `math.sqrt(2)` sur `from math import sqrt` ?', ['On sait toujours de quel module vient chaque fonction', 'Le programme s’exécute deux fois plus vite', 'sqrt serait inaccessible autrement', 'Il n’y a plus besoin d’installer le module'], 0, 'Le préfixe math. rend l’origine visible à chaque appel : c’est la forme la plus lisible.'],
        ['Quel test simple révèle qu’un module est mal découpé ?', ['Il dépasse cent lignes', 'Il contient une classe', 'Il n’a pas de docstring', 'On ne peut pas expliquer ce qu’il fait en une phrase sans employer « et »'], 3, 'S’il faut un « et » pour le décrire, le module fait deux choses et gagnerait à être scindé.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Bonnes pratiques logicielles',
      questions: [
        ['Quelle règle guide le choix de la longueur d’un nom de variable ?', ['Un nom ne dépasse jamais trois lettres', 'Plus la portée est large, plus le nom doit être explicite', 'Tous les noms doivent être en majuscules', 'Le nom doit indiquer la valeur actuelle'], 1, 'Un compteur de boucle courte peut s’appeler i ; une variable utilisée dans tout le programme mérite un nom comme nb_eleves_inscrits.'],
        ['Parmi ces entrées, laquelle est un cas limite à tester ?', ['Une liste de dix nombres ordinaires', 'Une chaîne à la place d’un nombre', 'Une liste vide', 'Un fichier bien formé'], 2, 'Liste vide, un seul élément, borne exacte : ce sont les cas limites. Une chaîne à la place d’un nombre est un cas d’erreur.'],
        ['Que vaut un commentaire faux ?', ['Autant qu’un commentaire juste', 'Il est sans effet', 'Il vaut mieux qu’aucun commentaire', 'Il est pire que pas de commentaire'], 3, 'Il induit en erreur celui qui lui fait confiance : il faut mettre à jour les commentaires avec le code.'],
        ['Qu’attend-on d’un bon enregistrement dans git ?', ['Qu’il soit petit et que son message explique l’intention', 'Qu’il regroupe une semaine de travail', 'Que son message liste chaque ligne modifiée', 'Qu’il soit fait une fois le projet terminé'], 0, 'Un petit enregistrement bien décrit permet de retrouver quand et pourquoi une ligne a changé, et de revenir en arrière proprement.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Mise au point logicielle',
      questions: [
        ['Quelle est la première étape pour corriger un bug ?', ['Modifier le code au hasard', 'Reproduire l’erreur de façon fiable, avec le plus petit cas possible', 'Réécrire la fonction entière', 'Ajouter des commentaires'], 1, 'Sans reproduction fiable, impossible de savoir si une correction marche ; un petit cas d’entrée rend la localisation bien plus simple.'],
        ['Une division par zéro arrête le programme en route. À quelle famille appartient cette erreur ?', ['Erreur de syntaxe', 'Erreur de logique', 'Erreur d’exécution', 'Erreur de compilation'], 2, 'Le code est lisible, mais l’exécution échoue sur une opération impossible : c’est une erreur d’exécution, bruyante donc repérable.'],
        ['À quel niveau faut-il traiter une exception ?', ['Toujours dans la fonction où elle se produit', 'Jamais : il faut laisser le programme s’arrêter', 'Tout en haut du programme, en attrapant tout', 'Au niveau où l’on sait quoi faire'], 3, 'Par exemple, là où l’on peut avertir l’utilisateur qu’un fichier est absent et lui proposer un autre chemin.'],
        ['Pourquoi ce code est-il risqué : `for x in L: if x < 0: L.remove(x)` ?', ['Il modifie la liste pendant qu’il la parcourt et peut sauter des éléments', 'remove n’existe pas en Python', 'La condition x < 0 est toujours fausse', 'Il provoque une erreur de syntaxe'], 0, 'Supprimer un élément décale les suivants : la boucle en saute un. Deux négatifs consécutifs, et le second reste dans la liste.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Algorithme récursif',
      questions: [
        ['Que manque-t-il à `def f(n): return n * f(n - 1)` ?', ['Un paramètre supplémentaire', 'Un cas de base', 'Une boucle', 'Une variable globale'], 1, 'Sans cas de base (par exemple renvoyer 1 quand n vaut 0), les appels ne s’arrêtent jamais et la pile déborde.'],
        ['Que conserve la pile d’appels pour chaque appel en cours ?', ['Le code source de la fonction', 'Le résultat final du programme', 'Ses paramètres et l’endroit où reprendre', 'La liste de toutes les variables globales'], 2, 'Chaque appel occupe une place en mémoire : c’est pour cela que la profondeur de récursion est limitée.'],
        ['Avec `def s(L): return 0 if L == [] else L[0] + s(L[1:])`, que vaut `s([4, 5, 6])` ?', ['4', '6', '0', '15'], 3, 's([4, 5, 6]) = 4 + s([5, 6]) = 4 + 5 + s([6]) = 4 + 5 + 6 + s([]) = 15.'],
        ['Quand préférer une version itérative à une version récursive ?', ['Quand la profondeur serait très grande ou la performance critique', 'Quand on parcourt un arbre', 'Quand le code doit être le plus court possible', 'Jamais : la récursivité est toujours meilleure'], 0, 'Les deux ont la même puissance, mais la pile d’appels est bornée : sur une grande profondeur, la boucle passe là où la récursion échoue.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Diviser pour régner',
      questions: [
        ['Combien de comparaisons faut-il environ pour une recherche dichotomique dans un million d’éléments ?', ['1 000', '20', '500 000', '2'], 1, 'Chaque comparaison divise par deux la zone de recherche : 2^20 dépasse le million, donc une vingtaine suffit.'],
        ['Dans le tri fusion, quelle étape concentre le travail ?', ['Diviser', 'Régner', 'Combiner, c’est-à-dire fusionner les deux moitiés triées', 'Aucune, elles se valent'], 2, 'Couper en deux ne coûte rien ; c’est la fusion, qui prend à chaque étape le plus petit élément disponible, qui fait le travail.'],
        ['Quel est le principe de l’exponentiation rapide ?', ['Multiplier n fois le nombre par lui-même', 'Trier les exposants', 'Calculer la puissance au hasard puis corriger', 'Élever au carré plutôt que multiplier n fois'], 3, 'x^16 = (((x²)²)²)² : quatre élévations au carré au lieu de quinze multiplications.'],
        ['Que se passe-t-il si l’on applique la recherche dichotomique à un tableau non trié ?', ['Elle peut renvoyer un résultat faux sans rien signaler', 'Elle trie d’abord le tableau', 'Elle lève une erreur', 'Elle devient simplement plus lente'], 0, 'Rien ne prévient : la moitié écartée peut justement contenir la valeur. Le tri préalable est une condition absolue.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Programmation dynamique',
      questions: [
        ['Avec des pièces de 1, 3 et 4, combien de pièces faut-il au minimum pour rendre 6 ?', ['3', '2', '1', '4'], 1, '3 + 3 suffit. Le glouton, qui prend d’abord la plus grosse pièce, donne 4 + 1 + 1, soit trois pièces.'],
        ['Quel avantage a l’approche ascendante (tabulation) sur la mémoïsation ?', ['Le code reste identique à la version récursive', 'Elle n’utilise aucune mémoire', 'Aucun risque de dépassement de la pile d’appels', 'Elle ne demande aucun ordre de calcul'], 2, 'Remplir un tableau par une boucle n’empile aucun appel ; en contrepartie, il faut trouver soi-même le bon ordre de remplissage.'],
        ['Quel tableau utilise-t-on pour résoudre le problème du sac à dos ?', ['Aucun tableau', 'Un tableau trié', 'Un dictionnaire de listes chaînées', 'Un tableau à deux dimensions'], 3, 'Une dimension pour les objets considérés, une pour la capacité : chaque case réutilise les cases déjà remplies.'],
        ['Si les sous-problèmes sont indépendants et ne se recouvrent pas, quelle méthode suffit ?', ['Diviser pour régner', 'La programmation dynamique', 'L’algorithme glouton', 'La recherche séquentielle'], 0, 'Sans chevauchement, rien n’est recalculé : mémoriser serait inutile. C’est le recouvrement qui justifie la programmation dynamique.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Recherche de sous-chaîne',
      questions: [
        ['En cas d’échec, de combien l’algorithme naïf décale-t-il le motif ?', ['De la longueur du motif', 'De la moitié du motif', 'D’un seul cran', 'Jusqu’à la fin du texte'], 2, 'Il repart ensuite du début du motif : il oublie tout ce que les comparaisons précédentes lui ont appris.'],
        ['Quand Boyer-Moore-Horspool est-il particulièrement rapide ?', ['Quand le motif est très court', 'Quand le texte est trié', 'Quand le texte ne contient qu’une seule lettre répétée', 'Quand le motif est long, sur du texte naturel'], 3, 'Plus le motif est long, plus les sauts permis par la table de décalage sont grands : des positions sont écartées sans être examinées.'],
        ['Que coûte le prétraitement du motif dans les algorithmes efficaces ?', ['De l’ordre de m opérations', 'De l’ordre de n opérations', 'De l’ordre de m × n opérations', 'Rien du tout'], 0, 'On investit un calcul sur le motif de longueur m pour économiser ensuite sur le texte, bien plus long.'],
        ['Motif très répétitif et besoin d’une performance garantie : quel algorithme choisir ?', ['L’algorithme naïf', 'Knuth-Morris-Pratt', 'Boyer-Moore-Horspool', 'La recherche dichotomique'], 1, 'KMP ne recule jamais dans le texte et garantit un coût n + m, alors que Boyer-Moore peut tomber à m × n dans le pire cas.'],
      ],
    },
  ],
}
