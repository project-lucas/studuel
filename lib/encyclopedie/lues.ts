// -----------------------------------------------------------------------------
// LES FICHES DÉJÀ LUES — dans le navigateur, et nulle part ailleurs.
//
// Une coche sur une carte déjà ouverte : dans une liste de deux cents entrées,
// c'est ce qui permet de savoir où on en est sans compter. Ça ne mérite ni une
// table, ni une migration, ni un aller-retour réseau — c'est un confort de
// lecture, pas un acquis de progression (l'encyclopédie ne donne ni XP, ni
// gemmes, ni couronnes : on la lit parce qu'on est curieux).
//
// Même précédent que les étoiles des jeux de salon, qui vivent aussi dans le
// navigateur. Et mêmes précautions : `localStorage` lève en navigation privée
// ou quand les données de site sont bloquées, donc TOUTE lecture et TOUTE
// écriture passent par un try/catch, et l'écran doit s'afficher correctement
// avec une liste vide.
//
// Le cœur (`ajouterLue`) est pur et testé ; seule l'enveloppe touche au
// navigateur.
// -----------------------------------------------------------------------------

export const CLE_LUES = 'studuel_encyclopedie_lues'

/**
 * Combien de fiches on garde en mémoire. Deux cent cinquante suffisent à
 * couvrir le corpus entier ; la borne existe pour qu'un stockage corrompu ou
 * gonflé par une autre version ne grandisse pas sans fin.
 */
export const MAX_LUES = 400

/**
 * La liste mise à jour : la fiche lue passe EN TÊTE (c'est aussi l'historique
 * « reprendre où j'en étais »), sans doublon, bornée.
 */
export function ajouterLue(lues: readonly string[], id: string): string[] {
  const sansDoublon = lues.filter((autre) => autre !== id)
  return [id, ...sansDoublon].slice(0, MAX_LUES)
}

/**
 * Le contenu du stockage, décodé. Pur : c'est la partie qui se teste, et c'est
 * aussi celle qui doit survivre à n'importe quoi — une autre version de l'app,
 * un `localStorage` trafiqué à la console, un JSON tronqué.
 */
export function parserLues(brut: string | null): string[] {
  if (!brut) return []
  try {
    const valeur: unknown = JSON.parse(brut)
    if (!Array.isArray(valeur)) return []
    return valeur.filter((element): element is string => typeof element === 'string')
  } catch {
    return []
  }
}

/** La chaîne brute du stockage, ou `null` si le navigateur refuse de la donner. */
export function lireBrut(): string | null {
  try {
    return window.localStorage.getItem(CLE_LUES)
  } catch {
    return null
  }
}

/** Ce qu'on a lu, du plus récent au plus ancien. Vide si le stockage refuse. */
export function lireLues(): string[] {
  return parserLues(lireBrut())
}

/** Marque une fiche comme lue et rend la nouvelle liste. */
export function marquerLue(id: string): string[] {
  const misAJour = ajouterLue(lireLues(), id)
  try {
    window.localStorage.setItem(CLE_LUES, JSON.stringify(misAJour))
  } catch {
    // Navigation privée, stockage plein, données de site bloquées : la coche
    // ne suivra pas d'une visite à l'autre, et c'est tout ce qu'on perd.
  }
  return misAJour
}
