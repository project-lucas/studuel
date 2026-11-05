'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import FeuilleQuetes from './FeuilleQuetes'
import { relireQuetes } from './store'

/** La quête vient souvent de se finir sur l'écran qu'on quitte : son
 *  écriture part après la réponse (lib/quests-server.avancerQuetesApres). On
 *  laisse à la base le temps de l'avoir avant de relire. */
const DELAI_RELECTURE_MS = 1500
/** Pas plus d'une relecture toutes les quatre secondes en naviguant. */
const RELECTURE_MIN_MS = 4000

/**
 * LES QUÊTES DU JOUR, PARTOUT (03/10/2026, Lucas : « on ne veut pas les
 * rater »). Monté une fois dans la mise en page, pour un élève connecté :
 *   · relit les quêtes au lancement, à chaque changement d'écran (au plus
 *     toutes les 4 s) et à chaque retour dans l'app — le bouton flottant
 *     (PastilleQuetes), la carte de Réviser et la tuile de l'arène lisent ce
 *     magasin ;
 *   · porte LA feuille des quêtes (FeuilleQuetes).
 *
 * Plus de bandeau « Quête accomplie / Encaisser » ni de musique (05/11/2026,
 * Lucas : « c'est chiant, coupe ») : c'est le bouton flottant qui le dit, son
 * anneau qui se remplit et le nombre à encaisser.
 */
export default function QuetesGlobales() {
  const pathname = usePathname() ?? ''
  const derniere = useRef(0)

  // Relecture : au lancement (tout de suite), puis à chaque changement d'écran.
  useEffect(() => {
    const premiere = derniere.current === 0
    if (!premiere && Date.now() - derniere.current < RELECTURE_MIN_MS) return
    const t = window.setTimeout(
      () => {
        derniere.current = Date.now()
        void relireQuetes()
      },
      premiere ? 0 : DELAI_RELECTURE_MS,
    )
    return () => window.clearTimeout(t)
  }, [pathname])

  useEffect(() => {
    let attente: number | undefined
    const auRetour = () => {
      if (document.visibilityState !== 'visible') return
      window.clearTimeout(attente)
      attente = window.setTimeout(() => void relireQuetes(), 300)
    }
    document.addEventListener('visibilitychange', auRetour)
    return () => {
      window.clearTimeout(attente)
      document.removeEventListener('visibilitychange', auRetour)
    }
  }, [])

  return <FeuilleQuetes />
}
