// -----------------------------------------------------------------------------
// La PORTE de Marcel, et les JETONS DE PROF — la monnaie de son temps.
//
// Depuis le 24/09/2026, Marcel se paie en CRÉDITS DU MOIS (lib/coach/credits :
// 200 pour Studuel+, une question = 1 crédit) et le gratuit ne l'a plus
// (« pas de Marcel pour le gratuit : il sera plus intéressant dans le
// descriptif de Studuel+ »). Les jetons de Prof, achetés en gemmes, restent
// une RALLONGE pour l'abonné qui a tout dépensé.
//
// RÈGLE D'OR, écrite ici parce qu'elle est le produit :
//   les jetons achètent du TEMPS de Marcel, jamais une réponse toute faite.
//
// Le PLAFOND ABSOLU journalier reste : une limite de COÛT, que rien ne lève.
//
// Logique PURE. Les vrais plafonds sont décidés côté SQL (migration 378,
// `coach_ask_allowed`) : ce module en est le miroir, pour l'affichage et les
// court-circuits. Toute évolution doit toucher LES DEUX.
// -----------------------------------------------------------------------------

import type { Tier } from '../subscription'
import { COUT_QUESTION, etatCredits, motCredits } from './credits'

/**
 * Appels maximum par jour et par élève, crédits et jetons compris. Ce n'est
 * pas une limite d'usage mais une limite de facture : elle ne se lève avec rien.
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
  /** Crédits du mois restants. */
  restants: number
  /** Solde de jetons. */
  jetons: number
  /** Ce qu'on affiche à l'élève, toujours à l'endroit (« il te reste », jamais « interdit »). */
  message: string
}

export type DemandeInput = {
  tier: Tier
  /** Appels déjà passés aujourd'hui (pour le plafond de facture). */
  utilisesAujourdhui: number
  /** Crédits déjà dépensés ce mois-ci. */
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
      message: 'Marcel fait partie de Studuel+ : 200 crédits par mois pour lui poser tes questions.',
    }
  }

  if (utilises >= PLAFOND_ABSOLU) {
    return { ...base, possible: false, source: 'plafond', message: 'Tu as beaucoup travaillé aujourd’hui. On reprend demain.' }
  }

  if (credits.restants >= COUT_QUESTION) {
    return { ...base, possible: true, source: 'credit', message: `Il te reste ${motCredits(credits.restants)} ce mois-ci.` }
  }

  if (credits.jetons > 0) {
    return {
      ...base,
      possible: true,
      source: 'jeton',
      message:
        credits.jetons === 1
          ? 'Tes crédits du mois sont passés — il te reste 1 jeton.'
          : `Tes crédits du mois sont passés — il te reste ${credits.jetons} jetons.`,
    }
  }

  return {
    ...base,
    possible: false,
    source: 'vide',
    message: 'Tes crédits du mois sont passés. Ils reviennent le 1er du mois.',
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
