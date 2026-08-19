// LE RANG PAR MATIÈRE — logique pure, sans React ni Supabase.
//
// Chaque matière porte son propre ladder. Un élève peut être Or II en maths et
// Bronze III en histoire le même jour, et c'est le but : un rang global unique
// écrasait sept compétences en un chiffre, et ce chiffre ne disait à personne
// où aller travailler.
//
// AUCUNE NOUVELLE SOURCE DE VÉRITÉ. Le compteur d'une matière EXISTE DÉJÀ : la
// Route des trophées (migration 238) tient un compteur par couple
// (matière × jeu), et `subjectTotal` en fait la somme. Ce module ne stocke
// rien — il TRADUIT ce total en palier + division, exactement comme
// `lib/rank.ts` traduit le total global. Ajouter une table `rankings` aurait
// créé un second compteur de trophées par matière à garder synchronisé avec le
// premier ; l'app a déjà payé ce prix une fois (les deux échelles concurrentes
// documentées en tête de `lib/rank.ts`), on ne le repaie pas.
//
// DEUX DIFFÉRENCES AVEC LE RANG GLOBAL, ET DEUX SEULEMENT :
//
//   1. TROIS divisions (I-II-III) au lieu de quatre. Une matière se gravit plus
//      vite qu'un total toutes matières confondues ; quatre paliers intermédiaires
//      auraient fait de chaque montée un événement trop petit pour se voir.
//
//   2. Une ÉCHELLE PROPRE. `DIVISION_SPAN` vaut 500 côté global parce que le
//      total y est une somme de sept matières (ordre de grandeur : 10 000).
//      Une matière seule plafonne vers 2 400 (trois à quatre jeux qui se
//      stabilisent entre 500 et 800 selon le niveau — cf. `restingTrophies`).
//      Réutiliser 500 aurait enfermé tout le monde dans Bronze et Argent.
//
// Les BLASONS, eux, sont les mêmes (`RANK_TIERS`) : un élève doit reconnaître
// « Or » du premier coup d'œil, qu'il regarde son rang de maths ou son rang
// global. Deux jeux d'images auraient fabriqué deux vocabulaires pour une même
// idée.

import { RANK_TIERS, type RankTier, type RankTierId } from '@/lib/rank'
import { subjectTotals, type GameTrophyRow } from '@/lib/trophy-road'

// ------------------------------------------------------------------- l'échelle

/**
 * Trophées par division. Calé sur ce qu'une matière peut réellement peser.
 *
 * À 150, le sommet (Maître) s'ouvre à 2 250 — soit trois jeux tenus autour de
 * 750, ce qui correspond à un très bon élève d'après `restingTrophies`. Le rang
 * de matière est donc ATTEIGNABLE, contrairement au rang global qui reste le
 * long terme. C'est délibéré : « je suis Platine en maths » doit pouvoir se
 * dire dans l'année, sinon la matière n'a pas d'identité et on retombe sur le
 * chiffre unique qu'on vient de quitter.
 */
export const SUBJECT_DIVISION_SPAN = 150

/** Divisions par palier : I, II, III. */
export const SUBJECT_DIVISIONS_PER_TIER = 3

// Les paliers qui portent des divisions (tout sauf le sommet, ouvert).
const DIVISIONED_TIERS = RANK_TIERS.filter((t) => t.hasDivisions)

/** Seuil d'entrée du sommet (Maître) sur l'échelle d'une matière. */
export const SUBJECT_APEX_FLOOR =
  DIVISIONED_TIERS.length * SUBJECT_DIVISIONS_PER_TIER * SUBJECT_DIVISION_SPAN

// On gravit III → II → I, convention conservée du rang global (le chiffre
// DIMINUE quand on monte, comme à League of Legends).
const SUBJECT_DIVISION_ROMAN = ['III', 'II', 'I'] as const

/** Le chiffre romain d'un index de division 0..2 (III, II, I). */
export function subjectDivisionRoman(divisionIndex: number): string {
  const i = Math.max(
    0,
    Math.min(SUBJECT_DIVISIONS_PER_TIER - 1, Math.floor(divisionIndex)),
  )
  return SUBJECT_DIVISION_ROMAN[i]
}

// ----------------------------------------------------------------------- rang

export type SubjectRank = {
  tier: RankTier
  /** Index de division 0..2 (0 = III … 2 = I), ou null au sommet. */
  divisionIndex: number | null
  /** Chiffre romain, ou null au sommet. */
  roman: string | null
  /** Palier + division en un mot, ex. « Or II » ou « Maître ». */
  label: string
  /** Progression 0..1 dans la division courante (1 au sommet). */
  progress: number
  /** Trophées jusqu'à la division suivante (0 au sommet). */
  toNext: number
  /** Trophées engrangés dans la division courante. */
  inDivision: number
  /** Borne basse de la division courante. */
  floor: number
  /** Borne haute (null au sommet, ouvert). */
  ceiling: number | null
}

