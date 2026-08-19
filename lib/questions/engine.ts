// LE MOTEUR DE SÉLECTION DE QUESTIONS — logique pure, sans React ni Supabase.
//
// Un seul moteur pour tous les quiz de contenu de l'app : quiz de leçon, jeu
// « Programme », duel classé, boss, examen blanc, annales, carnet. Aucune règle
// propre à une matière, un chapitre ou un niveau n'entre ici — le moteur ne
// connaît que des identifiants et des dates. Ce qui distingue « Maths 3e » de
// « Anglais Tle », c'est le VIVIER qu'on lui passe, jamais son code.
//
// POURQUOI IL REMPLACE `lib/srs.ts`. L'ancien module tenait déjà une répétition
// espacée, mais avec une échéance au JOUR (colonne DATE). Une mauvaise réponse
// devait donc revenir « demain » au plus tôt : impossible de rejouer une
// question ratée dix minutes plus tard, dans la même session, alors que c'est
// exactement le moment où la correction est encore fraîche. Le passage à une
// échéance horodatée (migration 239) est la vraie raison d'être de ce fichier ;
// le reste — les buckets, la fenêtre glissante — n'était nulle part.
//
// DEUX MOITIÉS, ET LA FRONTIÈRE EST NETTE :
//   1. le BARÈME (Leitner)  — ce que devient une question après une réponse ;
//   2. le TIRAGE            — quelles questions composent la prochaine session.
// Les deux sont des fonctions pures. La persistance vit dans `server.ts`, le
// cache hors ligne dans `store.ts`, et l'API publique dans `api.ts`.

import { seededRng } from '@/lib/defi-modes'

// ============================================================== 1. LE BARÈME
// Leitner à cinq boîtes. Une boîte = un intervalle ; on monte d'une boîte à
// chaque succès, on retombe à la première à la moindre erreur.

export const MIN_BOX = 1
export const MAX_BOX = 5

/**
 * L'intervalle de chaque boîte, en jours. Table écrite en toutes lettres
 * plutôt que dérivée d'une formule : c'est un réglage pédagogique, fait pour
 * être relu et retouché, pas une astuce d'implémentation (même doctrine que
 * `TROPHY_BANDS` dans lib/trophy-road).
 *
 * Index 0 = boîte 1. La dernière boîte plafonne à 30 jours : au-delà, un item
 * sortirait du trimestre scolaire et l'élève ne le reverrait jamais avant le
 * contrôle.
 */
export const BOX_INTERVAL_DAYS = [1, 3, 7, 14, 30] as const

/**
 * Le délai avant de re-servir une question RATÉE, en minutes. C'est la seule
 * échéance qui se compte en minutes et non en jours, et c'est délibéré : une
 * erreur veut dire que la correction vient d'être lue, donc qu'il faut la
 * remettre à l'épreuve pendant qu'elle est encore là. Assez court pour revenir
 * dans la même session, assez long pour ne pas être une simple recopie.
 */
export const WRONG_RETRY_MINUTES = 10

const MINUTE_MS = 60_000
const DAY_MS = 24 * 60 * MINUTE_MS

/** Ce qui identifie une question et son périmètre. Immuable. */
export type QuestionRef = {
  questionId: string
  chapterId: string | null
  subjectId: string | null
  level: string | null
}

/** L'état d'une question POUR UN ÉLÈVE. Les dates sont en ms epoch (UTC). */
export type QuestionState = QuestionRef & {
  /** Dernier passage, ou null si jamais servie. */
  lastSeenAt: number | null
  timesSeen: number
  timesCorrect: number
  timesWrong: number
  /** Succès d'affilée — ne plafonne pas, contrairement à `box`. */
  consecutiveCorrect: number
  /** Niveau de Leitner, 1..5. */
  box: number
  /** Prochaine échéance. */
  dueAt: number
}

function clampBox(box: number): number {
  return Math.max(MIN_BOX, Math.min(MAX_BOX, Math.floor(box)))
}

/** L'intervalle d'une boîte, en jours. Hors bornes : on ramène dans l'échelle. */
export function intervalDaysForBox(box: number): number {
  return BOX_INTERVAL_DAYS[clampBox(box) - 1]
}

/** L'état d'une question jamais rencontrée : due tout de suite, boîte 1. */
export function initialState(ref: QuestionRef, now: number): QuestionState {
  return {
    ...ref,
    lastSeenAt: null,
    timesSeen: 0,
    timesCorrect: 0,
    timesWrong: 0,
    consecutiveCorrect: 0,
    box: MIN_BOX,
    dueAt: now,
  }
}

