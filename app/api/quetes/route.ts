import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { queteServie, questViews, type QuetesDuJour } from '@/lib/quests'
import { advanceQuests, fetchClaimedQuestIds, fetchQuestViews } from '@/lib/quests-server'
import { toDayKey } from '@/lib/streak'

// LES QUÊTES DU JOUR, POUR LE BANDEAU (03/10/2026). La pastille « 1/3 » vit
// dans le bandeau, sur tous les onglets : elle relit les quêtes à chaque
// changement d'écran (components/quetes/QuetesVeille) et annonce celle qui
// vient de se terminer. Une route GET et pas une Server Action : Next exécute
// les actions une par une, une relecture ferait la queue devant les vraies
// actions de l'écran.
//
// Trois lectures en une vague : le profil (contexte du tirage), la
// progression du jour, les quêtes déjà encaissées.
export async function GET(): Promise<Response> {
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) return new Response(null, { status: 401 })

  const jour = toDayKey(new Date())
  const [vuesLues, encaissees] = await Promise.all([
    fetchQuestViews(supabase, user.id, jour),
    fetchClaimedQuestIds(supabase, user.id, jour),
  ])
  // LA MISSION « SE CONNECTER » (577, Lucas : « se connecter, facile, rapide »)
  // compte ICI, au premier passage du jour : le bandeau relit les quêtes dès le
  // lancement, sur tous les onglets. Une écriture par jour, jamais plus — la
  // quête faite, rien ne bouge.
  let vues = vuesLues
  if (vues.some((v) => v.def.kind === 'connexion' && !v.done)) {
    const avance = await advanceQuests(supabase, user.id, { connexions: 1 }, jour)
    vues = questViews(jour, user.id, avance.progress)
  }
  const corps: QuetesDuJour = { jour, quetes: vues.map(queteServie), encaissees }
  return Response.json(corps, { headers: { 'Cache-Control': 'no-store' } })
}
