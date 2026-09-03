// L'API PUBLIQUE DU MOTEUR — les trois gestes que connaissent les players.
//
//   getSessionQuestions({ userId, chapterId, count })  → les questions à poser
//   recordAnswer({ userId, questionId, isCorrect })    → une réponse encaissée
//   getChapterMastery({ userId, chapterId })           → où en est le chapitre
//
// Elle s'exécute CÔTÉ NAVIGATEUR, et c'est ce qui la rend utilisable hors
// ligne : la lecture passe par le cache local quand le réseau manque, les
// réponses s'empilent dans une file, et tout remonte en une écriture à la fin
// de la session (`flushAnswers`). Le serveur reste la source de vérité — le
// local n'est qu'une avance de trésorerie.
//
// AUCUN player ne doit importer `engine.ts` ou `server.ts` directement : c'est
// ici, et seulement ici, qu'on décide de l'ordre lecture-cache / lecture-réseau.
// Sinon la règle « une session = une écriture » se perdrait au premier appelant
// pressé.

import { createClient } from '@/lib/supabase/client'
import {
  applyAnswer,
  chapterMastery,
  drawSession,
  type ChapterMastery,
  type QuestionRef,
  type QuestionState,
} from './engine'
import {
  cacheStates,
  clearPending,
  lastSessionFor,
  localStates,
  pendingAnswers,
  queueAnswer,
  recentFor,
  recordServed,
  type PendingAnswer,
} from './store'
import {
  loadChapterPool,
  loadQuestionStates,
  loadSubjectPool,
  saveQuestionStates,
} from './server'

type Client = ReturnType<typeof createClient>

/** Le client Supabase du navigateur, sauf si l'appelant en fournit un. */
function clientOf(supabase?: Client): Client {
  return supabase ?? createClient()
}

/**
 * La clé de périmètre — ce sur quoi portent la fenêtre glissante et la
 * « session précédente ». Un chapitre et une matière ont chacun la leur : une
 * session de duel classé en maths ne doit pas assécher le tirage du chapitre
 * que l'élève révise juste après.
 */
function scopeKey(kind: 'chapter' | 'subject', id: string): string {
  return `${kind}:${id}`
}

/** La graine du tirage. Change à chaque session : deux sessions ≠ deux fois la même. */
function sessionSeed(scope: string, now: number): string {
  return `${scope}#${now}`
}

// ------------------------------------------------------------------- le tirage

export type SessionRequest = {
  userId: string
  chapterId: string
  count: number
  /** Client Supabase à réutiliser (évite d'en recréer un par appel). */
  supabase?: Client
  /** Horloge injectable — les tests et le rendu SSR en ont besoin. */
  now?: number
}

/**
 * Les questions de la prochaine session sur un chapitre, dans l'ordre où les
 * poser. Rend les identifiants : le player va déjà chercher les énoncés (il
 * gère son propre gating premium sur `quiz_questions`), et les lui refaire
 * charger ici doublerait la requête.
 */
export async function getSessionQuestions({
  userId,
  chapterId,
  count,
  supabase,
  now = Date.now(),
}: SessionRequest): Promise<string[]> {
  const client = clientOf(supabase)
  const scope = scopeKey('chapter', chapterId)
  const pool = await loadChapterPool(client, chapterId)
  return draw({ userId, scope, pool, count, client, now })
}

export type SubjectSessionRequest = {
  userId: string
  subjectId: string
  level: string
  count: number
  supabase?: Client
  now?: number
}

/**
 * La même chose à l'échelle d'une MATIÈRE — ce que consomme le duel classé,
 * qui oppose deux élèves sur une matière et non sur un chapitre. Le tirage est
 * strictement le même : un seul moteur, deux viviers.
 */
export async function getSubjectSessionQuestions({
  userId,
  subjectId,
  level,
  count,
  supabase,
  now = Date.now(),
}: SubjectSessionRequest): Promise<string[]> {
  const client = clientOf(supabase)
  const scope = scopeKey('subject', subjectId)
  const pool = await loadSubjectPool(client, subjectId, level)
  return draw({ userId, scope, pool, count, client, now })
}

async function draw({
  userId,
  scope,
  pool,
  count,
  client,
  now,
}: {
  userId: string
  scope: string
  pool: QuestionRef[]
  count: number
  client: Client
  now: number
}): Promise<string[]> {
  if (pool.length === 0) return []

  // État serveur d'abord, cache local en repli. Les deux sont fusionnés et non
  // choisis l'un OU l'autre : le local peut porter des réponses pas encore
  // poussées (mode avion), et elles doivent peser sur ce tirage-ci.
  const remote = await loadQuestionStates(
    client,
    userId,
    pool.map((ref) => ref.questionId),
  )
  if (remote.size > 0) cacheStates(userId, [...remote.values()])

  const local = localStates(userId)
  const states = new Map<string, QuestionState>(remote)
  for (const [id, s] of local) {
    const known = states.get(id)
    // Le plus RÉCENT gagne : une réponse encore en file d'attente est
    // forcément postérieure à ce que le serveur connaît.
    if (!known || (s.lastSeenAt ?? 0) > (known.lastSeenAt ?? 0)) states.set(id, s)
  }

  const served = drawSession({
    pool,
    states,
    count,
    now,
    recent: recentFor(userId, scope),
    lastSession: lastSessionFor(userId, scope),
    seed: sessionSeed(scope, now),
  })

  recordServed(userId, scope, served)
  return served
}

