// Onglets principaux — source unique pour la barre du bas (Navigation) et le
// balayage horizontal (SwipeTabs). L'ordre du tableau = l'ordre à l'écran,
// donc l'ordre du geste : balayer vers la gauche va vers l'onglet suivant.
/**
 * Clé d'icône (trait minimaliste). Volontairement du TEXTE et non un composant
 * React : `lib/` reste pur et testable, la correspondance clé → dessin vit dans
 * `components/Navigation.tsx`.
 */
export type NavIconName = 'users' | 'house' | 'swords' | 'user' | 'crown'

/**
 * Rôle de l'onglet dans la direction artistique : `action` = violet (le geste),
 * `recompense` = jaune solaire (ce qu'on gagne). Le rôle ne pilote QUE la teinte
 * du remplissage de l'icône active — jamais, à lui seul, l'état actif.
 */
export type NavTabRole = 'action' | 'recompense'

export type NavTab = {
  name: string
  path: string
  icon: NavIconName
  role: NavTabRole
  center?: boolean
}

export const NAV_TABS: NavTab[] = [
  // 5 onglets, Défi au centre. L'ancien onglet Coffre a fusionné dans Trésor
  // (/coffre redirige) : une seule destination « récompense » — le côté achat
  // (coffre du jour, boutique, collection) ET le côté abonnement.
  { name: 'Amis', path: '/amis', icon: 'users', role: 'action' },
  { name: 'Réviser', path: '/reviser', icon: 'house', role: 'action' },
  { name: 'Défi', path: '/defi', icon: 'swords', role: 'action', center: true },
  { name: 'Moi', path: '/moi', icon: 'user', role: 'action' },
  { name: 'Trésor', path: '/tresor', icon: 'crown', role: 'recompense' },
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
