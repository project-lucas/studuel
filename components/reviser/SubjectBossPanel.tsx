'use client'

import BossArena from '@/components/reviser/BossArena'
import type { ModeQuestion } from '@/lib/defi-modes'

// Onglet « Boss » de la page matière : chaque matière a SON gardien, le même de
// la 6e à la Terminale. Toute la mise en scène (présentation au repos → salle
// de combat en violet profond → écran de fin) vit dans BossArena, qui bascule
// la zone crème en arène sans changer de page.
export default function SubjectBossPanel({
  subjectSlug,
  pool,
}: {
  subjectSlug: string
  pool: ModeQuestion[]
}) {
  return <BossArena subjectSlug={subjectSlug} pool={pool} />
}
