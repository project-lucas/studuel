// -----------------------------------------------------------------------------
// « Saison » — le rythme mensuel de l'app, et son modèle économique.
//
// Pourquoi : un jeu ne vit pas de features, il vit d'un CALENDRIER. L'élève
// revient parce qu'il sait qu'il y a une piste à finir avant la fin du mois, et
// qu'elle repart à zéro ensuite. C'est ce qui manque le plus à Studuel : rien
// aujourd'hui ne donne de date limite.
//
// Modèle assumé — « free to learn, pay to flex » :
//   · TOUT le savoir reste gratuit. Aucun chapitre, aucun quiz, aucune fiche
//     derrière un mur. Bloquer l'apprentissage casse la confiance ET l'entonnoir.
//   · Ce qui se paie, c'est la VOIE PRESTIGE de la piste : des titres, des
//     gemmes, du prestige. Rien qui aide à réviser, tout ce qui se montre.
//   · La voie gratuite paie déjà à chaque palier : un élève non payant progresse
//     et reçoit. Le Pass double la piste, il ne la déverrouille pas.
//
// Aucun cron : la saison est DÉRIVÉE du calendrier (un mois = une saison) et son
// thème d'une rotation déterministe. Serveur et client voient la même chose sans
// job planifié — la raison n°1 pour laquelle les « saisons » n'existaient pas.
//
// Pur et testable ; la migration 207 ne fait que compter et verser.
// -----------------------------------------------------------------------------

// --- Identité d'une saison -------------------------------------------------------

/** Clé de saison : 'YYYY-MM' (mois calendaire UTC). */
export function seasonKey(day: string): string {
  return /^\d{4}-\d{2}-\d{2}$/.test(day) ? day.slice(0, 7) : day
}

/** Premier et dernier jour de la saison (clés UTC inclusives). */
export function seasonBounds(key: string): { start: string; end: string } {
  const [y, m] = key.split('-').map(Number)
  if (!Number.isFinite(y) || !Number.isFinite(m)) return { start: key, end: key }
  const start = `${key}-01`
  // Le 0e jour du mois suivant = le dernier du mois courant (gère février).
  const last = new Date(Date.UTC(y, m, 0)).getUTCDate()
  return { start, end: `${key}-${String(last).padStart(2, '0')}` }
}

/** Jours restants avant la fin de la saison, aujourd'hui compris. */
export function daysLeftInSeason(today: string): number {
  const { end } = seasonBounds(seasonKey(today))
  const a = Date.parse(`${today}T00:00:00Z`)
  const b = Date.parse(`${end}T00:00:00Z`)
  if (Number.isNaN(a) || Number.isNaN(b)) return 1
  return Math.max(1, Math.round((b - a) / 86_400_000) + 1)
}

export type Season = {
  key: string
  /** Numéro affiché (« Saison 7 ») — croissant et stable dans le temps. */
  number: number
  name: string
  /** Une ligne d'ambiance, affichée sous le titre. */
  tagline: string
}

// Thèmes en rotation. Aucun n'est daté : ils tournent sur le numéro de saison,
// donc la liste peut s'allonger sans jamais casser l'historique.
const THEMES: readonly { name: string; tagline: string }[] = [
  { name: 'Rentrée des Braves', tagline: 'Le premier duel donne le ton de l’année.' },
  { name: 'Forge d’Hiver', tagline: 'On forge les bases quand il fait froid.' },
  { name: 'Marée Haute', tagline: 'Monte avec ton clan ou reste sur la plage.' },
  { name: 'Éclipse', tagline: 'Les chapitres sombres se révèlent.' },
  { name: 'Grand Tournoi', tagline: 'Toutes les écoles sur la même ligne.' },
  { name: 'Cap sur le Bac', tagline: 'La ligne d’arrivée se voit d’ici.' },
]

/** Origine de la numérotation des saisons : la saison 1 est celle de ce mois-là.
 *  Figée en dur car elle doit être IDENTIQUE côté SQL (migration 207) — un
 *  décalage donnerait deux numéros pour la même saison. */
export const SEASON_ORIGIN = '2026-07'

function monthsSinceOrigin(key: string): number {
  const [y, m] = key.split('-').map(Number)
  const [oy, om] = SEASON_ORIGIN.split('-').map(Number)
  if (![y, m, oy, om].every(Number.isFinite)) return 0
  return Math.max(0, (y - oy) * 12 + (m - om))
}

export function seasonFor(day: string): Season {
  const key = seasonKey(day)
  const n = monthsSinceOrigin(key)
  const theme = THEMES[n % THEMES.length]
  return { key, number: n + 1, name: theme.name, tagline: theme.tagline }
}

