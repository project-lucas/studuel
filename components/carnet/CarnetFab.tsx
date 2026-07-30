'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { sfx } from '@/lib/sounds'
import CreateCourseSheet from '@/components/carnet/CreateCourseSheet'

/**
 * Le bouton flottant de Mon carnet : « + » ancré en bas à droite, au-dessus de
 * la barre d'onglets, qui ouvre la feuille « Nouveau cours » (nom d'abord,
 * puis cours vide ou questions rédigées par l'IA — cf. CreateCourseSheet).
 *
 * Pourquoi flottant : la création vivait dans l'en-tête de l'étagère « Mes
 * cours » — donc hors de l'écran dès qu'on avait quelques cours, et hors de
 * portée du pouce. Or créer est l'action qui donne envie de revenir : elle doit
 * être atteignable de partout dans la liste, sans remonter.
 */
export default function CarnetFab() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => {
          sfx.tap()
          setOpen(true)
        }}
        aria-haspopup="dialog"
        aria-label="Créer un cours"
        className="press-3d-deep fixed right-4 bottom-24 z-40 flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg transition-transform md:bottom-8"
      >
        <Plus className="size-7" strokeWidth={2.6} aria-hidden="true" />
      </button>

      <CreateCourseSheet open={open} onClose={() => setOpen(false)} />
    </>
  )
}
