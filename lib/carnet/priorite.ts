// -----------------------------------------------------------------------------
// LE COURS PRIORITAIRE — par quoi commencer, et pourquoi.
//
// Le carnet montrait ses dossiers en vrac, et laissait l'élève choisir. Or la
// répétition espacée sait exactement lequel réclame le plus : celui dont les
// cartes sont dues, celui dont le contrôle approche, celui qu'on n'a jamais
// ouvert. Ce module tranche, et DIT SA RAISON en français — un choix qu'on ne
// comprend pas se contourne.
//
// LE BARÈME, en clair, parce qu'il se discute :
//   · une carte DUE pèse 10 : c'est le cœur de la répétition espacée, ce qui
//     s'oublie si on ne le revoit pas aujourd'hui ;
//   · un CONTRÔLE dans les 14 jours pèse 8 × (15 − jours restants) : à J−1 il
//     domine tout, à J−14 il compte à peine ;
//   · une carte JAMAIS VUE pèse 1 : à réserve égale, on ouvre ce qu'on n'a pas
//     commencé, mais jamais avant ce qui est dû.
// À égalité, le cours le moins révisé récemment passe devant.
//
// Logique PURE, aucun accès base. Les dates sont des clés UTC `YYYY-MM-DD`.
// -----------------------------------------------------------------------------

import type { OrdreCarnet } from './preferences'

/** Un cours tel que le carnet le connaît, une fois ses états lus. */
export type CoursCarnet = {
  id: string
  title: string
  description: string | null
  icon: string | null
  color: string | null
  /** La matière du catalogue (`subject_id`, migration 316), ou null. */
  subjectId: string | null
  /** Cartes jouables (brouillons exclus). */
  questionCount: number
  /** Cartes dues aujourd'hui. */
  dueCount: number
  /** Cartes jamais vues. */
  nouvelles: number
  /** Couronnes de maîtrise (0 → 3). */
  crowns: 0 | 1 | 2 | 3
  /** Date du contrôle (clé UTC), ou null. */
  examOn: string | null
  /** L'objectif libre du cours (« Partiel, 14 juin »), ou null. */
  objectif: string | null
  epingle: boolean
  archive: boolean
  /** ISO de la dernière modification du cours. */
  updatedAt: string
  /** Clé de jour de la dernière carte revue, ou null. */
  dernierRevuLe: string | null
}

export const POIDS_DUE = 10
export const POIDS_NOUVELLE = 1
export const POIDS_CONTROLE = 8
/** Au-delà, un contrôle n'entre pas dans le score. */
export const HORIZON_CONTROLE_JOURS = 14

/** Jours de `de` à `a` (négatif si `a` est passé). */
export function joursEntre(de: string, a: string): number {
  const ms = Date.parse(`${a}T00:00:00Z`) - Date.parse(`${de}T00:00:00Z`)
  return Number.isFinite(ms) ? Math.round(ms / 86_400_000) : Number.NaN
}

/** Le poids du contrôle d'un cours pour un jour donné — 0 sans contrôle, passé ou lointain. */
export function poidsControle(examOn: string | null, aujourdhui: string): number {
  if (!examOn) return 0
  const dans = joursEntre(aujourdhui, examOn)
  if (!Number.isFinite(dans) || dans < 0 || dans > HORIZON_CONTROLE_JOURS) return 0
  return POIDS_CONTROLE * (HORIZON_CONTROLE_JOURS + 1 - dans)
}

/** Le score d'urgence d'un cours. Plus il est haut, plus le cours passe devant. */
export function scoreUrgence(cours: CoursCarnet, aujourdhui: string): number {
  return (
    cours.dueCount * POIDS_DUE +
    poidsControle(cours.examOn, aujourdhui) +
    cours.nouvelles * POIDS_NOUVELLE
  )
}

export type Priorite = { cours: CoursCarnet; raison: string }

function pluriel(n: number, mot: string): string {
  return `${n} ${mot}${n > 1 ? 's' : ''}`
}

/**
 * La raison du choix : la composante qui pèse le plus, dite en français.
 * « contrôle dans 3 jours » l'emporte sur « 8 cartes dues » seulement quand
 * c'est bien lui qui a fait pencher le score.
 */
