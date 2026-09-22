// -----------------------------------------------------------------------------
// LE REGISTRE — tous les lots de fiches réunis.
//
// Un lot = un fichier = un tableau typé. Ajouter des fiches, c'est ajouter un
// fichier et UNE LIGNE ici. Rien d'autre : la liste, la recherche, les filtres,
// la frise et les renvois se servent tous dans ce registre.
//
// ⚠️ SERVEUR SEULEMENT. Ce module tire derrière lui la totalité du corpus
// (plusieurs centaines de kilo-octets de texte). Un composant client ne
// l'importe JAMAIS — il reçoit les aperçus calculés par la page (`apercu.ts`),
// comme un module client n'importe jamais `lib/catalog` (cf. CLAUDE.md).
// -----------------------------------------------------------------------------

import type { Entree, Evenement, Personnage, Volet } from '../types'

// <<< LOTS — ce bloc est régénéré par scripts/encyclopedie-registre.mjs
import { EVENEMENTS_ANTIQUITE } from './evenements-antiquite'
import { EVENEMENTS_CONTEMPORAIN_1945 } from './evenements-contemporain-1945'
import { EVENEMENTS_CONTEMPORAIN_FRANCE } from './evenements-contemporain-france'
import { EVENEMENTS_CONTEMPORAIN_MONDE } from './evenements-contemporain-monde'
import { EVENEMENTS_EMPIRE } from './evenements-empire'
import { EVENEMENTS_GUERRES_14_18 } from './evenements-guerres-14-18'
import { EVENEMENTS_GUERRES_FRANCE_39_45 } from './evenements-guerres-france-39-45'
import { EVENEMENTS_GUERRES_MONDE_39_45 } from './evenements-guerres-monde-39-45'
import { EVENEMENTS_MOYEN_AGE_FIN } from './evenements-moyen-age-fin'
import { EVENEMENTS_MOYEN_AGE_FONDATIONS } from './evenements-moyen-age-fondations'
import { EVENEMENTS_REVOLUTION_1789 } from './evenements-revolution-1789'
import { EVENEMENTS_REVOLUTION_CAUSES } from './evenements-revolution-causes'
import { EVENEMENTS_REVOLUTION_REPUBLIQUE } from './evenements-revolution-republique'
import { EVENEMENTS_ROME } from './evenements-rome'
import { EVENEMENTS_TEMPS_MODERNES_FRANCE } from './evenements-temps-modernes-france'
import { EVENEMENTS_TEMPS_MODERNES_MONDE } from './evenements-temps-modernes-monde'
import { EVENEMENTS_XIXE_FRANCE } from './evenements-xixe-france'
import { EVENEMENTS_XIXE_MONDE } from './evenements-xixe-monde'
import { PERSONNAGES_ANTIQUITE_GRECE } from './personnages-antiquite-grece'
import { PERSONNAGES_ANTIQUITE_ORIENT } from './personnages-antiquite-orient'
import { PERSONNAGES_ANTIQUITE_ROME } from './personnages-antiquite-rome'
import { PERSONNAGES_CONTEMPORAIN_FRANCE } from './personnages-contemporain-france'
import { PERSONNAGES_CONTEMPORAIN_MONDE } from './personnages-contemporain-monde'
import { PERSONNAGES_EMPIRE } from './personnages-empire'
import { PERSONNAGES_GUERRES_FRANCE } from './personnages-guerres-france'
import { PERSONNAGES_GUERRES_MONDE } from './personnages-guerres-monde'
import { PERSONNAGES_LOUIS_XIII } from './personnages-louis-xiii'
import { PERSONNAGES_LUMIERES } from './personnages-lumieres'
import { PERSONNAGES_MOYEN_AGE_COURONNE } from './personnages-moyen-age-couronne'
import { PERSONNAGES_MOYEN_AGE_FONDATIONS } from './personnages-moyen-age-fondations'
import { PERSONNAGES_MOYEN_AGE_MONDE } from './personnages-moyen-age-monde'
import { PERSONNAGES_MOYEN_AGE_ROIS } from './personnages-moyen-age-rois'
import { PERSONNAGES_RENAISSANCE_MONDE } from './personnages-renaissance-monde'
import { PERSONNAGES_REVOLUTION_1789 } from './personnages-revolution-1789'
import { PERSONNAGES_REVOLUTION_REPUBLIQUE } from './personnages-revolution-republique'
import { PERSONNAGES_SAINTS_DE_FRANCE } from './personnages-saints-de-france'
import { PERSONNAGES_TEMPS_MODERNES_DECOUVERTES } from './personnages-temps-modernes-decouvertes'
import { PERSONNAGES_TEMPS_MODERNES_GRAND_SIECLE } from './personnages-temps-modernes-grand-siecle'
import { PERSONNAGES_TEMPS_MODERNES_RENAISSANCE } from './personnages-temps-modernes-renaissance'
import { PERSONNAGES_VALOIS } from './personnages-valois'
import { PERSONNAGES_XIXE_ARTS_SCIENCES } from './personnages-xixe-arts-sciences'
import { PERSONNAGES_XIXE_MONDE } from './personnages-xixe-monde'
import { PERSONNAGES_XIXE_POLITIQUE } from './personnages-xixe-politique'

