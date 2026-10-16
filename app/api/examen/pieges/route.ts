import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { piegesParChapitre, type Piege } from '@/lib/examen/pieges'

// « TES PIÈGES » d'une épreuve (onglet Examen, feuille d'une épreuve) : les
// chapitres où l'élève se trompe le plus, d'après sa file « À revoir ». Lu
// quand la feuille s'ouvre, jamais avec le bureau : deux lectures chaînées
// (les erreurs, puis leur chapitre par la vue `question_scope`, 239).
//
// Une route GET plutôt qu'une Server Action : Next exécute les actions une par
// une, et celle-ci ne doit attendre personne. Rend [] plutôt qu'une erreur.

const SLUG = /^[a-z0-9-]{1,40}$/
const LOT = 150

export async function GET(request: Request): Promise<Response> {
  const vide = () => Response.json([] as Piege[], { headers: { 'Cache-Control': 'no-store' } })
  const matieres = (new URL(request.url).searchParams.get('matieres') ?? '')
    .split(',')
    .filter((m) => SLUG.test(m))
    .slice(0, 4)
  if (matieres.length === 0) return new Response(null, { status: 400 })

  const user = await getCurrentUser()
  if (!user) return new Response(null, { status: 401 })
  const supabase = await createClient()

  const { data: erreurs, error } = await supabase
    .from('review_items')
    .select('item_id, times_wrong, lapses')
    .eq('user_id', user.id)
    .eq('item_kind', 'question')
    .or('times_wrong.gt.0,lapses.gt.0')
    .order('times_wrong', { ascending: false })
    .limit(300)
  if (error || !erreurs?.length) return vide()

  const parQuestion = new Map<string, number>()
  for (const e of erreurs) parQuestion.set(String(e.item_id), Math.max(Number(e.times_wrong) || 0, Number(e.lapses) || 0))
  const ids = [...parQuestion.keys()]

  const portees: { question_id: string; chapter_id: string | null; subject_slug: string | null }[] = []
  for (let i = 0; i < ids.length; i += LOT) {
    const { data } = await supabase
      .from('question_scope')
      .select('question_id, chapter_id, subject_slug')
      .in('question_id', ids.slice(i, i + LOT))
      .in('subject_slug', matieres)
    if (data) portees.push(...data)
  }
  const chapitres = [...new Set(portees.map((p) => p.chapter_id).filter((c): c is string => !!c))]
  if (chapitres.length === 0) return vide()
  const { data: titres } = await supabase.from('chapters').select('id, title').in('id', chapitres.slice(0, LOT))

  return Response.json(
    piegesParChapitre(
      portees.map((p) => ({ chapitre: p.chapter_id, erreurs: parQuestion.get(String(p.question_id)) ?? 0 })),
      new Map((titres ?? []).map((t) => [t.id as string, t.title as string])),
    ),
    { headers: { 'Cache-Control': 'no-store' } },
  )
}
