import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import JeuxBoard from '@/components/jeux/JeuxBoard'
import { createClient } from '@/lib/supabase/server'
import type { SalonState } from '@/lib/jeux/catalog'
import { getSalonBoard } from './salons-data'

export const metadata = { title: 'Modes de jeu — Studuel' }
export const dynamic = 'force-dynamic'

/**
 * L'espace Jeux (route /defi/jeux) — deux ailes, deux publics :
 * les SALONS 1v1 par matière, qui s'ouvrent en faisant ses preuves (un
 * chapitre maîtrisé à 80 %), et les ÉQUIPES 2v2 entre amis, ouvertes à tous.
 * Le déblocage est recalculé côté serveur (salons-data) à chaque visite ;
 * l'affichage (bascule, onglets, grille) vit dans JeuxBoard.
 */
export default async function JeuxPage({
  searchParams,
}: {
  searchParams: Promise<{ matiere?: string }>
}) {
  // ?matiere=… (billets « Par matière » de la feuille Modes de jeu) : ouvre
  // directement le salon demandé. Valeur inconnue → accueil normal.
  const { matiere } = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Visiteur ou classe inconnue : tout s'affiche, tout est verrouillé —
  // la promesse du catalogue donne envie, le déblocage attendra le compte.
  let board: Record<string, SalonState> = {}
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('grade_level')
      .eq('id', user.id)
      .maybeSingle()
    if (profile?.grade_level) {
      board = Object.fromEntries(
        await getSalonBoard(supabase, user.id, profile.grade_level),
      )
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4 pb-8">
      <div className="[&_header_h1]:text-white [&_header_p]:text-white/75">
        <PageHeader
          title="Modes de jeu"
          description="Des salons à mériter, des équipes pour s'amuser."
        />
      </div>

      <Link
        href="/defi"
        className="-mt-3 flex items-center gap-1 self-start text-sm font-bold text-white/70 hover:text-white"
      >
        <ChevronLeft className="size-4" aria-hidden="true" /> Retour à l’arène
      </Link>

      <JeuxBoard board={board} initialSubject={matiere ?? null} />
    </div>
  )
}
