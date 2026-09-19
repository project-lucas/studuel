import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { Crown } from 'lucide-react'
import Cahier from '@/components/exercices/Cahier'
import PageChapitre from '@/components/exercices/PageChapitre'
import ControleBlanc from '@/components/exercice/ControleBlanc'
import { Button } from '@/components/ui/button'
import { chargerCahier } from '@/lib/exercices/cahier-server'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { canAccessPremiumTests, getUserTierFor } from '@/lib/subscription'
import { CHAPTER_COLUMNS, type Chapter, type Subject } from '@/lib/types'

export const dynamic = 'force-dynamic'

// L'EXERCICE DU CHAPITRE — la tuile « Exercice » du groupe « Se tester ».
//
// Depuis le 18/09/2026, c'est un CAHIER : trois exercices à étoiles faits comme
// une page de manuel (documents, questions dessous), débloqués l'un après
// l'autre, qui rapportent des gemmes (lib/exercices, migration 372). Au bout
// du chemin, le contrôle blanc de la 360 (une copie notée sur 20 par l'IA).
//
// Un chapitre dont le cahier n'est pas encore écrit (ou une base sans la 372)
// garde l'ancien écran : le contrôle blanc, directement.
// Réservé à Studuel+ : sans abonnement, on voit le sommaire, cadenassé.
export default async function ExercicePage({
  params,
}: {
  params: Promise<{ subject: string; chapter: string }>
}) {
  const { subject: slug, chapter: chapterId } = await params
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  type Row = Chapter & { subject: Subject | null }
  const [{ data: row }, tier] = await Promise.all([
    supabase
      .from('chapters')
      .select(`${CHAPTER_COLUMNS}, subject:subjects!inner(*)`)
      .eq('id', chapterId)
      .eq('subjects.slug', slug)
      .maybeSingle<Row>(),
    getUserTierFor(supabase, user.id),
  ])
  if (!row?.subject) notFound()

  const { subject, ...chapter } = row
  const backHref = `/reviser/${subject.slug}/${chapter.id}`
  const premium = canAccessPremiumTests(tier)
  const lignes = await chargerCahier(supabase, chapter.id, user.id)
  const aUnCahier = lignes !== null && lignes.length > 0

  return (
    <PageChapitre
      couleur={subject.color}
      surtitre={`${subject.name} · Chapitre ${chapter.position}`}
      titre={`${aUnCahier ? 'Exercices' : 'Exercice'} · ${chapter.title}`}
      retour={backHref}
    >
      {aUnCahier ? (
        <div className="flex flex-col gap-5">
          {!premium ? <PorteStudueLPlus titre={chapter.title} retour={backHref} cahier /> : null}
          <Cahier lignes={lignes} base={`${backHref}/exercice`} premium={premium} controle={premium} />
        </div>
      ) : premium ? (
        <ControleBlanc chapterId={chapter.id} chapterTitle={chapter.title} backHref={backHref} />
      ) : (
        <PorteStudueLPlus titre={chapter.title} retour={backHref} />
      )}
    </PageChapitre>
  )
}

function PorteStudueLPlus({ titre, retour, cahier = false }: { titre: string; retour: string; cahier?: boolean }) {
  return (
    <div className="mx-auto max-w-md rounded-3xl border p-6 text-center">
      <span className="bg-card mx-auto mb-3 flex size-14 items-center justify-center rounded-2xl border shadow-sm">
        <Crown className="size-6 fill-highlight text-highlight" aria-hidden="true" />
      </span>
      <p className="font-heading font-semibold text-balance">
        {cahier ? 'Le cahier d’exercices est réservé à Studuel+.' : 'L’exercice de chapitre est réservé à Studuel+.'}
      </p>
      <p className="text-muted-foreground mt-2 text-sm text-balance">
        {cahier
          ? `Trois exercices sur « ${titre} », avec des cartes, des graphiques et des textes à analyser, qui rapportent des gemmes. En attendant, le quiz et les flashcards du chapitre sont ouverts.`
          : `Un vrai sujet écrit sur le cours de « ${titre} », que l’IA corrige et note sur 20, avec le corrigé. En attendant, le quiz et les flashcards du chapitre sont ouverts.`}
      </p>
      <div className="mt-4 flex flex-col items-center gap-2">
        <Button asChild className="rounded-full">
          <Link href="/compte">Débloquer avec Studuel+</Link>
        </Button>
        <Link href={retour} className="text-muted-foreground text-sm font-medium underline underline-offset-4">
          Retour au chapitre
        </Link>
      </div>
    </div>
  )
}
