// -----------------------------------------------------------------------------
// LES CAFÉS DE MARCEL (Lucas, 25/10/2026 : « c'est plus marrant de recharger
// Marcel avec du café qu'avec des capsules éclair ») — le mot « café » remplace
// « crédit » PARTOUT À L'ÉCRAN. Ce qui ne change pas : la règle du 24/09/2026
// (migration 378) — un abonné Studuel+ reçoit 200 cafés le 1er du mois ; une
// demande à Marcel en coûte 1, un avatar dessiné en coûte 25 ; le gratuit n'a
// pas de café (Marcel fait partie de Studuel+). Les recharges (581) sont les
// cafés achetés en euros, qui ne s'effacent pas en fin de mois.
//
// Les colonnes SQL, les RPC et les noms de tables gardent le mot « crédit »
// (`coach_credits_*`, `coach_ask_allowed`, `coach_tokens`) : seul l'élève voit
// du café. Les anciens noms de ce module (`CREDITS_MENSUELS`, `motCredits`,
// `creditsMensuels`) restent en ALIAS pour ne rien casser ailleurs.
//
// Logique PURE, miroir de la migration 378 (`coach_credits_*`,
// `coach_ask_allowed`, `avatar_ia_reserver`) : toute règle changée ici doit
// l'être là-bas, et réciproquement. Ce n'est jamais ce module qui autorise :
// c'est la base.
//
// ⚠️ Un seul barème : une demande = 1 café, quel que soit l'outil. Si Lucas
// veut un jour des outils à plusieurs cafés, `coach_ask_allowed` devra prendre
// un coût en paramètre (migration à venir) — pas seulement ce module.
// -----------------------------------------------------------------------------

import { isPremiumTier } from '../gems'
import type { Tier } from '../subscription'

export const CAFES_MENSUELS = 200
export const COUT_QUESTION = 1
export const COUT_AVATAR = 25
/** Avatars dessinés au plus par jour, cafés ou pas : une limite de facture. */
export const AVATARS_PAR_JOUR = 5

/** @deprecated le mot de l'écran est le café — alias gardé pour les autres chantiers. */
export const CREDITS_MENSUELS = CAFES_MENSUELS

/** Les cafés offerts chaque mois selon l'abonnement. */
export function cafesMensuels(tier: Tier): number {
  return isPremiumTier(tier) ? CAFES_MENSUELS : 0
}

/** @deprecated alias de `cafesMensuels`. */
export const creditsMensuels = cafesMensuels

/** Le mois des cafés : le 1er, en clé UTC `YYYY-MM-01`. */
export function debutDuMois(date: Date): string {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-01`
}

export type EtatCredits = {
  abonne: boolean
  mensuels: number
  depenses: number
  restants: number
  /** Les cafés de recharge (`coach_tokens`, achetés en euros, sans date). */
  jetons: number
  /** Combien d'avatars les cafés du mois restants paient encore. */
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
  const mensuels = cafesMensuels(tier)
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

/** « 1 café », « 174 cafés ». */
export function motCafes(n: number): string {
  const entier = Math.max(0, Math.floor(n))
  return entier === 1 ? '1 café' : `${entier} cafés`
}

/** @deprecated alias de `motCafes` : le mot de l'écran est le café. */
export const motCredits = motCafes

/**
 * Le « ratio » demandé par Lucas (25/10/2026 : « corrige le coût en café de
 * chaque outil ») tient en UNE phrase en tête des outils :
 * « Il te reste 174 cafés · une demande = 1 café ».
 */
export function phraseSoldeCafes(restants: number): string {
  return `Il te reste ${motCafes(restants)} · une demande = ${motCafes(COUT_QUESTION)}`
}

/** Ce que le gratuit lit à la place du solde. */
export const PHRASE_CAFES_GRATUIT = `Studuel+ offre ${CAFES_MENSUELS} cafés par mois`
