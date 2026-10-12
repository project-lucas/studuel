'use client'

import { useRouter } from 'next/navigation'
import PortesMatiere from '@/components/reviser/PortesMatiere'
import SegmentRayons from '@/components/reviser/SegmentRayons'
import { portesDe, rayonsDe, tabId, type ModeTab } from '@/lib/subject-template'
import s from '@/components/reviser/Sommaire.module.css'

// Les portes et les rayons du dossier, vus depuis l'encyclopédie.
//
// L'encyclopédie est une PAGE à part (une fiche = une adresse, et le corpus ne
// descend pas dans le bundle du dossier), mais elle reste un RAYON de la porte
// « Cours » du même dossier : on y retrouve donc le même rail de portes et le
// même segment de rayons, au même endroit, avec « Encyclopédie » allumé. Un
// dossier dont les commandes changent d'un écran à l'autre donne l'impression
// de l'avoir quitté.
//
// Toucher « Histoire » ou « Jeux » ramène à l'autre page — d'où la navigation
// plutôt qu'un changement d'état. Pas de préchargement : la règle du projet est
// explicite (lib/precharge-onglets), une rafale sature l'app.
export default function OngletsRayon({
  modes,
  slug,
}: {
  modes: ModeTab[]
  slug: string
}) {
  const router = useRouter()
  const rayons = rayonsDe(modes)
  const aller = (id: string) => {
    if (id === 'encyclopedie') return
    router.push(`/reviser/${slug}?onglet=${encodeURIComponent(id)}`)
  }
  return (
    <>
      <PortesMatiere
        portes={portesDe(modes)}
        // L'encyclopédie est rangée sous « Cours » : c'est cette porte qui est ouverte.
        active="programme"
        onChange={(cle) => aller(cle === 'programme' ? tabId(modes[0]) : cle)}
      />
      {rayons.length > 0 ? (
        <div className={s.outils}>
          <SegmentRayons rayons={rayons} actif="encyclopedie" onChange={aller} />
        </div>
      ) : null}
    </>
  )
}
