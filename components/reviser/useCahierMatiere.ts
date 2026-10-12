'use client'

import { useEffect, useSyncExternalStore } from 'react'
import type { CahierMatiere } from '@/lib/exercices/cahier-matiere'

/**
 * LE CAHIER D'UNE MATIÈRE, côté navigateur — lu à la demande, gardé en mémoire.
 *
 * La page de la matière ne lit pas le cahier (la plupart des visites n'ouvrent
 * pas la porte « Exercices »). Il arrive par `/api/reviser/cahier` :
 *
 *   · dès que le doigt se pose sur la porte (`prechargerCahier`), une centaine
 *     de millisecondes avant le clic ;
 *   · une seule fois par matière tant que la page vit : rouvrir la porte
 *     affiche tout de suite ce qu'on a déjà, et relit derrière (un exercice
 *     réussi entre-temps avance le marque-page sans écran d'attente).
 *
 * Un petit magasin hors de React (`useSyncExternalStore`) : deux composants qui
 * regardent la même matière voient la même chose, et un aller-retour en cours
 * n'est jamais doublé.
 */

export type VueCahier =
  | { etat: 'attente'; cahier: null }
  | { etat: 'pret'; cahier: CahierMatiere }
  | { etat: 'erreur'; cahier: null }

const ATTENTE: VueCahier = { etat: 'attente', cahier: null }
const ERREUR: VueCahier = { etat: 'erreur', cahier: null }

const vues = new Map<string, VueCahier>()
const enCours = new Map<string, Promise<void>>()
const abonnes = new Set<() => void>()

function publier(slug: string, vue: VueCahier) {
  vues.set(slug, vue)
  abonnes.forEach((prevenir) => prevenir())
}

function abonner(prevenir: () => void): () => void {
  abonnes.add(prevenir)
  return () => abonnes.delete(prevenir)
}

async function lire(slug: string): Promise<void> {
  try {
    const reponse = await fetch(`/api/reviser/cahier?matiere=${encodeURIComponent(slug)}`, {
      credentials: 'same-origin',
    })
    if (reponse.status !== 200) throw new Error(`cahier ${reponse.status}`)
    const corps = (await reponse.json()) as { cahier?: CahierMatiere }
    if (!corps.cahier) throw new Error('cahier absent')
    publier(slug, { etat: 'pret', cahier: corps.cahier })
  } catch {
    // Un cahier déjà affiché reste à l'écran : une relecture ratée ne le vide pas.
    if (vues.get(slug)?.etat !== 'pret') publier(slug, ERREUR)
  }
}

/** Lance (ou rejoint) la lecture du cahier. Sans effet si elle est déjà en route. */
export function prechargerCahier(slug: string): void {
  if (enCours.has(slug)) return
  if (vues.get(slug)?.etat === 'erreur') publier(slug, ATTENTE)
  enCours.set(
    slug,
    lire(slug).finally(() => enCours.delete(slug)),
  )
}

/** Le cahier de la matière : ce qu'on a déjà, relu à chaque ouverture de la porte. */
export function useCahierMatiere(slug: string): VueCahier {
  const vue = useSyncExternalStore(
    abonner,
    () => vues.get(slug) ?? ATTENTE,
    () => ATTENTE,
  )
  useEffect(() => {
    prechargerCahier(slug)
  }, [slug])
  return vue
}

/** Dépose un cahier déjà lu (l'aperçu de développement, les tests). */
export function amorcerCahier(slug: string, cahier: CahierMatiere): void {
  publier(slug, { etat: 'pret', cahier })
}

/** Pour les tests : repartir d'un magasin vide. */
export function viderCahiers(): void {
  vues.clear()
  enCours.clear()
}
