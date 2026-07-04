'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

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
