// LES PLANCHES À DÉSIGNER, par identifiant — le registre que la table de jeu
// (composant client) résout elle-même.
//
// Pourquoi un identifiant et non l'objet : une planche porte des FONCTIONS
// (`zoneAt`, `zoneLabel`…), et une page serveur ne peut pas en passer à un
// composant client (« Functions cannot be passed directly to Client
// Components » — la première partie de Muscles express plantait là, 14/10/2026).
// La page ne transmet donc que la clé ; le client retrouve la planche ici.
//
// Une planche peut avoir PLUSIEURS VUES (l'écorché de face et de dos) : la
// vue jouée est celle de la cible demandée (`Cible.vue`).
import { PLANCHE_ORGANES } from '@/lib/jeux/anatomie'
import { PLANCHES_MUSCLES } from '@/lib/jeux/muscles'
import type { Cible, Planche } from '@/lib/jeux/planche'

export type PlancheId = 'organes' | 'muscles'

/** Les vues de chaque planche ; la première est la vue par défaut. */
export const VUES_PLANCHES: Record<PlancheId, Record<string, Planche>> = {
  organes: { face: PLANCHE_ORGANES },
  muscles: PLANCHES_MUSCLES,
}

/** La planche par défaut de chaque identifiant (sa première vue). */
export const PLANCHES: Record<PlancheId, Planche> = {
  organes: PLANCHE_ORGANES,
  muscles: PLANCHES_MUSCLES.face,
}

/** La planche où chercher cette cible : sa vue, sinon la vue par défaut. */
export function plancheDe(id: PlancheId, cible?: Pick<Cible, 'vue'> | null): Planche {
  const vues = VUES_PLANCHES[id]
  return (cible?.vue ? vues[cible.vue] : undefined) ?? PLANCHES[id]
}

export function planchePour(id: PlancheId): Planche {
  return PLANCHES[id]
}

/** Les images peintes d'une planche, à précharger avant la partie. */
export function imagesDe(id: PlancheId): string[] {
  return Object.values(VUES_PLANCHES[id])
    .map((p) => p.image)
    .filter((src): src is string => Boolean(src))
}
