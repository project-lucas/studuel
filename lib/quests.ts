// -----------------------------------------------------------------------------
// « Quêtes du jour » — trois objectifs courts, renouvelés chaque jour à minuit.
//
// Pourquoi trois, et pourquoi courts : la quête quotidienne est le rendez-vous.
// Elle répond à « qu'est-ce que je fais maintenant ? » en moins d'une seconde,
// et elle se termine en une session — une quête qu'on ne peut pas finir
// aujourd'hui ne ramène personne demain. Toutes sont atteignables en ~10 min.
//
// Le tirage est DÉTERMINISTE (clé du jour + identité de l'élève) : le serveur
// et le client voient les mêmes trois quêtes sans les stocker, et deux élèves
// n'ont pas forcément les mêmes. Seule la PROGRESSION est en base (205).
//
// Pur et testable (convention projet).
// -----------------------------------------------------------------------------

import { seededRng } from '@/lib/defi-modes'

// --- Catalogue -------------------------------------------------------------------

/** Ce qu'une quête compte. Chaque type est incrémenté depuis UN endroit du
 *  code : ajouter un type sans brancher son compteur = quête infinissable. */
export type QuestKind =
  | 'duel_play' // duels de 90 s joués
  | 'duel_win' // duels gagnés
  | 'correct' // bonnes réponses cumulées (tous modes)
  | 'combo' // atteindre une série de N bonnes réponses
  | 'session_prepa' // sessions du plan de préparation terminées
  | 'revision' // cartes révisées (file « À revoir »)
  | 'chapter' // chapitres différents travaillés

export type QuestDef = {
  id: string
  kind: QuestKind
  goal: number
  /** Libellé à l'infinitif, court. Il tient sur une ligne de téléphone. */
  label: string
  xp: number
  gems: number
  /** Difficulté : on tire toujours une facile, une moyenne, une exigeante —
   *  une journée sans victoire facile décourage, une journée sans défi ennuie. */
  tier: 'facile' | 'moyenne' | 'exigeante'
}

export const QUEST_CATALOG: readonly QuestDef[] = [
  // --- faciles : bouclées en une session, toujours atteignables -------------
  { id: 'duel1', kind: 'duel_play', goal: 1, label: 'Jouer 1 duel de 90 s', xp: 30, gems: 3, tier: 'facile' },
  { id: 'correct10', kind: 'correct', goal: 10, label: 'Trouver 10 bonnes réponses', xp: 30, gems: 3, tier: 'facile' },
  { id: 'revision5', kind: 'revision', goal: 5, label: 'Réviser 5 cartes', xp: 30, gems: 3, tier: 'facile' },
  { id: 'combo3', kind: 'combo', goal: 3, label: 'Enchaîner 3 bonnes réponses', xp: 30, gems: 3, tier: 'facile' },

  // --- moyennes : deux ou trois duels, ou une vraie session ------------------
  { id: 'duel3', kind: 'duel_play', goal: 3, label: 'Jouer 3 duels', xp: 60, gems: 6, tier: 'moyenne' },
  { id: 'win1', kind: 'duel_win', goal: 1, label: 'Gagner 1 duel', xp: 60, gems: 6, tier: 'moyenne' },
  { id: 'correct25', kind: 'correct', goal: 25, label: 'Trouver 25 bonnes réponses', xp: 60, gems: 6, tier: 'moyenne' },
  { id: 'prepa1', kind: 'session_prepa', goal: 1, label: 'Faire 1 session de préparation', xp: 60, gems: 6, tier: 'moyenne' },
  { id: 'revision15', kind: 'revision', goal: 15, label: 'Réviser 15 cartes', xp: 60, gems: 6, tier: 'moyenne' },

  // --- exigeantes : le petit défi du jour, jamais indispensable --------------
  { id: 'win3', kind: 'duel_win', goal: 3, label: 'Gagner 3 duels', xp: 120, gems: 12, tier: 'exigeante' },
  { id: 'combo8', kind: 'combo', goal: 8, label: 'Enchaîner 8 bonnes réponses', xp: 120, gems: 12, tier: 'exigeante' },
  { id: 'chapter2', kind: 'chapter', goal: 2, label: 'Travailler 2 chapitres différents', xp: 120, gems: 12, tier: 'exigeante' },
  { id: 'correct50', kind: 'correct', goal: 50, label: 'Trouver 50 bonnes réponses', xp: 120, gems: 12, tier: 'exigeante' },
]

export const QUESTS_PER_DAY = 3

/** Bonus versé quand les trois quêtes du jour sont bouclées. Il doit valoir
 *  plus que la somme des trois : c'est LUI qu'on vient chercher. */
