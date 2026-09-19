'use client'

import { useMemo } from 'react'
import type { CleQuestion } from '@/lib/exercices/types'
import Joueur, { type ExerciceJoue } from './Joueur'
import { moteurDemo } from './moteur-demo'

/** Le joueur branché sur le moteur de démonstration (aperçu de développement). */
export default function ApercuJoueur({
  exercice,
  cles,
  retour,
  suivant,
}: {
  exercice: ExerciceJoue
  cles: CleQuestion[]
  retour: string
  suivant: string | null
}) {
  const moteur = useMemo(() => moteurDemo(cles, exercice.etoiles), [cles, exercice.etoiles])
  return (
    <Joueur
      exercice={exercice}
      retour={retour}
      suivant={suivant ? { href: suivant, etoiles: exercice.etoiles < 3 ? ((exercice.etoiles + 1) as 2 | 3) : 3 } : null}
      cours={null}
      moteur={moteur}
    />
  )
}
