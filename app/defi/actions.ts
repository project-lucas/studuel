'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

// Enregistre un défi terminé : compte pour la série, les habitudes et l'XP.
export async function recordChallenge(
  score: number,
  total: number,
  xp: number,
): Promise<{ saved: boolean }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { saved: false }

  const clean = (n: number, max: number) =>
    Number.isFinite(n) ? Math.max(0, Math.min(Math.round(n), max)) : 0

  const { error } = await supabase.from('challenge_sessions').insert({
    user_id: user.id,
    score: clean(score, 50),
    total: clean(total, 50),
    xp: clean(xp, 500),
  })

  revalidatePath('/defi')
  return { saved: !error }
}
