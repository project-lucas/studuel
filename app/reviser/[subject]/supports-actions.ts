'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { CHAPTER_COLUMNS, type Chapter, type Subject } from '@/lib/types'
import type { SupportChip } from '@/lib/subject-template'
import { loadChapterSupports } from './[chapter]/supports'

/**
 * Les supports d'un chapitre (Cours · Quiz · Flashcards · Carte mentale · Défi),
 * chargés À LA DEMANDE quand l'élève déplie sa fiche dans la liste.
 *
 * POURQUOI À LA DEMANDE. Ouvrir un chapitre menait à une page entière — un
 * rendu serveur complet, un écran de chargement, un retour en arrière pour
 * changer d'avis. Les tuiles vivent maintenant sous la ligne, dans la liste.
 * Mais les charger d'avance pour TOUTE la matière coûterait huit requêtes par
 * chapitre, soit près de trois cents sur un programme de trente-six fiches :
 * la page deviendrait lente pour tout le monde afin de servir la fiche qu'un
 * élève ouvre. Une fiche dépliée = un aller-retour, et le client le garde.
 *
 * Le slug est revérifié par la jointure : un chapitre demandé sous la mauvaise
 * matière n'existe pas. Rend [] plutôt qu'une erreur — la ligne affiche alors
 * « pas encore de contenu », elle ne casse pas la liste.
 */
export async function chapterSupports(
  subjectSlug: string,
  chapterId: string,
): Promise<SupportChip[]> {
  const user = await getCurrentUser()
  if (!user) return []

  const supabase = await createClient()
  type Row = Chapter & { subject: Subject | null }
  const { data: row } = await supabase
    .from('chapters')
    .select(`${CHAPTER_COLUMNS}, subject:subjects!inner(*)`)
    .eq('id', chapterId)
    .eq('subjects.slug', subjectSlug)
    .maybeSingle<Row>()
  if (!row?.subject) return []

  const { subject, ...chapter } = row
  return loadChapterSupports(supabase, user.id, subject.slug, chapter as Chapter)
}
