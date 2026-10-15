import { notFound } from 'next/navigation'
import { gameFormat } from '@/lib/jeux/formats'
import { gameScene } from '@/lib/defi/modes-catalog'
import { parsePalier, DEFAULT_PALIER } from '@/lib/jeux/paliers'
import ApercuPlanche from './Apercu'

export const dynamic = 'force-dynamic'

// L'APERÇU DE LA PLANCHE D'ANATOMIE — en développement seulement.
//
// La planche d'« Anatomie express » (components/jeux/AnatomyBoard) se relit
// ici sans base ni compte : tous les organes du palier en pastilles, la
// planche cliquable, la correction comme en partie — le tout dans la pièce
// du jeu, à toute largeur.
//
//   /dev/anatomie                          la planche au palier de référence
//   /dev/anatomie?palier=5                 les organes demandés au palier 5
//   /dev/anatomie?cible=foie&touche=rate   une correction figée (capture)
//   /dev/anatomie?planche=muscles          l'écorché de « Muscles express » (Sport)
//   /dev/anatomie?planche=muscles&cible=biceps&touche=pectoraux
//   /dev/anatomie?planche=muscles&palier=5&cible=fessiers   la vue de dos
export default async function ApercuPlanchePage({
  searchParams,
}: {
  searchParams: Promise<{ palier?: string; cible?: string; touche?: string; planche?: string }>
}) {
  if (process.env.NODE_ENV === 'production') notFound()
  const { palier, cible, touche, planche } = await searchParams
  const muscles = planche === 'muscles'
  const jeu = muscles ? 'muscles-express' : 'anatomie-express'
  const format = gameFormat(jeu)
  if (!format) notFound()
  return (
    <ApercuPlanche
      planche={muscles ? 'muscles' : 'organes'}
      palier={parsePalier(palier) ?? DEFAULT_PALIER}
      cible={cible ?? null}
      touche={touche ?? null}
      theme={format.theme}
      scene={gameScene(jeu) ?? null}
    />
  )
}
