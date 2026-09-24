'use client'

import { useEffect, useState } from 'react'

/**
 * L'heure qui passe, une fois par demi-minute — sans décalage d'hydratation :
 * le premier rendu part de l'heure du serveur (`depuisIso`), puis l'horloge
 * du navigateur prend le relais. Partagée par la ligue (fin de semaine) et le
 * coffre d'équipe (« s'ouvre lundi, dans 3 j 6 h »).
 */
export function useMaintenant(depuisIso: string): number {
  const [maintenant, setMaintenant] = useState(() => Date.parse(depuisIso) || 0)
  useEffect(() => {
    const tic = () => setMaintenant(Date.now())
    tic()
    const id = window.setInterval(tic, 30_000)
    return () => window.clearInterval(id)
  }, [])
  return maintenant
}
