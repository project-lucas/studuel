// -----------------------------------------------------------------------------
// LE CAHIER D'EXERCICES — le format du contenu.
//
// Lucas, 18/09/2026 : « ce n'est pas un quiz mais la résolution d'un problème,
// un schéma, un document, une analyse de texte avec des questions dessous,
// l'interprétation d'un graphique, une carte de France […] par palier de
// difficulté, une étoile, deux étoiles, trois étoiles, débloqués au fur et à
// mesure, avec des récompenses en gemmes ».
//
// Chaque chapitre porte TROIS exercices, faits comme une page de manuel : une
// mise en situation, un à trois DOCUMENTS (carte, graphique, texte, schéma,
// frise, figure…), puis des questions dessous. L'exercice 1 (★) ne doit faire
// peur à personne ; le 3 (★★★) demande de croiser les documents.
//
// Deux formes du même exercice :
//
//   ExerciceSource   ce qu'on ÉCRIT (contenu/exercices/<niveau>/<matiere>.json) :
//                    les réponses sont posées à côté des questions ;
//   ExercicePublic   ce qui part vers l'élève : les mêmes documents et questions,
//                    SANS réponse ni explication, options mélangées, et les
//                    identifiants des zones neutralisés (z1, z2…) pour qu'aucun
//                    ne trahisse la bonne. Les clés vont dans une table que
//                    seul le serveur lit (migration 372).
//
// Le passage de l'un à l'autre est lib/exercices/compiler.ts ; la validation
// stricte du contenu écrit, lib/exercices/valider.ts.
// -----------------------------------------------------------------------------

export type Etoiles = 1 | 2 | 3

/**
 * La COMPÉTENCE travaillée, affichée en tête d'exercice comme dans un manuel
 * (« Je lis une carte »). Une liste fermée : c'est elle qui donne à la page
 * son rythme — trois exercices de suite ne devraient pas porter la même.
 */
export const COMPETENCES = {
  resoudre: 'Je résous un problème',
  calculer: 'Je calcule',
  raisonner: 'Je raisonne',
  'lire-carte': 'Je lis une carte',
  'lire-graphique': 'J’interprète un graphique',
  'lire-tableau': 'Je lis un tableau',
  'analyser-texte': 'J’analyse un texte',
  'analyser-document': 'J’analyse un document',
  'observer-schema': 'J’observe un schéma',
  'se-reperer-temps': 'Je me repère dans le temps',
  'se-reperer-espace': 'Je me repère dans l’espace',
  geometrie: 'Je raisonne sur une figure',
  programmer: 'Je programme',
  experimenter: 'J’interprète une expérience',
  'comprendre-langue': 'Je comprends un document',
  'manier-langue': 'Je manie la langue',
  argumenter: 'J’argumente',
  modeliser: 'Je modélise une situation',
} as const

export type Competence = keyof typeof COMPETENCES

/**
 * La palette des DOCUMENTS. C'est une palette de manuel (l'eau est bleue, la
 * forêt verte, le désert sable), pas celle des boutons : dans un document, la
 * couleur porte une INFORMATION (une légende, une série), jamais une action.
 * Les teintes sont définies en oklch dans components/exercices/manuel.module.css,
 * à la même clarté que les teintes des outils de Marcel.
 */
export const TEINTES = [
  'encre',
  'violet',
  'jaune',
  'corail',
  'vert',
  'bleu',
  'ciel',
  'turquoise',
  'rose',
  'ambre',
  'brun',
  'sable',
  'gris',
  'blanc',
] as const
export type Teinte = (typeof TEINTES)[number]

export type Motif = 'plein' | 'clair' | 'hachures' | 'points' | 'aucun'

// ============================================================================
// LES DOCUMENTS
// ============================================================================

type DocBase = {
  /** Identifiant local à l'exercice (« doc1 »). */
  id: string
  /** Le titre du document, sous le bandeau « Doc 1 ». */
  titre?: string
  /** La ligne de source, en italique sous le document (« D'après … »). */
  source?: string
}

