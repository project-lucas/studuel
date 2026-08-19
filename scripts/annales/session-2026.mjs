// Les épreuves de la session 2026, décrites partie par partie.
//
// CE QUE CE FICHIER EST, ET CE QU'IL N'EST PAS. Il décrit la STRUCTURE
// OFFICIELLE de chaque épreuve : sa durée, son coefficient, ses parties, leur
// barème, et les chapitres du programme que chaque partie mobilise. Il ne
// reproduit AUCUN énoncé de sujet tombé — ceux-là arriveront session par
// session, dans d'autres fichiers de ce dossier, quand ils auront été relevés
// aux sujets officiels. Le modèle est prévu pour : `session` et `centre`
// distinguent « 2026 » de « 2025 · Amérique du Nord ».
//
// POURQUOI COMMENCER PAR LA STRUCTURE. C'est ce qu'un élève ignore le plus
// longtemps et ce qui lui coûte le plus cher le jour J : combien de temps par
// partie, combien de points, ce qu'on attend de lui exactement. Un sujet tombé
// se comprend une fois qu'on sait ça ; l'inverse est faux.
//
// SOURCES (vérifiées le 07/08/2026) :
//  · DNB session 2026 — épreuves, durées et coefficients ; la note passe sur 20
//    (60 % épreuves finales / 40 % contrôle continu) et l'EMC devient une
//    sous-partie autonome de l'épreuve d'histoire-géographie, avec son propre
//    coefficient 0,5 ;
//  · Bac général session 2026 — français écrit 4 h coef. 5, français oral
//    20 min coef. 5, ÉPREUVE ANTICIPÉE DE MATHÉMATIQUES 2 h coef. 2 (première
//    session en 2026, pour tous les élèves de première), philosophie 4 h
//    coef. 8, spécialités coef. 16 chacune (écrit de 4 h en maths, SES, HGGSP
//    et HLP ; 3 h 30 + 1 h de pratique en physique-chimie, SVT et NSI).
//
// ⚠️ LE GRAND ORAL N'EST PAS ICI. Il vaut coefficient 10 et se prépare sur les
// deux spécialités à la fois : il n'appartient donc à AUCUNE matière, alors que
// `exam_papers` en exige une. Le rattacher arbitrairement à l'une des deux
// mentirait sur ce qu'il est. Il lui faut son propre écran, pas une ligne ici.
//
// Les titres cités dans `chapitres` doivent exister dans `chapters.title` au
// niveau visé : c'est ainsi que l'app propose de réviser ce que la partie
// mobilise. Un titre qui ne correspond plus se voit tout de suite à l'écran —
// c'est voulu (cf. l'en-tête de la migration 236).

