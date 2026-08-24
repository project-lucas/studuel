'use client'

import { useCallback, useSyncExternalStore } from 'react'
import { ChevronRight, PenLine } from 'lucide-react'
import { sfx } from '@/lib/sounds'
import { PALIER_LABEL } from '@/lib/francais/niveau-orthographe'
import { readNiveau, type NiveauEnregistre } from '@/lib/francais/niveau-store'

// Instantané SERVEUR : on ne sait rien. `localStorage` n'existe pas au rendu
// serveur, et annoncer « 78 % » d'un côté et rien de l'autre serait une
// divergence d'hydratation. Constante de module → identité stable, sans quoi
// useSyncExternalStore boucle. (Même montage que `useRecords`.)
const INCONNU: NiveauEnregistre | null = null

/**
 * La porte d'entrée du test de niveau, dans l'onglet « Mode de jeu » du
 * français.
 *
 * Elle affiche le dernier résultat quand il existe : un test de positionnement
 * dont le score disparaît ne sert à rien, et c'est ce chiffre qui donne envie
 * de le repasser dans un mois pour voir la marche franchie.
 *
 * Le résultat est lu avec `useSyncExternalStore` et non par un effet : le
 * stockage local EST un système externe. Bénéfice concret ici — le score
 * s'inscrit sur la carte dès la sortie du test, sans recharger la page.
 */
export default function NiveauOrthographeCarte({
  onOpen,
}: {
  onOpen: () => void
}) {
  const subscribe = useCallback((onChange: () => void) => {
    window.addEventListener('studuel:niveau-orthographe', onChange)
    // `storage` couvre l'autre onglet ; l'événement maison couvre celui-ci,
    // que le navigateur ne prévient jamais de ses propres écritures.
    window.addEventListener('storage', onChange)
    return () => {
      window.removeEventListener('studuel:niveau-orthographe', onChange)
      window.removeEventListener('storage', onChange)
    }
  }, [])

  const dernier = useSyncExternalStore(subscribe, readNiveau, () => INCONNU)

  return (
    <button
      type="button"
      onClick={() => {
        sfx.tap()
        onOpen()
      }}
      className="group mt-3 flex w-full items-center gap-3 rounded-2xl bg-card p-3.5 text-left shadow-sm ring-1 ring-black/5 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md active:translate-y-[1px]"
    >
      <span className="bg-primary/10 text-primary flex size-11 shrink-0 items-center justify-center rounded-xl">
        <PenLine className="size-5" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="font-heading block text-sm leading-tight font-bold">
          J’évalue mon niveau en orthographe
        </span>
        <span className="mt-0.5 block text-[11px] font-semibold text-muted-foreground">
          {dernier
            ? `Dernier résultat : ${dernier.pourcentage} %${
                dernier.niveau ? ` · ${PALIER_LABEL[dernier.niveau]}` : ''
              }`
            : '9 questions · environ 3 minutes'}
        </span>
      </span>
      {dernier ? (
        <span className="font-heading bg-highlight/20 shrink-0 rounded-full px-2.5 py-1 text-xs font-extrabold tabular-nums">
          {dernier.pourcentage} %
        </span>
      ) : null}
      <ChevronRight
        className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </button>
  )
}