export function raisonPriorite(cours: CoursCarnet, aujourdhui: string): string {
  const due = cours.dueCount * POIDS_DUE
  const controle = poidsControle(cours.examOn, aujourdhui)
  const nouvelles = cours.nouvelles * POIDS_NOUVELLE

  if (controle > 0 && controle >= due && controle >= nouvelles && cours.examOn) {
    const dans = joursEntre(aujourdhui, cours.examOn)
    if (dans === 0) return 'contrôle aujourd’hui'
    if (dans === 1) return 'contrôle demain'
    return `contrôle dans ${dans} jours`
  }
  if (due > 0 && due >= nouvelles) {
    return `${pluriel(cours.dueCount, 'carte')} due${cours.dueCount > 1 ? 's' : ''}`
  }
  if (nouvelles > 0) {
    return `${pluriel(cours.nouvelles, 'carte')} jamais vue${cours.nouvelles > 1 ? 's' : ''}`
  }
  return 'rien d’urgent, à revoir pour entretenir'
}

/**
 * Le cours à réviser en premier, ou `null` si aucun cours n'a de carte.
 *
 * Les cours ARCHIVÉS et les BROUILLONS n'entrent pas en lice : on ne propose
 * pas de réviser ce qu'on a rangé, ni ce qui est vide.
 */
export function coursPrioritaire(cours: readonly CoursCarnet[], aujourdhui: string): Priorite | null {
  const candidats = cours.filter((c) => !c.archive && c.questionCount > 0)
  if (candidats.length === 0) return null
  const [premier] = [...candidats].sort((a, b) => comparerUrgence(a, b, aujourdhui))
  return { cours: premier, raison: raisonPriorite(premier, aujourdhui) }
}

/** Score décroissant, puis le moins révisé récemment, puis le titre. */
function comparerUrgence(a: CoursCarnet, b: CoursCarnet, aujourdhui: string): number {
  const ecart = scoreUrgence(b, aujourdhui) - scoreUrgence(a, aujourdhui)
  if (ecart !== 0) return ecart
  // Jamais revu passe devant revu hier ; revu hier passe devant revu ce matin.
  const ra = a.dernierRevuLe ?? ''
  const rb = b.dernierRevuLe ?? ''
  if (ra !== rb) return ra < rb ? -1 : 1
  return a.title.localeCompare(b.title, 'fr')
}

/**
 * Les cours dans l'ordre choisi — A → Z ou les plus récents d'abord. Les
 * ÉPINGLÉS passent toujours devant, quel que soit l'ordre : c'est ce que veut
 * dire épingler. L'urgence n'est plus un ordre de la grille (10/09/2026) ;
 * elle ne sert qu'à la suggestion (`coursPrioritaire`).
 */
export function trierCours(cours: readonly CoursCarnet[], ordre: OrdreCarnet): CoursCarnet[] {
  const cmp = (a: CoursCarnet, b: CoursCarnet): number => {
    if (a.epingle !== b.epingle) return a.epingle ? -1 : 1
    if (ordre === 'recents' && a.updatedAt !== b.updatedAt) return a.updatedAt < b.updatedAt ? 1 : -1
    return a.title.localeCompare(b.title, 'fr')
  }
  return [...cours].sort(cmp)
}

/**
 * Les dossiers FAVORIS (l'étoile de l'élève, colonne `epingle`) d'un côté,
 * les autres de l'autre — dans l'ordre reçu. L'écran met un espace entre les
 * deux groupes : c'est l'élève qui a choisi ce qui passe devant.
 */
export function separerFavoris(cours: readonly CoursCarnet[]): {
  favoris: CoursCarnet[]
  autres: CoursCarnet[]
} {
  return {
    favoris: cours.filter((c) => c.epingle),
    autres: cours.filter((c) => !c.epingle),
  }
}

export type ObjectifDuJour = {
  /** Cartes revues aujourd'hui. */
  fait: number
  /** L'objectif du jour. */
  total: number
  /** 0 → 100, plafonné. */
  pct: number
  atteint: boolean
}

/** Où en est l'objectif du jour. */
export function objectifDuJour(revuesAujourdhui: number, objectifCartes: number): ObjectifDuJour {
  const fait = Math.max(0, Math.floor(revuesAujourdhui))
  const total = Math.max(1, Math.floor(objectifCartes))
  const pct = Math.min(100, Math.round((fait / total) * 100))
  return { fait, total, pct, atteint: fait >= total }
}

/** Durée annoncée d'une révision : ~30 s par carte, jamais moins d'une minute. */
export function minutesPour(cartes: number): number {
  return Math.max(1, Math.round(cartes / 2))
}
