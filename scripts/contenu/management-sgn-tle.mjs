// MANAGEMENT, SCIENCES DE GESTION ET NUMÉRIQUE — Tle technologique (série
// STMG). Matière NEUVE de la voie technologique : un élève de la voie générale
// ne la voit jamais (cf. BRIEF-techno : `contentLevelFor` range la « Tle
// techno » au niveau 'Tle').
//
// PROGRAMME : BO spécial n° 8 du 25 juillet 2019 (programme de management,
// sciences de gestion et numérique de terminale STMG), en vigueur. Il a deux
// étages :
//   · un ENSEIGNEMENT COMMUN, trois thèmes et douze questions — c’est lui, et
//     lui seul, qu’évalue l’écrit de 4 heures (note de service MENE2622652N du
//     11/09/2026, session 2027) ;
//   · un ENSEIGNEMENT SPÉCIFIQUE choisi par l’élève parmi quatre (gestion et
//     finance ; mercatique ; ressources humaines et communication ; systèmes
//     d’information de gestion), qui nourrit le projet de l’année, support du
//     Grand oral technologique (note MENE2622701N).
// Découpage : une fiche par question de l’enseignement commun, sauf 3.2 et 3.3
// réunies (modes de vie et numérique : deux questions sur les responsabilités
// nouvelles des organisations) ; UNE fiche dense par enseignement spécifique
// (tout élève voit les quatre, chacun ne travaille que le sien) ; une fiche
// méthode sur l’écrit et le projet.

