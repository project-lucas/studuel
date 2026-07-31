// -----------------------------------------------------------------------------
// Les JETONS DE PROF — la monnaie du temps de Marcel.
//
// Décision du 31/07 (option A) : une TROISIÈME ressource, consommable, qui
// n'ouvre AUCUN contenu. C'est ce qui permet de donner à Lucas sa boucle
// « jouer finance apprendre, inviter finance apprendre, payer finance
// apprendre » sans casser l'invariant de `lib/gems.ts` — les gemmes ouvrent des
// chapitres à vie, or un écu convertible en gemme ouvrirait le contenu payant au
// farming. Le jeton, lui, se consomme et ne déverrouille rien.
//
// RÈGLE D'OR, écrite ici parce qu'elle est le produit :
//   les jetons achètent du TEMPS de Marcel, jamais une réponse toute faite.
//
// Deux plafonds, à ne pas confondre :
//   • le QUOTA quotidien gratuit (3, ou 30 pour un abonné) — une limite d'usage,
//     que le jeton lève ;
//   • le PLAFOND ABSOLU journalier — une limite de COÛT, que rien ne lève. Sans
//     lui, un élève assis sur 10 000 écus se paierait 10 000 appels dans la nuit.
//
// Logique PURE. Les vrais plafonds sont décidés côté SQL (migration 214) : ce
// module en est le miroir applicatif, pour l'affichage et les court-circuits.
// Toute évolution doit toucher LES DEUX.
// -----------------------------------------------------------------------------

import { isPremiumTier } from '../gems'
import type { Tier } from '../subscription'

/** Questions offertes par jour à un élève gratuit. */
export const QUOTA_GRATUIT = 3

/** Questions offertes par jour avec Studuel+ : assez pour ne plus y penser. */
export const QUOTA_PREMIUM = 30

/**
 * Appels maximum par jour et par élève, JETONS COMPRIS. Ce n'est pas une limite
 * d'usage mais une limite de facture : elle ne se lève avec rien.
 */
export const PLAFOND_ABSOLU = 50

/** Un pack acheté en gemmes. */
export const JETONS_PAR_PACK = 10
export const GEMMES_PAR_PACK = 5

/** Quota quotidien offert selon l'abonnement. */
export function quotaFor(tier: Tier): number {
  return isPremiumTier(tier) ? QUOTA_PREMIUM : QUOTA_GRATUIT
}

/** D'où vient l'autorisation d'un appel. */
export type SourceAppel = 'quota' | 'jeton' | 'plafond' | 'vide'

export type EtatDemande = {
  /** Marcel peut-il répondre maintenant ? */
  possible: boolean
  source: SourceAppel
  /** Questions gratuites restantes aujourd'hui. */
  restantes: number
  /** Solde de jetons. */
  jetons: number
  /** Ce qu'on affiche à l'élève, toujours à l'endroit (« il te reste », jamais « interdit »). */
  message: string
}

export type DemandeInput = {
  tier: Tier
  /** Appels déjà consommés aujourd'hui (quota + jetons confondus). */
  utilisesAujourdhui: number
  jetons: number
}

function motQuestions(n: number): string {
  return n === 1 ? '1 question' : `${n} questions`
}

/**
 * L'état de la porte, avant tout appel réseau. Sert à l'affichage ET à
 * court-circuiter une demande dont on connaît déjà l'issue — mais ce n'est
 * jamais lui qui autorise : c'est la RPC (migration 214) qui décide, côté
 * serveur, plafond décidé en SQL.
 */
export function etatDemande(input: DemandeInput): EtatDemande {
  const { tier, utilisesAujourdhui, jetons } = input

  const utilises = Math.max(0, Math.floor(utilisesAujourdhui))
  const solde = Math.max(0, Math.floor(jetons))
  const quota = quotaFor(tier)
  const restantes = Math.max(0, quota - utilises)

  if (utilises >= PLAFOND_ABSOLU) {
    return {
      possible: false,
      source: 'plafond',
      restantes: 0,
      jetons: solde,
      message: 'Tu as beaucoup travaillé aujourd’hui. On reprend demain.',
    }
  }

  if (restantes > 0) {
    return {
      possible: true,
      source: 'quota',
      restantes,
      jetons: solde,
      message: `Il te reste ${motQuestions(restantes)} aujourd’hui.`,
    }
  }

  if (solde > 0) {
    return {
      possible: true,
      source: 'jeton',
      restantes: 0,
      jetons: solde,
      message:
        solde === 1
          ? 'Tes questions du jour sont passées — il te reste 1 jeton.'
          : `Tes questions du jour sont passées — il te reste ${solde} jetons.`,
    }
  }

  return {
    possible: false,
    source: 'vide',
    restantes: 0,
    jetons: 0,
    message: 'Tes questions du jour sont passées. Marcel revient demain.',
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
