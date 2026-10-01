// INGÉNIERIE ET DÉVELOPPEMENT DURABLE (I2D) — PREMIÈRE STI2D (spécialité de
// 9 h). Matière propre à la voie technologique.
//
// SOURCE : programme d’innovation technologique et d’ingénierie et
// développement durable de première STI2D (annexe 1, arrêté du 17/01/2019,
// BO spécial n° 1 du 22/01/2019). Les « connaissances associées » y sont
// rangées en six chapitres ; l’axe de chaque fiche est la rubrique du programme
// qui la coiffe. I2D porte l’approche pluritechnologique matière – énergie –
// information : chaînes de puissance et d’information, comportement des
// produits, simulation, matériaux, expérimentation.
//
// ÉVALUATION : I2D n’a pas d’épreuve propre. Elle fusionne avec l’innovation
// technologique dans la spécialité 2I2D de terminale, évaluée par l’épreuve
// écrite et l’épreuve pratique de terminale (cf. i2d-tle.mjs).
//
// PAS DE LATEX : formules en texte, lignes « = » pour les formules à retenir.

export default {
  slug: 'ingenierie-dd',
  nom: 'Ingénierie et développement durable',

  titreMigration: 'INGÉNIERIE ET DÉVELOPPEMENT DURABLE 1re STI2D — LE PROGRAMME OFFICIEL (14 fiches)',

  motif: `Matière neuve de la voie technologique (1re STI2D). Quatorze fiches rangées
sous les rubriques du programme officiel (BO spécial n° 1 du 22/01/2019,
annexe 1) : développement durable et triptyque matière-énergie-information,
ingénierie système et SysML, flux MEI, chaîne de puissance, liaisons, chaîne
d'information, codage et algorithmique, réseaux, simulation, comportements
mécanique, énergétique et informationnel, matériaux, expérimentation.`,

  blocs: [
    {
      niveaux: ['1re'],
      positionDepart: 1,
      chapitres: [
        // ---- 1 ---------------------------------------------------------------
        {
          titre: 'Développement durable et triptyque matière-énergie-information',
          axe: 'Principes de conception des produits et développement durable',
          lecon: {
            titre: 'Concevoir des produits pour un monde aux ressources limitées',
            cours: `Tout produit technique transforme de la **matière**, consomme de l’**énergie** et traite de l’**information**. La série STI2D s’appuie sur ce triptyque, et sur une exigence : le **développement durable**.

## Le développement durable
C’est un développement qui répond aux besoins du présent **sans compromettre** la capacité des générations futures à répondre aux leurs. Il repose sur trois piliers :
| Le pilier | La question pour un produit |
| **Environnemental** | Quelles ressources consomme-t-il, quels rejets produit-il ? |
| **Économique** | Est-il viable pour l’entreprise et abordable pour l’usager ? |
| **Social** | Est-il utile, sûr, fabriqué dans de bonnes conditions ? |

> Un produit durable doit tenir les trois piliers à la fois : un produit écologique mais invendable n’est pas durable.

## Le triptyque MEI
| Le champ | Ce qu’on étudie | Exemple sur un vélo électrique |
| **Matière** | Structure, matériaux, formes, assemblages | Cadre en aluminium, pneus |
| **Énergie** | Stockage, conversion, transmission | Batterie, moteur, chaîne |
| **Information** | Capteurs, traitement, communication | Capteur de pédalage, écran, carte de commande |

## Les enjeux énergétiques mondiaux
- Environ **80 %** de l’énergie primaire mondiale vient encore des **combustibles fossiles** (pétrole, gaz, charbon), qui émettent du CO2.
- L’extraction devient plus **complexe** et plus coûteuse (gisements profonds, sables bitumineux).
- On oppose la **production centralisée** (grandes centrales, réseau de transport) et la **production locale** (panneaux sur un toit, éolienne de quartier), plus proche des consommateurs mais intermittente.
- Transporter l’énergie a un coût et des **pertes**.

## Utiliser les ressources avec raison
L’**efficacité énergétique** d’un produit, c’est le rapport entre le service rendu et l’énergie consommée. On l’améliore en :
1. réduisant les **pertes** (frottements, effet Joule, fuites thermiques) ;
2. choisissant des composants à haut **rendement** ;
3. ajoutant une **chaîne d’information** qui commande intelligemment la puissance : n’allumer que quand c’est utile, moduler la puissance au besoin.

## Exemple travaillé
Un éclairage de couloir de 10 lampes de 60 W reste allumé 12 h par jour. Énergie consommée : 10 × 60 × 12 = 7 200 Wh, soit **7,2 kWh par jour**. On remplace par des LED de 8 W et on ajoute un détecteur de présence qui réduit l’allumage à 3 h par jour : 10 × 8 × 3 = 240 Wh, soit **0,24 kWh**. L’énergie consommée est divisée par **30** : c’est l’effet combiné d’un meilleur composant (matière, énergie) et d’une commande (information).

> L’information est souvent le levier le moins cher pour économiser l’énergie.`,
          },
          questions: [
            ['Quels sont les trois piliers du développement durable ?', ['Conception, fabrication, recyclage', 'Matière, énergie, information', 'Environnemental, économique, social', 'Coût, délai, qualité'], 2, 'Un produit durable doit les satisfaire tous les trois.'],
            ['Que désigne le triptyque MEI ?', ['Matière, énergie, information', 'Mesure, essai, interprétation', 'Moteur, engrenage, inverseur', 'Mécanique, électricité, informatique'], 0, 'C’est la grille d’analyse de tout produit en STI2D.'],
            ['Sur un vélo électrique, le capteur de pédalage appartient au champ…', ['social', 'matière', 'énergie', 'information'], 3, 'Il acquiert une information sur l’effort du cycliste.'],
            ['Quelle part de l’énergie primaire mondiale vient encore des combustibles fossiles ?', ['Environ 50 %', 'Environ 80 %', '100 %', 'Environ 20 %'], 1, 'Pétrole, gaz et charbon dominent toujours.'],
            ['10 lampes de 60 W allumées 12 h consomment…', ['720 Wh', '7,2 kWh', '72 kWh', '600 Wh'], 1, '10 × 60 × 12 = 7 200 Wh = 7,2 kWh.'],
            ['10 LED de 8 W allumées 3 h consomment…', ['240 Wh', '80 Wh', '2,4 kWh', '24 Wh'], 0, '10 × 8 × 3 = 240 Wh.'],
            ['Un panneau solaire sur le toit d’une maison relève de la production…', ['centralisée', 'locale', 'fossile', 'nucléaire'], 1, 'Elle est proche du consommateur, mais intermittente.'],
            ['Un produit écologique mais invendable est durable.', ['Vrai', 'Faux'], 1, 'Il ne tient pas le pilier économique.'],
            ['Quel levier est souvent le moins cher pour économiser l’énergie ?', ['Augmenter la puissance', 'Doubler l’isolation', 'Changer de matériau', 'Ajouter une commande intelligente (information)'], 3, 'Allumer seulement quand c’est utile coûte peu.'],
            ['Qu’est-ce que l’efficacité énergétique d’un produit ?', ['Le rapport entre le service rendu et l’énergie consommée', 'Son prix', 'Sa masse', 'Sa puissance maximale'], 0, 'On l’augmente en réduisant les pertes et en commandant mieux.'],
            ['Transporter l’énergie sur de longues distances se fait sans aucune perte.', ['Vrai', 'Faux'], 1, 'Les lignes électriques dissipent de l’énergie par effet Joule.'],
            ['Laquelle est une perte à réduire pour améliorer l’efficacité ?', ['Le confort', 'Le service rendu', 'Les frottements', 'L’information'], 2, 'Frottements, effet Joule et fuites thermiques sont des pertes.'],
          ],
        },
        // ---- 2 ---------------------------------------------------------------
        {
          titre: 'L’ingénierie système et le SysML',
          axe: 'Outils de l’ingénierie système',
          lecon: {
            titre: 'Décrire un système avant de le concevoir',
            cours: `Un produit moderne mêle mécanique, électronique et logiciel. Pour le concevoir sans rien oublier, l’ingénieur utilise l’**ingénierie système** et un langage graphique commun : le **SysML**.

## Qu’est-ce qu’un système ?
Un ensemble d’éléments en interaction, organisés pour remplir une **mission**. On le délimite par une **frontière** : ce qui est dedans (le système) et ce qui est dehors (son **environnement** : utilisateurs, milieu, autres systèmes).
| Le vocabulaire | Définition |
| **Système d’intérêt** | Celui qu’on étudie |
| **Sous-système** | Une partie du système |
| **Parties prenantes** | Tous ceux qui sont concernés : utilisateur, client, mainteneur, réglementation |

## Le cycle en V
~ Analyse du besoin → Spécifications → Conception → Réalisation → Intégration → Vérification → Validation
La branche descendante **définit** le système, la branche montante le **vérifie**. Chaque étape montante répond à une étape descendante : on valide le produit final par rapport au **besoin** initial, on vérifie les sous-ensembles par rapport aux **spécifications**. En pratique, on fait des allers-retours : la conception n’est pas séquentielle.

## Les diagrammes SysML à connaître
| Le diagramme | Ce qu’il décrit | Il répond à |
| **Cas d’utilisation** (uc) | Les services rendus aux acteurs | À quoi sert le système ? |
| **Exigences** (req) | Ce que le système doit satisfaire, avec identifiant et texte | Que doit-il respecter ? |
| **Définition de blocs** (bdd) | Les constituants et leur hiérarchie | De quoi est-il fait ? |
| **Blocs internes** (ibd) | Les flux (matière, énergie, information) entre constituants | Comment les parties sont-elles reliées ? |
| **États** (stm) | Les états successifs et les transitions | Comment réagit-il dans le temps ? |
| **Séquence** (sd) | Les messages échangés, dans l’ordre | Qui dialogue avec qui ? |

> Les diagrammes uc et req décrivent le **besoin** ; bdd et ibd la **structure** ; stm et sd le **comportement**.

## Une exigence bien écrite
Une exigence porte un **identifiant** et un **texte** vérifiable, souvent avec un niveau chiffré. Exemple :
| Id | Texte |
| 1.2 | Le portail doit s’ouvrir complètement en moins de 20 s |
| 1.3 | Le portail doit s’arrêter si un obstacle est détecté |

« Le portail doit être rapide » n’est pas une exigence : on ne peut pas la vérifier.

## Exemple : un portail automatique
- **Acteurs** : l’usager (télécommande), le piéton, le mainteneur.
- **Cas d’utilisation** : ouvrir le portail, fermer le portail, détecter un obstacle.
- **bdd** : portail = moteur + réducteur + vantaux + carte de commande + cellules photoélectriques + télécommande.
- **ibd** : énergie électrique (secteur → carte → moteur), énergie mécanique (moteur → réducteur → vantail), information (cellule → carte).
- **stm** : Fermé → Ouverture → Ouvert → Fermeture → Fermé, et Fermeture → Ouverture si obstacle.`,
          },
          questions: [
            ['Qu’est-ce qui délimite un système de son environnement ?', ['Son prix', 'Son diagramme de Gantt', 'Sa masse', 'Sa frontière'], 3, 'Ce qui est dehors constitue l’environnement du système.'],
            ['Quel diagramme SysML décrit les services rendus aux acteurs ?', ['Le diagramme de définition de blocs', 'Le diagramme de blocs internes', 'Le diagramme de cas d’utilisation', 'Le diagramme d’états'], 2, 'Il répond à la question « à quoi sert le système ? ».'],
            ['Quel diagramme montre les flux entre les constituants ?', ['uc', 'ibd', 'req', 'bdd'], 1, 'Le diagramme de blocs internes montre matière, énergie et information qui circulent.'],
            ['Quel diagramme donne la hiérarchie des constituants ?', ['Le diagramme de définition de blocs', 'Le diagramme de séquence', 'Le diagramme d’exigences', 'Le diagramme d’états'], 0, 'Il répond à « de quoi est fait le système ? ».'],
            ['« Le portail doit être rapide » est une exigence correcte.', ['Vrai', 'Faux'], 1, 'Elle n’est pas vérifiable : il manque un niveau chiffré.'],
            ['Dans le cycle en V, que fait la branche montante ?', ['Elle rédige le besoin', 'Elle définit le système', 'Elle vérifie et valide le système', 'Elle fixe le prix'], 2, 'Chaque étape montante répond à une étape descendante.'],
            ['Par rapport à quoi valide-t-on le produit final ?', ['Par rapport au besoin initial', 'Par rapport au prix de vente', 'Par rapport au planning', 'Par rapport au prototype'], 0, 'La validation répond à l’analyse du besoin.'],
            ['Quel diagramme décrit les états successifs d’un système et ses transitions ?', ['Le diagramme de cas d’utilisation', 'Le diagramme de blocs internes', 'Le diagramme d’exigences', 'Le diagramme d’états (stm)'], 3, 'Fermé, ouverture, ouvert, fermeture : ce sont des états.'],
            ['Qui fait partie des parties prenantes d’un portail automatique ?', ['Seulement l’acheteur', 'L’usager, le piéton, le mainteneur, la réglementation', 'Seulement le fabricant du moteur', 'Personne'], 1, 'Toutes les personnes et règles concernées par le système.'],
            ['Les diagrammes stm et séquence décrivent…', ['la structure', 'le comportement', 'le coût', 'le besoin'], 1, 'uc et req : besoin ; bdd et ibd : structure ; stm et sd : comportement.'],
            ['Que doit porter une exigence dans un diagramme req ?', ['Une couleur', 'Un prix', 'Une photo', 'Un identifiant et un texte vérifiable'], 3, 'L’identifiant permet de la suivre jusqu’à la validation.'],
            ['La conception d’un système suit toujours un ordre strictement séquentiel, sans retour.', ['Vrai', 'Faux'], 1, 'On fait des allers-retours entre les étapes du cycle en V.'],
          ],
        },
        // ---- 3 ---------------------------------------------------------------
        {
          titre: 'Flux de matière, d’énergie et d’information',
          axe: 'Approche fonctionnelle et structurelle des produits',
          lecon: {
            titre: 'Suivre ce qui circule et ce qui s’accumule',
            cours: `Analyser un produit, c’est d’abord repérer ce qui **circule** (les flux) et ce qui **s’accumule** (les stocks), dans les trois champs matière, énergie, information.

## Flux et stock
| La notion | Définition | Exemple (chauffe-eau solaire) |
| **Flux** | Un déplacement, un transfert, mesuré par unité de temps | L’eau qui circule, la chaleur transmise |
| **Stock** | Une accumulation, mesurée à un instant | L’eau chaude dans le ballon, l’énergie dans une batterie |

> Un stock varie selon la différence entre les flux qui entrent et ceux qui sortent.

## Caractériser un flux
| Le flux | La grandeur | L’unité |
| Matière (fluide) | Débit volumique | m³/s ou L/min |
| Matière | Débit massique | kg/s |
| Énergie électrique | Puissance, intensité | W, A |
| Énergie thermique | Flux thermique | W |
| Lumière | Flux lumineux | lumen (lm) |
| Information | Débit binaire | bit/s |

Une puissance est un **flux d’énergie** : 1 W = 1 J par seconde.

## Le diagramme de Sankey
Il représente les flux par des **flèches dont la largeur est proportionnelle à la quantité**. On voit d’un coup d’œil où part l’énergie, et surtout où elle se **perd**.

## Exemple travaillé : une trottinette électrique
La batterie fournit 500 W. Le variateur (rendement 0,95) en transmet 475 W au moteur ; le moteur (rendement 0,80) fournit 380 W mécaniques à la roue.
| Étape | Entrée | Sortie utile | Pertes |
| Variateur | 500 W | 475 W | 25 W |
| Moteur | 475 W | 380 W | 95 W |
Rendement global : 380 / 500 = **0,76**. Dans un diagramme de Sankey, la flèche passe de 500 à 475 puis à 380, et deux flèches de pertes (25 W et 95 W) partent vers le bas. On voit immédiatement que **le moteur** est l’étage à améliorer.

## Bilan de flux
On peut aussi faire le bilan d’un produit entier : énergie reçue, énergie utile, pertes ; matière entrante (eau, air, carburant) et sortante (rejets). Une règle ne change jamais :
= Énergie entrante = énergie utile + pertes

## Flux dans un diagramme ibd
Dans un diagramme de blocs internes SysML, chaque flux est porté par un connecteur entre deux blocs, avec sa nature : « énergie électrique », « eau froide », « consigne de température ». En première, tu dois savoir **lire** ces diagrammes et les **modifier** partiellement.`,
          },
          questions: [
            ['Qu’est-ce qu’un stock ?', ['Une accumulation mesurée à un instant', 'Une perte d’énergie', 'Un capteur', 'Un déplacement par unité de temps'], 0, 'L’énergie d’une batterie ou l’eau d’un ballon sont des stocks.'],
            ['Dans quelle unité mesure-t-on un débit volumique ?', ['lm', 'kg', 'm³/s', 'W'], 2, 'On utilise aussi le L/min.'],
            ['Une puissance est un flux…', ['d’information', 'de lumière uniquement', 'de matière', 'd’énergie'], 3, '1 W = 1 J transféré par seconde.'],
            ['Que représente la largeur d’une flèche dans un diagramme de Sankey ?', ['La durée', 'La vitesse du flux', 'La quantité transportée', 'La couleur du matériau'], 2, 'Elle est proportionnelle à la quantité, ce qui montre où l’énergie se perd.'],
            ['Un variateur reçoit 500 W avec un rendement de 0,95. Quelle puissance transmet-il ?', ['450 W', '475 W', '495 W', '525 W'], 1, '500 × 0,95 = 475 W.'],
            ['Le moteur reçoit 475 W et en fournit 380 W. Quelles sont ses pertes ?', ['95 W', '80 W', '25 W', '120 W'], 0, '475 − 380 = 95 W.'],
            ['Quel est le rendement global de la trottinette (380 W utiles pour 500 W) ?', ['0,95', '0,80', '0,76', '0,50'], 2, '380 / 500 = 0,76.'],
            ['En quelle unité mesure-t-on un flux lumineux ?', ['Le lux', 'Le lumen', 'Le watt', 'Le candela par mètre'], 1, 'Le lumen mesure la quantité de lumière émise.'],
            ['L’énergie entrante est égale à l’énergie utile plus les pertes.', ['Vrai', 'Faux'], 0, 'C’est la conservation de l’énergie appliquée à un produit.'],
            ['Un débit binaire se mesure en…', ['bit/s', 'W', 'kg/s', 'm/s'], 0, 'C’est le flux d’information.'],
            ['Sur une trottinette électrique, le variateur perd 25 W et le moteur 95 W. Quel étage faut-il améliorer en priorité ?', ['Aucun', 'Le variateur', 'Le moteur', 'La batterie'], 2, 'Il concentre 95 W de pertes contre 25 W pour le variateur.', 'Dans l’exemple, quel étage faut-il améliorer en priorité ?'],
            ['Si un ballon reçoit plus d’eau chaude qu’il n’en sort, son stock…', ['augmente', 'devient nul', 'diminue', 'reste constant'], 0, 'Un stock varie selon la différence entre entrées et sorties.'],
          ],
        },
        // ---- 4 ---------------------------------------------------------------
        {
          titre: 'La chaîne de puissance',
          axe: 'Approche fonctionnelle et structurelle des produits',
          lecon: {
            titre: 'De la source d’énergie à l’action',
            cours: `La **chaîne de puissance** (ou chaîne d’énergie) regroupe tout ce qui, dans un produit, transporte et transforme l’énergie jusqu’à l’**action** sur la matière d’œuvre : déplacer, chauffer, éclairer.

## Les fonctions de la chaîne de puissance
~ Alimenter / stocker → Distribuer / moduler → Convertir → Adapter / transmettre → Agir
| La fonction | Rôle | Exemples de composants |
| **Capter, alimenter, stocker** | Fournir l’énergie | Réseau, batterie, panneau solaire, réservoir |
| **Distribuer, moduler** | Doser l’énergie envoyée selon les ordres | Relais, variateur, hacheur, distributeur pneumatique |
| **Convertir** | Changer la nature de l’énergie | Moteur, vérin, résistance chauffante, LED |
| **Adapter, transmettre** | Modifier vitesse, effort ou forme du mouvement | Réducteur, poulies-courroie, pignon-crémaillère |

> La chaîne de puissance **obéit** : ce sont les ordres de la chaîne d’information qui pilotent la fonction « distribuer ».

## Les types de conversion
| Conversion | Convertisseur | Réversible ? |
| Électrique → mécanique | Moteur | Oui : il devient génératrice (freinage récupératif) |
| Chimique → électrique | Pile, batterie | Batterie : oui (recharge) |
| Électrique → thermique | Résistance chauffante | Non |
| Électrique → lumineuse | LED, lampe | Non en pratique |
| Lumineuse → électrique | Cellule photovoltaïque | Non |
| Thermique → mécanique | Moteur thermique | Non |

## Moduler l’énergie électrique
| Le type | Du → vers | Exemple |
| AC/DC (redresseur) | Alternatif → continu | Chargeur de téléphone |
| DC/AC (onduleur) | Continu → alternatif | Panneaux solaires vers réseau |
| DC/DC (hacheur) | Continu → continu réglable | Variateur de trottinette |
| AC/AC (gradateur, convertisseur de fréquence) | Alternatif → alternatif réglable | Variateur de lampe |
La modulation peut être **tout ou rien** (TOR : marche ou arrêt, par un relais) ou **progressive** (vitesse réglable, par un variateur).

## Stocker l’énergie
| La forme | Exemple |
| Chimique | Batterie, carburant, hydrogène |
| Électrique | Condensateur, supercondensateur |
| Mécanique | Ressort, volant d’inertie, barrage (énergie potentielle) |
| Thermique | Ballon d’eau chaude, matériau à changement de phase |

## Exemple travaillé : un volet roulant
~ Réseau 230 V → Relais (monter / descendre) → Moteur asynchrone → Réducteur → Tube d’enroulement → Tablier
Ici la modulation est **TOR** : le moteur tourne à vitesse fixe, dans un sens ou dans l’autre. Le réducteur **adapte** : il diminue la vitesse et augmente le couple pour soulever le tablier.`,
          },
          questions: [
            ['Quelle fonction de la chaîne de puissance change la nature de l’énergie ?', ['Transmettre', 'Stocker', 'Distribuer', 'Convertir'], 3, 'Un moteur convertit l’énergie électrique en énergie mécanique.'],
            ['Quel composant réalise la fonction « distribuer » ?', ['Un réducteur', 'Un relais ou un variateur', 'Une batterie', 'Une poulie'], 1, 'Il dose l’énergie selon les ordres reçus.'],
            ['Qui pilote la fonction « distribuer » ?', ['L’utilisateur directement, toujours', 'La chaîne d’information', 'Le réducteur', 'La batterie'], 1, 'La chaîne de puissance obéit aux ordres de la chaîne d’information.'],
            ['Un chargeur de téléphone réalise une conversion…', ['DC/DC', 'AC/AC', 'DC/AC', 'AC/DC'], 3, 'Il redresse l’alternatif du secteur en continu.'],
            ['Quel convertisseur injecte l’énergie de panneaux solaires sur le réseau alternatif ?', ['Un onduleur', 'Un hacheur', 'Un réducteur', 'Un redresseur'], 0, 'L’onduleur convertit le continu en alternatif.'],
            ['Un moteur électrique peut fonctionner en génératrice lors d’un freinage.', ['Vrai', 'Faux'], 0, 'C’est le freinage récupératif des véhicules électriques.'],
            ['Quel est le rôle d’un réducteur ?', ['Mesurer la vitesse', 'Stocker l’énergie', 'Diminuer la vitesse et augmenter le couple', 'Convertir en chaleur'], 2, 'Il adapte l’énergie mécanique au besoin de l’action.'],
            ['Un volant d’inertie stocke l’énergie sous forme…', ['thermique', 'chimique', 'électrique', 'mécanique'], 3, 'L’énergie est stockée sous forme cinétique de rotation.'],
            ['Une modulation « tout ou rien » permet…', ['de convertir en chaleur', 'de régler finement la vitesse', 'seulement la marche ou l’arrêt', 'de stocker l’énergie'], 2, 'Un variateur permet au contraire une modulation progressive.'],
            ['Quel type de convertisseur est le variateur d’une trottinette alimentée par batterie ?', ['AC/DC', 'DC/DC (hacheur)', 'DC/AC', 'AC/AC'], 1, 'Il règle une tension continue à partir de la batterie.'],
            ['Un supercondensateur stocke l’énergie sous forme électrique.', ['Vrai', 'Faux'], 0, 'Il la stocke dans un champ électrique, sans réaction chimique.'],
            ['Dans le volet roulant, quel composant adapte l’énergie mécanique ?', ['Le réducteur', 'Le tablier', 'Le relais', 'Le réseau'], 0, 'Il réduit la vitesse du moteur pour soulever le tablier.'],
          ],
        },
        // ---- 5 ---------------------------------------------------------------
        {
          titre: 'Liaisons et schéma cinématique',
          axe: 'Approche fonctionnelle et structurelle des produits',
          lecon: {
            titre: 'Modéliser comment les pièces bougent les unes par rapport aux autres',
            cours: `Pour comprendre un mécanisme, on ne dessine pas chaque vis : on regroupe les pièces qui bougent ensemble et on modélise leurs **liaisons**. Le résultat est le **schéma cinématique**.

## Les degrés de liberté
Un solide libre dans l’espace possède **6 degrés de liberté** : 3 **translations** (selon x, y, z) et 3 **rotations** (autour de x, y, z). Une liaison **supprime** certains de ces mouvements.

## Les liaisons usuelles
| La liaison | Mouvements possibles | Exemple |
| **Encastrement** (liaison complète) | Aucun | Roue vissée sur un moyeu |
| **Pivot** | 1 rotation | Roue de vélo sur son axe, charnière |
| **Glissière** | 1 translation | Tiroir, chariot sur rail |
| **Hélicoïdale** | 1 rotation et 1 translation liées | Vis et écrou |
| **Pivot glissant** | 1 rotation et 1 translation indépendantes | Tige de vérin dans son corps |
| **Rotule** (sphérique) | 3 rotations | Rotule de direction, joystick |
| **Appui plan** | 2 translations et 1 rotation | Objet posé sur une table |
| **Linéaire rectiligne, linéaire annulaire, ponctuelle** | Liaisons à contact linéique ou ponctuel, plus de mobilités | Galet sur un plan |

> Une liaison est dite **parfaite** si l’on néglige jeux et frottements : c’est l’hypothèse du schéma cinématique.

## La démarche en quatre étapes
1. **Classes d’équivalence** : regrouper les pièces sans mouvement relatif entre elles (vissées, collées, soudées). Chaque classe est un seul « solide ».
2. **Graphe des liaisons** : chaque classe est un cercle, chaque liaison un trait qui relie deux cercles, avec son nom.
3. **Identifier chaque liaison** : regarder quels mouvements relatifs sont possibles, et quelles surfaces sont en contact (cylindre → pivot ou pivot glissant, plan → appui plan, sphère → rotule).
4. **Schéma cinématique** : dessiner chaque liaison avec son symbole normalisé, en respectant la disposition réelle. Le schéma **minimal** ne garde qu’une liaison équivalente entre deux classes.

## Exemple travaillé : un étau
Pièces : mors fixe + corps (vissés ensemble), mors mobile, vis de manœuvre, écrou (fixé au mors mobile).
- Classe 1 : corps + mors fixe.
- Classe 2 : mors mobile + écrou.
- Classe 3 : vis + poignée.
Liaisons :
| Entre | Liaison | Pourquoi |
| 1 et 2 | Glissière | Le mors mobile coulisse sur le corps sans tourner |
| 1 et 3 | Pivot | La vis tourne dans le corps sans avancer |
| 3 et 2 | Hélicoïdale | La rotation de la vis fait avancer l’écrou |
Trois classes, trois liaisons : le graphe est une boucle. Tourner la poignée (rotation) fait translater le mors mobile.

## Pourquoi ce travail ?
Le schéma cinématique permet de **comprendre** la transformation de mouvement, puis de **calculer** vitesses et efforts, et de **simuler** le mécanisme.`,
          },
          questions: [
            ['Combien de degrés de liberté possède un solide libre dans l’espace ?', ['3', '4', '6', '12'], 2, '3 translations et 3 rotations.'],
            ['Quelle liaison n’autorise qu’une rotation ?', ['Appui plan', 'Glissière', 'Pivot', 'Rotule'], 2, 'Une charnière de porte est une liaison pivot.'],
            ['Quelle liaison n’autorise qu’une translation ?', ['Glissière', 'Encastrement', 'Hélicoïdale', 'Pivot'], 0, 'Un tiroir coulisse sans tourner.'],
            ['La liaison vis-écrou est une liaison…', ['appui plan', 'pivot', 'rotule', 'hélicoïdale'], 3, 'La rotation et la translation y sont liées par le pas.'],
            ['Combien de rotations autorise une rotule ?', ['2', '3', 'Aucune', '1'], 1, 'Elle bloque les trois translations.'],
            ['Qu’est-ce qu’une classe d’équivalence cinématique ?', ['Un ensemble de vis', 'Un groupe de pièces sans mouvement relatif entre elles', 'Une liste de pièces achetées', 'Un type de matériau'], 1, 'Chaque classe est considérée comme un seul solide.'],
            ['Une liaison parfaite néglige…', ['la couleur', 'les mouvements', 'la masse', 'les jeux et les frottements'], 3, 'C’est l’hypothèse de base du schéma cinématique.'],
            ['Dans l’étau, quelle liaison relie le corps et le mors mobile ?', ['Glissière', 'Rotule', 'Pivot', 'Hélicoïdale'], 0, 'Le mors mobile coulisse sans tourner.'],
            ['Dans l’étau, quelle liaison relie la vis et le corps ?', ['Encastrement', 'Appui plan', 'Pivot', 'Glissière'], 2, 'La vis tourne dans le corps sans avancer.'],
            ['La tige d’un vérin dans son corps peut tourner et coulisser indépendamment : liaison…', ['encastrement', 'glissière', 'pivot', 'pivot glissant'], 3, 'Rotation et translation y sont indépendantes.'],
            ['Un encastrement autorise un seul mouvement.', ['Vrai', 'Faux'], 1, 'Il n’en autorise aucun : c’est une liaison complète.'],
            ['Dans un graphe des liaisons, que représente un trait entre deux cercles ?', ['Un flux d’énergie', 'Une pièce', 'Une liaison entre deux classes', 'Un effort'], 2, 'Chaque cercle est une classe d’équivalence.'],
          ],
        },
        // ---- 6 ---------------------------------------------------------------
        {
          titre: 'La chaîne d’information',
          axe: 'Approche fonctionnelle et structurelle des produits',
          lecon: {
            titre: 'Acquérir, traiter, communiquer',
            cours: `La **chaîne d’information** est le « cerveau » d’un produit : elle recueille des informations sur le produit et son environnement, décide, puis envoie des **ordres** à la chaîne de puissance et des **messages** à l’utilisateur.

## Les trois fonctions
~ Acquérir → Traiter → Communiquer
| La fonction | Rôle | Composants |
| **Acquérir** | Prélever une information (grandeur physique, état, consigne) | Capteurs, boutons, IHM, écran tactile |
| **Traiter** | Calculer, comparer, décider | Microcontrôleur, automate, ordinateur |
| **Communiquer** | Transmettre des ordres ou des messages | Sorties vers la chaîne de puissance, écran, voyant, liaison réseau |

## Le capteur et ses caractéristiques
Un **capteur** transforme une grandeur physique (température, distance, lumière) en un **signal** électrique exploitable.
| La caractéristique | Définition |
| **Étendue de mesure** | Plage de valeurs mesurables (de −40 à 125 °C) |
| **Sensibilité** | Variation du signal pour une variation de la grandeur (10 mV/°C) |
| **Résolution** | Plus petite variation détectable |
| **Précision** | Écart possible entre la mesure et la vraie valeur |
| **Linéarité** | Le signal est-il proportionnel à la grandeur ? |
Un **détecteur** (ou capteur TOR) donne seulement une information binaire : présent / absent.

## Conditionner le signal
Le signal brut est souvent faible ou bruité. On le **conditionne** : on l’**amplifie** et on le **filtre**. Un **filtre passe-bas** du premier ordre laisse passer les variations lentes (la vraie mesure) et atténue les variations rapides (le bruit parasite).

## Convertir en numérique : le CAN
Un microcontrôleur ne traite que des nombres. Le **convertisseur analogique-numérique** (CAN) transforme une tension en un nombre entier.
= Nombre de valeurs = 2 puissance n (n : nombre de bits)
= Quantum q = pleine échelle / 2 puissance n
Le **quantum** est la plus petite variation de tension que le CAN distingue : c’est sa **résolution**.

## Exemple travaillé
Un capteur de température délivre 10 mV/°C, relié à un CAN 10 bits de pleine échelle 5 V.
- Nombre de valeurs : 2 puissance 10 = **1 024**.
- Quantum : 5 / 1 024 ≈ **4,9 mV**.
- Résolution en température : 4,9 mV ÷ 10 mV/°C ≈ **0,5 °C**.
- À 25 °C, le capteur donne 250 mV, soit le nombre 250 / 4,9 ≈ **51**.
Pour distinguer 0,1 °C, il faudrait un CAN de plus de bits ou amplifier le signal.

> Plus le CAN a de bits, plus il est fin : chaque bit ajouté divise le quantum par deux.

## Exemple de chaîne complète : un thermostat
Capteur de température → CAN → microcontrôleur qui compare à la consigne → ordre « chauffer » vers le relais de la chaîne de puissance, et affichage de la température sur l’écran.`,
          },
          questions: [
            ['Quelles sont les trois fonctions de la chaîne d’information ?', ['Alimenter, convertir, transmettre', 'Acquérir, traiter, communiquer', 'Mesurer, stocker, chauffer', 'Moduler, adapter, agir'], 1, 'Elle recueille, décide, puis transmet ordres et messages.'],
            ['Quel composant réalise la fonction « traiter » ?', ['Un microcontrôleur', 'Un moteur', 'Un réducteur', 'Un capteur'], 0, 'Il calcule, compare et décide.'],
            ['Qu’est-ce que la sensibilité d’un capteur ?', ['Sa taille', 'Sa plage de mesure', 'La variation du signal pour une variation de la grandeur', 'Son prix'], 2, 'Par exemple 10 mV par degré Celsius.'],
            ['Un détecteur de présence fournit une information…', ['binaire (tout ou rien)', 'sonore', 'mécanique', 'analogique'], 0, 'Présent ou absent : deux états seulement.'],
            ['À quoi sert un filtre passe-bas dans une chaîne d’acquisition ?', ['À convertir en numérique', 'À alimenter le capteur', 'À amplifier le bruit', 'À atténuer les variations rapides parasites'], 3, 'Il garde la mesure lente et enlève le bruit.'],
            ['Combien de valeurs différentes donne un CAN 10 bits ?', ['10', '100', '512', '1 024'], 3, '2 puissance 10 = 1 024.'],
            ['Quel est le quantum d’un CAN 10 bits de pleine échelle 5 V ?', ['5 mV environ', '50 mV', '0,5 mV', '10 mV'], 0, '5 / 1 024 ≈ 4,9 mV.'],
            ['Avec 10 mV/°C, quelle tension le capteur donne-t-il à 25 °C ?', ['25 mV', '250 mV', '2,5 V', '25 V'], 1, '25 × 10 mV = 250 mV.'],
            ['Ajouter un bit à un CAN divise son quantum par deux.', ['Vrai', 'Faux'], 0, 'Le nombre de valeurs double, donc chaque pas est deux fois plus petit.'],
            ['Quelle caractéristique donne la plage des valeurs mesurables ?', ['La résolution', 'L’étendue de mesure', 'La linéarité', 'La sensibilité'], 1, 'Par exemple de −40 à 125 °C.'],
            ['Dans un thermostat, vers quoi part l’ordre « chauffer » ?', ['Vers le capteur', 'Vers la chaîne de puissance (relais)', 'Vers le CAN', 'Vers la consigne'], 1, 'La chaîne d’information commande la chaîne de puissance.'],
            ['Un microcontrôleur traite directement une tension analogique sans conversion.', ['Vrai', 'Faux'], 1, 'Il faut un CAN pour transformer la tension en nombre.'],
          ],
        },
        // ---- 7 ---------------------------------------------------------------
        {
          titre: 'Codage de l’information et algorithmique',
          axe: 'Approche fonctionnelle et structurelle des produits',
          lecon: {
            titre: 'Des bits aux programmes',
            cours: `Dans un produit numérique, toute information — une mesure, un texte, une image — est codée en **binaire**, puis traitée par un **programme**.

## Les bases de numération
| La base | Chiffres | Usage |
| **Décimale** (base 10) | 0 à 9 | Le calcul humain |
| **Binaire** (base 2) | 0 et 1 | Les circuits : un bit = 0 ou 1 |
| **Hexadécimale** (base 16) | 0 à 9 puis A à F | Écrire le binaire de façon compacte |
Un **octet** = 8 bits, soit 256 valeurs (0 à 255).

## Convertir
**Binaire → décimal** : on additionne les puissances de 2 des bits à 1.
1011 (base 2) = 8 + 0 + 2 + 1 = **11**.
**Décimal → binaire** : on divise par 2 successivement et on lit les restes de bas en haut.
13 → 13 = 2 × 6 + 1 ; 6 = 2 × 3 + 0 ; 3 = 2 × 1 + 1 ; 1 = 2 × 0 + 1 → **1101**.
**Binaire → hexadécimal** : on groupe par 4 bits. 1010 1111 → A F → **AF**, soit 175 en décimal.

## Coder un caractère : l’ASCII
Le code **ASCII** associe un nombre à chaque caractère : « A » = 65, « a » = 97, « 0 » = 48. Il tient sur 7 bits. Les codages modernes (Unicode, UTF-8) étendent ce principe aux accents et à toutes les écritures.

## Les limites de la taille des données
Un entier codé sur 8 bits ne dépasse pas 255 : 255 + 1 donne 0 (**dépassement**). Choisir la bonne taille de variable est un vrai choix de conception : trop petite, elle déborde ; trop grande, elle occupe de la mémoire et du temps.

## Les structures d’un algorithme
| La structure | Rôle | Exemple |
| **Séquence** | Instructions l’une après l’autre | Lire, calculer, afficher |
| **Condition** (si… alors… sinon) | Choisir selon un test | Si température < 19 alors chauffer |
| **Boucle** (tant que, pour) | Répéter | Tant que le bouton est appuyé, allumer |
| **Sous-programme** (fonction) | Regrouper un traitement réutilisable | lire_temperature() |
Une **variable** a un nom, un **type** (entier, réel, booléen, chaîne) et une taille.

## Exemple : l’éclairage automatique
\`\`\`
tant que vrai :
    lum ← lire_luminosite()
    si lum < 300 et presence = vrai alors allumer()
    sinon eteindre()
    attendre(0,5 s)
\`\`\`
La boucle infinie est typique d’un système embarqué : il surveille en permanence.

## Compresser
Compresser, c’est réduire la taille d’un fichier.
= Taux de compression = taille compressée / taille initiale
Un fichier de 10 Mo compressé en 2 Mo a un taux de **0,2** (20 %). Une compression **sans perte** (zip) restitue tout ; une compression **avec perte** (jpeg, mp3) supprime des détails peu perceptibles.`,
          },
          questions: [
            ['Combien vaut 1011 (base 2) en décimal ?', ['9', '10', '11', '13'], 2, '8 + 0 + 2 + 1 = 11.'],
            ['Comment s’écrit 13 en binaire ?', ['1011', '1101', '1110', '1001'], 1, '8 + 4 + 0 + 1 = 13.'],
            ['Combien de valeurs peut prendre un octet ?', ['8', '128', '256', '1 024'], 2, '2 puissance 8 = 256, de 0 à 255.'],
            ['Combien vaut AF (base 16) en décimal ?', ['165', '175', '160', '185'], 1, 'A = 10, F = 15 : 10 × 16 + 15 = 175.'],
            ['Pourquoi utilise-t-on l’hexadécimal ?', ['Pour coder les couleurs uniquement', 'Pour compresser les fichiers', 'Parce que les circuits l’utilisent directement', 'Pour écrire le binaire de façon compacte'], 3, 'Un chiffre hexadécimal remplace 4 bits.'],
            ['Quel est le code ASCII de la lettre « A » majuscule ?', ['48', '65', '97', '100'], 1, '« a » vaut 97 et « 0 » vaut 48.'],
            ['Sur un entier 8 bits non signé, que donne 255 + 1 ?', ['0 (dépassement)', '255', 'Une erreur de compilation', '256'], 0, 'La valeur ne tient plus sur 8 bits et revient à 0.'],
            ['Quelle structure permet de répéter des instructions ?', ['La variable', 'La condition', 'La boucle', 'La séquence'], 2, 'Tant que, ou pour.'],
            ['« Si température < 19 alors chauffer » est une…', ['variable', 'boucle', 'séquence', 'structure conditionnelle'], 3, 'Elle choisit une action selon un test.'],
            ['Un fichier de 10 Mo compressé en 2 Mo a un taux de compression de…', ['0,2', '5', '0,5', '2'], 0, 'Taux de compression = taille compressée ÷ taille initiale = 2 ÷ 10 = 0,2 : le fichier ne pèse plus que 20 % de sa taille.'],
            ['Une compression jpeg restitue exactement l’image d’origine.', ['Vrai', 'Faux'], 1, 'C’est une compression avec perte.'],
            ['Qu’apporte un sous-programme (fonction) ?', ['Il remplace les boucles', 'Il ralentit le programme', 'Il regroupe un traitement réutilisable', 'Il supprime les variables'], 2, 'On l’appelle autant de fois que nécessaire.'],
          ],
        },
        // ---- 8 ---------------------------------------------------------------
        {
          titre: 'Réseaux et transmission de l’information',
          axe: 'Approche fonctionnelle et structurelle des produits',
          lecon: {
            titre: 'Faire communiquer les objets',
            cours: `Les produits d’aujourd’hui communiquent : un thermostat parle à une application, une borne de recharge à un serveur. Comprendre les **réseaux**, c’est comprendre comment l’information voyage.

## Les types de liaison
| La liaison | Support | Exemples |
| **Filaire** | Cuivre, fibre optique | Câble Ethernet, USB, fibre |
| **Sans fil** | Ondes radio, infrarouge | Wi-Fi, Bluetooth, LoRa, 4G/5G |
Une liaison **point à point** relie deux équipements ; un **réseau** en relie plusieurs.

## Les topologies
| La topologie | Principe | Défaut |
| **Étoile** | Tous reliés à un équipement central (commutateur) | Si le centre tombe, tout tombe |
| **Bus** | Tous sur un même câble | Collisions, une coupure isole une partie |
| **Anneau** | Chaque équipement relié à deux voisins | Une coupure peut bloquer l’anneau |
La plupart des réseaux locaux sont aujourd’hui en **étoile**.

## Le modèle OSI
Il découpe la communication en **7 couches**, chacune avec son rôle :
| N° | Couche | Rôle |
| 7 | Application | Service rendu à l’utilisateur (web, messagerie) |
| 6 | Présentation | Format des données (codage, chiffrement) |
| 5 | Session | Ouverture et fermeture du dialogue |
| 4 | Transport | Découpage en segments, fiabilité (TCP, UDP) |
| 3 | Réseau | Acheminement entre réseaux, adresse IP |
| 2 | Liaison | Transmission entre voisins, adresse MAC |
| 1 | Physique | Bits sur le support (tensions, ondes, lumière) |

## L’encapsulation
À l’envoi, chaque couche **ajoute son en-tête** aux données reçues de la couche du dessus : comme une lettre glissée dans une enveloppe, elle-même dans un colis. À la réception, chaque couche retire l’en-tête qui la concerne.

## Les adresses
| L’adresse | Couche | Forme | Caractère |
| **MAC** (physique) | 2 | 6 octets en hexadécimal : 3C:52:82:1A:0F:7B | Gravée dans la carte réseau |
| **IP** (logique) v4 | 3 | 4 octets en décimal : 192.168.1.20 | Attribuée selon le réseau |
Avec le **masque** 255.255.255.0, les trois premiers octets désignent le **réseau** (192.168.1) et le dernier la **machine** (20). Deux machines communiquent directement si elles sont dans le même réseau ; sinon, un **routeur** fait le lien.

## Le modèle client-serveur
Un **client** envoie une requête ; un **serveur** répond. Quelques serveurs clés :
| Le serveur | Son rôle |
| **Web** (HTTP) | Envoie les pages demandées |
| **DHCP** | Attribue automatiquement une adresse IP aux machines |
| **DNS** | Traduit un nom (www.exemple.fr) en adresse IP |

## Exemple
Ta montre connectée (client) envoie ta fréquence cardiaque par Bluetooth au téléphone, qui la transmet par Wi-Fi puis Internet au serveur de l’application. Le téléphone a obtenu son adresse IP par DHCP, et il a trouvé le serveur grâce au DNS.`,
          },
          questions: [
            ['Combien de couches compte le modèle OSI ?', ['4', '5', '7', '10'], 2, 'De la couche physique à la couche application.'],
            ['Quelle couche OSI utilise l’adresse IP ?', ['Liaison', 'Réseau', 'Application', 'Physique'], 1, 'La couche 3 achemine les données entre réseaux.'],
            ['L’adresse MAC est liée à quelle couche ?', ['Couche 2', 'Couche 4', 'Couche 7', 'Couche 1'], 0, 'Elle identifie la carte réseau sur la liaison.'],
            ['Combien d’octets compte une adresse IPv4 ?', ['2', '4', '6', '8'], 1, 'Par exemple 192.168.1.20.'],
            ['Avec le masque 255.255.255.0, quelle partie de 192.168.1.20 désigne le réseau ?', ['192', '192.168', '192.168.1', '20'], 2, 'Les trois premiers octets désignent le réseau, le dernier la machine.'],
            ['Quel serveur attribue automatiquement une adresse IP ?', ['Mail', 'DNS', 'DHCP', 'Web'], 2, 'Dynamic Host Configuration Protocol.'],
            ['Quel serveur traduit un nom de domaine en adresse IP ?', ['DNS', 'HTTP', 'MAC', 'DHCP'], 0, 'Domain Name System.'],
            ['Dans une topologie en étoile, que se passe-t-il si l’équipement central tombe en panne ?', ['Seule une machine est coupée', 'Le réseau devient un anneau', 'Rien', 'Tout le réseau est coupé'], 3, 'Tout passe par le centre.'],
            ['Qu’est-ce que l’encapsulation ?', ['Chiffrer un mot de passe', 'Chaque couche ajoute son en-tête aux données', 'Compresser un fichier', 'Brancher un câble'], 1, 'Comme une lettre glissée dans une enveloppe, puis dans un colis.'],
            ['Le Wi-Fi est une liaison filaire.', ['Vrai', 'Faux'], 1, 'Il utilise des ondes radio.'],
            ['Quel équipement relie deux réseaux IP différents ?', ['Un commutateur', 'Un routeur', 'Un capteur', 'Un CAN'], 1, 'Il achemine les paquets d’un réseau à l’autre.'],
            ['Dans le modèle client-serveur, qui envoie la requête ?', ['Le routeur', 'Le DNS toujours', 'Le serveur', 'Le client'], 3, 'Le serveur répond aux requêtes des clients.'],
          ],
        },
        // ---- 9 ---------------------------------------------------------------
        {
          titre: 'Modéliser et simuler un produit',
          axe: 'Approche comportementale des produits',
          lecon: {
            titre: 'Prévoir le comportement avant de fabriquer',
            cours: `Les produits sont trop complexes pour être mis au point par essais successifs sur le réel. On construit un **modèle**, on le **simule**, puis on compare au réel.

## Les types de modèles
| Le modèle | Ce qu’il représente | Outil typique |
| **Volumique** | Formes, masses, interférences | Logiciel de CAO |
| **Multiphysique** | Composants reliés par leurs grandeurs physiques (électrique, mécanique, thermique) | Logiciel de modélisation acausale |
| **Fonctionnel** (schéma-bloc) | Des blocs reliés par des signaux | Schéma-bloc |
| **Comportemental** | États, activités, logique | Diagramme d’états |
| **De régression** | Une loi tirée de mesures | Tableur |

## Grandeurs flux et grandeurs effort
Dans un modèle multiphysique, chaque domaine a une grandeur « effort » et une grandeur « flux », dont le **produit est une puissance**.
| Le domaine | Effort | Flux | Puissance |
| Électrique | Tension U (V) | Intensité I (A) | P = U × I |
| Mécanique en translation | Force F (N) | Vitesse v (m/s) | P = F × v |
| Mécanique en rotation | Couple C (N·m) | Vitesse angulaire ω (rad/s) | P = C × ω |
| Hydraulique | Pression p (Pa) | Débit Qv (m³/s) | P = p × Qv |

!> Ne confonds pas un **flux MEI** (ce qui circule dans le produit) avec une **grandeur flux** d’un modèle (le facteur I, v, ω ou Qv de la puissance).

## Paramétrer un modèle
- **Variables internes** (paramètres) : les caractéristiques des constituants — résistance d’un moteur, masse d’un chariot, rendement d’un réducteur.
- **Variables externes** : les entrées imposées au modèle — tension d’alimentation, consigne, charge.
- **Entrées** (sources) : échelon, rampe, sinusoïde, fichier de mesures.
- **Sorties** : courbes, valeurs relevées par des blocs de mesure.

## Paramétrer la simulation
Le logiciel calcule à des **instants discrets**, séparés par un **pas**, puis relie les points.
| Le solveur | Principe |
| **À pas fixe** | Même pas partout : simple, mais soit lent, soit imprécis |
| **À pas variable** | Pas réduit quand ça varie vite, agrandi quand c’est calme |
> Plus le pas est petit, plus le résultat est précis… et plus le calcul est long : c’est le **compromis précision / temps**.

## Exemple travaillé
On simule le démarrage d’un moteur alimenté en 12 V entraînant une charge. Paramètres : résistance 1 Ω, inertie de la charge. La simulation donne un courant de démarrage de 12 A, qui décroît vers 2 A en régime établi, et une vitesse qui monte en 0,4 s. On mesure ensuite sur le réel : courant de démarrage 11 A, montée en 0,5 s. L’écart de 25 % sur le temps de montée suggère que l’inertie ou les frottements sont **sous-estimés** dans le modèle : on **recale** le paramètre.

## Exploiter les résultats
Lire des courbes, relever un maximum ou un temps de réponse, comparer au cahier des charges, puis **conclure** : la solution convient-elle ? Un résultat de simulation n’a de valeur que si ses **hypothèses** sont connues.`,
          },
          questions: [
            ['Dans le domaine électrique, quelle est la grandeur effort ?', ['La tension', 'La résistance', 'La puissance', 'L’intensité'], 0, 'La tension est l’effort, l’intensité le flux.'],
            ['En rotation, la puissance mécanique vaut…', ['P = p × Qv', 'P = F × v', 'P = C × ω', 'P = U × I'], 2, 'Couple multiplié par vitesse angulaire.'],
            ['En hydraulique, quelle est la grandeur flux ?', ['La masse', 'La température', 'La pression', 'Le débit volumique'], 3, 'Pression × débit donne la puissance hydraulique.'],
            ['Quel type de modèle représente formes et masses ?', ['Le diagramme d’états', 'Le schéma-bloc', 'Le modèle volumique', 'Le modèle de régression'], 2, 'Il est construit en CAO.'],
            ['La masse d’un chariot, dans un modèle, est une variable…', ['externe', 'interne (paramètre)', 'de sortie', 'aléatoire'], 1, 'Elle caractérise un constituant.'],
            ['Que se passe-t-il si l’on réduit le pas de calcul ?', ['Plus précis mais plus long', 'Moins précis et plus rapide', 'Aucun effet', 'Plus précis et plus rapide'], 0, 'C’est le compromis précision / temps de calcul.'],
            ['Quel avantage a un solveur à pas variable ?', ['Il supprime les hypothèses', 'Il est toujours plus lent', 'Il adapte le pas aux variations du résultat', 'Il ne calcule qu’un point'], 2, 'Pas fin quand ça varie vite, large quand c’est calme.'],
            ['Un flux MEI et une grandeur flux d’un modèle multiphysique sont la même chose.', ['Vrai', 'Faux'], 1, 'Le premier circule dans le produit, la seconde est un facteur de la puissance.'],
            ['Une force de 50 N déplace un objet à 2 m/s. Puissance ?', ['25 W', '52 W', '100 W', '200 W'], 2, 'P = F × v = 50 × 2 = 100 W.'],
            ['Si la simulation et le réel s’écartent nettement, que fait-on ?', ['On recale les paramètres du modèle', 'On ignore la mesure', 'On change de logiciel', 'On garde la simulation'], 0, 'L’écart révèle une hypothèse ou un paramètre à corriger.'],
            ['Quel modèle est tiré d’une série de mesures dans un tableur ?', ['Le modèle multiphysique', 'Le diagramme de séquence', 'Le modèle volumique', 'Le modèle de régression'], 3, 'On ajuste une loi aux points mesurés.'],
            ['Un résultat de simulation vaut même sans connaître ses hypothèses.', ['Vrai', 'Faux'], 1, 'Sans hypothèses, on ne sait pas dans quel domaine il est valable.'],
          ],
        },
        // ---- 10 --------------------------------------------------------------
        {
          titre: 'Comportement mécanique : équilibre et résistance',
          axe: 'Approche comportementale des produits',
          lecon: {
            titre: 'Tenir en place et ne pas casser',
            cours: `Une structure ou un mécanisme doit **rester en équilibre** sous les efforts qu’il subit, et **résister** sans se rompre ni trop se déformer.

## L’équilibre d’un solide
Un solide immobile (ou en mouvement uniforme) est en équilibre si :
1. la **somme des forces** extérieures est nulle ;
2. la **somme des moments** de ces forces par rapport à un point est nulle.
= Moment d’une force = F × d
F en newtons, d en mètres (distance entre la droite d’action de la force et le point), moment en N·m.

## Exemple travaillé : une étagère en console
Une étagère porte une charge de 200 N à 0,30 m du mur. La console est fixée au mur par une vis haute, à 0,10 m au-dessus d’un appui bas.
- Moment de la charge par rapport à l’appui bas : 200 × 0,30 = **60 N·m**.
- La vis doit fournir un moment opposé : F × 0,10 = 60, donc **F = 600 N**.
La vis est tirée trois fois plus fort que la charge ! D’où l’importance d’écarter les points de fixation : avec 0,20 m entre vis et appui, F tombe à 300 N.

> Plus le bras de levier est grand, plus la force nécessaire est petite.

## Stabilité
Un objet posé est **stable** tant que la verticale de son centre de gravité tombe **à l’intérieur de sa base d’appui**. Élargir la base ou abaisser le centre de gravité augmente la stabilité (une grue a un contrepoids pour cette raison).

## Mobilité
Une structure peut être un **mécanisme** (des pièces bougent, mobilité non nulle) ou une **structure** immobile (ossature, charpente). Pour une charpente, on vérifie qu’elle ne peut pas se déformer comme un parallélogramme : on la **triangule**.

## Résister : la contrainte
Deux pièces de même matière, l’une fine et l’autre épaisse, ne résistent pas pareil à la même force. On compare la **contrainte** :
= σ = F / S
σ (sigma) en pascals (1 MPa = 1 N/mm²), F en newtons, S la section en mm².
| La sollicitation | Effet |
| **Traction** | La pièce s’allonge |
| **Compression** | La pièce se raccourcit (et peut flamber si elle est élancée) |
| **Flexion** | La pièce se courbe (poutre chargée) |
| **Torsion** | La pièce se tord (arbre de transmission) |
| **Cisaillement** | Deux sections glissent l’une sur l’autre (axe, rivet) |

## Élasticité et rupture
Tant que la contrainte reste sous la **limite élastique** Re, la pièce reprend sa forme quand on relâche (comportement élastique, loi de Hooke). Au-delà, elle se déforme durablement, puis rompt à la **résistance à la rupture** Rm. On dimensionne avec un **coefficient de sécurité** s : on veut σ ≤ Re / s.

Exemple : un tirant en acier (Re = 235 MPa) de section 50 mm² supporte 5 000 N : σ = 5 000 / 50 = **100 MPa**. Avec s = 2, la limite admissible est 117,5 MPa : c’est **conforme**.

## La simulation par éléments finis
Pour une forme complexe, le logiciel découpe la pièce en petits éléments (le **maillage**) et calcule contraintes et déplacements en chaque point. Les zones rouges signalent où la pièce risque de céder.`,
          },
          questions: [
            ['Quelles sont les deux conditions d’équilibre d’un solide ?', ['Température constante et pression nulle', 'Somme des forces nulle et somme des moments nulle', 'Vitesse nulle et masse nulle', 'Force maximale et moment minimal'], 1, 'C’est le principe fondamental de la statique.'],
            ['Une force de 200 N agit à 0,30 m d’un point. Son moment vaut…', ['60 N·m', '600 N·m', '6,7 N·m', '200,3 N·m'], 0, 'M = F × d = 200 × 0,30 = 60 N·m.'],
            ['La charge d’une étagère crée un moment de 60 N·m. Quelle force la vis doit-elle fournir avec un bras de levier de 0,10 m ?', ['60 N', '200 N', '600 N', '6 000 N'], 2, 'F × 0,10 = 60, donc F = 600 N.', 'Dans l’exemple de l’étagère, quelle force la vis doit-elle fournir avec 0,10 m de bras ?'],
            ['Que se passe-t-il si l’on écarte davantage la vis de l’appui ?', ['La force dans la vis augmente', 'La force dans la vis diminue', 'Rien ne change', 'L’étagère devient instable'], 1, 'Un bras de levier plus grand demande une force plus petite.'],
            ['Un objet posé est stable si la verticale de son centre de gravité…', ['passe par son sommet', 'est horizontale', 'sort de sa base d’appui', 'tombe à l’intérieur de sa base d’appui'], 3, 'Sinon, il bascule.'],
            ['Quelle est l’unité de la contrainte ?', ['Le pascal (ou N/mm²)', 'Le joule', 'Le mètre', 'Le newton'], 0, '1 MPa = 1 N/mm².'],
            ['Un tirant de 50 mm² supporte 5 000 N. Quelle est la contrainte ?', ['10 MPa', '100 MPa', '250 MPa', '1 000 MPa'], 1, 'σ = 5 000 / 50 = 100 MPa.'],
            ['Un arbre de transmission qui transmet un couple est sollicité en…', ['cisaillement pur', 'traction', 'torsion', 'compression'], 2, 'Il se tord sous l’effet du couple.'],
            ['Sous la limite élastique, une pièce reprend sa forme quand on relâche l’effort.', ['Vrai', 'Faux'], 0, 'C’est le comportement élastique.'],
            ['À quoi sert un coefficient de sécurité ?', ['À calculer le prix', 'À choisir la couleur', 'À rendre la pièce plus légère', 'À garder une marge sous la limite élastique'], 3, 'On impose σ ≤ Re / s.'],
            ['Pourquoi triangule-t-on une charpente ?', ['Pour économiser le bois', 'Pour l’esthétique', 'Pour l’empêcher de se déformer en parallélogramme', 'Pour la rendre mobile'], 2, 'Le triangle est une forme indéformable.'],
            ['La simulation par éléments finis découpe la pièce en petits éléments appelés…', ['les jalons', 'le maillage', 'le graphe', 'les classes'], 1, 'Le logiciel calcule contraintes et déplacements sur chaque élément.'],
          ],
        },
        // ---- 11 --------------------------------------------------------------
        {
          titre: 'Comportement énergétique : puissance, rendement, bilan',
          axe: 'Approche comportementale des produits',
          lecon: {
            titre: 'Suivre l’énergie et ses pertes',
            cours: `Rien ne se perd, rien ne se crée : l’énergie se **conserve**, mais une partie se transforme toujours en formes inutiles, les **pertes**, le plus souvent de la chaleur.

## Énergie et puissance
= E = P × t
E en joules (J) si P en watts (W) et t en secondes (s). En pratique, on compte souvent en **wattheures** : 1 Wh = 3 600 J, 1 kWh = 3,6 MJ.
La **puissance** mesure la **vitesse** à laquelle l’énergie est transférée.

## Le rendement
= η = P utile / P absorbée
Le rendement η (êta) est toujours **inférieur à 1**. Les pertes valent P absorbée − P utile.
Pour une chaîne de plusieurs convertisseurs en série :
= η global = η1 × η2 × η3 × …
> Le rendement global est toujours plus faible que le plus faible des rendements de la chaîne.

## Les puissances selon les domaines
| Le domaine | Puissance |
| Électrique continu | P = U × I |
| Mécanique en translation | P = F × v |
| Mécanique en rotation | P = C × ω (ω en rad/s ; ω = 2π × N / 60 si N en tr/min) |
| Hydraulique | P = p × Qv |
| Thermique | P = flux thermique, en W |

## Les sources d’énergie
| La source | Caractéristique utile |
| Batterie | Tension nominale (V), capacité (Ah), énergie stockée = U × Q (Wh) |
| Réseau électrique | 230 V, 50 Hz, puissance souscrite |
| Panneau photovoltaïque | Puissance crête (Wc), dépend de l’ensoleillement |
| Carburant | Pouvoir calorifique (kWh/L ou MJ/kg) |

## Exemple travaillé : un vélo à assistance électrique
Batterie 36 V, 10 Ah. Énergie stockée : 36 × 10 = **360 Wh**.
Chaîne : batterie → variateur (η = 0,95) → moteur (η = 0,85) → réducteur (η = 0,90).
η global = 0,95 × 0,85 × 0,90 ≈ **0,73**.
Énergie utile sur la roue : 360 × 0,73 ≈ **262 Wh**.
Si l’assistance fournit 150 W utiles à la roue, la puissance tirée de la batterie est 150 / 0,73 ≈ 205 W, et l’autonomie vaut 360 / 205 ≈ **1,75 h**. À 20 km/h, cela représente environ **35 km**.

## Faire un bilan énergétique
1. Identifier l’énergie **entrante** et sa source.
2. Suivre chaque conversion et son rendement.
3. Chiffrer l’énergie **utile** et les **pertes** à chaque étage.
4. Représenter le tout dans un **diagramme de Sankey**.
5. Repérer l’étage le plus coûteux : c’est là qu’il faut agir.

## Réduire les pertes
- Pertes par **effet Joule** : réduire les courants, augmenter les sections de câble.
- Pertes par **frottement** : lubrifier, choisir des roulements.
- Pertes **thermiques** : isoler.
- **Récupérer** : freinage récupératif, récupération de chaleur.`,
          },
          questions: [
            ['Combien de joules vaut 1 Wh ?', ['60 J', '1 000 J', '3 600 J', '3,6 MJ'], 2, '1 W pendant 3 600 s.'],
            ['Que vaut le rendement d’un convertisseur réel ?', ['Toujours inférieur à 1', 'Toujours 0,5', 'Toujours 1', 'Toujours supérieur à 1'], 0, 'Il y a toujours des pertes.'],
            ['Un moteur absorbe 400 W et fournit 320 W. Son rendement vaut…', ['0,75', '0,80', '1,25', '0,20'], 1, '320 / 400 = 0,80.'],
            ['Comment calcule-t-on le rendement d’une chaîne de convertisseurs en série ?', ['On fait la moyenne', 'On additionne les rendements', 'On multiplie les rendements', 'On prend le plus grand'], 2, 'η global = η1 × η2 × η3…'],
            ['Quelle énergie stocke une batterie 36 V de 10 Ah ?', ['46 Wh', '360 Wh', '3,6 Wh', '3 600 Wh'], 1, '36 × 10 = 360 Wh.'],
            ['Que vaut 0,95 × 0,85 × 0,90 environ ?', ['0,90', '0,85', '0,73', '0,50'], 2, 'Le rendement global est plus faible que chacun des rendements.'],
            ['Le rendement global est toujours plus faible que le plus faible des rendements de la chaîne.', ['Vrai', 'Faux'], 0, 'Multiplier par des nombres inférieurs à 1 fait diminuer le produit.'],
            ['Un moteur fournit un couple de 2 N·m à 100 rad/s. Puissance ?', ['50 W', '102 W', '200 W', '2 000 W'], 2, 'P = C × ω = 2 × 100 = 200 W.'],
            ['Une lampe de 60 W fonctionne 5 h. Énergie consommée ?', ['12 Wh', '65 Wh', '300 Wh', '3 000 Wh'], 2, 'E = P × t = 60 × 5 = 300 Wh.'],
            ['Pour réduire les pertes par effet Joule dans un câble, on…', ['augmente sa section', 'augmente le courant', 'le chauffe', 'diminue sa section'], 0, 'Une plus grande section diminue la résistance.'],
            ['Quel diagramme représente un bilan énergétique avec ses pertes ?', ['Le diagramme de séquence', 'Le graphe des liaisons', 'Le diagramme de Gantt', 'Le diagramme de Sankey'], 3, 'La largeur des flèches est proportionnelle aux énergies.'],
            ['La puissance mesure…', ['la quantité totale d’énergie', 'la vitesse de transfert de l’énergie', 'la masse d’un objet', 'la tension d’une batterie'], 1, 'P = E / t : la puissance dit à quelle vitesse l’énergie est transférée. Un watt vaut un joule par seconde.'],
          ],
        },
        // ---- 12 --------------------------------------------------------------
        {
          titre: 'Comportement informationnel : états et séquences',
          axe: 'Approche comportementale des produits',
          lecon: {
            titre: 'Décrire comment un produit réagit dans le temps',
            cours: `Un produit piloté ne réagit pas toujours de la même façon au même événement : cela dépend de l’**état** où il se trouve. Pour décrire ce comportement, on utilise des diagrammes et on raisonne en boucles de commande.

## Nature de l’information
| La nature | Valeurs possibles | Exemple |
| **Logique** (TOR) | 0 ou 1 | Bouton appuyé ou non |
| **Analogique** | Continue | Tension d’un capteur de température |
| **Numérique** | Des nombres, à des instants précis | Valeur lue par un CAN toutes les 10 ms |
Un signal peut être représenté dans le **temps** (chronogramme) ou en **fréquence** (spectre).

## Le diagramme d’états (stm)
| L’élément | Définition |
| **État** | Situation stable du système (Fermé, Ouverture, Ouvert…) |
| **Transition** | Passage d’un état à un autre |
| **Événement** | Ce qui déclenche la transition (appui sur la télécommande) |
| **Condition de garde** | Condition qui doit être vraie, entre crochets : [obstacle = faux] |
| **Action** | Ce que fait le système en entrant, pendant ou en sortant d’un état |

## Exemple travaillé : un portail automatique
| État | Événement / garde | État suivant |
| Fermé | appui télécommande | Ouverture |
| Ouverture | fin de course ouvert | Ouvert |
| Ouvert | après 30 s | Fermeture |
| Fermeture | fin de course fermé | Fermé |
| Fermeture | obstacle détecté | Ouverture |
La dernière ligne est une **sécurité** : un obstacle pendant la fermeture fait rouvrir le portail. En entrant dans l’état « Ouverture », l’action est « moteur sens 1, feu clignotant allumé ».

## Le diagramme de séquence (sd)
Il montre les **messages** échangés entre acteurs et constituants, dans l’ordre chronologique, de haut en bas. Exemple : Usager → Télécommande : appui ; Télécommande → Carte : code radio ; Carte → Moteur : marche ; Cellule → Carte : obstacle ; Carte → Moteur : arrêt puis inversion.

## Commande en boucle ouverte ou fermée
| La commande | Principe | Exemple |
| **Boucle ouverte** | On envoie un ordre sans vérifier le résultat | Grille-pain minuté |
| **Boucle fermée** | Un capteur mesure le résultat, on corrige l’écart avec la consigne | Four à thermostat, régulateur de vitesse |
~ Consigne → Comparateur (écart) → Correcteur → Actionneur → Système → Capteur → retour au comparateur
> La boucle fermée compense les perturbations : si la porte du four s’ouvre, la température baisse, l’écart grandit, et le chauffage repart.

## Liaisons série et temps réel
Les constituants communiquent souvent par **liaison série** : les bits passent un par un sur un fil (UART, I2C, SPI). Un système est **temps réel** quand il doit répondre dans un délai garanti : un airbag doit se déclencher en quelques millisecondes, pas « dès que possible ». On parle de **temps de cycle** et d’**interruptions** (le programme s’interrompt pour traiter un événement urgent).`,
          },
          questions: [
            ['Dans un diagramme d’états, qu’est-ce qui déclenche une transition ?', ['Un bloc', 'Un événement', 'Une exigence', 'Un acteur seul'], 1, 'L’événement fait passer d’un état à un autre.'],
            ['Comment s’écrit une condition de garde ?', ['Entre guillemets', 'En gras', 'Entre parenthèses obligatoirement', 'Entre crochets'], 3, 'Par exemple [obstacle = faux].'],
            ['Dans le portail, que se passe-t-il si un obstacle est détecté pendant la fermeture ?', ['Il repasse en ouverture', 'Il reste bloqué', 'Rien', 'Le portail se ferme plus vite'], 0, 'C’est une fonction de sécurité.'],
            ['Que montre un diagramme de séquence ?', ['Les flux d’énergie', 'Les constituants et leur hiérarchie', 'Les messages échangés dans l’ordre chronologique', 'Les exigences'], 2, 'Le temps s’écoule de haut en bas.'],
            ['Un grille-pain minuté fonctionne en…', ['temps réel strict', 'liaison série', 'boucle fermée', 'boucle ouverte'], 3, 'Il ne mesure pas l’état du pain.'],
            ['Qu’est-ce qui caractérise une boucle fermée ?', ['Une seule transition', 'L’absence de capteur', 'Un capteur mesure le résultat pour corriger l’écart à la consigne', 'Un fonctionnement sans énergie'], 2, 'On compare en permanence la mesure et la consigne.'],
            ['Un four à thermostat compense l’ouverture de sa porte grâce à la boucle fermée.', ['Vrai', 'Faux'], 0, 'L’écart de température grandit et le chauffage repart.'],
            ['Une information qui ne prend que les valeurs 0 et 1 est…', ['analogique', 'logique (TOR)', 'fréquentielle', 'hydraulique'], 1, 'Une information « tout ou rien » (TOR) n’a que deux états, 0 ou 1 : c’est une information logique, celle d’un interrupteur.'],
            ['Qu’est-ce qu’un système temps réel ?', ['Un système qui doit répondre dans un délai garanti', 'Un système qui affiche l’heure', 'Un système sans programme', 'Un système très rapide'], 0, 'L’airbag en est un exemple.'],
            ['Dans une liaison série, les bits passent…', ['sans fil uniquement', 'tous en même temps', 'un par un', 'par paquets de 64 obligatoirement'], 2, 'UART, I2C et SPI sont des liaisons série.'],
            ['Quel élément de la boucle calcule la différence entre consigne et mesure ?', ['Le comparateur', 'Le système', 'Le capteur', 'L’actionneur'], 0, 'Il produit l’écart transmis au correcteur.'],
            ['Un état est une situation stable du système.', ['Vrai', 'Faux'], 0, 'Le système y reste jusqu’à ce qu’une transition le fasse changer.'],
          ],
        },
        // ---- 13 --------------------------------------------------------------
        {
          titre: 'Les matériaux et leur choix',
          axe: 'Éco-conception des produits',
          lecon: {
            titre: 'Choisir la bonne matière pour la bonne fonction',
            cours: `Choisir un matériau, c’est trouver le meilleur compromis entre ses **propriétés**, son **coût**, sa **mise en œuvre** et son **impact environnemental**, sur tout le cycle de vie.

## Les familles de matériaux
| La famille | Exemples | Points forts | Points faibles |
| **Métaux** | Acier, aluminium, cuivre | Résistants, ductiles, conducteurs, recyclables | Lourds (acier), corrosion |
| **Polymères** (plastiques) | PLA, ABS, polypropylène, PVC | Légers, faciles à mettre en forme | Peu résistants à la chaleur, souvent fossiles |
| **Céramiques et minéraux** | Verre, béton, porcelaine | Durs, résistent à la chaleur et à la compression | Fragiles, cassent sans prévenir |
| **Composites** | Fibre de carbone, fibre de verre, béton armé | Très bonne résistance pour leur masse | Chers, difficiles à recycler |
| **Naturels** (biosourcés) | Bois, bambou, chanvre, liège | Renouvelables, stockent du carbone | Sensibles à l’humidité, variables |

## Les propriétés à connaître
| La propriété | Grandeur | Ordre de grandeur |
| **Masse volumique** | ρ (kg/m³) | Acier 7 850, aluminium 2 700, bois 500, PLA 1 240 |
| **Rigidité** | Module d’Young E (GPa) | Acier 210, aluminium 70, bois 10, PLA 3,5 |
| **Résistance** | Limite élastique Re (MPa) | Acier courant 235, aluminium allié 200 à 300 |
| **Conductivité thermique** | λ (W/(m·K)) | Cuivre 390, acier 50, bois 0,15, laine de verre 0,04 |
| **Conductivité électrique** | — | Métaux conducteurs, polymères isolants |

> Le module d’Young mesure la **rigidité** (se déformer peu), la limite élastique la **résistance** (ne pas céder) : ce sont deux choses différentes.

## La démarche de choix
1. Traduire la **fonction** de la pièce en exigences : léger, rigide, isolant, résistant à l’eau…
2. Éliminer les familles qui ne conviennent pas.
3. Comparer les candidats avec des **indices de performance** : pour une pièce légère et rigide, on cherche un grand rapport E / ρ.
4. Intégrer le **procédé** de mise en forme possible et le **coût**.
5. Intégrer l’**impact environnemental** : énergie de fabrication, part recyclée, recyclabilité, origine.

## Exemple travaillé : un cadre de vélo
| Critère | Acier | Aluminium | Carbone | Bambou |
| Masse | Lourd | Léger | Très léger | Léger |
| Rigidité / masse (E / ρ, en MN·m/kg) | 26,8 | 25,9 | Très élevé | Correct |
| Coût | Faible | Moyen | Élevé | Faible |
| Recyclage | Excellent | Excellent | Difficile | Compostable |
L’acier et l’aluminium ont une rigidité **par kilo** presque identique : l’aluminium gagne en légèreté grâce à des tubes plus gros. Le carbone est le plus performant mais le moins recyclable. Pour un vélo de ville durable et bon marché, l’**acier** ou l’**aluminium recyclé** sont de bons choix.

## Les propriétés physico-chimiques
Résistance à la **corrosion** (inox, aluminium anodisé), tenue aux **UV**, à l’**humidité**, au **feu** : elles comptent autant que la résistance mécanique pour la durée de vie du produit.`,
          },
          questions: [
            ['Quelle famille regroupe le PLA, l’ABS et le PVC ?', ['Les céramiques', 'Les naturels', 'Les métaux', 'Les polymères'], 3, 'Ce sont des plastiques.'],
            ['Quel est l’inconvénient principal des céramiques ?', ['Elles sont lourdes comme le plomb', 'Elles sont fragiles', 'Elles conduisent l’électricité', 'Elles pourrissent'], 1, 'Elles cassent sans se déformer au préalable.'],
            ['Que mesure le module d’Young ?', ['La résistance à la rupture', 'La rigidité', 'La masse', 'La conductivité'], 1, 'Un grand module signifie qu’on se déforme peu.'],
            ['Quelle est la masse volumique approximative de l’aluminium ?', ['500 kg/m³', '1 240 kg/m³', '2 700 kg/m³', '7 850 kg/m³'], 2, 'Environ trois fois moins que l’acier.'],
            ['Quel matériau est le meilleur isolant thermique parmi ceux-ci ?', ['Le cuivre', 'L’acier', 'Le bois', 'La laine de verre'], 3, 'λ ≈ 0,04 W/(m·K), bien plus faible que le bois.'],
            ['Pour une pièce légère et rigide, quel indice cherche-t-on à maximiser ?', ['E / ρ', 'E × ρ', 'Re × ρ', 'ρ / E'], 0, 'On veut beaucoup de rigidité par kilo.'],
            ['Quelle est la masse d’une pièce d’acier de 0,002 m³ (ρ = 7 850 kg/m³) ?', ['3,9 kg', '15,7 kg', '78,5 kg', '1,57 kg'], 1, 'm = ρ × V = 7 850 × 0,002 = 15,7 kg.'],
            ['Les composites en fibre de carbone sont faciles à recycler.', ['Vrai', 'Faux'], 1, 'Séparer fibres et résine est difficile.'],
            ['Pourquoi les matériaux biosourcés sont-ils intéressants ?', ['Ils conduisent l’électricité', 'Ils sont toujours plus résistants', 'Ils sont renouvelables et stockent du carbone', 'Ils ne craignent pas l’humidité'], 2, 'Le bois stocke le CO2 absorbé pendant la croissance.'],
            ['Rigidité et résistance sont deux propriétés différentes.', ['Vrai', 'Faux'], 0, 'Se déformer peu n’est pas la même chose que ne pas céder.'],
            ['Quelle est la première étape d’un choix de matériau ?', ['Choisir la couleur', 'Commander un échantillon', 'Comparer les prix', 'Traduire la fonction de la pièce en exigences'], 3, 'On part de ce que la pièce doit faire.'],
            ['Quel traitement améliore la résistance de l’aluminium à la corrosion ?', ['Le pliage', 'L’impression 3D', 'L’anodisation', 'Le chauffage'], 2, 'Elle épaissit la couche d’oxyde protectrice.'],
          ],
        },
        // ---- 14 --------------------------------------------------------------
        {
          titre: 'Expérimenter et valider un prototype',
          axe: 'Prototypage et expérimentations',
          lecon: {
            titre: 'Mesurer pour prouver',
            cours: `Un ingénieur ne dit pas « ça marche » : il le **prouve par des mesures**, en suivant un protocole, et il compare les résultats à ce qui était attendu.

## Le protocole d’essai
Un protocole précise, avant de toucher au matériel :
1. **L’objectif** : quelle exigence ou quelle grandeur veut-on vérifier ?
2. **Le montage** : schéma, appareils de mesure, emplacement des capteurs.
3. **Les conditions** : charge, tension d’alimentation, température ambiante.
4. **Le mode opératoire** : les étapes, dans l’ordre, et le nombre de répétitions.
5. **Les consignes de sécurité**.
6. **Le traitement** prévu des résultats : tableau, courbe, calcul.

## La sécurité
- Couper l’alimentation avant de câbler ; vérifier le montage avant de mettre sous tension.
- Porter les équipements adaptés : lunettes, gants selon le risque.
- Protéger les pièces en mouvement ; connaître l’emplacement de l’arrêt d’urgence.
- Augmenter progressivement les grandeurs (tension, charge).

## Mesures et incertitudes
Toute mesure est entachée d’une **incertitude**. On écrit le résultat sous la forme :
= Grandeur = valeur ± incertitude (unité)
Exemple : v = 2,45 ± 0,05 m/s. Répéter la mesure et prendre la moyenne réduit l’influence des erreurs aléatoires.

## Les trois écarts
| L’écart | Entre | Ce qu’il révèle |
| **Écart 1** | Le cahier des charges et le **modèle** (simulation) | La solution conçue répond-elle au besoin, sur le papier ? |
| **Écart 2** | Le modèle et le **réel mesuré** | Les hypothèses du modèle sont-elles justes ? |
| **Écart 3** | Le réel mesuré et le **cahier des charges** | Le produit est-il conforme ? |
> Un écart 2 important ne veut pas dire que le produit est mauvais : il veut dire que le **modèle** doit être corrigé.

## Vérifier, valider, qualifier
| Le mot | Sens |
| **Vérifier** | Contrôler qu’un élément est conforme à sa spécification (le moteur fournit bien 50 W) |
| **Valider** | Contrôler que le produit répond au besoin de l’utilisateur (le volet se lève en moins de 20 s) |
| **Qualifier** | Mesurer les performances réelles du produit fini dans ses conditions d’usage |

## Exemple travaillé
Exigence : « le chariot doit monter une rampe de 10 % avec 5 kg en moins de 8 s ». La simulation annonce 6,5 s. Mesures sur cinq essais : 7,4 ; 7,6 ; 7,5 ; 7,3 ; 7,7 s, moyenne **7,5 s**.
- Écart 3 : 7,5 s < 8 s, le produit est **conforme**.
- Écart 2 : (7,5 − 6,5) / 6,5 ≈ **15 %** : le modèle est optimiste. Les frottements des roues ont sans doute été sous-estimés.
- Action : recaler le coefficient de frottement du modèle, pour qu’il serve aux prochaines conceptions.

## Rédiger la conclusion
Une bonne conclusion répond à la question posée, chiffre l’écart, propose une **explication** et une **amélioration**.`,
          },
          questions: [
            ['Par quoi commence un protocole d’essai ?', ['Par la mise sous tension', 'Par l’objectif de l’essai', 'Par le calcul final', 'Par la conclusion'], 1, 'On sait d’abord ce que l’on veut vérifier.'],
            ['Quel écart compare le modèle et le réel mesuré ?', ['L’écart 2', 'L’écart 3', 'Aucun', 'L’écart 1'], 0, 'Il juge la justesse des hypothèses du modèle.'],
            ['Quel écart dit si le produit est conforme au cahier des charges ?', ['L’écart 1', 'L’écart 2', 'L’écart 3', 'L’écart 4'], 2, 'Il compare le réel au cahier des charges.'],
            ['Moyenne de 7,4 ; 7,6 ; 7,5 ; 7,3 ; 7,7 s ?', ['7,4 s', '7,5 s', '7,6 s', '37,5 s'], 1, '37,5 / 5 = 7,5 s.'],
            ['Avec 7,5 s mesurées pour une exigence de 8 s maximum, le chariot est…', ['conforme', 'à refaire entièrement', 'impossible à juger', 'non conforme'], 0, '7,5 s est inférieur à 8 s.'],
            ['Quel est l’écart relatif entre 7,5 s mesurées et 6,5 s simulées ?', ['Environ 50 %', 'Environ 1 %', 'Environ 7 %', 'Environ 15 %'], 3, '(7,5 − 6,5) / 6,5 ≈ 0,15.'],
            ['Un grand écart entre modèle et réel signifie forcément que le produit est mauvais.', ['Vrai', 'Faux'], 1, 'Il signifie d’abord que le modèle doit être corrigé.'],
            ['Que signifie « valider » un produit ?', ['Vérifier une pièce isolée', 'Contrôler qu’il répond au besoin de l’utilisateur', 'Le peindre', 'Le vendre'], 1, 'Vérifier concerne une spécification, valider concerne le besoin.'],
            ['Pourquoi répéter une mesure plusieurs fois ?', ['Pour perdre du temps', 'Pour réduire l’influence des erreurs aléatoires', 'Pour changer le résultat', 'Parce que le protocole est faux'], 1, 'La moyenne est plus fiable qu’une mesure unique.'],
            ['Que faut-il faire avant de câbler un montage ?', ['Augmenter la tension', 'Retirer ses lunettes', 'Mettre sous tension', 'Couper l’alimentation'], 3, 'On câble toujours hors tension.'],
            ['Comment écrit-on correctement un résultat de mesure ?', ['v = 2,45 ± 0,05 m/s', 'v ≈ 2 m/s', 'v = 2,45', 'v = 2,45 m/s environ'], 0, 'Valeur, incertitude et unité.'],
            ['Que doit contenir une bonne conclusion d’essai ?', ['Le nom des élèves seulement', 'Uniquement « ça marche »', 'La réponse chiffrée, une explication de l’écart et une amélioration', 'La liste du matériel'], 2, 'Elle répond à la question posée et ouvre sur la suite.'],
          ],
        },
      ],
    },
  ],
}