export const ALL_DONE_XP = 100
export const ALL_DONE_GEMS = 15

const TIER_ORDER: QuestDef['tier'][] = ['facile', 'moyenne', 'exigeante']

/** Tire un élément d'une liste avec un générateur pseudo-aléatoire ensemencé. */
function pick<T>(list: readonly T[], rng: () => number): T {
  return list[Math.floor(rng() * list.length) % list.length]
}

/**
 * Les trois quêtes du jour : une facile, une moyenne, une exigeante, tirées de
 * façon déterministe depuis (jour + élève). Même jour + même élève = mêmes
 * quêtes, à chaque rendu, sur chaque appareil, côté serveur comme client.
 */
export function dailyQuests(dayKey: string, userId: string): QuestDef[] {
  const out: QuestDef[] = []
  for (const tier of TIER_ORDER) {
    const bucket = QUEST_CATALOG.filter((q) => q.tier === tier)
    if (bucket.length === 0) continue
    // Une graine par palier : sinon deux paliers tirés du même flux se
    // corrèlent et l'élève retrouve toujours les mêmes couples.
    out.push(pick(bucket, seededRng(`${dayKey}#${userId}#${tier}`)))
  }
  return out
}

// --- Progression ------------------------------------------------------------------

/** Progression stockée : id de quête → avancement brut. */
export type QuestProgress = Readonly<Record<string, number>>

export type QuestView = {
  def: QuestDef
  current: number
  done: boolean
  /** Avancement 0..1, borné — sert directement à la largeur de la barre. */
  ratio: number
  /** « 2/3 » */
  label: string
}

export function questView(def: QuestDef, progress: QuestProgress): QuestView {
  const raw = progress[def.id]
  const current = Number.isFinite(raw) ? Math.max(0, Math.floor(raw as number)) : 0
  const capped = Math.min(current, def.goal)
  return {
    def,
    current: capped,
    done: current >= def.goal,
    ratio: def.goal > 0 ? capped / def.goal : 0,
    label: `${capped}/${def.goal}`,
  }
}

export function questViews(
  dayKey: string,
  userId: string,
  progress: QuestProgress,
): QuestView[] {
  return dailyQuests(dayKey, userId).map((d) => questView(d, progress))
}

export function allDone(views: readonly QuestView[]): boolean {
  return views.length > 0 && views.every((v) => v.done)
}

export function doneCount(views: readonly QuestView[]): number {
  return views.filter((v) => v.done).length
}

/** L'accroche du bloc de quêtes. Elle doit donner le prochain geste, pas un
 *  état : « Jouer 1 duel » vaut mieux que « 1 quête restante ». */
export function questsHeadline(views: readonly QuestView[]): string {
  if (views.length === 0) return 'Quêtes du jour'
  if (allDone(views)) return 'Journée bouclée — bravo !'
  const next = views.find((v) => !v.done)
  return next ? next.def.label : 'Quêtes du jour'
}

// --- La bulle du jour (au-dessus du CTA) ---------------------------------------------
// Reprise directe de la bulle « Événement » de Clash Royale : la checklist du
// jour ne vit plus SEULEMENT derrière une tuile et sa feuille, elle se lit à
// découvert, à un centimètre du pouce, juste au-dessus du bouton qui la fait
// avancer. Ouvrir une feuille pour savoir où l'on en est, c'est un geste de
// trop : l'élève doit voir sa journée sans rien toucher.
//
// Quatre cases pour trois quêtes : la DERNIÈRE est le bonus des trois. C'est
// exactement la grammaire de Clash (deux coches, deux coffres) — la promesse du
// bout de chaîne est visible dès la première case.

/** L'identité de la case « bonus », partagée avec la table des réclamations. */
export const BONUS_STEP_ID = '__jour__'

/** Une case de la bulle : une quête, ou le coffre de bonus au bout. */
export type BubbleStep = {
  id: string
  /** Libellé complet — porté par l'aria-label, jamais affiché dans la case. */
  label: string
  done: boolean
  /** Déjà encaissée : la case est éteinte, le travail est derrière. */
  claimed: boolean
  /** La case du bout : le bonus des trois quêtes, pas une quête. */
  isBonus: boolean
}

export type QuestBubbleView = {
  steps: BubbleStep[]
  /** Quêtes terminées (le bonus ne compte pas : il n'est pas une quête). */
  done: number
  total: number
  /** Ce qui se réclame MAINTENANT (cases finies non encaissées, bonus compris). */
  claimable: number
  /** L'accroche : le prochain geste, jamais un état. */
  headline: string
}

