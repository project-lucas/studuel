// -----------------------------------------------------------------------------
// L'ENCYCLOPÉDIE — le troisième rayon du dossier Histoire-Géo.
//
// Le programme range l'histoire par CHAPITRES ; l'encyclopédie la range par
// GENS et par ÉVÉNEMENTS. Ce n'est pas le même geste : on ouvre un chapitre
// pour réviser un contrôle, on ouvre une fiche d'encyclopédie parce qu'un nom
// est tombé dans un cours, dans un quiz, dans un film — et qu'on veut savoir
// qui c'était, en une minute.
//
// LA CITATION EST LE CŒUR DE LA FICHE, pas un ornement. « Je suis née pour
// cela » retient mieux qu'une date de naissance, se répète, se cite en copie,
// et donne à l'élève une prise sur quelqu'un qu'il ne connaissait pas. D'où le
// contrat : une fiche SANS citation n'est pas valide (lib/encyclopedie/
// valider.ts), et la citation est ce que la carte montre AVANT tout le reste.
//
// Le contenu vit en TypeScript dans `lib/encyclopedie/contenu/`, pas en base :
// il est le même pour tous les élèves, il ne change jamais d'une session à
// l'autre, et une lecture Supabase de plus par ouverture de fiche coûterait
// 60 ms pour un texte qui pourrait être servi depuis le cache serveur. Les
// fiches sont donc lues par des composants SERVEUR uniquement (le client ne
// reçoit que l'aperçu, cf. `apercu.ts`) — 200 fiches dans le bundle, c'est
// supabase-js trois fois.
// -----------------------------------------------------------------------------

/** Les deux volets de l'encyclopédie. L'URL et les filtres s'en servent. */
export type Volet = 'personnages' | 'evenements'

/**
 * Les grandes périodes, dans l'ordre du temps et du programme. Ce découpage
 * n'est pas celui des historiens (qui discutent des bornes) mais celui des
 * MANUELS : c'est lui que l'élève retrouve sur la frise de sa classe.
 */
export const PERIODES = [
  'antiquite',
  'moyen-age',
  'temps-modernes',
  'revolution',
  'xixe',
  'guerres',
  'contemporain',
] as const

export type Periode = (typeof PERIODES)[number]

export const PERIODE_LABELS: Record<Periode, string> = {
  antiquite: 'Antiquité',
  'moyen-age': 'Moyen Âge',
  'temps-modernes': 'Temps modernes',
  revolution: 'Révolution et Empire',
  xixe: 'XIXᵉ siècle',
  guerres: 'Guerres mondiales',
  contemporain: 'Monde contemporain',
}

/** Le libellé court des filtres, là où la largeur est comptée (390 px). */
export const PERIODE_LABELS_COURTS: Record<Periode, string> = {
  antiquite: 'Antiquité',
  'moyen-age': 'Moyen Âge',
  'temps-modernes': 'Temps modernes',
  revolution: 'Révolution',
  xixe: 'XIXᵉ',
  guerres: 'Guerres',
  contemporain: 'Aujourd’hui',
}

/** Les bornes de chaque période, en années (négatif = av. J.-C.). */
export const PERIODE_BORNES: Record<Periode, { debut: number; fin: number }> = {
  antiquite: { debut: -4000, fin: 500 },
  'moyen-age': { debut: 400, fin: 1500 },
  'temps-modernes': { debut: 1450, fin: 1800 },
  // Jusqu'en 1825 : Napoléon meurt en 1821 et Talleyrand en 1838. Une borne à
  // 1820 obligeait à classer l'empereur sur une année qui n'est pas la sienne —
  // c'est la borne qui avait tort, pas la fiche.
  revolution: { debut: 1770, fin: 1825 },
  xixe: { debut: 1800, fin: 1918 },
  guerres: { debut: 1900, fin: 1950 },
  contemporain: { debut: 1940, fin: 2100 },
}

/**
 * LA TEINTE D'UNE PÉRIODE EST UNE IDENTITÉ, PAS UN RÔLE — même dérogation
 * assumée que les outils de Marcel, les capsules et les billets de l'arène
 * (cf. CLAUDE.md). Elle habille le médaillon et le liseré d'une fiche pour
 * qu'on reconnaisse « du Moyen Âge » d'un coup d'œil dans une liste de deux
 * cents entrées ; elle ne touche ni un bouton, ni un lien, ni un fond de texte.
 *
 * AUCUNE PÉRIODE N'EST VIOLETTE : dans cet écran, le violet reste la seule
 * couleur cliquable (filtre actif, bouton, lien). Une pastille violette au
 * milieu d'une frise se serait lue comme « sélectionné ».
 *
 * Les noms sont ceux des teintes déjà déclarées dans globals.css
 * (`[data-teinte='…']`) : pas une couleur de plus dans le projet.
 */
export type Teinte = 'ambre' | 'indigo' | 'turquoise' | 'corail' | 'bleu' | 'vert' | 'rose'

export const PERIODE_TEINTES: Record<Periode, Teinte> = {
  antiquite: 'ambre',
  'moyen-age': 'indigo',
  'temps-modernes': 'turquoise',
  revolution: 'corail',
  xixe: 'bleu',
  guerres: 'vert',
  contemporain: 'rose',
}

export function teinteDe(periode: Periode): Teinte {
  return PERIODE_TEINTES[periode]
}

/** Les classes où l'histoire-géo se travaille (le primaire n'en a pas). */
export const NIVEAUX = ['6e', '5e', '4e', '3e', '2de', '1re', 'Tle'] as const
export type Niveau = (typeof NIVEAUX)[number]

// -----------------------------------------------------------------------------
// Les briques d'une fiche.
// -----------------------------------------------------------------------------

