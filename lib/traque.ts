// -----------------------------------------------------------------------------
// « La Traque » — les boss se DÉBUSQUENT en révisant, ils ne se choisissent pas.
//
// Inspiration assumée : le Death Match de 7DS Grand Cross. Une jauge de
// rencontre monte à chaque geste de travail réel sur une matière ; à 100 % le
// gardien sort de sa tanière, un message éclair l'annonce, sa silhouette se
// pose sur l'île de l'arène — et il n'est défiable que pendant UNE HEURE.
//
// La boucle : je révise → le boss sort → je le bats → gemmes → j'ouvre la fiche
// du chapitre → de quoi mieux réviser. Le combat porte sur les chapitres qui
// ont rempli la jauge : il interroge littéralement ce qui vient d'être travaillé.
//
// Logique PURE et testée (convention projet). La persistance vit dans
// `lib/traque-server.ts` + `supabase/212_traque_boss.sql`, qui MIROITE le
// barème, le seuil, le plafond et les gemmes ci-dessous — toute modification
// ici doit toucher la migration suivante.
//
// Cadrage complet : docs/CADRAGE-TRAQUE-BOSS.md
// -----------------------------------------------------------------------------

import { bossById, type Boss, type BossRank } from '@/lib/bosses'

// --------------------------------------------------------------- le barème

/**
 * Ce qui remplit une jauge. Des GESTES, jamais du temps de présence : un onglet
 * laissé ouvert se triche, une carte révisée non. Ces quatre gestes sont déjà
 * instrumentés par les quêtes du jour — on branche les deux compteurs au même
 * endroit plutôt que de faire deux passes.
 */
export type TraqueGeste = 'carte' | 'bonne_reponse' | 'lecon' | 'quiz_chapitre'

export const TRAQUE_POINTS: Readonly<Record<TraqueGeste, number>> = {
  carte: 4, // carte révisée (SRS / carnet)
  bonne_reponse: 2, // bonne réponse en quiz
  lecon: 15, // leçon terminée
  quiz_chapitre: 25, // quiz de chapitre terminé
}

/** Jauge pleine. ~20 minutes de travail réel — une session, pas une soirée. */
export const TRAQUE_SEUIL = 100

/**
 * Plafond de points par jour et par matière. Sans lui, on farme une seule
 * matière toute la journée et le calendrier des boss en chasse ne veut plus
 * rien dire. 150 = une jauge et demie : on peut prendre de l'avance, pas trois.
 */
export const TRAQUE_PLAFOND_JOUR = 150

/** Durée de la fenêtre de combat, une fois le boss débusqué. */
export const TRAQUE_FENETRE_MINUTES = 60
export const TRAQUE_FENETRE_MS = TRAQUE_FENETRE_MINUTES * 60_000

/** Palier visible et sonore — le « tic » tous les 10 %. */
export const TRAQUE_PALIER_PCT = 10

/**
 * Où retombe la jauge après une DÉFAITE. Jamais à zéro : vider entièrement
 * punit d'avoir essayé, et l'élève ne retente plus jamais.
 */
export const TRAQUE_APRES_DEFAITE = Math.floor(TRAQUE_SEUIL / 2)

/** Équivalent en minutes affiché à l'élève (le barème est en points). */
export const TRAQUE_MINUTES_EQUIV = 20

/** Ce qu'une activité vient de produire, par geste. */
export type TraqueEvent = Partial<Record<TraqueGeste, number>>

const clampInt = (v: unknown): number => {
  const n = Number(v)
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0
}

/** Points bruts d'un événement (avant plafond du jour, appliqué en base). */
export function pointsFor(event: TraqueEvent): number {
  let total = 0
  for (const [geste, points] of Object.entries(TRAQUE_POINTS)) {
    total += clampInt(event[geste as TraqueGeste]) * points
  }
  return total
}

// ------------------------------------------------------------------ la jauge

