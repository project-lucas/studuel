'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export type BasculeStuduelPlus =
  | { ok: true; studuelPlus: boolean }
  | { ok: false; erreur: string }

/**
 * La bascule Studuel+ ↔ gratuit d'un compte COACH ou ADMIN, sur lui-même
 * (RPC `basculer_studuel_plus_test`, migration 561) : Lucas vérifie les deux
 * faces de l'app avec un seul compte. Un autre compte reçoit une erreur de la
 * base et rien ne change. Toute l'app lit l'abonnement : on rafraîchit tout.
 */
export async function basculerStuduelPlusTest(): Promise<BasculeStuduelPlus> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('basculer_studuel_plus_test')
  if (error) {
    console.error('[compte] bascule Studuel+ refusée :', error.message)
    return {
      ok: false,
      erreur: error.message.includes('coach_requis')
        ? 'Réservé aux comptes coach et admin.'
        : 'La bascule n’a pas pris. Réessaie dans un instant.',
    }
  }
  revalidatePath('/', 'layout')
  return { ok: true, studuelPlus: data !== 'free' }
}
