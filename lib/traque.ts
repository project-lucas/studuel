// -----------------------------------------------------------------------------
// « La Traque » — les boss se DÉBUSQUENT en révisant, ils ne se choisissent pas.
//
// Inspiration assumée : le Death Match de 7DS Grand Cross. Une jauge de
// rencontre monte à chaque geste de travail réel sur une matière ; à 100 % le
// gardien sort de sa tanière, un message éclair l'annonce, sa silhouette se
// pose sur l'île de l'arène — et il n'est défiable que pendant UNE HEURE.
//
// La boucle : je révise → le boss sort → je le bats → XP (gemmes avant la 557)
// du chapitre → de quoi mieux réviser. Le combat porte sur les chapitres qui
// ont rempli la jauge : il interroge littéralement ce qui vient d'être travaillé.
//
// Logique PURE et testée (convention projet). La persistance vit dans
// `lib/traque-server.ts` + `supabase/schema/212_traque_boss.sql`, qui MIROITE le
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
 * rien dire. 150 = une jauge et demie : de quoi refaire la moitié perdue sur
 * une fenêtre manquée — jamais d'avance, la jauge repart de zéro chaque nuit.
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
  /**
   * Le jour (clé UTC) du dernier crédit — `day_key`. LA JAUGE REPART DE ZÉRO
   * CHAQUE NUIT (576, Lucas : « la barre de progression se réinitialise à
   * 0h00, pas de boss rempli à l'avance ») : la base ne la remet à zéro qu'au
   * prochain crédit, le client doit donc savoir si les points lus sont ceux
   * d'aujourd'hui. Null : inconnu (ligne jamais créditée) — on fait confiance.
   */
  dayKey: string | null
}

export type TraqueStatus =
  | 'traque' // la jauge monte, le boss rôde
  | 'debusque' // il est sorti, la fenêtre court
  | 'expire' // il s'est recouché : la fenêtre est passée
  // LA RARETÉ (14/10/2026, Lucas : « comme Genshin Impact ») — un gardien ne
  // se traque que SES jours ; les autres, sa jauge ne bouge pas :
  | 'indisponible' // pas son jour : « il revient mardi »

export function emptyGauge(bossId: string): TraqueGauge {
  return {
    bossId,
    points: 0,
    chapters: [],
    victories: 0,
    attempts: 0,
    debusqueAt: null,
    dayKey: null,
  }
}

/** Fin de la fenêtre de combat (ms epoch), null si le boss n'est pas sorti. */
export function windowEndMs(gauge: TraqueGauge): number | null {
  if (!gauge.debusqueAt) return null
  const start = Date.parse(gauge.debusqueAt)
  return Number.isFinite(start) ? start + TRAQUE_FENETRE_MS : null
}

/**
 * Les points QUI COMPTENT AUJOURD'HUI. La base remet la jauge à zéro au premier
 * crédit du jour, pas à minuit : entre les deux, la ligne lue porte encore les
 * points d'hier. Une fenêtre encore ouverte (sorti à 23 h 50) garde les siens :
 * le combat, lui, ne connaît pas la nuit.
 */
export function pointsDuJour(gauge: TraqueGauge, dayKey: string, nowMs: number): number {
  const end = windowEndMs(gauge)
  if (end !== null && nowMs < end) return gauge.points
  if (gauge.dayKey === null || gauge.dayKey === dayKey) return gauge.points
  return 0
}

