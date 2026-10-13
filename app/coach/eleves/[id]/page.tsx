import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import FicheEleve from '@/components/coach/FicheEleve'
import RetirerEleve from '@/components/coach/RetirerEleve'
import { statutEleve } from '@/lib/coach/statut'
import { aujourdhuiUtc, lireFiche, lireTableau } from '@/lib/coach/server'

export const dynamic = 'force-dynamic'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// LA FICHE D'UN ÉLÈVE : le tableau de bord de l'espace parents, lu par la
// porte du coach (`coach_fiche_eleve`), plus sa ligne du tableau (statut).
export default async function FicheElevePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!UUID.test(id)) notFound()

  const [fiche, lignes] = await Promise.all([lireFiche(id), lireTableau()])
  const ligne = lignes?.find((l) => l.eleveId === id) ?? null
  if (!fiche || !ligne) notFound()

  const aujourdhui = aujourdhuiUtc()
  const verdict = statutEleve(ligne, aujourdhui)

  return (
    <div className="flex flex-col gap-4">
      <Link href="/coach" className="inline-flex w-fit items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden="true" />
        Tableau
      </Link>
      <FicheEleve fiche={fiche} ligne={ligne} verdict={verdict} aujourdhui={aujourdhui} />
      <RetirerEleve groupeId={ligne.groupeId} eleveId={ligne.eleveId} prenom={ligne.prenom} groupe={ligne.groupe} />
    </div>
  )
}
