// -----------------------------------------------------------------------------
// LA FORME DES FONDS DE CARTE — ce que scripts/cartes-exercices.ts écrit dans
// lib/exercices/cartes/fonds/*.ts et que l'écran dessine.
//
// Tout est déjà projeté dans le repère SVG du fond (lib/exercices/cartes/
// projections.ts) : l'écran ne calcule rien sur les contours, il les pose.
// -----------------------------------------------------------------------------

import type { Fond } from './projections'

/** Une région (France) ou un pays (autres fonds), qu'on colorie ou qu'on touche. */
export type ZoneFond = {
  code: string
  nom: string
  d: string
  /** Où écrire son nom. */
  cx: number
  cy: number
  continent?: string
}

export type TraceFond = { id: string; nom: string; d: string }

export type EtiquetteFond = {
  texte: string
  x: number
  y: number
  style: 'mer' | 'pays' | 'region' | 'continent'
}

export type DonneesFond = {
  fond: Fond
  largeur: number
  hauteur: number
  /**
   * Le bord de la carte : un rectangle, ou l'ovale du globe (fond monde). La
   * mer se peint dedans, et rien ne déborde dehors.
   */
  contour: string
  /** Les terres « sans frontières » dessinées sous tout le reste. */
  terre: string
  zones: ZoneFond[]
  /** Le contour du pays du fond (la France métropolitaine), trait de côte compris. */
  silhouette: string
  fleuves: TraceFond[]
  reliefs: TraceFond[]
  deserts: TraceFond[]
  /** Équateur, tropiques, cercles polaires (fond monde). */
  reperes: TraceFond[]
  etiquettes: EtiquetteFond[]
}
