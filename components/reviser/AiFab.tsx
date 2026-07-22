'use client'

import { useState } from 'react'
import { Sparkles, WandSparkles, X } from 'lucide-react'
import { sfx } from '@/lib/sounds'

// FAB baguette magique (bas droite, fixe) : l'unique entrée IA de la page
// matière. Pour l'instant, une feuille placeholder « Génération de contenu
// IA — bientôt ».
export default function AiFab() {
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed right-4 bottom-20 z-40 flex flex-col items-end gap-2 md:bottom-8">
      {open ? (
        <div className="pop-in w-64 rounded-2xl border bg-card p-4 shadow-lg">
          <p className="flex items-center gap-1.5 text-sm font-bold">
            <Sparkles className="size-4 text-primary" aria-hidden="true" />
            Génération de contenu IA
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Bientôt : des quiz, flashcards et fiches générés sur mesure pour
            cette matière.
          </p>
        </div>
      ) : null}
      <button
        type="button"
        onClick={() => {
          sfx.tap()
          setOpen((o) => !o)
        }}
        aria-label={
          open ? 'Fermer l’assistant IA' : 'Ouvrir l’assistant IA'
        }
        aria-expanded={open}
        className="press-3d-deep flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg"
      >
        {open ? (
          <X className="size-6" aria-hidden="true" />
        ) : (
          <WandSparkles className="size-6" aria-hidden="true" />
        )}
      </button>
    </div>
  )
}
