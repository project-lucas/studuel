'use server'

import { createClient } from '@/lib/supabase/server'

// Enregistre une session de test terminée (alimente la heatmap Habitude).
// Visiteur non connecté : on n'enregistre rien, sans erreur.
export async function recordTestSession(
  quizId: string,
  score: number,
  total: number,
): Promise<{ saved: boolean }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { saved: false }

  const { error } = await supabase.from('test_sessions').insert({
    user_id: user.id,
    quiz_id: quizId,
    score,
    total,
  })

  return { saved: !error }
}
