// LES DEUX VOLUMES DE L'APP (05/11/2026) — la musique et les effets.
//
// Lucas : « il faut aussi pouvoir réduire le son ou le couper ». Couper, les
// interrupteurs « Effets » (lib/sounds) et « Musique » (lib/musique) le font
// déjà ; ces deux curseurs BAISSENT sans couper. 100 % = le niveau d'avant
// (rien ne change pour qui ne touche à rien), 0 % = muet.
//
// Gardés dans le navigateur, comme les interrupteurs : c'est un réglage de
// L'APPAREIL (on baisse son téléphone en classe, pas son ordinateur), et le
// rendu serveur ne le voit pas.

export type Canal = 'musique' | 'effets'

export const VOLUME_DEFAUT = 1

const CLES: Record<Canal, string> = {
  musique: 'studuel-volume-musique',
  effets: 'studuel-volume-effets',
}

/** Un volume lu du stockage : entre 0 et 1, le défaut si absent ou illisible. Pure. */
export function lireVolume(brut: string | null): number {
  if (brut === null || brut.trim() === '') return VOLUME_DEFAUT
  const v = Number(brut)
  if (!Number.isFinite(v)) return VOLUME_DEFAUT
  return Math.min(1, Math.max(0, v))
}

/** Le pourcentage affiché sous le curseur (« 70 % »). Pure. */
export function pourcentVolume(v: number): number {
  return Math.round(Math.min(1, Math.max(0, v)) * 100)
}

type Abonne = () => void
const abonnes = new Set<Abonne>()

export function getVolume(canal: Canal): number {
  if (typeof window === 'undefined') return VOLUME_DEFAUT
  try {
    return lireVolume(window.localStorage.getItem(CLES[canal]))
  } catch {
    return VOLUME_DEFAUT
  }
}

export function setVolume(canal: Canal, v: number): void {
  try {
    window.localStorage.setItem(CLES[canal], String(lireVolume(String(v))))
  } catch {
    // Stockage bloqué : le réglage ne survivra pas au rechargement.
  }
  for (const a of abonnes) a()
}

/** Contrat `useSyncExternalStore` ; prévient aussi d'un changement venu d'un autre onglet. */
export function subscribeVolume(abonne: Abonne): () => void {
  abonnes.add(abonne)
  const surStorage = (e: StorageEvent) => {
    if (e.key === null || e.key === CLES.musique || e.key === CLES.effets) abonne()
  }
  window.addEventListener('storage', surStorage)
  return () => {
    abonnes.delete(abonne)
    window.removeEventListener('storage', surStorage)
  }
}

export function getVolumeServer(): number {
  return VOLUME_DEFAUT
}
