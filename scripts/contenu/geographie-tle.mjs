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
// ⚠️ DOUBLON CONNU, RÉGLÉ DEPUIS par la migration 246 (`histoire-tle-1-6.mjs`),
// qui supprime les 5 chapitres hérités — les deux doublons compris — et pose
// l'axe des 20 fiches ci-dessous. Le constat d'origine : « Mers et océans dans la mondialisation »
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
            cours: `Un chiffre suffit à poser le décor : environ **80 % du commerce mondial en volume** voyage par la mer. La mondialisation n’est pas d’abord numérique — elle est **maritime**.

## La révolution du conteneur
Inventé par **Malcom McLean en 1956**, le conteneur standardise le transport : la même boîte passe du camion au train et au navire **sans être ouverte**.

| Ce qui change | La conséquence |
| Le coût du transport s’effondre | Il devient rentable de produire à 15 000 km du consommateur |
| Le temps d’escale s’effondre | Un navire passe sa vie en mer, plus à quai |
| L’unité de compte devient l’**EVP** | Les plus grands porte-conteneurs en portent plus de **20 000** |

> Sans conteneurisation, pas de division internationale du travail : c’est une **innovation logistique** qui a rendu possible l’atelier du monde.

## Les routes et les points de passage
Les flux relient trois grandes façades maritimes : **Asie orientale**, **Europe du Nord-Ouest** (la *Northern Range*, de Hambourg au Havre), **Amérique du Nord**. Ils passent par des **points de passage obligés**.

| Passage | Ce qu’il relie |
| Canal de **Suez** | Europe et Asie |
| Canal de **Panama** | Atlantique et Pacifique |
| Détroit de **Malacca** | Océan Indien et mer de Chine |
| Détroit d’**Ormuz** | Le golfe arabo-persique et le monde |
| **Gibraltar**, **Bosphore** | L’entrée et la sortie de la Méditerranée |

Un incident y bloque le commerce mondial : l’échouage de l’*Ever Given* dans le canal de Suez, en 2021, l’a rappelé en **six jours**.

## Les hubs
Les ports mondiaux ne sont pas de simples quais : ce sont des **hubs** où les cargaisons sont éclatées vers des navires plus petits — le **transbordement**.

| Rang mondial | Ports dominants |
| Tête du classement | **Shanghai**, **Singapour**, **Ningbo**, **Shenzhen** |
| Premiers européens | Rotterdam, Anvers — loin derrière en tonnage |

## Ce que la mer transporte d’autre
| Flux ou ressource | Le fait à retenir |
| Les **données** | **99 %** circulent par des câbles sous-marins, pas par satellite |
| Les **ressources** | Pêche, hydrocarbures offshore, minerais |
| Le **droit** | La convention de **Montego Bay** (1982) attribue à chaque État une **ZEE** de **200 milles marins** |`,
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
            cours: `Plus les échanges dépendent de la mer, plus la mer devient un espace de **puissance**. C’est la **maritimisation** des enjeux stratégiques.

## Contrôler les routes
Une marine de guerre sert d’abord à garantir la liberté de circulation de ses navires marchands.

| Puissance | Ses moyens | Sa stratégie |
| **États-Unis** | Première marine hauturière, une dizaine de porte-avions nucléaires | Un réseau mondial de bases |
| **Chine** | Première flotte du monde **en nombre de bâtiments** | Base à **Djibouti** (2017), ports acquis ou financés : les **routes de la soie maritimes** |

## Les zones de tension
| Zone | Ce qui s’y joue |
| **Mer de Chine méridionale** | Pékin revendique la quasi-totalité de l’espace (« ligne en neuf traits »), militarise des îlots artificiels aux **Spratleys** et **Paracels**, et ignore la sentence arbitrale de **2016** qui lui a donné tort |
| **Arctique** | La fonte ouvre la **route maritime du Nord** et l’accès aux ressources ; Russie, Canada, États-Unis, Danemark et Norvège y déposent des demandes |
| **Piraterie** | Golfe d’Aden, puis surtout **golfe de Guinée**, devenu la première zone d’attaques |

## L’appropriation des espaces
La ZEE fait de chaque île un enjeu : un rocher habitable ouvre **200 milles** de droits exclusifs. Les États déposent auprès de l’ONU des demandes d’**extension du plateau continental** au-delà de 200 milles, sur critère géologique.

> La mer, longtemps espace de **liberté**, se **territorialise**. Retiens la logique du chapitre : la mondialisation a rendu les États dépendants de flux qu’ils ne contrôlent pas — d’où le retour des marines de guerre, des bases et des contentieux de souveraineté.`,
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
            cours: `Deux espaces resserrés portent une part démesurée du commerce mondial. Les étudier, c’est comprendre ce qu’est une **vulnérabilité stratégique**.

## Les deux goulets, en chiffres
| | Détroit de **Malacca** | Détroit d’**Ormuz** |
| Ce qu’il relie | Océan Indien et mer de Chine | Le golfe arabo-persique et le monde |
| Largeur minimale | **2,7 km** | environ 50 km |
| Trafic | 90 000 à 100 000 navires par an | environ **20 millions de barils par jour** |
| Part mondiale | environ un **quart** du commerce maritime | environ un **cinquième** du pétrole consommé |

## Le détroit de Malacca
Long d’environ **900 km** entre la Malaisie et Sumatra. **Singapour**, à sa sortie, en a tiré sa fortune : premier port de transbordement mondial, raffinage, place financière.

> On appelle **dilemme de Malacca** la dépendance chinoise à ce goulet : environ **80 %** de ses importations d’hydrocarbures y transitent, sous surveillance de marines qui ne sont pas la sienne.

| Le contournement cherché | Son état |
| Oléoducs vers la Birmanie et le Pakistan | En service, capacité limitée |
| Projet de canal de **Kra** en Thaïlande | Jamais engagé |
| Routes terrestres eurasiatiques | En développement, coûteuses |

## Le golfe arabo-persique
Il concentre une part majeure des réserves mondiales de pétrole et de gaz : Arabie saoudite, Iran, Irak, Émirats, Koweït, Qatar.

| Acteur | Sa présence |
| **Iran** | Riverain ; a menacé plusieurs fois de fermer le détroit |
| **États-Unis** | Ve flotte basée à Bahreïn |
| **France** | Base militaire à Abou Dabi |

Le détroit est donc à la fois une **artère** et un **levier de pression**.

## Ce qu’il faut en retenir
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
            cours: `L’océan est en même temps la plus grande réserve de ressources de la planète, sa principale poubelle, et son plus vaste espace **mal gouverné**.