// ---------------------------------------------------------------- texte

/**
 * Un bloc de texte. Une chaîne = un paragraphe (ou un vers). Dans le texte,
 * `[[g|mot]]` marque un mot-cible (groupe `g`) qu'une question « zone » fera
 * toucher ; le compilateur ôte la marque et range le numéro du mot dans la clé.
 */
export type BlocTexte =
  | string
  | { personnage: string; replique: string }
  | { didascalie: string }

export type DocTexte = DocBase & {
  type: 'texte'
  genre: 'recit' | 'poeme' | 'theatre' | 'article' | 'lettre' | 'source' | 'consigne'
  /** « Rudyard Kipling, Histoires comme ça (1902) ». */
  auteur?: string
  blocs: BlocTexte[]
}

// --------------------------------------------------------------- tableau

export type DocTableau = DocBase & {
  type: 'tableau'
  colonnes: string[]
  lignes: (string | number)[][]
  /** La première colonne est un en-tête de ligne (grisée, en gras). */
  enteteLignes?: boolean
}

// ------------------------------------------------------------- graphique

export type SerieGraphique = {
  nom: string
  valeurs: (number | null)[]
  teinte?: Teinte
}

export type DocGraphique = DocBase & {
  type: 'graphique'
  /**
   *  barres       diagramme en bâtons / barres verticales
   *  barres-h     barres horizontales (libellés longs)
   *  courbe       une ou plusieurs courbes
   *  secteurs     diagramme circulaire (une seule série, en %)
   *  climat       diagramme ombrothermique : séries[0] = températures (°C,
   *               courbe), séries[1] = précipitations (mm, barres), P = 2T
   */
  forme: 'barres' | 'barres-h' | 'courbe' | 'secteurs' | 'climat'
  categories: string[]
  series: SerieGraphique[]
  axeY?: { titre?: string; unite?: string; min?: number; max?: number; pas?: number }
  axeX?: { titre?: string }
  /** Écrit la valeur au bout de chaque barre. */
  valeurs?: boolean
}

// ----------------------------------------------------------------- carte

/** Les fonds de carte disponibles (lib/exercices/cartes). */
export const FONDS_CARTE = ['france', 'monde', 'mediterranee', 'europe'] as const
export type FondCarte = (typeof FONDS_CARTE)[number]

export type LieuCarte = {
  id: string
  /** Un lieu du répertoire (lib/exercices/cartes/lieux.ts) : « paris »… */
  lieu?: string
  lon?: number
  lat?: number
  /** Le nom écrit à côté du point ; absent = le point est muet. */
  nom?: string
  symbole?: 'point' | 'etoile' | 'carre' | 'triangle' | 'lettre'
  /** La lettre du repère (« A ») quand symbole = lettre. */
  lettre?: string
  teinte?: Teinte
  taille?: 1 | 2 | 3
}

export type TraitCarte = {
  id?: string
  /** Suite de [lon, lat] ou de lieux du répertoire. */
  points: ([number, number] | string)[]
  style: 'fleche' | 'ligne' | 'pointilles'
  teinte?: Teinte
  epaisseur?: 1 | 2 | 3
  etiquette?: string
}

export type AireCarte = {
  id?: string
  contour: [number, number][]
  teinte: Teinte
  motif?: Motif
  etiquette?: string
  /**
   * L'aire ne se peint que sur les TERRES : un contour grossier (l'Empire
   * romain, un foyer de peuplement) épouse alors les côtes, sans déborder
   * sur la mer. Idéal pour une extension d'empire ou une zone climatique.
   */
  surTerre?: boolean
  /** Où écrire l'étiquette (sinon au centre du contour). */
  etiquetteA?: [number, number]
}

