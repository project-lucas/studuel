// Géographie — Terminale : les 4 chapitres du programme, soit 20 fiches.
//
// MÊME SLUG que `histoire-geo-tle.mjs` (`histoire-geo`), et c'est pour ça que
// le générateur a gagné `--modules` : la 227 (histoire) est DÉJÀ EXÉCUTÉE en
// base — sondée le 05/08/2026, positions 26 à 38 présentes — donc elle ne doit
// plus jamais être régénérée. `--slugs histoire-geo` fusionnerait les deux
// modules dans un seul fichier SQL ; `--modules geographie-tle` n'émet que
// celui-ci.
//
// Positions : 1→5 les chapitres déjà en base (3 d'histoire, 2 de géo),
// 6→25 réservées aux chapitres d'histoire 1 à 6 encore à écrire, 26→38 la 227,
// et 39→58 ce bloc. Un `INSERT … ON CONFLICT DO NOTHING` ne met JAMAIS à jour
// la position d'une ligne existante : la place se réserve d'avance ou plus du
// tout.
//
// ⚠️ DOUBLON CONNU, laissé en place : « Mers et océans dans la mondialisation »
// et « L'Union européenne dans la mondialisation » (positions 4 et 5) sont deux
// fiches de synthèse que les chapitres 1 et 3 ci-dessous recouvrent. On ne les
// supprime PAS : elles ont été posées par une migration ancienne, idempotente
// et rejouable, qui les recréerait au prochain passage — un ménage ici serait
// silencieusement annulé. À traiter par une migration dédiée si Lucas le veut.

