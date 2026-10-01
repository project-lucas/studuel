// -----------------------------------------------------------------------------
// LE MANUEL NUMÉRIQUE, lu en base — le livre du thème auquel appartient un
// chapitre (lib/exercices/livre.ts pour la logique pure).
//
// Trois lectures, toutes bornées : le chapitre (son thème), les chapitres du
// même thème (même matière, même niveau), puis — en une vague — les exercices
// de ces chapitres et les résultats de l'élève. Un chapitre sans thème forme à
// lui seul un livre d'un chapitre. `null` si la 372 manque (tables absentes).
// -----------------------------------------------------------------------------

import type { SupabaseClient } from '@supabase/supabase-js'
import { construireLivre, type Livre, type PageSource } from './livre'
import { etatsExercices, type ResultatEleve } from './progression'
import type { Etoiles } from './types'

type RangChapitre = { id: string; title: string; position: number; level: string; subject_id: string; theme: string | null }
type RangExercice = { id: string; chapter_id: string; position: number; etoiles: number; titre: string | null }
type RangResultat = { exercice_id: string; reussi: boolean }

const etoiles = (n: number): Etoiles => (n >= 3 ? 3 : n <= 1 ? 1 : 2)

export async function chargerLivre(
  supabase: SupabaseClient,
  matiere: string,
  chapitreId: string,
  userId: string,
): Promise<Livre | null> {
  const { data: chapitre } = await supabase
    .from('chapters')
    .select('id, title, position, level, subject_id, theme')
    .eq('id', chapitreId)
    .maybeSingle<RangChapitre>()
  if (!chapitre) return null

  let chapitres: RangChapitre[] = [chapitre]
  if (chapitre.theme) {
    const { data } = await supabase
      .from('chapters')
      .select('id, title, position, level, subject_id, theme')
      .eq('subject_id', chapitre.subject_id)
      .eq('level', chapitre.level)
      .eq('theme', chapitre.theme)
      .order('position', { ascending: true })
      .order('id', { ascending: true })
      .returns<RangChapitre[]>()
    if (data?.length) chapitres = data
  }
  const ids = chapitres.map((c) => c.id)

  const [{ data: exercices, error }, { data: resultats }] = await Promise.all([
    supabase
      .from('exercices')
      .select('id, chapter_id, position, etoiles, titre:contenu->>titre')
      .in('chapter_id', ids)
      .order('position', { ascending: true })
      .returns<RangExercice[]>(),
    supabase
      .from('exercice_resultats')
      .select('exercice_id, reussi')
      .eq('user_id', userId)
      .in('chapter_id', ids)
      .returns<RangResultat[]>(),
  ])
  if (error || !exercices) return null

  const reussis = new Map<string, Pick<ResultatEleve, 'reussi'>>((resultats ?? []).map((r) => [r.exercice_id, { reussi: r.reussi }]))
  const sources: PageSource[] = []
  for (const id of ids) {
    const siens = exercices.filter((e) => e.chapter_id === id)
    const etats = etatsExercices(siens, reussis)
    for (const e of siens)
      sources.push({
        chapitreId: id,
        position: e.position,
        etoiles: etoiles(e.etoiles),
        titre: e.titre ?? `Exercice ${e.position}`,
        etat: etats.get(e.id) ?? 'verrouille',
      })
  }
  return construireLivre(
    chapitre.theme ?? chapitre.title,
    matiere,
    chapitres.map((c) => ({ id: c.id, titre: c.title })),
    sources,
  )
}