// --- Les couronnes de saison ------------------------------------------------------
// La monnaie de progression de la piste. Elle ne s'achète pas et ne se dépense
// pas : elle ne fait qu'avancer. C'est la seule monnaie de l'app qui soit un
// COMPTEUR, pas un porte-monnaie — d'où son nom distinct.

export type CrownEvent =
  | 'duel_play'
  | 'duel_win'
  | 'quest_done'
  | 'quest_day'
  | 'session_prepa'
  | 'clan_week'

export const CROWNS: Record<CrownEvent, number> = {
  duel_play: 10, // jouer suffit à avancer : la piste récompense la présence
  duel_win: 15, // (en plus de duel_play)
  quest_done: 20,
  quest_day: 50,
  session_prepa: 30, // le plus rentable : c'est l'activité la plus UTILE
  clan_week: 100,
}

export function crownsFor(event: CrownEvent): number {
  return CROWNS[event] ?? 0
}

/** Plafond quotidien de couronnes. Sans lui, une journée de bourrage finit la
 *  piste et vide la saison de son enjeu : elle doit se jouer sur le MOIS. */
export const DAILY_CROWN_CAP = 250

export function cappedCrowns(alreadyToday: number, gain: number): number {
  const done = Math.max(0, Math.round(alreadyToday))
  return Math.min(Math.max(0, DAILY_CROWN_CAP - done), Math.max(0, Math.round(gain)))
}

// --- La piste de récompenses --------------------------------------------------------

export const TIER_COUNT = 30

/** Couronnes nécessaires pour ATTEINDRE un palier (1-indexé). Courbe linéaire
 *  assumée : une courbe accélérante décroche les élèves moyens en milieu de
 *  mois, et c'est précisément eux qu'on veut garder. */
export const CROWNS_PER_TIER = 220

export function crownsForTier(tier: number): number {
  return Math.max(0, Math.round(tier) - 1) * CROWNS_PER_TIER
}

/** Palier atteint avec ce total de couronnes (1..TIER_COUNT). */
export function tierFor(crowns: number): number {
  const c = Number.isFinite(crowns) ? Math.max(0, crowns) : 0
  return Math.min(TIER_COUNT, Math.floor(c / CROWNS_PER_TIER) + 1)
}

/** Avancement DANS le palier courant (0..1). À 1, la piste est terminée. */
export function tierProgress(crowns: number): number {
  const c = Number.isFinite(crowns) ? Math.max(0, crowns) : 0
  if (tierFor(c) >= TIER_COUNT) return 1
  return (c % CROWNS_PER_TIER) / CROWNS_PER_TIER
}

/** Couronnes restantes avant le palier suivant (0 si la piste est finie). */
export function crownsToNextTier(crowns: number): number {
  const c = Number.isFinite(crowns) ? Math.max(0, crowns) : 0
  if (tierFor(c) >= TIER_COUNT) return 0
  return CROWNS_PER_TIER - (c % CROWNS_PER_TIER)
}

export type Lane = 'libre' | 'prestige'

export type RewardKind = 'gemmes' | 'xp' | 'titre'

export type Reward = {
  kind: RewardKind
  amount: number
  /** Pour un titre : son libellé, qui EST la récompense. */
  title?: string
}

// Titres de la voie prestige : du pur texte, donc zéro visuel à produire et
// zéro contenu pédagogique retenu en otage. C'est exactement le genre de
// récompense qu'on peut faire payer sans mauvaise conscience.
const TITLES: readonly string[] = [
  'Recrue',
  'Assidu·e',
  'Tête chercheuse',
  'Métronome',
  'Sans faute',
  'Bourreau de travail',
  'Légende de l’arène',
]

/**
 * La récompense d'un palier, par voie.
 *
 * Voie LIBRE : quelque chose à CHAQUE palier. Un élève non payant qui voit dix
 * cases vides d'affilée comprend qu'il n'est pas le bienvenu — c'est le défaut
 * classique des pass, et c'est ce qui fait fuir la majorité gratuite.
 * Voie PRESTIGE : plus généreuse, et seule à donner les titres.
 */
export function rewardFor(tier: number, lane: Lane): Reward {
  const t = Math.max(1, Math.min(TIER_COUNT, Math.round(tier)))
  if (lane === 'libre') {
    // Un palier sur cinq paie double : la piste doit avoir des sommets.
    return { kind: 'gemmes', amount: t % 5 === 0 ? 15 : 5 }
  }
  // Prestige : un titre tous les 5 paliers, des gemmes sinon.
  if (t % 5 === 0) {
    const index = Math.min(TITLES.length - 1, t / 5 - 1)
    return { kind: 'titre', amount: 1, title: TITLES[index] }
  }
  return { kind: 'gemmes', amount: 20 }
}

