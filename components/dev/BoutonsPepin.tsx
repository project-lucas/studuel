'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

// Les deux façons de planter dans le navigateur, pour l'aperçu /dev/erreur :
//   · pendant le RENDU → attrapé par la frontière (app/error.tsx) ;
//   · dans un GESTIONNAIRE → échappe à React, attrapé par window.onerror
//     (instrumentation-client.ts), l'écran reste en place.
export default function BoutonsPepin() {
  const [planteAuRendu, setPlanteAuRendu] = useState(false)
  if (planteAuRendu) throw new Error('Pépin de démonstration au rendu (/dev/erreur)')

  return (
    <div className="flex flex-wrap gap-3">
      <Button type="button" onClick={() => setPlanteAuRendu(true)}>
        Planter au rendu (frontière)
      </Button>
      <Button
        type="button"
        variant="secondary"
        onClick={() => {
          throw new Error('Pépin de démonstration dans un gestionnaire (/dev/erreur)')
        }}
      >
        Planter dans un gestionnaire (window.onerror)
      </Button>
      <Button
        type="button"
        variant="secondary"
        onClick={() => {
          void Promise.reject(new Error('Pépin de démonstration : promesse rejetée (/dev/erreur)'))
        }}
      >
        Promesse rejetée
      </Button>
    </div>
  )
}
