'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { gainsVerses, xpActivite } from '@/lib/wallet-server'
import type { Gain } from '@/lib/gains'

// UNE FICHE D'ENCYCLOPÉDIE LUE (557) : 5 XP, une fois par fiche, 25 par jour.
// On la lit par curiosité — c'est une toute petite récompense, à la mesure du
// geste, mais elle dit que lire, c'est aussi travailler. Appelée par le
// marqueur de la fiche après un vrai temps de lecture, jamais à l'ouverture.

const ID_FICHE = /^[a-z0-9-]{2,80}$/

export async function lireFicheEncyclopedie(id: string): Promise<Gain[]> {
  if (!ID_FICHE.test(String(id))) return []
  const user = await getCurrentUser()
  if (!user) return []
  const supabase = await createClient()
  return gainsVerses(await xpActivite(supabase, 'encyclo', id))
}