export type TierView = {
  tier: number
  crowns: number
  reached: boolean
  libre: Reward
  prestige: Reward
  libreClaimed: boolean
  prestigeClaimed: boolean
  /** Réclamable maintenant (atteint, pas encore pris, voie accessible). */
  libreClaimable: boolean
  prestigeClaimable: boolean
}

/** L'état complet de la piste, prêt à afficher. `claimed` contient des clés
 *  « <voie>:<palier> » (ex. 'libre:3') — le format écrit en base. */
export function trackView(
  crowns: number,
  claimed: ReadonlySet<string>,
  hasPass: boolean,
): TierView[] {
  const current = tierFor(crowns)
  const views: TierView[] = []
  for (let t = 1; t <= TIER_COUNT; t++) {
    const reached = t <= current
    const libreClaimed = claimed.has(`libre:${t}`)
    const prestigeClaimed = claimed.has(`prestige:${t}`)
    views.push({
      tier: t,
      crowns: crownsForTier(t),
      reached,
      libre: rewardFor(t, 'libre'),
      prestige: rewardFor(t, 'prestige'),
      libreClaimed,
      prestigeClaimed,
      libreClaimable: reached && !libreClaimed,
      prestigeClaimable: reached && hasPass && !prestigeClaimed,
    })
  }
  return views
}

export function claimableCount(views: readonly TierView[]): number {
  return views.filter((v) => v.libreClaimable || v.prestigeClaimable).length
}

/** Ce que l'élève laisserait sur la table en n'ayant pas le Pass — l'argument
 *  de vente honnête : un nombre déjà GAGNÉ, pas une promesse. */
export function lockedPrestigeCount(crowns: number, hasPass: boolean): number {
  if (hasPass) return 0
  return tierFor(crowns)
}

// --- Accroches ---------------------------------------------------------------------

export function countdownLabel(today: string): string {
  const left = daysLeftInSeason(today)
  if (left <= 1) return 'Dernier jour de la saison !'
  if (left <= 3) return `Plus que ${left} jours`
  return `${left} jours restants`
}

/** La saison se termine bientôt : la carte passe en alerte. */
export function isSeasonEndgame(today: string): boolean {
  return daysLeftInSeason(today) <= 3
}

/** Moins de 24 h avant la fin de saison (le dernier jour, en clés UTC
 *  « YYYY-MM-DD ») : le compte à rebours de l'arène passe en corail. */
export function isSeasonLastDay(today: string): boolean {
  return daysLeftInSeason(today) <= 1
}

/** Le rythme à tenir pour finir la piste avant la fin du mois. C'est
 *  l'information la plus actionnable de l'écran : « il te faut 2 duels par
 *  jour » vaut mieux que « palier 12/30 ». */
export function paceHeadline(crowns: number, today: string): string {
  const current = tierFor(crowns)
  if (current >= TIER_COUNT) return 'Piste terminée — chapeau.'
  const missing = crownsForTier(TIER_COUNT) - Math.max(0, crowns)
  const days = daysLeftInSeason(today)
  const perDay = Math.ceil(missing / days)
  if (perDay > DAILY_CROWN_CAP) {
    return `Palier ${current}/${TIER_COUNT} — la piste complète n’est plus atteignable, vise le palier suivant.`
  }
  // Le duel est l'unité de référence : c'est la boucle qu'on veut faire jouer.
  const duels = Math.max(1, Math.ceil(perDay / CROWNS[('duel_play' as CrownEvent)]))
  return `Palier ${current}/${TIER_COUNT} · environ ${duels} duel${
    duels > 1 ? 's' : ''
  } par jour pour tout finir`
}

// --- Normalisation de la réponse SQL ------------------------------------------------

export type SeasonState = {
  season: Season
  crowns: number
  hasPass: boolean
  claimed: Set<string>
}

const int = (v: unknown): number => {
  const n = Number(v)
  return Number.isFinite(n) ? Math.max(0, Math.round(n)) : 0
}

export function normalizeSeasonState(raw: unknown, today: string): SeasonState {
  const o = (raw ?? {}) as Record<string, unknown>
  const key = typeof o.season_key === 'string' ? o.season_key : seasonKey(today)
  const claimed = new Set<string>()
  if (Array.isArray(o.claimed)) {
    for (const c of o.claimed) {
      if (!c || typeof c !== 'object') continue
      const r = c as Record<string, unknown>
      const lane = r.lane === 'prestige' ? 'prestige' : 'libre'
      const tier = int(r.tier)
      if (tier > 0) claimed.add(`${lane}:${tier}`)
    }
  }
  return {
    season: seasonFor(`${key}-01`),
    crowns: int(o.crowns),
    hasPass: o.has_pass === true,
    claimed,
  }
}
