// Tour guidé « premiers pas » : les étapes (contenu) et la géométrie pure
// (spotlight + position de bulle) du composant TourGuide. Tout ce qui se
// calcule est ici, testable sans DOM.

import { decouverteParCle } from '@/lib/decouverte/catalogue'

export type TourStep = {
  id: string
  // Valeur de l'attribut data-tour de l'élément à surligner ; null = pas de
  // spotlight (bulle centrée, ex. l'étape de bienvenue).
  target: string | null
  title: string
  text: string
}

/**
 * LES PREMIERS PAS (25/10/2026, cadrage « le jeu vivant » § E). Le tour en
 * sept bulles passait en revue les cinq onglets — dont trois que la
 * découverte progressive ferme à un nouveau compte. Il ne montre plus que ce
 * qu'on a sous la main le premier jour : Réviser, la série, les quêtes, puis
 * Marcel. Les trois bulles de Réviser sont CELLES DU CATALOGUE (la découverte
 * `reviser`) : une seule source pour ses mots. Les autres fonctionnalités se
 * présentent elles-mêmes, le jour où leur niveau les ouvre (mini-tours de
 * components/decouverte/DecouverteVeille).
 *
 * Toutes les cibles vivent sur /reviser (barre d'onglets comprise) : pas de
 * navigation à gérer. Une étape dont la cible est absente au moment du tour
 * est sautée (cf. nextAvailableStep).
 */
const REVISER = decouverteParCle('reviser')

export const TOUR_STEPS: TourStep[] = [
  {
    id: 'bienvenue',
    target: null,
    title: 'Bienvenue sur Studuel 👋',
    text: 'Fais le tour en 20 secondes : on te montre par où commencer.',
  },
  ...(REVISER?.etapes ?? []).map((e) => ({
    id: e.cible ?? 'reviser',
    target: e.cible,
    title: e.titre,
    text: e.texte,
  })),
  {
    id: 'marcel',
    target: 'marcel-fab',
    title: 'Marcel, ton coach',
    text: 'Une question, un exercice qui bloque ? Marcel t’explique, sans donner la réponse toute faite.',
  },
]

export type Rect = { top: number; left: number; width: number; height: number }
export type Size = { width: number; height: number }

// Marge du halo autour de la cible et marge de sécurité au bord de l'écran.
export const SPOTLIGHT_PADDING = 8
export const EDGE_MARGIN = 12

/** Rectangle du spotlight : la cible + une marge, borné au viewport. */
export function spotlightRect(
  target: Rect,
  viewport: Size,
  padding: number = SPOTLIGHT_PADDING,
): Rect {
  const left = Math.max(0, target.left - padding)
  const top = Math.max(0, target.top - padding)
  const right = Math.min(viewport.width, target.left + target.width + padding)
  const bottom = Math.min(viewport.height, target.top + target.height + padding)
  return { top, left, width: right - left, height: bottom - top }
}

/**
 * Position de la bulle : sous la cible si la place existe, sinon au-dessus,
 * centrée horizontalement sur la cible et toujours ramenée dans l'écran.
 * Sans cible (étape de bienvenue) : centrée dans le viewport.
 */
export function bubblePosition(
  target: Rect | null,
  bubble: Size,
  viewport: Size,
): { top: number; left: number } {
  if (!target) {
    return {
      top: Math.max(EDGE_MARGIN, (viewport.height - bubble.height) / 2),
      left: Math.max(EDGE_MARGIN, (viewport.width - bubble.width) / 2),
    }
  }

  const gap = SPOTLIGHT_PADDING + 8
  const below = target.top + target.height + gap
  const fitsBelow = below + bubble.height + EDGE_MARGIN <= viewport.height
  const top = fitsBelow
    ? below
    : Math.max(EDGE_MARGIN, target.top - gap - bubble.height)

  const centered = target.left + target.width / 2 - bubble.width / 2
  const left = Math.min(
    Math.max(EDGE_MARGIN, centered),
    Math.max(EDGE_MARGIN, viewport.width - bubble.width - EDGE_MARGIN),
  )

  return { top, left }
}

/**
 * Prochaine étape existante à partir de `from` (incluse), dans la direction
 * donnée, en sautant celles dont la cible est absente de l'écran (ex. la file
 * du jour vide chez un nouvel élève). Renvoie null quand on sort du tour.
 */
export function nextAvailableStep(
  steps: TourStep[],
  hasTarget: (target: string) => boolean,
  from: number,
  direction: 1 | -1 = 1,
): number | null {
  for (let i = from; i >= 0 && i < steps.length; i += direction) {
    const step = steps[i]
    if (step.target === null || hasTarget(step.target)) return i
  }
  return null
}

/**
 * Les bulles d'un MINI-TOUR de découverte : une bulle d'annonce centrée
 * (« Nouveau : … », toujours affichée, même quand aucune ancre n'est à
 * l'écran) puis les étapes du catalogue, qui se sautent comme les autres.
 */
export function etapesDeDecouverte(d: {
  cle: string
  nom: string
  phrase: string
  etapes: readonly { cible: string | null; titre: string; texte: string }[]
}): TourStep[] {
  return [
    { id: `${d.cle}-nouveau`, target: null, title: `Nouveau : ${d.nom}`, text: d.phrase },
    ...d.etapes.map((e, i) => ({
      id: `${d.cle}-${e.cible ?? i}`,
      target: e.cible,
      title: e.titre,
      text: e.texte,
    })),
  ]
}
