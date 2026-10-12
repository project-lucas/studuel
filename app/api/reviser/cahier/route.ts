import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { getSubjectsCached } from '@/lib/catalog'
import { contentLevelOf } from '@/lib/subject-visibility'
import { chargerCahierMatiere } from '@/lib/exercices/cahier-matiere-server'

// LE CAHIER D'EXERCICES D'UNE MATIÈRE, lu quand l'élève ouvre la porte
// « Exercices » de son dossier (components/reviser/CahierMatiere).
//
// Route API en lecture, et pas une Server Action : Next exécute les actions une
// par une, et celle-ci ferait la queue derrière une fiche qu'on déplie. Ni un
// rendu de la page : la plupart des visites n'ouvrent pas cette porte, la page
// de la matière n'a pas à lire le cahier pour elles.
//
// Rien à falsifier : la matière vient du catalogue, le niveau du profil de la
// session, et la RLS borne les résultats à l'élève.
export async function GET(request: Request): Promise<Response> {
  const slug = new URL(request.url).searchParams.get('matiere')
  if (!slug) return new Response(null, { status: 400 })

  const user = await getCurrentUser()
  if (!user) return new Response(null, { status: 401 })

  const supabase = await createClient()
  const [{ data: profil }, matieres] = await Promise.all([
    supabase
      .from('profiles')
      .select('grade_level')
      .eq('id', user.id)
      .maybeSingle<{ grade_level: string | null }>(),
    getSubjectsCached(),
  ])
  const matiere = matieres.find((m) => m.slug === slug)
  if (!matiere || !profil?.grade_level) return new Response(null, { status: 404 })

  const cahier = await chargerCahierMatiere(
    supabase,
    user.id,
    { id: matiere.id, slug: matiere.slug },
    contentLevelOf(matiere, profil.grade_level),
  )
  // Tables absentes ou panne : l'écran dit qu'il n'a pas pu ouvrir le cahier.
  if (!cahier) return new Response(null, { status: 204 })

  return Response.json({ cahier }, { headers: { 'Cache-Control': 'no-store' } })
}