/** Traduit le total d'UNE matière en rang (palier + division + progression). */
export function subjectRankFor(trophies: number): SubjectRank {
  const t = Math.max(0, Math.floor(trophies))

  if (t >= SUBJECT_APEX_FLOOR) {
    const apex = RANK_TIERS[RANK_TIERS.length - 1]
    return {
      tier: apex,
      divisionIndex: null,
      roman: null,
      label: apex.name,
      progress: 1,
      toNext: 0,
      inDivision: t - SUBJECT_APEX_FLOOR,
      floor: SUBJECT_APEX_FLOOR,
      ceiling: null,
    }
  }

  const globalDivision = Math.floor(t / SUBJECT_DIVISION_SPAN)
  const tierIndex = Math.floor(globalDivision / SUBJECT_DIVISIONS_PER_TIER)
  const divisionIndex = globalDivision % SUBJECT_DIVISIONS_PER_TIER
  const tier = DIVISIONED_TIERS[tierIndex]

  const floor = globalDivision * SUBJECT_DIVISION_SPAN
  const ceiling = floor + SUBJECT_DIVISION_SPAN
  const roman = subjectDivisionRoman(divisionIndex)

  return {
    tier,
    divisionIndex,
    roman,
    label: `${tier.name} ${roman}`,
    progress: (t - floor) / SUBJECT_DIVISION_SPAN,
    toNext: ceiling - t,
    inDivision: t - floor,
    floor,
    ceiling,
  }
}

/** Seuil d'entrée d'un palier sur l'échelle d'une matière. */
export function subjectTierFloor(tierId: RankTierId): number {
  const idx = DIVISIONED_TIERS.findIndex((t) => t.id === tierId)
  if (idx === -1) return SUBJECT_APEX_FLOOR
  return idx * SUBJECT_DIVISIONS_PER_TIER * SUBJECT_DIVISION_SPAN
}

// ------------------------------------------------------------- le ladder complet

/**
 * Une matière telle que l'affichent l'arène et la vitrine : son rang, son
 * compteur, son pic, et si elle est ouverte au duel classé.
 */
export type SubjectLadder = {
  /** Nom affiché (« Histoire-Géo »). */
  subject: string
  /** Slug — l'identité stable, celle des trophées et des URLs. */
  slug: string
  emoji: string
  trophies: number
  /** Meilleur total jamais atteint sur cette matière. */
  peakTrophies: number
  rank: SubjectRank
  /**
   * Ouverte au duel classé. Une matière verrouillée s'affiche quand même —
   * grisée, avec sa consigne : cacher ce qui reste à débloquer priverait
   * l'élève de la seule raison d'aller terminer un chapitre.
   */
  unlocked: boolean
}

export type LadderInput = {
  /** Matières du catalogue de l'élève, dans l'ordre d'affichage. */
  subjects: readonly { subject: string; slug: string; emoji: string }[]
  /**
   * Compteurs par (matière × jeu), tels que les rend la Route des trophées.
   * Le champ `subject` y porte le SLUG et non le nom affiché — c'est l'identité
   * de `game_trophies.subject_slug` (238) et celle de tout le monde des
   * trophées (`lib/defi/roster`).
   */
  rows: readonly GameTrophyRow[]
  /** Pics par matière (slug → total), tenus par la base. */
  peaks?: ReadonlyMap<string, number>
  /** Slugs des matières débloquées pour le classé. */
  unlockedSlugs?: ReadonlySet<string>
}

/**
 * Le ladder complet, matière par matière.
 *
 * TOUT est indexé par SLUG ici — compteurs, pics, éligibilité. Le nom affiché
 * (« Histoire-Géo ») ne sert qu'à l'écran : il porte des accents et peut être
 * réécrit un jour, une clé ne doit dépendre ni de l'un ni de l'autre. C'est
 * déjà la règle de la migration 238, et la respecter ici évite la classe de
 * bugs où une matière affiche zéro trophée parce qu'un accent ne tombe pas.
 */
export function buildSubjectLadders({
  subjects,
  rows,
  peaks,
  unlockedSlugs,
}: LadderInput): SubjectLadder[] {
  const totals = subjectTotals(rows)

  return subjects.map((entry) => {
    const trophies = totals.get(entry.slug) ?? 0
    // Le pic ne peut pas être inférieur au compteur du jour : un pic manquant
    // (migration pas encore passée) vaut le total courant, jamais zéro — sinon
    // la vitrine annoncerait un record plus bas que le score affiché à côté.
    const peakTrophies = Math.max(trophies, peaks?.get(entry.slug) ?? 0)
    return {
      ...entry,
      trophies,
      peakTrophies,
      rank: subjectRankFor(trophies),
      unlocked: unlockedSlugs ? unlockedSlugs.has(entry.slug) : true,
    }
  })
}

/**
 * La matière à présenter d'emblée : celle que l'élève travaille en ce moment si
 * elle est débloquée, sinon la débloquée où il a le plus de trophées, sinon la
 * première du catalogue.
 *
 * Ne rend JAMAIS null quand il y a au moins une matière : l'écran d'arène doit
 * pouvoir afficher un badge dès le premier lancement, même sur un compte neuf
 * où rien n'est encore débloqué. Une matière verrouillée affichée en Bronze III
 * avec sa consigne vaut mieux qu'un trou.
 */
export function defaultSubject(
  ladders: readonly SubjectLadder[],
  activeSubjectSlug?: string | null,
): SubjectLadder | null {
  if (ladders.length === 0) return null

  const active = activeSubjectSlug
    ? ladders.find((l) => l.slug === activeSubjectSlug)
    : undefined
  if (active?.unlocked) return active

  const ouvertes = ladders.filter((l) => l.unlocked)
  if (ouvertes.length > 0) {
    return ouvertes.reduce((best, l) => (l.trophies > best.trophies ? l : best))
  }

  return active ?? ladders[0]
}

/** La consigne d'une matière encore fermée. Une seule formulation dans l'app. */
export const LOCKED_HINT = 'Termine un chapitre pour débloquer'
