'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { validateRevisionToday, validateCommuteToday } from '@/lib/habits'
import { awardQuizProgression } from '@/lib/wallet-server'

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

  // Bornes serveur (le score alimente l'XP et les badges) : total 0..50,
  // score 0..total. Toute valeur aberrante est ramenée dans la plage.
  const clean = (n: number, max: number) =>
    Number.isFinite(n) ? Math.max(0, Math.min(Math.round(n), max)) : 0
  const cleanTotal = clean(total, 50)
  const cleanScore = clean(score, cleanTotal)

  const { error } = await supabase.from('test_sessions').insert({
    user_id: user.id,
    quiz_id: quizId,
    score: cleanScore,
    total: cleanTotal,
  })

  // Coche « Révision quotidienne » (et « Test sur trajets » si on est en
  // créneau) du jour tout de suite si le seuil est atteint, puis verse
  // l'XP du portefeuille (+ la gemme des 3 couronnes si le chapitre vient
  // d'être complété — vérifié en SQL).
  if (!error) {
    await Promise.all([
      validateRevisionToday(supabase, user.id),
      validateCommuteToday(supabase, user.id),
      awardQuizProgression(supabase, cleanScore, cleanTotal, quizId),
    ])
    revalidatePath('/moi')
    revalidatePath('/reviser')
  }

  return { saved: !error }
}
