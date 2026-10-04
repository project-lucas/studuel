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
//
// LES TROIS GESTES DE L'APP (03/10/2026, Lucas : « les quêtes journalières sont
// centrales, comme Genshin Impact »). Chaque jour, une quête par geste :
// APPRENDRE (un cours), SE TESTER (un quiz, des bonnes réponses, le cahier),
// JOUER (l'arène). Elles ne touchaient avant que le duel classé, et quatre
// d'entre elles comptaient des choses que rien n'alimentait.
//
// RÈGLE D'OR : une quête n'entre au catalogue que si son type est alimenté par
// un appel réel à advanceQuests (lib/quests-server), et qu'un élève gratuit de
// n'importe quelle classe peut la finir aujourd'hui. Seule exception, le
// cahier d'exercices : réservé à Studuel+ et écrit pour certaines classes, il
// n'est tiré que si le contexte de l'élève le permet (`QuestContext`).

/** Ce qu'une quête compte. Chaque type est incrémenté depuis UN endroit du
 *  code : ajouter un type sans brancher son compteur = quête infinissable. */
export type QuestKind =
  | 'lecon' // cours terminés (completeLesson)
  | 'quiz' // quiz terminés (recordTestSession)
  | 'quiz_reussi' // quiz terminés à 80 % ou plus (recordTestSession)
  | 'correct' // bonnes réponses : quiz, révisions, jeux, duels
  | 'exercice' // exercices du cahier réussis (terminerExercice)
  | 'duel_play' // courses classées jouées (fin de course)
  | 'duel_win' // courses classées gagnées (fin de course)
  | 'partie' // parties de jeux de salon et de modes de l'arène (recordChallenge)

/** Le geste de la journée auquel une quête appartient — un par jour. */
export type QuestPilier = 'apprendre' | 'tester' | 'jouer'

export const PILIERS: readonly QuestPilier[] = ['apprendre', 'tester', 'jouer']

export const PILIER_LIBELLE: Record<QuestPilier, string> = {
  apprendre: 'Apprendre',
  tester: 'Se tester',
  jouer: 'Jouer',
}

export type QuestDef = {
  id: string
  kind: QuestKind
  pilier: QuestPilier
  goal: number
  /** Libellé à l'infinitif, court. Il tient sur une ligne de téléphone. */
  label: string
  /** Où ça se fait, en quelques mots, sous le libellé. */
  detail: string
  /** Où mène « Y aller ». */
  href: string
  xp: number
  gems: number
  /** Ne se tire que pour un abonné dont la classe a un cahier d'exercices. */
  cahier?: true
}

export const QUEST_CATALOG: readonly QuestDef[] = [
  // --- apprendre --------------------------------------------------------------
  { id: 'lecon1', kind: 'lecon', pilier: 'apprendre', goal: 1, label: 'Terminer 1 cours', detail: 'Lis un cours jusqu’au bout', href: '/reviser', xp: 30, gems: 0 },
  { id: 'lecon2', kind: 'lecon', pilier: 'apprendre', goal: 2, label: 'Terminer 2 cours', detail: 'Dans la matière de ton choix', href: '/reviser', xp: 50, gems: 0 },

  // --- se tester --------------------------------------------------------------
  { id: 'quiz1', kind: 'quiz', pilier: 'tester', goal: 1, label: 'Terminer 1 quiz', detail: 'N’importe quel chapitre', href: '/reviser', xp: 30, gems: 0 },
  { id: 'quiz80', kind: 'quiz_reussi', pilier: 'tester', goal: 1, label: 'Réussir 1 quiz à 80 %', detail: 'Au moins 8 bonnes réponses sur 10', href: '/reviser', xp: 40, gems: 0 },
  { id: 'correct20', kind: 'correct', pilier: 'tester', goal: 20, label: 'Trouver 20 bonnes réponses', detail: 'Quiz, révisions, jeux et duels comptent', href: '/reviser', xp: 40, gems: 0 },
  { id: 'exercice1', kind: 'exercice', pilier: 'tester', goal: 1, label: 'Réussir 1 exercice du cahier', detail: 'Dans le cahier d’un chapitre', href: '/reviser', xp: 50, gems: 0, cahier: true },

  // --- jouer ------------------------------------------------------------------
  { id: 'duel1', kind: 'duel_play', pilier: 'jouer', goal: 1, label: 'Jouer 1 duel', detail: 'Dans l’arène', href: '/defi', xp: 30, gems: 0 },
  { id: 'win1', kind: 'duel_win', pilier: 'jouer', goal: 1, label: 'Gagner 1 duel', detail: 'Dans l’arène', href: '/defi', xp: 40, gems: 0 },
  { id: 'partie2', kind: 'partie', pilier: 'jouer', goal: 2, label: 'Jouer 2 parties', detail: 'Un jeu ou un mode de l’arène', href: '/defi', xp: 30, gems: 0 },
]