export default {
  session: '2026',

  epreuves: [
    // ======================= BREVET (3e) ==================================
    {
      slug: 'francais',
      niveau: '3e',
      examen: 'brevet',
      titre: 'Brevet 2026 — Français',
      duree: 180,
      coefficient: 2,
      parties: [
        {
          titre: 'Compréhension, interprétation et grammaire',
          minutes: 70,
          points: 50,
          chapitres: ['Le discours rapporté', "Se raconter : l'autobiographie"],
          attendu:
            'Un texte littéraire, souvent accompagné d’une image. Des questions de compréhension et d’interprétation, puis des questions de grammaire et de compétences linguistiques (classes de mots, propositions, valeurs des temps, réécriture d’un passage sous contrainte). On répond en phrases complètes, et on cite le texte.',
        },
        {
          titre: 'Dictée',
          minutes: 20,
          points: 10,
          chapitres: ['Le discours rapporté'],
          attendu:
            'Un texte d’une vingtaine de lignes, lu trois fois. Les accords (participe passé, sujet-verbe éloigné) et l’homophonie grammaticale font l’essentiel du barème. Aucun point n’est retiré sous zéro.',
        },
        {
          titre: 'Rédaction',
          minutes: 90,
          points: 40,
          chapitres: [
            "Se raconter : l'autobiographie",
            'Dénoncer les travers de la société',
            'La poésie engagée',
          ],
          attendu:
            'Un sujet au choix : sujet d’imagination (suite de texte, récit) ou sujet de réflexion (argumentation sur une question posée par le texte). Le brouillon est compté dans les 90 minutes — un plan de cinq lignes vaut mieux qu’une page rédigée deux fois.',
        },
      ],
    },
    {
      slug: 'maths',
      niveau: '3e',
      examen: 'brevet',
      titre: 'Brevet 2026 — Mathématiques',
      duree: 120,
      coefficient: 2,
      parties: [
        {
          titre: 'Automatismes — sans calculatrice',
          minutes: 20,
          points: 6,
          chapitres: ['Arithmétique', 'Fonctions linéaires et affines'],
          attendu:
            'Une série de questions courtes, à traiter de tête ou en deux lignes : fractions, puissances, pourcentages, ordres de grandeur, priorités opératoires. Le sujet est ramassé au bout des 20 minutes, avant la distribution de la seconde partie. La calculatrice est interdite ici, et seulement ici.',
        },
        {
          titre: 'Raisonnement et problèmes — avec calculatrice',
          minutes: 100,
          points: 14,
          chapitres: [
            'Théorème de Thalès',
            'Trigonométrie',
            'Probabilités et statistiques',
            'Fonctions linéaires et affines',
          ],
          attendu:
            'Cinq à sept exercices indépendants, dont un exercice d’algorithmique (Scratch) et un exercice de tâche complexe. Les exercices sont indépendants : les traiter dans l’ordre du sujet n’est pas obligatoire. Les points de la démarche sont donnés même quand le résultat est faux — d’où l’intérêt d’écrire ce qu’on cherche.',
        },
      ],
    },
    {
      slug: 'histoire-geo',
      niveau: '3e',
      examen: 'brevet',
      titre: 'Brevet 2026 — Histoire-Géographie',
      duree: 90,
      coefficient: 1.5,
      parties: [
        {
          titre: 'Analyser et comprendre des documents',
          minutes: 50,
          points: 20,
          chapitres: [
            'La Première Guerre mondiale',
            'La Seconde Guerre mondiale',
            "L'Europe entre les deux guerres",
          ],
          attendu:
            'Un ou deux documents (texte, affiche, graphique, carte) à situer, expliquer et confronter. On attend qu’on nomme la nature et la date du document avant d’en tirer quoi que ce soit — c’est la première ligne du barème.',
        },
        {
          titre: 'Maîtriser différents langages',
          minutes: 40,
          points: 20,
          chapitres: ['La France de 1944 à nos jours', 'Les aires urbaines en France'],
          attendu:
            'Un développement construit d’une vingtaine de lignes, plus un travail cartographique ou une frise. Les repères (dates, lieux) sont notés pour eux-mêmes : ils s’apprennent, ils ne se déduisent pas.',
        },
      ],
    },
    {
      // L'EMC A SA PROPRE LIGNE, et ce n'est pas un détail de rangement : depuis
      // la session 2026 il n'est plus une question de l'épreuve d'histoire-géo
      // mais une SOUS-PARTIE AUTONOME, avec sa note et son coefficient à lui
      // (0,5 contre 1,5). Le loger dans l'épreuve d'histoire-géographie
      // afficherait un coefficient faux, et surtout renverrait l'élève réviser
      // des chapitres d'histoire pour une note d'EMC.
      slug: 'emc',
      niveau: '3e',
      examen: 'brevet',
      titre: 'Brevet 2026 — EMC',
      duree: 30,
      coefficient: 0.5,
      parties: [
        {
          titre: 'Enseignement moral et civique',
          minutes: 30,
          points: 10,
          chapitres: ['Libertés et laïcité', 'La justice en France', 'Citoyenneté et engagement'],
          attendu:
            'Depuis la session 2026, l’EMC est une sous-partie AUTONOME de l’épreuve d’histoire-géographie, avec sa note et son coefficient propres : 0,5, contre 1,5 pour l’histoire-géographie. Elle se passe dans la même demi-journée, à la suite. Un ou deux documents, des questions courtes, puis une réponse argumentée sur une situation civique — on attend un avis construit, appuyé sur le droit, pas une opinion.',
        },
      ],
    },
    {
      slug: 'physique-chimie',
      niveau: '3e',
      examen: 'brevet',
      titre: 'Brevet 2026 — Sciences (partie physique-chimie)',
      duree: 30,
      coefficient: 1,
      parties: [
        {
          titre: 'Physique-chimie',
          minutes: 30,
          points: 25,
          chapitres: [
            "L'énergie et ses conversions",
            'Puissance et énergie électriques',
            'Ions et pH',
            'La gravitation',
          ],
          attendu:
            'L’épreuve de Sciences dure 1 heure et porte sur DEUX disciplines parmi trois (physique-chimie, SVT, technologie) : pour la session 2026, physique-chimie et SVT. Chaque discipline compte pour la moitié de l’épreuve, et l’ensemble vaut coefficient 2. Exercices à partir de documents, calculs simples avec unités — l’unité oubliée coûte le point.',
        },
      ],
    },
    {
      slug: 'svt',
      niveau: '3e',
      examen: 'brevet',
      titre: 'Brevet 2026 — Sciences (partie SVT)',
      duree: 30,
      coefficient: 1,
      parties: [
        {
          titre: 'Sciences de la vie et de la Terre',
          minutes: 30,
          points: 25,
          chapitres: [
            'Le programme génétique',
            "L'évolution des espèces",
            'Le système immunitaire',
            'Santé et responsabilité',
            'Les risques géologiques',
          ],
          attendu:
            'Seconde moitié de l’épreuve de Sciences (1 heure, coefficient 2 pour les deux disciplines réunies). On exploite des documents pour formuler une hypothèse, l’éprouver et conclure. La conclusion doit répondre à la question posée, avec ses mots à elle — recopier le document ne vaut aucun point.',
        },
      ],
    },

    // ================= ÉPREUVES ANTICIPÉES (1re) ===========================
    {
      slug: 'francais',
      niveau: '1re',
      examen: 'bac-anticipe',
      titre: 'Bac de français 2026 — écrit',
      duree: 240,
      coefficient: 5,
      parties: [
        {
          titre: 'Commentaire de texte OU dissertation — un seul sujet au choix',
          minutes: 240,
          points: 20,
          chapitres: [
            'La poésie du XIXe au XXIe siècle',
            'Le roman : parcours bac',
            'Le théâtre : parcours bac',
            "La littérature d'idées",
            'Dissertation et oral du bac',
          ],
          attendu:
            'Quatre heures pour UN sujet. Le commentaire porte sur un texte hors programme ; la dissertation porte sur une des œuvres au programme et son parcours associé — impossible à traiter sans avoir lu l’œuvre. Une heure de préparation (analyse, plan détaillé, introduction au brouillon) sur les quatre est le partage que recommandent les correcteurs.',
        },
      ],
    },
    {
      slug: 'francais',
      niveau: '1re',
      examen: 'bac-anticipe',
      centre: 'Oral',
      titre: 'Bac de français 2026 — oral',
      duree: 20,
      coefficient: 5,
      parties: [
        {
          titre: 'Explication linéaire et question de grammaire',
          minutes: 12,
          points: 12,
          chapitres: ['Dissertation et oral du bac'],
          attendu:
            'L’examinateur choisit un texte dans le descriptif de la classe. 30 minutes de préparation, puis 12 minutes : explication linéaire du passage (8 points) et une question de grammaire posée sur ce même texte (2 points), à quoi s’ajoute la lecture à voix haute (2 points). La lecture est notée — elle se prépare.',
        },
        {
          titre: 'Présentation d’une œuvre et entretien',
          minutes: 8,
          points: 8,
          chapitres: ['Dissertation et oral du bac'],
          attendu:
            'On présente une œuvre choisie parmi celles lues dans l’année et on justifie ce choix, puis on échange avec l’examinateur. C’est la partie où l’on est jugé sur sa capacité à défendre un avis personnel, pas à réciter une fiche.',
        },
      ],
    },
    {
      slug: 'maths',
      niveau: '1re',
      examen: 'bac-anticipe',
      titre: 'Bac 2026 — Mathématiques (épreuve anticipée)',
      duree: 120,
      coefficient: 2,
      parties: [
        {
          titre: 'Épreuve écrite',
          minutes: 120,
          points: 20,
          chapitres: [
            'Suites numériques',
            'Second degré',
            'Dérivation',
            'Produit scalaire',
            'Probabilités conditionnelles',
          ],
          attendu:
            'NOUVEAUTÉ DE LA SESSION 2026 : les mathématiques, jusqu’ici évaluées en contrôle continu, deviennent une épreuve anticipée du bac, passée en fin de première par TOUS les élèves — voie générale comme voie technologique. Deux heures, coefficient 2, avec un sujet adapté selon qu’on suit ou non la spécialité mathématiques.',
        },
      ],
    },

    // ========================= BACCALAURÉAT (Tle) ==========================
    {
      slug: 'philosophie',
      niveau: 'Tle',
      examen: 'bac',
      titre: 'Bac 2026 — Philosophie',
      duree: 240,
      coefficient: 8,
      parties: [
        {
          titre: 'Trois sujets, un seul à traiter',
          minutes: 240,
          points: 20,
          chapitres: [
            'La conscience',
            'Le libre arbitre',
            'La liberté politique',
            'La justice et le droit',
            'La vérité',
            'Le travail',
            'L’art',
            'La technique',
            'L’État',
          ],
          attendu:
            'Deux sujets de dissertation et une explication de texte ; on en choisit UN. Quatre heures, coefficient 8 en voie générale (4 en voie technologique). Le choix se fait en vingt minutes, pas en une heure : le sujet qu’on sait problématiser vaut mieux que celui dont on connaît le cours. L’explication de texte ne demande pas de connaître l’auteur, mais de suivre son raisonnement pas à pas.',
        },
      ],
    },
    {
      slug: 'maths',
      niveau: 'Tle',
      examen: 'bac',
      titre: 'Bac 2026 — Spécialité Mathématiques',
      duree: 240,
      coefficient: 16,
      parties: [
        {
          titre: 'Quatre exercices, dont un au choix',
          minutes: 240,
          points: 20,
          chapitres: [
            'Limites de fonctions',
            'Continuité et convexité',
            'Logarithme népérien',
            'Primitives et équations différentielles',
            'Lois de probabilité',
          ],
          attendu:
            'Quatre heures, coefficient 16. Le sujet couvre les quatre parties du programme (algèbre et géométrie, analyse, probabilités, algorithmique) : suites et récurrence, géométrie dans l’espace, limites, convexité, logarithme, primitives et calcul intégral, loi binomiale et concentration. ⚠️ Le programme de Terminale n’est aujourd’hui couvert qu’en partie dans l’app (voir docs/audit-programmes-terminale.md).',
        },
      ],
    },
    {
      slug: 'physique-chimie',
      niveau: 'Tle',
      examen: 'bac',
      titre: 'Bac 2026 — Spécialité Physique-Chimie',
      duree: 210,
      coefficient: 16,
      parties: [
        {
          titre: 'Épreuve écrite',
          minutes: 210,
          points: 20,
          chapitres: [
            'Cinétique chimique',
            'Acides et bases',
            'Mécanique : lois de Newton',
            'Ondes lumineuses : diffraction',
            'Énergie et thermodynamique',
          ],
          attendu:
            '3 h 30 d’écrit sur les quatre thèmes du programme (constitution et transformations de la matière, mouvement et interactions, l’énergie, ondes et signaux), suivies d’une épreuve PRATIQUE d’une heure (les ECE, évaluation des compétences expérimentales) passée séparément, en laboratoire. L’ensemble vaut coefficient 16.',
        },
      ],
    },
    {
      slug: 'svt',
      niveau: 'Tle',
      examen: 'bac',
      titre: 'Bac 2026 — Spécialité SVT',
      duree: 210,
      coefficient: 16,
      parties: [
        {
          titre: 'Épreuve écrite',
          minutes: 210,
          points: 20,
          chapitres: [
            'Le brassage des génomes à chaque génération : la reproduction sexuée des eucaryotes',
            'La chronologie absolue : décrypter le temps des roches par des mesures',
            'La plante, productrice de la matière organique grâce à la photosynthèse',
            'Comprendre les variations climatiques',
            'Les réflexes',
            'Le contrôle des flux de glucose, source essentielle d’énergie des cellules musculaires',
          ],
          attendu:
            '3 h 30 d’écrit en deux exercices : un exercice de restitution organisée de connaissances et un exercice d’exploitation de documents. S’y ajoute l’épreuve pratique d’une heure (ECE), passée en salle de travaux pratiques. Coefficient 16 pour l’ensemble.',
        },
      ],
    },
    {
      slug: 'ses',
      niveau: 'Tle',
      examen: 'bac',
      titre: 'Bac 2026 — Spécialité SES',
      duree: 240,
      coefficient: 16,
      parties: [
        {
          titre: 'Dissertation OU épreuve composée — au choix',
          minutes: 240,
          points: 20,
          chapitres: [
            'Croissance et environnement',
            'Le commerce international',
            'Les mutations du travail',
            'La justice sociale',
          ],
          attendu:
            'Quatre heures, coefficient 16, et un choix à faire d’emblée : la dissertation s’appuyant sur un dossier documentaire, ou l’épreuve composée en trois parties (mobilisation de connaissances, étude d’un document, raisonnement appuyé sur un dossier). ⚠️ Le programme de Terminale n’est aujourd’hui couvert qu’en partie dans l’app (voir docs/audit-programmes-terminale.md).',
        },
      ],
    },
    {
      slug: 'hggsp',
      niveau: 'Tle',
      examen: 'bac',
      titre: 'Bac 2026 — Spécialité HGGSP',
      duree: 240,
      coefficient: 16,
      parties: [
        {
          titre: 'Dissertation et étude critique de documents',
          minutes: 240,
          points: 20,
          chapitres: [
            'Environnement : exploiter, préserver',
            'Guerres et paix',
            "L'enjeu de la connaissance",
            'Le patrimoine',
          ],
          attendu:
            'Quatre heures, coefficient 16. Deux exercices : une dissertation (choix entre deux sujets) et une étude critique d’un ou deux documents. Les deux portent sur des thèmes différents du programme — impasse impossible. ⚠️ Le programme de Terminale n’est aujourd’hui couvert qu’en partie dans l’app (voir docs/audit-programmes-terminale.md).',
        },
      ],
    },
    {
      slug: 'nsi',
      niveau: 'Tle',
      examen: 'bac',
      titre: 'Bac 2026 — Spécialité NSI',
      duree: 210,
      coefficient: 16,
      parties: [
        {
          titre: 'Épreuve écrite',
          minutes: 210,
          points: 20,
          chapitres: [
            'Structures de données',
            'Bases de données et SQL',
            'Réseaux et protocoles',
            'Algorithmique : les graphes',
          ],
          attendu:
            '3 h 30 d’écrit : trois exercices sur cinq proposés, couvrant structures de données, bases de données, architectures matérielles, réseaux, langages et algorithmique. S’y ajoute une épreuve PRATIQUE d’une heure sur machine (programmation en Python). Coefficient 16 pour l’ensemble.',
        },
      ],
    },
    {
      slug: 'hlp',
      niveau: 'Tle',
      examen: 'bac',
      titre: 'Bac 2026 — Spécialité HLP',
      duree: 240,
      coefficient: 16,
      parties: [
        {
          titre: 'Interprétation littéraire et essai philosophique',
          minutes: 240,
          points: 20,
          chapitres: ['Méthode de l’épreuve'],
          attendu:
            'Quatre heures, coefficient 16. Deux textes, un par semestre du programme (« La recherche de soi », « L’Humanité en question ») ; sur chacun, une question d’interprétation littéraire et une question d’essai philosophique. On traite les deux textes, et pour chacun on choisit l’un des deux exercices. Chaque réponse vaut 10 points.',
        },
      ],
    },
  ],
}
