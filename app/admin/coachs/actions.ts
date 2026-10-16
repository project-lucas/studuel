'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const REPONSES: Record<string, string> = {
  ok: 'C’est fait : ce compte est coach. Il voit l’espace coach à sa prochaine visite.',
  introuvable: 'Aucun compte avec cet e-mail. La personne doit d’abord créer son compte Studuel.',
  deja: 'Ce compte est déjà coach.',
  parent: 'C’est un compte parent : il ne peut pas devenir coach.',
  refuse: 'Réservé à l’administration.',
}

/** Nommer un coach par son e-mail (la base vérifie que je suis admin). */
export async function nommerCoachAction(email: string): Promise<{ ok: boolean; message: string }> {
  const e = email.trim()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return { ok: false, message: 'E-mail invalide.' }
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('admin_nommer_coach', { p_email: e })
  if (error) return { ok: false, message: 'La migration 591 n’est pas exécutée.' }
  revalidatePath('/admin/coachs')
  return { ok: data === 'ok', message: REPONSES[String(data)] ?? 'Réponse inattendue.' }
}

export async function retirerCoachAction(id: string): Promise<boolean> {
  if (!UUID.test(id)) return false
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('admin_retirer_coach', { p_user: id })
  revalidatePath('/admin/coachs')
  return !error && data === true
}
