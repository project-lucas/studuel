import { notFound, redirect } from 'next/navigation'
import Joueur from '@/components/exercices/Joueur'
import PageChapitre from '@/components/exercices/PageChapitre'
import Liseuse from '@/components/exercices/livre/Liseuse'
import { chargerCahier, chargerExercice } from '@/lib/exercices/cahier-server'
import { avecSens, voisinage } from '@/lib/exercices/livre'
import { chargerLivre } from '@/lib/exercices/livre-server'
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
//
// Depuis le 30/09/2026, l'exercice est une PAGE DU MANUEL NUMÉRIQUE de son
// thème (lib/exercices/livre.ts) : titre courant, folio « p. 7 / 24 », pages
// qu'on tourne d'un chapitre à l'autre, sommaire à un toucher. `?sens=` dit
// dans quel sens on vient de tourner la page (l'animation d'entrée).
export default async function ExerciceNumeroPage({
  params,
  searchParams,
}: {
  params: Promise<{ subject: string; chapter: string; numero: string }>
  searchParams: Promise<{ sens?: string }>
}) {
  const [{ subject: slug, chapter: chapterId, numero }, { sens: sensBrut }] = await Promise.all([params, searchParams])
  const sens = sensBrut === 'suivante' || sensBrut === 'precedente' ? sensBrut : null
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

  const [exercice, lignes, { data: lecons }, livre] = await Promise.all([
    chargerExercice(supabase, chapter.id, position),
    chargerCahier(supabase, chapter.id, user.id),
    supabase
      .from('lessons')
      .select('id')
      .eq('chapter_id', chapter.id)
      .order('position', { ascending: true })
      .limit(1)
      .returns<{ id: string }[]>(),
    // Le manuel du thème : la page se lit comme celle d'un livre numérique.
    chargerLivre(supabase, subject.slug, chapter.id, user.id),
  ])
  if (!exercice || !lignes) notFound()
  const ligne = lignes.find((l) => l.id === exercice.id)
  if (ligne?.etat === 'verrouille') redirect(cahierHref)

  // La page suivante du manuel peut être le premier exercice du chapitre suivant.
  const pageSuivante = livre ? voisinage(livre, chapter.id, position)?.suivante : null
  const suivante = lignes.find((l) => l.position > position)
  const suivant = pageSuivante
    ? { href: avecSens(pageSuivante.href, 'suivante'), etoiles: pageSuivante.etoiles }
    : suivante
      ? { href: `${cahierHref}/${suivante.position}`, etoiles: suivante.etoiles }
      : null
  const premiereLecon = lecons?.[0]?.id
  const cours = premiereLecon ? `${chapitreHref}/${premiereLecon}/cours` : null
  const joueur = <Joueur exercice={exercice} retour={cahierHref} suivant={suivant} cours={cours} />

  return (
    <PageChapitre
      sousTitre={`${subject.name} · ${chapter.title}`}
      titre={`Exercice ${position}`}
      retour={cahierHref}
      compact
    >
      {livre ? (
        <Liseuse livre={livre} chapitreId={chapter.id} position={position} sens={sens}>
          {joueur}
        </Liseuse>
      ) : (
        joueur
      )}
    </PageChapitre>
  )
}
