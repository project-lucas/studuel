import type { SupabaseClient } from '@supabase/supabase-js'
import { isMissingSchemaObject } from './schema-fallback'

// Les chapitres que l'élève a déclarés « vus en cours » (migration 224).
//
// Le lecteur vit ici, seul, parce que DEUX écrans en dépendent : l'onglet Marcel
// (le tableau Progrès) et l'accueil Réviser (les couronnes des cartes matières).
// Les deux calculent le pourcentage d'une matière avec la même fonction
// (`lib/progression.ts`) ; il fallait qu'ils lisent aussi la même donnée, sans
// quoi le partage de la définition n'aurait servi à rien.
//
// TOLÉRANT À LA MIGRATION ABSENTE. Tant que la 224 n'est pas exécutée, la
// requête échoue sur une table inconnue : on renvoie un ensemble vide plutôt que
// de faire tomber la page. L'app retombe alors exactement sur son comportement
// d'avant — seuls les chapitres travaillés dans l'app comptent comme commencés.

export async function getChapitresVus(
  supabase: SupabaseClient,
  userId: string,
): Promise<Set<string>> {
  const { data, error } = await supabase
    .from('chapitres_vus')
    .select('chapter_id')
    .eq('user_id', userId)

  if (error) {
    if (!isMissingSchemaObject(error)) {
      // Une vraie panne mérite une trace côté serveur : sans elle, le tableau
      // afficherait silencieusement « rien de commencé » pour tout le monde.
      console.error('[chapitres-vus] lecture impossible:', error.message)
    }
    return new Set()
  }

  return new Set((data ?? []).map((row) => String(row.chapter_id)))
}
