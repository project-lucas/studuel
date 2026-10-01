import { redirect } from 'next/navigation'

// LES FLASHCARDS DE CHAPITRE N'EXISTENT PLUS (01/10/2026, Lucas : « quiz et
// flashcards sont la même chose, pourquoi garder les deux si ce sont les mêmes
// questions »). Les cartes étaient fabriquées depuis les questions du quiz —
// recto l'énoncé, verso la bonne réponse — : le même contenu sans ses
// propositions. Le quiz reste, ses questions ratées reviennent dans « Mes
// erreurs », et ce qui s'apprend par cœur est porté par la Fiche. L'URL reste
// valide pour les anciens liens et l'historique des navigateurs : elle renvoie
// à l'écran de chapitre, là où l'élève choisit (même règle que l'ancien Défi
// de leçon, `../defi`).
export default async function LessonFlashcardsPage({
  params,
}: {
  params: Promise<{ subject: string; chapter: string; lesson: string }>
}) {
  const { subject, chapter } = await params
  redirect(`/reviser/${subject}/${chapter}`)
}