## La pression sur les ressources vivantes
| Fait | Chiffre |
| Stocks de poissons surexploités | environ **35 %** |
| Le reste | Exploité au maximum de son rendement |
| Part de l’**aquaculture** dans le poisson consommé | Près de la moitié |

Les causes : pêche industrielle (chaluts de fond, navires-usines), pêche illégale, subventions publiques. L’aquaculture a ses propres impacts : intrants, maladies, farines de poisson.

## Les pollutions
| Pollution | Le mécanisme | L’effet |
| **Plastiques** | 8 à 10 millions de tonnes par an | Gyres, puis microplastiques dans la chaîne alimentaire |
| **Eutrophisation** | Engrais agricoles | Marées vertes, zones mortes |
| **Acidification** | L’océan absorbe un quart du CO₂ émis | Le pH baisse : coraux et coquillages fragilisés |
| **Réchauffement** | Excès de chaleur stocké | Blanchissement des coraux, montée du niveau marin |

## Les nouvelles convoitises
Le fond des océans contient des **nodules polymétalliques** — nickel, cobalt, manganèse — et des terres rares. Leur exploitation est réclamée par les industriels des batteries et contestée par les scientifiques, faute de connaître les écosystèmes concernés.

Les **énergies marines** se développent en parallèle : éolien posé et flottant, hydrolien, marémoteur.

## La gouvernance en construction
| Instrument | Date | Ce qu’il permet |
| **AIFM** | En place | Délivre les permis d’exploration au-delà des ZEE |
| Traité **BBNJ** | **2023** | Créer des aires protégées en **haute mer** |
| Objectif international | 2030 | Protéger **30 %** des espaces marins |

> Le traité BBNJ comble un vide considérable : **60 %** de l’océan n’appartenait à personne, donc personne ne pouvait y interdire quoi que ce soit. Reste le contrôle effectif — beaucoup d’aires protégées existantes sont des « **parcs de papier** ».`,
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
            cours: `La France possède le **deuxième espace maritime du monde** — environ **10,2 millions de km²** de ZEE, derrière les États-Unis. Une puissance… incomplète, et c’est cette nuance que le bac attend.

## Une ZEE d’outre-mer
> **Plus de 96 %** de cette ZEE vient des territoires **ultramarins**. Sans eux, la France serait une puissance maritime moyenne : la carte de l’Hexagone ne dit rien de son domaine.

| Océan | Territoires |
| Pacifique | Polynésie française, Nouvelle-Calédonie, Wallis-et-Futuna, Clipperton |
| Indien | La Réunion, Mayotte, Terres australes |
| Atlantique | Antilles, Guyane, Saint-Pierre-et-Miquelon |

La France est présente dans **tous les océans** — un atout qu’aucun autre pays européen n’a. Les demandes d’extension du plateau continental portent le domaine au-delà de 11 millions de km².

## Les atouts
| Domaine | L’atout |
| Militaire | Porte-avions nucléaire *Charles de Gaulle*, sous-marins nucléaires, présence permanente en Indo-Pacifique |
| Économique | **CMA CGM**, parmi les trois premiers transporteurs de conteneurs |
| Scientifique | **Ifremer**, recherche océanographique reconnue |
| Industriel | Construction navale (Saint-Nazaire), offshore, câbles sous-marins |

