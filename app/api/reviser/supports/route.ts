import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { CHAPTER_COLUMNS, type Chapter, type Subject } from '@/lib/types'
import { loadChapterSupports } from '@/app/reviser/[subject]/[chapter]/supports'

// LES SUPPORTS D'UNE FICHE (Cours · Fiche · Quiz · Exercice · Mes erreurs),
// lus quand l'élève déplie sa ligne dans le sommaire — ou juste AVANT, quand
// son doigt se pose (components/reviser/useSupportsDeFiche).
//
// Une route GET et plus une Server Action (12/10/2026, Lucas : « la fluidité
// d'ouverture des blocs est un peu lente ») : Next exécute les actions UNE PAR
// UNE, et celle-ci faisait la queue derrière la moindre écriture en cours ;
// une route répond en parallèle, et se précharge à l'intention.
//
// Le slug est revérifié par la jointure : un chapitre demandé sous la mauvaise
// matière n'existe pas. Rend [] plutôt qu'une erreur — la ligne affiche alors
// « pas encore de contenu », elle ne casse pas la liste.
export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url)
  const subjectSlug = url.searchParams.get('matiere')
  const chapterId = url.searchParams.get('fiche')
  if (!subjectSlug || !chapterId) return new Response(null, { status: 400 })

  const user = await getCurrentUser()
  if (!user) return new Response(null, { status: 401 })

  const supabase = await createClient()
  type Row = Chapter & { subject: Subject | null }
  const { data: row } = await supabase
    .from('chapters')
    .select(`${CHAPTER_COLUMNS}, subject:subjects!inner(*)`)
    .eq('id', chapterId)
    .eq('subjects.slug', subjectSlug)
    .maybeSingle<Row>()
  if (!row?.subject) return Response.json([], { headers: { 'Cache-Control': 'no-store' } })

  const { subject, ...chapter } = row
  const supports = await loadChapterSupports(supabase, user.id, subject.slug, chapter as Chapter)
  return Response.json(supports, { headers: { 'Cache-Control': 'no-store' } })
}
