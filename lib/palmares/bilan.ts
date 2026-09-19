// -----------------------------------------------------------------------------
// LE BILAN D'UNE PARTIE — ce que l'écran de fin dit, et pourquoi on rejoue.
//
// La RPC `record_mode_score` (352) rend tout en un aller-retour : la dernière
// fois, le record d'avant et d'après, la place sur l'échelle de la semaine
// avant et après, et la PROCHAINE MARCHE. Ce module traduit ce JSON en verdicts
// et en phrases. Il ne calcule aucun rang lui-même : le rang vient de la base,
// qui voit tout le monde.
//
// Les règles d'honnêteté sont celles de lib/percentile : sous 100 joueurs on
// dit le rang brut (« 7e sur 23 »), vrai à toute taille ; jamais un pourcentage
// sur une poignée d'élèves.
// -----------------------------------------------------------------------------
import { cohortLabel, ordinal, standingFor, type Standing } from '@/lib/percentile'
import type { AvatarConfig } from '@/lib/avatar'
import { epreuve, formatScore, isEpreuveId, type EpreuveId } from '@/lib/palmares/epreuves'

/** Le joueur juste au-dessus de moi cette semaine : prénom, avatar, score. */
export type Marche = {
  name: string
  avatar: AvatarConfig | null
  score: number
}

export type BilanPartie = {
  mode: EpreuveId
  score: number
  plays: number
  /** Le score de la partie PRÉCÉDENTE (null à la première). */
  last: number | null
  /** Le record avant cette partie (null à la première). */
  bestBefore: number | null
  best: number
  weekKey: string
  weekBestBefore: number | null
  weekBest: number
  weekRankBefore: number | null
  weekTotalBefore: number | null
  weekRank: number
  weekTotal: number
  allRank: number
  allTotal: number
  grade: string | null
  next: Marche | null
  leader: { name: string; score: number; isMe: boolean } | null
}

function num(value: unknown): number | null {
  if (value === null || value === undefined) return null
  const n = Number(value)
  return Number.isFinite(n) ? Math.round(n) : null
}

function marche(raw: unknown): Marche | null {
  if (!raw || typeof raw !== 'object') return null
  const r = raw as Record<string, unknown>
  const score = num(r.score)
  if (score === null) return null
  return {
    name: String(r.name ?? 'Un élève'),
    avatar:
      r.avatar && typeof r.avatar === 'object' && !Array.isArray(r.avatar)
        ? (r.avatar as AvatarConfig)
        : null,
    score,
  }
}

/**
 * Normalise ce que rend `record_mode_score`. Tolérante : la RPC peut manquer
 * (migration pas exécutée), rendre null (visiteur, score refusé) ou une forme
 * partielle. Dans tous ces cas → null, et l'écran affiche le score sans
 * bilan plutôt que d'inventer une place.
 */
export function parseBilan(raw: unknown): BilanPartie | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null
  const r = raw as Record<string, unknown>
  if (!isEpreuveId(r.mode)) return null
  const score = num(r.score)
  const best = num(r.best)
  const weekBest = num(r.week_best)
  const weekRank = num(r.week_rank)
  const weekTotal = num(r.week_total)
  const allRank = num(r.all_rank)
  const allTotal = num(r.all_total)
  if (
    score === null ||
    best === null ||
    weekBest === null ||
    weekRank === null ||
    weekTotal === null ||
    allRank === null ||
    allTotal === null
  ) {
    return null
  }
  const leader =
    r.leader && typeof r.leader === 'object'
      ? (() => {
          const l = r.leader as Record<string, unknown>
          const s = num(l.score)
          return s === null
            ? null
            : { name: String(l.name ?? 'Un élève'), score: s, isMe: l.is_me === true }
        })()
      : null
  return {
    mode: r.mode,
    score,
    plays: num(r.plays) ?? 1,
    last: num(r.last),
    bestBefore: num(r.best_before),
    best,
    weekKey: String(r.week_key ?? ''),
    weekBestBefore: num(r.week_best_before),
    weekBest,
    weekRankBefore: num(r.week_rank_before),
    weekTotalBefore: num(r.week_total_before),
    weekRank,
    weekTotal,
    allRank,
    allTotal,
    grade: typeof r.grade === 'string' && r.grade ? r.grade : null,
    next: marche(r.next),
    leader,
  }
}

