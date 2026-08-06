// Le RECORD personnel d'un jeu de salon — clé de stockage, comparaison, libellé.
//
// Le record est LOCAL (localStorage) : un jeu de salon pioche dans sa propre
// banque, jamais dans le programme de l'élève, donc rien à rapprocher côté
// serveur. Ce fichier existe parce que la même paire `bestKey`/`readBest` était
// recopiée dans les quatre tables de jeu — et qu'il fallait désormais la LIRE
// ailleurs (les billets des modes de jeu affichent le record à battre).
//
// Les fonctions pures (clé, comparaison, libellé) sont testées ; les deux
// accès au stockage sont de simples enveloppes tolérantes (navigation privée,
// rendu serveur : on retombe sur 0, jamais d'exception).

/** Préfixe commun des clés de record — un seul endroit à changer. */
export const RECORD_PREFIX = 'studuel-jeu-'

/** Clé de stockage du record d'un jeu. */
export function gameBestKey(id: string): string {
  return `${RECORD_PREFIX}${id}-best`
}

/** Le score bat-il le record ? (à égalité, ce n'est PAS un nouveau record) */
export function isNewRecord(score: number, previous: number): boolean {
  return score > previous
}

/**
 * Le record en toutes lettres, groupé par milliers avec l'espace fine
 * insécable du français (« 1 250 »). Pas de `toLocaleString` : son résultat
 * dépend de la locale de l'appareil, et le même écran afficherait « 1,250 »
 * sur un téléphone en anglais.
 */
export function formatRecord(best: number): string {
  const n = Math.max(0, Math.round(best))
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

/** Le libellé du billet : le record à battre, ou l'invitation à en poser un. */
export function recordLabel(best: number): string {
  return best > 0 ? `Record ${formatRecord(best)}` : 'Aucun record'
}

// --------------------------------------------------------------- stockage

/**
 * Record rangé sous cette clé (0 si jamais joué, ou stockage indisponible).
 * Prend la CLÉ et non l'id de jeu : les trois modes de l'Arène ont les leurs
 * (`lib/defi-modes`), posées bien avant que les salons existent.
 */
export function readRecordAt(key: string): number {
  if (typeof window === 'undefined') return 0
  try {
    return Number(window.localStorage.getItem(key)) || 0
  } catch {
    return 0
  }
}

/** Record enregistré pour ce jeu (0 si jamais joué, ou stockage indisponible). */
export function readGameBest(id: string): number {
  return readRecordAt(gameBestKey(id))
}

/**
 * Enregistre le score s'il bat le record. Retourne `true` quand c'est un
 * nouveau record — c'est ce que les tables de jeu célèbrent à l'écran de fin.
 */
export function writeGameBest(id: string, score: number): boolean {
  const previous = readGameBest(id)
  if (!isNewRecord(score, previous)) return false
  try {
    window.localStorage.setItem(gameBestKey(id), String(score))
  } catch {
    // stockage indisponible : tant pis pour le record local
  }
  return true
}

/** Les records de plusieurs jeux d'un coup (les billets d'une matière). */
export function readGameBests(ids: string[]): Record<string, number> {
  const bests: Record<string, number> = {}
  for (const id of ids) bests[id] = readGameBest(id)
  return bests
}
