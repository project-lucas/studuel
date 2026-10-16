// -----------------------------------------------------------------------------
// MARCEL DORT (15/10/2026, Lucas : « comme pour Claude, des recharges de
// crédit ; Marcel doit dormir, il se réveillera dans X jours s'il a atteint la
// limite, avec en boutique la possibilité de le recharger — super lors des
// périodes d'examen »).
//
// Une limite atteinte ne se dit jamais « interdit » ni « quota » : Marcel a
// beaucoup travaillé, il DORT, et il se réveille le 1er du mois (ses crédits
// reviennent) — ou tout de suite, avec une recharge. Quatre états :
//
//   • `eveille`  — il reste de quoi parler ;
//   • `fatigue`  — il reste peu (≤ 10 % des crédits du mois, sans recharge) :
//                  il bâille, on prévient AVANT le mur ;
//   • `endormi`  — plus de crédits du mois ni de recharge : il dort jusqu'au 1er ;
//   • `repos`    — le plafond de facture du jour est atteint (50 appels) : il se
//                  repose jusqu'à demain, rien ne le réveille (pas même une
//                  recharge : c'est une limite de COÛT, cf. lib/coach/jetons).
//
// Logique PURE ; la base décide (coach_ask_allowed, 378), ceci n'est que
// l'affichage. Les « jetons de Prof » de la 215 sont devenus les CRÉDITS DE
// RECHARGE : même solde (`coach_tokens.balance`), même place dans la porte.
// -----------------------------------------------------------------------------

import { MOIS_FR } from '@/lib/time'
import type { EtatDemande } from './jetons'

export type EtatMarcel = 'eveille' | 'fatigue' | 'endormi' | 'repos' | 'abonnement'

export type Sommeil = {
  etat: EtatMarcel
  /** La phrase de la bulle (« Marcel dort. »). */
  titre: string
  /** Ce qui se passe et comment le réveiller. */
  phrase: string
  /** Jours avant le réveil (0 hors sommeil). */
  joursAvantReveil: number
  /** Le jour du réveil, `YYYY-MM-DD` (UTC). */
  reveilLe: string
  /** Proposer une recharge ? (jamais au plafond du jour, jamais au gratuit) */
  recharger: boolean
}

/** Sous ce reste, Marcel « bâille » : on prévient avant le mur. */
export const SEUIL_FATIGUE = 0.1

/** Le 1er du mois suivant, en clé UTC. */
export function reveilDuMois(maintenant: Date): string {
  const y = maintenant.getUTCFullYear()
  const m = maintenant.getUTCMonth() + 1
  const annee = m === 12 ? y + 1 : y
  const mois = m === 12 ? 1 : m + 1
  return `${annee}-${String(mois).padStart(2, '0')}-01`
}

/** Jours entiers avant `cle` (arrondi au-dessus : « dans 1 jour » le 31 au soir). */
export function joursAvant(cle: string, maintenant: Date): number {
  const cible = Date.parse(`${cle}T00:00:00Z`)
  return Math.max(0, Math.ceil((cible - maintenant.getTime()) / 86_400_000))
}

/** « le 1er novembre » */
export function libelleReveil(cle: string): string {
  const [, m, j] = cle.split('-').map(Number)
  return `le ${j === 1 ? '1er' : j} ${MOIS_FR[m - 1]}`
}

function dans(jours: number): string {
  if (jours <= 0) return 'aujourd’hui'
  return jours === 1 ? 'demain' : `dans ${jours} jours`
}

export function sommeilDe(
  demande: Pick<EtatDemande, 'possible' | 'source' | 'restants' | 'jetons'>,
  mensuels: number,
  maintenant: Date,
): Sommeil {
  const reveilLe = reveilDuMois(maintenant)
  const jours = joursAvant(reveilLe, maintenant)
  const base = { joursAvantReveil: 0, reveilLe, recharger: false }

  if (demande.source === 'abonnement') {
    return {
      ...base,
      etat: 'abonnement',
      titre: 'Marcel fait partie de Studuel+.',
      phrase: 'Avec Studuel+, il connaît ton programme, tes contrôles et ton examen, et il t’explique jusqu’à ce que tu comprennes.',
    }
  }

  if (demande.source === 'plafond') {
    return {
      ...base,
      etat: 'repos',
      titre: 'Marcel se repose.',
      phrase: 'Tu as beaucoup travaillé aujourd’hui : il revient demain matin, frais.',
    }
  }

  if (!demande.possible) {
    return {
      etat: 'endormi',
      titre: 'Marcel dort.',
      phrase: `Il a répondu à toutes tes questions du mois. Il se réveille ${dans(jours)}, ${libelleReveil(reveilLe)} — ou tout de suite avec une recharge.`,
      joursAvantReveil: jours,
      reveilLe,
      recharger: true,
    }
  }

  const fatigue = demande.jetons === 0 && mensuels > 0 && demande.restants <= Math.ceil(mensuels * SEUIL_FATIGUE)
  if (fatigue) {
    return {
      ...base,
      etat: 'fatigue',
      titre: 'Marcel commence à bâiller.',
      phrase: `Encore ${demande.restants} crédit${demande.restants > 1 ? 's' : ''} avant qu’il s’endorme jusqu’au ${libelleReveil(reveilLe).replace('le ', '')}.`,
      recharger: true,
    }
  }

  return { ...base, etat: 'eveille', titre: '', phrase: '' }
}
