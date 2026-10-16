import { redirect } from 'next/navigation'
import EcranExamen from '@/components/examen/EcranExamen'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { getUserTierFor } from '@/lib/subscription'
import { isPremiumTier } from '@/lib/gems'
import { readRowTolerant } from '@/lib/profile-read'
import { examenDe } from '@/lib/examen/parcours'

export const metadata = { title: 'Mode examen — Studuel' }
export const dynamic = 'force-dynamic'

// LE MODE EXAMEN. Depuis le 16/10/2026, il vit dans le bureau de Marcel, onglet
// « Examen » (components/examen/onglet, lib/examen/onglet-server) : en 3e, 1re
// et terminale, cette adresse y mène. Elle ne garde que l'écran des classes
// sans examen cette année (« chaque chapitre bien appris est déjà de l'avance »).
export default async function PageExamen() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  const supabase = await createClient()

  const [profil, tier] = await Promise.all([
    readRowTolerant<{ grade_level: string | null }>(supabase, 'profiles', 'id', user.id, ['grade_level']),
    getUserTierFor(supabase, user.id),
  ])
  if (examenDe(profil?.grade_level ?? null)) redirect('/marcel?onglet=examen')

  return <EcranExamen examen={null} jours={0} premium={isPremiumTier(tier)} objectifs={[]} annales={[]} />
}
