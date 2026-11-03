// -----------------------------------------------------------------------------
// LES CURSUS DU SUPÉRIEUR (03/11/2026, Lucas : « préparer l'arrivée des
// étudiants […] on s'attaque au Pareto d'abord, ensuite on fera les
// exceptions »). Cadrage complet : docs/CADRAGE-SUPERIEUR.md.
//
// LE PARETO. Les cinq formations qui pèsent le plus sur Parcoursup 2025 :
// le PASS (plus de 840 000 vœux), la licence de droit (360 000), STAPS,
// psychologie et économie-gestion (environ 150 000 chacune). La vague 2
// (sciences de la vie, LEA, histoire, AES, informatique, sociologie) suivra
// la même recette.
//
// LE MODÈLE, CALQUÉ SUR LA VOIE TECHNO. Une CLASSE par cursus et par année
// (« L1 droit », « L2 droit »…), comme « 1re techno » : c'est elle qui décide
// des matières (`subjects.levels`), de la cohorte, du classement. Le CONTENU
// vit à cette classe exacte (`chapters.level = 'L1 droit'`), comme le
// primaire : aucun alias, rien à replier.
//
// UNE MATIÈRE = UN SLUG, sur plusieurs années quand la discipline continue
// (« Droit civil » en L1, L2 et L3, chacune avec ses chapitres). À
// l'onboarding, TOUTES les matières de l'année sont cochées ; l'étudiant fait
// le tri au stylo (« Éditer » de Réviser), parce qu'une licence n'a pas la
// même maquette d'une université à l'autre.
//
// LE GARDIEN EST CELUI DU SECTEUR, pas de la matière (décision de Lucas) : un
// boss pour le droit, un pour l'économie-gestion… — `gardien`, id de
// lib/bosses.
//
// Logique PURE : aucun import de Supabase ni du catalogue en base.
// -----------------------------------------------------------------------------

export type IdCursus = 'droit' | 'eco' | 'psycho' | 'staps' | 'sante'

/** Les années d'un cursus. Le PASS n'a qu'une année (puis la 2e année de santé). */
export type Annee = 'L1' | 'L2' | 'L3' | 'PASS'

/** Couleur d'une matière : une clé de THEMES (lib/subject-style). */
export type CouleurMatiere =
  | 'blue'
  | 'red'
  | 'orange'
  | 'green'
  | 'purple'
  | 'indigo'
  | 'teal'
  | 'pink'
  | 'yellow'
  | 'slate'

export type MatiereSup = {
  slug: string
  nom: string
  annees: readonly Annee[]
  couleur: CouleurMatiere
  /** Ce qu'on y étudie, année par année — la trame des chapitres à écrire. */
  programme: Partial<Record<Annee, readonly string[]>>
}

export type Cursus = {
  id: IdCursus
  /** Le nom du cursus tel qu'on le dit (« Droit »). */
  nom: string
  /** Écriture courte pour la puce de classe (« Droit », « Éco », « Psycho »). */
  court: string
  annees: readonly Annee[]
  /** Le gardien du secteur (id de lib/bosses). */
  gardien: string
  matieres: readonly MatiereSup[]
}