/**
 * L'état d'une question après une réponse. `prev` absent = premier passage.
 *
 * LA GARDE ANTI-BACHOTAGE. Un succès ne fait monter la boîte que si la question
 * était RÉELLEMENT à revoir (échue, ou jamais vue). Sans elle, le système est
 * farmable en un après-midi : le même quiz de leçon rejoué trois fois d'affilée
 * pousserait chaque question de la boîte 1 à la boîte 4, et l'app annoncerait
 * « revu dans 14 jours » sur des questions apprises il y a dix minutes. Ce ne
 * serait plus de la répétition ESPACÉE, juste du bachotage compté comme tel.
 *
 * La garde vient de l'ancien `lib/srs.ts`, mais elle ne fait plus perdre le
 * passage : le compteur avance, la fraîcheur aussi (ce qui pèsera sur le tirage
 * suivant), seule l'ÉCHÉANCE reste où elle était. L'ancienne version rendait
 * l'état précédent tel quel, donc oubliait purement et simplement que l'élève
 * avait répondu.
 *
 * Un échec, lui, compte TOUJOURS : oublier est une information, quelle que soit
 * l'échéance prévue.
 */
export function applyAnswer(
  prev: QuestionState | null,
  ref: QuestionRef,
  isCorrect: boolean,
  now: number,
): QuestionState {
  const base = prev ?? initialState(ref, now)

  if (isCorrect) {
    const merite = isUnseen(prev) || isDue(prev, now)
    const box = merite ? clampBox(base.box + 1) : base.box
    return {
      ...base,
      // Le périmètre suit la question, pas l'historique : un chapitre
      // renuméroté doit se propager au prochain passage.
      ...ref,
      lastSeenAt: now,
      timesSeen: base.timesSeen + 1,
      timesCorrect: base.timesCorrect + 1,
      consecutiveCorrect: base.consecutiveCorrect + 1,
      box,
      dueAt: merite ? now + intervalDaysForBox(box) * DAY_MS : base.dueAt,
    }
  }

  return {
    ...base,
    ...ref,
    lastSeenAt: now,
    timesSeen: base.timesSeen + 1,
    timesWrong: base.timesWrong + 1,
    consecutiveCorrect: 0,
    box: MIN_BOX,
    dueAt: now + WRONG_RETRY_MINUTES * MINUTE_MS,
  }
}

/** Une question jamais servie (aucun état, ou un état sans passage). */
export function isUnseen(state: QuestionState | undefined | null): boolean {
  return !state || state.timesSeen === 0
}

/** Une question échue : son échéance est passée. */
export function isDue(state: QuestionState | undefined | null, now: number): boolean {
  return !state || state.dueAt <= now
}

// ============================================================== 2. LE TIRAGE
// Trois viviers, dans cet ordre de priorité :
//
//   A · les ÉCHUES     jusqu'à 60 % de la session — c'est la dette de mémoire,
//                      elle passe avant tout le reste
//   B · les INÉDITES   jusqu'à 30 % — le programme avance, sinon l'élève
//                      tournerait à vie sur les mêmes questions
//   C · les FRAÎCHES   le reste — du liant, tiré au sort pondéré par l'ancienneté
//
// Une session n'est donc jamais une pure révision ni une pure découverte : la
// répartition 60/30/10 est ce qui rend l'exercice à la fois utile et vivant.

export const BUCKET_SHARES = { due: 0.6, unseen: 0.3 } as const

/**
 * Taille de la fenêtre glissante par chapitre : les N derniers `questionId`
 * servis, exclus du bucket C.
 *
 * 20 et pas 5 : une session fait typiquement 10 questions, donc une fenêtre
 * courte laisserait la session N+1 repiocher dans la session N sous couvert
 * d'aléatoire — exactement la sensation de « ça tourne en rond » qu'on répare.
 * Deux sessions de mémoire, c'est le minimum pour que le hasard se voie.
 */
export const RECENT_WINDOW = 20

export type DrawInput = {
  /** Le vivier candidat. L'ordre sert de départage : il doit être stable. */
  pool: readonly QuestionRef[]
  /** L'état connu de l'élève, indexé par questionId. Peut être partiel. */
  states: ReadonlyMap<string, QuestionState>
  /** Nombre de questions demandées. */
  count: number
  now: number
  /** Les derniers questionId servis sur ce périmètre (fenêtre glissante). */
  recent?: readonly string[]
  /** Les questionId servis à la session précédente sur ce périmètre. */
  lastSession?: readonly string[]
  /** Graine du tirage : même graine → même session (tests, SSR). */
  seed: string
}

/**
 * Les places de chaque bucket. Arrondi et non troncature : sur une session de
 * 3 questions, `Math.floor(3 × 0.3)` vaut 0 et le bucket des inédites
 * disparaîtrait — un élève qui débute ne verrait jamais de nouvelle question.
 * Le reste va au bucket C, qui est par construction celui qu'on peut sacrifier.
 */
