// -----------------------------------------------------------------------------
// MA PLACE DANS LA LIGUE, EN UNE LECTURE — et le BLASON de ma division.
//
// Depuis le 13/10/2026 (Lucas : « une seule échelle, la division, gagnée à
// l'XP de la semaine »), le rang d'un élève est sa DIVISION DE LIGUE (Bronze 4
// → Maître, lib/ligue), plus jamais une tranche de trophées (lib/rank.rankFor,
// qui ne sert plus qu'au barème des trophées par matière). Partout où l'app
// montrait « Or III » calculé sur les trophées — la plaque « Mon rang » du
// Classement de l'arène, la fiche de profil, la page de garde de Moi —, elle
// montre « Bronze 1 » lu dans `ligue_ma_place()` (migration 562).
//
// Pur : la lecture est dans lib/ligue-server, les composants ne font que dessiner.
// -----------------------------------------------------------------------------

import { echelon, type Echelon } from '@/lib/ligue'
import type { RankTier } from '@/lib/rank'

export type MaPlaceLigue = {
  /** 0 = Bronze 4 … 20 = Maître. */
  echelon: number
  /** Dans un groupe cette semaine (il faut une première XP pour y entrer). */
  inscrit: boolean
  /** Ma place dans le groupe (1 = premier) ; null hors groupe. */
  rang: number | null
  /** Les joueurs du groupe, rivaux IA compris ; null hors groupe. */
  taille: number | null
}

/**
 * Ce qu'un blason a besoin de savoir — la forme de `BadgeRank`
 * (components/defi/RankBadge) : le palier illustré, la division en pastille,
 * le libellé. La division de ligue s'écrit en chiffres arabes (« 1 »), comme
 * partout dans la ligue.
 */
export type BlasonLigue = {
  tier: RankTier
  roman: string | null
  label: string
}

/** Le blason d'un échelon : « Bronze 1 » sur le bouclier de bronze. */
export function blasonDeLigue(index: number): BlasonLigue {
  const e: Echelon = echelon(index)
  return { tier: e.rang, roman: e.division === null ? null : String(e.division), label: e.nom }
}

const entier = (v: unknown): number | null => {
  const n = typeof v === 'number' ? v : typeof v === 'string' ? Number(v) : Number.NaN
  return Number.isFinite(n) ? Math.trunc(n) : null
}

/** Relit la réponse de `ligue_ma_place()` ; null si elle n'a pas la forme attendue. */
export function lireMaPlaceLigue(raw: unknown): MaPlaceLigue | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null
  const o = raw as Record<string, unknown>
  const rang = entier(o.rang)
  const taille = entier(o.taille)
  const inscrit = o.inscrit === true && rang !== null && rang >= 1 && taille !== null && taille >= 1
  return {
    echelon: echelon(entier(o.echelon) ?? 0).index,
    inscrit,
    rang: inscrit ? rang : null,
    taille: inscrit ? taille : null,
  }
}

/** « 9e sur 30 », ou null hors groupe. */
export function libellePlace(p: MaPlaceLigue): string | null {
  if (!p.inscrit || p.rang === null || p.taille === null) return null
  return `${p.rang === 1 ? '1er' : `${p.rang}e`} sur ${p.taille}`
}
