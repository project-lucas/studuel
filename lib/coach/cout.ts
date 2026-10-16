// -----------------------------------------------------------------------------
// CE QUE COÛTE MARCEL, ET CE QU'IL RAPPORTE (15/10/2026, Lucas : « faire
// attention à ce que cette fonctionnalité ne flingue pas ma marge »).
//
// Trois usages :
//   1. ESTIMER avant de décider (combien de crédits offrir, à quel prix vendre
//      une recharge) — `coutQuestion`, `margeAbonne` ;
//   2. MESURER après coup : chaque appel note ses jetons dans `marcel_usage`
//      (migration 581) et l'écran /admin/marcel les convertit ici en euros ;
//   3. RAPPELER la doctrine : le coût vient surtout de la SORTIE (une fiche
//      coûte trois indices), puis de ce qu'on renvoie au modèle à chaque tour.
//
// TARIFS : relevés publics de fin 2025, en dollars par million de jetons, à
// revérifier chez le fournisseur avant toute décision de prix — ils baissent
// vite. Un modèle inconnu prend le tarif le plus cher de la table : on préfère
// surestimer une facture.
//
// Logique PURE.
// -----------------------------------------------------------------------------

export type Tarif = {
  /** $ / million de jetons d'entrée (hors cache). */
  entree: number
  /** $ / million de jetons d'entrée servis depuis le cache du fournisseur. */
  entreeCache: number
  /** $ / million de jetons de sortie. */
  sortie: number
}

export const TARIFS: Record<string, Tarif> = {
  'deepseek-chat': { entree: 0.28, entreeCache: 0.028, sortie: 0.42 },
  'gpt-4o-mini': { entree: 0.15, entreeCache: 0.075, sortie: 0.6 },
  'gpt-4.1-mini': { entree: 0.4, entreeCache: 0.1, sortie: 1.6 },
}

const TARIF_PRUDENT: Tarif = { entree: 0.4, entreeCache: 0.1, sortie: 1.6 }

/** Conversion indicative. */
export const EUROS_PAR_DOLLAR = 0.92

export function tarifDe(modele: string | null | undefined): Tarif {
  return (modele && TARIFS[modele]) || TARIF_PRUDENT
}

export type Jetons = { entree: number; entreeCache?: number; sortie: number }

/** Le coût d'un appel, en euros. `entree` compte TOUS les jetons d'entrée, cache compris. */
export function coutAppel(modele: string | null | undefined, j: Jetons): number {
  const t = tarifDe(modele)
  const cache = Math.max(0, Math.min(j.entree, j.entreeCache ?? 0))
  const plein = Math.max(0, j.entree - cache)
  const dollars = (plein * t.entree + cache * t.entreeCache + Math.max(0, j.sortie) * t.sortie) / 1_000_000
  return dollars * EUROS_PAR_DOLLAR
}

/**
 * Un appel TYPE par mode, mesuré sur la consigne réelle (socle + mode + profil
 * de l'élève + deux tours de rappel) : l'entrée tourne autour de 900 jetons,
 * dont la moitié — la consigne fixe — sert depuis le cache du fournisseur.
 */
export const APPEL_TYPE: Record<'question' | 'exercice' | 'fiche' | 'flashcards', Jetons> = {
  question: { entree: 900, entreeCache: 450, sortie: 260 },
  exercice: { entree: 950, entreeCache: 450, sortie: 520 },
  fiche: { entree: 900, entreeCache: 450, sortie: 820 },
  flashcards: { entree: 900, entreeCache: 450, sortie: 900 },
}

/** Le coût d'un crédit au mélange d'usage attendu (70 % de questions). */
export function coutMoyenCredit(modele: string): number {
  const melange: [keyof typeof APPEL_TYPE, number][] = [
    ['question', 0.7],
    ['exercice', 0.15],
    ['fiche', 0.1],
    ['flashcards', 0.05],
  ]
  return melange.reduce((s, [mode, part]) => s + part * coutAppel(modele, APPEL_TYPE[mode]), 0)
}

export type Marge = {
  /** Ce qui reste de l'abonnement après TVA et frais de paiement. */
  revenuNet: number
  /** Ce que coûte l'IA si l'élève dépense tous ses crédits. */
  coutIaMax: number
  marge: number
  /** Part du revenu net que l'IA consomme au pire. */
  partIa: number
}

/**
 * La marge d'un abonné qui VIDE ses crédits (le pire cas réaliste : le plafond
 * de 50 appels par jour borne le reste). `fraisPaiement` : 0,15 pour un achat
 * dans un magasin d'applications, ~0,03 par carte en direct.
 */
export function margeAbonne({
  prixTTC,
  credits,
  coutCredit,
  tva = 0.2,
  fraisPaiement = 0.15,
}: {
  prixTTC: number
  credits: number
  coutCredit: number
  tva?: number
  fraisPaiement?: number
}): Marge {
  const ht = prixTTC / (1 + tva)
  const revenuNet = ht * (1 - fraisPaiement)
  const coutIaMax = credits * coutCredit
  return {
    revenuNet,
    coutIaMax,
    marge: revenuNet - coutIaMax,
    partIa: revenuNet > 0 ? coutIaMax / revenuNet : 1,
  }
}

/** « 0,3 c », « 2,1 c », « 1,20 € » — un coût lisible. */
export function libelleCout(euros: number): string {
  const centimes = euros * 100
  if (euros < 1) return `${centimes.toFixed(centimes < 1 ? 2 : 1).replace('.', ',')} c`
  return `${euros.toFixed(2).replace('.', ',')} €`
}
