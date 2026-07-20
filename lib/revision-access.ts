import type { SupabaseClient } from '@supabase/supabase-js'

// Accès aux fiches de révision — la partie qui touche la base.
//
// Même architecture que `lib/mind-map-access.ts`, et pour la même raison : le
// CONTENU d'une fiche (`lessons.revision_sheet`) est du payant. La migration
// 185 en révoque la lecture pour `anon` et `authenticated`, si bien qu'une
// requête directe (faisable par n'importe qui avec la clé anon publique) ne
// renvoie plus rien. Le seul chemin restant est la RPC `lesson_revision_sheet`,
// qui revérifie côté serveur les trois portes d'accès : administrateur,
// abonnement, ou chapitre déverrouillé à la gemme.
//
// L'EXISTENCE d'une fiche n'est pas un secret (la tuile du hub de leçon
// l'affiche à tout le monde) : elle vit dans la colonne générée
// `has_revision_sheet`.
//
// Les deux fonctions tolèrent une base où les migrations 184/185 ne sont pas
// encore passées — le code doit être déployé AVANT elles, sinon Réviser casse
// le temps du déploiement.

/**
 * Contenu d'une fiche. Renvoie `null` si la leçon n'en a pas OU si l'appelant
 * n'y a pas droit — l'autorisation est vérifiée par la RPC, donc côté serveur :
 * l'appel n'est pas contournable en bidouillant le client.
 */
export async function fetchRevisionSheet(
  supabase: SupabaseClient,
  lessonId: string,
): Promise<string | null> {
  const { data, error } = await supabase.rpc('lesson_revision_sheet', {
    p_lesson_id: lessonId,
  })

  if (!error) {
    const sheet = typeof data === 'string' ? data : null
    return sheet && sheet.trim().length > 0 ? sheet : null
  }

  // Repli transitoire : migration 184 pas encore exécutée (RPC absente). La 185
  // n'est pas passée non plus, donc `revision_sheet` est encore lisible.
  const { data: legacy } = await supabase
    .from('lessons')
    .select('revision_sheet')
    .eq('id', lessonId)
    .maybeSingle<{ revision_sheet: string | null }>()

  const sheet = legacy?.revision_sheet ?? null
  return sheet && sheet.trim().length > 0 ? sheet : null
}

/**
 * La leçon a-t-elle une fiche ? Lit la colonne générée, jamais le texte.
 * Utilisé par le hub de leçon, qui affiche la tuile à tout le monde — abonné
 * ou non — et laisse la page de la fiche gérer le déverrouillage.
 */
export async function lessonHasRevisionSheet(
  supabase: SupabaseClient,
  lessonId: string,
): Promise<boolean> {
  const { data, error } = await supabase
    .from('lessons')
    .select('has_revision_sheet')
    .eq('id', lessonId)
    .maybeSingle<{ has_revision_sheet: boolean }>()

  if (!error) return Boolean(data?.has_revision_sheet)

  // Repli transitoire : migration 184 pas encore exécutée (colonne absente).
  const { data: legacy } = await supabase
    .from('lessons')
    .select('revision_sheet')
    .eq('id', lessonId)
    .maybeSingle<{ revision_sheet: string | null }>()

  return Boolean(legacy?.revision_sheet && legacy.revision_sheet.trim())
}
