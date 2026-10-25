import { redirect } from 'next/navigation'
import EcranPlus from '@/components/plus/EcranPlus'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { getUserTierFor } from '@/lib/subscription'
import { isPremiumTier } from '@/lib/gems'
import { readRowTolerant } from '@/lib/profile-read'
import { toDayKey } from '@/lib/streak'
import { lireRente } from '@/lib/studuel-plus/rente-server'
import { etatsDesPiliers } from '@/lib/studuel-plus/etats'
import { examenDe, joursAvantExamen } from '@/lib/examen/parcours'
import { ANNALES_CORRIGEES } from '@/lib/annales-corrigees/registre'
import { estAppPlay } from '@/lib/canal-server'

export const metadata = { title: 'Studuel+ — Studuel' }
export const dynamic = 'force-dynamic'

// STUDUEL+ — la page de l'abonnement (écran : components/plus/EcranPlus).
// UNE vague : profil, abonnement, rente et crédits partent ensemble.
// Aperçu sans compte : /dev/plus.
export default async function PagePlus() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  const supabase = await createClient()

  const [profil, tier, rente, { data: credits }, appPlay] = await Promise.all([
    readRowTolerant<{ grade_level: string | null }>(supabase, 'profiles', 'id', user.id, ['grade_level']),
    getUserTierFor(supabase, user.id),
    lireRente(supabase),
    supabase.rpc('credits_etat'),
    estAppPlay(),
  ])

  const abonne = isPremiumTier(tier)
  const classe = profil?.grade_level ?? null
  const examen = examenDe(classe)
  const c = (credits ?? {}) as { restants?: number; jetons?: number }

  return (
    <EcranPlus
      abonne={abonne}
      achatPossible={!appPlay}
      rente={rente}
      etatDe={etatsDesPiliers({
        abonne,
        classe,
        creditsRestants: Number(c.restants ?? 0),
        creditsRecharge: Number(c.jetons ?? 0),
        examen: examen ? { nom: examen.nom, jours: joursAvantExamen(examen, toDayKey(new Date())) } : null,
        annales: ANNALES_CORRIGEES.length,
      })}
    />
  )
}