/** L'état persisté d'une traque, normalisé (miroir de `boss_gauges`). */
export type TraqueGauge = {
  bossId: string
  /** Points accumulés, écrêtés au seuil quand le boss est débusqué. */
  points: number
  /** Chapitres qui ont nourri la jauge, LE PLUS RÉCENT EN TÊTE. */
  chapters: string[]
  /** Victoires sur ce boss (fixe son rang I → III). */
  victories: number
  /**
   * Combats PERDUS depuis le débusquage courant. Perdre ne referme pas la
   * fenêtre (migration 213) : l'heure appartient à l'élève, il retente autant
   * qu'il veut. Remis à zéro à chaque sortie de tanière et à la victoire.
   */
  attempts: number
  /** Instant du débusquage (ISO), null tant qu'il rôde. */
  debusqueAt: string | null
}

export type TraqueStatus =
  | 'traque' // la jauge monte, le boss rôde
  | 'debusque' // il est sorti, la fenêtre court
  | 'expire' // il s'est recouché : la fenêtre est passée

export function emptyGauge(bossId: string): TraqueGauge {
  return {
    bossId,
    points: 0,
    chapters: [],
    victories: 0,
    attempts: 0,
    debusqueAt: null,
  }
}

/** Fin de la fenêtre de combat (ms epoch), null si le boss n'est pas sorti. */
export function windowEndMs(gauge: TraqueGauge): number | null {
  if (!gauge.debusqueAt) return null
  const start = Date.parse(gauge.debusqueAt)
  return Number.isFinite(start) ? start + TRAQUE_FENETRE_MS : null
}

export function gaugeStatus(gauge: TraqueGauge, nowMs: number): TraqueStatus {
  const end = windowEndMs(gauge)
  if (end === null) return 'traque'
  return nowMs < end ? 'debusque' : 'expire'
}

/** Millisecondes restantes avant que le boss ne se recouche (0 si passé). */
export function remainingMs(gauge: TraqueGauge, nowMs: number): number {
  const end = windowEndMs(gauge)
  if (end === null) return 0
  return Math.max(0, end - nowMs)
}

/** « 42 min », « 1 h », « moins d'une minute ». */
export function countdownLabel(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000))
  if (total < 60) return "moins d'une minute"
  const minutes = Math.floor(total / 60)
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest === 0 ? `${hours} h` : `${hours} h ${String(rest).padStart(2, '0')}`
}

/** Avancement 0..1 — sert directement à la largeur de la barre. */
export function gaugeRatio(points: number): number {
  return Math.min(1, Math.max(0, points) / TRAQUE_SEUIL)
}

export function gaugePercent(points: number): number {
  return Math.round(gaugeRatio(points) * 100)
}

/** Palier de 10 % atteint (0 → 10). Sert au « tic » sonore. */
export function palierOf(points: number): number {
  return Math.floor(gaugePercent(points) / TRAQUE_PALIER_PCT)
}

/** Un palier vient-il d'être franchi ? (célébration au bon moment) */
export function crossedPalier(before: number, after: number): boolean {
  return palierOf(after) > palierOf(before)
}

/** Points manquants avant que le boss ne sorte. */
export function pointsMissing(points: number): number {
  return Math.max(0, TRAQUE_SEUIL - Math.max(0, Math.floor(points)))
}

/**
 * Ce qu'il reste à faire, EN GESTES — jamais un pourcentage nu : « 5 cartes de
 * plus » se comprend d'un coup d'œil, « 82 % » ne dit pas quoi faire.
 */
export function restantLabel(points: number): string {
  const missing = pointsMissing(points)
  if (missing === 0) return 'Prêt à sortir !'
  const cartes = Math.ceil(missing / TRAQUE_POINTS.carte)
  return cartes === 1 ? '1 carte de plus' : `${cartes} cartes de plus`
}

/** « Delta est à 5 cartes de sortir de sa tanière. » */
export function teaseLabel(bossName: string, points: number): string {
  const missing = pointsMissing(points)
  if (missing === 0) return `${bossName} est prêt à sortir !`
  const cartes = Math.ceil(missing / TRAQUE_POINTS.carte)
  const unite = cartes === 1 ? 'carte' : 'cartes'
  return `${bossName} est à ${cartes} ${unite} de sortir de sa tanière.`
}

