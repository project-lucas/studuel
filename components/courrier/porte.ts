import { releverDefi } from '@/app/amis/defi-actions'
import {
  encaisserLettreAction,
  lireLettreAction,
  toutLireAction,
  toutRecupererAction,
  type ReponseEncaissement,
  type ReponseToutRecuperer,
} from '@/app/courrier/actions'
import type { SourceLettre } from '@/lib/courrier'

/**
 * LA PORTE DE LA BOÎTE AUX LETTRES : les gestes que l'écran demande au
 * serveur. Les vraies Server Actions par défaut ; l'aperçu `/dev/courrier`
 * en pose une autre qui répond sans compte — l'écran ne sait pas laquelle il
 * tient, c'est ce qui permet de le regarder et de le tester sans base.
 */
export type PorteCourrier = {
  lire: (id: string, source: SourceLettre) => Promise<boolean>
  toutLire: (annonces: string[]) => Promise<boolean>
  encaisser: (id: string) => Promise<ReponseEncaissement>
  toutRecuperer: (annonces: string[]) => Promise<ReponseToutRecuperer>
  relever: (duelId: string) => Promise<{ ok: boolean }>
}

export const PORTE_SERVEUR: PorteCourrier = {
  lire: lireLettreAction,
  toutLire: toutLireAction,
  encaisser: encaisserLettreAction,
  toutRecuperer: toutRecupererAction,
  relever: releverDefi,
}
