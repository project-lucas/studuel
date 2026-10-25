'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { marquerDecouverte } from '@/app/decouverte-actions'
import { decouverteParCle, type Decouverte } from '@/lib/decouverte/catalogue'
import {
  cleDemandee,
  nouveauteSurLaPage,
  verrouDuChemin,
  type EtatDecouverte,
} from '@/lib/decouverte/etat'
import { etapesDeDecouverte } from '@/lib/tour'
import { BullesTour } from '@/components/TourGuide'
import { marquerVueEnLocal, poserEtatDecouverte, useEtatDecouverte } from './store'

/**
 * LA VEILLE DE LA DÉCOUVERTE PROGRESSIVE (25/10/2026, cadrage « le jeu
 * vivant » § E). Rendue par TopHudLoader à côté du bandeau — donc dans le
 * layout, hors des onglets gardés vivants : elle suit toutes les navigations
 * et n'est jamais mise en sommeil par <Activity>.
 *
 * Quatre tâches :
 *   1. verser au magasin (store) ce que le serveur a lu dans la vague du
 *      bandeau : niveau, XP, clés déjà vues, `decouverte_depuis` ;
 *   2. `?decouvrir=<cle>` sur n'importe quelle page : jouer le mini-tour de
 *      cette clé (ses bulles viennent du catalogue) ;
 *   3. l'ANNONCE AUTOMATIQUE : sur la page d'une nouveauté ouverte et jamais
 *      vue (l'arène au niveau 2, la ligue au niveau 3…), lancer son mini-tour
 *      tout seul, une fois par session ; jamais « reviser », que le tour
 *      premiers pas couvre ;
 *   4. un nouveau compte posé sur un onglet fermé (`/` mène à /defi) est
 *      renvoyé vers Réviser.
 * En fin de tour (fini ou passé) : le navigateur s'en souvient tout de suite
 * (marquerVueEnLocal), le serveur ensuite (decouverte_marquer, sans refresh).
 */
export default function DecouverteVeille({ etat }: { etat: EtatDecouverte }) {
  const pathname = usePathname()
  const params = useSearchParams()
  const router = useRouter()
  const courant = useEtatDecouverte()
  const [actif, setActif] = useState<Decouverte | null>(null)
  const proposees = useRef(new Set<string>())

  // 1. Ce que le serveur a lu entre au magasin. Dépendances en valeurs (pas
  // l'objet, recréé à chaque rendu serveur) : le magasin n'est republié que si
  // quelque chose a changé.
  const { niveau, xp, depuis } = etat
  const vuesCle = etat.vues.join(',')
  useEffect(() => {
    poserEtatDecouverte({ niveau, xp, depuis, vues: vuesCle ? vuesCle.split(',') : [] })
  }, [niveau, xp, depuis, vuesCle])

  // 2. `?decouvrir=<cle>` : le mini-tour demandé, après un court délai pour
  // laisser la page s'installer.
  const demandee = cleDemandee(params.get('decouvrir'))
  useEffect(() => {
    if (!demandee) return
    const d = decouverteParCle(demandee)
    if (!d) return
    const t = window.setTimeout(() => setActif(d), 600)
    return () => window.clearTimeout(t)
  }, [demandee])

  // 3. L'annonce automatique de la nouveauté de cette page.
  useEffect(() => {
    if (demandee || actif) return
    const d = nouveauteSurLaPage(pathname, courant)
    if (!d || proposees.current.has(d.cle)) return
    const t = window.setTimeout(() => {
      proposees.current.add(d.cle)
      setActif(d)
    }, 900)
    return () => window.clearTimeout(t)
  }, [pathname, courant, demandee, actif])

  // 4. Un onglet fermé n'a pas d'écran : retour à Réviser.
  useEffect(() => {
    if (verrouDuChemin(pathname, courant)) router.replace('/reviser')
  }, [pathname, courant, router])

  const etapes = useMemo(() => (actif ? etapesDeDecouverte(actif) : []), [actif])

  const finir = useCallback(() => {
    const d = actif
    setActif(null)
    if (!d) return
    marquerVueEnLocal(d.cle)
    marquerDecouverte(d.cle).catch(() => {})
    if (demandee === d.cle) {
      // L'adresse ne garde pas la demande : un rechargement ne rejoue pas le tour.
      const url = new URL(window.location.href)
      url.searchParams.delete('decouvrir')
      window.history.replaceState(null, '', url)
    }
  }, [actif, demandee])

  if (!actif) return null
  return <BullesTour etapes={etapes} onFin={finir} />
}