/**
 * Le message ÉCLAIR de l'apparition — celui sur lequel on tape pour y aller.
 * Après un combat perdu, le gardien est TOUJOURS là (la fenêtre lui survit) :
 * répéter « a surgi » sonnerait faux, on passe au défi qui reste ouvert.
 */
export function apparitionMessage(boss: Boss, attempts = 0): string {
  return attempts > 0
    ? `${boss.name} t’attend toujours !`
    : `${boss.name} a surgi de sa tanière !`
}

/** « 2e essai » — l'écran de combat rappelle qu'on peut encore le reprendre. */
export function attemptLabel(attempts: number): string {
  const n = Math.max(0, Math.floor(attempts)) + 1
  return n === 1 ? '1er essai' : `${n}e essai`
}

// ------------------------------------------------------ LE RIDEAU D'APPARITION

/**
 * Ce qu'il faut savoir pour OUVRIR LE RIDEAU sur un écran de fin de séquence :
 * qui vient de sortir, sur quelle matière, et jusqu'à quand il est défiable.
 *
 * Le rideau ne s'ouvre PAS à la milliseconde où la jauge déborde : ce serait
 * couper l'élève au milieu d'une question. Il s'ouvre au premier point d'arrêt
 * naturel — fin de quiz, fin de session « À revoir » — là où le travail vient
 * justement d'être bouclé. La cause est encore chaude, l'effet ne dérange plus,
 * et partir au combat ne lui arrache plus une session en cours.
 */
export type TraqueApparition = {
  bossId: string
  subject: string
  /** Fin de la fenêtre d'une heure, en ms epoch — le compte à rebours du rideau. */
  endsAt: number
}

/**
 * Forme minimale d'un crédit de jauge. Déclarée ici plutôt qu'importée de
 * `lib/traque-server` : ce module est pur, il ne doit rien devoir au serveur.
 */
type CreditLike = {
  boss: { id: string }
  subject: string
  justDebusque: boolean
  debusqueAt: number | null
}

/**
 * Le gardien qui vient DE SORTIR dans ce lot de crédits, s'il y en a un.
 *
 * Une session « À revoir » brasse volontiers trois matières : si deux jauges
 * débordent dans la même session, on n'ouvre qu'UN seul rideau. Deux rideaux
 * d'affilée transformeraient l'événement en file d'attente — le second gardien
 * reste annoncé par la bannière de l'arène, qui est faite pour ça.
 *
 * `debusqueAt` absent (RPC d'une base plus ancienne) : on retombe sur
 * « maintenant + la fenêtre ». C'est juste à la milliseconde près, puisque le
 * serveur vient tout juste de le débusquer.
 */
export function apparitionOf(
  credits: readonly CreditLike[],
  nowMs: number,
): TraqueApparition | null {
  const fresh = credits.find((c) => c.justDebusque)
  if (!fresh) return null
  return {
    bossId: fresh.boss.id,
    subject: fresh.subject,
    endsAt: (fresh.debusqueAt ?? nowMs) + TRAQUE_FENETRE_MS,
  }
}

/**
 * Le rideau a-t-il encore un sens à cet instant ? Un écran de fin laissé ouvert
 * dix minutes, un retour arrière du navigateur, un onglet repris le lendemain :
 * proposer un combat que le serveur refuserait serait une promesse en l'air.
 */
export function apparitionAlive(
  apparition: TraqueApparition,
  nowMs: number,
): boolean {
  return apparition.endsAt > nowMs
}

// -------------------------------------------------------- le pool du combat

/**
 * Nombre de chapitres retenus pour composer le pool du combat. Assez pour
 * varier, assez peu pour que le combat porte VRAIMENT sur ce qui vient d'être
 * révisé — c'est ce qui le rend gagnable, donc jouable, donc rejouable.
 */
export const TRAQUE_POOL_CHAPTERS = 5

/**
 * Regroupe par MATIÈRE les chapitres derrière une liste de réponses de
 * révision, dans l'ordre où ils ont été travaillés (le premier vu en tête, ce
 * que `traque_merge_chapters` remontera devant dans la jauge).
 *
 * Sans ce regroupement, une jauge remplie par la seule file « À revoir »
 * n'aurait AUCUN chapitre, et le combat perdrait sa promesse : « le gardien
 * interroge ce que tu viens de réviser ». Les items sans chapitre connu
 * (cartes, question hors catalogue) sont simplement ignorés.
 *
 * Pur : la résolution question → chapitre est faite par l'appelant
 * (lib/traque-server), qui seul parle à la base.
 */
