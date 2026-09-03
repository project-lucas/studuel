'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { onAppReady } from '@/lib/app-ready'
import { prechargerOnglet } from '@/components/PrechargeurOnglets'
import {
  DELAI_PREMIER_DOSSIER_MS,
  doitPrecharger,
  planifierListe,
} from '@/lib/precharge-onglets'

/**
 * LES PREMIERS DOSSIERS DE MATIÈRE, préchargés depuis Réviser.
 *
 * Lucas l'a senti sur son téléphone : ouvrir l'app puis toucher le premier
 * dossier, c'est une latence nette. La page d'une matière est entièrement
 * dynamique (profil, programme, sessions, questions, carnet) et rien ne la
 * demandait avant le tap. Ce composant, monté par la grille des matières,
 * demande au routeur les premiers dossiers de la grille — en entier, un par un,
 * après que les onglets ont eu leur tour (cf. `PrechargeurOnglets`). Les
 * mêmes garde-fous : seulement visible, seulement sur un onglet, et l'élève
 * actif. Ne rend rien.
 */
export default function PrechargeurDossiers({ hrefs }: { hrefs: string[] }) {
  const router = useRouter()
  const pathname = usePathname()
  // Une clé stable pour l'effet : la liste change d'identité à chaque rendu.
  const cle = hrefs.join(' ')

  useEffect(() => {
    if (!cle) return
    const liste = cle.split(' ')
    const timers: Array<ReturnType<typeof setTimeout>> = []
    let arrete = false
    const derniereActivite = Date.now()

    const contexte = () => ({
      pathname,
      visible: document.visibilityState === 'visible',
      derniereActiviteMs: derniereActivite,
      nowMs: Date.now(),
    })

    const desabonner = onAppReady(() => {
      if (arrete || !doitPrecharger(contexte())) return
      for (const { href, retardMs } of planifierListe(liste, DELAI_PREMIER_DOSSIER_MS)) {
        timers.push(
          setTimeout(() => {
            if (arrete || !doitPrecharger(contexte())) return
            prechargerOnglet(router, href)
          }, retardMs),
        )
      }
    })

    return () => {
      arrete = true
      desabonner()
      for (const id of timers) clearTimeout(id)
    }
  }, [router, pathname, cle])

  return null
}