export default {
  slug: 'management-sgn',
  nom: 'Management, sciences de gestion et numérique',

  titreMigration: 'MANAGEMENT, SCIENCES DE GESTION ET NUMÉRIQUE Tle STMG — LE PROGRAMME OFFICIEL (16 fiches)',

  motif: `Matière neuve de la voie technologique (série STMG, classe de terminale) :
la spécialité management, sciences de gestion et numérique n'avait aucune fiche.
Ce module installe le programme officiel (BO spécial n° 8 du 25 juillet 2019) :
les douze questions de l'enseignement commun — celles de l'écrit de 4 heures —
en onze fiches, une fiche pour chacun des quatre enseignements spécifiques
(gestion et finance, mercatique, ressources humaines et communication, systèmes
d'information de gestion) et une fiche de méthode sur l'écrit et le projet.`,

  blocs: [
    {
      niveaux: ['Tle'],
      positionDepart: 1,
      chapitres: [
        // ---- Enseignement commun — Thème 1 ---------------------------------
        {
          titre: 'Quels produits pour quels besoins ?',
          axe: 'Enseignement commun — Thème 1 : Les organisations et l’activité de production de biens et de services',
          lecon: {
            titre: 'Connaître son marché pour créer de la valeur',
            cours: `Avant de produire, une organisation doit savoir **pour qui** et **pour quoi** elle produit. C’est le rôle du **marketing** : détecter un besoin non satisfait — exprimé ou non par le client — et y répondre par une offre qui **crée de la valeur**.

## La démarche marketing
1. **Analyser le marché** (étude de marché, veille).
2. **Choisir** ses cibles et son positionnement.
3. **Définir l’offre** : produit, prix, distribution, communication.
4. **Mettre en œuvre** puis **contrôler** les résultats.

## Les approches marketing
| Approche | Point de départ | Exemple |
| **Marketing de l’offre** | L’organisation propose une innovation, le marché suit | Un objet connecté totalement nouveau |
| **Marketing de la demande** | On part des attentes exprimées par les clients | Une gamme sans sucre après des enquêtes |
| **Marketing de l’usager** (secteur public) | On part des besoins des usagers et de l’intérêt général | Horaires de bibliothèque élargis |

## L’étude de marché et la veille
- **Étude documentaire** : données existantes (INSEE, presse, rapports).
- **Étude qualitative** : entretiens, réunions de groupe, pour comprendre motivations et freins.
- **Étude quantitative** : questionnaire sur un échantillon représentatif, pour mesurer.
- **Veille marketing et commerciale** : surveiller en continu concurrents, tendances, clients (y compris sur les réseaux sociaux).

## La création de valeur
Un produit n’est lancé que s’il **crée de la valeur** : il doit garantir une **rentabilité** (entreprise) ou une **couverture des coûts** / un **équilibre budgétaire** (organisations publiques et associatives).
= Valeur ajoutée = chiffre d’affaires − consommations intermédiaires
Cette valeur est **incertaine** : elle dépend de la capacité à détecter et à satisfaire les besoins **dans la durée**. Dans le secteur public et associatif, elle s’apprécie aussi dans sa **dimension sociale**.

## Innovation de produit et modèle économique
- L’**innovation de produit** : un bien ou service nouveau ou nettement amélioré, ou l’intégration de services à un produit.
- Le **modèle économique** (*business model*) décrit **comment** l’organisation crée de la valeur et **comment elle est payée** : quelle proposition de valeur, pour quels clients, avec quelles ressources, quelles sources de revenus (vente, abonnement, publicité, gratuité partielle).

> Innover, ce n’est pas toujours inventer un produit : c’est parfois changer la façon de le proposer, à qui, et comment on se fait payer.

## Exemple travaillé
Une entreprise de perceuses constate qu’un particulier utilise sa perceuse une dizaine de minutes dans toute sa vie. Elle crée un service de **location** en magasin et en ligne.
- **Besoin** : faire un trou, pas posséder une perceuse (besoin non exprimé).
- **Innovation** : de modèle économique, pas de produit.
- **Création de valeur** : si 100 locations par mois à 12 € rapportent 1 200 € avec 300 € de consommations intermédiaires (entretien, forets), la valeur ajoutée mensuelle est de 900 € par point de location.`,
          },
          questions: [
            ['Quel est l’objectif du marketing ?', ['Réduire les salaires', 'Répondre par une offre à un besoin non satisfait, exprimé ou non', 'Tenir la comptabilité', 'Recruter des salariés'], 1, 'Le marketing part du marché pour définir l’offre.'],
            ['Une étude par entretiens approfondis sur les motivations des clients est une étude…', ['Quantitative', 'Qualitative', 'Documentaire', 'Comptable'], 1, 'Le qualitatif cherche à comprendre, le quantitatif à mesurer.'],
            ['Un questionnaire administré à 1 000 personnes représentatives est une étude…', ['Qualitative', 'Quantitative', 'Documentaire', 'Informelle'], 1, 'Il permet de chiffrer les comportements sur un échantillon représentatif.'],
            ['Qu’est-ce qu’un modèle économique (business model) ?', ['Le plan des bureaux', 'La manière dont l’organisation crée de la valeur et se fait payer', 'Le logo de la marque', 'Le bilan comptable'], 1, 'Proposition de valeur, clients, ressources, sources de revenus.'],
            ['Chiffre d’affaires 60 000 €, consommations intermédiaires 22 000 €. Valeur ajoutée ?', ['82 000 €', '38 000 €', '22 000 €', '2,7'], 1, '60 000 − 22 000 = 38 000 €.'],
            ['Proposer à la location un produit jusque-là vendu est une innovation…', ['De modèle économique', 'De procédé industriel', 'Comptable', 'Fiscale'], 0, 'Le produit est le même, c’est la façon de se faire payer qui change.'],
            ['Dans le secteur public, la valeur créée s’apprécie uniquement en euros.', ['Vrai', 'Faux'], 1, 'Elle s’apprécie aussi dans sa dimension sociale.'],
            ['Surveiller en continu les produits des concurrents et les tendances relève de…', ['La veille marketing et commerciale', 'L’audit comptable', 'La gestion de la paie', 'L’inventaire'], 0, 'La veille alimente la connaissance du marché.'],
            ['Le marketing de l’offre part…', ['Des attentes exprimées par les clients', 'D’une innovation proposée par l’organisation, que le marché adopte', 'Des obligations légales', 'Des prix des concurrents seulement'], 1, 'L’organisation anticipe un besoin que le client n’exprimait pas.'],
            ['La création de valeur d’un nouveau produit est certaine dès son lancement.', ['Vrai', 'Faux'], 1, 'Elle est incertaine : elle dépend de la capacité à satisfaire durablement les besoins.'],
            ['Quelle source de données relève d’une étude documentaire ?', ['Des statistiques de l’INSEE', 'Une réunion de groupe', 'Un entretien individuel', 'Un test en magasin'], 0, 'On exploite des données déjà existantes.'],
            ['Quelle est la première étape de la démarche marketing ?', ['Fixer le prix', 'Analyser le marché', 'Lancer la publicité', 'Contrôler les résultats'], 1, 'On ne définit pas une offre sans connaître le marché.'],
          ],
        },
        {
          titre: 'Les ressources pour produire',
          axe: 'Enseignement commun — Thème 1 : Les organisations et l’activité de production de biens et de services',
          lecon: {
            titre: 'Réunir les moyens humains et financiers de la production',
            cours: `Produire mobilise une **combinaison de ressources**. Il faut les identifier, les financer et prévoir celles dont on aura besoin demain — notamment les compétences.

## Ressources tangibles et intangibles
| Tangibles (physiques) | Intangibles (immatérielles) |
| Bâtiments, machines, stocks, trésorerie | Marque, brevets, savoir-faire, réputation, bases de données, culture |
Les ressources intangibles sont souvent les plus difficiles à imiter : elles fondent les **compétences distinctives**.

## Financer l’investissement
| Financement | Exemples | Point d’attention |
| **Fonds propres** | Autofinancement, augmentation de capital | Pas de remboursement, mais dilution du pouvoir si nouveaux associés |
| **Endettement** | Emprunt bancaire | Intérêts et remboursements à assurer |
| **Crédit-bail** | Location avec option d’achat d’une machine | Pas de décaissement initial, coût total plus élevé |
| **Aides** | Subventions | Conditions à respecter |
| **Financement participatif** | Plateformes de *crowdfunding* | Suppose un projet attractif pour le public |

## Financer l’exploitation : FRNG, BFR, trésorerie
Le **cycle d’exploitation** (acheter, stocker, produire, vendre, encaisser) crée un décalage : on paie les fournisseurs avant d’encaisser les clients. L’**analyse fonctionnelle du bilan** le mesure.
= FRNG = ressources stables − emplois stables
= BFR = (stocks + créances clients) − dettes fournisseurs
= Trésorerie nette = FRNG − BFR
- Le **fonds de roulement net global** (FRNG) : ce qui reste des ressources durables une fois les investissements financés.
- Le **besoin en fonds de roulement** (BFR) : l’argent immobilisé par le cycle d’exploitation.
- Si le FRNG couvre le BFR, la trésorerie est positive.

## Exemple travaillé
Une PME : ressources stables 500 000 €, emplois stables 420 000 €, stocks 60 000 €, créances clients 90 000 €, dettes fournisseurs 70 000 €.
- FRNG = 500 000 − 420 000 = **80 000 €**.
- BFR = 60 000 + 90 000 − 70 000 = **80 000 €**.
- Trésorerie nette = 80 000 − 80 000 = **0 €** : situation tendue ; si les clients paient plus tard, la trésorerie devient négative.
Un supermarché, lui, encaisse ses clients tout de suite et paie ses fournisseurs à 45 jours : son BFR est souvent **négatif**, une ressource pour lui.

## Les ressources humaines : prévoir
Les choix de production déterminent les **qualifications** et **compétences** nécessaires. La **gestion prévisionnelle des emplois et des compétences** (GPEC) compare les besoins futurs aux ressources actuelles et prévoit :
1. des **recrutements** (compétences absentes) ;
2. des **formations** (compétences à développer) ;
3. des **mobilités** internes.
Pour gagner en **flexibilité**, les organisations mobilisent aussi d’autres formes de relation de travail : CDD, intérim, travailleurs indépendants, sous-traitance.

> Une ressource ne vaut que si elle est disponible au bon moment : le financement et les compétences s’anticipent.`,
          },
          questions: [
            ['Laquelle est une ressource intangible ?', ['Un entrepôt', 'Un brevet', 'Un camion', 'Un stock de matières'], 1, 'Brevets, marque, savoir-faire, réputation sont immatériels.'],
            ['Comment calcule-t-on le FRNG ?', ['Ressources stables − emplois stables', 'Stocks + créances − dettes fournisseurs', 'Chiffre d’affaires − charges', 'Trésorerie + BFR'], 0, 'C’est l’excédent des ressources durables sur les investissements.'],
            ['Stocks 40 000 €, créances clients 30 000 €, dettes fournisseurs 50 000 €. BFR ?', ['120 000 €', '20 000 €', '− 20 000 €', '70 000 €'], 1, '40 000 + 30 000 − 50 000 = 20 000 €.'],
            ['FRNG 100 000 €, BFR 130 000 €. Trésorerie nette ?', ['230 000 €', '30 000 €', '− 30 000 €', '0 €'], 2, 'Trésorerie = FRNG − BFR = − 30 000 € : il faut des concours bancaires.'],
            ['Pourquoi un supermarché a-t-il souvent un BFR négatif ?', ['Il n’a pas de stocks', 'Il encaisse ses clients tout de suite et paie ses fournisseurs plus tard', 'Il n’a pas de fournisseurs', 'Il ne vend qu’à crédit'], 1, 'Le cycle d’exploitation lui fournit de la trésorerie.'],
            ['Le crédit-bail permet…', ['D’utiliser un bien sans décaissement initial, avec une option d’achat', 'D’obtenir une subvention', 'D’augmenter le capital', 'D’éviter tout coût'], 0, 'C’est une location avec option d’achat ; le coût total est plus élevé qu’un achat comptant.'],
            ['Une augmentation de capital doit être remboursée comme un emprunt.', ['Vrai', 'Faux'], 1, 'Ce sont des fonds propres : pas de remboursement, mais de nouveaux associés.'],
            ['Que fait la GPEC ?', ['Elle calcule la paie', 'Elle anticipe les besoins en emplois et compétences et prévoit recrutements et formations', 'Elle fixe les prix', 'Elle choisit les fournisseurs'], 1, 'Gestion prévisionnelle des emplois et des compétences.'],
            ['Recourir à l’intérim permet surtout de gagner en…', ['Flexibilité', 'Capital', 'Réputation', 'Brevets'], 0, 'L’organisation ajuste ses effectifs à l’activité.'],
            ['Le financement participatif suppose…', ['Un projet attractif pour le public', 'Une cotation en Bourse', 'Une garantie de l’État', 'L’absence de communication'], 0, 'Des particuliers financent un projet qui les séduit.'],
            ['Un FRNG qui couvre entièrement le BFR donne une trésorerie positive ou nulle.', ['Vrai', 'Faux'], 0, 'Trésorerie = FRNG − BFR.'],
            ['Pourquoi le cycle d’exploitation crée-t-il un besoin de financement ?', ['Parce qu’on paie souvent les fournisseurs avant d’encaisser les clients', 'Parce que les clients paient d’avance', 'Parce que les salaires sont gratuits', 'Parce qu’il n’y a pas de stocks'], 0, 'Ce décalage immobilise de l’argent : c’est le BFR.'],
          ],
        },
        {
          titre: 'Organiser la production : flexibilité, qualité et coûts',
          axe: 'Enseignement commun — Thème 1 : Les organisations et l’activité de production de biens et de services',
          lecon: {
            titre: 'Produire vite, bien et pas trop cher',
            cours: `Une organisation doit concilier trois exigences qui tirent parfois en sens contraire : la **flexibilité** (s’adapter vite à la demande), la **qualité** (satisfaire le client) et la **maîtrise des coûts**.

## Innovation de procédé et modes de production
L’**innovation de procédé** porte sur les méthodes de production ou de distribution nouvelles ou nettement améliorées (robotisation, impression 3D, nouvelle chaîne logistique).
| Mode | Caractéristiques | Exemple |
| **À l’unité** | Produit sur mesure, grande flexibilité, coût élevé | Un bateau, une robe de mariée |
| **En série** | Produits standardisés en grandes quantités, coûts réduits | Téléphones, voitures |
| **En continu** | Flux ininterrompu | Raffinerie, cimenterie |
| **En discontinu** | Lots successifs, changements de réglage | Imprimerie |
La production de **services** a ses traits propres : le client y participe souvent (coproduction), le service ne se stocke pas.

## Logistique et chaîne logistique
- La **logistique** gère les **flux physiques** (approvisionnement, stockage, transport) et les **flux d’informations** associés.
- La **gestion de la chaîne logistique** (*supply chain management*) pilote l’ensemble, du fournisseur du fournisseur au client final. Elle crée de la valeur en optimisant délais, stocks et coûts.
| Flux **poussés** | Flux **tendus** (tirés) |
| On produit selon des **prévisions**, puis on stocke | On produit à la **commande**, au plus juste |
| Stocks importants, disponibilité immédiate | Peu de stocks, mais vulnérabilité aux ruptures |

## La qualité
- **Contrôle qualité** : vérifier la conformité du produit (tests, échantillons).
- **Démarche qualité** : prévenir plutôt que corriger ; **amélioration continue** (roue de Deming : planifier, faire, vérifier, agir), **apprentissage** organisationnel.
Les normes et certifications (ISO 9001) attestent une démarche, mais la qualité se juge au final par la **satisfaction du client**.

## Contrôler les coûts
- **Charges directes** : affectées sans calcul à un produit (matières consommées, main-d’œuvre directe).
- **Charges indirectes** : communes à plusieurs produits (loyer, direction), réparties selon une clé.
| Méthode | Principe | Utilité |
| **Coût complet** | Toutes les charges, directes et indirectes | Fixer un prix, vérifier la rentabilité d’ensemble |
| **Coût spécifique** | Charges variables + charges fixes directes propres au produit | Juger si un produit contribue à couvrir les charges communes |
= Marge sur coût spécifique = chiffre d’affaires − (charges variables + charges fixes spécifiques)

## Exemple travaillé
Deux gammes de vélos. Gamme Ville : CA 400 000 €, charges variables 250 000 €, charges fixes spécifiques 60 000 €. Gamme Course : CA 200 000 €, charges variables 150 000 €, fixes spécifiques 70 000 €. Charges fixes communes : 50 000 €.
- Marge sur coût spécifique Ville = 400 000 − 310 000 = **90 000 €**.
- Marge sur coût spécifique Course = 200 000 − 220 000 = **− 20 000 €**.
- Résultat global = 90 000 − 20 000 − 50 000 = **20 000 €**.
La gamme Course ne couvre même pas ses propres charges : faut-il la supprimer, la relancer ou la garder pour l’image ?

!> Supprimer un produit déficitaire en coût complet peut aggraver le résultat s’il couvrait ses charges spécifiques et contribuait aux charges communes.

## Le cycle de vie
La **gestion du cycle de vie des produits** (PLM) suit un produit de sa conception à sa fin de vie : maintenir sa position concurrentielle, prévoir recyclage et déchets.`,
          },
          questions: [
            ['Qu’est-ce qu’une innovation de procédé ?', ['Un nouveau logo', 'Une méthode de production ou de distribution nouvelle ou nettement améliorée', 'Un nouveau client', 'Une augmentation de capital'], 1, 'Elle porte sur la façon de produire, pas sur le produit lui-même.'],
            ['Produire à la commande, au plus juste, avec peu de stocks, c’est travailler en…', ['Flux poussés', 'Flux tendus', 'Production à l’unité obligatoirement', 'Stock de sécurité maximal'], 1, 'Les flux tendus réduisent les stocks mais exposent aux ruptures.'],
            ['Quel est un inconvénient des flux tendus ?', ['Des stocks énormes', 'Une vulnérabilité aux ruptures d’approvisionnement', 'Une disponibilité immédiate', 'Des coûts de stockage élevés'], 1, 'Sans stock tampon, le moindre retard d’un fournisseur bloque la production.'],
            ['La roue de Deming correspond à…', ['Planifier, faire, vérifier, agir', 'Acheter, stocker, vendre, livrer', 'Recruter, former, évaluer, payer', 'Emprunter, investir, rembourser, épargner'], 0, 'C’est le cycle de l’amélioration continue.'],
            ['Une charge directe est…', ['Commune à plusieurs produits', 'Affectée sans calcul intermédiaire à un produit', 'Toujours fixe', 'Toujours une charge financière'], 1, 'Matières consommées et main-d’œuvre directe en sont les exemples types.'],
            ['Le coût spécifique d’un produit comprend…', ['Toutes les charges de l’entreprise', 'Ses charges variables et ses charges fixes directes', 'Uniquement les charges indirectes', 'Uniquement les salaires'], 1, 'Il ne répartit pas les charges fixes communes.'],
            ['CA 100 000 €, charges variables 60 000 €, fixes spécifiques 25 000 €. Marge sur coût spécifique ?', ['15 000 €', '40 000 €', '85 000 €', '− 15 000 €'], 0, '100 000 − (60 000 + 25 000) = 15 000 €.'],
            ['Un produit dont la marge sur coût spécifique est positive contribue à couvrir les charges communes.', ['Vrai', 'Faux'], 0, 'Le supprimer ferait perdre cette contribution.'],
            ['Une raffinerie fonctionne en production…', ['À l’unité', 'En continu', 'Artisanale', 'Sur devis'], 1, 'Le flux ne s’arrête pas.'],
            ['Que pilote la gestion de la chaîne logistique ?', ['Uniquement le transport final', 'L’ensemble des flux, des fournisseurs au client final', 'La paie des salariés', 'La communication publicitaire'], 1, 'Elle optimise délais, stocks et coûts sur toute la chaîne.'],
            ['Une certification ISO garantit à elle seule la satisfaction des clients.', ['Vrai', 'Faux'], 1, 'Elle atteste une démarche ; la qualité se juge au final par le client.'],
            ['Quelle est une caractéristique de la production de services ?', ['Elle se stocke facilement', 'Le client participe souvent à la production', 'Elle est toujours en continu', 'Elle n’a pas de coûts'], 1, 'Un service ne se stocke pas et implique souvent le client (coproduction).'],
          ],
        },
        {
          titre: 'Le numérique au service de la production',
          axe: 'Enseignement commun — Thème 1 : Les organisations et l’activité de production de biens et de services',
          lecon: {
            titre: 'Données, automates et nuage : la production transformée',
            cours: `Les **transformations numériques** changent la façon de produire : les documents se dématérialisent, les tâches s’automatisent, les machines communiquent, les données guident les décisions. Chance ou risque ? Les deux, selon la manière dont l’organisation s’en empare.

## Dématérialisation et automatisation des processus
- La **dématérialisation** remplace le papier par des documents numériques (factures électroniques, bons de commande, signatures).
- Le **flux de travaux** (*workflow*) automatise l’enchaînement des tâches : un document passe automatiquement d’un acteur à l’autre, avec validations et alertes.
~ Demande d’achat saisie → validation automatique si moins de 500 € → bon de commande envoyé au fournisseur → réception → facture rapprochée
- Le **progiciel de gestion intégré** (PGI) joue un rôle central : une base de données unique relie achats, production, stocks, ventes et comptabilité.

## Les nouvelles technologies intégrées
| Technologie | Usage en production |
| **Informatique en nuage** (*cloud*) | Logiciels et données accessibles partout ; produits configurés et mis à jour à distance |
| **Objets connectés** | Capteurs qui mesurent température, vibrations, niveau de stock ; maintenance **prédictive** |
| **Intelligence artificielle** | Apprentissage automatique pour prévoir la demande, détecter les défauts sur une chaîne |
| **Données ouvertes** | Données publiques réutilisées pour créer de nouveaux services (météo, trafic) |

## Représenter la circulation des informations
Le **diagramme des flux** représente les **acteurs** (internes et externes) et les **flux d’informations** qui circulent entre eux.
| Flux | De | Vers |
| 1. Commande | Client | Service commercial |
| 2. Ordre de fabrication | Service commercial | Atelier |
| 3. Bon de livraison | Atelier | Client |
| 4. Facture | Comptabilité | Client |
| 5. Règlement | Client | Comptabilité |
Il permet de repérer les ressaisies, les délais, les étapes à automatiser.

## Des algorithmes qui apprennent
Un **algorithme** est une suite d’instructions qui traite des données. Avec l’**apprentissage automatique**, un programme améliore ses performances à partir d’exemples : il apprend à reconnaître une pièce défectueuse sur des milliers de photos.

## Chance ou menace ?
| Opportunités | Risques |
| Gains de productivité, moins d’erreurs de saisie | Coût des investissements et de la formation |
| Réactivité, production plus personnalisée | Dépendance aux prestataires et aux réseaux |
| Maintenance prédictive, moins de pannes | Cyberattaques, pannes paralysantes |
| Nouveaux services | Transformation des emplois, perte de savoir-faire |

> Le numérique est une chance pour la production quand il sert un processus bien pensé ; il automatise aussi bien les erreurs que les bonnes pratiques.

## Exemple travaillé
Une fromagerie équipe ses caves de capteurs connectés (température, humidité). Les données partent vers une application en nuage ; une alerte prévient le responsable en cas d’écart, et un modèle d’IA prédit la date d’affinage optimale. Résultat : moins de pertes, qualité plus régulière. Risque : une coupure de réseau prolongée prive l’équipe de ses alertes — d’où un relevé manuel de secours.`,
          },
          questions: [
            ['Qu’est-ce qu’un workflow ?', ['Un organigramme', 'L’automatisation de l’enchaînement des tâches et de la circulation des documents', 'Un contrat de travail', 'Un réseau social'], 1, 'Le document circule automatiquement entre acteurs, avec validations et alertes.'],
            ['Des capteurs qui signalent qu’une machine va tomber en panne permettent une maintenance…', ['Curative', 'Prédictive', 'Annuelle obligatoire', 'Manuelle'], 1, 'On intervient avant la panne grâce aux données.'],
            ['Que représente un diagramme des flux ?', ['Les acteurs et les flux d’informations entre eux', 'L’évolution du chiffre d’affaires', 'Les stocks en entrepôt', 'La hiérarchie de l’entreprise'], 0, 'Il sert à analyser la circulation de l’information.'],
            ['L’apprentissage automatique permet à un programme…', ['De fonctionner sans données', 'D’améliorer ses performances à partir d’exemples', 'De remplacer l’électricité', 'De supprimer tous les emplois'], 1, 'C’est une branche de l’intelligence artificielle.'],
            ['La facture électronique est un exemple de…', ['Dématérialisation', 'Délocalisation', 'Flux poussé', 'Crédit-bail'], 0, 'Le document papier devient numérique.'],
            ['Quel est un risque des transformations numériques ?', ['Moins d’erreurs de saisie', 'Les cyberattaques', 'La maintenance prédictive', 'La réactivité'], 1, 'Un système numérique peut être attaqué ou paralysé.'],
            ['Le numérique améliore la production quelle que soit la qualité du processus automatisé.', ['Vrai', 'Faux'], 1, 'Il automatise aussi bien les erreurs que les bonnes pratiques.'],
            ['Quel outil relie achats, stocks, ventes et comptabilité autour d’une base unique ?', ['Le tableur personnel', 'Le PGI', 'La messagerie', 'Le site vitrine'], 1, 'Le progiciel de gestion intégré évite les ressaisies.'],
            ['Des données publiques de trafic réutilisées par une application de livraison sont…', ['Des données ouvertes', 'Des données confidentielles', 'Des données comptables', 'Des brevets'], 0, 'L’open data permet de créer de nouveaux services.'],
            ['L’informatique en nuage permet de configurer un produit à distance.', ['Vrai', 'Faux'], 0, 'Produits connectés mis à jour et maintenus via le cloud.'],
            ['Qu’est-ce qu’un algorithme ?', ['Une suite d’instructions qui traite des données', 'Un capteur', 'Un contrat de maintenance', 'Un type de câble'], 0, 'Tout programme repose sur des algorithmes.'],
            ['Quel avantage apporte l’analyse d’un diagramme des flux ?', ['Repérer les ressaisies et les étapes à automatiser', 'Augmenter les stocks', 'Calculer les impôts', 'Choisir un logo'], 0, 'On visualise où l’information se perd ou se répète.'],
          ],
        },
        {
          titre: 'Coordonner le travail',
          axe: 'Enseignement commun — Thème 1 : Les organisations et l’activité de production de biens et de services',
          lecon: {
            titre: 'Diviser le travail, puis le rassembler',
            cours: `Dès qu’une organisation grandit, elle **divise** le travail en tâches et en services. Il faut ensuite le **coordonner** pour que l’ensemble reste cohérent. Comment assurer un fonctionnement cohérent ? C’est la question de l’**organisation du travail** et des **mécanismes de coordination**.

## Spécialisation ou polyvalence ?
| | Organisation **rigide** | Organisation **souple** |
| Tâches | Parcellisées, répétitives | Enrichies, variées |
| Salarié | **Spécialisé** | **Polyvalent**, autonome |
| Atout | Productivité sur des séries stables | **Flexibilité**, **réactivité** |
| Limite | Monotonie, faible adaptation | Formation plus longue |

## Deux modèles historiques
@ 1911 — Frederick W. Taylor publie *Les principes du management scientifique* : l’organisation scientifique du travail (OST)
@ 1950-1970 — Taiichi Ōno développe chez Toyota le système de production qui deviendra le toyotisme
- Le **taylorisme** : séparer conception et exécution, décomposer le travail en gestes simples, chronométrer, payer au rendement. Productivité élevée, mais travail monotone et peu d’initiative.
- Le **toyotisme** : production en **juste-à-temps** (flux tendus), **qualité totale**, ouvriers **polyvalents** en équipes, droit d’arrêter la chaîne en cas de défaut, amélioration continue.

## Les mécanismes de coordination (Mintzberg)
Henry Mintzberg distingue plusieurs façons de coordonner le travail :
| Mécanisme | Principe | Exemple |
| **Ajustement mutuel** | Communication informelle entre les personnes | Une petite start-up, une équipe de chirurgie |
| **Supervision directe** | Une personne donne des ordres et contrôle | Le chef d’un petit commerce |
| **Standardisation des procédés** | Des règles et procédures fixent le travail | Une chaîne de restauration rapide |
| **Standardisation des résultats** | On fixe l’objectif, pas la méthode | Un commercial avec un objectif de ventes |
| **Standardisation des qualifications** | La formation garantit la coordination | Des médecins, des enseignants |
| **Standardisation des normes** | Des valeurs partagées guident chacun | Une ONG militante |
Le programme y ajoute la **coordination par automatisation des procédures** (le logiciel impose l’enchaînement).

## Ligne hiérarchique, centralisation, délégation
- La **ligne hiérarchique** relie le sommet aux opérationnels ; elle peut être longue (nombreux niveaux) ou courte.
- La **centralisation** concentre les décisions au sommet ; la **décentralisation** les diffuse vers les niveaux inférieurs, avec **délégation** du pouvoir de décision, autonomie et responsabilité.
- La délégation s’accompagne d’un **reporting** : l’échelon délégué rend compte de ses résultats.

## Le lean management
Le **lean management** (inspiré du toyotisme) chasse tout ce qui n’apporte pas de valeur au client : attentes, stocks inutiles, déplacements, défauts. Bien mené, il améliore l’efficacité ; mal mené, il intensifie le travail et dégrade la **performance sociale**.

> Plus l’environnement est incertain, plus l’organisation a besoin de coordination souple (ajustement mutuel, délégation) plutôt que de procédures rigides.

## Exemple travaillé
Une pizzeria devient une chaîne de 40 restaurants. Au début : **ajustement mutuel** entre trois associés. Avec 5 restaurants : **supervision directe** par le fondateur. À 40 : **standardisation des procédés** (recettes, fiches techniques), **des résultats** (chaque gérant a des objectifs de chiffre d’affaires) et **délégation** aux gérants, avec reporting mensuel. La croissance de l’activité a imposé la **différenciation** des tâches, puis de nouveaux modes de coordination.`,
          },
          questions: [
            ['Quel auteur est associé à l’organisation scientifique du travail ?', ['Taiichi Ōno', 'Frederick W. Taylor', 'Henry Mintzberg', 'Mary Parker Follett'], 1, 'Taylor sépare conception et exécution et décompose le travail en gestes simples.'],
            ['Le toyotisme repose notamment sur…', ['Le travail parcellisé et la production de masse sur stock', 'Le juste-à-temps, la qualité totale et la polyvalence', 'L’absence de qualité', 'La suppression des équipes'], 1, 'Taiichi Ōno l’a développé chez Toyota.'],
            ['Dans une petite équipe qui se coordonne en se parlant, quel mécanisme joue ?', ['L’ajustement mutuel', 'La standardisation des procédés', 'La supervision directe', 'La standardisation des qualifications'], 0, 'La communication informelle suffit dans les petites structures ou les situations complexes.'],
            ['Des recettes et fiches techniques identiques dans tous les restaurants d’une chaîne relèvent de…', ['La standardisation des procédés', 'L’ajustement mutuel', 'La standardisation des normes', 'La supervision directe'], 0, 'Le travail est fixé par des procédures.'],
            ['Fixer un objectif de ventes à un commercial sans imposer sa méthode, c’est…', ['La standardisation des résultats', 'La supervision directe', 'La centralisation', 'L’ajustement mutuel'], 0, 'On coordonne par les résultats attendus.'],
            ['La décentralisation consiste à…', ['Concentrer toutes les décisions au sommet', 'Diffuser le pouvoir de décision vers les niveaux inférieurs', 'Supprimer la hiérarchie', 'Externaliser la production'], 1, 'Elle donne autonomie et responsabilité aux échelons délégués.'],
            ['Qu’est-ce que le reporting ?', ['Un rapport par lequel l’échelon délégué rend compte de ses résultats', 'Un contrat de travail', 'Une publicité', 'Un impôt'], 0, 'Il accompagne la délégation.'],
            ['Le lean management vise à…', ['Augmenter les stocks', 'Éliminer ce qui n’apporte pas de valeur au client', 'Allonger la ligne hiérarchique', 'Supprimer la qualité'], 1, 'Attentes, stocks inutiles, défauts sont des gaspillages à réduire.'],
            ['Le lean management améliore toujours la performance sociale.', ['Vrai', 'Faux'], 1, 'Mal mené, il intensifie le travail et dégrade les conditions de travail.'],
            ['Des médecins qui se coordonnent grâce à leur formation commune illustrent…', ['La standardisation des qualifications', 'La supervision directe', 'La standardisation des résultats', 'L’automatisation'], 0, 'La formation garantit des pratiques compatibles.'],
            ['Dans un environnement incertain, quelle coordination est la plus adaptée ?', ['Des procédures rigides', 'Une coordination souple : ajustement mutuel, délégation', 'Aucune coordination', 'La seule supervision directe du dirigeant'], 1, 'Il faut pouvoir réagir vite aux imprévus.'],
            ['Un salarié polyvalent est surtout un atout pour…', ['La flexibilité', 'La monotonie', 'La parcellisation', 'L’allongement des délais'], 0, 'Il peut passer d’une tâche à l’autre selon les besoins.'],
          ],
        },

        // ---- Enseignement commun — Thème 2 ---------------------------------
        {
          titre: 'Fédérer les acteurs de l’organisation',
          axe: 'Enseignement commun — Thème 2 : Les organisations et les acteurs',
          lecon: {
            titre: 'Faire avancer ensemble des gens qui ne veulent pas la même chose',
            cours: `Salariés, actionnaires, bénévoles, fonctionnaires : les acteurs internes d’une organisation ont des **intérêts** parfois **convergents** (que l’organisation réussisse), parfois **divergents** (salaires contre dividendes). Le management doit les **fédérer** autour d’objectifs communs.

## Intérêts et attentes des acteurs internes
| Acteur | Attentes |
| **Salariés** | Rémunération, sécurité de l’emploi, conditions de travail, reconnaissance |
| **Actionnaires, associés** | Rentabilité, dividendes, valeur de leurs titres |
| **Dirigeants** | Pouvoir, réussite, rémunération |
| **Bénévoles** | Sens de l’action, lien social |
| **Fonctionnaires** | Mission de service public, statut, carrière |

## La culture de l’organisation
La **culture** (valeurs, normes, rites, symboles, histoire) assure la **cohésion** et favorise l’**implication** : on se sent membre d’un collectif.

## Les styles de direction
| Style | Caractéristiques | Limite |
| **Autoritaire** | Le dirigeant décide seul et impose | Peu d’implication, résistance |
| **Paternaliste** | Il décide seul mais se soucie du bien-être des salariés | Dépendance, infantilisation |
| **Consultatif** | Il consulte avant de décider seul | Déception si l’avis n’est pas suivi |
| **Participatif** | Les décisions sont prises avec les salariés | Lenteur des décisions |
Aucun style n’est idéal : il dépend du **type d’organisation**, de sa **culture**, de son **environnement** et de la **personnalité** des dirigeants.

## Dynamique de groupe
Le travail en groupe ne garantit ni l’efficacité ni la cohésion. Tout dépend de la **dynamique** : le **leadership** (qui entraîne ?), la **cohésion** (le groupe se sent-il uni ?), la **décision de groupe** (vote, consensus, décision du responsable).

## La coopération
La coopération **ne se décrète pas**. On la favorise par des dispositifs : **groupes de projet**, **réunions** efficaces, **techniques de créativité** (remue-méninges), **outils collaboratifs**, **réseaux sociaux d’entreprise**, **communautés de pratiques** (des salariés qui partagent leur savoir-faire).

## Motivation et implication
La **motivation** vient de facteurs **internes** (intérêt du travail, besoin d’accomplissement) et **externes** (salaire, reconnaissance, conditions de travail).
Les dispositifs qui la favorisent : cadre et conditions de travail, **rémunération**, **communication interne**, contenu du travail, **qualité de vie au travail** (QVT : conditions de travail, prévention des risques, dont les **risques psychosociaux**, hygiène, sécurité).

> Fédérer, c’est donner à chacun une raison personnelle de servir l’objectif commun.

## Exemple travaillé
Une entreprise de logiciels peine à retenir ses développeurs. Diagnostic : style **autoritaire** du fondateur, peu d’autonomie. Mesures : passage à un style plus **participatif** (les équipes choisissent leurs outils), **groupes de projet** transverses, **communauté de pratiques** interne, télétravail partiel pour la QVT, **intéressement** aux résultats. Les départs diminuent de moitié en un an.`,
          },
          questions: [
            ['Quelle attente est typique des actionnaires ?', ['La rentabilité de leurs titres', 'Le sens de l’action bénévole', 'La sécurité du statut de fonctionnaire', 'La réduction du temps de travail'], 0, 'Ils ont apporté des capitaux et en attendent une rémunération.'],
            ['Un dirigeant qui décide seul tout en se souciant du bien-être de ses salariés adopte un style…', ['Participatif', 'Paternaliste', 'Consultatif', 'Laisser-faire'], 1, 'Il protège, mais garde toutes les décisions.'],
            ['Quelle est la limite du style participatif ?', ['L’absence d’implication', 'La lenteur des décisions', 'La résistance systématique', 'L’infantilisation'], 1, 'Associer tout le monde prend du temps.'],
            ['Existe-t-il un style de direction idéal ?', ['Oui, toujours le participatif', 'Oui, toujours l’autoritaire', 'Non, il dépend du contexte, de la culture et des personnes', 'Oui, le paternaliste'], 2, 'Le style doit être adapté à l’organisation et à la situation.'],
            ['Le travail en groupe garantit à lui seul l’efficacité et la cohésion.', ['Vrai', 'Faux'], 1, 'Tout dépend de la dynamique : leadership, cohésion, mode de décision.'],
            ['Une communauté de pratiques est…', ['Un groupe de salariés qui partagent leur savoir-faire sur un métier', 'Un syndicat', 'Un comité de direction', 'Un fichier clients'], 0, 'C’est un mode d’action coopératif.'],
            ['L’intérêt du travail est un facteur de motivation…', ['Externe', 'Interne', 'Juridique', 'Financier'], 1, 'Il vient de l’individu lui-même.'],
            ['Que recouvre la qualité de vie au travail ?', ['Uniquement le salaire', 'Conditions de travail, prévention des risques, hygiène, sécurité', 'Les dividendes', 'Le chiffre d’affaires'], 1, 'C’est un déterminant du bien-être et de la performance.'],
            ['À quoi sert la culture d’organisation ?', ['À assurer la cohésion autour de valeurs partagées', 'À calculer les coûts', 'À fixer les prix', 'À gérer les stocks'], 0, 'Elle favorise l’implication des membres.'],
            ['Le remue-méninges (brainstorming) est une technique…', ['De créativité', 'Comptable', 'De recrutement', 'Juridique'], 0, 'Elle favorise la production collective d’idées.'],
            ['Les intérêts des salariés et des actionnaires peuvent diverger.', ['Vrai', 'Faux'], 0, 'Salaires et dividendes se partagent la même valeur ajoutée.'],
            ['Un dirigeant qui recueille l’avis de ses équipes puis décide seul adopte un style…', ['Consultatif', 'Autoritaire', 'Participatif', 'Paternaliste'], 0, 'Il consulte sans partager la décision.'],
          ],
        },
        {
          titre: 'Le numérique et la relation avec les clients et les usagers',
          axe: 'Enseignement commun — Thème 2 : Les organisations et les acteurs',
          lecon: {
            titre: 'Un client connecté, mieux connu — et plus exigeant',
            cours: `La révolution numérique a mis le **consommateur au cœur** du processus d’achat. Il compare, lit les avis, commande en ligne, donne son opinion publiquement. Les organisations, elles, récoltent une masse de données sur lui. La relation s’en trouve transformée.

## Consommateur, client, usager
- Le **consommateur** utilise le produit ; le **client** l’achète (ce n’est pas toujours la même personne : un parent achète un jouet pour son enfant).
- L’**usager** bénéficie d’un service public.

## Le processus d’achat
1. **Prise de conscience** du besoin.
2. **Recherche d’informations** (sites, comparateurs, avis, réseaux sociaux).
3. **Évaluation** des solutions.
4. **Décision** d’achat.
5. **Comportement après l’achat** : satisfaction, avis, réachat ou réclamation.

## Les facteurs explicatifs du comportement
| Facteur | Définition | Exemple |
| **Besoin** | Sensation de manque | Se déplacer |
| **Motivation** | Force qui pousse à acheter (hédoniste, oblative, d’auto-expression) | Se faire plaisir, faire plaisir, affirmer son style |
| **Frein** | Force qui retient (peur, inhibition, prix) | Peur d’une arnaque en ligne |
| **Attitude** | Opinion favorable ou défavorable envers une marque | Méfiance envers les produits ultra-transformés |
Le comportement dépend aussi de facteurs **sociaux** (famille, groupes, influenceurs) et **culturels**.

## La digitalisation de la relation client
- **Connaissance client** : historique d’achats, navigation, préférences → offres personnalisées.
- **Interactivité** : échanges en temps réel (messagerie, agent conversationnel, réseaux sociaux).
- **Outils** : logiciel de gestion de la relation client (CRM), application mobile, programme de fidélité, notifications.
- **Traces numériques** : données laissées par l’internaute (cookies, historique, publications) ; leur exploitation est encadrée par le **RGPD** (consentement aux cookies, droits d’accès et d’opposition).
Les **réseaux sociaux grand public** sont à la fois un canal de communication, de service client et… de critique.

## L’administration électronique
Les administrations utilisent le numérique pour :
1. **faciliter l’accès** aux documents administratifs (droit reconnu par la loi de 1978) ;
2. **simplifier les démarches** (déclaration de revenus, carte grise, inscription en ligne) ;
3. **améliorer leurs processus** et leurs échanges entre elles (« dites-le nous une fois »).
Limite : la **fracture numérique** — une partie de la population n’a pas l’équipement ou la maîtrise des outils ; il faut maintenir un accueil humain.

> La relation client digitale n’est un progrès que si elle rend service au client ; sinon, elle ne fait que déplacer le travail vers lui.

## Exemple travaillé
Une enseigne de sport analyse les traces de navigation d’une cliente (course à pied, taille 38) et lui envoie une offre sur des chaussures de trail, avec son consentement aux communications. Après l’achat, elle reçoit un conseil d’entraînement et une invitation à noter le produit. Le processus d’achat est **accompagné** à chaque étape — à condition que la cliente ne se sente pas **surveillée**.`,
          },
          questions: [
            ['Quelle différence entre client et consommateur ?', ['Aucune', 'Le client achète, le consommateur utilise le produit', 'Le consommateur achète, le client utilise', 'Le client est toujours une entreprise'], 1, 'Un parent (client) achète un jouet pour son enfant (consommateur).'],
            ['Quelle est l’étape du processus d’achat où l’on compare avis et prix ?', ['La prise de conscience du besoin', 'La recherche d’informations', 'Le comportement après l’achat', 'La livraison'], 1, 'Comparateurs, avis et réseaux sociaux y jouent un rôle clé.'],
            ['La peur d’une arnaque sur un site inconnu est…', ['Une motivation', 'Un frein', 'Un besoin', 'Une attitude favorable'], 1, 'Le frein retient l’achat.'],
            ['Faire un cadeau pour faire plaisir à quelqu’un relève d’une motivation…', ['Hédoniste', 'Oblative', 'D’auto-expression', 'Financière'], 1, 'La motivation oblative est tournée vers autrui.'],
            ['Les cookies et l’historique de navigation sont des…', ['Traces numériques', 'Données ouvertes', 'Brevets', 'Pièces comptables'], 0, 'Leur exploitation est encadrée par le RGPD.'],
            ['Quel texte encadre l’exploitation des données personnelles des clients ?', ['Le RGPD', 'Le Code de la route', 'La loi de finances', 'La convention collective'], 0, 'Consentement, finalité, droits des personnes.'],
            ['Un logiciel de gestion de la relation client s’appelle un…', ['PGI', 'CRM', 'SQL', 'VPN'], 1, 'Customer Relationship Management.'],
            ['Quel droit la loi de 1978 reconnaît-elle aux usagers ?', ['Le droit d’accès aux documents administratifs', 'Le droit de ne pas payer d’impôts', 'Le droit de grève', 'Le droit d’auteur'], 0, 'L’administration électronique facilite l’exercice de ce droit.'],
            ['La fracture numérique n’est plus un problème pour l’administration.', ['Vrai', 'Faux'], 1, 'Une partie de la population manque d’équipement ou de maîtrise : il faut garder un accueil humain.'],
            ['Que permet la connaissance client issue des données ?', ['Des offres personnalisées', 'La suppression des stocks', 'L’augmentation automatique des prix', 'La fin de toute publicité'], 0, 'Historique et préférences permettent de cibler l’offre.'],
            ['Le comportement du consommateur dépend aussi de facteurs sociaux comme la famille ou les influenceurs.', ['Vrai', 'Faux'], 0, 'Les groupes de référence orientent les choix.'],
            ['Quel est un risque d’une personnalisation excessive ?', ['Que le client se sente surveillé', 'Que les prix baissent', 'Que les stocks disparaissent', 'Que la TVA augmente'], 0, 'La frontière entre service et intrusion doit être respectée.'],
          ],
        },
        {
          titre: 'Communiquer avec tous les acteurs',
          axe: 'Enseignement commun — Thème 2 : Les organisations et les acteurs',
          lecon: {
            titre: 'Un même message, des publics différents',
            cours: `Une organisation parle à ses salariés, à ses clients, à ses actionnaires, à ses banques, aux pouvoirs publics. Elle ne leur dit pas les mêmes choses de la même façon — mais elle doit rester **cohérente**. La communication est devenue **stratégique**.

## Pourquoi communiquer ?
La communication vise :
- à développer la **participation** et l’**adhésion** du personnel aux objectifs ;
- à renforcer l’**image** de l’organisation.
Elle aide à la **prise de décision**, **coordonne** l’action, contribue au **dialogue social**.

## La stratégie de communication
Elle repose sur le triptyque **cible / message / support** :
1. **Cible** : à qui parle-t-on ?
2. **Message** : que veut-on dire (informer, convaincre, faire agir) ?
3. **Support** : par quel média (affiche, site, réseau social, réunion, lettre) ?
Elle fixe aussi des **objectifs**, un **budget** et des **indicateurs** d’efficacité.

## Interne, externe, globale
| | Communication **interne** | Communication **externe** |
| Cible | Salariés, bénévoles, agents | Clients, fournisseurs, banques, collectivités, associations, grand public |
| Formes | **Descendante** (direction → salariés), **ascendante** (salariés → direction), **horizontale** (entre collègues) | **Commerciale** (vendre un produit), **institutionnelle** (valoriser l’image de l’organisation) |
| Outils | Intranet, réunions, journal interne, réseau social d’entreprise | Publicité, relations presse, site, réseaux sociaux, salons |
La **communication globale** (ou intégrée) harmonise interne et externe : les salariés sont aussi des citoyens et des consommateurs ; ce qui est dit dehors doit être vrai dedans.

## L’identité de l’organisation
- **Marque employeur** : l’image de l’organisation en tant qu’employeur, pour attirer et retenir les talents.
- **E-réputation** : l’image qui se construit en ligne (avis, commentaires, articles), en partie hors de son contrôle.
- **Identité numérique** : l’ensemble de sa présence en ligne (site, comptes, contenus).

## La communication financière
Les partenaires ont besoin d’informations financières : **actionnaires** et **investisseurs** (rentabilité, perspectives), **banques** (solvabilité), **salariés** (santé de l’entreprise), **État** (impôts). L’exigence de **transparence** a rendu cette communication stratégique ; elle repose sur des **règles comptables normalisées** qui rendent les comptes comparables et fiables.
Le **plan d’affaires** (*business plan*) présente un projet (marché, stratégie, prévisions financières) pour convaincre des financeurs.

> La communication ne fabrique pas une image : elle la révèle. Un décalage entre discours et réalité se paie cher en ligne.

## Exemple travaillé
Une entreprise de transport lance une nouvelle ligne de car électrique.
| Cible | Message | Support |
| Salariés | « Vous serez formés à la conduite électrique » | Réunion, intranet |
| Voyageurs | « Plus silencieux, zéro émission à l’échappement » | Affiches, réseaux sociaux |
| Banque | « Rentable en six ans » | Plan d’affaires |
| Collectivité | « Un service pour les communes rurales » | Rencontre avec les élus |
Quatre messages, une seule cohérence : la transition écologique rentable.`,
          },
          questions: [
            ['Quel est le triptyque de base d’une stratégie de communication ?', ['Prix, produit, place', 'Cible, message, support', 'Actif, passif, résultat', 'Émetteur, bruit, code'], 1, 'On décide à qui parler, quoi dire et par quel média.'],
            ['Une note de la direction à tous les salariés est une communication…', ['Ascendante', 'Descendante', 'Horizontale', 'Commerciale'], 1, 'Elle va de la direction vers le personnel.'],
            ['Une boîte à idées où les salariés font remonter leurs propositions illustre une communication…', ['Descendante', 'Ascendante', 'Institutionnelle', 'Financière'], 1, 'Elle va des salariés vers la direction.'],
            ['Une campagne qui valorise l’engagement environnemental d’une entreprise, sans vendre un produit, est une communication…', ['Commerciale', 'Institutionnelle', 'Interne', 'Financière'], 1, 'Elle travaille l’image de l’organisation elle-même.'],
            ['Qu’est-ce que la marque employeur ?', ['Le logo imprimé sur les produits', 'L’image de l’organisation en tant qu’employeur', 'Le nom du dirigeant', 'Un brevet'], 1, 'Elle sert à attirer et retenir les talents.'],
            ['L’e-réputation est entièrement contrôlée par l’organisation.', ['Vrai', 'Faux'], 1, 'Avis et commentaires lui échappent en partie.'],
            ['À qui s’adresse principalement le plan d’affaires ?', ['Aux financeurs', 'Aux clients', 'Aux concurrents', 'Aux élèves'], 0, 'Il présente marché, stratégie et prévisions pour convaincre.'],
            ['Pourquoi la communication financière repose-t-elle sur des règles comptables normalisées ?', ['Pour rendre les comptes comparables et fiables', 'Pour cacher les résultats', 'Pour réduire les impôts', 'Pour éviter la transparence'], 0, 'La normalisation garantit des échanges rapides et fiables.'],
            ['Que vise la communication globale ?', ['À harmoniser communication interne et externe', 'À supprimer la communication interne', 'À ne parler qu’aux actionnaires', 'À multiplier les messages contradictoires'], 0, 'Ce qui est dit dehors doit être vrai dedans.'],
            ['Une banque attend surtout de la communication financière des informations sur…', ['La solvabilité de l’entreprise', 'La couleur du logo', 'Le menu de la cantine', 'Les horaires d’ouverture'], 0, 'Elle veut savoir si l’entreprise pourra rembourser.'],
            ['La communication contribue au dialogue social.', ['Vrai', 'Faux'], 0, 'Elle informe, coordonne et facilite les échanges avec les représentants du personnel.'],
            ['Des échanges entre collègues d’un même niveau constituent une communication…', ['Horizontale', 'Descendante', 'Ascendante', 'Externe'], 0, 'Elle facilite la coordination au quotidien.'],
          ],
        },

        // ---- Enseignement commun — Thème 3 ---------------------------------
        {
          titre: 'L’éthique des organisations',
          axe: 'Enseignement commun — Thème 3 : Les organisations et la société',
          lecon: {
            titre: 'Bien agir, et le prouver',
            cours: `Scandales de corruption, comptes truqués, discriminations à l’embauche : les grandes affaires ont montré qu’une organisation ne peut pas **s’affranchir des questions de société**. L’**éthique** est devenue un enjeu de management — et de survie.

## Éthique et déontologie
| Notion | Définition | Exemple |
| **Éthique** | Réflexion sur ce qui est **bien** ou **mal** dans l’action, au-delà de la loi | Refuser un marché obtenu par un pot-de-vin, même indétectable |
| **Déontologie** | Ensemble des **règles** et **devoirs** propres à une profession | Le secret médical, le secret professionnel de l’avocat |
L’organisation formalise souvent ses engagements dans une **charte éthique** ou un **code de conduite**.

## Pourquoi l’éthique s’impose
Les **parties prenantes** (clients, salariés, investisseurs, ONG, pouvoirs publics) exigent des comportements responsables. Un manquement se paie : sanctions, boycott, départs de salariés, perte de confiance des financeurs. La loi a aussi renforcé les obligations (lutte contre la corruption, devoir de vigilance des grandes entreprises sur leurs sous-traitants, protection des lanceurs d’alerte).

## L’éthique dans les affaires
Elle concerne :
- la **loyauté** envers clients, fournisseurs et concurrents ;
- la lutte contre la **corruption** et les **conflits d’intérêts** ;
- la **sincérité** des discours : le **lobbying** (défendre ses intérêts auprès des décideurs) est légal mais doit être transparent ; le **greenwashing** (se dire écologique sans l’être) et le **social washing** (afficher un engagement social de façade) trahissent la confiance.

## L’éthique dans tous les types d’organisations
Les **ONG**, les administrations et les **collectivités territoriales** sont aussi concernées : bon usage des dons et de l’argent public, impartialité, transparence des décisions.

## Une information financière fiable
La **normalisation comptable** (règles communes de présentation des comptes) et le contrôle des **commissaires aux comptes** garantissent une information sincère. La **transparence** des pratiques est une exigence éthique : des comptes truqués trompent actionnaires, salariés et prêteurs.

## Lutter contre les discriminations
Une **discrimination** est une différence de traitement fondée sur un critère interdit par la loi (origine, sexe, âge, handicap, orientation sexuelle, religion, apparence, lieu de résidence…).
Pour l’**égalité femmes-hommes**, les entreprises d’au moins 50 salariés calculent et publient chaque année un **index de l’égalité professionnelle** ; un index trop faible oblige à des mesures correctrices, sous peine de pénalité.
Autres leviers : CV examinés sans nom, formation des recruteurs, objectifs de mixité.

> L’éthique n’est pas qu’une affaire de morale individuelle : c’est une condition de la confiance, donc de la performance durable.

## Exemple travaillé
Une marque de cosmétiques affiche « 100 % naturel » alors que ses produits contiennent 40 % d’ingrédients de synthèse.
- **Problème éthique** : greenwashing, tromperie du consommateur.
- **Parties prenantes lésées** : clients, concurrents honnêtes.
- **Risques** : sanction pour pratique commerciale trompeuse, bad buzz, perte de confiance.
- **Réponse éthique** : étiquetage exact, labels contrôlés par un tiers, communication sur les progrès réels.`,
          },
          questions: [
            ['Quelle est la différence entre éthique et déontologie ?', ['Aucune', 'L’éthique est une réflexion sur le bien et le mal ; la déontologie, les devoirs propres à une profession', 'La déontologie est facultative, l’éthique obligatoire', 'L’éthique concerne seulement les médecins'], 1, 'Le secret médical relève de la déontologie médicale.'],
            ['Se présenter comme écologique sans l’être vraiment, c’est…', ['Du lobbying', 'Du greenwashing', 'Du mécénat', 'De la normalisation'], 1, 'C’est une communication trompeuse sur l’engagement environnemental.'],
            ['Le lobbying est illégal en France.', ['Vrai', 'Faux'], 1, 'Il est légal mais doit être transparent ; il soulève des questions éthiques quand sa sincérité est douteuse.'],
            ['Quelle entreprise doit publier un index de l’égalité professionnelle femmes-hommes ?', ['Toute entreprise d’au moins 50 salariés', 'Uniquement les entreprises cotées', 'Uniquement les associations', 'Aucune'], 0, 'Un index insuffisant oblige à des mesures correctrices.'],
            ['Une discrimination est une différence de traitement fondée sur…', ['Les compétences', 'Un critère interdit par la loi', 'L’ancienneté prévue par la convention collective', 'Les résultats obtenus'], 1, 'Origine, sexe, âge, handicap, religion… sont des critères interdits.'],
            ['Qui certifie la sincérité des comptes d’une société ?', ['Le commissaire aux comptes', 'Le directeur marketing', 'Le client principal', 'Le syndicat'], 0, 'C’est un contrôle indépendant de l’information financière.'],
            ['Afficher un engagement social de façade s’appelle…', ['Le social washing', 'Le dialogue social', 'La marque employeur', 'L’intéressement'], 0, 'Comme le greenwashing, il trahit la confiance des parties prenantes.'],
            ['Pourquoi l’éthique est-elle aussi un enjeu de performance ?', ['Parce qu’un manquement entraîne sanctions, boycott et perte de confiance', 'Parce qu’elle augmente les impôts', 'Parce qu’elle supprime la concurrence', 'Elle n’a aucun lien avec la performance'], 0, 'La confiance est une ressource précieuse.'],
            ['Les ONG et les collectivités ne sont pas concernées par l’éthique.', ['Vrai', 'Faux'], 1, 'Bon usage des dons et de l’argent public, impartialité et transparence les concernent aussi.'],
            ['Que formalise une charte éthique ?', ['Les engagements de conduite de l’organisation', 'Le bilan comptable', 'Les prix de vente', 'Le planning de production'], 0, 'Elle guide les comportements attendus.'],
            ['Quel est un levier de lutte contre les discriminations à l’embauche ?', ['Examiner des CV sans nom et former les recruteurs', 'Demander la religion du candidat', 'Recruter uniquement par cooptation', 'Supprimer les entretiens'], 0, 'On limite ainsi les biais.'],
            ['La normalisation comptable sert à…', ['Présenter les comptes selon des règles communes, comparables et fiables', 'Cacher les pertes', 'Fixer les salaires', 'Choisir les fournisseurs'], 0, 'Elle rend l’information financière transparente.'],
          ],
        },
        {
          titre: 'Modes de vie et numérique : de nouvelles responsabilités',
          axe: 'Enseignement commun — Thème 3 : Les organisations et la société',
          lecon: {
            titre: 'Une société qui change, des organisations qui doivent suivre',
            cours: `Télétravail, consommation à la demande, vie hyperconnectée, données partout : les **modes de vie** changent, et les **transformations numériques** donnent aux organisations de nouveaux pouvoirs — donc de nouvelles **responsabilités**.

## Les organisations et la vie civique
Au-delà de ses propres buts, une organisation peut intégrer des préoccupations **civiques** :
- le **mécénat** : soutien financier ou en nature à une œuvre d’intérêt général (culture, recherche, solidarité), qui ouvre droit à une réduction d’impôt ;
- la **démocratie participative** en son sein : consultation des salariés, budgets participatifs, gouvernance partagée ;
- l’attention aux **évolutions des comportements** de ses parties prenantes.

## Le rapport au travail change
| Évolution | Réponse des organisations |
| **Temps** : envie d’équilibre vie privée / vie professionnelle | Horaires flexibles, semaine en quatre jours dans certaines entreprises |
| **Lieu** : essor du **télétravail** | Accords de télétravail, équipements, espaces de travail partagés |
| **Mode d’organisation** : rapport différent à la hiérarchie, travail indépendant | Management par objectifs, recours aux indépendants |
| **Vie connectée** : sollicitations permanentes | **Droit à la déconnexion** (inscrit dans le Code du travail depuis 2017) |

## Les modes de consommation changent
- **Plateformes d’intermédiation** (location entre particuliers, livraison).
- **Consommation à la demande** (streaming, livraison rapide).
- **Économie de la fonctionnalité** : vendre l’**usage** plutôt que le bien (louer des pneus au kilomètre, un abonnement vélo).
- **Économie collaborative** : partage entre particuliers (covoiturage).
- **Seconde main** et réparation.
- **Objets connectés** et **hyperconnectivité**.

## Les responsabilités numériques
1. **Protéger les données personnelles** : le **RGPD** impose finalité, consentement, minimisation, sécurité, droits des personnes, et des sanctions lourdes (jusqu’à 4 % du chiffre d’affaires mondial).
2. **Protéger les données stratégiques** (secrets de fabrication, fichiers clients, plans) : c’est un **patrimoine** exposé aux cyberattaques et à l’espionnage.
3. **Transparence des algorithmes** : une administration qui prend une décision individuelle fondée sur un traitement algorithmique doit en informer la personne et pouvoir lui expliquer les règles utilisées.
4. **La chaîne de blocs** (*blockchain*) : un registre numérique **partagé** et **infalsifiable**, qui sécurise des échanges sans tiers de confiance central (traçabilité des produits, certification de diplômes, contrats automatisés).

> Plus une organisation collecte de données et automatise ses décisions, plus elle doit rendre des comptes sur l’usage qu’elle en fait.

## Exemple travaillé
Une mutuelle lance une application qui récompense les assurés qui marchent 10 000 pas par jour.
- **Changement de mode de vie** : santé connectée, objets connectés.
- **Responsabilités** : données de santé (sensibles au sens du RGPD) → consentement explicite, sécurité renforcée, interdiction de s’en servir pour sélectionner les assurés ; transparence sur l’algorithme de calcul des récompenses.
- **Risque** : si les données fuient ou servent à augmenter les tarifs, la confiance s’effondre.`,
          },
          questions: [
            ['Qu’est-ce que le mécénat ?', ['Un soutien financier ou en nature à une œuvre d’intérêt général', 'Un contrat de travail', 'Un impôt sur les bénéfices', 'Une forme de publicité comparative'], 0, 'Il ouvre droit à une réduction d’impôt.'],
            ['Depuis quand le droit à la déconnexion figure-t-il dans le Code du travail ?', ['1936', '1982', '2017', '2030'], 2, 'Il vise à protéger les salariés des sollicitations permanentes.'],
            ['Louer des pneus au kilomètre plutôt que les vendre relève de…', ['L’économie de la fonctionnalité', 'La production en continu', 'Le crédit-bail', 'La publicité'], 0, 'On vend l’usage plutôt que le bien.'],
            ['Le covoiturage entre particuliers est un exemple d’économie…', ['Collaborative', 'Souterraine', 'Planifiée', 'Publique'], 0, 'Des particuliers partagent une ressource.'],
            ['Jusqu’à quel montant peuvent aller les sanctions prévues par le RGPD ?', ['100 €', '4 % du chiffre d’affaires mondial', '1 % du capital social', 'Aucune sanction n’est prévue'], 1, 'Ou 20 millions d’euros, le montant le plus élevé étant retenu.'],
            ['Les données stratégiques d’une organisation constituent…', ['Un patrimoine à protéger', 'Des données ouvertes', 'Des informations sans valeur', 'Des données personnelles uniquement'], 0, 'Secrets de fabrication et fichiers clients sont exposés aux cyberattaques.'],
            ['Qu’est-ce qu’une chaîne de blocs (blockchain) ?', ['Un registre numérique partagé et infalsifiable', 'Une chaîne de montage', 'Un réseau de franchises', 'Un logiciel de traitement de texte'], 0, 'Elle sécurise des échanges sans tiers de confiance central.'],
            ['Une administration peut prendre une décision individuelle par algorithme sans jamais en expliquer les règles.', ['Vrai', 'Faux'], 1, 'La transparence des algorithmes publics est une obligation.'],
            ['Les données de santé sont, au sens du RGPD, des données…', ['Ouvertes', 'Sensibles', 'Anonymes par nature', 'Commerciales'], 1, 'Elles bénéficient d’une protection renforcée.'],
            ['La démocratie participative dans une organisation consiste à…', ['Consulter et associer les membres aux décisions', 'Supprimer la direction', 'Voter les impôts', 'Imposer des décisions'], 0, 'Budgets participatifs, consultations, gouvernance partagée.'],
            ['Le télétravail illustre un changement du rapport au travail concernant…', ['Le lieu', 'Le salaire minimum', 'La TVA', 'Le capital social'], 0, 'Le travail se détache du lieu physique de l’entreprise.'],
            ['Plus une organisation automatise ses décisions, moins elle doit rendre de comptes.', ['Vrai', 'Faux'], 1, 'C’est l’inverse : ses responsabilités augmentent.'],
          ],
        },
        {
          titre: 'Les organisations et leur écosystème',
          axe: 'Enseignement commun — Thème 3 : Les organisations et la société',
          lecon: {
            titre: 'S’implanter quelque part, et le transformer',
            cours: `Une organisation n’est pas posée n’importe où. Elle choisit un **territoire** qui lui fournit des ressources, et elle le transforme en retour : emplois, infrastructures, vie culturelle. Elle vit dans un **écosystème** d’acteurs avec lesquels elle coopère et rivalise.

## La stratégie d’implantation
Les critères d’un choix d’implantation :
| Critère | Exemples |
| **Ressources humaines** | Main-d’œuvre qualifiée, écoles, universités |
| **Financières et fiscales** | Aides locales, fiscalité, coût du foncier |
| **Infrastructures** | Autoroutes, ports, gares, **très haut débit** |
| **Marché** | Proximité des clients |
| **Réseau** | Présence de fournisseurs, sous-traitants, centres de recherche |
| **Qualité de vie** | Attractivité pour les salariés |

## Écosystème d’affaires et grappes d’entreprises
- Un **écosystème d’affaires** réunit des acteurs **interdépendants** (entreprises, fournisseurs, clients, organismes publics, universités) qui **coopèrent** et se font **concurrence** à la fois.
- Une **grappe d’entreprises** (*cluster*) est une concentration géographique d’entreprises d’un même domaine, avec des centres de formation et de recherche : l’aéronautique à Toulouse, la « vallée de la cosmétique » en région Centre.
- Les **pôles de compétitivité** labellisés par l’État associent entreprises, laboratoires et centres de formation autour de projets d’innovation.

## Écosystème d’innovation et territoires
L’innovation naît souvent de la **proximité** : échanges informels, circulation des compétences, projets communs entre start-up, grandes entreprises et laboratoires, incubateurs.

## Des effets dans les deux sens
- Le territoire **fournit** à l’organisation ressources et infrastructures.
- L’organisation **produit des effets** sur le territoire : **économiques** (emplois directs et indirects, commandes aux entreprises locales, impôts locaux), **sociaux**, **culturels** (mécénat, événements), **environnementaux** (nuisances, pollution ou au contraire réhabilitation de friches).

## Implanter, délocaliser, relocaliser
| Décision | Définition | Effets sur l’emploi |
| **Délocalisation** | Transférer une activité à l’étranger, souvent pour réduire les coûts | Pertes d’emplois sur le territoire d’origine |
| **Relocalisation** | Rapatrier une activité | Emplois recréés, sécurité d’approvisionnement |
La crise sanitaire de 2020 a montré la fragilité de chaînes d’approvisionnement très lointaines (médicaments, masques) et relancé les débats sur la **souveraineté** industrielle.

> Longtemps, des entreprises ont façonné des villes entières (logements ouvriers, écoles, stades) ; aujourd’hui encore, une grande implantation ou une fermeture change le destin d’un territoire.

## Exemple travaillé
Un fabricant de batteries s’installe dans une ancienne région industrielle.
- **Critères** : foncier disponible, aides publiques, main-d’œuvre avec une culture industrielle, proximité des constructeurs automobiles (écosystème).
- **Effets sur le territoire** : plusieurs milliers d’emplois directs, formations créées avec les lycées et l’université, sous-traitants locaux, mais aussi besoins en logements, en eau et en énergie à gérer avec les collectivités.`,
          },
          questions: [
            ['Qu’est-ce qu’une grappe d’entreprises (cluster) ?', ['Une concentration géographique d’entreprises d’un même domaine avec formation et recherche', 'Un groupe d’actionnaires', 'Une chaîne de magasins franchisés', 'Un fonds d’investissement'], 0, 'L’aéronautique à Toulouse en est un exemple.'],
            ['Un écosystème d’affaires réunit des acteurs qui…', ['S’ignorent', 'Coopèrent et se font concurrence à la fois', 'Appartiennent tous au même propriétaire', 'N’ont aucun lien'], 1, 'Ils sont interdépendants.'],
            ['Transférer une activité à l’étranger pour réduire les coûts, c’est…', ['Relocaliser', 'Délocaliser', 'Externaliser en France', 'Fusionner'], 1, 'La délocalisation fait perdre des emplois sur le territoire d’origine.'],
            ['Lequel est un critère d’implantation lié aux infrastructures ?', ['Le très haut débit', 'Le logo de l’entreprise', 'Le style de direction', 'La marque employeur'], 0, 'Transports et réseaux numériques en font partie.'],
            ['Les emplois créés chez les sous-traitants locaux d’une usine sont des emplois…', ['Directs', 'Indirects', 'Publics', 'Fictifs'], 1, 'Ils découlent de l’activité de l’usine sans en faire partie.'],
            ['Une organisation n’a aucun effet sur son territoire.', ['Vrai', 'Faux'], 1, 'Effets économiques, sociaux, culturels et environnementaux : elle transforme le territoire.'],
            ['Qu’est-ce qu’un pôle de compétitivité ?', ['Un regroupement labellisé d’entreprises, laboratoires et centres de formation autour de l’innovation', 'Un stade', 'Une zone franche sans impôt', 'Une chaîne de supermarchés'], 0, 'Il favorise les projets d’innovation communs.'],
            ['Quel événement a relancé les débats sur la relocalisation ?', ['La crise sanitaire de 2020', 'L’invention de l’imprimerie', 'La Révolution française', 'Les Jeux olympiques de 1924'], 0, 'Les pénuries de masques et de médicaments ont révélé la fragilité des chaînes lointaines.'],
            ['Pourquoi la proximité favorise-t-elle l’innovation ?', ['Par les échanges informels et la circulation des compétences', 'Parce qu’elle supprime la concurrence', 'Parce qu’elle réduit la TVA', 'Elle ne la favorise pas'], 0, 'Start-up, laboratoires et grandes entreprises se rencontrent plus facilement.'],
            ['Le mécénat culturel d’une entreprise dans sa ville est un effet…', ['Culturel sur le territoire', 'Fiscal négatif', 'Environnemental négatif', 'Sans lien avec le territoire'], 0, 'L’organisation participe à la vie locale.'],
            ['Une relocalisation peut améliorer la sécurité d’approvisionnement.', ['Vrai', 'Faux'], 0, 'Produire plus près réduit la dépendance aux chaînes lointaines.'],
            ['Quel critère d’implantation relève des ressources humaines ?', ['La présence d’une main-d’œuvre qualifiée et d’écoles', 'Le prix de l’électricité', 'La proximité d’un port', 'Le taux d’imposition local'], 0, 'Les compétences disponibles pèsent lourd dans le choix.'],
          ],
        },

        // ---- Enseignements spécifiques --------------------------------------
        {
          titre: 'Gestion et finance',
          axe: 'Enseignement spécifique — Gestion et finance',
          lecon: {
            titre: 'Enregistrer, analyser, décider : la comptabilité au service du choix',
            cours: `L’enseignement spécifique de **gestion et finance** s’appuie sur le **système d’information comptable** pour répondre à trois questions : comment **enregistrer** les opérations, comment **analyser** la situation de l’entreprise, comment **aider à décider**. La technicité comptable n’est pas un but : on cherche à comprendre et à utiliser l’information.

## Thème 1 : appliquer les règles comptables
- Le **système d’information comptable** (SIC) saisit, classe et enregistre les opérations ; le **PGI** l’automatise, les documents sont **dématérialisés**, la **sécurité** et les **sauvegardes** sont essentielles.
~ Pièces justificatives → journaux → grand livre → balance → documents de synthèse (bilan, compte de résultat)
- La **partie double** : chaque opération est inscrite au **débit** d’un compte et au **crédit** d’un autre, pour le même montant.
| Notion | Opposition |
| **Flux / stock** | Le compte de résultat retrace des flux de l’exercice ; le bilan, un stock de patrimoine à une date |
| **Actif / passif** | Ce que l’entreprise possède / comment elle le finance |
| **Charge / produit** | Ce qui appauvrit / enrichit l’entreprise pendant l’exercice |
| **Créance / dette** | Ce qu’on lui doit / ce qu’elle doit |
- **Acheter et vendre** : les factures portent la **TVA** (taxe collectée sur les ventes, déductible sur les achats ; l’entreprise reverse la différence à l’État). Contrôles : **lettrage** des comptes clients et fournisseurs, rapprochements.
- **Investir** : une immobilisation n’est pas une **charge** mais un **actif** ; elle perd de la valeur par l’**amortissement** (linéaire : coût d’acquisition ÷ durée d’utilisation).
- **Inventaire** et **principes comptables** : prudence, indépendance des exercices, continuité de l’exploitation, permanence des méthodes.

## Thème 2 : analyser la situation de l’entreprise
= EBE = valeur ajoutée + subventions d’exploitation − impôts et taxes − charges de personnel
- **Soldes intermédiaires de gestion** : marge, valeur ajoutée, **excédent brut d’exploitation** (EBE), résultat d’exploitation, résultat courant avant impôt (RCAI).
- **Capacité d’autofinancement** (CAF) : les ressources générées par l’activité, disponibles pour investir, rembourser ou distribuer.
= Rentabilité économique = résultat d’exploitation ÷ capitaux investis
= Rentabilité financière = résultat net ÷ capitaux propres
- **Effet de levier** : quand la rentabilité économique dépasse le taux d’intérêt, l’endettement augmente la rentabilité financière (et le risque).
- **Bilan fonctionnel** : FRNG, BFR, trésorerie nette ; ratios de rotation des stocks, des créances clients (délai client), des dettes fournisseurs ; ratio d’**indépendance financière** (capitaux propres ÷ ressources stables) ; **capacité de remboursement** (dettes financières ÷ CAF, souvent jugée saine en dessous de 3 à 4).

## Thème 3 : accompagner la prise de décision
- **Financer** : internes (autofinancement, apports en compte courant d’associés) ou externes (emprunt bancaire, augmentation de capital, financement participatif, subvention), selon les performances, le pouvoir des associés, l’endettement, l’attractivité du projet.
- **Optimiser la trésorerie** : le **budget de trésorerie** prévoit encaissements et décaissements ; excédent → placement ; déficit → découvert, escompte, affacturage.
- **Affecter le résultat** : réserve légale obligatoire, réserves facultatives, dividendes, report à nouveau.
- **Analyser les coûts** : coût complet (charges directes et indirectes), coût partiel (variables et fixes), **coût marginal** (coût d’une unité ou d’une série supplémentaire), coût spécifique.

## Exemple travaillé
Résultat d’exploitation 60 000 €, capitaux investis 400 000 € ; résultat net 30 000 €, capitaux propres 150 000 €.
- Rentabilité économique = 60 000 ÷ 400 000 = **15 %**.
- Rentabilité financière = 30 000 ÷ 150 000 = **20 %**.
Si l’entreprise emprunte à 5 % alors que son activité rapporte 15 %, l’**effet de levier** joue en faveur des associés.

> Le comptable enregistre le passé ; le gestionnaire s’en sert pour décider de l’avenir.`,
          },
          questions: [
            ['Que signifie le principe de la partie double ?', ['Chaque opération est inscrite au débit d’un compte et au crédit d’un autre pour le même montant', 'On enregistre chaque facture deux fois par erreur', 'Chaque salarié a deux comptes', 'On publie deux bilans par an'], 0, 'C’est le fondement de la comptabilité.'],
            ['L’achat d’une machine utilisée plusieurs années est enregistré comme…', ['Une charge de l’exercice', 'Une immobilisation à l’actif, amortie', 'Un produit', 'Une dette fiscale'], 1, 'Elle perd de la valeur par l’amortissement.'],
            ['Machine de 20 000 € amortie linéairement sur 5 ans : dotation annuelle ?', ['2 000 €', '4 000 €', '5 000 €', '20 000 €'], 1, '20 000 ÷ 5 = 4 000 € par an.'],
            ['Qu’est-ce que la TVA pour l’entreprise ?', ['Une charge définitive', 'Une taxe collectée sur les ventes, déductible sur les achats, dont elle reverse la différence', 'Un impôt sur les bénéfices', 'Une subvention'], 1, 'C’est le consommateur final qui la supporte.'],
            ['Résultat net 40 000 €, capitaux propres 200 000 €. Rentabilité financière ?', ['5 %', '20 %', '40 %', '80 %'], 1, '40 000 ÷ 200 000 = 20 %.'],
            ['L’effet de levier joue favorablement quand…', ['La rentabilité économique dépasse le taux d’intérêt des emprunts', 'L’entreprise n’a aucune dette', 'Le taux d’intérêt dépasse la rentabilité économique', 'Les stocks augmentent'], 0, 'L’endettement accroît alors la rentabilité financière, mais aussi le risque.'],
            ['Que mesure la capacité d’autofinancement (CAF) ?', ['Les ressources générées par l’activité, disponibles pour investir, rembourser ou distribuer', 'Le montant des stocks', 'Le chiffre d’affaires', 'La TVA à payer'], 0, 'Elle est au cœur des décisions de financement.'],
            ['Le principe de prudence conduit à…', ['Anticiper les pertes probables sans anticiper les gains', 'Surévaluer les stocks', 'Ignorer les risques', 'Changer de méthode chaque année'], 0, 'Il protège les tiers d’une image trop optimiste.'],
            ['La réserve légale fait partie de…', ['L’affectation du résultat', 'Le calcul de la TVA', 'Le budget de trésorerie', 'Le coût marginal'], 0, 'Une part du bénéfice est obligatoirement mise en réserve.'],
            ['Qu’est-ce que le coût marginal ?', ['Le coût d’une unité ou d’une série supplémentaire', 'Le coût de toutes les charges indirectes', 'La marge sur coût variable', 'Le prix de vente'], 0, 'Il aide à décider d’accepter ou non une commande supplémentaire.'],
            ['Le bilan retrace des flux de l’exercice, le compte de résultat un stock de patrimoine.', ['Vrai', 'Faux'], 1, 'C’est l’inverse : le bilan est un stock à une date, le compte de résultat des flux sur l’exercice.'],
            ['Le lettrage des comptes clients sert à…', ['Rapprocher factures et règlements pour repérer les impayés', 'Écrire des lettres aux clients', 'Calculer la paie', 'Fixer les prix'], 0, 'C’est un contrôle du processus de vente.'],
          ],
        },
        {
          titre: 'Mercatique (marketing)',
          axe: 'Enseignement spécifique — Mercatique (marketing)',
          lecon: {
            titre: 'Définir, distribuer et faire connaître une offre',
            cours: `L’enseignement spécifique de **mercatique** (le mot français pour *marketing*) étudie les problématiques actuelles du marketing à travers trois thèmes : la **définition** de l’offre, sa **distribution** et sa **communication**, dans un monde bouleversé par le numérique.

## Thème 1 : la définition de l’offre
**La personnalisation est-elle incontournable ?**
~ Segmentation → ciblage → positionnement
- **Segmenter** : découper le marché en groupes homogènes (âge, revenu, style de vie, usage).
- **Cibler** : choisir le ou les segments visés.
- **Se positionner** : occuper une place claire dans l’esprit des clients par rapport aux concurrents.
| Stratégie | Principe |
| **Marketing de masse** (indifférencié) | Une seule offre pour tous |
| **Marketing différencié** | Une offre adaptée à chaque segment |
| **Marketing concentré** | Une offre pour un seul segment (niche) |
| **Marketing individualisé** (*one-to-one*) | Une offre personnalisée pour chaque client |
Composantes de l’offre : produit (bien, service), **conditionnement**, **stylique** (*design*), **marque**, **qualité**, **image** ; offre globale, **gamme**, politique de marque. On distingue l’offre **B2B** (entre entreprises) et **B2C** (aux consommateurs).
**Toute offre est-elle source d’expérience ?** Le **marketing expérientiel** fait vivre au client des émotions et des sensations (magasin immersif, atelier, événement).
**Le prix, entre raison et illusion ?** Politiques tarifaires : prix unique, **prix différencié** (selon le moment, le client), **gestion des capacités** (*yield management* : billets d’avion ou de train dont le prix varie selon la demande), **prix forfaitaire**, modèles de **gratuité** (*freemium* : gratuit pour l’essentiel, payant pour les options). Le prix tient compte de la **sensibilité-prix**, des **coûts**, du **taux de marge** et du **prix cible**.

## Thème 2 : la distribution de l’offre
**Peut-on se passer d’intermédiaires ?**
- **Canal** : direct (producteur → client), court (un intermédiaire), long (plusieurs).
- **Désintermédiation** : vendre en direct grâce au numérique ; **réintermédiation** : de nouveaux intermédiaires apparaissent (plateformes, comparateurs).
- Distribution **intensive** (partout), **sélective** (points de vente choisis), **exclusive** (un seul distributeur par zone).
- Unités commerciales **physiques** et **virtuelles** ; réponse optimale au client (*efficient consumer response*) : collaboration entre producteur et distributeur.
**Le consommateur dicte-t-il les choix ?** Le **ROPO** (*Research Online, Purchase Offline* : on se renseigne en ligne, on achète en magasin), la distribution **cross-canal** (on passe d’un canal à l’autre : commande en ligne, retrait en magasin), l’**omnicanalité** (tous les canaux reliés, une expérience continue), la distribution **collaborative** (entre particuliers).
**Le numérique, une autre manière de distribuer ?** **Digitalisation** des points de vente (bornes, étiquettes électroniques, paiement mobile) et **places de marché** (*marketplaces*) où des vendeurs tiers proposent leurs produits.

## Thème 3 : la communication de l’offre
- Communication **commerciale** : objectifs (faire connaître, faire aimer, faire agir), cibles, **copie stratégie** (promesse, preuve, bénéfice, ton).
- Moyens : **publicité** (médias et supports), **marketing direct**, **promotion des ventes**, **parrainage**, **mécénat**, **événementiel**.
- **Fidéliser** grâce au numérique : programmes de fidélité, **valeur vie client** (*Life Time Value* : ce que rapporte un client sur toute sa relation), **gestion de la relation client** (CRM), **marketing d’influence**, **gestion de communauté** (*community management*), management de l’**expérience client**.
- Limites : **bloqueurs de publicité**, **bouche-à-oreille** qui peut tourner au *bad buzz*, perte de contrôle du message, fuites de données.

## Exemple travaillé
Une marque de café propose des capsules en abonnement :
- **ciblage** : actifs urbains amateurs de café ; **positionnement** : qualité de torréfacteur, pratique ;
- **prix** : forfait mensuel (prix forfaitaire) avec machine offerte (gratuité partielle) ;
- **distribution** : vente directe en ligne (désintermédiation) + boutiques en propre (omnicanalité) ;
- **fidélisation** : CRM, recommandations personnalisées ; valeur vie client : 25 € × 12 mois × 4 ans = **1 200 €** par abonné, ce qui justifie d’offrir la machine.

> En mercatique, le client n’achète pas un produit : il achète une réponse à un besoin, une expérience et une image.`,
          },
          questions: [
            ['Quel est l’ordre de la démarche marketing stratégique ?', ['Positionnement → ciblage → segmentation', 'Segmentation → ciblage → positionnement', 'Ciblage → positionnement → segmentation', 'Prix → produit → place'], 1, 'On découpe le marché, on choisit ses cibles, puis on se positionne.'],
            ['Une offre personnalisée pour chaque client relève du marketing…', ['De masse', 'Concentré', 'Individualisé (one-to-one)', 'Indifférencié'], 2, 'Les données clients permettent cette personnalisation.'],
            ['Des billets de train dont le prix varie selon la demande illustrent…', ['Le yield management', 'Le prix unique', 'La gratuité', 'La désintermédiation'], 0, 'On ajuste le prix pour remplir au mieux les capacités.'],
            ['Se renseigner en ligne puis acheter en magasin s’appelle…', ['Le ROPO', 'Le B2B', 'Le freemium', 'Le yield'], 0, 'Research Online, Purchase Offline.'],
            ['Une marque de luxe qui ne vend que dans quelques boutiques choisies pratique une distribution…', ['Intensive', 'Sélective ou exclusive', 'De masse', 'Collaborative'], 1, 'Elle contrôle son image en limitant les points de vente.'],
            ['Un producteur qui vend directement en ligne sans distributeur pratique…', ['La désintermédiation', 'La réintermédiation', 'Le marketing de masse', 'L’affacturage'], 0, 'Le numérique permet de supprimer des intermédiaires.'],
            ['Qu’est-ce que la valeur vie client ?', ['Le prix d’un produit', 'Ce que rapporte un client sur toute la durée de sa relation avec la marque', 'Le nombre de clients', 'La note de satisfaction'], 1, 'Elle justifie d’investir pour acquérir et fidéliser un client.'],
            ['Le modèle freemium consiste à…', ['Tout faire payer très cher', 'Offrir l’essentiel gratuitement et faire payer les options', 'Vendre uniquement en magasin', 'Supprimer toute publicité'], 1, 'C’est un modèle de gratuité partielle.'],
            ['L’omnicanalité consiste à relier tous les canaux pour offrir une expérience continue.', ['Vrai', 'Faux'], 0, 'Le client passe du site au magasin sans rupture.'],
            ['Le marketing expérientiel cherche surtout à…', ['Faire vivre des émotions et des sensations au client', 'Baisser les prix', 'Réduire les stocks', 'Supprimer les vendeurs'], 0, 'Magasins immersifs et événements en sont des exemples.'],
            ['Quel est le rôle d’un community manager ?', ['Animer la communauté de la marque sur les réseaux sociaux', 'Tenir la comptabilité', 'Recruter des ouvriers', 'Négocier les prêts bancaires'], 0, 'Il crée du lien et gère les échanges en ligne.'],
            ['Les bloqueurs de publicité sont une limite de la communication numérique.', ['Vrai', 'Faux'], 0, 'Ils traduisent un rejet d’une partie des internautes et obligent à repenser la communication.'],
          ],
        },
        {
          titre: 'Ressources humaines et communication',
          axe: 'Enseignement spécifique — Ressources humaines et communication',
          lecon: {
            titre: 'Développer les compétences, motiver, faire vivre le collectif',
            cours: `L’enseignement spécifique de **ressources humaines et communication** approfondit la compréhension des comportements humains dans les organisations. Trois thèmes : les **compétences**, la **motivation et la satisfaction**, la **cohésion**.

## Thème 1 : les compétences au service de l’organisation, l’organisation au service des compétences
**Satisfaire les besoins en compétences**
- Traduire les besoins opérationnels en **compétences** (référentiels, fiches de poste).
- **Recruter** : définir le profil, attirer (**marque employeur**, attractivité), sélectionner (CV, entretiens, mises en situation), **intégrer** (accueil, tutorat).
- **Fidéliser** pour éviter la « fuite » des compétences.
- Plusieurs **formes de la relation d’emploi** : CDI, CDD, intérim, alternance, indépendants.
**Évaluer les compétences**
- L’**entretien annuel d’évaluation** (performances, objectifs) et l’**entretien professionnel** (obligatoire tous les deux ans, consacré aux perspectives d’évolution et de formation) permettent à chacun d’orienter son **projet de carrière**.
**Développer les compétences**
- La **formation** professionnelle : plan de développement des compétences de l’entreprise, **compte personnel de formation** (CPF) du salarié, projet de transition professionnelle pour se reconvertir.
- **Employabilité** (capacité à retrouver un emploi) et **mobilité** professionnelle ; **gestion des talents**.

## Thème 2 : motivation et satisfaction — qualité de vie au travail et rémunération
**Mieux vivre au travail est-il compatible avec la performance ?** La **qualité de vie et des conditions de travail** (QVCT) relève de la **RSE** et améliore la **performance sociale** : environnement de travail, **ergonomie**, **durée du travail**, motivation.
**Santé et sécurité** : l’employeur a une **obligation de sécurité** envers ses salariés (évaluation des risques dans le document unique, prévention).
| Risque | Exemples |
| **Accidents du travail**, **maladies professionnelles** | Chute, exposition à un produit dangereux |
| **Troubles musculo-squelettiques** (TMS) | Gestes répétitifs, mauvaises postures |
| **Risques psychosociaux** (RPS) | Stress, épuisement professionnel, **harcèlement** |
Indicateurs sociaux : taux d’absentéisme, de fréquence et de gravité des accidents, rotation. Protection sociale : **complémentaire santé** obligatoire dans les entreprises privées.
**La rémunération suffit-elle ?**
| Rémunération **individualisée** | Rémunération **collective** |
| Primes individuelles, avantages particuliers (véhicule, téléphone) | **Intéressement** (lié aux performances, facultatif), **participation** (part des bénéfices, obligatoire à partir de 50 salariés), **épargne salariale** |

## Thème 3 : la recherche de cohésion
**Les tensions professionnelles peuvent-elles être évitées ?** Relations professionnelles, **climat social** ; conflits **interpersonnels** et **sociaux** (grève) ; dépassement des conflits (écoute, médiation, négociation).
**À quelles conditions le dialogue social renforce-t-il la cohésion ?**
- **Acteurs** : direction, représentants élus au **comité social et économique** (CSE), **délégués syndicaux**.
- **Formes** : information, consultation, **négociation collective** (accords d’entreprise, obligations de négocier sur les salaires, l’égalité professionnelle…).
- **Outils** : **base de données économiques, sociales et environnementales** (BDESE), **bilan social** (obligatoire à partir de 300 salariés).
**Comment la communication participe-t-elle à la cohésion ?** Communication interne et externe, **marque employeur**, intranet, réseaux sociaux d’entreprise, outils collaboratifs.

## Exemple travaillé
Un entrepôt logistique a un absentéisme de 9 % et beaucoup de TMS.
= Taux d’absentéisme = heures d’absence ÷ heures théoriques × 100
Diagnostic : postes de préparation de commandes pénibles. Mesures : aménagements **ergonomiques** (tapis, hauteur des postes), rotation des tâches, formation « gestes et postures », accord d’**intéressement** lié à la baisse des accidents, négociation avec le CSE. Suivi par indicateurs sociaux.

> Une compétence qui part, un salarié qui s’use, un conflit qui s’enlise : ce sont des coûts cachés que la GRH rend visibles.`,
          },
          questions: [
            ['L’entretien professionnel obligatoire porte principalement sur…', ['Les perspectives d’évolution et de formation du salarié', 'Le licenciement', 'Le montant des dividendes', 'Les prix de vente'], 0, 'Il a lieu tous les deux ans.'],
            ['Qu’est-ce que le CPF ?', ['Le compte personnel de formation du salarié', 'Le contrat de prestation fiscale', 'Le comité paritaire de fabrication', 'Un impôt sur les salaires'], 0, 'Chaque actif y cumule des droits à la formation.'],
            ['Les troubles musculo-squelettiques sont souvent liés à…', ['Des gestes répétitifs et de mauvaises postures', 'Un excès de congés', 'La communication interne', 'La marque employeur'], 0, 'L’ergonomie des postes permet de les prévenir.'],
            ['Le stress et l’épuisement professionnel relèvent des…', ['Risques psychosociaux', 'Accidents de trajet', 'Maladies infectieuses', 'Risques financiers'], 0, 'Le harcèlement en fait aussi partie.'],
            ['La participation aux bénéfices est obligatoire à partir de…', ['10 salariés', '50 salariés', '300 salariés', '1 000 salariés'], 1, 'L’intéressement, lui, est facultatif.'],
            ['L’intéressement est obligatoire dans toutes les entreprises.', ['Vrai', 'Faux'], 1, 'Il est facultatif et lié aux performances ; c’est la participation qui est obligatoire à partir de 50 salariés.'],
            ['Quelle instance élue représente le personnel dans l’entreprise ?', ['Le comité social et économique (CSE)', 'Le conseil d’administration', 'L’assemblée générale des actionnaires', 'Le commissaire aux comptes'], 0, 'Il est informé et consulté sur la marche de l’entreprise.'],
            ['Qu’est-ce que la BDESE ?', ['La base de données économiques, sociales et environnementales mise à disposition des représentants du personnel', 'Un logiciel de paie', 'Un contrat d’intérim', 'Un compte bancaire'], 0, 'Elle nourrit le dialogue social.'],
            ['À partir de quel effectif le bilan social est-il obligatoire ?', ['11 salariés', '50 salariés', '300 salariés', '5 000 salariés'], 2, 'Il rassemble les principaux indicateurs sociaux.'],
            ['L’employeur a une obligation de sécurité envers ses salariés.', ['Vrai', 'Faux'], 0, 'Il doit évaluer les risques et mettre en place la prévention.'],
            ['Qu’est-ce que l’employabilité ?', ['La capacité d’une personne à trouver ou retrouver un emploi', 'Le nombre d’emplois d’une entreprise', 'Le salaire minimum', 'La durée légale du travail'], 0, 'La formation la renforce.'],
            ['Un véhicule de fonction fait partie de la rémunération…', ['Collective', 'Individualisée (avantage particulier)', 'Obligatoire pour tous', 'Publique'], 1, 'Les avantages particuliers complètent le salaire individuel.'],
          ],
        },
        {
          titre: 'Systèmes d’information de gestion',
          axe: 'Enseignement spécifique — Systèmes d’information de gestion',
          lecon: {
            titre: 'Organiser, interroger et faire circuler l’information',
            cours: `L’enseignement spécifique de **systèmes d’information de gestion** (SIG) étudie comment l’organisation se structure pour gérer l’information, comment elle pilote son système d’information, comment elle transforme les données en décisions, et comment l’information circule sur les réseaux.

## Thème 1 : organisation et numérisation
- Le **système d’information** (SI) : ressources (humaines, matérielles, logicielles, données, procédures), objectifs, niveaux (opérationnel, pilotage, stratégique).
- Le **système informatique** : **matériel**, **logiciel**, **infrastructure** de communication. Il n’est qu’une partie du SI.
- Les évolutions numériques ne sont pas **exemptes de risques** : risques **informatiques** (panne, cyberattaque, perte de données), risques **pour les individus** (atteinte à la vie privée), enjeux **sociaux et environnementaux** (consommation d’énergie des centres de données, déchets électroniques — le numérique responsable).

## Thème 2 : management du SI et performance
- La **fonction SI** : des **métiers** (administrateur réseau, développeur, analyste de données, responsable de la sécurité) et de nouveaux métiers ; choix d’**externaliser** (**infogérance** : confier tout ou partie de son informatique à un prestataire) ; **veille technologique** ; **budget**.
- **Tableau de bord** opérationnel : indicateurs (taux de disponibilité, délai de résolution des incidents).
- Le **projet SI** : expression du besoin, cahier des charges, planification, coordination des acteurs, **recette** (vérifier que le système livré répond au besoin), déploiement ; méthodes classiques ou **agiles** (livraisons courtes et fréquentes).

## Thème 3 : information, action et décision
**Produire de l’information à partir de données**
- Une **base de données relationnelle** range les données en **tables** reliées par des **clés** (clé primaire qui identifie chaque ligne, clé étrangère qui fait référence à une autre table).
- Le langage **SQL** interroge la base :
\`\`\`sql
SELECT nom, ville
FROM CLIENT
WHERE ville = 'Lyon'
ORDER BY nom ;
\`\`\`
Cette requête affiche le nom et la ville des clients lyonnais, triés par nom. Pour relier deux tables, on ajoute une **jointure** (JOIN … ON CLIENT.id = COMMANDE.id_client).
- Nouvelles bases pour les **données massives** (*big data*) aux formats multiples ; **traces numériques** ; exploration de données (*data mining*) pour créer de la valeur.
**Tous les problèmes de gestion sont-ils automatisables ?**
- **Algorithme**, **langage**, **programme** ; variables, conditions, boucles ; **tests** et mise au point.
- **Interface de programmation** (API) : permet à deux applications d’échanger des données (le site d’un commerçant qui interroge le service du transporteur).
- **Intelligence artificielle** : les algorithmes apprennent à partir de données, mais le jugement humain reste nécessaire.

## Thème 4 : SI et échange
- **Documents** : numérisation, structuration, **indexation** ; **langage de balisage** (HTML pour les pages web, XML ou JSON pour les fichiers d’échange) ; métadonnées, hyperliens, référencement, moteurs de recherche.
- **Normalisation des échanges** : **protocoles** (HTTP/HTTPS pour le web, TCP/IP pour le transport, SMTP pour le courriel), codage des données, supports de transmission.
- **Architecture de réseau** : topologie, interconnexion, **sécurisation** (pare-feu, VPN, chiffrement), **adressage** d’une ressource (adresse IP, URL).
- **Centralisation / décentralisation** ; **chaîne de blocs** ; **informatique en nuage** (logiciel, plateforme ou infrastructure fournis comme service).

## Exemple travaillé
Une librairie en ligne veut savoir quels clients n’ont rien commandé depuis un an, pour leur envoyer une offre.
1. Donnée : tables CLIENT et COMMANDE reliées par l’identifiant client (clé étrangère).
2. Requête SQL avec jointure et condition sur la date de la dernière commande.
3. Information : liste de 1 240 clients inactifs.
4. Action : campagne de relance par courriel, via l’API d’un service d’envoi, dans le respect du RGPD (consentement, désinscription possible).
5. Décision éclairée par un indicateur : taux de réactivation au bout d’un mois.

> Le SI transforme des données éparses en informations utiles, à condition que les données soient fiables, bien structurées et bien protégées.`,
          },
          questions: [
            ['Le système informatique est…', ['Plus large que le système d’information', 'Une partie du système d’information', 'Sans rapport avec le SI', 'Uniquement le logiciel de paie'], 1, 'Le SI inclut aussi des personnes, des données et des procédures.'],
            ['Qu’est-ce que l’infogérance ?', ['Confier tout ou partie de son informatique à un prestataire', 'Former les salariés à l’informatique', 'Acheter un ordinateur', 'Supprimer le SI'], 0, 'C’est une forme d’externalisation.'],
            ['Dans une base relationnelle, la clé primaire…', ['Identifie de façon unique chaque ligne d’une table', 'Ouvre la porte de la salle serveur', 'Est un mot de passe', 'Relie deux réseaux'], 0, 'La clé étrangère, elle, fait référence à une autre table.'],
            ['Dans une requête SQL, quel mot-clé filtre les lignes selon une condition ?', ['SELECT', 'FROM', 'WHERE', 'ORDER BY'], 2, 'SELECT choisit les colonnes, FROM la table, WHERE la condition.'],
            ['À quoi sert ORDER BY ?', ['À trier le résultat', 'À supprimer des lignes', 'À créer une table', 'À chiffrer les données'], 0, 'On trie selon une ou plusieurs colonnes.'],
            ['Une jointure permet de…', ['Relier deux tables par une clé commune', 'Supprimer une base', 'Protéger un réseau', 'Créer une page web'], 0, 'Par exemple CLIENT et COMMANDE par l’identifiant client.'],
            ['Qu’est-ce qu’une API ?', ['Une interface qui permet à deux applications d’échanger des données', 'Un virus informatique', 'Un type d’écran', 'Une taxe numérique'], 0, 'Interface de programmation applicative.'],
            ['Qu’est-ce que la recette d’un projet SI ?', ['Vérifier que le système livré répond au besoin exprimé', 'Le chiffre d’affaires du projet', 'La liste des ingrédients', 'Le budget prévisionnel'], 0, 'On teste avant de déployer.'],
            ['HTML est un langage…', ['De balisage pour les pages web', 'De requête pour les bases de données', 'Comptable', 'De chiffrement'], 0, 'XML et JSON servent aussi aux fichiers d’échange.'],
            ['Le protocole HTTPS garantit une communication chiffrée entre le navigateur et le site.', ['Vrai', 'Faux'], 0, 'Le S signifie sécurisé.'],
            ['Le numérique n’a aucun impact environnemental.', ['Vrai', 'Faux'], 1, 'Centres de données et déchets électroniques pèsent sur l’environnement.'],
            ['Une URL sert à…', ['Adresser une ressource sur le réseau', 'Chiffrer un fichier', 'Calculer un coût', 'Trier une table'], 0, 'C’est l’adresse d’une ressource sur le web.'],
          ],
        },

        // ---- Méthode ------------------------------------------------------
        {
          titre: 'Méthode : l’épreuve écrite et le projet',
          axe: 'L’épreuve du baccalauréat',
          lecon: {
            titre: 'Quatre heures sur des organisations réelles, et un projet à défendre',
            cours: `La spécialité se joue sur deux terrains. L’**écrit** de 4 heures évalue l’**enseignement commun**. L’**enseignement spécifique**, lui, nourrit le **projet** (l’étude approfondie) que tu mènes dans l’année et sur lequel s’appuie le **Grand oral**. Règles en vigueur à partir de la session 2027 (notes de service du 10 et du 11 septembre 2026).

## L’écrit : ce qu’il faut savoir
| Élément | Contenu |
| **Durée** | 4 heures |
| **Programme** | L’enseignement **commun** de terminale ; les notions de management et de sciences de gestion et numérique de 1re peuvent être mobilisées |
| **Sujet** | Plusieurs **dossiers** de documents sur une ou plusieurs **organisations réelles**, avec des questions |
| **Notation** | Sur 20, dont **2 points** pour l’orthographe et la syntaxe ; l’organisation du propos et la précision du vocabulaire comptent dans toute la copie |

On attend de toi que tu saches : exploiter une documentation ; **caractériser** une situation de management ou de gestion ; **proposer, présenter et justifier** une solution ; mettre en œuvre des **méthodes et outils** (calculs, tableaux, schémas) ; montrer l’**intérêt et les limites** de ces outils.

## Méthode en cinq temps
1. **Lire les questions** de tous les dossiers (10 minutes) : repérer les verbes et les notions attendues.
2. **Lire les documents** en surlignant les indices utiles (chiffres, citations courtes, dates).
3. **Répartir le temps** : environ une heure par dossier, et 20 minutes de relecture.
4. **Rédiger** chaque réponse : notion définie → application au cas avec un indice → conclusion.
5. **Relire** : orthographe, unités, cohérence des calculs.

## Les types de questions
| Question | Attendu | Exemple |
| **Caractériser, identifier** | Nommer avec la notion exacte et un indice du document | « Caractérisez le style de direction » |
| **Calculer** | Formule, calcul posé, résultat avec unité, **interprétation** | « Calculez la marge sur coût spécifique de la gamme A » |
| **Analyser** | Décomposer causes et effets | « Analysez les effets du télétravail sur la coordination » |
| **Justifier, argumenter** | Arguments tirés du contexte | « Justifiez le choix de la relocalisation » |
| **Question de réflexion** | Réponse structurée (introduction, deux ou trois arguments, conclusion) qui mobilise le cours et les exemples | « Les transformations numériques sont-elles une chance pour la production ? » |

!> Un calcul juste sans interprétation ne rapporte qu’une partie des points : dis ce que le résultat signifie pour l’organisation.

## Exemple travaillé
Question : « Montrez que l’entreprise Roulez Vert a fait le choix de flux tendus. » Document : « Nos vélos ne sont assemblés qu’à réception de la commande ; nous n’avons presque aucun stock de produits finis. »
- **Notion** : produire en flux tendus, c’est produire à la commande, au plus juste, en limitant les stocks.
- **Application** : Roulez Vert assemble ses vélos « à réception de la commande » et n’a « presque aucun stock de produits finis ».
- **Conclusion** : elle travaille donc en flux tendus, ce qui réduit ses coûts de stockage mais la rend vulnérable à un retard de ses fournisseurs.

## L’oral de contrôle
Si tu passes au second groupe : 40 minutes de préparation, 20 minutes d’épreuve (10 minutes de réponses, 10 minutes d’échange) sur une situation d’organisation réelle, programme de 1re et enseignement commun de terminale.

## Le projet et le Grand oral
- Dans ton **enseignement spécifique** (gestion et finance, mercatique, ressources humaines et communication, ou systèmes d’information de gestion), tu mènes une **étude approfondie** sur une ou des organisations.
- Au **Grand oral** de la voie technologique (20 minutes, 20 minutes de préparation, coefficient 12), tu présentes **deux questions** qui s’appuient sur cette étude, préparées avec ton professeur : 10 minutes de présentation d’une question, puis 10 minutes d’échange avec le jury, qui peut t’interroger sur tout le programme de la spécialité en lien avec ton étude.
- Garde une **trace** de ta démarche (sources, choix, difficultés) : c’est la matière du deuxième temps.

> À l’écrit comme à l’oral, on ne te demande pas de réciter : on te demande de **raisonner avec les notions** sur une organisation réelle.`,
          },
          questions: [
            ['Sur quelle partie du programme porte l’écrit de 4 heures ?', ['Sur l’enseignement spécifique choisi', 'Sur l’enseignement commun de terminale, avec les notions de 1re mobilisables', 'Uniquement sur le programme de 1re', 'Sur le droit et l’économie'], 1, 'L’enseignement spécifique nourrit le projet et le Grand oral.'],
            ['Combien de points l’écrit réserve-t-il à l’orthographe et à la syntaxe ?', ['0', '2', '4', '10'], 1, 'Deux points sur vingt, et la qualité de l’expression compte dans toute la copie.'],
            ['Comment se présente le sujet de l’écrit ?', ['Une dissertation libre', 'Plusieurs dossiers de documents sur des organisations réelles, avec des questions', 'Un QCM', 'Un exposé oral'], 1, 'On analyse des situations réelles à partir de documents.'],
            ['Que faut-il ajouter à un calcul juste pour obtenir tous les points ?', ['Une interprétation de ce que le résultat signifie pour l’organisation', 'Un dessin', 'Une citation de philosophe', 'Rien'], 0, 'Le calcul est un outil au service de l’analyse.'],
            ['Quelle est la structure d’une bonne réponse ?', ['Notion définie, application au cas avec un indice, conclusion', 'Une opinion personnelle', 'Une copie du document', 'Une liste de mots-clés'], 0, 'Notion sans cas : hors sujet ; cas sans notion : paraphrase.'],
            ['Quelle est la durée du Grand oral de la voie technologique ?', ['10 minutes', '20 minutes', '45 minutes', '1 heure'], 1, 'Avec 20 minutes de préparation et un coefficient 12.'],
            ['Au Grand oral, les questions présentées s’appuient sur…', ['L’étude approfondie (le projet) menée dans la spécialité', 'Un sujet tiré au sort sans lien avec l’année', 'Le programme de français', 'Uniquement l’actualité'], 0, 'Elles sont préparées avec le professeur de la spécialité.'],
            ['L’enseignement spécifique est évalué à l’écrit de 4 heures.', ['Vrai', 'Faux'], 1, 'L’écrit porte sur l’enseignement commun ; le spécifique nourrit le projet.'],
            ['Combien de temps de préparation pour l’oral de contrôle de la spécialité ?', ['10 minutes', '40 minutes', '2 heures', 'Aucun'], 1, '40 minutes de préparation, 20 minutes d’épreuve.'],
            ['Pourquoi lire toutes les questions avant les documents ?', ['Pour lire les documents de façon active en sachant quoi chercher', 'Parce que les documents sont facultatifs', 'Pour gagner des points de présentation', 'Pour éviter de conclure'], 0, 'On repère les indices utiles dès la première lecture.'],
            ['Une question de réflexion appelle…', ['Une réponse structurée : introduction, arguments, conclusion', 'Un seul mot', 'Un calcul uniquement', 'Un schéma sans texte'], 0, 'Elle mobilise le cours et les exemples tirés des documents.'],
            ['Montrer l’intérêt et les limites d’un outil de gestion fait partie des compétences évaluées.', ['Vrai', 'Faux'], 0, 'La note de service le cite parmi les objectifs de l’épreuve.'],
          ],
        },
      ],
    },
  ],
}
