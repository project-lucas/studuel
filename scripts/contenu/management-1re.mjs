// MANAGEMENT — 1re technologique (série STMG). Matière NEUVE de la voie
// technologique : un élève de la voie générale ne la voit jamais (cf.
// BRIEF-techno : `contentLevelFor` range la « 1re techno » au niveau '1re').
//
// PROGRAMME : BO spécial n° 1 du 22 janvier 2019 (programme de management de
// première STMG), en vigueur. Trois thèmes et onze questions :
//   Thème 1 — À la rencontre du management des organisations (1.1 → 1.4)
//   Thème 2 — Le management stratégique, du diagnostic à la fixation des
//             objectifs (2.1 → 2.4)
//   Thème 3 — Les choix stratégiques des organisations (3.1 → 3.3)
// Une fiche par question, sauf la 3.1 (options stratégiques des entreprises)
// coupée en deux : les choix de domaine et d'avantage concurrentiel d'un côté,
// les modalités de développement de l'autre — la question porte à elle seule
// plus de notions que tout le thème 1. Plus une fiche MÉTHODE : le management de
// 1re n'a pas d'épreuve terminale (contrôle continu), mais ses notions sont
// mobilisables à l'écrit de management, sciences de gestion et numérique de Tle
// (note de service MENE2622652N du 11/09/2026, session 2027), qui se joue sur
// l'analyse de situations d'organisations réelles.

