import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/supabase/user'
import { aUneEncyclopedie } from '@/lib/encyclopedie/matieres'
import { entreeParId, voisines } from '@/lib/encyclopedie/contenu'
import Fiche from '@/components/encyclopedie/Fiche'
import MarqueurLu from '@/components/encyclopedie/MarqueurLu'

export const dynamic = 'force-dynamic'

// LA PAGE D'UNE FICHE.
//
// AUCUNE LECTURE SUPABASE — le corpus est en TypeScript, servi depuis la
// mémoire du serveur. Ouvrir « Jeanne d'Arc » ne coûte donc pas un
// aller-retour de base : c'est du texte rendu à la volée, et c'est ce qui
// permet d'enchaîner cinq fiches sans jamais attendre.
//
// La page reste dynamique parce qu'elle vérifie la session (un contenu de
// l'app ne se lit pas déconnecté), pas parce qu'elle dépend de l'élève : deux
// élèves de la même classe voient exactement la même fiche.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ entree: string }>
}): Promise<Metadata> {
  const { entree: id } = await params
  const entree = entreeParId(id)
  if (!entree) return { title: 'Fiche introuvable' }
  return {
    title: `${entree.nom} — Encyclopédie`,
    description: entree.accroche,
  }
}

export default async function FichePage({
  params,
}: {
  params: Promise<{ subject: string; entree: string }>
}) {
  const { subject: slug, entree: id } = await params
  if (!aUneEncyclopedie(slug)) notFound()

  const entree = entreeParId(id)
  if (!entree) notFound()

  const user = await getCurrentUser()
  if (!user) redirect('/login')

  // Les renvois sont résolus ICI : le composant affiche « Guerre de Cent Ans »
  // et non « guerre-de-cent-ans ». Un identifiant inconnu est simplement
  // ignoré — le test du corpus, lui, refuse qu'il en existe un
  // (lib/encyclopedie/contenu.test.ts).
  const liens = (entree.lies ?? [])
    .map((lien) => entreeParId(lien))
    .filter((cible) => cible !== undefined)
    .map((cible) => ({ id: cible.id, nom: cible.nom, emoji: cible.emoji }))

  return (
    <>
      <MarqueurLu id={entree.id} />
      <Fiche entree={entree} slug={slug} liens={liens} voisines={voisines(entree.id)} />
    </>
  )
}
