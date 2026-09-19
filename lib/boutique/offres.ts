// -----------------------------------------------------------------------------
// LE MARCHÉ — les boosts de la Boutique, payés en GEMMES.
//
// Lucas, 18/09/2026 : « personne n'achète des gels de série ou des gemmes ×2,
// il faut des consommables très utiles et pas chers ». La section « Boost »
// est devenue le « Marché » : une vitrine FIXE (elle ne tourne plus chaque
// lundi) de deux consommables, chacun avec un EFFET RÉEL côté serveur :
//   · Boost XP — toute XP versée compte double jusqu'à `double_xp_jusqua`
//                (mécanique de la migration 368, durée courte en 370), UN
//                achat par jour UTC (migration 373) ;
//   · Bouclier — la PROCHAINE défaite qui aurait coûté des trophées n'en coûte
//                aucun (migration 371). Un bouclier à la fois, en réserve
//                (`boucliers_trophees`), consommé par `apply_game_trophies` au
//                moment du verdict : le client n'annonce que victoire ou
//                défaite. Il remplace le boost « Trophées ×2 » (Lucas,
//                18/09/2026 : « un bouclier qui protège la perte de trophées
//                une fois »).
// Le troisième bloc du Marché, « Fiche de révision », n'est qu'un lien vers le
// choix de la matière (components/boutique/Marche.tsx) : rien ici.
//
// Les anciens boosts (double XP 24 h / 3 j, gels, gemmes ×2, trophées ×2)
// restent en base pour ceux déjà achetés, mais ne sont plus vendus.
//
// Le prix affiché vient d'ici ; le prix DÉBITÉ vient de la table
// `boutique_offres`, lue par la RPC `acheter_offre` — jamais du client. Les deux
// doivent rester alignés (un test relit les migrations 370 et 371).
//
// Pur et testable : aucune lecture de base ici (voir boosts-server.ts).
// -----------------------------------------------------------------------------

export type KindOffre = 'double_xp' | 'bouclier_trophees'

export type IdOffre = 'double-xp-2h' | 'bouclier-trophees'

/** Un bouclier à la fois en réserve (miroir du CHECK de la migration 371). */
export const MAX_BOUCLIERS = 1

export type Offre = {
  id: IdOffre
  kind: KindOffre
  /** Le nom court, sur la carte du Marché (« Boost XP »). */
  nom: string
  /** Le titre complet, dans la feuille d'achat (« Boost XP · 2 h »). */
  titre: string
  description: string
  prixGemmes: number
  /** La durée en heures (boost XP), le nombre de boucliers ajoutés (bouclier). */
  valeur: number
  emoji: string
}

// Prix PROVISOIRES (à fixer par Lucas) — miroir des seeds des migrations 370
// (boost XP) et 371 (bouclier).
// Moins d'une journée de quêtes (un élève actif gagne 25 à 40 gemmes par jour) :
// un boost se lance sur un coup de tête, avant une séance.
export const OFFRES: readonly Offre[] = [
  {
    id: 'double-xp-2h',
    kind: 'double_xp',
    nom: 'Boost XP',
    titre: 'Boost XP · 2 h',
    description: 'Toute l’XP gagnée compte double pendant 2 heures : lance-le juste avant de réviser.',
    prixGemmes: 20,
    valeur: 2,
    emoji: '⚡',
  },
  {
    id: 'bouclier-trophees',
    kind: 'bouclier_trophees',
    // « (PVP) » dans le nom (Lucas, 19/09/2026) : on lit tout de suite qu'il
    // protège les trophées des DUELS, pas une série ni des gemmes.
    nom: 'Bouclier (PVP)',
    titre: 'Bouclier (PVP)',
    description:
      'Ta prochaine défaite ne te coûte aucun trophée, en duel classé comme au salon. Il attend en réserve, et ne s’use pas sur une partie où tu n’avais rien à perdre.',
    prixGemmes: 25,
    valeur: 1,
    emoji: '🛡️',
  },
]

/** L'étiquette de l'écrin d'une carte du Marché : « ×2 · 2 h », « 1 fois ». */
export function etiquetteOffre(offre: Offre): string {
  return offre.kind === 'double_xp' ? `×2 · ${offre.valeur} h` : `${offre.valeur} fois`
}

/** L'offre de cet id, si elle est au Marché. */
export function offreDuMarche(id: string): Offre | null {
  return OFFRES.find((o) => o.id === id) ?? null
}

const MINUTE_MS = 60_000

/** « 3 j 4 h », « 1 h 12 min », « 12 min », « Terminé ». */
export function libelleCompteARebours(fin: Date, maintenant: Date): string {
  const reste = fin.getTime() - maintenant.getTime()
  if (!Number.isFinite(reste) || reste <= 0) return 'Terminé'
  const minutes = Math.floor(reste / MINUTE_MS)
  const jours = Math.floor(minutes / 1440)
  const heures = Math.floor((minutes % 1440) / 60)
  const min = minutes % 60
  if (jours > 0) return heures > 0 ? `${jours} j ${heures} h` : `${jours} j`
  if (heures > 0) return min > 0 ? `${heures} h ${min} min` : `${heures} h`
  // Moins d'une minute : « 1 min », jamais « 0 min » tant que ça court.
  return `${Math.max(1, min)} min`
}

