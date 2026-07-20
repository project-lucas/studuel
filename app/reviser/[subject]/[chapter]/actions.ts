'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { unlockChapter } from '@/lib/gems-access'
import { unlockMessage } from '@/lib/gems'

// Les identifiants de chapitre viennent de nos propres données (UUID). On
// valide avant de les passer à la RPC — même règle que app/amis/actions.ts.
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Dépense une gemme pour ouvrir un chapitre (tous ses supports, à vie).
 *
 * Rien n'est décidé ici : la RPC `unlock_chapter_with_gem` vérifie le solde,
 * l'abonnement et l'absence de doublon dans une seule transaction, verrou de
 * ligne compris. L'action ne fait que valider la forme de l'entrée et traduire
 * le verdict en français.
 */
export async function unlockChapterWithGem(
  chapterId: string,
): Promise<{ ok: boolean; message: string }> {
  if (!UUID_RE.test(chapterId ?? '')) return unlockMessage('not_found')

  const supabase = await createClient()
  const result = await unlockChapter(supabase, chapterId)

  if (result === 'unlocked') {
    // Le solde et l'état du chapitre changent sur tout Réviser (tuiles,
    // page chapitre, carte mentale) : on invalide la branche entière.
    revalidatePath('/reviser', 'layout')
  }
  return unlockMessage(result)
}
