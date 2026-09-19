'use client'

import { Plus } from 'lucide-react'
import { sfx } from '@/lib/sounds'

/**
 * Le bouton flottant de Mon carnet : « + » ancré en bas à droite, au-dessus de
 * la barre d'onglets. Il ouvre la feuille « Nouveau dossier » — que BentoCarnet
 * tient (10/09/2026) : une seule feuille pour tout l'écran, qui connaît les
 * dossiers existants (doublons) et les matières de Réviser.
 *
 * Pourquoi flottant : la création vivait dans l'en-tête de l'étagère « Mes
 * cours » — donc hors de l'écran dès qu'on avait quelques cours, et hors de
 * portée du pouce. Or créer est l'action qui donne envie de revenir : elle doit
 * être atteignable de partout dans la liste, sans remonter. C'est LE SEUL
 * bouton de création du carnet : les sous-dossiers (chapitres, profondeur
 * trois) se créent DANS un cours — à la racine on crée, dedans on découpe.
 */
export default function CarnetFab({ onCreer }: { onCreer: () => void }) {
  return (
    <button
      type="button"
      onClick={() => {
        sfx.tap()
        onCreer()
      }}
      aria-haspopup="dialog"
      aria-label="Créer un dossier"
      className="press-3d-deep fixed right-4 bottom-24 z-40 flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg transition-transform md:bottom-8"
    >
      <Plus className="size-7" strokeWidth={2.6} aria-hidden="true" />
    </button>
  )
}
