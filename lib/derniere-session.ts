// LA DERNIÈRE SESSION DE RÉVISION d'une matière — logique pure.
//
// Le dossier d'une matière portait deux blocs avant la liste : le bandeau
// « n notions à revoir » et la carte « On commence par ça » (le premier chapitre
// en cours, sinon le premier jamais ouvert). Lucas les a retirés le 17/09/2026 :
// « juste mettre un drapeau sur le chapitre ou le sous-chapitre de la dernière
// session de révision ». Le repère ne DEVINE donc plus où l'élève devrait
// reprendre : il dit où il s'est arrêté.
//
// Une session, ici, c'est un quiz joué (`test_sessions`) ou un cours lu
// (`lesson_completions`) — les deux traces datées que la page lit déjà. Les
// flashcards du studio n'ont pas de chapitre : elles ne comptent pas.

/** Une trace de travail sur un chapitre, avec sa date ISO. */
export type TraceSession = { chapterId: string; at: string }

/** Le libellé du repère posé sur la fiche. */
export const DERNIERE_SESSION_LABEL = 'Dernière session'

/** Un catalogue réduit à ce qu'il faut pour remonter d'un quiz au chapitre. */
type CatalogueMinimal = readonly {
  id: string
  lessons: readonly { id: string; quizzes: readonly { id: string }[] }[]
}[]

/** quiz → chapitre, sur le programme de la matière. */
export function chapitreParQuiz(catalog: CatalogueMinimal): Map<string, string> {
  const map = new Map<string, string>()
  for (const chapter of catalog) {
    for (const lesson of chapter.lessons) {
      for (const quiz of lesson.quizzes) map.set(quiz.id, chapter.id)
    }
  }
  return map
}

/** leçon → chapitre, sur le programme de la matière. */
export function chapitreParLecon(catalog: CatalogueMinimal): Map<string, string> {
  const map = new Map<string, string>()
  for (const chapter of catalog) {
    for (const lesson of chapter.lessons) map.set(lesson.id, chapter.id)
  }
  return map
}

/**
 * Le chapitre de la trace la plus récente, ou `null` sans trace datée. Une
 * date illisible est ignorée plutôt que de gagner par accident.
 */
export function derniereSession(traces: readonly TraceSession[]): string | null {
  let meilleur: { chapterId: string; t: number } | null = null
  for (const trace of traces) {
    const t = Date.parse(trace.at)
    if (Number.isNaN(t)) continue
    if (meilleur === null || t > meilleur.t) meilleur = { chapterId: trace.chapterId, t }
  }
  return meilleur?.chapterId ?? null
}

/**
 * Assemble les traces d'une matière depuis ses deux sources : les quiz joués
 * (rattachés par le quiz) et les cours lus (rattachés par la leçon). Les
 * lignes qui ne remontent à aucun chapitre du programme sont écartées — une
 * leçon d'une autre matière, un quiz retiré du catalogue.
 */
export function tracesDeLaMatiere(
  catalog: CatalogueMinimal,
  quizSessions: readonly { quiz_id: string | null; created_at?: string | null }[],
  completions: readonly { lesson_id: string; created_at?: string | null }[],
): TraceSession[] {
  const parQuiz = chapitreParQuiz(catalog)
  const parLecon = chapitreParLecon(catalog)
  const traces: TraceSession[] = []
  for (const s of quizSessions) {
    const chapterId = s.quiz_id ? parQuiz.get(s.quiz_id) : undefined
    if (chapterId && s.created_at) traces.push({ chapterId, at: s.created_at })
  }
  for (const c of completions) {
    const chapterId = parLecon.get(c.lesson_id)
    if (chapterId && c.created_at) traces.push({ chapterId, at: c.created_at })
  }
  return traces
}
