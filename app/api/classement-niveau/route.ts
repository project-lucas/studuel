import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'

// LA PLACE DANS LE NIVEAU, SORTIE DU CHEMIN CRITIQUE (30/10/2026, chantier
// latence). `my_grade_standings()` (223) balaie les sessions de quiz de TOUTE
// la cohorte du niveau : son coût grandit avec le nombre d'élèves. La page d'une
// matière l'attendait avant de s'afficher, pour une ligne de la bannière
// (« Top 10 % des 3e »). Le dossier s'ouvre désormais sans elle, et la ligne
// arrive par cette route, demandée UNE fois pour toutes les matières (la
// réponse porte la maîtrise de chacune) et gardée 30 s par le navigateur
// (`components/reviser/PlaceDansLaMatiere`). Depuis la 605, l'appel ne coûte
// plus qu'une poignée de comptages d'index.
//
// Route GET et pas Server Action : Next exécute les actions une par une, une
// lecture d'affichage ferait la queue devant les vraies actions de l'écran.
export async function GET(): Promise<Response> {
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) return new Response(null, { status: 401 })

  const { data, error } = await supabase.rpc('my_grade_standings')
  // Fonction absente ou panne : la bannière garde une ligne de moins.
  if (error) return new Response(null, { status: 204 })

  return Response.json(
    { classement: data },
    // Jamais de cache HTTP : la place gagnée en jouant doit se voir au retour.
    { headers: { 'Cache-Control': 'no-store' } },
  )
}
