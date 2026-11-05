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
 * Le bouton d'icône du son (en-tête des sessions) ; le réglage complet, avec
 * son volume, vit dans Paramètres (components/ui/ReglagesSon).
 *
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
export default function SoundToggle({ className }: { className?: string }) {
  const on = useSyncExternalStore(subscribeSound, isSoundOn, getSoundOnServer)

  const basculer = () => {
    const suivant = !on
    setSoundOn(suivant)
    // Dans cet ordre : on écrit d'abord, on sonne ensuite — `sfx` se tait si le
    // réglage dit « off », donc couper le son ne fait aucun bruit, et c'est
    // exactement ce qu'on attend d'un bouton « couper le son ».
    if (suivant) sfx.notice('success')
  }

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
