import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { lireClassementAmis } from '@/lib/moi/classement-amis'

// Le classement entre amis, RELU pendant que l'onglet Moi reste ouvert (Lucas,
// 01/10/2026 : « en temps réel »). Route API en lecture, et pas une Server
// Action : Next exécute les actions une par une, une relecture périodique
// ferait la queue devant les vraies actions de l'écran — et un GET se met en
// pause tout seul quand le navigateur est en arrière-plan.
//
// Rien à falsifier : `classement_amis()` (migration 465) ne prend aucun
// paramètre et ne rend que le cercle de la session.
export async function GET(): Promise<Response> {
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) return new Response(null, { status: 401 })

  const { data, error } = await supabase.rpc('classement_amis')
  // Fonction absente ou panne : l'écran garde ce qu'il a déjà.
  if (error) return new Response(null, { status: 204 })

  return Response.json(
    { joueurs: lireClassementAmis(data) },
    { headers: { 'Cache-Control': 'no-store' } },
  )
}
