import { lireNonLus } from '@/lib/courrier-server'
import { getServerAuth } from '@/lib/supabase/user'

// LE COMPTE DU COURRIER NON LU, POUR LE BOUTON FLOTTANT (25/10/2026, migration
// 602). Comme `/api/quetes` : une route GET et pas une Server Action — Next
// exécute les actions une par une, une relecture ferait la queue devant les
// vraies actions de l'écran. Relue au lancement et au retour dans l'app
// (components/courrier/BoutonCourrierFlottant), jamais en boucle.
export async function GET(): Promise<Response> {
  const { supabase, user } = await getServerAuth()
  if (!user) return new Response(null, { status: 401 })
  const nonLus = await lireNonLus(supabase)
  return Response.json({ nonLus }, { headers: { 'Cache-Control': 'no-store' } })
}
