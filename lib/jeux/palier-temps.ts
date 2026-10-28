// -----------------------------------------------------------------------------
// LA BARRE DE RAPIDITÉ D'UN PALIER (26/10/2026, migration 603).
//
// Lucas : « rappeler le précédent record de temps sur ce palier et une barre
// horizontale qui montrerait où il se situe sur l'ensemble des users ; chaque
// palier atteint (top 50 %, top 30, top 15, top 5 %…) serait du gain d'XP ; ne
// montre pas tous les paliers, ça surchargerait la barre, mais inciter à battre
// chaque précédent record de temps ».
//
// Logique PURE : la base fournit une place (rang, total) et les caps déjà payés
// (`palier_temps_etat` / `palier_temps_enregistrer`), ce module en déduit ce
// que la barre dessine — où se pose le curseur, quels crans sont pris, quel est
// le prochain cap et ce qu'il paie. Le VERSEMENT est au serveur (603) ; les
// règles de franchissement ici en sont le miroir, pour que l'écran ne promette
// jamais un cap que le serveur ne paierait pas.
//
// La phrase du classement (« Top 5 % des joueurs », « 3e sur 12 joueurs »)
// reste celle de lib/jeux/palier-standing, avec ses règles d'honnêteté.
// -----------------------------------------------------------------------------
import {
  COHORTE_MIN_SEUILS_TEMPS,
  SEUILS_TEMPS,
  xpSeuilTemps,
  type SeuilTemps,
} from '@/lib/economie'
import { COHORT_MIN, ordinal } from '@/lib/percentile'

/** Un cap de rapidité : la part de tête à atteindre, et ce qu'elle paie. */
export type Cap = { pct: SeuilTemps; xp: number }

/** Les cinq caps, du plus large au plus serré. */
export const CAPS: readonly Cap[] = SEUILS_TEMPS.map((pct) => ({ pct, xp: xpSeuilTemps(pct) }))

/**
 * Les crans DESSINÉS sur la barre — trois, pas cinq (« ne montre pas tous les
 * paliers, ça surchargerait la barre ») : le premier, le milieu, le sommet.
 * Les deux autres (30 %, 5 %) se disent par « Prochain cap ».
 */
export const CRANS_BARRE: readonly SeuilTemps[] = [50, 15, 1]

/** Ma part de tête, rang / total dans ]0, 1] ; null si la place est illisible. */
export function partDeTete(rank: number, total: number): number | null {
  if (!Number.isFinite(rank) || !Number.isFinite(total)) return null
  if (total < 1 || rank < 1 || rank > total) return null
  return rank / total
}

/**
 * Vrai si la place franchit ce cap. En ENTIERS, comme la 603 (rang × 100 ≤
 * cap × total) — pas de virgule flottante qui dirait « 15,0000001 % ». Et
 * jamais sous dix joueurs classés : un « top 1 % » de cinq joueurs n'existe pas.
 */
export function capFranchi(rank: number, total: number, pct: number): boolean {
  if (partDeTete(rank, total) === null) return false
  if (total < COHORTE_MIN_SEUILS_TEMPS) return false
  return rank * 100 <= pct * total
}

/**
 * La phrase de la barre : « Top 15 % des joueurs » = le cap le plus serré que
 * la place FRANCHIT — la même grille que les crans, pas les bandes de
 * lib/percentile, pour que la barre et sa phrase disent la même chose. Sous
 * cent joueurs classés (COHORT_MIN), ou sans cap franchi, le rang brut :
 * « 3e sur 12 joueurs » est vrai à toute taille.
 */
export function phrasePlace(place: { rank: number; total: number } | null | undefined): string | null {
  if (!place || partDeTete(place.rank, place.total) === null) return null
  const caps = place.total >= COHORT_MIN ? capsFranchis(place.rank, place.total) : []
  const meilleur = caps.at(-1)
  if (meilleur !== undefined) return `Top ${meilleur} % des joueurs`
  return `${ordinal(place.rank)} sur ${place.total} joueurs`
}

