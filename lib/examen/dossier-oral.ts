// -----------------------------------------------------------------------------
// LE DOSSIER D'ORAL (16/10/2026, maquettes 2, 4, 5 et 6 de
// assets-sources/maquettes/marcel-examen.html) — ce que personne ne fait :
// suivre, pièce par pièce, ce que l'élève présentera à l'oral.
//
//   3e   un PROJET (l'oral du brevet : un projet mené dans l'année)
//   1re  sa LISTE DE TEXTES (le descriptif de l'oral de français)
//   Tle  ses DEUX QUESTIONS du Grand oral (le jury en choisit une)
//
// Chaque pièce porte ses ÉTAPES, cochées par l'élève (ou par l'oral blanc) ;
// une pièce est « prête » quand toutes ses étapes le sont. Stockage : table
// `examen_oral` (migration 585). Logique PURE et testée.
// -----------------------------------------------------------------------------

import type { IdExamen } from './parcours'

export type GenrePiece = 'projet' | 'texte' | 'question'

export type Etape = { id: string; label: string; court: string; icone: 'book-open' | 'spell-check' | 'mic' | 'target' | 'list-ordered' | 'quote' }

/** Les étapes de chaque genre de pièce, dans l'ordre où on les franchit. */
export const ETAPES: Record<GenrePiece, readonly Etape[]> = {
  projet: [
    { id: 'sujet', label: 'Le sujet est clair', court: 'sujet', icone: 'target' },
    { id: 'plan', label: 'Le plan de l’exposé est prêt', court: 'plan', icone: 'list-ordered' },
    { id: 'oral', label: 'Présenté à l’oral blanc', court: 'oral blanc', icone: 'mic' },
  ],
  texte: [
    { id: 'explication', label: 'L’explication linéaire est prête', court: 'explication', icone: 'book-open' },
    { id: 'grammaire', label: 'La grammaire du texte est vue', court: 'grammaire', icone: 'spell-check' },
    { id: 'oral', label: 'Passé à l’oral blanc', court: 'oral blanc', icone: 'mic' },
  ],
  question: [
    { id: 'problematique', label: 'La question est posée', court: 'question', icone: 'target' },
    { id: 'plan', label: 'Le plan est prêt', court: 'plan', icone: 'list-ordered' },
    { id: 'introduction', label: 'L’accroche et l’introduction sont prêtes', court: 'intro', icone: 'quote' },
    { id: 'oral', label: 'Passé au Grand oral blanc', court: 'oral blanc', icone: 'mic' },
  ],
}

/** Le genre de pièce de chaque examen, et combien il en faut. */
export const DOSSIER: Record<IdExamen, { genre: GenrePiece; max: number; titre: string; vide: string; ajouter: string }> = {
  brevet: {
    genre: 'projet',
    max: 1,
    titre: 'Ton oral du brevet',
    vide: 'Un projet mené dans l’année (un EPI, un parcours, un voyage, une œuvre…). Écris son sujet : je t’aide à faire ton plan, puis tu me le présentes.',
    ajouter: 'Écrire mon sujet',
  },
  'bac-francais': {
    genre: 'texte',
    max: 30,
    titre: 'Ta liste de textes',
    vide: 'Recopie les textes de ton descriptif, ou prends-le en photo : pour chacun, on prépare l’explication, la grammaire, puis l’oral blanc.',
    ajouter: 'Ajouter un texte',
  },
  bac: {
    genre: 'question',
    max: 2,
    titre: 'Ton Grand oral',
    vide: 'Tes deux questions, préparées avec tes spécialités. Le jour J, le jury en choisit une : les deux doivent être prêtes.',
    ajouter: 'Écrire une question',
  },
}

export type Piece = {
  id: string
  genre: GenrePiece
  titre: string
  /** Auteur et œuvre d'un texte, spécialités d'une question. */
  detail: string | null
  /** Slug de la matière (une spécialité pour le Grand oral). */
  matiere: string | null
  etapes: Record<string, boolean>
  /** Nombre d'oraux blancs passés sur cette pièce. */
  passages: number
  ordre: number
}

const LONGUEUR_TITRE = 200

/** Normalise une ligne brute de `examen_oral`, ou `null` si elle est invalide. */
export function normaliserPiece(raw: unknown): Piece | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  const genre = o.genre
  if (genre !== 'projet' && genre !== 'texte' && genre !== 'question') return null
  if (typeof o.id !== 'string' || typeof o.titre !== 'string' || !o.titre.trim()) return null
  const etapesBrutes = o.etapes && typeof o.etapes === 'object' ? (o.etapes as Record<string, unknown>) : {}
  const etapes: Record<string, boolean> = {}
  for (const e of ETAPES[genre]) etapes[e.id] = etapesBrutes[e.id] === true
  return {
    id: o.id,
    genre,
    titre: o.titre.trim().slice(0, LONGUEUR_TITRE),
    detail: typeof o.detail === 'string' && o.detail.trim() ? o.detail.trim().slice(0, LONGUEUR_TITRE) : null,
    matiere: typeof o.matiere === 'string' && o.matiere ? o.matiere : null,
    etapes,
    passages: typeof o.passages === 'number' && o.passages > 0 ? Math.floor(o.passages) : 0,
    ordre: typeof o.ordre === 'number' ? o.ordre : 0,
  }
}

export function normaliserDossier(raw: unknown): Piece[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map(normaliserPiece)
    .filter((p): p is Piece => p !== null)
    .sort((a, b) => a.ordre - b.ordre)
}

