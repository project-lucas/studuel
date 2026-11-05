/**
 * LES SUPPORTS D'UNE FICHE PÉRIMENT (05/11/2026, Lucas : « dès que l'élève a
 * lu un cours en respectant la durée minimale, la coche verte doit apparaître »).
 *
 * Le sommaire d'une matière garde les supports qu'il a lus pour la session
 * (`useSupportsDeFiche`) et l'onglet Réviser reste monté : sans signal, revenir
 * du cours montrait la tuile « Cours » d'avant la lecture. Une écriture qui
 * change un support (cours lu…) fait monter ce numéro ; le sommaire, à son
 * prochain affichage, oublie ce qu'il avait et relit la fiche ouverte.
 *
 * Un simple compteur plutôt qu'un événement : sous `<Activity>`, l'onglet
 * caché a démonté ses effets et n'entendrait pas un événement ponctuel.
 */
let version = 0
const abonnes = new Set<() => void>()

export function signalerSupportsPerimes(): void {
  version += 1
  for (const f of abonnes) f()
}

export function versionSupports(): number {
  return version
}

export function abonnerSupports(f: () => void): () => void {
  abonnes.add(f)
  return () => {
    abonnes.delete(f)
  }
}