export function chaptersBySubject(
  answers: readonly { kind?: string; id?: string; subject: string | null }[],
  chapterOfQuestion: ReadonlyMap<string, string>,
): Map<string, string[]> {
  const out = new Map<string, string[]>()
  for (const a of answers) {
    const subject = a.subject ?? ''
    if (!subject || a.kind !== 'question' || typeof a.id !== 'string') continue
    const chapter = chapterOfQuestion.get(a.id)
    if (!chapter) continue
    const list = out.get(subject) ?? []
    if (!list.includes(chapter)) list.push(chapter)
    out.set(subject, list)
  }
  return out
}

/**
 * Les chapitres qui composent le pool, les plus récemment nourris en tête.
 * La liste stockée est déjà ordonnée (le plus récent devant) : on déduplique
 * et on tronque.
 */
export function poolChapters(
  chapters: readonly string[],
  max: number = TRAQUE_POOL_CHAPTERS,
): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const c of chapters) {
    if (typeof c !== 'string' || c.length === 0 || seen.has(c)) continue
    seen.add(c)
    out.push(c)
    if (out.length >= Math.max(0, max)) break
  }
  return out
}

/**
 * Nourrit la liste de chapitres : le nouveau passe DEVANT, la liste reste
 * bornée. Immutable — on ne modifie jamais la liste reçue.
 */
export const TRAQUE_CHAPTERS_KEPT = 12

export function feedChapters(
  chapters: readonly string[],
  fresh: readonly string[],
): string[] {
  const merged = [...fresh.filter((c) => typeof c === 'string' && c), ...chapters]
  return poolChapters(merged, TRAQUE_CHAPTERS_KEPT)
}

// ------------------------------------------------- le calendrier de la chasse
//
// La jauge monte TOUS LES JOURS, dans TOUTES les matières : on ne punit jamais
// un élève qui révise la matière de son contrôle hors du « bon » jour. Ce qui
// tourne, c'est le BONUS de gemmes. Calendrier fixe et affiché : le rituel
// (« le mardi c'est Grammatork ») vaut mieux qu'une rotation maligne et
// illisible. Chaque jour mêle une scientifique et une littéraire ou une langue.

/** Lundi = 0 (convention du projet). */
export function weekdayIndex(dayKey: string): number {
  const d = new Date(`${dayKey}T00:00:00Z`).getUTCDay() // dimanche = 0
  return (d + 6) % 7
}

const WEEKDAY_NAMES = [
  'lundi',
  'mardi',
  'mercredi',
  'jeudi',
  'vendredi',
  'samedi',
  'dimanche',
] as const

/** Boss en chasse par jour de semaine (ids du catalogue lib/bosses). */
const CHASSE_BY_WEEKDAY: readonly (readonly string[])[] = [
  ['delta', 'imperator'], // lundi — Maths · Latin
  ['grammatork', 'plasma'], // mardi — Français · Physique-Chimie
  ['chronos', 'bigben'], // mercredi — Histoire-Géo (Atlas) · Anglais
  ['mitochondrix', 'eltoro'], // jeudi — SVT (Sylvarok) · Espagnol
  ['kaiser-fang', 'krach'], // vendredi — Allemand · SES
  [], // samedi — rattrapage : TOUS (cf. isEnChasse)
  [], // dimanche — rattrapage : TOUS + Nox
]

/** Le week-end, tout le monde chasse : c'est le rattrapage de la semaine. */
export function isRattrapage(dayKey: string): boolean {
  return weekdayIndex(dayKey) >= 5
}

/** Ce boss porte-t-il le bonus ×2 aujourd'hui ? */
export function isEnChasse(bossId: string, dayKey: string): boolean {
  if (isRattrapage(dayKey)) return true
  return CHASSE_BY_WEEKDAY[weekdayIndex(dayKey)].includes(bossId)
}