// ---------------------------------------------------------------- les réponses

export type AnswerRecord = {
  userId: string
  questionId: string
  isCorrect: boolean
  /** Périmètre de la question, si l'appelant le connaît (il l'a au tirage). */
  ref?: Partial<Omit<QuestionRef, 'questionId'>>
  now?: number
}

/**
 * Encaisse une réponse. Ne touche PAS au réseau : l'état local avance tout de
 * suite (le tirage suivant en tiendra compte, même en mode avion) et la réponse
 * part dans la file. C'est `flushAnswers` qui synchronise.
 *
 * Renvoie `void` comme le prévoit le contrat : un player n'a rien à attendre
 * d'une réponse enregistrée, et lui rendre une promesse à surveiller
 * l'inciterait à bloquer son écran de correction sur une écriture réseau.
 */
export function recordAnswer({
  userId,
  questionId,
  isCorrect,
  ref,
  now = Date.now(),
}: AnswerRecord): void {
  const known = localStates(userId).get(questionId) ?? null
  const identity: QuestionRef = {
    questionId,
    chapterId: ref?.chapterId ?? known?.chapterId ?? null,
    subjectId: ref?.subjectId ?? known?.subjectId ?? null,
    level: ref?.level ?? known?.level ?? null,
  }

  const next = applyAnswer(known, identity, isCorrect, now)
  const pending: PendingAnswer = { ...identity, isCorrect, answeredAt: now }
  queueAnswer(userId, pending, next)
}

/**
 * Pousse la file d'attente au serveur. À appeler en FIN DE SESSION, et au
 * retour en ligne.
 *
 * On envoie les ÉTATS calculés et non les réponses brutes : le barème a déjà
 * tourné en local (c'est ce qui rend le hors ligne honnête), et le rejouer côté
 * serveur ferait exister la courbe de Leitner à deux endroits. La file sert de
 * journal, pas de recalcul.
 */
export async function flushAnswers(
  userId: string,
  supabase?: Client,
): Promise<boolean> {
  const pending = pendingAnswers(userId)
  if (pending.length === 0) return true

  const states = localStates(userId)
  // Un seul état par question, même si elle a été répondue plusieurs fois :
  // l'état local porte déjà le cumul.
  const touched = [...new Set(pending.map((a) => a.questionId))]
    .map((id) => states.get(id))
    .filter((s): s is QuestionState => Boolean(s))

  const ok = await saveQuestionStates(clientOf(supabase), userId, touched)
  // La file n'est purgée QUE sur confirmation : un échec réseau garde tout, et
  // le prochain appel réessaiera. Sans cette garde, une coupure au mauvais
  // moment effacerait une session entière de travail.
  if (ok) clearPending(userId, pending)
  return ok
}

// ---------------------------------------------------------------- la maîtrise

export type MasteryRequest = {
  userId: string
  chapterId: string
  supabase?: Client
  now?: number
}

/**
 * Où en est un chapitre, vu par le moteur : part réellement ancrée, dette à
 * rattraper, reste à découvrir.
 *
 * À NE PAS CONFONDRE avec `getChapterMastery` de `lib/mastery-server.ts`, qui mesure
 * autre chose : le meilleur SCORE DE QUIZ du chapitre. Les deux coexistent
 * volontairement — l'un dit « ce que l'élève a réussi une fois », l'autre « ce
 * qu'il retient encore ». Les couronnes de Réviser continuent de lire le
 * premier ; c'est le moteur qui lit le second.
 */
export async function getChapterMastery({
  userId,
  chapterId,
  supabase,
  now = Date.now(),
}: MasteryRequest): Promise<ChapterMastery> {
  const client = clientOf(supabase)
  const pool = await loadChapterPool(client, chapterId)
  if (pool.length === 0) return { pct: 0, dueCount: 0, unseenCount: 0 }

  const remote = await loadQuestionStates(
    client,
    userId,
    pool.map((ref) => ref.questionId),
  )
  const local = localStates(userId)
  const states = new Map<string, QuestionState>(remote)
  for (const [id, s] of local) {
    const known = states.get(id)
    if (!known || (s.lastSeenAt ?? 0) > (known.lastSeenAt ?? 0)) states.set(id, s)
  }

  return chapterMastery(pool, states, now)
}
