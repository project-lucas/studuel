'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

/**
 * La bascule Studuel+ ↔ gratuit d'un compte COACH ou ADMIN, sur lui-même
 * (RPC `basculer_studuel_plus_test`, migration 561) : Lucas vérifie les deux
 * faces de l'app avec un seul compte. Un autre compte reçoit une erreur de la
 * base et rien ne change. Toute l'app lit l'abonnement : on rafraîchit tout.
 */
export async function basculerStuduelPlusTest(): Promise<void> {
  const supabase = await createClient()
  await supabase.rpc('basculer_studuel_plus_test')
  revalidatePath('/', 'layout')
}
