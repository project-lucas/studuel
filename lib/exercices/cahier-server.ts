// -----------------------------------------------------------------------------
// LE CAHIER D'UN CHAPITRE, lu en base — pour les pages /exercice (le sommaire)
// et /exercice/<n> (le joueur).
//
// Deux lectures courtes, toutes deux bornées au chapitre : ses exercices (le
// contenu public seulement ; les clés vivent dans une table que personne ne
// lit) et les résultats de l'élève. Tant que la migration 372 n'est pas
// passée, les tables manquent : on rend `null`, et la page retombe sur le
// contrôle blanc de la 360.
// -----------------------------------------------------------------------------

import type { SupabaseClient } from '@supabase/supabase-js'
import { etatsExercices, type EtatExercice, type ResultatEleve } from './progression'
import type { Competence, Etoiles, ExercicePublic } from './types'

export type LigneCahier = {
  id: string
  position: number
  etoiles: Etoiles
  gemmes: number
  xp: number
  titre: string
  competence: Competence
  nbQuestions: number
  etat: EtatExercice
  resultat: ResultatEleve | null
}

type RangExercice = {
  id: string
  position: number
  etoiles: number
  gemmes: number
  xp: number
  nb_questions: number
  titre: string | null
  competence: string | null
}

type RangResultat = {
  exercice_id: string
  meilleur_score: number
  max: number
  reussi: boolean
  parfait: boolean
}

const etoiles = (n: number): Etoiles => (n >= 3 ? 3 : n <= 1 ? 1 : 2)

/** Le sommaire du cahier d'un chapitre, avec l'état de chaque exercice. `null` si la 372 manque. */
export async function chargerCahier(
  supabase: SupabaseClient,
  chapterId: string,
  userId: string,
): Promise<LigneCahier[] | null> {
  const [{ data: exercices, error }, { data: resultats }] = await Promise.all([
    supabase
      .from('exercices')
      .select('id, position, etoiles, gemmes, xp, nb_questions, titre:contenu->>titre, competence:contenu->>competence')
      .eq('chapter_id', chapterId)
      .order('position', { ascending: true })
      .returns<RangExercice[]>(),
    supabase
      .from('exercice_resultats')
      .select('exercice_id, meilleur_score, max, reussi, parfait')
      .eq('user_id', userId)
      .eq('chapter_id', chapterId)
      .returns<RangResultat[]>(),
  ])
  if (error || !exercices) return null

  const parId = new Map(
    (resultats ?? []).map((r) => [
      r.exercice_id,
      { reussi: r.reussi, parfait: r.parfait, meilleurScore: r.meilleur_score, max: r.max } satisfies ResultatEleve,
    ]),
  )
  const etats = etatsExercices(exercices, parId)
  return exercices.map((e) => ({
    id: e.id,
    position: e.position,
    etoiles: etoiles(e.etoiles),
    gemmes: e.gemmes,
    xp: e.xp,
    titre: e.titre ?? `Exercice ${e.position}`,
    competence: (e.competence ?? 'resoudre') as Competence,
    nbQuestions: e.nb_questions,
    etat: etats.get(e.id) ?? 'verrouille',
    resultat: parId.get(e.id) ?? null,
  }))
}

/** Le contenu public d'un exercice du chapitre, par sa position. */
export async function chargerExercice(
  supabase: SupabaseClient,
  chapterId: string,
  position: number,
): Promise<{ id: string; position: number; etoiles: Etoiles; gemmes: number; xp: number; contenu: ExercicePublic } | null> {
  const { data } = await supabase
    .from('exercices')
    .select('id, position, etoiles, gemmes, xp, contenu')
    .eq('chapter_id', chapterId)
    .eq('position', position)
    .maybeSingle<{ id: string; position: number; etoiles: number; gemmes: number; xp: number; contenu: ExercicePublic }>()
  if (!data) return null
  return { ...data, etoiles: etoiles(data.etoiles) }
}