/** Les boss en chasse du jour, en clair (vide = tous, le week-end). */
export function chasseOfDay(dayKey: string): Boss[] {
  const ids = isRattrapage(dayKey) ? [] : CHASSE_BY_WEEKDAY[weekdayIndex(dayKey)]
  return ids.flatMap((id) => {
    const b = bossById(id)
    return b ? [b] : []
  })
}

/** « mardi » — le jour où ce boss redevient en chasse. Null s'il l'est déjà. */
export function nextChasseDay(bossId: string, dayKey: string): string | null {
  if (isEnChasse(bossId, dayKey)) return null
  const today = weekdayIndex(dayKey)
  for (let step = 1; step <= 7; step++) {
    const idx = (today + step) % 7
    if (idx >= 5 || CHASSE_BY_WEEKDAY[idx].includes(bossId)) {
      return WEEKDAY_NAMES[idx]
    }
  }
  return null
}

// --------------------------------------------------------------- Nox, le boss
// du dimanche : sa jauge se remplit toutes matières confondues et il exige
// d'avoir battu assez de gardiens dans la semaine. Son pool est tiré des 7
// derniers jours de révision — un examen blanc hebdomadaire déguisé en boss
// final. Il ABSORBE l'ancien « boss de la semaine » : deux événements
// hebdomadaires concurrents, personne ne les distinguait.

export const NOX_BOSS_ID = 'nox'
export const NOX_VICTORIES_REQUIRED = 3

export function noxUnlocked(weekVictories: number, dayKey: string): boolean {
  return (
    weekdayIndex(dayKey) === 6 &&
    Math.max(0, Math.floor(weekVictories)) >= NOX_VICTORIES_REQUIRED
  )
}

// ------------------------------------------------------------ les récompenses

/** Gemmes d'une victoire, par rang du boss. Miroir de la migration 212. */
export const TRAQUE_GEMS: Readonly<Record<BossRank, number>> = {
  1: 10,
  2: 15,
  3: 20,
}

/** Nox vaut un chapitre entier (GEM_COST_CHAPTER = 30). */
export const NOX_GEMS = 30

/** Bonus du boss en chasse du jour. */
export const CHASSE_MULTIPLIER = 2

/**
 * Plafond HEBDOMADAIRE de gemmes gagnables à la traque. Les quêtes du jour
 * versent déjà 3 à 12 💎 ×3 : sans borne, le catalogue s'ouvre en trois
 * semaines et Studuel+ perd sa contrepartie (cf. la mise en garde de
 * lib/gems.ts). 90 = trois chapitres par semaine — généreux, pas ruineux.
 */
export const TRAQUE_GEMS_WEEK_CAP = 90

export function gemsForVictory(
  rank: BossRank,
  enChasse: boolean,
  isNox = false,
): number {
  const base = isNox ? NOX_GEMS : TRAQUE_GEMS[rank]
  return enChasse && !isNox ? base * CHASSE_MULTIPLIER : base
}

/** Gemmes réellement versables compte tenu du plafond de la semaine. */
export function gemsAfterCap(amount: number, alreadyThisWeek: number): number {
  const left = Math.max(0, TRAQUE_GEMS_WEEK_CAP - Math.max(0, alreadyThisWeek))
  return Math.max(0, Math.min(Math.floor(amount), left))
}

// ------------------------------------------------------------- vue d'une carte

/** Une carte de la feuille Boss, prête à afficher. */
export type TraqueCard = {
  boss: Boss
  /** Nom affiché de la matière (« Mathématiques »). */
  subject: string
  /** Slug de la matière — le CTA « Réviser » y renvoie. */
  subjectSlug: string
  status: TraqueStatus
  points: number
  ratio: number
  percent: number
  /** Rang du boss (I → III), dérivé des victoires. */
  rank: BossRank
  /** Combats perdus depuis qu'il est sorti — la fenêtre, elle, court toujours. */
  attempts: number
  /** Le bonus ×2 du jour s'applique. */
  enChasse: boolean
  /** Jour de retour en chasse (« mercredi ») — null s'il chasse aujourd'hui. */
  backOn: string | null
  /** Temps restant avant qu'il ne se recouche (ms), 0 hors fenêtre. */
  remainingMs: number
  /**
   * Fin de la fenêtre (ms epoch), null hors fenêtre. Le compte à rebours rendu
   * par le SERVEUR se périme dès la seconde suivante : le client repart de
   * cette borne pour l'égrener lui-même.
   */
  endsAt: number | null
  /** Ce qu'il reste à faire, en gestes. */
  hint: string
  /** Gemmes en jeu si on le bat maintenant. */
  gems: number
}

