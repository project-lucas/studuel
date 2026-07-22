import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

// L'écran intermédiaire de chapitre (carte mentale + liste de leçons) a été
// retiré : ouvrir un chapitre mène directement au cours de sa première leçon.
// L'URL /reviser/[subject]/[chapter] reste valide (liens depuis la page
// matière, l'examen blanc, les sessions à reprendre, lib/next-exam…).
export default async function ChapterPage({
  params,
}: {
  params: Promise<{ subject: string; chapter: string }>
}) {
  const { subject: slug, chapter: chapterId } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Slug vérifié via la jointure ; seule la première leçon (position) compte.
  const { data: row } = await supabase
    .from('chapters')
    .select('id, subject:subjects!inner(slug), lessons(id)')
    .eq('id', chapterId)
    .eq('subjects.slug', slug)
    .order('position', { ascending: true, referencedTable: 'lessons' })
    .limit(1, { referencedTable: 'lessons' })
    .maybeSingle<{ id: string; lessons: { id: string }[] }>()
  if (!row) notFound()

  const first = row.lessons[0]
  // Chapitre encore sans leçon : retour à la page matière plutôt qu'un écran vide.
  if (!first) redirect(`/reviser/${slug}`)
  redirect(`/reviser/${slug}/${chapterId}/${first.id}/cours`)
}
