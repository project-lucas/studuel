import { redirect } from 'next/navigation'
import EnTetePage from '@/components/reviser/EnTetePage'
import CarteFiliere from '@/components/plus/CarteFiliere'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { FILIERES } from '@/lib/prepa-sup/catalogue'

export const metadata = { title: 'Prépa du supérieur — Studuel' }
export const dynamic = 'force-dynamic'

// LA PRÉPA DU SUPÉRIEUR (15/10/2026, Lucas : « des matières supplémentaires
// pour devancer la L1 — droit, économie… —, les filières les plus choisies
// après le bac »). LA COLONNE VERTÉBRALE : les huit filières, leurs modules
// d'introduction, et « Ça m'intéresse ». Le contenu (cours, quiz, fiches)
// viendra filière par filière, dans l'ordre que donneront ces votes
// (`prepa_sup_votes`, migration 582) — la page le dit, elle ne vend rien
// qui n'existe pas encore. Ouverte à tous en lecture : un 3e qui se demande
// ce qu'est le droit a sa place ici aussi.

export default async function PagePrepaSup() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  const supabase = await createClient()

  // Mes filières cochées (582). Absente : aucune, et le bouton le dira.
  const { data } = await supabase.from('prepa_sup_interet').select('piste').eq('user_id', user.id)
  const cochees = new Set((data ?? []).map((r: { piste: string }) => r.piste))

  return (
    <div className="pb-10">
      <EnTetePage retour={{ fallback: '/plus' }} titre="Prépa du supérieur" sousTitre="Devancer la première année" />
      <div className="mx-auto flex w-full max-w-md flex-col gap-3 px-4">
        <p className="bg-secondary rounded-2xl px-4 py-3 text-[13px] leading-snug font-semibold text-balance">
          Les bases des études les plus choisies après le bac arrivent avec Studuel+. Dis-nous lesquelles
          t’intéressent : on commence par celles que vous choisirez.
        </p>
        {FILIERES.map((f) => (
          <CarteFiliere key={f.id} filiere={f} coche={cochees.has(f.id)} />
        ))}
      </div>
    </div>
  )
}
