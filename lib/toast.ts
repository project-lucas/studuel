// -----------------------------------------------------------------------------
// Toast global — file de messages éphémères (« Enregistré ✓ ») pour les actions
// qui n'ont pas de retour visuel en place (date de contrôle, ajout d'événement,
// fin d'édition des matières…). Volontairement SANS provider React : un petit
// store module + useSyncExternalStore côté composant (components/Toaster.tsx).
// `toast()` s'appelle de n'importe quel composant client, rien à câbler.
// -----------------------------------------------------------------------------

export type ToastKind = 'success' | 'error'

export type Toast = {
  id: number
  message: string
  kind: ToastKind
}

// Durée d'affichage : assez pour lire, assez court pour ne pas gêner.
export const TOAST_DURATION_MS = 3200
// On ne garde que les derniers messages : pas de pile infinie à l'écran.
export const TOAST_MAX = 3

type Listener = () => void

let queue: readonly Toast[] = []
let nextId = 1
const listeners = new Set<Listener>()

function notify() {
  for (const l of listeners) l()
}

/** Ajoute un toast (retire le plus ancien si la file est pleine). */
export function toast(message: string, kind: ToastKind = 'success'): void {
  const entry: Toast = { id: nextId++, message, kind }
  queue = [...queue, entry].slice(-TOAST_MAX)
  notify()
  setTimeout(() => dismissToast(entry.id), TOAST_DURATION_MS)
}

/** Retire un toast (expiration automatique ou tap de l'utilisateur). */
export function dismissToast(id: number): void {
  if (!queue.some((t) => t.id === id)) return
  queue = queue.filter((t) => t.id !== id)
  notify()
}

// --- abonnement (contrat useSyncExternalStore) -------------------------------

export function subscribeToasts(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getToasts(): readonly Toast[] {
  return queue
}

/** Snapshot serveur : jamais de toast au SSR. */
export function getServerToasts(): readonly Toast[] {
  return EMPTY
}

const EMPTY: readonly Toast[] = []

/** Réservé aux tests : repart d'une file vide. */
export function resetToastsForTests(): void {
  queue = []
  nextId = 1
  listeners.clear()
}
