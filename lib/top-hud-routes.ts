// Où le bandeau du haut (TopHud) doit rester invisible — logique pure, partagée
// par le chargeur serveur et le composant client.
//
// Deux gardes, deux rôles :
//   - côté SERVEUR (TopHudLoader), elle évite de payer l'authentification + 5
//     requêtes Supabase pour un bandeau qui ne s'affichera pas ;
//   - côté CLIENT (TopHud), elle reste indispensable : le layout racine n'est
//     PAS re-rendu lors d'une navigation client, donc un élève qui arrive sur
//     /bienvenue depuis une autre page garde le bandeau déjà monté.

/** Parcours plein écran (façon Duolingo) : aucun bandeau. */
const HIDDEN_PREFIXES = ['/bienvenue'] as const

/** Le bandeau du haut doit-il être masqué sur ce chemin ? */
export function isHudHidden(pathname: string): boolean {
  return HIDDEN_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  )
}

/**
 * Sur l'écran d'arène (/defi exactement), la pastille « Niveau » du bandeau se
 * replie : l'arène porte déjà SA pastille niveau + barre d'XP (ProfileChip,
 * haut-gauche) et deux compteurs de niveau à quelques pixels d'écart se
 * contredisaient (anneau en % contre libellé 750/1000). Pièces et réglages
 * restent ; les sous-pages du Défi (/defi/jouer…) gardent le bandeau complet.
 */
export function isHudLevelHidden(pathname: string): boolean {
  return pathname === '/defi'
}

/**
 * Sur l'écran d'arène (/defi exactement), l'ENGRENAGE des réglages quitte le
 * bandeau : il a rejoint le menu burger de l'arène (façon Clash Royale), avec
 * l'historique, les classements et le tournoi. Le haut de l'écran est ainsi
 * rendu au jeu — pastille de niveau dans l'angle gauche, pièces à droite, et
 * le bandeau de saison au centre entre les deux. Les sous-pages du Défi
 * (/defi/jouer…) n'ont pas de burger : elles gardent l'engrenage.
 */
export function isHudAccountHidden(pathname: string): boolean {
  return pathname === '/defi'
}

/**
 * Routes dont le fond est une SCÈNE SOMBRE (l'arène et ses salles de jeu), par
 * opposition au fond crème du reste de l'app.
 *
 * Le bandeau y flottait en pastilles crème et jaune plein : posé sur le ciel
 * violet de l'arène, il se lisait comme de l'interface web collée sur une
 * illustration — la seule chose de l'écran qui n'avait pas l'air dessinée. Sur
 * ces routes, il prend le même matériau que le reste du HUD de jeu : le verre
 * de nuit hérité de l'écran de chargement (`.olympe-glass`), l'or réservé aux
 * VALEURS (chiffres, barres).
 */
export function isHudOverDarkScene(pathname: string): boolean {
  return pathname === '/defi' || pathname.startsWith('/defi/')
}
