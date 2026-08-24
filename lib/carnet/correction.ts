// -----------------------------------------------------------------------------
// LA CORRECTION TOLÉRANTE des réponses écrites du carnet.
//
// `gradeLibre` et `gradeTrous` (lib/carnet-cours) comparaient la copie à la
// réponse attendue en ÉGALITÉ STRICTE après normalisation. Deux conséquences
// que personne n'accepterait d'un professeur :
//
//   • « l'ONU » contre « ONU » : FAUX. L'article n'a jamais été la question.
//   • « Rooseveltt » contre « Roosevelt » : FAUX. L'élève sait, il a glissé
//     sur un clavier de téléphone.
//
// Ce module distingue donc TROIS issues, pas deux : juste, PRESQUE, faux. Le
// « presque » compte comme une réussite (la carte avance) mais vaut le verdict
// « Difficile » au planificateur, et l'écran montre l'orthographe exacte. C'est
// exactement ce qu'on veut : ne pas punir la frappe, ne pas laisser passer
// l'erreur non plus.
//
// Pur et testable. La tolérance est réglable par cours (`spell_tolerance`) :
// en langues on la veut serrée, en histoire on la veut large.
// -----------------------------------------------------------------------------

import { canonicalAnswer, trousAnswers } from '@/lib/carnet-cours'

/** Le réglage de tolérance d'un cours. */
export type Tolerance = 'stricte' | 'normale' | 'large'

export const TOLERANCES: readonly Tolerance[] = ['stricte', 'normale', 'large']

export const TOLERANCE_LABEL: Record<Tolerance, string> = {
  stricte: 'Stricte — l’orthographe exacte',
  normale: 'Normale — une faute de frappe passe',
  large: 'Large — deux fautes de frappe passent',
}

export function isTolerance(v: unknown): v is Tolerance {
  return (TOLERANCES as readonly unknown[]).includes(v)
}

export function normalizeTolerance(raw: unknown): Tolerance {
  return isTolerance(raw) ? raw : 'normale'
}

/**
 * Articles et élisions retirés avant comparaison. « l'ONU », « la Seine » et
 * « Seine » désignent la même chose : demander l'article, c'est corriger autre
 * chose que ce qu'on voulait évaluer.
 */
const ARTICLES = /^(l|d|le|la|les|un|une|des|du|de|au|aux|the|el|los|las)\s+/

