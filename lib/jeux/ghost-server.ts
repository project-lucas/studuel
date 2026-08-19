import type { SupabaseClient } from '@supabase/supabase-js'

// Le FANTÔME d'un jeu : le meilleur score d'un ami, à battre.
//
// Il remplace les dix « adversaires » en dur du mode classé supprimé. Un bot
// scripté cesse de motiver dès qu'on comprend qu'il est scripté ; la ligne
// d'un ami, elle, tient parce qu'elle appartient à quelqu'un.
//
// Aucun fantôme n'est FABRIQUÉ quand il n'y en a pas : sans ami ayant joué ce
// jeu, l'écran n'en affiche pas. Inventer un adversaire pour combler le vide
// serait refaire exactement l'erreur qu'on répare.

export type GameGhost = {
  name: string
  score: number
}

/**
 * Le fantôme d'un jeu, ou null (aucun ami n'y a joué, ou la migration 238
 * n'est pas passée — l'appel est toléré, jamais bloquant).
 */
export async function fetchGameGhost(
  supabase: SupabaseClient,
  subjectSlug: string,
  gameId: string,
): Promise<GameGhost | null> {
  const { data } = await supabase.rpc('game_ghost', {
    p_subject_slug: subjectSlug,
    p_game_id: gameId,
  })

  const row = Array.isArray(data) ? data[0] : null
  if (!row) return null

  const score = Number(row.score)
  if (!Number.isFinite(score) || score <= 0) return null

  // Prénom seul : c'est déjà la règle partout ailleurs dans le social de l'app.
  const name = String(row.full_name ?? 'Un ami').split(' ')[0] || 'Un ami'
  return { name, score: Math.floor(score) }
}
