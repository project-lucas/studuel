// Biotechnologies — 1re STL (voie technologique). Programme officiel : annexe 2
// du BO spécial n° 1 du 22 janvier 2019. Deux ensembles : « Travailler ensemble
// au laboratoire de biotechnologies » (modules A à D : démarche de projet,
// prévention des risques, métrologie, outils numériques) et « Acquérir les
// fondamentaux technologiques et scientifiques » (modules 1 à 8 : microscopie,
// culture, identification, dénombrement, solutions, détection, séparation,
// dosages). La spécialité se poursuit en terminale dans « Biochimie, biologie et
// biotechnologie ».
//
// Matière NEUVE (slug `biotechnologies`, déclaré pour la seule « 1re techno ») :
// le bloc part de la position 1. L'axe de chaque fiche est le module officiel.

export default {
  slug: 'biotechnologies',
  nom: 'Biotechnologies',
  titreMigration: 'BIOTECHNOLOGIES 1re STL — LE PROGRAMME OFFICIEL (16 fiches)',
  motif: `Les élèves de 1re STL qui suivent la spécialité biotechnologies (l'autre
choix étant les sciences physiques et chimiques en laboratoire) ne trouvaient rien
dans l'app. Cette migration installe 16 fiches qui suivent le programme officiel
(BO spécial n° 1 du 22 janvier 2019) : le travail au laboratoire (démarche de
projet, analyse et prévention des risques, métrologie, outils numériques) et les
huit modules technologiques (microscopie et coloration de Gram, asepsie et milieux
de culture, identification, dénombrement, préparation de solutions, détection des
biomolécules, chromatographies, dosages spectrophotométriques et volumétriques).
Ces acquis sont remobilisés en terminale dans « Biochimie, biologie et
biotechnologie ».`,
  blocs: [
    {
      niveaux: ['1re'],
      positionDepart: 1,
      chapitres: [
        {
          titre: 'Les biotechnologies, la démarche de projet et les outils numériques',
          axe: 'A – S’initier à la recherche expérimentale et à la démarche de projet en biotechnologies',
          lecon: {
            titre: 'Le vivant au service d’un besoin',
            cours: `Les **biotechnologies** utilisent des êtres vivants (bactéries, levures, cellules, enzymes) ou leurs molécules pour produire, analyser ou soigner. Le pain, le yaourt et la bière en sont les plus anciens exemples ; l’insuline produite par des bactéries en est un exemple moderne.

## Les couleurs des biotechnologies
| Couleur | Domaine | Exemple |
| **Rouge** | santé | production d’insuline, diagnostic, vaccins |
| **Blanche** | procédés industriels | enzymes des lessives, bioplastiques |
| **Verte** | agriculture | sélection de variétés, biofertilisants |
| **Bleue** | biodiversité marine | molécules extraites d’algues ou d’éponges |
| **Jaune** | protection de l’environnement | dépollution des sols, stations d’épuration |

Ces applications posent des questions **bioéthiques** : jusqu’où modifier le vivant ? qui profite des brevets ? quels risques pour l’environnement ? Il faut distinguer une **opinion** d’un argument scientifique appuyé sur des sources.

## La démarche expérimentale
1. Partir d’un **besoin** et formuler une question (« ce lait est-il conforme ? »).
2. Émettre une **hypothèse** testable.
3. Proposer une expérience avec ses **conditions expérimentales** et ses **témoins**.
4. Mettre en œuvre la **procédure**.
5. Exploiter les résultats, conclure, puis **rendre compte** à l’écrit ou à l’oral.

> Un **témoin** est un essai réalisé dans les mêmes conditions, sauf le facteur étudié : il prouve que le résultat vient bien de ce facteur. Un témoin positif doit réagir, un témoin négatif ne doit pas réagir.

## Travailler en groupe
Le projet se mène en équipe : répartir les tâches, écouter, argumenter, respecter les idées des autres, confronter les interprétations. Le travail est valorisé au sein du lycée (affiche, présentation, compte rendu).

## Les outils numériques
| Outil | Usage au laboratoire |
| **Tableur-grapheur** | tracer une courbe d’étalonnage ou de croissance, calculer une moyenne, une **courbe de tendance** |
| **Base de données** | chercher une séquence, une structure, un article par **mots clés**, **filtres** et **requêtes** |
| **Logiciel de visualisation 3D** | observer l’ADN, une protéine, un ose dans l’espace |
| **Outil collaboratif** | co-écrire un compte rendu, partager un planning |

Toute source doit être évaluée : qui l’a écrite ? est-elle datée, référencée, relue ? Une **bibliographie** (livres, articles) ou une **sitographie** (sites) donne les références utilisées.

## Exemple
Une équipe veut produire un yaourt sans lactose. Besoin : un produit pour les intolérants. Hypothèse : ajouter une lactase au lait avant la fermentation hydrolyse le lactose. Expérience : lait + lactase, lait sans lactase (témoin), puis recherche de glucose dans les deux laits. Résultat attendu : glucose seulement dans le lait traité.`,
          },
          questions: [
            ['Les biotechnologies rouges concernent le domaine…', ['De l’environnement', 'De l’agriculture', 'De la santé', 'De la mer'], 2, 'Médicaments, vaccins, diagnostic : c’est le domaine le plus développé.'],
            ['La production d’enzymes pour les lessives relève des biotechnologies…', ['Blanches', 'Rouges', 'Vertes', 'Bleues'], 0, 'Les biotechnologies blanches concernent les procédés industriels.'],
            ['La dépollution d’un sol par des bactéries relève des biotechnologies…', ['Blanches', 'Rouges', 'Bleues', 'Jaunes'], 3, 'Le jaune désigne la protection de l’environnement.'],
            ['À quoi sert un témoin dans une expérience ?', ['À gagner du temps', 'À prouver que le résultat est dû au facteur étudié', 'À remplacer l’hypothèse', 'À augmenter le rendement'], 1, 'Il est réalisé dans les mêmes conditions, sauf pour le facteur testé.'],
            ['Un témoin négatif doit…', ['Contenir deux fois plus de réactif', 'Toujours réagir', 'Être omis si le résultat est clair', 'Ne pas réagir'], 3, 'S’il réagit, le test n’est pas fiable (contamination, réactif défectueux).'],
            ['Une hypothèse scientifique doit être…', ['Une opinion personnelle', 'Déjà démontrée', 'Testable par une expérience', 'Formulée après la conclusion'], 2, 'On conçoit l’expérience pour la valider ou l’invalider.'],
            ['Quel outil utiliser pour tracer une courbe d’étalonnage ?', ['Un tableur-grapheur', 'Un logiciel de visualisation 3D', 'Un moteur de recherche', 'Un outil de dessin'], 0, 'Il trace la courbe et calcule l’équation de la droite de tendance.'],
            ['Une sitographie est…', ['Une technique de culture', 'La liste des sites internet consultés', 'Un type de microscope', 'Un logiciel 3D'], 1, 'La bibliographie liste les documents imprimés, la sitographie les sites.'],
            ['Les molécules extraites d’éponges marines relèvent des biotechnologies bleues.', ['Vrai', 'Faux'], 0, 'Le bleu désigne l’exploitation de la biodiversité marine.'],
            ['Quelle est la première étape d’une démarche de projet ?', ['Rédiger la conclusion', 'Partir d’un besoin et formuler une question', 'Commander le matériel', 'Présenter à l’oral'], 1, 'Tout le projet découle de la question posée.'],
            ['Pour juger la fiabilité d’une source, on vérifie d’abord…', ['Sa présence sur un réseau social', 'Le nombre de couleurs de la page', 'Sa longueur', 'Son auteur, sa date et ses références'], 3, 'Une source fiable est identifiée, datée, référencée et si possible relue par des pairs.'],
            ['Une opinion suffit à justifier une décision bioéthique.', ['Vrai', 'Faux'], 1, 'Un débat bioéthique s’appuie sur des arguments et des sources, pas sur une simple opinion.'],
          ],
        },
        {
          titre: 'Danger, risque et analyse des risques',
          axe: 'B – Prévenir les risques au laboratoire de biotechnologies',
          lecon: {
            titre: 'Un danger n’est pas encore un risque',
            cours: `Au laboratoire, on manipule des micro-organismes, des produits chimiques et des appareils électriques. Travailler en sécurité ne veut pas dire tout interdire : cela veut dire **analyser** les risques pour les **prévenir**.

## Danger, risque, dommage
| Terme | Définition | Exemple |
| **Danger** | propriété intrinsèque capable de causer un dommage | la soude est corrosive |
| **Situation exposante** | situation où une personne est en contact avec le danger | verser de la soude sans lunettes |
| **Événement dangereux** | ce qui déclenche le dommage | une projection |
| **Dommage** | la lésion ou l’atteinte à la santé | brûlure de l’œil |
| **Risque** | combinaison de la **probabilité** du dommage et de sa **gravité** | élevé si l’on pipette de la soude sans protection |

> Pas d’exposition, pas de risque : un flacon de soude fermé dans une armoire est un danger, mais il ne présente presque pas de risque.

## Les classes de danger
- **Biologique** : micro-organismes classés en **groupes de risque 1 à 4** selon leur pathogénicité ; au lycée, on ne manipule que des micro-organismes du groupe 1 (et du groupe 2 dans des conditions strictes). Un produit biologique d’origine humaine (sang, urine) est toujours considéré comme potentiellement infectieux.
- **Chimique** : identifié par les **pictogrammes** du règlement CLP et les **mentions d’avertissement** (« Danger » pour les plus graves, « Attention » sinon), complétés par les **mentions de danger** (phrases H) et les **conseils de prudence** (phrases P).
- **Électrique** : appareils branchés près de liquides.
- **Physique** : flamme du bec Bunsen, verre cassé, autoclave sous pression.

## Les voies d’exposition
| Voie | Exemple au laboratoire |
| **Contact** (peau, muqueuses, œil) | projection, coupure avec du verre souillé |
| **Inhalation** | aérosols lors d’un ensemencement, vapeurs de solvant |
| **Ingestion** | pipetage à la bouche (interdit), mains portées à la bouche |

On représente la **chaîne de transmission** : réservoir (la culture) → voie de sortie → mode de transmission → voie d’entrée → personne exposée. Rompre un maillon suffit à prévenir la contamination.

## La démarche d’analyse des risques
1. Lire la procédure et repérer les **situations exposantes**.
2. Pour chacune, identifier les **événements dangereux** les plus probables.
3. Estimer le **risque** : probabilité × gravité.
4. Mettre en relation les **mesures de prévention** proposées avec les risques identifiés.

Il faut aussi penser au **risque pour le produit** : une culture contaminée par l’opérateur donne un résultat faux. L’asepsie protège à la fois le manipulateur et l’échantillon.

## Exemple
Étape : « ensemencer une gélose à partir d’une culture de *Escherichia coli* K12 ». Danger : biologique (groupe 1, faible pathogénicité). Situation exposante : ouverture du tube. Événement dangereux : formation d’aérosol, contact avec les mains. Prévention : travail près du bec Bunsen, blouse fermée, lavage des mains, désinfection de la paillasse.`,
          },
          questions: [
            ['Un danger est…', ['Une propriété capable de causer un dommage', 'La probabilité qu’un accident arrive', 'Une lésion déjà subie', 'Une mesure de prévention'], 0, 'C’est une propriété intrinsèque du produit ou de l’agent, qu’on y soit exposé ou non.'],
            ['Le risque combine…', ['Le danger et le pictogramme', 'Le prix du produit et sa quantité', 'La probabilité du dommage et sa gravité', 'La température et le pH'], 2, 'Un danger grave mais très improbable peut représenter un risque faible, et inversement.'],
            ['Un flacon de produit corrosif fermé dans une armoire présente un danger mais peu de risque.', ['Vrai', 'Faux'], 0, 'Sans situation exposante, le dommage est très improbable.'],
            ['Le pipetage à la bouche expose surtout par…', ['Contact avec l’œil', 'Inhalation', 'Ingestion', 'Voie électrique'], 2, 'Il est interdit : on utilise toujours une propipette ou une pipette automatique.'],
            ['Lors d’un ensemencement, la formation d’aérosols expose surtout par…', ['Inhalation', 'Ingestion', 'Contact cutané', 'Voie sanguine'], 0, 'De fines gouttelettes contenant des micro-organismes peuvent être respirées.'],
            ['Au lycée, on manipule principalement des micro-organismes du groupe de risque…', ['Tous les groupes', '3', '4', '1'], 3, 'Le groupe 1 réunit les micro-organismes peu susceptibles de provoquer une maladie.'],
            ['Quelle mention d’avertissement signale les dangers les plus graves ?', ['Attention', 'Danger', 'Prudence', 'Avertissement'], 1, 'Le règlement CLP n’emploie que deux mentions : « Danger » et « Attention ».'],
            ['Une situation exposante est…', ['Un pictogramme', 'Un produit dangereux', 'Une blessure', 'Une situation où une personne est en contact avec le danger'], 3, 'Sans elle, le danger ne peut pas produire de dommage.'],
            ['Une culture contaminée par le manipulateur illustre…', ['Le risque d’ingestion', 'Le risque électrique', 'Le risque pour le produit', 'Un danger chimique'], 2, 'L’asepsie protège à la fois l’opérateur et l’échantillon.'],
            ['Un échantillon de sang humain doit être considéré comme…', ['Potentiellement infectieux', 'Sans danger s’il vient d’un proche', 'Un danger chimique seulement', 'Un déchet ménager'], 0, 'On ne connaît jamais avec certitude le statut infectieux d’un produit biologique humain.'],
            ['Pour prévenir une contamination, il suffit de rompre un seul maillon de la chaîne de transmission.', ['Vrai', 'Faux'], 0, 'Par exemple, les gants coupent la voie d’entrée par contact.'],
            ['Quelle est la dernière étape de l’analyse des risques ?', ['Lire la procédure', 'Relier les mesures de prévention aux risques identifiés', 'Repérer les pictogrammes', 'Commander les produits'], 1, 'Chaque mesure doit répondre à un risque identifié.'],
          ],
        },
        {
          titre: 'Se protéger au laboratoire : équipements, désinfection et déchets',
          axe: 'B – Prévenir les risques au laboratoire de biotechnologies',
          lecon: {
            titre: 'Les bons gestes, dans le bon ordre',
            cours: `Une fois les risques analysés, on applique des **mesures de prévention**. On privilégie toujours la protection **collective** ; la protection **individuelle** vient en complément.

## Protection collective et individuelle
| Type | Exemples | Ce qu’elle protège |
| **EPC** (équipements de protection collective) | hotte chimique, poste de sécurité microbiologique (PSM), ventilation, douche de sécurité, rince-œil | tout le laboratoire |
| **EPI** (équipements de protection individuelle) | blouse en coton fermée à manches longues, lunettes, gants adaptés | la personne qui les porte |

Le **poste de sécurité microbiologique** aspire l’air et le filtre : il protège le manipulateur, l’environnement et, selon sa classe, le produit. La **hotte chimique** évacue les vapeurs toxiques.

## Organiser son poste de travail
- paillasse dégagée, sacs et vêtements rangés ;
- cheveux attachés, pas de bijoux aux mains ;
- ne jamais boire, manger ni se maquiller au laboratoire ;
- matériel propre à gauche et matériel sale à droite (ou l’inverse), sans croiser les flux.

## Le lavage des mains
Les mains sont le premier vecteur de contamination. On les lave **avant et après** chaque manipulation, et après avoir retiré les gants.
1. Mouiller les mains.
2. Savonner (savon doux ou antiseptique) pendant au moins 30 secondes, en insistant sur les ongles, les pouces et les espaces entre les doigts.
3. Rincer abondamment.
4. Sécher avec un essuie-mains à usage unique, qui sert aussi à fermer le robinet.

## Désinfecter la paillasse
La **désinfection** élimine ou inactive la majorité des micro-organismes d’une surface inerte ; la **stérilisation** détruit **tous** les micro-organismes, spores comprises.
Procédure : désinfecter la paillasse **avant** la manipulation (protéger le produit) et **après** (protéger les suivants), avec un désinfectant adapté (souvent de l’éthanol à 70 % ou un désinfectant de surface), en respectant le **temps de contact** indiqué.

> Un désinfectant n’agit que s’il reste assez longtemps au contact de la surface : essuyer immédiatement, c’est annuler son action.

## Trier les déchets
| Déchet | Conteneur |
| Cultures, boîtes de Petri, cônes souillés | sac ou conteneur **DASRI** (déchets d’activités de soins à risques infectieux), autoclavé ou incinéré |
| Objets piquants ou coupants souillés | collecteur rigide DASRI |
| Solutions chimiques | bidons de **déchets chimiques** triés (solvants, acides, métaux lourds) — jamais à l’évier |
| Papiers propres | déchets ménagers |

## Niveaux de confinement
Les laboratoires sont classés en **niveaux de confinement** (L1 à L4) selon les micro-organismes manipulés : plus le groupe de risque est élevé, plus les mesures sont strictes (sas, pression négative, combinaisons). Un laboratoire de lycée est de niveau L1, parfois L2.`,
          },
          questions: [
            ['Quel équipement est une protection collective ?', ['Les gants', 'La hotte chimique', 'Les lunettes', 'La blouse'], 1, 'Elle protège toutes les personnes présentes, pas seulement le manipulateur.'],
            ['Une blouse de laboratoire doit être…', ['Portée hors du laboratoire', 'Ouverte pour être plus confortable', 'En matière synthétique', 'En coton, fermée, à manches longues'], 3, 'Le coton brûle moins dangereusement que le synthétique ; fermée, elle protège les vêtements.'],
            ['Quand faut-il se laver les mains ?', ['Avant et après chaque manipulation', 'Seulement à la fin de la séance', 'Uniquement si elles sont sales', 'Seulement avant de manger'], 0, 'Avant pour protéger le produit, après pour se protéger et protéger les autres.'],
            ['La stérilisation détruit…', ['Uniquement les virus', 'La majorité des micro-organismes d’une surface', 'Tous les micro-organismes, spores comprises', 'Uniquement les bactéries pathogènes'], 2, 'La désinfection, elle, réduit fortement la charge microbienne sans garantir l’absence totale de germes.'],
            ['Pourquoi désinfecter la paillasse avant la manipulation ?', ['Parce que c’est plus rapide', 'Pour la faire briller', 'Pour protéger le produit d’une contamination', 'Pour chauffer la surface'], 2, 'On la désinfecte aussi après, pour protéger les utilisateurs suivants.'],
            ['Une boîte de Petri contenant une culture bactérienne se jette…', ['Dans un conteneur DASRI', 'À la poubelle ordinaire', 'À l’évier', 'Dans le bidon de solvants'], 0, 'Elle sera autoclavée ou incinérée.'],
            ['Une solution de solvant usagée peut être jetée à l’évier si on la dilue.', ['Vrai', 'Faux'], 1, 'Les déchets chimiques sont collectés dans des bidons triés, jamais à l’évier.'],
            ['Que signifie DASRI ?', ['Dossier d’analyse des risques', 'Désinfection automatique des surfaces', 'Dispositif anti-souillure', 'Déchets d’activités de soins à risques infectieux'], 3, 'Ces déchets suivent une filière d’élimination spécifique.'],
            ['Le poste de sécurité microbiologique protège notamment…', ['Uniquement la culture', 'Le manipulateur et l’environnement', 'Uniquement contre les vapeurs d’acide', 'Contre le risque électrique'], 1, 'Il filtre l’air aspiré et rejeté ; certaines classes protègent aussi le produit.'],
            ['Pourquoi respecter le temps de contact d’un désinfectant ?', ['Parce qu’il est toxique', 'Pour qu’il sèche joliment', 'Pour éviter de l’acheter à nouveau', 'Il n’agit que s’il reste assez longtemps sur la surface'], 3, 'L’inactivation des micro-organismes demande un certain temps.'],
            ['Un laboratoire de lycée est en général de niveau de confinement…', ['L4', 'L3', 'L1, parfois L2', 'Aucun niveau'], 2, 'Les niveaux L3 et L4 sont réservés aux agents pathogènes graves.'],
            ['Dans la prévention, on privilégie d’abord…', ['La protection collective', 'Les gants', 'Les lunettes', 'La chance'], 0, 'Les EPI ne viennent qu’en complément des protections collectives.'],
          ],
        },
        {
          titre: 'Grandeurs, unités et instruments de mesure',
          axe: 'C – Obtenir des résultats de mesure fiables',
          lecon: {
            titre: 'Parler la langue de la mesure',
            cours: `La **métrologie** est la science de la mesure. Au laboratoire de biotechnologies, un résultat faux peut conduire à un mauvais diagnostic ou à un produit non conforme : il faut donc mesurer juste et savoir dire à quel point on est sûr.

## Le vocabulaire
| Terme | Sens | Exemple |
| **Mesurande** | la grandeur qu’on veut mesurer | la concentration en glucose du sérum |
| **Mesurage** | l’ensemble des opérations pour obtenir la valeur | la procédure de dosage |
| **Indication** | ce qu’affiche l’instrument | 0,452 sur le spectrophotomètre |
| **Valeur mesurée** | la valeur attribuée au mesurande | 5,2 mmol·L⁻¹ |

## Grandeurs de base et grandeurs dérivées
Les **grandeurs de base** du Système international ont leur unité propre : longueur (m), masse (kg), temps (s), quantité de matière (mol), température (K). Les **grandeurs dérivées** s’expriment à partir d’elles :
| Grandeur dérivée | Symbole | Relation | Unité |
| Concentration en masse | ρ ou C_m | m / V | g·L⁻¹ |
| Concentration en quantité de matière | C | n / V | mol·L⁻¹ |
| Masse volumique | ρ | m / V | kg·m⁻³ ou g·mL⁻¹ |

> Vérifier l’unité, c’est vérifier la formule : une concentration en masse obtenue en g·mL au lieu de g·mL⁻¹ trahit une erreur de calcul.

## Les indices
Un symbole seul est ambigu. On précise par des **indices** l’**entité** mesurée et la **matrice** dans laquelle elle se trouve : ρ(glucose, sérum) se lit « concentration en masse du glucose dans le sérum ». Deux valeurs sans indices ne sont pas comparables.

## Choisir l’instrument
| Verrerie | Graduation | Usage |
| **Fiole jaugée** | « in » : contient exactement son volume | préparer une solution |
| **Pipette jaugée** | « ex » : délivre exactement son volume | prélever un volume précis |
| **Pipette graduée** | « ex », moins exacte | prélever des volumes variés |
| **Éprouvette graduée** | peu exacte | volumes approximatifs |
| **Bécher, erlenmeyer** | indicatives | contenir, mélanger, jamais mesurer |

La verrerie **« in »** (in = dedans) est étalonnée pour **contenir** le volume ; la verrerie **« ex »** pour le **délivrer** (on ne souffle pas la dernière goutte d’une pipette jaugée à un trait).

Chaque instrument a un **intervalle de confiance des indications** (tolérance), inscrit sur la verrerie ou dans la **fiche technique** : par exemple 10,00 mL ± 0,02 mL pour une pipette jaugée de classe A. On choisit l’instrument selon l’exactitude demandée.

## Exemple
Pour prélever 5,0 mL d’un sérum à doser, on préfère une **pipette jaugée de 5 mL** (± 0,015 mL) à une éprouvette de 10 mL (± 0,2 mL) : l’erreur possible est plus de dix fois plus faible.`,
          },
          questions: [
            ['Le mesurande est…', ['L’appareil de mesure', 'La grandeur qu’on veut mesurer', 'Le nombre affiché par l’appareil', 'L’unité utilisée'], 1, 'Par exemple, la concentration en glucose d’un sérum.'],
            ['Quelle est l’unité usuelle d’une concentration en masse ?', ['mol·L⁻¹', 'g·L⁻¹', 'g·mol⁻¹', 'L·g⁻¹'], 1, 'Concentration en masse = masse de soluté / volume de solution.'],
            ['La concentration en quantité de matière s’exprime par…', ['C = m / n', 'C = m × V', 'C = V / n', 'C = n / V'], 3, 'Elle s’exprime en mol·L⁻¹.'],
            ['Une fiole jaugée est une verrerie…', ['« In » : elle contient exactement son volume', '« Ex » : elle délivre son volume', 'Sans précision', 'Utilisée pour chauffer'], 0, 'On l’utilise pour préparer une solution de volume exact.'],
            ['Pour prélever un volume exact de 10,0 mL, on choisit…', ['Une éprouvette de 100 mL', 'Un bécher', 'Une pipette jaugée', 'Un erlenmeyer'], 2, 'C’est la verrerie la plus exacte pour délivrer un volume fixe.'],
            ['Pourquoi préciser des indices comme ρ(glucose, sérum) ?', ['Pour arrondir le résultat', 'Pour changer l’unité', 'Pour indiquer l’entité et la matrice', 'Par pure décoration'], 2, 'Sans indices, on ne sait pas de quoi et dans quoi on parle.'],
            ['La graduation d’un bécher permet une mesure de volume précise.', ['Vrai', 'Faux'], 1, 'Ses graduations sont indicatives : il sert à contenir, pas à mesurer.'],
            ['La masse est une grandeur…', ['De base', 'Dérivée', 'Sans unité', 'Calculée à partir du volume'], 0, 'Son unité SI est le kilogramme.'],
            ['Où trouve-t-on la tolérance d’un instrument ?', ['Sur l’étiquette du produit à doser', 'Dans le compte rendu de l’élève', 'Nulle part', 'Sur l’instrument ou dans sa fiche technique'], 3, 'Elle indique l’intervalle de confiance des indications.'],
            ['L’indication d’un instrument est…', ['Le résultat final corrigé', 'Ce qu’il affiche', 'La tolérance', 'Le mesurande'], 1, 'Elle devient une valeur mesurée après traitement par le modèle de mesure.'],
            ['Pour une pipette jaugée « ex » à un trait, on…', ['Utilise la bouche', 'Souffle toujours la dernière goutte', 'Remplit au-delà du trait', 'Ne souffle pas la dernière goutte'], 3, 'Elle est étalonnée en tenant compte du liquide qui reste dans la pointe.'],
            ['Un résultat de concentration en g·mL au lieu de g·mL⁻¹ révèle…', ['Un instrument « in »', 'Une mesure très exacte', 'Une erreur dans le calcul', 'Une grandeur de base'], 2, 'L’analyse de l’unité permet de vérifier la formule employée.'],
          ],
        },
        {
          titre: 'Étalonner et exprimer un résultat de mesure',
          axe: 'C – Obtenir des résultats de mesure fiables',
          lecon: {
            titre: 'De l’indication à un résultat qu’on peut défendre',
            cours: `Un appareil comme le spectrophotomètre n’affiche pas une concentration : il affiche une absorbance. Pour passer de l’une à l’autre, il faut un **étalonnage**, puis un calcul rigoureux, puis une vérification.

## L’étalonnage
Un **étalon** est une solution dont la valeur (par exemple la concentration) est connue avec exactitude.
| Méthode | Principe |
| **Étalon unique** | on suppose la proportionnalité et on compare : C(essai) = C(étalon) × A(essai) / A(étalon) |
| **Gamme d’étalonnage** | on mesure plusieurs étalons, on trace la **courbe d’étalonnage** et on y lit la valeur de l’essai |

La gamme est plus sûre : elle vérifie que la relation est bien linéaire sur l’**intervalle de mesure**, et on ne doit lire un essai qu’**à l’intérieur** de cet intervalle.

## Le modèle de mesure
On écrit trois équations successives :
1. **L’équation aux grandeurs** : la relation littérale, par exemple C(essai) = C(étalon) × A(essai) / A(étalon).
2. **L’équation aux unités** : on remplace chaque grandeur par son unité pour vérifier l’homogénéité (mmol·L⁻¹ = mmol·L⁻¹ × sans unité).
3. **L’équation aux valeurs numériques** : on remplace par les nombres et on calcule.

## Exprimer le résultat
Le résultat s’écrit avec son **incertitude** et son unité : C = (5,2 ± 0,3) mmol·L⁻¹. Le nombre de chiffres significatifs suit l’incertitude : on n’écrit pas 5,2437 si l’incertitude vaut 0,3. L’écriture scientifique (2,5 × 10⁻³) évite les zéros ambigus.

## Les erreurs
| Erreur | Caractère | Exemple | Comment la repérer |
| **Aléatoire** | varie d’une mesure à l’autre | lecture du ménisque | dispersion des répétitions |
| **Systématique** | décale toujours dans le même sens | étalon mal préparé, appareil déréglé | étalon de contrôle |
| **Grossière** | faute ponctuelle | cuve inversée, mauvaise dilution | valeur aberrante |

## Vérifier l’exactitude : l’étalon de contrôle
Un **étalon de contrôle** est une solution de valeur connue, **indépendante** de l’étalon qui a servi à l’étalonnage. On le dose comme un essai. Si sa valeur mesurée tombe dans l’**intervalle d’acceptabilité** (valeur cible ± **erreur maximale tolérée**, EMT), la série est validée ; sinon, on cherche l’origine du défaut d’exactitude.

> L’étalon de dosage sert à **calculer** ; l’étalon de contrôle sert à **vérifier**. Les confondre, c’est vérifier un résultat avec l’outil qui l’a produit.

## Exemple travaillé
Étalon : C(étalon) = 5,00 mmol·L⁻¹, A = 0,400. Essai : A = 0,520.
- Équation aux grandeurs : C(essai) = C(étalon) × A(essai) / A(étalon).
- Valeurs : 5,00 × 0,520 / 0,400 = **6,50 mmol·L⁻¹**.
Contrôle : valeur cible 4,00 mmol·L⁻¹, EMT = 0,20 mmol·L⁻¹. Mesuré : 4,12. L’intervalle d’acceptabilité est [3,80 ; 4,20] : la série est **validée**.`,
          },
          questions: [
            ['Un étalon est une solution…', ['De valeur connue avec exactitude', 'De concentration inconnue', 'Toujours colorée', 'Préparée par l’élève sans contrôle'], 0, 'C’est la référence qui permet de relier l’indication à la valeur.'],
            ['Avec un étalon unique, la concentration de l’essai vaut…', ['C(étalon) × A(étalon) / A(essai)', 'C(étalon) × A(essai) / A(étalon)', 'A(essai) − A(étalon)', 'C(étalon) + A(essai)'], 1, 'On suppose la proportionnalité entre absorbance et concentration.'],
            ['Étalon à 2,0 g·L⁻¹ d’absorbance 0,50 ; essai d’absorbance 0,75. Concentration de l’essai ?', ['1,3 g·L⁻¹', '3,0 g·L⁻¹', '2,5 g·L⁻¹', '0,75 g·L⁻¹'], 1, '2,0 × 0,75 / 0,50 = 3,0 g·L⁻¹.'],
            ['L’équation aux unités sert à…', ['Trouver l’incertitude', 'Calculer la valeur numérique', 'Choisir le spectrophotomètre', 'Vérifier l’homogénéité de la formule'], 3, 'Si les unités ne concordent pas, la formule est fausse.'],
            ['Une erreur systématique…', ['Décale les résultats toujours dans le même sens', 'Varie au hasard d’une mesure à l’autre', 'N’arrive qu’une fois', 'N’existe pas avec un bon appareil'], 0, 'Un étalon mal préparé fausse toute la série de la même façon.'],
            ['À quoi sert l’étalon de contrôle ?', ['À faire le zéro de l’appareil', 'À calculer la concentration des essais', 'À vérifier l’exactitude de la série', 'À diluer les échantillons'], 2, 'Il doit être indépendant de l’étalon de dosage.'],
            ['Valeur cible 10,0 ; EMT 0,5 ; contrôle mesuré 10,7. La série est…', ['À moitié validée', 'Validée', 'Refusée', 'Impossible à juger'], 2, 'L’intervalle d’acceptabilité est [9,5 ; 10,5] : 10,7 en sort.'],
            ['Inverser deux cuves lors de la lecture est une erreur…', ['Grossière', 'Aléatoire', 'Systématique permanente', 'Inévitable'], 0, 'C’est une faute ponctuelle qui produit une valeur aberrante.'],
            ['On peut lire un essai en dehors de l’intervalle couvert par la gamme d’étalonnage.', ['Vrai', 'Faux'], 1, 'Hors de la gamme, rien ne garantit que la relation reste linéaire : on dilue l’essai.'],
            ['Quel résultat est correctement écrit ?', ['C = ± 0,3 mmol·L⁻¹', 'C = 5,2437 ± 0,3', 'C = 5,2 mmol', 'C = (5,2 ± 0,3) mmol·L⁻¹'], 3, 'Valeur, incertitude et unité, avec un nombre de chiffres cohérent.'],
            ['La dispersion de mesures répétées révèle surtout…', ['L’erreur systématique', 'L’erreur aléatoire', 'L’erreur grossière seulement', 'L’exactitude'], 1, 'Une erreur systématique ne se voit pas en répétant la même procédure.'],
            ['Pourquoi préférer une gamme d’étalonnage à un étalon unique ?', ['Elle supprime toutes les erreurs', 'Elle est plus rapide', 'Elle ne demande aucun calcul', 'Elle vérifie la linéarité sur l’intervalle de mesure'], 3, 'Plusieurs points confirment que la relation est bien proportionnelle.'],
          ],
        },
        {
          titre: 'Le microscope optique, l’état frais et la coloration de Gram',
          axe: '1 – Observer la diversité du vivant à l’échelle microscopique',
          lecon: {
            titre: 'Voir l’invisible',
            cours: `Une bactérie mesure environ un micromètre : pour la voir, il faut un **microscope optique** bien réglé et une préparation adaptée.

## Le microscope optique
Le **grossissement** total est le produit du grossissement de l’**oculaire** et de celui de l’**objectif** : oculaire × 10 et objectif × 40 donnent × 400.
| Objectif | Grossissement total (oculaire × 10) | Usage |
| × 10 | × 100 | repérer la préparation, cellules végétales |
| × 40 | × 400 | levures, cellules sanguines, état frais |
| × 100 à immersion | × 1 000 | bactéries sur frottis coloré |

**La démarche d’utilisation** :
1. Allumer, placer l’objectif le plus faible.
2. Poser la lame, centrer la préparation.
3. Mettre au point avec la vis macrométrique, puis micrométrique.
4. Passer à l’objectif supérieur en ne touchant plus qu’à la vis micrométrique.
5. Pour l’objectif × 100, déposer une goutte d’**huile à immersion** : elle évite la déviation de la lumière entre la lame et la lentille.

Le **champ microscopique** (la zone vue) rétrécit quand le grossissement augmente.

## L’état frais
On dépose une goutte de suspension (culture liquide ou colonie diluée dans de l’eau physiologique) sous une lamelle, **sans coloration**. On observe des cellules **vivantes** : forme, taille approximative, groupement, et surtout **mobilité** (une bactérie mobile traverse le champ ; une bactérie immobile ne fait que trembler, c’est le mouvement brownien).

## La coloration de Gram
C’est une **coloration différentielle** : elle sépare les bactéries en deux groupes selon leur **paroi**.
1. **Frottis** : étaler, sécher, fixer à la chaleur.
2. **Violet de gentiane** : toutes les bactéries sont violettes.
3. **Lugol** (mordant) : fixe le violet.
4. **Alcool** (décoloration) : l’étape critique.
5. **Fuchsine** ou safranine (contre-coloration).
| Résultat | Paroi | Couleur finale |
| **Gram positif** | épaisse couche de peptidoglycane, retient le violet | **violet** |
| **Gram négatif** | peptidoglycane fin + membrane externe, se décolore | **rose** |

> L’étape de décoloration est le point critique : trop longue, des Gram positif deviennent roses ; trop courte, des Gram négatif restent violets. On valide avec des souches témoins connues.

## Dessiner une observation
Un dessin d’observation est **fidèle** (on dessine ce qu’on voit, pas ce qu’on sait), au crayon, avec un **titre**, une **échelle** ou le grossissement, et des **annotations** reliées par des traits horizontaux. Un **schéma**, lui, simplifie pour expliquer.

## Mesurer une cellule
Avec un **oculaire micrométrique** étalonné, ou le quadrillage d’un hématimètre de dimensions connues, on compte le nombre de graduations occupées par la cellule. Exemple : une graduation vaut 2,5 µm à × 400 ; une levure couvre 3 graduations : elle mesure environ **7,5 µm**.`,
          },
          questions: [
            ['Oculaire × 10 et objectif × 40 : quel grossissement total ?', ['× 4', '× 50', '× 400', '× 4 000'], 2, 'On multiplie les deux grossissements.'],
            ['L’huile à immersion s’utilise avec l’objectif…', ['× 100', '× 10', '× 40', '× 4'], 0, 'Elle limite la déviation de la lumière et améliore la netteté aux forts grossissements.'],
            ['Un état frais permet surtout d’observer…', ['Le type de paroi', 'La mobilité des bactéries vivantes', 'L’ADN', 'Les ribosomes'], 1, 'Sans coloration ni fixation, les cellules sont vivantes.'],
            ['Après une coloration de Gram, une bactérie Gram positif apparaît…', ['Rose', 'Violette', 'Verte', 'Incolore'], 1, 'Sa paroi épaisse de peptidoglycane retient le violet malgré l’alcool.'],
            ['Quelle étape de la coloration de Gram est la plus critique ?', ['L’observation', 'La fixation', 'Le séchage', 'La décoloration à l’alcool'], 3, 'Sa durée conditionne directement le résultat.'],
            ['Quel réactif sert de mordant dans la coloration de Gram ?', ['Le Lugol', 'La fuchsine', 'L’alcool', 'L’huile à immersion'], 0, 'Il forme avec le violet un complexe qui se fixe dans la paroi.'],
            ['Une bactérie qui tremble sur place sans se déplacer est mobile.', ['Vrai', 'Faux'], 1, 'Ce tremblement est le mouvement brownien ; une bactérie mobile traverse le champ.'],
            ['Quand on augmente le grossissement, le champ microscopique…', ['Reste le même', 'Augmente', 'Diminue', 'Disparaît'], 2, 'On voit plus gros mais une zone plus petite.'],
            ['En changeant d’objectif, on règle la mise au point avec…', ['Le diaphragme', 'La vis macrométrique en grand', 'La vis micrométrique seulement', 'La lampe'], 2, 'La vis macrométrique risquerait d’écraser la lame contre l’objectif.'],
            ['Un dessin d’observation doit être…', ['Fidèle, titré, légendé, avec une échelle', 'Colorié au feutre', 'Complété de ce qu’on sait du cours', 'Sans légende'], 0, 'On dessine ce qu’on voit réellement.'],
            ['Une graduation vaut 2 µm ; une cellule en couvre 5. Sa taille est…', ['0,4 µm', '2,5 µm', '7 µm', '10 µm'], 3, '5 × 2 µm = 10 µm.'],
            ['Une bactérie Gram négatif possède…', ['Une paroi très épaisse', 'Un peptidoglycane fin et une membrane externe', 'Un noyau', 'Aucune paroi'], 1, 'L’alcool traverse la membrane externe et décolore le peptidoglycane fin.'],
          ],
        },
        {
          titre: 'Bactéries, levures et micro-algues : la diversité des cellules',
          axe: '1 – Observer la diversité du vivant à l’échelle microscopique',
          lecon: {
            titre: 'Procaryotes et eucaryotes',
            cours: `Au microscope, on rencontre une grande diversité de micro-organismes. Pour les classer, il faut repérer les **critères cytologiques** qui les distinguent.

## Procaryotes et eucaryotes
| Critère | Procaryote (bactérie) | Eucaryote (levure, micro-algue, cellule humaine) |
| Noyau | **absent** : ADN libre dans le cytoplasme | **présent**, entouré d’une enveloppe |
| Taille | 1 à 5 µm | 5 à 100 µm |
| Organites membranaires | aucun | mitochondries, réticulum, Golgi, parfois chloroplastes |
| Paroi | peptidoglycane (sauf exceptions) | cellulose (végétaux), chitine et glucanes (champignons), absente (animaux) |
| Ribosomes | petits | plus gros |

## Trois micro-organismes à reconnaître
| | Bactérie | Levure | Micro-algue |
| Type | procaryote | eucaryote, champignon unicellulaire | eucaryote, photosynthétique |
| Taille | ≈ 1 µm | 5 à 10 µm | 5 à 50 µm |
| Signe distinctif | très petite, formes simples (coques, bacilles) | ovale, **bourgeonnement** | **chloroplastes** verts |
| Exemple | *Escherichia coli* | *Saccharomyces cerevisiae* (levure du boulanger) | *Chlorella* |

> Le bourgeon est la signature d’une levure : c’est ainsi qu’elle se reproduit, une petite cellule fille poussant sur la cellule mère.

Les **moisissures** sont aussi des champignons, mais filamenteux : on observe leur **appareil sporifère** (par exemple les têtes aspergillaires) au microscope.

## Microscopie optique ou électronique ?
| | Microscope optique | Microscope électronique |
| Rayonnement | lumière | électrons |
| Grossissement utile | jusqu’à × 1 000 à 1 500 | jusqu’à × 1 000 000 |
| Ce qu’on voit | cellules, forme des bactéries | détails des organites, virus, membranes |
| Aspect du cliché | souvent coloré, cellules vivantes possibles | noir et blanc (couleurs ajoutées), échantillon mort |

Un cliché où l’on distingue la double membrane d’une mitochondrie ou les ribosomes a forcément été obtenu au **microscope électronique**. L’**échelle** indiquée (barre de 1 µm, de 100 nm) aide aussi à trancher.

## L’arbre du vivant
Un **arbre phylogénétique** représente les liens de parenté entre êtres vivants. Le vivant se divise en trois grands **domaines** : les **Bactéries**, les **Archées** (procaryotes eux aussi) et les **Eucaryotes**. Levures, algues, plantes et animaux sont tous des eucaryotes : une levure est plus proche parente de l’être humain que d’une bactérie.

## Exemple
Un yaourt observé en état frais à × 1 000 montre de très petits bâtonnets et de petites sphères en chaînettes : ce sont des bactéries (lactobacilles et streptocoques). Une bière non filtrée montre des cellules ovales de 8 µm, certaines avec un bourgeon : ce sont des levures.`,
          },
          questions: [
            ['Qu’est-ce qui distingue d’abord une cellule procaryote ?', ['L’absence de ribosomes', 'La présence de chloroplastes', 'Sa grande taille', 'L’absence de noyau'], 3, 'Son ADN est libre dans le cytoplasme.'],
            ['Une levure est…', ['Une algue', 'Une bactérie', 'Un champignon unicellulaire eucaryote', 'Un virus'], 2, 'Elle possède un noyau et des organites.'],
            ['Quel signe permet de reconnaître une levure au microscope ?', ['Le bourgeonnement', 'Les chloroplastes', 'La coloration rose au Gram', 'Le flagelle'], 0, 'Une cellule fille pousse sur la cellule mère.'],
            ['Une micro-algue se reconnaît à…', ['Son absence de noyau', 'Ses chloroplastes', 'Sa paroi de peptidoglycane', 'Sa taille de 0,1 µm'], 1, 'Elle réalise la photosynthèse.'],
            ['Quelle taille a typiquement une bactérie ?', ['Environ 1 mm', 'Environ 1 µm', 'Environ 10 nm', 'Environ 100 µm'], 1, 'C’est à la limite de ce que distingue le microscope optique.'],
            ['Pour observer les ribosomes, il faut un microscope…', ['Une simple loupe', 'Optique × 400', 'Optique × 100', 'Électronique'], 3, 'Les ribosomes mesurent environ 20 à 30 nm.'],
            ['Les Archées sont des eucaryotes.', ['Vrai', 'Faux'], 1, 'Ce sont des procaryotes, formant un domaine distinct des Bactéries.'],
            ['Quels sont les trois domaines du vivant ?', ['Bactéries, Archées, Eucaryotes', 'Animaux, Végétaux, Champignons', 'Virus, Bactéries, Levures', 'Procaryotes, Virus, Algues'], 0, 'Les virus ne font pas partie de cette classification du vivant cellulaire.'],
            ['La paroi des bactéries contient en général…', ['De la chitine', 'De la cellulose', 'Du peptidoglycane', 'Du cholestérol'], 2, 'C’est elle que révèle la coloration de Gram.'],
            ['Un cliché en noir et blanc montrant la double membrane d’une mitochondrie provient…', ['D’une loupe binoculaire', 'D’un microscope optique', 'D’un microscope électronique', 'D’une échographie'], 2, 'Ces détails sont bien en dessous de la limite du microscope optique.'],
            ['Une levure est plus proche parente de l’être humain que d’une bactérie.', ['Vrai', 'Faux'], 0, 'Levures et humains sont tous deux eucaryotes.'],
            ['Chez une moisissure, on observe au microscope…', ['Des filaments et un appareil sporifère', 'Des bourgeons isolés seulement', 'Des chloroplastes', 'Des coques en chaînettes'], 0, 'Les moisissures sont des champignons filamenteux.'],
          ],
        },
        {
          titre: 'Travailler en asepsie et stériliser',
          axe: '2 – Cultiver des micro-organismes',
          lecon: {
            titre: 'Rien ne doit entrer, rien ne doit sortir',
            cours: `Des micro-organismes sont partout : sur la paillasse, dans l’air, sur la peau. Pour cultiver **uniquement** celui qu’on étudie, il faut travailler en **asepsie** avec du matériel **stérile**.

## Quelques définitions
| Terme | Sens |
| **Stérile** | exempt de tout micro-organisme vivant |
| **Aseptique** | qui empêche l’apport de micro-organismes extérieurs |
| **Stérilisation** | procédé qui rend un objet stérile (tous les micro-organismes, spores comprises) |
| **Désinfection** | élimination de la plupart des micro-organismes d’une surface inerte |

Les **micro-organismes environnementaux** se révèlent facilement : une gélose laissée ouverte à l’air, touchée avec un doigt ou frottée sur une poignée de porte se couvre de colonies après incubation.

## Organiser le poste en zone d’asepsie
1. Désinfecter la paillasse.
2. Allumer le **bec Bunsen** : il crée autour de sa flamme une **zone d’asepsie** (environ 15 à 20 cm) où les courants d’air chaud éloignent les particules.
3. Disposer tout le matériel à portée de main, dans la zone.
4. Ouvrir les tubes et boîtes le moins longtemps possible, près de la flamme, en tenant le bouchon dans la main.
5. **Flamber** l’anse métallique avant et après usage ; flamber l’ouverture des tubes.
6. Ne jamais poser un bouchon ou une pipette stérile sur la paillasse.

> Le travail aseptique protège dans les deux sens : la culture contre les contaminants, et le manipulateur contre la culture.

## Les procédés de stérilisation
| Procédé | Conditions | Pour quoi |
| **Autoclave** (chaleur humide sous pression) | 121 °C, environ 20 min (barème usuel) | milieux de culture, verrerie, déchets contaminés |
| **Four Pasteur** (chaleur sèche) | 170 à 180 °C, 1 h ou plus | verrerie vide |
| **Filtration** | membrane de pores 0,22 µm | liquides **thermosensibles** (vitamines, antibiotiques, certains sucres) |
| **Flambage** | flamme | anses, ouvertures de tubes |
| **Irradiation** | rayons gamma, industriel | boîtes et pipettes en plastique à usage unique |

L’**autoclave** fonctionne avec de la vapeur d’eau sous pression : à pression supérieure à la pression atmosphérique, l’eau bout au-dessus de 100 °C. On y repère le **manomètre** (pression) et le **barème** (couple température-durée). Seul le personnel habilité le fait fonctionner.

## Préparer un milieu stérile
Un milieu de culture est préparé (pesée de la poudre, dissolution, chauffage pour une gélose), réparti en tubes ou en flacons, puis **autoclavé**. Un composé thermosensible, stérilisé à part par **filtration**, est ajouté après refroidissement.

## Le niveau de confinement
Le **risque biologique** détermine le niveau de confinement : on n’ensemence au lycée que des souches de groupe 1 (parfois 2), dans un laboratoire de niveau adapté, avec élimination des cultures en DASRI après autoclavage.`,
          },
          questions: [
            ['Stérile signifie…', ['Désinfecté en surface', 'Nettoyé à l’eau', 'Pauvre en micro-organismes', 'Exempt de tout micro-organisme vivant'], 3, 'Aucun micro-organisme vivant, pas même une spore.'],
            ['La zone d’asepsie autour d’un bec Bunsen s’étend sur environ…', ['1 m', '15 à 20 cm', '2 mm', 'Toute la pièce'], 1, 'Les courants d’air chaud y éloignent les particules en suspension.'],
            ['Quel est le barème usuel de l’autoclave ?', ['60 °C pendant 10 min', '100 °C pendant 1 min', '37 °C pendant 24 h', '121 °C pendant environ 20 min'], 3, 'La vapeur sous pression atteint 121 °C et détruit même les spores.'],
            ['Comment stériliser une solution de vitamines sensible à la chaleur ?', ['Au four Pasteur', 'À l’autoclave', 'Par filtration sur membrane de 0,22 µm', 'Par flambage'], 2, 'Les pores retiennent les bactéries sans chauffer la solution.'],
            ['On flambe l’anse métallique…', ['Avant et après usage', 'Seulement avant', 'Seulement après', 'Jamais'], 0, 'Avant pour ne pas contaminer la culture, après pour ne pas contaminer la paillasse.'],
            ['On peut poser le bouchon d’un tube stérile sur la paillasse pendant l’ensemencement.', ['Vrai', 'Faux'], 1, 'On le garde dans la main : la paillasse n’est pas stérile.'],
            ['Pourquoi l’autoclave atteint-il 121 °C avec de l’eau ?', ['Il utilise de l’huile', 'La vapeur est sous pression, l’eau bout au-dessus de 100 °C', 'Il fonctionne sous vide', 'Grâce à un rayonnement'], 1, 'L’augmentation de pression élève la température d’ébullition.'],
            ['Une gélose touchée avec un doigt puis incubée montre…', ['Aucune croissance', 'Des colonies de micro-organismes environnementaux', 'Des cristaux', 'Des cellules humaines en culture'], 1, 'La peau porte de nombreux micro-organismes.'],
            ['Le four Pasteur stérilise par…', ['Rayons UV', 'Chaleur humide sous pression', 'Filtration', 'Chaleur sèche'], 3, 'Il faut une température plus élevée et plus longue qu’avec la chaleur humide.'],
            ['Le travail aseptique protège…', ['La culture et le manipulateur', 'Uniquement le manipulateur', 'Uniquement la culture', 'Uniquement la paillasse'], 0, 'Il empêche les échanges de micro-organismes dans les deux sens.'],
            ['Sur un autoclave, le manomètre indique…', ['La durée', 'La température', 'La pression', 'Le volume'], 2, 'Il permet de vérifier que les conditions du barème sont atteintes.'],
            ['Les boîtes de Petri en plastique à usage unique sont en général stérilisées par…', ['Flambage', 'Autoclave au lycée', 'Irradiation', 'Four Pasteur'], 2, 'Le plastique ne supporte pas la chaleur : l’industrie utilise les rayons gamma.'],
          ],
        },
        {
          titre: 'Milieux de culture, ensemencement et colonies',
          axe: '2 – Cultiver des micro-organismes',
          lecon: {
            titre: 'Nourrir, semer, observer',
            cours: `Cultiver un micro-organisme, c’est lui fournir ce dont il a besoin pour se multiplier. Le choix du milieu et des conditions dépend de ses **besoins nutritionnels** et de son **type trophique**.

## Les besoins nutritionnels
Tout micro-organisme a besoin d’une **source d’énergie**, d’une **source de carbone**, d’eau, d’azote et de sels minéraux.
| Type trophique | Source d’énergie | Source de carbone | Exemple |
| **Chimio-organotrophe** | oxydation de molécules organiques | organique (glucose) | *E. coli*, levures |
| **Photolithotrophe** (photoautotrophe) | lumière | minérale (CO₂) | micro-algues, cyanobactéries |

Un micro-organisme **non exigeant** pousse sur un milieu simple ; un micro-organisme **exigeant** a besoin de facteurs de croissance (vitamines, acides aminés).

## Les types de milieux
| Milieu | Rôle | Comment le reconnaître |
| **Ordinaire** | faire pousser la plupart des bactéries | composition simple (peptones, extrait de viande) |
| **D’isolement** | obtenir des **colonies** séparées | milieu solide (gélose) |
| **Sélectif** | ne laisser pousser qu’un groupe | contient des **agents inhibiteurs** (sels biliaires, cristal violet, antibiotique) |
| **D’orientation** | distinguer des groupes par un caractère | contient un **substrat fermentescible** (lactose) et un **indicateur de pH** |

Sur un milieu d’orientation lactosé, une bactérie qui **fermente le lactose** acidifie le milieu : l’indicateur de pH change de couleur autour de ses colonies.

## Les conditions physico-chimiques
- **Température** : la plupart des bactéries étudiées sont incubées à 37 °C (ou 30 °C) ; les levures à 25-30 °C.
- **pH** : souvent proche de 7 pour les bactéries, plus acide pour les levures et moisissures.
- **Concentration en NaCl** : quelques bactéries (staphylocoques) tolèrent un milieu très salé, ce qui sert à les sélectionner.
- **Dioxygène** : **aérobie stricte**, **anaérobie stricte**, **aéro-anaérobie facultative** ; on le teste en gélose profonde.

## Ensemencer
- **Milieu liquide** : on y dépose un **inoculum** ; sa densité peut être ajustée à l’aide d’un **étalon de Mac Farland** (comparaison de la **turbidité**).
- **Milieu solide** : **isolement par la méthode des quadrants** (stries successives) : l’anse dilue progressivement l’inoculum, et dans le dernier quadrant chaque cellule isolée donne une **colonie**.
On note sur chaque boîte (sur le fond, pas le couvercle) : nom, date, milieu, souche — c’est la **traçabilité**. Puis on incube, boîte **retournée** (couvercle en bas) pour éviter que la condensation ne tombe sur la gélose.

## Décrire une colonie
Une **colonie** est un amas visible de cellules issues d’une seule cellule (ou d’un petit groupe). On la décrit par : taille, forme, contour (régulier, dentelé), relief (bombé, plat), aspect (lisse, rugueux), couleur, opacité.

> Une culture est **pure** si toutes les colonies ont le même aspect. Une colonie différente des autres signale un **contaminant**.

## Exemple
Un produit laitier est ensemencé sur une gélose ordinaire et sur une gélose sélective des bactéries Gram négatif, lactosée avec indicateur. Sur la gélose ordinaire poussent de nombreux types de colonies ; sur la gélose sélective, seules quelques colonies, dont certaines entourées d’un virage de couleur : ce sont des bactéries Gram négatif lactose positif.`,
          },
          questions: [
            ['Une micro-algue qui utilise la lumière et le CO₂ est…', ['Photolithotrophe', 'Chimio-organotrophe', 'Parasite', 'Hétérotrophe exigeante'], 0, 'Énergie lumineuse, carbone minéral.'],
            ['Un milieu sélectif contient…', ['Des antibiotiques pour tuer toutes les bactéries', 'Uniquement de l’eau', 'Un indicateur de pH seulement', 'Des agents inhibiteurs'], 3, 'Ils empêchent certains micro-organismes de pousser pour favoriser les autres.'],
            ['Sur un milieu lactosé avec indicateur de pH, le virage de couleur autour d’une colonie signifie…', ['Qu’elle est morte', 'Qu’elle fermente le lactose et acidifie le milieu', 'Qu’elle est Gram positif', 'Qu’elle est contaminée'], 1, 'C’est le principe d’un milieu d’orientation.'],
            ['Une colonie est…', ['Un contaminant', 'Une seule bactérie', 'Un milieu de culture', 'Un amas visible issu d’une cellule ou d’un petit groupe'], 3, 'Des millions de cellules issues de la multiplication d’une seule.'],
            ['À quoi sert l’isolement par stries en quadrants ?', ['À stériliser la gélose', 'À compter précisément les bactéries', 'À obtenir des colonies bien séparées', 'À colorer les bactéries'], 2, 'L’inoculum est dilué de quadrant en quadrant.'],
            ['Pourquoi incube-t-on les boîtes retournées ?', ['Pour éviter que la condensation tombe sur la gélose', 'Pour gagner de la place', 'Pour que les bactéries respirent', 'Pour faciliter la lecture'], 0, 'Des gouttes sur la gélose étaleraient les colonies.'],
            ['Une culture pure présente des colonies toutes identiques.', ['Vrai', 'Faux'], 0, 'Une colonie d’aspect différent signale un contaminant.'],
            ['L’étalon de Mac Farland sert à…', ['Mesurer le pH', 'Ajuster la densité d’un inoculum par comparaison de turbidité', 'Stériliser un milieu', 'Colorer un frottis'], 1, 'On compare visuellement ou au densitomètre le trouble de la suspension.'],
            ['Où écrit-on les indications sur une boîte de Petri ?', ['Sur le couvercle', 'Sur le fond', 'Sur la gélose', 'Nulle part'], 1, 'Le couvercle peut être échangé ; le fond reste avec la culture.'],
            ['Une bactérie qui ne pousse qu’en absence de dioxygène est…', ['Photolithotrophe', 'Aérobie stricte', 'Aéro-anaérobie facultative', 'Anaérobie stricte'], 3, 'Le dioxygène lui est toxique.'],
            ['Un milieu d’orientation contient notamment…', ['Un substrat fermentescible et un indicateur de pH', 'Uniquement des sels biliaires', 'De l’huile à immersion', 'Des globules rouges seulement'], 0, 'Il révèle un caractère métabolique par un changement de couleur.'],
            ['Les levures sont en général incubées vers…', ['60 °C', '4 °C', '25 à 30 °C', '121 °C'], 2, 'Elles préfèrent des températures plus basses que les bactéries pathogènes de l’humain.'],
          ],
        },
        {
          titre: 'Nommer et identifier les micro-organismes par leur morphologie',
          axe: '3 – Caractériser pour identifier les micro-organismes',
          lecon: {
            titre: 'Un nom, une forme, un groupement',
            cours: `Identifier un micro-organisme, c’est lui donner son nom exact à partir de ses caractères. En première, on s’appuie surtout sur les **caractères morphologiques**, observés sur une **souche pure**.

## Les règles de nomenclature
Chaque espèce porte un **nom binomial** en latin :
- le **genre** avec une majuscule, puis l’**espèce** en minuscule : *Escherichia coli* ;
- en **italique** à l’écrit tapé, **souligné** à la main ;
- après une première mention, le genre peut s’abréger : *E. coli* ;
- « sp. » désigne une espèce non déterminée d’un genre : *Bacillus* sp.
Les noms de **familles** se terminent en **-aceae** et s’écrivent sans italique obligatoire, avec une majuscule : Enterobacteriaceae.

## La hiérarchie de la classification
Domaine → phylum → classe → ordre → **famille** → **genre** → **espèce**. Chaque niveau est un **taxon**. Plus on descend, plus les individus se ressemblent.

Un **dendrogramme** représente la proximité génétique : on y lit un **pourcentage de similitude** entre souches. Par exemple, deux souches à plus de 97 % de similitude de leur ADN ribosomique appartiennent souvent à la même espèce.

## Les caractères morphologiques des bactéries
| Critère | Possibilités |
| **Forme** | coques (sphériques), bacilles (bâtonnets), coccobacilles, spirilles (spirales), vibrions (virgules) |
| **Taille** | ≈ 1 µm pour les coques, 2 à 5 µm de long pour les bacilles |
| **Mode de groupement** | isolés, **diplocoques** (par deux), **chaînettes** (streptocoques), **amas** en grappe (staphylocoques) |
| **Gram** | positif (violet) ou négatif (rose) |
| **Mobilité** | à l’état frais |

> Le mode de groupement vient du mode de division : des coques qui se divisent toujours dans le même plan forment des chaînettes, dans plusieurs plans des amas.

## Distinguer levure et bactérie
| | Levure | Bactérie |
| Taille | 5 à 10 µm | ≈ 1 µm |
| Forme | ovale ou ronde | coque, bacille… |
| Bourgeon | souvent | jamais |
| Noyau | oui (peu visible sans coloration) | non |
Un état frais de kéfir ou de levain montre à la fois de grosses cellules ovales bourgeonnantes (levures) et de petits coques (bactéries lactiques).

## Aller plus loin : les caractères métaboliques
La morphologie ne suffit pas toujours : deux bacilles Gram négatif peuvent être très différents. On complète par des **caractères culturaux** (aspect des colonies, croissance sur milieux sélectifs) et **métaboliques** (fermentation des sucres, enzymes) : ce sera le programme de terminale.

## Exemple
Coloration de Gram : coques violets en grappes, environ 1 µm. Conclusion morphologique : **coques Gram positif en amas**, orientation vers le genre *Staphylococcus*. Pour aller jusqu’à l’espèce, il faudra des tests complémentaires.`,
          },
          questions: [
            ['Comment écrit-on correctement le nom de la bactérie du côlon ?', ['ESCHERICHIA COLI', 'Escherichia Coli', 'Escherichia coli, en italique', 'escherichia coli'], 2, 'Genre avec majuscule, espèce en minuscule, le tout en italique.'],
            ['Dans le nom Staphylococcus aureus, « Staphylococcus » est…', ['Le genre', 'L’espèce', 'La famille', 'Le domaine'], 0, 'Le premier mot du nom binomial est le genre.'],
            ['Les noms de familles bactériennes se terminent par…', ['-ales', '-coccus', '-us', '-aceae'], 3, 'Exemple : Enterobacteriaceae.'],
            ['Des coques en grappe évoquent le genre…', ['Streptococcus', 'Staphylococcus', 'Escherichia', 'Saccharomyces'], 1, 'Du grec staphylê, la grappe de raisin.'],
            ['Des coques en chaînettes évoquent le genre…', ['Vibrio', 'Staphylococcus', 'Bacillus', 'Streptococcus'], 3, 'Du grec streptos, la chaîne tressée.'],
            ['« Bacillus sp. » signifie…', ['Une souche spéciale', 'Toutes les espèces de Bacillus', 'Une espèce non déterminée du genre Bacillus', 'Un bacille sporulé'], 2, 'On connaît le genre mais pas encore l’espèce.'],
            ['Un bacille est une bactérie…', ['En forme de bâtonnet', 'Sphérique', 'En spirale', 'En virgule'], 0, 'Les formes sphériques sont les coques.'],
            ['La présence d’un bourgeon distingue une levure d’une bactérie.', ['Vrai', 'Faux'], 0, 'Les bactéries se divisent en deux ; les levures bourgeonnent.'],
            ['Quel est le taxon le plus précis de la liste ?', ['Le genre', 'L’espèce', 'La famille', 'L’ordre'], 1, 'C’est le dernier niveau de la hiérarchie.'],
            ['Un dendrogramme permet de lire…', ['La taille des colonies', 'La proximité génétique entre souches', 'Le pH d’un milieu', 'La concentration en glucose'], 1, 'Il indique les pourcentages de similitude entre taxons.'],
            ['Les caractères morphologiques suffisent toujours à identifier l’espèce.', ['Vrai', 'Faux'], 1, 'Ils orientent ; les caractères culturaux et métaboliques confirment.'],
            ['À la main, le nom d’une espèce se…', ['Écrit sans distinction', 'Met entre guillemets', 'Écrit en majuscules', 'Souligne'], 3, 'Le soulignement remplace l’italique à l’écrit manuscrit.'],
          ],
        },
        {
          titre: 'Dénombrer les micro-organismes',
          axe: '4 – Réaliser un dénombrement de micro-organismes présents dans un produit biologique',
          lecon: {
            titre: 'Combien sont-ils ?',
            cours: `Un produit alimentaire ou une eau est conforme si sa charge microbienne reste sous un seuil. Il faut donc savoir **combien** de micro-organismes il contient par gramme ou par millilitre : c’est le **dénombrement**.

## Deux méthodes au programme
| Méthode | Principe | Compte | Avantages et limites |
| **Numération directe** au microscope (hématimètre) | on compte les cellules dans un volume connu | cellules **totales**, vivantes et mortes | rapide ; ne distingue pas les cellules viables ; il faut des cellules assez grosses (levures, micro-algues) |
| **Dénombrement après culture** en milieu solide | chaque cellule viable donne une colonie | cellules **revivifiables** (UFC) | plus long (incubation) ; seules les cellules capables de se multiplier sont comptées |

## La numération à l’hématimètre
Un **hématimètre** (cellule de Malassez, de Thoma…) est une lame creusée d’une chambre de profondeur connue et gravée d’un quadrillage : chaque rectangle correspond à un volume précis. On compte les cellules dans plusieurs rectangles, on fait la moyenne, puis on divise par le volume.
Exemple : cellule de Malassez, un rectangle = 0,01 µL = 10⁻⁵ mL. On compte en moyenne 40 levures par rectangle dans une suspension diluée au 1/10. Concentration = 40 / 10⁻⁵ × 10 = **4 × 10⁷ cellules par mL**.

## Le dénombrement après culture
1. **Préparer la suspension mère** : peser l’échantillon (par exemple 10 g) et l’ajouter à 90 mL de diluant : suspension au 1/10.
2. **Réaliser des dilutions décimales en série** : 1 mL de la suspension + 9 mL de diluant donne 10⁻², et ainsi de suite.
3. **Ensemencer un volume exact** (souvent 1 mL en profondeur, ou 0,1 mL en surface) de plusieurs dilutions.
4. Incuber, puis compter les boîtes qui ont un nombre de colonies **exploitable** (en général entre 15 et 300 environ).

Chaque colonie provient d’une cellule ou d’un petit amas : on exprime le résultat en **UFC** (unités formant colonies).

## Le calcul
> N = n / (V × d), où N est la concentration en UFC par mL (ou par g), n le nombre de colonies, V le volume ensemencé en mL, d le facteur de dilution de la suspension ensemencée (par exemple 10⁻³).

Exemple : 1 mL de la dilution 10⁻³ ensemencé donne 150 colonies. N = 150 / (1 × 10⁻³) = **1,5 × 10⁵ UFC par mL** (ou par g si la suspension mère est rapportée au gramme). On arrondit à deux chiffres significatifs.

## Interpréter
Le résultat est comparé à un **critère microbiologique**, c’est-à-dire une **valeur de référence réglementaire** : par exemple un nombre maximal de germes par gramme d’un aliment. Au-delà, le produit est non conforme. Les méthodes officielles sont **normalisées** : même milieu, même température, même durée d’incubation, pour que deux laboratoires trouvent des résultats comparables.

## Pièges fréquents
- Oublier de multiplier par l’inverse de la dilution.
- Compter une boîte trop chargée (colonies confluentes) ou trop pauvre (peu représentative).
- Changer de pipette entre chaque dilution est indispensable : sinon on transporte des cellules en trop.`,
          },
          questions: [
            ['La numération à l’hématimètre compte…', ['Toutes les cellules, vivantes et mortes', 'Seulement les cellules revivifiables', 'Les colonies', 'Les spores seulement'], 0, 'Au microscope, on ne distingue pas une cellule viable d’une cellule morte.'],
            ['Que signifie UFC ?', ['Unité de filtration contrôlée', 'Unité de fermentation cellulaire', 'Unité formant colonie', 'Unité fongique cultivée'], 2, 'Une colonie peut provenir d’une cellule ou d’un petit amas.'],
            ['1 mL de suspension + 9 mL de diluant donne une dilution au…', ['1/100', '1/9', '1/10', '1/1'], 2, 'Volume final 10 mL, dont 1 mL de suspension.'],
            ['On ensemence 1 mL de la dilution 10⁻² et on compte 80 colonies. La concentration est…', ['8,0 × 10³ UFC par mL', '80 UFC par mL', '8,0 × 10⁻¹ UFC par mL', '8,0 × 10⁵ UFC par mL'], 0, 'N = 80 / (1 × 10⁻²) = 8 000 UFC par mL.'],
            ['On ensemence 0,1 mL de la dilution 10⁻³ et on compte 50 colonies. La concentration est…', ['5,0 × 10⁶ UFC par mL', '5,0 × 10⁴ UFC par mL', '5,0 × 10³ UFC par mL', '5,0 × 10⁵ UFC par mL'], 3, 'N = 50 / (0,1 × 10⁻³) = 500 000 UFC par mL.'],
            ['Quelles boîtes retient-on pour le calcul ?', ['Celles qui ont le plus de colonies', 'Celles ayant un nombre de colonies exploitable, environ 15 à 300', 'Celles qui n’ont aucune colonie', 'Toutes, sans exception'], 1, 'Trop de colonies se chevauchent ; trop peu ne sont pas représentatives.'],
            ['Pourquoi change-t-on de pipette entre chaque dilution ?', ['Pour stériliser le diluant', 'Pour gagner du temps', 'Par économie', 'Pour ne pas transporter de cellules en excès'], 3, 'Une pipette déjà utilisée garde des cellules sur ses parois.'],
            ['Un critère microbiologique est…', ['Un milieu de culture', 'Une espèce bactérienne', 'Une valeur de référence réglementaire', 'Un type de microscope'], 2, 'On y compare le résultat pour juger la conformité du produit.'],
            ['Le dénombrement après culture ne compte que les cellules capables de se multiplier.', ['Vrai', 'Faux'], 0, 'On parle de cellules revivifiables.'],
            ['Pourquoi les méthodes de dénombrement sont-elles normalisées ?', ['Pour que les résultats de laboratoires différents soient comparables', 'Pour aller plus vite', 'Pour éviter de diluer', 'Pour se passer de témoins'], 0, 'Même milieu, même incubation, même calcul.'],
            ['Un rectangle de cellule de Malassez vaut 10⁻⁵ mL ; on y compte 20 cellules en moyenne, sans dilution. Concentration ?', ['2 × 10⁵ cellules par mL', '2 × 10⁶ cellules par mL', '2 × 10⁻⁴ cellules par mL', '20 cellules par mL'], 1, '20 / 10⁻⁵ = 2 × 10⁶ cellules par mL.'],
            ['10 g d’aliment dans 90 mL de diluant donne…', ['Une suspension au 1/9', 'Une suspension mère au 1/10', 'Une suspension au 1/100', 'Une solution non diluée'], 1, '10 g dans un total d’environ 100 : dilution 10⁻¹.'],
          ],
        },
        {
          titre: 'Préparer une solution par pesée ou par dilution',
          axe: '5 – Préparer des solutions utilisables au laboratoire',
          lecon: {
            titre: 'Le geste juste au bon volume',
            cours: `Presque toute manipulation commence par une solution à préparer : un tampon, un réactif, une gamme d’étalonnage. Une erreur à ce stade fausse tout ce qui suit.

## Deux façons de préparer une solution
| Méthode | Point de départ | Grandeur d’entrée | Grandeur de sortie |
| **Par pesée** (dissolution) | un solide | la **masse** pesée | la concentration de la solution |
| **Par dilution** | une solution plus concentrée (solution mère) | le **volume** prélevé | la concentration de la solution fille |

## Préparer par pesée
Relation : **ρ = m / V**, donc **m = ρ × V**.
1. Calculer la masse à peser.
2. Peser dans une coupelle, sur une balance adaptée (tarée), en notant la **masse exacte** pesée.
3. Transférer dans une **fiole jaugée**, en rinçant la coupelle avec le solvant.
4. Dissoudre avec environ la moitié du volume de solvant, en agitant.
5. Compléter **jusqu’au trait de jauge** (bas du ménisque au niveau du trait, œil à la hauteur du trait).
6. Boucher et homogénéiser en retournant la fiole plusieurs fois.
Exemple : 100,0 mL d’une solution de glucose à 5,0 g·L⁻¹ demandent m = 5,0 × 0,1000 = **0,50 g**.

## Préparer par dilution
La quantité de soluté se **conserve** : ce qui est prélevé dans la solution mère se retrouve dans la solution fille.
> Ci × Vi = Cf × Vf, et le **facteur de dilution** F = Ci / Cf = Vf / Vi.
1. Calculer le volume à prélever : Vi = Cf × Vf / Ci.
2. Prélever avec une **pipette jaugée** (ou graduée, ou automatique) la solution mère versée dans un bécher (jamais pipeter directement dans le flacon).
3. Verser dans la fiole jaugée de volume Vf.
4. Compléter au trait avec le solvant, boucher, homogénéiser.
Exemple : préparer 50,0 mL d’une solution à 0,20 mol·L⁻¹ à partir d’une solution à 1,0 mol·L⁻¹. F = 5, donc Vi = 50,0 / 5 = **10,0 mL** (pipette jaugée de 10 mL, fiole de 50 mL).

## Choisir le matériel
| Besoin | Matériel adapté |
| Contenir un volume exact | fiole jaugée |
| Délivrer un volume exact | pipette jaugée, micropipette réglée |
| Peser 0,50 g | balance au centigramme au minimum, au milligramme de préférence |
| Volume approximatif de solvant | éprouvette, bécher |

## Les points critiques
- Oublier de rincer la coupelle : perte de soluté, concentration trop faible.
- Dépasser le trait de jauge : il faut tout recommencer.
- Ne pas homogénéiser : la solution n’a pas la même concentration partout.
- Confondre concentration initiale et concentration finale dans la formule.

Un soluté coloré (bleu de méthylène, colorant alimentaire) permet de visualiser la conservation de la matière : la solution fille est plus claire, mais contient exactement ce qui a été prélevé.`,
          },
          questions: [
            ['Quelle masse de glucose faut-il pour 250,0 mL à 4,0 g·L⁻¹ ?', ['4,0 g', '16 g', '0,10 g', '1,0 g'], 3, 'm = ρ × V = 4,0 × 0,2500 = 1,0 g.'],
            ['La relation de la dilution est…', ['Ci × Vi = Cf × Vf', 'Ci + Vi = Cf + Vf', 'Ci / Vi = Cf / Vf', 'Ci × Vf = Cf × Vi'], 0, 'Elle traduit la conservation de la quantité de soluté.'],
            ['On veut diluer 10 fois pour obtenir 100,0 mL. Quel volume de solution mère prélever ?', ['90,0 mL', '1,0 mL', '10,0 mL', '100,0 mL'], 2, 'Vi = Vf / F = 100,0 / 10 = 10,0 mL.'],
            ['Dans quel récipient prépare-t-on une solution de volume exact ?', ['Une éprouvette', 'Un bécher', 'Une fiole jaugée', 'Un erlenmeyer'], 2, 'Elle est étalonnée pour contenir exactement son volume.'],
            ['Pourquoi rince-t-on la coupelle de pesée dans la fiole ?', ['Pour ne perdre aucune partie du soluté', 'Pour refroidir la solution', 'Pour nettoyer la balance', 'Pour diluer deux fois'], 0, 'Sinon, la concentration obtenue est trop faible.'],
            ['Le facteur de dilution F vaut…', ['Vi / Vf', 'Cf / Ci', 'Ci × Cf', 'Ci / Cf'], 3, 'Il vaut aussi Vf / Vi ; il est toujours supérieur à 1.'],
            ['Si l’on dépasse le trait de jauge, on peut retirer le surplus à la pipette.', ['Vrai', 'Faux'], 1, 'Du soluté partirait avec : la solution est à refaire.'],
            ['Solution mère à 2,0 mol·L⁻¹ ; on prélève 5,0 mL qu’on complète à 50,0 mL. Concentration fille ?', ['20 mol·L⁻¹', '0,20 mol·L⁻¹', '0,50 mol·L⁻¹', '2,0 mol·L⁻¹'], 1, 'Cf = 2,0 × 5,0 / 50,0 = 0,20 mol·L⁻¹.'],
            ['Dans une préparation par dilution, la grandeur d’entrée est…', ['Le pH', 'La masse de solide', 'La température', 'Le volume prélevé de solution mère'], 3, 'La grandeur de sortie est la concentration de la solution fille.'],
            ['Pour lire le trait de jauge, l’œil doit être…', ['En dessous du trait', 'Au-dessus de la fiole', 'À la hauteur du trait, bas du ménisque sur le trait', 'N’importe où'], 2, 'Sinon, une erreur de parallaxe fausse le volume.'],
            ['Pourquoi homogénéiser la solution après avoir complété au trait ?', ['Pour que la concentration soit la même partout', 'Pour la stériliser', 'Pour la chauffer', 'Pour changer sa couleur'], 0, 'Le solvant ajouté en dernier reste sinon en surface.'],
            ['On prélève la solution mère…', ['Directement dans le flacon', 'Dans un bécher, jamais directement dans le flacon', 'Avec une éprouvette pour être exact', 'À la bouche'], 1, 'On évite ainsi de contaminer le flacon d’origine.'],
          ],
        },
        {
          titre: 'Détecter une biomolécule : réactifs, spectres et enzymes',
          axe: '6 – Détecter et caractériser les biomolécules',
          lecon: {
            titre: 'Oui ou non, et pourquoi',
            cours: `Avant de doser, on veut souvent savoir si une molécule est **présente** : c’est une approche **qualitative**. On s’appuie sur une propriété chimique, physique ou biologique de la molécule.

## Détecter par un réactif chimique
| Biomolécule | Réactif | Résultat positif |
| **Amidon** | eau iodée (Lugol) | coloration **bleu-noir** |
| **Glucose** (sucre réducteur) | liqueur de Fehling à chaud | précipité **rouge brique** |
| **Glucose** | bandelette à glucose oxydase | virage de couleur de la zone test |
| **Protéines** | réactif du **biuret** | coloration **violette** (liaisons peptidiques) |
| **Acides aminés** | **ninhydrine** à chaud | coloration **violette** |

Un réactif doit être **spécifique** : il ne doit réagir qu’avec la molécule recherchée (ou une famille précise). Le biuret réagit avec les liaisons peptidiques, pas avec les acides aminés libres.

## Les témoins
> Un résultat qualitatif ne vaut rien sans ses **témoins**. Le **témoin positif** (la molécule pure) doit réagir : il prouve que le réactif fonctionne. Le **témoin négatif** (le solvant seul) ne doit pas réagir : il prouve que le résultat n’est pas dû au milieu.

Un essai est interprétable seulement si les deux témoins donnent le résultat attendu.

## Caractériser une molécule colorée par son spectre
Une molécule **chromophore** absorbe une partie de la lumière visible. Au **spectrophotomètre**, on mesure l’**absorbance** A pour chaque longueur d’onde : c’est le **spectre d’absorption**. Il présente un maximum à la **longueur d’onde optimale** (λmax), caractéristique de la molécule.
1. Faire le **zéro** (le « blanc ») avec une cuve contenant le solvant seul.
2. Mesurer l’absorbance de la solution à différentes longueurs d’onde.
3. Tracer A = f(λ) et repérer λmax.
La couleur perçue est la **couleur complémentaire** de celle absorbée : une solution qui absorbe vers 600 nm (orange) paraît bleue.

## Choisir la cuve
| Cuve | Domaine utilisable |
| Plastique (polystyrène) | visible |
| Verre | visible |
| **Quartz** | ultraviolet et visible (indispensable pour l’ADN à 260 nm) |
On tient la cuve par ses faces dépolies, on la remplit aux trois quarts et on la place dans le bon sens du faisceau.

## Détecter une enzyme par son activité
Une enzyme se détecte par ce qu’elle **fait** : on lui fournit son **substrat spécifique** et on regarde si le produit apparaît, à pH et température fixés (proches de ses valeurs optimales).
Exemple dans le lait :
- La **phosphatase alcaline** (PAL) est détruite par la pasteurisation : un lait pasteurisé doit donner un test **négatif**. Un test positif signale une pasteurisation insuffisante.
- La **peroxydase** (POD), plus résistante, n’est détruite que par un chauffage plus fort.
Remplacer le substrat par une molécule très proche qui ne réagit pas démontre la **spécificité** de l’enzyme.`,
          },
          questions: [
            ['L’eau iodée révèle la présence…', ['De glucose', 'D’amidon', 'De protéines', 'De lipides'], 1, 'L’amidon donne une coloration bleu-noir.'],
            ['Le réactif du biuret détecte…', ['L’ADN', 'Le glucose', 'L’amidon', 'Les liaisons peptidiques des protéines'], 3, 'La coloration violette apparaît avec au moins deux liaisons peptidiques.'],
            ['La liqueur de Fehling à chaud donne un précipité rouge brique avec…', ['Un sucre réducteur comme le glucose', 'L’amidon', 'Les protéines', 'L’eau pure'], 0, 'Le glucose réduit les ions cuivre(II) en oxyde de cuivre(I) rouge.'],
            ['Le témoin positif sert à prouver…', ['Que le résultat est négatif', 'Que l’échantillon est pur', 'Que le réactif fonctionne', 'Que la manipulation est terminée'], 2, 'S’il ne réagit pas, le réactif est défectueux.'],
            ['Pour faire le zéro du spectrophotomètre, on utilise…', ['Une cuve vide', 'La solution la plus concentrée', 'Une cuve contenant le solvant seul', 'De l’eau iodée'], 2, 'On élimine ainsi l’absorbance du solvant et de la cuve.'],
            ['Pour mesurer l’absorbance de l’ADN à 260 nm, il faut une cuve…', ['En quartz', 'En plastique', 'En verre ordinaire', 'En métal'], 0, 'Le plastique et le verre absorbent les ultraviolets.'],
            ['Une solution qui absorbe surtout l’orange paraît…', ['Jaune', 'Orange', 'Rouge', 'Bleue'], 3, 'On voit la couleur complémentaire de celle absorbée.'],
            ['Un lait pasteurisé donne un test phosphatase alcaline positif. Cela signifie…', ['Que le lait est bien pasteurisé', 'Que la pasteurisation a été insuffisante', 'Que le lait est stérile', 'Que le test est inutile'], 1, 'La PAL doit être détruite par une pasteurisation correcte.'],
            ['Un résultat qualitatif est interprétable même si le témoin négatif réagit.', ['Vrai', 'Faux'], 1, 'Un témoin négatif positif signale une contamination ou un réactif non spécifique.'],
            ['La longueur d’onde optimale correspond…', ['À 500 nm pour toutes les molécules', 'Au minimum d’absorbance', 'À la couleur de la solution', 'Au maximum d’absorbance du spectre'], 3, 'On y mesure pour avoir la meilleure sensibilité.'],
            ['On détecte une enzyme en lui fournissant…', ['Un antibiotique', 'Un colorant', 'Son substrat spécifique', 'De l’huile à immersion'], 2, 'Si le produit apparaît, l’enzyme est présente et active.'],
            ['La ninhydrine à chaud révèle…', ['Les acides aminés', 'L’amidon', 'Les lipides', 'Le glucose'], 0, 'Elle sert aussi à révéler les taches d’acides aminés sur une CCM.'],
          ],
        },
        {
          titre: 'Séparer par chromatographie : CCM et échange d’ions',
          axe: '7 – Séparer les composants d’un mélange',
          lecon: {
            titre: 'Chaque molécule à son rythme',
            cours: `Un produit biologique est un mélange. Pour **identifier** ses composants ou les **récupérer**, on les sépare. En première, on étudie les **chromatographies**.

## Le principe commun
Toute chromatographie met en jeu deux phases :
- une **phase fixe** (stationnaire), qui **retient** les molécules : c’est la **force de rétention** ;
- une **phase mobile**, qui les **entraîne** : c’est la **force d’entraînement**.
Chaque molécule établit avec les phases des **liaisons faibles** différentes : celles qui sont peu retenues avancent vite, celles qui sont très retenues avancent lentement. Le mélange se sépare.

## La chromatographie sur couche mince (CCM)
C’est une chromatographie **analytique** : elle sert à identifier.
1. Tracer au crayon une ligne de dépôt à environ 1 cm du bas de la plaque (silice sur support).
2. Déposer de **petites** taches du mélange et des **étalons** (molécules pures connues).
3. Placer la plaque dans la cuve contenant un fond d’éluant (phase mobile), sous le niveau de la ligne de dépôt, et fermer.
4. Retirer quand le front de l’éluant est à 1 cm du haut ; marquer ce front.
5. Sécher et **révéler** (ninhydrine pour les acides aminés, réactif spécifique pour les sucres, lampe UV).

On calcule le **rapport frontal** :
> Rf = distance parcourue par la tache / distance parcourue par le front de l’éluant. Il est compris entre 0 et 1 et, dans des conditions données, caractéristique d’une molécule.

On identifie une tache du mélange quand elle a le **même Rf** (même hauteur) qu’un étalon.

Exemple : front à 8,0 cm ; tache à 3,2 cm. Rf = 3,2 / 8,0 = **0,40**.

## Les points critiques de la CCM
- Dépôts trop gros : taches étalées qui se chevauchent.
- Ligne de dépôt sous le niveau de l’éluant : les dépôts se dissolvent dans la cuve.
- Cuve non saturée en vapeur ou couvercle ouvert : migration irrégulière.
- Composition de l’éluant : elle détermine la séparation.
- Une molécule en trop faible quantité peut passer sous la **limite de détection** : absence de tache ne signifie pas absence de molécule.

## La chromatographie d’échange d’ions
C’est une chromatographie **préparative** : on veut **récupérer** les composants séparés. La phase fixe porte des **charges** (par exemple négatives, pour une résine échangeuse de cations) : les molécules de charge opposée s’y fixent par des **liaisons ioniques**.
1. **Fixation** : on dépose le mélange ; les molécules de charge opposée à la résine s’accrochent.
2. **Lavage** : on élimine ce qui ne s’est pas fixé.
3. **Élution** : on change le pH ou la concentration en sel de la phase mobile pour détacher une à une les molécules retenues, et on recueille des **fractions**.

La charge d’un acide aminé dépend du pH : la lysine est positive à pH 7, l’acide glutamique négatif. Sur une résine chargée négativement à pH 7, la lysine est retenue, l’acide glutamique passe directement. On repère ensuite chaque fraction par un dépôt sur silice révélé à la ninhydrine, ou par une CCM.`,
          },
          questions: [
            ['Dans une chromatographie, la phase mobile…', ['Retient les molécules', 'Entraîne les molécules', 'Révèle les taches', 'Est toujours solide'], 1, 'La phase fixe, elle, les retient.'],
            ['Front de l’éluant à 10,0 cm, tache à 6,0 cm. Rf ?', ['1,67', '0,60', '6,0', '0,40'], 1, 'Rf = 6,0 / 10,0 = 0,60.'],
            ['On identifie une tache du mélange quand elle a…', ['Un Rf égal à 1', 'La même couleur que l’éluant', 'Une taille plus grande', 'Le même Rf qu’un étalon'], 3, 'Dans les mêmes conditions, une même molécule migre à la même hauteur.'],
            ['La ligne de dépôt d’une CCM se trace…', ['Au crayon', 'Au feutre', 'Au stylo à bille', 'À l’encre de Chine'], 0, 'L’encre migrerait avec l’éluant et fausserait le chromatogramme.'],
            ['Pourquoi la ligne de dépôt doit-elle être au-dessus du niveau de l’éluant ?', ['Pour mieux voir les taches', 'Pour aller plus vite', 'Pour que les dépôts ne se dissolvent pas dans la cuve', 'Pour saturer la cuve'], 2, 'Les dépôts doivent migrer le long de la plaque, pas se diluer dans l’éluant.'],
            ['La CCM est une chromatographie…', ['Immunologique', 'Préparative', 'Analytique', 'Électrophorétique'], 2, 'Elle sert à identifier, pas à récupérer des quantités.'],
            ['Une molécule très retenue par la phase fixe a un Rf…', ['Faible', 'Élevé', 'Égal à 1', 'Supérieur à 1'], 0, 'Elle avance peu par rapport au front de l’éluant.'],
            ['Dans une chromatographie d’échange d’ions, les molécules se fixent à la résine par…', ['Des liaisons covalentes', 'Des liaisons peptidiques', 'Des ponts disulfure', 'Des liaisons ioniques'], 3, 'Charges opposées de la molécule et de la phase fixe.'],
            ['L’étape qui détache les molécules fixées s’appelle…', ['Le lavage', 'L’élution', 'La fixation', 'La révélation'], 1, 'On modifie le pH ou la force ionique de la phase mobile.'],
            ['Sur une résine chargée négativement à pH 7, quel acide aminé est retenu ?', ['Les deux', 'L’acide glutamique', 'Aucun', 'La lysine'], 3, 'La lysine est chargée positivement à pH 7.'],
            ['L’absence de tache sur une CCM prouve l’absence de la molécule.', ['Vrai', 'Faux'], 1, 'La molécule peut être présente sous la limite de détection.'],
            ['Des dépôts trop gros sur une CCM donnent…', ['Un Rf plus grand', 'Une meilleure séparation', 'Des taches étalées qui se chevauchent', 'Une migration plus rapide'], 2, 'Il faut des dépôts petits et concentrés.'],
          ],
        },
        {
          titre: 'Doser par spectrophotométrie : la loi de Beer-Lambert',
          axe: '8 – Déterminer la concentration d’une biomolécule dans un produit biologique',
          lecon: {
            titre: 'La couleur mesurée',
            cours: `Plus une solution colorée est concentrée, plus elle absorbe la lumière. La **spectrophotométrie** transforme cette observation en mesure précise de concentration.

## La loi de Beer-Lambert
= A = ε × ℓ × c
- A : **absorbance** (sans unité), mesurée à la longueur d’onde optimale ;
- ε : coefficient d’absorption molaire (L·mol⁻¹·cm⁻¹), propre à la molécule et à la longueur d’onde ;
- ℓ : longueur de la cuve traversée (souvent 1 cm) ;
- c : concentration (mol·L⁻¹).

> À ℓ et λ fixés, **l’absorbance est proportionnelle à la concentration**. Cette proportionnalité n’est vérifiée que pour des solutions assez diluées (en pratique, souvent A < 1,5 à 2).

## Chromophore et chromogène
- Un **chromophore** est coloré par lui-même : on le dose directement (colorant alimentaire, pigments chlorophylliens, ADN à 260 nm, protéines à 280 nm).
- Un **chromogène** est un produit coloré obtenu par **réaction** de la molécule à doser avec un réactif : c’est un dosage indirect.

## Le dosage en point final
Quand la molécule n’est pas colorée, on la fait réagir **totalement** avec un réactif chimique (biuret pour les protéines) ou **enzymatique** (glucose oxydase-peroxydase pour le glucose) qui forme un chromogène. On attend la fin de la réaction (point final), puis on lit l’absorbance. On qualifie ainsi un dosage de **chimique** ou d’**enzymatique** selon la nature du réactif.

## Le tableau de manipulation d’une gamme
| Tube | 0 (blanc) | 1 | 2 | 3 | 4 | Essai |
| Solution étalon à 1,0 g·L⁻¹ (mL) | 0 | 0,2 | 0,4 | 0,6 | 0,8 | — |
| Échantillon (mL) | — | — | — | — | — | 0,5 |
| Eau (mL) | 1,0 | 0,8 | 0,6 | 0,4 | 0,2 | 0,5 |
| Réactif (mL) | 4,0 | 4,0 | 4,0 | 4,0 | 4,0 | 4,0 |
| Masse de soluté (mg) | 0 | 0,2 | 0,4 | 0,6 | 0,8 | ? |

Tous les tubes ont le même volume total et le même volume de réactif : seule la quantité de soluté change. Le tube 0 sert à faire le zéro.

## Exploiter
On trace A = f(masse ou concentration) : les points s’alignent sur une droite passant par l’origine. On lit l’essai sur la droite (ou on utilise son coefficient directeur), puis on remonte à la concentration de l’échantillon en tenant compte du volume prélevé et des dilutions.

## Exemple travaillé
La droite d’étalonnage a pour équation A = 0,62 × m (m en mg). L’essai donne A = 0,31, donc m = 0,31 / 0,62 = 0,50 mg dans le tube. Cette masse provient de 0,5 mL d’échantillon : concentration = 0,50 mg / 0,5 mL = **1,0 mg·mL⁻¹ = 1,0 g·L⁻¹**.

## Les conditions opératoires
Respecter le temps de réaction, la température, la longueur d’onde, l’ordre d’ajout des réactifs ; utiliser la même cuve (ou des cuves appariées) ; placer l’essai dans le domaine de la gamme, sinon le diluer. Un **étalon de contrôle** vérifie l’exactitude de la série.`,
          },
          questions: [
            ['Dans la loi de Beer-Lambert A = ε × ℓ × c, ℓ désigne…', ['La longueur de cuve traversée par la lumière', 'La longueur d’onde', 'Le volume de la solution', 'Le coefficient d’absorption'], 0, 'Elle vaut généralement 1 cm.'],
            ['À ℓ et λ fixés, l’absorbance est…', ['Inversement proportionnelle à la concentration', 'Proportionnelle à la concentration', 'Indépendante de la concentration', 'Égale à la concentration'], 1, 'Tant que la solution est assez diluée.'],
            ['Un chromogène est…', ['Une molécule naturellement colorée', 'Un produit coloré formé par réaction avec la molécule à doser', 'Un spectrophotomètre', 'Un solvant'], 1, 'Il permet de doser une molécule incolore.'],
            ['ε = 1,0 × 10⁴ L·mol⁻¹·cm⁻¹, ℓ = 1 cm, A = 0,50. Concentration ?', ['0,50 mol·L⁻¹', '5,0 × 10³ mol·L⁻¹', '2,0 × 10⁻⁴ mol·L⁻¹', '5,0 × 10⁻⁵ mol·L⁻¹'], 3, 'c = A / (ε × ℓ) = 0,50 / 10 000 = 5,0 × 10⁻⁵ mol·L⁻¹.'],
            ['Dans une gamme d’étalonnage, le tube 0 sert…', ['À faire le zéro de l’appareil', 'À contenir l’échantillon', 'À contrôler la température', 'À diluer l’essai'], 0, 'Il contient tout sauf la molécule dosée.'],
            ['Le dosage du glucose par la glucose oxydase est un dosage…', ['Immunologique', 'Chimique', 'Enzymatique', 'Volumétrique'], 2, 'Le réactif est une enzyme spécifique du glucose.'],
            ['Un essai d’absorbance supérieure à celle du tube le plus concentré de la gamme doit être…', ['Ignoré', 'Lu par extrapolation', 'Dilué puis dosé à nouveau', 'Mesuré dans une cuve plus longue sans calcul'], 2, 'On ne lit un essai qu’à l’intérieur de la gamme.'],
            ['Tous les tubes de la gamme ont le même volume total.', ['Vrai', 'Faux'], 0, 'Ainsi, seule la quantité de soluté varie d’un tube à l’autre.'],
            ['La droite A = 0,40 × m (m en mg) ; l’essai lit A = 0,20. Masse dans le tube ?', ['0,50 mg', '0,08 mg', '2,0 mg', '0,20 mg'], 0, 'm = 0,20 / 0,40 = 0,50 mg.'],
            ['On dose directement l’ADN en mesurant l’absorbance à…', ['800 nm', '600 nm', '340 nm', '260 nm'], 3, 'Les bases azotées absorbent dans l’ultraviolet vers 260 nm.'],
            ['Pourquoi mesure-t-on à la longueur d’onde optimale ?', ['Parce que c’est plus rapide', 'Pour une sensibilité maximale', 'Pour éviter le zéro', 'Pour changer la couleur'], 1, 'L’absorbance y varie le plus pour une même variation de concentration.'],
            ['Un dosage en point final se lit…', ['Avant d’ajouter le réactif', 'Au tout début de la réaction', 'Pendant l’ajout du réactif', 'Une fois la réaction terminée'], 3, 'La coloration est alors stable et proportionnelle à la quantité de molécule.'],
          ],
        },
        {
          titre: 'Doser par volumétrie : titrage et équivalence',
          axe: '8 – Déterminer la concentration d’une biomolécule dans un produit biologique',
          lecon: {
            titre: 'Verser jusqu’au changement',
            cours: `Un **titrage** (dosage volumétrique) détermine la quantité d’une molécule en la faisant réagir avec une solution de concentration **connue**, versée progressivement jusqu’à ce que tout ait réagi.

## Les acteurs du titrage
| Rôle | Où | Exemple |
| **Solution à doser** (titrée) | bécher ou erlenmeyer, volume prélevé exactement | vinaigre dilué |
| **Solution titrante** (étalon) | **burette graduée** | soude de concentration connue |
| **Indicateur coloré** | quelques gouttes dans le bécher | phénolphtaléine |

La solution titrante est une **solution étalon** : sa concentration est connue avec exactitude, par exemple parce qu’elle a été préparée par pesée d’une **poudre étalon** ou prélevée dans une solution étalon commerciale.

## L’équivalence
La **réaction de dosage** doit être rapide, totale et unique. On distingue deux grands types :
- réaction **acido-basique** (échange d’ion H⁺) : acide éthanoïque + ion hydroxyde ;
- réaction d’**oxydo-réduction** (échange d’électrons) : vitamine C + DCPIP.

> À l’**équivalence**, les réactifs ont été introduits dans les **proportions de l’équation** : le réactif titré est entièrement consommé. Pour une réaction mole à mole : n(titré) = n(titrant versé), donc C1 × V1 = C2 × VE.

Le volume versé à ce moment s’appelle le **volume équivalent** VE. On le repère par le **changement de couleur** persistant de l’indicateur.

## Le schéma conventionnel
On représente : la burette (avec la solution titrante, sa concentration), le bécher (volume et nature de la solution à doser, indicateur), l’agitateur magnétique. Toute annotation utile (concentrations, volumes) figure sur le schéma.

## Exemple 1 : l’acide du vinaigre
On dose 10,0 mL de vinaigre dilué 10 fois par la soude à C2 = 0,100 mol·L⁻¹, en présence de phénolphtaléine (incolore en milieu acide, rose en milieu basique). Le rose persiste à VE = 12,0 mL.
Équation : CH₃COOH + HO⁻ → CH₃COO⁻ + H₂O (mole à mole).
C1 = C2 × VE / V1 = 0,100 × 12,0 / 10,0 = 0,120 mol·L⁻¹ dans le vinaigre dilué, soit **1,20 mol·L⁻¹** dans le vinaigre pur.

## Exemple 2 : la vitamine C
Le **DCPIP** (2,6-dichlorophénolindophénol) est un oxydant bleu qui devient incolore quand il est réduit par la vitamine C (acide ascorbique). On verse le DCPIP sur le jus : tant qu’il reste de la vitamine C, le bleu disparaît ; à l’équivalence, la première goutte en excès reste colorée. Ici, c’est le réactif titrant lui-même qui sert d’indicateur.

## Bonnes pratiques
1. Rincer la burette avec la solution titrante, chasser la bulle d’air sous le robinet, ajuster le zéro.
2. Faire un premier titrage rapide pour encadrer VE, puis un titrage précis goutte à goutte près de l’équivalence.
3. Répéter pour vérifier la **répétabilité** et vérifier l’exactitude avec un **étalon de contrôle**.`,
          },
          questions: [
            ['Dans un titrage, la solution titrante est placée…', ['Dans une fiole jaugée', 'Dans le bécher', 'Dans la burette', 'Dans le spectrophotomètre'], 2, 'On la verse progressivement sur la solution à doser.'],
            ['À l’équivalence…', ['Les réactifs ont été introduits dans les proportions de l’équation', 'La solution titrante est épuisée', 'L’indicateur est détruit', 'Le pH vaut toujours 7'], 0, 'Le réactif titré est alors entièrement consommé.'],
            ['Pour une réaction mole à mole, la relation à l’équivalence est…', ['C1 + V1 = C2 + VE', 'C1 × V1 = C2 × VE', 'C1 / V1 = C2 / VE', 'C1 × VE = C2 × V1'], 1, 'Les quantités de matière des deux réactifs sont égales.'],
            ['10,0 mL d’acide titrés par la soude à 0,20 mol·L⁻¹, VE = 15,0 mL. Concentration de l’acide ?', ['0,13 mol·L⁻¹', '0,30 mol·L⁻¹', '3,0 mol·L⁻¹', '0,030 mol·L⁻¹'], 1, 'C1 = 0,20 × 15,0 / 10,0 = 0,30 mol·L⁻¹.'],
            ['Le dosage du vinaigre par la soude repose sur une réaction…', ['Enzymatique', 'D’oxydo-réduction', 'De précipitation', 'Acido-basique'], 3, 'L’acide éthanoïque cède un ion H⁺ à l’ion hydroxyde.'],
            ['Le dosage de la vitamine C par le DCPIP repose sur une réaction…', ['D’oxydo-réduction', 'Acido-basique', 'Enzymatique', 'Antigène-anticorps'], 0, 'Le DCPIP oxyde la vitamine C et se décolore en étant réduit.'],
            ['La phénolphtaléine est incolore en milieu acide et rose en milieu basique.', ['Vrai', 'Faux'], 0, 'Son virage signale le passage à un milieu basique, juste après l’équivalence.'],
            ['Avant de remplir la burette, on la rince…', ['Avec la solution à doser', 'Avec de l’eau du robinet seulement', 'Avec la solution titrante', 'Avec de l’éthanol'], 2, 'On évite ainsi de diluer la solution titrante.'],
            ['Une solution étalon est une solution…', ['Toujours basique', 'De concentration inconnue', 'De concentration connue avec exactitude', 'Préparée approximativement'], 2, 'Elle sert de référence au dosage.'],
            ['Pourquoi fait-on d’abord un titrage rapide ?', ['Pour encadrer le volume équivalent', 'Pour obtenir le résultat final', 'Pour étalonner la burette', 'Pour chauffer la solution'], 0, 'Le titrage précis se fait ensuite goutte à goutte près de l’équivalence.'],
            ['Le vinaigre a été dilué 10 fois et le titrage donne 0,090 mol·L⁻¹. Concentration du vinaigre pur ?', ['9,0 mol·L⁻¹', '0,0090 mol·L⁻¹', '0,090 mol·L⁻¹', '0,90 mol·L⁻¹'], 3, 'On multiplie par le facteur de dilution : 0,090 × 10.'],
            ['Dans le titrage par le DCPIP, l’équivalence est repérée…', ['Quand la solution devient rose', 'Quand la coloration du DCPIP persiste', 'Par un précipité rouge', 'Quand la solution bout'], 1, 'Le réactif titrant sert lui-même d’indicateur.'],
          ],
        },
      ],
    },
  ],
}
