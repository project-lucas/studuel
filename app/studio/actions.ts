'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { validateRevisionToday } from '@/lib/habits'

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

  // Borne serveur : cards_count alimente l'XP (5 XP/carte), max 200 par session.
  const clean = Number.isFinite(cardsCount)
    ? Math.max(0, Math.min(Math.round(cardsCount), 200))
    : 0

  const { error } = await supabase.from('study_sessions').insert({
    user_id: user.id,
    deck_id: deckId,
    cards_count: clean,
  })

  // Coche « Révision quotidienne » du jour tout de suite si le seuil est atteint.
  if (!error) {
    await validateRevisionToday(supabase, user.id)
    revalidatePath('/moi')
  }

  return { saved: !error }
}
