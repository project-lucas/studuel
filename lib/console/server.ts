import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'

export type RolesConsole = { coach: boolean; admin: boolean; prenom: string | null; userId: string | null }

/**
 * Qui entre dans la console : un coach (`profile_type = 'coach'`, 560) ou un
 * admin (`is_admin`, 028). Une seule lecture du profil.
 */
export async function lireRolesConsole(): Promise<RolesConsole> {
  const user = await getCurrentUser()
  if (!user) return { coach: false, admin: false, prenom: null, userId: null }
  const supabase = await createClient()
  const { data } = await supabase
    .from('profiles')
    .select('profile_type, is_admin, full_name')
    .eq('id', user.id)
    .maybeSingle<{ profile_type: string | null; is_admin: boolean | null; full_name: string | null }>()
  const admin = data?.is_admin === true
  return { coach: admin || data?.profile_type === 'coach', admin, prenom: data?.full_name ?? null, userId: user.id }
}
