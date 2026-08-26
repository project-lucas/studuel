'use client'

import { useSyncExternalStore } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import {
  getSoundOnServer,
  isSoundOn,
  setSoundOn,
  sfx,
  subscribeSound,
} from '@/lib/sounds'
import { cn } from '@/lib/utils'

/**
 * L'interrupteur du son — et de l'haptique, qui suit le même réglage.
 *
 * POURQUOI IL DÉMÉNAGE. Il n'existait qu'à UN endroit dans toute l'app :
 * l'en-tête d'une session de flashcards. Un élève en cours, en bibliothèque ou
 * dans le bus n'avait donc aucun moyen de couper le son de Studuel sans
 * ouvrir un paquet de cartes pour aller y chercher un bouton — ou sans couper
 * le son de son téléphone entier. Sur une app qui sonne à chaque tap, c'est le
 * réglage le plus demandé et c'était le plus caché.
 *
 * `useSyncExternalStore` plutôt qu'un `useState` + `useEffect` : la préférence
 * vit dans `localStorage`, que le rendu SERVEUR ne voit pas. Le snapshot
 * serveur vaut `false` (son coupé) et le client corrige à l'hydratation — c'est
 * le même remède que l'ancien composant, mais il apporte en plus la
 * synchronisation entre les deux emplacements et entre onglets.
 *
 * ALLUMER LE SON JOUE UN SON. C'est la seule preuve immédiate que le réglage a
 * pris, et elle donne au passage le niveau sonore — un élève qui active le son
 * en classe a le droit de l'apprendre par un « pop » discret plutôt que par la
 * fanfare de fin de session, trente secondes plus tard.
 */
export default function SoundToggle({
  variant = 'icone',
  className,
}: {
  /**
   * `icone` : le bouton discret des en-têtes de session.
   * `reglage` : la ligne complète d'une page de réglages (libellé + état).
   */
  variant?: 'icone' | 'reglage'
  className?: string
}) {
  const on = useSyncExternalStore(subscribeSound, isSoundOn, getSoundOnServer)

  const basculer = () => {
    const suivant = !on
    setSoundOn(suivant)
    // Dans cet ordre : on écrit d'abord, on sonne ensuite — `sfx` se tait si le
    // réglage dit « off », donc couper le son ne fait aucun bruit, et c'est
    // exactement ce qu'on attend d'un bouton « couper le son ».
    if (suivant) sfx.notice('success')
  }

  if (variant === 'icone') {
    return (
      <button
        type="button"
        aria-label={on ? 'Couper le son' : 'Activer le son'}
        aria-pressed={on}
        title={on ? 'Couper le son' : 'Activer le son'}
        onClick={basculer}
        className={cn(
          'text-muted-foreground hover:text-foreground cursor-pointer transition-colors',
          className,
        )}
      >
        {on ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={basculer}
      aria-pressed={on}
      className={cn(
        'focus-visible:ring-primary/50 flex w-full cursor-pointer items-center gap-3 rounded-xl border p-3 text-left transition-colors focus-visible:ring-2 focus-visible:outline-none',
        on ? 'border-primary/40 bg-primary/[0.04]' : 'hover:border-primary/30',
        className,
      )}
    >
      <span
        className={cn(
          'flex size-9 shrink-0 items-center justify-center rounded-lg',
          on ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground',
        )}
      >
        {on ? (
          <Volume2 className="size-4" strokeWidth={2.4} aria-hidden="true" />
        ) : (
          <VolumeX className="size-4" strokeWidth={2.4} aria-hidden="true" />
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold">
          Sons et vibrations
        </span>
        <span className="text-muted-foreground block text-xs">
          {on
            ? 'Activés — les retours de l’app et les jeux sonnent.'
            : 'Coupés — l’app reste entièrement silencieuse.'}
        </span>
      </span>
      {/* Un interrupteur dessiné plutôt qu'une case : c'est le geste qu'un
          élève connaît de son téléphone, et il dit son état sans être lu. */}
      <span
        aria-hidden="true"
        className={cn(
          'flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors',
          on ? 'bg-primary' : 'bg-muted-foreground/30',
        )}
      >
        <span
          className={cn(
            'size-5 rounded-full bg-white shadow-sm transition-transform',
            on && 'translate-x-5',
          )}
        />
      </span>
    </button>
  )
}
