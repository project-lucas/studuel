// Les annales corrigées d'un examen, par matière (mode examen). Pur : la page
// et l'aperçu /dev/examen passent le registre et les matières de l'élève.

import { MATIERES_ANNALES, estMatiereAnnale } from '@/lib/annales-corrigees/matieres'
import type { IdExamen } from './parcours'

export function niveauDesAnnales(examen: IdExamen): '3e' | '1re' | 'Tle' {
  return examen === 'brevet' ? '3e' : examen === 'bac-francais' ? '1re' : 'Tle'
}

/** Ses matières d'examen d'abord, puis les plus fournies. */
export function annalesDeLExamen(
  annales: readonly { matiere: string; niveau: string }[],
  examen: IdExamen,
  slugsExamen: ReadonlySet<string>,
): { matiere: string; nom: string; n: number }[] {
  const niveau = niveauDesAnnales(examen)
  const parMatiere = new Map<string, number>()
  for (const a of annales) {
    if (a.niveau !== niveau || !estMatiereAnnale(a.matiere)) continue
    parMatiere.set(a.matiere, (parMatiere.get(a.matiere) ?? 0) + 1)
  }
  return [...parMatiere]
    .sort((x, y) => Number(slugsExamen.has(y[0])) - Number(slugsExamen.has(x[0])) || y[1] - x[1])
    .map(([matiere, n]) => ({ matiere, nom: MATIERES_ANNALES[matiere as keyof typeof MATIERES_ANNALES].long, n }))
}
