// Sciences physiques et chimiques en laboratoire (SPCL) — 1re STL. Programme
// officiel : annexe du BO spécial n° 1 du 22 janvier 2019. Une partie
// transversale « Mesure et incertitudes », trois thèmes (« Chimie et
// développement durable », « Image », « Instrumentation ») et une initiation à
// la démarche de projet.
//
// La spécialité « physique-chimie et mathématiques », commune à STI2D et STL,
// est une matière À PART (autre module) : rien ici n'en reprend le programme.
//
// Matière NEUVE (slug `spcl`, déclarée pour la 1re et la Tle techno) : le bloc
// de 1re part de la position 1. L'axe de chaque fiche est le thème officiel.

export default {
  slug: 'spcl',
  nom: 'Sciences physiques et chimiques en laboratoire',

  titreMigration: 'SCIENCES PHYSIQUES ET CHIMIQUES EN LABORATOIRE 1re STL — LE PROGRAMME OFFICIEL (15 fiches)',

  motif: `Les élèves de 1re STL qui ont choisi la spécialité sciences physiques et
chimiques en laboratoire (SPCL) ne trouvaient rien dans l'app. Cette migration
installe 15 fiches qui suivent le programme officiel (BO spécial n° 1 du
22 janvier 2019) : mesure et incertitudes ; chimie et développement durable
(sécurité, chimie verte, synthèse, purification, contrôle de pureté, réactions,
analyses, dosages) ; image (vision des couleurs, lentilles minces, appareil
photographique numérique, image numérique) ; instrumentation (chaînes de mesure,
régulation tout ou rien) ; démarche de projet.`,

  blocs: [
    {
      niveaux: ['1re'],
      positionDepart: 1,
      chapitres: [
        {
          titre: 'Mesure et incertitudes : justesse, fidélité, incertitude-type',
          axe: 'Mesure et incertitudes',
          lecon: {
            titre: 'Une mesure n’est jamais exacte',
            cours: `Mesurer dix fois la même grandeur donne rarement dix fois la même valeur. Ce n’est pas un échec : c’est la **variabilité** de la mesure. Le travail du laboratoire est de la **quantifier**.

## Les sources d’erreurs
- l’**instrument** (graduation, étalonnage, résolution) ;
- l’**opérateur** (lecture du ménisque, réaction au chronomètre) ;
- la **méthode** (protocole, modèle simplifié) ;
- les **conditions** (température, courants d’air).

## Justesse et fidélité
| Qualité | Sens | Défaut associé |
| **Fidélité** | les mesures répétées sont **proches les unes des autres** | dispersion (erreurs aléatoires) |
| **Justesse** | leur moyenne est **proche de la valeur de référence** | décalage (erreur systématique) |

Image de la cible : des impacts groupés mais loin du centre sont fidèles mais pas justes ; des impacts éparpillés autour du centre sont justes en moyenne mais peu fidèles.

## Incertitude-type sur une série de mesures (évaluation de type A)
Pour n mesures x₁, …, xₙ :
1. On calcule la **moyenne** x̄.
2. On calcule l’**écart-type** s (calculatrice ou tableur, fonction ECARTYPE).
3. L’incertitude-type sur la moyenne vaut :
= u(x̄) = s / √n

Plus on répète, plus la moyenne est connue précisément.

## Incertitude-type sur une mesure unique (évaluation de type B)
Quand on ne mesure qu’une fois, on s’appuie sur les caractéristiques de l’instrument. Pour une graduation ou une tolérance ± Δ donnée par le constructeur, on prend souvent :
= u = Δ / √3

## Exprimer le résultat
On écrit x = x̄ avec u(x), et l’unité : par exemple V = 10,04 mL avec u(V) = 0,02 mL. On garde **un ou deux chiffres significatifs** pour l’incertitude-type, et on arrondit la valeur au même rang.

## Comparer à une valeur de référence
> On évalue l’écart en **nombre d’incertitudes-types** : z = |x − x_réf| / u(x). Si z est inférieur ou égal à 2, le résultat est **compatible** avec la référence ; au-delà, on cherche une erreur systématique.

## Exemple travaillé
Cinq mesures de la masse volumique d’un liquide (g·mL⁻¹) : 0,791 ; 0,788 ; 0,794 ; 0,790 ; 0,787.
- Moyenne : 0,790 g·mL⁻¹.
- Écart-type : s ≈ 0,0027 g·mL⁻¹.
- u = 0,0027 / √5 ≈ 0,0012 g·mL⁻¹.
- Référence (éthanol à 20 °C) : 0,789 g·mL⁻¹. z = 0,001 / 0,0012 ≈ 0,8 : **compatible**.`,
          },
          questions: [
            ['Des mesures très proches les unes des autres sont…', ['Fidèles', 'Justes', 'Exactes', 'Fausses'], 0, 'La fidélité décrit la faible dispersion ; la justesse, la proximité avec la référence.'],
            ['Une erreur systématique dégrade surtout…', ['La justesse', 'La fidélité', 'Le nombre de mesures', 'L’écart-type'], 0, 'Elle décale toutes les mesures dans le même sens.'],
            ['L’incertitude-type sur la moyenne de n mesures vaut…', ['s / √n', 's × n', 's / n²', '√s / n'], 0, 'Répéter les mesures réduit l’incertitude sur la moyenne.'],
            ['Pour une mesure unique avec une tolérance ± Δ, on prend souvent…', ['u = Δ / √3', 'u = Δ × 3', 'u = Δ²', 'u = 0'], 0, 'C’est une évaluation de type B.'],
            ['Quatre mesures ont un écart-type de 0,40. Incertitude-type sur la moyenne ?', ['0,20', '0,10', '1,6', '0,40'], 0, '0,40 / √4 = 0,20.'],
            ['Le z-score vaut 1,5. Le résultat est…', ['Compatible avec la référence', 'Incompatible', 'Faux par définition', 'Impossible à juger'], 0, 'Un écart inférieur ou égal à deux incertitudes-types est considéré comme compatible.'],
            ['Répéter une mesure permet de détecter une erreur systématique.', ['Vrai', 'Faux'], 1, 'Toutes les mesures sont décalées de la même façon : seule une comparaison à une référence la révèle.'],
            ['Combien de chiffres significatifs garde-t-on pour une incertitude-type ?', ['Un ou deux', 'Au moins cinq', 'Aucun', 'Autant que la calculatrice affiche'], 0, 'On arrondit ensuite la valeur au même rang décimal.'],
            ['La lecture d’un ménisque est une source d’erreur liée…', ['À l’opérateur', 'À la méthode', 'À la température', 'Au modèle'], 0, 'Une parallaxe d’observation déplace la lecture.'],
            ['x = 12,6 ; x_réf = 12,0 ; u = 0,2. z vaut…', ['3', '0,6', '1,2', '0,3'], 0, 'z = 0,6 / 0,2 = 3 : le résultat n’est pas compatible, il faut chercher une erreur systématique.'],
            ['L’évaluation de type A repose sur…', ['L’analyse statistique d’une série de mesures', 'La notice du constructeur', 'Une seule mesure', 'La valeur de référence'], 0, 'Moyenne et écart-type en sont les outils.'],
            ['Des impacts groupés mais loin du centre de la cible illustrent des mesures…', ['Fidèles mais pas justes', 'Justes mais pas fidèles', 'Justes et fidèles', 'Ni justes ni fidèles'], 0, 'Faible dispersion, mais un décalage systématique.'],
          ],
        },
        {
          titre: 'Sécurité au laboratoire : pictogrammes, phrases H et P, FDS',
          axe: 'Chimie et développement durable',
          lecon: {
            titre: 'Lire l’étiquette avant d’ouvrir le flacon',
            cours: `Chaque manipulation de chimie commence par une question : que risque-t-on avec ces produits ? Le règlement européen **CLP** (Classification, Labelling and Packaging) harmonise la réponse dans toute l’Union européenne.

## Les règles de base
- blouse en coton fermée, **lunettes** de protection, **gants** adaptés au produit ;
- cheveux attachés, pas de lentilles de contact si possible ;
- ne jamais manger ni boire, ne jamais pipeter à la bouche ;
- travailler sous **hotte** pour les produits volatils toxiques ou inflammables ;
- connaître l’emplacement du rince-œil, de la douche, de l’extincteur.

## Les neuf pictogrammes CLP
| Pictogramme | Signification | Exemple |
| Flamme | inflammable | éthanol, acétone |
| Flamme sur un cercle | comburant | dioxygène, permanganate |
| Bombe qui explose | explosif | peroxydes |
| Corrosion (main et surface rongées) | corrosif | soude, acide chlorhydrique concentré |
| Tête de mort | toxicité aiguë | méthanol |
| Point d’exclamation | nocif, irritant | dilutions de nombreux réactifs |
| Silhouette avec étoile sur la poitrine | danger grave pour la santé (cancérogène, mutagène) | dichlorométhane |
| Environnement (arbre et poisson) | dangereux pour le milieu aquatique | sulfate de cuivre |
| Bouteille de gaz | gaz sous pression | bouteille de diazote |

## Phrases H et P
- Les **mentions de danger** (phrases **H**, *hazard*) décrivent la nature du danger : H225 « liquide et vapeurs très inflammables », H314 « provoque des brûlures de la peau et des lésions oculaires graves ».
- Les **conseils de prudence** (phrases **P**, *precaution*) disent quoi faire : P280 « porter des gants de protection, un équipement de protection des yeux », P210 « tenir à l’écart de la chaleur et des flammes ».
- Une **mention d’avertissement** accompagne les pictogrammes : « **Danger** » (le plus grave) ou « **Attention** ».

## La fiche de données de sécurité (FDS)
Fournie obligatoirement par le fabricant, elle compte 16 rubriques : identification, dangers, composition, **premiers secours**, lutte contre l’incendie, mesures en cas de dispersion, **stockage**, **protections individuelles**, propriétés physico-chimiques, **toxicité**, élimination, transport…

> On lit la FDS **avant** la manipulation, pas après l’accident.

## Stocker
On stocke les produits par **familles compatibles** : jamais un acide concentré à côté d’une base, ni un oxydant à côté d’un inflammable. Les inflammables vont dans une armoire ventilée, les produits toxiques dans une armoire fermée.

## Exemple
L’étiquette de l’acide chlorhydrique à 37 % porte le pictogramme corrosion et le point d’exclamation, la mention « Danger », les phrases H290, H314 et H335 (irritation des voies respiratoires). On en déduit : lunettes, gants, blouse, manipulation sous hotte, stockage avec les acides, loin des bases et de l’eau de Javel (qui libérerait du dichlore).`,
          },
          questions: [
            ['Que signifie le sigle CLP ?', ['Classification, labelling and packaging', 'Chimie, laboratoire, prévention', 'Contrôle des liquides polluants', 'Code de lecture des pictogrammes'], 0, 'C’est le règlement européen d’étiquetage des produits chimiques.'],
            ['Les phrases H décrivent…', ['La nature du danger', 'Les conseils de prudence', 'Le prix du produit', 'La formule chimique'], 0, 'H comme hazard ; les phrases P donnent les précautions.'],
            ['Le pictogramme flamme sur un cercle signale un produit…', ['Comburant', 'Inflammable', 'Explosif', 'Toxique'], 0, 'Un comburant entretient la combustion d’un autre produit.'],
            ['Quelle mention d’avertissement signale les dangers les plus graves ?', ['Danger', 'Attention', 'Prudence', 'Toxique'], 0, 'Le CLP n’en connaît que deux : « Danger » et « Attention ».'],
            ['La silhouette avec une étoile sur la poitrine indique…', ['Un danger grave pour la santé (cancérogène, mutagène…)', 'Un produit inflammable', 'Un gaz sous pression', 'Un produit irritant léger'], 0, 'Ces effets peuvent apparaître à long terme.'],
            ['Où trouve-t-on les mesures de premiers secours pour un produit ?', ['Dans sa fiche de données de sécurité', 'Uniquement sur le pictogramme', 'Dans le cahier de laboratoire', 'Nulle part'], 0, 'La FDS compte 16 rubriques, dont les premiers secours.'],
            ['On peut stocker un acide concentré à côté d’une base concentrée.', ['Vrai', 'Faux'], 1, 'On stocke par familles compatibles pour éviter toute réaction en cas de fuite.'],
            ['Un produit volatil et toxique se manipule…', ['Sous la hotte', 'Sur la paillasse, fenêtre ouverte', 'Près du bec Bunsen', 'Dans le couloir'], 0, 'La hotte aspire et évacue les vapeurs.'],
            ['P280 demande de…', ['Porter des gants et une protection des yeux', 'Tenir loin des flammes', 'Stocker au froid', 'Jeter à l’évier'], 0, 'C’est l’un des conseils de prudence les plus courants.'],
            ['Pourquoi ne jamais mélanger acide chlorhydrique et eau de Javel ?', ['Il se dégage du dichlore toxique', 'Le mélange devient neutre', 'Il se forme du sel inoffensif', 'La solution gèle'], 0, 'Le dichlore est un gaz très toxique pour les voies respiratoires.'],
            ['Le pictogramme arbre et poisson signale…', ['Un danger pour le milieu aquatique', 'Un produit naturel', 'Un produit biodégradable', 'Un gaz sous pression'], 0, 'Ces produits ne doivent jamais être jetés à l’évier.'],
            ['Quand faut-il lire la FDS ?', ['Avant la manipulation', 'Après un accident seulement', 'À la fin de l’année', 'Jamais au lycée'], 0, 'Elle sert à prévoir les protections et la conduite à tenir.'],
          ],
        },
        {
          titre: 'Chimie verte, recyclage et impact environnemental',
          axe: 'Chimie et développement durable',
          lecon: {
            titre: 'Produire sans abîmer',
            cours: `La chimie fabrique nos médicaments, nos matériaux, nos engrais. Mais elle consomme des ressources et produit des déchets. La **chimie verte** cherche à concevoir des procédés qui réduisent ou suppriment les substances dangereuses, dès la conception.

## Les douze principes de la chimie verte
Formulés par Paul Anastas et John Warner en 1998, on peut les regrouper ainsi :
| Idée | Principes |
| **Prévenir les déchets** | mieux vaut ne pas produire de déchet que le traiter |
| **Économie d’atomes** | incorporer dans le produit le maximum des atomes des réactifs |
| **Réduire les dangers** | synthèses moins toxiques, produits moins dangereux, prévenir les accidents |
| **Solvants et auxiliaires** | les éviter ou choisir les plus sûrs (eau, éthanol) |
| **Énergie** | travailler à température et pression ambiantes si possible |
| **Matières premières renouvelables** | biomasse plutôt que pétrole |
| **Éviter les étapes inutiles** | moins de protections et déprotections |
| **Catalyse** | un catalyseur sélectif plutôt que des réactifs en excès |
| **Dégradabilité** | des produits qui se décomposent sans persister |
| **Analyse en temps réel** | suivre la réaction pour éviter la formation de sous-produits |

## L’économie d’atomes
= économie d’atomes = masse molaire du produit voulu / somme des masses molaires des réactifs
Une addition (tous les atomes se retrouvent dans le produit) a une économie d’atomes de 100 % ; une substitution qui libère un sous-produit est moins économe.

> Un rendement de 95 % peut cacher un procédé très polluant : l’économie d’atomes, la toxicité des solvants et l’énergie consommée comptent autant que le rendement.

## Recycler et traiter les substances
- **Solvants** : récupérés par distillation et réutilisés.
- **Métaux** (argent des bains photographiques, cuivre) : récupérés par précipitation ou électrolyse.
- **Déchets de laboratoire** : triés (acides, bases, solvants halogénés, solvants non halogénés, métaux lourds) dans des bidons étiquetés et confiés à une entreprise spécialisée. Rien ne part à l’évier sans neutralisation autorisée.

## Un triple impact
Un procédé se juge sur trois plans :
1. **environnemental** : rejets, consommation d’eau et d’énergie, émissions de CO₂ ;
2. **économique** : coût des réactifs, de l’énergie, du traitement des déchets ;
3. **social** : sécurité des salariés et des riverains, emplois.

## Exemple : l’ibuprofène
La première synthèse industrielle de l’ibuprofène comptait six étapes et une économie d’atomes d’environ 40 % : plus de la moitié de la matière finissait en déchets. Le procédé mis au point à la fin des années 1980 n’en compte plus que trois, catalytiques, avec une économie d’atomes voisine de 77 % (presque 100 % en valorisant le sous-produit, l’acide éthanoïque). Même médicament, beaucoup moins de déchets.`,
          },
          questions: [
            ['Le premier principe de la chimie verte est…', ['Prévenir les déchets plutôt que les traiter', 'Maximiser le rendement à tout prix', 'Travailler à haute température', 'Utiliser le plus de solvant possible'], 0, 'Le déchet le moins polluant est celui qu’on ne produit pas.'],
            ['Une économie d’atomes de 100 % signifie…', ['Que tous les atomes des réactifs se retrouvent dans le produit', 'Que le rendement est de 100 %', 'Que la réaction est rapide', 'Qu’il n’y a pas de catalyseur'], 0, 'C’est le cas des réactions d’addition.'],
            ['Quel solvant est le plus conforme à la chimie verte ?', ['L’eau', 'Le dichlorométhane', 'Le benzène', 'Le tétrachlorométhane'], 0, 'Elle n’est ni toxique ni inflammable.'],
            ['Pourquoi préfère-t-on un catalyseur à un réactif en excès ?', ['Il n’est pas consommé et réduit les déchets', 'Il augmente la masse de produit', 'Il est toujours gratuit', 'Il supprime tous les dangers'], 0, 'Utilisé en petite quantité, il est régénéré en fin de réaction.'],
            ['Un rendement élevé suffit à qualifier un procédé de « vert ».', ['Vrai', 'Faux'], 1, 'Il faut aussi regarder l’économie d’atomes, les solvants, l’énergie et la toxicité.'],
            ['Comment récupère-t-on un solvant usagé ?', ['Par distillation', 'Par filtration simple', 'En le jetant à l’évier', 'Par chromatographie'], 0, 'On sépare le solvant, plus volatil, de ce qui y est dissous.'],
            ['Utiliser la biomasse plutôt que le pétrole correspond au principe…', ['Des matières premières renouvelables', 'De l’économie d’atomes', 'De la catalyse', 'De l’analyse en temps réel'], 0, 'Le pétrole est une ressource épuisable.'],
            ['Travailler à température et pression ambiantes permet surtout…', ['D’économiser de l’énergie', 'D’augmenter les déchets', 'De ralentir la réaction', 'D’éviter la catalyse'], 0, 'Chauffer et comprimer coûtent de l’énergie.'],
            ['Les trois plans d’évaluation d’un procédé sont…', ['Environnemental, économique et social', 'Chimique, physique et biologique', 'Rapide, lent et moyen', 'Solide, liquide et gazeux'], 0, 'Ce sont les trois piliers du développement durable.'],
            ['Pourquoi la nouvelle synthèse de l’ibuprofène est-elle plus verte ?', ['Moins d’étapes, catalytiques, avec une meilleure économie d’atomes', 'Elle utilise plus de solvants', 'Elle produit plus de sous-produits', 'Elle se fait à plus haute température'], 0, 'Trois étapes au lieu de six et beaucoup moins de déchets.'],
            ['Un produit conçu pour se dégrader sans persister dans l’environnement répond au principe…', ['De dégradabilité', 'D’économie d’atomes', 'De catalyse', 'De prévention des accidents'], 0, 'Il ne s’accumule pas dans les milieux naturels.'],
            ['Les déchets chimiques du laboratoire sont…', ['Triés par familles dans des bidons étiquetés', 'Jetés ensemble à l’évier', 'Mélangés dans un seul bidon', 'Brûlés sur place'], 0, 'Ils sont ensuite confiés à une entreprise spécialisée.'],
          ],
        },
        {
          titre: 'Synthèse organique : chauffage à reflux, extraction, purification',
          axe: 'Chimie et développement durable',
          lecon: {
            titre: 'Fabriquer, isoler, purifier',
            cours: `Une synthèse organique se déroule toujours en trois temps : la **transformation** (on fait réagir), l’**isolement** (on sépare le produit du milieu réactionnel) et la **purification** (on élimine les impuretés restantes). Un quatrième temps, l’**analyse**, vérifie ce qu’on a obtenu.

## Transformer : le chauffage à reflux
Chauffer accélère la réaction, mais les espèces volatiles s’échapperaient. Le **montage à reflux** associe :
- un **ballon** contenant les réactifs et quelques grains de pierre ponce (régulariser l’ébullition) ;
- un **chauffe-ballon** sur support élévateur (on peut le retirer vite) ;
- un **réfrigérant à boules** vertical, où l’eau entre par le **bas** et sort par le haut.
> Les vapeurs se condensent dans le réfrigérant et **retombent** dans le ballon : on chauffe longtemps **sans perte de matière**.

## Isoler : l’extraction liquide-liquide
On transfère le produit d’un solvant à un autre dans lequel il est plus soluble, avec une **ampoule à décanter**. Le **solvant extracteur** doit :
1. **ne pas être miscible** avec le premier solvant (souvent l’eau) ;
2. **mieux dissoudre** l’espèce à extraire ;
3. être peu dangereux et, si possible, facile à éliminer (volatil).
Après agitation (en dégazant régulièrement) et repos, deux phases apparaissent : la plus **dense** est en bas. On compare les densités données dans les tableaux pour savoir quelle phase garder.

On peut aussi isoler un solide par **filtration sous vide** (Büchner) : c’est rapide et le solide est bien essoré.

## Purifier
| Technique | Pour | Principe |
| **Distillation simple** | liquides de températures d’ébullition très différentes | le plus volatil se vaporise, se condense et est recueilli |
| **Recristallisation** | solides | le solide est dissous à chaud dans un minimum de solvant ; en refroidissant, le produit cristallise, les impuretés restent dissoutes |
| **Lavage et séchage** | phase organique | lavage à l’eau ou à l’hydrogénocarbonate, puis séchage sur sulfate de magnésium anhydre |

Le solvant de recristallisation est choisi pour que le produit y soit **très soluble à chaud et peu soluble à froid**, et les impuretés solubles même à froid.

## Choisir le matériel
Le protocole indique les quantités ; on choisit la verrerie adaptée : éprouvette pour un volume approximatif de réactif en excès, pipette ou burette pour un volume précis, balance pour les solides, ballon rempli au plus à moitié.

## Exemple : la synthèse de l’acétate d’isoamyle (arôme de banane)
1. Reflux de l’alcool isoamylique et d’acide éthanoïque en excès, avec un peu d’acide sulfurique comme catalyseur.
2. Refroidissement, ajout d’eau salée (le sel diminue la solubilité de l’ester dans l’eau : relargage), décantation : l’ester, moins dense, est dans la phase du haut.
3. Lavage par une solution d’hydrogénocarbonate de sodium (élimine l’acide restant ; dégagement de CO₂), séchage, puis distillation.`,
          },
          questions: [
            ['À quoi sert le réfrigérant d’un montage à reflux ?', ['À condenser les vapeurs qui retombent dans le ballon', 'À refroidir le ballon', 'À peser les réactifs', 'À filtrer le mélange'], 0, 'On chauffe longtemps sans perdre de matière.'],
            ['Dans un réfrigérant, l’eau entre…', ['Par le bas', 'Par le haut', 'Par le côté du ballon', 'N’importe où'], 0, 'Le réfrigérant reste ainsi entièrement rempli d’eau froide.'],
            ['Un solvant extracteur doit être…', ['Non miscible avec l’eau et bon solvant du produit', 'Miscible avec l’eau', 'Le plus dense possible', 'Le plus toxique possible'], 0, 'Deux phases doivent se former et le produit doit passer dans la phase organique.'],
            ['Dans une ampoule à décanter, la phase inférieure est…', ['La plus dense', 'La moins dense', 'Toujours l’eau', 'Toujours la phase organique'], 0, 'Il faut comparer les densités, qui changent d’un solvant à l’autre.'],
            ['La recristallisation sert à purifier…', ['Un solide', 'Un gaz', 'Un liquide volatil', 'Une solution aqueuse diluée'], 0, 'Les impuretés restent dissoutes dans le solvant froid.'],
            ['Le solvant de recristallisation dissout le produit…', ['Beaucoup à chaud, peu à froid', 'Peu à chaud, beaucoup à froid', 'Autant à chaud qu’à froid', 'Pas du tout'], 0, 'C’est ce qui permet au produit de cristalliser en refroidissant.'],
            ['La distillation simple sépare des liquides de températures d’ébullition très différentes.', ['Vrai', 'Faux'], 0, 'Le plus volatil passe en premier dans le réfrigérant.'],
            ['Pourquoi ajoute-t-on des grains de pierre ponce dans le ballon ?', ['Pour régulariser l’ébullition', 'Pour catalyser la réaction', 'Pour colorer le mélange', 'Pour sécher le produit'], 0, 'Ils évitent les ébullitions brutales (soubresauts).'],
            ['L’ajout d’eau salée pour séparer un ester s’appelle…', ['Le relargage', 'La recristallisation', 'Le reflux', 'La distillation'], 0, 'Le sel diminue la solubilité de l’ester dans la phase aqueuse.'],
            ['Pourquoi dégaze-t-on l’ampoule pendant l’agitation ?', ['Pour évacuer la surpression des vapeurs ou d’un gaz formé', 'Pour ajouter de l’air', 'Pour refroidir', 'Pour changer de phase'], 0, 'Sinon, le bouchon peut sauter et projeter le contenu.'],
            ['Le sulfate de magnésium anhydre sert à…', ['Sécher une phase organique', 'Catalyser la réaction', 'Neutraliser un acide', 'Colorer une tache'], 0, 'Il capte les traces d’eau restées dans la phase organique.'],
            ['Pourquoi le chauffe-ballon est-il posé sur un support élévateur ?', ['Pour pouvoir le retirer rapidement', 'Pour chauffer plus fort', 'Pour éviter de peser', 'Pour agiter le mélange'], 0, 'En cas d’emballement, on arrête le chauffage en l’abaissant.'],
          ],
        },
        {
          titre: 'Contrôler la pureté et calculer un rendement',
          axe: 'Chimie et développement durable',
          lecon: {
            titre: 'Qu’a-t-on vraiment obtenu ?',
            cours: `Une synthèse ne s’arrête pas à la récupération d’un produit : il faut vérifier que c’est **le bon** et qu’il est **pur**, puis évaluer **combien** on en a obtenu par rapport au maximum possible.

## Les contrôles de pureté
| Technique | Pour | Ce qu’on observe si le produit est pur |
| **Température de fusion** (banc Kofler) | solide | une valeur **nette**, égale à la valeur tabulée |
| **Température d’ébullition** | liquide | valeur égale à la valeur tabulée |
| **Masse volumique** | liquide | valeur égale à la valeur tabulée |
| **CCM** | tout produit soluble | **une seule tache**, au même niveau que le produit de référence |
| **Indice de réfraction** | liquide | valeur égale à la valeur tabulée |

Un solide impur fond à une **température plus basse** que le solide pur, et sur un intervalle. Le banc Kofler s’étalonne avec des substances de température de fusion connue.

## La CCM comme contrôle
On dépose côte à côte : le **réactif** de départ, le **produit obtenu** et un **produit de référence** pur. Si le produit obtenu donne une seule tache au même rapport frontal que la référence, et aucune tache au niveau du réactif, la transformation est complète et le produit pur (dans la limite de détection).

## Le réactif limitant
Le **tableau d’avancement** suit les quantités de matière au cours de la réaction. L’**avancement maximal** x_max est atteint quand un réactif est épuisé : c’est le **réactif limitant**. Pour A + B → C + D (coefficients 1) : x_max est la plus petite des quantités initiales n(A) et n(B).
Pour un liquide, on calcule d’abord la quantité de matière par :
= n = ρ × V / M

## Le rendement
= η = n(produit obtenu) / n(produit maximal)
Il s’exprime en pourcentage et vaut toujours moins de 100 % : réaction limitée, pertes lors des transferts, de l’extraction, de la purification.

## Exemple travaillé
Estérification : 0,20 mol d’alcool isoamylique et 0,40 mol d’acide éthanoïque. Le réactif limitant est l’alcool (0,20 mol) : on peut obtenir au plus **0,20 mol** d’ester, soit m_max = 0,20 × 130 = 26 g (M(ester) = 130 g·mol⁻¹). On récupère 17,6 g d’ester pur. Rendement : η = 17,6 / 26 ≈ **0,68, soit 68 %**.

> On utilise souvent un réactif **en excès** (le moins cher, ou le plus facile à éliminer) pour consommer totalement le plus précieux et améliorer le rendement.

## Vérifier l’identité
Un produit pur n’est pas forcément le bon produit : on confronte sa température de fusion, son spectre infrarouge ou sa CCM à ceux de la molécule attendue.`,
          },
          questions: [
            ['Un solide impur fond…', ['À une température plus basse et sur un intervalle', 'À une température plus haute', 'Exactement à la température tabulée', 'Jamais'], 0, 'Les impuretés abaissent la température de fusion.'],
            ['Sur une CCM, un produit pur donne…', ['Une seule tache au niveau de la référence', 'Plusieurs taches', 'Aucune tache', 'Une tache au niveau du réactif'], 0, 'Une deuxième tache révèle une impureté ou un réactif restant.'],
            ['Le réactif limitant est…', ['Celui qui est entièrement consommé en premier', 'Celui en plus grande quantité', 'Le catalyseur', 'Le solvant'], 0, 'Il fixe l’avancement maximal.'],
            ['Quantité de matière d’un liquide de masse volumique ρ, volume V, masse molaire M ?', ['n = ρ × V / M', 'n = M / (ρ × V)', 'n = ρ × M / V', 'n = V / (ρ × M)'], 0, 'ρ × V donne la masse, qu’on divise par M.'],
            ['0,10 mol de A réagit avec 0,30 mol de B (A + B → C). Quantité maximale de C ?', ['0,10 mol', '0,30 mol', '0,40 mol', '0,20 mol'], 0, 'A est limitant : x_max = 0,10 mol.'],
            ['On attend 20 g de produit et on en obtient 15 g. Rendement ?', ['75 %', '133 %', '25 %', '15 %'], 0, 'η = 15 / 20 = 0,75.'],
            ['Un rendement peut dépasser 100 % si le produit est très pur.', ['Vrai', 'Faux'], 1, 'Un rendement supérieur à 100 % trahit un produit humide ou impur.'],
            ['Quel appareil mesure la température de fusion d’un solide ?', ['Le banc Kofler', 'La burette', 'Le spectrophotomètre', 'Le pH-mètre'], 0, 'On y dépose le solide le long d’un gradient de température.'],
            ['Pourquoi utilise-t-on souvent un réactif en excès ?', ['Pour consommer totalement l’autre réactif et améliorer le rendement', 'Pour ralentir la réaction', 'Pour diminuer la masse de produit', 'Pour éviter de purifier'], 0, 'On choisit en excès le réactif le moins cher ou le plus facile à éliminer.'],
            ['Pourquoi le rendement est-il toujours inférieur à 100 % en pratique ?', ['Pertes lors des transferts et purifications, réaction parfois limitée', 'Parce que la masse ne se conserve pas', 'À cause de la pierre ponce', 'Parce que le catalyseur est consommé'], 0, 'Chaque étape fait perdre un peu de produit.'],
            ['Sur une CCM, une tache du produit au niveau du réactif de départ indique…', ['Qu’il reste du réactif non transformé', 'Que la synthèse est parfaite', 'Que le produit est un autre isomère', 'Que l’éluant est mauvais'], 0, 'La transformation n’est pas complète ou la purification insuffisante.'],
            ['m_max = 26 g et m obtenu = 13 g : le rendement vaut…', ['50 %', '200 %', '13 %', '26 %'], 0, '13 / 26 = 0,50.'],
          ],
        },
        {
          titre: 'Réactions de synthèse et flèches courbes',
          axe: 'Chimie et développement durable',
          lecon: {
            titre: 'Des électrons qui se déplacent',
            cours: `Pour comprendre une synthèse, il faut savoir **quel type** de réaction se produit et **pourquoi** les molécules réagissent à cet endroit précis.

## Les quatre grandes familles de réactions
| Type | Ce qui se passe | Exemple |
| **Substitution** | un atome ou groupe est **remplacé** par un autre | R–Cl + HO⁻ → R–OH + Cl⁻ |
| **Addition** | deux molécules s’unissent, une liaison multiple devient simple | CH₂=CH₂ + H₂ → CH₃–CH₃ |
| **Élimination** | une molécule perd un petit groupe, une liaison multiple se forme | CH₃–CH₂OH → CH₂=CH₂ + H₂O |
| **Acide-base** | transfert d’un ion H⁺ | R–OH + HO⁻ → R–O⁻ + H₂O |

On repère le type en comparant réactifs et produits : une liaison double qui disparaît évoque une addition ; qui apparaît, une élimination ; deux produits pour deux réactifs avec échange d’un groupe, une substitution.

## Sites électrophiles et nucléophiles
Dans une liaison entre atomes d’**électronégativités** différentes, le plus électronégatif porte une charge partielle **δ−**, l’autre une charge partielle **δ+**. Électronégativités : O (3,4) > N (3,0) ≈ Cl (3,2) > C (2,6) > H (2,2).
- Un **site nucléophile** est riche en électrons : doublet non liant, charge négative, charge partielle δ−, liaison multiple. Exemple : l’oxygène de HO⁻.
- Un **site électrophile** est pauvre en électrons : charge positive ou partielle δ+. Exemple : le carbone lié au chlore dans R–Cl, ou le carbone de C=O.

> Une réaction se produit le plus souvent entre un **site nucléophile** et un **site électrophile** : le premier donne un doublet, le second le reçoit.

## Le formalisme des flèches courbes
Une **flèche courbe** représente le **mouvement d’un doublet d’électrons**. Elle part **toujours d’un doublet** (non liant ou liant) et pointe vers l’atome qui le reçoit (ou vers la liaison qui va se former).
Exemple : dans R–Cl + HO⁻, une flèche part d’un doublet non liant de l’oxygène de HO⁻ vers le carbone δ+ ; une seconde part du doublet de la liaison C–Cl vers le chlore, qui part sous forme d’ion Cl⁻.

## L’hydrogène labile
Dans un alcool R–O–H, l’hydrogène lié à l’oxygène est **labile** : la liaison O–H est polarisée, et une base forte (ion hydroxyde, en milieu très basique) peut arracher H⁺ pour former un **ion alcoolate** R–O⁻. Les hydrogènes liés au carbone, eux, ne sont pas labiles.

## Deux transformations à connaître
| Transformation | Réactifs | Produit | Type |
| **Hydrogénation** d’un alcène | alcène + H₂ (catalyseur Ni, Pd) | alcane | addition |
| Hydrogénation d’un aldéhyde ou d’une cétone | + H₂ | alcool primaire ou secondaire | addition |
| **Déshydratation** d’un alcool | alcool (acide, chauffage) | alcène + eau | élimination |

Exemple : l’hydrogénation du propanal CH₃–CH₂–CHO donne le propan-1-ol CH₃–CH₂–CH₂OH ; celle de la propanone CH₃–CO–CH₃ donne le propan-2-ol. La déshydratation de l’éthanol donne l’éthène et de l’eau.`,
          },
          questions: [
            ['CH₂=CH₂ + H₂ → CH₃–CH₃ est une réaction…', ['D’addition', 'De substitution', 'D’élimination', 'Acide-base'], 0, 'La double liaison disparaît, deux molécules s’unissent.'],
            ['La déshydratation d’un alcool en alcène est une…', ['Élimination', 'Addition', 'Substitution', 'Réaction acide-base'], 0, 'Une molécule d’eau est perdue et une double liaison se forme.'],
            ['Un site nucléophile est…', ['Riche en électrons', 'Pauvre en électrons', 'Toujours un atome d’hydrogène', 'Toujours chargé positivement'], 0, 'Il possède un doublet disponible ou une charge négative.'],
            ['Dans R–Cl, le carbone lié au chlore est…', ['Un site électrophile (δ+)', 'Un site nucléophile (δ−)', 'Neutre', 'Un hydrogène labile'], 0, 'Le chlore, plus électronégatif, attire les électrons de la liaison.'],
            ['Une flèche courbe part toujours…', ['D’un doublet d’électrons', 'D’un atome d’hydrogène', 'D’une charge positive', 'Du produit'], 0, 'Elle représente le déplacement d’un doublet vers un site électrophile.'],
            ['Quel hydrogène d’un alcool est labile ?', ['Celui lié à l’oxygène', 'Ceux liés au carbone', 'Tous', 'Aucun'], 0, 'La liaison O–H est polarisée : une base forte peut arracher H⁺.'],
            ['L’hydrogénation d’une cétone donne…', ['Un alcool secondaire', 'Un alcool primaire', 'Un acide carboxylique', 'Un alcène'], 0, 'La propanone donne le propan-2-ol.'],
            ['L’hydrogénation du propanal donne…', ['Le propan-1-ol', 'Le propan-2-ol', 'La propanone', 'L’acide propanoïque'], 0, 'Un aldéhyde donne un alcool primaire.'],
            ['R–OH + HO⁻ → R–O⁻ + H₂O est une réaction…', ['Acide-base', 'D’addition', 'D’élimination', 'De substitution'], 0, 'Un ion H⁺ est transféré de l’alcool à l’ion hydroxyde.'],
            ['L’oxygène est plus électronégatif que le carbone.', ['Vrai', 'Faux'], 0, 'Dans C–O ou C=O, l’oxygène porte donc une charge partielle δ−.'],
            ['Remplacer Cl par OH sur une chaîne carbonée est une réaction…', ['De substitution', 'D’addition', 'D’élimination', 'D’hydrogénation'], 0, 'Un groupe en remplace un autre.'],
            ['Pour hydrogéner un alcène, on utilise souvent un catalyseur…', ['Métallique, comme le nickel ou le palladium', 'Enzymatique', 'Acide fort', 'Aucun'], 0, 'Sans catalyseur, la réaction serait extrêmement lente.'],
          ],
        },
        {
          titre: 'Identifier une espèce : tests, spectroscopies UV-visible et IR',
          axe: 'Chimie et développement durable',
          lecon: {
            titre: 'Faire parler la matière',
            cours: `Avant de doser une espèce chimique, on l’**identifie**. Les analyses physico-chimiques permettent de caractériser des espèces présentes parfois en très faibles concentrations.

## Les tests d’identification
Un **test** est une réaction caractéristique qui donne un signe visible. On compare toujours à un **témoin** pertinent.
| Ion recherché | Réactif | Observation |
| Cl⁻ (chlorure) | nitrate d’argent | précipité **blanc** qui noircit à la lumière |
| SO₄²⁻ (sulfate) | chlorure de baryum | précipité **blanc** |
| Cu²⁺ | soude | précipité **bleu** |
| Fe²⁺ | soude | précipité **vert** |
| Fe³⁺ | soude | précipité **rouille** |
Les **banques de données** (tables de tests, spectres de référence) permettent l’analyse qualitative de nombreux ions.

## Les propriétés physiques
La **température de changement d’état** (fusion, ébullition) et la **masse volumique** sont des « cartes d’identité » : on compare la valeur mesurée à la valeur tabulée.

## L’interaction rayonnement-matière
Une molécule **absorbe** un rayonnement quand l’énergie des photons correspond à une transition possible :
| Domaine | Longueurs d’onde | Ce qui est excité |
| **UV-visible** | 200 à 800 nm | les électrons (liaisons conjuguées, groupes colorés) |
| **Infrarouge (IR)** | 2,5 à 25 µm | les **vibrations des liaisons** |

## La spectroscopie UV-visible
Le spectre A = f(λ) présente une bande d’absorption maximale à λmax. Une molécule qui absorbe dans le visible est colorée : elle a la **couleur complémentaire** de celle absorbée (absorbe le rouge vers 650 nm, paraît bleu-vert). Plus une molécule possède de doubles liaisons **conjuguées** (alternées), plus elle absorbe à grande longueur d’onde.

## La spectroscopie infrarouge
L’axe horizontal est le **nombre d’onde** σ = 1/λ, en cm⁻¹, décroissant de gauche à droite ; l’axe vertical la **transmittance** (les bandes pointent vers le bas).
| Liaison | Nombre d’onde (cm⁻¹) | Aspect |
| **O–H** d’un alcool | 3 200 – 3 400 | bande **large** (liaisons hydrogène) |
| O–H d’un acide carboxylique | 2 500 – 3 200 | bande très large |
| **N–H** | 3 100 – 3 500 | une ou deux bandes moyennes |
| **C–H** | 2 850 – 3 100 | bandes fines |
| **C=O** | 1 650 – 1 750 | bande **intense et fine** |
| C=C | 1 620 – 1 680 | bande moyenne |

> On lit d’abord la zone au-dessus de 1 500 cm⁻¹ : elle identifie les **groupes caractéristiques**. La zone en dessous (empreinte digitale) sert surtout à comparer avec un spectre de référence.

## Exemple
Un spectre montre une bande intense vers 1 710 cm⁻¹ et une bande très large de 2 500 à 3 200 cm⁻¹ : présence de C=O et d’un O–H d’acide, la molécule est un **acide carboxylique**. Une bande à 1 740 cm⁻¹ sans aucune bande O–H évoque plutôt un **ester**.`,
          },
          questions: [
            ['Le nitrate d’argent révèle les ions chlorure par…', ['Un précipité blanc qui noircit à la lumière', 'Un précipité bleu', 'Une coloration rose', 'Un dégagement gazeux'], 0, 'Il se forme du chlorure d’argent.'],
            ['Avec la soude, les ions Cu²⁺ donnent un précipité…', ['Bleu', 'Vert', 'Rouille', 'Blanc'], 0, 'C’est l’hydroxyde de cuivre(II).'],
            ['La spectroscopie infrarouge renseigne sur…', ['Les liaisons et groupes caractéristiques', 'La masse de la molécule', 'La couleur uniquement', 'La température de fusion'], 0, 'Chaque type de liaison vibre à des nombres d’onde caractéristiques.'],
            ['Une bande intense et fine vers 1 700 cm⁻¹ signale…', ['Une liaison C=O', 'Une liaison O–H', 'Une liaison C–H', 'Une liaison N–H'], 0, 'C’est la bande la plus facile à repérer sur un spectre IR.'],
            ['Une bande large vers 3 300 cm⁻¹ évoque…', ['Le O–H d’un alcool', 'Une liaison C=O', 'Une liaison C=C', 'Aucune liaison'], 0, 'Les liaisons hydrogène élargissent la bande.'],
            ['Une molécule qui absorbe le rouge paraît…', ['Bleu-vert', 'Rouge', 'Jaune', 'Blanche'], 0, 'On perçoit la couleur complémentaire de celle absorbée.'],
            ['Le nombre d’onde σ est égal à…', ['1 / λ', 'λ × c', 'c / λ', 'λ²'], 0, 'Il s’exprime usuellement en cm⁻¹.'],
            ['Plus une molécule a de doubles liaisons conjuguées, plus elle absorbe à grande longueur d’onde.', ['Vrai', 'Faux'], 0, 'C’est pourquoi les pigments très conjugués comme le carotène sont colorés.'],
            ['Une bande à 1 740 cm⁻¹ sans bande O–H évoque…', ['Un ester', 'Un alcool', 'Un acide carboxylique', 'Une amine'], 0, 'C=O présent, mais pas de O–H.'],
            ['La spectroscopie UV-visible excite surtout…', ['Les électrons des molécules', 'Les noyaux atomiques', 'Les vibrations des liaisons', 'Les molécules d’air'], 0, 'L’infrarouge, lui, excite les vibrations.'],
            ['Avec la soude, les ions Fe³⁺ donnent un précipité…', ['Rouille', 'Vert', 'Bleu', 'Blanc'], 0, 'C’est l’hydroxyde de fer(III).'],
            ['Dans un test d’identification, le témoin sert à…', ['Comparer le résultat à une référence connue', 'Accélérer la réaction', 'Colorer la solution', 'Remplacer l’échantillon'], 0, 'Il montre ce qu’on observe avec et sans l’espèce recherchée.'],
          ],
        },
        {
          titre: 'Doser par étalonnage et par titrage direct',
          axe: 'Chimie et développement durable',
          lecon: {
            titre: 'Deux chemins vers une concentration',
            cours: `Pour connaître la concentration d’une espèce, deux familles de méthodes existent : l’**étalonnage**, qui compare à des solutions connues sans consommer l’espèce, et le **titrage**, qui la fait réagir entièrement.

## Le dosage par étalonnage spectrophotométrique
### La loi de Beer-Lambert
= A = ε × ℓ × c
A est l’absorbance (sans unité), ε le coefficient d’absorption molaire (L·mol⁻¹·cm⁻¹), ℓ la longueur de cuve (cm), c la concentration (mol·L⁻¹). À λ et ℓ fixés, A est **proportionnelle** à c tant que la solution est assez diluée.

### La méthode
1. Préparer une **gamme** de solutions étalons par dilution d’une solution mère.
2. Régler le spectrophotomètre à λmax, faire le zéro avec le solvant.
3. Mesurer A pour chaque étalon ; tracer A = f(c) : une droite passant par l’origine.
4. Mesurer A de la solution inconnue et lire sa concentration sur la droite (ou calculer c = A / k, où k est le coefficient directeur).

Exemple : k = 1 250 L·mol⁻¹ ; A(inconnue) = 0,45. c = 0,45 / 1 250 = **3,6 × 10⁻⁴ mol·L⁻¹**.

## Le titrage direct
La solution titrante (concentration connue, dans la burette) réagit avec l’espèce titrée selon une **réaction support** supposée **totale**, **rapide** et **unique**.

### L’équivalence
> À l’**équivalence**, les réactifs ont été introduits dans les **proportions stœchiométriques** : il y a changement de réactif limitant. Avant, le titrant est limitant ; après, c’est l’espèce titrée qui est épuisée.

Pour a A + b B → produits (A titré, B titrant) :
= n(A) / a = n(B versé à l’équivalence) / b, soit C_A × V_A / a = C_B × V_E / b

### Repérer l’équivalence
- **Indicateur coloré** : son changement de couleur doit se produire dans la zone de l’équivalence.
- **Suivi pH-métrique** : saut de pH ; l’équivalence se lit par la méthode des tangentes ou au maximum de la dérivée dpH/dV.
- Changement de couleur du milieu lui-même (ion permanganate violet qui persiste).

### Un tableau d’avancement
Le tableau d’avancement permet de décrire l’évolution des quantités de matière de chaque espèce avant et après l’équivalence : c’est utile pour prévoir l’allure d’une courbe (conductimétrie, pH).

## Exemple travaillé
On titre V_A = 20,0 mL de solution de fer(II) par le permanganate de potassium à C_B = 0,020 mol·L⁻¹. Équation : MnO₄⁻ + 5 Fe²⁺ + 8 H⁺ → Mn²⁺ + 5 Fe³⁺ + 4 H₂O. La teinte violette persiste à V_E = 12,5 mL.
n(Fe²⁺) = 5 × C_B × V_E = 5 × 0,020 × 12,5 × 10⁻³ = 1,25 × 10⁻³ mol, donc C_A = 1,25 × 10⁻³ / 0,0200 = **6,25 × 10⁻² mol·L⁻¹**.

## Étalonnage ou titrage ?
| | Étalonnage | Titrage |
| Espèce | non consommée | consommée |
| Condition | propriété mesurable proportionnelle à c | réaction totale, rapide, unique |
| Force | rapide, adapté aux faibles concentrations | exact, sans gamme à préparer |`,
          },
          questions: [
            ['Dans un dosage par étalonnage, l’espèce dosée est…', ['Non consommée', 'Entièrement consommée', 'Transformée en précipité', 'Chauffée'], 0, 'On compare une propriété (absorbance, conductivité) à celles d’étalons.'],
            ['A = 0,60 et k = 1 500 L·mol⁻¹. Concentration ?', ['4,0 × 10⁻⁴ mol·L⁻¹', '9,0 × 10² mol·L⁻¹', '2,5 × 10³ mol·L⁻¹', '0,60 mol·L⁻¹'], 0, 'c = A / k = 0,60 / 1 500.'],
            ['La réaction support d’un titrage doit être…', ['Totale, rapide et unique', 'Lente et partielle', 'Réversible et lente', 'Toujours acido-basique'], 0, 'Sinon, le volume équivalent ne correspondrait pas à la quantité réelle.'],
            ['À l’équivalence…', ['Les réactifs sont dans les proportions stœchiométriques', 'La burette est vide', 'Le pH vaut 7 dans tous les cas', 'L’espèce titrée est en excès'], 0, 'Il y a changement de réactif limitant.'],
            ['Pour A + B → produits, C_A = 0,10 mol·L⁻¹, V_A = 10,0 mL, C_B = 0,050 mol·L⁻¹. V_E ?', ['20,0 mL', '5,0 mL', '10,0 mL', '50,0 mL'], 0, 'C_A × V_A = C_B × V_E, donc V_E = 0,10 × 10,0 / 0,050.'],
            ['Sur une courbe de titrage pH-métrique, l’équivalence se repère…', ['Au saut de pH, par la méthode des tangentes ou la dérivée', 'Au début de la courbe', 'Quand le pH vaut 0', 'Au minimum de la dérivée'], 0, 'Le maximum de dpH/dV donne V_E.'],
            ['Avant l’équivalence, le réactif limitant est…', ['Le réactif titrant versé', 'L’espèce titrée', 'Le solvant', 'L’indicateur'], 0, 'Il est consommé dès qu’il est versé.'],
            ['Le permanganate peut servir d’indicateur de fin de titrage à lui seul.', ['Vrai', 'Faux'], 0, 'Sa couleur violette persiste dès qu’il est en excès.'],
            ['MnO₄⁻ + 5 Fe²⁺ → … : à l’équivalence, n(Fe²⁺) vaut…', ['5 × n(MnO₄⁻ versé)', 'n(MnO₄⁻ versé) / 5', 'n(MnO₄⁻ versé)', '8 × n(MnO₄⁻ versé)'], 0, 'On respecte les coefficients stœchiométriques.'],
            ['La loi de Beer-Lambert n’est valable que…', ['Pour des solutions assez diluées', 'Pour des solutions très concentrées', 'Pour les solides', 'En l’absence de lumière'], 0, 'Aux fortes absorbances, la proportionnalité se perd.'],
            ['Un indicateur coloré de fin de titrage est bien choisi si…', ['Son changement de couleur se produit dans la zone de l’équivalence', 'Il est rouge', 'Il est ajouté en grande quantité', 'Il réagit avec le titrant avant l’équivalence'], 0, 'Sa zone de virage doit contenir le pH à l’équivalence.'],
            ['Quel avantage principal a l’étalonnage spectrophotométrique ?', ['Il convient aux faibles concentrations et n’utilise pas l’espèce', 'Il ne demande aucun étalon', 'Il ne nécessite aucune mesure', 'Il fonctionne sans lumière'], 0, 'Il suffit que l’espèce absorbe à une longueur d’onde donnée.'],
          ],
        },
        {
          titre: 'L’image : histoire, droits et vision des couleurs',
          axe: 'Image',
          lecon: {
            titre: 'De la chambre noire à l’œil',
            cours: `Avant d’étudier l’appareil photographique, il faut comprendre ce qu’est une image, d’où elle vient, à qui elle appartient, et comment notre œil la perçoit.

## Quelques repères historiques
@ Antiquité — la chambre noire (camera obscura) est décrite : un petit trou projette une image renversée
@ 1826 — Nicéphore Niépce fixe la première image photographique durable
@ 1839 — le daguerréotype de Louis Daguerre est rendu public
@ 1907 — les frères Lumière commercialisent l’autochrome, premier procédé couleur
@ 1969 — invention du capteur CCD, base de la photographie numérique
@ 2000 — les premiers téléphones équipés d’un appareil photo apparaissent

## Droit d’auteur et droit à l’image
- Le **droit d’auteur** protège le créateur d’une photographie originale : on ne peut la reproduire ou la diffuser sans son autorisation (sauf exceptions, comme la courte citation avec mention de l’auteur).
- Le **droit à l’image** protège la personne photographiée : on ne peut diffuser sa photo, dans un cadre privé reconnaissable, sans son accord.
> Publier sur un réseau social la photo d’un camarade sans son accord, c’est porter atteinte à son droit à l’image.

## Le modèle optique de l’œil
| Partie de l’œil | Modèle |
| Iris et pupille | **diaphragme** (règle la quantité de lumière) |
| Cristallin (avec la cornée) | **lentille convergente** de vergence variable |
| Rétine | **écran** sur lequel se forme l’image |

Pour voir net, l’image doit se former **sur la rétine**. L’**accommodation** : le cristallin se bombe pour voir de près.
| Défaut | Cause | Correction |
| **Myopie** | œil trop convergent : l’image se forme **avant** la rétine | lentille **divergente** |
| **Hypermétropie** | œil pas assez convergent : l’image se forme **après** la rétine | lentille **convergente** |

## La rétine : cônes et bâtonnets
- Les **bâtonnets** (environ 120 millions) sont très sensibles, fonctionnent en faible lumière, mais ne distinguent pas les couleurs.
- Les **cônes** (environ 6 millions), concentrés au centre (fovéa), permettent la vision des couleurs. Il en existe **trois types**, sensibles au **bleu**, au **vert** et au **rouge** (courbes d’absorption centrées vers 420, 530 et 560 nm).

Notre cerveau reconstruit toutes les couleurs à partir des réponses de ces trois types de cônes.

## Synthèses des couleurs
| Synthèse | Principe | Couleurs primaires | Superposition des trois | Usage |
| **Additive** | on **ajoute** des lumières | rouge, vert, bleu (RVB) | **blanc** | écrans, projecteurs |
| **Soustractive** | des filtres ou pigments **retirent** des lumières | cyan, magenta, jaune | **noir** | impression, peinture |

En synthèse additive : rouge + vert = jaune ; rouge + bleu = magenta ; vert + bleu = cyan.
Un **filtre** coloré transmet sa propre couleur et absorbe les autres : un filtre jaune (= rouge + vert) absorbe le bleu.

## La couleur d’un objet
Un objet éclairé en lumière blanche **diffuse** certaines couleurs et en absorbe d’autres : une tomate diffuse le rouge. Éclairée en lumière bleue, elle paraît noire : il n’y a plus de rouge à diffuser.`,
          },
          questions: [
            ['Qui fixe la première image photographique durable, en 1826 ?', ['Nicéphore Niépce', 'Louis Daguerre', 'Les frères Lumière', 'Isaac Newton'], 0, 'Daguerre, son associé, rendra public le daguerréotype en 1839.'],
            ['Le droit à l’image protège…', ['La personne photographiée', 'Le photographe seulement', 'L’appareil photo', 'Le réseau social'], 0, 'Le droit d’auteur, lui, protège le créateur de la photo.'],
            ['Dans le modèle de l’œil, le cristallin joue le rôle…', ['D’une lentille convergente', 'D’un diaphragme', 'D’un écran', 'D’un capteur CCD'], 0, 'L’iris est le diaphragme, la rétine l’écran.'],
            ['Chez un myope, l’image se forme…', ['Avant la rétine', 'Après la rétine', 'Sur la rétine', 'Sur l’iris'], 0, 'L’œil est trop convergent ; on corrige avec une lentille divergente.'],
            ['Quelles cellules de la rétine permettent la vision des couleurs ?', ['Les cônes', 'Les bâtonnets', 'Les neurones moteurs', 'Les cellules de l’iris'], 0, 'Il en existe trois types, sensibles au bleu, au vert et au rouge.'],
            ['En synthèse additive, rouge + vert donne…', ['Jaune', 'Magenta', 'Cyan', 'Blanc'], 0, 'L’écran d’un téléphone produit ainsi le jaune.'],
            ['Les couleurs primaires de la synthèse soustractive sont…', ['Cyan, magenta, jaune', 'Rouge, vert, bleu', 'Rouge, jaune, bleu', 'Noir et blanc'], 0, 'Ce sont les encres des imprimantes.'],
            ['Superposer les trois lumières primaires rouge, verte et bleue donne du noir.', ['Vrai', 'Faux'], 1, 'On obtient du blanc en synthèse additive ; le noir s’obtient en synthèse soustractive.'],
            ['Un filtre jaune absorbe…', ['Le bleu', 'Le rouge', 'Le vert', 'Le jaune'], 0, 'Jaune = rouge + vert : il transmet ces deux couleurs et absorbe le bleu.'],
            ['Une tomate rouge éclairée en lumière bleue paraît…', ['Noire', 'Rouge', 'Bleue', 'Blanche'], 0, 'Elle ne peut diffuser que du rouge, absent de la lumière reçue.'],
            ['Les bâtonnets sont surtout utiles…', ['En faible lumière', 'Pour voir les couleurs', 'Pour voir de près', 'En plein soleil uniquement'], 0, 'Très sensibles, ils ne distinguent pas les couleurs.'],
            ['On corrige l’hypermétropie avec…', ['Une lentille convergente', 'Une lentille divergente', 'Un filtre coloré', 'Un diaphragme'], 0, 'L’œil hypermétrope n’est pas assez convergent.'],
          ],
        },
        {
          titre: 'Lentilles minces convergentes : conjugaison et grandissement',
          axe: 'Image',
          lecon: {
            titre: 'Prévoir où se forme l’image',
            cours: `L’objectif d’un appareil photo, le cristallin, une loupe : tous se modélisent par une **lentille mince convergente**. Savoir prévoir la position et la taille de l’image est la clé du thème « Image ».

## Le modèle du rayon lumineux
Dans un milieu homogène, la lumière se propage en ligne droite : on la représente par des **rayons**. Le **sténopé** (un petit trou dans une chambre noire) donne une image renversée, d’autant plus nette que le trou est petit, mais peu lumineuse. La lentille permet une image à la fois nette et lumineuse.

## Les éléments d’une lentille convergente
- le **centre optique** O ;
- l’**axe optique** (perpendiculaire à la lentille, passant par O) ;
- le **foyer image** F', où convergent les rayons arrivant parallèles à l’axe ;
- le **foyer objet** F, symétrique de F' par rapport à O ;
- la **distance focale** f' = OF' (en m), et la **vergence** V = 1/f' (en dioptries, δ).
Exemple : f' = 50 mm = 0,050 m donne V = 20 δ.

## Trois rayons particuliers
1. Un rayon passant par **O** n’est pas dévié.
2. Un rayon **parallèle à l’axe** ressort en passant par **F'**.
3. Un rayon passant par **F** ressort **parallèle à l’axe**.
Deux de ces rayons suffisent pour construire l’image B' d’un point B.

## La relation de conjugaison
Avec des mesures **algébriques** (orientées dans le sens de la lumière, origine en O) :
= 1/OA' − 1/OA = 1/f'
Un objet réel placé avant la lentille a OA < 0.

## Le grandissement
= γ = A'B' / AB = OA' / OA
Si γ < 0, l’image est **renversée** ; si |γ| > 1, elle est **plus grande** que l’objet.

## Exemple travaillé
Objet AB de 2,0 cm à 30 cm avant une lentille de f' = 10 cm : OA = −30 cm.
1/OA' = 1/f' + 1/OA = 1/10 − 1/30 = 2/30, donc OA' = **15 cm** (image réelle, après la lentille).
γ = 15 / (−30) = −0,5 : image renversée, deux fois plus petite, A'B' = −1,0 cm.

## Image réelle, image virtuelle : la loupe
> Si l’objet est placé **entre F et O**, les rayons ressortent divergents : aucune image ne se forme sur un écran. L’œil voit une **image virtuelle**, droite et agrandie, du même côté que l’objet : c’est le principe de la **loupe**.

## La focométrie
Mesurer f' au laboratoire : on forme l’image nette d’un objet lumineux sur un écran, on mesure OA et OA', puis on calcule f' par la relation de conjugaison. On répète pour plusieurs positions et on évalue l’incertitude-type de f'. Autre méthode rapide : l’image d’un objet très lointain se forme dans le plan focal image.`,
          },
          questions: [
            ['Un rayon parallèle à l’axe optique ressort d’une lentille convergente en passant par…', ['Le foyer image F′', 'Le centre optique O', 'Le foyer objet F', 'L’objet'], 0, 'C’est la définition du foyer image.'],
            ['Un rayon passant par le centre optique…', ['N’est pas dévié', 'Ressort parallèle à l’axe', 'Passe par F′', 'Est réfléchi'], 0, 'C’est le rayon le plus simple à tracer.'],
            ['Une lentille de distance focale 0,25 m a une vergence de…', ['4 δ', '0,25 δ', '25 δ', '40 δ'], 0, 'V = 1 / f′ = 1 / 0,25 = 4 dioptries.'],
            ['La relation de conjugaison s’écrit…', ['1/OA′ − 1/OA = 1/f′', '1/OA′ + 1/OA = f′', 'OA′ − OA = f′', 'OA × OA′ = f′'], 0, 'Avec des mesures algébriques orientées dans le sens de la lumière.'],
            ['Objet à OA = −20 cm, f′ = 10 cm. Où se forme l’image ?', ['OA′ = 20 cm', 'OA′ = 10 cm', 'OA′ = −20 cm', 'OA′ = 5 cm'], 0, '1/OA′ = 1/10 − 1/20 = 1/20.'],
            ['Un grandissement γ = −2 signifie une image…', ['Renversée et deux fois plus grande', 'Droite et deux fois plus grande', 'Renversée et deux fois plus petite', 'Droite et deux fois plus petite'], 0, 'Le signe indique le sens, la valeur absolue la taille.'],
            ['Pour obtenir l’effet loupe, l’objet doit être placé…', ['Entre le foyer objet et la lentille', 'Très loin de la lentille', 'Exactement au foyer image', 'Derrière la lentille'], 0, 'L’image est alors virtuelle, droite et agrandie.'],
            ['Une image virtuelle peut être recueillie sur un écran.', ['Vrai', 'Faux'], 1, 'Seule une image réelle se forme sur un écran ; l’image virtuelle est vue à travers la lentille.'],
            ['Le grandissement vaut aussi…', ['OA′ / OA', 'OA / OA′', 'OA × OA′', 'f′ / OA'], 0, 'γ = A′B′ / AB = OA′ / OA.'],
            ['L’image d’un objet très éloigné se forme…', ['Dans le plan focal image', 'Au centre optique', 'Au foyer objet', 'À l’infini'], 0, 'Les rayons arrivent parallèles et convergent dans ce plan.'],
            ['Avec un sténopé plus petit, l’image devient…', ['Plus nette mais moins lumineuse', 'Plus lumineuse et floue', 'Droite', 'Virtuelle'], 0, 'Moins de lumière passe, mais chaque point donne une plus petite tache.'],
            ['Objet à OA = −30 cm, image à OA′ = +15 cm. Le grandissement vaut…', ['−0,5', '2', '0,5', '−2'], 0, 'γ = 15 / (−30).'],
          ],
        },
        {
          titre: 'L’appareil photographique numérique',
          axe: 'Image',
          lecon: {
            titre: 'Ouverture, temps de pose, profondeur de champ',
            cours: `Un appareil photographique numérique se modélise très simplement : un **diaphragme**, une **lentille convergente** (l’objectif) et un **capteur** placé à une distance réglable. Tous ses réglages découlent de ce modèle.

## Le modèle
| Élément réel | Modèle | Rôle |
| Objectif | lentille convergente de focale f' | former l’image |
| Diaphragme | ouverture circulaire de diamètre D | doser la lumière |
| Obturateur | s’ouvre pendant le **temps de pose** | doser la durée d’exposition |
| Capteur | écran | recevoir l’image |
La **mise au point** consiste à placer le capteur là où se forme l’image nette : on déplace l’objectif selon la distance du sujet (relation de conjugaison).

## Le nombre d’ouverture
= N = f' / D
Il est gravé sur l’objectif : f/2 ; f/2,8 ; f/4 ; f/5,6 ; f/8 ; f/11 ; f/16. Passer d’une valeur à la suivante divise par deux la surface de l’ouverture, donc la lumière reçue.
> Un **petit** nombre d’ouverture (f/2) correspond à une **grande** ouverture : beaucoup de lumière.

## L’éclairement et l’énergie reçue
L’**éclairement** du capteur (en lux) augmente quand N diminue (il varie comme 1/N²). L’énergie lumineuse reçue par le capteur est proportionnelle à l’éclairement × le **temps de pose**. Pour une même exposition, on peut donc compenser : diviser la lumière par 2 (N de f/4 à f/5,6) et doubler le temps de pose (1/250 s à 1/125 s).
Un temps de pose court fige le mouvement ; un temps long risque le **flou de bougé**.

## L’angle de champ
L’**angle de champ** est la portion de scène que l’appareil capte. Pour un capteur donné, il **diminue** quand la focale augmente : un grand-angle (f' = 24 mm) voit large, un téléobjectif (f' = 200 mm) voit un détail lointain.

## La profondeur de champ
C’est la zone, devant et derrière le sujet, qui paraît nette. Elle **augmente** quand :
- le nombre d’ouverture **augmente** (on ferme le diaphragme) ;
- la focale diminue ;
- le sujet est plus éloigné.
Un portrait à f/2 donne un arrière-plan flou qui isole le sujet ; un paysage à f/11 est net du premier plan à l’horizon.

## Le capteur CCD ou CMOS
Le capteur est une mosaïque de **pixels** : chacun convertit la lumière reçue en charge électrique (effet photoélectrique), ensuite numérisée. Un filtre coloré (rouge, vert ou bleu) devant chaque photosite permet de reconstituer les couleurs.
- La **résolution** : nombre de pixels (par exemple 6 000 × 4 000 = 24 millions de pixels).
- La **sensibilité** (ISO) : amplification du signal ; une sensibilité élevée permet de photographier dans la pénombre, au prix d’un **bruit** (grain) plus visible.

## Exemple
Objectif de focale 50 mm, diamètre de l’ouverture 12,5 mm : N = 50 / 12,5 = **4**, soit f/4.`,
          },
          questions: [
            ['Le nombre d’ouverture N vaut…', ['f′ / D', 'D / f′', 'f′ × D', 'D²'], 0, 'f′ est la focale, D le diamètre de l’ouverture du diaphragme.'],
            ['Focale 100 mm, diamètre d’ouverture 25 mm : N vaut…', ['4', '0,25', '2 500', '125'], 0, 'N = 100 / 25 = 4, soit f/4.'],
            ['Un petit nombre d’ouverture (f/2) correspond à…', ['Une grande ouverture, beaucoup de lumière', 'Une petite ouverture', 'Un temps de pose long', 'Une grande profondeur de champ'], 0, 'N = f′ / D : D grand donne N petit.'],
            ['Pour augmenter la profondeur de champ, on…', ['Augmente le nombre d’ouverture (on ferme)', 'Ouvre au maximum', 'Augmente la focale', 'Rapproche le sujet'], 0, 'Un diaphragme fermé étend la zone nette.'],
            ['Un temps de pose court permet surtout…', ['De figer un mouvement', 'D’augmenter la lumière reçue', 'D’augmenter la profondeur de champ', 'De réduire la résolution'], 0, 'Le sujet n’a pas le temps de bouger pendant l’exposition.'],
            ['Quand la focale augmente, l’angle de champ…', ['Diminue', 'Augmente', 'Reste constant', 'Double toujours'], 0, 'Un téléobjectif cadre serré.'],
            ['On passe de f/4 à f/5,6. Pour garder la même exposition, le temps de pose doit…', ['Doubler', 'Être divisé par deux', 'Rester le même', 'Être multiplié par quatre'], 0, 'La lumière reçue par seconde est divisée par deux.'],
            ['Monter la sensibilité ISO augmente le bruit de l’image.', ['Vrai', 'Faux'], 0, 'L’amplification du signal amplifie aussi le bruit électronique.'],
            ['La mise au point consiste à…', ['Placer le capteur là où se forme l’image nette', 'Régler le temps de pose', 'Changer de sensibilité', 'Choisir le format du fichier'], 0, 'Elle dépend de la distance du sujet.'],
            ['Un capteur de 4 000 × 3 000 pixels compte…', ['12 millions de pixels', '7 000 pixels', '1,2 million de pixels', '120 millions de pixels'], 0, '4 000 × 3 000 = 12 000 000.'],
            ['Pour un portrait à l’arrière-plan flou, on choisit…', ['Une grande ouverture (petit N)', 'Un petit diaphragme (grand N)', 'Un grand-angle très court', 'Un temps de pose très long'], 0, 'La profondeur de champ est alors faible.'],
            ['Chaque pixel d’un capteur convertit la lumière en…', ['Charge électrique', 'Chaleur', 'Son', 'Pression'], 0, 'C’est l’effet photoélectrique, avant la numérisation.'],
          ],
        },
        {
          titre: 'Stocker et transmettre une image numérique',
          axe: 'Image',
          lecon: {
            titre: 'Des millions de nombres',
            cours: `Une photographie numérique n’est qu’un tableau de nombres. Savoir comment ces nombres codent la couleur permet de calculer la **taille** d’une image et la **durée** de sa transmission.

## Le codage RVB
Chaque pixel est décrit par trois nombres : l’intensité de **rouge**, de **vert** et de **bleu** (synthèse additive). En codage courant, chaque composante est codée sur **8 bits**, donc prend 2⁸ = **256** valeurs (de 0 à 255).
| Couleur | R | V | B |
| Noir | 0 | 0 | 0 |
| Blanc | 255 | 255 | 255 |
| Rouge pur | 255 | 0 | 0 |
| Jaune | 255 | 255 | 0 |
| Gris moyen | 128 | 128 | 128 |
Un pixel occupe donc 3 × 8 = **24 bits = 3 octets**, et peut prendre 256³ ≈ **16,8 millions** de couleurs.

## Bits et octets
- 1 **octet** = 8 bits.
- 1 ko = 10³ octets ; 1 Mo = 10⁶ octets ; 1 Go = 10⁹ octets (préfixes du Système international).
(Certains systèmes utilisent 1 Kio = 1 024 octets : il faut lire l’unité.)

## La capacité mémoire d’une image
= taille (octets) = nombre de pixels × nombre d’octets par pixel
Exemple : une image de 4 000 × 3 000 pixels en RVB 24 bits occupe 12 × 10⁶ × 3 = 36 × 10⁶ octets = **36 Mo** sans compression. Les formats compressés (JPEG) réduisent fortement cette taille, parfois au prix d’une perte de qualité.

## Une image en niveaux de gris
Si chaque pixel n’a qu’une composante (niveau de gris) sur 8 bits, l’image pèse trois fois moins : 1 octet par pixel.

## La chaîne de transmission
Transmettre une image, c’est faire passer ces nombres d’un émetteur à un récepteur :
~ source (fichier) → codage → émetteur → canal (câble, fibre, ondes) → récepteur → décodage → affichage

Le **débit binaire** D est le nombre de bits transmis par seconde (bit·s⁻¹, souvent Mbit·s⁻¹).
= durée = taille (en bits) / débit
> Attention aux unités : une taille en **octets** doit être multipliée par 8 avant de la diviser par un débit en **bits** par seconde.

## Exemple travaillé
Une image compressée de 4,5 Mo est envoyée avec un débit de 20 Mbit·s⁻¹.
Taille en bits : 4,5 × 10⁶ × 8 = 3,6 × 10⁷ bits. Durée : 3,6 × 10⁷ / 2,0 × 10⁷ = **1,8 s**.

## Définition et résolution
La **définition** d’une image est son nombre de pixels (6 000 × 4 000) ; la **résolution** d’impression est le nombre de pixels par unité de longueur (en ppp, pixels par pouce). Une image de 3 000 pixels de large imprimée à 300 ppp mesure 10 pouces, soit environ 25 cm.`,
          },
          questions: [
            ['En codage RVB 24 bits, chaque composante est codée sur…', ['8 bits', '24 bits', '3 bits', '1 bit'], 0, '3 composantes × 8 bits = 24 bits par pixel.'],
            ['Combien de valeurs différentes une composante codée sur 8 bits peut-elle prendre ?', ['256', '8', '255', '1 024'], 0, '2⁸ = 256 valeurs, de 0 à 255.'],
            ['Le code RVB (255, 255, 0) correspond à…', ['Jaune', 'Cyan', 'Magenta', 'Blanc'], 0, 'Rouge + vert en synthèse additive donne jaune.'],
            ['Un octet vaut…', ['8 bits', '10 bits', '1 bit', '1 024 bits'], 0, 'C’est l’unité de base de la mémoire.'],
            ['Taille non compressée d’une image de 1 000 × 1 000 pixels en RVB 24 bits ?', ['3 Mo', '1 Mo', '24 Mo', '3 ko'], 0, '10⁶ pixels × 3 octets = 3 × 10⁶ octets.'],
            ['Le débit binaire s’exprime en…', ['bit·s⁻¹', 'octets', 'hertz', 'pixels'], 0, 'C’est le nombre de bits transmis par seconde.'],
            ['Un fichier de 10 Mo transmis à 40 Mbit·s⁻¹ met…', ['2 s', '0,25 s', '4 s', '400 s'], 0, '10 × 10⁶ × 8 = 8 × 10⁷ bits ; 8 × 10⁷ / 4 × 10⁷ = 2 s.'],
            ['Une image en niveaux de gris sur 8 bits pèse trois fois moins que la même en RVB 24 bits.', ['Vrai', 'Faux'], 0, '1 octet par pixel au lieu de 3.'],
            ['Combien de couleurs permet le codage RVB 24 bits ?', ['Environ 16,8 millions', '256', '768', 'Environ 1 million'], 0, '256³ ≈ 16 777 216.'],
            ['Le code (0, 0, 0) correspond au…', ['Noir', 'Blanc', 'Gris', 'Rouge'], 0, 'Aucune lumière émise.'],
            ['La compression JPEG permet surtout…', ['De réduire la taille du fichier', 'D’augmenter le nombre de pixels', 'D’améliorer toujours la qualité', 'De supprimer les couleurs'], 0, 'Elle peut entraîner une perte de qualité.'],
            ['La définition d’une image est…', ['Son nombre de pixels', 'Sa taille imprimée en cm', 'Son débit', 'Sa luminosité'], 0, 'La résolution d’impression, elle, se compte en pixels par pouce.'],
          ],
        },
        {
          titre: 'Instruments et chaînes de mesure',
          axe: 'Instrumentation',
          lecon: {
            titre: 'Du phénomène physique au nombre affiché',
            cours: `Un thermomètre numérique, un pH-mètre, un spectrophotomètre : derrière chaque affichage se cache une **chaîne de mesure** qui transforme une grandeur physique en nombre.

## Choisir un instrument
On choisit un instrument selon un **cahier des charges** : la grandeur à mesurer, l’**étendue de mesure** (valeurs minimale et maximale), la **résolution** (plus petite variation détectable), l’**exactitude** attendue, le temps de réponse, le coût. La **documentation du constructeur** donne ces caractéristiques.

## Mesure directe ou par étalonnage
- Mesure directe : on lit la valeur (règle, balance).
- **Mesure par étalonnage** : l’appareil mesure une grandeur liée à celle qui nous intéresse (absorbance → concentration, conductivité → concentration, tension → température). Il faut établir la relation à l’aide d’**étalons**.

## La chaîne de mesure
~ grandeur physique → capteur → conditionneur → convertisseur analogique-numérique (CAN) → traitement et affichage

| Maillon | Rôle | Exemple |
| **Capteur** | convertit la grandeur à mesurer en une grandeur électrique | thermistance : sa résistance varie avec T |
| **Conditionneur** | transforme ce signal en **tension** exploitable | pont diviseur de tension, amplificateur |
| **CAN** | convertit la tension analogique en nombre binaire | carte d’acquisition, microcontrôleur |

## La caractéristique de transfert
C’est la courbe qui relie la sortie du capteur (ou du conditionneur) à la grandeur mesurée. Si elle est linéaire, on la décrit par une droite :
= U = k × T + U₀
La **sensibilité** est le coefficient k : la variation de la sortie pour une variation unité de l’entrée (par exemple 10 mV·°C⁻¹).

## Le convertisseur analogique-numérique
Un CAN de **n bits** découpe sa plage de tension en 2ⁿ niveaux. Le **quantum** q est le plus petit écart de tension qu’il distingue :
= q = plage de tension / 2ⁿ
Exemple : CAN de 10 bits sur 0 – 5 V : q = 5 / 1 024 ≈ **4,9 mV**.
> La **résolution** de toute la chaîne dépend du maillon le plus grossier : un capteur de 10 mV·°C⁻¹ lu par un CAN de quantum 4,9 mV distingue environ 0,5 °C.

## Exemple : un thermomètre à thermistance
1. Capteur : la thermistance CTN, dont la résistance diminue quand T augmente.
2. Conditionneur : un pont diviseur alimenté en 5 V donne une tension qui dépend de la résistance.
3. CAN du microcontrôleur (10 bits).
4. Programme : il convertit le nombre lu en tension, puis en température à l’aide de la caractéristique de transfert établie par étalonnage (dans l’eau à plusieurs températures mesurées par un thermomètre de référence).

## L’incertitude d’une mesure par instrument
Pour une mesure unique, l’incertitude-type se déduit des données du constructeur (tolérance ± Δ, donc u = Δ/√3) ; pour des mesures répétées, de l’écart-type. La numérisation ajoute une incertitude de l’ordre du quantum.`,
          },
          questions: [
            ['Le rôle du capteur est de…', ['Convertir la grandeur mesurée en grandeur électrique', 'Afficher le résultat', 'Stocker les données', 'Alimenter le circuit'], 0, 'C’est le premier maillon de la chaîne de mesure.'],
            ['Le conditionneur…', ['Transforme le signal du capteur en tension exploitable', 'Convertit la tension en nombre', 'Mesure directement la température', 'Remplace le capteur'], 0, 'Pont diviseur ou amplificateur sont des conditionneurs typiques.'],
            ['Que fait un CAN ?', ['Il convertit une tension analogique en nombre binaire', 'Il amplifie un signal', 'Il chauffe le capteur', 'Il filtre la lumière'], 0, 'Convertisseur analogique-numérique.'],
            ['Quantum d’un CAN de 8 bits sur 0 – 5 V ?', ['Environ 19,5 mV', '0,625 V', '5 mV', '1,6 V'], 0, 'q = 5 / 256 ≈ 0,0195 V.'],
            ['La sensibilité d’un capteur est…', ['La variation de la sortie pour une variation unité de l’entrée', 'Sa plage de mesure', 'Son prix', 'Sa masse'], 0, 'C’est la pente de la caractéristique de transfert.'],
            ['Une thermistance CTN a une résistance qui…', ['Diminue quand la température augmente', 'Augmente quand la température augmente', 'Ne varie pas', 'Dépend de la lumière'], 0, 'CTN : coefficient de température négatif.'],
            ['Augmenter le nombre de bits du CAN diminue le quantum.', ['Vrai', 'Faux'], 0, 'La plage est découpée en davantage de niveaux.'],
            ['Un spectrophotomètre mesure une concentration par…', ['Étalonnage', 'Lecture directe sur une règle', 'Pesée', 'Chronométrage'], 0, 'Il mesure l’absorbance, reliée à la concentration par des étalons.'],
            ['Capteur de sensibilité 10 mV·°C⁻¹ ; la tension augmente de 0,25 V. Variation de température ?', ['25 °C', '2,5 °C', '0,025 °C', '250 °C'], 0, '0,25 V = 250 mV ; 250 / 10 = 25 °C.'],
            ['L’étendue de mesure d’un instrument est…', ['L’intervalle entre ses valeurs minimale et maximale mesurables', 'Sa plus petite graduation', 'Sa précision', 'Son temps de réponse'], 0, 'Elle fait partie du cahier des charges.'],
            ['La résolution d’une chaîne de mesure est fixée par…', ['Son maillon le plus grossier', 'Son maillon le plus fin', 'L’afficheur seulement', 'La couleur des fils'], 0, 'Un excellent CAN ne corrige pas un capteur peu sensible.'],
            ['Comment établit-on la caractéristique de transfert d’un thermomètre à thermistance ?', ['Par étalonnage avec un thermomètre de référence', 'En lisant la notice seulement', 'Par une CCM', 'Par titrage'], 0, 'On relève la tension à plusieurs températures connues.'],
          ],
        },
        {
          titre: 'Chaîne de mesure en tout ou rien et régulation de température',
          axe: 'Instrumentation',
          lecon: {
            titre: 'Allumé, éteint, allumé',
            cours: `Parfois, on n’a pas besoin de connaître une valeur précise, seulement de savoir si elle **dépasse un seuil** : c’est la mesure en **tout ou rien**. Elle suffit pour déclencher une alerte ou pour réguler une température.

## La chaîne en tout ou rien
~ capteur → conditionneur → comparaison à un seuil → action (alarme, relais, chauffage)

La sortie ne prend que **deux états** : 0 ou 1, vrai ou faux, marche ou arrêt. La comparaison peut être faite par un comparateur électronique ou, plus souplement, par un **microcontrôleur** qui lit la tension du capteur et la compare au seuil dans son programme.

## Un dispositif d’alerte
Exemple : une alarme de congélateur qui sonne au-dessus de −12 °C, un détecteur de niveau d’eau, un capteur de CO₂ dans une salle. Le programme répète en boucle :
\`\`\`
lire la tension du capteur
convertir en température
si température > seuil alors allumer l’alarme
sinon éteindre l’alarme
attendre, puis recommencer
\`\`\`
On attend de toi que tu saches **lire** un tel code et **l’adapter** : changer la valeur du seuil, le numéro de la broche, la durée d’attente.

## La régulation de température tout ou rien
Pour maintenir une température proche d’une **consigne** (un bain thermostaté, un incubateur, un aquarium) :
- si la température mesurée est **inférieure** à la consigne, le chauffage s’**allume** ;
- si elle est **supérieure**, il s’**éteint**.

> Une régulation tout ou rien ne stabilise jamais parfaitement la température : elle **oscille** autour de la consigne, car le système a de l’inertie (l’eau continue de chauffer un peu après l’arrêt de la résistance).

## L’hystérésis
Si le seuil d’allumage et le seuil d’extinction étaient identiques, le chauffage basculerait sans cesse autour de la consigne (usure du relais). On utilise donc **deux seuils** : par exemple allumer sous 36,5 °C et éteindre au-dessus de 37,5 °C. L’écart entre les deux est l’**hystérésis** : les oscillations sont plus larges, mais moins fréquentes.
| Hystérésis | Oscillations | Commutations |
| faible | amplitude faible | très fréquentes |
| grande | amplitude grande | rares |

## Exploiter un enregistrement
Sur la courbe T = f(t) d’une régulation, on repère : la **montée** initiale, la consigne, l’**amplitude** des oscillations, leur **période**, et les instants de commutation du chauffage. On peut comparer plusieurs réglages de seuils.

## Exemple
Un incubateur à 37 °C a une hystérésis de ± 0,5 °C. La température oscille entre environ 36,5 et 37,5 °C, parfois un peu au-delà à cause de l’inertie : le dépassement au-dessus de 37,5 °C montre que la résistance chauffante restitue encore de la chaleur après avoir été coupée.`,
          },
          questions: [
            ['Une mesure en tout ou rien donne une sortie qui prend…', ['Deux états seulement', 'Une infinité de valeurs', 'Trois états', 'Une valeur en degrés'], 0, 'Seuil franchi ou non.'],
            ['Dans une régulation tout ou rien, si la température est sous la consigne…', ['Le chauffage s’allume', 'Le chauffage s’éteint', 'L’alarme sonne toujours', 'Rien ne se passe'], 0, 'Il s’éteint quand la température dépasse la consigne.'],
            ['Pourquoi la température oscille-t-elle autour de la consigne ?', ['À cause de l’inertie du système', 'Parce que le capteur est cassé', 'Parce que le programme est faux', 'À cause de la couleur du bain'], 0, 'Le système continue d’évoluer un peu après chaque commutation.'],
            ['L’hystérésis est…', ['L’écart entre le seuil d’allumage et le seuil d’extinction', 'La température de consigne', 'La durée de chauffage', 'Le quantum du CAN'], 0, 'Elle limite le nombre de commutations.'],
            ['Augmenter l’hystérésis rend les commutations…', ['Plus rares, avec des oscillations plus larges', 'Plus fréquentes', 'Impossibles', 'Plus précises'], 0, 'C’est un compromis entre précision et usure.'],
            ['Pour changer le seuil d’une alarme programmée, on…', ['Modifie la valeur du seuil dans le code', 'Change le capteur', 'Débranche le microcontrôleur', 'Ajoute un CAN'], 0, 'On attend des élèves qu’ils adaptent un code fourni.'],
            ['Une régulation tout ou rien maintient exactement la consigne, sans aucune oscillation.', ['Vrai', 'Faux'], 1, 'Elle oscille toujours autour de la consigne.'],
            ['Un incubateur réglé à 37 °C avec des seuils 36,5 et 37,5 °C allume son chauffage…', ['Sous 36,5 °C', 'Au-dessus de 37,5 °C', 'À exactement 37 °C', 'En permanence'], 0, 'Il s’éteindra au-dessus de 37,5 °C.'],
            ['Quel exemple relève d’un dispositif d’alerte en tout ou rien ?', ['Une alarme de congélateur au-dessus de −12 °C', 'Un spectrophotomètre', 'Une balance', 'Une burette'], 0, 'Seul compte le franchissement du seuil.'],
            ['Dans la chaîne en tout ou rien, la comparaison au seuil peut être faite par…', ['Un microcontrôleur', 'Une fiole jaugée', 'Une lentille', 'Un réfrigérant'], 0, 'Il lit la tension et exécute le programme.'],
            ['Sur un enregistrement de régulation, la période des oscillations est…', ['La durée entre deux maximums successifs', 'La température maximale', 'La consigne', 'Le temps de montée initial'], 0, 'Elle renseigne sur la fréquence des commutations.'],
            ['Deux seuils identiques d’allumage et d’extinction provoqueraient…', ['Des commutations incessantes autour de la consigne', 'Une température parfaitement stable', 'L’arrêt définitif du chauffage', 'Une baisse de la consigne'], 0, 'D’où l’intérêt d’une hystérésis.'],
          ],
        },
        {
          titre: 'La démarche de projet en SPCL',
          axe: 'Ouverture vers le monde de la recherche ou de l’industrie et initiation à la démarche de projet',
          lecon: {
            titre: 'Du problème à la présentation',
            cours: `Une partie de l’horaire de SPCL est consacrée à des **études de cas** et **mini-projets**. Ils préparent le **projet** de terminale, mené en équipe avec plus d’autonomie, et souvent présenté au **Grand oral**. Le but : apprendre à se poser une question de sciences, imaginer une réponse, la tester et la défendre.

## Les phases d’un projet
1. **S’approprier** : rechercher des informations, cerner le champ d’étude, le **simplifier** pour énoncer une problématique précise, ou analyser un **cahier des charges** fourni.
2. **Analyser** : formuler des **hypothèses**, proposer des pistes de résolution, choisir un protocole, **planifier** les étapes (qui fait quoi, quand, avec quel matériel).
3. **Réaliser** : mettre en œuvre le protocole en respectant les règles de sécurité, mesurer, noter tout dans un cahier de laboratoire.
4. **Valider** : analyser les résultats avec esprit critique, estimer les incertitudes, confronter aux objectifs initiaux, proposer des améliorations.
5. **Communiquer** : rédiger une **note concise**, présenter oralement ses choix et ses résultats, répondre aux questions.

> Un bon projet part d’une question **précise et mesurable**. « Étudier le lait » est un thème ; « la conductivité d’un lait permet-elle de détecter un mouillage (ajout d’eau) supérieur à 10 % ? » est une problématique.

## Le cahier des charges
Il fixe ce que doit faire la solution : les grandeurs à mesurer, l’exactitude attendue, les contraintes (coût, matériel disponible, sécurité, durée, impact environnemental). Chaque choix du projet doit pouvoir se justifier par rapport à lui.

## Le cahier de laboratoire
On y note, datés : les protocoles, les réglages, les mesures brutes (jamais recopiées au propre après coup), les incidents, les idées. C’est la mémoire du projet et la preuve de ce qui a été fait.

## Travailler en équipe
- répartir les rôles selon les compétences, sans laisser personne de côté ;
- faire des points d’étape réguliers ;
- garder une trace partagée (document collaboratif).

## Présenter à l’oral
| À faire | À éviter |
| annoncer la problématique dès le début | lire ses notes |
| montrer un graphique lisible, avec unités et incertitudes | des diapositives surchargées de texte |
| expliquer un choix, puis sa limite | cacher un résultat décevant |
| conclure en répondant à la question posée | finir sur « voilà » |

## S’ouvrir au monde professionnel
Rencontres avec des chercheurs ou des ingénieurs, visites d’entreprises (laboratoire d’analyses, industrie agroalimentaire, station d’épuration) : elles montrent comment les notions du programme servent dans les **métiers** du laboratoire, et donnent des idées de sujets.

## Exemple de mini-projet
Problématique : « Un capteur de température bon marché, relié à un microcontrôleur, peut-il remplacer le thermomètre du bain thermostaté avec une incertitude inférieure à 0,5 °C ? » Étapes : étalonnage du capteur contre un thermomètre de référence, estimation de l’incertitude, comparaison au cahier des charges, conclusion argumentée.`,
          },
          questions: [
            ['Quelle est la première phase d’un projet ?', ['S’approprier le sujet et définir la problématique', 'Rédiger la conclusion', 'Faire les mesures', 'Présenter à l’oral'], 0, 'On cerne et simplifie le problème avant d’agir.'],
            ['Laquelle de ces formulations est une vraie problématique ?', ['La conductivité permet-elle de détecter un mouillage du lait supérieur à 10 % ?', 'Étudier le lait', 'Le lait et la chimie', 'Faire des expériences sur le lait'], 0, 'Elle est précise et mesurable.'],
            ['Un cahier des charges fixe…', ['Ce que doit faire la solution et ses contraintes', 'Les résultats attendus à l’avance', 'La note du projet', 'L’ordre de passage à l’oral'], 0, 'Tous les choix du projet se justifient par rapport à lui.'],
            ['Dans le cahier de laboratoire, on note les mesures…', ['Brutes, au moment où on les fait', 'Recopiées au propre après coup', 'Seulement si elles sont bonnes', 'Arrondies sans unité'], 0, 'C’est la trace fidèle et datée du travail.'],
            ['Valider des résultats, c’est notamment…', ['Estimer les incertitudes et confronter aux objectifs', 'Recommencer jusqu’à obtenir la valeur voulue', 'Supprimer les mesures gênantes', 'Changer la problématique'], 0, 'L’esprit critique fait partie de la démarche.'],
            ['À l’oral, il faut éviter…', ['De lire ses notes', 'D’annoncer la problématique', 'De montrer un graphique lisible', 'D’expliquer ses choix'], 0, 'Un oral se parle, il ne se lit pas.'],
            ['Un résultat décevant doit être caché lors de la présentation.', ['Vrai', 'Faux'], 1, 'On l’explique et on en tire des pistes d’amélioration.'],
            ['La planification consiste à…', ['Répartir les tâches et fixer les étapes dans le temps', 'Faire toutes les mesures en même temps', 'Choisir la couleur des diapositives', 'Rédiger la bibliographie'], 0, 'Elle évite de manquer de temps ou de matériel.'],
            ['Le projet de terminale peut être présenté…', ['Au Grand oral', 'Uniquement par écrit', 'Jamais à l’oral', 'Seulement aux parents'], 0, 'La question présentée au Grand oral s’appuie souvent sur les spécialités.'],
            ['Pourquoi rencontrer des chercheurs ou visiter des entreprises ?', ['Pour relier le programme aux métiers et trouver des idées', 'Pour éviter les cours', 'Pour obtenir les résultats du projet', 'Pour remplacer le cahier de laboratoire'], 0, 'C’est l’ouverture vers le monde de la recherche ou de l’industrie.'],
            ['La note concise de fin de projet sert à…', ['Rendre compte du travail et confronter les résultats aux objectifs', 'Recopier le cours', 'Lister le matériel acheté', 'Remplacer l’oral'], 0, 'Chaque élève y montre ce qu’il a compris.'],
            ['Une hypothèse doit être…', ['Testable par une expérience', 'Toujours vraie', 'Formulée après les résultats', 'Hors du sujet'], 0, 'Le protocole est conçu pour la mettre à l’épreuve.'],
          ],
        },
      ],
    },
  ],
}
