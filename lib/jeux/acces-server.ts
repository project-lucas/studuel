import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUserTierFor } from '@/lib/subscription'
import { isPremiumTier } from '@/lib/gems'
import { LIEN_STUDUEL_PLUS, jeuLibre } from '@/lib/jeux/acces'

/**
 * La garde serveur des routes d'un jeu de salon (/defi/jeux/[jeu]/…) : un jeu
 * réservé à Studuel+ renvoie l'élève non abonné vers la Boutique, où Studuel+
 * ouvre la page. Le billet verrouillé y mène déjà ; cette garde empêche le
 * lien profond de le contourner. Un jeu libre ne coûte aucune requête.
 */
export async function exigerAccesJeu(userId: string, gameId: string): Promise<void> {
  if (jeuLibre(gameId)) return
  const supabase = await createClient()
  const tier = await getUserTierFor(supabase, userId)
  if (!isPremiumTier(tier)) redirect(LIEN_STUDUEL_PLUS)
}
