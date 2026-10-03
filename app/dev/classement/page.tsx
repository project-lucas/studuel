import { notFound } from 'next/navigation'
import ClassementSheet from '@/components/defi/ClassementSheet'
import DuelSubjectProvider from '@/components/defi/DuelSubjectProvider'
import { buildDuelBoard } from '@/lib/defi/duel-board'
import { buildRoster, trophyMap } from '@/lib/defi/roster'
import { buildSubjectLadders } from '@/lib/subject-rank'

export const dynamic = 'force-dynamic'

// L'APERÇU DE L'ÉCRAN CLASSEMENT — en développement seulement.
//
// L'écran que la plaque Classement de l'arène ouvre (components/defi/
// ClassementSheet), déjà ouvert, sur un plateau d'exemple : quelques trophées
// en anglais, en maths et en histoire-géo, l'espagnol en matière du duel.
// Sans base ni compte.
//
//   /dev/classement

const LIGNES = [
  { subject: 'Anglais', gameId: 'traduction-flash', trophies: 10 },
  { subject: 'Maths', gameId: 'calcul-mental', trophies: 64 },
  { subject: 'Histoire-Géo', gameId: 'capitales', trophies: 22 },
]

export default function ApercuClassementPage() {
  if (process.env.NODE_ENV === 'production') notFound()
  const roster = buildRoster(trophyMap(LIGNES))
  const board = buildDuelBoard(
    roster,
    buildSubjectLadders({
      subjects: roster.map((e) => ({ subject: e.subject, slug: e.slug, emoji: e.emoji })),
      rows: LIGNES,
      unlockedSlugs: new Set(['maths']),
    }),
  )
  return (
    <DuelSubjectProvider board={board} initialSlug="espagnol">
      <ClassementSheet trophees={96} classement={{ rank: 1, total: 9 }} ouvertAuDepart />
    </DuelSubjectProvider>
  )
}