export default {
  slug: 'management',
  nom: 'Management',

  titreMigration: 'MANAGEMENT 1re STMG — LE PROGRAMME OFFICIEL (13 fiches)',

  motif: `Matière neuve de la voie technologique (série STMG, classe de 1re) :
le management n'avait aucune fiche. Ce module installe le programme officiel
(BO spécial n° 1 du 22 janvier 2019) — ses trois thèmes et ses onze questions —
en douze fiches, plus une fiche de méthode pour analyser une situation de
management, la compétence que l'écrit de management, sciences de gestion et
numérique de terminale évalue sur des organisations réelles.`,

  blocs: [
    {
      niveaux: ['1re'],
      positionDepart: 1,
      chapitres: [
        // ---- Thème 1 : À la rencontre du management des organisations -----
        {
          titre: 'Pourquoi organiser l’action collective ?',
          axe: 'Thème 1 : À la rencontre du management des organisations',
          lecon: {
            titre: 'Seul on va vite, ensemble on va plus loin — à condition de s’organiser',
            cours: `Monter un spectacle de fin d’année, faire tourner une boulangerie, soigner des patients dans un hôpital : aucune de ces activités n’est à la portée d’une personne seule. Dès qu’il faut agir à plusieurs, la question se pose : **comment faire travailler ensemble des personnes qui ont chacune leurs intérêts ?** L’organisation est la réponse.

## Action individuelle et action collective
| | Action **individuelle** | Action **collective** |
| Qui agit ? | Une personne seule | Un **groupe** de personnes |
| Objectif | Personnel | **Commun** à tous les membres |
| Limite | Les capacités d’une seule personne | La **coordination** entre les membres |

L’action collective se justifie par une **plus grande efficacité** : à plusieurs, on peut se **spécialiser**, cumuler les compétences et réaliser ce qu’aucun individu ne ferait seul.

## Intérêts individuels et intérêt collectif
Chaque membre garde ses **intérêts individuels** (un salaire, de la reconnaissance, du temps libre). L’**intérêt collectif** est celui du groupe (réussir le projet, durer). Les deux ne coïncident pas toujours : une partie du travail d’une organisation consiste à les **faire converger**.

> Une organisation n’efface pas les intérêts individuels : elle les rend compatibles avec un objectif commun.

## Du groupe à l’organisation
Un simple groupe devient une **organisation** quand il réunit quatre éléments :
1. un **objectif commun** et la volonté de **durer** (pérennité) ;
2. une **structure**, en général hiérarchisée : qui fait quoi, qui décide ;
3. des **règles** et une circulation de l’information ;
4. un **cadre juridique** : statut d’entreprise, d’association, d’établissement public…

Le cadre juridique donne à l’organisation une existence propre : elle peut signer des contrats, embaucher, être propriétaire.

## Les ressources mobilisées
| Ressource | Exemples |
| **Humaines** | Salariés, bénévoles, dirigeants, leurs compétences |
| **Financières** | Capital apporté, emprunts, subventions, recettes |
| **Matérielles** | Locaux, machines, véhicules, stocks |
| **Immatérielles** | Marque, brevets, savoir-faire, réputation |
| **Technologiques** | Logiciels, réseaux, données, équipements numériques |

## Exemple travaillé
Trois amis veulent vendre des crêpes au marché le dimanche.
- **Action individuelle** : chacun ferait ses crêpes chez lui — peu de clients servis.
- **Action collective** : l’un achète les ingrédients, l’un cuit, l’un encaisse. Ils servent trois fois plus de clients.
- **Organisation** : ils créent une association, ouvrent un compte bancaire (ressource financière), achètent un stand (matérielle), choisissent un nom et un logo (immatérielle), fixent des horaires et un partage des tâches (règles).

Leurs intérêts individuels peuvent diverger (l’un veut gagner de l’argent, l’autre se faire plaisir) : il faudra les accorder.

## À retenir
- Une organisation est un **groupe structuré** qui poursuit un objectif commun dans la durée.
- Elle mobilise cinq familles de ressources et s’inscrit dans un **cadre juridique**.
- Le **management** naît de ce besoin de coordonner l’action collective.`,
          },
          questions: [
            ['Qu’est-ce qui justifie avant tout l’action collective ?', ['Elle évite tout recours au droit', 'Elle est obligatoire dans une économie de marché', 'Elle est plus efficace que l’action individuelle', 'Elle supprime les intérêts individuels'], 2, 'À plusieurs, on se spécialise et on cumule les compétences : on réalise ce qu’une personne seule ne pourrait pas faire.'],
            ['Quel élément fait passer un simple groupe au statut d’organisation ?', ['Un objectif commun, une structure, des règles et un cadre juridique', 'Un nombre minimal de dix membres', 'La recherche obligatoire du profit', 'Le fait que ses membres soient amis'], 0, 'Une organisation se définit par sa structure et ses règles, pas par sa taille ni par le profit.'],
            ['Une marque et un brevet sont des ressources…', ['Humaines', 'Matérielles', 'Financières', 'Immatérielles'], 3, 'Elles n’ont pas de substance physique mais elles ont une valeur : ce sont des ressources immatérielles.'],
            ['Le logiciel de caisse et le réseau informatique d’un magasin sont des ressources…', ['Financières', 'Technologiques', 'Humaines', 'Immatérielles au sens juridique uniquement'], 1, 'Logiciels, réseaux et données forment les ressources technologiques.'],
            ['Dans une organisation, les intérêts individuels des membres disparaissent au profit de l’intérêt collectif.', ['Vrai', 'Faux'], 1, 'Ils subsistent. Le rôle de l’organisation et du management est de les rendre compatibles avec l’objectif commun.'],
            ['À quoi sert le cadre juridique d’une organisation ?', ['À dispenser ses membres de toute règle', 'À fixer le salaire de chaque membre', 'À lui donner une existence propre : signer des contrats, embaucher, posséder', 'À garantir qu’elle fera des bénéfices'], 2, 'Le statut juridique (société, association, établissement public) permet à l’organisation d’agir en son nom.'],
            ['Quelle ressource correspond aux compétences des salariés ?', ['Humaine', 'Financière', 'Matérielle', 'Technologique'], 0, 'Les ressources humaines regroupent les personnes et leurs compétences.'],
            ['Quelle expression désigne la volonté d’une organisation de durer dans le temps ?', ['La productivité', 'La flexibilité', 'La rentabilité', 'La pérennité'], 3, 'La pérennité, c’est la capacité à survivre et à durer ; c’est l’un des traits qui distinguent l’organisation d’un groupe éphémère.'],
            ['Des élèves organisent un tournoi : l’un gère les inscriptions, l’autre l’arbitrage, un troisième la buvette. Quel avantage de l’action collective est illustré ?', ['L’absence de règles', 'La spécialisation des tâches', 'L’autofinancement', 'La suppression de la hiérarchie'], 1, 'Chacun se concentre sur une tâche : c’est la spécialisation, source d’efficacité.'],
            ['Des subventions et un emprunt bancaire sont des ressources…', ['Technologiques', 'Humaines', 'Financières', 'Immatérielles'], 2, 'Tout apport d’argent (capital, emprunt, subvention, recettes) est une ressource financière.'],
            ['Quelle est la limite principale de l’action collective ?', ['Elle demande de coordonner les membres', 'Elle interdit la spécialisation', 'Elle ne peut pas avoir d’objectif', 'Elle est toujours moins efficace'], 0, 'Plus il y a de membres, plus il faut coordonner : c’est précisément le rôle du management.'],
            ['Une organisation est en général structurée de manière hiérarchisée.', ['Vrai', 'Faux'], 0, 'Le programme le précise : le passage à l’organisation implique en général une structure hiérarchisée — qui décide, qui exécute.'],
          ],
        },
        {
          titre: 'La diversité des organisations',
          axe: 'Thème 1 : À la rencontre du management des organisations',
          lecon: {
            titre: 'Entreprise, service public, association : trois familles, des frontières poreuses',
            cours: `Ton supermarché, ton lycée et le club de foot du quartier sont trois organisations. Elles ont toutes un objectif commun et des ressources, mais elles n’existent pas pour les mêmes raisons et ne se financent pas de la même manière.

## Finalité et buts
- La **finalité** est la raison d’être de l’organisation : faire du profit, servir l’intérêt général, défendre une cause.
- Les **buts** sont ce qu’elle poursuit concrètement pour y parvenir.
- Une finalité peut être **lucrative** (rechercher un bénéfice à partager) ou **non lucrative**.

## Les trois grandes familles
| | Entreprise **privée** | Organisation **publique** | Organisation de la **société civile** |
| Finalité | **Lucrative** : réaliser un profit | **Intérêt général** | **Non lucrative** : servir les membres ou une cause |
| Production | Biens et services **marchands** | Services surtout **non marchands** | Services surtout non marchands |
| Financement | Ventes, capitaux privés, emprunts | **Impôts et taxes**, emprunts, parfois prix payé par l’usager | Cotisations, dons, subventions, bénévolat |
| Exemples | Une boulangerie, un constructeur automobile | Une mairie, un hôpital public, la SNCF | Association, ONG, syndicat, fondation |

## Marchand ou non marchand ?
- Un bien ou service **marchand** est vendu à un prix qui couvre au moins son coût de production.
- Un service **non marchand** est fourni gratuitement ou à un prix très inférieur à son coût (l’école publique, un soin dans un dispensaire associatif).

## Les autres critères pour caractériser une organisation
1. La **taille** (effectif : micro-entreprise, PME, grande entreprise).
2. Le **secteur d’activité** (agriculture, industrie, services).
3. Le **champ géographique** (local, national, international).
4. L’**origine du financement** (privé, public, mixte).
5. Le **statut juridique**.

## Les tensions propres à chaque famille
- L’entreprise privée doit aussi assumer sa **responsabilité sociale et environnementale** : le profit n’est pas tout.
- L’organisation publique arbitre entre sa **mission de service public**, la **maîtrise des coûts** imposée par le budget et la **qualité** du service.
- L’organisation de la société civile repose sur des ressources fragiles (dons, bénévoles) : cela peut faire naître des tensions entre salariés et bénévoles ou entre financeurs.

## Des frontières qui bougent
Les trois familles ne sont pas étanches : il existe un **continuum**.
- L’État détient des parts d’**entreprises** qui vendent sur des marchés concurrentiels (par exemple dans l’énergie ou l’automobile).
- Un **partenariat public-privé** confie à une entreprise la construction et l’entretien d’un équipement public.
- Une association peut vendre des services (une crèche associative facture les familles).

> Pour classer une organisation, ne regarde pas son nom : regarde sa **finalité**, ce qu’elle **produit** et **qui la finance**.

## Exemple travaillé
Les Restos du Cœur : finalité **non lucrative** (aider les personnes démunies), service **non marchand** (repas gratuits), financement par **dons, subventions et bénévolat** → organisation de la société civile (association). Le fait qu’elle gère un budget important ne la transforme pas en entreprise.`,
          },
          questions: [
            ['Quelle est la finalité d’une entreprise privée ?', ['Produire gratuitement', 'Servir l’intérêt général', 'Défendre les intérêts de ses adhérents', 'Réaliser un profit'], 3, 'Sa finalité est lucrative, même si elle doit assumer aussi une responsabilité sociale et environnementale.'],
            ['Comment se finance principalement une organisation publique ?', ['Par les dons des particuliers', 'Par les impôts et taxes', 'Par la Bourse uniquement', 'Par les cotisations des adhérents'], 1, 'Les prélèvements obligatoires financent l’essentiel ; l’usager paie parfois un prix (un ticket de transport, par exemple).'],
            ['Un service non marchand est un service…', ['Interdit à la vente', 'Vendu à un prix couvrant son coût', 'Fourni gratuitement ou à un prix très inférieur à son coût', 'Produit uniquement par des entreprises'], 2, 'L’enseignement public ou un repas des Restos du Cœur sont des services non marchands.'],
            ['Un syndicat de salariés fait partie des…', ['Organisations de la société civile', 'Administrations territoriales', 'Entreprises publiques', 'Entreprises privées'], 0, 'Associations, ONG, syndicats et fondations forment la société civile : leur but est non lucratif.'],
            ['Une association ne peut jamais vendre de services.', ['Vrai', 'Faux'], 1, 'Elle le peut (une crèche associative facture les familles) : ce qui compte, c’est qu’elle ne partage pas de bénéfices entre ses membres.'],
            ['Quel exemple illustre la porosité entre secteur public et secteur privé ?', ['Une boulangerie qui vend du pain', 'Une mairie qui délivre une carte d’identité', 'Un club de sport qui encaisse des cotisations', 'Un partenariat public-privé pour construire un hôpital'], 3, 'Le partenariat public-privé associe une personne publique et une entreprise privée autour d’un équipement public.'],
            ['Quelle tension est caractéristique d’une organisation publique ?', ['Choisir entre profit et dividendes', 'Concilier mission de service public, maîtrise des coûts et qualité du service', 'Attirer des actionnaires en Bourse', 'Recruter uniquement des bénévoles'], 1, 'Le budget public est contraint, mais le service doit rester de qualité et accessible à tous.'],
            ['Quels critères permettent de caractériser une organisation ?', ['Uniquement le nombre de ses dirigeants', 'Seulement son nom et son logo', 'Sa finalité, sa production, son financement, sa taille, son secteur, son champ géographique', 'Uniquement son chiffre d’affaires'], 2, 'Ce sont les critères du programme. Le nom ne dit rien de la nature d’une organisation.'],
            ['La finalité d’une organisation, c’est…', ['Sa raison d’être', 'Son organigramme', 'Son chiffre d’affaires annuel', 'Sa forme juridique'], 0, 'La finalité est la raison d’être ; les buts la déclinent concrètement.'],
            ['Un hôpital public produit principalement des services…', ['Réservés à ses actionnaires', 'Financés par la Bourse', 'Marchands et lucratifs', 'Non marchands, au nom de l’intérêt général'], 3, 'Les soins sont largement pris en charge par la collectivité : l’hôpital public poursuit l’intérêt général.'],
            ['L’État peut détenir des parts d’entreprises qui vendent sur des marchés concurrentiels.', ['Vrai', 'Faux'], 0, 'C’est un exemple du continuum entre les familles d’organisations.'],
            ['Quelle ressource est typique d’une organisation de la société civile ?', ['Les dividendes', 'Le bénévolat', 'L’impôt sur le revenu', 'Les droits de douane'], 1, 'Dons, cotisations, subventions et bénévolat : des ressources précieuses mais fragiles.'],
          ],
        },
        {
          titre: 'Qu’est-ce que le management ?',
          axe: 'Thème 1 : À la rencontre du management des organisations',
          lecon: {
            titre: 'Conduire une organisation : fixer le cap, organiser, animer, contrôler',
            cours: `Le mot vient de l’anglais *to manage*, lui-même issu du vieux français *ménager* : conduire, tenir en main. **Manager, c’est conduire une organisation vers ses objectifs en mobilisant ses ressources.** Le management concerne toutes les organisations, pas seulement les entreprises.

## Une définition
Le management est l’ensemble des **décisions** et des **pratiques** qui permettent de **piloter** une organisation : fixer ses objectifs, coordonner les personnes, allouer les ressources et évaluer les résultats.

## Les quatre fonctions du management
| Fonction | Ce qu’elle recouvre | Exemple dans un magasin |
| **Fixer des objectifs** | Choisir où l’on va | Augmenter les ventes de 5 % |
| **Organiser, animer** | Répartir les tâches, les moyens, motiver | Planning des vendeurs, réunion d’équipe |
| **Mobiliser, contrôler** | Suivre l’action, corriger | Suivi quotidien des ventes |
| **Évaluer** | Mesurer les résultats obtenus | Bilan annuel, comparaison avec l’objectif |

Ces fonctions s’enchaînent en **boucle** : l’évaluation sert à fixer les objectifs suivants.

## Management stratégique et management opérationnel
| | Management **stratégique** | Management **opérationnel** |
| Horizon | **Long terme** | **Court terme** |
| Qui décide ? | La direction générale | Les responsables de service, d’équipe |
| Enjeu | Le **devenir** de l’organisation | Le **fonctionnement quotidien** |
| Réversibilité | Difficile et coûteuse | Facile |
| Exemple | Ouvrir une usine à l’étranger | Organiser les congés d’été |

> Une décision est stratégique quand elle **engage l’avenir** de l’organisation et qu’on ne peut pas revenir dessus facilement.

## Management privé et management public
- Le management **privé** vise la performance économique et la satisfaction des clients.
- Le management **public** poursuit l’**intérêt général** sous contraintes : budget voté, règles de la comptabilité publique, principes du service public (continuité, égalité, adaptabilité). Il emprunte de plus en plus d’outils au privé (indicateurs, contrôle de gestion).

## Évaluer l’efficacité du management
Un management est **efficace** s’il **atteint les objectifs** fixés. On l’évalue grâce à des **indicateurs** : chiffre d’affaires, satisfaction des usagers, taux d’absentéisme, délais de traitement…

## Exemple travaillé
Classe les décisions d’une chaîne de cinémas :
1. Se lancer dans la diffusion en ligne → **stratégique** (engage l’avenir, coûteux, long terme).
2. Programmer une séance supplémentaire samedi → **opérationnelle** (court terme, réversible).
3. Racheter un concurrent régional → **stratégique**.
4. Former deux salariés à la nouvelle caisse → **opérationnelle**.

## À retenir
Le management concerne **toute** organisation. Il combine quatre fonctions, s’exerce à deux niveaux (stratégique et opérationnel) et se juge à l’aune des **objectifs** atteints.`,
          },
          questions: [
            ['Quelle est la meilleure définition du management ?', ['Le contrôle fiscal d’une entreprise', 'La gestion de la paie des salariés', 'L’ensemble des décisions et pratiques qui permettent de piloter une organisation vers ses objectifs', 'La publicité d’une entreprise'], 2, 'Le management fixe les objectifs, coordonne, alloue les ressources et évalue.'],
            ['Le management ne concerne que les entreprises privées.', ['Vrai', 'Faux'], 1, 'Associations, hôpitaux, mairies sont aussi managés, avec leurs contraintes propres.'],
            ['Laquelle n’est PAS une des quatre fonctions du management ?', ['Voter le budget de l’État', 'Fixer des objectifs', 'Organiser, animer', 'Évaluer'], 0, 'Les quatre fonctions sont : fixer des objectifs, organiser/animer, mobiliser/contrôler, évaluer.'],
            ['Une décision stratégique se caractérise par…', ['Le fait d’être prise par un stagiaire', 'L’absence de conséquence financière', 'Un horizon court et une grande réversibilité', 'Un horizon long et un engagement de l’avenir de l’organisation'], 3, 'Elle engage l’organisation durablement et coûte cher à défaire.'],
            ['Établir le planning des caisses d’un supermarché pour la semaine relève du management…', ['Stratégique', 'Opérationnel', 'International', 'Public'], 1, 'Décision de court terme, facilement modifiable : elle est opérationnelle.'],
            ['Quelle décision est stratégique ?', ['Commander du papier pour l’imprimante', 'Remplacer un salarié absent', 'Se lancer sur un nouveau marché à l’étranger', 'Changer l’heure d’une réunion'], 2, 'Entrer sur un nouveau marché engage l’avenir et mobilise des ressources importantes.'],
            ['Le management public doit respecter des principes propres au service public. Lesquels ?', ['Continuité, égalité, adaptabilité', 'Secret, exclusivité, rapidité', 'Concurrence, publicité, marge', 'Profit, dividendes, croissance'], 0, 'Ces trois principes garantissent l’intérêt général.'],
            ['Comment évalue-t-on l’efficacité du management ?', ['En comptant le nombre de réunions', 'En mesurant la taille des bureaux', 'Uniquement au salaire du dirigeant', 'En comparant les résultats aux objectifs grâce à des indicateurs'], 3, 'Un management efficace atteint les objectifs fixés ; les indicateurs le mesurent.'],
            ['D’où vient le mot « management » ?', ['Du latin « managerium », l’impôt', 'De l’anglais « to manage », lui-même lié au vieux français « ménager »', 'De l’allemand « Mann », l’homme', 'Du grec « manos », la main'], 1, 'Conduire, tenir en main, ménager ses ressources : l’étymologie dit bien ce qu’est le management.'],
            ['Les fonctions du management s’enchaînent en boucle : l’évaluation sert à fixer les objectifs suivants.', ['Vrai', 'Faux'], 0, 'C’est une démarche continue : on fixe, on agit, on contrôle, on évalue, puis on réajuste.'],
            ['Qui prend en général les décisions stratégiques ?', ['Chaque salarié seul', 'Les clients', 'La direction générale', 'Les fournisseurs'], 2, 'Elles relèvent du sommet de l’organisation ; les décisions opérationnelles sont déléguées aux responsables d’équipe.'],
            ['Motiver une équipe en réunion relève de quelle fonction du management ?', ['Organiser, animer', 'Évaluer', 'Contrôler la comptabilité', 'Fixer des objectifs'], 0, 'Animer une équipe, c’est donner du sens au travail et stimuler l’engagement.'],
          ],
        },
        {
          titre: 'Le management face aux changements de l’environnement',
          axe: 'Thème 1 : À la rencontre du management des organisations',
          lecon: {
            titre: 'Une organisation vivante dans un monde qui bouge',
            cours: `Une entreprise de taxis voit arriver les plateformes de VTC ; une commune doit réduire sa consommation d’énergie ; un supermarché est accusé de gaspillage alimentaire. Aucune organisation ne vit sous cloche : **son environnement change, et le management doit y répondre.**

## L’organisation, un système complexe
L’organisation est un **système** : un ensemble d’éléments (personnes, ressources, services) en **interaction**, ouvert sur un **écosystème**. Ce qui se passe à l’extérieur modifie l’intérieur, et inversement. Elle doit en permanence rechercher son **équilibre** sur plusieurs plans : financier, économique, social, technologique, écologique, juridique, politique.

## Les parties prenantes
Les **parties prenantes** sont tous les acteurs concernés par l’activité de l’organisation, qui l’influencent ou qu’elle influence.
| Internes | Externes |
| Salariés, dirigeants, actionnaires (associés) | Clients, fournisseurs, banques, État, collectivités, riverains, associations, concurrents |

Leurs attentes divergent : l’actionnaire veut des dividendes, le salarié une meilleure rémunération, le riverain moins de nuisances, le client des prix bas.

## La régulation managériale
La **régulation** est l’action du management pour **maintenir l’équilibre** de l’organisation malgré les perturbations : ajuster les objectifs, réorganiser, négocier avec les parties prenantes, arbitrer entre leurs attentes.

## Trois grands changements actuels
1. **Les transformations numériques** : ventes en ligne, plateformes, données, intelligence artificielle, télétravail. Elles créent des opportunités (nouveaux clients, gains de productivité) et des menaces (nouveaux concurrents, cyberattaques).
2. **Les mutations écologiques** : raréfaction des ressources, dérèglement climatique, réglementation environnementale, attentes des consommateurs.
3. **Les nouvelles attentes sociétales** : conditions de travail, égalité femmes-hommes, éthique.

## La responsabilité sociétale des entreprises (RSE)
La **RSE** est l’intégration **volontaire** par l’entreprise de préoccupations **sociales** et **environnementales** dans ses activités et ses relations avec les parties prenantes, **au-delà** de ce qu’exige la loi.
| Pilier | Exemple d’action |
| **Économique** | Payer ses fournisseurs dans les délais |
| **Social** | Former les salariés, favoriser l’égalité |
| **Environnemental** | Réduire ses déchets et ses émissions |

> La RSE n’est pas de la philanthropie : c’est une façon de rester durablement **légitime** aux yeux de ses parties prenantes.

## Exemple travaillé
Une enseigne de vêtements est critiquée pour ses usines lointaines.
- **Changement de l’environnement** : attentes sociétales et écologiques, réseaux sociaux qui amplifient les critiques.
- **Parties prenantes concernées** : clients, ONG, salariés, fournisseurs.
- **Régulation managériale** : audit des fournisseurs, collection en coton recyclé, rapport de durabilité publié.
- **Risque** : si les actes ne suivent pas le discours, l’enseigne est accusée de **greenwashing**.`,
          },
          questions: [
            ['Pourquoi dit-on que l’organisation est un système ouvert ?', ['Parce qu’elle n’a pas de règles', 'Parce que tout le monde peut y entrer', 'Parce qu’elle n’a pas de portes', 'Parce qu’elle est en interaction permanente avec son environnement'], 3, 'Les changements extérieurs agissent sur l’intérieur et réciproquement.'],
            ['Qu’est-ce qu’une partie prenante ?', ['Uniquement un actionnaire', 'Tout acteur qui influence l’organisation ou qui est concerné par son activité', 'Un concurrent direct seulement', 'Un salarié en CDD'], 1, 'Salariés, clients, fournisseurs, État, riverains, associations… sont des parties prenantes.'],
            ['Laquelle est une partie prenante INTERNE ?', ['Un fournisseur', 'Une banque', 'Un salarié', 'Une association de riverains'], 2, 'Salariés, dirigeants et associés sont internes ; les autres sont externes.'],
            ['La RSE correspond à…', ['L’intégration volontaire de préoccupations sociales et environnementales au-delà de la loi', 'Un impôt sur les bénéfices', 'Un label réservé aux associations', 'Une obligation fiscale annuelle'], 0, 'La RSE va au-delà du minimum légal et concerne les relations avec les parties prenantes.'],
            ['Que désigne la régulation managériale ?', ['Le règlement intérieur', 'La publicité comparative', 'Le contrôle des prix par l’État', 'L’action du management pour maintenir l’équilibre de l’organisation face aux perturbations'], 3, 'Ajuster, réorganiser, arbitrer entre parties prenantes : c’est réguler.'],
            ['L’arrivée des plateformes de VTC face aux taxis illustre…', ['Une mutation écologique', 'Une transformation numérique de l’environnement', 'Un changement de statut juridique', 'Une subvention publique'], 1, 'Le numérique fait émerger de nouveaux concurrents et de nouveaux modèles.'],
            ['Les attentes des parties prenantes sont toujours convergentes.', ['Vrai', 'Faux'], 1, 'L’actionnaire, le salarié, le client et le riverain ont des attentes souvent opposées : le management arbitre.'],
            ['Qu’est-ce que le greenwashing ?', ['Un label officiel européen', 'Le nettoyage écologique des locaux', 'Une communication écologique qui ne correspond pas aux actes réels', 'Une subvention pour l’environnement'], 2, 'C’est un risque de la RSE mal assumée : l’écart entre discours et pratiques détruit la confiance.'],
            ['Former ses salariés et favoriser l’égalité femmes-hommes relève du pilier…', ['Social', 'Financier', 'Fiscal', 'Environnemental'], 0, 'Le pilier social de la RSE concerne les conditions de travail et les relations humaines.'],
            ['Quelle mutation pousse les organisations à réduire leurs émissions de gaz à effet de serre ?', ['La mutation démographique', 'La mutation monétaire', 'La mutation juridique des contrats', 'La mutation écologique'], 3, 'Dérèglement climatique, réglementation et attentes des consommateurs en sont les moteurs.'],
            ['Pourquoi une entreprise a-t-elle intérêt à pratiquer la RSE ?', ['Parce que la loi l’impose à toutes les associations', 'Pour rester légitime aux yeux de ses parties prenantes et durer', 'Pour ne plus payer d’impôts', 'Pour supprimer toute concurrence'], 1, 'La RSE sécurise la réputation et la relation avec les clients, salariés et investisseurs.'],
            ['Le numérique ne crée que des opportunités pour les organisations.', ['Vrai', 'Faux'], 1, 'Il crée aussi des menaces : nouveaux concurrents, cyberattaques, dépendance technologique.'],
          ],
        },

        // ---- Thème 2 : Le management stratégique --------------------------
        {
          titre: 'Qu’est-ce que la stratégie ?',
          axe: 'Thème 2 : Le management stratégique, du diagnostic à la fixation des objectifs',
          lecon: {
            titre: 'Choisir un cap pour l’avenir et s’y tenir',
            cours: `Le mot vient du grec *stratêgos*, le chef d’armée. En management, la **stratégie** est l’ensemble des **décisions à long terme** qui engagent le devenir de l’organisation : quels marchés, quelles activités, quels moyens, face à quels concurrents ?

## Une définition
La stratégie est un **ensemble de décisions coordonnées** qui fixent les **orientations à long terme** de l’organisation, en tenant compte de ses **ressources** et de son **environnement**, afin d’atteindre sa **finalité**.

Trois idées en découlent :
1. elle est **globale** : elle concerne toute l’organisation ;
2. elle est **durable** : elle engage l’avenir pour plusieurs années ;
3. elle est **difficilement réversible** : revenir en arrière coûte cher.

## Stratégie, tactique, opérations
| Niveau | Horizon | Exemple dans une marque de sport |
| **Stratégique** | Plusieurs années | Devenir leader de la chaussure de course écoresponsable |
| **Tactique** | Un an environ | Lancer une gamme recyclée cette année |
| **Opérationnel** | Jours, semaines | Organiser la livraison des magasins |

## La démarche stratégique
La stratégie ne s’improvise pas. Elle suit une démarche en étapes :
1. **Rappeler la finalité** de l’organisation.
2. **Réaliser le diagnostic** : interne (forces, faiblesses) et externe (opportunités, menaces).
3. **Fixer les objectifs** stratégiques.
4. **Faire des choix** stratégiques (domaines, avantage concurrentiel, mode de croissance).
5. **Mettre en œuvre** : plan d’actions coordonnées.
6. **Évaluer** les résultats et **ajuster**.

> La stratégie n’est pas un plan figé : c’est un cap qu’on corrige quand l’environnement change.

## Une dimension historique
Les stratégies d’hier éclairent celles d’aujourd’hui. Une entreprise qui a réussi grâce à une recette peut échouer en s’y accrochant quand le monde change : les fabricants d’appareils photo argentiques qui n’ont pas su prendre le virage du numérique en sont un exemple classique. À l’inverse, certaines entreprises se sont réinventées plusieurs fois en changeant de métier.

## Exemple travaillé
Un réseau de salles de sport constate que ses clients s’entraînent de plus en plus chez eux avec des applications.
- **Finalité** : faire un profit durable en aidant les gens à rester en forme.
- **Diagnostic** : force = 40 salles bien situées ; menace = applications gratuites ; opportunité = demande de coaching personnalisé.
- **Objectif stratégique** : 30 % du chiffre d’affaires issu d’abonnements hybrides (salle + application) dans trois ans.
- **Choix** : développer une application maison et des cours en ligne.
- **Évaluation** : suivi du nombre d’abonnés hybrides chaque trimestre.

## À retenir
La stratégie engage **l’avenir**, résulte d’une **démarche** (diagnostic → objectifs → choix → mise en œuvre → évaluation) et doit rester **adaptable**.`,
          },
          questions: [
            ['Quelle est la meilleure définition de la stratégie ?', ['La liste des prix d’un magasin', 'Le règlement intérieur', 'Un ensemble de décisions coordonnées qui fixent les orientations à long terme de l’organisation', 'Le planning hebdomadaire des salariés'], 2, 'Elle tient compte des ressources et de l’environnement pour atteindre la finalité.'],
            ['Quelle est la première étape de la démarche stratégique ?', ['Rappeler la finalité de l’organisation', 'Évaluer les résultats', 'Recruter', 'Choisir un fournisseur'], 0, 'Tout part de la raison d’être : on ne fixe pas un cap sans savoir pourquoi on navigue.'],
            ['Une décision stratégique est facilement réversible.', ['Vrai', 'Faux'], 1, 'Elle engage des ressources importantes pour plusieurs années : revenir en arrière coûte cher.'],
            ['Quel est l’horizon d’une décision tactique ?', ['Plusieurs décennies', 'Il n’a pas d’horizon', 'Quelques heures', 'Environ un an'], 3, 'Le niveau tactique décline la stratégie sur une période intermédiaire, souvent l’année.'],
            ['D’où vient le mot « stratégie » ?', ['De l’arabe « sirat », le chemin', 'Du grec « stratêgos », le chef d’armée', 'Du latin « strata », la route', 'De l’anglais « strategy », la ruse'], 1, 'Le vocabulaire militaire est resté : on parle d’offensive, de positions, de conquête de marchés.'],
            ['Dans la démarche stratégique, que suit immédiatement le diagnostic ?', ['La finalité', 'La mise en œuvre', 'La fixation des objectifs', 'L’évaluation'], 2, 'Le diagnostic est interprété pour fixer des objectifs, puis faire des choix.'],
            ['Pourquoi dit-on que la stratégie n’est pas un plan figé ?', ['Parce qu’elle doit être ajustée quand l’environnement évolue', 'Parce qu’elle n’a pas d’objectif', 'Parce qu’elle est décidée par les clients', 'Parce qu’elle change chaque semaine'], 0, 'L’évaluation et la veille permettent de corriger le cap.'],
            ['Organiser la livraison des magasins de la semaine relève du niveau…', ['Institutionnel', 'Stratégique', 'Tactique', 'Opérationnel'], 3, 'C’est le fonctionnement courant, à très court terme.'],
            ['Quelle leçon tirer de la dimension historique de la stratégie ?', ['Une recette qui a réussi garantit le succès futur', 'S’accrocher à une ancienne réussite peut conduire à l’échec quand l’environnement change', 'Le passé n’a aucune importance', 'Seules les entreprises récentes ont une stratégie'], 1, 'Les fabricants de photo argentique qui ont raté le numérique en sont l’exemple classique.'],
            ['La stratégie concerne l’ensemble de l’organisation.', ['Vrai', 'Faux'], 0, 'Elle est globale : elle oriente toutes les fonctions (production, commercial, ressources humaines…).'],
            ['Quelle est la dernière étape de la démarche stratégique ?', ['Choisir un logo', 'Le diagnostic externe', 'Évaluer les résultats et ajuster', 'Rappeler la finalité'], 2, 'L’évaluation ferme la boucle et relance la démarche.'],
            ['« Obtenir 30 % du chiffre d’affaires grâce aux abonnements hybrides dans trois ans » est…', ['Un objectif stratégique', 'Une décision opérationnelle', 'Une menace', 'Une finalité'], 0, 'Il est chiffré, daté et découle du diagnostic : c’est un objectif stratégique.'],
          ],
        },
        {
          titre: 'Le diagnostic stratégique',
          axe: 'Thème 2 : Le management stratégique, du diagnostic à la fixation des objectifs',
          lecon: {
            titre: 'Se regarder soi-même, regarder autour de soi',
            cours: `Avant de décider où aller, une organisation doit savoir **d’où elle part** et **dans quel monde elle évolue**. C’est le rôle du **diagnostic stratégique**, qui croise un regard intérieur et un regard extérieur.

## La veille stratégique
La **veille** est la surveillance **permanente** de l’environnement : concurrents, technologies, réglementation, clients, fournisseurs. Elle nourrit le diagnostic.
| Type de veille | Ce qu’on surveille |
| **Concurrentielle** | Prix, produits, projets des concurrents |
| **Technologique** | Innovations, brevets |
| **Commerciale** | Attentes des clients, fournisseurs |
| **Juridique** | Nouvelles lois et normes |

## Le diagnostic interne : forces et faiblesses
On analyse les **ressources** (humaines, financières, matérielles, immatérielles, technologiques) et les **compétences** de l’organisation.
- Une **force** est un atout que l’organisation maîtrise (une marque connue, une trésorerie solide).
- Une **faiblesse** est un handicap (un outil de production vieillissant, peu de présence en ligne).
- Une **compétence distinctive** est un savoir-faire que les concurrents ne possèdent pas ou imitent difficilement : c’est elle qui peut fonder un avantage durable.

## Le diagnostic externe : opportunités et menaces
On analyse l’environnement **macro** (général) et **micro** (le secteur).
| Environnement macro | Exemples |
| **Politique** | Stabilité, aides publiques |
| **Économique** | Croissance, pouvoir d’achat, taux d’intérêt |
| **Socioculturel** | Modes de vie, démographie |
| **Technologique** | Numérique, innovations |
| **Écologique** | Climat, ressources |
| **Légal** | Réglementation |

Au niveau micro, on étudie les **concurrents**, les **clients**, les **fournisseurs**, les **produits de substitution** et les **nouveaux entrants**.
- Une **opportunité** est une évolution favorable (une nouvelle demande).
- Une **menace** est une évolution défavorable (un nouveau concurrent, une loi plus stricte).

## Les facteurs clés de succès
Les **facteurs clés de succès** (FCS) sont les éléments **indispensables pour réussir dans un secteur** : ce que les clients attendent absolument. Dans la livraison de repas : la rapidité, le choix de restaurants, une application fiable.

> La réussite de la stratégie tient à l’**articulation** des deux diagnostics : les compétences distinctives de l’organisation doivent correspondre aux facteurs clés de succès de son secteur.

## Exemple travaillé : la matrice SWOT
Une librairie de centre-ville :
| | **Positif** | **Négatif** |
| **Interne** | Forces : libraires experts, fidélité des clients | Faiblesses : pas de site marchand, loyer élevé |
| **Externe** | Opportunités : goût pour les rencontres d’auteurs, prix unique du livre | Menaces : vente en ligne, baisse de fréquentation du centre-ville |

Lecture : s’appuyer sur le conseil et les événements (force × opportunité), corriger l’absence en ligne (faiblesse × menace) avec un site de réservation.`,
          },
          questions: [
            ['Que contient le diagnostic interne ?', ['Les lois du pays uniquement', 'Les prix des concurrents', 'Les opportunités et les menaces', 'Les forces et les faiblesses de l’organisation'], 3, 'Il porte sur les ressources et compétences de l’organisation elle-même.'],
            ['Un nouveau concurrent qui s’installe à côté est…', ['Une opportunité', 'Une menace', 'Une force', 'Une faiblesse'], 1, 'C’est une évolution défavorable de l’environnement externe.'],
            ['Qu’est-ce qu’une compétence distinctive ?', ['Une obligation légale', 'Le nombre de salariés', 'Un savoir-faire que les concurrents ne possèdent pas ou imitent difficilement', 'Le diplôme du dirigeant'], 2, 'C’est la base d’un avantage concurrentiel durable.'],
            ['Que sont les facteurs clés de succès ?', ['Les éléments indispensables pour réussir dans un secteur', 'Les résultats financiers de l’année', 'Les subventions reçues', 'Les forces internes de l’entreprise'], 0, 'Ils se déduisent du diagnostic externe : ce que les clients attendent absolument.'],
            ['La veille stratégique est…', ['Un contrôle fiscal', 'Un audit des comptes', 'Une réunion annuelle', 'Une surveillance permanente de l’environnement'], 3, 'Elle est continue et nourrit le diagnostic.'],
            ['Une trésorerie solide est pour l’entreprise…', ['Une opportunité', 'Une force', 'Un facteur externe', 'Une menace'], 1, 'C’est une ressource que l’organisation maîtrise : une force interne.'],
            ['Dans l’analyse de l’environnement macro, le vieillissement de la population relève du facteur…', ['Politique', 'Technologique', 'Socioculturel (démographique)', 'Légal'], 2, 'Modes de vie et démographie forment l’environnement socioculturel.'],
            ['La réussite de la stratégie repose sur l’articulation entre compétences distinctives et facteurs clés de succès.', ['Vrai', 'Faux'], 0, 'Il faut que ce que l’organisation sait faire mieux que les autres corresponde à ce que le marché exige.'],
            ['Quelle case de la matrice SWOT croise « interne » et « négatif » ?', ['Faiblesses', 'Opportunités', 'Menaces', 'Forces'], 0, 'Les faiblesses sont internes et défavorables.'],
            ['Surveiller les brevets déposés par les concurrents relève de la veille…', ['Commerciale', 'Sociale', 'Juridique', 'Technologique'], 3, 'Les brevets révèlent les innovations à venir : c’est la veille technologique.'],
            ['Le diagnostic externe ne regarde que les concurrents.', ['Vrai', 'Faux'], 1, 'Il couvre aussi l’environnement général (politique, économique, socioculturel, technologique, écologique, légal) et les clients, fournisseurs, substituts, nouveaux entrants.'],
            ['Une nouvelle demande des consommateurs pour des produits locaux est, pour un producteur régional…', ['Une compétence', 'Une opportunité', 'Une faiblesse', 'Une menace'], 1, 'C’est une évolution favorable de l’environnement.'],
          ],
        },
        {
          titre: 'Du diagnostic aux objectifs stratégiques',
          axe: 'Thème 2 : Le management stratégique, du diagnostic à la fixation des objectifs',
          lecon: {
            titre: 'Transformer une analyse en cap chiffré',
            cours: `Un diagnostic ne sert à rien s’il reste un tableau : il faut l’**interpréter** pour fixer des **objectifs**. C’est là que se jouent les choix — et que les intérêts des parties prenantes se rencontrent, parfois s’opposent.

## Finalité, buts, objectifs
| Niveau | Nature | Exemple (une coopérative laitière) |
| **Finalité** | Raison d’être, générale | Faire vivre les éleveurs de la région |
| **Objectif stratégique** | Cap à long terme | Doubler les ventes de fromages bio en cinq ans |
| **Objectif opérationnel** | Déclinaison concrète | Convertir dix fermes au bio cette année |

Les objectifs stratégiques sont **induits** par la finalité et par l’interprétation du diagnostic.

## Un bon objectif
Un objectif utile est souvent **SMART** :
1. **S**pécifique : précis ;
2. **M**esurable : chiffré ;
3. **A**tteignable : réaliste au regard des ressources ;
4. **R**éaliste et pertinent : cohérent avec la finalité ;
5. **T**emporellement défini : daté.

« Faire mieux » n’est pas un objectif ; « réduire de 20 % les délais de livraison d’ici décembre » en est un.

## La RSE dans les objectifs
La responsabilité sociétale est désormais intégrée **dans** les objectifs stratégiques : réduire son empreinte carbone, atteindre l’égalité salariale, s’approvisionner localement. Certaines entreprises inscrivent même une « raison d’être » dans leurs statuts (loi PACTE de 2019), voire deviennent **sociétés à mission**.

## Les parties prenantes et les objectifs
Les objectifs sont fixés par l’équipe dirigeante, mais **inspirés ou appréciés** par les parties prenantes :
- les **actionnaires** attendent de la rentabilité ;
- les **salariés** attendent des emplois et de bonnes conditions de travail ;
- les **clients** attendent qualité et prix ;
- les **pouvoirs publics** attendent le respect de la loi et de l’emploi local.

## Conflits et consensus
Ces attentes provoquent des **conflits** (fermer un site rentable pour les actionnaires mais douloureux pour les salariés). Le management cherche un **consensus** par la **négociation**, la **concertation**, le **compromis**. Deux auteurs classiques :
- **Henri Fayol** (1916) insiste sur l’autorité et l’ordre : le conflit est un dysfonctionnement à réduire ;
- **Mary Parker Follett** (années 1920) montre qu’un conflit peut être **constructif** : on peut chercher une **intégration** qui satisfait les deux parties plutôt qu’un compromis où chacun perd.

> Un objectif accepté par les parties prenantes a bien plus de chances d’être atteint qu’un objectif imposé.

## Exemple travaillé
Diagnostic d’un fabricant de vélos : force = savoir-faire artisanal ; opportunité = essor du vélo électrique et aides publiques ; faiblesse = pas de compétence en batteries.
- **Objectif stratégique** : réaliser 40 % des ventes en vélos électriques d’ici quatre ans.
- **Objectif opérationnel** : nouer un partenariat avec un fabricant de batteries avant la fin de l’année.
- **Conflit possible** : les salariés craignent la fin du vélo classique → consensus trouvé par un plan de formation.`,
          },
          questions: [
            ['D’où découlent les objectifs stratégiques ?', ['Du règlement intérieur', 'Du hasard', 'De la finalité et de l’interprétation du diagnostic', 'Uniquement des demandes des clients'], 2, 'On fixe un cap à partir de sa raison d’être et de l’analyse de sa situation.'],
            ['Lequel est un objectif SMART ?', ['Réduire de 20 % les délais de livraison d’ici décembre', 'Satisfaire tout le monde', 'Faire mieux que l’an dernier', 'Être le meilleur'], 0, 'Il est précis, chiffré, réaliste et daté.'],
            ['Que signifie le M de SMART ?', ['Moderne', 'Majoritaire', 'Motivant', 'Mesurable'], 3, 'Un objectif mesurable permet de vérifier s’il est atteint.'],
            ['Quelle partie prenante attend avant tout de la rentabilité ?', ['Les élèves stagiaires', 'Les actionnaires', 'Les riverains', 'Les associations de consommateurs'], 1, 'Ils ont apporté des capitaux et attendent une rémunération (dividendes, plus-values).'],
            ['Selon Mary Parker Follett, un conflit…', ['N’existe pas dans les organisations', 'Est toujours destructeur', 'Peut être constructif si l’on cherche une solution d’intégration', 'Doit être puni'], 2, 'L’intégration cherche une solution qui satisfait les deux parties au lieu d’un compromis perdant-perdant.'],
            ['Henri Fayol voyait surtout le conflit comme un dysfonctionnement à réduire par l’autorité et l’ordre.', ['Vrai', 'Faux'], 0, 'Pour Fayol, auteur classique de 1916, l’organisation repose sur l’autorité, la discipline et l’unité de commandement.'],
            ['Que permet la loi PACTE de 2019 ?', ['Inscrire une raison d’être dans les statuts d’une société', 'Supprimer l’impôt sur les sociétés', 'Interdire les actionnaires', 'Rendre la RSE illégale'], 0, 'Elle a aussi créé la qualité de société à mission.'],
            ['« Convertir dix fermes au bio cette année » est…', ['Une menace', 'Un facteur clé de succès', 'Une finalité', 'Un objectif opérationnel'], 3, 'Il décline concrètement, à court terme, l’objectif stratégique.'],
            ['Comment le management cherche-t-il un consensus ?', ['En interdisant le dialogue', 'Par la négociation, la concertation et le compromis', 'En ignorant les parties prenantes', 'En supprimant les objectifs'], 1, 'Un objectif accepté a plus de chances d’être atteint.'],
            ['Réduire son empreinte carbone peut être un objectif stratégique.', ['Vrai', 'Faux'], 0, 'La RSE est désormais intégrée dans les objectifs stratégiques eux-mêmes.'],
            ['Pourquoi associer les parties prenantes à la fixation des objectifs ?', ['Pour retarder les décisions', 'Pour éviter de fixer des objectifs', 'Pour les rendre légitimes et augmenter leurs chances d’être atteints', 'Parce que la loi l’impose toujours'], 2, 'Des objectifs imposés suscitent résistances et conflits.'],
            ['Quelle attente est typique des salariés ?', ['Des emplois stables et de bonnes conditions de travail', 'Des prix toujours plus bas', 'Une baisse des impôts locaux', 'Des dividendes élevés'], 0, 'Chaque partie prenante a ses attentes ; celles des salariés portent sur l’emploi et le travail.'],
          ],
        },
        {
          titre: 'Évaluer les objectifs et les pratiques',
          axe: 'Thème 2 : Le management stratégique, du diagnostic à la fixation des objectifs',
          lecon: {
            titre: 'Mesurer pour savoir si l’on avance',
            cours: `Fixer un objectif sans jamais vérifier s’il est atteint, c’est naviguer sans boussole. L’évaluation repose sur des **indicateurs** : des données chiffrées ou qualitatives qui mesurent l’écart entre ce qu’on voulait et ce qu’on obtient.

## Qu’est-ce qu’un indicateur ?
Un **indicateur** est une information, le plus souvent chiffrée, qui permet de **mesurer** l’atteinte d’un objectif ou l’état d’une situation.
| Objectif | Indicateur possible |
| Fidéliser la clientèle | Taux de réachat, nombre de clients fidèles |
| Réduire l’absentéisme | Taux d’absentéisme |
| Réduire l’empreinte carbone | Tonnes de CO2 émises par an |
| Améliorer la qualité | Taux de retours, note de satisfaction |

Un indicateur peut être **quantitatif** (un chiffre) ou **qualitatif** (une appréciation, un avis client).

## Les qualités d’un bon indicateur
Le programme retient plusieurs exigences :
1. **Pertinence** : il mesure vraiment l’objectif visé.
2. **Variété** : plusieurs indicateurs, pour ne pas regarder un seul aspect.
3. **Comparabilité** dans le **temps** (évolution d’une année sur l’autre) et dans l’**espace** (comparaison avec un concurrent ou la moyenne du secteur).
4. **Appropriation par les acteurs** : ceux qui sont évalués doivent le comprendre et l’accepter.
5. Attention aux **conflits internes** : un indicateur mal choisi peut créer des tensions (un vendeur jugé au seul chiffre d’affaires néglige le conseil).

> On gère ce que l’on mesure — mais on déforme ce que l’on mesure mal.

## Calculer un écart et un taux de réalisation
- **Écart** = résultat obtenu − objectif.
- **Taux de réalisation** = (résultat ÷ objectif) × 100.
- **Taux d’évolution** = ((valeur d’arrivée − valeur de départ) ÷ valeur de départ) × 100.

## Exemple travaillé
Un magasin visait 500 000 € de chiffre d’affaires ; il réalise 460 000 €. L’an dernier, il avait fait 400 000 €.
- Écart : 460 000 − 500 000 = **− 40 000 €** (défavorable).
- Taux de réalisation : 460 000 ÷ 500 000 × 100 = **92 %**.
- Taux d’évolution sur un an : (460 000 − 400 000) ÷ 400 000 × 100 = **+ 15 %**.

Lecture : l’objectif n’est pas atteint, mais la progression est forte. L’objectif était-il trop ambitieux ? Faut-il le corriger ou agir (promotion, horaires) ? L’évaluation débouche sur des **mesures correctrices**.

## Le tableau de bord
Le **tableau de bord** regroupe, sur un même document, quelques indicateurs clés, souvent avec des **codes couleur** (vert : objectif atteint, orange : vigilance, rouge : alerte). Il est un outil de **pilotage** pour le manager.

## Évaluer aussi les pratiques
On n’évalue pas seulement les résultats mais la **manière** de les obtenir : une prime qui dope les ventes mais épuise les salariés n’est pas une bonne pratique. L’évaluation intègre donc des indicateurs sociaux et environnementaux.`,
          },
          questions: [
            ['Qu’est-ce qu’un indicateur ?', ['Un salarié chargé du contrôle', 'Un logiciel de comptabilité', 'Une décision stratégique', 'Une information qui permet de mesurer l’atteinte d’un objectif'], 3, 'Il mesure l’écart entre le prévu et le réalisé.'],
            ['Objectif : 200 ventes ; résultat : 150 ventes. Quel est le taux de réalisation ?', ['50 %', '75 %', '125 %', '133 %'], 1, '150 ÷ 200 × 100 = 75 %.'],
            ['Un chiffre d’affaires passe de 80 000 € à 100 000 €. Quel est le taux d’évolution ?', ['+ 20 %', '+ 25 %', '+ 80 %', '+ 125 %'], 1, '(100 000 − 80 000) ÷ 80 000 × 100 = 25 %.'],
            ['Un bon indicateur doit être pertinent, c’est-à-dire…', ['Mesurer vraiment l’objectif visé', 'Toujours exprimé en euros', 'Connu du seul dirigeant', 'Facile à falsifier'], 0, 'Un indicateur hors sujet ne dit rien de l’atteinte de l’objectif.'],
            ['Comparer ses résultats à ceux d’un concurrent, c’est une comparaison…', ['Qualitative seulement', 'Interdite', 'Dans le temps', 'Dans l’espace'], 3, 'Comparer à d’autres organisations ou à la moyenne du secteur, c’est comparer dans l’espace.'],
            ['Un indicateur mal choisi peut créer des conflits internes.', ['Vrai', 'Faux'], 0, 'Un vendeur jugé au seul chiffre d’affaires peut négliger le conseil ou se disputer les clients avec ses collègues.'],
            ['Quel indicateur mesure le mieux la fidélité des clients ?', ['Le nombre de salariés', 'Le taux de réachat', 'Le montant des impôts', 'La surface du magasin'], 1, 'La part des clients qui reviennent acheter est un indicateur de fidélité.'],
            ['Qu’est-ce qu’un tableau de bord ?', ['Le règlement intérieur', 'La liste des fournisseurs', 'Un document qui regroupe quelques indicateurs clés pour piloter', 'Le bilan comptable annuel'], 2, 'Souvent en codes couleur, c’est un outil de pilotage rapide.'],
            ['Objectif 500 000 €, résultat 460 000 €. L’écart est…', ['+ 40 000 €, favorable', '− 40 000 €, défavorable', '92 %', '0 €'], 1, 'Écart = résultat − objectif = − 40 000 € : l’objectif n’est pas atteint.'],
            ['Un avis client écrit est un indicateur…', ['Financier', 'Comptable', 'Quantitatif', 'Qualitatif'], 3, 'Il donne une appréciation et non un chiffre ; il complète les indicateurs quantitatifs.'],
            ['Que fait le manager après avoir constaté un écart défavorable ?', ['Il supprime l’indicateur', 'Il propose des mesures correctrices ou révise l’objectif', 'Il ne fait rien', 'Il change de secteur d’activité'], 1, 'L’évaluation sert à agir : corriger l’action ou ajuster un objectif irréaliste.'],
            ['On évalue seulement les résultats, jamais la manière de les obtenir.', ['Vrai', 'Faux'], 1, 'Les pratiques comptent aussi : des résultats obtenus au prix de l’épuisement des salariés ne sont pas durables.'],
          ],
        },

        // ---- Thème 3 : Les choix stratégiques des organisations -----------
        {
          titre: 'Domaines d’activité et avantage concurrentiel',
          axe: 'Thème 3 : Les choix stratégiques des organisations',
          lecon: {
            titre: 'Où se battre, et avec quelles armes',
            cours: `Une entreprise ne décide pas seulement de « grandir » : elle choisit **dans quels métiers** elle est présente et **comment** elle compte battre ses concurrents dans chacun. Ce sont deux niveaux de choix stratégiques.

## Les domaines d’activité stratégique (DAS)
Un **DAS** est un sous-ensemble homogène des activités de l’entreprise : mêmes clients, mêmes concurrents, mêmes technologies, mêmes facteurs clés de succès. Une marque d’électroménager peut avoir un DAS « petit électroménager » et un DAS « gros électroménager ». Chaque DAS reçoit une **stratégie de domaine**.

## Deux niveaux de stratégie
| Niveau | Question posée | Choix possibles |
| **Stratégie globale** (de l’entreprise) | Dans quels métiers être présent ? | **Spécialisation**, **diversification** |
| **Stratégie de domaine** (par DAS) | Comment gagner dans ce métier ? | **Domination par les coûts**, **différenciation** |

## Spécialisation ou diversification
- **Spécialisation** : se concentrer sur un seul métier. Avantages : expertise, image claire. Risque : tout perdre si ce marché décline.
- **Diversification** : entrer dans de nouveaux métiers. Avantages : répartir les risques, utiliser des compétences existantes. Risque : se disperser dans des métiers mal maîtrisés.

## L’avantage concurrentiel
L’**avantage concurrentiel** est ce qui permet à l’entreprise de faire **mieux** que ses concurrents sur un marché, de façon **durable**. Deux grandes voies :
1. **La domination par les coûts** : produire moins cher que les autres (grandes séries, standardisation, achats massifs) pour vendre moins cher ou dégager plus de marge.
2. **La différenciation** : proposer une offre perçue comme **unique** par les clients (qualité, design, service, image), qui justifie un prix plus élevé. Elle peut aller vers le **haut** (**sophistication** : plus de services, plus de qualité) ou vers le **bas** (**épuration** : une offre dépouillée, réduite à l’essentiel, moins chère — une compagnie aérienne à bas coût).

> Un avantage concurrentiel est **éphémère** : concurrence intense, imitation, innovations rapides l’érodent. Il faut le renouveler sans cesse.

## La chaîne de valeur : intégrer ou externaliser
La **chaîne de valeur** décompose l’activité en étapes qui créent de la valeur (achats, production, logistique, vente, service après-vente…).
- **Intégrer** une étape, c’est la réaliser soi-même (un fabricant qui ouvre ses propres magasins) : maîtrise, mais coûts fixes.
- **Externaliser** (faire faire), c’est la confier à un prestataire (sous-traiter la livraison) : souplesse et coûts réduits, mais dépendance.

## Exemple travaillé
Une enseigne d’ameublement suédoise très connue :
- **stratégie globale** : spécialisation dans l’ameublement et la décoration ;
- **stratégie de domaine** : domination par les coûts (meubles en kit, grandes séries, le client transporte et monte lui-même) ;
- **chaîne de valeur** : conception intégrée, fabrication largement externalisée auprès de fournisseurs.

Une maison de maroquinerie de luxe, au contraire, pratique une **différenciation** par la qualité artisanale, l’image et la rareté.`,
          },
          questions: [
            ['Qu’est-ce qu’un domaine d’activité stratégique (DAS) ?', ['Une filiale obligatoirement cotée', 'Un service administratif de l’entreprise', 'Un sous-ensemble homogène d’activités (mêmes clients, concurrents, technologies)', 'Un pays où l’entreprise est implantée'], 2, 'Chaque DAS a ses propres facteurs clés de succès et reçoit sa stratégie de domaine.'],
            ['Une entreprise qui se concentre sur un seul métier pratique…', ['La spécialisation', 'L’externalisation', 'La différenciation', 'La diversification'], 0, 'La spécialisation apporte l’expertise mais expose au déclin d’un marché unique.'],
            ['Quel est le principal avantage de la diversification ?', ['Supprimer les concurrents', 'Réduire à zéro les coûts fixes', 'Éviter tout investissement', 'Répartir les risques sur plusieurs métiers'], 3, 'Si un marché décline, les autres métiers compensent.'],
            ['La domination par les coûts consiste à…', ['Vendre le plus cher possible', 'Produire moins cher que les concurrents', 'Proposer un produit unique', 'Supprimer la publicité'], 1, 'Grandes séries, standardisation et achats massifs réduisent le coût unitaire.'],
            ['Une compagnie aérienne à bas coût qui supprime les services à bord pratique une différenciation par…', ['Diversification', 'Sophistication', 'Épuration', 'Intégration'], 2, 'L’épuration dépouille l’offre de ses éléments non essentiels pour la rendre moins chère.'],
            ['Un avantage concurrentiel est acquis une fois pour toutes.', ['Vrai', 'Faux'], 1, 'Il est éphémère : les concurrents imitent, les technologies changent.'],
            ['Un fabricant qui ouvre ses propres magasins pratique…', ['L’intégration', 'L’externalisation', 'La sous-traitance', 'La délocalisation'], 0, 'Il prend en charge lui-même une étape en aval de sa chaîne de valeur.'],
            ['Quel est le principal risque de l’externalisation ?', ['La hausse des coûts fixes', 'L’impossibilité de produire', 'La perte de souplesse', 'La dépendance envers le prestataire'], 3, 'L’entreprise gagne en souplesse mais dépend d’un partenaire extérieur.'],
            ['La différenciation permet en général de…', ['Éviter toute concurrence légale', 'Vendre plus cher grâce à une offre perçue comme unique', 'Vendre obligatoirement moins cher', 'Supprimer les clients'], 1, 'Les clients acceptent de payer davantage pour ce qu’ils jugent unique.'],
            ['Choisir entre spécialisation et diversification relève de la stratégie…', ['Commerciale uniquement', 'De domaine', 'Globale', 'Opérationnelle'], 2, 'C’est le choix des métiers de l’entreprise, au niveau global.'],
            ['La chaîne de valeur décompose l’activité en étapes qui créent de la valeur.', ['Vrai', 'Faux'], 0, 'Achats, production, logistique, vente, service : chaque maillon peut être intégré ou externalisé.'],
            ['Une maison de luxe qui mise sur la qualité artisanale et la rareté pratique…', ['La différenciation par sophistication', 'L’épuration', 'La spécialisation par les prix bas', 'La domination par les coûts'], 0, 'Elle monte en gamme : qualité, image, rareté justifient des prix élevés.'],
          ],
        },
        {
          titre: 'Les modalités de développement des entreprises',
          axe: 'Thème 3 : Les choix stratégiques des organisations',
          lecon: {
            titre: 'Grandir seul, en rachetant ou avec d’autres',
            cours: `Une fois ses métiers et son avantage concurrentiel choisis, l’entreprise doit décider **comment** se développer : par ses propres moyens, en rachetant d’autres entreprises, ou en s’alliant. Elle doit aussi décider jusqu’où elle va à l’international et comment le numérique change la donne.

## Croissance interne, croissance externe, partenariats
| Modalité | Principe | Avantages | Inconvénients |
| **Croissance interne** | Se développer par ses propres moyens : investir, recruter, ouvrir des sites | Maîtrise, préserve la culture, indépendance | **Lente**, coûteuse, risquée |
| **Croissance externe** | Racheter ou fusionner avec d’autres entreprises | **Rapide**, acquiert d’un coup clients, savoir-faire, parts de marché | Coût élevé, choc des cultures, contrôle de la concurrence |
| **Partenariat** (alliance, coentreprise, franchise…) | Coopérer avec d’autres sans se fondre | Partage des coûts et des risques, accès à des compétences | Dépendance, conflits entre partenaires, partage des gains |

## Les formes de partenariat
- l’**alliance** entre concurrents sur un projet précis (deux constructeurs qui développent ensemble un moteur) ;
- la **coentreprise** (*joint-venture*) : une société commune créée par deux entreprises ;
- la **franchise** : une marque (franchiseur) autorise un commerçant indépendant (franchisé) à utiliser son enseigne et son savoir-faire contre une redevance ;
- la **sous-traitance** : faire réaliser une partie de sa production par une autre entreprise.

## L’internationalisation
S’implanter à l’étranger permet de **trouver de nouveaux clients**, de **réduire des coûts** ou d’**accéder à des ressources**. Plusieurs degrés d’engagement : exporter, passer par un partenaire local, ouvrir une filiale, produire sur place.

## La numérisation de l’économie
Le numérique transforme les choix stratégiques :
1. les **plateformes** mettent en relation offre et demande à l’échelle mondiale ;
2. les **données massives** et l’**intelligence artificielle** permettent de mieux connaître les clients et d’automatiser ;
3. des entreprises nées en ligne concurrencent les acteurs installés.

## Transparence et secret
Les parties prenantes exigent de plus en plus de **transparence** (sur l’impact environnemental, les conditions de travail). Mais une stratégie ne peut pas tout dire : dévoiler ses projets aux concurrents serait suicidaire. L’entreprise arbitre entre **transparence exigée** et **secret nécessaire** (secret des affaires, protégé par la loi depuis 2018).

> Choisir sa modalité de croissance, c’est arbitrer entre **vitesse**, **coût** et **maîtrise**.

## Exemple travaillé
Une chaîne de boulangeries veut doubler de taille en cinq ans.
- **Croissance interne** : ouvrir 20 boutiques elle-même — maîtrise totale, mais lent et coûteux.
- **Croissance externe** : racheter un réseau régional de 20 boutiques — immédiat, mais cher et il faudra harmoniser deux cultures.
- **Partenariat (franchise)** : 20 boulangers indépendants adoptent l’enseigne — rapide et peu coûteux, mais moins de contrôle sur la qualité.
Le choix dépend de sa **trésorerie**, de l’urgence face aux concurrents et de l’importance qu’elle accorde au contrôle de la qualité.`,
          },
          questions: [
            ['Ouvrir de nouveaux magasins avec ses propres moyens, c’est une croissance…', ['Contractuelle', 'Conjoncturelle', 'Externe', 'Interne'], 3, 'La croissance interne repose sur l’investissement de l’entreprise elle-même.'],
            ['Quel est le principal avantage de la croissance externe ?', ['Sa lenteur', 'Sa rapidité', 'Son faible coût', 'L’absence de risque culturel'], 1, 'Racheter une entreprise, c’est acquérir d’un coup ses clients, son savoir-faire, ses parts de marché.'],
            ['Quel risque est typique d’une fusion entre deux entreprises ?', ['L’interdiction d’embaucher', 'La baisse automatique des prix', 'Le choc des cultures', 'La disparition de la concurrence mondiale'], 2, 'Deux organisations aux habitudes différentes doivent apprendre à travailler ensemble.'],
            ['Dans une franchise, le franchisé est…', ['Un commerçant indépendant qui utilise l’enseigne contre une redevance', 'Un actionnaire majoritaire', 'Un fournisseur de matières premières', 'Un salarié du franchiseur'], 0, 'Il reste juridiquement indépendant mais adopte l’enseigne et le savoir-faire du réseau.'],
            ['Deux entreprises qui créent une société commune forment…', ['Une croissance interne', 'Une délocalisation', 'Une diversification verticale obligatoire', 'Une coentreprise (joint-venture)'], 3, 'La coentreprise est une forme de partenariat.'],
            ['La croissance interne est rapide et peu coûteuse.', ['Vrai', 'Faux'], 1, 'Elle est au contraire lente et coûteuse, mais préserve la maîtrise et la culture.'],
            ['Quel est un avantage du partenariat ?', ['Supprimer toute négociation', 'Partager les coûts et les risques', 'Garder tous les bénéfices pour soi', 'Ne dépendre de personne'], 1, 'On coopère sans fusionner : coûts et risques sont partagés, les gains aussi.'],
            ['Pourquoi une entreprise s’internationalise-t-elle ?', ['Parce que la loi l’impose', 'Pour éviter toute concurrence', 'Pour trouver de nouveaux clients, réduire des coûts ou accéder à des ressources', 'Uniquement pour payer moins d’impôts'], 2, 'Ce sont les trois motifs classiques de l’implantation à l’étranger.'],
            ['Quel phénomène numérique met en relation offre et demande à l’échelle mondiale ?', ['Les plateformes', 'Le télécopieur', 'La franchise', 'Le bilan comptable'], 0, 'Les plateformes bouleversent la concurrence dans de nombreux secteurs.'],
            ['Une entreprise doit toujours dévoiler l’ensemble de sa stratégie à ses parties prenantes.', ['Vrai', 'Faux'], 1, 'Elle arbitre entre la transparence exigée et le secret des affaires : dévoiler ses projets aux concurrents serait dangereux.'],
            ['Faire réaliser une partie de sa production par une autre entreprise, c’est…', ['La fusion', 'L’autofinancement', 'La croissance interne', 'La sous-traitance'], 3, 'La sous-traitance est une forme de partenariat et d’externalisation.'],
            ['Le choix d’une modalité de croissance est un arbitrage entre…', ['Clients, élèves et parents', 'Vitesse, coût et maîtrise', 'Couleur, taille et logo', 'Impôt, douane et TVA'], 1, 'Aucune modalité n’est meilleure dans l’absolu : tout dépend de la situation.'],
          ],
        },
        {
          titre: 'La stratégie des organisations publiques',
          axe: 'Thème 3 : Les choix stratégiques des organisations',
          lecon: {
            titre: 'Servir l’intérêt général sous contrainte',
            cours: `Une mairie qui ouvre une médiathèque, une région qui finance des lycées, l’État qui réforme l’hôpital : les organisations publiques aussi font des **choix stratégiques**. Mais leur boussole n’est pas le profit : c’est l’**intérêt général**.

## L’intérêt général et le service public
L’**intérêt général** désigne ce qui profite à l’ensemble de la collectivité, au-delà des intérêts particuliers. Le **service public** est une activité d’intérêt général assurée ou contrôlée par une personne publique. Il obéit à trois principes :
| Principe | Signification | Exemple |
| **Continuité** | Le service fonctionne sans interruption injustifiée | Les urgences restent ouvertes la nuit |
| **Égalité** | Tous les usagers sont traités de la même manière | Même tarif de cantine pour une même situation |
| **Adaptabilité** (mutabilité) | Le service évolue avec les besoins | Démarches administratives en ligne |

## Les domaines stratégiques de l’action publique
Santé, éducation, sécurité, transports, environnement, culture, emploi, logement… Chaque domaine donne lieu à des **politiques publiques** avec leurs objectifs.

## Les niveaux stratégiques
| Niveau | Acteurs | Exemples de choix |
| **Central** (national) | État, ministères | Réforme du lycée, plan hôpital |
| **Territorial** (local) | Régions, départements, communes, intercommunalités | Transports régionaux, collèges, écoles, voirie |
| **Européen** | Union européenne | Normes environnementales, fonds régionaux |

La stratégie publique s’inscrit de plus en plus dans un **cadre européen** : règles budgétaires, droit de la concurrence, financements.

## Faire ou faire faire : la délégation de service public
Une collectivité peut gérer elle-même un service (**régie**) ou le confier à une entreprise par un contrat de **délégation de service public** (réseau d’eau, transports urbains). Elle garde la responsabilité et contrôle le délégataire.

## Les entreprises publiques
L’État est actionnaire d’**entreprises publiques** qui vendent des biens et services sur des marchés (transport ferroviaire, énergie). Elles concilient mission d’intérêt général et contraintes de gestion d’une entreprise.

## Groupes de pression, conflits d’intérêts et transparence
- Les **groupes de pression** (lobbies, associations, syndicats) cherchent à influencer les décisions publiques.
- Un **conflit d’intérêts** survient quand un décideur public a un intérêt personnel dans une décision : la loi impose des déclarations d’intérêts et une autorité de contrôle (Haute Autorité pour la transparence de la vie publique).
- La **transparence** est une exigence démocratique : budgets publiés, accès aux documents administratifs.

## Évaluer la performance publique
On mesure l’**efficacité** (objectifs atteints), l’**efficience** (au meilleur coût) et la **qualité** du service rendu. Exemple d’indicateurs : délai d’obtention d’un passeport, taux de réussite au bac, temps d’attente aux urgences.

> Une organisation publique ne se juge pas à ses bénéfices mais au **service rendu** à la collectivité, au meilleur coût.

## Exemple travaillé
Une métropole veut réduire la pollution : objectif stratégique = diminuer de 30 % la circulation automobile en dix ans ; choix = nouvelles lignes de tramway confiées en **délégation de service public**, pistes cyclables en **régie** ; indicateurs = fréquentation du tram, qualité de l’air.`,
          },
          questions: [
            ['Quelle est la boussole de la stratégie d’une organisation publique ?', ['Les dividendes', 'Le profit', 'L’intérêt général', 'Le cours de Bourse'], 2, 'L’organisation publique sert la collectivité, pas des actionnaires.'],
            ['Lequel n’est PAS un principe du service public ?', ['Rentabilité', 'Continuité', 'Égalité', 'Adaptabilité'], 0, 'Les trois principes sont continuité, égalité et adaptabilité (mutabilité).'],
            ['Des démarches administratives désormais en ligne illustrent le principe…', ['De continuité', 'De gratuité', 'D’égalité', 'D’adaptabilité'], 3, 'Le service public évolue avec les besoins et les techniques.'],
            ['Qu’est-ce qu’une délégation de service public ?', ['La privatisation définitive d’un service', 'Un contrat par lequel une personne publique confie la gestion d’un service à une entreprise', 'Un impôt local', 'Un service géré par une association de parents'], 1, 'La collectivité reste responsable et contrôle le délégataire.'],
            ['Quand une collectivité gère elle-même un service, on parle de…', ['Sous-traitance', 'Coentreprise', 'Régie', 'Franchise'], 2, 'La régie est la gestion directe par la personne publique.'],
            ['Les régions et les communes relèvent du niveau stratégique…', ['Territorial', 'Européen', 'International', 'Central'], 0, 'Les collectivités territoriales mènent leurs propres stratégies locales.'],
            ['Un conflit d’intérêts survient quand…', ['Deux ministères coopèrent', 'Le budget est voté', 'Deux usagers se disputent', 'Un décideur public a un intérêt personnel dans une décision'], 3, 'La loi impose des déclarations et un contrôle pour préserver l’impartialité.'],
            ['La stratégie publique française est indépendante de toute règle européenne.', ['Vrai', 'Faux'], 1, 'Règles budgétaires, droit de la concurrence et fonds européens encadrent les choix publics.'],
            ['L’efficience d’un service public, c’est…', ['Atteindre ses objectifs à n’importe quel prix', 'Atteindre ses objectifs au meilleur coût', 'Faire du profit', 'Avoir beaucoup d’agents'], 1, 'L’efficacité regarde l’objectif, l’efficience le rapport entre résultat et moyens.'],
            ['Quel indicateur mesure la qualité d’un service public ?', ['Le cours de l’action', 'La marge commerciale', 'Le temps d’attente aux urgences', 'Le dividende versé'], 2, 'Délais, satisfaction, taux de réussite : des indicateurs de service rendu.'],
            ['Les groupes de pression cherchent à influencer les décisions publiques.', ['Vrai', 'Faux'], 0, 'Lobbies, associations, syndicats défendent leurs intérêts auprès des décideurs.'],
            ['Une entreprise publique…', ['Vend des biens ou services tout en portant une mission d’intérêt général', 'Est une association', 'N’a pas de salariés', 'Ne vend jamais rien'], 0, 'Elle concilie contraintes de gestion d’une entreprise et intérêt général.'],
          ],
        },
        {
          titre: 'La stratégie des organisations de la société civile',
          axe: 'Thème 3 : Les choix stratégiques des organisations',
          lecon: {
            titre: 'Non lucratif ne veut pas dire sans stratégie',
            cours: `Une association sportive, une ONG humanitaire, une fondation pour la recherche : ces organisations ne cherchent pas le profit. Pourtant, elles aussi doivent faire des **choix stratégiques** — sans quoi elles s’épuisent ou disparaissent.

## Pourquoi une stratégie ?
Les organisations de la société civile poursuivent un **but non lucratif**, fixé par leur **objet social** (inscrit dans leurs statuts). Mais leur contexte a changé :
1. **raréfaction des ressources** : subventions publiques en baisse, donateurs sollicités de toutes parts ;
2. **multiplication des associations** : plus de 1,5 million en France, qui se disputent dons et bénévoles ;
3. apparition de formes de **« concurrence »** avec des entreprises (services à la personne, formation) ou d’autres associations.

> Elles ne peuvent plus faire l’économie d’une démarche stratégique : diagnostic, objectifs, choix, évaluation.

## L’objet social et les domaines d’activité
L’**objet social** définit la mission de l’organisation (« aider les personnes sans abri », « développer la pratique du rugby »). Autour de lui, l’organisation choisit ses **domaines d’activité** : une association de protection de la nature peut faire de la sensibilisation, gérer des réserves et mener des actions en justice.

## Pérenniser les ressources humaines
| Ressource | Enjeu stratégique |
| **Bénévoles** | Les recruter, les former, les fidéliser (reconnaissance, missions claires) |
| **Salariés** | Professionnaliser certaines tâches, cohabiter avec les bénévoles |
| **Dirigeants élus** | Assurer le renouvellement des responsables |

## Pérenniser les ressources financières
- **Cotisations** des adhérents ;
- **Dons** (particuliers, entreprises par le mécénat) — en partie déductibles des impôts ;
- **Subventions** publiques, souvent liées à des projets ;
- **Ventes** de biens ou services (billetterie, boutique solidaire) ;
- **Legs** et appels à la générosité.
Diversifier ses ressources, c’est réduire sa dépendance à un seul financeur.

## Développer l’organisation
Une association peut **grandir** (nouvelles antennes), **se regrouper** avec d’autres (fédération, fusion) ou nouer des **partenariats** avec des entreprises ou des collectivités.

## La transparence
Parce qu’elle vit de dons et de fonds publics, l’organisation doit **rendre des comptes** : publication des comptes au-delà de certains seuils, contrôle par la Cour des comptes pour les organismes faisant appel à la générosité publique, labels de confiance pour les donateurs.

## Exemple travaillé
Un club de basket amateur perd des licenciés.
- **Diagnostic** : force = bénévoles engagés ; faiblesse = dépendance à une seule subvention municipale ; opportunité = essor du basket 3×3 ; menace = concurrence des salles de sport privées.
- **Objectif** : +20 % de licenciés en trois ans.
- **Choix** : section 3×3 pour les adolescents, partenariat avec un commerce local (mécénat), tournoi payant pour diversifier les recettes.
- **Évaluation** : nombre de licences, part des recettes hors subvention.`,
          },
          questions: [
            ['Qu’est-ce que l’objet social d’une association ?', ['La liste de ses bénévoles', 'Son adresse', 'Son chiffre d’affaires', 'Sa mission, définie dans ses statuts'], 3, 'L’objet social fixe la raison d’être de l’organisation.'],
            ['Pourquoi les associations ont-elles besoin d’une stratégie aujourd’hui ?', ['Parce que la loi les oblige à faire du profit', 'À cause de la raréfaction des ressources et de la concurrence pour les dons et bénévoles', 'Parce qu’elles n’ont plus d’objet social', 'Parce qu’elles sont cotées en Bourse'], 1, 'Subventions en baisse, associations nombreuses, concurrence d’entreprises : la stratégie devient indispensable.'],
            ['Une organisation à but non lucratif ne peut rien vendre.', ['Vrai', 'Faux'], 1, 'Elle peut vendre (billetterie, boutique solidaire), mais ne partage pas de bénéfices entre ses membres.'],
            ['Quel enjeu concerne la ressource humaine « bénévoles » ?', ['Les licencier pour motif économique', 'Leur appliquer un salaire minimum', 'Les recruter, les former et les fidéliser', 'Leur verser des dividendes'], 2, 'Reconnaissance et missions claires aident à les garder engagés.'],
            ['Pourquoi diversifier ses ressources financières ?', ['Pour réduire sa dépendance à un seul financeur', 'Pour payer plus d’impôts', 'Pour devenir une entreprise', 'Pour supprimer les cotisations'], 0, 'Une association qui dépend d’une seule subvention est fragile.'],
            ['Le soutien financier d’une entreprise à une association s’appelle…', ['La franchise', 'La sous-traitance', 'Le dividende', 'Le mécénat'], 3, 'Le mécénat ouvre droit à une réduction d’impôt pour l’entreprise.'],
            ['Pourquoi une association qui fait appel aux dons doit-elle être transparente ?', ['Pour recruter des salariés', 'Parce qu’elle vit de la confiance des donateurs et des fonds publics', 'Parce qu’elle a des actionnaires', 'Pour payer la TVA'], 1, 'Elle rend des comptes : publication des comptes, contrôles, labels.'],
            ['Plusieurs associations qui se regroupent pour peser davantage forment souvent…', ['Une filiale', 'Un cartel', 'Une fédération', 'Une société anonyme'], 2, 'Se regrouper est une modalité de développement des organisations de la société civile.'],
            ['Les organisations de la société civile n’ont aucune forme de concurrence.', ['Vrai', 'Faux'], 1, 'Elles se disputent dons et bénévoles et concurrencent parfois des entreprises (services à la personne, formation).'],
            ['Pour un club de basket amateur, dépendre d’une seule subvention municipale est…', ['Une faiblesse', 'Une opportunité', 'Une menace externe', 'Une force'], 0, 'C’est un handicap interne : si la subvention disparaît, le club est en danger.', 'Dans l’exemple du club de basket, la dépendance à une seule subvention est…'],
            ['Quelle ressource financière est propre aux adhérents ?', ['Les impôts locaux', 'Les droits de douane', 'Les dividendes', 'Les cotisations'], 3, 'Les membres versent une cotisation, souvent annuelle.'],
            ['Quelle est la finalité d’une ONG humanitaire ?', ['Maximiser ses profits', 'Poursuivre un but non lucratif au service d’une cause', 'Rémunérer des actionnaires', 'Gérer un service public régalien'], 1, 'Elle agit pour une cause, sans partage de bénéfices.'],
          ],
        },

        // ---- Méthode ------------------------------------------------------
        {
          titre: 'Méthode : analyser une situation de management',
          axe: 'Méthode',
          lecon: {
            titre: 'Lire un cas d’organisation comme un manager',
            cours: `En management, on ne récite pas un cours : on l’**applique** à une organisation réelle décrite par des documents (article, site, interview, chiffres). C’est l’exercice de tes devoirs de 1re, et c’est exactement ce que demandera l’écrit de terminale (4 heures, sur des organisations réelles, où les notions de management de 1re peuvent être mobilisées).

## Étape 1 : caractériser l’organisation
Avant toute réponse, identifie ce qu’est l’organisation. Une grille simple :
| Critère | Question à te poser |
| **Type** | Entreprise privée, organisation publique, organisation de la société civile ? |
| **Finalité** | Lucrative, intérêt général, non lucrative ? |
| **Statut juridique** | Société, association, établissement public… |
| **Taille** | Effectif, chiffre d’affaires ou budget |
| **Secteur** | Primaire, secondaire, tertiaire ; son métier précis |
| **Champ géographique** | Local, national, international |
| **Ressources** | Humaines, financières, matérielles, immatérielles, technologiques |
| **Production** | Biens / services, marchands / non marchands |

## Étape 2 : lire les questions avant les documents
Repère le **verbe** de chaque question, il fixe ce qu’on attend :
| Verbe | Ce qu’on attend |
| **Identifier, repérer** | Nommer précisément, avec un élément tiré du document |
| **Caractériser** | Décrire avec les notions du cours (type de stratégie, de croissance…) |
| **Analyser** | Décomposer, expliquer causes et effets |
| **Justifier, argumenter** | Donner des arguments appuyés sur le contexte |
| **Évaluer, apprécier** | Peser avantages et limites, conclure |

## Étape 3 : mobiliser la bonne notion
Chaque réponse associe **une notion du cours** et **un élément du document**. Méthode en trois temps :
1. **J’énonce** la notion et je la définis brièvement.
2. **Je l’applique** au cas avec un indice précis (chiffre, citation courte).
3. **Je conclus** en répondant à la question.

> Une notion sans exemple tiré du document est hors sujet ; un exemple sans notion est de la paraphrase.

## Exemple travaillé
Question : « Caractérisez la modalité de croissance choisie par l’entreprise Délices du Sud. » Document : « En 2025, Délices du Sud a racheté la biscuiterie Lemoine et ses 45 salariés. »
- **Notion** : la croissance externe consiste à se développer en rachetant d’autres entreprises ou en fusionnant avec elles.
- **Application** : Délices du Sud a racheté la biscuiterie Lemoine en 2025, avec ses 45 salariés.
- **Conclusion** : il s’agit donc d’une croissance externe, qui lui permet de grandir rapidement en acquérant un savoir-faire et des clients.
- **Pour aller plus loin** (si la question demande d’évaluer) : risque de choc des cultures entre les deux équipes.

## Étape 4 : soigner la rédaction
- Des **phrases complètes**, un paragraphe par idée.
- Le **vocabulaire** du cours (« diagnostic externe », « facteur clé de succès »), jamais d’abréviation de texto.
- Pas de copie de paragraphes entiers du document : reformule et cite court.
- **Relis** l’orthographe : à l’écrit de terminale, deux points sur vingt lui sont réservés.

## Les pièges classiques
1. Confondre **finalité** (raison d’être) et **objectif** (chiffré, daté).
2. Confondre **opportunité** (externe) et **force** (interne).
3. Répondre de façon générale sans utiliser le cas.
4. Oublier de conclure.`,
          },
          questions: [
            ['Quelle est la première étape pour analyser une situation de management ?', ['Lister toutes les notions du cours', 'Rédiger la conclusion', 'Caractériser l’organisation', 'Recopier les documents'], 2, 'On commence par savoir de quelle organisation on parle : type, finalité, taille, secteur…'],
            ['Que demande le verbe « justifier » ?', ['Donner des arguments appuyés sur le contexte', 'Recopier le document', 'Faire un calcul', 'Nommer sans expliquer'], 0, 'Justifier, c’est prouver sa réponse par des éléments précis.'],
            ['Une bonne réponse associe…', ['Uniquement une définition apprise', 'Uniquement une citation du document', 'Une opinion personnelle', 'Une notion du cours et un élément du document'], 3, 'Notion sans exemple = hors sujet ; exemple sans notion = paraphrase.'],
            ['Dans la méthode en trois temps, que fait-on après avoir énoncé la notion ?', ['On conclut directement', 'On l’applique au cas avec un indice précis', 'On change de sujet', 'On recopie le document entier'], 1, 'J’énonce, j’applique, je conclus.'],
            ['Un rachat d’entreprise décrit dans un document doit être caractérisé comme…', ['Une diversification obligatoire', 'Une croissance interne', 'Une croissance externe', 'Un partenariat de franchise'], 2, 'Racheter ou fusionner, c’est croître de façon externe.'],
            ['Il est conseillé de recopier de longs paragraphes du document pour prouver sa réponse.', ['Vrai', 'Faux'], 1, 'On reformule et on cite court : recopier n’est pas analyser.'],
            ['Que demande le verbe « évaluer » ?', ['Peser avantages et limites puis conclure', 'Donner une définition seulement', 'Nommer une organisation', 'Dessiner un schéma'], 0, 'Évaluer, c’est porter une appréciation argumentée.'],
            ['Quel piège faut-il éviter ?', ['Conclure chaque réponse', 'Lire les questions avant les documents', 'Utiliser le vocabulaire du cours', 'Confondre une opportunité (externe) et une force (interne)'], 3, 'L’origine interne ou externe d’un élément est la clé du diagnostic.'],
            ['Combien de points l’écrit de management de terminale réserve-t-il à l’orthographe et à la syntaxe ?', ['Aucun', '2 points sur 20', '5 points sur 20', '10 points sur 20'], 1, 'La note de service de 2026 dédie deux points sur vingt à la maîtrise des normes orthographiques et syntaxiques.'],
            ['Pourquoi lire les questions avant les documents ?', ['Pour gagner des points de présentation', 'Pour éviter de conclure', 'Pour savoir quoi chercher en lisant', 'Parce que les documents sont facultatifs'], 2, 'On lit alors les documents de façon active, en repérant les indices utiles.'],
            ['« Faire mieux que l’an dernier » est une finalité.', ['Vrai', 'Faux'], 1, 'Ce n’est ni une finalité (raison d’être) ni un bon objectif (il n’est ni chiffré ni daté).'],
            ['Quel verbe demande de décomposer une situation et d’en expliquer causes et effets ?', ['Analyser', 'Repérer', 'Nommer', 'Identifier'], 0, 'Analyser va plus loin qu’identifier : on explique les mécanismes.'],
          ],
        },
      ],
    },
  ],
}
