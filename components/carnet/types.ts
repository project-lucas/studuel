// Formes sérialisées passées du serveur aux composants du carnet — jamais le
// contenu complet des questions dans les listes, seulement de quoi afficher.
import type { CourseQuestionType } from '@/lib/carnet-cours'
import type { OrigineQuestion } from '@/lib/carnet/origine'

export type CourseHeader = {
  id: string
  title: string
  description: string | null
  icon: string | null
  color: string | null
}

export type CourseQuestionRow = {
  id: string
  chapterId: string | null
  type: CourseQuestionType
  position: number
  summary: string
  ready: boolean
  /** D'où vient la question (migration 357) ; null avant elle. */
  origine: OrigineQuestion | null
}
