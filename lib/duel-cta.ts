// -----------------------------------------------------------------------------
// Ce que le bouton « Duel 90 s » dit EN PLUS de sa destination.
//
// Le geste vient de Clash Royale : leur bouton ne dit pas « Combat », il dit
// « Combat · 60/700 · Fin dans 3j 23h ». Le CTA n'est pas qu'une porte, c'est le
// tableau de bord — où j'en suis, et combien de temps il me reste. Un joueur qui
// ouvre le jeu sait en une seconde s'il doit jouer aujourd'hui.
//
// Ce qu'on y met : la CONTRIBUTION DE CLAN de la semaine. C'est le seul
// compteur de l'arène qui réunisse les trois conditions :
//   • il a une échéance réelle (la semaine de clan se clôt le dimanche) ;
//   • il avance en jouant des duels (lib/clan-week.CLAN_POINTS.duel_play) — le
//     bouton fait donc monter le chiffre qu'il affiche ;
//   • il n'était visible NULLE PART sur l'arène : il dormait derrière le
//     burger, dans la feuille du coffre d'équipe.
//
// Le but affiché est MIN_POINTS_TO_CLAIM, pas le total du clan : en dessous de
// ce seuil, l'élève n'a aucun droit sur le coffre de dimanche. La barre répond
// donc à une vraie question — « est-ce que j'aurai le coffre ? ». Une fois le
// seuil passé, il n'y a plus de but, seulement une fierté : on bascule sur le
// total contribué.
//
// Pur et testable (convention projet).
// -----------------------------------------------------------------------------

import {
  MIN_POINTS_TO_CLAIM,
  countdownLabel,
  daysLeftInWeek,
} from '@/lib/clan-week'

/**
 * L'échéance en 4 caractères, façon « 3j 23h » de Clash Royale : c'est tout ce
 * que le bouton peut porter à côté du compteur. Le dernier jour garde ses mots
 * — c'est le seul moment où l'échéance doit crier.
 */
function shortDeadline(today: string): string {
  const left = daysLeftInWeek(today)
  return left <= 1 ? 'Dernier jour' : `${left} j`
}

export type DuelGoal = {
  /** Points de clan déjà apportés cette semaine. */
  current: number
  /** Le seuil qui ouvre le droit au coffre. */
  goal: number
  reached: boolean
  /**
   * Le compteur tel qu'il tient DANS le bouton : « 30/50 pts », ou « 120 pts »
   * une fois le seuil passé. Volontairement télégraphique — depuis que le CTA
   * partage sa ligne avec Classé et Modes, il reste ~130 px pour cette ligne :
   * une phrase complète s'y coupait en « … 4 jour… ». Le sens complet est dit
   * par `duelGoalSentence` (aria-label).
   */
  label: string
  /** Échéance courte, pour la même ligne : « 4 j », « Dernier jour ». */
  deadline: string
  /** Échéance en toutes lettres (lecteurs d'écran) : « Plus que 2 jours ». */
  countdown: string
  /** Remplissage 0..1 de la barre du bouton. */
  ratio: number
}

/**
 * L'objectif à afficher sous le CTA, ou `null` quand la semaine de clan n'est
 * pas disponible (migration 204 non exécutée, visiteur non connecté) : le
 * bouton retombe alors sur sa seule sous-ligne pédagogique. Jamais de compteur
 * inventé — un « 0/50 » affiché sans base derrière serait un mensonge qui ne
 * bougerait jamais.
 */
export function duelGoal(
  myPoints: number | null,
  today: string,
): DuelGoal | null {
  if (myPoints === null || !Number.isFinite(myPoints)) return null

  const current = Math.max(0, Math.floor(myPoints))
  const goal = MIN_POINTS_TO_CLAIM
  const reached = current >= goal

  return {
    current,
    goal,
    reached,
    label: reached
      ? `${current.toLocaleString('fr-FR')} pts`
      : `${current}/${goal} pts`,
    deadline: shortDeadline(today),
    countdown: countdownLabel(today),
    ratio: goal > 0 ? Math.min(1, current / goal) : 1,
  }
}

/** La phrase lue par un lecteur d'écran, ajoutée à l'aria-label du bouton. */
export function duelGoalSentence(goal: DuelGoal): string {
  return goal.reached
    ? `Tu as apporté ${goal.current} points à ton clan cette semaine. ${goal.countdown}.`
    : `${goal.current} points sur ${goal.goal} pour avoir droit au coffre de ton clan. ${goal.countdown}.`
}
