// SNT — Sciences numériques et technologie, tronc commun de 2de.
// Les thèmes du programme officiel : internet, le Web, les réseaux sociaux,
// les données structurées, la localisation, la photographie numérique.

export default {
  slug: 'snt',
  nom: 'SNT',
  blocs: [
    {
      niveaux: ['2de'],
      chapitres: [
        {
          titre: 'Internet',
          lecon: {
            titre: 'Comment circulent les données',
            cours: `Internet est un **réseau de réseaux** : aucune machine ne le dirige, et c’est précisément ce qui le rend robuste.

## La commutation de paquets
Un message est découpé en **paquets** qui voyagent **indépendamment**, éventuellement par des chemins différents, et sont réassemblés à l’arrivée.

> C’est ce découpage qui rend le réseau robuste : si un lien tombe, les paquets suivants passent ailleurs sans que personne n’ait à décider quoi que ce soit de central.

## Les protocoles
| Protocole | Ce dont il se charge | Ce qu’il ne fait pas |
| **IP** | Acheminer les paquets grâce aux adresses | Garantir qu’ils arrivent |
| **TCP** | Vérifier, remettre dans l’ordre, redemander les manquants | Choisir la route |

L’ensemble forme la pile **TCP/IP** : deux responsabilités séparées, ce qui permet de faire évoluer l’une sans toucher à l’autre.

## Les adresses IP
| Version | Taille | Nombre d’adresses | État |
| IPv4 | 32 bits (192.168.1.1) | environ 4,3 milliards | Épuisées |
| IPv6 | 128 bits | pratiquement illimité | En déploiement |

## Le routage et le DNS
Les **routeurs** ne connaissent pas le chemin complet : ils choisissent seulement le **prochain saut** vers la destination. Le **DNS** traduit un nom de domaine lisible en adresse IP — c’est l’annuaire d’Internet, et son point de fragilité le plus exploité.`,
          },
          questions: [
            ['Que fait le protocole TCP ?', ['Il garantit l’arrivée complète et ordonnée des paquets', 'Il attribue les adresses', 'Il chiffre les données', 'Il affiche les pages'], 0, 'IP achemine, TCP fiabilise.'],
            ['Internet découpe les messages en paquets indépendants.', ['Vrai', 'Faux'], 0, 'C’est la commutation de paquets, à la base de sa robustesse.'],
            ['À quoi sert le DNS ?', ['À traduire un nom de domaine en adresse IP', 'À chiffrer les échanges', 'À router les paquets', 'À compresser les images'], 0, 'C’est l’annuaire d’Internet.'],
            ['Sur combien de bits s’écrit une adresse IPv4 ?', ['32 bits', '64 bits', '128 bits', '16 bits'], 0, 'Soit environ 4,3 milliards d’adresses, aujourd’hui épuisées.'],
            ['Deux paquets d’un même message empruntent forcément le même chemin.', ['Vrai', 'Faux'], 1, 'Ils peuvent suivre des routes différentes et être réassemblés à l’arrivée.'],
            ['Quel équipement choisit le chemin des paquets ?', ['Le routeur', 'Le serveur DNS', 'Le navigateur', 'Le modem seul'], 0, 'Il décide du prochain saut vers la destination.'],
            ['IPv6 a été créé parce que les adresses IPv4 étaient épuisées.', ['Vrai', 'Faux'], 0, '128 bits offrent un espace d’adressage pratiquement illimité.'],
            ['Internet est dirigé par une machine centrale.', ['Vrai', 'Faux'], 1, 'C’est un réseau décentralisé de réseaux interconnectés.'],
          ],
        },
        {
          titre: 'Le Web',
          lecon: {
            titre: 'Pages, liens et moteurs de recherche',
            cours: `Le Web est une **application** d’Internet, pas Internet lui-même. Confondre les deux, c’est confondre la route et les voitures.

## Les trois inventions de 1989-1991
Tim Berners-Lee, au CERN, invente trois briques qui, ensemble, font le Web.

| Brique | Ce qu’elle apporte |
| **HTML** | Un langage pour décrire une page |
| **URL** | Une adresse unique pour chaque ressource |
| **HTTP** | Un protocole pour transférer la ressource |

## Client et serveur
Le navigateur (**client**) demande une page ; le **serveur** la renvoie. **HTTPS** ajoute le chiffrement — sans lui, tout le contenu circule en clair et peut être lu par n’importe quel intermédiaire du réseau.

## HTML et CSS
| Langage | Ce qu’il décrit | Exemple |
| **HTML** | La **structure** du contenu | Titres, paragraphes, liens, images |
| **CSS** | La **présentation** | Couleurs, polices, mise en page |

Séparer les deux permet de changer entièrement l’apparence d’un site sans toucher à une ligne de son contenu.

## Les moteurs de recherche
| Étape | Ce qui s’y passe |
| **Crawling** | Des robots parcourent le Web de lien en lien |
| **Indexation** | Le contenu est stocké et découpé en mots-clés |
| **Classement** | Un algorithme ordonne les résultats |

Le **PageRank** historique de Google évalue une page selon les liens qui pointent vers elle — une page est importante si des pages importantes la citent.

> Le classement n’est **jamais neutre** : il est le produit d’un algorithme et d’un modèle économique. La première page de résultats est un choix, pas un fait.`,
          },
          questions: [
            ['Qui a inventé le Web ?', ['Tim Berners-Lee', 'Steve Jobs', 'Vinton Cerf', 'Alan Turing'], 0, 'Au CERN, entre 1989 et 1991.'],
            ['Le Web et Internet sont la même chose.', ['Vrai', 'Faux'], 1, 'Le Web est une application qui fonctionne grâce à Internet.'],
            ['Quel langage structure le contenu d’une page ?', ['HTML', 'CSS', 'HTTP', 'SQL'], 0, 'Le CSS s’occupe de la présentation.'],
            ['Que garantit HTTPS par rapport à HTTP ?', ['Le chiffrement des échanges', 'Une page plus rapide', 'Un meilleur classement', 'Une page plus jolie'], 0, 'Sans lui, le contenu circule en clair.'],
            ['Le PageRank évalue une page selon les liens qui pointent vers elle.', ['Vrai', 'Faux'], 0, 'Une page très citée est jugée plus pertinente.'],
            ['Quelles sont les trois étapes d’un moteur de recherche ?', ['Parcourir, indexer, classer', 'Chiffrer, envoyer, afficher', 'Compresser, stocker, vendre', 'Écrire, publier, lire'], 0, 'Crawling, indexation, classement.'],
            ['Le classement des résultats de recherche est neutre.', ['Vrai', 'Faux'], 1, 'Il résulte d’un algorithme et d’un modèle économique.'],
            ['Que désigne une URL ?', ['L’adresse d’une ressource sur le Web', 'Un protocole de chiffrement', 'Un langage de programmation', 'Un type de serveur'], 0, 'Elle indique le protocole, le domaine et le chemin.'],
          ],
        },
        {
          titre: 'Les réseaux sociaux',
          lecon: {
            titre: 'Modèle économique et effets de réseau',
            cours: `Un réseau social est un service **gratuit** dont le produit est l’attention de ses utilisateurs. Tout le chapitre découle de cette phrase.

## Le graphe social
Les utilisateurs sont des **sommets**, les relations des **arêtes**.

| Mesure | Ce qu’elle dit |
| Le **degré** | Le nombre de relations d’un sommet |
| Le **diamètre** | La plus longue distance minimale entre deux sommets |
| La **centralité** | À quel point un sommet est un passage obligé |

L’expérience de **Milgram** (1967) a popularisé l’idée des « six degrés de séparation » : le diamètre du graphe humain serait très petit malgré sa taille.

## Le modèle économique
La gratuité est financée par la **publicité ciblée** : plus le service connaît l’utilisateur, plus l’espace publicitaire se vend cher.

> Le **temps passé** devient donc l’objectif de conception, avant la qualité du service rendu. Ce n’est pas un dérapage : c’est ce que le modèle économique demande.

## Les algorithmes de recommandation
Ils sélectionnent ce qui apparaît dans le fil. Optimisés sur l’**engagement**, ils favorisent ce qui fait réagir — d’où les **bulles de filtre** et la viralité des contenus clivants, qui suscitent plus de réactions que les contenus nuancés.

## Risques et régulation
| Risque | Le texte qui l’encadre |
| Données personnelles | Le **RGPD** (2018) |
| Modération et transparence | Le **DSA** européen (2023) |
| Cyberharcèlement | Délit aggravé au code pénal |
| Exposition des mineurs | Âge minimal, contrôle parental |`,
          },
          questions: [
            ['Dans un graphe social, que représente une arête ?', ['Une relation entre deux utilisateurs', 'Un utilisateur', 'Un message', 'Un serveur'], 0, 'Les sommets sont les utilisateurs.'],
            ['Comment se financent principalement les réseaux sociaux gratuits ?', ['Par la publicité ciblée', 'Par les abonnements', 'Par l’État', 'Par la vente de matériel'], 0, 'Le ciblage augmente la valeur de l’espace publicitaire.'],
            ['L’expérience de Milgram est à l’origine de l’idée des six degrés de séparation.', ['Vrai', 'Faux'], 0, 'Menée en 1967 sur l’acheminement de lettres.'],
            ['Que désigne le degré d’un sommet dans un graphe ?', ['Son nombre de relations', 'Sa distance au centre', 'Son ancienneté', 'Son nombre de messages'], 0, 'C’est le nombre d’arêtes qui y aboutissent.'],
            ['Les algorithmes de recommandation optimisent la véracité des contenus.', ['Vrai', 'Faux'], 1, 'Ils optimisent l’engagement, ce qui n’est pas la même chose.'],
            ['Quel règlement européen encadre les données personnelles ?', ['Le RGPD', 'Le DSA', 'La LOPPSI', 'Le DMA'], 0, 'Le DSA, lui, porte sur la modération et la transparence des plateformes.'],
            ['Le diamètre d’un graphe est la plus longue des distances minimales entre deux sommets.', ['Vrai', 'Faux'], 0, 'Il mesure l’étendue du réseau.'],
            ['Une bulle de filtre désigne…', ['Un environnement informationnel qui confirme nos opinions', 'Un pare-feu', 'Un filtre anti-spam', 'Un réglage de confidentialité'], 0, 'Elle résulte de la personnalisation algorithmique.'],
          ],
        },
        {
          titre: 'Les données structurées',
          lecon: {
            titre: 'Tableaux, formats et traitement',
            cours: `Une donnée seule ne vaut rien : c’est sa **structure** qui la rend exploitable.

## Donnée, information, connaissance
| Niveau | Exemple | Ce qui a été ajouté |
| **Donnée** | 37,2 | Rien : c’est brut |
| **Information** | 37,2 °C, température corporelle | Le contexte |
| **Connaissance** | Une température normale | L’interprétation |

## Les tables
Une table organise les données en **lignes** (les enregistrements, un par entité décrite) et en **colonnes** (les attributs). Chaque attribut a un **type** : entier, flottant, chaîne, booléen, date. C’est le type qui autorise ou interdit un traitement — on ne fait pas la moyenne d’une chaîne.

## Les formats
| Format | Ce qu’il permet | Sa limite |
| **CSV** | Texte simple, une ligne par enregistrement | Aucun type, aucune imbrication |
| **JSON** | Imbrication et types, standard du Web | Plus verbeux |

> Un format **ouvert** garantit l’interopérabilité et la pérennité : un fichier propriétaire dépend d’un logiciel qui peut disparaître, un format ouvert se relit dans vingt ans.

## Les traitements
| Traitement | Ce qu’il fait |
| Rechercher | Retrouver un enregistrement |
| Trier | Ordonner selon un attribut |
| Filtrer | Ne garder que les lignes qui vérifient un critère |
| Fusionner | Joindre deux tables sur un attribut commun |
| Agréger | Compter, sommer, moyenner |

Le **big data** se caractérise par les 3 V — volume, vitesse, variété — et pose la question du stockage, de l’énergie consommée et de la **propriété** des données.`,
          },
          questions: [
            ['Dans une table de données, que représente une ligne ?', ['Un enregistrement (une entité décrite)', 'Un attribut', 'Un type', 'Un fichier'], 0, 'Les colonnes portent les attributs.'],
            ['Le format CSV conserve le type des données.', ['Vrai', 'Faux'], 1, 'Tout y est du texte : c’est sa limite principale.'],
            ['Quel format est imbriqué et typé, standard du Web ?', ['JSON', 'CSV', 'PDF', 'TXT'], 0, 'Il permet d’imbriquer objets et listes.'],
            ['Qu’est-ce qu’une jointure ?', ['La fusion de deux tables sur un attribut commun', 'Un tri croissant', 'Une suppression de doublons', 'Un changement de format'], 0, 'Elle permet de croiser deux sources.'],
            ['Un format ouvert facilite l’interopérabilité et la pérennité.', ['Vrai', 'Faux'], 0, 'Un format propriétaire dépend de son éditeur.'],
            ['Quels sont les 3 V du big data ?', ['Volume, vitesse, variété', 'Valeur, vente, visibilité', 'Vitesse, validité, vérité', 'Volume, valeur, vitesse'], 0, 'Trois dimensions qui dépassent les outils classiques.'],
            ['La donnée devient information grâce au contexte.', ['Vrai', 'Faux'], 0, '37,2 ne dit rien ; 37,2 °C corporels, si.'],
            ['Agréger des données, c’est…', ['Les résumer par comptage, somme ou moyenne', 'Les supprimer', 'Les chiffrer', 'Les dupliquer'], 0, 'On passe du détail à une vue d’ensemble.'],
          ],
        },
        {
          titre: 'Localisation et photographie numérique',
          lecon: {
            titre: 'GPS, cartographie et image capturée',
            cours: `Deux usages quotidiens qui reposent sur des principes physiques précis — et qui laissent tous deux des traces.

## Le GPS
Une constellation de satellites émet en permanence l’heure exacte et sa position. Le récepteur calcule sa distance à chaque satellite par le **temps de trajet du signal** : c’est la **trilatération**.

| Nombre de satellites | À quoi il sert |
| 3 | Déterminer la position |
| 1 de plus, soit 4 au total | Corriger l’horloge du récepteur |

> Le quatrième satellite n’est pas un supplément de précision : sans lui, une erreur d’un millionième de seconde sur l’horloge du récepteur fausse la position de 300 mètres.

## Les protocoles et la carte
La trame **NMEA** transporte les données de position. Les cartes numériques superposent des **couches** — relief, routes, bâtiments — que l’on active séparément. **OpenStreetMap** est une carte libre, alimentée par ses contributeurs.

## L’image numérique
Une photo est une matrice de **pixels**. En RVB, chaque pixel porte trois composantes de 0 à 255.

| Grandeur | Ce qu’elle mesure |
| Poids d’un pixel | 3 octets, soit 16,7 millions de couleurs possibles |
| **Définition** | Le nombre total de pixels |
| **Résolution** | Leur densité, en points par pouce |

## Les métadonnées EXIF
Une photo embarque la date, le modèle d’appareil, les réglages — et souvent la **position GPS** du lieu de prise de vue.

> Publier une photo, c’est donc parfois publier l’endroit où l’on habite. La plupart des gens l’ignorent, et aucun réseau social ne le rappelle au moment de l’envoi.`,
          },
          questions: [
            ['Combien de satellites au minimum pour une position GPS fiable ?', ['4', '2', '3', '6'], 0, 'Trois pour la position, un quatrième pour corriger l’horloge du récepteur.'],
            ['Sur quel principe repose le calcul GPS ?', ['La trilatération à partir du temps de trajet du signal', 'La triangulation d’angles', 'La détection magnétique', 'La reconnaissance d’image'], 0, 'La distance se déduit du temps mis par le signal.'],
            ['OpenStreetMap est une carte libre alimentée par des contributeurs.', ['Vrai', 'Faux'], 0, 'Son modèle est collaboratif, comme une encyclopédie.'],
            ['Combien d’octets code un pixel en RVB ?', ['3', '1', '2', '4'], 0, 'Un octet par composante rouge, verte et bleue.'],
            ['Les métadonnées EXIF peuvent contenir la position GPS de la photo.', ['Vrai', 'Faux'], 0, 'Publier l’image peut donc révéler le lieu de prise de vue.'],
            ['Combien de couleurs permet le codage RVB sur 3 octets ?', ['Environ 16,7 millions', '256', '65 536', '1 million'], 0, '256 × 256 × 256.'],
            ['La définition d’une image désigne…', ['Son nombre total de pixels', 'La densité des pixels', 'Son poids en octets', 'Sa netteté'], 0, 'La résolution, elle, exprime une densité.'],
            ['Le GPS émet des signaux vers les satellites pour se localiser.', ['Vrai', 'Faux'], 1, 'Le récepteur ne fait qu’écouter : il n’émet rien.'],
          ],
        },
      ],
    },
  ],
}