/** Les quêtes retirées le 03/10/2026 : la base les connaît encore (555), pour
 *  payer une journée commencée avant le déploiement ; plus aucun code ne les
 *  tire. Le test miroir (lib/recompenses-mirror.test.ts) les y tolère. */
export const QUETES_RETIREES: readonly string[] = [
  'correct10',
  'revision5',
  'combo3',
  'duel3',
  'correct25',
  'prepa1',
  'revision15',
  'win3',
  'combo8',
  'chapter2',
  'correct50',
]

export const QUESTS_PER_DAY = 3

/** Bonus versé quand les trois quêtes du jour sont bouclées (le coffre du
 *  jour). Il doit valoir plus que la somme des trois : c'est LUI qu'on vient
 *  chercher. De l'XP seulement depuis la 557 : la gemme est réservée aux épreuves. */
export const ALL_DONE_XP = 100
export const ALL_DONE_GEMS = 0

/** Ce que l'on sait de l'élève pour tirer ses quêtes. */
export type QuestContext = {
  /** Abonné Studuel+ ET classe dotée d'un cahier d'exercices. */
  cahier?: boolean
}

/** Les classes (niveau de contenu) dont le cahier d'exercices est en base. */
export const NIVEAUX_CAHIER: readonly string[] = ['3e', '1re', 'Tle']

/** Le contexte de tirage, depuis l'abonnement et le niveau de contenu. */
export function contexteQuetes(premium: boolean, niveauContenu: string | null | undefined): QuestContext {
  return { cahier: premium && !!niveauContenu && NIVEAUX_CAHIER.includes(niveauContenu) }
}

/** Tire un élément d'une liste avec un générateur pseudo-aléatoire ensemencé. */
function pick<T>(list: readonly T[], rng: () => number): T {
  return list[Math.floor(rng() * list.length) % list.length]
}

/**
 * Les trois quêtes du jour : une par geste (apprendre, se tester, jouer),
 * tirées de façon déterministe depuis (jour + élève + contexte). Mêmes
 * entrées = mêmes quêtes, à chaque rendu, sur chaque appareil.
 */
