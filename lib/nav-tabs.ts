// Onglets principaux — source unique pour la barre du bas (Navigation) et le
// balayage horizontal (SwipeTabs). L'ordre du tableau = l'ordre à l'écran,
// donc l'ordre du geste : balayer vers la gauche va vers l'onglet suivant.
export type NavTab = {
  name: string
  path: string
  img: string
  center?: boolean
}

export const NAV_TABS: NavTab[] = [
  { name: 'Amis', path: '/amis', img: '/images/nav/amis.webp' },
  { name: 'Réviser', path: '/reviser', img: '/images/nav/reviser.webp' },
  { name: 'Défi', path: '/defi', img: '/images/nav/defi-3.webp', center: true },
  { name: 'Moi', path: '/moi', img: '/images/nav/moi.webp' },
  { name: 'Trésor', path: '/tresor', img: '/images/nav/tresor-3.webp' },
]

/** Index de l'onglet courant, -1 si on n'est pas sur un onglet principal. */
export function tabIndexForPath(pathname: string): number {
  return NAV_TABS.findIndex(
    (tab) => pathname === tab.path || pathname.startsWith(`${tab.path}/`),
  )
}

/**
 * Onglet voisin dans la direction du balayage.
 * `left` = le doigt part vers la gauche = on avance vers l'onglet de droite.
 * Renvoie null aux extrémités, ou hors des onglets principaux.
 */
export function neighborTabPath(
  pathname: string,
  direction: 'left' | 'right',
): string | null {
  const index = tabIndexForPath(pathname)
  if (index < 0) return null

  const target = direction === 'left' ? index + 1 : index - 1
  return NAV_TABS[target]?.path ?? null
}