export function bucketQuotas(count: number): { a: number; b: number; c: number } {
  const n = Math.max(0, Math.floor(count))
  const a = Math.min(n, Math.round(n * BUCKET_SHARES.due))
  const b = Math.min(n - a, Math.round(n * BUCKET_SHARES.unseen))
  return { a, b, c: n - a - b }
}

/** Mélange de Fisher-Yates déterministe (même graine → même ordre). */
function shuffle<T>(items: readonly T[], seed: string): T[] {
  const out = [...items]
  const rng = seededRng(seed)
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    const tmp = out[i]
    out[i] = out[j]
    out[j] = tmp
  }
  return out
}

/**
 * Poids d'une question fraîche : son ancienneté en jours, plancher à 1.
 *
 * Le plancher compte : sans lui, une question vue il y a une heure aurait un
 * poids de 0,04 et serait de fait exclue — or le bucket C est justement le
 * bucket du hasard. On veut qu'une question ancienne sorte PLUS SOUVENT, pas
 * qu'une question récente soit interdite (c'est le rôle de la fenêtre
 * glissante, qui, elle, exclut pour de bon).
 */
export function freshnessWeight(state: QuestionState | undefined, now: number): number {
  const seen = state?.lastSeenAt
  if (seen == null) return 1
  return Math.max(1, (now - seen) / DAY_MS)
}

/** Tirage sans remise, pondéré. Consomme `rng` une fois par élément tiré. */
function weightedTake(
  candidates: readonly QuestionRef[],
  weights: readonly number[],
  howMany: number,
  rng: () => number,
): QuestionRef[] {
  const pool = [...candidates]
  const w = [...weights]
  const picked: QuestionRef[] = []

  while (picked.length < howMany && pool.length > 0) {
    const total = w.reduce((sum, x) => sum + x, 0)
    // Poids tous nuls (ne devrait pas arriver, le plancher vaut 1) : on
    // retombe sur le premier plutôt que de boucler sans fin.
    let target = total > 0 ? rng() * total : 0
    let index = 0
    for (; index < pool.length - 1; index++) {
      target -= w[index]
      if (target <= 0) break
    }
    picked.push(pool[index])
    pool.splice(index, 1)
    w.splice(index, 1)
  }

  return picked
}

/**
 * Compose une session de `count` questions et rend leurs identifiants, dans
 * l'ordre où il faut les poser (déjà mélangé : le joueur ne doit pas sentir
 * les buckets — sinon il apprend que « les trois dernières sont les nouvelles »
 * et cesse de lire les premières).
 */
export function drawSession(input: DrawInput): string[] {
  const { states, now, seed } = input
  const count = Math.max(0, Math.floor(input.count))
  if (count === 0) return []

  // Dédoublonnage du vivier : la garantie « jamais deux fois la même question
  // dans une session » commence ici. Un vivier qui contient un doublon (deux
  // quiz d'un chapitre partageant une question) le ferait sortir deux fois
  // sans que le tirage ait rien fait de mal.
  const seen = new Set<string>()
  const pool: QuestionRef[] = []
  for (const ref of input.pool) {
    if (seen.has(ref.questionId)) continue
    seen.add(ref.questionId)
    pool.push(ref)
  }
  if (pool.length === 0) return []

  // Ce qui ne peut PAS ressortir par hasard : la fenêtre glissante et la
  // session précédente. Les deux ne bloquent que le bucket C — une question
  // ÉCHUE repasse toujours, c'est la promesse de la répétition espacée.
  const blocked = new Set([...(input.recent ?? []), ...(input.lastSession ?? [])])

  const bucketA: QuestionRef[] = []
  const bucketB: QuestionRef[] = []
  const bucketC: QuestionRef[] = []

  for (const ref of pool) {
    const state = states.get(ref.questionId)
    if (isUnseen(state)) {
      bucketB.push(ref)
    } else if (isDue(state, now)) {
      bucketA.push(ref)
    } else if (!blocked.has(ref.questionId)) {
      bucketC.push(ref)
    }
  }

  // A · les plus en retard d'abord. Départage par identifiant pour que deux
  // questions échues à la même milliseconde sortent toujours dans le même
  // ordre (deux rendus successifs doivent donner la même session).
  bucketA.sort((x, y) => {
    const dx = states.get(x.questionId)?.dueAt ?? 0
    const dy = states.get(y.questionId)?.dueAt ?? 0
    return dx !== dy ? dx - dy : x.questionId.localeCompare(y.questionId)
  })

  // B · mélangées : sans ça, l'élève recevrait toujours les inédites dans
  // l'ordre du chapitre et ne verrait jamais la fin d'un long quiz.
  const shuffledB = shuffle(bucketB, `${seed}:unseen`)

  // C · tirage pondéré par l'ancienneté.
  const rng = seededRng(`${seed}:fresh`)
  const orderedC = weightedTake(
    bucketC,
    bucketC.map((ref) => freshnessWeight(states.get(ref.questionId), now)),
    bucketC.length,
    rng,
  )

  const quotas = bucketQuotas(count)
  const buckets = [
    { items: bucketA, quota: quotas.a, taken: 0 },
    { items: shuffledB, quota: quotas.b, taken: 0 },
    { items: orderedC, quota: quotas.c, taken: 0 },
  ]

  const chosen: string[] = []
  const used = new Set<string>()
  const take = (bucket: (typeof buckets)[number], howMany: number) => {
    while (bucket.taken < bucket.items.length && howMany > 0) {
      const ref = bucket.items[bucket.taken++]
      if (used.has(ref.questionId)) continue
      used.add(ref.questionId)
      chosen.push(ref.questionId)
      howMany--
    }
  }

  for (const bucket of buckets) take(bucket, bucket.quota)

  // REDISTRIBUTION. Un bucket vide (aucune échue, aucune inédite) rend ses
  // places aux autres, dans l'ordre de priorité. On boucle tant qu'un tour
  // complet apporte quelque chose : une seule passe ne suffirait pas quand
  // deux buckets sur trois sont vides.
  let progress = true
  while (chosen.length < count && progress) {
    progress = false
    for (const bucket of buckets) {
      if (chosen.length >= count) break
      const before = chosen.length
      take(bucket, count - chosen.length)
      if (chosen.length > before) progress = true
    }
  }

  // VIVIER PLUS PETIT QUE LA SESSION. On autorise la réutilisation — mieux vaut
  // reposer une question que servir une session tronquée — mais dans l'ordre de
  // la fraîcheur : les plus anciennes d'abord, comme une file d'attente.
  if (chosen.length < count) {
    const byStaleness = [...pool].sort((x, y) => {
      const sx = states.get(x.questionId)?.lastSeenAt ?? -Infinity
      const sy = states.get(y.questionId)?.lastSeenAt ?? -Infinity
      return sx !== sy ? sx - sy : x.questionId.localeCompare(y.questionId)
    })
    let i = 0
    while (chosen.length < count) {
      chosen.push(byStaleness[i % byStaleness.length].questionId)
      i++
    }
  }

  return shuffle(chosen, `${seed}:order`)
}

