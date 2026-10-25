import type { SupabaseClient } from '@supabase/supabase-js'
import { boiteDepuis, type Lettre } from '@/lib/courrier'

// -----------------------------------------------------------------------------
// LE COURRIER — la lecture (25/10/2026, migration 602). UNE vague : la RPC
// `courrier_boite()` rend les lettres, les diffusions (588) et les défis reçus
// (558) en un seul aller-retour ; `courrier_non_lus()` le compte du badge.
// Tant que la 602 n'est pas en base (PGRST202), la boîte se dit « pas encore
// ouverte » et le badge reste à zéro : rien ne casse.
// -----------------------------------------------------------------------------

export type BoiteCourrier = {
  lettres: Lettre[]
  /** Faux tant que la migration 602 n'est pas exécutée. */
  disponible: boolean
}

export async function lireBoite(supabase: SupabaseClient): Promise<BoiteCourrier> {
  const { data, error } = await supabase.rpc('courrier_boite')
  if (error) {
    if (error.code !== 'PGRST202') console.error('[courrier] boîte non lue :', error.message)
    return { lettres: [], disponible: false }
  }
  return { lettres: boiteDepuis(data), disponible: true }
}

/** Le compte du badge ; 0 sans migration ou sans session. */
export async function lireNonLus(supabase: SupabaseClient): Promise<number> {
  const { data, error } = await supabase.rpc('courrier_non_lus')
  if (error) {
    if (error.code !== 'PGRST202') console.error('[courrier] non-lus non lus :', error.message)
    return 0
  }
  const n = Number(data)
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0
}