function rankOf(victories: number): BossRank {
  return Math.min(1 + Math.max(0, Math.floor(victories)), 3) as BossRank
}

export function traqueCard(
  gauge: TraqueGauge,
  boss: Boss,
  subject: string,
  dayKey: string,
  nowMs: number,
  subjectSlug = '',
): TraqueCard {
  const status = gaugeStatus(gauge, nowMs)
  const enChasse = isEnChasse(boss.id, dayKey)
  const rank = rankOf(gauge.victories)
  // Une fenêtre expirée laisse la jauge pleine à l'écran : le boss est reparti,
  // la jauge repart de la moitié (la base l'écrit à la prochaine lecture).
  const points = status === 'expire' ? TRAQUE_APRES_DEFAITE : gauge.points
  return {
    boss,
    subject,
    subjectSlug,
    status,
    points,
    ratio: gaugeRatio(points),
    percent: gaugePercent(points),
    rank,
    attempts: status === 'debusque' ? gauge.attempts : 0,
    enChasse,
    backOn: nextChasseDay(boss.id, dayKey),
    remainingMs: remainingMs(gauge, nowMs),
    endsAt: status === 'debusque' ? windowEndMs(gauge) : null,
    hint:
      status === 'debusque'
        ? `Il disparaît dans ${countdownLabel(remainingMs(gauge, nowMs))}`
        : teaseLabel(boss.name, points),
    gems: gemsForVictory(rank, enChasse, boss.id === NOX_BOSS_ID),
  }
}

/**
 * L'ordre de la feuille : ce qui se joue MAINTENANT d'abord (boss sortis), puis
 * les jauges les plus avancées, puis les boss en chasse du jour. Un élève doit
 * voir en haut de l'écran ce qu'il peut faire tout de suite.
 */
export function sortCards(cards: readonly TraqueCard[]): TraqueCard[] {
  const weight = (c: TraqueCard) => (c.status === 'debusque' ? 0 : 1)
  return [...cards].sort(
    (a, b) =>
      weight(a) - weight(b) ||
      b.ratio - a.ratio ||
      Number(b.enChasse) - Number(a.enChasse) ||
      a.boss.name.localeCompare(b.boss.name, 'fr'),
  )
}

/** Combien de boss sont sortis et attendent — la pastille de la tuile Boss. */
export function readyCount(cards: readonly TraqueCard[]): number {
  return cards.filter((c) => c.status === 'debusque').length
}

/** La carte à mettre en avant dans le message éclair et sur l'île. */
export function featuredCard(cards: readonly TraqueCard[]): TraqueCard | null {
  const ready = cards.filter((c) => c.status === 'debusque')
  if (ready.length === 0) return null
  // Le plus pressé d'abord : celui dont la fenêtre se referme le plus tôt.
  return [...ready].sort((a, b) => a.remainingMs - b.remainingMs)[0]
}

/** Normalise une ligne `boss_gauges` lue en base. */
export function normalizeGauge(raw: unknown): TraqueGauge | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  const bossId = typeof o.boss_id === 'string' ? o.boss_id : ''
  if (!bossId) return null
  const chapters = Array.isArray(o.chapters)
    ? o.chapters.filter((c): c is string => typeof c === 'string' && c.length > 0)
    : []
  return {
    bossId,
    points: clampInt(o.points),
    chapters: poolChapters(chapters, TRAQUE_CHAPTERS_KEPT),
    victories: clampInt(o.victories),
    attempts: clampInt(o.attempts),
    debusqueAt: typeof o.debusque_at === 'string' ? o.debusque_at : null,
  }
}
