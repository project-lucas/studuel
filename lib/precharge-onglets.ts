import { NAV_TABS, tabIndexForPath } from '@/lib/nav-tabs'

/**
 * LE PRÉCHARGEMENT DES ONGLETS — la règle, pure et testée. Le composant
 * `components/PrechargeurOnglets.tsx` ne fait que l'appliquer.
 *
 * Le constat, mesuré en production le 03/09/2026 : chaque onglet est une page
 * entièrement dynamique, et un onglet jamais visité coûte un aller-retour
 * serveur (120 à 600 ms quand la fonction est chaude, bien plus à froid) plus
 * deux ou trois morceaux de JavaScript, AVANT que l'élève ne voie autre chose
 * qu'un squelette. Duolingo n'a pas ce temps mort : ses onglets sont déjà en
 * mémoire quand on les touche.
 *
 * L'app avait déjà essayé de précharger — et s'était saturée elle-même
 * (cinq liens préchargés d'un coup au montage, plus les deux voisins du
 * balayage : /tresor rendu quatre fois en une seconde, des 503). La leçon
 * n'est pas « ne jamais précharger », c'est « précharger UN onglet à la fois,
 * une fois la page courante peinte, et seulement quand ça sert ». D'où ces
 * quatre règles :
 *
 *   1. On attend que le premier écran soit peint (lib/app-ready) puis un délai :
 *      la page courante passe toujours avant les suivantes.
 *   2. Les onglets partent UN PAR UN, espacés : jamais de rafale.
 *   3. On ne précharge que depuis un onglet, l'app visible, l'élève actif. Pas
 *      pendant un quiz, pas pour un téléphone posé sur la table, pas dans un
 *      onglet de navigateur caché.
 *   4. La fraîcheur est tranchée par le cache du routeur (staleTimes) : un
 *      onglet encore frais ne coûte AUCUNE requête, la ronde périodique ne
 *      relance donc que ce qui a expiré.
 */

/** Le préchargement complet — la page entière, pas seulement son squelette. */
export const PRECHARGEMENT_COMPLET = 'full'

/** Délai après « premier écran peint » avant le premier onglet préchargé. */
export const DELAI_PREMIER_PRECHARGEMENT_MS = 1_200

/** Délai après un changement d'onglet avant de précharger ses voisins. */
export const DELAI_APRES_NAVIGATION_MS = 800

/** Espacement entre deux onglets préchargés : un à la fois, jamais en rafale. */
export const ESPACEMENT_MS = 400

/**
 * Cadence de la ronde de fraîcheur. Le cache du routeur garde une page
 * dynamique 120 s (`staleTimes.dynamic`, next.config.ts) : une ronde toutes
 * les 45 s rattrape une expiration en moins d'une minute, et ne coûte rien
 * tant que tout est frais.
 */
export const CADENCE_RONDE_MS = 45_000

/** Sans geste de l'élève depuis ce délai, on cesse : le téléphone est posé. */
export const INACTIVITE_MAX_MS = 3 * 60_000

/** Après une invalidation (action serveur), on laisse retomber la poussière. */
export const DELAI_APRES_INVALIDATION_MS = 3_000

/**
 * Les autres onglets, du plus probable au moins probable :
 *   1. les deux voisins de balayage (le geste le plus naturel),
 *   2. l'arène `/defi`, centre de la barre et accueil de l'app,
 *   3. le reste, dans l'ordre de la barre.
 * Vide hors des onglets principaux : rien n'est préchargé depuis un quiz, un
 * cours ou l'onboarding.
 */
export function ongletsAPrecharger(pathname: string): string[] {
  const index = tabIndexForPath(pathname)
  if (index < 0) return []

  const courant = NAV_TABS[index].path
  const ordre: string[] = []
  const ajouter = (path: string | undefined) => {
    if (path && path !== courant && !ordre.includes(path)) ordre.push(path)
  }

  ajouter(NAV_TABS[index + 1]?.path)
  ajouter(NAV_TABS[index - 1]?.path)
  ajouter(NAV_TABS.find((tab) => tab.center)?.path)
  for (const tab of NAV_TABS) ajouter(tab.path)

  return ordre
}

export type ContexteDePrechargement = {
  /** Route courante. */
  pathname: string
  /** L'onglet du navigateur est-il visible ? */
  visible: boolean
  /** Horodatage (ms) du dernier geste de l'élève. */
  derniereActiviteMs: number
  /** Maintenant (ms). */
  nowMs: number
}

/**
 * Faut-il précharger maintenant ? Oui seulement depuis un onglet principal,
 * l'app visible, et un élève actif récemment.
 */
export function doitPrecharger({
  pathname,
  visible,
  derniereActiviteMs,
  nowMs,
}: ContexteDePrechargement): boolean {
  if (!visible) return false
  if (tabIndexForPath(pathname) < 0) return false
  return nowMs - derniereActiviteMs <= INACTIVITE_MAX_MS
}

/**
 * Le plan d'une liste : chaque route avec son retard de départ, de la première
 * (`delaiInitialMs`) à la dernière, espacées de `ESPACEMENT_MS`.
 */
export function planifierListe(
  hrefs: string[],
  delaiInitialMs: number,
): Array<{ href: string; retardMs: number }> {
  return hrefs.map((href, i) => ({
    href,
    retardMs: delaiInitialMs + i * ESPACEMENT_MS,
  }))
}

/** Le plan d'une ronde d'onglets, depuis la route courante. */
export function planifierRonde(
  pathname: string,
  delaiInitialMs: number,
): Array<{ href: string; retardMs: number }> {
  return planifierListe(ongletsAPrecharger(pathname), delaiInitialMs)
}

/**
 * LES DOSSIERS DE MATIÈRE. Depuis Réviser, les premiers dossiers de la grille
 * sont préchargés à leur tour — après les onglets, qui passent d'abord : le
 * premier onglet part à `DELAI_PREMIER_PRECHARGEMENT_MS`, le dernier des quatre
 * trois espacements plus tard ; les dossiers prennent la suite avec une marge.
 */
export const DOSSIERS_PRECHARGES = 3
export const DELAI_PREMIER_DOSSIER_MS =
  DELAI_PREMIER_PRECHARGEMENT_MS + 4 * ESPACEMENT_MS + 600

/** Les dossiers à précharger, dans l'ordre de la grille : les premiers. */
export function dossiersAPrecharger(slugs: string[]): string[] {
  return slugs.slice(0, DOSSIERS_PRECHARGES).map((slug) => `/reviser/${slug}`)
}
