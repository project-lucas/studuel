// LE DERNIER RÉSULTAT du test de niveau en orthographe.
//
// Rangé en LOCAL, comme les records des jeux de salon (`lib/jeux/records`) et
// pour la même raison : rien à rapprocher côté serveur tant que le résultat ne
// pilote pas l'entraînement. Le jour où il le pilotera, il lui faudra une table
// et une migration — ce sera un chantier à part, et ce fichier restera le seul
// endroit à retoucher.
//
// Ce qui est gardé tient en trois champs : le pourcentage (ce que l'élève
// lit), le palier atteint (ce qui sert à calibrer), et la date (un test de
// positionnement vieux de six mois ne dit plus rien du niveau d'aujourd'hui).

import type { Palier } from '@/lib/francais/niveau-orthographe'

export const NIVEAU_KEY = 'studuel-francais-niveau-orthographe'

export type NiveauEnregistre = {
  pourcentage: number
  niveau: Palier | null
  /** Clé de jour UTC `YYYY-MM-DD`, comme partout dans l'app (cf. lib/time). */
  jour: string
}

const PALIERS_VALIDES = ['fondamentaux', 'confirme', 'expert']

/**
 * Relit un instantané brut. TOUT ce qui n'est pas exactement à la bonne forme
 * rend `null` : le stockage local est éditable par n'importe qui, et un
 * pourcentage à 900 ou un palier inventé s'afficherait tel quel sur la carte.
 * Fonction pure, pour être testée sans navigateur.
 */
export function parseNiveau(brut: string | null): NiveauEnregistre | null {
  if (!brut) return null
  try {
    const o = JSON.parse(brut) as Partial<NiveauEnregistre>
    // Le TYPE d'abord, la valeur ensuite. `Number(null)` vaut 0, et 0 est un
    // pourcentage parfaitement valide : un champ absent — ou un NaN, que
    // `JSON.stringify` écrit `null` — passerait alors pour un test à zéro.
    const p = o?.pourcentage
    if (typeof p !== 'number' || !Number.isFinite(p) || p < 0 || p > 100)
      return null
    if (typeof o?.jour !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(o.jour))
      return null
    const niveau =
      o?.niveau && PALIERS_VALIDES.includes(o.niveau) ? o.niveau : null
    return { pourcentage: Math.round(p), niveau, jour: o.jour }
  } catch {
    return null
  }
}

/** Le dernier résultat, ou `null` si le test n'a jamais été passé. */
export function readNiveau(): NiveauEnregistre | null {
  if (typeof window === 'undefined') return null
  try {
    return parseNiveau(window.localStorage.getItem(NIVEAU_KEY))
  } catch {
    return null
  }
}

/** Range un résultat. Échec silencieux : un test réussi ne doit jamais planter. */
export function writeNiveau(valeur: NiveauEnregistre): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(NIVEAU_KEY, JSON.stringify(valeur))
    // Le stockage local ne prévient pas l'onglet qui écrit — seulement les
    // autres. Sans cet événement, la carte derrière le test garderait l'ancien
    // score jusqu'au prochain rechargement.
    window.dispatchEvent(new Event('studuel:niveau-orthographe'))
  } catch {
    /* navigation privée, quota plein : on continue sans mémoire */
  }
}
