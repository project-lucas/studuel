// Onglets principaux — source unique pour la barre du bas (Navigation) et le
// balayage horizontal (SwipeTabs). L'ordre du tableau = l'ordre à l'écran,
// donc l'ordre du geste : balayer vers la gauche va vers l'onglet suivant.
/**
 * Clé d'icône. Volontairement du TEXTE et non un composant React ni un chemin
 * de fichier : `lib/` reste pur et testable, la correspondance clé → dessin vit
 * dans `components/Navigation.tsx`.
 *
 * Les six onglets portent des ILLUSTRATIONS (public/images/nav), pas des traits
 * — même famille que l'écu et le cristal du HUD. Chaque onglet se reconnaît à sa
 * SILHOUETTE, avant même la couleur : trophée, livre, visage du coach, épées
 * croisées, avatar en couronne, bourse. Le trait uniforme d'avant ne les
 * distinguait que par leur nombre de silhouettes, ce qui obligeait à lire le
 * libellé — donc à ne plus rien gagner à l'illustration.
 *
 * `moi` est à part : le fichier n'est que le REPLI (un buste dessiné). L'onglet
 * affiche normalement le vrai avatar de l'élève, entouré de la couronne de
 * laurier `cadre-avatar.webp`.
 */
export type NavIconName =
  | 'amis'
  | 'reviser'
  | 'marcel'
  | 'defi'
  | 'moi'
  | 'tresor'

// Il n'y a plus de `role` ici. Il teintait le remplissage de l'icône active
// (violet pour l'action, jaune pour la récompense) du temps où les onglets
// étaient des traits monochromes. Les illustrations portent leurs propres
// couleurs — le coffre est déjà doré, le livre déjà violet — et une teinte
// imposée par-dessus ne ferait que les salir.
export type NavTab = {
  name: string
  path: string
  icon: NavIconName
  center?: boolean
}

export const NAV_TABS: NavTab[] = [
  // 6 onglets, Défi au centre. L'ancien onglet Coffre a fusionné dans Trésor
  // (/coffre redirige) : une seule destination « récompense » — le côté achat
  // (coffre du jour, boutique, collection) ET le côté abonnement.
  //
  // Marcel est posé ENTRE Réviser et Défi, à gauche de l'orbe : il dit quoi
  // faire et pourquoi, Réviser est l'endroit où on le fait. Les deux voisinent
  // parce qu'on passe de l'un à l'autre en permanence.
  { name: 'Amis', path: '/amis', icon: 'amis' },
  { name: 'Réviser', path: '/reviser', icon: 'reviser' },
  { name: 'Marcel', path: '/marcel', icon: 'marcel' },
  { name: 'Défi', path: '/defi', icon: 'defi', center: true },
  { name: 'Moi', path: '/moi', icon: 'moi' },
  { name: 'Trésor', path: '/tresor', icon: 'tresor' },
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
