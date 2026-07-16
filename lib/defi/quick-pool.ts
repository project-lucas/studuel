// Pool de questions d'une PARTIE RAPIDE (duel live lancé par QR code).
// La page /defi/duel-rapide charge des questions de la classe de l'hôte ;
// ici, la partie pure et testable : filtrer les lignes valides et les
// convertir en ModeQuestion (options permutées de façon déterministe par
// l'id — hôte et rival obtiennent le même ordre, cf. lib/quiz-shuffle).
import { permuteQuizOptions } from '@/lib/quiz-shuffle'
import type { ModeQuestion } from '@/lib/defi-modes'

// Ligne brute de quiz_questions telle que lue par la page.
export type QuickQuestionRow = {
  id: string
  quiz_id: string
  question: string
  kind: 'mcq' | 'true_false'
  options: unknown
  correct_index: number
  explanation: string | null
}

// Ne garde que les questions jouables (≥ 2 options, bonne réponse dans les
// bornes) et les convertit en ModeQuestion. `subjectOf` résout la matière du
// quiz d'origine (Map quiz_id → subject côté appelant).
export function toModeQuestions(
  rows: QuickQuestionRow[] | null | undefined,
  subjectOf: (quizId: string) => string | null,
): ModeQuestion[] {
  return (rows ?? []).flatMap((r) => {
    const options = Array.isArray(r.options)
      ? r.options.filter((o): o is string => typeof o === 'string')
      : []
    if (
      options.length < 2 ||
      !Number.isInteger(r.correct_index) ||
      r.correct_index < 0 ||
      r.correct_index >= options.length
    ) {
      return []
    }
    const shuffled = permuteQuizOptions(r.kind, options, r.correct_index, r.id)
    return [
      {
        id: r.id,
        prompt: r.question,
        options: shuffled.options,
        correctIndex: shuffled.correctIndex,
        explanation: r.explanation,
        subject: subjectOf(r.quiz_id),
      },
    ]
  })
}
