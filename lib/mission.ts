// -----------------------------------------------------------------------------
// « Mission du jour » — le cœur pur de l'accueil Réviser : l'app choisit LA
// meilleure session à lancer maintenant, au lieu de présenter plusieurs boutons
// à égalité. L'élève décide s'il joue, pas ce qu'il joue.
//
// Priorité : session de préparation d'un contrôle actif → reprise d'un chapitre
// (en cours le plus avancé, puis fragile le plus bas — même classement que
// l'ancienne file « On s'y remet ? ») → premier chapitre jamais commencé.
// Les candidats non retenus deviennent les suggestions « Ensuite ».
//
// Dates = clés UTC 'YYYY-MM-DD' (convention projet, cf. lib/time & lib/streak).
// -----------------------------------------------------------------------------

import {
  derivePlanView,
  nearestActiveControle,
  launchChapterId,
  controleTitle,
  countdownTag,
  DEFAULT_GOAL_MINUTES,
  type Controle,
} from './prep-plan'
import type { ChapterState } from './mastery'

/** Un chapitre du programme, analysé (maîtrise) — candidat à la mission. */
export type ChapterCandidate = {
  subjectSlug: string
  subjectName: string
  chapterId: string
  chapterTitle: string
  state: ChapterState
  value: number // 0..1
}

export type MissionKind = 'controle' | 'reprise' | 'decouverte'

export type Mission = {
  kind: MissionKind
  subjectSlug: string
  subjectName: string
  chapterId: string
  chapterTitle: string
  minutes: number
  /** Progression du chapitre (0..1) — null pour une session de contrôle. */
  progress: number | null
  /** « J-2 » / « J-0 » pour un contrôle daté, null sinon. */
  countdown: string | null
  /** Id du contrôle porté par la mission (pour dédupliquer ses autres vues). */
  controleId: string | null
  /** Chapitre jamais commencé (→ « découvrir » plutôt que « reprendre »). */
  isNew: boolean
}

export type MissionInput = {
  today: string
  controles: readonly Controle[]
  /** slug de matière → nom d'affichage. */
  subjectNameBySlug: Record<string, string>
  chapters: readonly ChapterCandidate[]
  goalMinutes: number
}

export type MissionPlan = {
  mission: Mission | null
  ensuite: Mission[]
}

/** Nombre maximal de suggestions dans le rail « Ensuite ». */
export const ENSUITE_MAX = 4

/**
 * Durée estimée d'une session de reprise : courte quand le chapitre est presque
 * acquis, longue quand il repart de loin.
 */
export function sessionMinutes(progress: number, isNew: boolean): 3 | 5 | 10 {
  if (isNew) return 5
  if (progress >= 0.66) return 3
  if (progress >= 0.33) return 5
  return 10
}

/** La page à ouvrir pour lancer une mission. */
export function missionHref(
  mission: Pick<Mission, 'subjectSlug' | 'chapterId'>,
): string {
  return `/reviser/${mission.subjectSlug}/${mission.chapterId}`
}

function repriseMission(candidate: ChapterCandidate): Mission {
  const isNew = candidate.state === 'a_commencer'
  return {
    kind: isNew ? 'decouverte' : 'reprise',
    subjectSlug: candidate.subjectSlug,
    subjectName: candidate.subjectName,
    chapterId: candidate.chapterId,
    chapterTitle: candidate.chapterTitle,
    minutes: sessionMinutes(candidate.value, isNew),
    progress: isNew ? 0 : candidate.value,
    countdown: null,
    controleId: null,
    isNew,
  }
}

export function pickMission(input: MissionInput): MissionPlan {
  const { today, controles, subjectNameBySlug, chapters, goalMinutes } = input

  // File de reprise : en cours du plus avancé au moins avancé (finir ce qui est
  // presque fini), puis fragiles du plus bas au plus haut (soigner le plus
  // urgent), enfin les jamais-commencés dans l'ordre du programme.
  const enCours = chapters
    .filter((c) => c.state === 'en_cours')
    .sort((a, b) => b.value - a.value)
  const fragiles = chapters
    .filter((c) => c.state === 'fragile')
    .sort((a, b) => a.value - b.value)
  const aCommencer = chapters.filter((c) => c.state === 'a_commencer')
  const queue = [...enCours, ...fragiles, ...aCommencer]

  // 1. Un contrôle actif ? Sa session du jour est LA mission.
  let mission: Mission | null = null
  const next = nearestActiveControle(controles, today)
  if (next) {
    const view = derivePlanView(next, today)
    const name = subjectNameBySlug[next.subject] ?? next.subject
    mission = {
      kind: 'controle',
      subjectSlug: next.subject,
      subjectName: name,
      chapterId: launchChapterId(view, next),
      chapterTitle: controleTitle(next, name),
      minutes:
        view.todaySession?.durationMin ??
        (goalMinutes > 0 ? goalMinutes : DEFAULT_GOAL_MINUTES),
      progress: null,
      countdown: countdownTag(next.date, today),
      controleId: next.id,
      isNew: false,
    }
  }

  // 2/3. Sinon, la tête de file devient la mission ; le reste nourrit « Ensuite ».
  const rest = mission ? queue : queue.slice(1)
  if (!mission && queue.length > 0) mission = repriseMission(queue[0])

  const missionChapterId = mission?.chapterId
  const ensuite = rest
    .filter((c) => c.chapterId !== missionChapterId)
    .slice(0, ENSUITE_MAX)
    .map(repriseMission)

  return { mission, ensuite }
}
