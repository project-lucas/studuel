import type { SupabaseClient } from '@supabase/supabase-js'
import { lireFichesAchetees, type FicheAchetee } from '@/lib/bibliotheque'
import { getSubjectsCached } from '@/lib/catalog'
import { isMissingSchemaObject } from '@/lib/schema-fallback'

// -----------------------------------------------------------------------------
// Les lectures de « Ma bibliothèque » qui ne sont ni le carnet ni les capsules
// (celles-là ont leurs modules). Séparées de lib/bibliotheque.ts, qui reste pur
// et importable par les composants clients sans embarquer supabase-js.
// -----------------------------------------------------------------------------

type LigneDeblocage = {
  chapter_id: string
  created_at: string | null
  chapter: Record<string, unknown> | Record<string, unknown>[] | null
}

/**
 * Les fiches de révision achetées : les chapitres débloqués en gemmes (ou
 * offerts), `chapter_unlocks` (183), avec leur chapitre joint.
 *
 * UNE lecture bornée à l'élève (clé primaire `user_id, chapter_id`) et le
 * catalogue des matières, qui vient du cache serveur — lancées ensemble.
 * `theme` (234) est relu sans lui si la base ne le connaît pas ; toute autre
 * panne rend une liste vide : le rayon affiche son invitation, rien ne casse.
 */
export async function lireMesFichesAchetees(
  supabase: SupabaseClient,
  userId: string,
): Promise<FicheAchetee[]> {
  const lire = (colonnes: string) =>
    supabase
      .from('chapter_unlocks')
      .select(`chapter_id, created_at, chapter:chapters(${colonnes})`)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .returns<LigneDeblocage[]>()

  const [premiere, matieres] = await Promise.all([
    lire('id, title, position, subject_id, theme'),
    getSubjectsCached(),
  ])
  let { data, error } = premiere
  if (error && isMissingSchemaObject(error)) {
    ;({ data, error } = await lire('id, title, position, subject_id'))
  }
  if (error) {
    console.error('[bibliotheque] fiches achetées illisibles :', error.message)
    return []
  }
  if (!data?.length) return []
  // Cache froid sans la lecture anonyme du catalogue (026) : les matières se
  // relisent avec la session, sinon chaque fiche serait écartée.
  if (matieres.length === 0) {
    const { data: lues } = await supabase
      .from('subjects')
      .select('id, slug, name')
      .returns<{ id: string; slug: string; name: string }[]>()
    return lireFichesAchetees(data, lues ?? [])
  }
  return lireFichesAchetees(data, matieres)
}
