'use client'

import { useState, type ReactNode } from 'react'
import EnTetePage from '@/components/reviser/EnTetePage'
import FiltresRayons from '@/components/bibliotheque/FiltresRayons'
import { RayonCapsules } from '@/components/bibliotheque/Capsules'
import { RayonFiches } from '@/components/bibliotheque/Fiches'
import {
  RAYON_DEFAUT,
  type CapsuleRangee,
  type FicheAchetee,
  type Rayon,
} from '@/lib/bibliotheque'
import { sfx } from '@/lib/sounds'
import { cn } from '@/lib/utils'

// -----------------------------------------------------------------------------
// MA BIBLIOTHÈQUE — l'ex-« Mon carnet » (Lucas, 24/09/2026). Tout ce qui est à
// l'élève, au même endroit : ses DOSSIERS (les cours qu'il écrit), ses CAPSULES
// et ses FICHES achetées. Trois onglets illustrés, un rayon à la fois :
//   · DOSSIERS — le carnet tel qu'il était (ordre, « Reprendre », dossiers, +) ;
//   · CAPSULES — la grille, avec une puce par thème ;
//   · FICHES — la liste par matière, avec une puce par matière.
// Le rayon « Tout » (des étagères empilées) et le sous-titre qui comptait tout
// sont partis le même jour (« enlève le filtre Tout ») ; le titre s'est posé
// sur la rangée du retour (« aligne Ma bibliothèque à la flèche de retour »).
//
// LE RAYON VIT DANS L'URL (`?rayon=fiches`), écrit par `history.replaceState`
// (intégré au routeur de Next) : changer de rayon ne recharge rien, et le retour
// depuis une fiche ou une capsule rouvre le rayon qu'on avait quitté.
//
// LES DOSSIERS RESTENT MONTÉS quand un autre rayon s'affiche (cachés, pas
// démontés) : leur état est local et optimiste (favoris, suppression) — le
// démonter le remettait aux props du dernier rendu serveur.
// -----------------------------------------------------------------------------

export default function Bibliotheque({
  rayonInitial,
  capsules,
  capsulesDisponibles,
  fiches,
  premium,
  nbDossiers,
  dossiers,
}: {
  rayonInitial: Rayon
  /** Les capsules achetées, dans l'ordre de l'étagère (`etagereCarnet`). */
  capsules: CapsuleRangee[]
  /** Le catalogue de la Boutique a-t-il des capsules (366 + 367) ? */
  capsulesDisponibles: boolean
  fiches: FicheAchetee[]
  /** Studuel+ : toutes les fiches sont déjà ouvertes, rien à acheter. */
  premium: boolean
  nbDossiers: number
  /** Le carnet (`BentoCarnet`), rendu par la page. */
  dossiers: ReactNode
}) {
  const [rayon, setRayon] = useState(rayonInitial)

  const choisir = (suivant: Rayon) => {
    if (suivant === rayon) return
    sfx.tap()
    setRayon(suivant)
    // Sur l'adresse COURANTE (et non `/carnet` en dur) : les autres paramètres
    // restent, et l'aperçu de développement garde la sienne.
    const url = new URL(window.location.href)
    if (suivant === RAYON_DEFAUT) url.searchParams.delete('rayon')
    else url.searchParams.set('rayon', suivant)
    window.history.replaceState(null, '', url)
  }

  const comptes = { dossiers: nbDossiers, capsules: capsules.length, fiches: fiches.length }

  return (
    <div className="cascade flex flex-col gap-3 pb-14">
      <EnTetePage enLigne retour={{ fallback: '/reviser', label: 'Retour à Réviser' }} titre="Ma bibliothèque">
        <FiltresRayons rayon={rayon} comptes={comptes} onChange={choisir} />
      </EnTetePage>

      {rayon === 'capsules' ? (
        <RayonCapsules etagere={capsules} disponibles={capsulesDisponibles} />
      ) : null}
      {rayon === 'fiches' ? <RayonFiches fiches={fiches} premium={premium} /> : null}

      {/* Caché, pas démonté : voir l'en-tête. `hidden` cache aussi le + flottant. */}
      <div className={cn('flex flex-col gap-3', rayon !== 'dossiers' && 'hidden')}>{dossiers}</div>
    </div>
  )
}
