// Tour guidé : qui décide qu'il doit se lancer — logique pure, testée.
//
// LE PROBLÈME MESURÉ : la migration 188 (colonne `profiles.tutorial_completed`)
// n'est pas exécutée. Le code, prudent, ne lançait le tour que si la colonne
// disait explicitement « jamais vu ». Colonne absente → jamais `false` → **le
// tour ne se déclenchait jamais**. Une fonctionnalité entière, écrite, testée,
// invisible depuis des semaines.
//
// LA RÈGLE, dans cet ordre :
//   1. la BASE fait autorité dès qu'elle répond (`true` = déjà vu, `false` ou
//      `null` = jamais vu) — elle suit l'élève d'un appareil à l'autre ;
//   2. si la colonne n'existe pas encore, la MÉMOIRE LOCALE du navigateur
//      tranche. Le tour se lance donc aujourd'hui, sans attendre la migration,
//      et ne se relance pas à chaque visite.
//
// Le repli est volontairement local : il ne prétend pas remplacer la colonne
// (changer de téléphone rejouera le tour une fois), il évite juste qu'une
// migration en attente rende la fonctionnalité inexistante.

export const CLE_TOUR_VU = 'studuel.tour-guide.vu.v1'

/** Ce que la base répond : `undefined` = la colonne 188 n'existe pas. */
export type EtatTourEnBase = boolean | null | undefined

/** La base sait-elle répondre ? (sinon la mémoire locale prend le relais) */
export function baseFaitAutorite(etat: EtatTourEnBase): boolean {
  return etat !== undefined
}

export function tourDoitDemarrer(
  etatEnBase: EtatTourEnBase,
  vuEnLocal: boolean,
): boolean {
  if (etatEnBase === true) return false
  if (baseFaitAutorite(etatEnBase)) return true // false ou null : jamais vu
  return !vuEnLocal
}

// Lecture/écriture de la mémoire locale. Toujours enveloppées : un navigateur
// en navigation privée ou avec le stockage bloqué lève à l'accès, et ce serait
// absurde qu'un tutoriel casse la page d'accueil.
export function lireTourVu(storage?: Pick<Storage, 'getItem'>): boolean {
  try {
    const s = storage ?? globalThis.localStorage
    return s?.getItem(CLE_TOUR_VU) === '1'
  } catch {
    return false
  }
}

export function marquerTourVu(storage?: Pick<Storage, 'setItem'>): void {
  try {
    const s = storage ?? globalThis.localStorage
    s?.setItem(CLE_TOUR_VU, '1')
  } catch {
    // Stockage indisponible : le tour se represente au prochain passage. Moins
    // bien qu'une mémoire, infiniment mieux qu'une page blanche.
  }
}
