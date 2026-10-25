import type { SupabaseClient } from '@supabase/supabase-js'

// -----------------------------------------------------------------------------
// La lecture serveur de la découverte progressive (migration 601) — appelée
// par TopHudLoader DANS la même vague que le porte-monnaie (Promise.all), pas
// une vague de plus.
//
// TOLÉRANTE : tant que la 601 n'est pas exécutée, la colonne manque (42703) et
// la RPC n'existe pas (PGRST202). Dans ce cas, comme pour toute erreur, on
// rend `depuis: null` = tout ouvert. Jamais un verrou par accident.
// -----------------------------------------------------------------------------

export type LectureDecouverte = {
  vues: string[]
  depuis: string | null
}

export const LECTURE_TOUT_OUVERT: LectureDecouverte = { vues: [], depuis: null }

export async function lireEtatDecouverte(
  supabase: SupabaseClient,
  userId: string,
): Promise<LectureDecouverte> {
  const [profil, vues] = await Promise.all([
    supabase.from('profiles').select('decouverte_depuis').eq('id', userId).maybeSingle(),
    supabase.rpc('mes_decouvertes'),
  ])
  if (profil.error || vues.error) return LECTURE_TOUT_OUVERT
  const depuis = (profil.data as { decouverte_depuis?: string | null } | null)?.decouverte_depuis ?? null
  const lignes = Array.isArray(vues.data) ? (vues.data as { cle?: unknown }[]) : []
  return {
    vues: lignes.map((l) => l.cle).filter((c): c is string => typeof c === 'string'),
    depuis,
  }
}
