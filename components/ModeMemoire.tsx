'use client'

import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react'
import Image from 'next/image'
import { sfx } from '@/lib/sounds'
import { cn } from '@/lib/utils'
import styles from './ModeMemoire.module.css'

/** Posée sur <html> tant que le bouton est à l'écran : les quêtes se rangent au-dessus. */
const CLASSE_MEMOIRE_FAB = 'memoire-fab'

/**
 * LE MODE MÉMOIRE — cacher les mots-clés d'un cours pour se les réciter
 * (26/10/2026, Lucas : « il faut permettre la possibilité de cacher les zones
 * clés d'un cours, pour permettre au user de faire travailler sa mémoire en
 * cherchant les mots ou notions cachés »).
 *
 * Le cours est rendu par le serveur (LessonRichContent, aucun état) : ce
 * composant l'ENVELOPPE sans le réécrire. Un bouton pose ou retire le cache ;
 * la feuille de style (module) habille alors chaque <strong> — les termes à
 * retenir du contenu — en plaque hachurée. Le tap sur un terme est délégué au
 * conteneur : il bascule `data-revele` sur le <strong> touché, un attribut que
 * React ne gère pas, donc ne reposera pas. Les bulles « idée clé » gardent
 * leur texte : c'est la notion qu'on cherche, pas la phrase qui l'explique.
 *
 * LE BOUTON EST FLOTTANT, en bas à droite (le même soir, Lucas : « l'icône qui
 * cache les notions clés doit devenir un icône flottant discret mais joli,
 * crée-la via Higgsfield, placé en bas à droite ») : un rond blanc à bague
 * lavande qui porte l'œil fermé étoilé (`public/images/cours/mode-memoire.webp`,
 * planche Higgsfield dans assets-sources/icones/). Actif : bague violette et
 * la pastille du nombre de notions cachées ; une étiquette à sa gauche dit
 * « touche un mot pour le révéler ». Il pose `html.memoire-fab` pour que le
 * bouton des quêtes (components/quetes/BoutonQuetesFlottant) monte d'un cran,
 * comme devant le bouton de Marcel. Le chrono de lecture, lui, est en bas à
 * gauche.
 */
export default function ModeMemoire({ children }: { children: ReactNode }) {
  const [actif, setActif] = useState(false)
  const [caches, setCaches] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.documentElement.classList.add(CLASSE_MEMOIRE_FAB)
    return () => document.documentElement.classList.remove(CLASSE_MEMOIRE_FAB)
  }, [])

  // Le compte des mots cachés, lu dans le DOM au moment du geste — c'est le
  // serveur qui a écrit les <strong>, personne d'autre ne les connaît ici. En
  // retirant le cache, on efface aussi les révélations : au prochain cache,
  // tout est de nouveau à chercher.
  const basculerMode = () => {
    sfx.tap()
    const termes = ref.current?.querySelectorAll('strong') ?? []
    if (actif) {
      termes.forEach((t) => t.removeAttribute('data-revele'))
      setActif(false)
      setCaches(0)
      return
    }
    setActif(true)
    setCaches(termes.length)
  }

  const basculerTerme = (e: MouseEvent<HTMLDivElement>) => {
    if (!actif) return
    const cible = (e.target as HTMLElement | null)?.closest('strong')
    if (!cible || !ref.current?.contains(cible)) return
    // Un lien ou un bouton dans le gras garde son geste.
    if (cible.closest('a, button')) return
    e.preventDefault()
    if (cible.hasAttribute('data-revele')) cible.removeAttribute('data-revele')
    else cible.setAttribute('data-revele', '')
  }

  return (
    <div>
      <div ref={ref} className={actif ? styles.trous : undefined} onClick={basculerTerme}>
        {children}
      </div>

      {/* Le bouton flottant, en bas à droite — en face du chrono de lecture.
          Sur PC, le bas de l'écran n'a pas de barre d'onglets. */}
      <div className={cn(styles.fab, 'sans-papier fixed right-4 bottom-24 z-40 flex items-center gap-2 md:bottom-8')}>
        {actif ? (
          <p role="status" className={cn(styles.etiquette, 'rounded-full bg-card/95 px-3 py-1.5 text-[11px] font-bold text-foreground shadow-sm ring-1 ring-black/5')}>
            {caches > 0 ? 'Touche un mot pour le révéler' : 'Ce cours n’a pas de mot-clé à cacher'}
          </p>
        ) : null}
        <button
          type="button"
          aria-pressed={actif}
          aria-label={actif ? `Montrer les mots-clés (${caches} cachés)` : 'Cacher les mots-clés pour les réciter'}
          title={actif ? 'Montrer les mots-clés' : 'Cacher les mots-clés'}
          onClick={basculerMode}
          className={cn(styles.bouton, actif && styles.actif)}
        >
          <Image src="/images/cours/mode-memoire.webp" alt="" width={96} height={96} className={styles.icone} />
          {actif && caches > 0 ? (
            <span aria-hidden="true" className={styles.badge}>
              {caches}
            </span>
          ) : null}
        </button>
      </div>
    </div>
  )
}
