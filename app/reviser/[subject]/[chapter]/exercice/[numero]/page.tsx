import { notFound, redirect } from 'next/navigation'
import Joueur from '@/components/exercices/Joueur'
import PageChapitre from '@/components/exercices/PageChapitre'
import { chargerCahier, chargerExercice } from '@/lib/exercices/cahier-server'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { canAccessPremiumTests, getUserTierFor } from '@/lib/subscription'
import { CHAPTER_COLUMNS, type Chapter, type Subject } from '@/lib/types'

export const dynamic = 'force-dynamic'

// UN EXERCICE DU CAHIER — /reviser/<matière>/<chapitre>/exercice/<n>.
//
// La page vérifie ce qu'elle peut (abonnement, déblocage) pour renvoyer au
// sommaire plutôt que d'ouvrir un exercice qui refusera de démarrer ; le
// serveur revérifie tout de toute façon (exercice_commencer).
export default async function ExerciceNumeroPage({
  params,
}: {
  params: Promise<{ subject: string; chapter: string; numero: string }>
}) {
  const { subject: slug, chapter: chapterId, numero } = await params
  const position = Number(numero)
  if (!Number.isInteger(position) || position < 1 || position > 9) notFound()

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
  const chapitreHref = `/reviser/${subject.slug}/${chapter.id}`
  const cahierHref = `${chapitreHref}/exercice`

  if (!canAccessPremiumTests(tier)) redirect(cahierHref)

  const [exercice, lignes, { data: lecons }] = await Promise.all([
    chargerExercice(supabase, chapter.id, position),
    chargerCahier(supabase, chapter.id, user.id),
    supabase
      .from('lessons')
      .select('id')
      .eq('chapter_id', chapter.id)
      .order('position', { ascending: true })
      .limit(1)
      .returns<{ id: string }[]>(),
  ])
  if (!exercice || !lignes) notFound()
  const ligne = lignes.find((l) => l.id === exercice.id)
  if (ligne?.etat === 'verrouille') redirect(cahierHref)

  const suivante = lignes.find((l) => l.position > position)
  const premiereLecon = lecons?.[0]?.id

  return (
    <PageChapitre
      couleur={subject.color}
      surtitre={`${subject.name} · ${chapter.title}`}
      titre={`Exercice ${position}`}
      retour={cahierHref}
      compact
    >
      <Joueur
        exercice={exercice}
        retour={cahierHref}
        suivant={suivante ? { href: `${cahierHref}/${suivante.position}`, etoiles: suivante.etoiles } : null}
        cours={premiereLecon ? `${chapitreHref}/${premiereLecon}/cours` : null}
      />
    </PageChapitre>
  )
}