// -----------------------------------------------------------------------------
// DROIT — licence en trois ans. Maquette commune aux facultés (arrêté licence
// 2014, socle des UFR de droit) ; les intitulés varient, le fond non.
// -----------------------------------------------------------------------------
const DROIT: Cursus = {
  id: 'droit',
  nom: 'Droit',
  court: 'Droit',
  annees: ['L1', 'L2', 'L3'],
  gardien: 'themistor',
  matieres: [
    {
      slug: 'droit-civil',
      nom: 'Droit civil',
      annees: ['L1', 'L2', 'L3'],
      couleur: 'indigo',
      programme: {
        L1: [
          'Introduction au droit : la règle de droit',
          'Les sources du droit et la hiérarchie des normes',
          'La preuve des droits',
          'Les personnes physiques : la personnalité juridique',
          'L’état civil : nom, domicile, actes',
          'Les incapacités : mineurs et majeurs protégés',
          'Les personnes morales',
          'Le couple : mariage, PACS, concubinage',
          'Le divorce',
          'La filiation',
          'L’autorité parentale',
        ],
        L2: [
          'Le contrat : définition et classifications',
          'La formation du contrat : offre et acceptation',
          'Les conditions de validité du contrat',
          'Les nullités',
          'Les effets du contrat',
          'L’inexécution du contrat',
          'La responsabilité extracontractuelle : le fait personnel',
          'La responsabilité du fait des choses',
          'La responsabilité du fait d’autrui',
          'Les accidents de la circulation (loi Badinter)',
          'Les quasi-contrats',
        ],
        L3: [
          'Le régime général des obligations',
          'Les droits réels et la propriété',
          'La possession et l’usucapion',
          'La vente',
          'Le bail',
          'Le contrat d’entreprise et le mandat',
          'Les sûretés',
          'Les successions et les libéralités',
        ],
      },
    },
    {
      slug: 'droit-constitutionnel',
      nom: 'Droit constitutionnel',
      annees: ['L1'],
      couleur: 'blue',
      programme: {
        L1: [
          'L’État : définition et éléments constitutifs',
          'La Constitution et le pouvoir constituant',
          'La séparation des pouvoirs',
          'Les régimes parlementaire et présidentiel',
          'La souveraineté et la représentation',
          'Les constitutions françaises de 1789 à 1958',
          'La Ve République : le président de la République',
          'Le Gouvernement et le Premier ministre',
          'Le Parlement et la procédure législative',
          'Le Conseil constitutionnel et le contrôle de constitutionnalité',
          'La QPC',
        ],
      },
    },
    {
      slug: 'histoire-du-droit',
      nom: 'Histoire du droit et des institutions',
      annees: ['L1'],
      couleur: 'orange',
      programme: {
        L1: [
          'Le droit romain et son héritage',
          'Les royaumes francs',
          'La féodalité',
          'Le renouveau du pouvoir royal',
          'Les coutumes et leur rédaction',
          'La monarchie absolue',
          'La Révolution et le droit',
          'Le Code civil de 1804',
        ],
      },
    },
    {
      slug: 'institutions-juridictionnelles',
      nom: 'Institutions juridictionnelles',
      annees: ['L1'],
      couleur: 'purple',
      programme: {
        L1: [
          'Les principes de la justice',
          'L’ordre judiciaire : les juridictions civiles',
          'Les juridictions pénales',
          'L’ordre administratif',
          'Le Tribunal des conflits',
          'Les magistrats et les auxiliaires de justice',
          'Les juridictions européennes',
        ],
      },
    },
    {
      slug: 'science-politique',
      nom: 'Science politique',
      annees: ['L1'],
      couleur: 'teal',
      programme: {
        L1: [
          'Le pouvoir et la légitimité',
          'L’État et la nation',
          'Les partis politiques',
          'Les élections et le vote',
          'Les groupes d’intérêt',
          'L’opinion publique et les médias',
        ],
      },
    },
    {
      slug: 'economie-politique',
      nom: 'Introduction à l’économie',
      annees: ['L1'],
      couleur: 'yellow',
      programme: {
        L1: [
          'Les grands courants de la pensée économique',
          'Le marché, l’offre et la demande',
          'La monnaie',
          'La croissance et ses mesures',
          'Le rôle de l’État dans l’économie',
          'Le commerce international',
        ],
      },
    },
    {
      slug: 'droit-administratif',
      nom: 'Droit administratif',
      annees: ['L2', 'L3'],
      couleur: 'blue',
      programme: {
        L2: [
          'Les sources du droit administratif',
          'Le principe de légalité',
          'L’organisation administrative : centralisation et décentralisation',
          'Le service public',
          'La police administrative',
          'L’acte administratif unilatéral',
          'Les contrats administratifs',
          'La responsabilité administrative',
        ],
        L3: [
          'Le contentieux administratif : le recours pour excès de pouvoir',
          'Les référés administratifs',
          'Le domaine public',
          'L’expropriation',
          'La fonction publique',
        ],
      },
    },
    {
      slug: 'droit-penal',
      nom: 'Droit pénal',
      annees: ['L2', 'L3'],
      couleur: 'red',
      programme: {
        L2: [
          'Le principe de légalité criminelle',
          'L’application de la loi pénale dans le temps et l’espace',
          'L’élément matériel de l’infraction',
          'L’élément moral de l’infraction',
          'La tentative',
          'La complicité',
          'Les causes d’irresponsabilité pénale',
          'La responsabilité pénale des personnes morales',
          'Les peines',
        ],
        L3: [
          'Les atteintes à la vie',
          'Les atteintes à l’intégrité physique',
          'Le vol, l’escroquerie, l’abus de confiance',
          'La procédure pénale : l’enquête',
          'L’action publique et l’instruction',
          'Le jugement',
        ],
      },
    },
    {
      slug: 'finances-publiques',
      nom: 'Finances publiques',
      annees: ['L2'],
      couleur: 'green',
      programme: {
        L2: [
          'Les principes budgétaires',
          'La LOLF et la loi de finances',
          'Le vote et l’exécution du budget',
          'Le contrôle des finances publiques',
          'Les finances locales',
          'Les finances sociales',
        ],
      },
    },
    {
      slug: 'droit-des-affaires',
      nom: 'Droit des affaires',
      annees: ['L2', 'L3'],
      couleur: 'purple',
      programme: {
        L2: [
          'Les actes de commerce',
          'Le commerçant',
          'Le fonds de commerce',
          'Le bail commercial',
          'Les contrats commerciaux',
        ],
        L3: [
          'Le contrat de société',
          'La SARL',
          'La société anonyme',
          'La SAS',
          'Les dirigeants et leur responsabilité',
          'Les entreprises en difficulté',
        ],
      },
    },
    {
      slug: 'droit-europeen',
      nom: 'Droit de l’Union européenne',
      annees: ['L2'],
      couleur: 'indigo',
      programme: {
        L2: [
          'La construction européenne',
          'Les institutions de l’Union',
          'Les sources du droit de l’Union',
          'La primauté et l’effet direct',
          'Le renvoi préjudiciel',
          'Le marché intérieur et les libertés de circulation',
        ],
      },
    },
    {
      slug: 'droit-international',
      nom: 'Droit international public',
      annees: ['L3'],
      couleur: 'teal',
      programme: {
        L3: [
          'Les sujets du droit international',
          'Les traités',
          'La coutume internationale',
          'La responsabilité internationale',
          'Le règlement pacifique des différends',
          'L’ONU et le maintien de la paix',
        ],
      },
    },
    {
      slug: 'droit-du-travail',
      nom: 'Droit du travail',
      annees: ['L3'],
      couleur: 'orange',
      programme: {
        L3: [
          'Les sources du droit du travail',
          'Le contrat de travail',
          'Le CDD et le travail temporaire',
          'Le temps de travail et le salaire',
          'La rupture du contrat de travail',
          'Le licenciement',
          'Les représentants du personnel',
          'La grève',
        ],
      },
    },
    {
      slug: 'libertes-fondamentales',
      nom: 'Libertés fondamentales',
      annees: ['L3'],
      couleur: 'pink',
      programme: {
        L3: [
          'Les sources des libertés',
          'La Convention européenne des droits de l’homme',
          'Le droit à la vie et à la dignité',
          'La liberté d’expression',
          'La liberté de religion et la laïcité',
          'Le droit au respect de la vie privée',
        ],
      },
    },
    {
      slug: 'droit-fiscal',
      nom: 'Droit fiscal',
      annees: ['L3'],
      couleur: 'yellow',
      programme: {
        L3: [
          'Les principes du droit fiscal',
          'L’impôt sur le revenu',
          'L’impôt sur les sociétés',
          'La TVA',
          'La fiscalité du patrimoine',
          'Le contrôle fiscal',
        ],
      },
    },
    {
      slug: 'procedure-civile',
      nom: 'Procédure civile',
      annees: ['L3'],
      couleur: 'slate',
      programme: {
        L3: [
          'L’action en justice',
          'La compétence des juridictions',
          'L’instance',
          'Les principes directeurs du procès',
          'Le jugement',
          'Les voies de recours',
        ],
      },
    },
    {
      slug: 'methodologie-juridique',
      nom: 'Méthodologie juridique',
      annees: ['L1', 'L2', 'L3'],
      couleur: 'slate',
      programme: {
        L1: [
          'Lire et ficher un arrêt',
          'La fiche d’arrêt',
          'Le cas pratique',
          'La dissertation juridique',
        ],
        L2: ['Le commentaire d’arrêt', 'Le commentaire de texte', 'La note de synthèse'],
        L3: ['La consultation juridique', 'Le grand oral', 'Préparer les concours (CRFPA, ENM)'],
      },
    },
  ],
}