export function dailyQuests(dayKey: string, userId: string, ctx: QuestContext = {}): QuestDef[] {
  const out: QuestDef[] = []
  for (const pilier of PILIERS) {
    const bucket = QUEST_CATALOG.filter((q) => q.pilier === pilier && (!q.cahier || ctx.cahier === true))
    if (bucket.length === 0) continue
    // Une graine par geste : sinon deux gestes tirés du même flux se
    // corrèlent et l'élève retrouve toujours les mêmes couples.
    out.push(pick(bucket, seededRng(`${dayKey}#${userId}#${pilier}`)))
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
  ctx: QuestContext = {},
): QuestView[] {
  return dailyQuests(dayKey, userId, ctx).map((d) => questView(d, progress))
}

export function allDone(views: readonly QuestView[]): boolean {
  return views.length > 0 && views.every((v) => v.done)
}

export function doneCount(views: readonly QuestView[]): number {
  return views.filter((v) => v.done).length
}

/** L'accroche du bloc de quêtes. Elle doit donner le prochain geste, pas un
 *  état : « Terminer 1 cours » vaut mieux que « 1 quête restante ». */
export function questsHeadline(views: readonly QuestView[]): string {
  if (views.length === 0) return 'Quêtes du jour'
  if (allDone(views)) return 'Journée bouclée — bravo !'
  const next = views.find((v) => !v.done)
  return next ? next.def.label : 'Quêtes du jour'
}

/** L'identité du coffre de bonus, partagée avec la table des réclamations :
 *  il récompense les trois quêtes du jour, pas une seule. */
export const BONUS_STEP_ID = '__jour__'

// --- Ce que le navigateur reçoit ------------------------------------------------
// La feuille des quêtes vit dans le bandeau, sur tous les onglets : elle est
// servie par une route (app/api/quetes) et non calculée par chaque page.

/** Une quête du jour telle que le navigateur la reçoit : à plat, sérialisable. */
export type QueteServie = {
  id: string
  pilier: QuestPilier
  label: string
  detail: string
  href: string
  goal: number
  current: number
  done: boolean
  xp: number
  gems: number
}

export type QuetesDuJour = {
  jour: string
  quetes: QueteServie[]
  /** Ids déjà encaissés aujourd'hui, '__jour__' compris (le coffre du jour). */
  encaissees: string[]
}

export function queteServie(v: QuestView): QueteServie {
  const { def } = v
  return {
    id: def.id,
    pilier: def.pilier,
    label: def.label,
    detail: def.detail,
    href: def.href,
    goal: def.goal,
    current: v.current,
    done: v.done,
    xp: def.xp,
    gems: def.gems,
  }
}

/** Les quêtes finies et pas encore payées : ce qu'il y a à encaisser. */
export function aEncaisser(etat: QuetesDuJour): QueteServie[] {
  const payees = new Set(etat.encaissees)
  return etat.quetes.filter((q) => q.done && !payees.has(q.id))
}

/** Le coffre du jour : les trois quêtes finies, et pas encore ouvert. */
export function coffreDuJourPret(etat: QuetesDuJour): boolean {
  return etat.quetes.length > 0 && etat.quetes.every((q) => q.done) && !etat.encaissees.includes(BONUS_STEP_ID)
}

/**
 * « Quête accomplie » : les quêtes finies que l'élève n'a encore ni vues
 * annoncées ni encaissées. `annoncees` vient du navigateur (une liste par
 * jour) : une quête finie la veille au soir n'est pas réannoncée au réveil.
 */
export function quetesAAnnoncer(etat: QuetesDuJour, annoncees: readonly string[]): QueteServie[] {
  const deja = new Set(annoncees)
  return aEncaisser(etat).filter((q) => !deja.has(q.id))
}

// --- Événements de jeu → avancement -------------------------------------------------
// Un seul endroit traduit « ce qui vient de se passer » en incréments de quête.
// Les Server Actions appellent CETTE fonction et poussent le résultat en base :
// il n'existe donc qu'une définition de « ce qui compte ».

/** Ce qu'une partie ou une activité vient de produire. */
export type QuestEvent = {
  lecons?: number
  quiz?: number
  quizReussis?: number
  correct?: number
  exercicesReussis?: number
  duelsPlayed?: number
  duelsWon?: number
  parties?: number
}

/** Les incréments à appliquer, par type de quête. */
export type QuestDelta = Partial<Record<QuestKind, number>>

export function deltaFor(event: QuestEvent): QuestDelta {
  const n = (v: number | undefined) =>
    Number.isFinite(v) ? Math.max(0, Math.floor(v as number)) : 0
  return {
    lecon: n(event.lecons),
    quiz: n(event.quiz),
    quiz_reussi: n(event.quizReussis),
    correct: n(event.correct),
    exercice: n(event.exercicesReussis),
    duel_play: n(event.duelsPlayed),
    duel_win: n(event.duelsWon),
    partie: n(event.parties),
  }
}

/** Un quiz « réussi » pour les quêtes : 80 % des réponses au moins. */
export const SEUIL_QUIZ_REUSSI = 0.8

export function quizReussi(score: number, total: number): boolean {
  return total > 0 && score / total >= SEUIL_QUIZ_REUSSI
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
  ctx: QuestContext = {},
): QuestProgress {
  const delta = deltaFor(event)
  const next: Record<string, number> = { ...progress }
  for (const def of dailyQuests(dayKey, userId, ctx)) {
    const current = Number.isFinite(next[def.id]) ? next[def.id] : 0
    const add = delta[def.kind] ?? 0
    if (add > 0) next[def.id] = current + add
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

// ------------------------------------------------------ le renouvellement

/**
 * Minutes avant le prochain minuit UTC — le moment où les quêtes du jour
 * changent (les clés de jour de l'app sont en UTC, cf. lib/time). Toujours
 * au moins 1 : la minute en cours compte.
 */
export function minutesAvantMinuitUtc(now: number): number {
  const d = new Date(now)
  const minuit = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1)
  return Math.max(1, Math.ceil((minuit - now) / 60_000))
}

/**
 * La pastille du jour : « Nouvelles quêtes dans 5 h 12 », « … dans 8 min ».
 * Sans minutes (le serveur ne connaît pas l'heure du téléphone), la promesse
 * seule : de nouvelles quêtes chaque jour.
 */
export function libelleRenouvellement(minutes: number | null): string {
  if (minutes === null) return 'Nouvelles quêtes chaque jour'
  if (minutes < 60) return `Nouvelles quêtes dans ${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `Nouvelles quêtes dans ${h} h${m > 0 ? ` ${String(m).padStart(2, '0')}` : ''}`
}
