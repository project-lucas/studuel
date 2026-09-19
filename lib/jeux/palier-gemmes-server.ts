import type { SupabaseClient } from '@supabase/supabase-js'
import { isMissingSchemaObject } from '@/lib/schema-fallback'
import { lirePalierGemmes, type EtoilesParPalier } from '@/lib/jeux/palier-gemmes'

/**
 * Les étoiles d'un jeu DÉJÀ PAYÉES en gemmes, palier par palier (table
 * `palier_gemmes`, migration 373) — ce qui permet à la carte du jeu de dire
 * « reçu » sur chaque gain, et de réclamer les étoiles pas encore payées.
 *
 * `null` quand la migration n'est pas passée : la carte affiche alors le tarif
 * de chaque palier sans rien réclamer. Toute autre erreur est journalisée et
 * rend aussi `null` — une carte sans « reçu » vaut mieux qu'une carte qui plante.
 */
export async function lireEtoilesPayees(
  supabase: SupabaseClient,
  gameId: string,
): Promise<EtoilesParPalier | null> {
  const { data, error } = await supabase
    .from('palier_gemmes')
    .select('palier, etoiles')
    .eq('game_id', gameId)
  if (error) {
    if (!isMissingSchemaObject(error)) {
      console.error('[jeux] gemmes des paliers illisibles :', error.message)
    }
    return null
  }
  // La policy ne rend que les lignes de l'élève connecté.
  return lirePalierGemmes(data)
}
