// -----------------------------------------------------------------------------
// LES CRÉDITS MENSUELS DE MARCEL (Lucas, 24/09/2026) — ce qui remplace le quota
// quotidien : un abonné Studuel+ reçoit 200 crédits le 1er du mois ; une
// question à Marcel en coûte 1, un avatar dessiné en coûte 25. Le gratuit n'a
// pas de crédits : Marcel fait partie de Studuel+ (« il sera plus intéressant
// dans le descriptif de Studuel+ »). Les JETONS de Prof (215), achetés en
// gemmes, restent une rallonge pour les questions d'un abonné.
//
// Logique PURE, miroir de la migration 378 (`coach_credits_*`,
// `coach_ask_allowed`, `avatar_ia_reserver`) : toute règle changée ici doit
// l'être là-bas, et réciproquement. Ce n'est jamais ce module qui autorise :
// c'est la base.
// -----------------------------------------------------------------------------

import { isPremiumTier } from '../gems'
import type { Tier } from '../subscription'

export const CREDITS_MENSUELS = 200
export const COUT_QUESTION = 1
export const COUT_AVATAR = 25
/** Avatars dessinés au plus par jour, crédits ou pas : une limite de facture. */
export const AVATARS_PAR_JOUR = 5

/** Les crédits offerts chaque mois selon l'abonnement. */
export function creditsMensuels(tier: Tier): number {
  return isPremiumTier(tier) ? CREDITS_MENSUELS : 0
}

/** Le mois des crédits : le 1er, en clé UTC `YYYY-MM-01`. */
export function debutDuMois(date: Date): string {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-01`
}

export type EtatCredits = {
  abonne: boolean
  mensuels: number
  depenses: number
  restants: number
  jetons: number
  /** Combien d'avatars les crédits restants paient encore. */
  avatarsPossibles: number
}

export function etatCredits({
  tier,
  depenses,
  jetons,
}: {
  tier: Tier
  depenses: number
  jetons: number
}): EtatCredits {
  const mensuels = creditsMensuels(tier)
  const utilises = Math.max(0, Math.floor(depenses || 0))
  const restants = Math.max(0, mensuels - utilises)
  return {
    abonne: mensuels > 0,
    mensuels,
    depenses: utilises,
    restants,
    jetons: Math.max(0, Math.floor(jetons || 0)),
    avatarsPossibles: Math.floor(restants / COUT_AVATAR),
  }
}

/** « 1 crédit », « 175 crédits ». */
export function motCredits(n: number): string {
  return n === 1 ? '1 crédit' : `${n} crédits`
}
