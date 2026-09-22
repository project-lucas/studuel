'use client'

import { useRouter } from 'next/navigation'
import ModeTabs from '@/components/reviser/ModeTabs'
import type { ModeTab } from '@/lib/subject-template'

// La barre d'onglets du dossier, vue depuis l'encyclopédie.
//
// L'encyclopédie est une PAGE à part (une fiche = une adresse, et le corpus ne
// descend pas dans le bundle du dossier), mais elle doit rester un RAYON du
// même dossier : on y retrouve donc les mêmes onglets, au même endroit, avec
// « Encyclopédie » allumé. Taper « Histoire » depuis ici ramène au programme —
// c'est-à-dire à l'autre page, d'où la navigation plutôt qu'un changement
// d'état.
//
// Pas de `prefetch` : la règle du projet est explicite (lib/precharge-onglets),
// une rafale de préchargements sature l'app.
export default function OngletsRayon({
  modes,
  slug,
}: {
  modes: ModeTab[]
  slug: string
}) {
  const router = useRouter()
  return (
    <ModeTabs
      modes={modes}
      active="encyclopedie"
      onChange={(tab) => {
        if (tab === 'encyclopedie') return
        router.push(`/reviser/${slug}?onglet=${encodeURIComponent(tab)}`)
      }}
    />
  )
}