// -----------------------------------------------------------------------------
// ÉCONOMIE-GESTION — licence en trois ans (portail économie-gestion, puis les
// parcours économie ou gestion en L3 : les deux sont listés, l'étudiant trie).
// -----------------------------------------------------------------------------
const ECO: Cursus = {
  id: 'eco',
  nom: 'Économie-gestion',
  court: 'Éco-gestion',
  annees: ['L1', 'L2', 'L3'],
  gardien: 'krach',
  matieres: [
    {
      slug: 'microeconomie',
      nom: 'Microéconomie',
      annees: ['L1', 'L2', 'L3'],
      couleur: 'yellow',
      programme: {
        L1: [
          'La rareté et les choix',
          'Les préférences du consommateur',
          'La contrainte budgétaire et l’optimum',
          'La demande et l’élasticité',
          'La production et les coûts',
          'La concurrence parfaite',
        ],
        L2: [
          'Le monopole',
          'L’oligopole : Cournot et Bertrand',
          'La théorie des jeux',
          'L’équilibre général et l’optimum de Pareto',
          'Les externalités et les biens publics',
        ],
        L3: ['L’asymétrie d’information', 'La théorie des contrats', 'Le choix en incertitude'],
      },
    },
    {
      slug: 'macroeconomie',
      nom: 'Macroéconomie',
      annees: ['L1', 'L2', 'L3'],
      couleur: 'orange',
      programme: {
        L1: [
          'La comptabilité nationale et le PIB',
          'La consommation et l’épargne',
          'L’investissement',
          'Le multiplicateur keynésien',
          'Le chômage',
          'L’inflation',
        ],
        L2: [
          'Le modèle IS-LM',
          'Le modèle IS-LM en économie ouverte (Mundell-Fleming)',
          'L’offre et la demande globales',
          'La courbe de Phillips',
          'Les politiques budgétaire et monétaire',
        ],
        L3: ['La croissance : le modèle de Solow', 'La croissance endogène', 'Les cycles économiques'],
      },
    },
    {
      slug: 'maths-economie',
      nom: 'Mathématiques pour l’économie',
      annees: ['L1', 'L2'],
      couleur: 'blue',
      programme: {
        L1: [
          'Les fonctions d’une variable',
          'Dérivées et optimisation',
          'Les suites et les intérêts composés',
          'Le calcul intégral',
          'Les fonctions de plusieurs variables',
        ],
        L2: [
          'L’algèbre linéaire : matrices',
          'Les systèmes d’équations',
          'L’optimisation sous contrainte : le lagrangien',
        ],
      },
    },
    {
      slug: 'statistiques',
      nom: 'Statistiques et probabilités',
      annees: ['L1', 'L2'],
      couleur: 'teal',
      programme: {
        L1: [
          'Les statistiques descriptives',
          'Moyenne, médiane, variance',
          'Les séries à deux variables et la régression',
          'Les indices',
        ],
        L2: [
          'Les probabilités',
          'Les variables aléatoires',
          'La loi normale',
          'L’échantillonnage',
          'Les tests d’hypothèses',
        ],
      },
    },
    {
      slug: 'econometrie',
      nom: 'Économétrie',
      annees: ['L3'],
      couleur: 'indigo',
      programme: {
        L3: [
          'La régression linéaire simple',
          'Les moindres carrés ordinaires',
          'La régression multiple',
          'Les tests de significativité',
          'L’hétéroscédasticité et l’autocorrélation',
        ],
      },
    },
    {
      slug: 'comptabilite',
      nom: 'Comptabilité',
      annees: ['L1', 'L2'],
      couleur: 'green',
      programme: {
        L1: [
          'Le bilan',
          'Le compte de résultat',
          'La partie double et le plan comptable',
          'Les opérations courantes',
          'Les amortissements et les provisions',
        ],
        L2: [
          'La comptabilité de gestion',
          'Les coûts complets',
          'Le seuil de rentabilité',
          'L’analyse financière : le bilan fonctionnel',
        ],
      },
    },
    {
      slug: 'gestion',
      nom: 'Management des organisations',
      annees: ['L1', 'L3'],
      couleur: 'purple',
      programme: {
        L1: [
          'L’entreprise et son environnement',
          'Les fonctions de l’entreprise',
          'Les structures organisationnelles',
          'La prise de décision',
        ],
        L3: ['La stratégie d’entreprise', 'La gestion des ressources humaines', 'Le management du changement'],
      },
    },
    {
      slug: 'histoire-economique',
      nom: 'Histoire des faits économiques',
      annees: ['L1'],
      couleur: 'orange',
      programme: {
        L1: [
          'La révolution industrielle',
          'La première mondialisation',
          'La crise de 1929',
          'Les Trente Glorieuses',
          'Les chocs pétroliers',
          'La mondialisation contemporaine',
        ],
      },
    },
    {
      slug: 'marketing',
      nom: 'Marketing',
      annees: ['L2'],
      couleur: 'pink',
      programme: {
        L2: [
          'La démarche marketing',
          'L’étude de marché',
          'La segmentation, le ciblage, le positionnement',
          'Le marketing mix',
          'Le comportement du consommateur',
        ],
      },
    },
    {
      slug: 'finance',
      nom: 'Finance d’entreprise',
      annees: ['L2', 'L3'],
      couleur: 'green',
      programme: {
        L2: [
          'La valeur temps de l’argent',
          'Le choix d’investissement : VAN et TRI',
          'Les modes de financement',
        ],
        L3: ['Le coût du capital', 'Les marchés financiers', 'Le MEDAF', 'L’évaluation d’entreprise'],
      },
    },
    {
      slug: 'economie-monetaire',
      nom: 'Monnaie et banque',
      annees: ['L2'],
      couleur: 'yellow',
      programme: {
        L2: [
          'Les fonctions de la monnaie',
          'La création monétaire',
          'Le système bancaire',
          'La banque centrale et la BCE',
          'La politique monétaire',
        ],
      },
    },
    {
      slug: 'economie-internationale',
      nom: 'Économie internationale',
      annees: ['L2', 'L3'],
      couleur: 'teal',
      programme: {
        L2: [
          'Les théories du commerce international : Ricardo',
          'Le modèle HOS',
          'Les nouvelles théories du commerce',
          'Le protectionnisme',
        ],
        L3: ['Les taux de change', 'La balance des paiements', 'Les zones monétaires'],
      },
    },
    {
      slug: 'economie-publique',
      nom: 'Économie publique',
      annees: ['L3'],
      couleur: 'blue',
      programme: {
        L3: [
          'Les défaillances de marché',
          'La fiscalité et ses effets',
          'Les choix publics',
          'La redistribution',
        ],
      },
    },
    {
      slug: 'controle-de-gestion',
      nom: 'Contrôle de gestion',
      annees: ['L3'],
      couleur: 'slate',
      programme: {
        L3: [
          'Le contrôle de gestion et la performance',
          'La gestion budgétaire',
          'L’analyse des écarts',
          'Les tableaux de bord',
        ],
      },
    },
  ],
}

