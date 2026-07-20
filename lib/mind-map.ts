// Carte mentale — helpers purs (convention projet : la logique vit ici, testée ;
// les pages n'orchestrent).

import type { MindMapData } from '@/lib/types'

// Bornes de l'aperçu : assez pour garder une silhouette crédible, jamais assez
// pour deviner le contenu.
const MAX_DECOY_BRANCHES = 6
const MAX_DECOY_CHILDREN = 4

function dots(length: number, min: number, max: number): string {
  return '•'.repeat(Math.min(Math.max(length, min), max))
}

// Aperçu d'une carte mentale pour un NON-ABONNÉ.
//
// Le verrou était purement cosmétique : la vraie carte était rendue puis floutée
// en CSS, donc tout son texte partait quand même dans le HTML envoyé au
// navigateur — un simple « afficher le code source » suffisait à lire le
// contenu payant, sans exécuter la moindre ligne de JS.
//
// On renvoie désormais un LEURRE de même FORME (même nombre de branches et
// d'enfants, longueurs de mots comparables) pour que l'aperçu flouté garde sa
// silhouette crédible et donne envie — mais sans un seul mot du vrai contenu.
export function mindMapDecoy(data: MindMapData): MindMapData {
  return {
    centre: dots(data.centre.length, 3, 14),
    branches: data.branches.slice(0, MAX_DECOY_BRANCHES).map((b) => ({
      titre: dots(b.titre.length, 4, 12),
      enfants: b.enfants
        .slice(0, MAX_DECOY_CHILDREN)
        .map((e) => dots(e.length, 6, 18)),
    })),
  }
}
