// -----------------------------------------------------------------------------
// LA MANCHE INACHEVÉE — l'effet Zeigarnik appliqué au quiz (28/10/2026).
//
// Lucas : « dis-moi comment implémenter l'effet Zeigarnik », puis « lance tous
// les points proposés ». Une tâche entamée et pas finie se retient et appelle à
// être bouclée. Or le quiz n'envoyait ses réponses qu'à la FIN de la manche :
// un élève qui fermait l'app à 6/10 ne retrouvait rien, et le bon moment pour
// le rappeler (« plus que 4 questions ») était perdu.
//
// LE BROUILLON garde la manche en cours : le paquet servi (les identifiants des
// questions, dans l'ordre), les réponses déjà données, le chrono qui restait.
// Il ne vaut RIEN côté récompenses : le serveur continue de juger et de verser
// l'XP seulement à la fin (`recordTestSession`), et une manche reprise est une
// manche comme une autre. Il est écrit dans le navigateur à chaque réponse
// validée (lib/quiz-brouillon-local) et, depuis la migration 604, recopié en
// base quand l'élève quitte l'écran, pour le retrouver sur un autre appareil.
//
// Ce qu'il ne fait PAS : ressusciter une manche abandonnée par le chrono. La
// règle du 16/09 (« à zéro, ça quitte ») reste : le brouillon est effacé avec
// elle.
//
// Pur et testé.
// -----------------------------------------------------------------------------

import { CHRONO_MAX_SECONDES } from '@/lib/quiz-chrono'

export const BROUILLON_VERSION = 1

/** Au-delà d'un jour, la manche est oubliée : on ne reprend pas un quiz d'avant-hier. */
export const BROUILLON_DUREE_MS = 24 * 60 * 60 * 1000

/** Le nombre de manches gardées à la fois — les plus récentes. */
export const BROUILLONS_MAX = 8

/** Un paquet plus gros est un stockage trafiqué (le serveur plafonne à 50). */
export const QUESTIONS_MAX = 60

/**
 * LE CHRONO D'UNE REPRISE : le temps qui restait, avec un plancher. Reprendre
 * une manche quittée à 3 s du gong reviendrait à la perdre à la première
 * lecture d'énoncé — et l'élève apprendrait qu'il vaut mieux recommencer que
 * reprendre, l'inverse du but. Vingt secondes : de quoi lire une question.
 */
export const CHRONO_REPRISE_MIN = 20

/** La réponse « sans réponse » du joueur (jamais un index d'option). */
const SANS_REPONSE = -1
/** Un QCM a au plus quelques options : au-delà, l'index est faux. */
const INDEX_MAX = 9

export type BrouillonQuiz = {
  v: typeof BROUILLON_VERSION
  quizId: string
  titre: string
  /** Le nom de la matière, pour la carte de Réviser (null : quiz détaché). */
  matiere: string | null
  /** Le slug de la matière, pour sa vignette. */
  subjectSlug: string | null
  /** Le paquet servi, dans l'ordre : la manche reprend sur les MÊMES questions. */
  questionIds: string[]
  /** Les réponses déjà données, dans l'ordre du paquet. */
  choix: number[]
  /** Le chrono qui restait, en secondes ; null pour une manche sans chrono. */
  secondes: number | null
  /** Le moment de la dernière réponse (ISO). */
  at: string
}

export type StockBrouillons = Readonly<Record<string, BrouillonQuiz>>

const STOCK_VIDE: StockBrouillons = Object.freeze({})

const estTexte = (v: unknown, max: number): v is string =>
  typeof v === 'string' && v.length > 0 && v.length <= max

/**
 * Un brouillon lu ailleurs (stockage du navigateur, colonne JSONB, corps d'une
 * requête), validé champ par champ. Tout ce qui n'a pas la forme exacte est
 * refusé plutôt que réparé : une manche reprise de travers fausserait le score.
 */