// -----------------------------------------------------------------------------
// PSYCHOLOGIE — licence en trois ans, les six grandes sous-disciplines dès la
// L1 (développement, sociale, cognitive, neurosciences, clinique,
// méthodologie), approfondies chaque année.
// -----------------------------------------------------------------------------
const PSYCHO: Cursus = {
  id: 'psycho',
  nom: 'Psychologie',
  court: 'Psycho',
  annees: ['L1', 'L2', 'L3'],
  gardien: 'psyche',
  matieres: [
    {
      slug: 'psycho-developpement',
      nom: 'Psychologie du développement',
      annees: ['L1', 'L2', 'L3'],
      couleur: 'green',
      programme: {
        L1: [
          'Les grandes théories : Piaget, Vygotski, Wallon',
          'Le développement du nourrisson',
          'L’attachement',
          'Le développement du langage',
        ],
        L2: ['Le développement cognitif de l’enfant', 'Le développement socio-affectif', 'L’adolescence'],
        L3: ['Le vieillissement', 'Les troubles du développement'],
      },
    },
    {
      slug: 'psycho-sociale',
      nom: 'Psychologie sociale',
      annees: ['L1', 'L2', 'L3'],
      couleur: 'pink',
      programme: {
        L1: [
          'La perception sociale et l’attribution',
          'Les attitudes',
          'L’influence sociale : conformisme et obéissance',
          'Les stéréotypes et les préjugés',
        ],
        L2: ['La dissonance cognitive', 'Les relations intergroupes', 'La persuasion'],
        L3: ['Le soi et l’identité sociale', 'Les représentations sociales'],
      },
    },
    {
      slug: 'psycho-cognitive',
      nom: 'Psychologie cognitive',
      annees: ['L1', 'L2', 'L3'],
      couleur: 'purple',
      programme: {
        L1: ['La perception', 'L’attention', 'La mémoire', 'Le langage'],
        L2: ['Le raisonnement', 'La résolution de problèmes', 'Les représentations mentales'],
        L3: ['Les émotions et la cognition', 'La métacognition'],
      },
    },
    {
      slug: 'neurosciences',
      nom: 'Neurosciences et psychophysiologie',
      annees: ['L1', 'L2', 'L3'],
      couleur: 'indigo',
      programme: {
        L1: [
          'Le neurone et l’influx nerveux',
          'La synapse et les neurotransmetteurs',
          'L’organisation du système nerveux',
          'Les systèmes sensoriels',
        ],
        L2: ['La motricité', 'Le sommeil et les rythmes', 'Les bases neurales des émotions'],
        L3: ['La neuropsychologie', 'Les méthodes d’imagerie cérébrale'],
      },
    },
    {
      slug: 'psycho-clinique',
      nom: 'Psychologie clinique et psychopathologie',
      annees: ['L1', 'L2', 'L3'],
      couleur: 'teal',
      programme: {
        L1: [
          'La démarche clinique',
          'Les grands courants : psychanalyse, cognitivo-comportemental, humaniste',
          'Le normal et le pathologique',
        ],
        L2: ['Les troubles anxieux', 'Les troubles de l’humeur', 'Les troubles psychotiques'],
        L3: ['L’entretien clinique', 'Les tests projectifs', 'Les troubles de la personnalité'],
      },
    },
    {
      slug: 'psycho-differentielle',
      nom: 'Psychologie différentielle',
      annees: ['L2', 'L3'],
      couleur: 'orange',
      programme: {
        L2: ['L’intelligence et sa mesure', 'La personnalité : le modèle des Big Five', 'La psychométrie'],
        L3: ['Fidélité et validité des tests', 'Les différences entre les groupes'],
      },
    },
    {
      slug: 'methodo-psycho',
      nom: 'Méthodologie et statistiques',
      annees: ['L1', 'L2', 'L3'],
      couleur: 'slate',
      programme: {
        L1: [
          'La démarche expérimentale',
          'Les variables et les hypothèses',
          'Les statistiques descriptives',
        ],
        L2: ['Le test du khi-deux', 'Le test t de Student', 'La corrélation'],
        L3: ['L’analyse de variance (ANOVA)', 'Le rapport de recherche', 'L’éthique de la recherche'],
      },
    },
    {
      slug: 'histoire-psychologie',
      nom: 'Histoire et épistémologie de la psychologie',
      annees: ['L1'],
      couleur: 'yellow',
      programme: {
        L1: [
          'Les origines philosophiques',
          'Wundt et la psychologie expérimentale',
          'Le béhaviorisme',
          'La psychanalyse',
          'La révolution cognitive',
        ],
      },
    },
    {
      slug: 'psycho-travail',
      nom: 'Psychologie du travail',
      annees: ['L3'],
      couleur: 'blue',
      programme: {
        L3: ['Le travail et la santé', 'La motivation au travail', 'Le recrutement', 'Le stress et l’épuisement professionnel'],
      },
    },
  ],
}

