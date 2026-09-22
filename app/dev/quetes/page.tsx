import { notFound } from 'next/navigation'
import DailyQuests from '@/components/defi/DailyQuests'
import { QUEST_CATALOG, questView } from '@/lib/quests'

export const dynamic = 'force-dynamic'

// L'APERÇU DES QUÊTES DU JOUR — en développement seulement.
//
// La feuille des quêtes ne s'ouvre que depuis l'arène, connecté, avec les
// quêtes tirées pour soi : cette page rend le bloc dans le même panneau sombre
// avec trois quêtes de démonstration (une bouclée, une entamée, une à zéro),
// sans base ni compte.
//
//   /dev/quetes              une bouclée, une entamée, une à zéro
//   /dev/quetes?e=toutes     les trois bouclées, le coffre à prendre
//   /dev/quetes?e=payees     tout encaissé
export default async function ApercuQuetesPage({
  searchParams,
}: {
  searchParams: Promise<{ e?: string }>
}) {
  if (process.env.NODE_ENV === 'production') notFound()
  const { e = 'mixte' } = await searchParams
  const defs = ['duel1', 'revision15', 'chapter2'].map(
    (id) => QUEST_CATALOG.find((d) => d.id === id)!,
  )
  const progression =
    e === 'toutes' || e === 'payees'
      ? { duel1: 1, revision15: 15, chapter2: 2 }
      : { duel1: 1, revision15: 6, chapter2: 0 }
  const views = defs.map((d) => questView(d, progression))
  const claimedIds = e === 'payees' ? ['duel1', 'revision15', 'chapter2', '__jour__'] : []

  return (
    <div className="defi-arena-bg min-h-dvh p-4">
      <div className="defi3-sheet mx-auto max-w-md rounded-3xl p-4">
        <DailyQuests views={views} claimedIds={claimedIds} />
      </div>
    </div>
  )
}