/** Les portraits, lot par lot, dans l’ordre des fichiers. */
const LOTS_PERSONNAGES: Personnage[][] = [
  PERSONNAGES_ANTIQUITE_GRECE,
  PERSONNAGES_ANTIQUITE_ORIENT,
  PERSONNAGES_ANTIQUITE_ROME,
  PERSONNAGES_CONTEMPORAIN_FRANCE,
  PERSONNAGES_CONTEMPORAIN_MONDE,
  PERSONNAGES_EMPIRE,
  PERSONNAGES_GUERRES_FRANCE,
  PERSONNAGES_GUERRES_MONDE,
  PERSONNAGES_LOUIS_XIII,
  PERSONNAGES_LUMIERES,
  PERSONNAGES_MOYEN_AGE_COURONNE,
  PERSONNAGES_MOYEN_AGE_FONDATIONS,
  PERSONNAGES_MOYEN_AGE_MONDE,
  PERSONNAGES_MOYEN_AGE_ROIS,
  PERSONNAGES_RENAISSANCE_MONDE,
  PERSONNAGES_REVOLUTION_1789,
  PERSONNAGES_REVOLUTION_REPUBLIQUE,
  PERSONNAGES_SAINTS_DE_FRANCE,
  PERSONNAGES_TEMPS_MODERNES_DECOUVERTES,
  PERSONNAGES_TEMPS_MODERNES_GRAND_SIECLE,
  PERSONNAGES_TEMPS_MODERNES_RENAISSANCE,
  PERSONNAGES_VALOIS,
  PERSONNAGES_XIXE_ARTS_SCIENCES,
  PERSONNAGES_XIXE_MONDE,
  PERSONNAGES_XIXE_POLITIQUE,
]

/** Les événements, lot par lot, dans l’ordre des fichiers. */
const LOTS_EVENEMENTS: Evenement[][] = [
  EVENEMENTS_ANTIQUITE,
  EVENEMENTS_CONTEMPORAIN_1945,
  EVENEMENTS_CONTEMPORAIN_FRANCE,
  EVENEMENTS_CONTEMPORAIN_MONDE,
  EVENEMENTS_EMPIRE,
  EVENEMENTS_GUERRES_14_18,
  EVENEMENTS_GUERRES_FRANCE_39_45,
  EVENEMENTS_GUERRES_MONDE_39_45,
  EVENEMENTS_MOYEN_AGE_FIN,
  EVENEMENTS_MOYEN_AGE_FONDATIONS,
  EVENEMENTS_REVOLUTION_1789,
  EVENEMENTS_REVOLUTION_CAUSES,
  EVENEMENTS_REVOLUTION_REPUBLIQUE,
  EVENEMENTS_ROME,
  EVENEMENTS_TEMPS_MODERNES_FRANCE,
  EVENEMENTS_TEMPS_MODERNES_MONDE,
  EVENEMENTS_XIXE_FRANCE,
  EVENEMENTS_XIXE_MONDE,
]

export const PERSONNAGES: Personnage[] = LOTS_PERSONNAGES.flat()
export const EVENEMENTS: Evenement[] = LOTS_EVENEMENTS.flat()

/**
 * Toutes les fiches, dans l'ORDRE DU TEMPS — c'est le classement naturel d'une
 * encyclopédie d'histoire, et celui que la liste reprend tant qu'on ne cherche
 * rien. À `tri` égal, l'ordre alphabétique français départage (localeCompare
 * pour que « Étienne » ne parte pas après « Zacharie »).
 */
export const TOUTES: Entree[] = [...PERSONNAGES, ...EVENEMENTS].sort((a, b) => {
  if (a.tri !== b.tri) return a.tri - b.tri
  return a.nom.localeCompare(b.nom, 'fr')
})

const PAR_ID = new Map<string, Entree>(TOUTES.map((entree) => [entree.id, entree]))

/** La fiche d'un identifiant d'URL, ou `undefined` si elle n'existe pas. */
export function entreeParId(id: string): Entree | undefined {
  return PAR_ID.get(id)
}

/** Les fiches d'un volet, dans l'ordre du temps. */
export function entreesDuVolet(volet: Volet): Entree[] {
  return TOUTES.filter((entree) => entree.volet === volet)
}

/**
 * Les fiches voisines dans le temps, au sein du même volet : de quoi mettre
 * « précédent / suivant » en bas d'une fiche. Lire une encyclopédie d'histoire
 * de proche en proche, c'est remonter ou descendre la frise — pas l'alphabet.
 */
export function voisines(id: string): { avant?: Entree; apres?: Entree } {
  const entree = PAR_ID.get(id)
  if (!entree) return {}
  const memeVolet = entreesDuVolet(entree.volet)
  const index = memeVolet.findIndex((e) => e.id === id)
  if (index < 0) return {}
  return { avant: memeVolet[index - 1], apres: memeVolet[index + 1] }
}
