// Onglets principaux — source unique pour la barre du bas (Navigation) et le
// balayage horizontal (SwipeTabs). L'ordre du tableau = l'ordre à l'écran,
// donc l'ordre du geste : balayer vers la gauche va vers l'onglet suivant.
/**
 * Clé d'icône. Volontairement du TEXTE et non un composant React ni un chemin
 * de fichier : `lib/` reste pur et testable, la correspondance clé → dessin vit
 * dans `components/Navigation.tsx`.
 *
 * Les cinq onglets portent des ILLUSTRATIONS (public/images/nav), pas des traits
 * — même famille que l'écu et le cristal du HUD. Chaque onglet se reconnaît à sa
 * SILHOUETTE, avant même la couleur : trophée, livre, épées croisées, avatar en
 * couronne, bourse. Le trait uniforme d'avant ne les distinguait que par leur
 * nombre de silhouettes, ce qui obligeait à lire le libellé — donc à ne plus
 * rien gagner à l'illustration.
 *
 * `moi` est à part : le fichier n'est que le REPLI (un buste dessiné). L'onglet
 * affiche normalement le vrai avatar de l'élève, entouré de la couronne de
 * laurier `cadre-avatar.webp`.
 */
export type NavIconName = 'amis' | 'reviser' | 'defi' | 'moi' | 'tresor'

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
  // 5 onglets, Défi au centre. L'ancien onglet Coffre a fusionné dans Trésor
  // (/coffre redirige) : une seule destination « récompense » — le côté achat
  // (coffre du jour, boutique, collection) ET le côté abonnement.
  //
  // Marcel N'EST PLUS un onglet. Il en portait un, entre Réviser et Défi, mais
  // six destinations à trancher en bas d'écran, c'est une de trop : la barre se
  // lisait comme un menu. Le coach se rejoint maintenant par sa TÊTE, en bouton
  // flottant sur Réviser (`components/reviser/MarcelFab`) — au plus près de
  // l'endroit où l'on travaille, puisqu'il dit quoi faire et que Réviser est où
  // on le fait. La page `/marcel` est inchangée, et tous les liens qui y mènent
  // (le point du jour, la matière du moment de Moi) fonctionnent toujours.
  //
  // L'ORDRE EST CELUI DE CLASH ROYALE, et il se lit par l'ERGONOMIE du pouce,
  // pas par la logique du plan de l'app. Sur un téléphone tenu d'une main, le
  // centre est le point le plus atteignable, puis le bas-DROIT ; le bas-gauche
  // est le plus dur. On range donc les onglets par ce qu'on veut que l'élève
  // CROISE, et non par ce qu'il est censé consulter :
  //
  //   Boutique — à l'extrême bord, comme la boutique de Clash Royale. C'est le
  //     seul écran où l'on va AVEC UNE INTENTION (j'ai des écus à dépenser) :
  //     il doit être trouvable, pas réflexe. Il occupait le bas-droit, c'est
  //     à dire la meilleure place de la barre, sans en avoir besoin.
  //   Réviser — collé au Défi, à sa gauche. « Je révise » puis « je me mesure »
  //     est l'enchaînement le plus fréquent de l'app : il doit coûter un swipe.
  //   Défi — le centre, et l'écran d'atterrissage (`app/page.tsx` renvoie `/`
  //     vers `/defi`). Le repère qui ne bouge jamais.
  //   Amis — collé au Défi, à sa droite, là où Clash Royale met le clan. Le
  //     classement est la mécanique de RÉTENTION (« Top 2 % des 3e ») : elle ne
  //     produit son effet que si l'élève la croise. Elle était au coin le plus
  //     dur de l'écran, donc à aller chercher — c'est à dire nulle part.
  //   Moi — le miroir, qu'on consulte posément et rarement : il supporte le
  //     coin le moins accessible sans rien perdre.
  //
  // Les deux voisins immédiats du Défi sont donc les deux moitiés de la boucle
  // (travailler | se mesurer), et ce sont eux que le balayage horizontal donne.
  //
  // « Boutique » et non « Trésor » : l'onglet DIT ce qu'on y fait (dépenser)
  // plutôt que ce qu'on y possède. « Trésor » se lisait comme un coffre-fort —
  // un endroit où l'on range — et l'élève n'y allait pas. Le chemin reste
  // `/tresor` : c'est l'URL qui circule dans l'app, dans les notifications et
  // dans les liens déjà partagés.
  { name: 'Boutique', path: '/tresor', icon: 'tresor' },
  { name: 'Réviser', path: '/reviser', icon: 'reviser' },
  { name: 'Défi', path: '/defi', icon: 'defi', center: true },
  { name: 'Amis', path: '/amis', icon: 'amis' },
  { name: 'Moi', path: '/moi', icon: 'moi' },
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
