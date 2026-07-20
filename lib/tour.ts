// Tour guidé post-onboarding : les étapes (contenu) et la géométrie pure
// (spotlight + position de bulle) du composant TourGuide. Tout ce qui se
// calcule est ici, testable sans DOM.

export type TourStep = {
  id: string
  // Valeur de l'attribut data-tour de l'élément à surligner ; null = pas de
  // spotlight (bulle centrée, ex. l'étape de bienvenue).
  target: string | null
  title: string
  text: string
}

// Les 8 étapes validées : une par onglet + les 3 fonctionnalités phares
// (file SRS, Mon carnet, Match classé — porté par l'étape Défi). Toutes les
// cibles vivent sur /reviser (bottom nav incluse) : pas de navigation à gérer.
export const TOUR_STEPS: TourStep[] = [
  {
    id: 'bienvenue',
    target: null,
    title: 'Bienvenue sur Studuel 👋',
    text: 'Fais le tour en 30 secondes : on te montre où tout se trouve.',
  },
  {
    id: 'reviser',
    target: 'tab-reviser',
    title: 'Réviser',
    text: 'Ton programme, tes cours et ta file du jour — c’est ici que tout commence.',
  },
  {
    id: 'file-du-jour',
    target: 'file-du-jour',
    title: 'À revoir aujourd’hui',
    text: 'Chaque jour, l’app te ressert pile ce que tu risques d’oublier. 5 minutes suffisent.',
  },
  {
    id: 'carnet',
    target: 'carnet-switch',
    title: 'Mon carnet',
    text: 'Crée tes propres cours et questions, et révise-les comme le reste.',
  },
  {
    id: 'defi',
    target: 'tab-defi',
    title: 'Défi',
    text: 'Duels et match classé : gagne des trophées en répondant plus vite que les autres.',
  },
  {
    id: 'amis',
    target: 'tab-amis',
    title: 'Amis',
    text: 'Ton équipe, ton école et vos classements.',
  },
  {
    id: 'moi',
    target: 'tab-moi',
    title: 'Moi',
    text: 'Ta capacité, ta trajectoire et tes leviers de la semaine.',
  },
  {
    id: 'tresor',
    target: 'tab-tresor',
    title: 'Trésor',
    text: 'Débloque tout Studuel, sans limite. C’est parti !',
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