/** Retire l'article de tête d'une réponse déjà canonique. */
export function sansArticle(s: string): string {
  // `canonicalAnswer` a déjà remplacé l'apostrophe ? Non : elle ne touche qu'aux
  // accents, à la casse et aux espaces. On ramène donc les deux apostrophes
  // usuelles à une espace pour que « l'onu » se lise « l onu », puis on coupe.
  const aplati = s.replace(/['’]/g, ' ').replace(/\s+/g, ' ').trim()
  const coupe = aplati.replace(ARTICLES, '')
  return coupe.length > 0 ? coupe : aplati
}

/**
 * Distance d'édition (Levenshtein) entre deux chaînes, bornée : dès qu'elle
 * dépasse `max`, on rend `max + 1` sans finir le calcul. La borne évite de
 * comparer deux paragraphes caractère par caractère pour rien.
 */
export function distanceEdition(a: string, b: string, max = 3): number {
  if (a === b) return 0
  if (Math.abs(a.length - b.length) > max) return max + 1
  if (a.length === 0) return b.length
  if (b.length === 0) return a.length

  // Une seule ligne de travail, réécrite en place : la matrice complète ne sert
  // à rien, on ne remonte jamais le chemin.
  let precedente = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    const courante = [i, ...Array<number>(b.length).fill(0)]
    let minLigne = i
    for (let j = 1; j <= b.length; j++) {
      const cout = a[i - 1] === b[j - 1] ? 0 : 1
      courante[j] = Math.min(
        courante[j - 1] + 1, // insertion
        precedente[j] + 1, // suppression
        precedente[j - 1] + cout, // substitution
      )
      if (courante[j] < minLigne) minLigne = courante[j]
    }
    // Toute la ligne dépasse déjà la borne : le résultat final aussi.
    if (minLigne > max) return max + 1
    precedente = courante
  }
  return precedente[b.length]
}

/**
 * Nombre de fautes de frappe tolérées pour une réponse de `longueur`
 * caractères. Une tolérance FIXE serait absurde : une faute sur « an » change
 * le mot, une faute sur « anticonstitutionnellement » est un glissement de
 * doigt. On tolère donc en proportion, avec un plafond.
 */
export function fautesTolerees(longueur: number, tolerance: Tolerance): number {
  if (tolerance === 'stricte') return 0
  const plafond = tolerance === 'large' ? 2 : 1
  // En dessous de 5 caractères, aucune faute n'est un glissement : « chat » et
  // « char » sont deux MOTS, pas une frappe ratée — une lettre y pèse le quart
  // de la réponse. Le seuil était à 4 et laissait justement passer ce cas.
  if (longueur < 5) return 0
  // Une seule faute jusqu'à neuf caractères, même en mode large : c'est encore
  // assez court pour qu'une deuxième différence change le mot.
  if (longueur < 10) return Math.min(1, plafond)
  return plafond
}

export type Issue = {
  correct: boolean
  /** Juste À LA FRAPPE PRÈS : la carte avance, mais en « Difficile ». */
  presque: boolean
  /** L'orthographe exacte à montrer quand c'était « presque ». */
  attendue: string | null
}

const FAUX: Issue = { correct: false, presque: false, attendue: null }

/**
 * Compare une copie à la liste des réponses acceptées. Rend la MEILLEURE issue :
 * une réponse exacte l'emporte toujours sur un « presque » trouvé ailleurs
 * dans la liste.
 */
export function comparerReponse(
  donnee: string,
  attendues: readonly string[],
  tolerance: Tolerance = 'normale',
): Issue {
  const copie = canonicalAnswer(donnee)
  if (copie.length === 0) return FAUX
  if (attendues.length === 0) return FAUX

  const copieNue = sansArticle(copie)
  let presque: Issue | null = null

  for (const brute of attendues) {
    const attendue = canonicalAnswer(brute)
    if (attendue.length === 0) continue

    // 1. Égalité franche.
    if (copie === attendue) {
      return { correct: true, presque: false, attendue: null }
    }

    // 2. À l'article près — ce n'est PAS une faute, c'est la même réponse.
    const attendueNue = sansArticle(attendue)
    if (copieNue === attendueNue) {
      return { correct: true, presque: false, attendue: null }
    }

    // 3. À la frappe près.
    const marge = fautesTolerees(attendueNue.length, tolerance)
    if (marge > 0 && distanceEdition(copieNue, attendueNue, marge) <= marge) {
      presque ??= { correct: true, presque: true, attendue: brute.trim() }
    }
  }

  return presque ?? FAUX
}

// --- Texte à trous : variantes acceptées et indices ----------------------------
//
// Le format d'origine n'acceptait QU'UN mot par trou : « La [Seine] traverse
// [Paris] ». Trois manques, tous corrigés ici sans casser l'existant (un trou
// écrit à l'ancienne se lit exactement pareil) :
//
//   • plusieurs réponses justes         → « [Seine|la Seine] »
//   • un indice quand l'élève sèche     → « [Seine::le fleuve de Paris] »
//   • une correction tolérante          → gérée par `comparerReponse`

/** Séparateur des variantes acceptées à l'intérieur d'un trou. */
export const SEP_VARIANTES = '|'
/** Séparateur de l'indice, à la fin d'un trou. */
export const SEP_INDICE = '::'

export type TrouAttendu = {
  /** Les réponses acceptées, dans l'ordre d'écriture (la 1re fait référence). */
  reponses: string[]
  /** L'indice, montré à la demande pendant la session. */
  indice: string | null
}

/** Découpe le contenu d'un trou en réponses acceptées + indice éventuel. */
export function parseTrouAttendu(brut: string): TrouAttendu {
  const [avant, ...apres] = String(brut).split(SEP_INDICE)
  const indiceBrut = apres.join(SEP_INDICE).trim()
  const reponses = avant
    .split(SEP_VARIANTES)
    .map((r) => r.trim())
    .filter((r) => r.length > 0)
  return {
    reponses,
    indice: indiceBrut.length > 0 ? indiceBrut : null,
  }
}

/** Les trous d'un texte, chacun avec ses variantes et son indice. */
export function trousAttendus(texte: string): TrouAttendu[] {
  return trousAnswers(texte).map(parseTrouAttendu)
}

/**
 * Corrige un texte à trous. Tous les trous doivent être justes ; un seul
 * « presque » suffit à qualifier l'ensemble de « presque » (et à montrer
 * l'orthographe exacte du trou concerné).
 */
export function corrigerTrous(
  texte: string,
  copies: readonly string[],
  tolerance: Tolerance = 'normale',
): Issue {
  const attendus = trousAttendus(texte)
  if (attendus.length === 0) return FAUX
  // Un nombre de réponses qui ne colle pas au nombre de trous n'est pas une
  // copie incomplète à corriger au mieux : c'est un appel qui ne correspond
  // pas à la question.
  if (copies.length !== attendus.length) return FAUX

  let presque = false
  let attendue: string | null = null
  for (let i = 0; i < attendus.length; i++) {
    const issue = comparerReponse(copies[i] ?? '', attendus[i].reponses, tolerance)
    if (!issue.correct) return FAUX
    if (issue.presque && !presque) {
      presque = true
      attendue = issue.attendue
    }
  }
  return { correct: true, presque, attendue }
}
