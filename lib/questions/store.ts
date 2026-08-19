// LE CACHE LOCAL DU MOTEUR — instantané hors ligne + file d'attente.
//
// Le serveur reste la SOURCE DE VÉRITÉ : `review_items` porte l'état réel, et
// tout ce qui vit ici finit par y être poussé. Ce module ne fait que deux
// choses, et il faut qu'il ne fasse que celles-là :
//
//   1. garder sous la main l'état des questions déjà chargées, pour qu'une
//      session commencée survive à une coupure réseau (métro, cour de récré,
//      4G qui tombe) ;
//   2. encaisser les réponses au fil de l'eau et les rendre en UN SEUL LOT à
//      la fin de la session.
//
// POURQUOI UN SEUL LOT. Une session de 10 questions produirait 10 écritures,
// donc 10 allers-retours dans les 10 minutes où l'élève joue — c'est
// exactement le profil de charge que la passe « vagues Supabase » a mis des
// jours à éliminer ailleurs. Une session = une écriture.
//
// La fenêtre glissante et la session précédente vivent ici et NULLE PART
// AILLEURS. C'est un choix : ce sont des données de confort (« ne me repose pas
// la même question »), pas des données de progression. Les stocker en base
// aurait coûté une table et une écriture par session pour une information qu'on
// peut perdre sans conséquence — un changement d'appareil remet simplement le
// hasard à zéro.

import {
  pushRecent,
  RECENT_WINDOW,
  type QuestionRef,
  type QuestionState,
} from './engine'

const STORAGE_PREFIX = 'studuel.questions.v1'

/** Une réponse en attente de synchronisation. */
export type PendingAnswer = QuestionRef & {
  isCorrect: boolean
  /** Horodatage de la réponse — c'est LUI qui fait foi au moment du calcul. */
  answeredAt: number
}

export type QuestionSnapshot = {
  /** Version du format : un instantané d'une autre version est jeté, pas migré. */
  v: 1
  /** État connu des questions, indexé par questionId. */
  states: Record<string, QuestionState>
  /** Fenêtre glissante des derniers servis, par périmètre (chapitre ou matière). */
  recent: Record<string, string[]>
  /** Questions servies à la session précédente, par périmètre. */
  lastSession: Record<string, string[]>
  /** Réponses pas encore poussées au serveur. */
  pending: PendingAnswer[]
}

const VIDE: QuestionSnapshot = {
  v: 1,
  states: {},
  recent: {},
  lastSession: {},
  pending: [],
}

/**
 * Plafond de la file d'attente. Un élève hors ligne trois jours ne doit pas
 * faire grossir le stockage sans fin — et au-delà de quelques centaines de
 * réponses, les plus anciennes ne changent plus rien à la boîte de Leitner
 * (elles seront écrasées par les plus récentes sur les mêmes questions).
 */
export const MAX_PENDING = 400

/**
 * Plafond des états gardés en local. Assez pour plusieurs matières entières,
 * assez peu pour ne pas approcher la limite de localStorage (~5 Mo).
 */
export const MAX_CACHED_STATES = 2000

function key(userId: string): string {
  return `${STORAGE_PREFIX}.${userId}`
}

/** Le stockage du navigateur, ou null côté serveur / si l'accès est refusé. */
function storage(): Storage | null {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage
  } catch {
    // Navigation privée verrouillée, cookies tiers bloqués : on continue sans
    // cache. Le moteur reste utilisable, il perd juste sa mémoire hors ligne.
    return null
  }
}

/** L'instantané de cet élève. Toujours une forme valide, jamais une exception. */
export function readSnapshot(userId: string): QuestionSnapshot {
  const store = storage()
  if (!store) return { ...VIDE }

  try {
    const raw = store.getItem(key(userId))
    if (!raw) return { ...VIDE }
    const parsed = JSON.parse(raw) as Partial<QuestionSnapshot>
    // Version inconnue : on repart de zéro. Le serveur a la vérité, un
    // instantané périmé n'a rien d'irremplaçable.
    if (parsed?.v !== 1) return { ...VIDE }
    return {
      v: 1,
      states: parsed.states ?? {},
      recent: parsed.recent ?? {},
      lastSession: parsed.lastSession ?? {},
      pending: Array.isArray(parsed.pending) ? parsed.pending : [],
    }
  } catch {
    return { ...VIDE }
  }
}

export function writeSnapshot(userId: string, snapshot: QuestionSnapshot): void {
  const store = storage()
  if (!store) return
  try {
    store.setItem(key(userId), JSON.stringify(snapshot))
  } catch {
    // Quota dépassé : on vide et on réessaie une fois avec le strict minimum
    // (la file d'attente, seule donnée qu'on ne peut pas reconstituer).
    try {
      store.removeItem(key(userId))
      store.setItem(
        key(userId),
        JSON.stringify({ ...VIDE, pending: snapshot.pending }),
      )
    } catch {
      // Rien à faire de plus : la session continue, sans cache.
    }
  }
}

