import { redirect } from 'next/navigation'
import BoiteAuxLettres from '@/components/courrier/BoiteAuxLettres'
import { lireBoite } from '@/lib/courrier-server'
import { getServerAuth } from '@/lib/supabase/user'

export const metadata = { title: 'Courrier — Studuel' }
export const dynamic = 'force-dynamic'

/**
 * LE COURRIER (25/10/2026, cadrage « le jeu vivant » § G, migration 602) :
 * la boîte aux lettres de l'élève — les mots de Marcel, les cadeaux à
 * récupérer, les nouveautés, les diffusions du coach (588) et les défis reçus
 * (558), lus en UNE vague (`courrier_boite`). La page ne fait que lire ; les
 * gestes sont dans `actions.ts`, la logique dans `lib/courrier`.
 */
export default async function CourrierPage() {
  const { supabase, user } = await getServerAuth()
  if (!user) redirect('/login?next=/courrier')
  const boite = await lireBoite(supabase)
  return <BoiteAuxLettres lettres={boite.lettres} disponible={boite.disponible} />
}
