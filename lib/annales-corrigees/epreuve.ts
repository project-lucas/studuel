// Le nom d'une épreuve d'annale : sur l'écran du corrigé, la page du sujet et
// la vignette de la carte. Pur ; `scripts/annales-sujets.mjs` (couverture PDF)
// en garde une copie, un .mjs ne lisant pas le TS.
import type { Examen } from './types'

export function titreEpreuve(a: { examen: Examen; matiere: string; annee: number }): string {
  if (a.examen === 'brevet') return `Brevet ${a.annee}`
  if (a.examen === 'bac-anticipe')
    return a.matiere === 'francais' ? `Bac de français ${a.annee}` : `Épreuve anticipée ${a.annee}`
  return `Bac ${a.annee}`
}

/** Le mot court de la vignette (« Bac », « Brevet »), au-dessus de l'année. */
export function sigleEpreuve(examen: Examen): string {
  return examen === 'brevet' ? 'Brevet' : 'Bac'
}