// ------------------------------------------------------- la fenêtre glissante

/**
 * La fenêtre glissante après avoir servi `served` : les plus récents en tête,
 * bornée à `RECENT_WINDOW`. Dédoublonnée — une question re-servie remonte en
 * tête plutôt que d'occuper deux places et de raccourcir la mémoire réelle.
 */
export function pushRecent(
  recent: readonly string[],
  served: readonly string[],
  limit: number = RECENT_WINDOW,
): string[] {
  const out: string[] = []
  const seen = new Set<string>()
  for (const id of [...served, ...recent]) {
    if (seen.has(id)) continue
    seen.add(id)
    out.push(id)
    if (out.length >= limit) break
  }
  return out
}

// ============================================================ 3. LA MAÎTRISE
// Ce que le moteur sait dire d'un chapitre, et que rien d'autre ne savait :
// la maîtrise mesurée QUESTION PAR QUESTION, et non au dernier score de quiz.

export type ChapterMastery = {
  /** 0..100 — part du chapitre réellement ancrée. */
  pct: number
  /** Questions échues : la dette à rattraper. */
  dueCount: number
  /** Questions jamais vues : ce qui reste à découvrir. */
  unseenCount: number
}

/**
 * La maîtrise d'un vivier. Chaque question vaut sa progression dans l'échelle
 * de Leitner : boîte 1 = 0, boîte 5 = 1. Une question jamais vue vaut 0 et
 * compte quand même au dénominateur — sans quoi un élève ayant répondu juste à
 * UNE question sur cinquante afficherait 100 % de maîtrise.
 *
 * Une question ÉCHUE ne perd rien : elle est due, pas oubliée. C'est
 * `dueCount` qui porte cette information, et l'UI décide quoi en dire.
 */
export function chapterMastery(
  pool: readonly QuestionRef[],
  states: ReadonlyMap<string, QuestionState>,
  now: number,
): ChapterMastery {
  const ids = new Set(pool.map((ref) => ref.questionId))
  if (ids.size === 0) return { pct: 0, dueCount: 0, unseenCount: 0 }

  let score = 0
  let dueCount = 0
  let unseenCount = 0

  for (const id of ids) {
    const state = states.get(id)
    if (isUnseen(state)) {
      unseenCount++
      continue
    }
    // `state` est défini ici : isUnseen couvre null/undefined.
    score += (clampBox(state!.box) - MIN_BOX) / (MAX_BOX - MIN_BOX)
    if (isDue(state, now)) dueCount++
  }

  return {
    pct: Math.round((score / ids.size) * 100),
    dueCount,
    unseenCount,
  }
}
