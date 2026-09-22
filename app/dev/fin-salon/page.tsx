import { notFound } from 'next/navigation'
import { gameFormat } from '@/lib/jeux/formats'
import { playableSalonGame } from '@/lib/jeux/catalog'
import { gameScene } from '@/lib/defi/modes-catalog'
import ApercuFinSalon, { type EtatApercu } from './Apercu'

export const dynamic = 'force-dynamic'

// L'APERÇU DE L'ÉCRAN DE FIN D'UN JEU DE SALON — en développement seulement.
//
// L'écran de fin ne se voit qu'après une partie, connecté, et son bilan dépend
// de trois réponses du serveur (journée, trophées, palmarès) : cette page le
// rend avec des données de démonstration, sans base ni compte, pour relire la
// carte du bilan dans chacun de ses états.
//
//   /dev/fin-salon                       la capture du 22/09 : première partie,
//                                        seul de sa classe, rien perdu
//   /dev/fin-salon?e=gain                record battu, +8 trophées, Léa au-dessus
//   /dev/fin-salon?e=perte               un cran sous la dernière fois, −2
//   /dev/fin-salon?e=trophees            sans palmarès (migration 355 absente)
//   /dev/fin-salon?e=attente             le serveur n'a encore rien dit
//   /dev/fin-salon?e=visiteur            partie non enregistrée
//   …&jeu=calcul-mental                  un autre jeu de salon
const ETATS: readonly EtatApercu[] = ['bilan', 'gain', 'perte', 'trophees', 'attente', 'visiteur']

export default async function ApercuFinSalonPage({
  searchParams,
}: {
  searchParams: Promise<{ e?: string; jeu?: string }>
}) {
  if (process.env.NODE_ENV === 'production') notFound()
  const { e = 'bilan', jeu = 'anatomie-express' } = await searchParams
  const etat = ETATS.find((x) => x === e)
  const found = playableSalonGame(jeu)
  const format = gameFormat(jeu)
  if (!etat || !found || !format) notFound()

  return (
    <ApercuFinSalon
      etat={etat}
      format={format}
      name={found.game.name}
      subject={found.salon.subject}
      scene={gameScene(jeu) ?? null}
    />
  )
}
