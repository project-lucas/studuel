// -----------------------------------------------------------------------------
// LA PRÉPA DU SUPÉRIEUR (15/10/2026, Lucas : « des matières supplémentaires pour
// devancer la L1 — droit, économie… : on reprend les filières les plus choisies
// par les étudiants après le bac, et les plus populaires chez les collégiens et
// les lycéens »).
//
// LA COLONNE VERTÉBRALE, PAS ENCORE LE CONTENU. Ce module déclare les huit
// filières (les plus demandées sur Parcoursup : droit, santé, psychologie,
// STAPS, économie-gestion… plus l'informatique, les sciences politiques et le
// commerce), leurs modules d'introduction, et à qui elles s'ouvrent. Le
// remplissage (cours, quiz, fiches) passera par la chaîne habituelle — une
// matière en base par filière, niveau « Tle » — quand Lucas aura choisi par où
// commencer ; en attendant, la page /prepa-sup les présente, et l'élève dit
// lesquelles l'intéressent (`prepa_sup_interet`, migration 582) : c'est ce
// vote qui ordonnera le remplissage.
//
// La teinte d'une filière est une IDENTITÉ (comme les outils de Marcel ou les
// périodes de l'encyclopédie) : médaillon et liseré, jamais un bouton — et
// aucune n'est violette, le violet restant la couleur de ce qui se clique.
//
// Logique PURE.
// -----------------------------------------------------------------------------

export type IdFiliere =
  | 'droit'
  | 'economie'
  | 'sante'
  | 'psychologie'
  | 'staps'
  | 'informatique'
  | 'sciences-po'
  | 'commerce'

/** La palette d'identité de globals.css (`data-teinte`), sans le violet. */
export type TeinteFiliere = 'bleu' | 'vert' | 'corail' | 'rose' | 'ambre' | 'turquoise' | 'indigo'

export type Filiere = {
  id: IdFiliere
  nom: string
  /** L'accroche de la carte. */
  accroche: string
  /** Où ça mène, en une ligne. */
  debouches: string
  /** Les spécialités qui y préparent le mieux (indicatif). */
  conseillePour: string
  /** Les modules d'introduction, dans l'ordre d'une première année. */
  modules: string[]
  teinte: TeinteFiliere
  emoji: string
}

export const FILIERES: readonly Filiere[] = [
  {
    id: 'droit',
    nom: 'Droit',
    accroche: 'Comprendre les règles qui organisent la société',
    debouches: 'Avocat, juriste, magistrat, notaire, fonction publique',
    conseillePour: 'Toutes les spécialités ; HGGSP, SES et HLP aident',
    modules: [
      'Introduction au droit : les sources, la hiérarchie des normes',
      'Les institutions de la Ve République',
      'Les personnes et la famille',
      'Le contrat',
      'L’organisation de la justice',
      'La méthode : le cas pratique et le commentaire d’arrêt',
    ],
    teinte: 'indigo',
    emoji: '⚖️',
  },
  {
    id: 'sante',
    nom: 'Santé (PASS, LAS)',
    accroche: 'Préparer la première année de médecine',
    debouches: 'Médecine, pharmacie, odontologie, maïeutique, kinésithérapie',
    conseillePour: 'SVT, physique-chimie, maths',
    modules: [
      'La cellule et les biomolécules',
      'Anatomie générale',
      'Physiologie : les grandes fonctions',
      'Biophysique et chimie générale',
      'Statistiques pour la santé',
      'Méthode : apprendre beaucoup, vite, et le retenir',
    ],
    teinte: 'corail',
    emoji: '🩺',
  },
  {
    id: 'psychologie',
    nom: 'Psychologie',
    accroche: 'Comprendre comment on pense, apprend et ressent',
    debouches: 'Psychologue, ressources humaines, éducation, recherche',
    conseillePour: 'SVT, SES, HLP, maths (statistiques)',
    modules: [
      'Les grands courants de la psychologie',
      'Le développement de l’enfant',
      'Mémoire, attention, apprentissage',
      'Psychologie sociale',
      'Statistiques et méthode expérimentale',
    ],
    teinte: 'rose',
    emoji: '🧠',
  },
  {
    id: 'economie',
    nom: 'Économie et gestion',
    accroche: 'Comment les marchés, les entreprises et les États décident',
    debouches: 'Banque, finance, conseil, entreprise, administration',
    conseillePour: 'SES, maths',
    modules: [
      'Les grands mécanismes : offre, demande, prix',
      'La comptabilité de base',
      'La monnaie et les banques',
      'La croissance et le chômage',
      'Mathématiques pour l’économie',
    ],
    teinte: 'vert',
    emoji: '📈',
  },
  {
    id: 'commerce',
    nom: 'Commerce et management',
    accroche: 'Écoles de commerce, BUT et BTS : les bases du management',
    debouches: 'Marketing, vente, gestion d’entreprise, entrepreneuriat',
    conseillePour: 'SES, maths, langues ; STMG',
    modules: [
      'Le marketing : connaître son client',
      'L’entreprise et son organisation',
      'Gestion et finance de l’entreprise',
      'Le droit des affaires, en bref',
      'Méthode : la synthèse et l’oral de concours',
    ],
    teinte: 'ambre',
    emoji: '💼',
  },
  {
    id: 'staps',
    nom: 'STAPS',
    accroche: 'Le corps, l’entraînement et la performance, à l’université',
    debouches: 'Professeur d’EPS, entraîneur, kinésithérapie, management du sport',
    conseillePour: 'SVT, physique-chimie ; l’option EPS',
    modules: [
      'Anatomie et physiologie de l’effort',
      'Les bases de l’entraînement',
      'Biomécanique du mouvement',
      'Histoire et sociologie du sport',
      'Psychologie du sportif',
    ],
    teinte: 'turquoise',
    emoji: '🏃',
  },
  {
    id: 'informatique',
    nom: 'Informatique',
    accroche: 'Programmer, et comprendre ce que fait la machine',
    debouches: 'Développeur, ingénieur, cybersécurité, données, intelligence artificielle',
    conseillePour: 'NSI, maths',
    modules: [
      'Programmer en Python : les bases solides',
      'Algorithmique : trier, chercher, compter',
      'Logique et mathématiques discrètes',
      'Architecture des ordinateurs et réseaux',
      'Bases de données',
    ],
    teinte: 'indigo',
    emoji: '💻',
  },
  {
    id: 'sciences-po',
    nom: 'Sciences politiques',
    accroche: 'Préparer les IEP et les licences de science politique',
    debouches: 'Journalisme, diplomatie, haute fonction publique, ONG',
    conseillePour: 'HGGSP, SES, HLP',
    modules: [
      'Les grandes idées politiques',
      'Les relations internationales depuis 1945',
      'Les institutions françaises et européennes',
      'Lire l’actualité : méthode',
      'L’oral et l’écrit des concours d’IEP',
    ],
    teinte: 'bleu',
    emoji: '🏛️',
  },
]

/** Les classes à qui la prépa s'adresse : le lycée qui choisit son orientation. */
export const CLASSES_PREPA = ['1re', '1re techno', 'Tle', 'Tle techno'] as const

export function prepaPourClasse(classe: string | null | undefined): boolean {
  return CLASSES_PREPA.includes((classe ?? '') as (typeof CLASSES_PREPA)[number])
}

export function filiere(id: string): Filiere | null {
  return FILIERES.find((f) => f.id === id) ?? null
}

export function estFiliere(id: unknown): id is IdFiliere {
  return typeof id === 'string' && FILIERES.some((f) => f.id === id)
}