export function gaugeStatus(gauge: TraqueGauge, nowMs: number, dayKey?: string): TraqueStatus {
  const end = windowEndMs(gauge)
  if (end !== null && nowMs < end) return 'debusque'
  // Pas son jour : rien ne bouge, il revient tel jour (576).
  if (dayKey !== undefined && !isEnChasse(gauge.bossId, dayKey)) return 'indisponible'
  // Fenêtre passée AUJOURD'HUI : il s'est recouché, la jauge repart de la
  // moitié. Passée un autre jour, la nuit a déjà tout remis à zéro.
  if (end !== null && (dayKey === undefined || gauge.dayKey === null || gauge.dayKey === dayKey)) {
    return 'expire'
  }
  return 'traque'
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
// LA RARETÉ (14/10/2026, Lucas : « comme Genshin Impact, créer la rareté : tous
// les boss ne sont pas disponibles chaque jour, certains le lundi, d'autres le
// mardi, et le week-end chacun est disponible » ; puis « la barre de
// progression se réinitialise à 0h00, pas de boss rempli à l'avance, il doit
// travailler le jour J où le boss est dispo »). Un gardien a UN jour de
// semaine ; le week-end, tous sortent ; Nox, le dimanche seulement. SA JAUGE NE
// MONTE QUE CE JOUR-LÀ et repart de zéro chaque nuit (00:00 UTC) : on ne
// prépare pas un gardien la veille, on le traque le jour même — réviser une
// autre matière hors de son jour reste utile à tout le reste (XP, quêtes,
// maîtrise), simplement pas à sa jauge. Jusqu'au 13/10 ce calendrier n'était
// qu'un bonus ×2 d'XP. Fixe et affiché : le rituel (« le mardi c'est
// Grammatork ») vaut mieux qu'une rotation maligne et illisible. Chaque jour
// mêle des sciences et des lettres ou des langues. Miroir de `traque_en_chasse` (576).

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
  ['delta', 'imperator', 'nova'], // lundi — Maths · Latin · Enseignement scientifique
  ['grammatork', 'plasma', 'fiscus'], // mardi — Français · Physique-Chimie · Gestion
  ['chronos', 'bigben', 'sphinx'], // mercredi — Histoire-Géo (Atlas) · Anglais · Philosophie
  ['mitochondrix', 'eltoro', 'mecatron'], // jeudi — SVT (Sylvarok) · Espagnol · Technologie
  ['kaiser-fang', 'krach', 'coach-turbo', 'bugzilla'], // vendredi — Allemand · SES · Sport · NSI
  [], // samedi — rattrapage : TOUS (cf. isEnChasse)
  [], // dimanche — rattrapage : TOUS + Nox
]

/** Le week-end, tout le monde chasse : c'est le rattrapage de la semaine. */
export function isRattrapage(dayKey: string): boolean {
  return weekdayIndex(dayKey) >= 5
}

/** Ce boss est-il DISPONIBLE aujourd'hui — son jour, ou le week-end (Nox : le dimanche) ? */
export function isEnChasse(bossId: string, dayKey: string): boolean {
  if (bossId === NOX_BOSS_ID) return weekdayIndex(dayKey) === 6
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

/** « mardi » — le jour où ce boss redevient disponible. Null s'il l'est déjà. */
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

/**
 * XP d'une victoire, par rang du boss. Miroir de `traque_victoire` (576) :
 * c'étaient des gemmes (10 / 15 / 20) jusqu'au 04/10/2026, puis de l'XP doublée
 * le jour de chasse (557). Depuis la rareté du 14/10/2026 on ne combat un
 * gardien QUE ses jours : plus de ×2, l'XP est fixe — et la victoire rend des
 * GEMMES (Lucas : « eux permettent de gagner des gemmes »), les gardiens étant
 * la source de gemmes du jeu, dans un plafond hebdomadaire.
 */
export const TRAQUE_XP: Readonly<Record<BossRank, number>> = {
  1: 30,
  2: 45,
  3: 60,
}

/** Nox, le boss du dimanche : 90 XP. */
export const NOX_XP = 90

/** Les gemmes d'une victoire, par rang — miroir de `traque_victoire` (576). */
export const TRAQUE_GEMMES: Readonly<Record<BossRank, number>> = {
  1: 5,
  2: 8,
  3: 10,
}

/** Nox : 20 gemmes. */
export const NOX_GEMMES = 20

/** Plafond hebdomadaire des gemmes de la Traque (lundi UTC) — miroir de `traque_gems_week_cap` (576). */
export const TRAQUE_GEMMES_SEMAINE_MAX = 40

export function xpForVictory(rank: BossRank, isNox = false): number {
  return isNox ? NOX_XP : TRAQUE_XP[rank]
}

export function gemsForVictory(rank: BossRank, isNox = false): number {
  return isNox ? NOX_GEMMES : TRAQUE_GEMMES[rank]
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
  /** Disponible aujourd'hui : son jour, ou le week-end. */
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
  /** XP en jeu si on le bat maintenant (557). */
  xp: number
  /** Gemmes en jeu si on le bat (576). */
  gemmes: number
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
  const status = gaugeStatus(gauge, nowMs, dayKey)
  const enChasse = isEnChasse(boss.id, dayKey)
  const rank = rankOf(gauge.victories)
  // Une fenêtre expirée laisse la jauge pleine à l'écran : le boss est reparti,
  // la jauge repart de la moitié (la base l'écrit à la prochaine lecture). Un
  // gardien indisponible n'a pas de jauge aujourd'hui ; les autres jours, on
  // ne montre que les points DU JOUR (la nuit remet à zéro).
  const points =
    status === 'expire'
      ? TRAQUE_APRES_DEFAITE
      : status === 'indisponible'
        ? 0
        : pointsDuJour(gauge, dayKey, nowMs)
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
        : status === 'indisponible'
          ? `Revient ${nextChasseDay(boss.id, dayKey) ?? 'bientôt'}`
          : teaseLabel(boss.name, points),
    xp: xpForVictory(rank, boss.id === NOX_BOSS_ID),
    gemmes: gemsForVictory(rank, boss.id === NOX_BOSS_ID),
  }
}

