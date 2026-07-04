'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

// Marque une leçon comme terminée : le chapitre progresse (plancher 30 %)
// et la journée est validée dans la série.
export async function completeLesson(
  lessonId: string,
): Promise<{ saved: boolean }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { saved: false }

  const { error } = await supabase
    .from('lesson_completions')
    .upsert(
      { user_id: user.id, lesson_id: lessonId },
      { onConflict: 'user_id,lesson_id', ignoreDuplicates: true },
    )

  revalidatePath('/reviser')
  return { saved: !error }
}

// Persiste la sélection de matières de l'élève (bouton « Éditer »).
export async function saveSelectedSubjects(slugs: string[]): Promise<void> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  const clean = Array.from(
    new Set(slugs.filter((s) => typeof s === 'string' && s.length < 64)),
  )

  await supabase
    .from('profiles')
    .update({ selected_subjects: clean })
    .eq('id', user.id)

  revalidatePath('/reviser')
}
