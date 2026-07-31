// -----------------------------------------------------------------------------
// « Le point du jour » — ce que Marcel dit en ouvrant l'onglet.
//
// PARTAGE AVEC RÉVISER, décidé et assumé : `lib/mission.ts` choisit DÉJÀ la
// meilleure session à lancer, et c'est très bien. Marcel ne refait pas ce
// choix — il le reprend tel quel et ajoute les deux choses que la mission ne
// porte pas :
//
//   • le POURQUOI — une phrase de diagnostic, pas un intitulé de chapitre ;
//   • le COMMENT  — la consigne du régime de la matière (cf. ./regimes).
//
// Son bouton renvoie DANS Réviser (`missionHref`). Marcel oriente, Réviser
// exécute : une seule voix, deux endroits, aucune duplication.
//
// Logique PURE : aucun accès base, aucun appel réseau. Le serveur assemble
// l'entrée, cette fonction décide, le composant affiche.
// -----------------------------------------------------------------------------

import { missionHref, type Mission, type MissionPlan } from '../mission'
import {
  REGIMES,
  regimeOf,
  seanceFor,
  type Regime,
  type SeanceEtape,
} from './regimes'

/**
 * Le ton du jour. Marcel qui n'aurait que des reproches à faire finirait
 * désinstallé : `avance` et `jour1` existent pour ça.
 */
export type Ton = 'jour1' | 'controle' | 'reprise' | 'decouverte' | 'avance'

/** Une étiquette de contexte affichée sous le diagnostic. */
export type Raison = { key: string; label: string; urgent: boolean }

export type PointDuJour = {
  ton: Ton
  /** Le diagnostic, en une phrase. C'est la voix de Marcel. */
  titre: string
  /** La consigne de méthode du régime, ou `null` (matière hors doctrine). */
  consigne: string | null
  raisons: Raison[]
  /** Libellé du bouton, durée comprise. */
  cta: string
  /** Où va le bouton — toujours dans Réviser, jamais une page de Marcel. */
  href: string | null
  minutes: number
  /**
   * La matière de la mission — celle dont on parle AUJOURD'HUI. Distincte de la
   * matière sélectionnée dans l'onglet Méthode : renvoyer vers la mauvaise
   * méthode serait le genre de détail qui décrédibilise un prof.
   */
  matiere: { slug: string; name: string } | null
  regime: Regime | null
  /** Les trois temps de la séance, minutés. Vide si hors doctrine. */
  seance: SeanceEtape[]
}

export type PointInput = {
  plan: MissionPlan
  /** Cartes dues dans la file « À revoir ». */
  srsDue: number
  /** Série en cours, en jours. */
  streak: number
  /**
   * L'élève a-t-il déjà travaillé une seule fois ? À `false`, Marcel n'a rien à
   * diagnostiquer et le dit — il n'invente pas un constat.
   */
  hasHistory: boolean
  /** Objectif quotidien du profil, en minutes (repli si pas de mission). */
  goalMinutes: number
}

/** Durée proposée quand aucune mission n'est en attente (séance bonus). */
export const BONUS_MINUTES = 5

function pourcent(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value * 100)))
}

function raisonsFor(
  mission: Mission | null,
  srsDue: number,
  streak: number,
): Raison[] {
  const raisons: Raison[] = []

  // L'échéance d'abord : c'est la seule information qui presse.
  if (mission?.countdown) {
    raisons.push({ key: 'controle', label: mission.countdown, urgent: true })
  }
  if (mission && mission.progress !== null && !mission.isNew) {
    raisons.push({
      key: 'progress',
      label: `Chapitre à ${pourcent(mission.progress)} %`,
      urgent: false,
    })
  }
  if (srsDue > 0) {
    raisons.push({
      key: 'srs',
      label: srsDue === 1 ? '1 carte à revoir' : `${srsDue} cartes à revoir`,
      urgent: false,
    })
  }
  if (streak >= 2) {
    raisons.push({ key: 'streak', label: `Série ${streak} jours`, urgent: false })
  }

  return raisons
}

/**
 * Le diagnostic. La phrase change avec le TON, pas avec la matière : c'est la
 * consigne (portée par le régime) qui apporte la couleur de la matière.
 */
function titreFor(ton: Ton, mission: Mission | null): string {
  switch (ton) {
    case 'jour1':
      return 'Faisons connaissance : quelques questions, et je saurai par où te faire commencer.'
    case 'controle':
      return `Ton contrôle de ${mission?.subjectName ?? 'la matière'} approche. On prend ${mission?.chapterTitle ?? 'le chapitre'}.`
    case 'reprise':
      return `${mission?.chapterTitle ?? 'Ce chapitre'} n’est pas encore solide — on y retourne.`
    case 'decouverte':
      return `On ouvre ${mission?.chapterTitle ?? 'un nouveau chapitre'}. Première fois : je reste avec toi.`
    case 'avance':
      return 'Rien à rattraper aujourd’hui. Ça n’arrive pas souvent — savoure.'
  }
}

function ctaFor(ton: Ton, minutes: number): string {
  switch (ton) {
    case 'jour1':
      return 'Commencer · 2 min'
    case 'avance':
      return `Séance bonus · ${minutes} min`
    case 'decouverte':
      return `Ouvrir le chapitre · ${minutes} min`
    default:
      return `Lancer la séance · ${minutes} min`
  }
}

/**
 * Assemble le point du jour à partir de la mission déjà choisie par Réviser.
 *
 * Ordre des tons — le premier qui s'applique gagne :
 *   1. `jour1`     — aucun historique : rien à diagnostiquer, on se présente ;
 *   2. `controle`  — une échéance datée bat tout le reste ;
 *   3. `reprise` / `decouverte` — selon que le chapitre a déjà été ouvert ;
 *   4. `avance`    — plus rien en attente : on félicite au lieu d'inventer.
 */
export function pointDuJour(input: PointInput): PointDuJour {
  const { plan, srsDue, streak, hasHistory, goalMinutes } = input
  const mission = plan.mission

  const ton: Ton = !hasHistory
    ? 'jour1'
    : mission === null
      ? 'avance'
      : mission.kind === 'controle'
        ? 'controle'
        : mission.kind === 'decouverte'
          ? 'decouverte'
          : 'reprise'

  const repli = goalMinutes > 0 ? Math.floor(goalMinutes) : BONUS_MINUTES
  const minutes =
    ton === 'avance' ? BONUS_MINUTES : (mission?.minutes ?? repli)

  const regime = mission ? regimeOf(mission.subjectSlug) : null

  return {
    ton,
    titre: titreFor(ton, mission),
    // Sur « jour 1 » Marcel ne connaît pas encore la matière : pas de consigne.
    consigne: ton === 'jour1' || regime === null ? null : REGIMES[regime].consigne,
    raisons: ton === 'jour1' ? [] : raisonsFor(mission, srsDue, streak),
    cta: ctaFor(ton, minutes),
    href: mission ? missionHref(mission) : null,
    minutes,
    matiere: mission
      ? { slug: mission.subjectSlug, name: mission.subjectName }
      : null,
    regime,
    seance: regime === null ? [] : seanceFor(regime, minutes),
  }
}
