import { notFound, redirect } from 'next/navigation'
import 'katex/dist/katex.min.css'
import { ANNALES_CORRIGEES } from '@/lib/annales-corrigees/registre'
import { lieuDe, trouverAnnale } from '@/lib/annales-corrigees/apercu'
import { estMatiereAnnale } from '@/lib/annales-corrigees/matieres'
import { getCurrentUser } from '@/lib/supabase/user'
import EcranAnnale from '@/components/annales/EcranAnnale'

// UNE ANNALE CORRIGÉE : le sujet officiel (le PDF habillé, à lire ou à
// télécharger) et le corrigé Studuel, partie par partie.
//
// Aucune lecture en base : le corrigé vit dans contenu/annales (registre
// serveur), il est le même pour tous. La seule requête est celle de la session
// (les annales sont réservées aux comptes, comme tout Réviser), déjà en cache
// pour la requête (getCurrentUser).

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ subject: string; id: string }> }) {
  const { subject, id } = await params
  const annale = trouverAnnale(ANNALES_CORRIGEES, subject, id)
  if (!annale || !estMatiereAnnale(subject)) return {}
  return { title: `${annale.titre} · ${lieuDe(annale)} — corrigé Studuel` }
}

export default async function AnnalePage({
  params,
  searchParams,
}: {
  params: Promise<{ subject: string; id: string }>
  searchParams: Promise<{ partie?: string }>
}) {
  const [{ subject, id }, { partie }] = await Promise.all([params, searchParams])
  const annale = trouverAnnale(ANNALES_CORRIGEES, subject, id)
  if (!annale || !estMatiereAnnale(subject)) notFound()
  if (!(await getCurrentUser())) redirect('/login')
  return <EcranAnnale annale={annale} subject={subject} partie={partie ?? null} />
}