// --- Les boosts de l'élève ---------------------------------------------------

export type BoostsActifs = {
  doubleXpJusqua: string | null
  /**
   * L'instant du DERNIER achat d'un Boost XP (journal `boutique_achats`), ou
   * null. Un Boost XP par jour (Lucas, 19/09/2026 : « boost exp dispo 1 fois
   * par jour ») : c'est lui qui dit si celui du jour est déjà parti.
   */
  doubleXpAcheteLe: string | null
  /** Boucliers de trophées en réserve (0 ou 1). */
  boucliers: number
}

export const AUCUN_BOOST: BoostsActifs = {
  doubleXpJusqua: null,
  doubleXpAcheteLe: null,
  boucliers: 0,
}

function instantLisible(v: unknown): string | null {
  return typeof v === 'string' && Number.isFinite(Date.parse(v)) ? v : null
}

/** Ligne `user_wallet` (colonnes 368 et 371) → boosts sûrs. Ligne absente ou
 *  illisible → AUCUN_BOOST : un boost inventé serait une promesse fausse.
 *  Colonne 371 absente (migration pas encore exécutée) → aucun bouclier, le
 *  boost XP reste lu. `acheteLe` : l'instant du dernier Boost XP acheté, lu à
 *  part dans le journal des achats. */
export function normaliserBoosts(row: unknown, acheteLe: unknown = null): BoostsActifs {
  if (!row || typeof row !== 'object') {
    const achat = instantLisible(acheteLe)
    return achat === null ? AUCUN_BOOST : { ...AUCUN_BOOST, doubleXpAcheteLe: achat }
  }
  const r = row as Record<string, unknown>
  const boucliers = Number(r.boucliers_trophees)
  return {
    doubleXpJusqua: instantLisible(r.double_xp_jusqua),
    doubleXpAcheteLe: instantLisible(acheteLe),
    boucliers: Number.isFinite(boucliers)
      ? Math.min(MAX_BOUCLIERS, Math.max(0, Math.floor(boucliers)))
      : 0,
  }
}

/**
 * La fin du Boost XP qui COURT, ou null s'il n'y en a pas. Sert au Marché
 * comme au bandeau du haut, qui affiche « ×2 XP » tant qu'il court.
 */
export function finBoostXp(doubleXpJusqua: string | null, maintenant: Date): Date | null {
  if (doubleXpJusqua === null) return null
  const finMs = Date.parse(doubleXpJusqua)
  return Number.isFinite(finMs) && finMs > maintenant.getTime() ? new Date(finMs) : null
}

/**
 * Vrai si le Boost XP du jour est déjà parti : un achat le même JOUR UTC que
 * `maintenant` (les jours de l'app sont des clés UTC, lib/time). Miroir du
 * refus `deja_aujourdhui` de `acheter_offre` (migration 373).
 */
export function boostXpDejaAchete(doubleXpAcheteLe: string | null, maintenant: Date): boolean {
  if (doubleXpAcheteLe === null) return false
  const achat = Date.parse(doubleXpAcheteLe)
  if (!Number.isFinite(achat)) return false
  return new Date(achat).toISOString().slice(0, 10) === maintenant.toISOString().slice(0, 10)
}

// --- L'état d'une carte du Marché --------------------------------------------

export type EtatOffre =
  | { kind: 'active'; libelle: string; reste: string }
  | { kind: 'en-reserve' }
  | { kind: 'demain' }
  | { kind: 'achetable' }
  | { kind: 'trop-chere'; manque: number }

/**
 * Ce que la carte d'une offre doit dire. Miroir des refus de `acheter_offre` :
 *   · un boost XP déjà en cours se lit « actif » et ne se rachète pas (la RPC
 *     répond `deja_actif`) ;
 *   · un boost XP déjà acheté AUJOURD'HUI, et fini, se lit « demain » (la RPC
 *     répond `deja_aujourdhui`) : un par jour ;
 *   · un bouclier déjà en réserve se lit « en réserve » et ne se rachète pas
 *     (la RPC répond `plein`) — ces états passent AVANT le prix ;
 *   · sinon, achetable si le solde couvre le prix, « trop chère » sinon.
 */
export function etatOffre(
  offre: Offre,
  boosts: BoostsActifs,
  gemmes: number,
  maintenant: Date,
): EtatOffre {
  if (offre.kind === 'double_xp') {
    const fin = finBoostXp(boosts.doubleXpJusqua, maintenant)
    if (fin !== null) {
      const reste = libelleCompteARebours(fin, maintenant)
      return { kind: 'active', libelle: `Actif · ${reste}`, reste }
    }
    if (boostXpDejaAchete(boosts.doubleXpAcheteLe, maintenant)) return { kind: 'demain' }
  } else if (boosts.boucliers + offre.valeur > MAX_BOUCLIERS) {
    return { kind: 'en-reserve' }
  }

  const solde = Number.isFinite(gemmes) ? Math.max(0, Math.floor(gemmes)) : 0
  if (solde < offre.prixGemmes) {
    return { kind: 'trop-chere', manque: offre.prixGemmes - solde }
  }
  return { kind: 'achetable' }
}
