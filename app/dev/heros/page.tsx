import { notFound } from 'next/navigation'
import ApercuChoixHeros from './Apercu'

export const dynamic = 'force-dynamic'

// L'APERÇU DU CHOIX DU HÉROS (31/10/2026) — en développement seulement,
// connecté ou non. Dans l'app, l'écran se joue à l'étape `avatar` de
// /bienvenue, qui renvoie un élève connecté vers l'app.
// /dev/heros?h=demi-elfe-mage ouvre l'écran sur ce héros.
export default async function ApercuChoixHerosPage({
  searchParams,
}: {
  searchParams: Promise<{ h?: string }>
}) {
  if (process.env.NODE_ENV === 'production') notFound()
  const { h } = await searchParams
  return <ApercuChoixHeros initial={h} />
}