export type DocCarte = DocBase & {
  type: 'carte'
  fond: FondCarte
  /** [lonMin, latMin, lonMax, latMax] : un recadrage du fond. */
  cadrage?: [number, number, number, number]
  /** Régions (France) ou pays (code ISO3) coloriés. */
  regions?: { code: string; teinte: Teinte; motif?: Motif; etiquette?: string }[]
  /** Toutes les régions / tous les pays se touchent (question « zone »). */
  regionsCliquables?: boolean
  lieux?: LieuCarte[]
  traits?: TraitCarte[]
  aires?: AireCarte[]
  etiquettes?: { texte: string; lon: number; lat: number; style?: 'mer' | 'region' | 'ville' | 'pays' }[]
  /** Les grands fleuves du fond (true = tous). */
  fleuves?: boolean | string[]
  /** Les massifs montagneux du fond (true = tous). */
  reliefs?: boolean | string[]
  /** Les grands déserts (fonds monde et méditerranée ; true = tous). */
  deserts?: boolean | string[]
  /** Dessine les frontières des pays d'aujourd'hui (fonds méditerranée, europe). */
  frontieres?: boolean
  /** Carte muette : ni mers ni pays nommés (le fond ne souffle rien). */
  muette?: boolean
  /** Équateur et tropiques (fond monde). */
  reperes?: boolean
  legende?: { teinte: Teinte; motif?: Motif; symbole?: LieuCarte['symbole']; texte: string }[]
}

// ----------------------------------------------------------------- frise

export type DocFrise = DocBase & {
  type: 'frise'
  /** Années ; négatif = avant J.-C. */
  debut: number
  fin: number
  pas: number
  periodes?: { id?: string; debut: number; fin: number; nom: string; teinte?: Teinte }[]
  evenements?: { id: string; date: number; nom: string; teinte?: Teinte }[]
}

// ---------------------------------------------------------------- figure

export type Position = 'n' | 'ne' | 'e' | 'se' | 's' | 'so' | 'o' | 'no'

export type DocFigure = DocBase & {
  type: 'figure'
  /** Le cadre, en unités (1 unité = 1 carreau si quadrillage). */
  cadre: { xmin: number; xmax: number; ymin: number; ymax: number }
  quadrillage?: boolean
  axes?: boolean
  points?: { id: string; x: number; y: number; nom?: string; position?: Position; cache?: boolean }[]
  segments?: {
    id?: string
    de: string
    a: string
    style?: 'plein' | 'pointilles'
    teinte?: Teinte
    codage?: 1 | 2 | 3
    longueur?: string
  }[]
  droites?: { id?: string; par: [string, string]; nom?: string; teinte?: Teinte; style?: 'plein' | 'pointilles' | 'axe' }[]
  demiDroites?: { id?: string; origine: string; par: string; teinte?: Teinte }[]
  cercles?: { id?: string; centre: string; rayon: number; teinte?: Teinte; style?: 'plein' | 'pointilles' }[]
  angles?: { id?: string; sommet: string; de: string; a: string; droit?: boolean; mesure?: string; teinte?: Teinte }[]
  polygones?: { id?: string; sommets: string[]; teinte?: Teinte; motif?: Motif }[]
  textes?: { x: number; y: number; texte: string; teinte?: Teinte }[]
}

// -------------------------------------------------------- droite graduée

export type DocDroite = DocBase & {
  type: 'droite'
  min: number
  max: number
  /** Écart entre deux graduations principales (numérotées). */
  pas: number
  /** En combien de parts égales on coupe un pas (10 = dixièmes ; 1 = aucune). */
  division?: number
  /** Numérote chaque graduation principale (défaut), ou seulement celles-ci. */
  etiquettes?: number[]
  points?: { id: string; valeur: number; nom: string; teinte?: Teinte }[]
  /** Les graduations se touchent (question « zone » : placer un nombre). */
  graduationsCliquables?: boolean
}

// ---------------------------------------------------------------- schéma

