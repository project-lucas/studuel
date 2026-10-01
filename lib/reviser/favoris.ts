// -----------------------------------------------------------------------------
// LES THÈMES FAVORIS — dans le navigateur.
//
// L'étoile d'une tuile du Programme épingle un grand thème en tête de la
// grille. C'est un RANGEMENT personnel, pas un acquis : il ne donne ni XP ni
// gemmes, et il ne mérite ni table ni migration ni aller-retour réseau — même
// précédent que les fiches lues de l'encyclopédie (lib/encyclopedie/lues) et
// les étoiles des jeux de salon. Contrepartie assumée : le choix vit sur
// l'appareil, il ne suit pas l'élève d'un téléphone à un autre.
//
// Ce qui est stocké, ce sont les choix EXPLICITES (épinglé / retiré) par
// dossier (matière + classe) ; un thème où un contrôle est annoncé est favori
// d'office sans rien écrire ici (lib/reviser/programme.estFavori).
//
// `localStorage` lève en navigation privée ou quand les données de site sont
// bloquées : toute lecture et toute écriture passent par un try/catch, et
// l'écran s'affiche correctement sans rien.
// -----------------------------------------------------------------------------

import type { ChoixFavoris } from '@/lib/reviser/programme'

export const CLE_FAVORIS = 'studuel_programme_favoris'

/** Au-delà, un stockage gonflé ou trafiqué est ignoré plutôt que relu. */
export const MAX_DOSSIERS = 200

type Stock = Record<string, Record<string, boolean>>

const AUCUN_CHOIX: ChoixFavoris = Object.freeze({})

/** La clé d'un dossier : la matière et la classe dont on regarde le programme. */
export function cleDossier(subjectSlug: string, grade: string): string {
  return `${subjectSlug}|${grade}`
}

/**
 * Le contenu du stockage, décodé. Pur, et prêt à tout : une autre version de
 * l'app, un JSON tronqué, un tableau à la place d'un objet.
 */
export function parserFavoris(brut: string | null): Stock {
  if (!brut) return {}
  try {
    const valeur: unknown = JSON.parse(brut)
    if (!valeur || typeof valeur !== 'object' || Array.isArray(valeur)) return {}
    const stock: Stock = {}
    for (const [dossier, choix] of Object.entries(valeur).slice(0, MAX_DOSSIERS)) {
      if (!choix || typeof choix !== 'object' || Array.isArray(choix)) continue
      const propres: Record<string, boolean> = {}
      for (const [theme, epingle] of Object.entries(choix)) {
        if (typeof epingle === 'boolean') propres[theme] = epingle
      }
      stock[dossier] = propres
    }
    return stock
  } catch {
    return {}
  }
}

/** Le stock avec les choix d'un dossier remplacés — sans toucher à l'original. */
export function avecChoix(stock: Stock, dossier: string, choix: ChoixFavoris): Stock {
  return { ...stock, [dossier]: { ...choix } }
}

// --- L'enveloppe navigateur ----------------------------------------------------

function lireBrut(): string | null {
  try {
    return window.localStorage.getItem(CLE_FAVORIS)
  } catch {
    return null
  }
}

// `useSyncExternalStore` exige un instantané STABLE tant que rien n'a changé :
// on ne redécode que si la chaîne brute a bougé.
let dernierBrut: string | null | undefined
let dernierStock: Stock = {}
// Quand le navigateur REFUSE l'écriture (navigation privée, stockage plein),
// les choix vivent ici le temps de la visite : l'étoile doit répondre au doigt
// même si elle ne tiendra pas jusqu'à la prochaine fois.
let enMemoire: Stock | null = null

function stockCourant(): Stock {
  if (enMemoire) return enMemoire
  const brut = lireBrut()
  if (brut !== dernierBrut) {
    dernierBrut = brut
    dernierStock = parserFavoris(brut)
  }
  return dernierStock
}

const abonnes = new Set<() => void>()

/** S'abonner aux changements : ceux de cet onglet, et ceux d'un autre (`storage`). */
export function abonnerFavoris(prevenir: () => void): () => void {
  abonnes.add(prevenir)
  window.addEventListener('storage', prevenir)
  return () => {
    abonnes.delete(prevenir)
    window.removeEventListener('storage', prevenir)
  }
}

/** Les choix de l'élève pour un dossier (référence stable entre deux écritures). */
export function lireChoix(dossier: string): ChoixFavoris {
  return stockCourant()[dossier] ?? AUCUN_CHOIX
}

/** Côté serveur et à l'hydratation : aucun choix, la règle par défaut s'applique. */
export function choixServeur(): ChoixFavoris {
  return AUCUN_CHOIX
}

export function ecrireChoix(dossier: string, choix: ChoixFavoris): void {
  const suite = avecChoix(stockCourant(), dossier, choix)
  try {
    window.localStorage.setItem(CLE_FAVORIS, JSON.stringify(suite))
    enMemoire = null
  } catch {
    // Navigation privée, stockage plein : l'étoile ne tiendra pas d'une visite
    // à l'autre, et c'est tout ce qu'on perd — elle répond quand même.
    enMemoire = suite
  }
  for (const prevenir of abonnes) prevenir()
}
