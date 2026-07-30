// Signal « le premier écran de l'app est peint ».
//
// Le layout racine diffuse le bandeau du haut en flux (Suspense) : il arrive
// APRÈS l'événement `load` du document. Un écran de chargement qui se fie au
// seul `load` s'ouvre donc sur des squelettes — précisément ce qu'il existe
// pour éviter. Ce module est le fil qui relie « le contenu streamé est révélé »
// (AppReadyBeacon, monté dans la frontière Suspense) à « le rideau peut lever »
// (SplashScreen).
//
// Un simple événement DOM ne suffirait pas : le bâtisseur peut signaler AVANT
// que l'écouteur ne s'abonne (ordre de montage non garanti avec le streaming).
// D'où le drapeau mémorisé — un abonné tardif apprend quand même la nouvelle.

let painted = false
const listeners = new Set<() => void>()

/** Le premier écran est peint. Idempotent : les rappels ne sont joués qu'une fois. */
export function markAppReady(): void {
  if (painted) return
  painted = true
  // Copie avant parcours : un rappel qui se désabonne muterait le Set en cours
  // d'itération.
  for (const listener of [...listeners]) listener()
  listeners.clear()
}

/**
 * S'abonne au signal. Si l'app est DÉJÀ prête, le rappel part immédiatement.
 * Renvoie la fonction de désabonnement (à appeler au démontage).
 */
export function onAppReady(listener: () => void): () => void {
  if (painted) {
    listener()
    return () => {}
  }
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/** L'app est-elle déjà signalée prête ? */
export function isAppReady(): boolean {
  return painted
}

/** Remet le module à zéro — réservé aux tests (l'état est un module singleton). */
export function resetAppReady(): void {
  painted = false
  listeners.clear()
}
