// « Tes pièges » : les chapitres où l'élève se trompe le plus, pour une épreuve
// (onglet Examen). Pur et testé ; la lecture est dans app/api/examen/pieges.

export type Piege = { chapitre: string; titre: string; erreurs: number }

export const MAX_PIEGES = 3

export function piegesParChapitre(
  lignes: readonly { chapitre: string | null; erreurs: number }[],
  titres: ReadonlyMap<string, string>,
): Piege[] {
  const somme = new Map<string, number>()
  for (const l of lignes) {
    if (!l.chapitre || l.erreurs <= 0) continue
    somme.set(l.chapitre, (somme.get(l.chapitre) ?? 0) + l.erreurs)
  }
  return [...somme]
    .filter(([c]) => titres.has(c))
    .sort((a, b) => b[1] - a[1] || (titres.get(a[0]) ?? '').localeCompare(titres.get(b[0]) ?? ''))
    .slice(0, MAX_PIEGES)
    .map(([chapitre, erreurs]) => ({ chapitre, titre: titres.get(chapitre) as string, erreurs }))
}