type ElementBase = {
  id?: string
  /** L'élément se touche (question « zone »). */
  zone?: boolean
  teinte?: Teinte
  motif?: Motif
}

export type ElementSchema =
  | (ElementBase & { forme: 'rect'; x: number; y: number; l: number; h: number; arrondi?: number; texte?: string })
  | (ElementBase & { forme: 'cercle'; cx: number; cy: number; r: number; texte?: string })
  | (ElementBase & { forme: 'ellipse'; cx: number; cy: number; rx: number; ry: number; texte?: string })
  | (ElementBase & {
      forme: 'ligne'
      de: [number, number]
      a: [number, number]
      style?: 'plein' | 'pointilles'
      fleche?: 'fin' | 'debut' | 'deux'
      epaisseur?: 1 | 2 | 3
      courbe?: number
    })
  | (ElementBase & { forme: 'polygone'; points: [number, number][] })
  | (ElementBase & { forme: 'chemin'; d: string; ferme?: boolean })
  | (ElementBase & {
      forme: 'texte'
      x: number
      y: number
      texte: string
      taille?: 'petit' | 'normal' | 'grand'
      gras?: boolean
      italique?: boolean
      ancre?: 'debut' | 'milieu' | 'fin'
    })
  | (ElementBase & { forme: 'etiquette'; x: number; y: number; texte: string; vers?: [number, number] })
  | (ElementBase & { forme: 'emoji'; x: number; y: number; emoji: string; taille?: number })

export type DocSchema = DocBase & {
  type: 'schema'
  largeur: number
  hauteur: number
  elements: ElementSchema[]
  legende?: { teinte: Teinte; motif?: Motif; texte: string }[]
}

// ---------------------------------------------------------------- chaîne

export type DocChaine = DocBase & {
  type: 'chaine'
  /** ligne (gauche → droite), colonne (haut → bas), cycle (en rond). */
  disposition: 'ligne' | 'colonne' | 'cycle'
  noeuds: { id: string; texte: string; emoji?: string; teinte?: Teinte }[]
  liens: { de: string; a: string; texte?: string; style?: 'plein' | 'pointilles' }[]
}

// ------------------------------------------------ document « authentique »

export type LigneFiche =
  | { texte: string; valeur?: string; gras?: boolean; id?: string }
  | { separateur: true }

export type DocFiche = DocBase & {
  type: 'fiche'
  modele: 'ticket' | 'menu' | 'affiche' | 'etiquette' | 'invitation' | 'panneau' | 'recette' | 'horaires' | 'carte-postale'
  entete: string
  sousTitre?: string
  emoji?: string
  lignes: LigneFiche[]
  pied?: string
  teinte?: Teinte
}

// -------------------------------------------------------------- dialogue

export type DocDialogue = DocBase & {
  type: 'dialogue'
  modele: 'sms' | 'bulles'
  participants: { nom: string; emoji?: string; cote: 'gauche' | 'droite' }[]
  /** `[[g|mot]]` marque un mot-cible, comme dans un texte. */
  repliques: { qui: string; texte: string }[]
}

// --------------------------------------------------------------- scratch

export const CATEGORIES_SCRATCH = [
  'evenement',
  'mouvement',
  'apparence',
  'son',
  'controle',
  'capteur',
  'operateur',
  'variable',
  'stylo',
] as const
export type CategorieScratch = (typeof CATEGORIES_SCRATCH)[number]

export type BlocScratch = {
  id?: string
  categorie: CategorieScratch
  /** « avancer de (10) pas » : les parenthèses deviennent des cases blanches. */
  texte: string
  /** Le corps d'une boucle ou d'un « si ». */
  interieur?: BlocScratch[]
  /** La branche « sinon ». */
  sinon?: BlocScratch[]
  zone?: boolean
}

export type DocScratch = DocBase & {
  type: 'scratch'
  scripts: BlocScratch[][]
}

// --------------------------------------------------------------- horloge