## Les faiblesses
| Faiblesse | Ce qu’elle coûte |
| Les **ports** décrochent | Le Havre et Marseille loin derrière Rotterdam et Anvers : arrière-pays mal connecté, fiabilité insuffisante |
| La **flotte de commerce** sous pavillon français | Modeste au regard du domaine |
| La **surveillance** de la ZEE | Pêche illégale en Guyane, orpaillage, trafics : des moyens dispersés sur trois océans |

## La conclusion attendue
La France est une **puissance maritime par son domaine et par sa marine**, mais **pas par son économie portuaire**. Le potentiel est réel, l’exploitation partielle — et c’est exactement ce déséquilibre qu’une copie doit démontrer, pas trancher.`,
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
            cours: `La mondialisation ne met pas le monde à plat : elle **hiérarchise**. Certains territoires en sont les moteurs, d’autres les fournisseurs, d’autres encore les oubliés.

## Une lecture centre / périphérie
| Type de territoire | Ce qu’il concentre | Exemples |
| **Centres d’impulsion** | Capitaux, décisions, innovation | Amérique du Nord, Europe occidentale, Asie orientale |
| **Périphéries intégrées** | Main-d’œuvre, matières premières ; une part de la valeur | Pays émergents, ateliers d’Asie du Sud-Est, pays pétroliers |
| **Périphéries en marge** | Rien, ou presque | La plupart des **46 PMA**, souvent enclavés ou en conflit |

Les centres forment l’**archipel mégalopolitain mondial** : un chapelet de métropoles **mieux reliées entre elles qu’à leur propre arrière-pays**.

> Le vieux couple **Nord / Sud** ne suffit plus : la Chine est le premier exportateur mondial, et des fractures profondes traversent chaque pays — du Nord comme du Sud.

## Ce qui fait qu’un territoire s’intègre
| Facteur d’intégration | Facteur de marginalisation |
| Une façade maritime équipée | L’**enclavement** : pas de littoral |
| Des métropoles à services de haut niveau | Un tissu urbain sans fonctions de commandement |
| Une stabilité attirant les **IDE** | L’instabilité politique ou juridique |
| Une main-d’œuvre formée | La dépendance à une seule ressource |

## Mesurer l’intégration
| Indicateur | Ce qu’il montre | Sa limite |
| PIB par habitant | La richesse produite | Il ignore la répartition |
| **IDH** | Santé, éducation, revenu | Il moyenne les inégalités internes |
| Part dans le commerce mondial | L’ouverture | Elle peut n’être que d’exportation brute |
| Stock d’**IDE** | L’attractivité | Il peut refléter un statut fiscal |
| Connectivité | Trafic aérien, bande passante | Elle mesure les flux, pas la valeur |

Aucun ne suffit seul : l’IDH d’un pays pétrolier peut masquer de très fortes inégalités internes.`,
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
            cours: `Le pouvoir économique mondial n’est pas dilué : il tient dans quelques dizaines de kilomètres carrés de bureaux.

## Les villes mondiales
Une **ville mondiale** ne se définit pas par sa **taille** mais par ses **fonctions de commandement** : sièges de firmes transnationales, place boursière, banques, services aux entreprises, universités, médias, culture.

| Rang selon le **GaWC** | Villes |
| Au sommet | **New York**, **Londres** |
| Juste après | **Tokyo**, **Paris**, **Hong Kong**, **Singapour**, **Shanghai**, **Dubaï** |

Leur cœur est le **CBD** — *central business district* : Manhattan, la City et Canary Wharf, La Défense, Pudong.

## Les autres lieux de pouvoir
| Type de lieu | Exemples |
| Institutions internationales | ONU à New York, FMI et Banque mondiale à Washington, OMC et OMS à Genève, UE à Bruxelles et Strasbourg |
| Places financières | NYSE et Nasdaq, Shanghai, Tokyo, Londres |
| **Paradis fiscaux** | Ils captent une part considérable des profits déclarés |

## Une hiérarchie mouvante
| Mouvement | Ce qu’il produit |
| La montée de l’Asie | Shanghai, Shenzhen, Singapour et Dubaï gagnent des rangs |
| Le **Brexit** | Une partie de l’activité financière quitte Londres pour Francfort, Amsterdam et Paris |

Rien n’est acquis : une ville mondiale se maintient par ses **infrastructures**, son **droit**, ses **talents** et sa **stabilité**.

