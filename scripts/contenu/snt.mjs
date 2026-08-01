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
            cours: `Internet est un **réseau de réseaux** : aucune machine ne le dirige.

## La commutation de paquets
Un message est découpé en **paquets** qui voyagent indépendamment, éventuellement par des chemins différents, et sont réassemblés à l'arrivée. C'est ce qui rend le réseau robuste : si un lien tombe, les paquets passent ailleurs.

## Les protocoles
**IP** achemine les paquets grâce aux adresses ; **TCP** garantit qu'ils arrivent tous, dans l'ordre, en redemandant ceux qui manquent. L'ensemble forme la pile **TCP/IP**.

## Les adresses IP
IPv4 s'écrit sur 32 bits (ex. 192.168.1.1) et offre environ 4,3 milliards d'adresses — épuisées. IPv6, sur 128 bits, en offre un nombre pratiquement illimité.

## Le routage et le DNS
Les **routeurs** choisissent le prochain saut vers la destination. Le **DNS** traduit un nom de domaine lisible (*studuel.fr*) en adresse IP : c'est l'annuaire d'Internet.`,
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
            cours: `Le Web est une **application** d'Internet, pas Internet lui-même.

## Les trois inventions de 1989-1991
Tim Berners-Lee, au CERN, invente le **HTML** (langage de description des pages), l'**URL** (adresse d'une ressource) et le **HTTP** (protocole de transfert). Trois briques qui, ensemble, font le Web.

## Client et serveur
Le navigateur (**client**) demande une page ; le **serveur** la renvoie. HTTPS ajoute le chiffrement : sans lui, tout le contenu circule en clair.

## HTML et CSS
Le **HTML** structure le contenu (titres, paragraphes, liens, images) ; le **CSS** en décrit la présentation (couleurs, polices, mise en page). Séparer les deux permet de changer l'apparence sans toucher au contenu.

## Les moteurs de recherche
Trois étapes : des **robots** parcourent le Web (*crawling*), le contenu est **indexé**, puis **classé** par un algorithme. Le PageRank historique de Google évalue une page selon les liens qui pointent vers elle. Le classement n'est jamais neutre : il est le produit d'un algorithme et d'un modèle économique.`,
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
            cours: `Un réseau social est un service **gratuit** dont le produit est l'attention de ses utilisateurs.

## Le graphe social
Les utilisateurs sont des **sommets**, les relations des **arêtes**. On y mesure le **degré** (nombre de relations), le **diamètre** (plus longue distance minimale entre deux sommets) et la **centralité**. L'expérience de Milgram (1967) a popularisé l'idée des « six degrés de séparation ».

## Le modèle économique
La gratuité est financée par la **publicité ciblée** : plus le service connaît l'utilisateur, plus l'espace publicitaire se vend cher. Le temps passé devient donc l'objectif de conception.

## Les algorithmes de recommandation
Ils sélectionnent ce qui apparaît dans le fil. Optimisés sur l'engagement, ils favorisent ce qui fait réagir — d'où les **bulles de filtre** et la viralité des contenus clivants.

## Risques et régulation
Cyberharcèlement, désinformation, exposition des mineurs, données personnelles. Le **RGPD** encadre les données ; le **DSA** européen impose depuis 2023 des obligations de modération et de transparence aux grandes plateformes.`,
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
            cours: `Une donnée seule ne vaut rien : c'est sa **structure** qui la rend exploitable.

## Donnée, information, connaissance
La **donnée** est brute (37,2). L'**information** naît du contexte (37,2 °C, température corporelle). La **connaissance** vient de l'interprétation (une température normale).

## Les tables
Une table organise les données en **lignes** (les enregistrements, ou descripteurs d'une entité) et **colonnes** (les attributs). Un attribut a un **type** : entier, flottant, chaîne, booléen, date.

## Les formats
**CSV** : texte simple, une ligne par enregistrement, séparateurs — universel mais sans types. **JSON** : imbriqué, typé, standard du Web. Un format **ouvert** garantit l'interopérabilité et la pérennité, contrairement à un format propriétaire.

## Les traitements
**Rechercher**, **trier**, **filtrer**, **fusionner** (joindre deux tables sur un attribut commun), **agréger** (compter, sommer, moyenner). Le **big data** se caractérise par les 3 V : volume, vitesse, variété — et pose la question du stockage, de l'énergie et de la propriété des données.`,
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
            cours: `Deux usages quotidiens qui reposent sur des principes physiques précis.

## Le GPS
Une constellation de satellites émet en permanence l'heure exacte et sa position. Le récepteur calcule sa distance à chaque satellite par le **temps de trajet du signal** : c'est la **trilatération**. Il faut au moins **quatre** satellites — trois pour la position, un pour corriger l'horloge du récepteur.

## Les protocoles et la carte
La trame **NMEA** transporte les données de position. Les cartes numériques superposent des **couches** (relief, routes, bâtiments) ; **OpenStreetMap** est une carte libre alimentée par ses contributeurs.

## L'image numérique
Une photo est une matrice de **pixels**. En RVB, chaque pixel porte trois composantes de 0 à 255, soit **3 octets** — d'où 16,7 millions de couleurs possibles. La **définition** est le nombre de pixels ; la **résolution**, leur densité.

## Les métadonnées EXIF
Une photo embarque date, modèle d'appareil, réglages et souvent la **position GPS**. Publier une photo, c'est donc parfois publier le lieu où elle a été prise — ce que la plupart des gens ignorent.`,
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
