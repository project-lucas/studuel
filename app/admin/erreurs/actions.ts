'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

// Vide le journal des erreurs. La policy de suppression (559) ne laisse passer
// que l'admin ; la mise en page /admin a déjà fermé la porte aux autres.
export async function viderErreursAction(): Promise<void> {
  const supabase = await createClient()
  await supabase.from('erreurs_app').delete().gte('id', 0)
  revalidatePath('/admin/erreurs')
}
