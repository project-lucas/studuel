// SCIENCES DE GESTION ET NUMÉRIQUE — 1re technologique (série STMG). Matière
// NEUVE de la voie technologique : un élève de la voie générale ne la voit
// jamais (cf. BRIEF-techno : `contentLevelFor` range la « 1re techno » au
// niveau '1re').
//
// PROGRAMME : BO spécial n° 1 du 22 janvier 2019 (programme de sciences de
// gestion et numérique de première STMG), en vigueur. Quatre thèmes, dix
// questions de gestion :
//   Thème 1 — De l’individu à l’acteur (3 questions)
//   Thème 2 — Numérique et intelligence collective (3 questions)
//   Thème 3 — Création de valeur et performance (2 questions)
//   Thème 4 — Temps et risque (2 questions)
// Une fiche par question, sauf « Comment un individu devient-il acteur dans une
// organisation ? », coupée en deux (l’individu et la communication d’un côté,
// le groupe, la culture et les relations de l’autre : c’est la question la plus
// chargée en notions du programme). Plus une fiche MÉTHODE sur l’étude de
// gestion, le travail de l’année que l’élève conduit sur une organisation
// réelle et soutient à l’oral (évaluée en contrôle continu).

export default {
  slug: 'sciences-gestion-numerique',
  nom: 'Sciences de gestion et numérique',

  titreMigration: 'SCIENCES DE GESTION ET NUMÉRIQUE 1re STMG — LE PROGRAMME OFFICIEL (12 fiches)',

  motif: `Matière neuve de la voie technologique (série STMG, classe de 1re) :
les sciences de gestion et numérique n'avaient aucune fiche. Ce module installe
le programme officiel (BO spécial n° 1 du 22 janvier 2019) — ses quatre thèmes
et ses dix questions de gestion — en onze fiches, plus une fiche de méthode sur
l'étude de gestion, le travail de l'année conduit sur une organisation réelle et
soutenu à l'oral.`,

  blocs: [
    {
      niveaux: ['1re'],
      positionDepart: 1,
      chapitres: [
        // ---- Thème 1 : De l’individu à l’acteur ---------------------------
        {
          titre: 'Les différents types d’organisation',
          axe: 'Thème 1 : De l’individu à l’acteur',
          lecon: {
            titre: 'Qui possède, qui dirige, qui contrôle ?',
            cours: `Une organisation est un **collectif humain** structuré, construit autour d’un **objet social** et tourné vers la recherche de la performance. Pour la définir et la comparer à d’autres, les sciences de gestion posent quatre questions : à quoi sert-elle, à qui appartient-elle, qui la dirige, et qui contrôle ceux qui la dirigent ?

## Les buts économiques
| Type | But principal | Exemples |
| **Entreprise privée** | Produire des biens et services marchands et réaliser un **profit** | Une start-up, une PME, un groupe industriel |
| **Organisation publique** | Rendre un service d’**intérêt général** | Une mairie, un hôpital, un lycée public |
| **Organisation à but non lucratif** | Servir ses membres ou une cause, **sans partager de bénéfices** | Une association, une mutuelle, une fondation |

## La structure de propriété
La **structure de propriété** décrit **qui détient** l’organisation :
- un **entrepreneur seul** (entreprise individuelle) ;
- des **associés** ou des **actionnaires** qui ont apporté des capitaux (société) ;
- l’**État** ou une **collectivité** (organisation ou entreprise publique) ;
- les **adhérents** ou les **sociétaires** (association, coopérative, mutuelle), selon le principe « une personne, une voix ».

## Le gouvernement des organisations
Le **gouvernement** (ou **gouvernance**) désigne l’ensemble des règles qui organisent le **pouvoir** : qui décide, comment, sous quel contrôle.
| Organisation | Qui détient le pouvoir de décision ? |
| Petite entreprise | Le propriétaire est aussi le dirigeant |
| Société anonyme | Les actionnaires élisent un conseil d’administration, qui nomme la direction générale |
| Association | L’assemblée générale des adhérents élit un bureau (président, trésorier, secrétaire) |
| Organisation publique | Des élus ou l’État nomment les responsables |

## Le contrôle des dirigeants
Quand propriétaires et dirigeants sont des personnes différentes, leurs intérêts peuvent diverger : le dirigeant peut préférer la croissance de l’entreprise (et son prestige), l’actionnaire la rentabilité de ses titres. Des **modes de contrôle** existent :
1. l’**assemblée générale**, qui approuve les comptes et peut révoquer les dirigeants ;
2. le **conseil d’administration**, avec des administrateurs indépendants ;
3. le **commissaire aux comptes**, qui certifie la sincérité des comptes ;
4. la **rémunération** liée aux résultats ;
5. dans le public : les **élus**, la **Cour des comptes**, les **usagers**.

> Plus la propriété est dispersée entre de nombreux actionnaires, plus le contrôle des dirigeants devient un enjeu.

## Exemple travaillé
Une coopérative agricole de 300 producteurs :
- **but** : valoriser la production de ses membres (non lucratif au sens où les excédents reviennent aux coopérateurs) ;
- **propriété** : les 300 coopérateurs ;
- **gouvernement** : chaque coopérateur a **une voix**, quel que soit son apport, en assemblée générale ; un conseil d’administration élu nomme un directeur salarié ;
- **contrôle** : l’assemblée générale annuelle et un commissaire aux comptes.`,
          },
          questions: [
            ['Qu’est-ce que la structure de propriété d’une organisation ?', ['Son chiffre d’affaires', 'La répartition des bureaux', 'Qui détient l’organisation', 'Son organigramme hiérarchique'], 2, 'Entrepreneur, associés, actionnaires, État ou adhérents : la propriété dit à qui appartient l’organisation.'],
            ['Que désigne le gouvernement (gouvernance) d’une organisation ?', ['L’ensemble des règles qui organisent le pouvoir de décision et son contrôle', 'Sa stratégie commerciale', 'Sa comptabilité', 'Les ministres qui la contrôlent'], 0, 'Qui décide, comment et sous quel contrôle : c’est la gouvernance.'],
            ['Dans une association, qui élit le bureau ?', ['Le maire', 'Les donateurs', 'Les salariés', 'L’assemblée générale des adhérents'], 3, 'Les adhérents réunis en assemblée générale élisent leurs responsables.'],
            ['Pourquoi le contrôle des dirigeants est-il un enjeu quand propriétaires et dirigeants sont différents ?', ['Parce qu’il n’y a plus de clients', 'Parce que leurs intérêts peuvent diverger', 'Parce que les dirigeants n’ont pas de salaire', 'Parce que la loi interdit les actionnaires'], 1, 'Le dirigeant peut poursuivre ses propres buts (croissance, prestige) plutôt que ceux des propriétaires.'],
            ['Quel acteur certifie la sincérité des comptes d’une société ?', ['Le client principal', 'Le directeur marketing', 'Le commissaire aux comptes', 'Le délégué syndical'], 2, 'C’est un professionnel indépendant qui contrôle les comptes.'],
            ['Dans une coopérative, chaque membre dispose d’un nombre de voix proportionnel à son apport.', ['Vrai', 'Faux'], 1, 'Le principe coopératif est « une personne, une voix », quel que soit l’apport.'],
            ['Quel est le but principal d’une entreprise privée ?', ['Réaliser un profit en vendant des biens et services', 'Servir ses adhérents sans vendre', 'Collecter l’impôt', 'Rendre un service d’intérêt général'], 0, 'Elle produit pour le marché et cherche un bénéfice.'],
            ['Dans une société anonyme, qui nomme la direction générale ?', ['Le comité social et économique', 'Les fournisseurs', 'Les clients', 'Le conseil d’administration élu par les actionnaires'], 3, 'Les actionnaires élisent le conseil, qui nomme et contrôle la direction.'],
            ['Quel organe peut révoquer les dirigeants d’une société ?', ['La médecine du travail', 'L’assemblée générale des actionnaires', 'Le service comptable', 'Le fournisseur principal'], 1, 'L’assemblée générale approuve les comptes et peut changer les dirigeants.'],
            ['Dans une petite entreprise individuelle, le propriétaire est souvent aussi le dirigeant.', ['Vrai', 'Faux'], 0, 'Il n’y a alors pas de séparation entre propriété et pouvoir, donc peu de problème de contrôle.'],
            ['Qui contrôle notamment la gestion des organisations publiques ?', ['Les concurrents', 'Les actionnaires', 'La Cour des comptes et les élus', 'Les banques'], 2, 'L’argent public est contrôlé par les élus et par les juridictions financières.'],
            ['Une mutuelle est une organisation…', ['À but non lucratif, appartenant à ses sociétaires', 'Publique dirigée par un ministre', 'Individuelle', 'À but lucratif cotée en Bourse'], 0, 'Les sociétaires en sont les propriétaires et élisent leurs représentants.'],
          ],
        },
        {
          titre: 'De l’individu à l’acteur',
          axe: 'Thème 1 : De l’individu à l’acteur',
          lecon: {
            titre: 'Ce que chacun apporte, et comment il communique',
            cours: `Avant d’être un « salarié », un « bénévole » ou un « agent », chacun est un **individu**, avec sa personnalité, ses émotions et sa façon de voir le monde. Il devient un **acteur** de l’organisation quand il agit, communique et interagit avec les autres dans le cadre de ses fonctions.

## Les caractéristiques de l’individu
| Notion | Définition | Exemple |
| **Personnalité** | Ensemble stable de traits qui caractérisent une personne | Extraverti, méthodique, prudent |
| **Émotion** | Réaction affective brève à une situation | Stress avant une présentation |
| **Perception** | Manière dont on sélectionne et interprète les informations | Deux salariés vivent la même réunion différemment |
| **Attitude** | Disposition favorable ou défavorable envers quelque chose | Enthousiasme pour un nouveau logiciel |
| **Contrôle de soi** | Capacité à maîtriser ses réactions | Rester calme face à un client mécontent |
| **Comportement** | Ce que l’individu fait, observable | Arriver en avance, aider un collègue |
| **Compétences** | Savoirs, savoir-faire et savoir-être mobilisés en situation | Maîtriser un tableur, savoir écouter |

> On ne voit pas une attitude ni une perception : on observe des **comportements**, et on en déduit le reste.

## L’identité numérique
L’**identité numérique** est l’ensemble des **traces** qu’une personne laisse en ligne : profils, publications, commentaires, photos, et ce que les autres publient sur elle. Un recruteur la consulte souvent.
Bonnes pratiques :
1. paramétrer la **confidentialité** de ses comptes ;
2. séparer vie **privée** et vie **professionnelle** (un profil professionnel soigné) ;
3. réfléchir avant de publier : ce qui est en ligne y reste ;
4. vérifier régulièrement ce qu’on trouve sur soi avec un moteur de recherche.

## La communication interpersonnelle
Communiquer, c’est **transmettre un message** d’un **émetteur** à un **récepteur**, par un **canal**, dans un **contexte** donné.
| Composante | Question |
| **Émetteur / récepteur** | Qui parle à qui ? |
| **Message** | Que dit-on ? |
| **Canal** | Par quel moyen (oral, écrit, messagerie, visioconférence) ? |
| **Code** | Quelle langue, quel vocabulaire ? |
| **Contexte** | Où, quand, dans quelle relation (hiérarchique ou non) ? |
| **Rétroaction** (*feedback*) | Comment le récepteur montre-t-il qu’il a compris ? |

Les **bruits** (bruit réel, préjugés, jargon, fatigue) perturbent la transmission. La communication est aussi **non verbale** : ton, gestes, regard.

## Exemple travaillé
Léa, nouvelle assistante commerciale, envoie à 23 h un courriel sec à un client : « Votre commande est en retard, c’est la faute du transporteur. »
- **Émotion** : agacement ; **contrôle de soi** insuffisant.
- **Canal** : courriel, sans rétroaction immédiate ; **contexte** : horaire inadapté.
- **Effet** : le client perçoit un manque de respect (sa **perception** diffère de l’intention de Léa).
- **Amélioration** : appeler le client le lendemain, reconnaître le problème, proposer une solution.`,
          },
          questions: [
            ['Qu’est-ce qu’une attitude ?', ['Un diplôme', 'Une réaction physique brève', 'Une action observable', 'Une disposition favorable ou défavorable envers quelque chose'], 3, 'L’attitude ne se voit pas directement : on la déduit des comportements.'],
            ['Quelle notion désigne ce que l’individu fait et qu’on peut observer ?', ['La perception', 'Le comportement', 'L’émotion', 'La personnalité'], 1, 'Le comportement est observable ; perceptions et attitudes se déduisent.'],
            ['Deux salariés sortent de la même réunion avec des avis opposés. Quelle notion l’explique ?', ['Le code', 'Le canal', 'La perception', 'La compétence'], 2, 'Chacun sélectionne et interprète l’information à sa façon.'],
            ['Qu’est-ce que l’identité numérique ?', ['L’ensemble des traces qu’une personne laisse en ligne', 'Le mot de passe de sa messagerie', 'Sa carte d’identité scannée', 'Le numéro de sécurité sociale'], 0, 'Profils, publications et ce que les autres publient sur toi la composent.'],
            ['Quelle est une bonne pratique de gestion de l’identité numérique ?', ['Utiliser le même mot de passe partout', 'Ne jamais vérifier ce qu’on trouve sur soi', 'Tout publier en public', 'Paramétrer la confidentialité de ses comptes'], 3, 'On maîtrise ainsi qui voit quoi.'],
            ['Dans le schéma de la communication, le « canal » désigne…', ['Le contenu du message', 'Le moyen de transmission', 'La personne qui reçoit', 'La langue utilisée'], 1, 'Oral, écrit, messagerie, visioconférence sont des canaux.'],
            ['La rétroaction (feedback) permet…', ['De brouiller le message', 'De couper la communication', 'Au récepteur de montrer qu’il a compris', 'De choisir la langue'], 2, 'Elle permet à l’émetteur de vérifier la réception et d’ajuster.'],
            ['Le jargon technique employé devant un client non spécialiste constitue…', ['Un bruit', 'Une rétroaction', 'Un canal', 'Un contexte favorable'], 0, 'Tout ce qui gêne la compréhension est un bruit, même s’il n’est pas sonore.'],
            ['La communication non verbale n’a aucune influence sur le message.', ['Vrai', 'Faux'], 1, 'Ton, gestes et regard peuvent renforcer ou contredire les mots.'],
            ['Les compétences regroupent…', ['Uniquement l’ancienneté', 'Le salaire et les primes', 'Uniquement les diplômes', 'Savoirs, savoir-faire et savoir-être mobilisés en situation'], 3, 'La compétence se prouve en situation de travail.'],
            ['Rester calme face à un client agressif relève…', ['De l’identité numérique', 'Du contrôle de soi', 'De la perception', 'Du code'], 1, 'C’est la capacité à maîtriser ses réactions émotionnelles.'],
            ['Un recruteur peut consulter l’identité numérique d’un candidat.', ['Vrai', 'Faux'], 0, 'C’est fréquent : d’où l’intérêt de soigner son profil professionnel.'],
          ],
        },
        {
          titre: 'L’individu, le groupe et l’organisation',
          axe: 'Thème 1 : De l’individu à l’acteur',
          lecon: {
            titre: 'Appartenir, obéir, influencer, coopérer',
            cours: `Dans une organisation, personne ne travaille vraiment seul. L’individu appartient à des **groupes**, il s’inscrit dans une **culture**, il entretient des **relations** avec ses collègues et sa hiérarchie. Ces phénomènes relationnels font la vie réelle de l’organisation, bien au-delà de l’organigramme.

## L’individu et le groupe
Un **groupe** est un ensemble de personnes en interaction, qui partagent des objectifs et se reconnaissent comme membres.
| Notion | Définition |
| **Groupe d’appartenance** | Le groupe dont on fait effectivement partie (son équipe) |
| **Groupe de référence** | Le groupe auquel on se compare ou dont on adopte les normes, même sans en faire partie |
| **Statut** | La position de l’individu dans le groupe |
| **Rôle** | Le comportement attendu de lui dans cette position |
| **Identité** | Ce que l’individu retire du groupe pour se définir |

## L’individu et l’organisation : la culture
La **culture d’organisation** est l’ensemble des **valeurs**, **normes**, **codes**, **rites** et **symboles** partagés par ses membres.
- **Normes** : règles de conduite, écrites ou non (le tutoiement, la tenue).
- **Rituels** : pratiques répétées (le petit-déjeuner du lundi, la fête annuelle).
- **Représentations** et **stéréotypes** : images simplifiées qu’on se fait des autres (« les commerciaux ne pensent qu’aux primes »), qui peuvent nuire aux relations.
- **Attribution** : tendance à expliquer le comportement des autres par leur personnalité plutôt que par la situation.

La culture s’exprime aussi dans des outils : **fiche de poste** (missions, responsabilités), **profil de compétences**, **hiérarchie**, **réseau social d’entreprise** (espace numérique d’échange interne).

## Les phénomènes relationnels
| Phénomène | Explication |
| **Relations formelles** | Prévues par l’organigramme : hiérarchie, procédures |
| **Relations informelles** | Spontanées : amitiés, entraide, réseaux internes |
| **Autorité** | Pouvoir **légitime** de donner des ordres, reconnu par ceux qui obéissent |
| **Leadership** | Capacité à **entraîner** les autres, qui peut exister sans position hiérarchique |
| **Argumentation, influence** | Faire évoluer l’opinion des autres par des raisons ou par l’exemple |
| **Motivation, incitation** | Ce qui pousse à agir (intérêt du travail, reconnaissance) ; l’incitation est le levier que l’organisation actionne (prime, promotion) |

> Un chef a de l’autorité par sa fonction ; un leader a de l’influence par sa personne. Le meilleur manager a les deux.

## Conflits et consensus
Les relations peuvent être **conflictuelles** (désaccord sur les tâches, rivalités, conditions de travail) ou **consensuelles**. Savoir gérer un conflit : écouter chaque partie, identifier le vrai problème, chercher une solution acceptable par tous (négociation, médiation).

## Exemple travaillé
Dans un restaurant, le chef de cuisine est le supérieur (relation **formelle**, **autorité**). Mais c’est Samir, serveur depuis dix ans, que tout le monde consulte (**leadership** informel). Le « repas du personnel » avant le service est un **rituel**. Quand deux cuisiniers se disputent les horaires, le chef organise une réunion : chacun expose sa contrainte, un planning alterné est adopté — le conflit débouche sur un **consensus**.`,
          },
          questions: [
            ['Un groupe de référence est…', ['Un fichier de clients', 'Le groupe dont on fait partie', 'Un groupe auquel on se compare ou dont on adopte les normes', 'Le comité de direction'], 2, 'On peut s’identifier à un groupe sans en être membre.'],
            ['Qu’est-ce que la culture d’organisation ?', ['L’ensemble des valeurs, normes, rites et symboles partagés', 'Le budget formation', 'La bibliothèque de l’entreprise', 'Le niveau de diplôme des salariés'], 0, 'Elle donne une identité commune et guide les comportements.'],
            ['Le petit-déjeuner d’équipe chaque lundi est…', ['Une incitation financière', 'Une relation formelle', 'Une norme juridique', 'Un rituel'], 3, 'Une pratique répétée qui renforce le sentiment d’appartenance.'],
            ['Quelle relation est formelle ?', ['Deux collègues qui déjeunent ensemble', 'Un salarié qui rend compte à son supérieur hiérarchique', 'Un groupe d’amis au travail', 'L’entraide spontanée'], 1, 'Elle est prévue par l’organigramme.'],
            ['Le leadership peut exister sans position hiérarchique.', ['Vrai', 'Faux'], 0, 'Un collègue respecté peut entraîner les autres sans être chef.'],
            ['L’autorité se définit comme…', ['Le salaire le plus élevé', 'L’ancienneté seule', 'Un pouvoir légitime de donner des ordres, reconnu par ceux qui obéissent', 'La force physique'], 2, 'Sans reconnaissance, l’autorité se réduit à de la contrainte.'],
            ['Une prime sur objectifs est…', ['Une incitation', 'Un stéréotype', 'Un rituel', 'Une relation informelle'], 0, 'L’incitation est le levier que l’organisation actionne pour stimuler la motivation.'],
            ['« Les commerciaux ne pensent qu’aux primes » est un exemple de…', ['Fiche de poste', 'Leadership', 'Norme', 'Stéréotype'], 3, 'Une image simplifiée et généralisée d’un groupe, qui peut nuire aux relations.'],
            ['Que décrit la fiche de poste ?', ['Le règlement de la cantine', 'Les missions et responsabilités d’un emploi', 'Les amitiés dans l’équipe', 'Le cours de l’action'], 1, 'Elle situe l’individu dans l’organisation formelle.'],
            ['Un réseau social d’entreprise est…', ['Un site de vente en ligne', 'Un fichier de paie', 'Un espace numérique d’échange interne', 'Un syndicat'], 2, 'Il facilite le partage d’informations et les relations entre salariés.'],
            ['Les conflits dans une organisation sont toujours à éviter car ils n’apportent rien.', ['Vrai', 'Faux'], 1, 'Bien gérés, ils révèlent des problèmes et peuvent déboucher sur de meilleures solutions.'],
            ['Le statut d’un individu dans un groupe désigne…', ['Sa position dans le groupe', 'Son salaire', 'Son âge', 'Son adresse'], 0, 'Le rôle est le comportement attendu de lui dans cette position.'],
          ],
        },
        {
          titre: 'Ressources humaines et coût du travail',
          axe: 'Thème 1 : De l’individu à l’acteur',
          lecon: {
            titre: 'Valoriser le travail sans perdre de vue ce qu’il coûte',
            cours: `Le travail humain est une **ressource** à préserver, à développer et à rétribuer. Il a aussi un **coût**. La gestion des ressources humaines (GRH) cherche l’équilibre entre les deux : des salariés compétents et motivés, pour un coût supportable.

## Qualification ou compétence ?
| | **Qualification** | **Compétence** |
| Ce que c’est | Ce que la personne **peut** faire, attesté par un diplôme, un titre, un classement | Ce que la personne **sait faire en situation**, prouvé dans le travail |
| Rattachée à | Le **poste** et la convention collective | L’**individu** |
| Exemple | BTS comptabilité | Savoir clôturer les comptes d’une PME en autonomie |

L’**approche par les compétences** se développe : elle évalue ce qui est réellement mobilisé, et suit mieux les évolutions des métiers.

## Mesurer l’activité de travail
Des **indicateurs** alimentent les **tableaux de bord sociaux** :
= Productivité du travail = production ÷ quantité de travail (heures ou salariés)
= Taux d’absentéisme = heures d’absence ÷ heures théoriques de travail × 100
= Taux de rotation du personnel = ((entrées + sorties) ÷ 2) ÷ effectif moyen × 100

## Le coût du travail
Pour l’employeur, un salarié coûte plus que son salaire net :
| Élément | Contenu |
| **Salaire brut** | Salaire prévu au contrat |
| − cotisations **salariales** | Prélevées sur le brut → donnent le **salaire net** |
| + cotisations **patronales** | Payées en plus par l’employeur |
| **Coût global** | Brut + cotisations patronales (+ autres charges : tickets restaurant, formation…) |

Les cotisations financent la protection sociale (santé, retraite, chômage).

## Exemple travaillé
Une salariée gagne 2 200 € bruts par mois. Hypothèse simplifiée : cotisations salariales 22 %, cotisations patronales 40 % du brut.
- Salaire net ≈ 2 200 × (1 − 0,22) = **1 716 €**.
- Coût pour l’employeur ≈ 2 200 × 1,40 = **3 080 €** par mois, soit 36 960 € par an.
- Elle traite 1 200 dossiers par an pour 1 600 heures : productivité = 1 200 ÷ 1 600 = **0,75 dossier par heure**. Coût du travail par dossier ≈ 36 960 ÷ 1 200 ≈ **30,80 €**.

> Le coût du travail n’a de sens que rapporté à ce que le travail produit : un salarié mieux payé mais bien plus productif peut coûter moins cher par unité produite.

## Conditions de travail et comportements
Horaires, charge, ambiance, sécurité, ergonomie influencent la **motivation**, l’**absentéisme** et la **rotation** du personnel. De mauvaises conditions coûtent cher : recrutements répétés, erreurs, arrêts maladie.

## Internaliser ou externaliser ?
- **Internaliser** : faire réaliser une activité par ses propres salariés (maîtrise, savoir-faire gardé, coûts fixes).
- **Externaliser** : la confier à un prestataire (nettoyage, paie, informatique) ; souplesse, mais dépendance.

## Les nouveaux liens de travail
Le **salariat** (contrat de travail, lien de subordination) n’est plus la seule forme. On voit se développer :
1. l’**auto-entrepreneuriat** (micro-entrepreneur) : travailleur indépendant, sans employeur ;
2. le **travail via des plateformes** numériques (livraison, VTC), dont le statut fait débat ;
3. la **contractualisation** de missions (freelances, portage salarial).
Ces formes apportent de la souplesse à l’organisation, mais moins de protection au travailleur.`,
          },
          questions: [
            ['Quelle différence entre qualification et compétence ?', ['La compétence est toujours un diplôme', 'La qualification ne concerne que les cadres', 'Aucune, ce sont des synonymes', 'La qualification atteste ce qu’on peut faire (diplôme), la compétence ce qu’on sait faire en situation'], 3, 'La compétence se prouve dans le travail ; la qualification est attestée et rattachée au poste.'],
            ['Un salaire brut de 2 000 € avec 22 % de cotisations salariales donne un net d’environ…', ['1 560 €', '1 780 €', '2 440 €', '440 €'], 0, '2 000 × (1 − 0,22) = 1 560 €.'],
            ['Le coût du travail pour l’employeur correspond à…', ['Le salaire brut moins les primes', 'Le salaire net', 'Le salaire brut plus les cotisations patronales et autres charges', 'Les cotisations salariales seules'], 2, 'L’employeur paie le brut et, en plus, les cotisations patronales.'],
            ['Comment calcule-t-on la productivité du travail ?', ['Production ÷ quantité de travail', 'Salaire ÷ production', 'Effectif × heures', 'Chiffre d’affaires − charges'], 0, 'Elle mesure ce que produit une heure ou un salarié.'],
            ['8 000 heures d’absence pour 160 000 heures théoriques : taux d’absentéisme ?', ['2 %', '5 %', '8 %', '20 %'], 1, '8 000 ÷ 160 000 × 100 = 5 %.'],
            ['Confier la paie à un cabinet extérieur, c’est…', ['Internaliser', 'Externaliser', 'Recruter', 'Licencier'], 1, 'On fait faire par un prestataire : souplesse, mais dépendance.'],
            ['Un micro-entrepreneur est lié à ses clients par un contrat de travail.', ['Vrai', 'Faux'], 1, 'Il est indépendant : pas de lien de subordination, pas de contrat de travail.'],
            ['À quoi servent les cotisations sociales ?', ['À rembourser les emprunts de l’entreprise', 'À financer la publicité', 'À financer la protection sociale (santé, retraite, chômage)', 'À payer les dividendes'], 2, 'Salariales et patronales, elles financent les risques sociaux.'],
            ['Pourquoi de mauvaises conditions de travail coûtent-elles cher ?', ['Elles augmentent absentéisme, rotation du personnel et erreurs', 'Elles réduisent les impôts', 'Elles augmentent automatiquement la productivité', 'Elles n’ont aucun effet'], 0, 'Recruter, former et remplacer ont un coût élevé.'],
            ['L’approche par les compétences est rattachée…', ['Au diplôme uniquement', 'Au fournisseur', 'Au poste uniquement', 'À l’individu'], 3, 'Elle évalue ce que la personne mobilise réellement.'],
            ['Un salarié mieux payé peut coûter moins cher par unité produite s’il est plus productif.', ['Vrai', 'Faux'], 0, 'Le coût du travail se juge rapporté à la production.'],
            ['Un tableau de bord social regroupe…', ['Les plans des locaux', 'Des indicateurs sur le personnel (effectif, absentéisme, rotation)', 'Uniquement le chiffre d’affaires', 'Les prix des concurrents'], 1, 'Il aide la GRH à piloter l’activité de travail.'],
          ],
        },

        // ---- Thème 2 : Numérique et intelligence collective ----------------
        {
          titre: 'De la donnée à la connaissance',
          axe: 'Thème 2 : Numérique et intelligence collective',
          lecon: {
            titre: 'Comment une donnée brute devient une ressource',
            cours: `« 37 » ne veut rien dire. « 37 clients ont annulé leur commande cette semaine » commence à dire quelque chose. « Les annulations explosent depuis la hausse des frais de livraison » permet d’agir. Voilà le chemin **donnée → information → connaissance**, au cœur des sciences de gestion.

## Donnée, information, connaissance
| Niveau | Définition | Exemple |
| **Donnée** | Élément brut, non interprété | 37 ; 15/03 ; « Lyon » |
| **Information** | Donnée **mise en forme** et **mise en contexte**, qui a un sens | 37 annulations cette semaine à Lyon |
| **Connaissance** | Information **interprétée** et **assimilée**, qui permet d’agir | Les annulations viennent des frais de livraison : il faut les revoir |

La connaissance se **transmet** (formation, documentation) et devient une ressource collective.

## Rôle, accessibilité et valeur de l’information
L’information sert à **décider**, **coordonner** et **communiquer**. Sa **valeur** dépend de plusieurs qualités : **pertinence**, **fiabilité**, **actualité** (fraîcheur), **accessibilité** au bon moment, **coût** raisonnable d’obtention. Une information exacte arrivée trop tard ne vaut plus rien.

## Le système d’information (SI)
Le **SI** est l’ensemble organisé des **ressources** (personnes, matériels, logiciels, données, procédures) qui permettent de **collecter**, **stocker**, **traiter** et **diffuser** l’information dans l’organisation.
| Fonction | Exemple dans un magasin |
| Collecter | Le code-barres lu en caisse |
| Mémoriser | La base de données des ventes |
| Traiter | Le calcul automatique du stock restant |
| Diffuser | L’alerte « réapprovisionner » envoyée au responsable |

> Le SI ne se réduit pas à l’informatique : des personnes et des procédures en font partie.

## Les données à caractère personnel
Une **donnée personnelle** est toute information se rapportant à une personne **identifiée ou identifiable** : nom, adresse électronique, numéro de téléphone, adresse IP, photo, données de localisation.
Le **RGPD** (règlement général sur la protection des données, appliqué depuis mai 2018 dans l’Union européenne) impose notamment :
1. une **finalité** précise et légitime pour chaque collecte ;
2. la **minimisation** : ne collecter que le nécessaire ;
3. une durée de **conservation** limitée ;
4. la **sécurité** des données ;
5. des **droits** pour les personnes : accès, rectification, effacement, opposition, portabilité.
En France, la **CNIL** contrôle et peut sanctionner.

## Mégadonnées et données ouvertes
- Les **mégadonnées** (*big data*) : des volumes énormes de données, variées, produites à grande vitesse (clics, capteurs, réseaux sociaux). Leur analyse révèle des tendances.
- Les **données ouvertes** (*open data*) : données publiques mises à disposition librement et gratuitement, réutilisables (horaires de transports, qualité de l’air, liste des entreprises). Le portail national data.gouv.fr en recense des milliers.

## Exemple travaillé
Une boulangerie croise ses données de ventes (donnée) avec la météo en données ouvertes. Information : « les jours de pluie, elle vend 30 % de viennoiseries en moins ». Connaissance : « réduire la production de viennoiseries quand la pluie est annoncée ». Résultat : moins d’invendus.`,
          },
          questions: [
            ['Quelle est la différence entre une donnée et une information ?', ['L’information est toujours chiffrée', 'Aucune', 'L’information est une donnée mise en forme et en contexte, qui a un sens', 'La donnée est toujours plus précise'], 2, 'Une donnée brute n’a pas de sens tant qu’elle n’est pas contextualisée.'],
            ['« Les ventes baissent à cause de la hausse des prix : il faut revoir la tarification » relève de…', ['La connaissance', 'Le bruit', 'La donnée', 'L’information'], 0, 'C’est une information interprétée qui permet d’agir.'],
            ['Laquelle est une donnée à caractère personnel ?', ['Le prix d’un produit', 'Le nombre de magasins d’une enseigne', 'La température moyenne en juillet', 'L’adresse électronique d’un client'], 3, 'Elle permet d’identifier une personne.'],
            ['Que signifie le principe de minimisation du RGPD ?', ['Collecter le plus de données possible', 'Ne collecter que les données nécessaires à la finalité', 'Supprimer toutes les données chaque jour', 'Réduire la taille des fichiers'], 1, 'On ne collecte que ce qui sert la finalité annoncée.'],
            ['Quelle autorité contrôle en France le respect de la protection des données ?', ['La Banque de France', 'L’URSSAF', 'La CNIL', 'L’INSEE'], 2, 'La Commission nationale de l’informatique et des libertés peut contrôler et sanctionner.'],
            ['Les données ouvertes (open data) sont…', ['Des données mises à disposition librement et réutilisables', 'Des données personnelles vendues', 'Des données effacées', 'Des données secrètes des entreprises'], 0, 'Horaires de transports, qualité de l’air : chacun peut les réutiliser.'],
            ['Le système d’information se réduit à l’informatique.', ['Vrai', 'Faux'], 1, 'Il comprend aussi des personnes et des procédures.'],
            ['Quelles sont les quatre fonctions du système d’information ?', ['Recruter, former, payer, licencier', 'Emprunter, investir, rembourser, épargner', 'Acheter, produire, vendre, livrer', 'Collecter, mémoriser, traiter, diffuser'], 3, 'Ce sont les fonctions qui transforment les données en informations utiles.'],
            ['Une information exacte mais arrivée trop tard…', ['Garde toute sa valeur', 'Perd sa valeur pour la décision', 'Devient une donnée personnelle', 'Est automatiquement effacée'], 1, 'L’actualité fait partie des qualités qui font la valeur de l’information.'],
            ['Qu’appelle-t-on mégadonnées (big data) ?', ['Un logiciel de traitement de texte', 'Des fichiers imprimés', 'Des volumes énormes de données variées produites à grande vitesse', 'Les données d’une seule personne'], 2, 'Leur analyse permet de repérer des tendances invisibles à petite échelle.'],
            ['Le RGPD reconnaît aux personnes un droit d’accès et d’effacement de leurs données.', ['Vrai', 'Faux'], 0, 'Accès, rectification, effacement, opposition, portabilité font partie de leurs droits.'],
            ['La lecture d’un code-barres en caisse correspond à quelle fonction du SI ?', ['Collecter', 'Diffuser', 'Traiter', 'Archiver'], 0, 'C’est la saisie de la donnée à la source.'],
          ],
        },
        {
          titre: 'Partager l’information : l’intelligence collective',
          axe: 'Thème 2 : Numérique et intelligence collective',
          lecon: {
            titre: 'Quand le groupe devient plus intelligent que chacun',
            cours: `Une encyclopédie en ligne écrite par des milliers de bénévoles, une équipe projet qui co-rédige un document en temps réel, un forum où les clients se dépannent entre eux : le numérique permet de **partager l’information** à une échelle inédite. Bien organisé, ce partage produit une **intelligence collective**.

## L’intelligence collective
L’**intelligence collective** est la capacité d’un groupe à produire des idées, des solutions ou des connaissances **supérieures** à ce que chacun produirait seul, grâce à la **mise en commun** et à la **coopération**.
Conditions : un **objectif partagé**, la **confiance**, des **règles** claires, des **outils** adaptés, la **diversité** des profils.

## Les applications et usages du numérique
| Usage | Outils | Apport |
| **E-communication** | Messagerie, visioconférence, messagerie instantanée | Échanger vite, à distance |
| **Partage de l’information** | Espace de stockage partagé, intranet, wiki | Une information à jour, accessible à tous |
| **Collaboration** | Documents co-édités, gestion de projet, agenda partagé | Travailler ensemble sur le même objet |
| **Communautés en ligne** | Forums, groupes d’entraide, communautés de clients | Mutualiser les savoirs |
| **Réseaux sociaux** | Réseaux grand public ou d’entreprise | Diffuser, créer du lien, veiller |

## Se situer dans un environnement numérique
Dans un espace de travail numérique (comme l’**ENT** de ton lycée), chacun a un **rôle**, des **droits** et des **responsabilités** :
1. **Rôles** : administrateur, contributeur, lecteur.
2. **Droits** : lire, modifier, supprimer, partager — attribués selon le rôle.
3. **Responsabilités** : respecter la confidentialité, ne pas diffuser ce qui n’est pas à soi, protéger son mot de passe.
Une bonne gestion des droits évite les fuites d’information et les suppressions accidentelles.

## L’intelligence artificielle et l’automatisation
L’**intelligence artificielle** (IA) désigne des programmes capables de réaliser des tâches qui semblaient demander de l’intelligence humaine : reconnaître une image, comprendre une question, rédiger un texte, prédire une tendance. Dans les organisations, elle **automatise** des tâches : tri des courriels, réponses d’un agent conversationnel (*chatbot*), lecture automatique des factures, prévision des ventes.
| Opportunités | Risques |
| Gain de temps sur les tâches répétitives | Suppression ou transformation d’emplois |
| Disponibilité 24 h sur 24 | Erreurs, réponses inventées, biais |
| Aide à la décision | Perte de compétences, dépendance |
| Valorisation des données | Protection des données, transparence |
L’Union européenne encadre désormais ces systèmes selon leur niveau de risque (règlement européen sur l’IA, adopté en 2024).

> L’IA ne remplace pas l’intelligence collective : bien utilisée, elle libère du temps pour ce que les humains font mieux ensemble — juger, créer, coopérer.

## Exemple travaillé
Un service client reçoit 500 demandes par jour. Nouvelle organisation : un agent conversationnel répond aux questions simples (horaires, suivi de colis) ; les conseillers traitent les cas complexes et alimentent une **base de connaissances** partagée ; chaque réponse validée enrichit l’outil. Le délai de réponse baisse, les conseillers montent en compétence, et l’information circule.`,
          },
          questions: [
            ['Qu’est-ce que l’intelligence collective ?', ['Un logiciel d’intelligence artificielle', 'Le QI moyen d’une équipe', 'La somme des diplômes des salariés', 'La capacité d’un groupe à produire mieux que chacun seul grâce à la mise en commun'], 3, 'Elle naît de la coopération et du partage d’information.'],
            ['Un document que plusieurs personnes modifient en même temps en ligne illustre…', ['La sous-traitance', 'La collaboration', 'L’externalisation', 'La comptabilité'], 1, 'La co-édition est un usage typique de collaboration.'],
            ['Dans un ENT, le rôle de « lecteur » permet en général…', ['D’administrer le serveur', 'De tout supprimer', 'De consulter sans modifier', 'De changer les droits des autres'], 2, 'Les droits sont attribués selon le rôle.'],
            ['Pourquoi gérer finement les droits d’accès ?', ['Pour éviter fuites d’information et suppressions accidentelles', 'Pour ralentir le travail', 'Pour empêcher toute collaboration', 'Parce que c’est décoratif'], 0, 'Chacun n’accède qu’à ce dont il a besoin.'],
            ['Quelle est une condition de l’intelligence collective ?', ['L’absence de règles', 'Des profils tous identiques', 'La méfiance entre membres', 'Un objectif partagé et la confiance'], 3, 'La diversité des profils est aussi un atout.'],
            ['Un agent conversationnel qui répond aux questions simples des clients est un exemple…', ['D’archivage papier', 'D’automatisation par l’IA', 'De communauté en ligne', 'De réseau social grand public'], 1, 'L’IA automatise des tâches répétitives.'],
            ['L’intelligence artificielle ne commet jamais d’erreur.', ['Vrai', 'Faux'], 1, 'Elle peut se tromper, inventer des réponses ou reproduire des biais : il faut la contrôler.'],
            ['Un forum où les clients se dépannent entre eux est…', ['Un tableau de bord', 'Une messagerie interne', 'Une communauté en ligne', 'Un progiciel de gestion intégré'], 2, 'Les communautés en ligne mutualisent les savoirs des utilisateurs.'],
            ['Quel risque l’IA fait-elle peser sur l’organisation du travail ?', ['La transformation ou la suppression de certains emplois', 'La disparition de l’électricité', 'L’interdiction du télétravail', 'La hausse obligatoire des salaires'], 0, 'Certaines tâches disparaissent, d’autres apparaissent : il faut accompagner les salariés.'],
            ['Comment l’Union européenne encadre-t-elle l’IA ?', ['Elle ne l’encadre pas', 'Par une taxe unique sur les robots', 'Elle l’interdit totalement', 'Par un règlement qui classe les systèmes selon leur niveau de risque'], 3, 'Le règlement européen sur l’IA impose des obligations croissantes avec le risque.'],
            ['Un wiki d’entreprise sert surtout à…', ['Contrôler les absences', 'Partager et mettre à jour des connaissances communes', 'Calculer la paie', 'Vendre en ligne'], 1, 'Chacun peut contribuer à une base de connaissances à jour.'],
            ['Protéger son mot de passe fait partie des responsabilités de l’utilisateur d’un environnement numérique.', ['Vrai', 'Faux'], 0, 'Droits et responsabilités vont ensemble.'],
          ],
        },
        {
          titre: 'Le numérique : agilité ou rigidité ?',
          axe: 'Thème 2 : Numérique et intelligence collective',
          lecon: {
            titre: 'Des processus mieux outillés, pour le meilleur et pour le pire',
            cours: `Les systèmes d’information **structurent** l’organisation : ils fixent qui saisit quoi, dans quel ordre, avec quelles validations. Ils peuvent la rendre **agile** (réactive, souple) ou **rigide** (enfermée dans des procédures). Tout dépend de la façon dont on les conçoit et dont on les utilise.

## Qu’est-ce qu’un processus ?
Un **processus** est un **enchaînement d’activités** qui, à partir d’un **événement déclencheur**, produit un **résultat** pour un client (interne ou externe).
Exemple, le processus de vente en ligne :
~ Commande du client → vérification du paiement → préparation du colis → expédition → facturation → suivi et avis client
On le représente par un **schéma** : acteurs en colonnes, activités, flux d’information, décisions (« paiement accepté ? oui / non »).

## Le système de gestion intégrée (PGI)
Un **progiciel de gestion intégré** (PGI, en anglais *ERP*) est un logiciel unique qui gère l’ensemble des processus (achats, stocks, ventes, comptabilité, paie) autour d’une **base de données commune**.
| Avantages | Limites |
| Une donnée saisie **une seule fois**, disponible partout | Coût d’acquisition et de paramétrage élevé |
| Information **cohérente** et à jour | Procédures standardisées, parfois contraignantes |
| **Traçabilité** des opérations | Dépendance à l’éditeur |
| Automatisation des tâches | Formation nécessaire des utilisateurs |

Autres solutions : **applications métier** (logiciel spécialisé d’un secteur, comme la gestion d’une pharmacie), **solutions de commerce en ligne**, **sites de marché** (plateformes où plusieurs vendeurs proposent leurs produits), **systèmes de gestion industrielle**.

## Les effets de l’automatisation
L’automatisation modifie :
1. la **circulation de l’information** : plus rapide, en temps réel ;
2. l’**organisation du travail** : moins de saisies, plus de contrôle et d’analyse ;
3. le **rôle des acteurs** : le comptable vérifie et conseille plus qu’il ne saisit.

## Le travail à distance et la mobilité
Le **télétravail** et le travail **nomade** (smartphone, ordinateur portable) sont possibles grâce aux outils en ligne. Ils offrent de la souplesse, réduisent les trajets, mais posent des questions : isolement, frontière vie privée / vie professionnelle, sécurité des données.

## L’informatique en nuage (cloud computing)
Le **cloud** consiste à utiliser des ressources informatiques (stockage, logiciels, puissance de calcul) **hébergées à distance** chez un prestataire et accessibles par internet, souvent sous forme d’**abonnement**.
| Avantages | Risques |
| Accès partout, à tout moment | Dépendance au prestataire et à la connexion |
| Pas d’investissement lourd, coûts variables | Sécurité et localisation des données |
| Mises à jour automatiques | Coûts qui grimpent avec l’usage |

> Le numérique rend l’organisation agile quand il fluidifie les processus ; il la rigidifie quand on adapte le travail au logiciel au lieu d’adapter le logiciel au travail.

## Exemple travaillé
Une PME de meubles remplace ses tableurs par un PGI. Avant : la commande est saisie trois fois (commercial, atelier, comptabilité), avec des erreurs. Après : une seule saisie, le stock se met à jour, la facture part automatiquement. Agilité gagnée. Mais le PGI impose une validation par le responsable pour toute remise : les commerciaux ne peuvent plus négocier sur place. Rigidité nouvelle — qu’on corrige en paramétrant un seuil de remise autorisé.`,
          },
          questions: [
            ['Qu’est-ce qu’un processus ?', ['Un organigramme', 'Un logiciel de comptabilité', 'Un enchaînement d’activités qui produit un résultat à partir d’un événement déclencheur', 'Un procès devant le tribunal'], 2, 'Il part d’un déclencheur et aboutit à un résultat pour un client.'],
            ['Quel est le principal avantage d’un PGI ?', ['Une donnée saisie une seule fois est disponible dans tous les services', 'Il est gratuit', 'Il supprime tout besoin de formation', 'Chaque service a sa propre base de données séparée'], 0, 'La base de données commune garantit cohérence et rapidité.'],
            ['Que signifie PGI ?', ['Programme de gestion interne', 'Protocole global d’information', 'Plan général d’investissement', 'Progiciel de gestion intégré'], 3, 'En anglais : ERP (Enterprise Resource Planning).'],
            ['Quel est un risque de l’informatique en nuage ?', ['L’accès depuis n’importe où', 'La dépendance au prestataire et à la connexion', 'Les mises à jour automatiques', 'L’absence d’investissement lourd'], 1, 'Sans connexion ou si le prestataire faillit, l’activité est bloquée.'],
            ['Un logiciel spécialisé pour gérer une pharmacie est…', ['Une donnée ouverte', 'Un tableur', 'Une application métier', 'Un réseau social'], 2, 'Il répond aux besoins propres d’un secteur.'],
            ['L’automatisation transforme le rôle du comptable : il saisit moins et contrôle, analyse et conseille davantage.', ['Vrai', 'Faux'], 0, 'L’automatisation déplace le travail vers des tâches à plus forte valeur.'],
            ['Quand le numérique rigidifie-t-il l’organisation ?', ['Quand on adapte le travail au logiciel au lieu de l’inverse', 'Quand il supprime les doubles saisies', 'Quand il accélère l’information', 'Quand il fluidifie les processus'], 0, 'Des procédures standardisées peuvent enfermer les acteurs.'],
            ['Une plateforme où plusieurs vendeurs proposent leurs produits s’appelle…', ['Un PGI', 'Un intranet', 'Un wiki', 'Un site de marché (place de marché)'], 3, 'Le site de marché met en relation de nombreux vendeurs et acheteurs.'],
            ['Quel est un risque du télétravail ?', ['La réduction des trajets', 'L’isolement et le brouillage entre vie privée et vie professionnelle', 'La souplesse des horaires', 'L’usage d’outils en ligne'], 1, 'Il faut organiser le lien avec l’équipe et le droit à la déconnexion.'],
            ['Dans un schéma de processus, « paiement accepté ? oui / non » représente…', ['Un résultat final', 'Un stock', 'Une décision (un choix)', 'Un acteur'], 2, 'Les décisions orientent la suite du processus.'],
            ['Le cloud computing impose toujours d’acheter ses propres serveurs.', ['Vrai', 'Faux'], 1, 'Au contraire, les ressources sont hébergées chez un prestataire, souvent par abonnement.'],
            ['Quel est un inconvénient d’un PGI ?', ['Un coût d’acquisition et de paramétrage élevé', 'La cohérence des données', 'L’automatisation', 'La traçabilité des opérations'], 0, 'Il faut aussi former les utilisateurs et on dépend de l’éditeur.'],
          ],
        },

        // ---- Thème 3 : Création de valeur et performance -------------------
        {
          titre: 'Mesurer la création de valeur',
          axe: 'Thème 3 : Création de valeur et performance',
          lecon: {
            titre: 'Qui crée la valeur, et comment la partager',
            cours: `Une organisation **crée de la valeur** quand ce qu’elle produit vaut plus que ce qu’elle a consommé pour le produire. Mais la valeur n’est pas qu’un chiffre : elle est aussi financière, partenariale, perçue par les clients. Et elle se **partage** entre ceux qui ont contribué à la créer.

## La valeur ajoutée : création
= Valeur ajoutée = production (chiffre d’affaires) − consommations intermédiaires
Les **consommations intermédiaires** sont les biens et services achetés à d’autres entreprises et détruits ou transformés dans la production (matières premières, énergie, sous-traitance, publicité).

## La valeur ajoutée : répartition
| Bénéficiaire | Forme |
| **Salariés** | Salaires et cotisations sociales |
| **État et collectivités** | Impôts et taxes |
| **Prêteurs** (banques) | Intérêts |
| **Associés, actionnaires** | Dividendes |
| **L’entreprise elle-même** | Bénéfice mis en réserve pour investir (autofinancement) |

La répartition est un **arbitrage** : augmenter les salaires, les dividendes ou l’investissement, c’est faire des choix entre les attentes des acteurs.

## Exemple travaillé
Une brasserie artisanale vend pour 800 000 € de bière. Elle achète 350 000 € de malt, houblon, bouteilles, énergie et transport.
- Valeur ajoutée = 800 000 − 350 000 = **450 000 €**.
- Répartition : salaires et cotisations 300 000 € (**66,7 %**), impôts et taxes 40 000 €, intérêts 10 000 €, dividendes 30 000 €, bénéfice mis en réserve 70 000 €.
- Les salariés reçoivent les deux tiers : c’est courant dans une activité où le travail pèse lourd.

## Les autres formes de valeur
| Forme | Pour qui ? | Comment la mesurer ? |
| **Valeur financière / actionnariale** | Les actionnaires | Bénéfice, dividendes, rentabilité |
| **Valeur boursière** | Les actionnaires d’une société cotée | Cours de l’action × nombre d’actions (capitalisation) |
| **Valeur partenariale** | Toutes les parties prenantes (salariés, fournisseurs, clients, territoire) | Emplois, délais de paiement, retombées locales |
| **Valeur perçue** | Les clients | Image de marque, notoriété, satisfaction, avis en ligne, recommandations, réputation |

## Les documents de synthèse
- Le **compte de résultat** montre l’activité d’une année : **produits** (ventes…) − **charges** (achats, salaires…) = **résultat** (bénéfice ou perte).
- Le **bilan** montre le **patrimoine** à une date : ce que l’entreprise possède (**actif** : bâtiments, machines, stocks, créances, trésorerie) et comment c’est financé (**passif** : capitaux propres, dettes).

## Prix, coût, marge
= Marge = prix de vente − coût
Le **coût** additionne des **charges** (matières, main-d’œuvre, frais divers). Un prix trop bas ne couvre pas les coûts ; un prix trop haut fait fuir les clients si la **qualité** perçue ne suit pas.

> Créer de la valeur ne suffit pas : encore faut-il la mesurer sous toutes ses formes et la répartir d’une façon que les acteurs jugent juste.`,
          },
          questions: [
            ['Comment calcule-t-on la valeur ajoutée ?', ['Salaires + impôts', 'Bénéfice − dividendes', 'Chiffre d’affaires + consommations intermédiaires', 'Chiffre d’affaires − consommations intermédiaires'], 3, 'C’est la richesse créée par l’entreprise elle-même.'],
            ['Un chiffre d’affaires de 500 000 € et 200 000 € de consommations intermédiaires donnent une valeur ajoutée de…', ['700 000 €', '300 000 €', '200 000 €', '2,5'], 1, '500 000 − 200 000 = 300 000 €.'],
            ['Lequel est une consommation intermédiaire ?', ['L’impôt sur les sociétés', 'Le salaire d’un employé', 'L’électricité consommée par l’atelier', 'Le dividende versé'], 2, 'L’énergie est achetée à une autre entreprise et consommée dans la production.'],
            ['Sous quelle forme les banques reçoivent-elles une part de la valeur ajoutée ?', ['Des intérêts', 'Des salaires', 'Des taxes', 'Des dividendes'], 0, 'Les prêteurs sont rémunérés par les intérêts.'],
            ['La valeur perçue concerne surtout…', ['L’administration fiscale', 'Les banques', 'Les actionnaires', 'Les clients'], 3, 'Image, notoriété, satisfaction, avis et réputation la traduisent.'],
            ['Que présente le bilan ?', ['L’activité de l’année', 'Le patrimoine de l’entreprise à une date donnée', 'Les salaires du mois', 'Le planning de production'], 1, 'Actif : ce qu’elle possède ; passif : comment c’est financé.'],
            ['Le compte de résultat permet de calculer…', ['Le nombre de salariés', 'La capitalisation boursière', 'Le bénéfice ou la perte de l’année', 'La valeur des bâtiments'], 2, 'Produits − charges = résultat.'],
            ['La valeur partenariale prend en compte les attentes de toutes les parties prenantes.', ['Vrai', 'Faux'], 0, 'Salariés, fournisseurs, clients, territoire : pas seulement les actionnaires.'],
            ['Un produit coûte 12 € et se vend 15 €. Quelle est la marge unitaire ?', ['27 €', '3 €', '12 €', '1,25 €'], 1, 'Marge = prix de vente − coût = 15 − 12 = 3 €.'],
            ['Quelle part de la valeur ajoutée permet à l’entreprise de s’autofinancer ?', ['Les impôts', 'Les intérêts', 'Les dividendes', 'Le bénéfice mis en réserve'], 3, 'Ce qui reste dans l’entreprise finance ses investissements futurs.'],
            ['La valeur boursière d’une société cotée correspond à…', ['Son chiffre d’affaires', 'Le cours de l’action multiplié par le nombre d’actions', 'Le total de ses salaires', 'Sa valeur ajoutée'], 1, 'C’est la capitalisation boursière.'],
            ['Augmenter les dividendes réduit forcément toutes les autres parts de la valeur ajoutée.', ['Vrai', 'Faux'], 1, 'Si la valeur ajoutée augmente, toutes les parts peuvent croître ; à valeur ajoutée constante, c’est un arbitrage.'],
          ],
        },
        {
          titre: 'La performance globale',
          axe: 'Thème 3 : Création de valeur et performance',
          lecon: {
            titre: 'Réussir sur tous les tableaux, ou choisir ses priorités',
            cours: `Une entreprise très rentable qui épuise ses salariés et pollue sa rivière est-elle performante ? La **performance globale** répond non : elle résulte d’un **équilibre** entre plusieurs dimensions — organisationnelle, commerciale, financière, sociale et environnementale.

## Efficacité et efficience
| Notion | Question | Exemple |
| **Efficacité** | L’objectif est-il atteint ? | 1 000 colis livrés sur 1 000 prévus |
| **Efficience** | Avec quels moyens ? | Livrés avec 10 % de carburant en moins |
On peut être efficace sans être efficient (atteindre l’objectif en gaspillant).

## Les dimensions de la performance
| Dimension | Indicateurs typiques |
| **Des processus** (organisationnelle) | Délais, taux d’erreurs, productivité |
| **Commerciale** | Chiffre d’affaires, **part de marché**, **fidélité** des clients |
| **Financière** | **Rentabilité**, **profitabilité**, dividendes, **autofinancement** |
| **Sociale** | **Bilan social** : effectif, absentéisme, accidents du travail, formation, égalité femmes-hommes |
| **Environnementale** | Émissions de CO2, déchets, consommation d’eau et d’énergie |

## Quelques calculs utiles
= Part de marché = ventes de l’entreprise ÷ ventes totales du marché × 100
= Taux de profitabilité = résultat ÷ chiffre d’affaires × 100
= Taux de rentabilité (financière) = résultat ÷ capitaux propres × 100
- La **profitabilité** mesure ce que rapporte chaque euro **vendu**.
- La **rentabilité** mesure ce que rapporte chaque euro **investi** par les associés.
- L’**autofinancement** : la capacité à financer ses investissements avec ses propres ressources.

## Exemple travaillé
Une entreprise de jus de fruits : chiffre d’affaires 2 000 000 €, résultat 100 000 €, capitaux propres 500 000 €. Le marché régional pèse 20 000 000 €.
- Part de marché = 2 000 000 ÷ 20 000 000 × 100 = **10 %**.
- Profitabilité = 100 000 ÷ 2 000 000 × 100 = **5 %** : 5 centimes de bénéfice par euro vendu.
- Rentabilité financière = 100 000 ÷ 500 000 × 100 = **20 %** : très bonne pour les associés.
Mais le bilan social montre un absentéisme de 9 % (contre 5 % dans le secteur) : la performance **sociale** est faible.

## Le tableau de bord
Le **tableau de bord** rassemble quelques indicateurs clés des différentes dimensions, comparés dans le **temps** (évolution) et dans l’**espace** (concurrents, moyenne du secteur), avec des signaux d’alerte.

## Des performances parfois contradictoires
- Baisser les prix pour gagner des **parts de marché** réduit la **profitabilité**.
- Distribuer plus de **dividendes** réduit l’**autofinancement**.
- Investir dans une usine moins polluante pèse à court terme sur la **performance financière** mais améliore l’**environnementale**.
Les **aspirations des acteurs** (actionnaires, salariés, clients, riverains) sont à la fois des **contraintes** et des **opportunités**.

> La performance globale n’est pas la somme des records : c’est l’équilibre que l’organisation choisit, et qu’elle doit pouvoir justifier.`,
          },
          questions: [
            ['L’efficacité mesure…', ['Le nombre de salariés', 'Le rapport entre résultats et moyens', 'Le degré d’atteinte de l’objectif', 'Le chiffre d’affaires'], 2, 'Efficace : l’objectif est atteint. Efficient : il l’est avec peu de moyens.'],
            ['Livrer autant de colis avec 10 % de carburant en moins améliore…', ['L’efficience', 'La part de marché', 'La valeur boursière', 'L’efficacité seulement'], 0, 'Même résultat, moins de moyens : c’est l’efficience.'],
            ['Ventes de l’entreprise 3 M€, marché total 30 M€. Quelle est sa part de marché ?', ['3 %', '10 %', '30 %', '90 %'], 1, '3 ÷ 30 × 100 = 10 %.'],
            ['Résultat 50 000 €, chiffre d’affaires 1 000 000 €. Quel est le taux de profitabilité ?', ['0,5 %', '5 %', '20 %', '50 %'], 1, '50 000 ÷ 1 000 000 × 100 = 5 %.'],
            ['La rentabilité financière rapporte le résultat…', ['Aux stocks', 'Au chiffre d’affaires', 'Aux capitaux propres', 'Aux salaires'], 2, 'Elle mesure ce que rapporte chaque euro investi par les associés.'],
            ['Quel document présente les indicateurs de la performance sociale ?', ['Le bilan social', 'Le bilan comptable', 'Le compte de résultat', 'La facture'], 0, 'Effectifs, absentéisme, accidents, formation, égalité y figurent.'],
            ['Les émissions de CO2 d’une usine sont un indicateur de performance…', ['Financière', 'Sociale', 'Commerciale', 'Environnementale'], 3, 'Déchets, eau, énergie, émissions mesurent l’impact environnemental.'],
            ['Baisser ses prix pour gagner des parts de marché peut réduire la profitabilité.', ['Vrai', 'Faux'], 0, 'C’est un exemple de performances contradictoires.'],
            ['Le taux de fidélité des clients est un indicateur de performance…', ['Fiscale', 'Commerciale', 'Sociale', 'Environnementale'], 1, 'Chiffre d’affaires, part de marché et fidélité mesurent la performance commerciale.'],
            ['Pourquoi comparer les indicateurs dans l’espace ?', ['Parce que la loi l’impose', 'Pour éviter de comparer dans le temps', 'Pour situer l’organisation par rapport à ses concurrents ou au secteur', 'Pour décorer le tableau de bord'], 2, 'Un chiffre isolé ne dit pas si l’on fait mieux ou moins bien que les autres.'],
            ['Une organisation peut être efficace sans être efficiente.', ['Vrai', 'Faux'], 0, 'Elle atteint l’objectif mais en gaspillant des ressources.'],
            ['Distribuer davantage de dividendes a pour effet de…', ['Réduire l’autofinancement', 'Augmenter la part de marché', 'Réduire l’absentéisme', 'Augmenter l’autofinancement'], 0, 'Ce qui est distribué ne reste pas dans l’entreprise pour investir.'],
          ],
        },

        // ---- Thème 4 : Temps et risque -------------------------------------
        {
          titre: 'Le temps dans la gestion',
          axe: 'Thème 4 : Temps et risque',
          lecon: {
            titre: 'Prévoir, anticiper, donner une valeur au temps',
            cours: `Gérer, c’est décider **aujourd’hui** pour **demain**. Or demain est incertain. Les sciences de gestion outillent l’organisation pour intégrer le temps : horizons, veille, prévisions, budgets et calculs financiers.

## Horizon et période
- L’**horizon** : la distance à laquelle on regarde. **Court terme** (moins d’un an : planning, trésorerie), **moyen terme** (un à cinq ans : investissements), **long terme** (au-delà : stratégie). Plus l’horizon est lointain, plus l’information est **incertaine**.
- La **période** : le découpage du temps, imposé par des contraintes **institutionnelles** (exercice comptable d’un an, durée légale du travail), **sectorielles** (saisons, cycle de production), **technologiques**.

## Actualité et pérennité de l’information
Une information se **périme** : un prix fournisseur, un stock, une réglementation changent. La **veille informationnelle** consiste à surveiller en continu les sources utiles (sites, alertes, lettres d’information, réseaux) pour disposer d’une information **à jour**.
Au sein de l’organisation, l’information n’est pas toujours partagée : **rétention** (quelqu’un la garde pour lui) et **asymétrie d’information** (un acteur en sait plus qu’un autre) faussent les décisions.

## Prévoir l’activité : le seuil de rentabilité
On sépare les charges :
- **charges variables** : elles suivent l’activité (matières, commissions) ;
- **charges fixes** : elles ne dépendent pas de l’activité à court terme (loyer, assurance, salaires fixes).
= Marge sur coût variable (MCV) = chiffre d’affaires − charges variables
= Taux de MCV = MCV ÷ chiffre d’affaires
= Seuil de rentabilité = charges fixes ÷ taux de MCV
Le **seuil de rentabilité** est le chiffre d’affaires à partir duquel l’entreprise ne perd plus d’argent (résultat nul).

## Exemple travaillé : le food-truck
Charges fixes annuelles : 30 000 €. Chaque burger se vend 10 € et coûte 6 € en charges variables.
- MCV unitaire = 10 − 6 = 4 € ; taux de MCV = 4 ÷ 10 = 40 %.
- Seuil de rentabilité = 30 000 ÷ 0,40 = **75 000 €**, soit 75 000 ÷ 10 = **7 500 burgers**.
- Avec 250 jours d’ouverture : 30 burgers par jour au minimum. En vendant 9 000 burgers, le résultat = 9 000 × 4 − 30 000 = **6 000 €**.

## Prévoir la trésorerie : le budget
Le **budget de trésorerie** prévoit, mois par mois, les **encaissements** et les **décaissements**, pour anticiper un manque d’argent (et négocier un découvert) ou un excédent (et le placer).
| | Janvier | Février | Mars |
| Trésorerie de début | 5 000 | 3 000 | − 1 000 |
| + Encaissements | 20 000 | 18 000 | 30 000 |
| − Décaissements | 22 000 | 22 000 | 21 000 |
| Trésorerie de fin | 3 000 | − 1 000 | 8 000 |
Lecture : en février la trésorerie devient négative : il faut l’anticiper dès janvier.

## Le temps a une valeur
Un euro aujourd’hui vaut **plus** qu’un euro dans un an : on peut le placer et toucher des **intérêts**.
= Valeur acquise après n années = capital × (1 + taux)ⁿ
1 000 € placés à 3 % pendant 2 ans deviennent 1 000 × 1,03² = **1 060,90 €**. À l’inverse, **actualiser** une somme future, c’est calculer sa valeur aujourd’hui : 1 060,90 € dans deux ans valent 1 000 € aujourd’hui au taux de 3 %.

> Des outils de **planification** (calendrier prévisionnel, diagramme de Gantt) et de **simulation** (tableur) aident à transformer l’incertitude en décisions.`,
          },
          questions: [
            ['Quel horizon correspond à la stratégie d’une organisation ?', ['Le mois en cours', 'Aucun horizon', 'Le très court terme (une journée)', 'Le long terme'], 3, 'La stratégie engage l’avenir sur plusieurs années.'],
            ['Le loyer d’un magasin est une charge…', ['Variable', 'Fixe', 'Exceptionnelle', 'Intermédiaire uniquement'], 1, 'Il ne dépend pas du volume des ventes à court terme.'],
            ['Charges fixes 20 000 €, taux de marge sur coût variable 25 %. Seuil de rentabilité ?', ['5 000 €', '25 000 €', '80 000 €', '200 000 €'], 2, '20 000 ÷ 0,25 = 80 000 €.'],
            ['Que représente le seuil de rentabilité ?', ['Le chiffre d’affaires pour lequel le résultat est nul', 'Le bénéfice de l’année', 'Le total des charges variables', 'Le chiffre d’affaires maximal'], 0, 'Au-delà, chaque vente supplémentaire dégage du bénéfice.'],
            ['Un produit vendu 20 € avec 12 € de charges variables a une marge sur coût variable unitaire de…', ['32 €', '8 €', '12 €', '40 %'], 1, '20 − 12 = 8 € (soit un taux de 40 %).'],
            ['À quoi sert le budget de trésorerie ?', ['À calculer la valeur ajoutée', 'À prévoir mois par mois encaissements et décaissements', 'À fixer les salaires', 'À choisir un logo'], 1, 'Il permet d’anticiper un manque ou un excédent de trésorerie.'],
            ['1 000 € placés à 5 % pendant un an deviennent…', ['1 005 €', '1 050 €', '1 500 €', '1 100 €'], 1, '1 000 × 1,05 = 1 050 €.'],
            ['Un euro disponible aujourd’hui vaut plus qu’un euro dans un an.', ['Vrai', 'Faux'], 0, 'On peut le placer et percevoir des intérêts : c’est le lien entre temps et valeur financière.'],
            ['Qu’est-ce que la veille informationnelle ?', ['La surveillance continue des sources pour disposer d’informations à jour', 'L’archivage des factures', 'Le contrôle des horaires', 'Une réunion de fin d’année'], 0, 'Une information périmée conduit à de mauvaises décisions.'],
            ['Qu’appelle-t-on asymétrie d’information ?', ['Une erreur de calcul', 'Une information chiffrée', 'Une information partagée par tous', 'Une situation où un acteur en sait plus qu’un autre'], 3, 'Elle peut fausser les décisions et les négociations.'],
            ['Plus l’horizon de prévision est lointain, plus l’information est certaine.', ['Vrai', 'Faux'], 1, 'C’est l’inverse : l’incertitude augmente avec l’horizon.'],
            ['L’exercice comptable d’un an est une contrainte de découpage du temps…', ['Personnelle', 'Institutionnelle', 'Sectorielle', 'Météorologique'], 1, 'Elle est imposée par la loi et les règles comptables.'],
          ],
        },
        {
          titre: 'Performance et risque',
          axe: 'Thème 4 : Temps et risque',
          lecon: {
            titre: 'Pas de performance sans risque, pas de risque sans parade',
            cours: `Lancer un produit, investir dans une machine, s’approvisionner à l’autre bout du monde : chaque décision qui vise à **améliorer la performance** comporte des **risques**, pour l’organisation, pour la société et pour l’environnement. Gérer, c’est les **repérer**, les **évaluer** et les **limiter**.

## Qu’est-ce qu’un risque ?
Un **risque** est un événement **possible** et **incertain** qui aurait des conséquences négatives sur l’atteinte des objectifs. On l’évalue par deux critères :
= Niveau de risque = probabilité × gravité
Un risque très probable mais bénin se traite différemment d’un risque rare mais catastrophique.

## Les facteurs externes de risque
| Facteur | Exemple |
| **Évolution de la demande** | Les clients se détournent d’un produit |
| **Cycle de vie et obsolescence** | Un produit arrive en phase de déclin |
| **Rupture technologique** | Une innovation rend un savoir-faire inutile |
| **Dépendance énergétique** | Flambée du prix de l’énergie |
| **Dépendance technologique** | Un fournisseur unique de composants ou de logiciels |
| **Approvisionnement** | Pénurie, retards, fournisseur défaillant |
| **Empreinte environnementale** | Réglementation plus stricte, image dégradée |

## Les facteurs internes de risque
Ils naissent des **décisions** de l’organisation elle-même : un investissement trop lourd, un endettement excessif, une erreur de recrutement, la dépendance à un seul gros client, une faille de sécurité informatique, une croissance trop rapide.
Le **goût du risque** des dirigeants joue : certains sortent volontiers de leur « zone de confort », d’autres préfèrent la prudence.

## La démarche de gestion des risques
1. **Identifier** les risques (inventaire, retours d’expérience).
2. **Évaluer** probabilité et gravité (souvent sur une **cartographie des risques**).
3. **Traiter** : supprimer, réduire, transférer ou accepter.
4. **Suivre** : indicateurs d’alerte, mise à jour régulière.

| Stratégie | Exemple |
| **Éviter** | Renoncer à un marché trop instable |
| **Réduire** | Diversifier ses fournisseurs, sauvegarder ses données |
| **Transférer** | Souscrire une assurance |
| **Accepter** | Garder un risque faible en le surveillant |

## Risque et performance
Le risque pèse sur la performance : une rupture d’approvisionnement arrête la production, une cyberattaque bloque les ventes. Mais **ne prendre aucun risque** est aussi un risque : l’organisation qui n’innove pas se fait dépasser.

> La performance durable ne vient pas de l’absence de risque, mais de la **maîtrise** des risques qu’on choisit de prendre.

## Les conséquences écologiques de la performance
Chercher à produire plus et moins cher peut **générer des risques** pour la société et l’environnement : pollution, épuisement des ressources, déchets, émissions de gaz à effet de serre. Ces effets reviennent vers l’organisation : sanctions, coûts de dépollution, boycott, perte d’attractivité pour les salariés.

## Exemple travaillé
Une marque de trottinettes électriques fait fabriquer toutes ses batteries par un fournisseur unique en Asie.
- **Risque externe** : dépendance technologique et d’approvisionnement (probabilité moyenne, gravité forte).
- **Risque interne** : décision de ne pas diversifier.
- **Traitement** : second fournisseur européen (réduire), assurance perte d’exploitation (transférer), stock de sécurité de deux mois (réduire).
- **Enjeu écologique** : recyclage des batteries usagées, qui devient aussi un argument commercial.`,
          },
          questions: [
            ['Comment évalue-t-on le niveau d’un risque ?', ['Nombre de salariés ÷ effectif', 'Prix × quantité', 'Probabilité × gravité', 'Chiffre d’affaires − charges'], 2, 'On croise la chance qu’il survienne et l’ampleur de ses conséquences.'],
            ['Souscrire une assurance, c’est…', ['Transférer le risque', 'Accepter le risque', 'Créer un risque', 'Éviter le risque'], 0, 'Les conséquences financières sont transférées à l’assureur.'],
            ['Diversifier ses fournisseurs permet de…', ['Supprimer toute concurrence', 'Augmenter la dépendance', 'Éviter de payer la TVA', 'Réduire le risque d’approvisionnement'], 3, 'Si un fournisseur fait défaut, un autre prend le relais.'],
            ['Une innovation qui rend un savoir-faire inutile est une…', ['Délocalisation', 'Rupture technologique', 'Obsolescence programmée', 'Asymétrie d’information'], 1, 'L’appareil photo numérique face à l’argentique en est un exemple classique.'],
            ['Un endettement excessif décidé par la direction est un risque…', ['Réglementaire', 'Externe', 'Interne', 'Naturel'], 2, 'Il naît des décisions de l’organisation elle-même.'],
            ['Ne prendre aucun risque garantit la performance durable.', ['Vrai', 'Faux'], 1, 'L’organisation qui n’innove pas se fait dépasser : l’immobilisme est aussi un risque.'],
            ['Quelle est la première étape de la gestion des risques ?', ['Identifier les risques', 'Souscrire une assurance', 'Licencier', 'Traiter les risques'], 0, 'Identifier, évaluer, traiter, suivre.'],
            ['La flambée du prix de l’énergie est un facteur de risque lié à…', ['La rétention d’information', 'La culture d’entreprise', 'Le leadership', 'La dépendance énergétique'], 3, 'C’est un facteur externe que l’organisation subit.'],
            ['Une cartographie des risques sert à…', ['Localiser les magasins', 'Visualiser les risques selon leur probabilité et leur gravité', 'Dessiner l’organigramme', 'Calculer la paie'], 1, 'Elle aide à prioriser les actions.'],
            ['Pourquoi la pollution causée par une entreprise finit-elle par peser sur elle ?', ['Elle augmente automatiquement les ventes', 'Elle réduit ses impôts', 'Sanctions, coûts de dépollution, boycott, perte d’attractivité', 'Elle n’a jamais d’effet sur l’entreprise'], 2, 'Les conséquences écologiques reviennent sous forme de coûts et de risques.'],
            ['Dépendre d’un seul gros client est un facteur de risque.', ['Vrai', 'Faux'], 0, 'Si ce client part, une grande part du chiffre d’affaires disparaît.'],
            ['Renoncer à entrer sur un marché très instable, c’est…', ['Éviter le risque', 'Transférer le risque', 'Accepter le risque', 'Réduire la probabilité à zéro par assurance'], 0, 'On supprime l’exposition au risque en renonçant à l’activité.'],
          ],
        },

        // ---- Méthode ------------------------------------------------------
        {
          titre: 'Méthode : réussir l’étude de gestion',
          axe: 'L’étude de gestion',
          lecon: {
            titre: 'Une vraie organisation, une vraie question, ta réponse',
            cours: `L’**étude de gestion** est le grand travail de l’année en sciences de gestion et numérique. Tu choisis une ou plusieurs **organisations réelles**, tu leur poses une **question de gestion** tirée du programme, tu mènes l’enquête et tu présentes tes résultats à l’**oral**. En général, elle est soutenue au troisième trimestre et compte dans ton **contrôle continu** ; les modalités précises sont fixées par ton professeur et ton lycée.

## Les étapes, de septembre à la soutenance
1. **Choisir un thème** qui t’intéresse et qui se rattache à une **question de gestion** du programme (par exemple : « L’amélioration de la performance est-elle sans risque ? »).
2. **Choisir l’organisation** : une entreprise, une association, un service public — accessible (un contact, un site riche, un entretien possible).
3. **Formuler une problématique** : une question précise, appliquée à ton organisation.
4. **Collecter les informations** : documents, site, rapports, entretien, observation, questionnaire.
5. **Analyser** avec les notions du cours.
6. **Conclure** : répondre à la problématique, avec un regard critique.
7. **Préparer la soutenance** orale.

## Formuler une bonne problématique
| Trop vague | Trop fermée | Bonne problématique |
| « Le numérique dans les entreprises » | « Le magasin X a-t-il un site internet ? » | « En quoi la mise en place du click and collect a-t-elle rendu le magasin X plus agile ? » |
Une bonne problématique : une **question**, **ouverte**, **précise**, **reliée au programme**, à laquelle on peut répondre avec les informations disponibles.

## Le carnet de bord
Le **carnet de bord** retrace ta démarche : dates, sources consultées, contacts, difficultés rencontrées, choix faits et pourquoi. Il prouve que l’étude est **la tienne**, et il te sert d’aide-mémoire à l’oral.

## Collecter des informations fiables
- **Sources internes** : site de l’organisation, rapport annuel, documents fournis, entretien avec un salarié ou un responsable.
- **Sources externes** : presse, données publiques (INSEE, données ouvertes), avis clients.
- **Vérifier** : qui parle ? quand ? dans quel but ? Croise toujours au moins deux sources.
- **Citer** ses sources ; ne jamais recopier un texte trouvé en ligne (ni le faire rédiger par une IA) sans le dire.

## Préparer l’entretien
Prépare 8 à 10 questions ouvertes, demande l’autorisation d’enregistrer ou prends des notes, remercie par écrit. Respecte la confidentialité de ce qu’on te confie.

## La soutenance orale
En pratique, elle dure souvent une vingtaine de minutes : un **exposé** de dix minutes au plus, puis un **entretien** avec le jury.
| Temps | Contenu |
| Introduction | L’organisation présentée en quelques chiffres, la question de gestion, la problématique |
| Développement | Deux ou trois parties : ce que tu as observé, analysé avec les notions |
| Conclusion | La réponse à la problématique, une limite, une ouverture |
| Entretien | Justifier tes choix, définir les notions, raconter ta démarche |

> Le jury n’attend pas que tu saches tout sur l’organisation : il attend que tu **raisonnes** avec les notions du programme sur un cas réel, et que tu expliques ta démarche.

## Exemple de plan
Problématique : « Comment l’association sportive Les Aiglons mesure-t-elle la valeur qu’elle crée ? »
1. Une association qui crée plusieurs formes de valeur (sociale pour les jeunes du quartier, perçue par les familles, partenariale avec la mairie).
2. Des indicateurs encore limités (nombre de licenciés, résultats sportifs), peu d’indicateurs qualitatifs.
3. Proposition : un questionnaire de satisfaction annuel et un tableau de bord simple.

## Les erreurs à éviter
1. Une étude descriptive (« l’entreprise a été créée en… ») sans analyse.
2. Aucune notion du programme mobilisée.
3. Lire ses notes à l’oral au lieu de parler au jury.
4. Un diaporama surchargé de texte.`,
          },
          questions: [
            ['Sur quoi porte l’étude de gestion ?', ['Sur un roman étudié en français', 'Sur l’histoire de l’économie', 'Sur une organisation imaginaire', 'Sur une ou plusieurs organisations réelles, à partir d’une question de gestion du programme'], 3, 'On applique les notions du programme à un cas réel.'],
            ['Quelle est une bonne problématique ?', ['Le magasin X a-t-il un site internet ?', 'En quoi le click and collect a-t-il rendu le magasin X plus agile ?', 'Présentation du magasin X', 'Le numérique dans les entreprises'], 1, 'Elle est ouverte, précise, reliée au programme et appliquée à l’organisation.'],
            ['À quoi sert le carnet de bord ?', ['À recopier le cours', 'À noter ses notes des autres matières', 'À retracer sa démarche : sources, contacts, difficultés, choix', 'À remplacer l’oral'], 2, 'Il prouve que l’étude est personnelle et aide à l’oral.'],
            ['Combien de temps dure en général l’exposé de la soutenance ?', ['Dix minutes au plus', 'Une heure', 'Il n’y a pas d’exposé', 'Deux minutes'], 0, 'Un exposé de dix minutes au plus, puis un entretien, environ vingt minutes en tout.'],
            ['Une étude de gestion purement descriptive est satisfaisante.', ['Vrai', 'Faux'], 1, 'Il faut analyser avec les notions du programme, pas seulement décrire.'],
            ['Pourquoi croiser au moins deux sources ?', ['Pour allonger le dossier', 'Parce qu’une seule source est interdite par la loi', 'Pour éviter de citer ses sources', 'Pour vérifier la fiabilité des informations'], 3, 'Une information confirmée par deux sources indépendantes est plus fiable.'],
            ['Quelle est une source interne à l’organisation ?', ['Un article de presse nationale', 'Un entretien avec un responsable de l’organisation', 'Une statistique de l’INSEE', 'Un avis client sur un site extérieur'], 1, 'Les sources internes émanent de l’organisation elle-même.'],
            ['Que faut-il faire en conclusion de l’exposé ?', ['Lire la bibliographie', 'Remercier sans conclure', 'Répondre à la problématique, signaler une limite, ouvrir', 'Recommencer l’introduction'], 2, 'La conclusion apporte la réponse promise dans l’introduction.'],
            ['Que regarde surtout le jury ?', ['Que tu raisonnes avec les notions du programme et que tu expliques ta démarche', 'La longueur du diaporama', 'Le nombre de pages du dossier', 'Que tu connaisses tout sur l’organisation'], 0, 'L’analyse et la démarche comptent plus que l’exhaustivité.'],
            ['Faire rédiger son étude par une IA sans le dire est acceptable.', ['Vrai', 'Faux'], 1, 'L’étude doit être personnelle et les sources citées ; le carnet de bord en témoigne.'],
            ['Lors d’un entretien avec un salarié, il faut…', ['Poser uniquement des questions fermées', 'Publier ses réponses sur les réseaux sociaux', 'Enregistrer sans prévenir', 'Préparer des questions ouvertes et respecter la confidentialité'], 3, 'Préparation, autorisation, remerciement et discrétion.'],
            ['À quoi doit se rattacher le thème de l’étude ?', ['Au règlement intérieur du lycée', 'À une question de gestion du programme de sciences de gestion et numérique', 'À n’importe quel sujet d’actualité', 'Au programme de mathématiques'], 1, 'La problématique est tirée d’une ou plusieurs questions de gestion du programme.'],
          ],
        },
      ],
    },
  ],
}
