// -----------------------------------------------------------------------------
// LA FIN D'UNE COURSE — ce que l'écran envoie et ce que le serveur rend.
//
// Des types seulement (et rien qui touche Supabase) : l'écran de la course les
// importe, le serveur (lib/duel/fin-course-server) les remplit, la route
// `/api/duel/fin` les transporte.
// -----------------------------------------------------------------------------

import type { GameTrophyOutcome } from '@/app/defi/actions'
import type { Gain } from '@/lib/gains'
import type { ReviewAnswer } from '@/lib/srs'
import type { CourseOutcome, CourseStats } from '@/lib/duel/course'
import type { ReplayStep } from '@/lib/duel/replay'

/** L'adversaire tel que le client le renvoie — jamais avec des points. */
export type OpponentClaim =
  | { kind: 'bot'; botId: string; trophiesRef: number }
  | {
      kind: 'replay'
      replayId: string
      /**
       * L'instant de la trace affrontée (`created_at` du replay, lu par la
       * page). Le rival peut rejouer une course PENDANT la mienne et écraser sa
       * trace : la version dit laquelle j'ai réellement courue.
       */
      version?: string | null
    }

export type DuelCourseInput = {
  /** L'identifiant de CETTE course, tiré par l'écran : il rend l'envoi rejouable. */
  courseId?: string
  subjectSlug: string
  seed: string
  opponent: OpponentClaim
  stats: CourseStats
  /** Mes pas, pour la trace. */
  steps: ReplayStep[]
  /** Mes réponses, pour la file de révision. */
  answers: ReviewAnswer[]
}

/**
 * Ce que le serveur a pu établir :
 *  - `verifie` : rival refabriqué, verdict du serveur, trophées appliqués ;
 *  - `non_verifie` : rival introuvable (trace effacée, réécrite) — la course
 *    compte pour l'activité, les trophées ne bougent pas ;
 *  - `deja_compte` : cette course avait déjà été enregistrée (renvoi) ;
 *  - `non_connecte` : session expirée, rien n'est écrit.
 */
export type DuelCourseStatut = 'verifie' | 'non_verifie' | 'deja_compte' | 'non_connecte'

export type DuelCourseOutcome = {
  saved: boolean
  statut: DuelCourseStatut
  /** Le verdict du SERVEUR — il ne compte que si `statut` vaut 'verifie'. */
  outcome: CourseOutcome
  /** Le rival tel que le serveur l'a rejoué (null s'il n'a pas pu). */
  rival: { score: number; goalAtMs: number | null } | null
  stats: CourseStats
  trophies: GameTrophyOutcome
  /** Trophées gelés : trop de parties classées dans l'heure (60, migration 238). */
  trophiesPause: boolean
  /** Points versés au clan cette fois-ci. */
  clanPoints: number
  questsCompleted: string[]
  questDayDone: boolean
  /** Ce qui a été versé, prêt à voler vers le bandeau. */
  gains: Gain[]
  /** La trace a été déposée : cette course peut devenir le rival de quelqu'un. */
  replaySaved: boolean
}
