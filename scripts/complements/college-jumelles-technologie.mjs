// FICHES JUMELLES DU COLLÈGE — technologie : les questions ajoutées aux fiches de 3e
// (quiz de 8 → 12, migrations 393 → 397), recopiées sur les fiches de 6e, 5e et
// 4e qui portent le MÊME titre et le MÊME cours. Fichier GÉNÉRÉ depuis
// l'extraction de la base du 29/09/2026 : ne pas l'éditer à la main.

export default {
  slug: "technologie",
  titreMigration: "QUESTIONS EN PLUS — TECHNOLOGIE, FICHES JUMELLES 6e/5e/4e",
  motif: `Les fiches de 5e et 4e qui sont les mêmes que celles de 3e gardaient 8 questions quand leur jumelle en a 12 : on recopie les 4 dernières.`,
  chapitres: [
  {
    "niveau": "4e",
    "titre": "La fonction technique et le principe technique",
    "questions": [
      [
        "Sur quel principe technique reposent tous les freins de vélo ?",
        [
          "La gravité",
          "Le magnétisme",
          "Le frottement",
          "La dilatation"
        ],
        2,
        "Patins, disque ou rétropédalage : ces solutions différentes exploitent toutes le frottement."
      ],
      [
        "Comment exprime-t-on une fonction d’usage ?",
        [
          "Par un verbe à l’infinitif",
          "Par un nombre",
          "Par le nom d’un composant",
          "Par une unité de mesure"
        ],
        0,
        "On écrit le service rendu par un verbe à l’infinitif : « se déplacer », « éclairer »."
      ],
      [
        "Pour un vélo, lequel de ces éléments est une solution technique ?",
        [
          "Freiner",
          "Le frottement",
          "Se déplacer",
          "Un frein à disque"
        ],
        3,
        "Le frein à disque est le composant concret retenu ; freiner est une fonction technique, le frottement un principe, se déplacer la fonction d’usage."
      ],
      [
        "Dans l’exigence « distance de freinage : moins de 5 m à 20 km/h », que désigne « moins de 5 m » ?",
        [
          "Le critère",
          "Le niveau",
          "La fonction d’usage",
          "Le principe technique"
        ],
        1,
        "Le critère est ce qu’on mesure (la distance de freinage) ; le niveau est la valeur à atteindre."
      ]
    ]
  },
  {
    "niveau": "5e",
    "titre": "Programmation graphique et programmation textuelle",
    "questions": [
      [
        "Quelle programmation convient le mieux aux programmes longs ?",
        [
          "La programmation graphique",
          "La programmation textuelle",
          "Aucune des deux",
          "Les deux aussi bien"
        ],
        1,
        "Les blocs deviennent vite illisibles sur un long programme ; le texte n’a pas de limite de taille."
      ],
      [
        "Quel langage textuel sert souvent à programmer une carte Arduino ?",
        [
          "Scratch",
          "Blockly",
          "Le C ou le C++",
          "Snap!"
        ],
        2,
        "Scratch, Blockly et Snap! sont des environnements par blocs ; l’Arduino se programme le plus souvent en C ou C++."
      ],
      [
        "En programmation par blocs, que se passe-t-il si deux blocs sont incompatibles ?",
        [
          "Le programme plante à l’exécution",
          "Un message d’erreur de syntaxe s’affiche",
          "Ils se transforment en texte",
          "Ils ne s’emboîtent pas"
        ],
        3,
        "C’est pour cela qu’aucune faute de syntaxe n’est possible avec les blocs."
      ],
      [
        "Que demande le programme du cycle 4 à propos des deux façons de programmer ?",
        [
          "Savoir lire et modifier les deux",
          "Maîtriser seulement les blocs",
          "Maîtriser seulement Python",
          "Savoir écrire un compilateur"
        ],
        0,
        "Les blocs servent à la logique, le texte à piloter une carte programmable ou à traiter des données."
      ]
    ]
  },
  {
    "niveau": "5e",
    "titre": "OST et contraintes",
    "questions": [
      [
        "Que signifie une flexibilité F0 dans un cahier des charges ?",
        [
          "Une exigence négociable",
          "Une exigence impérative",
          "Une exigence peu négociable",
          "Une exigence facultative"
        ],
        1,
        "F0 est impératif, F1 peu négociable, F2 négociable."
      ],
      [
        "« Être recyclable à 90 % » relève de quelle famille de contraintes ?",
        [
          "Économiques",
          "Esthétiques",
          "Environnementales",
          "Ergonomiques"
        ],
        2,
        "Recyclabilité, consommation et matériaux interdits sont des contraintes environnementales."
      ],
      [
        "Laquelle de ces formulations est une vraie exigence ?",
        [
          "Le casque doit être léger",
          "Le casque doit être agréable",
          "Le casque doit plaire aux clients",
          "Masse inférieure à 300 g, tolérance ±20 g"
        ],
        3,
        "Elle donne un critère (la masse), un niveau (300 g) et une flexibilité (±20 g) : on peut la vérifier."
      ],
      [
        "Que coûte le plus souvent le fait de rendre un objet plus sûr ?",
        [
          "Il devient plus lourd",
          "Il devient moins cher",
          "Il devient plus rapide à fabriquer",
          "Rien, c’est sans contrepartie"
        ],
        0,
        "Les contraintes s’opposent : la sécurité ajoute souvent de la matière, donc du poids. Concevoir, c’est arbitrer."
      ]
    ]
  },
  {
    "niveau": "5e",
    "titre": "Bases de la programmation",
    "questions": [
      [
        "Quelle différence y a-t-il entre un algorithme et un programme ?",
        [
          "L’algorithme est toujours plus long",
          "Le programme ne contient jamais de boucle",
          "Le programme est la traduction de l’algorithme dans un langage compris par la machine",
          "Il n’y en a aucune"
        ],
        2,
        "L’algorithme est la suite d’instructions ; le programme l’écrit dans un langage que la machine exécute."
      ],
      [
        "Quelle boucle convient pour « répéter tant que le bouton n’est pas appuyé » ?",
        [
          "Une boucle bornée",
          "Une boucle non bornée",
          "Une séquence",
          "Une variable"
        ],
        1,
        "On ne connaît pas d’avance le nombre de tours : la boucle est non bornée."
      ],
      [
        "Dans un organigramme, quelle forme représente un test ?",
        [
          "Le rectangle",
          "La flèche",
          "Le cercle",
          "Le losange"
        ],
        3,
        "Losanges pour les tests, rectangles pour les actions, flèches pour l’enchaînement."
      ],
      [
        "Pour un programme, un capteur est…",
        [
          "une entrée, que le programme lit",
          "une sortie, que le programme commande",
          "une variable",
          "un opérateur logique"
        ],
        0,
        "Le programme lit les capteurs (entrées) et commande les actionneurs (sorties) : c’est le lien avec la chaîne d’information."
      ]
    ]
  },
  {
    "niveau": "5e",
    "titre": "Critères de choix d’un OST",
    "questions": [
      [
        "Quelle est la dernière étape d’un tableau multicritère ?",
        [
          "Noter chaque case",
          "Additionner les totaux pondérés",
          "Choisir les solutions à comparer",
          "Dessiner chaque solution"
        ],
        1,
        "On note les cases, on affecte les coefficients, puis on additionne les totaux pondérés pour départager les solutions."
      ],
      [
        "Par rapport à une ampoule à filament, une LED…",
        [
          "coûte moins cher à l’achat et dure moins longtemps",
          "consomme sept fois plus",
          "coûte plus cher à l’achat mais consomme peu et dure bien plus longtemps",
          "a la même durée de vie"
        ],
        2,
        "Son prix d’achat est plus élevé, mais sa faible consommation et sa durée de vie la rendent moins chère au coût global."
      ],
      [
        "Quelle question pose le critère d’encombrement ?",
        [
          "Combien de temps sans panne ?",
          "Est-il conforme aux normes ?",
          "Est-il facile à utiliser ?",
          "Tient-il dans l’espace disponible ?"
        ],
        3,
        "L’encombrement et la masse vérifient que l’objet trouve sa place ; la fiabilité, l’ergonomie et la sécurité posent les autres questions."
      ],
      [
        "Sur quels critères une solution doit-elle d’abord atteindre le niveau exigé ?",
        [
          "Les critères impératifs (F0)",
          "Les critères esthétiques",
          "Les critères négociables (F2)",
          "Le seul critère du prix"
        ],
        0,
        "Une solution qui manque un critère F0 est écartée, quel que soit son score ailleurs."
      ]
    ]
  },
  {
    "niveau": "5e",
    "titre": "La circulation de l’information dans un réseau informatique",
    "questions": [
      [
        "Quel équipement relie les machines d’un même réseau local et aiguille les messages ?",
        [
          "Le routeur",
          "Le DNS",
          "Le switch",
          "Le modem"
        ],
        2,
        "Le switch travaille dans un même réseau ; le routeur relie deux réseaux différents."
      ],
      [
        "Quel protocole sert au courrier électronique ?",
        [
          "HTTP",
          "FTP",
          "HTTPS",
          "SMTP"
        ],
        3,
        "SMTP transporte le courrier ; HTTP et HTTPS servent le web, FTP le transfert de fichiers."
      ],
      [
        "Que se passe-t-il si un paquet manque à l’arrivée ?",
        [
          "Il est redemandé",
          "Tout le message est perdu",
          "Le routeur le reconstitue au hasard",
          "L’ordinateur s’arrête"
        ],
        0,
        "Les paquets numérotés sont réassemblés à l’arrivée, et un paquet manquant est redemandé."
      ],
      [
        "Comment appelle-t-on la machine qui demande un service à un serveur ?",
        [
          "Le routeur",
          "Le client",
          "Le switch",
          "La box"
        ],
        1,
        "Le serveur rend un service, le client le demande : c’est le cas de ton navigateur face à un site web."
      ]
    ]
  },
  {
    "niveau": "4e",
    "titre": "Cycle de vie d’un OST",
    "questions": [
      [
        "Qu’est-ce que l’obsolescence logicielle ?",
        [
          "Une pièce qui n’existe plus",
          "L’arrêt des mises à jour",
          "Un simple effet de mode",
          "Une batterie usée"
        ],
        1,
        "L’objet fonctionne encore mais ne reçoit plus de mises à jour ; la pièce introuvable relève de l’obsolescence technique."
      ],
      [
        "Quel est le principe du modèle économique linéaire ?",
        [
          "Extraire, fabriquer, jeter",
          "Réduire, réemployer, recycler",
          "Réparer avant de remplacer",
          "Louer au lieu d’acheter"
        ],
        0,
        "Le modèle linéaire épuise les ressources ; l’économie circulaire cherche à refermer la boucle."
      ],
      [
        "Pourquoi un sac réutilisable n’est-il pas forcément plus écologique qu’un sac plastique ?",
        [
          "Il ne peut jamais être recyclé",
          "Il est toujours fait en pétrole",
          "Il n’est avantageux qu’après un certain nombre de réemplois",
          "Il pollue pendant son utilisation"
        ],
        2,
        "Il coûte plus cher à fabriquer : seule l’analyse du cycle de vie dit à partir de combien d’usages il devient gagnant."
      ],
      [
        "Pourquoi les DEEE ne vont-ils jamais à la poubelle ordinaire ?",
        [
          "Ils sont trop lourds",
          "Ils sont trop volumineux",
          "Ils brûlent mal",
          "Ils contiennent des métaux précieux et des substances dangereuses"
        ],
        3,
        "Déposés en déchèterie ou en point de collecte, leurs métaux sont récupérés et leurs substances dangereuses traitées."
      ]
    ]
  },
  {
    "niveau": "5e",
    "titre": "Cycle de vie d’un OST",
    "questions": [
      [
        "Qu’est-ce que l’obsolescence logicielle ?",
        [
          "Une pièce qui n’existe plus",
          "L’arrêt des mises à jour",
          "Un simple effet de mode",
          "Une batterie usée"
        ],
        1,
        "L’objet fonctionne encore mais ne reçoit plus de mises à jour ; la pièce introuvable relève de l’obsolescence technique."
      ],
      [
        "Quel est le principe du modèle économique linéaire ?",
        [
          "Extraire, fabriquer, jeter",
          "Réduire, réemployer, recycler",
          "Réparer avant de remplacer",
          "Louer au lieu d’acheter"
        ],
        0,
        "Le modèle linéaire épuise les ressources ; l’économie circulaire cherche à refermer la boucle."
      ],
      [
        "Pourquoi un sac réutilisable n’est-il pas forcément plus écologique qu’un sac plastique ?",
        [
          "Il ne peut jamais être recyclé",
          "Il est toujours fait en pétrole",
          "Il n’est avantageux qu’après un certain nombre de réemplois",
          "Il pollue pendant son utilisation"
        ],
        2,
        "Il coûte plus cher à fabriquer : seule l’analyse du cycle de vie dit à partir de combien d’usages il devient gagnant."
      ],
      [
        "Pourquoi les DEEE ne vont-ils jamais à la poubelle ordinaire ?",
        [
          "Ils sont trop lourds",
          "Ils sont trop volumineux",
          "Ils brûlent mal",
          "Ils contiennent des métaux précieux et des substances dangereuses"
        ],
        3,
        "Déposés en déchèterie ou en point de collecte, leurs métaux sont récupérés et leurs substances dangereuses traitées."
      ]
    ]
  },
  {
    "niveau": "5e",
    "titre": "Les OST",
    "questions": [
      [
        "Pour une lampe de lecture, quelle est la matière d’œuvre ?",
        [
          "Le verre de l’ampoule",
          "L’électricité du réseau",
          "La lumière de la pièce",
          "La personne qui lit"
        ],
        2,
        "La matière d’œuvre est ce sur quoi l’objet agit : la lampe modifie la lumière de la pièce. Celui qui lit est l’utilisateur."
      ],
      [
        "Lequel de ces exemples est un système technique ?",
        [
          "Un tournevis",
          "Une chaise",
          "Un marteau",
          "Un ascenseur"
        ],
        3,
        "Un ascenseur associe plusieurs objets qui travaillent ensemble, avec électronique et programme ; les trois autres répondent au besoin par eux-mêmes."
      ],
      [
        "Quelle fonction d’usage le vélo garde-t-il depuis 150 ans ?",
        [
          "Se déplacer",
          "Freiner",
          "Transmettre le mouvement",
          "Éclairer"
        ],
        0,
        "Sa fonction d’usage n’a pas changé ; ses matériaux, sa transmission, ses freins et son assistance électrique, si."
      ],
      [
        "La bougie, la lampe à huile, l’ampoule et la LED forment…",
        [
          "une lignée d’objets techniques",
          "une famille d’objets techniques",
          "un système technique",
          "une chaîne d’énergie"
        ],
        1,
        "Ils remplissent la même fonction d’usage, éclairer, par des solutions différentes : c’est une famille."
      ]
    ]
  },
  {
    "niveau": "4e",
    "titre": "Programmation graphique et programmation textuelle",
    "questions": [
      [
        "Quelle programmation convient le mieux aux programmes longs ?",
        [
          "La programmation graphique",
          "La programmation textuelle",
          "Aucune des deux",
          "Les deux aussi bien"
        ],
        1,
        "Les blocs deviennent vite illisibles sur un long programme ; le texte n’a pas de limite de taille."
      ],
      [
        "Quel langage textuel sert souvent à programmer une carte Arduino ?",
        [
          "Scratch",
          "Blockly",
          "Le C ou le C++",
          "Snap!"
        ],
        2,
        "Scratch, Blockly et Snap! sont des environnements par blocs ; l’Arduino se programme le plus souvent en C ou C++."
      ],
      [
        "En programmation par blocs, que se passe-t-il si deux blocs sont incompatibles ?",
        [
          "Le programme plante à l’exécution",
          "Un message d’erreur de syntaxe s’affiche",
          "Ils se transforment en texte",
          "Ils ne s’emboîtent pas"
        ],
        3,
        "C’est pour cela qu’aucune faute de syntaxe n’est possible avec les blocs."
      ],
      [
        "Que demande le programme du cycle 4 à propos des deux façons de programmer ?",
        [
          "Savoir lire et modifier les deux",
          "Maîtriser seulement les blocs",
          "Maîtriser seulement Python",
          "Savoir écrire un compilateur"
        ],
        0,
        "Les blocs servent à la logique, le texte à piloter une carte programmable ou à traiter des données."
      ]
    ]
  },
  {
    "niveau": "4e",
    "titre": "OST et contraintes",
    "questions": [
      [
        "Que signifie une flexibilité F0 dans un cahier des charges ?",
        [
          "Une exigence négociable",
          "Une exigence impérative",
          "Une exigence peu négociable",
          "Une exigence facultative"
        ],
        1,
        "F0 est impératif, F1 peu négociable, F2 négociable."
      ],
      [
        "« Être recyclable à 90 % » relève de quelle famille de contraintes ?",
        [
          "Économiques",
          "Esthétiques",
          "Environnementales",
          "Ergonomiques"
        ],
        2,
        "Recyclabilité, consommation et matériaux interdits sont des contraintes environnementales."
      ],
      [
        "Laquelle de ces formulations est une vraie exigence ?",
        [
          "Le casque doit être léger",
          "Le casque doit être agréable",
          "Le casque doit plaire aux clients",
          "Masse inférieure à 300 g, tolérance ±20 g"
        ],
        3,
        "Elle donne un critère (la masse), un niveau (300 g) et une flexibilité (±20 g) : on peut la vérifier."
      ],
      [
        "Que coûte le plus souvent le fait de rendre un objet plus sûr ?",
        [
          "Il devient plus lourd",
          "Il devient moins cher",
          "Il devient plus rapide à fabriquer",
          "Rien, c’est sans contrepartie"
        ],
        0,
        "Les contraintes s’opposent : la sécurité ajoute souvent de la matière, donc du poids. Concevoir, c’est arbitrer."
      ]
    ]
  },
  {
    "niveau": "5e",
    "titre": "Procédés de fabrication",
    "questions": [
      [
        "Quel est l’atout principal de la fabrication par déformation ?",
        [
          "Aucun outillage n’est nécessaire",
          "Aucune perte de matière",
          "Elle est idéale pour une pièce unique",
          "Elle produit des pièces creuses complexes couche par couche"
        ],
        1,
        "La matière change de forme sans copeaux ; l’outillage est en revanche coûteux, ce qui la réserve aux séries."
      ],
      [
        "Quel procédé convient à cent mille pièces en plastique ?",
        [
          "L’impression 3D",
          "Le sciage",
          "L’injection plastique",
          "Le ponçage"
        ],
        2,
        "L’injection est rapide et répétable en grande série ; l’impression 3D est trop lente pour cela."
      ],
      [
        "À quelle famille appartient le rivetage ?",
        [
          "À l’assemblage démontable",
          "À l’enlèvement de matière",
          "À l’ajout de matière",
          "À l’assemblage non démontable"
        ],
        3,
        "Comme la soudure et le collage, le rivet est résistant mais définitif."
      ],
      [
        "Quelle est la limite de l’impression 3D ?",
        [
          "Elle est lente pour produire en série",
          "Elle produit beaucoup de copeaux",
          "Elle ne permet pas les formes complexes",
          "Elle exige un outillage coûteux"
        ],
        0,
        "Idéale pour un prototype ou une forme complexe, elle construit couche par couche : trop lente pour une grande série."
      ]
    ]
  },
  {
    "niveau": "5e",
    "titre": "La chaîne d’énergie",
    "questions": [
      [
        "Dans quelle fonction range-t-on une résistance chauffante ?",
        [
          "Alimenter",
          "Distribuer",
          "Convertir",
          "Transmettre"
        ],
        2,
        "Elle transforme l’énergie électrique en chaleur : c’est un actionneur, qui assure la fonction « convertir »."
      ],
      [
        "Comment appelle-t-on le résultat final de la chaîne d’énergie ?",
        [
          "L’acquisition",
          "L’action",
          "La consigne",
          "Le traitement"
        ],
        1,
        "L’action, c’est la roue qui tourne, la porte qui s’ouvre ou l’air qui se réchauffe."
      ],
      [
        "Dans un portail automatique, quelle fonction assure le réseau 230 V ?",
        [
          "Convertir",
          "Distribuer",
          "Transmettre",
          "Alimenter"
        ],
        3,
        "Le réseau fournit l’énergie ; le relais la distribue, le moteur la convertit, le réducteur et la crémaillère la transmettent."
      ],
      [
        "Quel rôle joue un réducteur dans la chaîne d’énergie ?",
        [
          "Il transmet le mouvement en adaptant vitesse et effort",
          "Il fournit l’énergie",
          "Il laisse passer ou coupe l’énergie sur ordre",
          "Il convertit l’énergie électrique en énergie mécanique"
        ],
        0,
        "Le réducteur appartient à la fonction « transmettre » : il ralentit le mouvement pour gagner de l’effort."
      ]
    ]
  },
  {
    "niveau": "4e",
    "titre": "Règles de sécurité",
    "questions": [
      [
        "Que signifie un pictogramme carré vert ?",
        [
          "Une interdiction",
          "Un danger",
          "Une information de secours",
          "Une obligation"
        ],
        2,
        "Le carré vert signale une issue de secours ou une trousse de premiers soins."
      ],
      [
        "De quelles couleurs est le bouton d’arrêt d’urgence ?",
        [
          "Vert sur fond blanc",
          "Rouge sur fond jaune",
          "Bleu sur fond rouge",
          "Noir sur fond jaune"
        ],
        1,
        "Rouge sur fond jaune, il coupe immédiatement l’alimentation de la machine."
      ],
      [
        "Quelle tenue est exigée en atelier ?",
        [
          "Des gants en permanence",
          "Une écharpe pour se protéger",
          "Des sandales pour être à l’aise",
          "Cheveux attachés, aucun bijou ni écharpe"
        ],
        3,
        "Cheveux, bijoux et écharpes peuvent être happés par une pièce en rotation ; il faut aussi une blouse et des chaussures fermées."
      ],
      [
        "Que faut-il faire si l’on remarque un câble abîmé sur une machine ?",
        [
          "Le signaler",
          "Continuer en faisant attention",
          "Le réparer soi-même avec du ruban adhésif",
          "L’ignorer si la machine fonctionne"
        ],
        0,
        "Toute anomalie — câble abîmé, bruit inhabituel — se signale avant de continuer."
      ]
    ]
  },
  {
    "niveau": "5e",
    "titre": "La chaîne d’information",
    "questions": [
      [
        "Quel composant acquiert une information sur la lumière ambiante ?",
        [
          "Le buzzer",
          "La photorésistance",
          "Le microcontrôleur",
          "Le moteur"
        ],
        1,
        "La photorésistance est un capteur de lumière : elle assure la fonction « acquérir »."
      ],
      [
        "Quelle fonction de la chaîne d’information assure un buzzer ?",
        [
          "Acquérir",
          "Traiter",
          "Communiquer",
          "Alimenter"
        ],
        2,
        "Il transmet une information à l’utilisateur par un son, comme l’écran ou la LED."
      ],
      [
        "Qu’exécute la partie commande pour décider quoi faire ?",
        [
          "Une conversion d’énergie",
          "Une mesure",
          "Un signal lumineux",
          "Un programme"
        ],
        3,
        "Le microcontrôleur, la carte programmable ou l’automate exécutent un programme : c’est la fonction « traiter »."
      ],
      [
        "Lequel de ces moyens permet de communiquer sans fil ?",
        [
          "Le Bluetooth",
          "Le fin de course",
          "La thermistance",
          "Le vérin"
        ],
        0,
        "Le Bluetooth, le Wi-Fi ou la radio transmettent l’information à un autre système ; le fin de course et la thermistance sont des capteurs."
      ]
    ]
  },
  {
    "niveau": "5e",
    "titre": "OST et interacteurs extérieurs",
    "questions": [
      [
        "Pour un lampadaire de rue, « résister aux intempéries » est…",
        [
          "la fonction principale",
          "une fonction contrainte",
          "une solution technique",
          "un principe technique"
        ],
        1,
        "Elle relie l’objet à un seul interacteur, le milieu : c’est une fonction contrainte."
      ],
      [
        "Lequel de ces interacteurs fait partie du milieu ?",
        [
          "L’utilisateur",
          "Le budget",
          "La poussière",
          "Les normes"
        ],
        2,
        "Le milieu, c’est l’air, l’eau, la température, la poussière ou les vibrations qui entourent l’objet."
      ],
      [
        "Quels interacteurs la fonction principale du lampadaire relie-t-elle ?",
        [
          "Le réseau électrique et le budget",
          "Les intempéries et les normes",
          "Le paysage urbain et la commune",
          "Le piéton et la chaussée"
        ],
        3,
        "La fonction principale relie deux interacteurs à travers l’objet : permettre au piéton de voir la chaussée la nuit."
      ],
      [
        "Parmi ces interacteurs, lequel impose une limite de conception plutôt qu’un élément physique ?",
        [
          "L’énergie",
          "Le budget",
          "La matière d’œuvre",
          "Le milieu"
        ],
        1,
        "Le budget, comme l’esthétique, ne touche pas l’objet physiquement : il borne les choix du concepteur."
      ]
    ]
  },
  {
    "niveau": "5e",
    "titre": "Écrire mettre au point et exécuter un programme simple",
    "questions": [
      [
        "Un programme s’arrête en cours de route à cause d’une division par zéro. De quelle erreur s’agit-il ?",
        [
          "Une erreur de syntaxe",
          "Une erreur de logique",
          "Une erreur d’exécution",
          "Une erreur d’ergonomie"
        ],
        2,
        "Le programme a démarré, puis s’arrête : c’est une erreur d’exécution, comme un capteur absent."
      ],
      [
        "Quel nom de variable est le plus explicite ?",
        [
          "v2",
          "x",
          "a1",
          "vitesse"
        ],
        3,
        "Un nom explicite rend le programme lisible par un autre, ou par soi-même trois mois plus tard."
      ],
      [
        "Quelle technique aide à voir où le comportement d’un programme dévie ?",
        [
          "Supprimer les commentaires",
          "Afficher les valeurs intermédiaires",
          "Raccourcir les noms de variables",
          "Relancer sans rien changer"
        ],
        1,
        "Afficher les valeurs en cours de route, ou exécuter pas à pas, montre l’endroit exact où le programme s’écarte de l’attendu."
      ],
      [
        "Que contient un bon jeu d’essai ?",
        [
          "Un cas normal, un cas limite et un cas interdit",
          "Uniquement des cas qui fonctionnent",
          "Un seul cas bien choisi",
          "Les cas proposés par l’utilisateur, sans plus"
        ],
        0,
        "Le cas normal vérifie le fonctionnement, le cas limite et le cas interdit révèlent les défauts."
      ]
    ]
  },
  {
    "niveau": "4e",
    "titre": "Procédés de fabrication",
    "questions": [
      [
        "Quel est l’atout principal de la fabrication par déformation ?",
        [
          "Aucun outillage n’est nécessaire",
          "Aucune perte de matière",
          "Elle est idéale pour une pièce unique",
          "Elle produit des pièces creuses complexes couche par couche"
        ],
        1,
        "La matière change de forme sans copeaux ; l’outillage est en revanche coûteux, ce qui la réserve aux séries."
      ],
      [
        "Quel procédé convient à cent mille pièces en plastique ?",
        [
          "L’impression 3D",
          "Le sciage",
          "L’injection plastique",
          "Le ponçage"
        ],
        2,
        "L’injection est rapide et répétable en grande série ; l’impression 3D est trop lente pour cela."
      ],
      [
        "À quelle famille appartient le rivetage ?",
        [
          "À l’assemblage démontable",
          "À l’enlèvement de matière",
          "À l’ajout de matière",
          "À l’assemblage non démontable"
        ],
        3,
        "Comme la soudure et le collage, le rivet est résistant mais définitif."
      ],
      [
        "Quelle est la limite de l’impression 3D ?",
        [
          "Elle est lente pour produire en série",
          "Elle produit beaucoup de copeaux",
          "Elle ne permet pas les formes complexes",
          "Elle exige un outillage coûteux"
        ],
        0,
        "Idéale pour un prototype ou une forme complexe, elle construit couche par couche : trop lente pour une grande série."
      ]
    ]
  },
  {
    "niveau": "4e",
    "titre": "Les mécanismes de transmission et de transformation de mouvements",
    "questions": [
      [
        "Quel mécanisme transforme une rotation en translation lente et puissante, comme dans un étau ?",
        [
          "Le pignon-crémaillère",
          "La vis-écrou",
          "La bielle-manivelle",
          "Les roues de friction"
        ],
        1,
        "La vis-écrou avance peu à chaque tour, mais avec beaucoup de force : étau, presse."
      ],
      [
        "Dans quel sens tournent les deux pignons reliés par la chaîne d’un vélo ?",
        [
          "En sens inverse",
          "Alternativement dans un sens puis dans l’autre",
          "Dans le même sens",
          "Cela dépend du nombre de dents"
        ],
        2,
        "Avec une chaîne, les pignons tournent dans le même sens ; deux engrenages en contact direct tournent en sens inverse."
      ],
      [
        "Un pignon d’entrée de 20 dents entraîne une roue de sortie de 60 dents. Que vaut le rapport de transmission ?",
        [
          "3",
          "40",
          "1/40",
          "1/3"
        ],
        3,
        "r = dents de l’entrée ÷ dents de la sortie = 20 ÷ 60 = 1/3 : r < 1, c’est un réducteur."
      ],
      [
        "Quel mécanisme actionne les soupapes d’un moteur ?",
        [
          "Came et poussoir",
          "Poulies-courroie",
          "Pignons-chaîne",
          "Engrenages"
        ],
        0,
        "La came transforme la rotation en translation alternative du poussoir, qui ouvre et ferme la soupape."
      ]
    ]
  },
  {
    "niveau": "4e",
    "titre": "La chaîne d’énergie",
    "questions": [
      [
        "Dans quelle fonction range-t-on une résistance chauffante ?",
        [
          "Alimenter",
          "Distribuer",
          "Convertir",
          "Transmettre"
        ],
        2,
        "Elle transforme l’énergie électrique en chaleur : c’est un actionneur, qui assure la fonction « convertir »."
      ],
      [
        "Comment appelle-t-on le résultat final de la chaîne d’énergie ?",
        [
          "L’acquisition",
          "L’action",
          "La consigne",
          "Le traitement"
        ],
        1,
        "L’action, c’est la roue qui tourne, la porte qui s’ouvre ou l’air qui se réchauffe."
      ],
      [
        "Dans un portail automatique, quelle fonction assure le réseau 230 V ?",
        [
          "Convertir",
          "Distribuer",
          "Transmettre",
          "Alimenter"
        ],
        3,
        "Le réseau fournit l’énergie ; le relais la distribue, le moteur la convertit, le réducteur et la crémaillère la transmettent."
      ],
      [
        "Quel rôle joue un réducteur dans la chaîne d’énergie ?",
        [
          "Il transmet le mouvement en adaptant vitesse et effort",
          "Il fournit l’énergie",
          "Il laisse passer ou coupe l’énergie sur ordre",
          "Il convertit l’énergie électrique en énergie mécanique"
        ],
        0,
        "Le réducteur appartient à la fonction « transmettre » : il ralentit le mouvement pour gagner de l’effort."
      ]
    ]
  },
  {
    "niveau": "4e",
    "titre": "Système d’information et stockage de données",
    "questions": [
      [
        "Combien de bits compte un octet ?",
        [
          "8",
          "2",
          "10",
          "16"
        ],
        0,
        "Un octet vaut 8 bits et code à peu près un caractère."
      ],
      [
        "Qu’apporte l’authentification à deux facteurs ?",
        [
          "Elle chiffre le disque",
          "Elle double l’espace de stockage",
          "Le mot de passe seul ne suffit plus pour entrer dans le compte",
          "Elle supprime le mot de passe"
        ],
        2,
        "Un second élément, comme un code reçu sur le téléphone, est exigé : un mot de passe volé ne suffit plus."
      ],
      [
        "Quelle est la limite d’un stockage dans le nuage ?",
        [
          "Il n’est accessible que d’un seul endroit",
          "Il ne peut pas être sauvegardé",
          "Il est interdit par le RGPD",
          "Il dépend du réseau et du prestataire"
        ],
        3,
        "Accessible de partout, il exige une connexion et dépend d’un prestataire, dont les centres de données sont bien réels."
      ],
      [
        "Quel principe du RGPD impose de dire à quoi serviront les données collectées ?",
        [
          "Le consentement",
          "La finalité",
          "La durée de conservation",
          "Le droit de rectification"
        ],
        1,
        "La finalité de la collecte doit être déclarée ; le consentement, lui, doit être explicite."
      ]
    ]
  },
  {
    "niveau": "5e",
    "titre": "Matériaux et procédés",
    "questions": [
      [
        "Quel est le principal défaut des céramiques ?",
        [
          "Elles conduisent l’électricité",
          "Elles rouillent",
          "Elles sont fragiles : elles cassent sans se déformer",
          "Elles sont trop légères"
        ],
        2,
        "Très dures et résistantes à la chaleur, elles cassent pourtant d’un coup, sans se déformer avant."
      ],
      [
        "Que désigne la ductilité d’un matériau ?",
        [
          "Sa résistance à la rayure",
          "Sa capacité à être étiré en fil",
          "Sa capacité à conduire la chaleur",
          "Sa capacité à reprendre sa forme"
        ],
        1,
        "Un matériau ductile, comme le cuivre, s’étire en fil sans rompre."
      ],
      [
        "À quelle famille de matériaux appartient le bois ?",
        [
          "Aux métalliques",
          "Aux céramiques",
          "Aux composites",
          "Aux organiques"
        ],
        3,
        "Le bois, comme les plastiques, le cuir et le papier, est un matériau organique."
      ],
      [
        "Pourquoi un composite plastique est-il difficile à recycler ?",
        [
          "Ses matériaux sont quasi impossibles à séparer",
          "Il est trop dur pour être broyé",
          "Il contient toujours du métal",
          "Il est interdit en déchèterie"
        ],
        0,
        "Un composite cumule les qualités de deux matériaux, mais on ne sait presque pas les séparer en fin de vie."
      ]
    ]
  },
  {
    "niveau": "5e",
    "titre": "La fonction technique et le principe technique",
    "questions": [
      [
        "Sur quel principe technique reposent tous les freins de vélo ?",
        [
          "La gravité",
          "Le magnétisme",
          "Le frottement",
          "La dilatation"
        ],
        2,
        "Patins, disque ou rétropédalage : ces solutions différentes exploitent toutes le frottement."
      ],
      [
        "Comment exprime-t-on une fonction d’usage ?",
        [
          "Par un verbe à l’infinitif",
          "Par un nombre",
          "Par le nom d’un composant",
          "Par une unité de mesure"
        ],
        0,
        "On écrit le service rendu par un verbe à l’infinitif : « se déplacer », « éclairer »."
      ],
      [
        "Pour un vélo, lequel de ces éléments est une solution technique ?",
        [
          "Freiner",
          "Le frottement",
          "Se déplacer",
          "Un frein à disque"
        ],
        3,
        "Le frein à disque est le composant concret retenu ; freiner est une fonction technique, le frottement un principe, se déplacer la fonction d’usage."
      ],
      [
        "Dans l’exigence « distance de freinage : moins de 5 m à 20 km/h », que désigne « moins de 5 m » ?",
        [
          "Le critère",
          "Le niveau",
          "La fonction d’usage",
          "Le principe technique"
        ],
        1,
        "Le critère est ce qu’on mesure (la distance de freinage) ; le niveau est la valeur à atteindre."
      ]
    ]
  },
  {
    "niveau": "4e",
    "titre": "Tester et valider la tenue mécanique, le comportement et les performances d’un objet technique",
    "questions": [
      [
        "Quel essai consiste à charger une pièce en son milieu, appuyée à ses extrémités ?",
        [
          "L’essai de traction",
          "L’essai de compression",
          "L’essai de flexion",
          "L’essai de torsion"
        ],
        2,
        "La flexion fait plier la pièce ; la traction l’étire, la compression l’écrase, la torsion la vrille."
      ],
      [
        "Pourquoi note-t-on l’incertitude d’une mesure ?",
        [
          "Pour rendre le résultat plus précis",
          "Parce qu’une mesure sans incertitude n’en est pas une",
          "Parce qu’elle remplace les conditions d’essai",
          "Pour éviter de refaire l’essai"
        ],
        1,
        "Toute mesure a une marge d’erreur : sans elle, on ne peut pas juger si l’exigence est vraiment atteinte."
      ],
      [
        "Lequel de ces essais est un essai de performance ?",
        [
          "L’essai de traction",
          "L’essai de torsion",
          "L’essai de fatigue",
          "La mesure de l’autonomie"
        ],
        3,
        "L’autonomie, la vitesse ou le niveau sonore sont des performances ; les trois autres sont des essais de tenue mécanique."
      ],
      [
        "Quel verdict écrit-on pour chaque exigence, à la fin d’une validation ?",
        [
          "Conforme ou non conforme",
          "Bon ou mauvais",
          "Rapide ou lent",
          "Cher ou bon marché"
        ],
        0,
        "On compare la valeur mesurée au niveau exigé et on conclut : conforme ou non conforme."
      ]
    ]
  },
  {
    "niveau": "4e",
    "titre": "Structuration et traitement des données",
    "questions": [
      [
        "Dans un tableau de données, que représente une colonne ?",
        [
          "Un enregistrement",
          "Un champ",
          "Une clé",
          "Un filtre"
        ],
        1,
        "Une colonne est un champ (nom, date, valeur) ; une ligne est un enregistrement."
      ],
      [
        "Quel type de données permet de tester « vrai » ou « faux » ?",
        [
          "Le texte",
          "La date",
          "Le nombre décimal",
          "Le booléen"
        ],
        3,
        "Un booléen ne prend que deux valeurs, vrai ou faux : il sert aux tests."
      ],
      [
        "Quel graphique montre une répartition, les parts d’un tout ?",
        [
          "La courbe",
          "L’histogramme",
          "Le camembert",
          "Le nuage de points"
        ],
        2,
        "Le camembert raconte une répartition ; la courbe une évolution, l’histogramme une comparaison."
      ],
      [
        "Quel format d’échange organise les données en couples nom-valeur ?",
        [
          "JSON",
          "CSV",
          "JPEG",
          "MP3"
        ],
        0,
        "Le JSON est très utilisé par les objets connectés et les sites web ; le CSV est un tableau en texte."
      ]
    ]
  },
  {
    "niveau": "4e",
    "titre": "Matériaux et procédés",
    "questions": [
      [
        "Quel est le principal défaut des céramiques ?",
        [
          "Elles conduisent l’électricité",
          "Elles rouillent",
          "Elles sont fragiles : elles cassent sans se déformer",
          "Elles sont trop légères"
        ],
        2,
        "Très dures et résistantes à la chaleur, elles cassent pourtant d’un coup, sans se déformer avant."
      ],
      [
        "Que désigne la ductilité d’un matériau ?",
        [
          "Sa résistance à la rayure",
          "Sa capacité à être étiré en fil",
          "Sa capacité à conduire la chaleur",
          "Sa capacité à reprendre sa forme"
        ],
        1,
        "Un matériau ductile, comme le cuivre, s’étire en fil sans rompre."
      ],
      [
        "À quelle famille de matériaux appartient le bois ?",
        [
          "Aux métalliques",
          "Aux céramiques",
          "Aux composites",
          "Aux organiques"
        ],
        3,
        "Le bois, comme les plastiques, le cuir et le papier, est un matériau organique."
      ],
      [
        "Pourquoi un composite plastique est-il difficile à recycler ?",
        [
          "Ses matériaux sont quasi impossibles à séparer",
          "Il est trop dur pour être broyé",
          "Il contient toujours du métal",
          "Il est interdit en déchèterie"
        ],
        0,
        "Un composite cumule les qualités de deux matériaux, mais on ne sait presque pas les séparer en fin de vie."
      ]
    ]
  },
  {
    "niveau": "4e",
    "titre": "OST et interacteurs extérieurs",
    "questions": [
      [
        "Pour un lampadaire de rue, « résister aux intempéries » est…",
        [
          "la fonction principale",
          "une fonction contrainte",
          "une solution technique",
          "un principe technique"
        ],
        1,
        "Elle relie l’objet à un seul interacteur, le milieu : c’est une fonction contrainte."
      ],
      [
        "Lequel de ces interacteurs fait partie du milieu ?",
        [
          "L’utilisateur",
          "Le budget",
          "La poussière",
          "Les normes"
        ],
        2,
        "Le milieu, c’est l’air, l’eau, la température, la poussière ou les vibrations qui entourent l’objet."
      ],
      [
        "Quels interacteurs la fonction principale du lampadaire relie-t-elle ?",
        [
          "Le réseau électrique et le budget",
          "Les intempéries et les normes",
          "Le paysage urbain et la commune",
          "Le piéton et la chaussée"
        ],
        3,
        "La fonction principale relie deux interacteurs à travers l’objet : permettre au piéton de voir la chaussée la nuit."
      ],
      [
        "Parmi ces interacteurs, lequel impose une limite de conception plutôt qu’un élément physique ?",
        [
          "L’énergie",
          "Le budget",
          "La matière d’œuvre",
          "Le milieu"
        ],
        1,
        "Le budget, comme l’esthétique, ne touche pas l’objet physiquement : il borne les choix du concepteur."
      ]
    ]
  },
  {
    "niveau": "4e",
    "titre": "Organisation d’un projet technique",
    "questions": [
      [
        "Que porte l’axe horizontal d’un diagramme de Gantt ?",
        [
          "Les tâches",
          "Le temps",
          "Les coûts",
          "Les responsables"
        ],
        1,
        "Le temps est en abscisse, les tâches en ordonnée ; la longueur de chaque barre est la durée de la tâche."
      ],
      [
        "De quoi dispose une tâche qui n’est pas sur le chemin critique ?",
        [
          "D’un budget supplémentaire",
          "D’une priorité absolue",
          "D’une marge",
          "D’aucun responsable"
        ],
        2,
        "Elle peut prendre un peu de retard sans décaler la fin du projet, ce qui est impossible sur le chemin critique."
      ],
      [
        "Quelle phase vient juste après l’analyse du besoin ?",
        [
          "La réalisation",
          "Le bilan",
          "La conception",
          "La recherche de solutions"
        ],
        3,
        "Après le cahier des charges, on cherche et compare plusieurs pistes, avant de concevoir."
      ],
      [
        "Quel document garde les décisions et les essais ratés d’un projet ?",
        [
          "Le carnet de bord",
          "Le diagramme de Gantt",
          "La nomenclature",
          "Le cahier des charges"
        ],
        0,
        "Le carnet de bord assure la traçabilité : il évite qu’un autre refasse la même erreur."
      ]
    ]
  },
  {
    "niveau": "5e",
    "titre": "Prototypage de solutions",
    "questions": [
      [
        "Quel degré de prototype valide le procédé de fabrication autant que l’objet ?",
        [
          "La maquette",
          "Le prototype fonctionnel",
          "La présérie",
          "Le croquis"
        ],
        2,
        "La présérie utilise déjà les matériaux et les procédés du produit final."
      ],
      [
        "Quel moyen permet de prototyper l’électronique sans soudure ?",
        [
          "La découpe vinyle",
          "Le carton plume",
          "L’impression 3D",
          "Les cartes programmables et les modules enfichables"
        ],
        3,
        "Les modules s’enfichent sur la carte : on peut tester et modifier le montage en quelques minutes."
      ],
      [
        "Combien coûte une erreur découverte sur dix mille exemplaires vendus, par rapport à la même erreur trouvée sur un prototype ?",
        [
          "Deux fois plus",
          "Cent fois plus",
          "Dix fois moins",
          "Autant"
        ],
        1,
        "Plus une erreur est découverte tard, plus elle coûte : c’est pour cela qu’on prototype avant de produire."
      ],
      [
        "Que faut-il noter en documentant un prototype ?",
        [
          "Photos, mesures, difficultés, modifications et leurs raisons",
          "Seulement le résultat final",
          "Seulement le coût",
          "Seulement les photos"
        ],
        0,
        "Cette mémoire du projet nourrit le dossier final et explique chaque choix."
      ]
    ]
  },
  {
    "niveau": "4e",
    "titre": "Modes de représentation d’un OST",
    "questions": [
      [
        "Que signifie une échelle 2:1 ?",
        [
          "Le dessin est deux fois plus petit que l’objet",
          "Le dessin est deux fois plus grand que l’objet",
          "Le dessin est à taille réelle",
          "L’objet mesure 2 cm"
        ],
        1,
        "Le premier nombre concerne le dessin : 2:1 agrandit deux fois, 1:2 réduit deux fois, 1:1 est la grandeur nature."
      ],
      [
        "Quel trait représente un axe sur un dessin technique ?",
        [
          "Le trait continu fort",
          "Le trait interrompu",
          "Le trait mixte fin",
          "Le trait ondulé"
        ],
        2,
        "Le trait continu fort montre une arête vue, l’interrompu une arête cachée, le mixte fin un axe."
      ],
      [
        "Quel schéma représente les composants normalisés d’un circuit ?",
        [
          "Le schéma de principe",
          "Le schéma cinématique",
          "Le croquis",
          "Le schéma électrique"
        ],
        3,
        "Le schéma électrique utilise les symboles normalisés des composants ; le cinématique montre les liaisons et les mouvements."
      ],
      [
        "À quoi sert une vue éclatée d’un modèle 3D ?",
        [
          "À comprendre l’assemblage des pièces",
          "À calculer le prix de revient",
          "À programmer la carte",
          "À coter les dimensions réelles"
        ],
        0,
        "Les pièces écartées les unes des autres montrent comment elles s’assemblent."
      ]
    ]
  },
  {
    "niveau": "5e",
    "titre": "Les mécanismes de transmission et de transformation de mouvements",
    "questions": [
      [
        "Quel mécanisme transforme une rotation en translation lente et puissante, comme dans un étau ?",
        [
          "Le pignon-crémaillère",
          "La vis-écrou",
          "La bielle-manivelle",
          "Les roues de friction"
        ],
        1,
        "La vis-écrou avance peu à chaque tour, mais avec beaucoup de force : étau, presse."
      ],
      [
        "Dans quel sens tournent les deux pignons reliés par la chaîne d’un vélo ?",
        [
          "En sens inverse",
          "Alternativement dans un sens puis dans l’autre",
          "Dans le même sens",
          "Cela dépend du nombre de dents"
        ],
        2,
        "Avec une chaîne, les pignons tournent dans le même sens ; deux engrenages en contact direct tournent en sens inverse."
      ],
      [
        "Un pignon d’entrée de 20 dents entraîne une roue de sortie de 60 dents. Que vaut le rapport de transmission ?",
        [
          "3",
          "40",
          "1/40",
          "1/3"
        ],
        3,
        "r = dents de l’entrée ÷ dents de la sortie = 20 ÷ 60 = 1/3 : r < 1, c’est un réducteur."
      ],
      [
        "Quel mécanisme actionne les soupapes d’un moteur ?",
        [
          "Came et poussoir",
          "Poulies-courroie",
          "Pignons-chaîne",
          "Engrenages"
        ],
        0,
        "La came transforme la rotation en translation alternative du poussoir, qui ouvre et ferme la soupape."
      ]
    ]
  },
  {
    "niveau": "4e",
    "titre": "Écrire mettre au point et exécuter un programme simple",
    "questions": [
      [
        "Un programme s’arrête en cours de route à cause d’une division par zéro. De quelle erreur s’agit-il ?",
        [
          "Une erreur de syntaxe",
          "Une erreur de logique",
          "Une erreur d’exécution",
          "Une erreur d’ergonomie"
        ],
        2,
        "Le programme a démarré, puis s’arrête : c’est une erreur d’exécution, comme un capteur absent."
      ],
      [
        "Quel nom de variable est le plus explicite ?",
        [
          "v2",
          "x",
          "a1",
          "vitesse"
        ],
        3,
        "Un nom explicite rend le programme lisible par un autre, ou par soi-même trois mois plus tard."
      ],
      [
        "Quelle technique aide à voir où le comportement d’un programme dévie ?",
        [
          "Supprimer les commentaires",
          "Afficher les valeurs intermédiaires",
          "Raccourcir les noms de variables",
          "Relancer sans rien changer"
        ],
        1,
        "Afficher les valeurs en cours de route, ou exécuter pas à pas, montre l’endroit exact où le programme s’écarte de l’attendu."
      ],
      [
        "Que contient un bon jeu d’essai ?",
        [
          "Un cas normal, un cas limite et un cas interdit",
          "Uniquement des cas qui fonctionnent",
          "Un seul cas bien choisi",
          "Les cas proposés par l’utilisateur, sans plus"
        ],
        0,
        "Le cas normal vérifie le fonctionnement, le cas limite et le cas interdit révèlent les défauts."
      ]
    ]
  },
  {
    "niveau": "4e",
    "titre": "Prototypage de solutions",
    "questions": [
      [
        "Quel degré de prototype valide le procédé de fabrication autant que l’objet ?",
        [
          "La maquette",
          "Le prototype fonctionnel",
          "La présérie",
          "Le croquis"
        ],
        2,
        "La présérie utilise déjà les matériaux et les procédés du produit final."
      ],
      [
        "Quel moyen permet de prototyper l’électronique sans soudure ?",
        [
          "La découpe vinyle",
          "Le carton plume",
          "L’impression 3D",
          "Les cartes programmables et les modules enfichables"
        ],
        3,
        "Les modules s’enfichent sur la carte : on peut tester et modifier le montage en quelques minutes."
      ],
      [
        "Combien coûte une erreur découverte sur dix mille exemplaires vendus, par rapport à la même erreur trouvée sur un prototype ?",
        [
          "Deux fois plus",
          "Cent fois plus",
          "Dix fois moins",
          "Autant"
        ],
        1,
        "Plus une erreur est découverte tard, plus elle coûte : c’est pour cela qu’on prototype avant de produire."
      ],
      [
        "Que faut-il noter en documentant un prototype ?",
        [
          "Photos, mesures, difficultés, modifications et leurs raisons",
          "Seulement le résultat final",
          "Seulement le coût",
          "Seulement les photos"
        ],
        0,
        "Cette mémoire du projet nourrit le dossier final et explique chaque choix."
      ]
    ]
  },
  {
    "niveau": "4e",
    "titre": "Bases de la programmation",
    "questions": [
      [
        "Quelle différence y a-t-il entre un algorithme et un programme ?",
        [
          "L’algorithme est toujours plus long",
          "Le programme ne contient jamais de boucle",
          "Le programme est la traduction de l’algorithme dans un langage compris par la machine",
          "Il n’y en a aucune"
        ],
        2,
        "L’algorithme est la suite d’instructions ; le programme l’écrit dans un langage que la machine exécute."
      ],
      [
        "Quelle boucle convient pour « répéter tant que le bouton n’est pas appuyé » ?",
        [
          "Une boucle bornée",
          "Une boucle non bornée",
          "Une séquence",
          "Une variable"
        ],
        1,
        "On ne connaît pas d’avance le nombre de tours : la boucle est non bornée."
      ],
      [
        "Dans un organigramme, quelle forme représente un test ?",
        [
          "Le rectangle",
          "La flèche",
          "Le cercle",
          "Le losange"
        ],
        3,
        "Losanges pour les tests, rectangles pour les actions, flèches pour l’enchaînement."
      ],
      [
        "Pour un programme, un capteur est…",
        [
          "une entrée, que le programme lit",
          "une sortie, que le programme commande",
          "une variable",
          "un opérateur logique"
        ],
        0,
        "Le programme lit les capteurs (entrées) et commande les actionneurs (sorties) : c’est le lien avec la chaîne d’information."
      ]
    ]
  },
  {
    "niveau": "5e",
    "titre": "Règles de sécurité",
    "questions": [
      [
        "Que signifie un pictogramme carré vert ?",
        [
          "Une interdiction",
          "Un danger",
          "Une information de secours",
          "Une obligation"
        ],
        2,
        "Le carré vert signale une issue de secours ou une trousse de premiers soins."
      ],
      [
        "De quelles couleurs est le bouton d’arrêt d’urgence ?",
        [
          "Vert sur fond blanc",
          "Rouge sur fond jaune",
          "Bleu sur fond rouge",
          "Noir sur fond jaune"
        ],
        1,
        "Rouge sur fond jaune, il coupe immédiatement l’alimentation de la machine."
      ],
      [
        "Quelle tenue est exigée en atelier ?",
        [
          "Des gants en permanence",
          "Une écharpe pour se protéger",
          "Des sandales pour être à l’aise",
          "Cheveux attachés, aucun bijou ni écharpe"
        ],
        3,
        "Cheveux, bijoux et écharpes peuvent être happés par une pièce en rotation ; il faut aussi une blouse et des chaussures fermées."
      ],
      [
        "Que faut-il faire si l’on remarque un câble abîmé sur une machine ?",
        [
          "Le signaler",
          "Continuer en faisant attention",
          "Le réparer soi-même avec du ruban adhésif",
          "L’ignorer si la machine fonctionne"
        ],
        0,
        "Toute anomalie — câble abîmé, bruit inhabituel — se signale avant de continuer."
      ]
    ]
  },
  {
    "niveau": "4e",
    "titre": "Critères de choix d’un OST",
    "questions": [
      [
        "Quelle est la dernière étape d’un tableau multicritère ?",
        [
          "Noter chaque case",
          "Additionner les totaux pondérés",
          "Choisir les solutions à comparer",
          "Dessiner chaque solution"
        ],
        1,
        "On note les cases, on affecte les coefficients, puis on additionne les totaux pondérés pour départager les solutions."
      ],
      [
        "Par rapport à une ampoule à filament, une LED…",
        [
          "coûte moins cher à l’achat et dure moins longtemps",
          "consomme sept fois plus",
          "coûte plus cher à l’achat mais consomme peu et dure bien plus longtemps",
          "a la même durée de vie"
        ],
        2,
        "Son prix d’achat est plus élevé, mais sa faible consommation et sa durée de vie la rendent moins chère au coût global."
      ],
      [
        "Quelle question pose le critère d’encombrement ?",
        [
          "Combien de temps sans panne ?",
          "Est-il conforme aux normes ?",
          "Est-il facile à utiliser ?",
          "Tient-il dans l’espace disponible ?"
        ],
        3,
        "L’encombrement et la masse vérifient que l’objet trouve sa place ; la fiabilité, l’ergonomie et la sécurité posent les autres questions."
      ],
      [
        "Sur quels critères une solution doit-elle d’abord atteindre le niveau exigé ?",
        [
          "Les critères impératifs (F0)",
          "Les critères esthétiques",
          "Les critères négociables (F2)",
          "Le seul critère du prix"
        ],
        0,
        "Une solution qui manque un critère F0 est écartée, quel que soit son score ailleurs."
      ]
    ]
  },
  {
    "niveau": "5e",
    "titre": "Tester et valider la tenue mécanique, le comportement et les performances d’un objet technique",
    "questions": [
      [
        "Quel essai consiste à charger une pièce en son milieu, appuyée à ses extrémités ?",
        [
          "L’essai de traction",
          "L’essai de compression",
          "L’essai de flexion",
          "L’essai de torsion"
        ],
        2,
        "La flexion fait plier la pièce ; la traction l’étire, la compression l’écrase, la torsion la vrille."
      ],
      [
        "Pourquoi note-t-on l’incertitude d’une mesure ?",
        [
          "Pour rendre le résultat plus précis",
          "Parce qu’une mesure sans incertitude n’en est pas une",
          "Parce qu’elle remplace les conditions d’essai",
          "Pour éviter de refaire l’essai"
        ],
        1,
        "Toute mesure a une marge d’erreur : sans elle, on ne peut pas juger si l’exigence est vraiment atteinte."
      ],
      [
        "Lequel de ces essais est un essai de performance ?",
        [
          "L’essai de traction",
          "L’essai de torsion",
          "L’essai de fatigue",
          "La mesure de l’autonomie"
        ],
        3,
        "L’autonomie, la vitesse ou le niveau sonore sont des performances ; les trois autres sont des essais de tenue mécanique."
      ],
      [
        "Quel verdict écrit-on pour chaque exigence, à la fin d’une validation ?",
        [
          "Conforme ou non conforme",
          "Bon ou mauvais",
          "Rapide ou lent",
          "Cher ou bon marché"
        ],
        0,
        "On compare la valeur mesurée au niveau exigé et on conclut : conforme ou non conforme."
      ]
    ]
  },
  {
    "niveau": "5e",
    "titre": "Concevoir et fabriquer un OST",
    "questions": [
      [
        "Quel outil sert à choisir entre plusieurs solutions ?",
        [
          "Un diagramme de Gantt",
          "Un tableau multicritère pondéré",
          "Une nomenclature",
          "Une gamme de fabrication"
        ],
        1,
        "Le tableau multicritère compare les solutions sur les critères du cahier des charges, avec une justification."
      ],
      [
        "Un matériau devient indisponible : vers quelle étape la démarche renvoie-t-elle ?",
        [
          "La fabrication",
          "Les tests",
          "Le choix des solutions",
          "La documentation finale"
        ],
        2,
        "La démarche est itérative : un test raté renvoie à la conception, un matériau indisponible au choix des solutions."
      ],
      [
        "Quel document de la documentation finale rend compte de l’impact du cycle de vie ?",
        [
          "La notice d’utilisation",
          "La nomenclature",
          "Le programme commenté",
          "Le bilan environnemental"
        ],
        3,
        "Le bilan environnemental complète les plans, la nomenclature, le programme et la notice."
      ],
      [
        "À quelle étape choisit-on les procédés, les machines, les outils et les règles de sécurité ?",
        [
          "La préparation de la fabrication",
          "L’analyse du besoin",
          "La recherche de solutions",
          "La validation"
        ],
        0,
        "On prépare la fabrication, avec sa gamme d’opérations, avant de fabriquer et d’assembler."
      ]
    ]
  },
  {
    "niveau": "5e",
    "titre": "Structuration et traitement des données",
    "questions": [
      [
        "Dans un tableau de données, que représente une colonne ?",
        [
          "Un enregistrement",
          "Un champ",
          "Une clé",
          "Un filtre"
        ],
        1,
        "Une colonne est un champ (nom, date, valeur) ; une ligne est un enregistrement."
      ],
      [
        "Quel type de données permet de tester « vrai » ou « faux » ?",
        [
          "Le texte",
          "La date",
          "Le nombre décimal",
          "Le booléen"
        ],
        3,
        "Un booléen ne prend que deux valeurs, vrai ou faux : il sert aux tests."
      ],
      [
        "Quel graphique montre une répartition, les parts d’un tout ?",
        [
          "La courbe",
          "L’histogramme",
          "Le camembert",
          "Le nuage de points"
        ],
        2,
        "Le camembert raconte une répartition ; la courbe une évolution, l’histogramme une comparaison."
      ],
      [
        "Quel format d’échange organise les données en couples nom-valeur ?",
        [
          "JSON",
          "CSV",
          "JPEG",
          "MP3"
        ],
        0,
        "Le JSON est très utilisé par les objets connectés et les sites web ; le CSV est un tableau en texte."
      ]
    ]
  },
  {
    "niveau": "4e",
    "titre": "Concevoir et fabriquer un OST",
    "questions": [
      [
        "Quel outil sert à choisir entre plusieurs solutions ?",
        [
          "Un diagramme de Gantt",
          "Un tableau multicritère pondéré",
          "Une nomenclature",
          "Une gamme de fabrication"
        ],
        1,
        "Le tableau multicritère compare les solutions sur les critères du cahier des charges, avec une justification."
      ],
      [
        "Un matériau devient indisponible : vers quelle étape la démarche renvoie-t-elle ?",
        [
          "La fabrication",
          "Les tests",
          "Le choix des solutions",
          "La documentation finale"
        ],
        2,
        "La démarche est itérative : un test raté renvoie à la conception, un matériau indisponible au choix des solutions."
      ],
      [
        "Quel document de la documentation finale rend compte de l’impact du cycle de vie ?",
        [
          "La notice d’utilisation",
          "La nomenclature",
          "Le programme commenté",
          "Le bilan environnemental"
        ],
        3,
        "Le bilan environnemental complète les plans, la nomenclature, le programme et la notice."
      ],
      [
        "À quelle étape choisit-on les procédés, les machines, les outils et les règles de sécurité ?",
        [
          "La préparation de la fabrication",
          "L’analyse du besoin",
          "La recherche de solutions",
          "La validation"
        ],
        0,
        "On prépare la fabrication, avec sa gamme d’opérations, avant de fabriquer et d’assembler."
      ]
    ]
  },
  {
    "niveau": "4e",
    "titre": "La circulation de l’information dans un réseau informatique",
    "questions": [
      [
        "Quel équipement relie les machines d’un même réseau local et aiguille les messages ?",
        [
          "Le routeur",
          "Le DNS",
          "Le switch",
          "Le modem"
        ],
        2,
        "Le switch travaille dans un même réseau ; le routeur relie deux réseaux différents."
      ],
      [
        "Quel protocole sert au courrier électronique ?",
        [
          "HTTP",
          "FTP",
          "HTTPS",
          "SMTP"
        ],
        3,
        "SMTP transporte le courrier ; HTTP et HTTPS servent le web, FTP le transfert de fichiers."
      ],
      [
        "Que se passe-t-il si un paquet manque à l’arrivée ?",
        [
          "Il est redemandé",
          "Tout le message est perdu",
          "Le routeur le reconstitue au hasard",
          "L’ordinateur s’arrête"
        ],
        0,
        "Les paquets numérotés sont réassemblés à l’arrivée, et un paquet manquant est redemandé."
      ],
      [
        "Comment appelle-t-on la machine qui demande un service à un serveur ?",
        [
          "Le routeur",
          "Le client",
          "Le switch",
          "La box"
        ],
        1,
        "Le serveur rend un service, le client le demande : c’est le cas de ton navigateur face à un site web."
      ]
    ]
  },
  {
    "niveau": "5e",
    "titre": "Organisation d’un projet technique",
    "questions": [
      [
        "Que porte l’axe horizontal d’un diagramme de Gantt ?",
        [
          "Les tâches",
          "Le temps",
          "Les coûts",
          "Les responsables"
        ],
        1,
        "Le temps est en abscisse, les tâches en ordonnée ; la longueur de chaque barre est la durée de la tâche."
      ],
      [
        "De quoi dispose une tâche qui n’est pas sur le chemin critique ?",
        [
          "D’un budget supplémentaire",
          "D’une priorité absolue",
          "D’une marge",
          "D’aucun responsable"
        ],
        2,
        "Elle peut prendre un peu de retard sans décaler la fin du projet, ce qui est impossible sur le chemin critique."
      ],
      [
        "Quelle phase vient juste après l’analyse du besoin ?",
        [
          "La réalisation",
          "Le bilan",
          "La conception",
          "La recherche de solutions"
        ],
        3,
        "Après le cahier des charges, on cherche et compare plusieurs pistes, avant de concevoir."
      ],
      [
        "Quel document garde les décisions et les essais ratés d’un projet ?",
        [
          "Le carnet de bord",
          "Le diagramme de Gantt",
          "La nomenclature",
          "Le cahier des charges"
        ],
        0,
        "Le carnet de bord assure la traçabilité : il évite qu’un autre refasse la même erreur."
      ]
    ]
  },
  {
    "niveau": "4e",
    "titre": "Les OST",
    "questions": [
      [
        "Pour une lampe de lecture, quelle est la matière d’œuvre ?",
        [
          "Le verre de l’ampoule",
          "L’électricité du réseau",
          "La lumière de la pièce",
          "La personne qui lit"
        ],
        2,
        "La matière d’œuvre est ce sur quoi l’objet agit : la lampe modifie la lumière de la pièce. Celui qui lit est l’utilisateur."
      ],
      [
        "Lequel de ces exemples est un système technique ?",
        [
          "Un tournevis",
          "Une chaise",
          "Un marteau",
          "Un ascenseur"
        ],
        3,
        "Un ascenseur associe plusieurs objets qui travaillent ensemble, avec électronique et programme ; les trois autres répondent au besoin par eux-mêmes."
      ],
      [
        "Quelle fonction d’usage le vélo garde-t-il depuis 150 ans ?",
        [
          "Se déplacer",
          "Freiner",
          "Transmettre le mouvement",
          "Éclairer"
        ],
        0,
        "Sa fonction d’usage n’a pas changé ; ses matériaux, sa transmission, ses freins et son assistance électrique, si."
      ],
      [
        "La bougie, la lampe à huile, l’ampoule et la LED forment…",
        [
          "une lignée d’objets techniques",
          "une famille d’objets techniques",
          "un système technique",
          "une chaîne d’énergie"
        ],
        1,
        "Ils remplissent la même fonction d’usage, éclairer, par des solutions différentes : c’est une famille."
      ]
    ]
  },
  {
    "niveau": "5e",
    "titre": "Système d’information et stockage de données",
    "questions": [
      [
        "Combien de bits compte un octet ?",
        [
          "8",
          "2",
          "10",
          "16"
        ],
        0,
        "Un octet vaut 8 bits et code à peu près un caractère."
      ],
      [
        "Qu’apporte l’authentification à deux facteurs ?",
        [
          "Elle chiffre le disque",
          "Elle double l’espace de stockage",
          "Le mot de passe seul ne suffit plus pour entrer dans le compte",
          "Elle supprime le mot de passe"
        ],
        2,
        "Un second élément, comme un code reçu sur le téléphone, est exigé : un mot de passe volé ne suffit plus."
      ],
      [
        "Quelle est la limite d’un stockage dans le nuage ?",
        [
          "Il n’est accessible que d’un seul endroit",
          "Il ne peut pas être sauvegardé",
          "Il est interdit par le RGPD",
          "Il dépend du réseau et du prestataire"
        ],
        3,
        "Accessible de partout, il exige une connexion et dépend d’un prestataire, dont les centres de données sont bien réels."
      ],
      [
        "Quel principe du RGPD impose de dire à quoi serviront les données collectées ?",
        [
          "Le consentement",
          "La finalité",
          "La durée de conservation",
          "Le droit de rectification"
        ],
        1,
        "La finalité de la collecte doit être déclarée ; le consentement, lui, doit être explicite."
      ]
    ]
  },
  {
    "niveau": "4e",
    "titre": "La chaîne d’information",
    "questions": [
      [
        "Quel composant acquiert une information sur la lumière ambiante ?",
        [
          "Le buzzer",
          "La photorésistance",
          "Le microcontrôleur",
          "Le moteur"
        ],
        1,
        "La photorésistance est un capteur de lumière : elle assure la fonction « acquérir »."
      ],
      [
        "Quelle fonction de la chaîne d’information assure un buzzer ?",
        [
          "Acquérir",
          "Traiter",
          "Communiquer",
          "Alimenter"
        ],
        2,
        "Il transmet une information à l’utilisateur par un son, comme l’écran ou la LED."
      ],
      [
        "Qu’exécute la partie commande pour décider quoi faire ?",
        [
          "Une conversion d’énergie",
          "Une mesure",
          "Un signal lumineux",
          "Un programme"
        ],
        3,
        "Le microcontrôleur, la carte programmable ou l’automate exécutent un programme : c’est la fonction « traiter »."
      ],
      [
        "Lequel de ces moyens permet de communiquer sans fil ?",
        [
          "Le Bluetooth",
          "Le fin de course",
          "La thermistance",
          "Le vérin"
        ],
        0,
        "Le Bluetooth, le Wi-Fi ou la radio transmettent l’information à un autre système ; le fin de course et la thermistance sont des capteurs."
      ]
    ]
  },
  {
    "niveau": "5e",
    "titre": "Modes de représentation d’un OST",
    "questions": [
      [
        "Que signifie une échelle 2:1 ?",
        [
          "Le dessin est deux fois plus petit que l’objet",
          "Le dessin est deux fois plus grand que l’objet",
          "Le dessin est à taille réelle",
          "L’objet mesure 2 cm"
        ],
        1,
        "Le premier nombre concerne le dessin : 2:1 agrandit deux fois, 1:2 réduit deux fois, 1:1 est la grandeur nature."
      ],
      [
        "Quel trait représente un axe sur un dessin technique ?",
        [
          "Le trait continu fort",
          "Le trait interrompu",
          "Le trait mixte fin",
          "Le trait ondulé"
        ],
        2,
        "Le trait continu fort montre une arête vue, l’interrompu une arête cachée, le mixte fin un axe."
      ],
      [
        "Quel schéma représente les composants normalisés d’un circuit ?",
        [
          "Le schéma de principe",
          "Le schéma cinématique",
          "Le croquis",
          "Le schéma électrique"
        ],
        3,
        "Le schéma électrique utilise les symboles normalisés des composants ; le cinématique montre les liaisons et les mouvements."
      ],
      [
        "À quoi sert une vue éclatée d’un modèle 3D ?",
        [
          "À comprendre l’assemblage des pièces",
          "À calculer le prix de revient",
          "À programmer la carte",
          "À coter les dimensions réelles"
        ],
        0,
        "Les pièces écartées les unes des autres montrent comment elles s’assemblent."
      ]
    ]
  }
],
}