/**
 * L'ordre de la feuille : ce qui se joue MAINTENANT d'abord (boss sortis, le
 * plus pressé en tête), puis les jauges les plus avancées, puis les boss en
 * chasse du jour. Un élève doit voir en haut de l'écran ce qu'il peut faire
 * tout de suite — Lucas, 13/10/2026 : « le premier bloc affichera le boss dont
 * l'élève est le plus proche de défier, en pourcentage, pour éviter le
 * scrolling ».
 *
 * `nowMs` : la feuille vit après son rendu serveur ; un gardien dont la fenêtre
 * s'est refermée sous les yeux de l'élève n'est plus « ce qui se joue
 * maintenant » et redescend à sa jauge.
 */
export function sortCards(cards: readonly TraqueCard[], nowMs?: number): TraqueCard[] {
  const libre = (c: TraqueCard) =>
    c.status === 'debusque' && (nowMs === undefined || c.endsAt === null || c.endsAt > nowMs)
  // Sorti d'abord, puis les gardiens du jour (jauge la plus pleine en tête),
  // et en queue ceux qui ne sont pas disponibles aujourd'hui (576).
  const weight = (c: TraqueCard) => (libre(c) ? 0 : c.status === 'indisponible' ? 2 : 1)
  // Un gardien RECOUCHÉ (fenêtre passée) affiche encore 100 %, mais sa jauge
  // « repart de la moitié » : c'est à cette moitié qu'il se range, pas devant
  // une jauge à 52 % qui, elle, est vraiment proche de sortir.
  const ratio = (c: TraqueCard) =>
    c.status === 'expire' || (c.status === 'debusque' && !libre(c))
      ? Math.min(c.ratio, TRAQUE_APRES_DEFAITE / TRAQUE_SEUIL)
      : c.ratio
  return [...cards].sort(
    (a, b) =>
      weight(a) - weight(b) ||
      (libre(a) && libre(b) ? a.remainingMs - b.remainingMs : 0) ||
      ratio(b) - ratio(a) ||
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

// ------------------------------------------------------ L'AFFICHE DU GARDIEN
//
// LE JEU VIVANT (25/10/2026, docs/CADRAGE-JEU-VIVANT.md § C) : chaque tanière
// du jour se lit comme un AVIS DE RECHERCHE — « il part dans 6 h 12 », trois
// gestes à faire avec un bouton chacun, le gain en grand. Tout ce qui se
// calcule vit ici, pur ; `BossSheet` ne fait que poser.

const JOUR_MS = 86_400_000

/**
 * La FIN DU JOUR DE TRAQUE (ms epoch) du jour `dayKey` : le prochain minuit
 * UTC. C'est la clé du jour de la 576 (`day_key`, `(now() AT TIME ZONE
 * 'utc')::date`) : c'est à cet instant que la jauge repart de zéro et que le
 * gardien du jour change — pas à minuit heure de Paris (où il reste une ou
 * deux heures de plus). Viser Paris aurait fait dire « il part dans 23 h » à
 * 0 h 30 alors qu'il part dans 1 h 30.
 */
export function finDuJourDeTraque(dayKey: string): number {
  const debut = Date.parse(`${dayKey}T00:00:00Z`)
  return Number.isFinite(debut) ? debut + JOUR_MS : Number.NaN
}

/** La fin du jour de traque EN COURS à cet instant (le client égrène depuis là). */
export function finDuJourCourant(nowMs: number): number {
  const d = new Date(nowMs)
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1)
}

/** « Il part dans 6 h 12 », « Il part dans 42 min », « Il part dans moins d'une minute », « Il est parti ». */
export function departLabel(ms: number): string {
  if (!(ms > 0)) return 'Il est parti'
  return `Il part dans ${countdownLabel(ms)}`
}

/** Un des trois gestes de l'affiche. */
export type GesteTraque = {
  cle: 'lecon' | 'quiz' | 'cartes'
  /** « Lire 1 cours ». */
  libelle: string
  /** Points nominaux du geste (barème `TRAQUE_POINTS`). */
  points: number
  /** Points du jour à atteindre pour le cocher : la somme cumulée des gestes. */
  seuil: number
  fait: boolean
  /** Où aller le faire : Réviser, filtré sur la matière. */
  href: string
}

/**
 * LES TROIS GESTES qui débusquent le gardien, dans l'ordre d'une séance :
 * lire un cours (15), finir un quiz de chapitre (25), puis réviser ce qu'il
 * reste en cartes de la file « À revoir » (4 chacune) — le dernier geste est
 * ÉLASTIQUE : son compte de cartes est ce qui manque vraiment à la jauge, il
 * descend au fil des points du jour, et la somme des trois atteint toujours
 * le seuil. Nominal, donc prudent : un quiz rapporte aussi ses bonnes
 * réponses, la jauge se remplit plutôt plus vite que l'affiche ne le promet.
 *
 * L'APPROXIMATION, assumée : la jauge ne sait pas QUEL geste a produit ses
 * points. Un geste est coché quand les points du jour atteignent sa somme
 * cumulée (15, 40, 100) — un élève qui n'a fait que des cartes voit « Lire 1
 * cours » coché. Ce que l'affiche dit alors reste vrai : « tu en es là, voilà
 * ce qu'il reste ».
 */
export function gestesPourTraquer(card: Pick<TraqueCard, 'points' | 'subjectSlug'>): GesteTraque[] {
  const points = Math.max(0, Math.floor(card.points))
  const dossier = card.subjectSlug ? `/reviser/${card.subjectSlug}` : '/reviser'
  const revoir = card.subjectSlug
    ? `/reviser/revoir?matiere=${encodeURIComponent(card.subjectSlug)}`
    : '/reviser/revoir'
  const seuilLecon = TRAQUE_POINTS.lecon
  const seuilQuiz = seuilLecon + TRAQUE_POINTS.quiz_chapitre
  // Ce qui manque après les deux premiers gestes ; une fois la jauge pleine,
  // on réécrit le compte nominal (« Réviser 15 cartes », coché), jamais zéro.
  const reste = TRAQUE_SEUIL - Math.min(Math.max(points, seuilQuiz), TRAQUE_SEUIL)
  const cartes = Math.ceil((reste > 0 ? reste : TRAQUE_SEUIL - seuilQuiz) / TRAQUE_POINTS.carte)
  return [
    {
      cle: 'lecon',
      libelle: 'Lire 1 cours',
      points: TRAQUE_POINTS.lecon,
      seuil: seuilLecon,
      fait: points >= seuilLecon,
      href: dossier,
    },
    {
      cle: 'quiz',
      libelle: 'Finir 1 quiz',
      points: TRAQUE_POINTS.quiz_chapitre,
      seuil: seuilQuiz,
      fait: points >= seuilQuiz,
      href: dossier,
    },
    {
      cle: 'cartes',
      libelle: cartes === 1 ? 'Réviser 1 carte' : `Réviser ${cartes} cartes`,
      points: cartes * TRAQUE_POINTS.carte,
      seuil: TRAQUE_SEUIL,
      fait: points >= TRAQUE_SEUIL,
      href: revoir,
    },
  ]
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
    // `day_key` arrive en DATE (« 2026-10-14 ») : la clé UTC du projet telle quelle.
    dayKey: typeof o.day_key === 'string' && o.day_key.length >= 10 ? o.day_key.slice(0, 10) : null,
  }
}