export type DocHorloge = DocBase & {
  type: 'horloge'
  heures: number
  minutes: number
  /** Affiche aussi l'heure en chiffres sous le cadran. */
  numerique?: boolean
}

// ---------------------------------------------------------------- solide

export type DocSolide = DocBase & {
  type: 'solide'
  /** Un pavé droit (le cube en est un), en perspective cavalière. */
  longueur: number
  largeur: number
  hauteur: number
  /** Dessine les cubes-unités. */
  cubes?: boolean
  /** Écrit les dimensions (« 4 cm »…) ; `unite` suffixée. */
  cotes?: boolean
  unite?: string
}

// --------------------------------------------------------------- circuit

export const COMPOSANTS = [
  'pile',
  'lampe',
  'interrupteur-ouvert',
  'interrupteur-ferme',
  'moteur',
  'del',
  'diode',
  'resistance',
  'amperemetre',
  'voltmetre',
  'generateur',
  'buzzer',
] as const
export type Composant = (typeof COMPOSANTS)[number]

/**
 * Un circuit électrique aux symboles normalisés. Chaque BRANCHE est un segment
 * horizontal ou vertical entre deux nœuds du quadrillage ([x, y] en carreaux,
 * y vers le bas) ; un composant se dessine au milieu de sa branche. Les points
 * où se rejoignent trois fils ou plus reçoivent automatiquement leur point de
 * dérivation.
 */
export type DocCircuit = DocBase & {
  type: 'circuit'
  branches: {
    de: [number, number]
    a: [number, number]
    composant?: Composant
    /** L'id rend le composant touchable (question « zone »). */
    id?: string
    /** Le nom écrit à côté (« L1 », « M »). */
    nom?: string
    /** Une lampe allumée brille ; un moteur qui tourne a sa flèche. */
    allume?: boolean
  }[]
}

export type Document =
  | DocCircuit
  | DocTexte
  | DocTableau
  | DocGraphique
  | DocCarte
  | DocFrise
  | DocFigure
  | DocDroite
  | DocSchema
  | DocChaine
  | DocFiche
  | DocDialogue
  | DocScratch
  | DocHorloge
  | DocSolide

export type TypeDocument = Document['type']

// ============================================================================
// LES QUESTIONS — telles qu'on les ÉCRIT (réponses comprises)
// ============================================================================

type QuestionSourceBase = {
  /** La question, en texte court (`**gras**`, `*italique*`, `{{3/4}}`). */
  enonce: string
  /** Le coup de pouce, montré après une première réponse fausse. */
  aide?: string
  /** Le pourquoi de la bonne réponse, montré une fois la question finie. */
  explication: string
}

export type QuestionSource =
  | (QuestionSourceBase & {
      type: 'choix'
      options: string[]
      /** Indice de la bonne option, ou des bonnes options (choix multiple). */
      reponse: number | number[]
      /** Garde l'ordre écrit (Vrai/Faux, échelles…) au lieu de mélanger. */
      ordreFixe?: boolean
    })
  | (QuestionSourceBase & {
      type: 'nombre'
      reponse: number
      tolerance?: number
      unite?: string
    })
  | (QuestionSourceBase & {
      type: 'texte'
      /** Les réponses acceptées ; la première est celle qu'on affiche. */
      reponse: string[]
      placeholder?: string
    })
  | (QuestionSourceBase & {
      type: 'zone'
      document: string
      /**
       * Ce qu'il faut toucher : ids d'éléments (lieux, régions, nœuds…),
       * groupes de mots `[[g|…]]` d'un texte, indices de catégorie `k0`
       * d'un graphique, cases `r1c2` d'un tableau, valeurs `v2.5` d'une
       * droite graduée.
       */
      reponse: string[]
      multiple?: boolean
      /** Texte : les blocs à reprendre dans la question (défaut : tous). */
      portee?: number[]
    })
  | (QuestionSourceBase & {
      type: 'ordre'
      /** Les étapes DANS LE BON ORDRE ; l'élève les reçoit mélangées. */
      items: string[]
    })
  | (QuestionSourceBase & {
      type: 'association'
      /** Les bonnes paires [gauche, droite] ; la droite est mélangée. */
      paires: [string, string][]
    })
  | (QuestionSourceBase & {
      type: 'categories'
      categories: string[]
      /** [texte, indice de sa catégorie]. */
      items: [string, number][]
    })
  | (QuestionSourceBase & {
      type: 'trous'
      /** Chaque `___` est un trou, dans l'ordre. */
      texte: string
      /** Pour chaque trou, les réponses acceptées (la première est affichée). */
      reponses: string[][]
      /** Une banque de mots à glisser (doit contenir les réponses). */
      banque?: string[]
    })