export function estPrete(p: Piece): boolean {
  return ETAPES[p.genre].every((e) => p.etapes[e.id])
}

/** La part des étapes franchies, de 0 à 1 (une pièce vide compte 0). */
export function avancee(p: Piece): number {
  const e = ETAPES[p.genre]
  return e.filter((x) => p.etapes[x.id]).length / e.length
}

/** Le nombre de textes qu'on suppose au descriptif tant que l'élève n'en a pas recopié plus. */
export const PLANCHER_TEXTES = 16

export type EtatDossier = {
  pieces: number
  pretes: number
  /** L'avancée moyenne du dossier, de 0 à 1 — la préparation de l'oral. */
  part: number
  /** Ce qui manque encore pour qu'il soit complet (le nombre de pièces attendues). */
  attendues: number
}

/**
 * L'état du dossier. Pour le brevet et le Grand oral, le nombre de pièces est
 * connu (1 et 2) : une question pas encore écrite compte comme une pièce à 0.
 * Pour la liste de textes, on ne connaît que ce que l'élève a recopié.
 */
export function etatDossier(examen: IdExamen, pieces: readonly Piece[]): EtatDossier {
  const { max, genre } = DOSSIER[examen]
  // Un descriptif compte une vingtaine de textes : un seul texte prêt ne doit
  // pas dire « oral prêt ». Plancher de 16, ou plus si l'élève en a recopié plus.
  const attendues = genre === 'texte' ? Math.max(pieces.length, PLANCHER_TEXTES) : max
  const pretes = pieces.filter(estPrete).length
  const somme = pieces.reduce((s, p) => s + avancee(p), 0)
  return { pieces: pieces.length, pretes, part: attendues > 0 ? somme / attendues : 0, attendues }
}

/**
 * Le TIRAGE de l'oral blanc, comme l'examinateur : une pièce au hasard, en
 * favorisant celles qui n'ont encore jamais été passées (le hasard vient du
 * paramètre, pour être testable).
 */
export function tirerPiece(pieces: readonly Piece[], hasard: number): Piece | null {
  if (pieces.length === 0) return null
  const jamais = pieces.filter((p) => p.passages === 0)
  const urne = jamais.length > 0 ? jamais : pieces
  const i = Math.min(urne.length - 1, Math.max(0, Math.floor(hasard * urne.length)))
  return urne[i]
}

// ------------------------------------------------------------ l'oral blanc

export type TempsOral = { id: string; titre: string; detail: string; minutes: number }

/**
 * Le déroulé de l'oral blanc de chaque examen, calé sur l'épreuve réelle.
 * La préparation est chronométrée dans l'app ; le reste se passe avec Marcel.
 */
export const DEROULE_ORAL: Record<IdExamen, { preparation: number; temps: TempsOral[]; consigne: string }> = {
  brevet: {
    preparation: 0,
    temps: [
      { id: 'expose', titre: 'Ton exposé', detail: 'Tu présentes ton projet, sans lire tes notes', minutes: 5 },
      { id: 'entretien', titre: 'L’entretien', detail: 'Je joue le jury et je te pose des questions', minutes: 10 },
    ],
    consigne: 'Je passe l’oral blanc du brevet. Mon projet : « {titre} ». Joue le jury : écoute mon exposé de 5 minutes, puis pose-moi les questions de l’entretien, une à une. À la fin, note-moi sur la grille du brevet et donne-moi deux choses à travailler.',
  },
  'bac-francais': {
    preparation: 30,
    temps: [
      { id: 'explication', titre: 'Explique, au micro', detail: 'La lecture puis l’explication linéaire — je t’écoute', minutes: 10 },
      { id: 'grammaire', titre: 'La question de grammaire', detail: 'Je te la pose sur une phrase du texte', minutes: 2 },
      { id: 'entretien', titre: 'L’entretien', detail: 'Ton œuvre choisie, je joue l’examinateur', minutes: 8 },
    ],
    consigne: 'Je passe l’oral blanc du bac de français sur le texte « {titre} »{detail}. Joue l’examinateur : écoute mon explication linéaire, pose-moi ensuite une question de grammaire sur une phrase du texte, puis l’entretien sur mon œuvre choisie. À la fin, note-moi sur 20 selon la grille officielle et donne-moi deux choses à travailler.',
  },
  bac: {
    preparation: 20,
    temps: [
      { id: 'presentation', titre: 'Ta présentation, debout', detail: 'Dix minutes, sans notes rédigées', minutes: 10 },
      { id: 'echange', titre: 'L’échange avec le jury', detail: 'Je te pose les questions du jury', minutes: 10 },
    ],
    consigne: 'Je passe le Grand oral blanc sur ma question « {titre} »{detail}. Joue le jury : écoute ma présentation de 10 minutes, puis mène un échange de 10 minutes pour approfondir et tester mes connaissances. À la fin, note-moi sur 20 selon la grille du Grand oral et donne-moi deux choses à travailler.',
  },
}

/** La demande à Marcel qui ouvre l'oral blanc sur une pièce. */
export function consigneOralBlanc(examen: IdExamen, piece: Pick<Piece, 'titre' | 'detail'>): string {
  const detail = piece.detail ? ` (${piece.detail})` : ''
  return DEROULE_ORAL[examen].consigne.replace('{titre}', piece.titre).replace('{detail}', detail)
}
