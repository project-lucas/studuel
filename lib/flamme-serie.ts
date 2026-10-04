// -----------------------------------------------------------------------------
// LES PALIERS DE LA FLAMME DE SÉRIE (04/10/2026). Lucas a d'abord voulu trois
// paliers (orange, bleue à 5 jours, un sommet à 7) ; deux sommets ont été
// dessinés et animés — noir-violet-or, puis or couronné — et écartés : « on va
// rester sur la flamme de base qui est bien, la flamme bleue, la flamme
// éteinte ». Ne pas refaire de troisième palier.
//
//   · ÉTEINTE  : pas de série (la flamme grise, `eteinte` de FlammeAnimee) ;
//   · ORANGE   : la série court ;
//   · BLEUE    : dès 5 jours d'affilée, plus chaude.
//
// Servie par components/FlammeAnimee, partout où la série s'affiche ; images
// animées fabriquées par scripts/flamme-animee.mjs. Pur et testé.
// -----------------------------------------------------------------------------

export type PalierFlamme = 'feu' | 'bleue'

/** Le seuil de la flamme bleue, en jours d'affilée. */
export const SEUIL_BLEUE = 5

export function palierFlamme(serie: number): PalierFlamme {
  const n = Number.isFinite(serie) ? Math.floor(serie) : 0
  return n >= SEUIL_BLEUE ? 'bleue' : 'feu'
}

/** Le nom de fichier de la flamme animée (public/images/serie/<nom>.webp). */
export const FICHIER_FLAMME: Readonly<Record<PalierFlamme, string>> = {
  feu: 'flamme-v3',
  bleue: 'flamme-bleue',
}

/** Ce que la flamme dit, pour qui ne la voit pas (la bulle, l'aria). */
export function nomPalier(p: PalierFlamme): string {
  return p === 'bleue' ? 'flamme bleue' : 'flamme'
}

/** Combien de jours avant la flamme bleue (null une fois atteinte). */
export function avantPalierSuivant(serie: number): { palier: PalierFlamme; jours: number } | null {
  const n = Math.max(0, Math.floor(Number.isFinite(serie) ? serie : 0))
  return n < SEUIL_BLEUE ? { palier: 'bleue', jours: SEUIL_BLEUE - n } : null
}