export type TypeQuestion = QuestionSource['type']

export type ExerciceSource = {
  /** L'UUID du chapitre (table chapters). */
  chapitre: string
  position: 1 | 2 | 3
  etoiles: Etoiles
  titre: string
  competence: Competence
  /** La mise en situation, 1 à 3 phrases. */
  situation: string
  documents: Document[]
  questions: QuestionSource[]
}

/** Un fichier de contenu : contenu/exercices/<niveau>/<matiere>.json */
export type FichierExercices = {
  niveau: string
  matiere: string
  exercices: ExerciceSource[]
}

// ============================================================================
// CE QUI PART VERS L'ÉLÈVE
// ============================================================================

type QuestionPubliqueBase = {
  enonce: string
  aide?: string
}

export type OptionPublique = { id: string; texte: string }

export type QuestionPublique =
  | (QuestionPubliqueBase & { type: 'choix'; options: OptionPublique[]; multiple: boolean })
  | (QuestionPubliqueBase & { type: 'nombre'; unite?: string })
  | (QuestionPubliqueBase & { type: 'texte'; placeholder?: string })
  | (QuestionPubliqueBase & { type: 'zone'; document: string; multiple: boolean; portee?: number[] })
  | (QuestionPubliqueBase & { type: 'ordre'; items: OptionPublique[] })
  | (QuestionPubliqueBase & { type: 'association'; gauche: OptionPublique[]; droite: OptionPublique[] })
  | (QuestionPubliqueBase & { type: 'categories'; categories: OptionPublique[]; items: OptionPublique[] })
  | (QuestionPubliqueBase & {
      type: 'trous'
      /** Le texte découpé : chaîne = texte, nombre = numéro du trou. */
      segments: (string | number)[]
      banque?: string[]
    })

export type ExercicePublic = {
  titre: string
  competence: Competence
  situation: string
  documents: Document[]
  questions: QuestionPublique[]
}

// ============================================================================
// LES CLÉS — ce que seul le serveur lit (table exercices_cles)
// ============================================================================

export type Cle =
  | { type: 'choix' | 'zone' | 'ordre'; ids: string[] }
  | { type: 'nombre'; valeur: number; tolerance: number }
  | { type: 'texte'; acceptes: string[] }
  | { type: 'association'; paires: Record<string, string> }
  | { type: 'categories'; items: Record<string, string> }
  | { type: 'trous'; trous: string[][] }

/** La clé d'une question, avec ce qu'on montre une fois la question finie. */
export type CleQuestion = {
  cle: Cle
  /** La bonne réponse lisible (« 12,5 cm », « la Loire »), si le widget ne suffit pas. */
  affichage?: string
  explication: string
}

/** La réponse d'un élève, telle qu'envoyée au serveur. */
export type Reponse =
  | { ids: string[] }
  | { valeur: number }
  | { texte: string }
  | { paires: Record<string, string> }
  | { items: Record<string, string> }
  | { trous: string[] }

/** Le verdict d'une réponse. `bons/total` : combien d'éléments sont justes. */
export type Verdict = { juste: boolean; bons: number; total: number }
