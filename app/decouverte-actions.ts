'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { estCleDecouverte } from '@/lib/decouverte/catalogue'

// -----------------------------------------------------------------------------
// La découverte progressive (25/10/2026, cadrage « le jeu vivant » § E) : UNE
// action, appelée à la fin d'un mini-tour. Le serveur seul écrit, par
// `decouverte_marquer` (601), bornée aux clés du catalogue.
//
// Pas de `refresh()` : rien à l'écran ne dépend de cette ligne tout de suite
// (le navigateur se souvient du tour joué, components/decouverte/store), et un
// rafraîchissement en fin de tour ferait recalculer l'onglet pour rien.
// -----------------------------------------------------------------------------

export type VerdictDecouverte = 'ok' | 'deja' | 'inconnue' | 'anonyme' | 'indisponible'

export async function marquerDecouverte(cle: string): Promise<VerdictDecouverte> {
  if (!estCleDecouverte(cle)) return 'inconnue'
  const [supabase, user] = await Promise.all([createClient(), getCurrentUser()])
  if (!user) return 'anonyme'
  // Tolérante : tant que la 601 dort, la RPC manque (PGRST202) — le tour a
  // quand même été joué, le navigateur s'en souvient.
  const { data, error } = await supabase.rpc('decouverte_marquer', { p_cle: cle })
  if (error) return 'indisponible'
  if (data === 'ok' || data === 'deja' || data === 'inconnue' || data === 'anonyme') return data
  return 'indisponible'
}
