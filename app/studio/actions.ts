'use server'

import { createClient } from '@/lib/supabase/server'

// Enregistre une session de flashcards terminée (série + heatmap Habitude).
// Visiteur non connecté : rien n'est enregistré, sans erreur.
export async function recordStudySession(
  deckId: string,
  cardsCount: number,
): Promise<{ saved: boolean }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { saved: false }

  const { error } = await supabase.from('study_sessions').insert({
    user_id: user.id,
    deck_id: deckId,
    cards_count: cardsCount,
  })

  return { saved: !error }
}