export default {
  slug: 'histoire-geo',
  nom: 'Histoire-Géographie',

  titreMigration: 'GÉOGRAPHIE Tle — MERS, TERRITOIRES, UNION EUROPÉENNE, FRANCE',

  motif: `CONSTAT MESURÉ (sonde en lecture seule sur la base, 05/08/2026) :
l'histoire-géo de Terminale comptait 18 chapitres — les 5 d'origine et les 13
d'histoire posées par la 227 — dont SEULEMENT DEUX de géographie, deux fiches
de synthèse (« Mers et océans dans la mondialisation », « L'Union européenne
dans la mondialisation »). Le programme de géographie de Terminale, ses
quatre chapitres et ses vingt fiches, n'existait donc pas : ni les détroits,
ni la hiérarchie des centres de décision, ni les recompositions du territoire
français. Cette migration installe ces 20 fiches derrière les chapitres
existants, sans rien supprimer.`,

  blocs: [
    {
      niveaux: ['Tle'],
      // 1→5 : déjà en base. 6→25 : réservées à l'histoire (ch. 1 à 6).
      // 26→38 : la 227, exécutée. 39→58 : ce bloc.
      positionDepart: 39,
      chapitres: [
        // ===== Chapitre 1 — Mers et océans au cœur de la mondialisation ====
        {
          titre: 'Mers et océans : vecteurs essentiels de la mondialisation',
          lecon: {
            titre: 'La mondialisation passe par la mer',
            cours: `Un chiffre suffit à poser le décor : environ **80 % du commerce mondial en volume** voyage par la mer. La mondialisation n'est pas d'abord numérique, elle est maritime.

## La révolution du conteneur
Inventé par **Malcom McLean en 1956**, le conteneur standardise le transport : la même boîte passe du camion au train et au navire sans être ouverte. Le coût du transport s'effondre, ce qui rend rentable de produire à 15 000 km du consommateur. On compte les flux en **EVP** (équivalent vingt pieds) ; les plus grands porte-conteneurs en transportent aujourd'hui plus de **20 000**.

> Sans conteneurisation, pas de division internationale du travail : c'est une innovation logistique qui a rendu possible l'atelier du monde.

## Les routes et les points de passage
Les flux se concentrent sur quelques **routes** reliant les trois grandes façades maritimes — Asie orientale, Europe du Nord-Ouest (**Northern Range**, de Hambourg au Havre), Amérique du Nord. Ils passent par des **points de passage obligés** : canal de **Suez**, canal de **Panama**, détroits de **Malacca**, d'**Ormuz**, de **Gibraltar**, du **Bosphore**. Un incident y bloque le commerce mondial — l'échouage de l'*Ever Given* dans le canal de Suez en 2021 l'a rappelé en six jours.

## Les hubs
Les ports mondiaux ne sont pas de simples quais : ce sont des **hubs** où les cargaisons sont éclatées vers des navires plus petits (*transbordement*). **Shanghai**, **Singapour**, **Ningbo**, **Shenzhen** dominent le classement ; les premiers ports européens (Rotterdam, Anvers) sont loin derrière en tonnage.

## Ce que la mer transporte d'autre
- **99 % des données** mondiales circulent par des **câbles sous-marins**, pas par satellite ;
- la mer fournit des **ressources** : pêche, hydrocarbures offshore, minerais ;
- la **convention de Montego Bay (1982)** attribue à chaque État une **zone économique exclusive (ZEE)** de **200 milles marins** où il exploite seul les ressources.`,
          },
          questions: [
            ['Quelle part du commerce mondial en volume passe par la mer ?', ['Environ 80 %', 'Environ 30 %', 'Environ 50 %', 'Environ 95 %'], 0, 'La mondialisation des marchandises est d’abord un fait maritime.'],
            ['Qui invente le conteneur en 1956 ?', ['Malcom McLean', 'Ferdinand de Lesseps', 'Aristote Onassis', 'Vincent Bolloré'], 0, 'La standardisation de la boîte fait s’effondrer le coût du transport.'],
            ['Que mesure l’EVP ?', ['Un volume de conteneurs (équivalent vingt pieds)', 'Le tonnage d’un navire', 'La profondeur d’un port', 'La vitesse d’un porte-conteneurs'], 0, 'Les plus grands navires dépassent aujourd’hui 20 000 EVP.'],
            ['Quelle part des données mondiales circule par câbles sous-marins ?', ['Environ 99 %', 'Environ 50 %', 'Environ 10 %', 'Environ 75 %'], 0, 'Le satellite ne joue qu’un rôle marginal : Internet est un réseau sous-marin.'],
            ['Quelle largeur la convention de Montego Bay donne-t-elle à une ZEE ?', ['200 milles marins', '12 milles marins', '50 milles marins', '350 milles marins'], 0, 'Douze milles pour les eaux territoriales, deux cents pour la zone économique exclusive.'],
            ['Le blocage d’un seul point de passage peut perturber le commerce mondial.', ['Vrai', 'Faux'], 0, 'L’échouage de l’Ever Given dans le canal de Suez en 2021 l’a démontré en quelques jours.'],
            ['Comment appelle-t-on la façade maritime européenne allant de Hambourg au Havre ?', ['La Northern Range', 'La mégalopole bleue', 'La dorsale atlantique', 'Le Rhin maritime'], 0, 'Elle concentre les grands ports d’Europe du Nord-Ouest.'],
            ['Les premiers ports mondiaux en tonnage sont européens.', ['Vrai', 'Faux'], 1, 'Le classement est dominé par l’Asie : Shanghai, Singapour, Ningbo, Shenzhen.'],
          ],
        },
        {
          titre: 'Des enjeux géostratégiques qui se déplacent vers les mers et les océans',
          lecon: {
            titre: 'La mer, terrain de rivalités',
            cours: `Plus les échanges dépendent de la mer, plus la mer devient un espace de puissance. C'est la **maritimisation** des enjeux stratégiques.

## Contrôler les routes
Une marine de guerre sert d'abord à garantir la liberté de circulation de ses navires marchands. Les **États-Unis** conservent la première marine hauturière (une dizaine de porte-avions à propulsion nucléaire) et un réseau mondial de bases. La **Chine** a construit en vingt ans la première flotte du monde **en nombre de bâtiments**, ouvert une base à **Djibouti** (2017) et sécurise ses approvisionnements par des ports acquis ou financés (**routes de la soie maritimes**).

## Les zones de tension
- **Mer de Chine méridionale** : Pékin y revendique la quasi-totalité de l'espace (« ligne en neuf traits »), construit des îlots artificiels militarisés dans les **Spratleys** et les **Paracels**, et ignore la sentence arbitrale de **2016** qui lui a donné tort.
- **Arctique** : la fonte de la banquise ouvre la **route maritime du Nord** et l'accès à des ressources ; Russie, Canada, États-Unis, Danemark et Norvège y déposent des demandes d'extension de plateau continental.
- **Piraterie** : golfe d'Aden, puis surtout **golfe de Guinée**, devenu la première zone d'attaques.

## L'appropriation des espaces
La ZEE fait de chaque île un enjeu : un rocher habitable ouvre 200 milles de droits. Les États déposent auprès de l'ONU des demandes d'**extension du plateau continental** au-delà de 200 milles, sur critère géologique. La mer, longtemps espace de liberté, se **territorialise**.

> Retiens la logique : la mondialisation a rendu les États dépendants de flux qu'ils ne contrôlent pas — d'où le retour des marines de guerre, des bases et des contentieux de souveraineté.`,
          },
          questions: [
            ['Que désigne la maritimisation ?', ['Le report vers la mer des enjeux économiques et stratégiques', 'La montée du niveau des océans', 'L’augmentation de la pêche industrielle', 'La construction de ports artificiels'], 0, 'Les échanges dépendant de la mer, la puissance s’y déplace aussi.'],
            ['Quelle zone concentre les revendications chinoises et la « ligne en neuf traits » ?', ['La mer de Chine méridionale', 'L’océan Indien', 'La mer d’Okhotsk', 'Le golfe du Bengale'], 0, 'Îlots artificiels militarisés dans les Spratleys et les Paracels.'],
            ['La Chine a respecté la sentence arbitrale de 2016 sur la mer de Chine méridionale.', ['Vrai', 'Faux'], 1, 'Elle l’a rejetée et a poursuivi ses aménagements.'],
            ['Où la Chine a-t-elle ouvert sa première base militaire à l’étranger en 2017 ?', ['À Djibouti', 'Au Sri Lanka', 'Au Pakistan', 'En Birmanie'], 0, 'Position clé à l’entrée de la mer Rouge, sur la route de l’Europe.'],
            ['Quelle zone est aujourd’hui la première pour les attaques de pirates ?', ['Le golfe de Guinée', 'Le golfe d’Aden', 'Le détroit de Malacca', 'La mer des Caraïbes'], 0, 'La piraterie somalienne a reflué, l’Afrique de l’Ouest a pris le relais.'],
            ['La fonte de la banquise ouvre de nouvelles routes maritimes en Arctique.', ['Vrai', 'Faux'], 0, 'La route du Nord raccourcit fortement le trajet Asie-Europe, d’où les revendications.'],
            ['Pourquoi la possession d’une petite île est-elle stratégique ?', ['Elle ouvre une ZEE de 200 milles marins', 'Elle permet d’installer un port en eau profonde', 'Elle donne un siège à l’ONU', 'Elle échappe aux taxes internationales'], 0, 'D’où la multiplication des contentieux sur des rochers inhabités.'],
            ['La haute mer est aujourd’hui un espace totalement libre et sans revendication.', ['Vrai', 'Faux'], 1, 'Les demandes d’extension du plateau continental territorialisent progressivement l’océan.'],
          ],
        },
        {
          titre: 'Le détroit de Malacca et le golfe arabo-persique : des points de passage au cœur de la mondialisation',
          lecon: {
            titre: 'Deux goulets, un monde suspendu',
            cours: `Deux espaces resserrés portent une part démesurée du commerce mondial. Les étudier, c'est comprendre ce qu'est une **vulnérabilité stratégique**.

## Le détroit de Malacca
Long d'environ **900 km** entre la Malaisie et Sumatra, large de **2,7 km** en son point le plus étroit, il relie l'océan Indien à la mer de Chine. Il voit passer environ **90 000 à 100 000 navires par an**, soit de l'ordre du **quart du commerce maritime mondial** et une part majeure du pétrole destiné à l'Asie orientale.

**Singapour**, à sa sortie, en a tiré sa fortune : port de transbordement de premier rang mondial, raffinage, place financière.

> On appelle **dilemme de Malacca** la dépendance chinoise à ce goulet : environ 80 % de ses importations d'hydrocarbures y transitent, sous surveillance de marines qui ne sont pas la sienne. D'où les contournements cherchés — oléoducs vers la Birmanie et le Pakistan, projets de canal de Kra, routes terrestres.

## Le golfe arabo-persique
Il concentre une part majeure des réserves mondiales de pétrole et de gaz (Arabie saoudite, Iran, Irak, Émirats, Koweït, Qatar). Sa sortie, le **détroit d'Ormuz**, large de 50 km, voit passer de l'ordre de **20 millions de barils par jour** — environ un cinquième de la consommation mondiale de pétrole.

L'**Iran**, riverain, a menacé plusieurs fois de le fermer ; les États-Unis y maintiennent une flotte permanente (Ve flotte à Bahreïn) et la France une base à Abou Dabi. Le détroit est donc à la fois une artère et un levier de pression.

## Ce qu'il faut en retenir
Ces deux passages illustrent la même chose : la mondialisation a **concentré** ses flux sur quelques kilomètres carrés. Efficacité maximale, **résilience minimale**.`,
          },
          questions: [
            ['Le détroit de Malacca relie…', ['L’océan Indien à la mer de Chine', 'La mer Rouge à la Méditerranée', 'Le Pacifique à l’Atlantique', 'La mer Noire à la Méditerranée'], 0, 'C’est la route directe entre le golfe Persique et l’Asie orientale.'],
            ['Quel pays a bâti sa prospérité à la sortie du détroit de Malacca ?', ['Singapour', 'La Thaïlande', 'Les Philippines', 'Le Vietnam'], 0, 'Transbordement, raffinage et finance en ont fait une plaque tournante mondiale.'],
            ['Qu’appelle-t-on le « dilemme de Malacca » ?', ['La dépendance chinoise à un détroit qu’elle ne contrôle pas', 'Le choix entre pêche et transport maritime', 'La pollution du détroit par les pétroliers', 'Le conflit entre la Malaisie et l’Indonésie'], 0, 'Environ 80 % des hydrocarbures importés par la Chine y passent.'],
            ['Quel détroit ferme le golfe arabo-persique ?', ['Le détroit d’Ormuz', 'Le détroit de Bab el-Mandeb', 'Le détroit de Malacca', 'Le canal de Suez'], 0, 'Environ 20 millions de barils par jour y transitent.'],
            ['L’Iran a plusieurs fois menacé de fermer le détroit d’Ormuz.', ['Vrai', 'Faux'], 0, 'La menace suffit à faire monter les cours mondiaux du pétrole.'],
            ['Quelle est la largeur du détroit de Malacca en son point le plus étroit ?', ['Environ 2,7 km', 'Environ 50 km', 'Environ 100 km', 'Environ 900 km'], 0, '900 km est sa longueur, pas sa largeur.'],
            ['La concentration des flux sur quelques passages rend le commerce mondial plus résilient.', ['Vrai', 'Faux'], 1, 'C’est l’inverse : efficacité maximale, vulnérabilité maximale.'],
            ['Quel projet la Chine soutient-elle pour réduire sa dépendance à Malacca ?', ['Des oléoducs vers la Birmanie et le Pakistan', 'Un pont vers l’Indonésie', 'Un canal à travers Sumatra', 'Une flotte de sous-marins civils'], 0, 'S’y ajoutent les projets de canal de Kra et les routes terrestres de la soie.'],
          ],
        },
        {
          titre: 'Mers et océans en devenir',
          lecon: {
            titre: 'Exploiter, protéger, gouverner',
            cours: `L'océan est en même temps la plus grande réserve de ressources de la planète, sa principale poubelle et son plus vaste espace mal gouverné.

## La pression sur les ressources vivantes
Environ **35 % des stocks de poissons** sont surexploités et la majorité du reste est exploitée au maximum. La pêche industrielle (chaluts de fond, navires-usines), la pêche illégale et les subventions publiques entretiennent la surpêche. L'**aquaculture** fournit désormais près de la moitié du poisson consommé, avec ses propres impacts (intrants, maladies, farines).

## Les pollutions
- **Plastiques** : de l'ordre de **8 à 10 millions de tonnes** rejoignent l'océan chaque année, s'accumulant dans les gyres (le « continent de plastique » du Pacifique nord) puis se fragmentant en microplastiques ;
- **eutrophisation** par les engrais, marées vertes, zones mortes ;
- **acidification** : l'océan absorbe environ un quart du CO₂ émis, son pH baisse, ce qui fragilise coraux et coquillages ;
- **réchauffement** : blanchissement des coraux, déplacement des espèces, montée du niveau marin.

## Les nouvelles convoitises
Le fond des océans contient des **nodules polymétalliques** (nickel, cobalt, manganèse) et des terres rares, dont l'exploitation est réclamée par les industriels des batteries et contestée par les scientifiques. Les **énergies marines** se développent : éolien posé et flottant, hydrolien, marémoteur.

## La gouvernance en construction
- L'**Autorité internationale des fonds marins (AIFM)** délivre les permis d'exploration au-delà des ZEE ;
- le **traité BBNJ**, adopté à l'ONU en **2023**, permet enfin de créer des aires protégées en **haute mer** — 60 % de l'océan qui n'appartenait à personne ;
- l'objectif international est de protéger **30 % des espaces marins d'ici 2030**, alors que le taux réellement protégé reste très inférieur, et souvent sans contrôle effectif (« parcs de papier »).`,
          },
          questions: [
            ['Quelle part des stocks de poissons est surexploitée ?', ['Environ 35 %', 'Environ 5 %', 'Environ 60 %', 'Environ 90 %'], 0, 'L’essentiel du reste est exploité à son maximum : les marges sont nulles.'],
            ['Combien de plastique rejoint l’océan chaque année ?', ['8 à 10 millions de tonnes', '100 000 tonnes', '500 millions de tonnes', '1 million de tonnes'], 0, 'Il s’accumule dans les gyres puis se fragmente en microplastiques.'],
            ['Pourquoi l’océan s’acidifie-t-il ?', ['Il absorbe une partie du CO₂ émis', 'Il reçoit des pluies acides', 'Il se réchauffe', 'Il reçoit des engrais azotés'], 0, 'La baisse du pH fragilise coraux et organismes à coquille calcaire.'],
            ['Que contiennent les nodules polymétalliques convoités au fond des océans ?', ['Nickel, cobalt et manganèse', 'Pétrole et gaz', 'Uranium', 'Sel et magnésium'], 0, 'Des métaux recherchés pour les batteries — leur exploitation est très contestée.'],
            ['Quel traité adopté en 2023 permet de créer des aires protégées en haute mer ?', ['Le traité BBNJ', 'La convention de Montego Bay', 'Le protocole de Kyoto', 'L’accord de Nagoya'], 0, 'Il comble un vide juridique sur 60 % de la surface de l’océan.'],
            ['L’aquaculture fournit aujourd’hui près de la moitié du poisson consommé.', ['Vrai', 'Faux'], 0, 'Avec ses propres impacts : intrants, maladies, farines de poisson.'],
            ['Quel objectif international vise la protection des espaces marins ?', ['30 % protégés d’ici 2030', '10 % d’ici 2050', '50 % d’ici 2040', '100 % de la haute mer'], 0, 'Le taux effectivement protégé et contrôlé reste très en deçà.'],
            ['Toutes les aires marines protégées existantes sont réellement surveillées.', ['Vrai', 'Faux'], 1, 'Beaucoup sont des « parcs de papier » : le classement n’emporte pas le contrôle.'],
          ],
        },
        {
          titre: 'La France : une puissance maritime ?',
          lecon: {
            titre: 'Le deuxième domaine du monde, et ses angles morts',
            cours: `La France possède le **deuxième espace maritime du monde** — environ **10,2 millions de km²** de ZEE, derrière les États-Unis. Une puissance… incomplète.

## Une ZEE d'outre-mer
**Plus de 96 %** de cette ZEE vient des **territoires ultramarins** : Polynésie française, Nouvelle-Calédonie, Terres australes, Clipperton, Wallis-et-Futuna, Saint-Pierre-et-Miquelon, La Réunion, Mayotte, Antilles, Guyane. La France est présente dans **tous les océans** — un atout qu'aucun autre pays européen n'a. Les demandes d'extension du plateau continental portent le domaine total au-delà de 11 millions de km².

## Les atouts
- Une **marine nationale** de premier plan : porte-avions à propulsion nucléaire *Charles de Gaulle*, sous-marins nucléaires, présence permanente dans l'Indo-Pacifique ;
- un armateur mondial : **CMA CGM**, parmi les trois premiers transporteurs de conteneurs ;
- une recherche océanographique reconnue (**Ifremer**) ;
- des industries : construction navale (Saint-Nazaire), offshore, câbles sous-marins (Alcatel Submarine Networks).

## Les faiblesses
- Les **ports** français décrochent : Le Havre et Marseille traitent des volumes très inférieurs à Rotterdam ou Anvers, faute d'arrière-pays connecté et de fiabilité logistique ;
- la **flotte de commerce** sous pavillon français est modeste ;
- l'immensité de la ZEE est **difficile à surveiller** : pêche illégale en Guyane, orpaillage, trafics, moyens dispersés sur trois océans.

> Conclusion nuancée, celle qu'attend le bac : la France est une **puissance maritime par son domaine et sa marine**, mais pas par son économie portuaire. Le potentiel est réel, l'exploitation partielle.`,
          },
          questions: [
            ['Quel rang mondial occupe la ZEE française ?', ['Le 2e', 'Le 1er', 'Le 5e', 'Le 10e'], 0, 'Environ 10,2 millions de km², derrière les États-Unis.'],
            ['D’où vient l’essentiel de la ZEE française ?', ['Des territoires d’outre-mer', 'De la Méditerranée', 'De la façade atlantique', 'De la mer du Nord'], 0, 'Plus de 96 % : sans l’outre-mer, la France est une puissance maritime moyenne.'],
            ['La France est présente dans tous les océans du globe.', ['Vrai', 'Faux'], 0, 'Aucun autre État européen n’a cette dispersion territoriale.'],
            ['Quel armateur français figure parmi les trois premiers mondiaux du conteneur ?', ['CMA CGM', 'Louis Dreyfus', 'Brittany Ferries', 'Bolloré Logistics'], 0, 'Un atout économique majeur du pavillon français.'],
            ['Comment se situent les ports français face à Rotterdam et Anvers ?', ['Nettement en retrait', 'Au même niveau', 'Devant eux', 'Ils n’ont pas d’activité conteneur'], 0, 'Arrière-pays mal connecté et fiabilité logistique en cause.'],
            ['Quel organisme public mène la recherche océanographique française ?', ['L’Ifremer', 'Le CNES', 'L’ONERA', 'Météo-France'], 0, 'Il est reconnu internationalement, notamment sur les grands fonds.'],
            ['L’immensité de la ZEE française est facile à surveiller.', ['Vrai', 'Faux'], 1, 'Pêche illégale, trafics, orpaillage : les moyens sont dispersés sur trois océans.'],
            ['Quel bâtiment symbolise la capacité de projection de la marine française ?', ['Le porte-avions Charles de Gaulle', 'Le Belem', 'Le Mistral', 'Le France'], 0, 'Seul porte-avions à propulsion nucléaire hors des États-Unis.'],
          ],
        },

        // ===== Chapitre 2 — Dynamiques territoriales =======================
        {
          titre: 'Des territoires inégalement intégrés dans la mondialisation',
          lecon: {
            titre: 'Centres, périphéries et angles morts',
            cours: `La mondialisation ne met pas le monde à plat : elle **hiérarchise**. Certains territoires en sont les moteurs, d'autres les fournisseurs, d'autres encore les oubliés.

## Une lecture centre / périphérie
- Les **centres d'impulsion** — Amérique du Nord, Europe occidentale, Asie orientale — concentrent capitaux, décisions, innovation. C'est l'**archipel mégalopolitain mondial** : un chapelet de métropoles mieux reliées entre elles qu'à leur propre arrière-pays.
- Les **périphéries intégrées** fournissent main-d'œuvre et matières premières et captent une partie de la valeur : pays émergents, ateliers d'Asie du Sud-Est, pays pétroliers.
- Les **périphéries en marge** restent à l'écart : la plupart des **46 pays les moins avancés (PMA)**, souvent enclavés, en conflit, ou dépendants d'un seul produit.

> Le vieux couple **Nord / Sud** ne suffit plus : la Chine est le premier exportateur mondial, et des fractures profondes traversent chaque pays, du Nord comme du Sud.

## Ce qui fait qu'un territoire s'intègre
- une **façade maritime** équipée et un arrière-pays connecté ;
- des **métropoles** dotées de services de haut niveau ;
- une **stabilité** politique et juridique attirant les **IDE** (investissements directs étrangers) ;
- une main-d'œuvre formée.

À l'inverse, l'**enclavement** (pays sans littoral), l'instabilité et la dépendance à une seule ressource marginalisent.

## Mesurer l'intégration
On croise plusieurs indicateurs : PIB par habitant, **IDH**, part dans le commerce mondial, stock d'IDE, connectivité (trafic aérien, bande passante). Aucun ne suffit seul — l'IDH d'un pays pétrolier peut masquer de très fortes inégalités internes.`,
          },
          questions: [
            ['Que désigne l’archipel mégalopolitain mondial ?', ['Le réseau des grandes métropoles mieux reliées entre elles qu’à leur arrière-pays', 'Un ensemble d’îles très peuplées', 'Les pays du G7', 'Les grands ports mondiaux'], 0, 'L’image dit l’essentiel : des îlots de richesse reliés par-dessus les territoires.'],
            ['Combien y a-t-il de pays les moins avancés (PMA) ?', ['46', '12', '80', '25'], 0, 'Ce statut ONU ouvre des aides et des tarifs préférentiels.'],
            ['La grille Nord / Sud suffit encore à décrire le monde actuel.', ['Vrai', 'Faux'], 1, 'La Chine est le premier exportateur mondial, et chaque pays est traversé de fractures internes.'],
            ['Que sont les IDE ?', ['Les investissements directs étrangers', 'Les indices de développement économique', 'Les industries de défense européennes', 'Les importations de denrées essentielles'], 0, 'Leur stock mesure l’attractivité d’un territoire.'],
            ['Quel handicap pèse sur de nombreux PMA ?', ['L’enclavement, sans accès à la mer', 'Un excès de main-d’œuvre qualifiée', 'Un climat trop tempéré', 'Une monnaie trop forte'], 0, 'Sans façade maritime, le coût d’accès au marché mondial explose.'],
            ['Un IDH élevé garantit l’absence d’inégalités internes.', ['Vrai', 'Faux'], 1, 'C’est une moyenne : un pays pétrolier peut afficher un bon IDH et de fortes disparités.'],
            ['Qu’est-ce qu’une périphérie intégrée ?', ['Un territoire qui fournit main-d’œuvre ou matières premières et capte une part de la valeur', 'Un territoire totalement à l’écart des flux', 'Une métropole de rang mondial', 'Une zone franche portuaire'], 0, 'Ateliers d’Asie du Sud-Est et pays pétroliers en sont les exemples types.'],
            ['La mondialisation tend à égaliser le développement des territoires.', ['Vrai', 'Faux'], 1, 'Elle hiérarchise : elle sélectionne les lieux qu’elle relie et laisse les autres de côté.'],
          ],
        },
        {
          titre: 'La hiérarchie des centres de décision mondiaux',
          lecon: {
            titre: 'Où se décide le monde',
            cours: `Le pouvoir économique mondial n'est pas dilué : il tient dans quelques dizaines de kilomètres carrés de bureaux.

## Les villes mondiales
Une **ville mondiale** ne se définit pas par sa taille mais par ses **fonctions de commandement** : sièges de firmes transnationales, place boursière, banques, services aux entreprises, universités, médias, culture. Le classement du **GaWC** place au sommet **New York** et **Londres**, suivies de **Tokyo**, **Paris**, **Hong Kong**, **Singapour**, **Shanghai**, **Dubaï**.

Leur cœur est le **CBD** (*central business district*), où se concentrent les tours de bureaux : Manhattan, la City et Canary Wharf, La Défense, Pudong.

## Les autres lieux de pouvoir
- **Institutions internationales** : ONU à New York, FMI et Banque mondiale à Washington, OMC et OMS à Genève, institutions européennes à Bruxelles, Strasbourg et Luxembourg.
- **Places financières** : les bourses de New York (NYSE, Nasdaq), Shanghai, Tokyo, Londres.
- **Paradis fiscaux**, qui captent une part considérable des profits déclarés.

## Une hiérarchie mouvante
La montée de l'Asie déplace le centre de gravité : Shanghai, Shenzhen, Singapour et Dubaï gagnent des rangs ; le **Brexit** a fait migrer une partie de l'activité financière de Londres vers Francfort, Amsterdam et Paris. Rien n'est acquis : une ville mondiale se maintient par ses infrastructures, son droit, ses talents et sa stabilité.

> Deux notions à ne pas confondre : la **hiérarchie** (qui commande à qui) et le **réseau** (qui est relié à qui). Une métropole peut être très peuplée et faiblement connectée — c'est le cas de plusieurs mégapoles du Sud.`,
          },
          questions: [
            ['Qu’est-ce qui définit une ville mondiale ?', ['Ses fonctions de commandement', 'Sa population totale', 'Sa superficie', 'Son ancienneté'], 0, 'Sièges sociaux, finance, services aux entreprises, médias, universités.'],
            ['Quelles deux villes dominent le classement des villes mondiales ?', ['New York et Londres', 'Tokyo et Shanghai', 'Paris et Berlin', 'Dubaï et Singapour'], 0, 'Le classement GaWC les place au sommet depuis des décennies.'],
            ['Que désigne le CBD d’une métropole ?', ['Son quartier central des affaires', 'Sa zone industrielle', 'Sa banlieue résidentielle', 'Son port de commerce'], 0, 'Manhattan, la City, La Défense, Pudong en sont des exemples.'],
            ['Où siègent le FMI et la Banque mondiale ?', ['À Washington', 'À New York', 'À Genève', 'À Bruxelles'], 0, 'L’ONU est à New York, l’OMC et l’OMS à Genève.'],
            ['Le Brexit a déplacé une partie de l’activité financière hors de Londres.', ['Vrai', 'Faux'], 0, 'Vers Francfort, Amsterdam, Dublin et Paris notamment.'],
            ['Une mégapole très peuplée est nécessairement un centre de décision mondial.', ['Vrai', 'Faux'], 1, 'Plusieurs mégapoles du Sud sont immenses et faiblement connectées aux réseaux de commandement.'],
            ['Quelle ville chinoise s’est imposée comme place financière de rang mondial ?', ['Shanghai', 'Chengdu', 'Wuhan', 'Harbin'], 0, 'Avec le quartier de Pudong comme vitrine.'],
            ['La hiérarchie des villes mondiales est figée.', ['Vrai', 'Faux'], 1, 'Elle se recompose : montée asiatique, effets du Brexit, concurrence des places européennes.'],
          ],
        },
        {
          titre: 'La France : un rayonnement international différencié et une inégale attractivité dans la mondialisation',
          lecon: {
            titre: 'Une puissance moyenne à influence globale',
            cours: `La France pèse environ **1 % de la population mondiale** et se classe autour du **7e rang** pour le PIB. Son influence dépasse pourtant largement ce poids — mais très inégalement selon les domaines et les territoires.

## Les leviers du rayonnement
- **Politique et militaire** : membre permanent du Conseil de sécurité de l'ONU avec droit de veto, puissance nucléaire, capacité de projection, second réseau diplomatique du monde ;
- **linguistique et culturel** : la **francophonie** (plus de 320 millions de locuteurs, **OIF**), les lycées français, l'Institut français, l'Alliance française ;
- **économique** : des firmes transnationales de premier plan (luxe, aéronautique, énergie, agroalimentaire) ;
- **touristique** : première destination mondiale par le nombre de visiteurs, autour de **90 à 100 millions** par an — mais des recettes inférieures à celles de l'Espagne ou des États-Unis, car les séjours y sont plus courts.

## Une attractivité très inégale à l'intérieur
L'**Île-de-France** capte la majorité des sièges sociaux, des IDE et des emplois métropolitains supérieurs. Autour, quelques métropoles tirent leur épingle du jeu (Lyon, Toulouse, Bordeaux, Nantes, Montpellier, Rennes). À l'écart : les anciens bassins industriels du Nord et de l'Est, la « diagonale des faibles densités », une partie des outre-mer.

## Les fragilités
- Un **déficit commercial** structurel et une perte de parts de marché à l'exportation ;
- une **désindustrialisation** marquée (la part de l'industrie dans le PIB a fortement reculé depuis les années 1980) ;
- une image d'attractivité pénalisée par la fiscalité et la complexité administrative, malgré de bons classements récents pour les IDE en Europe.

> La formule à retenir : la France a une **influence globale**, une **économie moyenne** et un **territoire inégalement branché** sur la mondialisation.`,
          },
          questions: [
            ['Quel siège la France occupe-t-elle à l’ONU ?', ['Un siège permanent au Conseil de sécurité', 'La présidence de l’Assemblée générale', 'Un siège tournant', 'La direction du Secrétariat'], 0, 'Avec droit de veto — un levier majeur pour une puissance moyenne.'],
            ['Combien de personnes parlent français dans le monde ?', ['Plus de 320 millions', 'Environ 70 millions', 'Environ 150 millions', 'Plus d’un milliard'], 0, 'La francophonie est un vecteur d’influence structuré par l’OIF.'],
            ['La France est la première destination touristique mondiale en nombre de visiteurs.', ['Vrai', 'Faux'], 0, 'Environ 90 à 100 millions par an — mais ses recettes sont inférieures à celles de l’Espagne.'],
            ['Quelle région capte l’essentiel des sièges sociaux et des IDE ?', ['L’Île-de-France', 'La région Sud', 'Les Hauts-de-France', 'La Bretagne'], 0, 'L’attractivité française est très concentrée autour de la capitale.'],
            ['Quel est le rang approximatif de la France pour le PIB mondial ?', ['Environ 7e', 'Environ 2e', 'Environ 15e', 'Environ 25e'], 0, 'Une économie moyenne à l’échelle mondiale, mais une influence bien supérieure.'],
            ['La balance commerciale française est structurellement excédentaire.', ['Vrai', 'Faux'], 1, 'Elle est déficitaire, et le pays perd des parts de marché à l’exportation.'],
            ['Quel réseau, second au monde, sert le rayonnement français ?', ['Le réseau diplomatique et culturel', 'Le réseau ferroviaire', 'Le réseau portuaire', 'Le réseau universitaire'], 0, 'Ambassades, instituts, lycées français et Alliances françaises.'],
            ['Tous les territoires français bénéficient également de la mondialisation.', ['Vrai', 'Faux'], 1, 'Anciens bassins industriels, diagonale des faibles densités et une partie des outre-mer restent à l’écart.'],
          ],
        },
        {
          titre: 'Coopérations économiques et tentatives de régulation',
          lecon: {
            titre: 'Gouverner un monde sans gouvernement',
            cours: `Les échanges sont mondiaux, les États restent nationaux. Toute la difficulté de la **gouvernance économique mondiale** tient dans cet écart.

## Les institutions mondiales
- L'**OMC** (créée en **1995**, successeur du GATT) fixe les règles du commerce et arbitre les litiges. Elle est aujourd'hui **paralysée** : le cycle de Doha n'a jamais abouti et son organe d'appel est bloqué depuis 2019, faute de nominations.
- Le **FMI** prête aux États en crise, sous conditions ; la **Banque mondiale** finance le développement.
- Le **G7** et le **G20** sont des forums informels : ils orientent, mais ne décident rien de contraignant.

## Les intégrations régionales
Plus efficaces parce que plus resserrées :
- **Union européenne** — la plus poussée : marché unique, monnaie, politiques communes ;
- **ACEUM** (ex-ALENA) en Amérique du Nord, **Mercosur** en Amérique du Sud, **ASEAN** en Asie du Sud-Est, **Union africaine** et sa zone de libre-échange **ZLECAf**, **RCEP** en Asie-Pacifique.

Ces ensembles vont du simple accord de libre-échange à l'union économique et monétaire.

## Réguler autre chose que le commerce
- **Climat** : les **COP**, avec l'**Accord de Paris (2015)** — engagements volontaires, sans sanction ;
- **fiscalité** : accord de l'**OCDE (2021)** sur un impôt minimum mondial de **15 %** sur les bénéfices des multinationales, pour freiner l'évasion vers les paradis fiscaux ;
- **travail** : les conventions de l'OIT, peu contraignantes.

> Le point commun de ces dispositifs : ils reposent sur le **consentement** des États. D'où leur fragilité — et le retour, ces dernières années, des mesures unilatérales.`,
          },
          questions: [
            ['En quelle année l’OMC a-t-elle été créée ?', ['1995', '1947', '1971', '2001'], 0, 'Elle succède au GATT de 1947.'],
            ['Pourquoi l’OMC est-elle aujourd’hui affaiblie ?', ['Son organe d’appel est bloqué et le cycle de Doha n’a pas abouti', 'Elle a été dissoute', 'Les États-Unis en sont sortis', 'Elle n’a plus de budget'], 0, 'Sans arbitrage effectif, les litiges commerciaux se règlent par mesures unilatérales.'],
            ['Que prévoit l’accord OCDE de 2021 sur la fiscalité ?', ['Un impôt minimum mondial de 15 % sur les multinationales', 'La suppression des paradis fiscaux', 'Une TVA mondiale', 'Une taxe sur les transactions financières'], 0, 'Objectif : réduire l’intérêt du transfert des bénéfices.'],
            ['Quelle organisation régionale est la plus intégrée au monde ?', ['L’Union européenne', 'L’ASEAN', 'Le Mercosur', 'L’ACEUM'], 0, 'Marché unique, monnaie commune et politiques communes : aucune autre ne va aussi loin.'],
            ['Le G20 prend des décisions juridiquement contraignantes.', ['Vrai', 'Faux'], 1, 'C’est un forum de coordination : il oriente sans obliger.'],
            ['Quel accord climatique repose sur des engagements volontaires des États ?', ['L’Accord de Paris (2015)', 'Le protocole de Montréal', 'La convention de Bâle', 'Le traité BBNJ'], 0, 'Aucune sanction n’est prévue en cas de non-respect.'],
            ['Comment s’appelle la zone de libre-échange continentale africaine ?', ['La ZLECAf', 'L’ASEAN', 'Le RCEP', 'La CEDEAO'], 0, 'Portée par l’Union africaine, elle vise un marché de plus d’un milliard de personnes.'],
            ['La régulation mondiale repose sur le consentement des États.', ['Vrai', 'Faux'], 0, 'C’est sa faiblesse structurelle : aucun gendarme ne peut contraindre un État souverain.'],
          ],
        },
        {
          titre: 'La mondialisation et ses limites',
          lecon: {
            titre: 'Contestations, ruptures et recompositions',
            cours: `Depuis une quinzaine d'années, la mondialisation ne progresse plus mécaniquement : elle est contestée, et elle se réorganise.

## Ce qu'on lui reproche
- Des **inégalités** : les gains ont surtout profité aux classes moyennes émergentes et aux plus riches, moins aux classes populaires des pays développés ;
- le **dumping social et environnemental** : produire là où le droit du travail et les normes sont les plus faibles ;
- les **délocalisations** et la désindustrialisation de régions entières ;
- l'**empreinte écologique** du transport et de la consommation de masse ;
- l'**uniformisation culturelle**, contestée depuis les mouvements altermondialistes (Seattle, 1999).

## Les chocs révélateurs
La **crise de 2008** a montré la contagion financière ; la **pandémie de Covid-19 (2020)** a coupé net des chaînes de valeur étirées à l'extrême — masques, médicaments, semi-conducteurs. La **guerre en Ukraine (2022)** a rappelé qu'une dépendance énergétique est une vulnérabilité politique.

## Le retour du politique
- **Guerre commerciale** entre les États-Unis et la Chine depuis 2018 : droits de douane, contrôle des exportations de technologies ;
- **relocalisations** et politiques industrielles (Inflation Reduction Act américain, plans européens sur les semi-conducteurs et les batteries) ;
- **souveraineté** devenue un mot d'ordre : alimentaire, industrielle, numérique.

> Le mot juste n'est pas « démondialisation » mais **recomposition** : le commerce mondial ne s'effondre pas, il se **régionalise** et se politise. On parle de *friend-shoring* — produire chez des partenaires jugés fiables plutôt qu'au moins cher.`,
          },
          questions: [
            ['Quel événement de 1999 marque l’essor du mouvement altermondialiste ?', ['La contestation du sommet de l’OMC à Seattle', 'La crise asiatique', 'La création de l’euro', 'Le sommet de Rio'], 0, 'Le slogan « le monde n’est pas une marchandise » y devient visible.'],
            ['Qu’a révélé la pandémie de Covid-19 sur les chaînes de valeur ?', ['Leur vulnérabilité, étirées à l’extrême', 'Leur solidité', 'Leur relocalisation déjà achevée', 'Leur indépendance vis-à-vis de la Chine'], 0, 'Masques, médicaments et semi-conducteurs ont manqué simultanément.'],
            ['La guerre commerciale entre les États-Unis et la Chine s’ouvre en…', ['2018', '2008', '2001', '2022'], 0, 'Droits de douane, puis contrôle des exportations de technologies.'],
            ['Que désigne le friend-shoring ?', ['Produire chez des partenaires jugés fiables plutôt qu’au moins cher', 'Vendre uniquement à ses voisins', 'Délocaliser vers les pays les plus pauvres', 'Fermer ses frontières commerciales'], 0, 'La sécurité d’approvisionnement passe avant le seul critère du coût.'],
            ['Le commerce mondial s’est effondré depuis 2020.', ['Vrai', 'Faux'], 1, 'Il se recompose et se régionalise : « recomposition » est plus juste que « démondialisation ».'],
            ['Qui a le moins profité des gains de la mondialisation ?', ['Les classes populaires des pays développés', 'Les classes moyennes émergentes', 'Les grandes entreprises', 'Les détenteurs de capitaux'], 0, 'C’est le socle des contestations politiques dans les pays du Nord.'],
            ['Quel événement de 2022 a rappelé qu’une dépendance énergétique est une vulnérabilité ?', ['La guerre en Ukraine', 'La crise financière', 'Le Brexit', 'La pandémie'], 0, 'L’Europe a dû reconstruire ses approvisionnements en gaz en quelques mois.'],
            ['Les politiques industrielles de relocalisation ont disparu des programmes des États.', ['Vrai', 'Faux'], 1, 'Elles reviennent en force : IRA américain, plans européens sur les semi-conducteurs et les batteries.'],
          ],
        },
        {
          titre: 'La Russie et l’Asie du Sud-Est : entre inégale intégration dans la mondialisation, coopérations et tensions',
          lecon: {
            titre: 'Deux modèles opposés d’insertion mondiale',
            cours: `Deux espaces, deux façons contraires d'entrer dans la mondialisation : par la **rente** pour la Russie, par l'**atelier** pour l'Asie du Sud-Est.

## La Russie : une puissance de rente
Premier pays du monde par la superficie, la Russie tire l'essentiel de ses devises des **hydrocarbures et des matières premières** — gaz, pétrole, blé, métaux, engrais. Cette rente finance l'État et l'armée, mais son économie reste **peu diversifiée** et son PIB est comparable à celui d'un grand pays européen.

Son intégration est **sélective** : très forte sur l'énergie, faible sur l'industrie manufacturière et les services. Les **sanctions occidentales**, engagées après l'annexion de la Crimée en **2014** puis massivement à partir de **2022**, l'ont poussée à réorienter ses exportations vers l'**Asie** — Chine et Inde en particulier — souvent avec de fortes décotes. Elle conserve des leviers : arme nucléaire, siège au Conseil de sécurité, influence en Afrique et au Moyen-Orient.

## L'Asie du Sud-Est : l'atelier qui monte
L'**ASEAN**, créée en **1967**, réunit **10 États** et plus de **650 millions d'habitants**. La région s'est insérée par les **investissements étrangers** et la sous-traitance industrielle : textile, électronique, assemblage. Elle bénéficie de sa position sur les grandes routes maritimes (Malacca) et d'une main-d'œuvre nombreuse.

Elle profite aujourd'hui du **report des chaînes de production** hors de Chine (Vietnam, Indonésie, Malaisie).

## Coopérations et tensions
- **Coopérations** : ASEAN, accords de libre-échange, **RCEP** (le plus grand accord commercial du monde), partenariats avec la Chine et le Japon ;
- **tensions** : contentieux en **mer de Chine méridionale** entre Pékin et plusieurs membres de l'ASEAN, dépendance à la Chine, très fortes **inégalités internes** — Singapour figure parmi les pays les plus riches du monde, le Laos et le Cambodge parmi les plus pauvres de la région.

> Contraste à retenir : la Russie exporte des **ressources** et subit les sanctions ; l'Asie du Sud-Est exporte du **travail industriel** et capte les relocalisations.`,
          },
          questions: [
            ['De quoi la Russie tire-t-elle l’essentiel de ses devises ?', ['Des hydrocarbures et des matières premières', 'De l’industrie automobile', 'Des services financiers', 'Du tourisme'], 0, 'Une économie de rente, peu diversifiée.'],
            ['Depuis quand la Russie fait-elle l’objet de sanctions occidentales ?', ['Depuis 2014, massivement depuis 2022', 'Depuis 1991', 'Depuis 2008', 'Depuis 2000'], 0, 'Annexion de la Crimée d’abord, invasion de l’Ukraine ensuite.'],
            ['Vers quelle région la Russie a-t-elle réorienté ses exportations d’énergie ?', ['L’Asie', 'L’Afrique', 'L’Amérique latine', 'Le Moyen-Orient'], 0, 'Vers la Chine et l’Inde surtout, souvent avec de fortes décotes.'],
            ['En quelle année l’ASEAN a-t-elle été créée ?', ['1967', '1995', '1957', '1980'], 0, 'Elle réunit aujourd’hui 10 États et plus de 650 millions d’habitants.'],
            ['Comment l’Asie du Sud-Est s’est-elle insérée dans la mondialisation ?', ['Par les investissements étrangers et la sous-traitance industrielle', 'Par l’exportation de pétrole', 'Par les services financiers', 'Par le tourisme uniquement'], 0, 'Textile, électronique et assemblage y ont attiré les capitaux.'],
            ['L’Asie du Sud-Est est un ensemble homogène sur le plan du développement.', ['Vrai', 'Faux'], 1, 'Singapour est parmi les pays les plus riches du monde, le Laos parmi les plus pauvres de la région.'],
            ['Quel accord commercial de la région est le plus vaste du monde ?', ['Le RCEP', 'L’ACEUM', 'Le Mercosur', 'La ZLECAf'], 0, 'Il associe l’ASEAN à la Chine, au Japon, à la Corée du Sud, à l’Australie et à la Nouvelle-Zélande.'],
            ['Quelle tension oppose la Chine à plusieurs membres de l’ASEAN ?', ['Le contentieux en mer de Chine méridionale', 'Le partage du Mékong uniquement', 'La monnaie commune', 'Les quotas de pêche en Arctique'], 0, 'Revendications maritimes et îlots militarisés en sont l’objet.'],
          ],
        },

        // ===== Chapitre 3 — L'Union européenne dans la mondialisation ======
        {
          titre: 'L’Union européenne : la puissance dans la diversité',
          lecon: {
            titre: 'Un géant commercial, un nain politique ?',
            cours: `L'Union européenne réunit **27 États** et environ **450 millions d'habitants**. Elle est une puissance d'un genre inédit : très forte là où elle est unie, faible là où elle ne l'est pas.

## Ce qui fait sa force
- Le **marché unique** : libre circulation des marchandises, des services, des capitaux et des personnes — le plus vaste espace économique intégré du monde ;
- la **première puissance commerciale** mondiale prise dans son ensemble ;
- l'**euro**, monnaie de 20 États et deuxième monnaie de réserve mondiale ;
- des **politiques communes** : PAC, politique de concurrence (qui sanctionne les géants du numérique), politique commerciale négociée d'une seule voix ;
- un pouvoir **normatif** considérable : le **RGPD** sur les données, les normes environnementales et sanitaires s'imposent de fait aux entreprises du monde entier qui veulent vendre en Europe. C'est l'« **effet Bruxelles** ».

## Ce qui fait sa faiblesse
- Pas d'**armée commune** ; la défense repose largement sur l'**OTAN** ;
- la politique étrangère (**PESC**) se décide à l'**unanimité** : un seul État peut bloquer ;
- une **diversité** considérable — 24 langues officielles, des niveaux de richesse allant du simple au sextuple, des cultures politiques opposées sur la dette, l'énergie ou les migrations ;
- une dépendance technologique et longtemps énergétique.

> La formule classique — « géant économique, nain politique » — est aujourd'hui à nuancer : la réponse commune à la pandémie (plan de relance emprunté en commun, 2020) et le soutien coordonné à l'Ukraine ont montré une capacité d'action qu'on ne lui prêtait plus.`,
          },
          questions: [
            ['Combien d’États membres compte l’Union européenne ?', ['27', '25', '28', '30'], 0, 'Vingt-sept depuis la sortie du Royaume-Uni.'],
            ['Qu’appelle-t-on l’« effet Bruxelles » ?', ['Le pouvoir des normes européennes à s’imposer hors de l’UE', 'La concentration des institutions à Bruxelles', 'La lenteur des décisions européennes', 'Le lobbying des entreprises'], 0, 'Toute entreprise qui veut vendre en Europe applique ses normes — RGPD en tête.'],
            ['Combien d’États utilisent l’euro ?', ['20', '27', '15', '12'], 0, 'C’est la deuxième monnaie de réserve mondiale.'],
            ['Comment se prennent les décisions de politique étrangère de l’UE ?', ['À l’unanimité', 'À la majorité simple', 'Par la Commission seule', 'Par le Parlement européen'], 0, 'Un seul État peut donc bloquer une décision commune.'],
            ['L’Union européenne dispose d’une armée commune.', ['Vrai', 'Faux'], 1, 'La défense collective de ses membres repose largement sur l’OTAN.'],
            ['Quel règlement européen s’est imposé mondialement en matière de données ?', ['Le RGPD', 'Le DSA', 'La directive Bolkestein', 'Le pacte de stabilité'], 0, 'Il est devenu la référence pour la protection des données personnelles.'],
            ['Combien de langues officielles compte l’Union européenne ?', ['24', '10', '27', '15'], 0, 'La diversité linguistique est à la fois une richesse et un coût de fonctionnement.'],
            ['L’UE a emprunté en commun pour financer un plan de relance en 2020.', ['Vrai', 'Faux'], 0, 'Une rupture majeure, longtemps jugée impossible.'],
          ],
        },
        {
          titre: 'Des défis à relever qui fragilisent l’UE',
          lecon: {
            titre: 'Quinze ans de crises',
            cours: `Depuis 2008, l'Union avance de crise en crise. Chacune l'a fragilisée — et, à chaque fois, l'a aussi obligée à se doter d'outils nouveaux.

## La crise de la dette (2010-2015)
Déclenchée par la **Grèce**, elle révèle qu'une monnaie unique sans budget commun est instable. Réponses : mécanisme européen de stabilité, intervention de la **BCE** (« *whatever it takes* », 2012), règles budgétaires renforcées. Coût politique : austérité, ressentiment durable dans les pays du Sud.

## La crise migratoire (2015)
Plus d'un million d'arrivées en une année, principalement de Syriens. Le **règlement de Dublin**, qui fait peser la demande d'asile sur le pays d'entrée, fait porter la charge à la Grèce et à l'Italie. Les désaccords sur la répartition n'ont jamais été vraiment surmontés ; **Frontex** est renforcée, un pacte sur la migration et l'asile adopté en 2024.

## Le Brexit (2016-2020)
Le référendum du **23 juin 2016** (51,9 % pour la sortie) aboutit à la sortie effective le **31 janvier 2020**. Premier retrait de l'histoire de la construction européenne : l'Union perd un membre majeur, mais l'adhésion à l'UE remonte dans les autres États.

## L'État de droit
La **Pologne** et la **Hongrie** ont été visées par la procédure de l'**article 7** et par la conditionnalité budgétaire : indépendance de la justice, liberté des médias, droits des minorités. Question de fond : que faire d'un membre qui s'éloigne des valeurs qu'il a signées ?

## La guerre en Ukraine (depuis 2022)
Elle a révélé la dépendance au **gaz russe**, provoqué une crise énergétique et inflationniste, poussé à l'accueil de millions de réfugiés, relancé les questions de défense et rouvert le dossier de l'**élargissement** (statut de candidat pour l'Ukraine et la Moldavie).

> Deux limites structurelles reviennent à chaque crise : un **budget minuscule** (environ 1 % du revenu national brut de l'Union) et des décisions **lentes**, prises à 27.`,
          },
          questions: [
            ['Quel pays déclenche la crise de la dette en 2010 ?', ['La Grèce', 'L’Espagne', 'L’Italie', 'L’Irlande'], 0, 'Elle révèle l’instabilité d’une monnaie unique sans budget commun.'],
            ['Que prévoit le règlement de Dublin ?', ['La demande d’asile est traitée par le pays d’entrée', 'Une répartition égale des demandeurs entre États', 'La fermeture des frontières extérieures', 'Le financement de Frontex'], 0, 'D’où la charge disproportionnée sur la Grèce et l’Italie.'],
            ['Quand le Royaume-Uni est-il effectivement sorti de l’UE ?', ['Le 31 janvier 2020', 'Le 23 juin 2016', 'Le 1er janvier 2021', 'En décembre 2019'], 0, 'Le référendum date de 2016, la sortie effective de 2020.'],
            ['Quelle procédure vise un État membre qui s’écarte de l’État de droit ?', ['L’article 7 du traité sur l’UE', 'L’article 50', 'La procédure de déficit excessif', 'La clause de sauvegarde'], 0, 'Complétée depuis par la conditionnalité budgétaire.'],
            ['Le Brexit a entraîné une chute du soutien à l’UE dans les autres États membres.', ['Vrai', 'Faux'], 1, 'C’est l’inverse : l’adhésion à l’Union y a plutôt progressé.'],
            ['Quel budget représente l’Union européenne ?', ['Environ 1 % du revenu national brut de l’Union', 'Environ 10 %', 'Environ 25 %', 'Environ 5 %'], 0, 'Un budget très faible au regard de l’ampleur des missions attendues.'],
            ['La guerre en Ukraine a rouvert le dossier de l’élargissement.', ['Vrai', 'Faux'], 0, 'L’Ukraine et la Moldavie ont obtenu le statut de pays candidat.'],
            ['Quelle agence européenne gère la surveillance des frontières extérieures ?', ['Frontex', 'Europol', 'Eurojust', 'Eurostat'], 0, 'Ses moyens ont été fortement renforcés après 2015.'],
          ],
        },
        {
          titre: 'L’Union européenne : entre inégalités territoriales et concurrence mondiale',
          lecon: {
            titre: 'Une mégalopole, des périphéries, deux rivaux',
            cours: `L'Union est un espace **très inégal** à l'intérieur, et **pris en tenaille** à l'extérieur entre les États-Unis et la Chine.

## Un cœur et des marges
La richesse se concentre sur une **dorsale** allant du sud de l'Angleterre à l'Italie du Nord, par le Benelux, la vallée du Rhin et la Suisse : la **mégalopole européenne**. Elle rassemble les grandes métropoles, les ports du Northern Range et les régions industrielles les plus productives.

Autour : des périphéries plus pauvres — Europe du Sud, Europe centrale et orientale, régions rurales, anciens bassins industriels. Les écarts sont considérables : le PIB par habitant du **Luxembourg** est plusieurs fois supérieur à celui de la **Bulgarie**. Les **régions ultrapériphériques** (dont les DROM français) cumulent éloignement et étroitesse de marché.

## L'outil : la politique de cohésion
Environ **un tiers du budget** européen y est consacré, via le **FEDER**, le **FSE+** et le Fonds de cohésion. Objectif : réduire les écarts en finançant infrastructures, formation, innovation. Bilan : réel rattrapage des pays d'Europe centrale depuis 2004, mais creusement des écarts **à l'intérieur** de chaque pays, entre métropoles et espaces en marge.

## La concurrence externe
- Les **États-Unis** attirent les investissements avec l'**Inflation Reduction Act** (2022), massif système de subventions industrielles ;
- la **Chine** exporte massivement véhicules électriques, panneaux solaires et batteries, avec un soutien public de long terme ;
- l'UE répond par des plans sur les **semi-conducteurs**, les **batteries** et les matières premières critiques, et par des instruments de défense commerciale.

## La concurrence interne
Elle existe aussi entre membres : **dumping fiscal** (Irlande, Luxembourg), **travailleurs détachés**, concurrence pour attirer les sièges sociaux. C'est l'une des critiques récurrentes adressées au marché unique.`,
          },
          questions: [
            ['Comment appelle-t-on la dorsale la plus riche de l’Europe ?', ['La mégalopole européenne', 'La Northern Range', 'L’arc atlantique', 'La banane verte'], 0, 'Du sud de l’Angleterre à l’Italie du Nord, par le Benelux et la vallée du Rhin.'],
            ['Quelle part du budget européen va à la politique de cohésion ?', ['Environ un tiers', 'Environ 5 %', 'Environ deux tiers', 'Environ 10 %'], 0, 'Via le FEDER, le FSE+ et le Fonds de cohésion.'],
            ['Que sont les régions ultrapériphériques ?', ['Des régions éloignées du continent, dont les DROM français', 'Les régions frontalières de l’Est', 'Les régions rurales de faible densité', 'Les régions candidates à l’adhésion'], 0, 'Éloignement et étroitesse du marché y justifient un statut particulier.'],
            ['Quel dispositif américain de 2022 concurrence l’industrie européenne ?', ['L’Inflation Reduction Act', 'Le CHIPS Act européen', 'Le Buy American Act de 1933', 'Le plan Marshall'], 0, 'Un système massif de subventions qui attire les investissements industriels.'],
            ['La politique de cohésion a supprimé les inégalités à l’intérieur des pays membres.', ['Vrai', 'Faux'], 1, 'Le rattrapage entre pays est réel, mais les écarts internes se creusent.'],
            ['Quel pays est régulièrement cité pour son dumping fiscal au sein de l’UE ?', ['L’Irlande', 'La Grèce', 'La Pologne', 'Le Portugal'], 0, 'Une concurrence fiscale interne critiquée dès qu’on parle de marché unique.'],
            ['Sur quels produits la Chine concurrence-t-elle fortement l’industrie européenne ?', ['Véhicules électriques, panneaux solaires et batteries', 'Produits agricoles', 'Services financiers', 'Tourisme'], 0, 'Un soutien public de long terme y a bâti des filières dominantes.'],
            ['Le PIB par habitant est comparable dans tous les États membres.', ['Vrai', 'Faux'], 1, 'Celui du Luxembourg est plusieurs fois supérieur à celui de la Bulgarie.'],
          ],
        },
        {
          titre: 'Les transports, outils d’ouverture, de cohésion et de compétitivité de l’UE',
          lecon: {
            titre: 'Relier pour unir',
            cours: `Un marché unique sans réseaux n'est qu'une déclaration. Les transports sont l'infrastructure matérielle de l'intégration européenne.

## Le réseau transeuropéen (RTE-T)
L'UE finance et coordonne des **corridors** prioritaires reliant les grandes régions économiques : Rhin-Alpes, Atlantique, Mer du Nord-Méditerranée… L'objectif est triple :
- **ouverture** sur le monde par les grands ports et aéroports ;
- **cohésion** en désenclavant les périphéries ;
- **compétitivité** par la fluidité et la baisse des coûts.

## Les infrastructures emblématiques
- Les **ports du Northern Range** (Rotterdam, Anvers, Hambourg, Le Havre), portes d'entrée des marchandises ;
- les **grands axes fluviaux** : Rhin, Danube, canal Seine-Nord Europe en construction ;
- les **tunnels alpins** : tunnel de base du **Saint-Gothard** (le plus long du monde), liaison **Lyon-Turin** en chantier ;
- le réseau de **lignes à grande vitesse**, dense en France, en Espagne et en Allemagne, quasi absent à l'est ;
- les **hubs aéroportuaires** : Francfort, Amsterdam-Schiphol, Paris-CDG, Madrid.

## Circulation des personnes
L'**espace Schengen** supprime les contrôles aux frontières intérieures ; **Erasmus+** fait circuler chaque année des centaines de milliers d'étudiants. La mobilité est l'un des acquis les plus concrets de l'Union pour les citoyens.

## Les limites
- Le réseau reste **inégal** : les périphéries orientales et méridionales sont moins bien desservies ;
- le **fret ferroviaire** stagne face à la route, malgré l'objectif de **report modal** ;
- le transport représente une part importante des émissions de CO₂ de l'Union, ce qui met en tension l'objectif de fluidité et l'objectif climatique ;
- les grands projets sont **lents et coûteux** (le Lyon-Turin est débattu depuis les années 1990).`,
          },
          questions: [
            ['Que désigne le RTE-T ?', ['Le réseau transeuropéen de transport', 'Le régime des taxes européennes', 'Le registre des transporteurs', 'Le tarif extérieur commun'], 0, 'Il coordonne des corridors prioritaires entre régions économiques.'],
            ['Quels sont les trois objectifs du réseau de transport européen ?', ['Ouverture, cohésion, compétitivité', 'Sécurité, rentabilité, rapidité', 'Écologie, tourisme, emploi', 'Défense, énergie, agriculture'], 0, 'Désenclaver les périphéries autant que relier les centres.'],
            ['Quel tunnel alpin est le plus long du monde ?', ['Le tunnel de base du Saint-Gothard', 'Le tunnel du Mont-Blanc', 'Le tunnel du Fréjus', 'Le Lyon-Turin'], 0, 'Il illustre l’effort européen de report du fret vers le rail.'],
            ['Que supprime l’espace Schengen ?', ['Les contrôles aux frontières intérieures', 'Les droits de douane', 'Les visas pour les pays tiers', 'Les contrôles douaniers extérieurs'], 0, 'C’est l’un des acquis les plus concrets pour les citoyens.'],
            ['Le réseau à grande vitesse est aussi dense à l’est qu’à l’ouest de l’Union.', ['Vrai', 'Faux'], 1, 'Il est dense en France, en Espagne et en Allemagne, quasi absent à l’est.'],
            ['Quel programme européen fait circuler les étudiants ?', ['Erasmus+', 'Horizon Europe', 'Interreg', 'LEADER'], 0, 'Des centaines de milliers de mobilités chaque année.'],
            ['Le report modal de la route vers le rail est aujourd’hui atteint dans l’UE.', ['Vrai', 'Faux'], 1, 'Le fret ferroviaire stagne face à la route, malgré l’objectif affiché.'],
            ['Quel grand canal est en construction dans le nord de la France ?', ['Le canal Seine-Nord Europe', 'Le canal du Midi', 'Le canal de Suez', 'Le canal Rhin-Rhône'], 0, 'Il doit relier le bassin de la Seine au réseau fluvial du nord de l’Europe.'],
          ],
        },
        {
          titre: 'La France et ses territoires transfrontaliers',
          lecon: {
            titre: 'Vivre d’un côté, travailler de l’autre',
            cours: `La France a des frontières terrestres avec **huit pays** (Belgique, Luxembourg, Allemagne, Suisse, Italie, Espagne, Andorre, Monaco), sans compter la frontière avec le Brésil et le Suriname en Guyane. Ces marges ne sont plus des lignes de séparation, mais des **espaces de vie**.

## Le travail frontalier
Plus de **400 000 personnes** résidant en France travaillent dans un pays voisin — vers la **Suisse** (Genève, Bâle), le **Luxembourg**, la **Belgique**, l'**Allemagne**, **Monaco**. Le moteur est l'**écart de salaires** : un même emploi peut être payé bien davantage de l'autre côté, tandis que le logement reste moins cher côté français.

## Les effets sur le territoire
- **Positifs** : revenus élevés injectés dans l'économie locale, dynamisme démographique, chômage plus faible ;
- **négatifs** : flambée des prix du logement près des frontières, congestion routière aux heures de pointe, pénurie de main-d'œuvre côté français (les hôpitaux et les entreprises perdent leurs salariés au profit du voisin), fiscalité complexe.

## Des espaces institués
Des structures organisent cette vie commune :
- les **eurométropoles** et agglomérations transfrontalières : **Lille**-Courtrai-Tournai, **Strasbourg**-Kehl, **Bâle**-Saint-Louis, Genève-Annemasse ;
- les **GECT** (groupements européens de coopération territoriale), qui permettent à des collectivités de deux pays de gérer ensemble un équipement — hôpital, tramway, zone d'activité ;
- le programme européen **Interreg**, qui finance ces coopérations.

> Ce que ces territoires prouvent : l'intégration européenne se mesure moins dans les traités que dans un **tramway qui traverse le Rhin** ou un hôpital utilisé par deux nationalités.`,
          },
          questions: [
            ['Avec combien de pays la France a-t-elle une frontière terrestre en Europe ?', ['Huit', 'Cinq', 'Trois', 'Dix'], 0, 'Sans compter le Brésil et le Suriname, frontaliers de la Guyane.'],
            ['Combien de résidents français travaillent dans un pays voisin ?', ['Plus de 400 000', 'Environ 50 000', 'Environ 1 million', 'Environ 20 000'], 0, 'Surtout vers la Suisse, le Luxembourg, la Belgique et l’Allemagne.'],
            ['Quel est le principal moteur du travail frontalier ?', ['L’écart de salaires', 'La langue commune', 'La qualité des transports', 'La fiscalité française'], 0, 'On habite où le logement est abordable, on travaille où le salaire est élevé.'],
            ['Que permet un GECT ?', ['À des collectivités de deux pays de gérer ensemble un équipement', 'De supprimer les contrôles douaniers', 'D’harmoniser les impôts', 'De créer une région européenne autonome'], 0, 'Hôpital, tramway ou zone d’activité gérés en commun.'],
            ['Le travail frontalier n’a que des effets positifs sur les territoires français.', ['Vrai', 'Faux'], 1, 'Il fait flamber les prix du logement et prive les employeurs locaux de main-d’œuvre.'],
            ['Quel programme européen finance les coopérations transfrontalières ?', ['Interreg', 'Erasmus+', 'LEADER', 'Horizon Europe'], 0, 'Il soutient projets, équipements et structures communes.'],
            ['Quelle agglomération française forme une eurométropole avec Courtrai et Tournai ?', ['Lille', 'Strasbourg', 'Metz', 'Nice'], 0, 'Un bassin de vie transfrontalier de plus de deux millions d’habitants.'],
            ['Les frontières françaises sont aujourd’hui de simples lignes de séparation.', ['Vrai', 'Faux'], 1, 'Ce sont des espaces de vie quotidienne, organisés par des institutions communes.'],
          ],
        },

        // ===== Chapitre 4 — La France et ses régions =======================
        {
          titre: 'Les lignes de force du territoire français',
          lecon: {
            titre: 'Ce qui structure la France',
            cours: `Derrière la diversité des paysages, quelques **lignes de force** organisent le territoire français. Les repérer, c'est savoir lire n'importe quelle carte de France.

## La macrocéphalie parisienne
L'**Île-de-France** rassemble environ **19 % de la population** et produit près de **31 % du PIB** national. Elle concentre les sièges sociaux, la recherche, les hubs aériens et ferroviaires. Aucun autre pays européen comparable ne connaît un tel écart entre sa capitale et ses autres villes.

## La métropolisation
La croissance se concentre dans une quinzaine de grandes aires urbaines : Lyon, Marseille-Aix, Toulouse, Bordeaux, Lille, Nantes, Montpellier, Rennes, Strasbourg… Elles captent les emplois qualifiés, les étudiants, les investissements. Autour d'elles s'étend un vaste **périurbain**, produit de la voiture et du coût du logement.

## La diagonale des faibles densités
Des Ardennes au sud du Massif central et jusqu'aux Landes court une bande de faible densité, vieillissement et déprise — longtemps appelée « diagonale du vide », terme trompeur : ces espaces ne sont pas vides, ils sont **peu denses** et souvent en difficulté d'accès aux services.

## La littoralisation
Population et activités se déplacent vers les côtes, surtout **atlantique** et **méditerranéenne** : héliotropisme, tourisme, retraites, activités portuaires. Cette attractivité crée ses tensions — prix du foncier, artificialisation, risque de submersion.

## Les axes et les façades
- Axes majeurs : **vallée du Rhône** (Paris-Lyon-Marseille), **vallée de la Seine** (Paris-Rouen-Le Havre), sillon lorrain, arc atlantique ;
- **façades maritimes** : Manche-mer du Nord, Atlantique, Méditerranée ;
- **frontières dynamiques** à l'est et au nord (voir les territoires transfrontaliers).

## Les outre-mer
Éloignés, insulaires pour la plupart, dans trois océans : forte croissance démographique aux Antilles et en Guyane pour partie, chômage élevé, dépendance aux importations, mais atouts majeurs (ZEE, biodiversité, spatial en Guyane).`,
          },
          questions: [
            ['Quelle part du PIB français produit l’Île-de-France ?', ['Environ 31 %', 'Environ 15 %', 'Environ 50 %', 'Environ 20 %'], 0, 'Pour environ 19 % de la population : une macrocéphalie sans équivalent proche en Europe.'],
            ['Qu’est-ce que la diagonale des faibles densités ?', ['Une bande peu peuplée des Ardennes aux Landes', 'La frontière avec l’Allemagne', 'Le littoral atlantique', 'La vallée du Rhône'], 0, 'Le terme « diagonale du vide » est trompeur : ces espaces sont peu denses, pas vides.'],
            ['Que désigne l’héliotropisme ?', ['L’attirance des populations vers les régions ensoleillées', 'La culture sous serre', 'Le tourisme de montagne', 'La migration vers les villes'], 0, 'Il alimente la littoralisation du Sud et de l’Ouest.'],
            ['Quel axe majeur relie Paris à Marseille ?', ['La vallée du Rhône', 'La vallée de la Seine', 'Le sillon lorrain', 'L’arc atlantique'], 0, 'Autoroute, LGV et fleuve y superposent leurs tracés.'],
            ['La périurbanisation résulte notamment du coût du logement et de l’usage de la voiture.', ['Vrai', 'Faux'], 0, 'Elle étale les aires urbaines bien au-delà des villes-centres.'],
            ['Dans combien d’océans la France d’outre-mer est-elle présente ?', ['Trois', 'Un', 'Deux', 'Quatre'], 0, 'Atlantique, Indien et Pacifique — d’où l’immensité de la ZEE.'],
            ['La croissance économique française est répartie également sur le territoire.', ['Vrai', 'Faux'], 1, 'Elle se concentre dans une quinzaine de grandes aires urbaines et sur les littoraux.'],
            ['Quelle façade maritime porte les ports de Rouen et du Havre ?', ['La façade Manche-mer du Nord', 'La façade atlantique', 'La façade méditerranéenne', 'La façade guyanaise'], 0, 'Elle prolonge l’axe de la vallée de la Seine.'],
          ],
        },
        {
          titre: 'Les recompositions territoriales en France',
          lecon: {
            titre: 'Un territoire qu’on redécoupe et qu’on rééquilibre',
            cours: `Depuis dix ans, la carte administrative et les dynamiques sociales du territoire français ont été profondément retouchées.

## Les réformes institutionnelles
- **2014, loi MAPTAM** : création du statut de **métropole** — 21 aujourd'hui, dont les métropoles à statut particulier du Grand Paris, de Lyon et d'Aix-Marseille ;
- **2015-2016** : les régions métropolitaines passent de **22 à 13**, avec des ensembles vastes (Nouvelle-Aquitaine, Occitanie, Grand Est) censés atteindre une taille européenne. La réforme reste contestée : identités mal reconnues, éloignement des centres de décision ;
- montée en puissance des **intercommunalités**, qui exercent aujourd'hui l'essentiel des compétences d'aménagement du quotidien.

## Les recompositions sociales et spatiales
- Les **métropoles** concentrent les emplois qualifiés, et connaissent une forte **gentrification** de leurs centres : les ménages modestes sont repoussés vers le périurbain lointain ;
- les **villes moyennes** ont vu leurs centres se dévitaliser (commerces vacants), d'où les programmes « Action cœur de ville » ;
- les anciens **bassins industriels** (Nord, Lorraine, Saint-Étienne) reconvertissent leurs friches, avec des réussites inégales ;
- certains espaces ruraux se **repeuplent** (néoruraux, télétravail accéléré depuis 2020), d'autres continuent de se vider.

## L'aménagement aujourd'hui
L'**ANCT** (Agence nationale de la cohésion des territoires, 2020) pilote les politiques de rééquilibrage. Deux impératifs récents pèsent sur tous les projets :
- le **ZAN** (zéro artificialisation nette), qui vise à stopper l'étalement urbain ;
- l'**accès aux services** : santé (déserts médicaux), transports, numérique (plan très haut débit).

> Le fil conducteur : depuis les années 1960, l'aménagement est passé d'une logique de **rééquilibrage volontariste** (« Paris et le désert français ») à une logique de **compétitivité des métropoles** — puis, depuis peu, à un retour de la question des territoires laissés de côté.`,
          },
          questions: [
            ['De combien de régions métropolitaines la France est-elle passée en 2016 ?', ['De 22 à 13', 'De 26 à 18', 'De 13 à 22', 'De 20 à 15'], 0, 'Des ensembles plus vastes, censés atteindre une taille européenne.'],
            ['Quelle loi de 2014 crée le statut de métropole ?', ['La loi MAPTAM', 'La loi NOTRe', 'La loi SRU', 'La loi Chevènement'], 0, 'On compte aujourd’hui 21 métropoles, dont trois à statut particulier.'],
            ['Que vise le ZAN ?', ['Zéro artificialisation nette des sols', 'Zéro accident sur les routes', 'Zone d’activité nationale', 'Zéro apport nutritif'], 0, 'Il contraint désormais tous les projets d’aménagement.'],
            ['Quel programme cible la dévitalisation des centres de villes moyennes ?', ['Action cœur de ville', 'Grand Paris Express', 'Territoires zéro chômeur', 'Plan très haut débit'], 0, 'Il répond aux commerces vacants et à la vacance des logements de centre-ville.'],
            ['La gentrification des centres métropolitains repousse les ménages modestes vers le périurbain.', ['Vrai', 'Faux'], 0, 'C’est l’un des mécanismes des fractures territoriales récentes.'],
            ['Quelle agence pilote depuis 2020 la cohésion des territoires ?', ['L’ANCT', 'La DATAR', 'L’ADEME', 'L’INSEE'], 0, 'Elle succède notamment à la DATAR dans le rôle d’aménageur.'],
            ['Tous les espaces ruraux français se dépeuplent.', ['Vrai', 'Faux'], 1, 'Certains se repeuplent — néoruraux, télétravail — pendant que d’autres continuent de se vider.'],
            ['Quelle évolution a connue la doctrine d’aménagement depuis les années 1960 ?', ['Du rééquilibrage volontariste à la compétitivité des métropoles', 'De la compétitivité au rééquilibrage', 'Aucune évolution notable', 'De l’industrialisation à la ruralisation'], 0, 'Avec, depuis peu, un retour de la question des territoires en marge.'],
          ],
        },
        {
          titre: 'L’intégration de la France en Europe et dans le monde',
          lecon: {
            titre: 'Ancrée en Europe, présente partout',
            cours: `La France est à la fois profondément **européanisée** et présente sur tous les continents. Les deux dimensions se renforcent — et se contredisent parfois.

## L'ancrage européen
- Membre **fondateur** de la CECA (1951) et de la CEE (1957), de la zone **euro** et de l'espace **Schengen** ;
- environ **60 % de son commerce extérieur** se fait avec les autres États membres de l'UE : l'Allemagne est de très loin son premier partenaire ;
- ses régions frontalières vivent au rythme du voisin (travail frontalier, eurométropoles) ;
- ses agriculteurs sont les premiers bénéficiaires de la **PAC** en volume.

## La présence mondiale
- Un **domaine maritime** de rang mondial et des territoires dans trois océans ;
- des **forces prépositionnées** et des bases (Djibouti, Émirats arabes unis, Antilles, Pacifique) ;
- un **réseau diplomatique et culturel** au deuxième rang mondial ;
- des **firmes transnationales** de premier plan et un **tourisme** international record.

## Les portes d'entrée du territoire
Les flux passent par des **interfaces** : hubs aériens (**Roissy-CDG**), ports (Le Havre, Marseille-Fos, Dunkerque), tunnel sous la Manche, gares de LGV internationales. Ces nœuds font de quelques points du territoire les vrais points de contact avec le monde.

## Les limites de l'intégration
- Un **déficit commercial** persistant et des parts de marché en recul, y compris en Europe ;
- une dépendance à des chaînes de valeur extérieures (électronique, médicaments) mise en lumière depuis 2020 ;
- des **inégalités internes** : quelques métropoles et façades sont branchées sur le monde, d'autres territoires en sont largement déconnectés.

> À retenir : la France est intégrée **à l'Europe par ses échanges** et **au monde par son histoire, son domaine et sa diplomatie** — mais la mondialisation ne touche pas tous ses territoires de la même façon.`,
          },
          questions: [
            ['Quelle part du commerce extérieur français se fait avec l’Union européenne ?', ['Environ 60 %', 'Environ 20 %', 'Environ 90 %', 'Environ 35 %'], 0, 'L’Allemagne est de très loin le premier partenaire commercial.'],
            ['De quelle organisation la France est-elle membre fondateur en 1957 ?', ['La CEE', 'L’OTAN', 'L’ONU', 'L’OMC'], 0, 'Après la CECA en 1951 : l’ancrage européen est ancien et constitutif.'],
            ['Quel aéroport constitue le principal hub français ?', ['Paris-Charles-de-Gaulle', 'Nice-Côte d’Azur', 'Lyon-Saint-Exupéry', 'Marseille-Provence'], 0, 'C’est l’une des grandes portes d’entrée du territoire.'],
            ['Où la France dispose-t-elle de forces prépositionnées ?', ['À Djibouti et aux Émirats arabes unis notamment', 'Uniquement en métropole', 'Seulement en Afrique de l’Ouest', 'Uniquement dans l’Union européenne'], 0, 'S’y ajoutent les Antilles et le Pacifique : une présence sur trois océans.'],
            ['La France conserve ses parts de marché à l’exportation en Europe.', ['Vrai', 'Faux'], 1, 'Elles reculent, et le déficit commercial est persistant.'],
            ['Quelle politique européenne bénéficie le plus aux agriculteurs français en volume ?', ['La PAC', 'La politique de cohésion', 'Le FSE+', 'Le programme LIFE'], 0, 'La France en est la première bénéficiaire en montants.'],
            ['La mondialisation touche uniformément tous les territoires français.', ['Vrai', 'Faux'], 1, 'Quelques métropoles et façades y sont branchées ; d’autres espaces en sont largement déconnectés.'],
            ['Qu’est-ce qu’une interface dans le vocabulaire géographique ?', ['Une zone de contact entre deux espaces, où passent les flux', 'Une frontière fermée', 'Un centre-ville rénové', 'Une zone industrielle'], 0, 'Ports, aéroports et gares internationales en sont les exemples types.'],
          ],
        },
        {
          titre: 'La région Occitanie, entre attractivité, concurrence et inégalité',
          lecon: {
            titre: 'Une région qui gagne des habitants, et des écarts',
            cours: `L'Occitanie est née en **2016** de la fusion de **Midi-Pyrénées** et du **Languedoc-Roussillon**. Avec environ **6 millions d'habitants** et **13 départements**, elle s'étend des Pyrénées au Massif central, de la Méditerranée à la Garonne.

## L'attractivité
C'est l'une des régions **les plus attractives de France** : de l'ordre de **+50 000 habitants par an**, l'essentiel venant du **solde migratoire** — héliotropisme, cadre de vie, littoral, coût du logement encore inférieur à celui de la région Sud. Les arrivées se concentrent sur **Toulouse**, **Montpellier** et la bande littorale.

## Deux moteurs métropolitains
- **Toulouse** : capitale mondiale de l'**aéronautique** (Airbus et ses sous-traitants), spatial (CNES), recherche et université. C'est le premier pôle industriel de la région et l'un des plus dynamiques de France.
- **Montpellier** : santé, biotechnologies, numérique, université ; une croissance démographique parmi les plus fortes du pays.

S'y ajoutent la **viticulture** (premier vignoble de France en surface), le **tourisme** (littoral, Pyrénées, patrimoine), l'agroalimentaire et les énergies renouvelables.

## Les inégalités internes
Le revers de l'attractivité :
- un **chômage** durablement supérieur à la moyenne nationale, surtout sur le littoral languedocien ;
- de forts contrastes entre les deux métropoles et les départements ruraux — **Lozère**, **Aveyron**, **Gers**, **Ariège** — peu denses, vieillissants, éloignés des services ;
- une opposition **littoral / arrière-pays** : le premier se sature et voit ses prix flamber, le second peine à retenir ses jeunes ;
- des enjeux d'**accessibilité** : la LGV vers Toulouse est attendue de longue date ; les liaisons est-ouest restent lentes.

> L'Occitanie est un cas d'école : une région **attractive** n'est pas pour autant une région **homogène**. Croissance démographique et chômage élevé y coexistent — parce qu'on y vient pour le cadre de vie autant que pour l'emploi.`,
          },
          questions: [
            ['De quelle fusion l’Occitanie est-elle née en 2016 ?', ['Midi-Pyrénées et Languedoc-Roussillon', 'Aquitaine et Midi-Pyrénées', 'Provence et Languedoc', 'Auvergne et Rhône-Alpes'], 0, 'Treize départements, des Pyrénées au Massif central.'],
            ['Quel est le principal moteur de la croissance démographique en Occitanie ?', ['Le solde migratoire', 'Le solde naturel', 'L’immigration internationale seule', 'Le retour des expatriés'], 0, 'Environ +50 000 habitants par an, venus surtout d’autres régions.'],
            ['Quelle filière industrielle domine à Toulouse ?', ['L’aéronautique et le spatial', 'La chimie', 'Le textile', 'L’automobile'], 0, 'Airbus, ses sous-traitants et le CNES en font le premier pôle régional.'],
            ['Quelle métropole d’Occitanie est spécialisée dans la santé et le numérique ?', ['Montpellier', 'Nîmes', 'Perpignan', 'Albi'], 0, 'Avec l’une des plus fortes croissances démographiques du pays.'],
            ['L’Occitanie a un taux de chômage inférieur à la moyenne nationale.', ['Vrai', 'Faux'], 1, 'Il lui est durablement supérieur, surtout sur le littoral languedocien.'],
            ['Quels départements illustrent les espaces peu denses de la région ?', ['La Lozère et l’Aveyron', 'L’Hérault et la Haute-Garonne', 'Le Gard et les Pyrénées-Orientales', 'Le Tarn et l’Aude uniquement'], 0, 'Faible densité, vieillissement et éloignement des services y dominent.'],
            ['Quelle production agricole place l’Occitanie au premier rang français en surface ?', ['La viticulture', 'La culture du blé', 'L’élevage bovin', 'La production de maïs'], 0, 'Le vignoble languedocien est le plus vaste de France.'],
            ['Une région attractive est nécessairement une région homogène.', ['Vrai', 'Faux'], 1, 'L’Occitanie cumule croissance démographique et chômage élevé, métropoles dynamiques et arrière-pays fragiles.'],
          ],
        },
      ],
    },
  ],
}