// -----------------------------------------------------------------------------
// STAPS — licence en trois ans : sciences de la vie et sciences humaines
// appliquées au sport, puis les parcours (entraînement, APAS, management) en L3.
// -----------------------------------------------------------------------------
const STAPS: Cursus = {
  id: 'staps',
  nom: 'STAPS',
  court: 'STAPS',
  annees: ['L1', 'L2', 'L3'],
  gardien: 'coach-turbo',
  matieres: [
    {
      slug: 'anatomie-fonctionnelle',
      nom: 'Anatomie fonctionnelle',
      annees: ['L1'],
      couleur: 'red',
      programme: {
        L1: [
          'Le squelette',
          'Les articulations',
          'Les muscles du membre supérieur',
          'Les muscles du membre inférieur',
          'Le tronc et la posture',
        ],
      },
    },
    {
      slug: 'physiologie-exercice',
      nom: 'Physiologie de l’exercice',
      annees: ['L1', 'L2', 'L3'],
      couleur: 'pink',
      programme: {
        L1: [
          'La contraction musculaire',
          'Les filières énergétiques',
          'Le système cardiovasculaire à l’effort',
          'La respiration à l’effort',
        ],
        L2: ['La VO2max', 'La fatigue', 'La thermorégulation'],
        L3: ['L’adaptation à l’entraînement', 'L’effort en altitude', 'La nutrition du sportif'],
      },
    },
    {
      slug: 'biomecanique',
      nom: 'Biomécanique',
      annees: ['L1', 'L2', 'L3'],
      couleur: 'blue',
      programme: {
        L1: ['La cinématique', 'Les forces et les lois de Newton', 'Le centre de masse'],
        L2: ['Les leviers et les moments', 'La biomécanique de la course', 'Le saut'],
        L3: ['L’analyse vidéo du mouvement', 'La prévention des blessures'],
      },
    },
    {
      slug: 'psycho-sport',
      nom: 'Psychologie du sport',
      annees: ['L1', 'L2', 'L3'],
      couleur: 'purple',
      programme: {
        L1: ['La motivation', 'L’anxiété et la performance', 'La confiance en soi'],
        L2: ['La dynamique de groupe', 'L’attention et la concentration'],
        L3: ['La préparation mentale', 'Le burn-out du sportif'],
      },
    },
    {
      slug: 'sciences-sociales-sport',
      nom: 'Sociologie et histoire du sport',
      annees: ['L1', 'L2', 'L3'],
      couleur: 'orange',
      programme: {
        L1: [
          'La naissance du sport moderne',
          'Pierre de Coubertin et les Jeux olympiques',
          'Le sport et l’école',
        ],
        L2: ['Le sport et les inégalités', 'Le sport et les médias'],
        L3: ['Le sport et la politique', 'Le dopage'],
      },
    },
    {
      slug: 'entrainement',
      nom: 'Théorie de l’entraînement',
      annees: ['L1', 'L2', 'L3'],
      couleur: 'green',
      programme: {
        L1: ['Les qualités physiques', 'Les principes de l’entraînement', 'L’échauffement'],
        L2: ['La planification', 'Le développement de la force', 'L’endurance'],
        L3: ['La périodisation', 'La récupération', 'Le suivi de la charge'],
      },
    },
    {
      slug: 'apprentissage-moteur',
      nom: 'Contrôle et apprentissage moteur',
      annees: ['L2', 'L3'],
      couleur: 'teal',
      programme: {
        L2: ['Le contrôle moteur', 'Les étapes de l’apprentissage', 'La rétroaction'],
        L3: ['Le transfert d’apprentissage', 'L’enseignement des APSA'],
      },
    },
    {
      slug: 'management-sport',
      nom: 'Management du sport',
      annees: ['L3'],
      couleur: 'yellow',
      programme: {
        L3: ['L’organisation du sport en France', 'Les fédérations et les clubs', 'Le marketing du sport', 'L’événementiel sportif'],
      },
    },
    {
      slug: 'apa',
      nom: 'Activité physique adaptée',
      annees: ['L3'],
      couleur: 'indigo',
      programme: {
        L3: ['Le handicap et l’activité physique', 'Le sport santé', 'Les maladies chroniques et l’activité physique', 'Le vieillissement et l’activité physique'],
      },
    },
  ],
}

