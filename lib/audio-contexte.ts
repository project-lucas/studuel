// LE CONTEXTE AUDIO UNIQUE DE L'APP (05/11/2026).
//
// Les bips synthétisés (`lib/sounds`), les bruitages enregistrés
// (`lib/sons-studuel`) et la musique (`lib/musique`) passent par le MÊME
// AudioContext : un navigateur mobile en limite le nombre, et le débloquer au
// premier tap une fois suffit pour les trois.
//
// JAMAIS DE SON AVANT LE PREMIER TAP : le contexte peut être créé tôt (pour
// décoder les fichiers), il reste « suspended » tant que l'élève n'a rien
// touché — c'est le navigateur qui le garantit, et `aDejaInteragi` le dit au
// code qui voudrait lancer une musique.

let ctx: AudioContext | null = null

export function audioContexte(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const Ctor = window.AudioContext
    if (!Ctor) return null
    ctx = new Ctor()
  }
  if (ctx.state === 'suspended' && aDejaInteragi()) void ctx.resume()
  return ctx
}

/** L'élève a-t-il déjà touché la page (tap, clic, touche) ? */
export function aDejaInteragi(): boolean {
  if (typeof navigator === 'undefined') return false
  const activation = (navigator as Navigator & { userActivation?: { hasBeenActive: boolean } }).userActivation
  // Sans l'API (vieux Safari), on laisse le navigateur trancher : `resume()`
  // échoue sans bruit hors geste.
  return activation ? activation.hasBeenActive : true
}
