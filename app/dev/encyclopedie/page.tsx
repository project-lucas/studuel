import { notFound } from 'next/navigation'
import { TOUTES, entreeParId, voisines, PERSONNAGES, EVENEMENTS } from '@/lib/encyclopedie/contenu'
import { apercus } from '@/lib/encyclopedie/apercu'
import { indexDuJour } from '@/lib/encyclopedie/recherche'
import { toDayKey } from '@/lib/streak'
import CitationDuJour from '@/components/encyclopedie/CitationDuJour'
import EncyclopedieEcran from '@/components/encyclopedie/EncyclopedieEcran'
import Fiche from '@/components/encyclopedie/Fiche'

export const dynamic = 'force-dynamic'

// L'APERÇU DE L'ENCYCLOPÉDIE — en développement seulement.
//
// Les vraies pages exigent une session et une classe ; relire une mise en page
// ne devrait pas exiger de se connecter. Cette page-ci rend les mêmes
// composants sans base et sans compte :
//
//   /dev/encyclopedie                   la liste, la recherche, les filtres
//   /dev/encyclopedie?f=jeanne-d-arc    une fiche
//
// Même garde que `/dev/duel` et `/dev/exercices` : introuvable en production.
export default async function ApercuEncyclopedie({
  searchParams,
}: {
  searchParams: Promise<{ f?: string; volet?: string }>
}) {
  if (process.env.NODE_ENV === 'production') notFound()
  const { f, volet } = await searchParams
  const slug = 'histoire-geo'

  if (f) {
    const entree = entreeParId(f)
    if (!entree) notFound()
    const liens = (entree.lies ?? [])
      .map((lien) => entreeParId(lien))
      .filter((cible) => cible !== undefined)
      .map((cible) => ({ id: cible.id, nom: cible.nom, emoji: cible.emoji }))
    return <Fiche entree={entree} slug={slug} liens={liens} voisines={voisines(entree.id)} />
  }

  const liste = apercus(TOUTES)
  const vedettes = TOUTES.filter((entree) => entree.citations[0]?.contexte)
  const vedette = vedettes[indexDuJour(toDayKey(new Date()), vedettes.length)]

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pt-6 pb-24 md:px-8">
      <p className="mb-3 text-xs font-bold text-muted-foreground">
        Aperçu (développement) · {PERSONNAGES.length} personnages ·{' '}
        {EVENEMENTS.length} événements
      </p>
      {vedette ? <CitationDuJour entree={vedette} slug={slug} /> : null}
      <EncyclopedieEcran
        slug={slug}
        apercus={liste}
        niveauEleve="4e"
        voletInitial={volet === 'evenements' ? 'evenements' : 'personnages'}
      />
    </div>
  )
}