/** Les caps que cette place franchit, du plus large au plus serré. */
export function capsFranchis(rank: number, total: number): SeuilTemps[] {
  return SEUILS_TEMPS.filter((pct) => capFranchi(rank, total, pct))
}

/**
 * Le prochain cap à viser : le plus large qui ne soit pas franchi. Pas encore
 * classé → le premier (top 50 %). Tout franchi → null.
 */
export function prochainCap(rank: number | null, total: number | null): Cap | null {
  if (rank === null || total === null || partDeTete(rank, total) === null) return CAPS[0]
  return CAPS.find((c) => !capFranchi(rank, total, c.pct)) ?? null
}

/** L'XP de base de ces caps (chacun compté une fois, les inconnus ignorés). */
export function xpDesCaps(pcts: readonly number[]): number {
  return parseCaps(pcts).reduce((s, pct) => s + xpSeuilTemps(pct), 0)
}

/**
 * Où se pose le curseur, de 0 (dernier) à 1 (top 1 %). ÉCHELLE LOGARITHMIQUE :
 * 100 % → 0, 10 % → ½, 1 % → 1. Sur une échelle linéaire, tout ce qui
 * intéresse (les derniers pourcents, les plus durs) tiendrait dans le dernier
 * centimètre ; ici le top 50 % est à 15 %, le top 15 % à 41 %, le top 5 % à
 * 65 %, le top 1 % au bout — chaque cap a sa place, et le curseur avance
 * visiblement à chaque record.
 */
export function positionBarre(part: number): number {
  if (!(part > 0)) return 0
  return Math.min(1, Math.max(0, Math.log10(1 / part) / 2))
}

/** La position d'un cran (« top 15 % ») sur la même échelle. */
export function positionCran(pct: number): number {
  return positionBarre(pct / 100)
}

/** Ce que la base rend (`seuils`) → des caps connus, dédoublonnés, du plus large au plus serré. */
export function parseCaps(raw: unknown): SeuilTemps[] {
  if (!Array.isArray(raw)) return []
  const connus = new Set<number>(SEUILS_TEMPS)
  const vus = new Set<SeuilTemps>()
  for (const v of raw) {
    const n = Number(v)
    if (connus.has(n)) vus.add(n as SeuilTemps)
  }
  return SEUILS_TEMPS.filter((pct) => vus.has(pct))
}

/** Un cran dessiné : sa part, sa position sur la barre, s'il est pris. */
export type CranBarre = { pct: SeuilTemps; at: number; atteint: boolean }

export type BarreTempsEtat = {
  /** 0..1, où se pose le curseur ; null tant qu'on n'est pas classé. */
  position: number | null
  crans: readonly CranBarre[]
  /** Le cap à viser, ou null quand le top 1 % est pris. */
  prochain: Cap | null
  /** Les caps acquis : payés par le serveur, ou déduits de la place (les deux comptent). */
  atteints: readonly SeuilTemps[]
}

/**
 * Tout ce que dessine la barre, pour une place (ou aucune). Les caps « payés »
 * viennent du serveur (603) ; les caps « franchis » se déduisent de la place —
 * un cap payé jadis reste pris même si la place a reculé depuis.
 */
export function barreTemps(
  place: { rank: number; total: number; seuils?: readonly number[] } | null | undefined,
): BarreTempsEtat {
  const part = place ? partDeTete(place.rank, place.total) : null
  const atteints = new Set<SeuilTemps>(place ? parseCaps(place.seuils ?? []) : [])
  if (place && part !== null) for (const pct of capsFranchis(place.rank, place.total)) atteints.add(pct)
  const acquis = SEUILS_TEMPS.filter((pct) => atteints.has(pct))
  return {
    position: part === null ? null : positionBarre(part),
    crans: CRANS_BARRE.map((pct) => ({ pct, at: positionCran(pct), atteint: atteints.has(pct) })),
    prochain: CAPS.find((c) => !atteints.has(c.pct)) ?? null,
    atteints: acquis,
  }
}
