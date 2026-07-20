// Carte mentale — helpers purs (convention projet : la logique vit ici, testée ;
// les pages n'orchestrent).

import type { MindMapData } from '@/lib/types'

// Silhouette de l'aperçu montré aux NON-ABONNÉS : assez de matière pour donner
// envie, jamais rien du contenu payant. Longueurs choisies pour ressembler à une
// carte réelle une fois floutée.
const PLACEHOLDER_SHAPE: readonly (readonly number[])[] = [
  [12, 9, 7],
  [8, 14, 10],
  [10, 7, 12, 8],
  [7, 11, 9],
  [11, 8, 13],
]

function dots(length: number): string {
  return '•'.repeat(length)
}

// Aperçu d'une carte mentale pour un NON-ABONNÉ.
//
// Le verrou était d'abord purement cosmétique : la vraie carte était rendue puis
// floutée en CSS, donc tout son texte partait quand même dans le HTML envoyé au
// navigateur — un « afficher le code source » suffisait à lire le contenu payant.
//
// On renvoie un leurre de silhouette CRÉDIBLE mais FIXE : il ne dérive pas de la
// vraie carte, ce qui permet à la page de ne même pas la charger tant que
// l'élève n'est pas abonné (le serveur ne lit plus le contenu qu'il ne doit pas
// montrer, plutôt que de le lire pour le masquer).
export function mindMapPlaceholder(): MindMapData {
  return {
    centre: dots(10),
    branches: PLACEHOLDER_SHAPE.map((enfants) => ({
      titre: dots(8),
      enfants: enfants.map(dots),
    })),
  }
}