// ------------------------------------------------------------ le verdict

/**
 * Ce que vaut cette partie PAR RAPPORT À MOI. Cinq cas, dans l'ordre où on
 * les teste : première partie, record battu, mieux que la dernière fois,
 * pareil, moins bien. Le record prime sur « mieux » : battre son record est
 * forcément mieux que la dernière fois, et c'est la nouvelle qui compte.
 */
export type Verdict =
  | { kind: 'premiere' }
  | { kind: 'record'; delta: number }
  | { kind: 'mieux'; delta: number; reste: number }
  | { kind: 'pareil'; reste: number }
  | { kind: 'moins'; delta: number; reste: number }

export function verdictPartie(input: {
  score: number
  last: number | null
  bestBefore: number | null
}): Verdict {
  const { score, last, bestBefore } = input
  if (last === null || bestBefore === null) return { kind: 'premiere' }
  if (score > bestBefore) return { kind: 'record', delta: score - bestBefore }
  const reste = bestBefore - score
  if (score > last) return { kind: 'mieux', delta: score - last, reste }
  if (score === last) return { kind: 'pareil', reste }
  return { kind: 'moins', delta: last - score, reste }
}

/** Le titre de l'écran de fin, selon le verdict. */
export function titreVerdict(v: Verdict): string {
  switch (v.kind) {
    case 'premiere':
      return 'Premier score posé !'
    case 'record':
      return 'Nouveau record !'
    case 'mieux':
      return 'Mieux que la dernière fois !'
    case 'pareil':
      return 'Même score que la dernière fois'
    case 'moins':
      return 'Un cran sous la dernière fois'
  }
}

/**
 * La ligne sous le titre : le chiffre qui dit de combien, et ce qu'il reste
 * jusqu'au record — parce que « à 80 pts de ton record » est la phrase qui
 * fait appuyer sur Rejouer.
 */
export function phraseVerdict(id: EpreuveId, v: Verdict): string {
  switch (v.kind) {
    case 'premiere':
      return 'Ton record commence ici. La prochaine partie le bat, ou pas.'
    case 'record':
      return `+${formatScore(id, v.delta)} sur ton ancien record.`
    case 'mieux':
      return `+${formatScore(id, v.delta)} — encore ${formatScore(id, v.reste)} pour ton record.`
    case 'pareil':
      return v.reste > 0
        ? `Ton record est ${formatScore(id, v.reste)} plus haut.`
        : 'Tu égales ton record. Le dépasser, c’est la prochaine.'
    case 'moins':
      return `−${formatScore(id, v.delta)} — ton record tient à ${formatScore(id, v.reste)}.`
  }
}

// ------------------------------------------------------------- la jauge

/**
 * Les trois repères de la jauge de l'écran de fin, en part du plein (0..1) :
 * le score de cette partie, la dernière fois, le record. Le plein est le plus
 * haut des trois, un peu au-dessus, pour qu'un record ne colle pas au bord
 * — et qu'on voie qu'il reste de la place.
 */
export function reperesJauge(input: {
  score: number
  last: number | null
  best: number
}): { score: number; last: number | null; best: number; plein: number } {
  const plein = Math.max(1, input.score, input.last ?? 0, input.best) * 1.12
  const part = (n: number) => Math.max(0, Math.min(1, n / plein))
  return {
    score: part(input.score),
    last: input.last === null ? null : part(input.last),
    best: part(input.best),
    plein,
  }
}

// ----------------------------------------------------------- l'échelle

/** Le mouvement sur l'échelle de la semaine, entre avant et après la partie. */
export type Mouvement =
  | { kind: 'entree'; rank: number; total: number }
  | { kind: 'monte'; de: number; a: number; total: number }
  | { kind: 'stable'; rank: number; total: number }

