'use client'

import { useState } from 'react'
import Cinematique from '@/components/welcome/Cinematique'

// La cinématique rejouée à volonté : « Passer » ou « C'est parti » la remet
// au premier tableau. Le tableau demandé par l'adresse ne vaut que pour le
// premier tour. Le monde `.onb` est posé comme dans /bienvenue.
export default function ApercuCinematique({ tableau }: { tableau: number }) {
  const [tour, setTour] = useState(0)
  return (
    <div className="onb fixed inset-0 z-50">
      <Cinematique
        key={tour}
        tableauInitial={tour === 0 ? tableau : 0}
        onFin={() => setTour((t) => t + 1)}
      />
    </div>
  )
}
