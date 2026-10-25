// -----------------------------------------------------------------------------
// La PORTE de Marcel, et les JETONS DE PROF — la monnaie de son temps.
//
// Depuis le 24/09/2026, Marcel se paie en CRÉDITS DU MOIS (lib/coach/credits :
// 200 pour Studuel+, une question = 1) et le gratuit ne l'a plus (« pas de
// Marcel pour le gratuit : il sera plus intéressant dans le descriptif de
// Studuel+ »). Les jetons de Prof, achetés en gemmes, restent une RALLONGE pour
// l'abonné qui a tout dépensé.
//
// DEPUIS LE 25/10/2026, À L'ÉCRAN, TOUT CELA S'APPELLE DU CAFÉ (Lucas : « c'est
// plus marrant de recharger Marcel avec du café ») : les crédits du mois sont
// ses cafés du mois, les crédits de recharge ses cafés de recharge. Les noms
// du code (`credit`, `jeton`, `coach_tokens`) ne bougent pas : seuls les
// messages de ce module parlent de café.
//
// RÈGLE D'OR, écrite ici parce qu'elle est le produit :
//   les jetons achètent du TEMPS de Marcel, jamais une réponse toute faite.
//
// Le PLAFOND ABSOLU journalier reste : une limite de COÛT, que rien ne lève.
//
// DEPUIS LE 15/10/2026 (migration 581), les jetons sont les CAFÉS DE RECHARGE :
// ils s'achètent en euros (lib/coach/recharges), plus en gemmes, et ne
// s'effacent pas en fin de mois. Même solde (`coach_tokens`), même place dans
// la porte. Les fonctions « en gemmes » plus bas ne servent plus qu'à une base
// où la 581 n'est pas passée.
//
// Logique PURE. Les vrais plafonds sont décidés côté SQL (migration 378,
// `coach_ask_allowed`) : ce module en est le miroir, pour l'affichage et les
// court-circuits. Toute évolution doit toucher LES DEUX.
// -----------------------------------------------------------------------------

import type { Tier } from '../subscription'
import { CAFES_MENSUELS, COUT_QUESTION, etatCredits, motCafes } from './credits'

/**
 * Appels maximum par jour et par élève, cafés du mois et de recharge compris.
 * Ce n'est pas une limite d'usage mais une limite de facture : elle ne se lève
 * avec rien.
 */
export const PLAFOND_ABSOLU = 50

/** Un pack acheté en gemmes. */
export const JETONS_PAR_PACK = 10
export const GEMMES_PAR_PACK = 5

/** D'où vient l'autorisation d'un appel. */
export type SourceAppel = 'credit' | 'jeton' | 'plafond' | 'vide' | 'abonnement'

export type EtatDemande = {
  /** Marcel peut-il répondre maintenant ? */
  possible: boolean
  source: SourceAppel
  /** Cafés du mois restants. */
  restants: number
  /** Cafés de recharge (le solde de `coach_tokens`). */
  jetons: number
  /** Ce qu'on affiche à l'élève, toujours à l'endroit (« il te reste », jamais « interdit »). */
  message: string
}

export type DemandeInput = {
  tier: Tier
  /** Appels déjà passés aujourd'hui (pour le plafond de facture). */
  utilisesAujourdhui: number
  /** Cafés du mois déjà bus. */
  depensesMois: number
  jetons: number
}

/**
 * L'état de la porte, avant tout appel réseau. Sert à l'affichage ET à
 * court-circuiter une demande dont on connaît déjà l'issue — mais ce n'est
 * jamais lui qui autorise : c'est la RPC (migration 378) qui décide.
 */
export function etatDemande(input: DemandeInput): EtatDemande {
  const credits = etatCredits({ tier: input.tier, depenses: input.depensesMois, jetons: input.jetons })
  const utilises = Math.max(0, Math.floor(input.utilisesAujourdhui || 0))
  const base = { restants: credits.restants, jetons: credits.jetons }

  if (!credits.abonne) {
    return {
      ...base,
      possible: false,
      source: 'abonnement',
      message: `Marcel fait partie de Studuel+ : ${CAFES_MENSUELS} cafés par mois pour lui poser tes questions.`,
    }
  }

  if (utilises >= PLAFOND_ABSOLU) {
    return { ...base, possible: false, source: 'plafond', message: 'Tu as beaucoup travaillé aujourd’hui. On reprend demain.' }
  }

  if (credits.restants >= COUT_QUESTION) {
    return { ...base, possible: true, source: 'credit', message: `Il te reste ${motCafes(credits.restants)} ce mois-ci.` }
  }

  if (credits.jetons > 0) {
    return {
      ...base,
      possible: true,
      source: 'jeton',
      message: `Tes cafés du mois sont bus — il te reste ${motCafes(credits.jetons)} de recharge.`,
    }
  }

  return {
    ...base,
    possible: false,
    source: 'vide',
    message: 'Marcel dort : il n’a plus de café. Ses cafés reviennent le 1er du mois.',
  }
}

/** Gemmes nécessaires pour `packs` packs de jetons. */
export function coutEnGemmes(packs: number): number {
  return Math.max(0, Math.floor(packs)) * GEMMES_PAR_PACK
}

/** Jetons obtenus pour `packs` packs. */
export function jetonsPour(packs: number): number {
  return Math.max(0, Math.floor(packs)) * JETONS_PAR_PACK
}

/** L'élève peut-il s'offrir un pack ? */
export function peutAcheter(gemmes: number): boolean {
  return Math.floor(gemmes) >= GEMMES_PAR_PACK
}

/** « Il te manque 2 gemmes » — null quand le solde suffit. */
export function manqueGemmes(gemmes: number): string | null {
  const manque = GEMMES_PAR_PACK - Math.max(0, Math.floor(gemmes))
  if (manque <= 0) return null
  return manque === 1 ? 'Il te manque 1 gemme' : `Il te manque ${manque} gemmes`
}