// -----------------------------------------------------------------------------
// SANTÉ — le PASS (parcours d'accès spécifique santé). Une seule année ; les
// UE du tronc commun, les mêmes dans toutes les facultés de santé.
// -----------------------------------------------------------------------------
const SANTE: Cursus = {
  id: 'sante',
  nom: 'Santé (PASS)',
  court: 'PASS',
  annees: ['PASS'],
  gardien: 'asclepion',
  matieres: [
    {
      slug: 'chimie-sante',
      nom: 'Chimie générale et organique',
      annees: ['PASS'],
      couleur: 'teal',
      programme: {
        PASS: [
          'L’atome et la classification',
          'Les liaisons chimiques',
          'Les équilibres et le pH',
          'L’oxydoréduction',
          'La stéréochimie',
          'Les grandes fonctions organiques',
        ],
      },
    },
    {
      slug: 'biochimie',
      nom: 'Biochimie',
      annees: ['PASS'],
      couleur: 'green',
      programme: {
        PASS: ['Les glucides', 'Les lipides', 'Les acides aminés et les protéines', 'Les enzymes', 'Le métabolisme énergétique'],
      },
    },
    {
      slug: 'biologie-cellulaire',
      nom: 'Biologie cellulaire',
      annees: ['PASS'],
      couleur: 'pink',
      programme: {
        PASS: ['La membrane plasmique', 'Les organites', 'Le cytosquelette', 'Le cycle cellulaire', 'La mort cellulaire'],
      },
    },
    {
      slug: 'genetique',
      nom: 'Biologie moléculaire et génétique',
      annees: ['PASS'],
      couleur: 'purple',
      programme: {
        PASS: ['L’ADN et sa réplication', 'La transcription', 'La traduction', 'La régulation de l’expression des gènes', 'L’hérédité et les maladies génétiques'],
      },
    },
    {
      slug: 'biophysique',
      nom: 'Biophysique',
      annees: ['PASS'],
      couleur: 'blue',
      programme: {
        PASS: ['Les solutions et l’osmose', 'Les rayonnements', 'La radioactivité', 'L’imagerie médicale', 'L’optique de l’œil'],
      },
    },
    {
      slug: 'physiologie',
      nom: 'Physiologie',
      annees: ['PASS'],
      couleur: 'red',
      programme: {
        PASS: ['Le milieu intérieur', 'La physiologie cardiaque', 'La respiration', 'La fonction rénale', 'Le système nerveux'],
      },
    },
    {
      slug: 'anatomie',
      nom: 'Anatomie',
      annees: ['PASS'],
      couleur: 'orange',
      programme: {
        PASS: ['L’anatomie générale et la terminologie', 'L’appareil locomoteur', 'Le cœur et les vaisseaux', 'L’appareil digestif', 'Le système nerveux central'],
      },
    },
    {
      slug: 'histologie-embryologie',
      nom: 'Histologie et embryologie',
      annees: ['PASS'],
      couleur: 'yellow',
      programme: {
        PASS: ['Les tissus épithéliaux', 'Les tissus conjonctifs', 'La gamétogenèse', 'La fécondation', 'Les premières semaines du développement'],
      },
    },
    {
      slug: 'biostatistiques',
      nom: 'Biostatistiques',
      annees: ['PASS'],
      couleur: 'slate',
      programme: {
        PASS: ['Les probabilités', 'Les lois de probabilité', 'L’estimation', 'Les tests statistiques', 'La sensibilité et la spécificité d’un test'],
      },
    },
    {
      slug: 'sante-societe',
      nom: 'Santé, société, humanité',
      annees: ['PASS'],
      couleur: 'indigo',
      programme: {
        PASS: ['La santé publique', 'L’éthique médicale', 'L’histoire de la médecine', 'Le système de santé français'],
      },
    },
    {
      slug: 'pharmacologie',
      nom: 'Initiation à la connaissance du médicament',
      annees: ['PASS'],
      couleur: 'green',
      programme: {
        PASS: ['Le médicament : définition et cycle de vie', 'La pharmacocinétique', 'La pharmacodynamie', 'Les effets indésirables'],
      },
    },
  ],
}