function mutate(
  userId: string,
  change: (snapshot: QuestionSnapshot) => QuestionSnapshot,
): QuestionSnapshot {
  const next = change(readSnapshot(userId))
  writeSnapshot(userId, next)
  return next
}

// ------------------------------------------------------------------- les états

/** Fusionne des états venus du serveur dans le cache local. */
export function cacheStates(
  userId: string,
  states: readonly QuestionState[],
): void {
  if (states.length === 0) return
  mutate(userId, (snapshot) => {
    const merged = { ...snapshot.states }
    for (const s of states) merged[s.questionId] = s
    return { ...snapshot, states: trimStates(merged) }
  })
}

/**
 * Borne le cache d'états. On garde les plus RÉCEMMENT VUS : ce sont ceux qu'une
 * session hors ligne a le plus de chances de réinterroger.
 */
function trimStates(
  states: Record<string, QuestionState>,
): Record<string, QuestionState> {
  const entries = Object.entries(states)
  if (entries.length <= MAX_CACHED_STATES) return states
  entries.sort((a, b) => (b[1].lastSeenAt ?? 0) - (a[1].lastSeenAt ?? 0))
  return Object.fromEntries(entries.slice(0, MAX_CACHED_STATES))
}

/** Les états connus localement, sous la forme attendue par le tirage. */
export function localStates(userId: string): Map<string, QuestionState> {
  return new Map(Object.entries(readSnapshot(userId).states))
}

// --------------------------------------------------------------- les sessions

/**
 * Enregistre ce qui vient d'être servi sur un périmètre : la fenêtre glissante
 * avance, et la « session précédente » devient celle-ci.
 */
export function recordServed(
  userId: string,
  scope: string,
  served: readonly string[],
): void {
  if (served.length === 0) return
  mutate(userId, (snapshot) => ({
    ...snapshot,
    recent: {
      ...snapshot.recent,
      [scope]: pushRecent(snapshot.recent[scope] ?? [], served, RECENT_WINDOW),
    },
    lastSession: { ...snapshot.lastSession, [scope]: [...served] },
  }))
}

export function recentFor(userId: string, scope: string): string[] {
  return readSnapshot(userId).recent[scope] ?? []
}

export function lastSessionFor(userId: string, scope: string): string[] {
  return readSnapshot(userId).lastSession[scope] ?? []
}

// ------------------------------------------------------------ la file d'attente

/**
 * Encaisse une réponse : la file grossit, et l'état local est mis à jour tout
 * de suite pour que le tirage suivant en tienne compte MÊME hors ligne.
 *
 * `applyAnswer` est repassé par l'appelant plutôt qu'importé ici : le store ne
 * doit connaître aucune règle de barème, sinon la courbe de Leitner existerait
 * à deux endroits — la faute exacte que la migration 238 documente sur les
 * trophées.
 */
export function queueAnswer(
  userId: string,
  answer: PendingAnswer,
  nextState: QuestionState,
): void {
  mutate(userId, (snapshot) => ({
    ...snapshot,
    states: { ...snapshot.states, [answer.questionId]: nextState },
    pending: [...snapshot.pending, answer].slice(-MAX_PENDING),
  }))
}

/** Les réponses en attente, sans les retirer (la purge suit la confirmation). */
export function pendingAnswers(userId: string): PendingAnswer[] {
  return readSnapshot(userId).pending
}

/**
 * Retire de la file les réponses effectivement poussées. On compare sur
 * (questionId, answeredAt) et non sur la position : entre la lecture et la
 * confirmation, l'élève a pu répondre à d'autres questions, et une purge « les
 * N premières » les jetterait sans les avoir enregistrées.
 */
export function clearPending(
  userId: string,
  flushed: readonly PendingAnswer[],
): void {
  if (flushed.length === 0) return
  const jetons = new Set(flushed.map((a) => `${a.questionId}@${a.answeredAt}`))
  mutate(userId, (snapshot) => ({
    ...snapshot,
    pending: snapshot.pending.filter(
      (a) => !jetons.has(`${a.questionId}@${a.answeredAt}`),
    ),
  }))
}

/** Efface tout le cache d'un élève (déconnexion, changement de compte). */
export function clearSnapshot(userId: string): void {
  const store = storage()
  if (!store) return
  try {
    store.removeItem(key(userId))
  } catch {
    // Sans stockage, il n'y a rien à effacer.
  }
}