/**
 * La bulle du jour, ou `null` s'il n'y a pas de quêtes (migration 205 absente) :
 * mieux vaut pas de bulle qu'une rangée de cases qui ne se cocheraient jamais.
 */
export function questBubbleView(
  views: readonly QuestView[],
  claimedIds: readonly string[],
): QuestBubbleView | null {
  if (views.length === 0) return null
  const claimed = new Set(claimedIds)
  const complete = allDone(views)

  const steps: BubbleStep[] = views.map((v) => ({
    id: v.def.id,
    label: v.def.label,
    done: v.done,
    claimed: claimed.has(v.def.id),
    isBonus: false,
  }))
  steps.push({
    id: BONUS_STEP_ID,
    label: `Bonus des ${views.length} quêtes : +${ALL_DONE_XP} XP et +${ALL_DONE_GEMS} gemmes`,
    done: complete,
    claimed: claimed.has(BONUS_STEP_ID),
    isBonus: true,
  })

  return {
    steps,
    done: doneCount(views),
    total: views.length,
    claimable: steps.filter((s) => s.done && !s.claimed).length,
    headline: questsHeadline(views),
  }
}

// --- Événements de jeu → avancement -------------------------------------------------
// Un seul endroit traduit « ce qui vient de se passer » en incréments de quête.
// Les Server Actions appellent CETTE fonction et poussent le résultat en base :
// il n'existe donc qu'une définition de « ce qui compte ».

/** Ce qu'une partie ou une activité vient de produire. */
export type QuestEvent = {
  duelsPlayed?: number
  duelsWon?: number
  correct?: number
  /** Meilleure série atteinte pendant l'activité (valeur ABSOLUE, pas un
   *  incrément : une série ne se cumule pas d'une partie à l'autre). */
  bestCombo?: number
  sessionsPrepa?: number
  revisions?: number
  /** Ids des chapitres travaillés pendant l'activité. */
  chapterIds?: readonly string[]
}

/** Les increments à appliquer, par type de quête. Les quêtes « combo » sont un
 *  MAXIMUM et non une somme — d'où leur traitement à part. */
export type QuestDelta = {
  add: Partial<Record<QuestKind, number>>
  max: Partial<Record<QuestKind, number>>
}

export function deltaFor(event: QuestEvent): QuestDelta {
  const n = (v: number | undefined) =>
    Number.isFinite(v) ? Math.max(0, Math.floor(v as number)) : 0
  return {
    add: {
      duel_play: n(event.duelsPlayed),
      duel_win: n(event.duelsWon),
      correct: n(event.correct),
      session_prepa: n(event.sessionsPrepa),
      revision: n(event.revisions),
      chapter: new Set(event.chapterIds ?? []).size,
    },
    max: {
      combo: n(event.bestCombo),
    },
  }
}

/**
 * Applique un événement à la progression du jour et renvoie la NOUVELLE
 * progression (immutabilité : on ne modifie jamais l'objet reçu).
 * Seules les quêtes réellement tirées ce jour-là avancent.
 */
export function applyEvent(
  dayKey: string,
  userId: string,
  progress: QuestProgress,
  event: QuestEvent,
): QuestProgress {
  const delta = deltaFor(event)
  const next: Record<string, number> = { ...progress }
  for (const def of dailyQuests(dayKey, userId)) {
    const current = Number.isFinite(next[def.id]) ? next[def.id] : 0
    const add = delta.add[def.kind] ?? 0
    const max = delta.max[def.kind] ?? 0
    // Un type de quête relève soit du cumul, soit du record — jamais des deux.
    const value = max > 0 ? Math.max(current, max) : current + add
    if (value !== current) next[def.id] = value
  }
  return next
}

/** Récompense totale à verser pour les quêtes terminées (bonus inclus).
 *  Recalculée côté serveur à la réclamation — la valeur affichée par le client
 *  n'est jamais celle qui est créditée. */
export function questsReward(views: readonly QuestView[]): { xp: number; gems: number } {
  const done = views.filter((v) => v.done)
  const xp = done.reduce((s, v) => s + v.def.xp, 0) + (allDone(views) ? ALL_DONE_XP : 0)
  const gems =
    done.reduce((s, v) => s + v.def.gems, 0) + (allDone(views) ? ALL_DONE_GEMS : 0)
  return { xp, gems }
}

/** Normalise la colonne JSONB `progress` lue en base. */
export function normalizeProgress(raw: unknown): QuestProgress {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {}
  const out: Record<string, number> = {}
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    const n = Number(v)
    if (typeof k === 'string' && k.length > 0 && Number.isFinite(n) && n > 0) {
      out[k] = Math.floor(n)
    }
  }
  return out
}