export function parserBrouillon(valeur: unknown): BrouillonQuiz | null {
  if (!valeur || typeof valeur !== 'object' || Array.isArray(valeur)) return null
  const v = valeur as Record<string, unknown>
  if (v.v !== BROUILLON_VERSION) return null
  if (!estTexte(v.quizId, 64) || !estTexte(v.titre, 200) || !estTexte(v.at, 40)) return null
  if (Number.isNaN(Date.parse(v.at))) return null
  const matiere = v.matiere === null || v.matiere === undefined ? null : v.matiere
  const slug = v.subjectSlug === null || v.subjectSlug === undefined ? null : v.subjectSlug
  if (matiere !== null && !estTexte(matiere, 80)) return null
  if (slug !== null && !estTexte(slug, 80)) return null

  const ids = v.questionIds
  if (!Array.isArray(ids) || ids.length < 2 || ids.length > QUESTIONS_MAX) return null
  if (!ids.every((id) => estTexte(id, 64))) return null
  if (new Set(ids).size !== ids.length) return null

  const choix = v.choix
  if (!Array.isArray(choix) || choix.length < 1 || choix.length >= ids.length) return null
  if (!choix.every((c) => Number.isInteger(c) && c >= SANS_REPONSE && c <= INDEX_MAX)) return null

  const secondes = v.secondes
  if (secondes !== null && !(Number.isInteger(secondes) && (secondes as number) >= 0)) return null

  return {
    v: BROUILLON_VERSION,
    quizId: v.quizId,
    titre: v.titre,
    matiere: matiere as string | null,
    subjectSlug: slug as string | null,
    questionIds: [...(ids as string[])],
    choix: [...(choix as number[])],
    secondes: secondes === null ? null : Math.min(CHRONO_MAX_SECONDES, secondes as number),
    at: v.at,
  }
}

/** Le stockage du navigateur, décodé — prêt à tout (JSON tronqué, autre version). */
export function parserStockBrouillons(brut: string | null): StockBrouillons {
  if (!brut) return STOCK_VIDE
  try {
    const valeur: unknown = JSON.parse(brut)
    if (!valeur || typeof valeur !== 'object' || Array.isArray(valeur)) return STOCK_VIDE
    const stock: Record<string, BrouillonQuiz> = {}
    for (const brouillon of Object.values(valeur).slice(0, BROUILLONS_MAX * 2)) {
      const b = parserBrouillon(brouillon)
      if (b) stock[b.quizId] = b
    }
    return garderLesPlusRecents(stock)
  } catch {
    return STOCK_VIDE
  }
}

const horodatage = (b: { at: string }) => Date.parse(b.at) || 0

function garderLesPlusRecents(stock: Record<string, BrouillonQuiz>): StockBrouillons {
  const tries = Object.values(stock).sort((a, b) => horodatage(b) - horodatage(a))
  return Object.fromEntries(tries.slice(0, BROUILLONS_MAX).map((b) => [b.quizId, b]))
}

/** Le stock avec ce brouillon posé (ou remplacé) — sans toucher à l'original. */
export function avecBrouillon(stock: StockBrouillons, b: BrouillonQuiz): StockBrouillons {
  return garderLesPlusRecents({ ...stock, [b.quizId]: b })
}

/** Le stock sans la manche de ce quiz. */
export function sansBrouillon(stock: StockBrouillons, quizId: string): StockBrouillons {
  if (!(quizId in stock)) return stock
  return Object.fromEntries(Object.entries(stock).filter(([cle]) => cle !== quizId))
}

/** La manche est-elle encore à reprendre ? (moins d'un jour) */
export function estFrais(b: BrouillonQuiz, maintenant: number): boolean {
  const t = horodatage(b)
  return t > 0 && maintenant - t >= 0 && maintenant - t < BROUILLON_DUREE_MS
}

/** Le plus récent des deux (le local et celui de la base), ou celui qui existe. */
export function plusRecent(
  a: BrouillonQuiz | null,
  b: BrouillonQuiz | null,
): BrouillonQuiz | null {
  if (!a) return b
  if (!b) return a
  return horodatage(b) > horodatage(a) ? b : a
}

/** LA manche à rappeler sur Réviser : la plus récente encore fraîche. */
export function brouillonARappeler(
  stock: StockBrouillons,
  maintenant: number,
): BrouillonQuiz | null {
  let meilleur: BrouillonQuiz | null = null
  for (const b of Object.values(stock)) {
    if (estFrais(b, maintenant)) meilleur = plusRecent(meilleur, b)
  }
  return meilleur
}