> Deux notions à ne jamais confondre : la **hiérarchie** — qui commande à qui — et le **réseau** — qui est relié à qui. Une métropole peut être très peuplée et faiblement connectée : c’est le cas de plusieurs mégapoles du Sud.`,
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
| Domaine | L’atout | Le chiffre |
| Politique et militaire | Membre permanent du Conseil de sécurité, droit de veto, puissance nucléaire | Second réseau diplomatique du monde |
| Linguistique et culturel | La **francophonie**, l’OIF, les lycées français, l’Institut français | Plus de **320 millions** de locuteurs |
| Économique | Firmes transnationales de premier plan | Luxe, aéronautique, énergie, agroalimentaire |
| Touristique | Première destination mondiale | **90 à 100 millions** de visiteurs par an |

> Le tourisme illustre bien la nuance du chapitre : la France est première **en nombre de visiteurs**, mais ses **recettes** restent inférieures à celles de l’Espagne ou des États-Unis — les séjours y sont plus courts. Un record de fréquentation n’est pas un record de puissance.

## Une attractivité très inégale à l’intérieur
| Territoire | Sa situation |
| **Île-de-France** | Capte la majorité des sièges sociaux, des IDE et des emplois métropolitains supérieurs |
| Quelques métropoles | Lyon, Toulouse, Bordeaux, Nantes, Montpellier, Rennes tirent leur épingle du jeu |
| Les anciens bassins industriels | Nord et Est : reconversion inachevée |
| La « **diagonale des faibles densités** » | Du Nord-Est au Sud-Ouest : déprise |
| Une partie des outre-mer | Éloignement, étroitesse du marché |

## Les fragilités
| Fragilité | Ce qu’elle traduit |
| **Déficit commercial** structurel | Perte de parts de marché à l’exportation |
| **Désindustrialisation** | La part de l’industrie dans le PIB recule depuis les années 1980 |
| Image d’attractivité | Fiscalité et complexité administrative, malgré de bons classements récents pour les IDE |

> La formule à retenir : la France a une **influence globale**, une **économie moyenne**, et un **territoire inégalement branché** sur la mondialisation.`,
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
            cours: `Les échanges sont **mondiaux**, les États restent **nationaux**. Toute la difficulté de la gouvernance économique mondiale tient dans cet écart.

## Les institutions mondiales
| Institution | Créée | Ce qu’elle fait | Son état |
| **OMC** | 1995, successeur du GATT | Fixe les règles du commerce, arbitre les litiges | **Paralysée** : cycle de Doha inabouti, organe d’appel bloqué depuis 2019 |
| **FMI** | 1944 | Prête aux États en crise, sous conditions | Actif, contesté sur ses conditionnalités |
| **Banque mondiale** | 1944 | Finance le développement | Actif |
| **G7 / G20** | 1975 / 2008 | Forums informels | Ils orientent, ne décident rien de contraignant |

## Les intégrations régionales
Plus efficaces, parce que plus resserrées.

| Ensemble | Où | Degré d’intégration |
| **Union européenne** | Europe | Le plus poussé : marché unique, monnaie, politiques communes |
| **ACEUM** (ex-ALENA) | Amérique du Nord | Libre-échange |
| **Mercosur** | Amérique du Sud | Union douanière imparfaite |
| **ASEAN** | Asie du Sud-Est | Coopération et libre-échange |
| **ZLECAf** | Afrique | Zone de libre-échange continentale, en construction |
| **RCEP** | Asie-Pacifique | Le plus grand accord commercial du monde |

## Réguler autre chose que le commerce
| Domaine | L’instrument | Sa force contraignante |
| Climat | Les **COP**, Accord de Paris (2015) | Engagements volontaires, sans sanction |
| Fiscalité | Accord **OCDE** (2021) : impôt minimum mondial de **15 %** | Contraignant s’il est transposé |
| Travail | Conventions de l’**OIT** | Faible |

> Le point commun de tous ces dispositifs : ils reposent sur le **consentement** des États. D’où leur fragilité — et le retour, ces dernières années, des mesures **unilatérales**.`,
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
            cours: `Depuis une quinzaine d’années, la mondialisation ne progresse plus mécaniquement : elle est **contestée**, et elle se **réorganise**.

## Ce qu’on lui reproche
| Reproche | Ce qu’il vise |
| Les **inégalités** | Les gains ont profité aux classes moyennes émergentes et aux plus riches, moins aux classes populaires du Nord |
| Le **dumping social et environnemental** | Produire là où le droit du travail et les normes sont les plus faibles |
| Les **délocalisations** | La désindustrialisation de régions entières |
| L’**empreinte écologique** | Transport de masse et consommation de masse |
| L’**uniformisation culturelle** | Contestée depuis les mouvements altermondialistes — Seattle, 1999 |

## Les chocs révélateurs
| Choc | Ce qu’il a révélé |
| Crise de **2008** | La contagion financière : un défaut américain devient une crise mondiale |
| Pandémie de **Covid-19** (2020) | Des chaînes de valeur étirées à l’extrême : masques, médicaments, semi-conducteurs |
| Guerre en **Ukraine** (2022) | Une dépendance énergétique est une vulnérabilité politique |

## Le retour du politique
| Mesure | Exemple |
| **Guerre commerciale** | États-Unis contre Chine depuis 2018 : droits de douane, contrôle des exportations de technologies |
| **Relocalisations** | *Inflation Reduction Act* américain, plans européens sur les semi-conducteurs et les batteries |
| **Souveraineté** | Devenue un mot d’ordre : alimentaire, industrielle, numérique |

> Le mot juste n’est pas « démondialisation » mais **recomposition** : le commerce mondial ne s’effondre pas, il se **régionalise** et se **politise**. On parle de *friend-shoring* — produire chez des partenaires jugés fiables, plutôt qu’au moins cher.`,
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
            cours: `Deux espaces, deux façons **contraires** d’entrer dans la mondialisation : par la **rente** pour la Russie, par l’**atelier** pour l’Asie du Sud-Est.

## Deux modèles opposés
| | Russie | Asie du Sud-Est |
| Ce qu’elle exporte | Des **ressources** : gaz, pétrole, blé, métaux, engrais | Du **travail industriel** : textile, électronique, assemblage |
| Ce qui l’a intégrée | La demande énergétique mondiale | Les **IDE** et la sous-traitance |
| Sa vulnérabilité | Les **sanctions** et le cours des matières premières | La dépendance aux donneurs d’ordre |
| Sa tendance actuelle | Réorientation forcée vers l’Asie | Capte les **relocalisations** hors de Chine |

## La Russie : une puissance de rente
Premier pays du monde par la superficie, elle tire l’essentiel de ses devises des hydrocarbures et des matières premières. Cette rente finance l’État et l’armée, mais l’économie reste **peu diversifiée** : son PIB est comparable à celui d’un grand pays européen.

| Date | L’événement | L’effet |
| **2014** | Annexion de la Crimée | Premières sanctions occidentales |
| **2022** | Invasion de l’Ukraine | Sanctions massives, réorientation vers la Chine et l’Inde, souvent avec de **fortes décotes** |

Elle conserve des leviers : arme nucléaire, siège au Conseil de sécurité, influence en Afrique et au Moyen-Orient.

## L’Asie du Sud-Est : l’atelier qui monte
| Fait | Chiffre |
| L’**ASEAN**, créée en | **1967** |
| Nombre d’États membres | **10** |
| Population | Plus de **650 millions** d’habitants |

Elle bénéficie de sa position sur les grandes routes maritimes — Malacca — et d’une main-d’œuvre nombreuse. Le Vietnam, l’Indonésie et la Malaisie profitent aujourd’hui du report des chaînes de production hors de Chine.

## Coopérations et tensions
| Coopérations | Tensions |
| ASEAN, accords de libre-échange | Contentieux en **mer de Chine méridionale** entre Pékin et plusieurs membres |
| **RCEP**, le plus grand accord commercial du monde | Dépendance économique à la Chine |
| Partenariats avec la Chine et le Japon | **Inégalités internes** : Singapour parmi les plus riches du monde, le Laos et le Cambodge parmi les plus pauvres |`,
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
            cours: `L’Union européenne réunit **27 États** et environ **450 millions d’habitants**. Elle est une puissance d’un genre inédit : très forte là où elle est **unie**, faible là où elle ne l’est pas.

## Ce qui fait sa force
| Atout | Ce qu’il produit |
| Le **marché unique** | Le plus vaste espace économique intégré du monde |
| La **première puissance commerciale** mondiale | Prise dans son ensemble |
| L’**euro** | Monnaie de 20 États, deuxième monnaie de réserve mondiale |
| Des **politiques communes** | PAC, concurrence (qui sanctionne les géants du numérique), commerce négocié d’une seule voix |
| Un pouvoir **normatif** | Le RGPD, les normes environnementales et sanitaires |

> C’est l’« **effet Bruxelles** » : une entreprise qui veut vendre en Europe applique les normes européennes **partout**, parce qu’il coûte moins cher de produire une seule version. L’UE légifère ainsi bien au-delà de ses frontières, sans aucune armée.

## Ce qui fait sa faiblesse
| Faiblesse | Sa conséquence |
| Pas d’**armée commune** | La défense repose largement sur l’**OTAN** |
| La **PESC** se décide à l’**unanimité** | Un seul État peut bloquer la politique étrangère |
| Une **diversité** considérable | 24 langues officielles, richesses du simple au sextuple, cultures politiques opposées |
| Dépendances | Technologique, et longtemps énergétique |

## La formule à nuancer
« Géant économique, nain politique » : la formule classique est aujourd’hui à discuter, pas à réciter.

| L’épreuve | Ce qu’elle a montré |
| La pandémie (2020) | Un plan de relance **emprunté en commun** — un pas fédéral inédit |
| L’Ukraine (depuis 2022) | Un soutien coordonné, des sanctions communes, un début de politique de défense |

Une capacité d’action qu’on ne lui prêtait plus.`,
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
            cours: `Depuis 2008, l’Union avance de crise en crise. Chacune l’a fragilisée — et, à chaque fois, l’a aussi **obligée à se doter d’outils nouveaux**.

## Les cinq crises
| Crise | Dates | Ce qu’elle révèle | L’outil qui en sort |
| La **dette** | 2010-2015 | Une monnaie unique sans budget commun est instable | MES, BCE, règles budgétaires |
| Les **migrations** | 2015 | Le règlement de Dublin est inapplicable | Frontex renforcée, pacte de 2024 |
| Le **Brexit** | 2016-2020 | L’adhésion est réversible | Rien — mais l’adhésion remonte ailleurs |
| L’**État de droit** | Depuis 2017 | Un membre peut s’éloigner des valeurs signées | Article 7, conditionnalité budgétaire |
| L’**Ukraine** | Depuis 2022 | La dépendance énergétique est une vulnérabilité | Sanctions communes, dossier de l’élargissement rouvert |

## La crise de la dette
Déclenchée par la **Grèce**. Réponses : mécanisme européen de stabilité, intervention de la **BCE** — « *whatever it takes* », 2012 — et règles budgétaires renforcées. Coût politique : austérité et ressentiment durable dans les pays du Sud.

## La crise migratoire
Plus d’**un million** d’arrivées en 2015, principalement de Syriens. Le **règlement de Dublin** fait peser la demande d’asile sur le **pays d’entrée** — donc sur la Grèce et l’Italie. Les désaccords sur la répartition n’ont jamais été vraiment surmontés.

## Le Brexit
Référendum du **23 juin 2016** : **51,9 %** pour la sortie ; retrait effectif le **31 janvier 2020**. Premier retrait de l’histoire de la construction européenne. L’Union perd un membre majeur — mais le soutien à l’adhésion **remonte** dans les autres États.

## Deux limites structurelles
> Elles reviennent à **chaque** crise : un **budget minuscule** — environ 1 % du revenu national brut de l’Union — et des décisions **lentes**, prises à 27. Aucune réforme n’a encore traité ni l’une ni l’autre.`,
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
            cours: `L’Union est un espace **très inégal à l’intérieur**, et **pris en tenaille à l’extérieur** entre les États-Unis et la Chine.

## Un cœur et des marges
La richesse se concentre sur une **dorsale** allant du sud de l’Angleterre à l’Italie du Nord, par le Benelux, la vallée du Rhin et la Suisse : la **mégalopole européenne**. Elle rassemble les grandes métropoles, les ports du Northern Range et les régions industrielles les plus productives.

| Type d’espace | Sa situation |
| La **dorsale** | Métropoles, ports, industrie productive |
| Europe du Sud, Europe centrale et orientale | Rattrapage engagé, revenus encore inférieurs |
| Régions rurales et anciens bassins industriels | Déprise, reconversion difficile |
| **Régions ultrapériphériques** (dont les DROM) | Éloignement et étroitesse du marché |

Les écarts sont considérables : le PIB par habitant du **Luxembourg** est plusieurs fois supérieur à celui de la **Bulgarie**.

## L’outil : la politique de cohésion
Environ **un tiers du budget** européen, via le **FEDER**, le **FSE+** et le Fonds de cohésion. Objectif : réduire les écarts en finançant infrastructures, formation et innovation.

> Bilan en demi-teinte : rattrapage **réel** des pays d’Europe centrale depuis 2004 — mais creusement des écarts **à l’intérieur** de chaque pays, entre métropoles et espaces en marge. La cohésion entre États a progressé, la cohésion entre territoires non.

## La concurrence externe
| Rival | Son instrument |
| **États-Unis** | L’*Inflation Reduction Act* (2022) : subventions industrielles massives |
| **Chine** | Exportations de véhicules électriques, panneaux solaires et batteries, soutenues sur le long terme |
| La réponse européenne | Plans sur les semi-conducteurs, les batteries et les matières premières critiques ; instruments de défense commerciale |

## La concurrence interne
Elle existe aussi **entre membres** : dumping fiscal (Irlande, Luxembourg), travailleurs détachés, course aux sièges sociaux. C’est l’une des critiques récurrentes adressées au marché unique — un espace commun peut aussi organiser la concurrence de ses membres entre eux.`,
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
            cours: `Un marché unique sans réseaux n’est qu’une déclaration. Les transports sont l’**infrastructure matérielle** de l’intégration européenne.

## Le réseau transeuropéen (RTE-T)
L’UE finance et coordonne des **corridors** prioritaires — Rhin-Alpes, Atlantique, Mer du Nord-Méditerranée — avec un objectif triple.

| Objectif | Ce qu’il vise |
| **Ouverture** | Relier l’Union au monde par les grands ports et aéroports |
| **Cohésion** | Désenclaver les périphéries |
| **Compétitivité** | Fluidifier et faire baisser les coûts |

## Les infrastructures emblématiques
| Type | Exemples |
| Ports du **Northern Range** | Rotterdam, Anvers, Hambourg, Le Havre |
| Axes fluviaux | Rhin, Danube, canal Seine-Nord Europe en construction |
| Tunnels alpins | **Saint-Gothard** (le plus long du monde), **Lyon-Turin** en chantier |
| Lignes à grande vitesse | Denses en France, en Espagne et en Allemagne ; quasi absentes à l’est |
| Hubs aéroportuaires | Francfort, Amsterdam-Schiphol, Paris-CDG, Madrid |

## Circulation des personnes
L’espace **Schengen** supprime les contrôles aux frontières intérieures ; **Erasmus+** fait circuler chaque année des centaines de milliers d’étudiants.

> La mobilité est l’acquis européen le plus **concret** pour les citoyens — celui qui se perd le plus vite quand une crise rétablit les frontières, comme en 2015 et en 2020.

## Les limites
| Limite | Ce qu’elle révèle |
| Un réseau **inégal** | Périphéries orientales et méridionales moins bien desservies |
| Le **fret ferroviaire** stagne | Le report modal vers le rail reste un objectif, pas un fait |
| Le poids climatique du transport | L’objectif de fluidité entre en tension avec l’objectif climatique |
| Des projets **lents et coûteux** | Le Lyon-Turin est débattu depuis les années 1990 |`,
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
            cours: `La France a des frontières terrestres avec **huit pays** — Belgique, Luxembourg, Allemagne, Suisse, Italie, Espagne, Andorre, Monaco — sans compter le Brésil et le Suriname en Guyane. Ces marges ne sont plus des lignes de séparation, mais des **espaces de vie**.

## Le travail frontalier
| Fait | Chiffre |
| Résidents de France travaillant chez un voisin | Plus de **400 000** |
| Principales destinations | Suisse (Genève, Bâle), Luxembourg, Belgique, Allemagne, Monaco |

Le moteur est l’**écart de salaires** : un même emploi peut être payé bien davantage de l’autre côté, tandis que le logement reste moins cher côté français.

## Les effets sur le territoire
| Effets positifs | Effets négatifs |
| Revenus élevés injectés dans l’économie locale | Flambée des prix du logement près des frontières |
| Dynamisme démographique | Congestion routière aux heures de pointe |
| Chômage plus faible | **Pénurie de main-d’œuvre** côté français : hôpitaux et entreprises perdent leurs salariés |
| | Fiscalité complexe |

## Des espaces institués
| Outil | Ce qu’il permet | Exemples |
| **Eurométropoles** | Gérer ensemble une agglomération à cheval | Lille-Courtrai-Tournai, Strasbourg-Kehl, Bâle-Saint-Louis, Genève-Annemasse |
| **GECT** | À des collectivités de deux pays de gérer un équipement commun | Un hôpital, un tramway, une zone d’activité |
| **Interreg** | Financer ces coopérations | Programme européen |

> Ce que ces territoires prouvent : l’intégration européenne se mesure moins dans les traités que dans un **tramway qui traverse le Rhin** ou un hôpital utilisé par deux nationalités.`,
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
            cours: `Derrière la diversité des paysages, quelques **lignes de force** organisent le territoire français. Les repérer, c’est savoir lire n’importe quelle carte de France.

## La macrocéphalie parisienne
| Indicateur | Part de l’Île-de-France |
| Population | environ **19 %** |
| PIB national | près de **31 %** |

Elle concentre les sièges sociaux, la recherche, les hubs aériens et ferroviaires.

> Aucun autre grand pays européen ne connaît un tel écart entre sa capitale et ses autres villes : l’Allemagne et l’Italie ont plusieurs pôles de rang comparable. C’est une **singularité française**, pas une norme.

## Les cinq lignes de force
| Ligne de force | Ce qu’elle décrit |
| **Métropolisation** | Une quinzaine de grandes aires urbaines captent emplois qualifiés, étudiants et investissements |
| **Périurbanisation** | Un vaste anneau autour d’elles, produit de la voiture et du coût du logement |
| **Diagonale des faibles densités** | Des Ardennes aux Landes : vieillissement, déprise, éloignement des services |
| **Littoralisation** | Population et activités se déplacent vers les côtes atlantique et méditerranéenne |
| **Axes et façades** | Vallées du Rhône et de la Seine, sillon lorrain, arc atlantique |

> Le terme « diagonale du **vide** » est trompeur : ces espaces ne sont pas vides, ils sont **peu denses** — et souvent en difficulté d’accès aux services, ce qui n’est pas la même chose.

## La littoralisation et ses tensions
| Ce qui attire | Ce que cela produit |
| Héliotropisme, tourisme, retraites | Flambée du prix du foncier |
| Activités portuaires | Artificialisation des sols |
| Cadre de vie | Exposition au risque de submersion |

## Les outre-mer
Éloignés, insulaires pour la plupart, répartis dans trois océans.

| Contraintes | Atouts |
| Chômage élevé | Une **ZEE** de rang mondial |
| Dépendance aux importations | Une biodiversité exceptionnelle |
| Éloignement du marché métropolitain | Le spatial en Guyane |`,
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
| Date | La réforme | Ce qu’elle change |
| **2014** | Loi MAPTAM | Crée le statut de **métropole** — 21 aujourd’hui, dont Grand Paris, Lyon et Aix-Marseille à statut particulier |
| **2015-2016** | Fusion des régions | De **22 à 13** régions métropolitaines |
| En continu | Montée des **intercommunalités** | Elles exercent l’essentiel des compétences d’aménagement du quotidien |

