import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { getSubjectsCached, getDisciplinesCached } from '@/lib/catalog'
import { modesFor } from '@/lib/subject-template'
import { aUneEncyclopedie } from '@/lib/encyclopedie/matieres'
import { EVENEMENTS, PERSONNAGES, TOUTES } from '@/lib/encyclopedie/contenu'
import { apercus } from '@/lib/encyclopedie/apercu'
import { indexDuJour } from '@/lib/encyclopedie/recherche'
import { NIVEAUX, type Niveau } from '@/lib/encyclopedie/types'
import { toDayKey } from '@/lib/streak'
import EnteteRayon from '@/components/encyclopedie/EnteteRayon'
import OngletsRayon from '@/components/encyclopedie/OngletsRayon'
import CitationDuJour from '@/components/encyclopedie/CitationDuJour'
import EncyclopedieEcran from '@/components/encyclopedie/EncyclopedieEcran'
import type { Subject } from '@/lib/types'

export const dynamic = 'force-dynamic'

// L'ENCYCLOPÉDIE D'UNE MATIÈRE — la liste.
//
// UNE SEULE LECTURE SUPABASE (le profil), et rien d'autre : le corpus est en
// TypeScript, le catalogue des matières et le programme sortent du cache
// serveur. C'est la règle « un onglet = une vague » (CLAUDE.md) prise au pied
// de la lettre — cette page n'a aucune raison de coûter un aller-retour de
// plus que le strict minimum.
//
// Ce qui descend dans le navigateur : les APERÇUS (nom, dates, citation
// tronquée, clés de recherche), pas les fiches. Le corpus complet reste
// serveur, comme `lib/catalog` — un composant client ne l'importe jamais.
export default async function EncyclopediePage({
  params,
  searchParams,
}: {
  params: Promise<{ subject: string }>
  searchParams: Promise<{ volet?: string }>
}) {
  const { subject: slug } = await params
  const { volet } = await searchParams
  // Une encyclopédie qui n'existe pas n'est pas une page vide : c'est une page
  // qui n'existe pas. L'onglet, de son côté, ne s'affiche que là où il y a
  // quelque chose derrière (`modesFor`).
  if (!aUneEncyclopedie(slug)) notFound()

  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const supabase = await createClient()
  const [{ data: profile }, sujets] = await Promise.all([
    supabase
      .from('profiles')
      .select('grade_level')
      .eq('id', user.id)
      .maybeSingle<{ grade_level: string | null }>(),
    getSubjectsCached(),
  ])

  const subject = (sujets as Subject[]).find((s) => s.slug === slug)
  if (!subject) notFound()
  const grade = profile?.grade_level
  if (!grade) redirect('/onboarding')

  // Le programme sort du cache (300 s, partagé par tous les élèves de la
  // classe) : il ne sert qu'à savoir si le dossier a deux rayons, pour que la
  // barre d'onglets soit EXACTEMENT celle de la page d'à côté. Une barre qui
  // change d'un écran à l'autre donne l'impression d'avoir quitté le dossier.
  const disciplines = await getDisciplinesCached(subject.id, grade)
  const modes = modesFor(grade, disciplines, slug)

  const liste = apercus(TOUTES)
  // La citation du jour : le même tirage pour tout le monde, une journée
  // durant. Seules les fiches qui en valent la peine concourent — une phrase
  // sans contexte ferait une mauvaise affiche.
  const vedettes = TOUTES.filter((entree) => entree.citations[0]?.contexte)
  const vedette = vedettes[indexDuJour(toDayKey(new Date()), vedettes.length)]

  const niveauEleve = (NIVEAUX as readonly string[]).includes(grade)
    ? (grade as Niveau)
    : null

  return (
    <div className="-mx-4 -mt-16 md:-mx-8 md:-mt-10">
      <EnteteRayon
        subject={{ slug: subject.slug, name: subject.name, color: subject.color }}
        grade={grade}
        personnages={PERSONNAGES.length}
        evenements={EVENEMENTS.length}
      >
        <OngletsRayon modes={modes} slug={slug} />
      </EnteteRayon>

      {/* Le panneau chevauche l'en-tête, façon carnet — comme le dossier. */}
      <div className="relative -mt-6 rounded-t-3xl bg-background">
        <div className="pop-in mx-auto w-full max-w-4xl px-4 pt-5 pb-24 md:px-8">
          {vedette ? <CitationDuJour entree={vedette} slug={slug} /> : null}
          <EncyclopedieEcran
            slug={slug}
            apercus={liste}
            niveauEleve={niveauEleve}
            voletInitial={volet === 'evenements' ? 'evenements' : 'personnages'}
          />
        </div>
      </div>
    </div>
  )
}