/** Les cursus, dans l'ordre du Pareto (le plus demandé d'abord). */
export const CURSUS: readonly Cursus[] = [DROIT, SANTE, STAPS, PSYCHO, ECO]

// --- Les classes -------------------------------------------------------------

/** La valeur de classe en base (`profiles.grade_level`) : « L1 droit », « PASS ». */
export function classeSup(cursus: Cursus, annee: Annee): string {
  return annee === 'PASS' ? 'PASS' : `${annee} ${cursus.id}`
}

/** Toutes les classes du supérieur, cursus par cursus, année par année. */
export const CLASSES_SUP: readonly string[] = CURSUS.flatMap((c) =>
  c.annees.map((a) => classeSup(c, a)),
)

type ClasseInfo = { cursus: Cursus; annee: Annee }

const PAR_CLASSE = new Map<string, ClasseInfo>(
  CURSUS.flatMap((c) => c.annees.map((a) => [classeSup(c, a), { cursus: c, annee: a }] as const)),
)

/** Le cursus et l'année d'une classe du supérieur, ou null. */
export function infoClasseSup(classe: string | null | undefined): ClasseInfo | null {
  if (typeof classe !== 'string') return null
  return PAR_CLASSE.get(classe.trim()) ?? null
}

export function estClasseSup(classe: string | null | undefined): boolean {
  return infoClasseSup(classe) !== null
}

