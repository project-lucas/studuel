import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { toDayKey } from '@/lib/streak'
import NavChestBadge from './NavChestBadge'

/**
 * Décide si l'onglet Coffre doit porter sa pastille d'appel : oui tant que le
 * coffre du jour n'a pas été ouvert. Rendu SOUS un <Suspense> dans le layout —
 * la barre d'onglets s'affiche immédiatement, la pastille arrive en flux et ne
 * retarde jamais la navigation (même discipline que TopHudLoader).
 */
export default async function NavChestBadgeLoader() {
  // Déjà sur le Coffre : la pastille n'a plus rien à dire, l'élève y est.
  const pathname = (await headers()).get('x-pathname') ?? ''
  if (pathname === '/coffre' || pathname.startsWith('/coffre/')) return null

  const [supabase, user] = await Promise.all([createClient(), getCurrentUser()])
  if (!user) return null

  const { data, error } = await supabase
    .from('chest_opens')
    .select('date')
    .eq('user_id', user.id)
    .eq('date', toDayKey(new Date()))
    .maybeSingle()

  // Panne ou migration 018 pas encore passée : pas de pastille plutôt qu'un
  // appel à cliquer qui ne mènerait à aucune récompense.
  if (error) return null
  if (data) return null

  return <NavChestBadge />
}
