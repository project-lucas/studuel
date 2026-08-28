// Où le bandeau du haut (TopHud) doit rester invisible — logique pure, partagée
// par le chargeur serveur et le composant client.
//
// DEUX VERDICTS, ET IL NE FAUT PAS LES CONFONDRE.
//
//   - `isHudHidden` dit s'il faut MASQUER le bandeau. Il est lu par le
//     composant CLIENT, donc réévalué à chaque navigation. C'est le seul qui
//     décide de l'affichage.
//
//   - `isHudDataSkipped` dit si le chargeur SERVEUR peut se dispenser de
//     l'authentification et des 5 requêtes Supabase. Il est volontairement
//     PLUS ÉTROIT, et ce n'est pas une négligence : le layout racine n'étant
//     pas re-rendu en navigation client, un bandeau sauté au rendu initial
//     n'existe pour le reste de la session. Économiser les requêtes sur une
//     route revient donc à dire « on ne reviendra pas de cette route sans
//     recharger la page ». Vrai de l'onboarding, qui se termine par une
//     redirection serveur. FAUX du quiz, qu'on quitte par un bouton — d'où
//     `/test/` présent dans le premier verdict et absent du second.

import { estChromeMasque, estOnboarding } from '@/lib/quiz-chrome'

/** Le bandeau du haut doit-il être masqué sur ce chemin ? */
export function isHudHidden(pathname: string): boolean {
  return estChromeMasque(pathname)
}

/**
 * Le chargeur serveur peut-il sauter ses requêtes ? Voir l'avertissement en
 * tête de fichier avant d'ajouter une route ici.
 */
export function isHudDataSkipped(pathname: string): boolean {
  return estOnboarding(pathname)
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
