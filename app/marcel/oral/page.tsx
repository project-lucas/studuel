import { redirect } from 'next/navigation'
import BackButton from '@/components/BackButton'
import OralAtelier from '@/components/marcel/OralAtelier'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { readRowTolerant } from '@/lib/profile-read'
import { getAmisPourOral, getOralSnapshot } from '@/lib/coach/oral-server'
import { epreuveParDefaut } from '@/lib/coach/oral'

export const metadata = { title: 'Répéter à voix haute — Studuel' }
export const dynamic = 'force-dynamic'

// L'atelier d'oral (barreaux 2 à 4). La page ne fait que rassembler : l'épreuve
// par défaut vient de la classe, les amis viennent des amitiés acceptées, et
// tout le reste se joue dans le navigateur — chrono compris.
export default async function OralPage() {
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const profile = await readRowTolerant<{ grade_level: string | null }>(
    supabase,
    'profiles',
    'id',
    user.id,
    ['grade_level'],
  )

  // Mes amis, PAR RPC (`oral_friends`, migration 222) et pas par jointure :
  // `profiles` est en RLS « soi uniquement », donc lire le nom d'un ami
  // directement renvoie zéro ligne — sans erreur. La liste serait vide et le
  // barreau 4 inutilisable, sans que rien ne le signale.
  const [amis, snapshot] = await Promise.all([
    getAmisPourOral(supabase),
    getOralSnapshot(supabase, user.id),
  ])

  return (
    <div className="mx-auto w-full max-w-2xl pb-16">
      <BackButton fallback="/marcel?vue=oral" label="Retour — Marcel" />

      <header className="mt-4 mb-5">
        <h1 className="font-heading text-2xl font-extrabold text-balance">
          Répéter à voix haute
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Je ne note pas ton oral — je te fais répéter, et je compte le temps que
          tu tiens.
        </p>
      </header>

      <OralAtelier
        epreuveDefaut={epreuveParDefaut(profile?.grade_level)}
        amis={amis}
        disponible={snapshot.disponible}
      />
    </div>
  )
}