La fusion des régions reste contestée : ensembles très vastes, identités mal reconnues, éloignement des centres de décision.

## Les recompositions sociales et spatiales
| Type d’espace | La dynamique |
| Les **métropoles** | Emplois qualifiés, mais **gentrification** des centres : les ménages modestes sont repoussés vers le périurbain lointain |
| Les **villes moyennes** | Centres dévitalisés, commerces vacants — d’où « Action cœur de ville » |
| Les anciens **bassins industriels** | Nord, Lorraine, Saint-Étienne : reconversion des friches, réussites inégales |
| Les espaces **ruraux** | Certains se repeuplent (néoruraux, télétravail depuis 2020), d’autres continuent de se vider |

## L’aménagement aujourd’hui
L’**ANCT** — Agence nationale de la cohésion des territoires, 2020 — pilote les politiques de rééquilibrage. Deux impératifs récents pèsent sur tous les projets :

| Impératif | Ce qu’il impose |
| Le **ZAN** (zéro artificialisation nette) | Stopper l’étalement urbain |
| L’**accès aux services** | Santé (déserts médicaux), transports, numérique |

## Le fil conducteur
> Depuis les années 1960, l’aménagement est passé d’une logique de **rééquilibrage volontariste** — « Paris et le désert français » — à une logique de **compétitivité des métropoles**. Puis, depuis peu, à un retour de la question des **territoires laissés de côté**. Trois doctrines successives, sur le même territoire.`,
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

## L’ancrage européen
| Fait | Chiffre ou date |
| Membre **fondateur** | CECA (1951), CEE (1957) |
| Zone euro et espace Schengen | Membre |
| Part du commerce extérieur réalisée dans l’UE | environ **60 %** |
| Premier partenaire commercial | L’**Allemagne**, de très loin |
| PAC | La France en est la première bénéficiaire en volume |

## La présence mondiale
| Levier | Ce qu’il représente |
| Le **domaine maritime** | De rang mondial, dans trois océans |
| Les **forces prépositionnées** | Djibouti, Émirats arabes unis, Antilles, Pacifique |
| Le réseau **diplomatique et culturel** | Deuxième rang mondial |
| Les **firmes transnationales** | Luxe, aéronautique, énergie |

## Les portes d’entrée du territoire
Les flux passent par quelques **interfaces** — et ce sont elles, plus que les frontières, qui font le contact avec le monde.

| Interface | Exemples |
| Hubs aériens | **Roissy-CDG** |
| Ports | Le Havre, Marseille-Fos, Dunkerque |
| Liaisons fixes | Tunnel sous la Manche |
| Gares LGV internationales | Lille-Europe, Paris-Nord |

## Les limites de l’intégration
| Limite | Ce qu’elle traduit |
| **Déficit commercial** persistant | Des parts de marché en recul, y compris en Europe |
| Dépendance à des chaînes extérieures | Électronique, médicaments — révélée depuis 2020 |
| **Inégalités internes** | Quelques métropoles et façades sont branchées sur le monde, d’autres territoires en sont déconnectés |

> À retenir : la France est intégrée **à l’Europe par ses échanges** et **au monde par son histoire, son domaine et sa diplomatie**. Mais la mondialisation ne touche pas tous ses territoires de la même façon — et c’est cette inégalité qui fait le sujet.`,
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
            cours: `L’Occitanie est née en **2016** de la fusion de **Midi-Pyrénées** et du **Languedoc-Roussillon**. Environ **6 millions d’habitants**, **13 départements**, des Pyrénées au Massif central et de la Méditerranée à la Garonne.

## L’attractivité
| Fait | Chiffre |
| Croissance annuelle | de l’ordre de **+50 000 habitants** |
| D’où elle vient | Essentiellement du **solde migratoire** |
| Où elle se concentre | Toulouse, Montpellier, la bande littorale |

Les moteurs : héliotropisme, cadre de vie, littoral, et un coût du logement encore inférieur à celui de la région Sud.

## Deux moteurs métropolitains
| Métropole | Ses spécialisations | Son rang |
| **Toulouse** | **Aéronautique** (Airbus et ses sous-traitants), spatial (CNES), recherche | Premier pôle industriel de la région |
| **Montpellier** | Santé, biotechnologies, numérique, université | Une des plus fortes croissances démographiques de France |

S’y ajoutent la **viticulture** — premier vignoble de France en surface —, le **tourisme** (littoral, Pyrénées, patrimoine), l’agroalimentaire et les énergies renouvelables.

## Les inégalités internes
| Le contraste | Ce qu’il oppose |
| Chômage | Durablement supérieur à la moyenne nationale, surtout sur le littoral languedocien |
| Métropoles / départements ruraux | Lozère, Aveyron, Gers, Ariège : peu denses, vieillissants, éloignés des services |
| **Littoral / arrière-pays** | Le premier se sature et voit ses prix flamber ; le second peine à retenir ses jeunes |
| Accessibilité | La LGV vers Toulouse est attendue de longue date ; les liaisons est-ouest restent lentes |

## Le cas d’école
> Une région **attractive** n’est pas pour autant une région **homogène**. Croissance démographique et chômage élevé y coexistent — parce qu’on y vient pour le **cadre de vie** autant que pour l’emploi. C’est exactement le raisonnement qu’un sujet de bac attend sur l’Occitanie.`,
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
