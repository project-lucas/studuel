import { redirect } from 'next/navigation'

// Le hub de leçon (tuiles Cours / Fiche / Studygram / Quiz / Carte mentale /
// Flashcards / Défis) a été retiré : la leçon, c'est son cours. L'URL reste
// valide (retour du quiz /test/[id], anciens liens) et file vers le cours,
// qui valide lui-même l'accès et l'existence de la leçon.
export default async function LessonPage({
  params,
}: {
  params: Promise<{ subject: string; chapter: string; lesson: string }>
}) {
  const { subject, chapter, lesson } = await params
  redirect(`/reviser/${subject}/${chapter}/${lesson}/cours`)
}