/** « L1 Droit », « PASS (santé) » : le nom complet d'une classe du supérieur. */
export function nomClasseSup(classe: string): string {
  const info = infoClasseSup(classe)
  if (!info) return classe
  return info.annee === 'PASS' ? 'PASS (santé)' : `${info.annee} ${info.cursus.nom}`
}

/** « L1 Droit », « L2 Éco-gestion », « PASS » : l'écriture courte (puce, grille). */
export function courtClasseSup(classe: string): string {
  const info = infoClasseSup(classe)
  if (!info) return classe
  return info.annee === 'PASS' ? 'PASS' : `${info.annee} ${info.cursus.court}`
}

/** Les slugs des matières d'une classe du supérieur, dans l'ordre du cursus. */
export function matieresDeClasse(classe: string): string[] {
  const info = infoClasseSup(classe)
  if (!info) return []
  return info.cursus.matieres.filter((m) => m.annees.includes(info.annee)).map((m) => m.slug)
}

/** Toutes les matières du supérieur, à plat (un slug n'apparaît qu'une fois). */
export const MATIERES_SUP: readonly MatiereSup[] = CURSUS.flatMap((c) => c.matieres)

/** Les classes d'une matière du supérieur (`subjects.levels`). */
export function classesDeMatiere(slug: string): string[] {
  return CURSUS.flatMap((c) =>
    c.matieres
      .filter((m) => m.slug === slug)
      .flatMap((m) => m.annees.map((a) => classeSup(c, a))),
  )
}