/**
 * UNE CITATION. La pièce maîtresse.
 *
 * `contexte` n'est pas décoratif : une phrase sans sa situation ne se retient
 * pas et se cite de travers. `sens` la traduit en langue d'élève — beaucoup de
 * ces phrases sont écrites dans le français du XVIIᵉ ou traduites du latin.
 *
 * `incertaine` marque les phrases qu'on PRÊTE à quelqu'un sans preuve
 * (« Qu'ils mangent de la brioche »). On les garde — elles font partie de la
 * culture commune — mais la fiche le dit, parce que faire répéter à un élève
 * une phrase inventée en la donnant pour vraie, c'est lui apprendre une faute.
 */
export type Citation = {
  texte: string
  /** Qui l'a dite — obligatoire sur un événement, facultatif sur un portrait. */
  qui?: string
  /** Où, quand, à qui. « À ses juges, au procès de Rouen, 1431. » */
  contexte?: string
  /** Ce que ça veut dire, en une phrase simple. */
  sens?: string
  /** Phrase prêtée, non attestée : la fiche l'écrit noir sur blanc. */
  incertaine?: boolean
}

/** Un bloc du récit : un titre court, un paragraphe dense (**gras**, *italique*). */
export type Bloc = {
  titre: string
  texte: string
}

/** Un jalon de la frise de la fiche. */
export type Jalon = {
  /** Affiché tel quel : « 1429 », « 14 juillet 1789 », « 52 av. J.-C. ». */
  date: string
  fait: string
}

/** Un mot du vocabulaire de la fiche, défini sur place. */
export type Mot = {
  mot: string
  sens: string
}

/** Un chiffre qui frappe (événements) : « 20 000 » / « morts à Verdun ». */
export type Chiffre = {
  valeur: string
  quoi: string
}

/**
 * Le socle commun aux deux volets.
 *
 * `tri` est l'année qui sert au classement chronologique (négative avant
 * J.-C.). Elle est SÉPARÉE du libellé affiché (`dates`) parce qu'aucun format
 * lisible — « vers 1412 – 1431 », « 100 – 44 av. J.-C. » — ne se trie sans
 * être d'abord réduit à un nombre, et qu'une devinette d'analyse syntaxique
 * sur deux cents fiches finirait par se tromper sur l'une d'elles.
 */
type Socle = {
  /** Identifiant d'URL, en kebab-case sans accent : « jeanne-d-arc ». */
  id: string
  nom: string
  periode: Periode
  /** L'année de classement (négative = av. J.-C.). */
  tri: number
  /** Le pictogramme du médaillon — un seul caractère visible. */
  emoji: string
  /** Une phrase : ce que l'élève doit retenir s'il ne lit rien d'autre. */
  accroche: string
  /** AU MOINS UNE. C'est la raison d'être de la fiche. */
  citations: Citation[]
  /** « En 30 secondes » : 3 à 6 puces courtes, sans phrase creuse. */
  reperes: string[]
  /** Le récit : 3 à 6 blocs titrés. */
  recit: Bloc[]
  /** La frise de la fiche : 4 à 10 jalons. */
  chrono: Jalon[]
  /** L'anecdote qui se raconte à la récré. Facultative mais précieuse. */
  leSaisTu?: string
  /** Ce qui tombe au contrôle : 3 à 6 affirmations vérifiables. */
  aRetenir: string[]
  /** Le vocabulaire défini sur place (régence, sacre, suffrage censitaire…). */
  mots?: Mot[]
  /** Les identifiants des autres fiches à ouvrir ensuite. */
  lies?: string[]
  /** Les classes où ça tombe. */
  niveaux: Niveau[]
  /** Le chapitre du programme où on le croise. */
  programme?: string
  /** Mots-clés de recherche : lieux, surnoms, mots du cours, synonymes. */
  tags: string[]
}

/**
 * UN PERSONNAGE.
 *
 * `roles` tient lieu de « statut » : ce sont les étiquettes qu'on lirait sous
 * un portrait de musée (« Roi de France », « Sainte », « Physicienne »).
 */
export type Personnage = Socle & {
  volet: 'personnages'
  /** « le Roi saint », « la Pucelle d'Orléans ». Sans majuscule initiale. */
  surnom?: string
  /** Affiché tel quel : « vers 1412 – 1431 », « 1638 – 1715 ». */
  dates: string
  roles: string[]
  /** D'où il ou elle vient : « Domrémy, Lorraine ». */
  origine?: string
}

/**
 * UN ÉVÉNEMENT.
 *
 * Trois colonnes, toujours les mêmes, parce que c'est le raisonnement que
 * l'école demande et que l'élève ne produit pas spontanément : POURQUOI
 * (`causes`) → CE QUI SE PASSE (`recit`) → CE QUE ÇA CHANGE (`consequences`).
 */
export type Evenement = Socle & {
  volet: 'evenements'
  /** Affiché tel quel : « 14 juillet 1789 », « 1337 – 1453 ». */
  date: string
  /** L'année de fin, quand l'événement dure. */
  fin?: number
  lieu?: string
  /** Pourquoi c'est arrivé : 3 à 6 causes, de la plus profonde à l'étincelle. */
  causes: string[]
  /** Ce que ça change : 3 à 6 conséquences. */
  consequences: string[]
  /** Les chiffres qui frappent. */
  chiffres?: Chiffre[]
}

export type Entree = Personnage | Evenement

export function estPersonnage(entree: Entree): entree is Personnage {
  return entree.volet === 'personnages'
}

export function estEvenement(entree: Entree): entree is Evenement {
  return entree.volet === 'evenements'
}

/** Le libellé de dates d'une entrée, quel que soit son volet. */
export function datesDe(entree: Entree): string {
  return estPersonnage(entree) ? entree.dates : entree.date
}
