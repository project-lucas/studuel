// -----------------------------------------------------------------------------
// LE CAHIER D'UNE MATIÈRE, lu en base — pour la porte « Exercices » du dossier
// (lib/exercices/cahier-matiere.ts pour la logique pure).
//
// Lu À LA DEMANDE, quand l'élève ouvre la porte : la page de la matière ne paie
// rien pour un cahier que la plupart des visites n'ouvrent pas. UNE vague de
// trois lectures, toutes bornées à la matière et au niveau :
//
//   · ses chapitres (titre, thème), dans l'ordre du programme ;
//   · ses exercices — filtrés PAR LA JOINTURE, pas par une liste
//     d'identifiants : le rayon des fiches de lecture en compte 260, et un
//     `.in()` de cette taille ne tient pas dans une adresse ;
//   · les exercices que l'élève a réussis, bornés de la même façon.
//
// Les exercices et les résultats sont lus par pages : 260 fiches font 780
// exercices, à portée du plafond de 1 000 lignes de PostgREST.
//
// `null` si la migration 372 manque (tables absentes) ou si la lecture échoue :
// la porte dit alors qu'elle n'a pas pu s'ouvrir, elle ne montre pas un cahier
// vide qui mentirait.
// -----------------------------------------------------------------------------

import type { SupabaseClient } from '@supabase/supabase-js'
import { toutLire } from '@/lib/postgrest-pages'
import { construireCahierMatiere, type CahierMatiere } from './cahier-matiere'
import type { Etoiles } from './types'

type RangChapitre = { id: string; title: string; theme: string | null }
type RangExercice = {
  id: string
  chapter_id: string
  position: number
  etoiles: number
  titre: string | null
}

const etoiles = (n: number): Etoiles => (n >= 3 ? 3 : n <= 1 ? 1 : 2)

/** Le filtre commun aux deux tables : la matière et le niveau, par la jointure. */
const DE_LA_MATIERE = 'chapters!inner(subject_id, level)'

export async function chargerCahierMatiere(
  supabase: SupabaseClient,
  userId: string,
  matiere: { id: string; slug: string },
  niveau: string,
): Promise<CahierMatiere | null> {
  const [chapitres, exercices, reussis] = await Promise.all([
    supabase
      .from('chapters')
      .select('id, title, theme')
      .eq('subject_id', matiere.id)
      .eq('level', niveau)
      .order('position', { ascending: true })
      .order('id', { ascending: true })
      .returns<RangChapitre[]>(),
    toutLire<RangExercice>((from, to) =>
      supabase
        .from('exercices')
        .select(`id, chapter_id, position, etoiles, titre:contenu->>titre, ${DE_LA_MATIERE}`)
        .eq('chapters.subject_id', matiere.id)
        .eq('chapters.level', niveau)
        .order('id', { ascending: true })
        .range(from, to)
        .returns<RangExercice[]>(),
    ),
    toutLire<{ exercice_id: string }>((from, to) =>
      supabase
        .from('exercice_resultats')
        .select(`exercice_id, ${DE_LA_MATIERE}`)
        .eq('user_id', userId)
        .eq('reussi', true)
        .eq('chapters.subject_id', matiere.id)
        .eq('chapters.level', niveau)
        .order('exercice_id', { ascending: true })
        .range(from, to)
        .returns<{ exercice_id: string }[]>(),
    ),
  ])
  if (chapitres.error || !chapitres.data || exercices.error) return null

  return construireCahierMatiere({
    matiere: matiere.slug,
    chapitres: chapitres.data.map((c) => ({ id: c.id, titre: c.title, theme: c.theme?.trim() || null })),
    exercices: exercices.data.map((e) => ({
      id: e.id,
      chapitreId: e.chapter_id,
      position: e.position,
      etoiles: etoiles(e.etoiles),
      titre: e.titre ?? `Exercice ${e.position}`,
    })),
    // Des résultats illisibles ne ferment pas le cahier : il s'affiche comme
    // neuf, et la page de l'exercice, elle, relit l'état exact.
    reussis: new Set(reussis.data.map((r) => r.exercice_id)),
  })
}
