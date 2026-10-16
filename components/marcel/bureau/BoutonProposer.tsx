'use client'

import Link from 'next/link'
import { Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { sfx } from '@/lib/sounds'
import type { ModeCle } from '@/lib/coach/outils'
import { useCoachFil } from '../CoachFil'

/**
 * Un bouton du bureau qui PRÉPARE le champ : il arme un mode et propose une
 * phrase (« Interroge-moi sur Fractions »), l’élève n’a plus qu’à envoyer.
 * Pour un élève gratuit, le même bouton couronné mène à Studuel+.
 */
export default function BoutonProposer({
  mode,
  texte,
  label,
  ouvert,
}: {
  mode: ModeCle
  texte: string
  label: string
  /** L’élève a-t-il Marcel (Studuel+) ? */
  ouvert: boolean
}) {
  const { proposer } = useCoachFil()

  if (!ouvert) {
    return (
      <Button asChild size="lg" className="mt-2.5 w-full">
        <Link href="/plus">
          <Crown aria-hidden="true" />
          {label}
        </Link>
      </Button>
    )
  }

  return (
    <Button
      type="button"
      size="lg"
      className="mt-2.5 w-full"
      onClick={() => {
        sfx.tap()
        proposer(mode, texte)
      }}
    >
      {label}
    </Button>
  )
}