/**
 * Le paquet de la manche, reconstruit depuis les questions servies par la
 * page. `null` dès qu'une question manque (le quiz a été corrigé entre-temps) :
 * on ne reprend pas une manche dont les réponses ne tombent plus en face des
 * bonnes questions.
 */
export function reconstruirePaquet<T extends { id: string }>(
  b: BrouillonQuiz,
  questions: readonly T[],
): T[] | null {
  const parId = new Map(questions.map((q) => [q.id, q]))
  const paquet: T[] = []
  for (const id of b.questionIds) {
    const q = parId.get(id)
    if (!q) return null
    paquet.push(q)
  }
  return b.choix.length < paquet.length ? paquet : null
}

/** Le chrono au moment de reprendre (cf. `CHRONO_REPRISE_MIN`). */
export function chronoDeReprise(secondes: number | null): number | null {
  if (secondes === null) return null
  return Math.min(CHRONO_MAX_SECONDES, Math.max(CHRONO_REPRISE_MIN, Math.floor(secondes)))
}

/** Où la carte de Réviser ramène. */
export const hrefReprise = (quizId: string) => `/test/${quizId}`

/** Les questions qui restent à jouer. */
export const questionsRestantes = (b: BrouillonQuiz) => b.questionIds.length - b.choix.length

/** Le brouillon d'une manche en cours, à poser après une réponse validée. */
export function creerBrouillon(input: {
  quizId: string
  titre: string
  matiere: string | null
  subjectSlug: string | null
  questionIds: readonly string[]
  choix: readonly number[]
  secondes: number | null
  maintenant: Date
}): BrouillonQuiz {
  return {
    v: BROUILLON_VERSION,
    quizId: input.quizId,
    titre: input.titre,
    matiere: input.matiere,
    subjectSlug: input.subjectSlug,
    questionIds: [...input.questionIds],
    choix: [...input.choix],
    secondes: input.secondes === null ? null : Math.max(0, Math.floor(input.secondes)),
    at: input.maintenant.toISOString(),
  }
}

// ------------------------------------------------- les manches CLOSES ici

/**
 * Les manches closes sur CET appareil (finie, abandonnée, recommencée) : quiz →
 * heure de clôture. L'effacement en base part quand l'élève quitte l'écran ;
 * s'il n'est pas encore arrivé (ou s'est perdu), la copie de la base ne doit
 * pas ressusciter une manche que l'élève vient de boucler. Une copie plus
 * RÉCENTE que la clôture (jouée depuis sur un autre appareil) reste valable.
 */
export type ManchesCloses = Readonly<Record<string, string>>

export const CLOSES_MAX = 30

const CLOSES_VIDE: ManchesCloses = Object.freeze({})

export function parserCloses(brut: string | null): ManchesCloses {
  if (!brut) return CLOSES_VIDE
  try {
    const valeur: unknown = JSON.parse(brut)
    if (!valeur || typeof valeur !== 'object' || Array.isArray(valeur)) return CLOSES_VIDE
    const propres = Object.entries(valeur).filter(
      (e): e is [string, string] =>
        estTexte(e[0], 64) && estTexte(e[1], 40) && !Number.isNaN(Date.parse(e[1])),
    )
    return garderLesClosesRecentes(Object.fromEntries(propres))
  } catch {
    return CLOSES_VIDE
  }
}

function garderLesClosesRecentes(closes: Record<string, string>): ManchesCloses {
  const tries = Object.entries(closes).sort((a, b) => Date.parse(b[1]) - Date.parse(a[1]))
  return Object.fromEntries(tries.slice(0, CLOSES_MAX))
}

export function avecClose(closes: ManchesCloses, quizId: string, at: Date): ManchesCloses {
  return garderLesClosesRecentes({ ...closes, [quizId]: at.toISOString() })
}

/** La copie de la base vaut-elle encore, vu ce qui a été clos ici ? */
export function copieEncoreValable(b: BrouillonQuiz | null, closes: ManchesCloses): BrouillonQuiz | null {
  if (!b) return null
  const close = closes[b.quizId]
  return close && Date.parse(close) >= horodatage(b) ? null : b
}
