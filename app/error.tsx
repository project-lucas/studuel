'use client'

import { useEffect } from 'react'
import EcranPepin from '@/components/EcranPepin'
import { useEnLigne } from '@/components/useEnLigne'
import { signalerErreur } from '@/lib/erreurs-client'

// LA FRONTIÈRE D'ERREUR DE L'APP (12/10/2026). Un composant qui plante, une
// lecture Supabase qui lève, une action qui échoue : l'écran est remplacé par
// celui-ci — dans la mise en page (bandeau et barre d'onglets restent, l'élève
// n'est pas enfermé) —, et le rapport part vers /api/erreurs avec le `digest`
// de Next, le même que celui que `instrumentation.ts` a déjà rangé côté
// serveur : les deux lignes d'un même plantage se relient par lui.
//
// Hors connexion, ce n'est pas un plantage : l'écran le dit tel quel.
export default function Erreur({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  const enLigne = useEnLigne()

  useEffect(() => {
    signalerErreur(error, { ou: 'frontiere', digest: error.digest ?? null })
  }, [error])

  return (
    <EcranPepin
      pepin={enLigne ? 'plantage' : 'hors-connexion'}
      onReessayer={unstable_retry}
      code={error.digest ?? null}
    />
  )
}