export function mouvementEchelle(b: {
  weekRankBefore: number | null
  weekRank: number
  weekTotal: number
}): Mouvement {
  if (b.weekRankBefore === null) {
    return { kind: 'entree', rank: b.weekRank, total: b.weekTotal }
  }
  // Le rang ne peut pas descendre sur SA propre partie : le meilleur de la
  // semaine ne fait que monter. Mais d'autres ont pu jouer entre-temps, et un
  // « avant » plus haut que « après » se lit alors comme stable, pas comme
  // une chute qu'on n'a pas méritée.
  if (b.weekRank < b.weekRankBefore) {
    return { kind: 'monte', de: b.weekRankBefore, a: b.weekRank, total: b.weekTotal }
  }
  return { kind: 'stable', rank: b.weekRank, total: b.weekTotal }
}

/** « Tu entres 7e des 3e », « 12e → 7e des 3e », « Toujours 3e des 3e ». */
export function phraseMouvement(m: Mouvement, grade: string | null): string {
  const cohorte = cohortLabel(grade)
  switch (m.kind) {
    case 'entree':
      return m.rank === 1
        ? `Tu prends la tête ${cohorte} cette semaine !`
        : `Tu entres ${ordinal(m.rank)} ${cohorte} cette semaine.`
    case 'monte':
      return m.a === 1
        ? `${ordinal(m.de)} → 1er : tu prends la tête ${cohorte} !`
        : `${ordinal(m.de)} → ${ordinal(m.a)} ${cohorte} cette semaine.`
    case 'stable':
      return m.rank === 1
        ? `Toujours en tête ${cohorte} cette semaine.`
        : `Toujours ${ordinal(m.rank)} ${cohorte} cette semaine.`
  }
}

/** Le verdict de place de toujours, aux règles de lib/percentile. */
export function placeDeToujours(b: { allRank: number; allTotal: number }): Standing {
  return standingFor({ rank: b.allRank, total: b.allTotal })
}

/**
 * La PROCHAINE MARCHE : ce qu'il faut pour dépasser le joueur juste au-dessus.
 * Null quand je suis en tête — la phrase devient alors « garde ta place ».
 */
export function prochaineMarche(b: {
  mode: EpreuveId
  weekBest: number
  next: Marche | null
}): { name: string; avatar: AvatarConfig | null; cible: number; manque: number } | null {
  if (!b.next) return null
  const manque = b.next.score - b.weekBest
  if (manque <= 0) return null
  return { name: b.next.name, avatar: b.next.avatar, cible: b.next.score, manque }
}

/** « Encore 120 pts pour dépasser Léa (1 370) ». */
export function phraseMarche(
  id: EpreuveId,
  m: { name: string; cible: number; manque: number },
): string {
  return `Encore ${formatScore(id, m.manque)} pour dépasser ${m.name}`
}

/** La phrase du premier de l'échelle : ce qu'il faut viser, ou tenir. */
export function phraseSommet(
  id: EpreuveId,
  leader: { name: string; score: number; isMe: boolean } | null,
  grade: string | null,
): string | null {
  if (!leader) return null
  if (leader.isMe) return `Tu es en tête ${cohortLabel(grade)} — tiens la marche.`
  return `En tête : ${leader.name}, ${formatScore(id, leader.score)}.`
}

// -------------------------------------------------------- la remise à zéro

/**
 * Jours entiers avant le prochain lundi UTC (1..7). Lundi = 7 : l'échelle
 * vient de repartir, on a la semaine entière. `today` est une clé de jour UTC.
 */
export function joursAvantLundi(today: string): number {
  const d = new Date(`${today}T00:00:00Z`)
  const jour = d.getUTCDay() // 0 = dimanche
  const versLundi = (8 - jour) % 7
  return versLundi === 0 ? 7 : versLundi
}

/** « Remise à zéro lundi », « Plus que 2 jours », « Dernier jour ! ». */
export function phraseRemiseAZero(today: string): string {
  const j = joursAvantLundi(today)
  if (j === 1) return 'Dernier jour : l’échelle repart lundi.'
  if (j <= 3) return `Plus que ${j} jours avant la remise à zéro.`
  return 'L’échelle repart de zéro chaque lundi.'
}

/** Le nom de l'épreuve pour les titres : « Blitz 60s », etc. */
export function nomEpreuve(id: EpreuveId): string {
  return epreuve(id).nom
}
