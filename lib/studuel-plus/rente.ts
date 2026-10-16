// -----------------------------------------------------------------------------
// LA RENTE DE GEMMES DE STUDUEL+ (15/10/2026, Lucas : « tout le monde aimerait
// être rentier : les users seront des rentiers de gemmes […] il faut un palier
// parlant, type 60 gemmes par semaine, soit 2 fiches de révision offertes »).
//
// LA RENTE POUSSE EN CONTINU ET SE RÉCOLTE (choix de Lucas, 15/10/2026, contre
// un versement du lundi) : une gemme toutes les 2 h 48, 60 par semaine, dans un
// coffre plafonné à UNE semaine. Plein, il ne pousse plus — il faut revenir le
// récolter. C'est l'effet « rentier » (ça rapporte pendant que je dors) ET la
// raison de rouvrir l'app au moins une fois par semaine.
//
// Le chiffre est PARLANT parce qu'il se convertit : 60 gemmes = 2 fiches de
// révision (une fiche coûte 30 gemmes, lib/gems). Depuis le 15/10/2026,
// Studuel+ n'ouvre plus les fiches d'office : l'abonné les achète avec sa rente.
//
// Logique PURE, miroir de la migration 580 (`rente_etat`, `rente_recolter`) :
// toute règle changée ici doit l'être là-bas — `lib/studuel-plus/rente.test.ts`
// relit le SQL. Ce n'est jamais ce module qui verse : c'est la base.
// -----------------------------------------------------------------------------

import { GEM_COST_CHAPTER } from '@/lib/gems'

/** Gemmes de rente par semaine. */
export const RENTE_GEMMES_SEMAINE = 60

/** Le coffre ne garde qu'une semaine de rente : plein, il ne pousse plus. */
export const RENTE_PLAFOND = RENTE_GEMMES_SEMAINE

const SEMAINE_S = 7 * 24 * 3600

/** Une gemme toutes les 10 080 s (2 h 48). */
export const SECONDES_PAR_GEMME = SEMAINE_S / RENTE_GEMMES_SEMAINE

/** « 60 gemmes = 2 fiches » : le palier qui parle. */
export const FICHES_PAR_SEMAINE = Math.floor(RENTE_GEMMES_SEMAINE / GEM_COST_CHAPTER)

export type EtatRente = {
  /** Gemmes prêtes à récolter. */
  gemmes: number
  /** Le coffre est plein : il ne pousse plus. */
  plein: boolean
  /** Secondes avant la prochaine gemme (0 si plein). */
  prochaineDansS: number
  /** Secondes avant que le coffre soit plein (0 si plein). */
  pleinDansS: number
  /** Remplissage du coffre, de 0 à 1. */
  remplissage: number
  /** Ce que la récolte rapporte, en fiches (« 1 fiche » dès 30 gemmes). */
  fiches: number
}

/**
 * Le point de départ d'une rente NEUVE : une semaine en arrière. Le premier
 * passage d'un abonné trouve donc le coffre PLEIN — « ta rente t'attend » —,
 * la meilleure façon de comprendre ce qu'est une rente, c'est d'en toucher une.
 */
export function depuisInitial(maintenantMs: number): number {
  return maintenantMs - SEMAINE_S * 1000
}

export function etatRente(depuisMs: number, maintenantMs: number): EtatRente {
  const ecoule = Math.max(0, Math.floor((maintenantMs - depuisMs) / 1000))
  const gemmes = Math.min(RENTE_PLAFOND, Math.floor(ecoule / SECONDES_PAR_GEMME))
  const plein = gemmes >= RENTE_PLAFOND
  return {
    gemmes,
    plein,
    prochaineDansS: plein ? 0 : SECONDES_PAR_GEMME - (ecoule % SECONDES_PAR_GEMME),
    pleinDansS: plein ? 0 : RENTE_PLAFOND * SECONDES_PAR_GEMME - ecoule,
    remplissage: Math.min(1, ecoule / (RENTE_PLAFOND * SECONDES_PAR_GEMME)),
    fiches: Math.floor(gemmes / GEM_COST_CHAPTER),
  }
}

/**
 * Après une récolte : le nouveau point de départ. Les secondes déjà entamées
 * vers la gemme suivante sont GARDÉES (on recule de ce qui a été payé, pas
 * jusqu'à maintenant) — sauf si le coffre était plein : ce qui a débordé est
 * perdu, c'est la règle qui fait revenir.
 */
export function departApresRecolte(depuisMs: number, maintenantMs: number): number {
  const { gemmes, plein } = etatRente(depuisMs, maintenantMs)
  if (plein) return maintenantMs
  return depuisMs + gemmes * SECONDES_PAR_GEMME * 1000
}

/** « 2 h 48 », « 35 min », « 3 j 4 h » — une durée à lire, pas à calculer. */
export function dureeLisible(secondes: number): string {
  const s = Math.max(0, Math.ceil(secondes))
  const jours = Math.floor(s / 86_400)
  const heures = Math.floor((s % 86_400) / 3600)
  const minutes = Math.ceil((s % 3600) / 60)
  if (jours > 0) return heures > 0 ? `${jours} j ${heures} h` : `${jours} j`
  if (heures > 0) return minutes > 0 && minutes < 60 ? `${heures} h ${String(minutes).padStart(2, '0')}` : `${heures} h`
  return `${Math.max(1, minutes)} min`
}

/** La phrase sous le coffre. */
export function phraseRente(etat: EtatRente): string {
  if (etat.plein) return 'Ton coffre est plein : récolte-le, il ne pousse plus.'
  if (etat.gemmes === 0) return `Prochaine gemme dans ${dureeLisible(etat.prochaineDansS)}.`
  return `Plein dans ${dureeLisible(etat.pleinDansS)} · +1 gemme dans ${dureeLisible(etat.prochaineDansS)}.`
}

/** « 60 gemmes par semaine, soit 2 fiches de révision offertes ». */
export function promesseRente(): string {
  return `${RENTE_GEMMES_SEMAINE} gemmes par semaine, soit ${FICHES_PAR_SEMAINE} fiches de révision offertes`
}
