// L'ORIGINE d'une question du carnet, et la teinte d'un dossier qui en découle.
//
// Lucas, 10/09/2026 : « on doit mieux dissocier le contenu des dossiers avec
// un code couleur : rouge si PDF inséré dans le dossier, violet si flashcard ».
// Pour savoir qu'une question vient d'un PDF, il faut le RETENIR au moment où
// elle est écrite : c'est la colonne `carnet_questions.source` (migration 357).
//
//   manuel  — créée à la main depuis « Créer une question »
//   texte   — rédigée par l'IA à partir d'un cours collé ou d'un thème
//   pdf     — rédigée par l'IA à partir d'un PDF inséré
//   photo   — rédigée par l'IA à partir d'une photo du cours transcrite
//
// Tant que la 357 n'est pas passée, la colonne n'existe pas : l'origine vaut
// `null` et le dossier prend la teinte de son contenu (flashcards → violet).

export const ORIGINES = ['manuel', 'texte', 'pdf', 'photo'] as const
export type OrigineQuestion = (typeof ORIGINES)[number]

export function normaliserOrigine(brut: unknown): OrigineQuestion | null {
  return typeof brut === 'string' && (ORIGINES as readonly string[]).includes(brut)
    ? (brut as OrigineQuestion)
    : null
}

/** Ce que la couleur d'un dossier ou d'une question DIT de son contenu. */
export type TeinteContenu = 'pdf' | 'flashcard' | 'neutre'

type QuestionTeintable = { type: string; origine: OrigineQuestion | null }

/** La teinte d'UNE question : le PDF l'emporte, puis la flashcard. */
export function teinteQuestion(q: QuestionTeintable): TeinteContenu {
  if (q.origine === 'pdf') return 'pdf'
  if (q.type === 'flashcard') return 'flashcard'
  return 'neutre'
}

/**
 * La teinte d'un DOSSIER, d'après ses questions (sous-dossiers inclus) :
 * rouge dès qu'un PDF y a été inséré, violet s'il contient des flashcards,
 * neutre sinon. Un dossier vide est neutre.
 */
export function teinteDossier(questions: readonly QuestionTeintable[]): TeinteContenu {
  let flashcard = false
  for (const q of questions) {
    const t = teinteQuestion(q)
    if (t === 'pdf') return 'pdf'
    if (t === 'flashcard') flashcard = true
  }
  return flashcard ? 'flashcard' : 'neutre'
}
