import { redirect } from 'next/navigation'

// LE DÉFI SOLO DE LEÇON N'EXISTE PLUS (16/09/2026). Il jouait les mêmes
// questions que le quiz et les flashcards sous un troisième habillage, et le
// mot « Défi » désignait à la fois cette tuile et l'arène de l'onglet central.
// Le mot ne désigne plus que l'arène ; à sa place sur l'écran de chapitre,
// l'Exercice (faux contrôle IA). L'URL reste valide pour les anciens liens et
// l'historique des navigateurs : elle renvoie à l'écran de chapitre, là où
// l'élève choisit.
export default async function LessonDefiPage({
  params,
}: {
  params: Promise<{ subject: string; chapter: string; lesson: string }>
}) {
  const { subject, chapter } = await params
  redirect(`/reviser/${subject}/${chapter}`)
}
